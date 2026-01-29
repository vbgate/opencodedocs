---
title: "Token Optimization: Context Window | Everything Claude Code"
sidebarTitle: "Token Optimization"
subtitle: "Token Optimization Strategies: Context Window Management"
description: "Learn Claude Code token optimization strategies. Master model selection, strategic compaction, and MCP configuration to maximize context window efficiency."
tags:
  - "token-optimization"
  - "context-management"
  - "performance"
prerequisite:
  - "/start/quickstart/"
order: 110
---

# Token Optimization Strategies: Context Window Management

## What You'll Learn

After completing this tutorial, you will be able to:

- Choose the right model for each task, balancing cost and performance
- Use strategic compaction to preserve critical context at logical boundaries
- Configure MCP servers appropriately to avoid excessive context window consumption
- Prevent context window saturation and maintain response quality

## Your Current Challenge

Have you encountered these problems?

- Mid-conversation, context suddenly gets compressed and key information is lost
- Too many MCP servers enabled, reducing context window from 200k to 70k
- During large refactoring, the model "forgets" previous discussions
- Uncertain when to compress and when not to

## When to Use This Approach

- **When handling complex tasks** - Choose the right model and context management strategy
- **When context window nears saturation** - Use strategic compaction to preserve critical information
- **When configuring MCP servers** - Balance tool count with context capacity
- **During long sessions** - Compact at logical boundaries to avoid automatic compaction losing information

## Core Approach

The core of token optimization is not "using less," but **preserving valuable information at critical moments**.

### Three Pillars of Optimization

1. **Model Selection Strategy** - Use different models for different tasks, avoid overkill
2. **Strategic Compaction** - Compact at logical boundaries, not arbitrary moments
3. **MCP Configuration Management** - Control enabled tool count to protect context window

### Key Concepts

::: info What is the Context Window?

The context window is the length of conversation history that Claude Code can "remember." Current models support approximately 200k tokens, but this is affected by:

- **Enabled MCP servers** - Each MCP consumes system prompt space
- **Loaded Skills** - Skill definitions occupy context
- **Conversation history** - Your chat history with Claude

When context approaches saturation, Claude automatically compresses history, potentially losing critical information.
:::

::: tip Why is Manual Compaction Better?

Claude's automatic compression triggers at arbitrary moments, often interrupting workflows mid-task. Strategic compaction lets you proactively compact at **logical boundaries** (such as after completing planning or before switching tasks), preserving important context.
:::

## Follow Along

### Step 1: Choose the Right Model

Select the appropriate model based on task complexity to avoid wasting cost and context.

**Why**

Different models vary significantly in reasoning ability and cost. Proper selection can save substantial tokens.

**Model Selection Guide**

| Model | Use Cases | Cost | Reasoning Ability |
|--- | --- | --- | ---|
| **Haiku 4.5** | Lightweight agents, frequent calls, code generation | Low (1/3 of Sonnet) | 90% of Sonnet's capability |
| **Sonnet 4.5** | Main development work, complex coding tasks, orchestration | Medium | Best coding model |
| **Opus 4.5** | Architecture decisions, deep reasoning, research analysis | High | Strongest reasoning ability |

**Configuration Method**

Set in agent files in the `agents/` directory:

```markdown
---
name: planner
description: Plan implementation steps for complex features
model: opus
---

You are a senior planner...
```

**You should see**:
- High-reasoning tasks (like architecture design) using Opus for higher quality
- Coding tasks using Sonnet for best cost-performance ratio
- Frequently called worker agents using Haiku to save cost

### Step 2: Enable Strategic Compaction Hook

Configure hooks to remind you to compact context at logical boundaries.

**Why**

Automatic compression triggers at arbitrary moments, potentially losing critical information. Strategic compaction lets you decide when to compact.

**Configuration Steps**

Ensure `hooks/hooks.json` has PreToolUse and PreCompact configuration:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Edit\" || tool == \"Write\"",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
          }
        ],
        "description": "Suggest manual compaction at logical intervals"
      }
    ],
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
          }
        ],
        "description": "Save state before context compaction"
      }
    ]
  }
}
```

**Custom Threshold**

Set environment variable `COMPACT_THRESHOLD` to control suggestion frequency (default 50 tool calls):

```json
// Add to ~/.claude/settings.json
{
  "env": {
    "COMPACT_THRESHOLD": "50"  // First suggestion after 50 tool calls
  }
}
```

**You should see**:
- After each file edit or write, the hook counts tool calls
- Upon reaching the threshold (default 50), you'll see:
  ```
  [StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
  ```
- Every 25 subsequent tool calls, you'll see:
  ```
  [StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
  ```

### Step 3: Compact at Logical Boundaries

Based on hook prompts, manually compact at appropriate moments.

**Why**

Compacting after task switching or milestone completion preserves critical context while clearing redundant information.

**Compaction Timing Guide**

✅ **Recommended compaction timing**:
- After completing planning, before starting implementation
- After finishing a feature milestone, before starting the next
- After debugging completes, before continuing development
- When switching to a different task type

❌ **Avoid compaction timing**:
- During feature implementation
- Mid-debugging session
- While modifying multiple related files

**Action Steps**

When you see a hook prompt:

1. Evaluate the current task phase
2. If suitable for compaction, execute:
   ```bash
   /compact
   ```
3. Wait for Claude to summarize context
4. Verify critical information has been preserved

**You should see**:
- After compaction, context window releases significant space
- Critical information (like implementation plans, completed features) is preserved
- New interactions start from streamlined context

### Step 4: Optimize MCP Configuration

Control the number of enabled MCP servers to protect the context window.

**Why**

Each MCP server consumes system prompt space. Enabling too many drastically reduces the context window.

**Configuration Principles**

Based on experience from the README:

```json
{
  "mcpServers": {
    // Can configure 20-30 MCPs...
    "github": { ... },
    "supabase": { ... },
    // ...more configuration
  },
  "disabledMcpServers": [
    "firecrawl",       // Disable infrequently used MCPs
    "clickhouse",
    // ...disable based on project needs
  ]
}
```

**Best Practices**:

- **Configure all MCPs** (20-30), flexibly switch within projects
- **Enable < 10 MCPs**, keep active tools < 80
- **Select based on project**: Enable database-related for backend, build-related for frontend

**Verification Method**

Check tool count:

```bash
// Claude Code will display currently enabled tools
/tool list
```

**You should see**:
- Total tool count < 80
- Context window remains at 180k+ (avoid dropping below 70k)
- Dynamically adjust enabled list based on project needs

### Step 5: Combine with Memory Persistence

Use hooks to ensure critical state persists after compaction.

**Why**

Strategic compaction loses context, but critical state (like implementation plans, checkpoints) needs to be preserved.

**Configure Hooks**

Ensure the following hooks are enabled:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
          }
        ],
        "description": "Load previous context and detect package manager on new session"
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
          }
        ],
        "description": "Persist session state on end"
      }
    ]
  }
}
```

**Workflow**:

1. After completing a task, use `/checkpoint` to save state
2. Before context compaction, PreCompact hook automatically saves
3. On new session start, SessionStart hook automatically loads
4. Critical information (plans, state) is persisted, unaffected by compaction

**You should see**:
- After compaction, important state remains available
- New sessions automatically restore previous context
- Critical decisions and implementation plans are not lost

## Checkpoint ✅

- [ ] `strategic-compact` Hook configured
- [ ] Appropriate model selected for tasks (Haiku/Sonnet/Opus)
- [ ] Enabled MCPs < 10, total tools < 80
- [ ] Compact at logical boundaries (completed planning/milestones)
- [ ] Memory Persistence hooks enabled, critical state can be preserved

## Common Pitfalls

### ❌ Common Error 1: Using Opus for All Tasks

**Problem**: While Opus is the strongest, it costs 10x Sonnet and 30x Haiku.

**Correction**: Select models based on task type:
- Frequently called agents (like code review, formatting) use Haiku
- Main development work uses Sonnet
- Architecture decisions, deep reasoning use Opus

### ❌ Common Error 2: Ignoring Hook Compaction Prompts

**Problem**: After seeing `[StrategicCompact]` prompts, continuing to work results in automatic compaction eventually, losing critical information.

**Correction**: Evaluate task phase, respond to prompts by executing `/compact` at appropriate timing.

### ❌ Common Error 3: Enabling All MCP Servers

**Problem**: Configured 20+ MCPs and enabled all, context window dropped from 200k to 70k.

**Correction**: Use `disabledMcpServers` to disable infrequently used MCPs, keep < 10 active MCPs.

### ❌ Common Error 4: Compacting During Implementation

**Problem**: Compacted context while implementing a feature, model "forgets" previous discussions.

**Correction**: Only compact at logical boundaries (completed planning, task switching, milestone completion).

## Summary

The core of token optimization is **preserving valuable information at critical moments**:

1. **Model Selection** - Haiku/Sonnet/Opus each have use cases, reasonable selection saves cost
2. **Strategic Compaction** - Manually compact at logical boundaries, avoid automatic compaction losing information
3. **MCP Management** - Control enabled count, protect context window
4. **Memory Persistence** - Ensure critical state remains available after compaction

Following these strategies, you can maximize Claude Code's context efficiency and avoid quality degradation from context saturation.

## Coming Next

> In the next lesson, we'll learn **[Verification Loop: Checkpoint and Evals](../verification-loop/)**.
>
> You'll learn:
> - How to use Checkpoint to save and restore work state
> - Continuous verification with Eval Harness methods
> - Grader types and Pass@K metrics
> - Application of verification loops in TDD

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-25

| Function           | File Path                                                                                     | Lines   |
|--- | --- | ---|
| Strategic Compact Skill  | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64    |
| Compaction Suggestion Hook     | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61    |
|--- | --- | ---|
| Performance Optimization Rules      | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48    |
| Hooks Configuration        | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158   |
| Context Window Documentation    | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 349-359 |

**Key Constants**:
- `COMPACT_THRESHOLD = 50`: Tool call threshold (default value)
- `MCP_LIMIT = 10`: Recommended upper limit for enabled MCP count
- `TOOL_LIMIT = 80`: Recommended upper limit for total tool count

**Key Functions**:
- `suggest-compact.js:main()`: Counts tool calls and suggests compaction
- `pre-compact.js:main()`: Saves session state before compaction

</details>
