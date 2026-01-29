---
title: "CLI Commands: Complete Reference Guide | OpenSkills"
sidebarTitle: "CLI Commands"
subtitle: "Command Reference: OpenSkills Complete Command Cheat Sheet"
description: "Learn all OpenSkills CLI commands including install, list, read, update, sync, manage, and remove. Master parameters, flags, and common usage patterns."
tags:
  - "CLI"
  - "Command Reference"
  - "Cheat Sheet"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 1
---
# Command Reference: OpenSkills Complete Command Cheat Sheet

## What You'll Learn

- Master all 7 OpenSkills commands
- Understand global options and their use cases
- Quickly find command parameters and flag meanings
- Use non-interactive commands in scripts

## Command Overview

OpenSkills provides the following 7 commands:

| Command | Purpose | Use Cases |
|--- | --- | ---|
| `install` | Install skills | Install new skills from GitHub, local path, or private repository |
| `list` | List skills | View all installed skills and their locations |
| `read` | Read skills | Load skill content for AI agents (usually called automatically by agents) |
| `update` | Update skills | Refresh installed skills from source repository |
| `sync` | Sync | Write skill list to AGENTS.md |
| `manage` | Manage | Interactively delete skills |
| `remove` | Delete | Delete specific skills (scriptable way) |

::: info Tip
Use `npx openskills --help` to view a brief description of all commands.
:::

## Global Options

Certain commands support the following global options:

| Option | Short | Purpose | Applicable Commands |
|--- | --- | --- | ---|
| `--global` | `-g` | Install to global directory `~/.claude/skills/` | `install` |
| `--universal` | `-u` | Install to universal directory `.agent/skills/` (multi-agent environment) | `install` |
| `--yes` | `-y` | Skip interactive prompts, use default behavior | `install`, `sync` |
| `--output <path>` | `-o <path>` | Specify output file path | `sync` |

## Command Details

### install - Install Skills

Install skills from GitHub repository, local path, or private git repository.

```bash
openskills install <source> [options]
```

**Parameters**:

| Parameter | Required | Description |
|--- | --- | ---|
| `<source>` | ✅ | Skill source (GitHub shorthand, git URL, or local path) |

**Options**:

| Option | Short | Default | Description |
|--- | --- | --- | ---|
| `--global` | `-g` | `false` | Install to global directory `~/.claude/skills/` |
| `--universal` | `-u` | `false` | Install to universal directory `.agent/skills/` |
| `--yes` | `-y` | `false` | Skip interactive selection, install all found skills |

**source parameter examples**:

```bash
# GitHub shorthand (recommended)
openskills install anthropics/skills

# Specify branch
openskills install owner/repo@branch

# Private repository
openskills install git@github.com:owner/repo.git

# Local path
openskills install ./path/to/skill

# Git URL
openskills install https://github.com/owner/repo.git
```

**Behavior**:

- Lists all found skills for selection during installation
- Use `--yes` to skip selection and install all skills
- Installation location priority: `--universal` → `--global` → default project directory
- Creates `.openskills.json` metadata file in skill directory after installation

---

### list - List Skills

List all installed skills.

```bash
openskills list
```

**Options**: None

**Output format**:

```
Available Skills:

skill-name           [description]            (project/global)
```

**Behavior**:

- Sorted by location: project skills first, global skills after
- Within the same location, sorted alphabetically
- Displays skill name, description, and location label

---

### read - Read Skills

Read one or more skills' contents to standard output. This command is primarily used for AI agents to load skills on demand.

```bash
openskills read <skill-names...>
```

**Parameters**:

| Parameter | Required | Description |
|--- | --- | ---|
| `<skill-names...>` | ✅ | List of skill names (supports multiple, separated by space or comma) |

**Options**: None

**Examples**:

```bash
# Read single skill
openskills read pdf

# Read multiple skills
openskills read pdf git

# Comma-separated (also supported)
openskills read "pdf,git,excel"
```

**Output format**:

```
Skill: pdf
Base Directory: /path/to/.claude/skills/pdf

---SKILL.md contents---

[SKILL.END]
```

**Behavior**:

- Searches for skills across 4 directory priority levels
- Outputs skill name, base directory path, and complete SKILL.md content
- Displays error message for skills not found

---

### update - Update Skills

Refresh installed skills from recorded sources. If no skill name is specified, updates all installed skills.

```bash
openskills update [skill-names...]
```

**Parameters**:

| Parameter | Required | Description |
|--- | --- | ---|
| `[skill-names...]` | ❌ | List of skill names to update (defaults to all) |

**Options**: None

**Examples**:

```bash
# Update all skills
openskills update

# Update specific skills
openskills update pdf git

# Comma-separated (also supported)
openskills update "pdf,git,excel"
```

**Behavior**:

- Only updates skills with metadata (i.e., skills installed via install command)
- Skips skills without metadata and prompts
- Updates installation timestamp after successful update
- Uses shallow clone (`--depth 1`) when updating from git repository

---

### sync - Sync to AGENTS.md

Synchronize installed skills to AGENTS.md (or other custom file), generating a skill list available to AI agents.

```bash
openskills sync [options]
```

**Options**:

| Option | Short | Default | Description |
|--- | --- | --- | ---|
| `--output <path>` | `-o <path>` | `AGENTS.md` | Output file path |
| `--yes` | `-y` | `false` | Skip interactive selection, sync all skills |

**Examples**:

```bash
# Sync to default file
openskills sync

# Sync to custom file
openskills sync -o .ruler/AGENTS.md

# Skip interactive selection
openskills sync -y
```

**Behavior**:

- Parses existing file and pre-selects enabled skills
- Project skills are selected by default on first sync
- Generates Claude Code compatible XML format
- Supports replacing or appending skill section in existing file

---

### manage - Manage Skills

Interactively delete installed skills. Provides a friendly deletion interface.

```bash
openskills manage
```

**Options**: None

**Behavior**:

- Displays all installed skills for selection
- No skills are selected by default
- Deletes immediately after selection, no secondary confirmation needed

---

### remove - Delete Skills

Delete specified installed skills (scriptable way). More convenient than `manage` when used in scripts.

```bash
openskills remove <skill-name>
```

**Parameters**:

| Parameter | Required | Description |
|--- | --- | ---|
| `<skill-name>` | ✅ | Name of skill to delete |

**Options**: None

**Examples**:

```bash
openskills remove pdf

# You can also use alias
openskills rm pdf
```

**Behavior**:

- Deletes entire skill directory (including all files and subdirectories)
- Displays deletion location and source
- Displays error and exits if skill not found

## Quick Reference Cheat Sheet

| Task | Command |
|--- | ---|
| View all installed skills | `openskills list` |
| Install official skills | `openskills install anthropics/skills` |
| Install from local path | `openskills install ./my-skill` |
| Install skill globally | `openskills install owner/skill --global` |
| Update all skills | `openskills update` |
| Update specific skills | `openskills update pdf git` |
| Interactively delete skills | `openskills manage` |
| Delete specific skill | `openskills remove pdf` |
| Sync to AGENTS.md | `openskills sync` |
| Custom output path | `openskills sync -o custom.md` |

## Common Pitfalls

### 1. Command Not Found

**Issue**: "command not found" when executing command

**Causes**:
- Node.js not installed or version too low (requires 20.6+)
- Not using `npx` or not globally installed

**Solution**:
```bash
# Use npx (recommended)
npx openskills list

# Or global install
npm install -g openskills
```

### 2. Skill Not Found

**Issue**: `openskills read skill-name` shows "Skill not found"

**Causes**:
- Skill not installed
- Skill name misspelled
- Skill installation location not in search path

**Solution**:
```bash
# Check installed skills
openskills list

# View skill directory
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

### 3. Update Failed

**Issue**: `openskills update` shows "No metadata found"

**Causes**:
- Skill not installed via `install` command
- Metadata file `.openskills.json` was deleted

**Solution**: Reinstall skill
```bash
openskills install <original-source>
```

## Summary

OpenSkills provides a complete command-line interface covering skill installation, listing, reading, updating, synchronizing, and management. Mastering these commands is the foundation for efficient OpenSkills usage:

- `install` - Install new skills (supports GitHub, local, private repository)
- `list` - View installed skills
- `read` - Read skill content (used by AI agents)
- `update` - Update installed skills
- `sync` - Sync to AGENTS.md
- `manage` - Interactively delete skills
- `remove` - Delete specific skills

Remember global option purposes:
- `--global` / `--universal` - Control installation location
- `--yes` - Skip interactive prompts (suitable for CI/CD)
- `--output` - Custom output file path

## Coming Up Next

> Next, we'll learn **[Installation Sources Explained](../install-sources/)**.
>
> You will learn:
> - Detailed usage of three installation methods
> - Use cases for each method
> - Configuration for private repositories
