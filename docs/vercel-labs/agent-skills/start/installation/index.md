---
title: "Install Agent Skills: Quick Setup | Agent Skills"
sidebarTitle: "Install"
subtitle: "Install Agent Skills: Quick Setup"
description: "Learn to install Agent Skills to Claude Code and claude.ai. Master npx quick installation, manual skill copy, and network permission configuration. Resolve common issues like inactive skills and deployment errors."
tags:
  - "Installation"
  - "Claude Code"
  - "claude.ai"
  - "Network Permissions"
order: 20
prerequisite:
  - "start-getting-started"
---

# Install Agent Skills

## What You'll Learn

- Quick install Agent Skills with one command (recommended)
- Manually copy skills to Claude Code's local directory
- Enable skills in claude.ai and configure network permissions
- Troubleshoot common installation errors

## Your Current Situation

You want to use Agent Skills to have Claude help you deploy projects and review code, but you don't know how to install them to Claude Code or claude.ai. Or you've tried installing, but the skills aren't activated, and you're getting "Network Egress Error" when deploying.

## When to Use This

- ✓ First time using Agent Skills
- ✓ You use Claude Code (terminal command-line tool)
- ✓ You use claude.ai (web version of Claude)
- ✓ You need skills to access the network (deployment features)

## 🎒 Prerequisites

Before starting, make sure you have:
- [ ] Node.js 20+ installed
- [ ] An active Claude Code or claude.ai account

::: tip Tip
If you haven't learned what Agent Skills is yet, I recommend reading [Getting Started with Agent Skills](../getting-started/) first.
:::

## Core Approach

There are two ways to install Agent Skills:

1. **npx installation (recommended)**: One-click install to Claude Code, automatically completes all steps
2. **Manual installation**: Copy files to a specified directory, suitable for claude.ai or custom installation locations

After installation, skills will automatically activate in Claude—simply trigger a keyword (like "Deploy my app"), and Claude will automatically call the corresponding skill.

## Method 1: npx Quick Installation (Recommended)

This is the simplest installation method, suitable for Claude Code users.

### Step 1: Run the Installation Command

Execute in your terminal:

```bash
npx add-skill vercel-labs/agent-skills
```

**Why**
`add-skill` is an npm package that automatically downloads Agent Skills and installs them to the correct directory.

**You should see**:
```
Skills successfully installed.
```

### Step 2: Verify Installation

In Claude Code, enter:

```
List available skills
```

**You should see**:
The skill list returned by Claude includes:
- `react-best-practices`
- `web-design-guidelines`
- `vercel-deploy`

**Checkpoint ✅**: If you see these 3 skills, installation was successful.

## Method 2: Manual Installation to Claude Code

If you don't want to use npx, or need to control the installation location, use manual installation.

### Step 1: Clone or Download the Project

```bash
git clone https://github.com/vercel-labs/agent-skills.git
cd agent-skills
```

**Why**
Manual installation requires obtaining the project source code first.

### Step 2: Copy Skills to Claude Code Directory

```bash
cp -r skills/react-best-practices ~/.claude/skills/
cp -r skills/web-design-guidelines ~/.claude/skills/
cp -r skills/claude.ai/vercel-deploy-claimable ~/.claude/skills/vercel-deploy
```

**Why**
Claude Code stores skills in the `~/.claude/skills/` directory. After copying, Claude can recognize these skills.

**You should see**:
No error output after command execution.

**Checkpoint ✅**:
Use `ls ~/.claude/skills/` to verify, you should see 3 skill directories: `react-best-practices`, `web-design-guidelines`, `vercel-deploy`.

### Step 3: Restart Claude Code

Force quit Claude Code, then reopen it.

**Why**
Claude Code only loads the skill list at startup—you need to restart to recognize newly installed skills.

## Method 3: Using Skills in claude.ai

If you use claude.ai (the web version of Claude), the installation method is different.

### Method 3.1: Add to Project Knowledge Base

#### Step 1: Select Skill Files

Package all files from the `skills/react-best-practices`, `skills/web-design-guidelines`, and `skills/claude.ai/vercel-deploy-claimable` directories.

**Why**
claude.ai requires adding skill files as a "knowledge base" to your project.

#### Step 2: Upload to Project

In claude.ai:
1. Create or open a project
2. Click "Knowledge" → "Add Files"
3. Upload skill files (or the entire directory)

**You should see**:
The project's file list is displayed in the knowledge base.

### Method 3.2: Paste SKILL.md Content

If you don't want to upload the entire directory, you can directly copy the contents of `SKILL.md`.

#### Step 1: Copy Skill Definition

Open `skills/react-best-practices/SKILL.md` and copy all contents.

**Why**
`SKILL.md` contains the complete skill definition. Claude will understand the skill's functionality based on this file.

#### Step 2: Paste into Conversation

Paste the `SKILL.md` contents into a claude.ai conversation, or add it to the project's "Instructions".

**You should see**:
Claude confirms receiving the skill definition.

## Configure Network Permissions (Important)

If you use the `vercel-deploy` skill to deploy projects, you need to configure network permissions.

::: warning Important
The `vercel-deploy` skill needs access to `*.vercel.com` domains to upload deployments. Skipping this step will cause deployment failures!
:::

### Step 1: Open Claude Capabilities Settings

Visit in your browser:
```
https://claude.ai/settings/capabilities
```

**Why**
This controls the list of domains Claude can access.

### Step 2: Add Vercel Domain

Click "Add domain" and enter:
```
*.vercel.com
```

Click "Save" to save.

**You should see**:
`*.vercel.com` appears in the domain list.

**Checkpoint ✅**: Domain added—skills can now access the network.

## Troubleshooting

### Problem 1: Skills Not Activated

**Symptom**: You enter "Deploy my app", but Claude doesn't know what to do.

**Possible causes**:
- Claude Code not restarted (for manual installation)
- claude.ai project knowledge base didn't correctly load skills

**Solutions**:
- Claude Code: Restart the app
- claude.ai: Confirm skill files have been uploaded to the project's Knowledge

### Problem 2: Deployment Failed (Network Egress Error)

**Symptom**:
```
Deployment failed due to network restrictions
```

**Solution**:
Check if `*.vercel.com` has been added to network permissions:
```
Visit https://claude.ai/settings/capabilities
Check if *.vercel.com is included
```

### Problem 3: Can't Find `~/.claude/skills/` Directory

**Symptom**: During manual installation, you're told the directory doesn't exist.

**Solution**:
```bash
mkdir -p ~/.claude/skills/
```

### Problem 4: npx Installation Failed

**Symptom**:
```
npx: command not found
```

**Solution**:
```bash
# Confirm Node.js and npm are installed
node -v
npm -v

# If not installed, install the LTS version from https://nodejs.org/
```

## Summary

This lesson introduced three methods to install Agent Skills:
- **npx quick installation**: Recommended for Claude Code, one-click completion
- **Manual installation**: Copy files to `~/.claude/skills/`, suitable for controlling installation location
- **claude.ai installation**: Upload files to project knowledge base or paste `SKILL.md`

If you use the `vercel-deploy` skill, don't forget to add `*.vercel.com` network permissions at `https://claude.ai/settings/capabilities`.

After installation, you can have Claude automatically use these skills for code review, accessibility checks, and project deployment.

## Next Lesson Preview

> In the next lesson, we'll learn **[React/Next.js Performance Optimization Best Practices](../../platforms/react-best-practices/)**.
>
> You'll learn:
> - How to use 57 React performance optimization rules
> - Eliminate waterfalls, optimize bundle size, reduce re-renders
> - Have AI automatically review code and provide fix suggestions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature          | File Path                                                                                      | Line #  |
|--- | --- | ---|
| npx installation method  | [`README.md:83-86`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L83-L86)  | 83-86   |
| Claude Code manual installation | [`AGENTS.md:98-105`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L105) | 98-105  |
| claude.ai installation method | [`AGENTS.md:106-109`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L106-L109) | 106-109  |
| Network permission configuration  | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md:104-112`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L104-L112) | 104-112  |

**Key Skill Packages**:
- `react-best-practices`: 57 React performance optimization rules
- `web-design-guidelines`: 100+ web design guideline rules
- `vercel-deploy`: One-click deployment to Vercel (supports 40+ frameworks)

</details>
