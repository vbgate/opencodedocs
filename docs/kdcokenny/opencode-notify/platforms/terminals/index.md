---
title: "Supported Terminals: Complete List of 37+ Terminal Emulators and Auto-Detection | opencode-notify Tutorial"
sidebarTitle: "Supported Terminals"
subtitle: "Supported Terminals: Complete List of 37+ Terminal Emulators"
description: "Learn about 37+ terminal emulators supported by opencode-notify, including macOS, Windows, and Linux platforms. This tutorial explains terminal auto-detection principles, manual configuration methods, and troubleshooting for failed detection to optimize your notification experience, enable smart filtering, avoid notification noise, reduce window switching, maintain focus, and boost productivity."
tags:
  - "Terminals"
  - "Terminal Detection"
  - "Platform Support"
prerequisite:
  - "start-quick-start"
order: 60
---

# Supported Terminals: Complete List of 37+ Terminal Emulators

## What You'll Learn

- Understand all terminal emulators supported by opencode-notify
- Check if your terminal is in the supported list
- Understand how terminal auto-detection works
- Learn how to manually specify terminal type

## Your Current Problem

You've installed opencode-notify, but notifications aren't working properly. Maybe the terminal isn't detected, or focus detection is failing. You're using Alacritty / Windows Terminal / tmux and aren't sure if they're supported. Failed terminal detection causes smart filtering to malfunction, affecting your experience.

## When to Use This

**Check the supported terminal list in these scenarios**:
- You want to know if your terminal is supported
- Auto-detection failed and you need manual configuration
- You're switching between multiple terminals and want to check compatibility
- You want to understand the technical principles of terminal detection

## Core Concept

opencode-notify uses the `detect-terminal` library to automatically identify your terminal emulator, **supporting 37+ terminals**. After successful detection, the plugin can:
- **Enable focus detection** (macOS only): Suppress notifications when terminal is in foreground
- **Support click-to-focus** (macOS only): Click notifications to switch to terminal window

::: info Why is terminal detection important?

Terminal detection is the foundation of smart filtering:
- **Focus detection**: Avoid notifications popping up while you're viewing the terminal
- **Click-to-focus**: macOS users can click notifications to return to the terminal
- **Performance optimization**: Different terminals may need special handling

If detection fails, notifications still work but smart filtering will be disabled.
:::

## Supported Terminal List

### macOS Terminals

| Terminal Name | Process Name | Features |
|--- | --- | ---|
| **Ghostty** | Ghostty | Focus detection + Click-to-focus |
| **iTerm2** | iTerm2 | Focus detection + Click-to-focus |
| **Kitty** | kitty | Focus detection + Click-to-focus |
| **WezTerm** | WezTerm | Focus detection + Click-to-focus |
| **Alacritty** | Alacritty | Focus detection + Click-to-focus |
| **Terminal.app** | Terminal | Focus detection + Click-to-focus |
| **Hyper** | Hyper | Focus detection + Click-to-focus |
| **Warp** | Warp | Focus detection + Click-to-focus |
| **VS Code Integrated Terminal** | Code / Code - Insiders | Focus detection + Click-to-focus |

::: tip macOS Terminal Features
macOS terminals support full functionality:
- Native notifications (Notification Center)
- Focus detection (via AppleScript)
- Click notifications to auto-focus terminal
- Custom system sound effects

All terminals send notifications through macOS Notification Center.
:::

### Windows Terminals

| Terminal Name | Features |
|--- | ---|
| **Windows Terminal** | Native notifications (Toast) |
| **Git Bash** | Native notifications (Toast) |
| **ConEmu** | Native notifications (Toast) |
| **Cmder** | Native notifications (Toast) |
| **PowerShell** | Native notifications (Toast) |
| **VS Code Integrated Terminal** | Native notifications (Toast) |
| **Other Windows Terminals** | Native notifications (Toast) |

::: details Windows Terminal Limitations
Windows platform has basic functionality:
- ✅ Native notifications (Windows Toast)
- ✅ Terminal detection
- ❌ Focus detection (system limitation)
- ❌ Click-to-focus (system limitation)

All Windows terminals send notifications through Windows Toast with system default sound.
:::

### Linux Terminals

| Terminal Name | Features |
|--- | ---|
|--- | ---|
| **konsole** | Native notifications (notify-send) |
| **xterm** | Native notifications (notify-send) |
| **lxterminal** | Native notifications (notify-send) |
|--- | ---|
|--- | ---|
| **alacritty** | Native notifications (notify-send) |
| **kitty** | Native notifications (notify-send) |
| **wezterm** | Native notifications (notify-send) |
| **VS Code Integrated Terminal** | Native notifications (notify-send) |
| **Other Linux Terminals** | Native notifications (notify-send) |

::: details Linux Terminal Limitations
Linux platform has basic functionality:
- ✅ Native notifications (notify-send)
- ✅ Terminal detection
- ❌ Focus detection (system limitation)
- ❌ Click-to-focus (system limitation)

All Linux terminals send notifications through notify-send with desktop environment default sound.
:::

### Other Supported Terminals

The `detect-terminal` library also supports the following terminals (may not be complete):

**Windows / WSL**:
- WSL Terminal
- Windows Command Prompt (cmd)
- PowerShell (pwsh)
- PowerShell Core (pwsh-preview)
- Cygwin Mintty
- MSYS2 MinTTY

**macOS / Linux**:
- tmux (detected via environment variable)
- screen
- rxvt-unicode (urxvt)
- rxvt
- Eterm
- eterm
- aterm
- wterm
- sakura
- roxterm
- xfce4-terminal
- pantheon-terminal
- lxterminal
- mate-terminal
- terminator
- tilix
- guake
- yakuake
- qterminal
- terminology
- deepin-terminal
- gnome-terminal
- konsole
- xterm
- uxterm
- eterm

::: tip Terminal Count Statistics
opencode-notify supports **37+ terminal emulators** through the `detect-terminal` library.
If your terminal isn't listed, check the [detect-terminal complete list](https://github.com/jonschlinkert/detect-terminal#supported-terminals).
:::

## Terminal Detection Principles

### Auto-Detection Workflow

The plugin automatically detects terminal type on startup:

```
1. Call detect-terminal() library
    ↓
2. Scan system processes, identify current terminal
    ↓
3. Return terminal name (e.g., "ghostty", "kitty")
    ↓
4. Lookup mapping table, get macOS process name
    ↓
5. macOS: Dynamically get Bundle ID
    ↓
6. Save terminal info for future notifications
```

### macOS Terminal Mapping Table

Source code predefines common terminal process name mappings:

```typescript
// src/notify.ts:71-84
const TERMINAL_PROCESS_NAMES: Record<string, string> = {
    ghostty: "Ghostty",
    kitty: "kitty",
    iterm: "iTerm2",
    iterm2: "iTerm2",
    wezterm: "WezTerm",
    alacritty: "Alacritty",
    terminal: "Terminal",
    apple_terminal: "Terminal",
    hyper: "Hyper",
    warp: "Warp",
    vscode: "Code",
    "vscode-insiders": "Code - Insiders",
}
```

::: details Detection Source Code
Complete terminal detection logic:

```typescript
// src/notify.ts:145-164
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
    // Use config override if provided
    const terminalName = config.terminal || detectTerminal() || null

    if (!terminalName) {
        return { name: null, bundleId: null, processName: null }
    }

    // Get process name for focus detection
    const processName = TERMINAL_PROCESS_NAMES[terminalName.toLowerCase()] || terminalName

    // Dynamically get bundle ID from macOS (no hardcoding!)
    const bundleId = await getBundleId(processName)

    return {
        name: terminalName,
        bundleId,
        processName,
    }
}
```

:::

### macOS Special Handling

macOS platform has additional detection steps:

1. **Get Bundle ID**: Query application Bundle ID dynamically via `osascript` (e.g., `com.mitchellh.ghostty`)
2. **Focus detection**: Query foreground application process name via `osascript`
3. **Click-to-focus**: Set `activate` parameter in notification, switch to terminal via Bundle ID when clicked

::: info Benefits of Dynamic Bundle ID
Source code doesn't hardcode Bundle IDs, but queries them dynamically via `osascript`. This means:
- ✅ Supports terminal updates (as long as Bundle ID remains the same)
- ✅ Reduces maintenance cost (no need to manually update lists)
- ✅ Better compatibility (theoretically supports any macOS terminal)
:::

### tmux Terminal Support

tmux is a terminal multiplexer. The plugin detects tmux sessions via environment variables:

```bash
# In a tmux session
echo $TMUX
# Output: /tmp/tmux-1000/default,1234,0

# Not in tmux
echo $TMUX
# Output: (empty)
```

::: tip tmux Workflow Support
tmux users can use notifications normally:
- Automatically detects tmux sessions
- Notifications sent to current terminal window
- **No focus detection** (supports tmux multi-window workflow)
:::

## Manually Specifying Terminal

If auto-detection fails, you can manually specify the terminal type in the configuration file.

### When Manual Specification Is Needed

Manual configuration is needed in these situations:
- Your terminal isn't in the `detect-terminal` supported list
- You're nesting terminals (e.g., tmux + Alacritty)
- Auto-detection result is incorrect (misidentified as another terminal)

### Configuration Method

**Step 1: Open Configuration File**

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/kdco-notify.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

:::

**Step 2: Add terminal Configuration**

```json
{
  "terminal": "ghostty"
}
```

**Step 3: Save and Restart OpenCode**

### Available Terminal Names

Terminal names must be recognized by the `detect-terminal` library. Common names:

| Terminal | Config Value |
|--- | ---|
| Ghostty | `"ghostty"` |
| iTerm2 | `"iterm2"` or `"iterm"` |
| Kitty | `"kitty"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` or `"apple_terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code | `"vscode"` |
| VS Code Insiders | `"vscode-insiders"` |
| Windows Terminal | `"windows-terminal"` or `"Windows Terminal"` |

::: details Complete Available Names
Check [detect-terminal source code](https://github.com/jonschlinkert/detect-terminal) for the complete list.
:::

### macOS Terminal Full Features Example

```json
{
  "terminal": "ghostty",
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

### Windows/Linux Terminal Example

```json
{
  "terminal": "Windows Terminal",
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

::: warning Windows/Linux Configuration Limitations
Windows and Linux don't support the `sounds` configuration option (use system default sounds), and don't support focus detection (system limitation).
:::

## Checkpoint ✅

After completing this lesson, confirm:

- [ ] You know if your terminal is supported
- [ ] You understand how terminal auto-detection works
- [ ] You know how to manually specify terminal type
- [ ] You understand functional differences across platforms

## Common Pitfalls

### Common Issue 1: Terminal Detection Failed

**Symptoms**: Notifications not showing, or focus detection failing.

**Cause**: `detect-terminal` cannot recognize your terminal.

**Solutions**:

1. Confirm your terminal name is correct (case-sensitive)
2. Manually specify in configuration file:

```json
{
  "terminal": "your_terminal_name"
}
```

3. Check [detect-terminal supported list](https://github.com/jonschlinkert/detect-terminal#supported-terminals)

### Common Issue 2: macOS Click-to-Focus Not Working

**Symptoms**: Clicking notifications doesn't switch to terminal window.

**Cause**: Bundle ID retrieval failed, or terminal not in mapping table.

**Solutions**:

1. Check if terminal is in `TERMINAL_PROCESS_NAMES` mapping table
2. If not, manually specify terminal name

**Verification Method**:

```typescript
// Temporary debugging (add console.log in notify.ts)
console.log("Terminal info:", terminalInfo)
// Should see { name: "ghostty", bundleId: "com.mitchellh.ghostty", processName: "Ghostty" }
```

### Common Issue 3: tmux Focus Detection Not Working

**Symptoms**: In tmux session, notifications still pop up when terminal is in foreground.

**Cause**: tmux has its own session management, focus detection may not be accurate.

**Explanation**: This is normal behavior. In tmux workflow, focus detection is limited, but notifications still work normally.

### Common Issue 4: VS Code Integrated Terminal Detected as Code

**Symptoms**: Both `"vscode"` and `"vscode-insiders"` are valid in config, but you don't know which to use.

**Explanation**:
- Using **VS Code Stable** → Configure `"vscode"`
- Using **VS Code Insiders** → Configure `"vscode-insiders"`

Auto-detection automatically selects the correct process name based on installed version.

### Common Issue 5: Windows Terminal Detection Failed

**Symptoms**: Windows Terminal uses "windows-terminal" name, but detection fails.

**Cause**: Windows Terminal process name may be `WindowsTerminal.exe` or `Windows Terminal`.

**Solution**: Try different configuration values:

```json
{
  "terminal": "windows-terminal"  // or "Windows Terminal"
}
```

## Lesson Summary

In this lesson, we learned:

- ✅ opencode-notify supports 37+ terminal emulators
- ✅ macOS terminals support full features (focus detection + click-to-focus)
- ✅ Windows/Linux terminals support basic notifications
- ✅ Terminal auto-detection principles and source code implementation
- ✅ How to manually specify terminal type
- ✅ Solutions for common terminal recognition issues

**Key Points**:
1. Terminal detection is the foundation of smart filtering, supporting 37+ terminals
2. macOS terminals have the richest features, Windows/Linux have relatively basic functionality
3. When auto-detection fails, you can manually configure terminal name
4. tmux users can use notifications normally, but focus detection is limited
5. macOS Bundle ID is dynamically retrieved for better compatibility

## Next Lesson Preview

> In the next lesson, we'll learn **[Configuration Reference](../../advanced/config-reference/)**.
>
> You'll learn:
> - Complete configuration options and default values
> - Sound customization (macOS)
> - Quiet hours configuration
> - Child session notification toggle
> - Terminal type override
> - Advanced configuration tips

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Function | File Path | Lines |
|--- | --- | ---|
| Terminal Mapping Table | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| Terminal Detection Function | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS Bundle ID Retrieval | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| macOS Foreground App Detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| macOS Focus Detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |

**Key Constants**:
- `TERMINAL_PROCESS_NAMES`: Mapping table from terminal names to macOS process names

**Key Functions**:
- `detectTerminalInfo()`: Detects terminal information (name, Bundle ID, process name)
- `detectTerminal()`: Calls detect-terminal library to identify terminal
- `getBundleId()`: Dynamically retrieves macOS app Bundle ID via osascript
- `getFrontmostApp()`: Queries current foreground application name
- `isTerminalFocused()`: Detects if terminal is foreground window (macOS only)

**External Dependencies**:
- [detect-terminal](https://github.com/jonschlinkert/detect-terminal): Terminal detection library, supporting 37+ terminals

</details>
