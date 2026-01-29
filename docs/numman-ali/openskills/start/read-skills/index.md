---
title: "Read Skills: Load Skill Content for AI Agents | openskills"
sidebarTitle: "Read Skills"
subtitle: "Read Skills: Load Skill Content for AI Agents"
description: "Learn how to use the openskills read command to load skill content. Master 4-level priority lookup, multi-skill reading, and troubleshoot common errors."
tags:
  - "Getting Started"
  - "Skill Usage"
prerequisite:
  - "start-first-skill"
order: 6
---

# Using Skills

## What You'll Learn

After completing this lesson, you will be able to:

- Use `openskills read` command to read installed skill content
- Understand how AI agents load skills into context through this command
- Master the 4-level priority order for skill lookup
- Read multiple skills at once (comma-separated)

::: info Prerequisites

This tutorial assumes you have [installed at least one skill](../first-skill/). If you haven't installed any skills yet, please complete the skill installation steps first.

:::

---

## Your Current Challenges

You may have already installed skills, but:

- **Don't know how to let AI use skills**: Skills are installed, but how does the AI agent read them?
- **Don't understand the read command's purpose**: You know there's a `read` command, but don't know what the output is
- **Unclear about skill lookup order**: Both global and project have skills, which one will AI use?

These are common issues. Let's solve them step by step.

---

## When to Use This Approach

**Using skills (read command)** is suitable for these scenarios:

- **AI agent needs to perform specific tasks**: Such as processing PDFs, operating Git repositories, etc.
- **Verify skill content is correct**: Check if instructions in SKILL.md meet expectations
- **Understand the complete structure of skills**: View references/, scripts/ and other resources in skills

::: tip Recommended Practice

Typically you won't use the `read` command directly, but rather it's automatically called by AI agents. However, understanding its output format helps with debugging and developing custom skills.

:::

---

## 🎒 Before You Start

Before beginning, please confirm:

- [ ] Completed [installing your first skill](../first-skill/)
- [ ] Installed at least one skill in the project directory
- [ ] Can view the `.claude/skills/` directory

::: warning Prerequisites Check

If you haven't installed skills yet, you can quickly install a test skill:

```bash
npx openskills install anthropics/skills
# In the interactive interface, select any skill (such as pdf)
```

:::

---

## Core Concept: Lookup and Output Skills by Priority

The OpenSkills `read` command follows this flow:

```
[Specify skill name] → [Lookup by priority] → [Find first match] → [Read SKILL.md] → [Output to stdout]
```

**Key points**:

- **4-level lookup priority**:
  1. `.agent/skills/` (project universal)
  2. `~/.agent/skills/` (global universal)
  3. `.claude/skills/` (project claude)
  4. `~/.claude/skills/` (global claude)

- **Return first match**: Stops at the first found match, won't search subsequent directories
- **Output base directory**: AI agent needs this path to resolve resource files in skills

---

## Follow Along

### Step 1: Read a Single Skill

First, try reading an installed skill.

**Example command**:

```bash
npx openskills read pdf
```

**Why**

`pdf` is the skill name we installed in the previous lesson. This command will search for and output the complete content of that skill.

**What You Should See**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit for extracting text and tables...
...

Skill read: pdf
```

**Output Structure Explanation**:

| Part | Content | Purpose |
| ---- | ---- | ---- |
| `Reading: pdf` | Skill name | Identifies the skill being read |
| `Base directory: ...` | Skill base directory | AI uses this path to resolve references/, scripts/ and other resources |
| SKILL.md content | Complete skill definition | Contains instructions, resource references, etc. |
| `Skill read: pdf` | End marker | Marks completion of reading |

::: tip Note

**Base directory** is very important. Paths like `references/some-doc.md` in skills are resolved relative to this directory.

:::

---

### Step 2: Read Multiple Skills

OpenSkills supports reading multiple skills at once, with skill names separated by commas.

**Example command**:

```bash
npx openskills read pdf,git-workflow
```

**Why**

Reading multiple skills at once reduces the number of command invocations and improves efficiency.

**What You Should See**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit...
...

Skill read: pdf

Reading: git-workflow
Base directory: /path/to/your/project/.claude/skills/git-workflow

---
name: git-workflow
description: Git workflow: Best practices...
...

Skill read: git-workflow
```

**Features**:
- Each skill's output is separated by a blank line
- Each skill has independent `Reading:` and `Skill read:` markers
- Skills are read in the order specified in the command

::: tip Advanced Usage

Skill names can contain spaces, and the `read` command handles them automatically:

```bash
npx openskills read pdf, git-workflow  # Spaces are ignored
```

:::

---

### Step 3: Verify Skill Lookup Priority

Let's verify that the 4-level lookup order is correct.

**Prepare environment**:

First, install skills in both the project directory and global directory (using different installation sources):

```bash
# Project-local installation (in current project directory)
npx openskills install anthropics/skills

# Global installation (using --global)
npx openskills install anthropics/skills --global
```

**Verify priority**:

```bash
# List all skills
npx openskills list
```

**What You Should See**:

```
Available skills:

pdf (project)      /path/to/your/project/.claude/skills/pdf
pdf (global)       /home/user/.claude/skills/pdf

Total: 2 skills (1 project, 1 global)
```

**Read skill**:

```bash
npx openskills read pdf
```

**What You Should See**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf  ← Prioritize returning project skill
...
```

**Conclusion**: Because `.claude/skills/` (project) has higher priority than `~/.claude/skills/` (global), the project-local skill is read.

::: tip Practical Application

This priority mechanism allows you to override global skills in your project without affecting other projects. For example:
- Install common skills globally (shared by all projects)
- Install customized versions in projects (override global versions)

:::

---

### Step 4: View Complete Skill Resources

Skills contain not only SKILL.md, but may also have references/, scripts/ and other resources.

**View skill directory structure**:

```bash
ls -la .claude/skills/pdf/
```

**What You Should See**:

```
.claude/skills/pdf/
├── SKILL.md
├── .openskills.json
├── references/
│   ├── pdf-extraction.md
│   └── table-extraction.md
└── scripts/
    └── extract-pdf.js
```

**Read skill and observe output**:

```bash
npx openskills read pdf
```

**What You Should See**:

SKILL.md contains references to resources, such as:

```markdown
## References

See [PDF extraction guide](references/pdf-extraction.md) for details.

## Scripts

Run `node scripts/extract-pdf.js` to extract text from PDF.
```

::: info Key Point

When an AI agent reads a skill, it will:
1. Get the `Base directory` path
2. Concatenate relative paths in SKILL.md (like `references/...`) with the base directory
3. Read the actual resource file contents

This is why the `read` command must output `Base directory`.

:::

---

## Checklist ✅

After completing the above steps, please confirm:

- [ ] Command line displayed the complete SKILL.md content of the skill
- [ ] Output includes `Reading: <name>` and `Base directory: <path>`
- [ ] Output ends with `Skill read: <name>` marker
- [ ] When reading multiple skills, each skill is separated by a blank line
- [ ] Project-local skills are prioritized over global skills

If all the above checks pass, congratulations! You have mastered the core workflow of skill reading.

---

## Common Pitfalls

### Problem 1: Skill Not Found

**Symptom**:

```
Error: Skill(s) not found: pdf

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Cause**:
- Skill not installed
- Skill name spelled incorrectly

**Solution**:
1. List installed skills: `npx openskills list`
2. Confirm the skill name is correct
3. If not installed, use `openskills install` to install

---

### Problem 2: Read Wrong Skill

**Symptom**:

Expected to read project skill, but actually read global skill.

**Cause**:
- Project directory is not in the correct location (used wrong directory)

**Solution**:
1. Check current working directory: `pwd`
2. Ensure you're in the correct project directory
3. Use `openskills list` to view the `location` tag of skills

---

### Problem 3: Multi-Skill Reading Order Not as Expected

**Symptom**:

```bash
npx openskills read skill-a,skill-b
```

Expected to read skill-b first, but actually read skill-a first.

**Cause**:
- The `read` command reads skills in the order specified by parameters, without automatic sorting

**Solution**:
- If you need a specific order, specify skill names in that order in the command

---

### Problem 4: SKILL.md Content Truncated

**Symptom**:

The output SKILL.md content is incomplete, missing the ending part.

**Cause**:
- Skill file is corrupted or has format errors
- File encoding issues

**Solution**:
1. Check SKILL.md file: `cat .claude/skills/<name>/SKILL.md`
2. Confirm the file is complete and has correct format (must have YAML frontmatter)
3. Reinstall skill: `openskills update <name>`

---

## Lesson Summary

In this lesson, you learned:

- **Use `openskills read <name>`** to read installed skill content
- **Understand 4-level lookup priority**: project universal > global universal > project claude > global claude
- **Support multi-skill reading**: Use commas to separate skill names
- **Output format**: Includes `Reading:`, `Base directory`, skill content, `Skill read:` markers

**Core Concepts**:

| Concept | Description |
| ---- | ---- |
| **Lookup priority** | Search 4 directories in order, return first match |
| **Base directory** | Reference directory used by AI agents to resolve relative paths in skills |
| **Multi-skill reading** | Comma-separated, read in specified order |

**Core Commands**:

| Command | Purpose |
| ---- | ---- |
| `npx openskills read <name>` | Read a single skill |
| `npx openskills read name1,name2` | Read multiple skills |
| `npx openskills list` | View installed skills and their locations |

---

## Up Next

> In the next lesson, we'll learn **[Command Reference](../../platforms/cli-commands/)**.
>
> You will learn:
> - Complete list of all OpenSkills commands and parameters
> - Usage and purpose of command-line flags
> - Quick reference for commonly used commands

After learning how to use skills, you need to understand all commands provided by OpenSkills and their purposes.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function | File Path | Line Numbers |
| ---- | --------- | ---- |
| read command entry point | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L8-L48) | 8-48 |
| skill lookup (findSkill) | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84) | 69-84 |
| skill name normalization | [`src/utils/skill-names.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-names.ts) | 1-8 |
| search directory retrieval | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L18-L25) | 18-25 |
| CLI command definition | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L52-L55) | 52-55 |

**Key Functions**:
- `readSkill(skillNames)` - Read skills to stdout, supports multiple skill names
- `findSkill(skillName)` - Look up skills by 4-level priority, return first match
- `normalizeSkillNames(input)` - Normalize skill name list, supports comma separation and deduplication
- `getSearchDirs()` - Return 4 search directories, sorted by priority

**Key Types**:
- `SkillLocation` - Skill location information, contains path, baseDir, source

**Directory Priority** (from dirs.ts:18-24):
```typescript
[
  process.cwd() + '/.agent/skills',   // 1. Project universal
  homedir() + '/.agent/skills',       // 2. Global universal
  process.cwd() + '/.claude/skills',  // 3. Project claude
  homedir() + '/.claude/skills',      // 4. Global claude
]
```

</details>
