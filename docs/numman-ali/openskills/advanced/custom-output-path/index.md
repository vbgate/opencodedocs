---
title: "Custom Output: Sync Skills to Any Path | OpenSkills"
sidebarTitle: "Custom Output"
subtitle: "Custom Output Path"
description: "Learn to use the -o flag to sync skills to custom paths. Configure different AGENTS.md files for Windsurf, Cursor, and other AI tools."
tags:
  - "Advanced Features"
  - "Custom Output"
  - "Skill Sync"
  - "-o Flag"
prerequisite:
  - "start-sync-to-agents"
order: 2
---

# Custom Output Path

## What You'll Learn

- Use the `-o` or `--output` flag to sync skills to `.md` files at any location
- Understand how the tool automatically creates non-existent files and directories
- Configure different AGENTS.md files for different tools (Windsurf, Cursor, etc.)
- Manage skill lists in multi-file environments
- Skip the default `AGENTS.md` and integrate into existing documentation systems

::: info Prerequisites

This tutorial assumes you have mastered [basic skill syncing](../../start/sync-to-agents/). If you haven't installed any skills or synced AGENTS.md yet, please complete the prerequisite course first.

:::

---

## Your Current Challenge

You may be accustomed to `openskills sync` generating `AGENTS.md` by default, but you might encounter:

- **Tools require specific paths**: Some AI tools (like Windsurf) expect AGENTS.md in a specific directory (like `.ruler/`), not the project root
- **Multi-tool conflicts**: When using multiple coding tools simultaneously, they may expect AGENTS.md in different locations
- **Existing documentation integration**: You already have a skills list document and want to integrate OpenSkills' skills into it instead of creating a new file
- **Directory doesn't exist**: You want to output to a nested directory (like `docs/ai-skills.md`), but the directory doesn't exist yet

The root cause of these issues: **The default output path cannot meet all scenarios**. You need more flexible output control.

---

## When to Use This Approach

**Custom output path** is suitable for these scenarios:

- **Multi-tool environments**: Configure separate AGENTS.md files for different AI tools (like `.ruler/AGENTS.md` vs `AGENTS.md`)
- **Directory structure requirements**: Tools expect AGENTS.md in a specific directory (like Windsurf's `.ruler/`)
- **Existing documentation integration**: Integrate skill lists into existing documentation systems instead of creating new AGENTS.md
- **Organizational management**: Store skill lists by project or function category (like `docs/ai-skills.md`)
- **CI/CD environments**: Use fixed path output in automated workflows

::: tip Recommended Practice

If your project only uses one AI tool and the tool supports AGENTS.md in the project root, using the default path is sufficient. Only use custom output paths when you need multi-file management or have tool-specific path requirements.

:::

---

## 🎒 Preparation Before Starting

Before you begin, please confirm:

- [ ] Have completed [at least one skill installation](../../start/first-skill/)
- [ ] Have navigated to your project directory
- [ ] Understand the basic usage of `openskills sync`

::: warning Prerequisite Check

Confirm you have installed skills:

```bash
npx openskills list
```

If the list is empty, install a skill first:

```bash
npx openskills install anthropics/skills
```

:::

---

## Core Concept: Flexible Output Control

OpenSkills' sync function outputs to `AGENTS.md` by default, but you can use the `-o` or `--output` flag to customize the output path.

```
[Default Behavior]                    [Custom Output]
openskills sync      →      AGENTS.md (project root)
openskills sync -o custom.md →  custom.md (project root)
openskills sync -o .ruler/AGENTS.md →  .ruler/AGENTS.md (nested directory)
```

**Key Features**:

1. **Arbitrary paths**: You can specify any `.md` file path (relative or absolute)
2. **Automatic file creation**: If the file doesn't exist, the tool creates it automatically
3. **Automatic directory creation**: If the file's directory doesn't exist, the tool creates it recursively
4. **Smart titles**: When creating files, automatically adds a title based on the filename (like `# AGENTS`)
5. **Format validation**: Must end with `.md`, otherwise an error is reported

**Why do you need this feature?**

Different AI tools may have different expected paths:

| Tool        | Expected Path        | Default Path Usable |
|--- | --- | ---|
| Claude Code | `AGENTS.md`        | ✅ Available          |
| Cursor     | `AGENTS.md`        | ✅ Available          |
| Windsurf   | `.ruler/AGENTS.md` | ❌ Not Available       |
| Aider      | `.aider/agents.md` | ❌ Not Available       |

Using the `-o` flag, you can configure the correct path for each tool.

---

## Follow Along

### Step 1: Basic Usage - Output to Current Directory

First, try syncing skills to a custom file in the current directory:

```bash
npx openskills sync -o my-skills.md
```

**Why**

Using `-o my-skills.md` tells the tool to output to `my-skills.md` instead of the default `AGENTS.md`.

**You should see**:

If `my-skills.md` doesn't exist, the tool will create it:

```
Created my-skills.md
```

Then the interactive selection interface launches:

```
Found 2 skill(s)

? Select skills to sync to my-skills.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...

<Space> Select  <a> Select All  <i> Invert  <Enter> Confirm
```

After selecting skills, you'll see:

```
✅ Synced 2 skill(s) to my-skills.md
```

::: tip Check Generated File

View the generated file:

```bash
cat my-skills.md
```

You'll see:

```markdown
<!-- File title: # my-skills -->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help...
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

Note that the first line is `# my-skills`, which is the automatically generated title based on the filename.

:::

---

### Step 2: Output to Nested Directory

Now, try syncing skills to a non-existent nested directory:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**Why**

Some tools (like Windsurf) expect AGENTS.md in the `.ruler/` directory. If the directory doesn't exist, the tool creates it automatically.

**You should see**:

If the `.ruler/` directory doesn't exist, the tool creates the directory and file:

```
Created .ruler/AGENTS.md
```

Then the interactive selection interface launches (same as the previous step).

**Operation Guide**:

```
┌─────────────────────────────────────────────────────────────┐
│  Automatic Directory Creation Explanation                   │
│                                                             │
│  Command input: openskills sync -o .ruler/AGENTS.md        │
│                                                             │
│  Tool execution:                                            │
│  1. Check if .ruler directory exists  →  Doesn't exist     │
│  2. Recursively create .ruler directory   →  mkdir .ruler    │
│  3. Create .ruler/AGENTS.md  →  Write # AGENTS title        │
│  4. Sync skill content           →  Write XML skill list    │
│                                                             │
│  Result: .ruler/AGENTS.md file generated, skills synced   │
└─────────────────────────────────────────────────────────────┘
```

::: tip Recursive Creation

The tool recursively creates all non-existent parent directories. For example:

- `docs/ai/skills.md` - If both `docs` and `docs/ai` don't exist, they will be created
- `.config/agents.md` - Will create the hidden directory `.config`

:::

---

### Step 3: Multi-File Management - Configure for Different Tools

Suppose you use both Windsurf and Cursor and need to configure different AGENTS.md files for them:

```bash
<!-- Configure for Windsurf (expects .ruler/AGENTS.md) -->
npx openskills sync -o .ruler/AGENTS.md

<!-- Configure for Cursor (use AGENTS.md in project root) -->
npx openskills sync
```

**Why**

Different tools may expect AGENTS.md in different locations. Using `-o` allows you to configure the correct path for each tool, avoiding conflicts.

**You should see**:

Two files are generated separately:

```bash
<!-- View Windsurf's AGENTS.md -->
cat .ruler/AGENTS.md

<!-- View Cursor's AGENTS.md -->
cat AGENTS.md
```

::: tip File Independence

Each `.md` file is independent and contains its own skill list. You can choose different skills in different files:

- `.ruler/AGENTS.md` - Skills selected for Windsurf
- `AGENTS.md` - Skills selected for Cursor
- `docs/ai-skills.md` - Skill list in documentation

:::

---

### Step 4: Non-Interactive Sync to Custom File

In CI/CD environments, you may need to skip interactive selection and directly sync all skills to a custom file:

```bash
npx openskills sync -o .ruler/AGENTS.md -y
```

**Why**

The `-y` flag skips interactive selection and syncs all installed skills. Combined with the `-o` flag, you can output to a custom path in automated workflows.

**You should see**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: info CI/CD Usage Scenario

Use in CI/CD scripts:

```bash
#!/bin/bash
<!-- Install skills -->
npx openskills install anthropics/skills -y

<!-- Sync to custom file (non-interactive) -->
npx openskills sync -o .ruler/AGENTS.md -y
```

:::

---

### Step 5: Verify Output File

Finally, verify that the output file was generated correctly:

```bash
<!-- View file content -->
cat .ruler/AGENTS.md

<!-- Check if file exists -->
ls -l .ruler/AGENTS.md

<!-- Confirm skill count -->
grep -c "<name>" .ruler/AGENTS.md
```

**You should see**:

1. File contains correct title (like `# AGENTS`)
2. File contains `<skills_system>` XML tags
3. File contains `<available_skills>` skill list
4. Each `<skill>` contains `<name>`, `<description>`, `<location>`

::: tip Check Output Path

If you're unsure about the current working directory, you can use:

```bash
<!-- View current directory -->
pwd

<!-- See where relative path resolves to -->
realpath .ruler/AGENTS.md
```

:::

---

## Checkpoint ✅

After completing the above steps, please confirm:

- [ ] Successfully used `-o` flag to output to custom file
- [ ] Tool automatically created non-existent files
- [ ] Tool automatically created non-existent nested directories
- [ ] Generated file contains correct title (based on filename)
- [ ] Generated file contains `<skills_system>` XML tags
- [ ] Generated file contains complete skill list
- [ ] Can configure different output paths for different tools
- [ ] Can use `-y` and `-o` combination in CI/CD environment

If all the above checkpoints pass, congratulations! You have mastered the use of custom output paths and can flexibly sync skills to any location.

---

## Common Pitfalls

### Issue 1: Output file is not markdown

**Phenomenon**:

```
Error: Output file must be a markdown file (.md)
```

**Cause**:

When using the `-o` flag, the specified file extension is not `.md`. The tool enforces output to markdown files to ensure AI tools can parse correctly.

**Solution**:

Ensure the output file ends with `.md`:

```bash
<!-- ❌ Incorrect -->
npx openskills sync -o skills.txt

<!-- ✅ Correct -->
npx openskills sync -o skills.md
```

---

### Issue 2: Directory creation permission error

**Phenomenon**:

```
Error: EACCES: permission denied, mkdir '.ruler'
```

**Cause**:

When attempting to create a directory, the current user doesn't have write permission for the parent directory.

**Solution**:

1. Check parent directory permissions:

```bash
ls -ld .
```

2. If permissions are insufficient, contact your administrator or use a directory with permissions:

```bash
<!-- Use project directory -->
cd ~/projects/my-project
npx openskills sync -o .ruler/AGENTS.md
```

---

### Issue 3: Output path too long

**Phenomenon**:

The file path is very long, making the command difficult to read and maintain:

```bash
npx openskills sync -o docs/ai/skills/v2/internal/agents.md
```

**Cause**:

Nested directories are too deep, making the path difficult to manage.

**Solution**:

1. Use relative paths (starting from project root)
2. Simplify directory structure
3. Consider using symbolic links (see [Symbolic Link Support](../symlink-support/))

```bash
<!-- Recommended: Flatten directory structure -->
npx openskills sync -o docs/agents.md
```

---

### Issue 4: Forgot to use -o flag

**Phenomenon**:

Expecting output to a custom file, but the tool still outputs to the default `AGENTS.md`.

**Cause**:

Forgot to use the `-o` flag, or made a typo.

**Solution**:

1. Check if the command contains `-o` or `--output`:

```bash
<!-- ❌ Incorrect: Forgot -o flag -->
npx openskills sync

<!-- ✅ Correct: Use -o flag -->
npx openskills sync -o .ruler/AGENTS.md
```

2. Use the complete form `--output` (clearer):

```bash
npx openskills sync --output .ruler/AGENTS.md
```

---

### Issue 5: Filename contains special characters

**Phenomenon**:

Filename contains spaces or special characters, causing path resolution errors:

```bash
npx openskills sync -o "my skills.md"
```

**Cause**:

Some shells handle special characters differently, which may cause path errors.

**Solution**:

1. Avoid using spaces and special characters
2. If necessary, wrap in quotes:

```bash
<!-- Not recommended -->
npx openskills sync -o "my skills.md"

<!-- Recommended -->
npx openskills sync -o my-skills.md
```

---

## Summary

In this lesson, you learned:

- **Using the `-o` or `--output` flag** to sync skills to custom `.md` files
- **Automatic file and directory creation** mechanism, no need to manually prepare directory structure
- **Configuring different AGENTS.md files for different tools**, avoiding multi-tool conflicts
- **Multi-file management tips**, storing skill lists by tool or function category
- **CI/CD environment usage** with `-y` and `-o` combination for automated sync

**Core Commands**:

| Command | Action |
|--- | ---|
| `npx openskills sync -o custom.md` | Sync to `custom.md` in project root |
| `npx openskills sync -o .ruler/AGENTS.md` | Sync to `.ruler/AGENTS.md` (automatically creates directory) |
| `npx openskills sync -o path/to/file.md` | Sync to any path (automatically creates nested directories) |
|--- | ---|

**Key Points**:

- Output file must end with `.md`
- Tool automatically creates non-existent files and directories
- When creating files, automatically adds title based on filename
- Each `.md` file is independent and contains its own skill list
- Suitable for multi-tool environments, directory structure requirements, existing documentation integration, and other scenarios

---

## Next Lesson Preview

> Next, we'll learn **[Symbolic Link Support](../symlink-support/)**.
>
> You'll learn:
> - How to use symbolic links for git-based skill updates
> - Advantages and use cases of symbolic links
> - How to manage skills in local development
> - Symbolic link detection and handling mechanisms

Custom output paths allow you to flexibly control the location of skill lists, while symbolic links provide a more advanced skill management approach, particularly suitable for local development scenarios.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function | File Path | Line |
|--- | --- | ---|
| sync command entry | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| CLI option definition | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 66 |
| Output path retrieval | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19) | 19 |
| Output file validation | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L22-L26) | 22-26 |
|--- | --- | ---|
| Recursively create directory | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L31-L32) | 31-32 |
| Auto-generate title | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L34) | 34 |
| Interactive prompt uses output filename | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L70) | 70 |

**Key Functions**:
- `syncAgentsMd(options: SyncOptions)` - Sync skills to specified output file
- `options.output` - Custom output path (optional, default 'AGENTS.md')

**Key Constants**:
- `'AGENTS.md'` - Default output filename
- `'.md'` - Required file extension

**Key Logic**:
- Output file must end with `.md`, otherwise error and exit (sync.ts:23-26)
- If file doesn't exist, automatically create parent directory (recursively) and file (sync.ts:28-36)
- When creating file, write title based on filename: `# ${outputName.replace('.md', '')}` (sync.ts:34)
- Display output filename in interactive prompt (sync.ts:70)
- Display output filename in sync success messages (sync.ts:105, 107)

</details>
