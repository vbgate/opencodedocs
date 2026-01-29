---
title: "多渠道系统概览：Clawdbot 支持的 13+ 种通信渠道完整全面详解 | Clawdbot 教程"
sidebarTitle: "选对适合的渠道"
subtitle: "多渠道系统概览：Clawdbot 支持的所有通信渠道"
description: "学习 Clawdbot 支持的 13+ 种通信渠道（WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、LINE 等）。掌握各渠道的认证方式、特点、使用场景，选择最适合的渠道开始配置。教程涵盖 DM 配对保护、群组消息处理、配置方式。"
tags:
  - "渠道"
  - "平台"
  - "多渠道"
  - "入门"
prerequisite:
  - "start-getting-started"
order: 60
---

# 多渠道系统概览：Clawdbot 支持的所有通信渠道

## 学完你能做什么

完成本教程后，你将能够：

- ✅ 了解 Clawdbot 支持的 13+ 种通信渠道
- ✅ 掌握各渠道的认证方式和配置要点
- ✅ 根据使用场景选择最适合的渠道
- ✅ 理解 DM 配对保护机制的安全价值

## 你现在的困境

你可能正在想：

- "Clawdbot 支持哪些平台？"
- "WhatsApp、Telegram、Slack 有什么区别？"
- "哪个渠道最简单快速？"
- "我需要在每个平台都注册机器人吗？"

好消息是：**Clawdbot 提供了丰富的渠道选择，你可以根据习惯和需求自由组合**。

## 什么时候用这一招

当你需要：

- 🌐 **多渠道统一管理** —— 一套 AI 助手，多个渠道同时可用
- 🤝 **团队协作** —— Slack、Discord、Google Chat 等工作场所集成
- 💬 **个人聊天** —— WhatsApp、Telegram、iMessage 等日常通讯工具
- 🔧 **灵活扩展** —— 支持 LINE、Zalo 等地区性平台

::: tip 多渠道的价值
使用多个渠道的好处：
- **无缝切换**：在家用 WhatsApp，公司用 Slack，外出用 Telegram
- **多端同步**：消息和会话在所有渠道保持一致
- **覆盖场景**：不同平台有不同优势，组合使用效果最佳
:::

---

## 核心思路

Clawdbot 的渠道系统采用 **插件化架构**：

```
┌─────────────────────────────────────────────────┐
│              Gateway (控制平面)                   │
│         ws://127.0.0.1:18789                  │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┼───────┬─────────┬───────┐
        │       │       │         │       │
    WhatsApp  Telegram  Slack  Discord  ... 等 13+ 种渠道
        │       │       │         │       │
    Baileys  grammY   Bolt  discord.js ...
```

**关键概念**：

| 概念         | 作用                         |
| ------------ | ---------------------------- |
| **渠道插件** | 每个渠道都是一个独立的插件    |
| **统一接口** | 所有渠道使用相同的 API        |
| **DM 保护**   | 默认启用配对机制，拒绝未知发送者 |
| **群组支持**  | 支持 `@mention` 和命令触发    |

---

## 支持的渠道概览

Clawdbot 支持 **13+ 种通信渠道**，分为两类：

### 核心渠道（内置）

| 渠道           | 认证方式             | 难度 | 特点                              |
| -------------- | -------------------- | ---- | --------------------------------- |
| **Telegram**   | Bot Token            | ⭐   | 最简单快速，推荐新手                |
| **WhatsApp**   | QR Code / Phone Link | ⭐⭐  | 使用真实号码，推荐单独手机 + eSIM |
| **Slack**      | Bot Token + App Token | ⭐⭐ | 工作场所首选，Socket Mode         |
| **Discord**    | Bot Token            | ⭐⭐  | 社区和游戏场景，功能丰富         |
| **Google Chat** | OAuth / Service Account | ⭐⭐⭐ | Google Workspace 企业集成        |
| **Signal**     | signal-cli           | ⭐⭐⭐ | 高度安全，设置复杂              |
| **iMessage**   | imsg (macOS)        | ⭐⭐⭐ | macOS 专属，仍在开发中          |

### 扩展渠道（外部插件）

| 渠道             | 认证方式             | 类型       | 特点                              |
| ---------------- | -------------------- | ---------- | --------------------------------- |
| **WebChat**       | Gateway WebSocket     | 内置       | 无需第三方认证，最简单            |
| **LINE**          | Messaging API        | 外部插件   | 亚洲用户常用                       |
| **BlueBubbles**   | Private API         | 扩展插件   | iMessage 扩展，支持远程设备       |
| **Microsoft Teams** | Bot Framework       | 扩展插件   | 企业协作                           |
| **Matrix**        | Matrix Bot SDK      | 扩展插件   | 去中心化通信                       |
| **Zalo**         | Zalo OA             | 扩展插件   | 越南用户常用                       |
| **Zalo Personal** | Personal Account     | 扩展插件   | Zalo 个人账户                       |

::: info 如何选择渠道？
- **新手**：从 Telegram 或 WebChat 开始
- **个人使用**：WhatsApp（如果已有号码）、Telegram
- **团队协作**：Slack、Google Chat、Discord
- **隐私优先**：Signal
- **Apple 生态**：iMessage、BlueBubbles
:::

---

## 核心渠道详解

### 1. Telegram（推荐新手）

**为什么推荐**：
- ⚡ 最简单的配置流程（只需要 Bot Token）
- 📱 原生支持 Markdown、富媒体
- 🌍 全球可用，无需特殊网络环境

**认证方式**：
1. 在 Telegram 中找到 `@BotFather`
2. 发送 `/newbot` 命令
3. 按提示设置机器人名称
4. 获得 Bot Token（格式：`123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`）

**配置示例**：
```yaml
channels:
  telegram:
    botToken: "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"  # 默认 DM 配对保护
    allowFrom: ["*"]     # 允许所有用户（配对后）
```

**特点**：
- ✅ 支持 Thread/Topic
- ✅ 支持 Reaction 表情
- ✅ 支持文件、图片、视频

---

### 2. WhatsApp（推荐个人用户）

**为什么推荐**：
- 📱 使用真实手机号码，好友无需添加新联系人
- 🌍 全球最受欢迎的即时通讯工具
- 📞 支持语音消息、通话

**认证方式**：
1. 运行 `clawdbot channels login whatsapp`
2. 扫描二维码（类似 WhatsApp Web）
3. 或使用手机链接（新功能）

**配置示例**：
```yaml
channels:
  whatsapp:
    accounts:
      my-phone:
        dmPolicy: "pairing"  # 默认 DM 配对保护
        allowFrom: ["*"]     # 允许所有用户（配对后）
```

**特点**：
- ✅ 支持富媒体（图片、视频、文档）
- ✅ 支持语音消息
- ✅ 支持 Reaction 表情
- ⚠️ **需要单独手机**（推荐 eSIM + 备用机）

::: warning WhatsApp 限制
- 不要在多个地方同时登录同一号码
- 避免频繁重连（可能被临时封禁）
- 推荐使用单独的测试号码
:::

---

### 3. Slack（推荐团队协作）

**为什么推荐**：
- 🏢 企业和团队广泛使用
- 🔧 支持丰富的 Actions 和 Slash Commands
- 📋 与工作流无缝集成

**认证方式**：
1. 在 [Slack API](https://api.slack.com/apps) 创建应用
2. 启用 Bot Token Scopes
3. 启用 App-Level Token
4. 启用 Socket Mode
5. 获得 Bot Token 和 App Token

**配置示例**：
```yaml
channels:
  slack:
    botToken: "xoxb-YOUR-BOT-TOKEN-HERE"
    appToken: "xapp-YOUR-APP-TOKEN-HERE"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**特点**：
- ✅ 支持频道、私聊、群组
- ✅ 支持 Slack Actions（创建频道、邀请用户等）
- ✅ 支持文件上传、表情符号
- ⚠️ 需要启用 Socket Mode（避免暴露端口）

---

### 4. Discord（推荐社区场景）

**为什么推荐**：
- 🎮 游戏和社区场景首选
- 🤖 支持 Discord 特有功能（角色、频道管理）
- 👥 强大的群组和社区功能

**认证方式**：
1. 在 [Discord Developer Portal](https://discord.com/developers/applications) 创建应用
2. 创建 Bot 用户
3. 启用 Message Content Intent
4. 获得 Bot Token

**配置示例**：
```yaml
channels:
  discord:
    botToken: "MTIzNDU2Nzg5MDEyMzQ1Njgw.GhIJKlmNoPQRsTUVwxyZABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**特点**：
- ✅ 支持角色和权限管理
- ✅ 支持频道、线程、表情符号
- ✅ 支持特定 Actions（创建频道、管理角色等）
- ⚠️ 需要正确配置 Intents

---

### 5. 其他核心渠道

#### Google Chat
- **适用场景**：Google Workspace 企业用户
- **认证方式**：OAuth 或 Service Account
- **特点**：与 Gmail、Calendar 集成

#### Signal
- **适用场景**：隐私优先用户
- **认证方式**：signal-cli
- **特点**：端到端加密，高度安全

#### iMessage
- **适用场景**：macOS 用户
- **认证方式**：imsg (macOS 专属)
- **特点**：Apple 生态集成，仍在开发中

---

## 扩展渠道介绍

### WebChat（最简单）

**为什么推荐**：
- 🚀 无需第三方账号或 Token
- 🌐 内置 Gateway WebSocket 支持
- 🔧 开发调试快速

**使用方式**：

启动 Gateway 后，直接通过以下方式访问：
- **macOS/iOS app**：原生 SwiftUI 界面
- **Control UI**：浏览器访问控制台的聊天标签页

**特点**：
- ✅ 无需配置，开箱即用
- ✅ 支持测试和调试
- ✅ 与其他渠道共享会话和路由规则
- ⚠️ 仅本地访问（可通过 Tailscale 暴露）

---

### LINE（亚洲用户）

**适用场景**：日本、台湾、泰国等 LINE 用户

**认证方式**：Messaging API（LINE Developers Console）

**特点**：
- ✅ 支持按钮、快速回复
- ✅ 亚洲市场广泛使用
- ⚠️ 需要审核和商业账户

---

### BlueBubbles（iMessage 扩展）

**适用场景**：需要远程 iMessage 访问

**认证方式**：Private API

**特点**：
- ✅ 远程控制 iMessage
- ✅ 支持多个设备
- ⚠️ 需要单独的 BlueBubbles 服务器

---

### Microsoft Teams（企业协作）

**适用场景**：使用 Office 365 的企业

**认证方式**：Bot Framework

**特点**：
- ✅ 与 Teams 深度集成
- ✅ 支持 Adaptive Cards
- ⚠️ 配置复杂

---

### Matrix（去中心化）

**适用场景**：去中心化通信爱好者

**认证方式**：Matrix Bot SDK

**特点**：
- ✅ 联邦化网络
- ✅ 端到端加密
- ⚠️ 需要配置 Homeserver

---

### Zalo / Zalo Personal（越南用户）

**适用场景**：越南市场

**认证方式**：Zalo OA / Personal Account

**特点**：
- ✅ 支持个人账户和企业账户
- ⚠️ 地区限制（越南）

---

## DM 配对保护机制

### 什么是 DM 配对保护？

Clawdbot 默认启用 **DM 配对保护**（`dmPolicy="pairing"`），这是一项安全特性：

1. **未知发送者**会收到一个配对代码
2. 消息不会被处理，直到你批准配对
3. 批准后，发送者被加入本地白名单

::: warning 为什么需要配对保护？
Clawdbot 连接真实消息平台，**必须将入站 DM 视为不可信输入**。配对保护可以：
- 防止垃圾消息和滥用
- 避免处理恶意指令
- 保护你的 AI 配额和隐私
:::

### 如何批准配对？

```bash
# 查看待批准的配对请求
clawdbot pairing list

# 批准配对
clawdbot pairing approve <channel> <code>

# 示例：批准 Telegram 发送者
clawdbot pairing approve telegram 123456
```

### 配对流程示例

```
未知发送者：Hello AI!
Clawdbot：🔒 请先配对。配对代码：ABC123
你的操作：clawdbot pairing approve telegram ABC123
Clawdbot：✅ 配对成功！现在可以发送消息了。
```

::: tip 关闭 DM 配对保护（不推荐）
如果你想公开访问，可以设置：
```yaml
channels:
  telegram:
    dmPolicy: "open"
    allowFrom: ["*"]  # 允许所有用户
```

⚠️ 这会降低安全性，请谨慎使用！
:::

---

## 群组消息处理

### @mention 触发

默认情况下，群组消息需要 **@mention** 机器人才会响应：

```yaml
channels:
  slack:
    allowUnmentionedGroups: false  # 默认：需要 @mention
```

### 命令触发

也可以使用命令前缀触发：

```bash
# 在群组中发送
/ask 解释一下量子纠缠
/help 列出可用命令
/new 开始新会话
```

### 配置示例

```yaml
channels:
  discord:
    allowUnmentionedGroups: false  # 需要 @mention
    # 或
    allowUnmentionedGroups: true   # 响应所有消息（不推荐）
```

---

## 配置渠道：向导 vs 手动

### 方式 A：使用 Onboarding 向导（推荐）

```bash
clawdbot onboard
```

向导会引导你完成：
1. 选择渠道
2. 配置认证（Token、API Key 等）
3. 设置 DM 策略
4. 测试连接

### 方式 B：手动配置

编辑配置文件 `~/.clawdbot/clawdbot.json`：

```yaml
channels:
  telegram:
    botToken: "your-bot-token"
    dmPolicy: "pairing"
    allowFrom: ["*"]
  whatsapp:
    accountId: "my-phone"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

重启 Gateway 使配置生效：

```bash
clawdbot gateway restart
```

---

## 检查点 ✅

完成本教程后，你应该能够：

- [ ] 列出 Clawdbot 支持的所有渠道
- [ ] 理解 DM 配对保护机制
- [ ] 选择最适合你的渠道
- [ ] 知道如何配置渠道（向导或手动）
- [ ] 理解群组消息的触发方式

::: tip 下一步
选择一个渠道，开始配置：
- [WhatsApp 渠道配置](../whatsapp/) - 使用真实号码
- [Telegram 渠道配置](../telegram/) - 最简单快速
- [Slack 渠道配置](../slack/) - 团队协作首选
- [Discord 渠道配置](../discord/) - 社区场景
:::

---

## 踩坑提醒

### ❌ 忘记启用 DM 配对保护

**错误做法**：
```yaml
channels:
  telegram:
    dmPolicy: "open"  # 太开放了！
```

**正确做法**：
```yaml
channels:
  telegram:
    dmPolicy: "pairing"  # 安全默认
```

::: danger DM 开放风险
开放 DM 意味着任何人都可以向你的 AI 助手发送消息，可能导致：
- 配额滥用
- 隐私泄露
- 恶意指令执行
:::

### ❌ WhatsApp 在多个地方登录

**错误做法**：
- 在手机和 Clawdbot 同时登录同一号码
- 频繁重连 WhatsApp

**正确做法**：
- 使用单独的测试号码
- 避免频繁重连
- 监控连接状态

### ❌ Slack 未启用 Socket Mode

**错误做法**：
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    # 缺少 appToken
```

**正确做法**：
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    appToken: "xapp-..."  # 必需
```

### ❌ Discord Intents 配置错误

**错误做法**：
- 只启用基础 Intents
- 忘记启用 Message Content Intent

**正确做法**：
- 在 Discord Developer Portal 启用所有必需的 Intents
- 特别是 Message Content Intent

---

## 本课小结

本课你学会了：

1. ✅ **渠道概览**：Clawdbot 支持 13+ 种通信渠道
2. ✅ **核心渠道**：Telegram、WhatsApp、Slack、Discord 的特点和配置
3. ✅ **扩展渠道**：LINE、BlueBubbles、Teams、Matrix 等特色渠道
4. ✅ **DM 保护**：配对机制的安全价值和使用方法
5. ✅ **群组处理**：@mention 和命令触发机制
6. ✅ **配置方式**：向导和手动配置两种方法

**下一步**：

- 学习 [WhatsApp 渠道配置](../whatsapp/)，设置真实号码
- 学习 [Telegram 渠道配置](../telegram/)，最快上手方式
- 了解 [Slack 渠道配置](../slack/)，团队协作集成
- 掌握 [Discord 渠道配置](../discord/)，社区场景

---

## 下一课预告

> 下一课我们学习 **[WhatsApp 渠道配置](../whatsapp/)**。
>
> 你会学到：
> - 如何使用 QR Code 或手机链接登录 WhatsApp
> - 如何配置 DM 策略和群组规则
> - 如何管理多个 WhatsApp 账户
> - 如何排查 WhatsApp 连接问题

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能            | 文件路径                                                                                               | 行号    |
| --------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| 渠道注册表       | [`src/channels/registry.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.ts) | 7-100   |
| 渠道插件目录   | [`src/channels/plugins/`](https://github.com/clawdbot/clawdbot/tree/main/src/channels/plugins/) | 全目录  |
| 渠道元数据类型   | [`src/channels/plugins/types.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/types.core.ts) | 74-93   |
| DM 配对机制     | [`src/channels/plugins/pairing.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/pairing.ts) | 全文件  |
| 群组 @mention | [`src/channels/plugins/group-mentions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/group-mentions.ts) | 全文件  |
| 白名单匹配     | [`src/channels/plugins/allowlist-match.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/allowlist-match.ts) | 全文件  |
| 渠道目录配置   | [`src/channels/plugins/directory-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/directory-config.ts) | 全文件  |
| WhatsApp 插件 | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 全文件  |
| Telegram 插件 | [`src/channels/plugins/onboarding/telegram.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/telegram.ts) | 全文件  |
| Slack 插件     | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 全文件  |
| Discord 插件   | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 全文件  |

**关键常量**：
- `CHAT_CHANNEL_ORDER`：核心渠道顺序数组（来自 `src/channels/registry.ts:7-15`）
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`：默认渠道（来自 `src/channels/registry.ts:21`）
- `dmPolicy="pairing"`：默认 DM 配对策略（来自 `README.md:110`）

**关键类型**：
- `ChannelMeta`：渠道元数据接口（来自 `src/channels/plugins/types.core.ts:74-93`）
- `ChannelAccountSnapshot`：渠道账户状态快照（来自 `src/channels/plugins/types.core.ts:95-142`）
- `ChannelSetupInput`：渠道配置输入接口（来自 `src/channels/plugins/types.core.ts:19-51`）

**关键函数**：
- `listChatChannels()`：列出所有核心渠道（`src/channels/registry.ts:114-116`）
- `normalizeChatChannelId()`：规范化渠道 ID（`src/channels/registry.ts:126-133`）
- `buildChannelUiCatalog()`：构建 UI 目录（`src/channels/plugins/catalog.ts:213-239`）

</details>
