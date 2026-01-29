---
title: "Multi-Channel System: 13+ Channels | Clawdbot"
sidebarTitle: "Multi-Channel System Overview"
subtitle: "Multi-Channel System Overview: All Communication Channels Supported by Clawdbot"
description: "Master 13+ Clawdbot channels: WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage. Learn auth, features, and choose your best channel."
tags:
  - "Channels"
  - "Platforms"
  - "Multi-Channel"
  - "Getting Started"
prerequisite:
  - "getting-started"
order: 60
---

# Multi-Channel System Overview: All Communication Channels Supported by Clawdbot

## What You'll Learn

After completing this tutorial, you will be able to:

- ✅ Understand 13+ communication channels supported by Clawdbot
- ✅ Master authentication methods and configuration essentials for each channel
- ✅ Choose the most suitable channel based on your use case
- ✅ Understand the security value of DM pairing protection mechanism

## Your Current Challenge

You might be thinking:

- "Which platforms does Clawdbot support?"
- "What's the difference between WhatsApp, Telegram, and Slack?"
- "Which channel is the simplest and fastest?"
- "Do I need to register a bot on every platform?"

Good news: **Clawdbot provides rich channel options, and you can freely combine them based on your habits and needs**.

## When to Use This

When you need to:

- 🌐 **Multi-channel unified management** — One AI assistant, available across multiple channels simultaneously
- 🤝 **Team collaboration** — Integration with Slack, Discord, Google Chat, and other workplace tools
- 💬 **Personal chat** — WhatsApp, Telegram, iMessage, and other daily communication tools
- 🔧 **Flexible extension** — Support for regional platforms like LINE, Zalo, etc.

::: tip Value of Multi-Channel
Benefits of using multiple channels:
- **Seamless switching**: Use WhatsApp at home, Slack at work, Telegram on the go
- **Cross-device sync**: Messages and conversations stay consistent across all channels
- **Coverage**: Different platforms have different advantages; combining them yields the best results
:::

---

## Core Concept

Clawdbot's channel system adopts a **plugin architecture**:

```
┌─────────────────────────────────────────────────┐
│              Gateway (Control Plane)            │
│         ws://127.0.0.1:18789                    │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┼───────┬─────────┬───────┐
        │       │       │         │       │
    WhatsApp  Telegram  Slack  Discord  ... etc. 13+ channels
        │       │       │         │       │
    Baileys  grammY   Bolt  discord.js ...
```

**Key Concepts**:

| Concept         | Role                         |
|--- | ---|
| **Channel Plugin** | Each channel is an independent plugin |
| **Unified Interface** | All channels use the same API |
| **DM Protection**   | Pairing mechanism enabled by default, rejects unknown senders |
| **Group Support**  | Supports `@mention` and command triggers |

---

## Supported Channels Overview

Clawdbot supports **13+ communication channels**, divided into two categories:

### Core Channels (Built-in)

| Channel           | Authentication Method | Difficulty | Features                              |
|--- | --- | --- | ---|
| **Telegram**     | Bot Token            | ⭐         | Simplest and fastest, recommended for beginners |
| **WhatsApp**     | QR Code / Phone Link | ⭐⭐       | Uses real number, recommended separate phone + eSIM |
| **Slack**        | Bot Token + App Token | ⭐⭐       | Top choice for workplaces, Socket Mode |
| **Discord**      | Bot Token            | ⭐⭐       | Community and gaming scenarios, feature-rich |
| **Google Chat**  | OAuth / Service Account | ⭐⭐⭐    | Google Workspace enterprise integration |
| **Signal**       | signal-cli           | ⭐⭐⭐     | Highly secure, complex setup |
| **iMessage**     | imsg (macOS)        | ⭐⭐⭐     | macOS exclusive, still in development |

### Extended Channels (External Plugins)

| Channel             | Authentication Method | Type       | Features                              |
|--- | --- | --- | ---|
| **WebChat**         | Gateway WebSocket   | Built-in   | No third-party auth required, simplest |
| **LINE**            | Messaging API       | External Plugin | Popular in Asian markets |
| **BlueBubbles**     | Private API         | Extended Plugin | iMessage extension, supports remote devices |
| **Microsoft Teams** | Bot Framework       | Extended Plugin | Enterprise collaboration |
| **Matrix**          | Matrix Bot SDK      | Extended Plugin | Decentralized communication |
| **Zalo**            | Zalo OA             | Extended Plugin | Popular in Vietnam |
| **Zalo Personal**   | Personal Account    | Extended Plugin | Zalo personal account |

::: info How to Choose a Channel?
- **Beginners**: Start with Telegram or WebChat
- **Personal use**: WhatsApp (if you have a number), Telegram
- **Team collaboration**: Slack, Google Chat, Discord
- **Privacy first**: Signal
- **Apple ecosystem**: iMessage, BlueBubbles
:::

---

## Core Channels Detailed

### 1. Telegram (Recommended for Beginners)

**Why recommended**:
- ⚡ Simplest configuration flow (only needs Bot Token)
- 📱 Native support for Markdown and rich media
- 🌍 Globally available, no special network environment needed

**Authentication method**:
1. Find `@BotFather` in Telegram
2. Send `/newbot` command
3. Set up bot name as prompted
4. Get Bot Token (format: `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`)

**Configuration example**:
```yaml
channels:
  telegram:
    botToken: "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"  # Default DM pairing protection
    allowFrom: ["*"]     # Allow all users (after pairing)
```

**Features**:
- ✅ Supports Thread/Topic
- ✅ Supports Reaction emojis
- ✅ Supports files, images, videos

---

### 2. WhatsApp (Recommended for Personal Users)

**Why recommended**:
- 📱 Uses real phone number, friends don't need to add new contacts
- 🌍 Most popular instant messaging tool globally
- 📞 Supports voice messages and calls

**Authentication method**:
1. Run `clawdbot channels login whatsapp`
2. Scan QR code (similar to WhatsApp Web)
3. Or use phone link (new feature)

**Configuration example**:
```yaml
channels:
  whatsapp:
    accounts:
      my-phone:
        dmPolicy: "pairing"  # Default DM pairing protection
        allowFrom: ["*"]     # Allow all users (after pairing)
```

**Features**:
- ✅ Supports rich media (images, videos, documents)
- ✅ Supports voice messages
- ✅ Supports Reaction emojis
- ⚠️ **Requires separate phone** (recommended eSIM + backup device)

::: warning WhatsApp Restrictions
- Don't log in with the same number in multiple places simultaneously
- Avoid frequent reconnections (may be temporarily banned)
- Recommended to use a separate test number
:::

---

### 3. Slack (Recommended for Team Collaboration)

**Why recommended**:
- 🏢 Widely used by enterprises and teams
- 🔧 Supports rich Actions and Slash Commands
- 📋 Seamless integration with workflows

**Authentication method**:
1. Create an app at [Slack API](https://api.slack.com/apps)
2. Enable Bot Token Scopes
3. Enable App-Level Token
4. Enable Socket Mode
5. Get Bot Token and App Token

**Configuration example**:
```yaml
channels:
  slack:
    botToken: "xoxb-YOUR-BOT-TOKEN-HERE"
    appToken: "xapp-YOUR-APP-TOKEN-HERE"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**Features**:
- ✅ Supports channels, DMs, and groups
- ✅ Supports Slack Actions (create channels, invite users, etc.)
- ✅ Supports file uploads and emojis
- ⚠️ Requires Socket Mode enabled (to avoid exposing ports)

---

### 4. Discord (Recommended for Community Scenarios)

**Why recommended**:
- 🎮 Top choice for gaming and community scenarios
- 🤖 Supports Discord-specific features (roles, channel management)
- 👥 Powerful group and community features

**Authentication method**:
1. Create an app at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a Bot user
3. Enable Message Content Intent
4. Get Bot Token

**Configuration example**:
```yaml
channels:
  discord:
    botToken: "MTIzNDU2Nzg5MDEyMzQ1Njgw.GhIJKlmNoPQRsTUVwxyZABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**Features**:
- ✅ Supports role and permission management
- ✅ Supports channels, threads, emojis
- ✅ Supports specific Actions (create channels, manage roles, etc.)
- ⚠️ Requires correct Intents configuration

---

### 5. Other Core Channels

#### Google Chat
- **Use case**: Google Workspace enterprise users
- **Authentication**: OAuth or Service Account
- **Features**: Integration with Gmail, Calendar

#### Signal
- **Use case**: Privacy-first users
- **Authentication**: signal-cli
- **Features**: End-to-end encryption, highly secure

#### iMessage
- **Use case**: macOS users
- **Authentication**: imsg (macOS exclusive)
- **Features**: Apple ecosystem integration, still in development

---

## Extended Channels Introduction

### WebChat (Simplest)

**Why recommended**:
- 🚀 No third-party account or Token required
- 🌐 Built-in Gateway WebSocket support
- 🔧 Quick for development and debugging

**How to use**:

After starting Gateway, access via:
- **macOS/iOS app**: Native SwiftUI interface
- **Control UI**: Browser access to the console's chat tab

**Features**:
- ✅ No configuration needed, works out of the box
- ✅ Supports testing and debugging
- ✅ Shares sessions and routing rules with other channels
- ⚠️ Local access only (can be exposed via Tailscale)

---

### LINE (Asian Users)

**Use case**: LINE users in Japan, Taiwan, Thailand, etc.

**Authentication**: Messaging API (LINE Developers Console)

**Features**:
- ✅ Supports buttons, quick replies
- ✅ Widely used in Asian markets
- ⚠️ Requires approval and business account

---

### BlueBubbles (iMessage Extension)

**Use case**: Need remote iMessage access

**Authentication**: Private API

**Features**:
- ✅ Remote control of iMessage
- ✅ Supports multiple devices
- ⚠️ Requires separate BlueBubbles server

---

### Microsoft Teams (Enterprise Collaboration)

**Use case**: Enterprises using Office 365

**Authentication**: Bot Framework

**Features**:
- ✅ Deep integration with Teams
- ✅ Supports Adaptive Cards
- ⚠️ Complex configuration

---

### Matrix (Decentralized)

**Use case**: Decentralized communication enthusiasts

**Authentication**: Matrix Bot SDK

**Features**:
- ✅ Federated network
- ✅ End-to-end encryption
- ⚠️ Requires Homeserver configuration

---

### Zalo / Zalo Personal (Vietnam Users)

**Use case**: Vietnam market

**Authentication**: Zalo OA / Personal Account

**Features**:
- ✅ Supports personal and business accounts
- ⚠️ Regional restriction (Vietnam)

---

## DM Pairing Protection Mechanism

### What is DM Pairing Protection?

Clawdbot enables **DM Pairing Protection** by default (`dmPolicy="pairing"`), which is a security feature:

1. **Unknown senders** will receive a pairing code
2. Messages won't be processed until you approve the pairing
3. After approval, the sender is added to the local whitelist

::: warning Why Do We Need Pairing Protection?
Clawdbot connects to real messaging platforms, **must treat inbound DMs as untrusted input**. Pairing protection can:
- Prevent spam and abuse
- Avoid processing malicious commands
- Protect your AI quota and privacy
:::

### How to Approve Pairing?

```bash
# View pending pairing requests
clawdbot pairing list

# Approve pairing
clawdbot pairing approve <channel> <code>

# Example: Approve Telegram sender
clawdbot pairing approve telegram 123456
```

### Pairing Flow Example

```
Unknown sender: Hello AI!
Clawdbot: 🔒 Please pair first. Pairing code: ABC123
Your action: clawdbot pairing approve telegram ABC123
Clawdbot: ✅ Pairing successful! You can now send messages.
```

::: tip Disable DM Pairing Protection (Not Recommended)
If you want public access, you can set:
```yaml
channels:
  telegram:
    dmPolicy: "open"
    allowFrom: ["*"]  # Allow all users
```

⚠️ This reduces security, use with caution!
:::

---

## Group Message Handling

### @mention Trigger

By default, group messages require **@mention** to trigger the bot:

```yaml
channels:
  slack:
    allowUnmentionedGroups: false  # Default: requires @mention
```

### Command Trigger

You can also use command prefix to trigger:

```bash
# Send in a group
/ask Explain quantum entanglement
/help List available commands
/new Start new session
```

### Configuration Example

```yaml
channels:
  discord:
    allowUnmentionedGroups: false  # Requires @mention
    # or
    allowUnmentionedGroups: true   # Respond to all messages (not recommended)
```

---

## Configuring Channels: Wizard vs Manual

### Method A: Use Onboarding Wizard (Recommended)

```bash
clawdbot onboard
```

The wizard will guide you through:
1. Choose channels
2. Configure authentication (Token, API Key, etc.)
3. Set DM policies
4. Test connection

### Method B: Manual Configuration

Edit configuration file `~/.clawdbot/clawdbot.json`:

```yaml
channels:
  telegram:
    botToken: "your-bot-token"
    dmPolicy: "pairing"
    allowFrom: ["*"]
  whatsapp:
    accountId: "my-phone"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

Restart Gateway to apply configuration:

```bash
clawdbot gateway restart
```

---

## Checkpoint ✅

After completing this tutorial, you should be able to:

- [ ] List all channels supported by Clawdbot
- [ ] Understand DM pairing protection mechanism
- [ ] Choose the most suitable channel for your needs
- [ ] Know how to configure channels (wizard or manual)
- [ ] Understand group message trigger methods

::: tip Next Step
Choose a channel and start configuring:
- [WhatsApp Channel Configuration](../whatsapp/) - Use real number
- [Telegram Channel Configuration](../telegram/) - Simplest and fastest
- [Slack Channel Configuration](../slack/) - Top choice for team collaboration
- [Discord Channel Configuration](../discord/) - Community scenarios
:::

---

## Common Pitfalls

### ❌ Forgot to Enable DM Pairing Protection

**Wrong approach**:
```yaml
channels:
  telegram:
    dmPolicy: "open"  # Too open!
```

**Correct approach**:
```yaml
channels:
  telegram:
    dmPolicy: "pairing"  # Secure default
```

::: danger Risk of Open DM
Opening DM means anyone can send messages to your AI assistant, which may lead to:
- Quota abuse
- Privacy leakage
- Malicious command execution
:::

### ❌ WhatsApp Logged in Multiple Places

**Wrong approach**:
- Log in with the same number on both phone and Clawdbot
- Frequently reconnect WhatsApp

**Correct approach**:
- Use a separate test number
- Avoid frequent reconnections
- Monitor connection status

### ❌ Slack Not Enabled Socket Mode

**Wrong approach**:
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    # Missing appToken
```

**Correct approach**:
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    appToken: "xapp-..."  # Required
```

### ❌ Discord Intents Misconfigured

**Wrong approach**:
- Only enable basic Intents
- Forgot to enable Message Content Intent

**Correct approach**:
- Enable all required Intents in Discord Developer Portal
- Especially Message Content Intent

---

## Summary

In this lesson, you learned:

1. ✅ **Channel Overview**: Clawdbot supports 13+ communication channels
2. ✅ **Core Channels**: Features and configuration of Telegram, WhatsApp, Slack, Discord
3. ✅ **Extended Channels**: Special channels like LINE, BlueBubbles, Teams, Matrix
4. ✅ **DM Protection**: Security value and usage of pairing mechanism
5. ✅ **Group Handling**: @mention and command trigger mechanisms
6. ✅ **Configuration Methods**: Wizard and manual configuration

**Next Steps**:

- Learn [WhatsApp Channel Configuration](../whatsapp/), set up real number
- Learn [Telegram Channel Configuration](../telegram/), fastest way to get started
- Understand [Slack Channel Configuration](../slack/), team collaboration integration
- Master [Discord Channel Configuration](../discord/), community scenarios

---

## Preview of Next Lesson

> In the next lesson, we'll learn **[WhatsApp Channel Configuration](../whatsapp/)**.
>
> You'll learn:
> - How to log in to WhatsApp using QR Code or phone link
> - How to configure DM policies and group rules
> - How to manage multiple WhatsApp accounts
> - How to troubleshoot WhatsApp connection issues

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature            | File Path                                                                                               | Line  |
|--- | --- | ---|
| Channel Registry    | [`src/channels/registry.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/registry.ts) | 7-100 |
| Channel Plugin Dir | [`src/channels/plugins/`](https://github.com/moltbot/moltbot/tree/main/src/channels/plugins/)      | Full  |
| Channel Meta Types | [`src/channels/plugins/types.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/types.core.ts) | 74-93 |
| DM Pairing Mechanism | [`src/channels/plugins/pairing.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/pairing.ts) | Full |
| Group @mention    | [`src/channels/plugins/group-mentions.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/group-mentions.ts) | Full |
| Allowlist Match   | [`src/channels/plugins/allowlist-match.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/allowlist-match.ts) | Full |
| Channel Directory Config | [`src/channels/plugins/directory-config.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/directory-config.ts) | Full |
| WhatsApp Plugin   | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | Full |
| Telegram Plugin   | [`src/channels/plugins/onboarding/telegram.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/telegram.ts) | Full |
| Slack Plugin      | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/slack.ts) | Full |
| Discord Plugin    | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/discord.ts) | Full |

**Key Constants**:
- `CHAT_CHANNEL_ORDER`: Core channel order array (from `src/channels/registry.ts:7-15`)
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`: Default channel (from `src/channels/registry.ts:21`)
- `dmPolicy="pairing"`: Default DM pairing policy (from `README.md:110`)

**Key Types**:
- `ChannelMeta`: Channel metadata interface (from `src/channels/plugins/types.core.ts:74-93`)
- `ChannelAccountSnapshot`: Channel account state snapshot (from `src/channels/plugins/types.core.ts:95-142`)
- `ChannelSetupInput`: Channel configuration input interface (from `src/channels/plugins/types.core.ts:19-51`)

**Key Functions**:
- `listChatChannels()`: List all core channels (`src/channels/registry.ts:114-116`)
- `normalizeChatChannelId()`: Normalize channel ID (`src/channels/registry.ts:126-133`)
- `buildChannelUiCatalog()`: Build UI catalog (`src/channels/plugins/catalog.ts:213-239`)

</details>
