---
title: "Config: Deep Dive | Antigravity-Manager"
sidebarTitle: "Config"
subtitle: "Config Deep Dive: AppConfig/ProxyConfig, Storage Location & Hot Update Semantics"
description: "Learn Antigravity Tools configuration: gui_config.json storage, AppConfig/ProxyConfig fields, hot update semantics, and which configs need restart."
tags:
  - "Config"
  - "gui_config.json"
  - "AppConfig"
  - "ProxyConfig"
  - "Hot Update"
prerequisite:
  - "start-first-run-data"
  - "start-proxy-and-first-client"
order: 999
---

# Config Deep Dive: AppConfig/ProxyConfig, Storage Location & Hot Update Semantics

You changed `auth_mode` but the client still returns 401; you enabled `allow_lan_access` but devices on the same network can't connect; you want to migrate your config to a new machine but don't know which files to copy.

This lesson explains Antigravity Tools' configuration system once and for all: where configs are stored, what the defaults are, which can be hot-updated, and which require restarting the reverse proxy.

## What is AppConfig/ProxyConfig?

**AppConfig/ProxyConfig** are Antigravity Tools' configuration data models: AppConfig manages desktop-side general settings (language, theme, warmup, quota protection, etc.), while ProxyConfig manages the local reverse proxy service's runtime parameters (port, authentication, model mapping, upstream proxy, etc.). They're ultimately serialized to the same `gui_config.json` file, and the reverse proxy reads ProxyConfig from it when starting.

## What You'll Learn

- Find the real storage location of the configuration file `gui_config.json` and be able to back it up/migrate it
- Understand the core fields and default values of AppConfig/ProxyConfig (based on source code)
- Clarify which configurations hot-update after saving, and which require restarting the reverse proxy to take effect
- Understand when a "config migration" occurs (old fields are automatically merged/deleted)

## Your Current Struggles

- You changed a configuration but it "didn't take effect"—you don't know if it wasn't saved, wasn't hot-updated, or needs a restart
- You only want to bring the "proxy config" to a new machine, but worry about taking account data with it
- After upgrading, you see old fields and worry the config file format is "broken"

## When to Use This Approach

- You're preparing to switch the reverse proxy from "local only" to "LAN accessible"
- You need to change authentication policies (`auth_mode`/`api_key`) and want to verify immediately that they take effect
- You need to batch-maintain model mappings/upstream proxies/z.ai configurations

## 🎒 Prerequisites

- You already know what the data directory is (see [First Run Essentials: Data Directory, Logs, Tray & Auto-Start](../../start/first-run-data/))
- You can start the reverse proxy service once (see [Start Local Reverse Proxy and Connect First Client](../../start/proxy-and-first-client/))

::: warning A Boundary First
This lesson will teach you how to read/backup/migrate `gui_config.json`, but we don't recommend treating it as a "long-term manually maintained config file." Because the backend re-serializes it according to Rust's `AppConfig` structure when saving, unknown fields you manually insert are likely to be automatically dropped on the next save.
:::

## Core Approach

When it comes to configuration, remember three statements:

1. AppConfig is the root object for persisted configuration, stored in `gui_config.json`.
2. ProxyConfig is a sub-object of `AppConfig.proxy`; reverse proxy startup and hot updates both revolve around it.
3. Hot update is "only updating memory state": being hot-updatable doesn't mean you can change the listen port/listen address.

## Follow Me

### Step 1: Locate `gui_config.json` (The Single Source of Truth for Configuration)

**Why**
All your subsequent "backup/migration/troubleshooting" should be based on this file.

The backend's data directory is `.antigravity_tools` under your Home directory (it's automatically created if it doesn't exist), and the configuration file name is fixed as `gui_config.json`.

::: code-group

```bash [macOS/Linux]
CONFIG_FILE="$HOME/.antigravity_tools/gui_config.json"
echo "$CONFIG_FILE"
ls -la "$CONFIG_FILE" || true
```

```powershell [Windows]
$configFile = Join-Path $HOME ".antigravity_tools\gui_config.json"
$configFile
Get-ChildItem -Force $configFile -ErrorAction SilentlyContinue
```

:::

**You should see**:
- If you haven't started the reverse proxy yet, this file might not exist (the backend will use default configuration directly).
- When the reverse proxy service starts or when you save settings, it will be automatically created and written with JSON.

### Step 2: Back It Up First (Prevent Slip-ups + Easy Rollback)

**Why**
Configuration may contain sensitive fields like `proxy.api_key`, z.ai's `api_key`, etc. When you want to migrate/compare, backups are more reliable than "memory."

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/antigravity-config-backup"
cp "$HOME/.antigravity_tools/gui_config.json" "$HOME/antigravity-config-backup/gui_config.$(date +%Y%m%d%H%M%S).json"
```

```powershell [Windows]
$backupDir = Join-Path $HOME "antigravity-config-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$ts = Get-Date -Format "yyyyMMddHHmmss"
Copy-Item (Join-Path $HOME ".antigravity_tools\gui_config.json") (Join-Path $backupDir "gui_config.$ts.json")
```

:::

**You should see**: A JSON file with a timestamp appears in the backup directory.

### Step 3: Understand the Defaults (Don't Guess)

**Why**
Many "why can't I configure this right" problems are actually due to your incorrect expectations about defaults.

The defaults below come from the backend's `AppConfig::new()` and `ProxyConfig::default()`:

| Config Block | Field | Default Value (Source Code) | What You Need to Remember |
|--- | --- | --- | ---|
| AppConfig | `language` | `"zh"` | Default Chinese |
| AppConfig | `theme` | `"system"` | Follow system |
| AppConfig | `auto_refresh` | `true` | Auto-refresh quota by default |
| AppConfig | `refresh_interval` | `15` | Unit: minutes |
| ProxyConfig | `enabled` | `false` | Reverse proxy not started by default |
| ProxyConfig | `allow_lan_access` | `false` | Only bind to localhost by default (privacy-first) |
| ProxyConfig | `auth_mode` | `"off"` | No authentication by default (local-only scenario) |
| ProxyConfig | `port` | `8045` | This is the field you change most often |
| ProxyConfig | `api_key` | `"sk-<uuid>"` | Random key generated by default |
| ProxyConfig | `request_timeout` | `120` | Unit: seconds (Note: the reverse proxy internal may not currently use it) |
| ProxyConfig | `enable_logging` | `true` | Logging for monitoring/statistics enabled by default |
| StickySessionConfig | `mode` | `"Balance"` | Scheduling strategy defaults to balance |
| StickySessionConfig | `max_wait_seconds` | `60` | Only meaningful in CacheFirst mode |

::: tip Want to See Complete Fields?
You can directly open `gui_config.json` and compare with the source code: `src-tauri/src/models/config.rs` (AppConfig) and `src-tauri/src/proxy/config.rs` (ProxyConfig). The "Source Code Reference" at the end of this lesson provides clickable line number links.
:::

### Step 4: Change a "Definitely Hot-Updateable" Config and Verify Immediately (Example: Authentication)

**Why**
You need a "change and immediately verify" loop to avoid blindly changing in the UI.

When the reverse proxy is running, the backend's `save_config` will hot-update these to memory:

- `proxy.custom_mapping`
- `proxy.upstream_proxy`
- `proxy.auth_mode` / `proxy.api_key` (security policy)
- `proxy.zai`
- `proxy.experimental`

Here we use `auth_mode` as an example:

1. Open the `API Proxy` page and ensure the reverse proxy service is in Running state.
2. Set `auth_mode` to `all_except_health` and confirm you know the current `api_key`.
3. Use the request below to verify "health check passes, other endpoints are blocked."

::: code-group

```bash [macOS/Linux]
# Request /healthz without key: should succeed
curl -sS "http://127.0.0.1:8045/healthz" && echo

# Request /v1/models without key: should return 401
curl -sS -i "http://127.0.0.1:8045/v1/models"

# Request /v1/models with key: should succeed
curl -sS -H "Authorization: Bearer <proxy.api_key>" "http://127.0.0.1:8045/v1/models"
```

```powershell [Windows]
# Request /healthz without key: should succeed
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/healthz" | Select-Object -ExpandProperty StatusCode

# Request /v1/models without key: should return 401
try { Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" } catch { $_.Exception.Response.StatusCode.value__ }

# Request /v1/models with key: should succeed
$headers = @{ Authorization = "Bearer <proxy.api_key>" }
(Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" -Headers $headers).StatusCode
```

:::

**You should see**: `/healthz` returns 200; `/v1/models` returns 401 without key, and succeeds with key.

### Step 5: Change a "Must Restart Reverse Proxy" Config (Port / Listen Address)

**Why**
Many configurations "saved but not taking effect"—the root cause isn't a bug, but that it determines how the TCP Listener binds.

When starting the reverse proxy, the backend uses `allow_lan_access` to calculate the listen address (`127.0.0.1` or `0.0.0.0`), and uses `port` to bind the port; this step only happens in `start_proxy_service`.

Action suggestions:

1. In the `API Proxy` page, change `port` to a new value (e.g., `8050`) and save.
2. Stop the reverse proxy service, then restart it.
3. Verify `/healthz` with the new port.

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:8050/healthz" && echo
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8050/healthz" | Select-Object -ExpandProperty StatusCode
```

:::

**You should see**: The new port is accessible; the old port fails or returns empty.

::: warning About `allow_lan_access`
In the source code, `allow_lan_access` affects two things simultaneously:

1. **Listen address**: Determines whether to bind to `127.0.0.1` or `0.0.0.0` (requires restarting the reverse proxy to rebind).
2. **Auto authentication policy**: When `auth_mode=auto`, LAN scenarios automatically switch to `all_except_health` (this part can be hot-updated).
:::

### Step 6: Understand One "Config Migration" (Old Fields Are Automatically Cleaned Up)

**Why**
After upgrading, you might see old fields in `gui_config.json` and worry it's "broken." Actually, the backend performs a migration when loading configuration: it merges `anthropic_mapping/openai_mapping` into `custom_mapping`, deletes the old fields, then automatically saves once.

You can use this rule to self-check:

- If you see `proxy.anthropic_mapping` or `proxy.openai_mapping` in the file, they will be removed after the next startup/config load.
- During merging, keys ending with `-series` are skipped (these are now handled by preset/builtin logic).

**You should see**: After migration, only `proxy.custom_mapping` remains in `gui_config.json`.

## Checkpoints ✅

- You can find `$HOME/.antigravity_tools/gui_config.json` on your machine
- You can explain why configs like `auth_mode/api_key/custom_mapping` can be hot-updated
- You can explain why configs like `port/allow_lan_access` require restarting the reverse proxy

## Pitfall Reminders

1. The hot update from `save_config` only covers a few fields: it won't restart the listener for you, nor will it push configs like `scheduling` to TokenManager.
2. `request_timeout` doesn't actually take effect in the reverse proxy's current internal implementation: the `start` parameter of AxumServer is `_request_timeout`, and the timeout is hardcoded to `300` seconds in the state.
3. Manually inserting "custom fields" into `gui_config.json` is unreliable: when the backend saves, it will re-serialize it to `AppConfig`, and unknown fields will be discarded.

## Lesson Summary

- Configuration has only one storage entry point: `$HOME/.antigravity_tools/gui_config.json`
- ProxyConfig's "hot-updatable" doesn't mean "can change port/change listen address"; anything involving binding requires restarting the reverse proxy
- Don't panic when seeing old mapping fields: they will be automatically migrated to `custom_mapping` and old fields cleaned up when loading configuration

## Next Lesson Preview

> In the next lesson, we'll learn **[Security & Privacy: auth_mode, allow_lan_access, and the "Don't Leak Account Info" Design](../security/)**.
>
> You'll learn:
> - When you must enable authentication (and why `auto` is stricter in LAN scenarios)
> - Minimum exposure strategy when exposing the local reverse proxy to LAN/public network
> - Which data is sent upstream vs only kept locally

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Topic | File Path | Line Numbers |
|--- | --- | ---|
| AppConfig defaults (`AppConfig::new()`) | [`src-tauri/src/models/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/config.rs#L4-L158) | 4-158 |
| ProxyConfig defaults (port/auth/listen address) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L74-L292) | 74-292 |
| StickySessionConfig defaults (scheduling) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L36) | 3-36 |
| Config storage file name + migration logic (`gui_config.json`) | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| Data directory (`$HOME/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
|--- | --- | ---|
| AxumServer: `update_mapping/update_proxy/update_security/...` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L45-L117) | 45-117 |
| `allow_lan_access` listen address selection | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L81-L92) | 81-92 |
| Proxy bind address & port on startup (must restart to change) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L134) | 42-134 |
| Actual rules for `auth_mode=auto` | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L3-L31) | 3-31 |
| Frontend saves scheduling config (only saves, doesn't push to backend runtime) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L476-L501) | 476-501 |
| Monitor page dynamically enable/disable log collection | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L263) | 174-263 |

</details>
