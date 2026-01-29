---
title: "高级配置: 代理和权限 | oh-my-opencode"
sidebarTitle: "高级配置"
subtitle: "高级配置: 代理和权限 | oh-my-opencode"
description: "学习 oh-my-opencode 的高级配置方法。自定义代理模型、精确控制权限、添加提示词，打造完美的 AI 开发团队。"
tags:
  - "configuration"
  - "agents"
  - "permissions"
  - "customization"
prerequisite:
  - "start-installation"
  - "platforms-provider-setup"
order: 140
---

# 高级配置: 代理和权限 | oh-my-opencode

## What You'll Learn

- Customize the model and parameters for each agent
- Precisely control agent permissions (file editing, Bash execution, Web requests, etc.)
- Add additional instructions to agents using `prompt_append`
- Create custom Categories for dynamic agent combinations
- Enable/disable specific agents, Skills, Hooks, and MCPs

## Current Challenge

**Default configuration works well, but doesn't fit your needs:**
- Oracle uses GPT 5.2 which is too expensive, you want a cheaper model
- Explore agent shouldn't have write permission, just let it search
- You want Librarian to prioritize official documentation over GitHub
- A certain Hook keeps giving false positives, you want to temporarily disable it

**What you need is "deep customization"**—not "it works," but "it works just right."

---

## 🎒 Prerequisites

::: warning Prerequisites
This tutorial assumes you have completed [Installation](../../start/installation/) and [Provider Setup](../../platforms/provider-setup/).
:::

**You need to know**:
- Configuration file location: `~/.config/opencode/oh-my-opencode.json` (user-level) or `.opencode/oh-my-opencode.json` (project-level)
- User-level configuration takes precedence over project-level configuration

---

## Core Concept

**Configuration Priority**: User-level config > Project-level config > Default config

```
~/.config/opencode/oh-my-opencode.json (highest priority)
    ↓ overrides
.opencode/oh-my-opencode.json (project-level)
    ↓ overrides
oh-my-opencode built-in defaults (lowest priority)
```

**Configuration files support JSONC**:
- Can add comments with `//`
- Can add block comments with `/* */`
- Can have trailing commas

---

## Follow Along

### Step 1: Find the Configuration File and Enable Schema Autocompletion

**Why**
Enabling JSON Schema allows your editor to automatically prompt all available fields and types, avoiding configuration errors.

**Actions**:

```jsonc
{
  // Add this line to enable autocompletion
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  
  // Your configuration...
}
```

**You should see**:
- In VS Code / JetBrains and other editors, after typing `{`, all available fields will be prompted automatically
- Hovering over a field will show description and type

---

### Step 2: Customize Agent Models

**Why**
Different tasks require different models:
- **Architecture design**: Use the strongest model (Claude Opus 4.5)
- **Quick exploration**: Use the fastest model (Grok Code)
- **UI design**: Use a visual model (Gemini 3 Pro)
- **Cost control**: Use cheaper models for simple tasks

**Actions**:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle: Strategic advisor, use GPT 5.2
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1  // Low temperature, more deterministic
    },

    // Explore: Quick exploration, use free model
    "explore": {
      "model": "opencode/gpt-5-nano",  // Free
      "temperature": 0.3
    },

    // Librarian: Documentation search, use large context model
    "librarian": {
      "model": "anthropic/claude-sonnet-4-5"
    },

    // Multimodal Looker: Media analysis, use Gemini
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

**You should see**:
- Different agents use different models, optimized for their task characteristics
- After saving the configuration, the next time you call the corresponding agent, the new model will be used

---

### Step 3: Configure Agent Permissions

**Why**
Certain agents **should not** have full permissions:
- Oracle (Strategic Advisor): Read-only, doesn't need file writing
- Librarian (Research Expert): Read-only, doesn't need Bash execution
- Explore (Exploration): Read-only, doesn't need Web requests

**Actions**:

```jsonc
{
  "agents": {
    "explore": {
      // Prohibit file writing and Bash execution, only allow Web search
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"
      }
    },

    "librarian": {
      // Read-only permissions
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Needs to search documentation
      }
    },

    "oracle": {
      // Read-only permissions
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // Needs to look up resources
      }
    },

    // Sisyphus: Main orchestrator, can execute all operations
    "sisyphus": {
      "permission": {
        "edit": "allow",
        "bash": "allow",
        "webfetch": "allow"
      }
    }
  }
}
```

**Permission Description**:

| Permission      | Value            | Description                                         |
| --------------- | ---------------- | --------------------------------------------------- |
| `edit`          | `ask/allow/deny` | File editing permission                             |
| `bash`          | `ask/allow/deny` or object | Bash execution permission (can be refined to specific commands) |
| `webfetch`      | `ask/allow/deny` | Web request permission                              |
| `doom_loop`     | `ask/allow/deny` | Allow agents to override infinite loop detection    |
| `external_directory` | `ask/allow/deny` | Access directories outside the project        |

**Refine Bash Permissions**:

```jsonc
{
  "agents": {
    "explore": {
      "permission": {
        "bash": {
          "git": "allow",      // Allow executing git commands
          "grep": "allow",     // Allow executing grep
          "rm": "deny",       // Prohibit file deletion
          "mv": "deny"        // Prohibit file movement
        }
      }
    }
  }
}
```

**You should see**:
- After configuring permissions, agents attempting to perform disabled operations will be automatically rejected
- In OpenCode, you'll see prompts that permissions were denied

---

### Step 4: Use prompt_append to Add Additional Instructions

**Why**
The default system prompts are already good, but you might have **special needs**:
- Make Librarian prioritize specific documentation searches
- Make Oracle follow specific architecture patterns
- Make Explore use specific search keywords

**Actions**:

```jsonc
{
  "agents": {
    "librarian": {
      // Appended after default system prompt, won't override
      "prompt_append": "Always use elisp-dev-mcp for Emacs Lisp documentation lookups. " +
                      "When searching for docs, prioritize official documentation over blog posts."
    },

    "oracle": {
      "prompt_append": "Follow SOLID principles and Clean Architecture patterns. " +
                     "Always suggest TypeScript types for all function signatures."
    },

    "explore": {
      "prompt_append": "When searching code, prioritize recent commits and actively maintained files. " +
                     "Ignore test files unless explicitly asked."
    }
  }
}
```

**You should see**:
- Agent behavior changes, but still maintains original capabilities
- For example, making Oracle always suggest TypeScript types when asking questions

---

### Step 5: Customize Category Configuration

**Why**
Category is a new feature in v3.0, implementing **dynamic agent combinations**:
- Preset models and parameters for specific task types
- Quickly call via `delegate_task(category="...")`
- More efficient than "manually selecting model + writing prompt"

**Actions**:

```jsonc
{
  "categories": {
    // Custom: Data science tasks
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "prompt_append": "Focus on data analysis, ML pipelines, and statistical methods. " +
                     "Use pandas/numpy for Python and dplyr/tidyr for R."
    },

    // Override default: UI tasks use custom prompt
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "prompt_append": "Use shadcn/ui components and Tailwind CSS. " +
                     "Ensure responsive design and accessibility."
    },

    // Override default: Quick tasks
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1,
      "prompt_append": "Be concise. Focus on simple fixes and quick searches."
    }
  }
}
```

**Category Configuration Fields**:

| Field               | Description                    | Example                              |
| ------------------- | ------------------------------ | ------------------------------------ |
| `model`             | Model to use                   | `"anthropic/claude-sonnet-4-5"`     |
| `temperature`       | Temperature (0-2)              | `0.2` (deterministic) / `0.8` (creative) |
| `top_p`             | Nucleus sampling (0-1)         | `0.9`                                |
| `maxTokens`         | Maximum number of tokens       | `4000`                               |
| `thinking`          | Thinking configuration         | `{"type": "enabled", "budgetTokens": 16000}` |
| `prompt_append`     | Append prompt                  | `"Use X for Y"`                      |
| `tools`             | Tool permissions               | `{"bash": false}`                    |
| `is_unstable_agent` | Mark as unstable (force background mode) | `true`                        |

**Using Categories**:

```
// In OpenCode
delegate_task(category="data-science", prompt="Analyze this dataset and generate visualizations")
delegate_task(category="visual-engineering", prompt="Create a responsive dashboard component")
delegate_task(category="quick", prompt="Search for the definition of this function")
```

**You should see**:
- Different types of tasks automatically use the most suitable model and configuration
- No need to manually specify models and parameters each time

---

### Step 6: Disable Specific Features

**Why**
Certain features might not fit your workflow:
- `comment-checker`: Your project allows detailed comments
- `agent-usage-reminder`: You know which agent to use when
- A certain MCP: You don't need it

**Actions**:

```jsonc
{
  // Disable specific Hooks
  "disabled_hooks": [
    "comment-checker",           // Don't check comments
    "agent-usage-reminder",      // Don't prompt agent usage suggestions
    "startup-toast"               // Don't show startup notification
  ],

  // Disable specific Skills
  "disabled_skills": [
    "playwright",                // Don't use Playwright
    "frontend-ui-ux"            // Don't use built-in frontend Skills
  ],

  // Disable specific MCPs
  "disabled_mcps": [
    "websearch",                // Don't use Exa search
    "context7",                // Don't use Context7
    "grep_app"                 // Don't use grep.app
  ],

  // Disable specific agents
  "disabled_agents": [
    "multimodal-looker",        // Don't use multimodal Looker
    "metis"                   // Don't use Metis pre-planning analysis
  ]
}
```

**Available Hooks List** (partial):

| Hook Name                | Function                                   |
| ----------------------- | ------------------------------------------ |
| `todo-continuation-enforcer` | Force completion of TODO list             |
| `comment-checker`          | Detect redundant comments                 |
| `tool-output-truncator`     | Truncate tool output to save context      |
| `keyword-detector`         | Detect keywords like ultrawork            |
| `agent-usage-reminder`     | Suggest which agent should be used        |
| `session-notification`      | Session end notification                  |
| `background-notification`    | Background task completion notification  |

**You should see**:
- Disabled features no longer execute
- Features are restored after re-enabling

---

### Step 7: Configure Background Task Concurrency Control

**Why**
Parallel background tasks need **concurrency control**:
- Avoid API rate limiting
- Control costs (expensive models can't have too much concurrency)
- Comply with Provider quotas

**Actions**:

```jsonc
{
  "background_task": {
    // Default maximum concurrency
    "defaultConcurrency": 5,

    // Provider-level concurrency limits
    "providerConcurrency": {
      "anthropic": 3,      // Anthropic API max 3 concurrent
      "openai": 5,         // OpenAI API max 5 concurrent
      "google": 10          // Gemini API max 10 concurrent
    },

    // Model-level concurrency limits (highest priority)
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,     // Opus is too expensive, limit to 2 concurrent
      "google/gemini-3-flash": 10,          // Flash is cheap, allow 10 concurrent
      "anthropic/claude-haiku-4-5": 15      // Haiku is even cheaper, allow 15 concurrent
    }
  }
}
```

**Priority Order**:
```
modelConcurrency > providerConcurrency > defaultConcurrency
```

**You should see**:
- Background tasks exceeding concurrency limits will queue and wait
- Concurrency for expensive models is limited, saving costs

---

### Step 8: Enable Experimental Features

**Why**
Experimental features provide **additional capabilities**, but may be unstable:
- `aggressive_truncation`: More aggressive context truncation
- `auto_resume`: Automatically recover from crashes
- `truncate_all_tool_outputs`: Truncate all tool outputs

::: danger Warning
Experimental features may be removed or change behavior in future versions. Test thoroughly before enabling.
:::

**Actions**:

```jsonc
{
  "experimental": {
    // Enable more aggressive tool output truncation
    "aggressive_truncation": true,

    // Automatically recover from thinking block errors
    "auto_resume": true,

    // Truncate all tool outputs (not just Grep/Glob/LSP/AST-Grep)
    "truncate_all_tool_outputs": false
  }
}
```

**You should see**:
- In aggressive mode, tool output is more strictly truncated to save context
- After enabling `auto_resume`, agents automatically recover and continue working when encountering errors

---

## Checkpoint ✅

**Verify configuration takes effect**:

```bash
# Run diagnostic command
bunx oh-my-opencode doctor --verbose
```

**You should see**:
- Model parsing results for each agent
- Whether your configuration overrides are effective
- Whether disabled features are correctly identified

---

## Common Pitfalls

### 1. Configuration File Format Errors

**Problem**:
- JSON syntax errors (missing commas, extra commas)
- Field name typos (`temperature` written as `temparature`)

**Solution**:
```bash
# Validate JSON format
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

### 2. Permission Configuration Too Strict

**Problem**:
- Certain agents are completely disabled (`edit: "deny"`, `bash: "deny"`)
- Leading to agents being unable to complete normal work

**Solution**:
- Read-only agents (Oracle, Librarian) can disable `edit` and `bash`
- Main orchestrator (Sisyphus) needs full permissions

### 3. Category Configuration Not Taking Effect

**Problem**:
- Category name typo (`visual-engineering` written as `visual-engineering`)
- `delegate_task` doesn't specify `category` parameter

**Solution**:
- Check if the name in `delegate_task(category="...")` matches the configuration
- Use `doctor --verbose` to verify Category parsing results

### 4. Concurrency Limit Too Low

**Problem**:
- `modelConcurrency` set too low (e.g., `1`)
- Background tasks execute almost serially, losing parallel advantages

**Solution**:
- Set reasonably based on budget and API quotas
- Expensive models (Opus) limit to 2-3, cheap models (Haiku) can be 10+

---

## Summary

**Advanced Configuration = Precise Control**:

| Configuration          | Purpose                     | Common Scenarios                   |
| --------------------- | --------------------------- | ---------------------------------- |
| `agents.model`        | Override agent models       | Cost optimization, task adaptation |
| `agents.permission`   | Control agent permissions   | Security isolation, read-only mode |
| `agents.prompt_append` | Append additional instructions | Follow architecture standards, optimize search strategy |
| `categories`          | Dynamic agent combinations  | Quick invocation of specific task types |
| `background_task`     | Concurrency control        | Cost control, API quotas          |
| `disabled_*`          | Disable specific features  | Remove uncommon features           |

**Remember**:
- User-level configuration (`~/.config/opencode/oh-my-opencode.json`) takes precedence over project-level
- Use JSONC to make configuration more readable
- Run `oh-my-opencode doctor --verbose` to verify configuration

---

## Next Lesson Preview

> Next, we'll learn **[Troubleshooting](../../faq/troubleshooting/)**.
>
> You'll learn:
> - Use the doctor command for health checks
> - Diagnose OpenCode version, plugin registration, Provider configuration, and other issues
> - Understand model resolution mechanism and Categories configuration
> - Use JSON output for automated diagnostics

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last Updated: 2026-01-26

| Feature                | File Path                                                                 | Line Number |
| ------------------- | -------------------------------------------------------------------------- | ----------- |
| Configuration Schema Definition    | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378      |
| AgentOverrideConfig | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 98-119      |
| CategoryConfig      | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172     |
| AgentPermissionSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 11-17       |
| OhMyOpenCodeConfigSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 329-350     |
| Configuration Documentation          | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 1-595      |

**Key Constants**:
- `PermissionValue = z.enum(["ask", "allow", "deny"])`: Permission value enum

**Key Types**:
- `AgentOverrideConfig`: Agent override configuration (model, temperature, prompt, etc.)
- `CategoryConfig`: Category configuration (model, temperature, prompt, etc.)
- `AgentPermissionSchema`: Agent permission configuration (edit, bash, webfetch, etc.)
- `BackgroundTaskConfig`: Background task concurrency configuration

**Built-in Agent Enum** (`BuiltinAgentNameSchema`):
- `sisyphus`, `prometheus`, `oracle`, `librarian`, `explore`, `multimodal-looker`, `metis`, `momus`, `atlas`

**Built-in Skill Enum** (`BuiltinSkillNameSchema`):
- `playwright`, `agent-browser`, `frontend-ui-ux`, `git-master`

**Built-in Category Enum** (`BuiltinCategoryNameSchema`):
- `visual-engineering`, `ultrabrain`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`

</details>
