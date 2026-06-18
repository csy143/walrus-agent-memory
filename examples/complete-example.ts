/**
 * 完整的端到端示例
 * 演示如何使用 Walrus Agent Memory Framework
 *
 * 使用方法:
 *   npx ts-node examples/complete-example.ts
 *
 * 需要先配置 .env 文件：
 *   - SUI_RPC_URL
 *   - SUI_PACKAGE_ID
 *   - WALRUS_ENDPOINT
 */

import { MemoryStore, MemoryType } from '../packages/sdk/src/index';
import {
  WalrusMemorySaver,
  WalrusAgentState,
  WalrusKnowledgeBase,
} from '../packages/sdk/src/frameworks/LangChainIntegration';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// ============ 配置 ============

const config = {
  sui: {
    rpcUrl: process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443',
    packageId: process.env.SUI_PACKAGE_ID || 'test_package',
  },
  walrus: {
    endpoint: process.env.WALRUS_ENDPOINT || 'https://walrus-testnet.walrus.live',
  },
};

// ============ 示例 1: 基础内存存储和检索 ============

async function exampleBasicMemory() {
  console.log('\n' + '='.repeat(70));
  console.log('📖 示例 1: 基础内存存储和检索');
  console.log('='.repeat(70) + '\n');

  const store = new MemoryStore(config, 'basic_example_agent');

  try {
    // 1. 存储内存
    console.log('1️⃣  正在存储内存到 Walrus...');
    const memory1 = await store.store('hello_world', {
      type: MemoryType.CONVERSATION,
      data: {
        role: 'user',
        message: 'Hello, Walrus!',
        timestamp: new Date().toISOString(),
      },
      metadata: {
        tags: ['greeting'],
        importance: 7,
      },
      timestamp: Date.now(),
      version: 1,
    });

    console.log('✅ 存储成功!');
    console.log('   Memory ID:', memory1.id);
    console.log('   Walrus ID:', memory1.walrus_id);
    console.log('   Checksum:', memory1.checksum);

    // 2. 检索内存
    console.log('\n2️⃣  正在从 Walrus 检索内存...');
    const retrieved = await store.retrieve('hello_world');

    if (retrieved) {
      console.log('✅ 检索成功!');
      console.log('   内容:', retrieved.data);
      console.log('   版本:', retrieved.version);
    } else {
      console.log('❌ 内存未找到');
    }

    // 3. 存储多条内存
    console.log('\n3️⃣  正在批量存储多条内存...');
    const memories = await store.batchStore([
      {
        key: 'fact_001',
        content: {
          type: MemoryType.KNOWLEDGE,
          data: { topic: 'Sui', fact: 'Sui is a blockchain platform' },
          timestamp: Date.now(),
          version: 1,
        },
      },
      {
        key: 'fact_002',
        content: {
          type: MemoryType.KNOWLEDGE,
          data: { topic: 'Walrus', fact: 'Walrus is distributed storage' },
          timestamp: Date.now(),
          version: 1,
        },
      },
    ]);

    console.log(`✅ 成功存储 ${memories.length} 条内存`);

    // 4. 查询内存
    console.log('\n4️⃣  正在查询内存...');
    const results = await store.query({
      type: MemoryType.KNOWLEDGE,
    });

    console.log(`✅ 找到 ${results.length} 条知识记录`);
    results.forEach((r, i) => {
      console.log(`   [${i + 1}] ${r.type}: ${JSON.stringify(r.data)}`);
    });

    // 5. 获取统计信息
    console.log('\n5️⃣  正在获取统计信息...');
    const stats = await store.getStats();

    console.log('✅ 统计信息:');
    console.log('   总内存数:', stats.total_memories);
    console.log('   总大小:', stats.total_size, '字节');
    console.log('   按类型:', stats.by_type);
    console.log('   按重要性:', stats.by_importance);

    await store.close();
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// ============ 示例 2: LangChain 集成 ============

async function exampleLangChainIntegration() {
  console.log('\n' + '='.repeat(70));
  console.log('🤖 示例 2: LangChain Agent 对话历史');
  console.log('='.repeat(70) + '\n');

  const store = new MemoryStore(config, 'langchain_agent');

  try {
    // 初始化 LangChain 组件
    const memory = new WalrusMemorySaver({
      memoryStore: store,
      sessionId: 'user_session_001',
    });

    // 1. 加载之前的对话
    console.log('1️⃣  正在加载之前的对话历史...');
    let messages = await memory.loadChatHistory();
    console.log(`✅ 加载了 ${messages.length} 条历史记录`);

    // 2. 模拟对话
    console.log('\n2️⃣  模拟一个对话...');
    const conversation = [
      { _getType: () => 'human', content: 'What is Sui?' },
      {
        _getType: () => 'ai',
        content:
          'Sui is a blockchain platform designed for high performance and user experience.',
      },
      { _getType: () => 'human', content: 'And what about Walrus?' },
      {
        _getType: () => 'ai',
        content:
          'Walrus is a decentralized storage system optimized for Sui.',
      },
    ];

    // 3. 保存对话
    console.log('3️⃣  正在保存对话到 Walrus...');
    await memory.saveChatHistory(conversation as any[]);
    console.log(`✅ 成功保存 ${conversation.length} 条消息`);

    // 4. 验证保存
    console.log('\n4️⃣  验证保存的内容...');
    const loaded = await memory.loadChatHistory();
    console.log(`✅ 加载了 ${loaded.length} 条消息`);

    await store.close();
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// ============ 示例 3: Agent 状态管理 ============

async function exampleAgentState() {
  console.log('\n' + '='.repeat(70));
  console.log('⚙️ 示例 3: Agent 状态管理');
  console.log('='.repeat(70) + '\n');

  const store = new MemoryStore(config, 'stateful_agent');

  try {
    // 初始化状态管理器
    const state = new WalrusAgentState(store, 'my_agent');

    // 1. 保存状态
    console.log('1️⃣  正在保存 Agent 状态...');
    const agentState = {
      current_task: 'analyzing_data',
      progress: 45,
      last_checkpoint: new Date().toISOString(),
      context: {
        user_id: 'user_123',
        conversation_count: 5,
        accuracy: 0.92,
      },
    };

    await state.saveState(agentState);
    console.log('✅ 状态已保存');

    // 2. 加载状态
    console.log('\n2️⃣  正在加载 Agent 状态...');
    const loaded = await state.loadState();

    if (loaded) {
      console.log('✅ 状态已加载:');
      console.log('   Current task:', loaded.current_task);
      console.log('   Progress:', loaded.progress, '%');
      console.log('   Context:', loaded.context);
    } else {
      console.log('❌ 未找到保存的状态');
    }

    await store.close();
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// ============ 示例 4: 知识库管理 ============

async function exampleKnowledgeBase() {
  console.log('\n' + '='.repeat(70));
  console.log('📚 示例 4: 知识库管理');
  console.log('='.repeat(70) + '\n');

  const store = new MemoryStore(config, 'kb_agent');

  try {
    // 初始化知识库
    const knowledge = new WalrusKnowledgeBase(store);

    // 1. 添加知识
    console.log('1️⃣  正在添加知识到知识库...');
    await knowledge.addKnowledge(
      'blockchain',
      'Blockchain is a distributed ledger technology'
    );
    await knowledge.addKnowledge(
      'blockchain',
      'Smart contracts are self-executing code on blockchain'
    );
    await knowledge.addKnowledge('storage', 'Walrus provides decentralized storage');

    console.log('✅ 知识已添加');

    // 2. 查询知识
    console.log('\n2️⃣  正在查询区块链相关知识...');
    const blockchain_knowledge = await knowledge.queryKnowledge('blockchain');
    console.log(`✅ 找到 ${blockchain_knowledge.length} 条相关知识`);
    blockchain_knowledge.forEach((k, i) => {
      console.log(`   [${i + 1}] ${k.content}`);
    });

    // 3. 搜索知识
    console.log('\n3️⃣  正在搜索知识库...');
    const search_results = await knowledge.searchKnowledge('distributed');
    console.log(`✅ 搜索找到 ${search_results.length} 条记录`);

    await store.close();
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// ============ 示例 5: 完整的协作场景 ============

async function exampleFullScenario() {
  console.log('\n' + '='.repeat(70));
  console.log('🎯 示例 5: 完整的多功能场景');
  console.log('='.repeat(70) + '\n');

  const store = new MemoryStore(config, 'complete_agent');

  try {
    console.log('📝 场景: 一个能学习和记忆的 AI Assistant\n');

    // 初始化各个组件
    const memory = new WalrusMemorySaver({
      memoryStore: store,
      sessionId: 'assistant_session_001',
    });
    const state = new WalrusAgentState(store, 'complete_agent');
    const knowledge = new WalrusKnowledgeBase(store);

    // Step 1: 学习知识
    console.log('Step 1️⃣: Assistant 学习新知识');
    await knowledge.addKnowledge(
      'user_preferences',
      'User prefers detailed technical explanations'
    );
    await knowledge.addKnowledge('user_preferences', 'User is interested in blockchain');
    console.log('✅ 知识已学习\n');

    // Step 2: 记录对话
    console.log('Step 2️⃣: 记录与用户的对话');
    const conversation = [
      { _getType: () => 'human', content: 'Explain Walrus to me' },
      {
        _getType: () => 'ai',
        content:
          'Walrus is a decentralized storage system on Sui blockchain optimized for efficiency.',
      },
    ];
    await memory.saveChatHistory(conversation as any[]);
    console.log('✅ 对话已记录\n');

    // Step 3: 保存执行状态
    console.log('Step 3️⃣: 保存 Assistant 的执行状态');
    await state.saveState({
      last_interaction: new Date().toISOString(),
      total_interactions: 1,
      learned_facts: 2,
      satisfaction_score: 0.95,
    });
    console.log('✅ 状态已保存\n');

    // Step 4: 验证所有数据
    console.log('Step 4️⃣: 验证所有保存的数据');
    const stats = await store.getStats();
    console.log(`✅ 总共保存了 ${stats.total_memories} 条记忆`);
    console.log(`   - 总大小: ${stats.total_size} 字节`);
    console.log(`   - 按类型: ${JSON.stringify(stats.by_type)}`);

    // Step 5: 模拟下一次使用
    console.log('\nStep 5️⃣: 模拟下次 Assistant 启动时恢复状态');
    const previousState = await state.loadState();
    const previousMessages = await memory.loadChatHistory();
    const relevantKnowledge = await knowledge.queryKnowledge('user_preferences');

    console.log('✅ 已恢复:');
    console.log(`   - 之前的 ${previousMessages.length} 条对话`);
    console.log(`   - ${relevantKnowledge.length} 条用户偏好知识`);
    console.log(`   - 执行状态: ${previousState?.last_interaction}`);

    console.log('\n✅ 场景演示完成！Assistant 可以继续服务用户了。');

    await store.close();
  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

// ============ 主函数 ============

async function main() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                        ║');
  console.log('║         🚀 Walrus Agent Memory Framework - 完整示例演示                ║');
  console.log('║                                                                        ║');
  console.log('║  此示例演示如何使用 Walrus Agent Memory 框架:                          ║');
  console.log('║  - 存储和检索内存                                                     ║');
  console.log('║  - LangChain 集成                                                     ║');
  console.log('║  - Agent 状态管理                                                     ║');
  console.log('║  - 知识库管理                                                         ║');
  console.log('║  - 完整的协作场景                                                     ║');
  console.log('║                                                                        ║');
  console.log('║  配置信息:                                                            ║');
  console.log(`║  - Sui RPC: ${config.sui.rpcUrl.substring(0, 40)}...           ║`);
  console.log(`║  - Walrus: ${config.walrus.endpoint.substring(0, 42)}...              ║`);
  console.log('║                                                                        ║');
  console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

  // 选择运行哪个示例
  const args = process.argv.slice(2);
  const example = args[0] || 'all';

  try {
    if (example === 'all' || example === '1') await exampleBasicMemory();
    if (example === 'all' || example === '2') await exampleLangChainIntegration();
    if (example === 'all' || example === '3') await exampleAgentState();
    if (example === 'all' || example === '4') await exampleKnowledgeBase();
    if (example === 'all' || example === '5') await exampleFullScenario();

    console.log('\n' + '='.repeat(70));
    console.log('✅ 所有示例已完成!');
    console.log('='.repeat(70) + '\n');
  } catch (error) {
    console.error('\n❌ 执行出错:', error);
    process.exit(1);
  }
}

// 运行
main().catch(console.error);
