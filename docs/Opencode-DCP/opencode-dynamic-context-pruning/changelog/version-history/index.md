---
title: "Version History: Track Updates | OpenCode DCP"
sidebarTitle: "Version History"
subtitle: "Version History: Track Updates | OpenCode DCP"
description: "View complete version update records for the OpenCode DCP plugin. Learn about new features, improvements, and bug fixes in each version."
tags:
  - "Version History"
  - "Changelog"
  - "DCP"
prerequisite: []
order: 1
---

# DCP Version History

This document records the complete version update history for the OpenCode Dynamic Context Pruning (DCP) plugin.

---

## [v1.2.7] - 2026-01-22

**New Features**
- ✨ Display token count for extracted content (in pruning notifications)
- 🛡️ Improve context injection defense mechanism (add array validation)
- 📝 Enhancement: Inject context as user message when the last message is a user message
- ⚙️ Simplify default configuration (include only schema URL)

---

## [v1.2.6] - 2026-01-21

**New Features**
- ✨ Add `/dcp sweep` command to support manual context pruning

**Command Details**
- `/dcp sweep` - Prune all tools after the last user message
- `/dcp sweep N` - Prune the last N tools

---

## [v1.2.5] - 2026-01-20

**New Features**
- ✨ Display tool count in `/dcp context` command
- ✨ Optimize `/dcp context` command UI:
  - Display pruned tool count
  - Improve progress bar accuracy

**Performance Improvements**
- 🚀 Optimize token calculation in context command

---

## [v1.2.4] - 2026-01-20

**New Features**
- ✨ Unify DCP commands into single `/dcp` command (subcommand structure):
  - `/dcp` - Display help
  - `/dcp context` - Context analysis
  - `/dcp stats` - Statistics
- ✨ Add `commands` configuration section:
  - Enable/disable slash commands
  - Support configuration of protected tools list

**Improvements**
- 📝 Simplify context command UI
- 📝 Documentation update: Clarify context_info tool injection mechanism

**Bug Fixes**
- 🐛 Fix pruning tool error handling (throw error instead of returning string on failure)

**Documentation**
- 📚 Add cache hit rate statistics to README

---

## [v1.2.3] - 2026-01-16

**New Features**
- ✨ Simplify prompt loading (move prompts to TS file)

**Improvements**
- 🔧 Gemini compatibility: Use `thoughtSignature` to bypass tool section injection validation

---

## [v1.2.2] - 2026-01-15

**Bug Fixes**
- 🐛 Simplify injection timing (wait for assistant turn)
- 🐛 Gemini compatibility fix: Use text injection to avoid thought signature errors

---

## [v1.2.1] - 2026-01-14

**Bug Fixes**
- 🐛 Anthropic models: Require reasoning block before injecting context
- 🐛 GitHub Copilot: Skip synthetic message injection with user role

---

## [v1.2.0] - 2026-01-13

**New Features**
- ✨ Add `plan_enter` and `plan_exit` to default protected tools list
- ✨ Support question tool for pruning

**Improvements**
- 🔧 Unify injection mechanism (with isAnthropic check)
- 🔧 Flatten prompt directory structure
- 🔧 Simplify and unify prune.ts check order
- 🔧 Extract system prompt handler to hooks.ts

**Bug Fixes**
- 🐛 Skip system prompt injection for subagent sessions
- 🐛 GitHub Copilot: Skip injection when last message is user role

---

## [v1.1.6] - 2026-01-12

**Bug Fixes**
- 🐛 **Critical fix for GitHub Copilot users**: Use completed assistant message and tool part to inject prunable tools list

**Impact**
- This fix resolves critical issues when GitHub Copilot users use DCP

---

## [v1.1.5] - 2026-01-10

**New Features**
- ✨ Add JSON Schema support for configuration file auto-completion
- ✨ Add protected file pattern configuration (protectedFilePatterns)
- ✨ Support protecting file operations (read/write/edit) via glob patterns

**Improvements**
- 📝 Documentation: Document subagent restrictions

**Bug Fixes**
- 🐛 Fix schema URL to use master branch
- 🐛 Add `$schema` to valid configuration key list

---

## [v1.1.4] - 2026-01-06

**Bug Fixes**
- 🐛 Remove `isInternalAgent` flag (due to hook order race condition)

**Improvements**
- 🔧 Optimize internal agent detection logic

---

## [v1.1.3] - 2026-01-05

**Bug Fixes**
- 🐛 Skip DCP injection for internal agents (title, summary, compaction)
- 🐛 Disable pruning for write/edit tools

**Improvements**
- 🔧 Improve subagent restriction detection

---

## [v1.1.2] - 2025-12-26

**Improvements**
- 🔧 Merge distillation into unified notification
- 🔧 Simplify distillation UI

---

## [v1.1.1] - 2025-12-25

**New Features**
- ✨ Add purge errors strategy to prune inputs after failed tool calls
- ✨ Add skill tool support to `extractParameterKey`

**Improvements**
- 📝 Improve replacement text for error pruning
- 📝 Documentation: Update hints about context poisoning and OAuth

---

## [v1.1.0] - 2025-12-24

**New Features**
- ✨ Major feature version update
- ✨ Add automatic pruning strategies:
  - Deduplication strategy
  - Supersede writes strategy
  - Purge errors strategy

**New Tools**
- ✨ LLM-driven pruning tools:
  - `discard` - Remove tool content
  - `extract` - Extract key findings

**Configuration System**
- ✨ Multi-level configuration support (global/environment variable/project)
- ✨ Turn protection feature
- ✨ Protected tools configuration

---

## [v1.0.4] - 2025-12-18

**Bug Fixes**
- 🐛 Don't prune pending or running tool inputs

**Improvements**
- 🔧 Optimize tool status detection logic

---

## [v1.0.3] - 2025-12-18

**New Features**
- ✅ Message-based compression detection

**Improvements**
- 🔧 Check compression timestamp at session initialization

---

## [v1.0.2] - 2025-12-17

**New Features**
- ✅ Message-based compression detection

**Improvements**
- 🔧 Clean up code structure

---

## [v1.0.1] - 2025-12-16

**Initial Version**

- ✅ Core functionality implementation
- ✅ OpenCode plugin integration
- ✅ Basic context pruning capabilities

---

## Version Naming Convention

- **Major version** (e.g., 1.x) - Incompatible major updates
- **Minor version** (e.g., 1.2.x) - Backward-compatible feature additions
- **Patch version** (e.g., 1.2.7) - Backward-compatible bug fixes

---

## Get the Latest Version

We recommend using the `@latest` tag in your OpenCode configuration to ensure you automatically get the latest version:

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

View the latest release: [npm package](https://www.npmjs.com/package/@tarquinen/opencode-dcp)
