---
title: "Update Skills: Sync with Source Repository | OpenSkills"
sidebarTitle: "Update Skills"
subtitle: "Update Skills: Keep Skills Synced with Source Repository"
description: "Learn OpenSkills update command to refresh skills. Support batch update, specific skill update, local and git repository updates, and troubleshoot failures."
tags:
  - "skills"
  - "update"
  - "git"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 5
---

# Update Skills: Keep Skills Synced with Source Repository

## What You'll Learn

This lesson teaches you how to keep OpenSkills skills always at the latest version. Using the OpenSkills update command, you will be able to:

- Update all installed skills with one command
- Update only specific skills
- Understand update differences for different installation sources
- Troubleshoot update failures

## Your Current Challenges

Skill repositories are constantly updating—authors may fix bugs, add new features, or improve documentation. But your installed skills are still at the old version.

You may have encountered these situations:
- The skill documentation says "supports feature X", but your AI agent says it doesn't know
- The skill has better error messages, but you still see the old ones
- A bug fixed after installation still affects you

**Deleting and reinstalling every time is too cumbersome**—you need an efficient way to update.

## When to Use This Command

Typical scenarios for using the `update` command:

| Scenario | Action |
| ---- | ---- |
| Discover skill has updates | Run `openskills update` |
| Update only a few skills | `openskills update skill1,skill2` |
| Test locally developed skills | Update from local path |
| Update from GitHub repository | Automatically git clone latest code |

::: tip Update Frequency Recommendations
- **Community skills**: Update once a month to get latest improvements
- **Self-developed skills**: Manually update after each modification
- **Local path skills**: Update after each code change
:::

## 🎒 Before You Start

Before beginning, confirm you have completed:

- [x] Installed OpenSkills (see [Install OpenSkills](../../start/installation/))
- [x] Installed at least one skill (see [Install Your First Skill](../../start/first-skill/))
- [x] Have network connection if installed from GitHub

## Core Concept

OpenSkills update mechanism is simple:

**Record source information during installation → Re-copy from original source during update**

::: info Why Re-installation Is Needed
Older versions of skills (installed without source information) cannot be updated. In this case, you need to reinstall once. OpenSkills will remember the source, and after that, automatic updates are possible.
:::

**Update methods for three installation sources**:

| Source Type | Update Method | Use Case |
| -------- | -------- | -------- |
| **Local path** | Copy directly from local path | Develop your own skills |
| **git repository** | Clone latest code to temp directory | Install from GitHub/GitLab |
| **GitHub shorthand** | Convert to full URL then clone | Install from GitHub official repository |

During update, skills without source metadata will be skipped, and names of skills that need reinstallation will be listed.

## Follow Along

### Step 1: List Installed Skills

First confirm which skills are available for update:

```bash
npx openskills list
```

**What You Should See**: A list of installed skills, including name, description, and installation location label (project/global)

### Step 2: Update All Skills

The simplest way is to update all installed skills:

```bash
npx openskills update
```

**What You Should See**: Skills updated one by one, each showing update result

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Skipped: my-old-skill (no source metadata; re-install once to enable updates)
Summary: 2 updated, 1 skipped (3 total)
```

::: details Meaning of Skipped Skills
If you see `Skipped: xxx (no source metadata)`, it means this skill was installed before the update feature was added. You need to reinstall it once to enable automatic updates.
:::

### Step 3: Update Specific Skills

If you only want to update specific skills, pass skill names (comma-separated):

```bash
npx openskills update git-workflow,check-branch-first
```

**What You Should See**: Only the two specified skills are updated

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Summary: 2 updated, 0 skipped (2 total)
```

### Step 4: Update Locally Developed Skills

If you're developing skills locally, you can update from the local path:

```bash
npx openskills update my-skill
```

**What You Should See**: The skill is re-copied from the local path where you installed it

```
✅ Updated: my-skill
Summary: 1 updated, 0 skipped (1 total)
```

::: tip Local Development Workflow
Development process:
1. Install skill: `openskills install ./my-skill`
2. Modify code
3. Update skill: `openskills update my-skill`
4. Sync to AGENTS.md: `openskills sync`
:::

### Step 5: Handle Update Failures

If some skills fail to update, OpenSkills will display detailed reasons:

```bash
npx openskills update
```

**Possible situations you might see**:

```
Skipped: git-workflow (git clone failed)
Skipped: my-skill (local source missing)
Missing source metadata (1): old-skill
Clone failed (1): git-workflow
```

**Corresponding solutions**:

| Error Message | Cause | Solution |
| -------- | ---- | -------- |
| `no source metadata` | Old version installation | Reinstall: `openskills install <source>` |
| `local source missing` | Local path deleted | Restore local path or reinstall |
| `SKILL.md missing at local source` | Local files deleted | Restore SKILL.md file |
| `git clone failed` | Network issue or repository doesn't exist | Check network or repository URL |
| `SKILL.md not found in repo` | Repository structure changed | Contact skill author or update subpath |

## Checklist ✅

Confirm you have learned:

- [ ] Can use `openskills update` to update all skills
- [ ] Can use comma-separated names to update specific skills
- [ ] Understand meaning of "skipped" skills and solutions
- [ ] Know the update workflow for locally developed skills

## Common Pitfalls

### ❌ Common Mistakes

| Mistake | Correct Approach |
| ---- | -------- |
| Ignore skipped skills | Reinstall or fix issues based on prompts |
| Delete and reinstall every time | Using `update` command is more efficient |
| Don't know where skill was installed from | Use `openskills list` to check source |

### ⚠️ Important Notes

**Update Overwrites Local Modifications**

If you directly modified skill files in the installation directory, these modifications will be overwritten during update. The correct approach is:
1. Modify **source files** (local path or repository)
2. Then run `openskills update`

**Symlink Skills Need Special Handling**

If skills are installed via symbolic links (see [Symlink Support](../../advanced/symlink-support/)), updates will recreate the links without breaking the symlink relationship.

**Global and Project Skills Need Separate Updates**

```bash
# Only update project skills (default)
openskills update

# Global skills need separate handling
# Or use --universal mode for unified management
```

## Lesson Summary

In this lesson, you learned OpenSkills update functionality:

- **Batch update**: `openskills update` updates all skills with one command
- **Specific update**: `openskills update skill1,skill2` updates specific skills
- **Source awareness**: Automatically recognizes local paths and git repositories
- **Error messages**: Detailed explanations of skip reasons and solutions

The update feature keeps skills at the latest version, ensuring the skills you use always contain the latest improvements and fixes.

## Up Next

> In the next lesson, we'll learn **[Remove Skills](../remove-skills/)**.
>
> You will learn:
> - How to use the interactive `manage` command to remove skills
> - How to use the `remove` command for scripted removal
> - Considerations after removing skills

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function | File Path | Line Numbers |
| ---- | --------- | ---- |
| Update skills main logic | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L14-L150) | 14-150 |
| Local path update | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L64-L82) | 64-82 |
| Git repository update | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L85-L125) | 85-125 |
| Copy skill from directory | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L152-L163) | 152-163 |
| Path safety validation | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L165-L172) | 165-172 |
| Metadata structure definition | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L8-L15) | 8-15 |
| Read skill metadata | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L17-L27) | 17-27 |
| Write skill metadata | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L29-L36) | 29-36 |
| CLI command definition | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L58-L62) | 58-62 |

**Key Constants**:
- `SKILL_METADATA_FILE = '.openskills.json'`: Metadata file name, records skill installation source

**Key Functions**:
- `updateSkills(skillNames)`: Main function to update specified or all skills
- `updateSkillFromDir(targetPath, sourceDir)`: Copy skill from source directory to target directory
- `isPathInside(targetPath, targetDir)`: Validate installation path safety (prevent path traversal)
- `readSkillMetadata(skillDir)`: Read skill metadata
- `writeSkillMetadata(skillDir, metadata)`: Write/update skill metadata

**Business Rules**:
- **BR-5-1**: Default update all installed skills (update.ts:37-38)
- **BR-5-2**: Support comma-separated skill name list (update.ts:15)
- **BR-5-3**: Skip skills without source metadata (update.ts:56-62)
- **BR-5-4**: Support local path updates (update.ts:64-82)
- **BR-5-5**: Support updates from git repositories (update.ts:85-125)
- **BR-5-6**: Validate path safety (update.ts:156-162)

</details>
