# Walrus Agent Memory - 使用指南

## 🚀 快速启动

### 1. 启动 API 服务

```bash
cd packages/api
pnpm start
```

服务将在 `http://localhost:3000` 上运行。

### 2. 存储 AI 代理的对话记录

```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "conversation_2026_06_18_001",
    "type": "conversation",
    "data": {
      "role": "assistant",
      "message": "我理解你的问题。让我帮你分析这个数据集。",
      "tokens_used": 145,
      "confidence": 0.92
    }
  }'
```

响应示例：
```json
{
  "success": true,
  "data": {
    "id": "mem_1781769256948_0ruujm",
    "key": "conversation_2026_06_18_001",
    "type": "conversation",
    "walrus_id": "walrus_mem_1781769256948_0ruujm",
    "timestamp": 1781769256948,
    "version": 1
  }
}
```

### 3. 检索内存

```bash
curl http://localhost:3000/api/memory/conversation_2026_06_18_001
```

### 4. 查询所有内存

```bash
curl -X POST http://localhost:3000/api/query \
  -H 'Content-Type: application/json' \
  -d '{}'
```

### 5. 查看统计信息

```bash
curl http://localhost:3000/api/stats
```

### 6. 删除内存

```bash
curl -X DELETE http://localhost:3000/api/memory/conversation_2026_06_18_001
```

## 📝 API 端点完整列表

### 健康检查
```
GET /health
```

### 内存操作

#### 创建/更新内存
```
POST /api/memory
Content-Type: application/json

{
  "key": "unique_key",
  "type": "conversation|knowledge|state|goal|tool_result|custom",
  "data": { /* 任意 JSON 对象 */ }
}
```

#### 获取内存
```
GET /api/memory/:key
```

#### 删除内存
```
DELETE /api/memory/:key
```

#### 查询所有内存
```
POST /api/query
```

#### 获取统计
```
GET /api/stats
```

## 🎯 使用场景示例

### 场景 1: 记录对话历史

```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "chat_session_123",
    "type": "conversation",
    "data": {
      "session_id": "session_123",
      "messages": [
        {
          "role": "user",
          "message": "什么是 Sui 区块链？"
        },
        {
          "role": "assistant",
          "message": "Sui 是一个高性能的区块链平台..."
        }
      ],
      "created_at": "2026-06-18T10:00:00Z"
    }
  }'
```

### 场景 2: 存储学到的知识

```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "knowledge_sui_blockchain",
    "type": "knowledge",
    "data": {
      "topic": "Sui Blockchain",
      "facts": [
        "Sui 是由 Mysten Labs 开发的",
        "采用 Move 编程语言",
        "支持平行化执行"
      ],
      "importance": 9,
      "learned_date": "2026-06-18",
      "sources": ["https://sui.io"]
    }
  }'
```

### 场景 3: 保存代理执行状态

```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "task_market_analysis_001",
    "type": "state",
    "data": {
      "task_id": "task_001",
      "task_name": "分析市场趋势",
      "progress": 0.65,
      "status": "in_progress",
      "steps_completed": ["数据收集", "初步分析"],
      "next_steps": ["深度分析", "生成报告"],
      "estimated_completion": "2026-06-18T14:00:00Z"
    }
  }'
```

### 场景 4: 记录工具调用结果

```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "tool_result_market_data_001",
    "type": "tool_result",
    "data": {
      "tool_name": "get_market_data",
      "tool_args": {
        "symbol": "NASDAQ:AAPL",
        "period": "1d"
      },
      "result": {
        "current_price": 189.50,
        "change": 2.5,
        "volume": 45000000
      },
      "execution_time_ms": 234
    }
  }'
```

## 🛠️ 高级用法

### 使用 Python 脚本

```python
import requests
import json

API_URL = "http://localhost:3000"

def store_memory(key, memory_type, data):
    """存储内存"""
    response = requests.post(
        f"{API_URL}/api/memory",
        json={
            "key": key,
            "type": memory_type,
            "data": data
        }
    )
    return response.json()

def retrieve_memory(key):
    """检索内存"""
    response = requests.get(f"{API_URL}/api/memory/{key}")
    return response.json()

def query_all_memories():
    """查询所有内存"""
    response = requests.post(f"{API_URL}/api/query")
    return response.json()

def get_stats():
    """获取统计信息"""
    response = requests.get(f"{API_URL}/api/stats")
    return response.json()

# 使用示例
result = store_memory(
    "my_conversation",
    "conversation",
    {"message": "Hello AI Memory!"}
)
print(result)
```

### 使用 Node.js

```javascript
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000';

async function storeMemory(key, type, data) {
  const response = await fetch(`${API_URL}/api/memory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, type, data })
  });
  return response.json();
}

async function retrieveMemory(key) {
  const response = await fetch(`${API_URL}/api/memory/${key}`);
  return response.json();
}

// 使用示例
const result = await storeMemory('my_memory', 'conversation', {
  message: 'Hello AI Memory!'
});
console.log(result);
```

## 🔒 内存类型

| 类型 | 用途 | 示例 |
|------|------|------|
| `conversation` | 对话历史 | 用户-AI 互动 |
| `knowledge` | 学到的知识 | 事实、概念、经验 |
| `state` | 执行状态 | 任务进度、当前上下文 |
| `goal` | 目标信息 | 目标、计划、策略 |
| `tool_result` | 工具输出 | API 调用结果、数据 |
| `custom` | 自定义 | 任何其他数据 |

## 📊 查询示例

### 获取所有对话记录

```bash
curl -X POST http://localhost:3000/api/query \
  -H 'Content-Type: application/json' \
  -d '{}' | grep "conversation"
```

### 统计各类型内存

```bash
curl -s http://localhost:3000/api/stats | python3 -c \
  "import sys, json; data = json.load(sys.stdin); \
   print(json.dumps(data['data']['by_type'], indent=2))"
```

## ⚙️ 环境配置

编辑 `.env` 文件来配置：

```bash
# Sui 区块链配置
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PACKAGE_ID=0x41140bd56f9e0c66141eb9bbbab71397d640055f2b60eb7ef12ca465e9f13f20

# Walrus 存储配置
WALRUS_ENDPOINT=https://walrus-testnet.walrus.live
WALRUS_TIMEOUT=30000

# API 配置
PORT=3000
NODE_ENV=development

# 功能开关
CACHE_ENABLED=true
ENCRYPTION_ENABLED=false
```

## 🚨 常见问题

### Q: 如何改变 API 监听端口？

A: 修改 `.env` 中的 `PORT` 或在启动时设置环境变量：
```bash
PORT=8080 pnpm start
```

### Q: 数据保存在哪里？

A: 
- **内存索引**: Sui 区块链
- **完整数据**: Walrus 分布式存储
- **热数据缓存**: 本地内存

### Q: 可以在生产环境使用吗？

A: 可以。系统已验证所有功能。建议：
1. 配置真实的 Walrus 端点
2. 启用加密（`ENCRYPTION_ENABLED=true`）
3. 使用持久存储而非内存缓存
4. 配置适当的备份策略

### Q: 如何删除所有内存？

A: 目前需要逐个删除。建议：
```bash
# 查询所有键
curl -X POST http://localhost:3000/api/query | \
  python3 -c "import sys, json; \
  [print(item['key']) for item in json.load(sys.stdin)['data']]" | \
  while read key; do
    curl -X DELETE http://localhost:3000/api/memory/$key
  done
```

## 📚 相关资源

- [架构文档](./ARCHITECTURE.md)
- [部署指南](./DEPLOY_TESTNET.md)
- [完整部署状态](./DEPLOYMENT_COMPLETE.md)
- [Sui 官方文档](https://docs.sui.io)
- [Walrus 项目](https://walrus.xyz)

## 🎯 下一步

1. 根据你的应用场景调整内存类型
2. 集成到你的 AI 框架（LangChain、AutoGen 等）
3. 配置加密和访问控制
4. 部署到生产环境

---

**需要帮助？** 查看 [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md) 获取更多信息。
