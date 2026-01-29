---
title: "Windows Platform Guide: Native Notifications, Terminal Detection & Configuration | opencode-notify"
sidebarTitle: "Windows Platform Features"
subtitle: "Windows Platform Features: Native Notifications and Terminal Detection"
description: "Learn opencode-notify's capabilities and limitations on Windows. Master Windows native notifications and terminal detection, understand feature differences compared to macOS, configure optimal notification strategies to improve productivity, avoid notification interruptions, and maintain focused work state."
tags:
  - "Windows"
  - "platform-features"
  - "terminal-detection"
prerequisite:
  - "/kdcokenny/opencode-notify/start/quick-start/"
order: 40
---

# Windows Platform Features: Native Notifications and Terminal Detection

## What You'll Learn

- Understand the features supported by opencode-notify on the Windows platform
- Master how Windows terminal detection works
- Understand the functional differences compared to the macOS platform
- Configure notification strategies suitable for Windows

## Your Current Challenge

You're using OpenCode on Windows and notice that some features aren't as intelligent as on macOS. Notifications still pop up when the terminal is focused, and clicking notifications doesn't switch to the terminal window. Is this normal behavior? What are the limitations of the Windows platform?

## When to Use This

**Understand Windows platform features in these scenarios**:
- You're using opencode-notify on Windows
- You find certain macOS features unavailable on Windows
- You want to maximize the use of available features on the Windows platform

## Core Philosophy

opencode-notify provides **basic notification capabilities** on Windows, but has some functional limitations compared to macOS. This is determined by operating system characteristics, not a plugin issue.

::: info Why are macOS features more powerful?

macOS provides more powerful system APIs:
- NSUserNotificationCenter supports click-to-focus
- AppleScript can detect foreground applications
- System sound APIs allow custom sounds

Windows and Linux system notification APIs are relatively basic. opencode-notify calls system native notifications through `node-notifier` on these platforms.
:::

## Windows Platform Features Overview

| Feature | Windows | Description |
|--- | --- | ---|
| **Native Notifications** | ✅ Supported | Send notifications via Windows Toast |
| **Terminal Detection** | ✅ Supported | Automatically recognize 37+ terminal emulators |
| **Focus Detection** | ❌ Not supported | Cannot detect if terminal is the foreground window |
| **Click-to-Focus** | ❌ Not supported | Clicking notifications won't switch to terminal |
| **Custom Sounds** | ❌ Not supported | Uses system default notification sound |

### Windows Notification Mechanism

opencode-notify uses **Windows Toast** notifications on Windows, calling system native APIs through the `node-notifier` library.

**Notification trigger timing**:
- When AI task completes (session.idle)
- When AI execution encounters an error (session.error)
- When AI needs permission (permission.updated)
- When AI asks a question (tool.execute.before)

::: tip Windows Toast Notification Characteristics
- Notifications appear in the bottom-right corner of the screen
- Automatically disappear (approximately 5 seconds)
- Use system default notification sound
- Clicking notifications opens the notification center (doesn't switch to terminal)
:::

## Terminal Detection

### Automatic Terminal Recognition

opencode-notify uses the `detect-terminal` library to automatically detect the terminal emulator you're using.

**Supported Windows terminals**:
- Windows Terminal (recommended)
- Git Bash
- ConEmu
- Cmder
- PowerShell
- VS Code integrated terminal

::: details Terminal Detection Principle
When the plugin starts, `detect-terminal()` scans system processes to identify the current terminal type.

Source location: `src/notify.ts:145-147`

```typescript
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
	const terminalName = config.terminal || detectTerminal() || null
	
	if (!terminalName) {
		return { name: null, bundleId: null, processName: null }
	}
	
	return {
		name: terminalName,
		bundleId: null,  // Windows doesn't need bundleId
		processName: null,  // Windows doesn't need process name
	}
}
```
:::

### Manual Terminal Specification

If automatic detection fails, you can manually specify the terminal type in the configuration file.

**Configuration example**:

```json
{
  "terminal": "Windows Terminal"
}
```

**Available terminal names**: Refer to the [`detect-terminal` supported terminal list](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Platform Feature Comparison

| Feature | macOS | Windows | Linux |
|--- | --- | --- | ---|
| **Native Notifications** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **Custom Sounds** | ✅ System sound list | ❌ System default | ❌ System default |
| **Focus Detection** | ✅ AppleScript API | ❌ Not supported | ❌ Not supported |
| **Click-to-Focus** | ✅ activate bundleId | ❌ Not supported | ❌ Not supported |
| **Terminal Detection** | ✅ 37+ terminals | ✅ 37+ terminals | ✅ 37+ terminals |

### Why Doesn't Windows Support Focus Detection?

In the source code, the `isTerminalFocused()` function directly returns `false` on Windows:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux directly return false
	// ... macOS focus detection logic
}
```

**Reasons**:
- Windows doesn't provide a foreground application query API similar to macOS AppleScript
- Windows PowerShell can get the foreground window, but requires calling COM interfaces, which is complex to implement
- Current version prioritizes stability, hasn't implemented Windows focus detection yet

### Why Doesn't Windows Support Click-to-Focus?

In the source code, the `sendNotification()` function only sets the `activate` option on macOS:

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Reasons**:
- Windows Toast doesn't support the `activate` parameter
- Windows notifications can only be associated via app ID, cannot dynamically specify target window
- Clicking notifications opens the notification center, not focusing to a specific window

## Windows Platform Best Practices

### Configuration Recommendations

Since Windows doesn't support focus detection, it's recommended to adjust configuration to reduce notification noise.

**Recommended configuration**:

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Configuration explanation**:
- `notifyChildSessions: false` - Only notify parent sessions, avoid child task noise
- `quietHours.enabled: true` - Enable quiet hours, avoid nighttime interruptions

### Unsupported Configuration Options

The following configuration options are ineffective on Windows:

| Configuration | macOS Effect | Windows Effect |
|--- | --- | ---|
| `sounds.idle` | Play Glass sound | Use system default sound |
| `sounds.error` | Play Basso sound | Use system default sound |
| `sounds.permission` | Play Submarine sound | Use system default sound |

### Usage Tips

**Tip 1: Manually Disable Notifications**

If you're viewing the terminal and don't want to be disturbed:

1. Click the "Action Center" icon in the taskbar (Windows + A)
2. Disable opencode-notify notifications

**Tip 2: Use Quiet Hours**

Set work hours and rest hours to avoid interruptions during non-work time:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**Tip 3: Temporarily Disable Plugin**

If you need to completely disable notifications, you can delete the configuration file or set quiet hours to all day:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "00:00",
    "end": "23:59"
  }
}
```

## Follow Along

### Verify Windows Notifications

**Step 1: Trigger Test Notification**

Enter a simple task in OpenCode:

```
Please calculate the result of 1+1.
```

**You should see**:
- Windows Toast notification appears in the bottom-right corner
- Notification title is "Ready for review"
- System default notification sound plays

**Step 2: Test Focus Suppression (Verify Not Supported)**

Keep the terminal window in the foreground, trigger a task again.

**You should see**:
- Notification still appears (because Windows doesn't support focus detection)

**Step 3: Test Clicking Notification**

Click the notification that appears.

**You should see**:
- Notification center expands, instead of switching to the terminal window

### Configure Quiet Hours

**Step 1: Create Configuration File**

Edit the configuration file (PowerShell):

```powershell
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**Step 2: Add Quiet Hours Configuration**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Step 3: Save and Test**

Wait for the current time to enter quiet hours, then trigger a task.

**You should see**:
- No notification appears (quiet hours in effect)

## Checkpoint ✅

After completing the above steps, please confirm:

- [ ] Windows Toast notifications display normally
- [ ] Notifications show correct task titles
- [ ] Quiet hours configuration is effective
- [ ] You understand the features not supported on Windows

## Common Pitfalls

### Common Issue 1: Notifications Not Displaying

**Cause**: Windows notification permissions not granted

**Solution**:

1. Open "Settings" → "System" → "Notifications"
2. Ensure "Get notifications from apps and other senders" is enabled
3. Find OpenCode, ensure notification permissions are enabled

### Common Issue 2: Terminal Detection Failure

**Cause**: `detect-terminal` cannot recognize your terminal

**Solution**:

Manually specify the terminal type in the configuration file:

```json
{
  "terminal": "Windows Terminal"
}
```

### Common Issue 3: Custom Sounds Not Working

**Cause**: Windows platform doesn't support custom sounds

**Explanation**: This is normal behavior. Windows Toast notifications use system default sounds, cannot be changed via configuration file.

### Common Issue 4: Clicking Notification Doesn't Focus Terminal

**Cause**: Windows Toast doesn't support the `activate` parameter

**Explanation**: This is a limitation of the Windows API. Clicking notifications opens the notification center, you need to manually switch to the terminal window.

## Lesson Summary

In this lesson, we learned:

- ✅ Windows platform supports native notifications and terminal detection
- ✅ Windows doesn't support focus detection and click-to-focus
- ✅ Windows doesn't support custom sounds
- ✅ Recommended configurations (quiet hours, notify parent sessions only)
- ✅ Solutions to common issues

**Key takeaways**:
1. Windows platform features are relatively basic, but core notification capabilities are complete
2. Focus detection and click-to-focus are macOS-exclusive features
3. Noise can be reduced through quiet hours configuration
4. Terminal detection supports manual specification, improving compatibility

## Next Lesson Preview

> In the next lesson, we'll learn about **[Linux Platform Features](../linux/)**.
>
> You'll learn:
> - Linux notification mechanism (notify-send)
> - Linux terminal detection capabilities
> - Feature comparison with Windows platform
> - Linux distribution compatibility issues

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Line |
|--- | --- | ---|
| Windows platform limitation check (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Windows platform limitation check (focus detection) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Key functions**:
- `runOsascript()`: Only executes on macOS, returns null on Windows
- `isTerminalFocused()`: Windows directly returns false
- `sendNotification()`: Only sets `activate` parameter on macOS
- `detectTerminalInfo()`: Cross-platform terminal detection

**Platform detection**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

</details>
