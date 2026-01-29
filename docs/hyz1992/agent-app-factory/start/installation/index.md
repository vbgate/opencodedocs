---
title: "Installation and Configuration"
sidebarTitle: "Setup in 5 Minutes"
subtitle: "Installation and Configuration | Agent App Factory Tutorial"
description: "Learn how to install the Agent App Factory CLI tool, configure Claude Code or OpenCode, and install required plugins. This tutorial covers Node.js environment requirements, AI assistant setup, and plugin installation steps."
tags:
  - "Installation"
  - "Configuration"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 20
---

# Installation and Configuration

## What You'll Learn

✅ Install and verify the Agent App Factory CLI tool
✅ Configure Claude Code or OpenCode as your AI execution engine
✅ Install required plugins for running the pipeline
✅ Complete project initialization and start your first Factory project

## The Problem

You want to use AI App Factory to turn ideas into applications, but you don't know what tools to install or what environment to configure. Even after installation, you're worried about missing required plugins and encountering errors halfway through the pipeline.

## When to Use This

When using AI App Factory for the first time, or when setting up a development environment on a new machine, complete the installation and configuration before starting to generate applications.

## 🎒 Prerequisites

::: warning Requirements

Before starting installation, ensure you have:

- **Node.js version >= 16.0.0** - This is the minimum requirement for the CLI tool
- **npm or yarn** - For global package installation
- **An AI assistant** - Claude Code or OpenCode (Claude Code recommended)

:::

**Check Node.js version**:

```bash
node --version
```

If the version is lower than 16.0.0, download and install the latest LTS version from the [Node.js official website](https://nodejs.org).

## Core Concepts

AI App Factory installation consists of 3 key parts:

1. **CLI tool** - Provides command-line interface and manages project state
2. **AI assistant** - The "brain" that executes the pipeline and interprets Agent instructions
3. **Required plugins** - Extensions that enhance AI capabilities (Bootstrap brainstorming, UI design system)

Installation workflow: Install CLI → Configure AI assistant → Initialize project (auto-install plugins)

## Follow Along

### Step 1: Install the CLI Tool

Install the Agent App Factory CLI globally so you can use the `factory` command in any directory.

```bash
npm install -g agent-app-factory
```

**You should see**: Installation success output

```
added 1 package in Xs
```

**Verify installation**:

```bash
factory --version
```

**You should see**: Version number output

```
1.0.0
```

If you don't see the version number, check if installation was successful:

```bash
which factory  # macOS/Linux
where factory  # Windows
```

::: tip Installation failed?

If you encounter permission issues (macOS/Linux), try:

```bash
sudo npm install -g agent-app-factory
```

Or use npx without global installation (not recommended, requires download each time):

```bash
npx agent-app-factory init
```

:::

### Step 2: Install AI Assistant

AI App Factory must be used with an AI assistant, because Agent definitions and Skill files are AI instructions in Markdown format that require AI to interpret and execute.

#### Option A: Claude Code (Recommended)

Claude Code is Anthropic's official AI programming assistant, deeply integrated with AI App Factory.

**Installation**:

1. Visit the [Claude Code official website](https://claude.ai/code)
2. Download and install the application for your platform
3. After installation, verify the command is available:

```bash
claude --version
```

**You should see**: Version number output

```
Claude Code 1.x.x
```

#### Option B: OpenCode

OpenCode is another AI programming assistant that supports Agent mode.

**Installation**:

1. Visit the [OpenCode official website](https://opencode.sh)
2. Download and install the application for your platform
3. If there's no command-line tool, manually download and install to:

- **Windows**: `%LOCALAPPDATA%\Programs\OpenCode\`
- **macOS**: `/Applications/OpenCode.app/`
- **Linux**: `/usr/bin/opencode` or `/usr/local/bin/opencode`

::: info Why recommend Claude Code?

- Official support with best integration with AI App Factory permission system
- Automated plugin installation, `factory init` will automatically configure required plugins
- Better context management, saving tokens

:::

### Step 3: Initialize Your First Factory Project

Now you have a clean factory, let's initialize your first project.

**Create project directory**:

```bash
mkdir my-first-app && cd my-first-app
```

**Initialize Factory project**:

```bash
factory init
```

**You should see**:

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
  .factory/
    agents/
    skills/
    policies/
    templates/
    pipeline.yaml
    config.yaml
    state.json

✓ Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

**Checkpoint ✅**: Confirm the following files are created

```bash
ls -la .factory/
```

**You should see**:

```
agents/
skills/
policies/
templates/
pipeline.yaml
config.yaml
state.json
```

At the same time, the Claude Code window should open automatically.

::: tip Directory must be empty

`factory init` can only run in an empty directory or one containing only configuration files like `.git` or `README.md`.

If the directory contains other files, you will see an error:

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

:::

### Step 4: Auto-installed Plugins

`factory init` will attempt to automatically install two required plugins:

1. **superpowers** - Brainstorming skills for the Bootstrap phase
2. **ui-ux-pro-max-skill** - Design system for the UI phase (67 styles, 96 color palettes, 100 industry rules)

If automatic installation fails, you will see a warning:

```
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

::: warning What to do if plugin installation fails?

If plugin installation fails during initialization, you can manually install later in Claude Code:

1. Enter in Claude Code:
   ```
   /install superpowers
   /install ui-ux-pro-max-skill
   ```

2. Or visit the plugin marketplace to install manually

:::

### Step 5: Verify AI Assistant Permissions

`factory init` will automatically generate the `.claude/settings.local.json` file with necessary permissions configured.

**Check permission configuration**:

```bash
cat .claude/settings.local.json
```

**You should see** (simplified version):

```json
{
  "allowedCommands": [
    "read",
    "write",
    "glob",
    "bash"
  ],
  "allowedPaths": [
    ".factory/**",
    "input/**",
    "artifacts/**"
  ]
}
```

These permissions ensure the AI assistant can:
- Read Agent definitions and Skill files
- Write artifacts to the `artifacts/` directory
- Execute necessary scripts and tests

::: danger Do not use --dangerously-skip-permissions

The permission configuration generated by AI App Factory is already secure enough. Do not use `--dangerously-skip-permissions` in Claude Code, as this reduces security and may lead to unauthorized operations.

:::

## Troubleshooting

### ❌ Node.js version too low

**Error**: `npm install -g agent-app-factory` installation fails or errors at runtime

**Cause**: Node.js version is lower than 16.0.0

**Solution**: Upgrade Node.js to the latest LTS version

```bash
# Use nvm to upgrade (recommended)
nvm install --lts
nvm use --lts
```

### ❌ Claude Code not properly installed

**Error**: After executing `factory init`, it prompts "Claude CLI not found"

**Cause**: Claude Code was not correctly added to PATH

**Solution**: Reinstall Claude Code, or manually add the executable file path to environment variables

- **Windows**: Add Claude Code installation directory to PATH
- **macOS/Linux**: Check if the `claude` executable exists in `/usr/local/bin/`

### ❌ Directory not empty

**Error**: `factory init` prompts "directory is not empty"

**Cause**: Directory already contains other files (except configuration files like `.git`, `README.md`)

**Solution**: Initialize in a new empty directory, or clean up the existing directory

```bash
# Remove non-config files in the directory
rm -rf * !(.git) !(README.md)
```

### ❌ Plugin installation failed

**Error**: `factory init` displays a warning about plugin installation failure

**Cause**: Network issues or Claude Code plugin marketplace temporarily unavailable

**Solution**: Manually install plugins in Claude Code, or follow prompts during pipeline execution

```
/install superpowers
/install ui-ux-pro-max-skill
```

## Summary

This lesson completed the full installation and configuration of AI App Factory:

1. ✅ **CLI tool** - Globally installed via `npm install -g agent-app-factory`
2. ✅ **AI assistant** - Claude Code or OpenCode, Claude Code recommended
3. ✅ **Project initialization** - `factory init` creates `.factory/` directory and auto-configures
4. ✅ **Required plugins** - superpowers and ui-ux-pro-max-skill (auto or manual installation)
5. ✅ **Permission configuration** - Automatically generates Claude Code permission file

Now you have a runnable Factory project, the Claude Code window is open and ready to execute the pipeline.

## Next Up

> In the next lesson, we'll learn **[Initialize Factory Project](../init-project/)**.
>
> You will learn:
> - Understand the directory structure generated by `factory init`
> - Understand the purpose of each file in the `.factory/` directory
> - Master how to modify project configuration
> - Learn how to check project status

Ready to start generating your first application? Let's continue!

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Function           | File Path                                                                                           | Lines   |
| ------------------ | --------------------------------------------------------------------------------------------------- | ------- |
| CLI entry         | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)         | 1-123   |
| Init command      | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)     | 1-457   |
| Node.js requirement| [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json)                    | 41      |
| Claude Code launch| [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| OpenCode launch   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Plugin install check| [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L360-L392) | 360-392 |
| Permission config generation| [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-275   |

**Key constants**:
- `NODE_VERSION_MIN = "16.0.0"`: Minimum Node.js version requirement (package.json:41)

**Key functions**:
- `getFactoryRoot()`: Get Factory installation root directory (factory.js:22-52)
- `init()`: Initialize Factory project (init.js:220-456)
- `launchClaudeCode()`: Launch Claude Code (init.js:119-147)
- `launchOpenCode()`: Launch OpenCode (init.js:152-215)
- `generateClaudeSettings()`: Generate Claude Code permission configuration

</details>
