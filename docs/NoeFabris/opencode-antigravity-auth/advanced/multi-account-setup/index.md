---
title: "Multi-Account: Quota Pooling | opencode-antigravity-auth"
sidebarTitle: "Multi-Account"
subtitle: "Multi-Account: Quota Pooling"
description: "Learn how to configure multiple Google accounts for quota pooling and load balancing. This tutorial covers account addition, dual quota system, selection strategies, and troubleshooting."
tags:
  - "advanced"
  - "multi-account"
  - "load-balancing"
  - "quota-management"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
order: 4
---

# Multi-Account Setup: Quota Pooling and Load Balancing

## What You'll Learn

- Add multiple Google accounts to increase overall quota limits
- Understand the dual quota system to effectively utilize Antigravity and Gemini CLI quota pools
- Choose the appropriate load balancing strategy based on account count and use case
- Troubleshoot common issues in multi-account configuration

## Your Current Challenge

When using a single account, you may encounter these pain points:

- Frequently encountering 429 rate limit errors, forcing you to wait for quota recovery
- Excessive concurrent requests during development/testing that a single account can't handle
- After exhausting quota for Gemini 3 Pro or Claude Opus models, you can only wait until the next day
- Intense competition between accounts when running multiple OpenCode instances or oh-my-opencode parallel agents

## When to Use This

Multi-account configuration is suitable for the following scenarios:

| Scenario | Recommended Accounts | Reason |
|--- | --- | ---|
| Personal Development | 2-3 accounts | Backup accounts to avoid interruptions |
| Team Collaboration | 3-5 accounts | Distribute requests, reduce competition |
| High-Frequency API Calls | 5+ accounts | Load balancing for maximum throughput |
| Parallel Agents | 3+ accounts + PID offset | Independent account per agent |

::: warning Prerequisites Check

Before starting this tutorial, ensure you have completed:
- ✅ Installed the opencode-antigravity-auth plugin
- ✅ Successfully authenticated via OAuth and added your first account
- ✅ Can make requests using Antigravity models

[Quick Install Tutorial](../../start/quick-install/) | [First Login Tutorial](../../start/first-auth-login/)

:::

## Core Approach

The core mechanism of multi-account configuration:

1. **Quota Pooling**: Each Google account has independent quota. Multiple accounts' quotas stack to form a larger total pool
2. **Load Balancing**: The plugin automatically selects available accounts and switches to the next one when encountering rate limits
3. **Dual Quota System** (Gemini only): Each account can access two independent quota pools: Antigravity and Gemini CLI
4. **Intelligent Recovery**: Rate limit deduplication (2-second window) + exponential backoff to avoid invalid retries

**Quota Calculation Example**:

Assuming each account's Claude quota is 1000 requests/minute:

| Accounts | Theoretical Total Quota | Practical Available (considering caching) |
|--- | --- | ---|
| 1        | 1000/min               | 1000/min                                 |
| 3        | 3000/min               | ~2500/min (sticky strategy)             |
| 5        | 5000/min               | ~4000/min (round-robin)                 |

> 💡 **Why does the sticky strategy have lower practical quota?**
>
> The sticky strategy keeps using the same account until rate limited, causing other accounts' quotas to remain idle. However, the benefit is that it preserves Anthropic's prompt cache, improving response speed.

## Follow Along

### Step 1: Add a Second Account

**Why**
After adding a second account, when the primary account encounters a rate limit, the plugin will automatically switch to the backup account, avoiding request failures.

**How**

Run the OAuth login command:

```bash
opencode auth login
```

If you already have an account, you'll see the following prompt:

```
1 account(s) saved:
  1. user1@gmail.com

(a)dd new account(s) or (f)resh start? [a/f]:
```

Enter `a` and press Enter. The browser will automatically open the Google authorization page.

**You should see**:

1. Browser opens the Google OAuth authorization page
2. Select or log in to your second Google account
3. After granting authorization, the terminal displays:

```
Account added successfully!

2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

::: tip

If the browser doesn't open automatically, copy the OAuth URL displayed in the terminal and manually paste it into the browser.

:::

### Step 2: Verify Multi-Account Status

**Why**
Confirm that accounts have been added correctly and are available.

**How**

View the account storage file:

```bash
cat ~/.config/opencode/antigravity-accounts.json
```

**You should see**:

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//0abc...",
      "projectId": "project-id-123",
      "addedAt": 1737609600000,
      "lastUsed": 1737609600000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "1//0xyz...",
      "addedAt": 1737609700000,
      "lastUsed": 1737609700000
    }
  ],
  "activeIndex": 0,
  "activeIndexByFamily": {
    "claude": 0,
    "gemini": 0
  }
}
```

::: warning Security Reminder

`antigravity-accounts.json` contains OAuth refresh tokens, equivalent to password files. Do not commit to version control systems.

:::

### Step 3: Test Account Switching

**Why**
Verify that multi-account load balancing is working correctly.

**How**

Send multiple concurrent requests to trigger rate limiting:

```bash
# macOS/Linux
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait

# Windows PowerShell
1..10 | ForEach-Object {
  Start-Process -FilePath "opencode" -ArgumentList "run","Test $_","--model=google/antigravity-claude-sonnet-4-5"
}
```

**You should see**:

1. First N requests use account 1 (user1@gmail.com)
2. After encountering 429, automatically switch to account 2 (user2@gmail.com)
3. If notifications are enabled, you'll see a "Switched to account 2" toast notification

::: info Account Switching Notification

If `quiet_mode: false` is enabled (default), the plugin displays account switching notifications. The first switch shows the email address, subsequent switches only show the account index.

:::

### Step 4: Configure Dual Quota System (Gemini Only)

**Why**
After enabling dual quota fallback, when Antigravity quota is exhausted, the plugin will automatically attempt the Gemini CLI quota without switching accounts.

**How**

Edit the plugin configuration file:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Add the following configuration:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "quota_fallback": true
}
```

Save the file and restart OpenCode.

**You should see**:

1. When using Gemini models, the plugin prioritizes Antigravity quota
2. When Antigravity returns 429, it automatically switches to the same account's Gemini CLI quota
3. If both quotas are rate limited, it switches to the next account

::: tip Dual Quota vs Multi-Account

- **Dual Quota**: Two independent quota pools for the same account (Antigravity + Gemini CLI)
- **Multi-Account**: Stacked quota pools from multiple accounts
- Best Practice: Enable dual quota first, then add multiple accounts

:::

### Step 5: Choose Account Selection Strategy

**Why**
Different account counts and use cases require different strategies to achieve optimal performance.

**How**

Configure the strategy in `antigravity.json`:

```json
{
  "account_selection_strategy": "hybrid"
}
```

Choose based on your account count:

| Accounts | Recommended Strategy | Configuration Value | Reason |
|--- | --- | --- | ---|
| 1        | sticky               | `"sticky"`          | Maintain prompt cache |
| 2-5      | hybrid               | `"hybrid"`          | Balance throughput and cache |
| 5+       | round-robin          | `"round-robin"`     | Maximize throughput |

**Strategy Details**:

- **sticky** (default for single account): Keeps using the same account until rate limited, suitable for single development sessions
- **round-robin**: Rotates to the next account for each request, maximizing throughput but sacrificing cache
- **hybrid** (default for multi-account): Comprehensive decision based on health score + Token bucket + LRU

**You should see**:

1. Using `hybrid` strategy, the plugin automatically selects the currently optimal account
2. Using `round-robin` strategy, requests are evenly distributed across all accounts
3. Using `sticky` strategy, the same account is always used within the same session

### Step 6: Enable PID Offset (Parallel Agents Scenario)

**Why**
When running multiple OpenCode instances or oh-my-opencode parallel agents, different processes might select the same account, causing competition.

**How**

Add to `antigravity.json`:

```json
{
  "pid_offset_enabled": true
}
```

Save and restart OpenCode.

**You should see**:

1. Different processes (different PIDs) start from different account indices
2. Reduced account competition between parallel agents
3. Improved overall throughput

::: tip How PID Offset Works

PID offset maps process IDs to account offsets, for example:
- PID 100 → Offset 0 → Start from account 0
- PID 101 → Offset 1 → Start from account 1
- PID 102 → Offset 2 → Start from account 2

:::

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Add multiple Google accounts via `opencode auth login`
- [ ] See multiple account records in `antigravity-accounts.json`
- [ ] Plugin automatically switches to the next account when encountering rate limits
- [ ] Dual quota fallback is enabled for Gemini models
- [ ] Appropriate account selection strategy is chosen based on account count
- [ ] PID offset is enabled for parallel agent scenarios

## Common Pitfalls

### All Accounts Rate Limited

**Symptoms**: All accounts show 429 errors, unable to continue requests

**Causes**: Quota exhausted or excessive concurrent requests

**Solutions**:

1. Wait for rate limits to automatically reset (usually 1-5 minutes)
2. If issues persist long-term, add more accounts
3. Check `max_rate_limit_wait_seconds` in configuration and set a reasonable wait limit

### Excessive Account Switching

**Symptoms**: Switching accounts on every request, not using the same account

**Causes**: Inappropriate strategy selection or abnormal health scores

**Solutions**:

1. Change strategy to `sticky`
2. Check `health_score` configuration, adjust `min_usable` and `rate_limit_penalty`
3. Confirm there are no frequent 429 errors causing accounts to be marked as unhealthy

### Gemini CLI Permission Error (403)

**Symptoms**: `Permission denied` error when using Gemini CLI models

**Causes**: Account lacks a valid Project ID

**Solutions**:

1. Manually add `projectId` for each account:

```json
{
  "accounts": [
    {
      "email": "your@email.com",
      "refreshToken": "...",
      "projectId": "your-project-id"
    }
  ]
}
```

2. Ensure [Gemini for Google Cloud API](https://console.cloud.google.com/) is enabled in Google Cloud Console

### Invalid Token (invalid_grant)

**Symptoms**: Account is automatically removed with `invalid_grant` error

**Causes**: Google account password change, security event, or token expiration

**Solutions**:

1. Delete the invalid account and re-authenticate:

```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

2. If this occurs frequently, consider using a more stable Google account

## Summary

- Multi-account configuration can increase overall quota limits and system stability
- Adding accounts is very simple—just run `opencode auth login` repeatedly
- The dual quota system doubles the available quota for each Gemini account
- Account selection strategy should be adjusted based on account count and use case
- PID offset is critical for parallel agent scenarios

## Next Lesson Preview

> In the next lesson, we'll learn **[Account Selection Strategies](../account-selection-strategies/)**.
>
> You'll learn:
> - Detailed working principles of sticky, round-robin, and hybrid strategies
> - How to choose the optimal strategy based on scenarios
> - Tuning methods for health scores and Token bucket

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| AccountManager class | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L174-L250) | 174-250 |
| Load Balancing Strategy | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts) | Full file |
| Configuration Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | Full file |
| Account Storage | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts) | Full file |

**Key Constants**:

| Constant Name | Value | Description |
|--- | --- | ---|
| `QUOTA_EXHAUSTED_BACKOFFS` | `[60000, 300000, 1800000, 7200000]` | Quota exhausted backoff times (1min→5min→30min→2hrs) |
| `RATE_LIMIT_EXCEEDED_BACKOFF` | `30000` | Rate limit backoff time (30 seconds) |
| `MIN_BACKOFF_MS` | `2000` | Minimum backoff time (2 seconds) |

**Key Functions**:

- `calculateBackoffMs(reason, consecutiveFailures, retryAfterMs)`: Calculate backoff delay
- `getQuotaKey(family, headerStyle, model)`: Generate quota key (supports model-level rate limiting)
- `isRateLimitedForQuotaKey(account, key)`: Check if a specific quota key is rate limited
- `selectHybridAccount(accounts, family)`: Hybrid strategy account selection logic

**Configuration Items** (from schema.ts):

| Configuration Item | Type | Default Value | Description |
|--- | --- | --- | ---|
| `account_selection_strategy` | enum | `"hybrid"` | Account selection strategy |
| `quota_fallback` | boolean | `false` | Enable Gemini dual quota fallback |
| `pid_offset_enabled` | boolean | `false` | Enable PID offset |
| `switch_on_first_rate_limit` | boolean | `true` | Switch immediately on first rate limit |

</details>
