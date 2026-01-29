---
title: "Discord Channel Configuration and Usage | Clawdbot Tutorial"
sidebarTitle: "Discord Channel"
subtitle: "Discord Channel Configuration and Usage"
description: "Learn how to create a Discord Bot and configure it with Clawdbot. This tutorial covers creating a bot in Discord Developer Portal, setting up Gateway Intents permissions, configuring Bot Token, generating OAuth2 invite URL, DM pairing protection mechanism, server channel whitelist configuration, AI Discord tool invocation permission management, and common troubleshooting steps."
tags:
  - "Channel Configuration"
  - "Discord"
  - "Bot"
prerequisite:
  - "start-getting-started"
order: 100
---

# Discord Channel Configuration and Usage

## What You'll Learn

After completing this tutorial, you will be able to:

- Create a Discord Bot and obtain Bot Token
- Configure Clawdbot to integrate with Discord Bot
- Use AI assistant in Discord DMs and server channels
- Configure access control (DM pairing, channel whitelist)
- Enable AI to call Discord tools (send messages, create channels, manage roles, etc.)

## Your Current Challenge

You are already using Discord to communicate with friends or teams, and you want to interact with your AI assistant directly in Discord without switching applications. You might encounter the following problems:

- Don't know how to create a Discord Bot
- Unclear about which permissions are needed for the Bot to work properly
- Want to control who can interact with the Bot (prevent abuse by strangers)
- Hope to configure different behaviors in different server channels

This tutorial will guide you through solving these problems step by step.

## When to Use This

Discord channel is suitable for these scenarios:

- ✅ You are a heavy Discord user, and most of your communication is on Discord
- ✅ You want to add AI functionality to your Discord server (e.g., smart assistant in `#help` channel)
- ✅ You want to interact with AI through Discord DMs (more convenient than opening WebChat)
- ✅ You need AI to perform management operations in Discord (create channels, send messages, etc.)

::: info Discord channel is based on discord.js and supports full Bot API functionality.
:::

## 🎒 Prerequisites

**Requirements**:
- Completed [Quick Start](../../start/getting-started/), Gateway can run
- Node.js ≥ 22
- Discord account (can create applications)

**Information needed**:
- Discord Bot Token (will teach you how to obtain it later)
- Server ID (optional, for configuring specific channels)
- Channel ID (optional, for fine-grained control)

## Core Architecture

### How Discord Channel Works

Discord channel communicates with Discord via **official Bot API**:

```
Discord user
     ↓
  Discord server
     ↓
   Discord Bot Gateway
     ↓ (WebSocket)
   Clawdbot Gateway
     ↓
   AI Agent (Claude/GPT, etc.)
     ↓
   Discord Bot API (send reply)
     ↓
Discord server
     ↓
Discord user (see reply)
```

**Key points**:
- Bot receives messages via WebSocket (Gateway → Bot)
- Clawdbot forwards messages to AI Agent for processing
- AI can call `discord` tools to perform Discord-specific operations
- All responses are sent back to Discord via Bot API

### Difference Between DM and Server Channels

| Type | Session Isolation | Default Behavior | Use Case |
| --- | --- | --- | --- |
| **DM** | All DMs share `agent:main:main` session | Requires pairing protection | Personal conversation, continuous context |
| **Server Channel** | Each channel has independent session `agent:<agentId>:discord:channel:<channelId>` | Requires @mention to reply | Server smart assistant, multi-channel parallel |

::: tip
Server channel sessions are completely isolated and do not interfere with each other. Conversations in `#help` will not appear in `#general`.
:::

### Default Security Mechanism

Discord channel enables **DM pairing protection** by default:

```
Unknown user → Send DM → Clawdbot
                              ↓
                      Reject processing, return pairing code
                              ↓
                User needs to execute `clawdbot pairing approve discord <code>`
                              ↓
                            Pairing successful, can converse
```

This prevents unknown users from directly interacting with your AI assistant.

---

## Follow Along

### Step 1: Create Discord Application and Bot

**Why**
Discord Bot needs an "identity" to connect to Discord servers. This identity is the Bot Token.

#### 1.1 Create Discord Application

1. Open [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Enter application name (e.g., `Clawdbot AI`)
4. Click **Create**

#### 1.2 Add Bot User

1. Click **Bot** in the left navigation bar
2. Click **Add Bot** → **Reset Token** → **Reset Token**
3. **Important**: Copy Bot Token immediately (shown only once!)

```
Bot Token format: MTAwOTk1MDk5NjQ5NTExNjUy.Gm9...
(Changes every time you reset, keep it safe!)
```

#### 1.3 Enable Necessary Gateway Intents

Discord does not let Bot read message content by default, you need to enable it manually.

In **Bot → Privileged Gateway Intents**, enable:

| Intent | Required | Description |
| --- | --- | --- |
| **Message Content Intent** | ✅ **Required** | Read message text content (without it, Bot cannot see messages) |
| **Server Members Intent** | ⚠️ **Recommended** | For member lookup and username resolution |

::: danger Prohibited
Do not enable **Presence Intent** unless you actually need user online status.
:::

**You should see**: Both switches turn to green (ON) state.

---

### Step 2: Generate Invite URL and Add to Server

**Why**
Bot needs permissions to read and send messages in servers.

1. Click **OAuth2 → URL Generator** in the left navigation bar
2. In **Scopes**, select:
   - ✅ **bot**
   - ✅ **applications.commands** (for native commands)

3. In **Bot Permissions**, at minimum select:

| Permission | Description |
| --- | --- |
| **View Channels** | View channels |
| **Send Messages** | Send messages |
| **Read Message History** | Read message history |
| **Embed Links** | Embed links |
| **Attach Files** | Upload files |

Optional permissions (add as needed):
- **Add Reactions** (Add emoji reactions)
- **Use External Emojis** (Use custom emojis)

::: warning Security Tip
Avoid granting **Administrator** permission unless you are debugging and fully trust the Bot.
:::

4. Copy the generated URL
5. Open URL in browser
6. Select your server, click **Authorize**

**You should see**: Bot successfully joins server, displaying as green online status.

---

### Step 3: Get Necessary IDs (Server, Channel, User)

**Why**
Clawdbot configuration prefers to use IDs (numbers) because IDs never change.

#### 3.1 Enable Discord Developer Mode

1. Discord desktop/web version → **User Settings**
2. **Advanced** → Enable **Developer Mode**

#### 3.2 Copy IDs

| Type | Action |
| --- | --- |
| **Server ID** | Right-click server name → **Copy Server ID** |
| **Channel ID** | Right-click channel (e.g., `#general`) → **Copy Channel ID** |
| **User ID** | Right-click user avatar → **Copy User ID** |

::: tip ID vs Name
Prioritize using IDs in configuration. Names may change, but IDs will never change.
:::

**You should see**: ID copied to clipboard (format: `123456789012345678`).

---

### Step 4: Configure Clawdbot to Connect to Discord

**Why**
Tell Clawdbot how to connect to your Discord Bot.

#### Method 1: Via Environment Variables (Recommended, for servers)

```bash
export DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"

clawdbot gateway --port 18789
```

#### Method 2: Via Configuration File

Edit `~/.clawdbot/clawdbot.json`:

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "YOUR_BOT_TOKEN"  // Token copied in Step 1
    }
  }
}
```

::: tip Environment Variable Priority
If both environment variables and configuration file are set, **configuration file takes priority**.
:::

**You should see**: After starting Gateway, Discord Bot shows as online status.

---

### Step 5: Verify Connection and Test

**Why**
Ensure configuration is correct, Bot can receive and send messages normally.

1. Start Gateway (if not already started):

```bash
clawdbot gateway --port 18789 --verbose
```

2. Check Discord Bot status:
   - Bot should show as **green online** in server member list
   - If gray offline, check if Token is correct

3. Send test message:

In Discord:
- **DM**: Send message directly to Bot (you will receive pairing code, see next section)
- **Server channel**: @mention Bot, e.g., `@ClawdbotAI hello`

**You should see**: Bot replies with a message (content depends on your AI model).

::: tip Test failed?
If Bot doesn't reply, check the [Troubleshooting](#troubleshooting) section.
:::

---

## Checkpoint ✅

Before continuing, confirm the following:

- [ ] Bot Token is correctly configured
- [ ] Bot has successfully joined server
- [ ] Message Content Intent is enabled
- [ ] Gateway is running
- [ ] Bot shows as online in Discord
- [ ] @mentioning Bot receives a reply

---

## Advanced Configuration

### DM Access Control

Default policy is `pairing` (pairing mode), suitable for personal use. You can adjust as needed:

| Policy | Description | Configuration Example |
| --- | --- | --- |
| **pairing** (default) | Strangers receive pairing code, need manual approval | `"dm": { "policy": "pairing" }` |
| **allowlist** | Only allow users in the list | `"dm": { "policy": "allowlist", "allowFrom": ["123456", "alice"] }` |
| **open** | Allow everyone (requires `allowFrom` to include `"*"`) | `"dm": { "policy": "open", "allowFrom": ["*"] }` |
| **disabled** | Disable all DMs | `"dm": { "enabled": false }` |

#### Configuration Example: Allow Specific Users

```json5
{
  channels: {
    discord: {
      dm: {
        enabled: true,
        policy: "allowlist",
        allowFrom: [
          "123456789012345678",  // User ID
          "@alice",                   // Username (will be resolved to ID)
          "alice#1234"              // Full username
        ]
      }
    }
  }
}
```

#### Approve Pairing Request

When unknown user sends DM for the first time, they will receive pairing code. Approval method:

```bash
clawdbot pairing approve discord <pairing_code>
```

### Server Channel Configuration

#### Basic Configuration: Only Allow Specific Channels

```json5
{
  channels: {
    discord: {
      groupPolicy: "allowlist",  // Whitelist mode (default)
      guilds: {
        "123456789012345678": {
          requireMention: true,  // Need @mention to reply
          channels: {
            help: { allow: true },    // Allow #help
            general: { allow: true } // Allow #general
          }
        }
      }
    }
  }
}
```

::: tip
`requireMention: true` is recommended configuration to avoid Bot being "too smart" in public channels.
:::

#### Advanced Configuration: Channel-Specific Behavior

```json5
{
  channels: {
    discord: {
      guilds: {
        "123456789012345678": {
          slug: "my-server",              // Display name (optional)
          reactionNotifications: "own",      // Only trigger events for reactions to Bot's own messages
          channels: {
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"], // Only specific users can trigger
              skills: ["search", "docs"],    // Limit available skills
              systemPrompt: "Keep answers under 50 words."  // Extra system prompt
            }
          }
        }
      }
    }
  }
}
```

### Discord Tool Operations

AI Agent can call `discord` tools to perform Discord-specific operations. Control permissions via `channels.discord.actions`:

| Operation Category | Default Status | Description |
| --- | --- | --- |
| **reactions** | ✅ Enabled | Add/read emoji reactions |
| **messages** | ✅ Enabled | Read/send/edit/delete messages |
| **threads** | ✅ Enabled | Create/reply to threads |
| **channels** | ✅ Enabled | Create/edit/delete channels |
| **pins** | ✅ Enabled | Pin/unpin messages |
| **search** | ✅ Enabled | Search messages |
| **memberInfo** | ✅ Enabled | Query member information |
| **roleInfo** | ✅ Enabled | Query role list |
| **roles** | ❌ **Disabled** | Add/remove roles |
| **moderation** | ❌ **Disabled** | Ban/kick/timeout |

#### Disable Specific Operations

```json5
{
  channels: {
    discord: {
      actions: {
        channels: false,      // Disable channel management
        moderation: false,   // Disable moderation operations
        roles: false         // Disable role management
      }
    }
  }
}
```

::: danger Security Warning
When enabling `moderation` and `roles` operations, ensure AI has strict prompts and access control to avoid mistakenly banning users.
:::

### Other Configuration Options

| Configuration | Description | Default Value |
| --- | --- | --- |
| `historyLimit` | Number of historical messages included in server channel context | 20 |
| `dmHistoryLimit` | Number of DM session history messages | Unlimited |
| `textChunkLimit` | Maximum characters per message | 2000 |
| `maxLinesPerMessage` | Maximum lines per message | 17 |
| `mediaMaxMb` | Maximum size of uploaded media files (MB) | 8 |
| `chunkMode` | Message chunking mode (`length`/`newline`) | `length` |

---

## Common Pitfalls

### ❌ "Used disallowed intents" Error

**Cause**: **Message Content Intent** not enabled.

**Solution**:
1. Go back to Discord Developer Portal
2. Bot → Privileged Gateway Intents
3. Enable **Message Content Intent**
4. Restart Gateway

### ❌ Bot Connects But Doesn't Reply

**Possible causes**:
1. Missing **Message Content Intent**
2. Bot doesn't have channel permissions
3. Configuration requires @mention but you didn't mention
4. Channel not in whitelist

**Troubleshooting steps**:
```bash
# Run diagnostic tool
clawdbot doctor

# Check channel status and permissions
clawdbot channels status --probe
```

### ❌ DM Pairing Code Expired

**Cause**: Pairing code validity period is **1 hour**.

**Solution**: Have user resend DM to get new pairing code, then approve.

### ❌ Group DMs Ignored

**Cause**: Default `dm.groupEnabled: false`.

**Solution**:

```json5
{
  channels: {
    discord: {
      dm: {
        groupEnabled: true,
        groupChannels: ["clawd-dm"]  // Optional: only allow specific group DMs
      }
    }
  }
}
```

---

## Troubleshooting

### Common Problem Diagnosis

```bash
# 1. Check if Gateway is running
clawdbot gateway status

# 2. Check channel connection status
clawdbot channels status

# 3. Run full diagnostics (recommended!)
clawdbot doctor
```

### Log Debugging

Start Gateway with `--verbose` to view detailed logs:

```bash
clawdbot gateway --port 18789 --verbose
```

**Watch for these logs**:
- `Discord channel connected: ...` → Connection successful
- `Message received from ...` → Message received
- `ERROR: ...` → Error information

---

## Summary

In this lesson, you learned:

- Discord channel connects via **discord.js** and supports DM and server channels
- Creating Bot requires four steps: **application, bot user, Gateway Intents, invite URL**
- **Message Content Intent** is required, otherwise Bot cannot read messages
- **DM pairing protection** is enabled by default, strangers need to pair to converse
- Server channels can configure whitelist and behavior via `guilds.<id>.channels`
- AI can call Discord tools to perform management operations (controllable via `actions`)

---

## Preview of Next Lesson

> In the next lesson, we'll learn **[Google Chat Channel](../googlechat/)**.
>
> You'll learn:
> - How to configure Google Chat OAuth authentication
> - Message routing in Google Chat Space
> - Limitations of using Google Chat API

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature | File Path | Line |
| --- | --- | --- |
| Discord Bot Configuration Schema | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L320-L427) | 320-427 |
| Discord Onboarding Wizard | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 1-485 |
| Discord Tool Operations | [`src/agents/tools/discord-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions.ts) | 1-72 |
| Discord Message Operations | [`src/agents/tools/discord-actions-messaging.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-messaging.ts) | - |
| Discord Server Operations | [`src/agents/tools/discord-actions-guild.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-guild.ts) | - |
| Discord Official Documentation | [`docs/channels/discord.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/discord.md) | 1-400 |

**Key Schema Fields**:
- `DiscordAccountSchema`: Discord account configuration (token, guilds, dm, actions, etc.)
- `DiscordDmSchema`: DM configuration (enabled, policy, allowFrom, groupEnabled)
- `DiscordGuildSchema`: Server configuration (slug, requireMention, reactionNotifications, channels)
- `DiscordGuildChannelSchema`: Channel configuration (allow, requireMention, skills, systemPrompt)

**Key Functions**:
- `handleDiscordAction()`: Entry point for handling Discord tool operations
- `discordOnboardingAdapter.configure()`: Wizard-style configuration flow

</details>
