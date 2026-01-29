---
title: "OpenAI 额度: 查询限制 | opencode-mystatus"
subtitle: "OpenAI 额度: 查询限制"
sidebarTitle: "OpenAI 额度"
description: "学习查询 OpenAI 的 3 小时和 24 小时额度使用情况。掌握主次窗口、进度条、重置时间和订阅类型信息。"
tags:
  - "OpenAI"
  - "Quota Query"
  - "API Quota"
prerequisite:
  - "/vbgate/opencode-mystatus/start/quick-start"
  - "/vbgate/opencode-mystatus/start/understanding-output"
order: 999
---

# OpenAI Quota Query: 3-Hour & 24-Hour Limits

## What You'll Learn

- Use `/mystatus` to query OpenAI Plus/Team/Pro subscription quotas
- Understand 3-hour and 24-hour quota limit information in the output
- Distinguish between primary and secondary windows
- Handle token expiration properly

## Your Current Challenge

OpenAI API calls have rate limits, and exceeding them triggers temporary access restrictions. But you don't know:
- How much quota remains?
- Which window is active—the 3-hour or 24-hour one?
- When will it reset?
- Why do you sometimes see data for two windows?

Without timely access to this information, your progress on coding with ChatGPT or working on projects may be impacted.

## When to Use This

When you:
- Need to frequently use the OpenAI API for development
- Notice slower responses or rate limiting
- Want to understand team account usage
- Need to know when quotas will refresh

## Core Concepts

OpenAI applies two types of rate limiting windows for API calls:

| Window Type | Duration | Purpose |
|--- | --- | ---|
| **Primary Window** | Returned by OpenAI server | Prevents excessive calls within a short time |
| **Secondary Window** | Returned by OpenAI server (may not exist) | Prevents long-term overuse |

mystatus queries both windows in parallel and displays:
- Percentage used
- Remaining quota progress bar
- Time until reset

::: info
Window duration is returned by the OpenAI server and may vary by subscription type (Plus, Team, Pro).
:::

## Follow Along

### Step 1: Execute the Query Command

In OpenCode, type `/mystatus`. The system automatically queries quotas for all configured platforms.

**You should see**:
Quota information for OpenAI, Zhipu AI, Z.ai, Copilot, Google Cloud, and other platforms (depending on which platforms you've configured).

### Step 2: Locate the OpenAI Section

Find the `## OpenAI Account Quota` section in the output.

**You should see**:
Something like this:

```
## OpenAI Account Quota

Account:        user@example.com (plus)

3-hour limit
███████████████░░░░░░░░░░ 60% remaining
Resets in: 2h 30m
```

### Step 3: Interpret the Primary Window

The **Primary Window** (primary_window) typically shows:
- **Window name**: Such as `3-hour limit` or `24-hour limit`
- **Progress bar**: Visual representation of remaining quota ratio
- **Remaining percentage**: Such as `60% remaining`
- **Reset time**: Such as `Resets in: 2h 30m`

**You should see**:
- Window name displays the duration (3-hour / 24-hour)
- A fuller progress bar means more quota remaining; an emptier bar means closer to depletion
- Reset time is a countdown—quota refreshes when it reaches zero

::: warning
If you see `Limit reached!`, the current window quota is exhausted and you need to wait for reset.
:::

### Step 4: Check the Secondary Window (if present)

If OpenAI returns secondary window data, you'll see:

```
24-hour limit
████████████████████████████ 90% remaining
Resets in: 20h 45m
```

**You should see**:
- Secondary window shows quota for another time dimension (usually 24 hours)
- May have a different remaining percentage than the primary window

::: tip
The secondary window is an independent quota pool. Exhausting the primary window doesn't affect the secondary window, and vice versa.
:::

### Step 5: View Subscription Type

You can see the subscription type in the `Account` line:

```
Account:        user@example.com (plus)
                                   ^^^^^
                                   Subscription type
```

**Common subscription types**:
- `plus`: Personal Plus subscription
- `team`: Team/organization subscription
- `pro`: Pro subscription

**You should see**:
- Your account type displayed in parentheses after the email
- Different subscription types may have different limits

## Checkpoint ✅

Verify your understanding:

| Scenario | You should see |
|--- | ---|
| 60% remaining in primary window | Progress bar about 60% full, displaying `60% remaining` |
| Resets in 2.5 hours | Shows `Resets in: 2h 30m` |
| Limit reached | Displays `Limit reached!` |
| Secondary window present | Both primary and secondary windows show their own data lines |

## Common Pitfalls

### ❌ Mistake: Not Refreshing After Token Expiration

**Error symptom**: You see the message `⚠️ OAuth token expired` (English) or `⚠️ OAuth 授权已过期` (Chinese)

**Cause**: The OAuth Token has expired (specific duration controlled by the server), preventing quota queries.

**Correct approach**:
1. Re-login to OpenAI in OpenCode
2. Token refreshes automatically
3. Run `/mystatus` query again

### ❌ Mistake: Confusing Primary and Secondary Windows

**Error symptom**: Thinking there's only one window quota, then the primary window is exhausted while the secondary window is still available

**Cause**: The two windows are independent quota pools.

**Correct approach**:
- Pay attention to reset times for both windows
- Primary window resets faster; secondary window resets slower
- Distribute usage reasonably to avoid long-term overage in any window

### ❌ Mistake: Ignoring Team Account ID

**Error symptom**: Team subscription displays usage that isn't yours

**Cause**: Team subscriptions require passing a team account ID; otherwise, the query might be for the default account.

**Correct approach**:
- Ensure you're logged into the correct team account in OpenCode
- Token automatically includes `chatgpt_account_id`

## Lesson Summary

mystatus queries quotas by calling the official OpenAI API:
- Supports OAuth authentication (Plus/Team/Pro)
- Displays primary and secondary windows (if present)
- Progress bars visualize remaining quota
- Countdown shows reset time
- Automatically detects token expiration

## Coming Up Next

> In the next lesson, we'll learn about **[Zhipu AI and Z.ai Quota Query](../zhipu-usage/)**.
>
> You'll learn:
> - What the 5-hour Token limit means
> - How to check MCP monthly quotas
> - Warning prompts when usage exceeds 80%

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function                     | File Path                                                                                      | Lines   |
|--- | --- | ---|
| OpenAI quota query entry     | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L207-L236) | 207-236 |
| OpenAI API call             | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L132-L155) | 132-155 |
| Format output                | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| JWT Token parsing           | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L64-L73)   | 64-73   |
| Extract user email          | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L78-L81)   | 78-81   |
| Token expiration check      | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L216-L221) | 216-221 |
| OpenAIAuthData type definition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)       | 28-33   |

**Constants**:
- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: Official OpenAI quota query API

**Key functions**:
- `queryOpenAIUsage(authData)`: Main function for querying OpenAI quota
- `fetchOpenAIUsage(accessToken)`: Call the OpenAI API
- `formatOpenAIUsage(data, email)`: Format output
- `parseJwt(token)`: Parse JWT Token (non-standard library implementation)
- `getEmailFromJwt(token)`: Extract user email from Token
- `getAccountIdFromJwt(token)`: Extract team account ID from Token

</details>
