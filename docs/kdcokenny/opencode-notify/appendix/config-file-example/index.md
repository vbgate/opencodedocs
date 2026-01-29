---
title: "Config File Example: notifyChildSessions and sounds | opencode-notify Tutorial"
sidebarTitle: "Config File Example"
subtitle: "Config File Example: notifyChildSessions and sounds"
description: "View complete opencode-notify configuration file example. Learn detailed comments, default values, minimal config examples for notifyChildSessions, sounds, quietHours, terminal and all other config fields, plus full list of macOS available sounds and plugin disable method, with link to changelog for version history and new feature improvements."
tags:
  - "Configuration"
  - "Example"
  - "Appendix"
prerequisite: []
order: 140
---

# Config File Example

## Complete Configuration Example

Save the following to `~/.config/opencode/kdco-notify.json`:

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
  "terminal": "Ghostty"
}
```

## Field Descriptions

### notifyChildSessions

- **Type**: boolean
- **Default**: `false`
- **Description**: Whether to notify child sessions (subtasks)

By default, the plugin only notifies parent sessions to avoid notification noise from subtasks. Set to `true` if you need to track completion status of all subtasks.

```json
{
  "notifyChildSessions": false  // Only notify parent sessions (recommended)
}
```

### sounds

Sound configuration, only effective on macOS platform.

#### sounds.idle

- **Type**: string
- **Default**: `"Glass"`
- **Description**: Sound when task completes

Plays when AI session enters idle state (task completed).

#### sounds.error

- **Type**: string
- **Default**: `"Basso"`
- **Description**: Sound when error occurs

Plays when AI session execution encounters an error.

#### sounds.permission

- **Type**: string
- **Default**: `"Submarine"`
- **Description**: Sound when permission is requested

Plays when AI needs user authorization to perform an operation.

#### sounds.question

- **Type**: string (optional)
- **Default**: Not set (uses permission sound)
- **Description**: Sound when asking questions

Plays when AI asks questions to user. If not set, uses `permission` sound.

### quietHours

Quiet hours configuration to avoid notification interruptions during specified time periods.

#### quietHours.enabled

- **Type**: boolean
- **Default**: `false`
- **Description**: Whether quiet hours is enabled

#### quietHours.start

- **Type**: string
- **Default**: `"22:00"`
- **Description**: Quiet hours start time (24-hour format, HH:MM)

#### quietHours.end

- **Type**: string
- **Default**: `"08:00"`
- **Description**: Quiet hours end time (24-hour format, HH:MM)

Supports cross-midnight periods, for example `"22:00"` to `"08:00"` means no notifications from 10 PM to 8 AM next day.

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### terminal

- **Type**: string (optional)
- **Default**: Not set (auto-detected)
- **Description**: Manually specify terminal type, override auto-detection result

If auto-detection fails or manual specification is needed, set to your terminal name.

```json
{
  "terminal": "Ghostty"  // Or "iTerm", "Kitty", "WezTerm", etc.
}
```

## macOS Available Sounds List

Following are macOS built-in notification sounds available for `sounds` configuration:

- Basso
- Blow
- Bottle
- Frog
- Funk
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## Minimal Configuration Example

If you only want to modify few settings, you can include only fields that need changes, other fields will use default values:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## Disable Plugin

To temporarily disable the plugin, delete the configuration file, and the plugin will revert to default configuration.

## Next Lesson Preview

> In the next lesson, we'll learn **[Release Notes](../changelog/release-notes/)**.
>
> You'll learn:
> - Version history and important changes
> - New features and improvements record
