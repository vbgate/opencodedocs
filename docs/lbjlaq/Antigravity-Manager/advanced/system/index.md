---
title: "系统功能: 多语言/主题/更新/托盘/API | Antigravity-Manager"
sidebarTitle: "系统功能"
subtitle: "系统功能: 多语言/主题/更新/托盘/API"
description: "学习 Antigravity-Manager 的系统功能。包括多语言切换、主题设置、自动更新、托盘驻留和 HTTP API 服务配置绑定的本地接口和更新机制。"
tags:
  - "System Settings"
  - "i18n"
  - "Theme"
  - "Updates"
  - "Tray"
  - "HTTP API"
prerequisite:
  - "start-first-run-data"
  - "advanced-config"
order: 999
---

# System Capabilities: Multi-language/Theme/Updates/Auto-Start/HTTP API Server

You switch the theme to dark, but the interface is still light. You closed the window, but the process is still running in the background. You want external tools to switch the current account, but you don't want to expose the reverse proxy to your LAN.

This lesson focuses on Antigravity Tools' "system capabilities": language, theme, updates, tray/startup auto-start, and the HTTP API Server for external program calls.

## What are System Capabilities?

**System capabilities** refer to Antigravity Tools' "productization capabilities" as a desktop application: UI multi-language and theme switching, update checks and upgrades, tray persistence after closing the window and startup auto-start, and providing an HTTP API Server bound only to `127.0.0.1` for external program calls.

## What You'll Learn

- Switch language/theme and understand which changes "take effect immediately"
- Understand the difference between "closing window" and "exiting the app," and what the tray menu can do
- Know the trigger conditions, intervals, and persistence files for auto-update checks
- Enable HTTP API Server and verify health checks and account switching with `curl`

## 🎒 Prerequisites

- You know where the data directory is (see [First Run Essentials: Data Directory, Logs, Tray & Auto-Start](../../start/first-run-data/))
- You know `gui_config.json` is the single source of truth for configuration persistence (see [Configuration Deep Dive: AppConfig/ProxyConfig, Persistence Locations & Hot Update Semantics](../config/))

## Core Approach

It's easier to remember these capabilities if you divide them into two categories:

1. "Configuration-driven" capabilities: language and theme are written to `gui_config.json` (frontend calls `save_config`).
2. "Independent persistence" capabilities: update settings and HTTP API settings each have separate JSON files; tray and close behavior are controlled by the Tauri side.

## Follow Me

### Step 1: Switch Language (Immediate Effect + Auto Persistence)

**Why**
Language switching最容易让人误以为"needs restart." The implementation here is: UI switches immediately, and `language` is written back to the configuration.

Action: Open `Settings` -> `General`, select a language in the language dropdown.

You'll see two things happen almost simultaneously:

- UI immediately switches to the new language (frontend directly calls `i18n.changeLanguage(newLang)`).
- Configuration is persisted (frontend calls `updateLanguage(newLang)`, which internally triggers `save_config`).

::: info Where do language packs come from?
The frontend initializes multi-language resources with `i18next` and sets `fallbackLng: "en"`. This means: when a key lacks translation, it falls back to English.
:::

### Step 2: Switch Theme (light/dark/system)

**Why**
Theme affects not only CSS but also Tauri window background color, DaisyUI's `data-theme`, and Tailwind's `dark` class.

Action: In `Settings` -> `General`, switch theme to `light` / `dark` / `system`.

You should see:

- Theme takes effect immediately (`ThemeManager` reads configuration and applies it to `document.documentElement`).
- When theme is `system`, system dark/light changes sync to the app in real-time (listening to `prefers-color-scheme`).

::: warning One Exception on Linux
`ThemeManager` attempts to call `getCurrentWindow().setBackgroundColor(...)` to set window background color, but skips this step on Linux (source code has a note explaining: transparent window + softbuffer may cause crashes).
:::

### Step 3: Startup Auto-Start (and Why It Comes with `--minimized`)

**Why**
Startup auto-start is not a "configuration field" but a system-level registration item (Tauri autostart plugin).

Action: In `Settings` -> `General`, set "Auto-start on boot" to enable/disable.

You should see:

- Toggling directly calls the backend `toggle_auto_launch(enable)`.
- Page initialization calls `is_auto_launch_enabled()` to display the real status (not relying on local cache).

补充: The app passes `--minimized` parameter when initializing the autostart plugin, so "startup auto-start" usually launches in minimized/background mode (specific behavior depends on how the frontend handles this parameter).

### Step 4: Understand "Closing Window" vs "Exiting the App"

**Why**
Many desktop apps are "close to exit," but Antigravity Tools' default behavior is "close to hide to tray."

You should know:

- After clicking the window close button, Tauri intercepts the close event and `hide()` instead of exiting the process.
- Tray menu has `Show`/`Quit`: to completely exit, use `Quit`.
- Tray display text follows `config.language` (tray reads configuration language and translates text when created; after configuration updates, it listens to `config://updated` event to refresh tray menu).

### Step 5: Update Checks (Auto Trigger + Manual Check)

**Why**
Updates use two sets of things:

- Custom "version check" logic: fetch latest version from GitHub Releases, determine if there's an update.
- Tauri Updater: responsible for downloading and installing, then `relaunch()`.

You can use it like this:

1. Auto check: After app startup, `should_check_updates` is called. If a check is needed, `UpdateNotification` pops up and `last_check_time` is immediately updated.
2. Manual check: In `Settings` page, click "Check for Updates" (calls `check_for_updates`, and displays results in UI).

::: tip Where does the update interval come from?
Backend persists update settings to `update_settings.json` in the data directory, defaulting to `auto_check=true` and `check_interval_hours=24`.
:::

### Step 6: Enable HTTP API Server (Local Machine Only)

**Why**
If you want external programs (like VS Code plugins) to "switch accounts/refresh quota/read logs," HTTP API Server is more appropriate than the reverse proxy port: it's fixed to bind `127.0.0.1`, open only to the local machine.

Action: In `Settings` -> `Advanced`, in the "HTTP API" area:

1. Turn on enable switch.
2. Set port and click save.

You should see: UI prompts "restart required" (because backend only reads `http_api_settings.json` and starts the service on startup).

### Step 7: Verify HTTP API with curl (Health/Account/Switch/Logs)

**Why**
You need a repeatable verification loop: can get through `health`, can list accounts, can trigger switch/refresh and understand they're async tasks.

默认端口是 `19527`. If you've changed the port, replace `19527` in the following with your actual value.

::: code-group

```bash [macOS/Linux]
 # Health check
curl -sS "http://127.0.0.1:19527/health" && echo

 # List accounts (including quota summary)
curl -sS "http://127.0.0.1:19527/accounts" | head -n 5

 # Get current account
curl -sS "http://127.0.0.1:19527/accounts/current" | head -n 5

 # Trigger account switch (note: returns 202, background async execution)
curl -sS -i \
  -H 'Content-Type: application/json' \
  -d '{"account_id":"<account_id>"}' \
  "http://127.0.0.1:19527/accounts/switch"

 # Trigger refresh all quota (also 202, async execution)
curl -sS -i -X POST "http://127.0.0.1:19527/accounts/refresh"

 # Read proxy logs (limit/offset/filter/errors_only)
curl -sS "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | head -n 5
```

```powershell [Windows]
 # Health check
Invoke-RestMethod "http://127.0.0.1:19527/health"

 # List accounts
Invoke-RestMethod "http://127.0.0.1:19527/accounts" | ConvertTo-Json -Depth 5

 # Get current account
Invoke-RestMethod "http://127.0.0.1:19527/accounts/current" | ConvertTo-Json -Depth 5

 # Trigger account switch (returns 202)
$body = @{ account_id = "<account_id>" } | ConvertTo-Json
Invoke-WebRequest -Method Post -ContentType "application/json" -Body $body "http://127.0.0.1:19527/accounts/switch" | Select-Object -ExpandProperty StatusCode

 # Trigger refresh all quota (returns 202)
Invoke-WebRequest -Method Post "http://127.0.0.1:19527/accounts/refresh" | Select-Object -ExpandProperty StatusCode

 # Read proxy logs
Invoke-RestMethod "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | ConvertTo-Json -Depth 5
```

:::

**You should see**:

- `/health` returns JSON like `{"status":"ok","version":"..."}`.
- `/accounts/switch` returns 202 (Accepted), indicating "task started." The real switch executes in the background.

## Checkpoints ✅

- You can explain: why language/theme "changes take effect immediately," but HTTP API port requires restart
- You can explain: why closing the window doesn't exit, and where to actually exit from
- You can use `curl` to get through `/health` and `/accounts`, and understand `/accounts/switch` is async

## Pitfall Reminders

1. HTTP API Server is fixed to bind `127.0.0.1`; it's different from `proxy.allow_lan_access`.
2. Update check's "whether to check" logic is determined at app startup; once triggered, it updates `last_check_time` first. Even if the subsequent check fails, it won't repeatedly pop up windows in a short time.
3. "Close window without exit" is by design: to release process resources, use tray `Quit`.

## Lesson Summary

- Language: UI switches immediately + write back to config (`i18n.changeLanguage` + `save_config`)
- Theme: `ThemeManager` uniformly applies to `data-theme`, `dark` class, and window background color (Linux has an exception)
- Updates: At startup, `update_settings.json` decides whether to pop up; installation is handled by Tauri Updater
- HTTP API: Enabled by default, accessible only on local machine, config persisted to `http_api_settings.json`, port change requires restart

## Next Lesson Preview

> Next lesson will cover **Server Deployment: Docker noVNC vs Headless Xvfb (advanced-deployment)**, moving the desktop app to run on NAS/servers.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Topic | File Path | Line Numbers |
| --- | --- | --- |
| i18n initialization and fallback | [`src/i18n.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/i18n.ts#L1-L67) | 1-67 |
| Settings: language/theme/startup auto-start/update settings/HTTP API settings | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L16-L730) | 16-730 |
| App: sync language + trigger update check on startup | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L52-L124) | 52-124 |
| ThemeManager: apply theme, listen to system theme, write to localStorage | [`src/components/common/ThemeManager.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/ThemeManager.tsx#L1-L82) | 1-82 |
| UpdateNotification: check updates, auto download install and relaunch | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L1-L217) | 1-217 |
| Update check: GitHub Releases + check interval | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L1-L187) | 1-187 |
| Tray: generate menu by language + listen to `config://updated` refresh | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L1-L255) | 1-255 |
| Config save: emit `config://updated` + hot update running reverse proxy | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| Startup auto-start commands: toggle/is_enabled (Windows disable compatibility) | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L1-L39) | 1-39 |
| Tauri: initialize autostart/updater + close window to hide + start HTTP API | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L160) | 50-160 |
| HTTP API: settings persistence + routes (health/accounts/switch/refresh/logs) + only bind 127.0.0.1 | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L1-L95) | 1-95 |
| HTTP API: Server bind and route registration | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L51-L94) | 51-94 |
| HTTP API settings commands: get/save | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L773-L789) | 773-789 |

</details>
