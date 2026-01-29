---
title: "Background Tasks: Parallel AI Agent Execution | oh-my-opencode"
sidebarTitle: "Background Tasks"
subtitle: "Background Tasks: Parallel AI Agent Execution"
description: "Learn how to run multiple AI agents in parallel with oh-my-opencode. Configure concurrency limits, manage task lifecycle, and get results efficiently."
tags:
  - "background-tasks"
  - "parallel-execution"
  - "concurrency"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 80
---

# Background Parallel Tasks: Working Like a Team

## What You'll Learn

- ✅ Launch multiple parallel background tasks, letting different AI agents work simultaneously
- ✅ Configure concurrency limits to avoid API rate limiting and cost overruns
- ✅ Get background task results without waiting for completion
- ✅ Cancel tasks to free up resources

## Your Current Challenge

**Only one person working at a time?**

Imagine this scenario:
- You need the **Explore** agent to find authentication implementations in the codebase
- Simultaneously have the **Librarian** agent research best practices
- And let the **Oracle** agent review the architecture design

If executed sequentially: Total time = 10 min + 15 min + 8 min = **33 minutes**

But what if you could run them in parallel? 3 agents working at the same time, total time = **max(10, 15, 8) = 15 minutes**, saving **54%** of your time.

**Problem**: By default, OpenCode can only handle one session at a time. To achieve parallelism, you need to manually manage multiple windows or wait for tasks to complete.

**Solution**: oh-my-opencode's background task system can run multiple AI agents simultaneously and track their progress in the background, letting you continue with other work.

## When to Use This Approach

Scenarios where using the background task system can boost efficiency:

| Scenario | Example | Value |
|--- | --- | ---|
| **Parallel Research** | Explore finding implementations + Librarian consulting docs | 3x faster research completion |
| **Multi-Expert Review** | Oracle reviewing architecture + Momus validating plans | Get multi-perspective feedback quickly |
| **Async Tasks** | Perform code review while submitting Git commit | Don't block the main flow |
| **Resource Constraints** | Limit concurrency to avoid API rate limiting | Control cost and stability |

::: tip Ultrawork Mode
Adding `ultrawork` or `ulw` to your prompt automatically activates maximum performance mode, including all professional agents and parallel background tasks. No manual configuration needed.
:::

## 🎒 Prerequisites

::: warning Prerequisites

Before starting this tutorial, ensure:
1. oh-my-opencode is installed (see [Installation Tutorial](../../start/installation/))
2. Basic configuration is complete with at least one AI Provider available
3. You understand basic usage of Sisyphus orchestrator (see [Sisyphus Tutorial](../sisyphus-orchestrator/))

:::

## Core Concepts

The background task system's working principle can be summarized in three core concepts:

### 1. Parallel Execution

The background task system allows you to launch multiple AI agent tasks simultaneously, with each task running in an independent session. This means:

- **Explore** searching code
- **Librarian** consulting documentation
- **Oracle** reviewing design

Three tasks running in parallel, with total time equal to the slowest task.

### 2. Concurrency Control

To avoid launching too many tasks at once leading to API rate limiting or cost overruns, the system provides three levels of concurrency limits:

```
Priority: Model > Provider > Default

Example configuration:
modelConcurrency:     claude-opus-4-5 → 2
providerConcurrency:  anthropic → 3
defaultConcurrency:   all → 5
```

**Rules**:
- If a model-level limit is specified, use that limit
- Otherwise, if a provider-level limit is specified, use that limit
- Otherwise, use the default limit (default value is 5)

### 3. Polling Mechanism

The system checks task status every 2 seconds to determine if tasks are completed. Completion conditions:

- **Session idle** (session.idle event)
- **Stability detection**: Message count unchanged for 3 consecutive polls
- **TODO list empty**: All tasks are completed

## Follow Along

### Step 1: Launch Background Tasks

Use the `delegate_task` tool to launch background tasks:

```markdown
Launch parallel background tasks:

1. Explore finds authentication implementations
2. Librarian researches best practices
3. Oracle reviews architecture design

Execute in parallel:
```

**Why**
This is the most classic use case for demonstrating background tasks. Three tasks can proceed simultaneously, significantly saving time.

**You Should See**
The system will return 3 task IDs:

```
Background task launched successfully.

Task ID: bg_abc123
Session ID: sess_xyz789
Description: Explore: 查找认证实现
Agent: explore
Status: pending
...

Background task launched successfully.

Task ID: bg_def456
Session ID: sess_uvwx012
Description: Librarian: 研究最佳实践
Agent: librarian
Status: pending
...
```

::: info Task Status Explanation
- **pending**: Queued waiting for concurrency slot
- **running**: Currently executing
- **completed**: Completed
- **error**: Encountered an error
- **cancelled**: Cancelled
:::

### Step 2: Check Task Status

Use the `background_output` tool to view task status:

```markdown
Check status of bg_abc123:
```

**Why**
Understand whether the task is completed or still running. By default, it doesn't wait and returns status immediately.

**You Should See**
If the task is still running:

```
## Task Status

| Field | Value |
|--- | ---|
| Task ID | `bg_abc123` |
| Description | Explore: 查找认证实现 |
| Agent | explore |
| Status | **running** |
| Duration | 2m 15s |
| Session ID | `sess_xyz789` |

> **Note**: No need to wait explicitly - system will notify you when this task completes.

## Original Prompt

查找 src/auth 目录下的认证实现，包括登录、注册、Token 管理等
```

If the task is completed:

```
Task Result

Task ID: bg_abc123
Description: Explore: 查找认证实现
Duration: 5m 32s
Session ID: sess_xyz789

---

找到了 3 个认证实现：
1. `src/auth/login.ts` - JWT 认证
2. `src/auth/register.ts` - 用户注册
3. `src/auth/token.ts` - Token 刷新
...
```

### Step 3: Configure Concurrency Control

Edit `~/.config/opencode/oh-my-opencode.json`:

```jsonc
{
  "$schema": "https://code-yeongyu.github.io/oh-my-opencode/schema.json",

  "background_task": {
    // Provider-level concurrency limits (recommended settings)
    "providerConcurrency": {
      "anthropic": 3,     // Anthropic models max 3 at once
      "openai": 2,         // OpenAI models max 2 at once
      "google": 2          // Google models max 2 at once
    },

    // Model-level concurrency limits (highest priority)
    "modelConcurrency": {
      "claude-opus-4-5": 2,    // Opus 4.5 max 2 at once
      "gpt-5.2": 2              // GPT 5.2 max 2 at once
    },

    // Default concurrency limit (used when nothing above is configured)
    "defaultConcurrency": 3
  }
}
```

**Why**
Concurrency control is key to preventing cost overruns. If you don't set limits and launch 10 Opus 4.5 tasks simultaneously, you might instantly consume a large amount of API quota.

::: tip Recommended Settings
For most scenarios, recommended settings:
- `providerConcurrency.anthropic: 3`
- `providerConcurrency.openai: 2`
- `defaultConcurrency: 5`
:::

**You Should See**
After configuration takes effect, when launching background tasks:
- If concurrency limit is reached, tasks will enter **pending** status and queue
- Once a task completes, queued tasks will automatically start

### Step 4: Cancel Tasks

Use the `background_cancel` tool to cancel tasks:

```markdown
Cancel all background tasks:
```

**Why**
Sometimes tasks get stuck or are no longer needed; you can actively cancel them to free up resources.

**You Should See**

```
Cancelled 3 background task(s):

| Task ID | Description | Status | Session ID |
|--- | --- | --- | ---|
| `bg_abc123` | Explore: 查找认证实现 | running | `sess_xyz789` |
| `bg_def456` | Librarian: 研究最佳实践 | running | `sess_uvwx012` |
| `bg_ghi789` | Oracle: 审查架构设计 | pending | (not started) |

## Continue Instructions

To continue a cancelled task, use:

    delegate_task(session_id="<session_id>", prompt="Continue: <your follow-up>")

Continuable sessions:
- `sess_xyz789` (Explore: 查找认证实现)
- `sess_uvwx012` (Librarian: 研究最佳实践)
```

## Checkpoint ✅

Confirm you understand the following points:

- [ ] Can launch multiple parallel background tasks
- [ ] Understand task statuses (pending, running, completed)
- [ ] Have configured reasonable concurrency limits
- [ ] Can view and get task results
- [ ] Can cancel unnecessary tasks

## Common Pitfalls

### Pitfall 1: Forgetting to Configure Concurrency Limits

**Symptom**: Too many tasks launched, API quota instantly exhausted, or hit Rate Limit.

**Solution**: Configure `providerConcurrency` or `defaultConcurrency` in `oh-my-opencode.json`.

### Pitfall 2: Polling for Results Too Frequently

**Symptom**: Calling `background_output` every few seconds to check task status, adding unnecessary overhead.

**Solution**: The system will automatically notify you when tasks complete. Only manually check when you actually need intermediate results.

### Pitfall 3: Task Timeout

**Symptom**: Tasks are automatically canceled after running for more than 30 minutes.

**Reason**: Background tasks have a 30-minute TTL (timeout).

**Solution**: If you need long-running tasks, consider splitting into multiple sub-tasks, or use `delegate_task(background=false)` to run in the foreground.

### Pitfall 4: Pending Tasks Never Start

**Symptom**: Task status remains `pending`, never entering `running`.

**Reason**: Concurrency limit is full, no available slots.

**Solution**:
- Wait for existing tasks to complete
- Increase concurrency limit configuration
- Cancel unnecessary tasks to free up slots

## Summary

The background task system lets you work like a real team, with multiple AI agents executing tasks in parallel:

1. **Launch Parallel Tasks**: Use `delegate_task` tool
2. **Control Concurrency**: Configure `providerConcurrency`, `modelConcurrency`, `defaultConcurrency`
3. **Get Results**: Use `background_output` tool (system automatically notifies)
4. **Cancel Tasks**: Use `background_cancel` tool

**Core Rules**:
- Poll task status every 2 seconds
- Task completes when stable for 3 consecutive times or idle
- Tasks auto-timeout after 30 minutes
- Priority: modelConcurrency > providerConcurrency > defaultConcurrency

## Coming Up Next

> In the next lesson, we'll learn **[LSP and AST-Grep: Code Refactoring Tools](../lsp-ast-tools/)**.
>
> You'll learn:
> - How to use LSP tools for code navigation and refactoring
> - How to use AST-Grep for precise pattern search and replacement
> - Best practices for combining LSP and AST-Grep

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-26

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1378 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | 1-138 |
| delegate_task tool | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 51-119 |
| background_output tool | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 320-384 |
| background_cancel tool | [`src/tools/background-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/background-task/tools.ts) | 386-514 |

**Key Constants**:
- `TASK_TTL_MS = 30 * 60 * 1000`: Task timeout (30 minutes)
- `MIN_STABILITY_TIME_MS = 10 * 1000`: Stability detection start time (10 seconds)
- `DEFAULT_STALE_TIMEOUT_MS = 180_000`: Default timeout (3 minutes)
- `MIN_IDLE_TIME_MS = 5000`: Minimum time to ignore early idle (5 seconds)

**Key Classes**:
- `BackgroundManager`: Background task manager, responsible for launching, tracking, polling, and completing tasks
- `ConcurrencyManager`: Concurrency control manager, implements three-level priority (model > provider > default)

**Key Functions**:
- `BackgroundManager.launch()`: Launch background task
- `BackgroundManager.pollRunningTasks()`: Poll task status every 2 seconds (line 1182)
- `BackgroundManager.tryCompleteTask()`: Safely complete task, prevent race conditions (line 909)
- `ConcurrencyManager.getConcurrencyLimit()`: Get concurrency limit (line 24)
- `ConcurrencyManager.acquire()` / `ConcurrencyManager.release()`: Acquire/release concurrency slot (lines 41, 71)

</details>
