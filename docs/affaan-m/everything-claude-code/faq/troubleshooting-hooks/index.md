---
title: "Hooks Troubleshooting: Fix Common Issues | Everything Claude Code"
sidebarTitle: "Troubleshooting"
subtitle: "Hooks Not Working: Common Issues and Fixes"
description: "Learn to troubleshoot Everything Claude Code hooks. Diagnose issues like missing env vars, permissions, JSON syntax, and cross-platform compatibility."
tags:
  - "hooks"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "advanced-hooks-automation"
order: 150
---

# Hooks Not Working: Troubleshooting Guide

## Your Current Problem

You've configured Hooks, but they're not working as expected. You might encounter:

- Dev server not blocked from running outside tmux
- No SessionStart or SessionEnd logs visible
- Prettier auto-formatting not working
- TypeScript checks not running
- Strange error messages appearing

Don't worry—these issues usually have clear solutions. This lesson helps you systematically diagnose and fix Hooks-related problems.

## 🎒 Prerequisites

::: warning Before You Start
Ensure you have:
1. ✅ Completed Everything Claude Code [installation](../../start/installation/)
2. ✅ Understood basic concepts of [Hooks Automation](../../advanced/hooks-automation/)
3. ✅ Read the Hooks configuration section in the project README
:::

---

## Common Issue 1: Hooks Not Triggering At All

### Symptoms
After executing commands, you see no `[Hook]` log output, and Hooks seem completely uninvoked.

### Possible Causes

#### Cause A: Incorrect hooks.json Path

**Problem**: `hooks.json` is not in the correct location, so Claude Code can't find the configuration file.

**Solution**:

Verify that `hooks.json` is in the correct location:

```bash
# Should be in one of these locations:
~/.claude/hooks/hooks.json              # User-level configuration (global)
.claude/hooks/hooks.json                 # Project-level configuration
```

**Verification Method**:

```bash
# Check user-level configuration
ls -la ~/.claude/hooks/hooks.json

# Check project-level configuration
ls -la .claude/hooks/hooks.json
```

**If the file doesn't exist**, copy from the Everything Claude Code plugin directory:

```bash
# Assuming plugin is installed at ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/hooks/hooks.json ~/.claude/hooks/
```

#### Cause B: JSON Syntax Errors

**Problem**: `hooks.json` has syntax errors, preventing Claude Code from parsing it.

**Solution**:

Validate JSON format:

```bash
# Use jq or Python to validate JSON syntax
jq empty ~/.claude/hooks/hooks.json
# Or
python3 -m json.tool ~/.claude/hooks/hooks.json > /dev/null
```

**Common Syntax Errors**:
- Missing commas
- Unclosed quotes
- Using single quotes (must use double quotes)
- Incorrect comment format (JSON doesn't support `//` comments)

#### Cause C: Environment Variable CLAUDE_PLUGIN_ROOT Not Set

**Problem**: Hook scripts use `${CLAUDE_PLUGIN_ROOT}` to reference paths, but the environment variable is not set.

**Solution**:

Check if the plugin installation path is correct:

```bash
# View installed plugin paths
ls -la ~/.claude-plugins/
```

Ensure the Everything Claude Code plugin is correctly installed:

```bash
# You should see a directory structure like this:
~/.claude-plugins/everything-claude-code/
├── scripts/
├── hooks/
├── agents/
└── ...
```

**If installed from the plugin marketplace**, the environment variable will be automatically set after restarting Claude Code.

**If manually installed**, check the plugin path in `~/.claude/settings.json`:

```json
{
  "plugins": [
    {
      "name": "everything-claude-code",
      "path": "/path/to/everything-claude-code"
    }
  ]
}
```

---

## Common Issue 2: Specific Hooks Not Triggering

### Symptoms
Some Hooks work (e.g., SessionStart), but others don't trigger (e.g., PreToolUse for formatting).

### Possible Causes

#### Cause A: Incorrect Matcher Expression

**Problem**: The Hook's `matcher` expression has errors, so matching conditions aren't met.

**Solution**:

Check the matcher syntax in `hooks.json`:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\""
}
```

**Important Notes**:
- Tool names must be wrapped in double quotes: `"Edit"`, `"Bash"`
- Backslashes in regular expressions need double escaping: `\\\\.` instead of `\\.`
- File path matching uses the `matches` keyword

**Testing Matchers**:

You can manually test matching logic:

```bash
# Test file path matching
node -e "console.log(/\\\\.(ts|tsx)$/.test('src/index.ts'))"
# Should output: true
```

#### Cause B: Command Execution Failed

**Problem**: The Hook command itself fails to execute, but no error message appears.

**Solution**:

Manually run Hook commands to test:

```bash
# Navigate to plugin directory
cd ~/.claude-plugins/everything-claude-code

# Manually run a Hook script
node scripts/hooks/session-start.js

# Check for error output
```

**Common Failure Causes**:
- Node.js version incompatibility (requires Node.js 14+)
- Missing dependencies (e.g., prettier, typescript not installed)
- Script permission issues (see below)

---

## Common Issue 3: Permission Issues (Linux/macOS)

### Symptoms
You see an error like this:

```
Permission denied: node scripts/hooks/session-start.js
```

### Solution

Grant execute permissions to Hook scripts:

```bash
# Navigate to plugin directory
cd ~/.claude-plugins/everything-claude-code

# Grant execute permissions to all hook scripts
chmod +x scripts/hooks/*.js

# Verify permissions
ls -la scripts/hooks/
# Should see something like: -rwxr-xr-x  session-start.js
```

**Batch Fix All Scripts**:

```bash
# Fix all .js files under scripts
find ~/.claude-plugins/everything-claude-code/scripts -name "*.js" -exec chmod +x {} \;
```

---

## Common Issue 4: Cross-Platform Compatibility Issues

### Symptoms
Works fine on Windows but fails on macOS/Linux, or vice versa.

### Possible Causes

#### Cause A: Path Separators

**Problem**: Windows uses backslashes `\`, Unix uses forward slashes `/`.

**Solution**:

Everything Claude Code scripts already handle cross-platform compatibility (using Node.js `path` module), but if you customize Hooks, note:

**Incorrect**:
```json
{
  "command": "node scripts/hooks\\session-start.js"  // Windows style
}
```

**Correct**:
```json
{
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\"  // Use environment variable and forward slashes
}
```

#### Cause B: Shell Command Differences

**Problem**: Different platforms have different command syntax (e.g., `which` vs `where`).

**Solution**:

Everything Claude Code's `scripts/lib/utils.js` already handles these differences. When customizing Hooks, refer to cross-platform functions in that file:

```javascript
// Cross-platform command detection in utils.js
function commandExists(cmd) {
  if (isWindows) {
    spawnSync('where', [cmd], { stdio: 'pipe' });
  } else {
    spawnSync('which', [cmd], { stdio: 'pipe' });
  }
}
```

---

## Common Issue 5: Auto-Formatting Not Working

### Symptoms
After editing TypeScript files, Prettier doesn't automatically format the code.

### Possible Causes

#### Cause A: Prettier Not Installed

**Problem**: PostToolUse Hook calls `npx prettier`, but it's not installed in the project.

**Solution**:

```bash
# Install Prettier (project-level)
npm install --save-dev prettier
# Or
pnpm add -D prettier

# Or install globally
npm install -g prettier
```

#### Cause B: Prettier Configuration Missing

**Problem**: Prettier can't find a configuration file, so it uses default formatting rules.

**Solution**:

Create a Prettier configuration file:

```bash
# Create .prettierrc in project root
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
```

#### Cause C: File Type Mismatch

**Problem**: The edited file extension is not in the Hook's matching rules.

**Current Matching Rules** (`hooks.json` L92-97):

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**If you need to support other file types** (e.g., `.vue`), modify the configuration:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx|vue)$\""
}
```

---

## Common Issue 6: TypeScript Checks Not Working

### Symptoms
After editing `.ts` files, you don't see type checking error output.

### Possible Causes

#### Cause A: tsconfig.json Missing

**Problem**: Hook scripts search upward for `tsconfig.json`, but can't find it.

**Solution**:

Ensure `tsconfig.json` exists in the project root or a parent directory:

```bash
# Find tsconfig.json
find . -name "tsconfig.json" -type f

# If it doesn't exist, create a basic configuration
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF
```

#### Cause B: TypeScript Not Installed

**Problem**: Hook calls `npx tsc`, but TypeScript is not installed.

**Solution**:

```bash
npm install --save-dev typescript
# Or
pnpm add -D typescript
```

---

## Common Issue 7: SessionStart/SessionEnd Not Triggering

### Symptoms
When starting or ending a session, you don't see `[SessionStart]` or `[SessionEnd]` logs.

### Possible Causes

#### Cause A: Session File Directory Doesn't Exist

**Problem**: The `~/.claude/sessions/` directory doesn't exist, so Hook scripts can't create session files.

**Solution**:

Manually create the directory:

```bash
# macOS/Linux
mkdir -p ~/.claude/sessions

# Windows PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\sessions"
```

#### Cause B: Script Path Incorrect

**Problem**: The script path referenced in `hooks.json` is incorrect.

**Verification Method**:

```bash
# Verify that scripts exist
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-start.js
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-end.js
```

**If they don't exist**, check if the plugin is completely installed:

```bash
# View plugin directory structure
ls -la ~/.claude-plugins/everything-claude-code/
```

---

## Common Issue 8: Dev Server Blocking Not Working

### Symptoms
Running `npm run dev` directly isn't blocked and the dev server starts.

### Possible Causes

#### Cause A: Regular Expression Not Matching

**Problem**: Your dev server command is not in the Hook's matching rules.

**Current Matching Rules** (`hooks.json` L6):

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\""
}
```

**Test Matching**:

```bash
# Test if your command matches
node -e "console.log(/(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)/.test('npm run dev'))"
```

**If you need to support other commands** (e.g., `npm start`), modify `hooks.json`:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (run dev|start)|pnpm( run)? (dev|start)|yarn (dev|start)|bun run (dev|start))\""
}
```

#### Cause B: Not Running in tmux But Not Blocked

**Problem**: Hook should prevent dev server from running outside tmux, but it's not taking effect.

**Check Points**:

1. Confirm Hook command executes successfully:
```bash
# Simulate Hook command
node -e "console.error('[Hook] BLOCKED: Dev server must run in tmux');process.exit(1)"
# Should see error output and exit code 1
```

2. Check if `process.exit(1)` correctly blocks the command:
   - `process.exit(1)` in the Hook command should prevent subsequent command execution

3. If it still doesn't work, you may need to upgrade Claude Code version (Hooks support might require the latest version)

---

## Diagnostic Tools and Tips

### Enable Verbose Logging

View Claude Code's detailed logs to understand Hook execution:

```bash
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait -Tail 50
```

### Manually Test Hooks

Manually run Hook scripts in the terminal to verify their functionality:

```bash
# Test SessionStart
cd ~/.claude-plugins/everything-claude-code
node scripts/hooks/session-start.js

# Test Suggest Compact
node scripts/hooks/suggest-compact.js

# Test PreCompact
node scripts/hooks/pre-compact.js
```

### Check Environment Variables

View Claude Code's environment variables:

```bash
# Add debug output in Hook scripts
node -e "console.log('CLAUDE_PLUGIN_ROOT:', process.env.CLAUDE_PLUGIN_ROOT); console.log('COMPACT_THRESHOLD:', process.env.COMPACT_THRESHOLD)"
```

---

## Checklist ✅

Go through this checklist item by item:

- [ ] `hooks.json` is in the correct location (`~/.claude/hooks/` or `.claude/hooks/`)
- [ ] `hooks.json` JSON format is correct (verified with `jq`)
- [ ] Plugin path is correct (`${CLAUDE_PLUGIN_ROOT}` is set)
- [ ] All scripts have execute permissions (Linux/macOS)
- [ ] Dependency tools are installed (Node.js, Prettier, TypeScript)
- [ ] Session directory exists (`~/.claude/sessions/`)
- [ ] Matcher expressions are correct (regex escaping, quote wrapping)
- [ ] Cross-platform compatibility (using `path` module, environment variables)

---

## When to Seek Help

If the above methods don't solve the problem:

1. **Collect Diagnostic Information**:
    ```bash
    # Output the following information
    echo "Node version: $(node -v)"
    echo "Claude Code version: $(claude-code --version)"
    echo "Plugin path: $(ls -la ~/.claude-plugins/everything-claude-code)"
    echo "Hooks config: $(cat ~/.claude/hooks/hooks.json | jq -c .)"
    ```

2. **Check GitHub Issues**:
    - Visit [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
    - Search for similar issues

3. **Submit an Issue**:
    - Include complete error logs
    - Provide operating system and version information
    - Attach `hooks.json` content (redact sensitive information)

---

## Lesson Summary

Hooks not working usually falls into these categories:

| Issue Type | Common Causes | Quick Diagnosis |
|-----------|---------------|-----------------|
| **Not Triggering At All** | hooks.json path error, JSON syntax errors | Check file location, validate JSON format |
| **Specific Hook Not Triggering** | Matcher expression errors, command execution failures | Check regex syntax, run scripts manually |
| **Permission Issues** | Scripts missing execute permissions (Linux/macOS) | `chmod +x scripts/hooks/*.js` |
| **Cross-Platform Compatibility** | Path separators, Shell command differences | Use `path` module, reference utils.js |
| **Functionality Not Working** | Dependency tools not installed (Prettier, TypeScript) | Install corresponding tools, check config files |

Remember: Most issues can be resolved by checking file paths, validating JSON format, and confirming dependency installation.

---

## Next Lesson Preview

> In the next lesson, we'll learn about **[MCP Connection Troubleshooting](../troubleshooting-mcp/)**.
>
> You will learn:
> - Common MCP server configuration errors
> - How to debug MCP connection issues
> - MCP environment variable and placeholder settings

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-25

| Function                    | File Path                                                                                    | Line Numbers |
| --------------------------- | ------------------------------------------------------------------------------------------- | ----------- |
| Hooks main config           | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158       |
| SessionStart Hook           | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62        |
| SessionEnd Hook             | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83        |
| PreCompact Hook             | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49        |
| Suggest Compact Hook        | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61        |
| Cross-platform utility functions | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384       |

**Key Functions**:
- `getHomeDir()` / `getClaudeDir()` / `getSessionsDir()`: Get configuration directory paths (utils.js 19-34)
- `ensureDir(dirPath)`: Ensure directory exists, create if not (utils.js 54-59)
- `log(message)`: Output logs to stderr (visible in Claude Code) (utils.js 182-184)
- `findFiles(dir, pattern, options)`: Cross-platform file search (utils.js 102-149)
- `commandExists(cmd)`: Check if command exists (cross-platform compatible) (utils.js 228-246)

**Key Regular Expressions**:
- Dev server blocking: `npm run dev|pnpm( run)? dev|yarn dev|bun run dev` (hooks.json 6)
- File edit matching: `\\.(ts|tsx|js|jsx)$` (hooks.json 92)
- TypeScript files: `\\.(ts|tsx)$` (hooks.json 102)

**Environment Variables**:
- `${CLAUDE_PLUGIN_ROOT}`: Plugin root directory path
- `CLAUDE_SESSION_ID`: Session identifier
- `COMPACT_THRESHOLD`: Compression suggestion threshold (default 50)

</details>
