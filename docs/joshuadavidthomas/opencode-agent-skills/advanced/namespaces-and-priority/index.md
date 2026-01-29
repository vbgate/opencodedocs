---
title: "Namespaces: Skill Priority | opencode-agent-skills"
sidebarTitle: "Namespaces & Priority"
subtitle: "Master the namespace system and skill discovery priority rules for OpenCode Agent Skills"
description: "Master OpenCode Agent Skills namespace system. Learn 5 skill source labels, 6-level priority mechanism, resolve same-name conflicts with namespace prefixes."
tags:
  - "Advanced"
  - "Namespaces"
  - "Skill Management"
prerequisite:
  - "/joshuadavidthomas/opencode-agent-skills/start-what-is-opencode-agent-skills"
  - "/joshuadavidthomas/opencode-agent-skills/platforms-skill-discovery-mechanism"
  - "/joshuadavidthomas/opencode-agent-skills/platforms-listing-available-skills"
order: 3
---

# Namespaces and Skill Priority

## What You'll Learn

- Understand the skill namespace system to distinguish skills with the same name from different sources
- Master skill discovery priority rules to predict which skill will be loaded
- Use namespace prefixes to precisely specify skill sources
- Resolve same-name skill conflicts

## Your Current Struggle

As the number of skills grows, you may encounter these challenges:

- **Same-name skill conflicts**: Both project directory and user directory have a skill called `git-helper`, and you don't know which one is being loaded
- **Confusing skill sources**: You're unclear which skills come from project-level, user-level, or plugin cache
- **Unpredictable override behavior**: You modified a user-level skill but find it not taking effect, overridden by the project-level skill
- **Lack of precise control**: You want to force use of a skill from a specific source but don't know how to specify it

These issues stem from misunderstanding the skill namespace and priority rules.

## Core Concept

**Namespaces** are the mechanism OpenCode Agent Skills uses to distinguish same-name skills from different sources. Each skill has a label (label) that identifies its source, and these labels form the skill's namespace.

::: info Why do we need namespaces?

Imagine you have two skills with the same name:
- Project-level `.opencode/skills/git-helper/` (customized for the current project)
- User-level `~/.config/opencode/skills/git-helper/` (general version)

Without namespaces, the system wouldn't know which one to use. With namespaces, you can explicitly specify:
- `project:git-helper` - Force use of the project-level version
- `user:git-helper` - Force use of the user-level version
:::

**Priority rules** ensure that when no namespace is specified, the system can make a reasonable choice. Project-level skills take priority over user-level skills, so you can customize behavior in your projects without affecting global configuration.

## Skill Sources and Labels

OpenCode Agent Skills supports multiple skill sources, each with a corresponding label:

| Source | Label (label) | Path | Description |
|--------|---------------|------|-------------|
| **OpenCode project-level** | `project` | `.opencode/skills/` | Skills specific to the current project |
| **Claude project-level** | `claude-project` | `.claude/skills/` | Claude Code compatible project skills |
| **OpenCode user-level** | `user` | `~/.config/opencode/skills/` | General skills shared across all projects |
| **Claude user-level** | `claude-user` | `~/.claude/skills/` | Claude Code compatible user skills |
| **Claude plugin cache** | `claude-plugins` | `~/.claude/plugins/cache/` | Installed Claude plugins |
| **Claude plugin marketplace** | `claude-plugins` | `~/.claude/plugins/marketplaces/` | Claude plugins installed from marketplace |

::: tip Practical Recommendations
- Project-specific configurations: Put them in `.opencode/skills/`
- General utility skills: Put them in `~/.config/opencode/skills/`
- Migrating from Claude Code: No need to move, the system will automatically discover them
:::

## Skill Discovery Priority

When the system discovers skills, it scans each location in the following order:

```
1. .opencode/skills/              (project)        ← Highest priority
2. .claude/skills/                (claude-project)
3. ~/.config/opencode/skills/     (user)
4. ~/.claude/skills/              (claude-user)
5. ~/.claude/plugins/cache/       (claude-plugins)
6. ~/.claude/plugins/marketplaces/ (claude-plugins)  ← Lowest priority
```

**Key rules**:
- **First match wins**: The first skill found is kept
- **Same-name skill deduplication**: Subsequent skills with the same name are ignored (but a warning is issued)
- **Project-level priority**: Project-level skills override user-level skills

### Priority Example

Suppose you have the following skill distribution:

```
Project directory:
.opencode/skills/
  └── git-helper/              ← Version A (project customized)

User directory:
~/.config/opencode/skills/
  └── git-helper/              ← Version B (general)

Plugin cache:
~/.claude/plugins/cache/xxx/skills/
  └── git-helper/              ← Version C (Claude plugin)
```

Result: The system loads **Version A** (`project:git-helper`), and the two subsequent same-name skills are ignored.

## Specifying Skills with Namespaces

When you call `use_skill` or other tools, you can use namespace prefixes to precisely specify skill sources.

### Syntax Format

```
namespace:skill-name
```

or

```
skill-name  # No namespace specified, use default priority
```

### Namespace List

```
project:skill-name         # Project-level OpenCode skills
claude-project:skill-name  # Project-level Claude skills
user:skill-name            # User-level OpenCode skills
claude-user:skill-name     # User-level Claude skills
claude-plugins:skill-name  # Claude plugin skills
```

### Usage Examples

**Scenario 1: Default loading (by priority)**

```
use_skill("git-helper")
```

- The system searches by priority and loads the first matching skill
- That is, `project:git-helper` (if it exists)

**Scenario 2: Force use of user-level skill**

```
use_skill("user:git-helper")
```

- Skips priority rules and directly loads the user-level skill
- Even if the user-level skill is overridden by a project-level skill, it's still accessible

**Scenario 3: Load Claude plugin skill**

```
use_skill("claude-plugins:git-helper")
```

- Explicitly loads a skill from a Claude plugin
- Suitable for scenarios that require specific plugin functionality

## Namespace Matching Logic

When using the `namespace:skill-name` format, the system's matching logic is as follows:

1. **Parse input**: Separate the namespace and skill name
2. **Iterate through all skills**: Find matching skills
3. **Matching conditions**:
   - Skill name matches
   - The skill's `label` field equals the specified namespace
   - Or the skill's custom `namespace` field equals the specified namespace
4. **Return result**: The first skill that meets the conditions

::: details Matching Logic Source Code

```typescript
export function resolveSkill(
  skillName: string,
  skillsByName: Map<string, Skill>
): Skill | null {
  if (skillName.includes(':')) {
    const [namespace, name] = skillName.split(':');
    for (const skill of skillsByName.values()) {
      if (skill.name === name &&
          (skill.label === namespace || skill.namespace === namespace)) {
        return skill;
      }
    }
    return null;
  }
  return skillsByName.get(skillName) || null;
}
```

:::

## Namespaces in Superpowers Mode

When you enable Superpowers mode, the system injects namespace priority instructions during session initialization:

```markdown
**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
```

This ensures that the AI follows the correct priority rules when selecting skills.

::: tip How to enable Superpowers mode

Set the environment variable:

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

:::

## Common Use Cases

### Scenario 1: Project customization overrides general skills

**Requirement**: Your project requires a special Git workflow, but there's already a general `git-helper` skill at the user level.

**Solution**:
1. Create `.opencode/skills/git-helper/` in the project directory
2. Configure the project-specific Git workflow
3. Default calls to `use_skill("git-helper")` will automatically use the project-level version

**Verification**:

```bash
# Check skill list, note the label
get_available_skills("git-helper")
```

Example output:
```
git-helper (project)
  Project-specific Git workflow
```

### Scenario 2: Temporarily switch to general skill

**Requirement**: A task needs to use the user-level general skill instead of the project-customized version.

**Solution**:

```
use_skill("user:git-helper")
```

Explicitly specify the `user:` namespace to bypass the project-level override.

### Scenario 3: Load skill from Claude plugin

**Requirement**: You migrated from Claude Code and want to continue using a specific Claude plugin skill.

**Solution**:

1. Ensure the Claude plugin cache path is correct: `~/.claude/plugins/cache/`
2. Check the skill list:

```
get_available_skills()
```

3. Load using namespace:

```
use_skill("claude-plugins:plugin-name")
```

## Common Pitfalls

### ❌ Mistake 1: Unaware that same-name skills are being overridden

**Symptom**: You modified a user-level skill, but the AI still uses the old version.

**Cause**: The project-level same-name skill has higher priority and overrides the user-level skill.

**Solution**:
1. Check if there's a same-name skill in the project directory
2. Use a namespace to force specification: `use_skill("user:skill-name")`
3. Or delete the project-level same-name skill

### ❌ Mistake 2: Misspelled namespace

**Symptom**: Using `use_skill("project:git-helper")` returns 404.

**Cause**: The namespace is misspelled (e.g., `projcet`) or has incorrect casing.

**Solution**:
1. First check the skill list: `get_available_skills()`
2. Note the label in parentheses (e.g., `(project)`)
3. Use the correct namespace name

### ❌ Mistake 3: Confusing labels and custom namespaces

**Symptom**: Using `use_skill("project:custom-skill")` cannot find the skill.

**Cause**: `project` is a label, not a custom namespace. Unless the skill's `namespace` field is explicitly set to `project`, it won't match.

**Solution**:
- Use the skill name directly: `use_skill("custom-skill")`
- Or check the skill's `label` field and use the correct namespace

## Summary

The namespace system of OpenCode Agent Skills achieves unified management of skills from multiple sources through labels and priority rules:

- **5 source labels**: `project`, `claude-project`, `user`, `claude-user`, `claude-plugins`
- **6 priority levels**: Project-level > Claude project-level > User-level > Claude user-level > Plugin cache > Plugin marketplace
- **First match wins**: Same-name skills are loaded by priority, subsequent ones are ignored
- **Namespace prefix**: Use the `namespace:skill-name` format to precisely specify skill sources

This mechanism allows you to enjoy the convenience of automatic discovery while maintaining precise control over skill sources when needed.

## Preview: Next Lesson

> In the next lesson, we'll learn **[Context Compaction Resilience](../context-compaction-resilience/)**.
>
> You will learn:
> - The impact of context compaction on skills
> - How plugins automatically restore skill lists
> - Techniques to keep skills available during long sessions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function | File Path | Line |
|----------|-----------|------|
| SkillLabel type definition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| Discovery priority list | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| Same-name skill deduplication logic | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |
| resolveSkill namespace handling | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Superpowers namespace instructions | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |

**Key Types**:
- `SkillLabel`: Skill source label enum
- `Skill`: Skill metadata interface (including `namespace` and `label` fields)

**Key Functions**:
- `discoverAllSkills()`: Discover skills by priority with automatic deduplication
- `resolveSkill()`: Parse namespace prefix and find skills
- `maybeInjectSuperpowersBootstrap()`: Inject namespace priority instructions

**Discovery Path List** (in priority order):
1. `project` - `.opencode/skills/`
2. `claude-project` - `.claude/skills/`
3. `user` - `~/.config/opencode/skills/`
4. `claude-user` - `~/.claude/skills/`
5. `claude-plugins` - `~/.claude/plugins/cache/` and `~/.claude/plugins/marketplaces/`

</details>
