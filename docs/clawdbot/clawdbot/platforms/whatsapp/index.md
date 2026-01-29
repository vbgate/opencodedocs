---
title: "WhatsApp Channel Configuration Complete Guide | Clawdbot Tutorial"
sidebarTitle: "WhatsApp Channel"
subtitle: "Complete Guide to Configuring WhatsApp Channels"
description: "Learn how to configure and use WhatsApp channels in Clawdbot (based on Baileys), including QR code login, multi-account management, DM access control, and group support."
tags:
  - "whatsapp"
  - "channel configuration"
  - "baileys"
  - "qr login"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 70
---

# WhatsApp Channel Configuration Complete Guide

## What You'll Learn

- Link WhatsApp accounts to Clawdbot via QR code
- Configure multi-account WhatsApp support
- Set up DM access control (pairing/whitelist/open)
- Enable and manage WhatsApp group support
- Configure automatic message acknowledgments and read receipts

## Your Current Challenge

WhatsApp is your most-used messaging platform, but your AI assistant can't receive WhatsApp messages yet. You want to:
- Chat directly with AI on WhatsApp without switching apps
- Control who can send messages to your AI
- Support multiple WhatsApp accounts (separate work/personal)

## When to Use This

- You need to integrate your AI assistant with WhatsApp
- You need to separate work and personal WhatsApp accounts
- You want precise control over who can send messages to your AI

::: info What is Baileys?

Baileys is a WhatsApp Web library that allows programs to send and receive messages via the WhatsApp Web protocol. Clawdbot uses Baileys to connect to WhatsApp without using the WhatsApp Business API, offering better privacy and flexibility.

:::

## 🎒 Prerequisites

Before configuring the WhatsApp channel, please confirm:

- [ ] Clawdbot Gateway is installed and running
- [ ] You have completed the [Quick Start](../../start/getting-started/)
- [ ] You have an available phone number (recommend using a spare number)
- [ ] Your WhatsApp phone can access the internet (to scan the QR code)

::: warning Important Notes

- **Use a dedicated number**: A separate SIM card or old phone to avoid interference with personal use
- **Avoid virtual numbers**: TextNow, Google Voice, and other virtual numbers will be banned by WhatsApp
- **Node runtime**: WhatsApp and Telegram are unstable on Bun, please use Node ≥22

:::

## Core Architecture

The core architecture of the WhatsApp channel:

```
Your WhatsApp Phone ←--(QR Code)--> Baileys ←--→ Clawdbot Gateway
                                                       ↓
                                                  AI Agent
                                                       ↓
                                                  Reply Message
```

**Key Concepts**:

1. **Baileys Session**: Connection established via WhatsApp Linked Devices
2. **DM Policy**: Controls who can send DM messages to the AI
3. **Multi-account Support**: One Gateway manages multiple WhatsApp accounts
4. **Message Acknowledgment**: Automatically sends reactions/read receipts to improve user experience

## Follow Along

### Step 1: Configure Basic Settings

**Why**
Set up WhatsApp access control policies to protect your AI assistant from abuse.

Edit `~/.clawdbot/clawdbot.json` and add WhatsApp configuration:

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "allowFrom": ["+15551234567"]
    }
  }
}
```

**Field Descriptions**:

| Field | Type | Default | Description |
|------|------|---------|-------------|
| `dmPolicy` | string | `"pairing"` | DM access policy: `pairing` (pairing required), `allowlist` (whitelist), `open` (public), `disabled` (disabled) |
| `allowFrom` | string[] | `[]` | List of allowed sender phone numbers (E.164 format, e.g. `+15551234567`) |

**DM Policy Comparison**:

| Policy | Behavior | Use Case |
|--------|----------|----------|
| `pairing` | Unknown senders receive pairing code, requiring manual approval | **Recommended**, balances security and convenience |
| `allowlist` | Only allow numbers in the `allowFrom` list | Strict control, known users |
| `open` | Anyone can send (requires `allowFrom` to contain `"*"`) | Public testing or community service |
| `disabled` | Ignore all WhatsApp messages | Temporarily disable this channel |

**You should see**: Configuration file saved successfully, no JSON format errors.

### Step 2: Log in to WhatsApp

**Why**
Link your WhatsApp account to Clawdbot via QR code, and Baileys will maintain the session state.

Run in terminal:

```bash
clawdbot channels login whatsapp
```

**Multi-account Login**:

Log in to a specific account:

```bash
clawdbot channels login whatsapp --account work
```

Log in to the default account:

```bash
clawdbot channels login whatsapp
```

**Steps**:

1. Terminal displays QR code (or shows in CLI interface)
2. Open WhatsApp mobile app
3. Go to **Settings → Linked Devices**
4. Tap **Link a Device**
5. Scan the QR code displayed in the terminal

**You should see**:

```
✓ WhatsApp linked successfully!
Credentials stored: ~/.clawdbot/credentials/whatsapp/default/creds.json
```

::: tip Credential Storage

WhatsApp login credentials are saved in `~/.clawdbot/credentials/whatsapp/<accountId>/creds.json`. After the first login, subsequent startups will automatically restore the session, so you don't need to scan the QR code again.

:::

### Step 3: Start Gateway

**Why**
Start Gateway to let the WhatsApp channel begin receiving and sending messages.

```bash
clawdbot gateway
```

Or use daemon mode:

```bash
clawdbot gateway start
```

**You should see**:

```
[WhatsApp] Connected to WhatsApp Web
[WhatsApp] Default account linked: +15551234567
Gateway listening on ws://127.0.0.1:18789
```

### Step 4: Send Test Message

**Why**
Verify that the WhatsApp channel is configured correctly and can send/receive messages normally.

Send a message from your WhatsApp phone to the linked number:

```
Hello
```

**You should see**:
- Terminal displays received message logs
- WhatsApp receives AI reply

**Checkpoint ✅**

- [ ] Gateway logs show `[WhatsApp] Received message from +15551234567`
- [ ] WhatsApp receives AI reply
- [ ] Reply content is relevant to your input

### Step 5: Configure Advanced Options (Optional)

#### Enable Automatic Message Acknowledgment

Add to `clawdbot.json`:

```json
{
  "channels": {
    "whatsapp": {
      "ackReaction": {
        "emoji": "👀",
        "direct": true,
        "group": "mentions"
      }
    }
  }
}
```

**Field Descriptions**:

| Field | Type | Default | Description |
|------|------|---------|-------------|
| `emoji` | string | - | Acknowledgment emoji (e.g. `"👀"`, `"✅"`), empty string to disable |
| `direct` | boolean | `true` | Whether to send acknowledgment in DMs |
| `group` | string | `"mentions"` | Group behavior: `"always"` (all messages), `"mentions"` (only @ mentions), `"never"` (never) |

#### Configure Read Receipts

By default, Clawdbot automatically marks messages as read (blue checkmarks). To disable:

```json
{
  "channels": {
    "whatsapp": {
      "sendReadReceipts": false
    }
  }
}
```

#### Adjust Message Limits

```json
{
  "channels": {
    "whatsapp": {
      "textChunkLimit": 4000,
      "mediaMaxMb": 50,
      "chunkMode": "length"
    }
  }
}
```

| Field | Default | Description |
|------|---------|-------------|
| `textChunkLimit` | 4000 | Maximum characters per text message |
| `mediaMaxMb` | 50 | Maximum size of received media files (MB) |
| `chunkMode` | `"length"` | Chunk mode: `"length"` (by length), `"newline"` (by paragraph) |

**You should see**: After configuration takes effect, long messages are automatically chunked, and media file sizes are controlled.

## Troubleshooting

### Problem 1: QR Code Scan Failed

**Symptom**: After scanning the QR code, the terminal shows connection failure or timeout.

**Cause**: Network connection issues or WhatsApp service instability.

**Solution**:

1. Check phone network connection
2. Ensure Gateway server can access the internet
3. Logout and login again:
   ```bash
   clawdbot channels logout whatsapp
   clawdbot channels login whatsapp
   ```

### Problem 2: Message Not Delivered or Delayed

**Symptom**: After sending a message, it takes a long time to receive a reply.

**Cause**: Gateway is not running or WhatsApp connection is disconnected.

**Solution**:

1. Check Gateway status: `clawdbot gateway status`
2. Restart Gateway: `clawdbot gateway restart`
3. View logs: `clawdbot logs --follow`

### Problem 3: Pairing Code Not Received

**Symptom**: After a stranger sends a message, no pairing code is received.

**Cause**: `dmPolicy` is not set to `pairing`.

**Solution**:

Check the `dmPolicy` setting in `clawdbot.json`:

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing"  // ← Make sure it's "pairing"
    }
  }
}
```

### Problem 4: Bun Runtime Issues

**Symptom**: WhatsApp and Telegram frequently disconnect or fail to log in.

**Cause**: Baileys and Telegram SDK are unstable on Bun.

**Solution**:

Use Node ≥22 to run Gateway:

Check current runtime:

```bash
node --version
```

If you need to switch, use Node to run Gateway:

```bash
clawdbot gateway --runtime node
```

::: tip Recommended Runtime

WhatsApp and Telegram channels strongly recommend using Node runtime, as Bun may cause connection instability.

:::

## Key Takeaways

WhatsApp channel configuration key points:

1. **Basic Configuration**: `dmPolicy` + `allowFrom` control access
2. **Login Process**: `clawdbot channels login whatsapp` to scan QR code
3. **Multi-account**: Use `--account` parameter to manage multiple WhatsApp accounts
4. **Advanced Options**: Automatic message acknowledgment, read receipts, message limits
5. **Troubleshooting**: Check Gateway status, logs, and runtime

## Coming Up Next

> In the next lesson, we'll learn about **[Telegram Channel](../telegram/)** configuration.
>
> You'll learn:
> - Configure Telegram Bot using Bot Token
> - Set up commands and inline queries
> - Manage Telegram-specific security policies

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Lines |
|---------|-----------|-------|
| WhatsApp configuration type definitions | [`src/config/types.whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.whatsapp.ts) | 1-160 |
| WhatsApp configuration Schema | [`src/config/zod-schema.providers-whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-whatsapp.ts) | 13-100 |
| WhatsApp onboarding configuration | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 1-341 |
| WhatsApp documentation | [`docs/channels/whatsapp.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/whatsapp.md) | 1-363 |
| WhatsApp login utility | [`src/channels/plugins/agent-tools/whatsapp-login.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/agent-tools/whatsapp-login.ts) | 1-72 |
| WhatsApp Actions utility | [`src/agents/tools/whatsapp-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/whatsapp-actions.ts) | 1-42 |

**Key Configuration Items**:
- `dmPolicy`: DM access policy (`pairing`/`allowlist`/`open`/`disabled`)
- `allowFrom`: List of allowed senders (E.164 format phone numbers)
- `ackReaction`: Automatic message acknowledgment configuration (`{emoji, direct, group}`)
- `sendReadReceipts`: Whether to send read receipts (default `true`)
- `textChunkLimit`: Text chunk limit (default 4000 characters)
- `mediaMaxMb`: Media file size limit (default 50 MB)

**Key Functions**:
- `loginWeb()`: Execute WhatsApp QR code login
- `startWebLoginWithQr()`: Start QR code generation process
- `sendReactionWhatsApp()`: Send WhatsApp emoji reaction
- `handleWhatsAppAction()`: Handle WhatsApp-specific actions (e.g. reactions)

**Key Constants**:
- `DEFAULT_ACCOUNT_ID`: Default account ID (`"default"`)
- `creds.json`: WhatsApp authentication credential storage path

</details>
