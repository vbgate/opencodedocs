---
title: "Scripts API: Node.js Interfaces | Everything Claude Code"
sidebarTitle: "Scripts API"
subtitle: "Scripts API Reference: Node.js Script Interfaces"
description: "Learn Everything Claude Code's Node.js script API. Reference for platform detection, file operations, package manager detection, and Hook automation scripts."
tags:
  - "scripts"
  - "api"
  - "nodejs"
  - "hooks"
  - "automation"
prerequisite:
  - "start-installation"
  - "advanced-hooks-automation"
order: 220
---

# Scripts API Reference: Node.js Script Interfaces

## What You'll Learn

- Fully understand Everything Claude Code's script API interfaces
- Use platform detection and cross-platform utility functions
- Configure and use automatic package manager detection mechanisms
- Write custom hook scripts to extend automation capabilities
- Debug and modify existing script implementations

## Your Current Challenge

You already know Everything Claude Code has many automation scripts, but you face these problems:

- "What specific APIs do these Node.js scripts provide?"
- "How do I customize hook scripts?"
- "What is the priority for package manager detection?"
- "How do I implement cross-platform compatibility in scripts?"

This tutorial will provide you with a complete Scripts API reference handbook.

## Core Approach

Everything Claude Code's script system is divided into two categories:

1. **Shared Utility Library** (`scripts/lib/`) - Provides cross-platform functions and APIs
2. **Hook Scripts** (`scripts/hooks/`) - Automation logic triggered by specific events

All scripts support **Windows, macOS, and Linux** platforms, implemented using Node.js native modules.

### Script Structure

```
scripts/
├── lib/
│   ├── utils.js              # Common utility functions
│   └── package-manager.js    # Package manager detection
├── hooks/
│   ├── session-start.js       # SessionStart Hook
│   ├── session-end.js         # SessionEnd Hook
│   ├── pre-compact.js        # PreCompact Hook
│   ├── suggest-compact.js     # PreToolUse Hook
│   └── evaluate-session.js   # Stop Hook
└── setup-package-manager.js   # Package manager setup script
```

## lib/utils.js - Common Utility Functions

This module provides cross-platform utility functions, including platform detection, file operations, system commands, and more.

### Platform Detection

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| Function | Type | Return Value | Description |
|--- | --- | --- | ---|
| `isWindows` | boolean | `true/false` | Whether current platform is Windows |
| `isMacOS` | boolean | `true/false` | Whether current platform is macOS |
| `isLinux` | boolean | `true/false` | Whether current platform is Linux |

**Implementation**: Based on `process.platform`

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### Directory Utilities

```javascript
const {
  getHomeDir,
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  getTempDir,
  ensureDir
} = require('./lib/utils');
```

#### getHomeDir()

Get user home directory (cross-platform compatible)

**Return Value**: `string` - User home directory path

**Example**:
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

Get Claude Code configuration directory

**Return Value**: `string` - `~/.claude` directory path

**Example**:
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

Get session files directory

**Return Value**: `string` - `~/.claude/sessions` directory path

**Example**:
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

Get learned skills directory

**Return Value**: `string` - `~/.claude/skills/learned` directory path

**Example**:
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

Get system temporary directory (cross-platform)

**Return Value**: `string` - Temporary directory path

**Example**:
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

Ensure directory exists, create if not

**Parameters**:
- `dirPath` (string) - Directory path

**Return Value**: `string` - Directory path

**Example**:
```javascript
const dir = ensureDir('/path/to/new/dir');
// If directory doesn't exist, it will be created recursively
```

### Date Time Utilities

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

Get current date (format: YYYY-MM-DD)

**Return Value**: `string` - Date string

**Example**:
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

Get current time (format: HH:MM)

**Return Value**: `string` - Time string

**Example**:
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

Get current date and time (format: YYYY-MM-DD HH:MM:SS)

**Return Value**: `string` - Date and time string

**Example**:
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### File Operations

```javascript
const {
  findFiles,
  readFile,
  writeFile,
  appendFile,
  replaceInFile,
  countInFile,
  grepFile
} = require('./lib/utils');
```

#### findFiles(dir, pattern, options)

Find files matching pattern in directory (cross-platform `find` alternative)

**Parameters**:
- `dir` (string) - Directory to search
- `pattern` (string) - File pattern (e.g., `"*.tmp"`, `"*.md"`)
- `options` (object, optional) - Options
  - `maxAge` (number) - Maximum file age in days
  - `recursive` (boolean) - Whether to search recursively

**Return Value**: `Array<{path: string, mtime: number}>` - List of matching files, sorted by modification time in descending order

**Example**:
```javascript
// Find .tmp files from last 7 days
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// Recursively find all .md files
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip Cross-platform Compatibility
This function provides cross-platform file search functionality, doesn't rely on Unix `find` command, so it works correctly on Windows.
:::

#### readFile(filePath)

Safely read text file

**Parameters**:
- `filePath` (string) - File path

**Return Value**: `string | null` - File content, returns `null` if read fails

**Example**:
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

Write text file

**Parameters**:
- `filePath` (string) - File path
- `content` (string) - File content

**Return Value**: None

**Example**:
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// If directory doesn't exist, it will be created automatically
```

#### appendFile(filePath, content)

Append content to text file

**Parameters**:
- `filePath` (string) - File path
- `content` (string) - Content to append

**Return Value**: None

**Example**:
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

Replace text in file (cross-platform `sed` alternative)

**Parameters**:
- `filePath` (string) - File path
- `search` (string | RegExp) - Content to find
- `replace` (string) - Replacement content

**Return Value**: `boolean` - Whether replacement succeeded

**Example**:
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: replacement succeeded
// false: file doesn't exist or read failed
```

#### countInFile(filePath, pattern)

Count occurrences of pattern in file

**Parameters**:
- `filePath` (string) - File path
- `pattern` (string | RegExp) - Pattern to count

**Return Value**: `number` - Number of matches

**Example**:
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

Search pattern in file and return matching lines and line numbers

**Parameters**:
- `filePath` (string) - File path
- `pattern` (string | RegExp) - Pattern to search

**Return Value**: `Array<{lineNumber: number, content: string}>` - List of matching lines

**Example**:
```javascript
const matches = grepFile('/path/to/file.txt', /function\s+\w+/);
// [{ lineNumber: 10, content: 'function test() {...}' }]
```

### Hook I/O

```javascript
const {
  readStdinJson,
  log,
  output
} = require('./lib/utils');
```

#### readStdinJson()

Read JSON data from standard input (for Hook input)

**Return Value**: `Promise<object>` - Parsed JSON object

**Example**:
```javascript
async function main() {
  const hookInput = await readStdinJson();
  console.log(hookInput.tool);
  console.log(hookInput.tool_input);
}
```

::: tip Hook Input Format
The input format passed by Claude Code to Hooks is:
```json
{
  "tool": "Bash",
  "tool_input": { "command": "npm run dev" },
  "tool_output": { "output": "..." }
}
```
:::

#### log(message)

Log message to stderr (visible to user)

**Parameters**:
- `message` (string) - Log message

**Return Value**: None

**Example**:
```javascript
log('[SessionStart] Loading context...');
// Output to stderr, visible to user in Claude Code
```

#### output(data)

Output data to stdout (return to Claude Code)

**Parameters**:
- `data` (object | string) - Data to output

**Return Value**: None

**Example**:
```javascript
// Output object (auto JSON serialization)
output({ success: true, message: 'Completed' });

// Output string
output('Hello, Claude');
```

### System Commands

```javascript
const {
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
} = require('./lib/utils');
```

#### commandExists(cmd)

Check if command exists in PATH

**Parameters**:
- `cmd` (string) - Command name

**Return Value**: `boolean` - Whether command exists

**Example**:
```javascript
if (commandExists('pnpm')) {
  console.log('pnpm is available');
}
```

::: warning Security Validation
This function validates command names with regex, only allowing letters, numbers, underscores, dots, and hyphens, preventing command injection.
:::

#### runCommand(cmd, options)

Execute command and return output

**Parameters**:
- `cmd` (string) - Command to execute (must be trusted, hardcoded command)
- `options` (object, optional) - `execSync` options

**Return Value**: `{success: boolean, output: string}` - Execution result

**Example**:
```javascript
const result = runCommand('git status');
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.output);
}
```

::: danger Security Warning
**Only use this function for trusted, hardcoded commands**. Do not pass user-controlled input directly to this function. For user input, use `spawnSync` with parameter arrays.
:::

#### isGitRepo()

Check if current directory is a Git repository

**Return Value**: `boolean` - Whether it's a Git repository

**Example**:
```javascript
if (isGitRepo()) {
  console.log('This is a Git repository');
}
```

#### getGitModifiedFiles(patterns = [])

Get list of Git modified files

**Parameters**:
- `patterns` (string[], optional) - Filter pattern array

**Return Value**: `string[]` - List of modified file paths

**Example**:
```javascript
// Get all modified files
const allModified = getGitModifiedFiles();

// Get only TypeScript files
const tsModified = getGitModifiedFiles([/\.ts$/, /\.tsx$/]);
```

## lib/package-manager.js - Package Manager API

This module provides package manager automatic detection and configuration APIs.

### Supported Package Managers

```javascript
const { PACKAGE_MANAGERS } = require('./lib/package-manager');
```

| Package Manager | Lock File | install Command | run Command | exec Command |
|--- | --- | --- | --- | ---|
| `npm` | package-lock.json | `npm install` | `npm run` | `npx` |
| `pnpm` | pnpm-lock.yaml | `pnpm install` | `pnpm` | `pnpm dlx` |
| `yarn` | yarn.lock | `yarn` | `yarn` | `yarn dlx` |
| `bun` | bun.lockb | `bun install` | `bun run` | `bunx` |

### Detection Priority

```javascript
const { DETECTION_PRIORITY } = require('./lib/package-manager');

// ['pnpm', 'bun', 'yarn', 'npm']
```

Package manager detection follows this priority (high to low):

1. Environment variable `CLAUDE_PACKAGE_MANAGER`
2. Project-level configuration `.claude/package-manager.json`
3. `package.json`'s `packageManager` field
4. Lock file detection
5. Global user preference `~/.claude/package-manager.json`
6. Return first available package manager by priority

### Core Functions

```javascript
const {
  getPackageManager,
  setPreferredPackageManager,
  setProjectPackageManager,
  getAvailablePackageManagers,
  getRunCommand,
  getExecCommand,
  getCommandPattern
} = require('./lib/package-manager');
```

#### getPackageManager(options = {})

Get package manager for current project

**Parameters**:
- `options` (object, optional)
  - `projectDir` (string) - Project directory path, defaults to `process.cwd()`
  - `fallbackOrder` (string[]) - Fallback order, defaults to `['pnpm', 'bun', 'yarn', 'npm']`

**Return Value**: `{name: string, config: object, source: string}`

- `name`: Package manager name
- `config`: Package manager configuration object
- `source`: Detection source (`'environment' | 'project-config' | 'package.json' | 'lock-file' | 'global-config' | 'fallback' | 'default'`)

**Example**:
```javascript
const pm = getPackageManager();
console.log(pm.name);        // 'pnpm'
console.log(pm.source);      // 'lock-file'
console.log(pm.config);      // { name: 'pnpm', lockFile: 'pnpm-lock.yaml', ... }
```

#### setPreferredPackageManager(pmName)

Set global package manager preference

**Parameters**:
- `pmName` (string) - Package manager name (`npm | pnpm | yarn | bun`)

**Return Value**: `object` - Configuration object

**Example**:
```javascript
const config = setPreferredPackageManager('pnpm');
// Saved to ~/.claude/package-manager.json
// { packageManager: 'pnpm', setAt: '2026-01-25T...' }
```

#### setProjectPackageManager(pmName, projectDir)

Set project-level package manager preference

**Parameters**:
- `pmName` (string) - Package manager name
- `projectDir` (string) - Project directory path, defaults to `process.cwd()`

**Return Value**: `object` - Configuration object

**Example**:
```javascript
const config = setProjectPackageManager('bun', '/path/to/project');
// Saved to /path/to/project/.claude/package-manager.json
// { packageManager: 'bun', setAt: '2026-01-25T...' }
```

#### getAvailablePackageManagers()

Get list of installed package managers in system

**Return Value**: `string[]` - Array of available package manager names

**Example**:
```javascript
const available = getAvailablePackageManagers();
// ['pnpm', 'npm']  // If only pnpm and npm are installed
```

#### getRunCommand(script, options = {})

Get command to run script

**Parameters**:
- `script` (string) - Script name (e.g., `"dev"`, `"build"`, `"test"`)
- `options` (object, optional) - Project directory options

**Return Value**: `string` - Complete run command

**Example**:
```javascript
const devCmd = getRunCommand('dev');
// 'npm run dev'  or  'pnpm dev'  or  'bun run dev'

const buildCmd = getRunCommand('build');
// 'npm run build'  or  'pnpm build'
```

**Built-in script shortcuts**:
- `install` → Returns `installCmd`
- `test` → Returns `testCmd`
- `build` → Returns `buildCmd`
- `dev` → Returns `devCmd`
- Other → Returns `${runCmd} ${script}`

#### getExecCommand(binary, args = '', options = {})

Get command to execute package binary

**Parameters**:
- `binary` (string) - Binary name (e.g., `"prettier"`, `"eslint"`)
- `args` (string, optional) - Arguments string
- `options` (object, optional) - Project directory options

**Return Value**: `string` - Complete execution command

**Example**:
```javascript
const cmd = getExecCommand('prettier', '--write file.js');
// 'npx prettier --write file.js'  or  'pnpm dlx prettier --write file.js'

const eslintCmd = getExecCommand('eslint');
// 'npx eslint'  or  'bunx eslint'
```

#### getCommandPattern(action)

Generate regex pattern to match all package manager commands

**Parameters**:
- `action` (string) - Action type (`'dev' | 'install' | 'test' | 'build'` or custom script name)

**Return Value**: `string` - Regex pattern

**Example**:
```javascript
const devPattern = getCommandPattern('dev');
// (npm run dev|pnpm( run)? dev|yarn dev|bun run dev)

const installPattern = getCommandPattern('install');
// (npm install|pnpm install|yarn( install)?|bun install)
```

## setup-package-manager.js - Package Manager Setup Script

This is an executable CLI script for interactively configuring package manager preferences.

### Usage

```bash
# Detect and display current package manager
node scripts/setup-package-manager.js --detect

# Set global preference
node scripts/setup-package-manager.js --global pnpm

# Set project preference
node scripts/setup-package-manager.js --project bun

# List available package managers
node scripts/setup-package-manager.js --list

# Display help
node scripts/setup-package-manager.js --help
```

### Command Line Arguments

| Argument | Description |
|--- | ---|
| `--detect` | Detect and display current package manager |
|--- | ---|
|--- | ---|
| `--list` | List all available package managers |
| `--help` | Display help information |

### Output Example

**--detect output**:
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
  ✓ pnpm (current)
  ✓ npm
  ✗ yarn
  ✗ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

## Hook Scripts Deep Dive

### session-start.js - Session Start Hook

**Hook Type**: `SessionStart`

**Trigger Timing**: When Claude Code session starts

**Functionality**:
- Check recent session files (last 7 days)
- Check learned skills files
- Detect and report package manager
- If package manager detected via fallback, show selection prompt

**Output Example**:
```
[SessionStart] Found 3 recent session(s)
[SessionStart] Latest: /Users/username/.claude/sessions/2026-01-25-session.tmp
[SessionStart] 5 learned skill(s) available in /Users/username/.claude/skills/learned
[SessionStart] Package manager: pnpm (lock-file)
```

### session-end.js - Session End Hook

**Hook Type**: `SessionEnd`

**Trigger Timing**: When Claude Code session ends

**Functionality**:
- Create or update daily session file
- Record session start and end times
- Provide session state template (completed, in progress, notes)

**Session File Template**:
```markdown
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 14:30
**Last Updated:** 15:45

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
```
[relevant files]
```
```

### pre-compact.js - Pre-compact Hook

**Hook Type**: `PreCompact`

**Trigger Timing**: Before Claude Code compresses context

**Functionality**:
- Log compaction event to log file
- Mark compaction time in active session file

**Output Example**:
```
[PreCompact] State saved before compaction
```

**Log File**: `~/.claude/sessions/compaction-log.txt`

### suggest-compact.js - Compaction Suggestion Hook

**Hook Type**: `PreToolUse`

**Trigger Timing**: After each tool call (usually Edit or Write)

**Functionality**:
- Track tool call count
- Suggest manual compaction when threshold reached
- Periodically prompt for compaction timing

**Environment Variables**:
- `COMPACT_THRESHOLD` - Compaction threshold (default: 50)
- `CLAUDE_SESSION_ID` - Session ID

**Output Example**:
```
[StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
[StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
```

::: tip Manual vs Auto Compaction
Why recommend manual compaction?
- Auto compaction usually triggers mid-task, causing context loss
- Manual compaction can preserve important information when switching logic phases
- Compaction timing: exploration phase end, execution phase start, milestone completion
:::

### evaluate-session.js - Session Evaluation Hook

**Hook Type**: `Stop`

**Trigger Timing**: At the end of each AI response

**Functionality**:
- Check session length (based on user message count)
- Evaluate if session contains extractable patterns
- Prompt to save learned skills

**Configuration File**: `skills/continuous-learning/config.json`

**Environment Variables**:
- `CLAUDE_TRANSCRIPT_PATH` - Session transcript file path

**Output Example**:
```
[ContinuousLearning] Session has 25 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/username/.claude/skills/learned
```

::: tip Why Stop instead of UserPromptSubmit?
- Stop triggers once per response (lightweight)
- UserPromptSubmit triggers per message (high latency)
:::

## Custom Hook Scripts

### Creating Custom Hooks

1. **Create script in `scripts/hooks/` directory**

```javascript
#!/usr/bin/env node
/**
 * Custom Hook - Your Description
 *
 * Cross-platform (Windows, macOS, Linux)
 */

const { log, output } = require('../lib/utils');

async function main() {
  // Your logic
  log('[CustomHook] Processing...');
  
  // Output result
  output({ success: true });
  
  process.exit(0);
}

main().catch(err => {
  console.error('[CustomHook] Error:', err.message);
  process.exit(0); // Don't block session
});
```

2. **Configure Hook in `hooks/hooks.json`**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/your-hook.js\""
    }
  ],
  "description": "Your custom hook description"
}
```

3. **Test Hook**

```bash
# Trigger condition in Claude Code, check output
```

### Best Practices

#### 1. Error Handling

```javascript
main().catch(err => {
  console.error('[HookName] Error:', err.message);
  process.exit(0); // Don't block session
});
```

#### 2. Use Utility Library

```javascript
const {
  log,
  readFile,
  writeFile,
  ensureDir
} = require('../lib/utils');
```

#### 3. Cross-platform Paths

```javascript
const path = require('path');
const filePath = path.join(getHomeDir(), '.claude', 'config.json');
```

#### 4. Environment Variables

```javascript
const sessionId = process.env.CLAUDE_SESSION_ID || 'default';
const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
```

## Testing Scripts

### Testing Utility Functions

```javascript
const { findFiles, readFile, writeFile } = require('./lib/utils');

// Test file search
const files = findFiles('/tmp', '*.tmp', { maxAge: 7 });
console.log('Found files:', files);

// Test file read/write
writeFile('/tmp/test.txt', 'Hello, World!');
const content = readFile('/tmp/test.txt');
console.log('Content:', content);
```

### Testing Package Manager Detection

```javascript
const { getPackageManager, getRunCommand } = require('./lib/package-manager');

const pm = getPackageManager();
console.log('Package manager:', pm.name);
console.log('Source:', pm.source);
console.log('Dev command:', getRunCommand('dev'));
```

### Testing Hook Scripts

```bash
# Run hook script directly (need to provide environment variables)
CLAUDE_SESSION_ID=test CLAUDE_TRANSCRIPT_PATH=/tmp/transcript.json \
  node scripts/hooks/session-start.js
```

## Debugging Tips

### 1. Use log Output

```javascript
const { log } = require('../lib/utils');

log('[Debug] Current value:', value);
```

### 2. Catch Errors

```javascript
try {
  // Code that might fail
} catch (err) {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
}
```

### 3. Validate File Paths

```javascript
const path = require('path');
const { existsSync } = require('fs');

const filePath = path.join(getHomeDir(), '.claude', 'config.json');
console.log('Config path:', filePath);
console.log('Exists:', existsSync(filePath));
```

### 4. View Hook Execution Logs

```bash
# In Claude Code, hook stderr output shows in response
# Look for logs with [HookName] prefix
```

## Common Issues

### Q1: Hook script not executing?

**Possible Causes**:
1. Matcher configuration error in `hooks/hooks.json`
2. Incorrect script path
3. Script doesn't have execute permission

**Troubleshooting Steps**:
```bash
# Check script path
ls -la scripts/hooks/

# Manually run script to test
node scripts/hooks/session-start.js

# Verify hooks.json syntax
cat hooks/hooks.json | jq '.'
```

### Q2: Path errors on Windows?

**Cause**: Windows uses backslashes, Unix uses forward slashes

**Solution**:
```javascript
// ❌ Wrong: Hardcoded path separator
const path = 'C:\\Users\\username\\.claude';

// ✅ Correct: Use path.join()
const path = require('path');
const claudePath = path.join(getHomeDir(), '.claude');
```

### Q3: How to debug hook input?

**Method**: Write hook input to temporary file

```javascript
const { writeFileSync } = require('fs');
const path = require('path');

async function main() {
  const hookInput = await readStdinJson();
  
  // Write debug file
  const debugPath = path.join(getTempDir(), 'hook-debug.json');
  writeFileSync(debugPath, JSON.stringify(hookInput, null, 2));
  
  console.error('[Debug] Input saved to:', debugPath);
}
```

## Lesson Summary

This lesson systematically covered Everything Claude Code's Scripts API:

**Core Modules**:
- `lib/utils.js`: Cross-platform utility functions (platform detection, file operations, system commands)
- `lib/package-manager.js`: Package manager detection and configuration APIs
- `setup-package-manager.js`: CLI configuration tool

**Hook Scripts**:
- `session-start.js`: Load context when session starts
- `session-end.js`: Save state when session ends
- `pre-compact.js`: Save state before compaction
- `suggest-compact.js`: Suggest manual compaction timing
- `evaluate-session.js`: Evaluate session to extract patterns

**Best Practices**:
- Use utility library functions to ensure cross-platform compatibility
- Hook scripts don't block sessions (exit code 0 on errors)
- Use `log()` to output debug information
- Use `process.env` to read environment variables

**Debugging Tips**:
- Run scripts directly to test
- Use temporary files to save debug data
- Check matcher configuration and script paths

## Next Lesson Preview

> The next lesson covers **[Test Suite: Running and Customization](../test-suite/)**.
>
> You'll learn:
> - How to run test suites
> - How to write unit tests for utility functions
> - How to write integration tests for hook scripts
> - How to add custom test cases

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature Module | File Path | Line Numbers |
|--- | --- | ---|
| Common Utility Functions | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| Package Manager API | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-391 |
| Package Manager Setup Script | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js) | 1-207 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |

**Key Constants**:
- `DETECTION_PRIORITY = ['pnpm', 'bun', 'yarn', 'npm']`: Package manager detection priority (`scripts/lib/package-manager.js:57`)
- `COMPACT_THRESHOLD`: Compaction suggestion threshold (default 50, can be overridden via environment variable)

**Key Functions**:
- `getPackageManager()`: Detect and select package manager (`scripts/lib/package-manager.js:157`)
- `findFiles()`: Cross-platform file search (`scripts/lib/utils.js:102`)
- `readStdinJson()`: Read hook input (`scripts/lib/utils.js:154`)
- `commandExists()`: Check if command exists (`scripts/lib/utils.js:228`)

**Environment Variables**:
- `CLAUDE_PACKAGE_MANAGER`: Force specify package manager
- `CLAUDE_SESSION_ID`: Session ID
- `CLAUDE_TRANSCRIPT_PATH`: Session transcript file path
- `COMPACT_THRESHOLD`: Compaction suggestion threshold

**Platform Detection**:
- `process.platform === 'win32'`: Windows
- `process.platform === 'darwin'`: macOS
- `process.platform === 'linux'`: Linux

</details>
