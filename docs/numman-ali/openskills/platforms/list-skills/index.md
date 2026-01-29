---
title: "list Command: View Installed Skills | OpenSkills"
sidebarTitle: "List Skills"
subtitle: "list Command: View Installed Skills"
description: "Learn to use the OpenSkills list command to view installed skills. Understand project and global location tags, deduplication rules, and troubleshooting."
tags:
  - "Skill Management"
  - "Command Usage"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 4
---

# List Installed Skills

## What You'll Learn

After completing this lesson, you will be able to:

- Use `openskills list` to view all installed skills
- Understand the difference between `(project)` and `(global)` location tags
- Quickly count the number of project skills and global skills
- Verify if a skill is successfully installed

## Your Current Challenges

After installing several skills, you may encounter these issues:

- "Which skills did I just install? I forgot."
- "Did I install this skill to project or global?"
- "Why can I see certain skills in project A but not in project B?"
- "I want to delete some unused skills, but I don't know their specific names"

The `openskills list` command is designed to solve these confusions—it's like a "directory" for skills, helping you see all installed skills and their locations at a glance.

## When to Use This Approach

| Scenario | Action |
|--- | ---|
| Confirm successful installation after installing a skill | Run `openskills list` to check if the skill appears |
| Switch to a new project and check available skills | Run `openskills list` to see which project skills are available |
| Take inventory before cleaning up skills | Run `openskills list` to list all skills, then delete unneeded ones |
| Debug skill loading issues | Verify that skill names and installation locations are correct |

## Core Concept

OpenSkills supports installing skills in **4 locations** (in search priority order):

1. **project .agent/skills** - Project-level general skills directory (multi-agent environment)
2. **global .agent/skills** - Global general skills directory (multi-agent environment)
3. **project .claude/skills** - Project-level Claude Code skills directory
4. **global .claude/skills** - Global Claude Code skills directory

`openskills list` will:

1. Traverse these 4 directories to find all skills
2. **Deduplicate**: Display the same skill name only once (preferably showing project's)
3. **Sort**: Project skills come first, global skills come last; within the same location, sort alphabetically
4. **Mark locations**: Use `(project)` and `(global)` tags to distinguish
5. **Summary statistics**: Display count of project skills, global skills, and total count

::: info Why is deduplication needed?
If you install the same skill (e.g., `pdf`) in both project and global, OpenSkills will preferentially use the project version. The list command only displays it once to avoid confusion.
:::
## Follow Along

### Step 1: List All Installed Skills

**Why**
Quickly view which skills are available in the current environment

Run the following command:

```bash
npx openskills list
```

**What You Should See**

If no skills are installed, it will display:

```
Available Skills:

No skills installed.

Install skills:
  npx openskills install anthropics/skills         # Project (default)
  npx openskills install owner/skill --global     # Global (advanced)
```

If skills are already installed, you'll see something like:

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text and tables...

  code-analyzer                (project)
    Static code analysis tool for identifying security vulnerabilities...

  email-reader                 (global)
    Read email content and attachments via IMAP protocol...

Summary: 2 project, 1 global (3 total)
```

### Step 2: Understand Output Format

**Why**
Understanding what each line represents helps you quickly locate the information you need

Output format explanation:

| Part | Description |
|--- | ---|
| `pdf` | Skill name (extracted from the `name` field in SKILL.md) |
| `(project)` | Location tag: blue indicates project-level skill, gray indicates global skill |
| `Comprehensive PDF...` | Skill description (extracted from the `description` field in SKILL.md) |
| `Summary: 2 project, 1 global (3 total)` | Summary statistics: count of project skills, global skills, and total |

### Step 3: Verify Location Tags

**Why**
Confirm that skills are installed in the expected location, avoiding confusion about "why can't I see this skill in this project"

Try the following operations to understand location tags:

```bash
# 1. Install a project-level skill
npx openskills install anthropics/skills -y

# 2. View the list (should show project tag)
npx openskills list

# 3. Install a global skill
npx openskills install anthropics/skills --global -y

# 4. View the list again (two pdf skills, only displayed once, tag is project)
npx openskills list
```

**What You Should See**

```
Available Skills:

  pdf                         (project)
    Comprehensive PDF manipulation toolkit for extracting text...

Summary: 1 project, 0 global (1 total)
```

Even if the same skill is installed in both global and project, the list command will only display it once because the project version has higher priority.
## Checklist ✅

Confirm the following:

- [ ] Running `openskills list` displays the list of installed skills
- [ ] Can distinguish between `(project)` and `(global)` tags (different colors: blue vs gray)
- [ ] Summary statistics are correct (project skills + global skills = total)
- [ ] Understand the rule that the same skill name is only displayed once

## Common Pitfalls

### Common Issue 1: Cannot Find Just-Installed Skill

**Symptom**: The `install` command succeeded, but `list` doesn't show it

**Troubleshooting Steps**:

1. Check if you're in the correct project directory (project skills are only visible to the current project)
2. Confirm if it was installed globally (using the `--global` flag)
3. Verify the installation location:

```bash
# Check project directory
ls -la .claude/skills/

# Check global directory
ls -la ~/.claude/skills/
```

### Common Issue 2: See Strange Skill Names

**Symptom**: The skill name is not what you expected (e.g., folder name vs name in SKILL.md)

**Cause**: OpenSkills uses the `name` field in SKILL.md as the skill name, not the folder name

**Solution**: Check the frontmatter in SKILL.md:

```yaml
---
name: pdf  # This is the name displayed by the list command
description: Comprehensive PDF manipulation toolkit...
---
```

### Common Issue 3: Description Not Fully Displayed

**Symptom**: The skill description is truncated

**Cause**: This is due to terminal width limitations and doesn't affect the skill content

**Solution**: View the SKILL.md file directly to get the complete description
## Lesson Summary

The `openskills list` command is the "directory" command for skill management, helping you:

- 📋 **View all skills**: See installed skills at a glance
- 🏷️ **Distinguish location tags**: `(project)` indicates project-level, `(global)` indicates global-level
- 📊 **Summary statistics**: Quickly understand the count of project and global skills
- 🔍 **Troubleshoot issues**: Verify if skills are successfully installed and locate skill positions

Core rules:

1. Same skill name is only displayed once (project takes precedence)
2. Project skills come first, global skills come last
3. Within the same location, sorted alphabetically

## Up Next

> In the next lesson, we'll learn **[Updating Skills](../update-skills/)**.
>
> You will learn:
> - How to refresh installed skills from source repository
> - Batch update all skills
> - Handle old skills without metadata
---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function | File Path | Line Numbers |
|--- | --- | ---|
| list command implementation | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 7-43 |
| Find all skills | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Search directory configuration | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 18-25 |
| Skill type definition | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-6 |

**Key Functions**:
- `listSkills()`: List all installed skills with formatted output
- `findAllSkills()`: Traverse 4 search directories and collect all skills
- `getSearchDirs()`: Return 4 search directory paths (in priority order)

**Key Constants**:
- None (search directory paths are dynamically calculated)

**Core Logic**:
1. **Deduplication mechanism**: Use `Set` to track processed skill names (skills.ts:32-33, 43, 57)
2. **Location determination**: Determine if it's a project directory via `dir.includes(process.cwd())` (skills.ts:48)
3. **Sorting rules**: Project first, same location in alphabetical order (list.ts:21-26)

</details>
