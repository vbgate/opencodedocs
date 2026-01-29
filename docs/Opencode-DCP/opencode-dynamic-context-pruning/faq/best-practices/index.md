---
title: "Best Practices: Optimize DCP | opencode-dynamic-context-pruning"
sidebarTitle: "Best Practices"
subtitle: "Best Practices: Optimize DCP"
description: "Learn DCP configuration best practices. Master Prompt Caching trade-offs, multi-level priority rules, protection strategies, and command usage to maximize Token savings in long conversations."
tags:
  - "Best Practices"
  - "Token Savings"
  - "Configuration"
  - "Optimization"
prerequisite:
  - "start-configuration"
  - "platforms-auto-pruning"
order: 2
---

# DCP Best Practices

## What You'll Learn

- Understand the trade-off between Prompt Caching and Token savings
- Choose protection strategies that fit your needs (turn protection, protected tools, file modes)
- Use commands to manually optimize Token usage
- Customize DCP configuration based on project requirements

## Prompt Caching Trade-offs

### Understanding the Caching vs Pruning Trade-off

When DCP prunes tool outputs, it changes message content, which causes Prompt Caching based on **exact prefix matching** to become invalid from that point forward.

**Test Data Comparison**:

| Scenario       | Cache Hit Rate | Token Savings | Overall Benefit |
| -------------- | --------- | --------- | ------ |
| Without DCP    | ~85%      | 0%        | Baseline   |
| With DCP       | ~65%      | 20-40%    | ✅ Net Positive |

### When to Ignore Cache Loss

**Recommended DCP Usage Scenarios**:

- ✅ **Long conversations** (over 20 turns): Context bloat is significant, Token savings far exceed cache loss
- ✅ **Per-request billing** services: GitHub Copilot, Google Antigravity, etc. where cache loss has no negative impact
- ✅ **Intensive tool calls**: Frequent file reads, searches, etc.
- ✅ **Code refactoring tasks**: Repeatedly reading the same file

**Scenarios where DCP might need to be disabled**:

- ⚠️ **Short conversations** (< 10 turns): Pruning gains are limited, cache loss may be more noticeable
- ⚠️ **Cache-sensitive tasks**: Scenarios requiring maximum cache hit rate (such as batch processing)

::: tip Flexible Configuration
You can dynamically adjust DCP configuration based on project needs, or even disable specific strategies in project-level configurations.
:::

---

## Configuration Priority Best Practices

### Proper Use of Multi-level Configuration

DCP configurations are merged with the following priority:

```
Defaults < Global Config < Custom Config Directory < Project Config
```

::: info Config Directory Explanation
The "Custom Config Directory" is specified by setting the `$OPENCODE_CONFIG_DIR` environment variable. This directory must contain a `dcp.jsonc` or `dcp.json` file.
:::

### Recommended Configuration Strategy

| Scenario               | Recommended Config Location | Example Configuration Focus                     |
| ---------------------- | ---------- | ------------------------ |
| **Personal Dev Environment**   | Global Config    | Enable auto strategies, disable debug logs          |
| **Team Collaboration Project**   | Project Config    | Project-specific protected files, strategy toggles         |
| **CI/CD Environment**   | Custom Config Directory  | Disable notifications, enable debug logs             |
| **Temporary Debugging**       | Project Config    | Enable `debug`, detailed notification mode           |

**Example: Project-level Configuration Override**

```jsonc
// ~/.config/opencode/dcp.jsonc (global config)
{
    "enabled": true,
    "strategies": {
        "deduplication": {
            "enabled": true
        }
    }
}
```

```jsonc
// .opencode/dcp.jsonc (project config)
{
    "strategies": {
        // Project-level override: disable deduplication (e.g., project needs to preserve historical context)
        "deduplication": {
            "enabled": false
        }
    }
}
```

::: warning Restart After Configuration Changes
You must restart OpenCode for configuration changes to take effect.
:::

---

## Protection Strategy Selection

### Use Cases for Turn Protection

**Turn Protection** prevents tools from being pruned within a specified number of turns, giving the AI sufficient time to reference recent content.

**Recommended Settings**:

| Scenario                   | Recommended Value    | Reason                     |
| ---------------------- | ------- | ------------------------ |
| **Complex Problem Solving**       | 4-6 turns | AI needs multiple iterations to analyze tool outputs      |
| **Code Refactoring**           | 2-3 turns | Context switches quickly, longer protection affects performance    |
| **Rapid Prototyping**       | 2-4 turns | Balance protection and Token savings        |
| **Default Config**           | 4 turns    | Tested equilibrium point              |

**When to Enable Turn Protection**:

```jsonc
{
    "turnProtection": {
        "enabled": true,   // Enable turn protection
        "turns": 6        // Protect 6 turns (suitable for complex tasks)
    }
}
```

**When Not Recommended**:

- Simple Q&A scenarios (AI answers directly without tools)
- High-frequency short conversations (protection period too long causes delayed pruning)

### Protected Tools Configuration

**Default Protected Tools** (no extra configuration needed):
- `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

::: warning Schema Default Values Note
If you use IDE auto-completion, the Schema file (`dcp.schema.json`) may display an incomplete default protected tools list. The actual list is defined in source code as `DEFAULT_PROTECTED_TOOLS`, including all 10 tools.
:::

**When to Add Additional Protected Tools**:

| Scenario                   | Example Configuration                              | Reason                     |
| ---------------------- | ----------------------------- | ------------------------ |
| **Critical Business Tools**       | `protectedTools: ["critical_tool"]` | Ensure critical operations remain visible            |
| **Tools Requiring Historical Context** | `protectedTools: ["analyze_history"]` | Preserve complete history for analysis            |
| **Custom Task Tools**     | `protectedTools: ["custom_task"]` | Protect custom task workflows            |

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_analyze"]  // Additional protection for specific tools
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["important_check"]  // Additional LLM tool protection
        }
    }
}
```

### Using Protected File Patterns

**Recommended Protection Patterns**:

| File Type             | Recommended Pattern                     | Protection Reason                 |
| ------------------ | ------------------------ | ---------------------- |
| **Config Files**           | `"*.env"`, `".env*"`        | Prevent sensitive information from being pruned/lost          |
| **Database Config**          | `"**/config/database/*"`    | Ensure database connection config remains available        |
| **Secret Files**           | `"**/secrets/**"`          | Protect all secrets and certificates            |
| **Core Business Logic**        | `"src/core/*"`            | Prevent critical code context loss          |

```jsonc
{
    "protectedFilePatterns": [
        "*.env",                // Protect all environment variable files
        ".env.*",              // Including .env.local, etc.
        "**/secrets/**",       // Protect secrets directory
        "**/config/*.json",    // Protect config files
        "src/auth/**"          // Protect auth-related code
    ]
}
```

::: tip Pattern Matching Rules
`protectedFilePatterns` matches the `filePath` field in tool parameters (such as `read`, `write`, `edit` tools).
:::

---

## Automatic Strategy Selection

### Deduplication Strategy

**Enabled by default**, suitable for most scenarios.

**Applicable Scenarios**:
- Repeatedly reading the same file (e.g., code review, multi-round debugging)
- Executing the same search or analysis commands

**When Not Recommended**:
- Need to preserve exact output from each call (e.g., performance monitoring)
- Tool output contains timestamps or random values (different each call)

### Supersede Writes Strategy

**Disabled by default**, enable based on project needs.

**Recommended Scenarios for Enabling**:
- Immediately read to verify after file modification (refactoring, batch processing)
- Write operation output is large, reading it overrides its value

```jsonc
{
    "strategies": {
        "supersedeWrites": {
            "enabled": true  // Enable supersede writes strategy
        }
    }
}
```

**When Not Recommended**:
- Need to track file modification history (code audit)
- Write operations contain important metadata (e.g., change reasons)

### Purge Errors Strategy

**Enabled by default**, recommended to keep enabled.

**Configuration Recommendations**:

| Scenario                   | Recommended Value  | Reason                     |
| ---------------------- | ----- | ------------------------ |
| **Default Config**           | 4 turns | Tested equilibrium point              |
| **Fast Fail Scenarios**       | 2 turns | Clean up error inputs early, reduce context pollution       |
| **Need Error History**       | 6-8 turns | Preserve more error info for debugging          |

```jsonc
{
    "strategies": {
        "purgeErrors": {
            "enabled": true,
            "turns": 2  // Fast fail scenario: clean up error inputs after 2 turns
        }
    }
}
```

---

## Best Practices for LLM-driven Tools

### Optimizing the Nudge Feature

DCP reminds the AI to use pruning tools every 10 tool calls by default.

**Recommended Configuration**:

| Scenario                   | nudgeFrequency | Effect Description                |
| ---------------------- | ------------- | ------------------- |
| **Dense Tool Calls**       | 8-12          | Remind AI to clean up in time            |
| **Low-frequency Tool Calls**       | 15-20         | Reduce notification distraction              |
| **Disable Nudge**           | Infinity      | Rely entirely on AI's autonomous judgment         |

```jsonc
{
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 15  // Low-frequency scenario: remind after 15 tool calls
        }
    }
}
```

### Using the Extract Tool

**When to Use Extract**:
- Tool output contains key findings or data that need a summary preserved
- Original output is large, but extracted information is sufficient to support subsequent reasoning

**Configuration Recommendations**:

```jsonc
{
    "tools": {
        "extract": {
            "enabled": true,
            "showDistillation": false  // Don't show extracted content by default (reduce distraction)
        }
    }
}
```

**When to Enable `showDistillation`**:
- Need to view what key information the AI extracted
- Debugging or verifying Extract tool behavior

### Using the Discard Tool

**When to Use Discard**:
- Tool output is just temporary state or noise
- Tool output doesn't need to be preserved after task completion

**Configuration Recommendations**:

```jsonc
{
    "tools": {
        "discard": {
            "enabled": true
        }
    }
}
```

---

## Command Usage Tips

### When to Use `/dcp context`

**Recommended Usage Scenarios**:
- Suspect abnormal Token usage
- Need to understand the current session's context distribution
- Evaluate DCP's pruning effectiveness

**Best Practices**:
- Check once mid-conversation to understand context composition
- Check at conversation end to view total Token consumption

### When to Use `/dcp stats`

**Recommended Usage Scenarios**:
- Need to understand long-term Token savings effectiveness
- Evaluate DCP's overall value
- Compare savings effectiveness of different configurations

**Best Practices**:
- Review cumulative statistics once per week
- Compare effects before and after optimizing configuration

### When to Use `/dcp sweep`

**Recommended Usage Scenarios**:
- Context is too large causing slow responses
- Need to immediately reduce Token consumption
- Automatic strategies haven't triggered pruning

**Usage Tips**:

| Command              | Purpose               |
| ---------------- | ------------------ |
| `/dcp sweep`      | Prune all tools after the last user message |
| `/dcp sweep 10`   | Only prune the last 10 tools      |
| `/dcp sweep 5`    | Only prune the last 5 tools       |

**Recommended Workflow**:
1. First use `/dcp context` to view current status
2. Decide on pruning quantity based on the situation
3. Use `/dcp sweep N` to execute pruning
4. Use `/dcp context` again to confirm effectiveness

---

## Notification Mode Selection

### Comparison of Three Notification Modes

| Mode       | Display Content                          | Applicable Scenarios             |
| -------- | ----------------------------- | ---------------- |
| **off**   | Show no notifications                       | Work environments without disturbance needs      |
| **minimal** | Only show pruning count and Token savings             | Need to understand effects without focusing on details    |
| **detailed** | Show each pruned tool and reason (default)          | Debugging or scenarios requiring detailed monitoring   |

### Recommended Configuration

| Scenario               | Recommended Mode   | Reason               |
| ---------------- | ------ | ---------------- |
| **Daily Development**       | minimal | Focus on effects, reduce distraction        |
| **Debugging Issues**       | detailed | View reasons for each pruning operation      |
| **Presentations or Recording**  | off     | Avoid notifications interfering with demo flow       |

```jsonc
{
    "pruneNotification": "minimal"  // Recommended for daily development
}
```

---

## Handling Subagent Scenarios

### Understanding Subagent Limitations

**DCP is completely disabled in subagent sessions**.

**Reasons**:
- Subagent's goal is to return concise discovery summaries
- DCP's pruning might interfere with subagent's summarization behavior
- Subagents typically execute for short durations with limited context expansion

### How to Determine if It's a Subagent Session

1. **Enable Debug Logs**:
    ```jsonc
    {
        "debug": true
    }
    ```

2. **View Logs**:
    The logs will display the `isSubAgent: true` marker

### Token Optimization Recommendations for Subagents

Although DCP is disabled in subagents, you can still:

- Optimize subagent prompts to reduce output length
- Limit subagent's tool call scope
- Use the `max_length` parameter of the `task` tool to control output

---

## Lesson Summary

| Best Practice Area       | Core Recommendations                          |
| -------------- | ----------------------------- |
| **Prompt Caching**  | Token savings in long conversations usually exceed cache loss          |
| **Configuration Priority**      | Use global config for general settings, project config for specific needs         |
| **Turn Protection**       | 4-6 turns for complex tasks, 2-3 turns for quick tasks         |
| **Protected Tools**     | Default protection is sufficient, add critical business tools as needed             |
| **Protected Files**     | Protect config files, secrets, core business logic files               |
| **Automatic Strategies**       | Deduplication and purge errors enabled by default, supersede writes enable as needed           |
| **LLM Tools**     | Nudge frequency 10-15 times, show extracted content when debugging Extract    |
| **Command Usage**     | Check context periodically, prune manually as needed                |
| **Notification Mode**       | Use minimal for daily development, detailed for debugging       |

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Function         | File Path                                                                                              | Line Numbers        |
| ---------- | --------------------------------------------------------------------------------------------------- | ----------- |
| Config Merging      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L691-794)    | 691-794     |
| Config Validation      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375)    | 147-375     |
| Default Config      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-134)     | 68-134      |
| Turn Protection      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L432-437)   | 432-437     |
| Protected Tools     | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79)     | 68-79       |
| Protected File Patterns   | [`protected-file-patterns.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/protected-file-patterns.ts#L1-60) | 1-60        |
| Subagent Detection     | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8)      | 1-8         |
| Nudge Feature      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-441)   | 438-441     |

**Key Constants**:
- `MAX_TOOL_CACHE_SIZE = 1000`: Maximum number of tool cache entries
- `turnProtection.turns`: Default 4-turn protection

**Key Functions**:
- `getConfig()`: Load and merge multi-level configurations
- `validateConfigTypes()`: Validate configuration item types
- `mergeConfig()`: Merge configurations by priority
- `isSubAgentSession()`: Detect subagent sessions

</details>
