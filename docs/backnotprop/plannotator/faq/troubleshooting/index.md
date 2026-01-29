---
title: "Troubleshooting: Debug Plannotator | Plannotator"
sidebarTitle: "Troubleshooting"
subtitle: "Troubleshooting: Debug Plannotator"
description: "Learn Plannotator debugging methods including log viewing, port conflicts, Hook event debugging, and integration error handling."
tags:
  - "Troubleshooting"
  - "Debugging"
  - "Common Errors"
  - "Log Viewing"
prerequisite:
  - "start-getting-started"
order: 2
---

# Plannotator Troubleshooting

## What You'll Learn

When you encounter issues, you'll be able to:

- Quickly identify the source of problems (port conflicts, Hook event parsing, Git configuration, etc.)
- Diagnose errors through log output
- Apply the correct solution for different error types
- Debug connection issues in remote/Devcontainer modes

## The Problem

Plannotator suddenly stopped working, the browser didn't open, or the Hook output error messages. You don't know how to view logs, and you're unsure which step failed. You may have tried restarting, but the problem persists.

## When to Use This

You need troubleshooting in the following situations:

- Browser doesn't open automatically
- Hook outputs error messages
- Port conflicts prevent startup
- Plan or code review pages display abnormally
- Obsidian/Bear integration fails
- Git diff shows empty

---

## Core Concepts

Plannotator issues typically fall into three categories:

1. **Environment Issues**: Port conflicts, environment variable configuration errors, browser path issues
2. **Data Issues**: Hook event parsing failures, empty plan content, abnormal Git repository status
3. **Integration Issues**: Obsidian/Bear save failures, remote mode connection problems

The core of debugging is **viewing log output**. Plannotator uses `console.error` to output errors to stderr and `console.log` to output normal information to stdout. Distinguishing between these two helps you quickly identify the problem type.

---

## 🎒 Prerequisites

- ✅ Plannotator installed (Claude Code or OpenCode plugin)
- ✅ Basic command line knowledge
- ✅ Familiar with your project directory and Git repository status

---

## Follow Along

### Step 1: Check Log Output

**Why**

All Plannotator errors are output to stderr. Viewing logs is the first step in diagnosing problems.

**How to Do It**

#### In Claude Code

When the Hook triggers Plannotator, error messages display in Claude Code's terminal output:

```bash
# You might see error examples like this
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

#### In OpenCode

OpenCode captures CLI stderr and displays it in the interface:

```
[stderr] Failed to parse hook event from stdin
[stderr] No plan content in hook event
```

**What You Should See**:

- If there are no errors, stderr should be empty or contain only expected prompt messages
- If there are errors, they include the error type (such as EADDRINUSE), error message, and stack trace (if applicable)

---

### Step 2: Handle Port Conflicts

**Why**

Plannotator starts the server on a random port by default. If a fixed port is occupied, the server tries 5 times (with a 500ms delay each time), then reports an error.

**Error Message**:

```
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

**Solutions**

#### Option A: Let Plannotator Automatically Choose Port (Recommended)

Don't set the `PLANNOTATOR_PORT` environment variable—Plannotator will automatically choose an available port.

#### Option B: Use a Fixed Port and Resolve the Conflict

If you must use a fixed port (such as in remote mode), resolve the port conflict:

```bash
# macOS/Linux
lsof -ti:54321 | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 54321 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

Then reset the port:

```bash
# macOS/Linux/WSL
export PLANNOTATOR_PORT=54322

# Windows PowerShell
$env:PLANNOTATOR_PORT = "54322"
```

**Checkpoint ✅**:

- Trigger Plannotator again, the browser should open normally
- If you still get an error, try a different port number

---

### Step 3: Debug Hook Event Parsing Failures

**Why**

Hook event is JSON data read from stdin. If parsing fails, Plannotator cannot continue.

**Error Message**:

```
Failed to parse hook event from stdin
No plan content in hook event
```

**Possible Causes**:

1. Hook event is not valid JSON
2. Hook event is missing the `tool_input.plan` field
3. Hook version incompatible

**Debugging Method**

#### View Hook Event Content

Before the Hook server starts, print the stdin content:

```bash
# Temporarily modify hook/server/index.ts
# Add after line 91:
console.error("[DEBUG] Hook event:", eventJson);
```

**What You Should See**:

```json
{
  "tool_input": {
    "plan": "# Implementation Plan\n\n## Task 1\n..."
  },
  "permission_mode": "default"
}
```

**Solutions**:

- If `tool_input.plan` is empty or missing, check if the AI Agent correctly generated the plan
- If JSON format is wrong, check if Hook configuration is correct
- If Hook version is incompatible, update Plannotator to the latest version

---

### Step 4: Resolve Browser Not Opening

**Why**

Plannotator uses the `openBrowser` function to automatically open the browser. If this fails, it could be a cross-platform compatibility issue or an incorrect browser path.

**Possible Causes**:

1. System default browser not set
2. Custom browser path invalid
3. Special handling issues in WSL environment
4. In remote mode, the browser does not open automatically (this is normal)

**Debugging Method**

#### Check If in Remote Mode

```bash
# View environment variable
echo $PLANNOTATOR_REMOTE

# Windows PowerShell
echo $env:PLANNOTATOR_REMOTE
```

If the output is `1` or `true`, it's in remote mode—the browser won't open automatically, which is expected behavior.

#### Manually Test Browser Opening

```bash
# macOS
open "http://localhost:54321"

# Linux
xdg-open "http://localhost:54321"

# Windows
start http://localhost:54321
```

**What You Should See**:

- If manual opening succeeds, Plannotator server is running normally; the issue is in the auto-open logic
- If manual opening fails, check if the URL is correct (the port might be different)

**Solutions**:

#### Option A: Set Custom Browser (macOS)

```bash
export PLANNOTATOR_BROWSER="Google Chrome"

# Or use the full path
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

#### Option B: Set Custom Browser (Linux)

```bash
export PLANNOTATOR_BROWSER="/usr/bin/firefox"
```

#### Option C: Remote Mode Manual Open (Devcontainer/SSH)

```bash
# Plannotator will output URL and port information
# Copy the URL and open it in your local browser
# Or use port forwarding:
ssh -L 19432:localhost:19432 user@remote
```

---

### Step 5: Check Git Repository Status (Code Review)

**Why**

The code review feature relies on Git commands. If the Git repository status is abnormal (such as no commits, Detached HEAD), it causes the diff to show empty or error.

**Error Message**:

```
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Debugging Method**

#### Check Git Repository

```bash
# Check if in a Git repository
git status

# Check current branch
git branch

# Check if there are commits
git log --oneline -1
```

**What You Should See**:

- If output is `fatal: not a git repository`, the current directory is not a Git repository
- If output is `HEAD detached at <commit>`, you're in Detached HEAD state
- If output is `fatal: your current branch 'main' has no commits yet`, there are no commits yet

**Solutions**:

#### Problem A: Not in a Git Repository

```bash
# Initialize Git repository
git init
git add .
git commit -m "Initial commit"
```

#### Problem B: Detached HEAD State

```bash
# Switch to a branch
git checkout main
# Or create a new branch
git checkout -b feature-branch
```

#### Problem C: No Commits

```bash
# At least one commit is needed to view diff
git add .
git commit -m "Initial commit"
```

#### Problem D: Empty Diff (No Changes)

```bash
# Create some changes
echo "test" >> test.txt
git add test.txt

# Run /plannotator-review again
```

**Checkpoint ✅**:

- Run `/plannotator-review` again, diff should display normally
- If still empty, check for unstaged or uncommitted changes

---

### Step 6: Debug Obsidian/Bear Integration Failures

**Why**

Obsidian/Bear integration failures don't prevent plan approval, but cause save failures. Errors are output to stderr.

**Error Message**:

```
[Obsidian] Save failed: Vault not found
[Bear] Save failed: Failed to open Bear
```

**Debugging Method**

#### Check Obsidian Configuration

**macOS**:
```bash
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

**Windows**:
```powershell
cat $env:APPDATA\obsidian\obsidian.json
```

**What You Should See**:

```json
{
  "vaults": {
    "/path/to/vault": {
      "path": "/path/to/vault",
      "ts": 1234567890
    }
  }
}
```

#### Check Bear Availability (macOS)

```bash
# Test Bear URL scheme
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**What You Should See**:

- Bear app opens and creates a new note
- If there's no response, Bear isn't installed correctly

**Solutions**:

#### Obsidian Save Failure

- Ensure Obsidian is running
- Check if vault path is correct
- Try creating a note manually in Obsidian to verify permissions

#### Bear Save Failure

- Ensure Bear is installed correctly
- Test if `bear://x-callback-url` is available
- Check if x-callback-url is enabled in Bear settings

---

### Step 7: View Detailed Error Logs (Debug Mode)

**Why**

Sometimes error messages aren't detailed enough—you need to view complete stack traces and context.

**How to Do It**

#### Enable Bun Debug Mode

```bash
export DEBUG="*"
plannotator review

# Windows PowerShell
$env:DEBUG = "*"
plannotator review
```

#### View Plannotator Server Logs

Internal server errors are output through `console.error`. Key log locations:

- `packages/server/index.ts:260` - Integration error logs
- `packages/server/git.ts:141` - Git diff error logs
- `apps/hook/server/index.ts:100-106` - Hook event parsing errors

**What You Should See**:

```bash
# Successfully saved to Obsidian
[Obsidian] Saved plan to: /path/to/vault/Plan - 2026-01-24.md

# Save failed
[Obsidian] Save failed: Cannot write to directory
[Bear] Save failed: Failed to open Bear

# Git diff error
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**Checkpoint ✅**:

- Error logs contain enough information to locate the problem
- Apply the corresponding solution based on error type

---

## Common Pitfalls

### ❌ Ignoring stderr Output

**Wrong Approach**:

```bash
# Only focus on stdout, ignore stderr
plannotator review 2>/dev/null
```

**Right Approach**:

```bash
# View both stdout and stderr
plannotator review
# Or separate logs
plannotator review 2>error.log
```

### ❌ Blindly Restarting the Server

**Wrong Approach**:

- Restart the server whenever you encounter a problem, without checking the error cause

**Right Approach**:

- First check error logs to determine the problem type
- Apply the corresponding solution based on error type
- Restart is the last resort

### ❌ Expecting Browser Auto-Open in Remote Mode

**Wrong Approach**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Expect browser to open automatically (won't happen)
```

**Right Approach**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# Record the output URL, manually open in browser
# Or use port forwarding
```

---

## Summary

- Plannotator uses `console.error` to output errors to stderr, `console.log` to output normal information to stdout
- Common issues include: port conflicts, Hook event parsing failures, browser not opening, abnormal Git repository status, integration failures
- Core debugging: view logs → locate problem type → apply corresponding solution
- In remote mode, the browser doesn't open automatically; you need to manually open the URL or configure port forwarding

---

## Next Up

> In the next lesson, we'll learn **[Common Problems](../common-problems/)**.
>
> You'll learn:
> - How to resolve installation and configuration issues
> - Common usage pitfalls and considerations
> - Performance optimization recommendations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Number |
|--- | --- | ---|
| Port retry mechanism | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L80) | 79-80 |
| EADDRINUSE error handling | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L320-L334) | 320-334 |
| Hook event parsing | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L91-L107) | 91-107 |
| Browser opening | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Git diff error handling | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L139-L144) | 139-144 |
| Obsidian save logs | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L242-L246) | 242-246 |
| Bear save logs | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L252-L256) | 252-256 |

**Key Constants**:
- `MAX_RETRIES = 5`: Maximum port retry count
- `RETRY_DELAY_MS = 500`: Port retry delay (milliseconds)

**Key Functions**:
- `startPlannotatorServer()`: Start plan review server
- `startReviewServer()`: Start code review server
- `openBrowser()`: Cross-platform browser opening
- `runGitDiff()`: Execute Git diff command
- `saveToObsidian()`: Save plan to Obsidian
- `saveToBear()`: Save plan to Bear

</details>
