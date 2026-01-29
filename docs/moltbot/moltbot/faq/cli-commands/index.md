---
title: "CLI Command Reference: Complete Command List and Usage | Clawdbot Tutorial"
sidebarTitle: "CLI Commands"
subtitle: "CLI Command Reference: Complete command list and usage guide"
description: "Learn the complete reference for all Clawdbot CLI commands, including 24 command groups like gateway, agent, models, channels, nodes, skills, etc. Detailed usage, option descriptions, and practical examples. Quickly find any CLI command's usage and parameters, get started with complex commands through examples, and effectively manage Gateway, Agents, channels, scheduled tasks, device nodes, skill packages, and browser automation."
tags:
  - "CLI"
  - "Command Reference"
  - "FAQ"
prerequisite:
  - "start-getting-started"
order: 320
---

# CLI Command Reference: Complete Command List and Usage Guide

## What You'll Learn

This lesson provides a complete command reference for Clawdbot CLI, enabling you to:
- Quickly find usage for any CLI command
- Understand options and parameters for each command
- Get started with complex commands through examples

## When to Use This

When you need to:
- Find specific usage for a command
- Understand all options supported by a command
- Manage system components like Gateway, Agents, channels, and more via CLI

---

## Command Overview

Clawdbot CLI provides 24 main command groups covering all aspects of system management:

| Command Group | Description |
|--- | ---|
| `gateway` / `daemon` | Gateway service control (start, stop, status) |
| `agent` / `agents` | Agent interaction and management |
| `models` | AI model configuration and authentication |
| `message` | Send messages and channel operations |
| `channels` | Channel management (login, status, logout) |
| `sessions` | Session management (list, reset, delete) |
| `nodes` / `node` | Node management and control |
| `devices` | Device pairing and token management |
| `skills` | Skill management (install, update, status) |
| `cron` | Scheduled task management |
| `browser` | Browser tool management |
| `approvals` | Exec approval management |
| `logs` | Gateway log viewing |
| `system` | System events, heartbeat, and online status |
| `tui` | Terminal UI |
| `sandbox` | Sandbox tools |
| `configure` | Interactive configuration wizard |
| `onboard` | Complete installation wizard |
| `doctor` | Diagnostic and security checks |
| `plugins` | Plugin management |
| `hooks` / `webhooks` | Webhook management |
| `pairing` | Pairing assistant |
| `update` | CLI update assistant |

---

## Core Gateway Commands

### gateway - Gateway Service Control

Gateway commands manage the lifecycle of the Clawdbot WebSocket Gateway service.

#### gateway run

Run WebSocket Gateway in the foreground.

```bash
clawdbot gateway run
```

#### gateway status

Display Gateway service status and probe running Gateways.

```bash
clawdbot gateway status [options]
```

**Options**:
- `--url <url>` - Gateway WebSocket URL (default uses config/remote/local)
- `--token <token>` - Gateway token (if required)
- `--password <password>` - Gateway password (password authentication)
- `--timeout <ms>` - Timeout in milliseconds, default 10000
- `--no-probe` - Skip RPC probing
- `--deep` - Scan system-level services
- `--json` - Output JSON format

**Examples**:

```bash
# Check local Gateway status
clawdbot gateway status

# Probe remote Gateway (with timeout)
clawdbot gateway status --url ws://remote:18789 --timeout 5000

# Deep scan system services
clawdbot gateway status --deep

# JSON output (machine-readable)
clawdbot gateway status --json
```

#### gateway install

Install Gateway service (launchd/systemd/schtasks).

```bash
clawdbot gateway install [options]
```

**Options**:
- `--port <port>` - Gateway port
- `--runtime <runtime>` - Daemon runtime (node|bun), default node
- `--token <token>` - Gateway token (token authentication)
- `--force` - Force reinstall/overwrite (if already installed)
- `--json` - Output JSON format

#### gateway uninstall

Uninstall Gateway service.

```bash
clawdbot gateway uninstall [options]
```

#### gateway start / stop / restart

Start, stop, or restart Gateway service.

```bash
clawdbot gateway start
clawdbot gateway stop
clawdbot gateway restart
```

---

### status - System Status

Display channel health status and recent session recipients.

```bash
clawdbot status [options]
```

**Options**:
- `--json` - Output JSON instead of text
- `--all` - Full diagnostics (read-only, safe to paste)
- `--usage` - Show model provider usage/quota snapshot
- `--deep` - Probe channels (WhatsApp Web + Telegram + Discord + Slack + Signal)
- `--timeout <ms>` - Probe timeout in milliseconds, default 10000
- `--verbose` - Verbose logging
- `--debug` - Alias for `--verbose`

**Examples**:

```bash
# Basic status check
clawdbot status

# Full diagnostics
clawdbot status --all

# Display usage statistics
clawdbot status --usage

# Deep probe all channels
clawdbot status --deep

# JSON output
clawdbot status --json
```

---

### health - Gateway Health Check

Get health status from running Gateway.

```bash
clawdbot health [options]
```

**Options**:
- `--json` - Output JSON instead of text
- `--timeout <ms>` - Connection timeout in milliseconds, default 10000
- `--verbose` - Verbose logging
- `--debug` - Alias for `--verbose`

---

## Agent Commands

### agent - Run Agent Turn

Run Agent turn through Gateway (use `--local` to run embedded Agent).

```bash
clawdbot agent [options]
```

**Options**:
- `-m, --message <text>` - Agent message body (required)
- `-t, --to <number>` - Recipient number for deriving session key (E.164 format)
- `--session-id <id>` - Use explicit session ID
- `--agent <id>` - Agent ID (override routing binding)
- `--thinking <level>` - Thinking level: off | minimal | low | medium | high
- `--verbose <on|off>` - Agent verbosity for session persistence
- `--channel <channel>` - Delivery channel
- `--reply-to <target>` - Delivery target override (separate from session routing)
- `--reply-channel <channel>` - Delivery channel override (separate from session routing)
- `--reply-account <id>` - Delivery account ID override
- `--local` - Run embedded Agent locally (requires model provider API keys configured in shell)
- `--deliver` - Send Agent's reply back to selected channel
- `--json` - Output result as JSON
- `--timeout <seconds>` - Override Agent command timeout in seconds, default 600 or config value

**Examples**:

```bash
# Start new session
clawdbot agent --to +15555550123 --message "status update"

# Use specific Agent
clawdbot agent --agent ops --message "Summarize logs"

# Target specific session and set thinking level
clawdbot agent --session-id 1234 --message "Summarize inbox" --thinking medium

# Enable verbose logging and JSON output
clawdbot agent --to +15555550123 --message "Trace logs" --verbose on --json

# Deliver reply
clawdbot agent --to +15555550123 --message "Summon reply" --deliver

# Send reply to different channel/target
clawdbot agent --agent ops --message "Generate report" --deliver --reply-channel slack --reply-to "#reports"
```

---

### agents - Manage Isolated Agents

Manage isolated Agents (workspace + auth + routing).

#### agents list

List configured Agents.

```bash
clawdbot agents list [options]
```

**Options**:
- `--json` - Output JSON instead of text
- `--bindings` - Include routing bindings

**Examples**:

```bash
clawdbot agents list
clawdbot agents list --bindings
clawdbot agents list --json
```

#### agents add

Add new isolated Agent.

```bash
clawdbot agents add [name] [options]
```

**Options**:
- `--workspace <dir>` - Workspace directory for new Agent
- `--model <id>` - Model ID for this Agent
- `--agent-dir <dir>` - Agent state directory for this Agent
- `--bind <channel[:accountId]>` - Route channel binding (repeatable)
- `--non-interactive` - Disable prompts; requires `--workspace`
- `--json` - Output JSON summary

**Examples**:

```bash
# Interactive add (recommended)
clawdbot agents add my-agent

# Non-interactive add
clawdbot agents add my-agent --workspace ~/clawd/workspaces/my-agent --model claude-sonnet-4-20250514
```

#### agents set-identity

Update Agent identity (name/theme/emoji/avatar).

```bash
clawdbot agents set-identity [options]
```

**Options**:
- `--agent <id>` - Agent ID to update
- `--workspace <dir>` - Workspace directory for locating Agent + IDENTITY.md
- `--identity-file <path>` - Explicitly specify IDENTITY.md path to read
- `--from-identity` - Read values from IDENTITY.md
- `--name <name>` - Identity name
- `--theme <theme>` - Identity theme
- `--emoji <emoji>` - Identity emoji
- `--avatar <value>` - Identity avatar (workspace path, http(s) URL, or data URI)
- `--json` - Output JSON summary

**Examples**:

```bash
# Set name and emoji
clawdbot agents set-identity --agent main --name "Clawd" --emoji "🦞"

# Set avatar path
clawdbot agents set-identity --agent main --avatar avatars/clawd.png

# Load from IDENTITY.md
clawdbot agents set-identity --workspace ~/clawd --from-identity

# Use specific IDENTITY.md
clawdbot agents set-identity --identity-file ~/clawd/IDENTITY.md --agent main
```

#### agents delete

Delete Agent and clean up workspace/state.

```bash
clawdbot agents delete <id> [options]
```

**Options**:
- `--force` - Skip confirmation
- `--json` - Output JSON summary

**Examples**:

```bash
clawdbot agents delete my-agent
clawdbot agents delete my-agent --force
```

---

## Model Management Commands

### models - Model Discovery, Scanning, and Configuration

::: info
`models` commands manage AI model providers, authentication configuration, and model aliases.
:::

#### models list

List models (default shows configured models).

```bash
clawdbot models list [options]
```

**Options**:
- `--all` - Show full model catalog
- `--local` - Filter to local models
- `--provider <name>` - Filter by provider
- `--json` - Output JSON
- `--plain` - Plain text line output

**Examples**:

```bash
clawdbot models list
clawdbot models list --all
clawdbot models list --provider anthropic --json
```

#### models status

Display configured model status.

```bash
clawdbot models status [options]
```

**Options**:
- `--json` - Output JSON
- `--plain` - Plain text output
- `--check` - Non-zero exit if auth expired/expired (1=expired/missing, 2=expiring soon)
- `--probe` - Probe configured provider authentication (real-time)
- `--probe-provider <name>` - Probe single provider only
- `--probe-profile <id>` - Probe specific auth profile ID only (repeatable or comma-separated)
- `--probe-timeout <ms>` - Timeout per probe in milliseconds
- `--probe-concurrency <n>` - Concurrent probe count
- `--probe-max-tokens <n>` - Probe max tokens (best effort)

**Examples**:

```bash
clawdbot models status
clawdbot models status --probe
clawdbot models status --check
clawdbot models status --probe-provider anthropic --json
```

#### models set

Set default model.

```bash
clawdbot models set <model>
```

**Arguments**:
- `<model>` - Model ID or alias

**Examples**:

```bash
clawdbot models set claude-sonnet-4-20250514
clawdbot models set gpt-4o
```

#### models set-image

Set image generation model.

```bash
clawdbot models set-image <model>
```

**Arguments**:
- `<model>` - Model ID or alias

---

### models aliases - Model Alias Management

#### models aliases list

List model aliases.

```bash
clawdbot models aliases list [options]
```

**Options**:
- `--json` - Output JSON
- `--plain` - Plain text output

#### models aliases add

Add or update model alias.

```bash
clawdbot models aliases add <alias> <model>
```

**Arguments**:
- `<alias>` - Alias name
- `<model>` - Model ID or alias

**Examples**:

```bash
clawdbot models aliases add fast claude-3-5-sonnet-20241022
```

#### models aliases remove

Remove model alias.

```bash
clawdbot models aliases remove <alias>
```

---

### models auth - Model Authentication Management

#### models auth add

Add model authentication configuration.

```bash
clawdbot models auth add [options]
```

**Options**:
- `--provider <name>` - Provider name
- `--profile <id>` - Profile ID
- `--key <key>` - API key
- `--token <token>` - OAuth token

#### models auth login

Login to model provider via OAuth.

```bash
clawdbot models auth login [options]
```

**Options**:
- `--provider <name>` - Provider name

**Supported Providers**:
- Anthropic (Claude)
- OpenAI
- Qwen Portal
- GitHub Copilot

**Examples**:

```bash
clawdbot models auth login --provider anthropic
```

#### models auth paste-token

Paste API token (for opened authentication flow).

```bash
clawdbot models auth paste-token [options]
```

#### models auth setup-token

Setup API token (manual entry).

```bash
clawdbot models auth setup-token [options]
```

---

### models fallbacks - Model Fallback Configuration

#### models fallbacks list

List model fallback configurations.

```bash
clawdbot models fallbacks list [options]
```

#### models fallbacks add

Add model fallback configuration.

```bash
clawdbot models fallbacks add [options]
```

#### models fallbacks remove

Remove model fallback configuration.

```bash
clawdbot models fallbacks remove [options]
```

#### models fallbacks clear

Clear all model fallback configurations.

```bash
clawdbot models fallbacks clear [options]
```

---

### models image-fallbacks - Image Model Fallback Configuration

#### models image-fallbacks list

List image model fallback configurations.

```bash
clawdbot models image-fallbacks list [options]
```

#### models image-fallbacks add

Add image model fallback configuration.

```bash
clawdbot models image-fallbacks add [options]
```

#### models image-fallbacks remove

Remove image model fallback configuration.

```bash
clawdbot models image-fallbacks remove [options]
```

#### models image-fallbacks clear

Clear all image model fallback configurations.

```bash
clawdbot models image-fallbacks clear [options]
```

---

### models auth-order - Authentication Order Management

#### models auth-order get

Get authentication order.

```bash
clawdbot models auth-order get [options]
```

#### models auth-order set

Set authentication order.

```bash
clawdbot models auth-order set [options]
```

#### models auth-order clear

Clear authentication order.

```bash
clawdbot models auth-order clear [options]
```

---

## Message Commands

### message - Send Messages and Channel Operations

::: info
`message` commands are used to send messages to various channels and perform channel-specific operations.
:::

#### message send

Send text/media message.

```bash
clawdbot message send [options]
```

**Options**:
- `--target <target>` - Target recipient (channel-specific format)
- `--message <text>` - Message text
- `--media <path>` - Media file path
- `--channel <channel>` - Delivery channel
- `--reply-to <id>` - Reply to message ID

**Examples**:

```bash
# Send text message
clawdbot message send --target +15555550123 --message "Hi"

# Send message with media
clawdbot message send --target +15555550123 --message "Check this" --media photo.jpg

# Reply to message
clawdbot message send --target 123 --message "Reply" --reply-to 456 --channel discord
```

#### message broadcast

Send broadcast message to multiple recipients.

```bash
clawdbot message broadcast [options]
```

#### message poll

Create poll (Discord, etc.).

```bash
clawdbot message poll [options]
```

**Options**:
- `--channel <channel>` - Channel (e.g., discord)
- `--target <target>` - Target (e.g., channel:123)
- `--poll-question <text>` - Poll question
- `--poll-option <text>` - Poll option (repeatable)

**Examples**:

```bash
clawdbot message poll --channel discord --target channel:123 --poll-question "Snack?" --poll-option Pizza --poll-option Sushi
```

#### message react

React to message (add emoji).

```bash
clawdbot message react [options]
```

**Options**:
- `--channel <channel>` - Channel (e.g., discord)
- `--target <target>` - Message ID
- `--message-id <id>` - Message ID
- `--emoji <emoji>` - Emoji (e.g., ✅)

**Examples**:

```bash
clawdbot message react --channel discord --target 123 --message-id 456 --emoji "✅"
```

#### message pin / unpin

Pin/unpin message.

```bash
clawdbot message pin [options]
clawdbot message unpin [options]
```

#### message read / edit / delete

Read, edit, or delete message.

```bash
clawdbot message read [options]
clawdbot message edit [options]
clawdbot message delete [options]
```

#### message permissions

Manage message permissions.

```bash
clawdbot message permissions [options]
```

#### message search

Search messages.

```bash
clawdbot message search [options]
```

#### message thread

Thread operations (Telegram, etc.).

```bash
clawdbot message thread [options]
```

#### message emoji / sticker

Emoji and sticker operations.

```bash
clawdbot message emoji [options]
clawdbot message sticker [options]
```

#### message discord-admin

Discord admin operations (channels, roles, etc.).

```bash
clawdbot message discord-admin [options]
```

---

## Channel Management Commands

### channels - Channel Management

Manage channel login, status, and logout.

```bash
clawdbot channels [command] [options]
```

**Subcommands**:
- `login` - Login to channel account
- `status` - Display channel status
- `logout` - Logout from channel account
- `list` - List all channels

**Supported Channels**:
- WhatsApp
- Telegram
- Slack
- Discord
- Google Chat
- Signal
- iMessage
- BlueBubbles
- Microsoft Teams
- Matrix
- Zalo
- Zalo Personal
- LINE

**Examples**:

```bash
# View all channel status
clawdbot channels status

# Login to WhatsApp
clawdbot channels login whatsapp

# Logout from Telegram
clawdbot channels logout telegram
```

---

## Session Management Commands

### sessions - Session Management

Manage session list, reset, delete, and compaction.

```bash
clawdbot sessions [command] [options]
```

**Subcommands**:
- `list` - List active sessions
- `reset` - Reset session (clear history)
- `delete` - Delete session
- `compact` - Compact session history
- `history` - Get session history
- `send` - Send message to another session
- `spawn` - Create child Agent session

**Examples**:

```bash
# List all sessions
clawdbot sessions list

# Reset specific session
clawdbot sessions reset --session-id 123

# Delete session
clawdbot sessions delete --session-id 456

# View session history
clawdbot sessions history --session-id 789
```

---

## Node Management Commands

### nodes - Manage Gateway-owned Node Pairings

Manage Gateway-owned node pairings.

```bash
clawdbot nodes [command] [options]
```

**Subcommands**:
- `status` - Node status
- `pair` - Pair new node
- `unpair` - Unpair node
- `invoke` - Invoke node operation
- `notify` - Send system notification
- `canvas` - Canvas operations
- `camera` - Camera operations
- `screen` - Screen recording
- `location` - Location retrieval

---

### node - Node Control

Control single node operations.

```bash
clawdbot node [command] [options]
```

---

### devices - Device Pairing and Token Management

Manage device pairings and access tokens.

```bash
clawdbot devices [command] [options]
```

---

## Skill Management Commands

### skills - Skill Management

Manage skill installation, updates, and status.

```bash
clawdbot skills [command] [options]
```

**Subcommands**:
- `list` - List skills
- `info` - Display skill information
- `check` - Check skill dependencies
- `install` - Install skill
- `update` - Update skill
- `uninstall` - Uninstall skill

**Examples**:

```bash
# List all skills
clawdbot skills list

# List eligible skills
clawdbot skills list --eligible

# View skill information
clawdbot skills info <skill-name>

# Check skill dependencies
clawdbot skills check
```

::: tip
Use `npx clawdhub` to search, install, and sync skills.
:::

---

## Scheduled Task Commands

### cron - Cron Scheduler

Manage scheduled tasks.

```bash
clawdbot cron [command] [options]
```

**Subcommands**:
- `list` - List scheduled tasks
- `add` - Add scheduled task
- `remove` - Remove scheduled task
- `run` - Manually run scheduled task
- `logs` - View scheduled task logs

**Examples**:

```bash
# List all scheduled tasks
clawdbot cron list

# Add scheduled task
clawdbot cron add --cron "0 9 * * *" --message "Good morning"

# Manually run task
clawdbot cron run <job-id>
```

---

## Browser Commands

### browser - Browser Tool Management

Manage browser automation tools.

```bash
clawdbot browser [command] [options]
```

**Subcommands**:
- `status` - Browser status
- `inspect` - Inspect browser instance
- `actions` - Execute browser actions
- `observe` - Observe browser events
- `debug` - Debug browser
- `extension` - Extension management

---

## Approval Commands

### approvals - Exec Approvals

Manage Shell command execution approvals.

```bash
clawdbot approvals [command] [options]
```

**Subcommands**:
- `list` - List approval rules
- `add` - Add approval rule
- `remove` - Remove approval rule
- `clear` - Clear all rules

---

## Other Management Commands

### logs - Gateway Logs

View Gateway logs.

```bash
clawdbot logs [options]
```

**Options**:
- `--follow` - Follow log output
- `--tail <n>` - Show last n lines

---

### system - System Events

System events, heartbeat, and online status.

```bash
clawdbot system [command] [options]
```

**Subcommands**:
- `events` - System events
- `heartbeat` - Heartbeat status
- `presence` - Online status

---

### tui - Terminal UI

Launch terminal UI.

```bash
clawdbot tui
```

---

### sandbox - Sandbox Tools

Sandbox isolation tools.

```bash
clawdbot sandbox [command] [options]
```

---

### configure - Interactive Configuration

Interactive prompts to set up credentials, devices, and Agent defaults.

```bash
clawdbot configure [options]
```

**Options**:
- `--section <section>` - Configuration section (repeatable)

**Configuration Sections**:
- credentials
- devices
- agent
- channels
- tools
- etc.

---

### onboard - Complete Installation Wizard

Run complete first-time installation wizard.

```bash
clawdbot onboard
```

---

### doctor - Diagnostic and Security Checks

Run diagnostic and security checks.

```bash
clawdbot doctor [options]
```

**Subcommands**:
- `check` - Run health checks
- `diagnose` - Diagnose issues
- `security` - Security checks

---

### plugins - Plugin Management

Plugin management.

```bash
clawdbot plugins [command] [options]
```

---

### hooks / webhooks - Webhook Management

Webhook tools.

```bash
clawdbot hooks [command] [options]
clawdbot webhooks [command] [options]
```

---

### pairing - Pairing Assistant

Pairing assistant tools.

```bash
clawdbot pairing [command] [options]
```

---

### directory - Directory Commands

Directory management commands.

```bash
clawdbot directory [command] [options]
```

---

### security - Security Assistant

Security assistant tools.

```bash
clawdbot security [command] [options]
```

---

### update - CLI Update Assistant

CLI update assistant.

```bash
clawdbot update [command] [options]
```

---

### dns - DNS Assistant

DNS assistant tools.

```bash
clawdbot dns [command] [options]
```

---

### docs - Documentation Assistant

Documentation assistant tools.

```bash
clawdbot docs [command] [options]
```

---

## Common Options

The following options are common across multiple commands:

### JSON Output

Most commands support the `--json` option for machine-readable JSON output.

```bash
clawdbot status --json
clawdbot models list --json
clawdbot sessions list --json
```

### Timeout Settings

Network-related commands typically support the `--timeout <ms>` option.

```bash
clawdbot gateway status --timeout 5000
clawdbot health --timeout 3000
```

### Verbose Logging

Use `--verbose` or `--debug` options when debugging.

```bash
clawdbot status --verbose
clawdbot agent --debug --message "test"
```

---

## Help and Documentation

### View Help

All commands and subcommands support the `--help` option.

```bash
clawdbot --help              # Show main help
clawdbot gateway --help       # Show gateway command help
clawdbot models status --help # Show models status subcommand help
```

### Online Documentation

Many commands include online documentation links in their help output.

---

## Troubleshooting

### Command Not Found

If a command is not found, ensure:
1. Clawdbot is properly installed
2. You're using the latest version: `clawdbot update`
3. The command is spelled correctly

### Connection Failed

If Gateway connection fails:
1. Check if Gateway is running: `clawdbot gateway status`
2. Verify port configuration
3. Check authentication credentials

---

## Summary

This lesson provided a complete command reference for Clawdbot CLI, including:
- Core Gateway commands (gateway, status, health)
- Agent management commands (agent, agents)
- Model configuration commands (models, models auth, models aliases)
- Message sending commands (message)
- Channel management commands (channels)
- Session management commands (sessions)
- Node management commands (nodes, node, devices)
- Skill management commands (skills)
- Scheduled task commands (cron)
- Other management commands (logs, system, configure, doctor, etc.)

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Performance Optimization](../performance-optimization/)**.
>
> You'll learn:
> - How to optimize Gateway performance
> - Methods to reduce latency
> - Memory management techniques
> - Concurrency control strategies

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature | File Path | Lines |
|--- | --- | ---|
| CLI Main Program | [`src/cli/program.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program.ts) | Full file |
| Command Registration | [`src/cli/program/register.subclis.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.subclis.ts) | 30-225 |
| Agent Commands | [`src/cli/program/register.agent.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.agent.ts) | 20-210 |
| Message Commands | [`src/cli/program/register.message.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.message.ts) | 24-68 |
| Models Commands | [`src/cli/models-cli.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/models-cli.ts) | 38-150 |
| Gateway Commands | [`src/cli/gateway-cli/register.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/gateway-cli/register.ts) | 98-150 |
| Status/Health Commands | [`src/cli/program/register.status-health-sessions.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.status-health-sessions.ts) | 27-100 |
| Configure Commands | [`src/cli/program/register.configure.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.configure.ts) | 12-52 |
| Skills Commands | [`src/cli/skills-cli.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/skills-cli.ts) | 16-100 |
| Nodes Commands | [`src/cli/nodes-cli/register.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/nodes-cli/register.ts) | 13-32 |

**Key Command Group Registration**:
- 24 main command groups: gateway, daemon, logs, system, models, approvals, nodes, devices, node, sandbox, tui, cron, dns, docs, hooks, webhooks, pairing, plugins, channels, directory, security, skills, update, acp

</details>
