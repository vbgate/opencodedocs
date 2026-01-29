---
title: "列出可用技能: 查询与管理 | opencode-agent-skills"
sidebarTitle: "列出技能"
subtitle: "列出可用技能: 查询与管理"
description: "学习列出可用技能的方法。掌握命名空间、模糊匹配和搜索过滤，快速定位所需技能，理解技能发现优先级，提升开发效率。"
tags:
  - "Skill Management"
  - "Tool Usage"
  - "Namespace"
prerequisite:
  - "start-installation"
order: 2
---

# Query and List Available Skills

## What You'll Learn

- Use the `get_available_skills` tool to list all available skills
- Filter specific skills through search queries
- Use namespaces (like `project:skill-name`) to precisely locate skills
- Identify skill sources and lists of executable scripts

## Your Current Challenge

You want to use a skill but can't recall its exact name. Perhaps you know it's a skill in your project, but you're not sure which discovery path it's under. Or you just want to quickly browse what skills are available in your current project.

## When to Use This

- **Explore new projects**: When joining a new project, quickly understand what skills are available
- **Uncertain skill names**: You only remember part of a skill's name or description and need fuzzy matching
- **Multiple namespace conflicts**: Project-level and user-level skills have the same name, and you need to explicitly specify which one to use
- **Find scripts**: You want to know what executable automation scripts are available in a skill directory

## Core Concept

The `get_available_skills` tool helps you view all skills available in the current session. The plugin automatically scans skills from 6 discovery paths:

::: info Skill Discovery Priority
1. `.opencode/skills/` (Project-level OpenCode)
2. `.claude/skills/` (Project-level Claude)
3. `~/.config/opencode/skills/` (User-level OpenCode)
4. `~/.claude/skills/` (User-level Claude)
5. `~/.claude/plugins/cache/` (Plugin cache)
6. `~/.claude/plugins/marketplaces/` (Installed plugins)
:::

Skills with the same name retain only the first one based on priority; subsequent ones are ignored.

The information returned by the tool includes:
- **Skill name**
- **Source label** (project, user, claude-project, etc.)
- **Description**
- **List of executable scripts** (if any)

::: tip Namespace Syntax
You can explicitly specify the source using the `namespace:skill-name` format:
- `project:my-skill` - Use project-level OpenCode skill (`.opencode/skills/`)
- `claude-project:my-skill` - Use project-level Claude skill (`.claude/skills/`)
- `user:my-skill` - Use user-level OpenCode skill (`~/.config/opencode/skills/`)
- `claude-user:my-skill` - Use user-level Claude skill (`~/.claude/skills/`)
- `claude-plugins:my-skill` - Use skills from Claude plugins
:::

## Follow Along

### Step 1: List All Available Skills

In OpenCode, directly ask the AI to list skills:

```
User input:
List all available skills

System response:
skill-helper (project)
  Git operations and branch management assistant [scripts: tools/branch.sh, tools/commit.sh]

test-helper (user)
  Unit testing and coverage analysis tool

docker-helper (project)
  Docker containerization and deployment guide [scripts: build.sh, deploy.sh]

claude-code-superpowers (claude-plugins)
  Complete software development workflow
```

**What you should see**: A list of skills, each showing name, source label, description, and script list.

### Step 2: Filter with Search Query

If you only remember part of a skill's name:

```
User input:
Find skills containing "docker"

System response:
docker-helper (project)
  Docker containerization and deployment guide [scripts: build.sh, deploy.sh]
```

Search matches keywords in skill names and descriptions, supporting the `*` wildcard:

```
User input:
Find skills starting with "test"

System response:
test-helper (user)
  Unit testing and coverage analysis tool
```

**What you should see**: Only skills matching the query criteria are displayed.

### Step 3: Experience Fuzzy Match Suggestions

If you enter an incorrect skill name:

```
User input:
I want to use docker-asistant

System response:
No skills found matching "docker-asistant". Did you mean "docker-helper"?
```

The plugin calculates similarity based on Levenshtein distance and automatically suggests the closest skill name.

**What you should see**: An error message and the correct skill suggestion.

### Step 4: Use Namespaces for Precise Location

Assume both project-level and user-level have a skill named `build-helper`:

```
User input:
List detailed information for build-helper

System response:
build-helper (project)
  Project-specific build configuration and compilation optimization [scripts: build.sh, optimize.sh]
```

If the user wants the user-level skill:

```
User input:
Use user:build-helper

System response:
build-helper (user)
  General build toolchain and continuous integration configuration [scripts: ci.sh, test.sh]
```

**What you should see**: Through namespace prefixes, you can access skills with the same name from different sources.

### Step 5: Check Executable Scripts

View what scripts are in a skill directory:

```
User input:
What scripts does docker-helper have?

System response:
docker-helper (project)
  Docker containerization and deployment guide [scripts: build.sh, deploy.sh]
```

Scripts are displayed in brackets after the skill information, separated by commas. You can execute these scripts using the `run_skill_script` tool.

**What you should see**: The skill name followed by a list in the format `[scripts: script-path1, script-path2, ...]`.

## Checklist ✅

- [ ] Can you list all available skills?
- [ ] Can you filter specific skills using search queries?
- [ ] Do you understand the meaning of skill source labels (project, user, claude-project, etc.)?
- [ ] Can you explain the purpose and syntax of skill namespaces?
- [ ] Can you identify the list of executable scripts from skill information?

## Common Pitfalls

### Pitfall 1: Override of Same-Name Skills

If project-level and user-level have skills with the same name, you might be confused why the loaded skill isn't the one you expected.

**Cause**: Skills are discovered by priority, with project-level taking precedence over user-level, and only the first same-name skill is retained.

**Solution**: Use namespaces to explicitly specify, such as `user:my-skill` instead of `my-skill`.

### Pitfall 2: Search Case Sensitivity

Search queries use regular expressions but with the `i` flag set, so they are case-insensitive.

```bash
# These searches are equivalent
get_available_skills(query="docker")
get_available_skills(query="DOCKER")
get_available_skills(query="Docker")
```

### Pitfall 3: Escaping Wildcards

The `*` in searches is automatically converted to `.*` regular expression, so manual escaping is not needed:

```bash
# Search for skills starting with "test"
get_available_skills(query="test*")

# Equivalent to regular expression /test.*/i
```

## Lesson Summary

`get_available_skills` is a tool for exploring the skills ecosystem, supporting:

- **List all skills**: Call without parameters
- **Search filtering**: Match names and descriptions through the `query` parameter
- **Namespaces**: Precisely locate using `namespace:skill-name`
- **Fuzzy match suggestions**: Automatically suggest correct names on spelling errors
- **Script listing**: Display executable automation scripts

The plugin automatically injects the skill list at the start of a session, so you typically don't need to manually call this tool. However, it's useful in these scenarios:
- Want to quickly browse available skills
- Can't remember the exact skill name
- Need to distinguish between skills with the same name from different sources
- Want to view the script list for a specific skill

## Preview of Next Lesson

> In the next lesson, we'll learn **[Loading Skills into Session Context](../loading-skills-into-context/)**.
>
> You'll learn:
> - Use the use_skill tool to load skills into the current session
> - Understand how skill content is injected into the context in XML format
> - Master the Synthetic Message Injection mechanism
> - Learn how skills remain available after session compression

---

## Appendix: Source Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function        | File Path                                                                                    | Line Range |
| ----------- | ------------------------------------------------------------------------------------------- | ---------- |
| GetAvailableSkills tool definition | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72)         | 29-72   |
| discoverAllSkills function | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L240-L263) | 240-263 |
| resolveSkill function | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| findClosestMatch function | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125)    | 88-125  |

**Key Types**:
- `SkillLabel = "project" | "user" | "claude-project" | "claude-user" | "claude-plugins"`: Skill source label enum

**Key Constants**:
- Fuzzy match threshold: `0.4` (`utils.ts:124`) - Similarity below this value doesn't return suggestions

**Key Functions**:
- `GetAvailableSkills()`: Returns a formatted skill list, supporting query filtering and fuzzy match suggestions
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: Supports skill resolution in `namespace:skill-name` format
- `findClosestMatch(input: string, candidates: string[])`: Calculates best match based on multiple matching strategies (prefix, contains, edit distance)

**Business Rules**:
- Same-name skills are deduplicated by discovery order, keeping only the first one (`skills.ts:258`)
- Search queries support wildcard `*`, automatically converted to regular expressions (`tools.ts:43`)
- Fuzzy match suggestions only trigger when there's a query parameter and no results (`tools.ts:49-57`)

</details>
