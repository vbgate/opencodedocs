---
title: "Security: Path Traversal & Symlink Protection | OpenSkills"
sidebarTitle: "Security"
subtitle: "OpenSkills Security Explained"
description: "Learn OpenSkills security: path traversal protection, symlink handling, and YAML parsing. Covers three-layer security design and local execution benefits."
tags:
  - "Security"
  - "Path Traversal"
  - "Symlinks"
  - "YAML"
prerequisite:
  - "advanced-ci-integration"
order: 7
---

# OpenSkills Security Explained

## What You'll Learn

- Understand OpenSkills's three-layer security protection mechanism
- Learn the principles and protection methods for path traversal attacks
- Master symlink security handling approaches
- Recognize ReDoS risks in YAML parsing and protection measures

## Your Current Challenges

You might have heard that "local execution is safer," but aren't sure what specific security protections exist. Or you're worried when installing skills:
- Will files be written to system directories?
- Could symbolic links pose security risks?
- Are there vulnerabilities when parsing YAML in SKILL.md?

## When to Use This Approach

When you need to:
- Deploy OpenSkills in an enterprise environment
- Audit OpenSkills security
- Evaluate skill management solutions from a security perspective
- Address technical reviews from security teams

## Core Concepts

OpenSkills security design follows three principles:

::: info Three-Layer Security Protection
1. **Input Validation** - Validate all external inputs (paths, URLs, YAML)
2. **Isolated Execution** - Ensure operations are within expected directories
3. **Secure Parsing** - Prevent parser vulnerabilities (ReDoS)
:::

Local execution + no data upload + input validation + path isolation = secure skill management

## Path Traversal Protection

### What is Path Traversal Attack

**Path Traversal** attacks refer to an attacker using sequences like `../` to access files outside the intended directory.

**Example**: Without protection, an attacker might try:
```bash
# Attempt to install to system directory
openskills install malicious/skill --target ../../../etc/

# Attempt to overwrite configuration file
openskills install malicious/skill --target ../../../../.ssh/
```

### OpenSkills Protection Mechanism

OpenSkills uses the `isPathInside` function to verify that the installation path must be within the target directory.

**Source location**: [`src/commands/install.ts:71-78`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78)

```typescript
function isPathInside(targetPath: string, targetDir: string): boolean {
  const resolvedTargetPath = resolve(targetPath);
  const resolvedTargetDir = resolve(targetDir);
  const resolvedTargetDirWithSep = resolvedTargetDir.endsWith(sep)
    ? resolvedTargetDir
    : resolvedTargetDir + sep;
  return resolvedTargetPath.startsWith(resolvedTargetDirWithSep);
}
```

**How it works**:
1. Use `resolve()` to resolve all relative paths to absolute paths
2. Normalize the target directory to ensure it ends with a path separator
3. Check if the target path starts with the target directory

**Installation validation** ([`src/commands/install.ts:257-260`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260)):
```typescript
if (!isPathInside(targetPath, targetDir)) {
  console.error(chalk.red('Security error: Installation path outside target directory'));
  process.exit(1);
}
```

### Verify Protection Effectiveness

**Test scenario**: Attempt path traversal attack

```bash
# Normal installation (succeeds)
openskills install anthropics/skills

# Attempt to use ../ (fails)
openskills install malicious/skill --target ../../../etc/
# Security error: Installation path outside target directory
```

**You should see**: Any installation attempt to escape the target directory is rejected, showing a security error.

## Symlink Security

### Risks of Symlinks

**Symbolic Links (Symlinks)** are shortcuts to other files or directories. Improper handling can lead to:

1. **Information disclosure** - Attackers create symlinks pointing to sensitive files
2. **File overwrite** - Symlinks point to system files, which get overwritten during installation
3. **Circular references** - Symlinks point to themselves, causing infinite recursion

### Dereferencing During Installation

OpenSkills uses `dereference: true` when copying files to dereference symlinks, directly copying the target file.

**Source location**: [`src/commands/install.ts:262`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262)

```typescript
cpSync(skillDir, targetPath, { recursive: true, dereference: true });
```

**Effect**:
- Symlinks are replaced with actual files
- The symlink itself is not copied
- Avoids overwriting files pointed to by symlinks

### Symlink Checks When Finding Skills

OpenSkills supports symlinked skills but checks if they are broken.

**Source location**: [`src/utils/skills.ts:10-25`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync follows symlinks
      return stats.isDirectory();
    } catch {
      // Broken symlink or permission error
      return false;
    }
  }
  return false;
}
```

**Security features**:
- Use `statSync()` to follow symlinks and check the target
- Broken symlinks are skipped (`catch` block)
- No crashes, silent handling

::: tip Use Cases
Symlink support allows you to:
- Use skills directly from git repositories (no copying needed)
- Sync modifications during local development
- Share skill libraries across multiple projects
:::

## YAML Parsing Security

### ReDoS Risk

**Regular Expression Denial of Service (ReDoS)** refers to maliciously crafted inputs causing exponential match times for regex patterns, consuming CPU resources.

OpenSkills needs to parse the YAML frontmatter in SKILL.md:
```yaml
---
name: skill-name
description: Skill description
---
```

### Non-Greedy Regex Protection

OpenSkills uses non-greedy regular expressions to avoid ReDoS.

**Source location**: [`src/utils/yaml.ts:4`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4)

```typescript
export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

**Key points**:
- `+?` is a **non-greedy** quantifier, matching the shortest possible
- `^` and `$` anchor to line start and end
- Only matches a single line, avoiding complex nesting

**Incorrect example (greedy matching)**:
```typescript
// ❌ Dangerous: + will greedily match, potentially encountering backtracking explosion
new RegExp(`^${field}:\\s*(.+)$`, 'm')
```

**Correct example (non-greedy matching)**:
```typescript
// ✅ Safe: +? is non-greedy, stops at the first newline
new RegExp(`^${field}:\\s*(.+?)$`, 'm')
```

## File Permissions and Source Verification

### Inheriting System Permissions

OpenSkills doesn't manage file permissions; it directly inherits the operating system's permission controls:

- Files are owned by the user running OpenSkills
- Directory permissions follow the system umask settings
- Permission management is unified by the filesystem

### Source Verification for Private Repositories

When installing from private git repositories, OpenSkills relies on git's SSH key verification.

**Source location**: [`src/commands/install.ts:167`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167)

::: tip Recommendation
Ensure your SSH key is configured correctly and added to the git server's authorized key list.
:::

## Security of Local Execution

OpenSkills is a purely local tool with no network communication (except for cloning git repositories):

### No Data Upload

| Operation | Data Flow |
|--- | ---|
| Install skill | Git repository → Local |
| Read skill | Local → Standard output |
| Sync AGENTS.md | Local → Local file |
| Update skill | Git repository → Local |

### Privacy Protection

- All skill files are stored locally
- AI agents read through the local filesystem
- No cloud dependencies or telemetry collection

::: info Difference from Marketplace
OpenSkills doesn't depend on Anthropic Marketplace; it runs entirely locally.
:::
## Lesson Summary

OpenSkills's three-layer security protection:

| Security Layer | Protection Measure | Source Location |
|--- | --- | ---|
| **Path Traversal Protection** | `isPathInside()` verifies path is within target directory | `install.ts:71-78` |
| **Symlink Security** | `dereference: true` dereferences symlinks | `install.ts:262` |
| **YAML Parsing Security** | Non-greedy regex `+?` prevents ReDoS | `yaml.ts:4` |

**Remember**:
- Path traversal attacks access files outside intended directories through `../` sequences
- Symlinks need dereferencing or checking to avoid information disclosure and file overwrites
- YAML parsing uses non-greedy regex to avoid ReDoS
- Local execution + no data upload = higher privacy and security

## Up Next

> In the next lesson, we'll learn **[Best Practices](../best-practices/)**
>
> You will learn:
> - Best practices for project configuration
> - Team collaboration solutions for skill management
> - Tips for multi-agent environments
> - Common pitfalls and how to avoid them

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature          | File Path                                                                                     | Line Numbers |
|--- | --- | ---|
| Path traversal protection   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78) | 71-78    |
| Installation path check   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260) | 257-260  |
| Symlink dereferencing | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262) | 262      |
| Update path check   | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L156-L172) | 156-172  |
| Symlink check   | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25) | 10-25    |
| YAML parsing security  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4) | 4        |

**Key functions**:
- `isPathInside(targetPath, targetDir)`: Verify target path is within target directory (prevent path traversal)
- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`: Check if directory or symlink points to directory
- `extractYamlField(content, field)`: Use non-greedy regex to extract YAML field (prevent ReDoS)

**Changelog**:
- [`CHANGELOG.md:64-68`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md#L64-L68) - v1.5.0 Security update notes

</details>
