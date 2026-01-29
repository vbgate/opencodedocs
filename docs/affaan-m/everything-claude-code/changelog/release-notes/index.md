---
title: "Changelog: Version History | Everything Claude Code"
sidebarTitle: "Changelog"
subtitle: "Changelog: Version History and Changes"
description: "Learn about version history and changes for Everything Claude Code. Track new features, bug fixes, security updates, and decide whether to upgrade."
tags:
  - "changelog"
  - "updates"
prerequisite: []
order: 250
---

# Changelog: Version History and Changes

## What You'll Learn

- Learn about key changes in each version
- Track new features and bug fixes
- Decide whether to upgrade

## Version History

### 2026-01-24 - Security Fixes and Documentation Fixes

**Fixed**:
- 🔒 **Security Fix**: Prevent command injection vulnerability in `commandExists()`
  - Replace `execSync` with `spawnSync`
  - Validate input to only allow alphanumeric characters, hyphens, underscores, and dots
- 📝 **Documentation Fix**: Add security documentation warning for `runCommand()`
- 🐛 **XSS Scanner False Positive Fix**: Replace `<script>` and `<binary>` with `[script-name]` and `[binary-name]`
- 📚 **Documentation Fix**: Correct `npx ts-morph` in `doc-updater.md` to proper `npx tsx scripts/codemaps/generate.ts`

**Impact**: #42, #43, #51

---

### 2026-01-22 - Cross-Platform Support and Pluginization

**New Features**:
- 🌐 **Cross-Platform Support**: All hooks and scripts rewritten in Node.js, supporting Windows, macOS, and Linux
- 📦 **Plugin Packaging**: Distributed as a Claude Code plugin, supporting plugin marketplace installation
- 🎯 **Package Manager Auto-Detection**: Supports 6 detection priority levels
  - Environment variable `CLAUDE_PACKAGE_MANAGER`
  - Project configuration `.claude/package-manager.json`
  - `package.json`'s `packageManager` field
  - Lock file detection (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
  - Global configuration `~/.claude/package-manager.json`
  - Fallback to the first available package manager

**Fixed**:
- 🔄 **Hook Loading**: Automatically load hooks by convention, remove hooks declaration from `plugin.json`
- 📌 **Hook Paths**: Use `${CLAUDE_PLUGIN_ROOT}` and relative paths
- 🎨 **UI Improvements**: Add star history chart and badge bar
- 📖 **Hook Organization**: Move session-end hooks from Stop to SessionEnd

---

### 2026-01-20 - Feature Enhancements

**New Features**:
- 💾 **Memory Persistence Hooks**: Automatically save and load context across sessions
- 🧠 **Strategic Compact Hook**: Intelligent context compression suggestions
- 📚 **Continuous Learning Skill**: Automatically extract reusable patterns from sessions
- 🎯 **Strategic Compact Skill**: Token optimization strategy

---

### 2026-01-17 - Initial Release

**Initial Features**:
- ✨ Complete Claude Code configuration collection
- 🤖 9 specialized agents
- ⚡ 14 slash commands
- 📋 8 rule sets
- 🔄 Automated hooks
- 🎨 11 skill libraries
- 🌐 15+ MCP servers pre-configured
- 📖 Complete README documentation

---

## Version Naming Convention

This project does not use traditional semantic versioning. Instead, it uses **date versioning** format (`YYYY-MM-DD`).

### Version Types

| Type | Description | Example |
|--- | --- | ---|
| **New Feature** | Add new features or major improvements | `feat: add new agent` |
| **Fix** | Fix bugs or issues | `fix: resolve hook loading issue` |
| **Docs** | Documentation updates | `docs: update README` |
| **Style** | Formatting or code style changes | `style: fix indentation` |
| **Refactor** | Code refactoring | `refactor: simplify hook logic` |
| **Performance** | Performance optimization | `perf: improve context loading` |
| **Test** | Testing related | `test: add unit tests` |
| **Build** | Build system or dependencies | `build: update package.json` |
| **Revert** | Revert previous commits | `revert: remove version field` |

---

## How to Get Updates

### Plugin Marketplace Update

If you installed Everything Claude Code through the plugin marketplace:

1. Open Claude Code
2. Run `/plugin update everything-claude-code`
3. Wait for the update to complete

### Manual Update

If you cloned the repository manually:

```bash
cd ~/.claude/plugins/everything-claude-code
git pull origin main
```

### Install from Marketplace

First-time installation:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

---

## Change Impact Analysis

### Security Fixes (Must Upgrade)

- **2026-01-24**: Command injection vulnerability fix, strongly recommended to upgrade

### Feature Enhancements (Optional Upgrade)

- **2026-01-22**: Cross-platform support, Windows users must upgrade
- **2026-01-20**: New feature enhancements, upgrade as needed

### Documentation Updates (No Upgrade Required)

- Documentation updates do not affect functionality, you can manually check the README

---

## Known Issues

### Current Version (2026-01-24)

- No known critical issues

### Previous Versions

- Before 2026-01-22: Hook loading required manual configuration (fixed in 2026-01-22)
- Before 2026-01-20: Windows not supported (fixed in 2026-01-22)

---

## Contributing and Feedback

### Report Issues

If you discover a bug or have a feature suggestion:

1. Search [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues) for similar problems
2. If none exists, create a new issue and provide:
   - Version information
   - Operating system
   - Reproduction steps
   - Expected behavior vs actual behavior

### Submit PR

Contributions are welcome! Please check [CONTRIBUTING.md](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) for details.

---

## Summary

- Everything Claude Code uses date versioning (`YYYY-MM-DD`)
- Security fixes (such as 2026-01-24) must be upgraded
- Feature enhancements can be upgraded as needed
- Plugin marketplace users use `/plugin update` to update
- Manual installation users use `git pull` to update
- Report issues and submit PRs following the project guidelines

## Next Lesson Preview

> Next, we'll learn **[Configuration File Reference](../../appendix/config-reference/)**.
>
> You'll learn:
> - Complete field description for `settings.json`
> - Advanced options for hooks configuration
> - Detailed explanation of MCP server configuration
> - Best practices for custom configuration
