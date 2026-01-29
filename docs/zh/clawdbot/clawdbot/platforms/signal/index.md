---
title: "Signal 渠道配置：基于 signal-cli 的安全 AI 助手集成 | Clawdbot 教程"
sidebarTitle: "连接私密的 Signal AI"
subtitle: "Signal 渠道配置：基于 signal-cli 的安全 AI 助手集成 | Clawdbot 教程"
description: "学习如何在 Clawdbot 中配置 Signal 渠道，包括 signal-cli 安装、账户链接、多账户支持、DM 配对机制、群组消息和访问控制等核心功能。本教程详细讲解从安装到使用的完整流程，帮助你快速搭建基于 Signal 的个人 AI 助手。"
tags:
  - "Signal"
  - "signal-cli"
  - "渠道配置"
  - "消息平台"
prerequisite:
  - "start-getting-started"
order: 120
---

# Signal 渠道配置：使用 signal-cli 连接个人 AI 助手 | Clawdbot 教程

## 学完你能做什么

完成本课后，你将能够：

- ✅ 安装并配置 signal-cli
- ✅ 在 Clawdbot 中设置 Signal 渠道
- ✅ 通过私聊和群组与 AI 助手交互
- ✅ 使用 DM 配对机制保护你的账户
- ✅ 配置多账户 Signal 支持
- ✅ 使用 Signal 的打字指示器、已读回执和 Reactions

## 你现在的困境

你想在 Signal 上使用 AI 助手，但遇到了这些问题：

- ❌ 不知道如何连接 Signal 和 Clawdbot
- ❌ 担心隐私问题，不想将数据上传到云端
- ❌ 不确定如何控制谁能向 AI 助手发送消息
- ❌ 需要在多个 Signal 账户之间切换

::: info 为什么选择 Signal？
Signal 是一个端到端加密的即时通讯应用，所有通信都经过加密，只有发送方和接收方能读取消息。Clawdbot 通过 signal-cli 集成，让你在保持隐私的同时享受 AI 助手的功能。
:::

## 什么时候用这一招

**适合使用 Signal 渠道的场景**：

- 你需要一个隐私优先的通信渠道
- 你的团队或朋友群组使用 Signal
- 你需要在个人设备上运行 AI 助手（本地优先）
- 你需要通过受保护的 DM 配对机制控制访问

::: tip 独立的 Signal 账号
推荐使用一个**独立的 Signal 号码**作为 bot 账户，而不是你的个人号码。这样可以避免消息循环（bot 忽略自己的消息），并保持工作和个人通信分离。
:::

## 开始前的准备

在开始之前，请确认你已经完成了以下步骤：

::: warning 前置条件
- ✅ 已完成 [快速开始](../../start/getting-started/) 教程
- ✅ Clawdbot 已安装并可以正常运行
- ✅ 已配置至少一个 AI 模型提供商（Anthropic、OpenAI、OpenRouter 等）
- ✅ 已安装 Java（signal-cli 需要）
:::

## 核心思路

Clawdbot 的 Signal 集成基于 **signal-cli**，通过以下方式工作：

1. **守护进程模式**：signal-cli 作为后台守护进程运行，提供 HTTP JSON-RPC 接口
2. **事件流（SSE）**：Clawdbot 通过 Server-Sent Events（SSE）接收信号事件
3. **标准化消息**：Signal 消息被转换为统一的内部格式，然后路由到 AI Agent
4. **确定性路由**：所有回复都会发送回原始消息的发送者或群组

**关键设计原则**：

- **本地优先**：signal-cli 在你的设备上运行，所有通信都经过加密
- **多账户支持**：可以配置多个 Signal 账户
- **访问控制**：默认启用 DM 配对机制，陌生人需要批准才能发送消息
- **上下文隔离**：群组消息有独立的会话上下文，不会与私聊混合

## 跟我做

### 第 1 步：安装 signal-cli

**为什么**
signal-cli 是 Signal 的命令行接口，Clawdbot 通过它与 Signal 网络通信。

**安装方法**

::: code-group

```bash [macOS (Homebrew)]
brew install signal-cli
```

```bash [Linux (Ubuntu/Debian)]
# 访问 https://github.com/AsamK/signal-cli/releases 查看最新版本
# 下载最新的 signal-cli 发布包（将 VERSION 替换为实际版本号）
wget https://github.com/AsamK/signal-cli/releases/download/vVERSION/signal-cli-VERSION.tar.gz

# 解压到 /opt 目录
sudo tar -xvf signal-cli-VERSION.tar.gz -C /opt/

# 创建符号链接（可选）
sudo ln -s /opt/signal-cli-VERSION/bin/signal-cli /usr/local/bin/signal-cli
```

```bash [Windows (WSL2)]
# 在 WSL2 中使用 Linux 安装方法
# 注意：Windows 使用 WSL2，signal-cli 安装遵循 Linux 流程
```

:::

**验证安装**

```bash
signal-cli --version
# 应该看到：signal-cli 版本号（如 0.13.x 或更高版本）
```

**你应该看到**：signal-cli 的版本号输出。

::: danger Java 要求
signal-cli 需要 Java 运行时（通常为 Java 11 或更高版本）。请确保已安装并配置好 Java：

```bash
java -version
# 应该看到：openjdk version "11.x.x" 或更高版本
```

**注意**：具体 Java 版本要求请参考 [signal-cli 官方文档](https://github.com/AsamK/signal-cli#readme)。
:::

### 第 2 步：链接 Signal 账户

**为什么**
链接账户后，signal-cli 才能代表你的 Signal 号码发送和接收消息。

**推荐做法**：使用一个独立的 Signal 号码作为 bot 账户。

**链接步骤**

1. **生成链接命令**：

```bash
signal-cli link -n "Clawdbot"
```

`-n "Clawdbot"` 指定设备名称为 "Clawdbot"（你可以自定义）。

2. **扫描 QR 码**：

运行命令后，终端会显示一个 QR 码：

```
tsconfig: 2369:35 - warning - *! is deprecated: Use .nonNull().
  (deprecated-non-null)

To link your device, navigate to
  Signal Settings > Linked Devices > (+) Link New Device
  on your phone and scan the QR code displayed below.

████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
...
```

3. **在 Signal 手机应用中**：

   - 打开 Signal 设置
   - 选择"已关联的设备"（Linked Devices）
   - 点击"(+) 关联新设备"（Link New Device）
   - 扫描终端显示的 QR 码

**你应该看到**：链接成功后，终端会显示类似以下的输出：

```
INFO  Account restored (Number: +15551234567)
INFO  Configuration created at: ~/.local/share/signal-cli/data
```

::: tip 多设备支持
Signal 允许最多关联 4 个设备。Clawdbot 会作为其中一个设备运行。你可以在 Signal 手机应用的"已关联的设备"中查看和管理这些设备。
:::

### 第 3 步：配置 Clawdbot 的 Signal 渠道

**为什么**
配置文件告诉 Clawdbot 如何连接到 signal-cli，以及如何处理来自 Signal 的消息。

**配置方式**

有三种配置方式，选择最适合你的：

#### 方式 1：快速配置（单账户）

这是最简单的方式，适合单账户场景。

编辑 `~/.clawdbot/clawdbot.json`：

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "account": "+15551234567",
      "cliPath": "signal-cli",
      "dmPolicy": "pairing",
      "allowFrom": ["+15557654321"]
    }
  }
}
```

**配置说明**：

| 字段 | 值 | 说明 |
|------|-----|------|
| `enabled` | `true` | 启用 Signal 渠道 |
| `account` | `"+15551234567"` | 你的 Signal 账号（E.164 格式） |
| `cliPath` | `"signal-cli"` | signal-cli 命令路径 |
| `dmPolicy` | `"pairing"` | DM 访问策略（默认配对模式） |
| `allowFrom` | `["+15557654321"]` | 允许发送 DM 的号码白名单 |

#### 方式 2：多账户配置

如果你需要管理多个 Signal 账户，使用 `accounts` 对象：

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "accounts": {
        "work": {
          "account": "+15551234567",
          "name": "Work Bot",
          "httpPort": 8080,
          "dmPolicy": "pairing",
          "allowFrom": ["+15557654321"]
        },
        "personal": {
          "account": "+15559876543",
          "name": "Personal Bot",
          "httpPort": 8081,
          "dmPolicy": "allowlist",
          "allowFrom": ["*"]
        }
      }
    }
  }
}
```

**配置说明**：

- 每个账户有一个唯一的 ID（如 `work`、`personal`）
- 每个账户可以有不同的端口、策略和权限
- `name` 是可选的显示名称，用于 CLI/UI 列表

#### 方式 3：外部守护进程模式

如果你想自己管理 signal-cli（例如在容器中或共享 CPU），禁用自动启动：

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "httpUrl": "http://127.0.0.1:8080",
      "autoStart": false
    }
  }
}
```

**配置说明**：

- `httpUrl`：完整的守护进程 URL（覆盖 `httpHost` 和 `httpPort`）
- `autoStart`：设为 `false` 禁用自动启动 signal-cli
- Clawdbot 会连接到已运行的 signal-cli 守护进程

**你应该看到**：配置文件保存后，没有语法错误。

::: tip 配置验证
Clawdbot 会在启动时验证配置。如果配置有误，会在日志中显示详细的错误信息。
:::

### 第 4 步：启动 Gateway

**为什么**
启动 Gateway 后，Clawdbot 会自动启动 signal-cli 守护进程（除非你禁用了 `autoStart`），并开始监听 Signal 消息。

**启动命令**

```bash
clawdbot gateway start
```

**你应该看到**：类似以下的输出：

```
[INFO] Starting Clawdbot Gateway...
[INFO] Starting signal-cli daemon...
[INFO] signal-cli: INFO  Starting daemon...
[INFO] signal-cli: INFO  Daemon started on http://127.0.0.1:8080
[INFO] Signal channel ready (account: +15551234567)
[INFO] Gateway listening on ws://127.0.0.1:18789
[INFO] Clawdbot Gateway started successfully
```

**检查 Channel 状态**

```bash
clawdbot channels status
```

**你应该看到**：类似以下的输出：

```
Signal Channels:
  ├─ +15551234567 (Work Bot)
  │   ├─ Status: Connected
  │   ├─ Daemon: http://127.0.0.1:8080
  │   └─ Mode: Auto-start
```

### 第 5 步：发送第一条消息

**为什么**
验证配置是否正确，确保 Clawdbot 能接收和处理 Signal 消息。

**发送消息**

1. **从你的 Signal 手机应用**，发送消息给你的 bot 号码：

```
你好，Clawdbot！
```

2. **首次消息处理**：

   如果 `dmPolicy="pairing"`（默认），陌生人会收到配对代码：

   ```
   ❌ 未授权的发送者

   要继续，请使用以下代码批准此配对：

   📝 配对代码：ABC123

   代码将在 1 小时后过期。

   要批准，请运行：
   clawdbot pairing approve signal ABC123
   ```

3. **批准配对**：

   ```bash
   clawdbot pairing list signal
   ```

   列出待批准的配对请求：

   ```
   Pending Pairings (Signal):
     ├─ ABC123
     │   ├─ Sender: +15557654321
     │   ├─ UUID: uuid:123e4567-e89b-12d3-a456-426614174000
     │   └─ Expires: 2026-01-27 12:00:00
   ```

   批准配对：

   ```bash
   clawdbot pairing approve signal ABC123
   ```

4. **发送第二条消息**：

   配对成功后，再次发送消息：

   ```
   你好，Clawdbot！
   ```

**你应该看到**：

- Signal 手机应用收到 AI 的回复：
  ```
  你好！我是 Clawdbot，你的个人 AI 助手。有什么可以帮助你的吗？
  ```

- Gateway 日志显示：
  ```
  [INFO] Received Signal message from +15557654321
  [INFO] Processing message through Agent...
  [INFO] Sending Signal response to +15557654321
  ```

**检查点 ✅**：

- [ ] signal-cli 守护进程运行中
- [ ] Channel 状态显示 "Connected"
- [ ] 发送消息后收到 AI 回复
- [ ] Gateway 日志没有错误信息

::: danger 自己的消息会被忽略
如果你在个人 Signal 号码上运行 bot，bot 会忽略你自己发送的消息（循环保护）。推荐使用独立的 bot 号码。
:::

## 踩坑提醒

### 坑 1：signal-cli 启动失败

**问题**：signal-cli 守护进程无法启动

**可能原因**：

1. Java 未安装或版本过低
2. 端口已被占用
3. signal-cli 路径不正确

**解决方案**：

```bash
# 检查 Java 版本
java -version

# 检查端口占用
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows (PowerShell)

# 检查 signal-cli 路径
which signal-cli
```

### 坑 2：配对代码过期

**问题**：配对代码在 1 小时后过期

**解决方案**：

重新发送消息，获取新的配对代码，并在 1 小时内批准。

### 坑 3：群组消息不响应

**问题**：在 Signal 群组中 @ 提及 bot，但没有响应

**可能原因**：

- `groupPolicy` 设置为 `allowlist`，但你不在 `groupAllowFrom` 中
- Signal 不支持原生 @ 提及（不像 Discord/Slack）

**解决方案**：

配置群组策略：

```json
{
  "channels": {
    "signal": {
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["+15557654321"]
    }
  }
}
```

或使用命令触发（如果配置了 `commands.config: true`）：

```
@clawdbot help
```

### 坑 4：媒体文件下载失败

**问题**：Signal 消息中的图片或附件无法处理

**可能原因**：

- 文件大小超过 `mediaMaxMb` 限制（默认 8MB）
- `ignoreAttachments` 设置为 `true`

**解决方案**：

```json
{
  "channels": {
    "signal": {
      "mediaMaxMb": 20,
      "ignoreAttachments": false
    }
  }
}
```

### 坑 5：长消息被截断

**问题**：发送的消息被分割成多段

**原因**：Signal 有消息长度限制（默认 4000 字符），Clawdbot 会自动分块

**解决方案**：

调整分块配置：

```json
{
  "channels": {
    "signal": {
      "textChunkLimit": 2000,
      "chunkMode": "newline"
    }
  }
}
```

`chunkMode` 选项：
- `length`（默认）：按长度分块
- `newline`：先按空行分割（段落边界），再按长度分块

## 本课小结

本课我们完成了 Signal 渠道的配置和使用：

**核心概念**：
- Signal 渠道基于 signal-cli，通过 HTTP JSON-RPC + SSE 通信
- 推荐使用独立的 bot 号码，避免消息循环
- 默认启用 DM 配对机制，保护你的账户安全

**关键配置**：
- `account`：Signal 账号（E.164 格式）
- `cliPath`：signal-cli 路径
- `dmPolicy`：DM 访问策略（默认 `pairing`）
- `allowFrom`：DM 白名单
- `groupPolicy` / `groupAllowFrom`：群组策略

**实用功能**：
- 多账户支持
- 群组消息（独立上下文）
- 打字指示器
- 已读回执
- Reactions（表情反应）

**故障排查**：
- 使用 `clawdbot channels status` 检查 Channel 状态
- 使用 `clawdbot pairing list signal` 查看待批准的配对请求
- 查看 Gateway 日志获取详细错误信息

## 下一课预告

> 下一课我们学习 **[iMessage 渠道](../imessage/)**。
>
> 你会学到：
> - 如何在 macOS 上配置 iMessage 渠道
> - 使用 BlueBubbles 扩展支持
> - iMessage 的特殊功能（已读回执、打字指示器等）
> - iOS 节点集成（Camera、Canvas、Voice Wake）

继续探索 Clawdbot 的强大功能吧！🚀

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能        | 文件路径                                                                                    | 行号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| Signal RPC 客户端 | [`src/signal/client.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/client.ts)         | 1-186   |
| Signal 守护进程管理 | [`src/signal/daemon.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/daemon.ts)         | 1-85    |
| 多账户支持 | [`src/signal/accounts.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/accounts.ts)       | 1-84    |
| Signal 监控和事件处理 | [`src/signal/monitor.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/monitor.ts)       | -       |
| 消息发送 | [`src/signal/send.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send.ts)             | -       |
| Reactions 发送 | [`src/signal/send-reactions.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send-reactions.ts) | -       |
| Reaction 级别配置 | [`src/signal/reaction-level.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/reaction-level.ts) | -       |

**配置类型定义**：
- `SignalAccountConfig`: [`src/config/types.signal.ts:13-87`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L13-L87)
- `SignalConfig`: [`src/config/types.signal.ts:89-93`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L89-L93)

**关键常量**：
- `DEFAULT_TIMEOUT_MS = 10_000`：Signal RPC 请求默认超时时间（10 秒）来源：`src/signal/client.ts:29`
- 默认 HTTP 端口：`8080` 来源：`src/signal/accounts.ts:59`
- 默认文本分块大小：`4000` 字符 来源：`docs/channels/signal.md:113`

**关键函数**：
- `signalRpcRequest<T>()`：发送 JSON-RPC 请求到 signal-cli 来源：`src/signal/client.ts:54-90`
- `streamSignalEvents()`：通过 SSE 订阅 Signal 事件 来源：`src/signal/client.ts:112-185`
- `spawnSignalDaemon()`：启动 signal-cli 守护进程 来源：`src/signal/daemon.ts:50-84`
- `resolveSignalAccount()`：解析 Signal 账户配置 来源：`src/signal/accounts.ts:49-77`
- `listEnabledSignalAccounts()`：列出已启用的 Signal 账户 来源：`src/signal/accounts.ts:79-83`

</details>
