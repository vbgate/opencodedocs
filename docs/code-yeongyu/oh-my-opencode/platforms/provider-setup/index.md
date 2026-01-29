---
title: "Provider Config: Multi-Model Strategy | oh-my-opencode"
sidebarTitle: "Provider Config"
subtitle: "Provider Configuration: Claude, OpenAI, Gemini, and Multi-Model Strategy"
description: "Configure oh-my-opencode's AI Providers including Anthropic, OpenAI, Google, and GitHub Copilot. Set up multi-model automatic fallback mechanism."
tags:
  - "configuration"
  - "providers"
  - "models"
prerequisite:
  - "start-installation"
order: 40
---

# Provider Configuration: Claude, OpenAI, Gemini, and Multi-Model Strategy

## What You'll Learn

- Configure multiple AI Providers: Anthropic Claude, OpenAI, Google Gemini, GitHub Copilot
- Understand the multi-model priority fallback mechanism to let the system automatically select the best available model
- Assign the most suitable models for different AI agents and task types
- Configure third-party services like Z.ai Coding Plan and OpenCode Zen
- Use the doctor command to diagnose model resolution configuration

## Your Current Challenge

You've installed oh-my-opencode, but you're not sure:
- How to add multiple AI Providers (Claude, OpenAI, Gemini, etc.)
- Why agents sometimes use models you didn't expect
- How to configure different models for different tasks (e.g., use cheaper models for research, stronger models for coding)
- How the system automatically switches to backup models when a Provider is unavailable
- How model configuration works together in `opencode.json` and `oh-my-opencode.json`

## When to Use This Guide

- **Initial Configuration**: Just finished installing oh-my-opencode and need to add or adjust AI Providers
- **New Subscription**: Purchased a new AI service subscription (e.g., Gemini Pro) and want to integrate it
- **Cost Optimization**: Want specific agents to use cheaper or faster models
- **Troubleshooting**: Found an agent not using models as expected and need to diagnose the issue
- **Multi-Model Orchestration**: Want to fully leverage the advantages of different models to build an intelligent development workflow

## 🎒 Prerequisites

::: warning Prerequisite Check
This tutorial assumes you have:
- ✅ Completed [Installation and Initial Configuration](../installation/)
- ✅ Installed OpenCode (version >= 1.0.150)
- ✅ Understood basic JSON/JSONC configuration file formats
:::

## Core Concept

oh-my-opencode uses a **multi-model orchestration system** to select the most suitable model for different AI agents and task types, based on your subscriptions and configuration.

**Why do you need multiple models?**

Different models have different strengths:
- **Claude Opus 4.5**: Excels at complex reasoning and architecture design (higher cost, but superior quality)
- **GPT-5.2**: Excels at code debugging and strategic consulting
- **Gemini 3 Pro**: Excels at frontend and UI/UX tasks (strong visual capabilities)
- **GPT-5 Nano**: Fast and free, suitable for code search and simple exploration
- **GLM-4.7**: High cost-performance ratio, suitable for research and documentation lookup

The intelligence of oh-my-opencode lies in: **making each task use the most suitable model, rather than using the same model for all tasks**.

## Configuration File Locations

oh-my-opencode supports two levels of configuration:

| Location | Path | Priority | Use Case |
|----------|------|----------|----------|
| **Project Configuration** | `.opencode/oh-my-opencode.json` | Low | Project-specific configuration (committed with codebase) |
| **User Configuration** | `~/.config/opencode/oh-my-opencode.json` | High | Global configuration (shared across all projects) |

**Configuration Merge Rule**: User configuration overrides project configuration.

**Recommended Configuration File Structure**:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  // Enable JSON Schema auto-completion

  "agents": {
    // Agent model overrides
  },
  "categories": {
    // Category model overrides
  }
}
```

::: tip Schema Auto-completion
In VS Code and other editors, after adding the `$schema` field, you'll get full auto-completion and type checking when entering configuration.
:::

## Provider Configuration Methods

oh-my-opencode supports 6 main Providers. Configuration methods vary by Provider.

### Anthropic Claude (Recommended)

**Use Case**: Main orchestrator Sisyphus and most core agents

**Configuration Steps**:

1. **Run OpenCode Authentication**:
   ```bash
   opencode auth login
   ```

2. **Select Provider**:
   - `Provider`: Select `Anthropic`
   - `Login method`: Select `Claude Pro/Max`

3. **Complete OAuth Flow**:
   - System will automatically open your browser
   - Log in to your Claude account
   - Wait for authentication to complete

4. **Verify Success**:
   ```bash
   opencode models | grep anthropic
   ```

   You should see:
   - `anthropic/claude-opus-4-5`
   - `anthropic/claude-sonnet-4-5`
   - `anthropic/claude-haiku-4-5`

**Model Mapping** (Sisyphus default configuration):

| Agent | Default Model | Purpose |
|-------|---------------|---------|
| Sisyphus | `anthropic/claude-opus-4-5` | Main orchestrator, complex reasoning |
| Prometheus | `anthropic/claude-opus-4-5` | Project planning |
| Metis | `anthropic/claude-sonnet-4-5` | Pre-planning analysis |
| Momus | `anthropic/claude-opus-4-5` | Plan review |

### OpenAI (ChatGPT Plus)

**Use Case**: Oracle agent (architecture review, debugging)

**Configuration Steps**:

1. **Run OpenCode Authentication**:
   ```bash
   opencode auth login
   ```

2. **Select Provider**:
   - `Provider`: Select `OpenAI`
   - `Login method`: Select OAuth or API Key

3. **Complete Authentication Flow** (depending on selected method)

4. **Verify Success**:
   ```bash
   opencode models | grep openai
   ```

**Model Mapping** (Oracle default configuration):

| Agent | Default Model | Purpose |
|-------|---------------|---------|
| Oracle | `openai/gpt-5.2` | Architecture review, debugging |

**Manual Override Example**:

```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2",  // Use GPT for strategic reasoning
      "temperature": 0.1
    }
  }
}
```

### Google Gemini (Recommended)

**Use Case**: Multimodal Looker (media analysis), Frontend UI/UX tasks

::: tip Highly Recommended
For Gemini authentication, we highly recommend installing the [`opencode-antigravity-auth`](https://github.com/NoeFabris/opencode-antigravity-auth) plugin. It provides:
- Multi-account load balancing (up to 10 accounts)
- Variant system support (`low`/`high` variants)
- Dual quota system (Antigravity + Gemini CLI)
:::

**Configuration Steps**:

1. **Add Antigravity Authentication Plugin**:
   
   Edit `~/.config/opencode/opencode.json`:
   ```json
   {
     "plugin": [
       "oh-my-opencode",
       "opencode-antigravity-auth@latest"
     ]
   }
   ```

2. **Configure Gemini Models** (Important):
   
   The Antigravity plugin uses different model names. You need to copy the complete model configuration to `opencode.json`, carefully merging to avoid breaking existing settings.

   Available models (Antigravity quota):
   - `google/antigravity-gemini-3-pro` — variants: `low`, `high`
   - `google/antigravity-gemini-3-flash` — variants: `minimal`, `low`, `medium`, `high`
   - `google/antigravity-claude-sonnet-4-5` — no variants
   - `google/antigravity-claude-sonnet-4-5-thinking` — variants: `low`, `max`
   - `google/antigravity-claude-opus-4-5-thinking` — variants: `low`, `max`

   Available models (Gemini CLI quota):
   - `google/gemini-2.5-flash`, `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

3. **Override Agent Models** (in `oh-my-opencode.json`):
   
   ```jsonc
   {
     "agents": {
       "multimodal-looker": {
         "model": "google/antigravity-gemini-3-flash"
       }
     }
   }
   ```

4. **Run Authentication**:
   ```bash
   opencode auth login
   ```

5. **Select Provider**:
   - `Provider`: Select `Google`
   - `Login method`: Select `OAuth with Google (Antigravity)`

6. **Complete Authentication Flow**:
   - System will automatically open your browser
   - Complete Google login
   - Optional: Add more Google accounts for load balancing

**Model Mapping** (default configuration):

| Agent | Default Model | Purpose |
|-------|---------------|---------|
| Multimodal Looker | `google/antigravity-gemini-3-flash` | PDF, image analysis |

### GitHub Copilot (Backup Provider)

**Use Case**: Backup option when native Providers are unavailable

::: info Backup Provider
GitHub Copilot acts as a proxy Provider, routing requests to the underlying model you subscribe to.
:::

**Configuration Steps**:

1. **Run OpenCode Authentication**:
   ```bash
   opencode auth login
   ```

2. **Select Provider**:
   - `Provider`: Select `GitHub`
   - `Login method`: Select `Authenticate via OAuth`

3. **Complete GitHub OAuth Flow**

4. **Verify Success**:
   ```bash
   opencode models | grep github-copilot
   ```

**Model Mapping** (when GitHub Copilot is the best available Provider):

| Agent | Model | Purpose |
|-------|-------|---------|
| Sisyphus | `github-copilot/claude-opus-4.5` | Main orchestrator |
| Oracle | `github-copilot/gpt-5.2` | Architecture review |
| Explore | `opencode/gpt-5-nano` | Quick exploration |
| Librarian | `zai-coding-plan/glm-4.7` (if Z.ai available) | Documentation lookup |

### Z.ai Coding Plan (Optional)

**Use Case**: Librarian agent (multi-repo research, documentation lookup)

**Features**:
- Provides GLM-4.7 model
- High cost-performance ratio
- When enabled, **Librarian agent always uses** `zai-coding-plan/glm-4.7`, regardless of other available Providers

**Configuration Steps**:

Use the interactive installer:

```bash
bunx oh-my-opencode install
# When prompted: "Do you have a Z.ai Coding Plan subscription?" → Select "Yes"
```

**Model Mapping** (when Z.ai is the only available Provider):

| Agent | Model | Purpose |
|-------|-------|---------|
| Sisyphus | `zai-coding-plan/glm-4.7` | Main orchestrator |
| Oracle | `zai-coding-plan/glm-4.7` | Architecture review |
| Explore | `zai-coding-plan/glm-4.7-flash` | Quick exploration |
| Librarian | `zai-coding-plan/glm-4.7` | Documentation lookup |

### OpenCode Zen (Optional)

**Use Case**: Provides `opencode/` prefix models (Claude Opus 4.5, GPT-5.2, GPT-5 Nano, Big Pickle)

**Configuration Steps**:

```bash
bunx oh-my-opencode install
# When prompted: "Do you have access to OpenCode Zen (opencode/ models)?" → Select "Yes"
```

**Model Mapping** (when OpenCode Zen is the best available Provider):

| Agent | Model | Purpose |
|-------|-------|---------|
| Sisyphus | `opencode/claude-opus-4-5` | Main orchestrator |
| Oracle | `opencode/gpt-5.2` | Architecture review |
| Explore | `opencode/gpt-5-nano` | Quick exploration |
| Librarian | `opencode/big-pickle` | Documentation lookup |

## Model Resolution System (3-Step Priority)

oh-my-opencode uses a **3-step priority mechanism** to determine which model each agent and category uses. This mechanism ensures the system can always find an available model.

### Step 1: User Override

If the user explicitly specifies a model in `oh-my-opencode.json`, use that model.

**Example**:
```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2"  // User explicitly specified
    }
  }
}
```

In this case:
- ✅ Directly use `openai/gpt-5.2`
- ❌ Skip Provider fallback steps

### Step 2: Provider Fallback

If the user hasn't explicitly specified a model, the system tries each Provider in the agent's defined Provider priority chain until it finds an available model.

**Sisyphus's Provider Priority Chain**:

```
anthropic → github-copilot → opencode → antigravity → google
```

**Resolution Process**:
1. Try `anthropic/claude-opus-4-5`
   - Available? → Return that model
   - Not available? → Continue to next step
2. Try `github-copilot/claude-opus-4-5`
   - Available? → Return that model
   - Not available? → Continue to next step
3. Try `opencode/claude-opus-4-5`
   - ...
4. Try `google/antigravity-claude-opus-4-5-thinking` (if configured)
   - ...
5. Return system default model

**Provider Priority Chain for All Agents**:

| Agent | Model (no prefix) | Provider Priority Chain |
|-------|-------------------|-------------------------|
| **Sisyphus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Oracle** | `gpt-5.2` | openai → anthropic → google → github-copilot → opencode |
| **Librarian** | `big-pickle` | opencode → github-copilot → anthropic |
| **Explore** | `gpt-5-nano` | anthropic → opencode |
| **Multimodal Looker** | `gemini-3-flash` | google → openai → zai-coding-plan → anthropic → opencode |
| **Prometheus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Metis** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Momus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Atlas** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |

**Provider Priority Chain for Categories**:

| Category | Model (no prefix) | Provider Priority Chain |
|----------|-------------------|-------------------------|
| **visual-engineering** | `gemini-3-pro` | google → openai → anthropic → github-copilot → opencode |
| **ultrabrain** | `gpt-5.2-codex` | openai → anthropic → google → github-copilot → opencode |
| **artistry** | `gemini-3-pro` | google → openai → anthropic → github-copilot → opencode |
| **quick** | `claude-haiku-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **unspecified-low** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **unspecified-high** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **writing** | `gemini-3-flash` | google → openai → anthropic → github-copilot → opencode |

### Step 3: System Default

If all Providers are unavailable, use OpenCode's default model (read from `opencode.json`).

**Global Priority Order**:

```
User Override > Provider Fallback > System Default
```

## Hands-On: Configure Multiple Providers

### Step 1: Plan Your Subscriptions

Before starting configuration, organize your subscription status:

```markdown
- [ ] Anthropic Claude (Pro/Max)
- [ ] OpenAI ChatGPT Plus
- [ ] Google Gemini
- [ ] GitHub Copilot
- [ ] Z.ai Coding Plan
- [ ] OpenCode Zen
```

### Step 2: Use the Interactive Installer (Recommended)

oh-my-opencode provides an interactive installer that automatically handles most configuration:

```bash
bunx oh-my-opencode install
```

The installer will ask:
1. **Do you have a Claude Pro/Max Subscription?**
   - `yes, max20` → `--claude=max20`
   - `yes, regular` → `--claude=yes`
   - `no` → `--claude=no`

2. **Do you have an OpenAI/ChatGPT Plus Subscription?**
   - `yes` → `--openai=yes`
   - `no` → `--openai=no`

3. **Will you integrate Gemini models?**
   - `yes` → `--gemini=yes`
   - `no` → `--gemini=no`

4. **Do you have a GitHub Copilot Subscription?**
   - `yes` → `--copilot=yes`
   - `no` → `--copilot=no`

5. **Do you have access to OpenCode Zen (opencode/ models)?**
   - `yes` → `--opencode-zen=yes`
   - `no` → `--opencode-zen=no`

6. **Do you have a Z.ai Coding Plan subscription?**
   - `yes` → `--zai-coding-plan=yes`
   - `no` → `--zai-coding-plan=no`

**Non-interactive Mode** (suitable for scripted installation):

```bash
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no
```

### Step 3: Authenticate Each Provider

After the installer configuration is complete, authenticate each Provider one by one:

```bash
# Authenticate Anthropic
opencode auth login
# Provider: Anthropic
# Login method: Claude Pro/Max
# Complete OAuth flow

# Authenticate OpenAI
opencode auth login
# Provider: OpenAI
# Complete OAuth flow

# Authenticate Google Gemini (need to install antigravity plugin first)
opencode auth login
# Provider: Google
# Login method: OAuth with Google (Antigravity)
# Complete OAuth flow

# Authenticate GitHub Copilot
opencode auth login
# Provider: GitHub
# Login method: Authenticate via OAuth
# Complete GitHub OAuth
```

### Step 4: Verify Configuration

```bash
# Check OpenCode version
opencode --version
# Should be >= 1.0.150

# View all available models
opencode models

# Run doctor diagnostics
bunx oh-my-opencode doctor --verbose
```

**You Should See** (doctor output example):

```
✅ OpenCode version: 1.0.150
✅ Plugin loaded: oh-my-opencode

📊 Model Resolution:
┌─────────────────────────────────────────────────────┐
│ Agent           │ Requirement            │ Resolved         │
├─────────────────────────────────────────────────────┤
│ Sisyphus        │ anthropic/claude-opus-4-5  │ anthropic/claude-opus-4-5 │
│ Oracle           │ openai/gpt-5.2              │ openai/gpt-5.2              │
│ Librarian        │ opencode/big-pickle           │ opencode/big-pickle           │
│ Explore          │ anthropic/gpt-5-nano          │ anthropic/gpt-5-nano          │
│ Multimodal Looker│ google/gemini-3-flash          │ google/gemini-3-flash          │
└─────────────────────────────────────────────────────┘

✅ All models resolved successfully
```

### Step 5: Customize Agent Models (Optional)

If you want to specify different models for specific agents:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle uses GPT for architecture review
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },

    // Librarian uses cheaper models for research
    "librarian": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Multimodal Looker uses Antigravity Gemini
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash",
      "variant": "high"
    }
  }
}
```

### Step 6: Customize Category Models (Optional)

Specify models for different types of tasks:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "categories": {
    // Quick tasks use cheap models
    "quick": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Frontend tasks use Gemini
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },

    // High-IQ reasoning tasks use GPT Codex
    "ultrabrain": {
      "model": "openai/gpt-5.2-codex",
      "temperature": 0.1
    }
  }
}
```

**Using Categories**:

```markdown
// Use delegate_task in conversations
delegate_task(category="visual", prompt="Create a responsive dashboard component")
delegate_task(category="quick", skills=["git-master"], prompt="Commit these changes")
```

## Checkpoint ✅

- [ ] `opencode --version` shows version >= 1.0.150
- [ ] `opencode models` lists models from all configured Providers
- [ ] `bunx oh-my-opencode doctor --verbose` shows all agent models are correctly resolved
- [ ] You can see `"oh-my-opencode"` in the `plugin` array in `opencode.json`
- [ ] Try using an agent (e.g., Sisyphus) to confirm the model is working properly

## Common Pitfalls

### ❌ Pitfall 1: Forgetting to Authenticate Provider

**Symptom**: Provider is configured, but model resolution fails.

**Cause**: The installer configured models, but authentication wasn't completed.

**Solution**:
```bash
opencode auth login
# Select the corresponding Provider and complete authentication
```

### ❌ Pitfall 2: Incorrect Antigravity Model Name

**Symptom**: Gemini is configured, but agents don't use it.

**Cause**: The Antigravity plugin uses different model names (`google/antigravity-gemini-3-pro` instead of `google/gemini-3-pro`).

**Solution**:
```jsonc
{
  "agents": {
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash"  // Correct
      // model: "google/gemini-3-flash"  // ❌ Wrong
    }
  }
}
```

### ❌ Pitfall 3: Wrong Configuration File Location

**Symptom**: Configuration was modified, but system doesn't take effect.

**Cause**: Modified the wrong configuration file (user config vs project config).

**Solution**:
```bash
# User configuration (global, high priority)
~/.config/opencode/oh-my-opencode.json

# Project configuration (local, low priority)
.opencode/oh-my-opencode.json

# Verify which file is being used
bunx oh-my-opencode doctor --verbose
```

### ❌ Pitfall 4: Provider Priority Chain Interrupted

**Symptom**: An agent always uses the wrong model.

**Cause**: User override (Step 1) completely skips Provider fallback (Step 2).

**Solution**: If you want to leverage automatic fallback, don't hardcode models in `oh-my-opencode.json`, let the system automatically select based on priority chain.

**Example**:
```jsonc
{
  "agents": {
    "oracle": {
      // ❌ Hardcoded: Always use GPT, even if Anthropic is available
      "model": "openai/gpt-5.2"
    }
  }
}
```

If you want to leverage fallback, remove the `model` field and let the system automatically select:
```jsonc
{
  "agents": {
    "oracle": {
      // ✅ Automatic: anthropic → google → github-copilot → opencode
      "temperature": 0.1
    }
  }
}
```

### ❌ Pitfall 5: Z.ai Always Occupies Librarian

**Symptom**: Even with other Providers configured, Librarian still uses GLM-4.7.

**Cause**: When Z.ai is enabled, Librarian is hardcoded to use `zai-coding-plan/glm-4.7`.

**Solution**: If you don't need this behavior, disable Z.ai:
```bash
bunx oh-my-opencode install --no-tui --zai-coding-plan=no
```

Or manually override:
```jsonc
{
  "agents": {
    "librarian": {
      "model": "opencode/big-pickle"  // Override Z.ai's hardcoding
    }
  }
}
```

## Summary

- oh-my-opencode supports 6 main Providers: Anthropic, OpenAI, Google, GitHub Copilot, Z.ai, OpenCode Zen
- Use the interactive installer `bunx oh-my-opencode install` to quickly configure multiple Providers
- The model resolution system dynamically selects models through 3-step priority (User Override → Provider Fallback → System Default)
- Each agent and Category has its own Provider priority chain, ensuring an available model is always found
- Use the `doctor --verbose` command to diagnose model resolution configuration
- When customizing agent and Category models, be careful not to break the automatic fallback mechanism

## Next Lesson Preview

> Next, we'll learn **[Multi-Model Strategy: Automatic Fallback and Priorities](../model-resolution/)**.
>
> You'll learn:
> - The complete workflow of the model resolution system
> - How to design optimal model combinations for different tasks
> - Concurrency control strategies in background tasks
> - How to diagnose model resolution issues

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-26

| Feature | File Path | Lines |
|---------|-----------|-------|
| Configuration Schema Definition | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378 |
| Installation Guide (Provider Configuration) | [`docs/guide/installation.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/guide/installation.md) | 1-299 |
| Configuration Reference (Model Resolution) | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 391-512 |
| Agent Override Configuration Schema | [`src/config/schema.ts:AgentOverrideConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L98-L119) | 98-119 |
| Category Configuration Schema | [`src/config/schema.ts:CategoryConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L154-L172) | 154-172 |
| Provider Priority Chain Documentation | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md#L445-L473) | 445-473 |

**Key Constants**:
- None: Provider priority chains are hardcoded in configuration documentation, not code constants

**Key Functions**:
- None: Model resolution logic is handled by OpenCode core, oh-my-opencode provides configuration and priority definitions

</details>
