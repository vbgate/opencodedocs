---
title: "Usage: Query AI Quota | opencode-mystatus"
sidebarTitle: "Usage"
subtitle: "Using mystatus: Slash Commands and Natural Language"
description: "Learn how to use opencode-mystatus to query AI quotas. Supports slash commands and natural language queries for OpenAI, Zhipu AI, Z.ai, GitHub Copilot, and Google Cloud with real-time progress bars."
tags:
  - "Quick Start"
  - "Slash Commands"
  - "Natural Language"
prerequisite:
  - "start-quick-start"
order: 999
---
# Using mystatus: Slash Commands and Natural Language

## What You'll Learn

- Use the `/mystatus` slash command to query all AI platform quotas in one click
- Use natural language queries to let OpenCode automatically invoke the mystatus tool
- Understand the differences and use cases for slash commands vs natural language

## Your Current Challenge

You're developing with multiple AI platforms (OpenAI, Zhipu AI, GitHub Copilot, etc.) and want to know how much quota you have left on each platform, but logging into each platform individually to check is too cumbersome.

## When to Use This

- **When you need a quick overview of all platform quotas**: Check before daily development to plan usage wisely
- **When you want to check a specific platform's quota**: For example, confirming if OpenAI is running low
- **When verifying configuration**: After setting up a new account, confirm it can be queried correctly

::: info Prerequisites

This tutorial assumes you have completed the [opencode-mystatus plugin installation](/vbgate/opencode-mystatus/start/quick-start/). If not, please complete the installation steps first.

:::

## Core Concept

opencode-mystatus provides two ways to trigger the mystatus tool:

1. **Slash command `/mystatus`**: Fast, direct, unambiguous—ideal for frequent queries
2. **Natural language queries**: More flexible—suited for context-specific queries

Both methods invoke the same `mystatus` tool, which queries all configured AI platforms in parallel and returns results with progress bars, usage statistics, and reset countdowns.

## Follow Along

### Step 1: Query Quota Using Slash Command

Enter the following command in OpenCode:

```bash
/mystatus
```

**Why**
Slash commands are OpenCode's shortcut mechanism for quickly invoking predefined tools. The `/mystatus` command directly invokes the mystatus tool with no additional parameters required.

**You should see**:
OpenCode returns quota information for all configured platforms, formatted as follows:

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Reset: 2h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Reset: 4h
```

Each platform displays:
- Account information (email or masked API key)
- Progress bar (visualizing remaining quota)
- Reset countdown
- Used and total usage (for some platforms)
### Step 2: Query Using Natural Language

Besides slash commands, you can also use natural language to ask questions. OpenCode will automatically recognize your intent and invoke the mystatus tool.

Try these query formats:

```bash
Check my OpenAI quota
```

Or

```bash
How much Codex quota do I have left?
```

Or

```bash
Show my AI account status
```

**Why**
Natural language queries feel more like everyday conversation and fit naturally into specific development contexts. OpenCode uses semantic matching to identify that you want to check quota and automatically invokes the mystatus tool.

**You should see**:
The same output as the slash command—just a different trigger method.

### Step 3: Understand Slash Command Configuration

How does the slash command `/mystatus` work? It's defined in your OpenCode configuration file.

Open `~/.config/opencode/opencode.json` and find the `command` section:

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

**Key Configuration Explained**:

| Config | Value | Purpose |
|--- | --- | ---|
| `description` | "Query quota usage for all AI accounts" | Description shown in the command list |
| `template` | "Use the mystatus tool..." | Instructs OpenCode how to handle this command |

**Why template is needed**
The template is an "instruction" for OpenCode, telling it: when the user inputs `/mystatus`, invoke the mystatus tool and return the result as-is without any modifications.
## Checkpoint ✅

Confirm you've mastered both usage methods:

| Skill | How to Check | Expected Result |
|--- | --- | ---|
| Slash command query | Input `/mystatus` | Displays quota information for all platforms |
| Natural language query | Input "Check my OpenAI quota" | Displays quota information |
| Understand configuration | View opencode.json | Find the mystatus command configuration |

## Common Pitfalls

### Common Error 1: Slash Command No Response

**Symptom**: No response after entering `/mystatus`

**Cause**: OpenCode configuration file doesn't have the slash command properly configured

**Solution**:
1. Open `~/.config/opencode/opencode.json`
2. Confirm the `command` section includes `mystatus` configuration (see Step 3)
3. Restart OpenCode

### Common Error 2: Natural Language Query Doesn't Invoke mystatus Tool

**Symptom**: After entering "Check my OpenAI quota", OpenCode doesn't invoke the mystatus tool and tries to answer itself

**Cause**: OpenCode didn't correctly recognize your intent

**Solution**:
1. Try a more explicit phrasing: "Use mystatus tool to check my OpenAI quota"
2. Or use the slash command `/mystatus` directly—more reliable

### Common Error 3: Shows "No Configured Accounts Found"

**Symptom**: After executing `/mystatus`, displays "No configured accounts found"

**Cause**: No platform authentication information has been configured

**Solution**:
- Configure at least one platform's authentication (OpenAI, Zhipu AI, Z.ai, GitHub Copilot, or Google Cloud)
- See the configuration instructions in the [Quick Start tutorial](/vbgate/opencode-mystatus/start/quick-start/)
## Summary

The mystatus tool provides two usage methods:
1. **Slash command `/mystatus`**: Fast and direct—ideal for frequent queries
2. **Natural language queries**: More flexible—suited for specific contexts

Both methods query all configured AI platforms in parallel and return results with progress bars and reset countdowns. The slash command is defined in `~/.config/opencode/opencode.json` and uses the template to instruct OpenCode how to invoke the mystatus tool.

## Next Up

> In the next lesson, we'll learn **[Understanding Output: Progress Bars, Reset Times, and Multiple Accounts](/vbgate/opencode-mystatus/start/understanding-output/)**.
>
> You'll learn:
> - How to interpret progress bar meanings
> - How reset countdowns are calculated
> - Output format in multi-account scenarios
> - Progress bar generation principles

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| mystatus tool definition | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| Tool description | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 30-31 |
| Slash command configuration | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |
| Parallel query all platforms | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| Result collection and aggregation | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |

**Key Constants**:
None (this section mainly covers invocation methods, not specific constants)

**Key Functions**:
- `mystatus()`: Main function of the mystatus tool, reads auth files and queries all platforms in parallel (`plugin/mystatus.ts:29-33`)
- `collectResult()`: Collects query results into results and errors arrays (`plugin/mystatus.ts:100-116`)

</details>
