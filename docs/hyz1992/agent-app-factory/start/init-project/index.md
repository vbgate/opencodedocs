---
title: "Factory Initialization: 3-Minute Setup | Agent Factory"
sidebarTitle: "Initialize Project in 3 Minutes"
subtitle: "Initialize Factory Project: 3-Minute Setup from Scratch"
description: "Learn how to use the factory init command to quickly initialize an Agent App Factory project. This tutorial covers directory requirements, file structure, permission configuration, and AI assistant startup."
tags:
  - "Project Initialization"
  - "factory init"
  - "Directory Structure"
prerequisite:
  - "start-installation"
order: 30
---

# Initialize Factory Project: 3-Minute Setup from Scratch

## What You'll Learn

- Initialize a Factory project in any empty directory
- Understand the generated `.factory/` directory structure
- Configure project parameters (tech stack, UI preferences, MVP constraints)
- Automatically launch AI assistant and start the pipeline

## The Problem

Want to try AI App Factory, but don't know where to start? Looking at an empty folder, unsure what files to create? Or already have some code, wondering if you can use it directly? Don't worry, the `factory init` command will handle everything for you.

## When to Use This

- First time using AI App Factory
- Starting a new product idea
- Need a clean Factory project environment

## 🎒 Prerequisites

::: warning Requirements

Before starting, confirm:

- ✅ Completed [Installation and Configuration](../installation/)
- ✅ Installed AI assistant (Claude Code or OpenCode)
- ✅ Have an **empty directory** or one with only Git/editor config files

:::

## Core Concepts

The core of the `factory init` command is **self-contained** design:

1. Copies all necessary files (agents, skills, policies, pipeline.yaml) to the project's `.factory/` directory
2. Generates project configuration files (`config.yaml` and `state.json`)
3. Configures Claude Code permissions (`.claude/settings.local.json`)
4. Automatically installs required plugins (superpowers, ui-ux-pro-max)
5. Launches AI assistant and starts the pipeline

This way, each Factory project contains everything needed to run, without relying on global installation.

::: tip Why Self-Contained?

Self-contained design brings these benefits:

- **Version Isolation**: Different projects can use different versions of Factory configuration
- **Portable**: Can directly commit `.factory/` directory to Git for team members to reuse
- **Secure**: Permission settings only apply within the project directory, won't affect other projects

:::

## Follow Along

### Step 1: Enter Project Directory

**Why**: Need a clean working directory to store the generated application.

```bash
# Create new directory
mkdir my-app && cd my-app

# Or enter existing empty directory
cd /path/to/your/project
```

**You should see**: Directory is empty, or only contains allowed files like `.git/`, `.gitignore`, `README.md`.

### Step 2: Run Initialization Command

**Why**: `factory init` creates the `.factory/` directory and copies all necessary files.

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
    templates/
    policies/
    pipeline.yaml
    config.yaml
    state.json

Checking and installing required Claude plugins...
Installing superpowers plugin... ✓
Installing ui-ux-pro-max-skill plugin... ✓
Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

### Step 3: Customize with Optional Parameters (Optional)

**Why**: If you have clear tech stack preferences, you can specify them during initialization.

```bash
factory init --name "My Expense Tracker" --description "Help young people track daily expenses"
```

These parameters are written to `config.yaml` and will affect code generation in subsequent steps.

### Step 4: Verify Generated Directory Structure

**Why**: Confirm all files are correctly generated.

```bash
ls -la
```

**You should see**:

```
.claude/              # Claude Code configuration directory
  └── settings.local.json   # Permission configuration

.factory/            # Factory core directory
  ├── agents/          # Agent definition files
  ├── skills/          # Skill modules
  ├── templates/       # Configuration templates
  ├── policies/        # Policies and standards
  ├── pipeline.yaml    # Pipeline definition
  ├── config.yaml      # Project configuration
  └── state.json      # Pipeline state
```

## Checkpoint ✅

Ensure the following files are created:

- [ ] `.factory/pipeline.yaml` exists
- [ ] `.factory/config.yaml` exists
- [ ] `.factory/state.json` exists
- [ ] `.claude/settings.local.json` exists
- [ ] `.factory/agents/` directory contains 7 `.agent.md` files
- [ ] `.factory/skills/` directory contains 6 skill modules
- [ ] `.factory/policies/` directory contains 7 policy documents

## Generated Files Explained

### config.yaml: Project Configuration

`config.yaml` contains project basic information and pipeline status:

```yaml
project:
  name: my-app                  # Project name
  description: ""                # Project description
  created_at: "2026-01-30T00:00:00.000Z"  # Creation time
  updated_at: "2026-01-30T00:00:00.000Z"  # Update time

pipeline:
  current_stage: null           # Current execution stage
  completed_stages: []          # Completed stages list
  last_checkpoint: null         # Last checkpoint

settings:
  auto_save: true               # Auto save
  backup_on_error: true        # Backup on error
```

::: tip Modifying Configuration

You can directly edit `config.yaml` after `factory init`, and it will take effect automatically during pipeline execution. No need to reinitialize.

:::

### state.json: Pipeline State

`state.json` records pipeline execution progress:

```json
{
  "version": 1,
  "status": "idle",
  "current_stage": null,
  "completed_stages": [],
  "started_at": null,
  "last_updated": "2026-01-30T00:00:00.000Z"
}
```

- `status`: Current state (initializes as `idle`, dynamically switches to `running`, `waiting_for_confirmation`, `paused`, `failed` during execution)
- `current_stage`: Currently executing stage
- `completed_stages`: List of completed stages

::: info Status Explanation

The pipeline runs using a state machine. When initialized, status is `idle`. Other status values are dynamically set during pipeline execution:
- `idle`: Waiting to start
- `running`: Executing a stage
- `waiting_for_confirmation`: Waiting for manual confirmation to continue, retry, or pause
- `paused`: Manually paused
- `failed`: Failure detected, manual intervention needed

:::

::: warning Do Not Manually Edit

`state.json` is automatically maintained by the pipeline. Manual editing may cause state inconsistency. To reset, use the `factory reset` command.

:::

### pipeline.yaml: Pipeline Definition

Defines the execution order and dependencies of 7 stages:

```yaml
stages:
  - id: bootstrap
    description: Initialize project idea
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs: [input/idea.md]

  - id: prd
    description: Generate product requirements document
    agent: agents/prd.agent.md
    inputs: [input/idea.md]
    outputs: [artifacts/prd/prd.md]

  # ... other stages
```

::: info Pipeline Order

The pipeline executes strictly in order, cannot skip stages. Each stage pauses for confirmation after completion.

:::

### .claude/settings.local.json: Permission Configuration

Auto-generated Claude Code permission configuration, including:

- **File operation permissions**: Read/Write/Glob/Edit on project directory
- **Bash command permissions**: git, npm, npx, docker, etc.
- **Skills permissions**: superpowers, ui-ux-pro-max, and other required skills
- **WebFetch permissions**: Allows access to specific domains (GitHub, NPM, etc.)

::: danger Security

Permission configuration only applies to the current project directory, won't affect other system locations. This is one of Factory's security designs.

:::

## Troubleshooting

### Directory Not Empty Error

**Error message**:

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

**Cause**: Directory contains incompatible files or directories (like `artifacts/`, `input/`, etc.)

**Solution**:

1. Clean conflicting files:
   ```bash
   rm -rf artifacts/ input/
   ```

2. Or use a new directory:
   ```bash
   mkdir my-app-new && cd my-app-new
   factory init
   ```

### Already a Factory Project

**Error message**:

```
This directory is already a Factory project:
  Name: my-app
  Created: 2026-01-29T13:00:00.000Z

To reset project, use: factory reset
```

**Cause**: `.factory/` directory already exists

**Solution**:

```bash
# Reset project state (keep artifacts)
factory reset

# Or completely reinitialize (delete everything)
rm -rf .factory/
factory init
```

### Claude Code Not Installed

**Error message**:

```
Claude CLI not found - skipping plugin installation
Install Claude Code to enable plugins: https://claude.ai/code
```

**Cause**: Claude Code CLI not installed

**Solution**:

1. Install Claude Code: https://claude.ai/code
2. Or manually run the pipeline (refer to [Quick Start](../getting-started/))

### Plugin Installation Failed

**Error message**:

```
Installing superpowers plugin... (failed)
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

**Cause**: Network issues or Claude Code configuration issues

**Solution**:

Ignore the warning and continue. The Bootstrap stage will prompt you to manually install the plugin.

## Summary

In this lesson, you learned:

1. ✅ Use `factory init` command to initialize Factory project
2. ✅ Understand the generated `.factory/` directory structure
3. ✅ Learn about configuration options in `config.yaml`
4. ✅ Understand state management in `state.json`
5. ✅ Know about permission configuration in `.claude/settings.local.json`

After initialization, the project is ready to run the pipeline. Next, we'll learn [Pipeline Overview](../pipeline-overview/) to understand the complete process from idea to application.

## Next Up

> In the next lesson, we'll learn **[Pipeline Overview](../pipeline-overview/)**.
>
> You will learn:
> - Order and dependencies of 7 stages
> - Inputs and outputs of each stage
> - How checkpoint mechanism ensures quality
> - Failure handling and retry strategies

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Function        | File Path                                                                                       | Lines   |
| --------------- | ----------------------------------------------------------------------------------------------- | ------- |
| init main logic | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 220-456  |
| Directory safety check | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 32-53    |
| Config generation    | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 58-76    |
| Claude permission config | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 41-248   |
| Pipeline definition  | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)               | 7-111    |
| Project config template | [`config.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/config.yaml)                   | 1-102    |

**Key functions**:
- `isFactoryProject()`: Check if directory is already a Factory project (lines 22-26)
- `isDirectorySafeToInit()`: Check if directory is safe to initialize (lines 32-53)
- `generateConfig()`: Generate project configuration (lines 58-76)
- `generateClaudeSettings()`: Generate Claude Code permission configuration (lines 256-275)

</details>
