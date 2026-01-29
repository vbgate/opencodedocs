---
title: "Best Practices: Config & Collaboration | OpenSkills"
sidebarTitle: "Best Practices"
subtitle: "Best Practices: Config & Collaboration"
description: "Learn OpenSkills best practices for project configuration, skill management, and team collaboration. Covers installation modes and CI/CD integration."
tags:
  - "Advanced"
  - "Best Practices"
  - "Skills"
  - "Team"
prerequisite:
  - "start-quick-start"
  - "start-installation"
  - "start-first-skill"
order: 8
---

# Best Practices

## What You'll Learn

After completing this lesson, you will be able to:
- Choose the appropriate skill installation method based on project needs (project local vs global vs Universal)
- Write SKILL.md files that follow standards (naming, description, instructions)
- Use symlinks for efficient local development
- Manage skill versions and updates
- Collaborate on skills in team environments
- Integrate OpenSkills into CI/CD workflows

## Your Current Challenges

You've learned how to install and use skills, but you encounter these issues in real projects:

- Should skills be installed in the project directory or globally?
- How do multiple AI agents share skills?
- You've written skills multiple times, but the AI still doesn't remember them
- Team members install skills individually, resulting in version inconsistencies
- It's tedious to reinstall after every local skill modification

This lesson summarizes OpenSkills best practices to help you solve these problems.

## When to Use This Approach

- **Project configuration optimization**: Choose the appropriate skill installation location based on project type
- **Multi-agent environments**: Use Claude Code, Cursor, Windsurf, and other tools simultaneously
- **Skill standardization**: Unified skill formats and writing standards across teams
- **Local development**: Rapid iteration and testing of skills
- **Team collaboration**: Shared skills, version control, CI/CD integration

## 🎒 Prerequisites

::: warning Prerequisites

Before starting, please ensure:

- ✅ Completed [Quick Start](../../start/quick-start/)
- ✅ Installed at least one skill and synced to AGENTS.md
- ✅ Understand [SKILL.md basic format](../../start/what-is-openskills/)

:::

## Project Configuration Best Practices

### 1. Project Local vs Global vs Universal Installation

Choosing the appropriate installation location is the first step in project configuration.

#### Project Local Installation (Default)

**Use case**: Skills specific to a particular project

```bash
# Install to .claude/skills/
npx openskills install anthropics/skills
```

**Advantages**:

- ✅ Skills are version-controlled with the project
- ✅ Different projects can use different skill versions
- ✅ No global installation needed, reducing dependencies

**Recommended for**:

- Project-specific skills (e.g., build processes for specific frameworks)
- In-house team-developed business skills
- Skills that depend on project configuration

#### Global Installation

**Use case**: Skills common to all projects

```bash
# Install to ~/.claude/skills/
npx openskills install anthropics/skills --global
```

**Advantages**:

- ✅ All projects share the same set of skills
- ✅ No need to install repeatedly for each project
- ✅ Centralized update management

**Recommended for**:

- Anthropic official skills library (anthropics/skills)
- General utility skills (e.g., PDF processing, Git operations)
- Personal commonly used skills

#### Universal Mode (Multi-Agent Environments)

**Use case**: Using multiple AI agents simultaneously

```bash
# Install to .agent/skills/
npx openskills install anthropics/skills --universal
```

**Priority order** (from highest to lowest):

1. `./.agent/skills/` (Project local Universal)
2. `~/.agent/skills/` (Global Universal)
3. `./.claude/skills/` (Project local Claude Code)
4. `~/.claude/skills/` (Global Claude Code)

**Recommended for**:

- ✅ Use when working with multiple agents (Claude Code + Cursor + Windsurf)
- ✅ Avoid conflicts with Claude Code Marketplace
- ✅ Unified skill management across all agents

::: tip When to use Universal mode?

If your `AGENTS.md` is shared between Claude Code and other agents, use `--universal` to avoid skill conflicts. Universal mode uses the `.agent/skills/` directory, which is isolated from Claude Code's `.claude/skills/`.

:::

### 2. Prefer npx Over Global Installation

OpenSkills is designed to be use-on-the-fly, so always use `npx`:

```bash
# ✅ Recommended: Use npx
npx openskills install anthropics/skills
npx openskills sync
npx openskills list

# ❌ Avoid: Direct calling after global installation
openskills install anthropics/skills
```

**Advantages**:

- ✅ No global installation needed, avoiding version conflicts
- ✅ Always uses the latest version (npx auto-updates)
- ✅ Reduces system dependencies

**When global installation is needed**:

- In CI/CD environments (for performance)
- Frequent calling in scripts (reducing npx startup time)

```bash
# Global installation in CI/CD or scripts
npm install -g openskills
openskills install anthropics/skills -y
openskills sync -y
```

## Skill Management Best Practices

### 1. SKILL.md Writing Standards

#### Naming Convention: Use Hyphenated Format

**Rules**:

- ✅ Correct: `pdf-editor`, `api-client`, `git-workflow`
- ❌ Incorrect: `PDF Editor` (spaces), `pdf_editor` (underscores), `PdfEditor` (camelCase)

**Reason**: Hyphenated format is URL-friendly and follows GitHub repository and filesystem naming conventions.

#### Description Writing: Third Person, 1-2 Sentences

**Rules**:

- ✅ Correct: `Use this skill for comprehensive PDF manipulation.`
- ❌ Incorrect: `You should use this skill to manipulate PDFs.` (second person)

**Example comparison**:

| Scenario | ❌ Incorrect (Second Person) | ✅ Correct (Third Person) |
|--- | --- | ---|
| PDF skill | You can use this to extract text from PDFs. | Extract text from PDFs with this skill. |
| Git skill | When you need to manage branches, use this. | Manage Git branches with this skill. |
| API skill | If you want to call the API, load this skill. | Call external APIs with this skill. |

#### Instruction Writing: Imperative/Infinitive Form

**Rules**:

- ✅ Correct: `"To accomplish X, execute Y"`
- ✅ Correct: `"Load this skill when Z"`
- ❌ Incorrect: `"You should do X"`
- ❌ Incorrect: `"If you need Y"`

**Writing guidelines**:

1. **Start with verbs**: "Create" → "Use" → "Return"
2. **Omit "You"**: Don't say "You should"
3. **Be explicit about paths**: Reference resources with `references/` prefix

**Example comparison**:

| ❌ Incorrect Writing | ✅ Correct Writing |
|--- | ---|
| "You should create a file" | "Create a file" |
| "When you want to load this skill" | "Load this skill when" |
| "If you need to see the docs" | "See references/guide.md" |

::: tip Why use Imperative/Infinitive?

This writing style makes it easier for AI agents to parse and execute instructions. Imperative and Infinitive forms eliminate the "you" subject, making instructions more direct and clear.

:::

### 2. File Size Control

**SKILL.md file size**:

- ✅ **Recommended**: Under 5,000 words
- ⚠️ **Warning**: Over 8,000 words may cause context overflow
- ❌ **Forbidden**: Over 10,000 words

**Control method**:

Move detailed documentation to `references/` directory:

```markdown
# SKILL.md (core instructions)

## Instructions

To process data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format  # Detailed documentation
3. Process the result

## Bundled Resources

For detailed API documentation, see:
- `references/api-docs.md`  # Not loaded into context, saves tokens
- `references/examples.md`
```

**File size comparison**:

| File | Size Limit | Loaded into Context? |
|--- | --- | ---|
| `SKILL.md` | < 5,000 words | ✅ Yes |
| `references/` | Unlimited | ❌ No (loaded on demand) |
| `scripts/` | Unlimited | ❌ No (executable) |
| `assets/` | Unlimited | ❌ No (template files) |

### 3. Skill Search Priority

OpenSkills searches for skills in the following priority order (from highest to lowest):

```
1. ./.agent/skills/        # Universal project local
2. ~/.agent/skills/        # Universal global
3. ./.claude/skills/      # Claude Code project local
4. ~/.claude/skills/      # Claude Code global
```

**Deduplication mechanism**:

- Only the first skill with a matching name is returned
- Project-local skills take precedence over global skills

**Example scenario**:

```
Project A:
- .claude/skills/pdf        # Project local version v1.0
- ~/.claude/skills/pdf     # Global version v2.0

# openskills read pdf will load .claude/skills/pdf (v1.0)
```

**Recommendations**:

- Put project-specific requirement skills in project-local
- Put common skills in global
- Use Universal mode in multi-agent environments

## Local Development Best Practices

### 1. Use Symlinks for Iterative Development

**Problem**: After modifying a skill, you need to reinstall it each time, which is inefficient.

**Solution**: Use symbolic links (symlink)

```bash
# 1. Clone skill repository to development directory
git clone git@github.com:your-org/my-skills.git ~/dev/my-skills

# 2. Create skill directory
mkdir -p .claude/skills

# 3. Create symbolic link
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill

# 4. Sync to AGENTS.md
npx openskills sync
```

**Advantages**:

- ✅ Modifications to source files take effect immediately (no reinstall needed)
- ✅ Supports Git-based updates (just pull)
- ✅ Multiple projects can share the same development version of a skill

**Verify symbolic link**:

```bash
# View symbolic link
ls -la .claude/skills/

# Output example:
# my-skill -> /Users/yourname/dev/my-skills/my-skill
```

**Notes**:

- ✅ Symbolic links are recognized by `openskills list`
- ✅ Broken symlinks are automatically skipped (no crashes)
- ⚠️ Windows users need to use Git Bash or WSL (Windows doesn't natively support symlinks)

### 2. Sharing Skills Across Multiple Projects

**Scenario**: Multiple projects need to use the same set of team skills.

**Method 1: Global Installation**

```bash
# Globally install team skills repository
npx openskills install your-org/team-skills --global
```

**Method 2: Symbolic Link to Development Directory**

```bash
# Create symbolic links in each project
ln -s ~/dev/team-skills/my-skill .claude/skills/my-skill
```

**Method 3: Git Submodule**

```bash
# Add skills repository as a submodule
git submodule add git@github.com:your-org/team-skills.git .claude/skills

# Update submodule
git submodule update --init --recursive
```

**Recommended selection**:

| Method | Use Case | Advantages | Disadvantages |
|--- | --- | --- | ---|
| Global installation | All projects share unified skills | Centralized management, easy updates | Cannot customize per project |
| Symbolic link | Local development and testing | Modifications take effect immediately | Need to create links manually |
| Git Submodule | Team collaboration, version control | Version controlled with project | Submodule management is complex |

## Team Collaboration Best Practices

### 1. Skill Version Control

**Best practice**: Independent version control for skills repository

```bash
# Team skills repository structure
team-skills/
├── .git/
├── pdf-editor/
│   └── SKILL.md
├── api-client/
│   └── SKILL.md
└── git-workflow/
    └── SKILL.md
```

**Installation method**:

```bash
# Install skills from team repository
npx openskills install git@github.com:your-org/team-skills.git
```

**Update workflow**:

```bash
# Update all skills
npx openskills update

# Update specific skills
npx openskills update pdf-editor,api-client
```

**Version management recommendations**:

- Use Git Tags to mark stable versions: `v1.0.0`, `v1.1.0`
- Record skill version in AGENTS.md: `<skill name="pdf-editor" version="1.0.0">`
- Use fixed stable versions in CI/CD

### 2. Skill Naming Conventions

**Unified team naming conventions**:

| Skill Type | Naming Pattern | Examples |
|--- | --- | ---|
| General tools | `<tool-name>` | `pdf`, `git`, `docker` |
|--- | --- | ---|
| Workflows | `<workflow>` | `ci-cd`, `code-review` |
|--- | --- | ---|

**Examples**:

```bash
# ✅ Unified naming
team-skills/
├── pdf/                     # PDF processing
├── git-workflow/           # Git workflow
├── react-component/        # React component generation
└── team-api/             # Team API client
```

### 3. Skill Documentation Standards

**Unified team documentation structure**:

```markdown
---
name: <skill-name>
description: <1-2 sentences, third person>
author: <team/author>
version: <version number>
---

# <Skill Title>

## When to Use

Load this skill when:
- Scenario 1
- Scenario 2

## Instructions

To accomplish task:

1. Step 1
2. Step 2

## Bundled Resources

For detailed information:
- `references/api-docs.md`
- `scripts/helper.py`
```

**Checklist**:

- [ ] `name` uses hyphenated format
- [ ] `description` is 1-2 sentences in third person
- [ ] Instructions use imperative/infinitive form
- [ ] Include `author` and `version` fields (team standard)
- [ ] Detailed `When to Use` section

## CI/CD Integration Best Practices

### 1. Non-Interactive Installation and Sync

**Scenario**: Automate skill management in CI/CD environments

**Use the `-y` flag to skip interactive prompts**:

```bash
# CI/CD script example
#!/bin/bash

# Install skills (non-interactive)
npx openskills install anthropics/skills -y
npx openskills install git@github.com:your-org/team-skills.git -y

# Sync to AGENTS.md (non-interactive)
npx openskills sync -y
```

**GitHub Actions example**:

```yaml
name: Setup Skills

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install OpenSkills
        run: npx openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Verify Skills
        run: npx openskills list
```

### 2. Skill Update Automation

**Scheduled skill updates**:

```yaml
# .github/workflows/update-skills.yml
name: Update Skills

on:
  schedule:
    - cron: '0 0 * * 0'  # Update every Sunday
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update Skills
        run: npx openskills update -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add AGENTS.md
          git diff --staged --quiet || git commit -m "Update skills"
          git push
```

### 3. Custom Output Path

**Scenario**: Sync skills to a custom file (e.g., `.ruler/AGENTS.md`)

```bash
# Sync to custom file
npx openskills sync -o .ruler/AGENTS.md -y
```

**CI/CD example**:

```yaml
# Generate different AGENTS.md for different AI agents
- name: Sync for Claude Code
  run: npx openskills sync -o AGENTS.md -y

- name: Sync for Cursor
  run: npx openskills sync -o .cursor/AGENTS.md -y

- name: Sync for Windsurf
  run: npx openskills sync -o .windsurf/AGENTS.md -y
```

## Common Issues and Solutions

### Issue 1: Skill Not Found

**Symptoms**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**Troubleshooting steps**:

1. Check if the skill is installed:
   ```bash
   npx openskills list
   ```

2. Check if the skill name is correct (case-sensitive):
   ```bash
   # ❌ Incorrect
   npx openskills read My-Skill

   # ✅ Correct
   npx openskills read my-skill
   ```

3. Check if the skill is being overridden by a higher-priority directory:
   ```bash
   # View skill locations
   ls -la .claude/skills/my-skill
   ls -la ~/.claude/skills/my-skill
   ```

### Issue 2: Symlink Not Accessible

**Symptoms**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**Solutions**:

- **macOS**: Allow symbolic links in System Preferences
- **Windows**: Use Git Bash or WSL (Windows doesn't natively support symlinks)
- **Linux**: Check filesystem permissions

### Issue 3: Skill Update Not Taking Effect

**Symptoms**:

```bash
npx openskills update
# ✅ Skills updated successfully

npx openskills read my-skill
# Content is still old version
```

**Cause**: AI agent has cached the old skill content.

**Solutions**:

1. Re-sync AGENTS.md:
   ```bash
   npx openskills sync
   ```

2. Check skill file timestamp:
   ```bash
   ls -la .claude/skills/my-skill/SKILL.md
   ```

3. If using a symlink, reload the skill:
   ```bash
   npx openskills read my-skill
   ```

## Lesson Summary

OpenSkills best practices core points:

### Project Configuration

- ✅ Project local installation: Skills specific to a project
- ✅ Global installation: Skills common to all projects
- ✅ Universal mode: Share skills in multi-agent environments
- ✅ Prefer `npx` over global installation

### Skill Management

- ✅ SKILL.md writing standards: Hyphenated naming, third-person descriptions, imperative instructions
- ✅ File size control: SKILL.md < 5,000 words, detailed docs in `references/`
- ✅ Skill search priority: Understand the priority and deduplication of 4 directories

### Local Development

- ✅ Use symlinks for iterative development
- ✅ Multi-project skill sharing: Global installation, symlinks, Git Submodule

### Team Collaboration

- ✅ Skill version control: Independent repositories, Git Tags
- ✅ Unified naming conventions: Tools, frameworks, workflows
- ✅ Unified documentation standards: author, version, When to Use

### CI/CD Integration

- ✅ Non-interactive installation and sync: `-y` flag
- ✅ Automation updates: Scheduled tasks, workflow_dispatch
- ✅ Custom output path: `-o` flag

## Up Next

> In the next lesson, we'll learn **[FAQ](../faq/faq/)**.
>
> You will learn:
> - Quick answers to common OpenSkills questions
> - Troubleshooting for installation failures, skills not loading, etc.
> - Configuration tips for coexistence with Claude Code

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Skill search priority | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| Skill deduplication mechanism | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 42-43, 57 |
| Symbolic link handling | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 10-25 |
| YAML field extraction | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| Path traversal protection | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 71-78 |
| Non-interactive installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 424 |
| Custom output path | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 19-36 |

**Key constants**:
- 4 skill search directories: `./.agent/skills/`, `~/.agent/skills/`, `./.claude/skills/`, `~/.claude/skills/`

**Key functions**:
- `getSearchDirs(): string[]` - Returns skill search directories sorted by priority
- `isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean` - Check if directory or symlink points to directory
- `extractYamlField(content: string, field: string): string` - Extract YAML field value (non-greedy match)
- `isPathInside(path: string, targetDir: string): boolean` - Verify path is within target directory (prevents path traversal)

**Example skill files**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Minimal structure example
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Format specification reference

</details>
