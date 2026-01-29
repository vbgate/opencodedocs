---
title: "Account Migration: Cross-Machine Setup | opencode-antigravity-auth"
sidebarTitle: "Migration"
subtitle: "Account Migration: Cross-Machine Setup & Version Upgrades"
description: "Learn how to migrate Antigravity Auth account files across macOS/Linux/Windows. Understand v1/v2/v3 storage format auto-upgrade mechanisms and resolve migration issues like invalid_grant."
tags:
  - "migration"
  - "cross-machine"
  - "version-upgrade"
  - "account-management"
prerequisite:
  - "quick-install"
order: 2
---

# Account Migration: Cross-Machine Setup & Version Upgrades

## What You'll Learn

- ✅ Migrate accounts from one machine to another
- ✅ Understand storage format version changes (v1/v2/v3)
- ✅ Resolve post-migration authentication issues (invalid_grant errors)
- ✅ Share the same account across multiple devices

## Your Current Challenge

You bought a new computer and need to continue using Antigravity Auth on it to access Claude and Gemini 3, but don't want to go through the OAuth authentication flow again. Or after upgrading the plugin version, you discover that your original account data is no longer usable.

## When to Use This Approach

- 📦 **New Device**: Migrate from old computer to new computer
- 🔄 **Multi-Device Sync**: Share accounts between desktop and laptop
- 🆙 **Version Upgrade**: Storage format changes after plugin upgrade
- 💾 **Backup Recovery**: Regularly backup account data

## Core Concept

**Account migration** is the process of copying the account file (antigravity-accounts.json) from one machine to another. The plugin automatically handles storage format version upgrades.

### Migration Mechanism Overview

The storage format has version control (currently v3), and the plugin **automatically handles version migration**:

| Version | Main Changes | Current Status |
| ------- | ------------ | -------------- |
| v1 → v2 | Structured rate limit state | ✅ Auto migrate |
| v2 → v3 | Support dual quota pools (gemini-antigravity/gemini-cli) | ✅ Auto migrate |

Storage file locations (cross-platform):

| Platform | Path |
| -------- | ---- |
| macOS/Linux | `~/.config/opencode/antigravity-accounts.json` |
| Windows | `%APPDATA%\opencode\antigravity-accounts.json` |

::: tip Security Reminder
The account file contains OAuth refresh token, which is **equivalent to a password**. Please use encrypted methods (e.g., SFTP, encrypted ZIP) when transferring.
:::

## 🎒 Prerequisites

- [ ] OpenCode installed on target machine
- [ ] Antigravity Auth plugin installed on target machine: `opencode plugin add opencode-antigravity-auth@beta`
- [ ] Ensure both machines can securely transfer files (SSH, USB drive, etc.)

## Follow Along

### Step 1: Locate Account File on Source Machine

**Why**
Need to locate the JSON file containing account information.

```bash
# macOS/Linux
ls -la ~/.config/opencode/antigravity-accounts.json

# Windows PowerShell
Get-ChildItem "$env:APPDATA\opencode\antigravity-accounts.json"
```

**You should see**: File exists with content similar to:

```json
{
  "version": 3,
  "accounts": [...],
  "activeIndex": 0
}
```

If the file doesn't exist, it means no accounts have been added yet. Please run `opencode auth login` first.

### Step 2: Copy Account File to Target Machine

**Why**
Transfer account information (refresh token and Project ID) to the new device.

::: code-group

```bash [macOS/Linux]
# Method 1: Use scp (via SSH)
scp ~/.config/opencode/antigravity-accounts.json user@new-machine:/tmp/

# Method 2: Use USB drive
cp ~/.config/opencode/antigravity-accounts.json /Volumes/USB/
```

```powershell [Windows]
# Method 1: Use PowerShell Copy-Item (via SMB)
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "\\new-machine\c$\Users\user\Downloads\"

# Method 2: Use USB drive
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "E:\"
```

:::

**You should see**: File successfully copied to target machine's temporary directory (e.g., `/tmp/` or `Downloads/`).

### Step 3: Install Plugin on Target Machine

**Why**
Ensure the plugin version on target machine is compatible.

```bash
opencode plugin add opencode-antigravity-auth@beta
```

**You should see**: Plugin installation success message.

### Step 4: Place File in Correct Location

**Why**
The plugin only looks for account files in a fixed path.

::: code-group

```bash [macOS/Linux]
# Create directory (if it doesn't exist)
mkdir -p ~/.config/opencode

# Copy file
cp /tmp/antigravity-accounts.json ~/.config/opencode/

# Verify permissions
chmod 600 ~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
# Copy file (directory will be created automatically)
Copy-Item "$env:Downloads\antigravity-accounts.json" "$env:APPDATA\opencode\"

# Verify
Test-Path "$env:APPDATA\opencode\antigravity-accounts.json"
```

:::

**You should see**: File exists in configuration directory.

### Step 5: Verify Migration Result

**Why**
Confirm accounts are correctly loaded.

```bash
# List accounts (will trigger plugin to load account file)
opencode auth login

# If accounts exist, will show:
# 2 account(s) saved:
#   1. user1@gmail.com
#   2. user2@gmail.com
# (a)dd new account(s) or (f)resh start? [a/f]:
```

Press `Ctrl+C` to exit (no need to add new account).

**You should see**: Plugin successfully recognizes account list, including migrated account emails.

### Step 6: Test First Request

**Why**
Verify refresh token is still valid.

```bash
# Initiate a test request in OpenCode
# Select: google/antigravity-gemini-3-flash
```

**You should see**: Model responds normally.

## Checkpoint ✅

- [ ] Target machine can list migrated accounts
- [ ] Test request succeeds (no authentication errors)
- [ ] Plugin logs show no errors

## Common Pitfalls

### Issue 1: "API key missing" Error

**Symptom**: After migration, requests report `API key missing`.

**Cause**: Refresh token may have expired or been revoked by Google (e.g., password change, security event).

**Solution**:

```bash
# Clear account file and re-authenticate
rm ~/.config/opencode/antigravity-accounts.json  # macOS/Linux
del "%APPDATA%\opencode\antigravity-accounts.json"  # Windows

opencode auth login
```

### Issue 2: Plugin Version Incompatible

**Symptom**: After migration, account file cannot be loaded, log shows `Unknown storage version`.

**Cause**: Target machine's plugin version is too old and doesn't support current storage format.

**Solution**:

```bash
# Upgrade to latest version
opencode plugin add opencode-antigravity-auth@latest

# Test again
opencode auth login
```

### Issue 3: Dual Quota Pool Data Lost

**Symptom**: After migration, Gemini models only use one quota pool, no automatic fallback.

**Cause**: Only copied `antigravity-accounts.json` during migration, but configuration file `antigravity.json` was not migrated.

**Solution**:

Also copy configuration file (if `quota_fallback` is enabled):

::: code-group

```bash [macOS/Linux]
# Copy configuration file
cp ~/.config/opencode/antigravity.json ~/.config/opencode/
```

```powershell [Windows]
# Copy configuration file
Copy-Item "$env:APPDATA\opencode\antigravity.json" "$env:APPDATA\opencode\"
```

:::

### Issue 4: File Permission Error

**Symptom**: `Permission denied` error on macOS/Linux.

**Cause**: Incorrect file permissions, plugin cannot read.

**Solution**:

```bash
# Fix permissions
chmod 600 ~/.config/opencode/antigravity-accounts.json
chown $USER ~/.config/opencode/antigravity-accounts.json
```

## Storage Format Auto-Migration Details

When loading accounts, the plugin automatically detects storage version and migrates:

```
v1 (old version)
  ↓ migrateV1ToV2()
v2
  ↓ migrateV2ToV3()
v3 (current version)
```

**Migration Rules**:
- v1 → v2: Split `rateLimitResetTime` into two fields: `claude` and `gemini`
- v2 → v3: Split `gemini` into `gemini-antigravity` and `gemini-cli` (support dual quota pools)
- Auto cleanup: Expired rate limit times are filtered out (`> Date.now()`)

::: info Auto Deduplication
When loading accounts, the plugin automatically deduplicates by email, keeping the newest account (sorted by `lastUsed` and `addedAt`).
:::

## Summary

Core steps for account migration:

1. **Locate File**: Find `antigravity-accounts.json` on source machine
2. **Copy & Transfer**: Securely transfer to target machine
3. **Place Correctly**: Put in configuration directory (`~/.config/opencode/` or `%APPDATA%\opencode\`)
4. **Verify & Test**: Run `opencode auth login` to confirm recognition

The plugin **automatically handles version migration**, no manual modification of storage file format needed. However, if you encounter `invalid_grant` errors, you must re-authenticate.

## Next Lesson Preview

> In the next lesson, we'll learn **[ToS Warning](../tos-warning/)**.
>
> You'll learn:
> - Risks of using Antigravity Auth
> - How to avoid account bans
> - Google's Terms of Service restrictions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
| -------- | --------- | ----- |
| Storage format definition | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L128-L198) | 128-198 |
| v1→v2 migration | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L366-L395) | 366-395 |
| v2→v3 migration | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L397-L431) | 397-431 |
| Account loading (with auto-migration) | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L433-L518) | 433-518 |
| Configuration directory path | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L202-L213) | 202-213 |
| File deduplication logic | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L301-L364) | 301-364 |

**Key Interfaces**:

- `AccountStorageV3` (v3 storage format):
  ```typescript
  interface AccountStorageV3 {
    version: 3;
    accounts: AccountMetadataV3[];
    activeIndex: number;
    activeIndexByFamily?: { claude?: number; gemini?: number; };
  }
  ```

- `AccountMetadataV3` (account metadata):
  ```typescript
  interface AccountMetadataV3 {
    email?: string;                    // Google account email
    refreshToken: string;              // OAuth refresh token (core)
    projectId?: string;                // GCP project ID
    managedProjectId?: string;         // Managed project ID
    addedAt: number;                   // Add timestamp
    lastUsed: number;                  // Last used time
    lastSwitchReason?: "rate-limit" | "initial" | "rotation";
    rateLimitResetTimes?: RateLimitStateV3;  // Rate limit reset time (v3 supports dual quota pools)
    coolingDownUntil?: number;          // Cooldown end time
    cooldownReason?: CooldownReason;   // Cooldown reason
  }
  ```

- `RateLimitStateV3` (v3 rate limit state):
  ```typescript
  interface RateLimitStateV3 {
    claude?: number;                  // Claude quota reset time
    "gemini-antigravity"?: number;    // Gemini Antigravity quota reset time
    "gemini-cli"?: number;            // Gemini CLI quota reset time
  }
  ```

**Key Functions**:
- `loadAccounts()`: Load account file, auto-detect version and migrate (storage.ts:433)
- `migrateV1ToV2()`: Migrate v1 format to v2 (storage.ts:366)
- `migrateV2ToV3()`: Migrate v2 format to v3 (storage.ts:397)
- `deduplicateAccountsByEmail()`: Deduplicate by email, keep newest account (storage.ts:301)
- `getStoragePath()`: Get storage file path, cross-platform compatible (storage.ts:215)

**Migration Logic**:
- Detect `data.version` field (storage.ts:446)
- v1: Migrate to v2 first, then to v3 (storage.ts:447-457)
- v2: Directly migrate to v3 (storage.ts:458-468)
- v3: No migration needed, load directly (storage.ts:469-470)
- Auto cleanup expired rate limit times (storage.ts:404-410)

</details>
