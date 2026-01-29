---
title: "Slack 渠道配置完全指南：Socket/HTTP Mode、安全设置 | Clawdbot 教程"
sidebarTitle: "Slack 也用 AI"
subtitle: "Slack 渠道配置完全指南 | Clawdbot 教程"
description: "学习如何在 Clawdbot 中配置和使用 Slack 渠道。本教程涵盖 Socket Mode 和 HTTP Mode 两种连接方式、Token 获取步骤、DM 安全配置、群组管理策略以及 Slack Actions 工具使用。"
tags:
  - "platforms"
  - "slack"
  - "配置"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 90
---

# Slack 渠道配置完全指南

## 学完你能做什么

- ✅ 在 Slack 中与 Clawdbot 互动，使用 AI 助手完成任务
- ✅ 配置 DM 安全策略，保护个人隐私
- ✅ 在群组中集成 Clawdbot，智能回复 @ 提及和命令
- ✅ 使用 Slack Actions 工具（发送消息、管理 Pin、查看成员信息等）
- ✅ 选择 Socket Mode 或 HTTP Mode 两种连接方式

## 你现在的困境

Slack 是团队协作的核心工具，但你可能遇到以下问题：

- 团队讨论分散在多个频道，错过重要信息
- 需要快速查询历史消息、Pin 或成员信息，但 Slack 界面不够便捷
- 希望在 Slack 中直接使用 AI 能力，而不用切换到其他应用
- 担心在群组中开启 AI 助手会造成消息泛滥或隐私泄露

## 什么时候用这一招

- **团队日常沟通**：Slack 是你团队的主要沟通工具
- **需要 Slack 原生集成**：利用 Reaction、Pin、Thread 等功能
- **多账户需求**：需要连接多个 Slack Workspace
- **远程部署场景**：使用 HTTP Mode 连接远程 Gateway

## 🎒 开始前的准备

::: warning 前置检查
在开始前，请确认：
- 已完成 [快速开始](../../start/getting-started/)
- Gateway 已启动并运行
- 拥有 Slack Workspace 的管理员权限（创建 App）
:

**你需要的资源**：
- [Slack API 控制台](https://api.slack.com/apps) - 创建和管理 Slack App
- Clawdbot 配置文件 - 通常位于 `~/.clawdbot/clawdbot.json`

## 核心思路

Clawdbot 的 Slack 渠道基于 [Bolt](https://slack.dev/bolt-js) 框架实现，支持两种连接模式：

| 模式 | 适用场景 | 优势 | 劣势 |
|--- | --- | --- | ---|
| **Socket Mode** | 本地 Gateway、个人使用 | 配置简单（只需 Token） | 需要常连 WebSocket |
| **HTTP Mode** | 服务器部署、远程访问 | 可通过防火墙、支持负载均衡 | 需要公网 IP、配置复杂 |

**默认使用 Socket Mode**，适合大多数用户。

**认证机制**：
- **Bot Token** (`xoxb-...`) - 必需，用于 API 调用
- **App Token** (`xapp-...`) - Socket Mode 必需，用于 WebSocket 连接
- **User Token** (`xoxp-...`) - 可选，用于只读操作（历史记录、Pin、Reactions）
- **Signing Secret** - HTTP Mode 必需，用于验证 Webhook 请求

## 跟我做

### 第 1 步：创建 Slack App

**为什么**
Slack App 是 Clawdbot 与 Workspace 之间的桥梁，提供认证和权限控制。

1. 访问 [Slack API 控制台](https://api.slack.com/apps)
2. 点击 **Create New App** → 选择 **From scratch**
3. 填写 App 信息：
   - **App Name**：`Clawdbot`（或你喜欢的名称）
   - **Pick a workspace to develop your app in**：选择你的 Workspace
4. 点击 **Create App**

**你应该看到**：
App 创建成功，进入基本配置页面。

### 第 2 步：配置 Socket Mode（推荐）

::: tip 提示
如果你使用本地 Gateway，推荐 Socket Mode，配置更简单。
:

**为什么**
Socket Mode 不需要公网 IP，通过 Slack 的 WebSocket 服务连接。

1. 在 App 配置页面，找到 **Socket Mode**，切换为 **On**
2. 滚动到 **App-Level Tokens**，点击 **Generate Token and Scopes**
3. 在 **Token** 部分，选择 scope：
   - 勾选 `connections:write`
4. 点击 **Generate Token**，复制生成的 **App Token**（以 `xapp-` 开头）

**你应该看到**：
生成的 Token 类似：`xapp-1-A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P`

::: danger 安全提醒
App Token 是敏感信息，请妥善保管，不要泄露到公开仓库。
:

### 第 3 步：配置 Bot Token 和权限

1. 滚动到 **OAuth & Permissions** → **Bot Token Scopes**
2. 添加以下 scopes（权限）：

**Bot Token Scopes（必需）**：

```yaml
    chat:write                    # 发送/编辑/删除消息
    channels:history              # 读取频道历史
    channels:read                 # 获取频道信息
    groups:history                # 读取群组历史
    groups:read                   # 获取群组信息
    im:history                   # 读取 DM 历史
    im:read                      # 获取 DM 信息
    im:write                     # 开启 DM 会话
    mpim:history                # 读取群组 DM 历史
    mpim:read                   # 获取群组 DM 信息
    users:read                   # 查询用户信息
    app_mentions:read            # 读取 @ 提及
    reactions:read               # 读取 Reaction
    reactions:write              # 添加/删除 Reaction
    pins:read                    # 读取 Pin 列表
    pins:write                   # 添加/删除 Pin
    emoji:read                   # 读取自定义 Emoji
    commands                     # 处理斜杠命令
    files:read                   # 读取文件信息
    files:write                  # 上传文件
```

::: info 说明
以上是 **Bot Token** 的必需权限，确保 Bot 能正常读取消息、发送回复、管理 Reaction 和 Pin。
:

3. 滚动到页面顶部，点击 **Install to Workspace**
4. 点击 **Allow** 授权 App 访问你的 Workspace
5. 复制生成的 **Bot User OAuth Token**（以 `xoxb-` 开头）

**你应该看到**：
Token 类似：`xoxb-YOUR-BOT-TOKEN-HERE`

::: tip 提示
 如果你需要 **User Token**（用于只读操作），滚动到 **User Token Scopes**，添加以下权限：
- `channels:history`, `groups:history`, `im:history`, `mpim:history`
- `channels:read`, `groups:read`, `im:read`, `mpim:read`
- `users:read`, `reactions:read`, `pins:read`, `emoji:read`
- `search:read`

然后在 **Install App** 页面复制 **User OAuth Token**（以 `xoxp-` 开头）。

**User Token Scopes（可选，只读）**：
- 仅用于读取历史记录、Reaction、Pin、Emoji 和搜索
- 写入操作仍使用 Bot Token（除非设置 `userTokenReadOnly: false`）
:

### 第 4 步：配置事件订阅

1. 在 App 配置页面，找到 **Event Subscriptions**，启用 **Enable Events**
2. 在 **Subscribe to bot events** 中添加以下事件：

```yaml
    app_mention                  # @ 提及 Bot
    message.channels              # 频道消息
    message.groups               # 群组消息
    message.im                   # DM 消息
    message.mpim                # 群组 DM 消息
    reaction_added               # 添加 Reaction
    reaction_removed             # 删除 Reaction
    member_joined_channel       # 成员加入频道
    member_left_channel          # 成员离开频道
    channel_rename               # 频道重命名
    pin_added                   # 添加 Pin
    pin_removed                 # 删除 Pin
```

3. 点击 **Save Changes**

### 第 5 步：启用 DM 功能

1. 在 App 配置页面，找到 **App Home**
2. 启用 **Messages Tab** → 开启 **Enable Messages Tab**
3. 确保显示 **Messages tab read-only disabled: No**

**你应该看到**：
Messages Tab 已启用，用户可以与 Bot 进行 DM 对话。

### 第 6 步：配置 Clawdbot

**为什么**
将 Slack Token 配置到 Clawdbot，建立连接。

#### 方式一：使用环境变量（推荐）

```bash
    # 设置环境变量
    export SLACK_BOT_TOKEN="xoxb-你的BotToken"
    export SLACK_APP_TOKEN="xapp-你的AppToken"

    # 重启 Gateway
    clawdbot gateway restart
```

**你应该看到**：
Gateway 启动日志中显示 `Slack: connected`。

#### 方式二：配置文件

编辑 `~/.clawdbot/clawdbot.json`：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken"
    }
  }
}
```

**如果你有 User Token**：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken",
      "userToken": "xoxp-你的UserToken",
      "userTokenReadOnly": true
    }
  }
}
```

**你应该看到**：
重启 Gateway 后，Slack 连接成功。

### 第 7 步：邀请 Bot 到频道

1. 在 Slack 中打开你想让 Bot 加入的频道
2. 输入 `/invite @Clawdbot`（替换为你的 Bot 名称）
3. 点击 **Add to channel**

**你应该看到**：
Bot 成功加入频道，并显示 "Clawdbot has joined the channel"。

### 第 8 步：配置群组安全策略

**为什么**
防止 Bot 在所有频道中自动回复，保护隐私。

编辑 `~/.clawdbot/clawdbot.json`：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken",
      "groupPolicy": "allowlist",
      "channels": {
        "C1234567890": {
          "allow": true,
          "requireMention": true
        },
        "#general": {
          "allow": true,
          "requireMention": true
        }
      }
    }
  }
}
```

**字段说明**：
- `groupPolicy`: 群组策略
  - `"open"` - 允许所有频道（不推荐）
  - `"allowlist"` - 仅允许列出的频道（推荐）
  - `"disabled"` - 禁止所有频道
- `channels`: 频道配置
  - `allow`: 允许/拒绝
  - `requireMention`: 是否需要 @ 提及 Bot 才回复（默认 `true`）
  - `users`: 额外的用户白名单
  - `skills`: 限制该频道使用的技能
  - `systemPrompt`: 额外的系统提示词

**你应该看到**：
Bot 只在配置的频道中回复消息，且需要 @ 提及。

### 第 9 步：配置 DM 安全策略

**为什么**
防止陌生人通过 DM 与 Bot 交互，保护隐私。

编辑 `~/.clawdbot/clawdbot.json`：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken",
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["U1234567890", "@alice", "user@example.com"]
      }
    }
  }
}
```

**字段说明**：
- `dm.enabled`: 启用/禁用 DM（默认 `true`）
- `dm.policy`: DM 策略
  - `"pairing"` - 陌生人收到配对码，需要审批（默认）
  - `"open"` - 允许任何人 DM
  - `"allowlist"` - 仅允许白名单用户
- `dm.allowFrom`: 白名单列表
  - 支持用户 ID（`U1234567890`）
  - 支持 @ 提及（`@alice`）
  - 支持邮箱（`user@example.com`）

**配对流程**：
1. 陌生人发送 DM 给 Bot
2. Bot 回复配对码（有效期 1 小时）
3. 用户提供配对码给管理员
4. 管理员执行：`clawdbot pairing approve slack <配对码>`
5. 用户被加入白名单，可以正常使用

**你应该看到**：
未知发送者收到配对码，Bot 不处理他们的消息。

### 第 10 步：测试 Bot

1. 在配置的频道中发送消息：`@Clawdbot 你好`
2. 或发送 DM 给 Bot
3. 观察 Bot 的回复

**你应该看到**：
Bot 正常回复你的消息。

### 检查点 ✅

- [ ] Slack App 创建成功
- [ ] Socket Mode 已启用
- [ ] Bot Token 和 App Token 已复制
- [ ] Clawdbot 配置文件已更新
- [ ] Gateway 已重启
- [ ] Bot 已邀请到频道
- [ ] 群组安全策略已配置
- [ ] DM 安全策略已配置
- [ ] 测试消息收到回复

## 踩坑提醒

### 常见错误 1：Bot 无响应

**问题**：发送消息后，Bot 没有回复。

**可能原因**：
1. Bot 未加入频道 → 使用 `/invite @Clawdbot` 邀请
2. `requireMention` 设置为 `true` → 发送消息时需要 `@Clawdbot`
3. Token 配置错误 → 检查 `clawdbot.json` 中的 Token 是否正确
4. Gateway 未运行 → 运行 `clawdbot gateway status` 检查状态

### 常见错误 2：Socket Mode 连接失败

**问题**：Gateway 日志显示连接失败。

**解决方法**：
1. 检查 App Token 是否正确（以 `xapp-` 开头）
2. 检查 Socket Mode 是否启用
3. 检查网络连接

### 常见错误 3：User Token 权限不足

**问题**：某些操作失败，提示权限错误。

**解决方法**：
1. 确保 User Token 包含所需权限（见步骤 3）
2. 检查 `userTokenReadOnly` 设置（默认 `true`，只读）
3. 如需写入操作，设置 `"userTokenReadOnly": false`

### 常见错误 4：频道 ID 解析失败

**问题**：配置的频道名称无法解析为 ID。

**解决方法**：
1. 优先使用频道 ID（如 `C1234567890`）而非名称
2. 确保频道名称以 `#` 开头（如 `#general`）
3. 检查 Bot 是否有权限访问该频道

## 进阶配置

### 权限说明

::: info Bot Token vs User Token
- **Bot Token**：必需，用于 Bot 的主要功能（发送消息、读取历史、管理 Pin/Reaction 等）
- **User Token**：可选，仅用于只读操作（历史记录、Reaction、Pin、Emoji、搜索）
  - 默认 `userTokenReadOnly: true`，确保只读
  - 写入操作（发送消息、添加 Reaction 等）仍使用 Bot Token
:

**未来可能需要的权限**：

以下权限在当前版本中不是必需的，但未来可能添加支持：

| 权限 | 用途 |
|--- | ---|
| `groups:write` | 私有频道管理（创建、重命名、邀请、归档） |
| `mpim:write` | 群组 DM 会话管理 |
| `chat:write.public` | 向 Bot 未加入的频道发布消息 |
| `files:read` | 列出/读取文件元数据 |

如需启用这些功能，请在 Slack App 的 **Bot Token Scopes** 中添加对应权限。

### HTTP Mode（服务器部署）

如果你的 Gateway 部署在远程服务器，使用 HTTP Mode：

1. 创建 Slack App，禁用 Socket Mode
2. 复制 **Signing Secret**（Basic Information 页面）
3. 配置 Event Subscriptions，设置 **Request URL** 为 `https://你的域名/slack/events`
4. 配置 Interactivity & Shortcuts，设置相同的 **Request URL**
5. 配置 Slash Commands，设置 **Request URL**

**配置文件**：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "http",
      "botToken": "xoxb-你的BotToken",
      "signingSecret": "你的SigningSecret",
      "webhookPath": "/slack/events"
    }
  }
}
```

### 多账户配置

支持连接多个 Slack Workspace：

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "workspace1": {
          "name": "Team A",
          "enabled": true,
          "botToken": "xoxb-Workspace1Token",
          "appToken": "xapp-Workspace1Token"
        },
        "workspace2": {
          "name": "Team B",
          "enabled": true,
          "botToken": "xoxb-Workspace2Token",
          "appToken": "xapp-Workspace2Token"
        }
      }
    }
  }
}
```

### 配置斜杠命令

启用 `/clawd` 命令：

1. 在 App 配置页面，找到 **Slash Commands**
2. 创建命令：
   - **Command**：`/clawd`
   - **Request URL**：Socket Mode 不需要（通过 WebSocket 处理）
   - **Description**：`Send a message to Clawdbot`

**配置文件**：

```json
{
  "channels": {
    "slack": {
      "slashCommand": {
        "enabled": true,
        "name": "clawd",
        "ephemeral": true
      }
    }
  }
}
```

### 回复线程配置

控制 Bot 在频道中的回复方式：

```json
{
  "channels": {
    "slack": {
      "replyToMode": "off",
      "replyToModeByChatType": {
        "direct": "all",
        "group": "first"
      }
    }
  }
}
```

| 模式 | 行为 |
|--- | ---|
| `off` | 默认，在主频道回复 |
| `first` | 首条回复进入线程，后续回复在主频道 |
| `all` | 所有回复都在线程 |

### 启用 Slack Actions 工具

允许 Agent 调用 Slack 特定操作：

```json
{
  "channels": {
    "slack": {
      "actions": {
        "reactions": true,
        "messages": true,
        "pins": true,
        "memberInfo": true,
        "emojiList": true
      }
    }
  }
}
```

**可用操作**：
- `sendMessage` - 发送消息
- `editMessage` - 编辑消息
- `deleteMessage` - 删除消息
- `readMessages` - 读取历史消息
- `react` - 添加 Reaction
- `reactions` - 列出 Reactions
- `pinMessage` - Pin 消息
- `unpinMessage` - 取消 Pin
- `listPins` - 列出 Pin
- `memberInfo` - 获取成员信息
- `emojiList` - 列出自定义 Emoji

## 本课小结

- Slack 渠道支持 Socket Mode 和 HTTP Mode 两种连接方式
- Socket Mode 配置简单，推荐本地使用
- DM 安全策略默认为 `pairing`，陌生人需要审批
- 群组安全策略支持白名单和 @ 提及过滤
- Slack Actions 工具提供丰富的操作能力
- 多账户支持连接多个 Workspace

## 下一课预告

> 下一课我们学习 **[Discord 渠道](../discord/)**。
>
> 你会学到：
> - Discord Bot 的配置方法
> - Token 获取和权限设置
> - 群组和 DM 安全策略
> - Discord 特定工具的使用

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能            | 文件路径                                                                                               | 行号       |
|--- | --- | ---|
| Slack 配置类型 | [`src/config/types.slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.slack.ts) | 1-150      |
| Slack onboarding 逻辑 | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 1-539      |
| Slack Actions 工具 | [`src/agents/tools/slack-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/slack-actions.ts) | 1-301      |
| Slack 官方文档 | [`docs/channels/slack.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/slack.md) | 1-508      |

**关键类型定义**：
- `SlackConfig`：Slack 渠道主配置类型
- `SlackAccountConfig`：单账户配置（支持 socket/http 模式）
- `SlackChannelConfig`：频道配置（白名单、mention 策略等）
- `SlackDmConfig`：DM 配置（pairing、allowlist 等）
- `SlackActionConfig`：Actions 工具权限控制

**关键函数**：
- `handleSlackAction()`：处理 Slack Actions 工具调用
- `resolveThreadTsFromContext()`：根据 replyToMode 解析线程 ID
- `buildSlackManifest()`：生成 Slack App Manifest

</details>
