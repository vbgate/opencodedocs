---
title: "Quick Start: Query AI Quotas | opencode-mystatus"
sidebarTitle: "Quick Start"
subtitle: "Quick Start: Query All AI Platform Quotas with One Click"
description: "Learn to install opencode-mystatus and query AI platform quotas in 5 minutes. Three installation methods supported: AI-assisted, manual, and local file. Ready to query OpenAI, Zhipu AI, and other platforms immediately."
tags:
  - "Quick Start"
  - "Installation"
  - "Configuration"
order: 999
---

# Quick Start: Query All AI Platform Quotas with One Click

## What You'll Learn

- Install the opencode-mystatus plugin within 5 minutes
- Configure the slash command `/mystatus`
- Verify installation and query your first AI platform quota

## Your Current Pain Point

You're developing with multiple AI platforms (OpenAI, Zhipu AI, GitHub Copilot, Google Cloud, etc.) and need to check remaining quotas frequently throughout the day. Logging into each platform separately is time-consuming and inefficient.

## When to Use This

- **Getting Started with OpenCode**: As a beginner, this should be your first installed plugin
- **Multi-Platform Quota Management**: Using multiple platforms like OpenAI, Zhipu AI, GitHub Copilot simultaneously
- **Team Collaboration**: Team members sharing multiple AI accounts need unified quota viewing

## 🎒 Prerequisites

Before starting, please confirm you have:

::: info Prerequisites

- [ ] Installed [OpenCode](https://opencode.ai)
- [ ] Configured at least one AI platform authentication (OpenAI, Zhipu AI, Z.ai, GitHub Copilot, or Google Cloud)

:::

If you haven't configured any AI platform yet, we recommend completing at least one platform login in OpenCode before installing this plugin.

## Core Concept

opencode-mystatus is an OpenCode plugin whose core value is:

1. **Auto-Read Auth Files**: Reads all configured account information from OpenCode's official authentication storage
2. **Parallel Query**: Simultaneously calls official APIs for OpenAI, Zhipu AI, Z.ai, GitHub Copilot, and Google Cloud
3. **Visual Display**: Uses progress bars and countdowns to intuitively show remaining quotas

The installation process is simple:
1. Add plugin and slash command to OpenCode config file
2. Restart OpenCode
3. Input `/mystatus` to query quotas

## Follow Along

### Step 1: Choose Installation Method

opencode-mystatus provides three installation methods. Choose one based on your preference:

::: code-group

```bash [AI-Assisted Installation (Recommended)]
Paste the following into any AI agent (Claude Code, OpenCode, Cursor, etc.):

Install opencode-mystatus plugin by following: https://raw.githubusercontent.com/vbgate/opencode-mystatus/main/README.md
```

```bash [Manual Installation]
Open ~/.config/opencode/opencode.json and edit config as per Step 2
```

```bash [Install from Local Files]
Copy plugin files to ~/.config/opencode/plugin/ directory (see Step 4 for details)
```

:::

**Why AI-Assisted Installation is Recommended**: The AI agent will automatically execute all configuration steps. You just need to confirm—fastest and most hassle-free.

---

### Step 2: Manual Installation Configuration (Required for Manual Installation)

If you choose manual installation, you need to edit the OpenCode config file.

#### 2.1 Open Config File

```bash
# macOS/Linux
code ~/.config/opencode/opencode.json

# Windows
code %APPDATA%\opencode\opencode.json
```

#### 2.2 Add Plugin and Slash Command

Add the following content to the config file (keep existing `plugin` and `command` configs, append new items):

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool to query quota usage. Return the result as-is without modification."
    }
  }
}
```

**Why This Configuration**:

| Config Item | Value | Purpose |
| ----------- | ----- | ------- |
| `plugin` array | `["opencode-mystatus"]` | Tells OpenCode to load this plugin |
| `description` | "Query quota usage for all AI accounts" | Description shown in slash command list |
| `template` | "Use the mystatus tool..." | Prompts OpenCode how to call the mystatus tool |

**You Should See**: The config file contains complete `plugin` and `command` fields with correct format (pay attention to JSON commas and quotes).

---

### Step 3: Install from Local Files (Required for Local File Installation)

If you choose local file installation, you need to manually copy plugin files.

#### 3.1 Copy Plugin Files

```bash
# Assuming you've cloned opencode-mystatus source to ~/opencode-mystatus/

# Copy main plugin and library files
cp -r ~/opencode-mystatus/plugin/mystatus.ts ~/.config/opencode/plugin/
cp -r ~/opencode-mystatus/plugin/lib/ ~/.config/opencode/plugin/

# Copy slash command config
cp ~/opencode-mystatus/command/mystatus.md ~/.config/opencode/command/
```

**Why These Files Are Needed**:

- `mystatus.ts`: Main plugin entry file containing the mystatus tool definition
- `lib/` directory: Contains query logic for OpenAI, Zhipu AI, Z.ai, GitHub Copilot, and Google Cloud
- `mystatus.md`: Slash command configuration description

**You Should See**: Under `~/.config/opencode/plugin/` directory there's `mystatus.ts` and `lib/` subdirectory; under `~/.config/opencode/command/` directory there's `mystatus.md`.

---

### Step 4: Restart OpenCode

Whichever installation method you choose, the final step is to restart OpenCode.

**Why Restart is Required**: OpenCode only reads config files at startup. After modifying config, restart is required to take effect.

**You Should See**: After OpenCode restarts, it should work normally.

---

### Step 5: Verify Installation

Now verify that the installation was successful.

#### 5.1 Test Slash Command

In OpenCode, input:

```bash
/mystatus
```

**You Should See**:

If you've configured at least one AI platform authentication, you'll see output similar to this (using OpenAI as example):

::: code-group

```markdown [Chinese System Output]
## OpenAI 账号额度

Account:        user@example.com (team)

3小时限额
█████████████████████████ 剩余 85%
重置: 2h 30m后
```

```markdown [English System Output]
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
█████████████████████████ 85% remaining
Resets in: 2h 30m
```

:::

::: tip Output Language Note
The plugin automatically detects your system language (Chinese systems show Chinese, English systems show English). Both outputs above are correct.
:::

If no accounts are configured yet, you'll see:

::: code-group

```markdown [Chinese System Output]
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

```markdown [English System Output]
No configured accounts found.

Supported account types:
- OpenAI (Plus/Team/Pro subscribers)
- Zhipu AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

:::

#### 5.2 Understand Output Meaning

| Element (Chinese) | Element (English) | Meaning |
| ----------------- | ----------------- | ------- |
| `## OpenAI 账号额度` | `## OpenAI Account Quota` | Platform title |
| `user@example.com (team)` | `user@example.com (team)` | Account info (email or team) |
| `3小时限额` | `3-hour limit` | Limit type (3-hour limit) |
| `剩余 85%` | `85% remaining` | Remaining percentage |
| `重置: 2h 30m后` | `Resets in: 2h 30m` | Reset time countdown |

**Why API Key Isn't Fully Displayed**: To protect your privacy, the plugin automatically masks sensitive data (e.g., `9c89****AQVM`).

## Checkpoint ✅

Confirm you've completed the following steps:

| Step | Check Method | Expected Result |
| ---- | ------------ | --------------- |
| Install plugin | Check `~/.config/opencode/opencode.json` | `plugin` array contains `"opencode-mystatus"` |
| Configure slash command | Check same file | `command` object contains `mystatus` config |
| Restart OpenCode | Check OpenCode process | Restarted |
| Test command | Input `/mystatus` | Shows quota info or "No configured accounts found" |

## Common Pitfalls

### Common Error 1: JSON Format Error

**Symptom**: OpenCode fails to start with JSON format error message

**Cause**: Extra or missing commas, quotes in config file

**Solution**:

Use an online JSON validator to check format, for example:

```json
// ❌ Wrong: Extra comma after last item
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }  // ← No comma should be here
}

// ✅ Correct
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }
}
```

---

### Common Error 2: Forgot to Restart OpenCode

**Symptom**: After completing config, input `/mystatus` and get "Command not found" error

**Cause**: OpenCode hasn't reloaded the config file

**Solution**:

1. Completely quit OpenCode (not minimize)
2. Restart OpenCode
3. Try `/mystatus` command again

---

### Common Error 3: Shows "No configured accounts found"

**Symptom**: After running `/mystatus`, shows "No configured accounts found"

**Cause**: Haven't logged into any AI platform in OpenCode yet

**Solution**:

1. Log into at least one AI platform in OpenCode (OpenAI, Zhipu AI, Z.ai, GitHub Copilot, or Google Cloud)
2. Authentication info will be automatically saved to `~/.local/share/opencode/auth.json`
3. Run `/mystatus` again

---

### Common Error 4: Google Cloud Quota Query Fails

**Symptom**: Other platforms work fine, but Google Cloud shows error

**Cause**: Google Cloud requires additional authentication plugin

**Solution**:

First install [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) plugin to complete Google account authentication.

## Summary

This lesson covered opencode-mystatus installation and initial verification:

1. **Three Installation Methods**: AI-assisted installation (recommended), manual installation, local file installation
2. **Config File Location**: `~/.config/opencode/opencode.json`
3. **Key Config Items**:
   - `plugin` array: Add `"opencode-mystatus"`
   - `command` object: Configure `mystatus` slash command
4. **Verification Method**: After restarting OpenCode, input `/mystatus`
5. **Auto-Read Auth**: Plugin automatically reads configured account info from `~/.local/share/opencode/auth.json`

After installation, you can use the `/mystatus` command or natural language in OpenCode to query all AI platform quotas.

## Next Lesson Preview

> In the next lesson, we'll learn **[Using mystatus: Slash Commands and Natural Language](/vbgate/opencode-mystatus/start/using-mystatus/)**.
>
> You'll learn:
> - Detailed usage of slash command `/mystatus`
> - How to trigger mystatus tool with natural language
> - Differences and use cases between both trigger methods
> - Slash command configuration principles

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Line Numbers |
| --- | --- | --- |
| Plugin entry | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 26-94 |
| mystatus tool definition | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| Read auth file | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 35-46 |
| Parallel query all platforms | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| Result collection and summary | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| Slash command config | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |

**Key Constants**:
- Auth file path: `~/.local/share/opencode/auth.json` (`plugin/mystatus.ts:35`)

**Key Functions**:
- `mystatus()`: Main function of mystatus tool, reads auth file and queries all platforms in parallel (`plugin/mystatus.ts:29-33`)
- `collectResult()`: Collects query results into results and errors arrays (`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()`: Queries OpenAI quota (`plugin/lib/openai.ts`)
- `queryZhipuUsage()`: Queries Zhipu AI quota (`plugin/lib/zhipu.ts`)
- `queryZaiUsage()`: Queries Z.ai quota (`plugin/lib/zhipu.ts`)
- `queryGoogleUsage()`: Queries Google Cloud quota (`plugin/lib/google.ts`)
- `queryCopilotUsage()`: Queries GitHub Copilot quota (`plugin/lib/copilot.ts`)

**Config File Format**:
For plugin and slash command configuration in OpenCode config file `~/.config/opencode/opencode.json`, refer to [`README.zh-CN.md`](https://github.com/vbgate/opencode-mystatus/blob/main/README.zh-CN.md#安装) lines 33-82.

</details>
