---
title: "Fix 404 Errors: Base URL Configuration | Antigravity Tools"
sidebarTitle: "404 Base URL"
subtitle: "404/Path Issues: Base URL, /v1 Prefix, and Path-Stacking Clients"
description: "Fix 404 errors when integrating Antigravity Tools. Learn to identify Base URL concatenation issues, avoid /v1 prefix duplication, and handle path-stacking clients like Kilo Code and Claude Code."
tags:
  - "faq"
  - "base-url"
  - "404"
  - "openai"
  - "anthropic"
  - "gemini"
prerequisite:
  - "start-proxy-and-first-client"
  - "faq-auth-401"
order: 999
---

# 404/Path Incompatibility: Base URL, /v1 Prefix, and Path-Stacking Clients

## What You'll Learn

- When encountering 404, determine whether it's a "Base URL concatenation issue" or "authentication/service not running"
- Select the correct Base URL based on client type (whether to include `/v1`)
- Identify two high-frequency pitfalls: duplicate prefixes (`/v1/v1/...`) and stacked paths (`/v1/chat/completions/responses`)

## Your Current Struggles

When integrating external clients, you encounter `404 Not Found` errors. After troubleshooting, you discover it's a Base URL configuration issue:

- Kilo Code calls fail, logs show `/v1/chat/completions/responses` not found
- Claude Code can connect but keeps reporting path incompatibility
- Python OpenAI SDK reports `404`, even though the service is already running

The root cause isn't account quotas or authentication—it's that **clients concatenate "their own paths" to the Base URL you provided**, resulting in incorrect paths.

## When to Use This

- You've confirmed the reverse proxy is running, but all API calls return 404
- You set Base URL to include paths (like `/v1/...`), but aren't sure if the client will concatenate again
- Your client has "built-in path concatenation logic", and the resulting request paths don't look like standard OpenAI/Anthropic/Gemini

---

## 🎒 Preparation

First, eliminate "service not running/authentication failure", otherwise you'll keep going in the wrong direction.

### Step 1: Confirm Reverse Proxy is Running

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/healthz
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/healthz | Select-Object -ExpandProperty Content
```

:::

**You should see**: HTTP 200, returning JSON (at least containing `{"status":"ok"}`).

### Step 2: Confirm You're Encountering 404 (Not 401)

If you're in `auth_mode=strict/all_except_health/auto(allow_lan_access=true)` mode without a key, you're more likely to encounter 401. Check the status code first, and if necessary, complete **[401 Authentication Failure Troubleshooting](../auth-401/)** first.

## What is Base URL?

**Base URL** is the "root address" when clients make requests. Clients typically concatenate their API paths to the Base URL before requesting, so whether Base URL should include `/v1` depends on what paths the client will append. As long as you align the final request path to Antigravity Tools' routes, you won't be stuck with 404 errors.

## Core Concept

Antigravity Tools' reverse proxy routes are "fully hardcoded" (see `src-tauri/src/proxy/server.rs`), with common entry points:

| Protocol | Path | Purpose |
|--- | --- | ---|
| OpenAI | `/v1/models` | List models |
| OpenAI | `/v1/chat/completions` | Chat completions |
| OpenAI | `/v1/responses` | Codex CLI compatible |
| Anthropic | `/v1/messages` | Claude messages API |
| Gemini | `/v1beta/models` | List models |
| Gemini | `/v1beta/models/:model` | Generate content |
| Health Check | `/healthz` | Liveness endpoint |

What you need to do: Make the "final path" concatenated by the client land exactly on these routes.

---

## Follow Along

### Step 1: First Hit the "Correct Path" with curl

**Why**
First confirm that "the protocol you're using" has a corresponding route locally, avoiding treating 404 as a "model/account issue".

::: code-group

```bash [macOS/Linux]
 # OpenAI protocol: list models
curl -i http://127.0.0.1:8045/v1/models

 # Anthropic protocol: messages endpoint (just checking 404/401 here, doesn't need to succeed)
curl -i http://127.0.0.1:8045/v1/messages

 # Gemini protocol: list models
curl -i http://127.0.0.1:8045/v1beta/models
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/models | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/messages | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1beta/models | Select-Object -ExpandProperty StatusCode
```

:::

**You should see**: These paths should at least not be 404. If 401 appears, first configure the key according to **[401 Authentication Failure Troubleshooting](../auth-401/)**.

### Step 2: Choose Base URL Based on Whether Client "Concatenates /v1"

**Why**
The Base URL pitfall is essentially "the path you wrote" and "the path the client appends" stacking together.

| What You're Using | Recommended Base URL | Route You're Aligning With |
|--- | --- | ---|
| OpenAI SDK (Python/Node, etc.) | `http://127.0.0.1:8045/v1` | `/v1/chat/completions`, `/v1/models` |
| Claude Code CLI (Anthropic) | `http://127.0.0.1:8045` | `/v1/messages` |
| Gemini SDK / Gemini Mode Clients | `http://127.0.0.1:8045` | `/v1beta/models/*` |

::: tip Quick rule
OpenAI SDK typically requires you to put `/v1` in the Base URL; Anthropic/Gemini more commonly only go to host:port.
:::

### Step 3: Handle "Stacked Path" Clients Like Kilo Code

**Why**
Antigravity Tools doesn't have the `/v1/chat/completions/responses` route. If the client concatenates this path, it's guaranteed to be 404.

Configure according to README recommendations:

1. Protocol selection: Prefer **Gemini Protocol**
2. Base URL: Fill in `http://127.0.0.1:8045`

**You should see**: Requests will go through `/v1beta/models/...` paths, and `/v1/chat/completions/responses` will no longer appear.

### Step 4: Don't Write Base URL to "Specific Resource Paths"

**Why**
Most SDKs append their resource paths after the Base URL. If you write the Base URL too deep, it becomes a "double-layer path".

✅ Recommended (OpenAI SDK):

```text
http://127.0.0.1:8045/v1
```

❌ Common mistakes:

```text
http://127.0.0.1:8045
http://127.0.0.1:8045/v1/chat/completions
```

**You should see**: After changing the Base URL to be shallower, request paths return to `/v1/...` or `/v1beta/...`, and 404 disappears.

---

## Checkpoint ✅

You can use this table to quickly compare whether your "final request path" might hit Antigravity Tools:

| Path You See in Logs | Conclusion |
|--- | ---|
| Starts with `/v1/` (like `/v1/models`, `/v1/chat/completions`) | Uses OpenAI/Anthropic compatible routes |
| Starts with `/v1beta/` (like `/v1beta/models/...`) | Uses Gemini native routes |
| Appears `/v1/v1/` | Base URL includes `/v1`, client concatenated again |
| Appears `/v1/chat/completions/responses` | Client stacked paths, current routing table doesn't support it |

---

## Pitfall Reminders

### Pitfall 1: Duplicate /v1 Prefix

**Symptom**: Path becomes `/v1/v1/chat/completions`

**Cause**: Base URL already includes `/v1`, and the client concatenated it again.

**Solution**: Change Base URL to "stop at `/v1`", don't write specific resource paths after it.

### Pitfall 2: Path-Stacking Clients

**Symptom**: Path becomes `/v1/chat/completions/responses`

**Cause**: Client appended business paths on top of OpenAI protocol paths.

**Solution**: Prioritize switching to other protocol modes of that client (like using Gemini for Kilo Code).

### Pitfall 3: Wrong Port

**Symptom**: `Connection refused` or timeout

**Solution**: On the "API Proxy" page of Antigravity Tools, confirm the current listening port (default 8045), and ensure the port in Base URL matches.

---

## Lesson Summary

| Phenomenon | Most Common Cause | How to Fix |
|--- | --- | ---|
| Always 404 | Base URL concatenated incorrectly | First verify with curl that `/v1/models`/`/v1beta/models` aren't 404 |
| `/v1/v1/...` | `/v1` duplicated | Keep OpenAI SDK's Base URL ending at `/v1` |
| `/v1/chat/completions/responses` | Client stacked paths | Switch to Gemini protocol or do path rewriting (not recommended for beginners) |

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Streaming Interruption & 0 Token Issues](../streaming-0token/)**
>
> You'll learn:
> - Why streaming responses unexpectedly interrupt
> - Troubleshooting methods for 0 Token errors
> - Antigravity's automatic fallback mechanism

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Reverse proxy route definitions (complete routing table) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| `AxumServer::start()` (route building entry) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L79-L216) | 79-216 |
| `health_check_handler()` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| README: Claude Code Base URL recommendation | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L204) | 197-204 |
| README: Kilo Code stacked path explanation and recommended protocol | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L206-L211) | 206-211 |
| README: Python OpenAI SDK base_url example | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L213-L227) | 213-227 |

**Key Functions**:
- `AxumServer::start()`: Starts Axum reverse proxy server and registers all external routes
- `health_check_handler()`: Health check handler (`GET /healthz`)

</details>
