---
title: "API 参考 - WebSocket 与 HTTP 接口 | OpenClaw 教程"
sidebarTitle: "API 参考"
subtitle: "API 参考 - WebSocket 与 HTTP 接口"
description: "OpenClaw Gateway API 完整参考文档，包括 WebSocket 控制接口、HTTP API 和 OpenAI 兼容接口。"
tags:
  - "API"
  - "WebSocket"
  - "HTTP"
  - "参考"
order: 190
---

# API 参考 - WebSocket 与 HTTP 接口

## 学完你能做什么

完成本课程后，你将能够：
- 使用 WebSocket API 与 Gateway 实时通信
- 调用 HTTP API 进行程序化操作
- 使用 OpenAI 兼容接口
- 开发自定义客户端集成

## 认证

所有 API 请求都需要认证。

### Token 认证（推荐）

```bash
# HTTP Header
Authorization: Bearer <your-token>

# WebSocket
wss://gateway:18789?token=<your-token>
```

### Password 认证

```bash
# HTTP Header
Authorization: Basic <base64(user:password)>
X-OpenClaw-Password: <password>

# WebSocket
wss://gateway:18789?password=<password>
```

## WebSocket API

WebSocket 是 OpenClaw 的主要控制通道，提供实时双向通信。

### 连接

```javascript
const ws = new WebSocket('wss://gateway:18789', [], {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

ws.onopen = () => {
  console.log('Connected to Gateway');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### 事件类型

#### 1. 连接事件

```json
{
  "type": "connected",
  "data": {
    "clientId": "uuid",
    "gatewayVersion": "2026.2.13",
    "capabilities": ["chat", "channels", "browser"]
  }
}
```

#### 2. 发送消息

```json
// 客户端发送
{
  "method": "chat.run",
  "params": {
    "message": "Hello, AI!",
    "sessionKey": "session-123",
    "options": {
      "thinking": "medium",
      "stream": true
    }
  },
  "id": 1
}

// Gateway 响应
{
  "type": "chat.delta",
  "data": {
    "sessionKey": "session-123",
    "delta": "Hello!",
    "runId": "run-456"
  }
}
```

#### 3. 接收流式响应

```json
{
  "type": "chat.delta",
  "data": {
    "sessionKey": "session-123",
    "delta": " How can I help?",
    "runId": "run-456"
  }
}

{
  "type": "chat.done",
  "data": {
    "sessionKey": "session-123",
    "runId": "run-456",
    "usage": {
      "promptTokens": 10,
      "completionTokens": 20,
      "totalTokens": 30
    }
  }
}
```

#### 4. 工具调用事件

```json
{
  "type": "tool.call",
  "data": {
    "runId": "run-456",
    "tool": "browser_navigate",
    "params": {
      "url": "https://example.com"
    }
  }
}

{
  "type": "tool.result",
  "data": {
    "runId": "run-456",
    "tool": "browser_navigate",
    "result": {
      "success": true,
      "url": "https://example.com"
    }
  }
}
```

#### 5. 心跳事件

```json
{
  "type": "heartbeat",
  "data": {
    "timestamp": 1707830400000,
    "status": "ok"
  }
}
```

### WebSocket 方法

| 方法 | 说明 | 参数 |
|------|------|------|
| `chat.run` | 运行聊天 | `message`, `sessionKey`, `options` |
| `chat.abort` | 中止运行 | `runId` |
| `session.list` | 列会话 | - |
| `session.get` | 获取会话 | `sessionKey` |
| `channel.list` | 列频道 | - |
| `channel.status` | 频道状态 | `channelId` |
| `browser.screenshot` | 浏览器截图 | `selector`, `fullPage` |
| `system.status` | 系统状态 | - |

## HTTP API

### 基础信息

- **Base URL**: `http://localhost:18789` 或 `https://gateway:18789`
- **Content-Type**: `application/json`
- **认证**: Header 或 Query 参数

### 端点

#### 1. 状态检查

```bash
GET /status

# 响应
{
  "status": "ok",
  "version": "2026.2.13",
  "uptime": 3600,
  "gateway": {
    "port": 18789,
    "bind": "127.0.0.1",
    "auth": "token"
  },
  "channels": {
    "whatsapp": "connected",
    "telegram": "connected",
    "discord": "not_configured"
  }
}
```

#### 2. 运行 Agent

```bash
POST /v1/agent/run
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "Hello, AI!",
  "sessionKey": "session-123",
  "agentId": "default",
  "options": {
    "thinking": "medium",
    "model": "anthropic/claude-3-5-sonnet"
  }
}

# 响应
{
  "runId": "run-456",
  "sessionKey": "session-123",
  "response": "Hello! How can I help you today?",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 15,
    "totalTokens": 25
  }
}
```

#### 3. 流式响应

```bash
POST /v1/agent/run/stream
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "Hello",
  "sessionKey": "session-123",
  "stream": true
}

# 响应 (SSE)
event: delta
data: {"delta": "Hello", "runId": "run-456"}

event: delta
data: {"delta": "!", "runId": "run-456"}

event: done
data: {"runId": "run-456", "finishReason": "stop"}
```

#### 4. 会话管理

```bash
# 列会话
GET /v1/sessions

# 响应
{
  "sessions": [
    {
      "sessionKey": "session-123",
      "agentId": "default",
      "channel": "whatsapp",
      "createdAt": "2024-02-14T10:00:00Z",
      "updatedAt": "2024-02-14T10:30:00Z",
      "messageCount": 25
    }
  ]
}

# 获取会话详情
GET /v1/sessions/session-123

# 删除会话
DELETE /v1/sessions/session-123
```

#### 5. 频道管理

```bash
# 列频道
GET /v1/channels

# 响应
{
  "channels": [
    {
      "id": "whatsapp",
      "name": "WhatsApp",
      "enabled": true,
      "status": "connected",
      "account": "+86138xxxxxxxx"
    },
    {
      "id": "telegram",
      "name": "Telegram",
      "enabled": true,
      "status": "connected",
      "botUsername": "@mybot"
    }
  ]
}

# 频道操作
POST /v1/channels/{id}/enable
POST /v1/channels/{id}/disable
GET /v1/channels/{id}/status
```

#### 6. 浏览器控制

```bash
# 获取浏览器状态
GET /v1/browser/status

# 截图
POST /v1/browser/screenshot
{
  "selector": "body",
  "fullPage": true
}

# 打开页面
POST /v1/browser/navigate
{
  "url": "https://example.com",
  "profile": "default"
}
```

## OpenAI 兼容 API

OpenClaw 提供与 OpenAI API 兼容的接口，可以无缝替换 OpenAI 客户端。

### Chat Completions

```bash
POST /v1/chat/completions
Authorization: Bearer <token>

{
  "model": "anthropic/claude-3-5-sonnet",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "stream": false,
  "temperature": 0.7,
  "max_tokens": 1000
}

# 响应
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1707830400,
  "model": "anthropic/claude-3-5-sonnet",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 10,
    "total_tokens": 30
  }
}
```

### 使用 OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:18789/v1",
    api_key="your-openclaw-token"
)

response = client.chat.completions.create(
    model="anthropic/claude-3-5-sonnet",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)
```

### 模型列表

```bash
GET /v1/models

# 响应
{
  "object": "list",
  "data": [
    {
      "id": "anthropic/claude-3-5-sonnet",
      "object": "model",
      "created": 1707830400,
      "owned_by": "anthropic"
    },
    {
      "id": "openai/gpt-4o",
      "object": "model",
      "created": 1707830400,
      "owned_by": "openai"
    }
  ]
}
```

## 错误处理

### 错误响应格式

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Invalid session key",
    "type": "client_error",
    "param": "sessionKey"
  }
}
```

### 错误码

| HTTP 码 | 错误码 | 说明 |
|---------|--------|------|
| 400 | `invalid_request` | 请求参数错误 |
| 401 | `unauthorized` | 认证失败 |
| 403 | `forbidden` | 权限不足 |
| 404 | `not_found` | 资源不存在 |
| 429 | `rate_limited` | 请求过于频繁 |
| 500 | `internal_error` | 服务器内部错误 |
| 503 | `service_unavailable` | 服务不可用 |

## 代码示例

### JavaScript/TypeScript

```typescript
import { OpenClawClient } from 'openclaw-client';

const client = new OpenClawClient({
  baseUrl: 'http://localhost:18789',
  token: 'your-token'
});

// 发送消息
const response = await client.agent.run({
  message: 'Hello!',
  sessionKey: 'session-123'
});

console.log(response);
```

### Python

```python
import requests

BASE_URL = "http://localhost:18789"
HEADERS = {"Authorization": "Bearer your-token"}

# 发送消息
response = requests.post(
    f"{BASE_URL}/v1/agent/run",
    headers=HEADERS,
    json={
        "message": "Hello!",
        "sessionKey": "session-123"
    }
)

data = response.json()
print(data["response"])
```

### cURL

```bash
# 发送消息
curl -X POST http://localhost:18789/v1/agent/run \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "sessionKey": "session-123"
  }'

# 流式响应
curl -X POST http://localhost:18789/v1/agent/run/stream \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "sessionKey": "session-123"
  }'
```

## API 限制

| 限制 | 值 | 说明 |
|------|-----|------|
| 请求大小 | 10MB | 最大请求体大小 |
| 超时 | 300s | 默认请求超时 |
| 并发 | 10 | 默认最大并发连接 |
| 速率 | 100/min | 默认速率限制 |

## 本课小结

在本课程中，你学习了：

- ✅ WebSocket API 的使用方法
- ✅ HTTP API 的所有端点
- ✅ OpenAI 兼容接口
- ✅ 认证方式和错误处理
- ✅ 多语言代码示例
- ✅ API 限制和最佳实践

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 说明 |
|------|----------|------|
| HTTP API | [`src/gateway/openresponses-http.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/openresponses-http.ts) | HTTP 端点 |
| WebSocket 方法 | [`src/gateway/server-methods.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-methods.ts) | WS 方法 |
| WebSocket 列表 | [`src/gateway/server-methods-list.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-methods-list.ts) | 方法定义 |
| OpenAI 兼容 | [`src/gateway/openresponses-http.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/openresponses-http.ts) | 兼容层 |
| Schema | [`src/gateway/open-responses.schema.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/open-responses.schema.ts) | API Schema |

**API 端点**：
- `/status` - 状态检查
- `/v1/agent/run` - 运行 Agent
- `/v1/sessions/*` - 会话管理
- `/v1/channels/*` - 频道管理
- `/v1/browser/*` - 浏览器控制
- `/v1/chat/completions` - OpenAI 兼容
- `/v1/models` - 模型列表

</details>

---

## 课程总结

恭喜！你已经完成了 OpenClaw 全部 17 门课程的学习！

### 学习路径回顾

**入门阶段**：
1. 入门指南 (onboard)
2. Gateway 快速启动 (gateway-quickstart)
3. 发送第一条消息 (first-message) ← 你在这里开始
4. 配置基础 (configuration-basics)

**平台集成**：
5. 消息频道概览 (channels-overview)
6. WhatsApp 集成 (whatsapp-setup)
7. Telegram 集成 (telegram-setup)
8. Slack 与 Discord 集成 (slack-discord-setup)
9. 其他频道配置 (other-channels)

**进阶主题**：
10. 模型配置 (models-configuration)
11. 浏览器控制 (browser-control)
12. 技能系统 (skills-system)
13. 定时任务 (cron-automation)
14. Tailscale 远程访问 (tailscale-remote)

**常见问题与附录**：
15. 故障排查 (troubleshooting)
16. 安全指南 (security-guide)
17. CLI 命令参考 (commands-reference)
18. 架构设计 (architecture)
19. API 参考 (api-reference)

### 下一步

- 🚀 部署你的 OpenClaw 实例
- 🔧 开发自定义技能
- 🌐 贡献代码到开源项目
- 💬 加入社区交流
