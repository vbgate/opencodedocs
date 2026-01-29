---
title: "Configuration: Complete Guide | opencode-antigravity-auth"
sidebarTitle: "Configuration"
subtitle: "Configuration: Complete Guide"
description: "Master Antigravity Auth configuration options. Learn file locations, priorities, model settings, account rotation strategies, and advanced tuning methods for single-account, multi-account, and parallel agent scenarios."
tags:
  - "configuration"
  - "advanced"
  - "multi-account"
  - "account-rotation"
prerequisite:
  - "start-quick-install"
  - "advanced-multi-account-setup"
order: 2
---

# Configuration Guide

## What You'll Learn

- ✅ Create configuration files in the correct location
- ✅ Choose the appropriate configuration scheme based on your use case
- ✅ Understand the purpose and default values of all configuration options
- ✅ Temporarily override configuration using environment variables
- ✅ Adjust model behavior, account rotation, and plugin behavior

## Your Current Challenge

Too many configuration options and don't know where to start? Default settings work but want to optimize further? Not sure which rotation strategy to use in multi-account scenarios?

## Core Approach

Configuration files are like writing an "instruction manual" for the plugin—you tell it how to work, and it executes according to your specifications. The Antigravity Auth plugin provides rich configuration options, but most users only need to configure a few core options.

### Configuration File Priority

Configuration priority from high to low:

1. **Environment variables** (temporary override)
2. **Project-level configuration** `.opencode/antigravity.json` (current project)
3. **User-level configuration** `~/.config/opencode/antigravity.json` (global)

::: info
Environment variables have the highest priority and are suitable for temporary testing. Configuration files are suitable for persistent settings.
:::

### Configuration File Locations

Depending on the operating system, user-level configuration file locations vary:

| System      | Path                                              |
| ----------- | ------------------------------------------------- |
| Linux/macOS | `~/.config/opencode/antigravity.json`             |
| Windows     | `%APPDATA%\opencode\antigravity.json` |

Project-level configuration files are always located at `.opencode/antigravity.json` in the project root directory.

### Configuration Option Categories

Configuration options fall into four categories:

1. **Model behavior**: Thinking blocks, session recovery, Google Search
2. **Account rotation**: Multi-account management, selection strategy, PID offset
3. **Application behavior**: Debug logs, auto-update, notification silence
4. **Advanced settings**: Error recovery, token management, health scoring

---

## 🎒 Prerequisites

- [x] Plugin installed (refer to [Quick Install](../../start/quick-install/))
- [x] At least one Google account configured
- [x] Basic understanding of JSON syntax

---

## Follow Along

### Step 1: Create Configuration File

**Why**: Configuration files make the plugin work according to your needs

Create the configuration file at the appropriate path based on your operating system:

::: code-group

```bash [macOS/Linux]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell [Windows]
## Using PowerShell
$json = @{
  '$schema' = "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
} | ConvertTo-Json -Depth 10

Set-Content -Path "$env:APPDATA\opencode\antigravity.json" -Value $json
```

:::

**You should see**: File created successfully, content contains only the `$schema` field.

::: tip
After adding the `$schema` field, VS Code automatically provides intelligent suggestions and type checking.
:::

### Step 2: Configure Basic Options

**Why**: Optimize plugin behavior based on your usage scenario

Choose one of the following schemes based on your configuration:

**Scenario A: Single Account + Google Search Needed**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Scenario B: 2-3 Accounts + Smart Rotation**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Scenario C: Multiple Accounts + Parallel Agents**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**You should see**: Configuration file saved successfully, OpenCode automatically reloads plugin configuration.

### Step 3: Verify Configuration

**Why**: Confirm configuration is effective

Initiate a model request in OpenCode and observe:

1. Single account using `sticky` strategy: All requests use the same account
2. Multiple accounts using `hybrid` strategy: Requests are intelligently distributed across different accounts
3. Gemini model with `web_search` enabled: Model searches the web when needed

**You should see**: Plugin behavior matches your configuration expectations.

---

## Configuration Options Explained

### Model Behavior

These options affect how models think and respond.

#### keep_thinking

| Value  | Default | Description                                          |
| ------ | ------- | ---------------------------------------------------- |
| `true` | -       | Retain Claude thinking blocks, maintain coherence across rounds |
| `false` | ✓       | Strip thinking blocks, more stable, smaller context |

::: warning Note
Enabling `keep_thinking` may lead to decreased model stability and signature errors. Keeping it `false` is recommended.
:::

#### session_recovery

| Value  | Default | Description                                               |
| ------ | ------- | --------------------------------------------------------- |
| `true` | ✓       | Automatically resume sessions interrupted by tool calls    |
| `false` | -       | Do not automatically resume when errors occur             |

#### auto_resume

| Value  | Default | Description                                             |
| ------ | ------- | ------------------------------------------------------- |
| `true` | -       | Automatically send "continue" after recovery            |
| `false` | ✓       | Only display prompt after recovery, manual continuation  |

#### resume_text

Custom text sent during recovery. Defaults to `"continue"`, you can change it to any text.

#### web_search

| Option               | Default   | Description                                       |
| -------------------- | --------- | ------------------------------------------------- |
| `default_mode`       | `"off"`   | `"auto"` or `"off"`                              |
| `grounding_threshold`| `0.3`     | Search threshold (0=always search, 1=never search)|

::: info
`grounding_threshold` only takes effect when `default_mode: "auto"`. Larger values make the model more conservative in searching.
:::

---

### Account Rotation

These options manage request distribution across multiple accounts.

#### account_selection_strategy

| Strategy     | Default | Use Case                           |
| ------------ | ------- | ---------------------------------- |
| `sticky`     | -       | Single account, preserve prompt cache      |
| `round-robin`| -       | 4+ accounts, maximize throughput     |
| `hybrid`     | ✓       | 2-3 accounts, intelligent rotation |

::: tip
Recommended strategies for different account counts:
- 1 account → `sticky`
- 2-3 accounts → `hybrid`
- 4+ accounts → `round-robin`
- Parallel agents → `round-robin` + `pid_offset_enabled: true`
:::

#### switch_on_first_rate_limit

| Value  | Default | Description                                          |
| ------ | ------- | ---------------------------------------------------- |
| `true` | ✓       | Switch account immediately on first 429             |
| `false` | -       | Retry current account first, switch on second 429    |

#### pid_offset_enabled

| Value  | Default | Description                                               |
| ------ | ------- | --------------------------------------------------------- |
| `true` | -       | Different sessions (PIDs) use different starting accounts |
| `false` | ✓       | All sessions start from the same account                  |

::: tip
Keep `false` for single-session use to preserve Anthropic prompt cache. Enable `true` for multi-session parallel execution.
:::

#### quota_fallback

| Value  | Default | Description                                |
| ------ | ------- | ------------------------------------------ |
| `true` | -       | Gemini model quota pool fallback           |
| `false` | ✓       | Fallback disabled                          |

::: info
Only applicable to Gemini models. When the primary quota pool is exhausted, attempts the backup quota pool of the same account.
:::

---

### Application Behavior

These options control the plugin's own behavior.

#### quiet_mode

| Value  | Default | Description                                             |
| ------ | ------- | ------------------------------------------------------- |
| `true` | -       | Silence most toast notifications (except recovery notifications) |
| `false` | ✓       | Display all notifications                               |

#### debug

| Value  | Default | Description                                |
| ------ | ------- | ------------------------------------------ |
| `true` | -       | Enable debug logs                          |
| `false` | ✓       | Do not log debug information               |

::: tip
To temporarily enable debug logs without modifying the configuration file, use environment variables:
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode   # Basic logs
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode   # Verbose logs
```
:::

#### log_dir

Custom debug log directory. Defaults to `~/.config/opencode/antigravity-logs/`.

#### auto_update

| Value  | Default | Description                             |
| ------ | ------- | --------------------------------------- |
| `true` | ✓       | Automatically check and update plugin   |
| `false` | -       | Do not update automatically             |

---

### Advanced Settings

These options are for edge cases; most users don't need to modify them.

<details>
<summary><strong>Click to expand advanced settings</strong></summary>

#### Error Recovery

| Option                            | Default | Description                                      |
| --------------------------------- | ------- | ------------------------------------------------ |
| `empty_response_max_attempts`     | `4`     | Empty response retry count                       |
| `empty_response_retry_delay_ms`   | `2000`  | Retry interval (milliseconds)                   |
| `tool_id_recovery`                | `true`  | Fix tool ID mismatches                           |
| `claude_tool_hardening`           | `true`  | Prevent tool parameter hallucinations            |
| `max_rate_limit_wait_seconds`     | `300`   | Maximum rate limit wait time (0=infinite)        |

#### Token Management

| Option                                   | Default | Description                         |
| ---------------------------------------- | ------- | ----------------------------------- |
| `proactive_token_refresh`                | `true`  | Proactively refresh token before expiry |
| `proactive_refresh_buffer_seconds`       | `1800`  | Refresh 30 minutes in advance       |
| `proactive_refresh_check_interval_seconds`| `300`   | Refresh check interval (seconds)    |

#### Signature Cache (Effective when `keep_thinking: true`)

| Option                              | Default | Description                        |
| ----------------------------------- | ------- | ---------------------------------- |
| `signature_cache.enabled`           | `true`  | Enable disk cache                  |
| `signature_cache.memory_ttl_seconds`| `3600`  | Memory cache TTL (1 hour)          |
| `signature_cache.disk_ttl_seconds`  | `172800`| Disk cache TTL (48 hours)          |
| `signature_cache.write_interval_seconds`| `60` | Background write interval (seconds) |

#### Health Scoring (Used by `hybrid` strategy)

| Option                           | Default | Description                       |
| -------------------------------- | ------- | --------------------------------- |
| `health_score.initial`           | `70`    | Initial health score             |
| `health_score.success_reward`    | `1`     | Success reward points             |
| `health_score.rate_limit_penalty`| `-10`   | Rate limit penalty points        |
| `health_score.failure_penalty`   | `-20`   | Failure penalty points           |
| `health_score.recovery_rate_per_hour`| `2`  | Points recovered per hour        |
| `health_score.min_usable`        | `50`    | Minimum score for usable account |
| `health_score.max_score`         | `100`   | Health score maximum             |

#### Token Bucket (Used by `hybrid` strategy)

| Option                              | Default | Description              |
| ----------------------------------- | ------- | ------------------------ |
| `token_bucket.max_tokens`           | `50`    | Bucket maximum capacity  |
| `token_bucket.regeneration_rate_per_minute`| `6` | Tokens recovered per minute |
| `token_bucket.initial_tokens`       | `50`    | Initial token count      |

</details>

---

## Recommended Configuration Schemes

### Single Account Configuration

Suitable for: Users with only one Google account

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Configuration Notes**:
- `sticky`: No rotation, preserves Anthropic prompt cache
- `web_search: auto`: Gemini can search as needed

### 2-3 Account Configuration

Suitable for: Small teams or users needing some flexibility

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Configuration Notes**:
- `hybrid`: Intelligent rotation, health scoring selects optimal account
- `web_search: auto`: Gemini can search as needed

### Multiple Accounts + Parallel Agents Configuration

Suitable for: Users running multiple concurrent agents

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**Configuration Notes**:
- `round-robin`: Rotate accounts for each request
- `switch_on_first_rate_limit: true`: Switch immediately on first 429
- `pid_offset_enabled: true`: Different sessions start with different accounts
- `web_search: auto`: Gemini can search as needed

---

## Common Pitfalls

### ❌ Error: Configuration changes not taking effect

**Cause**: OpenCode may not have reloaded the configuration file.

**Solution**: Restart OpenCode or check if JSON syntax is correct.

### ❌ Error: Configuration file JSON format error

**Cause**: JSON syntax error (missing comma, extra comma, comments, etc.).

**Solution**: Use a JSON validation tool or add the `$schema` field to enable IDE intelligent suggestions.

### ❌ Error: Environment variables not taking effect

**Cause**: Environment variable name misspelled or OpenCode not restarted.

**Solution**: Confirm variable name is `OPENCODE_ANTIGRAVITY_*` (all caps, correct prefix), restart OpenCode.

### ❌ Error: Frequent errors after enabling `keep_thinking: true`

**Cause**: Thinking block signature mismatch.

**Solution**: Keep `keep_thinking: false` (default), or adjust `signature_cache` configuration.

---

## Lesson Summary

Configuration file priority: Environment variables > Project-level > User-level.

Core configuration items:
- Model behavior: `keep_thinking`, `session_recovery`, `web_search`
- Account rotation: `account_selection_strategy`, `pid_offset_enabled`
- Application behavior: `debug`, `quiet_mode`, `auto_update`

Recommended configurations for different scenarios:
- Single account: `sticky`
- 2-3 accounts: `hybrid`
- 4+ accounts: `round-robin`
- Parallel agents: `round-robin` + `pid_offset_enabled: true`

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Debug Logging](../debug-logging/)**.
>
> You'll learn:
> - How to enable debug logs
> - How to interpret log content
> - How to troubleshoot common issues

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature                 | File Path | Lines |
| ----------------------- | --------------------------------------------------------------- | ------- |
| Configuration Schema Definition | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 12-323 |
| Default Configuration Values   | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 325-373 |
| Configuration Loading Logic    | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 1-100 |

**Key Constants**:
- `DEFAULT_CONFIG`: Default values for all configuration items

**Key Types**:
- `AntigravityConfig`: Configuration object type
- `AccountSelectionStrategy`: Account selection strategy type
- `SignatureCacheConfig`: Signature cache configuration type

</details>
