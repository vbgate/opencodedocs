---
title: "Gateway 快速启动：5 分钟启动 AI 助手 | OpenClaw"
sidebarTitle: "启动 Gateway"
subtitle: "Gateway 快速启动：5 分钟启动你的 AI 助手服务"
description: "学习如何启动 OpenClaw Gateway 服务，理解 WebSocket 控制平面概念，掌握会话管理和频道配置，5 分钟内让 AI 助手运行起来。"
tags:
  - "gateway"
  - "websocket"
  - "quickstart"
prerequisite:
  - "start-onboard"
order: 20
---

# Gateway 快速启动：启动你的 AI 助手服务

::: info 学完你能做什么
完成本教程后，你将能够：
- 理解 Gateway 的核心架构和 WebSocket 控制平面概念
- 使用 CLI 启动和配置 Gateway 服务
- 通过 Token 或 Password 认证保护 Gateway 访问
- 管理多频道（WhatsApp、Telegram、Slack 等）的生命周期
- 使用 WebSocket 客户端与 Gateway 交互
- 利用 Tailscale 实现安全的远程访问
:::

## 核心概念

OpenClaw Gateway 是系统的**中央控制平面**，它统一协调所有 AI 会话、消息频道、工具和事件。想象它是一个交通枢纽，所有消息（来自 WhatsApp、Telegram 等）都汇聚于此，由 Pi Agent 处理后返回响应。

### Gateway 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                         │
│                   (ws://127.0.0.1:18789)                   │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Channels   │   Sessions   │    Tools     │   Control UI   │
│  (消息频道)   │  (会话管理)   │   (工具执行)  │  (Web 界面)    │
├──────────────┴──────────────┴──────────────┴────────────────┤
│              Pi Agent Runtime (RPC 通信层)                   │
└─────────────────────────────────────────────────────────────┘
         │                     │                     │
         ▼                     ▼                     ▼
   WhatsApp/Telegram     Browser/CDP          Mobile/Node
   Slack/Discord         Canvas/Shell         Devices
```

**关键组件说明**：

| 组件 | 功能 | 源码位置 |
|------|------|----------|
| **WebSocket 服务器** | 统一的控制平面协议 | `src/gateway/server.impl.ts:157` |
| **HTTP API** | OpenAI 兼容接口 | `src/gateway/openresponses-http.ts` |
| **频道管理器** | 多频道生命周期管理 | `src/gateway/server-channels.ts:64` |
| **会话解析器** | 会话键解析和路由 | `src/gateway/sessions-resolve.ts:18` |
| **聊天处理器** | Agent 事件和流式响应 | `src/gateway/server-chat.ts:220` |

### 默认端口配置

| 服务 | 端口 | 说明 |
|------|------|------|
| Gateway WebSocket/HTTP | `18789` | 主控制平面端口 |
| Canvas 主机 | `18793` | 可视化界面服务 |
| 浏览器控制 | 动态分配 | Chrome DevTools Protocol |

::: tip 端口冲突处理
如果 18789 被占用，Gateway 会尝试递增端口。你也可以通过 `--port` 参数指定其他端口。
:::

## 🎒 开始前的准备

在启动 Gateway 之前，请确认：

1. ✅ 已完成 `openclaw onboard` 初始配置
2. ✅ Node.js 版本 ≥ 22.12.0
3. ✅ 配置文件位于 `~/.openclaw/openclaw.json`
4. ✅ 至少配置了一个 AI 模型提供商（Anthropic/OpenAI）

**快速检查命令**：

```bash
# 检查 OpenClaw 版本
openclaw --version

# 验证配置有效性
openclaw doctor

# 查看 Gateway 端口配置
openclaw config get gateway.port

# 查看完整 Gateway 配置
openclaw config get gateway
```

## 启动 Gateway

### 方式一：交互式配置启动（推荐首次使用）

使用 `openclaw config` 命令启动交互式配置向导：

```bash
# 启动完整配置向导
openclaw config

# 或仅配置 Gateway 相关部分
openclaw config --section gateway --section tailscale
```

配置向导会引导你完成以下配置：

| 配置项 | 选项 | 说明 |
|--------|------|------|
| **端口** | 自定义数字 | 默认 18789 |
| **绑定模式** | loopback / lan / tailnet / auto / custom | 见下方详解 |
| **认证模式** | token / password | 推荐 Token 模式 |
| **Tailscale** | off / serve / funnel | 可选的远程访问 |

**绑定模式详解**（源自 `src/config/types.gateway.ts:249-268`）：

| 模式 | 绑定地址 | 适用场景 |
|------|----------|----------|
| `loopback` | `127.0.0.1` | 仅本机访问（最安全） |
| `lan` | `0.0.0.0` | 局域网内访问 |
| `tailnet` | Tailscale IP | 通过 Tailscale 访问 |
| `auto` | 自动选择 | 优先 loopback，失败后 lan |
| `custom` | 自定义 IP | 指定特定地址 |

### 方式二：快速启动（已有配置）

```bash
# 使用默认配置启动
openclaw gateway

# 指定端口和绑定模式
openclaw gateway --port 8080 --bind loopback

# 前台运行（查看日志）
openclaw gateway --foreground
```

**你应该看到**：

```
┌─────────────────────────────────────────┐
│  OpenClaw Gateway v2026.2.13            │
│  ✓ WebSocket: ws://127.0.0.1:18789     │
│  ✓ Control UI: http://127.0.0.1:18789  │
│  ✓ Auth: Token (mode: token)           │
│  ✓ Channels: 0 running                 │
└─────────────────────────────────────────┘
```

### 方式三：编程方式启动

参考 `src/gateway/server.impl.ts:157`：

```typescript
import { startGatewayServer } from "openclaw/gateway";

const server = await startGatewayServer(18789, {
  bind: "loopback",
  controlUiEnabled: true,
  openAiChatCompletionsEnabled: true,
  openResponsesEnabled: true,
  auth: {
    mode: "token",
    token: "your-secure-token",
  },
});

// 关闭 Gateway
await server.close({ reason: "manual shutdown" });
```

## 配置详解

### Gateway 配置结构

配置文件路径：`~/.openclaw/openclaw.json`

```json
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-generated-token",
      "allowTailscale": false,
      "rateLimit": {
        "maxAttempts": 10,
        "windowMs": 60000,
        "lockoutMs": 300000,
        "exemptLoopback": true
      }
    },
    "tailscale": {
      "mode": "off",
      "resetOnExit": false
    },
    "controlUi": {
      "enabled": true,
      "basePath": "/",
      "allowedOrigins": ["http://localhost:3000"]
    },
    "http": {
      "endpoints": {
        "chatCompletions": { "enabled": true },
        "responses": { "enabled": true }
      }
    }
  }
}
```

### 认证模式对比

基于 `src/config/types.gateway.ts:79-92`：

| 特性 | Token 模式 | Password 模式 |
|------|------------|---------------|
| **适用场景** | 开发/自动化脚本 | 多用户共享/远程访问 |
| **安全性** | 高（随机字符串） | 中（依赖密码强度） |
| **Tailscale Funnel** | 不支持 | 必需 |
| **CLI 使用** | `OPENCLAW_GATEWAY_TOKEN` | 交互式输入 |
| **浏览器访问** | URL 参数或 Header | 登录表单 |

**Token 生成建议**（来自 `src/commands/onboard-helpers.ts`）：

```bash
# 生成 64 字符随机 Token
openssl rand -hex 32

# 设置环境变量
echo 'export OPENCLAW_GATEWAY_TOKEN="your-token"' >> ~/.zshrc
```

### 速率限制配置

```json
{
  "gateway": {
    "auth": {
      "rateLimit": {
        "maxAttempts": 10,      // 窗口内最大失败次数
        "windowMs": 60000,      // 滑动窗口：1分钟
        "lockoutMs": 300000,    // 锁定时间：5分钟
        "exemptLoopback": true  // 本地地址豁免
      }
    }
  }
}
```

::: warning 生产环境建议
对于暴露到公网的 Gateway，务必启用 rateLimit 并考虑使用 TLS。
:::

## 会话管理

### 会话概念

OpenClaw 使用**会话（Session）**来隔离不同 Agent 的上下文。每个会话包含：

- 对话历史
- Agent 配置
- 工具状态
- 记忆数据

### 会话解析策略

基于 `src/gateway/sessions-resolve.ts:18-139`：

| 标识方式 | 优先级 | 示例 |
|----------|--------|------|
| `key` | 最高 | `@alice/pi-main` |
| `sessionId` | 中 | `sess_abc123` |
| `label` | 低 | `工作助手` |

### CLI 会话操作

```bash
# 列出所有会话
openclaw sessions list

# 查看会话详情
openclaw sessions preview --key @alice/pi-main

# 重置会话（保留配置，清除历史）
openclaw sessions reset --key @alice/pi-main

# 删除会话
openclaw sessions delete --key @alice/pi-main

# 压缩会话（减少存储占用）
openclaw sessions compact --key @alice/pi-main
```

### 会话 WebSocket API

```javascript
// 列出会话
ws.send(JSON.stringify({
  method: "sessions.list",
  params: { includeGlobal: true }
}));

// 响应格式
{
  "sessions": [
    {
      "key": "@alice/pi-main",
      "sessionId": "pi-main",
      "agentId": "pi",
      "label": "主助手",
      "messageCount": 42,
      "lastActiveAt": "2026-02-14T10:30:00Z"
    }
  ]
}
```

## 频道管理

### 频道生命周期

基于 `src/gateway/server-channels.ts:64-308` 的 ChannelManager：

```
配置加载 → 账号解析 → 启动账号 → 运行监控 → 停止/重启
    │          │          │          │          │
    ▼          ▼          ▼          ▼          ▼
loadConfig  resolveAccount startAccount runtime  stopAccount
```

### 查看频道状态

```bash
# 查看所有频道状态
openclaw channels status

# 深度探测（检查连接健康）
openclaw channels status --probe

# 启动特定频道
openclaw channels start whatsapp

# 停止频道
openclaw channels stop telegram
```

**状态输出示例**：

```
┌───────────┬─────────┬───────────┬─────────────────┐
│ Channel   │ Status  │ Account   │ Last Error      │
├───────────┼─────────┼───────────┼─────────────────┤
│ whatsapp  │ ✓ running│ default  │ -               │
│ telegram  │ ✗ stopped│ bot1     │ not configured  │
│ slack     │ ✗ stopped│ -        │ disabled        │
│ discord   │ ✓ running│ main     │ -               │
└───────────┴─────────┴───────────┴─────────────────┘
```

### 频道运行时状态

每个频道账号维护以下运行时状态（`ChannelAccountSnapshot`）：

| 字段 | 类型 | 说明 |
|------|------|------|
| `accountId` | string | 账号标识 |
| `running` | boolean | 是否运行中 |
| `connected` | boolean | 是否已连接 |
| `lastStartAt` | number | 上次启动时间戳 |
| `lastStopAt` | number | 上次停止时间戳 |
| `lastError` | string | 最后错误信息 |

## API 端点详解

### WebSocket 控制平面

连接地址：`ws://127.0.0.1:18789`

**连接流程**：

```javascript
const ws = new WebSocket('ws://127.0.0.1:18789');

// 1. 等待连接挑战
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  
  if (msg.event === 'connect.challenge') {
    // 2. 发送认证响应
    ws.send(JSON.stringify({
      method: 'auth',
      params: {
        token: 'your-gateway-token'  // 或 password
      }
    }));
  }
  
  if (msg.event === 'agent') {
    // 处理 Agent 事件流
    console.log('Agent event:', msg.data);
  }
};
```

### Gateway 方法列表

基于 `src/gateway/server-methods-list.ts:3-97`：

**核心方法**：

| 方法 | 描述 |
|------|------|
| `health` | 健康检查 |
| `status` | 完整状态报告 |
| `channels.status` | 频道状态查询 |
| `config.get/set` | 配置读写 |
| `sessions.list/preview/patch` | 会话管理 |
| `agents.list/create/update/delete` | Agent 管理 |
| `skills.status/install/update` | 技能管理 |
| `cron.list/add/remove/run` | 定时任务 |
| `browser.request` | 浏览器控制 |

**事件订阅**（`GATEWAY_EVENTS`）：

| 事件 | 触发时机 |
|------|----------|
| `connect.challenge` | 连接认证挑战 |
| `agent` | Agent 事件流 |
| `chat` | 聊天消息 |
| `presence` | 在线状态变化 |
| `health` | 健康状态更新 |
| `node.pair.requested` | 节点配对请求 |
| `exec.approval.requested` | 执行审批请求 |

### HTTP API（OpenAI 兼容）

基于 `src/gateway/openresponses-http.ts`：

```bash
# Chat Completions API
curl http://127.0.0.1:18789/v1/chat/completions \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet",
    "messages": [{"role": "user", "content": "Hello"}]
  }'

# OpenResponses API
curl http://127.0.0.1:18789/v1/responses \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet",
    "input": "What is OpenClaw?"
  }'
```

::: tip 启用 HTTP API
默认情况下 HTTP API 是禁用的，需要在配置中开启：

```json
{
  "gateway": {
    "http": {
      "endpoints": {
        "chatCompletions": { "enabled": true },
        "responses": { "enabled": true }
      }
    }
  }
}
```
:::

## 最佳实践

### 1. 安全配置清单

```markdown
□ 使用 Token 认证而非 Password（除非需要 Tailscale Funnel）
□ 启用 rateLimit 防止暴力破解
□ 生产环境使用 TLS（配置 certPath/keyPath）
□ 限制 trustedProxies 到已知反向代理 IP
□ 定期轮换 Gateway Token
```

### 2. 性能优化建议

| 场景 | 建议 |
|------|------|
| 高并发 | 增加 `rateLimit.maxAttempts` 和 `windowMs` |
| 大文件上传 | 调整 `http.endpoints.responses.maxBodyBytes` |
| 频繁重启 | 使用 `reload.mode: "hot"` 实现热重载 |
| 多频道 | 按需启动频道，避免同时运行过多 |

### 3. 故障排查流程

```
Gateway 无法启动？
    │
    ├─→ 检查端口占用：lsof -i :18789
    │
    ├─→ 检查配置有效性：openclaw doctor
    │
    ├─→ 查看详细日志：openclaw gateway --foreground
    │
    └─→ 重置配置：openclaw config reset
```

### 4. 生产部署建议

```bash
# 使用 systemd 服务（Linux）
sudo cat > /etc/systemd/system/openclaw-gateway.service << 'EOF'
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
User=openclaw
Environment="OPENCLAW_STATE_DIR=/var/lib/openclaw"
Environment="OPENCLAW_GATEWAY_TOKEN_FILE=/etc/openclaw/token"
ExecStart=/usr/bin/openclaw gateway --bind loopback --port 18789
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable --now openclaw-gateway
```

## 检查点 ✅

完成以下验证，确保 Gateway 正常运行：

1. **Gateway 启动检查**：
   ```bash
   curl -H "Authorization: Bearer your-token" \
     http://127.0.0.1:18789/v1/health
   ```
   预期返回：`{"status":"ok"}`

2. **WebSocket 连接检查**：
   ```bash
   # 使用 wscat 测试
   wscat -c ws://127.0.0.1:18789 \
     -H "Authorization: Bearer your-token"
   ```

3. **频道状态检查**：
   ```bash
   openclaw channels status --probe
   ```

## 本课小结

在本教程中，你学习了：

- **Gateway 架构**：WebSocket 控制平面统一协调 Channels、Sessions、Tools
- **启动方式**：交互式配置、CLI 参数、编程方式
- **认证机制**：Token（推荐）和 Password 模式的选择
- **会话管理**：基于 key/sessionId/label 的解析策略
- **频道生命周期**：start → runtime → stop 的完整流程
- **API 接口**：WebSocket 方法、HTTP OpenAI 兼容接口

::: info 下一步
继续学习 **[发送第一条消息](../first-message/)**，体验与 AI 助手的首次对话。
:::

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Gateway 配置命令 | [`src/commands/configure.gateway.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/configure.gateway.ts) | 17-229 |
| Gateway 服务器启动 | [`src/gateway/server.impl.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server.impl.ts) | 157-673 |
| 频道管理器 | [`src/gateway/server-channels.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-channels.ts) | 64-308 |
| 会话解析器 | [`src/gateway/sessions-resolve.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/sessions-resolve.ts) | 18-139 |
| 聊天事件处理 | [`src/gateway/server-chat.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-chat.ts) | 220-418 |
| Gateway 方法列表 | [`src/gateway/server-methods-list.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-methods-list.ts) | 3-119 |
| Gateway 配置类型 | [`src/config/types.gateway.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.gateway.ts) | 249-286 |
| WebSocket 运行时 | [`src/gateway/server-ws-runtime.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-ws-runtime.ts) | 9-53 |
| 认证配置构建 | [`src/commands/configure.gateway-auth.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/configure.gateway-auth.ts) | - |

**关键常量**：
- `DEFAULT_GATEWAY_PORT = 18789`：默认 Gateway 端口
- `DEFAULT_CANVAS_PORT = 18793`：默认 Canvas 主机端口

**关键函数**：
- `startGatewayServer(port, opts)`：Gateway 服务器入口
- `createChannelManager(opts)`：频道管理器工厂函数
- `resolveSessionKeyFromResolveParams(params)`：会话键解析
- `createAgentEventHandler(options)`：Agent 事件处理器

</details>
