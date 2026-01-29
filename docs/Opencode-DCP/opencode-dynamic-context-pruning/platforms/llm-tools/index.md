---
title: "LLM 工具: AI 智能修剪 | opencode-dynamic-context-pruning"
sidebarTitle: "LLM 工具"
subtitle: "LLM-Driven Pruning Tools: Let AI Intelligently Optimize Context"
description: "学习 DCP 的 AI 修剪工具使用方法。掌握 discard 和 extract 两种工具的区别，配置修剪开关和显示选项，通过保护机制防止误删关键内容，优化 Token 使用效率。"
tags:
  - "DCP"
  - "Context Pruning"
  - "AI Tools"
  - "Token Optimization"
prerequisite:
  - "start-configuration"
order: 2
---

# LLM-Driven Pruning Tools: Let AI Intelligently Optimize Context

## What You'll Learn

- Understand the differences and use cases of discard and extract tools
- Know how AI selects content to prune through the `<prunable-tools>` list
- Configure pruning tool switches, reminder frequency, and display options
- Understand how protection mechanisms prevent accidental pruning of critical files

## Your Current Challenge

As conversations deepen and tool calls accumulate, context grows larger. You may encounter:
- Surge in Token usage, rising costs
- AI needs to process large amounts of irrelevant old tool outputs
- Unsure how to let AI proactively clean up context

Traditional solutions require manual cleanup, which interrupts conversation flow. DCP offers a better approach: let AI autonomously decide when to clean up context.

## When to Use This

When you:
- Frequently engage in long conversations with accumulated tool calls
- Find AI needs to process large amounts of historical tool outputs
- Want to optimize Token usage costs without interrupting conversations
- Want to choose whether to keep or delete content based on specific scenarios

## Core Concept

DCP provides two tools that allow AI to proactively optimize context during conversations:

| Tool | Purpose | Keep Content? |
|-----|---------|---------------|
| **discard** | Remove completed tasks or noise | ❌ No |
| **extract** | Extract key findings then delete original content | ✅ Yes, keep condensed info |

### How It Works

Each time AI prepares to send a message, DCP will:

```
1. Scan tool calls in current session
   ↓
2. Filter pruned and protected tools
   ↓
3. Generate <prunable-tools> list
   Format: ID: tool, parameter
   ↓
4. Inject list into context
   ↓
5. AI selects tools based on list and calls discard/extract
   ↓
6. DCP replaces pruned content with placeholders
```

### Tool Selection Decision Logic

AI will choose based on this flow:

```
"Does this tool output need to retain information?"
  │
  ├─ No → discard (default cleanup method)
  │   - Task completed, no valuable content
  │   - Noise, irrelevant information
  │
  ├─ Yes → extract (retain knowledge)
  │   - Key information needed for later reference
  │   - Function signatures, configuration values, etc.
  │
  └─ Unsure → extract (safer)
```

::: info
AI prunes in batches rather than pruning individual tiny tool outputs. This is more efficient.
:::

### Protection Mechanism

DCP has multiple layers of protection to prevent AI from accidentally pruning critical content:

| Protection Layer | Description | Configuration |
|-----------------|-------------|---------------|
| **Protected Tools** | Core tools like task, write, edit cannot be pruned | `tools.settings.protectedTools` |
| **Protected Files** | File paths matching glob patterns cannot be pruned | `protectedFilePatterns` |
| **Turn Protection** | New tools won't be added to pruning list within N turns | `turnProtection.turns` |

::: tip
Default protected tools include: task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
:::

## Follow Along

### Step 1: Understand the `<prunable-tools>` List

During conversations, DCP automatically injects the `<prunable-tools>` list. AI sees content like this:

```xml
<prunable-tools>
The following tools have been invoked and are available for pruning.
This list does not mandate immediate action.
Consider your current goals and resources you need before discarding valuable tool inputs or outputs.
Consolidate your prunes for efficiency; it is rarely worth pruning a single tiny tool output.
Keep your context free of noise.

5: read, /path/to/auth.ts
12: bash, npm test
18: grep, "function login"
</prunable-tools>
```

**You should see**:
- One tool per line, format is `ID: tool, parameter`
- ID is a numeric index (starting from 0)
- Only prunable tools are shown (already pruned, protected, protected files won't appear)

### Step 2: View AI Using discard

When AI completes a task and determines no information needs to be retained:

```
User input: Test authentication functionality

AI output:
Tests passed. Authentication logic works correctly, no need to keep test logs.
[Call discard(ids: ["completion", "5", "12"])]
```

**You should see**:
- AI used the `discard` tool
- Parameter format: `["reason", "ID1", "ID2", ...]`
- Only two reasons: `"completion"` (task completed) or `"noise"` (noise)

### Step 3: View AI Using extract

When AI needs to retain key information after completing a task:

```
User input: Analyze authentication service implementation

AI output:
I discovered some key details, extracted as follows:
[Call extract(ids: ["5", "12"], distillation: [
  "auth.ts: validateToken checks cache (5min TTL) then calls OIDC",
  "bash: npm test results - all tests passed"
])]
```

**You should see**:
- AI used the `extract` tool
- `distillation` array has same length as `ids` array
- Each extracted content corresponds to condensed information from one tool output

### Step 4: Configure Pruning Tool Options

Edit DCP configuration file (`~/.config/opencode/dcp.jsonc` or project-level `.opencode/dcp.jsonc`):

```jsonc
{
  "tools": {
    "discard": {
      "enabled": true
    },
    "extract": {
      "enabled": true,
      "showDistillation": false
    },
    "settings": {
      "nudgeEnabled": true,
      "nudgeFrequency": 10,
      "protectedTools": [
        "task",
        "todowrite",
        "todoread",
        "discard",
        "extract",
        "batch",
        "write",
        "edit",
        "plan_enter",
        "plan_exit"
      ]
    }
  }
}
```

**You should see**:
- `discard.enabled`: Enable discard tool (default true)
- `extract.enabled`: Enable extract tool (default true)
- `extract.showDistillation`: Whether to show extracted content (default false)
- `nudgeEnabled`: Enable pruning reminder (default true)
- `nudgeFrequency`: Reminder frequency (default 10, meaning every 10 tool calls)

**You should see**:
- If `showDistillation` is false, extracted content won't display in conversation
- If `showDistillation` is true, extracted content displays as ignored message

### Step 5: Test Pruning Functionality

1. Engage in a longer conversation, triggering multiple tool calls
2. Observe if AI calls discard or extract at appropriate times
3. Use `/dcp stats` to view pruning statistics

**You should see**:
- After tool calls accumulate to a certain amount, AI starts proactive pruning
- `/dcp stats` shows saved Token count
- Conversation context becomes more focused on current tasks

## Checkpoint ✅

::: details Click to expand and verify your configuration

**Check if configuration is effective**

```bash
# View DCP configuration
cat ~/.config/opencode/dcp.jsonc

# Or project-level configuration
cat .opencode/dcp.jsonc
```

You should see:
- `tools.discard.enabled` is true (discard enabled)
- `tools.extract.enabled` is true (extract enabled)
- `tools.settings.nudgeEnabled` is true (reminder enabled)

**Check if pruning works**

In conversation, after triggering multiple tool calls:

You should see:
- AI calls discard or extract at appropriate times
- Receive pruning notification (shows pruned tools and saved Tokens)
- `/dcp stats` shows cumulative saved Tokens

:::

## Common Pitfalls

### Issue 1: AI Not Pruning Tools

**Possible causes**:
- Pruning tools not enabled
- Protection configuration too strict, no prunable tools

**Solution**:
```jsonc
{
  "tools": {
    "discard": {
      "enabled": true  // Ensure enabled
    },
    "extract": {
      "enabled": true  // Ensure enabled
    }
  }
}
```

### Issue 2: Accidentally Pruned Critical Content

**Possible causes**:
- Critical files not added to protection mode
- Protected tools list incomplete

**Solution**:
```jsonc
{
  "protectedFilePatterns": [
    "src/auth/*",  // Protect authentication-related files
    "config/*"     // Protect configuration files
  ],
  "tools": {
    "settings": {
      "protectedTools": [
        "read",  // Add read to protection list
        "write"
      ]
    }
  }
}
```

### Issue 3: Cannot See Extracted Content

**Possible causes**:
- `showDistillation` configured as false

**Solution**:
```jsonc
{
  "tools": {
    "extract": {
      "showDistillation": true  // Enable display
    }
  }
}
```

::: warning
Extracted content displays as ignored message form, not affecting conversation context.
:::

## Summary

DCP provides two tools for AI to autonomously optimize context:

- **discard**: Remove completed tasks or noise, no need to retain information
- **extract**: Extract key findings then delete original content, retain condensed information

AI learns prunable tools through the `<prunable-tools>` list and selects appropriate tools based on scenarios. Protection mechanisms ensure critical content won't be accidentally pruned.

Configuration highlights:
- Enable tools: `tools.discard.enabled` and `tools.extract.enabled`
- Display extracted content: `tools.extract.showDistillation`
- Adjust reminder frequency: `tools.settings.nudgeFrequency`
- Protect critical tools and files: `protectedTools` and `protectedFilePatterns`

## Coming Up Next

> In the next lesson, we'll learn **[Slash Commands](../commands/)**
>
> You'll learn:
> - Use `/dcp context` to view current session Token distribution
> - Use `/dcp stats` to view cumulative pruning statistics
> - Use `/dcp sweep` to manually trigger pruning

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Line Range |
|---------|-----------|------------|
| discard tool definition | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L180) | 155-180 |
| extract tool definition | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| Pruning operation execution | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L26-L153) | 26-153 |
| prunable-tools list generation | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L53-L100) | 53-100 |
| Pruning context injection | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L102-L156) | 102-156 |
| discard tool specification | [`lib/prompts/discard-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/discard-tool-spec.ts#L1-L41) | 1-41 |
| extract tool specification | [`lib/prompts/extract-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/extract-tool-spec.ts#L1-L48) | 1-48 |
| System prompt (both) | [`lib/prompts/system/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/system/both.ts#L1-L60) | 1-60 |
| Nudge prompt | [`lib/prompts/nudge/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/nudge/both.ts#L1-L10) | 1-10 |
| Configuration definition | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L436-L449) | 436-449 |
| Default protected tools | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-L441) | 438-441 |

**Key Constants**:
- `DISCARD_TOOL_DESCRIPTION`: Description prompt for discard tool
- `EXTRACT_TOOL_DESCRIPTION`: Description prompt for extract tool
- `DEFAULT_PROTECTED_TOOLS`: Default protected tools list

**Key Functions**:
- `createDiscardTool(ctx)`: Create discard tool
- `createExtractTool(ctx)`: Create extract tool
- `executePruneOperation(ctx, toolCtx, ids, reason, toolName, distillation)`: Execute pruning operation
- `buildPrunableToolsList(state, config, logger, messages)`: Generate prunable tools list
- `insertPruneToolContext(state, config, logger, messages)`: Inject pruning context

**Configuration Items**:
- `tools.discard.enabled`: Whether to enable discard tool (default true)
- `tools.extract.enabled`: Whether to enable extract tool (default true)
- `tools.extract.showDistillation`: Whether to show extracted content (default false)
- `tools.settings.nudgeEnabled`: Whether to enable reminder (default true)
- `tools.settings.nudgeFrequency`: Reminder frequency (default 10)
- `tools.settings.protectedTools`: Protected tools list
- `protectedFilePatterns`: Protected file glob patterns

</details>
