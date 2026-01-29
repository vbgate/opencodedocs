---
title: "Remove Skills: Interactive and Scripted Methods | OpenSkills"
sidebarTitle: "Remove Skills"
subtitle: "Remove Skills: Interactive and Scripted Methods"
description: "Learn two skill removal methods in OpenSkills: interactive manage command for batch removal and scripted remove command for precise deletion."
tags:
  - "Skill Management"
  - "Command Usage"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
  - "platforms-list-skills"
order: 6
---

# Remove Skills

## What You'll Learn

- Use `openskills manage` to interactively remove multiple skills
- Use `openskills remove` to programmatically remove a specific skill
- Understand the use cases for both removal methods
- Confirm whether you're removing from project or global location
- Safely clean up skills you no longer need

## Your Current Challenges

As you install more skills, you may encounter these issues:

- "Some skills I don't use anymore. I want to delete a few, but deleting them one by one is too much trouble"
- "I want to automatically remove skills in scripts, but the manage command requires interactive selection"
- "I'm not sure if the skill is installed in project or global. I want to confirm before deleting"
- "When batch deleting skills, I'm afraid of accidentally deleting ones I'm still using"

OpenSkills provides two removal methods to solve these problems: **interactive manage** (suitable for manually selecting multiple skills) and **scripted remove** (suitable for precisely removing a single skill).

## When to Use This Approach

| Scenario | Recommended Method | Command |
|--- | --- | ---|
| Manually remove multiple skills | Interactive selection | `openskills manage` |
| Script or CI/CD automatic removal | Precisely specify skill name | `openskills remove <name>` |
| Only know the skill name, want quick removal | Direct removal | `openskills remove <name>` |
| Want to see which skills can be removed | List first, then remove | `openskills list` → `openskills manage` |

## Core Concept

OpenSkills' two removal methods are suitable for different scenarios:

### Interactive Removal: `openskills manage`

- **Feature**: Displays all installed skills, allowing you to check which ones to remove
- **Use case**: Manual skill library management, remove multiple skills at once
- **Advantage**: No accidental deletions, can see all options in advance
- **Default behavior**: **No skills selected by default** (to prevent accidental deletion)

### Scripted Removal: `openskills remove <name>`

- **Feature**: Directly removes the specified skill
- **Use case**: Scripts, automation, precise deletion
- **Advantage**: Fast, no interaction required
- **Risk**: Typos in skill name will cause errors, but won't accidentally delete other skills

### Deletion Principle

Both methods remove the **entire skill directory** (including SKILL.md, references/, scripts/, assets/, and all other files), leaving no residue.

::: tip Deletion Cannot Be Undone
Removing a skill deletes the entire skill directory and cannot be undone. It's recommended to confirm the skill is no longer needed before deletion, or simply reinstall it later.
:::

## Follow Along

### Step 1: Interactively Remove Multiple Skills

**Why**
When you have multiple skills to delete, interactive selection is safer and more intuitive

Run the following command:

```bash
npx openskills manage
```

**What You Should See**

First, you'll see a list of all installed skills (sorted by project/global):

```
? Select skills to remove:
❯◯ pdf                         (project)
  ◯ code-analyzer                (project)
  ◯ email-reader                 (global)
  ◯ git-tools                    (global)
```

- **Blue** `(project)`: Project-level skill
- **Gray** `(global)`: Global-level skill
- **Space**: Check/uncheck
- **Enter**: Confirm deletion

Assuming you checked `pdf` and `git-tools`, then pressed Enter:

**What You Should See**

```
✅ Removed: pdf (project)
✅ Removed: git-tools (global)

✅ Removed 2 skill(s)
```

::: info Nothing Selected by Default
The manage command defaults to **selecting no skills** to prevent accidental deletion. You need to manually use the Space key to check the skills you want to remove.
:::

### Step 2: Programmatically Remove a Single Skill

**Why**
When you know the skill name and want to delete it quickly

Run the following command:

```bash
npx openskills remove pdf
```

**What You Should See**

```
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)
```

If the skill doesn't exist:

```
Error: Skill 'pdf' not found
```

The program will exit and return error code 1 (suitable for script judgment).

### Step 3: Confirm Deletion Location

**Why**
Confirm the skill location (project vs global) before deletion to avoid accidental removal

When removing a skill, the command displays the deletion location:

```bash
# Scripted removal shows detailed location
npx openskills remove pdf
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)

# Interactive removal also shows each skill's location
npx openskills manage
# After checking and pressing Enter
✅ Removed: pdf (project)
✅ Removed: git-tools (global)
```

**Judgment rules**:
- If the path contains the current project directory → `(project)`
- If the path contains the home directory → `(global)`

### Step 4: Verify After Deletion

**Why**
Confirm deletion was successful to avoid omissions

After removing a skill, verify with the list command:

```bash
npx openskills list
```

**What You Should See**

Deleted skills no longer appear in the list.

## Checklist ✅

Confirm the following:

- [ ] Running `openskills manage` shows a list of all skills
- [ ] Can check/uncheck skills using the Space key
- [ ] No skills are selected by default (to prevent accidental deletion)
- [ ] Running `openskills remove <name>` removes the specified skill
- [ ] Deletion shows whether it's project or global location
- [ ] After deletion, use `openskills list` to verify the skill is gone

## Common Pitfalls

### Common Issue 1: Accidentally Deleted a Skill Still in Use

**Symptom**: After deletion, you realize the skill is still in use

**Solution**:

Simply reinstall it:

```bash
# If installed from GitHub
npx openskills install anthropics/skills

# If installed from a local path
npx openskills install ./path/to/skill
```

OpenSkills records the installation source (in the `.openskills.json` file), so reinstalling won't lose the original path information.

### Common Issue 2: manage Command Shows "No skills installed"

**Symptom**: Running `openskills manage` indicates no skills are installed

**Cause**: There are indeed no skills in the current directory

**Troubleshooting Steps**:

1. Check if you're in the correct project directory
2. Confirm if global skills were installed (`openskills list --global`)
3. Switch to the directory where skills were installed and try again

```bash
# Switch to project directory
cd /path/to/your/project

# Try again
npx openskills manage
```

### Common Issue 3: remove Command Errors "Skill not found"

**Symptom**: Running `openskills remove <name>` indicates the skill doesn't exist

**Cause**: Typo in skill name, or the skill has already been deleted

**Troubleshooting Steps**:

1. First, use the list command to check the correct skill name:

```bash
npx openskills list
```

2. Check skill name spelling (note case and hyphens)

3. Confirm whether the skill is project or global (search in different directories)

```bash
# View project skills
ls -la .claude/skills/

# View global skills
ls -la ~/.claude/skills/
```

### Common Issue 4: Skill Still in AGENTS.md After Deletion

**Symptom**: After deleting a skill, there's still a reference to it in AGENTS.md

**Cause**: Deleting a skill does not automatically update AGENTS.md

**Solution**:

Re-run the sync command:

```bash
npx openskills sync
```

sync will re-scan installed skills and update AGENTS.md, automatically removing deleted skills from the list.

## Lesson Summary

OpenSkills provides two skill removal methods:

### Interactive Removal: `openskills manage`

- 🎯 **Use case**: Manually manage skill library, remove multiple skills
- ✅ **Advantage**: Intuitive, no accidental deletions, can preview
- ⚠️ **Note**: No skills selected by default, need to manually check

### Scripted Removal: `openskills remove <name>`

- 🎯 **Use case**: Scripts, automation, precise deletion
- ✅ **Advantage**: Fast, no interaction required
- ⚠️ **Note**: Typos in skill name will cause errors

**Core points**:

1. Both methods delete the entire skill directory (cannot be undone)
2. Deletion shows whether it's project or global location
3. Use `openskills list` to verify after deletion
4. Remember to re-run `openskills sync` to update AGENTS.md

## Up Next

> In the next lesson, we'll learn **[Universal Mode: Multi-Agent Environment](../../advanced/universal-mode/)**.
>
> You will learn:
> - How to use the `--universal` flag to avoid conflicts with Claude Code
> - Unified skill management in multi-agent environments
> - The role of the `.agent/skills` directory

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function | File Path | Line Numbers |
|--- | --- | ---|
| manage command implementation | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 10-62 |
| remove command implementation | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 8-21 |
| Find all skills | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| Find specified skill | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 66-90 |

**Key Functions**:
- `manageSkills()`: Interactively remove skills, using inquirer checkbox for user selection
- `removeSkill(skillName)`: Programmatically remove a specified skill, exit with error if not found
- `findAllSkills()`: Traverse 4 search directories and collect all skills
- `findSkill(skillName)`: Find a specified skill, return a Skill object

**Key Constants**:
- None (all paths and configurations are dynamically calculated)

**Core Logic**:

1. **manage command** (src/commands/manage.ts):
   - Calls `findAllSkills()` to get all skills (line 11)
   - Sorts by project/global (lines 20-25)
   - Uses inquirer `checkbox` for user selection (lines 33-37)
   - Defaults to `checked: false`, no skills selected (line 30)
   - Iterates through selected skills and calls `rmSync` to delete (lines 45-52)

2. **remove command** (src/commands/remove.ts):
   - Calls `findSkill(skillName)` to find the skill (line 9)
   - If not found, outputs error and `process.exit(1)` (lines 12-14)
   - Calls `rmSync` to delete the entire skill directory (line 16)
   - Determines if it's project or global via `homedir()` (line 18)

3. **Deletion operation**:
   - Uses `rmSync(baseDir, { recursive: true, force: true })` to delete the entire skill directory
   - `recursive: true`: Recursively delete all subfiles and subdirectories
   - `force: true`: Ignore file not found errors

</details>
