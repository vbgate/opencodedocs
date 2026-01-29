---
title: "Common Problems: FAQ Guide | Plannotator"
sidebarTitle: "Common Problems"
subtitle: "Common Problems: FAQ Guide"
description: "Learn how to resolve Plannotator common issues: port conflicts, browser access, Git errors, image uploads, and Obsidian/Bear integration failures."
tags:
  - "FAQ"
  - "Troubleshooting"
  - "Port Conflicts"
  - "Browser"
  - "Git"
  - "Remote Environment"
  - "Integration Issues"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 1
---

# Common Problems

## What You'll Learn

- ✅ Quickly diagnose and resolve port conflict issues
- ✅ Understand why the browser doesn't automatically open and know how to access it
- ✅ Troubleshoot plan or code review not displaying
- ✅ Handle Git command execution failures
- ✅ Resolve image upload-related errors
- ✅ Troubleshoot Obsidian/Bear integration failure causes
- ✅ Correctly access Plannotator in remote environments

## Your Current Challenges

When using Plannotator, you may encounter these problems:

- **Problem 1**: Port already in use error on startup, server cannot start
- **Problem 2**: Browser doesn't automatically open, don't know how to access the review interface
- **Problem 3**: Plan or code review page displays blank, content not loaded
- **Problem 4**: Git error when executing `/plannotator-review`
- **Problem 5**: Image upload fails or images don't display
- **Problem 6**: Obsidian/Bear integration configured but plans don't auto-save
- **Problem 7**: Cannot access local server in remote environment

These problems interrupt your workflow and affect user experience.

## Core Concepts

::: info Error Handling Mechanism

Plannotator's server implements an **automatic retry mechanism**:

- **Max Retries**: 5 times
- **Retry Delay**: 500 milliseconds
- **Applicable Scenarios**: Port conflicts (EADDRINUSE error)

If port conflict occurs, the system automatically tries other ports. It only errors after 5 failed retries.

:::

Plannotator's error handling follows these principles:

1. **Local First**: All error messages output to terminal or console
2. **Graceful Degradation**: Integration failures (like Obsidian save failure) don't block main workflow
3. **Clear Prompts**: Provide specific error messages and suggested solutions

## Common Problems and Solutions

### Problem 1: Port Conflicts

**Error Message**:

```
Port 19432 in use after 5 retries
```

**Cause Analysis**:

- Port already occupied by another process
- Fixed port configured in remote mode but port conflicts
- Previous Plannotator process didn't exit properly

**Solutions**:

#### Method 1: Wait for Automatic Retry (Local Mode Only)

In local mode, Plannotator automatically tries random ports. If you see a port conflict error, it usually means:

- All 5 random ports are occupied (extremely rare)
- Fixed port configured (`PLANNOTATOR_PORT`) but conflicts

**You Should See**: Terminal displays "Port X in use after 5 retries"

#### Method 2: Use Fixed Port (Remote Mode)

In remote environments, you need to configure `PLANNOTATOR_PORT`:

::: code-group

```bash [macOS/Linux]
export PLANNOTATOR_PORT=9999
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT = "9999"
plannotator start
```

:::

::: tip Port Selection Recommendations

- Choose ports in the 1024-49151 range (user ports)
- Avoid common service ports (80, 443, 3000, 5000, etc.)
- Ensure port not blocked by firewall

:::

#### Method 3: Clean Up Processes Occupying the Port

```bash
# Find process occupying the port (replace 19432 with your port)
lsof -i :19432  # macOS/Linux
netstat -ano | findstr :19432  # Windows

# Kill process (replace PID with actual process ID)
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

::: warning Caution

Before killing the process, confirm it's not another important application. Plannotator automatically closes the server after receiving the decision, so manual termination is usually unnecessary.

:::

---

### Problem 2: Browser Not Opening Automatically

**Symptom**: Terminal shows server started but browser didn't open.

**Cause Analysis**:

| Scenario                            | Cause                                                            |
| ----------------------------------- | ---------------------------------------------------------------- |
| Remote Environment                  | Plannotator detected remote mode, skipped automatic browser open |
| `PLANNOTATOR_BROWSER` Misconfigured | Browser path or name incorrect                                   |
| Browser Not Installed               | System default browser doesn't exist                             |

**Solutions**:

#### Scenario 1: Remote Environment (SSH, Devcontainer, WSL)

**Check if in Remote Environment**:

```bash
echo $PLANNOTATOR_REMOTE
# Output "1" or "true" indicates remote mode
```

**In Remote Environment**:

1. **Terminal will display access URL**:

```
Plannotator running at: http://localhost:9999
Press Ctrl+C to stop
```

2. **Manually open browser** and visit the displayed URL

3. **Configure port forwarding** (if need to access from local)

**You Should See**: Terminal output like "Plannotator running at: http://localhost:19432"

#### Scenario 2: Local Mode but Browser Didn't Open

**Check `PLANNOTATOR_BROWSER` Configuration**:

::: code-group

```bash [macOS/Linux]
echo $PLANNOTATOR_BROWSER
# Should output browser name or path
```

```powershell [Windows PowerShell]
echo $env:PLANNOTATOR_BROWSER
```

:::

**Clear Custom Browser Configuration**:

::: code-group

```bash [macOS/Linux]
unset PLANNOTATOR_BROWSER
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_BROWSER = ""
plannotator start
```

:::

**Configure Correct Browser** (if need to customize):

```bash
# macOS: Use app name
export PLANNOTATOR_BROWSER="Google Chrome"

# Linux: Use executable file path
export PLANNOTATOR_BROWSER="/usr/bin/google-chrome"

# Windows: Use executable file path
set PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

### Problem 3: Plan or Code Review Not Displaying

**Symptom**: Browser opens but page displays blank or fails to load.

**Possible Causes**:

| Cause                  | Plan Review | Code Review |
| ---------------------- | ----------- | ----------- |
| Plan Parameter Empty   | ✅ Common    | ❌ N/A       |
| Git Repository Issues  | ❌ N/A       | ✅ Common    |
| No Diff to Display     | ❌ N/A       | ✅ Common    |
| Server Failed to Start | ✅ Possible  | ✅ Possible  |

**Solutions**:

#### Case 1: Plan Review Not Displaying

**Check Terminal Output**:

```bash
# Search for error messages
plannotator start 2>&1 | grep -i error
```

**Common Error 1**: Plan Parameter Empty

**Error Message**:

```
400 Bad Request - Missing plan or plan is empty
```

**Cause**: Plan passed by Claude Code or OpenCode is an empty string.

**Solution**:

- Confirm AI Agent generated valid plan content
- Check if Hook or Plugin configuration is correct
- View Claude Code/OpenCode logs for more information

**Common Error 2**: Server Didn't Start Properly

**Solution**:

- Check if terminal displays "Plannotator running at" message
- If not, refer to "Problem 1: Port Conflicts"
- View [Environment Variables Configuration](../../advanced/environment-variables/) to confirm configuration is correct

#### Case 2: Code Review Not Displaying

**Check Terminal Output**:

```bash
/plannotator-review 2>&1 | grep -i error
```

**Common Error 1**: No Git Repository

**Error Message**:

```
fatal: not a git repository
```

**Solution**:

```bash
# Initialize Git repository
git init

# Add files and commit (if have uncommitted changes)
git add .
git commit -m "Initial commit"

# Run again
/plannotator-review
```

**You Should See**: Browser displays diff viewer

**Common Error 2**: No Diff to Display

**Symptom**: Page displays "No changes" or similar message.

**Solution**:

```bash
# Check if there are uncommitted changes
git status

# Check if there are staged changes
git diff --staged

# Check if there are commits
git log --oneline

# Switch diff type to view different scopes
# In code review interface, click dropdown menu to switch:
# - Uncommitted changes
# - Staged changes
# - Last commit
# - vs main (if on a branch)
```

**You Should See**: Diff viewer displays code changes or prompts "No changes"

**Common Error 3**: Git Command Execution Failed

**Error Message**:

```
Git diff error for uncommitted: [specific error message]
```

**Possible Causes**:

- Git not installed
- Git version too old
- Git configuration issues

**Solution**:

```bash
# Check Git version
git --version

# Test Git diff command
git diff HEAD

# If Git works normally, problem might be Plannotator internal error
# View full error message and report Bug
```

---

### Problem 4: Image Upload Failed

**Error Message**:

```
400 Bad Request - No file provided
500 Internal Server Error - Upload failed
```

**Possible Causes**:

| Cause                                 | Solution                                     |
| ------------------------------------- | -------------------------------------------- |
| No File Selected                      | Click upload button and select image         |
| Unsupported File Format               | Use png/jpeg/webp format                     |
| File Too Large                        | Compress image before uploading              |
| Temporary Directory Permission Issues | Check /tmp/plannotator directory permissions |

**Solutions**:

#### Check Uploaded Files

**Supported Formats**:

- ✅ PNG (`.png`)
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

**Unsupported Formats**:

- ❌ BMP (`.bmp`)
- ❌ GIF (`.gif`)
- ❌ SVG (`.svg`)

**You Should See**: After successful upload, image displays in review interface

#### Check Temporary Directory Permissions

Plannotator automatically creates `/tmp/plannotator` directory. If upload still fails, check system temporary directory permissions.

**If Manual Check Needed**:

```bash
# Check directory permissions
ls -la /tmp/plannotator

# Windows check
dir %TEMP%\plannotator
```

**You Should See**: `drwxr-xr-x` (or similar permissions) indicates directory is writable

#### View Browser Developer Tools

1. Press F12 to open developer tools
2. Switch to "Network" tab
3. Click upload button
4. Find `/api/upload` request
5. Check request status and response

**You Should See**:
- Status Code: 200 OK (success)
- Response: `{"path": "/tmp/plannotator/xxx.png"}`

---

### Problem 5: Obsidian/Bear Integration Failed

**Symptom**: After approving plan, no saved plan in note application.

**Possible Causes**:

| Cause                    | Obsidian | Bear |
| ------------------------ | -------- | ---- |
| Integration Not Enabled  | ✅        | ✅    |
| Vault/App Not Detected   | ✅        | N/A  |
| Path Configuration Error | ✅        | ✅    |
| Filename Conflict        | ✅        | ✅    |
| x-callback-url Failed    | N/A      | ✅    |

**Solutions**:

#### Obsidian Integration Issues

**Step 1: Check if Integration Enabled**

1. Click Settings (gear icon) in Plannotator UI
2. Find "Obsidian Integration" section
3. Ensure switch is turned on

**You Should See**: Switch displays as blue (enabled state)

**Step 2: Check Vault Detection**

**Automatic Detection**:

- Plannotator automatically reads Obsidian configuration file
- Configuration file location:
  - macOS: `~/Library/Application Support/obsidian/obsidian.json`
  - Windows: `%APPDATA%\obsidian\obsidian.json`
  - Linux: `~/.config/obsidian/obsidian.json`

**Manual Verification**:

::: code-group

```bash [macOS]
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

```powershell [Windows PowerShell]
cat $env:APPDATA\obsidian\obsidian.json
```

```bash [Linux]
cat ~/.config/obsidian/obsidian.json
```

:::

**You Should See**: JSON file containing `vaults` field

**Step 3: Manually Configure Vault Path**

If automatic detection fails:

1. In Plannotator Settings
2. Click "Manually enter vault path"
3. Enter full Vault path

**Example Paths**:

- macOS: `/Users/yourname/Documents/ObsidianVault`
- Windows: `C:\Users\yourname\Documents\ObsidianVault`
- Linux: `/home/yourname/Documents/ObsidianVault`

**You Should See**: Dropdown menu displays your entered Vault name

**Step 4: Check Terminal Output**

Obsidian save results output to terminal:

```bash
[Obsidian] Saved plan to: /path/to/vault/plannotator/Title - Jan 24, 2026 2-30pm.md
```

**Error Message**:

```
[Obsidian] Save failed: [specific error message]
```

**Common Errors**:

- Insufficient permissions → Check Vault directory permissions
- Insufficient disk space → Free up space
- Invalid path → Confirm path spelling is correct

#### Bear Integration Issues

**Check Bear App**

- Ensure Bear is installed on macOS
- Ensure Bear app is running

**Test x-callback-url**:

```bash
# Test in terminal
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**You Should See**: Bear opens and creates new note

**Check Terminal Output**:

```bash
[Bear] Saved plan to Bear
```

**Error Message**:

```
[Bear] Save failed: [specific error message]
```

**Solution**:

- Restart Bear app
- Confirm Bear is latest version
- Check macOS permission settings (allow Bear to access files)

---

### Problem 6: Remote Environment Access Issues

**Symptom**: In SSH, Devcontainer, or WSL, cannot access server from local browser.

**Core Concept**:

::: info What is a Remote Environment

Remote environment refers to a remote computing environment accessed via SSH, Devcontainer, or WSL. In such environments, you need to use **port forwarding** to map remote ports to local ports to access remote servers in your local browser.

:::

**Solutions**:

#### Step 1: Configure Remote Mode

Set environment variables in remote environment:

::: code-group

```bash [macOS/Linux/WSL]
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

```powershell [Windows]
$env:PLANNOTATOR_REMOTE = "1"
$env:PLANNOTATOR_PORT = "9999"
```

:::

**You Should See**: Terminal outputs "Using remote mode with fixed port: 9999"

#### Step 2: Configure Port Forwarding

**Scenario 1: SSH Remote Server**

Edit `~/.ssh/config`:

```
Host your-server
    HostName server.example.com
    User yourname
    LocalForward 9999 localhost:9999
```

**Connect to Server**:

```bash
ssh your-server
```

**You Should See**: After SSH connection established, local port 9999 forwards to remote port 9999

**Scenario 2: VS Code Devcontainer**

VS Code Devcontainer usually forwards ports automatically.

**Check Method**:

1. Open "Ports" tab in VS Code
2. Find port 9999
3. Ensure port status is "Forwarded"

**You Should See**: Ports tab displays "Local Address: localhost:9999"

**Scenario 3: WSL (Windows Subsystem for Linux)**

WSL uses `localhost` forwarding by default.

**Access Method**:

Visit directly in Windows browser:

```
http://localhost:9999
```

**You Should See**: Plannotator UI displays normally

#### Step 3: Verify Access

1. Start Plannotator in remote environment
2. Visit `http://localhost:9999` in local browser
3. Confirm page displays normally

**You Should See**: Plan review or code review interface loads normally

---

### Problem 7: Plan/Annotations Not Saved Correctly

**Symptom**: After approving or rejecting plan, annotations not saved or saved in incorrect location.

**Possible Causes**:

| Cause                    | Solution                                                        |
| ------------------------ | --------------------------------------------------------------- |
| Plan Save Disabled       | Check "Plan Save" option in settings                            |
| Invalid Custom Path      | Verify path is writable                                         |
| Empty Annotation Content | This is normal behavior (only saves when there are annotations) |
| Server Permission Issues | Check save directory permissions                                |

**Solutions**:

#### Check Plan Save Settings

1. Click Settings (gear icon) in Plannotator UI
2. View "Plan Save" section
3. Confirm switch is enabled

**You Should See**: "Save plans and annotations" switch is blue (enabled state)

#### Check Save Path

**Default Save Location**:

```bash
~/.plannotator/plans/  # Both plans and annotations saved here
```

**Custom Path**:

Can configure custom save path in settings.

**Verify Path is Writable**:

::: code-group

```bash [macOS/Linux]
ls -la ~/.plannotator
mkdir -p ~/.plannotator/plans
touch ~/.plannotator/plans/test.txt
rm ~/.plannotator/plans/test.txt
```

```powershell [Windows PowerShell]
dir $env:USERPROFILE\.plannotator
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.plannotator\plans"
```

:::

**You Should See**: Commands execute successfully, no permission errors

#### Check Terminal Output

Save results output to terminal:

```bash
[Plan] Saved annotations to: ~/.plannotator/annotations/slug.json
[Plan] Saved snapshot to: ~/.plannotator/plans/slug-approved.md
```

**You Should See**: Similar success messages

---

## Lesson Summary

Through this lesson, you learned:

- **Diagnose port conflicts**: Use fixed port or clean up occupying processes
- **Handle browser not opening**: Identify remote mode, manually access or configure browser
- **Troubleshoot content not displaying**: Check Plan parameters, Git repository, diff status
- **Resolve image upload failures**: Check file formats, directory permissions, developer tools
- **Fix integration failures**: Check configuration, paths, permissions, and terminal output
- **Configure remote access**: Use PLANNOTATOR_REMOTE and port forwarding
- **Save plans and annotations**: Enable plan save and verify path permissions

**Remember**:

1. Terminal output is the best source of debugging information
2. Remote environments need port forwarding
3. Integration failures don't block main workflow
4. Use developer tools to view network request details

## Next Steps

If you encounter problems not covered in this lesson, check:

- [Troubleshooting](../troubleshooting/) - In-depth debugging techniques and log analysis methods
- [API Reference](../../appendix/api-reference/) - Learn all API endpoints and error codes
- [Data Models](../../appendix/data-models/) - Understand Plannotator's data structure

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature                                    | File Path                                                                                                                 | Line Number |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Server startup and retry logic             | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L335)      | 79-335      |
| Port conflict error handling (plan review) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L319-L334)     | 319-334     |
| Port conflict error handling (code review) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L252-L267)   | 252-267     |
| Remote mode detection                      | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)             | Full file   |
| Browser open logic                         | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)           | Full file   |
| Git command execution and error handling   | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L36-L147)          | 36-147      |
| Image upload handling (plan review)        | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174)     | 153-174     |
| Image upload handling (code review)        | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181-L201)   | 181-201     |
| Obsidian integration                       | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts) | Full file   |
| Plan saving                                | [`packages/server/storage.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/storage.ts)           | Full file   |

**Key Constants**:

| Constant         | Value | Description                    |
| ---------------- | ----- | ------------------------------ |
| `MAX_RETRIES`    | 5     | Server startup max retry count |
| `RETRY_DELAY_MS` | 500   | Retry delay (milliseconds)     |

**Key Functions**:

- `startPlannotatorServer()` - Start plan review server
- `startReviewServer()` - Start code review server
- `isRemoteSession()` - Detect if remote environment
- `getServerPort()` - Get server port
- `openBrowser()` - Open browser
- `runGitDiff()` - Execute Git diff command
- `detectObsidianVaults()` - Detect Obsidian vaults
- `saveToObsidian()` - Save plan to Obsidian
- `saveToBear()` - Save plan to Bear

</details>
