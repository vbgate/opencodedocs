---
title: "Creating Your First Skill | opencode-agent-skills"
sidebarTitle: "Create First Skill"
subtitle: "Creating Your First Skill"
description: "Learn to create OpenCode Agent Skills. This tutorial covers skill directory structure, SKILL.md format, Frontmatter fields, and how to create and test a simple skill with troubleshooting."
tags:
  - "Skill Creation"
  - "SKILL.md"
  - "Anthropic Skills"
prerequisite:
  - "installation"
order: 3
---

# Creating Your First Skill

## What You'll Learn

After completing this tutorial, you will be able to:
- Create a compliant skill directory structure
- Write correct SKILL.md Frontmatter
- Understand the components of a skill
- Have OpenCode automatically discover and load your skill
- Test if a skill is working correctly

## Your Current Challenge

You may be facing these situations:

- You want to create a custom skill for your project but don't know where to start
- You tried writing a SKILL.md, but the plugin can't find it
- The skill is discovered but fails to load with "YAML parsing failed"
- You're unsure which fields to fill in Frontmatter

These problems occur because you're unfamiliar with the skill structure specifications. OpenCode Agent Skills follows Anthropic's Agent Skills specification and has fixed format requirements.

## When to Use This

Creating skills is suitable for the following scenarios:

- **Project-specific workflows**: Custom code reviews, deployment processes for a specific project
- **Team standards**: Unified commit conventions, code style checks for the team
- **Tool integration**: Integrating common CLI tools (such as git, docker)
- **Knowledge documentation**: Documenting common operation steps for AI to call on demand

## 🎒 Prerequisites

Before starting, please confirm:

::: warning Prerequisites
- ✅ OpenCode Agent Skills plugin installed (see [Installation Guide](../installation/))
- ✅ Familiar with basic command-line operations (mkdir, cd, ls)
- ✅ Have a project directory to store skills
:::

## Core Concept

An OpenCode Agent Skills skill is a directory that must contain a `SKILL.md` file. This file has two parts:

1. **YAML Frontmatter**: Skill metadata (name, description, etc.)
2. **Markdown body**: Guidance content that AI follows during execution

The plugin automatically discovers skills from multiple locations (in priority order):

```
1. .opencode/skills/              (Project-level - OpenCode)
2. .claude/skills/                (Project-level - Claude Code)
3. ~/.config/opencode/skills/     (User-level - OpenCode)
4. ~/.claude/skills/              (User-level - Claude Code)
5. ~/.claude/plugins/cache/        (Plugin cache)
6. ~/.claude/plugins/marketplaces/ (Installed plugins)
```

For skills with the same name, the first match takes effect.

## Follow Along

We will create a simple "hello-world" skill to demonstrate the basic structure.

### Step 1: Create the skill directory

**Why**
Skills must be placed in specific directories for the plugin to automatically discover them.

**Steps**

```bash
# Create skill directory in project root
mkdir -p .opencode/skills/hello-world
```

**You should see**:
```
Project root/
└── .opencode/
    └── skills/
        └── hello-world/
```

### Step 2: Write SKILL.md

**Why**
SKILL.md is the core file of a skill, containing metadata and guidance content.

**Steps**

Write the following to `.opencode/skills/hello-world/SKILL.md`:

```markdown
---
name: hello-world
description: A simple greeting skill for demonstration
---

# Hello World Skill

This is a demonstration skill that shows how to create a basic skill.

## Usage

Use this skill when you need to greet users or demonstrate skill functionality.

## Example

When asked "Say hello to the user", respond with a friendly greeting.
```

**You should see**:
```
.opencode/skills/hello-world/
└── SKILL.md
```

### Step 3: Verify the skill is discovered

**Why**
Ensure Frontmatter format is correct so the plugin can parse it properly.

**Steps**

Ask in OpenCode:

```
List all available skills
```

**You should see**:
The skill list returned by the plugin includes `hello-world`.

Or call the tool directly:

```
get_available_skills()
```

**Expected output**:
```
Available skills:
- hello-world: A simple greeting skill for demonstration
```

### Step 4: Load and test the skill

**Why**
Verify that the skill content can be correctly injected into the session context.

**Steps**

In OpenCode:

```
Load the hello-world skill
```

**You should see**:
```
Skill 'hello-world' loaded successfully.

Available scripts: (none)
Available files: (none)

SKILL.md content has been injected into context.
```

### Step 5: Verify the skill works

**Why**
Confirm that AI can understand and follow the skill's guidance.

**Steps**

Ask the AI:

```
According to the hello-world skill, greet me
```

**You should see**:
AI outputs a friendly greeting based on the skill content.

## Checkpoint ✅

After completing the above steps, check the following:

- [ ] `.opencode/skills/hello-world/SKILL.md` file exists
- [ ] `get_available_skills()` can list the `hello-world` skill
- [ ] `use_skill("hello-world")` loads successfully without errors
- [ ] AI can understand and follow the skill content

If any item fails, see the "Common Pitfalls" section below.

## Common Pitfalls

### Skill not found?

| Symptom | Possible Cause | Solution |
| -------- | -------- | -------- |
| Plugin can't find the skill | Incorrect directory or file name | Confirm the filename is `SKILL.md` (all uppercase) |
| Plugin can't find the skill | Frontmatter format error | Check if `---` exists and if there are blank lines before/after |
| Plugin can't find the skill | name field doesn't meet specifications | name must be lowercase letters, numbers, hyphens |

### Parsing failed?

| Symptom | Possible Cause | Solution |
| -------- | -------- | -------- |
| YAML parsing failed | Incorrect Frontmatter format | Ensure correct YAML format, wrap strings in quotes |
| Validation failed | name contains uppercase or special characters | name field can only be lowercase letters, numbers, hyphens |
| Validation failed | description is empty | description must have a value |

### Common error examples

```yaml
# ❌ Error: name contains uppercase letters
---
name: HelloWorld
description: A skill
---

# ❌ Error: name contains spaces
---
name: hello world
description: A skill
---

# ❌ Error: name contains special characters (except hyphens)
---
name: hello_world
description: A skill
---

# ✅ Correct
---
name: hello-world
description: A skill for demonstration
---
```

### Frontmatter field requirements

| Field | Required | Constraints | Example |
| ---- | -------- | ---- | ---- |
| name | ✅ Yes | Lowercase letters, numbers, hyphens | `my-skill` |
| description | ✅ Yes | Non-empty string | `A skill for git management` |
| license | ❌ No | Open source license name | `MIT` |
| allowed-tools | ❌ No | Array of tool names | `["read", "write"]` |
| metadata | ❌ No | key-value object | `{"namespace": "project"}` |

## Summary

This tutorial covered:

1. **Skill directory structure**: `.opencode/skills/<skill-name>/SKILL.md`
2. **Frontmatter format**: YAML format with required name and description fields
3. **Skill discovery rules**: Automatically discovered from 6 locations by priority
4. **Skill loading process**: Load content into context via the `use_skill` tool

You now have mastered the basics of creating skills. Next, you will learn about the plugin's skill discovery mechanism and how it automatically scans and manages multiple skills.

## Next Up

> In the next lesson, we'll learn **[Skill Discovery Mechanism](../../platforms/skill-discovery-mechanism/)**.
>
> You'll learn:
> - The 6 skill discovery locations and priority rules
> - Deduplication logic for skills with the same name
> - Compatibility mechanism for Claude Code skills
> - How to query a skill's source and namespace

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line |
| --- | --- | --- |
| Frontmatter Schema definition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Parse SKILL.md file | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L122-L167) | 122-167 |
| Find skill scripts | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L59-L99) | 59-99 |
| Skill discovery priority list | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Parse YAML Frontmatter | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L49) | 41-49 |

**Key Constants**:

- Script maximum recursion depth: `maxDepth = 10`
- Skipped directories: `node_modules`, `__pycache__`, `.git`, `.venv`, `venv`, `.tox`, `.nox`

**Key Functions**:

- `parseSkillFile()`: Parse SKILL.md file, validate Frontmatter, and extract metadata
- `findScripts()`: Recursively find executable scripts in skill directory
- `discoverAllSkills()`: Discover all skills from multiple locations

</details>
