---
title: "Onboarding Wizard: One-Stop Configuration | Clawdbot Tutorial"
sidebarTitle: "Onboarding Wizard"
subtitle: "Onboarding Wizard: One-Stop Configuration for Clawdbot"
description: "Learn to complete Clawdbot configuration using the interactive wizard, including Gateway network setup, AI model authentication (supports setup-token and API Key), communication channels (WhatsApp, Telegram, Slack, etc.), and skills system initialization."
tags:
  - "getting-started"
  - "configuration"
  - "wizard"
  - "Gateway"
prerequisite:
  - "getting-started"
order: 20
---

# Onboarding Wizard: One-Stop Configuration for Clawdbot

## What You'll Learn

After completing this tutorial, you will be able to:

- ✅ Complete Clawdbot configuration using the interactive wizard
- ✅ Understand the difference between QuickStart and Manual modes
- ✅ Configure Gateway network and authentication options
- ✅ Set up AI model providers (setup-token and API Key)
- ✅ Enable communication channels (WhatsApp, Telegram, etc.)
- ✅ Install and manage skill packages

After completing the wizard, the Clawdbot Gateway will run in the background, allowing you to chat with the AI assistant through configured channels.

## Your Current Challenge

Manually editing configuration files is cumbersome:

- Don't know the meaning and default values of configuration items
- Easy to miss critical settings leading to startup failures
- Various AI model authentication methods (OAuth, API Key) make it hard to choose
- Channel configuration is complex, with different authentication methods per platform
- Don't know which skills to install

The onboarding wizard solves these problems by guiding you through all configurations with interactive questions and providing reasonable default values.

## When to Use This

- **First-time installation**: First-time Clawdbot users
- **Reconfiguration**: Need to modify Gateway settings, switch AI models, or add new channels
- **Quick verification**: Want to quickly experience basic features without diving deep into config files
- **Troubleshooting**: After configuration errors, use the wizard to reinitialize

::: tip Tip
The wizard detects existing configurations and allows you to keep, modify, or reset them.
:::

## Core Concepts

### Two Modes

The wizard provides two configuration modes:

**QuickStart Mode** (Recommended for beginners)
- Uses safe defaults: Gateway bound to loopback (127.0.0.1), port 18789, token authentication
- Skips most detailed configuration items
- Suitable for single-machine usage, quick start

**Manual Mode** (Suitable for advanced users)
- Manually configure all options
- Supports LAN binding, Tailscale remote access, custom authentication methods
- Suitable for multi-machine deployment, remote access, or special network environments

### Configuration Flow

```
1. Security warning confirmation
2. Mode selection (QuickStart / Manual)
3. Gateway configuration (port, binding, authentication, Tailscale)
4. AI model authentication (setup-token / API Key)
5. Workspace settings (default ~/clawd)
6. Channel configuration (WhatsApp / Telegram / Slack, etc.)
7. Skill installation (optional)
8. Completion (start Gateway)
```

### Security Reminder

The wizard displays a security warning at startup, requiring you to confirm the following:

- Clawdbot is a hobby project and still in beta stage
- When tools are enabled, AI can read files and execute operations
- Malicious prompts may induce AI to perform unsafe operations
- Recommend using pairing/allowlist + minimum-privilege tools
- Regularly run security audits

::: danger Important
If you don't understand basic security and access control mechanisms, do not enable tools or expose the Gateway to the internet. It's recommended to have someone experienced assist with configuration before use.
:::

---

## 🎒 Prerequisites

Before running the wizard, please confirm:

- **Clawdbot installed**: Complete installation following [Quick Start](../getting-started/)
- **Node.js version**: Ensure Node.js ≥ 22 (check with `node -v`)
- **AI model account** (recommended):
  - Anthropic Claude account (Pro/Max subscription), supports OAuth flow
  - Or prepare API Keys from providers like OpenAI/DeepSeek
- **Channel accounts** (optional): To use WhatsApp, Telegram, etc., register corresponding accounts first
- **Network permissions**: If using Tailscale, ensure Tailscale client is installed

---

## Follow Along

### Step 1: Start the Wizard

Open terminal and run the following command:

```bash
clawdbot onboard
```

**Why**
Start the interactive configuration wizard to guide you through all necessary settings.

**You should see**:
```
  ┌─────────────────────────────────────────────────────┐
  │                                                   │
  │   Clawdbot onboarding                              │
  │                                                   │
  └─────────────────────────────────────────────────────┘
```

### Step 2: Confirm Security Warning

The wizard first displays the security warning (as described in "Core Concepts" above).

**Why**
Ensure users understand potential risks to avoid misuse leading to security issues.

**Actions**:
- Read the security warning content
- Enter `y` or select `Yes` to confirm you understand the risks
- If you don't accept the risks, the wizard will exit

**You should see**:
```
Security warning — please read.

Clawdbot is a hobby project and still in beta. Expect sharp edges.
...

I understand this is powerful and inherently risky. Continue? (y/N)
```

### Step 3: Choose Configuration Mode

::: code-group

```bash [QuickStart Mode]
Recommended for beginners, uses safe defaults:
- Gateway port: 18789
- Bind address: Loopback (127.0.0.1)
- Authentication: Token (auto-generated)
- Tailscale: Disabled
```

```bash [Manual Mode]
Suitable for advanced users, manually configure all options:
- Customize Gateway port and binding
- Choose Token or Password authentication
- Configure Tailscale Serve/Funnel remote access
- Detailed configuration for each step
```

:::

**Why**
QuickStart mode helps beginners get started quickly, while Manual mode gives advanced users precise control.

**Actions**:
- Use arrow keys to select `QuickStart` or `Manual`
- Press Enter to confirm

**You should see**:
```
? Onboarding mode
  QuickStart         Configure details later via clawdbot configure.
  Manual            Configure port, network, Tailscale, and auth options.
```

### Step 4: Choose Deployment Mode (Manual Mode Only)

If you choose Manual mode, the wizard will ask where the Gateway will be deployed:

::: code-group

```bash [Local gateway (this machine)]
Gateway runs on the current machine:
- Can run OAuth flow and write local credentials
- Wizard completes all configuration
- Suitable for local development or single-machine deployment
```

```bash [Remote gateway (info-only)]
Gateway runs on another machine:
- Wizard only configures remote URL and authentication
- Does not run OAuth flow, requires manual credential setup on remote host
- Suitable for multi-machine deployment scenarios
```

:::

**Why**
Local mode supports the complete configuration flow, while Remote mode only configures access information.

**Actions**:
- Select deployment mode
- If Remote mode, enter the remote Gateway URL and token

### Step 5: Configure Gateway (Manual Mode Only)

If you choose Manual mode, the wizard will ask for Gateway configuration item by item:

#### Gateway Port

```bash
? Gateway port (18789)
```

**Explanation**:
- Default value 18789
- If the port is occupied, enter another port
- Ensure the port is not blocked by firewall

#### Gateway Bind Address

```bash
? Gateway bind
  Loopback (127.0.0.1)
  LAN (0.0.0.0)
  Tailnet (Tailscale IP)
  Auto (Loopback → LAN)
  Custom IP
```

**Option explanation**:
- **Loopback**: Local machine access only, most secure
- **LAN**: Devices within the LAN can access
- **Tailnet**: Access through Tailscale virtual network
- **Auto**: Try loopback first, switch to LAN if it fails
- **Custom IP**: Manually specify IP address

::: tip Tip
Recommend using Loopback or Tailnet to avoid direct exposure to the LAN.
:::

#### Gateway Authentication

```bash
? Gateway auth
  Token              Recommended default (local + remote)
  Password
```

**Option explanation**:
- **Token**: Recommended option, auto-generates random token, supports remote access
- **Password**: Use custom password, required for Tailscale Funnel mode

#### Tailscale Remote Access (Optional)

```bash
? Tailscale exposure
  Off               No Tailscale exposure
  Serve             Private HTTPS for your tailnet (devices on Tailscale)
  Funnel            Public HTTPS via Tailscale Funnel (internet)
```

::: warning Tailscale Warning
- Serve mode: Only accessible to devices on Tailscale network
- Funnel mode: Exposes via public HTTPS (requires password authentication)
- Ensure Tailscale client is installed: https://tailscale.com/download/mac
:::

### Step 6: Set Up Workspace

The wizard will ask for the workspace directory:

```bash
? Workspace directory (~/clawd)
```

**Explanation**:
- Default value `~/clawd` (i.e., `/Users/your-username/clawd`)
- Workspace stores session history, agent configuration, skills, and other data
- Can use absolute or relative paths

::: info Multiple Profile Support
By setting the `CLAWDBOT_PROFILE` environment variable, you can use independent configurations for different working environments:

| Profile Value | Workspace Path | Config File |
|--- | --- | ---|
| `default` or unset | `~/clawd` | `~/.clawdbot/clawdbot.json` |
| `work` | `~/clawd-work` | `~/.clawdbot/clawdbot.json` (work profile) |
| `dev` | `~/clawd-dev` | `~/.clawdbot/clawdbot.json` (dev profile) |

Example:
```bash
# Use work profile
export CLAWDBOT_PROFILE=work
clawdbot onboard
```
:::

**You should see**:
```
Ensuring workspace directory: /Users/your-username/clawd
Creating sessions.json...
Creating agents directory...
```

### Step 7: Configure AI Model Authentication

The wizard will list supported AI model providers:

```bash
? Choose AI model provider
  Anthropic                    Claude Code CLI + API key
  OpenAI                       Codex OAuth + API key
  MiniMax                      M2.1 (recommended)
  Qwen                         OAuth
  Venice AI                     Privacy-focused (uncensored models)
  Google                       Gemini API key + OAuth
  Copilot                      GitHub + local proxy
  Vercel AI Gateway            API key
  Moonshot AI                  Kimi K2 + Kimi Code
  Z.AI (GLM 4.7)            API key
  OpenCode Zen                 API key
  OpenRouter                   API key
  Custom API Endpoint
  Skip for now
```

After selecting a provider, the wizard will display specific authentication methods based on the provider type. Here are the authentication options for major providers:

**Anthropic** authentication methods:
- `claude-cli`: Use existing Claude Code CLI OAuth authentication (requires Keychain access)
- `token`: Paste setup-token generated via `claude setup-token`
- `apiKey`: Manually enter Anthropic API Key

::: info Anthropic setup-token Method (Recommended)
Recommend using the setup-token method because:
- No need to manually manage API Key
- Generates long-lived tokens
- Suitable for individual Pro/Max subscription users

Process:
1. Run in another terminal first: `claude setup-token`
2. This command will open a browser for OAuth authorization
3. Copy the generated setup-token
4. In the wizard, select `Anthropic` → `token`
5. Paste setup-token into the wizard
6. Credentials are automatically saved to `~/.clawdbot/credentials/` directory
:::

::: info API Key Method
If you choose API Key:
- The wizard will prompt you to enter API Key
- Credentials are saved to `~/.clawdbot/credentials/` directory
- Supports multiple providers, can switch at any time

Example:
```bash
? Enter API Key
sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
:::

### Step 8: Select Default Model

After successful authentication, the wizard will display a list of available models:

```bash
? Select default model
  anthropic/claude-sonnet-4-5      Anthropic Sonnet 4.5 (200k ctx)
  anthropic/claude-opus-4-5          Anthropic Opus 4.5 (200k ctx)
  openai/gpt-4-turbo                OpenAI GPT-4 Turbo
  deepseek/DeepSeek-V3                DeepSeek V3
  (Keep current selection)
```

**Recommendations**:
- Recommend using **Claude Sonnet 4.5** or **Opus 4.5** (200k context, stronger security)
- If budget is limited, choose the Mini version
- Click `Keep current selection` to keep existing configuration

### Step 9: Configure Communication Channels

The wizard will list all available communication channel plugins:

```bash
? Select channels to enable
  ✓ whatsapp       WhatsApp (Baileys Web Client)
  ✓ telegram       Telegram (Bot Token)
  ✓ slack          Slack (Bot Token + App Token)
  ✓ discord        Discord (Bot Token)
  ✓ googlechat     Google Chat (OAuth)
  (Press Space to select, Enter to confirm)
```

**Actions**:
- Use arrow keys to navigate
- Press **Space** to toggle selection
- Press **Enter** to confirm selection

::: tip QuickStart Mode Optimization
In QuickStart mode, the wizard automatically selects channels that support quick enablement (like WebChat) and skips DM policy configuration, using safe default values (pairing mode).
:::

After selecting channels, the wizard will ask for each channel's configuration one by one:

#### WhatsApp Configuration

```bash
? Configure WhatsApp
  Link new account     Open QR code in browser
  Skip
```

**Actions**:
- Select `Link new account`
- The wizard will display a QR code
- Use WhatsApp to scan the QR code to log in
- After successful login, session data is saved to `~/.clawdbot/credentials/`

#### Telegram Configuration

```bash
? Configure Telegram
  Bot Token
  Skip
```

**Actions**:
- Select `Bot Token`
- Enter the Bot Token obtained from @BotFather
- The wizard will test if the connection is successful

::: tip Bot Token Acquisition
1. Search @BotFather in Telegram
2. Send `/newbot` to create a new bot
3. Follow prompts to set bot name and username
4. Copy the generated Bot Token
:::

#### Slack Configuration

```bash
? Configure Slack
  App Token         xapp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Bot Token         xoxb-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Signing Secret   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Skip
```

**Explanation**:
Slack requires three credentials, obtained from Slack App settings:
- **App Token**: Workspace level token
- **Bot Token**: Bot user OAuth token
- **Signing Secret**: Used to verify request signatures

::: tip Slack App Creation
1. Visit https://api.slack.com/apps
2. Create a new App
3. Get Signing Secret on Basic Information page
4. Install App to Workspace on OAuth & Permissions page
5. Get Bot Token and App Token
:::

### Step 10: Configure Skills (Optional)

The wizard will prompt whether to install skills:

```bash
? Install skills? (Y/n)
```

**Recommendations**:
- Select `Y` to install recommended skills (like bird package manager, sherpa-onnx-tts local TTS)
- Select `n` to skip, can manage later via `clawdbot skills` command

If you choose to install, the wizard will list available skills:

```bash
? Select skills to install
  ✓ bird           macOS Homebrew package installation
  ✓ sherpa-onnx-tts  Local TTS engine (privacy-first)
  (Press Space to select, Enter to confirm)
```

### Step 11: Complete Configuration

The wizard will summarize all configurations and write to the configuration file:

```bash
✓ Writing config to ~/.clawdbot/clawdbot.json
✓ Workspace initialized at ~/clawd
✓ Channels configured: whatsapp, telegram, slack
✓ Skills installed: bird, sherpa-onnx-tts

────────────────────────────────────────────────────

Configuration complete!

Next steps:
  1. Start Gateway:
     clawdbot gateway --daemon

  2. Test connection:
     clawdbot message send --to +1234567890 --message "Hello!"

  3. Manage configuration:
     clawdbot configure

Docs: https://docs.clawd.bot/start/onboarding
────────────────────────────────────────────────────
```

## Checkpoint ✅

After completing the wizard, please confirm the following:

- [ ] Configuration file created: `~/.clawdbot/clawdbot.json`
- [ ] Workspace initialized: `~/clawd/` directory exists
- [ ] AI model credentials saved: Check `~/.clawdbot/credentials/`
- [ ] Channels configured: Check `channels` node in `clawdbot.json`
- [ ] Skills installed (if selected): Check `skills` node in `clawdbot.json`

**Verification commands**:

```bash
## View configuration summary
```bash
clawdbot doctor
```

## View Gateway status
```bash
clawdbot gateway status
```

## View available channels
```bash
clawdbot channels list
```
```

## Common Pitfalls

### Pitfall 1: Port Already in Use

**Error message**:
```
Error: Port 18789 is already in use
```

**Solution**:
1. Find the process occupying the port: `lsof -i :18789` (macOS/Linux) or `netstat -ano | findstr 18789` (Windows)
2. Stop the conflicting process or use a different port

### Pitfall 2: OAuth Flow Failed

**Error message**:
```
Error: OAuth exchange failed
```

**Possible causes**:
- Network issues preventing access to Anthropic servers
- OAuth code expired or malformed
- Browser blocked from opening

**Solution**:
1. Check network connection
2. Re-run `clawdbot onboard` to retry OAuth
3. Or switch to API Key method

### Pitfall 3: Channel Configuration Failed

**Error message**:
```
Error: WhatsApp authentication failed
```

**Possible causes**:
- QR code expired
- Account restricted by WhatsApp
- Dependencies not installed (like signal-cli)

**Solution**:
1. WhatsApp: Rescan the QR code
2. Signal: Ensure signal-cli is installed (see channel-specific documentation)
3. Bot Token: Confirm token format is correct and not expired

### Pitfall 4: Tailscale Configuration Failed

**Error message**:
```
Error: Tailscale binary not found in PATH or /Applications.
```

**Solution**:
1. Install Tailscale: https://tailscale.com/download/mac
2. Ensure it's added to PATH or installed to `/Applications`
3. Or skip Tailscale configuration, set up manually later

### Pitfall 5: Configuration File Format Error

**Error message**:
```
Error: Invalid config at ~/.clawdbot/clawdbot.json
```

**Solution**:
```bash
# Fix configuration
clawdbot doctor

# Or reset configuration
clawdbot onboard --mode reset
```

---

## Summary

The onboarding wizard is the recommended way to configure Clawdbot, guiding you through all necessary settings via interactive questions:

**Key takeaways**:
- ✅ Supports **QuickStart** and **Manual** modes
- ✅ Security warnings remind of potential risks
- ✅ Automatically detects existing configurations, can keep/modify/reset
- ✅ Supports **Anthropic setup-token** flow (recommended) and API Key method
- ✅ Supports **CLAWDBOT_PROFILE** multi-profile environments
- ✅ Automatically configures channels and skills
- ✅ Generates safe default values (loopback binding, token authentication)

**Recommended workflow**:
1. First use: `clawdbot onboard --install-daemon`
2. Modify configuration: `clawdbot configure`
3. Troubleshoot: `clawdbot doctor`
4. Remote access: Configure Tailscale Serve/Funnel

**Next steps**:
- [Start Gateway](../gateway-startup/): Run Gateway in the background
- [Send First Message](../first-message/): Start chatting with the AI assistant
- [Understand DM Pairing](../pairing-approval/): Securely control unknown senders

---

## Next Lesson

> In the next lesson, we'll learn **[Start Gateway](../gateway-startup/)**.
>
> You'll learn:
> - How to start the Gateway daemon
> - Differences between development and production modes
> - How to monitor Gateway status
> - Auto-start with launchd/systemd

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Function | File Path | Lines |
|--- | --- | ---|
| Wizard main flow | [`src/wizard/onboarding.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.ts) | 87-452 |
| Security warning confirmation | [`src/wizard/onboarding.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.ts) | 46-85 |
| Gateway configuration | [`src/wizard/onboarding.gateway-config.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.gateway-config.ts) | 28-249 |
| Wizard interface definition | [`src/wizard/prompts.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/prompts.ts) | 36-52 |
| Channel configuration | [`src/commands/onboard-channels.ts`](https://github.com/moltbot/moltbot/blob/main/src/commands/onboard-channels.ts) | - |
| Skill configuration | [`src/commands/onboard-skills.ts`](https://github.com/moltbot/moltbot/blob/main/src/commands/onboard-skills.ts) | - |
| Wizard type definitions | [`src/wizard/onboarding.types.ts`](https://github.com/moltbot/moltbot/blob/main/src/wizard/onboarding.types.ts) | 1-26 |
| Config file Schema | [`src/config/zod-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.ts) | - |

**Key types**:
- `WizardFlow`: `"quickstart" | "advanced"` - Wizard mode type
- `QuickstartGatewayDefaults`: Gateway default configuration for QuickStart mode
- `GatewayWizardSettings`: Gateway configuration settings
- `WizardPrompter`: Wizard interaction interface

**Key functions**:
- `runOnboardingWizard()`: Main wizard flow
- `configureGatewayForOnboarding()`: Configure Gateway network and authentication
- `requireRiskAcknowledgement()`: Display and confirm security warning

**Default configuration values** (QuickStart mode):
- Gateway port: 18789
- Bind address: loopback (127.0.0.1)
- Authentication: token (auto-generates random token)
- Tailscale: off
- Workspace: `~/clawd`

**Configuration file locations**:
- Main config: `~/.clawdbot/clawdbot.json`
- OAuth credentials: `~/.clawdbot/credentials/oauth.json`
- API Key credentials: `~/.clawdbot/credentials/`
- Session data: `~/clawd/sessions.json`

</details>
