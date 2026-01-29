---
title: "Security: 认证与隐私 | Antigravity-Manager"
sidebarTitle: "Security"
subtitle: "Security: 认证与隐私"
description: "学习 Antigravity Tools 的安全配置。掌握 auth_mode 认证模式、allow_lan_access 局域网访问，配置 api_key 防止密钥泄露。"
tags:
  - "security"
  - "privacy"
  - "auth_mode"
  - "allow_lan_access"
  - "api_key"
prerequisite:
  - "start-getting-started"
  - "start-proxy-and-first-client"
duration: 16
order: 999
---

# Security & Privacy: auth_mode, allow_lan_access, and the "Don't Leak Account Info" Design

When you use Antigravity Tools as a "local AI gateway," security concerns usually boil down to just two things: who you're exposing the service to (only this machine, or the entire LAN/public network), and whether external requests need to carry an API Key. This lesson explains the rules in the source code clearly and gives you a minimum security baseline you can follow directly.

## What You'll Learn

- Choose the right `allow_lan_access`: know how it affects the bind address (`127.0.0.1` vs `0.0.0.0`)
- Choose the right `auth_mode`: understand the actual behavior of `off/strict/all_except_health/auto`
- Configure `api_key` and verify: use `curl` to instantly see "whether authentication is actually enabled"
- Know the boundaries of privacy protection: local proxy keys are not forwarded upstream; avoid leaking account emails in error messages to API clients

## Your Current Struggles

- You want your phone/another computer to access, but worry that enabling LAN access means "going naked"
- You want to enable authentication, but aren't sure whether `/healthz` should be exempt, afraid you'll break health checks
- You're worried about leaking local keys, cookies, or account emails to external clients or upstream platforms

## When to Use This

- You're about to enable `allow_lan_access` (NAS, home LAN, team intranet)
- You're using cloudflared/reverse proxy to expose the local service to the public (first see **[Cloudflared One-Click Tunnel](/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**)
- You encounter `401` and need to confirm whether it's "missing key" or "mode mismatch"

## 🎒 Preparation

::: warning Prerequisites
- You can already start API Proxy in the GUI (if not working yet, first see **[Start Local Reverse Proxy and Connect Your First Client](/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**).
- You know the problem you're solving: local-only access, or LAN/public access.
:::

::: info Three fields that will appear repeatedly in this lesson
- `allow_lan_access`: whether to allow LAN access.
- `auth_mode`: authentication strategy (determines which routes must carry a key).
- `api_key`: the local proxy's API Key (only used for local proxy authentication, not forwarded upstream).
:::

## What is auth_mode?

**auth_mode** is Antigravity Tools' "proxy authentication switch + exemption strategy." It decides, when external clients access local proxy endpoints, which requests must carry `proxy.api_key`, and whether health check routes like `/healthz` allow access without authentication.

## Core Approach

1. First determine the "exposure surface": when `allow_lan_access=false`, listen only on `127.0.0.1`; when `true`, listen on `0.0.0.0`.
2. Then determine the "entry key": `auth_mode` decides whether a key is required, and whether `/healthz` is exempt.
3. Finally do "privacy containment": don't forward local proxy keys/cookies upstream; try to avoid including account emails in external error messages.

## Follow Along

### Step 1: First decide whether you need LAN access (allow_lan_access)

**Why**
You should only enable LAN access when you "need other devices to access"—otherwise, defaulting to local-only access is the simplest security strategy.

In `ProxyConfig`, the bind address is determined by `allow_lan_access`:

```rust
pub fn get_bind_address(&self) -> &str {
    if self.allow_lan_access {
        "0.0.0.0"
    } else {
        "127.0.0.1"
    }
}
```

In the GUI's `API Proxy` page, set the "Allow LAN access" toggle according to your needs.

**What you should see**
- When off: the prompt indicates "local-only access" semantics (specific text depends on language pack)
- When on: the interface shows a prominent risk warning (reminding you this is an "expanded exposure surface")

### Step 2: Choose an auth_mode (recommend auto first)

**Why**
`auth_mode` isn't just "authentication on/off"—it also determines whether health check endpoints like `/healthz` are exempt.

The project supports 4 modes (from `docs/proxy/auth.md`):

- `off`: no routes require authentication
- `strict`: all routes require authentication
- `all_except_health`: all routes except `/healthz` require authentication
- `auto`: automatic mode, derives the actual policy based on `allow_lan_access`

The derivation logic for `auto` is in `ProxySecurityConfig::effective_auth_mode()`:

```rust
match self.auth_mode {
    ProxyAuthMode::Auto => {
        if self.allow_lan_access {
            ProxyAuthMode::AllExceptHealth
        } else {
            ProxyAuthMode::Off
        }
    }
    ref other => other.clone(),
}
```

**Recommended approach**
- Local-only access: `allow_lan_access=false` + `auth_mode=auto` (ultimately equivalent to `off`)
- LAN access: `allow_lan_access=true` + `auth_mode=auto` (ultimately equivalent to `all_except_health`)

**What you should see**
- In the `API Proxy` page, the "Auth Mode" dropdown has four options: `off/strict/all_except_health/auto`

### Step 3: Confirm your api_key (regenerate if necessary)

**Why**
As long as your proxy needs external access (LAN/public), `api_key` should be managed like a password.

By default, `ProxyConfig::default()` generates a key in `sk-...` format:

```rust
api_key: format!("sk-{}", uuid::Uuid::new_v4().simple()),
```

In the `API Proxy` page, you can edit, regenerate, and copy the current `api_key`.

**What you should see**
- The page has an `api_key` input field, plus edit/regenerate/copy buttons

### Step 4: Use /healthz to verify that the "exemption strategy" matches expectations

**Why**
`/healthz` is the shortest loop: you can confirm "service reachable + authentication policy correct" without actually calling the model.

Replace `<PORT>` with your own port (default `8045`):

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

::: details If you set auth_mode to strict
`strict` doesn't exempt `/healthz`. You need to carry a key:

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```
:::

### Step 5: Use a "non-health endpoint" to verify 401 (and that it's not 401 after adding key)

**Why**
You need to confirm that the authentication middleware is actually working, not that you selected a mode in the UI but it didn't take effect.

The request body below is intentionally incomplete—its purpose isn't to "succeed," but to verify whether it's blocked by authentication:

```bash
# Without key: when auth_mode != off, should directly return 401
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -d "{}"

# With key: should no longer be 401 (may return 400/422 because request body is incomplete)
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d "{}"
```

**What you should see**
- Without key: `HTTP/1.1 401 Unauthorized`
- With key: status code is no longer 401

## Checkpoint ✅

- You can clearly state your current exposure surface: local-only (127.0.0.1) or LAN (0.0.0.0)
- When `auth_mode=auto`, you can predict the actual effective mode (LAN -> `all_except_health`, local -> `off`)
- You can reproduce "401 without key" with 2 `curl` commands

## Pitfall Warnings

::: warning Wrong approach vs Recommended approach

| Scenario | ❌ Common mistake | ✓ Recommended |
|--- | --- | ---|
| Need LAN access | Only enable `allow_lan_access=true`, but keep `auth_mode=off` | Use `auth_mode=auto`, and set a strong `api_key` |
| Keep getting 401 after enabling authentication | Client sends a key, but header name is incompatible | Proxy is compatible with three headers: `Authorization`/`x-api-key`/`x-goog-api-key` |
| Enabled authentication but didn't configure key | Enabled authentication while `api_key` is empty | Backend will directly reject (logs will indicate key is empty) |
:::

::: warning /healthz exemption only takes effect in all_except_health
Middleware will let requests pass when "effective mode" is `all_except_health` and path is `/healthz`; treat it as a "health check endpoint," don't use it as a business API.
:::

## Privacy and the "Don't Leak Account Info" Design

### 1) Local proxy keys are not forwarded upstream

Authentication only happens at the local proxy entry; `docs/proxy/auth.md` clearly states: proxy API keys are not forwarded upstream.

### 2) When forwarding to z.ai, deliberately restrict forwardable headers

When requests are forwarded to z.ai (Anthropic-compatible), the code only allows a small set of headers to pass, avoiding forwarding local proxy keys or cookies:

```rust
// Only forward a conservative set of headers to avoid leaking the local proxy key or cookies.
```

### 3) Token refresh failure errors avoid including account emails

When token refresh fails, the logs record the specific account, but the error returned to the API client is rewritten to not include the email:

```rust
// Avoid leaking account emails to API clients; details are still in logs.
last_error = Some(format!("Token refresh failed: {}", e));
```

## Lesson Summary

- First determine exposure surface (`allow_lan_access`), then determine entry key (`auth_mode` + `api_key`)
- `auth_mode=auto` rule is simple: LAN means at least `all_except_health`, local-only means `off`
- Privacy baseline is "don't forward local keys outward, don't leak account emails in external errors"—details are in middleware and upstream forwarding code

## Next Lesson Preview

> In the next lesson, we'll look at **[High Availability Scheduling: Rotation, Fixed Accounts, Sticky Sessions, and Retry on Failure](/lbjlaq/Antigravity-Manager/advanced/scheduling/)**, completing the "stable exit" after the "secure entry."

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Lines |
|--- | --- | ---|
| Four modes of auth_mode and auto semantics | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L10-L24) | 10-24 |
| ProxyAuthMode enum and default value (default off) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig key fields and defaults (allow_lan_access, api_key) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L259) | 174-259 |
| Bind address derivation (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L292) | 281-292 |
|--- | --- | ---|
| Authentication middleware (OPTIONS passthrough, /healthz exemption, three header compatibility) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| UI: allow_lan_access and auth_mode toggle/dropdown | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L943-L1046) | 943-1046 |
| UI: api_key edit/reset/copy | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1048-L1120) | 1048-1120 |
|--- | --- | ---|
| disable_account: write disabled/disabled_at/disabled_reason and remove from memory pool | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| Restrict forwardable headers when forwarding to z.ai (avoid leaking local keys/cookies) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89) | 70-89 |
| Account pool disable and UI display behavior (documentation) | [`docs/proxy/accounts.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/accounts.md#L9-L44) | 9-44 |

</details>
