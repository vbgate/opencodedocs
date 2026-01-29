---
title: "Install Sources: GitHub, Local, Private Git | OpenSkills"
sidebarTitle: "Install Sources"
subtitle: "Install Sources: GitHub, Local, Private Git | OpenSkills"
description: "Learn three OpenSkills skill installation methods: GitHub repository, local path, and private Git. Covers SSH/HTTPS authentication and troubleshooting."
tags:
  - "Platform Integration"
  - "Skill Management"
  - "Installation Configuration"
prerequisite:
  - "start-first-skill"
order: 2
---

# Skill Installation Sources

## What You'll Learn

After completing this lesson, you will be able to:

- Install skills using three methods: GitHub repository, local path, and private Git repository
- Choose the most appropriate installation source based on your scenario
- Understand the pros, cons, and considerations of different sources
- Master GitHub shorthand, relative paths, private repository URLs, and other formats

::: info Prerequisites

This tutorial assumes you have completed [Install Your First Skill](../../start/first-skill/), and understand the basic installation process.

:::

---

## Your Current Challenges

You may have already learned how to install skills from the official repository, but:

- **Is GitHub the only option?**: You want to use your company's internal GitLab repository, but don't know how to configure it
- **How to install locally developed skills?**: You're developing your own skill and want to test it on your machine first
- **Want to specify a specific skill directly**: The repository has many skills, and you don't want to select them through the interactive interface every time
- **How to access private repositories?**: Your company's skill repository is private, and you don't know how to authenticate

In fact, OpenSkills supports multiple installation sources. Let's explore them one by one.

---

## When to Use This Approach

**Use cases for different installation sources**:

| Installation Source | Use Cases | Example |
| ------------------- | --------- | ------- |
| **GitHub Repository** | Using open source community skills | `openskills install anthropics/skills` |
| **Local Path** | Developing and testing your own skills | `openskills install ./my-skill` |
| **Private Git Repository** | Using company internal skills | `openskills install git@github.com:my-org/private-skills.git` |

::: tip Recommended Practice

- **Open source skills**: Prioritize installing from GitHub repositories for easy updates
- **Development phase**: Install from local paths for real-time testing of modifications
- **Team collaboration**: Use private Git repositories for unified management of internal skills

:::

---

## Core Concept: Three Sources, One Mechanism

Although installation sources vary, OpenSkills' underlying mechanism is the same:

```
[Identify source type] → [Retrieve skill files] → [Copy to .claude/skills/]
```

**Source identification logic** (source code `install.ts:25-45`):

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**Priority judgment**:
1. First check if it's a local path (`isLocalPath`)
2. Then check if it's a Git URL (`isGitUrl`)
3. Finally handle as GitHub shorthand (`owner/repo`)

---

## Follow Along

### Method 1: Install from GitHub Repository

**Use cases**: Installing open source community skills, such as Anthropic official repository, third-party skill packages.

#### Basic Usage: Install Entire Repository

```bash
npx openskills install owner/repo
```

**Example**: Install skills from Anthropic official repository

```bash
npx openskills install anthropics/skills
```

**You should see**:

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### Advanced Usage: Specify Subpath (Install Specific Skill Directly)

If the repository contains many skills, you can directly specify the skill subpath you want to install, skipping interactive selection:

```bash
npx openskills install owner/repo/skill-name
```

**Example**: Directly install PDF processing skill

```bash
npx openskills install anthropics/skills/pdf
```

**You should see**:

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
   Location: /path/to/project/.claude/skills/pdf
```

::: tip Recommended Practice

When you only need one skill from a repository, using the subpath format allows you to skip interactive selection, making it faster.

:::

#### GitHub Shorthand Rules (source code `install.ts:131-143`)

| Format | Example | Conversion Result |
| ------ | ------- | ----------------- |
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |
| `owner/repo/skill-name` | `my-org/skills/web-scraper` | URL: `https://github.com/my-org/skills` + subpath: `web-scraper` |

---

### Method 2: Install from Local Path

**Use cases**: You're developing your own skill and want to test it locally before publishing to GitHub.

#### Using Absolute Path

```bash
npx openskills install /absolute/path/to/skill
```

**Example**: Install from a skills directory in your home directory

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### Using Relative Path

```bash
npx openskills install ./local-skills/my-skill
```

**Example**: Install from the `local-skills/` subdirectory in the project directory

```bash
npx openskills install ./local-skills/web-scraper
```

**You should see**:

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
   Location: /path/to/project/.claude/skills/web-scraper
```

::: warning Note

Installing from a local path copies skill files to `.claude/skills/`. Subsequent modifications to the source files will not automatically sync. You need to reinstall to update.

:::

#### Installing Local Directory Containing Multiple Skills

If your local directory structure looks like this:

```
local-skills/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

You can install the entire directory directly:

```bash
npx openskills install ./local-skills
```

This will launch an interactive selection interface, allowing you to choose which skills to install.

#### Local Path Supported Formats (source code `install.ts:25-32`)

| Format | Description | Example |
| ------ | ----------- | ------- |
| `/absolute/path` | Absolute path | `/home/user/skills/my-skill` |
| `./relative/path` | Relative path to current directory | `./local-skills/my-skill` |
| `../relative/path` | Relative path to parent directory | `../shared-skills/common` |
| `~/path` | Relative path to home directory | `~/dev/my-skills` |

::: tip Development Tip

Using the `~` shorthand allows you to quickly reference skills in your home directory, making it suitable for personal development environments.

:::

---

### Method 3: Install from Private Git Repository

**Use cases**: Using company internal GitLab/Bitbucket repositories, or private GitHub repositories.

#### SSH Method (Recommended)

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**Example**: Install from GitHub private repository

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**You should see**:

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip Authentication Configuration

SSH method requires you to have configured SSH keys. If cloning fails, please check:

```bash
# Test SSH connection
ssh -T git@github.com

# If you see "Hi username! You've successfully authenticated...", the configuration is correct
```

:::

#### HTTPS Method (Requires Credentials)

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning HTTPS Authentication

When cloning a private repository via HTTPS, Git will prompt you for a username and password (or Personal Access Token). If you're using two-factor authentication, you need to use a Personal Access Token instead of your account password.

:::

#### Other Git Hosting Platforms

**GitLab (SSH)**:

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab (HTTPS)**:

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket (SSH)**:

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket (HTTPS)**:

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip Recommended Practice

For internal team skills, it's recommended to use private Git repositories, as this:
- All members can install from the same source
- Skills can be updated with just `openskills update`
- Facilitates version management and access control

:::

#### Git URL Recognition Rules (source code `install.ts:37-45`)

| Prefix/Suffix | Description | Example |
| ------------- | ----------- | ------- |
| `git@` | SSH protocol | `git@github.com:owner/repo.git` |
| `git://` | Git protocol | `git://github.com/owner/repo.git` |
| `http://` | HTTP protocol | `http://github.com/owner/repo.git` |
| `https://` | HTTPS protocol | `https://github.com/owner/repo.git` |
| `.git` suffix | Git repository (any protocol) | `owner/repo.git` |

---

## Checkpoint ✅

After completing this lesson, please confirm:

- [ ] Know how to install skills from GitHub repository (`owner/repo` format)
- [ ] Know how to directly install a specific skill from a repository (`owner/repo/skill-name`)
- [ ] Know how to install skills using local paths (`./`, `~/`, etc.)
- [ ] Know how to install skills from private Git repository (SSH/HTTPS)
- [ ] Understand the use cases for different installation sources

---

## Common Pitfalls

### Issue 1: Local Path Does Not Exist

**Symptom**:

```
Error: Path does not exist: ./local-skills/my-skill
```

**Causes**:
- Path spelling error
- Relative path calculation error

**Solutions**:
1. Check if the path exists: `ls ./local-skills/my-skill`
2. Use absolute paths to avoid relative path confusion

---

### Issue 2: Private Repository Clone Failed

**Symptom**:

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**Causes**:
- SSH key not configured
- No repository access permissions
- Repository address error

**Solutions**:
1. Test SSH connection: `ssh -T git@github.com`
2. Confirm you have access permissions to the repository
3. Check if the repository address is correct

::: tip Tip

For private repositories, the tool will display the following prompt (source code `install.ts:167`):

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### Issue 3: SKILL.md Not Found in Subpath

**Symptom**:

```
Error: SKILL.md not found at skills/my-skill
```

**Causes**:
- Incorrect subpath
- Repository directory structure differs from your expectations

**Solutions**:
1. First install the entire repository without subpath: `npx openskills install owner/repo`
2. View available skills through the interactive interface
3. Reinstall using the correct subpath

---

### Issue 4: GitHub Shorthand Recognition Error

**Symptom**:

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**Causes**:
- Format does not match any rule
- Spelling error (e.g., spaces in `owner / repo`)

**Solutions**:
- Check if the format is correct (no spaces, correct number of slashes)
- Use the full Git URL instead of shorthand

---

## Lesson Summary

Through this lesson, you have learned:

- **Three installation sources**: GitHub repository, local path, and private Git repository
- **GitHub shorthand**: Two formats: `owner/repo` and `owner/repo/skill-name`
- **Local path formats**: Absolute path, relative path, home directory shorthand
- **Private repository installation**: SSH and HTTPS methods, different platform syntaxes
- **Source identification logic**: How the tool determines the type of installation source you provide

**Quick Reference for Core Commands**:

| Command | Purpose |
| ------- | ------- |
| `npx openskills install owner/repo` | Install from GitHub repository (interactive selection) |
| `npx openskills install owner/repo/skill-name` | Directly install a specific skill from a repository |
| `npx openskills install ./local-skills/skill` | Install from local path |
| `npx openskills install ~/dev/my-skills` | Install from home directory |
| `npx openskills install git@github.com:owner/private-skills.git` | Install from private Git repository |

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Global vs Project-Local Installation](../global-vs-project/)**.
>
> You'll learn:
> - The purpose and installation location of the `--global` flag
> - The difference between global and project-local installation
> - Choosing the appropriate installation location based on scenarios
> - Best practices for sharing skills across multiple projects

Installation sources are only part of skill management. Next, you need to understand how the installation location affects your project.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function | File Path | Line Numbers |
| -------- | --------- | ------------ |
| Install command entry | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| Local path detection | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Git URL detection | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| GitHub shorthand parsing | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| Local path installation | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Git repository cloning | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| Private repository error prompt | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**Key Functions**:
- `isLocalPath(source)` - Detect if it's a local path (lines 25-32)
- `isGitUrl(source)` - Detect if it's a Git URL (lines 37-45)
- `installFromLocal()` - Install skills from local path (lines 199-226)
- `installSpecificSkill()` - Install a specific skill with subpath (lines 272-316)
- `getRepoName()` - Extract repository name from Git URL (lines 50-56)

**Key Logic**:
1. Source type detection priority: Local path → Git URL → GitHub shorthand (lines 111-143)
2. GitHub shorthand supports two formats: `owner/repo` and `owner/repo/skill-name` (lines 132-142)
3. Prompt to configure SSH keys or credentials when private repository clone fails (line 167)

</details>
