---
title: "Environment Variables: Remote Config | Plannotator"
sidebarTitle: "Environment Variables"
subtitle: "Environment Variables: Remote Config | Plannotator"
description: "Configure Plannotator for remote environments. Set up remote mode, fixed ports, custom browsers, and URL sharing for SSH, Devcontainer, and WSL workflows."
tags:
  - "Environment Variables"
  - "Remote Mode"
  - "Port Configuration"
  - "Browser Configuration"
  - "URL Sharing"
  - "Devcontainer"
  - "WSL"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 5
---

# Environment Variables Configuration

## What You'll Learn

- ✅ Configure Plannotator correctly in remote environments like SSH, Devcontainer, and WSL
- ✅ Use fixed ports to avoid port conflicts and frequent port forwarding configuration
- ✅ Specify custom browsers for plan review interface
- ✅ Enable or disable URL sharing functionality
- ✅ Understand default values and behavior of each environment variable

## Your Current Challenges

**Challenge 1**: When using Plannotator in SSH or Devcontainer, the browser doesn't open automatically, or you can't access the local server.

**Challenge 2**: Every time you restart Plannotator, it uses a random port, requiring constant port forwarding configuration updates.

**Challenge 3**: The system default browser doesn't match your workflow preferences—you want to view plans in a specific browser.

**Challenge 4**: For security reasons, you want to disable URL sharing to prevent accidental plan sharing.

**Plannotator Helps You**:
- Automatically detects remote environments via environment variables and disables automatic browser opening
- Fixed ports simplify port forwarding configuration
- Supports custom browser configuration
- Provides environment variable control for URL sharing toggle

## When to Use This Feature

**Use Cases**:
- Using Claude Code or OpenCode on SSH remote servers
- Developing in Devcontainer containers
- Working in WSL (Windows Subsystem for Linux) environments
- Need fixed ports to simplify port forwarding configuration
- Want to use specific browsers (e.g., Chrome, Firefox)
- Enterprise security policies require disabling URL sharing

**Not Suitable For**:
- Local development with default browser (no environment variables needed)
- No port forwarding required (e.g., fully local development)

## Core Concepts

### What Are Environment Variables

**Environment variables** are key-value pair configuration mechanisms provided by the operating system. Plannotator adapts to different runtime environments (local or remote) by reading environment variables.

::: info Why Do We Need Environment Variables?

Plannotator assumes you're in a local development environment by default:
- Local mode: Random port (avoids port conflicts)
- Local mode: Automatically opens system default browser
- Local mode: URL sharing enabled

However, in remote environments (SSH, Devcontainer, WSL), these default behaviors need adjustment:
- Remote mode: Uses fixed port (for port forwarding)
- Remote mode: Doesn't automatically open browser (needs to open on host machine)
- Remote mode: May need to disable URL sharing (security considerations)

Environment variables let you adjust Plannotator's behavior in different environments without modifying code.
:::

### Environment Variable Priority

Plannotator reads environment variables with the following priority:

```
Explicit environment variables > Default behavior

Example:
PLANNOTATOR_PORT=3000 > Remote mode default port 19432 > Local mode random port
```

This means:
- If `PLANNOTATOR_PORT` is set, that port is used regardless of whether it's remote mode
- If `PLANNOTATOR_PORT` is not set, remote mode uses 19432, local mode uses random port

## 🎒 Prerequisites

Before configuring environment variables, confirm:

- [ ] Completed Plannotator installation ([Claude Code installation](../installation-claude-code/) or [OpenCode installation](../installation-opencode/))
- [ ] Know your current runtime environment (local, SSH, Devcontainer, WSL)
- [ ] (Remote environments) Port forwarding configured (e.g., SSH `-L` parameter or Devcontainer `forwardPorts`)

## Follow Along

### Step 1: Configure Remote Mode (SSH, Devcontainer, WSL)

**Why**
Remote mode automatically uses fixed ports and disables automatic browser opening, suitable for SSH, Devcontainer, WSL, and similar environments.

**How to Configure**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
export PLANNOTATOR_REMOTE=1
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_REMOTE="1"
```

```cmd [Windows CMD]
set PLANNOTATOR_REMOTE=1
```

:::

**You should see**: No visual feedback, environment variable is set.

**Permanent Effect** (recommended):

::: code-group

```bash [~/.bashrc or ~/.zshrc]
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
source ~/.bashrc
```

```powershell [PowerShell Profile]
[Environment]::SetEnvironmentVariable('PLANNOTATOR_REMOTE', '1', 'User')
```

```cmd [System Environment Variables]
# Add via "System Properties > Environment Variables" interface
```

:::

### Step 2: Configure Fixed Port (Required for Remote Environments)

**Why**
Remote environments need fixed ports to configure port forwarding. Local environments can also set fixed ports if needed.

**Default Port Rules**:
- Local mode (no `PLANNOTATOR_REMOTE` set): Random port (`0`)
- Remote mode (`PLANNOTATOR_REMOTE=1`): Default `19432`
- Explicit `PLANNOTATOR_PORT` set: Use specified port

**How to Configure**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# Set to 19432 (remote mode default)
export PLANNOTATOR_PORT=19432

# Or custom port
export PLANNOTATOR_PORT=3000
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT="19432"
```

```cmd [Windows CMD]
set PLANNOTATOR_PORT=19432
```

:::

**You should see**: No visual feedback, environment variable is set.

**Checkpoint ✅**: Verify port is effective

After restarting Claude Code or OpenCode, trigger plan review and check the URL output in the terminal:

```bash
# Local mode output (random port)
http://localhost:54321

# Remote mode output (fixed port 19432)
http://localhost:19432
```

**Port Forwarding Configuration Examples**:

SSH remote development:
```bash
ssh -L 19432:localhost:19432 user@remote-server
```

Devcontainer (`.devcontainer/devcontainer.json`):
```json
{
  "forwardPorts": [19432]
}
```

### Step 3: Configure Custom Browser

**Why**
The system default browser may not be your preference (e.g., you work in Chrome, but default is Safari).

**How to Configure**

::: code-group

```bash [macOS (Bash)]
# Use app name (macOS supports this)
export PLANNOTATOR_BROWSER="Google Chrome"

# Or use full path
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

```bash [Linux (Bash)]
# Use executable file path
export PLANNOTATOR_BROWSER="/usr/bin/firefox"

# Or use relative path (if in PATH)
export PLANNOTATOR_BROWSER="firefox"
```

```powershell [Windows PowerShell]
# Use executable file path
$env:PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

```cmd [Windows CMD]
set PLANNOTATOR_BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe
```

:::

**You should see**: Next time you trigger plan review, Plannotator opens in the specified browser.

**Checkpoint ✅**: Verify browser is effective

After restarting and triggering plan review, observe:
- macOS: The specified app opens
- Windows: The specified browser process starts
- Linux: The specified browser command executes

**Common Browser Paths**:

| OS | Browser | Path/Command |
| -------- | ------ | --------- |
| macOS | Chrome | `Google Chrome` or `/Applications/Google Chrome.app` |
| macOS | Firefox | `Firefox` or `/Applications/Firefox.app` |
| macOS | Safari | `Safari` |
| Linux | Chrome | `google-chrome` or `/usr/bin/google-chrome` |
| Linux | Firefox | `firefox` or `/usr/bin/firefox` |
| Windows | Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Windows | Firefox | `C:\Program Files\Mozilla Firefox\firefox.exe` |

### Step 4: Configure URL Sharing Toggle

**Why**
URL sharing is enabled by default, but for security reasons (e.g., enterprise environments), you may need to disable this feature.

**Default Behavior**:
- `PLANNOTATOR_SHARE` not set: URL sharing enabled
- Set to `disabled`: URL sharing disabled

**How to Configure**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# Disable URL sharing
export PLANNOTATOR_SHARE="disabled"
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_SHARE="disabled"
```

```cmd [Windows CMD]
set PLANNOTATOR_SHARE=disabled
```

:::

**You should see**: After clicking the Export button, the "Share as URL" option disappears or becomes unavailable.

**Checkpoint ✅**: Verify URL sharing is disabled

1. Restart Claude Code or OpenCode
2. Open any plan review
3. Click the "Export" button in the top-right corner
4. Observe the option list

**Enabled State** (default):
- ✅ Shows "Share" and "Raw Diff" tabs
- ✅ "Share" tab displays shareable URL and copy button

**Disabled State** (`PLANNOTATOR_SHARE="disabled"`):
- ✅ Directly displays "Raw Diff" content
- ✅ Shows "Copy" and "Download .diff" buttons
- ❌ No "Share" tab or share URL functionality

### Step 5: Verify All Environment Variables

**Why**
Ensure all environment variables are correctly set and take effect as expected.

**Verification Methods**

```bash
# macOS/Linux/WSL
echo "PLANNOTATOR_REMOTE=$PLANNOTATOR_REMOTE"
echo "PLANNOTATOR_PORT=$PLANNOTATOR_PORT"
echo "PLANNOTATOR_BROWSER=$PLANNOTATOR_BROWSER"
echo "PLANNOTATOR_SHARE=$PLANNOTATOR_SHARE"
```

```powershell
# Windows PowerShell
Write-Host "PLANNOTATOR_REMOTE=$env:PLANNOTATOR_REMOTE"
Write-Host "PLANNOTATOR_PORT=$env:PLANNOTATOR_PORT"
Write-Host "PLANNOTATOR_BROWSER=$env:PLANNOTATOR_BROWSER"
Write-Host "PLANNOTATOR_SHARE=$env:PLANNOTATOR_SHARE"
```

**You should see**: All set environment variables and their values.

**Expected Output Example** (remote environment configuration):
```bash
PLANNOTATOR_REMOTE=1
PLANNOTATOR_PORT=19432
PLANNOTATOR_BROWSER=
PLANNOTATOR_SHARE=
```

**Expected Output Example** (local environment configuration):
```bash
PLANNOTATOR_REMOTE=
PLANNOTATOR_PORT=
PLANNOTATOR_BROWSER=Google Chrome
PLANNOTATOR_SHARE=disabled
```

## Troubleshooting

### Issue 1: Environment Variables Not Taking Effect

**Symptom**: After setting environment variables, Plannotator behavior hasn't changed.

**Cause**: Environment variables only take effect in new terminal sessions, or the application needs to be restarted.

**Solution**:
- Confirm environment variables are permanently written to config files (e.g., `~/.bashrc`)
- Restart terminal or run `source ~/.bashrc`
- Restart Claude Code or OpenCode

### Issue 2: Port Already in Use

**Symptom**: After setting `PLANNOTATOR_PORT`, startup fails.

**Cause**: The specified port is already occupied by another process.

**Solution**:
```bash
# Check port usage (macOS/Linux)
lsof -i :19432

# Change port
export PLANNOTATOR_PORT=19433
```

### Issue 3: Incorrect Browser Path

**Symptom**: After setting `PLANNOTATOR_BROWSER`, browser doesn't open.

**Cause**: Path is incorrect or file doesn't exist.

**Solution**:
- macOS: Use app name instead of full path (e.g., `Google Chrome`)
- Linux/Windows: Use `which` or `where` commands to confirm executable file path
  ```bash
  which firefox  # Linux
  where chrome   # Windows
  ```

### Issue 4: Browser Unexpectedly Opens in Remote Mode

**Symptom**: After setting `PLANNOTATOR_REMOTE=1`, browser still opens on remote server.

**Cause**: `PLANNOTATOR_REMOTE` value is not `"1"` or `"true"`.

**Solution**:
```bash
# Correct values
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_REMOTE=true

# Incorrect values (won't take effect)
export PLANNOTATOR_REMOTE=yes
export PLANNOTATOR_REMOTE=enabled
```

### Issue 5: URL Share Option Still Visible After Disabling

**Symptom**: After setting `PLANNOTATOR_SHARE=disabled`, "Share as URL" is still visible.

**Cause**: Application needs to restart for changes to take effect.

**Solution**: Restart Claude Code or OpenCode.

## Summary

This lesson covered Plannotator's 4 core environment variables:

| Environment Variable | Purpose | Default Value | Use Case |
| --------- | ---- | ------ | -------- |
| `PLANNOTATOR_REMOTE` | Remote mode toggle | Not set (local mode) | SSH, Devcontainer, WSL |
| `PLANNOTATOR_PORT` | Fixed port | Remote mode 19432, local mode random | Need port forwarding or avoid port conflicts |
| `PLANNOTATOR_BROWSER` | Custom browser | System default browser | Want to use specific browser |
| `PLANNOTATOR_SHARE` | URL sharing toggle | Not set (enabled) | Need to disable sharing functionality |

**Key Points**:
- Remote mode automatically uses fixed ports and disables automatic browser opening
- Explicitly set environment variables have higher priority than default behavior
- Environment variable changes require application restart to take effect
- Enterprise environments may need URL sharing disabled

## Next Lesson Preview

> In the next lesson, we'll learn **[Common Problems Troubleshooting](../../faq/common-problems/)**.
>
> You'll learn:
> - How to resolve port occupation issues
> - Handle situations where browser doesn't open
> - Fix errors where plans aren't displayed
> - Debugging techniques and log viewing methods

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Feature | File Path | Lines |
| --- | --- | --- |
| Remote mode detection | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 16-29 |
| Port retrieval logic | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 34-49 |
| Browser opening logic | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 45-74 |
| URL sharing toggle (Hook) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts) | 44 |
| URL sharing toggle (OpenCode) | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |

**Key Constants**:
- `DEFAULT_REMOTE_PORT = 19432`: Default port for remote mode

**Key Functions**:
- `isRemoteSession()`: Detects if running in remote environment (SSH, Devcontainer, WSL)
- `getServerPort()`: Gets server port (prioritizes environment variable, then remote mode default, finally random)
- `openBrowser(url)`: Opens URL in specified browser or system default browser

</details>
