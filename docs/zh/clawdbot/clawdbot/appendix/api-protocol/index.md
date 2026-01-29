---
title: "Gateway WebSocket API 协议完整指南 | Clawdbot 教程"
sidebarTitle: "开发自定义客户端"
subtitle: "Gateway WebSocket API 协议完整指南"
description: "学习 Clawdbot Gateway WebSocket 协议的完整规范，包括连接握手、消息帧格式、请求/响应模型、事件推送、权限系统和所有可用方法。本教程提供完整的 API 参考和客户端集成示例，帮助你快速实现自定义客户端与 Gateway 的集成。"
tags:
  - "API"
  - "WebSocket"
  - "协议"
  - "开发者"
prerequisite:
  - "start-gateway-startup"
  - "advanced-session-management"
order: 350
---

# Gateway WebSocket API 协议完整指南

## 学完你能做什么

- 📡 成功连接到 Gateway WebSocket 服务器
- 🔄 发送请求并处理响应
- 📡 接收服务器推送的事件
- 🔐 理解权限系统并进行认证
- 🛠️ 调用所有可用的 Gateway 方法
- 📖 理解消息帧格式和错误处理

## 你现在的困境

你可能正在开发一个自定义客户端（如移动应用、Web 应用或命令行工具），需要与 Clawdbot Gateway 通信。Gateway 的 WebSocket 协议似乎很复杂，你需要：

- 了解如何建立连接和认证
- 理解请求/响应的消息格式
- 知道可用的方法及其参数
- 处理服务器推送的事件
- 理解权限系统

**好消息**：Gateway WebSocket API 协议设计得很清晰，本教程将为你提供完整的参考指南。

## 什么时候用这一招

::: info 适用场景
使用本协议当你需要：
- 开发自定义客户端连接 Gateway
- 实现 WebChat 或移动应用
- 创建监控或管理工具
- 集成 Gateway 到现有系统
- 调试和测试 Gateway 功能
:::

## 核心思路

Clawdbot Gateway 使用 WebSocket 协议提供实时双向通信。协议基于 JSON 格式的消息帧，分为三种类型：

1. **请求帧（Request Frame）**：客户端发送请求
2. **响应帧（Response Frame）**：服务端返回响应
3. **事件帧（Event Frame）**：服务端主动推送事件

::: tip 设计哲学
协议采用"请求-响应"模型 + "事件推送"模式：
- 客户端主动发起请求，服务端返回响应
- 服务端可以主动推送事件，无需客户端请求
- 所有操作都通过统一的 WebSocket 连接进行
:::

## 连接握手

### 步骤 1：建立 WebSocket 连接

Gateway 默认监听 `ws://127.0.0.1:18789`（可通过配置修改）。

::: code-group

```javascript [JavaScript]
// 建立 WebSocket 连接
const ws = new WebSocket('ws://127.0.0.1:18789/v1/connect');

ws.onopen = () => {
  console.log('WebSocket 已连接');
};
```

```python [Python]
import asyncio
import websockets

async def connect():
    uri = "ws://127.0.0.1:18789/v1/connect"
    async with websockets.connect(uri) as websocket:
        print("WebSocket 已连接")
```

```bash [Bash]
# 使用 wscat 工具测试连接
wscat -c ws://127.0.0.1:18789/v1/connect
```

:::

### 步骤 2：发送握手消息

连接建立后，客户端需要发送握手消息以完成认证和版本协商。

```json
{
  "minProtocol": 1,
  "maxProtocol": 3,
  "client": {
    "id": "my-app-v1",
    "displayName": "My Custom Client",
    "version": "1.0.0",
    "platform": "web",
    "mode": "operator",
    "instanceId": "unique-instance-id"
  },
  "caps": [],
  "commands": [],
  "auth": {
    "token": "your-token-here"
  }
}
```

**为什么**：握手消息告诉服务器：
- 客户端支持的协议版本范围
- 客户端的基本信息
- 认证凭证（token 或 password）

**你应该看到**：服务器返回 `hello-ok` 消息

```json
{
  "type": "hello-ok",
  "protocol": 3,
  "server": {
    "version": "v2026.1.24",
    "commit": "abc123",
    "host": "my-mac",
    "connId": "conn-123456"
  },
  "features": {
    "methods": ["agent", "send", "chat.send", ...],
    "events": ["agent.event", "chat.event", ...]
  },
  "snapshot": {
    "presence": [...],
    "health": {...},
    "stateVersion": {...},
    "uptimeMs": 12345678
  },
  "auth": {
    "deviceToken": "device-token-here",
    "role": "operator",
    "scopes": ["operator.read", "operator.write"]
  },
  "policy": {
    "maxPayload": 1048576,
    "maxBufferedBytes": 10485760,
    "tickIntervalMs": 30000
  }
}
```

::: info Hello-Ok 字段说明
- `protocol`：服务端使用的协议版本
- `server.version`：Gateway 版本号
- `features.methods`：所有可用方法列表
- `features.events`：所有可订阅事件列表
- `snapshot`：当前状态快照
- `auth.scopes`：客户端被授予的权限作用域
- `policy.maxPayload`：单个消息的最大大小
- `policy.tickIntervalMs`：心跳间隔
:::

### 步骤 3：验证连接状态

握手成功后，你可以发送健康检查请求验证连接：

```json
{
  "type": "req",
  "id": "req-1",
  "method": "health",
  "params": {}
}
```

**你应该看到**：

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "status": "ok",
    "uptimeMs": 12345678
  }
}
```

## 消息帧格式

### 请求帧（Request Frame）

客户端发送的所有请求都遵循请求帧格式：

```json
{
  "type": "req",
  "id": "unique-request-id",
  "method": "method.name",
  "params": {
    // 方法参数
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|--- | --- | --- | ---|
| `type` | string | 是 | 固定值 `"req"` |
| `id` | string | 是 | 请求唯一标识符，用于匹配响应 |
| `method` | string | 是 | 方法名称，如 `"agent"`、`"send"` |
| `params` | object | 否 | 方法参数，具体格式取决于方法 |

::: warning 请求 ID 的重要性
每个请求必须有唯一的 `id`。服务器使用 `id` 将响应与请求关联。如果多个请求使用相同的 `id`，响应将无法正确匹配。
:::

### 响应帧（Response Frame）

服务器对每个请求返回响应帧：

```json
{
  "type": "res",
  "id": "unique-request-id",
  "ok": true,
  "payload": {
    // 响应数据
  },
  "error": {
    // 错误信息（仅当 ok=false 时）
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|--- | --- | --- | ---|
| `type` | string | 是 | 固定值 `"res"` |
| `id` | string | 是 | 对应的请求 ID |
| `ok` | boolean | 是 | 请求是否成功 |
| `payload` | any | 否 | 成功时的响应数据 |
| `error` | object | 否 | 失败时的错误信息 |

**成功响应示例**：

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "agents": [
      { "id": "agent-1", "name": "Default Agent" }
    ]
  }
}
```

**失败响应示例**：

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: message",
    "retryable": false
  }
}
```

### 事件帧（Event Frame）

服务器可以主动推送事件，无需客户端请求：

```json
{
  "type": "event",
  "event": "event.name",
  "payload": {
    // 事件数据
  },
  "seq": 123,
  "stateVersion": {
    "presence": 456,
    "health": 789
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|--- | --- | --- | ---|
| `type` | string | 是 | 固定值 `"event"` |
| `event` | string | 是 | 事件名称 |
| `payload` | any | 否 | 事件数据 |
| `seq` | number | 否 | 事件序列号 |
| `stateVersion` | object | 否 | 状态版本号 |

**常见事件示例**：

```json
// 心跳事件
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}

// Agent 事件
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "思考中..."
    }
  }
}

// 聊天事件
{
  "type": "event",
  "event": "chat.event",
  "payload": {
    "runId": "run-123",
    "sessionKey": "main",
    "seq": 1,
    "state": "delta",
    "message": {
      "role": "assistant",
      "content": "你好！"
    }
  }
}

// 关机事件
{
  "type": "event",
  "event": "shutdown",
  "payload": {
    "reason": "系统重启",
    "restartExpectedMs": 5000
  }
}
```

## 认证与权限

### 认证方式

Gateway 支持三种认证方式：

#### 1. Token 认证（推荐）

在握手消息中提供 token：

```json
{
  "auth": {
    "token": "your-security-token"
  }
}
```

Token 在配置文件中定义：

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secret-token-here"
    }
  }
}
```

#### 2. Password 认证

```json
{
  "auth": {
    "password": "your-password"
  }
}
```

Password 在配置文件中定义：

```json
{
  "gateway": {
    "auth": {
      "mode": "password",
      "password": "your-password-here"
    }
  }
}
```

#### 3. Tailscale Identity（网络认证）

当使用 Tailscale Serve/Funnel 时，可以通过 Tailscale Identity 认证：

```json
{
  "client": {
    "mode": "operator"
  },
  "device": {
    "id": "device-id",
    "publicKey": "public-key",
    "signature": "signature",
    "signedAt": 1706707200000
  }
}
```

### 权限作用域（Scopes）

客户端在握手后会获得一组权限作用域，决定其可调用的方法：

| 作用域 | 权限 | 可用方法 |
|--- | --- | ---|
| `operator.admin` | 管理员 | 所有方法，包括配置修改、Wizard、更新等 |
| `operator.write` | 写入 | 发送消息、调用 Agent、修改会话等 |
| `operator.read` | 只读 | 查询状态、日志、配置等 |
| `operator.approvals` | 审批 | Exec 审批相关方法 |
| `operator.pairing` | 配对 | 节点和设备配对相关方法 |

::: info 权限检查
服务器在每个请求时都会检查权限。如果客户端缺少必要权限，请求将被拒绝：

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "missing scope: operator.admin"
  }
}
```
:::

### 角色系统

除了作用域，协议还支持角色系统：

| 角色 | 说明 | 特殊权限 |
|--- | --- | ---|
| `operator` | 操作员 | 可调用所有 Operator 方法 |
| `node` | 设备节点 | 仅可调用 Node 专属方法 |
| `device` | 设备 | 可调用设备相关方法 |

节点角色在设备配对时自动分配，用于设备节点与 Gateway 的通信。

## 核心方法参考

### Agent 方法

#### `agent` - 发送消息到 Agent

发送消息到 AI Agent 并获取流式响应。

```json
{
  "type": "req",
  "id": "req-1",
  "method": "agent",
  "params": {
    "message": "你好，请帮我写一个 Hello World",
    "agentId": "default",
    "sessionId": "main",
    "idempotencyKey": "msg-123"
  }
}
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|--- | --- | --- | ---|
| `message` | string | 是 | 用户消息内容 |
| `agentId` | string | 否 | Agent ID，默认使用配置的默认 Agent |
| `sessionId` | string | 否 | 会话 ID |
| `sessionKey` | string | 否 | 会话键 |
| `to` | string | 否 | 发送目标（渠道） |
| `channel` | string | 否 | 渠道名称 |
| `accountId` | string | 否 | 账户 ID |
| `thinking` | string | 否 | 思考内容 |
| `deliver` | boolean | 否 | 是否发送到渠道 |
| `attachments` | array | 否 | 附件列表 |
| `timeout` | number | 否 | 超时时间（毫秒） |
| `lane` | string | 否 | 调度通道 |
| `extraSystemPrompt` | string | 否 | 额外系统提示 |
| `idempotencyKey` | string | 是 | 幂等键，防止重复 |

**响应**：

Agent 响应通过事件帧流式推送：

```json
// thinking 事件
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "正在思考..."
    }
  }
}

// message 事件
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 1,
    "stream": "message",
    "ts": 1706707200000,
    "data": {
      "role": "assistant",
      "content": "你好！这是一个 Hello World..."
    }
  }
}
```

#### `agent.wait` - 等待 Agent 完成

等待 Agent 任务完成。

```json
{
  "type": "req",
  "id": "req-2",
  "method": "agent.wait",
  "params": {
    "runId": "run-123",
    "timeoutMs": 30000
  }
}
```

### Send 方法

#### `send` - 发送消息到渠道

发送消息到指定的渠道。

```json
{
  "type": "req",
  "id": "req-3",
  "method": "send",
  "params": {
    "to": "+1234567890",
    "message": "Hello from Clawdbot!",
    "channel": "whatsapp",
    "idempotencyKey": "send-123"
  }
}
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|--- | --- | --- | ---|
| `to` | string | 是 | 接收者标识（手机号、用户 ID 等） |
| `message` | string | 是 | 消息内容 |
| `mediaUrl` | string | 否 | 媒体 URL |
| `mediaUrls` | array | 否 | 媒体 URL 列表 |
| `channel` | string | 否 | 渠道名称 |
| `accountId` | string | 否 | 账户 ID |
| `sessionKey` | string | 否 | 会话键（用于镜像输出） |
| `idempotencyKey` | string | 是 | 幂等键 |

### Poll 方法

#### `poll` - 创建投票

创建投票并发送到渠道。

```json
{
  "type": "req",
  "id": "req-4",
  "method": "poll",
  "params": {
    "to": "+1234567890",
    "question": "你喜欢的编程语言是什么？",
    "options": ["Python", "JavaScript", "Go", "Rust"],
    "maxSelections": 1,
    "durationHours": 24,
    "channel": "telegram",
    "idempotencyKey": "poll-123"
  }
}
```

### Sessions 方法

#### `sessions.list` - 列出会话

列出所有活跃会话。

```json
{
  "type": "req",
  "id": "req-5",
  "method": "sessions.list",
  "params": {
    "limit": 50,
    "activeMinutes": 60,
    "includeDerivedTitles": true,
    "includeLastMessage": true
  }
}
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|--- | --- | --- | ---|
| `limit` | number | 否 | 最大返回数量 |
| `activeMinutes` | number | 否 | 筛选最近活跃的会话（分钟） |
| `includeGlobal` | boolean | 否 | 包含全局会话 |
| `includeUnknown` | boolean | 否 | 包含未知会话 |
| `includeDerivedTitles` | boolean | 否 | 从第一行消息推导标题 |
| `includeLastMessage` | boolean | 否 | 包含最后一条消息预览 |
| `label` | string | 否 | 按标签筛选 |
| `agentId` | string | 否 | 按 Agent ID 筛选 |
| `search` | string | 否 | 搜索关键词 |

#### `sessions.patch` - 修改会话配置

修改会话的配置参数。

```json
{
  "type": "req",
  "id": "req-6",
  "method": "sessions.patch",
  "params": {
    "key": "main",
    "label": "Main Session",
    "thinkingLevel": "minimal",
    "responseUsage": "tokens",
    "model": "claude-sonnet-4-20250514"
  }
}
```

#### `sessions.reset` - 重置会话

清空会话历史。

```json
{
  "type": "req",
  "id": "req-7",
  "method": "sessions.reset",
  "params": {
    "key": "main"
  }
}
```

#### `sessions.delete` - 删除会话

删除会话及其历史。

```json
{
  "type": "req",
  "id": "req-8",
  "method": "sessions.delete",
  "params": {
    "key": "session-123",
    "deleteTranscript": true
  }
}
```

#### `sessions.compact` - 压缩会话历史

压缩会话历史以减少上下文大小。

```json
{
  "type": "req",
  "id": "req-9",
  "method": "sessions.compact",
  "params": {
    "key": "main",
    "maxLines": 100
  }
}
```

### Config 方法

#### `config.get` - 获取配置

获取当前配置。

```json
{
  "type": "req",
  "id": "req-10",
  "method": "config.get",
  "params": {}
}
```

#### `config.set` - 设置配置

设置新配置。

```json
{
  "type": "req",
  "id": "req-11",
  "method": "config.set",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash"
  }
}
```

#### `config.apply` - 应用配置并重启

应用配置并重启 Gateway。

```json
{
  "type": "req",
  "id": "req-12",
  "method": "config.apply",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash",
    "restartDelayMs": 1000
  }
}
```

#### `config.schema` - 获取配置 Schema

获取配置的 Schema 定义。

```json
{
  "type": "req",
  "id": "req-13",
  "method": "config.schema",
  "params": {}
}
```

### Channels 方法

#### `channels.status` - 获取渠道状态

获取所有渠道的状态。

```json
{
  "type": "req",
  "id": "req-14",
  "method": "channels.status",
  "params": {
    "probe": true,
    "timeoutMs": 5000
  }
}
```

**响应示例**：

```json
{
  "type": "res",
  "id": "req-14",
  "ok": true,
  "payload": {
    "ts": 1706707200000,
    "channelOrder": ["whatsapp", "telegram", "slack"],
    "channelLabels": {
      "whatsapp": "WhatsApp",
      "telegram": "Telegram",
      "slack": "Slack"
    },
    "channelAccounts": {
      "whatsapp": [
        {
          "accountId": "wa-123",
          "enabled": true,
          "linked": true,
          "connected": true,
          "lastConnectedAt": 1706707200000
        }
      ]
    }
  }
}
```

#### `channels.logout` - 登出渠道

登出指定渠道。

```json
{
  "type": "req",
  "id": "req-15",
  "method": "channels.logout",
  "params": {
    "channel": "whatsapp",
    "accountId": "wa-123"
  }
}
```

### Models 方法

#### `models.list` - 列出可用模型

列出所有可用的 AI 模型。

```json
{
  "type": "req",
  "id": "req-16",
  "method": "models.list",
  "params": {}
}
```

**响应示例**：

```json
{
  "type": "res",
  "id": "req-16",
  "ok": true,
  "payload": {
    "models": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "provider": "anthropic",
        "contextWindow": 200000,
        "reasoning": true
      },
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "provider": "openai",
        "contextWindow": 128000,
        "reasoning": false
      }
    ]
  }
}
```

### Agents 方法

#### `agents.list` - 列出所有 Agent

列出所有可用的 Agent。

```json
{
  "type": "req",
  "id": "req-17",
  "method": "agents.list",
  "params": {}
}
```

**响应示例**：

```json
{
  "type": "res",
  "id": "req-17",
  "ok": true,
  "payload": {
    "defaultId": "default",
    "mainKey": "main",
    "scope": "per-sender",
    "agents": [
      {
        "id": "default",
        "name": "Default Agent",
        "identity": {
          "name": "Clawdbot",
          "theme": "default",
          "emoji": "🤖"
        }
      }
    ]
  }
}
```

### Cron 方法

#### `cron.list` - 列出定时任务

列出所有定时任务。

```json
{
  "type": "req",
  "id": "req-18",
  "method": "cron.list",
  "params": {
    "includeDisabled": true
  }
}
```

#### `cron.add` - 添加定时任务

添加新的定时任务。

```json
{
  "type": "req",
  "id": "req-19",
  "method": "cron.add",
  "params": {
    "name": "每日报告",
    "description": "每天早上 8 点生成日报",
    "enabled": true,
    "schedule": {
      "kind": "cron",
      "expr": "0 8 * * *",
      "tz": "Asia/Shanghai"
    },
    "sessionTarget": "main",
    "wakeMode": "now",
    "payload": {
      "kind": "agentTurn",
      "message": "请生成今日工作日报",
      "channel": "last"
    }
  }
}
```

#### `cron.run` - 手动运行定时任务

手动运行指定的定时任务。

```json
{
  "type": "req",
  "id": "req-20",
  "method": "cron.run",
  "params": {
    "id": "cron-123",
    "mode": "force"
  }
}
```

### Nodes 方法

#### `nodes.list` - 列出所有节点

列出所有已配对的设备节点。

```json
{
  "type": "req",
  "id": "req-21",
  "method": "nodes.list",
  "params": {}
}
```

#### `nodes.describe` - 获取节点详情

获取指定节点的详细信息。

```json
{
  "type": "req",
  "id": "req-22",
  "method": "nodes.describe",
  "params": {
    "nodeId": "ios-node-123"
  }
}
```

#### `nodes.invoke` - 调用节点命令

在节点上执行命令。

```json
{
  "type": "req",
  "id": "req-23",
  "method": "nodes.invoke",
  "params": {
    "nodeId": "ios-node-123",
    "command": "camera.snap",
    "params": {
      "quality": "high"
    },
    "timeoutMs": 10000,
    "idempotencyKey": "invoke-123"
  }
}
```

#### `nodes.pair.list` - 列出待配对的节点

列出所有等待配对的节点请求。

```json
{
  "type": "req",
  "id": "req-24",
  "method": "nodes.pair.list",
  "params": {}
}
```

#### `nodes.pair.approve` - 批准节点配对

批准节点配对请求。

```json
{
  "type": "req",
  "id": "req-25",
  "method": "nodes.pair.approve",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.pair.reject` - 拒绝节点配对

拒绝节点配对请求。

```json
{
  "type": "req",
  "id": "req-26",
  "method": "nodes.pair.reject",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.rename` - 重命名节点

重命名节点。

```json
{
  "type": "req",
  "id": "req-27",
  "method": "nodes.rename",
  "params": {
    "nodeId": "ios-node-123",
    "displayName": "My iPhone"
  }
}
```

### Logs 方法

#### `logs.tail` - 获取日志

获取 Gateway 日志。

```json
{
  "type": "req",
  "id": "req-28",
  "method": "logs.tail",
  "params": {
    "cursor": 0,
    "limit": 100,
    "maxBytes": 100000
  }
}
```

**响应示例**：

```json
{
  "type": "res",
  "id": "req-28",
  "ok": true,
  "payload": {
    "file": "/path/to/gateway.log",
    "cursor": 123456,
    "size": 4567890,
    "lines": [
      "[2025-01-27 10:00:00] INFO: Starting Gateway...",
      "[2025-01-27 10:00:01] INFO: Connected to WhatsApp"
    ],
    "truncated": false
  }
}
```

### Skills 方法

#### `skills.status` - 获取技能状态

获取所有技能的状态。

```json
{
  "type": "req",
  "id": "req-29",
  "method": "skills.status",
  "params": {}
}
```

#### `skills.bins` - 列出技能库

列出可用的技能库。

```json
{
  "type": "req",
  "id": "req-30",
  "method": "skills.bins",
  "params": {}
}
```

#### `skills.install` - 安装技能

安装指定的技能。

```json
{
  "type": "req",
  "id": "req-31",
  "method": "skills.install",
  "params": {
    "name": "my-custom-skill",
    "installId": "install-123",
    "timeoutMs": 60000
  }
}
```

### WebChat 方法

#### `chat.send` - 发送聊天消息（WebChat）

WebChat 专用聊天方法。

```json
{
  "type": "req",
  "id": "req-32",
  "method": "chat.send",
  "params": {
    "sessionKey": "main",
    "message": "Hello from WebChat!",
    "thinking": "正在回复...",
    "deliver": true,
    "idempotencyKey": "chat-123"
  }
}
```

#### `chat.history` - 获取聊天历史

获取指定会话的历史消息。

```json
{
  "type": "req",
  "id": "req-33",
  "method": "chat.history",
  "params": {
    "sessionKey": "main",
    "limit": 50
  }
}
```

#### `chat.abort` - 中止聊天

中止正在进行的聊天。

```json
{
  "type": "req",
  "id": "req-34",
  "method": "chat.abort",
  "params": {
    "sessionKey": "main",
    "runId": "run-123"
  }
}
```

### Wizard 方法

#### `wizard.start` - 启动向导

启动配置向导。

```json
{
  "type": "req",
  "id": "req-35",
  "method": "wizard.start",
  "params": {}
}
```

#### `wizard.next` - 向导下一步

执行向导的下一步。

```json
{
  "type": "req",
  "id": "req-36",
  "method": "wizard.next",
  "params": {
    "stepId": "step-1",
    "response": {
      "selectedOption": "option-1"
    }
  }
}
```

#### `wizard.cancel` - 取消向导

取消正在进行的向导。

```json
{
  "type": "req",
  "id": "req-37",
  "method": "wizard.cancel",
  "params": {}
}
```

### System 方法

#### `status` - 获取系统状态

获取 Gateway 系统状态。

```json
{
  "type": "req",
  "id": "req-38",
  "method": "status",
  "params": {}
}
```

#### `last-heartbeat` - 获取最后心跳时间

获取 Gateway 最后一次心跳时间。

```json
{
  "type": "req",
  "id": "req-39",
  "method": "last-heartbeat",
  "params": {}
}
```

### Usage 方法

#### `usage.status` - 获取使用统计

获取 Token 使用统计。

```json
{
  "type": "req",
  "id": "req-40",
  "method": "usage.status",
  "params": {}
}
```

#### `usage.cost` - 获取成本统计

获取 API 调用成本统计。

```json
{
  "type": "req",
  "id": "req-41",
  "method": "usage.cost",
  "params": {}
}
```

## 错误处理

### 错误码

所有错误响应都包含错误码和描述：

| 错误码 | 说明 | 可重试 |
|--- | --- | ---|
| `NOT_LINKED` | 节点未链接 | 是 |
| `NOT_PAIRED` | 节点未配对 | 否 |
| `AGENT_TIMEOUT` | Agent 超时 | 是 |
| `INVALID_REQUEST` | 请求无效 | 否 |
| `UNAVAILABLE` | 服务不可用 | 是 |

### 错误响应格式

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "AGENT_TIMEOUT",
    "message": "Agent response timeout",
    "retryable": true,
    "retryAfterMs": 5000
  }
}
```

### 错误处理建议

1. **检查 `retryable` 字段**：如果为 `true`，可以按 `retryAfterMs` 延迟后重试
2. **记录错误详情**：记录 `code` 和 `message` 以便调试
3. **验证参数**：`INVALID_REQUEST` 通常表示参数验证失败
4. **检查连接状态**：`NOT_LINKED` 表示连接已断开，需要重新连接

## 心跳机制

Gateway 会定期发送心跳事件：

```json
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}
```

::: tip 心跳处理
客户端应：
1. 监听 `tick` 事件
2. 更新最后心跳时间
3. 如果超过 `3 * tickIntervalMs` 未收到心跳，考虑重连
:::

## 完整示例

### JavaScript 客户端示例

```javascript
const WebSocket = require('ws');

class GatewayClient {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.on('open', () => {
        // 发送握手消息
        this.sendHandshake();
        resolve();
      });

      this.ws.on('message', (data) => {
        this.handleMessage(JSON.parse(data));
      });

      this.ws.on('error', (error) => {
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket 已断开');
      });
    });
  }

  sendHandshake() {
    this.ws.send(JSON.stringify({
      minProtocol: 1,
      maxProtocol: 3,
      client: {
        id: 'my-client',
        displayName: 'My Gateway Client',
        version: '1.0.0',
        platform: 'node',
        mode: 'operator'
      },
      auth: {
        token: this.token
      }
    }));
  }

  async request(method, params = {}) {
    const id = `req-${++this.requestId}`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      this.ws.send(JSON.stringify({
        type: 'req',
        id,
        method,
        params
      }));

      // 设置超时
      setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('请求超时'));
      }, 30000);
    });
  }

  handleMessage(message) {
    if (message.type === 'res') {
      const { id, ok, payload, error } = message;
      const pending = this.pendingRequests.get(id);
      
      if (pending) {
        this.pendingRequests.delete(id);
        if (ok) {
          pending.resolve(payload);
        } else {
          pending.reject(new Error(`${error.code}: ${error.message}`));
        }
      }
    } else if (message.type === 'event') {
      this.handleEvent(message);
    }
  }

  handleEvent(event) {
    console.log('收到事件:', event.event, event.payload);
  }

  async sendAgentMessage(message) {
    return this.request('agent', {
      message,
      idempotencyKey: `msg-${Date.now()}`
    });
  }

  async listSessions() {
    return this.request('sessions.list', {
      limit: 50,
      includeLastMessage: true
    });
  }

  async getChannelsStatus() {
    return this.request('channels.status', {
      probe: true
    });
  }
}

// 使用示例
(async () => {
  const client = new GatewayClient('ws://127.0.0.1:18789/v1/connect', 'your-token');
  await client.connect();

  // 发送消息到 Agent
  const response = await client.sendAgentMessage('你好！');
  console.log('Agent 响应:', response);

  // 列出会话
  const sessions = await client.listSessions();
  console.log('会话列表:', sessions);

  // 获取渠道状态
  const channels = await client.getChannelsStatus();
  console.log('渠道状态:', channels);
})();
```

## 本课小结

本教程详细介绍了 Clawdbot Gateway WebSocket API 协议，包括：

- ✅ 连接握手流程和认证机制
- ✅ 三种消息帧类型（请求、响应、事件）
- ✅ 核心方法参考（Agent、Send、Sessions、Config 等）
- ✅ 权限系统和角色管理
- ✅ 错误处理和重试策略
- ✅ 心跳机制和连接管理
- ✅ 完整的 JavaScript 客户端示例

## 下一课预告

> 下一课我们学习 **[完整配置参考](../config-reference/)**。
>
> 你会学到：
> - 所有配置项的详细说明
> - 配置 Schema 和默认值
> - 环境变量替换机制
> - 配置验证和错误处理

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 协议入口和验证器 | `src/gateway/protocol/index.ts` | 1-521 |
| 基本帧类型定义 | `src/gateway/protocol/schema/frames.ts` | 1-165 |
| 协议版本定义 | `src/gateway/protocol/schema/protocol-schemas.ts` | 231 |
| 错误码定义 | `src/gateway/protocol/schema/error-codes.ts` | 3-24 |
| Agent 相关 Schema | `src/gateway/protocol/schema/agent.ts` | 1-107 |
| Chat/Logs Schema | `src/gateway/protocol/schema/logs-chat.ts` | 1-83 |
| Sessions Schema | `src/gateway/protocol/schema/sessions.ts` | 1-105 |
| Config Schema | `src/gateway/protocol/schema/config.ts` | 1-72 |
| Nodes Schema | `src/gateway/protocol/schema/nodes.ts` | 1-103 |
| Cron Schema | `src/gateway/protocol/schema/cron.ts` | 1-246 |
| Channels Schema | `src/gateway/protocol/schema/channels.ts` | 1-108 |
| Models/Agents/Skills Schema | `src/gateway/protocol/schema/agents-models-skills.ts` | 1-86 |
| 请求处理器 | `src/gateway/server-methods.ts` | 1-200 |
| 权限验证逻辑 | `src/gateway/server-methods.ts` | 91-144 |
| 状态快照定义 | `src/gateway/protocol/schema/snapshot.ts` | 1-58 |

**关键常量**：
- `PROTOCOL_VERSION = 3`：当前协议版本
- `ErrorCodes`：错误码枚举（NOT_LINKED、NOT_PAIRED、AGENT_TIMEOUT、INVALID_REQUEST、UNAVAILABLE）

**关键类型**：
- `GatewayFrame`：网关帧联合类型（RequestFrame | ResponseFrame | EventFrame）
- `RequestFrame`：请求帧类型
- `ResponseFrame`：响应帧类型
- `EventFrame`：事件帧类型
- `HelloOk`：握手成功响应类型
- `ErrorShape`：错误形状类型

</details>
