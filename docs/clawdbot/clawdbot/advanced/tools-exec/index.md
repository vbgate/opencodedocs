---
title: "Command Execution Tool and Approvals: Complete Guide | Clawdbot Tutorial"
sidebarTitle: "Command Execution"
subtitle: "Command Execution and Approvals"
description: "Learn how to configure and use Clawdbot's exec tool to execute Shell commands, understand three execution modes (sandbox/gateway/node), security approval mechanisms, allowlist configuration, and approval workflows. This tutorial includes practical configuration examples, CLI commands, and troubleshooting to help you securely extend AI assistant capabilities."
tags:
  - "advanced"
  - "tools"
  - "exec"
  - "security"
  - "approvals"
prerequisite:
  - "start-gateway-startup"
order: 220
---

# Command Execution Tool and Approvals: Complete Guide

## What You'll Learn

After completing this lesson, you will be able to:

- Configure the exec tool to run in three execution modes (sandbox/gateway/node)
- Understand and configure security approval mechanisms (deny/allowlist/full)
- Manage allowlist and safe bins
- Approve exec requests via UI or chat channels
- Troubleshoot common exec tool issues and security errors

## Your Current Challenge

The exec tool enables AI assistants to execute Shell commands, which is both powerful and dangerous:

- Will AI delete important files on my system?
- How do I restrict AI to execute only safe commands?
- What are the differences between execution modes?
- How does the approval workflow work?
- How should I configure the allowlist?

## When to Use This

- Need AI to perform system operations (e.g., file management, code builds)
- Want AI to call custom scripts or tools
- Need fine-grained control over AI execution permissions
- Need to securely allow specific commands

## 🎒 Prerequisites

::: warning Prerequisites
This tutorial assumes you have completed [Starting Gateway](../../start/gateway-startup/) and the Gateway daemon is running.
:::

- Ensure Node ≥22 is installed
- Gateway daemon is running
- Understand basic Shell commands and Linux/Unix filesystem

## Core Concepts

### Three-Layer Security Protection for Exec Tool

The exec tool adopts a three-layer security mechanism to control AI execution permissions from coarse-grained to fine-grained:

1. **Tool Policy**: Control whether `exec` tool is allowed in `tools.policy`
2. **Execution Host**: Commands run in sandbox/gateway/node environments
3. **Approval Mechanism**: In gateway/node modes, further restrict via allowlist and approval prompts

::: info Why Multi-Layer Protection?
Single-layer protection is easy to bypass or misconfigure. Multi-layer protection ensures that even if one layer fails, other layers still provide protection.
:::

### Comparison of Three Execution Modes

| Execution Mode | Running Location | Security Level | Typical Scenarios | Approval Required |
|----------------|-------------------|-----------------|-------------------|-------------------|
| **sandbox** | Container (e.g., Docker) | High | Isolated environment, testing | No |
| **gateway** | Gateway daemon host | Medium | Local development, integration | Yes (allowlist + approval) |
| **node** | Paired device node (macOS/iOS/Android) | Medium | Local device operations | Yes (allowlist + approval) |

**Key Differences**:
- sandbox mode **does not require approval by default** (but may be limited by Sandbox)
- gateway and node modes **require approval by default** (unless configured as `full`)

## Follow Along

### Step 1: Understand Exec Tool Parameters

**Why**: Understanding exec tool parameters is the foundation for security configuration.

The exec tool supports the following parameters:

```json
{
  "tool": "exec",
  "command": "ls -la",
  "workdir": "/path/to/dir",
  "env": { "NODE_ENV": "production" },
  "yieldMs": 10000,
  "background": false,
  "timeout": 1800,
  "pty": false,
  "host": "sandbox",
  "security": "allowlist",
  "ask": "on-miss",
  "node": "mac-1"
}
```

**Parameter Description**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `command` | string | Required | Shell command to execute |
| `workdir` | string | Current working directory | Execution directory |
| `env` | object | Inherit environment | Environment variable overrides |
| `yieldMs` | number | 10000 | Automatically convert to background after timeout (milliseconds) |
| `background` | boolean | false | Execute immediately in background |
| `timeout` | number | 1800 | Execution timeout (seconds) |
| `pty` | boolean | false | Run in pseudo-terminal (supports TTY) |
| `host` | string | sandbox | Execution host: `sandbox` \| `gateway` \| `node` |
| `security` | string | deny/allowlist | Security policy: `deny` \| `allowlist` \| `full` |
| `ask` | string | on-miss | Approval policy: `off` \| `on-miss` \| `always` |
| `node` | string | - | Target node ID or name in node mode |

**You should see**: The parameter list clearly explains the control methods for each execution mode.

### Step 2: Configure Default Execution Mode

**Why**: Set global default values via configuration file to avoid specifying parameters for every exec call.

Edit `~/.clawdbot/clawdbot.json`:

```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "security": "allowlist",
      "ask": "on-miss",
      "node": "mac-1",
      "notifyOnExit": true,
      "approvalRunningNoticeMs": 10000,
      "pathPrepend": ["~/bin", "/opt/homebrew/bin"],
      "safeBins": ["jq", "grep", "cut"]
    }
  }
}
```

**Configuration Item Description**:

| Configuration Item | Type | Default | Description |
|-------------------|------|---------|-------------|
| `host` | string | sandbox | Default execution host |
| `security` | string | deny (sandbox) / allowlist (gateway, node) | Default security policy |
| `ask` | string | on-miss | Default approval policy |
| `node` | string | - | Default node in node mode |
| `notifyOnExit` | boolean | true | Send system event when background task exits |
| `approvalRunningNoticeMs` | number | 10000 | Send "running" notification after timeout (0 to disable) |
| `pathPrepend` | string[] | - | Directory list to prepend to PATH |
| `safeBins` | string[] | [default list] | Safe binary list (stdin-only operations) |

**You should see**: After saving configuration, the exec tool uses these default values.

### Step 3: Use `/exec` Session Override

**Why**: Session overrides allow you to temporarily adjust execution parameters without modifying the configuration file.

Send in chat:

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

View current override values:

```
/exec
```

**You should see**: Current session's exec parameter configuration.

### Step 4: Configure Allowlist

**Why**: Allowlist is the core security mechanism in gateway/node modes, allowing only specific commands to execute.

#### Editing Allowlist

**Edit via UI**:

1. Open Control UI
2. Go to **Nodes** tab
3. Find **Exec approvals** card
4. Select target (Gateway or Node)
5. Select Agent (e.g., `main`)
6. Click **Add pattern** to add command pattern
7. Click **Save**

**Edit via CLI**:

```bash
clawdbot approvals
```

**Edit via JSON file**:

Edit `~/.clawdbot/exec-approvals.json`:

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss",
    "askFallback": "deny",
    "autoAllowSkills": false
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "askFallback": "deny",
      "autoAllowSkills": true,
      "allowlist": [
        {
          "id": "B0C8C0B3-2C2D-4F8A-9A3C-5A4B3C2D1E0F",
          "pattern": "~/Projects/**/bin/*",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg -n TODO",
          "lastResolvedPath": "/Users/user/Projects/bin/rg"
        },
        {
          "id": "C1D9D1C4-3D3E-5F9B-0B4D-6B5C4D3E2F1G",
          "pattern": "/opt/homebrew/bin/rg",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg test",
          "lastResolvedPath": "/opt/homebrew/bin/rg"
        }
      ]
    }
  }
}
```

**Allowlist Pattern Description**:

Allowlist uses **glob pattern matching** (case-insensitive):

| Pattern | Matches | Description |
|---------|---------|-------------|
| `~/Projects/**/bin/*` | `/Users/user/Projects/any/bin/rg` | Match all subdirectories |
| `~/.local/bin/*` | `/Users/user/.local/bin/jq` | Match local bin |
| `/opt/homebrew/bin/rg` | `/opt/homebrew/bin/rg` | Absolute path match |

::: warning Important Rules
- **Only matches resolved binary paths**, basename matching (e.g., `rg`) is not supported
- Shell operators (`&&`, `||`, `;`) require each segment to satisfy allowlist
- Redirection (`>`, `<`) is not supported in allowlist mode
:::

**You should see**: After allowlist configuration, only matching commands can execute.

### Step 5: Understand Safe Bins

**Why**: Safe bins are a set of secure binaries that support stdin-only operations and can execute without explicit allowlist in allowlist mode.

**Default Safe Bins**:

`jq`, `grep`, `cut`, `sort`, `uniq`, `head`, `tail`, `tr`, `wc`

**Security Features of Safe Bins**:

- Reject file path arguments
- Reject path-like flags
- Can only operate on passed streams (stdin)

**Configure Custom Safe Bins**:

```json
{
  "tools": {
    "exec": {
      "safeBins": ["jq", "grep", "my-safe-tool"]
    }
  }
}
```

**You should see**: Safe bins commands can execute directly in allowlist mode.

### Step 6: Approve Exec Requests via Chat Channels

**Why**: When UI is unavailable, you can approve exec requests via any chat channel (WhatsApp, Telegram, Slack, etc.).

#### Enable Approval Forwarding

Edit `~/.clawdbot/clawdbot.json`:

```json
{
  "approvals": {
    "exec": {
      "enabled": true,
      "mode": "session",
      "agentFilter": ["main"],
      "sessionFilter": ["discord"],
      "targets": [
        { "channel": "slack", "to": "U12345678" },
        { "channel": "telegram", "to": "123456789" }
      ]
    }
  }
}
```

**Configuration Item Description**:

| Configuration Item | Description |
|-------------------|-------------|
| `enabled` | Whether to enable exec approval forwarding |
| `mode` | `"session"` \| `"targets"` \| `"both"` - Approval target mode |
| `agentFilter` | Only process approval requests for specific agents |
| `sessionFilter` | Session filter (substring or regex) |
| `targets` | Target channel list (`channel` + `to`) |

#### Approve Requests

When the exec tool requires approval, you will receive a message containing the following information:

```
Exec approval request (id: abc-123)
Command: ls -la
CWD: /home/user
Agent: main
Resolved: /usr/bin/ls
Host: gateway
Security: allowlist
```

**Approval Options**:

```
/approve abc-123 allow-once     # Allow once
/approve abc-123 allow-always    # Always allow (add to allowlist)
/approve abc-123 deny           # Deny
```

**You should see**: After approval, the command executes or is rejected.

## Checkpoint ✅

- [ ] Understand the differences between three execution modes (sandbox/gateway/node)
- [ ] Configured global exec default parameters
- [ ] Can use `/exec` command for session override
- [ ] Configured allowlist (at least one pattern)
- [ ] Understand the security features of safe bins
- [ ] Can approve exec requests via chat channels

## Common Pitfalls

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Command not allowed by exec policy` | `security=deny` or allowlist doesn't match | Check `tools.exec.security` and allowlist configuration |
| `Approval timeout` | UI unavailable, `askFallback=deny` | Set `askFallback=allowlist` or enable UI |
| `Pattern does not resolve to binary` | allowlist mode uses basename | Use full path (e.g., `/opt/homebrew/bin/rg`) |
| `Unsupported shell token` | allowlist mode uses `>` or `&&` | Split commands or use `security=full` |
| `Node not found` | Node not paired in node mode | Complete node pairing first |

### Shell Operators and Redirection

::: danger Warning
In `security=allowlist` mode, the following Shell features are **not supported**:
- Pipes: `|` (but `||` is supported)
- Redirection: `>`, `<`, `>>`
- Command substitution: `$()` and backticks
- Background: `&`, `;`
:::

**Solutions**:
- Use `security=full` (with caution)
- Split into multiple exec calls
- Write wrapper scripts and allowlist script paths

### PATH Environment Variable

Different execution modes handle PATH differently:

| Execution Mode | PATH Handling | Description |
|---------------|---------------|-------------|
| `sandbox` | Inherits shell login, may be reset by `/etc/profile` | `pathPrepend` applies after profile |
| `gateway` | Merges login shell PATH to exec environment | daemon keeps minimal PATH, but exec inherits user PATH |
| `node` | Only uses passed environment variable overrides | macOS nodes discard `PATH` overrides, headless nodes support prepend |

**You should see**: Correct PATH configuration affects command lookup.

## Summary

The exec tool enables AI assistants to safely execute Shell commands through a three-layer protection mechanism (tool policy, execution host, approvals):

- **Execution Modes**: sandbox (container isolation), gateway (local execution), node (device operations)
- **Security Policies**: deny (complete prohibition), allowlist (whitelist), full (complete permission)
- **Approval Mechanism**: off (no prompt), on-miss (prompt when not matched), always (always prompt)
- **Allowlist**: Glob pattern matching on resolved binary paths
- **Safe Bins**: stdin-only binaries can execute without approval in allowlist mode

## Next Lesson

> In the next lesson, we'll learn **[Web Search and Scraping Tools](../tools-web/)**
>
> You'll learn:
> - How to use the `web_search` tool for web search
> - How to use the `web_fetch` tool to scrape web content
> - How to configure search engine providers (Brave, Perplexity)
> - How to handle search results and web scraping errors

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Lines |
|---------|-----------|-------|
| exec tool definition | [`src/agents/bash-tools.exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/bash-tools.exec.ts) | 1-500+ |
| exec approval logic | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1-1268 |
| Shell command analysis | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 500-1100 |
| Allowlist matching | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 507-521 |
| Safe bins validation | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 836-873 |
| Approval Socket communication | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1210-1267 |
| Process execution | [`src/process/exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/process/exec.ts) | 1-125 |
| Tool configuration schema | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**Key Types**:
- `ExecHost`: `"sandbox" \| "gateway" \| "node"` - Execution host type
- `ExecSecurity`: `"deny" \| "allowlist" \| "full"` - Security policy
- `ExecAsk`: `"off" \| "on-miss" \| "always"` - Approval policy
- `ExecAllowlistEntry`: Allowlist entry type (contains `pattern`, `lastUsedAt`, etc.)

**Key Constants**:
- `DEFAULT_SECURITY = "deny"` - Default security policy
- `DEFAULT_ASK = "on-miss"` - Default approval policy
- `DEFAULT_SAFE_BINS = ["jq", "grep", "cut", "sort", "uniq", "head", "tail", "tr", "wc"]` - Default safe bins

**Key Functions**:
- `resolveExecApprovals()`: Resolve exec-approvals.json configuration
- `evaluateShellAllowlist()`: Evaluate if Shell command satisfies allowlist
- `matchAllowlist()`: Check if command path matches allowlist pattern
- `isSafeBinUsage()`: Verify if command is safe bin usage
- `requestExecApprovalViaSocket()`: Request approval via Unix socket

</details>
