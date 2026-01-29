---
title: "Google Cloud: Setup | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Google Cloud Advanced Setup: Multiple Accounts and Model Management"
description: "学习如何配置和管理多个 Google Cloud Antigravity 账户。了解 4 个模型的映射关系和额度查询方法，掌握多账户管理技巧。"
tags:
  - "Google Cloud"
  - "Multi-Account Management"
  - "Antigravity"
  - "Model Mapping"
prerequisite:
  - "start-quick-start"
order: 999
---

# Google Cloud Advanced Setup: Multiple Accounts and Model Management

## What You'll Learn

Configure multiple Google Cloud accounts, view quota usage across all accounts with a single command, understand the mapping of 4 models (G3 Pro, G3 Image, G3 Flash, Claude), and resolve quota limitations with single-account models.

## Core Concepts

### Multi-Account Support

opencode-mystatus supports querying multiple Google Cloud Antigravity accounts simultaneously. Each account independently displays its quota for 4 models, making it easy to manage quota allocation across multiple projects.

Accounts are stored in `~/.config/opencode/antigravity-accounts.json` and managed by the `opencode-antigravity-auth` plugin. You need to install this plugin before adding Google Cloud accounts.

### Model Mapping

Google Cloud Antigravity provides multiple models, and the plugin displays the 4 most commonly used:

| Display Name | Model Key (Primary) | Model Key (Alternative) |
| ------------ | ------------------- | ----------------------- |
| G3 Pro       | `gemini-3-pro-high` | `gemini-3-pro-low`      |
| G3 Image     | `gemini-3-pro-image` | -                       |
| G3 Flash     | `gemini-3-flash`    | -                       |
| Claude       | `claude-opus-4-5-thinking` | `claude-opus-4-5`      |

**Why Are There Alternative Keys?**

Some models have two versions (high/low). The plugin prioritizes displaying data from the primary key; if the primary key has no quota information, it automatically uses data from the alternative key.

### Project ID Usage

Querying quota requires a Project ID. The plugin prioritizes using `projectId`, falling back to `managedProjectId` if it doesn't exist. Both IDs can be configured when adding an account.

## 🎒 Prerequisites

::: warning Prerequisites
Make sure you have:
- [x] Completed the Quick Start tutorial ([Quick Start](/vbgate/opencode-mystatus/start/quick-start/))
- [x] Installed the opencode-mystatus plugin
- [x] Installed the [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) plugin
:::

## Follow Along

### Step 1: Add Your First Google Cloud Account

**Why**
The first account is the foundation; you can only test multi-account queries after successfully adding it.

Use the `opencode-antigravity-auth` plugin to add an account. Assuming you've already installed the plugin:

```bash
# Let AI help you install (recommended)
# In Claude/OpenCode, enter:
Install the opencode-antigravity-auth plugin from: https://github.com/NoeFabris/opencode-antigravity-auth
```

After installation, follow the plugin's documentation to complete Google OAuth authentication.

**You should see**:
- Account information saved to `~/.config/opencode/antigravity-accounts.json`
- File content similar to:
  ```json
  {
    "version": 1,
    "accounts": [
      {
        "email": "user1@gmail.com",
        "refreshToken": "1//...",
        "projectId": "my-project-123",
        "managedProjectId": "managed-project-456",
        "addedAt": 1737600000000,
        "lastUsed": 1737600000000
      }
    ]
  }
  ```

### Step 2: Query Google Cloud Quota

**Why**
Verify that the first account is configured correctly and view the quota status for 4 models.

```bash
/mystatus
```

**You should see**:

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### Step 3: Add a Second Google Cloud Account

**Why**
When you have multiple Google Cloud accounts, you can manage quota allocation for multiple projects simultaneously.

Repeat the process from Step 1, signing in with a different Google account.

After adding, the `antigravity-accounts.json` file will look like:

```json
{
  "version": 1,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//...",
      "projectId": "my-project-123",
      "addedAt": 1737600000000,
      "lastUsed": 1737600000000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "2//...",
      "projectId": "another-project-456",
      "addedAt": 1737700000000,
      "lastUsed": 1737700000000
    }
  ]
}
```

### Step 4: View Multi-Account Quota

**Why**
Confirm that both accounts' quotas are displayed correctly, helping you plan usage across accounts.

```bash
/mystatus
```

**You should see**:

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### user2@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 65%
G3 Image   2h 30m     ██████████░░░░░░░░░ 50%
G3 Flash   2h 30m     ██████████████░░░░░░ 80%
Claude     1d 5h      ████████░░░░░░░░░░░ 35%
```

## Troubleshooting

### Account Not Displayed

**Problem**: Added account, but `mystatus` doesn't show it.

**Cause**: Account is missing the email field. The plugin filters out accounts without an `email` field (see source code `google.ts:318`).

**Solution**: Ensure each account in `antigravity-accounts.json` has an `email` field.

### Missing Project ID

**Problem**: Error "No project ID found" displayed.

**Cause**: Account configuration has neither `projectId` nor `managedProjectId`.

**Solution**: When re-adding the account, ensure you've filled in a Project ID.

### Empty Model Data

**Problem**: A model shows 0% or no data.

**Causes**:
1. The account hasn't used that model
2. The model's quota information wasn't returned (some models may require special permissions)

**Solutions**:
- This is normal behavior; as long as the account has quota data
- If all models are at 0%, check if the account permissions are correct

## Summary

- Installing the `opencode-antigravity-auth` plugin is a prerequisite for querying Google Cloud quotas
- Supports simultaneous querying of multiple accounts, with each account independently displaying quotas for 4 models
- Model mapping: G3 Pro (supports high/low), G3 Image, G3 Flash, Claude (supports thinking/normal)
- Plugin prioritizes `projectId`, using `managedProjectId` if it doesn't exist
- Accounts must include an `email` field to be queried

## Coming Up Next

> In the next lesson, we'll learn **[GitHub Copilot Authentication Setup](/vbgate/opencode-mystatus/advanced/copilot-auth/)**.
>
> You'll learn:
> - Two Copilot authentication methods: OAuth Token and Fine-grained PAT
> - How to resolve Copilot permission issues
> - Quota differences across subscription types

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Line |
| --- | --- | --- |
| Model configuration mapping | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 69-78 |
| Parallel multi-account queries | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 327-334 |
| Account filtering (must have email) | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 318 |
| Project ID priority | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 231 |
| Model quota extraction | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 132-157 |
| AntigravityAccount type definition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 78-86 |

**Key Constants**:
- `MODELS_TO_DISPLAY`: Configuration for 4 models (key, altKey, display)
- `GOOGLE_QUOTA_API_URL`: Google Cloud quota API endpoint
- `USER_AGENT`: Request User-Agent (antigravity/1.11.9)

**Key Functions**:
- `queryGoogleUsage()`: Query quota for all Google Cloud accounts
- `fetchAccountQuota()`: Query quota for a single account (includes token refresh)
- `extractModelQuotas()`: Extract quota information for 4 models from API response
- `formatAccountQuota()`: Format quota output for a single account

</details>
