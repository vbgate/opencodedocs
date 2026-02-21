---
title: "Other Channel Configurations - Signal, BlueBubbles, Teams, and More | OpenClaw Tutorial"
sidebarTitle: "Other Channel Configurations"
subtitle: "Other Channel Configurations - Signal, BlueBubbles, Teams, and More"
description: "Learn how to configure additional messaging channels including Signal, BlueBubbles, MS Teams, Matrix, Zalo, and more with this comprehensive integration guide."
tags:
  - "Signal"
  - "BlueBubbles"
  - "Teams"
  - "Matrix"
  - "Zalo"
order: 90
---

# Other Channel Configurations - Signal, BlueBubbles, Teams, and More

## What You'll Learn

After completing this tutorial, you'll be able to:
- Configure Signal, BlueBubbles, MS Teams, and other channels
- Understand the special requirements and limitations of each platform
- Choose the right communication platform for your needs
- Extend with custom channel support

## Supported Extension Channels

In addition to core channels, OpenClaw supports more platforms through extensions:

| Channel | Technology | Features | Installation |
| --- | --- | --- | --- |
| **Signal** | libsignal | High privacy, end-to-end encryption | Built-in |
| **BlueBubbles** | BlueBubbles API | iMessage bridge | Extension |
| **MS Teams** | Microsoft Graph | Enterprise integration | Extension |
| **Matrix** | Matrix JS SDK | Decentralized, federated | Extension |
| **Zalo** | Zalo API | Vietnam's mainstream platform | Extension |
| **IRC** | irc-framework | Classic protocol | Built-in |
| **Google Chat** | Google APIs | Google Workspace | Built-in |

## Signal Configuration

### Why Use Signal

- **Privacy First**: End-to-end encryption, open-source protocol
- **Security by Design**: Open-source code, community audited
- **Decentralized**: Not dependent on a single company

### Setup Steps

1. **Install Signal CLI** (dependency)

```bash
# macOS
brew install signal-cli

# Linux
# Download and install signal-cli
wget https://github.com/AsamK/signal-cli/releases/download/v0.13.0/signal-cli-0.13.0.tar.gz
```

2. **Register a Signal Number**

```bash
# Register a new number
signal-cli -u +86138xxxxxxxx register

# Verify with the code
signal-cli -u +86138xxxxxxxx verify 123456
```

3. **Configure OpenClaw**

```bash
# Enable Signal channel
openclaw config set channels.signal.enabled true

# Configure Signal number
openclaw config set channels.signal.phoneNumber "+86138xxxxxxxx"

# Configure signal-cli path
openclaw config set channels.signal.cliPath "/usr/local/bin/signal-cli"

# Configure allowlist
openclaw config set channels.signal.allowFrom "+86139xxxxxxxx"
```

### Signal Configuration Options

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "phoneNumber": "+86138xxxxxxxx",
      "cliPath": "/usr/local/bin/signal-cli",
      "dataPath": "~/.local/share/signal-cli",
      "allowFrom": ["+86139xxxxxxxx"],
      "dmPolicy": "pairing",
      "groupPolicy": "owner-only"
    }
  }
}
```

## BlueBubbles Configuration

### What is BlueBubbles

BlueBubbles is an iMessage bridging solution that lets you use iMessage on non-Apple devices.

**Architecture**:
```
iPhone/Mac (BlueBubbles Server) ←→ Your Device (OpenClaw)
         ↓
     iMessage Network
```

### Prerequisites

1. **Mac Device** (as server)
2. **iMessage Account**
3. **BlueBubbles Server** installed on the Mac

### Setup Steps

1. **Install BlueBubbles on Your Mac**

   Visit [bluebubbles.app](https://bluebubbles.app) to download and install.

2. **Configure BlueBubbles Server**

   - Open the BlueBubbles app
   - Enable server functionality
   - Note down the server URL and password

3. **Install OpenClaw Extension**

```bash
# Install BlueBubbles extension
openclaw plugins install bluebubbles
```

4. **Configure OpenClaw**

```bash
# Enable BlueBubbles
openclaw config set bluebubbles.enabled true

# Configure server URL
openclaw config set bluebubbles.serverUrl "http://192.168.1.100:1234"

# Configure password
openclaw config set bluebubbles.password "your-server-password"

# Configure allowlist
openclaw config set bluebubbles.allowFrom "+86138xxxxxxxx"
```

### BlueBubbles Configuration Example

```json
{
  "bluebubbles": {
    "enabled": true,
    "serverUrl": "http://192.168.1.100:1234",
    "password": "${BLUEBUBBLES_PASSWORD}",
    "allowFrom": ["+86138xxxxxxxx"],
    "dmPolicy": "allow",
    "groupPolicy": "admins"
  }
}
```

## MS Teams Configuration

### Prerequisites

1. **Microsoft 365 Developer Account**
2. **Azure AD App Registration**
3. **Teams Admin Permissions**

### Setup Steps

1. **Register an Azure AD App**

   - Visit the [Azure Portal](https://portal.azure.com)
   - Go to **Azure Active Directory** → **App registrations**
   - Click **New registration**
   - Enter an app name, select **Accounts in this organizational directory only**
   - Click **Register**

2. **Add API Permissions**

   Add the following in **API permissions**:
   - `ChannelMessage.Read.All`
   - `ChannelMessage.Send`
   - `Chat.Read`
   - `Chat.ReadWrite`
   - `Group.Read.All`
   - `User.Read.All`

3. **Create a Client Secret**

   - Go to **Certificates & secrets**
   - Click **New client secret**
   - Copy the generated secret value

4. **Install Extension and Configure**

```bash
# Install MS Teams extension
openclaw plugins install msteams

# Configure Azure AD credentials
openclaw config set msteams.tenantId "your-tenant-id"
openclaw config set msteams.clientId "your-client-id"
openclaw config set msteams.clientSecret "your-client-secret"

# Enable the channel
openclaw config set msteams.enabled true
```

## Matrix Configuration

### What is Matrix

Matrix is an open, decentralized communication protocol that supports federation (communication between different servers).

### Setup Steps

1. **Install the Matrix Extension**

```bash
openclaw plugins install matrix
```

2. **Get a Matrix Account**

   You can register on matrix.org or host your own Synapse server.

3. **Configure OpenClaw**

```bash
# Configure Homeserver
openclaw config set matrix.homeserver "https://matrix.org"

# Configure user credentials
openclaw config set matrix.userId "@youruser:matrix.org"
openclaw config set matrix.accessToken "your-access-token"

# Enable channel
openclaw config set matrix.enabled true
```

4. **Get the Access Token**

```bash
# Get token using curl
curl -X POST \
  https://matrix.org/_matrix/client/r0/login \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "m.login.password",
    "user": "youruser",
    "password": "yourpassword"
  }'
```

### Matrix Configuration Example

```json
{
  "matrix": {
    "enabled": true,
    "homeserver": "https://matrix.org",
    "userId": "@youruser:matrix.org",
    "accessToken": "${MATRIX_ACCESS_TOKEN}",
    "rooms": ["!roomid:matrix.org"],
    "allowFrom": ["@friend:matrix.org"],
    "dmPolicy": "allow",
    "groupPolicy": "admins"
  }
}
```

## Zalo Configuration

Zalo is a popular instant messaging app in Vietnam, supported by OpenClaw through an extension.

### Setup Steps

```bash
# Install Zalo extension
openclaw plugins install zalo

# Configure Zalo
openclaw config set zalo.enabled true
openclaw config set zalo.cookie "your-zalo-cookie"
openclaw config set zalo.imei "your-device-imei"

# Configure allowlist
openclaw config set zalo.allowFrom "user_id_1"
```

::: warning Note
Zalo integration requires extracting browser cookies. Please ensure you comply with Zalo's Terms of Service.
:::

## IRC Configuration

IRC is the classic Internet Relay Chat protocol, with built-in support in OpenClaw.

```bash
# Enable IRC
openclaw config set channels.irc.enabled true

# Configure server
openclaw config set channels.irc.server "irc.libera.chat"
openclaw config set channels.irc.port 6667

# Configure nickname
openclaw config set channels.irc.nickname "OpenClawBot"

# Configure channels to join
openclaw config set channels.irc.channels "#openclaw,#general"

# Enable SSL
openclaw config set channels.irc.secure true
```

## Google Chat Configuration

### Create a Google Chat Bot

1. Visit the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google Chat API**
4. Create a Bot in **Configuration**
5. Note down the **Bot URL** and **Verification Token**

### Configure OpenClaw

```bash
# Enable Google Chat
openclaw config set channels.googlechat.enabled true

# Configure Bot URL
openclaw config set channels.googlechat.webhookUrl "https://chat.googleapis.com/v1/spaces/..."

# Configure Verification Token
openclaw config set channels.googlechat.verificationToken "your-verification-token"
```

## Getting Started with Extension Channel Development

If you want to develop a custom channel extension, you can reference the following structure:

```typescript
// Extension directory structure
extensions/my-channel/
├── package.json
├── src/
│   ├── index.ts          // Extension entry point
│   ├── config.ts         // Configuration types
│   ├── client.ts         // Client implementation
│   └── outbound.ts       // Message sending
└── README.md

// Basic extension structure
export default definePlugin({
  name: 'my-channel',
  version: '1.0.0',
  
  configSchema: {
    enabled: { type: 'boolean', default: false },
    apiKey: { type: 'string', required: true },
    allowFrom: { type: 'array', items: 'string' }
  },
  
  async onLoad(context) {
    // Initialize connection
    const client = new MyChannelClient(context.config);
    await client.connect();
    
    // Register message handler
    client.onMessage((message) => {
      context.handleIncoming(message);
    });
  },
  
  async sendMessage(message) {
    // Implement message sending
  }
});
```

## Checkpoint ✅

Verify extension channel status:

```bash
# View all channel statuses
openclaw channels status --all

# View specific extension channel
openclaw channels status bluebubbles
openclaw channels status msteams

# Expected output
┌─────────────────────────────────────┐
│  Channel Status                     │
├─────────────────────────────────────┤
│  whatsapp:    ✅ Connected           │
│  telegram:    ✅ Connected           │
│  signal:      ✅ Connected           │
│  bluebubbles: ✅ Connected           │
│  msteams:     🔧 Extension           │
│  matrix:      🔧 Extension           │
└─────────────────────────────────────┘
```

## Troubleshooting Tips

::: warning Common Signal Issues
1. **signal-cli not installed**  
   Symptom: `signal-cli not found`  
   Solution: Install signal-cli and configure the correct path

2. **Number not registered**  
   Symptom: `Number not registered`  
   Solution: Run `signal-cli register` to register the number first

3. **Captcha required**  
   Symptom: `Captcha required`  
   Solution: Complete the captcha verification as prompted
:::

::: warning Common BlueBubbles Issues
1. **Server unreachable**  
   Symptom: `Connection refused`  
   Solution: Check Mac server IP and port, ensure they are on the same network

2. **Mac goes to sleep**  
   Symptom: Intermittent connection  
   Solution: Disable sleep in Mac System Settings

3. **iMessage not logged in**  
   Symptom: Failed to send messages  
   Solution: Ensure iMessage is logged in on the Mac
:::

::: warning Common MS Teams Issues
1. **Insufficient permissions**  
   Symptom: `Forbidden`  
   Solution: Check API permissions settings in Azure AD

2. **Token expired**  
   Symptom: `Unauthorized`  
   Solution: Regenerate the client secret

3. **Bot not added to team**  
   Symptom: Not receiving messages  
   Solution: Add the app to the target team in Teams
:::

## Summary

In this tutorial, you learned:

- ✅ Signal configuration (privacy-first)
- ✅ BlueBubbles iMessage bridge
- ✅ MS Teams enterprise integration
- ✅ Matrix decentralized communication
- ✅ Zalo and IRC configuration
- ✅ Google Chat Bot setup
- ✅ Getting started with custom channel development

## Coming Up Next

> In the next lesson, we'll cover **[Model Configuration](../../advanced/models-configuration/)**.
>
> You'll learn:
> - Configuring multiple model providers
> - Setting up model failover
> - Customizing model parameters

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to view source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Signal Implementation | [`src/signal/`](https://github.com/openclaw/openclaw/blob/main/src/signal/) | - |
| iMessage (legacy) | [`src/imessage/`](https://github.com/openclaw/openclaw/blob/main/src/imessage/) | - |
| BlueBubbles Extension | [`extensions/bluebubbles/`](https://github.com/openclaw/openclaw/blob/main/extensions/bluebubbles/) | - |
| MS Teams Extension | [`extensions/msteams/`](https://github.com/openclaw/openclaw/blob/main/extensions/msteams/) | - |
| Matrix Extension | [`extensions/matrix/`](https://github.com/openclaw/openclaw/blob/main/extensions/matrix/) | - |
| Zalo Extension | [`extensions/zalo/`](https://github.com/openclaw/openclaw/blob/main/extensions/zalo/) | - |
| Extension Plugin System | [`src/plugins/`](https://github.com/openclaw/openclaw/blob/main/src/plugins/) | - |

**Extension Development Documentation**:
- Reference existing extensions in the `extensions/` directory
- Use the `definePlugin()` API to define extensions
- Implement the `onLoad` and `sendMessage` methods

</details>
