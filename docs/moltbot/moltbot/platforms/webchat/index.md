---
title: "WebChat Interface: AI Assistant in Your Browser | Clawdbot Tutorial"
sidebarTitle: "WebChat Interface"
subtitle: "WebChat Interface: AI Assistant in Your Browser"
description: "Learn how to use Clawdbot's built-in WebChat interface to chat with your AI assistant. This tutorial covers WebChat access methods, core features (session management, file uploads, Markdown support), and remote access configuration (SSH tunneling, Tailscale), without requiring additional ports or separate configuration."
tags:
  - "WebChat"
  - "browser interface"
  - "chat"
prerequisite:
  - "start-gateway-startup"
order: 150
---

# WebChat Interface: AI Assistant in Your Browser

## What You'll Learn

After completing this tutorial, you will be able to:

- ✅ Access the WebChat interface via browser
- ✅ Send messages and receive AI responses in WebChat
- ✅ Manage conversation history and switch between sessions
- ✅ Upload attachments (images, audio, video)
- ✅ Configure remote access (Tailscale/SSH tunnel)
- ✅ Understand the differences between WebChat and other channels

## Your Current Challenge

You may have already started Gateway, but want a more intuitive graphical interface to chat with your AI assistant instead of using just the command line.

You might be wondering:

- "Is there a web interface similar to ChatGPT?"
- "What's the difference between WebChat and WhatsApp/Telegram channels?"
- "Does WebChat require separate configuration?"
- "How do I use WebChat on a remote server?"

The good news is: **WebChat is Clawdbot's built-in chat interface**—no separate installation or configuration required. It's ready to use once Gateway is started.

## When to Use This

When you need:

- 🖥️ **Graphical Interface**: Prefer a browser-based chat experience over command line
- 📊 **Session Management**: View history and switch between different conversations
- 🌐 **Local Access**: Chat with AI on the same device
- 🔄 **Remote Access**: Access remote Gateway via SSH/Tailscale tunnel
- 💬 **Rich Text Interaction**: Support for Markdown formatting and attachments

---

## 🎒 Prerequisites

Before using WebChat, please confirm:

### Required Conditions

| Condition | How to Check |
|--- | ---|
| **Gateway Started** | `clawdbot gateway status` or check if the process is running |
| **Port Accessible** | Confirm port 18789 (or custom port) is not in use |
| **AI Model Configured** | `clawdbot models list` to see available models |

::: warning Prerequisite Courses
This tutorial assumes you have completed:
- [Quick Start](../../start/getting-started/) - Install, configure, and start Clawdbot
- [Starting Gateway](../../start/gateway-startup/) - Understand different Gateway startup modes

If not completed yet, please return to these courses first.
:::

### Optional: Configure Authentication

WebChat requires authentication by default (even for local access) to protect your AI assistant.

Quick check:

```bash
## View current authentication configuration
clawdbot config get gateway.auth.mode
clawdbot config get gateway.auth.token
```

If not configured, it's recommended to set it up:

```bash
## Set token authentication (recommended)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here
```

For detailed information: [Gateway Authentication Configuration](../../advanced/security-sandbox/).

---

## Core Concepts

### What is WebChat

**WebChat** is Clawdbot's built-in chat interface that interacts directly with the AI assistant via Gateway WebSocket.

**Key Features**:

```
┌─────────────────────────────────────────────────────┐
│              WebChat Architecture                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Browser/Client                                     │
│      │                                              │
│      ▼                                              │
│  Gateway WebSocket (ws://127.0.0.1:18789)          │
│      │                                              │
│      ├─ chat.send → Agent → Process message       │
│      ├─ chat.history → Return session history      │
│      ├─ chat.inject → Add system note              │
│      └─ Event stream → Real-time updates            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Differences from Other Channels**:

| Feature | WebChat | WhatsApp/Telegram, etc. |
|--- | --- | ---|
| **Access Method** | Browser directly accesses Gateway | Requires third-party APP and login |
| **Configuration Requirements** | No separate configuration, shares Gateway port | Requires channel-specific API Key/Token |
| **Reply Routing** | Deterministic routing back to WebChat | Routes to corresponding channel |
| **Remote Access** | Via SSH/Tailscale tunnel | Remote access provided by channel platform |
| **Session Model** | Uses Gateway's session management | Uses Gateway's session management |

### How WebChat Works

WebChat doesn't require a separate HTTP server or port configuration—it uses Gateway's WebSocket service directly.

**Key Points**:
- **Shared Port**: WebChat uses the same port as Gateway (default 18789)
- **No Extra Configuration**: No dedicated `webchat.*` configuration block
- **Real-time Sync**: History is fetched from Gateway in real-time, not cached locally
- **Read-Only Mode**: WebChat becomes read-only if Gateway is unreachable

::: info WebChat vs Control UI
WebChat focuses on the chat experience, while **Control UI** provides a complete Gateway control panel (configuration, session management, skill management, etc.).

- WebChat: `http://localhost:18789/chat` or chat view in macOS app
- Control UI: `http://localhost:18789/` complete control panel
:::

---

## Follow Along

### Step 1: Access WebChat

**Why**
WebChat is Gateway's built-in chat interface—no additional software installation needed.

#### Method 1: Browser Access

Open a browser and visit:

```bash
## Default address (using default port 18789)
http://localhost:18789

## Or use loopback address (more reliable)
http://127.0.0.1:18789
```

**You should see**:
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat                   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  [Session List]  [Settings]      │   │
│  └───────────────────────────────────┘   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  Hello! I'm your AI assistant.    │   │
│  │  How can I help you today?        │   │
│  └───────────────────────────────────┘   │
│                                             │
│  [Type your message...]          [Send]   │
└─────────────────────────────────────────────┘
```

#### Method 2: macOS App

If you've installed the Clawdbot macOS menu bar app:

1. Click the menu bar icon
2. Select "Open WebChat" or click the chat icon
3. WebChat opens in a separate window

**Advantages**:
- Native macOS experience
- Keyboard shortcut support
- Integration with Voice Wake and Talk Mode

#### Method 3: Command Line Shortcut

```bash
## Automatically open browser to WebChat
clawdbot web
```

**You should see**: Default browser opens automatically and navigates to `http://localhost:18789`

---

### Step 2: Send Your First Message

**Why**
Verify that WebChat is properly connected to Gateway and that the AI assistant can respond correctly.

1. Type your first message in the input box
2. Click the "Send" button or press `Enter`
3. Observe the chat interface response

**Example Message**:
```
Hello! I'm testing WebChat. Can you introduce yourself?
```

**You should see**:
```
┌─────────────────────────────────────────────┐
│  You → AI: Hello! I'm testing...      │
│                                             │
│  AI → You: Hello! I'm the Clawdbot AI    │
│  assistant. I can help you answer        │
│  questions, write code, manage tasks, etc.│
│  How can I help you today?              │
│                                             │
│  [Type your message...]          [Send]   │
└─────────────────────────────────────────────┘
```

::: tip Authentication Prompt
If Gateway is configured with authentication, you'll be prompted for a token or password when accessing WebChat:

```
┌─────────────────────────────────────────────┐
│          Gateway Authentication             │
│                                             │
│  Please enter Token:                       │
│  [•••••••••••••]              │
│                                             │
│              [Cancel]  [Login]             │
└─────────────────────────────────────────────┘
```

Enter the `gateway.auth.token` or `gateway.auth.password` you configured.
:::

---

### Step 3: Use WebChat Features

**Why**
WebChat provides rich interactive features—familiarizing yourself with them will enhance your experience.

#### Session Management

WebChat supports multi-session management, allowing you to chat with AI in different contexts.

**Steps**:

1. Click the session list on the left (or "New Session" button)
2. Select or create a new session
3. Continue the conversation in the new session

**Session Features**:
- ✅ **Independent Context**: Each session's message history is isolated
- ✅ **Auto-save**: All sessions are managed by Gateway with persistent storage
- ✅ **Cross-Platform Sync**: Shares the same session data with CLI, macOS app, and iOS/Android nodes

::: info Main Session
WebChat uses Gateway's **main session key** (`main`) by default, meaning all clients (CLI, WebChat, macOS app, iOS/Android nodes) share the same main session history.

If you need isolated contexts, you can set different session keys in the configuration.
:::

#### File Uploads

WebChat supports uploading attachments like images, audio, and video.

**Steps**:

1. Click the "Attachment" icon next to the input box (usually 📎 or 📎️)
2. Select the file to upload (or drag the file to the chat area)
3. Type relevant text description
4. Click "Send"

**Supported Formats**:
- 📷 **Images**: JPEG, PNG, GIF
- 🎵 **Audio**: MP3, WAV, M4A
- 🎬 **Video**: MP4, MOV
- 📄 **Documents**: PDF, TXT, etc. (depends on Gateway configuration)

**You should see**:
```
┌─────────────────────────────────────────────┐
│  You → AI: Please analyze this image       │
│  [📎 photo.jpg]                            │
│                                             │
│  AI → You: I can see this is...            │
│  [Analysis result...]                       │
└─────────────────────────────────────────────┘
```

::: warning File Size Limits
WebChat and Gateway have size limits for uploaded files (usually a few MB). If upload fails, check the file size or Gateway's media configuration.
:::

#### Markdown Support

WebChat supports Markdown formatting, allowing you to format your messages.

**Example**:

```markdown
# Heading
## Subheading
- List item 1
- List item 2

**Bold** and *italic*
`code`
```

**Preview Effect**:
```
# Heading
## Subheading
- List item 1
- List item 2

**Bold** and *italic*
`code`
```

#### Command Shortcuts

WebChat supports slash commands for quick execution of specific actions.

**Common Commands**:

| Command | Function |
|--- | ---|
| `/new` | Create a new session |
| `/reset` | Reset current session history |
| `/clear` | Clear all messages in current session |
| `/status` | Display Gateway and channel status |
| `/models` | List available AI models |
| `/help` | Display help information |

**Usage Example**:

```
/new
## Creates a new session

/reset
## Resets current session
```

---

### Step 4 (Optional): Configure Remote Access

**Why**
If you're running Gateway on a remote server, or want to access WebChat from other devices, you need to configure remote access.

#### Access via SSH Tunnel

**Use Case**: Gateway is on a remote server, and you want to access WebChat from your local machine.

**Steps**:

1. Establish an SSH tunnel to map the remote Gateway port to local:

```bash
## Map remote port 18789 to local port 18789
ssh -L 18789:localhost:18789 user@your-remote-server.com
```

2. Keep the SSH connection open (or use `-N` parameter to not execute remote commands)

3. Access from local browser: `http://localhost:18789`

**You should see**: Same WebChat interface as local access

::: tip Maintaining SSH Tunnel
SSH tunnels become invalid when the connection is disconnected. If you need persistent access:

- Use `autossh` for automatic reconnection
- Configure `LocalForward` in SSH Config
- Use systemd/launchd to auto-start the tunnel
:::

#### Access via Tailscale

**Use Case**: Using Tailscale to build a private network, with Gateway and client on the same tailnet.

**Configuration Steps**:

1. Enable Tailscale Serve or Funnel on the Gateway machine:

```bash
## Edit configuration file
clawdbot config set gateway.tailscale.mode serve
## Or
clawdbot config set gateway.tailscale.mode funnel
```

2. Restart Gateway

```bash
## Restart Gateway to apply configuration
clawdbot gateway restart
```

3. Get Gateway's Tailscale address

```bash
## View status (will display Tailscale URL)
clawdbot gateway status
```

4. Access from client device (same tailnet):

```
http://<gateway-tailscale-name>.tailnet-<tailnet-id>.ts.net:18789
```

::: info Tailscale Serve vs Funnel
- **Serve**: Accessible only within tailnet, more secure
- **Funnel**: Publicly accessible to the internet, requires `gateway.auth` protection

Recommended to use Serve mode unless you need internet access.
:::

#### Remote Access Authentication

Whether using SSH tunnel or Tailscale, if Gateway is configured with authentication, you still need to provide a token or password.

**Check Authentication Configuration**:

```bash
## View authentication mode
clawdbot config get gateway.auth.mode

## If token mode, confirm token is set
clawdbot config get gateway.auth.token
```

---

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Access WebChat in browser (`http://localhost:18789`)
- [ ] Send messages and receive AI responses
- [ ] Use session management features (create, switch, reset sessions)
- [ ] Upload attachments and have AI analyze them
- [ ] (Optional) Access WebChat remotely via SSH tunnel
- [ ] (Optional) Access WebChat via Tailscale

::: tip Verify Connection
If WebChat cannot be accessed or message sending fails, check:

1. Is Gateway running: `clawdbot gateway status`
2. Is port correct: Confirm accessing `http://127.0.0.1:18789` (not `localhost:18789`)
3. Is authentication configured: `clawdbot config get gateway.auth.*`
4. View detailed logs: `clawdbot gateway --verbose`
:::

---

## Common Pitfalls

### ❌ Gateway Not Started

**Wrong Approach**:
```
Directly access http://localhost:18789
## Result: Connection failed or cannot load
```

**Correct Approach**:
```bash
## Start Gateway first
clawdbot gateway --port 18789

## Then access WebChat
open http://localhost:18789
```

::: warning Gateway Must Be Started First
WebChat depends on Gateway's WebSocket service. Without a running Gateway, WebChat cannot work properly.
:::

### ❌ Wrong Port Configuration

**Wrong Approach**:
```
Access http://localhost:8888
## Gateway is actually running on port 18789
## Result: Connection refused
```

**Correct Approach**:
```bash
## 1. View Gateway's actual port
clawdbot config get gateway.port

## 2. Access with correct port
open http://localhost:<gateway.port>
```

### ❌ Missing Authentication Configuration

**Wrong Approach**:
```
gateway.auth.mode or token not set
## Result: WebChat prompts authentication failure
```

**Correct Approach**:
```bash
## Set token authentication (recommended)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here

## Restart Gateway
clawdbot gateway restart

## Enter token when accessing WebChat
```

### ❌ Remote Access Not Configured

**Wrong Approach**:
```
Directly access remote server IP from local
http://remote-server-ip:18789
## Result: Connection timeout (firewall blocking)
```

**Correct Approach**:
```bash
## Use SSH tunnel
ssh -L 18789:localhost:18789 user@remote-server.com

## Or use Tailscale Serve
clawdbot config set gateway.tailscale.mode serve
clawdbot gateway restart

## Access from local browser
http://localhost:18789
```

---

## Summary

In this lesson you learned:

1. ✅ **WebChat Introduction**: Built-in chat interface based on Gateway WebSocket, no separate configuration needed
2. ✅ **Access Methods**: Browser access, macOS app, command line shortcut
3. ✅ **Core Features**: Session management, file uploads, Markdown support, slash commands
4. ✅ **Remote Access**: Access remote Gateway via SSH tunnel or Tailscale
5. ✅ **Authentication Configuration**: Understanding Gateway authentication modes (token/password/Tailscale)
6. ✅ **Troubleshooting**: Common issues and solutions

**Key Concept Review**:

- WebChat uses the same port as Gateway, no separate HTTP server needed
- History is managed by Gateway, synced in real-time, not cached locally
- WebChat becomes read-only if Gateway is unreachable
- Replies are deterministically routed back to WebChat, different from other channels

**Next Steps**:

- Explore [macOS App](../macos-app/) to learn about menu bar control and Voice Wake
- Learn about [iOS Node](../ios-node/) to configure mobile devices for local operations
- Understand [Canvas Visual Interface](../../advanced/canvas/) to experience AI-driven visual workspace

---

## Coming Up Next

> In the next lesson, we'll learn about **[macOS App](../macos-app/)**.
>
> You'll learn:
> - macOS menu bar app features and layout
> - Voice Wake and Talk Mode usage
> - Integration between WebChat and macOS app
> - Debugging tools and remote Gateway control

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Lines |
|--- | --- | ---|
| WebChat principle explanation | [`docs/web/webchat.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/web/webchat.md) | Full file |
| Gateway WebSocket API | [`src/gateway/protocol/`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/) | Full directory |
| chat.send method | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380 |
| chat.history method | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 1-295 |
| chat.inject method | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 381-450 |
| Web UI entry | [`ui/index.html`](https://github.com/clawdbot/clawdbot/blob/main/ui/index.html) | 1-15 |
| Gateway authentication configuration | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-100 |
| Tailscale integration | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | Full file |
| macOS WebChat integration | [`apps/macos/`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/) | Full directory |

**Key Constants**:
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: WebChat internal message channel identifier (from `src/utils/message-channel.ts:17`)

**Key Configuration Items**:
- `gateway.port`: WebSocket port (default 18789)
- `gateway.auth.mode`: Authentication mode (token/password/tailscale)
- `gateway.auth.token`: Token value for token authentication
- `gateway.auth.password`: Password value for password authentication
- `gateway.tailscale.mode`: Tailscale mode (serve/funnel/disabled)
- `gateway.remote.url`: WebSocket address of remote Gateway
- `gateway.remote.token`: Remote Gateway authentication token
- `gateway.remote.password`: Remote Gateway authentication password

**Key WebSocket Methods**:
- `chat.send(message)`: Send message to Agent (from `src/gateway/server-methods/chat.ts`)
- `chat.history(sessionId)`: Get session history (from `src/gateway/server-methods/chat.ts`)
- `chat.inject(message)`: Directly inject system note into session, bypassing Agent (from `src/gateway/server-methods/chat.ts`)

**Architecture Characteristics**:
- WebChat doesn't need a separate HTTP server or port configuration
- Uses the same port as Gateway (default 18789)
- History is fetched from Gateway in real-time, not cached locally
- Replies are deterministically routed back to WebChat (different from other channels)

</details>
