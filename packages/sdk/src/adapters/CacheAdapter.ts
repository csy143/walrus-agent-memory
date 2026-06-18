/**
 * Cache Adapter
 * In-memory caching layer for fast memory access
 */

import { createLogger } from '../utils/logger';

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // milliseconds
  maxSize: number;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class CacheAdapter {
  private config: CacheConfig;
  private logger;
  private cache: Map<string, CacheEntry<any>>;

  constructor(config: CacheConfig) {
    this.config = config;
    this.logger = createLogger('CacheAdapter');
    this.cache = new Map();

    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), 60000);
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      const expiresAt = Date.now() + (ttl || this.config.ttl);

      if (this.cache.size >= this.config.maxSize) {
        // Remove oldest entry
        const oldestKey = Array.from(this.cache.entries())[0][0];
        this.cache.delete(oldestKey);
      }

      this.cache.set(key, { data, expiresAt });
      this.logger.debug('Cache set', { key });
    } catch (error) {
      this.logger.error('Cache set failed', { key, error });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const entry = this.cache.get(key);

      if (!entry) {
        return null;
      }

      if (entry.expiresAt < Date.now()) {
        this.cache.delete(key);
        return null;
      }

      this.logger.debug('Cache hit', { key });
      return entry.data as T;
    } catch (error) {
      this.logger.error('Cache get failed', { key, error });
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      this.cache.delete(key);
      this.logger.debug('Cache delete', { key });
    } catch (error) {
      this.logger.error('Cache delete failed', { key, error });
    }
  }

  async clear(): Promise<void> {
    try {
      this.cache.clear();
      this.logger.info('Cache cleared');
    } catch (error) {
      this.logger.error('Cache clear failed', { error });
    }
  }

  async close(): Promise<void> {
    await this.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug('Cache cleanup', { cleanedCount });
    }
  }
}
