---
title: "API Reference: 4 Core Tools | OpenCode Agent Skills"
sidebarTitle: "API Reference"
subtitle: "API Reference: 4 Core Tools"
description: "Explore the 4 tools in OpenCode Agent Skills: get_available_skills, read_skill_file, run_skill_script, and use_skill with parameters and return values."
tags:
  - "API"
  - "Tool Reference"
  - "Interface Documentation"
prerequisite:
  - "start-installation"
order: 2
---

# API Tool Reference

## What You'll Learn

By reading this API reference, you will:

- Understand the parameters and return values of the 4 core tools
- Master the correct way to call tools
- Learn how to handle common error scenarios

## Tool Overview

The OpenCode Agent Skills plugin provides the following 4 tools:

| Tool Name | Description | Use Cases |
|--- | --- | ---|
| `get_available_skills` | Get list of available skills | View all available skills with search and filtering support |
| `read_skill_file` | Read skill files | Access documentation, configuration, and other support files within skills |
| `run_skill_script` | Execute skill scripts | Run automation scripts within the skill directory |
| `use_skill` | Load skill | Inject SKILL.md content into the session context |

---

## get_available_skills

Get the list of available skills with optional search filtering.

### Parameters

| Parameter | Type | Required | Description |
|--- | --- | --- | ---|
| `query` | string | No | Search query string to match skill names and descriptions (supports `*` wildcard) |

### Return Value

Returns a formatted skill list, each item containing:

- Skill name and source label (e.g., `skill-name (project)`)
- Skill description
- List of available scripts (if any)

**Example Return**:
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### Error Handling

- Returns a hint message when no matches are found
- Returns similar skill suggestions if the query parameter contains a typo

### Usage Examples

**List all skills**:
```
User input:
List all available skills

AI calls:
get_available_skills()
```

**Search for skills containing "git"**:
```
User input:
Find skills related to git

AI calls:
get_available_skills({
  "query": "git"
})
```

**Search using wildcard**:
```
AI calls:
get_available_skills({
  "query": "code*"
})

Returns:
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

Read support files within a skill directory (documentation, configuration, examples, etc.).

### Parameters

| Parameter | Type | Required | Description |
|--- | --- | --- | ---|
| `skill` | string | Yes | Skill name |
| `filename` | string | Yes | File path (relative to skill directory, e.g., `docs/guide.md`, `scripts/helper.sh`) |

### Return Value

Returns a confirmation message of successful file loading.

**Example Return**:
```
File "docs/guide.md" from skill "code-review" loaded.
```

The file content is injected into the session context in XML format:

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[Actual file content]
  </content>
</skill-file>
```

### Error Handling

| Error Type | Return Message |
|--- | ---|
| Skill not found | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Unsafe path | `Invalid path: cannot access files outside skill directory.` |
| File not found | `File "xxx" not found. Available files: file1, file2, ...` |

### Security Mechanisms

- Path safety check: Prevents directory traversal attacks (e.g., `../../../etc/passwd`)
- Only files within the skill directory can be accessed

### Usage Examples

**Read skill documentation**:
```
User input:
View the usage guide for code-review skill

AI calls:
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**Read configuration file**:
```
AI calls:
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

Execute executable scripts within a skill directory.

### Parameters

| Parameter | Type | Required | Description |
|--- | --- | --- | ---|
| `skill` | string | Yes | Skill name |
| `script` | string | Yes | Script relative path (e.g., `build.sh`, `tools/deploy.sh`) |
| `arguments` | string[] | No | Array of command-line arguments to pass to the script |

### Return Value

Returns the script output.

**Example Return**:
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### Error Handling

| Error Type | Return Message |
|--- | ---|
| Skill not found | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| Script not found | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| Execution failed | `Script failed (exit 1): error message` |

### Script Discovery Rules

The plugin automatically scans executable files in the skill directory:

- Maximum recursion depth: 10 levels
- Skip hidden directories (starting with `.`)
- Skip common dependency directories (`node_modules`, `__pycache__`, `.git`, etc.)
- Only include files with executable bit set (`mode & 0o111`)

### Execution Environment

- Working directory (CWD) changes to the skill directory
- Scripts execute within the skill directory context
- Output is returned directly to the AI

### Usage Examples

**Execute build script**:
```
User input:
Run the project's build script

AI calls:
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**Execute with arguments**:
```
AI calls:
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

Load the SKILL.md content of a skill into the session context.

### Parameters

| Parameter | Type | Required | Description |
|--- | --- | --- | ---|
| `skill` | string | Yes | Skill name (supports namespace prefix, e.g., `project:my-skill`, `user:my-skill`) |

### Return Value

Returns a confirmation message of successful skill loading, including available scripts and file list.

**Example Return**:
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

The skill content is injected into the session context in XML format:

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Claude Code tool mapping...]
  
  <content>
[Actual SKILL.md content]
  </content>
</skill>
```

### Namespace Support

Use namespace prefixes to precisely specify skill source:

| Namespace | Description | Example |
|--- | --- | ---|
| `project:` | Project-level OpenCode skills | `project:my-skill` |
| `user:` | User-level OpenCode skills | `user:my-skill` |
|--- | --- | ---|
|--- | --- | ---|
| No prefix | Uses default priority | `my-skill` |

### Error Handling

| Error Type | Return Message |
|--- | ---|
| Skill not found | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### Auto-injection Features

When loading a skill, the plugin automatically:

1. Lists all files in the skill directory (excluding SKILL.md)
2. Lists all executable scripts
3. Injects Claude Code tool mapping (if required by the skill)

### Usage Examples

**Load skill**:
```
User input:
Help me perform a code review

AI calls:
use_skill({
  "skill": "code-review"
})
```

**Specify source using namespace**:
```
AI calls:
use_skill({
  "skill": "user:git-helper"
})
```

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Tool | File Path | Line Range |
|--- | --- | ---|
| GetAvailableSkills tool | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| ReadSkillFile tool | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| RunSkillScript tool | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| UseSkill tool | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| Tool registration | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Skill type definition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Script type definition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| SkillLabel type definition | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| resolveSkill function | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**Key Types**:
- `Skill`: Complete skill metadata (name, description, path, scripts, template, etc.)
- `Script`: Script metadata (relativePath, absolutePath)
- `SkillLabel`: Skill source identifier (project, user, claude-project, etc.)

**Key Functions**:
- `resolveSkill()`: Resolve skill name, supports namespace prefixes
- `isPathSafe()`: Validate path safety, prevent directory traversal
- `findClosestMatch()`: Fuzzy match suggestion

</details>

---

## Coming Up Next

This course has completed the API tool reference documentation for OpenCode Agent Skills.

For more information, please check:
- [Skill Development Best Practices](../best-practices/) - Learn techniques and standards for writing high-quality skills
- [Troubleshooting](../../faq/troubleshooting/) - Solve common issues when using the plugin
