---
title: "Backup & Migrate: JSON Import/Export | Antigravity-Manager"
sidebarTitle: "Backup & Migrate"
subtitle: "Backup & Migrate: JSON Import/Export, V1/DB Hot Migration"
description: "Learn Antigravity-Manager account backup and migration. Export refresh_token as JSON for one-click import on new machines. Import from Antigravity/IDE state.vscdb or V1 data directory. Use auto-sync to keep current account synced with local login state changes."
tags:
  - "Account Management"
  - "Backup"
  - "Migration"
  - "Import/Export"
  - "state.vscdb"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
duration: 12
order: 999
---
# Account Backup & Migration: Import/Export, V1/DB Hot Migration

What you really want to "backup" isn't the quota number, but the `refresh_token` that lets the account log back in. This lesson explains Antigravity Tools' migration methods: JSON import/export, importing from `state.vscdb`, importing from V1 data directory, and how auto-sync works.

## What You'll Learn

- Export your account pool as a JSON file (containing only email + refresh_token)
- Import this JSON on a new machine to quickly restore your account pool
- Directly import "currently logged-in account" from Antigravity/IDE's `state.vscdb` (supports default path and custom path)
- Automatically scan and import old accounts from V1 data directory
- Understand what "auto-sync current account" actually does and when it skips

## Your Current Pain Points

- After reinstalling system or switching computers, you need to re-add all accounts to the pool, which is costly
- You switched logged-in accounts in Antigravity/IDE, but Manager's "current account" didn't follow
- You previously used V1/script version and only have old data files, unsure if they can be directly migrated

## When to Use This

- You want to move your account pool to another machine (desktop/server/container)
- You treat Antigravity as the "authoritative login entry" and want Manager to auto-sync current account
- You want to migrate accounts from old version (V1 data directory)

## 🎒 Preparation

- You can open Antigravity Tools and have at least one account in the account pool
- You understand that account data is sensitive information (especially `refresh_token`)

::: warning Security Reminder: Treat backup files like passwords
The exported JSON file contains `refresh_token`. Anyone who obtains it could use it to refresh access tokens. Don't upload backup files to public cloud storage links, don't share in groups, don't commit to Git.
:::

## Core Concept

Antigravity Tools' "migration" essentially does two things:

1) Find available `refresh_token`
2) Use it to exchange for access token, fetch real email from Google, then write the account into local account pool

It provides three entry points:

- JSON Import/Export: suitable when you explicitly want "controlled backup"
- DB Import: suitable when you treat Antigravity/IDE's login state as authoritative source (defaults to finding `state.vscdb`, also supports manual file selection)
- V1 Import: suitable for automatically scanning and migrating from old data directory

Additionally, there's "auto-sync": it periodically reads refresh_token from DB, and if different from Manager's current account, automatically performs a DB import; if same, it skips (saving traffic).

## Follow Along

### Step 1: Export Account Pool (JSON Backup)

**Why**
This is the most stable, controllable migration method. You get a file and can restore the account pool on another machine.

Operation: Go to `Accounts` page, click export button.

- If you configured `default_export_path` in settings, export will write directly to that directory using filename `antigravity_accounts_YYYY-MM-DD.json`.
- If default directory is not configured, a system save dialog will pop up for you to choose the path.

Export file content roughly looks like this (each item in array keeps only necessary fields):

```json
[
  {
    "email": "alice@example.com",
    "refresh_token": "1//xxxxxxxxxxxxxxxxxxxxxxxx"
  },
  {
    "email": "bob@example.com",
    "refresh_token": "1//yyyyyyyyyyyyyyyyyyyyyyyy"
  }
]
```

**You should see**: Page displays export success message and shows save path.

### Step 2: Import JSON on New Machine (Restore Account Pool)

**Why**
Import will call "add account" logic one by one, use `refresh_token` to fetch real email and write into account pool.

Operation: Still on `Accounts` page, click "Import JSON", choose the file you just exported.

Format requirements as follows (at least 1 valid record required):

- Must be a JSON array
- System will only import entries containing `refresh_token` that start with `1//`

**You should see**: After import finishes, imported accounts appear in account list.

::: tip If Proxy is running when you import
After each successful "add account", backend will try to reload reverse-proxy token pool, making new accounts take effect immediately.
:::

### Step 3: Import "Currently Logged-In Account" from `state.vscdb`

**Why**
Sometimes you don't want to maintain backup files, just want "use Antigravity/IDE's login state as the source of truth". DB import is prepared for this scenario.

Operation: Go to `Accounts` page, click **Add Account**, switch to `Import` tab:

- Click "Import from Database" (use default DB path)
- Or click "Custom DB (state.vscdb)" to manually select a `*.vscdb` file

Default DB path is cross-platform (also prioritizes recognizing `--user-data-dir` or portable mode):

::: code-group

```text [macOS]
~/Library/Application Support/Antigravity/User/globalStorage/state.vscdb
```

```text [Windows]
%APPDATA%\Antigravity\User\globalStorage/state.vscdb
```

```text [Linux]
~/.config/Antigravity/User/globalStorage/state.vscdb
```

:::

**You should see**:

- After successful import, this account will be automatically set as Manager's "current account"
- System will automatically trigger a quota refresh

### Step 4: Migrate from V1 Data Directory (Old Version Import)

**Why**
If you previously used V1/script version, Manager allows you to directly scan old data directory and try to import.

Operation: On `Import` tab, click "Import V1".

It will look for this path in your home directory (and its index files):

```text
~/.antigravity-agent/
  - antigravity_accounts.json
  - accounts.json
```

**You should see**: After import completes, accounts appear in list; if index files not found, backend will return error `V1 account data file not found`.

### Step 5 (Optional): Enable "Auto-Sync Current Account"

**Why**
When you switch logged-in accounts in Antigravity/IDE, Manager can detect at fixed intervals whether refresh_token in DB changed, and automatically import when changed.

Operation: Go to `Settings`, enable `auto_sync`, and set `sync_interval` (unit: seconds).

**You should see**: Immediately executes one sync after enabling; thereafter executes periodically at interval. If refresh_token in DB is same as current account, it will skip directly and not repeatedly import.

## Checkpoint ✅

- You can see imported accounts in `Accounts` list
- You can see "current account" has switched to your expected one (DB import automatically sets as current)
- After you start Proxy, newly imported accounts can be normally used for requests (based on actual call results)

## Pitfall Warnings

| Scenario | What you might do (❌) | Recommended approach (✓) |
|--- | --- | ---|
| Backup file security | Treat exported JSON as normal config file and casually share it | Treat JSON as password, minimize spread scope, avoid public internet exposure |
| JSON import failed | JSON is not an array, or refresh_token doesn't have `1//` prefix | Use JSON exported by this project as template, keep field names and structure consistent |
| DB import can't find data | Antigravity hasn't logged in, or DB is missing `jetskiStateSync.agentManagerInitState` | First confirm Antigravity/IDE has logged in, then try import; if necessary use Custom DB to select correct file |
| Account unusable after V1 import | Old refresh_token expired | Delete that account and re-add with OAuth/new refresh_token (follow error prompt) |
| auto_sync too frequent | `sync_interval` set very small, frequently scanning DB | Treat it as "state following", set interval to a frequency you can accept |

## Lesson Summary

- JSON export/import is the most controllable migration method: backup file only keeps `email + refresh_token`
- DB import is suitable for "use Antigravity/IDE's currently logged-in account as the source of truth", and will automatically set as Manager's current account
- V1 import scans `~/.antigravity-agent` and is compatible with multiple old formats
- auto_sync compares refresh_token; same ones are skipped, no repeated import

## Next Lesson Preview

> In the next lesson, we'll put "migrated account pool" to real use: **[Start local reverse-proxy and integrate first client (/healthz + SDK configuration)](../proxy-and-first-client/)**.
>
> You'll learn:
> - How to start/stop Proxy, and use `/healthz` for minimal verification
> - How to configure Base URL in SDK/client

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Accounts export/import JSON (`save_text_file` / `read_text_file`) | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L458-L578) | 458-578 |
| Dashboard export account JSON | [`src/pages/Dashboard.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Dashboard.tsx#L113-L148) | 113-148 |
| Import tab: DB import / Custom DB / V1 import buttons | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L491-L539) | 491-539 |
|--- | --- | ---|
|--- | --- | ---|
| DB import: extract refresh_token from `state.vscdb` (ItemTable + base64 + protobuf) | [`src-tauri/src/modules/migration.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/migration.rs#L192-L267) | 192-267 |
|--- | --- | ---|
|--- | --- | ---|
| auto_sync: compare refresh_token, skip if same; trigger DB import if changed | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L532-L564) | 532-564 |
| Frontend background task: periodically call `syncAccountFromDb()` by `sync_interval` | [`src/components/common/BackgroundTaskRunner.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/BackgroundTaskRunner.tsx#L43-L72) | 43-72 |

</details>
