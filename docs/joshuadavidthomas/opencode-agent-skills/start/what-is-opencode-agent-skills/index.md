---
title: "OpenCode Agent Skills: Introduction | opencode-agent-skills"
subtitle: "What is OpenCode Agent Skills?"
sidebarTitle: "Introduction"
description: "Discover OpenCode Agent Skills plugin's core value: dynamic skill discovery, context injection, compression recovery, intelligent recommendations, Claude Code compatibility, and Superpowers integration. Efficiently manage and reuse AI skills with cross-session persistence and automated recommendations."
tags:
  - "Getting Started"
  - "Plugin Introduction"
prerequisite: []
order: 1
---

# What is OpenCode Agent Skills?

## What You'll Learn

- Understand the core value of the OpenCode Agent Skills plugin
- Master the main features provided by the plugin
- Understand how skills are automatically discovered and loaded
- Distinguish this plugin from other skill management solutions

## Your Current Struggles

You may have encountered these situations:

- **Difficulty managing scattered skills**: Skills are scattered across multiple locations like project directories, user directories, and plugin caches, making it hard to find the right skill
- **Long sessions become troublesome**: After long sessions, previously loaded skills become invalid due to context compression
- **Compatibility anxiety**: Concerned that existing skills and plugins won't work after migrating from Claude Code
- **Repetitive configuration**: Need to reconfigure skills for each project, lacking a unified skill management mechanism

These issues are all affecting your efficiency when using AI assistants.

## Core Concepts

**OpenCode Agent Skills** is a plugin system that provides dynamic skill discovery and management capabilities for OpenCode.

::: info What is a skill?
A skill is a reusable module containing AI workflow guidance. It is typically a directory that includes a `SKILL.md` file (describing the skill's functionality and usage), along with possible supporting files (documentation, scripts, etc.).
:::

**Core Value**: By standardizing skill formats (SKILL.md), it achieves skill reuse across projects and sessions.

### Technical Architecture

The plugin is built with TypeScript + Bun + Zod, providing 4 core tools:

| Tool | Function |
|------|----------|
| `use_skill` | Injects the SKILL.md content of a skill into the session context |
| `read_skill_file` | Reads supporting files (documentation, configs, etc.) from the skill directory |
| `run_skill_script` | Executes executable scripts in the skill directory context |
| `get_available_skills` | Retrieves the list of currently available skills |

## Main Features

### 1. Dynamic Skill Discovery

The plugin automatically discovers skills from multiple locations, sorted by priority:

```
1. .opencode/skills/              (Project-level - OpenCode)
2. .claude/skills/                (Project-level - Claude Code)
3. ~/.config/opencode/skills/     (User-level - OpenCode)
4. ~/.claude/skills/              (User-level - Claude Code)
5. ~/.claude/plugins/cache/        (Plugin cache)
6. ~/.claude/plugins/marketplaces/ (Installed plugins)
```

**Rule**: The first matching skill takes effect; subsequent skills with the same name are ignored.

> Why this design?
>
> Project-level skills take priority over user-level skills, so you can customize specific behaviors in projects without affecting global configuration.

### 2. Context Injection

When you call `use_skill`, the skill content is injected into the session context in XML format:

- `noReply: true` - The AI will not respond to the injected message
- `synthetic: true` - Marked as a system-generated message (not displayed in UI, not counted as user input)

This means skill content persists in the session context, remaining available even as the session grows and context compression occurs.

### 3. Compression Recovery Mechanism

When OpenCode performs context compression (common in long sessions), the plugin listens for the `session.compacted` event and automatically re-injects the list of available skills.

This ensures that the AI always knows which skills are available in long sessions, preventing loss of skill access due to compression.

### 4. Claude Code Compatibility

The plugin is fully compatible with Claude Code's skill and plugin system, supporting:

- Claude Code skills (`.claude/skills/<skill-name>/SKILL.md`)
- Claude plugin cache (`~/.claude/plugins/cache/...`)
- Claude plugin marketplace (`~/.claude/plugins/marketplaces/...`)

This means if you previously used Claude Code, you can continue using your existing skills and plugins after migrating to OpenCode.

### 5. Automatic Skill Recommendations

The plugin monitors your messages and uses semantic similarity to detect whether they relate to any available skill:

- Computes the embedding vector of your message
- Calculates cosine similarity with all skill descriptions
- When similarity exceeds a threshold, injects an evaluation prompt suggesting the AI load relevant skills

This process is completely automatic—you don't need to remember skill names or explicitly request them.
### 6. Superpowers Integration (Optional)

The plugin supports the Superpowers workflow, enabled via environment variable:

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

When enabled, the plugin automatically detects the `using-superpowers` skill and injects complete workflow guidance during session initialization.

## Comparison with Other Solutions

| Solution | Features | Use Cases |
|----------|----------|-----------|
| **opencode-agent-skills** | Dynamic discovery, compression recovery, auto recommendations | Scenarios requiring unified management and automated recommendations |
| **opencode-skills** | Auto-registers as `skills_{{name}}` tools | Scenarios requiring independent tool calls |
| **superpowers** | Complete software development workflow | Projects requiring strict process standards |
| **skillz** | MCP server mode | Scenarios requiring skills across different tools |

Reasons to choose this plugin:

- ✅ **Zero configuration**: Automatically discovers and manages skills
- ✅ **Smart recommendations**: Automatically recommends relevant skills based on semantic matching
- ✅ **Compression recovery**: Stable and reliable in long sessions
- ✅ **Compatibility**: Seamless migration of Claude Code skills

## Summary

The OpenCode Agent Skills plugin provides complete skill management capabilities for OpenCode through core mechanisms like dynamic discovery, context injection, and compression recovery. Its core value lies in:

- **Automation**: Reduces the burden of manual configuration and remembering skill names
- **Stability**: Skills remain available throughout long sessions
- **Compatibility**: Seamless integration with the existing Claude Code ecosystem

## Preview: Next Lesson

> In the next lesson, we'll learn **[Installing OpenCode Agent Skills](../installation/)**.
>
> You'll learn:
> - How to add the plugin to OpenCode configuration
> - How to verify the plugin is correctly installed
> - Local development mode setup methods

---

## Appendix: Source Code References

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Feature | File Path | Lines |
|---------|-----------|-------|
| Plugin entry and functionality overview | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L1-L12) | 1-12 |
| Core feature list | [`README.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/README.md#L5-L11) | 5-11 |
| Skill discovery priority | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Synthetic message injection | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| Compression recovery mechanism | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L144-L151) | 144-151 |
| Semantic matching module | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L108-L135) | 108-135 |

**Key Constants**:
- `EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"`: The embedding model used
- `SIMILARITY_THRESHOLD = 0.35`: Semantic similarity threshold
- `TOP_K = 5`: Maximum number of skills returned for auto-recommendation

**Key Functions**:
- `discoverAllSkills()`: Discovers skills from multiple locations
- `use_skill()`: Injects skill content into session context
- `matchSkills()`: Matches relevant skills based on semantic similarity
- `injectSyntheticContent()`: Injects synthetic messages into session

</details>
