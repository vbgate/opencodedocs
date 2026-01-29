---
title: "Debug Logging: Troubleshoot Issues | opencode-antigravity-auth"
sidebarTitle: "Debug Logging"
subtitle: "Debug Logging: Troubleshoot Issues | opencode-antigravity-auth"
description: "Learn how to enable debug logging for opencode-antigravity-auth. Covers debug configuration, log levels, log interpretation, environment variables, and log file management."
tags:
  - "advanced"
  - "debug"
  - "logging"
  - "troubleshooting"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# Debug Logging: Troubleshoot Issues and Monitor Runtime

## What You'll Learn

- Enable debug logging to record detailed information about all requests and responses
- Understand different log levels and their use cases
- Interpret log content to quickly locate root causes
- Use environment variables to temporarily enable debug without modifying config files
- Manage log files to avoid excessive disk usage

## Your Current Struggle

When encountering issues, you might:

- See vague error messages without knowing the specific cause
- Be unsure if requests are reaching the Antigravity API
- Suspect issues with account selection, rate limiting, or request transformation
- Be unable to provide valuable diagnostic information when seeking help

## When to Use This

Debug logging is suitable for the following scenarios:

| Scenario | Needed | Why |
| -------- | ------ | --- |
| Troubleshoot 429 rate limiting | ✅ Yes | See which account and model is rate limited |
| Troubleshoot authentication failures | ✅ Yes | Check token refresh, OAuth flow |
| Troubleshoot request transformation issues | ✅ Yes | Compare original and transformed requests |
| Troubleshoot account selection strategy | ✅ Yes | See how the plugin selects accounts |
| Monitor daily runtime status | ✅ Yes | Track request frequency, success/failure rates |
| Long-term operation | ⚠️ Caution | Logs grow continuously and need management |

::: warning Prerequisites
Before starting this tutorial, ensure you have:
- ✅ Installed the opencode-antigravity-auth plugin
- ✅ Successfully completed OAuth authentication
- ✅ Can make requests using Antigravity models

[Quick Installation Tutorial](../../start/quick-install/) | [First Request Tutorial](../../start/first-request/)
:::

## Core Concepts

How the debug logging system works:

1. **Structured Logging**: Each log entry includes timestamp and tags for easy filtering and analysis
2. **Tiered Logging**:
   - Level 1 (basic): Records request/response metadata, account selection, rate limiting events
   - Level 2 (verbose): Full request/response body (max 50,000 characters)
3. **Security Masking**: Automatically hides sensitive information (e.g., Authorization header)
4. **Separate Files**: Creates new log file on each startup to avoid confusion

**Log Content Overview**:

| Log Type | Tag | Content Example |
| -------- | --- | --------------- |
| Request Tracking | `Antigravity Debug ANTIGRAVITY-1` | URL, headers, body preview |
| Response Tracking | `Antigravity Debug ANTIGRAVITY-1` | Status code, duration, response body |
| Account Context | `[Account]` | Selected account, account index, model family |
| Rate Limiting | `[RateLimit]` | Rate limit details, reset time, retry delay |
| Model Identification | `[ModelFamily]` | URL parsing, model extraction, model family detection |

## Follow Along

### Step 1: Enable Basic Debug Logging

**Why**
After enabling basic debug logging, the plugin records metadata for all requests, including URLs, headers, account selection, and rate limiting events, helping you troubleshoot issues without exposing sensitive data.

**Action**

Edit the plugin configuration file:

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/antigravity.json
```

```powershell [Windows]
notepad %APPDATA%\opencode\antigravity.json
```

:::

Add or modify the following configuration:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true
}
```

Save the file and restart OpenCode.

**You should see**:

1. A new log file is generated in the config directory after OpenCode starts
2. Log file naming format: `antigravity-debug-YYYY-MM-DDTHH-MM-SS-mmmZ.log`
3. New entries appear in the log file after making any request

::: tip Log File Location
- **Linux/macOS**: `~/.config/opencode/antigravity-logs/`
- **Windows**: `%APPDATA%\opencode\antigravity-logs\`
:::

### Step 2: Interpret Log Content

**Why**
Understanding log format and content is essential for quickly locating issues.

**Action**

Make a test request, then view the log file:

```bash
<!-- macOS/Linux -->
tail -f ~/.config/opencode/antigravity-logs/antigravity-debug-*.log

<!-- Windows PowerShell -->
Get-Content "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" -Wait
```

**You should see**:

```log
[2026-01-23T10:30:15.123Z] [Account] Request: Account 1 (1/2) family=claude
[2026-01-23T10:30:15.124Z] [Antigravity Debug ANTIGRAVITY-1] POST https://cloudcode-pa.googleapis.com/...
[2026-01-23T10:30:15.125Z] [Antigravity Debug ANTIGRAVITY-1] Streaming: yes
[2026-01-23T10:30:15.126Z] [Antigravity Debug ANTIGRAVITY-1] Headers: {"user-agent":"opencode-antigravity-auth/1.3.0","authorization":"[redacted]",...}
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Body Preview: {"model":"google/antigravity-claude-sonnet-4-5",...}
[2026-01-23T10:30:18.456Z] [Antigravity Debug ANTIGRAVITY-1] Response 200 OK (3330ms)
[2026-01-23T10:30:18.457Z] [Antigravity Debug ANTIGRAVITY-1] Response Headers: {"content-type":"application/json",...}
```

**Log Interpretation**:

1. **Timestamp**: `[2026-01-23T10:30:15.123Z]` - ISO 8601 format, millisecond precision
2. **Account Selection**: `[Account]` - Plugin selected Account 1, total 2 accounts, model family is claude
3. **Request Start**: `Antigravity Debug ANTIGRAVITY-1` - Request ID is 1
4. **Request Method**: `POST https://...` - HTTP method and target URL
5. **Streaming**: `Streaming: yes/no` - Whether SSE streaming response is used
6. **Request Headers**: `Headers: {...}` - Automatically hides Authorization (shows `[redacted]`)
7. **Request Body**: `Body Preview: {...}` - Request content (max 12,000 characters, truncated if exceeded)
8. **Response Status**: `Response 200 OK (3330ms)` - HTTP status code and duration
9. **Response Headers**: `Response Headers: {...}` - Response headers

### Step 3: Enable Verbose Logging

**Why**
Verbose logging records complete request/response body (max 50,000 characters), suitable for troubleshooting deep issues like request transformation and response parsing.

**Action**

Modify configuration to verbose level:

```json
{
  "debug": true,
  "OPENCODE_ANTIGRAVITY_DEBUG": "2"
}
```

Or use environment variable (recommended, no config file modification needed):

::: code-group

```bash [macOS/Linux]
export OPENCODE_ANTIGRAVITY_DEBUG=2
opencode
```

```powershell [Windows]
$env:OPENCODE_ANTIGRAVITY_DEBUG="2"
opencode
```

:::

**You should see**:

1. Complete request/response body appears in log file (no longer truncated preview)
2. For large responses, first 50,000 characters are displayed with truncation marker

```log
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Response Body (200): {"id":"msg_...","type":"message","role":"assistant",...}
```

::: warning Disk Space Warning
Verbose logging records complete request/response content, which can cause log files to grow rapidly. After debugging, be sure to disable verbose mode.
:::

### Step 4: Troubleshoot Rate Limiting Issues

**Why**
Rate limiting (429 errors) is one of the most common issues. Logs can tell you which specific account and model is rate limited, and how long to wait.

**Action**

Make multiple concurrent requests to trigger rate limiting:

```bash
<!-- macOS/Linux -->
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait
```

View rate limiting events in logs:

```bash
grep "RateLimit" ~/.config/opencode/antigravity-logs/antigravity-debug-*.log
```

**You should see**:

```log
[2026-01-23T10:30:20.123Z] [RateLimit] 429 on Account 1 family=claude retryAfterMs=60000
[2026-01-23T10:30:20.124Z] [RateLimit] message: Resource has been exhausted
[2026-01-23T10:30:20.125Z] [RateLimit] quotaResetTime: 2026-01-23T10:31:00.000Z
[2026-01-23T10:30:20.126Z] [Account] Request: Account 2 (2/2) family=claude
[2026-01-23T10:30:20.127Z] [RateLimit] snapshot family=claude Account 1=wait 60s | Account 2=ready
```

**Log Interpretation**:

1. **Rate Limit Details**: `429 on Account 1 family=claude retryAfterMs=60000`
   - Account 1 (claude model family) encountered 429 error
   - Need to wait 60,000 milliseconds (60 seconds) before retry
2. **Error Message**: `message: Resource has been exhausted` - Quota exhausted
3. **Reset Time**: `quotaResetTime: 2026-01-23T10:31:00.000Z` - Exact time when quota resets
4. **Account Switching**: Plugin automatically switched to Account 2
5. **Global Snapshot**: `snapshot` - Shows rate limiting status for all accounts

### Step 5: Customize Log Directory

**Why**
By default, log files are stored in the `~/.config/opencode/antigravity-logs/` directory. If you want to store logs in another location (e.g., project directory), you can customize the log directory.

**Action**

Add `log_dir` configuration item in the config file:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true,
  "log_dir": "/path/to/your/custom/logs"
}
```

Or use environment variable:

```bash
export OPENCODE_ANTIGRAVITY_LOG_DIR="/path/to/your/custom/logs"
opencode
```

**You should see**:

1. Log files are written to the specified directory
2. If directory doesn't exist, the plugin creates it automatically
3. Log file naming format remains unchanged

::: tip Path Recommendations
- Development: Store in project root directory (`.logs/`)
- Production: Store in system log directory (`/var/log/` or `~/Library/Logs/`)
- Temporary debugging: Store in `/tmp/` directory for easy cleanup
:::

### Step 6: Clean and Manage Log Files

**Why**
During long-term operation, log files grow continuously and consume significant disk space. Regular cleanup is necessary.

**Action**

Check log directory size:

```bash
<!-- macOS/Linux -->
du -sh ~/.config/opencode/antigravity-logs/

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\" | Measure-Object -Property Length -Sum
```

Clean old logs:

```bash
<!-- macOS/Linux -->
find ~/.config/opencode/antigravity-logs/ -name "antigravity-debug-*.log" -mtime +7 -delete

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item
```

**You should see**:

1. Log directory size decreases
2. Only log files from the last 7 days are retained

::: tip Automated Cleanup
You can add cleanup scripts to cron (Linux/macOS) or Task Scheduler (Windows) for periodic cleanup.
:::

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Enable debug logging via config file
- [ ] Temporarily enable debug using environment variables
- [ ] Interpret log content and find request/response details
- [ ] Understand different log levels
- [ ] Customize log directory
- [ ] Manage and clean log files

## Common Pitfalls

### Log Files Grow Continuously

**Symptom**: Disk space occupied by log files

**Cause**: Debug logging enabled long-term, especially in verbose mode

**Solution**:

1. Immediately disable `debug: false` after debugging
2. Set up periodic cleanup scripts (as in Step 6)
3. Monitor log directory size and set threshold alerts

### Cannot Find Log Files

**Symptom**: Enabled `debug: true`, but log directory is empty

**Cause**:
- Incorrect config file path
- Permission issues (cannot write to log directory)
- Environment variable overriding config

**Solution**:

1. Verify config file path is correct:
   ```bash
   # Find config file
   find ~/.config/opencode/ -name "antigravity.json" 2>/dev/null
   ```
2. Check if environment variable is overriding config:
   ```bash
   echo $OPENCODE_ANTIGRAVITY_DEBUG
   ```
3. Check log directory permissions:
   ```bash
   ls -la ~/.config/opencode/antigravity-logs/
   ```

### Incomplete Log Content

**Symptom**: Cannot see request/response body in logs

**Cause**: Default uses basic level (Level 1), which only records body preview (max 12,000 characters)

**Solution**:

1. Enable verbose level (Level 2):
   ```json
   {
     "OPENCODE_ANTIGRAVITY_DEBUG": "2"
   }
   ```
2. Or use environment variable:
   ```bash
   export OPENCODE_ANTIGRAVITY_DEBUG=2
   ```

### Sensitive Information Leakage

**Symptom**: Concerned about logs containing sensitive data (e.g., Authorization token)

**Cause**: Plugin automatically masks `Authorization` header, but other headers may contain sensitive information

**Solution**:

1. Plugin automatically masks `Authorization` header (shows `[redacted]`)
2. When sharing logs, check for other sensitive headers (e.g., `Cookie`, `Set-Cookie`)
3. If sensitive information is found, manually remove before sharing

### Cannot Open Log Files

**Symptom**: Log file is locked by another process and cannot be viewed

**Cause**: OpenCode is writing to the log file

**Solution**:

1. Use `tail -f` command to view real-time logs (doesn't lock file)
2. If editing is needed, close OpenCode first
3. Use `cat` command to view content (doesn't lock file)

## Summary

- Debug logging is a powerful tool for troubleshooting, capable of recording request/response details, account selection, and rate limiting events
- There are two log levels: basic (Level 1) and verbose (Level 2)
- Environment variables can temporarily enable debug without modifying config files
- Plugin automatically masks sensitive information (e.g., Authorization header)
- Regular cleanup of log files is necessary for long-term operation

## Next Steps

> Next lesson: **[Rate Limit Handling](../rate-limit-handling/)**
>
> You will learn:
> - Rate limit detection mechanism and retry strategy
> - How exponential backoff algorithm works
> - How to configure maximum wait time and retry count
> - Rate limit handling in multi-account scenarios

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature      | File Path                                                                                    | Lines  |
| ------------ | ------------------------------------------------------------------------------------------- | ------ |
| Debug Module | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | Full   |
| Debug Init   | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L98-L118) | 98-118 |
| Request Tracking | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L189-L212) | 189-212 |
| Response Logging | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L217-L250) | 217-250 |
| Header Masking | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L255-L270) | 255-270 |
| Rate Limit Logging | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L354-L396) | 354-396 |
| Config Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L64-L72) | 64-72 |

**Key Constants**:

| Constant Name | Value | Description |
| ------------- | ----- | ----------- |
| `MAX_BODY_PREVIEW_CHARS` | 12000 | Body preview length for basic level |
| `MAX_BODY_VERBOSE_CHARS` | 50000 | Body preview length for verbose level |
| `DEBUG_MESSAGE_PREFIX` | `"[opencode-antigravity-auth debug]"` | Debug log prefix |

**Key Functions**:

- `initializeDebug(config)`: Initialize debug state, read config and environment variables
- `parseDebugLevel(flag)`: Parse debug level string ("0"/"1"/"2"/"true"/"verbose")
- `getLogsDir(customLogDir?)`: Get log directory, supports custom path
- `createLogFilePath(customLogDir?)`: Generate timestamped log file path
- `startAntigravityDebugRequest(meta)`: Start request tracking, record request metadata
- `logAntigravityDebugResponse(context, response, meta)`: Record response details
- `logAccountContext(label, info)`: Record account selection context
- `logRateLimitEvent(...)`: Record rate limiting events
- `maskHeaders(headers)`: Mask sensitive headers (Authorization)

**Configuration Options** (from schema.ts):

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `debug` | boolean | `false` | Enable debug logging |
| `log_dir` | string? | undefined | Custom log directory |

**Environment Variables**:

| Environment Variable | Value | Description |
| -------------------- | ----- | ----------- |
| `OPENCODE_ANTIGRAVITY_DEBUG` | "0"/"1"/"2"/"true"/"verbose" | Override debug config, control log level |
| `OPENCODE_ANTIGRAVITY_LOG_DIR` | string | Override log_dir config, specify log directory |

</details>
