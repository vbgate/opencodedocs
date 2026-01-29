---
title: "Troubleshooting: Common Issues | OpenCode Agent Skills"
sidebarTitle: "Troubleshooting"
subtitle: "Troubleshooting: Common Issues | OpenCode Agent Skills"
description: "Learn to resolve common issues with the OpenCode Agent Skills plugin. Fix skill loading failures, script execution errors, path security issues, and model loading problems quickly."
tags:
  - "troubleshooting"
  - "faq"
prerequisite: []
order: 1
---

# Troubleshooting

::: info
This tutorial is suitable for all users experiencing usage issues, whether or not you're already familiar with the plugin's basic functionality. If you encounter issues like skill loading failures, script execution errors, or want to learn troubleshooting methods for common problems, this lesson will help you quickly identify and resolve these common issues.
:::

## What You'll Learn

- Quickly identify causes of skill loading failures
- Resolve script execution errors and permission issues
- Understand path security restriction principles
- Troubleshoot semantic matching and model loading issues

## Skill Not Found

### Symptoms
When calling `get_available_skills`, it returns `No skills found matching your query`.

### Possible Causes
1. Skill not installed in discovery paths
2. Skill name typo
3. SKILL.md format doesn't conform to specifications

### Solutions

**Check if skill is in discovery paths**:

The plugin searches for skills in the following priority order (first match wins):

| Priority | Path | Type |
|--- | --- | ---|
| 1 | `.opencode/skills/` | Project-level (OpenCode) |
| 2 | `.claude/skills/` | Project-level (Claude) |
| 3 | `~/.config/opencode/skills/` | User-level (OpenCode) |
| 4 | `~/.claude/skills/` | User-level (Claude) |
| 5 | `~/.claude/plugins/cache/` | Plugin cache |
| 6 | `~/.claude/plugins/marketplaces/` | Installed plugins |

Verify commands:
```bash
# Check project-level skills
ls -la .opencode/skills/
ls -la .claude/skills/

# Check user-level skills
ls -la ~/.config/opencode/skills/
ls -la ~/.claude/skills/
```

**Validate SKILL.md format**:

Skill directory must contain a `SKILL.md` file with format conforming to Anthropic Skills Spec:

```yaml
---
name: skill-name
description: Brief description of the skill
license: MIT
allowed-tools:
  - read
  - write
metadata:
  author: your-name
---

Skill content section...
```

Must-check items:
- ✅ `name` must be lowercase letters, numbers, and hyphens (e.g., `git-helper`)
- ✅ `description` cannot be empty
- ✅ YAML frontmatter must be wrapped with `---`
- ✅ Skill content must follow the second `---`

**Use fuzzy matching**:

The plugin provides spelling suggestions. For example:
```
No skills found matching "git-helper". Did you mean "git-helper-tool"?
```

If you see a similar prompt, retry with the suggested name.

---

## Skill Does Not Exist Error

### Symptoms
When calling `use_skill("skill-name")`, it returns `Skill "skill-name" not found`.

### Possible Causes
1. Skill name typo
2. Skill overridden by another skill with the same name (priority conflict)
3. Skill directory missing SKILL.md or has incorrect format

### Solutions

**View all available skills**:

```bash
Use get_available_skills tool to list all skills
```

**Understand priority override rules**:

If multiple paths have skills with the same name, only the **highest priority** one takes effect. For example:
- Project-level `.opencode/skills/git-helper/` → ✅ Takes effect
- User-level `~/.config/opencode/skills/git-helper/` → ❌ Overridden

Check for name conflicts:
```bash
# Search for all skills with the same name
find .opencode/skills .claude/skills ~/.config/opencode/skills ~/.claude/skills \
  -name "git-helper" -type d
```

**Verify SKILL.md exists**:

```bash
# Enter skill directory
cd .opencode/skills/git-helper/

# Check SKILL.md
ls -la SKILL.md

# Check if YAML format is correct
head -10 SKILL.md
```

---

## Script Execution Failed

### Symptoms
When calling `run_skill_script`, it returns script error or non-zero exit code.

### Possible Causes
1. Incorrect script path
2. Script doesn't have executable permission
3. Script itself has logic errors

### Solutions

**Check if script is in the skill's scripts list**:

When loading a skill, available scripts are listed:
```
Skill loaded. Available scripts:
- tools/build.sh
- scripts/setup.js
```

If calling a non-existent script:
```
Script "build.sh" not found in skill "my-skill". Available scripts: tools/build.sh, scripts/setup.js
```

**Use correct relative path**:

Script paths are relative to the skill directory—don't include leading `/`:
- ✅ Correct: `tools/build.sh`
- ❌ Incorrect: `/tools/build.sh`

**Grant executable permissions to script**:

The plugin only executes files with the executable bit set (`mode & 0o111`).

::: code-group

```bash [macOS/Linux]
# Grant executable permission
chmod +x .opencode/skills/my-skill/tools/build.sh

# Verify permission
ls -la .opencode/skills/my-skill/tools/build.sh
# Output should include: -rwxr-xr-x
```

```powershell [Windows]
# Windows doesn't use Unix permission bits, ensure script extension association is correct
# PowerShell scripts: .ps1
# Bash scripts (via Git Bash): .sh
```

:::

**Debug script execution errors**:

If a script returns an error, the plugin shows exit code and output:
```
Script failed (exit 1): Error: Build failed at /path/to/script.js:42
```

Manual debugging:
```bash
# Enter skill directory
cd .opencode/skills/my-skill/

# Execute script directly to see detailed error
./tools/build.sh
```

---

## Path Not Safe Error

### Symptoms
When calling `read_skill_file` or `run_skill_script`, it returns a path not safe error.

### Possible Causes
1. Path contains `..` (directory traversal)
2. Path is an absolute path
3. Path contains non-standard characters

### Solutions

**Understand path security rules**:

The plugin prohibits accessing files outside the skill directory to prevent directory traversal attacks.

Allowed path examples (relative to skill directory):
- ✅ `docs/guide.md`
- ✅ `config/settings.json`
- ✅ `tools/setup.sh`

Forbidden path examples:
- ❌ `../../../etc/passwd` (directory traversal)
- ❌ `/tmp/file.txt` (absolute path)
- ❌ `./../other-skill/file.md` (traversal to other directory)

**Use relative paths**:

Always use paths relative to the skill directory—don't start with `/` or `../`:
```bash
# Read skill documentation
read_skill_file("my-skill", "docs/guide.md")

# Execute skill script
run_skill_script("my-skill", "tools/build.sh")
```

**List available files**:

If unsure of file names, first check the skill file list:
```
After calling use_skill, it returns:
Available files:
- docs/guide.md
- config/settings.json
- README.md
```

---

## Embedding Model Loading Failed

### Symptoms
Semantic matching fails to work, logs show `Model failed to load`.

### Possible Causes
1. Network connection issues (first-time model download)
2. Model file corrupted
3. Cache directory permission issues

### Solutions

**Check network connection**:

On first use, the plugin needs to download the `all-MiniLM-L6-v2` model (~238MB) from Hugging Face. Ensure your network can access Hugging Face.

**Clear and re-download model**:

Model is cached in `~/.cache/opencode-agent-skills/`:

```bash
# Delete cache directory
rm -rf ~/.cache/opencode-agent-skills/

# Restart OpenCode, plugin will automatically re-download the model
```

**Check cache directory permissions**:

```bash
# View cache directory
ls -la ~/.cache/opencode-agent-skills/

# Ensure read/write permissions
chmod -R 755 ~/.cache/opencode-agent-skills/
```

**Manually verify model loading**:

If issue persists, check detailed errors in plugin logs:
```
View OpenCode logs, search for "embedding" or "model"
```

---

## SKILL.md Parsing Failed

### Symptoms
Skill directory exists but not discovered by plugin, or returns format error when loading.

### Possible Causes
1. YAML frontmatter format error
2. Required fields missing
3. Field values don't meet validation rules

### Solutions

**Check YAML format**:

SKILL.md structure must be as follows:

```markdown
---
name: my-skill
description: Skill description
---

Skill content...
```

Common errors:
- ❌ Missing `---` delimiter
- ❌ Incorrect YAML indentation (YAML uses 2-space indentation)
- ❌ Missing space after colon

**Validate required fields**:

| Field | Type | Required | Constraints |
|--- | --- | --- | ---|
| name | string | ✅ | Lowercase alphanumeric hyphens, non-empty |
| description | string | ✅ | Non-empty |

**Test YAML validity**:

Use online tools to validate YAML format:
- [YAML Lint](https://www.yamllint.com/)

Or use command line tools:
```bash
# Install yamllint
pip install yamllint

# Validate file
yamllint SKILL.md
```

**Check skill content area**:

Skill content must follow the second `---`:

```markdown
---
name: my-skill
description: Skill description
---

Skill content starts here, will be injected into AI's context...
```

If skill content is empty, the plugin ignores the skill.

---

## Auto Recommendation Not Working

### Symptoms
After sending relevant messages, AI doesn't receive skill recommendation prompts.

### Possible Causes
1. Similarity below threshold (default 0.35)
2. Skill description not detailed enough
3. Model not loaded

### Solutions

**Improve skill description quality**:

The more specific the skill description, the more accurate the semantic matching.

| ❌ Poor description | ✅ Good description |
|--- | ---|
| "Git tool" | "Help execute Git operations: create branches, commit code, merge PRs, resolve conflicts" |
| "Test helper" | "Generate unit tests, run test suites, analyze test coverage, fix failing tests" |

**Manually call skill**:

If auto recommendation doesn't work, load manually:

```
Use use_skill("skill-name") tool
```

**Adjust similarity threshold** (advanced):

Default threshold is 0.35. If you feel recommendations are too few, adjust in source code (`src/embeddings.ts:10`):

```typescript
export const SIMILARITY_THRESHOLD = 0.35; // Lowering this value will increase recommendations
```

::: warning
Modifying source code requires recompiling the plugin—not recommended for regular users.
:::

---

## Skills Failed After Context Compaction

### Symptoms
After long conversations, AI seems to "forget" loaded skills.

### Possible Causes
1. Plugin version below v0.1.0
2. Session initialization not completed

### Solutions

**Verify plugin version**:

Compaction recovery is supported in v0.1.0+. If plugin is installed via npm, check version:

```bash
# Check package.json in OpenCode plugin directory
cat ~/.config/opencode/plugins/opencode-agent-skills/package.json | grep version
```

**Confirm session initialization completed**:

Plugin injects skill list on first message. If session initialization is not complete, compaction recovery may fail.

Symptoms:
- No skill list shown after first message
- AI doesn't know about available skills

**Restart session**:

If issue persists, delete current session and create a new one:
```
Delete session in OpenCode, start new conversation
```

---

## Script Recursive Search Failed

### Symptoms
Skill contains deeply nested scripts but not discovered by plugin.

### Possible Causes
1. Recursive depth exceeds 10 levels
2. Script in hidden directory (starts with `.`)
3. Script in dependency directory (like `node_modules`)

### Solutions

**Understand recursive search rules**:

When plugin recursively searches for scripts:
- Max depth: 10 levels
- Skip hidden directories (directory name starts with `.`): `.git`, `.vscode`, etc.
- Skip dependency directories: `node_modules`, `__pycache__`, `vendor`, `.venv`, `venv`, `.tox`, `.nox`

**Adjust script location**:

If script is in deep directory, you can:
- Move to shallower directory (like `tools/` instead of `src/lib/utils/tools/`)
- Use symlink to script location (Unix systems)

```bash
# Create symlink
ln -s ../../../scripts/build.sh tools/build.sh
```

**List discovered scripts**:

After loading skill, plugin returns script list. If script is not in list, check:
1. File has executable permissions
2. Directory matches skip rules

---

## Summary

This lesson covered 9 common issues when using the OpenCode Agent Skills plugin:

| Issue Type | Key Check Points |
|--- | ---|
| Skill not found | Discovery paths, SKILL.md format, spelling |
| Skill does not exist | Name correctness, priority override, file existence |
| Script execution failed | Script path, executable permissions, script logic |
| Path not safe | Relative path, no `..`, no absolute path |
| Model loading failed | Network connection, cache cleanup, directory permissions |
| Parsing failed | YAML format, required fields, skill content |
| Auto recommendation not working | Description quality, similarity threshold, manual call |
| Skills failed after context compaction | Plugin version, session initialization |
| Script recursive search failed | Depth limit, directory skip rules, executable permissions |

---

## Next Lesson Preview

> Next, we'll learn **[Security Considerations](../security-considerations/)**.
>
> You'll learn:
> - Plugin security mechanism design
> - How to write secure skills
> - Path validation and permission control principles
> - Security best practices

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Function | File Path | Line Numbers |
|--- | --- | ---|
| Skill query fuzzy match suggestions | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L49-L59) | 49-59 |
| Skill not found error handling | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L89-L97) | 89-97 |
| Script not found error handling | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L167-L177) | 167-177 |
| Script execution failed error handling | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L184-L195) | 184-195 |
| Path security check | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| SKILL.md parsing error handling | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L127-L152) | 127-152 |
| Model loading failed error | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L38-L40) | 38-40 |
| Fuzzy matching algorithm | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**Key Constants**:
- `SIMILARITY_THRESHOLD = 0.35` (Similarity threshold): `src/embeddings.ts:10`
- `TOP_K = 5` (Number of most similar skills to return): `src/embeddings.ts:11`

**Other Important Values**:
- `maxDepth = 10` (Max recursion depth for script search, default parameter for findScripts function): `src/skills.ts:59`
- `0.4` (Fuzzy match threshold, return condition for findClosestMatch function): `src/utils.ts:124`

**Key Functions**:
- `findClosestMatch()`: Fuzzy matching algorithm for generating spelling suggestions
- `isPathSafe()`: Path security check to prevent directory traversal
- `ensureModel()`: Ensure embedding model is loaded
- `parseSkillFile()`: Parse SKILL.md and validate format

</details>
