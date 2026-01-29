---
title: "Invalid Grant: Auto-Disable Recovery | Antigravity-Manager"
sidebarTitle: "Invalid Grant"
subtitle: "invalid_grant and Account Auto-Disable: Why It Happens and How to Recover"
description: "Learn how to handle invalid_grant errors. Understand account auto-disable and recovery methods in Antigravity-Manager."
tags:
  - "FAQ"
  - "Troubleshooting"
  - "OAuth"
  - "Account Management"
  - "invalid_grant"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
  - "advanced-scheduling"
order: 999
---

# invalid_grant and Account Auto-Disable: Why It Happens and How to Recover

## What You'll Learn

- When you see `invalid_grant`, know which type of refresh_token issue it corresponds to
- Understand "why the account suddenly became unavailable": what triggers auto-disable and how the system handles it
- Recover accounts with the shortest path and confirm recovery takes effect for running Proxy

## Symptoms You May Encounter

- Sudden failures when calling local Proxy, with `invalid_grant` appearing in error messages
- Account is still in the Accounts list, but Proxy always skips it (or you feel it's "never being used again")
- When you have only a small number of accounts, encountering one `invalid_grant` noticeably reduces overall availability

## What Is invalid_grant?

**invalid_grant** is a type of error returned by Google OAuth when refreshing `access_token`. For Antigravity-Manager, it means an account's `refresh_token` has likely been revoked or expired, and continuing to retry will only repeatedly fail. Therefore, the system marks that account as unavailable and removes it from the proxy pool.

## Core Concept: The System Doesn't "Temporarily Skip", It "Permanently Disables"

When Proxy detects that the error string during token refresh contains `invalid_grant`, it does two things:

1. **Mark the account as disabled** (persisted to account JSON)
2. **Remove the account from in-memory token pool** (avoiding repeatedly selecting the same broken account)

This is why you see "the account is still there, but Proxy doesn't use it anymore."

::: info disabled vs proxy_disabled

- `disabled=true`: Account is "completely disabled" (typical reason is `invalid_grant`). It's directly skipped when loading the account pool.
- `proxy_disabled=true`: Account is only "unavailable to Proxy" (manual disable/batch operations/quota protection related logic), with different semantics.

These two states are judged separately when loading the account pool: first check `disabled`, then perform quota protection and `proxy_disabled` checks.

:::

## Follow Along

### Step 1: Confirm It's invalid_grant Triggered by refresh_token Refresh

**Why**: `invalid_grant` can appear in multiple call chains, but this project's "auto-disable" only triggers when **refresh access_token fails**.

In Proxy logs, you'll see error logs like this (keywords are `Token refresh failed` + `invalid_grant`):

```text
Token refresh failed (<email>): <...invalid_grant...>, trying next account
Disabling account due to invalid_grant (<email>): refresh_token likely revoked/expired
```

**You should see**: After the same account encounters `invalid_grant`, it's quickly no longer selected (because it was removed from token pool).

### Step 2: Check the disabled Field in Account File (Optional, But Most Accurate)

**Why**: Auto-disable is "persisted". After confirming file contents, you can rule out misjudgment as "just temporary rotation."

Account files are located in the `accounts/` directory of the application data directory (for data directory location, see **[First Run Essentials: Data Directory, Logs, Tray, and Auto-Startup](/lbjlaq/Antigravity-Manager/start/first-run-data/)**). When an account is disabled, these three fields appear in the file:

```json
{
  "disabled": true,
  "disabled_at": 1700000000,
  "disabled_reason": "invalid_grant: ..."
}
```

**You should see**: `disabled` is `true`, and `disabled_reason` contains the `invalid_grant:` prefix.

### Step 3: Recover Account (Recommended Approach: Re-Add the Same Account)

**Why**: This project's "recovery" isn't manually toggling a switch in Proxy, but triggering auto-reenabling through "explicitly updating token."

Go to the **Accounts** page and re-add the account with your new credentials (choose either of two methods):

1. Go through OAuth authorization flow again (see **[Add Account: OAuth/Refresh Token Dual Channel and Best Practices](/lbjlaq/Antigravity-Manager/start/add-account/)**)
2. Add again with a new `refresh_token` (the system will use the email returned by Google as the basis for upsert)

When the system detects that the `refresh_token` or `access_token` from this upsert is different from the old value, and that account was previously in `disabled=true` state, it will automatically clear:

- `disabled`
- `disabled_reason`
- `disabled_at`

**You should see**: The account is no longer in disabled state, and (if Proxy is running) the account pool will be automatically reloaded, making recovery take effect immediately.

### Step 4: Verify Recovery Has Taken Effect for Proxy

**Why**: If you only have one account, or if other accounts are also unavailable, you should immediately see "availability is back" after recovery.

Verification method:

1. Initiate a request that triggers token refresh (e.g., wait for token to approach expiration before requesting)
2. Observe that logs no longer show "skip disabled account" prompts

**You should see**: Requests pass normally, and logs no longer show the `invalid_grant` disable process for that account.

## Common Pitfalls

### ❌ Treating disabled as "Temporary Rotation"

If you only look at "the account is still there" in the UI, it's easy to misjudge it as "the system is just not using it temporarily." But `disabled=true` is written to disk and continues to take effect after restart.

### ❌ Only Adding access_token, Not Updating refresh_token

The trigger point for `invalid_grant` is the `refresh_token` used when refreshing `access_token`. If you only temporarily obtained an `access_token` that still works, but `refresh_token` remains invalid, it will still trigger disable again later.

## Checkpoints ✅

- [ ] You can confirm in logs that `invalid_grant` comes from refresh_token refresh failure
- [ ] You know the semantic difference between `disabled` and `proxy_disabled`
- [ ] You can recover accounts by re-adding accounts (OAuth or refresh_token)
- [ ] You can verify that recovery has taken effect for the running Proxy

## Lesson Summary

- When `invalid_grant` is triggered, Proxy **persists the account as disabled** to disk and removes it from the token pool to avoid repeated failures
- The key to recovery is "explicitly updating the token" (re-OAuth or adding again with a new refresh_token); the system will automatically clear `disabled_*` fields
- The account JSON in the data directory is the authoritative source of state (disable/reason/time are all in there)

## Next Lesson Preview

> In the next lesson, we'll learn **[401/Authentication Failure: auth_mode, Header Compatibility, and Client Configuration Checklist](/lbjlaq/Antigravity-Manager/faq/auth-401/)**.
>
> You'll learn:
> - Which layer of "Mode/Key/Header" 401 typically doesn't match
> - What authentication headers different clients should carry
> - How to self-check and fix via the shortest path

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
| --- | --- | --- |
| Design explanation: invalid_grant issues and changed behavior | [`docs/proxy-invalid-grant.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-invalid-grant.md#L1-L52) | 1-52 |
| Skip `disabled=true` when loading account pool | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L70-L158) | 70-158 |
| Recognize `invalid_grant` when token refresh fails and disable account | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L840-L890) | 840-890 |
| Persist `disabled/disabled_at/disabled_reason` to disk and remove from memory | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| `disabled_reason` truncation (avoid account file bloat) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1464-L1471) | 1464-1471 |
| Auto-clear `disabled_*` on upsert (token change considered as user having fixed credentials) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L178-L206) | 178-206 |
| Auto reload proxy accounts after re-adding account (takes effect immediately while running) | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L21-L59) | 21-59 |

</details>
