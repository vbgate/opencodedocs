---
title: "Best Practices: Skill Development | opencode-agent-skills"
sidebarTitle: "Best Practices"
subtitle: "Skill Development Best Practices"
description: "Learn OpenCode Agent Skills development best practices. Master naming conventions, description writing, directory organization, and Frontmatter standards to create discoverable skills."
tags:
  - "Best Practices"
  - "Skill Development"
  - "Conventions"
  - "Anthropic Skills"
prerequisite:
  - "/joshuadavidthomas/opencode-agent-skills/creating-your-first-skill/"
order: 1
---

# Skill Development Best Practices

## What You'll Learn

After completing this tutorial, you will be able to:
- Write skill names that follow naming conventions
- Write descriptions that are easily recognized by automatic recommendations
- Organize clear skill directory structures
- Use script features appropriately
- Avoid common Frontmatter errors
- Improve skill discoverability and usability

## Why Best Practices Matter

The OpenCode Agent Skills plugin doesn't just store skills—it also:
- **Auto-discovery**: Scans skill directories from multiple locations
- **Semantic matching**: Recommends skills based on description similarity to user messages
- **Namespace management**: Supports coexistence of skills from multiple sources
- **Script execution**: Automatically scans and executes runnable scripts

Following best practices ensures your skills:
- ✅ Are correctly recognized and loaded by the plugin
- ✅ Receive higher recommendation priority in semantic matching
- ✅ Avoid conflicts with other skills
- ✅ Are more easily understood and used by team members

---

## Naming Conventions

### Skill Name Rules

Skill names must conform to the following specifications:

::: tip Naming Rules
- ✅ Use lowercase letters, numbers, and hyphens
- ✅ Start with a letter
- ✅ Use hyphens to separate words
- ❌ Don't use uppercase letters or underscores
- ❌ Don't use spaces or special characters
:::

**Examples**:

| ✅ Good Examples | ❌ Bad Examples | Reason |
| ---------------- | -------------- | ------ |
| `git-helper` | `GitHelper` | Contains uppercase letters |
| `docker-build` | `docker_build` | Uses underscores |
| `code-review` | `code review` | Contains spaces |
| `test-utils` | `1-test` | Starts with a number |

**Source reference**: `src/skills.ts:106-108`

```typescript
name: z.string()
  .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
  .min(1, { message: "Name cannot be empty" }),
```

### Directory Name vs. Frontmatter Relationship

The skill directory name and the `name` field in frontmatter can be different:

```yaml
---
# Directory is my-git-tools, but frontmatter name is git-helper
name: git-helper
description: Git common operations helper
---
```

**Recommended practices**:
- Keep directory name and `name` field consistent for easier maintenance
- Use short, memorable identifiers for directory names
- The `name` field can be more specific about skill purpose

**Source reference**: `src/skills.ts:155-158`

---

## Description Writing Tips

### Purpose of Descriptions

Skill descriptions are not just for user guidance—they're also used for:

1. **Semantic matching**: The plugin calculates similarity between description and user messages
2. **Skill recommendation**: Automatically recommends relevant skills based on similarity
3. **Fuzzy matching**: Used to recommend similar skills when skill name is misspelled

### Good vs. Bad Descriptions

| ✅ Good Descriptions | ❌ Bad Descriptions | Reason |
| ------------------- | ------------------- | ------ |
| "Automate Git branch management and commit workflow, supports auto-generating commit messages" | "Git tool" | Too vague, lacks specific functionality |
| "Generate type-safe API client code for Node.js projects" | "A useful tool" | Doesn't specify use case |
| "Translate PDF to Chinese while preserving original formatting" | "Translation tool" | Doesn't mention special capabilities |

### Description Writing Principles

::: tip Description Writing Principles
1. **Be specific**: Explain the specific purpose and use cases of the skill
2. **Include keywords**: Include keywords users might search for (e.g., "Git", "Docker", "translation")
3. **Highlight unique value**: Explain advantages compared to similar skills
4. **Avoid redundancy**: Don't repeat the skill name
:::

**Examples**:

```markdown
---
name: pdf-translator
description: Translate English PDF documents to Chinese while preserving original layout, image positions, and table structures. Supports batch translation and custom glossaries.
---
```

This description includes:
- ✅ Specific features (PDF translation, format preservation)
- ✅ Use cases (English documents)
- ✅ Unique value (format preservation, batch, glossaries)

**Source reference**: `src/skills.ts:109`

```typescript
description: z.string()
  .min(1, { message: "Description cannot be empty" }),
```

---

## Directory Organization

### Basic Structure

A standard skill directory contains:

```
my-skill/
├── SKILL.md              # Main skill file (required)
├── README.md             # Detailed documentation (optional)
├── tools/                # Runnable scripts (optional)
│   ├── setup.sh
│   └── run.sh
└── docs/                 # Supporting documentation (optional)
    ├── guide.md
    └── examples.md
```

### Skipped Directories

The plugin automatically skips the following directories (doesn't scan for scripts):

::: warning Automatically Skipped Directories
- `node_modules` - Node.js dependencies
- `__pycache__` - Python bytecode cache
- `.git` - Git version control
- `.venv`, `venv` - Python virtual environments
- `.tox`, `.nox` - Python testing environments
- Any hidden directory starting with `.`
:::

**Source reference**: `src/skills.ts:61`

```typescript
const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);
```

### Recommended Directory Naming

| Purpose | Recommended Directory Name | Description |
| ------- | ------------------------- | ----------- |
| Script files | `tools/` or `scripts/` | Store runnable scripts |
| Documentation | `docs/` or `examples/` | Store supporting documentation |
| Configuration | `config/` | Store configuration files |
| Templates | `templates/` | Store template files |

---

## Script Usage

### Script Discovery Rules

The plugin automatically scans for executable files in skill directories:

::: tip Script Discovery Rules
- ✅ Scripts must have executable permissions (`chmod +x script.sh`)
- ✅ Maximum recursion depth is 10 levels
- ✅ Skips hidden directories and dependency directories
- ❌ Non-executable files are not recognized as scripts
:::

**Source reference**: `src/skills.ts:86`

```typescript
if (stats.mode & 0o111) {
  scripts.push({
    relativePath: newRelPath,
    absolutePath: fullPath
  });
}
```

### Setting Script Permissions

**Bash scripts**:
```bash
chmod +x tools/setup.sh
chmod +x tools/run.sh
```

**Python scripts**:
```bash
chmod +x tools/scan.py
```

And add shebang at the beginning of the file:
```python
#!/usr/bin/env python3
import sys
# ...
```

### Script Invocation Examples

When a skill is loaded, AI sees the available script list:

```
Available scripts:
- tools/setup.sh: Initialize development environment
- tools/build.sh: Build project
- tools/deploy.sh: Deploy to production
```

AI can call these scripts using the `run_skill_script` tool:

```javascript
run_skill_script({
  skill: "project-builder",
  script: "tools/build.sh",
  arguments: ["--release", "--verbose"]
})
```

---

## Frontmatter Best Practices

### Required Fields

**name**: Skill unique identifier
- Lowercase letters, numbers, and hyphens
- Short but descriptive
- Avoid generic names (like `helper`, `tool`)

**description**: Skill description
- Specifically explain functionality
- Include use cases
- Appropriate length (1-2 sentences)

### Optional Fields

**license**: License information
```yaml
license: MIT
```

**allowed-tools**: Restrict tools available to the skill
```yaml
allowed-tools:
  - read
  - write
  - bash
```

**metadata**: Custom metadata
```yaml
metadata:
  author: "Your Name"
  version: "1.0.0"
  category: "development"
```

**Source reference**: `src/skills.ts:105-114`

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

### Complete Example

```markdown
---
name: docker-deploy
description: Automate Docker image building and deployment process, supports multi-environment configuration, health checks, and rollbacks
license: MIT
allowed-tools:
  - read
  - write
  - bash
metadata:
  version: "2.1.0"
  author: "DevOps Team"
  category: "deployment"
---

# Docker Auto-Deployment

This skill helps you automate the Docker image build, push, and deployment process.

## Usage

...
```

---

## Avoiding Common Mistakes

### Mistake 1: Name Doesn't Follow Conventions

**Bad example**:
```yaml
name: MyAwesomeSkill  # ❌ Uppercase letters
```

**Fix**:
```yaml
name: my-awesome-skill  # ✅ Lowercase + hyphens
```

### Mistake 2: Description Too Vague

**Bad example**:
```yaml
description: "A useful tool"  # ❌ Too vague
```

**Fix**:
```yaml
description: "Automate Git commit workflow, auto-generate standard-compliant commit messages"  # ✅ Specific and clear
```

### Mistake 3: Scripts Without Execution Permissions

**Problem**: Scripts aren't recognized as executable

**Solution**:
```bash
chmod +x tools/setup.sh
```

**Verify**:
```bash
ls -l tools/setup.sh
# Should show: -rwxr-xr-x (has x permission)
```

### Mistake 4: Directory Name Conflicts

**Problem**: Multiple skills use the same name

**Solution**:
- Use namespaces (via plugin config or directory structure)
- Or use more descriptive names

**Source reference**: `src/skills.ts:258-259`

```typescript
// Only keep the first skill with the same name, subsequent ones are ignored
if (skillsByName.has(skill.name)) {
  continue;
}
```

---

## Improving Discoverability

### 1. Optimize Description Keywords

Include keywords users might search for in your description:

```yaml
---
name: code-reviewer
description: Automated code review tool that checks code quality, potential bugs, security vulnerabilities, and performance issues. Supports multiple languages including JavaScript, TypeScript, Python, and more.
---
```

Keywords: code review, code quality, bugs, security vulnerabilities, performance issues, JavaScript, TypeScript, Python

### 2. Use Standard Skill Locations

The plugin discovers skills in the following priority order:

1. `.opencode/skills/` - Project-level (highest priority)
2. `.claude/skills/` - Project-level Claude
3. `~/.config/opencode/skills/` - User-level
4. `~/.claude/skills/` - User-level Claude

**Recommended practices**:
- Project-specific skills → Place at project-level
- General-purpose skills → Place at user-level

### 3. Provide Detailed Documentation

Beyond SKILL.md, you can also provide:
- `README.md` - Detailed instructions and usage examples
- `docs/guide.md` - Complete usage guide
- `docs/examples.md` - Real-world examples

---

## Summary

This tutorial covered best practices for skill development:

- **Naming conventions**: Use lowercase letters, numbers, and hyphens
- **Description writing**: Be specific, include keywords, highlight unique value
- **Directory organization**: Clear structure, skip unnecessary directories
- **Script usage**: Set executable permissions, note depth limits
- **Frontmatter conventions**: Correctly fill required and optional fields
- **Avoid mistakes**: Common problems and solutions

Following these best practices ensures your skills:
- ✅ Are correctly recognized and loaded by the plugin
- ✅ Receive higher recommendation priority in semantic matching
- ✅ Avoid conflicts with other skills
- ✅ Are more easily understood and used by team members

## Next Up

> In the next lesson, we'll learn about **[API Tool Reference](../api-reference/)**.
>
> You'll see:
> - Detailed parameter descriptions for all available tools
> - Tool invocation examples and return value formats
> - Advanced usage and important considerations

---

## Appendix: Source Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Feature | File Path | Line Numbers |
| ------- | --------- | ------------ |
| Skill name validation | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L106-L108) | 106-108 |
| Skill description validation | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L109-L110) | 109-110 |
| Frontmatter Schema definition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Skipped directories list | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61) | 61 |
| Script executable permission check | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| Duplicate skill deduplication logic | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |

**Key constants**:
- Skipped directories: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`

**Key functions**:
- `findScripts(skillPath: string, maxDepth: number = 10)`: Recursively find executable scripts in skill directory
- `parseSkillFile(skillPath: string)`: Parse SKILL.md and validate frontmatter

</details>
