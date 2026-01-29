---
title: "Quick Start: TDD & Code Review in 5 Min | Everything Claude Code"
sidebarTitle: "Quick Start"
subtitle: "Quick Start: Master Everything Claude Code in 5 Minutes"
description: "Learn to install Everything Claude Code in 5 minutes. Master TDD development, code review commands, and improve code quality with specialized agents."
tags:
  - "quickstart"
  - "installation"
  - "getting-started"
prerequisite: []
order: 10
---

# Quick Start: Master Everything Claude Code in 5 Minutes

## What You'll Learn

**Everything Claude Code** is a Claude Code plugin that provides professional agents, commands, rules, and hooks to help you improve code quality and development efficiency. This tutorial helps you:

- ✅ Complete Everything Claude Code installation in 5 minutes
- ✅ Use the `/plan` command to create implementation plans
- ✅ Use the `/tdd` command for test-driven development
- ✅ Use `/code-review` for code reviews
- ✅ Understand the plugin's core components

## Your Current Challenges

You want Claude Code to be more powerful, but:
- ❌ You repeatedly explain coding standards and best practices
- ❌ Low test coverage and frequent bugs
- ❌ Code reviews always miss security issues
- ❌ You want TDD but don't know where to start
- ❌ You want professional sub-agents to handle specific tasks

**Everything Claude Code** solves these problems:
- 9 specialized agents (planner, tdd-guide, code-reviewer, security-reviewer, etc.)
- 14 slash commands (/plan, /tdd, /code-review, etc.)
- 8 enforced rules (security, coding-style, testing, etc.)
- 15+ automated hooks
- 11 workflow skills

## Core Concepts

**Everything Claude Code** is a Claude Code plugin that provides:
- **Agents**: Specialized sub-agents that handle domain-specific tasks (like TDD, code review, security auditing)
- **Commands**: Slash commands that quickly launch workflows (like `/plan`, `/tdd`)
- **Rules**: Enforced rules that ensure code quality and security (like 80%+ coverage, no console.log)
- **Skills**: Workflow definitions that reuse best practices
- **Hooks**: Automated hooks that trigger on specific events (like session persistence, console.log warnings)

::: tip What is a Claude Code Plugin?
Claude Code plugins extend Claude Code's capabilities, just like VS Code plugins extend editor functionality. Once installed, you can use all agents, commands, skills, and hooks provided by the plugin.
:::

## 🎒 Prerequisites

**You need**:
- Claude Code installed
- Basic understanding of terminal commands
- A project directory (for testing)

**You don't need**:
- No special programming language knowledge required
- No pre-configuration needed

---

## Follow Along: 5-Minute Installation

### Step 1: Open Claude Code

Launch Claude Code and open a project directory.

**You should see**: Claude Code's command-line interface ready.

---

### Step 2: Add Marketplace

In Claude Code, run the following command to add the marketplace:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**Why**
Add Everything Claude Code as a Claude Code plugin source so you can install plugins from it.

**You should see**:
```
✓ Successfully added marketplace: everything-claude-code
```

---

### Step 3: Install Plugin

Run the following command to install the plugin:

```bash
/plugin install everything-claude-code@everything-claude-code
```

**Why**
Install the Everything Claude Code plugin so you can use all the features it provides.

**You should see**:
```
✓ Successfully installed plugin: everything-claude-code@everything-claude-code
```

---

### Step 4: Verify Installation

Run the following command to view installed plugins:

```bash
/plugin list
```

**You should see**:
```
Installed Plugins:
  everything-claude-code@everything-claude-code
```

✅ Installation successful!

---

## Follow Along: Experience Core Features

### Step 5: Use /plan to Create an Implementation Plan

Suppose you want to add user authentication, run:

```bash
/plan I need to add user authentication with email and password
```

**Why**
Use the planner agent to create a detailed implementation plan and avoid missing key steps.

**You should see**:
```
# Implementation Plan: User Authentication with Email and Password

## Requirements Restatement
- User registration with email and password
- User login with email and password
- Password hashing with bcrypt
- JWT token generation
- Session management

## Implementation Phases
[Detailed implementation steps...]

## Risks
- HIGH: Password security (use bcrypt, salt rounds)
- MEDIUM: JWT token expiration
- LOW: Email uniqueness validation

## Estimated Complexity: MEDIUM
**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

Enter `yes` to confirm the plan, and the planner will start implementation.

---

### Step 6: Use /tdd for Test-Driven Development

When implementing features, run:

```bash
/tdd I need to implement a function to validate email format
```

**Why**
Use the tdd-guide agent to enforce the TDD workflow, ensuring tests are written first before code implementation, achieving 80%+ coverage.

**You should see**:
```
# TDD Session: Email Format Validator

## Step 1: Define Interface (SCAFFOLD)
```typescript
// lib/email-validator.ts
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)
[Test code...]

## Step 3: Run Tests - Verify FAIL
[Test failure...]

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)
[Implementation code...]

## Step 5: Run Tests - Verify PASS
[Test pass...]

## Step 6: Refactor (IMPROVE)
[Refactored code...]

## Step 7: Verify Tests Still Pass
[Tests still pass...]

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)

✅ TDD session complete!
```

---

### Step 7: Use /code-review to Review Code

Before committing code, run:

```bash
/code-review
```

**Why**
Use the code-reviewer agent to check code quality, security, and best practices.

**You should see**:
```
# Code Review Report

## Overview
- Files reviewed: 3
- Total lines: 150
- Issues found: 2

## Issues Found

### 1. [CRITICAL] Hardcoded JWT Secret
**Location**: `lib/auth.ts:15`
**Issue**: JWT secret is hardcoded in source code
**Fix**: Move to environment variable
**Impact**: Security vulnerability - secret exposed in code

### 2. [MEDIUM] Missing Error Handling
**Location**: `lib/email-validator.ts:23`
**Issue**: No error handling for null/undefined input
**Fix**: Add null check at function start
**Impact**: Potential runtime errors

## Recommendations
✓ Tests are well written
✓ Code is readable
✓ Follows TypeScript best practices

**Action Required**: Fix CRITICAL issues before commit.
```

After fixing issues, run `/code-review` again to confirm all issues are resolved.

---

## Checklist ✅

Confirm you have successfully completed the following steps:

- [ ] Successfully added marketplace
- [ ] Successfully installed everything-claude-code plugin
- [ ] Used `/plan` to create an implementation plan
- [ ] Used `/tdd` for TDD development
- [ ] Used `/code-review` for code review

If you encounter issues, check [Troubleshooting Hooks](../../faq/troubleshooting-hooks/) or [MCP Connection Failures](../../faq/troubleshooting-mcp/).

---

## Common Pitfalls

::: warning Installation Failure
If `/plugin marketplace add` fails, ensure:
1. You're using the latest version of Claude Code
2. Network connection is normal
3. GitHub access is working (may need proxy)
:::

::: warning Commands Not Available
If `/plan` or `/tdd` commands are not available:
1. Run `/plugin list` to confirm the plugin is installed
2. Check if plugin status is enabled
3. Restart Claude Code
:::

::: tip Windows Users
Everything Claude Code fully supports Windows. All hooks and scripts are rewritten using Node.js to ensure cross-platform compatibility.
:::

---

## Summary

✅ You have:
1. Successfully installed the Everything Claude Code plugin
2. Understood core concepts: agents, commands, rules, skills, hooks
3. Experienced three core commands: `/plan`, `/tdd`, `/code-review`
4. Mastered the basic TDD development workflow

**Remember**:
- Agents are specialized sub-agents that handle specific tasks
- Commands are quick entry points to launch workflows
- Rules are enforced rules ensuring code quality and security
- Start with features that resonate, then expand gradually
- Don't enable all MCPs, keep fewer than 10

---

## Coming Up Next

> In the next lesson, we'll learn **[Installation Guide: Plugin Marketplace vs Manual Installation](../installation/)**.
>
> You'll learn:
> - Detailed steps for plugin marketplace installation
> - Complete manual installation process
> - How to copy only needed components
> - MCP server configuration methods

Continue learning to dive deeper into the complete installation and configuration of Everything Claude Code.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature       | File Path                                                                                    | Lines |
| ------------- | ------------------------------------------------------------------------------------------- | ----- |
| Plugin Manifest | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28  |
| Marketplace Config | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45  |
| Installation Guide | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                        | 175-242 |
| /plan command      | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114 |
| /tdd command      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)            | 1-327 |
| /code-review command | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-200 |

**Key Constants**:
- Plugin name: `everything-claude-code`
- Marketplace repo: `affaan-m/everything-claude-code`

**Key Files**:
- `plugin.json`: Plugin metadata and component paths
- `commands/*.md`: 14 slash command definitions
- `agents/*.md`: 9 specialized sub-agents
- `rules/*.md`: 8 enforced rule sets
- `hooks/hooks.json`: 15+ automated hook configurations

</details>
