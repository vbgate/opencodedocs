---
title: "Troubleshooting: Notifications Not Showing, Focus Detection Not Working, and Other Common Issues | opencode-notify Tutorial"
sidebarTitle: "Troubleshooting"
subtitle: "Troubleshooting: Notifications Not Showing, Focus Detection Not Working, and Other Common Issues"
description: "Solve common problems with opencode-notify, including notifications not displaying, focus detection failure, configuration errors, and sounds not playing. Learn how to troubleshoot macOS notification permissions, quiet hours settings, terminal detection, and quickly restore plugin functionality."
tags:
  - "Troubleshooting"
  - "FAQ"
prerequisite:
  - "start-quick-start"
order: 110
---

# Troubleshooting: Notifications Not Showing, Focus Detection Not Working, and Other Common Issues

## What You'll Learn

- Quickly identify reasons for notifications not showing
- Resolve macOS notification permission issues
- Troubleshoot focus detection failure
- Fix configuration file format errors
- Understand platform feature differences

## Your Current Problem

AI completed the task, but you didn't receive any notification. Or clicking the notification didn't bring the terminal to the front. You're not sure what went wrong or where to start troubleshooting.

## When to Use This

- First-time use after plugin installation, no notifications received
- After updating plugin or system, notifications suddenly stopped working
- Want to disable certain notification behaviors but configuration doesn't take effect
- Switched from macOS to Windows/Linux and found some features unavailable

## Core Concept

opencode-notify's workflow is relatively simple but involves multiple stages: OpenCode SDK → Event listening → Filtering logic → Operating system notifications. Any issue in any stage can cause notifications to not display.

The key to troubleshooting is **checking each stage in order**, starting from the most likely causes. 80% of issues can be resolved through these 5 categories:

1. **Notifications not showing** - Most common issue
2. **Focus detection not working** (macOS only)
3. **Configuration not taking effect** - JSON format or path errors
4. **Sounds not playing** (macOS only)
5. **Platform differences** - Some features not supported

---

## Problem 1: Notifications Not Showing

This is the most common issue with 6 possible causes. Check in order:

### 1.1 Check if Plugin is Correctly Installed

**Symptom**: OpenCode is running normally, but you've never received any notifications.

**Troubleshooting Steps**:

```bash
# Check if plugin is installed
ls ~/.opencode/plugin/kdco-notify

# If not exists, reinstall
ocx add kdco/notify
```

**You should see**: `~/.opencode/plugin/kdco-notify` directory exists and contains files like `package.json` and `src/notify.ts`.

::: tip Manual Installation Check
If you used manual installation, ensure:
1. Dependencies installed: `npm install node-notifier detect-terminal`
2. Plugin files in correct location: `~/.opencode/plugin/`
3. OpenCode restarted (plugin changes require restart)
:::

### 1.2 Check macOS Notification Permissions

**Symptom**: macOS users only, plugin is installed, but never receive notifications.

**Cause**: macOS requires explicit authorization for terminal applications to send notifications.

**Troubleshooting Steps**:

```bash
# 1. Open System Settings
# macOS Ventura and above: System Settings → Notifications & Focus
# macOS older versions: System Preferences → Notifications

# 2. Find your terminal app (e.g., Ghostty, iTerm2, Terminal.app)
# 3. Ensure "Allow Notifications" is enabled
# 4. Ensure "Show on Lock Screen" and "Show banners when screen is locked" are enabled
```

**You should see**: Your terminal app appears in notification settings and the "Allow Notifications" toggle is green.

::: warning Common Error
OpenCode itself will not appear in notification settings. You need to authorize the **terminal app** (Ghostty, iTerm2, Terminal.app, etc.), not OpenCode.
:::

### 1.3 Check Quiet Hours Settings

**Symptom**: No notifications during specific time periods, but notifications work during other times.

**Cause**: Quiet hours are enabled in the configuration file.

**Troubleshooting Steps**:

```bash
# Check configuration file
cat ~/.config/opencode/kdco-notify.json
```

**Solution**:

```json
{
  "quietHours": {
    "enabled": false,  // Change to false to disable quiet hours
    "start": "22:00",
    "end": "08:00"
  }
}
```

**You should see**: `quietHours.enabled` is `false`, or current time is not within quiet hours.

::: tip Cross-Midnight Quiet Hours
Quiet hours support crossing midnight (e.g., 22:00-08:00), which is correct behavior. If current time is between 10 PM and 8 AM the next day, notifications will be suppressed.
:::

### 1.4 Check Terminal Window Focus

**Symptom**: You don't receive notifications when looking at the terminal.

**Cause**: This is **expected behavior**, not a bug. The focus detection mechanism suppresses notifications when you're viewing the terminal to avoid duplicate reminders.

**Troubleshooting Steps**:

**Check if terminal is focused**:
1. Switch to another app (e.g., browser, VS Code)
2. Let AI execute a task
3. Wait for task completion

**You should see**: Notifications display normally when in other apps.

::: tip Focus Detection Explanation
Focus detection is built-in behavior and cannot be disabled via configuration. By default, the plugin suppresses notifications when the terminal is focused to avoid duplicate reminders. This is the designed expected behavior.
:::

### 1.5 Check Child Session Filtering

**Symptom**: AI executed multiple subtasks, but you didn't receive notifications for each subtask.

**Cause**: This is **expected behavior**. By default, the plugin only notifies parent sessions, not child sessions, to avoid notification spam.

**Troubleshooting Steps**:

**Understanding Parent vs Child Sessions**:
- Parent session: Tasks you directly ask AI to execute (e.g., "optimize the codebase")
- Child session: Subtasks AI splits itself (e.g., "optimize src/components", "optimize src/utils")

**If you really need child session notifications**:

```json
{
  "notifyChildSessions": true
}
```

**You should see**: Notifications for each child session completion.

::: tip Recommended Practice
Unless you're monitoring multiple concurrent tasks, keep `notifyChildSessions: false` and only receive parent session notifications.
:::

### 1.6 Check if Configuration File Was Deleted or Renamed

**Symptom**: Previously had notifications, but suddenly stopped showing.

**Troubleshooting Steps**:

```bash
# Check if configuration file exists
ls -la ~/.config/opencode/kdco-notify.json
```

**Solution**:

If the configuration file was deleted or path is incorrect, the plugin will use default configuration:

**Delete configuration file to restore defaults**:

```bash
# Delete configuration file to use default settings
rm ~/.config/opencode/kdco-notify.json
```

**You should see**: Plugin starts sending notifications again (using default configuration).

---

## Problem 2: Focus Detection Not Working (macOS Only)

**Symptom**: You still receive notifications when looking at the terminal, and focus detection doesn't seem to be working.

### 2.1 Check if Terminal is Correctly Detected

**Cause**: The plugin uses the `detect-terminal` library to automatically identify the terminal. If detection fails, focus detection cannot work.

**Troubleshooting Steps**:

```bash
# Check if terminal detection is working
node -e "console.log(require('detect-terminal')())"
```

**You should see**: Output of your terminal name (e.g., `ghostty`, `iterm2`, etc.).

If output is empty, terminal detection has failed.

### 2.2 Manually Specify Terminal Type

**If automatic detection fails, you can manually specify**:

```json
{
  "terminal": "ghostty"  // Replace with your terminal name
}
```

**Supported terminal names** (lowercase):

| Terminal | Name | Terminal | Name |
|--- | --- | --- | ---|
| Ghostty | `ghostty` | Kitty | `kitty` |
| iTerm2 | `iterm2` or `iterm` | WezTerm | `wezterm` |
| Alacritty | `alacritty` | macOS Terminal | `terminal` or `apple_terminal` |
| Hyper | `hyper` | Warp | `warp` |
| VS Code Terminal | `vscode` | VS Code Insiders | `vscode-insiders` |

::: tip Process Name Mapping
The plugin has an internal mapping from terminal names to macOS process names. If you manually specify `terminal`, ensure you use names from the mapping table (lines 71-84).
:::

---

## Problem 3: Configuration Not Taking Effect

**Symptom**: Modified the configuration file, but plugin behavior didn't change.

### 3.1 Check if JSON Format is Correct

**Common Errors**:

```json
// ❌ Error: Missing quotes
{
  notifyChildSessions: true
}

// ❌ Error: Trailing comma
{
  "notifyChildSessions": true,
}

// ❌ Error: Comments not supported
{
  "notifyChildSessions": true  // This will cause JSON parsing to fail
}
```

**Correct Format**:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**Validate JSON Format**:

```bash
# Use jq to validate JSON format
cat ~/.config/opencode/kdco-notify.json | jq '.'

# If output is formatted JSON, format is correct
# If error occurs, JSON has issues
```

### 3.2 Check Configuration File Path

**Symptom**: Created configuration file, but plugin doesn't seem to read it.

**Correct Path**:

```
~/.config/opencode/kdco-notify.json
```

**Troubleshooting Steps**:

```bash
# Check if configuration file exists
ls -la ~/.config/opencode/kdco-notify.json

# If not exists, create directory and file
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/kdco-notify.json << 'EOF'
{
  "notifyChildSessions": false
}
EOF
```

### 3.3 Restart OpenCode

**Cause**: The plugin loads configuration once at startup, so changes require a restart.

**Troubleshooting Steps**:

```bash
# Fully restart OpenCode
# 1. Quit OpenCode
# 2. Restart OpenCode
```

---

## Problem 4: Sounds Not Playing (macOS Only)

**Symptom**: Notifications display normally, but no sound plays.

### 4.1 Check if Sound Names Are Correct

**Supported macOS Sounds**:

| Sound Name | Description | Sound Name | Description |
|--- | --- | --- | ---|
| Basso | Bass | Blow | Blow |
| Bottle | Bottle | Frog | Frog |
| Funk | Funk | Glass | Glass (default task completion) |
| Hero | Hero | Morse | Morse |
| Ping | Ping | Pop | Pop |
| Purr | Purr | Sosumi | Sosumi |
| Submarine | Submarine (default permission request) | Tink | Tink |

**Configuration Example**:

```json
{
  "sounds": {
    "idle": "Glass",      // Task completion sound
    "error": "Basso",    // Error sound
    "permission": "Submarine",  // Permission request sound
    "question": "Ping"   // Question prompt sound (optional)
  }
}
```

### 4.2 Check System Volume Settings

**Troubleshooting Steps**:

```bash
# Open System Settings → Sound → Output Volume
# Ensure volume is not muted and at appropriate level
```

### 4.3 Other Platforms Don't Support Custom Sounds

**Symptom**: Windows or Linux users configured sounds but hear no sound.

**Cause**: Custom sounds is a macOS-only feature, Windows and Linux don't support it.

**Solution**: Windows and Linux users will receive notifications, but sounds are controlled by system default settings and cannot be configured via plugin.

::: tip Windows/Linux Sounds
Windows and Linux notification sounds are controlled by system settings:
- Windows: Settings → System → Notifications → Choose notification sound
- Linux: Desktop environment settings → Notifications → Sound
:::

---

## Problem 5: Clicking Notification Doesn't Focus (macOS Only)

**Symptom**: Clicking the notification doesn't bring the terminal window to the front.

### 5.1 Check if Bundle ID Was Retrieved Successfully

**Cause**: The click-to-focus feature requires retrieving the terminal's Bundle ID (e.g., `com.ghostty.Ghostty`). If retrieval fails, focusing is impossible.

**Troubleshooting Steps**:

The plugin automatically detects the terminal and retrieves the Bundle ID on startup. If this fails, the click-to-focus feature is unavailable.

**Common Causes**:
1. Terminal not in mapping table (e.g., custom terminal)
2. `osascript` execution failed (macOS permission issue)

**Solution**: Manually specify terminal type (see section 2.2).

### 5.2 Check System Accessibility Permissions

**Cause**: macOS requires "Accessibility" permissions to control other apps' windows.

**Troubleshooting Steps**:

```bash
# Open System Settings → Privacy & Security → Accessibility
# Ensure terminal app has accessibility permissions
```

**You should see**: Your terminal app (Ghostty, iTerm2, etc.) appears in the accessibility list and the toggle is enabled.

---

## Problem 6: Platform Feature Differences

**Symptom**: Switched from macOS to Windows/Linux and found some features unavailable.

### 6.1 Feature Comparison Table

| Feature | macOS | Windows | Linux |
|--- | --- | --- | ---|
| Native Notifications | ✅ | ✅ | ✅ |
| Custom Sounds | ✅ | ❌ | ❌ |
| Focus Detection | ✅ | ❌ | ❌ |
| Click Notification to Focus | ✅ | ❌ | ❌ |
| Terminal Detection | ✅ | ✅ | ✅ |
| Quiet Hours | ✅ | ✅ | ✅ |
| Child Session Notifications | ✅ | ✅ | ✅ |

**Notes**:
- **Windows/Linux**: Only basic notification features supported; advanced features (focus detection, click-to-focus, custom sounds) are unavailable
- **macOS**: All features supported

### 6.2 Cross-Platform Configuration File Compatibility

**Problem**: Configured `sounds` on macOS, sounds don't work after switching to Windows.

**Cause**: `sounds` configuration is only effective on macOS.

**Solution**: Configuration files can be used across platforms; the plugin will automatically ignore unsupported options. No need to delete the `sounds` field—Windows/Linux will silently ignore it.

::: tip Best Practice
Use the same configuration file when switching between multiple platforms; the plugin will automatically handle platform differences. No need to create separate configuration files for each platform.
:::

---

## Lesson Summary

opencode-notify troubleshooting can be summarized into these 6 categories:

1. **Notifications not showing**: Check plugin installation, macOS notification permissions, quiet hours, terminal focus, child session filtering, whether plugin is disabled
2. **Focus detection not working** (macOS): Check if terminal is correctly detected, or manually specify terminal type
3. **Configuration not taking effect**: Check JSON format, configuration file path, restart OpenCode
4. **Sounds not playing** (macOS): Check if sound names are correct, confirm sounds only supported on macOS
5. **Click notification not focusing** (macOS): Check Bundle ID retrieval and accessibility permissions
6. **Platform feature differences**: Windows/Linux only supports basic notifications; advanced features only available on macOS

**Quick Troubleshooting Checklist**:

```
□ Is plugin correctly installed?
□ Are macOS notification permissions authorized?
□ Are quiet hours enabled?
□ Is terminal focused?
□ Is child session filtering enabled?
□ Is configuration file JSON format correct?
□ Is configuration file path correct?
□ Did you restart OpenCode?
□ Are sound names in supported list (macOS only)?
□ Was Bundle ID retrieved successfully (macOS only)?
□ Is system volume normal?
```

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Common Questions](../common-questions/)**.
>
> You'll learn:
> - Whether opencode-notify adds overhead to conversation context
> - Whether you'll receive notification spam
> - How to temporarily disable notifications
> - Performance impact and privacy/security concerns

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Function | File Path | Lines |
|--- | --- | ---|
| Configuration loading and error handling | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Terminal detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS osascript execution | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L120-L133) | 120-133 |
| Terminal focus detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Quiet hours check | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Parent session detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| Notification sending | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| Default configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Terminal process name mapping | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Task completion handling | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 |
| Error notification handling | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 |
| Permission request handling | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 |
| Question prompt handling | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 |

**Key Constants**:

- `DEFAULT_CONFIG`: Default configuration (lines 56-68)
  - `notifyChildSessions: false`: By default, don't notify child sessions
  - `sounds.idle: "Glass"`: Task completion sound
  - `sounds.error: "Basso"`: Error sound
  - `sounds.permission: "Submarine"`: Permission request sound
  - `quietHours.start: "22:00"`, `quietHours.end: "08:00"`: Default quiet hours

- `TERMINAL_PROCESS_NAMES`: Mapping from terminal names to macOS process names (lines 71-84)

**Key Functions**:

- `loadConfig()`: Loads and merges configuration file with defaults; uses defaults when file doesn't exist or is invalid
- `detectTerminalInfo()`: Detects terminal information (name, Bundle ID, process name)
- `isTerminalFocused()`: Checks if terminal is the current foreground app (macOS)
- `isQuietHours()`: Checks if current time is within quiet hours
- `isParentSession()`: Checks if session is a parent session
- `sendNotification()`: Sends native notifications, supports macOS click-to-focus
- `runOsascript()`: Executes AppleScript (macOS), returns null on failure
- `getBundleId()`: Retrieves app Bundle ID (macOS)

**Business Rules**:

- BR-1-1: By default, only notify parent sessions, not child sessions (`notify.ts:256-259`)
- BR-1-2: Suppress notifications when terminal is focused (`notify.ts:265`)
- BR-1-3: Don't send notifications during quiet hours (`notify.ts:262`)
- BR-1-4: Permission requests always notify, no parent session check needed (`notify.ts:319`)
- BR-1-5: Question prompts don't do focus check, supports tmux workflow (`notify.ts:340`)
- BR-1-6: macOS supports clicking notification to focus terminal (`notify.ts:238-240`)

**Exception Handling**:

- `loadConfig()`: Uses default configuration when file doesn't exist or JSON parsing fails (`notify.ts:110-113`)
- `isParentSession()`: Assumes parent session when session query fails (notify rather than miss) (`notify.ts:210-212`)
- `runOsascript()`: Returns null when osascript execution fails (`notify.ts:120-132`)
- `handleSessionIdle()`: Uses default title when session info retrieval fails (`notify.ts:274-276`)

</details>
