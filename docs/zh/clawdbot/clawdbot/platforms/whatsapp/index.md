---
title: "WhatsApp 渠道配置完全指南 | Clawdbot 教程"
sidebarTitle: "5 分钟接入 WhatsApp"
subtitle: "WhatsApp 渠道配置完全指南"
description: "学习如何在 Clawdbot 中配置和使用 WhatsApp 渠道（基于 Baileys），包括 QR 码登录、多账户管理、DM 访问控制和群组支持。"
tags:
  - "whatsapp"
  - "渠道配置"
  - "baileys"
  - "qr-login"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 70
---

# WhatsApp 渠道配置完全指南

## 学完你能做什么

- 通过 QR 码链接 WhatsApp 账户到 Clawdbot
- 配置多账户 WhatsApp 支持
- 设置 DM 访问控制（配对/白名单/公开）
- 启用和管理 WhatsApp 群组支持
- 配置自动消息确认和已读回执

## 你现在的困境

WhatsApp 是你最常用的消息平台，但你的 AI 助手还无法接收到 WhatsApp 消息。你想要：
- 在 WhatsApp 上直接和 AI 对话，不用切换应用
- 控制谁能给你的 AI 发消息
- 支持多个 WhatsApp 账号（工作/个人分离）

## 什么时候用这一招

- 你需要在 WhatsApp 上接入 AI 助手
- 你需要分离工作/个人 WhatsApp 账号
- 你想精确控制谁能给 AI 发消息

::: info 什么是 Baileys？

Baileys 是一个 WhatsApp Web 库，让程序通过 WhatsApp Web 协议收发消息。Clawdbot 使用 Baileys 连接 WhatsApp，无需使用 WhatsApp Business API，更隐私也更灵活。

:::

## 🎒 开始前的准备

在配置 WhatsApp 渠道前，请确认：

- [ ] 已安装并启动 Clawdbot Gateway
- [ ] 已完成[快速开始](../../start/getting-started/)
- [ ] 有一个可用的手机号码（推荐用备用号码）
- [ ] WhatsApp 手机能访问网络（用于扫描 QR 码）

::: warning 注意事项

- **推荐使用独立号码**：单独的 SIM 卡或旧手机，避免干扰个人使用
- **避免虚拟号码**：TextNow、Google Voice 等虚拟号码会被 WhatsApp 封禁
- **Node 运行时**：WhatsApp 和 Telegram 在 Bun 上不稳定，请使用 Node ≥22

:::

## 核心思路

WhatsApp 渠道的核心架构：

```
你的 WhatsApp 手机 ←--(QR 码)--> Baileys ←--→ Clawdbot Gateway
                                                      ↓
                                                 AI Agent
                                                      ↓
                                                 回复消息
```

**关键概念**：

1. **Baileys 会话**：通过 WhatsApp Linked Devices 建立连接
2. **DM 策略**：控制谁能给 AI 发送私聊消息
3. **多账户支持**：一个 Gateway 管理多个 WhatsApp 账号
4. **消息确认**：自动发送表情/已读回执，提升用户体验

## 跟我做

### 第 1 步：配置基础设置

**为什么**
设置 WhatsApp 的访问控制策略，保护你的 AI 助手不被滥用。

编辑 `~/.clawdbot/clawdbot.json`，添加 WhatsApp 配置：

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "allowFrom": ["+15551234567"]
    }
  }
}
```

**字段说明**：

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `dmPolicy` | string | `"pairing"` | DM 访问策略：`pairing`（配对）、`allowlist`（白名单）、`open`（公开）、`disabled`（禁用） |
| `allowFrom` | string[] | `[]` | 允许发送者的电话号码列表（E.164 格式，如 `+15551234567`） |

**DM 策略对比**：

| 策略 | 行为 | 适用场景 |
|--------|------|----------|
| `pairing` | 未知发送者收到配对码，需要手动批准 | **推荐**，平衡安全和便利性 |
| `allowlist` | 只允许 `allowFrom` 列表中的号码 | 严格控制，已知用户 |
| `open` | 任何人都可以发送（需 `allowFrom` 包含 `"*"`） | 公开测试或社区服务 |
| `disabled` | 忽略所有 WhatsApp 消息 | 暂时禁用该渠道 |

**你应该看到**：配置文件保存成功，没有 JSON 格式错误。

### 第 2 步：登录 WhatsApp

**为什么**
通过 QR 码将 WhatsApp 账户链接到 Clawdbot，Baileys 会维护会话状态。

在终端执行：

```bash
clawdbot channels login whatsapp
```

**多账户登录**：

登录特定账户：

```bash
clawdbot channels login whatsapp --account work
```

登录默认账户：

```bash
clawdbot channels login whatsapp
```

**操作步骤**：

1. 终端会显示 QR 码（或在 CLI 界面显示）
2. 打开 WhatsApp 手机应用
3. 进入 **Settings → Linked Devices**
4. 点击 **Link a Device**
5. 扫描终端显示的 QR 码

**你应该看到**：

```
✓ WhatsApp linked successfully!
Credentials stored: ~/.clawdbot/credentials/whatsapp/default/creds.json
```

::: tip 凭据存储

WhatsApp 登录凭据保存在 `~/.clawdbot/credentials/whatsapp/<accountId>/creds.json`。首次登录后，后续启动会自动恢复会话，无需重复扫描 QR 码。

:::

### 第 3 步：启动 Gateway

**为什么**
启动 Gateway 让 WhatsApp 渠道开始接收和发送消息。

```bash
clawdbot gateway
```

或使用守护进程模式：

```bash
clawdbot gateway start
```

**你应该看到**：

```
[WhatsApp] Connected to WhatsApp Web
[WhatsApp] Default account linked: +15551234567
Gateway listening on ws://127.0.0.1:18789
```

### 第 4 步：发送测试消息

**为什么**
验证 WhatsApp 渠道配置正确，能正常收发消息。

从你的 WhatsApp 手机向链接的号码发送消息：

```
你好
```

**你应该看到**：
- 终端显示收到的消息日志
- WhatsApp 收到 AI 回复

**检查点 ✅**

- [ ] Gateway 日志显示 `[WhatsApp] Received message from +15551234567`
- [ ] WhatsApp 收到 AI 回复
- [ ] 回复内容与你的输入相关

### 第 5 步：配置高级选项（可选）

#### 启用自动消息确认

在 `clawdbot.json` 中添加：

```json
{
  "channels": {
    "whatsapp": {
      "ackReaction": {
        "emoji": "👀",
        "direct": true,
        "group": "mentions"
      }
    }
  }
}
```

**字段说明**：

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `emoji` | string | - | 确认表情（如 `"👀"`、`"✅"`），空字符串表示禁用 |
| `direct` | boolean | `true` | 是否在私聊中发送确认 |
| `group` | string | `"mentions"` | 群组行为：`"always"`（所有消息）、`"mentions"`（仅 @ 提及）、`"never"`（从不） |

#### 配置已读回执

默认情况下，Clawdbot 会自动标记消息为已读（蓝勾）。要禁用：

```json
{
  "channels": {
    "whatsapp": {
      "sendReadReceipts": false
    }
  }
}
```

#### 调整消息限制

```json
{
  "channels": {
    "whatsapp": {
      "textChunkLimit": 4000,
      "mediaMaxMb": 50,
      "chunkMode": "length"
    }
  }
}
```

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `textChunkLimit` | 4000 | 单条文本消息最大字符数 |
| `mediaMaxMb` | 50 | 接收的媒体文件最大大小（MB） |
| `chunkMode` | `"length"` | 分块模式：`"length"`（按长度）、`"newline"`（按段落） |

**你应该看到**：配置生效后，长消息自动分块，媒体文件大小受控。

## 踩坑提醒

### 问题 1：QR 码扫描失败

**症状**：扫描 QR 码后，终端显示连接失败或超时。

**原因**：网络连接问题或 WhatsApp 服务不稳定。

**解决方法**：

1. 检查手机网络连接
2. 确保 Gateway 服务器能访问互联网
3. 退出并重新登录：
   ```bash
   clawdbot channels logout whatsapp
   clawdbot channels login whatsapp
   ```

### 问题 2：消息未送达或延迟

**症状**：发送消息后，很长时间才收到回复。

**原因**：Gateway 未运行或 WhatsApp 连接断开。

**解决方法**：

1. 检查 Gateway 状态：`clawdbot gateway status`
2. 重启 Gateway：`clawdbot gateway restart`
3. 查看日志：`clawdbot logs --follow`

### 问题 3：配对码未收到

**症状**：陌生人发送消息后，没有收到配对码。

**原因**：`dmPolicy` 未设置为 `pairing`。

**解决方法**：

检查 `clawdbot.json` 中的 `dmPolicy` 设置：

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing"  // ← 确保是 "pairing"
    }
  }
}
```

### 问题 4：Bun 运行时问题

**症状**：WhatsApp 和 Telegram 频繁断连或登录失败。

**原因**：Baileys 和 Telegram SDK 在 Bun 上不稳定。

**解决方法**：

使用 Node ≥22 运行 Gateway：

检查当前运行时：

```bash
node --version
```

如需切换，使用 Node 运行 Gateway：

```bash
clawdbot gateway --runtime node
```

::: tip 推荐运行时

WhatsApp 和 Telegram 渠道强烈推荐使用 Node 运行时，Bun 可能导致连接不稳定。

:::

## 本课小结

WhatsApp 渠道配置要点：

1. **基础配置**：`dmPolicy` + `allowFrom` 控制访问
2. **登录流程**：`clawdbot channels login whatsapp` 扫描 QR 码
3. **多账户**：使用 `--account` 参数管理多个 WhatsApp 账号
4. **高级选项**：自动消息确认、已读回执、消息限制
5. **故障排除**：检查 Gateway 状态、日志和运行时

## 下一课预告

> 下一课我们学习 **[Telegram 渠道](../telegram/)** 配置。
>
> 你会学到：
> - 使用 Bot Token 配置 Telegram Bot
> - 设置命令和内联查询
> - 管理 Telegram 特定的安全策略

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| WhatsApp 配置类型定义 | [`src/config/types.whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.whatsapp.ts) | 1-160 |
| WhatsApp 配置 Schema | [`src/config/zod-schema.providers-whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-whatsapp.ts) | 13-100 |
| WhatsApp 引导配置 | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 1-341 |
| WhatsApp 文档 | [`docs/channels/whatsapp.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/whatsapp.md) | 1-363 |
| WhatsApp 登录工具 | [`src/channels/plugins/agent-tools/whatsapp-login.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/agent-tools/whatsapp-login.ts) | 1-72 |
| WhatsApp Actions 工具 | [`src/agents/tools/whatsapp-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/whatsapp-actions.ts) | 1-42 |

**关键配置项**：
- `dmPolicy`: DM 访问策略（`pairing`/`allowlist`/`open`/`disabled`）
- `allowFrom`: 允许的发送者列表（E.164 格式电话号码）
- `ackReaction`: 自动消息确认配置（`{emoji, direct, group}`）
- `sendReadReceipts`: 是否发送已读回执（默认 `true`）
- `textChunkLimit`: 文本分块限制（默认 4000 字符）
- `mediaMaxMb`: 媒体文件大小限制（默认 50 MB）

**关键函数**：
- `loginWeb()`: 执行 WhatsApp QR 码登录
- `startWebLoginWithQr()`: 启动 QR 码生成流程
- `sendReactionWhatsApp()`: 发送 WhatsApp 表情反应
- `handleWhatsAppAction()`: 处理 WhatsApp 特定操作（如反应）

**关键常量**：
- `DEFAULT_ACCOUNT_ID`: 默认账户 ID（`"default"`）
- `creds.json`: WhatsApp 认证凭据存储路径

</details>
