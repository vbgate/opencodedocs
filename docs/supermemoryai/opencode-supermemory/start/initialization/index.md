---
title: "Project Init: Build AI Memory | opencode-supermemory"
sidebarTitle: "Project Init"
subtitle: "Project Initialization: Making a First Impression"
description: "Learn to build cross-session AI memory with /supermemory-init. Auto-scan codebase to extract architecture, tech stack, and coding conventions."
tags:
  - "Initialization"
  - "Memory Generation"
  - "Workflow"
prerequisite:
  - "start-getting-started"
order: 2
---

# Project Initialization: Making a First Impression

## What You'll Learn

- **One-Click Familiarity**: Enable the Agent to actively explore and understand the entire codebase like a new employee.
- **Build Long-Term Memory**: Automatically extract project technology stack, architectural patterns, and coding conventions into Supermemory.
- **Eliminate Repetitive Explanations**: Never repeat "We use Bun" or "All components must have tests" at the start of every session again.

## The Current Dilemma

Have you encountered these situations?

- **Repetitive Labor**: Spending significant effort explaining basic project details every time you start a new session.
- **Context Amnesia**: The Agent frequently forgets specific directory structures, creating files in the wrong locations.
- **Inconsistent Standards**: The Agent's coding style fluctuates, switching between `interface` and `type` randomly.

## When to Use This

- **Immediately After Installation**: This is the first step in using opencode-supermemory.
- **Taking Over a New Project**: Quickly establish a memory bank for the project.
- **After Major Refactoring**: When the project architecture changes and the Agent's knowledge needs updating.

## 🎒 Preparation

::: warning Prerequisite Check
Please ensure you have completed the installation and configuration steps in [Getting Started](./../getting-started/index.md), and that your `SUPERMEMORY_API_KEY` is correctly set.
:::

## Core Concept

The `/supermemory-init` command is not essentially a binary program, but a **carefully crafted Prompt**.

When you run this command, it sends a detailed "onboarding guide" to the Agent, instructing it to:

1.  **Deep Research**: Actively read `README.md`, `package.json`, Git commit history, etc.
2.  **Structured Analysis**: Identify the project's technology stack, architectural patterns, and implicit conventions.
3.  **Persistent Storage**: Use the `supermemory` tool to save these insights into the cloud database.

::: info Memory Scopes
The initialization process distinguishes between two types of memory:
- **Project Scope**: Applies only to the current project (e.g., build commands, directory structure).
- **User Scope**: Applies to all your projects (e.g., your preferred coding style).
:::

## Follow Along

### Step 1: Run the Initialization Command

In the OpenCode input box, enter the following command and send:

```bash
/supermemory-init
```

**Why**
This loads the predefined Prompt, triggering the Agent's exploration mode.

**What You Should See**
The Agent will reply, indicating it understands the task and is planning the research steps. It might say: "I will start by exploring the codebase structure and configuration files..."

### Step 2: Observe the Exploration Process

The Agent will automatically execute a series of operations; you just need to watch. It typically will:

1.  **Read Config Files**: Read `package.json`, `tsconfig.json`, etc., to understand the tech stack.
2.  **Check Git History**: Run `git log` to understand commit conventions and active contributors.
3.  **Explore Directory Structure**: Use `ls` or `list_files` to view the project layout.

**Example Output**:
```
[Agent] Reading package.json to identify dependencies...
[Agent] Running git log to understand commit conventions...
```

::: tip Consumption Note
This process is a deep investigation and may consume a significant number of Tokens (usually involving 50+ tool calls). Please be patient until the Agent reports completion.
:::

### Step 3: Verify Generated Memories

When the Agent indicates initialization is complete, you can check what it has actually remembered. Enter:

```bash
/ask List memories for the current project
```

Or call the tool directly (if you want to see raw data):

```
supermemory(mode: "list", scope: "project")
```

**What You Should See**
The Agent lists a series of structured memories, for example:

| Type | Example Content |
|--- | ---|
| `project-config` | "Uses Bun runtime. Build command: bun run build" |
| `architecture` | "API routes are located in src/routes/, using Hono framework" |
| `preference` | "Strict TypeScript usage: no 'any' type allowed" |

### Step 4: Fill in Gaps (Optional)

If the Agent missed key information (like a special rule that is only a verbal agreement), you can manually add it:

```
Please remember: In this project, all date handling must use the dayjs library; native Date is prohibited.
```

**What You Should See**
The Agent replies with confirmation and calls `supermemory(mode: "add")` to save this new rule.

## Checkpoint ✅

- [ ] Did the Agent automatically execute exploration tasks after running `/supermemory-init`?
- [ ] Can you view the newly generated memories using the `list` command?
- [ ] Do the memory contents accurately reflect the actual state of the current project?

## Pitfalls to Avoid

::: warning Do Not Run Frequently
Initialization is a time-consuming and Token-intensive process. Usually, it only needs to be run once per project. Re-run only when the project undergoes significant changes.
:::

::: danger Privacy Notice
Although the plugin automatically sanitizes content in `<private>` tags, the Agent reads a large number of files during initialization. Please ensure your codebase does not contain hardcoded sensitive keys (like AWS Secret Keys), otherwise, they might be stored in memory as "project configuration".
:::

## Summary

Through `/supermemory-init`, we have completed the transformation from "stranger" to "skilled worker". Now, the Agent has memorized the project's core architecture and conventions. In subsequent coding tasks, it will automatically utilize this context to provide you with more precise assistance.

## What's Next

> Next, we will learn about the **[Automatic Context Injection Mechanism](./../../core/context-injection/index.md)**.
>
> You will learn:
> - How the Agent "remembers" these memories at the start of a session.
> - How to trigger specific memory recall via keywords.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source location</strong></summary>

> Last Updated: 2026-01-23

| Feature | File Path | Line Number |
|--- | --- | ---|
| Initialization Prompt Definition | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L13-L163) | 13-163 |
| Memory Tool Implementation | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |

**Key Constants**:
- `SUPERMEMORY_INIT_COMMAND`: Defines the specific Prompt content for the `/supermemory-init` command, guiding the Agent on how to conduct research and memorization.

</details>
