---
title: "Quota Governance: Protection + Warmup | Antigravity-Manager"
sidebarTitle: "Quota Governance"
subtitle: "Quota Governance: Combined Quota Protection + Smart Warmup Strategy"
description: "Learn Antigravity Tools quota governance: use Quota Protection to preserve critical models and Smart Warmup for automatic warmup when quota restores."
tags:
  - "quota"
  - "warmup"
  - "accounts"
  - "proxy"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
order: 999
---

# Quota Governance: Quota Protection + Smart Warmup Combined Strategy

You're running Antigravity Tools stably, but there's one thing you fear most: your primary model's quota gets "quietly drained," and by the time you actually need it, you find it's already too low to use.

This lesson is about **Quota Governance**: use Quota Protection to preserve critical models; use Smart Warmup to perform a "light warmup" when quota restores, reducing unexpected failures.

## What is Quota Governance?

**Quota Governance** refers to controlling "how quota is spent" using two linked mechanisms in Antigravity Tools: when a model's remaining quota falls below a threshold, Quota Protection adds that model to the account's `protected_models`, and requests for that model prioritize avoiding it; when quota returns to 100%, Smart Warmup triggers a minimal warmup request and applies a 4-hour cooldown using a local history file.

## What You'll Learn

- Enable Quota Protection to let low-quota accounts automatically "yield," reserving high-value models for critical requests
- Enable Smart Warmup for automatic warmup when quota restores (and understand how 4-hour cooldown affects trigger frequency)
- Understand where `quota_protection` / `scheduled_warmup` / `protected_models` fields take effect
- Know which model names get normalized into "protection groups" (and which don't)

## Your Current Struggles

- You think you're "rotating accounts," but you're actually continuously consuming the same type of high-value models
- You only discover low quota when it's too late—even Claude Code or clients drain quota in background warmup
- You enabled warmup, but don't know when it actually triggers, whether there's a cooldown, or if it affects quota

## When to Use This Approach

- You have multiple account pools and want critical models to have remaining quota during "important moments"
- You don't want to manually monitor quota restore time and want the system to automatically do a "light verification after restore"

## 🎒 Preparation

::: warning Prerequisite
This lesson assumes you can already:

- See the account list on the **Accounts** page and manually refresh quota
- Have started the local reverse proxy (at minimum, can access `/healthz`)

If not yet working, see **[Start Local Reverse Proxy & First Client](/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

Additionally, Smart Warmup writes to a local history file `warmup_history.json`. It's placed in the data directory—you can learn about data directory location and backup methods in **[First Run Essentials: Data Directory, Logs, Tray, and Auto-startup](/lbjlaq/Antigravity-Manager/start/first-run-data/)**.

## Core Approach

This "combined strategy" is actually straightforward:

- Quota Protection handles "stop wasting": when a model falls below threshold, mark it as protected, and prioritize avoiding that account when requesting that model (model-level, not a blanket account disable).
- Smart Warmup handles "verify when quota restores": when a model returns to 100%, trigger a lightweight request to confirm the link works, with 4-hour cooldown to avoid repeated disturbances.

Their corresponding config fields are in the frontend `AppConfig`:

- `quota_protection.enabled / threshold_percentage / monitored_models` (see `src/types/config.ts`)
- `scheduled_warmup.enabled / monitored_models` (see `src/types/config.ts`)

The actual logic determining "whether to skip this account when requesting this model" is in the backend TokenManager:

- The account file's `protected_models` participates in filtering in `get_token(..., target_model)` (see `src-tauri/src/proxy/token_manager.rs`)
- `target_model` first gets normalized (`normalize_to_standard_id`), so variants like `claude-sonnet-4-5-thinking` get collapsed into the same "protection group" (see `src-tauri/src/proxy/common/model_mapping.rs`)

## Next Lesson Preview

> In the next lesson, we learn **[Proxy Monitor: Request Logs, Filtering, Detail Reconstruction, and Export](/lbjlaq/Antigravity-Manager/advanced/monitoring/)**, turning API calls into an auditable evidence chain.

## Follow Along

### Step 1: First, Get Quota Data "Visible"

**Why**
Quota Protection makes judgments based on `quota.models[].percentage` in accounts. Without quota data, protection logic can't do anything for you.

Path: Open the **Accounts** page, click the refresh button in the toolbar (single account or bulk refresh both work).

**What you should see**: Account rows show quota percentages for each model (e.g., 0-100) and reset time.

### Step 2: Enable Smart Warmup in Settings (Optional, but Recommended)

**Why**
Smart Warmup's goal isn't "save quota," but "self-check the link when quota restores." It only triggers when model quota reaches 100%, and has a 4-hour cooldown.

Path: Enter **Settings**, switch to the account-related settings area, turn on the **Smart Warmup** toggle, then check the models you want to monitor.

Don't forget to save settings.

**What you should see**: Smart Warmup expands to show a model list; at least 1 model should remain checked.

### Step 3: Enable Quota Protection and Set Threshold + Monitored Models

**Why**
Quota Protection is the core of "preserve reserves": when a monitored model's quota percentage `<= threshold_percentage`, it writes that model to the account file's `protected_models`, and subsequent requests for that model prioritize avoiding these accounts.

Path: In **Settings**, turn on **Quota Protection**.

1. Set threshold (`1-99`)
2. Check the models you want to monitor (at least 1)

::: tip A good starting config
If you don't want to overthink, start with the default `threshold_percentage=10` (see `src/pages/Settings.tsx`).
:::

**What you should see**: Quota Protection keeps at least 1 model checked (the UI blocks you from unchecking the last one).

### Step 4: Confirm "Protection Group Normalization" Won't Trip You Up

**Why**
When TokenManager makes quota protection judgments, it first normalizes `target_model` to a standard ID (`normalize_to_standard_id`). For example, `claude-sonnet-4-5-thinking` gets normalized to `claude-sonnet-4-5`.

This means:

- You check `claude-sonnet-4-5` in Quota Protection
- When you actually request `claude-sonnet-4-5-thinking`

Protection still triggers (because they belong to the same group).

**What you should see**: When an account's `protected_models` contains `claude-sonnet-4-5`, requests for `claude-sonnet-4-5-thinking` prioritize avoiding that account.

### Step 5: When You Need Immediate Verification, Use "Manual Warmup" to Trigger Warmup

**Why**
The scheduled Smart Warmup scan cycle is once every 10 minutes (see `src-tauri/src/modules/scheduler.rs`). If you want to verify the link immediately, manual warmup is more direct.

Path: Open the **Accounts** page, click the "Warmup" button in the toolbar:

- No account selected: triggers bulk warmup (calls `warm_up_all_accounts`)
- Account(s) selected: triggers warmup for each selected account (calls `warm_up_account`)

**What you should see**: A toast appears, with content from the backend return string (e.g., "Warmup task triggered ...").

## Checkpoint ✅

- You can see model quota percentages for each account on the Accounts page (proves quota data path is OK)
- You can enable Quota Protection / Smart Warmup in Settings and successfully save config
- You understand `protected_models` is a "model-level" restriction: an account might only be avoided for certain models
- You know warmup has a 4-hour cooldown: clicking warmup repeatedly in a short time might show "skipped/cooldown" related messages

## Pitfall Alerts

### 1) You Enabled Quota Protection, But It Never Takes Effect

The most common reason: accounts don't have `quota` data. Protection logic in the backend needs to first read `quota.models[]` to judge thresholds (see `src-tauri/src/proxy/token_manager.rs`).

You can go back to **Step 1** and refresh quota first.

### 2) Why Do Only Some Models Get Treated as "Protection Groups"?

TokenManager's normalization of `target_model` is "whitelist-based": only explicitly listed model names get mapped to standard IDs (see `src-tauri/src/proxy/common/model_mapping.rs`).

After normalization, the logic is: use the normalized name (standard ID or original model name) to match the account's `protected_models` field. If match succeeds, that account is skipped (see `src-tauri/src/proxy/token_manager.rs:555-560, 716-719`). This means:

- Models within the whitelist (like `claude-sonnet-4-5-thinking`) get normalized to standard ID (`claude-sonnet-4-5`), then check if in `protected_models`
- When models outside the whitelist fail normalization, they fall back to original model name, and still match `protected_models`

In other words, quota protection judgments take effect for "all model names," but whitelisted models get normalized first.

### 3) Why Do Manual/Scheduled Warmups Need the Proxy Running?

Warmup requests eventually hit the local proxy's internal endpoint: `POST /internal/warmup` (see routes in `src-tauri/src/proxy/server.rs`, and implementation in `src-tauri/src/proxy/handlers/warmup.rs`). If you didn't start the proxy service, warmup fails.

Additionally, the port warmup uses comes from config: `proxy.port` (if config read fails, it falls back to `8045`, see `src-tauri/src/modules/quota.rs`).

## Lesson Summary

- Quota Protection does "stop the loss": below threshold, write model to `protected_models`, prioritize avoiding that account when requesting that model
- Smart Warmup does "self-check on restore": only triggers at 100%, scans every 10 minutes, with 4-hour cooldown
- Both depend on the "quota refresh" path: first have `quota.models[]`, then governance has a foundation

## Next Lesson Preview

Quota governance solves "how to spend more stably." The next lesson recommends continuing with **Proxy Monitor**, turning request logs, account hits, and model mapping into a replayable evidence chain.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
| --- | --- | --- |
| Quota Protection UI (threshold, model selection, keep at least 1) | [`src/components/settings/QuotaProtection.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/QuotaProtection.tsx#L13-L168) | 13-168 |
| Smart Warmup UI (default checked on enable, keep at least 1) | [`src/components/settings/SmartWarmup.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/SmartWarmup.tsx#L14-L120) | 14-120 |
| Quota governance config fields (`quota_protection` / `scheduled_warmup`) | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L54-L94) | 54-94 |
| Default threshold and default config (`threshold_percentage: 10`) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L20-L51) | 20-51 |
| Write/restore `protected_models` (threshold judgment and persist) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L254-L467) | 254-467 |
| Request-side quota protection filter (`get_token(..., target_model)`) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L470-L674) | 470-674 |
| Protection group normalization (`normalize_to_standard_id`) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L230-L254) | 230-254 |
| Smart Warmup scheduled scan (every 10 minutes + 4-hour cooldown + `warmup_history.json`) | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L11-L221) | 11-221 |
| Manual warmup commands (`warm_up_all_accounts` / `warm_up_account`) | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L167-L212) | 167-212 |
| Warmup implementation (calls internal endpoint `/internal/warmup`) | [`src-tauri/src/modules/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/quota.rs#L271-L512) | 271-512 |
| Internal warmup endpoint implementation (construct request + call upstream) | [`src-tauri/src/proxy/handlers/warmup.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/warmup.rs#L3-L220) | 3-220 |

</details>
