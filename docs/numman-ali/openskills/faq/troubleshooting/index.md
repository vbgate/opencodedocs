---
title: "Troubleshooting: Fix Common Errors | OpenSkills"
sidebarTitle: "Troubleshooting"
subtitle: "Troubleshooting: Solve OpenSkills Common Problems"
description: "Learn to fix common OpenSkills errors: Git clone failures, SKILL.md issues, permission errors, and update problems. Step-by-step troubleshooting guide."
tags:
  - FAQ
  - Troubleshooting
  - Error Resolution
prerequisite:
  - "start-quick-start"
  - "start-installation"
order: 2
---

# Troubleshooting: Solve OpenSkills Common Problems

## What You'll Learn

After completing this lesson, you will be able to:

- Quickly diagnose and fix common issues when using OpenSkills
- Understand the causes behind error messages
- Master techniques for troubleshooting Git clone, permission, and file format problems
- Learn when you need to reinstall skills

## Your Current Challenges

You encounter errors when using OpenSkills and don't know what to do:

```
Error: No SKILL.md files found in repository
```

Or git clone failures, permission errors, incorrect file formats... These issues can prevent skills from working properly.

## When to Use This Tutorial

When you encounter the following situations:

- **Installation failed**: Error when installing from GitHub or local path
- **Read failed**: `openskills read` prompts that skills cannot be found
- **Sync failed**: `openskills sync` prompts no skills or file format error
- **Update failed**: `openskills update` skips certain skills
- **Permission error**: Prompts path access restricted or security error

## Core Approach

OpenSkills errors mainly fall into 4 categories:

| Error Type | Common Causes | Solution Approach |
|--- | --- | ---|
| **Git-related** | Network issues, SSH configuration, repository doesn't exist | Check network, configure Git credentials, verify repository URL |
| **File-related** | SKILL.md missing, format error, path error | Check file existence, verify YAML format |
| **Permission-related** | Directory permissions, path traversal, symlinks | Check directory permissions, verify installation path |
| **Metadata-related** | Metadata lost during update, source path changed | Reinstall skill to restore metadata |

**Troubleshooting tips**:
1. **Read error messages**: Red output usually contains specific causes
2. **Check yellow prompts**: Usually warnings and suggestions, such as `Tip: For private repos...`
3. **Check directory structure**: Use `openskills list` to view installed skills
4. **View source code locations**: Error messages list search paths (4 directories)

---

## Installation Failures

### Problem 1: Git Clone Failed

**Error message**:
```
Failed to clone repository
fatal: repository '...' not found
Tip: For private repos, ensure git SSH keys or credentials are configured
```

**Possible causes**:

| Cause | Scenario |
|--- | ---|
| Repository doesn't exist | Misspelled owner/repo |
| Private repository | SSH key or Git credentials not configured |
| Network issues | Cannot access GitHub |

**Solution**:

1. **Verify repository URL**:
   ```bash
   # Visit repository URL in browser
   https://github.com/owner/repo
   ```

2. **Check Git configuration** (for private repositories):
   ```bash
   # Check SSH configuration
   ssh -T git@github.com

   # Configure Git credentials
   git config --global credential.helper store
   ```

3. **Test clone**:
   ```bash
   git clone https://github.com/owner/repo.git
   ```

**What You Should See**:
- Repository successfully cloned to local directory

---

### Problem 2: SKILL.md Not Found

**Error message**:
```
Error: No SKILL.md files found in repository
Error: No valid SKILL.md files found
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Repository has no SKILL.md | Repository is not a skill repository |
| SKILL.md has no frontmatter | Missing YAML metadata |
| SKILL.md format error | YAML syntax error |

**Solution**:

1. **Check repository structure**:
   ```bash
   # View repository root directory
   ls -la

   # Check if SKILL.md exists
   find . -name "SKILL.md"
   ```

2. **Verify SKILL.md format**:
   ```markdown
   ---
   name: skill-name
   description: skill description
   ---

   Skill content...
   ```

   **Must have**:
   - YAML frontmatter separated by `---` at the beginning
   - Contains `name` and `description` fields

3. **View official examples**:
   ```bash
   git clone https://github.com/anthropics/skills.git
   cd skills
   ls -la
   ```

**What You Should See**:
- Repository contains one or more `SKILL.md` files
- Each SKILL.md has YAML frontmatter at the beginning

---

### Problem 3: Path Doesn't Exist or Not a Directory

**Error message**:
```
Error: Path does not exist: /path/to/skill
Error: Path must be a directory
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Misspelled path | Entered wrong path |
| Path points to file | Should be a directory, not a file |
| Path not expanded | Need to expand when using `~` |

**Solution**:

1. **Verify path exists**:
   ```bash
   # Check path
   ls -la /path/to/skill

   # Check if it's a directory
   file /path/to/skill
   ```

2. **Use absolute path**:
   ```bash
   # Get absolute path
   realpath /path/to/skill

   # Use absolute path when installing
   openskills install /absolute/path/to/skill
   ```

3. **Use relative path**:
   ```bash
   # In project directory
   openskills install ./skills/my-skill
   ```

**What You Should See**:
- Path exists and is a directory
- Directory contains `SKILL.md` file

---

### Problem 4: Invalid SKILL.md

**Error message**:
```
Error: Invalid SKILL.md (missing YAML frontmatter)
```

**Possible causes**:

| Cause | Description |
|--- | ---|
|--- | ---|
| Missing required fields | Must have `name` and `description` |
| YAML syntax error | Format issues with colons, quotes, etc. |

**Solution**:

1. **Check YAML frontmatter**:
   ```markdown
   ---              ← Start separator
   name: my-skill   ← Required
   description: skill description  ← Required
   ---              ← End separator
   ```

2. **Use online YAML validation tool**:
   - Visit YAML Lint or similar tools to verify syntax

3. **Reference official examples**:
   ```bash
   openskills install anthropics/skills
   cat .claude/skills/*/SKILL.md | head -20
   ```

**What You Should See**:
- SKILL.md has correct YAML frontmatter at the beginning
- Contains `name` and `description` fields

---

### Problem 5: Path Traversal Security Error

**Error message**:
```
Security error: Installation path outside target directory
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Skill name contains `..` | Attempting to access path outside target directory |
| Symlink points outside | symlink points outside target directory |
| Malicious skill | Skill attempting to bypass security restrictions |

**Solution**:

1. **Check skill name**:
   - Ensure skill name doesn't contain `..`, `/`, or other special characters

2. **Check symlinks**:
   ```bash
   # View symlinks in skill directory
   find .claude/skills/skill-name -type l

   # View symlink target
   ls -la .claude/skills/skill-name
   ```

3. **Use safe skills**:
   - Only install skills from trusted sources
   - Review skill code before installation

**What You Should See**:
- Skill name only contains letters, numbers, hyphens
- No symlinks pointing outside

---

## Read Failures

### Problem 6: Skill Not Found

**Error message**:
```
Error: Skill(s) not found: my-skill

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Skill not installed | Skill not installed in any directory |
| Misspelled skill name | Name doesn't match |
| Installed in other location | Skill installed in non-standard directory |

**Solution**:

1. **View installed skills**:
   ```bash
   openskills list
   ```

2. **Check skill name**:
   - Compare with `openskills list` output
   - Ensure exact match (case-sensitive)

3. **Install missing skill**:
   ```bash
   openskills install owner/repo
   ```

4. **Search all directories**:
   ```bash
   # Check 4 skill directories
   ls -la .agent/skills/
   ls -la ~/.agent/skills/
   ls -la .claude/skills/
   ls -la ~/.claude/skills/
   ```

**What You Should See**:
- `openskills list` shows target skill
- Skill exists in one of the 4 directories

---

### Problem 7: No Skill Name Provided

**Error message**:
```
Error: No skill names provided
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Forgot to pass arguments | No arguments after `openskills read` |
| Empty string | Passed empty string |

**Solution**:

1. **Provide skill name**:
   ```bash
   # Single skill
   openskills read my-skill

   # Multiple skills (comma-separated)
   openskills read skill1,skill2,skill3
   ```

2. **View available skills first**:
   ```bash
   openskills list
   ```

**What You Should See**:
- Successfully read skill content to standard output

---

## Sync Failures

### Problem 8: Output File Is Not Markdown

**Error message**:
```
Error: Output file must be a markdown file (.md)
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Output file is not .md | Specified .txt, .json, etc. formats |
| --output parameter error | Path doesn't end with .md |

**Solution**:

1. **Use .md file**:
   ```bash
   # Correct
   openskills sync -o AGENTS.md
   openskills sync -o custom.md

   # Wrong
   openskills sync -o AGENTS.txt
   openskills sync -o AGENTS
   ```

2. **Custom output path**:
   ```bash
   # Output to subdirectory
   openskills sync -o .ruler/AGENTS.md
   openskills sync -o docs/agents.md
   ```

**What You Should See**:
- Successfully generated .md file
- File contains skill XML sections

---

### Problem 9: No Skills Installed

**Error message**:
```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Never installed skills | First time using OpenSkills |
| Deleted skill directory | Manually deleted skill files |

**Solution**:

1. **Install skills**:
   ```bash
   # Install official skills
   openskills install anthropics/skills

   # Install from other repositories
   openskills install owner/repo
   ```

2. **Verify installation**:
   ```bash
   openskills list
   ```

**What You Should See**:
- `openskills list` shows at least one skill
- Sync successful

---

## Update Failures

### Problem 10: No Source Metadata

**Error message**:
```
Skipped: my-skill (no source metadata; re-install once to enable updates)
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Old version installation | Skill installed before metadata feature |
| Manual copy | Directly copied skill directory, not installed via OpenSkills |
| Metadata file corrupted | `.openskills.json` corrupted or lost |

**Solution**:

1. **Reinstall skill**:
   ```bash
   # Remove old skill
   openskills remove my-skill

   # Reinstall
   openskills install owner/repo
   ```

2. **Check metadata file**:
   ```bash
   # View skill metadata
   cat .claude/skills/my-skill/.openskills.json
   ```

3. **Keep skill but add metadata**:
   - Manually create `.openskills.json` (not recommended)
   - Reinstalling is simpler and more reliable

**What You Should See**:
- Update successful, no skip warnings

---

### Problem 11: Local Source Missing

**Error message**:
```
Skipped: my-skill (local source missing)
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Local path moved | Source directory location changed |
| Local path deleted | Source directory doesn't exist |
| Path not expanded | Used `~` but metadata stored expanded path |

**Solution**:

1. **Check local path in metadata**:
   ```bash
   cat .claude/skills/my-skill/.openskills.json
   ```

2. **Restore source directory or update metadata**:
   ```bash
   # If source directory moved
   openskills remove my-skill
   openskills install /new/path/to/skill

   # Or manually edit metadata (not recommended)
   vi .claude/skills/my-skill/.openskills.json
   ```

**What You Should See**:
- Local source path exists and contains `SKILL.md`

---

### Problem 12: SKILL.md Not Found in Repository

**Error message**:
```
SKILL.md missing for my-skill
Skipped: my-skill (SKILL.md not found in repo at subpath)
```

**Possible causes**:

| Cause | Description |
|--- | ---|
| Repository structure changed | Skill subpath or name changed |
| Skill deleted | Repository no longer contains this skill |
| Incorrect subpath | Subpath recorded in metadata is incorrect |

**Solution**:

1. **Visit repository to view structure**:
   ```bash
   # Clone repository to view
   git clone https://github.com/owner/repo.git
   cd repo
   ls -la
   find . -name "SKILL.md"
   ```

2. **Reinstall skill**:
   ```bash
   openskills remove my-skill
   openskills install owner/repo/subpath
   ```

3. **Check repository update history**:
   - View commit history on GitHub
   - Find records of skill moves or deletions

**What You Should See**:
- Update successful
- SKILL.md exists in recorded subpath

---

## Permission Issues

### Problem 13: Directory Permissions Restricted

**Symptoms**:

| Operation | Symptom |
|--- | ---|
| Installation failed | Prompts permission error |
| Deletion failed | Prompts unable to delete file |
| Read failed | Prompts file access restricted |

**Possible causes**:

| Cause | Description |
|--- | ---|
| Insufficient directory permissions | User doesn't have write permission |
| Insufficient file permissions | File is read-only |
| System protection | macOS SIP, Windows UAC restrictions |

**Solution**:

1. **Check directory permissions**:
   ```bash
   # View permissions
   ls -la .claude/skills/

   # Modify permissions (use cautiously)
   chmod -R 755 .claude/skills/
   ```

2. **Use sudo (not recommended)**:
   ```bash
   # Last resort
   sudo openskills install owner/repo
   ```

3. **Check system protection**:
   ```bash
   # macOS: Check SIP status
   csrutil status

   # If you need to disable SIP (requires recovery mode)
   # Not recommended, use only when necessary
   ```

**What You Should See**:
- Normal read/write of directories and files

---

## Symlink Issues

### Problem 14: Broken Symlink

**Symptoms**:

| Symptom | Description |
|--- | ---|
| Skipped skill in list | `openskills list` doesn't show the skill |
| Read failed | Prompts file doesn't exist |
| Update failed | Invalid source path |

**Possible causes**:

| Cause | Description |
|--- | ---|
| Target directory deleted | Symlink points to non-existent path |
| Symlink corrupted | Link file itself corrupted |
|--- | ---|

**Solution**:

1. **Check symlinks**:
   ```bash
   # Find all symlinks
   find .claude/skills -type l

   # View link target
   ls -la .claude/skills/my-skill

   # Test link
   readlink .claude/skills/my-skill
   ```

2. **Delete broken symlink**:
   ```bash
   openskills remove my-skill
   ```

3. **Reinstall**:
   ```bash
   openskills install owner/repo
   ```

**What You Should See**:
- No broken symlinks
- Skills display and read normally

---

## Common Pitfalls

::: warning Common Mistakes

**❌ Don't do this**:

- **Directly copy skill directory** → Will cause metadata loss, update failures
- **Manually edit `.openskills.json`** → Easy to break format, causing update failures
- **Use sudo to install skills** → Will create root-owned files, subsequent operations may need sudo
- **Delete `.openskills.json`** → Will cause skill to be skipped during updates

**✅ Do this instead**:

- Install via `openskills install` → Automatically creates metadata
- Remove via `openskills remove` → Correctly cleans up files
- Update via `openskills update` → Automatically refreshes from source
- Check via `openskills list` → Confirm skill status

:::

::: tip Troubleshooting Tips

1. **Start simple**: First run `openskills list` to confirm status
2. **Read complete error messages**: Yellow prompts usually contain resolution suggestions
3. **Check directory structure**: Use `ls -la` to view files and permissions
4. **Verify source code locations**: Error messages list 4 search directories
5. **Use -y to skip interaction**: Use `-y` flag in CI/CD or scripts

:::

---

## Lesson Summary

In this lesson, we learned troubleshooting and fixing methods for common OpenSkills problems:

| Problem Type | Key Solutions |
|--- | ---|
| Git clone failed | Check network, configure credentials, verify repository URL |
| SKILL.md not found | Check repository structure, verify YAML format |
| Read failed | Check skill status with `openskills list` |
| Update failed | Reinstall skill to restore metadata |
| Permission issues | Check directory permissions, avoid using sudo |

**Remember**:
- Error messages usually contain clear hints
- Reinstalling is the simplest way to resolve metadata issues
- Only install skills from trusted sources

## Next Steps

- **View [FAQ](../faq/)** → Answers to more questions
- **Learn [Best Practices](../../advanced/best-practices/)** → Avoid common mistakes
- **Explore [Security Guide](../../advanced/security/)** → Understand security mechanisms

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Git clone failure handling | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L162-L168) | 162-168 |
| Path doesn't exist error | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L205-L207) | 205-207 |
| Not a directory error | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L210-L213) | 210-213 |
| Invalid SKILL.md | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L241-L243) | 241-243 |
| Path traversal security error | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L256-L259) | 256-259 |
| SKILL.md not found | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L378-L380) | 378-380 |
| No skill name provided | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L10-L12) | 10-12 |
| Skill not found | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L26-L34) | 26-34 |
| Output file not Markdown | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L23-L25) | 23-25 |
| No skills installed | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L40-L43) | 40-43 |
| No source metadata skip | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L57-L61) | 57-61 |
| Local source missing | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L66-L71) | 66-71 |
| SKILL.md not found in repo | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L102-L107) | 102-107 |

**Key functions**:
- `hasValidFrontmatter(content)`: Validates if SKILL.md has valid YAML frontmatter
- `isPathInside(targetPath, targetDir)`: Validates if path is within target directory (security check)
- `findSkill(name)`: Searches for skill in 4 directories by priority
- `readSkillMetadata(path)`: Reads skill's installation source metadata

**Key constants**:
- Search directory order (`src/utils/skills.ts`):
  1. `.agent/skills/` (project universal)
  2. `~/.agent/skills/` (global universal)
  3. `.claude/skills/` (project)
  4. `~/.claude/skills/` (global)

</details>
