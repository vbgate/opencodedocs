---
title: "Slack and Discord Integration: Workspace Bot Setup"
sidebarTitle: "Slack and Discord Integration"
subtitle: "Workspace Bot Configuration Guide"
description: "Learn how to configure Slack Bolt and Discord.js bots, understand OAuth flows and permission management, and deploy AI assistants in your workspace."
tags:
  - "Slack"
  - "Discord"
  - "OAuth"
order: 80
---

# Slack and Discord Integration - Workspace Bot Setup

## What You'll Learn

After completing this course, you will be able to:
- Create and configure Slack Apps and Bots
- Set up Discord Bots and permissions
- Understand OAuth authorization flows
- Deploy AI assistants in your workspace

## Core Concepts

Slack and Discord are both team workspace platforms, but they differ in architecture and configuration:

```
┌─────────────────────────────────────────────────────────────┐
│              Slack vs Discord Architecture Comparison         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Slack (Bolt Framework)         Discord (discord.js)       │
│   ┌──────────────────┐           ┌──────────────────┐       │
│   │  Slack App       │           │  Discord Bot     │       │
│   │  - Bot Token     │           │  - Bot Token     │       │
│   │  - App Token     │           │  - Gateway Intents│      │
│   │  - Socket Mode   │           │  - Permissions   │       │
│   └────────┬─────────┘           └────────┬─────────┘       │
│            │                               │                │
│            ▼                               ▼                │
│   ┌──────────────────┐           ┌──────────────────┐       │
│   │  OAuth Auth      │           │  OAuth2 Auth     │       │
│   │  - Scopes        │           │  - Permission Bits│      │
│   │  - Workspace     │           │  - Bot Invite    │       │
│   │    Install       │           │                  │       │
│   └────────┬─────────┘           └────────┬─────────┘       │
│            │                               │                │
│            └───────────────┬───────────────┘                │
│                            │                                │
│                            ▼                                │
│                 ┌────────────────────┐                     │
│                 │   OpenClaw Gateway │                     │
│                 │   Message Routing  │                     │
│                 │   & AI Processing  │                     │
│                 └────────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Part 1: Slack Integration

### Step 1: Create a Slack App

**Why**  
You need to register your application on the Slack API platform to obtain credentials.

1. Visit [Slack API](https://api.slack.com/apps)
2. Click **Create New App**
3. Select **From scratch**
4. Enter:
   - **App Name**: "OpenClaw Assistant"
   - **Workspace**: Select your workspace

### Step 2: Configure Bot Permissions

**Why**  
You need to specify which features and data the bot can access.

1. In the left sidebar, select **OAuth & Permissions**
2. Scroll to the **Scopes** section
3. Add **Bot Token Scopes**:

```
app_mentions:read      # Read mentions
channels:history       # Read channel messages
channels:join          # Join channels
chat:write             # Send messages
files:read             # Read files
files:write            # Upload files
groups:history         # Read private channel messages
im:history             # Read DM history
mpim:history           # Read group DM history
users:read             # Read user information
```

### Step 3: Obtain Bot Token

**Why**  
The token is the credential for your bot to access the Slack API.

1. On the **OAuth & Permissions** page
2. Click **Install to Workspace**
3. Authorize the app
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### Step 4: Configure OpenClaw

```bash
# Set Slack Bot Token
openclaw config set channels.slack.botToken "xoxb-your-token-here"

# Enable Socket Mode (recommended for local development)
openclaw config set channels.slack.socketMode true
openclaw config set channels.slack.appToken "xapp-your-app-token"

# Or use HTTP mode (requires public URL)
openclaw config set channels.slack.socketMode false
openclaw config set channels.slack.signingSecret "your-signing-secret"

# Enable Slack channel
openclaw config set channels.slack.enabled true
```

### Step 5: Configure Event Subscriptions

**Why**  
You need to subscribe to events to receive messages in real-time.

**Socket Mode (Recommended for Development)**:
1. In the left sidebar, select **Socket Mode**
2. Enable Socket Mode
3. Generate an **App-Level Token** (add `connections:write` permission)

**HTTP Mode (Production)**:
1. Enable in **Event Subscriptions**
2. Set **Request URL**: `https://your-domain.com/slack/events`
3. Subscribe to the following events:
   - `app_mention`
   - `message.channels`
   - `message.groups`
   - `message.im`
   - `message.mpim`

## Part 2: Discord Integration

### Step 1: Create a Discord Application

**Why**  
Discord bots need to be associated with a Discord developer application.

1. Visit [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Enter application name: "OpenClaw Assistant"
4. Click **Create**

### Step 2: Create a Bot User

**Why**  
The bot user is the entity that represents the AI assistant in Discord.

1. In the left sidebar, select **Bot**
2. Click **Add Bot** → **Yes, do it!**
3. Configure bot settings:
   - **Username**: Modify display name
   - **Icon**: Upload avatar
   - **Public Bot**: Disable (prevent addition to other servers)

### Step 3: Obtain Bot Token

1. On the **Bot** page, find the **Token** section
2. Click **Reset Token** (auto-generated on first creation)
3. Copy the token

::: warning Security Reminder
**The token can only be viewed once!** If lost, you need to regenerate it.
:::

### Step 4: Configure Permissions and Gateway Intents

**Why**  
Discord uses permission bits and Intents to control what the bot can do.

**Privileged Gateway Intents** (Enable):
- ☑️ **Presence Intent**
- ☑️ **Server Members Intent**
- ☑️ **Message Content Intent**

**Bot Permissions** (Calculate permission bits):
```
Send Messages               0x00000800
Read Message History        0x00010000
Add Reactions               0x00000040
Attach Files                0x00008000
Embed Links                 0x00004000
Use Slash Commands          0x00800000
Mention Everyone            0x00020000
```

Total permission bit: `274877910080`

### Step 5: Invite Bot to Server

1. In **OAuth2** → **URL Generator**:
   - **Scopes**: Check `bot`, `applications.commands`
   - **Bot Permissions**: Select the permissions above
2. Copy the generated URL
3. Open it in your browser and select the target server
4. Authorize and verify

### Step 6: Configure OpenClaw

```bash
# Set Discord Bot Token
openclaw config set channels.discord.botToken "your-discord-bot-token"

# Configure Gateway Intents
openclaw config set channels.discord.intents 274877910080

# Enable Discord channel
openclaw config set channels.discord.enabled true

# Configure command prefix (optional)
openclaw config set channels.discord.prefix "!"
```

## Part 3: Permission Management

### Slack Permission Configuration

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "${SLACK_BOT_TOKEN}",
      "appToken": "${SLACK_APP_TOKEN}",
      "socketMode": true,
      "allowFrom": ["U1234567890"],
      "groupPolicy": "admins",
      "dmPolicy": "allow"
    }
  }
}
```

### Discord Permission Configuration

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "botToken": "${DISCORD_BOT_TOKEN}",
      "intents": 274877910080,
      "allowFrom": ["123456789012345678"],
      "guildPolicy": "admins",
      "dmPolicy": "allow"
    }
  }
}
```

## Checklist ✅

Verify configuration:

```bash
# Check Slack status
openclaw channels status slack

# Check Discord status
openclaw channels status discord

# Expected output
┌─────────────────────────────────────┐
│  Slack Status                       │
├─────────────────────────────────────┤
│  Status:     ✅ Connected            │
│  Mode:       Socket Mode             │
│  Workspace:  Your Workspace          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Discord Status                     │
├─────────────────────────────────────┤
│  Status:     ✅ Connected            │
│  Gateway:    ✅ Connected            │
│  Servers:    3 connected             │
└─────────────────────────────────────┘
```

## Troubleshooting

::: warning Common Slack Issues
1. **Insufficient Token Permissions**  
   Symptom: `missing_scope`  
   Solution: Add required permission scopes in Slack App settings

2. **Socket Mode Connection Failed**  
   Symptom: `Connection refused`  
   Solution: Ensure App Token has `connections:write` permission

3. **Events Not Triggering**  
   Symptom: Not receiving message events  
   Solution: Check event subscription configuration; ensure bot has joined the channel

4. **Signature Verification Failed**  
   Symptom: `Invalid signature`  
   Solution: Check if `signingSecret` configuration is correct
:::

::: warning Common Discord Issues
1. **Gateway Intents Not Enabled**  
   Symptom: Cannot receive message content  
   Solution: Enable **Message Content Intent** in Bot settings

2. **Insufficient Permissions**  
   Symptom: `Missing Permissions`  
   Solution: Regenerate invite link with required permissions

3. **Rate Limit**  
   Symptom: `You are being rate limited`  
   Solution: Reduce request frequency and implement backoff strategy

4. **Token Invalid**  
   Symptom: `Authentication failed`  
   Solution: Check if token is correct; regenerate if necessary
:::

## Summary

In this course, you learned:

- ✅ Create Slack Apps and configure bot permissions
- ✅ Set up Socket Mode or HTTP event subscriptions
- ✅ Create Discord applications and bot users
- ✅ Configure Gateway Intents and permission bits
- ✅ Invite bots to workspaces/servers
- ✅ Understand OAuth authorization flows
- ✅ Configure OpenClaw to integrate both platforms

## Next Lesson

> In the next lesson, we'll explore **[Other Channel Configurations](../other-channels/)**.
>
> You'll learn:
> - Signal, BlueBubbles, MS Teams configuration
> - Extended channels like Matrix, Zalo
> - Introduction to custom channel development

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand and view source locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line |
|---------|-----------|------|
| Slack Implementation | [`src/slack/`](https://github.com/openclaw/openclaw/blob/main/src/slack/) | - |
| Slack Config Types | [`src/config/types.slack.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.slack.ts) | - |
| Discord Implementation | [`src/discord/`](https://github.com/openclaw/openclaw/blob/main/src/discord/) | - |
| Discord Extension | [`extensions/discord/`](https://github.com/openclaw/openclaw/blob/main/extensions/discord/) | - |
| Slack Action Handler | [`src/channels/plugins/actions/slack.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/actions/slack.ts) | - |

**Key Libraries**:
- Slack: `@slack/bolt` - Official Bolt framework
- Discord: `discord.js` - Most popular Discord library

</details>
