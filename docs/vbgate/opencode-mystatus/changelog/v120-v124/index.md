---
title: "v1.2.0-v1.2.4: Copilot Support | opencode-mystatus"
sidebarTitle: "v1.2.0-v1.2.4"
subtitle: "v1.2.0-v1.2.4: Added Copilot Support and Documentation Improvements"
description: "Learn about v1.2.0 to v1.2.4 updates. Added GitHub Copilot Premium Requests query, improved installation instructions, and fixed code lint errors."
tags:
  - "changelog"
  - "v1.2.0"
  - "v1.2.1"
  - "v1.2.2"
  - "Copilot"
order: 999
---

# v1.2.0 - v1.2.4: Added Copilot Support and Documentation Improvements

## Version Overview

This update (v1.2.0 - v1.2.4) brings significant feature enhancements to opencode-mystatus, most notably **added support for GitHub Copilot quota queries**. The documentation has also been improved with updated installation instructions and fixed code lint errors.

**Key Changes**:
- ✅ Added GitHub Copilot Premium Requests query
- ✅ Integrated GitHub internal API
- ✅ Updated Chinese and English documentation
- ✅ Improved installation instructions, removed version restrictions
- ✅ Fixed code lint errors

---

## [1.2.2] - 2026-01-14

### Documentation Improvements

- **Updated installation instructions**: Removed version restrictions in `README.md` and `README.zh-CN.md`
- **Auto-update support**: Users can now receive the latest version automatically without manually modifying version numbers

**Impact**: When installing or upgrading the plugin, users no longer need to specify a specific version. They can use the `@latest` tag to get the latest version.

---

## [1.2.1] - 2026-01-14

### Bug Fixes

- **Fixed lint errors**: Removed unused `maskString` import in `copilot.ts`

**Impact**: Improved code quality, passes ESLint checks, no functional changes.

---

## [1.2.0] - 2026-01-14

### New Features

#### GitHub Copilot Support

This is the core feature of this update:

- **Added Copilot quota query**: Supports querying GitHub Copilot Premium Requests usage
- **Integrated GitHub internal API**: Added `copilot.ts` module to fetch quota data via GitHub API
- **Updated documentation**: Added Copilot-related documentation in `README.md` and `README.zh-CN.md`

**Supported Authentication Methods**:
1. **Fine-grained PAT** (Recommended): User-created Fine-grained Personal Access Token
2. **OAuth Token**: OpenCode OAuth Token (requires Copilot permissions)

**Query Content**:
- Total Premium Requests and usage
- Usage details for each model
- Subscription type identification (free, pro, pro+, business, enterprise)

**Usage Example**:

```bash
# Execute mystatus command
/mystatus

# You'll see the GitHub Copilot section in the output
Account:        GitHub Copilot (@username)

  Premium Requests  ██████████░░░░░░░░░░ 75% (75/300)

  Model Usage Details:
    gpt-4o: 150 Requests
    claude-3.5-sonnet: 75 Requests

  Billing Cycle: 2026-01
```

---

## Upgrade Guide

### Automatic Upgrade (Recommended)

Since v1.2.2 updated the installation instructions and removed version restrictions, you can now:

```bash
# Install using latest tag
opencode plugin install vbgate/opencode-mystatus@latest
```

### Manual Upgrade

If you have an older version installed, you can update directly:

```bash
# Uninstall old version
opencode plugin uninstall vbgate/opencode-mystatus

# Install new version
opencode plugin install vbgate/opencode-mystatus@latest
```

### Configure Copilot

After upgrading, you can configure GitHub Copilot quota query:

#### Method 1: Using Fine-grained PAT (Recommended)

1. Create a Fine-grained Personal Access Token on GitHub
2. Create configuration file `~/.config/opencode/copilot-quota-token.json`:

```json
{
  "token": "ghp_your_fine_grained_pat_here",
  "username": "your-github-username",
  "tier": "pro"
}
```

3. Execute `/mystatus` to query quota

#### Method 2: Using OpenCode OAuth Token

Make sure your OpenCode OAuth Token has Copilot permissions, then execute `/mystatus` directly.

::: tip Tip
For detailed Copilot authentication configuration, please refer to the [Copilot Authentication Configuration](/vbgate/opencode-mystatus/advanced/copilot-auth/) tutorial.
:::

---

## Known Issues

### Copilot Permission Issues

If your OpenCode OAuth Token doesn't have Copilot permissions, a prompt will be displayed during query. Solutions:

1. Use Fine-grained PAT (Recommended)
2. Re-authorize OpenCode, ensuring Copilot permissions are checked

For detailed solutions, please refer to the [Copilot Authentication Configuration](/vbgate/opencode-mystatus/advanced/copilot-auth/) tutorial.

---

## Future Plans

Future versions may include the following improvements:

- [ ] Support for more GitHub Copilot subscription types
- [ ] Optimize Copilot quota display format
- [ ] Add quota alert feature
- [ ] Support for more AI platforms

---

## Related Documentation

- [Copilot Quota Query](/vbgate/opencode-mystatus/platforms/copilot-usage/)
- [Copilot Authentication Configuration](/vbgate/opencode-mystatus/advanced/copilot-auth/)
- [Troubleshooting](/vbgate/opencode-mystatus/faq/troubleshooting/)

---

## Full Changelog

For all version changes, please visit [GitHub Releases](https://github.com/vbgate/opencode-mystatus/releases).
