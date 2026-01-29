---
title: "Signal Channel Configuration: Secure AI Assistant Integration via signal-cli"
sidebarTitle: "Signal Channel"
subtitle: "Signal Channel Configuration: Secure AI Assistant Integration via signal-cli"
description: "Learn how to configure the Signal channel in Clawdbot, including signal-cli installation, account linking, multi-account support, DM pairing mechanism, group messages, and access control. This tutorial covers the complete workflow from installation to usage, helping you quickly build a personal AI assistant based on Signal."
tags:
  - "Signal"
  - "signal-cli"
  - "Channel Configuration"
  - "Messaging Platform"
prerequisite:
  - "start-getting-started"
order: 120
---

# Signal Channel Configuration: Connect Your Personal AI Assistant with signal-cli

## What You'll Learn

After completing this tutorial, you will be able to:

- ✅ Install and configure signal-cli
- ✅ Set up the Signal channel in Clawdbot
- ✅ Interact with AI assistants via direct messages and groups
- ✅ Use DM pairing mechanism to protect your account
- ✅ Configure multi-account Signal support
- ✅ Use Signal typing indicators, read receipts, and Reactions

## Your Current Challenge

You want to use an AI assistant on Signal, but you're facing these problems:

- ❌ Don't know how to connect Signal and Clawdbot
- ❌ Concerned about privacy and don't want to upload data to the cloud
- ❌ Unsure how to control who can send messages to the AI assistant
- ❌ Need to switch between multiple Signal accounts

::: info Why Choose Signal?
Signal is an end-to-end encrypted messaging app where all communications are encrypted, and only the sender and receiver can read messages. Clawdbot integrates via signal-cli, allowing you to enjoy AI assistant functionality while maintaining privacy.
:::

## When to Use This

**Scenarios suitable for Signal channel**:

- You need a privacy-first communication channel
- Your team or friend groups use Signal
- You need to run the AI assistant on a personal device (local-first)
- You need to control access through a protected DM pairing mechanism

::: tip Dedicated Signal Account
We recommend using a **dedicated Signal number** as the bot account, rather than your personal number. This avoids message loops (the bot ignores its own messages) and keeps work and personal communication separate.
:::

## Before You Begin

Before starting, please confirm you have completed the following steps:

::: warning Prerequisites
- ✅ Completed the [Quick Start](../../start/getting-started/) tutorial
- ✅ Clawdbot is installed and running properly
- ✅ Configured at least one AI model provider (Anthropic, OpenAI, OpenRouter, etc.)
- ✅ Java installed (required by signal-cli)
:::

## Core Concepts

Clawdbot's Signal integration is based on **signal-cli**, which works as follows:

1. **Daemon Mode**: signal-cli runs as a background daemon, providing an HTTP JSON-RPC interface
2. **Event Stream (SSE)**: Clawdbot receives Signal events through Server-Sent Events (SSE)
3. **Standardized Messages**: Signal messages are converted to a unified internal format, then routed to the AI Agent
4. **Deterministic Routing**: All replies are sent back to the original sender or group

**Key Design Principles**:

- **Local-First**: signal-cli runs on your device, all communications are encrypted
- **Multi-Account Support**: Multiple Signal accounts can be configured
- **Access Control**: DM pairing mechanism is enabled by default, requiring strangers to be approved before they can send messages
- **Context Isolation**: Group messages have independent session contexts and won't mix with direct messages

## Follow Along

### Step 1: Install signal-cli

**Why**
signal-cli is the command-line interface for Signal. Clawdbot uses it to communicate with the Signal network.

**Installation Methods**

::: code-group

```bash [macOS (Homebrew)]
brew install signal-cli
```

```bash [Linux (Ubuntu/Debian)]
# Visit https://github.com/AsamK/signal-cli/releases for the latest version
# Download the latest signal-cli release (replace VERSION with the actual version number)
wget https://github.com/AsamK/signal-cli/releases/download/vVERSION/signal-cli-VERSION.tar.gz

# Extract to /opt directory
sudo tar -xvf signal-cli-VERSION.tar.gz -C /opt/

# Create symbolic link (optional)
sudo ln -s /opt/signal-cli-VERSION/bin/signal-cli /usr/local/bin/signal-cli
```

```bash [Windows (WSL2)]
# Use the Linux installation method in WSL2
# Note: Windows uses WSL2, so signal-cli installation follows the Linux workflow
```

:::

**Verify Installation**

```bash
signal-cli --version
# Should see: signal-cli version number (e.g., 0.13.x or higher)
```

**You should see**: The version number of signal-cli.

::: danger Java Requirement
signal-cli requires Java runtime (typically Java 11 or higher). Make sure Java is installed and configured:

```bash
java -version
# Should see: openjdk version "11.x.x" or higher
```

**Note**: For specific Java version requirements, refer to the [signal-cli official documentation](https://github.com/AsamK/signal-cli#readme).
:::

### Step 2: Link Signal Account

**Why**
After linking an account, signal-cli can send and receive messages on behalf of your Signal number.

**Recommended Practice**: Use a dedicated Signal number as the bot account.

**Linking Steps**

1. **Generate Link Command**:

```bash
signal-cli link -n "Clawdbot"
```

`-n "Clawdbot"` specifies the device name as "Clawdbot" (you can customize this).

2. **Scan QR Code**:

After running the command, the terminal will display a QR code:

```
tsconfig: 2369:35 - warning - *! is deprecated: Use .nonNull().
  (deprecated-non-null)

To link your device, navigate to
  Signal Settings > Linked Devices > (+) Link New Device
  on your phone and scan the QR code displayed below.

████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
...
```

3. **In Signal Phone App**:

   - Open Signal Settings
   - Select "Linked Devices"
   - Tap "(+) Link New Device"
   - Scan the QR code displayed in the terminal

**You should see**: After successful linking, the terminal will display output similar to:

```
INFO  Account restored (Number: +15551234567)
INFO  Configuration created at: ~/.local/share/signal-cli/data
```

::: tip Multi-Device Support
Signal allows linking up to 4 devices. Clawdbot will run as one of these devices. You can view and manage these devices in the Signal phone app under "Linked Devices".
:::

### Step 3: Configure Signal Channel in Clawdbot

**Why**
The configuration file tells Clawdbot how to connect to signal-cli and how to handle messages from Signal.

**Configuration Methods**

There are three configuration methods. Choose the one that suits you best:

#### Method 1: Quick Configuration (Single Account)

This is the simplest method, suitable for single-account scenarios.

Edit `~/.clawdbot/clawdbot.json`:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "account": "+15551234567",
      "cliPath": "signal-cli",
      "dmPolicy": "pairing",
      "allowFrom": ["+15557654321"]
    }
  }
}
```

**Configuration Description**:

| Field | Value | Description |
|--- | --- | ---|
| `enabled` | `true` | Enable Signal channel |
| `account` | `"+15551234567"` | Your Signal account (E.164 format) |
| `cliPath` | `"signal-cli"` | Path to signal-cli command |
| `dmPolicy` | `"pairing"` | DM access policy (default pairing mode) |
| `allowFrom` | `["+15557654321"]` | Whitelist of numbers allowed to send DMs |

#### Method 2: Multi-Account Configuration

If you need to manage multiple Signal accounts, use the `accounts` object:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "accounts": {
        "work": {
          "account": "+15551234567",
          "name": "Work Bot",
          "httpPort": 8080,
          "dmPolicy": "pairing",
          "allowFrom": ["+15557654321"]
        },
        "personal": {
          "account": "+15559876543",
          "name": "Personal Bot",
          "httpPort": 8081,
          "dmPolicy": "allowlist",
          "allowFrom": ["*"]
        }
      }
    }
  }
}
```

**Configuration Description**:

- Each account has a unique ID (e.g., `work`, `personal`)
- Each account can have different ports, policies, and permissions
- `name` is an optional display name used for CLI/UI lists

#### Method 3: External Daemon Mode

If you want to manage signal-cli yourself (e.g., in a container or shared CPU), disable auto-start:

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "httpUrl": "http://127.0.0.1:8080",
      "autoStart": false
    }
  }
}
```

**Configuration Description**:

- `httpUrl`: Complete daemon URL (overrides `httpHost` and `httpPort`)
- `autoStart`: Set to `false` to disable automatic signal-cli startup
- Clawdbot will connect to an already running signal-cli daemon

**You should see**: After saving the configuration file, there should be no syntax errors.

::: tip Configuration Validation
Clawdbot validates the configuration on startup. If there are errors, detailed error information will be displayed in the logs.
:::

### Step 4: Start Gateway

**Why**
After starting Gateway, Clawdbot will automatically start the signal-cli daemon (unless you disabled `autoStart`) and begin listening for Signal messages.

**Start Command**

```bash
clawdbot gateway start
```

**You should see**: Output similar to:

```
[INFO] Starting Clawdbot Gateway...
[INFO] Starting signal-cli daemon...
[INFO] signal-cli: INFO  Starting daemon...
[INFO] signal-cli: INFO  Daemon started on http://127.0.0.1:8080
[INFO] Signal channel ready (account: +15551234567)
[INFO] Gateway listening on ws://127.0.0.1:18789
[INFO] Clawdbot Gateway started successfully
```

**Check Channel Status**

```bash
clawdbot channels status
```

**You should see**: Output similar to:

```
Signal Channels:
  ├─ +15551234567 (Work Bot)
  │   ├─ Status: Connected
  │   ├─ Daemon: http://127.0.0.1:8080
  │   └─ Mode: Auto-start
```

### Step 5: Send Your First Message

**Why**
Verify the configuration is correct and ensure Clawdbot can receive and process Signal messages.

**Send Message**

1. **From your Signal phone app**, send a message to your bot number:

```
Hello, Clawdbot!
```

2. **First Message Handling**:

   If `dmPolicy="pairing"` (default), strangers will receive a pairing code:

   ```
   ❌ Unauthorized sender

   To continue, please approve this pairing using the following code:

   📝 Pairing code: ABC123

   The code will expire in 1 hour.

   To approve, run:
   clawdbot pairing approve signal ABC123
   ```

3. **Approve Pairing**:

   ```bash
   clawdbot pairing list signal
   ```

   List pending pairing requests:

   ```
   Pending Pairings (Signal):
     ├─ ABC123
     │   ├─ Sender: +15557654321
     │   ├─ UUID: uuid:123e4567-e89b-12d3-a456-426614174000
     │   └─ Expires: 2026-01-27 12:00:00
   ```

   Approve pairing:

   ```bash
   clawdbot pairing approve signal ABC123
   ```

4. **Send Second Message**:

   After successful pairing, send another message:

   ```
   Hello, Clawdbot!
   ```

**You should see**:

- Signal phone app receives AI reply:
  ```
  Hello! I'm Clawdbot, your personal AI assistant. How can I help you?
  ```

- Gateway logs show:
  ```
  [INFO] Received Signal message from +15557654321
  [INFO] Processing message through Agent...
  [INFO] Sending Signal response to +15557654321
  ```

**Checkpoint ✅**:

- [ ] signal-cli daemon is running
- [ ] Channel status shows "Connected"
- [ ] Received AI reply after sending message
- [ ] No error messages in Gateway logs

::: danger Your Own Messages Are Ignored
If you run the bot on your personal Signal number, the bot will ignore messages you send yourself (loop protection). We recommend using a dedicated bot number.
:::

## Common Pitfalls

### Pitfall 1: signal-cli Startup Failure

**Problem**: signal-cli daemon cannot start

**Possible Causes**:

1. Java not installed or version too low
2. Port already in use
3. Incorrect signal-cli path

**Solutions**:

```bash
# Check Java version
java -version

# Check port usage
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows (PowerShell)

# Check signal-cli path
which signal-cli
```

### Pitfall 2: Pairing Code Expiration

**Problem**: Pairing code expires after 1 hour

**Solution**:

Send another message to get a new pairing code and approve it within 1 hour.

### Pitfall 3: Group Messages Not Responding

**Problem**: Bot mentioned in Signal group but no response

**Possible Causes**:

- `groupPolicy` is set to `allowlist`, but you're not in `groupAllowFrom`
- Signal doesn't support native @ mentions (unlike Discord/Slack)

**Solutions**:

Configure group policy:

```json
{
  "channels": {
    "signal": {
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["+15557654321"]
    }
  }
}
```

Or use command trigger (if `commands.config: true` is configured):

```
@clawdbot help
```

### Pitfall 4: Media File Download Failure

**Problem**: Images or attachments in Signal messages cannot be processed

**Possible Causes**:

- File size exceeds `mediaMaxMb` limit (default 8MB)
- `ignoreAttachments` is set to `true`

**Solutions**:

```json
{
  "channels": {
    "signal": {
      "mediaMaxMb": 20,
      "ignoreAttachments": false
    }
  }
}
```

### Pitfall 5: Long Messages Truncated

**Problem**: Sent messages are split into multiple parts

**Cause**: Signal has a message length limit (default 4000 characters). Clawdbot automatically chunks messages.

**Solutions**:

Adjust chunking configuration:

```json
{
  "channels": {
    "signal": {
      "textChunkLimit": 2000,
      "chunkMode": "newline"
    }
  }
}
```

`chunkMode` options:
- `length` (default): Chunk by length
- `newline`: First split by empty lines (paragraph boundaries), then by length

## Summary

In this lesson, we completed Signal channel configuration and usage:

**Core Concepts**:
- Signal channel is based on signal-cli, communicating via HTTP JSON-RPC + SSE
- Recommended to use a dedicated bot number to avoid message loops
- DM pairing mechanism is enabled by default to protect your account security

**Key Configuration**:
- `account`: Signal account (E.164 format)
- `cliPath`: signal-cli path
- `dmPolicy`: DM access policy (default `pairing`)
- `allowFrom`: DM whitelist
- `groupPolicy` / `groupAllowFrom`: Group policy

**Useful Features**:
- Multi-account support
- Group messages (independent contexts)
- Typing indicators
- Read receipts
- Reactions (emoji reactions)

**Troubleshooting**:
- Use `clawdbot channels status` to check channel status
- Use `clawdbot pairing list signal` to view pending pairing requests
- Check Gateway logs for detailed error information

## Preview of Next Lesson

> In the next lesson, we'll learn **[iMessage Channel](../imessage/)**.
>
> You'll learn:
> - How to configure the iMessage channel on macOS
> - Using BlueBubbles extension support
> - iMessage's special features (read receipts, typing indicators, etc.)
> - iOS node integration (Camera, Canvas, Voice Wake)

Continue exploring Clawdbot's powerful features! 🚀

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature | File Path | Line |
|--- | --- | ---|
| Signal RPC Client | [`src/signal/client.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/client.ts) | 1-186 |
| Signal Daemon Management | [`src/signal/daemon.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/daemon.ts) | 1-85 |
| Multi-Account Support | [`src/signal/accounts.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/accounts.ts) | 1-84 |
| Signal Monitoring and Event Handling | [`src/signal/monitor.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/monitor.ts) | - |
| Message Sending | [`src/signal/send.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send.ts) | - |
| Reactions Sending | [`src/signal/send-reactions.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send-reactions.ts) | - |
| Reaction Level Configuration | [`src/signal/reaction-level.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/reaction-level.ts) | - |

**Configuration Type Definitions**:
- `SignalAccountConfig`: [`src/config/types.signal.ts:13-87`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L13-L87)
- `SignalConfig`: [`src/config/types.signal.ts:89-93`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L89-L93)

**Key Constants**:
- `DEFAULT_TIMEOUT_MS = 10_000`: Default timeout for Signal RPC requests (10 seconds) from: `src/signal/client.ts:29`
- Default HTTP port: `8080` from: `src/signal/accounts.ts:59`
- Default text chunk size: `4000` characters from: `docs/channels/signal.md:113`

**Key Functions**:
- `signalRpcRequest<T>()`: Send JSON-RPC request to signal-cli from: `src/signal/client.ts:54-90`
- `streamSignalEvents()`: Subscribe to Signal events via SSE from: `src/signal/client.ts:112-185`
- `spawnSignalDaemon()`: Start signal-cli daemon from: `src/signal/daemon.ts:50-84`
- `resolveSignalAccount()`: Resolve Signal account configuration from: `src/signal/accounts.ts:49-77`
- `listEnabledSignalAccounts()`: List enabled Signal accounts from: `src/signal/accounts.ts:79-83`

</details>
