---
title: "Required Plugin Installation: superpowers and ui-ux-pro-max | AI App Factory Tutorial"
sidebarTitle: "Install Plugins in 5 Minutes"
subtitle: "Required Plugin Installation: superpowers and ui-ux-pro-max | AI App Factory Tutorial"
description: "Learn how to install and verify two required plugins for AI App Factory: superpowers (for Bootstrap brainstorming) and ui-ux-pro-max (for UI design system). This tutorial covers automatic installation, manual installation, verification methods, and troubleshooting to ensure your pipeline runs smoothly and generates high-quality, runnable applications."
tags:
  - "Plugin Installation"
  - "Claude Code"
  - "superpowers"
  - "ui-ux-pro-max"
prerequisite:
  - "start-installation"
  - "start-init-project"
  - "platforms-claude-code"
order: 70
---

# Required Plugin Installation: superpowers and ui-ux-pro-max | AI App Factory Tutorial

## What You'll Learn

- Check if superpowers and ui-ux-pro-max plugins are installed
- Manually install these two required plugins (if automatic installation fails)
- Verify that plugins are correctly enabled
- Understand why these two plugins are prerequisites for the pipeline
- Troubleshoot common plugin installation failures

## The Problem

When running the Factory pipeline, you may encounter:

- **Bootstrap stage fails**: Prompted that "superpowers:brainstorm skill not used"
- **UI stage fails**: Prompted that "ui-ux-pro-max skill not used"
- **Automatic installation fails**: Plugin installation errors during `factory init`
- **Plugin conflicts**: A plugin with the same name exists but has the wrong version
- **Permission issues**: Plugin not correctly enabled after installation

In fact, Factory will **automatically try to install** these two plugins during initialization, but if it fails, you need to handle it manually.

## When to Use This

You need to manually install plugins when the following situations occur:

- `factory init` prompts plugin installation failure
- Bootstrap or UI stage detects that required skills are not used
- First time using Factory, ensure the pipeline can run normally
- Plugin version is outdated and needs reinstallation

## Why These Two Plugins Are Required

Factory's pipeline depends on two key Claude Code plugins:

| Plugin | Purpose | Pipeline Stage | Skills Provided |
| --- | --- | --- | --- |
| **superpowers** | Deep dive into product ideas | Bootstrap | `superpowers:brainstorm` - Systematic brainstorming, analyze problem, users, value, assumptions |
| **ui-ux-pro-max** | Generate professional design system | UI | `ui-ux-pro-max` - 67 styles, 96 color palettes, 100 industry rules |

::: warning Mandatory Requirement
According to `agents/orchestrator.checkpoint.md`, these two plugins are **mandatory requirements**:
- **Bootstrap stage**: Must use `superpowers:brainstorm` skill, otherwise output will be rejected
- **UI stage**: Must use `ui-ux-pro-max` skill, otherwise output will be rejected

:::

## 🎒 Prerequisites

Before starting, please ensure:

- [ ] Claude CLI installed (`claude --version` available)
- [ ] Completed `factory init` to initialize project
- [ ] Configured Claude Code permissions (refer to [Claude Code Integration Guide](../claude-code/))
- [ ] Network connection normal (needs access to GitHub plugin marketplace)

## Core Concepts

Plugin installation follows a **check → add marketplace → install → verify** four-step process:

1. **Check**: View if plugins are already installed
2. **Add marketplace**: Add plugin repository to Claude Code plugin marketplace
3. **Install**: Execute installation command
4. **Verify**: Confirm plugin is enabled

Factory's automatic installation script (`cli/scripts/check-and-install-*.js`) will automatically execute these steps, but you need to understand the manual method to handle failure situations.

## Follow Along

### Step 1: Check Plugin Status

**Why**
First confirm if already installed, avoid duplicate operations.

Open terminal and execute in project root directory:

```bash
claude plugin list
```

**You should see**: List of installed plugins. If it contains the following, it means installed:

```
✅ superpowers (enabled)
✅ ui-ux-pro-max (enabled)
```

If you don't see these two plugins, or they show `disabled`, continue with the following steps.

::: info Automatic installation by factory init
The `factory init` command automatically executes plugin installation check (line 360-392 of `init.js`). If successful, you will see:

```
📦 Installing superpowers plugin... ✓
📦 Installing ui-ux-pro-max-skill plugin... ✓
✅ Plugins installed!
```
:::

### Step 2: Install superpowers Plugin

**Why**
Bootstrap stage needs to use `superpowers:brainstorm` skill for brainstorming.

#### Add to Plugin Marketplace

```bash
claude plugin marketplace add obra/superpowers-marketplace
```

**You should see**:

```
✅ Plugin marketplace added successfully
```

::: tip Marketplace addition failed
If prompted "plugin marketplace already exists", you can ignore and continue with installation steps.
:::

#### Install Plugin

```bash
claude plugin install superpowers@superpowers-marketplace
```

**You should see**:

```
✅ Plugin installed successfully
```

#### Verify Installation

```bash
claude plugin list
```

**You should see**: List contains `superpowers (enabled)`.

### Step 3: Install ui-ux-pro-max Plugin

**Why**
UI stage needs to use `ui-ux-pro-max` skill to generate design system.

#### Add to Plugin Marketplace

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

**You should see**:

```
✅ Plugin marketplace added successfully
```

#### Install Plugin

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**You should see**:

```
✅ Plugin installed successfully
```

#### Verify Installation

```bash
claude plugin list
```

**You should see**: List contains `ui-ux-pro-max (enabled)`.

### Step 4: Verify Both Plugins Work Normally

**Why**
Ensure the pipeline can normally call the skills of these two plugins.

#### Verify superpowers

Execute in Claude Code:

```
Please use superpowers:brainstorm skill to help me analyze the following product idea: [your idea]
```

**You should see**: Claude starts using brainstorm skill, systematically analyzes problem, users, value, and assumptions.

#### Verify ui-ux-pro-max

Execute in Claude Code:

```
Please use ui-ux-pro-max skill to design a color scheme for my application
```

**You should see**: Claude returns a professional color recommendation with multiple design options.

## Checkpoint ✅

After completing the above steps, confirm the following:

- [ ] Execute `claude plugin list` and see both plugins marked as `enabled`
- [ ] Can call `superpowers:brainstorm` skill in Claude Code
- [ ] Can call `ui-ux-pro-max` skill in Claude Code
- [ ] Execute `factory run` without prompting missing plugins

## Troubleshooting

### ❌ Plugin installed but not enabled

**Symptom**: `claude plugin list` shows plugin exists but no `enabled` marker.

**Solution**: Re-execute installation command:

```bash
claude plugin install <plugin ID>
```

### ❌ Permission blocked

**Symptom**: Prompted "Permission denied: Skill(superpowers:brainstorming)"

**Cause**: Claude Code's permission configuration doesn't include `Skill` permission.

**Solution**: Check if `.claude/settings.local.json` contains:

```json
{
  "permissions": [
    "Skill(superpowers:brainstorming)",
    "Skill(ui-ux-pro-max)"
  ]
}
```

::: info Complete permission configuration
This is a minimal permission configuration example. Factory's `init` command will automatically generate a complete permission configuration file (including `Skill(superpowers:brainstorm)` and other necessary permissions), usually no manual editing required.

If you need to regenerate permission configuration, execute in project root:
```bash
factory init --force-permissions
```
:::

Refer to [Claude Code Integration Guide](../claude-code/) to regenerate permission configuration.

### ❌ Marketplace addition failed

**Symptom**: `claude plugin marketplace add` fails, prompting "not found" or network error.

**Solution**:

1. Check network connection
2. Confirm Claude CLI version is latest: `npm update -g @anthropic-ai/claude-code`
3. Try direct installation: Skip marketplace addition, directly execute `claude plugin install <plugin ID>`

### ❌ Plugin version conflict

**Symptom**: A plugin with the same name is installed, but the wrong version causes pipeline failure.

**Solution**:

```bash
# Uninstall old version
claude plugin uninstall <plugin name>

# Reinstall
claude plugin install <plugin ID>
```

### ❌ Windows path issues

**Symptom**: Prompted "command not found" when executing scripts on Windows.

**Solution**:

Use Node.js to directly run installation scripts:

```bash
node cli/scripts/check-and-install-superpowers.js
node cli/scripts/check-and-install-ui-skill.js
```

## Handling Automatic Installation Failures

If automatic installation during `factory init` fails, you can:

1. **View error message**: Terminal will display specific failure reason
2. **Manual installation**: Manually install both plugins according to the above steps
3. **Re-run**: `factory run` will detect plugin status, if installed continue pipeline

::: warning Doesn't affect pipeline startup
Even if plugin installation fails, `factory init` will still complete initialization. You can manually install plugins later without affecting subsequent operations.
:::

## Role of Plugins in the Pipeline

### Bootstrap Stage (requires superpowers)

- **Skill call**: `superpowers:brainstorm`
- **Output**: `input/idea.md` - Structured product idea document
- **Verification point**: Check if Agent explicitly states using this skill (`orchestrator.checkpoint.md:60-70`)

### UI Stage (requires ui-ux-pro-max)

- **Skill call**: `ui-ux-pro-max`
- **Output**: `artifacts/ui/ui.schema.yaml` - UI Schema containing design system
- **Verification point**: Check if design system configuration comes from this skill (`orchestrator.checkpoint.md:72-84`)

## Summary

- Factory depends on two required plugins: `superpowers` and `ui-ux-pro-max`
- `factory init` will automatically try to install, but needs manual handling if it fails
- Plugin installation process: check → add marketplace → install → verify
- Ensure both plugins are in `enabled` state, and permission configuration is correct
- Pipeline's Bootstrap and UI stages will enforce checking usage of these two plugins

## Next Up

> In the next lesson, we'll learn **[7-Stage Pipeline Overview](../../start/pipeline-overview/)**.
>
> You will learn:
> - Complete execution flow of the pipeline
> - Input, output, and responsibilities of each stage
> - How checkpoint mechanism ensures quality
> - How to recover from a failed stage

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Function | File Path | Lines |
| --- | --- | --- |
| Superpowers plugin check script | [`cli/scripts/check-and-install-superpowers.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-superpowers.js) | 1-208 |
| UI/UX Pro Max plugin check script | [`cli/scripts/check-and-install-ui-skill.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-ui-skill.js) | 1-209 |
| Automatic plugin installation logic | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 360-392 |
| Bootstrap stage skill verification | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 60-70 |
| UI stage skill verification | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 72-84 |

**Key constants**:
- `PLUGIN_NAME = 'superpowers'`: superpowers plugin name
- `PLUGIN_ID = 'superpowers@superpowers-marketplace'`: superpowers full ID
- `PLUGIN_MARKETPLACE = 'obra/superpowers-marketplace'`: plugin marketplace repository
- `UI_PLUGIN_NAME = 'ui-ux-pro-max'`: UI plugin name
- `UI_PLUGIN_ID = 'ui-ux-pro-max@ui-ux-pro-max-skill'`: UI plugin full ID
- `UI_PLUGIN_MARKETPLACE = 'nextlevelbuilder/ui-ux-pro-max-skill'`: UI plugin marketplace repository

**Key functions**:
- `isPluginInstalled()`: Check if plugin is installed (via `claude plugin list` output)
- `addToMarketplace()`: Add plugin to marketplace (`claude plugin marketplace add`)
- `installPlugin()`: Install plugin (`claude plugin install`)
- `verifyPlugin()`: Verify plugin is installed and enabled
- `main()`: Main function, executes complete check→add→install→verify process

</details>
