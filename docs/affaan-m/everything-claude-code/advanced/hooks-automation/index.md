---
title: "Hooks Automation: Deep Dive Guide | Everything Claude Code"
sidebarTitle: "Hooks Automation"
subtitle: "Hooks Automation: 15+ Hooks Deep Dive"
description: "Learn 15+ automation hooks in Everything Claude Code. Tutorial covers 6 hook types, 14 core features, and Node.js script implementation."
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# Hooks Automation: Deep Dive into 15+ Hooks

## What You'll Learn

- Understand the 6 hook types in Claude Code and their trigger mechanisms
- Master the functionality and configuration of 14 built-in hooks
- Learn to customize hooks using Node.js scripts
- Automatically save and load context at session start/end
- Implement smart compression suggestions, auto code formatting, and other automation features

## Your Current Challenge

You want Claude Code to automatically execute certain operations when specific events occur, such as:
- Automatically loading previous context when a session starts
- Automatically formatting code after each edit
- Reminding you to review changes before pushing code
- Suggesting context compression at appropriate times

But these features require manual triggering, or you need a deep understanding of Claude Code's hooks system to implement them. This lesson will help you master these automation capabilities.

## When to Use This Approach

- Need to maintain context and workflow state across sessions
- Want automatic code quality checks (formatting, TypeScript checks)
- Want reminders before specific operations (e.g., check changes before git push)
- Need to optimize token usage and compress context at appropriate times
- Want to automatically extract reusable patterns from sessions

## Core Approach

**What are Hooks**

**Hooks** are an automation mechanism provided by Claude Code that can trigger custom scripts when specific events occur. It acts like an "event listener" that automatically executes predefined operations when conditions are met.

::: info How Hooks Work

```
User Action → Trigger Event → Hook Check → Execute Script → Return Result
     ↓           ↓            ↓           ↓           ↓
   Use Tool   PreToolUse   Match Condition   Node.js Script   Console Output
```

For example, when you use the Bash tool to execute `npm run dev`:
1. PreToolUse Hook detects the command pattern
2. If not in tmux, automatically blocks and prompts you
3. After seeing the prompt, you use the correct method to start

:::

**6 Hook Types**

Everything Claude Code uses 6 hook types:

| Hook Type | Trigger Timing | Use Cases |
| --------- | -------------- | --------- |
| **PreToolUse** | Before any tool executes | Validate commands, block operations, show suggestions |
| **PostToolUse** | After any tool executes | Auto-format, type checking, log records |
| **PreCompact** | Before context compression | Save state, log compression events |
| **SessionStart** | When a new session starts | Load context, detect package manager |
| **SessionEnd** | When a session ends | Save state, evaluate session, extract patterns |
| **Stop** | At the end of each response | Check modified files, remind cleanup |

::: tip Hook Execution Order

In a complete session lifecycle, hooks execute in the following order:

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

Where `[PreToolUse → PostToolUse]` repeats each time a tool is used.

:::

**Hook Matching Rules**

Each hook uses a `matcher` expression to decide whether to execute. Claude Code uses JavaScript expressions that can check:

- Tool type: `tool == "Bash"`, `tool == "Edit"`
- Command content: `tool_input.command matches "npm run dev"`
- File path: `tool_input.file_path matches "\\.ts$"`
- Combined conditions: `tool == "Bash" && tool_input.command matches "git push"`

**Why Use Node.js Scripts**

All hooks in Everything Claude Code use Node.js scripts instead of shell scripts. The reasons are:

| Advantage | Shell Script | Node.js Script |
| --------- | ------------ | -------------- |
| **Cross-platform** | ❌ Requires Windows/macOS/Linux branches | ✅ Automatically cross-platform |
| **JSON Processing** | ❌ Needs extra tools (jq) | ✅ Native support |
| **File Operations** | ⚠️ Complex commands | ✅ Clean fs API |
| **Error Handling** | ❌ Manual implementation needed | ✅ Native try/catch support |

## Follow Along

### Step 1: View Current Hooks Configuration

**Why**
Understand existing hooks configuration and know which automation features are enabled

```bash
## View hooks.json configuration
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**You should see**: A JSON configuration file containing definitions for 6 hook types

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### Step 2: Understand PreToolUse Hooks

**Why**
PreToolUse is the most commonly used hook type, capable of blocking operations or providing suggestions

Let's look at the 5 PreToolUse hooks in Everything Claude Code:

#### 1. Tmux Dev Server Block

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**Function**: Blocks starting dev servers outside tmux

**Why needed**: Running dev servers in tmux allows detaching sessions, so you can continue viewing logs even after closing Claude Code

#### 2. Git Push Reminder

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**Function**: Reminds you to review changes before `git push`

**Why needed**: Avoid accidentally committing unreviewed code

#### 3. Block Random MD Files

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**Function**: Blocks creating non-documentation .md files

**Why needed**: Avoid scattered documentation and keep projects clean

#### 4. Suggest Compact

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**Function**: Suggests context compression when editing or writing files

**Why needed**: Manually compress at appropriate times to keep context concise

### Step 3: Understand PostToolUse Hooks

**Why**
PostToolUse automatically executes after operations complete, suitable for automated quality checks

Everything Claude Code has 4 PostToolUse hooks:

#### 1. Auto Format

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**Function**: Automatically runs Prettier formatting after editing .js/.ts/.jsx/.tsx files

**Why needed**: Keep code style consistent

#### 2. TypeScript Check

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**Function**: Automatically runs TypeScript type checking after editing .ts/.tsx files

**Why needed**: Detect type errors early

#### 3. Console.log Warning

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**Function**: Checks for console.log statements after editing files

**Why needed**: Avoid committing debug code

#### 4. Log PR URL

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**Function**: Automatically outputs PR URL and review command after creating a PR

**Why needed**: Convenient quick access to newly created PRs

### Step 4: Understand Session Lifecycle Hooks

**Why**
SessionStart and SessionEnd hooks are used for context persistence across sessions

#### SessionStart Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**Functions**:
- Check session files from the last 7 days
- Check learned skills
- Detect package manager
- Output loadable context information

**Script Logic** (`session-start.js`):

```javascript
// Check session files from last 7 days
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// Check learned skills
const learnedSkills = findFiles(learnedDir, '*.md');

// Detect package manager
const pm = getPackageManager();

// If using default value, prompt selection
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### SessionEnd Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**Functions**:
- Create or update session file
- Record session start and end times
- Generate session template (Completed, In Progress, Notes)

**Session File Template** (`session-end.js`):

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

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
[relevant files]
```

The `[Session context goes here]` and `[relevant files]` in the template are placeholders; you need to manually fill in the actual session content and relevant files.

### Step 5: Understand Compression-Related Hooks

**Why**
PreCompact and Stop hooks are used for context management and compression decisions

#### PreCompact Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**Functions**:
- Log compression events to log file
- Mark compression timing in active session file

**Script Logic** (`pre-compact.js`):

```javascript
// Log compression event
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// Mark in session file
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Stop Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**Function**: Checks all modified files for console.log

**Why needed**: As a final line of defense, avoid committing debug code

### Step 6: Understand Continuous Learning Hook

**Why**
Evaluate Session Hook extracts reusable patterns from sessions

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**Functions**:
- Read session transcript
- Count user messages
- If session length is sufficient (default > 10 messages), prompt evaluation of extractable patterns

**Script Logic** (`evaluate-session.js`):

```javascript
// Read configuration
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// Count user messages
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// Skip short sessions
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// Prompt evaluation
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### Step 7: Customize Hooks

**Why**
Create your own automation rules based on project requirements

**Example: Block dangerous commands in production**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**Configuration Steps**:

1. Create custom hook script:
   ```bash
   # Create scripts/hooks/custom-hook.js
   vi scripts/hooks/custom-hook.js
   ```

2. Edit `~/.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. Restart Claude Code

**You should see**: Hook output when triggered

## Checkpoint ✅

Confirm you understand the following points:

- [ ] Hooks are event-driven automation mechanisms
- [ ] Claude Code has 6 hook types
- [ ] PreToolUse triggers before tool execution and can block operations
- [ ] PostToolUse triggers after tool execution, suitable for automated checks
- [ ] SessionStart/SessionEnd are used for context persistence across sessions
- [ ] Everything Claude Code uses Node.js scripts for cross-platform compatibility
- [ ] You can customize hooks by modifying `~/.claude/settings.json`

## Common Pitfalls

### ❌ Hook script errors cause session hang

**Problem**: After a hook script throws an exception, it doesn't exit correctly, causing Claude Code to wait for timeout

**Cause**: Errors in Node.js scripts are not properly caught

**Solution**:
```javascript
// Wrong example
main();  // If this throws an exception, it causes problems

// Correct example
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // Exit normally even on error
});
```

### ❌ Using shell scripts causes cross-platform issues

**Problem**: Shell scripts fail when running on Windows

**Cause**: Shell commands are incompatible across different operating systems

**Solution**: Use Node.js scripts instead of shell scripts

| Function | Shell Script | Node.js Script |
| -------- | ----------- | -------------- |
| File Read | `cat file.txt` | `fs.readFileSync('file.txt')` |
| Directory Check | `[ -d dir ]` | `fs.existsSync(dir)` |
| Environment Variable | `$VAR` | `process.env.VAR` |

### ❌ Excessive hook output causes context bloat

**Problem**: Each operation outputs large amounts of debug information, causing context to bloat quickly

**Cause**: Hook scripts use too many console.log statements

**Solution**:
- Only output necessary information
- Use `console.error` for important alerts (highlighted by Claude Code)
- Use conditional output, only print when needed

```javascript
// Wrong example
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // Too much output

// Correct example
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ PreToolUse Hook blocks necessary operations

**Problem**: Hook matching rules are too broad and incorrectly block normal operations

**Cause**: matcher expression doesn't accurately match scenarios

**Solution**:
- Test matcher expression accuracy
- Add more conditions to limit trigger scope
- Provide clear error messages and resolution suggestions

```json
// Wrong example: matches all npm commands
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// Correct example: only matches dev commands
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## Lesson Summary

**6 Hook Types Summary**:

| Hook Type | Trigger Timing | Typical Uses | Everything Claude Code Count |
| --------- | -------------- | ------------ | ---------------------------- |
| PreToolUse | Before tool execution | Validate, block, suggest | 5 |
| PostToolUse | After tool execution | Format, check, record | 4 |
| PreCompact | Before context compression | Save state | 1 |
| SessionStart | New session start | Load context, detect PM | 1 |
| SessionEnd | Session end | Save state, evaluate session | 2 |
| Stop | Response end | Check modifications | 1 |

**Key Points**:

1. **Hooks are event-driven**: Automatically execute at specific events
2. **Matcher determines triggering**: Use JavaScript expressions to match conditions
3. **Node.js script implementation**: Cross-platform compatible, avoid shell scripts
4. **Error handling is important**: Scripts should exit normally even on errors
5. **Output should be concise**: Avoid excessive logs causing context bloat
6. **Configuration in settings.json**: Add custom hooks by modifying `~/.claude/settings.json`

**Best Practices**:

```
1. Use PreToolUse to validate dangerous operations
2. Use PostToolUse to automate quality checks
3. Use SessionStart/End to persist context
4. Test matcher expressions when customizing hooks
5. Use try/catch and process.exit(0) in scripts
6. Only output necessary info to avoid context bloat
```

## Next Lesson Preview

> In the next lesson, we'll learn about **[Continuous Learning Mechanism](../continuous-learning/)**.
>
> You will learn:
> - How Continuous Learning automatically extracts reusable patterns
> - Using `/learn` command to manually extract patterns
> - Configure minimum session length for evaluation
> - Manage learned skills directory

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-25

| Function | File Path | Line Numbers |
| -------- | --------- | ------------ |
| Hooks main config | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| SessionStart script | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd script | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact script | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact script | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session script | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Utility library | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| Package manager detection | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**Key Constants**:
- None (configuration dynamically loaded)

**Key Functions**:
- `getSessionsDir()`: Get session directory path
- `getLearnedSkillsDir()`: Get learned skills directory path
- `findFiles(dir, pattern, options)`: Find files with time filtering support
- `ensureDir(path)`: Ensure directory exists, create if not
- `getPackageManager()`: Detect package manager (supports 6 priorities)
- `log(message)`: Output Hook log information

**Key Configuration**:
- `min_session_length`: Minimum messages for session evaluation (default 10)
- `COMPACT_THRESHOLD`: Threshold for suggesting compression (default 50 tool calls)
- `CLAUDE_PLUGIN_ROOT`: Plugin root directory environment variable

**14 Core Hooks**:
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>
