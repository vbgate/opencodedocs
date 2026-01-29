---
title: "Monitoring: Proxy Logs | Antigravity-Manager"
sidebarTitle: "Proxy Monitor"
subtitle: "Monitoring: Proxy Logs"
description: "Learn Antigravity-Manager's Proxy Monitor: enable recording, search and filter requests, inspect payloads, and export logs for troubleshooting 401/429/5xx errors and stream interruptions."
tags:
  - "Advanced"
  - "Monitoring"
  - "Troubleshooting"
  - "Proxy"
  - "Logs"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-first-run-data"
  - "advanced-config"
order: 999
---

# Proxy Monitor: Request Logs, Filtering, Detail Restoration and Export

You've got your local reverse proxy running, but once 401/429/500, stream interruptions, or "why did it suddenly switch accounts/models" appear, troubleshooting can easily become blind guessing.

This lesson covers only one thing: use **Proxy Monitor** to restore each call into "reviewable evidence," letting you know where the request came from, which endpoint it hit, which account it used, whether the model was mapped, and approximately how much Token was consumed.

## What You'll Learn

- Enable/pause recording on the `/monitor` page and understand whether it affects Token Stats
- Quickly locate a request record using the search box, quick filters, and account filters
- View and copy Request/Response payloads in the details modal for postmortem analysis
- Know Proxy Monitor's data persistence location (`proxy_logs.db`) and clearing behavior
- Understand the current "export logs" capability boundaries (GUI vs backend commands)

## Your Current Struggles

- You see "call failed/timeout" but don't know if it failed upstream, at the proxy, or due to client configuration
- You suspect model mapping or account rotation was triggered, but lack an evidence chain
- You want to review a complete request payload (especially streaming/Thinking), but can't see it in logs

## When to Use This Approach

- You're troubleshooting: 401 authentication failures, 429 rate limiting, 5xx upstream errors, stream interruptions
- You want to confirm: which account a specific request used (`X-Account-Email`)
- You're designing model routing strategies and want to verify "client model name → actual mapped model name"

## 🎒 Preparation

::: warning Prerequisite
Proxy Monitor records "requests received by the reverse proxy service." So you at least need to have the following working:

- Reverse proxy service is running and `/healthz` is accessible
- You know the current reverse proxy's Base URL and port

If not working yet, first check **[Start Local Reverse Proxy & First Client](/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

## What is Proxy Monitor?

**Proxy Monitor** is Antigravity Tools' built-in "request log dashboard." Each request that enters the local reverse proxy gets recorded with timestamp, path, status code, duration, model and protocol, and Token usage is extracted from responses when possible. You can click any record to view the request and response payloads—using it to review failure causes and routing/account selection results.

::: info Data Persistence Location
Proxy Monitor logs are written to SQLite in the data directory: `proxy_logs.db`. For how to find and backup the data directory, review **[First Run Essentials: Data Directory, Logs, Tray & Auto-Start](/lbjlaq/Antigravity-Manager/start/first-run-data/)**.
:::

## Core Concepts: 6 Fields You Need to Watch

In a Proxy Monitor record (backend struct `ProxyRequestLog`), the most useful fields are:

| Field | What You Use It to Answer |
|--- | ---|
| `status` | Was this request successful or failed (200-399 vs others) |
| `url` / `method` | Which endpoint did you actually hit (e.g., `/v1/messages`, `/v1/chat/completions`) |
| `protocol` | Which protocol: OpenAI / Claude(Anthropic) / Gemini |
| `account_email` | Which account was ultimately used for this request (from `X-Account-Email` response header) |
| `model` / `mapped_model` | Was the client-requested model name "routed/mapped" to another model |
| `input_tokens` / `output_tokens` | Token usage for this request (if extractable) |

::: tip Use "Summary" First, Then "Details" as Needed
The list page only shows summaries (without request/response bodies). Clicking a record loads complete details from the backend to avoid pulling too many large fields in a single list.
:::

## Follow Along: Walk Through a "Monitoring Loop" with One Call

### Step 1: Create a Request That You Know Will Exist

**Why**
Proxy Monitor only records requests received by the reverse proxy. First verify "are records being created" with the simplest request before tackling filtering and details.

::: code-group

```bash [macOS/Linux]
## 1) Health check (an endpoint that definitely exists)
curl "http://127.0.0.1:PORT/healthz"

## 2) Request models again (if you enabled auth, remember to add headers)
curl "http://127.0.0.1:PORT/v1/models"
```

```powershell [Windows]
## 1) Health check (an endpoint that definitely exists)
curl "http://127.0.0.1:PORT/healthz"

## 2) Request models again (if you enabled auth, remember to add headers)
curl "http://127.0.0.1:PORT/v1/models"
```

:::

**What you should see**: Terminal returns `{"status":"ok"}` (or similar JSON), plus the `/v1/models` response (success or 401 both work).

### Step 2: Open Monitor Page and Confirm "Recording Status"

**Why**
Proxy Monitor has a "Recording/Paused" toggle. You need to confirm the current state first, otherwise you might keep making requests but the list stays empty forever.

In Antigravity Tools, open the **API Monitor Dashboard** in the sidebar (route is `/monitor`).

At the top of the page there's a button with a dot:

```
┌───────────────────────────────────────────┐
│  ● Recording   [Search Box]  [Refresh] [Clear]      │
└───────────────────────────────────────────┘
```

If you see "Paused," click once to switch to "Recording."

**What you should see**: Button status changes to "Recording"; list starts showing your recent request records.

### Step 3: Use "Search + Quick Filters" to Locate a Record

**Why**
In real troubleshooting, you usually only remember fragments: path contains `messages`, or status code is `401`, or model name includes `gemini`. The search box is designed for these partial memories.

Proxy Monitor's search treats your input as a "fuzzy keyword" and matches these fields in the backend using SQL `LIKE`:

- `url`
- `method`
- `model`
- `status`
- `account_email`

Try a few typical keywords:

- `healthz`
- `models`
- `401` (if you happened to trigger a 401)

You can also click "Quick Filter" buttons: **Errors Only / Chat / Gemini / Claude / Image Generation**.

**What you should see**: List narrows down to only the category of requests you expected.

### Step 4: Click Details to Reconstruct "Request Payload + Response Payload"

**Why**
The list only answers "what happened." To answer "why," you usually need to see complete request/response payloads.

Click any record to open the details modal. Focus on checking:

- `Protocol` (OpenAI/Claude/Gemini)
- `Model Used` and `Mapped Model`
- `Account Used`
- `Token Consumption (Input/Output)`

Then use the buttons to copy:

- `Request Payload`
- `Response Payload`

**What you should see**: Two blocks of JSON (or text) preview in details; after copying, you can paste them into tickets/notes for postmortem analysis.

### Step 5: When You Need "Reproduce from Scratch," Clear Logs

**Why**
In troubleshooting, "old data interfering with judgment" is a major concern. Clear first, then reproduce once—success or failure becomes crystal clear.

Click the "Clear" button at the top. A confirmation dialog appears.

::: danger This is Irreversible
Clearing deletes all records in `proxy_logs.db`.
:::

**What you should see**: After confirmation, list is cleared and statistics reset to 0.

## Checkpoints ✅

- [ ] You can see your recent `/healthz` or `/v1/models` records in `/monitor`
- [ ] You can filter a specific record using the search box (e.g., type `healthz`)
- [ ] You can click a record to see request/response payloads and copy them
- [ ] You know clearing logs directly deletes all historical records

## Common Pitfalls

| Scenario | What You Might Think (❌) | Actual Behavior (✓) |
|--- | --- | ---|
| "Paused" = no monitoring overhead at all | Think paused means requests won't be parsed | Paused mainly affects "whether to write to Proxy Monitor logs." Token Stats may still record normally (backend records token usage first, then checks if monitoring is enabled). |
| Binary/large body logs are empty | Think monitoring is broken | Binary requests/responses display as `[Binary Request Data]` / `[Binary Response Data]`; when exceeding limits they may be marked as "too large." |
| Want to use Monitor to find "who initiated the request" | Think you can trace back to client process | Monitor records HTTP layer info (method/path/model/account), not "caller process name." You need to combine with client logs or system network packet capture to identify the source. |

## Export and Long-Term Retention: First Clarify Capability Boundaries

### 1) What the GUI Can Do Currently

In the current version's Monitor UI (`ProxyMonitor.tsx`), you can:

- Search/filter/page through records
- Click details to view and copy payloads
- Clear all logs

But **there's no "Export button"** (related UI not found in source code).

### 2) What Export Capabilities the Backend Already Has (for Custom Development)

The backend Tauri commands provide two export methods:

- `export_proxy_logs(file_path)`: Export "all logs" from the database to a JSON file
- `export_proxy_logs_json(file_path, json_data)`: Pretty-print the JSON data you pass in and write to file

If you're doing GUI custom development or writing your own call script, you can directly reuse these commands.

### 3) The Most Primal "Export": Backup `proxy_logs.db` Directly

Since Proxy Monitor is essentially SQLite, you can also treat `proxy_logs.db` as a "troubleshooting evidence package" and backup it together (e.g., alongside `token_stats.db`). See **[First Run Essentials](/lbjlaq/Antigravity-Manager/start/first-run-data/)** for data directory location.

## Recommended Reading

- Want to understand model mapping: **[Model Router: Custom Mapping, Wildcard Priorities & Preset Strategies](/lbjlaq/Antigravity-Manager/advanced/model-router/)**
- Want to troubleshoot authentication: **[401/Auth Failures: auth_mode, Header Compatibility & Client Config Checklist](/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- Want to combine Monitor with cost statistics: The next section covers Token Stats (`token_stats.db`)

## Summary

- Proxy Monitor's value is "reviewability": it records status code/path/protocol/account/model mapping/Token usage and provides request details
- Search and quick filters are the troubleshooting entry point: narrow scope first, then click details to view payloads
- Clearing logs is irreversible; export currently leans more toward "custom development capability" and "database file backup"

## Up Next

> Next lesson: **[Token Stats: Cost-Centric Statistics & Chart Interpretation](/lbjlaq/Antigravity-Manager/advanced/token-stats/)**—turning "feels expensive" into quantifiable optimizations.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Monitor page entry (mounts ProxyMonitor) | [`src/pages/Monitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Monitor.tsx#L1-L12) | 1-12 |
| Monitor UI: table/filter/details modal | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L13-L713) | 13-713 |
| UI: read config and sync enable_logging | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L243) | 174-243 |
| UI: toggle recording (write config + set_proxy_monitor_enabled) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L254-L267) | 254-267 |
|--- | --- | ---|
| UI: clear logs (clear_proxy_logs) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L389-L403) | 389-403 |
| UI: load single detail (get_proxy_log_detail) | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L505-L519) | 505-519 |
| Monitor middleware: capture request/response, parse tokens, write to monitor | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |
| ProxyMonitor: enabled switch, write DB, emit event | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L33-L194) | 33-194 |
| Server mount monitor middleware (layer) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L183-L194) | 183-194 |
| Tauri commands: get/count/filter/detail/clear/export | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L180-L314) | 180-314 |
| SQLite: proxy_logs.db path, table structure, and filter SQL | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L1-L416) | 1-416 |
| Monitor design notes (may differ from implementation; source code is authoritative) | [`docs/proxy-monitor-technical.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-monitor-technical.md#L1-L53) | 1-53 |

**Key Constants**:
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`: Maximum request body readable by monitor middleware (exceeding this causes read failure)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`: Maximum response body readable by monitor middleware (for large responses like images)

**Key Functions/Commands**:
- `monitor_middleware(...)`: Collect request and response at HTTP layer, calls `monitor.log_request(...)`
- `ProxyMonitor::log_request(...)`: Write to memory + SQLite, push summary via `proxy://request` event
- `get_proxy_logs_count_filtered(filter, errors_only)` / `get_proxy_logs_filtered(...)`: List page filtering and pagination
- `get_proxy_log_detail(log_id)`: Load complete request/response body for a single log entry
- `export_proxy_logs(file_path)`: Export full logs to JSON file (current UI doesn't expose a button for this)

</details>
