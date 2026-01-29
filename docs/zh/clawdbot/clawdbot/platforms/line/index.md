---
title: "LINE 渠道配置与使用指南 | Clawdbot 教程"
sidebarTitle: "在 LINE 上用 AI"
subtitle: "LINE 渠道配置与使用指南"
description: "学习如何配置和使用 Clawdbot 的 LINE 渠道。本教程介绍 LINE Messaging API 集成、Webhook 设置、访问控制、富媒体消息（Flex 模板、快速回复、Rich Menu）以及常见问题排查技巧。"
tags:
  - "LINE"
  - "Messaging API"
  - "渠道配置"
prerequisite:
  - "start-gateway-startup"
order: 140
---

# LINE 渠道配置与使用指南

## 学完你能做什么

完成本教程后，你将能够：

- ✅ 创建 LINE Messaging API 渠道并获取凭证
- ✅ 配置 Clawdbot 的 LINE 插件和 Webhook
- ✅ 设置 DM 配对、群组访问控制和媒体限制
- ✅ 发送富媒体消息（Flex 卡片、快速回复、位置信息）
- ✅ 排查 LINE 渠道的常见问题

## 你现在的困境

你可能在想：

- "我想通过 LINE 和 AI 助手对话，怎么集成？"
- "LINE Messaging API 的 Webhook 怎么配置？"
- "LINE 支持 Flex 消息和快速回复吗？"
- "如何控制谁能通过 LINE 访问我的 AI 助手？"

好消息是：**Clawdbot 提供了完整的 LINE 插件，支持 Messaging API 的所有核心功能**。

## 什么时候用这一招

当你需要：

- 📱 **在 LINE 上**与 AI 助手对话
- 🎨 **使用富媒体消息**（Flex 卡片、快速回复、Rich Menu）
- 🔒 **控制访问权限**（DM 配对、群组白名单）
- 🌐 **集成 LINE 到**现有的工作流程中

## 核心思路

LINE 渠道通过 **LINE Messaging API** 集成，使用 Webhook 接收事件并发送消息。

```
LINE 用户
    │
    ▼ (发送消息)
┌──────────────────┐
│  LINE Platform  │
│  (Messaging API)│
└────────┬─────────┘
         │ (Webhook POST)
         ▼
┌──────────────────┐
│  Clawdbot       │
│  Gateway        │
│  /line/webhook   │
└────────┬─────────┘
         │ (调用 AI)
         ▼
    ┌────────┐
    │ Agent  │
    └───┬────┘
        │ (响应)
        ▼
    LINE 用户
```

**关键概念**：

| 概念 | 作用 |
|--- | ---|
| **Channel Access Token** | 用于发送消息的认证令牌 |
| **Channel Secret** | 用于验证 Webhook 签名的密钥 |
| **Webhook URL** | Clawdbot 接收 LINE 事件的端点（必须 HTTPS） |
| **DM Policy** | 控制未知发送者的访问策略（pairing/allowlist/open/disabled） |
| **Rich Menu** | LINE 的固定菜单，用户可点击快速触发操作 |

## 🎒 开始前的准备

### 需要的账号和工具

| 项目 | 要求 | 获取方式 |
|--- | --- | ---|
| **LINE Developers 账号** | 免费注册 | https://developers.line.biz/console/ |
| **LINE Provider** | 创建 Provider 和 Messaging API channel | LINE Console |
| **HTTPS 服务器** | Webhook 必须是 HTTPS | ngrok、Cloudflare Tunnel、Tailscale Serve/Funnel |

::: tip 推荐的暴露方式
如果你在本地开发，可以使用：
- **ngrok**：`ngrok http 18789`
- **Tailscale Funnel**：`gateway.tailscale.mode = "funnel"`
- **Cloudflare Tunnel**：免费且稳定
:::

## 跟我做

### 第 1 步：安装 LINE 插件

**为什么**
LINE 渠道是通过插件实现的，需要先安装。

```bash
clawdbot plugins install @clawdbot/line
```

**你应该看到**：
```
✓ Installed @clawdbot/line plugin
```

::: tip 本地开发
如果你从源码运行，可以使用本地安装：
```bash
clawdbot plugins install ./extensions/line
```
:::

### 第 2 步：创建 LINE Messaging API Channel

**为什么**
需要获取 `Channel Access Token` 和 `Channel Secret` 来配置 Clawdbot。

#### 2.1 登录 LINE Developers Console

访问：https://developers.line.biz/console/

#### 2.2 创建 Provider（如果还没有）

1. 点击 "Create new provider"
2. 输入 Provider 名称（如 `Clawdbot`）
3. 点击 "Create"

#### 2.3 添加 Messaging API Channel

1. 在 Provider 下，点击 "Add channel" → 选择 "Messaging API"
2. 设置 Channel 信息：
   - Channel name: `Clawdbot AI Assistant`
   - Channel description: `Personal AI assistant powered by Clawdbot`
   - Category: `Communication`
   - Subcategory: `Bot`
3. 勾选 "Agree" → 点击 "Create"

#### 2.4 启用 Webhook

1. 在 Channel 设置页面，找到 "Messaging API" 标签
2. 点击 "Use webhook" 开关 → 设置为 ON
3. 复制以下信息：

| 项目 | 位置 | 示例 |
|--- | --- | ---|
| **Channel Access Token** | Basic settings → Channel access token (long-lived) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Channel Secret** | Basic settings → Channel secret | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7` |

::: warning 保存好凭证！
Channel Access Token 和 Channel Secret 是敏感信息，妥善保管，不要泄露到公开仓库。
:::

### 第 3 步：配置 Clawdbot 的 LINE 渠道

**为什么**
配置 Gateway 以使用 LINE Messaging API 发送和接收消息。

#### 方式 A：通过命令行配置

```bash
clawdbot configure
```

向导会询问：
- 是否启用 LINE 渠道
- Channel Access Token
- Channel Secret
- DM 策略（默认 `pairing`）

#### 方式 B：直接编辑配置文件

编辑 `~/.clawdbot/clawdbot.json`：

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
      channelSecret: "YOUR_CHANNEL_SECRET",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    }
  }
}
```

::: tip 使用环境变量
你也可以通过环境变量配置（仅对默认账户有效）：
```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_token_here"
export LINE_CHANNEL_SECRET="your_secret_here"
```
:::

#### 方式 C：使用文件存储凭证

更安全的方式是将凭证存储在单独的文件中：

```json5
{
  channels: {
    line: {
      enabled: true,
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
      dmPolicy: "pairing"
    }
  }
}
```

### 第 4 步：设置 Webhook URL

**为什么**
LINE 需要 Webhook URL 来向 Clawdbot 推送消息事件。

#### 4.1 确保你的 Gateway 可从外网访问

如果你在本地开发，需要使用隧道服务：

```bash
# 使用 ngrok
ngrok http 18789

# 输出会显示 HTTPS URL，如：
# Forwarding: https://abc123.ngrok.io -> http://localhost:18789
```

#### 4.2 在 LINE Console 设置 Webhook URL

1. 在 Messaging API 设置页面，找到 "Webhook settings"
2. 输入 Webhook URL：
   ```
   https://your-gateway-host/line/webhook
   ```
   - 默认路径：`/line/webhook`
   - 可通过 `channels.line.webhookPath` 自定义
3. 点击 "Verify" → 确认 LINE 能访问你的 Gateway

**你应该看到**：
```
✓ Webhook URL verification succeeded
```

#### 4.3 启用必要的事件类型

在 Webhook settings 中，勾选以下事件：

| 事件 | 用途 |
|--- | ---|
| **Message event** | 接收用户发送的消息 |
| **Follow event** | 用户添加 Bot 为好友 |
| **Unfollow event** | 用户移除 Bot |
| **Join event** | Bot 加入群组 |
| **Leave event** | Bot 离开群组 |
| **Postback event** | 快速回复和按钮点击 |

### 第 5 步：启动 Gateway

**为什么**
Gateway 需要运行才能接收 LINE 的 Webhook 事件。

```bash
clawdbot gateway --verbose
```

**你应该看到**：
```
✓ Gateway listening on ws://127.0.0.1:18789
✓ LINE webhook server started on /line/webhook
✓ LINE plugin initialized
```

### 第 6 步：测试 LINE 渠道

**为什么**
验证配置是否正确，AI 助手是否能正常响应。

#### 6.1 添加 Bot 为好友

1. 在 LINE Console → Messaging API → Channel settings
2. 复制 "Basic ID" 或 "QR Code"
3. 在 LINE App 中搜索或扫描 QR Code，添加 Bot 为好友

#### 6.2 发送测试消息

在 LINE 中发送消息给 Bot：
```
你好，请帮我总结今天的天气。
```

**你应该看到**：
- Bot 显示 "typing" 状态（如果配置了 typing indicators）
- AI 助手流式返回回复
- 消息正确显示在 LINE 中

### 第 7 步：DM 配对验证（可选）

**为什么**
如果使用默认的 `dmPolicy="pairing"`，未知发送者需要先被批准。

#### 查看待批准的配对请求

```bash
clawdbot pairing list line
```

**你应该看到**：
```
Pending pairing requests for LINE:
  CODE: ABC123 - User ID: U1234567890abcdef1234567890ab
```

#### 批准配对请求

```bash
clawdbot pairing approve line ABC123
```

**你应该看到**：
```
✓ Approved pairing request for LINE user U1234567890abcdef1234567890ab
```

::: info DM 策略说明
- `pairing`（默认）：未知发送者收到配对码，消息被忽略直到批准
- `allowlist`：只允许白名单中的用户发送消息
- `open`：任何人都可以发送消息（需谨慎使用）
- `disabled`：禁用私信
:::

## 检查点 ✅

验证你的配置是否正确：

| 检查项 | 验证方法 | 预期结果 |
|--- | --- | ---|
| **插件已安装** | `clawdbot plugins list` | 看到 `@clawdbot/line` |
| **配置有效** | `clawdbot doctor` | 无 LINE 相关错误 |
| **Webhook 可达** | LINE Console 验证 | `✓ Verification succeeded` |
| **Bot 可访问** | 在 LINE 添加好友并发送消息 | AI 助手正常回复 |
| **配对机制** | 使用新用户发送 DM | 收到配对码（如使用 pairing 策略） |

## 踩坑提醒

### 常见问题 1：Webhook 验证失败

**症状**：
```
Webhook URL verification failed
```

**原因**：
- Webhook URL 不是 HTTPS
- Gateway 没有运行或端口不正确
- 防火墙阻止了入站连接

**解决方法**：
1. 确保使用 HTTPS：`https://your-gateway-host/line/webhook`
2. 检查 Gateway 是否运行：`clawdbot gateway status`
3. 验证端口：`netstat -an | grep 18789`
4. 使用隧道服务（ngrok/Tailscale/Cloudflare）

### 常见问题 2：无法接收消息

**症状**：
- Webhook 验证成功
- 但发送消息给 Bot 无响应

**原因**：
- Webhook 路径配置错误
- 事件类型未启用
- 配置文件中的 `channelSecret` 不匹配

**解决方法**：
1. 检查 `channels.line.webhookPath` 是否与 LINE Console 一致
2. 确保在 LINE Console 中启用了 "Message event"
3. 验证 `channelSecret` 是否正确复制（无多余空格）

### 常见问题 3：媒体下载失败

**症状**：
```
Error downloading LINE media: size limit exceeded
```

**原因**：
- 媒体文件超过默认限制（10MB）

**解决方法**：
在配置中增加限制：
```json5
{
  channels: {
    line: {
      mediaMaxMb: 25  // LINE 官方限制 25MB
    }
  }
}
```

### 常见问题 4：群组消息无响应

**症状**：
- DM 正常
- 群组中发送消息无响应

**原因**：
- 默认 `groupPolicy="allowlist"`，群组未加入白名单
- 未在群组中 @mention Bot

**解决方法**：
1. 在配置中添加群组 ID 到白名单：
```json5
{
  channels: {
    line: {
      groupAllowFrom: ["C1234567890abcdef1234567890ab"]
    }
  }
}
```

2. 或在群组中 @mention Bot：`@Clawdbot 帮我处理这个任务`

## 高级功能

### 富媒体消息（Flex 模板和快速回复）

Clawdbot 支持 LINE 的富媒体消息，包括 Flex 卡片、快速回复、位置信息等。

#### 发送快速回复

```json5
{
  text: "今天能帮你做什么？",
  channelData: {
    line: {
      quickReplies: ["查天气", "设置提醒", "生成代码"]
    }
  }
}
```

#### 发送 Flex 卡片

```json5
{
  text: "状态卡片",
  channelData: {
    line: {
      flexMessage: {
        altText: "服务器状态",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            contents: [
              {
                type: "text",
                text: "CPU: 45%"
              },
              {
                type: "text",
                text: "Memory: 2.1GB"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### 发送位置信息

```json5
{
  text: "这是我的办公室位置",
  channelData: {
    line: {
      location: {
        title: "Office",
        address: "123 Main St, San Francisco",
        latitude: 37.7749,
        longitude: -122.4194
      }
    }
  }
}
```

### Rich Menu（固定菜单）

Rich Menu 是 LINE 的固定菜单，用户可以通过点击快速触发操作。

```bash
# 创建 Rich Menu
clawdbot line rich-menu create

# 上传菜单图片
clawdbot line rich-menu upload --image /path/to/menu.png

# 设置为默认菜单
clawdbot line rich-menu set-default --rich-menu-id <MENU_ID>
```

::: info Rich Menu 限制
- 图片尺寸：2500x1686 或 2500x843 像素
- 图片格式：PNG 或 JPEG
- 最大 10 个菜单项
:::

### Markdown 转换

Clawdbot 会自动将 Markdown 格式转换为 LINE 支持的格式：

| Markdown | LINE 转换结果 |
|--- | ---|
| 代码块 | Flex 卡片 |
| 表格 | Flex 卡片 |
| 链接 | 自动检测并转换为 Flex 卡片 |
| 粗体/斜体 | 被移除（LINE 不支持） |

::: tip 保留格式
LINE 不支持 Markdown 格式，Clawdbot 会尝试转换为 Flex 卡片。如果你希望纯文本，可以在配置中禁用自动转换。
:::

## 本课小结

本教程介绍了：

1. ✅ 安装 LINE 插件
2. ✅ 创建 LINE Messaging API Channel
3. ✅ 配置 Webhook 和凭证
4. ✅ 设置访问控制（DM 配对、群组白名单）
5. ✅ 发送富媒体消息（Flex、快速回复、位置）
6. ✅ 使用 Rich Menu
7. ✅ 排查常见问题

LINE 渠道提供了丰富的消息类型和交互方式，非常适合在 LINE 上构建个性化的 AI 助手体验。

---

## 下一课预告

> 下一课我们学习 **[WebChat 界面](../webchat/)**。
>
> 你会学到：
> - 如何通过浏览器访问 WebChat 界面
> - WebChat 的核心功能（会话管理、附件上传、Markdown 支持）
> - 配置远程访问（SSH 隧道、Tailscale）
> - 理解 WebChat 与其他渠道的区别

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| LINE Bot 核心实现 | [`src/line/bot.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/bot.ts) | 27-83 |
| 配置 Schema 定义 | [`src/line/config-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/config-schema.ts) | 1-54 |
| Webhook 事件处理器 | [`src/line/bot-handlers.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/bot-handlers.ts) | 1-100 |
| 消息发送功能 | [`src/line/send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/send.ts) | - |
| Flex 模板生成 | [`src/line/flex-templates.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/flex-templates.ts) | - |
| Rich Menu 操作 | [`src/line/rich-menu.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/rich-menu.ts) | - |
| Template 消息 | [`src/line/template-messages.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/template-messages.ts) | - |
| Markdown 转 LINE | [`src/line/markdown-to-line.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/markdown-to-line.ts) | - |
| Webhook 服务器 | [`src/line/webhook.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/webhook.ts) | - |

**关键配置字段**：
- `channelAccessToken`: LINE Channel Access Token（`config-schema.ts:19`）
- `channelSecret`: LINE Channel Secret（`config-schema.ts:20`）
- `dmPolicy`: DM 访问策略（`config-schema.ts:26`）
- `groupPolicy`: 群组访问策略（`config-schema.ts:27`）
- `mediaMaxMb`: 媒体大小限制（`config-schema.ts:28`）
- `webhookPath`: 自定义 Webhook 路径（`config-schema.ts:29`）

**关键函数**：
- `createLineBot()`: 创建 LINE Bot 实例（`bot.ts:27`）
- `handleLineWebhookEvents()`: 处理 LINE Webhook 事件（`bot-handlers.ts:100`）
- `sendMessageLine()`: 发送 LINE 消息（`send.ts`）
- `createFlexMessage()`: 创建 Flex 消息（`send.ts:20`）
- `createQuickReplyItems()`: 创建快速回复（`send.ts:21`）

**支持的 DM 策略**：
- `open`: 开放访问
- `allowlist`: 白名单模式
- `pairing`: 配对模式（默认）
- `disabled`: 禁用

**支持的群组策略**：
- `open`: 开放访问
- `allowlist`: 白名单模式（默认）
- `disabled`: 禁用

</details>
