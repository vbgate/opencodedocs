---
title: "Advanced Usage: Configuration Tips and Best Practices | opencode-notify Tutorial"
sidebarTitle: "Advanced Usage"
subtitle: "Advanced Usage: Configuration Tips and Best Practices | opencode-notify Tutorial"
description: "Learn opencode-notify advanced configuration tips including parent session filtering, sound customization, terminal override, and quiet hours to optimize notification experience."
tags:
  - "Configuration"
  - "Best Practices"
  - "Sounds"
prerequisite:
  - "start-quick-start"
  - "advanced-config-reference"
order: 100
---

# Advanced Usage: Configuration Tips and Best Practices

## What You'll Learn

- Understand why only parent sessions are notified by default to reduce notification noise
- Customize macOS notification sounds to distinguish different event types
- Manually specify terminal type to resolve auto-detection issues
- Set up temporary quiet hours to avoid interruptions during meetings or focus time
- Optimize notification strategy to balance timeliness and distraction

## Your Current Problem

While the notification plugin is convenient, the default configuration may not suit everyone's workflow:

- You want to track all AI subtasks, but only parent sessions are notified by default
- You use a niche terminal and auto-detection fails
- You want to temporarily silence notifications during meetings without editing config files each time
- Different event types use the same sound, making it hard to distinguish task completion from errors

## When to Use This

When you're already familiar with the plugin basics and want to optimize notification experience according to your personal workflow.

---

## Core Concept

The notification plugin's default configuration is carefully designed, but you can adjust behavior through the configuration file. The core principle is:

**Reduce Noise, Increase Value**

- **Parent Session Filtering**: Only notify main tasks, ignore AI internal subtasks
- **Focus Awareness**: Don't notify when terminal is active to avoid duplicate alerts
- **Batch Notifications**: Merge notifications when multiple tasks complete simultaneously

::: info Note
All configuration options are documented in detail in [Configuration Reference](../config-reference/). This lesson focuses on practical usage tips and best practices.
:::

---

## 🎒 Prerequisites

Make sure you've completed [Quick Start](../../start/quick-start/) and successfully received your first notification.

---

## Follow Along

### Step 1: Understand Parent Session Filtering

**Why**

OpenCode sessions have a tree structure: one parent session can have multiple child sessions. By default, the plugin only notifies when parent sessions complete, avoiding notification noise from subtasks.

**View Configuration**

Edit configuration file:

```bash
# macOS/Linux
~/.config/opencode/kdco-notify.json

# Windows
%APPDATA%\opencode\kdco-notify.json
```

```json
{
  "notifyChildSessions": false  // ← Default false
}
```

**You should see**:
- `notifyChildSessions: false` means only root sessions are notified
- AI internal subtool calls won't trigger notifications

**When to Enable Child Session Notifications**

If you need to track every subtask (e.g., debugging multi-step workflows), set to `true`:

```json
{
  "notifyChildSessions": true  // ← After enabling, each subtask will notify
}
```

::: warning Warning
Enabling child session notifications will significantly increase notification frequency. Use with caution.
:::

---

### Step 2: Customize macOS Notification Sounds

**Why**

Different event types with different sounds let you know what happened without looking at notifications.

**View Available Sounds**

macOS provides 14 built-in sounds:

| Sound Name | Use Case | Style |
|--- | --- | ---|
| Glass | Task completion (default) | Crisp |
| Basso | Error (default) | Deep |
| Submarine | Permission request (default) | Gentle |
| Bottle | Special event | Light |
| Ping | General reminder | Simple |
| Pop | Casual event | Lively |
| Purr | Success event | Mild |
| Blow | Warning | Urgent |
| Funk | Special marker | Unique |
| Frog | Reminder | Loud |
| Hero | Important event | Grand |
| Morse | Notification | Rhythmic |
| Sosumi | System prompt | Classic |
| Tink | Complete | Light |

**Customize Sounds**

Modify the `sounds` section in configuration:

```json
{
  "sounds": {
    "idle": "Ping",        // Task completion
    "error": "Blow",      // Error (more urgent)
    "permission": "Pop",   // Permission request (more lively)
    "question": "Tink"    // Question prompt (optional, uses permission sound by default)
  }
}
```

**You should see**:
- After modification, different event types play corresponding sounds
- If `sounds.question` is not set, it uses `sounds.permission` sound

::: tip Tip
Sound customization only works on macOS. Windows and Linux use system default notification sounds.
:::

---

### Step 3: Manually Specify Terminal Type

**Why**

The `detect-terminal` library supports 37+ terminals, but niche terminals or custom builds may not be recognized.

**Check Currently Detected Terminal**

Currently cannot directly view detection results, but you can infer from logs:

```bash
# OpenCode UI will display plugin startup logs
```

If you see "Terminal detection failed" or notifications can't focus, you may need to specify manually.

**Manually Specify Terminal**

Add `terminal` field in configuration:

```json
{
  "terminal": "wezterm"  // Use lowercase terminal name
}
```

**Supported Terminal Names**

Common terminal names (case-insensitive):

| Terminal | Configuration Value |
|--- | ---|
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm"` or `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` or `"apple_terminal"` |
| Hyper | `"hyper"` |
| VS Code Terminal | `"code"` or `"code-insiders"` |

**You should see**:
- After manual specification, macOS focus detection and click-to-focus work properly
- If specified incorrectly, plugin will silently fail and fall back to auto-detection

---

### Step 4: Temporary Quiet Hours

**Why**

During meetings, code reviews, or focus time, you may want to temporarily stop receiving notifications.

**Use Quiet Hours**

If you want to avoid interruptions during fixed daily periods (e.g., nighttime), configure quiet hours:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",  // 10 PM
    "end": "08:00"     // 8 AM next day
  }
}
```

**Cross-Midnight Support**

Quiet hours can cross midnight (e.g., 22:00-08:00):

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"     // 22:00 - 08:00 next day
  }
}
```

**You should see**:
- During quiet hours, no notifications are sent for any events
- Normal notifications resume outside quiet hours

::: tip Tip
Time format must be `HH:MM` (24-hour format), such as `"22:30"`.
:::

---

### Step 5: Balance Notification Strategy

**Why**

Default configuration is already optimized, but you may need to adjust according to your workflow.

**Default Strategy Summary**

| Configuration | Default Value | Effect |
|--- | --- | ---|
| `notifyChildSessions` | `false` | Only notify parent sessions |
| `quietHours.enabled` | `false` | Quiet hours not enabled |

::: info Info
Focus detection (no notification when terminal is active) is hardcoded and cannot be disabled via configuration.
:::

**Recommended Configuration Combinations**

**Scenario 1: Minimize Distractions (Default)**

```json
{
  "notifyChildSessions": false
}
```

**Scenario 2: Track All Tasks**

```json
{
  "notifyChildSessions": true
}
```

::: warning Warning
This will significantly increase notification frequency, suitable for scenarios requiring fine-grained monitoring.
:::

**Scenario 3: Nighttime Quiet Hours**

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

**You should see**:
- Notification behavior varies significantly based on different scenarios
- Gradually adjust to find the configuration that works best for you

---

## Checkpoint ✅

After completing configuration, verify the following:

| Check Item | Verification Method |
|--- | ---|
| Parent session filtering | Trigger an AI task with subtasks, receive only one "Ready for review" notification |
| Sound customization | Trigger task completion, error, and permission request separately, hear different sounds |
| Terminal override | On macOS, click notification, terminal window correctly brings to front |
| Quiet hours | Trigger event during quiet hours, no notification received |

---

## Common Pitfalls

### Configuration Changes Not Taking Effect

**Problem**: After modifying configuration file, notification behavior doesn't change.

**Cause**: OpenCode may need to restart the plugin or OpenCode itself.

**Solution**: Restart OpenCode CLI or OpenCode UI.

---

### Sound Not Playing

**Problem**: Set custom sound, but still default sound plays.

**Causes**:
- Sound name misspelled
- Not on macOS platform

**Solutions**:
- Check if sound name is in supported list (case-sensitive)
- Confirm using macOS system

---

### Terminal Override Not Working

**Problem**: Set `terminal` field, but clicking notification still can't focus.

**Causes**:
- Incorrect terminal name
- Terminal process name doesn't match configuration value

**Solutions**:
- Try lowercase name
- Check [supported terminals](../../platforms/terminals/) list

---

## Summary

In this lesson, we learned opencode-notify's advanced usage and best practices:

- **Parent Session Filtering**: By default only notify root sessions to avoid subtask noise
- **Sound Customization**: macOS supports 14 custom sounds to distinguish event types
- **Terminal Override**: Manually specify terminal type to resolve auto-detection issues
- **Temporary Quiet Hours**: Set quiet hours via `quietHours`
- **Strategy Balance**: Adjust configuration according to workflow to balance timeliness and distraction

**Core Principle**: Reduce noise, increase value. Default configuration is already optimized, so most users won't need to modify it.

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Troubleshooting](../../faq/troubleshooting/)**.
>
> You'll learn:
> - What to do if notifications don't display
> - How to troubleshoot focus detection failures
> - Interpreting common error messages
> - Platform-specific solutions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Lines |
|--- | --- | ---|
| Parent session detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214   |
| Configuration schema | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L68) | 30-68 |
| Default configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| macOS sound list | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |

**Key Constants**:
- `DEFAULT_CONFIG`: Default configuration values
- `TERMINAL_PROCESS_NAMES`: Terminal name to macOS process name mapping table

**Key Functions**:
- `isParentSession()`: Determines if session is a parent session
- `loadConfig()`: Loads and merges user configuration

</details>
