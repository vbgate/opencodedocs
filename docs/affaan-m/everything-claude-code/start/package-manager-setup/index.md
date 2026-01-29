---
title: "Package Manager: Auto Detection | Everything Claude Code"
sidebarTitle: "Package Manager"
subtitle: "Package Manager Setup: Automatic Detection and Customization"
description: "Learn how Everything Claude Code auto-detects package managers (npm/pnpm/yarn/bun) using 6-layer priority. Master global and project-level configuration."
tags:
  - "package-manager"
  - "configuration"
  - "npm"
  - "pnpm"
prerequisite:
  - "start-installation"
order: 30
---

# Package Manager Setup: Automatic Detection and Customization

## What You'll Learn

- ✅ Automatically detect the package manager used in your current project (npm/pnpm/yarn/bun)
- ✅ Understand the 6-layer detection priority mechanism
- ✅ Configure package managers at both global and project levels
- ✅ Use the `/setup-pm` command for quick setup
- ✅ Handle scenarios with different package managers across multiple projects

## Your Current Problem

You have more and more projects. Some use npm, some use pnpm, and others use yarn or bun. Every time you enter a command in Claude Code, you have to recall:

- Does this project use `npm install` or `pnpm install`?
- Should you use `npx`, `pnpm dlx`, or `bunx`?
- Are scripts run with `npm run dev`, `pnpm dev`, or `bun run dev`?

Remember wrong once, and the command fails—wasting your time.
## When to Use This

- **When starting a new project**: Configure immediately after determining which package manager to use
- **When switching projects**: Verify current detection is correct
- **For team collaboration**: Ensure all team members use the same command style
- **Multi-package manager environments**: Global config + project override for flexible management

::: tip Why Configure Package Managers?
Everything Claude Code's hooks and agents automatically generate package manager-related commands. If detection is incorrect, all commands will use the wrong tool, causing operations to fail.
:::

## 🎒 Prerequisites

::: warning Prerequisites Check
Before starting this lesson, ensure you have completed the [Installation Guide](../installation/) and the plugin is correctly installed in Claude Code.
:::

Check if package managers are installed on your system:

```bash
# Check installed package managers
which npm pnpm yarn bun

# Or on Windows (PowerShell)
Get-Command npm, pnpm, yarn, bun -ErrorAction SilentlyContinue
```

If you see output similar to this, they're installed:

```
/usr/local/bin/npm
/usr/local/bin/pnpm
```

If a package manager is not found, you need to install it first (this lesson doesn't cover installation tutorials).
## Core Concepts

Everything Claude Code uses an **intelligent detection mechanism** that automatically selects a package manager based on a 6-layer priority system. You only need to configure once in the most appropriate place, and it will work correctly in all scenarios.

### Detection Priority (Highest to Lowest)

```
1. Environment Variable CLAUDE_PACKAGE_MANAGER  ─── Highest priority, temporary override
2. Project Config .claude/package-manager.json  ─── Project-level override
3. package.json packageManager Field  ─── Project standard
4. Lock Files (pnpm-lock.yaml, etc.)  ─── Auto detection
5. Global Config ~/.claude/package-manager.json  ─── Global default
6. Fallback: First available in order  ─── Fallback mechanism
```

### This Design Choice

- **Environment variable highest**: Convenient for temporary switching (e.g., CI/CD environments)
- **Project config second**: Forces consistency within the same project
- **package.json field**: This is the Node.js standard specification
- **Lock files**: Files actually used by the project
- **Global config**: Personal default preference
- **Fallback**: Ensures there's always a working tool available
## Follow Along

### Step 1: Detect Current Settings

**Why**
First, understand the current detection situation to confirm whether manual configuration is needed.

```bash
# Detect current package manager
node scripts/setup-package-manager.js --detect
```

**You should see**:

```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ npm
  ✓ pnpm (current)
  ✗ yarn
  ✓ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

If the displayed package manager matches your expectation, detection is correct and no manual configuration is needed.
### Step 2: Configure Global Default Package Manager

**Why**
Set a global default for all your projects to reduce repetitive configuration.

```bash
# Set global default to pnpm
node scripts/setup-package-manager.js --global pnpm
```

**You should see**:

```
✓ Global preference set to: pnpm
  Saved to: ~/.claude/package-manager.json
```

Check the generated configuration file:

```bash
cat ~/.claude/package-manager.json
```

**You should see**:

```json
{
  "packageManager": "pnpm",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```
### Step 3: Configure Project-Level Package Manager

**Why**
Some projects may need to use a specific package manager (e.g., depending on specific features). Project-level configuration overrides global settings.

```bash
# Set bun for current project
node scripts/setup-package-manager.js --project bun
```

**You should see**:

```
✓ Project preference set to: bun
  Saved to: .claude/package-manager.json
```

Check the generated configuration file:

```bash
cat .claude/package-manager.json
```

**You should see**:

```json
{
  "packageManager": "bun",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

::: tip Project-Level vs Global Config
- **Global config**: ~/.claude/package-manager.json, affects all projects
- **Project config**: .claude/package-manager.json, only affects current project, higher priority
:::
### Step 4: Use the /setup-pm Command (Optional)

**Why**
If you don't want to manually run scripts, you can use the slash command directly in Claude Code.

Enter in Claude Code:

```
/setup-pm
```

Claude Code will call the script and display interactive options.

**You should see** similar detection output:

```
[PackageManager] Available package managers:
  - npm
  - pnpm (current)
  - bun

To set your preferred package manager:
  - Global: Set CLAUDE_PACKAGE_MANAGER environment variable
  - Or add to ~/.claude/package-manager.json: {"packageManager": "pnpm"}
  - Or add to package.json: {"packageManager": "pnpm@8"}
```
### Step 5: Verify Detection Logic

**Why**
After understanding detection priority, you can predict results in different scenarios.

Let's test a few scenarios:

**Scenario 1: Lock File Detection**

```bash
# Delete project config
rm .claude/package-manager.json

# Detect
node scripts/setup-package-manager.js --detect
```

**You should see** `Source: lock-file` (if lock file exists)

**Scenario 2: package.json Field**

```bash
# Add to package.json
cat >> package.json << 'EOF'
  "packageManager": "pnpm@8.6.0"
EOF

# Detect
node scripts/setup-package-manager.js --detect
```

**You should see** `From package.json: pnpm@8.6.0`

**Scenario 3: Environment Variable Override**

```bash
# Temporarily set environment variable
export CLAUDE_PACKAGE_MANAGER=yarn

# Detect
node scripts/setup-package-manager.js --detect
```

**You should see** `Source: environment` and `Package Manager: yarn`

```bash
# Clear environment variable
unset CLAUDE_PACKAGE_MANAGER
```
## Checkpoint ✅

Ensure all checkpoints pass:

- [ ] Running `--detect` command correctly identifies the current package manager
- [ ] Global configuration file created: `~/.claude/package-manager.json`
- [ ] Project configuration file created (if needed): `.claude/package-manager.json`
- [ ] Override relationships of different priorities work as expected
- [ ] Listed available package managers match actual installations
## Common Pitfalls

### ❌ Error 1: Configuration Set But Not Taking Effect

**Symptom**: You configured `pnpm` but detection shows `npm`.

**Causes**:
- Lock file priority is higher than global config (if lock file exists)
- The `packageManager` field in package.json also has higher priority than global config

**Solution**:
```bash
# Check detection source
node scripts/setup-package-manager.js --detect

# If it's lock file or package.json, check these files
ls -la | grep -E "(package-lock|yarn.lock|pnpm-lock|bun.lockb)"
cat package.json | grep packageManager
```

### ❌ Error 2: Configured Non-Existent Package Manager

**Symptom**: Configured `bun` but it's not installed on the system.

**Detection result** will show:

```
Available package managers:
  ✓ npm
  ✗ bun (current)  ← Note: marked as current but not installed
```

**Solution**: Install the package manager first, or configure another one that's already installed.

```bash
# Detect available package managers
node scripts/setup-package-manager.js --list

# Switch to an installed one
node scripts/setup-package-manager.js --global npm
```

### ❌ Error 3: Windows Path Issues

**Symptom**: Script fails on Windows, unable to find file.

**Cause**: Node.js script path separator issues (source code handles this, but ensure using the correct command).

**Solution**: Use PowerShell or Git Bash, ensure paths are correct:

```powershell
# PowerShell
node scripts\setup-package-manager.js --detect
```

### ❌ Error 4: Project Config Affects Other Projects

**Symptom**: Project A configured with `bun`, after switching to Project B still uses `bun`.

**Cause**: Project config only takes effect in the current project directory, redetection occurs after switching directories.

**Solution**: This is normal behavior. Project config only affects the current project and won't pollute other projects.
## Lesson Summary

Everything Claude Code's package manager detection mechanism is very intelligent:

- **6-layer priority**: Environment variable > Project config > package.json > Lock file > Global config > Fallback
- **Flexible configuration**: Supports global default and project override
- **Automatic detection**: No manual configuration needed in most cases
- **Unified commands**: Once configured, all hooks and agents use the correct commands

**Recommended Configuration Strategy**:

1. Globally set your most frequently used package manager (e.g., `pnpm`)
2. Override at project level for special projects (e.g., depending on `bun`'s performance)
3. Let automatic detection handle other cases

## Next Lesson Preview

> In the next lesson, we'll learn about **[MCP Server Setup](../mcp-setup/)**.
>
> You'll learn:
> - How to configure 15+ pre-configured MCP servers
> - How MCP servers extend Claude Code's capabilities
> - How to manage MCP server enablement status and Token usage
---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature                    | File Path                                                                                      | Lines   |
| ----------------------- | --------------------------------------------------------------------------------------------- | ------- |
| Package manager detection core logic     | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L157-L236)         | 157-236 |
| Lock file detection          | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L92-L102)          | 92-102  |
| package.json detection      | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L107-L126)          | 107-126 |
| Package manager definitions (config)    | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L13-L54)           | 13-54   |
| Detection priority definition          | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L57)                | 57      |
| Global config save            | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L241-L252)         | 241-252 |
| Project config save            | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L257-L272)         | 257-272 |
| Command line script entry          | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L158-L206)   | 158-206 |
| Detection command implementation            | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L62-L95)    | 62-95   |
| /setup-pm command definition     | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md#L1-L81)               | 1-81    |

**Key Constants**:
- `PACKAGE_MANAGERS`: Supported package managers and their command configs (lines 13-54)
- `DETECTION_PRIORITY`: Detection priority order `['pnpm', 'bun', 'yarn', 'npm']` (line 57)

**Key Functions**:
- `getPackageManager()`: Core detection logic, returns package manager by priority (lines 157-236)
- `detectFromLockFile()`: Detect package manager from lock file (lines 92-102)
- `detectFromPackageJson()`: Detect package manager from package.json (lines 107-126)
- `setPreferredPackageManager()`: Save global config (lines 241-252)
- `setProjectPackageManager()`: Save project config (lines 257-272)

**Detection Priority Implementation** (source code lines 157-236):
```javascript
function getPackageManager(options = {}) {
  // 1. Environment variable (highest priority)
  if (envPm && PACKAGE_MANAGERS[envPm]) { return { name: envPm, source: 'environment' }; }

  // 2. Project config
  if (projectConfig) { return { name: config.packageManager, source: 'project-config' }; }

  // 3. package.json field
  if (fromPackageJson) { return { name: fromPackageJson, source: 'package.json' }; }

  // 4. Lock file
  if (fromLockFile) { return { name: fromLockFile, source: 'lock-file' }; }

  // 5. Global config
  if (globalConfig) { return { name: globalConfig.packageManager, source: 'global-config' }; }

  // 6. Fallback: Find first available by priority
  for (const pmName of fallbackOrder) {
    if (available.includes(pmName)) { return { name: pmName, source: 'fallback' }; }
  }

  // Default npm
  return { name: 'npm', source: 'default' };
}
```

</details>
