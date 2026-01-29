---
title: "Performance Tips: Model & Context | Everything Claude Code"
sidebarTitle: "Performance Tips"
subtitle: "Performance Optimization: Boost Response Speed"
description: "Learn performance optimization strategies including model selection, context management, and MCP configuration for faster Claude Code responses."
tags:
  - "performance"
  - "optimization"
  - "token-usage"
prerequisite:
  - "start-quick-start"
order: 180
---

# Performance Optimization: Boost Response Speed

## What You'll Learn

- Choose appropriate models based on task complexity to balance cost and performance
- Effectively manage context windows to avoid hitting limits
- Configure MCP servers wisely to maximize available context
- Use strategic compression to maintain conversation logic coherence

## Your Current Challenge

Claude Code response is slow? Context window fills up quickly? Not sure when to use Haiku, Sonnet, or Opus? These issues can seriously impact development efficiency.

## Core Approach

The core of performance optimization is **using the right tool at the right time**. Choosing models, managing context, and configuring MCP are all about making trade-offs: speed vs intelligence, cost vs quality.

::: info Key Concept

**Context window** is the length of conversation history Claude can "remember." Current models support approximately 200k tokens, but this is affected by factors like the number of MCP servers and tool call frequency.

:::

## Common Performance Issues

### Issue 1: Slow Response Speed

**Symptoms**: Even simple tasks take a long time

**Possible Causes**:
- Using Opus for simple tasks
- Context too long, requiring processing of large amounts of historical information
- Too many MCP servers enabled

**Solutions**:
- Use Haiku for lightweight tasks
- Regularly compress context
- Reduce the number of enabled MCPs

### Issue 2: Context Window Fills Up Quickly

**Symptoms**: Need to compress or restart session after a short development period

**Possible Causes**:
- Too many MCP servers enabled (each MCP consumes context)
- Not compressing conversation history in time
- Using complex tool call chains

**Solutions**:
- Enable MCPs on-demand, use `disabledMcpServers` to disable unused ones
- Use strategic compression, manually compress at task boundaries
- Avoid unnecessary file reads and searches

### Issue 3: High Token Consumption

**Symptoms**: Quota runs out quickly, high costs

**Possible Causes**:
- Always using Opus for tasks
- Repeatedly reading large files
- Not using compression appropriately

**Solutions**:
- Choose model based on task complexity
- Use `/compact` to actively compress
- Use strategic-compact hooks for smart reminders

## Model Selection Strategy

Choosing the right model based on task complexity can significantly improve performance and reduce costs.

### Haiku 4.5 (90% Sonnet Capability, 3x Cost Savings)

**Use Cases**:
- Lightweight agents with frequent calls
- Pair programming and code generation
- Worker agents in multi-agent systems

**Example**:
```markdown
Simple code modification, formatting, comment generation
Use Haiku
```

### Sonnet 4.5 (Best Coding Model)

**Use Cases**:
- Main development work
- Coordinating multi-agent workflows
- Complex coding tasks

**Example**:
```markdown
Implement new features, refactor, fix complex bugs
Use Sonnet
```

### Opus 4.5 (Strongest Reasoning Capability)

**Use Cases**:
- Complex architectural decisions
- Tasks requiring maximum reasoning depth
- Research and analysis tasks

**Example**:
```markdown
System design, security audits, complex issue troubleshooting
Use Opus
```

::: tip Model Selection Tip

Specify the model in agent configuration via the `model` field:
```markdown
---
name: my-agent
model: haiku  # or sonnet, opus
---
```

:::

## Context Window Management

Using too much of the context window can affect performance and even cause task failures.

### Tasks to Avoid Using the Last 20% of Context Window

For these tasks, compress context first:
- Large-scale refactoring
- Feature implementation across multiple files
- Debugging with complex interactions

### Tasks with Low Context Sensitivity

These tasks have lower context requirements and can continue near the limit:
- Single-file editing
- Standalone tool creation
- Documentation updates
- Simple bug fixes

::: warning Important Reminder

Context window is affected by the following factors:
- Number of enabled MCP servers
- Tool call frequency
- Length of conversation history
- File operations in current session

:::

## MCP Configuration Optimization

MCP servers are an important way to extend Claude Code capabilities, but each MCP consumes context.

### Basic Principles

Per README recommendations:

```json
{
  "mcpServers": {
    "mcp-server-1": { ... },
    "mcp-server-2": { ... }
    // ... more configurations
  },
  "disabledMcpServers": [
    "mcp-server-3",
    "mcp-server-4"
    // Disable unused MCPs
  ]
}
```

**Best Practices**:
- Can configure 20-30 MCP servers
- Enable no more than 10 per project
- Keep active tool count under 80

### Enable MCPs On-Demand

Select relevant MCPs based on project type:

| Project Type | Recommended | Optional |
|--- | --- | ---|
| Frontend Projects | Vercel, Magic | Filesystem, GitHub |
| Backend Projects | Supabase, ClickHouse | GitHub, Railway |
| Full-stack Projects | All | - |
| Utility Libraries | GitHub | Filesystem |

::: tip How to Switch MCPs

Use `disabledMcpServers` in project configuration (`~/.claude/settings.json`):
```json
{
  "disabledMcpServers": ["cloudflare-observability", "clickhouse-io"]
}
```

:::

## Strategic Compression

Automatic compression can trigger at any time, potentially interrupting task logic. Strategic compression is manually executed at task boundaries to maintain logical coherence.

### Why Strategic Compression is Needed

**Problems with Automatic Compression**:
- Often triggers mid-task, losing important context
- Doesn't understand task logical boundaries
- May interrupt complex multi-step operations

**Advantages of Strategic Compression**:
- Compress at task boundaries, preserving key information
- Clearer logic
- Avoid interrupting important workflows

### Best Compression Timing

1. **After exploration, before execution** - Compress research context, preserve implementation plan
2. **After completing a milestone** - Fresh start for next phase
3. **Before task switching** - Clear exploration context, prepare for new task

### Strategic Compact Hook

This plugin includes the `strategic-compact` skill, which automatically reminds you when to compress.

**How the Hook Works**:
- Tracks tool call count
- Reminds when threshold is reached (default: 50 calls)
- Reminds every 25 calls after the threshold

**Configure Threshold**:
```bash
# Set environment variable
export COMPACT_THRESHOLD=40
```

**Hook Configuration** (included in `hooks/hooks.json`):
```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }]
}
```

### Usage Tips

1. **Compress after planning** - Once plan is determined, compress and restart
2. **Compress after debugging** - Clear error resolution context, proceed to next step
3. **Don't compress during implementation** - Preserve context of related changes
4. **Pay attention to reminders** - Hook tells you "when," you decide "whether to compress"

::: tip View Current Status

Use the `/checkpoint` command to save current state before compressing the session.

:::

## Performance Checklist

In daily use, regularly check the following items:

### Model Usage
- [ ] Use Haiku for simple tasks instead of Sonnet/Opus
- [ ] Use Opus for complex reasoning instead of Sonnet
- [ ] Appropriate model specified in agent configuration

### Context Management
- [ ] No more than 10 MCPs enabled
- [ ] Regularly use `/compact` for compression
- [ ] Compress at task boundaries, not mid-task

### MCP Configuration
- [ ] Project only enables needed MCPs
- [ ] Use `disabledMcpServers` to manage unused MCPs
- [ ] Regularly check active tool count (recommended < 80)

## FAQ

### Q: When should I use Haiku, Sonnet, or Opus?

**A**: Based on task complexity:
- **Haiku**: Lightweight tasks, frequent calls (e.g., code formatting, comment generation)
- **Sonnet**: Main development work, coordinating agents (e.g., feature implementation, refactoring)
- **Opus**: Complex reasoning, architectural decisions (e.g., system design, security audits)

### Q: What to do when context window is full?

**A**: Immediately use `/compact` to compress the session. If strategic-compact hook is enabled, it will remind you at appropriate times. Before compressing, you can use `/checkpoint` to save important state.

### Q: How do I know how many MCPs are enabled?

**A**: Check `mcpServers` and `disabledMcpServers` configuration in `~/.claude/settings.json`. Number of active MCPs = Total - Count in `disabledMcpServers`.

### Q: Why is my response particularly slow?

**A**: Check the following:
1. Are you using Opus for simple tasks?
2. Is context window almost full?
3. Too many MCP servers enabled?
4. Are you performing large-scale file operations?

## Lesson Summary

The core of performance optimization is "using the right tool at the right time":

- **Model Selection**: Choose Haiku/Sonnet/Opus based on task complexity
- **Context Management**: Avoid using the last 20%, compress in time
- **MCP Configuration**: Enable on-demand, no more than 10
- **Strategic Compression**: Manually compress at task boundaries, maintain logical coherence

## Related Lessons

- [Token Optimization Strategy](../../advanced/token-optimization/) - Deep dive into context window management
- [Hooks Automation](../../advanced/hooks-automation/) - Learn about strategic-compact hook configuration
- [MCP Server Configuration](../../start/mcp-setup/) - Learn how to configure MCP servers

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-25

| Function | File Path | Line Numbers |
|--- | --- | ---|
| Performance Optimization Rules | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Strategic Compact Skill | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Hooks Configuration | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Strategic Compact Hook | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json#L46-L54) | 46-54 |
| Suggest Compact Script | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | - |
| MCP Configuration Example | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | - |

**Key Rules**:
- **Model Selection**: Haiku (lightweight tasks), Sonnet (main development), Opus (complex reasoning)
- **Context Window**: Avoid using the last 20%, compress in time
- **MCP Configuration**: Enable no more than 10 per project, active tools < 80
- **Strategic Compression**: Manually compress at task boundaries, avoid automatic compression interruption

**Key Environment Variables**:
- `COMPACT_THRESHOLD`: Tool call count threshold (default: 50)

</details>
