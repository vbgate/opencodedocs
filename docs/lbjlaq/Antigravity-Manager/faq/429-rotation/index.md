---
title: "429: 账号轮转 | Antigravity-Manager"
sidebarTitle: "429 轮转"
subtitle: "429: 账号轮转"
description: "学习 Antigravity-Manager 的 429 错误处理。了解配额耗尽、速率限制和模型容量不足的区分，掌握账号轮转机制和监控工具使用。"
tags:
  - "FAQ"
  - "Troubleshooting"
  - "Account Scheduling"
  - "429 Error"
prerequisite:
  - "start-getting-started"
  - "advanced-scheduling"
order: 999
---

# 429/Capacity Errors: Correct Expectations for Account Rotation and Model Capacity Myths

## What You'll Learn

- Correctly distinguish between "quota exhaustion" and "upstream rate limiting" to avoid misdiagnosis
- Understand Antigravity Tools' automatic rotation mechanism and expected behavior
- Know how to quickly pinpoint issues and optimize configuration when encountering 429 errors

## Your Current Struggles

- Seeing a 429 error and mistakenly assuming "the model is out of capacity"
- Having multiple accounts configured but still frequently encountering 429, unsure if it's a configuration or account issue
- Unclear when the system automatically switches accounts versus when it "gets stuck"

## Core Approach

### What is a 429 Error?

**429 Too Many Requests** is an HTTP status code. In Antigravity Tools, 429 doesn't just mean "requests too frequent"—it can also be a signal like "you can't use this temporarily" due to quota exhaustion, temporary model overload, and similar issues.

::: info The proxy attempts to identify the cause of 429

The proxy tries to parse `error.details[0].reason` or `error.message` from the response body, roughly categorizing 429 into several types (actual classification depends on the returned data):

| Type identified by proxy | Common reason / clues | Typical characteristics |
|--- | --- | ---|
| **Quota exhausted** | `QUOTA_EXHAUSTED` / Text contains `exhausted`, `quota` | May need to wait for quota to refresh |
| **Rate limited** | `RATE_LIMIT_EXCEEDED` / Text contains `per minute`, `rate limit`, `too many requests` | Usually cooldown at the tens-of-seconds level |
| **Model capacity insufficient** | `MODEL_CAPACITY_EXHAUSTED` / Text contains `model_capacity` | Commonly temporary overload, recoverable shortly |
| **Unknown** | Cannot parse | Follows default cooldown strategy |

:::

### Antigravity Tools' Automatic Handling

When a request encounters 429 (and some 5xx/overload statuses), the proxy typically does two things on the server side:

1. **Record cooldown time**: Writes this error to `RateLimitTracker`, and when selecting accounts subsequently, it will actively avoid accounts that are "still cooling down."
2. **Rotate accounts in retries**: Handlers perform multiple attempts within a single request, and when retrying, will use `force_rotate=true`, triggering TokenManager to select the next available account.

::: tip How do you know if it switched accounts?
Even if your request body doesn't change, the response usually includes `X-Account-Email` (as well as `X-Mapped-Model`), which you can use to verify "which account this request actually used."
:::

## When Do You Encounter 429 Errors?

### Scenario 1: Single Account Requests Too Fast

**Phenomenon**: Even with only one account, sending a large number of requests in a short time triggers 429.

**Cause**: Each account has its own rate limit (RPM/TPM); exceeding it results in throttling.

**Solution**:
- Increase the number of accounts
- Lower request frequency
- Use fixed account mode to distribute pressure (see "Fixed Account Mode" for details)

### Scenario 2: All Accounts Rate-Limited Simultaneously

**Phenomenon**: Multiple accounts exist, but all return 429.

**Causes**:
- Total account count is insufficient to support your request frequency
- All accounts trigger rate limiting/overload at nearly the same time

**Solution**:
- Add more accounts
- Adjust scheduling mode to "PerformanceFirst" (skip sticky sessions and 60s window reuse)
- Check if quota protection mistakenly excludes available accounts

### Scenario 3: Account Mistakenly Blocked by Quota Protection

**Phenomenon**: An account has sufficient quota, but the system keeps skipping it.

**Causes**:
- **Quota protection** is enabled, and the threshold is set too high
- That account's specific model quota is below the threshold
- The account is manually marked as `proxy_disabled`

**Solution**:
- Check quota protection settings (Settings → Quota Protection), adjust thresholds and monitored models according to your usage intensity
- In account data, check `protected_models` to confirm if it's being skipped by protection policy

## Follow Me

### Step 1: Identify the 429 Error Type

**Why**: Different types of 429 errors require different handling approaches.

Check the response body of the 429 error in Proxy Monitor, focusing on two types of information:

- **Reason**: `error.details[0].reason` (e.g., `RATE_LIMIT_EXCEEDED`, `QUOTA_EXHAUSTED`) or `error.message`
- **Wait time**: `RetryInfo.retryDelay` or `details[0].metadata.quotaResetDelay` (if present)

```json
{
  "error": {
    "details": [
      {
        "reason": "RATE_LIMIT_EXCEEDED",
        "metadata": {
          "quotaResetDelay": "42s"
        }
      }
    ]
  }
}
```

**You should see**:
- If the response body contains wait time (e.g., `RetryInfo.retryDelay` or `quotaResetDelay`), the proxy typically waits a short period before retrying.
- If there's no wait time, the proxy adds a "cooldown period" to this account according to built-in strategy and directly switches to the next account during retry.

### Step 2: Check Account Scheduling Configuration

**Why**: Scheduling configuration directly affects account rotation frequency and priority.

Go to the **API Proxy** page and view scheduling strategy:

| Configuration | Description | Default/Suggested |
|--- | --- | ---|
| **Scheduling Mode** | Scheduling mode | `Balance` (default) |
| **Preferred Account** | Fixed account mode | Unchecked (default) |

**Scheduling Mode Comparison**:

| Mode | Account Reuse Strategy | Rate Limit Handling | Applicable Scenarios |
|--- | --- | --- | ---|
| **CacheFirst** | Enables sticky sessions and 60s window reuse | **Prioritizes waiting**, greatly improving Prompt Caching hit rate | Conversational/high cache hit rate requirements |
| **Balance** | Enables sticky sessions and 60s window reuse | **Immediately switches** to backup accounts, balancing success rate and performance | General scenarios, default |
| **PerformanceFirst** | Skips sticky sessions and 60s window reuse, pure round-robin | Immediately switches, most balanced account load | High concurrency, stateless requests |

::: tip CacheFirst vs Balance Mode
If you use Prompt Caching and want to improve cache hit rates, choose `CacheFirst` — when rate limited, it prioritizes waiting rather than immediately switching accounts. If you value request success rate more than caching, choose `Balance` — when rate limited, it immediately switches accounts.
:::

::: tip PerformanceFirst Mode
If your requests are stateless (like image generation, independent queries), try `PerformanceFirst`. It skips sticky sessions and 60s window reuse, making consecutive requests more likely to land on different accounts.
:::

### Step 3: Verify Account Rotation Is Working Correctly

**Why**: Confirm the system can automatically switch accounts.

**Method 1: Check Response Headers**

Use curl or your own client to print response headers, observe whether `X-Account-Email` changes.

**Method 2: View Logs**

Open the log file (depending on your system location), search for `🔄 [Token Rotation]`:

```
🔄 [Token Rotation] Accounts: [
  "account1@example.com(protected=[])",
  "account2@example.com(protected=[])",
  "account3@example.com(protected=[])"
]
```

**Method 3: Use Proxy Monitor**

On the **Monitor** page, check request logs, focusing on:
- Whether the **Account** field switches between different accounts
- After requests with **Status** 429, whether successful requests use different accounts

**You should see**:
- When an account returns 429, subsequent requests automatically switch to other accounts
- If you see multiple requests using the same account and all failing, it might be a scheduling configuration issue

### Step 4: Optimize Account Priority

**Why**: Make the system prioritize high quota/high tier accounts to reduce 429 probability.

In TokenManager, the system performs a sort on the account pool before selecting accounts (will print `🔄 [Token Rotation] Accounts: ...`):

1. **Subscription tier priority**: ULTRA > PRO > FREE
2. **Quota percentage priority**: Within the same tier, higher quota comes first
3. **Sort entry**: This sorting happens on the proxy side. Which account is ultimately used depends on proxy-side sorting + availability judgment.

::: info Smart Sorting Principle (Proxy Side)
Priority is `ULTRA > PRO > FREE`; within the same subscription tier, descending by `remaining_quota` (account's maximum remaining quota percentage).
:::

**Actions**:
- Drag accounts to adjust display order (optional)
- Refresh quota (Accounts → Refresh All Quota)
- Check account subscription tiers and quota

## Pitfall Reminders

### ❌ Mistake 1: Mistaking 429 for "Model Out of Capacity"

**Phenomenon**: Seeing a 429 error and assuming the model is out of capacity.

**Correct Understanding**:
- 429 is **rate limiting**, not a capacity issue
- Adding more accounts can reduce 429 probability
- Adjusting scheduling mode can improve switch speed

### ❌ Mistake 2: Quota Protection Threshold Set Too High

**Phenomenon**: Quota is sufficient but the system keeps skipping accounts.

**Cause**: Quota Protection adds models below the threshold to the account's `protected_models`, and the proxy skips "protected models" during scheduling. When the threshold is too high, available accounts may be overly excluded.

**Fix**:
- Go back to **Settings → Quota Protection**, adjust monitored models and thresholds
- If you want to know exactly which models it's protecting, check `protected_models` in account data

### ❌ Mistake 3: Fixed Account Mode Prevents Rotation

**Phenomenon**: Set `Preferred Account`, but when that account is rate limited, the system "gets stuck."

**Cause**: In fixed account mode, the system prioritizes using the specified account, only falling back to round-robin when the account is unavailable.

**Fix**:
- If you don't need a fixed account, clear `Preferred Account`
- Or ensure the fixed account has sufficient quota to avoid rate limiting

## Checkpoints ✅

- [ ] Can distinguish between quota exhaustion and upstream rate limiting
- [ ] Know how to view 429 error details in Proxy Monitor
- [ ] Understand the differences and use cases for the three scheduling modes
- [ ] Know how to check if account rotation is working correctly
- [ ] Can optimize account priority and check quota protection policies

## FAQ

### Q1: Why do I still encounter 429 even with multiple accounts?

A: Possible reasons:
1. All accounts triggered rate limiting simultaneously (request frequency too high)
2. Consecutive requests repeatedly reuse the same account under "60s window reuse", more likely to hit rate limits on a single account
3. Quota protection incorrectly excludes available accounts
4. Total account count is insufficient to support your request frequency

**Solutions**:
- Add more accounts
- Use `PerformanceFirst` mode
- Check if Quota Protection added the models you want to use to `protected_models` (adjust monitored models and thresholds if necessary)
- Lower request frequency

### Q2: Do 429 errors automatically retry?

A: Yes, they automatically retry within a single request. **Retry limit is typically 3 times**, calculated as `min(3, account pool size)`, with at least 1 attempt.

**Retry Count Examples**:
- Account pool 1 account → Attempt 1 time (no retry)
- Account pool 2 accounts → Attempt 2 times (retry 1 time)
- Account pool 3 or more accounts → Attempt 3 times (retry 2 times)

**Rough Flow**:
1. Record rate limit/overload information (enter `RateLimitTracker`)
2. If wait time can be parsed (e.g., `RetryInfo.retryDelay` / `quotaResetDelay`), wait a short period before continuing
3. During retry, force rotate account (when `attempt > 0`, `force_rotate=true`), attempting to initiate upstream request with the next available account

If all attempts fail, the proxy returns the error to the client. Meanwhile, you can still see the actually used accounts from response headers (like `X-Account-Email`) or Proxy Monitor.

### Q3: How do I check how long an account has been rate limited?

A: Two methods:

**Method 1**: Check logs, search for `rate-limited`

```
🔒 [FIX #820] Preferred account xxx@gmail.com is rate-limited, falling back to round-robin
```

**Method 2**: Logs show remaining wait time

```
All accounts are currently limited. Please wait 30s.
```

### Q4: Are quota protection and rate limiting the same thing?

A: No.

| Feature | Quota Protection | Rate Limit Tracking |
|--- | --- | ---|
| **Trigger Condition** | Model quota below threshold | Received 429 error |
| **Scope** | Specific models | Entire account |
| **Duration** | Until quota recovers | Determined by upstream (usually seconds to minutes) |
| **Behavior** | Skip that model | Skip that account |

### Q5: How do I force immediate account switching?

A: Approach it from "making the next request more likely to switch":

1. **Scheduling level**: Switch to `PerformanceFirst`, skip sticky sessions and 60s window reuse
2. **Fixed account**: If `Preferred Account` is enabled, clear it first, otherwise it will prioritize the fixed account (until it's rate limited/protected)
3. **Account pool**: Increase account count, making it easier to find an alternative account when one is rate limited

Within a single request, the proxy also force rotates during retries (when `attempt > 0`, it triggers `force_rotate=true`), but retry count is limited by an upper bound.

## Lesson Summary

- In Antigravity Tools, 429 is a category of "upstream temporarily unavailable" signals, possibly caused by rate limiting, quota exhaustion, model capacity insufficiency, etc.
- The proxy records cooldown time and attempts to rotate accounts during retries within a single request (but retry count is limited)
- Scheduling mode, Quota Protection, and account count all affect the probability of encountering 429 and recovery speed
- Use Proxy Monitor, response header `X-Account-Email`, and logs to quickly pinpoint issues

## Next Lesson Preview

> In the next lesson, we'll learn **[404/Path Incompatibility: Base URL, /v1 Prefix & Stacked Path Clients](../404-base-url/)**
>
> You'll learn:
> - How the most common integration error (404) occurs
> - Different clients' base_url concatenation differences
> - How to quickly fix 404 issues

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| 429 retry delay parsing (RetryInfo / quotaResetDelay) | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L38-L67) | 38-67 |
| Duration parsing utility | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L11-L35) | 11-35 |
| Scheduling mode enum (CacheFirst/Balance/PerformanceFirst) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L12) | 3-12 |
| Rate limit reason parsing and default cooldown strategy | [`src-tauri/src/proxy/rate_limit.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/rate_limit.rs#L5-L258) | 5-258 |
| MAX_RETRY_ATTEMPTS constant definition (OpenAI handler) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L14) | 14 |
| Retry count calculation (max_attempts = min(MAX_RETRY_ATTEMPTS, pool_size)) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L830) | 830 |
| OpenAI handler: mark rate limit and retry/rotate on 429/5xx | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L349-L389) | 349-389 |
| Account sorting priority (ULTRA > PRO > FREE + remaining_quota) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L504-L538) | 504-538 |
| 60s window reuse + avoid rate limit/quota protection | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L624-L739) | 624-739 |
| Rate limit record entry (mark_rate_limited) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1089-L1113) | 1089-1113 |
|--- | --- | ---|

**Key Constants**:
- `MAX_RETRY_ATTEMPTS = 3`: Maximum retry count within a single request (OpenAI/Gemini handler)
- `60`: 60-second window reuse (only enabled in modes other than `PerformanceFirst`)
- `5`: Token fetch timeout (seconds)
- `300`: Token early refresh threshold (seconds, 5 minutes)

**Key Functions**:
- `parse_retry_delay()`: Extracts retry delay from 429 error response
- `get_token_internal()`: Core logic for account selection and rotation
- `mark_rate_limited()`: Marks account as rate limited

</details>
