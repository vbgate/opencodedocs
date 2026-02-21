---
title: "Telegram Integration - Bot & Group Setup | OpenClaw Tutorial"
sidebarTitle: "Telegram Integration"
subtitle: "Telegram Integration - Bot & Group Setup"
description: "Learn how to create a Telegram Bot, configure Bot Token, manage group permissions, and achieve full Telegram channel integration."
tags:
  - "Telegram"
  - "Bot"
  - "Group"
order: 70
---

# Telegram Integration - Bot & Group Setup

## What You'll Learn

After completing this tutorial, you will be able to:
- Create and configure a Telegram Bot
- Obtain and set up the Bot Token
- Manage group permissions and commands
- Handle mentions and replies in groups

## Your Current Challenge

You want to use an AI assistant via Telegram, but you may be confused about:
- How do I create a Telegram Bot?
- Where should I store the Bot Token?
- How do I make the Bot work in groups?

## Core Concepts

OpenClaw uses the **grammY** library to interact with the Telegram Bot API. Telegram Bot is one of the easiest channels to integrate, requiring no complex pairing process.

```
┌─────────────────────────────────────────────────────────────┐
│                 Telegram Bot Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐      ┌─────────────┐      ┌──────────┐   │
│   │   User/     │      │  Telegram   │      │ OpenClaw │   │
│   │   Group     │ ←──→ │   Server    │ ←──→ │  Gateway │   │
│   └─────────────┘      └─────────────┘      └────┬─────┘   │
│                                                  │         │
│                                                  ▼         │
│                                        ┌─────────────────┐ │
│                                        │   grammY Lib    │ │
│                                        │   Bot API Client│ │
│                                        └─────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Telegram Bot Features

- **Easy to Create**: Done in minutes via @BotFather
- **WebHook Support**: Receive messages in real-time
- **Rich Formatting**: Supports Markdown, buttons, inline queries
- **Group-Friendly**: Supports group management and permission control

## Let's Get Started

### Step 1: Create a Telegram Bot

**Why**  
You need to create a Bot through Telegram's official @BotFather to obtain a Token.

1. Open Telegram and search for **@BotFather**
2. Send the `/newbot` command
3. Follow the prompts to enter:
   - Bot name (display name, e.g., "My AI Assistant")
   - Bot username (unique identifier, e.g., `my_ai_assistant_bot`, must end with `bot`)

**You should see**  
@BotFather replies with your Bot Token:

```
✅ Done! Congratulations on your new bot.

You will find it at t.me/my_ai_assistant_bot

Use this token to access the HTTP API:
123456789:ABCdefGHIjklMNOpqrsTUVwxyz

Keep your token secure and store it safely.
```

::: warning Security Reminder
**Keep your Bot Token safe!** Anyone who obtains the Token can control your Bot.
:::

### Step 2: Configure the Bot Token

**Why**  
The Token is the Bot's identity credential and needs to be configured in OpenClaw.

```bash
# Set the Bot Token
openclaw config set channels.telegram.botToken "123456789:ABCdefGHIjklMNOpqrsTUVwxyz"

# Enable the Telegram channel
openclaw config set channels.telegram.enabled true

# Verify the configuration
openclaw config get channels.telegram
```

**Security Storage Recommendation**  
Use environment variables to store the Token:

```bash
# Set environment variable
export TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"

# Configure to reference the environment variable
openclaw config set channels.telegram.botToken "${TELEGRAM_BOT_TOKEN}"
```

### Step 3: Configure WebHook (Recommended)

**Why**  
WebHook is more efficient than polling and can receive messages in real-time.

```bash
# Configure WebHook URL (requires a publicly accessible address)
openclaw config set channels.telegram.webhookUrl "https://your-domain.com/webhook/telegram"

# If using local development, you can use polling mode first
openclaw config set channels.telegram.usePolling true
```

**Deployment Methods Comparison**

| Method | Pros | Cons | Use Case |
| --- | --- | --- | --- |
| WebHook | Real-time, efficient, low latency | Requires public address | Production |
| Polling | Simple, no public address needed | Delayed, high resource consumption | Local development |

### Step 4: Configure Bot Commands

**Why**  
Set up the command menu so users know what interactions are available.

1. Send `/setcommands` to @BotFather
2. Select your Bot
3. Send the command list:

```
start - Start using the AI assistant
help - Get help information
reset - Reset the current conversation
status - Check system status
```

### Step 5: Configure Group Support

**Why**  
Allow the Bot to respond to messages in groups.

**Add to Group**:
1. Open the target group in Telegram
2. Click the group name → **Add Members**
3. Search for your Bot username (e.g., `@my_ai_assistant_bot`)
4. Confirm the addition

**Configure Group Permissions**:

```bash
# Set group policy
openclaw config set channels.telegram.groupPolicy "admins"

# Configure mention trigger
openclaw config set channels.telegram.triggerOnMention true

# Configure reply trigger
openclaw config set channels.telegram.triggerOnReply true
```

**Group Policy Options**

| Policy | Description |
| --- | --- |
| `owner-only` | Only the group owner can trigger |
| `admins` | Admins and owners can trigger |
| `everyone` | All members can trigger |
| `none` | Disabled in groups |

### Step 6: Configure Privacy Mode

**Why**  
Telegram Bot has a privacy mode that affects which messages the Bot can receive.

Set it in @BotFather:
1. Send `/mybots`
2. Select your Bot
3. Click **Bot Settings** → **Group Privacy**
4. Select **Turn off** (disable privacy mode)

::: info Privacy Mode Explanation
- **On**: Bot can only receive messages sent directly to it (@mentions or replies)
- **Off**: Bot can receive all messages in the group
:::

### Step 7: Test the Bot

**Why**  
Verify the configuration is correct and the Bot is working properly.

**Private Chat Test**:
1. Find your Bot (e.g., `@my_ai_assistant_bot`)
2. Send `/start`
3. Send a test message: "Hello"

**Group Test**:
1. @mention the Bot in the group: "@my_ai_assistant_bot Hello"
2. Or reply to the Bot's message

**You should see**  
The Bot replies with an AI-generated response.

## Checkpoint ✅

Verify the Telegram configuration:

```bash
# Check Telegram channel status
openclaw channels status telegram

# Expected output
┌─────────────────────────────────────┐
│  Telegram Status                    │
├─────────────────────────────────────┤
│  Status:     ✅ Connected           │
│  Bot:        @my_ai_assistant_bot   │
│  Mode:       WebHook                │
│  Webhook:    ✅ Active              │
└─────────────────────────────────────┘
```

Test Bot information:

```bash
# Get Bot info
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe
```

## Troubleshooting

::: warning Common Issues
1. **Token Error**  
   Symptom: `404 Not Found` or `Unauthorized`  
   Solution: Check if the Token is correct and has no extra spaces

2. **WebHook Setup Failed**  
   Symptom: `WebHook was not set`  
   Solution: Ensure the WebHook URL is publicly accessible and uses HTTPS

3. **Bot Not Responding to Group Messages**  
   Symptom: No response in groups  
   Solution: Check if privacy mode is turned off and confirm the Bot has been added to the group

4. **Commands Not Showing**  
   Symptom: Command menu is empty  
   Solution: Resend `/setcommands` to @BotFather

5. **Insufficient Permissions**  
   Symptom: `Bot is not a member`  
   Solution: Ensure the Bot has been added to the group and has permission to send messages
:::

## Advanced Configuration

### Configure Message Format

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "parseMode": "MarkdownV2",
      "disableWebPagePreview": false,
      "allowFrom": ["@username1", "@username2"],
      "groupPolicy": "admins",
      "dmPolicy": "allow"
    }
  }
}
```

### Configure Inline Queries

```bash
# Enable inline mode (set in @BotFather)
# Send /setinline to @BotFather

# Configure inline query handling
openclaw config set channels.telegram.inlineQueries.enabled true
```

## Summary

In this tutorial, you learned:

- ✅ Create a Telegram Bot via @BotFather
- ✅ Configure the Bot Token in OpenClaw
- ✅ Set up WebHook or polling mode
- ✅ Configure the Bot command menu
- ✅ Add the Bot to groups and set permissions
- ✅ Handle privacy mode settings
- ✅ Test the Bot in private chats and groups

## Next Steps

> In the next tutorial, we'll cover **[Slack and Discord Integration](../slack-discord-setup/)**.
>
> You'll learn:
> - Slack Bolt framework configuration
> - Discord.js bot setup
> - OAuth flow and permission management

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand and view source locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line |
| --- | --- | --- |
| Telegram Implementation | [`src/telegram/`](https://github.com/openclaw/openclaw/blob/main/src/telegram/) | - |
| Telegram Config Types | [`src/config/types.telegram.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.telegram.ts) | - |
| Message Outbound Handler | [`src/channels/plugins/outbound/telegram.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/outbound/telegram.ts) | - |
| Message Action Handler | [`src/channels/plugins/actions/telegram.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/actions/telegram.ts) | - |

**grammY Framework Features**:
- Native TypeScript support
- Built-in WebHook and polling
- Middleware system
- Session management

</details>
