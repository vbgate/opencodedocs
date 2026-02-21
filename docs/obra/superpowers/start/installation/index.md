---
title: "Installation Guide: Claude Code / OpenCode / Codex | Superpowers Tutorial"
sidebarTitle: "Installation Guide"
subtitle: "Installation Guide: Claude Code / OpenCode / Codex"
description: "Learn how to install Superpowers skill library on different AI coding platforms. Covers Claude Code marketplace one-click install, OpenCode symlink manual setup, and Codex CLI integration."
tags:
  - "installation"
  - "configuration"
  - "Claude Code"
  - "OpenCode"
  - "Codex"
prerequisite:
  - "/obra/superpowers/start/superpowers-intro/"
  - "/obra/superpowers/start/quick-start/"
order: 30
---

# Installation Guide: Claude Code / OpenCode / Codex

## What You'll Learn

- Choose the correct installation method for your AI coding platform
- Verify that Superpowers is working correctly after installation
- Know how to check and fix issues when they occur

## Your Current Situation

Superpowers supports three mainstream platforms, but each has a different installation method. You might:
- Not know which platform you're using
- Waste time following the wrong installation steps
- Not know how to verify that the installation succeeded

**Good news**: This guide explains each platform clearly. Just follow along.

## When to Use This Guide

This is your first step in using Superpowers. Whether you're:
- Using Superpowers for the first time
- Switching to a new platform
- Upgrading to the latest version

You need to reconfigure.

## 🎒 Prerequisites

Before starting, confirm your platform:

| Platform | Characteristics | How to Identify |
| --- | --- | --- |
| **Claude Code** | Has slash commands like `/plugin` | The `/help` command is available in the conversation |
| **OpenCode** | Has `skill` tool | Can ask the AI to use `skill tool` |
| **Codex** | Command-line tool | Interact with AI through terminal commands |

::: warning Prerequisites
- Familiarity with basic terminal commands (`git clone`, `mkdir`, `ls`, etc.)
- Know how to run the AI coding platform you use
:::

---

## Claude Code Installation

Claude Code has a built-in plugin marketplace, making installation the simplest.

### Step 1: Register Plugin Marketplace

Tell Claude Code:

```bash
/plugin marketplace add obra/superpowers-marketplace
```

**You should see**: A confirmation that the marketplace was added successfully.

### Step 2: Install Plugin

```bash
/plugin install superpowers@superpowers-marketplace
```

**You should see**: A confirmation that the plugin installation is complete.

### Step 3: Verify Installation

```bash
/help
```

**You should see** the following commands appear in the help list:

```bash
/superpowers:brainstorm   # Interactive design refinement
/superpowers:write-plan   # Create implementation plan
/superpowers:execute-plan # Execute plan in batches
```

If you see these commands, the installation was successful!

---

## OpenCode Installation

OpenCode requires manually cloning the repository and creating symbolic links.

### Step 1: Clone Superpowers

```bash
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
```

**You should see**: Git clone completion output showing how many files were downloaded.

### Step 2: Register Plugin

Create a symbolic link so OpenCode can discover the plugin:

```bash
mkdir -p ~/.config/opencode/plugins
rm -f ~/.config/opencode/plugins/superpowers.js
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js ~/.config/opencode/plugins/superpowers.js
```

### Step 3: Link Skills Directory

Create a symbolic link so OpenCode's skill tool can discover Superpowers skills:

```bash
mkdir -p ~/.config/opencode/skills
rm -rf ~/.config/opencode/skills/superpowers
ln -s ~/.config/opencode/superpowers/skills ~/.config/opencode/skills/superpowers
```

### Step 4: Restart OpenCode

**Important**: You must restart for the plugin to take effect.

### Step 5: Verify Installation

Check that symbolic links are correct:

```bash
ls -l ~/.config/opencode/plugins/superpowers.js
ls -l ~/.config/opencode/skills/superpowers
```

**You should see**: Both symbolic links point to the `~/.config/opencode/superpowers/` directory.

Then ask OpenCode:

```
do you have superpowers?
```

**You should see**: OpenCode confirms it has the superpowers skill.

### macOS / Linux One-Click Script

If you're on macOS or Linux, use this script to automatically install or update:

```bash
# 1. Install or update Superpowers
if [ -d ~/.config/opencode/superpowers ]; then
  cd ~/.config/opencode/superpowers && git pull
else
  git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
fi

# 2. Create directories
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills

# 3. Remove old symbolic links or directories
rm -f ~/.config/opencode/plugins/superpowers.js
rm -rf ~/.config/opencode/skills/superpowers

# 4. Create symbolic links
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js ~/.config/opencode/plugins/superpowers.js
ln -s ~/.config/opencode/superpowers/skills ~/.config/opencode/skills/superpowers

# 5. Restart OpenCode
```

---

## Codex Installation

Codex requires manually cloning the repository and updating the configuration file.

### Step 1: Clone Superpowers

```bash
git clone https://github.com/obra/superpowers.git ~/.codex/superpowers
```

**You should see**: Git clone completion output.

### Step 2: Create Personal Skills Directory

```bash
mkdir -p ~/.codex/skills
```

### Step 3: Update AGENTS.md

Edit the `~/.codex/AGENTS.md` file and add the following:

```markdown
## Superpowers System

<EXTREMELY_IMPORTANT>
You have superpowers. Superpowers teach you new skills and capabilities. RIGHT NOW run: `~/.codex/superpowers/.codex/superpowers-codex bootstrap` and follow the instructions it returns.
</EXTREMELY_IMPORTANT>
```

### Step 4: Verify Installation

```bash
~/.codex/superpowers/.codex/superpowers-codex bootstrap
```

**You should see**: A skill list and bootstrap instructions. If available skills are displayed, the installation was successful!

---

## Troubleshooting

### Symbolic Link Invalid (OpenCode)

If OpenCode reports that it cannot find the plugin or skills:

1. Check plugin symbolic link: `ls -l ~/.config/opencode/plugins/superpowers.js`
2. Check if source file exists: `ls ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js`
3. Check OpenCode logs for error messages

### Skills Not Displayed (OpenCode)

If OpenCode's `skill` tool doesn't list Superpowers skills:

1. Check skills symbolic link: `ls -l ~/.config/opencode/skills/superpowers`
2. Confirm it points to the correct location: `~/.config/opencode/superpowers/skills`
3. Use the `skill` tool to list discovered skills and see what's wrong

### Plugin Commands Not Displayed (Claude Code)

If Superpowers commands don't appear in `/help`:

1. Confirm plugin marketplace is added: try `/plugin marketplace list`
2. Reinstall the plugin: `/plugin uninstall superpowers@superpowers-marketplace` then install again
3. Restart Claude Code

### Bootstrap Fails (Codex)

If `superpowers-codex bootstrap` reports an error:

1. Confirm the script has execute permissions: `chmod +x ~/.codex/superpowers/.codex/superpowers-codex`
2. Check if Node.js is installed: `node --version`
3. Check if the Git repository was cloned correctly: `ls -la ~/.codex/superpowers`
4. Check if `.codex/AGENTS.md` was updated correctly

---

## Update to Latest Version

### Claude Code

Use the built-in update command from the plugin system:

```bash
/plugin update superpowers
```

### OpenCode and Codex

Manually installed platforms are updated via git pull:

#### OpenCode

```bash
cd ~/.config/opencode/superpowers
git pull
```

#### Codex

```bash
cd ~/.codex/superpowers
git pull
```

---

## Summary

| Platform | Installation Method | Key Steps |
| --- | --- | --- |
| **Claude Code** | Plugin Marketplace | Register marketplace → Install plugin |
| **OpenCode** | Manual Installation | Clone → Link plugin → Link skills → Restart |
| **Codex** | Manual Installation | Clone → Update AGENTS.md → Run bootstrap |

**Remember**: Always verify after installation to ensure skills are available.

---

## Coming Up Next

> In the next lesson, we'll learn **[Verification](../verification/)**.
>
> You'll learn:
> - How to check if skills are loaded correctly
> - How to test basic skill calls
> - How to troubleshoot common installation errors
