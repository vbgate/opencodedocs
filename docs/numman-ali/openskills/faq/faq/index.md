---
title: "FAQ: Common Questions & Solutions | OpenSkills"
sidebarTitle: "FAQ"
subtitle: "Frequently Asked Questions"
description: "Learn solutions to common OpenSkills problems. Troubleshoot installation failures, skills not loading, AGENTS.md sync, and Claude Code coexistence."
tags:
  - "FAQ"
  - "Troubleshooting"
  - "Common Questions"
prerequisite:
  - "start-quick-start"
order: 1
---

# Frequently Asked Questions

## What You'll Learn

This lesson answers common questions about using OpenSkills, helping you:

- ✅ Quickly locate and resolve installation failures
- ✅ Understand the relationship between OpenSkills and Claude Code
- ✅ Solve problems where skills don't appear in AGENTS.md
- ✅ Handle questions about skill updates and removal
- ✅ Correctly configure skills in multi-agent environments

## Your Current Challenges

When using OpenSkills, you may encounter:

- "Installation always fails, don't know what went wrong"
- "Can't see newly installed skills in AGENTS.md"
- "Don't know where skills are actually installed"
- "Want to use OpenSkills, but worried about conflicts with Claude Code"

This lesson helps you quickly find the root cause and solution to problems.

---

## Core Concept Questions

### What's the difference between OpenSkills and Claude Code?

**Short answer**: OpenSkills is a "universal installer", Claude Code is an "official agent".

**Detailed explanation**:

| Comparison      | OpenSkills                        | Claude Code                        |
|--- | --- | ---|
| **Positioning** | Universal skill loader            | Anthropic's official AI coding agent |
| **Support scope** | All AI agents (Cursor, Windsurf, Aider, etc.) | Claude Code only |
| **Skill format** | Fully compatible with Claude Code (`SKILL.md`) | Official specification |
| **Installation** | Install from GitHub, local paths, private repositories | Install from built-in Marketplace |
| **Skill storage** | `.claude/skills/` or `.agent/skills/` | `.claude/skills/` |
| **Invocation**   | `npx openskills read <name>`      | Built-in `Skill()` tool            |

**Core value**: OpenSkills enables other agents to use Anthropic's skill system without waiting for each agent to implement it individually.

### Why CLI instead of MCP?

**Core reason**: Skills are static files, MCP is dynamic tools—they solve different problems.

| Comparison Dimension | MCP (Model Context Protocol) | OpenSkills (CLI) |
|--- | --- | ---|
| **Use case**         | Dynamic tools, real-time API calls | Static instructions, documentation, scripts |
| **Runtime requirements** | Requires MCP server | No server needed (pure files) |
| **Agent support**    | MCP-supported agents only | All agents that can read `AGENTS.md` |
| **Complexity**       | Requires server deployment | Zero configuration |

**Key points**:

- **Skills are just files**: SKILL.md is static instructions + resources (references/, scripts/, assets/), no server needed
- **No agent support required**: Any agent that can execute shell commands can use it
- **Follows official design**: Anthropic's skill system is inherently a file system design, not MCP design

**Summary**: MCP and the skill system solve different problems. OpenSkills maintains the lightweight and universal nature of skills without requiring every agent to support MCP.

---

## Installation and Configuration Questions

### What to do if installation fails?

**Common errors and solutions**:

#### Error 1: Clone failed

```bash
Error: Git clone failed
```

**Possible causes**:
- Network issues (cannot access GitHub)
- Git not installed or version too old
- Private repository not configured with SSH keys

**Solutions**:

1. Check if Git is installed:
   ```bash
   git --version
   # Should show: git version 2.x.x
   ```

2. Check network connection:
   ```bash
   # Test if GitHub is accessible
   ping github.com
   ```

3. For private repositories, configure SSH:
   ```bash
   # Test SSH connection
   ssh -T git@github.com
   ```

#### Error 2: Path does not exist

```bash
Error: Path does not exist: ./nonexistent-path
```

**Solutions**:
- Confirm local path is correct
- Use absolute or relative paths:
  ```bash
  # Absolute path
  npx openskills install /Users/dev/my-skills

  # Relative path
  npx openskills install ./my-skills
  ```

#### Error 3: SKILL.md not found

```bash
Error: No valid SKILL.md found
```

**Solutions**:

1. Check skill directory structure:
   ```bash
   ls -la ./my-skill
   # Must contain SKILL.md
   ```

2. Confirm SKILL.md has valid YAML frontmatter:
   ```markdown
   ---
   name: my-skill
   description: Skill description
   ---

   # Skill content
   ```

### Which directory are skills installed to?

**Default installation location** (project-local):
```bash
.claude/skills/
```

**Global installation location** (using `--global`):
```bash
~/.claude/skills/
```

**Universal mode** (using `--universal`):
```bash
.agent/skills/
```

**Skill search priority** (highest to lowest):
1. `./.agent/skills/` (project-local, Universal)
2. `~/.agent/skills/` (global, Universal)
3. `./.claude/skills/` (project-local, default)
4. `~/.claude/skills/` (global, default)

**View installed skill locations**:
```bash
npx openskills list
# Output shows [project] or [global] tags
```

### How to coexist with Claude Code Marketplace?

**Problem**: Want to use both Claude Code and OpenSkills, how to avoid conflicts?

**Solution**: Use Universal mode

```bash
# Install to .agent/skills/ instead of .claude/skills/
npx openskills install anthropics/skills --universal
```

**Why it works**:

| Directory          | Used by          | Description |
|--- | --- | ---|
| `.claude/skills/`  | Claude Code      | Used by Claude Code Marketplace |
| `.agent/skills/`   | OpenSkills       | Used by other agents (Cursor, Windsurf) |

**Conflict warning**:

When installing from official repositories, OpenSkills will prompt:
```
⚠️  Warning: These skills are also available in Claude Code Marketplace.
   Installing to .claude/skills/ may cause conflicts.
   Use --universal to install to .agent/skills/ instead.
```

---

## Usage Questions

### Skills not appearing in AGENTS.md?

**Symptom**: After installing skills, they don't appear in AGENTS.md.

**Troubleshooting steps**:

#### 1. Confirm sync was performed

After installing skills, you need to run the `sync` command:

```bash
npx openskills install anthropics/skills
# Select skills...

# Must run sync!
npx openskills sync
```

#### 2. Check AGENTS.md location

```bash
# Default AGENTS.md is in project root
cat AGENTS.md
```

If using custom output path, confirm the path is correct:
```bash
npx openskills sync -o custom-path/AGENTS.md
```

#### 3. Check if skills were selected

The `sync` command is interactive—you need to confirm which skills you selected to sync:

```bash
npx openskills sync

? Select skills to sync:
  ◉ pdf                  [selected]
  ◯ check-branch-first   [not selected]
```

#### 4. View AGENTS.md content

Confirm XML tags are correct:

```xml
<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
```

### How to update skills?

**Update all skills**:
```bash
npx openskills update
```

**Update specific skills** (comma-separated):
```bash
npx openskills update pdf,git-workflow
```

**Common issues**:

#### Skills not updated

**Symptom**: After running `update`, prompts "skipped"

**Cause**: Skills were installed without recording source information (old version behavior)

**Solution**:
```bash
# Reinstall to record source
npx openskills install anthropics/skills
```

#### Local skills cannot be updated

**Symptom**: Skills installed from local paths throw errors during update

**Cause**: Local path skills need manual updates

**Solution**:
```bash
# Reinstall from local path
npx openskills install ./my-skill
```

### How to remove skills?

**Method 1: Interactive removal**

```bash
npx openskills manage
```

Select the skills to remove, press space to select, then press Enter to confirm.

**Method 2: Direct removal**

```bash
npx openskills remove <skill-name>
```

**After removal**: Remember to run `sync` to update AGENTS.md:
```bash
npx openskills sync
```

**Common issues**:

#### Accidentally removed skills

**Recovery method**:
```bash
# Reinstall from source
npx openskills install anthropics/skills
# Select the accidentally removed skill
```

#### Still shows in AGENTS.md after removal

**Solution**: Resync
```bash
npx openskills sync
```

---

## Advanced Questions

### How to share skills across multiple projects?

**Scenario**: Multiple projects need the same set of skills, don't want to repeatedly install.

**Solution 1: Global installation**

```bash
# Install globally once
npx openskills install anthropics/skills --global

# All projects can use it
cd project-a
npx openskills read pdf

cd project-b
npx openskills read pdf
```

**Advantages**:
- Install once, use everywhere
- Reduces disk usage

**Disadvantages**:
- Skills not in project, not included in version control

**Solution 2: Symbolic links**

```bash
# 1. Globally install skills
npx openskills install anthropics/skills --global

# 2. Create symbolic links in projects
cd project-a
ln -s ~/.claude/skills/pdf .claude/skills/pdf

# 3. sync will recognize as [project] location
npx openskills sync
```

**Advantages**:
- Skills are in project (`[project]` tag)
- Version control can include symbolic links
- Install once, use in multiple places

**Disadvantages**:
- Symbolic links require permissions on some systems

**Solution 3: Git Submodule**

```bash
# Add skill repository as submodule in project
cd project-a
git submodule add https://github.com/anthropics/skills.git .claude/skills-repo

# Install skills from submodule
npx openskills install .claude/skills-repo/pdf
```

**Advantages**:
- Full version control
- Can specify skill versions

**Disadvantages**:
- More complex configuration

### Symbolic links not accessible?

**Symptom**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Solutions by system**:

#### macOS

1. Open "System Preferences"
2. Go to "Security & Privacy"
3. In "Full Disk Access", allow your terminal application

#### Windows

Windows doesn't natively support symbolic links. Recommended:
- **Use Git Bash**: Built-in symlink support
- **Use WSL**: Linux subsystem supports symbolic links
- **Enable Developer Mode**: Settings → Update & Security → Developer mode

```bash
# Create symbolic link in Git Bash
ln -s /c/dev/my-skills/my-skill .claude/skills/my-skill
```

#### Linux

Check filesystem permissions:

```bash
# Check directory permissions
ls -la .claude/

# Add write permission
chmod +w .claude/
```

### Skills not found?

**Symptom**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Troubleshooting steps**:

#### 1. Confirm skill is installed

```bash
npx openskills list
```

#### 2. Check skill name case

```bash
# ❌ Wrong (uppercase)
npx openskills read My-Skill

# ✅ Correct (lowercase)
npx openskills read my-skill
```

#### 3. Check if skill is shadowed by higher priority skill

```bash
# View all skill locations
ls -la .claude/skills/my-skill
ls -la ~/.claude/skills/my-skill
ls -la .agent/skills/my-skill
ls -la ~/.agent/skills/my-skill
```

**Skill lookup rule**: The highest priority location shadows skills with the same name in other locations.

---

## Lesson Summary

Core points from OpenSkills FAQ:

### Core Concepts

- ✅ OpenSkills is a universal installer, Claude Code is an official agent
- ✅ CLI is more suitable for skill systems than MCP (static files)

### Installation Configuration

- ✅ Skills install to `.claude/skills/` by default
- ✅ Use `--universal` to avoid conflicts with Claude Code
- ✅ Installation failures are usually network, Git, or path issues

### Usage Tips

- ✅ Must run `sync` after installation for skills to appear in AGENTS.md
- ✅ `update` command only updates skills with source information
- ✅ Remember to `sync` after removing skills

### Advanced Scenarios

- ✅ Sharing skills across projects: global installation, symbolic links, Git Submodule
- ✅ Symlink issues: configure permissions by system
- ✅ Skills not found: check name, view priority

## Up Next

> In the next lesson, we'll learn **[Troubleshooting](../troubleshooting/)**.
>
> You will learn:
> - Quick diagnosis and resolution of common errors
> - Handling path errors, clone failures, invalid SKILL.md, and other issues
> - Troubleshooting techniques for permission issues and symlink failures

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function      | File Path                                                                                                   | Line Numbers |
|--- | --- | ---|
| Install command | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts)     | 1-424        |
| Sync command   | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)             | 1-99         |
| Update command | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts)       | 1-113        |
| Remove command | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts)       | 1-30         |
| Skill lookup  | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts)             | 1-50         |
| Directory priority | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts)               | 14-25        |
| AGENTS.md generation | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts)  | 23-93        |

**Key Functions**:
- `findAllSkills()`: Find all skills (sorted by priority)
- `findSkill(name)`: Find specific skill
- `generateSkillsXml()`: Generate AGENTS.md XML format
- `updateSkillFromDir()`: Update skill from directory

</details>
