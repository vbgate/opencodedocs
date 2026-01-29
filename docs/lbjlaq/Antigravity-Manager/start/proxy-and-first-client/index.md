---
title: "Proxy: Start Reverse Proxy | Antigravity-Manager"
sidebarTitle: "Start Proxy"
subtitle: "Proxy: Start Reverse Proxy & First Client"
description: "Learn Antigravity-Manager reverse proxy startup. Set port 8045, configure LAN access and auth_mode. Use /healthz to verify service, then connect with OpenAI/Anthropic/Gemini SDK."
tags:
  - "API Proxy"
  - "healthz"
  - "OpenAI SDK"
  - "Anthropic SDK"
  - "Gemini SDK"
  - "Base URL"
prerequisite:
  - "start-installation"
  - "start-add-account"
duration: 18
order: 999
---

# Start Local Reverse Proxy & First Client (/healthz + SDK Config)

This lesson gets Antigravity Tools' local reverse proxy (API Proxy) working: start the service, verify with `/healthz`, then connect with an SDK for your first request.

## What You'll Learn

- Start/stop local reverse proxy service on Antigravity Tools' API Proxy page
- Use `GET /healthz` for liveness check, confirming "correct port, service is actually running"
- Understand the relationship between `auth_mode` and API Key: which paths need auth and which header to use
- Choose any client (OpenAI / Anthropic / Gemini SDK) and complete your first real request

## Your Current Struggles

- You've installed Antigravity Tools and added accounts, but don't know "did the reverse proxy actually start successfully?"
- When connecting clients, you easily encounter `401` (no key) or `404` (Base URL wrong or duplicated path)
- You don't want to guess—you want the shortest loop: start → verify → first request succeeds

## When to Use This Approach

- You just finished installation and want to confirm your local gateway can work externally
- You changed port, enabled LAN access, or modified auth mode, and want to quickly verify config didn't break
- You need to connect a new client/new SDK and want to use a minimal example to get it working first

## 🎒 Preparation

::: warning Prerequisite
- You've completed installation and can normally open Antigravity Tools.
- You have at least one available account; otherwise starting the reverse proxy will return error `"no available accounts, please add an account first"` (only if z.ai distribution is also disabled).
:::

::: info Key terms that will appear repeatedly in this lesson
- **Base URL**: The "service root address" the client requests. Different SDKs concatenate differently—some need `/v1`, some don't.
- **Liveness check**: Use a minimal request to confirm service reachability. This project's liveness endpoint is `GET /healthz`, returning `{"status":"ok"}`.
:::

## Core Approach

1. When Antigravity Tools starts the reverse proxy, it binds a listening address and port based on config:
   - `allow_lan_access=false` → binds `127.0.0.1`
   - `allow_lan_access=true` → binds `0.0.0.0`
2. You don't need to write any code first. Use `GET /healthz` for liveness check first, confirming "service is running."
3. If you enabled auth:
   - `auth_mode=all_except_health` exempts `/healthz`
   - `auth_mode=strict` requires API Key for all paths

## Follow Along

### Step 1: Confirm Port, LAN Access, and Auth Mode

**Why**
You need to determine "where should clients connect (host/port)" and "do they need a key" first; otherwise debugging 401/404 later will be hard.

Open the `API Proxy` page in Antigravity Tools and focus on these 4 fields:

- `port`: defaults to `8045`
- `allow_lan_access`: disabled by default (local only)
- `auth_mode`: options are `off/strict/all_except_health/auto`
- `api_key`: defaults to generate `sk-...`, and UI validates it must start with `sk-` and be at least 10 characters

**What you should see**
- There's a Start/Stop button in the top-right corner of the page; the port input field is disabled while service is running

::: tip Beginner recommended config (get it working first, then add security)
- First time get it working: `allow_lan_access=false` + `auth_mode=off`
- Need LAN access? First enable `allow_lan_access=true`, then switch `auth_mode` to `all_except_health` (at minimum, don't expose your entire LAN as a "naked API")
:::

### Step 2: Start Reverse Proxy Service

**Why**
The GUI's Start calls backend commands to launch the Axum Server and load the account pool; this is the prerequisite for "providing API externally."

Click Start in the top-right corner of the page.

**What you should see**
- Status changes from stopped to running
- The number of currently loaded accounts (active accounts) displays next to it

::: warning If startup fails, the two most common errors
- `"no available accounts, please add an account first"`: Account pool is empty and z.ai distribution is not enabled.
- `"failed to start Axum server: failed to bind address <host:port>: ..."`: Port is occupied or you lack permissions (try a different port).
:::

### Step 3: Use /healthz for Liveness Check (Shortest Loop)

**Why**
`/healthz` is the most stable "connectivity confirmation." It doesn't depend on models, accounts, or protocol translation—only verifies whether the service is reachable.

Replace `<PORT>` with the port you see in the UI (default `8045`):

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**What you should see**

```json
{"status":"ok"}
```

::: details How to test when auth is required?
When you switch `auth_mode` to `strict`, all paths require a key (including `/healthz`).

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```

Recommended auth header formats (compatible with more forms):
- `Authorization: Bearer <proxy.api_key>` or `Authorization: <proxy.api_key>`
- `x-api-key: <proxy.api_key>`
- `x-goog-api-key: <proxy.api_key>`
:::

### Step 4: Connect Your First Client (Choose One: OpenAI / Anthropic / Gemini)

**Why**
`/healthz` only confirms "service is reachable"; real integration success means the SDK sends one actual request.

::: code-group

```python [OpenAI SDK (Python)]
import openai

client = openai.OpenAI(
    api_key="<API_KEY>",
    base_url="http://127.0.0.1:8045/v1",
)

resp = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Hello, please introduce yourself"}],
)

print(resp.choices[0].message.content)
```

```bash [Claude Code / Anthropic CLI]
export ANTHROPIC_API_KEY="<API_KEY>"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

```python [Gemini SDK (Python)]
import google.generativeai as genai

genai.configure(
    api_key="<API_KEY>",
    transport="rest",
    client_options={"api_endpoint": "http://127.0.0.1:8045"},
)

model = genai.GenerativeModel("gemini-3-flash")
resp = model.generate_content("Hello")
print(resp.text)
```

:::

**What you should see**
- The client receives a non-empty text response
- If you enabled Proxy Monitor, you'll see this request record in the monitor

## Checkpoint ✅

- `GET /healthz` returns `{"status":"ok"}`
- API Proxy page shows running
- Your chosen SDK example returns content (not 401/404, and not an empty response)

## Pitfall Alerts

::: warning 401: Usually misaligned auth
- You enabled `auth_mode`, but the client didn't send a key.
- You sent a key, but the header name is wrong: this project supports `Authorization` / `x-api-key` / `x-goog-api-key` simultaneously.
:::

::: warning 404: Usually Base URL typo or "duplicated path"
- OpenAI SDK usually needs `base_url=.../v1`; Anthropic/Gemini examples don't include `/v1`.
- Some clients concatenate paths into something like `/v1/chat/completions/responses`, causing 404 (the project README specifically mentions Kilo Code's OpenAI mode duplicated path issue).
:::

::: warning LAN access isn't "enable and done"
When you enable `allow_lan_access=true`, the service binds to `0.0.0.0`. This means other devices on the same LAN can access through your machine's IP + port.

If you use this, at minimum enable `auth_mode` and set a strong `api_key`.
:::

## Lesson Summary

- After starting the reverse proxy, use `/healthz` for liveness check first, then configure the SDK
- `auth_mode` determines which paths need a key; `all_except_health` exempts `/healthz`
- When connecting SDKs, the easiest mistake is whether Base URL should include `/v1`

## Next Lesson Preview

> In the next lesson, we clarify the details of the OpenAI-compatible API: including compatibility boundaries for `/v1/chat/completions` and `/v1/responses`.
>
> Go to **[OpenAI Compatible API: Implementation Strategy for /v1/chat/completions vs /v1/responses](/lbjlaq/Antigravity-Manager/platforms/openai/)**.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Topic | File Path | Lines |
|--- | --- | ---|
| Reverse proxy service start/stop/status | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L178) | 42-178 |
| Account pool check before start (error condition when no accounts) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L81-L91) | 81-91 |
| Route registration (including `/healthz`) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| `/healthz` return value | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Proxy auth middleware (Header compatibility and `/healthz` exemption) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| `auth_mode=auto` actual parsing logic | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L19-L30) | 19-30 |
|--- | --- | ---|
| Binding address derivation (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L291) | 281-291 |
| UI start/stop button calls `start_proxy_service/stop_proxy_service` | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L624-L639) | 624-639 |
| UI port/LAN/auth/API key configuration area | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L868-L1121) | 868-1121 |
| README's Claude Code / Python integration examples | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L227) | 197-227 |

</details>
