# 快速参考 - 所有命令

复制粘贴即可运行！

---

## 🎯 3 分钟快速开始

```bash
# 1. 部署 Sui 合约 (首次，需要 0.5 SUI)
cd /Users/chenshiyu/walrus-agent-memory/packages/contracts
sui move build
sui client publish --gas-budget 10000000
# ⭐ 复制输出的 Package ID

# 2. 配置环境
cd /Users/chenshiyu/walrus-agent-memory
cat > .env << 'EOF'
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PACKAGE_ID=0x...  # 粘贴你的 Package ID
WALRUS_ENDPOINT=https://walrus-testnet.walrus.live
PORT=3000
EOF

# 3. 构建
pnpm install
pnpm build

# 4. 运行 (3 个终端窗口)
# 终端 1: API
cd packages/api && pnpm dev

# 终端 2: 示例
npx ts-node examples/complete-example.ts

# 终端 3: 测试 API
curl http://localhost:3000/health
```

---

## 📋 常用命令速查

### 部署相关

```bash
# 检查 Sui 版本
sui --version

# 查看活跃网络
sui client active-env

# 查看钱包地址
sui client active-address

# 查看余额
sui client gas

# 编译合约
cd packages/contracts
sui move build

# 部署合约
sui client publish --gas-budget 10000000

# 查看部署的对象
sui client objects

# 查看最近交易
sui client tx-history --limit 5
```

### 项目构建

```bash
# 安装所有依赖
pnpm install

# 构建所有包
pnpm build

# 构建特定包
cd packages/sdk && pnpm build
cd packages/api && pnpm build

# 清理构建
pnpm clean
```

### 运行服务

```bash
# 启动 API 服务
cd packages/api
pnpm dev

# 启动 LangChain Bot 示例
cd examples/langchain-bot
pnpm dev

# 运行完整示例
npx ts-node examples/complete-example.ts

# 运行特定示例 (1-5)
npx ts-node examples/complete-example.ts 1
npx ts-node examples/complete-example.ts 5
```

### API 测试

```bash
# 健康检查
curl http://localhost:3000/health

# 存储内存
curl -X POST http://localhost:3000/api/memory \
  -H "Content-Type: application/json" \
  -d '{"key":"test","type":"conversation","data":{"message":"hello"}}'

# 检索内存
curl http://localhost:3000/api/memory/test

# 更新内存
curl -X PUT http://localhost:3000/api/memory/test \
  -H "Content-Type: application/json" \
  -d '{"type":"conversation","data":{"message":"updated"}}'

# 删除内存
curl -X DELETE http://localhost:3000/api/memory/test

# 查询统计
curl http://localhost:3000/api/stats

# 查询内存
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"filter":{"type":"conversation"}}'

# 搜索
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"hello"}'
```

### 环境变量

```bash
# 查看当前 .env
cat .env

# 编辑 .env
nano .env

# 导出变量
export WALRUS_ENDPOINT=https://walrus-testnet.walrus.live
export SUI_PACKAGE_ID=0x...
```

### 获取测试币

```bash
# 通过 API
WALLET=$(sui client active-address)
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
  --header 'Content-Type: application/json' \
  --data-raw "{\"FixedAmountRequest\": {\"recipient\": \"$WALLET\"}}"

# 或通过 Discord
# https://discord.gg/sui
# 在 #testnet-faucet 频道输入: !faucet <你的地址>
```

---

## 🔍 调试命令

```bash
# 查看详细的错误信息
DEBUG=* pnpm dev

# 查看 Sui RPC 响应
curl -X POST https://fullnode.testnet.sui.io:443 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"sui_getChainIdentifier","params":[],"id":1}'

# 测试 Walrus 连接
curl https://walrus-testnet.walrus.live/health

# 查看日志
tail -f ~/.sui/sui_config/client.yaml

# 检查端口占用
lsof -i :3000

# 杀死占用端口的进程
kill -9 $(lsof -t -i :3000)
```

---

## 📂 重要文件位置

```bash
# 项目根目录
cd /Users/chenshiyu/walrus-agent-memory

# Sui 配置
~/.sui/sui_config/client.yaml

# Sui 私钥
~/.sui/sui_config/sui.keystore

# 项目 .env
/Users/chenshiyu/walrus-agent-memory/.env

# SDK 源码
packages/sdk/src/

# API 源码
packages/api/src/

# Sui 合约
packages/contracts/sources/

# 示例应用
examples/complete-example.ts
examples/langchain-bot/src/bot.ts
```

---

## 🎯 完整工作流

```bash
# 1️⃣ 初始设置 (第一次)
cd /Users/chenshiyu/walrus-agent-memory
cp .env.example .env
# 编辑 .env

# 2️⃣ 部署合约 (第一次)
cd packages/contracts
sui move build
sui client publish --gas-budget 10000000
# 复制 Package ID 到 .env

# 3️⃣ 每次开发
cd /Users/chenshiyu/walrus-agent-memory
pnpm install  # 如果有新依赖
pnpm build

# 4️⃣ 运行服务 (需要 3 个终端)
# 终端 1
cd packages/api && pnpm dev

# 终端 2
npx ts-node examples/complete-example.ts

# 终端 3
# 使用 curl 测试 API
curl http://localhost:3000/health
```

---

## 🔧 配置快速参考

### .env 必要变量

```env
# ✅ 必要
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
SUI_PACKAGE_ID=0x...
WALRUS_ENDPOINT=https://walrus-testnet.walrus.live

# ℹ️ 可选
PORT=3000
NODE_ENV=development
CACHE_ENABLED=true
ENCRYPTION_ENABLED=false
```

### Sui 网络选择

```env
# Testnet (推荐开发)
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Mainnet (生产)
SUI_RPC_URL=https://fullnode.mainnet.sui.io:443

# 本地
SUI_RPC_URL=http://127.0.0.1:9000
```

### Walrus 端点

```env
# Testnet (推荐)
WALRUS_ENDPOINT=https://walrus-testnet.walrus.live

# 本地 (需要 Docker)
WALRUS_ENDPOINT=http://localhost:31415
```

---

## ⚡ 性能命令

```bash
# 监视 API 响应时间
watch 'curl -s -w "Time: %{time_total}s\n" http://localhost:3000/api/stats'

# 压力测试 (需要 Apache Bench)
ab -n 100 -c 10 http://localhost:3000/health

# 监视内存使用
watch 'ps aux | grep node'

# 查看网络连接
lsof -i -P -n | grep node
```

---

## 🐛 故障排查快速命令

```bash
# 问题: "Cannot connect to Walrus"
curl https://walrus-testnet.walrus.live/health

# 问题: "Package ID not found"
cat .env | grep SUI_PACKAGE_ID

# 问题: "Port 3000 in use"
lsof -i :3000
kill -9 <PID>

# 问题: "Out of memory"
npm cache clean --force
pnpm store prune

# 问题: "Module not found"
pnpm install
pnpm build

# 问题: "RPC error"
curl -X POST https://fullnode.testnet.sui.io:443 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"sui_getChainIdentifier","params":[],"id":1}'
```

---

## 📊 监控命令

```bash
# 实时查看 API 统计
watch -n 1 'curl -s http://localhost:3000/api/stats | jq ".data"'

# 查看所有保存的内存
curl -s -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.data | length'

# 查看特定类型的内存数量
curl -s -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"filter":{"type":"conversation"}}' | jq '.data | length'
```

---

## 🚀 一键启动脚本

保存为 `start.sh`:

```bash
#!/bin/bash

echo "🚀 启动 Walrus Agent Memory Framework"
echo ""

# 检查 .env
if [ ! -f .env ]; then
    echo "❌ 缺少 .env 文件"
    echo "创建 .env:"
    cp .env.example .env
    echo "✅ 已创建 .env，请编辑并添加 SUI_PACKAGE_ID"
    exit 1
fi

# 检查依赖
echo "📦 检查依赖..."
pnpm install > /dev/null 2>&1

# 构建
echo "🔨 构建..."
pnpm build > /dev/null 2>&1

# 启动 API
echo "🚀 启动 API 服务在端口 3000..."
cd packages/api
pnpm dev &
API_PID=$!

# 等待 API 启动
sleep 2

# 启动示例
echo "🤖 启动示例..."
cd ../../
npx ts-node examples/complete-example.ts

# 清理
kill $API_PID
```

使用方法:
```bash
chmod +x start.sh
./start.sh
```

---

## 📝 快速备忘单

| 任务 | 命令 |
|------|------|
| 部署合约 | `cd packages/contracts && sui move build && sui client publish --gas-budget 10000000` |
| 启动 API | `cd packages/api && pnpm dev` |
| 运行示例 | `npx ts-node examples/complete-example.ts` |
| 测试 API | `curl http://localhost:3000/health` |
| 查看日志 | `pnpm dev 2>&1 \| tee app.log` |
| 杀死进程 | `kill -9 $(lsof -t -i :3000)` |
| 清理缓存 | `pnpm clean && rm -rf node_modules && pnpm install` |
| 检查配置 | `cat .env` |
| 查看余额 | `sui client gas` |
| 获取测试币 | 访问 https://discord.gg/sui (在 #testnet-faucet) |

---

## 🎓 下一步

- ✅ 运行示例: `npx ts-node examples/complete-example.ts`
- 📖 阅读文档: `cat DEPLOY_TESTNET.md`
- 🔗 集成到你的应用: `cat INTEGRATION_GUIDE.md`
- 🚀 部署到生产: `cat docs/ARCHITECTURE.md`

---

**保存这个文件为书签！** 📌
