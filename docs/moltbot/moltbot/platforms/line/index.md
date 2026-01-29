---
title: "LINE Channel Setup and Usage Guide | Clawdbot Tutorial"
sidebarTitle: "LINE Channel"
subtitle: "LINE Channel Setup and Usage Guide"
description: "Learn how to configure and use Clawdbot's LINE channel. This tutorial covers LINE Messaging API integration, Webhook setup, access control, rich media messages (Flex templates, quick replies, Rich Menu), and troubleshooting tips."
tags:
  - "LINE"
  - "Messaging API"
  - "Channel Configuration"
prerequisite:
  - "start-gateway-startup"
order: 140
---

# LINE Channel Setup and Usage Guide

## What You'll Learn

After completing this tutorial, you will be able to:

- ✅ Create a LINE Messaging API channel and obtain credentials
- ✅ Configure Clawdbot's LINE plugin and Webhook
- ✅ Set up DM pairing, group access control, and media limits
- ✅ Send rich media messages (Flex cards, quick replies, location)
- ✅ Troubleshoot common LINE channel issues

## Your Current Challenge

You might be thinking:

- "I want to chat with an AI assistant via LINE, how do I integrate it?"
- "How do I configure the LINE Messaging API Webhook?"
- "Does LINE support Flex messages and quick replies?"
- "How do I control who can access my AI assistant via LINE?"

Good news: **Clawdbot provides a complete LINE plugin that supports all core features of the Messaging API**.

## When to Use This

When you need to:

- 📱 **Chat with an AI assistant** on LINE
- 🎨 **Use rich media messages** (Flex cards, quick replies, Rich Menu)
- 🔒 **Control access permissions** (DM pairing, group allowlist)
- 🌐 **Integrate LINE** into existing workflows

## Core Architecture

The LINE channel integrates via **LINE Messaging API**, using Webhook to receive events and send messages.

```
LINE User
    │
    ▼ (Send message)
┌──────────────────┐
│  LINE Platform  │
│  (Messaging API)│
└────────┬─────────┘
         │ (Webhook POST)
         ▼
┌──────────────────┐
│  Clawdbot       │
│  Gateway        │
│  /line/webhook   │
└────────┬─────────┘
         │ (Call AI)
         ▼
     ┌────────┐
     │ Agent  │
     └───┬────┘
         │ (Response)
         ▼
     LINE User
```

**Key Concepts**:

| Concept | Purpose |
|--- | ---|
| **Channel Access Token** | Authentication token for sending messages |
| **Channel Secret** | Secret key for verifying Webhook signatures |
| **Webhook URL** | Endpoint where Clawdbot receives LINE events (must be HTTPS) |
| **DM Policy** | Access control policy for unknown senders (pairing/allowlist/open/disabled) |
| **Rich Menu** | LINE's fixed menu that users can click to trigger actions quickly |

## 🎒 Prerequisites

### Required Accounts and Tools

| Item | Requirements | How to Obtain |
|--- | --- | ---|
| **LINE Developers Account** | Free registration | https://developers.line.biz/console/ |
| **LINE Provider** | Create Provider and Messaging API channel | LINE Console |
| **HTTPS Server** | Webhook must be HTTPS | ngrok, Cloudflare Tunnel, Tailscale Serve/Funnel |

::: tip Recommended Exposure Methods
If you're developing locally, you can use:
- **ngrok**: `ngrok http 18789`
- **Tailscale Funnel**: `gateway.tailscale.mode = "funnel"`
- **Cloudflare Tunnel**: Free and stable
:::

## Follow Along

### Step 1: Install LINE Plugin

**Why**
The LINE channel is implemented via a plugin and needs to be installed first.

```bash
clawdbot plugins install @clawdbot/line
```

**You should see**:
```
✓ Installed @clawdbot/line plugin
```

::: tip Local Development
If you're running from source, you can use local installation:
```bash
clawdbot plugins install ./extensions/line
```
:::

### Step 2: Create LINE Messaging API Channel

**Why**
You need to obtain `Channel Access Token` and `Channel Secret` to configure Clawdbot.

#### 2.1 Log in to LINE Developers Console

Visit: https://developers.line.biz/console/

#### 2.2 Create a Provider (if you don't have one)

1. Click "Create new provider"
2. Enter Provider name (e.g., `Clawdbot`)
3. Click "Create"

#### 2.3 Add Messaging API Channel

1. Under the Provider, click "Add channel" → Select "Messaging API"
2. Set Channel information:
   - Channel name: `Clawdbot AI Assistant`
   - Channel description: `Personal AI assistant powered by Clawdbot`
   - Category: `Communication`
   - Subcategory: `Bot`
3. Check "Agree" → Click "Create"

#### 2.4 Enable Webhook

1. On the Channel settings page, find the "Messaging API" tab
2. Click "Use webhook" toggle → Set to ON
3. Copy the following information:

| Item | Location | Example |
|--- | --- | ---|
| **Channel Access Token** | Basic settings → Channel access token (long-lived) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Channel Secret** | Basic settings → Channel secret | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7` |

::: warning Save Your Credentials!
Channel Access Token and Channel Secret are sensitive information. Keep them secure and don't commit them to public repositories.
:::

### Step 3: Configure Clawdbot's LINE Channel

**Why**
Configure the Gateway to use LINE Messaging API to send and receive messages.

#### Method A: Configure via Command Line

```bash
clawdbot configure
```

The wizard will ask:
- Whether to enable LINE channel
- Channel Access Token
- Channel Secret
- DM policy (default `pairing`)

#### Method B: Edit Configuration File Directly

Edit `~/.clawdbot/clawdbot.json`:

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
      channelSecret: "YOUR_CHANNEL_SECRET",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    }
  }
}
```

::: tip Using Environment Variables
You can also configure via environment variables (only works for default account):
```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_token_here"
export LINE_CHANNEL_SECRET="your_secret_here"
```
:::

#### Method C: Use File Storage for Credentials

A more secure approach is to store credentials in separate files:

```json5
{
  channels: {
    line: {
      enabled: true,
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
      dmPolicy: "pairing"
    }
  }
}
```

### Step 4: Set Up Webhook URL

**Why**
LINE needs a Webhook URL to push message events to Clawdbot.

#### 4.1 Ensure Your Gateway is Externally Accessible

If you're developing locally, you need to use a tunnel service:

```bash
# Using ngrok
ngrok http 18789

# The output will show an HTTPS URL, such as:
# Forwarding: https://abc123.ngrok.io -> http://localhost:18789
```

#### 4.2 Set Webhook URL in LINE Console

1. In the Messaging API settings page, find "Webhook settings"
2. Enter Webhook URL:
   ```
   https://your-gateway-host/line/webhook
   ```
   - Default path: `/line/webhook`
   - Can be customized via `channels.line.webhookPath`
3. Click "Verify" → Confirm LINE can access your Gateway

**You should see**:
```
✓ Webhook URL verification succeeded
```

#### 4.3 Enable Required Event Types

In Webhook settings, check the following events:

| Event | Purpose |
|--- | ---|
| **Message event** | Receive messages sent by users |
| **Follow event** | User adds Bot as friend |
| **Unfollow event** | User removes Bot |
| **Join event** | Bot joins a group |
| **Leave event** | Bot leaves a group |
| **Postback event** | Quick replies and button clicks |

### Step 5: Start Gateway

**Why**
Gateway needs to be running to receive LINE's Webhook events.

```bash
clawdbot gateway --verbose
```

**You should see**:
```
✓ Gateway listening on ws://127.0.0.1:18789
✓ LINE webhook server started on /line/webhook
✓ LINE plugin initialized
```

### Step 6: Test LINE Channel

**Why**
Verify the configuration is correct and the AI assistant responds properly.

#### 6.1 Add Bot as Friend

1. In LINE Console → Messaging API → Channel settings
2. Copy "Basic ID" or "QR Code"
3. Search or scan the QR Code in LINE App to add the Bot as friend

#### 6.2 Send Test Message

Send a message to the Bot in LINE:
```
你好，请帮我总结今天的天气。
```

**You should see**:
- Bot shows "typing" status (if typing indicators are configured)
- AI assistant streams the response back
- Messages display correctly in LINE

### Step 7: DM Pairing Verification (Optional)

**Why**
If using the default `dmPolicy="pairing"`, unknown senders need to be approved first.

#### View Pending Pairing Requests

```bash
clawdbot pairing list line
```

**You should see**:
```
Pending pairing requests for LINE:
  CODE: ABC123 - User ID: U1234567890abcdef1234567890ab
```

#### Approve Pairing Request

```bash
clawdbot pairing approve line ABC123
```

**You should see**:
```
✓ Approved pairing request for LINE user U1234567890abcdef1234567890ab
```

::: info DM Policy Explanation
- `pairing` (default): Unknown senders receive a pairing code, messages are ignored until approved
- `allowlist`: Only users in the allowlist can send messages
- `open`: Anyone can send messages (use with caution)
- `disabled`: Direct messages are disabled
:::

## Checkpoint ✅

Verify your configuration is correct:

| Check Item | Verification Method | Expected Result |
|--- | --- | ---|
| **Plugin Installed** | `clawdbot plugins list` | See `@clawdbot/line` |
| **Configuration Valid** | `clawdbot doctor` | No LINE-related errors |
| **Webhook Reachable** | LINE Console verification | `✓ Verification succeeded` |
| **Bot Accessible** | Add friend and send message in LINE | AI assistant responds normally |
| **Pairing Mechanism** | Send DM with new user | Receive pairing code (if using pairing policy) |

## Common Pitfalls

### Common Issue 1: Webhook Verification Failed

**Symptoms**:
```
Webhook URL verification failed
```

**Causes**:
- Webhook URL is not HTTPS
- Gateway is not running or port is incorrect
- Firewall is blocking inbound connections

**Solutions**:
1. Ensure using HTTPS: `https://your-gateway-host/line/webhook`
2. Check if Gateway is running: `clawdbot gateway status`
3. Verify port: `netstat -an | grep 18789`
4. Use tunnel service (ngrok/Tailscale/Cloudflare)

### Common Issue 2: Unable to Receive Messages

**Symptoms**:
- Webhook verification succeeds
- But sending messages to Bot gets no response

**Causes**:
- Webhook path configuration is incorrect
- Event types not enabled
- `channelSecret` in configuration file doesn't match

**Solutions**:
1. Check if `channels.line.webhookPath` matches LINE Console
2. Ensure "Message event" is enabled in LINE Console
3. Verify `channelSecret` is copied correctly (no extra spaces)

### Common Issue 3: Media Download Failed

**Symptoms**:
```
Error downloading LINE media: size limit exceeded
```

**Causes**:
- Media file exceeds default limit (10MB)

**Solutions**:
Increase limit in configuration:
```json5
{
  channels: {
    line: {
      mediaMaxMb: 25  // LINE official limit is 25MB
    }
  }
}
```

### Common Issue 4: Group Messages No Response

**Symptoms**:
- DM works normally
- Sending messages in groups gets no response

**Causes**:
- Default `groupPolicy="allowlist"`, group not added to allowlist
- Bot not @mentioned in group

**Solutions**:
1. Add group ID to allowlist in configuration:
```json5
{
  channels: {
    line: {
      groupAllowFrom: ["C1234567890abcdef1234567890ab"]
    }
  }
}
```

2. Or @mention the Bot in the group: `@Clawdbot 帮我处理这个任务`

## Advanced Features

### Rich Media Messages (Flex Templates and Quick Replies)

Clawdbot supports LINE's rich media messages, including Flex cards, quick replies, location info, etc.

#### Send Quick Replies

```json5
{
  text: "今天能帮你做什么？",
  channelData: {
    line: {
      quickReplies: ["查天气", "设置提醒", "生成代码"]
    }
  }
}
```

#### Send Flex Card

```json5
{
  text: "状态卡片",
  channelData: {
    line: {
      flexMessage: {
        altText: "服务器状态",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            contents: [
              {
                type: "text",
                text: "CPU: 45%"
              },
              {
                type: "text",
                text: "Memory: 2.1GB"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### Send Location Info

```json5
{
  text: "这是我的办公室位置",
  channelData: {
    line: {
      location: {
        title: "Office",
        address: "123 Main St, San Francisco",
        latitude: 37.7749,
        longitude: -122.4194
      }
    }
  }
}
```

### Rich Menu (Fixed Menu)

Rich Menu is LINE's fixed menu that users can click to quickly trigger actions.

```bash
# Create Rich Menu
clawdbot line rich-menu create

# Upload menu image
clawdbot line rich-menu upload --image /path/to/menu.png

# Set as default menu
clawdbot line rich-menu set-default --rich-menu-id <MENU_ID>
```

::: info Rich Menu Limitations
- Image size: 2500x1686 or 2500x843 pixels
- Image format: PNG or JPEG
- Maximum 10 menu items
:::

### Markdown Conversion

Clawdbot automatically converts Markdown format to LINE-supported format:

| Markdown | LINE Conversion Result |
|--- | ---|
| Code blocks | Flex cards |
| Tables | Flex cards |
| Links | Auto-detected and converted to Flex cards |
| Bold/Italic | Removed (LINE doesn't support) |

::: tip Preserving Format
LINE doesn't support Markdown format. Clawdbot attempts to convert to Flex cards. If you prefer plain text, you can disable auto-conversion in configuration.
:::

## Summary

This tutorial covered:

1. ✅ Install LINE plugin
2. ✅ Create LINE Messaging API Channel
3. ✅ Configure Webhook and credentials
4. ✅ Set up access control (DM pairing, group allowlist)
5. ✅ Send rich media messages (Flex, quick replies, location)
6. ✅ Use Rich Menu
7. ✅ Troubleshoot common issues

The LINE channel provides rich message types and interaction methods, making it ideal for building personalized AI assistant experiences on LINE.

---

## Preview of Next Lesson

> In the next lesson, we'll learn **[WebChat Interface](../webchat/)**.
>
> You'll learn:
> - How to access the WebChat interface via browser
> - WebChat's core features (session management, file upload, Markdown support)
> - Configure remote access (SSH tunnel, Tailscale)
> - Understand differences between WebChat and other channels

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature | File Path | Line |
|--- | --- | ---|
| LINE Bot Core Implementation | [`src/line/bot.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot.ts) | 27-83 |
| Config Schema Definition | [`src/line/config-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/config-schema.ts) | 1-54 |
| Webhook Event Handlers | [`src/line/bot-handlers.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot-handlers.ts) | 1-100 |
| Message Sending Functionality | [`src/line/send.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/send.ts) | - |
| Flex Template Generation | [`src/line/flex-templates.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/flex-templates.ts) | - |
| Rich Menu Operations | [`src/line/rich-menu.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/rich-menu.ts) | - |
| Template Messages | [`src/line/template-messages.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/template-messages.ts) | - |
| Markdown to LINE | [`src/line/markdown-to-line.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/markdown-to-line.ts) | - |
| Webhook Server | [`src/line/webhook.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/webhook.ts) | - |

**Key Configuration Fields**:
- `channelAccessToken`: LINE Channel Access Token (`config-schema.ts:19`)
- `channelSecret`: LINE Channel Secret (`config-schema.ts:20`)
- `dmPolicy`: DM access policy (`config-schema.ts:26`)
- `groupPolicy`: Group access policy (`config-schema.ts:27`)
- `mediaMaxMb`: Media size limit (`config-schema.ts:28`)
- `webhookPath`: Custom Webhook path (`config-schema.ts:29`)

**Key Functions**:
- `createLineBot()`: Create LINE Bot instance (`bot.ts:27`)
- `handleLineWebhookEvents()`: Handle LINE Webhook events (`bot-handlers.ts:100`)
- `sendMessageLine()`: Send LINE message (`send.ts`)
- `createFlexMessage()`: Create Flex message (`send.ts:20`)
- `createQuickReplyItems()`: Create quick replies (`send.ts:21`)

**Supported DM Policies**:
- `open`: Open access
- `allowlist`: Allowlist mode
- `pairing`: Pairing mode (default)
- `disabled`: Disabled

**Supported Group Policies**:
- `open`: Open access
- `allowlist`: Allowlist mode (default)
- `disabled`: Disabled

</details>
