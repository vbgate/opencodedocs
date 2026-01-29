---
title: "Getting Started: Install & Config | opencode-supermemory"
sidebarTitle: "Getting Started"
subtitle: "Getting Started: Installation & Configuration"
description: "Learn to install opencode-supermemory, configure API Key, and resolve conflicts to give your Agent persistent memory."
tags:
  - "Installation"
  - "Configuration"
  - "Getting Started"
prerequisite:
  - ""
order: 1
---

# Getting Started: Installation & Configuration

## What You'll Learn

In this lesson, you will learn how to:
1.  Install the **opencode-supermemory** plugin into your OpenCode environment.
2.  Configure the Supermemory API Key to connect to the cloud memory bank.
3.  Verify that the plugin is successfully loaded.
4.  Resolve potential conflicts with other plugins (such as Oh My OpenCode).

Upon completion, your Agent will have the basic capability to connect to the cloud memory bank.

## The Current Dilemma

You may have noticed that while OpenCode's Agent is smart, it is very forgetful:
- Every time you start a new session, it's like it has amnesia and doesn't remember your previous preferences.
- You taught it architectural standards in Project A, but it forgot them in Project B.
- In long sessions, key information from the beginning gets "pushed" out of context.

You need an external brain to help the Agent remember these things.

## When to Use This

- **First Time Use**: When you are new to opencode-supermemory.
- **Environment Reinstall**: When you migrate to a new computer or reset your OpenCode configuration.
- **Troubleshooting**: When you suspect the plugin isn't installed correctly or there are API connection issues.

---

## 🎒 Preparation

Before you begin, please ensure you have:

1.  **Installed OpenCode**: Make sure the `opencode` command is available in your terminal.
2.  **Obtained an API Key**:
    - Visit [Supermemory Console](https://console.supermemory.ai)
    - Register/Log in
    - Create a new API Key (starts with `sm_`)

::: info What is Supermemory?
Supermemory is a cloud memory layer designed specifically for AI Agents. It not only stores data but also helps the Agent recall the right things at the right time through semantic search.
:::

---

## Core Concept

The installation process is very simple, essentially consisting of three steps:

1.  **Install Plugin**: Run the installation script to register the plugin with OpenCode.
2.  **Configure Key**: Tell the plugin what your API Key is.
3.  **Verify Connection**: Restart OpenCode and confirm the Agent can see the new tool.

---

## Follow Along

### Step 1: Install Plugin

We provide two installation methods; choose the one that suits you.

::: code-group

```bash [I am Human (Interactive)]
# Recommended: Includes interactive guidance to handle configuration automatically
bunx opencode-supermemory@latest install
```

```bash [I am Agent (Automatic)]
# If you are asking an Agent to install it for you, use this command (skips interactive confirmation and automatically resolves conflicts)
bunx opencode-supermemory@latest install --no-tui --disable-context-recovery
```

:::

**What You Should See**:
The terminal outputs `✓ Setup complete!`, indicating the plugin has been successfully registered to `~/.config/opencode/opencode.jsonc`.

### Step 2: Configure API Key

The plugin needs an API Key to read and write your cloud memories. You have two configuration methods:

#### Method A: Environment Variable (Recommended)

Add directly to your Shell configuration file (e.g., `.zshrc` or `.bashrc`):

```bash
export SUPERMEMORY_API_KEY="sm_your_key..."
```

#### Method B: Configuration File

Alternatively, create a dedicated configuration file `~/.config/opencode/supermemory.jsonc`:

```json
{
  "apiKey": "sm_your_key..."
}
```

**Why**: Environment variables are more secure and won't be accidentally committed to code repositories; configuration files are more convenient for managing multiple settings.

### Step 3: Resolve Conflicts (If using Oh My OpenCode)

If you have installed [Oh My OpenCode](https://github.com/code-yeongyu/oh-my-opencode), its built-in context management feature might conflict with Supermemory.

**How to Check**:
The installation script usually detects and prompts you to disable conflicting hooks automatically. If not, please manually check `~/.config/opencode/oh-my-opencode.json`:

```json
{
  "disabled_hooks": [
    "anthropic-context-window-limit-recovery"  // ✅ Ensure this line exists
  ]
}
```

**Why**: Supermemory provides smarter "Preemptive Compaction". If two plugins try to manage context simultaneously, it will cause chaos.

### Step 4: Verify Installation

Restart OpenCode, then run the check command:

```bash
opencode -c
```

Or enter OpenCode interactive mode directly and view the tool list.

**What You Should See**:
In the Available Tools list, the `supermemory` tool appears.

```
Available Tools:
- supermemory (add, search, profile, list, forget)
...
```

---

## Checkpoint ✅

Please self-check the following items to ensure everything is ready:

- [ ] Run `cat ~/.config/opencode/opencode.jsonc` and see `"opencode-supermemory"` in the `plugin` list.
- [ ] The environment variable `SUPERMEMORY_API_KEY` is effective (check with `echo $SUPERMEMORY_API_KEY`).
- [ ] After running `opencode`, the Agent shows no error messages.

---

## Pitfalls to Avoid

::: warning Common Error: API Key Not Effective
If you set the environment variable but the plugin reports unauthenticated, please check:
1. Did you restart the terminal? (After modifying `.zshrc`, you need to `source ~/.zshrc` or restart)
2. Did you restart OpenCode? (The OpenCode process needs a restart to read new variables)
:::

::: warning Common Error: JSON Format Error
If you manually modify `opencode.jsonc`, please ensure the JSON format is correct (especially commas). The installation script handles this automatically, but manual modification is prone to errors.
:::

---

## Summary

Congratulations! You have successfully installed a "hippocampus" for OpenCode. Now, your Agent is ready to start remembering.

- We installed the `opencode-supermemory` plugin.
- We configured the cloud connection credentials.
- We ruled out potential plugin conflicts.

## What's Next

> Next, we will learn about **[Project Initialization: Making a First Impression](../initialization/index.md)**.
>
> You will learn:
> - How to use a single command to let the Agent deeply scan the entire project.
> - How to let the Agent remember the project's architecture, tech stack, and implicit rules.
> - How to view what the Agent has actually remembered.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source location</strong></summary>

> Last Updated: 2026-01-23

| Feature | File Path | Line Number |
|--- | --- | ---|
| Installation Script Logic | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L327-L410) | 327-410 |
| Plugin Registration Logic | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L195-L248) | 195-248 |
| Conflict Detection Logic | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L273-L320) | 273-320 |
| Config File Loading | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts) | - |

</details>
