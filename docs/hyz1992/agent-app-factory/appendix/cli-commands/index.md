---
title: "CLI Commands Reference: Complete Command List and Parameters | Agent App Factory Tutorial"
sidebarTitle: "CLI Commands"
subtitle: "CLI Commands Reference: Complete Command List and Parameter Guide"
description: "Complete Agent App Factory CLI reference covering init, run, continue, status, list, and reset commands with parameter descriptions and usage examples."
tags:
  - "CLI"
  - "Command Line"
  - "Reference"
order: 210
---

# CLI Commands Reference: Complete Command List and Parameters

This chapter provides a complete command reference for the Agent App Factory CLI tool.

## Command Overview

| Command | Function | Use Case |
| --- | --- | --- |
| `factory init` | Initialize Factory project | Start a new project |
| `factory run [stage]` | Run pipeline | Execute or continue pipeline |
| `factory continue` | Continue in new session | Save tokens, execute across sessions |
| `factory status` | View project status | Understand current progress |
| `factory list` | List all projects | Manage multiple projects |
| `factory reset` | Reset project state | Restart pipeline |

---

## factory init

Initialize the current directory as a Factory project.

### Syntax

```bash
factory init [options]
```

### Parameters

| Parameter | Short | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `--name` | `-n` | string | No | Project name |
| `--description` | `-d` | string | No | Project description |

### Functionality

After executing the `factory init` command, the following actions are performed:

1. Check directory security (only allows `.git`, `.gitignore`, `README.md` and other config files)
2. Create `.factory/` directory
3. Copy the following files to `.factory/`:
   - `agents/` - Agent definition files
   - `skills/` - Skill modules
   - `policies/` - Policy documents
   - `templates/` - Configuration templates
   - `pipeline.yaml` - Pipeline definition
4. Generate `config.yaml` and `state.json`
5. Generate `.claude/settings.local.json` (Claude Code permission configuration)
6. Attempt to install required plugins:
   - superpowers (needed for Bootstrap stage)
   - ui-ux-pro-max-skill (needed for UI stage)
7. Automatically launch AI assistant (Claude Code or OpenCode)

### Examples

**Initialize project with name and description**:

```bash
factory init --name "Todo App" --description "一个简单的待办事项应用"
```

**Initialize project in current directory**:

```bash
factory init
```

### Notes

- Directory must be empty or contain only config files (`.git`, `.gitignore`, `README.md`)
- If `.factory/` directory already exists, you will be prompted to use `factory reset` to reset

---

## factory run

Run the pipeline, starting from the current stage or a specified stage.

### Syntax

```bash
factory run [stage] [options]
```

### Parameters

| Parameter | Short | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `stage` | - | string | No | Pipeline stage name (bootstrap/prd/ui/tech/code/validation/preview) |

### Options

| Option | Short | Type | Description |
| --- | --- | --- | --- |
| `--force` | `-f` | flag | Skip confirmation prompt |

### Functionality

After executing the `factory run` command, the following actions are performed:

1. Check if it's a Factory project
2. Read `config.yaml` and `state.json`
3. Display current pipeline status
4. Determine target stage (specified by parameter or current stage)
5. Detect AI assistant type (Claude Code / Cursor / OpenCode)
6. Generate execution instructions for the corresponding assistant
7. Display available stage list and progress

### Examples

**Run pipeline starting from bootstrap stage**:

```bash
factory run bootstrap
```

**Continue running from current stage**:

```bash
factory run
```

**Skip confirmation and run directly**:

```bash
factory run bootstrap --force
```

### Output Example

```
Agent Factory - Pipeline Runner

Pipeline Status:
────────────────────────────────────────
Project: Todo App
Status: Running
Current Stage: bootstrap
Completed:

🤖 Claude Code Instructions:
───────────────────────────
This is an Agent Factory project. To execute the pipeline:

1. Read pipeline definition:
   Read(/path/to/.factory/pipeline.yaml)

2. Read orchestrator agent:
   Read(/path/to/.factory/agents/orchestrator.checkpoint.md)

3. Read project config:
   Read(/path/to/.factory/config.yaml)

Then execute the pipeline starting from: bootstrap

────────────────────────────────────────
Available stages:
  ○ bootstrap
  ○ prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

────────────────────────────────────────
Ready! Follow instructions above to continue.
```

---

## factory continue

Create a new session to continue executing the pipeline, saving tokens.

### Syntax

```bash
factory continue
```

### Functionality

After executing the `factory continue` command, the following actions are performed:

1. Check if it's a Factory project
2. Read `state.json` to get current state
3. Regenerate Claude Code permission configuration
4. Launch a new Claude Code window
5. Continue execution from current stage

### Use Cases

- Avoid token accumulation after each stage completion
- Each stage gets a clean context
- Support interruption recovery

### Examples

**Continue executing pipeline**:

```bash
factory continue
```

### Notes

- Requires Claude Code to be installed
- Will automatically launch a new Claude Code window

---

## factory status

Display detailed status of the current Factory project.

### Syntax

```bash
factory status
```

### Functionality

After executing the `factory status` command, the following is displayed:

- Project name, description, path, creation time
- Pipeline status (idle/running/waiting_for_confirmation/paused/failed/completed)
- Current stage
- List of completed stages
- Progress of each stage
- Input file status (input/idea.md)
- Artifacts directory status (artifacts/)
- Number and size of artifact files

### Examples

```bash
factory status
```

### Output Example

```
Agent Factory - Project Status

Project:
  Name: Todo App
  Description: 一个简单的待办事项应用
  Path: /Users/user/Projects/todo-app
  Created: 2026-01-29T10:00:00.000Z

Pipeline:
  Status: Running
  Current Stage: prd
  Completed: bootstrap

Progress:
  ✓ bootstrap
  → prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

Input:
  File: input/idea.md
  Lines: 25
  Preview:
    # Todo App

    一个简单的待办事项应用...

Artifacts:
  ✓ prd (3 files, 12.5 KB)

────────────────────────────────────────
Commands:
  factory run     - Run pipeline
  factory run <stage> - Run from stage
  factory reset  - Reset pipeline state
```

---

## factory list

List all Factory projects.

### Syntax

```bash
factory list
```

### Functionality

After executing the `factory list` command, the following actions are performed:

1. Search common project directories (`~/Projects`, `~/Desktop`, `~/Documents`, `~`)
2. Search current directory and its parent directories (up to 3 levels)
3. List all projects containing `.factory/` directory
4. Display project status (sorted by running, waiting, failed, completed)

### Examples

```bash
factory list
```

### Output Example

```
Agent Factory - Projects

Found 2 project(s):

◉ Todo App
  一个简单的待办事项应用
  Path: /Users/user/Projects/todo-app
  Stage: prd

○ Blog System
  博客系统
  Path: /Users/user/Projects/blog
  Completed: bootstrap

────────────────────────────────────────
Work on a project: cd <path> && factory run
```

---

## factory reset

Reset the current project's pipeline state, preserving artifacts.

### Syntax

```bash
factory reset [options]
```

### Options

| Option | Short | Type | Description |
| --- | --- | --- | --- |
| `--force` | `-f` | flag | Skip confirmation |

### Functionality

After executing the `factory reset` command, the following actions are performed:

1. Check if it's a Factory project
2. Display current status
3. Confirm reset (unless using `--force`)
4. Reset `state.json` to initial state
5. Update pipeline section of `config.yaml`
6. Preserve all `artifacts/` artifacts

### Use Cases

- Restart from bootstrap stage
- Clear state errors
- Reconfigure pipeline

### Examples

**Reset project state**:

```bash
factory reset
```

**Skip confirmation and reset directly**:

```bash
factory reset --force
```

### Notes

- Only resets pipeline state, artifacts are not deleted
- To completely delete a project, manually delete `.factory/` and `artifacts/` directories

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Command | File Path | Line Number |
| --- | --- | --- |
| CLI Entry | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 17-122 |
| init command | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| run command | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-335 |
| continue command | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |
| status command | [`cli/commands/status.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/status.js) | 1-203 |
| list command | [`cli/commands/list.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/list.js) | 1-160 |
| reset command | [`cli/commands/reset.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/reset.js) | 1-100 |

**Key Functions**:
- `getFactoryRoot()` - Get Factory root directory (factory.js:22-52)
- `isFactoryProject()` - Check if it's a Factory project (init.js:22-26)
- `generateConfig()` - Generate project configuration (init.js:58-76)
- `launchClaudeCode()` - Launch Claude Code (init.js:119-147)
- `launchOpenCode()` - Launch OpenCode (init.js:152-215)
- `detectAIAssistant()` - Detect AI assistant type (run.js:105-124)
- `updateState()` - Update pipeline state (run.js:94-100)

**Dependencies**:
- `commander` - CLI argument parsing
- `chalk` - Terminal colored output
- `ora` - Loading animation
- `inquirer` - Interactive prompts
- `yaml` - YAML file parsing
- `fs-extra` - File system operations

</details>
