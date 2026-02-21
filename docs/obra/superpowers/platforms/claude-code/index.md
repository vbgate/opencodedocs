---
title: "Claude Code Integration: Install Superpowers Plugin & Hooks | Superpowers Tutorial"
sidebarTitle: "Using in Claude Code"
subtitle: "Claude Code Platform Integration Guide"
description: "Learn how to install and configure the Superpowers plugin in Claude Code, understand SessionStart hook auto-injection, slash commands, and the skill system."
tags:
  - "Claude Code"
  - "Plugin Installation"
  - "Skill System"
prerequisite:
  - "start-quick-start"
order: 60
---

# Claude Code Platform Integration Guide

## What You'll Learn

- Install Superpowers plugin in Claude Code
- Understand how the hook system auto-injects skill context
- Use slash commands to quickly invoke core skills
- Verify installation success

## Your Current Challenge

While Claude Code is powerful, it lacks systematic workflow guidance:
- You want AI agents to follow TDD, but keep writing code first
- Debugging is arbitrary when encountering bugs, making it hard to find root causes
- You need to pass context across multiple sessions but don't know how

Superpowers injects complete workflows and best practices into Claude Code through a plugin.

## When to Use This

- **First time using Superpowers**: You must install the plugin first
- **Verify skill loading**: Check if hooks are working properly
- **Quick workflow startup**: Use slash commands to directly invoke skills

## Core Approach

Superpowers works in Claude Code through a three-layer mechanism:

| Layer | Component | Purpose |
| --- | --- | --- |
| **Hook Layer** | SessionStart Hook | Auto-inject skill context when session starts |
| **Command Layer** | Slash Commands | Provide shortcuts to invoke core skills |
| **Skill Layer** | Skills Directory | Store all skill definitions and workflows |

**How Hooks Work**:

```mermaid
graph LR
    A[Session Start] --> B[SessionStart Hook Triggered]
    B --> C[Execute session-start.sh script]
    C --> D[Read using-superpowers skill]
    D --> E[Inject into Claude context]
    E --> F[Claude automatically gains skill system knowledge]
```

**Key Advantages**:
- **Zero manual intervention**: Hooks auto-inject, no need to manually invoke skills
- **Always enabled**: Injected on every session start, ensuring AI always follows best practices
- **Extensible**: Plugin architecture supports adding more commands and hooks

## Follow Along: Installation and Verification

### Step 1: Register Plugin Marketplace

**Why**
Claude Code uses a plugin marketplace mechanism to distribute plugins. You need to first register the superpowers marketplace source.

**Action**

Run in Claude Code:

```bash
/plugin marketplace add obra/superpowers-marketplace
```

**You should see**:
```
✓ Marketplace added successfully
```

### Step 2: Install Superpowers Plugin

**Why**
After installing the plugin from the marketplace, you can use all Superpowers skills and commands.

**Action**

```bash
/plugin install superpowers@superpowers-marketplace
```

**You should see**:
```
✓ Plugin 'superpowers' installed successfully
```

### Step 3: Verify Installation

**Why**
Confirm that commands and hooks are loaded correctly.

**Action**

Run the help command:

```bash
/help
```

**You should see** the following Superpowers commands:

```bash
# Should see:
# /superpowers:brainstorm - Interactive design refinement
# /superpowers:write-plan - Create implementation plan
# /superpowers:execute-plan - Execute plan in batches
```

### Step 4: Verify Hook Works

**Why**
The SessionStart hook automatically executes when a new session starts, injecting skill context.

**Action**

```bash
# Start a new session or use /clear
/clear
```

**You should see**:
In Claude's first response, you'll see a prompt like this:

```
<EXTREMELY_IMPORTANT>
You have superpowers.

**Below is the full content of your 'superpowers:using-superpowers' skill...**
</EXTREMELY_IMPORTANT>
```

This indicates the hook successfully injected skill context.

## Checkpoint ✅

| Check Item | Expected Result | Command |
| --- | --- | --- |
| Marketplace registered | Can see superpowers-marketplace in `/help` | `/plugin marketplace list` |
| Plugin installed | Can see superpowers plugin in `/help` | `/plugin list` |
| Commands available | Can see 3 Superpowers commands in `/help` | `/help` |
| Hooks active | Can see skill context injection in new session | Observe after `/clear` |

## Common Pitfalls

### Common Error 1: Commands Not Appearing

**Symptom**: Superpowers commands don't appear after running `/help`

**Cause**: Plugin not installed correctly or marketplace not registered

**Solution**:
```bash
# Check if marketplace is registered
/plugin marketplace list

# If obra/superpowers-marketplace is missing, re-register
/plugin marketplace add obra/superpowers-marketplace

# Reinstall plugin
/plugin uninstall superpowers
/plugin install superpowers@superpowers-marketplace
```

### Common Error 2: Hook Not Triggering

**Symptom**: No skill context injection in new session

**Cause**: Hook script permission issues or incorrect path

**Solution**:
```bash
# Check plugin directory
ls -la ~/.claude/plugins/superpowers/

# Check hook script permissions
chmod +x ~/.claude/plugins/superpowers/hooks/session-start.sh

# View hook configuration
cat ~/.claude/plugins/superpowers/hooks/hooks.json
```

### Common Error 3: Old Skills Directory Conflict

**Symptom**: Warning message about old skills directory

**Cause**: Old versions of Superpowers use `~/.config/superpowers/skills` to store skills

**Solution**:
```bash
# Check specific path in warning message
# Backup old skills (if you have custom skills)
cp -r ~/.config/superpowers/skills ~/backup-custom-skills

# Remove old directory
rm -rf ~/.config/superpowers/skills
```

## Deep Dive: Core Mechanisms

### Hook System

**SessionStart Hook** triggers in these situations:
- Starting a new session
- Resuming a session (`/resume`)
- Clearing a session (`/clear`)
- Compacting a session (`/compact`)

**Hook Configuration** (`hooks/hooks.json`):

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

The `matcher` field uses regex to match session events.

**Hook Script** (`hooks/session-start.sh`) functionality:
1. Read `using-superpowers` skill content
2. Detect and warn about old skills directory
3. Wrap content as JSON output
4. Inject into Claude's context

### Command System

Superpowers provides three core commands:

| Command | Description | Skill Invoked |
| --- | --- | --- |
| `/superpowers:brainstorm` | Interactive design refinement | `brainstorming` |
| `/superpowers:write-plan` | Create detailed implementation plan | `writing-plans` |
| `/superpowers:execute-plan` | Execute plan in batches | `executing-plans` |

**Command Definition** example (`commands/brainstorm.md`):

```yaml
---
description: "You MUST use this before any creative work..."
disable-model-invocation: true
---

Invoke the superpowers:brainstorming skill and follow it exactly as presented to you
```

`disable-model-invocation: true` means the command won't invoke the model, but directly calls the skill.

### Skill Discovery

Claude Code uses the built-in **Skill tool** to load skill files:

1. After plugin installation, skills are stored in the `skills/` subdirectory of the plugin directory (i.e., `~/.claude/plugins/superpowers/skills/`)
2. Hook scripts read the `using-superpowers` skill from `${PLUGIN_ROOT}/skills/` and inject it into context
3. Other skills are loaded on-demand via the `Skill` tool, and Claude automatically finds and loads `SKILL.md` files

**Skill File Structure**:

```markdown
---
name: brainstorming
description: "Interactive design refinement workflow..."
version: "4.1.1"
---

# Brainstorming

[Skill content and workflow diagrams...]
```

::: tip Skills Directory Explanation
`~/.claude/skills/` is Claude Code's **personal skills directory**, used for storing user-defined skills. Superpowers plugin skills are stored internally in the plugin and are not copied to this directory.
:::

## Summary

The Claude Code platform provides complete Superpowers integration through the plugin mechanism:

- **Simple installation**: One-click installation via plugin marketplace
- **High automation**: Hook system auto-injects skill context
- **Convenient commands**: Slash commands quickly invoke core skills
- **Strong extensibility**: Plugin architecture supports custom extensions

After installation, Claude Code automatically injects Superpowers knowledge at every session start, ensuring AI always follows best practices.

## Next Lesson Preview

> In the next lesson, we'll learn about **[OpenCode Platform Integration](../opencode/)**.
>
> You'll learn:
> - OpenCode platform plugin installation method
> - Skill priority system (Project > Personal > Superpowers)
> - System prompt conversion mechanism

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-02-01

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Plugin configuration | [`.claude-plugin/plugin.json`](https://github.com/obra/superpowers/blob/main/.claude-plugin/plugin.json) | Full file |
| Hook configuration | [`hooks/hooks.json`](https://github.com/obra/superpowers/blob/main/hooks/hooks.json) | Full file |
| Session start hook | [`hooks/session-start.sh`](https://github.com/obra/superpowers/blob/main/hooks/session-start.sh) | Full file |
| brainstorm command | [`commands/brainstorm.md`](https://github.com/obra/superpowers/blob/main/commands/brainstorm.md) | Full file |
| write-plan command | [`commands/write-plan.md`](https://github.com/obra/superpowers/blob/main/commands/write-plan.md) | Full file |
| execute-plan command | [`commands/execute-plan.md`](https://github.com/obra/superpowers/blob/main/commands/execute-plan.md) | Full file |
| Entry skill | [`skills/using-superpowers/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md) | Full file |
| Installation docs | [`README.md`](https://github.com/obra/superpowers/blob/main/README.md) | 31-58 |

**Key Configuration**:

- **Plugin name**: `superpowers`
- **Version**: `4.1.1`
- **Hook event**: `SessionStart`
- **Hook matcher**: `startup|resume|clear|compact`
- **Skill injection path**: `${CLAUDE_PLUGIN_ROOT}/skills/using-superpowers/SKILL.md`

**Key Commands**:

- **Register marketplace**: `/plugin marketplace add obra/superpowers-marketplace`
- **Install plugin**: `/plugin install superpowers@superpowers-marketplace`
- **Verify commands**: `/help`

</details>
