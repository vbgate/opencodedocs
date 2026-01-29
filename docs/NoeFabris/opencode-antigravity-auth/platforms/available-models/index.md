---
title: "Available Models: Claude & Gemini | opencode-antigravity-auth"
sidebarTitle: "Models"
subtitle: "Understand All Available Models and Their Variant Configurations"
description: "Learn Antigravity Auth models and variants. Covers Claude 4.5, Gemini 3 Pro/Flash, and 2.5 with Thinking configurations."
tags:
  - "Platforms"
  - "Models"
  - "Claude"
  - "Gemini"
  - "Thinking"
prerequisite:
  - "start-what-is-antigravity-auth"
  - "start-quick-install"
order: 1
---

# Understand All Available Models and Their Variant Configurations

## What You'll Learn

- Choose the Claude or Gemini model that best fits your needs
- Understand different Thinking mode levels (low/max or minimal/low/medium/high)
- Understand the two separate quota pools: Antigravity and Gemini CLI
- Use the `--variant` parameter to dynamically adjust thinking budget

## Your Current Challenge

You've just installed the plugin and are facing a long list of model names, unsure which to choose:
- What's the difference between `antigravity-gemini-3-pro` and `gemini-3-pro-preview`?
- What does `--variant=max` mean? What happens if you don't specify it?
- Are Claude's thinking mode and Gemini's thinking mode the same?

## Core Concept

Antigravity Auth supports two main categories of models, each with an independent quota pool:

1. **Antigravity quota**: Accessed via Google Antigravity API, including Claude and Gemini 3
2. **Gemini CLI quota**: Accessed via Gemini CLI API, including Gemini 2.5 and Gemini 3 Preview

::: info Variant System
OpenCode's variant system lets you avoid defining separate models for each thinking level. Instead, you specify the configuration at runtime using the `--variant` parameter. This makes model selection cleaner and configuration more flexible.
:::

## Antigravity Quota Models

These models are accessed with the `antigravity-` prefix and use the Antigravity API quota pool.

### Gemini 3 Series

#### Gemini 3 Pro
| Model Name | Variants | Thinking Levels | Description |
|--- | --- | --- | ---|
| `antigravity-gemini-3-pro` | low, high | low, high | Balances quality and speed |

**Variant Configuration Examples**:
```bash
# Low thinking level (faster)
opencode run "Quick answer" --model=google/antigravity-gemini-3-pro --variant=low

# High thinking level (deeper)
opencode run "Complex reasoning" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash
| Model Name | Variants | Thinking Levels | Description |
|--- | --- | --- | ---|
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | Ultra-fast response, supports 4 thinking levels |

**Variant Configuration Examples**:
```bash
# Minimal thinking (fastest)
opencode run "Simple task" --model=google/antigravity-gemini-3-flash --variant=minimal

# Balanced thinking (default)
opencode run "Regular task" --model=google/antigravity-gemini-3-flash --variant=medium

# Maximum thinking (deepest)
opencode run "Complex analysis" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro Doesn't Support Minimal/Medium
`gemini-3-pro` only supports `low` and `high` levels. If you try to use `--variant=minimal` or `--variant=medium`, the API will return an error.
:::

### Claude Series

#### Claude Sonnet 4.5 (Non-Thinking)
| Model Name | Variants | Thinking Budget | Description |
|--- | --- | --- | ---|
| `antigravity-claude-sonnet-4-5` | — | — | Standard mode, no extended thinking |

**Usage Example**:
```bash
# Standard mode
opencode run "Daily conversation" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking
| Model Name | Variants | Thinking Budget (tokens) | Description |
|--- | --- | --- | ---|
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Balanced mode |

**Variant Configuration Examples**:
```bash
# Light thinking (faster)
opencode run "Quick reasoning" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# Maximum thinking (deepest)
opencode run "Deep analysis" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking
| Model Name | Variants | Thinking Budget (tokens) | Description |
|--- | --- | --- | ---|
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | Strongest reasoning capability |

**Variant Configuration Examples**:
```bash
# Light thinking
opencode run "High-quality answer" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# Maximum thinking (for most complex tasks)
opencode run "Expert-level analysis" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Claude vs Gemini Thinking Mode Differences
- **Claude** uses a numeric thinking budget (tokens), such as 8192, 32768
- **Gemini 3** uses string-based thinking levels (minimal/low/medium/high)
- Both display their reasoning process before responding, but configuration methods differ
:::

## Gemini CLI Quota Models

These models don't have the `antigravity-` prefix and use the Gemini CLI API's separate quota pool. They don't support thinking mode.

| Model Name | Description |
|--- | ---|
| `gemini-2.5-flash` | Gemini 2.5 Flash (fast response) |
| `gemini-2.5-pro` | Gemini 2.5 Pro (balances quality and speed) |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview (preview version) |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview (preview version) |

**Usage Examples**:
```bash
# Gemini 2.5 Pro (no thinking)
opencode run "Quick task" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview (no thinking)
opencode run "Preview model testing" --model=google/gemini-3-pro-preview
```

::: info Preview Models
`gemini-3-*-preview` models are official Google preview versions and may be unstable or subject to change. If you want Thinking capabilities, use the `antigravity-gemini-3-*` models.
:::

## Model Comparison Overview

| Feature | Claude 4.5 | Gemini 3 | Gemini 2.5 |
|--- | --- | --- | ---|
| **Thinking Support** | ✅ (thinkingBudget) | ✅ (thinkingLevel) | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **Quota Pool** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **Use Cases** | Complex reasoning, coding | General tasks + search | Fast response, simple tasks |

## 🎯 How to Choose Models

### Choose Claude or Gemini?

- **Choose Claude**: You need stronger logical reasoning, more stable code generation
- **Choose Gemini 3**: You need Google Search, faster response speeds

### Choose Thinking or Standard Mode?

- **Use Thinking**: Complex reasoning, multi-step tasks, need to see reasoning process
- **Use Standard Mode**: Simple Q&A, fast response, no reasoning display needed

### Which Thinking Level?

| Level | Claude (tokens) | Gemini 3 | Use Cases |
|--- | --- | --- | ---|
| **minimal** | — | Flash only | Ultra-fast tasks like translation, summarization |
| **low** | 8192 | Pro/Flash | Balances quality and speed, suitable for most tasks |
| **medium** | — | Flash only | Moderately complex tasks |
| **high/max** | 32768 | Pro/Flash | Most complex tasks like system design, deep analysis |

::: tip Recommended Configurations
- **Daily development**: `antigravity-claude-sonnet-4-5-thinking --variant=low`
- **Complex reasoning**: `antigravity-claude-opus-4-5-thinking --variant=max`
- **Quick Q&A + search**: `antigravity-gemini-3-flash --variant=low` + Google Search enabled
:::

## Complete Configuration Example

Add the following configuration to `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: details Copy Configuration
Click the copy button in the top-right corner of the code block above, then paste it into your `~/.config/opencode/opencode.json` file.
:::

## Checkpoint ✅

Complete these steps to confirm you've mastered model selection:

- [ ] Understand the two separate quota pools: Antigravity and Gemini CLI
- [ ] Know that Claude uses thinkingBudget (tokens), Gemini 3 uses thinkingLevel (strings)
- [ ] Can choose the appropriate variant based on task complexity
- [ ] Have added the complete configuration to `opencode.json`

## Lesson Summary

Antigravity Auth provides rich model selection and flexible variant configurations:

- **Antigravity quota**: Supports Claude 4.5 and Gemini 3 with Thinking capabilities
- **Gemini CLI quota**: Supports Gemini 2.5 and Gemini 3 Preview without Thinking capabilities
- **Variant system**: Dynamically adjust thinking levels via the `--variant` parameter without defining multiple models

When choosing models, consider your task type (reasoning vs search), complexity (simple vs complex), and response speed requirements.

## Coming Up Next

> In the next lesson, we'll learn **[Thinking Models Explained](../thinking-models/)**.
>
> You'll learn:
> - The principles behind Claude and Gemini Thinking modes
> - How to configure custom thinking budgets
> - Techniques for preserving thinking blocks (signature caching)

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to view source code locations</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Model parsing and tier extraction | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Thinking tier budget definitions | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Gemini 3 thinking level definitions | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| Model alias mapping | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Variant configuration parsing | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| Type definitions | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**Key Constants**:
- `THINKING_TIER_BUDGETS`: Mapping of thinking budgets for Claude and Gemini 2.5 (low/medium/high → tokens)
- `GEMINI_3_THINKING_LEVELS`: Supported thinking levels for Gemini 3 (minimal/low/medium/high)

**Key Functions**:
- `resolveModelWithTier(requestedModel)`: Resolves model name and thinking configuration
- `resolveModelWithVariant(requestedModel, variantConfig)`: Resolves model from variant configuration
- `budgetToGemini3Level(budget)`: Maps token budget to Gemini 3 levels

</details>
