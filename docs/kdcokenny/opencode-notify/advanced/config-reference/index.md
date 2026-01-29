---
title: "opencode-notify Configuration Reference: Complete Settings Guide and Platform Differences | Tutorial"
sidebarTitle: "Configuration Reference"
subtitle: "Configuration Reference: Complete Settings Guide"
description: "Learn complete opencode-notify configuration settings, including child session notifications toggle, custom sounds, quiet hours, and terminal type override. This tutorial provides detailed parameter descriptions, default values, platform differences, and complete examples to help you customize notification behavior, optimize workflow, and master macOS, Windows, and Linux configuration techniques."
tags:
  - "Configuration Reference"
  - "Advanced Configuration"
prerequisite:
  - "/kdcokenny/opencode-notify/start/quick-start/"
order: 70
---

# Configuration Reference

## What You'll Learn

- ✅ Understand all configurable parameters and their meanings
- ✅ Customize notification behavior based on your needs
- ✅ Configure quiet hours to avoid interruptions during specific times
- ✅ Understand the impact of platform differences on configuration

## Your Current Problem

The default configuration works fine, but your workflow might be special:
- You need to receive important notifications at night, but don't want to be disturbed during normal hours
- You work with multiple parallel sessions and want all sessions to notify
- You work in tmux and find focus detection doesn't behave as expected
- You want to understand what a specific configuration option does

## When to Use This

- **You need to customize notification behavior** - Default settings don't match your work habits
- **You want to reduce notification interruptions** - Configure quiet hours or child session toggle
- **You want to debug plugin behavior** - Understand the purpose of each configuration option
- **You use multiple platforms** - Understand how platform differences affect configuration

## Core Concept

The configuration file lets you adjust plugin behavior without modifying code, like a "settings menu" for the plugin. The configuration file is in JSON format, located at `~/.config/opencode/kdco-notify.json`.

**Configuration Loading Flow**:

```
Plugin starts
    ↓
Read user configuration file
    ↓
Merge with default configuration (user config takes priority)
    ↓
Run with merged configuration
```

::: info Configuration File Path
`~/.config/opencode/kdco-notify.json`
:::

## 📋 Configuration Options

### Complete Configuration Structure

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": ""
}
```

### Detailed Explanation

#### notifyChildSessions

| Option | Type | Default | Description |
| ------ | ---- | ------ | ----------- |
| `notifyChildSessions` | boolean | `false` | Whether to notify for child sessions |

**Purpose**: Controls whether to send notifications for child sessions (sub-sessions).

**What are child sessions**:
When you use OpenCode's multi-session feature, sessions can be divided into parent sessions and child sessions. Child sessions are auxiliary tasks started by parent sessions, such as file I/O, network requests, etc.

**Default behavior** (`false`):
- Only notify for completion, error, and permission request events in parent sessions
- Do not notify for any events in child sessions
- This avoids receiving many notifications when multitasking in parallel

**When enabled** (`true`):
- All sessions (both parent and child) will notify
- Suitable for scenarios where you need to track progress of all child tasks

::: tip Recommended Setting
Keep default `false`, unless you really need to track the status of every child task.
:::

#### Focus Detection (macOS)

The plugin automatically detects whether the terminal is in the foreground. If the terminal is the current active window, it suppresses notification sending to avoid duplicate reminders.

**How it works**:
- Uses macOS's `osascript` to detect the current foreground application
- Compares the foreground application process name with your terminal process name
- If the terminal is in the foreground, no notification is sent
- **Except for question notifications** (supports tmux workflow)

::: info Platform Difference
Focus detection feature only works on macOS. Windows and Linux do not support this feature.
:::

#### sounds

| Option | Type | Default | Platform Support | Description |
| ------ | ---- | ------ | ---------------- | ----------- |
| `sounds.idle` | string | `"Glass"` | ✅ macOS | Task completion sound |
| `sounds.error` | string | `"Basso"` | ✅ macOS | Error notification sound |
| `sounds.permission` | string | `"Submarine"` | ✅ macOS | Permission request sound |
| `sounds.question` | string | Not set | ✅ macOS | Question inquiry sound (optional) |

**Purpose**: Set different system sounds for different types of notifications (macOS only).

**Available Sound List**:

| Sound Name | Characteristic | Recommended Use Case |
| ---------- | -------------- | ------------------- |
| Glass | Light, crisp | Task completion (default) |
| Basso | Low-pitched, warning | Error notification (default) |
| Submarine | Alert, gentle | Permission request (default) |
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

**question field explanation**:
`sounds.question` is an optional field for notifications when AI asks questions. If not set, it will use the `permission` sound.

::: tip Sound Configuration Tips
- Use light sounds for success (idle)
- Use low-pitched sounds for errors (error)
- Use gentle sounds for things needing your attention (permission, question)
- Different sound combinations let you roughly understand the situation without looking at notifications
:::

::: warning Platform Difference
`sounds` configuration is only valid on macOS. Windows and Linux use system default notification sounds and cannot be customized.
:::

#### quietHours

| Option | Type | Default | Description |
| ------ | ---- | ------ | ----------- |
| `quietHours.enabled` | boolean | `false` | Whether to enable quiet hours |
| `quietHours.start` | string | `"22:00"` | Quiet hours start time (HH:MM format) |
| `quietHours.end` | string | `"08:00"` | Quiet hours end time (HH:MM format) |

**Purpose**: Suppress sending all notifications during a specified time period.

**Default behavior** (`enabled: false`):
- Quiet hours are not enabled
- You may receive notifications at any time

**When enabled** (`enabled: true`):
- No notifications are sent between `start` and `end` time
- Supports crossing midnight (e.g., 22:00-08:00)

**Time format**:
- Use 24-hour `HH:MM` format
- Example: `"22:30"` means 10:30 PM

**Crossing midnight period**:
- If `start > end` (e.g., 22:00-08:00), it indicates crossing midnight
- The quiet hours period is from 10:00 PM to 8:00 AM the next day

::: info Quiet Hours Priority
Quiet hours has the highest priority. Even if other conditions are met, no notification will be sent during quiet hours.
:::

#### terminal

| Option | Type | Default | Description |
| ------ | ---- | ------ | ----------- |
| `terminal` | string | Not set | Manually specify terminal type (override auto-detection) |

**Purpose**: Manually specify your terminal emulator type, overriding the plugin's auto-detection.

**Default behavior** (not set):
- Plugin uses `detect-terminal` library to automatically detect your terminal
- Supports 37+ terminal emulators

**When set**:
- Plugin uses the specified terminal type
- Used for focus detection and click-to-focus features (macOS)

**Common Terminal Values**:

| Terminal App | Configuration Value |
| ------------ | ------------------- |
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code Integrated Terminal | `"vscode"` |

::: tip When to Manually Set
- Auto-detection fails, focus detection doesn't work
- You use multiple terminals and need to specify a specific one
- Your terminal name is not in the common list
:::

## Platform Differences Summary

Different platforms have different levels of support for configuration options:

| Configuration Option | macOS | Windows | Linux |
| ------------------- | ----- | ------- | ----- |
| `notifyChildSessions` | ✅ | ✅ | ✅ |
| Focus Detection (hardcoded) | ✅ | ❌ | ❌ |
| `sounds.*` | ✅ | ❌ | ❌ |
| `quietHours.*` | ✅ | ✅ | ✅ |
| `terminal` | ✅ | ✅ | ✅ |

::: warning Note for Windows/Linux Users
`sounds` configuration and focus detection features are not effective on Windows and Linux.
- Windows/Linux use system default notification sounds
- Windows/Linux do not support focus detection (cannot be controlled via configuration)
:::

## Configuration Examples

### Basic Configuration (Recommended)

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

This configuration is suitable for most users:
- Only notify for parent sessions to avoid child task noise
- Automatically suppress notifications when terminal is in foreground on macOS (no configuration needed)
- Use default sound combination
- Do not enable quiet hours

### Enable Quiet Hours

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Suitable for users who want to avoid interruptions at night:
- No notifications sent from 10:00 PM to 8:00 AM
- Normal notifications at other times

### Track All Child Tasks

```json
{
  "notifyChildSessions": true,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Ping"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Suitable for users who need to track all task progress:
- All sessions (both parent and child) will notify
- Set separate sound for question inquiries (Ping)

### Manually Specify Terminal

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
  },
  "terminal": "ghostty"
}
```

Suitable for users where auto-detection fails or using multiple terminals:
- Manually specify using Ghostty terminal
- Ensure focus detection and click-to-focus features work properly

### Windows/Linux Minimal Configuration

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Suitable for Windows/Linux users (simplified configuration):
- Only keep configuration options supported by the platform
- `sounds` configuration and focus detection features are invalid on Windows/Linux, no need to set

## Configuration File Management

### Create Configuration File

**macOS/Linux**:

```bash
# Create configuration directory (if it doesn't exist)
mkdir -p ~/.config/opencode

# Create configuration file
nano ~/.config/opencode/kdco-notify.json
```

**Windows (PowerShell)**:

```powershell
# Create configuration directory (if it doesn't exist)
New-Item -ItemType Directory -Path "$env:APPDATA\opencode" -Force

# Create configuration file
notepad "$env:APPDATA\opencode\kdco-notify.json"
```

### Verify Configuration File

**Check if file exists**:

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
Get-Content "$env:APPDATA\opencode\kdco-notify.json"
```

**Check if configuration takes effect**:

1. Modify configuration file
2. Restart OpenCode (or trigger configuration reload)
3. Observe if notification behavior matches expectations

### Configuration File Error Handling

If the configuration file format is incorrect:
- Plugin will ignore the erroneous configuration file
- Continue running with default configuration
- Output warning information in OpenCode logs

**Common JSON Errors**:

| Error Type | Example | Fix Method |
| ---------- | ------- | ---------- |
| Missing comma | `"key1": "value1" "key2": "value2"` | Add comma: `"key1": "value1",` |
| Extra comma | `"key1": "value1",}` | Remove last comma: `"key1": "value1"}` |
| Unclosed quotes | `"key": value` | Add quotes: `"key": "value"` |
| Single quotes used | `'key': 'value'` | Use double quotes: `"key": "value"` |
| Comment syntax error | `{"key": "value" /* comment */}` | JSON doesn't support comments, delete comments |

::: tip Use JSON Validation Tools
You can use online JSON validation tools (like jsonlint.com) to check if configuration file format is correct.
:::

## Summary

This lesson provides a complete configuration reference for opencode-notify:

**Core Configuration Options**:

| Configuration Option | Purpose | Default Value | Platform Support |
| ------------------- | ------- | ------------- | ---------------- |
| `notifyChildSessions` | Child session notification toggle | `false` | All platforms |
| Focus Detection | Terminal focus suppression (hardcoded) | No configuration | macOS only |
| `sounds.*` | Custom sounds | See individual fields | macOS only |
| `quietHours.*` | Quiet hours configuration | See individual fields | All platforms |
| `terminal` | Manually specify terminal | Not set | All platforms |

**Configuration Principles**:
- **Most users**: Default configuration is sufficient
- **Need quiet time**: Enable `quietHours`
- **Need to track child tasks**: Enable `notifyChildSessions`
- **macOS users**: Can customize `sounds`, enjoy automatic focus detection
- **Windows/Linux users**: Fewer configuration options, focus on `notifyChildSessions` and `quietHours`

**Configuration File Path**: `~/.config/opencode/kdco-notify.json`

## Next Lesson Preview

> In the next lesson, we'll learn **[Quiet Hours Deep Dive](../quiet-hours/)**.
>
> You'll learn:
> - Detailed working principles of quiet hours
> - Configuration methods for crossing midnight periods
> - Priority of quiet hours with other configurations
> - Common issues and solutions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Lines |
| ------- | --------- | ----- |
| Configuration interface definition | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| Default configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| Configuration file loading | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L91-L114) | 91-114 |
| Child session check | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Terminal focus check | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Quiet hours check | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Sound configuration usage | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L236) | 227-236 |
| README configuration example | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L68-L79) | 68-79 |

**Configuration Interface** (NotifyConfig):

```typescript
interface NotifyConfig {
  /** Notify for child/sub-session events (default: false) */
  notifyChildSessions: boolean
  /** Sound configuration per event type */
  sounds: {
    idle: string
    error: string
    permission: string
    question?: string
  }
  /** Quiet hours configuration */
  quietHours: {
    enabled: boolean
    start: string // "HH:MM" format
    end: string // "HH:MM" format
  }
  /** Override terminal detection (optional) */
  terminal?: string
}
```

**Note**: There is **no** `suppressWhenFocused` field in the configuration interface. Focus detection is a hardcoded behavior on macOS platform; users cannot control it through the configuration file.

**Default Configuration** (DEFAULT_CONFIG):

```typescript
const DEFAULT_CONFIG: NotifyConfig = {
  notifyChildSessions: false,
  sounds: {
    idle: "Glass",      // Task completion sound
    error: "Basso",     // Error sound
    permission: "Submarine",  // Permission request sound
  },
  quietHours: {
    enabled: false,     // Quiet hours not enabled by default
    start: "22:00",    // 10:00 PM
    end: "08:00",      // 8:00 AM
  },
}
```

**Configuration Loading Function** (loadConfig):

- Path: `~/.config/opencode/kdco-notify.json`
- Uses `fs.readFile()` to read configuration file
- Merges with `DEFAULT_CONFIG` (user config takes priority)
- Nested objects (`sounds`, `quietHours`) are also merged
- If configuration file doesn't exist or format is incorrect, uses default configuration

**Child Session Check** (isParentSession):

- Checks if `sessionID` contains `/` (child session identifier)
- If `notifyChildSessions` is `false`, skips child session notifications
- Permission request notifications (`permission.updated`) are always sent, not subject to this restriction

**Terminal Focus Check** (isTerminalFocused):

- Uses `osascript` to get current foreground application process name
- Compares with terminal's `processName` (case-insensitive)
- Only enabled on macOS platform, **cannot be disabled via configuration**
- Question inquiry notifications (`question`) do not perform focus check (supports tmux workflow)

**Quiet Hours Check** (isQuietHours):

- Converts current time to minutes (from midnight 0:00)
- Compares with configured `start` and `end`
- Supports crossing midnight periods (e.g., 22:00-08:00)
- If `start > end`, indicates crossing midnight

**Sound Configuration Usage** (sendNotification):

- Reads sound name for corresponding event from configuration
- Passes to `node-notifier`'s `sound` option
- Only effective on macOS platform
- If `question` event doesn't have configured sound, uses `permission` sound

</details>
