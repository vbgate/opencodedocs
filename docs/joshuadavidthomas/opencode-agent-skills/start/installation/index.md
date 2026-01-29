---
title: "Installation: Setup Guide | OpenCode Agent Skills"
subtitle: "Install OpenCode Agent Skills"
sidebarTitle: "Installation"
description: "Learn how to install the Agent Skills plugin for OpenCode. This tutorial covers three installation methods: basic installation, pinned version installation, and local development installation."
tags:
  - "Installation"
  - "Plugin"
  - "Quick Start"
prerequisite: []
order: 2
---

# Install OpenCode Agent Skills

## What You'll Learn

- Install the Agent Skills plugin for OpenCode using three different methods
- Verify that the plugin is correctly installed
- Understand the difference between pinned versions and latest versions

## Your Current Challenge

You want your AI Agent to learn reusable skills, but you don't know how to enable this feature in OpenCode. OpenCode's plugin system seems a bit complex, and you're worried about configuration errors.

## When to Use This

**When you need your AI Agent to have the following capabilities**:
- Reuse skills across different projects (such as code standards, test templates)
- Load Claude Code's skill library
- Let AI follow specific workflows

## 🎒 Prerequisites

::: warning Prerequisites

Before starting, please confirm:

- [OpenCode](https://opencode.ai/) v1.0.110 or higher is installed
- You can access the `~/.config/opencode/opencode.json` configuration file (OpenCode's configuration file)

:::

## Core Concept

OpenCode Agent Skills is a plugin published through npm. Installation is simple: declare the plugin name in the configuration file, and OpenCode will automatically download and load it on startup.

**Use cases for the three installation methods**:

| Method | Use Case | Pros & Cons |
|--- | --- | ---|
| **Basic Installation** | Always use the latest version on startup | ✅ Convenient automatic updates<br>❌ May encounter breaking changes |
| **Pinned Version** | Need a stable production environment | ✅ Version control<br>❌ Manual upgrades required |
| **Local Development** | Custom plugins or contributing code | ✅ Flexible modifications<br>❌ Manual dependency management |

---

## Follow Along

### Method 1: Basic Installation (Recommended)

This is the simplest method—OpenCode will check and download the latest version every time it starts.

**Why**
Suitable for most users, ensuring you always have the latest features and bug fixes.

**Steps**

1. Open the OpenCode configuration file

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json

# Windows (using Notepad)
notepad %APPDATA%\opencode\opencode.json
```

2. Add the plugin name to the configuration file

```json
{
  "plugin": ["opencode-agent-skills"]
}
```

If there are already other plugins in the file, add it to the `plugin` array:

```json
{
  "plugin": ["other-plugin", "opencode-agent-skills"]
}
```

3. Save the file and restart OpenCode

**You should see**:
- OpenCode restarts, and you see successful plugin loading in the startup logs
- You can use tools like `get_available_skills` in AI conversations

### Method 2: Pinned Version Installation (For Production)

If you want to lock the plugin version to avoid surprises from automatic updates, use this method.

**Why**
Production environments typically require version control. Pinning a version ensures your team uses the same plugin version.

**Steps**

1. Open the OpenCode configuration file

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json
```

2. Add the plugin name with a version number to the configuration file

```json
{
  "plugin": ["opencode-agent-skills@0.6.4"]
}
```

3. Save the file and restart OpenCode

**You should see**:
- OpenCode starts with the pinned version v0.6.4
- The plugin is cached locally, no need to download each time

::: tip Version Management

Pinned version plugins are cached locally in OpenCode. To upgrade, manually modify the version number and restart. Check [latest version](https://www.npmjs.com/package/opencode-agent-skills) for updates.

:::

### Method 3: Local Development Installation (For Contributors)

If you want to customize the plugin or contribute to development, use this method.

**Why**
During development, you can immediately see the effects of code changes without waiting for npm publishing.

**Steps**

1. Clone the repository to the OpenCode configuration directory

```bash
git clone https://github.com/joshuadavidthomas/opencode-agent-skills ~/.config/opencode/opencode-agent-skills
```

2. Enter the project directory and install dependencies

```bash
cd ~/.config/opencode/opencode-agent-skills
bun install
```

::: info Why Bun

The project uses Bun as the runtime and package manager. According to the `engines` field in package.json, Bun >= 1.0.0 is required.

:::

3. Create a plugin symbolic link

```bash
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/opencode-agent-skills/src/plugin.ts ~/.config/opencode/plugin/skills.ts
```

**You should see**:
- `~/.config/opencode/plugin/skills.ts` points to your local plugin code
- After modifying the code, restart OpenCode for changes to take effect

---

## Checkpoint ✅

After installation, verify using the following methods:

**Method 1: View Tool List**

Ask the AI in OpenCode:

```
Please list all available tools and see if there are any skill-related tools?
```

You should see tools including:
- `use_skill` - Load a skill
- `read_skill_file` - Read a skill file
- `run_skill_script` - Execute a skill script
- `get_available_skills` - Get the list of available skills

**Method 2: Call a Tool**

```
Please call get_available_skills to see which skills are currently available?
```

You should see a list of skills (possibly empty, but the tool call was successful).

**Method 3: View Startup Logs**

Check OpenCode's startup logs, you should see something like:

```
[plugin] Loaded plugin: opencode-agent-skills
```

---

## Common Pitfalls

### Issue 1: Tools don't appear after OpenCode starts

**Possible causes**:
- Configuration file JSON format error (missing commas, quotes, etc.)
- OpenCode version is too low (requires >= v1.0.110)
- Plugin name spelling error

**Solutions**:
1. Use a JSON validation tool to check the configuration file syntax
2. Run `opencode --version` to confirm the version
3. Confirm the plugin name is `opencode-agent-skills` (note the hyphens)

### Issue 2: Pinned version upgrade doesn't take effect

**Cause**: Pinned version plugins are cached locally. After updating the version number, the cache needs to be cleared.

**Solutions**:
1. Modify the version number in the configuration file
2. Restart OpenCode
3. If it still doesn't take effect, clear the OpenCode plugin cache (location depends on your system)

### Issue 3: Local development installation changes don't take effect

**Cause**: Symbolic link error or Bun dependencies not installed.

**Solutions**:
1. Check if the symbolic link is correct:
   ```bash
   ls -la ~/.config/opencode/plugin/skills.ts
   ```
   Should point to `~/.config/opencode/opencode-agent-skills/src/plugin.ts`

2. Confirm dependencies are installed:
   ```bash
   cd ~/.config/opencode/opencode-agent-skills
   bun install
   ```

---

## Summary

This lesson covered three installation methods:

- **Basic Installation**: Add `opencode-agent-skills` to the configuration file, suitable for most people
- **Pinned Version Installation**: Add `opencode-agent-skills@version`, suitable for production environments
- **Local Development Installation**: Clone the repository and create a symbolic link, suitable for developers

After installation, you can verify through the tool list, tool calls, or startup logs.

---

## Next Up

> In the next lesson, we'll learn **[Creating Your First Skill](../creating-your-first-skill/)**.
>
> You'll learn:
> - Skill directory structure
> - YAML frontmatter format in SKILL.md
> - How to write skill content

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line |
|--- | --- | ---|
| Plugin entry definition | [`package.json:18`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L18) | 18 |
| Plugin main file | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts) | Full file |
| Dependency configuration | [`package.json:27-32`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L27-L32) | 27-32 |
| Version requirements | [`package.json:39-41`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L39-L41) | 39-41 |

**Key Configuration**:
- `main: "src/plugin.ts"`: Plugin entry file
- `engines.bun: ">=1.0.0"`: Runtime version requirement

**Key Dependencies**:
- `@opencode-ai/plugin ^1.0.115`: OpenCode Plugin SDK
- `@huggingface/transformers ^3.8.1`: Semantic matching model
- `zod ^4.1.13`: Schema validation
- `yaml ^2.8.2`: YAML parsing

</details>
