---
title: "Sync Skills: Generate AGENTS.md for AI Agents | openskills"
sidebarTitle: "Sync to Agents"
subtitle: "Sync Skills: Generate AGENTS.md for AI Agents"
description: "Learn to use openskills sync to generate AGENTS.md. Enable AI agents like Claude Code to discover installed skills through interactive selection."
tags:
  - "Getting Started"
  - "Skill Sync"
  - "AGENTS.md"
prerequisite:
  - "start-first-skill"
order: 5
---

# Sync Skills to AGENTS.md

## What You'll Learn

After completing this lesson, you will be able to:

- Use `openskills sync` to generate AGENTS.md file
- Understand how AI agents learn about available skills through AGENTS.md
- Select which skills to sync, controlling AI context size
- Use custom output paths to integrate with existing documentation
- Understand AGENTS.md XML format and usage

::: info Prerequisites

This tutorial assumes you have completed [installing your first skill](../first-skill/). If you haven't installed any skills yet, please complete the installation steps first.

:::

---

## Your Current Challenges

You may have installed some skills, but:

- **AI agents don't know skills are available**: Skills are installed, but AI agents (like Claude Code) have no idea they exist
- **Don't know how to let AI know about skills**: Heard of `AGENTS.md`, but don't know what it is or how to generate it
- **Worried about too many skills taking up context**: Installed many skills, want selective sync, don't want to tell AI about all at once

The root cause: **Skill installation and skill availability are two different things**. Installation just puts files in place. To let AI know, you need to sync to AGENTS.md.

---

## When to Use This Approach

**Syncing skills to AGENTS.md** is suitable for these scenarios:

- Just finished installing skills, need to let AI agents know they exist
- After adding new skills, update AI's available skill list
- After deleting skills, remove them from AGENTS.md
- Want selective skill sync to control AI context size
- Multi-agent environment, need unified skill list

::: tip Recommended Practice

Run `openskills sync` after each skill installation, update, or deletion to keep AGENTS.md consistent with actual skills.

:::

---

## 🎒 Before You Start

Before beginning, please confirm:

- [ ] Completed [installation of at least one skill](../first-skill/)
- [ ] Entered your project directory
- [ ] Understand skill installation location (project or global)

::: warning Prerequisites Check

If you haven't installed any skills yet, first run:

```bash
npx openskills install anthropics/skills
```

:::

---

## Core Concept: Skill Installation ≠ AI Availability

OpenSkills skill management is divided into two stages:

```
[Installation Stage]      [Sync Stage]
Skill → .claude/skills/  →  AGENTS.md
   ↓                        ↓
File exists            AI agent reads
   ↓                        ↓
Locally available      AI knows and can invoke
```

**Key points**:

1. **Installation stage**: Use `openskills install`, skills are copied to `.claude/skills/` directory
2. **Sync stage**: Use `openskills sync`, skill information is written to `AGENTS.md`
3. **AI reads**: AI agent reads `AGENTS.md`, knowing which skills are available
4. **On-demand loading**: AI uses `openskills read <skill>` to load specific skills as needed

**Why do we need AGENTS.md?**

AI agents (like Claude Code, Cursor) don't actively scan the file system. They need a clear "skill list" telling them which tools are available. This list is `AGENTS.md`.

---

## Follow Along

### Step 1: Navigate to Project Directory

First, navigate to your project directory where you installed skills:

```bash
cd /path/to/your/project
```

**Why**

`openskills sync` looks for installed skills in the current directory by default and generates or updates `AGENTS.md` in the current directory.

**What You Should See**:

Your project directory should contain a `.claude/skills/` directory (if you've installed skills):

```bash
ls -la
# Sample output:
drwxr-xr-x  5 user  staff  .claude
drwxr-xr-x  5 user  staff  .claude/skills/
-rw-r--r--  1 user  staff  package.json
```

---

### Step 2: Sync Skills

Use the following command to sync installed skills to AGENTS.md:

```bash
npx openskills sync
```

**Why**

The `sync` command finds all installed skills, generates an XML-formatted skill list, and writes it to the `AGENTS.md` file.

**What You Should See**:

The command will launch an interactive selection interface:

```
Found 2 skill(s)

? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...
  ◉ check-branch-first          (global)   Git workflow: Always check current branch...

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
│                                                            │
│  (project)        Project skills, blue highlight            │
│  (global)         Global skills, gray display               │
└─────────────────────────────────────────────────────────────┘

You should see:
- Cursor can move up and down
- Press spacebar to toggle selection (○ ↔ ◉)
- Project skills display in blue, global skills display in gray
- Press Enter to confirm sync
```

::: tip Smart Pre-selection

If syncing for the first time, the tool will select all **project skills** by default. If updating an existing AGENTS.md, the tool will pre-select **skills already enabled in the file**.

:::

---

### Step 3: Select Skills

In the interactive interface, select which skills you want AI agents to know about.

**Example**:

Suppose you want to sync all installed skills:

```
? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)
  ◉ git-workflow                (project)
  ◯ check-branch-first          (global)   ← Don't select this global skill
```

Operations:
1. **Move cursor**: Use up/down arrow keys to move
2. **Select/deselect**: Press **Spacebar** to toggle selection (`○` ↔ `◉`)
3. **Confirm sync**: Press **Enter** to start syncing

**What You Should See**:

```
✅ Synced 2 skill(s) to AGENTS.md
```

::: tip Selection Strategy

- **Project skills**: Skills specific to current project, recommended to sync
- **Global skills**: Universal skills (like coding standards), sync as needed
- **Avoid too many**: Too many skills will occupy AI context, only sync commonly used skills

:::

---

### Step 4: View AGENTS.md

After syncing, view the generated AGENTS.md file:

```bash
cat AGENTS.md
```

**What You Should See**:

```markdown
# AGENTS.md

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help complete the task more effectively.

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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms...</description>
<location>project</location>
</skill>

<skill>
<name>git-workflow</name>
<description>Git workflow: Best practices for commits, branches, and PRs, ensuring clean history and effective collaboration.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

**Key Elements Explanation**:

| Element | Purpose |
|--- | ---|
| `<skills_system>` | XML tag, tells AI this is a skill system definition |
| `<usage>` | Usage instructions, tells AI how to invoke skills |
| `<available_skills>` | Available skills list |
| `<skill>` | Individual skill definition |
| `<name>` | Skill name |
| `<description>` | Skill description |
| `<location>` | Skill location |

::: info Why XML format?

XML format is the standard format for AI agents (especially Claude Code), making it easy to parse and understand. The tool also supports HTML comment format as an alternative.

:::

---

### Step 5: Verify AI Reading

Now, let the AI agent read AGENTS.md and see if it knows about available skills.

**Sample Dialogue**:

```
User:
I want to extract table data from PDF files

AI Agent:
I can use the `pdf` skill to help you extract table data. Let me first read the detailed content of this skill.

AI executes:
npx openskills read pdf

Output:
Skill: pdf
Base Directory: /path/to/project/.claude/skills/pdf

[Detailed PDF skill content...]

AI:
Great, I've loaded the PDF skill. Now I can help you extract table data...
```

**What You Should See**:

- AI agent identifies that it can use the `pdf` skill
- AI automatically executes `npx openskills read pdf` to load skill content
- AI executes tasks according to skill instructions

---

### Step 6 (Optional): Custom Output Path

If you want to sync skills to another file (like `.ruler/AGENTS.md`), use the `-o` or `--output` option:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**Why**

Some tools (like Windsurf) may expect AGENTS.md in a specific directory. Using `-o` allows flexible customization of the output path.

**What You Should See**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: tip Non-interactive Sync

In CI/CD environments, use the `-y` or `--yes` flag to skip interactive selection and sync all skills:

```bash
npx openskills sync -y
```

:::

---

## Checklist ✅

After completing the above steps, please confirm:

- [ ] Command line displayed interactive selection interface
- [ ] Successfully selected at least one skill (marked with `◉`)
- [ ] Sync succeeded, showing `✅ Synced X skill(s) to AGENTS.md` message
- [ ] `AGENTS.md` file has been created or updated
- [ ] File contains `<skills_system>` XML tag
- [ ] File contains `<available_skills>` skill list
- [ ] Each `<skill>` contains `<name>`, `<description>`, `<location>`

If all the above checks pass, congratulations! Skills have been successfully synced to AGENTS.md, and AI agents can now know and use these skills.

---

## Common Pitfalls

### Problem 1: No Skills Found

**Symptom**:

```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Cause**:

- No skills installed in current directory or global directory

**Solution**:

1. Check if skills are installed:

```bash
npx openskills list
```

2. If not, install skills first:

```bash
npx openskills install anthropics/skills
```

---

### Problem 2: AGENTS.md Not Updated

**Symptom**:

After running `openskills sync`, AGENTS.md content hasn't changed.

**Cause**:

- Used `-y` flag, but skill list is the same as before
- AGENTS.md already exists, but syncing the same skills

**Solution**:

1. Check if you used the `-y` flag

```bash
# Remove -y, enter interactive mode to reselect
npx openskills sync
```

2. Check if current directory is correct

```bash
# Confirm you're in the project directory where skills are installed
pwd
ls .claude/skills/
```

---

### Problem 3: AI Agent Doesn't Know About Skills

**Symptom**:

AGENTS.md has been generated, but AI agent still doesn't know skills are available.

**Cause**:

- AI agent hasn't read AGENTS.md
- AGENTS.md format is incorrect
- AI agent doesn't support skill system

**Solution**:

1. Confirm AGENTS.md is in project root directory
2. Check AGENTS.md format is correct (contains `<skills_system>` tag)
3. Check if AI agent supports AGENTS.md (Claude Code supports, other tools may need configuration)

---

### Problem 4: Output File Is Not Markdown

**Symptom**:

```
Error: Output file must be a markdown file (.md)
```

**Cause**:

- Used `-o` option, but specified file doesn't have `.md` extension

**Solution**:

1. Ensure output file ends with `.md`

```bash
# ❌ Wrong
npx openskills sync -o skills.txt

# ✅ Correct
npx openskills sync -o skills.md
```

---

### Problem 5: Deselect All

**Symptom**:

In the interactive interface, after deselecting all skills, the skills section in AGENTS.md is deleted.

**Cause**:

This is expected behavior. If all skills are deselected, the tool will remove the skills section from AGENTS.md.

**Solution**:

If this was an accidental operation, re-run `openskills sync` and select the skills you want to sync.

---

## Lesson Summary

In this lesson, you learned:

- **Use `openskills sync`** to generate AGENTS.md file
- **Understand skill sync process**: Install → Sync → AI Reads → On-demand Load
- **Interactively select skills**, controlling AI context size
- **Customize output path**, integrate with existing documentation system
- **Understand AGENTS.md format**, containing `<skills_system>` XML tag and skill list

**Core Commands**:

| Command | Purpose |
|--- | ---|
| `npx openskills sync` | Interactively sync skills to AGENTS.md |
|--- | ---|
| `npx openskills sync -o custom.md` | Sync to custom file |
| `cat AGENTS.md` | View generated AGENTS.md content |

**AGENTS.md Format Key Points**:

- Wrapped with `<skills_system>` XML tag
- Contains `<usage>` usage instructions
- Contains `<available_skills>` skill list
- Each `<skill>` contains `<name>`, `<description>`, `<location>`

---

## Up Next

> In the next lesson, we'll learn **[Using Skills](../read-skills/)**.
>
> You will learn:
> - How AI agents use `openskills read` command to load skills
> - Complete skill loading process
> - How to read multiple skills
> - Structure and composition of skill content

Syncing skills just lets AI know which tools are available. When actually using them, AI will load specific skill content through the `openskills read` command.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function | File Path | Line Numbers |
|--- | --- | ---|
| sync command entry point | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| Output file validation | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19-L26) | 19-26 |
|--- | --- | ---|
| Interactive selection interface | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| Parse existing AGENTS.md | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Generate skills XML | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| Replace skills section | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| Delete skills section | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L98-L122) | 98-122 |

**Key Functions**:
- `syncAgentsMd()` - Sync skills to AGENTS.md file
- `parseCurrentSkills()` - Parse skill names from existing AGENTS.md
- `generateSkillsXml()` - Generate XML-formatted skill list
- `replaceSkillsSection()` - Replace or add skills section to file
- `removeSkillsSection()` - Remove skills section from file

**Key Constants**:
- `AGENTS.md` - Default output filename
- `<skills_system>` - XML tag, used to mark skill system definition
- `<available_skills>` - XML tag, used to mark available skills list

**Important Logic**:
- Default pre-selection of skills already present in file (incremental update)
- First sync defaults to selecting all project skills
- Supports two markup formats: XML tags and HTML comments
- When all selections are canceled, deletes skills section rather than keeping empty list

</details>
