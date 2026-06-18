/**
 * LangChain Integration
 * Adapter for LangChain memory interface
 */

import { MemoryStore } from '../core/MemoryStore';
import { MemoryType, MemoryContent } from '../core/types';
import { createLogger } from '../utils/logger';

interface BaseMessage {
  _getType(): string;
  content: string;
  additional_kwargs?: Record<string, any>;
}

interface LangChainMemoryConfig {
  memoryStore: MemoryStore;
  sessionId: string;
}

/**
 * LangChain-compatible memory saver
 * Can be used with LangChain's BaseChatMemory
 */
export class WalrusMemorySaver {
  private store: MemoryStore;
  private sessionId: string;
  private logger;

  constructor(config: LangChainMemoryConfig) {
    this.store = config.memoryStore;
    this.sessionId = config.sessionId;
    this.logger = createLogger(`WalrusMemorySaver:${sessionId}`);
  }

  /**
   * Save chat history to persistent memory
   */
  async saveChatHistory(messages: any[]): Promise<void> {
    try {
      const content: MemoryContent = {
        type: MemoryType.CONVERSATION,
        data: {
          sessionId: this.sessionId,
          messages: messages.map((msg: any) => ({
            type: msg._getType?.() || msg.type || 'unknown',
            content: msg.content || msg.text || '',
            additionalKwargs: msg.additional_kwargs || {},
          })),
          messageCount: messages.length,
        },
        metadata: {
          tags: ['langchain', 'chat_history'],
          importance: 7,
        },
        timestamp: Date.now(),
        version: 1,
      };

      await this.store.store(`langchain_chat_${this.sessionId}`, content, {
        importance: 7,
        tags: ['langchain', 'conversation'],
      });

      this.logger.info('Chat history saved', { messageCount: messages.length });
    } catch (error) {
      this.logger.error('Failed to save chat history', { error });
      throw error;
    }
  }

  /**
   * Load chat history from persistent memory
   */
  async loadChatHistory(): Promise<any[]> {
    try {
      const content = await this.store.retrieve(`langchain_chat_${this.sessionId}`);

      if (!content || !content.data.messages) {
        return [];
      }

      const messages = content.data.messages.map((msg: any) => ({
        _getType: () => msg.type,
        content: msg.content,
        additional_kwargs: msg.additionalKwargs || {},
      }));

      this.logger.info('Chat history loaded', { messageCount: messages.length });

      return messages;
    } catch (error) {
      this.logger.error('Failed to load chat history', { error });
      return [];
    }
  }

  /**
   * Clear chat history
   */
  async clear(): Promise<void> {
    try {
      await this.store.delete(`langchain_chat_${this.sessionId}`);
      this.logger.info('Chat history cleared');
    } catch (error) {
      this.logger.error('Failed to clear chat history', { error });
      throw error;
    }
  }
}

/**
 * LangChain agent state manager
 * Maintains agent execution state across sessions
 */
export class WalrusAgentState {
  private store: MemoryStore;
  private agentId: string;
  private logger;

  constructor(store: MemoryStore, agentId: string) {
    this.store = store;
    this.agentId = agentId;
    this.logger = createLogger(`WalrusAgentState:${agentId}`);
  }

  /**
   * Save agent state
   */
  async saveState(state: Record<string, any>): Promise<void> {
    try {
      const content: MemoryContent = {
        type: MemoryType.STATE,
        data: {
          agentId: this.agentId,
          state,
          savedAt: Date.now(),
        },
        metadata: {
          tags: ['agent_state'],
          importance: 8,
        },
        timestamp: Date.now(),
        version: 1,
      };

      await this.store.store(`agent_state_${this.agentId}`, content, {
        importance: 8,
        tags: ['agent_state'],
      });

      this.logger.info('Agent state saved');
    } catch (error) {
      this.logger.error('Failed to save agent state', { error });
      throw error;
    }
  }

  /**
   * Load agent state
   */
  async loadState(): Promise<Record<string, any> | null> {
    try {
      const content = await this.store.retrieve(`agent_state_${this.agentId}`);

      if (!content) {
        return null;
      }

      this.logger.info('Agent state loaded');
      return content.data.state;
    } catch (error) {
      this.logger.error('Failed to load agent state', { error });
      return null;
    }
  }
}

/**
 * LangChain knowledge base manager
 * Store and retrieve knowledge pieces
 */
export class WalrusKnowledgeBase {
  private store: MemoryStore;
  private logger;

  constructor(store: MemoryStore) {
    this.store = store;
    this.logger = createLogger('WalrusKnowledgeBase');
  }

  /**
   * Add a knowledge piece
   */
  async addKnowledge(
    topic: string,
    content: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    try {
      const key = `knowledge_${topic}_${Date.now()}`;

      await this.store.store(
        key,
        {
          type: MemoryType.KNOWLEDGE,
          data: {
            topic,
            content,
            metadata,
          },
          metadata: {
            tags: ['knowledge', topic],
            importance: 6,
          },
          timestamp: Date.now(),
          version: 1,
        },
        {
          tags: ['knowledge', topic],
        }
      );

      this.logger.info('Knowledge added', { topic });
      return key;
    } catch (error) {
      this.logger.error('Failed to add knowledge', { topic, error });
      throw error;
    }
  }

  /**
   * Query knowledge base
   */
  async queryKnowledge(topic: string): Promise<any[]> {
    try {
      const results = await this.store.query(
        {
          type: MemoryType.KNOWLEDGE,
          tags: [topic],
        },
        { limit: 50 }
      );

      this.logger.info('Knowledge queried', { topic, count: results.length });
      return results.map(r => r.data);
    } catch (error) {
      this.logger.error('Failed to query knowledge', { topic, error });
      return [];
    }
  }

  /**
   * Full-text search in knowledge base
   */
  async searchKnowledge(query: string): Promise<any[]> {
    try {
      const results = await this.store.search(query, {
        type: MemoryType.KNOWLEDGE,
        limit: 20,
      });

      this.logger.info('Knowledge searched', { query, count: results.length });
      return results.map(r => r.data);
    } catch (error) {
      this.logger.error('Failed to search knowledge', { query, error });
      return [];
    }
  }
}

/**
 * Complete LangChain integration package
 */
export class WalrusLangChainAdapter {
  public memory: WalrusMemorySaver;
  public state: WalrusAgentState;
  public knowledge: WalrusKnowledgeBase;

  constructor(
    store: MemoryStore,
    agentId: string,
    sessionId: string
  ) {
    this.memory = new WalrusMemorySaver({ memoryStore: store, sessionId });
    this.state = new WalrusAgentState(store, agentId);
    this.knowledge = new WalrusKnowledgeBase(store);
  }
}
