---
title: "DM 配对与访问控制：保护你的 AI 助手 | Clawdbot 教程"
sidebarTitle: "管理陌生人访问"
subtitle: "DM 配对与访问控制：保护你的 AI 助手"
description: "了解 Clawdbot 的 DM 配对保护机制，学习如何通过 CLI 批准陌生发送者的配对请求、列出待批准请求和管理允许列表。本教程完整介绍配对流程、CLI 命令使用、访问策略配置和安全最佳实践，包含常见错误排查和 doctor 命令。"
tags:
  - "入门"
  - "安全"
  - "配对"
  - "访问控制"
prerequisite:
  - "start-gateway-startup"
order: 50
---

# DM 配对与访问控制：保护你的 AI 助手

## 学完你能做什么

完成本教程后，你将能够：

- ✅ 理解默认的 DM 配对保护机制
- ✅ 批准陌生发送者的配对请求
- ✅ 列出和管理待批准的配对请求
- ✅ 配置不同的 DM 访问策略（pairing/allowlist/open）
- ✅ 运行 doctor 检查安全配置

## 你现在的困境

你可能刚配置了 WhatsApp 或 Telegram 渠道，希望与 AI 助手对话，但遇到了以下问题：

- "为什么陌生人给我发消息，Clawdbot 不回复？"
- "收到一个配对代码，不知道是什么意思"
- "想批准某个人的请求，但不知道用什么命令"
- "如何确认当前有哪些人在等待批准？"

好消息是：**Clawdbot 默认启用 DM 配对保护**，这是为了确保只有你授权的发送者才能与 AI 助手对话。

## 什么时候用这一招

当你需要：

- 🛡 **保护隐私**：确保只有信任的人能与 AI 助手对话
- ✅ **批准陌生人**：允许新的发送者访问你的 AI 助手
- 🔒 **严格访问控制**：限制特定用户的访问权限
- 📋 **批量管理**：查看和管理所有待批准的配对请求

---

## 核心思路

### 什么是 DM 配对？

Clawdbot 连接到真实的消息平台（WhatsApp、Telegram、Slack 等），这些平台上的**私聊（DM）默认被视为不受信任的输入**。

为了保护你的 AI 助手，Clawdbot 提供了**配对机制**：

::: info 配对流程
1. 陌生发送者向你发送消息
2. Clawdbot 检测到该发送者未被授权
3. Clawdbot 返回一个**配对代码**（8 位字符）
4. 发送者需要将配对代码提供给你
5. 你通过 CLI 批准该代码
6. 发送者 ID 被添加到允许列表
7. 发送者可以正常与 AI 助手对话
:::

### 默认 DM 策略

**所有渠道默认使用 `dmPolicy="pairing"`**，这意味着：

| 策略 | 行为 |
|--- | ---|
| `pairing` | 未知发送者收到配对代码，消息不处理（默认） |
| `allowlist` | 只允许 `allowFrom` 列表中的发送者 |
| `open` | 允许所有发送者（需显式配置 `"*"`） |
| `disabled` | 完全禁用 DM 功能 |

::: warning 安全提醒
默认的 `pairing` 模式是最安全的选择。除非你有特殊需求，否则不要修改为 `open` 模式。
:::

---

## 🎒 开始前的准备

确保你已经：

- [x] 完成了 [快速开始](../getting-started/) 教程
- [x] 完成了 [启动 Gateway](../gateway-startup/) 教程
- [x] 配置了至少一个消息渠道（WhatsApp、Telegram、Slack 等）
- [x] Gateway 正在运行

---

## 跟我做

### 第 1 步：理解配对代码的来源

当一个陌生发送者向你的 Clawdbot 发送消息时，他们会收到类似以下的回复：

```
Clawdbot: access not configured.

Telegram ID: 123456789

Pairing code: AB3D7X9K

Ask the bot owner to approve with:
clawdbot pairing approve telegram <code>
```

**配对代码的关键特性**（来源：`src/pairing/pairing-store.ts`）：

- **8 位字符**：便于输入和记忆
- **大写字母和数字**：避免混淆
- **排除易混淆字符**：不包含 0、O、1、I
- **1 小时有效期**：超过时间会自动失效
- **最多保留 3 个待批准请求**：超过后会自动清理最旧的请求

### 第 2 步：列出待批准的配对请求

在终端中运行以下命令：

```bash
clawdbot pairing list telegram
```

**你应该看到**：

```
Pairing requests (1)

┌──────────────────┬────────────────┬────────┬──────────────────────┐
│ Code            │ ID            │ Meta   │ Requested            │
├──────────────────┼────────────────┼────────┼──────────────────────┤
│ AB3D7X9K        │ 123456789      │        │ 2026-01-27T10:30:00Z │
└──────────────────┴────────────────┴────────┴──────────────────────┘
```

如果没有待批准的请求，你会看到：

```
No pending telegram pairing requests.
```

::: tip 支持的渠道
配对功能支持以下渠道：
- telegram
- whatsapp
- slack
- discord
- signal
- imessage
- msteams
- googlechat
- bluebubbles
:::

### 第 3 步：批准配对请求

使用发送者提供的配对代码批准访问：

```bash
clawdbot pairing approve telegram AB3D7X9K
```

**你应该看到**：

```
✅ Approved telegram sender 123456789
```

::: info 批准后的效果
批准后，发送者 ID（123456789）会被自动添加到该渠道的允许列表中，存储在：
`~/.clawdbot/credentials/telegram-allowFrom.json`
:::

### 第 4 步：通知发送者（可选）

如果你想自动通知发送者，可以使用 `--notify` 标志：

```bash
clawdbot pairing approve telegram AB3D7X9K --notify
```

发送者会收到以下消息（来源：`src/channels/plugins/pairing-message.ts`）：

```
✅ Clawdbot access approved. Send a message to start chatting.
```

**注意**：`--notify` 标志要求 Clawdbot Gateway 正在运行，并且该渠道处于活跃状态。

### 第 5 步：验证发送者可以正常对话

让发送者再次发送一条消息，AI 助手应该会正常回复。

---

## 检查点 ✅

完成以下检查确认配置正确：

- [ ] 运行 `clawdbot pairing list <channel>` 能看到待批准的请求
- [ ] 使用 `clawdbot pairing approve <channel> <code>` 能成功批准
- [ ] 批准后的发送者能正常与 AI 助手对话
- [ ] 配对代码会在 1 小时后自动过期（可以通过再次发送消息验证）

---

## 踩坑提醒

### 错误 1：找不到配对代码

**错误信息**：
```
No pending pairing request found for code: AB3D7X9K
```

**可能原因**：
- 配对代码已经过期（超过 1 小时）
- 配对代码输入错误（检查大小写）
- 发送者没有实际发送消息（配对代码只有在收到消息时才会生成）

**解决方法**：
- 让发送者再次发送一条消息，生成新的配对代码
- 确保配对代码正确复制（注意大小写）

### 错误 2：渠道不支持配对

**错误信息**：
```
Channel xxx does not support pairing
```

**可能原因**：
- 渠道名称拼写错误
- 该渠道不支持配对功能

**解决方法**：
- 运行 `clawdbot pairing list` 查看支持的渠道列表
- 使用正确的渠道名称

### 错误 3：通知失败

**错误信息**：
```
Failed to notify requester: <error details>
```

**可能原因**：
- Gateway 未运行
- 渠道连接断开
- 网络问题

**解决方法**：
- 确认 Gateway 正在运行
- 检查渠道连接状态：`clawdbot channels status`
- 不使用 `--notify` 标志，手动通知发送者

---

## 本课小结

本教程介绍了 Clawdbot 的 DM 配对保护机制：

- **默认安全**：所有渠道默认使用 `pairing` 模式，保护你的 AI 助手
- **配对流程**：陌生发送者收到 8 位配对代码，你需要通过 CLI 批准
- **管理命令**：
  - `clawdbot pairing list <channel>`：列出待批准请求
  - `clawdbot pairing approve <channel> <code>`：批准配对
- **存储位置**：允许列表存储在 `~/.clawdbot/credentials/<channel>-allowFrom.json`
- **自动过期**：配对请求 1 小时后自动失效

记住：**配对机制是 Clawdbot 的安全基石**，确保只有你授权的人能与 AI 助手对话。

---

## 下一课预告

> 下一课我们将学习 **[故障排除：解决常见问题](../../faq/troubleshooting/)**。
>
> 你会学到：
> - 快速诊断和系统状态检查
> - 解决 Gateway 启动、渠道连接、认证错误等问题
> - 工具调用失败和性能优化的排查方法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 配对代码生成（8 位，排除易混淆字符） | [`src/pairing/pairing-store.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-store.ts#L173-L181) | 173-181 |
| 配对请求存储与 TTL（1 小时） | [`src/pairing/pairing-store.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-store.ts#L11-L14) | 11-14 |
| 批准配对命令 | [`src/cli/pairing-cli.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/pairing-cli.ts#L107-L143) | 107-143 |
| 配对代码消息生成 | [`src/pairing/pairing-messages.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-messages.ts#L4-L20) | 4-20 |
| 允许列表存储 | [`src/pairing/pairing-store.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-store.ts#L457-L461) | 457-461 |
| 支持 `pairing` 的渠道列表 | [`src/channels/plugins/pairing.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/pairing.ts#L11-L16) | 11-16 |
| 默认 DM 策略（pairing） | [`src/config/zod-schema.providers-core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.providers-core.ts#L93) | 93 |

**关键常量**：
- `PAIRING_CODE_LENGTH = 8`：配对代码长度
- `PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"`：配对代码字符集（排除 0O1I）
- `PAIRING_PENDING_TTL_MS = 60 * 60 * 1000`：配对请求有效期（1 小时）
- `PAIRING_PENDING_MAX = 3`：最大待批准请求数

**关键函数**：
- `approveChannelPairingCode()`：批准配对代码并添加到允许列表
- `listChannelPairingRequests()`：列出待批准的配对请求
- `upsertChannelPairingRequest()`：创建或更新配对请求
- `addChannelAllowFromStoreEntry()`：添加发送者到允许列表

</details>
