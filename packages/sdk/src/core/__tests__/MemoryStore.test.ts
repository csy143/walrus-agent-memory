/**
 * MemoryStore Unit Tests
 */

import { MemoryStore } from '../MemoryStore';
import { MemoryType, SDKConfig } from '../types';

describe('MemoryStore', () => {
  let store: MemoryStore;
  const mockConfig: SDKConfig = {
    sui: {
      rpcUrl: 'http://localhost:9000',
      packageId: 'test_package',
    },
    walrus: {
      endpoint: 'http://localhost:31415',
    },
  };

  beforeEach(() => {
    store = new MemoryStore(mockConfig, 'test_agent');
  });

  afterEach(async () => {
    await store.close();
  });

  describe('store', () => {
    it('should store a memory record', async () => {
      const result = await store.store('test_key', {
        type: MemoryType.CONVERSATION,
        data: { message: 'hello' },
        timestamp: Date.now(),
        version: 1,
      });

      expect(result.id).toBeDefined();
      expect(result.owner).toBe('test_agent');
      expect(result.checksum).toBeDefined();
    });

    it('should store with options', async () => {
      const result = await store.store(
        'test_key_2',
        {
          type: MemoryType.KNOWLEDGE,
          data: { fact: 'important' },
          timestamp: Date.now(),
          version: 1,
        },
        {
          importance: 8,
          tags: ['important'],
        }
      );

      expect(result.metadata?.importance).toBe(8);
      expect(result.metadata?.tags).toContain('important');
    });
  });

  describe('retrieve', () => {
    it('should retrieve stored memory', async () => {
      await store.store('test_key_3', {
        type: MemoryType.CONVERSATION,
        data: { content: 'test' },
        timestamp: Date.now(),
        version: 1,
      });

      const result = await store.retrieve('test_key_3');
      expect(result).toBeDefined();
      expect(result?.data.content).toBe('test');
    });

    it('should return null for non-existent memory', async () => {
      const result = await store.retrieve('non_existent');
      expect(result).toBeNull();
    });
  });

  describe('batchStore', () => {
    it('should store multiple memories', async () => {
      const results = await store.batchStore([
        {
          key: 'batch_1',
          content: {
            type: MemoryType.CONVERSATION,
            data: { msg: '1' },
            timestamp: Date.now(),
            version: 1,
          },
        },
        {
          key: 'batch_2',
          content: {
            type: MemoryType.CONVERSATION,
            data: { msg: '2' },
            timestamp: Date.now(),
            version: 1,
          },
        },
      ]);

      expect(results.length).toBe(2);
      expect(results[0].id).toBeDefined();
      expect(results[1].id).toBeDefined();
    });
  });

  describe('events', () => {
    it('should emit stored event', async () => {
      const handler = jest.fn();
      store.on('stored', handler);

      await store.store('event_test', {
        type: MemoryType.CONVERSATION,
        data: {},
        timestamp: Date.now(),
        version: 1,
      });

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].type).toBe('stored');
    });
  });
});
