---
title: "Troubleshooting: Resolve Gateway Startup, Channel Connection, Auth Errors, and More"
sidebarTitle: "Troubleshooting"
subtitle: "Troubleshooting: Solving Common Issues"
description: "Learn how to resolve common Clawdbot issues, including Gateway startup failures, channel connection problems, authentication errors, tool call failures, session management, and performance optimization."
tags:
  - "troubleshooting"
  - "diagnostics"
  - "faq"
prerequisite: []
order: 310
---

# Troubleshooting: Solving Common Issues

Clawdbot acting up? Don't panic—here's a systematic approach to troubleshooting. This tutorial helps you quickly identify problems and find solutions.

## What You'll Learn

- Quickly diagnose Gateway and system status
- Identify and resolve Gateway startup failures and channel connection issues
- Fix authentication and model configuration errors
- Resolve tool call failures and performance issues

## First Steps: 60-Second Quick Check

When you encounter problems, run these commands in sequence to quickly identify the root cause:

```bash
# 1. Check overall status
clawdbot status

# 2. Deep diagnostics (includes config, runtime state, logs)
clawdbot status --all

# 3. Probe Gateway connectivity
clawdbot gateway probe

# 4. View logs in real-time
clawdbot logs --follow

# 5. Run diagnostic checks
clawdbot doctor
```

If the Gateway is connectable and you need deep probing:

```bash
clawdbot status --deep
```

::: tip Command Reference
| Command | Function | Use Case |
|--- | --- | ---|
| `clawdbot status` | Local summary: system info, Gateway connection, service status, Agent status, provider config | First check, quick overview |
| `clawdbot status --all` | Complete diagnostics (read-only, shareable, relatively safe), includes log tail | When sharing debug reports |
| `clawdbot status --deep` | Run Gateway health check (includes provider probing, requires connectable Gateway) | When "configured" doesn't equal "working" |
| `clawdbot gateway probe` | Gateway discovery + connectivity (local + remote target) | Suspect probing wrong Gateway |
| `clawdbot channels status --probe` | Request running Gateway for channel status (optional probing) | Gateway reachable but channels misbehaving |
| `clawdbot gateway status` | Supervisor status (launchd/systemd/schtasks), runtime PID/exit, last Gateway error | Service "appears loaded" but nothing running |
:::

::: warning When Sharing Output
- Prefer `clawdbot status --all` (automatically redacts tokens)
- If you must paste `clawdbot status`, set `CLAWDBOT_SHOW_SECRETS=0` first (hides token preview)
:::

## Common Issue Troubleshooting

### Gateway Issues

#### "clawdbot: command not found"

**Symptom**: Terminal reports command not found.

**Cause**: Almost always a Node/npm PATH issue.

**Solution**:

```bash
# 1. Verify Node.js is installed
node --version  # Requires ≥22

# 2. Verify npm/pnpm is available
npm --version
# or
pnpm --version

# 3. Check global installation path
which clawdbot
npm list -g --depth=0 | grep clawdbot
```

If command not found:

```bash
# Reinstall
npm install -g clawdbot@latest
# or
pnpm add -g clawdbot@latest
```

**Related Docs**: [Quick Start](/moltbot/moltbot/start/getting-started/)

---

#### Gateway Startup Failed: "configuration invalid" / "set gateway.mode=local"

**Symptom**: Gateway refuses to start, complaining about invalid config or missing mode.

**Cause**: Config file exists but `gateway.mode` is not set (or not `local`), Gateway refuses to start.

**Solution** (Recommended):

```bash
# Run wizard and set Gateway mode to Local
clawdbot configure
```

Or set directly:

```bash
clawdbot config set gateway.mode local
```

If you plan to run a **Remote Gateway**:

```bash
clawdbot config set gateway.mode remote
clawdbot config set gateway.remote.url "wss://gateway.example.com"
```

::: info Temporary Debug Mode
For ad-hoc/dev scenarios: pass `--allow-unconfigured` to start Gateway (doesn't require `gateway.mode=local`)
:::

If you don't have a config file yet:

```bash
clawdbot setup  # Create initial config, then restart Gateway
```

---

#### Gateway "unauthorized", Cannot Connect, or Keeps Reconnecting

**Symptom**: CLI reports unauthorized, cannot connect to Gateway, or keeps reconnecting.

**Cause**: Authentication misconfigured or missing.

**Check Steps**:

```bash
# 1. Check Gateway status
clawdbot gateway status

# 2. View logs
clawdbot logs --follow
```

**Solution**:

1. Check `gateway.auth.mode` config (valid values: `token`/`password`/`tailscale`)
2. If using `token` mode:
   ```bash
   clawdbot config get gateway.auth.token
   ```
3. If using `password` mode, verify password is correct
4. If using non-loopback binding (`lan`/`tailnet`/`custom`), you must configure `gateway.auth.token`

::: warning Binding Mode vs Authentication
- Loopback (default): usually doesn't require authentication
- LAN/Tailnet/Custom: Must configure `gateway.auth.token` or `CLAWDBOT_GATEWAY_TOKEN`
- `gateway.remote.token` is only for remote CLI calls, doesn't enable local authentication
- Ignored field: `gateway.token` (use `gateway.auth.token` instead)
:::

---

#### Service Shows Running but Port Not Listening

**Symptom**: `clawdbot gateway status` shows `Runtime: running`, but port `18789` is not listening.

**Cause**: Gateway refused to bind or config mismatch.

**Checklist**:

```bash
# 1. Check Gateway status
clawdbot gateway status

# 2. Check last Gateway error
clawdbot gateway status | grep "error\|Error\|refusing"

# 3. Check port usage
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

**Common Causes and Fixes**:

1. **Port Already in Use**:
   ```bash
   # View占用进程
   lsof -nP -iTCP:18789 -sTCP:LISTEN
   
   # Stop service or change port
   clawdbot config set gateway.port 18790
   ```

2. **Config Mismatch**:
   - CLI config and Service config inconsistent
   - Fix: Reinstall from same `--profile` / `CLAWDBOT_STATE_DIR`
   ```bash
   clawdbot gateway install --force
   ```

3. **Non-loopback Binding Missing Auth**:
   - Logs show: "refusing to bind … without auth"
   - Fix: Set `gateway.auth.mode` + `gateway.auth.token`

4. **Tailnet Binding Failed**:
   - Logs show: "no tailnet interface was found"
   - Fix: Start Tailscale or change `gateway.bind` to `loopback`/`lan`

---

#### Gateway "Startup Blocked: set gateway.mode=local"

**Symptom**: Config exists but startup is blocked.

**Cause**: `gateway.mode` is not set to `local` (or not set).

**Solution**:

```bash
# Option 1: Run configuration wizard
clawdbot configure

# Option 2: Set directly
clawdbot config set gateway.mode local

# Option 3: Temporarily allow unconfigured startup (dev only)
clawdbot gateway --allow-unconfigured
```

---

### Model and Authentication Issues

#### "No API key found for provider 'anthropic'"

**Symptom**: Agent reports provider API key not found.

**Cause**: Agent's auth store is empty or missing Anthropic credentials. Authentication is **per-Agent independent**—new Agents don't inherit the main Agent's keys.

**Solution**:

**Option 1**: Re-run onboarding and select **Anthropic** for that Agent

```bash
clawdbot configure
```

**Option 2**: Paste setup-token on **Gateway host**

```bash
clawdbot models auth setup-token --provider anthropic
```

**Option 3**: Copy `auth-profiles.json` from main Agent directory to new Agent directory

**Verify**:

```bash
clawdbot models status
```

**Related Docs**: [AI Model and Authentication Configuration](/moltbot/moltbot/advanced/models-auth/)

---

#### OAuth token refresh failed (Anthropic Claude subscription)

**Symptom**: Stored Anthropic OAuth token expired, refresh failed.

**Cause**: Stored OAuth token expired and refresh failed. If you use Claude subscription (no API Key), the most reliable fix is to switch to **Claude Code setup-token** or re-sync Claude Code CLI OAuth on **Gateway host**.

**Solution** (Recommended - setup-token):

```bash
# Run on Gateway host (execute Claude Code CLI)
clawdbot models auth setup-token --provider anthropic
clawdbot models status
```

If you generated token elsewhere:

```bash
clawdbot models auth paste-token --provider anthropic
clawdbot models status
```

**If you want to keep OAuth reuse**:
Log in via Claude Code CLI on Gateway host, then run `clawdbot models status` to sync refreshed token to Clawdbot's auth store.

---

#### "/model" says "model not allowed"

**Symptom**: When switching models, it says model not allowed.

**Cause**: Usually means `agents.defaults.models` is configured as allowlist (whitelist). When non-empty, only those provider/model keys are allowed.

**Solution**:

```bash
# 1. Check allowlist
clawdbot config get agents.defaults.models

# 2. Add models you want (or clear allowlist)
clawdbot config set agents.defaults.models []
# or
clawdbot config set agents.defaults.models '["anthropic/claude-sonnet-4-20250514"]'

# 3. Retry /model command
```

Use `/models` to browse allowed providers/models.

---

#### "All models failed" — What to Check First?

**Checklist**:

1. **Credentials exist**: Verify provider auth configuration (auth profiles + environment variables)
2. **Model routing**: Verify `agents.defaults.model.primary` and fallback point to models you can access
3. **Gateway logs**: Search `/tmp/clawdbot/...` for exact provider errors
4. **Model status**: Use `/model status` (chat) or `clawdbot models status` (CLI)

**Detailed Commands**:

```bash
# View all model status
clawdbot models status

# Test specific model
clawdbot models scan

# View detailed logs
clawdbot logs --follow | grep -i "model\|anthropic\|openai"
```

---

### Channel Connection Issues

#### Messages Not Triggering

**Symptom**: Send message in channel, but Agent doesn't respond.

**Check 1**: Is sender whitelisted?

```bash
clawdbot status
# Look for "AllowFrom: ..." in output
```

**Check 2**: Does group chat need mention?

Group messages need `@mention` or command trigger. Check config:

```bash
# Check mention patterns for global or specific channels
grep -E "agents\|groupChat\|mentionPatterns" \
  "${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json}"
```

**Check 3**: View logs

```bash
clawdbot logs --follow
# Or quick filter:
tail -f "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | grep "blocked\|skip\|unauthorized"
```

**Related Docs**: [DM Pairing and Access Control](/moltbot/moltbot/start/pairing-approval/)

---

#### Pairing Code Not Arriving

**Symptom**: When `dmPolicy` is `pairing`, unknown senders should receive code, but messages are ignored until approved.

**Check 1**: Are there pending requests?

```bash
clawdbot pairing list <channel>
```

::: info Pairing Request Limit
By default, there are at most **3 pending DM pairing requests** per channel. If list is full, new requests won't generate code until one is approved or expires.
:::

**Check 2**: Was request created but no reply sent?

```bash
clawdbot logs --follow | grep "pairing request"
```

**Check 3**: Verify `dmPolicy` is not `open`/`allowlist`

---

#### WhatsApp Disconnects

**Symptom**: WhatsApp frequently disconnects or cannot connect.

**Diagnostic Steps**:

```bash
# 1. Check local status (credentials, sessions, queue events)
clawdbot status

# 2. Probe running Gateway + channels (WA connection + Telegram + Discord APIs)
clawdbot status --deep

# 3. View recent connection events
clawdbot logs --limit 200 | grep -i "connection\|disconnect\|logout"
```

**Solution**:

Usually auto-reconnects once Gateway is running. If stuck:

```bash
# Restart Gateway process (however you supervise it)
clawdbot gateway restart

# Or manually run with verbose output
clawdbot gateway --verbose
```

If logged out/unlinked:

```bash
# Re-login and scan QR code
clawdbot channels login --verbose

# If logout doesn't clear everything, manually delete credentials
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}/credentials"
```

---

### Media Send Failures

**Symptom**: Sending images, audio, videos, or files fails.

**Check 1**: Is file path valid?

```bash
ls -la /path/to/your/image.jpg
```

**Check 2**: Is file too large?

- Images: Max **6MB**
- Audio/Video: Max **16MB**
- Documents: Max **100MB**

**Check 3**: View media logs

```bash
grep "media\|fetch\|download" \
  "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | tail -20
```

---

### Tool Execution Issues

#### "Agent was aborted"

**Symptom**: Agent stops responding mid-task.

**Cause**: Agent was interrupted.

**Possible Causes**:
- User sent `stop`, `abort`, `esc`, `wait`, `exit`
- Timeout exceeded
- Process crashed

**Solution**: Just send another message, session continues.

---

#### "Agent failed before reply: Unknown model: anthropic/claude-haiku-3-5"

**Symptom**: Model rejected.

**Cause**: Clawdbot rejects **older/unsafe models** (especially those more vulnerable to prompt injection attacks). If you see this error, the model name is no longer supported.

**Solution**:

1. Choose provider's **latest** model, update config or model alias
2. If unsure which models are available, run:
   ```bash
   clawdbot models list
   # or
   clawdbot models scan
   ```
3. Choose supported model

**Related Docs**: [AI Model and Authentication Configuration](/moltbot/moltbot/advanced/models-auth/)

---

#### Skill Missing API Key in Sandbox

**Symptom**: Skill works fine on host, but fails in sandbox complaining about missing API key.

**Cause**: Sandboxed exec runs inside Docker, does **not** inherit host `process.env`.

**Solution**:

```bash
# Set sandbox environment variables
clawdbot config set agents.defaults.sandbox.docker.env '{"API_KEY": "your-key-here"}'

# Or set for specific agent
clawdbot config set agents.list[0].sandbox.docker.env '{"API_KEY": "your-key-here"}'

# Recreate sandbox
clawdbot sandbox recreate --agent <agent-id>
# Or all
clawdbot sandbox recreate --all
```

---

### Control UI Issues

#### Control UI Fails over HTTP ("device identity required" / "connect failed")

**Symptom**: Opening dashboard over plain HTTP (e.g., `http://<lan-ip>:18789/` or `http://<tailscale-ip>:18789/`) fails.

**Cause**: Browser running in **insecure context**, blocks WebCrypto, cannot generate device identity.

**Solution**:

1. Prefer HTTPS ([Tailscale Serve](/moltbot/moltbot/advanced/remote-gateway/))
2. Or open locally on Gateway host: `http://127.0.0.1:18789/`
3. If must use HTTP, enable `gateway.controlUi.allowInsecureAuth: true` and use Gateway token (token only; no device identity/pairing):
   ```bash
   clawdbot config set gateway.controlUi.allowInsecureAuth true
   ```

**Related Docs**: [Remote Gateway with Tailscale](/moltbot/moltbot/advanced/remote-gateway/)

---

### Session and Performance Issues

#### Session Not Resuming

**Symptom**: Session history lost or cannot resume.

**Check 1**: Does session file exist?

```bash
ls -la ~/.clawdbot/agents/<agentId>/sessions/
```

**Check 2**: Is reset window too short?

```json
{
  "session": {
    "reset": {
      "mode": "daily",
      "atHour": 4,
      "idleMinutes": 10080  // 7 days
    }
  }
}
```

**Check 3**: Did anyone send `/new`, `/reset`, or reset trigger?

---

#### Agent Timeout

**Symptom**: Long-running task stops mid-task.

**Cause**: Default timeout is 30 minutes.

**Solution**:

For long tasks:

```json
{
  "reply": {
    "timeoutSeconds": 3600  // 1 hour
  }
}
```

Or use `process` tool to run long commands in background.

---

#### High Memory Usage

**Symptom**: Clawdbot using lots of memory.

**Cause**: Clawdbot keeps conversation history in memory.

**Solution**:

Restart regularly or set session limits:

```json
{
  "session": {
    "historyLimit": 100  // Max messages to keep
  }
}
```

---

## Debug Mode

### Enable Verbose Logging

```bash
# 1. Enable trace logging in config
# Edit ${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json}
# Add:
{
  "logging": {
    "level": "trace"
  }
}

# 2. Run verbose commands to mirror debug output to stdout
clawdbot gateway --verbose
clawdbot channels login --verbose
```

::: tip Log Level Explanation
- **Level** controls file logs (persistent JSONL)
- **consoleLevel** controls console output (TTY only)
- `--verbose` only affects **console** output, file logs controlled by `logging.level`
:::

### Log Locations

| Log | Location |
|--- | ---|
| Gateway file logs (structured) | `/tmp/clawdbot/clawdbot-YYYY-MM-DD.log` (or `logging.file`) |
| Gateway service logs | macOS: `$CLAWDBOT_STATE_DIR/logs/gateway.log` + `gateway.err.log`<br/>Linux: `journalctl --user -u clawdbot-gateway[-<profile>].service -n 200 --no-pager`<br/>Windows: `schtasks /Query /TN "Clawdbot Gateway (<profile>)" /V /FO LIST` |
| Session files | `$CLAWDBOT_STATE_DIR/agents/<agentId>/sessions/` |
| Media cache | `$CLAWDBOT_STATE_DIR/media/` |
| Credentials | `$CLAWDBOT_STATE_DIR/credentials/` |

### Health Checks

```bash
# Supervisor + probe target + config path
clawdbot gateway status

# Include system-level scan (legacy/extra services, port listeners)
clawdbot gateway status --deep

# Is Gateway reachable?
clawdbot health --json
# If fails, run and view connection details
clawdbot health --verbose

# Is there a listener on default port?
lsof -nP -iTCP:18789 -sTCP:LISTEN

# Recent activity (RPC log tail)
clawdbot logs --follow

# Fallback if RPC is down
tail -20 /tmp/clawdbot/clawdbot-*.log
```

---

## Reset All Configuration

::: warning Dangerous Operation
The following operations delete all sessions and config, requiring re-pairing of WhatsApp
:::

If issues cannot be resolved, consider a complete reset:

```bash
# 1. Stop Gateway
clawdbot gateway stop

# 2. If service installed and want clean install:
# clawdbot gateway uninstall

# 3. Delete state directory
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}"

# 4. Re-login WhatsApp
clawdbot channels login

# 5. Restart Gateway
clawdbot gateway restart
# or
clawdbot gateway
```

---

## macOS-Specific Issues

### App Crashes During Authorization (Voice/Microphone)

**Symptom**: When clicking "Allow" in privacy prompt, app disappears or shows "Abort trap 6".

**Solution 1: Reset TCC Cache**

```bash
tccutil reset All com.clawdbot.mac.debug
```

**Solution 2: Force New Bundle ID**

If reset doesn't work, change `BUNDLE_ID` in [`scripts/package-mac-app.sh`](https://github.com/moltbot/moltbot/blob/main/scripts/package-mac-app.sh) (e.g., add `.test` suffix) and rebuild. This forces macOS to treat it as a new app.

---

### Gateway Stuck at "Starting..."

**Symptom**: App connects to local Gateway port `18789`, but keeps hanging.

**Solution 1: Stop Supervisor (Recommended)**

If Gateway supervised by launchd, killing PID will just restart it. Stop supervisor first:

```bash
# View status
clawdbot gateway status

# Stop Gateway
clawdbot gateway stop

# Or use launchctl
launchctl bootout gui/$UID/com.clawdbot.gateway
# (If using profile, replace with com.clawdbot.<profile>)
```

**Solution 2: Port Busy (Find Listener)**

```bash
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

If unsupervised process, try graceful stop first, then escalate:

```bash
kill -TERM <PID>
sleep 1
kill -9 <PID>  # Last resort
```

**Solution 3: Check CLI Installation**

Ensure global `clawdbot` CLI is installed and matches app version:

```bash
clawdbot --version
npm install -g clawdbot@<version>
```

---

## Getting Help

If none of the above methods solve your problem:

1. **First, check logs**: `/tmp/clawdbot/` (default: `clawdbot-YYYY-MM-DD.log`, or your configured `logging.file`)
2. **Search existing issues**: [GitHub Issues](https://github.com/moltbot/moltbot/issues)
3. **When opening a new issue**, include:
   - Clawdbot version (`clawdbot --version`)
   - Relevant log snippets
   - Reproduction steps
   - Your configuration (**redact sensitive information!**)

---

## Lesson Summary

Key troubleshooting steps:

1. **Quick Diagnosis**: Use `clawdbot status` → `status --all` → `gateway probe`
2. **View Logs**: `clawdbot logs --follow` is most direct signal source
3. **Targeted Fixes**: Refer to corresponding section based on symptoms (Gateway/Auth/Channel/Tool/Session)
4. **Deep Inspection**: Use `clawdbot doctor` and `status --deep` for system-level diagnostics
5. **Necessary Reset**: When all else fails, use reset option, but remember you'll lose data

Remember: Most problems have clear causes and solutions—systematic troubleshooting is more effective than blind trial-and-error.

## Next Lesson Preview

> Next, we'll learn **[CLI Command Reference](/moltbot/moltbot/faq/cli-commands/)**.
>
> You'll learn:
> - Complete CLI command list and usage documentation
> - All commands for Gateway management, Agent interaction, and configuration management
> - Tips and best practices for efficient command-line usage

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature | File Path | Line |
|--- | --- | ---|
| Troubleshooting commands | [`src/commands/doctor.ts`](https://github.com/moltbot/moltbot/blob/main/src/commands/doctor.ts) | Full text |
| Gateway health check | [`src/gateway/server-channels.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-channels.ts) | 93+ |
| Logging system | [`src/logging/index.ts`](https://github.com/moltbot/moltbot/blob/main/src/logging/index.ts) | Full text |
| Authentication handling | [`src/agents/auth-profiles.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/auth-profiles.ts) | Full text |
| Configuration validation | [`src/config/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/config.ts) | Full text |
| Channel status probing | [`src/cli/commands/channels-cli.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/commands/channels-cli.ts) | Full text |

**Key Constants**:
- Default Gateway port: `18789` - Gateway WebSocket service port
- Default log directory: `/tmp/clawdbot/` - Log file storage location
- Pairing request limit: `3` - Maximum pending pairing requests per channel

**Key Functions**:
- `doctor()` - Run diagnostic checks and report issues
- `probeGateway()` - Test Gateway connectivity
- `checkAuth()` - Verify authentication configuration
- `validateConfig()` - Validate config file integrity

</details>
