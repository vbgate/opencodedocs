---
title: "Google Cloud 配额查询 | opencode-mystatus"
sidebarTitle: "Google Cloud 配额"
subtitle: "Google Cloud 配额查询：查看 G3 Pro/Image/Flash 和 Claude"
description: "学习 Google Cloud 配额查询。查看 G3 Pro、G3 Image、G3 Flash、Claude 的剩余配额和重置时间，管理多账户。"
tags:
  - "Google Cloud"
  - "Antigravity"
  - "Quota Query"
prerequisite:
  - "start-quick-start"
  - "start-using-mystatus"
order: 999
---

# Google Cloud Quota Check: G3 Pro/Image/Flash and Claude

## What You'll Learn

- View quotas for 4 models on Google Cloud Antigravity accounts
- Understand reset time and remaining percentage for each model
- Manage quota usage across multiple Google Cloud accounts

## Your Current Pain Point

Google Cloud Antigravity provides multiple models (G3 Pro, G3 Image, G3 Flash, Claude), each with independent quotas and reset times. You need to:
- Log into Google Cloud Console separately to check each model's status
- Manually calculate remaining quotas and reset times
- It's even more chaotic when managing multiple accounts

## When to Use This

When you:
- Want to quickly check remaining quotas for all Google Cloud models
- Need to plan usage allocation across different models
- Have multiple Google Cloud accounts to manage uniformly

## 🎒 Prerequisites

::: warning Prerequisites Check

1. **mystatus plugin installed**: Refer to [Quick Start](/vbgate/opencode-mystatus/start/quick-start/)
2. **Google Cloud authentication configured**: First install [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) plugin to complete OAuth authentication
3. **Authentication file exists**: `~/.config/opencode/antigravity-accounts.json` contains at least one account

:::

## Core Concept

Google Cloud Antigravity authenticates via OAuth mechanism, with each account having an independent Refresh Token. The mystatus plugin will:
1. Read `antigravity-accounts.json` to get all configured accounts
2. Use Refresh Token to refresh Access Token
3. Call Google Cloud API to get quotas for all models
4. Display quotas and reset times for 4 models, grouped by account

## Google Cloud Supported Models

mystatus displays quotas for the following 4 models:

| Display Name | Model Key (Primary/Backup) | Description |
| ------------ | -------------------------- | ----------- |
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Gemini 3 Pro high-performance version |
| G3 Image | `gemini-3-pro-image` | Gemini 3 Pro image generation |
| G3 Flash | `gemini-3-flash` | Gemini 3 Flash fast version |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claude Opus 4.5 model |

**Primary Key and Backup Key Mechanism**:
- API response may return data for only primary key or backup key
- mystatus automatically attempts to fetch quota for either key
- For example: if `gemini-3-pro-high` has no data, it will try `gemini-3-pro-low`

## Follow Along

### Step 1: Execute Query Command

**Why**
Quickly get quota information for all Google Cloud accounts

```
/mystatus
```

**You Should See**
Quota information for all configured platforms, where the Google Cloud section will show content similar to:

```
## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### Step 2: Understand Output Format

**Why**
Quickly locate key information: remaining quota and reset time

Each line format:
```
[model name] [reset time] [progress bar] [remaining percentage]
```

**Field Description**:
- **Model name**: G3 Pro, G3 Image, G3 Flash, Claude
- **Reset time**: Time remaining until next quota reset (e.g., `4h 59m`, `2d 9h`)
- **Progress bar**: Visual display of remaining percentage
- **Remaining percentage**: Value from 0-100

**You Should See**
One line per model, clearly showing quota and reset time

### Step 3: View Multiple Accounts

**Why**
If you have multiple Google Cloud accounts, they will be displayed separately

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%

### another@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░░ 75%
G3 Image   2h 30m     ████████████░░░░░░░░░ 75%
```

**You Should See**
Each account in a separate section, containing that account's 4 model quotas

### Step 4: Check Quota Warnings

**Why**
Avoid service interruption due to overuse

If usage of any model exceeds 80%, a warning prompt will appear:

```
### user@gmail.com

G3 Pro     1h 30m     ████░░░░░░░░░░░░░░░ 20%
G3 Image   1h 30m     ████░░░░░░░░░░░░░░ 20%

⚠️ Usage has reached or exceeded 80%
```

**You Should See**
Warning prompt appears below the model list for the corresponding account

## Checkpoint ✅

Complete the following checks to ensure you did it correctly:

- [ ] Can see Google Cloud quota information after running `/mystatus`
- [ ] Can understand the names and reset times for 4 models
- [ ] Can identify progress bars and remaining percentages
- [ ] If multiple accounts exist, can see quotas for all accounts

## Common Pitfalls

### Problem 1: Cannot See Google Cloud Quota

**Possible Causes**:
- opencode-antigravity-auth plugin not installed
- Google OAuth authentication not completed
- `antigravity-accounts.json` file doesn't exist or is empty

**Solution**:
1. Install opencode-antigravity-auth plugin
2. Complete authentication following the GitHub repository instructions
3. Run `/mystatus` again

### Problem 2: Error Displayed for an Account

**Possible Causes**:
- Refresh Token expired
- projectId missing

**Error Example**:
```
user@gmail.com: No project ID found
```

**Solution**:
1. Re-authenticate that account using opencode-antigravity-auth plugin
2. Ensure project ID is correctly set during authentication

### Problem 3: Model Shows "-" or Reset Time Abnormal

**Possible Causes**:
- API response resetTime field missing or in wrong format
- No quota information available for that model

**Solution**:
- This is normal, mystatus displays "-" to indicate data unavailable
- If all models show "-", check network connection or Google Cloud API status

## Summary

- Google Cloud Antigravity supports 4 models: G3 Pro, G3 Image, G3 Flash, Claude
- Each model has independent quotas and reset times
- Supports multi-account management, with each account displayed separately
- Warning prompt appears when usage exceeds 80%

## Next Lesson Preview

> In the next lesson, we'll learn **[Google Cloud Advanced Configuration: Multi-Account and Model Management](../../advanced/google-setup/)**.
>
> You'll learn:
> - How to add and manage multiple Google Cloud accounts
> - Understand the mapping relationship for 4 models
> - Differences between projectId and managedProjectId

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Line Numbers |
| --------- | --------- | ------------ |
| Model configuration | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L69-L78) | 69-78 |
| Account query logic | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L304-L370) | 304-370 |
| Token refresh | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| Quota extraction | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L132-L157) | 132-157 |
| Format output | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |
| Type definitions | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94) | 78-94 |

**Key Constants**:
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`: Google Cloud quota query API
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`: OAuth Token refresh API
- `USER_AGENT = "antigravity/1.11.9 windows/amd64"`: API request User-Agent

**Key Functions**:
- `queryGoogleUsage()`: Query quotas for all Antigravity accounts
- `fetchAccountQuota()`: Query quota for a single account
- `extractModelQuotas()`: Extract quotas for 4 models from API response
- `formatAccountQuota()`: Format display of single account quota

**Model Mapping Rules**:
- G3 Pro supports `gemini-3-pro-high` and `gemini-3-pro-low`, prioritizing primary key
- Claude supports `claude-opus-4-5-thinking` and `claude-opus-4-5`, prioritizing primary key
- G3 Image and G3 Flash have only one key

</details>
