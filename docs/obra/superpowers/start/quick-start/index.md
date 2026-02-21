---
title: "Quick Start: Get Started in 5 Minutes | Superpowers Tutorial"
sidebarTitle: "5 Minute Quick Start"
subtitle: "Quick Start: Get Started with Superpowers in 5 Minutes"
description: "Install and experience Superpowers core functionality in 5 minutes, including installation, verification, and using your first command. Learn how Superpowers improves AI coding agent development efficiency."
tags:
  - "Quick Start"
  - "Getting Started"
  - "Installation"
order: 20
---

# Quick Start: Get Started in 5 Minutes

## What You'll Learn

By the end of this chapter, you will:
- Complete Superpowers installation in 5 minutes
- Verify the plugin is correctly loaded
- Experience AI agent's new capabilities with the first core command

---

## Your Current Struggles

When using AI to write code, have you encountered these problems:

- AI skips design and starts writing code directly, making repeated changes without getting it right
- Discover logic errors after writing a pile of code, wasting half an hour
- No tests, bugs found only after going live
- AI is lazy and skips TDD, resulting in unstable code quality

**Superpowers solves these problems**—it's not for "smarter AI," it's for "obedient AI." It enforces best practices through mandatory workflows.

---

## When to Use This Approach

Any time you want AI to write code:
- ✅ Build new features
- ✅ Fix bugs
- ✅ Refactor code
- ✅ Write tests

Superpowers automatically checks task types and triggers the appropriate skill workflow.

---

## 🎒 Prerequisites

### Platform Selection

Superpowers supports three major AI coding platforms:

| Platform | Installation Difficulty | Recommended |
| -------- | ---------------------- | ----------- |
| Claude Code | ⭐ Easiest | ✅ Recommended for beginners |
| OpenCode | ⭐⭐⭐ Moderate | Advanced users |
| Codex | ⭐⭐⭐ Complex | Requires CLI experience |

**This tutorial uses Claude Code** because it has a built-in plugin marketplace for fastest installation.

### Requirements

- [Claude Code](https://claude.ai/code) installed
- GitHub account (for plugin marketplace)
- Basic terminal usage knowledge

---

## Core Concept

What is Superpowers?

**Simply put**: A package of "enforced best practices" skills.

**How it works**: Before you let AI write code, it **won't** start writing directly. Instead, it:
1. **Asks you questions first** (brainstorming) — clarifies what you want to do
2. **Writes a plan** (writing-plans) — breaks tasks into 2-5 minute chunks
3. **Develops with TDD** (test-driven-development) — writes tests first, then code
4. **Reviews code** (requesting-code-review) — checks quality every step

**This is not a suggestion, it's a mandatory rule** — skills trigger automatically, and AI must follow them.

---

## Follow Along

### Step 1: Register Plugin Marketplace

Open Claude Code and enter:

```bash
/plugin marketplace add obra/superpowers-marketplace
```

**Why**

Register the plugin marketplace so Claude Code knows where to find Superpowers plugins.

**You should see**:

```
✅ Successfully added marketplace: obra/superpowers-marketplace
```

---

### Step 2: Install Superpowers Plugin

```bash
/plugin install superpowers@superpowers-marketplace
```

**Why**

Download and install the Superpowers plugin from the marketplace you just registered.

**You should see**:

```
📦 Installing superpowers from superpowers-marketplace...
✅ Successfully installed superpowers
```

---

### Step 3: Verify Installation

```bash
/help
```

**Why**

Check if Superpowers commands are correctly loaded.

**You should see** the following commands:

| Command | Function |
| ------- | -------- |
| `/superpowers:brainstorm` | Interactive design refinement |
| `/superpowers:write-plan` | Create implementation plan |
| `/superpowers:execute-plan` | Batch execute plan |

If you see these three commands, installation is successful!

---

### Step 4: Experience Your First Command

Now try the core feature — let AI clarify requirements with you before writing code.

Enter:

```bash
/superpowers:brainstorm I want to add a comment feature to the blog
```

**Why**

Trigger the brainstorming skill so AI asks questions first instead of writing code directly.

**You will see**:

1. AI won't write code directly
2. AI will ask you questions (e.g., "What features should comments support? Is login required? Do you need likes?")
3. After you answer, AI will display the design in segments (200-300 words each, easy to digest)
4. Once design is confirmed, AI will save the design document to the `docs/plans/` directory

This is the core of Superpowers — **clarify first, then code**.

---

## Checklist ✅

Confirm all checkpoints pass:

- [ ] `/help` shows three commands: `/superpowers:brainstorm`, etc.
- [ ] `/superpowers:brainstorm` command triggers (AI asks questions first, doesn't write code directly)
- [ ] AI doesn't skip design and start coding directly

If all pass, congratulations! You've completed the Superpowers quick start!

---

## Troubleshooting Tips

### Commands Not Appearing

**Symptom**: Superpowers commands not visible in `/help`

**Solution**:
1. Confirm you entered `/superpowers:brainstorm` (colon, not space)
2. Try restarting Claude Code
3. Re-execute installation steps

### AI Still Writes Code Directly

**Symptom**: After using `/superpowers:brainstorm`, AI starts writing code directly

**Solution**:
- This might be because your question is too simple, and AI thinks "no design needed"
- Try a more complex task (e.g., "Refactor user authentication system, add two-factor authentication")
- Ensure you have the latest version: `/plugin update superpowers`

---

## Chapter Summary

In 5 minutes you completed:
1. ✅ Installed Superpowers plugin
2. ✅ Verified commands are correctly loaded
3. ✅ Experienced the first core feature (brainstorming)

**Key Takeaways**:
- Superpowers is not "smarter AI," it's "obedient AI"
- It ensures code quality through enforced workflows (design → plan → TDD → review)
- Skills trigger automatically, no manual selection needed

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Installation Guide](../installation/)**.
>
> You'll learn:
> - Complete installation steps for all three platforms
> - Manual configuration for OpenCode and Codex
> - Detailed troubleshooting methods
