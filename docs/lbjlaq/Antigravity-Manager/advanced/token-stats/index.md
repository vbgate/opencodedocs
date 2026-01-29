---
title: "Token Stats: Cost Metrics | Antigravity-Manager"
sidebarTitle: "Token Stats"
subtitle: "Token Stats: Cost-Perspective Metrics and Chart Interpretation"
description: "Learn Token Stats metrics: extract token data from proxy responses, write to local SQLite, analyze usage by model and account across hourly/daily/weekly dimensions, locate expensive models and accounts, troubleshoot missing statistics."
tags:
  - "Token Stats"
  - "Cost"
  - "Monitoring"
  - "SQLite"
  - "Usage Statistics"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-model-router"
order: 999
---
# Token Stats: Cost-Perspective Metrics and Chart Interpretation

You've already connected your client to Antigravity Tools, but determining "who's spending, what's expensive, and whether a specific model suddenly spiked" is hard to judge by intuition alone. This lesson does one thing: clarify the data metrics on the Token Stats page and teach you how to use charts to quickly pinpoint cost issues.

## What You'll Learn

- Explain where Token Stats data comes from (when it gets recorded, and when it's missing)
- Switch between hourly/daily/weekly observation windows to avoid misjudgments caused by "looking at just one day"
- In both "By Model" and "By Account" views, use trend charts to identify abnormal peaks
- Use Top lists to lock down the most expensive models/accounts, then return to request logs to trace root causes

## Your Current Struggles

- You feel calls are getting more expensive, but don't know whether it's due to model changes, account changes, or a sudden volume spike on a specific day
- You see `X-Mapped-Model` but aren't sure which model standard the statistics actually use
- Token Stats occasionally shows 0 or "No data available"—you don't know if there's no traffic or if statistics weren't captured

## When to Use This Feature

- You're doing cost optimization: first quantify "who's most expensive"
- You're troubleshooting sudden rate limits or anomalies: use peak time points to cross-reference request logs
- After making changes to model routing or quota governance, you want to verify costs are decreasing as expected

## What Is Token Stats?

**Token Stats** is the local usage statistics page of Antigravity Tools: after forwarding requests, the proxy attempts to extract token counts from `usage/usageMetadata` in response JSON or streaming data, writes each request to local SQLite (`token_stats.db`) by account and model, and finally displays aggregated data in the UI by time/model/account.

::: info Important: one common pitfall
The "model" standard in Token Stats comes from the `model` field in your request (or path parsing like Gemini's `/v1beta/models/<model>`), not the routed `X-Mapped-Model`.
:::

## 🎒 Before You Start

- You've already successfully made at least one proxy call (not just停留在 `/healthz` health checks)
- Your upstream responses return parsable token usage fields (otherwise statistics will be missing)

::: tip Recommended reading
If you're using model mapping to route `model` to different physical models, it's recommended to first read **[Model Router: Custom Mapping, Wildcard Priority, and Preset Strategies](/lbjlaq/Antigravity-Manager/advanced/model-router/)**, then come back here—the "statistical standards" will be more intuitive.
:::

## Core Approach

The Token Stats data pipeline can be broken into three segments:

1. Proxy middleware attempts to extract token usage from responses (supports `usage`/`usageMetadata`, streaming data is also parsed)
2. If both `account_email + input_tokens + output_tokens` are obtained, write to local SQLite (`token_stats.db`)
3. UI pulls aggregated data via Tauri `invoke(get_token_stats_*)`, displaying by hour/day/week

## Follow Along

### Step 1: First confirm you "have traffic"

**Why**
Token Stats statistics come from real requests. If you only start the proxy but never make a single model request, the page will display "No data available".

How to do it: reuse the call method you already verified in **[Start Local Reverse Proxy and Connect Your First Client](/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**, send 1-2 requests.

**What you should see**: The Token Stats page changes from "Loading/No data available" to displaying charts or lists.

### Step 2: Choose the right time window (hour/day/week)

**Why**
The same data shows completely different "peaks/trends" under different windows. The three windows in the UI correspond to different data ranges:

- Hour: last 24 hours
- Day: last 7 days
- Week: last 4 weeks (trend view aggregates over the last 30 days)

**What you should see**: After switching, the trend chart's x-axis granularity changes (hour shows "hour", day shows "month/day", week shows "year-Wweek number").

### Step 3: First look at the top summary to determine "cost scale"

**Why**
Summary cards first answer 3 questions: is the total volume large, is the input/output ratio abnormal, and did the number of active accounts/models suddenly increase.

Focus on these items:

- Total tokens (`total_tokens`)
- Input/output tokens (`total_input_tokens` / `total_output_tokens`)
- Active account count (`unique_accounts`)
- Number of models used (UI uses the length of "model-specific statistics list" directly)

**What you should see**: If "active account count" suddenly spikes, it usually means you ran more accounts in a short time (e.g., switching to a rotation strategy).

### Step 4: Use "Model/Account Usage Trends" to catch abnormal peaks

**Why**
Trend charts are the best entry point for catching "suddenly expensive" issues. You don't need to know the cause first—first identify "which day/hour spiked".

How to do it:

1. In the top-right of the trend chart, switch between "By Model / By Account"
2. Hover (Tooltip) to see Top values, prioritize关注 "the one that suddenly shot to first place"

**What you should see**:

- By model: a certain model suddenly rises during a specific time period
- By account: a certain account suddenly rises during a specific time period

### Step 5: Use Top lists to lock down "most expensive targets"

**Why**
Trend charts tell you "when it's abnormal", Top lists tell you "who's most expensive". Cross-reference these two to quickly narrow down troubleshooting scope.

How to do it:

- In "By Model" view, look at `total_tokens / request_count / percentage` in the "Model-Specific Statistics" table
- In "By Account" view, look at `total_tokens / request_count` in the "Account-Specific Statistics" table

**What you should see**: The most expensive models/accounts appear at the top, and `request_count` helps you distinguish between "one-time very expensive" vs "many times".

### Step 6 (Optional): Find `token_stats.db`, do backups/verification

**Why**
When you suspect "missing statistics" or want to do offline analysis, taking the SQLite file directly is most reliable.

How to do it: go to Settings > Advanced section, click "Open Data Directory", and you'll find `token_stats.db` in the data directory.

**What you should see**: The file list contains `token_stats.db` (filename is hardcoded by the backend).

## Checkpoint ✅

- You can clearly explain that Token Stats statistics are "extracted from response usage/usageMetadata and written to local SQLite", not cloud billing
- In both "By Model" and "By Account" trend views, you can identify a specific peak time period
- You can provide an actionable troubleshooting conclusion using Top lists: which model or account to check first

## Common Pitfalls

| Phenomenon | Common Cause | What You Can Do |
| --- | --- | --- |
| Token Stats shows "No data available" | You indeed haven't generated model requests; or upstream responses don't contain parsable token fields | First use an already verified client to send requests; then check if responses include `usage/usageMetadata` |
| Statistics by "model" look wrong | Statistics use the `model` from requests, not `X-Mapped-Model` | Treat model routing as "request model -> mapped model"; statistics view the "request model" |
| Account dimension missing | Only writes when `X-Account-Email` is obtained AND token usage is parsed | Confirm requests actually go through the account pool; then cross-reference request logs/response headers |

## Lesson Summary

- Token Stats' core value is "quantifying cost issues"—first locate, then optimize
- Statistical writing depends on three elements: account, model, token usage (missing any one means no write)
- For more refined cost control, the next step is usually to return to model routing or quota governance

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Line Numbers |
| --- | --- | --- |
| Token Stats page route `/token-stats` | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L19-L47) | 19-47 |
| Token Stats UI: time window/view switching and data fetching | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L49-L166) | 49-166 |
| Token Stats UI: empty data prompt ("No data available") | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L458-L507) | 458-507 |
| Token usage extraction: parse model from request, parse usage/usageMetadata from response | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L32-L120) | 32-120 |
| Token usage extraction: parse usage field from streaming and JSON responses | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L122-L336) | 122-336 |
| Token Stats write point: write to SQLite after obtaining account+tokens | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L79-L136) | 79-136 |
| Database filename and table structure: `token_stats.db` / `token_usage` / `token_stats_hourly` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L126) | 58-126 |
| Write logic: `record_usage(account_email, model, input, output)` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L128-L159) | 128-159 |
| Query logic: hour/day/week, by account/by model, trends and summary | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L161-L555) | 161-555 |
| Tauri commands: `get_token_stats_*` exposed to frontend | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L791-L847) | 791-847 |
| Initialize Token Stats DB on app startup | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L56) | 50-56 |
| Settings page: get/open data directory (to find `token_stats.db`) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L76-L143) | 76-143 |

</details>
