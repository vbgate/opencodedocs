---
title: "Send Your First Message - First Conversation with AI Assistant | OpenClaw Tutorial"
sidebarTitle: "Send Your First Message"
subtitle: "Send Your First Message - First Conversation with AI Assistant"
description: "Learn how to have your first conversation with the OpenClaw Agent via CLI or messaging channels, understand message sending mechanisms and session management."
tags:
  - "Getting Started"
  - "Message Sending"
  - "Agent"
  - "CLI"
order: 30
---

# Send Your First Message - First Conversation with AI Assistant

## What You'll Learn

After completing this tutorial, you'll be able to:
- Send messages to your AI assistant via CLI
- Understand OpenClaw's message sending mechanism and session management
- Use various parameters to customize message sending behavior
- Have conversations with your Agent across different channels

## Your Current Situation

The Gateway service is running, but you might be wondering:
- How do I actually have a conversation with the AI assistant?
- What are the ways to send messages?
- How do I manage different conversation sessions?

## Core Concepts

OpenClaw provides multiple ways to interact with your AI assistant:

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Message Interaction             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CLI Method                       Channel Method           │
│   ┌──────────────┐                 ┌──────────────┐        │
│   │ openclaw     │                 │ WhatsApp     │        │
│   │   agent      │                 │ Telegram     │        │
│   │   message    │                 │ Discord      │        │
│   └──────┬───────┘                 └──────┬───────┘        │
│          │                                │                │
│          └──────────────┬─────────────────┘                │
│                         │                                  │
│                         ▼                                  │
│              ┌────────────────────┐                        │
│              │   Gateway Service  │                        │
│              │   Session Mgmt     │                        │
│              └─────────┬──────────┘                        │
│                        │                                   │
│                        ▼                                   │
│              ┌────────────────────┐                        │
│              │   AI Agent (Pi)    │                        │
│              │   Process & Reply  │                        │
│              └────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Session Management Concepts

In OpenClaw, every conversation belongs to a **Session**:
- Sessions are identified by a unique `sessionKey`
- Session states are persisted in the `~/.openclaw/sessions/` directory
- Multiple sessions run in parallel, each maintaining its own context independently

## Hands-On Guide

### Step 1: Send Messages Using the Agent Command

**Why**  
The `openclaw agent` command is the primary way to directly talk to your AI assistant.

Open your terminal and type the following commands:

```bash
# Basic usage - send a message to the default Agent
openclaw agent --message "Hello, please introduce yourself"

# Or use the shorthand
openclaw agent -m "Hello"
```

**What You Should See**  
The AI assistant will process your message and return a response, similar to:

```
┌─────────────────────────────────────┐
│  AI Assistant (claude-3-5-sonnet)   │
├─────────────────────────────────────┤
│  Hello! I'm your AI assistant,      │
│  ready to interact with you through │
│  various messaging channels. I can  │
│  help with coding, file operations, │
│  web browsing, and more.            │
└─────────────────────────────────────┘
```

### Step 2: Specify the Target Session

**Why**  
You may need to talk to a specific session or phone number.

```bash
# Specify phone number (E.164 format)
openclaw agent --to "+86138xxxxxxxx" --message "Hello"

# Specify session ID
openclaw agent --session-id "my-session-001" --message "Let's continue our previous topic"
```

### Step 3: Adjust Thinking Depth

**Why**  
Different tasks require different thinking depths. Complex problems may benefit from higher thinking levels.

```bash
# Turn off thinking - direct response
openclaw agent --message "Simple question" --thinking off

# Minimal thinking - very light reasoning
openclaw agent --message "Quick question" --thinking minimal

# Low thinking depth - fast response
openclaw agent --message "Simple question" --thinking low

# Medium thinking depth (default)
openclaw agent --message "General question" --thinking medium

# High thinking depth - deep reasoning
openclaw agent --message "Complex problem" --thinking high
```

**Thinking Level Comparison**

| Level | Use Case | Response Speed |
| --- | --- | --- |
| `off` | Direct answers without reasoning | Fastest |
| `minimal` | Very light reasoning | Very fast |
| `low` | Simple Q&A, casual chat | Fast |
| `medium` | General tasks | Medium |
| `high` | Complex reasoning, coding | Slower |

### Step 4: Use the Message Command

**Why**  
The `openclaw message` command provides richer message operation capabilities.

```bash
# Send a regular message
openclaw message send --message "Hello"

# Send to a specific target
openclaw message send --to "+86138xxxxxxxx" --message "Hello"

# Use JSON output format
openclaw message send --message "Hello" --json

# Dry run (simulate without actually sending)
openclaw message send --message "Test" --dry-run
```

### Step 5: Send Images

**Why**  
AI can understand and analyze image content.

```bash
# Send a message with an image
openclaw agent --message "Analyze this image" --images ./photo.png

# Multiple images
openclaw agent --message "Compare these two images" --images ./img1.png --images ./img2.png
```

## Checkpoint

Run the following commands to verify your setup:

```bash
# Check if Gateway is running
openclaw status

# You should see output similar to
┌─────────────────────────────────────┐
│  Gateway Status: running            │
│  Port: 18789                        │
│  Auth: token                        │
└─────────────────────────────────────┘
```

## Troubleshooting

::: warning Common Errors
1. **Gateway Not Running**  
   Error: `Error: Gateway is not running`  
   Solution: Run `openclaw gateway run` first

2. **Invalid Phone Number Format**  
   Error: `Invalid E.164 format`  
   Solution: Use `+86138xxxxxxxx` format, including country code

3. **Agent Doesn't Exist**  
   Error: `Unknown agent id "xxx"`  
   Solution: Run `openclaw agents list` to see available Agents

4. **Thinking Level Not Supported**  
   Error: `Thinking level "xhigh" is only supported for...`  
   Solution: Check if your current model supports xhigh thinking level
:::

## Summary

In this tutorial, you learned:

- ✅ Use the `openclaw agent` command to send messages
- ✅ Specify target sessions and phone numbers
- ✅ Adjust thinking depth to control response quality
- ✅ Use `openclaw message` to send messages
- ✅ Pass images to AI for analysis

## Next Steps

> In the next tutorial, we'll learn **[Configuration Basics](../configuration-basics/)**.
>
> You'll learn:
> - The structure of `openclaw.json` config file
> - How to use environment variables
> - Detailed explanation of key configuration options

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand and view source locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Agent Command Implementation | [`src/commands/agent.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/agent.ts) | 64-529 |
| Message Command Implementation | [`src/commands/message.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/message.ts) | 14-67 |
| Pi Agent Embedded Runner | [`src/agents/pi-embedded.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/pi-embedded.ts) | - |
| Session Parsing Logic | [`src/commands/agent/session.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/agent/session.ts) | - |
| Thinking Level Handling | [`src/auto-reply/thinking.ts`](https://github.com/openclaw/openclaw/blob/main/src/auto-reply/thinking.ts) | - |

</details>
