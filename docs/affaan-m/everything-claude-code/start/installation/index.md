---
title: "Install: Marketplace & Manual Setup | Everything Claude Code"
sidebarTitle: "Installation"
subtitle: "Installation Guide: Marketplace vs Manual Setup"
description: "Learn to install Everything Claude Code via marketplace or manual setup. Covers one-click installation, component configuration, and troubleshooting."
tags:
  - "installation"
  - "plugin"
  - "setup"
prerequisite:
  - "/start/quickstart/"
order: 20
---

# Installation Guide: Marketplace vs Manual Setup

## What You'll Learn

After completing this tutorial, you will be able to:

- Install Everything Claude Code with one click via the plugin marketplace
- Manually select and configure specific components with precision
- Correctly configure MCP servers and hooks
- Verify your installation is successful

## Your Current Challenge

You want to get started with Everything Claude Code quickly, but you're not sure whether to:

- Use the marketplace for one-click installation, or manually control each component?
- How to avoid configuration errors that prevent features from working?
- Which files need to be copied to which locations during manual installation?

## When to Use Which Method

| Scenario | Recommended Method | Reason |
|----------|-------------------|--------|
| First-time user | Marketplace installation | Easiest, done in 5 minutes |
| Want to try specific features | Marketplace installation | Full experience before deciding |
| Specific requirements | Manual installation | Precise control over each component |
| Existing custom configuration | Manual installation | Avoid overwriting existing settings |

## Core Approach

Everything Claude Code offers two installation methods:

1. **Marketplace Installation** (Recommended)
   - Suitable for most users
   - Automatically handles all dependencies
   - Complete installation with one command

2. **Manual Installation**
   - Suitable for users with specific requirements
   - Precise control over which components to install
   - Requires manual configuration

Regardless of which method you choose, the final result copies configuration files to the `~/.claude/` directory, enabling Claude Code to recognize and use these components.

## 🎒 Prerequisites

::: warning Prerequisites

Before starting, please confirm:
- [ ] Claude Code is installed
- [ ] You have internet access to GitHub
- [ ] You understand basic command-line operations (if choosing manual installation)

:::

---

## Follow Along

### Method 1: Marketplace Installation (Recommended)

This is the simplest approach, suitable for first-time users or those who want a quick experience.

#### Step 1: Add the Marketplace

**Why**
Register the GitHub repository as a Claude Code plugin marketplace so you can install plugins from it.

In Claude Code, enter:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**You should see**:
```
Successfully added marketplace affaan-m/everything-claude-code
```

#### Step 2: Install the Plugin

**Why**
Install the Everything Claude Code plugin from the marketplace you just added.

In Claude Code, enter:

```bash
/plugin install everything-claude-code@everything-claude-code
```

**You should see**:
```
Successfully installed everything-claude-code@everything-claude-code
```

::: tip Checkpoint ✅

Verify the plugin is installed:

```bash
/plugin list
```

You should see `everything-claude-code@everything-claude-code` in the output.

:::

#### Step 3 (Optional): Configure settings.json Directly

**Why**
If you want to skip the command line and edit the configuration file directly.

Open `~/.claude/settings.json` and add the following:

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  },
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**You should see**:
- After the configuration file updates, Claude Code automatically loads the plugin
- All agents, skills, commands, and hooks take effect immediately

---

### Method 2: Manual Installation

Suitable for users who want precise control over which components to install.

#### Step 1: Clone the Repository

**Why**
Get all source files for Everything Claude Code.

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
```

**You should see**:
```
Cloning into 'everything-claude-code'...
remote: Enumerating objects...
```

#### Step 2: Copy Agents

**Why**
Copy specialized sub-agents to the Claude Code agents directory.

```bash
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

**You should see**:
- 9 new agent files added to the `~/.claude/agents/` directory

::: tip Checkpoint ✅

Verify agents have been copied:

```bash
ls ~/.claude/agents/
```

You should see something like:
```
planner.md architect.md tdd-guide.md code-reviewer.md ...
```

:::

#### Step 3: Copy Rules

**Why**
Copy mandatory rules to the Claude Code rules directory.

```bash
cp everything-claude-code/rules/*.md ~/.claude/rules/
```

**You should see**:
- 8 new rule files added to the `~/.claude/rules/` directory

#### Step 4: Copy Commands

**Why**
Copy slash commands to the Claude Code commands directory.

```bash
cp everything-claude-code/commands/*.md ~/.claude/commands/
```

**You should see**:
- 14 new command files added to the `~/.claude/commands/` directory

#### Step 5: Copy Skills

**Why**
Copy workflow definitions and domain knowledge to the Claude Code skills directory.

```bash
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

**You should see**:
- 11 new skill directories added to the `~/.claude/skills/` directory

#### Step 6: Configure Hooks

**Why**
Add automation hook configurations to Claude Code's settings.json.

Copy the contents of `hooks/hooks.json` to your `~/.claude/settings.json`:

```bash
cat everything-claude-code/hooks/hooks.json
```

Add the output to `~/.claude/settings.json` in this format:

```json
{
  "hooks": [
    {
      "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
      "hooks": [
        {
          "type": "command",
          "command": "#!/bin/bash\ngrep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
        }
      ]
    }
  ]
}
```

**You should see**:
- When editing TypeScript/JavaScript files, a warning appears if `console.log` is present

::: warning Important Reminder

Ensure the `hooks` array doesn't overwrite existing configurations in `~/.claude/settings.json`. If there are existing hooks, merge them.

:::

#### Step 7: Configure MCP Servers

**Why**
Extend Claude Code's external service integration capabilities.

Select the MCP servers you need from `mcp-configs/mcp-servers.json` and add them to `~/.claude.json`:

```bash
cat everything-claude-code/mcp-configs/mcp-servers.json
```

Copy the required configuration to `~/.claude.json`, for example:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

::: danger Important: Replace Placeholders

You must replace `YOUR_*_HERE` placeholders with your actual API keys, otherwise MCP servers won't work.

:::

::: tip MCP Usage Recommendations

**Don't enable all MCPs!** Too many MCPs consume a lot of context window space.

- Configure 20-30 MCP servers
- Keep under 10 enabled per project
- Keep fewer than 80 tools active

Use `disabledMcpServers` in project configuration to disable MCPs you don't need:

```json
{
  "disabledMcpServers": ["firecrawl", "supabase"]
}
```

:::

---

## Checkpoint ✅

### Verify Marketplace Installation

```bash
/plugin list
```

You should see `everything-claude-code@everything-claude-code` is enabled.

### Verify Manual Installation

```bash
# Check agents
ls ~/.claude/agents/ | head -5

# Check rules
ls ~/.claude/rules/ | head -5

# Check commands
ls ~/.claude/commands/ | head -5

# Check skills
ls ~/.claude/skills/ | head -5
```

You should see:
- `planner.md`, `tdd-guide.md`, etc. in the agents directory
- `security.md`, `coding-style.md`, etc. in the rules directory
- `tdd.md`, `plan.md`, etc. in the commands directory
- `coding-standards`, `backend-patterns`, etc. in the skills directory

### Verify Features Are Working

In Claude Code, enter:

```bash
/tdd
```

You should see the TDD Guide agent start working.

---

## Troubleshooting

### Common Error 1: Plugin Not Working After Installation

**Symptom**: Commands don't work after installing the plugin.

**Cause**: The plugin didn't load correctly.

**Solution**:
```bash
# Check plugin list
/plugin list

# If not enabled, enable manually
/plugin enable everything-claude-code@everything-claude-code
```

### Common Error 2: MCP Server Connection Failed

**Symptom**: MCP features don't work, connection error reported.

**Cause**: API key not replaced or incorrect format.

**Solution**:
- Check if all `YOUR_*_HERE` placeholders in `~/.claude.json` have been replaced
- Verify the API key is valid
- Confirm the MCP server command path is correct

### Common Error 3: Hooks Not Triggering

**Symptom**: No hook prompts when editing files.

**Cause**: Incorrect hooks configuration format in `~/.claude/settings.json`.

**Solution**:
- Check if the `hooks` array format is correct
- Ensure the `matcher` expression syntax is correct
- Verify the hook command path is executable

### Common Error 4: File Permission Issues (Manual Installation)

**Symptom**: "Permission denied" error when copying files.

**Cause**: Insufficient permissions on the `~/.claude/` directory.

**Solution**:
```bash
# Ensure .claude directory exists and has permissions
mkdir -p ~/.claude/{agents,rules,commands,skills}

# Use sudo (only if necessary)
sudo cp -r everything-claude-code/agents/*.md ~/.claude/agents/
```

---

## Summary

**Comparison of Installation Methods**:

| Feature | Marketplace Installation | Manual Installation |
|---------|-------------------------|---------------------|
| Speed | ⚡ Fast | 🐌 Slow |
| Difficulty | 🟢 Easy | 🟡 Moderate |
| Flexibility | 🔒 Fixed | 🔓 Customizable |
| Recommended Scenario | Beginners, quick trial | Advanced users, specific needs |

**Key Takeaways**:
- Marketplace installation is the simplest method—done with one command
- Manual installation suits users who need precise component control
- Remember to replace placeholders when configuring MCP, don't enable too many
- When verifying installation, check directory structure and command availability

---

## Next Lesson

> In the next lesson, we'll learn **[Package Manager Setup: Automatic Detection and Customization](../package-manager-setup/)**.
>
> You'll learn:
> - How Everything Claude Code automatically detects package managers
> - How the 6 detection priority levels work
> - How to configure project-level and user-level package manager settings
> - Using the `/setup-pm` command for quick configuration

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|---------|-----------|-------|
| Plugin Metadata | [`source/affaan-m/everything-claude-code/.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Marketplace Manifest | [`source/affaan-m/everything-claude-code/.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45 |
| Installation Guide | [`source/affaan-m/everything-claude-code/README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 175-242 |
| Hooks Configuration | [`source/affaan-m/everything-claude-code/hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-146 |
| MCP Configuration | [`source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-95 |

**Key Configuration**:
- Plugin name: `everything-claude-code`
- Repository: `affaan-m/everything-claude-code`
- License: MIT
- Supports 9 agents, 14 commands, 8 rule sets, 11 skills

**Installation Methods**:
1. Marketplace installation: `/plugin marketplace add` + `/plugin install`
2. Manual installation: Copy agents, rules, commands, skills to `~/.claude/`

</details>
