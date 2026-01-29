---
title: "发送第一条消息：通过 WebChat 或渠道与 AI 对话 | Clawdbot 教程"
sidebarTitle: "和 AI 说上话了"
subtitle: "发送第一条消息：通过 WebChat 或渠道与 AI 对话"
description: "学习如何通过 WebChat 界面或已配置渠道（WhatsApp/Telegram/Slack/Discord 等）发送第一条消息给 Clawdbot AI 助手。本教程介绍 CLI 命令、WebChat 访问和渠道消息发送的三种方式，包含预期结果和常见问题排查。"
tags:
  - "入门"
  - "WebChat"
  - "渠道"
  - "消息"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 40
---

# 发送第一条消息：通过 WebChat 或渠道与 AI 对话

## 学完你能做什么

完成本教程后，你将能够：

- ✅ 通过 CLI 与 AI 助手对话
- ✅ 使用 WebChat 界面发送消息
- ✅ 在已配置的渠道（WhatsApp、Telegram、Slack 等）中与 AI 对话
- ✅ 理解消息发送的预期结果和状态码

## 你现在的困境

你可能刚完成了 Clawdbot 的安装和 Gateway 启动，但不知道如何验证一切是否正常工作。

你可能想知道：

- "Gateway 启动了，怎么确认它能响应消息？"
- "除了命令行，有没有图形界面可以用？"
- "我配置了 WhatsApp/Telegram，怎么在那些平台上和 AI 对话？"

好消息是：**Clawdbot 提供了多种方式发送第一条消息**，总有一种适合你。

## 什么时候用这一招

当你需要：

- 🧪 **验证安装**：确认 Gateway 和 AI 助手正常工作
- 🌐 **测试渠道**：检查 WhatsApp/Telegram/Slack 等渠道连接是否正常
- 💬 **快速对话**：无需打开渠道 APP，直接通过 CLI 或 WebChat 与 AI 交流
- 🔄 **交付回复**：将 AI 的回复发送回特定渠道或联系人

---

## 🎒 开始前的准备

在发送第一条消息之前，请确认：

### 必需条件

| 条件                     | 如何检查                                        |
| ---------------------- | ------------------------------------------- |
| **Gateway 已启动**   | `clawdbot gateway status` 或查看进程是否在运行 |
| **AI 模型已配置** | `clawdbot models list` 查看是否有可用模型      |
| **端口可访问**       | 确认 18789 端口（或自定义端口）未被占用 |

::: warning 前置课程
本教程假设你已经完成了：
- [快速开始](../getting-started/) - 安装、配置和启动 Clawdbot
- [启动 Gateway](../gateway-startup/) - 了解 Gateway 的不同启动模式

如果还没完成，请先返回这些课程。
:::

### 可选：配置渠道

如果你想通过 WhatsApp/Telegram/Slack 等渠道发送消息，需要先配置渠道。

快速检查：

```bash
## 查看已配置的渠道
clawdbot channels list
```

如果返回空列表或缺少你想用的渠道，参考对应渠道的配置教程（在 `platforms/` 章节）。

---

## 核心思路

Clawdbot 支持三种主要方式发送消息：

```
┌─────────────────────────────────────────────────────────────┐
│              Clawdbot 消息发送方式                    │
├─────────────────────────────────────────────────────────────┤
│                                                         │
│  方式 1：CLI Agent 对话                                   │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → AI → 返回结果              │
│  │ agent        │                                       │
│  │ --message    │                                       │
│  └─────────────┘                                       │
│                                                         │
│  方式 2：CLI 直接发送消息到渠道                          │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → 渠道 → 发送消息              │
│  │ message send │                                       │
│  │ --target     │                                       │
│  └─────────────┘                                       │
│                                                         │
│  方式 3：WebChat / 已配置渠道                              │
│  ┌─────────────┐               ┌──────────────┐   │
│  │ WebChat     │   或         │ WhatsApp    │   │
│  │ 浏览器界面   │              │ Telegram    │ → Gateway → AI → 渠道回复 │
│  └─────────────┘               │ Slack       │   │
│                                 │ Discord     │   │
│                                 └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**关键区别**：

| 方式                     | 是否经过 AI | 用途                           |
| ---------------------- | ----------- | ------------------------------ |
| `clawdbot agent`     | ✅ 是       | 与 AI 对话，获取回复和思考过程    |
| `clawdbot message send` | ❌ 否       | 直接发送消息到渠道，不经过 AI    |
| WebChat / 渠道       | ✅ 是       | 通过图形界面与 AI 对话         |

::: info 选择合适的方式
- **验证安装**：用 `clawdbot agent` 或 WebChat
- **测试渠道**：用 WhatsApp/Telegram 等渠道 APP
- **批量发送**：用 `clawdbot message send`（不经过 AI）
:::

---

## 跟我做

### 第 1 步：通过 CLI 与 AI 对话

**为什么**
CLI 是最快的验证方式，不需要打开浏览器或渠道 APP。

#### 基本对话

```bash
## 发送简单消息给 AI 助手
clawdbot agent --message "Hello, I'm testing Clawdbot!"
```

**你应该看到**：
```
[clawdbot] Thinking...
[clawdbot] Hello! I'm your AI assistant powered by Clawdbot. How can I help you today?
```

#### 使用思考级别

Clawdbot 支持不同的思考级别，控制 AI 的"透明度"：

```bash
## 高思考级别（显示完整推理过程）
clawdbot agent --message "Ship checklist" --thinking high

## 关闭思考（只看最终答案）
clawdbot agent --message "What's 2+2?" --thinking off
```

**你应该看到**（高思考级别）：
```
[clawdbot] I'll create a comprehensive ship checklist for you.

[THINKING]
Let me think about what needs to be checked for shipping:

1. Code readiness
   - All tests passing?
   - Code review completed?
   - Documentation updated?

2. Build configuration
   - Environment variables set correctly?
   - Build artifacts generated?

[THINKING END]

[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

**思考级别选项**：

| 级别        | 说明                           | 适用场景             |
| --------- | ------------------------------ | ------------------ |
| `off`     | 不显示思考过程               | 简单问答、快速响应 |
| `minimal` | 最小化思考输出              | 调试、检查流程     |
| `low`     | 低详细度                     | 日常对话           |
| `medium`   | 中等详细度                   | 复杂任务           |
| `high`     | 高详细度（包含完整推理过程） | 学习、代码生成     |

#### 指定接收渠道

你可以让 AI 将回复发送到特定渠道（而不是默认渠道）：

```bash
## 让 AI 回复发送到 Telegram
clawdbot agent --message "Send me a weather update" --deliver --reply-channel telegram
```

::: tip 常用参数
- `--to <号码>`：指定接收者的 E.164 号码（用于创建特定会话）
- `--agent <id>`：使用特定的 Agent ID（而不是默认 main）
- `--session-id <id>`：继续已有会话，而不是创建新会话
- `--verbose on`：启用详细日志输出
- `--json`：输出 JSON 格式（适合脚本解析）
:::

---

### 第 2 步：通过 WebChat 界面发送消息

**为什么**
WebChat 提供了浏览器内的图形界面，更直观，支持富文本和附件。

#### 访问 WebChat

WebChat 使用 Gateway 的 WebSocket 服务，**不需要单独配置或额外端口**。

**访问方式**：

1. **打开浏览器，访问**：`http://localhost:18789`
2. **或在终端运行**：`clawdbot dashboard`（自动打开浏览器）

::: info WebChat 端口
WebChat 使用与 Gateway 相同的端口（默认 18789）。如果你修改了 Gateway 端口，WebChat 也会使用相同的端口。
:::

**你应该看到**：
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│  ┌───────────────────────────────────┐   │
│  │  你好！我是你的 AI 助手。       │   │
│  │  有什么我可以帮你的吗？        │   │
│  └───────────────────────────────────┘   │
│  [输入框...                       │   │
│  [发送]                            │   │
└─────────────────────────────────────────────┘
```

#### 发送消息

1. 在输入框中输入你的消息
2. 点击"发送"或按 `Enter`
3. 等待 AI 响应

**你应该看到**：
- AI 的回复显示在聊天界面
- 如果启用了思考级别，会显示 `[THINKING]` 标记

**WebChat 功能**：

| 功能     | 说明                           |
| ------ | ------------------------------ |
| 富文本   | 支持 Markdown 格式            |
| 附件     | 支持图片、音频、视频上传    |
| 历史记录 | 自动保存会话历史             |
| 会话切换 | 左侧面板切换不同会话         |

::: tip macOS 菜单栏应用
如果你安装了 Clawdbot macOS 应用，也可以从菜单栏的"Open WebChat"按钮直接打开 WebChat。
:::

---

### 第 3 步：通过已配置渠道发送消息

**为什么**
验证渠道（WhatsApp、Telegram、Slack 等）的连接是否正常，并体验真实的跨平台对话。

#### WhatsApp 示例

如果你在 onboarding 或配置中设置了 WhatsApp：

1. **打开 WhatsApp APP**（手机或桌面版）
2. **搜索你的 Clawdbot 号码**（或已保存的联系人）
3. **发送消息**：`Hello from WhatsApp!`

**你应该看到**：
```
[WhatsApp]
你 → Clawdbot: Hello from WhatsApp!

Clawdbot → 你: Hello! I received your message via WhatsApp.
How can I help you today?
```

#### Telegram 示例

如果你配置了 Telegram Bot：

1. **打开 Telegram APP**
2. **搜索你的 Bot**（使用用户名）
3. **发送消息**：`/start` 或 `Hello from Telegram!`

**你应该看到**：
```
[Telegram]
你 → @your_bot: /start

@your_bot → 你: Welcome! I'm Clawdbot's AI assistant.
You can talk to me here, and I'll respond via AI.
```

#### Slack/Discord 示例

对于 Slack 或 Discord：

1. **打开对应 APP**
2. **找到 Bot 所在的频道或服务器**
3. **发送消息**：`Hello from Slack!`

**你应该看到**：
- Bot 回复你的消息
- 消息前可能显示"AI Assistant"标签

::: info DM 配对保护
默认情况下，Clawdbot 启用 **DM 配对保护**：
- 未知发送者会收到一个配对代码
- 消息不会被处理，直到你批准配对

如果你是第一次从渠道发送消息，可能需要：
```bash
## 查看待批准的配对请求
clawdbot pairing list

## 批准配对请求（替换 <channel> 和 <code> 为实际值）
clawdbot pairing approve <channel> <code>
```

详细说明：[DM 配对与访问控制](../pairing-approval/)
:::

---

### 第 4 步（可选）：直接发送消息到渠道

**为什么**
不经过 AI，直接发送消息到渠道。适合批量通知、推送消息等场景。

#### 发送文本消息

```bash
## 发送文本消息到 WhatsApp
clawdbot message send --target +15555550123 --message "Hello from CLI!"
```

#### 发送带附件的消息

```bash
## 发送图片
clawdbot message send --target +15555550123 \
  --message "Check out this photo" \
  --media ~/Desktop/photo.jpg

## 发送 URL 图片
clawdbot message send --target +15555550123 \
  --message "Here's a link" \
  --media https://example.com/image.png
```

**你应该看到**：
```
[clawdbot] Message sent successfully
[clawdbot] Message ID: 3EB0A1234567890
```

::: tip message send 常用参数
- `--channel`：指定渠道（默认：whatsapp）
- `--reply-to <id>`：回复指定消息
- `--thread-id <id>`：Telegram 主题 ID
- `--buttons <json>`：Telegram 内联按钮（JSON 格式）
- `--card <json>`：Adaptive Card（支持的渠道）
:::

---

## 检查点 ✅

完成上述步骤后，你应该能够：

- [ ] 通过 CLI 发送消息并收到 AI 回复
- [ ] 在 WebChat 界面发送消息并看到响应
- [ ] （可选）在已配置的渠道发送消息并收到 AI 回复
- [ ] （可选）使用 `clawdbot message send` 直接发送消息到渠道

::: tip 常见问题

**Q: AI 不回复我的消息？**

A: 检查以下几点：
1. Gateway 是否在运行：`clawdbot gateway status`
2. AI 模型是否配置：`clawdbot models list`
3. 查看详细日志：`clawdbot agent --message "test" --verbose on`

**Q: WebChat 无法打开？**

A: 检查：
1. Gateway 是否在运行
2. 端口是否正确：默认 18789
3. 浏览器是否访问 `http://127.0.0.1:18789`（而不是 `localhost`）

**Q: 渠道消息发送失败？**

A: 检查：
1. 渠道是否已登录：`clawdbot channels status`
2. 网络连接是否正常
3. 查看渠道特定的错误日志：`clawdbot gateway --verbose`
:::

---

## 踩坑提醒

### ❌ Gateway 未启动

**错误做法**：
```bash
clawdbot agent --message "Hello"
## 报错：Gateway connection failed
```

**正确做法**：
```bash
## 先启动 Gateway
clawdbot gateway --port 18789

## 再发送消息
clawdbot agent --message "Hello"
```

::: warning Gateway 必须先启动
所有消息发送方式（CLI、WebChat、渠道）都依赖 Gateway 的 WebSocket 服务。确保 Gateway 在运行是第一步。
:::

### ❌ 渠道未登录

**错误做法**：
```bash
## WhatsApp 未登录就发送消息
clawdbot message send --target +15555550123 --message "Hi"
## 报错：WhatsApp not authenticated
```

**正确做法**：
```bash
## 先登录渠道
clawdbot channels login whatsapp

## 确认状态
clawdbot channels status

## 再发送消息
clawdbot message send --target +15555550123 --message "Hi"
```

### ❌ 忘记 DM 配对

**错误做法**：
```bash
## 第一次从 Telegram 发送消息，但未批准配对
## 结果：Bot 收到消息但不处理
```

**正确做法**：
```bash
## 1. 查看待批准的配对请求
clawdbot pairing list

## 2. 批准配对
clawdbot pairing approve telegram ABC123
## 3. 再次发送消息

### 现在消息会被处理并得到 AI 回复
```

### ❌ 混淆 agent 和 message send

**错误做法**：
```bash
## 想与 AI 对话，但用了 message send
clawdbot message send --target +15555550123 --message "Help me write code"
## 结果：消息直接发送到渠道，AI 不会处理
```

**正确做法**：
```bash
## 与 AI 对话：使用 agent
clawdbot agent --message "Help me write code" --to +15555550123

## 直接发送消息：使用 message send（不经过 AI）
clawdbot message send --target +15555550123 --message "Meeting at 3pm"
```

---

## 本课小结

本课你学会了：

1. ✅ **CLI Agent 对话**：`clawdbot agent --message` 与 AI 交流，支持思考级别控制
2. ✅ **WebChat 界面**：访问 `http://localhost:18789` 使用图形界面发送消息
3. ✅ **渠道消息**：在 WhatsApp、Telegram、Slack 等已配置渠道中与 AI 对话
4. ✅ **直接发送**：`clawdbot message send` 绕过 AI 直接发送消息到渠道
5. ✅ **问题排查**：了解常见失败原因和解决方案

**下一步**：

- 学习 [DM 配对与访问控制](../pairing-approval/)，了解如何安全地管理陌生发送者
- 探索 [多渠道系统概览](../../platforms/channels-overview/)，了解所有支持的渠道及其配置
- 配置更多渠道（WhatsApp、Telegram、Slack、Discord 等）来体验跨平台 AI 助手

---

## 下一课预告

> 下一课我们学习 **[DM 配对与访问控制](../pairing-approval/)**。
>
> 你会学到：
> - 理解默认的 DM 配对保护机制
> - 如何批准陌生发送者的配对请求
> - 配置 allowlist 和安全策略

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能                  | 文件路径                                                                                             | 行号    |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| CLI Agent 命令注册  | [`src/cli/program/register.agent.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.agent.ts) | 20-82    |
| Agent CLI 执行        | [`src/commands/agent-via-gateway.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/agent-via-gateway.ts) | 82-184   |
| CLI message send 注册 | [`src/cli/program/message/register.send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/message/register.send.ts) | 1-30     |
| Gateway chat.send 方法 | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380   |
| WebChat 内部消息处理 | [`src/gateway/server-chat.gateway-server-chat.e2e.test.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-chat.gateway-server-chat.e2e.test.ts) | 50-290    |
| 消息渠道类型定义   | [`src/gateway/protocol/client-info.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/client-info.ts) | 2-23     |
| 渠道注册表         | [`src/channels/registry.js`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.js) | 全文件   |

**关键常量**：
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`：默认消息渠道（来自 `src/channels/registry.js`）
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`：WebChat 内部消息渠道（来自 `src/utils/message-channel.ts`）

**关键函数**：
- `agentViaGatewayCommand()`：通过 Gateway WebSocket 调用 agent 方法（`src/commands/agent-via-gateway.ts`）
- `agentCliCommand()`：CLI agent 命令入口，支持本地和 Gateway 模式（`src/commands/agent-via-gateway.ts`）
- `registerMessageSendCommand()`：注册 `message send` 命令（`src/cli/program/message/register.send.ts`）
- `chat.send`：Gateway WebSocket 方法，处理消息发送请求（`src/gateway/server-methods/chat.ts`）

</details>
