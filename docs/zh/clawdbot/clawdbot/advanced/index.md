---
title: "进阶功能"
sidebarTitle: "解锁 AI 超能力"
subtitle: "进阶功能"
description: "学习 Clawdbot 的高级功能配置，包括 AI 模型配置、多 Agent 协作、浏览器自动化、命令执行工具、Web 搜索工具、Canvas 可视化界面、语音唤醒与 TTS、记忆系统、Cron 定时任务、技能平台、安全沙箱和远程 Gateway。"
prerequisite:
  - "start/getting-started"
  - "start/gateway-startup"
order: 185
---

# 进阶功能

## 本章概述

本章深入介绍 Clawdbot 的高级功能，帮助你充分利用 AI 助手的强大能力。从 AI 模型配置和多 Agent 协作，到浏览器自动化、记忆系统和语音功能，你可以根据需求选择学习。

::: info 前置条件
学习本章前，请先完成以下内容：
- [快速开始](../../start/getting-started/)
- [启动 Gateway](../../start/gateway-startup/)
:::

## 学习路径

根据你的需求，可以选择不同的学习路径：

### 🚀 快速上手路径（推荐新手）
1. [AI 模型与认证配置](./models-auth/) - 配置你喜欢的 AI 模型
2. [命令执行工具与审批](./tools-exec/) - 让 AI 安全地执行命令
3. [Web 搜索与抓取工具](./tools-web/) - 扩展 AI 的知识获取能力

### 🤖 AI 能力扩展路径
1. [会话管理与多 Agent](./session-management/) - 理解 AI 协作机制
2. [记忆系统与向量搜索](./memory-system/) - 让 AI 记住重要信息
3. [技能平台与 ClawdHub](./skills-platform/) - 使用和分享技能包

### 🔧 自动化工具路径
1. [浏览器自动化工具](./tools-browser/) - 网页操作自动化
2. [Cron 定时任务与 Webhook](./cron-automation/) - 定时任务与事件触发
3. [远程 Gateway 与 Tailscale](./remote-gateway/) - 远程访问你的 AI 助手

### 🎨 交互体验路径
1. [Canvas 可视化界面与 A2UI](./canvas/) - 可视化交互界面
2. [语音唤醒与文本转语音](./voice-tts/) - 语音交互功能

### 🔒 安全与部署路径
1. [安全与沙箱隔离](./security-sandbox/) - 深入了解安全机制
2. [远程 Gateway 与 Tailscale](./remote-gateway/) - 安全的远程访问

## 子页面导航

### 核心配置

| 主题 | 描述 | 预计时间 |
|------|------|----------|
| [AI 模型与认证配置](./models-auth/) | 配置 Anthropic、OpenAI、OpenRouter、Ollama 等多种 AI 模型提供商和认证方式 | 15 分钟 |
| [会话管理与多 Agent](./session-management/) | 学习会话模型、会话隔离、子 Agent 协作、上下文压缩等核心概念 | 20 分钟 |

### 工具系统

| 主题 | 描述 | 预计时间 |
|------|------|----------|
| [浏览器自动化工具](./tools-browser/) | 使用浏览器工具进行网页自动化、截图、操作表单等 | 25 分钟 |
| [命令执行工具与审批](./tools-exec/) | 配置和使用 exec 工具，了解安全审批机制和权限控制 | 15 分钟 |
| [Web 搜索与抓取工具](./tools-web/) | 使用 web_search 和 web_fetch 工具进行网络搜索和内容抓取 | 20 分钟 |

### 交互体验

| 主题 | 描述 | 预计时间 |
|------|------|----------|
| [Canvas 可视化界面与 A2UI](./canvas/) | 了解 Canvas A2UI 推送机制、可视化界面操作和自定义界面 | 20 分钟 |
| [语音唤醒与文本转语音](./voice-tts/) | 配置 Voice Wake、Talk Mode 和 TTS 提供商，实现语音交互 | 15 分钟 |

### 智能扩展

| 主题 | 描述 | 预计时间 |
|------|------|----------|
| [记忆系统与向量搜索](./memory-system/) | 配置和使用记忆系统（SQLite-vec、FTS5、混合搜索） | 25 分钟 |
| [技能平台与 ClawdHub](./skills-platform/) | 了解技能系统、Bundled/Managed/Workspace 技能、ClawdHub 集成 | 20 分钟 |

### 自动化与部署

| 主题 | 描述 | 预计时间 |
|------|------|----------|
| [Cron 定时任务与 Webhook](./cron-automation/) | 配置定时任务、Webhook 触发、Gmail Pub/Sub 等自动化功能 | 20 分钟 |
| [远程 Gateway 与 Tailscale](./remote-gateway/) | 通过 Tailscale Serve/Funnel 或 SSH 隧道远程访问 Gateway | 15 分钟 |

### 安全机制

| 主题 | 描述 | 预计时间 |
|------|------|----------|
| [安全与沙箱隔离](./security-sandbox/) | 了解安全模型、工具权限控制、Sandbox 隔离、Docker 化部署 | 20 分钟 |

## 下一步

完成本章学习后，你可以：

1. **深入学习** - 查看 [故障排除](../../faq/troubleshooting/) 解决遇到的问题
2. **了解部署** - 查看 [部署选项](../../appendix/deployment/) 将 Clawdbot 部署到生产环境
3. **开发扩展** - 查看 [开发指南](../../appendix/development/) 学习如何开发插件和贡献代码
4. **查看配置** - 参考 [完整配置参考](../../appendix/config-reference/) 了解所有配置选项

::: tip 学习建议
建议你根据自己的实际需求选择学习路径。如果不确定从哪里开始，可以按照「快速上手路径」逐步学习，其他主题可以在需要时再深入学习。
:::
