/**
 * Core Memory Store Implementation
 */

import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '../utils/logger';
import {
  MemoryContent,
  MemoryRecord,
  MemoryQuery,
  Permission,
  AccessLevel,
  StoreOptions,
  RetrieveOptions,
  UpdateOptions,
  QueryOptions,
  SearchOptions,
  BatchStoreRequest,
  MemoryGrant,
  MemoryStats,
  MemoryChange,
  MemoryEvent,
  EventCallback,
  SDKConfig,
} from './types';
import { IAgentMemory } from './IAgentMemory';
import { WalrusAdapter } from '../adapters/WalrusAdapter';
import { SuiAdapter } from '../adapters/SuiAdapter';
import { EncryptionAdapter } from '../adapters/EncryptionAdapter';
import { CacheAdapter } from '../adapters/CacheAdapter';

export class MemoryStore implements IAgentMemory {
  private config: SDKConfig;
  private walrus: WalrusAdapter;
  private sui: SuiAdapter;
  private encryption: EncryptionAdapter;
  private cache: CacheAdapter | null;
  private eventListeners: Map<MemoryEvent, Set<EventCallback>>;
  private logger;
  private agentId: string;

  constructor(config: SDKConfig, agentId?: string) {
    this.config = config;
    this.agentId = agentId || `agent_${uuidv4().slice(0, 8)}`;
    this.logger = createLogger(`MemoryStore:${this.agentId}`);

    // Initialize adapters
    this.walrus = new WalrusAdapter(config.walrus);
    this.sui = new SuiAdapter(config.sui);
    this.encryption = new EncryptionAdapter(config.encryption);
    this.cache = config.cache ? new CacheAdapter(config.cache) : null;
    this.eventListeners = new Map();

    this.logger.info('MemoryStore initialized', {
      agentId: this.agentId,
      walrusEndpoint: config.walrus.endpoint,
    });
  }

  async store(
    key: string,
    content: MemoryContent,
    options?: StoreOptions
  ): Promise<MemoryRecord> {
    try {
      const id = `mem_${uuidv4()}`;
      const now = Date.now();

      // Prepare content with metadata
      const enrichedContent: MemoryContent = {
        ...content,
        timestamp: now,
        version: 1,
      };

      // Encrypt if needed
      let encryptedData = enrichedContent;
      let encrypted = false;
      if (options?.encrypted) {
        encryptedData = await this.encryption.encrypt(enrichedContent);
        encrypted = true;
      }

      // Upload to Walrus
      const walrusBlob = await this.walrus.upload(encryptedData, {
        encrypted: options?.encrypted,
      });

      // Calculate checksum
      const checksum = await this.calculateChecksum(enrichedContent);

      // Create memory record
      const record: MemoryRecord = {
        ...enrichedContent,
        id,
        owner: this.agentId,
        walrus_id: walrusBlob.blobId,
        encrypted,
        checksum,
        access_control: {
          public: options?.isPublic || false,
          grants: [],
        },
      };

      // Store metadata in Sui
      await this.sui.storeMemoryIndex(record);

      // Cache if enabled
      if (this.cache) {
        await this.cache.set(
          this.getCacheKey(key),
          record,
          options?.ttl
        );
      }

      // Emit event
      this.emit('stored', record);

      this.logger.info('Memory stored', {
        id,
        key,
        type: content.type,
        walrus_id: walrusBlob.blobId,
      });

      return record;
    } catch (error) {
      this.logger.error('Failed to store memory', { key, error });
      this.emit('error', { action: 'store', key, error });
      throw error;
    }
  }

  async retrieve(
    key: string,
    options?: RetrieveOptions
  ): Promise<MemoryContent | null> {
    try {
      // Try cache first
      if (this.cache) {
        const cached = await this.cache.get(this.getCacheKey(key));
        if (cached) {
          this.logger.debug('Cache hit', { key });
          return cached;
        }
      }

      // Retrieve from Sui (metadata)
      const record = await this.sui.getMemoryByKey(key, this.agentId);
      if (!record) {
        return null;
      }

      // Verify checksum if requested
      if (options?.verifyChecksum) {
        const calculatedChecksum = await this.calculateChecksum(record);
        if (calculatedChecksum !== record.checksum) {
          throw new Error('Checksum verification failed');
        }
      }

      // Retrieve actual data from Walrus
      if (record.walrus_id) {
        let content = await this.walrus.retrieve(record.walrus_id);

        // Decrypt if needed
        if (options?.decrypt && record.encrypted) {
          content = await this.encryption.decrypt(content);
        }

        // Cache the result
        if (this.cache) {
          await this.cache.set(this.getCacheKey(key), content);
        }

        this.emit('retrieved', { key, record });
        return content;
      }

      return record as MemoryContent;
    } catch (error) {
      this.logger.error('Failed to retrieve memory', { key, error });
      this.emit('error', { action: 'retrieve', key, error });
      throw error;
    }
  }

  async update(
    key: string,
    content: MemoryContent,
    options?: UpdateOptions
  ): Promise<MemoryRecord> {
    try {
      // Get existing record
      const existing = await this.sui.getMemoryByKey(key, this.agentId);
      if (!existing) {
        throw new Error(`Memory not found: ${key}`);
      }

      // Update content
      const updated: MemoryContent = {
        ...content,
        timestamp: options?.updateTimestamp ? Date.now() : existing.timestamp,
        version: options?.incrementVersion ? existing.version + 1 : existing.version,
      };

      // Encrypt if needed
      let encryptedData = updated;
      if (existing.encrypted) {
        encryptedData = await this.encryption.encrypt(updated);
      }

      // Upload to Walrus
      const walrusBlob = await this.walrus.upload(encryptedData);

      // Update Sui metadata
      const checksum = await this.calculateChecksum(updated);
      const record: MemoryRecord = {
        ...updated,
        id: existing.id,
        owner: this.agentId,
        walrus_id: walrusBlob.blobId,
        encrypted: existing.encrypted,
        checksum,
        access_control: existing.access_control,
      };

      await this.sui.updateMemoryIndex(record);

      // Invalidate cache
      if (this.cache) {
        await this.cache.delete(this.getCacheKey(key));
      }

      this.emit('updated', record);

      this.logger.info('Memory updated', { key, version: updated.version });

      return record;
    } catch (error) {
      this.logger.error('Failed to update memory', { key, error });
      this.emit('error', { action: 'update', key, error });
      throw error;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const existing = await this.sui.getMemoryByKey(key, this.agentId);
      if (!existing) {
        return false;
      }

      // Delete from Sui
      await this.sui.deleteMemoryIndex(existing.id);

      // Optionally delete from Walrus
      if (existing.walrus_id) {
        await this.walrus.delete(existing.walrus_id);
      }

      // Invalidate cache
      if (this.cache) {
        await this.cache.delete(this.getCacheKey(key));
      }

      this.emit('deleted', { key, id: existing.id });

      this.logger.info('Memory deleted', { key });

      return true;
    } catch (error) {
      this.logger.error('Failed to delete memory', { key, error });
      this.emit('error', { action: 'delete', key, error });
      throw error;
    }
  }

  async query(
    filter: MemoryQuery,
    options?: QueryOptions
  ): Promise<MemoryRecord[]> {
    try {
      const records = await this.sui.queryMemories(filter, this.agentId, options);
      return records;
    } catch (error) {
      this.logger.error('Failed to query memories', { filter, error });
      this.emit('error', { action: 'query', filter, error });
      throw error;
    }
  }

  async search(text: string, options?: SearchOptions): Promise<MemoryRecord[]> {
    try {
      // For now, delegate to Sui adapter
      // In production, could use dedicated search service
      const results = await this.sui.searchMemories(text, this.agentId, options);
      return results;
    } catch (error) {
      this.logger.error('Failed to search memories', { text, error });
      this.emit('error', { action: 'search', text, error });
      throw error;
    }
  }

  async batchStore(records: BatchStoreRequest[]): Promise<MemoryRecord[]> {
    try {
      const results: MemoryRecord[] = [];

      // Process in parallel with concurrency control
      const concurrency = 5;
      for (let i = 0; i < records.length; i += concurrency) {
        const batch = records.slice(i, i + concurrency);
        const batchResults = await Promise.all(
          batch.map(r =>
            this.store(r.key, r.content, r.options)
              .catch(error => {
                this.logger.error('Failed to store batch item', {
                  key: r.key,
                  error,
                });
                return null;
              })
          )
        );
        results.push(...batchResults.filter(Boolean) as MemoryRecord[]);
      }

      this.logger.info('Batch store completed', {
        total: records.length,
        success: results.length,
      });

      return results;
    } catch (error) {
      this.logger.error('Batch store failed', { error });
      throw error;
    }
  }

  async batchRetrieve(keys: string[]): Promise<Map<string, MemoryContent>> {
    try {
      const results = new Map<string, MemoryContent>();

      for (const key of keys) {
        try {
          const content = await this.retrieve(key);
          if (content) {
            results.set(key, content);
          }
        } catch (error) {
          this.logger.warn('Failed to retrieve item in batch', { key, error });
        }
      }

      return results;
    } catch (error) {
      this.logger.error('Batch retrieve failed', { error });
      throw error;
    }
  }

  async shareMemory(
    key: string,
    grantee: string,
    permissions: Permission[]
  ): Promise<MemoryGrant> {
    try {
      const existing = await this.sui.getMemoryByKey(key, this.agentId);
      if (!existing) {
        throw new Error(`Memory not found: ${key}`);
      }

      const grant = await this.sui.grantAccess(
        existing.id,
        grantee,
        permissions
      );

      this.emit('shared', { key, grantee, permissions });

      this.logger.info('Memory shared', {
        key,
        grantee,
        permissions,
      });

      return grant;
    } catch (error) {
      this.logger.error('Failed to share memory', { key, grantee, error });
      this.emit('error', { action: 'share', key, error });
      throw error;
    }
  }

  async grantAccess(grantId: string, accessLevel: AccessLevel): Promise<void> {
    // Implementation for granting access
    // This would typically interact with Sui contracts
    throw new Error('Not implemented');
  }

  async revokeAccess(grantId: string): Promise<boolean> {
    try {
      const result = await this.sui.revokeAccess(grantId);
      this.logger.info('Access revoked', { grantId });
      return result;
    } catch (error) {
      this.logger.error('Failed to revoke access', { grantId, error });
      throw error;
    }
  }

  on(event: MemoryEvent, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: MemoryEvent, callback: EventCallback): void {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  async getStats(): Promise<MemoryStats> {
    try {
      const stats = await this.sui.getMemoryStats(this.agentId);
      return stats;
    } catch (error) {
      this.logger.error('Failed to get stats', { error });
      throw error;
    }
  }

  async getHistory(key: string): Promise<MemoryChange[]> {
    try {
      const record = await this.sui.getMemoryByKey(key, this.agentId);
      if (!record) {
        return [];
      }

      const history = await this.sui.getMemoryHistory(record.id);
      return history;
    } catch (error) {
      this.logger.error('Failed to get history', { key, error });
      throw error;
    }
  }

  async clear(force?: boolean): Promise<boolean> {
    if (!force) {
      throw new Error('Must set force=true to clear all memories');
    }

    try {
      const all = await this.sui.getAllMemories(this.agentId);
      await Promise.all(all.map(m => this.delete(m.key || m.id)));
      this.logger.warn('All memories cleared');
      return true;
    } catch (error) {
      this.logger.error('Failed to clear memories', { error });
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.cache) {
      await this.cache.close();
    }
    this.logger.info('MemoryStore closed');
  }

  private emit(event: MemoryEvent, data: any): void {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback({
            type: event,
            data,
            timestamp: Date.now(),
          });
        } catch (error) {
          this.logger.error('Event callback error', { event, error });
        }
      });
    }
  }

  private getCacheKey(key: string): string {
    return `${this.agentId}:${key}`;
  }

  private async calculateChecksum(content: MemoryContent): Promise<string> {
    const data = JSON.stringify(content);
    return `sha256:${data.slice(0, 16)}${data.length}`;
  }
}
