---
title: "Messaging Channels Overview - Supported Platforms | OpenClaw"
sidebarTitle: "Messaging Channels Overview"
subtitle: "Overview of supported messaging platforms and communication channels"
description: "Comprehensive overview of 12+ messaging channels supported by OpenClaw, including WhatsApp, Telegram, Discord, Slack, and other major platforms."
tags:
  - "Channels"
  - "Platforms"
  - "Integration"
order: 50
---

# Messaging Channels Overview - Supported Platforms

## What You'll Learn

After completing this course, you will be able to:
- Understand all messaging channels supported by OpenClaw
- Select the appropriate communication platform based on your needs
- Understand the features and limitations of each channel
- Plan multi-channel deployment strategies

## Core Concept

OpenClaw is a multi-channel AI gateway that supports integration with various communication platforms. You can connect multiple channels simultaneously, allowing your AI assistant to respond to messages across different platforms.

```
┌─────────────────────────────────────────────────────────────┐
│                   OpenClaw Multi-Channel Architecture        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│    │ WhatsApp │  │ Telegram │  │ Discord  │  │  Slack   │   │
│    └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│         │             │             │             │         │
│    ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐   │
│    │  Signal  │  │BlueBubble│  │MSTeams   │  │  Matrix  │   │
│    └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│         │             │             │             │         │
│         └─────────────┴─────────────┴─────────────┘         │
│                           │                                  │
│                           ▼                                  │
│              ┌────────────────────────┐                     │
│              │    Gateway Service     │                     │
│              │  Unified Message Routing│                     │
│              └───────────┬────────────┘                     │
│                          │                                  │
│                          ▼                                  │
│              ┌────────────────────────┐                     │
│              │    AI Agent (Pi)       │                     │
│              │ Message Processing &   │                     │
│              │ Response Generation    │                     │
│              └────────────────────────┘                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Supported Channels

### Core Channels (Built-in)

OpenClaw includes built-in support for the following core channels:

| Channel | Technical Solution | Features | Use Cases |
|---------|-------------------|----------|-----------|
| **WhatsApp** | Baileys | End-to-end encryption, global reach | Personal assistant, customer support |
| **Telegram** | grammY | Rich Bot API, powerful group features | Community management, team collaboration |
| **Discord** | discord.js | Gaming communities, voice channels | Gaming communities, developer groups |
| **Slack** | Bolt | Enterprise integrations, workflows | Internal teams, project collaboration |
| **Signal** | libsignal | High privacy, open source | Privacy-sensitive scenarios |
| **iMessage** | Native API | Apple ecosystem | macOS users |

### Extended Channels (Plugins)

Additional channels supported through extension plugins:

| Channel | Extension Path | Status | Notes |
|---------|---------------|--------|-------|
| **BlueBubbles** | `extensions/bluebubbles/` | ✅ Stable | Enhanced iMessage solution |
| **MS Teams** | `extensions/msteams/` | ✅ Stable | Microsoft Teams integration |
| **Matrix** | `extensions/matrix/` | ✅ Stable | Decentralized messaging |
| **Zalo** | `extensions/zalo/` | ✅ Stable | Popular in Vietnam |
| **IRC** | `src/irc/` | ✅ Built-in | Classic chat protocol |
| **Google Chat** | `src/googlechat/` | ✅ Built-in | Google Workspace |

## Hands-On Guide

### Step 1: View Installed Channels

**Why**  
To understand which channels are currently supported by your system.

```bash
# List all available channels
openclaw channels list

# Check channel status
openclaw channels status

# Check specific channel status
openclaw channels status whatsapp
```

**Expected Output**  
A list of installed and available channels:

```
┌─────────────────────────────────────┐
│  Available Channels                 │
├─────────────────────────────────────┤
│  ✅ whatsapp    - Ready             │
│  ✅ telegram    - Ready             │
│  ✅ discord     - Ready             │
│  ✅ slack       - Ready             │
│  ✅ signal      - Ready             │
│  🔧 bluebubbles - Extension         │
│  🔧 msteams     - Extension         │
└─────────────────────────────────────┘
```

### Step 2: Understand Channel Configuration Structure

**Why**  
Each channel has specific configuration requirements.

View the channel configuration type definition (`src/config/types.channels.ts`):

```typescript
type ChannelsConfig = {
  defaults?: ChannelDefaultsConfig;
  whatsapp?: WhatsAppConfig;
  telegram?: TelegramConfig;
  discord?: DiscordConfig;
  irc?: IrcConfig;
  googlechat?: GoogleChatConfig;
  slack?: SlackConfig;
  signal?: SignalConfig;
  imessage?: IMessageConfig;
  msteams?: MSTeamsConfig;
  [key: string]: any;  // Extended channels
};

type ChannelDefaultsConfig = {
  groupPolicy?: GroupPolicy;
  heartbeat?: ChannelHeartbeatVisibilityConfig;
};
```

### Step 3: Configure Default Channel Policies

**Why**  
Default policies affect the basic behavior of all channels.

```bash
# Set default group policy
openclaw config set channels.defaults.groupPolicy "owner-only"

# Configure heartbeat visibility
openclaw config set channels.defaults.heartbeat.showOk false
openclaw config set channels.defaults.heartbeat.showAlerts true
```

**Group Policy Options**

| Policy | Description |
|--------|-------------|
| `owner-only` | Only the owner can send commands |
| `admins` | Admins and owners can send commands |
| `everyone` | All members can send commands |
| `none` | Agent disabled in groups |

### Step 4: Enable/Disable Channels

**Why**  
To enable specific channels based on your requirements.

```bash
# Enable WhatsApp
openclaw config set channels.whatsapp.enabled true

# Disable specific channel
openclaw config set channels.discord.enabled false

# View channel configuration
openclaw config get channels
```

## Channel Selection Guide

### By Use Case

| Scenario | Recommended Channels | Reason |
|----------|---------------------|--------|
| Personal Assistant | WhatsApp / Telegram | Mobile-friendly, message sync |
| Team Collaboration | Slack / Discord | Channel management, rich integrations |
| Customer Support | WhatsApp / Telegram | High user adoption |
| Privacy-First | Signal | End-to-end encryption |
| Apple Ecosystem | BlueBubbles / iMessage | Native experience |
| Enterprise | MS Teams / Slack | Enterprise compliance |

### By Technical Requirements

| Requirement | Recommended Channels | Technical Features |
|-------------|---------------------|-------------------|
| Quick Deployment | Telegram | Simple bot registration |
| Self-Hosted | Signal / Matrix | Open source, self-hostable |
| File Sharing | Discord / Telegram | Large file support |
| Voice Interaction | Discord | Native voice channel support |

## Checkpoint ✅

Verify channel configuration:

```bash
# Check all channel statuses
openclaw channels status --probe

# Expected output
whatsapp:   ✅ Connected
telegram:   ✅ Connected
discord:    ⚠️  Not configured
slack:      ✅ Connected
```

## Common Pitfalls

::: warning Common Configuration Issues
1. **Channel Conflicts**  
   Problem: Multiple channels respond to the same conversation  
   Solution: Configure `allowFrom` to restrict access for specific channels

2. **Duplicate Messages**  
   Problem: Same message processed multiple times  
   Solution: Check `deduplication` configuration

3. **Group Permissions**  
   Problem: Agent not responding in groups  
   Solution: Check `groupPolicy` settings and permissions

4. **Extension Channels Not Loading**  
   Problem: Extensions installed but not visible  
   Solution: Restart the Gateway service
:::

## Summary

In this course, you learned:

- ✅ All messaging channels supported by OpenClaw
- ✅ Differences between core and extended channels
- ✅ Channel configuration structure and default policies
- ✅ How to select appropriate channels based on requirements
- ✅ Methods to enable/disable channels

## Next Lesson

> Next, we will learn **[WhatsApp Integration](../whatsapp-setup/)**.
>
> You will learn:
> - Baileys connection configuration
> - Pairing process and security settings
> - Advanced WhatsApp channel features

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
|---------|-----------|--------------|
| Channel Config Types | [`src/config/types.channels.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.channels.ts) | 1-55 |
| Channel Plugin Directory | [`src/channels/plugins/`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/) | - |
| Channel Registry | [`src/channels/registry.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/registry.ts) | - |
| Extension Directory | [`extensions/`](https://github.com/openclaw/openclaw/blob/main/extensions/) | - |

**Supported Channel Types** (based on source code):
- WhatsApp: `src/whatsapp/`
- Telegram: `src/telegram/`
- Discord: `src/discord/`
- Slack: `src/slack/`
- Signal: `src/signal/`
- iMessage: `src/imessage/`
- Web: `src/channels/web/`

</details>
