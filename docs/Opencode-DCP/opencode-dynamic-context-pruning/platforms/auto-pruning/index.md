---
title: "Pruning Strategies | DCP"
sidebarTitle: "Auto-Pruning"
subtitle: "Pruning Strategies | DCP"
description: "Learn three pruning strategies: deduplication, write superseding, and error purging to optimize context and save tokens."
tags:
  - "Auto-Pruning"
  - "Strategies"
  - "Deduplication"
  - "Write Superseding"
  - "Error Purging"
prerequisite:
  - "start-getting-started"
  - "start-configuration"
order: 1
---

# Auto-Pruning Strategies Explained

## What You'll Learn

- Understand the working principles of three auto-pruning strategies
- Know when to enable or disable each strategy
- Optimize strategy effectiveness through configuration

## Your Current Challenge

As conversations grow longer, tool calls in the context pile up:
- AI repeatedly reads the same file, stuffing the complete content into the context each time
- After writing files then reading them, the original write content remains in the context "collecting dust"
- After tool call failures, large input parameters continue occupying space

These issues cause token bills to grow larger and may "pollute" the context, affecting AI judgment.

## Core Concept

DCP provides three **auto-pruning strategies** that execute silently before each request, with **zero LLM cost**:

| Strategy | Default Status | Function |
|--- | --- | ---|
| Deduplication | ✅ Enabled | Detects duplicate tool calls, keeps only the latest one |
| Write Superseding | ❌ Disabled | Cleans up write operation inputs that have been overwritten by subsequent reads |
| Error Purging | ✅ Enabled | Clears error tool inputs after N turns |

All strategies follow these rules:
- **Skip protected tools**: Critical tools like task, write, edit won't be pruned
- **Skip protected files**: File paths protected by configured glob patterns
- **Preserve error messages**: Error purging strategy only removes input parameters, error information is retained

---

## Deduplication Strategy

### How It Works

The deduplication strategy detects repeated calls with **identical tool names and parameters**, keeping only the latest one.

::: info Signature Matching Mechanism

DCP determines duplicates through "signatures":
- Same tool name
- Same parameter values (ignoring null/undefined, key order doesn't matter)

For example:
```json
// 1st call
{ "tool": "read", "path": "src/config.ts" }

// 2nd call (same signature)
{ "tool": "read", "path": "src/config.ts" }

// 3rd call (different signature)
{ "tool": "read", "path": "src/utils.ts" }
```
:::

### Use Cases

**Recommended to enable** (default on):
- AI frequently reads the same file for code analysis
- Repeatedly querying the same configuration across multiple rounds
- Scenarios where latest state matters and historical outputs can be discarded

**May want to disable**:
- Need to preserve context of every tool call (e.g., debugging tool outputs)

### Configuration

```json
// ~/.config/opencode/dcp.jsonc
{
  "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/main/dcp.schema.json",
  "strategies": {
    "deduplication": {
      "enabled": true  // true to enable, false to disable
    }
  }
}
```

**Protected tools** (not pruned by default):
- task, write, edit, batch, plan_enter, plan_exit
- todowrite, todoread (task list tools)
- discard, extract (DCP's own tools)

These tools cannot be pruned by deduplication even if configured (hardcoded protection).

---

## Write Superseding Strategy

### How It Works

The write superseding strategy cleans up **write operation inputs that have been overwritten by subsequent reads**.

::: details Example: Write then Read

```text
Step 1: Write file
AI calls write("config.json", {...})
↓
Step 2: Read file to verify
AI calls read("config.json") → returns latest content
↓
Write superseding strategy identifies
write's input (potentially large) becomes redundant
because read has already captured the file's current state
↓
Prune
Keep only read's output, remove write's input
```

:::

### Use Cases

**Recommended to enable**:
- Iterative development scenarios with frequent "write → verify → modify" cycles
- Write operations contain large templates or complete file contents

**Reason for default disabled**:
- Some workflows depend on "historical write records" as context
- May affect certain version control-related tool calls

**When to manually enable**:
```json
{
  "strategies": {
    "supersedeWrites": {
      "enabled": true
    }
  }
}
```

### Important Notes

This strategy **only prunes write tool inputs**, not outputs. Because:
- write's output is typically a confirmation message (small)
- write's input may contain complete file content (large)

---

## Error Purging Strategy

### How It Works

The error purging strategy waits N turns after a tool call fails, then removes **input parameters** (preserves error messages).

::: info What is a "turn"?
In OpenCode conversations:
- User sends message → AI responds = 1 turn
- Tool calls don't count as separate turns

The default threshold is 4 turns, meaning error tool inputs are automatically cleaned after 4 turns.
:::

### Use Cases

**Recommended to enable** (default on):
- Tool call fails with large input (e.g., reading a huge file fails)
- Error information needs to be preserved, but input parameters are no longer valuable

**May want to disable**:
- Need to preserve complete input of failed tools for debugging
- Frequently encountering "intermittent" errors and want to keep history

### Configuration

```json
{
  "strategies": {
    "purgeErrors": {
      "enabled": true,   // enable toggle
      "turns": 4        // purge threshold (number of turns)
    }
  }
}
```

**Protected tools** (not pruned by default):
- Same protected tool list as deduplication strategy

---

## Strategy Execution Order

The three strategies execute in a **fixed order**:

```mermaid
graph LR
    A["Message List"] --> B["Sync Tool Cache"]
    B --> C["Deduplication Strategy"]
    C --> D["Write Superseding Strategy"]
    D --> E["Error Purging Strategy"]
    E --> F["Replace Pruned Content"]
```

This means:
1. First deduplication (reduce redundancy)
2. Then write superseding (clean up invalidated writes)
3. Finally error purging (clean up expired error inputs)

Each strategy operates on the result of the previous strategy, avoiding duplicate pruning of the same tool.

---

## Common Pitfalls

### ❌ Myth 1: All tools are automatically pruned

**Problem**: Why aren't task, write and other tools being pruned?

**Cause**: These tools are in the **protected tool list**, hardcoded for protection.

**Solution**:
- If you really need to prune write, consider enabling the write superseding strategy
- If you need to prune task, you can indirectly control it by adding protected file paths through configuration

### ❌ Myth 2: Write superseding strategy causes incomplete context

**Problem**: After enabling write superseding, AI can't find previous write content.

**Cause**: The strategy only cleans up "write operations overwritten by reads". If a write was never read afterward, it won't be pruned.

**Solution**:
- Check if the file was actually read (`/dcp context` can view)
- If you really need to preserve write records, disable this strategy

### ❌ Myth 3: Error purging strategy cleans too quickly

**Problem**: Error input just pruned, and AI immediately encounters the same error again.

**Cause**: `turns` threshold set too small.

**Solution**:
```json
{
  "strategies": {
    "purgeErrors": {
      "turns": 8  // increase from default 4 to 8
    }
  }
}
```

---

## When to Use This

| Scenario | Recommended Strategy Combination |
|--- | ---|
| Daily development (read-heavy, write-light) | Deduplication + Error Purging (default config) |
| Frequent write verification | Enable all (manually enable write superseding) |
| Debugging tool failures | Deduplication only (disable error purging) |
| Need complete context history | Disable all |

---

## Summary

- **Deduplication strategy**: Detects duplicate tool calls, keeps only the latest (enabled by default)
- **Write superseding strategy**: Cleans up write operation inputs overwritten by reads (disabled by default)
- **Error purging strategy**: Cleans up error tool inputs after N turns (enabled by default, threshold 4)
- All strategies skip protected tools and protected file paths
- Strategies execute in fixed order: Deduplication → Write Superseding → Error Purging

---

## Coming Up Next

> In the next lesson, we'll learn **[LLM-Driven Pruning Tools](../llm-tools/)**.
>
> You'll learn:
> - How AI autonomously calls discard and extract tools
> - Implementation of semantic-level context optimization
> - Best practices for extracting key findings

---

## Appendix: Source Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Deduplication strategy implementation | [`lib/strategies/deduplication.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/deduplication.ts) | 13-83 |
| Write superseding strategy implementation | [`lib/strategies/supersede-writes.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/supersede-writes.ts) | 16-105 |
| Error purging strategy implementation | [`lib/strategies/purge-errors.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/purge-errors.ts) | 16-80 |
| Strategy entry exports | [`lib/strategies/index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/index.ts) | 1-5 |
| Default configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 423-464 |
| Protected tool list | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 68-79 |

**Key Functions**:
- `deduplicate()` - Main function for deduplication strategy
- `supersedeWrites()` - Main function for write superseding strategy
- `purgeErrors()` - Main function for error purging strategy
- `createToolSignature()` - Creates tool signature for deduplication matching
- `normalizeParameters()` - Parameter normalization (removes null/undefined)
- `sortObjectKeys()` - Parameter key sorting (ensures signature consistency)

**Default Configuration Values**:
- `strategies.deduplication.enabled = true`
- `strategies.supersedeWrites.enabled = false`
- `strategies.purgeErrors.enabled = true`
- `strategies.purgeErrors.turns = 4`

**Protected Tools** (not pruned by default):
- task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit

</details>
