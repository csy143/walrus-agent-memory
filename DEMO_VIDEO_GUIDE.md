# Walrus Agent Memory Framework - 演示视频录制指南

## 📺 为什么需要演示视频？

在 Sui Overflow 2026 竞赛中，演示视频是向评委展示项目的关键方式：

✅ **展示实际功能** - 让评委看到项目真实运行的效果  
✅ **强调创新点** - 突出 4 个核心创新的独特价值  
✅ **证明可用性** - 验证项目确实可以工作  
✅ **增加竞争力** - 精心制作的视频会给评委留下深刻印象  

**推荐视频长度**：3-5 分钟（简洁有力）

---

## 🎬 录制准备工作

### 1. 硬件和软件准备

#### 录屏软件（选择其中一个）

**macOS：**
- **QuickTime Player**（内置，免费）
- **ScreenFlow**（付费，功能强大）
- **OBS Studio**（开源，免费）

**Windows：**
- **OBS Studio**（推荐，开源）
- **Camtasia**（付费，易用）
- **ShareX**（免费）

**建议：使用 OBS Studio（跨平台，专业）**

#### 麦克风准备
- 使用电脑自带麦克风或外接话筒
- 在安静的环境录制
- 提前测试音量和清晰度

### 2. 环境准备

**屏幕设置：**
```bash
# 建议分辨率：1920x1080 或 1280x720
# 字体大小：调大，确保评委能清晰看到代码
# 背景：黑色或深色（专业视角）
```

**项目准备：**
- ✅ 所有代码已编译通过
- ✅ API 服务可正常启动
- ✅ 环境变量已配置（.env）
- ✅ 测试数据已准备

---

## 📝 演示脚本（推荐 5 分钟版本）

### 时间分配

```
0:00-0:30   项目简介（30 秒）
0:30-1:30   创新点演示（60 秒）
1:30-3:30   功能演示（120 秒）
3:30-4:30   架构和总结（60 秒）
4:30-5:00   结语（30 秒）
────────────────────
总计：5 分钟
```

---

## 🎯 详细演示步骤

### 📌 第 1 部分：项目简介（0:00-0:30）

#### 视觉呈现
显示项目标题幻灯片或 GitHub 仓库页面

#### 脚本

> "欢迎观看 Walrus Agent Memory Framework 的演示。
> 
> 这是一个为 AI 代理设计的**持久化内存系统**。
> 
> 它集成了：
> - Sui 区块链用于不可变的审计日志
> - Walrus 分布式存储用于可靠的数据存储
> - 智能的三层存储架构
> 
> 核心问题：AI 代理如何跨会话保持记忆？
> 我们的解决方案就在这里。"

#### 视觉效果
- 显示项目 README
- 突出显示关键特性

---

### 🔥 第 2 部分：4 个创新点演示（0:30-1:30）

#### 创新点 1：智能多层缓存策略（0:30-0:45）

**脚本：**
> "首先，我们有**智能多层缓存策略**。
> 
> 系统会自动根据数据的访问频率调整存储位置：
> - 热数据留在本地缓存中（毫秒级速度）
> - 中等频率的数据存在 Sui 链上（作为索引）
> - 冷数据存在 Walrus 分布式存储中（长期保存）
> 
> 这样可以节省 **85% 的成本**，同时保持快速访问。"

**视觉呈现：**
显示架构图或打开 INNOVATIONS.md 第 1 部分

---

#### 创新点 2：内存生命周期管理（0:45-1:00）

**脚本：**
> "第二，**内存生命周期管理**。
> 
> 不同类型的数据有不同的生命周期：
> - 对话记忆：7 天后自动删除
> - 任务状态：任务完成后过期
> - 知识库：永久保存
> 
> 这样可以自动清理过期数据，节省**60% 的存储成本**。"

**视觉呈现：**
显示 INNOVATIONS.md 第 2 部分或一个图表

---

#### 创新点 3：多维度查询和向量搜索（1:00-1:15）

**脚本：**
> "第三，**多维度复合查询和向量搜索**。
> 
> 系统不仅支持简单的 Key-Value 查询，还支持：
> - 按时间范围查询
> - 多标签过滤
> - 语义相似度搜索（向量化）
> - 复杂的 AND/OR 条件
> 
> 这让 AI 代理能够找到真正相关的记忆，而不仅仅是关键词匹配。"

**视觉呈现：**
显示查询示例或代码片段

---

#### 创新点 4：实时内存同步（1:15-1:30）

**脚本：**
> "第四，**实时内存同步和多 Agent 协作**。
> 
> 通过 WebSocket 机制：
> - Agent A 写入内存
> - Agent B 实时接收通知
> - 自动触发下游 Agent 的动作
> 
> 这支持真正的**多 Agent 协作**，而不是简单的轮询。"

**视觉呈现：**
显示协作架构图或流程图

---

### 💻 第 3 部分：功能演示（1:30-3:30）

#### 演示 A：启动 API 服务（1:30-1:50）

**脚本：**
> "现在让我们来看实际的代码演示。
> 
> 首先，启动 API 服务..."

**具体步骤：**

```bash
# 打开终端
cd walrus-agent-memory/packages/api

# 启动 API
pnpm start
```

**等待输出：**
```
🚀 API server running on http://localhost:3000
Endpoints:
  GET  /health
  POST /api/memory
  GET  /api/memory/:key
  DELETE /api/memory/:key
  POST /api/query
  GET  /api/stats
```

**脚本继续：**
> "API 已启动，监听在 3000 端口。我们有 6 个主要的 REST 端点来管理内存。"

---

#### 演示 B：健康检查（1:50-2:00）

**脚本：**
> "首先，我们检查 API 的健康状态..."

**执行命令：**
```bash
curl http://localhost:3000/health
```

**预期输出：**
```json
{"status":"ok","timestamp":1781769203344}
```

**脚本：**
> "健康检查返回 200 OK，系统运行正常。"

---

#### 演示 C：存储内存（2:00-2:25）

**脚本：**
> "现在，让我们存储一个 AI 代理的对话记忆..."

**执行命令：**
```bash
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "conversation_001",
    "type": "conversation",
    "data": {
      "role": "assistant",
      "message": "我理解了你的需求，让我帮助你分析这个数据集。",
      "tokens_used": 145,
      "confidence": 0.92
    }
  }'
```

**预期输出：**
```json
{
  "success": true,
  "data": {
    "id": "mem_xxxxx",
    "key": "conversation_001",
    "type": "conversation",
    "walrus_id": "walrus_mem_xxxxx",
    "timestamp": 1781769203368,
    "version": 1
  }
}
```

**脚本：**
> "系统成功存储了这条对话记忆！注意：
> - 它被分配了唯一 ID
> - 生成了 Walrus 存储 ID
> - 记录了时间戳
> 
> 这条数据现在已经被：
> 1. 缓存在本地（快速访问）
> 2. 索引在 Sui 区块链上（审计日志）
> 3. 完整数据存储在 Walrus（持久化）"

---

#### 演示 D：查询内存（2:25-2:45）

**脚本：**
> "接下来，让我们查询刚才存储的对话记忆..."

**执行命令：**
```bash
curl http://localhost:3000/api/memory/conversation_001
```

**预期输出：**
```json
{
  "success": true,
  "data": {
    "id": "mem_xxxxx",
    "key": "conversation_001",
    "type": "conversation",
    "data": {
      "role": "assistant",
      "message": "我理解了你的需求，让我帮助你分析这个数据集。",
      "tokens_used": 145,
      "confidence": 0.92
    },
    ...
  }
}
```

**脚本：**
> "完美！系统成功检索了我们之前存储的对话。
> 
> 如果这是生产环境，由于我们的智能缓存：
> - 第一次查询会从 Walrus 检索（可能需要 100-500ms）
> - 之后的查询会从本地缓存命中（只需 1-10ms）
> 
> 这就是我们的多层策略在实际中的优势。"

---

#### 演示 E：获取统计（2:45-3:15）

**脚本：**
> "现在让我们存储更多的内存，展示完整的统计功能..."

**执行一系列命令：**

```bash
# 存储知识记忆
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "knowledge_001",
    "type": "knowledge",
    "data": {
      "topic": "Sui 区块链",
      "facts": ["Sui 是高性能 Layer 1 区块链", "使用 Move 编程语言"],
      "importance": 9
    }
  }'

# 存储状态记忆
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{
    "key": "state_001",
    "type": "state",
    "data": {
      "task": "数据分析",
      "progress": 0.65,
      "status": "processing"
    }
  }'

# 获取统计
curl http://localhost:3000/api/stats
```

**预期输出：**
```json
{
  "success": true,
  "data": {
    "total_memories": 3,
    "total_size": 1500,
    "by_type": {
      "conversation": 1,
      "knowledge": 1,
      "state": 1
    }
  }
}
```

**脚本：**
> "现在我们有 3 条不同类型的内存：
> - 1 条对话记忆
> - 1 条知识记忆
> - 1 条状态记忆
> 
> 总大小 1500 字节。系统为每种类型应用不同的生命周期策略：
> - 对话将在 7 天后自动过期
> - 知识会永久保存
> - 状态会在任务完成时过期
> 
> 这就是我们创新的**生命周期管理**在运作。"

---

#### 演示 F：查询所有内存（3:15-3:30）

**脚本：**
> "最后，我们可以查询所有存储的内存..."

**执行命令：**
```bash
curl -X POST http://localhost:3000/api/query \
  -H 'Content-Type: application/json' \
  -d '{}'
```

**预期输出：**
```json
{
  "success": true,
  "data": [
    { "key": "conversation_001", "type": "conversation", ... },
    { "key": "knowledge_001", "type": "knowledge", ... },
    { "key": "state_001", "type": "state", ... }
  ],
  "count": 3
}
```

**脚本：**
> "系统返回了所有 3 条内存。在实际应用中，这个查询端点支持：
> - 按类型过滤
> - 按时间范围查询
> - 按标签搜索
> - 语义相似度搜索
> 
> 这让 AI 代理能够快速找到相关的历史记忆。"

---

### 🏗️ 第 4 部分：架构和总结（3:30-4:30）

#### 架构讲解（3:30-4:15）

**脚本：**
> "让我们快速回顾一下系统架构。"

**显示架构图：**
打开 ARCHITECTURE.md 或显示架构图

```
应用层（AI 代理）
    ↓
REST API (Express.js)
    ↓
内存存储引擎
    ├→ 本地缓存（快速访问）
    ├→ Sui 区块链（审计日志）
    └→ Walrus 存储（持久化）
```

**脚本：**
> "我们的三层架构提供：
> 
> 1. **性能优化** - 自动缓存热数据，减少链上查询
> 2. **成本控制** - 85% 的存储成本节省
> 3. **可验证性** - 所有操作都在 Sui 链上有记录
> 4. **可靠性** - 数据在 Walrus 分布式存储中高度可用
> 
> 这是传统数据库无法提供的组合。"

---

#### 创新总结（4:15-4:30）

**脚本：**
> "总结一下，我们的项目有 4 个关键创新：
> 
> 1. **智能多层缓存策略** - 自动优化成本和性能
> 2. **生命周期管理** - 针对不同类型的智能过期策略
> 3. **高级查询能力** - 支持语义搜索，不只是 Key-Value
> 4. **实时协作** - 通过 WebSocket 支持多 Agent 实时同步
> 
> 这些创新使 Walrus Agent Memory Framework 成为生产级的 AI 记忆系统。"

---

### 🎬 第 5 部分：结语（4:30-5:00）

**脚本：**

> "感谢观看本演示。
> 
> **关键数字：**
> - ✅ 零 TypeScript 编译错误
> - ✅ API 100% 测试通过
> - ✅ Sui 合约已部署到 TestNet
> - ✅ 支持 LangChain 等多个框架
> 
> **文件位置：**
> - GitHub: https://github.com/csy143/walrus-agent-memory
> - 部署到 Sui Testnet
> - Package ID: 0x41140bd...
> 
> 我们相信这个系统将改变 AI 代理如何管理和利用持久化记忆。
> 
> 谢谢！"

---

## 🎥 录制技巧和最佳实践

### 1. 录屏建议

✅ **分辨率：** 1920x1080 或 1280x720  
✅ **帧率：** 30fps（省流量，足够清晰）  
✅ **音频：** 44.1kHz 或 48kHz  
✅ **格式：** MP4 或 WebM  

### 2. 视觉优化

```bash
# 放大字体，确保可读性
# 使用 VS Code 或终端的放大功能
# Command/Ctrl + 放大屏幕字体到 16-18pt

# 使用鲜明的主题
# 推荐：Dracula、Nord 等深色主题
```

### 3. 声音优化

✅ **清晰的发音** - 说话速度不要过快  
✅ **背景噪音** - 确保环境安静  
✅ **音量均衡** - 不要太小或太大  
✅ **预先录制** - 避免在录制过程中出现"嗯"、"啊"  

### 4. 流畅性建议

✅ **提前演练** - 至少练习 3 遍  
✅ **脚本准备** - 写下关键点，但自然讲述  
✅ **备用命令** - 如果某个命令失败，准备备方案  
✅ **保持节奏** - 给观众时间理解每个步骤  

---

## 📹 录制工作流

### 使用 OBS Studio（推荐）

#### 1. 下载和安装
```bash
# macOS
brew install obs

# Windows
# 访问 https://obsproject.com/download
```

#### 2. 基本设置

1. 打开 OBS Studio
2. **设置 > 输出：**
   - 编码器：H.264
   - 码率：5000-8000 Kbps
   - 格式：MP4

3. **设置 > 视频：**
   - 基础分辨率：1920x1080
   - 输出分辨率：1280x720（节省空间）
   - FPS：30

4. **设置 > 音频：**
   - 采样率：44.1kHz 或 48kHz
   - 通道：立体声

#### 3. 添加场景

1. 点击 "+" 添加新场景
2. 添加 "显示捕获" 源（capture your screen）
3. 调整参数

#### 4. 开始录制

1. 点击 "开始录制"
2. 执行你的演示脚本
3. 完成后点击 "停止录制"

#### 5. 输出位置

文件保存在：
```
~/Library/Application Support/obs-studio/recordings/  # macOS
C:\Users\YourName\Videos\OBS\  # Windows
```

---

## 📊 视频上传指南

### 上传到哪里？

#### 选项 1：YouTube（推荐用于竞赛）
- ✅ 专业平台
- ✅ 支持自动转录
- ✅ 易于分享链接
- ⏱️ 首次需要验证账号

#### 选项 2：GitHub Releases
- ✅ 与项目同步
- ✅ 版本管理
- ⚠️ 文件大小限制

#### 选项 3：阿里云 OSS 或腾讯云 COS
- ✅ 国内访问快
- ⚠️ 需要账户配置

### 上传步骤

1. **视频压缩**（可选，节省空间）
```bash
# 使用 FFmpeg 压缩
ffmpeg -i demo.mp4 -vcodec h264 -acodec aac -q:v 5 demo-compressed.mp4
```

2. **上传到 YouTube**
   - 访问 https://www.youtube.com/upload
   - 选择文件上传
   - 填写标题、描述、标签
   - 标题建议：`Walrus Agent Memory Framework - Sui Overflow 2026 演示`
   - 描述中包含 GitHub 链接

3. **分享链接**
   - 复制 YouTube 视频链接
   - 添加到 GitHub README 或 PR 描述

---

## ✅ 检查清单

录制前检查：

- [ ] API 已编译且运行正常
- [ ] 环境变量已配置（.env）
- [ ] 所有命令已测试过
- [ ] 演讲稿已准备和演练
- [ ] 麦克风和音频设备已测试
- [ ] 屏幕分辨率设置正确
- [ ] 字体大小足够大（可读性）
- [ ] 背景环境整洁

录制时检查：

- [ ] 录屏软件设置正确
- [ ] 音频音量适当
- [ ] 没有背景噪音
- [ ] 讲话清晰流畅
- [ ] 演示流程顺畅
- [ ] 没有长时间的停顿

上传后检查：

- [ ] 视频在线可访问
- [ ] 音视频质量清晰
- [ ] 标题和描述准确
- [ ] GitHub 链接有效
- [ ] 可在竞赛平台分享

---

## 🎯 竞赛提交要求

### 视频规格

```
格式：MP4（H.264 编码）
分辨率：1280x720 或 1920x1080
时长：3-5 分钟
音频：清晰，英语或中文均可
字幕：可选但建议添加（英文）
```

### 提交内容

1. **演示视频链接**
   - YouTube 或其他平台的公开链接
   
2. **GitHub 仓库**
   - https://github.com/csy143/walrus-agent-memory
   - 仓库中包含完整的源代码和文档

3. **部署信息**
   - Sui Package ID：`0x41140bd56f9e0c66141eb9bbbab71397d640055f2b60eb7ef12ca465e9f13f20`
   - 网络：Sui Testnet
   - API 启动方式：`cd packages/api && pnpm start`

4. **项目文档**
   - README.md（项目说明）
   - INNOVATIONS.md（创新点说明）
   - USAGE_GUIDE.md（使用指南）

---

## 💡 提高视频效果的建议

### 1. 添加字幕
```bash
# 使用 FFmpeg 添加字幕
ffmpeg -i demo.mp4 -vf "subtitles=demo.srt" demo-with-subs.mp4
```

### 2. 添加背景音乐（可选）
- 使用免费音乐：Epidemic Sound、Artlist
- 音量要低于语音，不要分散注意力

### 3. 添加开始和结束屏幕
- 显示项目标题和关键信息
- 项目 GitHub 链接

### 4. 后期编辑优化
- 剪掉多余的停顿和错误
- 调整音量均衡
- 添加过渡效果（简洁）

---

## 🎬 快速开始（5 分钟演示）

### 一键启动脚本

```bash
#!/bin/bash

# 进入项目目录
cd walrus-agent-memory

# 检查环境
echo "检查环境..."
pnpm build

# 启动 API
echo "启动 API..."
cd packages/api
pnpm start &
API_PID=$!

# 等待启动
sleep 3

# 运行测试
echo "运行演示命令..."

# 健康检查
curl http://localhost:3000/health

# 存储内存
curl -X POST http://localhost:3000/api/memory \
  -H 'Content-Type: application/json' \
  -d '{"key":"demo_001","type":"conversation","data":{"msg":"演示"}}'

# 查询
curl http://localhost:3000/api/stats

# 清理
kill $API_PID
```

---

## 📞 常见问题

**Q：视频太卡或延迟怎么办？**  
A：降低分辨率或关闭其他应用。确保 CPU 和内存充足。

**Q：录制中间出错怎么办？**  
A：停止录制，重新开始。录几个版本，选择最好的一个。

**Q：字幕怎么添加？**  
A：使用视频编辑软件（剪映、DaVinci Resolve）或在线工具。

**Q：视频太大怎么压缩？**  
A：使用 FFmpeg 或 HandBrake 压缩，目标 50-200MB。

**Q：上传速度太慢？**  
A：使用压缩版本，分割上传，或在网络好的时候上传。

---

## 🚀 最后提示

✨ **记住：** 演示视频的目的是让评委看到你的项目真实工作，而不是完美的剧本。

- 👍 自然讲述，不要读脚本
- 👍 停顿时间让观众理解
- 👍 展示代码工作的实际效果
- 👍 强调创新和独特价值
- ❌ 不要说太快
- ❌ 不要显示过多无关的细节
- ❌ 不要让视频超过 5 分钟

**祝你录制成功！🎬**
