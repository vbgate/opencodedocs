---
title: "Add Account: OAuth & Refresh Token | Antigravity-Manager"
sidebarTitle: "Add Account"
subtitle: "Add Account: OAuth & Refresh Token"
description: "Learn two ways to add accounts to Antigravity Tools: one-click OAuth authorization and manual Refresh Token addition. Handle callback failures, verify account pool, and bulk import tokens."
tags:
  - "Account Management"
  - "OAuth"
  - "refresh_token"
  - "Google"
  - "Best Practices"
prerequisite:
  - "start-getting-started"
duration: 15
order: 999
---

# Add Account: OAuth/Refresh Token Dual-Channel & Best Practices

In Antigravity Tools, "adding an account" means writing a Google account's `refresh_token` into the local account pool, allowing subsequent reverse proxy requests to rotate through them. You can use OAuth one-click authorization, or directly paste `refresh_token` for manual addition.

## What You'll Learn

- Add Google accounts to Antigravity Tools account pool using OAuth or Refresh Token
- Copy/manually open authorization links and automatically/manual complete adding after successful callback
- Know how to handle issues like failing to get `refresh_token` or callback failing to connect to `localhost`

## Your Current Challenges

- Clicked "OAuth Authorization" but it keeps spinning, or browser shows `localhost refused to connect`
- Authorization succeeded but shows "Refresh Token not obtained"
- You only have `refresh_token` and don't know how to batch import at once

## When to Use This Method

- You want the most stable way to add accounts (prioritize OAuth)
- You care more about portability/backup (Refresh Token is better suited as "account pool asset")
- You need to add many accounts and want to batch import `refresh_token` (supports extraction from text/JSON)

## 🎒 Preparation

- You have installed and can open Antigravity Tools desktop app
- You know where to enter: navigate to `Accounts` page from left sidebar (routing in `source/lbjlaq/Antigravity-Manager/src/App.tsx`)

::: info Two key terms in this lesson
**OAuth**: A "jump to browser to login and authorize" flow. Antigravity Tools will temporarily start a local callback address (`http://localhost/127.0.0.1/[::1]:<port>/oauth-callback`, automatically selecting based on system IPv4/IPv6 listening status), wait for the browser to return with `code`, then exchange for token. (Implementation in `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs`)

**refresh_token**: A "credential that can be used to refresh access_token for a long time". When adding an account in this project, it's used to first exchange for access_token, then fetch real email from Google, and ignore the email you input in frontend. (Implementation in `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs`)
:::

## Core Approach

Antigravity Tools' "add account" feature ultimately aims to get an available `refresh_token` and write account information to the local account pool.

- **OAuth Channel**: App helps you generate authorization link and listen for local callback; after authorization completes, it automatically exchanges token and saves account (see `prepare_oauth_url`, `start_oauth_login`, `complete_oauth_login`)
- **Refresh Token Channel**: You directly paste `refresh_token`, app uses it to refresh access_token, fetches real email from Google, and saves to disk (see `add_account`)

## Follow Along

### Step 1: Open "Add Account" Dialog

**Why**
All add entry points are unified in the `Accounts` page.

Action: Navigate to `Accounts` page, click the **Add Account** button on the right (component: `AddAccountDialog`).

**You should see**: A dialog with 3 tabs pops up: `OAuth` / `Refresh Token` / `Import` (see `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx`).

### Step 2: Prioritize OAuth One-Click Authorization (Recommended)

**Why**
This is the product's default recommended path: let the app generate authorization link, automatically open browser, and automatically complete saving after callback returns.

1. Switch to `OAuth` tab.
2. First copy authorization link: after dialog opens, it automatically calls `prepare_oauth_url` to pre-generate URL (frontend call in `AddAccountDialog.tsx:111-125`; backend generation and listening in `oauth_server.rs`).
3. Click **Start OAuth** (corresponds to frontend `startOAuthLogin()` / backend `start_oauth_login`), let app open default browser and start waiting for callback.

**You should see**:
- A copyable authorization link appears in dialog (event name: `oauth-url-generated`)
- Browser opens Google authorization page; after authorization, it redirects to a local address and shows "Authorization Successful!" (`oauth_success_html()`)

### Step 3: When OAuth Doesn't Complete Automatically, Use "Finish OAuth" to Manually Complete

**Why**
OAuth flow has two stages: browser authorization gets `code`, then app uses `code` to exchange for token. Even if you didn't click "Start OAuth", as long as you manually open authorization link and complete callback, dialog will try to automatically complete; if not successful, you can manually click once.

1. If you "copy link to open in your own browser" (instead of default browser), after authorization callback returns, app will receive `oauth-callback-received` event and automatically call `completeOAuthLogin()` (see `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx:67-109`).
2. If you don't see automatic completion, click **Finish OAuth** in dialog (corresponds to backend `complete_oauth_login`).

**You should see**: Dialog shows success and automatically closes; new account appears in `Accounts` list.

::: tip Pro tip: Copy link first when callback can't connect
Backend will try to listen on both IPv6 `::1` and IPv4 `127.0.0.1`, and choose `localhost/127.0.0.1/[::1]` as callback address based on listening status, mainly to avoid connection failures caused by "browser resolving localhost to IPv6". (See `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`)
:::

### Step 4: Add Manually with Refresh Token (Supports Bulk)

**Why**
When you can't get `refresh_token` (or you prefer "portable asset"), directly using Refresh Token is more controllable.

1. Switch to `Refresh Token` tab.
2. Paste `refresh_token` into text box.

Supported input formats (frontend will parse and batch add):

| Input Type | Example | Parsing Logic |
| --- | --- | --- |
| Pure token text | `1//abc...` | Regex extraction: `/1\/\/[a-zA-Z0-9_\-]+/g` (see `AddAccountDialog.tsx:213-220`) |
| Embedded in text | Logs/exported text containing multiple `1//...` | Regex batch extraction and deduplication (see `AddAccountDialog.tsx:213-224`) |
| JSON array | `[{"refresh_token":"1//..."}]` | Parse array and take `item.refresh_token` (see `AddAccountDialog.tsx:198-207`) |

After clicking **Confirm**, dialog will call `onAdd("", token)` one by one according to token count (see `AddAccountDialog.tsx:231-248`), eventually landing in backend `add_account`.

**You should see**:
- Dialog shows batch progress (e.g., `1/5`)
- After success, new account appears in `Accounts` list

### Step 5: Confirm "Account Pool is Available"

**Why**
Successful addition doesn't equal "immediately stable use". Backend will automatically trigger one "refresh quota" after addition, and try to reload token pool when Proxy is running, making changes take effect immediately.

You can confirm with these 2 signals:

1. Account appears in list and shows email (email comes from backend `get_user_info`, not the email you input).
2. Account quota/subscription info starts refreshing (backend will automatically call `internal_refresh_account_quota`).

**You should see**: After adding, no need to manually click refresh; account will start showing quota info (success depends on actual interface display).

## Checkpoints ✅

- Can see new account's email in account list
- Not stuck in "loading" state beyond acceptable time (OAuth callback should complete quickly after callback completes)
- If you're running Proxy, new account can quickly participate in scheduling (backend will try to reload)

## Troubleshooting

### 1) OAuth Shows "Refresh Token Not Obtained"

Backend will explicitly check if `refresh_token` exists in `start_oauth_login/complete_oauth_login`; if not exists, will return error message with solution (see `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs:45-56`).

Handle according to source code prompts:

1. Open `https://myaccount.google.com/permissions`
2. Revoke **Antigravity Tools** access permission
3. Go back to app and redo OAuth

> You can also directly switch to this lesson's Refresh Token channel.

### 2) Browser Shows `localhost refused to connect`

OAuth callback requires browser to request local callback address. To reduce failure rate, backend will:

- Try to listen on both `127.0.0.1` and `::1`
- Only use `localhost` when both are available, otherwise force use `127.0.0.1` or `[::1]`

Corresponding implementation in `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`.

### 3) Switching to Another Tab Cancels OAuth Preparation

When dialog switches from `OAuth` to other tab, frontend will call `cancelOAuthLogin()` and clear URL (see `AddAccountDialog.tsx:127-136`).

If you're in the middle of authorization, don't rush to switch tabs.

### 4) Refresh Token Correct/Incorrect Examples

| Example | Will be recognized | Reason |
| --- | --- | --- |
| `1//0gAbC...` | ✓ | Matches `1//` prefix rule (see `AddAccountDialog.tsx:215-219`) |
| `ya29.a0...` | ✗ | Doesn't match frontend extraction rule, will be treated as invalid input |

## Lesson Summary

- OAuth: Suitable for "fast", also supports copying link to your preferred browser and automatically/manually completing
- Refresh Token: Suitable for "stable" and "portable", supports batch extracting `1//...` from text/JSON
- When you can't get `refresh_token`, revoke authorization according to error prompt and redo, or directly switch to Refresh Token channel

## Next Lesson Preview

In the next lesson, we'll do something more practical: turn the account pool into a "portable asset".

> Go learn **[Account Backup & Migration: Import/Export, V1/DB Hot Migration](../backup-migrate/)**.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Line Numbers |
| --- | --- | --- |
| Accounts page mounts add dialog | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L267-L731) | 267-731 |
| OAuth URL pre-generation + callback event auto-completion | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L49-L125) | 49-125 |
| OAuth callback event triggers `completeOAuthLogin()` | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L67-L109) | 67-109 |
| Refresh Token batch parsing and deduplication | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L185-L268) | 185-268 |
| Frontend calls Tauri commands (add/OAuth/cancel) | [`src/services/accountService.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/services/accountService.ts#L5-L91) | 5-91 |
| Backend add_account: ignore email, use refresh_token to fetch real email and save | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
| Backend OAuth: check refresh_token missing and provide revoke authorization solution | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L38-L79) | 38-79 |
| OAuth callback server: listen on IPv4/IPv6 simultaneously and choose redirect_uri | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L43-L113) | 43-113 |
| OAuth callback parse `code` and emit `oauth-callback-received` | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L140-L180) | 140-180 |

**Key Event Names**:
- `oauth-url-generated`: Backend sends OAuth URL to frontend after generation (see `oauth_server.rs:250-252`)
- `oauth-callback-received`: Backend notifies frontend after receiving callback and parsing code (see `oauth_server.rs:177-180` / `oauth_server.rs:232-235`)

**Key Commands**:
- `prepare_oauth_url`: Pre-generate authorization link and start callback listening (see `src-tauri/src/commands/mod.rs:471-473`)
- `start_oauth_login`: Open default browser and wait for callback (see `src-tauri/src/commands/mod.rs:339-401`)
- `complete_oauth_login`: Don't open browser, just wait for callback and complete token exchange (see `src-tauri/src/commands/mod.rs:405-467`)
- `add_account`: Save account with refresh_token (see `src-tauri/src/commands/mod.rs:21-60`)

</details>
