/**
 * LangChain Bot Example with Walrus Memory
 * Demonstrates how to use the SDK with LangChain-like agents
 */

import { MemoryStore, MemoryType } from '@walrus-memory/sdk';
import {
  WalrusMemorySaver,
  WalrusAgentState,
  WalrusKnowledgeBase,
} from '@walrus-memory/sdk';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

class LangChainMemoryBot {
  private store: MemoryStore;
  private memorySaver: WalrusMemorySaver;
  private stateManager: WalrusAgentState;
  private knowledge: WalrusKnowledgeBase;
  private sessionId: string;
  private conversationHistory: ConversationMessage[] = [];

  constructor(sessionId: string) {
    this.sessionId = sessionId;

    // Initialize memory store
    this.store = new MemoryStore(
      {
        sui: {
          rpcUrl: process.env.SUI_RPC_URL || 'http://localhost:9000',
          packageId: process.env.SUI_PACKAGE_ID || 'test_package',
        },
        walrus: {
          endpoint: process.env.WALRUS_ENDPOINT || 'http://localhost:31415',
        },
        cache: {
          enabled: true,
          ttl: 3600000,
          maxSize: 100,
        },
      },
      'langchain_bot'
    );

    // Initialize components
    this.memorySaver = new WalrusMemorySaver({
      memoryStore: this.store,
      sessionId,
    });

    this.stateManager = new WalrusAgentState(this.store, 'langchain_bot');

    this.knowledge = new WalrusKnowledgeBase(this.store);

    console.log(`🤖 LangChain Memory Bot initialized (Session: ${sessionId})`);
  }

  async initialize(): Promise<void> {
    try {
      // Load conversation history
      const history = await this.memorySaver.loadChatHistory();
      this.conversationHistory = history;

      console.log(
        `📚 Loaded ${history.length} previous messages from persistent memory`
      );

      // Load agent state
      const state = await this.stateManager.loadState();
      if (state) {
        console.log('🔄 Restored agent state from persistent memory');
      }

      // Setup event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }

  private setupEventListeners(): void {
    this.store.on('stored', (event) => {
      console.log(`✅ Memory stored: ${event.data.id}`);
    });

    this.store.on('retrieved', (event) => {
      console.log(`📖 Memory retrieved: ${event.data.key}`);
    });

    this.store.on('error', (event) => {
      console.error(`❌ Error: ${event.data.action}`, event.data.error);
    });
  }

  async addMessage(role: 'user' | 'assistant', content: string): Promise<void> {
    const message: ConversationMessage = {
      role,
      content,
      timestamp: Date.now(),
    };

    this.conversationHistory.push(message);

    // Automatically save to persistent memory every 5 messages
    if (this.conversationHistory.length % 5 === 0) {
      await this.saveConversation();
    }
  }

  async saveConversation(): Promise<void> {
    try {
      // Save chat history
      await this.memorySaver.saveChatHistory(
        this.conversationHistory as any[]
      );

      console.log('💾 Conversation saved to persistent memory');

      // Save current state
      await this.stateManager.saveState({
        messageCount: this.conversationHistory.length,
        lastUpdate: Date.now(),
        sessionId: this.sessionId,
      });
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  async getContext(maxMessages: number = 10): Promise<string> {
    // Get recent conversation history
    const recent = this.conversationHistory.slice(-maxMessages);

    return recent
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');
  }

  async addKnowledge(topic: string, content: string): Promise<void> {
    try {
      await this.knowledge.addKnowledge(topic, content);
      console.log(`📕 Knowledge added: ${topic}`);
    } catch (error) {
      console.error('Failed to add knowledge:', error);
    }
  }

  async queryKnowledge(topic: string): Promise<any[]> {
    try {
      const results = await this.knowledge.queryKnowledge(topic);
      console.log(`📚 Found ${results.length} knowledge pieces for: ${topic}`);
      return results;
    } catch (error) {
      console.error('Failed to query knowledge:', error);
      return [];
    }
  }

  async getStats(): Promise<void> {
    try {
      const stats = await this.store.getStats();

      console.log('\n📊 Memory Statistics:');
      console.log(`  Total memories: ${stats.total_memories}`);
      console.log(`  Total size: ${stats.total_size} bytes`);
      console.log(`  By type:`, stats.by_type);
      console.log(`  By importance:`, stats.by_importance);
      console.log('');
    } catch (error) {
      console.error('Failed to get stats:', error);
    }
  }

  async close(): Promise<void> {
    try {
      await this.saveConversation();
      await this.store.close();
      console.log('🛑 Bot closed');
    } catch (error) {
      console.error('Failed to close bot:', error);
    }
  }
}

/**
 * Example usage
 */
async function main() {
  const bot = new LangChainMemoryBot('session_001');

  try {
    // Initialize
    await bot.initialize();

    // Simulate conversation
    console.log('\n💬 Starting conversation...\n');

    await bot.addMessage('user', 'What is the capital of France?');
    console.log('User: What is the capital of France?');

    await bot.addMessage('assistant', 'The capital of France is Paris.');
    console.log('Assistant: The capital of France is Paris.');

    await bot.addMessage('user', 'Tell me more about Paris');
    console.log('User: Tell me more about Paris');

    await bot.addMessage(
      'assistant',
      'Paris is the largest city in France and is known as the City of Light.'
    );
    console.log(
      'Assistant: Paris is the largest city in France and is known as the City of Light.'
    );

    // Add knowledge
    console.log('\n📕 Adding knowledge to base...\n');
    await bot.addKnowledge(
      'geography',
      'Paris is the capital and most populous city of France.'
    );
    await bot.addKnowledge('geography', 'France is located in Western Europe.');

    // Query knowledge
    console.log('\n🔍 Querying knowledge base...\n');
    const knowledge = await bot.queryKnowledge('geography');
    console.log('Knowledge found:', knowledge.length);

    // Get conversation context
    console.log('\n📖 Recent conversation context:\n');
    const context = await bot.getContext(10);
    console.log(context);

    // Save and get stats
    await bot.saveConversation();
    await bot.getStats();

    // Cleanup
    await bot.close();
  } catch (error) {
    console.error('Bot error:', error);
    await bot.close();
    process.exit(1);
  }
}

main();
