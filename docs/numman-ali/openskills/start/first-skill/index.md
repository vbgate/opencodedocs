---
title: "First Skill: Install Skills from GitHub | OpenSkills"
sidebarTitle: "First Skill"
subtitle: "Install Your First Skill"
description: "Learn to install skills from Anthropic official repository with interactive selection. Master the openskills install command and skill directory structure."
tags:
  - "Getting Started"
  - "Skill Installation"
prerequisite:
  - "start-installation"
order: 4
---

# Install Your First Skill

## What You'll Learn

After completing this lesson, you will be able to:

- Install skills from Anthropic official repository to your project
- Use interactive selection interface to choose the skills you need
- Understand where skills are installed (.claude/skills/ directory)
- Verify that skills are successfully installed

::: info Prerequisites

This tutorial assumes you have completed [OpenSkills installation](../installation/). If you haven't installed it yet, please complete the installation steps first.

:::

---

## Your Current Challenges

You may have just finished installing OpenSkills, but:

- **Don't know where to find skills**: There are many skill repositories on GitHub, and you don't know which one is official
- **Don't know how to install skills**: You know there's an `install` command, but you don't know how to use it
- **Worried about installing in the wrong place**: Afraid skills will be installed globally and become inaccessible when switching projects

These are common issues. Let's solve them step by step.

---

## When to Use This Approach

**Installing your first skill** is suitable for these scenarios:

- First time using OpenSkills and want to experience it quickly
- Need to use skills provided by Anthropic official repository (such as PDF processing, Git workflows, etc.)
- Want to use skills in the current project instead of installing them globally

::: tip Recommended Practice

For the first installation, it's recommended to start with the Anthropic official repository `anthropics/skills`, as these skills are high-quality and verified.

:::

---

## 🎒 Before You Start

Before beginning, please confirm:

- [ ] Completed [OpenSkills installation](../installation/)
- [ ] Navigated to your project directory
- [ ] Configured Git (for cloning GitHub repositories)

::: warning Prerequisites Check

If you don't have a project directory yet, you can create a temporary directory for practice:

```bash
mkdir my-project && cd my-project
```

:::

---

## Core Concept: Installing Skills from GitHub

OpenSkills supports installing skills from GitHub repositories. The installation process works like this:

```
[Specify repository] → [Clone to temp directory] → [Find SKILL.md] → [Interactive selection] → [Copy to .claude/skills/]
```

**Key points**:
- Use `owner/repo` format to specify GitHub repository
- The tool automatically clones the repository to a temporary directory
- Finds all subdirectories containing `SKILL.md`
- Selects skills to install through an interactive interface
- Skills are copied to the project's `.claude/skills/` directory

---

## Follow Along

### Step 1: Navigate to Your Project Directory

First, navigate to your development project directory:

```bash
cd /path/to/your/project
```

**Why**

OpenSkills installs skills to the project's `.claude/skills/` directory by default, so skills can be version-controlled with the project and shared among team members.

**What You Should See**:

Your project directory should contain one of the following:

- `.git/` (Git repository)
- `package.json` (Node.js project)
- Other project files

::: tip Recommended Practice

Even for a new project, it's recommended to initialize a Git repository first to better manage skill files.

:::

---

### Step 2: Install Skills

Use the following command to install skills from the Anthropic official skill repository:

```bash
npx openskills install anthropics/skills
```

**Why**

`anthropics/skills` is the official skill repository maintained by Anthropic, containing high-quality skill examples suitable for first-time experience.

**What You Should See**:

The command will launch an interactive selection interface:

```
Installing from: anthropics/skills
Location: project (.claude/skills)
Default install is project-local (./.claude/skills). Use --global for ~/.claude/skills.

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)    Comprehensive PDF manipulation toolkit for extracting text and tables...
  ◯ git-workflow (12 KB)   Git workflow: Best practices for commits, branches, and PRs...
  ◯ check-branch-first (8 KB)    Git workflow: Always check current branch before making changes...
  ◯ skill-creator (16 KB)   Guide for creating effective skills...

<Space> select  <a> select all  <i> invert selection  <Enter> confirm
```

**Operation Guide**:

```
┌─────────────────────────────────────────────────────────────┐
│  Operation Instructions                                     │
│                                                             │
│  Step 1        Step 2           Step 3                      │
│  Move cursor  →  Press Space   →  Press Enter               │
│                                                            │
│  ○ Unselected      ◉ Selected                                │
└─────────────────────────────────────────────────────────────┘

You should see:
- Cursor can move up and down
- Press spacebar to toggle selection (○ ↔ ◉)
- Press Enter to confirm installation
```

---

### Step 3: Select Skills

In the interactive interface, select the skills you want to install.

**Example**:

Suppose you want to install the PDF processing skill:

```
? Select skills to install:
❯ ◉ pdf (24 KB)    ← Select this one
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

Operations:
1. **Move cursor**: Use the up and down arrow keys to move to the `pdf` line
2. **Select skill**: Press **Spacebar**, ensuring there's a `◉` instead of `◯` in front
3. **Confirm installation**: Press **Enter** to start installation

**What You Should See**:

```
✅ Installed: pdf
   Location: /path/to/your/project/.claude/skills/pdf

Skills installed to: /path/to/your/project/.claude/skills/

Next steps:
  → Run openskills sync to generate AGENTS.md with your installed skills
  → Run openskills list to see all installed skills
```

::: tip Advanced Operations

If you want to install multiple skills at once:
- Press spacebar to select each needed skill (multiple `◉`)
- Press `<a>` to select all skills
- Press `<i>` to invert current selection

:::

---

### Step 4: Verify Installation

After installation is complete, verify that the skill has been successfully installed to the project directory.

**Check directory structure**:

```bash
ls -la .claude/skills/
```

**What You Should See**:

```
.claude/skills/
└── pdf/
    ├── SKILL.md
    ├── .openskills.json
    ├── references/
    │   ├── pdf-extraction.md
    │   └── table-extraction.md
    └── scripts/
        └── extract-pdf.js
```

**Key Files Explanation**:

| File | Purpose |
| ---- | ---- |
| `SKILL.md` | Main content and instructions for the skill |
| `.openskills.json` | Installation metadata (records source, used for updates) |
| `references/` | Reference documents and detailed explanations |
| `scripts/` | Executable scripts |

**View skill metadata**:

```bash
cat .claude/skills/pdf/.openskills.json
```

**What You Should See**:

```json
{
  "source": "anthropics/skills",
  "sourceType": "git",
  "repoUrl": "https://github.com/anthropics/skills",
  "subpath": "pdf",
  "installedAt": "2026-01-24T10:30:00.000Z"
}
```

This metadata file records the source information of the skill, which will be used when running `openskills update` later.

---

## Checklist ✅

After completing the above steps, please confirm:

- [ ] Command line displayed the interactive selection interface
- [ ] Successfully selected at least one skill (marked with `◉`)
- [ ] Installation succeeded, showing `✅ Installed:` message
- [ ] `.claude/skills/` directory has been created
- [ ] Skill directory contains `SKILL.md` file
- [ ] Skill directory contains `.openskills.json` metadata file

If all the above checks pass, congratulations! Your first skill has been successfully installed.

---

## Common Pitfalls

### Problem 1: Failed to clone repository

**Error Message**:

```
✗ Failed to clone repository
fatal: repository 'https://github.com/anthropics/skills' not found
```

**Cause**:
- Network connection issues
- Incorrect GitHub repository address

**Solution**:
1. Check network connection: `ping github.com`
2. Confirm repository address is correct (in `owner/repo` format)

---

### Problem 2: No interactive selection interface

**Symptom**:

Command installed all skills directly without showing a selection interface.

**Cause**:
- There's only one `SKILL.md` file in the repository (single-skill repository)
- Used `-y` or `--yes` flag (skips selection)

**Solution**:
- If it's a single-skill repository, this is normal behavior
- If you need selection, remove the `-y` flag

---

### Problem 3: Permission error

**Error Message**:

```
Error: EACCES: permission denied, mkdir '.claude/skills'
```

**Cause**:
- Current directory lacks write permission

**Solution**:
1. Check directory permissions: `ls -la`
2. Use `sudo` or switch to a directory with proper permissions

---

### Problem 4: SKILL.md not found

**Error Message**:

```
Error: No SKILL.md files found in repository
```

**Cause**:
- Repository doesn't contain properly formatted skill files

**Solution**:
1. Confirm if the repository is a skill repository
2. Check the directory structure of the repository

---

## Lesson Summary

In this lesson, you learned:

- **Use `openskills install anthropics/skills`** to install skills from the official repository
- **Select skills in interactive interface**, using spacebar to select and Enter to confirm
- **Skills are installed to `.claude/skills/`** directory, including `SKILL.md` and metadata
- **Verify successful installation** by checking directory structure and file contents

**Core Commands**:

| Command | Purpose |
| ---- | ---- |
| `npx openskills install anthropics/skills` | Install skills from official repository |
| `ls .claude/skills/` | View installed skills |
| `cat .claude/skills/<name>/.openskills.json` | View skill metadata |

---

## Up Next

> In the next lesson, we'll learn **[Using Skills](../read-skills/)**.
>
> You will learn:
> - Use `openskills read` command to read skill content
> - Understand how AI agents load skills into context
> - Master the 4-level priority order for skill lookup

Installing skills is just the first step. Next, you need to understand how AI agents use these skills.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function | File Path | Line Numbers |
| ---- | --------- | ---- |
| Install command entry point | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L183) | 83-183 |
| Installation location detection (project vs global) | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| GitHub shorthand parsing | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Repository cloning | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Recursive skill lookup | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L358-L373) | 358-373 |
| Interactive selection interface | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L427-L455) | 427-455 |
| Skill copying and installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L461-L486) | 461-486 |
| Official skills list (conflict warning) | [`src/utils/marketplace-skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/marketplace-skills.ts) | 1-25 |

**Key Functions**:
- `installFromRepo()` - Install skills from repository, supports interactive selection
- `installSpecificSkill()` - Install skill from specified subpath
- `installFromLocal()` - Install skills from local path
- `warnIfConflict()` - Check and warn about skill conflicts

**Key Constants**:
- `ANTHROPIC_MARKETPLACE_SKILLS` - List of Anthropic Marketplace skills, used for conflict warnings

</details>
