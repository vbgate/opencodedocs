---
title: "OpenClaw Quick Start: Deploy Your Personal AI Assistant from Scratch | Complete Setup Guide"
sidebarTitle: "Deploy from Scratch"
subtitle: "Quick Start Guide: Deploy OpenClaw from Scratch"
description: "Complete OpenClaw quick start tutorial: Learn how to install and configure your personal AI assistant from scratch, complete Gateway deployment through an interactive wizard, authenticate with 20+ AI providers (Anthropic/OpenAI, etc.), and integrate WhatsApp/Telegram/Slack channels. Includes detailed configuration examples, verification steps, and security best practices."
tags:
  - "quick start"
  - "installation"
  - "deployment"
  - "onboard"
prerequisite: []
order: 10
---

# Quick Start Guide: Deploy OpenClaw from Scratch

::: info What You'll Learn
After completing this tutorial, you will be able to:
- Use the `openclaw onboard` wizard for complete deployment
- Understand core concepts: Gateway, Workspaces, and Channels
- Configure AI model authentication (supporting 20+ providers)
- Set up messaging channels (WhatsApp, Telegram, Slack, etc.)
- Verify installation and start your first AI assistant session
:::

## What is OpenClaw

**OpenClaw** is a personal AI assistant that runs on your own device. It is a multi-channel AI gateway that manages AI sessions, messaging channels, tools, and events through a unified control plane.

Key Features:
- **Local-first**: Data stays on your device
- **Multi-channel support**: WhatsApp, Telegram, Slack, Discord, Signal, and 12+ other channels
- **Extensible skills**: 60+ built-in skills, with support for custom tool integration
- **Multi-agent routing**: Supports workspace isolation

```
┌─────────────────────────────────────────────────────────────┐
│                      OpenClaw Gateway                       │
│                   (ws://127.0.0.1:18789)                   │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Channels   │   Sessions   │    Tools     │    Skills      │
└──────────────┴──────────────┴──────────────┴────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
┌──────────────┐   ┌────────────────┐   ┌──────────────┐
│  WhatsApp    │   │ Browser (CDP)  │   │  iOS/Android │
│  Telegram    │   │ Canvas (A2UI)  │   │   Nodes      │
│  Slack       │   │  File System   │   │              │
└──────────────┘   └────────────────┘   └──────────────┘
```

## Environment Preparation

### System Requirements

| Requirement | Specification |
| --- | --- |
| **Node.js** | ≥ 22.12.0 (ESM modules required) |
| **Package Manager** | npm, pnpm, or bun |
| **Operating System** | macOS, Linux, Windows (WSL2 recommended) |
| **Memory** | 4GB+ recommended |
| **Storage** | 2GB+ free space recommended |

::: warning Note for Windows Users
Running natively on Windows may encounter issues. **WSL2 is strongly recommended**:
```bash
wsl --install  # One command, restart to use
```
Reference: [Windows Platform Documentation](https://docs.openclaw.ai/platforms/windows)
:::

### Verify Node.js Version

```bash
node --version
# Output: v22.12.0 or higher
```

If the version is too low, download the latest LTS version from [nodejs.org](https://nodejs.org/).

### Install CLI

OpenClaw provides two installation methods:

**Method 1: Install from npm (Recommended)**

```bash
# Method 1: Using npm
npm install -g openclaw@latest

# Method 2: Using pnpm
pnpm add -g openclaw@latest
```

**Method 2: Build from Source (Development Environment)**

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install

# Build UI (automatically installs UI dependencies on first run)
pnpm ui:build

# Compile project
pnpm build

# Run setup wizard
pnpm openclaw onboard
```

## Start the Setup Wizard

After installation, run the `onboard` command to launch the interactive wizard:

```bash
openclaw onboard --install-daemon
```

::: tip About `--install-daemon`
This option installs the Gateway daemon (launchd/systemd user service) to ensure Gateway is always running.
:::

### Wizard Overview

The wizard will guide you through the following steps:

1. **Security Confirmation** - Understand security risks and recommended configurations
2. **Mode Selection** - QuickStart for fast configuration or Manual for custom configuration
3. **Workspace Setup** - Specify agent working directory
4. **Model Authentication** - Configure AI provider API keys or OAuth
5. **Gateway Configuration** - Set port, network binding, and authentication method
6. **Channel Configuration** - Add messaging channels like WhatsApp, Telegram
7. **Skill Setup** - Select and install extension skills

## Detailed Configuration Steps

### Step 1: Security Confirmation

The wizard first displays a security warning. This is **essential information** that must be read:

```
Security warning — please read.

OpenClaw is a hobby project and still in beta. Expect sharp edges.
This bot can read files and run actions if tools are enabled.
A bad prompt can trick it into doing unsafe things.

Recommended baseline:
- Pairing/allowlists + mention gating.
- Sandbox + least-privilege tools.
- Keep secrets out of the agent's reachable filesystem.
- Use the strongest available model for any bot with tools or untrusted inboxes.
```

**You should see**:
- A prompt asking "I understand this is powerful and inherently risky. Continue?"
- Type `Y` to continue (default is `N`, requires explicit confirmation)

### Step 2: Choose Configuration Mode

```
? Onboarding mode …
❯ QuickStart  - Configure details later via openclaw configure.
  Manual      - Configure port, network, Tailscale, and auth options.
```

| Mode | Use Case | Configuration Content |
| --- | --- | --- |
| **QuickStart** | First-time experience, quick start | Use default port 18789, localhost binding, Token authentication |
| **Manual** | Production deployment, custom setup needed | Custom port, network binding, Tailscale, authentication method |

::: tip Selection Advice
- Choose **QuickStart** for your first attempt
- Choose **Manual** for remote access or custom network requirements
:::

### Step 3: Configure Workspace

The workspace is where agents store files, skills, and session data.

```
? Workspace directory …
~/.openclaw/workspace
```

Default workspace: `~/.openclaw/workspace`

Workspace contains:
- `AGENTS.md` - System instructions injected into agent prompts
- `SOUL.md` - Agent personality definition
- `TOOLS.md` - Tool usage instructions
- `skills/` - Installed skills
- `sessions/` - Session records

### Step 4: AI Model Authentication

OpenClaw supports **20+ AI providers**, displayed by category in the wizard:

```
? Select authentication provider …
❯ Anthropic (setup-token)
  OpenAI (openai-codex)
  OpenRouter (openrouter-api-key)
  Google (google-gemini-cli)
  Moonshot AI (moonshot-api-key)
  Z.ai (zai-api-key)
  Xiaomi (xiaomi-api-key)
  ...
  Skip for now
```

#### Supported Authentication Methods

| Provider | Authentication Method | Recommended Model |
| --- | --- | --- |
| **Anthropic** | Setup Token (OAuth) | Claude Opus 4.6 |
| **OpenAI** | Codex OAuth / API Key | GPT-4o, Codex |
| **OpenRouter** | API Key | Multi-model aggregation |
| **Google** | Gemini CLI OAuth | Gemini Pro |
| **Moonshot** | API Key | Moonshot v1 |
| **Z.ai** | API Key | Z.ai Coding |

::: tip Model Recommendation
While any model is supported, **Anthropic Pro/Max (100/200) + Opus 4.6** is strongly recommended:
- Stronger long-context processing capability
- Better prompt injection resistance
- More stable tool calling performance
:::

#### Configuration Example (Anthropic Setup Token)

After selecting "Anthropic (setup-token)":

```
? Enter your Anthropic setup token …
sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

✓ Token validated
? Select default model …
❯ anthropic/claude-opus-4-6
  anthropic/claude-sonnet-4
  anthropic/claude-haiku-4
```

### Step 5: Gateway Configuration

Gateway is OpenClaw's core control plane, default listening at `ws://127.0.0.1:18789`.

**QuickStart Default Configuration**:

```
Keeping your current gateway settings:
Gateway port: 18789
Gateway bind: Loopback (127.0.0.1)
Gateway auth: Token (default)
Tailscale exposure: Off
Direct to chat channels.
```

**Manual Mode Configurable Options**:

| Configuration Item | Options | Description |
| --- | --- | --- |
| **Port** | Any available port | Default 18789 |
| **Bind** | loopback / lan / tailnet / auto / custom | Network binding mode |
| **Auth** | token / password | Authentication method |
| **Tailscale** | off / serve / funnel | Remote access method |

#### Binding Mode Details

```
? Gateway bind …
❯ Loopback (127.0.0.1)    # Localhost only, most secure
  LAN                      # Accessible on LAN
  Tailnet (Tailscale IP)   # Accessible via Tailscale network
  Custom IP                # Custom binding address
  Auto                     # Auto-select
```

| Mode | Use Case | Security Level |
| --- | --- | --- |
| `loopback` | Single machine use | ⭐⭐⭐⭐⭐ |
| `lan` | Multiple devices on LAN | ⭐⭐⭐⭐ |
| `tailnet` | Tailscale network | ⭐⭐⭐⭐ |
| `custom` | Specific IP binding | ⭐⭐⭐ |

#### Tailscale Integration (Optional)

If you need remote access to Gateway, you can configure Tailscale:

```
? Tailscale exposure …
❯ Off       # Don't enable Tailscale
  Serve     # Accessible within Tailnet (recommended)
  Funnel    # Publicly accessible (requires password auth)
```

::: warning Tailscale Security Note
- `serve` mode: Only accessible within Tailscale network
- `funnel` mode: Publicly accessible, **must** set password authentication
- Gateway binding must remain `loopback` when Serve/Funnel is enabled
:::

### Step 6: Configure Messaging Channels

OpenClaw supports 12+ messaging channels. The wizard will display installed and available channels:

```
Channel status
whatsapp: not configured
telegram: not configured
slack: not configured
discord: not configured
signal: install plugin to enable
bluebubbles: install plugin to enable

? Configure chat channels now? (Y/n) › yes
```

#### DM Security Policies

Before configuring channels, the wizard explains the DM (direct message) security mechanism:

```
How channels work
DM security: default is pairing; unknown DMs get a pairing code.
Approve with: openclaw pairing approve <channel> <code>
Public DMs require dmPolicy="open" + allowFrom=["*"].
```

| Policy | Description | Use Case |
| --- | --- | --- |
| **pairing** (default) | Unknown senders receive a pairing code, require manual approval | Personal use, most secure |
| **allowlist** | Only allow users on the list | Small team |
| **open** | Allow anyone (requires setting `allowFrom: ["*"]`) | Public bot |
| **disabled** | Ignore all DMs | Group-only use |

#### Channel Configuration Examples

**WhatsApp Configuration**:

```
? Select channel …
❯ WhatsApp

WhatsApp uses your phone's WhatsApp account.
You'll scan a QR code to link the device.

? Continue with WhatsApp setup? (Y/n) › yes
📱 Scan this QR code with WhatsApp → Linked Devices → Link a Device
[QR Code]

✓ WhatsApp connected!
? Configure DM policy for WhatsApp …
❯ Pairing (recommended)
  Allowlist
  Open
  Disabled
```

**Telegram Configuration**:

```
? Select channel …
❯ Telegram

? Enter Telegram Bot Token …
123456789:ABCDEFghijklmnopqrstuvwxyz

✓ Bot validated
? Configure DM policy for Telegram …
❯ Pairing (recommended)
```

### Step 7: Skill Setup

Skills are plugins that extend agent capabilities:

```
? Configure skills now? (Y/n) › yes

Available skill categories:
❯ GitHub integration    - Manage issues, PRs, repos
  Spotify player        - Control music playback
  Notion integration    - Read/write Notion pages
  Obsidian notes        - Search and edit notes
  1Password             - Access passwords (secure)
  Weather               - Get weather forecasts
  ...

? Select skills to install …
[ ] github
[ ] spotify-player
[ ] weather
```

::: tip Recommended Skills for Beginners
- `weather` - Weather queries, simple and practical
- `github` - If you use GitHub
- `obsidian` - If you use Obsidian notes
:::

## Verify Installation

### Check Gateway Status

After the wizard completes, verify that Gateway is running normally:

```bash
openclaw status
```

**You should see**:

```
Gateway Status
==============
State:      running
Version:    2026.2.13
Port:       18789
Bind:       127.0.0.1
Channels:   whatsapp, telegram
Sessions:   1 active
```

### Run Diagnostics

```bash
openclaw doctor
```

The doctor command checks:
- Configuration file validity
- Dependency integrity
- Channel connection status
- Security risk configurations

### Send Test Message

Interact with the agent via CLI:

```bash
openclaw agent --agent main --message "Hello, OpenClaw!"
```

**You should see**:

```
🦞 Molty (claude-opus-4-6)
─────────────────────────────
Hello! I'm the OpenClaw AI assistant. I'm successfully started and ready to help you with various tasks.

You can:
- Message me via WhatsApp, Telegram, and other channels
- Use browser tools to access web pages
- Use file tools to read/write local files
- Install more skills to extend my capabilities

Is there anything I can help you with?
```

### Start Gateway (if not auto-started)

```bash
openclaw gateway --port 18789 --verbose
```

## Configuration File Reference

After installation, the configuration file is located at `~/.openclaw/openclaw.json`.

### Minimal Configuration Example

```json5
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-6",
      "workspace": "~/.openclaw/workspace"
    }
  },
  "gateway": {
    "port": 18789,
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-generated-token"
    }
  }
}
```

### Full Configuration Structure

```typescript
// src/config/types.openclaw.ts
type OpenClawConfig = {
  meta?: {
    lastTouchedVersion?: string;
    lastTouchedAt?: string;
  };
  auth?: AuthConfig;
  env?: { shellEnv?: {...}; vars?: Record<string, string>; };
  wizard?: { lastRunAt?: string; ... };
  diagnostics?: DiagnosticsConfig;
  logging?: LoggingConfig;
  update?: { channel?: "stable" | "beta" | "dev"; checkOnStart?: boolean };
  browser?: BrowserConfig;
  ui?: { seamColor?: string; assistant?: {...} };
  skills?: SkillsConfig;
  plugins?: PluginsConfig;
  models?: ModelsConfig;
  nodeHost?: NodeHostConfig;
  agents?: AgentsConfig;
  tools?: ToolsConfig;
  bindings?: AgentBinding[];
  broadcast?: BroadcastConfig;
  audio?: AudioConfig;
  messages?: MessagesConfig;
  commands?: CommandsConfig;
  approvals?: ApprovalsConfig;
  session?: SessionConfig;
  web?: WebConfig;
  channels?: ChannelsConfig;
  cron?: CronConfig;
  hooks?: HooksConfig;
  discovery?: DiscoveryConfig;
  canvasHost?: CanvasHostConfig;
  talk?: TalkConfig;
  gateway?: GatewayConfig;
  memory?: MemoryConfig;
};
```

### Key Environment Variables

| Variable | Purpose | Example |
| --- | --- | --- |
| `OPENCLAW_GATEWAY_TOKEN` | Gateway authentication token | `openssl rand -hex 32` |
| `OPENCLAW_GATEWAY_PASSWORD` | Gateway password authentication | - |
| `OPENCLAW_STATE_DIR` | State directory | `~/.openclaw` |
| `OPENCLAW_CONFIG_PATH` | Configuration file path | `~/.openclaw/openclaw.json` |
| `ANTHROPIC_API_KEY` | Anthropic API | `sk-ant-...` |
| `OPENAI_API_KEY` | OpenAI API | `sk-...` |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot | `123456:ABCDEF...` |

## Best Practices

### Security Recommendations

1. **Use Pairing Mode**
   ```json5
   {
     "channels": {
       "telegram": { "dmPolicy": "pairing" },
       "whatsapp": { "dmPolicy": "pairing" },
       "discord": { "dmPolicy": "pairing" }
     }
   }
   ```

2. **Enable Sandbox Mode for Non-Main Sessions**
   ```json5
   {
     "agents": {
       "defaults": {
         "sandbox": { "mode": "non-main" }
       }
     }
   }
   ```

3. **Run Security Audits Regularly**
   ```bash
   openclaw security audit --deep
   openclaw security audit --fix
   ```

### Performance Optimization

1. **Choose Appropriate Models**
   - Complex tasks: Claude Opus 4.6
   - Daily conversations: Claude Sonnet 4
   - Fast responses: Claude Haiku 4

2. **Configure Model Fallbacks**
   ```json5
   {
     "agents": {
       "defaults": {
         "model": {
           "primary": "anthropic/claude-opus-4-6",
           "fallbacks": ["openai/gpt-4.1", "google/gemini-3-pro"]
         }
       }
     }
   }
   ```

### Troubleshooting

**Gateway Won't Start**
```bash
# 1. Check port usage
lsof -i :18789

# 2. Check configuration validity
openclaw doctor

# 3. Reset configuration
openclaw onboard --reset
```

**Channel Connection Failed**
```bash
# Check channel status
openclaw channels status --probe

# Reconfigure specific channel
openclaw channels add whatsapp
```

**Model API Error**
```bash
# Verify API key configuration
openclaw config get models.profiles

# Reconfigure authentication
openclaw onboard --auth-choice setup-token
```

## Next Steps

After installation is complete, you can:

1. **Configure More Channels** - Learn how to integrate [WhatsApp](../whatsapp-setup/), [Telegram](../telegram-setup/), [Slack](../slack-discord-setup/)
2. **Explore the Skills System** - Learn how to [extend agent capabilities](../../advanced/skills-system/)
3. **Configure Multiple Models** - Learn [model configuration and failover](../../advanced/models-configuration/)
4. **Remote Access** - Set up [Tailscale remote access](../../advanced/tailscale-remote/)

## Lesson Summary

In this tutorial, you learned:
- OpenClaw's core concepts (Gateway, Workspace, Channels)
- How to use the `openclaw onboard` wizard for complete deployment
- How to configure authentication for 20+ AI providers
- How to set up messaging channels and DM security policies
- How to verify installation and run diagnostics

OpenClaw is now ready. Start your AI assistant journey!

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Onboard Main Entry | [`src/commands/onboard.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard.ts) | 1-83 |
| Interactive Wizard | [`src/commands/onboard-interactive.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-interactive.ts) | 1-26 |
| Non-Interactive Mode | [`src/commands/onboard-non-interactive.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-non-interactive.ts) | 1-38 |
| Authentication Config | [`src/commands/onboard-auth.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-auth.ts) | 1-107 |
| Channel Initialization | [`src/commands/onboard-channels.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-channels.ts) | 1-680 |
| Wizard Main Logic | [`src/wizard/onboarding.ts`](https://github.com/openclaw/openclaw/blob/main/src/wizard/onboarding.ts) | 1-485 |
| Helper Functions | [`src/commands/onboard-helpers.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-helpers.ts) | 1-487 |
| Configuration Type Definitions | [`src/config/types.openclaw.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.openclaw.ts) | 1-130 |
| Option Type Definitions | [`src/commands/onboard-types.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-types.ts) | 1-146 |

**Key Constants**:
- `DEFAULT_WORKSPACE = "~/.openclaw/workspace"` - Default workspace path
- `DEFAULT_GATEWAY_PORT = 18789` - Default Gateway port
- `DEFAULT_WORKSPACE = DEFAULT_AGENT_WORKSPACE_DIR` - Workspace constant alias

**Key Functions**:
- `onboardCommand()` - CLI entry, handles options and dispatch
- `runInteractiveOnboarding()` - Interactive wizard entry
- `runNonInteractiveOnboarding()` - Non-interactive mode entry
- `runOnboardingWizard()` - Wizard main logic implementation
- `setupChannels()` - Channel configuration flow
- `applyAuthChoice()` - Apply authentication choice

</details>
