---
title: "平台与频道 | OpenClaw"
sidebarTitle: "平台与频道"
subtitle: "平台与频道"
description: "OpenClaw 支持的 12+ 消息频道集成指南：WhatsApp、Telegram、Discord、Slack 等主流平台配置。"
order: 50
---

# 平台与频道

本章节介绍如何将 OpenClaw 与各种消息平台集成，让你的 AI 助手能够在多个渠道响应消息。

## 支持的频道

OpenClaw 支持丰富的消息频道：

### 核心频道（内置）
- **WhatsApp** - 通过 Baileys 连接
- **Telegram** - Bot API 集成
- **Discord** - discord.js 机器人
- **Slack** - Bolt 框架
- **Signal** - libsignal 协议
- **iMessage** - 原生支持

### 扩展频道
- **BlueBubbles** - iMessage 桥接
- **MS Teams** - Microsoft Graph API
- **Matrix** - 去中心化聊天
- **Zalo** - 越南主流平台
- **IRC** - 经典聊天协议

## 子页面导航

| 页面 | 内容 | 难度 |
|------|------|------|
| [消息频道概览](./channels-overview/) | 支持的频道一览 | ⭐ |
| [WhatsApp 集成](./whatsapp-setup/) | Baileys 配置 | ⭐⭐ |
| [Telegram 集成](./telegram-setup/) | Bot 配置 | ⭐ |
| [Slack 与 Discord 集成](./slack-discord-setup/) | 工作区机器人 | ⭐⭐ |
| [其他频道配置](./other-channels/) | Signal、Teams 等 | ⭐⭐ |

## 选择建议

根据你的使用场景选择合适的频道：

| 场景 | 推荐频道 |
|------|----------|
| 个人助理 | WhatsApp、Telegram |
| 团队协作 | Slack、Discord |
| 隐私优先 | Signal |
| 企业环境 | MS Teams、Slack |
| Apple 生态 | BlueBubbles |

## 配置概览

每个频道的配置流程大致相同：

1. 在平台创建 Bot/应用
2. 获取 Token/凭证
3. 配置到 OpenClaw
4. 测试连接

详细步骤请参考各频道的专门教程。

---

*准备好集成你的第一个频道了吗？从 [消息频道概览](./channels-overview/) 开始了解！*
