---
title: "Copilot: Premium Requests and Model Usage Details | opencode-mystatus"
sidebarTitle: "Copilot Quota"
subtitle: "Copilot: Premium Requests and Model Usage Details"
description: "Learn how to check GitHub Copilot Premium Requests usage. View monthly limits for Free/Pro/Pro+/Business/Enterprise, model details, and overage counts. Supports OAuth Token and Fine-grained PAT authentication."
tags:
  - "github-copilot"
  - "quota"
  - "premium-requests"
  - "pat-authentication"
prerequisite:
  - "/vbgate/opencode-mystatus/start/quick-start"
order: 999
---

# GitHub Copilot Quota Query: Premium Requests and Model Usage Details

## What You'll Learn

- Quickly view GitHub Copilot Premium Requests monthly usage
- Understand monthly limit differences for different subscription types (Free / Pro / Pro+ / Business / Enterprise)
- View model usage details (e.g., usage counts for GPT-4, Claude, etc.)
- Identify overage usage and estimate additional costs
- Resolve permission issues with new OpenCode integration (OAuth Token cannot query quota)

## Your Current Challenge

::: info New OpenCode Integration Permission Issue

OpenCode's latest OAuth integration no longer grants permission to access the `/copilot_internal/*` API, causing the original OAuth Token method to fail quota queries.

You may encounter this error:
```
⚠️ GitHub Copilot quota query is temporarily unavailable.
OpenCode's new OAuth integration does not support accessing the quota API.

Solution:
1. Create a fine-grained PAT (visit https://github.com/settings/tokens?type=beta)
2. Set 'Plan' to 'Read-only' in 'Account permissions'
...
```

This is normal. This tutorial will teach you how to resolve it.

:::

## Core Concepts

GitHub Copilot quota is divided into the following core concepts:

### Premium Requests (Main Quota)

Premium Requests is Copilot's main quota metric, including:
- Chat interactions (conversing with AI assistant)
- Code Completion (code suggestions)
- Copilot Workspace features (workspace collaboration)

::: tip What are Premium Requests?

Simply put: Every time Copilot "does work" for you (generating code, answering questions, analyzing code), it counts as one Premium Request. This is Copilot's main billing unit.

:::

### Subscription Types and Limits

Different subscription types have different monthly limits:

| Subscription Type | Monthly Limit | Target Audience |
| ----------------- | ------------ | -------------- |
| Free              | 50 requests  | Individual developer trial |
| Pro               | 300 requests | Individual developer full version |
| Pro+              | 1,500 requests | Heavy individual users |
| Business          | 300 requests | Team subscription (300 per account) |
| Enterprise        | 1,000 requests | Enterprise subscription (1000 per account) |

### Overage

If you exceed your monthly limit, Copilot remains usable but incurs additional charges. Overage counts are displayed separately in the output.

## 🎒 Prerequisites

### Before You Begin

::: warning Configuration Check

This tutorial assumes you have already:

1. ✅ **Installed the opencode-mystatus plugin**
   - See [Quick Start](../../start/quick-start/)

2. ✅ **Configured at least one of the following**:
   - Logged into GitHub Copilot in OpenCode (OAuth Token)
   - Manually created a Fine-grained PAT configuration file (recommended)

:::

### Configuration Methods (Choose One)

#### Method 1: Using Fine-grained PAT (Recommended)

This is the most reliable method, unaffected by OpenCode OAuth integration changes.

1. Visit https://github.com/settings/tokens?type=beta
2. Click "Generate new token (classic)" or "Generate new token (beta)"
3. In "Account permissions", set **Plan** to **Read-only**
4. Generate the Token, formatted like `github_pat_11A...`
5. Create configuration file `~/.config/opencode/copilot-quota-token.json`:

```json
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

**Configuration file field descriptions**:
- `token`: Your Fine-grained PAT
- `username`: GitHub username (for API calls)
- `tier`: Subscription type, options: `free` / `pro` / `pro+` / `business` / `enterprise`

#### Method 2: Using OpenCode OAuth Token

If you're already logged into GitHub Copilot in OpenCode, mystatus will attempt to use your OAuth Token.

::: warning Compatibility Note

This method may fail due to permission limitations in OpenCode's OAuth integration. If it fails, please use Method 1 (Fine-grained PAT).

:::

## Follow Along

### Step 1: Execute the Query Command

Run the slash command in OpenCode:

```bash
/mystatus
```

**You should see**:

If you have configured a Copilot account (using Fine-grained PAT or OAuth Token), the output will include content like:

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (pro)

Premium Requests [████████░░░░░░░░░░] 40% (180/300)

Model usage details:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests

Period: 2026-01
```

### Step 2: Interpret the Output

The output contains the following key information:

#### 1. Account Information

```
Account:        GitHub Copilot (pro)
```

Displays your Copilot subscription type (pro / free / business, etc.).

#### 2. Premium Requests Quota

```
Premium Requests [████████░░░░░░░░░░] 40% (180/300)
```

- **Progress bar**: Visually shows remaining ratio
- **Percentage**: 40% remaining
- **Used/Total**: Used 180 requests, total 300 requests

::: tip Progress Bar Explanation

Green/yellow fill indicates usage, empty space indicates remaining quota. The more filled, the higher the usage.

:::

#### 3. Model Usage Details (Public API Only)

```
Model usage details:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests
```

Displays usage counts for each model, sorted by usage in descending order (top 5 shown).

::: info Why don't I see model details in my output?

Model details are only displayed when using the Public API (Fine-grained PAT). If you use OAuth Token (Internal API), model details will not be shown.

:::

#### 4. Overage (If Applicable)

If you exceed your monthly limit, it will display:

```
Overage: 25 requests
```

Overage incurs additional charges. Please refer to GitHub Copilot pricing for specific rates.

#### 5. Reset Time (Internal API Only)

```
Quota reset: 12d 5h (2026-02-01)
```

Shows countdown until quota resets.

### Step 3: Check Common Scenarios

#### Scenario 1: Seeing "⚠️ Quota query temporarily unavailable"

This is normal, indicating OpenCode's OAuth Token doesn't have permission to access the quota API.

**Solution**: Follow "Method 1: Using Fine-grained PAT" to configure a PAT.

#### Scenario 2: Progress Bar Empty or Nearly Full

- **Empty** `░░░░░░░░░░░░░░░`: Quota exhausted, overage count will be shown
- **Nearly full** `██████████████████`: Nearly exhausted, monitor usage frequency

#### Scenario 3: Displaying "Unlimited"

Some Enterprise subscriptions may display "Unlimited", indicating no limit.

### Step 4: Handle Errors (If Query Fails)

If you see the following error:

```
GitHub Copilot API request failed (403): Resource not accessible by integration
```

**Cause**: OAuth Token lacks sufficient permissions to access Copilot API.

**Solution**: Use Fine-grained PAT method (see Method 1).

---

## Checkpoint ✅

After completing the steps above, you should be able to:

- [ ] See GitHub Copilot quota information in `/mystatus` output
- [ ] Understand Premium Requests progress bar and percentage
- [ ] Know your subscription type and monthly limit
- [ ] Know how to view model usage details (if using Fine-grained PAT)
- [ ] Understand what overage means

## Common Pitfalls

### Pitfall 1: OAuth Token Cannot Query Quota (Most Common)

::: danger Common Error

```
⚠️ GitHub Copilot quota query is temporarily unavailable.
OpenCode's new OAuth integration does not support accessing the quota API.
```

**Cause**: OpenCode's OAuth integration doesn't grant access permission to the `/copilot_internal/*` API.

**Solution**: Use Fine-grained PAT method. See "Method 1: Using Fine-grained PAT".

:::

### Pitfall 2: Incorrect Configuration File Format

If the configuration file `~/.config/opencode/copilot-quota-token.json` has incorrect format, the query will fail.

**Incorrect Example**:

```json
// ❌ Error: Missing username field
{
  "token": "github_pat_11A...",
  "tier": "pro"
}
```

**Correct Example**:

```json
// ✅ Correct: Contains all required fields
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

### Pitfall 3: Incorrect Subscription Type

If the `tier` you fill in doesn't match your actual subscription, the limit calculation will be incorrect.

| Your Actual Subscription | tier Field Should Be | Incorrect Example |
| ----------------------- | -------------------- | ---------------- |
| Free                    | `free`               | `pro` ❌         |
| Pro                     | `pro`                | `free` ❌        |
| Pro+                    | `pro+`               | `pro` ❌         |
| Business                | `business`           | `enterprise` ❌  |
| Enterprise              | `enterprise`         | `business` ❌    |

**How to check your actual subscription type**:
- Visit https://github.com/settings/billing
- Check the "GitHub Copilot" section

### Pitfall 4: Insufficient Token Permissions

If you use a Classic Token (not Fine-grained) without "Plan" read permission, a 403 error will be returned.

**Solution**:
1. Ensure you use a Fine-grained Token (generated on the beta version page)
2. Ensure you granted "Account permissions → Plan → Read-only"

### Pitfall 5: Model Details Not Displayed

::: tip Normal Behavior

If you use OAuth Token (Internal API) method, model usage details won't be displayed.

This is because the Internal API doesn't return model-level usage statistics. If you need model details, please use Fine-grained PAT method.

:::

## Lesson Summary

This lesson taught you how to use opencode-mystatus to query GitHub Copilot quota:

**Key Points**:

1. **Premium Requests** is Copilot's main quota metric, including Chat, Completion, Workspace, etc.
2. **Subscription type** determines monthly limit: Free 50, Pro 300, Pro+ 1,500, Business 300, Enterprise 1,000
3. **Overage** incurs additional charges and is displayed separately in the output
4. **Fine-grained PAT** is the recommended authentication method, unaffected by OpenCode OAuth integration changes
5. **OAuth Token** method may fail due to permission limitations and requires PAT as an alternative

**Output Interpretation**:
- Progress bar: Visually shows remaining ratio
- Percentage: Specific remaining amount
- Used/Total: Detailed usage
- Model details (optional): Usage counts for each model
- Reset time (optional): Countdown until next reset

## Coming Up Next

> In the next lesson, we'll learn about **[Copilot Authentication Configuration](../../advanced/copilot-auth/)**.
>
> You'll learn:
> - Detailed comparison between OAuth Token and Fine-grained PAT
> - How to generate Fine-grained PAT (complete steps)
> - Multiple solutions to permission issues
> - Best practices for different scenarios

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Lines |
| ------------------ | --------------------------------------------------------------------------------------------- | ------- |
| Copilot quota query | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 481-524 |
| Fine-grained PAT reading | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Public Billing API query | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 157-177 |
| Internal API query | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 242-304 |
| Token exchange logic | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 183-208 |
| Internal API formatting | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 354-393 |
| Public API formatting | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 410-468 |
| Copilot subscription type definition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 57-58 |
| CopilotQuotaConfig type definition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 66-73 |
| CopilotAuthData type definition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 46-51 |
| Copilot subscription limit constants | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 397-403 |

**Key Constants**:

- `COPILOT_PLAN_LIMITS`: Monthly limits for each subscription type (lines 397-403)
  - `free: 50`
  - `pro: 300`
  - `pro+: 1500`
  - `business: 300`
  - `enterprise: 1000`

- `COPILOT_QUOTA_CONFIG_PATH`: Fine-grained PAT configuration file path (lines 93-98)
  - `~/.config/opencode/copilot-quota-token.json`

**Key Functions**:

- `queryCopilotUsage()`: Main query function, supports two authentication strategies (lines 481-524)
- `fetchPublicBillingUsage()`: Query Public Billing API using Fine-grained PAT (lines 157-177)
- `fetchCopilotUsage()`: Query Internal API using OAuth Token (lines 242-304)
- `exchangeForCopilotToken()`: OAuth Token exchange logic (lines 183-208)
- `formatPublicBillingUsage()`: Public API response formatting, includes model details (lines 410-468)
- `formatCopilotUsage()`: Internal API response formatting (lines 354-393)

**Authentication Strategies**:

1. **Strategy 1 (Priority)**: Fine-grained PAT + Public Billing API
   - Pros: Stable, unaffected by OpenCode OAuth integration changes
   - Cons: Requires manual PAT configuration by user

2. **Strategy 2 (Fallback)**: OAuth Token + Internal API
   - Pros: No additional configuration required
   - Cons: May fail due to permission limitations (current OpenCode integration doesn't support)

**API Endpoints**:

- Public Billing API: `https://api.github.com/users/{username}/settings/billing/premium_request/usage`
- Internal Quota API: `https://api.github.com/copilot_internal/user`
- Token Exchange API: `https://api.github.com/copilot_internal/v2/token`

</details>
