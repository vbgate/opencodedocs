---
title: "Configuration: DCP Setup | opencode-dynamic-context-pruning"
sidebarTitle: "Configuration"
subtitle: "Configuration: DCP Setup"
description: "Learn DCP's configuration system. Master global, environment, and project-level settings. Configure pruning strategies, protection mechanisms, and notification levels with practical examples."
tags:
  - "Configuration"
  - "DCP"
  - "Plugin Settings"
prerequisite:
  - "start-getting-started"
order: 2
---

# DCP Configuration Explained

## What You'll Learn

- Master DCP's three-tier configuration system (global, project, environment variables)
- Understand configuration priority rules and know which configuration takes effect
- Adjust pruning strategies and protection mechanisms based on requirements
- Configure notification levels to control the detail level of pruning prompts

## Your Current Challenges

DCP works out of the box after installation, but you may encounter these issues:

- Want to set different pruning strategies for different projects
- Don't want certain files to be pruned
- Pruning prompts are too frequent or too detailed
- Want to disable a specific auto-pruning strategy

This is when you need to understand DCP's configuration system.

## When to Use This

- **Project-level customization**: Different projects have different pruning needs
- **Debugging issues**: Enable debug logs to locate problems
- **Performance tuning**: Adjust strategy switches and thresholds
- **Personalized experience**: Modify notification levels, protect critical tools

## Core Concept

DCP uses a **three-tier configuration system**, with priorities from low to high in this order:

```
Default values (hardcoded) → Global config → Environment variable config → Project config
              Lowest priority                                  Highest priority
```

Each level's configuration overrides the same-named configuration item from the previous level, so project configuration has the highest priority.

::: info Why do we need multi-level configuration?

The design purpose is:
- **Global config**: Set common default behaviors applicable to all projects
- **Project config**: Customize for specific projects without affecting other projects
- **Environment variables**: Quickly switch configurations in different environments (such as CI/CD)

:::

## 🎒 Prerequisites

Ensure you have completed [Installation & Quick Start](../getting-started/), the DCP plugin is successfully installed and running in OpenCode.

## Follow Along

### Step 1: View Current Configuration

**Why**
First understand the default configuration, then decide how to adjust it.

DCP automatically creates a global configuration file on first run.

```bash
# macOS/Linux
cat ~/.config/opencode/dcp.jsonc

# Windows PowerShell
Get-Content "$env:USERPROFILE\.config\opencode\dcp.jsonc"
```

**You should see**: Default configuration similar to below

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    "enabled": true,
    "debug": false,
    "pruneNotification": "detailed",
    "commands": {
        "enabled": true,
        "protectedTools": []
    },
    "turnProtection": {
        "enabled": false,
        "turns": 4
    },
    "protectedFilePatterns": [],
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 10,
            "protectedTools": []
        },
        "discard": {
            "enabled": true
        },
        "extract": {
            "enabled": true,
            "showDistillation": false
        }
    },
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": []
        },
        "supersedeWrites": {
            "enabled": false
        },
        "purgeErrors": {
            "enabled": true,
            "turns": 4,
            "protectedTools": []
        }
    }
}
```

### Step 2: Understand Configuration File Locations

DCP supports three levels of configuration files:

| Level | Path | Priority | Use Case |
|------|------|----------|----------|
| **Global** | `~/.config/opencode/dcp.jsonc` or `dcp.json` | 2 | Default configuration for all projects |
| **Environment Variable** | `$OPENCODE_CONFIG_DIR/dcp.jsonc` or `dcp.json` | 3 | Configuration for specific environments |
| **Project** | `<project>/.opencode/dcp.jsonc` or `dcp.json` | 4 | Single project configuration override |

::: tip Configuration file formats

DCP supports both `.json` and `.jsonc` formats:
- `.json`: Standard JSON format, cannot contain comments
- `.jsonc`: JSON format with `//` comment support (recommended)

:::

### Step 3: Configure Pruning Notifications

**Why**
Control the detail level of DCP's pruning notifications to avoid excessive disturbance.

Edit the global configuration file:

```jsonc
{
    "pruneNotification": "detailed"  // Options: "off", "minimal", "detailed"
}
```

**Notification level descriptions**:

| Level | Behavior | Use Case |
|------|----------|----------|
| **off** | Don't show pruning notifications | Focus on development, no feedback needed |
| **minimal** | Show only brief statistics (number of tokens saved) | Need simple feedback, don't want too much information |
| **detailed** | Show detailed pruning information (tool names, reasons) | Understand pruning behavior, debug configuration |

**You should see**: After modifying the configuration, notifications will display according to the new level when pruning is next triggered.

### Step 4: Configure Auto-Pruning Strategies

**Why**
DCP provides three auto-pruning strategies that you can enable or disable based on needs.

Edit the configuration file:

```jsonc
{
    "strategies": {
        // Deduplication strategy: Remove duplicate tool calls
        "deduplication": {
            "enabled": true,           // Enable/disable
            "protectedTools": []       // Additional protected tool names
        },

        // Supersede writes strategy: Clean up write operations that have been overwritten by reads
        "supersedeWrites": {
            "enabled": false          // Disabled by default
        },

        // Purge errors strategy: Clean up inputs from expired error tools
        "purgeErrors": {
            "enabled": true,           // Enable/disable
            "turns": 4,               // Clean up errors after this many turns
            "protectedTools": []       // Additional protected tool names
        }
    }
}
```

**Strategy details**:

- **deduplication (deduplication)**: Enabled by default. Detects calls with the same tool and parameters, keeping only the most recent one.
- **supersedeWrites (supersede writes)**: Disabled by default. If a read operation occurs after a write, cleans up the input of that write operation.
- **purgeErrors (purge errors)**: Enabled by default. Error tools exceeding the specified number of turns will be pruned (only keeping the error message, removing potentially large input parameters).

### Step 5: Configure Protection Mechanisms

**Why**
Avoid accidentally pruning critical content (such as important files, core tools).

DCP provides three protection mechanisms:

#### 1. Turn Protection

Protect tool outputs from recent turns to give the AI enough time to reference them.

```jsonc
{
    "turnProtection": {
        "enabled": false,   // When enabled, protects the last 4 turns
        "turns": 4          // Number of turns to protect
    }
}
```

**Use case**: Enable when you find the AI frequently loses context.

#### 2. Protected Tools

Some tools are never pruned by default:

```
task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
```

You can add additional tools that need protection:

```jsonc
{
    "tools": {
        "settings": {
            "protectedTools": [
                "myCustomTool",   // Add custom tool
                "databaseQuery"    // Add tool that needs protection
            ]
        }
    },
    "strategies": {
        "deduplication": {
            "protectedTools": ["databaseQuery"]  // Protect tool for specific strategy
        }
    }
}
```

#### 3. Protected File Patterns

Use glob patterns to protect specific files:

```jsonc
{
    "protectedFilePatterns": [
        "**/*.config.ts",           // Protect all .config.ts files
        "**/secrets/**",           // Protect all files under secrets directory
        "**/*.env",                // Protect environment variable files
        "**/critical/*.json"        // Protect JSON files under critical directory
    ]
}
```

::: warning Note
protectedFilePatterns matches `tool.parameters.filePath`, not the file's actual path. This means it only applies to tools with a `filePath` parameter (such as read, write, edit).

:::

### Step 6: Create Project-Level Configuration

**Why**
Different projects may need different pruning strategies.

Create a `.opencode` directory in the project root (if it doesn't exist), then create `dcp.jsonc`:

```bash
# Execute in project root directory
mkdir -p .opencode
cat > .opencode/dcp.jsonc << 'EOF'
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    // Project-specific configuration
    "strategies": {
        "supersedeWrites": {
            "enabled": true   // Enable supersede writes strategy for this project
        }
    },
    "protectedFilePatterns": [
        "**/config/**/*.ts"   // Protect this project's configuration files
    ]
}
EOF
```

**You should see**:
- Project-level configuration overrides global configuration items with the same name
- Items not overridden continue to use global configuration

### Step 7: Enable Debug Logging

**Why**
When encountering issues, view detailed debug logs.

Edit the configuration file:

```jsonc
{
    "debug": true
}
```

**Log location**:
```
~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log
```

**You should see**: The log file contains detailed pruning operations, configuration loading, and other information.

::: info Production environment recommendation
Remember to change `debug` back to `false` after debugging to avoid log files growing too quickly.

:::

## Checkpoint ✅

After completing the above steps, confirm the following:

- [ ] Know the three levels of configuration files and their priorities
- [ ] Can modify notification levels and see the effects
- [ ] Understand the purpose of the three auto-pruning strategies
- [ ] Can configure protection mechanisms (turns, tools, files)
- [ ] Can create project-level configuration to override global settings

## Common Pitfalls

### Configuration changes not taking effect

**Problem**: After modifying the configuration file, OpenCode doesn't respond.

**Cause**: OpenCode doesn't automatically reload configuration files.

**Solution**: After modifying configuration, you need to **restart OpenCode**.

### Configuration file syntax errors

**Problem**: The configuration file has syntax errors and DCP cannot parse it.

**Symptoms**: OpenCode will display a Toast warning indicating "Invalid config".

**Solution**: Check JSON syntax, especially:
- Are quotes, commas, and brackets matching?
- Are there extra commas (such as after the last element)?
- Use `true`/`false` for boolean values, don't use quotes

**Recommended practice**: Use an editor that supports JSONC (such as VS Code + JSONC plugin).

### Protected tools not working

**Problem**: Added `protectedTools`, but tools are still being pruned.

**Causes**:
1. Tool name is misspelled
2. Added to the wrong `protectedTools` array (such as `tools.settings.protectedTools` vs `strategies.deduplication.protectedTools`)
3. Tool call is within the turn protection period (if turn protection is enabled)

**Solutions**:
1. Confirm the tool name is spelled correctly
2. Check if it was added to the correct location
3. Check debug logs to understand the pruning reason

## Lesson Summary

Core points of DCP configuration system:

- **Three-tier configuration**: Default values → Global → Environment variables → Project, priority increases
- **Flexible override**: Project configuration can override global configuration
- **Protection mechanisms**: Turn protection, protected tools, protected file patterns to avoid accidental pruning
- **Auto strategies**: Deduplication, supersede writes, purge errors, enable/disable as needed
- **Restart to take effect**: Remember to restart OpenCode after modifying configuration

## Next Lesson Preview

> In the next lesson, we'll learn **[Auto-Pruning Strategies Explained](../../platforms/auto-pruning/)**.
>
> You'll learn:
> - How deduplication strategy detects duplicate tool calls
> - How supersede writes strategy works
> - Trigger conditions for purge errors strategy
> - How to monitor strategy effectiveness

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature        | File Path                                                                                                            | Line Numbers |
| ----------- | ------------------------------------------------------------------------------------------------------------------- | --------- |
| Configuration Management Core | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts)         | 1-798     |
| Configuration Schema  | [`dcp.schema.json`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/dcp.schema.json) | 1-232     |
| Default Configuration    | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L423-L464) | 423-464   |
| Configuration Priority  | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797   |
| Configuration Validation    | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-L375) | 147-375   |
| Configuration File Paths | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L484-L526) | 484-526   |
| Default Protected Tools | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-L79) | 68-79     |
| Merge Strategy Configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L565-L595) | 565-595   |
| Merge Tool Configuration | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L597-L622) | 597-622   |

**Key Constants**:
- `DEFAULT_PROTECTED_TOOLS`: Default protected tool name list (`lib/config.ts:68-79`)

**Key Functions**:
- `getConfig()`: Load and merge all levels of configuration (`lib/config.ts:669-797`)
- `getInvalidConfigKeys()`: Validate invalid keys in configuration files (`lib/config.ts:135-138`)
- `validateConfigTypes()`: Validate configuration value types (`lib/config.ts:147-375`)
- `getConfigPaths()`: Get all configuration file paths (`lib/config.ts:484-526`)

</details>
