---
title: "Complete Guide to Slack Channel Configuration: Socket/HTTP Mode, Security Settings | Clawdbot Tutorial"
sidebarTitle: "Slack Channel"
subtitle: "Complete Guide to Slack Channel Configuration | Clawdbot Tutorial"
description: "Learn how to configure and use the Slack channel in Clawdbot. This tutorial covers Socket Mode and HTTP Mode connection methods, token acquisition steps, DM security configuration, group management strategies, and Slack Actions tools usage."
tags:
  - "platforms"
  - "slack"
  - "configuration"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 90
---

# Complete Guide to Slack Channel Configuration

## What You'll Learn

- ✅ Interact with Clawdbot in Slack to accomplish tasks using the AI assistant
- ✅ Configure DM security policies to protect personal privacy
- ✅ Integrate Clawdbot into groups for intelligent responses to @mentions and commands
- ✅ Use Slack Actions tools (send messages, manage pins, view member info, etc.)
- ✅ Choose between Socket Mode or HTTP Mode connection methods

## Your Current Challenges

Slack is a core tool for team collaboration, but you may face these issues:

- Team discussions scattered across multiple channels, causing you to miss important information
- Need to quickly query historical messages, pins, or member info, but Slack's interface isn't convenient enough
- Want to use AI capabilities directly in Slack without switching to other applications
- Concerned that enabling an AI assistant in groups could cause message spam or privacy leaks

## When to Use This Approach

- **Daily Team Communication**: Slack is your team's primary communication tool
- **Need Native Slack Integration**: Utilize features like Reactions, Pins, Threads
- **Multi-account Requirements**: Need to connect multiple Slack Workspaces
- **Remote Deployment Scenarios**: Use HTTP Mode to connect to a remote Gateway

## 🎒 Prerequisites

::: warning Pre-flight Check
Before starting, please confirm:
- You've completed [Quick Start](../../start/getting-started/)
- Gateway is running
- You have admin permissions for your Slack Workspace (to create an App)
::

**Resources You'll Need**:
- [Slack API Console](https://api.slack.com/apps) - Create and manage Slack Apps
- Clawdbot configuration file - Usually located at `~/.clawdbot/clawdbot.json`

## Core Concepts

Clawdbot's Slack channel is built on the [Bolt](https://slack.dev/bolt-js) framework and supports two connection modes:

| Mode | Use Case | Advantages | Disadvantages |
|--- | --- | --- | ---|
| **Socket Mode** | Local Gateway, personal use | Simple configuration (only Token required) | Requires persistent WebSocket connection |
| **HTTP Mode** | Server deployment, remote access | Can pass through firewalls, supports load balancing | Requires public IP, complex configuration |

**Socket Mode is used by default**, suitable for most users.

**Authentication Mechanism**:
- **Bot Token** (`xoxb-...`) - Required, for API calls
- **App Token** (`xapp-...`) - Required for Socket Mode, for WebSocket connection
- **User Token** (`xoxp-...`) - Optional, for read-only operations (history, pins, reactions)
- **Signing Secret** - Required for HTTP Mode, for verifying webhook requests

## Follow Along

### Step 1: Create a Slack App

**Why**
A Slack App acts as the bridge between Clawdbot and your Workspace, providing authentication and permission control.

1. Visit the [Slack API Console](https://api.slack.com/apps)
2. Click **Create New App** → Choose **From scratch**
3. Fill in App information:
   - **App Name**: `Clawdbot` (or your preferred name)
   - **Pick a workspace to develop your app in**: Select your Workspace
4. Click **Create App**

**You should see**:
App created successfully, entering the basic configuration page.

### Step 2: Configure Socket Mode (Recommended)

::: tip Tip
If you're using a local Gateway, Socket Mode is recommended for simpler configuration.
::

**Why**
Socket Mode doesn't require a public IP; it connects through Slack's WebSocket service.

1. On the App configuration page, find **Socket Mode** and toggle it to **On**
2. Scroll to **App-Level Tokens** and click **Generate Token and Scopes**
3. In the **Token** section, select scope:
   - Check `connections:write`
4. Click **Generate Token** and copy the generated **App Token** (starts with `xapp-`)

**You should see**:
Generated token looks like: `xapp-1-A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P`

::: danger Security Warning
App Token is sensitive information. Keep it secure and don't leak it to public repositories.
::

### Step 3: Configure Bot Token and Permissions

1. Scroll to **OAuth & Permissions** → **Bot Token Scopes**
2. Add the following scopes (permissions):

**Bot Token Scopes (Required)**:

```yaml
    chat:write                    # Send/edit/delete messages
    channels:history              # Read channel history
    channels:read                 # Get channel info
    groups:history                # Read group history
    groups:read                   # Get group info
    im:history                   # Read DM history
    im:read                      # Get DM info
    im:write                     # Open DM conversations
    mpim:history                # Read group DM history
    mpim:read                   # Get group DM info
    users:read                   # Query user info
    app_mentions:read            # Read @mentions
    reactions:read               # Read reactions
    reactions:write              # Add/remove reactions
    pins:read                    # Read pin list
    pins:write                   # Add/remove pins
    emoji:read                   # Read custom emoji
    commands                     # Handle slash commands
    files:read                   # Read file info
    files:write                  # Upload files
```

::: info Note
These are the **required permissions** for Bot Token, ensuring the Bot can read messages, send replies, and manage reactions and pins.
::

3. Scroll to the top of the page and click **Install to Workspace**
4. Click **Allow** to authorize the App to access your Workspace
5. Copy the generated **Bot User OAuth Token** (starts with `xoxb-`)

**You should see**:
Token looks like: `xoxb-YOUR-BOT-TOKEN-HERE`

::: tip Tip
 If you need a **User Token** (for read-only operations), scroll to **User Token Scopes** and add these permissions:
- `channels:history`, `groups:history`, `im:history`, `mpim:history`
- `channels:read`, `groups:read`, `im:read`, `mpim:read`
- `users:read`, `reactions:read`, `pins:read`, `emoji:read`
- `search:read`

Then copy the **User OAuth Token** (starts with `xoxp-`) from the **Install App** page.

**User Token Scopes (Optional, Read-only)**:
- Only used for reading history, reactions, pins, emoji, and search
- Write operations still use Bot Token (unless `userTokenReadOnly: false` is set)
::

### Step 4: Configure Event Subscriptions

1. On the App configuration page, find **Event Subscriptions** and enable **Enable Events**
2. Add the following events in **Subscribe to bot events**:

```yaml
    app_mention                  # @mention Bot
    message.channels              # Channel messages
    message.groups               # Group messages
    message.im                   # DM messages
    message.mpim                # Group DM messages
    reaction_added               # Reaction added
    reaction_removed             # Reaction removed
    member_joined_channel       # Member joined channel
    member_left_channel          # Member left channel
    channel_rename               # Channel renamed
    pin_added                   # Pin added
    pin_removed                 # Pin removed
```

3. Click **Save Changes**

### Step 5: Enable DM Functionality

1. On the App configuration page, find **App Home**
2. Enable **Messages Tab** → Turn on **Enable Messages Tab**
3. Ensure **Messages tab read-only disabled: No** is displayed

**You should see**:
Messages Tab enabled, users can have DM conversations with the Bot.

### Step 6: Configure Clawdbot

**Why**
Configure the Slack Token into Clawdbot to establish the connection.

#### Method 1: Using Environment Variables (Recommended)

```bash
    # Set environment variables
    export SLACK_BOT_TOKEN="xoxb-yourBotToken"
    export SLACK_APP_TOKEN="xapp-yourAppToken"

    # Restart Gateway
    clawdbot gateway restart
```

**You should see**:
Gateway startup logs show `Slack: connected`.

#### Method 2: Configuration File

Edit `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-yourBotToken",
      "appToken": "xapp-yourAppToken"
    }
  }
}
```

**If you have a User Token**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-yourBotToken",
      "appToken": "xapp-yourAppToken",
      "userToken": "xoxp-yourUserToken",
      "userTokenReadOnly": true
    }
  }
}
```

**You should see**:
After restarting Gateway, Slack connection succeeds.

### Step 7: Invite Bot to Channel

1. Open the channel where you want the Bot to join in Slack
2. Type `/invite @Clawdbot` (replace with your Bot name)
3. Click **Add to channel**

**You should see**:
Bot successfully joins the channel, displaying "Clawdbot has joined the channel".

### Step 8: Configure Group Security Policy

**Why**
Prevent the Bot from auto-replying in all channels to protect privacy.

Edit `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-yourBotToken",
      "appToken": "xapp-yourAppToken",
      "groupPolicy": "allowlist",
      "channels": {
        "C1234567890": {
          "allow": true,
          "requireMention": true
        },
        "#general": {
          "allow": true,
          "requireMention": true
        }
      }
    }
  }
}
```

**Field Descriptions**:
- `groupPolicy`: Group policy
  - `"open"` - Allow all channels (not recommended)
  - `"allowlist"` - Only allow listed channels (recommended)
  - `"disabled"` - Disable all channels
- `channels`: Channel configuration
  - `allow`: Allow/deny
  - `requireMention`: Whether @mention is required for Bot to reply (default `true`)
  - `users`: Additional user whitelist
  - `skills`: Restrict which skills can be used in this channel
  - `systemPrompt`: Additional system prompt

**You should see**:
Bot only replies in configured channels and requires @mention.

### Step 9: Configure DM Security Policy

**Why**
Prevent strangers from interacting with the Bot via DM to protect privacy.

Edit `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-yourBotToken",
      "appToken": "xapp-yourAppToken",
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["U1234567890", "@alice", "user@example.com"]
      }
    }
  }
}
```

**Field Descriptions**:
- `dm.enabled`: Enable/disable DM (default `true`)
- `dm.policy`: DM policy
  - `"pairing"` - Strangers receive a pairing code and need approval (default)
  - `"open"` - Allow anyone to DM
  - `"allowlist"` - Only allow whitelisted users
- `dm.allowFrom`: Whitelist
  - Supports user ID (`U1234567890`)
  - Supports @mention (`@alice`)
  - Supports email (`user@example.com`)

**Pairing Flow**:
1. Stranger sends DM to Bot
2. Bot replies with a pairing code (valid for 1 hour)
3. User provides pairing code to admin
4. Admin executes: `clawdbot pairing approve slack <pairing code>`
5. User is added to whitelist and can use normally

**You should see**:
Unknown senders receive a pairing code; Bot doesn't process their messages.

### Step 10: Test the Bot

1. Send a message in the configured channel: `@Clawdbot hello`
2. Or send a DM to the Bot
3. Observe the Bot's reply

**You should see**:
Bot responds to your message normally.

### ✅ Checkpoint

- [ ] Slack App created successfully
- [ ] Socket Mode enabled
- [ ] Bot Token and App Token copied
- [ ] Clawdbot configuration file updated
- [ ] Gateway restarted
- [ ] Bot invited to channels
- [ ] Group security policy configured
- [ ] DM security policy configured
- [ ] Test message received reply

## Troubleshooting

### Common Error 1: Bot Unresponsive

**Problem**: Bot doesn't reply after sending a message.

**Possible Causes**:
1. Bot not in channel → Use `/invite @Clawdbot` to invite
2. `requireMention` set to `true` → Need to include `@Clawdbot` when sending messages
3. Token configured incorrectly → Check if Token in `clawdbot.json` is correct
4. Gateway not running → Run `clawdbot gateway status` to check status

### Common Error 2: Socket Mode Connection Failed

**Problem**: Gateway logs show connection failure.

**Solution**:
1. Check if App Token is correct (starts with `xapp-`)
2. Check if Socket Mode is enabled
3. Check network connection

### Common Error 3: User Token Insufficient Permissions

**Problem**: Some operations fail with permission errors.

**Solution**:
1. Ensure User Token includes required permissions (see Step 3)
2. Check `userTokenReadOnly` setting (default `true`, read-only)
3. If write operations are needed, set `"userTokenReadOnly": false`

### Common Error 4: Channel ID Resolution Failed

**Problem**: Configured channel name cannot be resolved to ID.

**Solution**:
1. Prefer using channel ID (like `C1234567890`) over name
2. Ensure channel name starts with `#` (like `#general`)
3. Check if Bot has permission to access the channel

## Advanced Configuration

### Permissions Explained

::: info Bot Token vs User Token
- **Bot Token**: Required, for Bot's main functions (send messages, read history, manage pins/reactions, etc.)
- **User Token**: Optional, only for read-only operations (history, reactions, pins, emoji, search)
  - Default `userTokenReadOnly: true` ensures read-only
  - Write operations (send messages, add reactions, etc.) still use Bot Token
::

**Future Permissions**:

The following permissions are not required in the current version but may be supported in the future:

| Permission | Purpose |
|--- | ---|
| `groups:write` | Private channel management (create, rename, invite, archive) |
| `mpim:write` | Group DM conversation management |
| `chat:write.public` | Publish messages to channels where Bot isn't added |
| `files:read` | List/read file metadata |

To enable these features, add corresponding permissions in **Bot Token Scopes** of your Slack App.

### HTTP Mode (Server Deployment)

If your Gateway is deployed on a remote server, use HTTP Mode:

1. Create a Slack App, disable Socket Mode
2. Copy **Signing Secret** (from Basic Information page)
3. Configure Event Subscriptions, set **Request URL** to `https://your-domain/slack/events`
4. Configure Interactivity & Shortcuts, set same **Request URL**
5. Configure Slash Commands, set **Request URL**

**Configuration File**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "http",
      "botToken": "xoxb-yourBotToken",
      "signingSecret": "yourSigningSecret",
      "webhookPath": "/slack/events"
    }
  }
}
```

### Multi-account Configuration

Support connecting multiple Slack Workspaces:

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "workspace1": {
          "name": "Team A",
          "enabled": true,
          "botToken": "xoxb-Workspace1Token",
          "appToken": "xapp-Workspace1Token"
        },
        "workspace2": {
          "name": "Team B",
          "enabled": true,
          "botToken": "xoxb-Workspace2Token",
          "appToken": "xapp-Workspace2Token"
        }
      }
    }
  }
}
```

### Configure Slash Commands

Enable `/clawd` command:

1. On the App configuration page, find **Slash Commands**
2. Create a command:
   - **Command**: `/clawd`
   - **Request URL**: Not needed for Socket Mode (handled via WebSocket)
   - **Description**: `Send a message to Clawdbot`

**Configuration File**:

```json
{
  "channels": {
    "slack": {
      "slashCommand": {
        "enabled": true,
        "name": "clawd",
        "ephemeral": true
      }
    }
  }
}
```

### Thread Reply Configuration

Control how Bot replies in channels:

```json
{
  "channels": {
    "slack": {
      "replyToMode": "off",
      "replyToModeByChatType": {
        "direct": "all",
        "group": "first"
      }
    }
  }
}
```

| Mode | Behavior |
|--- | ---|
| `off` | Default, reply in main channel |
| `first` | First reply goes to thread, subsequent replies in main channel |
| `all` | All replies go to thread |

### Enable Slack Actions Tools

Allow Agent to call Slack-specific operations:

```json
{
  "channels": {
    "slack": {
      "actions": {
        "reactions": true,
        "messages": true,
        "pins": true,
        "memberInfo": true,
        "emojiList": true
      }
    }
  }
}
```

**Available Actions**:
- `sendMessage` - Send message
- `editMessage` - Edit message
- `deleteMessage` - Delete message
- `readMessages` - Read historical messages
- `react` - Add reaction
- `reactions` - List reactions
- `pinMessage` - Pin message
- `unpinMessage` - Unpin message
- `listPins` - List pins
- `memberInfo` - Get member info
- `emojiList` - List custom emoji

## Summary

- Slack channel supports Socket Mode and HTTP Mode connection methods
- Socket Mode is simple to configure and recommended for local use
- DM security policy defaults to `pairing`, requiring approval for strangers
- Group security policy supports whitelist and @mention filtering
- Slack Actions tools provide rich operation capabilities
- Multi-account support for connecting multiple Workspaces

## Next Up

> In the next lesson, we'll learn about **[Discord Channel](../discord/)**.
>
> You'll learn:
> > - Discord Bot configuration methods
> > - Token acquisition and permission settings
> > - Group and DM security policies
> > - Discord-specific tool usage

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature            | File Path                                                                                               | Line Number |
|--- | --- | ---|
| Slack Config Type | [`src/config/types.slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.slack.ts) | 1-150      |
| Slack onboarding Logic | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 1-539      |
| Slack Actions Tools | [`src/agents/tools/slack-actions.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/slack-actions.ts) | 1-301      |
| Slack Official Docs | [`docs/channels/slack.md`](https://github.com/moltbot/moltbot/blob/main/docs/channels/slack.md) | 1-508      |

**Key Type Definitions**:
- `SlackConfig`: Main Slack channel configuration type
- `SlackAccountConfig`: Single account configuration (supports socket/http modes)
- `SlackChannelConfig`: Channel configuration (whitelist, mention policy, etc.)
- `SlackDmConfig`: DM configuration (pairing, allowlist, etc.)
- `SlackActionConfig`: Actions tool permission control

**Key Functions**:
- `handleSlackAction()`: Handle Slack Actions tool calls
- `resolveThreadTsFromContext()`: Resolve thread ID based on replyToMode
- `buildSlackManifest()`: Generate Slack App Manifest

</details>
