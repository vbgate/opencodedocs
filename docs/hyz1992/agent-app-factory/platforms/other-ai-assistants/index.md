---
title: "3 Ways to Run Pipelines with AI Assistants"
sidebarTitle: "3 Ways to Run"
subtitle: "3 Ways to Run Agent App Factory Pipelines with AI Assistants"
description: "Learn to run Agent App Factory pipelines with OpenCode, Cursor, and other AI assistants. Covers startup methods, command formats, use cases, and troubleshooting."
tags:
  - "AI Assistant"
  - "OpenCode"
  - "Cursor"
  - "Pipeline Execution"
prerequisite:
  - "start-installation"
order: 60
---

# 3 Ways to Run Pipelines with AI Assistants

## What You'll Learn

- ✅ Launch and run Factory pipelines with OpenCode
- ✅ Run pipelines with Cursor
- ✅ Understand command format differences across AI assistants
- ✅ Choose the right AI assistant for your use case

## Your Current Challenge

You've initialized a Factory project, but don't know how to run the pipeline with AI assistants other than Claude Code. OpenCode and Cursor are mainstream AI programming assistants—can they run Factory pipelines? What are the differences in startup methods and command formats?

## When to Use Each Approach

| AI Assistant   | Recommended Use Case                  | Advantages                    |
| -------------- | ------------------------------------- | ----------------------------- |
| **Claude Code** | Most stable Agent mode experience    | Native Agent mode support, clear command format |
| **OpenCode**  | Cross-platform users, flexible AI tools | Cross-platform, Agent mode support     |
| **Cursor**    | VS Code power users, VS Code ecosystem | High integration, seamless switching       |

::: tip Core Principle
All AI assistants execute with the same logic: **Read Agent Definition → Execute Pipeline → Generate Artifacts**. The only differences are in startup methods and command formats.
:::

## 🎒 Prerequisites

Before starting, ensure:

- ✅ [Installation & Configuration](../../start/installation/) completed
- ✅ Project initialized with `factory init`
- ✅ OpenCode or Cursor installed (at least one)

## Core Concept: AI Assistants as Pipeline Execution Engines

The **AI assistant** serves as the pipeline execution engine, responsible for interpreting Agent definitions and generating artifacts. The core workflow includes five steps: first read `.factory/pipeline.yaml` to understand the stage order, then load the orchestrator to grasp execution constraints and permission check rules, next load the corresponding Agent definition file based on current state, then execute Agent commands to generate artifacts and verify exit conditions, and finally wait for user confirmation before proceeding to the next stage.

::: info Important: AI Assistant Must Support Agent Mode
Factory pipelines rely on AI assistants that can understand and execute complex Markdown instructions. All supported AI assistants (Claude Code, OpenCode, Cursor) have Agent mode capabilities.
:::

## Follow Along

### Step 1: Running Pipelines with OpenCode

#### Automatic Startup (Recommended)

If you have OpenCode CLI installed globally:

```bash
# Execute in project root directory
factory init
```

`factory init` will automatically detect and launch OpenCode, passing the following prompt:

```text
请阅读.factory/pipeline.yaml和.factory/agents/orchestrator.checkpoint.md，启动流水线，帮我将产品想法碎片转化为可运行的应用，接下来我将会输入想法碎片。注意：Agent引用的skills/和policies/文件需要先查找.factory/目录，再查找根目录。
```

**You should see**:
- Terminal displays `Starting OpenCode...`
- OpenCode window opens automatically
- Prompt already pasted in the input box

#### Manual Startup

If automatic startup fails, you can manually operate:

1. Open the OpenCode application
2. Open your Factory project directory
3. Copy the following prompt to the OpenCode input box:

```text
请阅读.factory/pipeline.yaml和.factory/agents/orchestrator.checkpoint.md，启动流水线，帮我将产品想法碎片转化为可运行的应用，接下来我将会输入想法碎片。注意：Agent引用的skills/和policies/文件需要先查找.factory/目录，再查找根目录。
```

4. Press Enter to execute

#### Continuing Pipeline Execution

If the pipeline has run to a certain stage, you can use the `factory run` command to continue:

```bash
# View current state and generate instructions
factory run

# Or start from a specific stage
factory run prd
```

OpenCode will display instructions similar to Claude Code:

```
🤖 AI Assistant Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Please:

1. Read .factory/pipeline.yaml
2. Read .factory/agents/orchestrator.checkpoint.md
3. Read .factory/config.yaml
4. Execute pipeline from: bootstrap

Note: Check .factory/ first for skills/policies/ references, then root directory.
```

### Step 2: Running Pipelines with Cursor

Cursor is a VS Code-based AI programming assistant that uses the Composer feature to run Factory pipelines.

#### Cursor Detection

The Factory CLI automatically detects the Cursor environment (via `CURSOR` or `CURSOR_API_KEY` environment variables).

#### Running with Composer

1. Open your Factory project directory in Cursor
2. Execute the `factory run` command:

```bash
factory run
```

3. The terminal will display Cursor-specific instructions:

```
🤖 Cursor Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Use Cursor Composer to:

1. @ReadFile .factory/pipeline.yaml
2. @ReadFile .factory/agents/orchestrator.checkpoint.md
3. @ReadFile .factory/config.yaml
   (Note: Check .factory/ first for skills/policies/ references)
4. Execute pipeline from: bootstrap
```

4. Copy these instructions to the Cursor Composer input box
5. Execute

#### Checkpoint ✅

- Cursor Composer window is open
- Pipeline starts executing, displaying current stage (e.g., `Running: bootstrap`)
- Artifacts generated (e.g., `input/idea.md`)

### Step 3: Understanding Command Formats Across AI Assistants

While the execution logic is the same, different AI assistants have slightly different command formats:

| Operation         | Claude Code Format       | Cursor Format             | Other AI Assistants (OpenCode, etc.) |
| ----------------- | ------------------------ | ------------------------- | ------------------------------------ |
| Read file         | `Read(filePath)`         | `@ReadFile filePath`      | `Read filePath`                      |
| Read multiple files | `Read(file1)`, `Read(file2)` | `@ReadFile file1`, `@ReadFile file2` | -                        |
| Write file        | `Write(filePath, content)` | Direct write              | -                                 |
| Execute Bash command | `Bash(command)`           | Direct execution          | -                                 |

::: tip Factory CLI Auto-Handles Formats
When you run `factory run`, the CLI automatically detects the current AI assistant type and generates the corresponding command format. You just need to copy and paste—no manual conversion required.
:::

### Step 4: Continuing from a Specific Stage

If the pipeline has completed previous stages, you can continue from any stage:

```bash
# Start from UI stage
factory run ui

# Start from Tech stage
factory run tech

# Start from Code stage
factory run code
```

The Factory CLI will display the current pipeline status:

```
Pipeline Status:
────────────────────────
Project: my-app
Status: Running
Current Stage: ui
Completed: bootstrap, prd

Available stages:
  ✓ bootstrap
  ✓ prd
  → ui
  ○ tech
  ○ code
  ○ validation
  ○ preview
```

### Step 5: Using `factory continue` to Save Tokens (Claude Code Only)

::: warning Note
The `factory continue` command currently supports **Claude Code only**. If you're using OpenCode or Cursor, use `factory run` to manually start a new session.
:::

To save tokens and avoid context accumulation, Claude Code supports multi-session execution:

```bash
# Open a new terminal window and execute
factory continue
```

**Execution Effect**:
- Reads current state (`.factory/state.json`)
- Automatically launches a new Claude Code window
- Continues from the last paused stage

**Use Cases**:
- Completed Bootstrap → PRD, want to start a new session for the UI stage
- Completed UI → Tech, want to start a new session for the Code stage
- Any scenario where you need to avoid long conversation history

## Common Pitfalls

### Issue 1: OpenCode Startup Failure

**Symptoms**: After executing `factory init`, OpenCode doesn't launch automatically.

**Causes**:
- OpenCode CLI not added to PATH
- OpenCode not installed

**Solutions**:

```bash
# Manually launch OpenCode
# Windows
%LOCALAPPDATA%\Programs\OpenCode\OpenCode.exe

# macOS
/Applications/OpenCode.app

# Linux (search by priority: /usr/bin/opencode first, then /usr/local/bin/opencode)
/usr/bin/opencode
# If the above path doesn't exist, try:
/usr/local/bin/opencode
```

Then manually copy and paste the prompt into OpenCode.

### Issue 2: Cursor Composer Not Recognizing Commands

**Symptoms**: Copy commands generated by `factory run` to Cursor Composer, but no response.

**Causes**:
- Cursor Composer's `@ReadFile` syntax requires exact matching
- File path might be incorrect

**Solutions**:
1. Confirm using `@ReadFile` instead of `Read` or `ReadFile`
2. Confirm file paths are relative to the project root
3. Try using absolute paths

**Examples**:

```text
# ✅ Correct
@ReadFile .factory/pipeline.yaml

# ❌ Incorrect
Read(.factory/pipeline.yaml)
@readfile .factory/pipeline.yaml
```

### Issue 3: Agent Fails to Reference Skill Files

**Symptoms**: Agent reports error finding `skills/bootstrap/skill.md` or `policies/failure.policy.md`.

**Causes**:
- Incorrect Agent lookup path order
- Both `.factory/` and root directory `skills/`, `policies/` exist in the project

**Solutions**:
All AI assistants follow the same lookup order:

1. **First search** `.factory/skills/` and `.factory/policies/`
2. **Fallback to root directory** `skills/` and `policies/`

Ensure:
- After Factory project initialization, `skills/` and `policies/` have been copied to `.factory/`
- Agent definition explicitly states: "Check `.factory/` directory first, then root directory"

### Issue 4: Pipeline State Out of Sync

**Symptoms**: AI assistant shows a stage as completed, but `factory run` still displays `running` status.

**Causes**:
- AI assistant manually updated `state.json`, inconsistent with CLI state
- Multiple windows modified the state file simultaneously

**Solutions**:
```bash
# Reset project state
factory reset

# Re-run the pipeline
factory run
```

::: warning Best Practice
Avoid running the same project's pipeline simultaneously in multiple AI assistant windows. This will cause state conflicts and artifact overwrites.
:::

## Key Takeaways

This lesson covered how to run Factory pipelines with OpenCode, Cursor, and other AI assistants:

**Core Points**:
- ✅ Factory supports multiple AI assistants (Claude Code, OpenCode, Cursor)
- ✅ `factory init` automatically detects and launches available AI assistants
- ✅ `factory run` generates corresponding commands based on the current AI assistant
- ✅ `factory continue` (Claude Code only) supports multi-session execution to save tokens
- ✅ All AI assistants follow the same execution logic, only command formats differ

**Key Files**:
- `.factory/pipeline.yaml` — Pipeline definition
- `.factory/agents/orchestrator.checkpoint.md` — Orchestrator rules
- `.factory/state.json` — Pipeline state

**Selection Recommendations**:
- Claude Code: Most stable Agent mode experience (recommended)
- OpenCode: First choice for cross-platform users
- Cursor: VS Code power users

## Next Up

> In the next lesson, we'll learn **[Required Plugin Installation](../plugins/)**.
>
> You will learn:
> - Why superpowers and ui-ux-pro-max plugins need to be installed
> - How to install plugins automatically or manually
> - How to handle plugin installation failures

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-29

| Function          | File Path                                                                                      | Line Range |
| ----------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| OpenCode launch   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215    |
| Claude Code launch | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147    |
| AI assistant detection | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L105-L124)     | 105-124    |
| Command generation | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L130-L183)     | 130-183    |

**Key Constants**:
- `CLAUDE_CODE` / `ANTHROPIC_API_KEY`: Claude Code environment variable detection (run.js:109-110)
- `CURSOR` / `CURSOR_API_KEY`: Cursor environment variable detection (run.js:114-115)
- `OPENCODE` / `OPENCODE_VERSION`: OpenCode environment variable detection (run.js:119-120)

**Key Functions**:
- `launchClaudeCode(projectDir)`: Launch Claude Code and pass prompt (init.js:119-147)
- `launchOpenCode(projectDir)`: Launch OpenCode, supports both CLI and executable methods (init.js:152-215)
- `detectAIAssistant()`: Detect current AI assistant type via environment variables (run.js:105-124)
- `getAssistantInstructions(assistant, ...)`: Generate corresponding commands based on AI assistant type (run.js:130-183)

</details>
