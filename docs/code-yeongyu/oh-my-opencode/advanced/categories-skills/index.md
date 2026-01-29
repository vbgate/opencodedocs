---
title: "Categories and Skills: Agent Composition | oh-my-opencode"
sidebarTitle: "Categories & Skills"
subtitle: "Categories and Skills: Dynamic Agent Composition (v3.0)"
description: "Master Categories and Skills system. Combine model abstractions and specialized knowledge to create professional AI sub-agents with 7 built-in Categories and 4 Skills."
tags:
  - "categories"
  - "skills"
  - "delegate-task"
  - "sisyphus-junior"
prerequisite:
  - "start-quick-start"
order: 100
---

# Categories and Skills: Dynamic Agent Composition (v3.0)

## What You'll Learn

- ✅ Use 7 built-in Categories to automatically select optimal models for different task types
- ✅ Load 4 built-in Skills to inject specialized knowledge and MCP tools into agents
- ✅ Create specialized sub-agents by combining Categories and Skills through `delegate_task`
- ✅ Customize Categories and Skills to meet specific project needs

## Your Current Dilemma

**Agents not specialized enough? Too expensive?**

Consider this scenario:

| Problem | Traditional Approach | Actual Need |
|---------|---------------------|-------------|
| **Using powerful models for UI tasks** | Use Claude Opus for simple style adjustments | High cost, wasted compute |
| **Using lightweight models for complex logic** | Use Haiku for architecture design | Insufficient reasoning, incorrect solutions |
| **Inconsistent Git commit styles** | Manual commit management, error-prone | Need automatic detection and adherence to project standards |
| **Need browser testing** | Manually open browser for verification | Need Playwright MCP tool support |

**Core Issues**:
1. All tasks handled by one agent → Mismatched models and tools
2. 10 hardcoded fixed agents → Unable to flexibly combine
3. Missing specialized skills → Agents lack domain-specific knowledge

**Solution**: v3.0's Categories and Skills system lets you combine agents like building blocks:
- **Category** (Model Abstraction): Define task type → Automatically select optimal model
- **Skill** (Specialized Knowledge): Inject domain knowledge and MCP tools → Make agents more professional

## When to Use This Approach

| Scenario | Recommended Combination | Effect |
|----------|-------------------------|--------|
| **UI design and implementation** | `category="visual-engineering"` + `skills=["frontend-ui-ux", "playwright"]` | Auto-select Gemini 3 Pro + designer mindset + browser verification |
| **Quick fixes and commits** | `category="quick"` + `skills=["git-master"]` | Low-cost with Haiku + automatic commit style detection |
| **Deep architecture analysis** | `category="ultrabrain"` + `skills=[]` | Pure reasoning with GPT-5.2 Codex (xhigh) |
| **Documentation writing** | `category="writing"` + `skills=[]` | Quick document generation with Gemini 3 Flash |

## 🎒 Prerequisites

::: warning Prerequisites

Before starting this tutorial, ensure:
1. oh-my-opencode is installed (see [Installation Tutorial](../../start/installation/))
2. At least one Provider is configured (see [Provider Setup](../../platforms/provider-setup/))
3. You understand basic delegate_task tool usage (see [Background Tasks](../background-tasks/))

:::

::: info Key Concepts
**Category** is "what type of work this is" (determines model, temperature, thinking mode), **Skill** is "what specialized knowledge and tools are needed" (injects prompts and MCP servers). Combine both through `delegate_task(category=..., skills=[...])`.
:::

## Core Concepts

### Categories: Task Type Determines Model

oh-my-opencode provides 7 built-in Categories, each pre-configured with optimal model and thinking mode:

| Category | Default Model | Temperature | Purpose |
|----------|---------------|-------------|---------|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | Frontend, UI/UX, design tasks |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | High-IQ reasoning tasks (complex architecture decisions) |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | Creative and artistic tasks (novel ideas) |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | Fast, low-cost tasks (single file modifications) |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | Medium tasks that don't match other categories |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | High-quality tasks that don't match other categories |
| `writing` | `google/gemini-3-flash` | 0.1 | Documentation and writing tasks |

**Why Do We Need Categories?**

Different tasks require models with different capabilities:
- UI design → Needs **visual creativity** (Gemini 3 Pro)
- Architecture decisions → Needs **deep reasoning** (GPT-5.2 Codex xhigh)
- Simple modifications → Needs **fast response** (Claude Haiku)

Manually selecting models for each task is cumbersome. Categories let you simply declare the task type, and the system automatically selects the optimal model.

### Skills: Inject Specialized Knowledge

Skills are domain experts defined through SKILL.md files that can inject:
- **Specialized knowledge** (prompt extensions)
- **MCP servers** (automatically loaded)
- **Workflow guides** (specific operation steps)

4 built-in Skills:

| Skill | Functionality | MCP | Purpose |
|-------|---------------|-----|---------|
| `playwright` | Browser automation | `@playwright/mcp` | UI verification, screenshots, web scraping |
| `agent-browser` | Browser automation (Vercel) | Manual installation | Same as above, alternative solution |
| `frontend-ui-ux` | Designer mindset | None | Create beautiful interfaces |
| `git-master` | Git expert | None | Automatic commits, history search, rebase |

**How Skills Work**:

When you load a Skill, the system:
1. Reads the prompt content from the SKILL.md file
2. If MCP is defined, automatically starts the corresponding server
3. Appends the Skill prompt to the agent's system prompt

For example, the `git-master` Skill includes:
- Commit style detection (automatically identifies project commit format)
- Atomic commit rules (3 files → minimum 2 commits)
- Rebase workflow (squash, fixup, conflict handling)
- History search (blame, bisect, log -S)

### Sisyphus Junior: Task Executor

When you use a Category, a special sub-agent is generated—**Sisyphus Junior**.

**Key Features**:
- ✅ Inherits Category's model configuration
- ✅ Inherits loaded Skills' prompts
- ❌ **Cannot delegate again** (forbidden to use `task` and `delegate_task` tools)

**Why Prohibit Delegation Again?**

Prevents infinite loops and task divergence:
```
Sisyphus (main agent)
  ↓ delegate_task(category="quick")
Sisyphus Junior
  ↓ Attempts delegate_task (if allowed)
Sisyphus Junior 2
  ↓ delegate_task
...infinite loop...
```

By prohibiting delegation, Sisyphus Junior focuses on completing assigned tasks, ensuring clear goals and efficient execution.

## Follow Along

### Step 1: Quick Fix (Quick + Git Master)

Let's use a real scenario: you modified several files and need to automatically commit them following the project style.

**Why**
Use the `quick` Category's Haiku model for low cost, combined with `git-master` Skill for automatic commit style detection, achieving perfect commits.

In OpenCode, enter:

```
Use delegate_task to commit current changes
- category: quick
- load_skills: ["git-master"]
- prompt: "Commit all current changes. Follow the project's commit style (detected via git log). Ensure atomic commits, max 3 files per commit."
- run_in_background: false
```

**You should see**:

1. Sisyphus Junior starts, using `claude-haiku-4-5` model
2. `git-master` Skill loads, prompt includes Git expert knowledge
3. Agent executes:
    ```bash
    # Parallel context collection
    git status
    git diff --stat
    git log -30 --oneline
    ```
4. Detects commit style (e.g., Semantic vs Plain vs Short)
5. Plans atomic commits (3 files → at least 2 commits)
6. Executes commits, following detected style

**Checkpoint ✅**:

Verify commit success:
```bash
git log --oneline -5
```

You should see multiple atomic commits, each with clear message style.

### Step 2: UI Implementation and Verification (Visual + Playwright + UI/UX)

Scenario: You need to add a responsive chart component to a page and verify it in a browser.

**Why**
- `visual-engineering` Category selects Gemini 3 Pro (excels at visual design)
- `playwright` Skill provides MCP tools for browser testing
- `frontend-ui-ux` Skill injects designer mindset (color schemes, typography, animations)

In OpenCode, enter:

```
Use delegate_task to implement chart component
- category: visual-engineering
- load_skills: ["frontend-ui-ux", "playwright"]
- prompt: "Add a responsive chart component to the dashboard page. Requirements:
  - Use Tailwind CSS
  - Support mobile and desktop
  - Use distinct color scheme (avoid purple gradients)
  - Add staggered animation effects
  - Verify with playwright screenshot after completion"
- run_in_background: false
```

**You should see**:

1. Sisyphus Junior starts, using `google/gemini-3-pro` model
2. Loads two Skills' prompts:
    - `frontend-ui-ux`: Designer mindset guidelines
    - `playwright`: Browser automation instructions
3. `@playwright/mcp` server automatically starts
4. Agent executes:
    - Designs chart component (applying designer mindset)
    - Implements responsive layout
    - Adds animation effects
    - Uses Playwright tools:
      ```
      playwright_navigate: http://localhost:3000/dashboard
      playwright_take_screenshot: output=dashboard-chart.png
      ```

**Checkpoint ✅**:

Verify component renders correctly:
```bash
# Check new files
git diff --name-only
git diff --stat

# View screenshots
ls screenshots/
```

You should see:
- New chart component file
- Responsive style code
- Screenshot file (verification passed)

### Step 3: Deep Architecture Analysis (Ultrabrain Pure Reasoning)

Scenario: You need to design a complex communication pattern for a microservices architecture.

**Why**
- `ultrabrain` Category selects GPT-5.2 Codex (xhigh), providing strongest reasoning capabilities
- No Skills loaded → Pure reasoning, avoiding specialized knowledge interference

In OpenCode, enter:

```
Use delegate_task to analyze architecture
- category: ultrabrain
- load_skills: []
- prompt: "Design an efficient communication pattern for our microservices architecture. Requirements:
  - Support service discovery
  - Handle network partitions
  - Minimize latency
  - Provide degradation strategies

  Current architecture: [brief description]
  Tech stack: gRPC, Kubernetes, Consul"
- run_in_background: false
```

**You should see**:

1. Sisyphus Junior starts, using `openai/gpt-5.2-codex` model (xhigh variant)
2. No Skills loaded
3. Agent performs deep reasoning:
    - Analyzes existing architecture
    - Compares communication patterns (e.g., CQRS, Event Sourcing, Saga)
    - Weighs pros and cons
    - Provides layered recommendations (Bottom Line → Action Plan → Risks)

**Output Structure**:

```
Bottom Line: Recommend hybrid approach (gRPC + Event Bus)

Action Plan:
1. Use gRPC for synchronous communication between services
2. Publish key events asynchronously through Event Bus
3. Implement idempotency for duplicate message handling

Risks and Mitigations:
- Risk: Network partitions causing message loss
  Mitigation: Implement message retry and dead letter queue
```

**Checkpoint ✅**:

Verify solution comprehensiveness:
- Did it consider service discovery?
- Did it handle network partitions?
- Did it provide degradation strategies?

### Step 4: Custom Category (Optional)

If built-in Categories don't meet your needs, customize them in `oh-my-opencode.json`.

**Why**
Some projects need specific model configurations (e.g., Korean Writer, Deep Reasoning).

Edit `~/.config/opencode/oh-my-opencode.json`:

```jsonc
{
  "categories": {
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },
    
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false
      }
    }
  }
}
```

**Field Descriptions**:

| Field | Type | Description |
|-------|------|-------------|
| `model` | string | Override model used by Category |
| `temperature` | number | Creativity level (0-2) |
| `prompt_append` | string | Content appended to system prompt |
| `thinking` | object | Thinking configuration (`{ type, budgetTokens }`) |
| `tools` | object | Tool permission disabling (`{ toolName: false }`) |

**Checkpoint ✅**:

Verify custom Category takes effect:
```bash
# Use custom Category
delegate_task(category="korean-writer", load_skills=[], prompt="...")
```

You should see the system using your configured model and prompt.

## Common Pitfalls

### Pitfall 1: Quick Category Prompt Not Clear Enough

**Problem**: `quick` Category uses Haiku model with limited reasoning capabilities. If the prompt is too vague, results will be poor.

**Wrong Example**:
```
delegate_task(category="quick", load_skills=["git-master"], prompt="Commit changes")
```

**Correct Approach**:
```
TASK: Commit all current code changes

MUST DO:
1. Detect project commit style (via git log -30)
2. Split 8 files by directory into 3+ atomic commits
3. Max 3 files per commit
4. Follow detected style (Semantic/Plain/Short)

MUST NOT DO:
- Merge files from different directories into same commit
- Skip commit planning and execute directly

EXPECTED OUTPUT:
- Multiple atomic commits
- Each commit message matches project style
- Follow dependency order (type definitions → implementation → tests)
```

### Pitfall 2: Forgetting to Specify `load_skills`

**Problem**: `load_skills` is a **required parameter**, omitting it will cause an error.

**Error**:
```
delegate_task(category="quick", prompt="...")
```

**Error Output**:
```
Error: Invalid arguments: 'load_skills' parameter is REQUIRED.
Pass [] if no skills needed, but IT IS HIGHLY RECOMMENDED to pass proper skills.
```

**Correct Approach**:
```
# No Skill needed, explicitly pass empty array
delegate_task(category="unspecified-low", load_skills=[], prompt="...")
```

### Pitfall 3: Specifying Both Category and subagent_type

**Problem**: These parameters are mutually exclusive and cannot be specified together.

**Error**:
```
delegate_task(
  category="quick",
  subagent_type="oracle",  # ❌ Conflict
  ...
)
```

**Correct Approach**:
```
# Use Category (recommended)
delegate_task(category="quick", load_skills=[], prompt="...")

# Or specify agent directly
delegate_task(subagent_type="oracle", load_skills=[], prompt="...")
```

### Pitfall 4: Git Master's Multi-Commit Rules

**Problem**: `git-master` Skill requires **multiple commits**, committing 3+ files in one commit will fail.

**Error**:
```
# Attempting to commit 8 files in one commit
git commit -m "Update landing page"  # ❌ git-master will reject
```

**Correct Approach**:
```
# Split by directory into multiple commits
git add app/page.tsx app/layout.tsx
git commit -m "Add app layer"  # ✅ Commit 1

git add components/demo/*
git commit -m "Add demo components"  # ✅ Commit 2

git add e2e/*
git commit -m "Add tests"  # ✅ Commit 3
```

### Pitfall 5: Playwright Skill MCP Not Installed

**Problem**: Before using `playwright` Skill, ensure the MCP server is available.

**Error**:
```
delegate_task(category="visual-engineering", load_skills=["playwright"], prompt="Take screenshot...")
```

**Correct Approach**:

Check MCP configuration (`~/.config/opencode/mcp.json` or `.claude/.mcp.json`):

```jsonc
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

If Playwright MCP is not configured, `playwright` Skill will automatically start it.

## Summary

Categories and Skills system lets you flexibly combine agents:

| Component | Role | Configuration |
|-----------|------|---------------|
| **Category** | Determines model and thinking mode | `delegate_task(category="...")` or config file |
| **Skill** | Injects specialized knowledge and MCP | `delegate_task(load_skills=["..."])` or SKILL.md file |
| **Sisyphus Junior** | Executes tasks, cannot delegate again | Auto-generated, no manual specification needed |

**Combination Strategies**:
1. **UI tasks**: `visual-engineering` + `frontend-ui-ux` + `playwright`
2. **Quick fixes**: `quick` + `git-master`
3. **Deep reasoning**: `ultrabrain` (no Skill)
4. **Documentation**: `writing` (no Skill)

**Best Practices**:
- ✅ Always specify `load_skills` (even if empty array)
- ✅ `quick` Category prompts must be clear (Haiku has limited reasoning)
- ✅ Always use `git-master` Skill for Git tasks (automatic style detection)
- ✅ Always use `playwright` Skill for UI tasks (browser verification)
- ✅ Choose appropriate Category based on task type (not default to main agent)

## Next Lesson Preview

> Next, we'll learn **[Built-in Skills: Browser Automation, Git Expert, and UI Designer](../builtin-skills/)**.
>
> You'll learn:
> - Detailed workflow of `playwright` Skill
> - 3 modes of `git-master` Skill (Commit/Rebase/History Search)
> - Design philosophy of `frontend-ui-ux` Skill
> - How to create custom Skills

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last Updated: 2026-01-26

| Functionality | File Path | Line Number |
|---------------|-----------|-------------|
| delegate_task tool implementation | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | Full file (1070 lines) |
| resolveCategoryConfig function | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 113-152 |
| buildSystemContent function | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 176-188 |
| Default Categories configuration | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 158-166 |
| Categories prompt appends | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 168-176 |
| Categories descriptions | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 178-186 |
| Category configuration Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172 |
| Built-in Skills definition | [`src/features/builtin-skills/`](https://github.com/code-yeongyu/oh-my-opencode/tree/main/src/features/builtin-skills) | Directory structure |
| git-master Skill prompt | [`src/features/builtin-skills/git-master/SKILL.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/git-master/SKILL.md) | Full file (1106 lines) |

**Key Constants**:
- `SISYPHUS_JUNIOR_AGENT = "sisyphus-junior"`: Execution agent for Category delegation
- `DEFAULT_CATEGORIES`: Model configuration for 7 built-in Categories
- `CATEGORY_PROMPT_APPENDS`: Prompt append content for each Category
- `CATEGORY_DESCRIPTIONS`: Description for each Category (displayed in delegate_task prompts)

**Key Functions**:
- `resolveCategoryConfig()`: Resolves Category configuration, merges user overrides with defaults
- `buildSystemContent()`: Merges Skill and Category prompt content
- `createDelegateTask()`: Creates delegate_task tool definition

**Built-in Skill Files**:
- `src/features/builtin-skills/frontend-ui-ux/SKILL.md`: Designer mindset prompt
- `src/features/builtin-skills/git-master/SKILL.md`: Git expert complete workflow
- `src/features/builtin-skills/agent-browser/SKILL.md`: Vercel agent-browser configuration
- `src/features/builtin-skills/dev-browser/SKILL.md`: Browser automation reference documentation

</details>
