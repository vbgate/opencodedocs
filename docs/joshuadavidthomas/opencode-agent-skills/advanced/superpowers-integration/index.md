---
title: "Superpowers Integration"
subtitle: "Superpowers Integration"
sidebarTitle: "Superpowers Integration"
description: "Learn to configure Superpowers mode for continuous AI workflow guidance."
tags:
  - "Advanced Configuration"
  - "Workflow"
  - "Superpowers"
prerequisite:
  - "/joshuadavidthomas/opencode-agent-skills/start-installation"
order: 2
---

# Superpowers Workflow Integration

## What You'll Learn

- Understand the value and use cases of Superpowers workflow
- Correctly install and configure Superpowers mode
- Understand tool mapping and skill namespace system
- Master the automatic injection mechanism for Superpowers during compaction recovery

## Your Current Struggle

You may be considering these issues:

- **Inconsistent development workflow**: Team members have different development habits, leading to inconsistent code quality
- **Lack of strict process**: Although you have a skill library, the AI assistant lacks clear process guidance
- **Confused tool invocation**: Tools defined by Superpowers have different names than OpenCode's native tools, causing invocation failures
- **High migration cost**: You're already using Superpowers and worry about needing to reconfigure after switching to OpenCode

These issues affect development efficiency and code quality.

## Core Concept

::: info What is Superpowers?
Superpowers is a complete software development workflow framework that provides strict workflow guidance through composable skills. It defines standardized development steps, tool invocation methods, and a namespace system.
:::

**OpenCode Agent Skills provides seamless Superpowers integration**. When enabled via environment variables, it automatically injects complete workflow guidance, including:

1. **using-superpowers skill content**: Superpowers core workflow instructions
2. **Tool mapping**: Maps tool names defined by Superpowers to OpenCode native tools
3. **Skill namespace**: Clearly defines skill priority and reference methods

## 🎒 Prerequisites

Before starting, ensure:

::: warning Prerequisite Check
- ✅ [opencode-agent-skills plugin installed](../../start/installation/)
- ✅ Familiar with basic skill discovery mechanism
:::

## Follow Along

### Step 1: Install Superpowers

**Why**
You need to install the Superpowers project first so that this plugin can discover the `using-superpowers` skill.

**How**

Choose one of the following installation methods based on your needs:

::: code-group

```bash [As a Claude Code plugin]
// Install following Superpowers official documentation
// https://github.com/obra/superpowers
// Skills will be automatically located at ~/.claude/plugins/...
```

```bash [As an OpenCode skill]
// Manually install as an OpenCode skill
mkdir -p ~/.config/opencode/skills
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
// Skills will be located at .opencode/skills/superpowers/ (project-level) or ~/.config/opencode/skills/superpowers/ (user-level)
```

:::

**You should see**:
- After installation, the Superpowers skill directory contains the `using-superpowers/SKILL.md` file

### Step 2: Enable Superpowers Mode

**Why**
Tell the plugin to enable Superpowers mode through environment variables, and the plugin will automatically inject relevant content during session initialization.

**How**

Temporary enable (current terminal session only):

```bash
export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true
opencode
```

Permanent enable (add to Shell configuration file):

::: code-group

```bash [Bash (~/.bashrc or ~/.bash_profile)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.bashrc
source ~/.bashrc
```

```zsh [Zsh (~/.zshrc)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.zshrc
source ~/.zshrc
```

```powershell [PowerShell (~/.config/powershell/Microsoft.PowerShell_profile.ps1)]
[System.Environment]::SetEnvironmentVariable('OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE', 'true', 'User')
```

:::

**You should see**:
- Input `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` displays `true`

### Step 3: Verify Automatic Injection

**Why**
Confirm that the plugin correctly identifies Superpowers skills and automatically injects content when starting a new session.

**How**

1. Restart OpenCode
2. Create a new session
3. Enter any message in the new session (e.g., "Hello")
4. Check session context (if OpenCode supports it)

**You should see**:
- The plugin automatically injected the following content in the background (formatted as XML):

```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - do not call use_skill for it again. Use use_skill only for OTHER skills.**

[Actual content of using-superpowers skill...]

**Tool Mapping for OpenCode:**
- `TodoWrite` → `todowrite`
- `Task` tool with subagents → Use `task` tool with `subagent_type`
- `Skill` tool → `use_skill`
- `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebFetch` → Use native lowercase OpenCode tools

**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
</EXTREMELY_IMPORTANT>
```

## Checkpoint ✅

After completing the above steps, verify the following:

| Check Item | Expected Result |
|--- | ---|
| Environment variable set correctly | `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` outputs `true` |
| Superpowers skill discoverable | Calling `get_available_skills()` shows `using-superpowers` |
| New session auto-injects | After creating a new session, the AI knows it has superpowers |

## Common Pitfalls

### ❌ Error 1: Skill Not Discovered

**Symptom**: Environment variable is enabled, but the plugin doesn't inject Superpowers content.

**Cause**: Superpowers is not installed in a skill discovery path.

**Solution**:
- Confirm Superpowers is installed in one of the following locations:
  - `.claude/plugins/...` (Claude Code plugin cache)
  - `.opencode/skills/...` (OpenCode skills directory)
  - `~/.config/opencode/skills/...` (OpenCode user skills)
  - `~/.claude/skills/...` (Claude user skills)
- Run `get_available_skills()` to verify that `using-superpowers` is in the list

### ❌ Error 2: Tool Invocation Fails

**Symptom**: The AI attempts to invoke `TodoWrite` or `Skill` tools, but the tools don't exist.

**Cause**: The AI didn't apply tool mapping and is still using names defined by Superpowers.

**Solution**:
- The plugin automatically injects tool mapping. Ensure the `<EXTREMELY_IMPORTANT>` tag is correctly injected
- If the problem persists, check whether the session was created after enabling the environment variable

### ❌ Error 3: Superpowers Disappears After Compaction

**Symptom**: After a long session, the AI no longer follows the Superpowers workflow.

**Cause**: Context compression cleared previously injected content.

**Solution**:
- The plugin will automatically re-inject Superpowers content after the `session.compacted` event
- If the problem persists, check whether the plugin is properly listening to events

## Tool Mapping Details

The plugin automatically injects the following tool mappings to help the AI correctly invoke OpenCode tools:

| Superpowers Tool | OpenCode Tool | Description |
|--- | --- | ---|
| `TodoWrite` | `todowrite` | Todo write tool |
| `Task` (with subagents) | `task` + `subagent_type` | Subagent invocation |
| `Skill` | `use_skill` | Load skill |
| `Read` / `Write` / `Edit` | Native lowercase tools | File operations |
| `Bash` / `Glob` / `Grep` / `WebFetch` | Native lowercase tools | System operations |

::: tip Why do we need tool mapping?
Superpowers is natively designed based on Claude Code, and tool names are inconsistent with OpenCode. Through automatic mapping, the AI can seamlessly use OpenCode's native tools without manual conversion.
:::

## Skill Namespace Priority

When skills with the same name exist from multiple sources, the plugin selects them in the following priority order:

```
1. project:skill-name         (Project-level OpenCode skills)
2. claude-project:skill-name  (Project-level Claude skills)
3. skill-name                (User-level OpenCode skills)
4. claude-user:skill-name    (User-level Claude skills)
5. claude-plugins:skill-name (Plugin marketplace skills)
```

::: info Namespace Reference
You can explicitly specify a namespace: `use_skill("project:my-skill")`  
Or let the plugin automatically match: `use_skill("my-skill")`
:::

**The first discovered match takes effect**, and subsequent same-name skills are ignored. This allows project-level skills to override user-level skills.

## Compaction Recovery Mechanism

In long sessions, OpenCode performs context compression to save tokens. The plugin ensures Superpowers remains available through the following mechanism:

1. **Listen to events**: The plugin listens for the `session.compacted` event
2. **Re-inject**: After compression completes, automatically re-inject Superpowers content
3. **Seamless transition**: AI's workflow guidance always exists and won't be interrupted by compression

## Summary

Superpowers integration provides strict workflow guidance. Key points:

- **Install Superpowers**: Choose either Claude Code plugin or OpenCode skill installation
- **Enable environment variable**: Set `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`
- **Auto-inject**: Plugin automatically injects content during session initialization and after compression
- **Tool mapping**: Automatically maps Superpowers tool names to OpenCode native tools
- **Namespace priority**: Project-level skills take priority over user-level skills

## Preview: Next Lesson

> In the next lesson, we'll learn **[Namespaces and Skill Priority](../namespaces-and-priority/)**.
>
> You will learn:
> - Understand the skill namespace system and discovery priority rules
> - Master how to use namespaces to explicitly specify skill sources
> - Learn about override and conflict handling mechanisms for same-name skills

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function | File Path | Line |
|--- | --- | ---|
| Superpowers integration module | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L1-L59) | 1-59 |
| Tool mapping definition | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L12-L16) | 12-16 |
| Skill namespace definition | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |
| Superpowers content injection function | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L31-L58) | 31-58 |
| Environment variable check | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L37) | 37 |
| Session initialization injection call | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L101) | 101 |
| Re-inject after compaction | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L148) | 148 |

**Key Constants**:
- `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE`: Environment variable, set to `'true'` to enable Superpowers mode

**Key Functions**:
- `maybeInjectSuperpowersBootstrap()`: Checks environment variables and skill existence, injects Superpowers content
- `discoverAllSkills()`: Discovers all available skills (used to find `using-superpowers`)
- `injectSyntheticContent()`: Injects content into the session as a synthetic message

</details>
