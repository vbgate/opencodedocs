---
title: "Configuration Reference: oh-my-opencode Options | oh-my-opencode"
sidebarTitle: "Configuration Reference"
subtitle: "Configuration Reference: oh-my-opencode Options"
description: "Learn complete field definitions, types, and default values for oh-my-opencode configuration files. Covers proxy, Categories, Hooks, background tasks, and experimental features. Customize OpenCode environment and optimize AI coding workflows."
tags:
  - "configuration"
  - "reference"
  - "schema"
prerequisite: []
order: 180
---

# Configuration Reference: Complete Configuration File Schema

This page provides the complete field definitions and documentation for the oh-my-opencode configuration file.

::: info Configuration File Locations
- Project-level: `.opencode/oh-my-opencode.json`
- User-level (macOS/Linux): `~/.config/opencode/oh-my-opencode.json`
- User-level (Windows): `%APPDATA%\opencode\oh-my-opencode.json`

Project-level configuration takes precedence over user-level configuration.
:::

::: tip Enable Autocompletion
Add a `$schema` field at the top of your configuration file to get IDE autocompletion:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
}
```
:::

## Root-Level Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `$schema` | string | No | - | JSON Schema link for autocompletion |
| `disabled_mcps` | string[] | No | [] | List of disabled MCPs |
| `disabled_agents` | string[] | No | [] | List of disabled agents |
| `disabled_skills` | string[] | No | [] | List of disabled skills |
| `disabled_hooks` | string[] | No | [] | List of disabled hooks |
| `disabled_commands` | string[] | No | [] | List of disabled commands |
| `agents` | object | No | - | Agent override configuration |
| `categories` | object | No | - | Category custom configuration |
| `claude_code` | object | No | - | Claude Code compatibility configuration |
| `sisyphus_agent` | object | No | - | Sisyphus agent configuration |
| `comment_checker` | object | No | - | Comment checker configuration |
| `experimental` | object | No | - | Experimental features configuration |
| `auto_update` | boolean | No | true | Auto-update check |
| `skills` | object\|array | No | - | Skills configuration |
| `ralph_loop` | object | No | - | Ralph Loop configuration |
| `background_task` | object | No | - | Background task concurrency configuration |
| `notification` | object | No | - | Notification configuration |
| `git_master` | object | No | - | Git Master skill configuration |
| `browser_automation_engine` | object | No | - | Browser automation engine configuration |
| `tmux` | object | No | - | Tmux session management configuration |

## agents - Agent Configuration

Override built-in agent settings. Each agent supports the following fields:

### Common Agent Fields

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `model` | string | No | Override the model used by the agent (deprecated, recommend using category) |
| `variant` | string | No | Model variant |
| `category` | string | No | Inherit model and configuration from Category |
| `skills` | string[] | No | List of skills injected into the agent prompt |
| `temperature` | number | No | 0-2, controls randomness |
| `top_p` | number | No | 0-1, nucleus sampling parameter |
| `prompt` | string | No | Completely override default system prompt |
| `prompt_append` | string | No | Append to the end of the default prompt |
| `tools` | object | No | Tool permission override (`{toolName: boolean}`) |
| `disable` | boolean | No | Disable this agent |
| `description` | string | No | Agent description |
| `mode` | enum | No | `subagent` / `primary` / `all` |
| `color` | string | No | Hex color (e.g., `#FF0000`) |
| `permission` | object | No | Agent permission restrictions |

### permission - Agent Permissions

| Field | Type | Required | Values | Description |
|--- | --- | --- | --- | ---|
| `edit` | string | No | `ask`/`allow`/`deny` | File edit permission |
| `bash` | string/object | No | `ask`/`allow`/`deny` or per-command | Bash execution permission |
| `webfetch` | string | No | `ask`/`allow`/`deny` | Web request permission |
| `doom_loop` | string | No | `ask`/`allow`/`deny` | Infinite loop detection override permission |
| `external_directory` | string | No | `ask`/`allow`/`deny` | External directory access permission |

### Configurable Agents List

| Agent Name | Description |
|--- | ---|
| `sisyphus` | Main orchestrator agent |
| `prometheus` | Strategic planner agent |
| `oracle` | Strategic advisor agent |
| `librarian` | Multi-repository research expert agent |
| `explore` | Fast codebase exploration expert agent |
| `multimodal-looker` | Media analysis expert agent |
| `metis` | Pre-planning analysis agent |
| `momus` | Planning reviewer agent |
| `atlas` | Main orchestrator agent |
|--- | ---|

### Configuration Example

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": ["git-master"]
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    },
    "multimodal-looker": {
      "disable": true
    }
  }
}
```

## categories - Category Configuration

Define Categories (model abstractions) for dynamic agent composition.

### Category Fields

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `description` | string | No | Purpose description of the Category (shown in delegate_task prompt) |
| `model` | string | No | Override the model used by the Category |
| `variant` | string | No | Model variant |
| `temperature` | number | No | 0-2, temperature |
| `top_p` | number | No | 0-1, nucleus sampling |
| `maxTokens` | number | No | Maximum token count |
| `thinking` | object | No | Thinking configuration `{type, budgetTokens}` |
| `reasoningEffort` | enum | No | `low` / `medium` / `high` / `xhigh` |
| `textVerbosity` | enum | No | `low` / `medium` / `high` |
| `tools` | object | No | Tool permissions |
| `prompt_append` | string | No | Append prompt |
| `is_unstable_agent` | boolean | No | Mark as unstable agent (force background mode) |

### thinking Configuration

| Field | Type | Required | Values | Description |
|--- | --- | --- | --- | ---|
| `type` | string | Yes | `enabled`/`disabled` | Whether Thinking is enabled |
| `budgetTokens` | number | No | - | Thinking budget token count |

### Built-in Categories

| Category | Default Model | Temperature | Description |
|--- | --- | --- | ---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Frontend, UI/UX, design tasks |
| `ultrabrain` | `openai/gpt-5.2-codex` | 0.1 | High-IQ reasoning tasks |
| `artistry` | `google/gemini-3-pro` | 0.7 | Creative and artistic tasks |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Fast, low-cost tasks |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Medium tasks with unspecified type |
| `unspecified-high` | `anthropic/claude-opus-4-5` | 0.1 | High-quality tasks with unspecified type |
| `writing` | `google/gemini-3-flash` | 0.1 | Documentation and writing tasks |

### Configuration Example

```jsonc
{
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Data analysis and ML tasks"
    }
  }
}
```

## claude_code - Claude Code Compatibility Configuration

Control various features of the Claude Code compatibility layer.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `mcp` | boolean | No | - | Whether to load `.mcp.json` file |
| `commands` | boolean | No | - | Whether to load Commands |
| `skills` | boolean | No | - | Whether to load Skills |
| `agents` | boolean | No | - | Whether to load Agents (reserved) |
| `hooks` | boolean | No | - | Whether to load settings.json hooks |
| `plugins` | boolean | No | - | Whether to load Marketplace plugins |
| `plugins_override` | object | No | - | Disable specific plugins (`{pluginName: boolean}`) |

### Configuration Example

```jsonc
{
  "claude_code": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "hooks": false,
    "plugins": true,
    "plugins_override": {
      "some-plugin": false
    }
  }
}
```

## sisyphus_agent - Sisyphus Agent Configuration

Control the behavior of the Sisyphus orchestration system.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `disabled` | boolean | No | false | Disable Sisyphus orchestration system |
| `default_builder_enabled` | boolean | No | false | Enable OpenCode-Builder agent |
| `planner_enabled` | boolean | No | true | Enable Prometheus (Planner) agent |
| `replace_plan` | boolean | No | true | Demote default plan agent to subagent |

### Configuration Example

```jsonc
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

## background_task - Background Task Configuration

Control the concurrency behavior of the background agent management system.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `defaultConcurrency` | number | No | - | Default maximum concurrency |
| `providerConcurrency` | object | No | - | Provider-level concurrency limit (`{providerName: number}`) |
| `modelConcurrency` | object | No | - | Model-level concurrency limit (`{modelName: number}`) |
| `staleTimeoutMs` | number | No | 180000 | Timeout in milliseconds, minimum 60000 |

### Priority Order

`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### Configuration Example

```jsonc
{
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,
      "google/gemini-3-flash": 10
    },
    "staleTimeoutMs": 180000
  }
}
```

## git_master - Git Master Skill Configuration

Control the behavior of the Git Master skill.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `commit_footer` | boolean | No | true | Add "Ultraworked with Sisyphus" footer to commit messages |
| `include_co_authored_by` | boolean | No | true | Add "Co-authored-by: Sisyphus" trailer to commit messages |

### Configuration Example

```jsonc
{
  "git_master": {
    "commit_footer": true,
    "include_co_authored_by": true
  }
}
```

## browser_automation_engine - Browser Automation Configuration

Select the browser automation provider.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `provider` | enum | No | `playwright` | Browser automation provider |

### provider Available Values

| Value | Description | Installation Requirements |
|--- | --- | ---|
| `playwright` | Use Playwright MCP server | Auto-installed |
|--- | --- | ---|

### Configuration Example

```jsonc
{
  "browser_automation_engine": {
    "provider": "playwright"
  }
}
```

## tmux - Tmux Session Configuration

Control Tmux session management behavior.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | No | false | Whether to enable Tmux session management |
| `layout` | enum | No | `main-vertical` | Tmux layout |
| `main_pane_size` | number | No | 60 | Main pane size (20-80) |
| `main_pane_min_width` | number | No | 120 | Minimum width of main pane |
| `agent_pane_min_width` | number | No | 40 | Minimum width of agent pane |

### layout Available Values

| Value | Description |
|--- | ---|
| `main-horizontal` | Main pane at top, agent panes stacked at bottom |
| `main-vertical` | Main pane on left, agent panes stacked on right (default) |
| `tiled` | All panes in equal-sized grid |
| `even-horizontal` | All panes arranged horizontally |
| `even-vertical` | All panes stacked vertically |

### Configuration Example

```jsonc
{
  "tmux": {
    "enabled": false,
    "layout": "main-vertical",
    "main_pane_size": 60,
    "main_pane_min_width": 120,
    "agent_pane_min_width": 40
  }
}
```

## ralph_loop - Ralph Loop Configuration

Control the behavior of the Ralph Loop workflow.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | No | false | Whether to enable Ralph Loop feature |
| `default_max_iterations` | number | No | 100 | Default maximum iterations (1-1000) |
| `state_dir` | string | No | - | Custom state file directory (relative to project root) |

### Configuration Example

```jsonc
{
  "ralph_loop": {
    "enabled": false,
    "default_max_iterations": 100,
    "state_dir": ".opencode/"
  }
}
```

## notification - Notification Configuration

Control system notification behavior.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `force_enable` | boolean | No | false | Force enable session-notification even if external notification plugin detected |

### Configuration Example

```jsonc
{
  "notification": {
    "force_enable": false
  }
}
```

## comment_checker - Comment Checker Configuration

Control comment checker behavior.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `custom_prompt` | string | No | - | Custom prompt to replace default warning message. Use `{{comments}}` placeholder for detected comment XML |

### Configuration Example

```jsonc
{
  "comment_checker": {
    "custom_prompt": "Please review these redundant comments: {{comments}}"
  }
}
```

## experimental - Experimental Features Configuration

Control the enablement of experimental features.

### Fields

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `aggressive_truncation` | boolean | No | - | Enable more aggressive truncation behavior |
| `auto_resume` | boolean | No | - | Enable auto-resume (recover from thinking block errors or thinking disable violations) |
| `truncate_all_tool_outputs` | boolean | No | false | Truncate all tool outputs, not just whitelisted tools |
| `dynamic_context_pruning` | object | No | - | Dynamic context pruning configuration |

### dynamic_context_pruning Configuration

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | No | false | Enable dynamic context pruning |
| `notification` | enum | No | `detailed` | Notification level: `off` / `minimal` / `detailed` |
| `turn_protection` | object | No | - | Turn protection configuration |
| `protected_tools` | string[] | No | - | List of tools never to prune |
| `strategies` | object | No | - | Pruning strategy configuration |

### turn_protection Configuration

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | No | true | Enable turn protection |
| `turns` | number | No | 3 | Protect last N turns of tool outputs (1-10) |

### strategies Configuration

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `deduplication` | object | No | - | Deduplication strategy configuration |
| `supersede_writes` | object | No | - | Write supersede strategy configuration |
| `purge_errors` | object | No | - | Error purge strategy configuration |

### deduplication Configuration

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | No | true | Remove duplicate tool calls (same tool + same parameters) |

### supersede_writes Configuration

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | No | true | Prune write inputs on subsequent reads |
| `aggressive` | boolean | No | false | Aggressive mode: prune ANY write on ANY subsequent read |

### purge_errors Configuration

| Field | Type | Required | Default | Description |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | No | true | Prune error tool inputs after N turns |
| `turns` | number | No | 5 | Number of turns to prune error tool inputs (1-20) |

### Configuration Example

```jsonc
{
  "experimental": {
    "aggressive_truncation": true,
    "auto_resume": true,
    "truncate_all_tool_outputs": false,
    "dynamic_context_pruning": {
      "enabled": false,
      "notification": "detailed",
      "turn_protection": {
        "enabled": true,
        "turns": 3
      },
      "protected_tools": [
        "task",
        "todowrite",
        "todoread",
        "lsp_rename",
        "session_read",
        "session_write",
        "session_search"
      ],
      "strategies": {
        "deduplication": {
          "enabled": true
        },
        "supersede_writes": {
          "enabled": true,
          "aggressive": false
        },
        "purge_errors": {
          "enabled": true,
          "turns": 5
        }
      }
    }
  }
}
```

## skills - Skills Configuration

Configure the loading and behavior of Skills (specialized skills).

### Configuration Format

Skills support two formats:

**Format 1: Simple Array**

```jsonc
{
  "skills": ["skill1", "skill2", "skill3"]
}
```

**Format 2: Object Configuration**

```jsonc
{
  "skills": {
    "sources": [
      "path/to/skills",
      {
        "path": "another/path",
        "recursive": true,
        "glob": "*.md"
      }
    ],
    "enable": ["skill1", "skill2"],
    "disable": ["skill3"]
  }
}
```

### Skill Definition Fields

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `description` | string | No | Skill description |
| `template` | string | No | Skill template |
| `from` | string | No | Source |
| `model` | string | No | Model used |
| `agent` | string | No | Agent used |
| `subtask` | boolean | No | Whether it's a subtask |
| `argument-hint` | string | No | Argument hint |
| `license` | string | No | License |
| `compatibility` | string | No | Compatibility |
| `metadata` | object | No | Metadata |
| `allowed-tools` | string[] | No | Allowed tools list |
| `disable` | boolean | No | Disable this Skill |

### Built-in Skills

| Skill | Description |
|--- | ---|
| `playwright` | Browser automation (default) |
| `agent-browser` | Browser automation (Vercel CLI) |
| `frontend-ui-ux` | Frontend UI/UX design |
| `git-master` | Git expert |

## Disable Lists

The following fields are used to disable specific feature modules.

### disabled_mcps - Disabled MCPs List

```jsonc
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

### disabled_agents - Disabled Agents List

```jsonc
{
  "disabled_agents": ["oracle", "multimodal-looker"]
}
```

### disabled_skills - Disabled Skills List

```jsonc
{
  "disabled_skills": ["playwright"]
}
```

### disabled_hooks - Disabled Hooks List

```jsonc
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

### disabled_commands - Disabled Commands List

```jsonc
{
  "disabled_commands": ["init-deep", "start-work"]
}
```

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-26

| Feature | File Path | Lines |
|--- | --- | ---|
| Configuration Schema Definition | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-378 |
| JSON Schema | [`assets/oh-my-opencode.schema.json`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/assets/oh-my-opencode.schema.json) | 1-51200 |
| Configuration Documentation | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/docs/configurations.md) | 1-595 |

**Key Types**:
- `OhMyOpenCodeConfig`: Main configuration type
- `AgentOverrideConfig`: Agent override configuration type
- `CategoryConfig`: Category configuration type
- `BackgroundTaskConfig`: Background task configuration type
- `PermissionValue`: Permission value type (`ask`/`allow`/`deny`)

**Key Enums**:
- `BuiltinAgentNameSchema`: Built-in agent name enum
- `BuiltinSkillNameSchema`: Built-in skill name enum
- `BuiltinCategoryNameSchema`: Built-in Category name enum
- `HookNameSchema`: Hook name enum
- `BrowserAutomationProviderSchema`: Browser automation provider enum

---

## Next Lesson Preview

> In the next lesson, we'll learn about **[Built-in MCP Servers](../builtin-mcps/)**.
>
> You will learn:
> - Features and usage of 3 built-in MCP servers
> - Configuration and best practices for Exa Websearch, Context7, and grep.app
> - How to use MCPs to search documentation and code

</details>
