---
title: "版本历史: 更新记录 | opencode-antigravity-auth"
sidebarTitle: "版本历史"
subtitle: "版本历史: 更新记录"
description: "了解 opencode-antigravity-auth 的版本历史和重要变更。查看新功能、Bug 修复、性能改进和各版本升级指南。"
tags:
  - "Version History"
  - "Changelog"
  - "Change Log"
order: 1
---

# Version History

This document records the version history and important changes of the Antigravity Auth plugin.

::: tip Latest Version
Current stable version: **v1.3.0** (2026-01-17)
:::

## Version Explanation

### Stable Versions
- Fully tested, recommended for production use
- Version format: `vX.Y.Z` (e.g., v1.3.0)

### Beta Versions
- Includes latest features, may have stability issues
- Version format: `vX.Y.Z-beta.N` (e.g., v1.3.1-beta.3)
- Suitable for early testing and feedback

---

## v1.3.x Series

### v1.3.1-beta.3
**Release Date**: 2026-01-22

**Changes**:
- Improved backoff algorithm for `MODEL_CAPACITY_EXHAUSTED` error, increased random jitter range

### v1.3.1-beta.2
**Release Date**: 2026-01-22

**Changes**:
- Removed unused `googleSearch` configuration item
- Added ToS (Terms of Service) warning and usage recommendations to README

### v1.3.1-beta.1
**Release Date**: 2026-01-22

**Changes**:
- Improved debounce logic for account switch notifications, reduced duplicate prompts

### v1.3.1-beta.0
**Release Date**: 2026-01-20

**Changes**:
- Removed submodule tracking, restored tsconfig.json

### v1.3.0
**Release Date**: 2026-01-17

**Important Changes**:

**New Features**:
- Use Zod v4's native `toJSONSchema` method for schema generation

**Fixes**:
- Fixed token consumption tests, using `toBeCloseTo` to handle floating-point precision issues
- Improved test coverage calculation

**Documentation Improvements**:
- Enhanced load balancing related documentation
- Added formatting improvements

---

## v1.2.x Series

### v1.2.9-beta.10
**Release Date**: 2026-01-17

**Changes**:
- Fixed token balance assertion, using floating-point precision matching

### v1.2.9-beta.9
**Release Date**: 2026-01-16

**Changes**:
- Updated token consumption tests, using `toBeCloseTo` to handle floating-point precision
- Enhanced Gemini tool wrapping functionality, added wrapper function count statistics

### v1.2.9-beta.8
**Release Date**: 2026-01-16

**Changes**:
- Added new issue templates (bug report and feature request)
- Improved project onboarding logic

### v1.2.9-beta.7
**Release Date**: 2026-01-16

**Changes**:
- Updated issue templates, requiring descriptive titles

### v1.2.9-beta.6
**Release Date**: 2026-01-16

**Changes**:
- Added configurable rate limit retry delay
- Improved hostname detection, supports OrbStack Docker environment
- Smart OAuth callback server address binding
- Clarified priority between `thinkingLevel` and `thinkingBudget`

### v1.2.9-beta.5
**Release Date**: 2026-01-16

**Changes**:
- Improved Gemini tool wrapping, supports `functionDeclarations` format
- Ensure custom function wrappers are correctly created in `normalizeGeminiTools`

### v1.2.9-beta.4
**Release Date**: 2026-01-16

**Changes**:
- Wrapped Gemini tools in `functionDeclarations` format
- Applied `toGeminiSchema` in `wrapToolsAsFunctionDeclarations`

### v1.2.9-beta.3
**Release Date**: 2026-01-14

**Changes**:
- Updated documentation and code comments, explaining hybrid strategy implementation
- Simplified antigravity system instructions for testing

### v1.2.9-beta.2
**Release Date**: 2026-01-12

**Changes**:
- Fixed Gemini 3 model parsing logic, deduplicated thinking block handling
- Added Gemini 3 model check for displayed thinking hashes

### v1.2.9-beta.1
**Release Date**: 2026-01-08

**Changes**:
- Updated beta version in plugin installation instructions
- Improved account management, ensuring current authentication is added to stored accounts

### v1.2.9-beta.0
**Release Date**: 2026-01-08

**Changes**:
- Updated README, fixed Antigravity plugin URL
- Updated schema URL to NoeFabris repository

### v1.2.8
**Release Date**: 2026-01-08

**Important Changes**:

**New Features**:
- Gemini 3 model support
- Thinking block deduplication

**Fixes**:
- Fixed Gemini 3 model parsing logic
- Displayed thinking hash handling in response conversion

**Documentation Improvements**:
- Updated test script output redirection
- Updated model test options

### v1.2.7
**Release Date**: 2026-01-01

**Important Changes**:

**New Features**:
- Improved account management, ensuring current authentication is correctly stored
- Automatic npm version publishing via GitHub Actions

**Fixes**:
- Fixed output redirection in E2E test scripts

**Documentation Improvements**:
- Updated repository URL to NoeFabris

---

## v1.2.6 - v1.2.0 Series

### v1.2.6
**Release Date**: 2025-12-26

**Changes**:
- Added workflow for automatic npm version republishing

### v1.2.5
**Release Date**: 2025-12-26

**Changes**:
- Documentation update, version number corrected to 1.2.6

### v1.2.4 - v1.2.0
**Release Date**: December 2025

**Changes**:
- Multi-account load balancing
- Dual quota system (Antigravity + Gemini CLI)
- Session recovery mechanism
- OAuth 2.0 PKCE authentication
- Thinking model support (Claude and Gemini 3)
- Google Search grounding

---

## v1.1.x Series

### v1.1.0 and Later Versions
**Release Date**: November 2025

**Changes**:
- Optimized authentication flow
- Improved error handling
- Added more configuration options

---

## v1.0.x Series (Early Versions)

### v1.0.4 - v1.0.0
**Release Date**: October 2025 and earlier

**Initial Features**:
- Basic Google OAuth authentication
- Antigravity API access
- Simple model support

---

## Version Upgrade Guide

### Upgrading from v1.2.x to v1.3.x

**Compatibility**: Fully compatible, no configuration changes required

**Recommended Actions**:
```bash
# Update plugin
opencode plugin update opencode-antigravity-auth

# Verify installation
opencode auth status
```

### Upgrading from v1.1.x to v1.2.x

**Compatibility**: Requires updating account storage format

**Recommended Actions**:
```bash
# Backup existing accounts
cp ~/.config/opencode/antigravity-accounts.json ~/.config/opencode/antigravity-accounts.json.bak

# Update plugin
opencode plugin update opencode-antigravity-auth@latest

# Re-login (if needed)
opencode auth login
```

### Upgrading from v1.0.x to v1.2.x

**Compatibility**: Account storage format incompatible, re-authentication required

**Recommended Actions**:
```bash
# Update plugin
opencode plugin update opencode-antigravity-auth@latest

# Re-login
opencode auth login

# Add model configuration as required by new version
```

---

## Beta Version Notes

**Beta Version Usage Recommendations**:

| Use Case | Recommended Version | Description |
|---------|---------|------|
| Production | Stable (vX.Y.Z) | Fully tested, high stability |
| Daily Development | Latest Stable | Complete features, fewer bugs |
| Early Testing | Latest Beta | Experience latest features, may be unstable |

**Installing Beta Versions**:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**Upgrading to Stable Version**:

```bash
opencode plugin update opencode-antigravity-auth@latest
```

---

## Version Number Explanation

Version numbers follow [Semantic Versioning 2.0.0](https://semver.org/) specification:

- **Major version (X)**: Incompatible API changes
- **Minor version (Y)**: Backwards-compatible feature additions
- **Patch version (Z)**: Backwards-compatible bug fixes

**Examples**:
- `1.3.0` → Major 1, Minor 3, Patch 0
- `1.3.1-beta.3` → 3rd Beta version of 1.3.1

---

## Getting Update Notifications

**Auto Updates** (enabled by default):

```json
{
  "auto_update": true
}
```

**Manual Update Check**:

```bash
# View current version
opencode plugin list

# Update plugin
opencode plugin update opencode-antigravity-auth
```

---

## Download Links

- **NPM Stable Version**: https://www.npmjs.com/package/opencode-antigravity-auth
- **GitHub Releases**: https://github.com/NoeFabris/opencode-antigravity-auth/releases

---

## Contributing and Feedback

If you encounter issues or have feature suggestions, please:

1. Check the [Troubleshooting Guide](/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/)
2. Submit issues on [GitHub Issues](https://github.com/NoeFabris/opencode-antigravity-auth/issues)
3. Use the correct issue templates (Bug Report / Feature Request)
