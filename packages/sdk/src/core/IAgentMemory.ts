/**
 * Core Agent Memory Interface
 * Framework-agnostic interface for persistent memory
 */

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
} from './types';

export interface IAgentMemory {
  /**
   * Store a new memory record
   */
  store(
    key: string,
    content: MemoryContent,
    options?: StoreOptions
  ): Promise<MemoryRecord>;

  /**
   * Retrieve a memory record by key
   */
  retrieve(
    key: string,
    options?: RetrieveOptions
  ): Promise<MemoryContent | null>;

  /**
   * Update an existing memory record
   */
  update(
    key: string,
    content: MemoryContent,
    options?: UpdateOptions
  ): Promise<MemoryRecord>;

  /**
   * Delete a memory record
   */
  delete(key: string): Promise<boolean>;

  /**
   * Query memories with filters
   */
  query(filter: MemoryQuery, options?: QueryOptions): Promise<MemoryRecord[]>;

  /**
   * Full-text search across memories
   */
  search(text: string, options?: SearchOptions): Promise<MemoryRecord[]>;

  /**
   * Batch store multiple records
   */
  batchStore(records: BatchStoreRequest[]): Promise<MemoryRecord[]>;

  /**
   * Batch retrieve multiple records
   */
  batchRetrieve(keys: string[]): Promise<Map<string, MemoryContent>>;

  /**
   * Share memory with another agent
   */
  shareMemory(
    key: string,
    grantee: string,
    permissions: Permission[]
  ): Promise<MemoryGrant>;

  /**
   * Grant access to shared memory
   */
  grantAccess(grantId: string, accessLevel: AccessLevel): Promise<void>;

  /**
   * Revoke access to memory
   */
  revokeAccess(grantId: string): Promise<boolean>;

  /**
   * Listen for memory events
   */
  on(event: MemoryEvent, callback: EventCallback): void;

  /**
   * Stop listening for memory events
   */
  off(event: MemoryEvent, callback: EventCallback): void;

  /**
   * Get memory usage statistics
   */
  getStats(): Promise<MemoryStats>;

  /**
   * Get change history for a memory record
   */
  getHistory(key: string): Promise<MemoryChange[]>;

  /**
   * Clear all memories (with confirmation)
   */
  clear(force?: boolean): Promise<boolean>;

  /**
   * Close the memory store
   */
  close(): Promise<void>;
}
