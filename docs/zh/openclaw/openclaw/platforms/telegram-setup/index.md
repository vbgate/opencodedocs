---
title: "Telegram 集成 - 配置 Bot 和群组支持 | OpenClaw 教程"
sidebarTitle: "Telegram 集成"
subtitle: "Telegram 集成 - 配置 Bot 和群组支持"
description: "学习如何创建 Telegram Bot、配置 Bot Token、管理群组权限，实现 Telegram 频道的完整集成。"
tags:
  - "Telegram"
  - "Bot"
  - "群组"
order: 70
---

# Telegram 集成 - 配置 Bot 和群组支持

## 学完你能做什么

完成本课程后，你将能够：
- 创建并配置 Telegram Bot
- 获取和设置 Bot Token
- 管理群组权限和命令
- 处理群组中的提及和回复

## 你现在的困境

想要通过 Telegram 使用 AI 助手，但你可能困惑于：
- 如何创建 Telegram Bot？
- Bot Token 应该保存在哪里？
- 如何让 Bot 在群组中工作？

## 核心思路

OpenClaw 使用 **grammY** 库与 Telegram Bot API 交互。Telegram Bot 是集成最简便的频道之一，无需复杂的配对流程。

```
┌─────────────────────────────────────────────────────────────┐
│                 Telegram Bot 架构                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐      ┌─────────────┐      ┌──────────┐   │
│   │   用户/     │      │  Telegram   │      │ OpenClaw │   │
│   │   群组      │ ←──→ │   服务器    │ ←──→ │  Gateway │   │
│   └─────────────┘      └─────────────┘      └────┬─────┘   │
│                                                  │         │
│                                                  ▼         │
│                                        ┌─────────────────┐ │
│                                        │   grammY 库     │ │
│                                        │   Bot API 客户端│ │
│                                        └─────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Telegram Bot 特点

- **易于创建**：通过 @BotFather 几分钟完成
- **WebHook 支持**：实时接收消息
- **丰富格式**：支持 Markdown、按钮、内联查询
- **群组友好**：支持群组管理和权限控制

## 跟我做

### 第 1 步：创建 Telegram Bot

**为什么**  
需要通过 Telegram 官方的 @BotFather 创建 Bot 获取 Token。

1. 打开 Telegram，搜索 **@BotFather**
2. 发送 `/newbot` 命令
3. 按提示输入：
   - Bot 名称（显示名称，如 "My AI Assistant"）
   - Bot 用户名（唯一标识，如 `my_ai_assistant_bot`，必须以 `bot` 结尾）

**你应该看到**  
@BotFather 回复包含 Bot Token：

```
✅ Done! Congratulations on your new bot.

You will find it at t.me/my_ai_assistant_bot

Use this token to access the HTTP API:
123456789:ABCdefGHIjklMNOpqrsTUVwxyz

Keep your token secure and store it safely.
```

::: warning 安全提醒
**务必保管好 Bot Token！** 任何人获取 Token 都可以控制你的 Bot。
:::

### 第 2 步：配置 Bot Token

**为什么**  
Token 是 Bot 的身份凭证，需要配置到 OpenClaw 中。

```bash
# 设置 Bot Token
openclaw config set channels.telegram.botToken "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"

# 启用 Telegram 频道
openclaw config set channels.telegram.enabled true

# 验证配置
openclaw config get channels.telegram
```

**安全存储建议**  
使用环境变量存储 Token：

```bash
# 设置环境变量
export TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"

# 配置引用环境变量
openclaw config set channels.telegram.botToken "${TELEGRAM_BOT_TOKEN}"
```

### 第 3 步：配置 WebHook（推荐）

**为什么**  
WebHook 比轮询更高效，能实时接收消息。

```bash
# 配置 WebHook URL（需要公网可访问地址）
openclaw config set channels.telegram.webhookUrl "https://your-domain.com/webhook/telegram"

# 如果使用本地开发，可以先使用轮询模式
openclaw config set channels.telegram.usePolling true
```

**部署方式对比**

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| WebHook | 实时、高效、低延迟 | 需要公网地址 | 生产环境 |
| 轮询 | 简单易用、无需公网 | 有延迟、资源消耗高 | 本地开发 |

### 第 4 步：配置 Bot 命令

**为什么**  
设置命令菜单让用户知道可用的交互方式。

1. 向 @BotFather 发送 `/setcommands`
2. 选择你的 Bot
3. 发送命令列表：

```
start - 开始使用 AI 助手
help - 获取帮助信息
reset - 重置当前对话
status - 查看系统状态
```

### 第 5 步：配置群组支持

**为什么**  
让 Bot 能够在群组中响应消息。

**添加到群组**：
1. 在 Telegram 中打开目标群组
2. 点击群组名称 → **添加成员**
3. 搜索你的 Bot 用户名（如 `@my_ai_assistant_bot`）
4. 确认添加

**配置群组权限**：

```bash
# 设置群组策略
openclaw config set channels.telegram.groupPolicy "admins"

# 配置提及触发
openclaw config set channels.telegram.triggerOnMention true

# 配置回复触发
openclaw config set channels.telegram.triggerOnReply true
```

**群组策略选项**

| 策略 | 说明 |
|------|------|
| `owner-only` | 仅群组所有者可触发 |
| `admins` | 管理员和所有者可触发 |
| `everyone` | 所有成员可触发 |
| `none` | 群组中禁用 |

### 第 6 步：配置隐私模式

**为什么**  
Telegram Bot 有隐私模式，影响 Bot 能接收哪些消息。

在 @BotFather 中设置：
1. 发送 `/mybots`
2. 选择你的 Bot
3. 点击 **Bot Settings** → **Group Privacy**
4. 选择 **Turn off**（关闭隐私模式）

::: info 隐私模式说明
- **开启**：Bot 只能接收直接发送给它的消息（@提及或回复）
- **关闭**：Bot 可以接收群组中的所有消息
:::

### 第 7 步：测试 Bot

**为什么**  
验证配置正确，Bot 能正常工作。

**私聊测试**：
1. 找到你的 Bot（如 `@my_ai_assistant_bot`）
2. 发送 `/start`
3. 发送测试消息："你好"

**群组测试**：
1. 在群组中 @提及 Bot："@my_ai_assistant_bot 你好"
2. 或回复 Bot 的消息

**你应该看到**  
Bot 回复 AI 生成的响应。

## 检查点 ✅

验证 Telegram 配置：

```bash
# 检查 Telegram 频道状态
openclaw channels status telegram

# 预期输出
┌─────────────────────────────────────┐
│  Telegram Status                    │
├─────────────────────────────────────┤
│  Status:     ✅ Connected            │
│  Bot:        @my_ai_assistant_bot   │
│  Mode:       WebHook                 │
│  Webhook:    ✅ Active               │
└─────────────────────────────────────┘
```

测试 Bot 信息：

```bash
# 获取 Bot 信息
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe
```

## 踩坑提醒

::: warning 常见问题
1. **Token 错误**  
   症状：`404 Not Found` 或 `Unauthorized`  
   解决：检查 Token 是否正确，是否有多余空格

2. **WebHook 设置失败**  
   症状：`WebHook was not set`  
   解决：确保 WebHook URL 可公网访问，使用 HTTPS

3. **Bot 不响应群组消息**  
   症状：群组中无响应  
   解决：检查隐私模式是否关闭，确认 Bot 已添加到群组

4. **命令不显示**  
   症状：命令菜单为空  
   解决：重新向 @BotFather 发送 `/setcommands`

5. **权限不足**  
   症状：`Bot is not a member`  
   解决：确保 Bot 已添加到群组，且有发送消息权限
:::

## 高级配置

### 配置消息格式

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "parseMode": "MarkdownV2",
      "disableWebPagePreview": false,
      "allowFrom": ["@username1", "@username2"],
      "groupPolicy": "admins",
      "dmPolicy": "allow"
    }
  }
}
```

### 配置内联查询

```bash
# 启用内联模式（在 @BotFather 中设置）
# 发送 /setinline 给 @BotFather

# 配置内联查询处理
openclaw config set channels.telegram.inlineQueries.enabled true
```

## 本课小结

在本课程中，你学习了：

- ✅ 通过 @BotFather 创建 Telegram Bot
- ✅ 配置 Bot Token 到 OpenClaw
- ✅ 设置 WebHook 或轮询模式
- ✅ 配置 Bot 命令菜单
- ✅ 添加 Bot 到群组并配置权限
- ✅ 处理隐私模式设置
- ✅ 测试 Bot 私聊和群组功能

## 下一课预告

> 下一课我们学习 **[Slack 与 Discord 集成](../slack-discord-setup/)**。
>
> 你会学到：
> - Slack Bolt 框架配置
> - Discord.js 机器人设置
> - OAuth 流程和权限管理

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Telegram 实现 | [`src/telegram/`](https://github.com/openclaw/openclaw/blob/main/src/telegram/) | - |
| Telegram 配置类型 | [`src/config/types.telegram.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.telegram.ts) | - |
| 消息出站处理 | [`src/channels/plugins/outbound/telegram.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/outbound/telegram.ts) | - |
| 消息动作处理 | [`src/channels/plugins/actions/telegram.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/actions/telegram.ts) | - |

**grammY 框架特性**：
- TypeScript 原生支持
- 内置 WebHook 和轮询
- 中间件系统
- 会话管理

</details>
