---
title: "启动 Gateway：守护进程与运行模式 | Clawdbot 教程"
sidebarTitle: "Gateway 随时在线"
subtitle: "启动 Gateway：守护进程与运行模式"
description: "学习如何启动 Clawdbot Gateway 守护进程，了解开发模式和生产模式的区别，掌握常用的启动命令和参数配置。"
tags:
  - "gateway"
  - "daemon"
  - "startup"
prerequisite:
  - "start-onboarding-wizard"
order: 30
---

# 启动 Gateway：守护进程与运行模式

## 学完你能做什么

- 使用命令行启动 Gateway 前台进程
- 配置 Gateway 为后台守护进程（macOS LaunchAgent / Linux systemd / Windows Scheduled Task）
- 理解不同绑定模式（loopback / LAN / Tailnet）和认证方式
- 在开发模式和生产模式之间切换
- 使用 `--force` 强制释放被占用的端口

## 你现在的困境

你已经完成了向导配置，Gateway 的基础设置已经就绪。但是：

- 每次想用 Gateway 都得手动在终端运行命令？
- 关闭终端窗口后 Gateway 就停止了，AI 助手也跟着"下线"？
- 想在局域网或 Tailscale 网络中访问 Gateway，不知道怎么配置？
- Gateway 启动失败，但不知道是配置问题还是端口被占用？

## 什么时候用这一招

**推荐启动方式**：

| 场景                  | 使用命令                               | 说明                                   |
| ----------------------- | -------------------------------------- | -------------------------------------- |
| 日常使用                | `clawdbot gateway install` + `clawdbot gateway start` | 作为后台服务自动启动                  |
| 开发调试                | `clawdbot gateway --dev`                     | 创建开发配置，自动重载                  |
| 临时测试                | `clawdbot gateway`                           | 前台运行，日志直接输出到终端            |
| 端口冲突                | `clawdbot gateway --force`                   | 强制释放端口后启动                    |
| 局域网访问              | `clawdbot gateway --bind lan`                 | 允许局域网设备连接                   |
| Tailscale 远程访问         | `clawdbot gateway --tailscale serve`          | 通过 Tailscale 网络暴露 Gateway          |

## 🎒 开始前的准备

::: warning 前置检查

在启动 Gateway 前，请确保：

1. ✅ 已完成向导配置（`clawdbot onboard`）或手动设置了 `gateway.mode=local`
2. ✅ AI 模型已配置（Anthropic / OpenAI / OpenRouter 等）
3. ✅ 如需访问外部网络（LAN / Tailnet），已配置认证方式
4. ✅ 了解你的使用场景（本地开发 vs 生产运行）

:::

## 核心思路

**Gateway 是什么？**

Gateway 是 Clawdbot 的 WebSocket 控制平面，它负责：

- **会话管理**：维护所有 AI 对话会话状态
- **渠道连接**：连接 WhatsApp、Telegram、Slack 等 12+ 种消息渠道
- **工具调用**：协调浏览器自动化、文件操作、定时任务等工具执行
- **节点管理**：管理 macOS / iOS / Android 设备节点
- **事件分发**：推送 AI 思考进度、工具调用结果等实时事件

**为什么需要守护进程？**

作为后台服务运行的 Gateway 有这些优势：

- **持久在线**：即使关闭终端，AI 助手依然可用
- **自动启动**：系统重启后自动恢复服务（macOS LaunchAgent / Linux systemd）
- **统一管理**：通过 `start` / `stop` / `restart` 命令控制生命周期
- **日志集中**：系统级日志收集，便于排查问题

## 跟我做

### 第 1 步：启动 Gateway（前台模式）

**为什么**

前台模式适合开发测试，日志直接输出到终端，方便实时查看 Gateway 状态。

```bash
# 使用默认配置启动（监听 127.0.0.1:18789）
clawdbot gateway

# 指定端口启动
clawdbot gateway --port 19001

# 开启详细日志
clawdbot gateway --verbose
```

**你应该看到**：

```bash
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
✓ log file: /Users/you/.clawdbot/logs/gateway.log
```

::: tip 检查点

- 看到 `listening on ws://...` 表示启动成功
- 记下显示的 PID（进程 ID），用于后续调试
- 端口默认是 18789，可通过 `--port` 修改

:::

### 第 2 步：配置绑定模式

**为什么**

默认情况下 Gateway 只监听本地回环地址（`127.0.0.1`），这意味着只有本机可以连接。如果你想在局域网或 Tailscale 网络中访问，需要调整绑定模式。

```bash
# 仅本地回环（默认，最安全）
clawdbot gateway --bind loopback

# 局域网访问（需要认证）
clawdbot gateway --bind lan --token "your-token"

# Tailscale 网络访问
clawdbot gateway --bind tailnet --token "your-token"

# 自动检测（本地 + LAN）
clawdbot gateway --bind auto
```

**你应该看到**：

```bash
# loopback 模式
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# lan 模式
✓ listening on ws://192.168.1.100:18789 (PID 12345)
✓ listening on ws://10.0.0.5:18789
```

::: warning 安全提示

⚠️ **绑定到非 loopback 地址必须配置认证！**

- `--bind lan` / `--bind tailnet` 时必须传递 `--token` 或 `--password`
- 否则 Gateway 会拒绝启动，报错：`Refusing to bind gateway to lan without auth`
- 认证令牌通过 `gateway.auth.token` 配置或 `--token` 参数传入

:::

### 第 3 步：安装为守护进程（macOS / Linux / Windows）

**为什么**

守护进程让 Gateway 在后台运行，即使关闭终端窗口也不受影响。系统重启后自动启动，保持 AI 助手始终在线。

```bash
# 安装为系统服务（macOS LaunchAgent / Linux systemd / Windows Scheduled Task）
clawdbot gateway install

# 启动服务
clawdbot gateway start

# 查看服务状态
clawdbot gateway status

# 重启服务
clawdbot gateway restart

# 停止服务
clawdbot gateway stop
```

**你应该看到**：

```bash
# macOS
✓ LaunchAgent loaded
✓ service runtime: active

# Linux
✓ systemd service enabled
✓ service runtime: active

# Windows
✓ Scheduled Task registered
✓ service runtime: running
```

::: tip 检查点

- 运行 `clawdbot gateway status` 确认服务状态为 `active` / `running`
- 如果服务显示 `loaded` 但 `runtime: inactive`，运行 `clawdbot gateway start`
- 守护进程日志写入 `~/.clawdbot/logs/gateway.log`

:::

### 第 4 步：处理端口冲突（--force）

**为什么**

默认端口 18789 可能被其他进程占用（如之前的 Gateway 实例）。使用 `--force` 可以自动释放端口。

```bash
# 强制释放端口并启动 Gateway
clawdbot gateway --force
```

**你应该看到**：

```bash
✓ force: killed pid 9876 (node) on port 18789
✓ force: waited 1200ms for port 18789 to free
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: info 工作原理

`--force` 按顺序执行以下操作：

1. 尝试 SIGTERM 优雅终止进程（等待 700ms）
2. 如果未终止，使用 SIGKILL 强制杀死
3. 等待端口释放（最多 2 秒）
4. 启动新的 Gateway 进程

:::

### 第 5 步：开发模式（--dev）

**为什么**

开发模式使用独立的配置文件和目录，避免污染生产环境。支持 TypeScript 热重载，修改代码后自动重启 Gateway。

```bash
# 启动开发模式（创建 dev profile + workspace）
clawdbot gateway --dev

# 重置开发配置（清除凭证 + 会话 + 工作区）
clawdbot gateway --dev --reset
```

**你应该看到**：

```bash
✓ dev config created at ~/.clawdbot-dev/clawdbot.json
✓ dev workspace initialized at ~/clawd-dev
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip 开发模式特点

- 配置文件：`~/.clawdbot-dev/clawdbot.json`（独立于生产配置）
- 工作区目录：`~/clawd-dev`
- 跳过 `BOOT.md` 脚本执行
- 默认绑定 loopback，无需认证

:::

### 第 6 步：Tailscale 集成

**为什么**

Tailscale 让你通过安全私网访问远程 Gateway，无需公网 IP 或端口转发。

```bash
# Tailscale Serve 模式（推荐）
clawdbot gateway --tailscale serve

# Tailscale Funnel 模式（需要额外认证）
clawdbot gateway --tailscale funnel --auth password
```

**你应该看到**：

```bash
# serve 模式
✓ Tailscale identity detected
✓ advertising gateway via Tailscale Serve
✓ MagicDNS: https://your-tailnet.ts.net
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# funnel 模式
✓ Tailscale Funnel enabled
✓ Funnel URL: https://your-tailnet.ts.net:18789
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip 配置认证

Tailscale 集成支持两种认证方式：

1. **Identity Headers**（推荐）：设置 `gateway.auth.allowTailscale=true`，Tailscale 身份自动满足认证
2. **Token / Password**：传统认证方式，需要手动传递 `--token` 或 `--password`

:::

### 第 7 步：验证 Gateway 状态

**为什么**

确认 Gateway 正常运行且 RPC 协议可访问。

```bash
# 查看完整状态（服务 + RPC 探测）
clawdbot gateway status

# 跳过 RPC 探测（仅服务状态）
clawdbot gateway status --no-probe

# 健康检查
clawdbot gateway health

# 探测所有可达的 Gateway
clawdbot gateway probe
```

**你应该看到**：

```bash
# status 命令输出
Gateway service status
┌──────────────────────────────────────┐
│ Service: LaunchAgent (loaded)      │
│ Runtime: running (PID 12345)       │
│ Port: 18789                       │
│ Last gateway error: none            │
└──────────────────────────────────────┘

RPC probe
┌──────────────────────────────────────┐
│ Target: ws://127.0.0.1:18789 │
│ Status: ✓ connected                │
│ Latency: 12ms                    │
└──────────────────────────────────────┘

# health 命令输出
✓ Gateway is healthy
✓ WebSocket connection: OK
✓ RPC methods: available
```

::: tip 故障排查

如果 `status` 显示 `Runtime: running` 但 `RPC probe: failed`：

1. 检查端口是否正确：`clawdbot gateway status`
2. 检查认证配置：是否绑定到 LAN / Tailnet 但未提供认证？
3. 查看日志：`cat ~/.clawdbot/logs/gateway.log`
4. 运行 `clawdbot doctor` 获取详细诊断

:::

## 踩坑提醒

### ❌ 错误：Gateway 拒绝启动

**错误信息**：
```
Gateway start blocked: set gateway.mode=local (current: unset) or pass --allow-unconfigured.
```

**原因**：`gateway.mode` 未设置为 `local`

**解决方法**：

```bash
# 方法 1：运行向导配置
clawdbot onboard

# 方法 2：手动修改配置文件
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "mode": "local"
  }
}

# 方法 3：临时跳过检查（不推荐）
clawdbot gateway --allow-unconfigured
```

### ❌ 错误：绑定到 LAN 但无认证

**错误信息**：
```
Refusing to bind gateway to lan without auth.
Set gateway.auth.token/password (or CLAWDBOT_GATEWAY_TOKEN/CLAWDBOT_GATEWAY_PASSWORD) or pass --token/--password.
```

**原因**：非 loopback 绑定必须配置认证（安全限制）

**解决方法**：

```bash
# 通过配置文件设置认证
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}

# 或通过命令行传递
clawdbot gateway --bind lan --token "your-secure-token"
```

### ❌ 错误：端口已被占用

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::18789
```

**原因**：另一个 Gateway 实例或其他程序占用了端口

**解决方法**：

```bash
# 方法 1：强制释放端口
clawdbot gateway --force

# 方法 2：使用不同端口
clawdbot gateway --port 19001

# 方法 3：手动查找并终止进程
lsof -ti:18789 | xargs kill -9  # macOS / Linux
netstat -ano | findstr :18789               # Windows
```

### ❌ 错误：dev 模式 reset 需要 --dev

**错误信息**：
```
Use --reset with --dev.
```

**原因**：`--reset` 只能在开发模式使用，避免误删生产数据

**解决方法**：

```bash
# 正确的重置开发环境命令
clawdbot gateway --dev --reset
```

### ❌ 错误：服务已安装但仍使用前台模式

**现象**：运行 `clawdbot gateway` 时提示"Gateway already running locally"

**原因**：守护进程已经在后台运行

**解决方法**：

```bash
# 停止后台服务
clawdbot gateway stop

# 或重启服务
clawdbot gateway restart

# 然后再启动前台（如需调试）
clawdbot gateway --port 19001  # 使用不同端口
```

## 本课小结

本课学习了：

✅ **启动方式**：前台模式 vs 守护进程
✅ **绑定模式**：loopback / LAN / Tailnet / Auto
✅ **认证方式**：Token / Password / Tailscale Identity
✅ **开发模式**：独立配置、热重载、--reset 重置
✅ **故障排查**：`status` / `health` / `probe` 命令
✅ **服务管理**：`install` / `start` / `stop` / `restart` / `uninstall`

**关键命令速查**：

| 场景                   | 命令                                        |
| ---------------------- | ------------------------------------------- |
| 日常使用（服务）       | `clawdbot gateway install && clawdbot gateway start` |
| 开发调试              | `clawdbot gateway --dev`                     |
| 临时测试              | `clawdbot gateway`                           |
| 强制释放端口          | `clawdbot gateway --force`                   |
| 局域网访问           | `clawdbot gateway --bind lan --token "xxx"`   |
| Tailscale 远程       | `clawdbot gateway --tailscale serve`          |
| 查看状态              | `clawdbot gateway status`                     |
| 健康检查              | `clawdbot gateway health`                     |

## 下一课预告

> 下一课我们学习 **[发送第一条消息](../first-message/)**。
>
> 你会学到：
> - 通过 WebChat 发送第一条消息
> - 通过已配置渠道（WhatsApp/Telegram 等）与 AI 助手对话
> - 理解消息路由和响应流程

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能                        | 文件路径                                                                                   | 行号     |
| --------------------------- | -------------------------------------------------------------------------------------- | -------- |
| Gateway 启动入口            | [`src/cli/gateway-cli/run.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/run.ts) | 55-310   |
| 守护进程服务抽象         | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | 66-155    |
| 启动侧边栏服务           | [`src/gateway/server-startup.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup.ts) | 26-160    |
| Gateway 服务器实现         | [`src/gateway/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server.ts) | 1-500     |
| 程序参数解析             | [`src/daemon/program-args.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/program-args.ts) | 1-250     |
| 启动日志输出              | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 7-40      |
| 开发模式配置             | [`src/cli/gateway-cli/dev.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/dev.ts) | 1-100     |
| 端口释放逻辑             | [`src/cli/ports.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/ports.ts) | 1-80      |

**关键常量**：
- 默认端口：`18789`（来源：`src/gateway/server.ts`）
- 默认绑定：`loopback`（来源：`src/cli/gateway-cli/run.ts:175`）
- 开发模式配置路径：`~/.clawdbot-dev/`（来源：`src/cli/gateway-cli/dev.ts`）

**关键函数**：
- `runGatewayCommand()`：Gateway CLI 主入口，处理命令行参数和启动逻辑
- `startGatewayServer()`：启动 WebSocket 服务器，监听指定端口
- `forceFreePortAndWait()`：强制释放端口并等待
- `resolveGatewayService()`：根据平台返回对应的守护进程实现（macOS LaunchAgent / Linux systemd / Windows Scheduled Task）
- `logGatewayStartup()`：输出 Gateway 启动信息（模型、监听地址、日志文件）

</details>
