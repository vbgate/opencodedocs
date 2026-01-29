---
title: "入门: 本地 AI 网关 | Antigravity-Manager"
sidebarTitle: "入门"
subtitle: "入门: 本地 AI 网关 | Antigravity-Manager"
description: "学习 Antigravity-Manager 的核心定位。它是一个本地 AI 网关，提供统一的 OpenAI/Anthropic/Gemini 兼容接口。"
tags:
  - "Getting Started"
  - "Concepts"
  - "Local Gateway"
  - "API Proxy"
prerequisite: []
order: 999
---

# What is Antigravity Tools: Transforming "Accounts + Protocols" into a Local AI Gateway

The barrier to entry for many AI clients/SDKs isn't "knowing how to call APIs," but rather "which provider protocol to integrate with, how to manage multiple accounts, and how to make failures recover automatically." Antigravity Tools aims to consolidate these three tasks into a single local gateway.

## What is Antigravity Tools?

**Antigravity Tools** is a desktop application: you manage accounts and configurations in the GUI, and it starts an HTTP reverse proxy service on your local machine that forwards requests from different providers/protocols to upstream and converts responses back to the format your client expects.

## What You'll Learn

- Clearly articulate what problem Antigravity Tools solves (and what it doesn't)
- Recognize its core components: GUI, account pool, HTTP reverse proxy gateway, protocol adaptation
- Understand the default security boundaries (127.0.0.1, port, auth mode) and when you need to change them
- Know which chapter to go to next: installation, adding accounts, starting the reverse proxy, connecting clients

## Your Current Struggles

You might have encountered these frustrations:

- The same client needs to support OpenAI/Anthropic/Gemini protocols, and configuration often gets messy
- You have multiple accounts, but switching, rotation, and rate-limited retries are all manual
- When requests fail, you can only stare at logs and guess whether it's "account invalid" or "upstream rate limit/quota exhausted"

Antigravity Tools' goal is to handle these "edge tasks" inside a local gateway, so your client/SDK only needs to care about one thing: sending requests to localhost.

## Core Approach

You can think of it as a local "AI dispatch gateway" composed of three layers:

1) GUI (Desktop Application)
- Responsible for letting you manage accounts, configurations, monitoring, and statistics.
- Main pages include: Dashboard, Accounts, API Proxy, Monitor, Token Stats, Settings.

2) HTTP Reverse Proxy Service (Axum Server)
- Responsible for exposing endpoints for multiple protocols externally and forwarding requests to the corresponding handler.
- The reverse proxy service layers authentication, middleware monitoring, CORS, Trace, etc.

3) Account Pool and Scheduling (TokenManager, etc.)
- Responsible for selecting available accounts from the local account pool, refreshing tokens when needed, and handling rotation and self-healing.

::: info What does "local gateway" mean?
"Local" here is literal: the service runs on your own machine. Your clients (Claude Code, OpenAI SDK, various third-party clients) point their Base URL to `http://127.0.0.1:<port>`, requests first hit your local machine, then are forwarded to upstream by Antigravity Tools.
:::

## What Endpoints Does It Expose?

The reverse proxy service registers multiple protocol endpoints in a Router. Remember these "entry points" for now:

- OpenAI-compatible: `/v1/chat/completions`, `/v1/completions`, `/v1/responses`, `/v1/models`
- Anthropic-compatible: `/v1/messages`, `/v1/messages/count_tokens`
- Gemini native: `/v1beta/models`, `/v1beta/models/:model`, `/v1beta/models/:model/countTokens`
- Health check: `GET /healthz`

If your client can integrate with any of these protocols, theoretically you can route requests to this local gateway by "changing the Base URL."

## Default Security Boundaries (Don't Skip)

The biggest pitfall with "local reverse proxies" isn't usually insufficient features—it's accidentally exposing them.

Remember these defaults first (all from default configuration):

- Default port: `8045`
- Default localhost-only access: `allow_lan_access=false`, listening address is `127.0.0.1`
- Default auth mode: `auth_mode=off` (doesn't require clients to send a key)
- Default generates an `sk-...` format `api_key` (for you to enable when you need authentication)

::: warning When must you enable authentication?
As soon as you enable LAN access (`allow_lan_access=true`, listening address becomes `0.0.0.0`), you should simultaneously enable authentication and treat the API Key as a password.
:::

## When to Use Antigravity Tools

It's better suited for these scenarios:

- You have multiple AI clients/SDKs and want them all to use a single Base URL
- You need to converge different protocols (OpenAI/Anthropic/Gemini) into the same "local exit"
- You have multiple accounts and want the system to handle rotation and stability

If you just want to "write two lines of code to directly call the official API" and your accounts/protocols are fixed, it might be overkill.

## Follow Along: Establish the Correct Usage Order First

This lesson doesn't teach detailed configuration—it just aligns the main sequence first to avoid getting stuck by skipping around.

### Step 1: Install First, Then Start

**Why**
The desktop app handles account management and starting the reverse proxy service. Without it, there's no way to do OAuth or reverse proxying.

Go to the next chapter and complete installation following the README's installation method.

**What you should see**: You can open Antigravity Tools and see the Dashboard page.

### Step 2: Add at Least One Account

**Why**
The reverse proxy service needs to get an available identity from the account pool to send requests upstream. Without accounts, the gateway can't "make calls on your behalf."

Go to the "Adding Accounts" chapter and add an account following the OAuth or Refresh Token flow.

**What you should see**: Your account appears in the Accounts page, and you can see quota/status information.

### Step 3: Start API Proxy and Verify with /healthz

**Why**
First use `GET /healthz` to verify "the local service is running," then connect clients. Troubleshooting will be much simpler.

Go to the "Start Local Reverse Proxy and Connect Your First Client" chapter to complete the loop.

**What you should see**: Your client/SDK can successfully get responses through the local Base URL.

## Common Pitfalls

| Scenario | What you might do (❌) | Recommended approach (✓) |
|--- | --- | ---|
| Want phone/another computer to access | Enable `allow_lan_access=true` directly without setting up authentication | Enable authentication simultaneously, and verify `GET /healthz` on LAN first |
| Client reports 404 | Only change host/port, ignore how client concatenates `/v1` | Confirm client's base_url concatenation strategy first, then decide if `/v1` prefix is needed |
| Start with Claude Code immediately | Connect complex client directly, don't know where to look when it fails | First get the minimal loop working: start Proxy -> `GET /healthz` -> then connect client |

## Lesson Summary

- Antigravity Tools' positioning is "desktop app + local HTTP reverse proxy gateway": GUI management, Axum provides multi-protocol endpoints
- You need to treat it as local infrastructure: install first, then add accounts, then start Proxy, finally connect clients
- Default listens on `127.0.0.1:8045` only; if exposing to LAN, enable authentication

## Next Lesson Preview

> In the next lesson, we complete the installation step: **[Installation & Upgrades: Best Desktop Installation Paths](../installation/)**.
>
> You'll learn:
> - The installation methods listed in the README (and their priority)
> - Upgrade entry points and handling common system blocks

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Lines |
|--- | --- | ---|
| Product positioning (local AI relay/protocol gap) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L35-L77) | 35-77 |
| Router endpoint overview (OpenAI/Claude/Gemini/healthz) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Default port/default localhost/default key and bind address logic | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L291) | 174-291 |
|--- | --- | ---|
| GUI page routing structure (Dashboard/Accounts/API Proxy/Monitor/Token Stats/Settings) | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L19-L48) | 19-48 |

**Key defaults**:
- `ProxyConfig.port = 8045`: Reverse proxy service default port
- `ProxyConfig.allow_lan_access = false`: Default localhost-only access
- `ProxyAuthMode::default() = off`: Default no authentication required

</details>
