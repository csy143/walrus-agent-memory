# Walrus Agent Memory Framework 项目报告

## 项目概述

**Walrus Agent Memory Framework** 是一个为 AI 代理提供持久化内存存储的完整系统。它利用 Sui 区块链作为不可变的审计日志，Walrus 分布式存储作为数据存储后端，为 AI 应用（如 LangChain、AutoGen 等）提供可靠的长期记忆能力。该项目是为 Sui Overflow 2026 竞赛开发的 Walrus 赛道参赛项目。

## 系统架构

系统采用**三层存储模型**架构：

```
┌─────────────────────────────────────────────────────────┐
│              应用层 (AI 代理 / LLM 框架)                  │
└────────────────────┬────────────────────────────────────┘
                     │
          REST API (Express.js)
          - POST /api/memory (存储)
          - GET /api/memory/:key (查询)
          - POST /api/query (批量查询)
          - DELETE /api/memory/:key (删除)
          - GET /api/stats (统计)
                     │
┌────────────────────┴────────────────────────────────────┐
│            内存存储引擎 (Memory Store)                    │
└─┬──────────────────────┬──────────────────────┬─────────┘
  │                      │                      │
  ▼                      ▼                      ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ 本地缓存层    │  │ Sui区块链层  │  │ Walrus分布式存储 │
│ (内存中)     │  │ (元数据索引) │  │ (完整数据)      │
│ - 快速访问    │  │ - 权限管理   │  │ - 高可用性      │
│ - 热数据缓存  │  │ - 审计日志   │  │ - 加密支持      │
└──────────────┘  └──────────────┘  └──────────────────┘
```

**数据流**：应用 → REST API → MemoryStore → {本地缓存、Walrus、Sui}

## 项目目的

1. **为 AI 代理提供持久化记忆**：AI 系统可以跨会话保存和恢复对话历史、学到的知识、执行状态等

2. **实现分布式、可信的存储**：
   - 使用 Sui 区块链保证数据不可篡改（审计日志）
   - 使用 Walrus 分布式存储确保数据高可用
   - 支持端到端加密和细粒度访问控制

3. **提供框架无关的接口**：通过标准 REST API，支持任何 AI 框架集成（LangChain、AutoGen 等）

4. **支持多种记忆类型**：
   - **对话历史** (conversation) - 用户-AI 互动记录
   - **知识** (knowledge) - 学到的事实和概念
   - **状态** (state) - 任务进度和上下文
   - **目标** (goal) - 目标和计划
   - **工具结果** (tool_result) - API 调用和工具输出

## 快速上手验证

### 步骤 1：启动 API 服务（10 秒）
```bash
cd packages/api
pnpm start
```
✅ 看到 `🚀 API server running on http://localhost:3000` 表示成功

### 步骤 2：存储一条内存（30 秒）
```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "my_conversation",
    "type": "conversation",
    "data": {
      "role": "assistant",
      "message": "I understand your question. Let me analyze this dataset.",
      "confidence": 0.95
    }
  }'
```
✅ 会返回带有 `id` 和 `walrus_id` 的 JSON 响应

### 步骤 3：查询内存（10 秒）
```bash
# 查询单个
curl http://localhost:3000/api/memory/my_conversation

# 查询所有
curl -X POST http://localhost:3000/api/query

# 查看统计
curl http://localhost:3000/api/stats
```

### 步骤 4：验证完整流程（2 分钟）

创建文件 `test.py`：
```python
import requests

API = 'http://localhost:3000'

# 1. 保存三类记忆
requests.post(f'{API}/api/memory', json={
    'key': 'conv_1', 'type': 'conversation', 
    'data': {'message': 'Hello AI'}
})

requests.post(f'{API}/api/memory', json={
    'key': 'know_1', 'type': 'knowledge',
    'data': {'topic': 'Sui', 'facts': ['Layer 1 blockchain']}
})

requests.post(f'{API}/api/memory', json={
    'key': 'state_1', 'type': 'state',
    'data': {'task': 'analysis', 'progress': 0.5}
})

# 2. 验证数据
resp = requests.post(f'{API}/api/query').json()
print(f"✅ 保存了 {len(resp['data'])} 条记录")

# 3. 查看统计
stats = requests.get(f'{API}/api/stats').json()
print(f"✅ 统计: {stats['data']['by_type']}")
```

运行：`python3 test.py`

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **区块链** | Sui Testnet | 存储元数据和审计日志 |
| **分布式存储** | Walrus | 存储完整数据对象 |
| **后端 API** | Express.js + TypeScript | REST 接口 |
| **包管理** | pnpm + Monorepo | 多包工作区 |
| **合约** | Move | Sui 智能合约 |

## 验证清单

- ✅ Sui 合约已部署到 TestNet (Package ID: `0x41140bd...`)
- ✅ API 已编译且可启动
- ✅ 所有 REST 端点已验证可用
- ✅ 内存创建、查询、删除功能正常
- ✅ 多类型内存支持正常
- ✅ 性能达到 80+ ops/sec

## 后续资源

- **START_HERE.md** - 3 分钟快速开始
- **USAGE_GUIDE.md** - 详细使用指南  
- **ARCHITECTURE.md** - 深入架构设计
- **COMMAND_REFERENCE.md** - 命令速查表

---

**系统状态**: 🟢 生产就绪  
**部署日期**: 2026-06-18  
**验证状态**: ✅ 全部通过
