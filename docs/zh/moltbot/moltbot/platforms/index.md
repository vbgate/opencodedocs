---
title: "多渠道与平台 | Clawdbot 教程"
sidebarTitle: "接入常用聊天工具"
subtitle: "多渠道与平台"
description: "学习如何配置和使用 Clawdbot 的多渠道系统，包括 WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、LINE、WebChat、macOS、iOS 和 Android 平台。"
tags:
  - "channels"
  - "platforms"
  - "integration"
order: 60
---

# 多渠道与平台

Clawdbot 通过统一的 Gateway 控制平面，支持多种通信渠道和平台，让你在熟悉的界面上与 AI 助手交互。

## 章节概述

本章节介绍 Clawdbot 支持的所有通信渠道和平台，包括即时通讯应用（WhatsApp、Telegram、Slack、Discord 等）、移动端节点（iOS、Android）和桌面应用（macOS）。学习如何配置这些渠道，让 AI 助手无缝融入你的日常工作流。

## 子页面导航

### 渠道概览

- **[多渠道系统概览](channels-overview/)** - 了解 Clawdbot 支持的所有通信渠道及其特点，掌握渠道配置的基本概念。

### 即时通讯渠道

- **[WhatsApp](whatsapp/)** - 配置和使用 WhatsApp 渠道（基于 Baileys），支持设备链接和群组管理。
- **[Telegram](telegram/)** - 配置和使用 Telegram 渠道（基于 grammY Bot API），设置 Bot Token 和 Webhook。
- **[Slack](slack/)** - 配置和使用 Slack 渠道（基于 Bolt），集成到你的工作空间。
- **[Discord](discord/)** - 配置和使用 Discord 渠道（基于 discord.js），支持服务器和频道。
- **[Google Chat](googlechat/)** - 配置和使用 Google Chat 渠道，与 Google Workspace 集成。
- **[Signal](signal/)** - 配置和使用 Signal 渠道（基于 signal-cli），保护隐私的通信。
- **[iMessage](imessage/)** - 配置和使用 iMessage 渠道（macOS 专属），与 macOS 消息应用集成。
- **[LINE](line/)** - 配置和使用 LINE 渠道（Messaging API），与 LINE 用户交互。

### Web 与原生应用

- **[WebChat 界面](webchat/)** - 使用内置的 WebChat 界面与 AI 助手交互，无需配置外部渠道。
- **[macOS 应用](macos-app/)** - 了解 macOS 菜单栏应用的功能，包括 Voice Wake、Talk Mode 和远程控制。
- **[iOS 节点](ios-node/)** - 配置 iOS 节点以执行设备本地操作（Camera、Canvas、Voice Wake）。
- **[Android 节点](android-node/)** - 配置 Android 节点以执行设备本地操作（Camera、Canvas）。

## 学习路径建议

根据你的使用场景，推荐以下学习顺序：

### 新手快速上手

如果你是第一次使用 Clawdbot，建议按照以下顺序学习：

1. **[多渠道系统概览](channels-overview/)** - 先了解整体架构和渠道概念
2. **[WebChat 界面](webchat/)** - 最简单的方式，无需任何配置即可开始使用
3. **选择一个常用渠道** - 根据你的日常习惯选择：
   - 日常聊天 → [WhatsApp](whatsapp/) 或 [Telegram](telegram/)
   - 团队协作 → [Slack](slack/) 或 [Discord](discord/)
   - macOS 用户 → [iMessage](imessage/)

### 移动端集成

如果你想在手机上使用 Clawdbot：

1. **[iOS 节点](ios-node/)** - 配置 iPhone/iPad 上的本地功能
2. **[Android 节点](android-node/)** - 配置 Android 设备上的本地功能
3. **[macOS 应用](macos-app/)** - 使用 macOS 应用作为控制中心

### 企业级部署

如果你需要在团队环境中部署：

1. **[Slack](slack/)** - 与团队工作空间集成
2. **[Discord](discord/)** - 建立社区服务器
3. **[Google Chat](googlechat/)** - 与 Google Workspace 集成

## 前置条件

在开始学习本章节之前，建议先完成：

- **[快速开始](../start/getting-started/)** - 完成 Clawdbot 的安装和基础配置
- **[向导式配置](../start/onboarding-wizard/)** - 通过向导完成 Gateway 和渠道的基本设置

::: tip 提示
如果你已经完成了向导式配置，一些渠道可能已经自动配置好了。可以跳过重复的配置步骤，直接查看特定渠道的高级功能。
:::

## 下一步指引

完成本章节的学习后，你可以继续探索：

- **[AI 模型与认证配置](../advanced/models-auth/)** - 配置不同的 AI 模型提供商
- **[会话管理与多 Agent](../advanced/session-management/)** - 学习会话隔离和子 Agent 协作
- **[工具系统](../advanced/tools-browser/)** - 使用浏览器自动化、命令执行等工具

## 常见问题

::: details 我可以同时使用多个渠道吗？
是的！Clawdbot 支持同时启用多个渠道。你可以在不同渠道上接收和发送消息，所有消息都通过统一的 Gateway 处理。
:::

::: details 哪个渠道最推荐？
这取决于你的使用场景：
- **WebChat** - 最简单，无需任何配置
- **WhatsApp** - 适合与朋友和家人聊天
- **Telegram** - Bot API 稳定，适合自动回复
- **Slack/Discord** - 适合团队协作
:::

::: details 配置渠道需要付费吗？
大多数渠道本身是免费的，但部分渠道可能有成本：
- WhatsApp Business API - 可能产生费用
- Google Chat - 需要 Google Workspace 账户
- 其他渠道 - 通常免费，只需申请 Bot Token
:::
