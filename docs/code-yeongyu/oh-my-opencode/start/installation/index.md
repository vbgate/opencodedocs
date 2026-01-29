---
title: "Installation: Quick Setup | oh-my-opencode"
sidebarTitle: "Installation"
subtitle: "Installation: Quick Setup | oh-my-opencode"
description: "Learn to install oh-my-opencode with AI agent or CLI. Configure Claude, OpenAI, Gemini providers in minutes with automatic verification."
tags:
  - "installation"
  - "setup"
  - "provider-configuration"
prerequisite: []
order: 10
---

# Quick Installation and Configuration: Provider Setup and Verification

## What You'll Learn

- ✅ Use the recommended AI agent method to automatically install and configure oh-my-opencode
- ✅ Manually complete configuration using the CLI interactive installer
- ✅ Configure multiple AI Providers including Claude, OpenAI, Gemini, and GitHub Copilot
- ✅ Verify successful installation and diagnose configuration issues
- ✅ Understand Provider priority and fallback mechanism

## Your Current Challenges

- You just installed OpenCode but face a blank configuration interface with no idea where to start
- You have multiple AI service subscriptions (Claude, ChatGPT, Gemini) and don't know how to configure them uniformly
- You want AI to help you install but don't know how to provide accurate installation instructions to AI
- You're worried about configuration errors causing the plugin to not work properly

## When to Use This

- **First time installing oh-my-opencode**: This is the first step and must be completed
- **After adding new AI Provider subscriptions**: For example, when you newly purchase Claude Max or ChatGPT Plus
- **When switching development environments**: Reconfiguring your development environment on a new machine
- **When encountering Provider connection issues**: Troubleshoot configuration issues through diagnostic commands

## 🎒 Prerequisites

::: warning Prerequisites
This tutorial assumes you have already:
1. Installed **OpenCode >= 1.0.150**
2. Have at least one AI Provider subscription (Claude, OpenAI, Gemini, GitHub Copilot, etc.)

If OpenCode is not installed, please refer to the [OpenCode official documentation](https://opencode.ai/docs) to complete installation first.
:::

::: tip Check OpenCode version
```bash
opencode --version
# Should display 1.0.150 or higher
```
:::

## Core Concepts

The installation design of oh-my-opencode is based on two core principles:

**1. AI Agent First (Recommended)**

Let AI agents help you install and configure instead of manual operations. Why?
- AI won't miss steps (it has the complete installation guide)
- AI automatically selects the best configuration based on your subscription
- AI can automatically diagnose and fix errors when they occur

**2. Interactive vs Non-Interactive**

- **Interactive installation**: Run `bunx oh-my-opencode install`, configure via Q&A
- **Non-interactive installation**: Use command-line parameters (suitable for automation or AI agents)

**3. Provider Priority**

oh-my-opencode uses a three-step model resolution mechanism:
1. **User override**: If a model is explicitly specified in the configuration file, use that model
2. **Provider fallback**: Try by priority chain: `Native (anthropic/openai/google) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`
3. **System default**: If all Providers are unavailable, use the OpenCode default model

::: info What is a Provider?
A Provider is an AI model service provider, such as:
- **Anthropic**: Provides Claude models (Opus, Sonnet, Haiku)
- **OpenAI**: Provides GPT models (GPT-5.2, GPT-5-nano)
- **Google**: Provides Gemini models (Gemini 3 Pro, Flash)
- **GitHub Copilot**: Provides various GitHub-hosted models as fallback

oh-my-opencode can configure multiple Providers simultaneously, automatically selecting the optimal model based on task type and priority.
:::

## Follow Along

### Step 1: Recommended Method—Let AI Agent Install (Human-Friendly)

**Why**
This is the officially recommended installation method, letting AI agents automatically complete configuration to avoid human errors in missing steps.

**How to do it**

Open your AI chat interface (Claude Code, AmpCode, Cursor, etc.) and enter the following prompt:

```bash
Please install and configure oh-my-opencode following this guide:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**What you should see**
The AI agent will:
1. Ask about your subscriptions (Claude, OpenAI, Gemini, GitHub Copilot, etc.)
2. Automatically execute installation commands
3. Configure Provider authentication
4. Verify installation results
5. Tell you installation is complete

::: tip AI agent test passphrase
After completing installation, the AI agent will use "oMoMoMoMo..." as a test passphrase to confirm with you.
:::
### Step 2: Manual Installation—Using CLI Interactive Installer

**Why**
Use this if you want complete control over the installation process, or if the AI agent installation fails.

::: code-group

```bash [Using Bun (recommended)]
bunx oh-my-opencode install
```

```bash [Using npm]
npx oh-my-opencode install
```

:::

> **Note**: The CLI automatically downloads a standalone binary suitable for your platform. No Bun/Node.js runtime needed after installation.
>
> **Supported platforms**: macOS (ARM64, x64), Linux (x64, ARM64, Alpine/musl), Windows (x64)

**What you should see**
The installer will ask the following questions:

```
oMoMoMoMo... Install

[?] Do you have a Claude Pro/Max Subscription? (Y/n)
[?] Are you on max20 (20x mode)? (Y/n)
[?] Do you have an OpenAI/ChatGPT Plus Subscription? (Y/n)
[?] Will you integrate Gemini models? (Y/n)
[?] Do you have a GitHub Copilot Subscription? (Y/n)
[?] Do you have access to OpenCode Zen (opencode/ models)? (Y/n)
[?] Do you have a Z.ai Coding Plan subscription? (Y/n)

Configuration Summary
───────────────────────────────────────────────

  [OK] Claude (max20)
  [OK] OpenAI/ChatGPT (GPT-5.2 for Oracle)
  [OK] Gemini
  [OK] GitHub Copilot (fallback)
  ○ OpenCode Zen (opencode/ models)
  ○ Z.ai Coding Plan (Librarian/Multimodal)

───────────────────────────────────────────────

Model Assignment

  [i] Models auto-configured based on provider priority
  * Priority: Native > Copilot > OpenCode Zen > Z.ai

✓ Plugin registered in opencode.json
✓ Configuration written to ~/.config/opencode/oh-my-opencode.json
✓ Auth setup hints displayed

[!] Please configure authentication for your providers:

1. Anthropic (Claude): Run 'opencode auth login' → Select Anthropic
2. Google (Gemini): Run 'opencode auth login' → Select Google → Choose OAuth with Google (Antigravity)
3. GitHub (Copilot): Run 'opencode auth login' → Select GitHub

Done! 🎉
```
### Step 3: Configure Provider Authentication

#### 3.1 Claude (Anthropic) Authentication

**Why**
The Sisyphus main agent strongly recommends using the Opus 4.5 model, so you must authenticate first.

**How to do it**

```bash
opencode auth login
```

Then follow the prompts:
1. **Select Provider**: Choose `Anthropic`
2. **Select login method**: Choose `Claude Pro/Max`
3. **Complete OAuth flow**: Log in and authorize in your browser
4. **Wait for completion**: Terminal will display authentication success

**What you should see**
```
✓ Authentication successful
✓ Anthropic provider configured
```

::: warning Claude OAuth access restriction
> As of January 2026, Anthropic has restricted third-party OAuth access, citing ToS violations.
>
> [**Anthropic cited this project oh-my-opencode as the reason for blocking OpenCode**](https://x.com/thdxr/status/2010149530486911014)
>
> There are indeed plugins in the community that forge Claude Code OAuth request signatures. These tools may be technically feasible, but users should be aware of ToS implications, and I personally do not recommend using them.
>
> This project is not responsible for any issues caused by using unofficial tools, and **we have no custom OAuth system implementation**.
:::
#### 3.2 Google Gemini (Antigravity OAuth) Authentication

**Why**
Gemini models are used for Multimodal Looker (media analysis) and some specialized tasks.

**How to do it**

**Step 1**: Add Antigravity Auth Plugin

Edit `~/.config/opencode/opencode.json`, add `opencode-antigravity-auth@latest` to the `plugin` array:

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Step 2**: Configure Antigravity Models (Required)

Copy the complete model configuration from the [opencode-antigravity-auth documentation](https://github.com/NoeFabris/opencode-antigravity-auth), carefully merge it into `~/.config/opencode/oh-my-opencode.json` to avoid breaking existing configuration.

The plugin uses a **variant system**—models like `antigravity-gemini-3-pro` support `low`/`high` variants, not separate `-low`/`-high` model entries.

**Step 3**: Override oh-my-opencode Agent Models

Override agent models in `oh-my-opencode.json` (or `.opencode/oh-my-opencode.json`):

```json
{
  "agents": {
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**Available Models (Antigravity quota)**:
- `google/antigravity-gemini-3-pro` — variants: `low`, `high`
- `google/antigravity-gemini-3-flash` — variants: `minimal`, `low`, `medium`, `high`
- `google/antigravity-claude-sonnet-4-5` — no variants
- `google/antigravity-claude-sonnet-4-5-thinking` — variants: `low`, `max`
- `google/antigravity-claude-opus-4-5-thinking` — variants: `low`, `max`

**Available Models (Gemini CLI quota)**:
- `google/gemini-2.5-flash`, `google/gemini-2.5-pro`
- `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

> **Note**: Traditional names with suffixes like `google/antigravity-gemini-3-pro-high` are still available, but variants are recommended. Switch to using `--variant=high` with the base model name instead.
**Step 4**: Execute Authentication

```bash
opencode auth login
```

Then follow the prompts:
1. **Select Provider**: Choose `Google`
2. **Select login method**: Choose `OAuth with Google (Antigravity)`
3. **Complete browser login**: (auto-detected) Complete login
4. **Optional**: Add more Google accounts for multi-account load balancing
5. **Verify success**: Confirm with user

**What you should see**
```
✓ Authentication successful
✓ Google provider configured (Antigravity)
✓ Multiple accounts available for load balancing
```

::: tip Multi-account load balancing
The plugin supports up to 10 Google accounts. When one account reaches rate limits, it automatically switches to the next available account.
:::

#### 3.3 GitHub Copilot (Fallback Provider) Authentication

**Why**
GitHub Copilot serves as a **fallback provider**, used when Native providers are unavailable.

**Priority**: `Native (anthropic/, openai/, google/) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`

**How to do it**

```bash
opencode auth login
```

Then follow the prompts:
1. **Select Provider**: Choose `GitHub`
2. **Select authentication method**: Choose `Authenticate via OAuth`
3. **Complete browser login**: GitHub OAuth flow

**What you should see**
```
✓ Authentication successful
✓ GitHub Copilot configured as fallback
```

::: info GitHub Copilot model mapping
When GitHub Copilot is the best available provider, oh-my-opencode uses the following model assignment:

| Agent        | Model                          |
|--- | ---|
| **Sisyphus** | `github-copilot/claude-opus-4.5` |
| **Oracle**   | `github-copilot/gpt-5.2`       |
| **Explore**  | `opencode/gpt-5-nano`           |
| **Librarian** | `zai-coding-plan/glm-4.7` (if Z.ai available) or fallback |

GitHub Copilot acts as a proxy provider, routing requests to underlying models based on your subscription.
:::
### Step 4: Non-Interactive Installation (Suitable for AI Agents)

**Why**
AI agents need to use non-interactive mode, completing all configurations at once via command-line parameters.

**How to do it**

```bash
bunx oh-my-opencode install --no-tui \
  --claude=<yes|no|max20> \
  --openai=<yes|no> \
  --gemini=<yes|no> \
  --copilot=<yes|no> \
  [--opencode-zen=<yes|no>] \
  [--zai-coding-plan=<yes|no>]
```

**Parameter description**:

| Parameter           | Value           | Description                                        |
|--- | --- | ---|
| `--no-tui`         | -               | Disable interactive interface (must specify other parameters) |
| `--claude`         | `yes/no/max20`  | Claude subscription status                           |
| `--openai`         | `yes/no`        | OpenAI/ChatGPT subscription (GPT-5.2 for Oracle)    |
| `--gemini`         | `yes/no`        | Gemini integration                                 |
| `--copilot`        | `yes/no`        | GitHub Copilot subscription                        |
| `--opencode-zen`   | `yes/no`        | OpenCode Zen access (default no)                   |
| `--zai-coding-plan` | `yes/no`        | Z.ai Coding Plan subscription (default no)         |

**Examples**:

```bash
# User has all native subscriptions
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no

# User only has Claude
bunx oh-my-opencode install --no-tui \
  --claude=yes \
  --openai=no \
  --gemini=no \
  --copilot=no

# User only has GitHub Copilot
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=yes

# User has no subscriptions
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no
```

**What you should see**
The same output as interactive installation, but without manually answering questions.
## Checkpoint ✅

### Verify Successful Installation

**Check 1**: Confirm OpenCode Version

```bash
opencode --version
```

**Expected result**: Displays `1.0.150` or higher version.

::: warning OpenCode version requirement
If you're on version 1.0.132 or earlier, OpenCode bugs may corrupt your configuration.
>
> This fix was merged after 1.0.132—use a newer version.
> Fun fact: This PR was discovered and fixed due to OhMyOpenCode's Librarian, Explore, and Oracle settings.
:::

**Check 2**: Confirm Plugin is Registered

```bash
cat ~/.config/opencode/opencode.json
```

**Expected result**: See `"oh-my-opencode"` in the `plugin` array.

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**Check 3**: Confirm Configuration File is Generated

```bash
cat ~/.config/opencode/oh-my-opencode.json
```

**Expected result**: Display complete configuration structure, including `agents`, `categories`, `disabled_agents` and other fields.

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/gpt-5.2"
    },
    ...
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1
    },
    ...
  },
  "disabled_agents": [],
  "disabled_skills": [],
  "disabled_hooks": [],
  "disabled_mcps": []
}
```
### Run Diagnostic Command

```bash
oh-my-opencode doctor --verbose
```

**What you should see**:
- Model resolution checks
- Agent configuration verification
- MCP connection status
- Provider authentication status

```bash
✓ OpenCode version: 1.0.150 (required: >=1.0.150)
✓ Plugin registered: oh-my-opencode
✓ Config file found: ~/.config/opencode/oh-my-opencode.json
✓ Anthropic provider: authenticated
✓ OpenAI provider: authenticated
✓ Google provider: authenticated (Antigravity)
✓ GitHub Copilot: authenticated (fallback)
✓ MCP servers: 3 connected (websearch, context7, grep_app)
✓ Agents: 10 enabled
✓ Hooks: 32 enabled
```

::: danger If diagnostics fail
If the diagnosis shows any errors, resolve them first:
1. **Provider authentication failure**: Re-run `opencode auth login`
2. **Configuration file error**: Check `oh-my-opencode.json` syntax (JSONC supports comments and trailing commas)
3. **Version incompatibility**: Upgrade OpenCode to the latest version
4. **Plugin not registered**: Re-run `bunx oh-my-opencode install`
:::

## Common Pitfalls

### ❌ Error 1: Forgot to Configure Provider Authentication

**Problem**: AI models don't work after direct use following installation.

**Cause**: Plugin is installed, but Provider hasn't been authenticated via OpenCode.

**Solution**:
```bash
opencode auth login
# Select the corresponding Provider and complete authentication
```

### ❌ Error 2: OpenCode Version Too Old

**Problem**: Configuration file is corrupted or cannot be loaded.

**Cause**: OpenCode version 1.0.132 or earlier has a bug that corrupts configuration.

**Solution**:
```bash
# Upgrade OpenCode
npm install -g @opencode/cli@latest

# Or use package manager (Bun, Homebrew, etc.)
bun install -g @opencode/cli@latest
```

### ❌ Error 3: Incorrect CLI Command Parameters

**Problem**: Parameter error when running non-interactive installation.

**Cause**: `--claude` is a required parameter and must be provided as `yes`, `no`, or `max20`.

**Solution**:
```bash
# ❌ Wrong: Missing --claude parameter
bunx oh-my-opencode install --no-tui --gemini=yes

# ✅ Correct: Provide all required parameters
bunx oh-my-opencode install --no-tui --claude=yes --gemini=yes
```

### ❌ Error 4: Antigravity Quota Exhausted

**Problem**: Gemini models suddenly stop working.

**Cause**: Antigravity quota is limited, and a single account may reach rate limits.

**Solution**: Add multiple Google accounts for load balancing
```bash
opencode auth login
# Select Google
# Add more accounts
```

The plugin automatically switches between accounts to avoid single account exhaustion.

### ❌ Error 5: Incorrect Configuration File Location

**Problem**: Changes don't take effect after modifying configuration.

**Cause**: Modified the wrong configuration file (project config vs user config).

**Solution**: Confirm configuration file location

| Config Type | File Path | Priority |
|--- | --- | ---|
| **User config** | `~/.config/opencode/oh-my-opencode.json` | High |
| **Project config** | `.opencode/oh-my-opencode.json` | Low |

::: tip Configuration merge rules
If both user config and project config exist, **user config overrides project config**.
:::
## Summary

- **Recommended to use AI agent for installation**: Let AI automatically complete configuration to avoid human errors
- **CLI supports both interactive and non-interactive modes**: Interactive is suitable for humans, non-interactive for AI
- **Provider priority**: Native > Copilot > OpenCode Zen > Z.ai
- **Authentication is required**: After installation, you must configure Provider authentication to use it
- **Diagnostic commands are important**: `oh-my-opencode doctor --verbose` can quickly troubleshoot issues
- **Supports JSONC format**: Configuration files support comments and trailing commas

## Next Lesson Preview

> In the next lesson, we'll learn about **[Meet Sisyphus: The Main Orchestrator](../sisyphus-orchestrator/)**.
>
> You'll learn:
> - Core functions and design philosophy of the Sisyphus agent
> - How to use Sisyphus to plan and delegate tasks
> - How parallel background tasks work
> - The principle of the Todo completion enforcer

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-26

| Feature         | File Path                                                                                              | Line   |
|--- | --- | ---|
| CLI install entry | [`src/cli/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/index.ts)         | 22-60  |
| Interactive installer | [`src/cli/install.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/install.ts)     | 1-400+ |
| Config manager  | [`src/cli/config-manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/config-manager.ts) | 1-200+ |
| Config Schema   | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts)   | 1-400+ |
| Diagnostic command | [`src/cli/doctor.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/doctor.ts)        | 1-200+ |

**Key constants**:
- `VERSION = packageJson.version`: Current CLI version number
- `SYMBOLS`: UI symbols (check, cross, arrow, bullet, info, warn, star)

**Key functions**:
- `install(args: InstallArgs)`: Main installation function, handles interactive and non-interactive installation
- `validateNonTuiArgs(args: InstallArgs)`: Validate parameters for non-interactive mode
- `argsToConfig(args: InstallArgs)`: Convert CLI parameters to configuration object
- `addPluginToOpenCodeConfig()`: Register plugin in opencode.json
- `writeOmoConfig(config)`: Write oh-my-opencode.json configuration file
- `isOpenCodeInstalled()`: Check if OpenCode is installed
- `getOpenCodeVersion()`: Get OpenCode version number

**Configuration Schema fields**:
- `AgentOverrideConfigSchema`: Agent override configuration (model, variant, skills, temperature, prompt, etc.)
- `CategoryConfigSchema`: Category configuration (description, model, temperature, thinking, etc.)
- `ClaudeCodeConfigSchema`: Claude Code compatibility configuration (mcp, commands, skills, agents, hooks, plugins)
- `BuiltinAgentNameSchema`: Built-in agent enumeration (sisyphus, prometheus, oracle, librarian, explore, multimodal-looker, metis, momus, atlas)
- `PermissionValue`: Permission value enumeration (ask, allow, deny)

**Installation supported platforms** (from README):
- macOS (ARM64, x64)
- Linux (x64, ARM64, Alpine/musl)
- Windows (x64)

**Provider priority chain** (from docs/guide/installation.md):
1. Native (anthropic/, openai/, google/)
2. GitHub Copilot
3. OpenCode Zen
4. Z.ai Coding Plan

</details>
