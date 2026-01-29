---
title: "Start Gateway: Daemon and Runtime Modes | Clawdbot Tutorial"
sidebarTitle: "Start Gateway"
subtitle: "Start Gateway: Daemon and Runtime Modes"
description: "Learn how to start the Clawdbot Gateway daemon, understand the differences between development and production modes, and master common startup commands and parameter configuration."
tags:
  - "gateway"
  - "daemon"
  - "startup"
prerequisite:
  - "start-onboarding-wizard"
order: 30
---

# Start Gateway: Daemon and Runtime Modes

## What You'll Learn

After completing this lesson, you will be able to:

- Start Gateway in foreground mode via command line
- Configure Gateway as a background daemon (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- Understand different binding modes (loopback / LAN / Tailnet) and authentication methods
- Switch between development and production modes
- Use `--force` to forcefully free occupied ports

## Your Current Challenge

You have completed the wizard configuration, and Gateway's basic setup is ready. However:

- Every time you want to use Gateway, you need to manually run commands in the terminal?
- After closing the terminal window, Gateway stops and the AI assistant goes "offline"?
- Want to access Gateway on your LAN or Tailscale network but don't know how to configure?
- Gateway fails to start, but you're not sure if it's a configuration issue or port conflict?

## When to Use This

**Recommended Startup Methods**:

| Scenario | Command | Description |
|----------|---------|-------------|
| Daily use | `clawdbot gateway install` + `clawdbot gateway start` | Auto-start as a background service |
| Development/Debugging | `clawdbot gateway --dev` | Create dev config with auto-reload |
| Temporary testing | `clawdbot gateway` | Run in foreground, logs output to terminal |
| Port conflict | `clawdbot gateway --force` | Force release port before starting |
| LAN access | `clawdbot gateway --bind lan` | Allow LAN devices to connect |
| Tailscale remote access | `clawdbot gateway --tailscale serve` | Expose Gateway via Tailscale network |

## 🎒 Prerequisites

::: warning Prerequisites Check

Before starting Gateway, please ensure:

1. ✅ Completed wizard configuration (`clawdbot onboard`) or manually set `gateway.mode=local`
2. ✅ AI model configured (Anthropic / OpenAI / OpenRouter, etc.)
3. ✅ Authentication configured if external network access (LAN / Tailnet) is needed
4. ✅ Understand your usage scenario (local development vs production)

:::

## Core Concepts

**What is Gateway?**

Gateway is Clawdbot's WebSocket control plane. It is responsible for:

- **Session Management**: Maintains all AI conversation session states
- **Channel Connections**: Connects 12+ messaging channels like WhatsApp, Telegram, Slack, etc.
- **Tool Invocation**: Coordinates tool execution like browser automation, file operations, scheduled tasks
- **Node Management**: Manages macOS / iOS / Android device nodes
- **Event Distribution**: Pushes real-time events like AI thinking progress and tool call results

**Why Run as a Daemon?**

Running Gateway as a background service offers these advantages:

- **Always Online**: AI assistant remains available even after closing terminal
- **Auto-Start**: Service automatically recovers after system restart (macOS LaunchAgent / Linux systemd)
- **Unified Management**: Control lifecycle via `start` / `stop` / `restart` commands
- **Centralized Logging**: System-level log collection for easier troubleshooting

## Follow Along

### Step 1: Start Gateway (Foreground Mode)

**Why**

Foreground mode is suitable for development and testing. Logs output directly to the terminal for real-time viewing of Gateway status.

```bash
# Start with default configuration (listen on 127.0.0.1:18789)
clawdbot gateway

# Start on specific port
clawdbot gateway --port 19001

# Enable verbose logging
clawdbot gateway --verbose
```

**You should see**:

```bash
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
✓ log file: /Users/you/.clawdbot/logs/gateway.log
```

::: tip Checkpoint

- Seeing `listening on ws://...` indicates successful startup
- Note the displayed PID (process ID) for future debugging
- Default port is 18789, can be changed via `--port`

:::

### Step 2: Configure Binding Mode

**Why**

By default, Gateway only listens on the local loopback address (`127.0.0.1`), meaning only the local machine can connect. If you want to access it on your LAN or Tailscale network, you need to adjust the binding mode.

```bash
# Local loopback only (default, most secure)
clawdbot gateway --bind loopback

# LAN access (requires authentication)
clawdbot gateway --bind lan --token "your-token"

# Tailscale network access
clawdbot gateway --bind tailnet --token "your-token"

# Auto-detect (local + LAN)
clawdbot gateway --bind auto
```

**You should see**:

```bash
# loopback mode
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# lan mode
✓ listening on ws://192.168.1.100:18789 (PID 12345)
✓ listening on ws://10.0.0.5:18789
```

::: warning Security Warning

⚠️ **Binding to non-loopback addresses requires authentication!**

- When using `--bind lan` / `--bind tailnet`, you must pass `--token` or `--password`
- Otherwise, Gateway will refuse to start with error: `Refusing to bind gateway to lan without auth`
- Auth tokens are passed via `gateway.auth.token` config or `--token` parameter

:::

### Step 3: Install as Daemon (macOS / Linux / Windows)

**Why**

Running as a daemon keeps Gateway in the background, unaffected by closing terminal windows. It auto-starts after system restart, keeping the AI assistant always online.

```bash
# Install as system service (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
clawdbot gateway install

# Start service
clawdbot gateway start

# View service status
clawdbot gateway status

# Restart service
clawdbot gateway restart

# Stop service
clawdbot gateway stop
```

**You should see**:

```bash
# macOS
✓ LaunchAgent loaded
✓ service runtime: active

# Linux
✓ systemd service enabled
✓ service runtime: active

# Windows
✓ Scheduled Task registered
✓ service runtime: running
```

::: tip Checkpoint

- Run `clawdbot gateway status` to confirm service status is `active` / `running`
- If service shows `loaded` but `runtime: inactive`, run `clawdbot gateway start`
- Daemon logs are written to `~/.clawdbot/logs/gateway.log`

:::

### Step 4: Handle Port Conflicts (--force)

**Why**

The default port 18789 may be occupied by other processes (such as a previous Gateway instance). Use `--force` to automatically release the port.

```bash
# Force release port and start Gateway
clawdbot gateway --force
```

**You should see**:

```bash
✓ force: killed pid 9876 (node) on port 18789
✓ force: waited 1200ms for port 18789 to free
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: info How It Works

`--force` performs the following operations in sequence:

1. Attempts SIGTERM to gracefully terminate the process (waits 700ms)
2. If not terminated, uses SIGKILL to force kill
3. Waits for port to be released (up to 2 seconds)
4. Starts new Gateway process

:::

### Step 5: Development Mode (--dev)

**Why**

Development mode uses an independent configuration file and directory to avoid polluting the production environment. Supports TypeScript hot-reload, automatically restarting Gateway after code changes.

```bash
# Start development mode (creates dev profile + workspace)
clawdbot gateway --dev

# Reset development config (clears credentials + sessions + workspace)
clawdbot gateway --dev --reset
```

**You should see**:

```bash
✓ dev config created at ~/.clawdbot-dev/clawdbot.json
✓ dev workspace initialized at ~/clawd-dev
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Development Mode Features

- Config file: `~/.clawdbot-dev/clawdbot.json` (independent from production config)
- Workspace directory: `~/clawd-dev`
- Skips `BOOT.md` script execution
- Binds loopback by default, no authentication required

:::

### Step 6: Tailscale Integration

**Why**

Tailscale allows you to access remote Gateways through a secure private network, without needing a public IP or port forwarding.

```bash
# Tailscale Serve mode (recommended)
clawdbot gateway --tailscale serve

# Tailscale Funnel mode (requires additional authentication)
clawdbot gateway --tailscale funnel --auth password
```

**You should see**:

```bash
# serve mode
✓ Tailscale identity detected
✓ advertising gateway via Tailscale Serve
✓ MagicDNS: https://your-tailnet.ts.net
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# funnel mode
✓ Tailscale Funnel enabled
✓ Funnel URL: https://your-tailnet.ts.net:18789
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip Configure Authentication

Tailscale integration supports two authentication methods:

1. **Identity Headers** (recommended): Set `gateway.auth.allowTailscale=true`, Tailscale identity automatically satisfies authentication
2. **Token / Password**: Traditional authentication method, requires manually passing `--token` or `--password`

:::

### Step 7: Verify Gateway Status

**Why**

Confirm Gateway is running normally and the RPC protocol is accessible.

```bash
# View full status (service + RPC probe)
clawdbot gateway status

# Skip RPC probe (service status only)
clawdbot gateway status --no-probe

# Health check
clawdbot gateway health

# Probe all reachable Gateways
clawdbot gateway probe
```

**You should see**:

```bash
# status command output
Gateway service status
┌──────────────────────────────────────┐
│ Service: LaunchAgent (loaded)      │
│ Runtime: running (PID 12345)       │
│ Port: 18789                       │
│ Last gateway error: none            │
└──────────────────────────────────────┘

RPC probe
┌──────────────────────────────────────┐
│ Target: ws://127.0.0.1:18789 │
│ Status: ✓ connected                │
│ Latency: 12ms                    │
└──────────────────────────────────────┘

# health command output
✓ Gateway is healthy
✓ WebSocket connection: OK
✓ RPC methods: available
```

::: tip Troubleshooting

If `status` shows `Runtime: running` but `RPC probe: failed`:

1. Check if port is correct: `clawdbot gateway status`
2. Check authentication config: Is it bound to LAN / Tailnet without providing authentication?
3. View logs: `cat ~/.clawdbot/logs/gateway.log`
4. Run `clawdbot doctor` for detailed diagnostics

:::

## Common Pitfalls

### ❌ Error: Gateway Refuses to Start

**Error Message**:
```
Gateway start blocked: set gateway.mode=local (current: unset) or pass --allow-unconfigured.
```

**Cause**: `gateway.mode` is not set to `local`

**Solution**:

```bash
# Method 1: Run wizard configuration
clawdbot onboard

# Method 2: Manually edit config file
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "mode": "local"
  }
}

# Method 3: Temporarily skip check (not recommended)
clawdbot gateway --allow-unconfigured
```

### ❌ Error: Binding to LAN Without Authentication

**Error Message**:
```
Refusing to bind gateway to lan without auth.
Set gateway.auth.token/password (or CLAWDBOT_GATEWAY_TOKEN/CLAWDBOT_GATEWAY_PASSWORD) or pass --token/--password.
```

**Cause**: Non-loopback binding requires authentication (security restriction)

**Solution**:

```bash
# Set authentication via config file
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}

# Or pass via command line
clawdbot gateway --bind lan --token "your-secure-token"
```

### ❌ Error: Port Already in Use

**Error Message**:
```
Error: listen EADDRINUSE: address already in use :::18789
```

**Cause**: Another Gateway instance or program is occupying the port

**Solution**:

```bash
# Method 1: Force release port
clawdbot gateway --force

# Method 2: Use different port
clawdbot gateway --port 19001

# Method 3: Manually find and kill process
lsof -ti:18789 | xargs kill -9  # macOS / Linux
netstat -ano | findstr :18789               # Windows
```

### ❌ Error: dev Mode Reset Requires --dev

**Error Message**:
```
Use --reset with --dev.
```

**Cause**: `--reset` can only be used in development mode to avoid accidentally deleting production data

**Solution**:

```bash
# Correct command to reset development environment
clawdbot gateway --dev --reset
```

### ❌ Error: Service Installed But Still Using Foreground Mode

**Symptom**: Running `clawdbot gateway` prompts "Gateway already running locally"

**Cause**: Daemon is already running in the background

**Solution**:

```bash
# Stop background service
clawdbot gateway stop

# Or restart service
clawdbot gateway restart

# Then start foreground (if debugging needed)
clawdbot gateway --port 19001  # Use different port
```

## Summary

In this lesson, we learned:

✅ **Startup Methods**: Foreground mode vs daemon
✅ **Binding Modes**: loopback / LAN / Tailnet / Auto
✅ **Authentication Methods**: Token / Password / Tailscale Identity
✅ **Development Mode**: Independent config, hot-reload, --reset for reset
✅ **Troubleshooting**: `status` / `health` / `probe` commands
✅ **Service Management**: `install` / `start` / `stop` / `restart` / `uninstall`

**Quick Command Reference**:

| Scenario | Command |
|----------|---------|
| Daily use (service) | `clawdbot gateway install && clawdbot gateway start` |
| Development/Debugging | `clawdbot gateway --dev` |
| Temporary testing | `clawdbot gateway` |
| Force release port | `clawdbot gateway --force` |
| LAN access | `clawdbot gateway --bind lan --token "xxx"` |
| Tailscale remote | `clawdbot gateway --tailscale serve` |
| View status | `clawdbot gateway status` |
| Health check | `clawdbot gateway health` |

## Next Lesson

> In the next lesson, we'll learn **[Send Your First Message](../first-message/)**.
>
> You'll learn:
> - Send your first message through WebChat
> - Chat with AI assistant via configured channels (WhatsApp/Telegram, etc.)
> - Understand message routing and response flow

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Function | File Path | Lines |
|-----------|-----------|-------|
| Gateway startup entry | [`src/cli/gateway-cli/run.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/run.ts) | 55-310 |
| Daemon service abstraction | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | 66-155 |
| Sidebar service startup | [`src/gateway/server-startup.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup.ts) | 26-160 |
| Gateway server implementation | [`src/gateway/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server.ts) | 1-500 |
| Program argument parsing | [`src/daemon/program-args.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/program-args.ts) | 1-250 |
| Startup log output | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 7-40 |
| Development mode config | [`src/cli/gateway-cli/dev.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/dev.ts) | 1-100 |
| Port release logic | [`src/cli/ports.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/ports.ts) | 1-80 |

**Key Constants**:
- Default port: `18789` (source: `src/gateway/server.ts`)
- Default binding: `loopback` (source: `src/cli/gateway-cli/run.ts:175`)
- Dev mode config path: `~/.clawdbot-dev/` (source: `src/cli/gateway-cli/dev.ts`)

**Key Functions**:
- `runGatewayCommand()`: Gateway CLI main entry, handles command-line arguments and startup logic
- `startGatewayServer()`: Starts WebSocket server, listens on specified port
- `forceFreePortAndWait()`: Forcefully releases port and waits
- `resolveGatewayService()`: Returns appropriate daemon implementation based on platform (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- `logGatewayStartup()`: Outputs Gateway startup information (model, listen address, log file)

</details>
