---
title: "CLI Commands Reference - Complete Command Manual | OpenClaw Tutorial"
sidebarTitle: "CLI Commands Reference"
subtitle: "CLI Commands Reference - Complete Command Manual"
description: "OpenClaw CLI complete command reference manual, including detailed explanations of all commands, parameter options, and usage examples."
tags:
  - "CLI"
  - "Commands"
  - "Reference"
order: 170
---

# CLI Commands Reference - Complete Command Manual

## Global Options

```bash
openclaw [options] [command]

Options:
  -V, --version           Show version number
  -h, --help              Show help information
  --config <path>         Specify configuration file path
  --json                  Output in JSON format
  --verbose               Show verbose output
```

## Core Commands

### agent - Chat with AI Assistant

Send messages to a specified session or the default Agent.

```bash
openclaw agent [options]

Options:
  -m, --message <text>        Message content (required)
  -t, --to <number>           Target phone number (E.164 format)
  -s, --session-id <id>       Session ID
  -k, --session-key <key>     Session key
  -a, --agent-id <id>         Agent ID
  --thinking <level>          Thinking level: low, medium, high, xhigh
  --thinking-once <level>     Thinking level for this request only
  --verbose <level>           Verbose level: on, full, off
  --timeout <seconds>         Timeout in seconds
  --deliver                   Send results to channel
  --images <paths...>         Attach images
  --json                      JSON format output
```

**Examples**

```bash
# Basic usage
openclaw agent -m "Hello"

# Specify target and thinking level
openclaw agent -t "+86138xxxxxxxx" -m "Analyze data" --thinking high

# With images
openclaw agent -m "Describe this image" --images ./photo.jpg

# One-time high thinking level
openclaw agent -m "Complex question" --thinking-once high
```

### gateway - Manage Gateway Service

Control the Gateway service startup, shutdown, and configuration.

```bash
openclaw gateway [subcommand]

Subcommands:
  run [options]              Start Gateway service
  stop                       Stop Gateway service
  restart                    Restart Gateway service
  status                     View Gateway status
  config                     Manage Gateway configuration

Options for 'run':
  -p, --port <port>          Specify port (default: 18789)
  --bind <mode>              Binding mode: loopback, lan, tailnet, auto
  --host <host>              Specify binding host
  --auth.mode <mode>         Authentication mode: token, password, off
  --auth.token <token>       Token authentication
  --auth.password <pass>     Password authentication
  --control-ui <bool>        Enable/disable Control UI
  --openai <bool>            Enable/disable OpenAI API
  --openresponses <bool>     Enable/disable OpenResponses API
```

**Examples**

```bash
# Start Gateway
openclaw gateway run

# Specify port and binding
openclaw gateway run --port 18790 --bind loopback

# Start with authentication
openclaw gateway run --auth.mode token --auth.token "xxx"
```

### config - Configuration Management

Manage OpenClaw configuration files.

```bash
openclaw config [subcommand]

Subcommands:
  get [path]                 Get configuration value
  set <path> <value>         Set configuration value
  delete <path>             Delete configuration item
  list                       List all configurations
  validate                   Validate configuration validity
  import <file>             Import configuration from file
  export [file]              Export configuration to file
```

**Examples**

```bash
# Get configuration
openclaw config get gateway.mode
openclaw config get channels.whatsapp.enabled

# Set configuration
openclaw config set gateway.mode local
openclaw config set channels.telegram.botToken "xxx"

# Delete configuration
openclaw config delete channels.discord

# Validate configuration
openclaw config validate

# Export/Import
openclaw config export backup.json
openclaw config import backup.json
```

### channels - Channel Management

Manage message channel configuration and status.

```bash
openclaw channels [subcommand]

Subcommands:
  list                       List all channels
  status [channel]           View channel status
  add <channel>             Add channel
  remove <channel>          Remove channel
  enable <channel>          Enable channel
  disable <channel>         Disable channel
  config <channel>          Configure channel

Supported channels:
  whatsapp, telegram, discord, slack
  signal, imessage, irc, googlechat
```

**Examples**

```bash
# List channels
openclaw channels list

# View status
openclaw channels status
openclaw channels status whatsapp

# WhatsApp login
openclaw channels add whatsapp

# Enable/disable
openclaw channels enable telegram
openclaw channels disable discord
```

### message - Message Operations

Send messages to specified channels.

```bash
openclaw message [action] [options]

Actions:
  send                       Send message
  poll                       Send poll

Options:
  -t, --to <target>          Target address
  --text <text>              Message content
  --channel <channel>        Channel
  --action <action>          Message action
  --json                      JSON format output
  --dry-run                   Simulate execution
```

**Examples**

```bash
# Send message
openclaw message send --to "+86138xxxxxxxx" --text "Hello"

# Specify channel
openclaw message send --channel whatsapp --to "..." --text "Hi"

# Simulate sending
openclaw message send --text "Test" --dry-run
```

### models - Model Management

Manage AI model providers and models.

```bash
openclaw models [subcommand]

Subcommands:
  list                       List available models
  test [model]               Test model connection
  add <provider>            Add model provider
  remove <provider>         Remove model provider
  set-default <model>       Set default model
```

**Examples**

```bash
# List models
openclaw models list

# Test model
openclaw models test anthropic/claude-3-5-sonnet

# Set default model
openclaw models set-default openai/gpt-4o
```

### skills - Skill Management

Manage OpenClaw skills.

```bash
openclaw skills [subcommand]

Subcommands:
  list                       List all skills
  info <skill>               View skill details
  enable <skill...>          Enable skills
  disable <skill...>         Disable skills
  install <source>          Install skill
  uninstall <skill>         Uninstall skill
  update <skill>             Update skill
```

**Examples**

```bash
# List skills
openclaw skills list

# Enable skills
openclaw skills enable postgres redis

# Install skills
openclaw skills install ./my-skill
openclaw skills install https://github.com/user/skill.git

# View details
openclaw skills info postgres
```

### cron - Scheduled Task Management

Manage Cron scheduled tasks.

```bash
openclaw cron [subcommand]

Subcommands:
  list                       List all tasks
  show <name>                View task details
  create [options]           Create task
  delete <name>              Delete task
  run <name>                  Run task immediately
  pause <name>               Pause task
  resume <name>              Resume task
  status                     View Cron status
  upcoming                   View upcoming tasks

Options for 'create':
  -n, --name <name>          Task name
  -s, --schedule <cron>      Cron expression
  -a, --agent <agent>        Agent ID
  -m, --message <text>       Task message
  --thinking <level>          Thinking level
  --timeout <seconds>         Timeout in seconds
  --retries <count>           Retry count
  --deliver-to <target>       Result delivery target
```

**Examples**

```bash
# Create task
openclaw cron create \
  --name "daily-report" \
  --schedule "0 9 * * *" \
  --message "Generate daily report"

# List tasks
openclaw cron list

# Run immediately
openclaw cron run daily-report
```

### doctor - Diagnostics and Repair

Run system diagnostics and fix issues.

```bash
openclaw doctor [options]

Options:
  --non-interactive          Non-interactive mode
  --report                   Generate diagnostic report
  --fix                      Auto-fix issues
  --skip-checks <checks>     Skip specified checks
```

**Examples**

```bash
# Run diagnostics
openclaw doctor

# Non-interactive mode
openclaw doctor --non-interactive

# Generate report
openclaw doctor --report > report.txt
```

### status - View Status

View the status of all system components.

```bash
openclaw status [options]

Options:
  --all                      Show all information
  --gateway                  Show Gateway status only
  --channels                 Show channel status
  --models                   Show model status
  --probe                    Actively probe status
  --stats                    Show statistics
```

**Examples**

```bash
# View status
openclaw status

# Detailed status
openclaw status --all

# With probe
openclaw status --probe
```

### logs - View Logs

View system logs.

```bash
openclaw logs [options]

Options:
  --follow                   Real-time tracking
  --lines <n>                Number of lines to display
  --level <level>            Log level: error, warn, info, debug
  --channel <channel>        Channel filter
  --since <time>             Start time
  --until <time>             End time
```

**Examples**

```bash
# View logs
openclaw logs

# Real-time tracking
openclaw logs --follow

# Channel logs
openclaw logs --channel whatsapp

# Error logs
openclaw logs --level error
```

### browser - Browser Control

Manage browser profiles and operations.

```bash
openclaw browser [subcommand]

Subcommands:
  status                     View browser status
  profile [action]           Manage profiles
  navigate <url>             Navigate to URL
  screenshot [options]       Take screenshot
  tabs [action]              Manage tabs
```

**Examples**

```bash
# View status
openclaw browser status

# Create profile
openclaw browser profile create work

# Take screenshot
openclaw browser screenshot --full-page
```

### pairing - DM Pairing Management

Manage user pairing status.

```bash
openclaw pairing [subcommand]

Subcommands:
  list                       List paired users
  remove <id>                Remove pairing
  clear                      Clear all pairings
  history                    View pairing history
```

### sessions - Session Management

Manage AI conversation sessions.

```bash
openclaw sessions [subcommand]

Subcommands:
  list                       List sessions
  show <key>                 View session details
  delete <key>                Delete session
  prune [options]            Clean up old sessions
  export <key> [file]        Export session
```

**Examples**

```bash
# List sessions
openclaw sessions list

# Clean up old sessions
openclaw sessions prune --older-than 7d
```

## Shortcut Commands

| Shortcut | Equivalent Command | Description |
| --- | --- | --- |
| `openclaw g` | `openclaw gateway` | Gateway shortcut |
| `openclaw c` | `openclaw config` | Config shortcut |
| `openclaw s` | `openclaw status` | Status shortcut |
| `openclaw m` | `openclaw message` | Message shortcut |
| `openclaw a` | `openclaw agent` | Agent shortcut |

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `OPENCLAW_CONFIG_PATH` | Configuration file path | `~/.openclaw/openclaw.json` |
| `OPENCLAW_LOG_LEVEL` | Log level | `debug`, `info`, `warn`, `error` |
| `OPENCLAW_HOME` | OpenClaw home directory | `~/.openclaw` |
| `OPENCLAW_GATEWAY_PORT` | Gateway port | `18789` |

## Exit Codes

| Code | Meaning |
| --- | --- |
| 0 | Success |
| 1 | General error |
| 2 | Configuration error |
| 3 | Network error |
| 4 | Authentication error |
| 5 | Timeout |
| 130 | User interrupt (Ctrl+C) |

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand and view source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Command Registration | [`src/cli/program/command-registry.ts`](https://github.com/openclaw/openclaw/blob/main/src/cli/program/command-registry.ts) | - |
| Agent Command | [`src/commands/agent.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/agent.ts) | 64-529 |
| Gateway Command | [`src/commands/configure.gateway.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/configure.gateway.ts) | - |
| Doctor Command | [`src/commands/doctor.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor.ts) | 65-300 |
| Status Command | [`src/commands/status.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/status.ts) | - |
| Message Command | [`src/commands/message.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/message.ts) | 14-67 |
| Models Command | [`src/commands/models.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/models.ts) | - |

**Command Directory Structure**:
- `src/commands/` - All command implementations
- `src/cli/program/` - CLI program entry and command registration

</details>
