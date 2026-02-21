---
title: "Troubleshooting - Common Issues and Solutions | OpenClaw Tutorial"
sidebarTitle: "Troubleshooting"
subtitle: "Troubleshooting - Common Issues and Solutions"
description: "Learn how to diagnose and fix OpenClaw issues, master the doctor command, and understand log analysis and debugging techniques."
tags:
  - "Troubleshooting"
  - "FAQ"
  - "Debugging"
order: 150
---

# Troubleshooting - Common Issues and Solutions

## What You'll Learn

After completing this course, you will be able to:
- Use the doctor command to diagnose and fix issues
- Analyze logs to identify root causes of problems
- Handle common configuration errors
- Master debugging techniques and tools

## Core Approach

Troubleshooting is a critical system administration skill. OpenClaw provides various diagnostic tools and methods to help you quickly locate and resolve issues.

```
┌─────────────────────────────────────────────────────────────┐
│                  Troubleshooting Process                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Identify Problem                                          │
│       │                                                      │
│       ▼                                                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  1. Run doctor diagnostics                           │   │
│   │     openclaw doctor                                  │   │
│   └─────────────────────────────────────────────────────┘   │
│       │                                                      │
│       ▼                                                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  2. Check status                                     │   │
│   │     openclaw status                                  │   │
│   │     openclaw channels status                         │   │
│   └─────────────────────────────────────────────────────┘   │
│       │                                                      │
│       ▼                                                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  3. View logs                                        │   │
│   │     openclaw logs                                    │   │
│   │     openclaw logs --follow                           │   │
│   └─────────────────────────────────────────────────────┘   │
│       │                                                      │
│       ▼                                                      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  4. Targeted investigation                           │   │
│   │     - Config issues → config validate                │   │
│   │     - Network issues → ping/curl tests               │   │
│   │     - Permission issues → ls -la / check permissions │   │
│   └─────────────────────────────────────────────────────┘   │
│       │                                                      │
│       ▼                                                      │
│   Resolve Issue / Seek Help                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Diagnostic Tools

### Doctor Command

`openclaw doctor` is a comprehensive diagnostic tool that can detect and automatically fix many common issues.

```bash
# Run full diagnostics
openclaw doctor

# Non-interactive mode
openclaw doctor --non-interactive

# Generate diagnosis report
openclaw doctor --report > diagnosis.txt
```

### Status Check Commands

```bash
# Check Gateway status
openclaw status

# Check channel status
openclaw channels status

# Validate configuration
openclaw config validate

# Test model connectivity
openclaw models test
```

### Log Viewing

```bash
# View Gateway logs
openclaw logs gateway

# Follow logs in real-time
openclaw logs --follow

# View specific channel logs
openclaw logs --channel whatsapp

# View last 100 lines
openclaw logs --lines 100
```

## Common Issue Solutions

### 1. Gateway Won't Start

**Symptoms**
```
Error: Gateway failed to start
Port 18789 is already in use
```

**Troubleshooting Steps**

```bash
# Check port usage
lsof -i :18789
ss -tlnp | grep 18789

# Kill process using the port
kill -9 $(lsof -t -i:18789)

# Or use a different port
openclaw gateway run --port 18790
```

**Possible Causes and Solutions**

| Cause | Symptom | Solution |
| --- | --- | --- |
| Port occupied | `Port already in use` | Kill the process or change port |
| Config error | `Invalid config` | Run `openclaw doctor` to fix |
| Insufficient permissions | `Permission denied` | Check file permissions, try sudo |
| Missing dependencies | `Module not found` | Reinstall `npm install -g openclaw` |

### 2. AI Not Responding

**Symptoms**  
AI doesn't reply after sending a message.

**Troubleshooting Steps**

```bash
# 1. Check if Gateway is running
openclaw status

# 2. Check model configuration
openclaw models list
openclaw models test anthropic/claude-3-5-sonnet

# 3. Check API Key
openclaw config get models.providers.anthropic.apiKey

# 4. View detailed logs
openclaw logs --follow
```

**Common Causes**

| Cause | Check Method | Solution |
| --- | --- | --- |
| Gateway not running | `openclaw status` | Start Gateway |
| Invalid API Key | Check log errors | Update API Key |
| Model unavailable | `openclaw models test` | Check model ID or switch to fallback |
| Network issues | `curl api.anthropic.com` | Check network connection |

### 3. Channel Connection Failed

**Symptoms**  
WhatsApp/Telegram and other channels show as disconnected.

**WhatsApp-Specific Issues**

```bash
# Check WhatsApp status
openclaw channels status whatsapp

# Re-pair
openclaw whatsapp logout
openclaw whatsapp login

# Check Baileys storage
ls -la ~/.openclaw/whatsapp/
```

**Telegram-Specific Issues**

```bash
# Verify Bot Token
curl https://api.telegram.org/bot<TOKEN>/getMe

# Check WebHook status
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo

# Reset WebHook
curl -F "url=" https://api.telegram.org/bot<TOKEN>/setWebhook
```

### 4. Configuration Errors

**Symptoms**  
`Invalid config at ~/.openclaw/openclaw.json`

**Fix Methods**

```bash
# Auto-fix configuration
openclaw doctor

# Or reset configuration
mv ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak
openclaw setup

# Manually validate configuration
openclaw config validate
```

**Common Configuration Errors**

| Error Type | Example | Fix |
| --- | --- | --- |
| JSON syntax error | Missing comma/quotes | Use doctor to auto-fix |
| Invalid value | `"enabled": "yes"` | Change to `"enabled": true` |
| Path error | `~` not expanded | Use absolute path or `${HOME}` |
| Type error | `port: "18789"` | Change to `port: 18789` |

### 5. Performance Issues

**Symptoms**  
Slow response, high CPU/memory usage.

**Diagnostic Commands**

```bash
# View resource usage
top -p $(pgrep -d',' openclaw)
htop

# View Gateway stats
openclaw status --stats

# Check active sessions
openclaw sessions list

# Clean old sessions
openclaw sessions prune --older-than 7d
```

**Optimization Tips**

| Issue | Optimization Method |
| --- | --- |
| High memory usage | Reduce `maxConcurrentRuns`, clean old sessions |
| Slow response | Use faster model, enable caching |
| High CPU usage | Limit concurrency, use headless browser |
| High disk usage | Configure log rotation, clean media files |

## Using Doctor for Auto-Fix

### Doctor Diagnostic Modules

`src/commands/doctor.ts` implements comprehensive diagnostics:

| Module | Function | Auto-Fix |
| --- | --- | --- |
| Config check | Validate openclaw.json | ✅ |
| Auth check | Validate API Key and Token | ✅ |
| Legacy state migration | Migrate old version data | ✅ |
| Sandbox check | Validate Docker sandbox | ✅ |
| Gateway service | Check service configuration | ✅ |
| Platform-specific | macOS LaunchAgent etc. | ✅ |

### Running Diagnostics Example

```bash
$ openclaw doctor

✔ OpenClaw doctor
│
├─ Gateway
│  ├─ ✅ Config valid
│  ├─ ⚠️  Token auth recommended
│  └─ ✅ Service configured
│
├─ Channels
│  ├─ ✅ WhatsApp connected
│  ├─ ✅ Telegram connected
│  └─ ⚠️  Discord not configured
│
├─ Models
│  ├─ ✅ Anthropic API reachable
│  └─ ✅ Default model available
│
└─ Fixes Applied
   └─ Generated gateway token automatically
```

## Log Analysis Tips

### Log Levels

```bash
# Set log level
export OPENCLAW_LOG_LEVEL=debug

# Available levels: error, warn, info, debug, trace
```

### Common Log Patterns

```
# Connection successful
[INFO] gateway: server started on port 18789

# Auth failure
[WARN] auth: invalid token from 192.168.1.100

# Model call
[DEBUG] agent: calling model anthropic/claude-3-5-sonnet
[INFO] agent: response received in 2345ms

# Error
[ERROR] channels.whatsapp: connection lost, reconnecting...
```

### Log Filtering

```bash
# View only errors
openclaw logs | grep ERROR

# Follow specific channel
openclaw logs --channel whatsapp --follow

# Filter by time range
openclaw logs --since "2024-02-14 09:00" --until "2024-02-14 10:00"
```

## Getting Help

### Command Help

```bash
# View command help
openclaw --help
openclaw doctor --help
openclaw config --help

# View subcommand help
openclaw channels --help
```

### Community Support

- **GitHub Issues**: https://github.com/openclaw/openclaw/issues
- **Discord Community**: https://discord.gg/openclaw
- **Documentation**: https://docs.openclaw.ai

### Reporting Issues

When reporting issues, please include:

1. OpenClaw version: `openclaw --version`
2. Operating system and version
3. Steps to reproduce the issue
4. Relevant log snippets
5. Solutions already attempted

## Lesson Summary

In this course, you learned:

- ✅ Systematic troubleshooting process
- ✅ Using doctor command for auto-diagnosis and fixing
- ✅ Diagnosis and solutions for common issues
- ✅ Log analysis techniques
- ✅ Optimization methods for performance issues
- ✅ Where to get help

## Next Lesson Preview

> In the next lesson, we'll learn about **[Security Guide](../security-guide/)**.
>
> You'll learn:
> - Security models and best practices
> - DM pairing mechanism
> - Sandbox execution and access control

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to view source locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Doctor main command | [`src/commands/doctor.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor.ts) | 65-300 |
| Doctor auth module | [`src/commands/doctor-auth.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor-auth.ts) | - |
| Doctor config flow | [`src/commands/doctor-config-flow.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor-config-flow.ts) | - |
| Doctor sandbox module | [`src/commands/doctor-sandbox.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor-sandbox.ts) | - |
| Status command | [`src/commands/status.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/status.ts) | - |
| Gateway health check | [`src/commands/doctor-gateway-health.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor-gateway-health.ts) | - |

**Diagnostic Types**:
- Config validation
- Auth health
- Legacy state migration
- Sandbox integrity
- Service configuration
- Platform-specific checks

</details>
