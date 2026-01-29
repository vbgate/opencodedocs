---
title: "Troubleshooting: Doctor Command | oh-my-opencode"
subtitle: "Using Doctor Command for Configuration Diagnostics"
sidebarTitle: "Troubleshooting"
description: "Learn oh-my-opencode's doctor command diagnostic methods. Run 17+ health checks including version, plugins, authentication, and models to quickly resolve issues."
tags:
  - "troubleshooting"
  - "diagnostics"
  - "configuration"
prerequisite:
  - "start-installation"
order: 150
---

# Configuration Diagnostics & Troubleshooting: Using Doctor Command to Quickly Solve Problems

## What You'll Learn

- Run `oh-my-opencode doctor` to quickly diagnose 17+ health checks
- Locate and fix issues like outdated OpenCode version, unregistered plugins, Provider configuration problems
- Understand model resolution mechanism and check agent and Category model assignments
- Use verbose mode to get complete information for problem diagnosis

## Your Current Challenge

After installing oh-my-opencode, what do you do when you encounter:

- OpenCode reports plugin not loaded, but configuration file looks fine
- Some AI agents always error with "Model not found"
- Want to verify all Providers (Claude, OpenAI, Gemini) are configured correctly
- Not sure if the problem is in installation, configuration, or authentication

Troubleshooting one by one is time-consuming. You need a **one-click diagnostic tool**.

## Core Concepts

**The Doctor command is oh-my-opencode's health check system**, similar to Mac's Disk Utility or a car's diagnostic scanner. It systematically checks your environment and tells you what's working and what has problems.

The Doctor's check logic comes entirely from source code implementation (`src/cli/doctor/checks/`), including:
- ✅ **installation**: OpenCode version, plugin registration
- ✅ **configuration**: Configuration file format, Schema validation
- ✅ **authentication**: Anthropic, OpenAI, Google authentication plugins
- ✅ **dependencies**: Bun, Node.js, Git dependencies
- ✅ **tools**: LSP and MCP server status
- ✅ **updates**: Version update checks

## Follow Along

### Step 1: Run Basic Diagnostics

**Why**
Run a complete check first to understand overall health status.

```bash
bunx oh-my-opencode doctor
```

**You Should See**:

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**Checkpoint ✅**:
- [ ] See results for 6 categories
- [ ] Each item has ✓ (pass), ⚠ (warning), ✗ (fail) marker
- [ ] Summary statistics at bottom

### Step 2: Interpret Common Issues

Based on diagnostic results, you can quickly locate problems. Here are common errors and solutions:

#### ✗ "OpenCode version too old"

**Problem**: OpenCode version is below 1.0.150 (minimum requirement)

**Cause**: oh-my-opencode depends on new OpenCode features, which old versions don't support

**Solution**:

```bash
# Update OpenCode
npm install -g opencode@latest
# Or use Bun
bun install -g opencode@latest
```

**Verification**: Rerun `bunx oh-my-opencode doctor`

#### ✗ "Plugin not registered"

**Problem**: Plugin not registered in `opencode.json`'s `plugin` array

**Cause**: Installation process interrupted, or manually edited configuration file

**Solution**:

```bash
# Rerun installer
bunx oh-my-opencode install
```

**Source Code Basis** (`src/cli/doctor/checks/plugin.ts:79-117`):
- Checks if plugin is in `opencode.json`'s `plugin` array
- Supports formats: `oh-my-opencode` or `oh-my-opencode@version` or `file://` path

#### ✗ "Configuration has validation errors"

**Problem**: Configuration file doesn't match Schema definition

**Cause**: Errors introduced during manual editing (like typos, type mismatches)

**Solution**:

1. Use `--verbose` to view detailed error information:

```bash
bunx oh-my-opencode doctor --verbose
```

2. Common error types (from `src/config/schema.ts`):

| Error Message | Cause | Fix |
|--------------|-------|-----|
| `agents.sisyphus.mode: Invalid enum value` | `mode` can only be `subagent`/`primary`/`all` | Change to `primary` |
| `categories.quick.model: Expected string` | `model` must be a string | Add quotes: `"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | Concurrency must be a number | Change to number: `3` |

3. Refer to [Configuration Reference](../../appendix/configuration-reference/) to verify field definitions

#### ⚠ "Auth plugin not installed"

**Problem**: Authentication plugin for Provider is not installed

**Cause**: Skipped that Provider during installation, or manually uninstalled plugin

**Solution**:

```bash
# Reinstall and select missing Provider
bunx oh-my-opencode install
```

**Source Code Basis** (`src/cli/doctor/checks/auth.ts:11-15`):

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### Step 3: Check Model Resolution

Model resolution is oh-my-opencode's core mechanism, checking whether agent and Category model assignments are correct.

```bash
bunx oh-my-opencode doctor --category configuration
```

**You Should See**:

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══

    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15
    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh

  ═══ Configured Models ═══

  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...

  Categories:
    ○ visual-engineering: google/gemini-3-pro
    ○ ultrabrain: openai/gpt-5.2-codex
    ...

  ○ = provider fallback
```

**Checkpoint ✅**:
- [ ] See Agent and Categories model assignments
- [ ] `○` means using Provider fallback mechanism (not manually overridden)
- [ ] `●` means user has overridden default model in configuration

**Common Issues**:

| Issue | Cause | Solution |
|-------|-------|----------|
| `unknown` model | Provider fallback chain is empty | Ensure at least one Provider is available |
| Model not used | Provider not connected | Run `opencode` to connect Provider |
| Want to override model | Using default model | Set `agents.<name>.model` in `oh-my-opencode.json` |

**Source Code Basis** (`src/cli/doctor/checks/model-resolution.ts:129-148`):
- Reads available models from `~/.cache/opencode/models.json`
- Agent model requirements: `AGENT_MODEL_REQUIREMENTS` (`src/shared/model-requirements.ts`)
- Category model requirements: `CATEGORY_MODEL_REQUIREMENTS`

### Step 4: Use JSON Output (Scripting)

If you want to automate diagnostics in CI/CD, use JSON format:

```bash
bunx oh-my-opencode doctor --json
```

**You Should See**:

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**Use Cases**:

```bash
# Save diagnostic report to file
bunx oh-my-opencode doctor --json > doctor-report.json

# Check health status in CI/CD
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "All checks passed"
else
  echo "Some checks failed"
  exit 1
fi
```

## Common Pitfalls

### Pitfall 1: Ignoring Warning Messages

**Problem**: Seeing `⚠` markers and thinking they're "optional", when they might actually be important hints

**Solution**:
- For example: "using default model" warning means you haven't configured Category models, which might not be optimal
- Use `--verbose` to view detailed information and decide if action is needed

### Pitfall 2: Manually Editing opencode.json

**Problem**: Directly modifying OpenCode's `opencode.json`, breaking plugin registration

**Solution**:
- Use `bunx oh-my-opencode install` to re-register
- Or only modify `oh-my-opencode.json`, don't touch OpenCode's configuration file

### Pitfall 3: Cache Not Refreshed

**Problem**: Model resolution shows "cache not found", but Provider is configured

**Solution**:

```bash
# Start OpenCode to refresh model cache
opencode

# Or manually refresh (if opencode models command exists)
opencode models --refresh
```

## Summary

The Doctor command is oh-my-opencode's Swiss Army knife, helping you quickly locate problems:

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `bunx oh-my-opencode doctor` | Complete diagnosis | After initial installation, when encountering problems |
| `--verbose` | Detailed information | Need to view error details |
| `--json` | JSON output | CI/CD, script automation |
| `--category <name>` | Single category check | Only want to check specific aspect |

**Remember**: Whenever you encounter a problem, run `doctor` first, understand the error clearly before taking action.

## Coming Up Next

> In the next lesson, we'll learn **[Frequently Asked Questions](../faq/)**.
>
> You'll learn:
> - Differences between oh-my-opencode and other AI tools
> - How to optimize model usage costs
> - Best practices for background task concurrency control

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-26

| Feature | File Path | Line Numbers |
|---------|-----------|-------------|
| Doctor command entry | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| All checks registration | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| Plugin registration check | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| Configuration validation check | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| Authentication check | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| Model resolution check | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| Configuration Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| Model requirements definition | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | Full file |

**Key Constants**:
- `MIN_OPENCODE_VERSION = "1.0.150"`: OpenCode minimum version requirement
- `AUTH_PLUGINS`: Authentication plugin mapping (Anthropic=built-in, OpenAI/GitHub=plugins)
- `AGENT_MODEL_REQUIREMENTS`: Agent model requirements (each agent's priority chain)
- `CATEGORY_MODEL_REQUIREMENTS`: Category model requirements (visual, quick, etc.)

**Key Functions**:
- `doctor(options)`: Run diagnostic command, returns exit code
- `getAllCheckDefinitions()`: Get all 17+ check item definitions
- `checkPluginRegistration()`: Check if plugin is registered in opencode.json
- `validateConfig(configPath)`: Validate configuration file matches Schema
- `checkAuthProvider(providerId)`: Check Provider authentication plugin status
- `checkModelResolution()`: Check model resolution and assignment

</details>
