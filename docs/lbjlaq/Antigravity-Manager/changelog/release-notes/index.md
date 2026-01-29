---
title: "Release Notes: Version Evolution | Antigravity-Manager"
sidebarTitle: "Release Notes"
subtitle: "Release Notes: Version Evolution"
description: "Learn how to track Antigravity Tools version evolution and release notes. Confirm current version in Settings About page, check updates, and verify upgrade impact with /healthz."
tags:
  - "changelog"
  - "release"
  - "upgrade"
  - "troubleshooting"
prerequisite:
  - "start-installation"
  - "start-proxy-and-first-client"
order: 999
---

# Version Evolution: Follow README Embedded Changelog

When you're preparing to upgrade Antigravity Tools, the worst fear isn't "not updating to the latest version" — it's "updating only to discover breaking compatibility changes." This page explains **how to read the Antigravity Tools Changelog (version evolution)** so you can determine: what will this update affect for you?

## What You'll Learn

- Quickly confirm current version, check updates, and get download entry in Settings → About page
- Read only version sections relevant to you in the README Changelog (instead of scrolling from start to finish)
- Before upgrading: confirm if there are "manual configuration/model mapping change" reminders
- After upgrading: run minimum verification (`/healthz`) to confirm proxy still works

## What is a Changelog?

**Changelog** is a list that records "what changed in this release" organized by version. Antigravity Tools writes it directly in the README under "版本演进" (Version Evolution), with each version labeled with date and key changes. Reviewing the Changelog before upgrading reduces the chance of hitting compatibility changes or regression issues.

## When to Use This Page

- You're upgrading from an old version to a new version and want to confirm risk points first
- You're encountering an issue (like 429/0 Token/Cloudflared) and want to verify if it was fixed in recent versions
- You're maintaining a unified version in your team and need a method for colleagues to read changes by version

## 🎒 Preparation

::: warning Prepare Your Upgrade Path First
There are many installation/upgrade methods (brew, manual download from Releases, in-app update). If you haven't decided which path to use, first review **[Installation & Upgrades: Best Desktop Installation Paths (brew / releases)](/lbjlaq/Antigravity-Manager/start/installation/)**.
:::

## Follow Along

### Step 1: Confirm Your Current Version in About Page

**Why**
The Changelog is organized by version. You need to know your current version first, so you know "where to start reading."

Navigation: **Settings** → **About**.

**What you should see**: The page title area displays the app name and version number (e.g., `v3.3.49`).

### Step 2: Click "Check Updates" to Get Latest Version and Download Entry

**Why**
You need to know "what's the latest version number" first, so you can pick out the version sections you've crossed in the Changelog.

Click "检查更新" (Check Updates) in the About page.

**What you should see**:
- If an update is available: Prompt "new version available" with a download button (opens `download_url`)
- If already latest: Prompt "latest version"

### Step 3: Go to README Changelog and Only Read Versions You've Crossed

**Why**
You only need to care about changes "from your current version to the latest version" — you can skip other historical versions.

Open the README, locate **"版本演进"** (Version Evolution), and read from the latest version downward until you see your current version.

**What you should see**: Versions are listed in `vX.Y.Z (YYYY-MM-DD)` format, with each version having grouped explanations (e.g., core fixes / feature enhancements).

### Step 4: Perform Minimum Verification After Upgrading

**Why**
The first thing after upgrading isn't "running complex scenarios" — it's confirming the proxy can still start normally and be probed by clients.

Follow the **[Launch Local Reverse Proxy and Connect First Client (/healthz + SDK Configuration)](/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** flow, and at least verify `GET /healthz` once.

**What you should see**: `/healthz` returns success (used to confirm service availability).

## Recent Version Summary (Excerpt from README)

| Version | Date | Points You Should Focus On |
|--- | --- | ---|
| `v3.3.49` | 2026-01-22 | Thinking interruption and 0 Token defense; remove `gemini-2.5-flash-lite` and remind you to manually replace custom mappings; language/theme settings take effect immediately; monitoring dashboard enhancements; OAuth compatibility improvements |
| `v3.3.48` | 2026-01-21 | Windows platform background process silent running (fix console flicker) |
| `v3.3.47` | 2026-01-21 | Image generation parameter mapping enhancements (`size`/`quality`); Cloudflared tunnel support; fix startup failure caused by merge conflicts; three-tier progressive context compression |

::: tip How to Quickly Judge "Will This Update Affect Me"
Prioritize finding these two types of sentences:

- **User reminders / You need to modify**: For example, explicitly naming a default model being removed, requiring you to manually adjust custom mappings
- **Core fixes / Compatibility fixes**: For example, 0 Token, 429, Windows flicker, startup failure — these "will break your usage" issues
:::

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Content | File Path | Lines |
|--- | --- | ---|
| README embedded Changelog (Version Evolution) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L324-L455) | 324-455 |
| About page display version number and "Check Updates" button | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L821-L954) | 821-954 |
| About page "Check Updates" command return structure | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L187-L215) | 187-215 |
|--- | --- | ---|
| Current version number (build metadata) | [`package.json`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/package.json#L1-L4) | 1-4 |

</details>
