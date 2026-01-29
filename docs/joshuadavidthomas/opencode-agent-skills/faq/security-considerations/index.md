---
title: "Security: Protect Your System | OpenCode Agent Skills"
sidebarTitle: "Security"
subtitle: "Security: Protect Your System | OpenCode Agent Skills"
description: "Learn security mechanisms for OpenCode Agent Skills. This tutorial covers path safety, YAML parsing, input validation, and script execution protection."
tags:
  - Security
  - Best Practices
  - FAQ
prerequisite: []
order: 2
---

# Security Considerations

## What You'll Learn

- How the plugin protects your system from security threats
- What security standards skill files must follow
- Best practices for using the plugin safely

## Core Philosophy

The OpenCode Agent Skills plugin runs in your local environment, executing scripts, reading files, and parsing configurations. While powerful, skill files from untrusted sources can introduce security risks.

The plugin is designed with built-in, multi-layered security mechanisms—like layers of defense gates—that protect against threats at every level: from path access and file parsing to script execution. Understanding these mechanisms helps you use the plugin more securely.

## Security Mechanisms Explained

### 1. Path Safety Checks: Preventing Directory Traversal

**The Problem**: If a skill file contains malicious paths (e.g., `../../etc/passwd`), it could access sensitive system files.

**Protection Measures**:

The plugin uses the `isPathSafe()` function (`src/utils.ts:130-133`) to ensure all file access is restricted to within the skill directory:

```typescript
export function isPathSafe(basePath: string, requestedPath: string): boolean {
  const resolved = path.resolve(basePath, requestedPath);
  return resolved.startsWith(basePath + path.sep) || resolved === basePath;
}
```

**How It Works**:
1. Resolves the requested path to an absolute path
2. Checks if the resolved path starts with the skill directory
3. If the path attempts to escape the skill directory (contains `..`), it is immediately rejected

**Real-World Example**:

When the `read_skill_file` tool reads a file (`src/tools.ts:101-103`), it first calls `isPathSafe`:

```typescript
// Security: ensure path doesn't escape skill directory
if (!isPathSafe(skill.path, args.filename)) {
  return `Invalid path: cannot access files outside skill directory.`;
}
```

This means:
- ✅ `docs/guide.md` → Allowed (within skill directory)
- ❌ `../../../etc/passwd` → Rejected (attempting to access system files)
- ❌ `/etc/passwd` → Rejected (absolute path)

::: info Why This Matters
Path traversal attacks are a common vulnerability in web applications. Even though the plugin runs locally, untrusted skills could attempt to access sensitive files like your SSH keys or project configurations.
:::

### 2. Secure YAML Parsing: Preventing Code Execution

**The Problem**: YAML supports custom tags and complex objects. Malicious YAML could execute code through tags like `!!js/function`.

**Protection Measures**:

The plugin uses the `parseYamlFrontmatter()` function (`src/utils.ts:41-49`), which employs strict YAML parsing strategies:

```typescript
export function parseYamlFrontmatter(text: string): Record<string, unknown> {
  try {
    const result = YAML.parse(text, {
      // Use core schema which only supports basic JSON-compatible types
      // This prevents custom tags that could execute code
      schema: "core",
      // Limit recursion depth to prevent DoS attacks
      maxAliasCount: 100,
    });
    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
```

**Key Security Settings**:

| Setting | Purpose |
|--- | ---|
| `schema: "core"` | Only supports basic JSON types (strings, numbers, booleans, arrays, objects), disabling custom tags |
| `maxAliasCount: 100` | Limits YAML alias recursion depth to prevent DoS attacks |

**Real-World Example**:

```yaml
# Malicious YAML example (rejected by core schema)
---
!!js/function >
function () { return "malicious code" }
---

# Correct, safe format
---
name: my-skill
description: A safe skill description
---
```

If YAML parsing fails, the plugin silently skips the skill and continues discovering other skills (`src/skills.ts:142-145`):

```typescript
let frontmatterObj: unknown;
try {
  frontmatterObj = parseYamlFrontmatter(frontmatterText);
} catch {
  return null;  // Parsing failed, skip this skill
}
```

### 3. Input Validation: Strict Zod Schema Checks

**The Problem**: Skill frontmatter fields might not conform to specifications, causing plugin behavior issues.

**Protection Measures**:

The plugin uses Zod Schema (`src/skills.ts:105-114`) for strict frontmatter validation:

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

**Validation Rules**:

| Field | Rules | Rejected Examples |
|--- | --- | ---|
| `name` | Lowercase letters, numbers, hyphens, cannot be empty | `MySkill` (uppercase), `my skill` (spaces) |
| `description` | Cannot be empty | `""` (empty string) |
| `license` | Optional string | - |
| `allowed-tools` | Optional string array | `[123]` (non-string) |
| `metadata` | Optional key-value object (values must be strings) | `{key: 123}` (non-string value) |

**Real-World Example**:

```yaml
# ❌ Incorrect: name contains uppercase letters
---
name: GitHelper
description: Git operations helper
---

# ✅ Correct: follows specifications
---
name: git-helper
description: Git operations helper
---
```

If validation fails, the plugin skips the skill (`src/skills.ts:147-152`):

```typescript
let frontmatter: SkillFrontmatter;
try {
  frontmatter = SkillFrontmatterSchema.parse(frontmatterObj);
} catch (error) {
  return null;  // Validation failed, skip this skill
}
```

### 4. Script Execution Security: Only Execute Executable Files

**The Problem**: If the plugin executes arbitrary files (like configuration files or documentation), it could cause unintended consequences.

**Protection Measures**:

When discovering scripts (`src/skills.ts:59-99`), the plugin only collects files with executable permissions:

```typescript
async function findScripts(skillPath: string, maxDepth: number = 10): Promise<Script[]> {
  const scripts: Script[] = [];
  const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);

  // ... recursive traversal logic ...

  if (stats.isFile()) {
    // Key: only collect files with executable bit
    if (stats.mode & 0o111) {
      scripts.push({
        relativePath: newRelPath,
        absolutePath: fullPath
      });
    }
  }
  // ...
}
```

**Security Features**:

| Check Mechanism | Purpose |
|--- | ---|
| **Executable bit check** (`stats.mode & 0o111`) | Only executes files explicitly marked as executable by the user, preventing accidental execution of documentation or config files |
| **Skip hidden directories** (`entry.name.startsWith('.')`) | Does not scan hidden directories like `.git`, `.vscode`, avoiding scanning too many files |
| **Skip dependency directories** (`skipDirs.has(entry.name)`) | Skips `node_modules`, `__pycache__`, etc., avoiding scanning third-party dependencies |
| **Recursion depth limit** (`maxDepth: 10`) | Limits recursion depth to 10 levels, preventing performance issues from deeply nested malicious skill directories |

**Real-World Example**:

In a skill directory:

```bash
my-skill/
├── SKILL.md
├── deploy.sh          # ✓ Executable (recognized as script)
├── build.sh           # ✓ Executable (recognized as script)
├── README.md          # ✗ Not executable (not recognized as script)
├── config.json        # ✗ Not executable (not recognized as script)
└── node_modules/      # ✗ Skipped (dependency directory)
    └── ...           # ✗ Skipped
```

If you call `run_skill_script("my-skill", "README.md")`, it will return a "not found" error (`src/tools.ts:165-177`) because README.md lacks executable permissions and wasn't recognized as a script (`src/skills.ts:86`).

## Security Best Practices

### 1. Get Skills from Trusted Sources

- ✓ Use official skill repositories or trusted developers
- ✓ Check GitHub stars and contributor activity for skills
- ✗ Don't download and run skills from unknown sources

### 2. Review Skill Content

Before loading a new skill, quickly browse SKILL.md and script files:

```bash
# View skill description and metadata
cat .opencode/skills/skill-name/SKILL.md

# Check script contents
cat .opencode/skills/skill-name/scripts/*.sh
```

Pay special attention to:
- Whether scripts access sensitive system paths (`/etc`, `~/.ssh`)
- Whether scripts install external dependencies
- Whether scripts modify system configurations

### 3. Set Script Permissions Correctly

Only add executable permissions to files that explicitly need execution:

```bash
# Correct: add executable permission for scripts
chmod +x .opencode/skills/my-skill/tools/deploy.sh

# Correct: keep documentation with default permissions (not executable)
# README.md, config.json, etc. don't need execution
```

### 4. Hide Sensitive Files

Don't include sensitive information in skill directories:

- ✗ `.env` files (API keys)
- ✗ `.pem` files (private keys)
- ✗ `credentials.json` (credentials)
- ✓ Use environment variables or external config for sensitive data

### 5. Project-Level Skills Override User-Level Skills

Skill discovery priority (`src/skills.ts:241-246`):

1. `.opencode/skills/` (project-level)
2. `.claude/skills/` (project-level, Claude)
3. `~/.config/opencode/skills/` (user-level)
4. `~/.claude/skills/` (user-level, Claude)
5. `~/.claude/plugins/cache/` (plugin cache)
6. `~/.claude/plugins/marketplaces/` (plugin marketplace)

**Best Practices**:

- Place project-specific skills in `.opencode/skills/`; they automatically override user-level skills with the same name
- Place general skills in `~/.config/opencode/skills/`; available to all projects
- Not recommended: globally install skills from untrusted sources

## Summary

The OpenCode Agent Skills plugin includes multi-layered security protection:

| Security Mechanism | Protection Target | Code Location |
|--- | --- | ---|
| Path safety checks | Prevent directory traversal, limit file access scope | `utils.ts:130-133` |
| Secure YAML parsing | Prevent malicious YAML from executing code | `utils.ts:41-49` |
| Zod Schema validation | Ensure skill frontmatter conforms to specifications | `skills.ts:105-114` |
| Script executable check | Only execute files explicitly marked as executable by user | `skills.ts:86` |
| Directory skip logic | Avoid scanning hidden and dependency directories | `skills.ts:61, 70` |

Remember: security is a shared responsibility. The plugin provides protection mechanisms, but the final decision is in your hands—only use skills from trusted sources and develop the habit of reviewing code.

## Next Lesson

> In the next lesson, we'll learn **[Skill Development Best Practices](../../appendix/best-practices/)**.
>
> You'll see:
> - Naming conventions and description writing tips
> - Directory organization and script usage methods
> - Frontmatter best practices
> - How to avoid common mistakes

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Security Mechanism | File Path | Line Numbers |
|--- | --- | ---|
| Path safety checks | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| Secure YAML parsing | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L56) | 41-56 |
| Zod Schema validation | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| Script executable check | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| Directory skip logic | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61-L70) | 61, 70 |
| Path safety in tools | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L101-L103) | 101-103 |

**Key Functions**:
- `isPathSafe(basePath, requestedPath)`: Validates if a path is safe, preventing directory traversal
- `parseYamlFrontmatter(text)`: Safely parses YAML using core schema and recursion limits
- `SkillFrontmatterSchema`: Zod schema that validates skill frontmatter fields
- `findScripts(skillPath, maxDepth)`: Recursively finds executable scripts, skipping hidden and dependency directories

**Key Constants**:
- `maxAliasCount: 100`: Maximum number of YAML aliases during parsing, preventing DoS attacks
- `maxDepth: 10`: Maximum recursion depth for script discovery
- `0o111`: Executable bit mask (checks if file is executable)

</details>
