---
title: "DM Pairing and Access Control: Protect Your AI Assistant | Clawdbot Tutorial"
sidebarTitle: "DM Pairing and Access Control"
subtitle: "DM Pairing and Access Control: Protect Your AI Assistant"
description: "Learn Clawdbot's DM pairing protection mechanism, including approving pairing requests from unknown senders via CLI, listing pending requests, and managing allowlists. This tutorial covers the complete pairing workflow, CLI command usage, access policy configuration, and security best practices, with troubleshooting and doctor command."
tags:
  - "getting-started"
  - "security"
  - "pairing"
  - "access-control"
prerequisite:
  - "start-gateway-startup"
order: 50
---

# DM Pairing and Access Control: Protect Your AI Assistant

## What You'll Learn

After completing this tutorial, you will be able to:

- ✅ Understand the default DM pairing protection mechanism
- ✅ Approve pairing requests from unknown senders
- ✅ List and manage pending pairing requests
- ✅ Configure different DM access policies (pairing/allowlist/open)
- ✅ Run doctor checks for security configuration

## Your Current Challenge

You may have just configured a WhatsApp or Telegram channel and want to chat with your AI assistant, but are encountering these issues:

- "Why doesn't Clawdbot reply when strangers send me messages?"
- "Received a pairing code, but I don't know what it means"
- "Want to approve someone's request but don't know which command to use"
- "How can I check who is currently waiting for approval?"

The good news is: **Clawdbot enables DM pairing protection by default**, ensuring that only senders you authorize can chat with your AI assistant.

## When to Use This

When you need to:

- 🛡 **Protect privacy**: Ensure only trusted users can chat with your AI assistant
- ✅ **Approve strangers**: Allow new senders to access your AI assistant
- 🔒 **Strict access control**: Limit access for specific users
- 📋 **Batch management**: View and manage all pending pairing requests

---

## Core Concepts

### What is DM Pairing?

Clawdbot connects to real messaging platforms (WhatsApp, Telegram, Slack, etc.), and **direct messages (DMs) on these platforms are treated as untrusted input by default**.

To protect your AI assistant, Clawdbot provides a **pairing mechanism**:

::: info Pairing Flow
1. Unknown sender sends you a message
2. Clawdbot detects the sender is unauthorized
3. Clawdbot returns a **pairing code** (8 characters)
4. The sender needs to provide the pairing code to you
5. You approve the code via CLI
6. Sender ID is added to the allowlist
7. The sender can now chat normally with the AI assistant
:::

### Default DM Policy

**All channels use `dmPolicy="pairing"` by default**, which means:

| Policy | Behavior |
|--- | ---|
| `pairing` | Unknown senders receive a pairing code, message is not processed (default) |
| `allowlist` | Only allow senders in the `allowFrom` list |
| `open` | Allow all senders (requires explicit configuration `"*"`) |
| `disabled` | Completely disable DM functionality |

::: warning Security Reminder
The default `pairing` mode is the safest choice. Unless you have special requirements, do not change to `open` mode.
:::

---

## 🎒 Prerequisites

Ensure you have already:

- [x] Completed the [Quick Start](../getting-started/) tutorial
- [x] Completed the [Starting Gateway](../gateway-startup/) tutorial
- [x] Configured at least one messaging channel (WhatsApp, Telegram, Slack, etc.)
- [x] Gateway is running

---

## Follow Along

### Step 1: Understand the Source of Pairing Codes

When an unknown sender sends a message to your Clawdbot, they receive a reply similar to this:

```
Clawdbot: access not configured.

Telegram ID: 123456789

Pairing code: AB3D7X9K

Ask the bot owner to approve with:
clawdbot pairing approve telegram <code>
```

**Key features of pairing codes** (source: `src/pairing/pairing-store.ts`):

- **8 characters**: Easy to input and remember
- **Uppercase letters and numbers**: Avoid confusion
- **Excludes confusing characters**: No 0, O, 1, I
- **1 hour validity**: Automatically expires after time
- **Maximum 3 pending requests**: Automatically removes oldest request when exceeded

### Step 2: List Pending Pairing Requests

Run the following command in your terminal:

```bash
clawdbot pairing list telegram
```

**You should see**:

```
Pairing requests (1)

┌──────────────────┬────────────────┬────────┬──────────────────────┐
│ Code            │ ID            │ Meta   │ Requested            │
├──────────────────┼────────────────┼────────┼──────────────────────┤
│ AB3D7X9K        │ 123456789      │        │ 2026-01-27T10:30:00Z │
└──────────────────┴────────────────┴────────┴──────────────────────┘
```

If there are no pending requests, you will see:

```
No pending telegram pairing requests.
```

::: tip Supported Channels
Pairing functionality supports the following channels:
- telegram
- whatsapp
- slack
- discord
- signal
- imessage
- msteams
- googlechat
- bluebubbles
:::

### Step 3: Approve a Pairing Request

Use the pairing code provided by the sender to approve access:

```bash
clawdbot pairing approve telegram AB3D7X9K
```

**You should see**:

```
✅ Approved telegram sender 123456789
```

::: info Effect After Approval
After approval, the sender ID (123456789) is automatically added to the allowlist for that channel, stored in:
`~/.clawdbot/credentials/telegram-allowFrom.json`
:::

### Step 4: Notify the Sender (Optional)

If you want to automatically notify the sender, you can use the `--notify` flag:

```bash
clawdbot pairing approve telegram AB3D7X9K --notify
```

The sender will receive the following message (source: `src/channels/plugins/pairing-message.ts`):

```
✅ Clawdbot access approved. Send a message to start chatting.
```

**Note**: The `--notify` flag requires Clawdbot Gateway to be running and the channel to be active.

### Step 5: Verify the Sender Can Chat Normally

Ask the sender to send another message, and the AI assistant should respond normally.

---

## Checkpoint ✅

Complete the following checks to confirm correct configuration:

- [ ] Running `clawdbot pairing list <channel>` shows pending requests
- [ ] Using `clawdbot pairing approve <channel> <code>` successfully approves
- [ ] Approved senders can chat normally with the AI assistant
- [ ] Pairing codes automatically expire after 1 hour (verify by sending another message)

---

## Common Pitfalls

### Error 1: Pairing Code Not Found

**Error message**:
```
No pending pairing request found for code: AB3D7X9K
```

**Possible causes**:
- Pairing code has expired (over 1 hour)
- Pairing code was entered incorrectly (check case sensitivity)
- Sender didn't actually send a message (pairing code is only generated when a message is received)

**Solution**:
- Ask the sender to send another message to generate a new pairing code
- Ensure the pairing code is copied correctly (note case sensitivity)

### Error 2: Channel Does Not Support Pairing

**Error message**:
```
Channel xxx does not support pairing
```

**Possible causes**:
- Channel name spelling error
- The channel does not support pairing functionality

**Solution**:
- Run `clawdbot pairing list` to see the list of supported channels
- Use the correct channel name

### Error 3: Notification Failed

**Error message**:
```
Failed to notify requester: <error details>
```

**Possible causes**:
- Gateway is not running
- Channel connection is lost
- Network issues

**Solution**:
- Confirm Gateway is running
- Check channel connection status: `clawdbot channels status`
- Don't use the `--notify` flag and manually notify the sender

---

## Summary

This tutorial introduced Clawdbot's DM pairing protection mechanism:

- **Default security**: All channels use `pairing` mode by default to protect your AI assistant
- **Pairing workflow**: Unknown senders receive an 8-character pairing code, and you need to approve it via CLI
- **Management commands**:
  - `clawdbot pairing list <channel>`: List pending requests
  - `clawdbot pairing approve <channel> <code>`: Approve pairing
- **Storage location**: Allowlist is stored in `~/.clawdbot/credentials/<channel>-allowFrom.json`
- **Auto-expiry**: Pairing requests automatically expire after 1 hour

Remember: **The pairing mechanism is the security foundation of Clawdbot**, ensuring only people you authorize can chat with your AI assistant.

---

## Next Lesson Preview

> In the next lesson, we will learn **[Troubleshooting: Common Issues](../../faq/troubleshooting/)**.
>
> You will learn:
> - Quick diagnosis and system status checks
> - Resolving Gateway startup, channel connection, authentication errors, and other issues
> - Troubleshooting methods for tool call failures and performance optimization

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Function | File Path | Line Numbers |
|--- | --- | ---|
| Pairing code generation (8 characters, excludes confusing characters) | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L173-L181) | 173-181 |
| Pairing request storage and TTL (1 hour) | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L11-L14) | 11-14 |
| Approve pairing command | [`src/cli/pairing-cli.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/pairing-cli.ts#L107-L143) | 107-143 |
| Pairing code message generation | [`src/pairing/pairing-messages.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-messages.ts#L4-L20) | 4-20 |
| Allowlist storage | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L457-L461) | 457-461 |
| List of channels supporting `pairing` | [`src/channels/plugins/pairing.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/pairing.ts#L11-L16) | 11-16 |
| Default DM policy (pairing) | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L93) | 93 |

**Key constants**:
- `PAIRING_CODE_LENGTH = 8`: Pairing code length
- `PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"`: Pairing code character set (excludes 0O1I)
- `PAIRING_PENDING_TTL_MS = 60 * 60 * 1000`: Pairing request validity period (1 hour)
- `PAIRING_PENDING_MAX = 3`: Maximum pending requests

**Key functions**:
- `approveChannelPairingCode()`: Approve pairing code and add to allowlist
- `listChannelPairingRequests()`: List pending pairing requests
- `upsertChannelPairingRequest()`: Create or update pairing request
- `addChannelAllowFromStoreEntry()`: Add sender to allowlist

</details>
