---
title: "Quick Start: Get Started with opencode-notify in 5 Minutes | opencode-notify Tutorial"
sidebarTitle: "Quick Start"
subtitle: "Quick Start: Get Started with opencode-notify in 5 Minutes"
description: "Learn how to install the opencode-notify plugin, complete configuration in 5 minutes, and experience your first desktop notification. This tutorial covers both OCX package manager and manual installation methods, supporting macOS, Windows, and Linux systems, helping you get timely alerts when AI tasks complete."
tags:
  - "Getting Started"
  - "Installation"
  - "Quick Start"
prerequisite: []
order: 10
---

# Quick Start: Get Started with opencode-notify in 5 Minutes

## What You'll Learn

- Install the opencode-notify plugin in 3 minutes
- Trigger your first desktop notification to verify successful installation
- Understand the differences and use cases for different installation methods

## Your Current Problem

After delegating a task to AI, you switch to other windows to work. Now you check back every 30 seconds: Is it done? Did it error? Or is it waiting for permissions? opencode-notify was created to solve exactly this problem.

This constant switching interrupts your flow and wastes time.

## When to Use This

**Enable opencode-notify in these scenarios**:
- You frequently switch to other apps while AI executes tasks
- You want to be immediately notified when AI needs your attention
- You want to stay focused without missing important events

## Core Concept

opencode-notify works simply: it listens to OpenCode events and sends native desktop notifications at key moments.

**It notifies you**:
- ✅ Task completion (Session idle)
- ✅ Execution errors (Session error)
- ✅ Permission requests (Permission updated)

**It does NOT notify you**:
- ❌ Every subtask completion (too noisy)
- ❌ Any events when terminal is focused (you're watching it, don't need notifications)

## 🎒 Prerequisites

::: warning Prerequisites
- [OpenCode](https://github.com/sst/opencode) installed
- Available terminal (macOS Terminal, iTerm2, Windows Terminal, etc.)
- macOS/Windows/Linux system (all three supported)
:::

## Follow Along

### Step 1: Choose Installation Method

opencode-notify provides two installation methods:

| Method | Use Case | Pros | Cons |
| ------ | -------- | ---- | ---- |
| **OCX Package Manager** | Most users | One-click install, auto-updates, complete dependency management | Requires OCX installation first |
| **Manual Installation** | Special needs | Full control, no OCX required | Manual dependency and update management |

**Recommendation**: Use OCX first for a hassle-free experience.

### Step 2: Install via OCX (Recommended)

#### 2.1 Install OCX Package Manager

OCX is the official plugin package manager for OpenCode, making it easy to install, update, and manage plugins.

**Install OCX**:

```bash
curl -fsSL https://ocx.kdco.dev/install.sh | sh
```

**You should see**: Installation script showing progress, with success message at the end.

#### 2.2 Add KDCO Registry

KDCO Registry is a plugin repository containing opencode-notify and other useful plugins.

**Add registry**:

```bash
ocx registry add https://registry.kdco.dev --name kdco
```

**You should see**: "Registry added successfully" or similar message.

::: tip Optional: Global Configuration
If you want to use the same registry across all projects, add the `--global` parameter:

```bash
ocx registry add https://registry.kdco.dev --name kdco --global
```
:::

#### 2.3 Install opencode-notify

**Install plugin**:

```bash
ocx add kdco/notify
```

**You should see**:
```
✓ Added kdco/notify to your OpenCode workspace
```

### Step 3: Install Entire Workspace (Optional)

For the complete experience, you can install the KDCO workspace, which includes:

- opencode-notify (desktop notifications)
- Background Agents
- Specialist Agents
- Planning Tools

**Install workspace**:

```bash
ocx add kdco/workspace
```

**You should see**: Multiple components successfully added.

### Step 4: Verify Installation

After installation, we need to trigger a notification to verify the configuration.

**Verification Method 1: Let AI Complete a Task**

Enter in OpenCode:

```
Please calculate the sum of 1 to 10, then wait 5 seconds before telling me the result.
```

After switching to other windows for a few seconds, you should see a desktop notification popup.

**Verification Method 2: Check Configuration File**

Check if the configuration file exists:

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
type $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**You should see**:
- If file doesn't exist → Using default configuration (normal)
- If file exists → Shows your custom configuration

### Step 5: Manual Installation (Alternative)

If you prefer not to use OCX, you can install manually.

#### 5.1 Copy Source Code

Copy opencode-notify source code to the OpenCode plugin directory:

```bash
# Copy from source to standalone directory
mkdir -p ~/.opencode/plugin/kdco-notify
cp src/notify.ts ~/.opencode/plugin/kdco-notify/
cp -r src/plugin/kdco-primitives ~/.opencode/plugin/kdco-notify/
```

#### 5.2 Install Dependencies

Manually install required dependencies:

```bash
cd ~/.opencode/plugin/
npm install node-notifier detect-terminal @opencode-ai/plugin @opencode-ai/sdk
```

::: warning Important Notes
- **Dependency Management**: You need to manually install and update `node-notifier` and `detect-terminal`
- **Update Difficulty**: Each update requires manually re-copying source code
- **Not Recommended**: Unless you have special needs, use OCX installation
:::

### Checkpoint ✅

After completing the steps above, confirm:

- [ ] OCX installed successfully (`ocx --version` shows version number)
- [ ] KDCO Registry added (`ocx registry list` shows kdco)
- [ ] opencode-notify installed (`ocx list` shows kdco/notify)
- [ ] Received first desktop notification
- [ ] Notification displays correct task title

**If any step fails**:
- Check [Troubleshooting](../../faq/troubleshooting/) for help
- Verify OpenCode is running normally
- Confirm your system supports desktop notifications

## Common Pitfalls

### Common Issue 1: Notifications Not Showing

**Causes**:
- macOS: System notifications disabled
- Windows: Notification permissions not granted
- Linux: notify-send not installed

**Solutions**:

| Platform | Solution |
| -------- | -------- |
| macOS | System Settings → Notifications → OpenCode → Allow Notifications |
| Windows | Settings → System → Notifications → Turn on notifications |
| Linux | Install libnotify-bin: `sudo apt install libnotify-bin` |

### Common Issue 2: OCX Installation Fails

**Cause**: Network issues or insufficient permissions

**Solutions**:
1. Check network connection
2. Use sudo for installation (requires admin permissions)
3. Manually download installation script and execute

### Common Issue 3: Dependency Installation Fails

**Cause**: Incompatible Node.js version

**Solutions**:
- Use Node.js 18 or higher
- Clear npm cache: `npm cache clean --force`

## Summary

In this lesson, we completed:
- ✅ Installed OCX package manager
- ✅ Added KDCO Registry
- ✅ Installed opencode-notify plugin
- ✅ Triggered first desktop notification
- ✅ Learned manual installation method

**Key Points**:
1. opencode-notify uses native desktop notifications, eliminating the need for frequent window switching
2. OCX is the recommended installation method, automatically managing dependencies and updates
3. By default, only parent sessions are notified, avoiding subtask noise
4. Notifications are automatically suppressed when terminal is focused

## Next Lesson Preview

> In the next lesson, we'll learn **[How It Works](../how-it-works/)**.
>
> You'll learn:
> - How the plugin listens to OpenCode events
> - The intelligent filtering mechanism workflow
> - Principles of terminal detection and focus awareness
> - Functional differences across platforms

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Function | File Path | Lines |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| Plugin Main Entry | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L1-L407) | 1-407   |
| Configuration Loading | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114  |
| Event Handler - Session Idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L215-L248) | 215-248 |
| Event Handler - Session Error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L251-L276) | 251-276 |
| Event Handler - Permission Updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L311-L329) | 311-329 |
| Notification Sending | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L280-L308) | 280-308 |
| Terminal Detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Quiet Hours Check | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Default Configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48   |

**Key Constants**:
- `DEFAULT_CONFIG.sounds.idle = "Glass"`: Default sound for task completion
- `DEFAULT_CONFIG.sounds.error = "Basso"`: Default sound for errors
- `DEFAULT_CONFIG.sounds.permission = "Submarine"`: Default sound for permission requests
- `DEFAULT_CONFIG.notifyChildSessions = false`: Default only notify parent sessions

**Key Functions**:
- `NotifyPlugin()`: Plugin entry function, returns event handlers
- `loadConfig()`: Loads configuration file, merges with defaults
- `sendNotification()`: Sends native desktop notifications
- `detectTerminalInfo()`: Detects terminal type and Bundle ID
- `isQuietHours()`: Checks if current time is in quiet hours
- `isParentSession()`: Determines if it's a parent session
- `isTerminalFocused()`: Detects if terminal is the foreground window

</details>
