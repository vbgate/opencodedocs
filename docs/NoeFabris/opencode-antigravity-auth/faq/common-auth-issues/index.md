---
title: "Common Auth Issues: Troubleshooting | opencode-antigravity-auth"
sidebarTitle: "Common Issues"
subtitle: "Common Auth Issues: Troubleshooting"
description: "Learn to resolve common Antigravity Auth issues: OAuth failures, token errors, permission denied, rate limiting, and account problems. Covers Safari callback failures, 403 errors, WSL2/Docker setup, and multi-account configuration."
tags:
  - "FAQ"
  - "troubleshooting"
  - "OAuth"
  - "authentication"
prerequisite:
  - "start-first-auth-login"
  - "start-quick-install"
order: 1
---

# Common Authentication Issues Troubleshooting

After completing this lesson, you'll be able to resolve OAuth authentication failures, token refresh errors, permission denied errors, and other common issues independently, restoring normal plugin functionality.

## Your Current Challenge

You've just installed the Antigravity Auth plugin and are ready to use Claude or Gemini 3 models, but:

- After running `opencode auth login`, browser authorization succeeds, but the terminal displays "authorization failed"
- After using it for a while, you suddenly get "Permission Denied" or "invalid_grant" errors
- All accounts show "rate limited" even though quota appears to be sufficient
- Unable to complete OAuth authentication in WSL2 or Docker environments
- Safari browser OAuth callback always fails

These issues are common. In most cases, you don't need to reinstall or contact support. Follow this guide step by step to resolve them.

## When to Use This

Refer to this tutorial when you encounter:

- **OAuth authentication failure**: `opencode auth login` cannot complete
- **Token invalidation**: invalid_grant, Permission Denied errors
- **Rate limiting**: 429 errors, "all accounts rate limited"
- **Environment issues**: WSL2, Docker, remote development environments
- **Plugin conflicts**: Incompatibility with oh-my-opencode or other plugins

::: tip Quick Reset
For authentication issues, **90% of cases** can be resolved by deleting the account file and re-authenticating:
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```
:::

---

## Quick Diagnostic Process

When encountering issues, follow this order to quickly identify the problem:

1. **Check configuration paths** → Confirm file locations are correct
2. **Delete account file and re-authenticate** → Solves most authentication issues
3. **Review error messages** → Look up solutions based on specific error types
4. **Check network environment** → WSL2/Docker requires additional configuration

---

## Core Concepts: OAuth Authentication and Token Management

Before solving problems, understand a few key concepts.

::: info What is OAuth 2.0 PKCE Authentication?

Antigravity Auth uses **OAuth 2.0 with PKCE** (Proof Key for Code Exchange) authentication mechanism:

1. **Authorization Code**: After you authorize, Google returns a temporary authorization code
2. **Token Exchange**: The plugin exchanges the authorization code for `access_token` (for API calls) and `refresh_token` (for refreshing)
3. **Automatic Refresh**: 30 minutes before `access_token` expires, the plugin automatically uses `refresh_token` to refresh
4. **Token Storage**: All tokens are stored locally in `~/.config/opencode/antigravity-accounts.json` and are never uploaded to any server

**Security**: The PKCE mechanism prevents authorization code interception. Even if tokens leak, attackers cannot re-authorize.

:::

::: info What is Rate Limiting?

Google enforces frequency limits on API calls for each Google account. When limits are triggered:

- **429 Too Many Requests**: Too many requests, need to wait
- **403 Permission Denied**: May be soft-banned or triggered abuse detection
- **Request Hangs**: 200 OK but no response, usually indicates silent throttling

**Multi-Account Advantage**: By rotating through multiple accounts, you can bypass individual account limits and maximize total quota.

:::

---

## Configuration Paths

All platforms (including Windows) use `~/.config/opencode/` as the configuration directory:

| File | Path | Description |
|--- | --- | ---|
| Main Config | `~/.config/opencode/opencode.json` | OpenCode main configuration file |
| Account File | `~/.config/opencode/antigravity-accounts.json` | OAuth tokens and account information |
| Plugin Config | `~/.config/opencode/antigravity.json` | Plugin-specific configuration |
| Debug Logs | `~/.config/opencode/antigravity-logs/` | Debug log files |

> **Windows Users Note**: `~` automatically resolves to your user directory (e.g., `C:\Users\YourName`). Don't use `%APPDATA%`.

---

## OAuth Authentication Issues

### Safari OAuth Callback Failure (macOS)

**Symptoms**:
- After browser authorization succeeds, terminal shows "fail to authorize"
- Safari displays "Safari cannot open the page" or "Connection refused"

**Cause**: Safari's "HTTPS-Only Mode" blocks the `http://localhost` callback address.

**Solutions**:

**Solution 1: Use a Different Browser (Simplest)**

1. Run `opencode auth login`
2. Copy the OAuth URL displayed in the terminal
3. Paste into Chrome or Firefox to open
4. Complete authorization

**Solution 2: Temporarily Disable HTTPS-Only Mode**

1. Safari → Settings (⌘,) → Privacy
2. Uncheck "Enable HTTPS-Only Mode"
3. Run `opencode auth login`
4. Re-enable HTTPS-Only Mode after authentication completes

**Solution 3: Manual Callback Extraction (Advanced)**

When Safari shows an error, the address bar contains `?code=...&scope=...`, and you can manually extract the callback parameters. See [issue #119](https://github.com/NoeFabris/opencode-antigravity-auth/issues/119) for details.

### Port Already in Use

**Error Message**: `Address already in use`

**Cause**: The OAuth callback server defaults to `localhost:51121`. If this port is occupied, it cannot start.

**Solutions**:

**macOS / Linux:**
```bash
# Find the process occupying the port
lsof -i :51121

# Kill the process (replace <PID> with actual process ID)
kill -9 <PID>

# Re-authenticate
opencode auth login
```

**Windows:**
```powershell
# Find the process occupying the port
netstat -ano | findstr :51121

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F

# Re-authenticate
opencode auth login
```

### WSL2 / Docker / Remote Development Environments

**Problem**: OAuth callback requires the browser to access `localhost` where OpenCode is running, but this is not directly accessible in container or remote environments.

**WSL2 Solution**:
- Use VS Code's port forwarding
- Or configure Windows → WSL port forwarding

**SSH / Remote Development Solution**:
```bash
# Establish an SSH tunnel to forward remote port 51121 to local
ssh -L 51121:localhost:51121 user@remote-host
```

**Docker / Container Solution**:
- Cannot use localhost callback inside containers
- Use manual URL flow after waiting 30 seconds
- Or use SSH port forwarding

### Multi-Account Authentication Issues

**Symptoms**: Multiple account authentication failures or confusion.

**Solutions**:
1. Delete account file: `rm ~/.config/opencode/antigravity-accounts.json`
2. Re-authenticate: `opencode auth login`
3. Ensure each account uses a different Google email

---

## Token Refresh Issues

### invalid_grant Error

**Error Message**:
```
Error: invalid_grant
Token has been revoked or expired.
```

**Causes**:
- Google account password changed
- Account security event (e.g., suspicious login)
- `refresh_token` invalidated

**Solutions**:
```bash
# Delete account file
rm ~/.config/opencode/antigravity-accounts.json

# Re-authenticate
opencode auth login
```

### Token Expiration

**Symptoms**: Errors occur when calling models again after a period of non-use.

**Cause**: `access_token` validity is about 1 hour, and `refresh_token` has a longer validity but also expires.

**Solutions**:
- The plugin automatically refreshes tokens 30 minutes before expiration, no manual action required
- If automatic refresh fails, re-authenticate: `opencode auth login`

---

## Permission Errors

### 403 Permission Denied (rising-fact-p41fc)

**Error Message**:
```
Permission 'cloudaicompanion.companions.generateChat' denied on resource
'//cloudaicompanion.googleapis.com/projects/rising-fact-p41fc/locations/global'
```

**Cause**: When the plugin cannot find a valid project, it falls back to a default Project ID (e.g., `rising-fact-p41fc`). This works for Antigravity models but fails for Gemini CLI models because Gemini CLI requires a GCP project in your own account.

**Solutions**:

**Step 1: Create or Select a GCP Project**

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Note the project ID (e.g., `my-gemini-project`)

**Step 2: Enable Gemini for Google Cloud API**

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Gemini for Google Cloud API" (`cloudaicompanion.googleapis.com`)
3. Click "Enable"

**Step 3: Add projectId to Account File**

Edit `~/.config/opencode/antigravity-accounts.json`:

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "your@gmail.com",
      "refreshToken": "...",
      "projectId": "my-gemini-project"
    }
  ]
}
```

::: warning Multi-Account Configuration
If multiple Google accounts are configured, each account needs a corresponding `projectId` added.
:::

---

## Rate Limiting Issues

### All Accounts Rate Limited (But Quota Available)

**Symptoms**:
- Message "All accounts rate-limited" appears
- Quota appears sufficient, but new requests cannot be initiated
- Newly added accounts are immediately rate limited

**Cause**: This is a cascading bug in hybrid mode (`clearExpiredRateLimits()`), fixed in recent beta versions.

**Solutions**:

**Solution 1: Update to Latest Beta Version**
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Solution 2: Delete Account File and Re-Authenticate**
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**Solution 3: Switch Account Selection Strategy**
Edit `~/.config/opencode/antigravity.json`, change strategy to `sticky`:
```json
{
  "account_selection_strategy": "sticky"
}
```

### 429 Too Many Requests

**Symptoms**:
- Requests frequently return 429 errors
- Message "Rate limit exceeded" appears

**Causes**: Google has significantly tightened quota and rate limit enforcement. All users are affected, not just this plugin. Key factors:

1. **Stricter Enforcement**: Even if quota "appears available," Google may throttle or soft-ban accounts that trigger abuse detection
2. **OpenCode's Request Pattern**: OpenCode makes more API calls than native apps (tool calls, retries, streaming, multi-turn conversation chains), which triggers limits faster than "normal" usage
3. **Shadow Bans**: Some accounts, once flagged, remain unusable for extended periods while other accounts continue working

::: danger Usage Risk
Using this plugin may increase the chance of triggering automatic abuse/rate limit protections. Upstream providers may limit, suspend, or terminate access at their discretion. **Use at your own risk**.
:::

**Solutions**:

**Solution 1: Wait for Reset (Most Reliable)**

Rate limits usually reset after a few hours. If problems persist:
- Stop using the affected account for 24-48 hours
- Use other accounts during this period
- Check `rateLimitResetTimes` in the account file to see when limits expire

**Solution 2: "Warm Up" Accounts in Antigravity IDE (Community Experience)**

Users report this method works:
1. Open [Antigravity IDE](https://idx.google.com/) directly in a browser
2. Log in with the affected Google account
3. Run a few simple prompts (e.g., "Hello", "What is 2+2")
4. After 5-10 successful prompts, try using the account with the plugin again

**How it works**: Using the account through the "official" interface may reset some internal flags or make the account appear less suspicious.

**Solution 3: Reduce Request Volume and Burstiness**

- Use shorter sessions
- Avoid parallel/retry-intensive workflows (e.g., generating multiple sub-agents simultaneously)
- If using oh-my-opencode, consider reducing concurrent agent generation count
- Set `max_rate_limit_wait_seconds: 0` to fail fast instead of retrying

**Solution 4: Use Antigravity IDE Directly (Single-Account Users)**

If you only have one account, using [Antigravity IDE](https://idx.google.com/) directly may provide a better experience since OpenCode's request pattern triggers limits faster.

**Solution 5: New Account Setup**

If adding a new account:
1. Delete account file: `rm ~/.config/opencode/antigravity-accounts.json`
2. Re-authenticate: `opencode auth login`
3. Update to latest beta: `"plugin": ["opencode-antigravity-auth@beta"]`
4. Consider "warming up" the account in Antigravity IDE first

**Information to Report**:

If you encounter abnormal rate limiting behavior, please share in [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues):
- Status codes from debug logs (403, 429, etc.)
- Duration of rate limit status
- Number of accounts and selection strategy in use

### Request Hangs (No Response)

**Symptoms**:
- Prompts hang without returning
- Logs show 200 OK, but no response content

**Cause**: Usually Google's silent throttling or soft-ban.

**Solutions**:
1. Stop the current request (Ctrl+C or ESC)
2. Wait 24-48 hours before using the account again
3. Use other accounts during this period

---

## Session Recovery Issues

### Error After Tool Execution Interruption

**Symptoms**: Pressing ESC to interrupt tool execution, subsequent conversations report `tool_result_missing`.

**Solutions**:
1. Type `continue` in the conversation to trigger automatic recovery
2. If blocked, use `/undo` to revert to the state before the error
3. Retry the operation

::: tip Automatic Recovery
Plugin session recovery is enabled by default. If tool execution is interrupted, it automatically injects a synthetic `tool_result` and attempts recovery.
:::

---

## Plugin Compatibility Issues

### Conflict with oh-my-opencode

**Issue**: oh-my-opencode includes built-in Google authentication, which conflicts with this plugin.

**Solution**: Disable built-in authentication in `~/.config/opencode/oh-my-opencode.json`:
```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Parallel Agents Issue**: When generating parallel sub-agents, multiple processes may hit the same account. **Solution**:
- Enable `pid_offset_enabled: true` (configure in `antigravity.json`)
- Or add more accounts

### Conflict with @tarquinen/opencode-dcp

**Issue**: DCP creates synthetic assistant messages missing thought blocks, conflicting with this plugin.

**Solution**: **List this plugin before DCP**:
```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

### Other gemini-auth Plugins

**Issue**: Installing other Google Gemini authentication plugins causes conflicts.

**Solution**: You don't need them. This plugin already handles all Google OAuth authentication. Uninstall other gemini-auth plugins.

---

## Configuration Issues

### Configuration Key Spelling Error

**Error Message**: `Unrecognized key: "plugins"`

**Cause**: Using the wrong key name.

**Solution**: The correct key is `plugin` (singular):
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Not** `"plugins"` (plural), which causes an "Unrecognized key" error.

### Model Not Found

**Symptoms**: Error "Model not found" or 400 error when using models.

**Solution**: Add to `google` provider configuration:
```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

---

## Migration Issues

### Migrating Accounts Between Machines

**Issue**: After copying `antigravity-accounts.json` to a new machine, get "API key missing" error.

**Solutions**:
1. Ensure plugin is installed: `"plugin": ["opencode-antigravity-auth@beta"]`
2. Copy `~/.config/opencode/antigravity-accounts.json` to the same path on the new machine
3. If error persists, `refresh_token` may have expired → re-authenticate: `opencode auth login`

---

## Debugging Tips

### Enable Debug Logs

**Basic Logs**:
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

**Verbose Logs** (full request/response):
```bash
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode
```

Log file location: `~/.config/opencode/antigravity-logs/`

### Check Rate Limit Status

View the `rateLimitResetTimes` field in the account file:
```bash
cat ~/.config/opencode/antigravity-accounts.json | grep rateLimitResetTimes
```

---

## Checkpoint ✅

After troubleshooting, you should be able to:

- [ ] Correctly understand configuration file paths (`~/.config/opencode/`)
- [ ] Resolve Safari OAuth callback failure issues
- [ ] Handle invalid_grant and 403 errors
- [ ] Understand rate limiting causes and response strategies
- [ ] Resolve conflicts with oh-my-opencode
- [ ] Enable debug logs to locate issues

---

## Pitfall Reminders

### Don't Commit Account Files to Version Control

`antigravity-accounts.json` contains OAuth refresh tokens, equivalent to password files. The plugin automatically creates `.gitignore`, but ensure your `.gitignore` includes:
```
~/.config/opencode/antigravity-accounts.json
```

### Avoid Frequent Retries

After triggering 429 limits, don't repeatedly retry. Wait before trying again, or you may be flagged for abuse.

### Pay Attention to projectId When Setting Up Multiple Accounts

If using Gemini CLI models, **each account** needs its own `projectId` configured. Don't use the same project ID.

---

## Lesson Summary

This lesson covered the most common authentication and account issues with the Antigravity Auth plugin:

1. **OAuth Authentication Issues**: Safari callback failure, port occupied, WSL2/Docker environments
2. **Token Refresh Issues**: invalid_grant, token expiration
3. **Permission Errors**: 403 Permission Denied, missing projectId
4. **Rate Limiting Issues**: 429 errors, shadow bans, all-accounts rate limited
5. **Plugin Compatibility**: oh-my-opencode, DCP conflicts
6. **Configuration Issues**: Spelling errors, model not found

When encountering issues, first try the **quick reset** (delete account file and re-authenticate), which resolves 90% of cases. If problems persist, enable debug logs for detailed information.

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Model Not Found Troubleshooting](../model-not-found/)**.
>
> You'll learn:
> - Gemini 3 model 400 errors (Unknown name 'parameters')
> - Tool Schema incompatibility issues
> - Diagnosis methods for MCP server-induced errors
> - How to locate problem sources through debugging

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| OAuth Authentication (PKCE) | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts) | 91-270 |
| Token Validation and Refresh | [`src/plugin/auth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/auth.ts) | 1-53 |
| Account Storage and Management | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-715 |
| Rate Limit Detection | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 9-75 |
| Session Recovery | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | 1-150 |
| Debug Log System | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 1-300 |

**Key Constants**:
- `OAUTH_PORT = 51121`: OAuth callback server port (`constants.ts:25`)
- `CLIENT_ID`: OAuth client ID (`constants.ts:4`)
- `TOKEN_EXPIRY_BUFFER = 30 * 60 * 1000`: Refresh 30 minutes before token expiration (`auth.ts:33`)

**Key Functions**:
- `authorizeAntigravity()`: Start OAuth authentication flow (`oauth.ts:91`)
- `exchangeAntigravity()`: Exchange authorization code for tokens (`oauth.ts:209`)
- `refreshAccessToken()`: Refresh expired access token (`oauth.ts:263`)
- `isOAuthAuth()`: Check if authentication type is OAuth (`auth.ts:5`)
- `accessTokenExpired()`: Check if token is about to expire (`auth.ts:33`)
- `markRateLimitedWithReason()`: Mark account as rate limited (`accounts.ts:9`)
- `detectErrorType()`: Detect recoverable error types (`recovery/index.ts`)

</details>
