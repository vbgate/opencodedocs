---
title: "Compatibility: Claude Code | oh-my-opencode"
sidebarTitle: "Claude Code"
subtitle: "Claude Code Compatibility: Complete Support for Commands, Skills, Agents, MCPs, and Hooks"
description: "Learn oh-my-opencode's Claude Code compatibility. Load mechanisms, priority rules, disable switches, and smooth migration from Claude Code to OpenCode."
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Claude Code Compatibility: Complete Support for Commands, Skills, Agents, MCPs, and Hooks

## What You'll Learn

- Use existing Claude Code configurations and plugins in OpenCode
- Understand priority rules for different configuration sources
- Control loading of Claude Code compatibility features through configuration switches
- Migrate smoothly from Claude Code to OpenCode

## Your Current Challenges

If you're migrating from Claude Code to OpenCode, you may have already configured many custom Commands, Skills, and MCP servers in the `~/.claude/` directory. Duplicating these configurations is tedious, and you want to reuse them directly in OpenCode.

Oh My OpenCode provides a complete Claude Code compatibility layer that lets you use existing Claude Code configurations and plugins without any modifications.

## Core Concepts

Oh My OpenCode achieves compatibility with Claude Code configuration formats through an **automatic loading mechanism**. The system automatically scans Claude Code's standard configuration directories at startup, converts these resources into a format that OpenCode can recognize, and registers them in the system.

Compatibility covers the following features:

| Feature | Compatibility Status | Description |
|--- | --- | ---|
| **Commands** | ✅ Fully Supported | Load slash commands from `~/.claude/commands/` and `.claude/commands/` |
| **Skills** | ✅ Fully Supported | Load professional skills from `~/.claude/skills/` and `.claude/skills/` |
| **Agents** | ⚠️ Reserved | Interface reserved, currently only supports built-in Agents |
| **MCPs** | ✅ Fully Supported | Load MCP server configurations from `.mcp.json` and `~/.claude/.mcp.json` |
| **Hooks** | ✅ Fully Supported | Load custom lifecycle hooks from `settings.json` |
| **Plugins** | ✅ Fully Supported | Load Marketplace plugins from `installed_plugins.json` |

---

## Configuration Loading Priority

Oh My OpenCode supports loading configurations from multiple locations, merging them in a fixed priority order. **Higher priority configurations override lower priority configurations**.

### Commands Loading Priority

Commands are loaded in the following order (from highest to lowest):

1. `.opencode/command/` (project-level, highest priority)
2. `~/.config/opencode/command/` (user-level)
3. `.claude/commands/` (project-level Claude Code compatibility)
4. `~/.claude/commands/` (user-level Claude Code compatibility)

**Source location**: `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// Load Commands from 4 directories, merge by priority
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**Example**: If you have commands with the same name in `.opencode/command/refactor.md` and `~/.claude/commands/refactor.md`, the command in `.opencode/` will take effect.

### Skills Loading Priority

Skills are loaded in the following order (from highest to lowest):

1. `.opencode/skills/*/SKILL.md` (project-level, highest priority)
2. `~/.config/opencode/skills/*/SKILL.md` (user-level)
3. `.claude/skills/*/SKILL.md` (project-level Claude Code compatibility)
4. `~/.claude/skills/*/SKILL.md` (user-level Claude Code compatibility)

**Source location**: `src/features/opencode-skill-loader/loader.ts:206-215`

**Example**: Project-level Skills will override user-level Skills, ensuring each project's specific needs are prioritized.

### MCPs Loading Priority

MCP configurations are loaded in the following order (from highest to lowest):

1. `.claude/.mcp.json` (project-level, highest priority)
2. `.mcp.json` (project-level)
3. `~/.claude/.mcp.json` (user-level)

**Source location**: `src/features/claude-code-mcp-loader/loader.ts:18-27`

**Feature**: MCP configurations support environment variable expansion (e.g., `${OPENAI_API_KEY}`), automatically resolved through `env-expander.ts`.

**Source location**: `src/features/claude-code-mcp-loader/env-expander.ts`

### Hooks Loading Priority

Hooks are loaded from the `hooks` field in `settings.json`, supporting the following paths (by priority):

1. `.claude/settings.local.json` (local configuration, highest priority)
2. `.claude/settings.json` (project-level)
3. `~/.claude/settings.json` (user-level)

**Source location**: `src/hooks/claude-code-hooks/config.ts:46-59`

**Feature**: Hooks from multiple configuration files are automatically merged rather than overwriting each other.

---

## Configuration Disable Switches

If you don't want to load certain Claude Code configurations, you can use the `claude_code` field in `oh-my-opencode.json` for fine-grained control.

### Completely Disable Compatibility

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### Partial Disable

You can also disable specific features only:

```jsonc
{
  "claude_code": {
    "mcp": false,         // Disable .mcp.json files (but keep built-in MCPs)
    "commands": false,     // Disable ~/.claude/commands/ and .claude/commands/
    "skills": false,       // Disable ~/.claude/skills/ and .claude/skills/
    "agents": false,       // Disable ~/.claude/agents/ (keep built-in Agents)
    "hooks": false,        // Disable settings.json hooks
    "plugins": false       // Disable Claude Code Marketplace plugins
  }
}
```

**Switch descriptions**:

| Switch | Disabled Content | Retained Content |
|--- | --- | ---|
| `mcp` | `.mcp.json` files | Built-in MCPs (websearch, context7, grep_app) |
| `commands` | `~/.claude/commands/`, `.claude/commands/` | OpenCode native Commands |
| `skills` | `~/.claude/skills/`, `.claude/skills/` | OpenCode native Skills |
| `agents` | `~/.claude/agents/` | Built-in Agents (Sisyphus, Oracle, Librarian, etc.) |
| `hooks` | `settings.json` hooks | Oh My OpenCode built-in Hooks |
| `plugins` | Claude Code Marketplace plugins | Built-in plugin functionality |

### Disable Specific Plugins

Use `plugins_override` to disable specific Claude Code Marketplace plugins:

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Disable claude-mem plugin
    }
  }
}
```

**Source location**: `src/config/schema.ts:143`

---

## Data Storage Compatibility

Oh My OpenCode is compatible with Claude Code's data storage format, ensuring persistence and migration of session and task data.

### Todos Storage

- **Location**: `~/.claude/todos/`
- **Format**: Claude Code compatible JSON format
- **Purpose**: Store task lists and to-do items

**Source location**: `src/features/claude-code-session-state/index.ts`

### Transcripts Storage

- **Location**: `~/.claude/transcripts/`
- **Format**: JSONL (one JSON object per line)
- **Purpose**: Store session history and message records

**Source location**: `src/features/claude-code-session-state/index.ts`

**Advantage**: Shares the same data directory with Claude Code, enabling direct migration of session history.

---

## Claude Code Hooks Integration

The `hooks` field in Claude Code's `settings.json` defines custom scripts that execute at specific event points. Oh My OpenCode fully supports these Hooks.

### Hook Event Types

| Event | Trigger Timing | Available Actions |
|--- | --- | ---|
| **PreToolUse** | Before tool execution | Block tool calls, modify input parameters, inject context |
| **PostToolUse** | After tool execution | Add warnings, modify output, inject messages |
| **UserPromptSubmit** | When user submits prompt | Block prompt, inject messages, transform prompt |
| **Stop** | When session goes idle | Inject follow-up prompts, execute automation tasks |

**Source location**: `src/hooks/claude-code-hooks/index.ts`

### Hook Configuration Example

Here's a typical Claude Code Hooks configuration:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**Field descriptions**:

- **matcher**: Tool name matching pattern (supports wildcard `*`)
- **type**: Hook type (`command`, `inject`, etc.)
- **command**: Shell command to execute (supports variables like `$FILE`)
- **content**: Message content to inject

### Hook Execution Mechanism

Oh My OpenCode automatically executes these custom Hooks through the `claude-code-hooks` Hook. This Hook checks and loads Claude Code configurations at all event points.

**Source location**: `src/hooks/claude-code-hooks/index.ts:36-401`

**Execution flow**:

1. Load Claude Code's `settings.json`
2. Parse the `hooks` field and match the current event
3. Execute matching Hooks in order
4. Modify agent behavior based on return results (block, inject, warning, etc.)

**Example**: If a PreToolUse Hook returns `deny`, the tool call will be blocked and the agent will receive an error message.

---

## Common Use Cases

### Scenario 1: Migrate Claude Code Configuration

If you've already configured Commands and Skills in Claude Code, you can use them directly in OpenCode:

**Steps**:

1. Ensure the `~/.claude/` directory exists and contains your configurations
2. Start OpenCode, Oh My OpenCode will automatically load these configurations
3. Type `/` in the chat to see loaded Commands
4. Use Commands or call Skills

**Verification**: Check the number of loaded configurations in the Oh My OpenCode startup logs.

### Scenario 2: Project-level Configuration Override

You want to use different Skills for specific projects without affecting other projects:

**Steps**:

1. Create a `.claude/skills/` directory in the project root
2. Add project-specific Skills (e.g., `./.claude/skills/my-skill/SKILL.md`)
3. Restart OpenCode
4. Project-level Skills will automatically override user-level Skills

**Advantage**: Each project can have independent configurations without interfering with each other.

### Scenario 3: Disable Claude Code Compatibility

You only want to use OpenCode native configurations and don't want to load old Claude Code configurations:

**Steps**:

1. Edit `oh-my-opencode.json`
2. Add the following configuration:

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. Restart OpenCode

**Result**: The system will ignore all Claude Code configurations and only use OpenCode native configurations.

---

## Common Pitfalls

### ⚠️ Configuration Conflicts

**Problem**: If there are configurations with the same name in multiple locations (e.g., the same Command name appears in `.opencode/command/` and `~/.claude/commands/`), it can lead to unpredictable behavior.

**Solution**: Understand loading priority and place the highest priority configuration in the highest priority directory.

### ⚠️ MCP Configuration Format Differences

**Problem**: Claude Code's MCP configuration format is slightly different from OpenCode's, and direct copying may not work.

**Solution**: Oh My OpenCode automatically converts formats, but it's recommended to refer to the official documentation to ensure correct configuration.

**Source location**: `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Hooks Performance Impact

**Problem**: Too many Hooks or complex Hook scripts can cause performance degradation.

**Solution**: Limit the number of Hooks and keep only necessary Hooks. You can disable specific Hooks through `disabled_hooks`.

---

## Lesson Summary

Oh My OpenCode provides a complete Claude Code compatibility layer that lets you seamlessly migrate and reuse existing configurations:

- **Configuration loading priority**: Load configurations in the order project-level > user-level > Claude Code compatibility
- **Compatibility switches**: Precisely control which features to load through the `claude_code` field
- **Data storage compatibility**: Share the `~/.claude/` directory, supporting migration of session and task data
- **Hooks integration**: Full support for Claude Code's lifecycle hook system

If you're migrating from Claude Code, this compatibility layer lets you start using OpenCode with zero configuration.

---

## Next Lesson Preview

> In the next lesson, we'll learn about **[Configuration Reference](../configuration-reference/)**.
>
> You'll learn:
> - Complete `oh-my-opencode.json` configuration field descriptions
> - Types, default values, and constraints for each field
> - Common configuration patterns and best practices

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-26

| Feature | File Path | Lines |
|--- | --- | ---|
| Claude Code Hooks main entry | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Hooks configuration loading | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| MCP configuration loader | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Commands loader | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Skills loader | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Plugins loader | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | Full file |
| Data storage compatibility | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | Full file |
| MCP configuration transformer | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | Full file |
| Environment variable expansion | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | Full file |

**Key functions**:

- `createClaudeCodeHooksHook()`: Create Claude Code Hooks integration Hook, handling all events (PreToolUse, PostToolUse, UserPromptSubmit, Stop)
- `loadClaudeHooksConfig()`: Load Claude Code's `settings.json` configuration
- `loadMcpConfigs()`: Load MCP server configurations, supporting environment variable expansion
- `loadAllCommands()`: Load Commands from 4 directories, merge by priority
- `discoverSkills()`: Load Skills from 4 directories, supporting Claude Code compatibility paths
- `getClaudeConfigDir()`: Get Claude Code configuration directory path (platform-dependent)

**Key constants**:

- Configuration loading priority: `.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Hook event types: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `PreCompact`

</details>
