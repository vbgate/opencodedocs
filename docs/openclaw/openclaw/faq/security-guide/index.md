---
title: "Security Guide - Protect Your AI Assistant | OpenClaw Tutorial"
sidebarTitle: "Security Guide"
subtitle: "Security Guide - Protect Your AI Assistant"
description: "Deep dive into OpenClaw security model, DM pairing mechanism, sandbox execution, and access control. Learn how to protect your AI assistant and data."
tags:
  - "Security"
  - "Authentication"
  - "Sandbox"
  - "Access Control"
order: 160
---

# Security Guide - Protect Your AI Assistant

## What You'll Learn

After completing this course, you'll be able to:
- Understand OpenClaw's security model
- Configure DM pairing protection mechanisms
- Set up sandbox execution environments
- Implement comprehensive access control policies

## Core Concepts

OpenClaw employs a multi-layered security architecture that protects your AI assistant from network, authentication, execution, and data perspectives.

```
┌─────────────────────────────────────────────────────────────┐
│                  OpenClaw Security Architecture             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Layer 1: Network Security                          │  │
│   │  - Tailscale VPN                                    │  │
│   │  - mTLS/TLS Encryption                              │  │
│   │  - Firewall Rules                                   │  │
│   └─────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Layer 2: Authentication & Authorization            │  │
│   │  - Token/Password Authentication                    │  │
│   │  - Channel Allowlist                                │  │
│   │  - DM Pairing Mechanism                             │  │
│   └─────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Layer 3: Execution Security                        │  │
│   │  - Sandbox Execution (Docker)                       │  │
│   │  - Code Isolation                                   │  │
│   │  - Resource Limits                                  │  │
│   └─────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Layer 4: Data Security                             │  │
│   │  - Local-First Storage                              │  │
│   │  - Encrypted Storage                                │  │
│   │  - Session Isolation                                │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Security Design Principles

| Principle | Description | Implementation |
| --- | --- | --- |
| **Local-First** | Data stays on user devices | Self-hosted architecture |
| **Least Privilege** | Grant only necessary permissions | Whitelist mechanism |
| **Defense in Depth** | Multi-layer security controls | 4-layer security architecture |
| **Transparent & Auditable** | Operations are traceable | Detailed logging |

## Hands-On Practice

### Step 1: Configure Strong Authentication

**Why**  
Prevent unauthorized access to Gateway services.

```bash
# Generate secure Token
export GATEWAY_TOKEN=$(openssl rand -hex 32)
echo "Generated Token: $GATEWAY_TOKEN"

# Configure Token authentication
openclaw config set gateway.auth.mode token
openclaw config set gateway.auth.token "$GATEWAY_TOKEN"

# Or configure strong password
openclaw config set gateway.auth.mode password
openclaw config set gateway.auth.password "$(openssl rand -base64 24)"
```

**Authentication Method Comparison**

| Method | Security | Use Case | Configuration |
| --- | --- | --- | --- |
| **Token** | ⭐⭐⭐⭐⭐ | Recommended for production | `mode: token` |
| **Password** | ⭐⭐⭐ | Local development | `mode: password` |
| **Off** | ⭐ | Testing only | `mode: off` |

### Step 2: Configure Channel Access Control

**Why**  
Limit which users can trigger the AI assistant.

```bash
# WhatsApp allowlist
openclaw config set channels.whatsapp.allowFrom "+86138xxxxxxxx,+86139xxxxxxxx"

# Telegram allowlist
openclaw config set channels.telegram.allowFrom "@username1,@username2"

# Discord allowlist (User IDs)
openclaw config set channels.discord.allowFrom "123456789,987654321"
```

**Group Security Policies**

```bash
# Set group policies
openclaw config set channels.whatsapp.groupPolicy "owner-only"
openclaw config set channels.telegram.groupPolicy "admins"
openclaw config set channels.discord.guildPolicy "admins"

# Policy options
# "owner-only": Only owners
# "admins": Admins and owners
# "everyone": All members (not recommended)
# "none": Disabled in groups
```

### Step 3: Enable DM Pairing

**Why**  
DM pairing is a security mechanism that prevents strangers from directly messaging the AI assistant.

```bash
# Enable DM pairing (recommended)
openclaw config set channels.whatsapp.dmPolicy "pairing"
openclaw config set channels.telegram.dmPolicy "pairing"
openclaw config set channels.discord.dmPolicy "pairing"
```

**DM Pairing Flow**

```
User sends first DM
       │
       ▼
┌─────────────────────┐
│  AI: Please complete│
│     pairing verify  │
│  Code: ABC123       │
└─────────────────────┘
       │
       ▼
User confirms pairing in Gateway UI or CLI
       │
       ▼
┌─────────────────────┐
│  Pairing Success    │
│  Conversation ready │
└─────────────────────┘
```

**Manage Paired Users**

```bash
# List paired users
openclaw pairing list

# Remove pairing
openclaw pairing remove whatsapp:+86138xxxxxxxx

# Clear all pairings
openclaw pairing clear
```

### Step 4: Configure Sandbox Execution

**Why**  
Code execution poses security risks and requires isolated environments.

```bash
# Enable Docker sandbox
openclaw config set tools.codeExecution.sandbox.enabled true

# Configure resource limits
openclaw config set tools.codeExecution.sandbox.memoryLimit "512m"
openclaw config set tools.codeExecution.sandbox.cpuLimit "1.0"
openclaw config set tools.codeExecution.sandbox.timeout 30000

# Disable dangerous operations
openclaw config set tools.codeExecution.allowNetwork false
openclaw config set tools.codeExecution.allowFileWrite false
```

**Sandbox Configuration Example**

```json
{
  "tools": {
    "codeExecution": {
      "sandbox": {
        "enabled": true,
        "image": "openclaw/sandbox:latest",
        "memoryLimit": "512m",
        "cpuLimit": "1.0",
        "timeout": 30000,
        "readOnly": true
      },
      "allowNetwork": false,
      "allowFileWrite": false,
      "allowedPaths": ["/tmp", "/workspace"]
    }
  }
}
```

### Step 5: Configure Execution Approvals

**Why**  
Sensitive operations require human confirmation to prevent AI errors.

```bash
# Enable execution approvals
openclaw config set approvals.enabled true

# Configure operations requiring approval
openclaw config set approvals.requireFor "["file-delete","network-request","system-command"]"

# Configure approval timeout
openclaw config set approvals.timeout 300000
```

**Approval Flow**

```
AI requests sensitive operation
       │
       ▼
┌─────────────────────┐
│  Operation Pending  │
│  Type: file-delete  │
│  Target: /important │
└─────────────────────┘
       │
       ▼
Waiting for user confirmation (Gateway UI/Notification)
       │
       ▼
┌─────────────────────┐
│  ✅ Approve / ❌ Deny│
└─────────────────────┘
```

### Step 6: Configure Network Isolation

**Why**  
Limit network resources accessible by the AI.

```bash
# Configure Gateway bind address
openclaw config set gateway.bind "loopback"  # Local access only

# Or use Tailscale network
openclaw config set gateway.bind "tailnet"
```

**Bind Mode Comparison**

| Mode | Description | Security |
| --- | --- | --- |
| `loopback` | 127.0.0.1 only | ⭐⭐⭐⭐⭐ |
| `lan` | LAN 0.0.0.0 | ⭐⭐⭐ |
| `tailnet` | Tailscale network | ⭐⭐⭐⭐⭐ |
| `auto` | Auto-select | ⭐⭐⭐ |

### Step 7: Data Encryption and Backup

**Why**  
Protect sensitive configurations and conversation data.

```bash
# Configure credential storage (using system keychain)
openclaw config set auth.useKeychain true

# Configure session encryption
openclaw config set session.encryption.enabled true

# Regular configuration backup
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d)
```

## Security Checklist

### Production Environment Configuration

```yaml
✅ Network Security:
  - [ ] Use Tailscale VPN or HTTPS
  - [ ] Gateway bound to non-public address
  - [ ] Firewall restricts inbound connections

✅ Authentication:
  - [ ] Enable Token or strong password authentication
  - [ ] Regular credential rotation
  - [ ] API Key stored in environment variables

✅ Access Control:
  - [ ] Configure channel allowlist
  - [ ] Enable DM pairing
  - [ ] Set appropriate group policies

✅ Execution Security:
  - [ ] Enable Docker sandbox
  - [ ] Configure resource limits
  - [ ] Disable unnecessary network access

✅ Approvals:
  - [ ] Enable sensitive operation approvals
  - [ ] Configure approval notifications
  - [ ] Set approval timeouts

✅ Logging:
  - [ ] Enable audit logging
  - [ ] Configure log retention policy
  - [ ] Monitor abnormal activity
```

## Security Best Practices

### 1. Regular Updates

```bash
# Check for updates
openclaw update check

# Update to latest version
npm install -g openclaw@latest
```

### 2. Principle of Least Privilege

- Enable only required channels
- Allow only trusted users access
- Grant only necessary skill permissions

### 3. Monitoring and Auditing

```bash
# View security logs
openclaw logs --level warn

# Check access records
openclaw auth logs

# View pairing history
openclaw pairing history
```

### 4. Emergency Response

```bash
# Emergency disable all channels
openclaw channels disable-all

# Reset all pairings
openclaw pairing clear

# Rotate Gateway Token
openclaw config set gateway.auth.token "$(openssl rand -hex 32)"
```

## Common Security Threats

| Threat | Risk | Protection Measures |
| --- | --- | --- |
| Unauthorized Access | Data leakage | Token authentication + allowlist |
| Prompt Injection | Malicious operations | Input validation + approval mechanism |
| Resource Exhaustion | DoS attacks | Rate limiting + resource quotas |
| Code Execution | System intrusion | Sandbox isolation |
| Session Hijacking | Identity impersonation | TLS + session validation |

## Lesson Summary

In this course, you learned:

- ✅ OpenClaw's 4-layer security architecture
- ✅ Configuring strong authentication methods
- ✅ Implementing channel access control
- ✅ Enabling DM pairing mechanisms
- ✅ Configuring sandbox execution environments
- ✅ Setting up execution approval workflows
- ✅ Data encryption and backup
- ✅ Security best practices

## Next Lesson

> In the next lesson, we'll cover **[CLI Command Reference](../commands-reference/)**.
>
> You'll learn:
> - Detailed explanations of all CLI commands
> - Command parameters and options
> - Usage examples

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Gateway Authentication | [`src/gateway/auth-*.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/) | - |
| Execution Approval Manager | [`src/gateway/exec-approval-manager.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/exec-approval-manager.ts) | - |
| Agent Sandbox | [`src/agents/sandbox*.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/) | - |
| Security Module | [`src/security/`](https://github.com/openclaw/openclaw/blob/main/src/security/) | - |
| Channel Pairing | [`src/channels/plugins/pairing.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/pairing.ts) | - |
| Security Configuration | [`src/config/types.auth.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.auth.ts) | - |

**Security-related Configurations**:
- `gateway.auth.mode`: Authentication mode
- `gateway.auth.token`: Token credential
- `gateway.auth.password`: Password credential
- `channels.*.allowFrom`: Allowlist
- `channels.*.dmPolicy`: DM pairing policy
- `tools.codeExecution.sandbox`: Sandbox configuration
- `approvals.enabled`: Approval toggle

</details>
