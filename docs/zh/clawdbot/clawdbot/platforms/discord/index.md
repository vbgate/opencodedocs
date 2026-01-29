---
title: "Discord 渠道配置与使用 | Clawdbot 教程"
sidebarTitle: "连接你的 Discord Bot"
subtitle: "Discord 渠道配置与使用"
description: "学习如何创建 Discord Bot 并配置到 Clawdbot。本教程涵盖 Discord Developer Portal 创建 Bot、Gateway Intents 权限设置、Bot Token 配置方法、OAuth2 邀请 URL 生成、DM 配对保护机制、服务器频道白名单配置、AI Discord 工具调用权限管理以及常见问题故障排除步骤。"
tags:
  - "渠道配置"
  - "Discord"
  - "Bot"
prerequisite:
  - "start-getting-started"
order: 100
---

# Discord 渠道配置与使用

## 学完你能做什么

- 创建 Discord Bot 并获取 Bot Token
- 配置 Clawdbot 与 Discord Bot 集成
- 在 Discord 私聊（DM）和服务器频道中使用 AI 助手
- 配置访问控制（DM 配对、频道白名单）
- 让 AI 调用 Discord 工具（发送消息、创建频道、管理角色等）

## 你现在的困境

你已经在使用 Discord 与朋友或团队交流，希望在不切换应用的情况下，直接在 Discord 中与 AI 助手对话。你可能遇到以下问题：

- 不知道如何创建 Discord Bot
- 不清楚需要哪些权限才能让 Bot 正常工作
- 想控制谁能与 Bot 交互（避免陌生人滥用）
- 希望在不同服务器频道中配置不同的行为

本教程将一步步教你解决这些问题。

## 什么时候用这一招

Discord 渠道适合这些场景：

- ✅ 你是 Discord 重度用户，大部分交流都在 Discord 上
- ✅ 你想在 Discord 服务器中添加 AI 功能（比如 `#help` 频道的智能助手）
- ✅ 你希望通过 Discord 私聊与 AI 交互（比打开 WebChat 更方便）
- ✅ 你需要 AI 在 Discord 中执行管理操作（创建频道、发送消息等）

::: info Discord 渠道基于 discord.js，支持完整的 Bot API 功能。
:::

## 🎒 开始前的准备

**必备条件**：
- 已完成[快速开始](../../start/getting-started/)，Gateway 可以运行
- Node.js ≥ 22
- Discord 账号（可以创建应用程序）

**需要的信息**：
- Discord Bot Token（稍后教你如何获取）
- 服务器 ID（可选，用于配置特定频道）
- 频道 ID（可选，用于精细化控制）

## 核心思路

### Discord 渠道如何工作

Discord 渠道通过**官方 Bot API**与 Discord 通信：

```
Discord 用户
     ↓
  Discord 服务器
     ↓
  Discord Bot Gateway
     ↓ (WebSocket)
  Clawdbot Gateway
     ↓
  AI Agent (Claude/GPT 等)
     ↓
  Discord Bot API (发送回复)
     ↓
Discord 服务器
     ↓
Discord 用户（看到回复）
```

**关键点**：
- Bot 通过 WebSocket 接收消息（Gateway → Bot）
- Clawdbot 将消息转发给 AI Agent 处理
- AI 可以调用 `discord` 工具执行 Discord 特定操作
- 所有响应通过 Bot API 发回 Discord

### DM 与服务器频道的区别

| 类型 | 会话隔离 | 默认行为 | 适用场景 |
| --- | --- | --- | --- |
| **私聊（DM）** | 所有 DM 共享 `agent:main:main` 会话 | 需配对（pairing）保护 | 个人对话，延续上下文 |
| **服务器频道** | 每个频道独立会话 `agent:<agentId>:discord:channel:<channelId>` | 需 @提及才回复 | 服务器智能助手，多频道并行 |

::: tip
服务器频道的会话是完全隔离的，不会互相干扰。`#help` 频道的对话不会出现在 `#general` 中。
:::

### 默认安全机制

Discord 渠道默认启用**DM 配对保护**：

```
未知用户 → 发送 DM → Clawdbot
                              ↓
                      拒绝处理，返回配对码
                              ↓
                用户需要执行 `clawdbot pairing approve discord <code>`
                              ↓
                            配对成功，可以对话
```

这避免了陌生用户直接与你的 AI 助手交互。

---

## 跟我做

### 第 1 步：创建 Discord 应用和 Bot

**为什么**
Discord Bot 需要一个"身份"才能连接到 Discord 服务器。这个身份就是 Bot Token。

#### 1.1 创建 Discord 应用

1. 打开 [Discord Developer Portal](https://discord.com/developers/applications)
2. 点击 **New Application**（新建应用）
3. 输入应用名称（比如 `Clawdbot AI`）
4. 点击 **Create**（创建）

#### 1.2 添加 Bot 用户

1. 在左侧导航栏点击 **Bot**（机器人）
2. 点击 **Add Bot** → **Reset Token** → **Reset Token**（重置令牌）
3. **重要**：立即复制 Bot Token（只显示一次！）

```
Bot Token 格式：MTAwOTk1MDk5NjQ5NTExNjUy.Gm9...
（每次重置都会改变，妥善保存！）
```

#### 1.3 启用必要的 Gateway Intents

Discord 默认不会让 Bot 读取消息内容，需要手动启用。

在 **Bot → Privileged Gateway Intents**（特权网关意图）中启用：

| Intent | 是否必需 | 说明 |
| --- | --- | --- |
| **Message Content Intent** | ✅ **必需** | 读取消息文本内容（没有它，Bot 无法看到消息） |
| **Server Members Intent** | ⚠️ **推荐** | 用于成员查找和用户名解析 |

::: danger 禁忌
不要启用 **Presence Intent**（状态意图），除非你确实需要用户在线状态。
:::

**你应该看到**：两个开关都变为绿色（ON）状态。

---

### 第 2 步：生成邀请 URL 并添加到服务器

**为什么**
Bot 需要权限才能在服务器中读取和发送消息。

1. 在左侧导航栏点击 **OAuth2 → URL Generator**
2. 在 **Scopes**（范围）中选择：
   - ✅ **bot**
   - ✅ **applications.commands**（用于原生命令）

3. 在 **Bot Permissions**（Bot 权限）中至少选择：

| 权限 | 说明 |
| --- | --- |
| **View Channels** | 查看频道 |
| **Send Messages** | 发送消息 |
| **Read Message History** | 读取历史消息 |
| **Embed Links** | 嵌入链接 |
| **Attach Files** | 上传文件 |

可选权限（根据需要添加）：
- **Add Reactions**（添加表情反应）
- **Use External Emojis**（使用自定义表情）

::: warning 安全提示
避免授予 **Administrator**（管理员）权限，除非你在调试且完全信任 Bot。
:::

4. 复制生成的 URL
5. 在浏览器中打开 URL
6. 选择你的服务器，点击 **授权**（Authorize）

**你应该看到**：Bot 成功加入服务器，显示为绿色在线状态。

---

### 第 3 步：获取必要 ID（服务器、频道、用户）

**为什么**
Clawdbot 的配置首选使用 ID（数字），因为 ID 不会改变。

#### 3.1 启用 Discord 开发者模式

1. Discord 桌面/网页版 → **User Settings**（用户设置）
2. **Advanced**（高级）→ 启用 **Developer Mode**（开发者模式）

#### 3.2 复制 ID

| 类型 | 操作 |
| --- | --- |
| **服务器 ID** | 右键服务器名称 → **Copy Server ID** |
| **频道 ID** | 右键频道（如 `#general`）→ **Copy Channel ID** |
| **用户 ID** | 右键用户头像 → **Copy User ID** |

::: tip ID vs 名称
配置时优先使用 ID。名称可能改变，但 ID 永远不会变。
:::

**你应该看到**：ID 已复制到剪贴板（格式：`123456789012345678`）。

---

### 第 4 步：配置 Clawdbot 连接 Discord

**为什么**
告诉 Clawdbot 如何连接到你的 Discord Bot。

#### 方法 1：通过环境变量（推荐，适用于服务器）

```bash
export DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"

clawdbot gateway --port 18789
```

#### 方法 2：通过配置文件

编辑 `~/.clawdbot/clawdbot.json`：

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "YOUR_BOT_TOKEN"  // 第 1 步复制的 Token
    }
  }
}
```

::: tip 环境变量优先级
如果同时设置了环境变量和配置文件，**配置文件优先**。
:::

**你应该看到**：启动 Gateway 后，Discord Bot 显示为在线状态。

---

### 第 5 步：验证连接并测试

**为什么**
确保配置正确，Bot 能正常接收和发送消息。

1. 启动 Gateway（如果还没启动）：

```bash
clawdbot gateway --port 18789 --verbose
```

2. 检查 Discord Bot 状态：
   - Bot 应该在服务器成员列表中显示为**绿色在线**
   - 如果是灰色离线，检查 Token 是否正确

3. 发送测试消息：

在 Discord 中：
- **私聊**：直接向 Bot 发送消息（会收到配对码，见下一节）
- **服务器频道**：@提及 Bot，如 `@ClawdbotAI hello`

**你应该看到**：Bot 回复一条消息（内容取决于你的 AI 模型）。

::: tip 测试失败？
如果 Bot 没有回复，检查[故障排除](#故障排除)部分。
:::

---

## 检查点 ✅

在继续之前，确认以下内容：

- [ ] Bot Token 已正确配置
- [ ] Bot 已成功加入服务器
- [ ] Message Content Intent 已启用
- [ ] Gateway 正在运行
- [ ] Bot 在 Discord 中显示为在线
- [ ] @提及 Bot 能收到回复

---

## 进阶配置

### DM 访问控制

默认策略是 `pairing`（配对模式），适合个人使用。你可以根据需要调整：

| 策略 | 说明 | 配置示例 |
| --- | --- | --- |
| **pairing**（默认） | 陌生人收到配对码，需手动批准 | `"dm": { "policy": "pairing" }` |
| **allowlist** | 仅允许列表中的用户 | `"dm": { "policy": "allowlist", "allowFrom": ["123456", "alice"] }` |
| **open** | 允许所有人（需 `allowFrom` 包含 `"*"`） | `"dm": { "policy": "open", "allowFrom": ["*"] }` |
| **disabled** | 禁用所有 DM | `"dm": { "enabled": false }` |

#### 配置示例：允许特定用户

```json5
{
  channels: {
    discord: {
      dm: {
        enabled: true,
        policy: "allowlist",
        allowFrom: [
          "123456789012345678",  // 用户 ID
          "@alice",                   // 用户名（会被解析为 ID）
          "alice#1234"              // 完整用户名
        ]
      }
    }
  }
}
```

#### 批准配对请求

当陌生用户首次发送 DM 时，会收到配对码。批准方式：

```bash
clawdbot pairing approve discord <配对码>
```

### 服务器频道配置

#### 基础配置：只允许特定频道

```json5
{
  channels: {
    discord: {
      groupPolicy: "allowlist",  // 白名单模式（默认）
      guilds: {
        "123456789012345678": {
          requireMention: true,  // 需要 @提及才回复
          channels: {
            help: { allow: true },    // 允许 #help
            general: { allow: true } // 允许 #general
          }
        }
      }
    }
  }
}
```

::: tip
`requireMention: true` 是推荐配置，避免 Bot 在公开频道中"自作聪明"。
:::

#### 高级配置：频道专属行为

```json5
{
  channels: {
    discord: {
      guilds: {
        "123456789012345678": {
          slug: "my-server",              // 显示名称（可选）
          reactionNotifications: "own",      // 仅 Bot 自己消息的反应触发事件
          channels: {
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"], // 仅特定用户可以触发
              skills: ["search", "docs"],    // 限制可用技能
              systemPrompt: "Keep answers under 50 words."  // 额外系统提示
            }
          }
        }
      }
    }
  }
}
```

### Discord 工具操作

AI Agent 可以调用 `discord` 工具执行 Discord 特定操作。通过 `channels.discord.actions` 控制权限：

| 操作类别 | 默认状态 | 说明 |
| --- | --- | --- |
| **reactions** | ✅ 启用 | 添加/读取表情反应 |
| **messages** | ✅ 启用 | 读取/发送/编辑/删除消息 |
| **threads** | ✅ 启用 | 创建/回复线程 |
| **channels** | ✅ 启用 | 创建/编辑/删除频道 |
| **pins** | ✅ 启用 | 置顶/取消置顶消息 |
| **search** | ✅ 启用 | 搜索消息 |
| **memberInfo** | ✅ 启用 | 查询成员信息 |
| **roleInfo** | ✅ 启用 | 查询角色列表 |
| **roles** | ❌ **禁用** | 添加/移除角色 |
| **moderation** | ❌ **禁用** | 封禁/踢出/超时 |

#### 禁用特定操作

```json5
{
  channels: {
    discord: {
      actions: {
        channels: false,      // 禁用频道管理
        moderation: false,   // 禁用审核操作
        roles: false         // 禁用角色管理
      }
    }
  }
}
```

::: danger 安全警告
启用 `moderation` 和 `roles` 操作时，确保 AI 有严格的提示词和访问控制，避免误封禁用户。
:::

### 其他配置选项

| 配置项 | 说明 | 默认值 |
| --- | --- | --- |
| `historyLimit` | 服务器频道上下文包含的历史消息数 | 20 |
| `dmHistoryLimit` | DM 会话历史消息数 | 无限制 |
| `textChunkLimit` | 单条消息最大字符数 | 2000 |
| `maxLinesPerMessage` | 单条消息最大行数 | 17 |
| `mediaMaxMb` | 上传媒体文件最大大小（MB） | 8 |
| `chunkMode` | 消息分块模式（`length`/`newline`） | `length` |

---

## 踩坑提醒

### ❌ "Used disallowed intents" 错误

**原因**：未启用 **Message Content Intent**。

**解决**：
1. 回到 Discord Developer Portal
2. Bot → Privileged Gateway Intents
3. 启用 **Message Content Intent**
4. 重启 Gateway

### ❌ Bot 连接但不回复

**可能原因**：
1. 缺少 **Message Content Intent**
2. Bot 没有频道权限
3. 配置要求 @提及但你没有提及
4. 频道不在白名单中

**解决步骤**：
```bash
# 运行诊断工具
clawdbot doctor

# 检查渠道状态和权限
clawdbot channels status --probe
```

### ❌ DM 配对码过期

**原因**：配对码有效期为 **1 小时**。

**解决**：让用户重新发送 DM，获取新的配对码，然后批准。

### ❌ 群组 DM 被忽略

**原因**：默认 `dm.groupEnabled: false`。

**解决**：

```json5
{
  channels: {
    discord: {
      dm: {
        groupEnabled: true,
        groupChannels: ["clawd-dm"]  // 可选：仅允许特定群组 DM
      }
    }
  }
}
```

---

## 故障排除

### 常见问题诊断

```bash
# 1. 检查 Gateway 是否运行
clawdbot gateway status

# 2. 检查渠道连接状态
clawdbot channels status

# 3. 运行完整诊断（推荐！）
clawdbot doctor
```

### 日志调试

启动 Gateway 时使用 `--verbose` 查看详细日志：

```bash
clawdbot gateway --port 18789 --verbose
```

**关注这些日志**：
- `Discord channel connected: ...` → 连接成功
- `Message received from ...` → 收到消息
- `ERROR: ...` → 错误信息

---

## 本课小结

- Discord 渠道通过 **discord.js** 连接，支持 DM 和服务器频道
- 创建 Bot 需要**应用程序、Bot 用户、Gateway Intents、邀请 URL** 四步
- **Message Content Intent** 是必需的，否则 Bot 无法读取消息
- 默认启用 **DM 配对保护**，陌生人需配对才能对话
- 服务器频道可通过 `guilds.<id>.channels` 配置白名单和行为
- AI 可调用 Discord 工具执行管理操作（可通过 `actions` 控制）

---

## 下一课预告

> 下一课我们学习 **[Google Chat 渠道](../googlechat/)**。
>
> 你会学到：
> - 如何配置 Google Chat OAuth 认证
> - Google Chat Space 中的消息路由
> - 如何使用 Google Chat API 的限制

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| Discord Bot 配置 Schema | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L320-L427) | 320-427 |
| Discord Onboarding 向导 | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 1-485 |
| Discord 工具操作 | [`src/agents/tools/discord-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions.ts) | 1-72 |
| Discord 消息操作 | [`src/agents/tools/discord-actions-messaging.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-messaging.ts) | - |
| Discord 服务器操作 | [`src/agents/tools/discord-actions-guild.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-guild.ts) | - |
| Discord 官方文档 | [`docs/channels/discord.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/discord.md) | 1-400 |

**关键 Schema 字段**：
- `DiscordAccountSchema`：Discord 账户配置（token、guilds、dm、actions 等）
- `DiscordDmSchema`：DM 配置（enabled、policy、allowFrom、groupEnabled）
- `DiscordGuildSchema`：服务器配置（slug、requireMention、reactionNotifications、channels）
- `DiscordGuildChannelSchema`：频道配置（allow、requireMention、skills、systemPrompt）

**关键函数**：
- `handleDiscordAction()`：处理 Discord 工具操作入口
- `discordOnboardingAdapter.configure()`：向导式配置流程

</details>
