---
title: "配置选项: 完整参考手册 | opencode-antigravity-auth"
sidebarTitle: "配置选项"
subtitle: "配置选项: 完整参考手册"
description: "学习 opencode-antigravity-auth 插件的 30+ 配置选项。涵盖通用设置、会话恢复、账号选择策略、限流、令牌刷新等所有配置项，包含默认值和最佳实践。"
tags:
  - "Configuration Reference"
  - "Advanced Configuration"
  - "Complete Manual"
  - "Antigravity"
  - "OpenCode"
prerequisite:
  - "quick-install"
order: 1
---

# Antigravity Auth Configuration Options Complete Reference Manual

## What You'll Learn

- Find and modify all configuration options for the Antigravity Auth plugin
- Understand the purpose and use cases for each configuration item
- Choose the best configuration combination based on your usage scenario
- Override configuration file settings using environment variables

## Core Approach

The Antigravity Auth plugin controls almost all behavior through configuration files: from log level to account selection strategy, from session recovery to token refresh mechanism.

::: info Configuration File Locations (priority from high to low)
1. **Project Configuration**: `.opencode/antigravity.json`
2. **User Configuration**:
   - Linux/Mac: `~/.config/opencode/antigravity.json`
   - Windows: `%APPDATA%\opencode\antigravity.json`
:::

::: tip Environment Variable Priority
All configuration items can be overridden via environment variables. Environment variables have **higher** priority than configuration files.
:::

## Configuration Overview

| Category | Configuration Items | Core Scenarios |
|--- | --- | ---|
| General Settings | 3 | Logging, debug mode |
| Thinking Block | 1 | Preserve thinking process |
| Session Recovery | 3 | Automatic error recovery |
| Signature Cache | 4 | Thinking block signature persistence |
| Empty Response Retry | 2 | Handle empty responses |
| Tool ID Recovery | 1 | Tool matching |
| Tool Hallucination Prevention | 1 | Prevent parameter errors |
| Token Refresh | 3 | Proactive refresh mechanism |
| Rate Limiting | 5 | Account rotation and waiting |
| Health Score | 7 | Hybrid strategy scoring |
| Token Bucket | 3 | Hybrid strategy tokens |
| Auto Update | 1 | Plugin auto-update |
| Web Search | 2 | Gemini search |

---

## General Settings

### `quiet_mode`

**Type**: `boolean`
**Default**: `false`
**Environment Variable**: `OPENCODE_ANTIGRAVITY_QUIET=1`

Suppress most toast notifications (rate limits, account switching, etc.). Recovery notifications (successful session recovery) are always displayed.

**Use Cases**:
- Multi-account high-frequency usage scenarios to avoid frequent notification interference
- Automated scripts or background services

**Example**:
```json
{
  "quiet_mode": true
}
```

### `debug`

**Type**: `boolean`
**Default**: `false`
**Environment Variable**: `OPENCODE_ANTIGRAVITY_DEBUG=1`

Enable debug logging to file. Log files are stored by default in `~/.config/opencode/antigravity-logs/`.

**Use Cases**:
- Enable when troubleshooting issues
- Provide detailed logs when submitting bug reports

::: danger Debug logs may contain sensitive information
Log files contain API responses, account indexes, and other information. Please sanitize before submitting.
:::

### `log_dir`

**Type**: `string`
**Default**: OS-specific config directory + `/antigravity-logs`
**Environment Variable**: `OPENCODE_ANTIGRAVITY_LOG_DIR=/path/to/logs`

Custom directory for storing debug logs.

**Use Cases**:
- Need to store logs in a specific location (e.g., network shared directory)
- Log rotation and archiving scripts

---

## Thinking Block Settings

### `keep_thinking`

**Type**: `boolean`
**Default**: `false`
**Environment Variable**: `OPENCODE_ANTIGRAVITY_KEEP_THINKING=1`

::: warning Experimental Feature
Preserve Claude model thinking blocks (via signature cache).

**Behavior**:
- `false` (default): Strip thinking blocks to avoid signature errors, prioritizing reliability
- `true`: Preserve complete context (including thinking blocks), but may encounter signature errors

**Use Cases**:
- Need to view the model's complete reasoning process
- Frequently use thinking content in conversations

**Not Recommended For**:
- Production environments (reliability priority)
- Multi-turn conversations (easily trigger signature conflicts)

::: tip Use with `signature_cache`
When enabling `keep_thinking`, it's recommended to configure `signature_cache` to improve signature hit rate.
:::

---

## Session Recovery

### `session_recovery`

**Type**: `boolean`
**Default**: `true`

Automatically recover sessions from `tool_result_missing` errors. When enabled, toast notifications are displayed when recoverable errors occur.

**Recoverable Error Types**:
- `tool_result_missing`: Tool result missing (ESC interrupt, timeout, crash)
- `Expected thinking but found text`: Thinking block order error

**Use Cases**:
- All scenarios using tools (default recommendation: enable)
- Long conversations or frequent tool execution

### `auto_resume`

**Type**: `boolean`
**Default**: `false`

Automatically send "continue" prompt to recover session. Only takes effect when `session_recovery` is enabled.

**Behavior**:
- `false`: Only show toast notification, user needs to manually send "continue"
- `true`: Automatically send "continue" to continue session

**Use Cases**:
- Automated scripts or unattended scenarios
- Want fully automated recovery process

**Not Recommended For**:
- Need manual confirmation of recovery results
- Need to check state before continuing after tool interruption

### `resume_text`

**Type**: `string`
**Default**: `"continue"`

Custom text sent during automatic recovery. Only used when `auto_resume` is enabled.

**Use Cases**:
- Multilingual environments (e.g., change to "继续", "请继续")
- Scenarios requiring additional prompt words

**Example**:
```json
{
  "auto_resume": true,
  "resume_text": "请继续完成之前的任务"
}
```

---

## Signature Cache

> Only takes effect when `keep_thinking` is enabled

### `signature_cache.enabled`

**Type**: `boolean`
**Default**: `true`

Enable disk caching of thinking block signatures.

**Purpose**: Caching signatures can avoid errors caused by repeated signing in multi-turn conversations.

### `signature_cache.memory_ttl_seconds`

**Type**: `number` (range: 60-86400)
**Default**: `3600` (1 hour)

Expiration time for memory cache (seconds).

### `signature_cache.disk_ttl_seconds`

**Type**: `number` (range: 3600-604800)
**Default**: `172800` (48 hours)

Expiration time for disk cache (seconds).

### `signature_cache.write_interval_seconds`

**Type**: `number` (range: 10-600)
**Default**: `60`

Interval for background writing to disk (seconds).

**Example**:
```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  }
}
```

---

## Empty Response Retry

Automatically retry when Antigravity returns an empty response (no candidates/choices).

### `empty_response_max_attempts`

**Type**: `number` (range: 1-10)
**Default**: `4`

Maximum number of retry attempts.

### `empty_response_retry_delay_ms`

**Type**: `number` (range: 500-10000)
**Default**: `2000` (2 seconds)

Delay between each retry (milliseconds).

**Use Cases**:
- Unstable network environments (increase retry count)
- Need fast failure (reduce retry count and delay)

---

## Tool ID Recovery

### `tool_id_recovery`

**Type**: `boolean`
**Default**: `true`

Enable tool ID orphan recovery. When tool response IDs don't match (due to context compression), try matching by function name or creating placeholders.

**Purpose**: Improve reliability of tool calls in multi-turn conversations.

**Use Cases**:
- Long conversation scenarios (recommended to enable)
- Scenarios with frequent tool usage

---

## Tool Hallucination Prevention

### `claude_tool_hardening`

**Type**: `boolean`
**Default**: `true`

Enable tool hallucination prevention for Claude models. When enabled, automatically inject:
- Parameter signatures into tool descriptions
- Strict tool usage rules system instruction

**Purpose**: Prevent Claude from using parameter names from training data instead of actual schema.

**Use Cases**:
- Using MCP plugins or custom tools (recommended to enable)
- Complex tool schemas

**Not Recommended For**:
- Confirmed tool calls fully comply with schema (can disable to reduce extra prompts)

---

## Proactive Token Refresh

### `proactive_token_refresh`

**Type**: `boolean`
**Default**: `true`

Enable proactive background token refresh. When enabled, tokens are automatically refreshed before expiration, ensuring requests won't be blocked by token refresh.

**Purpose**: Avoid request delays waiting for token refresh.

### `proactive_refresh_buffer_seconds`

**Type**: `number` (range: 60-7200)
**Default**: `1800` (30 minutes)

How long before token expiration to trigger proactive refresh (seconds).

### `proactive_refresh_check_interval_seconds`

**Type**: `number` (range: 30-1800)
**Default**: `300` (5 minutes)

Interval for proactive refresh checks (seconds).

**Use Cases**:
- High-frequency request scenarios (recommended to enable proactive refresh)
- Want to reduce refresh failure risk (increase buffer time)

---

## Rate Limiting and Account Selection

### `max_rate_limit_wait_seconds`

**Type**: `number` (range: 0-3600)
**Default**: `300` (5 minutes)

Maximum wait time (seconds) when all accounts are rate-limited. If the minimum wait time for all accounts exceeds this threshold, the plugin will fail fast instead of hanging.

**Set to 0**: Disable timeout, wait indefinitely.

**Use Cases**:
- Scenarios requiring fast failure (reduce wait time)
- Scenarios accepting long waits (increase wait time)

### `quota_fallback`

**Type**: `boolean`
**Default**: `false`

Enable quota fallback for Gemini models. When the preferred quota pool (Gemini CLI or Antigravity) is exhausted, try the backup quota pool for the same account.

**Use Cases**:
- High-frequency usage of Gemini models (recommended to enable)
- Want to maximize quota utilization per account

::: tip Only takes effect when quota suffix is not explicitly specified
If the model name explicitly contains `:antigravity` or `:gemini-cli`, the specified quota pool will always be used without fallback.
:::

### `account_selection_strategy`

**Type**: `string` (enum: `sticky`, `round-robin`, `hybrid`)
**Default**: `"hybrid"`
**Environment Variable**: `OPENCODE_ANTIGRAVITY_ACCOUNT_SELECTION_STRATEGY`

Account selection strategy.

| Strategy | Description | Use Cases |
|--- | --- | ---|
| `sticky` | Use the same account until rate-limited, preserve prompt cache | Single session, cache-sensitive scenarios |
| `round-robin` | Rotate to the next account for each request, maximize throughput | Multi-account high-throughput scenarios |
| `hybrid` | Deterministic selection based on health score + token bucket + LRU | General recommendation, balances performance and reliability |

::: info For More Details
See [Account Selection Strategies](/NoeFabris/opencode-antigravity-auth/advanced/account-selection-strategies/) chapter.
:::

### `pid_offset_enabled`

**Type**: `boolean`
**Default**: `false`
**Environment Variable**: `OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1`

Enable PID-based account offset. When enabled, different sessions (PIDs) will prioritize different starting accounts, helping distribute load when running multiple parallel agents.

**Behavior**:
- `false` (default): All sessions start from the same account index, preserving Anthropic prompt cache (recommended for single session use)
- `true`: Offset starting accounts based on PID, distribute load (recommended for multi-session parallel use)

**Use Cases**:
- Running multiple parallel OpenCode sessions
- Using sub-agents or parallel tasks

### `switch_on_first_rate_limit`

**Type**: `boolean`
**Default**: `true`

Immediately switch accounts on first rate limit (after 1 second delay). When disabled, it will first retry the same account and only switch on the second rate limit.

**Use Cases**:
- Want fast account switching (recommended to enable)
- Want to maximize single account quota (disable)

---

## Health Score (Hybrid Strategy)

> Only takes effect when `account_selection_strategy` is `hybrid`

### `health_score.initial`

**Type**: `number` (range: 0-100)
**Default**: `70`

Initial health score for accounts.

### `health_score.success_reward`

**Type**: `number` (range: 0-10)
**Default**: `1`

Health score increase per successful request.

### `health_score.rate_limit_penalty`

**Type**: `number` (range: -50-0)
**Default**: `-10`

Health score deduction per rate limit.

### `health_score.failure_penalty`

**Type**: `number` (range: -100-0)
**Default**: `-20`

Health score deduction per failure.

### `health_score.recovery_rate_per_hour`

**Type**: `number` (range: 0-20)
**Default**: `2`

Health score recovery per hour.

### `health_score.min_usable`

**Type**: `number` (range: 0-100)
**Default**: `50`

Minimum health score threshold for account availability.

### `health_score.max_score`

**Type**: `number` (range: 50-100)
**Default**: `100`

Health score upper limit.

**Use Cases**:
- Default configuration works for most scenarios
- High-frequency rate limit environments can reduce `rate_limit_penalty` or increase `recovery_rate_per_hour`
- Need faster account switching can lower `min_usable`

**Example**:
```json
{
  "account_selection_strategy": "hybrid",
  "health_score": {
    "initial": 80,
    "success_reward": 2,
    "rate_limit_penalty": -5,
    "failure_penalty": -15,
    "recovery_rate_per_hour": 5,
    "min_usable": 40,
    "max_score": 100
  }
}
```

---

## Token Bucket (Hybrid Strategy)

> Only takes effect when `account_selection_strategy` is `hybrid`

### `token_bucket.max_tokens`

**Type**: `number` (range: 1-1000)
**Default**: `50`

Maximum capacity of the token bucket.

### `token_bucket.regeneration_rate_per_minute`

**Type**: `number` (range: 0.1-60)
**Default**: `6`

Number of tokens generated per minute.

### `token_bucket.initial_tokens`

**Type**: `number` (range: 1-1000)
**Default**: `50`

Initial number of tokens per account.

**Use Cases**:
- High-frequency request scenarios can increase `max_tokens` and `regeneration_rate_per_minute`
- Want faster account rotation can lower `initial_tokens`

---

## Auto Update

### `auto_update`

**Type**: `boolean`
**Default**: `true`

Enable plugin auto-update.

**Use Cases**:
- Want to automatically get latest features (recommended to enable)
- Need fixed version (disable)

---

## Web Search (Gemini Grounding)

### `web_search.default_mode`

**Type**: `string` (enum: `auto`, `off`)
**Default**: `"off"`

Default mode for web search (when not specified via variant).

| Mode | Description |
|--- | ---|
| `auto` | Model decides when to search (dynamic retrieval) |
| `off` | Search disabled by default |

### `web_search.grounding_threshold`

**Type**: `number` (range: 0-1)
**Default**: `0.3`

Dynamic retrieval threshold (0.0 to 1.0). Higher values mean the model searches less frequently (requires higher confidence to trigger search). Only takes effect in `auto` mode.

**Use Cases**:
- Reduce unnecessary searches (increase threshold, e.g., 0.5)
- Encourage model to search more (lower threshold, e.g., 0.2)

**Example**:
```json
{
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.4
  }
}
```

---

## Configuration Examples

### Single Account Basic Configuration

```json
{
  "quiet_mode": false,
  "debug": false,
  "keep_thinking": false,
  "session_recovery": true,
  "auto_resume": false,
  "account_selection_strategy": "sticky"
}
```

### Multi-Account High-Performance Configuration

```json
{
  "quiet_mode": true,
  "debug": false,
  "session_recovery": true,
  "auto_resume": true,
  "account_selection_strategy": "hybrid",
  "quota_fallback": true,
  "switch_on_first_rate_limit": true,
  "max_rate_limit_wait_seconds": 120,
  "health_score": {
    "initial": 70,
    "min_usable": 40
  },
  "token_bucket": {
    "max_tokens": 100,
    "regeneration_rate_per_minute": 10
  }
}
```

### Debugging and Diagnostics Configuration

```json
{
  "debug": true,
  "log_dir": "/tmp/antigravity-logs",
  "quiet_mode": false,
  "session_recovery": true,
  "auto_resume": true,
  "tool_id_recovery": true
}
```

### Preserve Thinking Block Configuration

```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  },
  "session_recovery": true
}
```

---

## FAQ

### Q: How to temporarily disable a specific configuration?

**A**: Use environment variable override, no need to modify configuration file.

```bash
# Temporarily enable debug mode
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode

# Temporarily enable quiet mode
OPENCODE_ANTIGRAVITY_QUIET=1 opencode
```

### Q: Do I need to restart OpenCode after modifying configuration file?

**A**: Yes, configuration file is loaded when OpenCode starts. You need to restart after modification.

### Q: How to verify configuration takes effect?

**A**: Enable `debug` mode and check configuration loading information in log files.

```json
{
  "debug": true
}
```

Logs will display loaded configuration:
```
[config] Loaded configuration: {...}
```

### Q: Which configuration items most frequently need adjustment?

**A**:
- `account_selection_strategy`: Choose appropriate strategy for multi-account scenarios
- `quiet_mode`: Reduce notification interference
- `session_recovery` / `auto_resume`: Control session recovery behavior
- `debug`: Enable when troubleshooting issues

### Q: Is there JSON Schema validation for configuration file?

**A**: Yes, adding `$schema` field in configuration file enables IDE autocomplete and validation:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  ...
}
```

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Configuration Schema Definition | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 1-373   |
| JSON Schema  | [`assets/antigravity.schema.json`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/assets/antigravity.schema.json) | 1-157   |
| Configuration Loading    | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | -       |

**Key Constants**:
- `DEFAULT_CONFIG`: Default configuration object (`schema.ts:328-372`)

**Key Types**:
- `AntigravityConfig`: Main configuration type (`schema.ts:322`)
- `SignatureCacheConfig`: Signature cache configuration type (`schema.ts:323`)
- `AccountSelectionStrategy`: Account selection strategy type (`schema.ts:22`)

</details>
