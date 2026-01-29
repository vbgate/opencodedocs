---
title: "快速开始：安装并启动 Clawdbot | 教程"
sidebarTitle: "5 分钟跑起来"
subtitle: "快速开始：安装、配置和启动 Clawdbot"
description: "学习如何安装 Clawdbot，配置 AI 模型，启动 Gateway，并通过 WhatsApp/Telegram/Slack 等渠道发送第一条消息。"
tags:
  - "入门"
  - "安装"
  - "配置"
  - "Gateway"
prerequisite: []
order: 10
---

# 快速开始：安装、配置和启动 Clawdbot

## 学完你能做什么

完成本教程后，你将能够：

- ✅ 在你的设备上安装 Clawdbot
- ✅ 配置 AI 模型认证（Anthropic / OpenAI / 其他提供商）
- ✅ 启动 Gateway 守护进程
- ✅ 通过 WebChat 或配置的渠道发送第一条消息

## 你现在的困境

你可能正在想：

- "本地 AI 助手听起来很复杂，从哪里开始？"
- "我有很多设备（手机、电脑），怎么统一管理？"
- "我熟悉 WhatsApp/Telegram/Slack，能不能用这些和 AI 对话？"

好消息是：**Clawdbot 就是为了解决这些问题而设计的**。

## 什么时候用这一招

当你需要：

- 🚀 **首次设置**个人 AI 助手
- 🔧 **配置多渠道**（WhatsApp、Telegram、Slack、Discord 等）
- 🤖 **连接 AI 模型**（Anthropic Claude、OpenAI GPT 等）
- 📱 **跨设备协同**（macOS、iOS、Android 节点）

::: tip 为什么推荐 Gateway 模式？
Gateway 是 Clawdbot 的控制平面，它：
- 统一管理所有会话、渠道、工具和事件
- 支持多客户端并发连接
- 允许设备节点执行本地操作
:::

## 🎒 开始前的准备

### 系统要求

| 组件         | 要求                |
|--- | ---|
| **Node.js** | ≥ 22.12.0           |
| **操作系统** | macOS / Linux / Windows (WSL2) |
| **包管理器** | npm / pnpm / bun |

::: warning Windows 用户请注意
Windows 上强烈推荐使用 **WSL2**，因为：
- 许多渠道依赖本地二进制文件
- 守护进程（launchd/systemd）在 Windows 上不可用
:::

### 推荐的 AI 模型

虽然任何模型都支持，但我们强烈推荐：

| 提供商     | 推荐模型         | 理由                           |
|--- | --- | ---|
| Anthropic  | Claude Opus 4.5  | 长上下文优势、更强的提示注入抵抗力 |
| OpenAI     | GPT-5.2 + Codex | 编程能力强、多模态支持         |

---

## 核心思路

Clawdbot 的架构很简单：**一个 Gateway，多个渠道，一个 AI 助手**。

```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat
                │
                ▼
        ┌──────────────────┐
        │   Gateway       │  ← 控制平面（守护进程）
        │   127.0.0.1:18789 │
        └────────┬─────────┘
                 │
                 ├─→ AI Agent (pi-mono RPC)
                 ├─→ CLI (clawdbot ...)
                 ├─→ WebChat UI
                 └─→ macOS / iOS / Android 节点
```

**关键概念**：

| 概念     | 作用                    |
|--- | ---|
| **Gateway** | 守护进程，负责会话管理、渠道连接、工具调用 |
| **Channel** | 消息渠道（WhatsApp、Telegram、Slack 等） |
| **Agent** | AI 运行时（基于 pi-mono 的 RPC 模式） |
| **Node** | 设备节点（macOS/iOS/Android），执行设备本地操作 |

---

## 跟我做

### 第 1 步：安装 Clawdbot

**为什么**
全局安装后，`clawdbot` 命令可以在任何地方使用。

#### 方式 A：使用 npm（推荐）

```bash
npm install -g clawdbot@latest
```

#### 方式 B：使用 pnpm

```bash
pnpm add -g clawdbot@latest
```

#### 方式 C：使用 bun

```bash
bun install -g clawdbot@latest
```

**你应该看到**：
```
added 1 package, and audited 1 package in 3s
```

::: tip 开发者选项
如果你打算从源码开发或贡献，请跳到 [附录：从源码构建](#从源码构建)。
:::

---

### 第 2 步：运行 onboarding 向导

**为什么**
向导会引导你完成所有必要的配置：Gateway、渠道、技能。

#### 启动向导（推荐）

```bash
clawdbot onboard --install-daemon
```

**向导会问你什么**：

| 步骤        | 问题                              | 说明               |
|--- | --- | ---|
| 1         | 选择 AI 模型认证方式              | OAuth / API Key     |
| 2         | 配置 Gateway（端口、认证）           | 默认：127.0.0.1:18789 |
| 3         | 配置渠道（WhatsApp、Telegram 等） | 可跳过，稍后配置 |
| 4         | 配置技能（可选）                  | 可跳过           |

**你应该看到**：
```
✓ Gateway configured
✓ Workspace initialized: ~/clawd
✓ Channels configured
✓ Skills installed

To start the gateway, run:
  clawdbot gateway
```

::: info 什么是 Daemon？
`--install-daemon` 会安装 Gateway 守护进程：
- **macOS**: launchd 服务（用户级别）
- **Linux**: systemd 用户服务

这样 Gateway 会在后台自动运行，无需手动启动。
:::

---

### 第 3 步：启动 Gateway

**为什么**
Gateway 是 Clawdbot 的控制平面，必须先启动它。

#### 前台启动（调试用）

```bash
clawdbot gateway --port 18789 --verbose
```

**你应该看到**：
```
[clawdbot] Gateway started
[clawdbot] Listening on ws://127.0.0.1:18789
[clawdbot] Ready to accept connections
```

#### 后台启动（推荐）

如果你在向导中使用了 `--install-daemon`，Gateway 会自动启动。

检查状态：

```bash
clawdbot gateway status
```

**你应该看到**：
```
Gateway is running
PID: 12345
Port: 18789
```

::: tip 常用选项
- `--port 18789`：指定 Gateway 端口（默认 18789）
- `--verbose`：启用详细日志（调试时有用）
- `--reset`：重启 Gateway（清除会话）
:::

---

### 第 4 步：发送第一条消息

**为什么**
验证安装是否成功，体验 AI 助手的响应。

#### 方式 A：使用 CLI 直接对话

```bash
clawdbot agent --message "Ship checklist" --thinking high
```

**你应该看到**：
```
[clawdbot] Agent is thinking...
[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

#### 方式 B：通过渠道发送消息

如果你在向导中配置了渠道（如 WhatsApp、Telegram），可以在对应的 APP 中直接发送消息给你的 AI 助手。

**WhatsApp 示例**：

1. 打开 WhatsApp
2. 搜索你的 Clawdbot 号码
3. 发送消息：`Hello, I'm testing Clawdbot!`

**你应该看到**：
- AI 助手回复你的消息

::: info DM 配对保护
默认情况下，Clawdbot 启用 **DM 配对保护**：
- 未知发送者会收到一个配对代码
- 消息不会被处理，直到你批准配对

更多详情：[DM 配对与访问控制](../pairing-approval/)
:::

---

## 检查点 ✅

完成上述步骤后，你应该能够：

- [ ] 运行 `clawdbot --version` 看到版本号
- [ ] 运行 `clawdbot gateway status` 看到 Gateway 在运行
- [ ] 通过 CLI 发送消息并收到 AI 回复
- [ ] （可选）在配置的渠道中发送消息并收到 AI 回复

::: tip 常见问题
**Q: Gateway 启动失败？**
A: 检查端口是否被占用：
```bash
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows
```

**Q: AI 不回复？**
A: 检查 API Key 是否正确配置：
```bash
clawdbot models list
```

**Q: 如何查看详细日志？**
A: 启动时添加 `--verbose`：
```bash
clawdbot gateway --verbose
```
:::

---

## 踩坑提醒

### ❌ 忘记安装 Daemon

**错误做法**：
```bash
clawdbot onboard  # 忘记 --install-daemon
```

**正确做法**：
```bash
clawdbot onboard --install-daemon
```

::: warning 前台 vs 后台
- 前台：适合调试，关闭终端会停止 Gateway
- 后台：适合生产环境，会自动重启
:::

### ❌ Node.js 版本过低

**错误做法**：
```bash
node --version
# v20.x.x  # 太旧
```

**正确做法**：
```bash
node --version
# v22.12.0 或更高
```

### ❌ 配置文件路径错误

Clawdbot 默认配置文件位置：

| 操作系统   | 配置路径                    |
|--- | ---|
| macOS/Linux | `~/.clawdbot/clawdbot.json` |
| Windows (WSL2) | `~/.clawdbot/clawdbot.json` |

如果你手动编辑配置文件，确保路径正确。

---

## 本课小结

本课你学会了：

1. ✅ **安装 Clawdbot**：使用 npm/pnpm/bun 全局安装
2. ✅ **运行向导**：`clawdbot onboard --install-daemon` 完成配置
3. ✅ **启动 Gateway**：`clawdbot gateway` 或守护进程自动启动
4. ✅ **发送消息**：通过 CLI 或配置的渠道与 AI 对话

**下一步**：

- 学习 [向导式配置](../onboarding-wizard/)，了解更多向导的各个选项
- 了解 [启动 Gateway](../gateway-startup/)，学习不同的启动模式（dev/production）
- 学习 [发送第一条消息](../first-message/)，探索更多消息格式和交互方式

---

## 下一课预告

> 下一课我们学习 **[向导式配置](../onboarding-wizard/)**。
>
> 你会学到：
> - 如何使用交互式向导配置 Gateway
> - 如何配置多渠道（WhatsApp、Telegram、Slack 等）
> - 如何管理技能和 AI 模型认证

---

## 附录：从源码构建

如果你打算从源码开发或贡献，可以：

### 1. 克隆仓库

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 构建 UI（首次运行）

```bash
pnpm ui:build  # 自动安装 UI 依赖
```

### 4. 构建 TypeScript

```bash
pnpm build
```

### 5. 运行 onboarding

```bash
pnpm clawdbot onboard --install-daemon
```

### 6. 开发循环（自动重载）

```bash
pnpm gateway:watch  # TS 文件改动时自动重载
```

::: info 开发模式 vs 生产模式
- `pnpm clawdbot ...`：直接运行 TypeScript（开发模式）
- `pnpm build` 后：生成 `dist/` 目录（生产模式）
:::

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能            | 文件路径                                                                                     | 行号    |
|--- | --- | ---|
| CLI 入口         | [`src/cli/run-main.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/run-main.ts) | 26-60   |
| Onboarding 命令 | [`src/cli/program/register.onboard.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.onboard.ts) | 34-100  |
| Daemon 安装     | [`src/cli/daemon-cli/install.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/daemon-cli/install.ts) | 15-100  |
| Gateway 服务     | [`src/daemon/service.ts`](https://github.com/moltbot/moltbot/blob/main/src/daemon/service.ts) | 全文件  |
| 运行时检查       | [`src/infra/runtime-guard.ts`](https://github.com/moltbot/moltbot/blob/main/src/infra/runtime-guard.ts) | 全文件  |

**关键常量**：
- `DEFAULT_GATEWAY_DAEMON_RUNTIME = "node"`：默认守护进程运行时（来自 `src/commands/daemon-runtime.ts`）
- `DEFAULT_GATEWAY_PORT = 18789`：默认 Gateway 端口（来自配置）

**关键函数**：
- `runCli()`：CLI 主入口，处理参数解析和命令路由（`src/cli/run-main.ts`）
- `runDaemonInstall()`：安装 Gateway 守护进程（`src/cli/daemon-cli/install.ts`）
- `onboardCommand()`：交互式向导命令（`src/commands/onboard.ts`）

</details>
