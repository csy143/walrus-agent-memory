# Sui Overflow 2026 中文区 提交流程指南

这是一份详细的提交流程，用于将 Walrus Agent Memory Framework 提交到 Sui Overflow 2026 中文区官方仓库。

## 📋 提交要求概览

官方中文区仓库: https://github.com/hoh-zone/Overflow2026-CNNo1

**提交步骤** (3 步)：
1. Fork 官方仓库
2. 复制模板目录，重命名为你的 GitHub ID
3. 编辑 README.md，提交 Pull Request

---

## 🚀 详细提交流程

### 第 1 步：创建你自己的项目 GitHub 仓库

#### 1.1 在 GitHub 创建新仓库
- 访问 https://github.com/new
- **Repository name**: `walrus-agent-memory`
- **Description**: "Persistent memory framework for AI agents using Sui and Walrus"
- **Visibility**: Public （公开，便于参赛评审）
- 点击 "Create repository"

#### 1.2 获取仓库 URL
创建后，GitHub 会显示你的仓库 URL，格式为：
```
https://github.com/YOUR_GITHUB_ID/walrus-agent-memory.git
```

记下你的 **GitHub ID**（比如 `chenshiyu`）和 **仓库 URL**。

---

### 第 2 步：推送代码到你的 GitHub 仓库

在项目目录执行以下命令：

```bash
cd /Users/chenshiyu/walrus-agent-memory

# 添加你的仓库为 remote
git remote add origin https://github.com/YOUR_GITHUB_ID/walrus-agent-memory.git

# 推送代码到 main 分支
git branch -M main
git push -u origin main
```

**预期输出**：
```
Enumerating objects: 42, done.
Counting objects: 100% (42/42), done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ 代码已成功推送！

---

### 第 3 步：Fork 官方中文区仓库

1. 访问 https://github.com/hoh-zone/Overflow2026-CNNo1
2. 点击右上角的 **Fork** 按钮
3. 确认选项，完成 Fork

Fork 后，你会得到你的 Fork 仓库：
```
https://github.com/YOUR_GITHUB_ID/Overflow2026-CNNo1
```

---

### 第 4 步：Clone Fork 后的仓库到本地

```bash
git clone https://github.com/YOUR_GITHUB_ID/Overflow2026-CNNo1.git
cd Overflow2026-CNNo1
```

---

### 第 5 步：创建项目提交目录

```bash
# 进入 submissions 目录
cd submissions

# 复制模板目录
cp -r _template/ YOUR_GITHUB_ID

# 进入你的项目目录
cd YOUR_GITHUB_ID

# 你现在有：
# - README.md （项目模板）
# - （可选）project1.md、project2.md 等
```

**目录结构**：
```
submissions/
├── _template/
├── your-github-id/          # ← 你的目录
│   └── README.md
└── other-users/
```

---

### 第 6 步：填写项目信息

编辑 `submissions/YOUR_GITHUB_ID/README.md`：

```markdown
# Walrus Agent Memory Framework / Walrus 代理记忆框架

## Track / 赛道

- [ ] Agentic Web
- [ ] DeFi & Payments
- [ ] DeepBook
- [x] Walrus        ← 勾选你的赛道

## Description / 项目简介

为 AI 代理提供基于 Sui 区块链和 Walrus 分布式存储的持久化内存系统。
系统采用三层存储模型：本地缓存（快速访问）+ Sui（审计日志）+ Walrus（数据存储）。
支持多种记忆类型（对话、知识、状态等），提供 REST API 接口和框架无关的设计。

## Links / 链接

- DeepSurge: https://deepsurge.io/... (项目展示页)
- GitHub: https://github.com/YOUR_GITHUB_ID/walrus-agent-memory
- Demo Video: https://youtube.com/... (≤ 5 min)
- Website: https://... (optional)

## Team / 团队成员

- @YOUR_GITHUB_ID

## Deployment / 部署信息

- Env: Testnet
- Package ID: `0x41140bd56f9e0c66141eb9bbbab71397d640055f2b60eb7ef12ca465e9f13f20`

## Swag / 周边

- [ ] 我希望接收周边 / I'd like to receive swag
```

**关键填写说明**：

| 字段 | 说明 | 例子 |
|------|------|------|
| **Track** | 选择赛道，改 `[ ]` 为 `[x]` | 本项目选 Walrus |
| **Description** | 简洁描述项目做什么 | 一段话，50-100 字 |
| **GitHub** | 你的项目仓库链接 | https://github.com/your-id/walrus-agent-memory |
| **Package ID** | Sui 部署的合约地址 | 0x41140bd... |
| **Env** | 部署环境 | Testnet 或 Mainnet |

---

### 第 7 步：提交 Pull Request

#### 7.1 提交本地改动

```bash
# 确保你在 submissions/YOUR_GITHUB_ID 目录编辑了 README.md

# 返回仓库根目录
cd /path/to/Overflow2026-CNNo1

# 检查改动
git status

# 添加改动
git add submissions/YOUR_GITHUB_ID/README.md

# 创建提交
git commit -m "feat: submit Walrus Agent Memory Framework project"

# 推送到你的 Fork
git push origin main
```

#### 7.2 在 GitHub 创建 Pull Request

1. 访问你的 Fork 仓库：https://github.com/YOUR_GITHUB_ID/Overflow2026-CNNo1
2. 你会看到提示 "This branch is 1 commit ahead of hoh-zone:main"
3. 点击 **"Contribute" > "Open pull request"**
4. 确认 PR 信息：
   - **Base**: hoh-zone/Overflow2026-CNNo1 (main)
   - **Head**: YOUR_GITHUB_ID/Overflow2026-CNNo1 (main)
5. 点击 **"Create pull request"**

#### 7.3 填写 PR 标题和描述

```
标题：
[Walrus] Walrus Agent Memory Framework - Persistent Memory for AI Agents

描述：
## 项目介绍

这是一个为 AI 代理提供持久化内存的完整系统，利用 Sui 区块链和 Walrus 分布式存储。

## 关键特性

- ✅ Sui 区块链集成（合约已部署）
- ✅ Walrus 分布式存储
- ✅ REST API 服务
- ✅ 多种记忆类型支持
- ✅ 框架无关的设计

## 快速开始

见 https://github.com/YOUR_GITHUB_ID/walrus-agent-memory#quick-start

## 部署信息

- Chain: Sui Testnet
- Package ID: 0x41140bd56f9e0c66141eb9bbbab71397d640055f2b60eb7ef12ca465e9f13f20
```

---

## 📝 完整命令速查

```bash
# 1. 推送你的项目到 GitHub
git remote add origin https://github.com/YOUR_GITHUB_ID/walrus-agent-memory.git
git push -u origin main

# 2. Clone 官方仓库的 Fork
git clone https://github.com/YOUR_GITHUB_ID/Overflow2026-CNNo1.git
cd Overflow2026-CNNo1

# 3. 创建项目目录
cd submissions
cp -r _template/ YOUR_GITHUB_ID
cd YOUR_GITHUB_ID

# 4. 编辑 README.md
nano README.md  # 或用你喜欢的编辑器

# 5. 提交并推送
cd ../..
git add submissions/YOUR_GITHUB_ID/README.md
git commit -m "feat: submit Walrus Agent Memory Framework project"
git push origin main

# 6. 在 GitHub 创建 PR
# → 访问 https://github.com/YOUR_GITHUB_ID/Overflow2026-CNNo1
# → 点击 "Contribute" → "Open pull request"
```

---

## ✅ 提交检查清单

提交前请确认以下内容：

- [ ] GitHub ID 和仓库 URL 已替换（搜索 `YOUR_GITHUB_ID`）
- [ ] 赛道选择正确（Walrus）
- [ ] 项目描述清晰简洁
- [ ] 所有链接有效（GitHub, Demo 等）
- [ ] 团队成员 GitHub ID 正确
- [ ] 部署信息完整（Package ID, Testnet）
- [ ] README.md 语法正确（Markdown 格式）
- [ ] PR 标题清晰，描述详细
- [ ] 你的项目仓库是公开的

---

## 🎯 预期结果

提交后，你会看到：

1. **PR 已创建**：官方仓库会收到你的 PR
2. **自动检查**：GitHub Actions 会运行自动检查
3. **等待审核**：官方团队审核并合并
4. **入选名单**：合并后，你的项目会出现在官方中文区列表中

---

## 💡 额外提示

### 如果需要修改提交内容

```bash
# 修改本地 README.md
nano submissions/YOUR_GITHUB_ID/README.md

# 推送更新
git add submissions/YOUR_GITHUB_ID/README.md
git commit -m "fix: update project description"
git push origin main

# PR 会自动更新
```

### 官方重要链接

- **官方仓库**: https://github.com/hoh-zone/Overflow2026-CNNo1
- **提交指南**: https://github.com/hoh-zone/Overflow2026-CNNo1/blob/main/guide.md
- **常见问题**: https://github.com/hoh-zone/Overflow2026-CNNo1/blob/main/faq.md
- **赛道详情**: https://github.com/hoh-zone/Overflow2026-CNNo1/tree/main/tracks
- **官方手册**: https://mystenlabs.notion.site/overflow-2026-handbook

---

## 📞 需要帮助？

如有问题，请：
1. 查看官方 FAQ: https://github.com/hoh-zone/Overflow2026-CNNo1/blob/main/faq.md
2. 在官方仓库提交 Issue
3. 查看其他已提交的项目作为参考

---

**准备好了？** 按照上述步骤逐一执行，大约 10-15 分钟即可完成提交！

祝你的项目顺利参赛！🎉
