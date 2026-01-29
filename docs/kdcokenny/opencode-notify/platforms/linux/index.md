---
title: "Linux Platform Guide: notify-send Notifications and Terminal Detection | opencode-notify Tutorial"
sidebarTitle: "Linux Platform"
subtitle: "Linux Platform Features: notify-send Notifications and Terminal Detection"
description: "Learn opencode-notify's Linux platform features and limitations. Master native Linux notifications and terminal detection, understand functional differences from macOS/Windows, configure Linux notification strategies for efficiency, avoid notification interruptions, and resolve notify-send installation and configuration issues."
tags:
  - "Linux"
  - "Platform Features"
  - "Terminal Detection"
prerequisite:
  - "/kdcokenny/opencode-notify/start/quick-start/"
order: 50
---

# Linux Platform Features: notify-send Notifications and Terminal Detection

## What You'll Learn

- ✅ Understand opencode-notify's features on Linux platform
- ✅ Master how Linux native notifications and terminal detection work
- ✅ Understand functional differences from macOS/Windows platforms
- ✅ Configure notification strategies suitable for Linux

## Your Current Problem

You're using OpenCode on Linux and noticing that certain features aren't as intelligent as on macOS. Notifications still pop up when the terminal is focused, and clicking notifications doesn't bring you back to the terminal window. Is this normal behavior? What are the limitations on the Linux platform?

## When to Use This

**Learn Linux platform features in these scenarios**:
- You're using opencode-notify on Linux systems
- You find that certain macOS features are unavailable on Linux
- You want to maximize utilization of available Linux platform features

## Core Concept

opencode-notify provides **basic notification capabilities** on the Linux platform, but has some functional limitations compared to macOS. This is determined by operating system characteristics, not a plugin issue.

::: info Why Are macOS Features More Rich?

macOS provides more powerful system APIs:
- NSUserNotificationCenter supports click-to-focus
- AppleScript can detect foreground applications
- System sound effect APIs allow custom sounds

Linux and Windows have relatively basic system notification APIs. opencode-notify calls system native notifications through `node-notifier` on these platforms.
:::

## Linux Platform Feature Overview

| Feature | Linux | Description |
| ------- | ----- | ----------- |
| **Native Notifications** | ✅ Supported | Send notifications via notify-send |
| **Terminal Detection** | ✅ Supported | Automatically recognize 37+ terminal emulators |
| **Focus Detection** | ❌ Not supported | Cannot detect if terminal is foreground window |
| **Click to Focus** | ❌ Not supported | Clicking notification won't switch to terminal |
| **Custom Sounds** | ❌ Not supported | Use system default notification sound |

### Linux Notification Mechanism

opencode-notify uses the **notify-send** command to send system notifications on Linux, calling system native APIs through the `node-notifier` library.

**Notification Trigger Events**:
- When AI task completes (session.idle)
- When AI execution errors (session.error)
- When AI needs permission (permission.updated)
- When AI asks questions (tool.execute.before)

::: tip notify-send Notification Characteristics
- Notifications appear in top-right corner of screen (GNOME/Ubuntu)
- Auto-dismiss (approximately 5 seconds)
- Use system default notification sound
- Clicking notification opens notification center (won't switch to terminal)
:::

## Terminal Detection

### Automatic Terminal Recognition

opencode-notify uses the `detect-terminal` library to automatically detect the terminal emulator you're using.

**Linux-supported Terminals**:
- gnome-terminal (GNOME desktop default)
- konsole (KDE desktop)
- xterm
- lxterminal (LXDE desktop)
- alacritty
- kitty
- terminator
- guake
- tilix
- hyper
- VS Code integrated terminal
- And 37+ other terminal emulators

::: details Terminal Detection Principle

When the plugin starts, `detect-terminal()` scans system processes to identify the current terminal type.

Source location: `src/notify.ts:145-164`

The `detectTerminalInfo()` function will:
1. Read the `terminal` field from configuration (if manually specified)
2. Call `detectTerminal()` to automatically detect terminal type
3. Get process name (used for macOS focus detection)
4. Get bundle ID on macOS (used for click-to-focus)

On the Linux platform, `bundleId` and `processName` will be `null` because Linux doesn't require this information.
:::

### Manual Terminal Specification

If auto-detection fails, you can manually specify the terminal type in the configuration file.

**Configuration Example**:

```json
{
  "terminal": "gnome-terminal"
}
```

**Available Terminal Names**: Refer to the [`detect-terminal` supported terminal list](https://github.com/jonschlinkert/detect-terminal#supported-terminals).

## Platform Feature Comparison

| Feature | macOS | Windows | Linux |
| ------- | ----- | ------- | ----- |
| **Native Notifications** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **Custom Sounds** | ✅ System sound list | ❌ System default | ❌ System default |
| **Focus Detection** | ✅ AppleScript API | ❌ Not supported | ❌ Not supported |
| **Click to Focus** | ✅ activate bundleId | ❌ Not supported | ❌ Not supported |
| **Terminal Detection** | ✅ 37+ terminals | ✅ 37+ terminals | ✅ 37+ terminals |

### Why Doesn't Linux Support Focus Detection?

In the source code, the `isTerminalFocused()` function directly returns `false` on Linux:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux directly return false
	// ... macOS focus detection logic
}
```

**Reasons**:
- Linux desktop environments are diverse (GNOME, KDE, XFCE, etc.) with no unified foreground application query API
- Linux DBus can get the active window, but implementation is complex and desktop environment dependent
- Current version prioritizes stability; Linux focus detection is not yet implemented

### Why Doesn't Linux Support Click to Focus?

In the source code, the `sendNotification()` function only sets the `activate` option on macOS:

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**Reasons**:
- notify-send doesn't support the `activate` parameter
- Linux notifications can only be associated through app IDs, cannot dynamically specify target windows
- Clicking notification opens notification center, not focusing on a specific window

### Why Doesn't Linux Support Custom Sounds?

::: details Sound Configuration Principle

On macOS, `sendNotification()` passes the `sound` parameter to system notifications:

```typescript
// src/notify.ts:227-243
function sendNotification(options: NotificationOptions): void {
	const { title, message, sound, terminalInfo } = options
	
	const notifyOptions: Record<string, unknown> = {
		title,
		message,
		sound,  // ← macOS accepts this parameter
	}
	
	// macOS-specific: click notification to focus terminal
	if (process.platform === "darwin" && terminalInfo.bundleId) {
		notifyOptions.activate = terminalInfo.bundleId
	}
	
	notifier.notify(notifyOptions)
}
```

Linux notify-send doesn't support custom sound parameters, so `sounds` configuration is ineffective on Linux.
:::

## Linux Platform Best Practices

### Configuration Recommendations

Since Linux doesn't support focus detection, it's recommended to adjust configuration to reduce notification noise.

**Recommended Configuration**:

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

**Configuration Explanation**:
- `notifyChildSessions: false` - Only notify parent sessions, avoid subtask noise
- `quietHours.enabled: true` - Enable quiet hours, avoid nighttime interruptions

### Unsupported Configuration Items

The following configuration items are ineffective on Linux:

| Configuration Item | macOS Effect | Linux Effect |
| ----------------- | ------------ | ------------ |
| `sounds.idle` | Play Glass sound | Use system default sound |
| `sounds.error` | Play Basso sound | Use system default sound |
| `sounds.permission` | Play Submarine sound | Use system default sound |

### Usage Tips

**Tip 1: Manually Disable Notifications**

If you're viewing the terminal and don't want to be disturbed:

1. Click the notification icon in the top-right corner of the screen
2. Disable opencode-notify notifications

**Tip 2: Use Quiet Hours**

Set work hours and rest hours to avoid interruptions outside of work time:

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

If you need to completely disable notifications, it's recommended to use the `quietHours` configuration to set all-day quiet mode, or delete/rename the configuration file to disable the plugin.

**Tip 4: Configure System Notification Sounds**

Although opencode-notify doesn't support custom sound effects, you can change the default notification sound in system settings:

- **GNOME**: Settings → Sound → Alert Sound
- **KDE**: System Settings → Notifications → Default Sound
- **XFCE**: Settings → Appearance → Notifications → Sound

## Follow Along

### Verify Linux Notifications

**Step 1: Trigger Test Notification**

Enter a simple task in OpenCode:

```
Please calculate the result of 1+1.
```

**You Should See**:
- A notify-send notification appears in the top-right corner of the screen (GNOME/Ubuntu)
- Notification title is "Ready for review"
- System default notification sound plays

**Step 2: Test Focus Suppression (Verify Unsupported)**

Keep the terminal window in the foreground and trigger another task.

**You Should See**:
- Notification still appears (because Linux doesn't support focus detection)

**Step 3: Test Clicking Notification**

Click the popped-up notification.

**You Should See**:
- Notification center expands, instead of switching to the terminal window

### Configure Quiet Hours

**Step 1: Create Configuration File**

Edit the configuration file (bash):

```bash
nano ~/.config/opencode/kdco-notify.json
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

Wait for the current time to enter the quiet hours period, then trigger a task.

**You Should See**:
- No notification appears (quiet hours effective)

## Checkpoint ✅

After completing the above steps, please confirm:

- [ ] notify-send notifications display normally
- [ ] Notifications show correct task titles
- [ ] Quiet hours configuration is effective
- [ ] Understand Linux platform unsupported features

## Common Pitfalls

### Common Issue 1: Notifications Not Displaying

**Cause 1**: notify-send not installed

**Solution**:

```bash
# Ubuntu/Debian
sudo apt install libnotify-bin

# Fedora/RHEL
sudo dnf install libnotify

# Arch Linux
sudo pacman -S libnotify
```

**Cause 2**: Linux notification permissions not granted

**Solution**:

1. Open system settings
2. Find "Notifications" or "Privacy" → "Notifications"
3. Ensure "Allow apps to send notifications" is enabled
4. Find OpenCode, ensure notification permissions are enabled

### Common Issue 2: Terminal Detection Failure

**Cause**: `detect-terminal` cannot recognize your terminal

**Solution**:

Manually specify the terminal type in the configuration file:

```json
{
  "terminal": "gnome-terminal"
}
```

### Common Issue 3: Custom Sounds Not Working

**Cause**: Linux platform doesn't support custom sounds

**Explanation**: This is normal behavior. notify-send uses the system default sound and cannot be changed through configuration files.

**Solution**: Change the default notification sound in system settings.

### Common Issue 4: Clicking Notification Doesn't Focus Terminal

**Cause**: notify-send doesn't support the `activate` parameter

**Explanation**: This is a limitation of the Linux API. Clicking notification opens the notification center; you need to manually switch to the terminal window.

### Common Issue 5: Notification Behavior Differences Across Desktop Environments

**Phenomenon**: In different desktop environments (GNOME, KDE, XFCE), notification display position and behavior may differ.

**Explanation**: This is normal; each desktop environment has its own notification system implementation.

**Solution**: Adjust notification behavior in system settings according to the desktop environment you're using.

## Summary

In this lesson, we learned:

- ✅ Linux platform supports native notifications and terminal detection
- ✅ Linux doesn't support focus detection and click-to-focus
- ✅ Linux doesn't support custom sounds
- ✅ Recommended configuration (quiet hours, notify parent sessions only)
- ✅ Solutions to common problems

**Key Takeaways**:
1. Linux platform features are relatively basic, but core notification capabilities are complete
2. Focus detection and click-to-focus are macOS-exclusive features
3. Quiet hours configuration can reduce notification noise
4. Terminal detection supports manual specification, improving compatibility
5. notify-send needs to be pre-installed (included by default in some distributions)

## Next Lesson Preview

> In the next lesson, we'll learn **[Supported Terminals](../terminals/)**.
>
> You'll learn:
> - List of 37+ terminals supported by opencode-notify
> - Detection mechanisms for different terminals
> - Terminal type override configuration methods
> - VS Code integrated terminal usage tips

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Lines |
| ------- | --------- | ----- |
| Linux platform limitation check (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Linux platform limitation check (focus detection) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS-specific: Click to focus | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Notification sending (cross-platform) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Terminal detection (cross-platform) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| Configuration loading (cross-platform) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**Key Functions**:
- `runOsascript()`: Only executes on macOS, returns null on Linux
- `isTerminalFocused()`: Directly returns false on Linux
- `sendNotification()`: Only sets `activate` parameter on macOS
- `detectTerminalInfo()`: Cross-platform terminal detection

**Platform Detection**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

**Linux Notification Dependencies**:
- External dependency: `node-notifier` → `notify-send` command
- System requirement: libnotify-bin or equivalent package

</details>
