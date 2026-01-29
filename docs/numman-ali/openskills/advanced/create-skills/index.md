---
title: "Create Skills: SKILL.md Format Guide | OpenSkills"
sidebarTitle: "Create Skills"
subtitle: "Create Custom Skills"
description: "Learn to create custom skills from scratch. Master SKILL.md format, YAML frontmatter specifications, and directory structure best practices for AI agents."
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "start-quick-start"
  - "start-first-skill"
order: 4
---

# Create Custom Skills

## What You'll Learn

- Create a complete SKILL.md skill file from scratch
- Write YAML frontmatter that meets Anthropic standards
- Design a reasonable skill directory structure (references/, scripts/, assets/)
- Use symbolic links for local development and iteration
- Install and verify custom skills using the `openskills` command

## Your Current Challenges

You want AI agents to help you solve specific problems, but there's no suitable solution in the existing skill library. You try repeatedly describing requirements in conversations, but the AI keeps forgetting or executing incompletely. You need a way to **encapsulate expertise** so AI agents can stably and reliably reuse it.

## When to Use This Approach

- **Encapsulate workflows**: Write repetitive operational steps as skills, letting AI execute them correctly in one go
- **Team knowledge consolidation**: Package internal team standards, API documentation, and scripts as skills, sharing them with all members
- **Tool integration**: Create dedicated skills for specific tools (such as PDF processing, data cleaning, deployment workflows)
- **Local development**: Modify and test skills in real-time during development without repeated installation

## 🎒 Before You Start

::: warning Prerequisites

Before starting, please ensure:

- ✅ [OpenSkills](/start/installation/) is installed
- ✅ At least one skill has been installed and synced (understand the basic workflow)
- ✅ Familiar with basic Markdown syntax

:::

## Core Concepts

### What is SKILL.md?

**SKILL.md** is the standard format for Anthropic's skill system, using YAML frontmatter to describe skill metadata and Markdown body to provide execution instructions. It has three core advantages:

1. **Unified format** - All agents (Claude Code, Cursor, Windsurf, etc.) use the same skill description
2. **Progressive loading** - Load full content only when needed, keeping AI context concise
3. **Bundled resources** - Supports three types of additional resources: references/, scripts/, assets/

### Minimal vs Complete Structure

**Minimal structure** (suitable for simple skills):
```
my-skill/
└── SKILL.md          # Only one file
```

**Complete structure** (suitable for complex skills):
```
my-skill/
├── SKILL.md          # Core instructions (< 5000 words)
├── references/       # Detailed documentation (loaded on-demand)
│   └── api-docs.md
├── scripts/          # Executable scripts
│   └── helper.py
└── assets/           # Templates and output files
    └── template.json
```

::: info When to use complete structure?

- **references/**: When API documentation, database schemas, or detailed guides exceed 5000 words
- **scripts/**: When needing to execute deterministic, repeatable tasks (such as data conversion, formatting)
- **assets/**: When needing to output templates, images, or boilerplate code

:::

## Follow Along

### Step 1: Create Skill Directory

**Why**: Create an independent directory to organize skill files

```bash
mkdir my-skill
cd my-skill
```

**What You Should See**: Current directory is empty

---

### Step 2: Write SKILL.md Core Structure

**Why**: SKILL.md must start with YAML frontmatter to define skill metadata

Create `SKILL.md` file:

```markdown
---
name: my-skill                    # Required: hyphenated identifier
description: When to use this skill.  # Required: 1-2 sentences, third person
---

# Skill Title

Detailed description of the skill.
```

**Validation checkpoints**:

- ✅ First line is `---`
- ✅ Contains `name` field (hyphenated format, such as `pdf-editor`, `api-client`)
- ✅ Contains `description` field (1-2 sentences, in third person)
- ✅ Use `---` again after ending YAML

::: danger Common Errors

| Error Example | Fix |
|--- | ---|
| `name: My Skill` (spaces) | Change to `name: my-skill` (hyphens) |
| `description: You should use this for...` (second person) | Change to `description: Use this skill for...` (third person) |
|--- | ---|
| `description` too long (over 100 words) | Condense to 1-2 sentence summary |

:::

---

### Step 3: Write Instruction Content

**Why**: Instructions tell AI agents how to execute tasks, must use imperative/infinitive form

Continue editing `SKILL.md`:

```markdown
---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill

## When to Use

Load this skill when:
- Demonstrating instruction writing patterns
- Understanding imperative/infinitive form
- Learning SKILL.md format

## Instructions

To execute this skill:

1. Read the user's input
2. Process the data
3. Return the result

For detailed information, see references/guide.md
```

**Writing guidelines**:

| ✅ Correct (imperative/infinitive) | ❌ Incorrect (second person) |
|--- | ---|
| "To accomplish X, execute Y"        | "You should do X"          |
| "Load this skill when Z"            | "If you need Y"            |
| "See references/guide.md"           | "When you want Z"           |

::: tip Writing Principles

**Three principles for instruction writing**:
1. **Start with verbs**: "Create" → "Use" → "Return"
2. **Omit "You"**: Don't say "You should"
3. **Clear paths**: Use `references/` prefix when referencing resources

:::

---

### Step 4: Add Bundled Resources (Optional)

**Why**: When skills need extensive detailed documentation or executable scripts, use bundled resources to keep SKILL.md concise

#### 4.1 Add references/

```bash
mkdir references
```

Create `references/api-docs.md`:

```markdown
# API Documentation

## Overview

This section provides detailed API information...

## Endpoints

### GET /api/data

Returns processed data.

Response:
```json
{
  "status": "success",
  "data": [...]
}
```
```

Reference in `SKILL.md`:

```markdown
## Instructions

To fetch data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format
3. Process the result
```

#### 4.2 Add scripts/

```bash
mkdir scripts
```

Create `scripts/process.py`:

```python
#!/usr/bin/env python3
import sys

def main():
    # Processing logic
    print("Processing complete")

if __name__ == "__main__":
    main()
```

Reference in `SKILL.md`:

```markdown
## Instructions

To process data:

1. Execute the script:
   ```bash
   python scripts/process.py
   ```
2. Review the output
```

::: info Advantages of scripts/

- **Not loaded into context**: Saves tokens, suitable for large files
- **Can be executed independently**: AI agents can call directly without loading content first
- **Suitable for deterministic tasks**: Data conversion, formatting, generation, etc.

:::

#### 4.3 Add assets/

```bash
mkdir assets
```

Add template file `assets/template.json`:

```json
{
  "title": "{{ title }}",
  "content": "{{ content }}"
}
```

Reference in `SKILL.md`:

```markdown
## Instructions

To generate output:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
```

---

### Step 5: Validate SKILL.md Format

**Why**: Validate format before installation to avoid errors during installation

```bash
npx openskills install ./my-skill
```

**What You Should See**:

```
✔ Found skill: my-skill
  Description: Use this skill to demonstrate how to write proper instructions.
  Size: 1.2 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

Select the skill and press Enter, you should see:

```
✔ Installing my-skill...
✔ Skill installed successfully to .claude/skills/my-skill

Next steps:
  Run: npx openskills sync
  Then: Ask your AI agent to use the skill
```

::: tip Validation Checklist

Before installation, check the following items:

- [ ] SKILL.md starts with `---`
- [ ] Contains `name` and `description` fields
- [ ] `name` uses hyphenated format (`my-skill` not `my_skill`)
- [ ] `description` is a 1-2 sentence summary
- [ ] Instructions use imperative/infinitive form
- [ ] All `references/`, `scripts/`, `assets/` reference paths are correct

:::

---

### Step 6: Sync to AGENTS.md

**Why**: Let AI agents know this skill is available

```bash
npx openskills sync
```

**What You Should See**:

```
✔ Found 1 skill:
  ☑ my-skill

✔ Syncing to AGENTS.md...
✔ Updated AGENTS.md successfully
```

Check the generated `AGENTS.md`:

```markdown
<!-- SKILLS_SYSTEM_START -->
...
<available_skills>
  <skill name="my-skill">Use this skill to demonstrate how to write proper instructions.</skill>
</available_skills>
...
<!-- SKILLS_SYSTEM_END -->
```

---

### Step 7: Test Skill Loading

**Why**: Verify that the skill can be correctly loaded into AI context

```bash
npx openskills read my-skill
```

**What You Should See**:

```
Loading skill: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill
... (complete SKILL.md content)
```

## Checklist ✅

After completing the above steps, you should:

- ✅ Created a skill directory containing SKILL.md
- ✅ SKILL.md contains correct YAML frontmatter and Markdown content
- ✅ Skill successfully installed to `.claude/skills/`
- ✅ Skill synced to AGENTS.md
- ✅ Using `openskills read` can load skill content

## Common Pitfalls

### Problem 1: "Invalid SKILL.md (missing YAML frontmatter)" during installation

**Cause**: SKILL.md doesn't start with `---`

**Solution**: Check if the first line of the file is `---`, not `# My Skill` or other content

---

### Problem 2: AI agents cannot recognize the skill

**Cause**: `openskills sync` not executed or AGENTS.md not updated

**Solution**: Run `npx openskills sync` and check if AGENTS.md contains the skill entry

---

### Problem 3: Resource path resolution errors

**Cause**: Used absolute paths or incorrect relative paths in SKILL.md

**Solution**:
- ✅ Correct: `references/api-docs.md` (relative path)
- ❌ Incorrect: `/path/to/skill/references/api-docs.md` (absolute path)
- ❌ Incorrect: `../other-skill/references/api-docs.md` (cross-skill reference)

---

### Problem 4: SKILL.md too long causing token limit exceeded

**Cause**: SKILL.md exceeds 5000 words or contains extensive detailed documentation

**Solution**: Move detailed content to `references/` directory and reference it in SKILL.md

## Lesson Summary

Core steps to create custom skills:

1. **Create directory structure**: Minimal structure (only SKILL.md) or complete structure (includes references/, scripts/, assets/)
2. **Write YAML frontmatter**: Required fields `name` (hyphenated format) and `description` (1-2 sentences)
3. **Write instruction content**: Use imperative/infinitive form, avoid second person
4. **Add resources** (optional): references/, scripts/, assets/
5. **Validate format**: Use `openskills install ./my-skill` to validate
6. **Sync to AGENTS.md**: Run `openskills sync` to let AI agents know
7. **Test loading**: Use `openskills read my-skill` to verify loading

## Up Next

> In the next lesson, we'll learn **[Skill Structure Explained](../skill-structure/)**
>
> You will learn:
> - Complete field descriptions for SKILL.md
> - Best practices for references/, scripts/, assets/
> - How to optimize skill readability and maintainability

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function           | File Path                                                                 | Line Numbers |
|--- | --- | ---|
| YAML frontmatter validation | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14   |
| YAML field extraction  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7     |
| Format validation during installation  | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |
| Skill name extraction    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 344-345 |

**Example skill files**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - Minimal structure example
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - Format specification reference

**Key functions**:
- `hasValidFrontmatter(content: string): boolean` - Verify SKILL.md starts with `---`
- `extractYamlField(content: string, field: string): string` - Extract YAML field value (non-greedy match)

</details>
