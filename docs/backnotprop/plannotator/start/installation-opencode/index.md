---
title: "OpenCode Plugin Installation | Plannotator"
sidebarTitle: "OpenCode Install"
subtitle: "Install the OpenCode Plugin"
description: "Learn how to install the Plannotator plugin in OpenCode. Configure opencode.json, run installation script to get slash commands, set up environment variables for remote mode, and verify plugin is working."
tags:
  - "Installation"
  - "Configuration"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 3
---

# Install the OpenCode Plugin

## What You'll Learn

- Install the Plannotator plugin in OpenCode
- Configure the `submit_plan` tool and `/plannotator-review` command
- Set up environment variables (remote mode, port, browser, etc.)
- Verify that the plugin installation was successful

## Your Current Struggle

When using AI Agent in OpenCode, plan reviews require reading plain text in the terminal, making precise feedback difficult. You want a visual interface to annotate plans, add comments, and automatically send structured feedback back to the Agent.

## When to Use This

**Required before using Plannotator**: If you're developing in the OpenCode environment and want an interactive plan review experience.

## 🎒 Before You Start

- [ ] [OpenCode](https://opencode.ai/) installed
- [ ] Basic understanding of `opencode.json` configuration (OpenCode plugin system)

::: warning Prerequisites
If you're unfamiliar with OpenCode basics, we recommend reading the [OpenCode official documentation](https://opencode.ai/docs) first.
:::

## Core Concepts

Plannotator provides two core features for OpenCode:

1. **`submit_plan` tool** - Called when Agent completes the plan, opens browser for interactive review
2. **`/plannotator-review` command** - Manually triggers Git diff code review

Installation involves two steps:
1. Add plugin configuration in `opencode.json` (enable `submit_plan` tool)
2. Run installation script (get `/plannotator-review` command)

## Follow Along

### Step 1: Install Plugin via opencode.json

Find your OpenCode configuration file (usually in project root or user config directory), add Plannotator to the `plugin` array:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**Why**
`opencode.json` is OpenCode's plugin configuration file. After adding the plugin name, OpenCode will automatically download and load the plugin from the npm registry.

What you should see: OpenCode will display a message "Loading plugin: @plannotator/opencode..." on startup.

---

### Step 2: Restart OpenCode

**Why**
Plugin configuration changes require a restart to take effect.

What you should see: OpenCode reloads all plugins.

---

### Step 3: Run Installation Script to Get Slash Commands

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

:::

**Why**
This script will:
1. Download the `plannotator` CLI tool to your system
2. Install the `/plannotator-review` slash command to OpenCode
3. Clear any cached plugin versions

What you should see: Installation success message, like "Plannotator installed successfully!"

---

### Step 4: Verify Installation

Check if the plugin works properly in OpenCode:

**Check if `submit_plan` tool is available**:
- Ask Agent "Please use submit_plan to submit plan" in conversation
- If plugin is working, Agent should be able to see and call this tool

**Check if `/plannotator-review` command is available**:
- Type `/plannotator-review` in the input box
- If plugin is working, you should see command suggestions

What you should see: Both features work normally without error messages.

---

### Step 5: Configure Environment Variables (Optional)

Plannotator supports the following environment variables, configure according to your needs:

::: details Environment Variable Reference

| Environment Variable | Purpose | Default | Example |
|--- | --- | --- | ---|
| `PLANNOTATOR_REMOTE` | Enable remote mode (devcontainer/SSH) | Not set | `export PLANNOTATOR_REMOTE=1` |
| `PLANNOTATOR_PORT` | Fixed port (required for remote mode) | Random local, 19432 remote | `export PLANNOTATOR_PORT=9999` |
| `PLANNOTATOR_BROWSER` | Custom browser path | System default | `export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"` |
| `PLANNOTATOR_SHARE` | Disable URL sharing | Enabled | `export PLANNOTATOR_SHARE=disabled` |

:::

**Remote mode configuration example** (devcontainer/SSH):

In `.devcontainer/devcontainer.json`:

```json
{
  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },
  "forwardPorts": [9999]
}
```

**Why**
- Remote mode: When running OpenCode in a container or remote machine, use a fixed port and automatically open browser
- Port forwarding: Allow host machine to access services inside the container

What you should see: When Agent calls `submit_plan`, console will display the server URL (instead of automatically opening browser), for example:
```
Plannotator server running at http://localhost:9999
```

---

### Step 6: Restart OpenCode (if environment variables were modified)

If you configured environment variables in Step 5, restart OpenCode again for the configuration to take effect.

---

## Checkpoint ✅

After installation, confirm the following:

- [ ] `@plannotator/opencode@latest` added to `opencode.json`
- [ ] No plugin loading errors after OpenCode restart
- [ ] Command suggestions appear when typing `/plannotator-review`
- [ ] (Optional) Environment variables configured correctly

## Common Pitfalls

### Common Error 1: Plugin Loading Failure

**Symptom**: OpenCode prompts "Failed to load plugin @plannotator/opencode" on startup

**Possible Causes**:
- Network issue prevents download from npm
- npm cache corruption

**Solution**:
1. Check network connection
2. Run installation script (it will clear plugin cache)
3. Manually clear npm cache: `npm cache clean --force`

---

### Common Error 2: Slash Command Not Available

**Symptom**: No command suggestions when typing `/plannotator-review`

**Possible Cause**: Installation script did not run successfully

**Solution**: Re-run installation script (Step 3)

---

### Common Error 3: Browser Won't Open in Remote Mode

**Symptom**: Browser doesn't open when calling `submit_plan` in devcontainer

**Possible Causes**:
- `PLANNOTATOR_REMOTE=1` not set
- Port forwarding not configured

**Solution**:
1. Confirm `PLANNOTATOR_REMOTE=1` is set
2. Check that `forwardPorts` in `.devcontainer/devcontainer.json` includes your configured port
3. Manually access the displayed URL: `http://localhost:9999`

---

### Common Error 4: Port Conflict

**Symptom**: Server fails to start, prompts "Port already in use"

**Possible Cause**: Previous server didn't close properly

**Solution**:
1. Change `PLANNOTATOR_PORT` to another port
2. Or manually kill the process occupying the port (macOS/Linux: `lsof -ti:9999 | xargs kill`)

---

## Summary

This lesson covered how to install and configure the Plannotator plugin in OpenCode:

1. **Add plugin via `opencode.json`** - Enable `submit_plan` tool
2. **Run installation script** - Get `/plannotator-review` slash command
3. **Configure environment variables** - Adapt to remote mode and custom requirements
4. **Verify installation** - Confirm plugin works properly

After installation, you can:
- Let Agent use `submit_plan` to submit plans for interactive review
- Use `/plannotator-review` to manually review Git diffs

## Next Up

> In the next lesson, we'll learn **[Plan Review Basics](../../platforms/plan-review-basics/)**.
>
> You'll learn:
> - How to view AI-generated plans
> - Add different types of annotations (delete, replace, insert, comment)
> - Approve or reject plans

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Number |
|--- | --- | ---|
| Plugin entry definition | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 34-280     |
| `submit_plan` tool definition | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 209-252    |
|--- | --- | ---|
| Plugin configuration (opencode.json) injection | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 55-63      |
| Environment variable reading | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51      |
| Plan review server startup | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts) | Full file |
| Code review server startup | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts) | Full file |
| Remote mode detection | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | Full file |

**Key Constants**:
- `PLANNOTATOR_REMOTE`: Remote mode flag (set to "1" or "true" to enable)
- `PLANNOTATOR_PORT`: Fixed port number (default random locally, 19432 remote by default)

**Key Functions**:
- `startPlannotatorServer()`: Start plan review server
- `startReviewServer()`: Start code review server
- `getSharingEnabled()`: Get URL sharing toggle status (from OpenCode config or environment variable)

</details>
