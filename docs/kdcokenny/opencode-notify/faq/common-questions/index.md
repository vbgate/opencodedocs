---
title: "opencode-notify FAQ: Performance Impact, Privacy Security, and Platform Compatibility Explained"
sidebarTitle: "Common Questions"
subtitle: "Common Questions: Performance, Privacy, and Compatibility"
description: "Learn about opencode-notify's impact on AI context and system resource usage mechanisms, confirm the plugin runs completely locally without uploading data, master smart notification filtering strategies and quiet hours configuration, understand compatibility with other OpenCode plugins and platform differences between macOS/Windows/Linux, and get comprehensive answers to users' most common concerns about notification frequency, privacy security, resource usage, terminal detection failure handling, configuration file location, and more."
tags:
  - "FAQ"
  - "Performance"
  - "Privacy"
prerequisite:
  - "/kdcokenny/opencode-notify/start/quick-start/"
order: 120
---

# Common Questions: Performance, Privacy, and Compatibility

## What You'll Learn

- Understand the plugin's performance impact and resource usage
- Clarify privacy and security guarantees
- Master notification strategies and configuration techniques
- Understand platform differences and compatibility

---

## Performance Related

### Will it increase AI context?

**No**. The plugin uses an event-driven model and doesn't add any tools or prompts to AI conversations.

From the source code implementation:

| Component | Type | Implementation | Impact on Context |
|--- | --- | --- | ---|
| Event Listener | Event | Listens to `session.idle`, `session.error`, `permission.updated` events | ✅ No impact |
| Tool Hook | Hook | Monitors `question` tool via `tool.execute.before` | ✅ No impact |
| Conversation Content | - | Doesn't read, modify, or inject any conversation content | ✅ No impact |

In the source code, the plugin is only responsible for **listening and notifying**. The AI conversation context is completely unaffected.

### How much system resources will it occupy?

**Very low**. The plugin adopts a "startup cache + event trigger" design:

1. **Configuration loading**: The plugin reads the configuration file (`~/.config/opencode/kdco-notify.json`) once at startup, and doesn't read it again afterward
2. **Terminal detection**: Detects terminal type at startup and caches information (name, Bundle ID, process name), subsequent events directly use the cache
3. **Event-driven**: The plugin only executes notification logic when AI triggers specific events

Resource usage characteristics:

| Resource Type | Usage | Description |
|--- | --- | ---|
| CPU | Almost 0 | Only runs briefly when events are triggered |
| Memory | < 5 MB | Enters standby state after startup |
| Disk | < 100 KB | Configuration file and code itself |
| Network | 0 | Doesn't make any network requests |

---

## Privacy and Security

### Will data be uploaded to servers?

**No**. The plugin runs completely locally without any data upload.

**Privacy Guarantee**:

| Data Type | Processing Method | Upload? |
|--- | --- | ---|
| AI conversation content | Doesn't read, doesn't store | ❌ No |
| Session information (title) | Only used for notification text | ❌ No |
| Error information | Only used for notification text (max 100 characters) | ❌ No |
| Terminal information | Locally detected and cached | ❌ No |
| Configuration information | Local file (`~/.config/opencode/`) | ❌ No |
| Notification content | Sent via system native notification API | ❌ No |

**Technical Implementation**:

The plugin uses system native notifications:
- macOS: Calls `NSUserNotificationCenter` via `node-notifier`
- Windows: Calls `SnoreToast` via `node-notifier`
- Linux: Calls `notify-send` via `node-notifier`

All notifications are triggered locally and don't go through OpenCode's cloud service.

### Will the plugin steal my session content?

**No**. The plugin only reads **necessary metadata**:

| Data Read | Purpose | Limit |
|--- | --- | ---|
| Session title (title) | Notification text | Only takes first 50 characters |
| Error information (error) | Notification text | Only takes first 100 characters |
| Terminal information | Focus detection and click-to-focus | Doesn't read terminal content |
| Configuration file | User custom settings | Local file |

There is no logic in the source code that reads conversation messages (messages) or user input (user input).

---

## Notification Strategy

### Will I get notification spam?

**No**. The plugin has built-in multiple smart filtering mechanisms to avoid notification spam.

**Default Notification Strategy**:

| Type | Event/Tool | Notify? | Reason |
|--- | --- | --- | ---|
| Event | Parent session completion (session.idle) | ✅ Yes | Main task completed |
| Event | Child session completion (session.idle) | ❌ No | Parent session will notify uniformly |
| Event | Session error (session.error) | ✅ Yes | Needs immediate attention |
| Event | Permission request (permission.updated) | ✅ Yes | AI blocked waiting |
| Tool Hook | Question inquiry (tool.execute.before - question) | ✅ Yes | AI needs input |

**Smart Filtering Mechanisms**:

1. **Only notify parent sessions**
   - Source code: `notify.ts:256-259`
   - Default config: `notifyChildSessions: false`
   - Avoids notifications for every subtask when AI breaks down tasks

2. **Suppress when terminal is focused** (macOS)
   - Source code: `notify.ts:265`
   - Logic: When terminal is the foreground window, doesn't send notification (built-in behavior, no configuration needed)
   - Avoids duplicate reminders when "watching the terminal but still getting notifications"
   - **Note**: This feature is only available on macOS (requires terminal information for detection)

3. **Quiet hours**
   - Source code: `notify.ts:262`, `notify.ts:181-199`
   - Default config: `quietHours: { enabled: false, start: "22:00", end: "08:00" }`
   - Configurable, avoids disturbing at night

4. **Permission requests always notify**
   - Source code: `notify.ts:319`
   - Reason: AI is blocked waiting for user authorization, must notify in time
   - Doesn't perform parent session check

### Can I only receive specific types of notifications?

**Yes**. Although the plugin doesn't have separate notification toggles, you can achieve this through quiet hours and terminal focus detection:

- **Only receive urgent notifications**: Terminal focus detection is a built-in behavior, you won't receive notifications when you're at the terminal (macOS)
- **Only receive night notifications**: Enable quiet hours (e.g., 09:00-18:00), use in reverse

If you need more granular control, consider submitting a Feature Request.

---

## Plugin Compatibility

### Will it conflict with other OpenCode plugins?

**No**. The plugin integrates via the standard OpenCode Plugin API and doesn't modify AI behavior or interfere with other plugins.

**Integration Method**:

| Component | Integration Method | Conflict Risk |
|--- | --- | ---|
| Event Listener | OpenCode SDK's `event` hook | ❌ No conflict |
| Tool Hook | OpenCode Plugin API's `tool.execute.before` hook | ❌ No conflict (only monitors `question` tool) |
| Session Query | OpenCode SDK's `client.session.get()` | ❌ No conflict (read-only, doesn't write) |
| Notification Sending | `node-notifier` independent process | ❌ No conflict |

**Plugins that may coexist**:

- OpenCode official plugins (like `opencode-coder`)
- Third-party plugins (like `opencode-db`, `opencode-browser`)
- Custom plugins

All plugins run in parallel via the standard Plugin API without interfering with each other.

### Which platforms are supported? Are there functional differences?

**Supports macOS, Windows, and Linux, but there are functional differences**.

| Feature | macOS | Windows | Linux |
|--- | --- | --- | ---|
| Native notifications | ✅ Supported | ✅ Supported | ✅ Supported |
| Custom sounds | ✅ Supported | ❌ Not supported | ❌ Not supported |
| Terminal focus detection | ✅ Supported | ❌ Not supported | ❌ Not supported |
| Click notification to focus | ✅ Supported | ❌ Not supported | ❌ Not supported |
| Terminal auto-detection | ✅ Supported | ✅ Supported | ✅ Supported |
| Quiet hours | ✅ Supported | ✅ Supported | ✅ Supported |

**Platform Differences Reasons**:

| Platform | Difference Description |
|--- | ---|
| macOS | System provides rich notification APIs and app management interfaces (like `osascript`), supports sounds, focus detection, click-to-focus |
| Windows | System notification API has limited features, doesn't support application-level foreground detection and sound customization |
| Linux | Depends on `notify-send` standard, features similar to Windows |

**Cross-platform Core Features**:

Regardless of which platform you use, the following core features are available:
- Task completion notifications (session.idle)
- Error notifications (session.error)
- Permission request notifications (permission.updated)
- Question inquiry notifications (tool.execute.before)
- Quiet hours configuration

---

## Terminal and System

### Which terminals are supported? How is detection done?

**Supports 37+ terminal emulators**.

The plugin uses the [`detect-terminal`](https://github.com/jonschlinkert/detect-terminal) library to automatically identify terminals. Supported terminals include:

**macOS Terminals**:
- Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- macOS Terminal, Hyper, Warp
- VS Code integrated terminal (Code / Code - Insiders)

**Windows Terminals**:
- Windows Terminal, Git Bash, ConEmu, Cmder
- PowerShell, CMD (via default detection)

**Linux Terminals**:
- gnome-terminal, konsole, xterm, lxterminal
- terminator, tilix, alacritty, kitty

**Detection Mechanism**:

1. **Auto-detection**: Plugin calls `detectTerminal()` library at startup
2. **Manual override**: User can specify `terminal` field in configuration file to override auto-detection
3. **macOS mapping**: Terminal name maps to process name (e.g., `ghostty` → `Ghostty`), used for focus detection

**Configuration Example**:

```json
{
  "terminal": "ghostty"
}
```

### What happens if terminal detection fails?

**Plugin still works normally, just focus detection function becomes invalid**.

**Failure Handling Logic**:

| Failure Scenario | Behavior | Impact |
|--- | --- | ---|
| `detectTerminal()` returns `null` | Terminal info is `{ name: null, bundleId: null, processName: null }` | No focus detection, but notifications send normally |
| macOS `osascript` execution fails | Bundle ID retrieval fails | macOS click-to-focus function invalid, but notifications normal |
| `terminal` value in config file invalid | Uses auto-detection result | If auto-detection also fails, no focus detection |

Related logic in source code (`notify.ts:149-150`):

```typescript
if (!terminalName) {
  return { name: null, bundleId: null, processName: null }
}
```

**Solution**:

If terminal detection fails, you can manually specify terminal type:

```json
{
  "terminal": "iterm2"
}
```

---

## Configuration and Troubleshooting

### Where is the configuration file? How to modify?

**Configuration file path**: `~/.config/opencode/kdco-notify.json`

**Complete Configuration Example**:

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
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

**Configuration Modification Steps**:

1. Open terminal and edit configuration file:
   ```bash
   # macOS/Linux
   nano ~/.config/opencode/kdco-notify.json
   
   # Windows
   notepad %USERPROFILE%\.config\opencode\kdco-notify.json
   ```

2. Modify configuration items (refer to the example above)

3. Save file, configuration takes effect automatically (no restart needed)

### What happens if the configuration file is corrupted?

**Plugin will use default configuration and silently handle the error**.

**Error Handling Logic** (`notify.ts:110-113`):

```typescript
} catch {
  // Config doesn't exist or is invalid, use defaults
  return DEFAULT_CONFIG
}
```

**Solution**:

If the configuration file is corrupted (JSON format error), the plugin will fall back to default configuration. Fix steps:

1. Delete the corrupted configuration file:
   ```bash
   rm ~/.config/opencode/kdco-notify.json
   ```

2. Plugin will continue working with default configuration

3. If you need custom configuration, recreate the configuration file

---

## Lesson Summary

This lesson answered the common questions users care about most:

- **Performance impact**: Plugin doesn't increase AI context, resource usage is very low (CPU almost 0, memory < 5 MB)
- **Privacy and security**: Runs completely locally, doesn't upload any data, only reads necessary metadata
- **Notification strategy**: Smart filtering mechanisms (only notify parent sessions, suppress when macOS terminal is focused, quiet hours)
- **Plugin compatibility**: Doesn't conflict with other plugins, supports three major platforms but with functional differences
- **Terminal support**: Supports 37+ terminals, works normally even if auto-detection fails

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Event Types Explained](../../appendix/event-types/)**.
>
> You'll learn:
> - The four OpenCode event types monitored by the plugin
> - Trigger timing and notification content for each event
> - Event filtering rules (parent session check, quiet hours, terminal focus)
> - Event handling differences across platforms

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Lines |
|--- | --- | ---|
| Plugin startup and configuration loading | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L357-L364) | 357-364 |
| Event listening logic | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L372-L400) | 372-400 |
| Parent session check | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| Quiet hours check | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| Terminal focus detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| Configuration file loading | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| Terminal information detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Default configuration definition | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |

**Key Constants**:
- `DEFAULT_CONFIG`: Default configuration (only notify parent sessions, Glass/Basso/Submarine sounds, quiet hours disabled by default)

**Key Functions**:
- `loadConfig()`: Loads user configuration and merges with defaults
- `detectTerminalInfo()`: Detects terminal information and caches
- `isQuietHours()`: Checks if current time is within quiet hours
- `isTerminalFocused()`: Checks if terminal is foreground window (macOS)
- `isParentSession()`: Checks if session is a parent session

</details>
