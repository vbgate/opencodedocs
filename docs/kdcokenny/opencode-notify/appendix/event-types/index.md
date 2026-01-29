---
title: "Event Types Guide: Understanding OpenCode Notification Triggers | opencode-notify"
sidebarTitle: "Event Types"
subtitle: "Event Types Guide: Understanding OpenCode Notification Triggers"
description: "Learn the OpenCode event types monitored by the opencode-notify plugin, including trigger conditions and filtering rules for session.idle, session.error, permission.updated, and tool.execute.before."
tags:
  - "Appendix"
  - "Event Types"
  - "OpenCode"
prerequisite: []
order: 130
---

# Event Types Guide: Understanding OpenCode Notification Triggers

This page lists the **OpenCode event types** monitored by the `opencode-notify` plugin and their trigger conditions. The plugin monitors four events: session.idle, session.error, permission.updated, and tool.execute.before. Understanding the trigger timing and filtering rules of these events helps you better configure notification behavior.

## Event Types Overview

| Event Type | Trigger Timing | Notification Title | Default Sound | Check Parent Session | Check Terminal Focus |
|--- | --- | --- | --- | --- | ---|
| `session.idle` | AI session enters idle state | "Ready for review" | Glass | ✅ | ✅ |
| `session.error` | AI session execution error | "Something went wrong" | Basso | ✅ | ✅ |
| `permission.updated` | AI requires user authorization | "Waiting for you" | Submarine | ❌ | ✅ |
| `tool.execute.before` | AI asks a question (question tool) | "Question for you" | Submarine* | ❌ | ❌ |

> *Note: question events use the permission sound by default, can be customized via configuration

## Event Details

### session.idle

**Trigger Condition**: AI session enters idle state after completing a task

**Notification Content**:
- Title: `Ready for review`
- Message: Session title (max 50 characters)

**Processing Logic**:
1. Check if it's a parent session (when `notifyChildSessions=false`)
2. Check if within quiet hours
3. Check if terminal is focused (suppress notification when focused)
4. Send native notification

**Source Location**: `src/notify.ts:249-284`

---

### session.error

**Trigger Condition**: Error occurs during AI session execution

**Notification Content**:
- Title: `Something went wrong`
- Message: Error summary (max 100 characters)

**Processing Logic**:
1. Check if it's a parent session (when `notifyChildSessions=false`)
2. Check if within quiet hours
3. Check if terminal is focused (suppress notification when focused)
4. Send native notification

**Source Location**: `src/notify.ts:286-313`

---

### permission.updated

**Trigger Condition**: AI requires user authorization to perform an operation

**Notification Content**:
- Title: `Waiting for you`
- Message: `OpenCode needs your input`

**Processing Logic**:
1. **Does not check parent session** (permission requests always require manual handling)
2. Check if within quiet hours
3. Check if terminal is focused (suppress notification when focused)
4. Send native notification

**Source Location**: `src/notify.ts:315-334`

---

### tool.execute.before

**Trigger Condition**: Before AI executes a tool, when the tool name is `question`

**Notification Content**:
- Title: `Question for you`
- Message: `OpenCode needs your input`

**Processing Logic**:
1. **Does not check parent session**
2. **Does not check terminal focus** (supports tmux workflow)
3. Check if within quiet hours
4. Send native notification

**Special Note**: This event does not perform focus detection, allowing normal notification reception in tmux multi-window workflows.

**Source Location**: `src/notify.ts:336-351`

## Trigger Conditions and Filtering Rules

### Parent Session Check

By default, the plugin only notifies for parent sessions (root sessions), avoiding excessive notifications from child tasks.

**Check Logic**:
- Get session information via `client.session.get()`
- If the session has a `parentID`, skip notification

**Configuration Option**:
- `notifyChildSessions: false` (default) - Only notify for parent sessions
- `notifyChildSessions: true` - Notify for all sessions

**Applicable Events**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ❌ (not checked)
- `tool.execute.before` ❌ (not checked)

### Quiet Hours Check

No notifications are sent during configured quiet hours.

**Check Logic**:
- Read `quietHours.enabled`, `quietHours.start`, `quietHours.end`
- Supports crossing midnight periods (e.g., 22:00-08:00)

**Applicable Events**:
- All events ✅

### Terminal Focus Check

When the user is viewing the terminal, notifications are suppressed to avoid duplicate reminders.

**Check Logic**:
- macOS: Get frontmost application name via `osascript`
- Compare `frontmostApp` with terminal `processName`

**Applicable Events**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ✅
- `tool.execute.before` ❌ (not checked, supports tmux)

## Platform Differences

| Feature | macOS | Windows | Linux |
|--- | --- | --- | ---|
| Native notifications | ✅ | ✅ | ✅ |
| Terminal focus detection | ✅ | ❌ | ❌ |
| Click notification to focus terminal | ✅ | ❌ | ❌ |
| Custom sounds | ✅ | ❌ | ❌ |

## Configuration Impact

Notification behavior can be customized via configuration file:

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
  }
}
```

**Related Tutorials**:
- [Configuration Reference](/kdcokenny/opencode-notify/advanced/config-reference/)
- [Quiet Hours Deep Dive](/kdcokenny/opencode-notify/advanced/quiet-hours/)

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Configuration File Example](../config-file-example/)**.
>
> You'll learn:
> - Complete configuration file template
> - Detailed comments for all configuration fields
> - Explanation of configuration file default values

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Event Type | File Path | Lines | Handler Function |
|--- | --- | --- | ---|
| session.idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 | `handleSessionIdle` |
| session.error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 | `handleSessionError` |
| permission.updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 | `handlePermissionUpdated` |
| tool.execute.before | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 | `handleQuestionAsked` |
| Event listener setup | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L367-L402) | 367-402 | `NotifyPlugin` |

**Key Constants**:
- `DEFAULT_CONFIG` (L56-68): Default configuration, including sound and quiet hours settings
- `TERMINAL_PROCESS_NAMES` (L71-84): Terminal name to macOS process name mapping

**Key Functions**:
- `sendNotification()` (L227-243): Send native notification, handle macOS focus functionality
- `isParentSession()` (L205-214): Check if it's a parent session
- `isQuietHours()` (L181-199): Check if within quiet hours
- `isTerminalFocused()` (L166-175): Check if terminal is focused (macOS only)

</details>
