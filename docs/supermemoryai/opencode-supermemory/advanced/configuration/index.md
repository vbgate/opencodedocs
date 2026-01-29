---
title: "配置: 高级设置 | opencode-supermemory"
sidebarTitle: "高级配置"
subtitle: "Advanced Configuration: Customizing Your Memory Engine"
description: "学习 opencode-supermemory 的高级配置。自定义触发词、调整上下文注入策略、优化压缩阈值，灵活管理环境变量。"
tags:
  - "Configuration"
  - "Advanced"
  - "Customization"
prerequisite:
  - "start-getting-started"
order: 999
---

# Advanced Configuration: Customizing Your Memory Engine

## What You'll Learn

- **Customize Trigger Words**: Teach the Agent to recognize your specific commands (e.g., "mark", "save note").
- **Adjust Memory Capacity**: Control the number of memories injected into the context, balancing token usage with information density.
- **Optimize Compression Strategy**: Tune the timing of preemptive compression based on project scale.
- **Multi-Environment Management**: Flexibly switch API Keys using environment variables.

## Configuration File Location

opencode-supermemory looks for configuration files in the following order and **stops at the first match**:

1. `~/.config/opencode/supermemory.jsonc` (Recommended, supports comments)
2. `~/.config/opencode/supermemory.json`

::: tip Why .jsonc?
The `.jsonc` format allows comments (`//`) in JSON, which is perfect for documenting the purpose of your configuration settings.
:::

## Core Configuration Explained

Below is a complete configuration example containing all available options and their default values.

### Basic Configuration

```jsonc
// ~/.config/opencode/supermemory.jsonc
{
  // Supermemory API Key
  // Priority: Config file > Environment variable SUPERMEMORY_API_KEY
  "apiKey": "your-api-key-here",

  // Similarity threshold for semantic search (0.0 - 1.0)
  // Higher values yield more precise but fewer results; lower values are more inclusive
  "similarityThreshold": 0.6
}
```

### Context Injection Control

These settings determine how many memories the Agent automatically reads and injects into the Prompt when starting a session.

```jsonc
{
  // Whether to automatically inject User Profile
  // Set to false to save tokens, but the Agent might forget your basic preferences
  "injectProfile": true,

  // Maximum number of User Profile items to inject
  "maxProfileItems": 5,

  // Maximum number of User Scope memories to inject
  // These are general memories shared across projects
  "maxMemories": 5,

  // Maximum number of Project Scope memories to inject
  // These are memories specific to the current project
  "maxProjectMemories": 10
}
```

### Custom Trigger Words

You can add custom regular expressions to let the Agent recognize specific instructions and automatically save memories.

```jsonc
{
  // List of custom trigger word patterns (supports Regex)
  // These are merged with the built-in default trigger words
  "keywordPatterns": [
    "mark\\s+this",     // Regex match: mark this
    "important[:：]",    // Matches "important:" or "important："
    "TODO\\(memory\\)", // Matches specific tag
    "note\\s+to\\s+self" // Simple phrase match
  ]
}
```

::: details View Built-in Default Trigger Words
The plugin comes with the following built-in trigger words, ready to use without configuration:
- `remember`, `memorize`
- `save this`, `note this`
- `keep in mind`, `don't forget`
- `learn this`, `store this`
- `record this`, `make a note`
- `take note`, `jot down`
- `commit to memory`
- `remember that`
- `never forget`, `always remember`
:::

### Preemptive Compaction

When the session context becomes too long, the plugin automatically triggers a compression mechanism.

```jsonc
{
  // Compression trigger threshold (0.0 - 1.0)
  // Triggers compression when token usage exceeds this ratio
  // Default: 0.80 (80%)
  "compactionThreshold": 0.80
}
```

::: warning Threshold Setting Advice
- **Don't set it too high** (e.g., > 0.95): You might run out of context window before compression completes.
- **Don't set it too low** (e.g., < 0.50): This causes frequent compression, interrupting flow and wasting tokens.
- **Recommended range**: Between 0.70 and 0.85.
:::

## Environment Variable Support

In addition to configuration files, you can use environment variables to manage sensitive information or override default behaviors.

| Environment Variable | Description | Priority |
|--- | --- | ---|
| `SUPERMEMORY_API_KEY` | Supermemory API Key | Lower than config file |
| `USER` or `USERNAME` | Identifier used to generate User Scope Hash | System default |

### Use Case: Switching Environments

If you use different Supermemory accounts for work and personal projects, you can leverage environment variables:

::: code-group

```bash [macOS/Linux]
# Set default Key in .zshrc or .bashrc
export SUPERMEMORY_API_KEY="key_personal"

# Temporarily override Key in work project directory
export SUPERMEMORY_API_KEY="key_work" && opencode
```

```powershell [Windows]
# Set environment variable
$env:SUPERMEMORY_API_KEY="key_work"
opencode
```

:::

## Hands-on: Customize Your Configuration

Let's create an optimized configuration suitable for most developers.

### Step 1: Create the Configuration File

Create the file if it doesn't exist.

```bash
mkdir -p ~/.config/opencode
touch ~/.config/opencode/supermemory.jsonc
```

### Step 2: Write Optimized Configuration

Copy the following content into `supermemory.jsonc`. This configuration increases the weight of project memories and adds some custom trigger words.

```jsonc
{
  // Keep default similarity
  "similarityThreshold": 0.6,

  // Increase project memories, decrease general memories
  // Better suited for deep development work
  "maxMemories": 3,
  "maxProjectMemories": 15,

  // Add custom trigger words
  "keywordPatterns": [
    "memo",
    "archive this",
    "save note",
    "don't lose this"
  ],

  // Trigger compression slightly earlier for a larger safety margin
  "compactionThreshold": 0.75
}
```

### Step 3: Verify Configuration

Restart OpenCode and try using the newly defined trigger words in a conversation:

```
User Input:
memo: The API base path for this project is /api/v2

System Reply (Expected):
(Agent calls supermemory tool to save memory)
Memory saved: The API base path for this project is /api/v2
```

## FAQ

### Q: Do I need to restart after modifying the configuration?
**A: Yes.** The plugin loads configuration at startup. You must restart OpenCode for changes in `supermemory.jsonc` to take effect.

### Q: Does `keywordPatterns` support non-English characters?
**A: Yes.** It uses JavaScript's `new RegExp()` under the hood, fully supporting Unicode characters (e.g., Chinese, Japanese, Emoji).

### Q: What happens if the configuration file format is wrong?
**A: The plugin falls back to defaults.** If the JSON is invalid (e.g., trailing commas in standard JSON), the plugin catches the error and uses the built-in `DEFAULTS` without crashing OpenCode.

## What's Next

> Next, we'll learn about **[Privacy & Data Security](../../security/privacy/)**.
>
> You will learn:
> - Automatic sensitive data masking mechanisms
> - How to use the `<private>` tag to protect privacy
> - Security boundaries for data storage

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last Updated: 2026-01-23

| Feature | File Path | Line Number |
|--- | --- | ---|
| Config Interface Definition | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L12-L23) | 12-23 |
| Default Values | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |
| Default Trigger Words | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L25-L42) | 25-42 |
| Config File Loading | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L73-L86) | 73-86 |
| Env Variable Reading | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |

</details>
