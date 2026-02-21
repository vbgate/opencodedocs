---
title: "Slack 与 Discord 集成 - 工作区机器人配置 | OpenClaw 教程"
sidebarTitle: "Slack 与 Discord 集成"
subtitle: "Slack 与 Discord 集成 - 工作区机器人配置"
description: "学习如何配置 Slack Bolt 和 Discord.js 机器人，理解 OAuth 流程和权限管理，实现工作区 AI 助手集成。"
tags:
  - "Slack"
  - "Discord"
  - "OAuth"
order: 80
---

# Slack 与 Discord 集成 - 工作区机器人配置

## 学完你能做什么

完成本课程后，你将能够：
- 创建并配置 Slack App 和 Bot
- 设置 Discord Bot 和权限
- 理解 OAuth 授权流程
- 在工作区中部署 AI 助手

## 核心思路

Slack 和 Discord 都是面向团队的工作区平台，但它们的架构和配置方式有所不同：

```
┌─────────────────────────────────────────────────────────────┐
│              Slack vs Discord 架构对比                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Slack (Bolt 框架)              Discord (discord.js)      │
│   ┌──────────────────┐           ┌──────────────────┐      │
│   │  Slack App       │           │  Discord Bot     │      │
│   │  - Bot Token     │           │  - Bot Token     │      │
│   │  - App Token     │           │  - Gateway Intents│     │
│   │  - Socket Mode   │           │  - Permissions   │      │
│   └────────┬─────────┘           └────────┬─────────┘      │
│            │                               │               │
│            ▼                               ▼               │
│   ┌──────────────────┐           ┌──────────────────┐      │
│   │  OAuth 授权      │           │  OAuth2 授权     │      │
│   │  - 权限范围      │           │  - 权限位        │      │
│   │  - 工作区安装    │           │  - 邀请 Bot      │      │
│   └────────┬─────────┘           └────────┬─────────┘      │
│            │                               │               │
│            └───────────────┬───────────────┘               │
│                            │                               │
│                            ▼                               │
│                 ┌────────────────────┐                    │
│                 │   OpenClaw Gateway │                    │
│                 │   消息路由 & AI 处理 │                   │
│                 └────────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 第一部分：Slack 集成

### 第 1 步：创建 Slack App

**为什么**  
需要在 Slack API 平台注册应用才能获取凭证。

1. 访问 [Slack API](https://api.slack.com/apps)
2. 点击 **Create New App**
3. 选择 **From scratch**
4. 输入：
   - **App Name**: "OpenClaw Assistant"
   - **Workspace**: 选择你的工作区

### 第 2 步：配置 Bot 权限

**为什么**  
需要指定 Bot 可以访问哪些功能和数据。

1. 在左侧菜单选择 **OAuth & Permissions**
2. 滚动到 **Scopes** 部分
3. 添加 **Bot Token Scopes**：

```
app_mentions:read      # 读取提及
channels:history       # 读取频道消息
channels:join          # 加入频道
chat:write             # 发送消息
files:read             # 读取文件
files:write            # 上传文件
groups:history         # 读取私有频道消息
im:history             # 读取私信历史
mpim:history           # 读取群组私信
users:read             # 读取用户信息
```

### 第 3 步：获取 Bot Token

**为什么**  
Token 是 Bot 访问 Slack API 的凭证。

1. 在 **OAuth & Permissions** 页面
2. 点击 **Install to Workspace**
3. 授权应用访问
4. 复制 **Bot User OAuth Token**（以 `xoxb-` 开头）

### 第 4 步：配置 OpenClaw

```bash
# 设置 Slack Bot Token
openclaw config set channels.slack.botToken "xoxb-your-token-here"

# 启用 Socket Mode（推荐用于本地）
openclaw config set channels.slack.socketMode true
openclaw config set channels.slack.appToken "xapp-your-app-token"

# 或者使用 HTTP 模式（需要公网地址）
openclaw config set channels.slack.socketMode false
openclaw config set channels.slack.signingSecret "your-signing-secret"

# 启用 Slack 频道
openclaw config set channels.slack.enabled true
```

### 第 5 步：配置事件订阅

**为什么**  
需要订阅事件才能实时接收消息。

**Socket Mode（推荐用于开发）**：
1. 在左侧菜单选择 **Socket Mode**
2. 启用 Socket Mode
3. 生成 **App-Level Token**（添加 `connections:write` 权限）

**HTTP 模式（生产环境）**：
1. 在 **Event Subscriptions** 中启用
2. 设置 **Request URL**: `https://your-domain.com/slack/events`
3. 订阅以下事件：
   - `app_mention`
   - `message.channels`
   - `message.groups`
   - `message.im`
   - `message.mpim`

## 第二部分：Discord 集成

### 第 1 步：创建 Discord 应用

**为什么**  
Discord Bot 需要关联到 Discord 开发者应用。

1. 访问 [Discord Developer Portal](https://discord.com/developers/applications)
2. 点击 **New Application**
3. 输入应用名称："OpenClaw Assistant"
4. 点击 **Create**

### 第 2 步：创建 Bot 用户

**为什么**  
Bot 用户是 Discord 中代表 AI 助手的实体。

1. 在左侧菜单选择 **Bot**
2. 点击 **Add Bot** → **Yes, do it!**
3. 配置 Bot 设置：
   - **Username**: 修改显示名称
   - **Icon**: 上传头像
   - **Public Bot**: 关闭（防止被添加到其他服务器）

### 第 3 步：获取 Bot Token

1. 在 **Bot** 页面找到 **Token** 部分
2. 点击 **Reset Token**（首次创建会自动生成）
3. 复制 Token

::: warning 安全提醒
**Token 只能查看一次！** 如果丢失需要重新生成。
:::

### 第 4 步：配置权限和 Gateway Intents

**为什么**  
Discord 使用权限位和 Intents 控制 Bot 能做什么。

**Privileged Gateway Intents**（启用）：
- ☑️ **Presence Intent**
- ☑️ **Server Members Intent**
- ☑️ **Message Content Intent**

**Bot Permissions**（计算权限位）：
```
Send Messages               0x00000800
Read Message History        0x00010000
Add Reactions               0x00000040
Attach Files                0x00008000
Embed Links                 0x00004000
Use Slash Commands          0x00800000
Mention Everyone            0x00020000
```

总计权限位：`274877910080`

### 第 5 步：邀请 Bot 到服务器

1. 在 **OAuth2** → **URL Generator** 中：
   - **Scopes**: 勾选 `bot`, `applications.commands`
   - **Bot Permissions**: 选择上述权限
2. 复制生成的 URL
3. 在浏览器中打开，选择目标服务器
4. 授权并验证

### 第 6 步：配置 OpenClaw

```bash
# 设置 Discord Bot Token
openclaw config set channels.discord.botToken "your-discord-bot-token"

# 配置 Gateway Intents
openclaw config set channels.discord.intents 274877910080

# 启用 Discord 频道
openclaw config set channels.discord.enabled true

# 配置命令前缀（可选）
openclaw config set channels.discord.prefix "!"
```

## 第三部分：权限管理

### Slack 权限配置

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "${SLACK_BOT_TOKEN}",
      "appToken": "${SLACK_APP_TOKEN}",
      "socketMode": true,
      "allowFrom": ["U1234567890"],
      "groupPolicy": "admins",
      "dmPolicy": "allow"
    }
  }
}
```

### Discord 权限配置

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "botToken": "${DISCORD_BOT_TOKEN}",
      "intents": 274877910080,
      "allowFrom": ["123456789012345678"],
      "guildPolicy": "admins",
      "dmPolicy": "allow"
    }
  }
}
```

## 检查点 ✅

验证配置：

```bash
# 检查 Slack 状态
openclaw channels status slack

# 检查 Discord 状态
openclaw channels status discord

# 预期输出
┌─────────────────────────────────────┐
│  Slack Status                       │
├─────────────────────────────────────┤
│  Status:     ✅ Connected            │
│  Mode:       Socket Mode             │
│  Workspace:  Your Workspace          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Discord Status                     │
├─────────────────────────────────────┤
│  Status:     ✅ Connected            │
│  Gateway:    ✅ Connected            │
│  Servers:    3 connected             │
└─────────────────────────────────────┘
```

## 踩坑提醒

::: warning Slack 常见问题
1. **Token 权限不足**  
   症状：`missing_scope`  
   解决：在 Slack App 设置中添加所需权限范围

2. **Socket Mode 连接失败**  
   症状：`Connection refused`  
   解决：确保 App Token 有 `connections:write` 权限

3. **事件未触发**  
   症状：收不到消息事件  
   解决：检查事件订阅配置，确保 Bot 已加入频道

4. **签名验证失败**  
   症状：`Invalid signature`  
   解决：检查 `signingSecret` 配置是否正确
:::

::: warning Discord 常见问题
1. **Gateway Intents 未启用**  
   症状：收不到消息内容  
   解决：在 Bot 设置中启用 **Message Content Intent**

2. **权限不足**  
   症状：`Missing Permissions`  
   解决：重新生成邀请链接，包含所需权限

3. **Rate Limit**  
   症状：`You are being rate limited`  
   解决：减少请求频率，实现退避策略

4. **Token 失效**  
   症状：`Authentication failed`  
   解决：检查 Token 是否正确，必要时重新生成
:::

## 本课小结

在本课程中，你学习了：

- ✅ 创建 Slack App 和配置 Bot 权限
- ✅ 设置 Socket Mode 或 HTTP 事件订阅
- ✅ 创建 Discord 应用和 Bot 用户
- ✅ 配置 Gateway Intents 和权限位
- ✅ 邀请 Bot 到工作区/服务器
- ✅ 理解 OAuth 授权流程
- ✅ 配置 OpenClaw 集成两个平台

## 下一课预告

> 下一课我们学习 **[其他频道配置](../other-channels/)**。
>
> 你会学到：
> - Signal、BlueBubbles、MS Teams 配置
> - Matrix、Zalo 等扩展频道
> - 自定义频道开发入门

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Slack 实现 | [`src/slack/`](https://github.com/openclaw/openclaw/blob/main/src/slack/) | - |
| Slack 配置类型 | [`src/config/types.slack.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.slack.ts) | - |
| Discord 实现 | [`src/discord/`](https://github.com/openclaw/openclaw/blob/main/src/discord/) | - |
| Discord 扩展 | [`extensions/discord/`](https://github.com/openclaw/openclaw/blob/main/extensions/discord/) | - |
| Slack 动作处理 | [`src/channels/plugins/actions/slack.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/actions/slack.ts) | - |

**关键库**：
- Slack: `@slack/bolt` - 官方 Bolt 框架
- Discord: `discord.js` - 最流行的 Discord 库

</details>
