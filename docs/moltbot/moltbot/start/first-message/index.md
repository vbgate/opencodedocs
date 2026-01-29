---
title: "Send Your First Message: Chat with AI via WebChat or Channels | Clawdbot Tutorial"
sidebarTitle: "Send Your First Message"
subtitle: "Send Your First Message: Chat with AI via WebChat or Channels"
description: "Learn how to send your first message to the Clawdbot AI assistant through the WebChat interface or configured channels (WhatsApp/Telegram/Slack/Discord, etc.). This tutorial covers three methods: CLI commands, WebChat access, and channel messaging, including expected results and troubleshooting."
tags:
  - "getting-started"
  - "webchat"
  - "channels"
  - "messaging"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 40
---

# Send Your First Message: Chat with AI via WebChat or Channels

## What You'll Learn

After completing this tutorial, you will be able to:

- ✅ Chat with the AI assistant via CLI
- ✅ Send messages using the WebChat interface
- ✅ Chat with AI in configured channels (WhatsApp, Telegram, Slack, etc.)
- ✅ Understand expected results and status codes for message sending

## Your Current Challenge

You may have just completed the installation and Gateway startup of Clawdbot, but you're unsure how to verify everything is working correctly.

You might be wondering:

- "Gateway is running, how do I confirm it can respond to messages?"
- "Is there a graphical interface I can use besides the command line?"
- "I configured WhatsApp/Telegram, how do I chat with AI on those platforms?"

Good news: **Clawdbot provides multiple ways to send your first message**, and one is bound to suit you.

## When to Use This

When you need to:

- 🧪 **Verify Installation**: Confirm Gateway and AI assistant are working properly
- 🌐 **Test Channels**: Check if WhatsApp/Telegram/Slack and other channels are connected correctly
- 💬 **Quick Chat**: Communicate directly with AI via CLI or WebChat without opening channel apps
- 🔄 **Deliver Replies**: Send AI responses to specific channels or contacts

---

## 🎒 Prerequisites

Before sending your first message, please confirm:

### Required Conditions

| Condition                  | How to Check                                        |
|--- | ---|
| **Gateway is Running**    | `clawdbot gateway status` or check if the process is running |
| **AI Model is Configured** | `clawdbot models list` to see if there are available models |
| **Port is Accessible**     | Confirm port 18789 (or custom port) is not in use |

::: warning Prerequisites
This tutorial assumes you have completed:
- [Quick Start](../getting-started/) - Installation, configuration, and starting Clawdbot
- [Starting Gateway](../gateway-startup/) - Understanding Gateway's different startup modes

If not completed yet, please return to these lessons first.
:::

### Optional: Configure Channels

If you want to send messages through WhatsApp/Telegram/Slack or other channels, you need to configure the channels first.

Quick check:

```bash
## View configured channels
clawdbot channels list
```

If the result is an empty list or missing the channel you want to use, refer to the corresponding channel configuration tutorial (in `platforms/` section).

---

## Core Concepts

Clawdbot supports three main methods for sending messages:

```
┌─────────────────────────────────────────────────────────────┐
│              Clawdbot Message Sending Methods               │
├─────────────────────────────────────────────────────────────┤
│                                                         │
│  Method 1: CLI Agent Conversation                           │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → AI → Return Result        │
│  │ agent        │                                       │
│  │ --message    │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Method 2: CLI Direct Message to Channel                  │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → Channel → Send Message    │
│  │ message send │                                       │
│  │ --target     │                                       │
│  └─────────────┘                                       │
│                                                         │
│  Method 3: WebChat / Configured Channels                  │
│  ┌─────────────┐               ┌──────────────┐   │
│  │ WebChat     │   or         │ WhatsApp    │   │
│  │ Browser UI  │              │ Telegram    │ → Gateway → AI → Channel Reply │
│  └─────────────┘               │ Slack       │   │
│                                 │ Discord     │   │
│                                 └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Key Differences**:

| Method                  | Goes Through AI? | Purpose                           |
|--- | --- | ---|
| `clawdbot agent`        | ✅ Yes          | Chat with AI, get responses and thought process    |
| `clawdbot message send` | ❌ No           | Send message directly to channel, bypassing AI    |
| WebChat / Channels      | ✅ Yes          | Chat with AI through graphical interface         |

::: info Choosing the Right Method
- **Verify Installation**: Use `clawdbot agent` or WebChat
- **Test Channels**: Use WhatsApp/Telegram or other channel apps
- **Bulk Send**: Use `clawdbot message send` (bypasses AI)
:::

---

## Follow Along

### Step 1: Chat with AI via CLI

**Why**
CLI is the fastest way to verify, no need to open a browser or channel app.

#### Basic Conversation

```bash
## Send a simple message to the AI assistant
clawdbot agent --message "Hello, I'm testing Clawdbot!"
```

**You should see**:
```
[clawdbot] Thinking...
[clawdbot] Hello! I'm your AI assistant powered by Clawdbot. How can I help you today?
```

#### Using Thinking Level

Clawdbot supports different thinking levels to control AI "transparency":

```bash
## High thinking level (shows complete reasoning process)
clawdbot agent --message "Ship checklist" --thinking high

## Turn off thinking (only see final answer)
clawdbot agent --message "What's 2+2?" --thinking off
```

**You should see** (high thinking level):
```
[clawdbot] I'll create a comprehensive ship checklist for you.

[THINKING]
Let me think about what needs to be checked for shipping:

1. Code readiness
   - All tests passing?
   - Code review completed?
   - Documentation updated?

2. Build configuration
   - Environment variables set correctly?
   - Build artifacts generated?

[THINKING END]

[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

**Thinking Level Options**:

| Level    | Description                     | Use Cases           |
|--- | --- | ---|
| `off`     | No thinking process            | Simple Q&A, quick response |
| `minimal` | Minimal thinking output        | Debugging, checking process     |
| `low`     | Low detail                     | Daily conversation           |
| `medium`   | Medium detail                  | Complex tasks           |
| `high`     | High detail (complete reasoning) | Learning, code generation     |

#### Specify Reply Channel

You can have AI send replies to a specific channel (instead of the default channel):

```bash
## Send AI reply to Telegram
clawdbot agent --message "Send me a weather update" --deliver --reply-channel telegram
```

::: tip Common Parameters
- `--to <number>`: Specify recipient's E.164 number (used to create specific conversation)
- `--agent <id>`: Use specific Agent ID (instead of default main)
- `--session-id <id>`: Continue existing session instead of creating new one
- `--verbose on`: Enable verbose log output
- `--json`: Output JSON format (suitable for script parsing)
:::

---

### Step 2: Send Messages via WebChat Interface

**Why**
WebChat provides a graphical interface in the browser, more intuitive, supports rich text and attachments.

#### Access WebChat

WebChat uses Gateway's WebSocket service, **no separate configuration or additional ports needed**.

**Access Methods**:

1. **Open browser and visit**: `http://localhost:18789`
2. **Or run in terminal**: `clawdbot dashboard` (automatically opens browser)

::: info WebChat Port
WebChat uses the same port as Gateway (default 18789). If you modified the Gateway port, WebChat will also use the same port.
:::

**You should see**:
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│  ┌───────────────────────────────────┐   │
│  │  Hello! I'm your AI assistant.   │   │
│  │  How can I help you today?       │   │
│  └───────────────────────────────────┘   │
│  [Input box...                        │   │
│  [Send]                               │   │
└─────────────────────────────────────────────┘
```

#### Send Message

1. Type your message in the input box
2. Click "Send" or press `Enter`
3. Wait for AI response

**You should see**:
- AI's reply appears in the chat interface
- If thinking level is enabled, `[THINKING]` markers are displayed

**WebChat Features**:

| Feature   | Description                     |
|--- | ---|
| Rich Text | Supports Markdown format            |
| Attachments | Supports image, audio, video upload    |
| History | Automatically saves session history             |
| Session Switch | Switch between different sessions in left panel         |

::: tip macOS Menu Bar App
If you installed the Clawdbot macOS app, you can also open WebChat directly from the "Open WebChat" button in the menu bar.
:::

---

### Step 3: Send Messages via Configured Channels

**Why**
Verify channel connections (WhatsApp, Telegram, Slack, etc.) are working properly and experience real cross-platform conversations.

#### WhatsApp Example

If you set up WhatsApp during onboarding or configuration:

1. **Open WhatsApp APP** (mobile or desktop)
2. **Search for your Clawdbot number** (or saved contact)
3. **Send message**: `Hello from WhatsApp!`

**You should see**:
```
[WhatsApp]
You → Clawdbot: Hello from WhatsApp!

Clawdbot → You: Hello! I received your message via WhatsApp.
How can I help you today?
```

#### Telegram Example

If you configured a Telegram Bot:

1. **Open Telegram APP**
2. **Search for your Bot** (using username)
3. **Send message**: `/start` or `Hello from Telegram!`

**You should see**:
```
[Telegram]
You → @your_bot: /start

@your_bot → You: Welcome! I'm Clawdbot's AI assistant.
You can talk to me here, and I'll respond via AI.
```

#### Slack/Discord Example

For Slack or Discord:

1. **Open the corresponding APP**
2. **Find the channel or server where the Bot is located**
3. **Send message**: `Hello from Slack!`

**You should see**:
- Bot replies to your message
- Message may show "AI Assistant" label

::: info DM Pairing Protection
By default, Clawdbot enables **DM Pairing Protection**:
- Unknown senders receive a pairing code
- Messages are not processed until you approve the pairing

If this is your first time sending a message from a channel, you may need:
```bash
## View pending pairing requests
clawdbot pairing list

## Approve pairing request (replace <channel> and <code> with actual values)
clawdbot pairing approve <channel> <code>
```

Detailed instructions: [DM Pairing and Access Control](../pairing-approval/)
:::

---

### Step 4 (Optional): Send Messages Directly to Channels

**Why**
Send messages directly to channels without going through AI. Suitable for batch notifications, push messages, etc.

#### Send Text Message

```bash
## Send text message to WhatsApp
clawdbot message send --target +15555550123 --message "Hello from CLI!"
```

#### Send Message with Attachment

```bash
## Send image
clawdbot message send --target +15555550123 \
  --message "Check out this photo" \
  --media ~/Desktop/photo.jpg

## Send URL image
clawdbot message send --target +15555550123 \
  --message "Here's a link" \
  --media https://example.com/image.png
```

**You should see**:
```
[clawdbot] Message sent successfully
[clawdbot] Message ID: 3EB0A1234567890
```

::: tip message send Common Parameters
- `--channel`: Specify channel (default: whatsapp)
- `--reply-to <id>`: Reply to specific message
- `--thread-id <id>`: Telegram thread ID
- `--buttons <json>`: Telegram inline buttons (JSON format)
- `--card <json>`: Adaptive Card (supported channels)
:::

---

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Send messages via CLI and receive AI replies
- [ ] Send messages in WebChat interface and see responses
- [ ] (Optional) Send messages in configured channels and receive AI replies
- [ ] (Optional) Use `clawdbot message send` to send messages directly to channels

::: tip Common Questions

**Q: AI doesn't reply to my messages?**

A: Check the following:
1. Is Gateway running: `clawdbot gateway status`
2. Is AI model configured: `clawdbot models list`
3. View detailed logs: `clawdbot agent --message "test" --verbose on`

**Q: WebChat won't open?**

A: Check:
1. Is Gateway running
2. Is the port correct: default 18789
3. Is browser accessing `http://127.0.0.1:18789` (not `localhost`)

**Q: Channel message sending failed?**

A: Check:
1. Is channel logged in: `clawdbot channels status`
2. Is network connection working
3. View channel-specific error logs: `clawdbot gateway --verbose`
:::

---

## Common Pitfalls

### ❌ Gateway Not Started

**Wrong Way**:
```bash
clawdbot agent --message "Hello"
## Error: Gateway connection failed
```

**Right Way**:
```bash
## Start Gateway first
clawdbot gateway --port 18789

## Then send message
clawdbot agent --message "Hello"
```

::: warning Gateway Must Be Started First
All message sending methods (CLI, WebChat, channels) depend on Gateway's WebSocket service. Ensuring Gateway is running is the first step.
:::

### ❌ Channel Not Logged In

**Wrong Way**:
```bash
## Send message when WhatsApp is not logged in
clawdbot message send --target +15555550123 --message "Hi"
## Error: WhatsApp not authenticated
```

**Right Way**:
```bash
## Log into channel first
clawdbot channels login whatsapp

## Confirm status
clawdbot channels status

## Then send message
clawdbot message send --target +15555550123 --message "Hi"
```

### ❌ Forgetting DM Pairing

**Wrong Way**:
```bash
## Send message from Telegram for the first time, but pairing not approved
## Result: Bot receives message but doesn't process it
```

**Right Way**:
```bash
## 1. View pending pairing requests
clawdbot pairing list

## 2. Approve pairing
clawdbot pairing approve telegram ABC123
## 3. Send message again

### Now message will be processed and get AI reply
```

### ❌ Confusing agent and message send

**Wrong Way**:
```bash
## Want to chat with AI, but used message send
clawdbot message send --target +15555550123 --message "Help me write code"
## Result: Message sent directly to channel, AI won't process it
```

**Right Way**:
```bash
## Chat with AI: use agent
clawdbot agent --message "Help me write code" --to +15555550123

## Direct message: use message send (bypass AI)
clawdbot message send --target +15555550123 --message "Meeting at 3pm"
```

---

## Summary

In this lesson, you learned:

1. ✅ **CLI Agent Conversation**: `clawdbot agent --message` to chat with AI, supports thinking level control
2. ✅ **WebChat Interface**: Visit `http://localhost:18789` to send messages via graphical interface
3. ✅ **Channel Messaging**: Chat with AI in configured channels like WhatsApp, Telegram, Slack
4. ✅ **Direct Sending**: `clawdbot message send` bypasses AI to send messages directly to channels
5. ✅ **Troubleshooting**: Understand common failure causes and solutions

**Next Steps**:

- Learn [DM Pairing and Access Control](../pairing-approval/) to understand how to safely manage unknown senders
- Explore [Multi-Channel System Overview](../../platforms/channels-overview/) to learn about all supported channels and their configurations
- Configure more channels (WhatsApp, Telegram, Slack, Discord, etc.) to experience cross-platform AI assistants

---

## Next Lesson Preview

> In the next lesson, we'll learn **[DM Pairing and Access Control](../pairing-approval/)**.
>
> You'll learn:
> - Understand the default DM pairing protection mechanism
> - How to approve pairing requests from unknown senders
> - Configure allowlist and security policies

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Function                  | File Path                                                                                             | Line #    |
|--- | --- | ---|
| CLI Agent Command Registration  | [`src/cli/program/register.agent.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.agent.ts) | 20-82    |
| Agent CLI Execution        | [`src/commands/agent-via-gateway.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/agent-via-gateway.ts) | 82-184   |
| CLI message send Registration | [`src/cli/program/message/register.send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/message/register.send.ts) | 1-30     |
| Gateway chat.send Method | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380   |
| WebChat Internal Message Processing | [`src/gateway/server-chat.gateway-server-chat.e2e.test.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-chat.gateway-server-chat.e2e.test.ts) | 50-290    |
| Message Channel Type Definition   | [`src/gateway/protocol/client-info.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/client-info.ts) | 2-23     |
| Channel Registry         | [`src/channels/registry.js`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.js) | Full file   |

**Key Constants**:
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`: Default message channel (from `src/channels/registry.js`)
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: WebChat internal message channel (from `src/utils/message-channel.ts`)

**Key Functions**:
- `agentViaGatewayCommand()`: Call agent method via Gateway WebSocket (`src/commands/agent-via-gateway.ts`)
- `agentCliCommand()`: CLI agent command entry, supports local and Gateway modes (`src/commands/agent-via-gateway.ts`)
- `registerMessageSendCommand()`: Register `message send` command (`src/cli/program/message/register.send.ts`)
- `chat.send`: Gateway WebSocket method, handles message sending requests (`src/gateway/server-methods/chat.ts`)

</details>
