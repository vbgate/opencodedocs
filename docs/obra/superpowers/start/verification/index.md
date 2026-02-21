---
title: "Verify Superpowers Installation: Ensure Correct Loading | Superpowers Tutorial"
sidebarTitle: "Verify Installation Success"
subtitle: "Verify Installation: Ensure Superpowers Loads Correctly"
description: "Learn how to verify Superpowers installation on Claude Code, OpenCode, and Codex platforms. Check skill loading status and command availability."
tags:
  - "verification"
  - "installation"
  - "troubleshooting"
prerequisite:
  - "/obra/superpowers/start/installation/"
order: 40
---

# Verify Installation: Ensure Superpowers Loads Correctly

## What You'll Learn

- Verify Superpowers installation status across three platforms
- Check if skills and commands are loaded correctly
- Quickly diagnose installation issues

---

## Your Current Situation

After installing Superpowers, you might be wondering:

- Did the plugin actually install successfully?
- Why don't the commands appear?
- Are the skills really working?
- How do I verify on different platforms?

**Don't worry**—each platform has a different verification method, but they're all simple. This lesson teaches you how to confirm your installation status in minutes.

---

## When to Use This Approach

- ✅ Immediately after installation
- ✅ After updating Superpowers
- ✅ When installation failure is suspected
- ✅ Before starting a new project

---

## 🎒 Prerequisites

Ensure you have already:

- [ ] Completed the installation steps for your platform
- [ ] Restarted your AI coding tool (Claude Code / OpenCode / Codex)
- [ ] Basic terminal operation skills

---

## Core Concept

The core of Superpowers verification is **checking if skills and commands are available**:

| Platform | Verification Method | Check Content |
| --- | --- | --- |
| Claude Code | `/help` command | Check if three core commands appear |
| OpenCode | Symlink check | Confirm plugin and skill links are correct |
| Codex | CLI tool | View available skills list |

**Key point**: Different platforms use different verification methods, but the goal is the same—confirm the skill system is working properly.

---

## Follow Along

### Claude Code Platform Verification

#### Step 1: Check if Commands Appear

In Claude Code, enter:

```bash
/help
```

**Why**

The `/help` command lists all available slash commands, verifying whether Superpowers commands are loaded correctly.

**You should see** the following three core commands:

| Command | Function |
| --- | --- |
| `/superpowers:brainstorm` | Interactive design refinement |
| `/superpowers:write-plan` | Create implementation plan |
| `/superpowers:execute-plan` | Execute plan in batches |

✅ If you see these three commands, installation was successful!

---

#### Step 2: Test Core Command

Enter:

```bash
/superpowers:brainstorm
```

**Why**

Verify that the command not only exists but can trigger skills correctly.

**You should see**:

- AI doesn't start writing code directly
- AI asks about your needs or task
- AI enters the brainstorming workflow

✅ If AI starts asking questions, the skill system is working properly!

---

### OpenCode Platform Verification

#### Step 1: Check Symbolic Links

Open a terminal and run:

```bash
ls -l ~/.config/opencode/plugins/superpowers.js
ls -l ~/.config/opencode/skills/superpowers
```

**Why**

OpenCode loads plugins and skills through symbolic links, so we need to confirm the links point to the correct locations.

**You should see**:

```
~/.config/opencode/plugins/superpowers.js -> ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js
~/.config/opencode/skills/superpowers -> ~/.config/opencode/superpowers/skills
```

✅ If you see symbolic links (arrow `->`), links were created successfully!

---

#### Step 2: Restart and Verify

Restart OpenCode, then try using skills.

**Why**

OpenCode needs to load plugins at startup, so restarting is necessary.

**You should see**:

- No error messages when OpenCode starts
- Superpowers skills can be accessed using the `Skill` tool

---

### Codex Platform Verification

#### Step 1: Run CLI Tool

Open a terminal and run:

```bash
~/.codex/superpowers/.codex/superpowers-codex find-skills
```

**Why**

Codex's CLI tool lists all available skills, verifying whether skill files are loaded correctly.

**You should see**:

A list of skills, each containing a name and description, for example:

```
Available Superpowers Skills:

- brainstorming: Use when designing features - Activates before writing code...
- writing-plans: Use when implementing features with a spec - Breaks work into...
- test-driven-development: Use when implementing any feature - Enforces RED...
...

Total: X skills available
```

✅ If you see a skills list, installation was successful!

---

#### Step 2: Test Skill Loading

Tell Codex:

```
Run ~/.codex/superpowers/.codex/superpowers-codex bootstrap
```

**Why**

The bootstrap command loads complete skill context, verifying whether skill content is correct.

**You should see**:

- Codex loads complete skill information
- Displays skill count and status

---

## Checkpoint ✅

Based on your platform, confirm the corresponding checkpoints pass:

### Claude Code Users

- [ ] `/help` shows `/superpowers:brainstorm` and the other two commands
- [ ] `/superpowers:brainstorm` triggers correctly
- [ ] AI enters skill workflow, doesn't write code directly

### OpenCode Users

- [ ] `~/.config/opencode/plugins/superpowers.js` is a symbolic link
- [ ] `~/.config/opencode/skills/superpowers` is a symbolic link
- [ ] OpenCode starts without errors
- [ ] Superpowers skills can be accessed using the `Skill` tool

### Codex Users

- [ ] `find-skills` command displays a skills list
- [ ] `bootstrap` command loads complete context
- [ ] Skill count is correct (should be 14 core skills)

---

## Common Pitfalls

### Claude Code: Commands Don't Appear

**Symptom**: Superpowers commands not visible in `/help`

**Possible causes and solutions**:

1. **Plugin not installed correctly**
   - Re-run: `/plugin install superpowers@superpowers-marketplace`

2. **Restart required**
   - Fully quit Claude Code and reopen

3. **Marketplace not registered**
   - Check if marketplace was registered first: `/plugin marketplace add obra/superpowers-marketplace`

---

### OpenCode: Symbolic Links Don't Exist

**Symptom**: `ls -l` shows file or directory doesn't exist

**Possible causes and solutions**:

1. **Superpowers not cloned**
   - Check directory: `ls -l ~/.config/opencode/superpowers`
   - Re-run installation steps

2. **Link creation failed**
   - Ensure you have permission to create symbolic links (Windows requires Developer Mode or admin privileges)
   - Re-run link creation commands

3. **OpenCode not restarted**
   - Fully quit OpenCode and reopen

---

### Codex: CLI Tool Cannot Execute

**Symptom**: Permission error or command not found when running `superpowers-codex`

**Possible causes and solutions**:

1. **File permission issues**
   ```bash
   chmod +x ~/.codex/superpowers/.codex/superpowers-codex
   ```

2. **Node.js not installed**
   - Ensure Node.js 14 or higher is installed
   - Run: `node --version`

3. **Superpowers not cloned**
   - Check directory: `ls -l ~/.codex/superpowers`
   - Re-run installation steps

---

### Common Issue: Incorrect Skill Count

**Symptom**: Displayed skill count is less than 14

**Solutions**:

1. **Confirm using latest version**
   - Claude Code: `/plugin update superpowers`
   - OpenCode/Codex: `cd ~/.config/opencode/superpowers && git pull`

2. **Check skills directory**
   ```bash
   ls ~/.config/opencode/superpowers/skills
   ```
   You should see 14 skill directories

3. **Check for old version remnants**
   - If `~/.config/superpowers/skills` exists, it indicates an old version
   - Migrate or delete the old version

---

## Lesson Summary

Through this lesson, you've learned:

1. ✅ **Claude Code verification**: Use `/help` to check command availability
2. ✅ **OpenCode verification**: Check symbolic links and restart to verify
3. ✅ **Codex verification**: Use CLI tool to list skills
4. ✅ **Common issue troubleshooting**: Provided solutions for common issues on each platform

**Core principles**:
- Different platforms use different verification methods, but the goal is always to confirm the skill system works properly
- When encountering issues, check symbolic links, file permissions, and version updates first
- Restarting is a critical step for successful verification

---

## Coming Up Next

> In the next lesson, we'll learn **[Skill Invocation Rules and Priority](../using-skills/)**.
>
> You'll learn:
> - Core rules of the skill system (1% rule)
> - Skill priority and invocation flow
> - The difference between rigid skills and flexible skills

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-01

| Function | File Path | Line Numbers |
| --- | --- | --- |
| Command definition | [`commands/brainstorm.md`](https://github.com/obra/superpowers/blob/main/commands/brainstorm.md) | Entire file |
| Command definition | [`commands/write-plan.md`](https://github.com/obra/superpowers/blob/main/commands/write-plan.md) | Entire file |
| Command definition | [`commands/execute-plan.md`](https://github.com/obra/superpowers/blob/main/commands/execute-plan.md) | Entire file |
| SessionStart hook | [`hooks/session-start.sh`](https://github.com/obra/superpowers/blob/main/hooks/session-start.sh) | 1-53 |
| Codex CLI | [`.codex/superpowers-codex`](https://github.com/obra/superpowers/blob/main/.codex/superpowers-codex) | Entire file |
| OpenCode plugin | [`.opencode/plugins/superpowers.js`](https://github.com/obra/superpowers/blob/main/.opencode/plugins/superpowers.js) | Entire file |

**Key constants**:
- Plugin version: `4.1.1` (from `.claude-plugin/plugin.json:4`)

**Key functions**:
- `escape_for_json()`: JSON escaping function in SessionStart hook (`hooks/session-start.sh:21-37`)

</details>
