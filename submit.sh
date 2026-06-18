#!/bin/bash

# Sui Overflow 2026 中文区项目提交脚本
# 自动化将项目推送到 GitHub 并提交到官方仓库

set -e  # 如果任何命令失败，脚本退出

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Sui Overflow 2026 - 中文区项目提交自动化脚本            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# 获取 GitHub ID
read -p "请输入你的 GitHub ID (例: chenshiyu): " GITHUB_ID

if [ -z "$GITHUB_ID" ]; then
  echo "❌ GitHub ID 不能为空"
  exit 1
fi

GITHUB_REPO_URL="https://github.com/$GITHUB_ID/walrus-agent-memory.git"
OFFICIAL_REPO="https://github.com/hoh-zone/Overflow2026-CNNo1.git"

echo ""
echo "📋 配置信息:"
echo "  GitHub ID: $GITHUB_ID"
echo "  项目仓库: $GITHUB_REPO_URL"
echo "  官方仓库: $OFFICIAL_REPO"
echo ""

# 第 1 步：推送项目到 GitHub
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "第 1 步：推送项目代码到 GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /Users/chenshiyu/walrus-agent-memory

# 检查是否已有 origin remote
if git remote get-url origin 2>/dev/null | grep -q "github"; then
  echo "✅ Origin 已配置: $(git remote get-url origin)"
  echo ""
  read -p "是否要替换为新的仓库? (y/n): " replace
  if [ "$replace" = "y" ]; then
    git remote remove origin
    git remote add origin "$GITHUB_REPO_URL"
    echo "✅ Origin 已更新"
  fi
else
  echo "添加 origin remote..."
  git remote add origin "$GITHUB_REPO_URL"
  echo "✅ Origin 已添加"
fi

echo ""
echo "推送代码到 GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ 第 1 步完成：项目代码已推送到 GitHub"
echo "   仓库地址: https://github.com/$GITHUB_ID/walrus-agent-memory"
echo ""

# 第 2 步：Fork 官方仓库
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "第 2 步：Fork 官方中文区仓库"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "请手动在 GitHub 上完成以下操作："
echo "1. 访问: https://github.com/hoh-zone/Overflow2026-CNNo1"
echo "2. 点击右上角的 'Fork' 按钮"
echo "3. 完成 Fork（Fork 到 https://github.com/$GITHUB_ID/Overflow2026-CNNo1）"
echo ""
read -p "Fork 完成后，按 Enter 继续..."

echo ""

# 第 3 步：Clone Fork 后的仓库
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "第 3 步：Clone 你的 Fork 仓库"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SUBMISSION_DIR="/tmp/overflow-submission-$GITHUB_ID"

if [ -d "$SUBMISSION_DIR" ]; then
  echo "ℹ️ 目录已存在，跳过 Clone"
  cd "$SUBMISSION_DIR"
else
  mkdir -p /tmp
  git clone "https://github.com/$GITHUB_ID/Overflow2026-CNNo1.git" "$SUBMISSION_DIR"
  cd "$SUBMISSION_DIR"
  echo "✅ 仓库已 Clone"
fi

echo ""

# 第 4 步：创建项目目录
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "第 4 步：创建项目提交目录"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd submissions

if [ -d "$GITHUB_ID" ]; then
  echo "ℹ️ 目录已存在: submissions/$GITHUB_ID"
  read -p "是否要重新创建? (y/n): " recreate
  if [ "$recreate" = "y" ]; then
    rm -rf "$GITHUB_ID"
    cp -r _template/ "$GITHUB_ID"
    echo "✅ 目录已重新创建"
  fi
else
  cp -r _template/ "$GITHUB_ID"
  echo "✅ 目录已创建: submissions/$GITHUB_ID"
fi

echo ""

# 第 5 步：编辑项目 README
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "第 5 步：编辑项目信息"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

README_FILE="$GITHUB_ID/README.md"

# 创建项目 README
cat > "$README_FILE" << 'EOF'
# Walrus Agent Memory Framework / Walrus 代理记忆框架

## Track / 赛道

- [ ] Agentic Web
- [ ] DeFi & Payments
- [ ] DeepBook
- [x] Walrus

## Description / 项目简介

为 AI 代理提供基于 Sui 区块链和 Walrus 分布式存储的持久化内存系统。系统采用三层存储模型：本地缓存（快速访问）+ Sui（审计日志）+ Walrus（数据存储）。支持多种记忆类型（对话、知识、状态、目标、工具结果），提供 REST API 接口和框架无关的设计。

## Links / 链接

- GitHub: https://github.com/GITHUB_ID/walrus-agent-memory
- Demo Video: https://... (YouTube, ≤ 5 min)
- Website: https://... (optional)

## Team / 团队成员

- @GITHUB_ID

## Deployment / 部署信息

- Env: Testnet
- Package ID: `0x41140bd56f9e0c66141eb9bbbab71397d640055f2b60eb7ef12ca465e9f13f20`

## Swag / 周边

- [ ] 我希望接收周边 / I'd like to receive swag
EOF

# 替换 GitHub ID
sed -i "s/GITHUB_ID/$GITHUB_ID/g" "$README_FILE"

echo "✅ 项目 README 已生成: $README_FILE"
echo ""
echo "📝 请手动编辑以下内容（如需要）:"
echo "   - Description 中的项目描述"
echo "   - Demo Video 的链接"
echo "   - 其他附加信息"
echo ""
echo "编辑文件: $SUBMISSION_DIR/submissions/$GITHUB_ID/README.md"
echo ""
read -p "编辑完成后，按 Enter 继续..."

echo ""

# 第 6 步：提交并推送
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "第 6 步：提交并推送到 GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd "$SUBMISSION_DIR"

git add "submissions/$GITHUB_ID/README.md"
git commit -m "feat: submit Walrus Agent Memory Framework project"
git push origin main

echo ""
echo "✅ 第 6 步完成：改动已推送到 GitHub"
echo ""

# 第 7 步：创建 Pull Request
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "第 7 步：创建 Pull Request"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "请手动在 GitHub 上完成以下操作："
echo ""
echo "1. 访问你的 Fork 仓库:"
echo "   https://github.com/$GITHUB_ID/Overflow2026-CNNo1"
echo ""
echo "2. 你会看到 'This branch is 1 commit ahead...' 的提示"
echo ""
echo "3. 点击 'Contribute' > 'Open pull request'"
echo ""
echo "4. 确认 PR 信息："
echo "   - Base: hoh-zone/Overflow2026-CNNo1 (main)"
echo "   - Head: $GITHUB_ID/Overflow2026-CNNo1 (main)"
echo ""
echo "5. 点击 'Create pull request'"
echo ""
echo "6. 填写 PR 标题："
echo "   [Walrus] Walrus Agent Memory Framework - Persistent Memory for AI Agents"
echo ""
echo "7. 填写 PR 描述（可选）："
echo "   见 SUBMISSION_GUIDE.md 中的 'PR 标题和描述' 部分"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                    提交流程完成! ✅                       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📋 总结："
echo "   ✅ 项目代码已推送到 GitHub"
echo "   ✅ 官方仓库已 Fork"
echo "   ✅ 项目信息已准备"
echo "   ⏳ 等待：请创建 Pull Request"
echo ""
echo "📚 更多信息，请查看: SUBMISSION_GUIDE.md"
echo ""
echo "祝你的项目顺利参赛! 🎉"
echo ""
