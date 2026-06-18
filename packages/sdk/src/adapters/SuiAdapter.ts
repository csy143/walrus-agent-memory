/**
 * Sui Blockchain Adapter
 * Handles on-chain indexing and metadata storage
 */

import { createLogger } from '../utils/logger';
import {
  MemoryRecord,
  MemoryQuery,
  SuiConfig,
  MemoryStats,
  MemoryChange,
  Permission,
  MemoryGrant,
  QueryOptions,
  SearchOptions,
} from '../core/types';

// In production: import { SuiClient } from '@mysten/sui.js/client';
// For now, we'll use mock for development

export class SuiAdapter {
  private config: SuiConfig;
  private logger;
  // Local in-memory store for MVP
  // In production, would use SuiClient from @mysten/sui.js
  private memoryStore: Map<string, MemoryRecord>;
  private grantStore: Map<string, MemoryGrant>;
  private useRealSui: boolean;

  constructor(config: SuiConfig) {
    this.config = config;
    this.logger = createLogger('SuiAdapter');
    this.memoryStore = new Map();
    this.grantStore = new Map();

    // Check if using real Sui RPC
    this.useRealSui = config.rpcUrl.includes('fullnode') ||
                      config.rpcUrl.includes('testnet') ||
                      config.rpcUrl.includes('mainnet');

    this.logger.info('SuiAdapter initialized', {
      rpcUrl: config.rpcUrl,
      mode: this.useRealSui ? 'REAL' : 'MOCK',
      packageId: config.packageId,
    });
  }

  async storeMemoryIndex(record: MemoryRecord): Promise<void> {
    try {
      this.memoryStore.set(record.id, record);

      this.logger.info('Memory indexed on Sui', {
        id: record.id,
        owner: record.owner,
      });
    } catch (error) {
      this.logger.error('Failed to store memory index', { error });
      throw error;
    }
  }

  async getMemoryByKey(key: string, owner: string): Promise<MemoryRecord | null> {
    try {
      // Find by key and owner
      for (const record of this.memoryStore.values()) {
        // In real implementation, key would be stored in record
        if (record.owner === owner) {
          return record;
        }
      }
      return null;
    } catch (error) {
      this.logger.error('Failed to get memory by key', { key, error });
      throw error;
    }
  }

  async updateMemoryIndex(record: MemoryRecord): Promise<void> {
    try {
      this.memoryStore.set(record.id, record);

      this.logger.info('Memory index updated on Sui', {
        id: record.id,
        version: record.version,
      });
    } catch (error) {
      this.logger.error('Failed to update memory index', { error });
      throw error;
    }
  }

  async deleteMemoryIndex(id: string): Promise<void> {
    try {
      this.memoryStore.delete(id);

      this.logger.info('Memory index deleted on Sui', { id });
    } catch (error) {
      this.logger.error('Failed to delete memory index', { error });
      throw error;
    }
  }

  async queryMemories(
    filter: MemoryQuery,
    owner: string,
    options?: QueryOptions
  ): Promise<MemoryRecord[]> {
    try {
      let results = Array.from(this.memoryStore.values()).filter(
        r => r.owner === owner
      );

      // Apply filters
      if (filter.type) {
        const types = Array.isArray(filter.type) ? filter.type : [filter.type];
        results = results.filter(r => types.includes(r.type));
      }

      if (filter.importance) {
        results = results.filter(r => {
          const imp = r.metadata?.importance || 0;
          if (filter.importance?.$gte && imp < filter.importance.$gte) {
            return false;
          }
          if (filter.importance?.$lte && imp > filter.importance.$lte) {
            return false;
          }
          return true;
        });
      }

      if (filter.tags && filter.tags.length > 0) {
        results = results.filter(r => {
          const tags = r.metadata?.tags || [];
          return filter.tags!.some(t => tags.includes(t));
        });
      }

      // Apply sorting
      if (options?.sort) {
        results.sort((a, b) => {
          for (const sort of options.sort!) {
            let aVal: any, bVal: any;

            if (sort.field === 'importance') {
              aVal = a.metadata?.importance || 0;
              bVal = b.metadata?.importance || 0;
            } else if (sort.field === 'created_at') {
              aVal = a.timestamp;
              bVal = b.timestamp;
            }

            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            if (comparison !== 0) {
              return sort.order === 'asc' ? comparison : -comparison;
            }
          }
          return 0;
        });
      }

      // Apply pagination
      const offset = options?.offset || 0;
      const limit = options?.limit || 100;
      results = results.slice(offset, offset + limit);

      return results;
    } catch (error) {
      this.logger.error('Failed to query memories', { error });
      throw error;
    }
  }

  async searchMemories(
    text: string,
    owner: string,
    options?: SearchOptions
  ): Promise<MemoryRecord[]> {
    try {
      const results = Array.from(this.memoryStore.values()).filter(r => {
        if (r.owner !== owner) return false;

        // Simple text search in data
        const content = JSON.stringify(r.data).toLowerCase();
        return content.includes(text.toLowerCase());
      });

      if (options?.limit) {
        return results.slice(0, options.limit);
      }

      return results;
    } catch (error) {
      this.logger.error('Failed to search memories', { error });
      throw error;
    }
  }

  async grantAccess(
    memoryId: string,
    grantee: string,
    permissions: Permission[]
  ): Promise<MemoryGrant> {
    try {
      const grantId = `grant_${Date.now()}`;
      const grant: MemoryGrant = {
        id: grantId,
        memory_id: memoryId,
        grantor: 'unknown', // Would come from context
        grantee,
        permissions,
        granted_at: Date.now(),
        revoked: false,
      };

      this.grantStore.set(grantId, grant);

      this.logger.info('Access granted', {
        grantId,
        memoryId,
        grantee,
        permissions,
      });

      return grant;
    } catch (error) {
      this.logger.error('Failed to grant access', { error });
      throw error;
    }
  }

  async revokeAccess(grantId: string): Promise<boolean> {
    try {
      const grant = this.grantStore.get(grantId);
      if (grant) {
        grant.revoked = true;
        this.grantStore.set(grantId, grant);

        this.logger.info('Access revoked', { grantId });
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error('Failed to revoke access', { error });
      throw error;
    }
  }

  async getMemoryStats(owner: string): Promise<MemoryStats> {
    try {
      const memories = Array.from(this.memoryStore.values()).filter(
        m => m.owner === owner
      );

      const stats: MemoryStats = {
        total_memories: memories.length,
        total_size: memories.reduce((sum, m) => sum + JSON.stringify(m).length, 0),
        by_type: {},
        by_importance: {
          '1-3': 0,
          '4-6': 0,
          '7-10': 0,
        },
        oldest_memory: memories.length > 0 ? Math.min(...memories.map(m => m.timestamp)) : undefined,
        newest_memory: memories.length > 0 ? Math.max(...memories.map(m => m.timestamp)) : undefined,
      };

      // Count by type
      for (const m of memories) {
        stats.by_type[m.type] = (stats.by_type[m.type] || 0) + 1;

        // Count by importance
        const imp = m.metadata?.importance || 5;
        if (imp <= 3) stats.by_importance['1-3']++;
        else if (imp <= 6) stats.by_importance['4-6']++;
        else stats.by_importance['7-10']++;
      }

      return stats;
    } catch (error) {
      this.logger.error('Failed to get stats', { error });
      throw error;
    }
  }

  async getMemoryHistory(id: string): Promise<MemoryChange[]> {
    try {
      // For MVP, return empty history
      // In production, would track all changes
      return [
        {
          version: 1,
          changed_at: Date.now(),
          changed_by: 'system',
          changes: {
            created: true,
          },
        },
      ];
    } catch (error) {
      this.logger.error('Failed to get history', { error });
      throw error;
    }
  }

  async getAllMemories(owner: string): Promise<MemoryRecord[]> {
    try {
      return Array.from(this.memoryStore.values()).filter(m => m.owner === owner);
    } catch (error) {
      this.logger.error('Failed to get all memories', { error });
      throw error;
    }
  }
}
