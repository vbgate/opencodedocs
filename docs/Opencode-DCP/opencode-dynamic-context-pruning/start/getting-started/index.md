---
title: "Quick Start: Install DCP Plugin | opencode-dynamic-context-pruning"
sidebarTitle: "Quick Start"
subtitle: "Installation and Quick Start"
description: "Learn how to install the OpenCode DCP plugin in 5 minutes. Configure the plugin, verify installation, and see immediate token savings through automatic deduplication and AI-driven pruning."
tags:
  - "Installation"
  - "Quick Start"
  - "DCP"
prerequisite:
  - "OpenCode installed"
order: 1
---

# Installation and Quick Start

## What You'll Learn

- ✅ Complete DCP plugin installation in 5 minutes
- ✅ Configure the plugin and verify successful installation
- ✅ See your first automatic pruning in action

## Your Current Challenge

After using OpenCode for a while, your conversations get longer:
- AI reads the same file multiple times
- Tool error messages clutter your context
- Each conversation consumes a large number of tokens
- **Longer conversations = slower AI responses**

You want to automatically clean up redundant content in conversations without manual intervention.

## Core Concept

**DCP (Dynamic Context Pruning)** is an OpenCode plugin that automatically removes redundant tool calls from conversation history, reducing token consumption.

How it works:
1. **Automatic Detection**: Analyzes conversation history before each message is sent
2. **Intelligent Cleanup**: Removes duplicate tool calls, stale errors, and overwritten writes
3. **AI-Driven**: AI can actively call `discard` and `extract` tools to optimize context
4. **Transparent and Controllable**: View pruning statistics via `/dcp` command, manually trigger cleanup

::: tip Key Advantages
- **Zero Cost**: Automatic strategies require no LLM calls
- **Zero Configuration**: Works out of the box with optimized defaults
- **Zero Risk**: Only modifies context sent to LLM, conversation history remains unchanged
:::

## 🎒 Prerequisites

Before starting, ensure:

- [ ] **OpenCode** is installed (with plugin support)
- [ ] You know how to edit **OpenCode configuration file**
- [ ] You understand basic **JSONC syntax** (JSON with comments)

::: warning Important Note
DCP modifies the context content sent to the LLM but does not affect your conversation history. You can disable the plugin in your configuration at any time.
:::

## Follow Along

### Step 1: Edit OpenCode Configuration File

**Why**
You need to declare the DCP plugin in your OpenCode configuration so OpenCode automatically loads it on startup.

Open your OpenCode configuration file `opencode.jsonc` and add DCP to the `plugin` field:

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

**You should see**: The configuration file may have other plugins (if any), just add DCP at the end of the array.

::: info Tip
Using the `@latest` tag ensures OpenCode automatically checks and fetches the latest version on startup.
:::

### Step 2: Restart OpenCode

**Why**
Plugin configuration changes require a restart to take effect.

Completely close OpenCode, then restart it.

**You should see**: OpenCode starts normally without any error messages.

### Step 3: Verify Plugin Installation

**Why**
Confirm that the DCP plugin is loaded correctly and view the default configuration.

In an OpenCode conversation, enter:

```
/dcp
```

**You should see**: DCP command help information, indicating the plugin was installed successfully.

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

### Step 4: Check Default Configuration

**Why**
Understand DCP's default configuration and confirm the plugin works as expected.

DCP automatically creates a configuration file on first run:

```bash
# View global configuration file
cat ~/.config/opencode/dcp.jsonc
```

**You should see**: Configuration file created with only the `$schema` field initially:

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json"
}
```

The configuration file initially contains only the `$schema` field. All other configuration items use code defaults, requiring no manual configuration.

::: tip Default Configuration Explained
DCP's code defaults (no need to write to config file):

- **deduplication**: Automatic deduplication, removes duplicate tool calls
- **purgeErrors**: Automatically cleans error tool inputs from 4 turns ago
- **discard/extract**: AI-callable pruning tools
- **pruneNotification**: Displays detailed pruning notifications

If you need custom configuration, you can manually add these fields. See [Configuration Guide](../configuration/) for details.
:::

### Step 5: Experience Automatic Pruning

**Why**
Use DCP in practice and see automatic pruning results.

Have a conversation in OpenCode where the AI reads the same file multiple times or executes tool calls that will fail.

**You should see**:

1. DCP automatically analyzes conversation history before each message is sent
2. If there are duplicate tool calls, DCP automatically cleans them up
3. After AI responds, you may see pruning notifications (depending on `pruneNotification` configuration)

Example pruning notification:

```
▣ DCP | ~12.5K tokens saved total

▣ Pruning (~12.5K tokens)
→ read: src/config.ts
→ write: package.json
```

Enter `/dcp context` to view current session token usage:

```
Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

## Checkpoint ✅

After completing these steps, you should:

- [ ] Added DCP plugin to `opencode.jsonc`
- [ ] OpenCode restarts and runs normally
- [ ] `/dcp` command displays help information
- [ ] Configuration file `~/.config/opencode/dcp.jsonc` is created
- [ ] Can see pruning notifications in conversations or view pruning statistics via `/dcp context`

**If a step fails**:
- Check if `opencode.jsonc` syntax is correct (JSONC format)
- Check OpenCode logs for plugin loading errors
- Confirm OpenCode version supports plugin functionality

## Common Pitfalls

### Issue 1: Plugin Not Working

**Symptom**: Configuration added but no pruning effects visible

**Cause**: OpenCode not restarted or incorrect config file path

**Solution**:
1. Completely close OpenCode and restart
2. Check if `opencode.jsonc` location is correct
3. Check logs: log files in `~/.config/opencode/logs/dcp/daily/` directory

### Issue 2: Configuration File Not Created

**Symptom**: `~/.config/opencode/dcp.jsonc` does not exist

**Cause**: OpenCode hasn't called DCP plugin or config directory permission issues

**Solution**:
1. Confirm OpenCode has been restarted
2. Manually create config directory: `mkdir -p ~/.config/opencode`
3. Check plugin name in `opencode.jsonc`: `@tarquinen/opencode-dcp@latest`

### Issue 3: Pruning Notifications Not Displayed

**Symptom**: No pruning notifications visible, but `/dcp stats` shows pruning occurred

**Cause**: `pruneNotification` configured as `"off"` or `"minimal"`

**Solution**: Modify configuration file:
```jsonc
"pruneNotification": "detailed"  // or "minimal"
```

## Summary

Installing the DCP plugin is very simple:
1. Add plugin to `opencode.jsonc`
2. Restart OpenCode
3. Use `/dcp` command to verify installation
4. Default configuration works without additional adjustments

**DCP's default enabled features**:
- ✅ Automatic deduplication strategy (removes duplicate tool calls)
- ✅ Error cleanup strategy (cleans stale error inputs)
- ✅ AI-driven tools (`discard` and `extract`)
- ✅ Detailed pruning notifications

**Next Step**: Learn how to customize configuration to adjust pruning strategies for different scenarios.

---

## Coming Up Next

> In the next lesson, we'll learn **[Configuration Guide](../configuration/)**
>
> You'll learn:
> - Multi-level configuration system (global, environment variables, project-level)
> - All configuration options and recommended settings
> - Turn protection, protected tools, and protected file patterns
> - How to enable/disable different pruning strategies

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature        | File Path                                                                                    | Line Range |
|--- | --- | ---|
| Plugin Entry    | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts) | 12-102     |
| Config Manager  | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 669-794    |
| Command Handler | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 1-40       |
| Token Calculator| [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174     |

**Key Constants**:
- `MAX_TOOL_CACHE_SIZE = 1000`: Maximum number of tool cache entries

**Key Functions**:
- `Plugin()`: Plugin registration and hook setup
- `getConfig()`: Load and merge multi-level configuration
- `handleContextCommand()`: Analyze current session token usage

</details>
