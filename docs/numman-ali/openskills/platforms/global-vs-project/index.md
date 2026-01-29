---
title: "Global vs Project: Installation Locations | OpenSkills"
sidebarTitle: "Global vs Project"
subtitle: "Global vs Project Installation"
description: "Learn the differences between global and project-local OpenSkills installation. Master the --global flag usage and understand skill search priority rules."
tags:
  - "Platform Integration"
  - "Skill Management"
  - "Configuration Tips"
prerequisite:
  - "start-first-skill"
  - "platforms-install-sources"
order: 3
---

# Global vs Project Installation

## What You'll Learn

- Understand the differences between two OpenSkills installation locations (global vs project-local)
- Choose the appropriate installation location based on your scenario
- Master the usage of the `--global` flag
- Understand skill search priority rules
- Avoid common installation location configuration errors

::: info Prerequisites

This tutorial assumes you've completed [Installing Your First Skill](../../start/first-skill/) and [Installation Sources Explained](../install-sources/), and understand the basic skill installation workflow.

:::

---

## Your Current Dilemma

You may have learned how to install skills, but:

- **Where are skills installed?**: After running `openskills install`, you don't know which directory the skill files were copied to
- **Do I need to reinstall for new projects?**: When switching to another project, previously installed skills disappear
- **What about skills I only want to use globally once?**: Some skills are needed across all projects, and you don't want to install them in every project
- **Share skills across multiple projects?**: Some skills are team-wide and you want unified management

Actually, OpenSkills provides two installation locations, allowing you to flexibly manage skills.

---

## When to Use This Approach

**Applicable scenarios for two installation locations**:

| Installation Location | Applicable Scenario | Example |
| -------- | -------- | ---- |
| **Project-local** (default) | Project-specific skills requiring version control | Team business rules, project-specific tools |
| **Global installation** (`--global`) | Project-agnostic skills, no version control needed | Universal code generation tools, file format conversion |

::: tip Recommended Practices

- **Use project-local installation by default**: Keep skills with the project for team collaboration and version control
- **Use global installation only for universal tools**: Like `git-helper`, `docker-generator` and other cross-project tools
- **Avoid over-globalization**: Globally installed skills are shared across all projects, potentially causing conflicts or version inconsistencies

:::

---

## Core Idea: Two Locations, Flexible Choice

OpenSkills skill installation location is controlled by the `--global` flag:

**Default (project-local installation)**:
- Installation location: `./.claude/skills/` (project root)
- Applicable: Skills specific to a single project
- Advantage: Skills follow the project, can be committed to Git, facilitating team collaboration

**Global installation**:
- Installation location: `~/.claude/skills/` (user home directory)
- Applicable: Skills universal across all projects
- Advantage: Shared across all projects, no need to reinstall

::: info Important Concept

**Project-local**: Skills installed in the `.claude/skills/` directory of the current project, visible only to the current project.

**Global installation**: Skills installed in the `.claude/skills/` directory of the user home directory, visible to all projects.

:::

---

## Follow Along

### Step 1: Examine Default Installation Behavior

**Why**
First understand the default installation method to grasp OpenSkills's design philosophy.

Open terminal and execute in any project:

```bash
# Install a test skill (default project-local)
npx openskills install anthropics/skills -y

# View skill list
npx openskills list
```

**You should see**: Each skill in the skill list has a `(project)` label

```
  codebase-reviewer         (project)
    Review code changes for issues...

Summary: 3 project, 0 global (3 total)
```

**Explanation**:
- By default, skills are installed in the `./.claude/skills/` directory
- The `list` command displays `(project)` or `(global)` labels
- Without the `--global` flag by default, skills are visible only to the current project

---

### Step 2: Check Skill Installation Location

**Why**
Confirm the actual storage location of skill files for future management.

Execute in project root:

```bash
# View project-local skills directory
ls -la .claude/skills/

# View skill directory contents
ls -la .claude/skills/codebase-reviewer/
```

**You should see**:

```
.claude/skills/
├── codebase-reviewer/
│   ├── SKILL.md
│   └── .openskills.json    # Installation metadata
├── file-writer/
│   ├── SKILL.md
│   └── .openskills.json
└── ...
```

**Explanation**:
- Each skill has its own directory
- `SKILL.md` is the core content of the skill
- `.openskills.json` records installation source and metadata (for updates)

---

### Step 3: Install Skills Globally

**Why**
Understand the command and effects of global installation.

Execute:

```bash
# Install a skill globally
npx openskills install anthropics/skills --global -y

# View skill list again
npx openskills list
```

**You should see**:

```
  codebase-reviewer         (project)
    Review code changes for issues...
  file-writer              (global)
    Write files with format...

Summary: 1 project, 2 global (3 total)
```

**Explanation**:
- After using the `--global` flag, skills are installed in `~/.claude/skills/`
- The `list` command displays a `(global)` label
- Skills with the same name prioritize using the project-local version (search priority)

---

### Step 4: Compare Two Installation Locations

**Why**
Understand the differences between the two installation locations through actual comparison.

Execute the following commands:

```bash
# View globally installed skills directory
ls -la ~/.claude/skills/

# Compare project-local and globally installed skills
echo "=== Project Skills ==="
ls .claude/skills/

echo "=== Global Skills ==="
ls ~/.claude/skills/
```

**You should see**:

```
=== Project Skills ===
codebase-reviewer
file-writer

=== Global Skills ===
codebase-reviewer
file-writer
test-generator
```

**Explanation**:
- Project-local skills: `./.claude/skills/`
- Global skills: `~/.claude/skills/`
- The two directories can contain skills with the same name, but project-local ones have higher priority

---

### Step 5: Verify Search Priority

**Why**
Understand how OpenSkills searches for skills across multiple locations.

Execute:

```bash
# Install skills with the same name in both locations
npx openskills install anthropics/skills -y  # project-local
npx openskills install anthropics/skills --global -y  # global

# Read skill (will prioritize project-local version)
npx openskills read codebase-reviewer | head -5
```

**You should see**: The output is the content of the project-local version of the skill.

**Search Priority Rules** (source code `dirs.ts:18-24`):

```typescript
export function getSearchDirs(): string[] {
  return [
    join(process.cwd(), '.claude/skills'),   // 1. Project-local (highest priority)
    join(homedir(), '.claude/skills'),       // 2. Global
  ];
}
```

**Explanation**:
- Project-local skills have higher priority than global ones
- When skills with the same name exist simultaneously, the project-local version is prioritized
- This enables flexible configuration of "project overrides global"

---

## Checkpoint ✅

Complete the following checks to confirm you've mastered the lesson content:

- [ ] Able to distinguish between project-local and global installation
- [ ] Know the purpose of the `--global` flag
- [ ] Understand skill search priority rules
- [ ] Able to choose the appropriate installation location based on scenarios
- [ ] Know how to view the location labels of installed skills

---

## Pitfall Alerts

### Common Error 1: Misusing Global Installation

**Error scenario**: Globally installing project-specific skills

```bash
# ❌ Wrong: Team business rules should not be installed globally
npx openskills install my-company/rules --global
```

**Problems**:
- Other team members cannot obtain the skill
- The skill is not under version control
- May conflict with skills from other projects

**Correct approach**:

```bash
# ✅ Correct: Project-specific skills use default installation (project-local)
npx openskills install my-company/rules
```

---

### Common Error 2: Forgetting the `--global` Flag

**Error scenario**: Wanting to share a skill across all projects but forgetting to add `--global`

```bash
# ❌ Wrong: Default installation is project-local, other projects cannot use it
npx openskills install universal-tool
```

**Problems**:
- The skill is only installed in `./.claude/skills/` of the current project
- After switching to other projects, reinstallation is needed

**Correct approach**:

```bash
# ✅ Correct: Universal tools use global installation
npx openskills install universal-tool --global
```

---

### Common Error 3:同名 Skill Conflicts

**Error scenario**: Same-named skills installed both project-locally and globally, but expecting to use the global version

```bash
# Both project-local and global have codebase-reviewer
# But want to use the global version (newer)
npx openskills install codebase-reviewer --global  # Install new version
npx openskills read codebase-reviewer  # ❌ Still reads the old version
```

**Problems**:
- The project-local version has higher priority
- Even with a new globally installed version, the old project-local version is still read

**Correct approaches**:

```bash
# Solution 1: Delete project-local version
npx openskills remove codebase-reviewer  # Delete project-local
npx openskills read codebase-reviewer  # ✅ Now reads the global version

# Solution 2: Update in project-local
npx openskills update codebase-reviewer  # Update project-local version
```

---

## Lesson Summary

**Key Points**:

1. **Default to project-local installation**: Skills installed in `./.claude/skills/`, visible only to the current project
2. **Global installation uses `--global`**: Skills installed in `~/.claude/skills/`, shared across all projects
3. **Search priority**: Project-local > Global
4. **Recommended principle**: Project-specific → local, universal tools → global

**Decision flow**:

```
[Need to install skill] → [Is it project-specific?]
                      ↓ Yes
              [Project-local installation (default)]
                      ↓ No
              [Does it need version control?]
                      ↓ Yes
              [Project-local installation (can commit to Git)]
                      ↓ No
              [Global installation (--global)]
```

**Memory aids**:

- **Project-local**: Skills follow the project, team collaboration has no worries
- **Global installation**: Universal tools go global, all projects can use them

---

## Next Lesson Preview

> In the next lesson, we will learn **[List Installed Skills](../list-skills/)**.
>
> You will learn:
> - How to view all installed skills
> - Understand the meaning of skill location labels
> - How to count the number of project and global skills
> - How to filter skills by location

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function      | File Path                                                                                          | Line Numbers |
| ----------- | ------------------------------------------------------------------------------------------------- | ------- |
| Installation location judgment | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92   |
| Directory path utilities | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L7-L25)     | 7-25    |
| Skill list display | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts#L20-L43)   | 20-43   |

**Key constants**:
- `.claude/skills`: Default skills directory (Claude Code compatible)
- `.agent/skills`: Universal skills directory (multi-agent environment)

**Key functions**:
- `getSkillsDir(projectLocal, universal)`: Returns the skills directory path based on flags
- `getSearchDirs()`: Returns the list of skill search directories (sorted by priority)
- `listSkills()`: Lists all installed skills, displaying location labels

**Business rules**:
- Default to project-local installation (`!options.global`)
- Skill search priority: project-local > global
- `list` command displays `(project)` and `(global)` labels

</details>
