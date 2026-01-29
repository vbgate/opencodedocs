---
title: "Zhipu AI: Query Quota Limits | opencode-mystatus"
sidebarTitle: "Zhipu AI"
subtitle: "Zhipu AI and Z.ai Quota Query: 5-Hour Token Limit and Monthly MCP Quota"
description: "Learn how to query Zhipu AI and Z.ai's 5-hour token limits and monthly MCP quotas. Understand progress bar interpretation and reset time calculation to avoid exceeding limits."
tags:
  - "Zhipu AI"
  - "Z.ai"
  - "Quota Query"
  - "Token Limit"
  - "MCP Quota"
prerequisite:
  - "start-quick-start"
order: 999
---

# Zhipu AI and Z.ai Quota Query: 5-Hour Token Limit and Monthly MCP Quota

## What You'll Learn

- View usage status of **Zhipu AI** and **Z.ai** 5-hour token limits
- Understand the meaning and reset rules of **MCP monthly quotas**
- Read information from quota output such as **progress bars, usage, totals**
- Know when **usage warnings** are triggered

## Your Current Challenge

You use Zhipu AI or Z.ai for application development but often encounter these issues:

- Unsure how much remains in the **5-hour token limit**
- Request failures after exceeding limits, impacting development progress
- Unclear about the specific meaning of **MCP monthly quotas**
- Need to log into both platforms separately to check quotas, which is inconvenient

## When to Use This

When you:

- Use Zhipu AI / Z.ai APIs for application development
- Need to monitor token usage to avoid exceeding limits
- Want to understand the monthly quota for MCP search functionality
- Use both Zhipu AI and Z.ai and want unified quota management

## Core Concepts

**Zhipu AI** and **Z.ai** quota systems are divided into two types:

| Quota Type | Meaning | Reset Cycle |
| ---------- | ------- | ----------- |
| **5-Hour Token Limit** | Token usage limit for API requests | Automatically resets every 5 hours |
| **MCP Monthly Quota** | Monthly limit on MCP (Model Context Protocol) search count | Resets monthly |

The plugin calls official APIs to query this data in real-time and visually displays remaining quotas with **progress bars** and **percentages**.

::: info What is MCP?

**MCP** (Model Context Protocol) is the Model Context Protocol provided by Zhipu AI, allowing AI models to search and reference external resources. The MCP monthly quota limits the number of searches available each month.

:::

## Follow Along

### Step 1: Configure Zhipu AI / Z.ai Accounts

**Why**
The plugin needs API Keys to query your quotas. Zhipu AI and Z.ai use **API Key authentication**.

**Action**

1. Open the `~/.local/share/opencode/auth.json` file

2. Add API Key configuration for Zhipu AI or Z.ai:

```json
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "Your Zhipu AI API Key"
  },
  "zai-coding-plan": {
    "type": "api",
    "key": "Your Z.ai API Key"
  }
}
```

**You should see**:
- The configuration file contains `zhipuai-coding-plan` or `zai-coding-plan` fields
- Each field has `type: "api"` and `key` fields

### Step 2: Query Quotas

**Why**
Call official APIs to get real-time quota usage status.

**Action**

Execute the slash command in OpenCode:

```bash
/mystatus
```

Or ask in natural language:

```
Check my Zhipu AI quota
```

**You should see** output similar to this:

```
## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-Hour Token Limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Reset: in 4 hours

MCP Monthly Quota
██████████████████░░░░░░░ 60% remaining
Used: 200 / 500

## Z.ai Account Quota

Account:        9c89****AQVM (Z.ai)

5-Hour Token Limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Reset: in 4 hours
```

### Step 3: Interpret Output

**Why**
Understanding the meaning of each output line allows you to effectively manage quotas.

**Action**

Compare your output with the following explanation:

| Output Field | Meaning | Example |
| ----------- | ------- | ------- |
| **Account** | Masked API Key and account type | `9c89****AQVM (Coding Plan)` |
| **5-Hour Token Limit** | Token usage within current 5-hour period | Progress bar + percentage |
| **Used: X / Y** | Used tokens / Total quota | `0.5M / 10.0M` |
| **Reset: in X hours** | Countdown to next reset | `in 4 hours` |
| **MCP Monthly Quota** | Monthly MCP search count usage | Progress bar + percentage |
| **Used: X / Y** | Used count / Total quota | `200 / 500` |

**You should see**:
- The 5-hour token limit section has a **reset time countdown**
- The MCP monthly quota section **has no reset time** (because it resets monthly)
- If usage exceeds 80%, a **warning alert** appears at the bottom

## Checkpoint ✅

Confirm you understand the following:

- [ ] 5-hour token limits have a reset countdown
- [ ] MCP monthly quotas reset monthly and don't show a countdown
- [ ] Usage warnings are triggered when usage exceeds 80%
- [ ] API Keys are masked (only first 4 and last 4 characters shown)

## Troubleshooting

### ❌ Common Error 1: Missing `type` Field in Configuration File

**Error**: Query prompts "No configured accounts found"

**Cause**: Missing `type: "api"` field in `auth.json`

**Fix**:

```json
// ❌ Wrong
{
  "zhipuai-coding-plan": {
    "key": "Your API Key"
  }
}

// ✅ Correct
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "Your API Key"
  }
}
```

### ❌ Common Error 2: API Key Expired or Invalid

**Error**: Shows "API request failed" or "Authentication failed"

**Cause**: API Key has expired or been revoked

**Fix**:
- Log in to Zhipu AI / Z.ai console
- Regenerate API Key
- Update the `key` field in `auth.json`

### ❌ Common Error 3: Confusing Two Quota Types

**Error**: Assuming token limit and MCP quota are the same thing

**Fix**:
- **Token Limit**: Token usage for API calls, resets every 5 hours
- **MCP Quota**: MCP search count, resets monthly
- These are **two independent limits** and don't affect each other

## Summary

In this lesson, we learned how to use opencode-mystatus to query quotas for Zhipu AI and Z.ai:

**Core Concepts**:
- 5-Hour Token Limit: API call limit with reset countdown
- MCP Monthly Quota: MCP search count, resets monthly

**Steps**:
1. Configure `zhipuai-coding-plan` or `zai-coding-plan` in `auth.json`
2. Execute `/mystatus` to query quotas
3. Interpret progress bars, usage, and reset times from the output

**Key Points**:
- Usage warnings are triggered when usage exceeds 80%
- API Keys are automatically masked
- Token limits and MCP quotas are two independent limits

## Coming Up Next

> In the next lesson, we'll learn **[GitHub Copilot Quota Query](/vbgate/opencode-mystatus/platforms/copilot-usage/)**.
>
> You'll learn:
> - How to view Premium Requests usage
> - Monthly quota differences across subscription types
> - How to interpret model usage details

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
| ------- | --------- | ----- |
| Query Zhipu AI quota | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 213-217 |
| Query Z.ai quota | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 224-228 |
| Format output | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 115-177 |
| API endpoint configuration | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-76 |
| ZhipuAuthData type definition | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 38-41 |
| High usage warning threshold | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 110-111 |

**Key Constants**:
- `HIGH_USAGE_THRESHOLD = 80`: Show warning when usage exceeds 80% (`types.ts:111`)

**Key Functions**:
- `queryZhipuUsage(authData)`: Query Zhipu AI account quota (`zhipu.ts:213-217`)
- `queryZaiUsage(authData)`: Query Z.ai account quota (`zhipu.ts:224-228`)
- `formatZhipuUsage(data, apiKey, accountLabel)`: Format quota output (`zhipu.ts:115-177`)
- `fetchUsage(apiKey, config)`: Call official API to get quota data (`zhipu.ts:81-106`)

**API Endpoints**:
- Zhipu AI: `https://bigmodel.cn/api/monitor/usage/quota/limit` (`zhipu.ts:63`)
- Z.ai: `https://api.z.ai/api/monitor/usage/quota/limit` (`zhipu.ts:64`)

</details>
