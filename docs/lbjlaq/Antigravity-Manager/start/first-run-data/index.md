---
title: "First Run: Data & Logs | Antigravity"
sidebarTitle: "First Run"
subtitle: "First Run Essentials"
description: "Learn Antigravity data directory and log locations. Find accounts.json, logs, databases, tray menu, and auto-start."
tags:
  - "First Run"
  - "Data Directory"
  - "Logs"
  - "Tray"
  - "Auto-Start"
prerequisite:
  - "start-getting-started"
  - "start-installation"
order: 999
---

# First Run Essentials: Data Directory, Logs, Tray & Auto-Start

Many of Antigravity Tools' "seemingly magical" capabilities (account pool, quota, monitoring, statistics, background running) ultimately come down to two things: **data directory** and **logs**. Get these two pieces clear on your first run, and you'll save a lot of time on troubleshooting later.

## What is the Data Directory?

The **data directory** is the folder where Antigravity Tools saves state on your local machine: account JSON files, quota-related files, log files, and SQLite databases for Token Stats/Proxy Monitor are all stored here. When you do backup/migration/troubleshooting, once you locate this directory, you basically have the authoritative data source.

## What You'll Learn

- Know where Antigravity Tools' data directory is (and how to open it with one click)
- Distinguish which files to back up vs which are logs/cache
- Quickly locate logs and monitoring databases when troubleshooting
- Understand the difference between "closing window" and "exiting the app" (tray persistence)
- Distinguish two types of auto-start: startup auto-start vs reverse proxy auto-start

## Your Current Struggles

- You want to back up/migrate accounts, but don't know where accounts are actually saved
- UI reports errors/reverse proxy calls fail, but you can't find the logs
- You closed the window and thought the app exited, but it's still running in the background

## When to Use This Approach

- You just installed Antigravity Tools and want to confirm "where the data is stored"
- You're preparing to switch computers/reinstall the system and want to back up accounts and statistics first
- You need to troubleshoot: OAuth failures, quota refresh failures, reverse proxy startup failures, 401/429 errors on calls

## 🎒 Prerequisites

- Antigravity Tools installed and can be opened
- You can access the Settings page (settings entry in top-right or sidebar)
- Your system account has permission to access your Home directory

::: warning Reminder
This lesson will tell you which files are "real data," but we don't recommend manually editing these files. To change configuration, prioritize making changes in the UI.
:::

## Core Approach

Remember this phrase first:

"**The data directory is the single source of truth for local state; logs are the first entry point for troubleshooting.**"

Antigravity Tools will create a `.antigravity_tools` data directory under your Home directory and put accounts, logs, statistics databases, and other content in there (the directory will be automatically created if it doesn't exist).

At the same time, it enables the tray by default: when you close the window, the app won't exit immediately but will hide to the tray and continue running in the background.

## Follow Me

### Step 1: Open the Data Directory in Settings

**Why**
You first get the data directory accurately located, so whether you're backing up or troubleshooting later, you have a "landing point."

Open Settings in Antigravity Tools, then switch to Advanced.

You'll see a "Data Directory" read-only input field (it will show the real path), with an open button next to it.

Click the open button.

**You should see**: The system file manager opens a directory with a path like `~/.antigravity_tools/`.

### Step 2: Confirm Your Data Directory Path (Cross-Platform)

**Why**
You'll need to know the actual path of this directory on your system when you write scripts for backup or troubleshoot issues in the command line later.

::: code-group

```bash [macOS/Linux]
echo "$HOME/.antigravity_tools"
ls -la "$HOME/.antigravity_tools"
```

```powershell [Windows]
$dataDir = Join-Path $HOME ".antigravity_tools"
$dataDir
Get-ChildItem -Force $dataDir
```

:::

**You should see**: The directory exists (if you're opening the Settings page for the first time, the directory will be automatically created).

### Step 3: Recognize the "Key Files" in the Data Directory

**Why**
Not all files are worth backing up. First, distinguish "which are account data" vs "which are statistics databases/logs."

The following filenames come from the project source code and are all fixed:

| What You'll See | Purpose | What You Need to Care About |
| --- | --- | --- |
| `accounts.json` | Account index (includes account list/current account) | Recommend backing up together when migrating accounts |
| `accounts/` | One `*.json` file per account | This is the main account data |
| `logs/` | Application log directory | Look here first when troubleshooting |
| `token_stats.db` | SQLite database for Token Stats | The data you see on the Token Stats page comes from this |
| `proxy_logs.db` | SQLite database for Proxy Monitor | The request logs you see on the Monitor page come from this |
| `warmup_history.json` | Local history for Smart Warmup | Mainly used to avoid repeated warmups |
| `update_settings.json` | Update check settings (auto check/interval, etc.) | Generally no need to manually touch it |

**You should see**: At minimum there's a `logs/` directory; if you haven't added accounts yet, `accounts.json`/`accounts/` might not have appeared yet.

### Step 4: Keep the Log Location in Mind (Troubleshooting Relies on It)

**Why**
UI error messages usually only show "symptoms," while the real failure causes (e.g., request failures, file read/write failures) are often in the logs.

Antigravity Tools writes logs to `logs/` under the data directory.

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/logs"
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs")
```

:::

**You should see**: There are log files that rotate daily under the directory (filenames start with `app.log`).

### Step 5: When You Need to "Clear Logs," Use One-Click Cleanup in Settings

**Why**
Some problems you only want to reproduce once, then keep that log separately; in this case, clearing logs first makes for better comparison.

In Settings -> Advanced, find the logs area and click "Clear Logs."

**You should see**: A confirmation dialog appears; after confirming, it indicates cleanup succeeded.

::: tip Two Things You Might Worry About
- Logs automatically "rotate daily" and will attempt to clean up old logs over 7 days old at startup.
- "Clear Logs" truncates log files to 0 bytes, so the currently running process can continue writing to the same file handle.
:::

### Step 6: Understand the Difference Between "Closing Window" and "Exiting the App" (Tray)

**Why**
Antigravity Tools enables the tray by default; when you click close in the top-right of the window, the app will hide to the tray and continue running. If you think it exited, it's easy to get the illusion that "the port is still in use/the app is still running in the background."

You can use this small workflow to confirm:

```
Action: Close window (not exit)

┌─────────────────────────────────────────────────────────────┐
│  Step 1                Step 2                               │
│  Click window close →   Go to system tray/menu bar to find icon │
└─────────────────────────────────────────────────────────────┘

You should see: The tray icon still exists, click it to show the window again.
```

The tray menu also has two common actions (convenient when not going through the UI):

- Switch Account: Switch to the next account
- Refresh Quota: Refresh current account quota (also notifies the frontend to refresh display)

### Step 7: Set Startup Auto-Start (Let It Auto-Minimize on Launch)

**Why**
If you want it to work like a "resident service" (tray persistence + background refresh), startup auto-start will save you from manually opening it every time.

In Settings -> General, find "Auto-start on boot" and select enable.

**You should see**: After toggling, it indicates enablement succeeded; on next startup, it will run with the `--minimized` parameter.

::: info Two Types of "Auto-Start," Don't Get Confused
| Name | What It Refers To | Evidence |
| --- | --- | --- |
| Startup auto-start | Automatically start Antigravity Tools after computer boots (the desktop app itself) | Startup parameters include `--minimized`, and `toggle_auto_launch` command is provided |
| Reverse proxy auto-start | After Antigravity Tools starts, if `proxy.auto_start=true` is configured, it will attempt to auto-start the local reverse proxy service | Reads configuration at app startup and calls `start_proxy_service(...)` |
:::

## Checkpoints ✅

- [ ] You can see the real path of the data directory in Settings -> Advanced
- [ ] You can open the data directory and roughly recognize `accounts.json`, `accounts/`, `logs/`, `token_stats.db`, `proxy_logs.db`
- [ ] You know logs are under `logs/` and can quickly view them from the command line
- [ ] You know the app is still in the tray after closing the window, and you need to use the tray Quit to exit
- [ ] You can distinguish "startup auto-start" from "reverse proxy auto-start"

## Pitfall Reminders

| Scenario | What You Might Do (❌) | Recommended Approach (✓) |
| --- | --- | --- |
| Can't find the data directory | Randomly search for the App's installation directory in the system | Go directly to Settings -> Advanced to see "Data Directory" and open with one click |
| Closed window and thought it exited | Changed configuration/changed ports after clicking window close | First check if the tray icon is still there; to exit, use tray Quit |
| Too many logs to troubleshoot | Flipping through old logs while reproducing the problem | First "Clear Logs," then reproduce once, and finally only look at this log file |
| Want to modify account data | Manually edit `accounts/*.json` | Use UI import/export/migration flows (next related chapters will explain) |

## Lesson Summary

- The data directory is fixed at `.antigravity_tools` under Home (usually appears as a hidden directory on macOS/Linux), with accounts/logs/statistics databases all here
- The log directory is `logs/`, look here first when troubleshooting; when needed, you can clear with one click in Settings
- Closing the window hides to the tray and continues running; to completely exit, use tray Quit
- Auto-start has two types: startup auto-start (app) and reverse proxy auto-start (Proxy)

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Adding Accounts: OAuth/Refresh Token Dual Channels & Best Practices](../add-account/)**.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Function | File Path | Line Numbers |
| --- | --- | --- |
| Data directory location (`~/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Account index and account files directory (`accounts.json` / `accounts/`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L46) | 16-46 |
| Log directory and daily rotation (`logs/` + `app.log`) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L83) | 17-83 |
| Clear logs (truncate file) | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L149-L169) | 149-169 |
| Settings page shows data directory + one-click open | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L525-L576) | 525-576 |
| Settings page one-click clear logs (button + dialog logic) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L127-L135) | 127-135 |
| Settings page one-click clear logs (Advanced tab button) | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L732-L747) | 732-747 |
| Tray menu and click events (switch account/refresh/show/exit) | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L9-L158) | 9-158 |
| Close window -> hide (minimize to tray) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L150-L160) | 150-160 |
| Startup auto-start plugin initialization (includes `--minimized`) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L58-L66) | 58-66 |
| Startup auto-start toggle (`toggle_auto_launch` / `is_auto_launch_enabled`) | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L4-L39) | 4-39 |
| One-click open data directory / get path / clear logs commands | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L578-L621) | 578-621 |
| Token Stats database filename (`token_stats.db`) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L61) | 58-61 |
| Proxy Monitor database filename (`proxy_logs.db`) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L8) | 5-8 |
| Warmup history filename (`warmup_history.json`) | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L14-L17) | 14-17 |
| Update settings filename (`update_settings.json`) | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L150-L177) | 150-177 |
| Reverse proxy auto-start (start service when `proxy.auto_start=true`) | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L107-L126) | 107-126 |

</details>

## Next Lesson Preview

> In the next lesson, we'll learn **[Adding Accounts: OAuth/Refresh Token Dual Channels & Best Practices](../add-account/)**.
>
> You'll learn:
> - When to use OAuth, when to use refresh_token directly
> - How to handle callback failures and when you can't get refresh_token
> - How to batch import refresh_token to quickly build an account pool
