---
title: "CI/CD Integration: Automated Skill Setup | OpenSkills"
sidebarTitle: "CI/CD Integration"
subtitle: "CI/CD Integration: Non-interactive Skills in Automated Workflows"
description: "Learn OpenSkills CI/CD integration with -y/--yes flag for non-interactive skill installation. Covers GitHub Actions, Docker, and automated workflows."
tags:
  - "Advanced"
  - "CI/CD"
  - "Automation"
  - "Deployment"
prerequisite:
  - "start-first-skill"
  - "start-sync-to-agents"
  - "platforms-cli-commands"
order: 6
---

# CI/CD Integration

## What You'll Learn

- Understand why CI/CD environments need non-interactive mode
- Master the use of `--yes/-y` flag in `install` and `sync` commands
- Learn how to integrate OpenSkills in CI platforms like GitHub Actions, GitLab CI, etc.
- Understand automated skill installation workflows in Docker containers
- Master skill update and sync strategies in CI/CD environments
- Avoid failures caused by interactive prompts in CI/CD workflows

::: info Prerequisites

This tutorial assumes you already understand [Installing Your First Skill](../../start/first-skill/) and [Sync Skills to AGENTS.md](../../start/sync-to-agents/), as well as basic [Command Details](../../platforms/cli-commands/).

:::

---

## Your Current Challenge

You may already be familiar with using OpenSkills in your local environment, but you've encountered issues in CI/CD environments:

- **Interactive prompts cause failures**: Selection dialogs appear during CI workflows, preventing execution
- **Need to install skills during automated deployment**: Each build requires reinstalling skills but cannot auto-confirm
- **Multi-environment configuration not synced**: Skill configurations differ across development, testing, and production environments
- **AGENTS.md generation not automated**: Need to manually run sync command after each deployment
- **Missing skills in Docker image builds**: Skills need to be manually installed after container startup

Actually, OpenSkills provides the `--yes/-y` flag specifically for non-interactive environments, allowing you to automate all operations in CI/CD workflows.

---

## When to Use This Approach

**Applicable Scenarios for CI/CD Integration**:

| Scenario | Non-interactive Mode Needed? | Example |
| -------- | --------------------------- | ------- |
| **GitHub Actions** | ✅ Yes | Automatically install skills on every PR or push |
| **GitLab CI** | ✅ Yes | Automatically sync AGENTS.md on merge requests |
| **Docker Build** | ✅ Yes | Automatically install skills to container during image build |
| **Jenkins Pipeline** | ✅ Yes | Automatically update skills during continuous integration |
| **Development Environment Initialization Script** | ✅ Yes | One-click environment setup for new developers |
| **Production Deployment** | ✅ Yes | Automatically sync latest skills during deployment |

::: tip Recommended Practice

- **Use interactive mode for local development**: Manually select which skills to install when working locally
- **Use non-interactive mode for CI/CD**: Must use `-y` flag to skip all prompts in automated workflows
- **Environment separation strategy**: Use different skill sources for different environments (e.g., private repositories)

:::

---

## Core Concept: Non-interactive Mode

Both the `install` and `sync` commands in OpenSkills support the `--yes/-y` flag, used to skip all interactive prompts:

**Non-interactive behavior of the install command** (source `install.ts:424-427`):

```typescript
// Interactive selection (unless -y flag or single skill)
let skillsToInstall = skillInfos;

if (!options.yes && skillInfos.length > 1) {
  // Enter interactive selection flow
  // ...
}
```

**Non-interactive mode characteristics**:

1. **Skip skill selection**: Install all found skills
2. **Auto-overwrite**: Directly overwrite when encountering existing skills (displays `Overwriting: <skill-name>`)
3. **Skip conflict confirmation**: Don't ask whether to overwrite, execute directly
4. **Compatible with headless environments**: Works normally in CI environments without TTY

**Behavior of the warnIfConflict function** (source `install.ts:524-527`):

```typescript
if (skipPrompt) {
  // Auto-overwrite in non-interactive mode
  console.log(chalk.dim(`Overwriting: ${skillName}`));
  return true;
}
```

::: important Important Concept

**Non-interactive Mode**: Use the `--yes/-y` flag to skip all interactive prompts, allowing commands to execute automatically in CI/CD, scripts, and non-TTY environments without relying on user input.

:::

---

## Follow Along

### Step 1: Experience Non-interactive Installation

**Why**
First experience non-interactive mode behavior locally to understand how it differs from interactive mode.

Open your terminal and execute:

```bash
# Non-interactive installation (install all found skills)
npx openskills install anthropics/skills --yes

# Or use shorthand
npx openskills install anthropics/skills -y
```

**What you should see**:

```
Cloning into '/tmp/openskills-temp-...'...
...
Found 3 skill(s)

Overwriting: codebase-reviewer
Overwriting: file-writer
Overwriting: git-helper

✅ Installed 3 skill(s)

Next: Run 'openskills sync' to generate AGENTS.md
```

**Explanation**:
- After using the `-y` flag, the skill selection interface is skipped
- All found skills are automatically installed
- If a skill already exists, `Overwriting: <skill-name>` is displayed and it's directly overwritten
- No confirmation dialogs appear

---

### Step 2: Compare Interactive vs Non-interactive

**Why**
By comparing, you'll more clearly understand the differences between the two modes and their applicable scenarios.

Execute the following commands to compare the two modes:

```bash
# Clear existing skills (for testing)
rm -rf .claude/skills

# Interactive installation (will show selection interface)
echo "=== Interactive Installation ==="
npx openskills install anthropics/skills

# Clear existing skills
rm -rf .claude/skills

# Non-interactive installation (auto-install all skills)
echo "=== Non-interactive Installation ==="
npx openskills install anthropics/skills -y
```

**What you should see**:

**Interactive Mode**:
- Shows skill list, lets you check with space
- Requires pressing Enter to confirm
- Can selectively install some skills

**Non-interactive Mode**:
- Directly displays installation process
- Automatically installs all skills
- Doesn't require any user input

**Comparison Table**:

| Feature | Interactive Mode (Default) | Non-interactive Mode (-y) |
| ------- | ------------------------- | -------------------------- |
| **Skill Selection** | Shows selection interface, manual check | Auto-install all found skills |
| **Overwrite Confirmation** | Asks whether to overwrite existing skills | Auto-overwrite, shows prompt |
| **TTY Requirement** | Requires interactive terminal | Not needed, can run in CI environment |
| **Applicable Scenarios** | Local development, manual operations | CI/CD, scripts, automated workflows |
| **Input Requirement** | Requires user input | Zero input, automatic execution |

---

### Step 3: Non-interactive AGENTS.md Sync

**Why**
Learn how to generate AGENTS.md in automated workflows so AI agents always use the latest skill list.

Execute:

```bash
# Non-interactive sync (sync all skills to AGENTS.md)
npx openskills sync -y

# View generated AGENTS.md
cat AGENTS.md | head -20
```

**What you should see**:

```
✅ Synced 3 skill(s) to AGENTS.md
```

AGENTS.md content:

```xml
<skills_system>
This project uses the OpenSkills system for AI agent extensibility.

Usage:
- Ask the AI agent to load specific skills using: "Use the <skill-name> skill"
- The agent will read the skill definition from .claude/skills/<skill-name>/SKILL.md
- Skills provide specialized capabilities like code review, file writing, etc.
</skills_system>

<available_skills>
  <skill name="codebase-reviewer">
    <description>Review code changes for issues...</description>
  </skill>
  <skill name="file-writer">
    <description>Write files with format...</description>
  </skill>
  <skill name="git-helper">
    <description>Git operations and utilities...</description>
  </skill>
</available_skills>
```

**Explanation**:
- The `-y` flag skips the skill selection interface
- All installed skills are synced to AGENTS.md
- No confirmation dialogs appear

---

### Step 4: GitHub Actions Integration

**Why**
Integrate OpenSkills in actual CI/CD workflows to achieve automated skill management.

Create a `.github/workflows/setup-skills.yml` file in your project:

```yaml
name: Setup Skills

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills (non-interactive)
        run: openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: openskills sync -y

      - name: Verify AGENTS.md
        run: |
          echo "=== AGENTS.md generated ==="
          cat AGENTS.md

      - name: Upload AGENTS.md as artifact
        uses: actions/upload-artifact@v4
        with:
          name: agents-md
          path: AGENTS.md
```

Commit and push to GitHub:

```bash
git add .github/workflows/setup-skills.yml
git commit -m "Add GitHub Actions workflow for OpenSkills"
git push
```

**What you should see**: GitHub Actions runs automatically, successfully installing skills and generating AGENTS.md.

**Explanation**:
- Automatically triggers on every push or PR
- Uses `openskills install anthropics/skills -y` for non-interactive skill installation
- Uses `openskills sync -y` for non-interactive AGENTS.md sync
- Saves AGENTS.md as an artifact for debugging

---

### Step 5: Using Private Repositories

**Why**
In enterprise environments, skills are often hosted in private repositories and need SSH access in CI/CD.

Configure SSH in GitHub Actions:

```yaml
name: Setup Skills from Private Repo

on:
  push:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH key
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills from private repo
        run: openskills install git@github.com:your-org/private-skills.git -y

      - name: Sync to AGENTS.md
        run: openskills sync -y
```

Add `SSH_PRIVATE_KEY` in the GitHub repository's **Settings → Secrets and variables → Actions**.

**What you should see**: GitHub Actions successfully installs skills from the private repository.

**Explanation**:
- Use Secrets to store private keys, avoiding leaks
- Configure SSH access to private repositories
- `openskills install git@github.com:your-org/private-skills.git -y` supports installation from private repositories

---

### Step 6: Docker Scenario Integration

**Why**
Automatically install skills during Docker image build to ensure they're immediately available after container startup.

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install OpenSkills
RUN npm install -g openskills

# Install skills (non-interactive)
RUN openskills install anthropics/skills -y

# Sync AGENTS.md
RUN openskills sync -y

# Copy application code
COPY . .

# Other build steps...
RUN npm install
RUN npm run build

# Start command
CMD ["node", "dist/index.js"]
```

Build and run:

```bash
# Build Docker image
docker build -t myapp:latest .

# Run container
docker run -it --rm myapp:latest sh

# Verify skills are installed in container
ls -la .claude/skills/
cat AGENTS.md
```

**What you should see**: Skills are already installed in the container and AGENTS.md is generated.

**Explanation**:
- Install skills during the Docker image build phase
- Use `RUN openskills install ... -y` for non-interactive installation
- No need to manually install skills after container startup
- Suitable for microservices, serverless, and other scenarios

---

### Step 7: Environment Variable Configuration

**Why**
Flexibly configure skill sources through environment variables, using different skill repositories for different environments.

Create a `.env.ci` file:

```bash
# CI/CD environment configuration
SKILLS_SOURCE=anthropics/skills
SKILLS_INSTALL_FLAGS=-y
SYNC_FLAGS=-y
```

Use in CI/CD scripts:

```bash
#!/bin/bash
# .github/scripts/setup-skills.sh

set -e

# Load environment variables
if [ -f .env.ci ]; then
  export $(cat .env.ci | grep -v '^#' | xargs)
fi

echo "Installing skills from: $SKILLS_SOURCE"
npx openskills install $SKILLS_SOURCE $SKILLS_INSTALL_FLAGS

echo "Syncing to AGENTS.md"
npx openskills sync $SYNC_FLAGS

echo "✅ Skills setup completed"
```

Call in GitHub Actions:

```yaml
- name: Setup skills
  run: .github/scripts/setup-skills.sh
```

**What you should see**: Script automatically configures skill source and flags based on environment variables.

**Explanation**:
- Flexibly configure skill sources through environment variables
- Different environments (development, testing, production) can use different `.env` files
- Maintain CI/CD configuration maintainability

---

## Checkpoint ✅

Complete the following checks to confirm you've mastered this lesson:

- [ ] Understand the purpose and characteristics of non-interactive mode
- [ ] Able to use `-y` flag for non-interactive installation
- [ ] Able to use `-y` flag for non-interactive sync
- [ ] Understand the difference between interactive and non-interactive modes
- [ ] Able to integrate OpenSkills in GitHub Actions
- [ ] Able to install skills during Docker image build
- [ ] Know how to handle private repositories in CI/CD
- [ ] Understand environment variable configuration best practices

---

## Common Pitfalls

### Common Error 1: Forgetting to Add -y Flag

**Error Scenario**: Forgetting to use `-y` flag in GitHub Actions

```yaml
# ❌ Wrong: Forgot -y flag
- name: Install skills
  run: openskills install anthropics/skills
```

**Problem**:
- CI environment has no interactive terminal (TTY)
- Command waits for user input, causing workflow timeout failure
- Error message may not be obvious

**Correct Approach**:

```yaml
# ✅ Correct: Use -y flag
- name: Install skills
  run: openskills install anthropics/skills -y
```

---

### Common Error 2: Skill Overwrite Causes Configuration Loss

**Error Scenario**: CI/CD always overwrites skills, causing local configuration loss

```bash
# Install skills to global directory in CI/CD
openskills install anthropics/skills --global -y

# Local user installs to project directory, gets overwritten by global
```

**Problem**:
- Globally installed skills have lower priority than project-local
- CI/CD and local installation locations differ, causing confusion
- May overwrite skills carefully configured by local users

**Correct Approach**:

```bash
# Solution 1: Both CI/CD and local use project installation
openskills install anthropics/skills -y

# Solution 2: Use Universal mode to avoid conflicts
openskills install anthropics/skills --universal -y

# Solution 3: CI/CD uses dedicated directory (via custom output path)
openskills install anthropics/skills -y
openskills sync -o .agents-md/AGENTS.md -y
```

---

### Common Error 3: Insufficient Git Access Permissions

**Error Scenario**: Installing skills from private repository without configuring SSH key

```yaml
# ❌ Wrong: SSH key not configured
- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

**Problem**:
- CI environment cannot access private repository
- Error message: `Permission denied (publickey)`
- Clone fails, workflow fails

**Correct Approach**:

```yaml
# ✅ Correct: Configure SSH key
- name: Setup SSH key
  env:
    SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts

- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

---

### Common Error 4: Docker Image Too Large

**Error Scenario**: Installing skills in Dockerfile causes excessive image size

```dockerfile
# ❌ Wrong: Re-clone and install every time
RUN openskills install anthropics/skills -y
```

**Problem**:
- Clones repository from GitHub on every build
- Increases build time and image size
- Network issues may cause failure

**Correct Approach**:

```dockerfile
# ✅ Correct: Use multi-stage build and caching
FROM node:20-alpine AS skills-builder

RUN npm install -g openskills
RUN openskills install anthropics/skills -y
RUN openskills sync -y

# Main image
FROM node:20-alpine

WORKDIR /app

# Copy installed skills
COPY --from=skills-builder ~/.claude /root/.claude
COPY --from=skills-builder /app/AGENTS.md /app/

# Copy application code
COPY . .

# Other build steps...
```

---

### Common Error 5: Forgetting to Update Skills

**Error Scenario**: CI/CD always installs old version of skills

```yaml
# ❌ Wrong: Install only, don't update
- name: Install skills
  run: openskills install anthropics/skills -y
```

**Problem**:
- Skill repository may have been updated
- Skills installed by CI/CD are not the latest version
- May cause missing features or bugs

**Correct Approach**:

```yaml
# ✅ Correct: Update then sync
- name: Update skills
  run: openskills update -y

- name: Sync to AGENTS.md
  run: openskills sync -y

# Or use update strategy during install
- name: Install or update skills
  run: |
    openskills install anthropics/skills -y || openskills update -y
```

---

## Lesson Summary

**Key Points**:

1. **Non-interactive mode applies to CI/CD**: Use `-y` flag to skip all interactive prompts
2. **-y flag for install command**: Automatically install all found skills, overwrite existing skills
3. **-y flag for sync command**: Automatically sync all skills to AGENTS.md
4. **GitHub Actions integration**: Use non-interactive commands in workflows for automated skill management
5. **Docker scenarios**: Install skills during image build phase to ensure immediate availability after container startup
6. **Private repository access**: Configure access to private skill repositories via SSH keys
7. **Environment variable configuration**: Flexibly configure skill sources and installation parameters via environment variables

**Decision Flow**:

```
[Need to use OpenSkills in CI/CD] → [Install skills]
                                     ↓
                             [Use -y flag to skip interaction]
                                     ↓
                             [Generate AGENTS.md]
                                     ↓
                             [Use -y flag to skip interaction]
                                     ↓
                             [Verify skills correctly installed]
```

**Memory Tips**:

- **CI/CD Remember -y**: Non-interactive is key
- **GitHub Actions Use SSH**: Private repos need key config
- **Docker Build Early**: Watch image size
- **Environment Variables Config Well**: Differentiate environments

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Security Notes](../security/)**.
>
> You'll learn:
> - OpenSkills security features and protection mechanisms
> - How path traversal protection works
> - Safe handling of symbolic links
> - YAML parsing security measures
> - Permission management best practices

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Feature              | File Path                                                                                                    | Lines   |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | -------- |
| Non-interactive installation      | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L424-L455) | 424-455 |
| Conflict detection and overwrite    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L521-L550) | 521-550 |
| Non-interactive sync      | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93)   | 46-93   |
| Command line parameter definition    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L49)                          | 49      |
| Command line parameter definition    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L65)                          | 65      |

**Key Constants**:
- `-y, --yes`: Command line flag to skip interactive selection

**Key Functions**:
- `warnIfConflict(skillName, targetPath, isProject, skipPrompt)`: Detect skill conflicts and decide whether to overwrite
- `installFromRepo()`: Install skills from repository (supports non-interactive mode)
- `syncAgentsMd()`: Sync skills to AGENTS.md (supports non-interactive mode)

**Business Rules**:
- When using `-y` flag, skip all interactive prompts
- When skill exists, non-interactive mode automatically overwrites (displays `Overwriting: <skill-name>`)
- Non-interactive mode works normally in headless environments (without TTY)
- Both `install` and `sync` commands support `-y` flag

</details>
