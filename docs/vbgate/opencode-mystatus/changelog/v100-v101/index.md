---
title: "v1.0.0-v1.0.1: 初始版本与修复 | opencode-mystatus"
sidebarTitle: "v1.0.0-v1.0.1"
subtitle: "v1.0.0-v1.0.1: 初始版本与修复"
description: "了解 opencode-mystatus v1.0.0 初始版本的新功能，包括多平台额度查询、可视化进度条、多语言支持，以及 v1.0.1 修复的斜杠命令问题。"
tags:
  - "Version"
  - "Changelog"
  - "v1.0.0"
  - "v1.0.1"
order: 999
---

# v1.0.0 - v1.0.1: Initial Release and Slash Command Fixes

## Version Overview

**v1.0.0** (2026-01-11) is the initial release of opencode-mystatus, introducing core features for multi-platform quota queries.

**v1.0.1** (2026-01-11) was released immediately after, addressing a critical issue with slash command support.

---

## v1.0.1 - Slash Command Fixes

### Fixed Issues

**Included `command/` Directory in npm Package**

- **Issue**: After the v1.0.0 release, the slash command `/mystatus` was not working properly
- **Root Cause**: The `command/` directory was missing from the npm package, preventing OpenCode from recognizing the slash command
- **Solution**: Updated the `files` field in `package.json` to ensure the `command/` directory is included in the published package
- **Impact**: Only affects users who installed via npm; manual installations are not affected

### Upgrade Recommendations

If you have already installed v1.0.0, we recommend upgrading to v1.0.1 immediately to get full slash command support:

```bash
## Upgrade to the latest version
npm update @vbgate/opencode-mystatus
```

---

## v1.0.0 - Initial Release

### New Features

**1. Multi-Platform Quota Queries**

One-click quota usage queries for the following platforms:

| Platform | Supported Subscription Types | Quota Types |
| -------- | ---------------------------- | ----------- |
| OpenAI | Plus/Team/Pro | 3-hour quota, 24-hour quota |
| Zhipu AI | Coding Plan | 5-hour Token limit, MCP monthly quota |
| Google Cloud | Antigravity | G3 Pro, G3 Image, G3 Flash, Claude |

**2. Visual Progress Bars**

Intuitively display quota usage:

```
OpenAI (user@example.com)
━━━━━━━━━━━━━━━━━━━━ 75%
Used 750 / 1000 requests
```

**3. Multi-Language Support**

- Chinese (Simplified)
- English

Language auto-detection, no manual switching required.

**4. API Key Masking**

All sensitive information (API Key, OAuth Token) is automatically masked for security:

```
Zhipu AI (zhipuai-coding-plan)
API Key: sk-a1b2****xyz
```

---

## Usage

### Slash Command (Recommended)

Type in OpenCode:

```
/mystatus
```

### Natural Language

You can also ask using natural language:

```
Check my AI platform quotas
```

---

## Upgrade Guide

### Upgrade from v1.0.0 to v1.0.1

```bash
npm update @vbgate/opencode-mystatus
```

After upgrading, restart OpenCode to use the slash command `/mystatus`.

### First-Time Installation

```bash
npm install -g @vbgate/opencode-mystatus
```

After installation, type `/mystatus` in OpenCode to query all platform quotas.

---

## Known Limitations

- v1.0.0 does not support GitHub Copilot (added in v1.2.0)
- v1.0.0 does not support Z.ai (added in v1.1.0)

To use these features, please upgrade to the latest version.

---

## Next Steps

Check out the [v1.2.0 - v1.2.4 Changelog](../v120-v124/) to learn about new features like GitHub Copilot support.
