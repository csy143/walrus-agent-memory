# Demo 录制脚本 - 5 分钟演示

## 概述

这个脚本将引导你完成一个完整的 5 分钟 Walrus Agent Memory Framework 演示。

**视频规格：**
- 时长：4-5 分钟
- 分辨率：1920x1080 或 1280x720
- 格式：MP4 (H.264)
- 音频：清晰的语音
- 帧率：30fps

---

## 录制前检查清单

- [ ] 安静的环境
- [ ] 关闭其他应用
- [ ] 终端字体调大（16-18pt）
- [ ] API 还未运行
- [ ] 录屏软件已准备（OBS、QuickTime 或 ScreenFlow）
- [ ] 测试音频和麦克风
- [ ] 清理桌面

---

## 演示段落

### 第 1 段：介绍（0:00-0:45）

**要显示的内容：** 项目 README 和架构图

**要说的词：**

```
This is Walrus Agent Memory Framework - 
a persistent memory system for AI agents.

Instead of losing context between sessions, 
agents can now remember conversations, knowledge, state.

Let me show you how it works.
```

**操作步骤：**
1. 打开 README.md 或项目 GitHub 页面（5 秒）
2. 显示架构图部分（15 秒）
3. 指向"Key Innovations"部分（15 秒）

---

### 第 2 段：快速开始（0:45-1:30）

**要显示的内容：** 构建和启动 API

**要说的词：**

```
Let's build the project first.
```

**终端命令：**

```bash
cd walrus-agent-memory
pnpm build
```

等待构建完成（约 5 秒）。

**要说的词：**

```
Good, build is done. Now starting the API.
```

**终端命令：**

```bash
cd packages/api
pnpm start
```

等待 API 启动并显示：
```
🚀 API server running on http://localhost:3000
```

**要说的词：**

```
API is up and running. We have 6 endpoints here for managing memories.
```

---

### 第 3 段：健康检查（1:30-1:50）

**要显示的内容：** 健康端点验证

**操作：** 在 API 运行时打开新的终端标签页

**终端命令：**

```bash
curl http://localhost:3000/health
```

预期输出：
```json
{"status":"ok","timestamp":1718728393123}
```

**要说的词：**

```
Good - the API is responding with status OK.
```

---

### 第 4 段：存储内存（1:50-2:45）

**要显示的内容：** 存储不同类型的内存

**存储对话内存：**

```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "conversation_001",
    "type": "conversation",
    "data": {
      "role": "assistant",
      "message": "I understand your analysis requirements. Let me help you with the data.",
      "tokens_used": 145,
      "confidence": 0.92
    }
  }'
```

**要说的词：**

```
Now let's store a conversation. 
Look at the response - we get back an ID, a Walrus blob ID, and timestamp.
The data goes into three places: local cache, Sui blockchain, and Walrus.
```

**存储知识内存：**

```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "knowledge_001",
    "type": "knowledge",
    "data": {
      "topic": "Sui Blockchain",
      "facts": ["High throughput", "Low cost", "Move language"],
      "importance": 9
    }
  }'
```

**要说的词：**

```
Now storing knowledge memory. Different types have different lifecycles -
conversations auto-expire in 7 days, knowledge stays permanent.
```

---

### 第 5 段：查询和统计（2:45-3:45）

**要显示的内容：** 检索和查询内存

**检索内存：**

```bash
curl http://localhost:3000/api/memory/conversation_001
```

**要说的词：**

```
Now retrieving - notice it comes back instantly from the local cache.
If we hadn't accessed it recently, it would fetch from Walrus instead.
```

**查询所有内存：**

```bash
curl -X POST http://localhost:3000/api/query -H 'Content-Type: application/json' -d '{}'
```

**要说的词：**

```
Here we can query all stored memories. 
We support semantic search, time-range queries, complex filtering.
```

**获取统计信息：**

```bash
curl http://localhost:3000/api/stats
```

**要说的词：**

```
Look - we have 2 memories stored, with the size breakdown.
```

---

### 第 6 段：主要创新（3:45-4:45）

**要显示的内容：** 视觉说明或简要解释

**要说的词：**

```
What we just saw demonstrates our four key innovations:

First - intelligent multi-tier caching. 
Hot data stays in local cache for 1ms responses.
Reduces costs by 85% compared to running 24/7 servers.

Second - memory lifecycle management.
Conversations expire after 7 days automatically.
Knowledge stays permanent. Saves 60% on storage.

Third - advanced querying.
Not just key-value lookup - we do semantic search,
time-range queries, complex filtering.

Fourth - real-time multi-agent synchronization.
When one agent writes, others get notified instantly via WebSocket.

And the cost is 30x cheaper than Pinecone,
while doing a lot more.
```

**可选操作：** 打开 INNOVATIONS.md 显示更多细节

---

### 第 7 段：结尾（4:45-5:00）

**要说的词：**

```
Everything is production-ready.
The code is fully deployed on Sui TestNet.
Works with LangChain, AutoGen, and custom frameworks.

Try it yourself:
github.com/csy143/walrus-agent-memory

Thank you!
```

---

## 录制技巧

### 视频质量
- 使用深色终端主题（Dracula、Nord 等）
- 放大字体到 16-18pt
- 使用高对比度颜色

### 音频质量
- 清晰地说话，语速适中
- 每个命令执行完后暂停
- 没有背景噪音
- 录制前测试麦克风

### 时间管理
- 不要急着运行命令
- 让每个命令完全执行
- 每个输出后暂停约 2 秒
- 总时长 4:30-5:30 都可以

### 出错恢复
- 如果出错，停止录制
- 休息 10 秒
- 从那个段落重新开始
- 后期用视频编辑器合并

---

## 后期处理

### 视频编辑（可选）

如果想增强视频效果：

1. **修剪和合并：** 用简单编辑器（iMovie、DaVinci Resolve）
2. **添加标题：** 30 秒的项目名称标题卡
3. **添加字幕：** YouTube 自动字幕可以
4. **音频标准化：** 保持音量一致

### 上传到 YouTube

1. 访问 youtube.com/upload
2. 标题：`Walrus Agent Memory Framework - Demo`
3. 描述：
```
Walrus Agent Memory Framework - Production-Ready 
Persistent Memory for AI Agents

演示内容：
✅ 系统架构和主要创新
✅ API 启动和健康检查
✅ 存储对话和知识内存
✅ 查询和检索内存
✅ 4 个主要创新的解释

GitHub: https://github.com/csy143/walrus-agent-memory
Sui Package: 0x41140bd56f9e0c66141eb9bbbab71397d640055f2b60eb7ef12ca465e9f13f20
```

4. 标签：`Walrus`, `Sui`, `AI`, `Agent`, `Memory`, `Blockchain`
5. 可见性：公开或不公开
6. 复制视频 URL

---

## 故障排除

**问题：** API 无法启动

```bash
# 检查 3000 端口是否已被使用
lsof -i :3000
# 杀死进程
kill -9 <PID>
# 或使用不同的端口
PORT=3001 pnpm start
```

**问题：** curl 命令失败

```bash
# 确保 API 在另一个终端中运行
# 验证：curl http://localhost:3000/health
```

**问题：** 包未找到

```bash
# 确保在正确的目录中
cd packages/api
# 检查 Node.js 已安装
node --version  # 应该是 18+
```

---

## 成功标准

录制完成后，检查：

- [ ] 视频时长 4-5 分钟
- [ ] 音频清晰（无背景噪音）
- [ ] 终端文字清晰易读
- [ ] 所有命令成功执行
- [ ] 解释了全部 4 个创新点
- [ ] 结尾信息清晰
- [ ] 视频已上传到 YouTube
- [ ] YouTube URL 可公开访问

---

## 快速命令参考

**启动 API：**
```bash
cd packages/api && pnpm start
```

**健康检查：**
```bash
curl http://localhost:3000/health
```

**存储内存：**
```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{"key":"test","type":"conversation","data":{}}'
```

**查询统计：**
```bash
curl http://localhost:3000/api/stats
```

---

祝你录制顺利！🎬
