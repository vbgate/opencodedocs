---
title: "What Is OpenSkills: Unified Skill Loader | OpenSkills"
sidebarTitle: "What Is OpenSkills"
subtitle: "What Is OpenSkills: Unified Skill Loader"
description: "Learn how OpenSkills enables Claude Code, Cursor, Windsurf, and Aider to share skills via a unified loader. Master progressive loading and multi-agent support."
tags:
  - "Concept Introduction"
  - "Core Concepts"
prerequisite: []
order: 2
---

# What Is OpenSkills?

## What You'll Learn

- Understand OpenSkills's core value and working principles
- Know the relationship between OpenSkills and Claude Code
- Determine when to use OpenSkills instead of built-in skill systems
- Learn how to enable multiple AI coding agents to share a skill ecosystem

::: info Prerequisites
This tutorial assumes you have basic knowledge of AI coding tools (like Claude Code, Cursor, etc.), but requires no prior OpenSkills experience.
:::

---

## Your Current Challenges

You may encounter these scenarios:

- **Skills that work smoothly in Claude Code disappear when you switch AI tools**: For example, the PDF processing skill available in Claude Code is unavailable in Cursor
- **Installing skills repeatedly across different tools**: Each AI tool requires separate skill configuration, resulting in high management overhead
- **Want to use private skills, but the official Marketplace doesn't support it**: Company-internal or self-developed skills cannot be easily shared with your team

These problems fundamentally stem from: **Inconsistent skill formats, making cross-tool sharing impossible**.

---

## Core Idea: Unified Skill Format

OpenSkills's core idea is simple: **Transform Claude Code's skill system into a universal skill loader**.

### What It Is

**OpenSkills** is a universal loader for Anthropic's skill system, enabling any AI coding agent (Claude Code, Cursor, Windsurf, Aider, etc.) to use skills in the standard SKILL.md format.

Simply put: **One installer serving all AI coding tools**.

### What Problems It Solves

| Problem | Solution |
|--- | ---|
| Inconsistent skill formats | Use Claude Code's standard SKILL.md format |
| Skills cannot be shared across tools | Generate unified AGENTS.md that all tools can read |
| Distributed skill management | Unified install, update, and delete commands |
| Private skills are hard to share | Support installation from local paths and private git repositories |

---

## Core Values

OpenSkills provides the following core values:

### 1. Unified Standard

All agents use the same skill format and AGENTS.md descriptions—no need to learn new formats.

- **Fully compatible with Claude Code**: Same prompt format, same Marketplace, same folder structure
- **Standardized SKILL.md**: Clear skill definitions, easy to develop and maintain

### 2. Progressive Loading

Load skills on demand to keep AI context concise.

- No need to load all skills at once
- AI agents dynamically load relevant skills based on task requirements
- Avoid context explosion and improve response quality

### 3. Multi-Agent Support

One skill set serves multiple agents, no need for repeated installation.

- Claude Code, Cursor, Windsurf, Aider share the same skill set
- Unified skill management interface
- Reduced configuration and maintenance costs

### 4. Open-Source Friendly

Support local paths and private git repositories, suitable for team collaboration.

- Install skills from local file system (in development)
- Install from private git repositories (company-internal sharing)
- Skills can be version-controlled together with projects

### 5. Local Execution

No data upload, privacy and security guaranteed.

- All skill files stored locally
- No dependency on cloud services, no risk of data leakage
- Suitable for sensitive projects and enterprise environments

---

## How It Works

OpenSkills's workflow is straightforward, divided into three steps:

### Step 1: Install Skills

Install skills to your project from GitHub, local paths, or private git repositories.

```bash
# Install from Anthropic's official repository
openskills install anthropics/skills

# Install from local path
openskills install ./my-skills
```

Skills will be installed to the project's `.claude/skills/` directory (default), or `.agent/skills/` directory (when using `--universal`).

### Step 2: Sync to AGENTS.md

Synchronize installed skills to the AGENTS.md file, generating a skill list that AI agents can read.

```bash
openskills sync
```

AGENTS.md will contain XML similar to this:

```xml
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>
</available_skills>
```

### Step 3: AI Agent Loads Skills

When an AI agent needs to use a skill, it loads the skill content via the following command:

```bash
openskills read <skill-name>
```

The AI agent will dynamically load the skill content into context and execute the task.

---

## Relationship with Claude Code

OpenSkills and Claude Code are complementary, not substitutes.

### Fully Compatible Formats

| Aspect | Claude Code | OpenSkills |
|--- | --- | ---|
| **Prompt format** | `<available_skills>` XML | Same XML |
| **Skill storage** | `.claude/skills/` | `.claude/skills/` (default) |
| **Skill invocation** | `Skill("name")` tool | `npx openskills read <name>` |
| **Marketplace** | Anthropic marketplace | GitHub (anthropics/skills) |
| **Progressive loading** | ✅ | ✅ |

### Usage Scenario Comparison

| Scenario | Recommended Tool | Reason |
|--- | --- | ---|
| Only using Claude Code | Claude Code built-in | No extra installation needed, official support |
| Mixing multiple AI tools | OpenSkills | Unified management, avoid duplication |
| Need private skills | OpenSkills | Supports local and private repositories |
| Team collaboration | OpenSkills | Skills can be version-controlled, easy to share |

---

## Installation Location Guide

OpenSkills supports three installation locations:

| Installation Location | Command | Use Case |
|--- | --- | ---|
| **Project-local** | Default | Single project use, skills version-controlled with project |
| **Global installation** | `--global` | All projects share common skills |
| **Universal mode** | `--universal` | Multi-agent environment, avoid conflicts with Claude Code |

::: tip When to use Universal mode?
If you use both Claude Code and other AI coding agents (like Cursor, Windsurf), use `--universal` to install to `.agent/skills/`. This allows multiple agents to share the same skill set and avoids conflicts.
:::

---

## Skill Ecosystem

OpenSkills uses the same skill ecosystem as Claude Code:

### Official Skills Repository

Anthropic's officially maintained skills repository: [anthropics/skills](https://github.com/anthropics/skills)

Includes common skills:
- PDF processing
- Image generation
- Data analysis
- And more...

### Community Skills

Any GitHub repository can serve as a skill source, as long as it contains a SKILL.md file.

### Custom Skills

You can create your own skills using the standard format and share them with your team.

---

## Summary

OpenSkills's core idea is:

1. **Unified standard**: Use Claude Code's SKILL.md format
2. **Multi-agent support**: Enable all AI coding tools to share a skill ecosystem
3. **Progressive loading**: Load on demand, keep context concise
4. **Local execution**: No data upload, privacy and security guaranteed
5. **Open-source friendly**: Support local and private repositories

With OpenSkills, you can:
- Switch seamlessly between different AI tools
- Manage all skills uniformly
- Use and share private skills
- Improve development efficiency

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Installing OpenSkills Tool](../installation/)**
>
> You'll learn:
> - How to check Node.js and Git environments
> - Install OpenSkills using npx or globally
> - Verify successful installation
> - Resolve common installation issues

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function | File Path | Line Numbers |
|--- | --- | ---|
| Core type definitions | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L24) | 1-24 |
| Skill interface (Skill) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |
| Skill location interface (SkillLocation) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L8-L12) | 8-12 |
| Install options interface (InstallOptions) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L14-L18) | 14-18 |
| Skill metadata interface (SkillMetadata) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L20-L24) | 20-24 |

**Key interfaces**:
- `Skill`: Installed skill information (name, description, location, path)
- `SkillLocation`: Skill lookup location information (path, baseDir, source)
- `InstallOptions`: Install command options (global, universal, yes)
- `SkillMetadata`: Skill metadata (name, description, context)

**Core concept source**:
- README.md:22-86 - "What Is OpenSkills?" section

</details>
