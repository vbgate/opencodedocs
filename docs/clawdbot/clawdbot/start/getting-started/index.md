---
title: "Quick Start: Install and Launch Clawdbot"
sidebarTitle: "Quick Start"
subtitle: "Quick Start: Install, configure, and launch Clawdbot"
description: "Learn how to install Clawdbot, configure AI models, start Gateway, and send your first message via WhatsApp/Telegram/Slack."
tags:
  - "Getting Started"
  - "Installation"
  - "Configuration"
  - "Gateway"
prerequisite: []
order: 10
---

# Quick Start: Install, configure, and launch Clawdbot

## What You'll Learn

After completing this tutorial, you will be able to:

- ✅ Install Clawdbot on your device
- ✅ Configure AI model authentication (Anthropic / OpenAI / other providers)
- ✅ Start the Gateway daemon
- ✅ Send your first message via WebChat or configured channels

## Your Current Challenge

You might be thinking:

- "A local AI assistant sounds complex, where do I start?"
- "I have many devices (phone, computer), how do I manage them uniformly?"
- "I'm familiar with WhatsApp/Telegram/Slack, can I use these to talk to AI?"

Good news: **Clawdbot is designed to solve exactly these problems**.

## When to Use This

When you need to:

- 🚀 **Set up** your first personal AI assistant
- 🔧 **Configure multiple channels** (WhatsApp, Telegram, Slack, Discord, etc.)
- 🤖 **Connect AI models** (Anthropic Claude, OpenAI GPT, etc.)
- 📱 **Cross-device collaboration** (macOS, iOS, Android nodes)

::: tip Why recommend Gateway mode?
Gateway is the control plane of Clawdbot, which:
- Unifies all conversations, channels, tools, and events
- Supports multi-client concurrent connections
- Allows device nodes to perform local operations
:::

## 🎒 Prerequisites

### System Requirements

| Component | Requirements |
| --------- | ------------ |
| **Node.js** | ≥ 22.12.0 |
| **Operating System** | macOS / Linux / Windows (WSL2) |
| **Package Manager** | npm / pnpm / bun |

::: warning Note for Windows users
On Windows, **WSL2** is strongly recommended because:
- Many channels depend on local binaries
- Daemon (launchd/systemd) is not available on Windows
:::

### Recommended AI Models

While any model is supported, we strongly recommend:

| Provider | Recommended Model | Reason |
| -------- | ---------------- | ------ |
| Anthropic | Claude Opus 4.5 | Long context advantage, stronger prompt injection resistance |
| OpenAI | GPT-5.2 + Codex | Strong programming capabilities, multimodal support |

---

## Core Architecture

Clawdbot's architecture is simple: **one Gateway, multiple channels, one AI assistant**.

```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat
                │
                ▼
        ┌──────────────────┐
        │   Gateway       │  ← Control plane (daemon)
        │   127.0.0.1:18789 │
        └────────┬─────────┘
                 │
                 ├─→ AI Agent (pi-mono RPC)
                 ├─→ CLI (clawdbot ...)
                 ├─→ WebChat UI
                 └─→ macOS / iOS / Android nodes
```

**Key Concepts**:

| Concept | Role |
| ------- | ---- |
| **Gateway** | Daemon, responsible for session management, channel connections, and tool invocations |
| **Channel** | Message channel (WhatsApp, Telegram, Slack, etc.) |
| **Agent** | AI runtime (RPC mode based on pi-mono) |
| **Node** | Device node (macOS/iOS/Android), executes device-local operations |

---

## Follow Along

### Step 1: Install Clawdbot

**Why**
After global installation, the `clawdbot` command can be used anywhere.

#### Method A: Using npm (Recommended)

```bash
npm install -g clawdbot@latest
```

#### Method B: Using pnpm

```bash
pnpm add -g clawdbot@latest
```

#### Method C: Using bun

```bash
bun install -g clawdbot@latest
```

**You should see**:
```
added 1 package, and audited 1 package in 3s
```

::: tip Developer Options
If you plan to develop or contribute from source, jump to [Appendix: Build from Source](#build-from-source).
:::

---

### Step 2: Run Onboarding Wizard

**Why**
The wizard will guide you through all necessary configurations: Gateway, channels, and skills.

#### Start the Wizard (Recommended)

```bash
clawdbot onboard --install-daemon
```

**What the wizard will ask you**:

| Step | Question | Description |
| ---- | -------- | ----------- |
| 1 | Choose AI model authentication method | OAuth / API Key |
| 2 | Configure Gateway (port, authentication) | Default: 127.0.0.1:18789 |
| 3 | Configure channels (WhatsApp, Telegram, etc.) | Can skip, configure later |
| 4 | Configure skills (optional) | Can skip |

**You should see**:
```
✓ Gateway configured
✓ Workspace initialized: ~/clawd
✓ Channels configured
✓ Skills installed

To start the gateway, run:
  clawdbot gateway
```

::: info What is Daemon?
`--install-daemon` will install the Gateway daemon:
- **macOS**: launchd service (user-level)
- **Linux**: systemd user service

This way, Gateway runs automatically in the background without manual startup.
:::

---

### Step 3: Start Gateway

**Why**
Gateway is the control plane of Clawdbot and must be started first.

#### Start in Foreground (for debugging)

```bash
clawdbot gateway --port 18789 --verbose
```

**You should see**:
```
[clawdbot] Gateway started
[clawdbot] Listening on ws://127.0.0.1:18789
[clawdbot] Ready to accept connections
```

#### Start in Background (Recommended)

If you used `--install-daemon` in the wizard, Gateway will start automatically.

Check status:

```bash
clawdbot gateway status
```

**You should see**:
```
Gateway is running
PID: 12345
Port: 18789
```

::: tip Common Options
- `--port 18789`: Specify Gateway port (default: 18789)
- `--verbose`: Enable verbose logging (useful for debugging)
- `--reset`: Restart Gateway (clear sessions)
:::

---

### Step 4: Send Your First Message

**Why**
Verify the installation is successful and experience the AI assistant's response.

#### Method A: Use CLI to Chat Directly

```bash
clawdbot agent --message "Ship checklist" --thinking high
```

**You should see**:
```
[clawdbot] Agent is thinking...
[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

#### Method B: Send Message via Channels

If you configured channels (e.g., WhatsApp, Telegram) in the wizard, you can send messages directly to your AI assistant in the corresponding app.

**WhatsApp Example**:

1. Open WhatsApp
2. Search for your Clawdbot number
3. Send message: `Hello, I'm testing Clawdbot!`

**You should see**:
- AI assistant replies to your message

::: info DM Pairing Protection
By default, Clawdbot enables **DM Pairing Protection**:
- Unknown senders will receive a pairing code
- Messages will not be processed until you approve the pairing

For more details: [DM Pairing & Access Control](../pairing-approval/)
:::

---

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Run `clawdbot --version` and see the version number
- [ ] Run `clawdbot gateway status` and see Gateway running
- [ ] Send a message via CLI and receive an AI response
- [ ] (Optional) Send a message in configured channels and receive an AI response

::: tip FAQ
**Q: Gateway failed to start?**
A: Check if the port is already in use:
```bash
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows
```

**Q: AI not responding?**
A: Check if API Key is configured correctly:
```bash
clawdbot models list
```

**Q: How to view detailed logs?**
A: Add `--verbose` when starting:
```bash
clawdbot gateway --verbose
```
:::

---

## Common Pitfalls

### ❌ Forgot to Install Daemon

**Wrong approach**:
```bash
clawdbot onboard  # Forgot --install-daemon
```

**Correct approach**:
```bash
clawdbot onboard --install-daemon
```

::: warning Foreground vs Background
- Foreground: Suitable for debugging, closing terminal stops Gateway
- Background: Suitable for production, auto-restart on failure
:::

### ❌ Node.js Version Too Low

**Wrong approach**:
```bash
node --version
# v20.x.x  # Too old
```

**Correct approach**:
```bash
node --version
# v22.12.0 or higher
```

### ❌ Wrong Configuration File Path

Clawdbot default configuration file location:

| Operating System | Configuration Path |
| ---------------- | ----------------- |
| macOS/Linux | `~/.clawdbot/clawdbot.json` |
| Windows (WSL2) | `~/.clawdbot/clawdbot.json` |

If you manually edit the configuration file, ensure the path is correct.

---

## Summary

In this lesson, you learned:

1. ✅ **Install Clawdbot**: Global installation using npm/pnpm/bun
2. ✅ **Run Wizard**: Complete configuration with `clawdbot onboard --install-daemon`
3. ✅ **Start Gateway**: `clawdbot gateway` or daemon auto-start
4. ✅ **Send Message**: Chat with AI via CLI or configured channels

**Next Steps**:

- Learn [Onboarding Wizard](../onboarding-wizard/) for more wizard options
- Understand [Starting Gateway](../gateway-startup/) for different startup modes (dev/production)
- Learn [Sending First Message](../first-message/) to explore more message formats and interaction methods

---

## Preview of Next Lesson

> In the next lesson, we'll learn **[Onboarding Wizard](../onboarding-wizard/)**.
>
> You'll learn:
> - How to use the interactive wizard to configure Gateway
> - How to configure multiple channels (WhatsApp, Telegram, Slack, etc.)
> - How to manage skills and AI model authentication

---

## Appendix: Build from Source

If you plan to develop or contribute from source, you can:

### 1. Clone the Repository

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build UI (First Time Only)

```bash
pnpm ui:build  # Automatically installs UI dependencies
```

### 4. Build TypeScript

```bash
pnpm build
```

### 5. Run Onboarding

```bash
pnpm clawdbot onboard --install-daemon
```

### 6. Development Loop (Auto-reload)

```bash
pnpm gateway:watch  # Auto-reload when TS files change
```

::: info Development Mode vs Production Mode
- `pnpm clawdbot ...`: Run TypeScript directly (development mode)
- After `pnpm build`: Generates `dist/` directory (production mode)
:::

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature | File Path | Line |
| ------- | --------- | ---- |
| CLI Entry | [`src/cli/run-main.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/run-main.ts) | 26-60 |
| Onboarding Command | [`src/cli/program/register.onboard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.onboard.ts) | 34-100 |
| Daemon Installation | [`src/cli/daemon-cli/install.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/daemon-cli/install.ts) | 15-100 |
| Gateway Service | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | Entire file |
| Runtime Check | [`src/infra/runtime-guard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/runtime-guard.ts) | Entire file |

**Key Constants**:
- `DEFAULT_GATEWAY_DAEMON_RUNTIME = "node"`: Default daemon runtime (from `src/commands/daemon-runtime.ts`)
- `DEFAULT_GATEWAY_PORT = 18789`: Default Gateway port (from config)

**Key Functions**:
- `runCli()`: CLI main entry, handles argument parsing and command routing (`src/cli/run-main.ts`)
- `runDaemonInstall()`: Install Gateway daemon (`src/cli/daemon-cli/install.ts`)
- `onboardCommand()`: Interactive wizard command (`src/commands/onboard.ts`)

</details>
