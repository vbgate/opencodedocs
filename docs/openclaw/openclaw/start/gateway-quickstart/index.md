---
title: "Gateway Quickstart: Launch Your AI Assistant in 5 Minutes | OpenClaw"
sidebarTitle: "Launch Gateway"
subtitle: "Gateway Quickstart: Launch Your AI Assistant Service in 5 Minutes"
description: "Learn how to start the OpenClaw Gateway service, understand the WebSocket control plane concept, master session management and channel configuration, and get your AI assistant running within 5 minutes."
tags:
  - "gateway"
  - "websocket"
  - "quickstart"
prerequisite:
  - "start-onboard"
order: 20
---

# Gateway Quickstart: Launch Your AI Assistant Service

::: info What You'll Learn
By completing this tutorial, you will be able to:
- Understand the Gateway's core architecture and WebSocket control plane concept
- Start and configure the Gateway service using CLI
- Protect Gateway access with Token or Password authentication
- Manage the lifecycle of multiple channels (WhatsApp, Telegram, Slack, etc.)
- Interact with Gateway using WebSocket clients
- Enable secure remote access using Tailscale
:::

## Core Concepts

OpenClaw Gateway serves as the **central control plane** of the system, unifying the coordination of all AI sessions, messaging channels, tools, and events. Think of it as a traffic hub where all messages (from WhatsApp, Telegram, etc.) converge, are processed by Pi Agent, and responses are returned.

### Gateway Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                         │
│                   (ws://127.0.0.1:18789)                   │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Channels   │   Sessions   │    Tools     │   Control UI   │
│  (Channels)  │  (Sessions)  │   (Tools)    │  (Web UI)      │
├──────────────┴──────────────┴──────────────┴────────────────┤
│              Pi Agent Runtime (RPC Communication Layer)      │
└─────────────────────────────────────────────────────────────┘
         │                     │                     │
         ▼                     ▼                     ▼
   WhatsApp/Telegram     Browser/CDP          Mobile/Node
   Slack/Discord         Canvas/Shell         Devices
```

**Key Component Descriptions**:

| Component | Function | Source Location |
| --- | --- | --- |
| **WebSocket Server** | Unified control plane protocol | `src/gateway/server.impl.ts:157` |
| **HTTP API** | OpenAI-compatible interface | `src/gateway/openresponses-http.ts` |
| **Channel Manager** | Multi-channel lifecycle management | `src/gateway/server-channels.ts:64` |
| **Session Resolver** | Session key resolution and routing | `src/gateway/sessions-resolve.ts:18` |
| **Chat Handler** | Agent events and streaming responses | `src/gateway/server-chat.ts:220` |

### Default Port Configuration

| Service | Port | Description |
| --- | --- | --- |
| Gateway WebSocket/HTTP | `18789` | Main control plane port |
| Canvas Host | `18793` | Visualization interface service |
| Browser Control | Dynamically assigned | Chrome DevTools Protocol |

::: tip Port Conflict Resolution
If port 18789 is occupied, Gateway will attempt to increment the port. You can also specify a different port using the `--port` parameter.
:::

## Prerequisites

Before starting Gateway, please confirm:

1. ✅ Initial configuration with `openclaw onboard` is complete
2. ✅ Node.js version ≥ 22.12.0
3. ✅ Configuration file is located at `~/.openclaw/openclaw.json`
4. ✅ At least one AI model provider is configured (Anthropic/OpenAI)

**Quick Check Commands**:

```bash
# Check OpenClaw version
openclaw --version

# Verify configuration validity
openclaw doctor

# View Gateway port configuration
openclaw config get gateway.port

# View complete Gateway configuration
openclaw config get gateway
```

## Starting Gateway

### Method 1: Interactive Configuration (Recommended for First-Time Use)

Use the `openclaw config` command to launch the interactive configuration wizard:

```bash
# Launch full configuration wizard
openclaw config

# Or configure only Gateway-related sections
openclaw config --section gateway --section tailscale
```

The configuration wizard will guide you through the following settings:

| Configuration | Options | Description |
| --- | --- | --- |
| **Port** | Custom number | Default 18789 |
| **Bind Mode** | loopback / lan / tailnet / auto / custom | See detailed explanation below |
| **Auth Mode** | token / password | Token mode recommended |
| **Tailscale** | off / serve / funnel | Optional remote access |

**Bind Mode Details** (from `src/config/types.gateway.ts:249-268`):

| Mode | Bind Address | Use Case |
| --- | --- | --- |
| `loopback` | `127.0.0.1` | Local access only (most secure) |
| `lan` | `0.0.0.0` | Access within local network |
| `tailnet` | Tailscale IP | Access via Tailscale |
| `auto` | Auto-select | Prefer loopback, fall back to lan |
| `custom` | Custom IP | Specify a particular address |

### Method 2: Quick Start (With Existing Configuration)

```bash
# Start with default configuration
openclaw gateway

# Specify port and bind mode
openclaw gateway --port 8080 --bind loopback

# Run in foreground (view logs)
openclaw gateway --foreground
```

**You Should See**:

```
┌─────────────────────────────────────────┐
│  OpenClaw Gateway v2026.2.13            │
│  ✓ WebSocket: ws://127.0.0.1:18789     │
│  ✓ Control UI: http://127.0.0.1:18789  │
│  ✓ Auth: Token (mode: token)           │
│  ✓ Channels: 0 running                 │
└─────────────────────────────────────────┘
```

### Method 3: Programmatic Start

Reference: `src/gateway/server.impl.ts:157`:

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

// Shutdown Gateway
await server.close({ reason: "manual shutdown" });
```

## Configuration Details

### Gateway Configuration Structure

Configuration file path: `~/.openclaw/openclaw.json`

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

### Authentication Mode Comparison

Based on `src/config/types.gateway.ts:79-92`:

| Feature | Token Mode | Password Mode |
| --- | --- | --- |
| **Use Case** | Development/automation scripts | Multi-user sharing/remote access |
| **Security** | High (random string) | Medium (depends on password strength) |
| **Tailscale Funnel** | Not supported | Required |
| **CLI Usage** | `OPENCLAW_GATEWAY_TOKEN` | Interactive input |
| **Browser Access** | URL parameter or Header | Login form |

**Token Generation Recommendations** (from `src/commands/onboard-helpers.ts`):

```bash
# Generate a 64-character random token
openssl rand -hex 32

# Set environment variable
echo 'export OPENCLAW_GATEWAY_TOKEN="your-token"' >> ~/.zshrc
```

### Rate Limit Configuration

```json
{
  "gateway": {
    "auth": {
      "rateLimit": {
        "maxAttempts": 10,      // Max failed attempts within window
        "windowMs": 60000,      // Sliding window: 1 minute
        "lockoutMs": 300000,    // Lockout duration: 5 minutes
        "exemptLoopback": true  // Exempt local addresses
      }
    }
  }
}
```

::: warning Production Environment Recommendations
For Gateway exposed to the public internet, be sure to enable rateLimit and consider using TLS.
:::

## Session Management

### Session Concepts

OpenClaw uses **Sessions** to isolate context for different Agents. Each session contains:

- Conversation history
- Agent configuration
- Tool state
- Memory data

### Session Resolution Strategies

Based on `src/gateway/sessions-resolve.ts:18-139`:

| Identifier | Priority | Example |
| --- | --- | --- |
| `key` | Highest | `@alice/pi-main` |
| `sessionId` | Medium | `sess_abc123` |
| `label` | Low | `Work Assistant` |

### CLI Session Operations

```bash
# List all sessions
openclaw sessions list

# View session details
openclaw sessions preview --key @alice/pi-main

# Reset session (retain configuration, clear history)
openclaw sessions reset --key @alice/pi-main

# Delete session
openclaw sessions delete --key @alice/pi-main

# Compact session (reduce storage footprint)
openclaw sessions compact --key @alice/pi-main
```

### Session WebSocket API

```javascript
// List sessions
ws.send(JSON.stringify({
  method: "sessions.list",
  params: { includeGlobal: true }
}));

// Response format
{
  "sessions": [
    {
      "key": "@alice/pi-main",
      "sessionId": "pi-main",
      "agentId": "pi",
      "label": "Main Assistant",
      "messageCount": 42,
      "lastActiveAt": "2026-02-14T10:30:00Z"
    }
  ]
}
```

## Channel Management

### Channel Lifecycle

Based on `src/gateway/server-channels.ts:64-308` (ChannelManager):

```
Config Loading → Account Resolution → Account Startup → Runtime Monitoring → Stop/Restart
      │                │                  │                │                 │
      ▼                ▼                  ▼                ▼                 ▼
  loadConfig    resolveAccount     startAccount       runtime         stopAccount
```

### View Channel Status

```bash
# View status of all channels
openclaw channels status

# Deep probe (check connection health)
openclaw channels status --probe

# Start specific channel
openclaw channels start whatsapp

# Stop channel
openclaw channels stop telegram
```

**Status Output Example**:

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

### Channel Runtime State

Each channel account maintains the following runtime state (`ChannelAccountSnapshot`):

| Field | Type | Description |
| --- | --- | --- |
| `accountId` | string | Account identifier |
| `running` | boolean | Whether running |
| `connected` | boolean | Whether connected |
| `lastStartAt` | number | Last startup timestamp |
| `lastStopAt` | number | Last shutdown timestamp |
| `lastError` | string | Last error message |

## API Endpoint Details

### WebSocket Control Plane

Connection address: `ws://127.0.0.1:18789`

**Connection Flow**:

```javascript
const ws = new WebSocket('ws://127.0.0.1:18789');

// 1. Wait for connection challenge
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  
  if (msg.event === 'connect.challenge') {
    // 2. Send authentication response
    ws.send(JSON.stringify({
      method: 'auth',
      params: {
        token: 'your-gateway-token'  // or password
      }
    }));
  }
  
  if (msg.event === 'agent') {
    // Handle Agent event stream
    console.log('Agent event:', msg.data);
  }
};
```

### Gateway Method List

Based on `src/gateway/server-methods-list.ts:3-97`:

**Core Methods**:

| Method | Description |
| --- | --- |
| `health` | Health check |
| `status` | Complete status report |
| `channels.status` | Channel status query |
| `config.get/set` | Configuration read/write |
| `sessions.list/preview/patch` | Session management |
| `agents.list/create/update/delete` | Agent management |
| `skills.status/install/update` | Skill management |
| `cron.list/add/remove/run` | Scheduled tasks |
| `browser.request` | Browser control |

**Event Subscriptions** (`GATEWAY_EVENTS`):

| Event | Trigger Timing |
| --- | --- |
| `connect.challenge` | Connection authentication challenge |
| `agent` | Agent event stream |
| `chat` | Chat messages |
| `presence` | Online status changes |
| `health` | Health status updates |
| `node.pair.requested` | Node pairing request |
| `exec.approval.requested` | Execution approval request |

### HTTP API (OpenAI Compatible)

Based on `src/gateway/openresponses-http.ts`:

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

::: tip Enabling HTTP API
By default, the HTTP API is disabled and must be enabled in configuration:

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

## Best Practices

### 1. Security Configuration Checklist

```markdown
□ Use Token authentication instead of Password (unless Tailscale Funnel is needed)
□ Enable rateLimit to prevent brute force attacks
□ Use TLS in production (configure certPath/keyPath)
□ Limit trustedProxies to known reverse proxy IPs
□ Regularly rotate Gateway Token
```

### 2. Performance Optimization Recommendations

| Scenario | Recommendation |
| --- | --- |
| High concurrency | Increase `rateLimit.maxAttempts` and `windowMs` |
| Large file uploads | Adjust `http.endpoints.responses.maxBodyBytes` |
| Frequent restarts | Use `reload.mode: "hot"` for hot reloading |
| Multiple channels | Start channels on-demand, avoid running too many simultaneously |

### 3. Troubleshooting Workflow

```
Gateway won't start?
    │
    ├─→ Check port occupancy: lsof -i :18789
    │
    ├─→ Check configuration validity: openclaw doctor
    │
    ├─→ View detailed logs: openclaw gateway --foreground
    │
    └─→ Reset configuration: openclaw config reset
```

### 4. Production Deployment Recommendations

```bash
# Use systemd service (Linux)
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

## Checkpoints ✅

Complete the following verifications to ensure Gateway is running properly:

1. **Gateway Startup Check**:
   ```bash
   curl -H "Authorization: Bearer your-token" \
     http://127.0.0.1:18789/v1/health
   ```
   Expected return: `{"status":"ok"}`

2. **WebSocket Connection Check**:
   ```bash
   # Test using wscat
   wscat -c ws://127.0.0.1:18789 \
     -H "Authorization: Bearer your-token"
   ```

3. **Channel Status Check**:
   ```bash
   openclaw channels status --probe
   ```

## Lesson Summary

In this tutorial, you learned:

- **Gateway Architecture**: WebSocket control plane unifies Channels, Sessions, and Tools
- **Startup Methods**: Interactive configuration, CLI parameters, and programmatic startup
- **Authentication Mechanisms**: Token (recommended) and Password mode selection
- **Session Management**: Resolution strategies based on key/sessionId/label
- **Channel Lifecycle**: Complete flow from start → runtime → stop
- **API Interfaces**: WebSocket methods, HTTP OpenAI-compatible interface

::: info Next Step
Continue with **[Sending Your First Message](../first-message/)** to experience your first conversation with the AI assistant.
:::

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to Expand Source Locations</strong></summary>

> Last updated: 2026-02-14

| Function | File Path | Line |
| --- | --- | --- |
| Gateway config command | [`src/commands/configure.gateway.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/configure.gateway.ts) | 17-229 |
| Gateway server startup | [`src/gateway/server.impl.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server.impl.ts) | 157-673 |
| Channel manager | [`src/gateway/server-channels.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-channels.ts) | 64-308 |
| Session resolver | [`src/gateway/sessions-resolve.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/sessions-resolve.ts) | 18-139 |
| Chat event handler | [`src/gateway/server-chat.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-chat.ts) | 220-418 |
| Gateway method list | [`src/gateway/server-methods-list.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-methods-list.ts) | 3-119 |
| Gateway config types | [`src/config/types.gateway.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.gateway.ts) | 249-286 |
| WebSocket runtime | [`src/gateway/server-ws-runtime.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-ws-runtime.ts) | 9-53 |
| Auth config builder | [`src/commands/configure.gateway-auth.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/configure.gateway-auth.ts) | - |

**Key Constants**:
- `DEFAULT_GATEWAY_PORT = 18789`: Default Gateway port
- `DEFAULT_CANVAS_PORT = 18793`: Default Canvas host port

**Key Functions**:
- `startGatewayServer(port, opts)`: Gateway server entry point
- `createChannelManager(opts)`: Channel manager factory function
- `resolveSessionKeyFromResolveParams(params)`: Session key resolution
- `createAgentEventHandler(options)`: Agent event handler

</details>
