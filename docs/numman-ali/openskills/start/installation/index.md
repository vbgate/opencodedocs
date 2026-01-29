---
title: "Installation: Set Up OpenSkills Environment | OpenSkills"
sidebarTitle: "Installation"
subtitle: "Installation: Set Up OpenSkills Environment"
description: "Learn to install OpenSkills with Node.js 20.6+ and Git. Covers npx and global installation methods, environment verification, and troubleshooting common issues."
tags:
  - "Installation"
  - "Environment Setup"
  - "Node.js"
  - "Git"
prerequisite:
  - "Basic terminal operations"
duration: 3
order: 3
---

# Install OpenSkills Tools

## What You'll Learn

After completing this lesson, you will be able to:

- Check and configure Node.js and Git environments
- Use OpenSkills via `npx` or global installation
- Verify OpenSkills is correctly installed and available
- Troubleshoot common installation issues (version mismatches, network problems, etc.)

## Your Current Situation

You might be facing these challenges:

- **Uncertain environment requirements**: Not sure which versions of Node.js and Git are needed
- **Unsure how to install**: OpenSkills is an npm package, but unclear whether to use npx or global installation
- **Installation failures**: Encountering version incompatibility or network issues
- **Permission issues**: Getting EACCES errors during global installation

This lesson helps you solve these problems step by step.

## When to Use This Approach

Use this guide when you need to:

- Use OpenSkills for the first time
- Update to a new version
- Set up a development environment on a new machine
- Troubleshoot installation-related issues

## 🎒 Prerequisites

::: tip System Requirements

OpenSkills has minimum system requirements. Not meeting these requirements will cause installation failures or runtime issues.

:::

::: warning Pre-Installation Check

Before starting, confirm you have the following software installed:

1. **Node.js 20.6 or higher**
2. **Git** (used to clone skills from repositories)

:::

## Core Concepts

OpenSkills is a Node.js CLI tool with two usage methods:

| Method | Command | Pros | Cons | Use Cases |
|--- | --- | --- | --- | ---|
| **npx** | `npx openskills` | No installation, always uses latest version | Downloads each run (cached) | Occasional use, testing new versions |
| **Global Install** | `openskills` | Shorter command, faster response | Requires manual updates | Frequent use, fixed version |

**Recommended to use npx**, unless you use OpenSkills very frequently.

---

## Follow Along

### Step 1: Check Node.js Version

First, check if Node.js is installed and meets version requirements:

```bash
node --version
```

**Why**

OpenSkills requires Node.js 20.6 or higher. Lower versions will cause runtime errors.

**You should see**:

```bash
v20.6.0
```

Or a higher version (such as `v22.0.0`).

::: danger Version Too Low

If you see `v18.x.x` or lower (such as `v16.x.x`), you need to upgrade Node.js.

:::

**If version is too low**:

Recommended to use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to install and manage Node.js:

::: code-group

```bash [macOS/Linux]
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload terminal configuration
source ~/.bashrc  # or source ~/.zshrc

# Install Node.js 20 LTS
nvm install 20
nvm use 20

# Verify version
node --version
```

```powershell [Windows]
# Download and install nvm-windows
# Visit: https://github.com/coreybutler/nvm-windows/releases

# After installation, run in PowerShell:
nvm install 20
nvm use 20

# Verify version
node --version
```

:::

**You should see** (after upgrade):

```bash
v20.6.0
```

---

### Step 2: Check Git Installation

OpenSkills needs Git to clone skill repositories:

```bash
git --version
```

**Why**

When installing skills from GitHub, OpenSkills uses the `git clone` command to download repositories.

**You should see**:

```bash
git version 2.40.0
```

(Version number may vary, any output is fine)

::: danger Git Not Installed

If you see `command not found: git` or a similar error, you need to install Git.

:::

**If Git is not installed**:

::: code-group

```bash [macOS]
# macOS typically has Git pre-installed. If not, use Homebrew:
brew install git
```

```powershell [Windows]
# Download and install Git for Windows
# Visit: https://git-scm.com/download/win
```

```bash [Linux (Ubuntu/Debian)]
sudo apt update
sudo apt install git
```

```bash [Linux (CentOS/RHEL)]
sudo yum install git
```

:::

After installation, re-run `git --version` to verify.

---

### Step 3: Verify Environment

Now verify both Node.js and Git are available:

```bash
node --version && git --version
```

**You should see**:

```bash
v20.6.0
git version 2.40.0
```

If both commands output successfully, the environment is configured correctly.

---

### Step 4: Use npx Method (Recommended)

OpenSkills recommends using `npx` to run directly without additional installation:

```bash
npx openskills --version
```

**Why**

`npx` automatically downloads and runs the latest version of OpenSkills, no manual installation or update needed. On the first run, it downloads the package to a local cache. Subsequent runs use the cache, so it's very fast.

**You should see**:

```bash
1.5.0
```

(Version number may vary)

::: tip How npx Works

`npx` (Node Package eXecute) is a built-in tool with npm 5.2.0+:
- First run: Downloads package from npm to a temporary directory
- Subsequent runs: Uses cache (expires after 24 hours by default)
- Updates: Automatically downloads the latest version when cache expires

:::

**Test installation command**:

```bash
npx openskills list
```

**You should see**:

```bash
Installed Skills:

No skills installed. Run: npx openskills install <source>
```

Or a list of installed skills.

---

### Step 5: (Optional) Global Installation

If you use OpenSkills frequently, you can choose to install it globally:

```bash
npm install -g openskills
```

**Why**

After global installation, you can use the `openskills` command directly, no need to type `npx` each time, with faster response.

**You should see**:

```bash
added 4 packages in 3s
```

(Output may vary)

::: warning Permission Issues

If you encounter an `EACCES` error during global installation, it means you don't have write permission for the global directory.

**Solution**:

```bash
# Method 1: Use sudo (macOS/Linux)
sudo npm install -g openskills

# Method 2: Fix npm permissions (recommended)
# Check global installation directory
npm config get prefix

# Set correct permissions (replace /usr/local with actual path)
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin
```

:::

**Verify global installation**:

```bash
openskills --version
```

**You should see**:

```bash
1.5.0
```

::: tip Updating Global Installation

If you want to update the globally installed OpenSkills:

```bash
npm update -g openskills
```

:::

---

## Checklist ✅

After completing the above steps, confirm:

- [ ] Node.js version is 20.6 or higher (`node --version`)
- [ ] Git is installed (`git --version`)
- [ ] `npx openskills --version` or `openskills --version` outputs the correct version number
- [ ] `npx openskills list` or `openskills list` runs normally

If all checks pass, congratulations! OpenSkills is successfully installed.

---

## Common Pitfalls

### Issue 1: Node.js Version Too Low

**Error message**:

```bash
Error: The module was compiled against a different Node.js version
```

**Cause**: Node.js version is lower than 20.6

**Solution**:

Use nvm to install Node.js 20 or higher:

```bash
nvm install 20
nvm use 20
```

---

### Issue 2: npx Command Not Found

**Error message**:

```bash
command not found: npx
```

**Cause**: npm version is too low (npx requires npm 5.2.0+)

**Solution**:

```bash
# Update npm
npm install -g npm@latest

# Verify version
npx --version
```

---

### Issue 3: Network Timeout or Download Failure

**Error message**:

```bash
Error: network timeout
```

**Cause**: npm repository access is restricted

**Solution**:

```bash
# Use npm mirror (such as Taobao mirror)
npm config set registry https://registry.npmmirror.com

# Retry
npx openskills --version
```

To restore default source:

```bash
npm config set registry https://registry.npmjs.org
```

---

### Issue 4: Global Installation Permission Error

**Error message**:

```bash
Error: EACCES: permission denied
```

**Cause**: No write permission for global installation directory

**Solution**:

Refer to the permission fix method in "Step 5", or use `sudo` (not recommended).

---

### Issue 5: Git Clone Failure

**Error message**:

```bash
Error: git clone failed
```

**Cause**: SSH key not configured or network issues

**Solution**:

```bash
# Test Git connection
git ls-remote https://github.com/numman-ali/openskills.git

# If failed, check network or configure proxy
git config --global http.proxy http://proxy.example.com:8080
```

---

## Summary

In this lesson, we learned:

1. **Environment requirements**: Node.js 20.6+ and Git
2. **Recommended usage method**: `npx openskills` (no installation needed)
3. **Optional global installation**: `npm install -g openskills` (for frequent use)
4. **Environment verification**: Check version numbers and command availability
5. **Common issues**: Version mismatches, permission issues, network problems

You have now completed OpenSkills installation. In the next lesson, we will learn how to install your first skill.

---

## Coming Up Next

> Next, we'll learn **[Install Your First Skill](../first-skill/)**
>
> You will learn:
> - How to install skills from the Anthropic official repository
> - Interactive skill selection techniques
> - Skill directory structure
> - Verify skills are correctly installed

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

### Core Configuration

| Configuration Item | File Path | Line Number |
|--- | --- | ---|
| Node.js version requirement | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 45-47 |
| Package information | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 1-9 |
| CLI entry point | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 39-80 |

### Key Constants

- **Node.js requirement**: `>=20.6.0` (package.json:46)
- **Package name**: `openskills` (package.json:2)
- **Version**: `1.5.0` (package.json:3)
- **CLI command**: `openskills` (package.json:8)

### Dependencies

**Runtime dependencies** (package.json:48-53):
- `@inquirer/prompts`: Interactive selection
- `chalk`: Terminal colored output
- `commander`: CLI argument parsing
- `ora`: Loading animations

**Development dependencies** (package.json:54-59):
- `typescript`: TypeScript compilation
- `vitest`: Unit testing
- `tsup`: Build tool

</details>
