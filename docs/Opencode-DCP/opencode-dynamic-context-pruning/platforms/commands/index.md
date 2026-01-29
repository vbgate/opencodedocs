---
title: "命令: 监控与手动修剪 | opencode-dynamic-context-pruning"
sidebarTitle: "命令"
subtitle: "命令: 监控与手动修剪"
description: "掌握 DCP 的四个命令：查看会话分布、统计修剪效果和手动清理工具。"
tags:
  - "DCP Commands"
  - "Token Monitoring"
  - "Manual Pruning"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 3
---

# DCP Command Guide: Monitor and Manual Pruning

## What You'll Learn

- Use `/dcp context` to view current session's token usage distribution
- Use `/dcp stats` to view cumulative pruning statistics
- Use `/dcp sweep [n]` to manually trigger pruning
- Understand protected tools and files protection mechanisms
- Learn token calculation strategies and savings effectiveness

## Your Current Challenge

In long conversations, token consumption accelerates, but you don't know:
- Where are the tokens being spent in the current session?
- How much has DCP actually saved for you?
- How to manually clean up tool outputs that are no longer needed?
- Which tools are protected and won't be pruned?

Without understanding these issues, you may not fully leverage DCP's optimization effects, and you might accidentally delete important information at critical moments.

## When to Use This

When you:
- Want to understand the token composition of the current session
- Need to quickly clean up conversation history
- Want to verify DCP's pruning effectiveness
- Want to clean up context before starting a new task

## Core Concept

DCP provides 4 slash commands to help you monitor and control token usage:

| Command | Purpose | Use Case |
|---------|---------|----------|
| `/dcp` | Display help | View when you forget commands |
| `/dcp context` | Analyze current session token distribution | Understand context composition |
| `/dcp stats` | View cumulative pruning statistics | Verify long-term effects |
| `/dcp sweep [n]` | Manual tool pruning | Quickly reduce context size |

**Protection Mechanism**:

All pruning operations automatically skip:
- **Protected Tools**: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- **Protected Files**: File paths matching `protectedFilePatterns` in configuration

::: info
Protected tools and protected file settings can be customized through configuration files. See [Configuration Guide](../../start/configuration/) for details.
:::

## Follow Along

### Step 1: View Help Information

Type `/dcp` in the OpenCode chat box.

**You should see**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

**Checkpoint ✅**: Confirm you see the descriptions of 3 subcommands.

### Step 2: Analyze Current Session Token Distribution

Type `/dcp context` to view the current session's token usage.

**You should see**:

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Token Category Explanation**:

| Category | Calculation | Description |
|----------|-------------|-------------|
| **System** | `firstAssistant.input + cache.read - tokenizer(firstUserMessage)` | System prompt |
| **Tools** | `tokenizer(toolInputs + toolOutputs) - prunedTokens` | Tool calls (pruned portion deducted) |
| **User** | `tokenizer(all user messages)` | All user messages |
| **Assistant** | `total - system - user - tools` | AI text output + reasoning tokens |

**Checkpoint ✅**: Confirm you see the percentage and token count for each category.

### Step 3: View Cumulative Pruning Statistics

Type `/dcp stats` to view the historical cumulative pruning effectiveness.

**You should see**:

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.2K
  Tools pruned:   12

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~284.5K
  Tools pruned:   156
  Sessions:       8
```

**Statistics Explanation**:
- **Session**: Pruning data for current session (in memory)
- **All-time**: Cumulative data for all historical sessions (disk persisted)

**Checkpoint ✅**: Confirm you see pruning statistics for current session and historical cumulative data.

### Step 4: Manual Tool Pruning

There are two ways to use `/dcp sweep`:

#### Method 1: Prune All Tools Since Last User Message

Type `/dcp sweep` (without parameters).

**You should see**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept 8 tool(s) since previous user message.
Tokens saved: ~12,345

  • Read: src/config.ts
  • Read: src/utils.ts
  • Bash: npm test
  • Read: package.json
  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
```

#### Method 2: Prune Last N Tools

Type `/dcp sweep 5` to prune the last 5 tools.

**You should see**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept last 5 tool(s).
Tokens saved: ~7,892

  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
  • Bash: npm run build
```

**Protected Tools Prompt**:

If protected tools were skipped, the output will display:

```
Swept 5 tool(s).
Tokens saved: ~7,892
(2 protected tool(s) skipped)
```

::: warning
Protected tools (like `write`, `edit`) and protected file paths are automatically skipped and will not be pruned.
:::

**Checkpoint ✅**: Confirm you see the list of pruned tools and the amount of saved tokens.

### Step 5: Review Pruning Effectiveness Again

After pruning, type `/dcp context` again to view the new token distribution.

**You should see**:
- `Tools` category percentage decreased
- Increased number of pruned tools in `Summary`
- Reduced `Current context` total

**Checkpoint ✅**: Confirm token usage has significantly decreased.

## Common Pitfalls

### ❌ Mistake: Accidentally Deleting Important Tools

**Scenario**: You just used the `write` tool to create a critical file, then executed `/dcp sweep`.

**Wrong Result**: The `write` tool is pruned, and the AI may not know the file was created.

**Correct Approach**:
- Tools like `write`, `edit` are protected by default
- Don't manually modify `protectedTools` configuration to remove these tools
- Wait a few turns after completing critical tasks before cleaning up

### ❌ Mistake: Pruning at the Wrong Time

**Scenario**: The conversation just started, and you execute `/dcp sweep` with only a few tool calls.

**Wrong Result**: Very few tokens saved, and context coherence may be affected.

**Correct Approach**:
- Wait until the conversation progresses to a certain extent (e.g., 10+ tool calls) before cleaning
- Clean up previous round's tool outputs before starting a new task
- Use `/dcp context` to determine if cleaning is worthwhile

### ❌ Mistake: Over-relying on Manual Pruning

**Scenario**: You manually execute `/dcp sweep` in every conversation.

**Wrong Result**:
- Automatic pruning strategies (deduplication, overwrite writes, error clearing) are wasted
- Increases operational burden

**Correct Approach**:
- Keep automatic pruning strategies enabled by default (config: `strategies.*.enabled`)
- Use manual pruning as a supplement only when necessary
- Verify automatic pruning effectiveness through `/dcp stats`

## Summary

DCP's 4 commands help you monitor and control token usage:

| Command | Core Function |
|---------|---------------|
| `/dcp` | Display help information |
| `/dcp context` | Analyze current session token distribution |
| `/dcp stats` | View cumulative pruning statistics |
| `/dcp sweep [n]` | Manual tool pruning |

**Token Calculation Strategy**:
- System: System prompt (calculated from first response)
- Tools: Tool inputs and outputs (pruned portion deducted)
- User: All user messages (estimated)
- Assistant: AI output + reasoning tokens (residual)

**Protection Mechanism**:
- Protected tools: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- Protected files: Configured glob patterns
- All pruning operations automatically skip these contents

**Best Practices**:
- Regularly view `/dcp context` to understand token composition
- Execute `/dcp sweep` before new tasks to clean up history
- Rely on automatic pruning, use manual pruning as a supplement
- Verify long-term effectiveness through `/dcp stats`

## Next Lesson Preview

> Next, we'll learn **[Protection Mechanism](../../advanced/protection/)**.
>
> You'll learn:
> - How turn protection prevents accidental pruning
> - How to customize the protected tools list
> - Protected file pattern configuration methods
> - Special handling for subagent sessions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Line Number |
|----------|-----------|-------------|
| /dcp help command | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 19-32 |
| /dcp context command | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 238-247 |
| Token calculation strategy | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 5-38 |
| /dcp stats command | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| /dcp sweep command | [`lib/commands/sweep.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/sweep.ts) | 123-259 |
| Protected tools configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 461 |
| Default protected tools list | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 150-151 |

**Key Constants**:
- `DEFAULT_PROTECTED_TOOLS`: Default protected tools list

**Key Functions**:
- `handleHelpCommand()`: Handle /dcp help command
- `handleContextCommand()`: Handle /dcp context command
- `analyzeTokens()`: Calculate token count for each category
- `handleStatsCommand()`: Handle /dcp stats command
- `handleSweepCommand()`: Handle /dcp sweep command
- `buildToolIdList()`: Build tool ID list

</details>
