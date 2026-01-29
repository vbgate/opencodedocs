---
title: "macOS Platform Features: Focus Detection, Click to Focus, and Custom Sounds | opencode-notify Tutorial"
sidebarTitle: "macOS Features"
subtitle: "macOS Platform Features"
description: "Learn opencode-notify's exclusive macOS features: intelligent focus detection to avoid duplicate notifications, click-to-focus terminal activation, and 12 built-in custom sound effects. This tutorial covers configuration methods, available sound lists, and practical tips to help you maximize macOS native notification capabilities, boost productivity, and reduce unnecessary window switching."
tags:
  - "Platform Features"
  - "macOS"
  - "Focus Detection"
prerequisite:
  - "/kdcokenny/opencode-notify/start/quick-start/"
order: 30
---

# macOS Platform Features

## What You'll Learn

- ✅ Configure intelligent focus detection so the plugin knows when you're viewing the terminal
- ✅ Automatically focus terminal window by clicking notifications
- ✅ Customize notification sounds for different event types
- ✅ Understand macOS platform-specific advantages and limitations

## Your Current Problem

You frequently switch windows when using OpenCode: AI runs tasks in the background while you switch to the browser to research. Every few dozen seconds, you switch back to check: Is the task done? Did it error? Or is it waiting for your input?

If only there were native desktop notifications, like receiving a WeChat message, to alert you when AI completes tasks or needs your attention.

## When to Use This

- **You're using OpenCode on macOS** - This lesson applies only to macOS
- **You want to optimize your workflow** - Avoid frequent window switching to check AI status
- **You want better notification experience** - Take advantage of macOS native notification benefits

::: info Why is macOS More Powerful?
The macOS platform provides complete notification capabilities: focus detection, click-to-focus, and custom sounds. Windows and Linux currently only support basic native notification features.
:::

## 🎒 Prerequisites

Before starting, ensure you've completed:

::: warning Prerequisites Check
- [ ] Completed the [Quick Start](../../start/quick-start/) tutorial
- [ ] Plugin installed and working properly
- [ ] Using macOS system
:::

## Core Concept

The complete macOS notification experience is built on three key capabilities:

### 1. Intelligent Focus Detection

The plugin knows whether you're currently viewing the terminal window. If you're reviewing AI output, it won't send notifications to disturb you. Only when you switch to other applications will notifications be sent.

**How it works**: Uses macOS's `osascript` system service to query the process name of the current foreground application and compares it with your terminal's process name.

### 2. Click Notification to Focus Terminal

After receiving a notification, clicking the notification card automatically brings the terminal window to the front. You can immediately return to your workflow.

**How it works**: macOS Notification Center supports the `activate` option. By passing the application's Bundle ID, clicking the notification focuses the application.

### 3. Custom Sounds

Assign different sounds to different event types: use crisp sounds for task completion, low-pitched sounds for errors, letting you understand the situation roughly without even looking at notifications.

**How it works**: Leverages macOS's 14 built-in standard sound effects (like Glass, Basso, Submarine), specified through the `sounds` field in the configuration file.

::: tip Three Capabilities Working Together
Focus detection prevents disturbance → Click notification to quickly return → Sound effects quickly identify event types
:::

## Follow Along

### Step 1: Verify Auto-Detected Terminal

The plugin automatically detects your terminal simulator on startup. Let's check if it's correctly identified.

**Why**

The plugin needs to know your terminal type to implement focus detection and click-to-focus functionality.

**Action**

1. Open your OpenCode configuration directory:
   ```bash
   ls ~/.config/opencode/
   ```

2. If you've already created a `kdco-notify.json` configuration file, check if there's a `terminal` field:
   ```bash
   cat ~/.config/opencode/kdco-notify.json
   ```

3. If the configuration file doesn't have a `terminal` field, the plugin is using auto-detection.

**You Should See**

If the configuration file doesn't have a `terminal` field, the plugin will auto-detect. Supported terminals include:
- **Common terminals**: Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- **System terminal**: macOS's built-in Terminal.app
- **Other terminals**: Hyper, Warp, VS Code integrated terminal, etc.

::: info 37+ Terminal Support
The plugin uses the `detect-terminal` library, supporting 37+ terminal simulators. If your terminal isn't in the common list, it will attempt to auto-identify it.
:::

### Step 2: Configure Custom Sounds

macOS provides 14 built-in sound effects that you can assign to different events.

**Why**

Different sounds let you roughly understand what happened without looking at notifications: task completion or error, AI waiting or just completing a task.

**Action**

1. Open or create the configuration file:
   ```bash
   nano ~/.config/opencode/kdco-notify.json
   ```

2. Add or modify the `sounds` configuration:

```json
{
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

3. Save and exit (Ctrl+O, Enter, Ctrl+X)

**You Should See**

The `sounds` field in the configuration file has four options:

| Field | Purpose | Default | Recommended Setting |
|--- | --- | --- | ---|
| `idle` | Task completion sound | Glass | Glass (crisp) |
| `error` | Error notification sound | Basso | Basso (low-pitched) |
| `permission` | Permission request sound | Submarine | Submarine (alert) |
| `question` | AI question sound (optional) | permission | Purr (gentle) |

::: tip Recommended Combination
This default combination is intuitive: use a light sound for completion, a warning sound for errors, and an alert sound for permission requests.
:::

### Step 3: Understand Available Sound List

macOS has 14 built-in sound effects that you can freely combine.

**Why**

Knowing all available sounds helps you find the combination that best suits your work habits.

**Available Sounds**

| Sound Name | Characteristic | Use Case |
|--- | --- | ---|
| Glass | Light, crisp | Task completion |
| Basso | Low-pitched, warning | Error notification |
| Submarine | Alert, gentle | Permission request |
| Blow | Powerful | Important events |
| Bottle | Crisp | Subtask completion |
| Frog | Relaxed | Informal reminders |
| Funk | Rhythmic | Multi-task completion |
| Hero | Grand | Milestone completion |
| Morse | Morse code | Debugging related |
| Ping | Crisp | Lightweight reminders |
| Pop | Brief | Quick tasks |
| Purr | Gentle | Non-disturbing reminders |
| Sosumi | Unique | Special events |
| Tink | Bright | Small task completion |

::: tip Sound and Meaning
After setting up, try different sound combinations to find the configuration that best fits your workflow.
:::

### Step 4: Test Click-to-Focus Functionality

After clicking a notification, the terminal window automatically comes to the front. This is a macOS-exclusive feature.

**Why**

When you receive a notification, you don't need to manually switch to the terminal and find the window—clicking the notification directly returns you to your workflow.

**Action**

1. Ensure OpenCode is running and start an AI task
2. Switch to another application (like browser)
3. Wait for the AI task to complete, you should receive a "Ready for review" notification
4. Click the notification card

**You Should See**

- Notification disappears
- Terminal window automatically comes to front and gains focus
- You can immediately review AI's output

::: info Focus Principle
The plugin dynamically obtains the terminal application's Bundle ID through osascript, then passes the `activate` option when sending notifications. When macOS Notification Center receives this option, clicking the notification automatically activates the corresponding application.
:::

### Step 5: Verify Focus Detection Functionality

When you're viewing the terminal, you won't receive notifications. This avoids duplicate reminders.

**Why**

If you're already looking at the terminal, notifications are redundant. Only when you switch to other applications do notifications make sense.

**Action**

1. Open OpenCode and start an AI task
2. Keep the terminal window in the foreground (don't switch)
3. Wait for task completion

**You Should See**

- No "Ready for review" notification received
- Task completion displayed in terminal

**Now try this**:

1. Start another AI task
2. Switch to browser or another application
3. Wait for task completion

**You Should See**

- Received "Ready for review" notification
- Configured sound played (default Glass)

::: tip The Intelligence of Focus Detection
The plugin knows when you're looking at the terminal and when you're not. This ensures you won't miss important reminders and won't be disturbed by duplicate notifications.
:::

## Checkpoint ✅

### Configuration Check

- [ ] Configuration file `~/.config/opencode/kdco-notify.json` exists
- [ ] `sounds` field configured (at least includes idle, error, permission)
- [ ] No `terminal` field set (using auto-detection)

### Functionality Check

- [ ] Receive notifications after AI task completion
- [ ] Terminal window comes to front after clicking notification
- [ ] No duplicate notifications received when terminal window is in foreground
- [ ] Different sound effects play for different event types

::: danger Focus Detection Not Working?
If the terminal doesn't come to front after clicking notification, possible causes:
1. Terminal application not correctly recognized - Check `terminal` field in configuration file
2. Bundle ID retrieval failed - Check error messages in OpenCode logs
:::

## Common Pitfalls

### Sound Not Playing

**Problem**: Sound effects configured, but no sound when notifying

**Possible Causes**:
1. System volume too low or muted
2. Notification sounds disabled in macOS System Preferences

**Solutions**:
1. Check system volume and notification settings
2. Open "System Settings → Notifications → OpenCode", ensure sound is enabled

### Clicking Notification Doesn't Focus

**Problem**: After clicking notification, terminal window doesn't come to front

**Possible Causes**:
1. Terminal application not auto-detected
2. Bundle ID retrieval failed

**Solutions**:
1. Manually specify terminal type:
   ```json
   {
     "terminal": "ghostty"  // or other terminal name
   }
   ```

2. Ensure terminal application name is correct (case-sensitive)

### Focus Detection Not Working

**Problem**: Still receiving notifications even when terminal is in foreground

**Possible Causes**:
1. Terminal process name detection failed
2. Terminal application not in auto-detection list

**Solutions**:
1. Manually specify terminal type:
   ```json
   {
     "terminal": "ghostty"  // or other terminal name
   }
   ```

2. Ensure terminal application name is correct (case-sensitive)
3. Check logs to confirm terminal is correctly identified

## Summary

The macOS platform provides a complete notification experience:

| Feature | Purpose | Platform Support |
|--- | --- | ---|
| Native Notifications | Display system-level notifications | ✅ macOS<br>✅ Windows<br>✅ Linux |
| Custom Sounds | Different sounds for different events | ✅ macOS |
| Focus Detection | Avoid duplicate notifications | ✅ macOS |
| Click to Focus | Quickly return to work | ✅ macOS |

**Core Configuration**:
```json
{
  "sounds": {
    "idle": "Glass",       // Task completion
    "error": "Basso",      // Error
    "permission": "Submarine"  // Permission request
  }
}
```

**Workflow**:
1. AI completes task → Send notification → Play Glass sound
2. You're working in browser → Receive notification → Click
3. Terminal automatically comes to front → Review AI output

## Next Lesson Preview

> In the next lesson, we'll learn **[Windows Platform Features](../windows/)**.
>
> You'll learn:
> - Which features are supported on Windows
> - Differences compared to macOS
> - How to configure notifications on Windows

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Lines |
|--- | --- | ---|
| Focus Detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| Click to Focus | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Bundle ID Retrieval | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| Foreground App Detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| Terminal Name Mapping | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Default Sound Configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L59-L61) | 59-61 |
| macOS Sound List | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
| Platform Feature Comparison Table | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L54-L62) | 54-62 |

**Key Constants**:

- `TERMINAL_PROCESS_NAMES` (lines 71-84): Mapping of terminal names to macOS process names
  - `ghostty` → `"Ghostty"`
  - `kitty` → `"kitty"`
  - `iterm` / `iterm2` → `"iTerm2"`
  - `wezterm` → `"WezTerm"`
  - `alacritty` → `"Alacritty"`
  - `terminal` / `apple_terminal` → `"Terminal"`
  - `hyper` → `"Hyper"`
  - `warp` → `"Warp"`
  - `vscode` → `"Code"`
  - `vscode-insiders` → `"Code - Insiders"`

**Default Configuration**:

- `sounds.idle = "Glass"`: Task completion sound
- `sounds.error = "Basso"`: Error notification sound
- `sounds.permission = "Submarine"`: Permission request sound

**Key Functions**:

- `isTerminalFocused(terminalInfo)` (lines 166-175): Detect if terminal is foreground application
  - Uses `osascript` to get foreground app process name
  - Compares with terminal's `processName` (case-insensitive)
  - Only enabled on macOS platform

- `getBundleId(appName)` (lines 135-137): Dynamically get app Bundle ID
  - Uses `osascript` to query
  - Bundle ID used for click-to-focus functionality

- `getFrontmostApp()` (lines 139-143): Get current foreground application
  - Uses `osascript` to query System Events
  - Returns process name of foreground app

- `sendNotification(options)` (lines 227-243): Send notification
  - macOS feature: If platform detected as darwin and `terminalInfo.bundleId` exists, sets `activate` option to implement click-to-focus

</details>
