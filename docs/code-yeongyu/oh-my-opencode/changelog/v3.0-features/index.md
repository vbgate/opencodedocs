---
title: "v3.0: Categories & Skills | oh-my-opencode"
sidebarTitle: "v3.0 Features"
subtitle: "v3.0: Categories & Skills"
description: "Learn oh-my-opencode v3.0's new Categories and Skills system. Master 7 built-in categories, 3 skill packages, and dynamic agent composition."
tags:
  - "v3.0"
  - "categories"
  - "skills"
  - "changelog"
order: 200
---

# v3.0 Features: Comprehensive Guide to Categories and Skills

## Version Overview

oh-my-opencode v3.0 is a significant milestone release that introduces the all-new **Categories and Skills system**, revolutionizing the way AI agents are orchestrated. This version aims to make AI agents more specialized, flexible, and composable.

**Key Improvements**:
- 🎯 **Categories System**: 7 built-in task categories with automatic model selection
- 🛠️ **Skills System**: 3 built-in professional skill packages to inject domain knowledge
- 🔄 **Dynamic Composition**: Freely combine Category and Skill via `delegate_task`
- 🚀 **Sisyphus-Junior**: New delegated task executor that prevents infinite loops
- 📝 **Flexible Configuration**: Support for custom Categories and Skills

---

## Core Feature 1: Categories System

### What is a Category?

A Category is a **specialized agent configuration preset** optimized for a specific domain. It answers a key question: **"What type of work is this?"**

Each Category defines:
- **Model to use** (model)
- **Temperature parameter** (temperature)
- **Prompt mindset** (prompt mindset)
- **Reasoning capability** (reasoning effort)
- **Tool permissions** (tools)

### 7 Built-in Categories

| Category | Default Model | Temperature | Use Cases |
|--- | --- | --- | ---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Frontend, UI/UX, design, styling, animations |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | Deep logical reasoning, complex architecture decisions requiring extensive analysis |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | High creativity/artistic tasks, novel ideas |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Simple tasks - single file modification, typo fixes, simple changes |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Tasks that don't fit other categories, low workload |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | Tasks that don't fit other categories, high workload |
| `writing` | `google/gemini-3-flash` | 0.1 | Documentation, essays, technical writing |

**Source**: `docs/category-skill-guide.md:22-30`

### How to Use Categories?

When calling the `delegate_task` tool, specify the `category` parameter:

```typescript
// Delegate frontend task to visual-engineering category
delegate_task(
  category="visual-engineering",
  prompt="Add responsive chart component to dashboard page"
)
```

The system will automatically:
1. Select the `visual-engineering` Category
2. Use the `google/gemini-3-pro` model
3. Apply `temperature: 0.7` (high creativity)
4. Load the Category's prompt mindset

### Sisyphus-Junior: Delegated Task Executor

When you use a Category, a special agent named **Sisyphus-Junior** will execute the task.

**Key Features**:
- ❌ **Cannot re-delegate** tasks to other agents
- 🎯 **Focused on assigned tasks**
- 🔄 **Prevents infinite delegation loops**

**Design Purpose**: Ensures agents focus on the current task, avoiding complexity caused by layer-by-layer task delegation.

---

## Core Feature 2: Skills System

### What is a Skill?

A Skill is a mechanism that injects **domain expertise (Context)** and **tools (MCP)** into an agent. It answers another key question: **"What tools and knowledge are needed?"**

### 3 Built-in Skills

#### 1. `git-master`

**Capabilities**:
- Git expert
- Detect commit style
- Split atomic commits
- Create rebase strategies

**MCP**: None (uses Git commands)

**Use Cases**: Commits, history search, branch management

#### 2. `playwright`

**Capabilities**:
- Browser automation
- Web testing
- Screenshots
- Data scraping

**MCP**: `@playwright/mcp` (auto-executed)

**Use Cases**: Post-implementation UI validation, E2E test writing

#### 3. `frontend-ui-ux`

**Capabilities**:
- Inject designer mindset
- Color, typography, motion guidelines

**Use Cases**: Beautiful UI work beyond simple implementation

**Source**: `docs/category-skill-guide.md:57-70`

### How to Use Skills?

Add a `load_skills` array in `delegate_task`:

```typescript
// Delegate quick task and load git-master skill
delegate_task(
  category="quick",
  load_skills=["git-master"],
  prompt="Commit current changes. Follow commit message style."
)
```

The system will automatically:
1. Select the `quick` Category (Claude Haiku, low cost)
2. Load the `git-master` Skill (inject Git expertise)
3. Launch Sisyphus-Junior to execute the task

### Custom Skills

You can add custom Skills directly in `.opencode/skills/` at the project root or in `~/.claude/skills/` at the user directory.

**Example: `.opencode/skills/my-skill/SKILL.md`**

```markdown
---
name: my-skill
description: My professional custom skill
mcp:
  my-mcp:
    command: npx
    args: ["-y", "my-mcp-server"]
---

# My Skill Prompt

This content will be injected into the agent's system prompt.
...
```

**Source**: `docs/category-skill-guide.md:87-103`

---

## Core Feature 3: Dynamic Composition Capability

### Composition Strategy: Creating Specialized Agents

By combining different Categories and Skills, you can create powerful specialized agents.

#### 🎨 Designer (UI Implementation)

- **Category**: `visual-engineering`
- **load_skills**: `["frontend-ui-ux", "playwright"]`
- **Effect**: Implement beautiful UI and validate rendering results directly in the browser

#### 🏗️ Architect (Design Review)

- **Category**: `ultrabrain`
- **load_skills**: `[]` (pure reasoning)
- **Effect**: Use GPT-5.2's logical reasoning capability for in-depth system architecture analysis

#### ⚡ Maintainer (Quick Fixes)

- **Category**: `quick`
- **load_skills**: `["git-master"]`
- **Effect**: Quickly fix code using a cost-effective model and generate clean commits

**Source**: `docs/category-skill-guide.md:111-124`

### delegate_task Prompt Guide

When delegating tasks, **clear and specific** prompts are crucial. Include the following 7 elements:

1. **TASK**: What needs to be done? (single objective)
2. **EXPECTED OUTCOME**: What is the deliverable?
3. **REQUIRED SKILLS**: Which skills should be loaded via `load_skills`?
4. **REQUIRED TOOLS**: Which tools must be used? (whitelist)
5. **MUST DO**: What must be done (constraints)
6. **MUST NOT DO**: What must never be done
7. **CONTEXT**: File paths, existing patterns, reference materials

**❌ Bad Example**:
> "Fix this"

**✅ Good Example**:
> **TASK**: Fix mobile layout issue in `LoginButton.tsx`
> **CONTEXT**: `src/components/LoginButton.tsx`, using Tailwind CSS
> **MUST DO**: Change flex-direction at `md:` breakpoint
> **MUST NOT DO**: Modify existing desktop layout
> **EXPECTED**: Button aligns vertically on mobile

**Source**: `docs/category-skill-guide.md:130-148`

---

## Configuration Guide

### Category Configuration Schema

You can fine-tune Categories in `oh-my-opencode.json`.

| Field | Type | Description |
|--- | --- | ---|
| `description` | string | Human-readable description of Category purpose. Shown in delegate_task prompts. |
| `model` | string | AI model ID to use (e.g., `anthropic/claude-opus-4-5`) |
| `variant` | string | Model variant (e.g., `max`, `xhigh`) |
| `temperature` | number | Creativity level (0.0 ~ 2.0). Lower is more deterministic. |
| `top_p` | number | Nucleus sampling parameter (0.0 ~ 1.0) |
| `prompt_append` | string | Content appended to system prompt when this Category is selected |
| `thinking` | object | Thinking model configuration (`{ type: "enabled", budgetTokens: 16000 }`) |
| `reasoningEffort` | string | Reasoning effort level (`low`, `medium`, `high`) |
| `textVerbosity` | string | Text verbosity (`low`, `medium`, `high`) |
| `tools` | object | Tool usage control (use `{ "tool_name": false }` to disable) |
| `maxTokens` | number | Maximum response tokens |
| `is_unstable_agent` | boolean | Mark agent as unstable - force background mode for monitoring |

**Source**: `docs/category-skill-guide.md:159-172`

### Configuration Example

```jsonc
{
  "categories": {
    // 1. Define new custom category
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },

    // 2. Override existing category (change model)
    "visual-engineering": {
      "model": "openai/gpt-5.2",
      "temperature": 0.8
    },

    // 3. Configure thinking model and limit tools
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false // Disable web search
      }
    }
  },

  // Disable skills
  "disabled_skills": ["playwright"]
}
```

**Source**: `docs/category-skill-guide.md:175-206`

---

## Other Important Improvements

In addition to the Categories and Skills system, v3.0 includes the following important improvements:

### Stability Enhancements
- ✅ Version marked as stable (3.0.1)
- ✅ Optimized agent delegation mechanism
- ✅ Improved error recovery capability

### Performance Optimizations
- ✅ Reduced unnecessary context injection
- ✅ Optimized background task polling mechanism
- ✅ Improved multi-model orchestration efficiency

### Claude Code Compatibility
- ✅ Fully compatible with Claude Code configuration format
- ✅ Supports loading Claude Code's Skills, Commands, MCPs
- ✅ Auto-discovery and configuration

**Source**: `README.md:18-20`, `README.md:292-304`

---

## Next Steps

The Categories and Skills system in v3.0 lays a flexible foundation for extending oh-my-opencode. If you want to dive deeper into using these new features, refer to the following sections:

- [Categories and Skills: Dynamic Agent Composition](../../advanced/categories-skills/) - Detailed usage guide
- [Built-in Skills: Browser Automation and Git Expert](../../advanced/builtin-skills/) - In-depth Skills analysis
- [Advanced Configuration: Agents and Permission Management](../../advanced/advanced-configuration/) - Custom configuration guide

Start exploring these new features and make your AI agents more specialized and efficient!
