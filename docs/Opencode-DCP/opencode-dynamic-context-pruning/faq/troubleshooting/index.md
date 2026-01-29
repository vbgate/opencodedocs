---
title: "Troubleshooting: Debug DCP | OpenCode DCP"
sidebarTitle: "Troubleshooting"
subtitle: "Troubleshooting: Debug DCP"
description: "Debug common issues including configuration errors and token usage. Use manual pruning and slash commands to resolve DCP problems."
tags:
  - "FAQ"
  - "troubleshooting"
  - "configuration"
  - "debugging"
prerequisite:
  - "start-getting-started"
order: 1
---

# FAQ and Troubleshooting

## Configuration Issues

### Why isn't my configuration taking effect?

DCP configuration files are merged by priority: **defaults < global < environment variables < project**. Project-level configuration has the highest priority.

**Checklist**:

1. **Verify configuration file location**:
   ```bash
   # macOS/Linux
   ls -la ~/.config/opencode/dcp.jsonc
   ls -la ~/.config/opencode/dcp.json

   # Or in project root directory
   ls -la .opencode/dcp.jsonc
   ```

2. **View effective configuration**:
   After enabling debug mode, DCP outputs configuration information to the log file when loading configuration for the first time.

3. **Restart OpenCode**:
   You must restart OpenCode after modifying configuration for changes to take effect.

::: tip Configuration Priority
If you have multiple configuration files, project-level configuration (`.opencode/dcp.jsonc`) will override global configuration.
:::

### What should I do if the configuration file has errors?

DCP displays a Toast warning (after 7 seconds) when it detects configuration errors and falls back to using default values.

**Common error types**:

| Error Type | Description | Solution |
|------------|-------------|----------|
| Type error | `pruneNotification` should be `"off" | "minimal" | "detailed"` | Check enum value spelling |
| Array error | `protectedFilePatterns` must be a string array | Ensure `["pattern1", "pattern2"]` format |
| Unknown key | Configuration file contains unsupported keys | Delete or comment out unknown keys |

**Enable debug logs to view detailed errors**:

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true  // Enable debug logs
}
```

Log file location: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`

---

## Feature-Related Issues

### Why isn't token usage decreasing?

DCP only prunes **tool call** content. If your conversation doesn't use tools, or only uses protected tools, tokens will not decrease.

**Possible reasons**:

1. **Protected tools**
   Tools protected by default include: `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

2. **Turn protection not expired**
   If `turnProtection` is enabled, tools won't be pruned during the protection period.

3. **No duplicate or prunable content in conversation**
   DCP's automatic strategies only target:
   - Duplicate tool calls (deduplication)
   - Write operations overwritten by reads (overwrite writes)
   - Expired erroneous tool inputs (clear errors)

**Check method**:

```bash
# Enter in OpenCode
/dcp context
```

View the `Pruned` field in the output to understand the number of pruned tools and saved tokens.

::: info Manual Pruning
If automatic strategies aren't triggered, use `/dcp sweep` to manually prune tools.
:::

### Why aren't subagent sessions being pruned?

**This is expected behavior**. DCP is completely disabled in subagent sessions.

**Reason**: Subagents are designed to return concise discovery summaries, not to optimize token usage. DCP's pruning may interfere with subagent summarization behavior.

**How to determine if it's a subagent session**:
- Check the `parentID` field in session metadata
- After enabling debug logs, you'll see `isSubAgent: true` marker

---

## Debugging and Logging

### How do I enable debug logs?

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true
}
```

**Log file locations**:
- **Daily logs**: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`
- **Context snapshots**: `~/.config/opencode/logs/dcp/context/{sessionId}/{timestamp}.json`

::: warning Performance Impact
Debug logs write to disk files and may affect performance. Recommended to disable in production environments.
:::

### How do I view the token distribution for the current session?

```bash
# Enter in OpenCode
/dcp context
```

**Output example**:

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

### How do I view cumulative pruning statistics?

```bash
# Enter in OpenCode
/dcp stats
```

This displays the cumulative pruned token count for all historical sessions.

---

## Prompt Caching Related

### Does DCP affect Prompt Caching?

**Yes**, but it's typically a net gain after trade-offs.

LLM providers (such as Anthropic, OpenAI) cache prompts based on **exact prefix matching**. When DCP prunes tool outputs, it changes message content, causing cache invalidation from that point forward.

**Actual test results**:
- Without DCP: Cache hit rate ~85%
- With DCP: Cache hit rate ~65%

**But token savings usually exceed cache loss**, especially in long conversations.

**Best use cases**:
- When using per-request billing services (e.g., GitHub Copilot, Google Antigravity), cache loss has no negative impact

---

## Advanced Configuration

### How do I protect specific files from pruning?

Use `protectedFilePatterns` to configure glob patterns:

```jsonc
{
    "protectedFilePatterns": [
        "src/config/*",     // Protect config directory
        "*.env",           // Protect all .env files
        "**/secrets/**"    // Protect secrets directory
    ]
}
```

Patterns match the `filePath` field in tool parameters (such as `read`, `write`, `edit` tools).

### How do I customize protected tools?

Each strategy and tool configuration has a `protectedTools` array:

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_tool"]  // Additional protected tools
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["another_tool"]
        }
    },
    "commands": {
        "protectedTools": ["sweep_protected"]
    }
}
```

These configurations **accumulate** to the default protected tools list.

---

## Common Error Scenarios

### Error: DCP not loaded

**Possible reasons**:
1. Plugin not registered in `opencode.jsonc`
2. Plugin installation failed
3. OpenCode version incompatible

**Solution**:
1. Check if `opencode.jsonc` contains `"plugin": ["@tarquinen/opencode-dcp@latest"]`
2. Restart OpenCode
3. View log file to confirm loading status

### Error: Invalid JSON in configuration file

**Possible reasons**:
- Missing comma
- Extra comma
- String not wrapped in double quotes
- JSONC comment format error

**Solution**:
Use a JSONC-supported editor (such as VS Code), or use an online JSON validation tool to check syntax.

### Error: /dcp command not responding

**Possible reasons**:
- `commands.enabled` set to `false`
- Plugin not loaded correctly

**Solution**:
1. Check if `"commands.enabled"` is `true` in configuration file
2. Confirm plugin is loaded (view logs)

---

## Getting Help

If the above methods cannot solve your problem:

1. **Enable debug logs** and reproduce the issue
2. **View context snapshots**: `~/.config/opencode/logs/dcp/context/{sessionId}/`
3. **Submit an Issue on GitHub**:
   - Attach log files (remove sensitive information)
   - Describe reproduction steps
   - Explain expected behavior and actual behavior

---

## Next Lesson Preview

> In the next lesson, we'll learn **[DCP Best Practices](../best-practices/)**.
>
> You'll learn:
> - Trade-off relationship between Prompt Caching and Token savings
> - Configuration priority rules and usage strategies
> - Selection and configuration of protection mechanisms
> - Command usage tips and optimization suggestions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature        | File Path                                                                                      | Line Number |
| -------------- | ------------------------------------------------------------------------------------------- | ----------- |
| Configuration validation     | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375)  | 147-375    |
| Configuration error handling | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L391-421)  | 391-421    |
| Logging system     | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L6-109)      | 6-109      |
| Context snapshots   | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L196-210)    | 196-210    |
| Subagent detection   | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8)      | 1-8        |
| Protected tools   | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79)   | 68-79      |

**Key functions**:
- `validateConfigTypes()`: Validates configuration item types
- `getInvalidConfigKeys()`: Detects unknown keys in configuration files
- `Logger.saveContext()`: Saves context snapshots for debugging
- `isSubAgentSession()`: Detects subagent sessions

</details>
