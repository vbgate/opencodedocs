---
title: "Skills Platform and ClawdHub: Extending AI Assistant Capabilities"
sidebarTitle: "Skills Platform"
subtitle: "Skills Platform and ClawdHub: Extending AI Assistant Capabilities"
description: "Learn Clawdbot's skill system architecture and the loading priority of Bundled, Managed, and Workspace skills. Install and update skills via ClawdHub, configure skill gating rules, and master environment variable injection."
tags:
  - "Skills System"
  - "ClawdHub"
  - "AI Extensions"
  - "Skills Configuration"
prerequisite:
  - "start-getting-start"
order: 280
---

# Skills Platform and ClawdHub: Extending AI Assistant Capabilities

## What You'll Learn

After completing this lesson, you will be able to:

- Understand Clawdbot's skill system architecture (Bundled, Managed, and Workspace skill types)
- Discover, install, and update skills from ClawdHub to extend AI assistant capabilities
- Configure skill enablement status, environment variables, and API keys
- Use skill gating rules to ensure skills load only when conditions are met
- Manage skill sharing and override priorities in multi-Agent scenarios

## Your Current Challenge

Clawdbot already provides rich built-in tools (browser, command execution, web search, etc.), but when you need to:

- Call third-party CLI tools (like `gemini`, `peekaboo`)
- Add domain-specific automation scripts
- Let AI learn to use your custom toolsets

You might wonder: "How do I tell AI which tools are available? Where should these tools be placed? Can multiple Agents share skills?"

Clawdbot's skill system is designed for exactly this: **declare skills via SKILL.md files, and Agents automatically load and use them**.

## When to Use This

- **When you need to extend AI capabilities**: You want to add new tools or automation workflows
- **When working with multi-Agent collaboration**: Different Agents need to share or exclusively use skills
- **When managing skill versions**: Install, update, and sync skills from ClawdHub
- **When implementing skill gating**: Ensure skills load only in specific environments (OS, binaries, configuration)

## 🎒 Prerequisites

Before starting, please confirm:

- [ ] Completed [Quick Start](../../start/getting-started/), Gateway is running normally
- [ ] Configured at least one AI model (Anthropic, OpenAI, Ollama, etc.)
- [ ] Understand basic command-line operations (`mkdir`, `cp`, `rm`)

## Core Concepts

### What Is a Skill?

A skill is a directory containing a `SKILL.md` file (instructions and tool definitions for the LLM), plus optional scripts or resources. The `SKILL.md` uses YAML frontmatter to define metadata and Markdown to describe skill usage.

Clawdbot is compatible with the [AgentSkills](https://agentskills.io) specification, allowing skills to be loaded by other tools that follow this specification.

#### Three Skill Loading Locations

Skills load from three locations, in priority order from highest to lowest:

1. **Workspace Skills**: `<workspace>/skills` (highest priority)
2. **Managed/Local Skills**: `~/.clawdbot/skills`
3. **Bundled Skills**: Provided with the installation package (lowest priority)

::: info Priority Rule
If skills with the same name exist in multiple locations, Workspace skills override Managed and Bundled skills.
:::

Additionally, you can configure extra skill directories via `skills.load.extraDirs` (lowest priority).

#### Skill Sharing in Multi-Agent Scenarios

In multi-Agent setups, each Agent has its own workspace:

- **Per-Agent Skills**: Located in `<workspace>/skills`, visible only to that Agent
- **Shared Skills**: Located in `~/.clawdbot/skills`, visible to all Agents on the same machine
- **Shared Folders**: Can be added via `skills.load.extraDirs` (lowest priority), for multiple Agents sharing the same skill package

The same priority rule applies for conflicts: Workspace > Managed > Bundled.

#### Skill Gating

Clawdbot filters skills during loading based on `metadata` fields, ensuring skills load only when conditions are met:

```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"clawdbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

Fields under `metadata.clawdbot`:

- `always: true`: Always load the skill (skip other gating)
- `emoji`: Emoji to display in macOS Skills UI
- `homepage`: Website link to display in macOS Skills UI
- `os`: Platform list (`darwin`, `linux`, `win32`), skill available only on these OSes
- `requires.bins`: List, each must exist in `PATH`
- `requires.anyBins`: List, at least one must exist in `PATH`
- `requires.env`: List, environment variables must exist or be provided in configuration
- `requires.config`: `clawdbot.json` path list, must be truthy
- `primaryEnv`: Environment variable name associated with `skills.entries.<name>.apiKey`
- `install`: Optional array of installer specifications (for macOS Skills UI)

::: warning Binary Checks in Sandbox Environments
`requires.bins` checks binaries on the **host** at skill loading time. If the Agent runs in a sandbox, the binaries must also exist inside the container.
Install dependencies via `agents.defaults.sandbox.docker.setupCommand`.
:::

### Environment Variable Injection

When an Agent run begins, Clawdbot:

1. Reads skill metadata
2. Applies any `skills.entries.<key>.env` or `skills.entries.<key>.apiKey` to `process.env`
3. Builds the system prompt using eligible skills
4. Restores the original environment after the Agent run finishes

This is **scoped to the Agent run**, not the global Shell environment.

## Follow Along

### Step 1: View Installed Skills

Use the CLI to list currently available skills:

```bash
clawdbot skills list
```

Or view only skills that meet eligibility criteria:

```bash
clawdbot skills list --eligible
```

**You should see**: A list of skills, including names, descriptions, and eligibility status (such as binaries, environment variables).

### Step 2: Install Skills from ClawdHub

ClawdHub is Clawdbot's public skill registry where you can browse, install, update, and publish skills.

#### Install CLI

Choose one method to install the ClawdHub CLI:

```bash
npm i -g clawdhub
```

Or

```bash
pnpm add -g clawdhub
```

#### Search Skills

```bash
clawdhub search "postgres backups"
```

#### Install Skill

```bash
clawdhub install <skill-slug>
```

By default, the CLI installs to the `./skills` subdirectory of the current working directory (or falls back to the configured Clawdbot workspace). Clawdbot will load it as `<workspace>/skills` in the next session.

**You should see**: Installation output showing the skill folder and version information.

### Step 3: Update Installed Skills

Update all installed skills:

```bash
clawdhub update --all
```

Or update a specific skill:

```bash
clawdhub update <slug>
```

**You should see**: Update status for each skill, including version changes.

### Step 4: Configure Skill Overrides

Configure skill enablement status, environment variables, etc., in `~/.clawdbot/clawdbot.json`:

```json5
{
  "skills": {
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": {
          "GEMINI_API_KEY": "GEMINI_KEY_HERE"
        },
        "config": {
          "endpoint": "https://example.invalid",
          "model": "nano-pro"
        }
      },
      "peekaboo": { "enabled": true },
      "sag": { "enabled": false }
    }
  }
}
```

**Rules**:

- `enabled: false`: Disable the skill, even if it's Bundled or installed
- `env`: Inject environment variables (only when the variable is not already set in the process)
- `apiKey`: Convenience field for skills that declare `metadata.clawdbot.primaryEnv`
- `config`: Optional custom field bundle, custom keys must be placed here

**You should see**: After saving the configuration, Clawdbot will apply these settings during the next Agent run.

### Step 5: Enable Skill Watcher (Optional)

By default, Clawdbot watches the skills folder and refreshes the skill snapshot when `SKILL.md` files change. You can configure this under `skills.load`:

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

**You should see**: After modifying skill files, there's no need to restart Gateway. Clawdbot will automatically refresh the skill list in the next Agent turn.

### Step 6: Debug Skill Issues

Check detailed information and missing dependencies for a skill:

```bash
clawdbot skills info <name>
```

Check dependency status for all skills:

```bash
clawdbot skills check
```

**You should see**: Detailed information for each skill, including binaries, environment variables, configuration status, and missing conditions.

## Checklist ✅

After completing the steps above, you should be able to:

- [ ] Use `clawdbot skills list` to view all available skills
- [ ] Install new skills from ClawdHub
- [ ] Update installed skills
- [ ] Configure skill overrides in `clawdbot.json`
- [ ] Use `skills check` to debug skill dependency issues

## Common Pitfalls

### Common Error 1: Skill Name Contains Hyphens

**Problem**: Using hyphenated skill names as keys in `skills.entries`

```json
// ❌ Wrong: Unquoted
{
  "skills": {
    "entries": {
      nano-banana-pro: { "enabled": true }  // JSON syntax error
    }
  }
}
```

**Fix**: Quote the key (JSON5 supports quoted keys)

```json
// ✅ Correct: Quoted
{
  "skills": {
    "entries": {
      "nano-banana-pro": { "enabled": true }
    }
  }
}
```

### Common Error 2: Environment Variables in Sandbox Environment

**Problem**: Skills run in a sandbox, but `skills.entries.<skill>.env` or `apiKey` doesn't take effect

**Reason**: Global `env` and `skills.entries.<skill>.env/apiKey` only apply to **host execution**. Sandboxes don't inherit the host's `process.env`.

**Fix**: Use one of the following approaches:

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "docker": {
          "env": {
            "GEMINI_API_KEY": "your_key_here"
          }
        }
      }
    }
  }
}
```

Or bake environment variables into a custom sandbox image.

### Common Error 3: Skills Not Displaying in List

**Problem**: Skills installed, but `clawdbot skills list` doesn't show them

**Possible Causes**:

1. Skills don't meet gating conditions (missing binaries, environment variables, configuration)
2. Skills are disabled (`enabled: false`)
3. Skills are not in directories scanned by Clawdbot

**Troubleshooting Steps**:

```bash
# Check skill dependencies
clawdbot skills check

# Check if skill directories are being scanned
ls -la ~/.clawdbot/skills/
ls -la <workspace>/skills/
```

### Common Error 4: Skill Confusion and Priority Confusion

**Problem**: Skills with the same name exist in multiple locations, which one loads?

**Remember the Priority**:

`<workspace>/skills` (highest) → `~/.clawdbot/skills` → bundled skills (lowest)

If you want to use the Bundled skill instead of the Workspace override:

1. Delete or rename `<workspace>/skills/<skill-name>`
2. Or disable the skill in `skills.entries`

## Lesson Summary

This lesson covered the core concepts of the Clawdbot skills platform:

- **Three Skill Types**: Bundled, Managed, and Workspace, loaded in priority order
- **ClawdHub Integration**: A public registry for searching, installing, updating, and publishing skills
- **Skill Gating**: Filter skills via the `requires` field in metadata
- **Configuration Overrides**: Control skill enablement, environment variables, and custom configuration in `clawdbot.json`
- **Skill Watcher**: Automatically refresh the skill list without restarting Gateway

The skill system is the core mechanism for extending Clawdbot capabilities. Mastering it allows your AI assistant to adapt to more scenarios and tools.

## Next Lesson Preview

> In the next lesson, we will learn **[Security and Sandbox Isolation](../security-sandbox/)**.
>
> You will learn:
> - Security model and permission control
> - Tool permission allowlist/denylist
> - Docker sandbox isolation mechanisms
> - Security configuration for remote Gateways

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature | File Path | Line Numbers |
| ----- | ----- | ----- |
| Skill Configuration Type Definitions | [`src/config/types.skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.skills.ts) | 1-32 |
| Skill System Documentation | [`docs/tools/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills.md) | 1-260 |
| Skill Configuration Reference | [`docs/tools/skills-config.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills-config.md) | 1-76 |
| ClawdHub Documentation | [`docs/tools/clawdhub.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/clawdhub.md) | 1-202 |
| Creating Skills Guide | [`docs/tools/creating-skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/creating-skills.md) | 1-42 |
| CLI Commands | [`docs/cli/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/skills.md) | 1-26 |

**Key Types**:

- `SkillConfig`: Configuration for a single skill (enabled, apiKey, env, config)
- `SkillsLoadConfig`: Skill loading configuration (extraDirs, watch, watchDebounceMs)
- `SkillsInstallConfig`: Skill installation configuration (preferBrew, nodeManager)
- `SkillsConfig`: Top-level skill configuration (allowBundled, load, install, entries)

**Bundled Skill Examples**:

- `skills/gemini/SKILL.md`: Gemini CLI skill
- `skills/peekaboo/SKILL.md`: Peekaboo macOS UI automation skill

</details>
