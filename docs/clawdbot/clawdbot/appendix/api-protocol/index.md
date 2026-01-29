---
title: "Gateway WebSocket API Protocol Complete Guide | Clawdbot Tutorial"
sidebarTitle: "API Protocol"
subtitle: "Gateway WebSocket API Protocol Complete Guide"
description: "Learn the complete Clawdbot Gateway WebSocket protocol specification, including connection handshake, message frame formats, request/response models, event pushing, permission system, and all available methods. This tutorial provides complete API reference and client integration examples to help you quickly implement custom client integration with Gateway."
tags:
  - "API"
  - "WebSocket"
  - "Protocol"
  - "Developer"
prerequisite:
  - "start-gateway-startup"
  - "advanced-session-management"
order: 350
---

# Gateway WebSocket API Protocol Complete Guide

## What You'll Learn

After completing this lesson, you will be able to:

- 📡 Successfully connect to the Gateway WebSocket server
- 🔄 Send requests and handle responses
- 📡 Receive server-pushed events
- 🔐 Understand the permission system and perform authentication
- 🛠️ Call all available Gateway methods
- 📖 Understand message frame formats and error handling

## Your Current Challenge

You may be developing a custom client (such as a mobile app, web app, or command-line tool) that needs to communicate with Clawdbot Gateway. The Gateway's WebSocket protocol seems complex, and you need to:

- Understand how to establish a connection and authenticate
- Understand request/response message formats
- Know the available methods and their parameters
- Handle server-pushed events
- Understand the permission system

**Good news**: The Gateway WebSocket API protocol is designed to be clear, and this tutorial will provide you with a complete reference guide.

## When to Use This

::: info Use Cases
Use this protocol when you need to:
- Develop custom clients to connect to Gateway
- Implement WebChat or mobile applications
- Create monitoring or management tools
- Integrate Gateway into existing systems
- Debug and test Gateway functionality
:::

## Core Concepts

Clawdbot Gateway uses the WebSocket protocol to provide real-time bidirectional communication. The protocol is based on JSON-formatted message frames, divided into three types:

1. **Request Frame**: Client sends a request
2. **Response Frame**: Server returns a response
3. **Event Frame**: Server actively pushes events

::: tip Design Philosophy
The protocol adopts a "request-response" model + "event push" mode:
- Clients actively initiate requests, and the server returns responses
- Servers can actively push events without client requests
- All operations are performed through a unified WebSocket connection
:::

## Connection Handshake

### Step 1: Establish WebSocket Connection

Gateway listens on `ws://127.0.0.1:18789` by default (configurable).

::: code-group

```javascript [JavaScript]
// Establish WebSocket connection
const ws = new WebSocket('ws://127.0.0.1:18789/v1/connect');

ws.onopen = () => {
  console.log('WebSocket connected');
};
```

```python [Python]
import asyncio
import websockets

async def connect():
    uri = "ws://127.0.0.1:18789/v1/connect"
    async with websockets.connect(uri) as websocket:
        print("WebSocket connected")
```

```bash [Bash]
# Use wscat tool to test connection
wscat -c ws://127.0.0.1:18789/v1/connect
```

:::

### Step 2: Send Handshake Message

After the connection is established, the client needs to send a handshake message to complete authentication and version negotiation.

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

**Why**: The handshake message tells the server:
- The protocol version range supported by the client
- Basic information about the client
- Authentication credentials (token or password)

**You should see**: Server returns `hello-ok` message

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

::: info Hello-Ok Field Descriptions
- `protocol`: Protocol version used by the server
- `server.version`: Gateway version number
- `features.methods`: List of all available methods
- `features.events`: List of all subscribable events
- `snapshot`: Current state snapshot
- `auth.scopes`: Permission scopes granted to the client
- `policy.maxPayload`: Maximum size of a single message
- `policy.tickIntervalMs`: Heartbeat interval
:::

### Step 3: Verify Connection Status

After successful handshake, you can send a health check request to verify the connection:

```json
{
  "type": "req",
  "id": "req-1",
  "method": "health",
  "params": {}
}
```

**You should see**:

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

## Message Frame Formats

### Request Frame

All requests sent by the client follow the request frame format:

```json
{
  "type": "req",
  "id": "unique-request-id",
  "method": "method.name",
  "params": {
    // Method parameters
  }
}
```

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `type` | string | Yes | Fixed value `"req"` |
| `id` | string | Yes | Unique request identifier, used to match responses |
| `method` | string | Yes | Method name, such as `"agent"`, `"send"` |
| `params` | object | No | Method parameters, specific format depends on the method |

::: warning Importance of Request ID
Each request must have a unique `id`. The server uses `id` to associate responses with requests. If multiple requests use the same `id`, responses will not be matched correctly.
:::

### Response Frame

The server returns a response frame for each request:

```json
{
  "type": "res",
  "id": "unique-request-id",
  "ok": true,
  "payload": {
    // Response data
  },
  "error": {
    // Error information (only when ok=false)
  }
}
```

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `type` | string | Yes | Fixed value `"res"` |
| `id` | string | Yes | Corresponding request ID |
| `ok` | boolean | Yes | Whether the request was successful |
| `payload` | any | No | Response data on success |
| `error` | object | No | Error information on failure |

**Success Response Example**:

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

**Failure Response Example**:

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

### Event Frame

The server can actively push events without client requests:

```json
{
  "type": "event",
  "event": "event.name",
  "payload": {
    // Event data
  },
  "seq": 123,
  "stateVersion": {
    "presence": 456,
    "health": 789
  }
}
```

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `type` | string | Yes | Fixed value `"event"` |
| `event` | string | Yes | Event name |
| `payload` | any | No | Event data |
| `seq` | number | No | Event sequence number |
| `stateVersion` | object | No | State version number |

**Common Event Examples**:

```json
// Heartbeat event
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}

// Agent event
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Thinking..."
    }
  }
}

// Chat event
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
      "content": "Hello!"
    }
  }
}

// Shutdown event
{
  "type": "event",
  "event": "shutdown",
  "payload": {
    "reason": "System restart",
    "restartExpectedMs": 5000
  }
}
```

## Authentication and Permissions

### Authentication Methods

Gateway supports three authentication methods:

#### 1. Token Authentication (Recommended)

Provide token in handshake message:

```json
{
  "auth": {
    "token": "your-security-token"
  }
}
```

Token is defined in the configuration file:

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

#### 2. Password Authentication

```json
{
  "auth": {
    "password": "your-password"
  }
}
```

Password is defined in the configuration file:

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

#### 3. Tailscale Identity (Network Authentication)

When using Tailscale Serve/Funnel, authentication can be performed through Tailscale Identity:

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

### Permission Scopes

After handshake, the client receives a set of permission scopes that determine which methods it can call:

| Scope | Permission | Available Methods |
|--- | --- | ---|
| `operator.admin` | Administrator | All methods, including configuration changes, Wizard, updates, etc. |
| `operator.write` | Write | Send messages, call Agents, modify sessions, etc. |
| `operator.read` | Read-only | Query status, logs, configuration, etc. |
| `operator.approvals` | Approval | Exec approval related methods |
| `operator.pairing` | Pairing | Node and device pairing related methods |

::: info Permission Check
The server checks permissions on every request. If the client lacks the necessary permission, the request will be rejected:

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

### Role System

In addition to scopes, the protocol also supports a role system:

| Role | Description | Special Permissions |
|--- | --- | ---|
| `operator` | Operator | Can call all Operator methods |
| `node` | Device Node | Can only call Node-specific methods |
| `device` | Device | Can call device-related methods |

Node roles are automatically assigned during device pairing and are used for communication between device nodes and Gateway.

## Core Method Reference

### Agent Methods

#### `agent` - Send message to Agent

Send a message to an AI Agent and get a streaming response.

```json
{
  "type": "req",
  "id": "req-1",
  "method": "agent",
  "params": {
    "message": "Hello, please help me write a Hello World",
    "agentId": "default",
    "sessionId": "main",
    "idempotencyKey": "msg-123"
  }
}
```

**Parameter Description**:

| Parameter | Type | Required | Description |
|--- | --- | --- | ---|
| `message` | string | Yes | User message content |
| `agentId` | string | No | Agent ID, defaults to the configured default Agent |
| `sessionId` | string | No | Session ID |
| `sessionKey` | string | No | Session key |
| `to` | string | No | Send target (channel) |
| `channel` | string | No | Channel name |
| `accountId` | string | No | Account ID |
| `thinking` | string | No | Thinking content |
| `deliver` | boolean | No | Whether to send to channel |
| `attachments` | array | No | Attachment list |
| `timeout` | number | No | Timeout (milliseconds) |
| `lane` | string | No | Dispatch channel |
| `extraSystemPrompt` | string | No | Extra system prompt |
| `idempotencyKey` | string | Yes | Idempotency key to prevent duplicates |

**Response**:

Agent responses are streamed via event frames:

```json
// thinking event
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Thinking..."
    }
  }
}

// message event
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
      "content": "Hello! This is a Hello World..."
    }
  }
}
```

#### `agent.wait` - Wait for Agent to complete

Wait for the Agent task to complete.

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

### Send Methods

#### `send` - Send message to channel

Send a message to a specified channel.

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

**Parameter Description**:

| Parameter | Type | Required | Description |
|--- | --- | --- | ---|
| `to` | string | Yes | Recipient identifier (phone number, user ID, etc.) |
| `message` | string | Yes | Message content |
| `mediaUrl` | string | No | Media URL |
| `mediaUrls` | array | No | Media URL list |
| `channel` | string | No | Channel name |
| `accountId` | string | No | Account ID |
| `sessionKey` | string | No | Session key (for mirroring output) |
| `idempotencyKey` | string | Yes | Idempotency key |

### Poll Methods

#### `poll` - Create poll

Create a poll and send it to a channel.

```json
{
  "type": "req",
  "id": "req-4",
  "method": "poll",
  "params": {
    "to": "+1234567890",
    "question": "What is your favorite programming language?",
    "options": ["Python", "JavaScript", "Go", "Rust"],
    "maxSelections": 1,
    "durationHours": 24,
    "channel": "telegram",
    "idempotencyKey": "poll-123"
  }
}
```

### Sessions Methods

#### `sessions.list` - List sessions

List all active sessions.

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

**Parameter Description**:

| Parameter | Type | Required | Description |
|--- | --- | --- | ---|
| `limit` | number | No | Maximum number to return |
| `activeMinutes` | number | No | Filter recently active sessions (minutes) |
| `includeGlobal` | boolean | No | Include global sessions |
| `includeUnknown` | boolean | No | Include unknown sessions |
| `includeDerivedTitles` | boolean | No | Derive titles from first message |
| `includeLastMessage` | boolean | No | Include last message preview |
| `label` | string | No | Filter by label |
| `agentId` | string | No | Filter by Agent ID |
| `search` | string | No | Search keyword |

#### `sessions.patch` - Modify session configuration

Modify session configuration parameters.

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

#### `sessions.reset` - Reset session

Clear session history.

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

#### `sessions.delete` - Delete session

Delete a session and its history.

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

#### `sessions.compact` - Compact session history

Compress session history to reduce context size.

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

### Config Methods

#### `config.get` - Get configuration

Get current configuration.

```json
{
  "type": "req",
  "id": "req-10",
  "method": "config.get",
  "params": {}
}
```

#### `config.set` - Set configuration

Set new configuration.

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

#### `config.apply` - Apply configuration and restart

Apply configuration and restart Gateway.

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

#### `config.schema` - Get configuration Schema

Get the Schema definition of configuration.

```json
{
  "type": "req",
  "id": "req-13",
  "method": "config.schema",
  "params": {}
}
```

### Channels Methods

#### `channels.status` - Get channel status

Get the status of all channels.

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

**Response Example**:

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

#### `channels.logout` - Logout from channel

Logout from a specified channel.

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

### Models Methods

#### `models.list` - List available models

List all available AI models.

```json
{
  "type": "req",
  "id": "req-16",
  "method": "models.list",
  "params": {}
}
```

**Response Example**:

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

### Agents Methods

#### `agents.list` - List all Agents

List all available Agents.

```json
{
  "type": "req",
  "id": "req-17",
  "method": "agents.list",
  "params": {}
}
```

**Response Example**:

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

### Cron Methods

#### `cron.list` - List scheduled tasks

List all scheduled tasks.

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

#### `cron.add` - Add scheduled task

Add a new scheduled task.

```json
{
  "type": "req",
  "id": "req-19",
  "method": "cron.add",
  "params": {
    "name": "Daily Report",
    "description": "Generate daily report at 8 AM every day",
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
      "message": "Please generate today's work report",
      "channel": "last"
    }
  }
}
```

#### `cron.run` - Manually run scheduled task

Manually run a specified scheduled task.

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

### Nodes Methods

#### `nodes.list` - List all nodes

List all paired device nodes.

```json
{
  "type": "req",
  "id": "req-21",
  "method": "nodes.list",
  "params": {}
}
```

#### `nodes.describe` - Get node details

Get detailed information about a specified node.

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

#### `nodes.invoke` - Invoke node command

Execute a command on a node.

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

#### `nodes.pair.list` - List pending pairings

List all node pairing requests waiting for approval.

```json
{
  "type": "req",
  "id": "req-24",
  "method": "nodes.pair.list",
  "params": {}
}
```

#### `nodes.pair.approve` - Approve node pairing

Approve a node pairing request.

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

#### `nodes.pair.reject` - Reject node pairing

Reject a node pairing request.

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

#### `nodes.rename` - Rename node

Rename a node.

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

### Logs Methods

#### `logs.tail` - Get logs

Get Gateway logs.

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

**Response Example**:

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

### Skills Methods

#### `skills.status` - Get skill status

Get the status of all skills.

```json
{
  "type": "req",
  "id": "req-29",
  "method": "skills.status",
  "params": {}
}
```

#### `skills.bins` - List skill bins

List available skill bins.

```json
{
  "type": "req",
  "id": "req-30",
  "method": "skills.bins",
  "params": {}
}
```

#### `skills.install` - Install skill

Install a specified skill.

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

### WebChat Methods

#### `chat.send` - Send chat message (WebChat)

WebChat-specific chat method.

```json
{
  "type": "req",
  "id": "req-32",
  "method": "chat.send",
  "params": {
    "sessionKey": "main",
    "message": "Hello from WebChat!",
    "thinking": "Replying...",
    "deliver": true,
    "idempotencyKey": "chat-123"
  }
}
```

#### `chat.history` - Get chat history

Get historical messages for a specified session.

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

#### `chat.abort` - Abort chat

Abort an ongoing chat.

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

### Wizard Methods

#### `wizard.start` - Start wizard

Start the configuration wizard.

```json
{
  "type": "req",
  "id": "req-35",
  "method": "wizard.start",
  "params": {}
}
```

#### `wizard.next` - Wizard next step

Execute the next step of the wizard.

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

#### `wizard.cancel` - Cancel wizard

Cancel an ongoing wizard.

```json
{
  "type": "req",
  "id": "req-37",
  "method": "wizard.cancel",
  "params": {}
}
```

### System Methods

#### `status` - Get system status

Get Gateway system status.

```json
{
  "type": "req",
  "id": "req-38",
  "method": "status",
  "params": {}
}
```

#### `last-heartbeat` - Get last heartbeat time

Get the last heartbeat time of Gateway.

```json
{
  "type": "req",
  "id": "req-39",
  "method": "last-heartbeat",
  "params": {}
}
```

### Usage Methods

#### `usage.status` - Get usage statistics

Get Token usage statistics.

```json
{
  "type": "req",
  "id": "req-40",
  "method": "usage.status",
  "params": {}
}
```

#### `usage.cost` - Get cost statistics

Get API call cost statistics.

```json
{
  "type": "req",
  "id": "req-41",
  "method": "usage.cost",
  "params": {}
}
```

## Error Handling

### Error Codes

All error responses include error codes and descriptions:

| Error Code | Description | Retryable |
|--- | --- | ---|
| `NOT_LINKED` | Node not linked | Yes |
| `NOT_PAIRED` | Node not paired | No |
| `AGENT_TIMEOUT` | Agent timeout | Yes |
| `INVALID_REQUEST` | Invalid request | No |
| `UNAVAILABLE` | Service unavailable | Yes |

### Error Response Format

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

### Error Handling Recommendations

1. **Check `retryable` field**: If `true`, retry after `retryAfterMs` delay
2. **Log error details**: Record `code` and `message` for debugging
3. **Validate parameters**: `INVALID_REQUEST` usually indicates parameter validation failure
4. **Check connection status**: `NOT_LINKED` indicates the connection is broken and needs reconnection

## Heartbeat Mechanism

Gateway periodically sends heartbeat events:

```json
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}
```

::: tip Heartbeat Handling
Clients should:
1. Listen to `tick` events
2. Update last heartbeat time
3. Consider reconnection if no heartbeat is received for `3 * tickIntervalMs`
:::

## Complete Example

### JavaScript Client Example

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
        // Send handshake message
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
        console.log('WebSocket disconnected');
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

      // Set timeout
      setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('Request timeout'));
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
    console.log('Event received:', event.event, event.payload);
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

// Usage example
(async () => {
  const client = new GatewayClient('ws://127.0.0.1:18789/v1/connect', 'your-token');
  await client.connect();

  // Send message to Agent
  const response = await client.sendAgentMessage('Hello!');
  console.log('Agent response:', response);

  // List sessions
  const sessions = await client.listSessions();
  console.log('Session list:', sessions);

  // Get channel status
  const channels = await client.getChannelsStatus();
  console.log('Channel status:', channels);
})();
```

## Summary

This tutorial detailed the Clawdbot Gateway WebSocket API protocol, including:

- ✅ Connection handshake process and authentication mechanism
- ✅ Three message frame types (request, response, event)
- ✅ Core method reference (Agent, Send, Sessions, Config, etc.)
- ✅ Permission system and role management
- ✅ Error handling and retry strategy
- ✅ Heartbeat mechanism and connection management
- ✅ Complete JavaScript client example

## Next Lesson

> In the next lesson, we'll learn **[Complete Configuration Reference](../config-reference/)**.
>
> You'll learn:
> - Detailed descriptions of all configuration items
> - Configuration Schema and default values
> - Environment variable replacement mechanism
> - Configuration validation and error handling

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Function | File Path | Lines |
|--- | --- | ---|
| Protocol entry and validators | `src/gateway/protocol/index.ts` | 1-521 |
| Basic frame type definitions | `src/gateway/protocol/schema/frames.ts` | 1-165 |
| Protocol version definitions | `src/gateway/protocol/schema/protocol-schemas.ts` | 231 |
| Error code definitions | `src/gateway/protocol/schema/error-codes.ts` | 3-24 |
| Agent related Schema | `src/gateway/protocol/schema/agent.ts` | 1-107 |
| Chat/Logs Schema | `src/gateway/protocol/schema/logs-chat.ts` | 1-83 |
| Sessions Schema | `src/gateway/protocol/schema/sessions.ts` | 1-105 |
| Config Schema | `src/gateway/protocol/schema/config.ts` | 1-72 |
| Nodes Schema | `src/gateway/protocol/schema/nodes.ts` | 1-103 |
| Cron Schema | `src/gateway/protocol/schema/cron.ts` | 1-246 |
| Channels Schema | `src/gateway/protocol/schema/channels.ts` | 1-108 |
| Models/Agents/Skills Schema | `src/gateway/protocol/schema/agents-models-skills.ts` | 1-86 |
| Request handlers | `src/gateway/server-methods.ts` | 1-200 |
| Permission validation logic | `src/gateway/server-methods.ts` | 91-144 |
| State snapshot definitions | `src/gateway/protocol/schema/snapshot.ts` | 1-58 |

**Key Constants**:
- `PROTOCOL_VERSION = 3`: Current protocol version
- `ErrorCodes`: Error code enumeration (NOT_LINKED, NOT_PAIRED, AGENT_TIMEOUT, INVALID_REQUEST, UNAVAILABLE)

**Key Types**:
- `GatewayFrame`: Gateway frame union type (RequestFrame | ResponseFrame | EventFrame)
- `RequestFrame`: Request frame type
- `ResponseFrame`: Response frame type
- `EventFrame`: Event frame type
- `HelloOk`: Handshake success response type
- `ErrorShape`: Error shape type

</details>
