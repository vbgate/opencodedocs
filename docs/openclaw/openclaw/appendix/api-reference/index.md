---
title: "API Reference - WebSocket & HTTP Endpoints | OpenClaw Tutorial"
sidebarTitle: "API Reference"
subtitle: "API Reference - WebSocket & HTTP Endpoints"
description: "Complete reference for OpenClaw Gateway API, including WebSocket control interfaces, HTTP API, and OpenAI-compatible endpoints."
tags:
  - "API"
  - "WebSocket"
  - "HTTP"
  - "Reference"
order: 190
---

# API Reference - WebSocket & HTTP Endpoints

## What You'll Learn

By completing this course, you will be able to:
- Use the WebSocket API to communicate with Gateway in real-time
- Call HTTP APIs for programmatic operations
- Use OpenAI-compatible endpoints
- Develop custom client integrations

## Authentication

All API requests require authentication.

### Token Authentication (Recommended)

```bash
# HTTP Header
Authorization: Bearer <your-token>

# WebSocket
wss://gateway:18789?token=<your-token>
```

### Password Authentication

```bash
# HTTP Header
Authorization: Basic <base64(user:password)>
X-OpenClaw-Password: <password>

# WebSocket
wss://gateway:18789?password=<password>
```

## WebSocket API

WebSocket is OpenClaw's primary control channel, providing real-time bidirectional communication.

### Connection

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

### Event Types

#### 1. Connection Events

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

#### 2. Sending Messages

```json
// Client sends
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

// Gateway response
{
  "type": "chat.delta",
  "data": {
    "sessionKey": "session-123",
    "delta": "Hello!",
    "runId": "run-456"
  }
}
```

#### 3. Receiving Streaming Responses

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

#### 4. Tool Call Events

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

#### 5. Heartbeat Events

```json
{
  "type": "heartbeat",
  "data": {
    "timestamp": 1707830400000,
    "status": "ok"
  }
}
```

### WebSocket Methods

| Method | Description | Parameters |
| --- | --- | --- |
| `chat.run` | Run chat | `message`, `sessionKey`, `options` |
| `chat.abort` | Abort run | `runId` |
| `session.list` | List sessions | - |
| `session.get` | Get session | `sessionKey` |
| `channel.list` | List channels | - |
| `channel.status` | Channel status | `channelId` |
| `browser.screenshot` | Browser screenshot | `selector`, `fullPage` |
| `system.status` | System status | - |

## HTTP API

### Basic Info

- **Base URL**: `http://localhost:18789` or `https://gateway:18789`
- **Content-Type**: `application/json`
- **Authentication**: Header or Query parameters

### Endpoints

#### 1. Health Check

```bash
GET /status

# Response
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

#### 2. Run Agent

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

# Response
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

#### 3. Streaming Response

```bash
POST /v1/agent/run/stream
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "Hello",
  "sessionKey": "session-123",
  "stream": true
}

# Response (SSE)
event: delta
data: {"delta": "Hello", "runId": "run-456"}

event: delta
data: {"delta": "!", "runId": "run-456"}

event: done
data: {"runId": "run-456", "finishReason": "stop"}
```

#### 4. Session Management

```bash
# List sessions
GET /v1/sessions

# Response
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

# Get session details
GET /v1/sessions/session-123

# Delete session
DELETE /v1/sessions/session-123
```

#### 5. Channel Management

```bash
# List channels
GET /v1/channels

# Response
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

# Channel operations
POST /v1/channels/{id}/enable
POST /v1/channels/{id}/disable
GET /v1/channels/{id}/status
```

#### 6. Browser Control

```bash
# Get browser status
GET /v1/browser/status

# Screenshot
POST /v1/browser/screenshot
{
  "selector": "body",
  "fullPage": true
}

# Open page
POST /v1/browser/navigate
{
  "url": "https://example.com",
  "profile": "default"
}
```

## OpenAI Compatible API

OpenClaw provides interfaces compatible with OpenAI API, allowing seamless replacement of OpenAI clients.

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

# Response
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

### Using OpenAI SDK

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

### Models List

```bash
GET /v1/models

# Response
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

## Error Handling

### Error Response Format

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

### Error Codes

| HTTP Code | Error Code | Description |
| --- | --- | --- |
| 400 | `invalid_request` | Invalid request parameters |
| 401 | `unauthorized` | Authentication failed |
| 403 | `forbidden` | Insufficient permissions |
| 404 | `not_found` | Resource not found |
| 429 | `rate_limited` | Too many requests |
| 500 | `internal_error` | Internal server error |
| 503 | `service_unavailable` | Service unavailable |

## Code Examples

### JavaScript/TypeScript

```typescript
import { OpenClawClient } from 'openclaw-client';

const client = new OpenClawClient({
  baseUrl: 'http://localhost:18789',
  token: 'your-token'
});

// Send message
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

# Send message
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
# Send message
curl -X POST http://localhost:18789/v1/agent/run \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "sessionKey": "session-123"
  }'

# Streaming response
curl -X POST http://localhost:18789/v1/agent/run/stream \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "sessionKey": "session-123"
  }'
```

## API Limits

| Limit | Value | Description |
| --- | --- | --- |
| Request size | 10MB | Maximum request body size |
| Timeout | 300s | Default request timeout |
| Concurrency | 10 | Default max concurrent connections |
| Rate | 100/min | Default rate limit |

## Lesson Summary

In this course, you learned:

- ✅ How to use WebSocket APIs
- ✅ All HTTP API endpoints
- ✅ OpenAI-compatible interfaces
- ✅ Authentication methods and error handling
- ✅ Multi-language code examples
- ✅ API limits and best practices

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand and view source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Description |
| --- | --- | --- |
| HTTP API | [`src/gateway/openresponses-http.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/openresponses-http.ts) | HTTP endpoints |
| WebSocket Methods | [`src/gateway/server-methods.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-methods.ts) | WS methods |
| WebSocket List | [`src/gateway/server-methods-list.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-methods-list.ts) | Method definitions |
| OpenAI Compatible | [`src/gateway/openresponses-http.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/openresponses-http.ts) | Compatibility layer |
| Schema | [`src/gateway/open-responses.schema.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/open-responses.schema.ts) | API Schema |

**API Endpoints**:
- `/status` - Health check
- `/v1/agent/run` - Run Agent
- `/v1/sessions/*` - Session management
- `/v1/channels/*` - Channel management
- `/v1/browser/*` - Browser control
- `/v1/chat/completions` - OpenAI compatible
- `/v1/models` - Models list

</details>

---

## Course Summary

Congratulations! You have completed all 17 courses in OpenClaw!

### Learning Path Review

**Getting Started**:
1. Onboarding Guide (onboard)
2. Gateway Quick Start (gateway-quickstart)
3. Sending Your First Message (first-message) ← You started here
4. Configuration Basics (configuration-basics)

**Platform Integration**:
5. Messaging Channels Overview (channels-overview)
6. WhatsApp Integration (whatsapp-setup)
7. Telegram Integration (telegram-setup)
8. Slack & Discord Integration (slack-discord-setup)
9. Other Channel Configurations (other-channels)

**Advanced Topics**:
10. Model Configuration (models-configuration)
11. Browser Control (browser-control)
12. Skills System (skills-system)
13. Scheduled Tasks (cron-automation)
14. Tailscale Remote Access (tailscale-remote)

**Troubleshooting & Appendix**:
15. Troubleshooting (troubleshooting)
16. Security Guide (security-guide)
17. CLI Commands Reference (commands-reference)
18. Architecture Design (architecture)
19. API Reference (api-reference)

### Next Steps

- 🚀 Deploy your OpenClaw instance
- 🔧 Develop custom skills
- 🌐 Contribute code to the open-source project
- 💬 Join the community
