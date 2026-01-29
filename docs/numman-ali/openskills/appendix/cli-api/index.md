---
title: "CLI API: Command Reference | OpenSkills"
sidebarTitle: "CLI API"
subtitle: "OpenSkills CLI API Reference"
description: "Learn OpenSkills CLI commands: install, list, read, sync, update, manage, remove. Master parameters, options, and usage examples for skill management."
tags:
  - "API"
  - "CLI"
  - "Command Reference"
  - "Options"
prerequisite: []
order: 1
---

# OpenSkills CLI API Reference

## What You'll Learn

- Understand complete usage of all OpenSkills commands
- Master parameters and options for each command
- Learn how to combine commands to complete tasks

## What Is This

The OpenSkills CLI API Reference provides complete documentation for all commands, including parameters, options, and usage examples. This is the reference manual you consult when you need to dive deep into a specific command.

---

## Overview

OpenSkills CLI provides the following commands:

```bash
openskills install <source>   # Install skills
openskills list                # List installed skills
openskills read <name>         # Read skill content
openskills sync                # Sync to AGENTS.md
openskills update [name...]    # Update skills
openskills manage              # Interactively manage skills
openskills remove <name>       # Remove skills
```

---

## install Command

Install skills from GitHub, local paths, or private git repositories.

### Syntax

```bash
openskills install <source> [options]
```

### Parameters

| Parameter | Type   | Required | Description                                    |
|--- | --- | --- | ---|
| `<source>` | string | Y        | Skill source (see source formats below)        |

### Options

| Option       | Short | Type  | Default | Description                                    |
|--- | --- | --- | --- | ---|
| `--global`   | `-g`  | flag  | false   | Install globally to `~/.claude/skills/`       |
| `--universal`| `-u`  | flag  | false   | Install to `.agent/skills/` (multi-agent env) |
| `--yes`      | `-y`  | flag  | false   | Skip interactive selection, install all skills |

### Source Formats

| Format           | Example                              | Description                      |
|--- | --- | ---|
| GitHub shorthand | `anthropics/skills`                  | Install from GitHub public repo  |
| Git URL          | `https://github.com/owner/repo.git` | Full Git URL                     |
| SSH Git URL      | `git@github.com:owner/repo.git`     | SSH private repo                 |
| Local path       | `./my-skill` or `~/dev/skills`      | Install from local directory     |

### Examples

```bash
# Install from GitHub (interactive selection)
openskills install anthropics/skills

# Install from GitHub (non-interactive)
openskills install anthropics/skills -y

# Global install
openskills install anthropics/skills --global

# Multi-agent environment install
openskills install anthropics/skills --universal

# Install from local path
openskills install ./my-custom-skill

# Install from private repo
openskills install git@github.com:your-org/private-skills.git
```

### Output

After successful installation, displays:
- List of installed skills
- Installation location (project/global)
- Prompt to run `openskills sync`

---

## list Command

List all installed skills.

### Syntax

```bash
openskills list
```

### Parameters

None.

### Options

None.

### Examples

```bash
openskills list
```

### Output

```
Installed Skills:

┌────────────────────┬────────────────────────────────────┬──────────┐
│ Skill Name         │ Description                         │ Location │
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit             │ project  │
│ git-workflow       │ Git workflow automation              │ global   │
│ skill-creator      │ Guide for creating effective skills  │ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

Total: 3 skills (2 project-level, 1 global)
```

### Skill Location Notes

- **project**: Installed in `.claude/skills/` or `.agent/skills/`
- **global**: Installed in `~/.claude/skills/` or `~/.agent/skills/`

---

## read Command

Read skill content to standard output (for AI agent use).

### Syntax

```bash
openskills read <skill-names...>
```

### Parameters

| Parameter          | Type   | Required | Description                                    |
|--- | --- | --- | ---|
| `<skill-names...>` | string | Y        | Skill names (comma-separated list supported)   |

### Options

None.

### Examples

```bash
# Read single skill
openskills read pdf

# Read multiple skills (comma-separated)
openskills read pdf,git-workflow

# Read multiple skills (space-separated)
openskills read pdf git-workflow
```

### Output

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### Usage

This command is primarily used by AI agents to load skill content. Users can also use it to view detailed skill descriptions.

---

## sync Command

Sync installed skills to AGENTS.md (or other file).

### Syntax

```bash
openskills sync [options]
```

### Parameters

None.

### Options

| Option            | Short | Type   | Default   | Description                                    |
|--- | --- | --- | --- | ---|
| `--output <path>` | `-o`  | string | `AGENTS.md` | Output file path                             |
| `--yes`           | `-y`  | flag   | false     | Skip interactive selection, sync all skills   |

### Examples

```bash
# Sync to default AGENTS.md (interactive)
openskills sync

# Sync to custom path
openskills sync -o .ruler/AGENTS.md

# Non-interactive sync (CI/CD)
openskills sync -y

# Non-interactive sync to custom path
openskills sync -y -o .ruler/AGENTS.md
```

### Output

After sync completes, generates the following content in the specified file:

```xml
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## update Command

Refresh installed skills from source.

### Syntax

```bash
openskills update [skill-names...]
```

### Parameters

| Parameter          | Type   | Required | Description                                    |
|--- | --- | --- | ---|
| `[skill-names...]` | string | N        | Skill names (comma-separated), defaults to all |

### Options

None.

### Examples

```bash
# Update all installed skills
openskills update

# Update specific skills
openskills update pdf,git-workflow

# Update single skill
openskills update pdf
```

### Output

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### Update Rules

- Only updates skills with metadata records
- Local path skills: Directly copy from source path
- Git repository skills: Re-clone and copy
- Skills without metadata: Skip and prompt to reinstall

---

## manage Command

Interactively manage (remove) installed skills.

### Syntax

```bash
openskills manage
```

### Parameters

None.

### Options

None.

### Examples

```bash
openskills manage
```

### Interactive Interface

```
Select skills to remove:

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

Actions: [↑/↓] Select [Space] Toggle [Enter] Confirm [Esc] Cancel
```

### Output

```
Removed 1 skill:
- skill-creator (project)
```

---

## remove Command

Remove specified installed skills (scripted approach).

### Syntax

```bash
openskills remove <skill-name>
```

### Alias

`rm`

### Parameters

| Parameter     | Type   | Required | Description   |
|--- | --- | --- | ---|
| `<skill-name>` | string | Y        | Skill name    |

### Options

None.

### Examples

```bash
# Remove skill
openskills remove pdf

# Use alias
openskills rm pdf
```

### Output

```
Removed skill: pdf (project)
Location: /path/to/.claude/skills/pdf
Source: anthropics/skills
```

---

## Global Options

The following options apply to all commands:

| Option     | Short | Type | Default | Description   |
|--- | --- | --- | --- | ---|
| `--version`| `-V`  | flag | -       | Show version  |
| `--help`   | `-h`  | flag | -       | Show help     |

### Examples

```bash
# Show version
openskills --version

# Show global help
openskills --help

# Show specific command help
openskills install --help
```

---

## Skill Lookup Priority

When multiple installation locations exist, skills are looked up in the following priority (highest to lowest):

1. `./.agent/skills/` - Project-level universal
2. `~/.agent/skills/` - Global-level universal
3. `./.claude/skills/` - Project-level
4. `~/.claude/skills/` - Global-level

**Important**: Only the first matching skill found (highest priority) is returned.

---

## Exit Codes

| Exit Code | Description                           |
|--- | ---|
| 0         | Success                               |
| 1         | Error (parameter error, command failed, etc.) |

---

## Environment Variables

Current version does not support environment variable configuration.

---

## Configuration Files

OpenSkills uses the following configuration files:

- **Skill Metadata**: `.claude/skills/<skill-name>/.openskills.json`
  - Records installation source, timestamp, etc.
  - Used by `update` command to refresh skills

### Metadata Example

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Up Next

> In the next lesson, we'll learn **[AGENTS.md Format Specification](../agents-md-format/)**.
>
> You will learn:
> - XML tag structure and tag meanings in AGENTS.md
> - Field definitions and usage constraints for skill lists
> - How OpenSkills generates and updates AGENTS.md
> - Marking methods (XML tags and HTML comment tags)

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Command     | File Path                                                                           | Line Numbers |
|--- | --- | ---|
| CLI entry   | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)         | 13-80        |
| install     | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562        |
| list        | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts)    | 1-50         |
| read        | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts)    | 1-50         |
| sync        | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)    | 1-101        |
| update      | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173        |
| manage      | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50         |
| remove      | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30         |
| Type definitions | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts)        | 1-25         |

**Key Constants**:
- No global constants

**Key Types**:
- `Skill`: Skill info interface (name, description, location, path)
- `SkillLocation`: Skill location interface (path, baseDir, source)
- `InstallOptions`: Install options interface (global, universal, yes)

**Key Functions**:
- `program.command()`: Define commands (commander.js)
- `program.option()`: Define options (commander.js)
- `program.action()`: Define command handler functions (commander.js)

</details>
