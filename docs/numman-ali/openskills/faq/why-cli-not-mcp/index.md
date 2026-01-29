---
title: "CLI vs MCP: Why OpenSkills Chose CLI | OpenSkills"
sidebarTitle: "Why CLI not MCP?"
subtitle: "Why CLI Not MCP?"
description: "Learn why OpenSkills chose CLI over MCP. Compare positioning differences and understand how CLI achieves multi-agent universality and zero-config deployment."
tags:
  - "FAQ"
  - "Design Philosophy"
  - "MCP"
prerequisite:
  - "start-what-is-openskills"
order: 3
---

# Why CLI Not MCP?

## What You'll Learn

This lesson helps you understand:

- ✅ Understand the positioning differences between MCP and the skill system
- ✅ Understand why CLI is more suitable for skill loading
- ✅ Master OpenSkills's design philosophy
- ✅ Understand the technical principles of the skill system

## Your Current Challenges

You might be thinking:

- "Why not use the more advanced MCP protocol?"
- "Isn't CLI too old-fashioned?"
- "Isn't MCP more aligned with the AI era design?"

This lesson helps you understand the technical considerations behind these design decisions.

---

## Core Question: What Is a Skill?

Before discussing CLI vs MCP, let's first understand the essence of "skills."

### The Nature of Skills

::: info Definition of Skills
Skills are a combination of **static instructions + resources**, including:
- `SKILL.md`: Detailed operation guides and prompts
- `references/`: Reference documentation
- `scripts/`: Executable scripts
- `assets/`: Images, templates, and other resources

Skills are **not** dynamic services, real-time APIs, or tools that require a server to run.
:::

### Anthropic's Official Design

Anthropic's skill system is inherently designed based on the **file system**:

- Skills exist as `SKILL.md` files
- Described through the `<available_skills>` XML block
- AI agents read file contents to context on demand

This determines that the technology selection for the skill system must be compatible with the file system.

---

## MCP vs OpenSkills: Positioning Comparison

| Comparison Dimension | MCP (Model Context Protocol) | OpenSkills (CLI) |
|--- | --- | ---|
| **Use Case** | Dynamic tools, real-time API calls | Static instructions, documentation, scripts |
| **Runtime Requirements** | Requires MCP server | No server needed (pure files) |
| **Agent Support** | Only MCP-supporting agents | All agents that can read `AGENTS.md` |
| **Complexity** | Requires server deployment and maintenance | Zero configuration, ready to use |
| **Data Source** | Retrieved from server in real-time | Read from local file system |
| **Network Dependency** | Required | Not required |
| **Skill Loading** | Through protocol calls | Through file reading |

---

## Why Is CLI More Suitable for the Skill System?

### 1. Skills Are Files

**MCP requires a server**: Need to deploy an MCP server, handle requests, responses, protocol handshake...

**CLI only needs files**:

```bash
# Skills stored in file system
.claude/skills/pdf/
├── SKILL.md              # Main instruction file
├── references/           # Reference documentation
│   └── pdf-format-spec.md
├── scripts/             # Executable scripts
│   └── extract-pdf.py
└── assets/              # Resource files
    └── pdf-icon.png
```

**Advantages**:
- ✅ Zero configuration, no server needed
- ✅ Skills can be version-controlled
- ✅ Available offline
- ✅ Simple deployment

### 2. Universality: All Agents Can Use It

**MCP's limitation**:

Only agents that support the MCP protocol can use it. If agents like Cursor, Windsurf, Aider, etc., each implement MCP, it would bring:
- Duplicate development work
- Protocol compatibility issues
- Difficult version synchronization

**CLI's advantage**:

Any agent that can execute shell commands can use it:

```bash
# Claude Code invocation
npx openskills read pdf

# Cursor invocation
npx openskills read pdf

# Windsurf invocation
npx openskills read pdf
```

**Zero integration cost**: Only requires the agent to be able to execute shell commands.

### 3. Aligns with Official Design

Anthropic's skill system is inherently a **file system design**, not an MCP design:

```xml
<!-- Skill description in AGENTS.md -->
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>
</available_skills>
```

**Invocation method**:

```bash
# Official designed invocation method
npx openskills read pdf
```

OpenSkills fully follows Anthropic's official design, maintaining compatibility.

### 4. Progressive Loading

**Core advantage of the skill system**: Load on demand, keep context concise.

**CLI implementation**:

```bash
# Load skill content only when needed
npx openskills read pdf
# Output: Complete content of SKILL.md to standard output
```

**MCP's challenge**:

If implemented with MCP, it would need:
- Server to manage skill list
- Implement on-demand loading logic
- Handle context management

Whereas CLI naturally supports progressive loading.

---

## MCP's Applicable Scenarios

The problems MCP solves are **different** from the skill system:

| Problems MCP Solves | Examples |
|--- | ---|
| **Real-time API calls** | Calling OpenAI API, database queries |
| **Dynamic tools** | Calculators, data transformation services |
| **Remote service integration** | Git operations, CI/CD systems |
| **State management** | Tools that need to maintain server state |

These scenarios require **servers** and **protocols**, and MCP is the correct choice.

---

## Skill System vs MCP: Not a Competitive Relationship

**Core viewpoint**: MCP and the skill system solve different problems, not an either-or choice.

### Skill System Positioning

```
[Static Instructions] → [SKILL.md] → [File System] → [CLI Loading]
```

Applicable scenarios:
- Operation guides and best practices
- Documentation and reference materials
- Static scripts and templates
- Configuration that needs version control

### MCP Positioning

```
[Dynamic Tools] → [MCP Server] → [Protocol Calls] → [Real-time Responses]
```

Applicable scenarios:
- Real-time API calls
- Database queries
- Remote services that need state
- Complex calculations and transformations

### Complementary Relationship

OpenSkills doesn't reject MCP, but **focuses on skill loading**:

```
AI Agents
  ├─ Skill System (OpenSkills CLI) → Load static instructions
  └─ MCP Tools → Call dynamic services
```

They are complementary, not substitutes.

---

## Practical Examples: When to Use Which?

### Example 1: Calling Git Operations

❌ **Not suitable for the skill system**:
- Git operations are dynamic and require real-time interaction
- Depends on Git server state

✅ **Suitable for MCP**:
```bash
# Call through MCP tool
git:checkout(branch="main")
```

### Example 2: PDF Processing Guide

❌ **Not suitable for MCP**:
- Operation guides are static
- No server needed to run

✅ **Suitable for the skill system**:
```bash
# Load through CLI
npx openskills read pdf
# Output: Detailed PDF processing steps and best practices
```

### Example 3: Database Query

❌ **Not suitable for the skill system**:
- Need to connect to database
- Results are dynamic

✅ **Suitable for MCP**:
```bash
# Call through MCP tool
database:query(sql="SELECT * FROM users")
```

### Example 4: Code Review Guidelines

❌ **Not suitable for MCP**:
- Review guidelines are static documentation
- Need version control

✅ **Suitable for the skill system**:
```bash
# Load through CLI
npx openskills read code-review
# Output: Detailed code review checklist and examples
```

---

## Future: Fusion of MCP and Skill System

### Possible Evolution Directions

**MCP + Skill System**:

```bash
# Skills referencing MCP tools
npx openskills read pdf-tool

# SKILL.md content
This skill requires using MCP tools:

1. Use mcp:pdf-extract to extract text
2. Use mcp:pdf-parse to parse structure
3. Use the scripts provided by this skill to process results
```

**Advantages**:
- Skills provide high-level instructions and best practices
- MCP provides underlying dynamic tools
- Combined, they're more powerful

### Current Stage

OpenSkills chose CLI because:
1. The skill system is already a mature file system design
2. CLI implementation is simple and highly universal
3. No need to wait for various agents to implement MCP support

---

## Lesson Summary

OpenSkills's core reasons for choosing CLI over MCP:

### Core Reasons

- ✅ **Skills are static files**: No server needed, file system storage
- ✅ **Stronger universality**: All agents can use it, doesn't depend on MCP protocol
- ✅ **Aligns with official design**: Anthropic's skill system is inherently a file system design
- ✅ **Zero-config deployment**: No server needed, ready to use

### MCP vs Skill System

| MCP | Skill System (CLI) |
|--- | ---|
| Dynamic tools | Static instructions |
| Requires server | Pure file system |
| Real-time API | Documentation and scripts |
| Needs protocol support | Zero integration cost |

### Not Competition, But Complementarity

- MCP solves dynamic tool problems
- Skill system solves static instruction problems
- The two can be used together

---

## Further Reading

- [What Is OpenSkills?](../../start/what-is-openskills/)
- [Command Details](../../platforms/cli-commands/)
- [Creating Custom Skills](../../advanced/create-skills/)

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function | File Path | Line Numbers |
|--- | --- | ---|
| CLI entry | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 39-80 |
| Read command | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| AGENTS.md generation | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93 |

**Key design decisions**:
- CLI approach: Load skills through `npx openskills read <name>`
- File system storage: Skills stored in `.claude/skills/` or `.agent/skills/`
- Universal compatibility: Output XML format completely consistent with Claude Code

</details>
