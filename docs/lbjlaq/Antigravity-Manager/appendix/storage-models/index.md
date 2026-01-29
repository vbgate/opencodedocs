---
title: "Storage Models: Data & SQLite | Antigravity-Manager"
sidebarTitle: "Storage Models"
subtitle: "Storage Models: Data & SQLite"
description: "Learn Antigravity-Manager data storage and SQLite structures. Master account files, key fields, and database schemas for token_stats.db and proxy_logs.db."
tags:
  - "Appendix"
  - "Data Models"
  - "Storage Structure"
  - "Backup"
prerequisite:
  - "start-backup-migrate"
order: 999
---

# Data & Models: Account Files, SQLite Statistics Database & Key Field Specifications

## What You'll Learn

- Quickly locate storage positions for account data, statistics databases, configuration files, and log directories
- Understand the JSON structure of account files and the meanings of key fields
- Directly query proxy request logs and Token consumption statistics via SQLite
- Know which files to examine during backup, migration, and troubleshooting

## Your Current Struggles

When you need to:
- **Migrate accounts to a new machine**: Don't know which files to copy
- **Troubleshoot account anomalies**: Don't know which fields in the account file can indicate account status
- **Export Token consumption**: Want to query directly from the database but don't know the table structure
- **Clean up historical data**: Afraid of deleting the wrong files and losing data

This appendix will help you build a complete understanding of the data model.

---

## Data Directory Structure

Antigravity Tools' core data is stored by default in the `.antigravity_tools` directory under the "user home directory" (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: warning Security Boundary First
This directory contains sensitive information like `refresh_token`/`access_token` (source: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`). Before backing up/copying/sharing, confirm your target environment is trusted.
:::

### Where Should I Look for This Directory?

::: code-group

```bash [macOS/Linux]
## Enter data directory
cd ~/.antigravity_tools

## Or open in Finder (macOS)
open ~/.antigravity_tools
```

```powershell [Windows]
## Enter data directory
Set-Location "$env:USERPROFILE\.antigravity_tools"

## Or open in File Explorer
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### Directory Tree Overview

```
~/.antigravity_tools/
├── accounts.json          # Account index (version 2.0)
├── accounts/              # Account directory
│   └── <account_id>.json  # One file per account
├── gui_config.json        # Application configuration (written by GUI)
├── token_stats.db         # Token statistics database (SQLite)
├── proxy_logs.db          # Proxy monitoring log database (SQLite)
├── logs/                  # Application log directory
│   └── app.log*           # Daily rotation (filename changes with date)
├── bin/                   # External tools (e.g., cloudflared)
│   └── cloudflared(.exe)
└── device_original.json   # Device fingerprint baseline (optional)
```

**Data directory path rule**: Takes `dirs::home_dir()`, appends `.antigravity_tools` (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: tip Backup Recommendation
Regularly backing up the `accounts/` directory, `accounts.json`, `token_stats.db`, and `proxy_logs.db` will save all core data.
:::

---

## Account Data Model

### accounts.json (Account Index)

The account index file records summary information for all accounts and the currently selected account.

**Location**: `~/.antigravity_tools/accounts.json`

**Schema** (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`):

```json
{
  "version": "2.0",                  // Index version
  "accounts": [                       // Account summary list
    {
      "id": "uuid-v4",              // Account unique ID
      "email": "user@gmail.com",     // Account email
      "name": "Display Name",        // Display name (optional)
      "created_at": 1704067200,      // Creation time (Unix timestamp)
      "last_used": 1704067200       // Last used time (Unix timestamp)
    }
  ],
  "current_account_id": "uuid-v4"    // Currently selected account ID
}
```

### Account File ({account_id}.json)

Each account's complete data is stored independently in JSON format under the `accounts/` directory.

**Location**: `~/.antigravity_tools/accounts/{account_id}.json`

**Schema** (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42`; frontend types: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`):

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // OAuth Token data
    "access_token": "ya29...",      // Current access token
    "refresh_token": "1//...",      // Refresh token (most important)
    "expires_in": 3600,            // Expiration time (seconds)
    "expiry_timestamp": 1704070800, // Expiration timestamp
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // Optional: Google Cloud Project ID
    "session_id": "..."            // Optional: Antigravity sessionId
  },

  "device_profile": {               // Device fingerprint (optional)
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // Device fingerprint historical versions
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Saved from device X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // Quota data (optional)
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // Remaining quota percentage
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // Subscription type: FREE/PRO/ULTRA
  },

  "disabled": false,                // Whether the account is completely disabled
  "disabled_reason": null,          // Reason for disable (e.g., invalid_grant)
  "disabled_at": null,             // Disable timestamp

  "proxy_disabled": false,         // Whether to disable proxy functionality
  "proxy_disabled_reason": null,   // Reason for proxy disable
  "proxy_disabled_at": null,       // Proxy disable timestamp

  "protected_models": [             // List of models protected by quota
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### Key Field Explanations

| Field | Type | Business Meaning | Trigger Condition |
| ----- | ---- | ---------------- | ----------------- |
| `disabled` | bool | Account completely disabled (e.g., refresh_token invalid) | Automatically set to `true` on `invalid_grant` |
| `proxy_disabled` | bool | Only disables proxy functionality, doesn't affect GUI use | Manual disable or triggered by quota protection |
| `protected_models` | string[] | List of "restricted models" for model-level quota protection | Updated by quota protection logic |
| `quota.models[].percentage` | number | Remaining quota percentage (0-100) | Updated on each quota refresh |
| `token.refresh_token` | string | Credential for obtaining access_token | Obtained during OAuth authorization, long-term valid |

**Important Rule 1: invalid_grant Triggers Disable** (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889`; write to disk: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`):

- When token refresh fails and the error contains `invalid_grant`, TokenManager writes `disabled=true`/`disabled_at`/`disabled_reason` to the account file and removes the account from the token pool.

**Important Rule 2: Semantics of protected_models** (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250`; quota protection write: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`):

- `protected_models` stores "normalized model IDs," used for model-level quota protection and scheduling skip.

---

## Token Statistics Database

The Token statistics database records Token consumption for each proxy request, used for cost monitoring and trend analysis.

**Location**: `~/.antigravity_tools/token_stats.db`

**Database Engine**: SQLite + WAL mode (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`)

### Table Structure

#### token_usage (Raw Usage Records)

| Field | Type | Description |
| ---- | ---- | ---- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Auto-increment primary key |
| timestamp | INTEGER | Request timestamp |
| account_email | TEXT | Account email |
| model | TEXT | Model name |
| input_tokens | INTEGER | Input Token count |
| output_tokens | INTEGER | Output Token count |
| total_tokens | INTEGER | Total Token count |

**Create table statement** (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`):

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly (Hourly Aggregation Table)

Aggregates Token usage once per hour for quickly querying trend data.

**Create table statement** (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`):

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- Time bucket (format: YYYY-MM-DD HH:00)
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### Indexes

To improve query performance, the database establishes the following indexes (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`):

```sql
-- Index by time descending
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- Index by account
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### Common Query Examples

#### Query Token Consumption in the Last 24 Hours

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### Query Consumption by Model

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info Time Field Specification
`token_usage.timestamp` is a Unix timestamp (seconds) written by `chrono::Utc::now().timestamp()`, and `token_stats_hourly.hour_bucket` is also a UTC-generated string (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`).
:::

---

## Proxy Monitoring Log Database

The Proxy log database records detailed information for each proxy request, used for troubleshooting and request auditing.

**Location**: `~/.antigravity_tools/proxy_logs.db`

**Database Engine**: SQLite + WAL mode (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`)

### Table Structure: request_logs

| Field | Type | Description |
| ---- | ---- | ---- |
| id | TEXT PRIMARY KEY | Request unique ID (UUID) |
| timestamp | INTEGER | Request timestamp |
| method | TEXT | HTTP method (GET/POST) |
| url | TEXT | Request URL |
| status | INTEGER | HTTP status code |
| duration | INTEGER | Request duration (milliseconds) |
| model | TEXT | Model name requested by client |
| mapped_model | TEXT | Actual model name used after routing |
| account_email | TEXT | Account email used |
| error | TEXT | Error message (if any) |
| request_body | TEXT | Request body (optional, large space usage) |
| response_body | TEXT | Response body (optional, large space usage) |
| input_tokens | INTEGER | Input Token count |
| output_tokens | INTEGER | Output Token count |
| protocol | TEXT | Protocol type (openai/anthropic/gemini) |

**Create table statement** (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`):

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- Compatibility: Gradually add new fields via ALTER TABLE
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### Indexes

```sql
-- Index by time descending
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- Index by status code
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### Automatic Cleanup

When the system starts ProxyMonitor, it automatically cleans up logs older than 30 days and runs `VACUUM` on the database (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`; implementation: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`).

### Common Query Examples

#### Query Recent Failed Requests

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### Query Request Success Rate by Account

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## Configuration Files

### gui_config.json

Stores application configuration information, including proxy settings, model mapping, authentication mode, etc.

**Location**: `~/.antigravity_tools/gui_config.json` (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`)

This file's structure follows `AppConfig` (source: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`).

::: tip When You Only Need "Backup/Migration"
The most reliable approach is: close the application and directly pack the entire `~/.antigravity_tools/`. Configuration hot update/restart semantics are "runtime behaviors"; see the advanced lesson **[Config Deep Dive](../../advanced/config/)** for details.
:::

---

## Log Files

### Application Logs

**Location**: `~/.antigravity_tools/logs/` (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`)

Logs use daily rolling files, with the base filename `app.log` (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`).

**Log Levels**: INFO/WARN/ERROR

**Purpose**: Records key events, error messages, and debug information during application runtime, used for troubleshooting.

---

## Data Migration & Backup

### Backup Core Data

::: code-group

```bash [macOS/Linux]
## Backup entire data directory (most stable)
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## Backup entire data directory (most stable)
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### Migrate to New Machine

1. Close Antigravity Tools (to avoid files being copied while being written)
2. Copy `.antigravity_tools` from the source machine to the target machine's user home directory
3. Start Antigravity Tools

::: tip Cross-Platform Migration
If migrating from Windows to macOS/Linux (or vice versa), simply copying the entire `.antigravity_tools` directory is sufficient; the data format is cross-platform compatible.
:::

### Clean Historical Data

::: info Conclusion First
- `proxy_logs.db`: Automatically cleans up after 30 days (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`).
- `token_stats.db`: Initializes table structure on startup (source: `source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`), but I don't see logic for "automatically cleaning historical records by day" in the source code.
:::

::: danger Only Do This When You Confirm You Don't Need Historical Data
Clearing statistics/logs will make you lose historical troubleshooting and cost analysis data. Back up the entire `.antigravity_tools` before proceeding.
:::

If you just want to "clear history and start fresh," the most stable approach is to delete the DB files after closing the application (table structure will be rebuilt on next startup).

::: code-group

```bash [macOS/Linux]
## Clear Token statistics (will lose history)
rm -f ~/.antigravity_tools/token_stats.db

## Clear Proxy monitoring logs (will lose history)
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## Clear Token statistics (will lose history)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## Clear Proxy monitoring logs (will lose history)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## Common Field Specifications

### Unix Timestamp

All time-related fields (such as `created_at`, `last_used`, `timestamp`) use Unix timestamp (second-level precision).

**Convert to Readable Time**:

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## SQLite query (example: convert request_logs.timestamp to human-readable time)
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### Quota Percentage

`quota.models[].percentage` represents the remaining quota percentage (0-100) (source: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40`; backend model: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`).

Whether "quota protection" is triggered is determined by `quota_protection.enabled/threshold_percentage/monitored_models` (source: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63`; write to `protected_models`: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`).

---

## Lesson Summary

- Antigravity Tools' data directory is in `.antigravity_tools` under the user home directory
- Account data: `accounts.json` (index) + `accounts/<account_id>.json` (complete data for single account)
- Statistics data: `token_stats.db` (Token statistics) + `proxy_logs.db` (Proxy monitoring logs)
- Configuration & operations: `gui_config.json`, `logs/`, `bin/cloudflared*`, `device_original.json`
- The most stable backup/migration approach is "pack the entire `.antigravity_tools` after closing the application"

---

## Next Lesson Preview

> In the next lesson, we'll learn **[z.ai Integration Capabilities Boundaries](../zai-boundaries/)**.
>
> You'll learn:
> - List of implemented z.ai integration features
> - Clearly identify unimplemented features and usage limitations
> - Vision MCP experimental implementation explanation

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Function | File Path | Line Numbers |
| --- | --- | --- |
| Data directory (.antigravity_tools) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| Account directory (accounts/) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| accounts.json structure | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Account structure (backend) | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Account structure (frontend) | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| TokenData/QuotaData structure | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| TokenData/QuotaData structure | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Token statistics database initialization (schema) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Proxy log database initialization (schema) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Proxy log auto cleanup (30 days) | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Proxy log auto cleanup implementation | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| gui_config.json read/write | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| logs/ directory & app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| bin/cloudflared path | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
| invalid_grant -> disabled write to disk | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L869-L969) | 869-969 |

**Key Constants**:
- `DATA_DIR = ".antigravity_tools"`: Data directory name (`src-tauri/src/modules/account.rs:16-18`)
- `ACCOUNTS_INDEX = "accounts.json"`: Account index filename (`src-tauri/src/modules/account.rs:16-18`)
- `CONFIG_FILE = "gui_config.json"`: Configuration file name (`src-tauri/src/modules/config.rs:7`)

**Key Functions**:
- `get_data_dir()`: Get data directory path (`src-tauri/src/modules/account.rs`)
- `record_usage()`: Write to `token_usage`/`token_stats_hourly` (`src-tauri/src/modules/token_stats.rs`)
- `save_log()`: Write to `request_logs` (`src-tauri/src/modules/proxy_db.rs`)
- `cleanup_old_logs(days)`: Delete old `request_logs` and `VACUUM` (`src-tauri/src/modules/proxy_db.rs`)

</details>
