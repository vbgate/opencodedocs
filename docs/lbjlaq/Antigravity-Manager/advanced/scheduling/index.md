---
title: "Scheduling: High-Availability | Antigravity-Manager"
sidebarTitle: "Scheduling"
subtitle: "Scheduling: High-Availability"
description: "Learn Antigravity Manager scheduling: session_id generation, fixed account/sticky session/round-robin priority, rate limit marking, retry logic, and X-Account-Email verification."
tags:
  - "Advanced"
  - "Scheduling"
  - "Sticky Session"
  - "Account Rotation"
  - "Failure Retry"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
  - "advanced-config"
order: 999
---

# High-Availability Scheduling: Rotation, Fixed Accounts, Sticky Sessions & Failure Retry

After using Antigravity Tools as your local AI gateway for a while, you'll inevitably hit the same problem: fewer accounts means more frequent 429/401/invalid_grant errors, while more accounts makes it unclear "which account is actually working," and cache hit rates drop.

This lesson clarifies scheduling: how it actually selects accounts, what "sticky sessions" means, when forced rotation happens, and how to use "fixed account mode" to make scheduling controllable.

## What You'll Learn

- Understand what Antigravity Tools' 3 scheduling modes do in real requests
- Know how "session fingerprints (session_id)" are generated and how they affect sticky scheduling
- Enable/disable "fixed account mode" in the GUI and understand which scheduling logic it overrides
- When encountering 429/5xx/invalid_grant, know how the system marks rate limits, retries, and when it rotates

## Your Current Challenges

- Claude Code or OpenAI SDK suddenly throws 429, and retrying switches accounts, causing cache hit rates to drop
- Multiple clients running concurrent tasks often "overwrite" each other's account state
- You want to troubleshoot but don't know which account is serving the current request
- You want to use a specific "most stable account" but the system keeps rotating

## When to Use This Guide

- You need to balance "stability (fewer errors)" against "cache hits (same account)"
- You want the same conversation to reuse the same account as much as possible (reduce Prompt Caching jitter)
- You're doing a canary release or troubleshooting and want to fix all requests to one account

## 🎒 Prerequisites

1) Prepare at least 2 available accounts (smaller pool = less rotation space)
2) Reverse proxy service is running (you can see "Running" status on the "API Proxy" page)
3) You know where the config file is (if you need to manually modify configuration)

::: tip
If you're not familiar with `gui_config.json` and which configs support hot reloading, read **[Config Deep Dive: AppConfig/ProxyConfig, Storage Location & Hot Reload Semantics](/lbjlaq/Antigravity-Manager/advanced/config/)** first.
:::

## Core Concepts: Which Scheduling Layers Does a Request Pass Through?

Scheduling isn't a "single switch"—it's several mechanisms stacked together:

1) **SessionManager first tags the request with a session fingerprint (session_id)**
2) **Handlers require TokenManager to force rotate on each retry** (`attempt > 0`)
3) **TokenManager then selects the account based on: fixed account → sticky session → 60s window → round-robin**
4) **When encountering 429/5xx, it records rate limit info**, and subsequent scheduling actively skips rate-limited accounts

### What Is a "Session Fingerprint (session_id)"?

A **session fingerprint** is a "stable Session Key" used to bind multiple requests in the same conversation to the same account.

In Claude requests, the priority is:

1) `metadata.user_id` (explicitly passed by client, non-empty, and without `"session-"` prefix)
2) Hash the first "sufficiently long" user message with SHA256, then truncate to `sid-xxxxxxxxxxxxxxxx`

Implementation: `src-tauri/src/proxy/session_manager.rs` (Claude/OpenAI/Gemini each have their own extraction logic).

::: info
**Detail**: Why only look at the first user message?

The source code explicitly states "hash only the first user message content, not mixing model name or timestamp," aiming to generate the same session_id for multiple rounds of the same conversation, thereby improving cache hit rates.
:::

### TokenManager's Account Selection Priority

TokenManager's core entry point is:

- `TokenManager::get_token(quota_group, force_rotate, session_id, target_model)`

What it does can be understood by priority:

1) **Fixed Account Mode**: If "Fixed Account Mode" is enabled in the GUI (runtime setting), and that account isn't rate-limited or quota-protected, use it directly.
2) **Sticky Session (Session Binding)**: If there's a `session_id` and scheduling mode isn't `PerformanceFirst`, prioritize reusing the account bound to that session.
3) **60s Global Window Reuse**: If no `session_id` passed (or not bound yet), in non-`PerformanceFirst` mode, try to reuse "the last used account" within 60 seconds.
4) **Round-robin**: When none of the above apply, select accounts by a global incrementing index.

Additionally, there are two "invisible rules" that significantly affect the experience:

- **Accounts are sorted first**: ULTRA > PRO > FREE, with same tier prioritizing higher remaining quota accounts.
- **Failed or rate-limited accounts are skipped**: Already attempted failed accounts enter the `attempted` set; accounts marked as rate-limited are skipped.

### What's the Real Difference Between the 3 Scheduling Modes

In the config you'll see: `CacheFirst` / `Balance` / `PerformanceFirst`.

Based on the actual backend TokenManager branches, their only key difference is: **whether sticky sessions + 60s window reuse are enabled**.

- `PerformanceFirst`: Skips sticky sessions and 60s window reuse, goes directly to round-robin (while continuing to skip rate-limited/quota-protected accounts).
- `CacheFirst` / `Balance`: Both enable sticky sessions and 60s window reuse.

::: warning
**About max_wait_seconds**

The frontend/config structure has `max_wait_seconds`, and the UI only allows adjusting it under `CacheFirst`. But currently, the backend scheduling logic only branches based on `mode` and doesn't read `max_wait_seconds`.
:::

### How Failure Retry & "Forced Rotation" Work Together

In OpenAI/Gemini/Claude handlers, retries are handled with a similar pattern:

- 1st attempt: `force_rotate = false`
- 2nd attempt onwards: `force_rotate = true` (`attempt > 0`), TokenManager skips sticky reuse and directly finds the next available account

When encountering 429/529/503/500 errors:

- The handler calls `token_manager.mark_rate_limited(...)` to record this account as "rate-limited/overloaded," and subsequent scheduling actively skips it.
- The OpenAI compatibility path also tries to parse `RetryInfo.retryDelay` or `quotaResetDelay` from error JSON, waits a short time, then continues retrying.

## Follow Along: Make Scheduling "Controllable"

### Step 1: Confirm You Actually Have an "Account Pool"

**Why**
No matter how advanced the scheduling, if there's only 1 account in the pool, there's no choice. Many "rotation not working/sticky doesn't feel like it's working" root causes are too few accounts.

**Action**
Open the "Accounts" page and confirm at least 2 accounts are in an available state (not disabled / proxy disabled).

**What you should see**: At least 2 accounts can refresh quota normally, and `active_accounts` is not 0 after the reverse proxy starts.

### Step 2: Choose Scheduling Mode in the GUI

**Why**
Scheduling mode determines whether "the same conversation" reuses the same account as much as possible, or rotates each time.

**Action**
Go to the "API Proxy" page, find the "Account Scheduling & Rotation" card, and select one mode:

- `Balance`: Recommended default. More stable in most cases (sticky sessions + rotate on failure).
- `PerformanceFirst`: Choose this when concurrency is high, tasks are short, and you care more about throughput than caching.
- `CacheFirst`: Choose this if you want "conversation to fix account as much as possible" (current backend behavior differs very little from `Balance`).

If you need to manually modify config, the corresponding segment is:

```json
{
  "proxy": {
    "scheduling": {
      "mode": "Balance",
      "max_wait_seconds": 60
    }
  }
}
```

**What you should see**: After switching modes, it immediately writes to `gui_config.json`, and takes effect directly while the reverse proxy service is running (no restart needed).

### Step 3: Enable "Fixed Account Mode" (Turn Off Rotation)

**Why**
For troubleshooting, canary releases, or when you want to "pin" a specific account to a specific client, fixed account mode is the most direct approach.

**Action**
In the same card, enable "Fixed Account Mode," then select an account in the dropdown.

Don't forget: This switch is only available when the reverse proxy service is Running.

**What you should see**: Subsequent requests will prioritize using this account; if it's rate-limited or quota-protected, it will fall back to round-robin.

::: info
**Fixed account is a runtime setting**

Fixed account mode is a **runtime state** (set dynamically via GUI or API), not persisted to `gui_config.json`. After restarting the reverse proxy service, the fixed account will reset to empty (back to round-robin mode).
:::

### Step 4: Clear "Session Bindings" When Needed

**Why**
Sticky sessions record `session_id -> account_id` in memory. If you're doing different experiments on the same machine (like switching account pools, switching modes), old bindings might interfere with your observations.

**Action**
Click "Clear bindings" in the top-right of the "Account Scheduling & Rotation" card.

**What you should see**: Old sessions will be reassigned accounts (next request will rebind).

### Step 5: Use Response Headers to Verify "Which Account Is Serving"

**Why**
To verify scheduling matches expectations, the most reliable way is to get the "current account identifier" returned by the server.

**Action**
Send a non-streaming request to an OpenAI-compatible endpoint, then observe `X-Account-Email` in response headers.

```bash
# Example: Minimal OpenAI Chat Completions request
# Note: model must be an available/routable model name in your current config
curl -i "http://127.0.0.1:8045/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-REPLACE_ME" \
  -d '{
    "model": "gemini-3-pro-high",
    "stream": false,
    "messages": [{"role": "user", "content": "hello"}]
  }'
```

**What you should see**: Response headers will appear similar to below (example):

```text
X-Account-Email: example@gmail.com
X-Mapped-Model: gemini-3-pro-high
```

## Checkpoint ✅

- You can clearly explain the priority relationship between `fixed account`, `sticky session`, and `round-robin`
- You know how `session_id` is generated (prioritize `metadata.user_id`, otherwise hash first user message)
- When encountering 429/5xx, you can expect: the system will first record rate limiting, then switch accounts and retry
- You can use `X-Account-Email` to verify which account is serving the current request

## Common Pitfalls

1) **Don't expect "rotation to save you" when the account pool only has 1**
Rotation only means "switch to another account"—when there's no second account in the pool, 429/invalid_grant will be exposed even more frequently.

2) **`CacheFirst` is not "wait until available forever"**
Current backend scheduling logic tends to unbind and switch accounts when encountering rate limits, rather than blocking and waiting long-term.

3) **Fixed account is not absolute force**
If the fixed account is marked as rate-limited or hit by quota protection, the system will fall back to round-robin.

## Summary

- Scheduling flow: handler extracts `session_id` → `TokenManager::get_token` selects account → on error `attempt > 0` forces rotation
- Your two most commonly used switches: scheduling mode (whether to enable sticky/60s reuse) + fixed account mode (directly specify account)
- 429/5xx are recorded as "rate-limited state," subsequent scheduling will skip that account until the lock expires

## Coming Next

> Next lesson we look at **model routing**: when you want to expose "stable model sets" externally, and want to use wildcard/preset strategies, how to configure and troubleshoot.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Lines |
|--- | --- | ---|
| Scheduling mode and config structure (StickySessionConfig) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L1-L36) | 1-36 |
| Session fingerprint generation (Claude/OpenAI/Gemini) | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L1-L159) | 1-159 |
| TokenManager: Fixed account mode fields and initialization | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L27-L50) | 27-50 |
|--- | --- | ---|
|--- | --- | ---|
| TokenManager: Rate limit recording and success clearing API | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1087-L1147) | 1087-1147 |
| TokenManager: Update scheduling config / Clear session bindings / Fixed account mode setter | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1419-L1461) | 1419-1461 |
| ProxyConfig: scheduling field definition and defaults | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| Sync scheduling config when reverse proxy starts | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L70-L100) | 70-100 |
|--- | --- | ---|
| OpenAI handler: session_id + force rotate on retry | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L160-L182) | 160-182 |
| OpenAI handler: 429/5xx record rate limit + parse retry delay | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L349-L367) | 349-367 |
| Gemini handler: session_id + force rotate on retry | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L62-L88) | 62-88 |
| Gemini handler: 429/5xx record rate limit and rotate | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L279-L299) | 279-299 |
| Claude handler: extract session_id and pass to TokenManager | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L517-L524) | 517-524 |
| 429 retry delay parsing (RetryInfo.retryDelay / quotaResetDelay) | [`src-tauri/src/proxy/upstream/retry.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/retry.rs#L37-L66) | 37-66 |
| Rate limit cause identification and exponential backoff (RateLimitTracker) | [`src-tauri/src/proxy/rate_limit.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/rate_limit.rs#L154-L279) | 154-279 |

**Key Structures**:
- `StickySessionConfig`: Scheduling mode and config structure (`mode`, `max_wait_seconds`)
- `TokenManager`: Account pool, session bindings, fixed account mode, rate limit tracker
- `SessionManager`: Extract `session_id` from requests

</details>
