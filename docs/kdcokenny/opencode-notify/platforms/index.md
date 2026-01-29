---
title: "Platform and Integration: macOS, Windows, Linux Terminal Features"
sidebarTitle: "Platform and Integration"
subtitle: "Platform and Integration"
description: "Learn opencode-notify's feature differences across macOS, Windows, and Linux. Master terminal support (37+ emulators), focus detection, click-to-focus, and custom sounds. Includes platform feature comparison, terminal detection mechanisms, and configuration guides."
tags:
  - "Platform Features"
  - "Terminal Support"
  - "System Compatibility"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
---

# Platform and Integration

This chapter helps you understand opencode-notify's feature differences across operating systems, master platform-specific configurations, and optimize your terminal for best performance.

## Learning Path

### 1. [macOS Platform Features](../macos/)

Learn about advanced features on macOS, including smart focus detection, click-to-focus notifications, and custom sounds.

- Focus Detection: Automatically determine if the terminal is the active window
- Click-to-Focus: Automatically switch to terminal when clicking notification
- Custom Sounds: Configure exclusive sounds for different events
- 37+ Terminal Support: Including Ghostty, iTerm2, VS Code integrated terminal, etc.

### 2. [Windows Platform Features](../windows/)

Master notification basics and configuration methods on Windows platform.

- Native Notifications: Use Windows 10/11 notification center
- Notification Permissions: Ensure OpenCode has permission to send notifications
- Basic Configuration: Configuration file locations on Windows
- Limitations: Focus detection not currently supported on Windows

### 3. [Linux Platform Features](../linux/)

Understand notification mechanisms and dependency installation on Linux platform.

- libnotify Integration: Send notifications via notify-send
- Desktop Environment Support: GNOME, KDE Plasma, XFCE, and other mainstream environments
- Dependency Installation: Installation commands for different distributions
- Limitations: Focus detection not currently supported on Linux

### 4. [Supported Terminals](../terminals/)

View all 37+ supported terminal emulators and learn about automatic detection mechanisms.

- Terminal Detection: How to automatically identify your terminal type
- Terminal List: Complete list of supported terminals
- Manual Configuration: How to manually specify terminal when auto-detection fails
- Special Terminals: Handling VS Code integrated terminal, remote SSH sessions, etc.

## Prerequisites

::: warning Before studying this chapter, ensure you have completed
- ✅ **[Quick Start](../../start/quick-start/)**: Completed opencode-notify installation
- ✅ **[How It Works](../../start/how-it-works/)**: Understood the four notification types and intelligent filtering mechanism
:::

## Platform Selection Guide

Choose the corresponding chapter based on your operating system:

| Operating System | Recommended Learning Order | Core Features |
|--- | --- | ---|
| **macOS** | 1. macOS Platform Features → 4. Supported Terminals | Focus detection, click-to-focus, custom sounds |
| **Windows** | 2. Windows Platform Features → 4. Supported Terminals | Native notifications, basic configuration |
| **Linux** | 3. Linux Platform Features → 4. Supported Terminals | libnotify integration, dependency installation |

::: tip General Recommendation
Regardless of your platform, Lesson 4 "Supported Terminals" is worth studying. It helps you understand terminal detection mechanisms and solve configuration issues.
:::

## Feature Comparison Table

| Feature | macOS | Windows | Linux |
|--- | --- | --- | ---|
| Native Notifications | ✅ | ✅ | ✅ |
| Terminal Focus Detection | ✅ | ❌ | ❌ |
| Click-to-Focus Notifications | ✅ | ❌ | ❌ |
| Custom Sounds | ✅ | ✅ | ✅ (partial) |
| Quiet Hours | ✅ | ✅ | ✅ |
| Parent Session Check | ✅ | ✅ | ✅ |
| 37+ Terminal Support | ✅ | ✅ | ✅ |
| Automatic Terminal Detection | ✅ | ✅ | ✅ |

## Next Steps

After completing this chapter, you will understand feature differences and configuration methods across platforms.

Recommended to continue learning:

### [Advanced Configuration](../../advanced/config-reference/)

Deep dive into all configuration file options and master advanced configuration techniques.

- Complete Configuration Reference: Detailed explanation of all configuration items
- Quiet Hours Deep Dive: How to set up and how it works
- Terminal Detection Principles: Internal mechanisms of automatic detection
- Advanced Usage: Configuration tips and best practices

### [Troubleshooting](../../faq/troubleshooting/)

When you encounter issues, check solutions to common problems.

- Notifications Not Showing: Permissions and system settings issues
- Focus Detection Failure: Terminal configuration and detection mechanisms
- Configuration Errors: Configuration file format and field descriptions
- Sound Issues: Sound configuration and system compatibility

::: info Learning Path Recommendation
If you're just getting started, it's recommended to learn in the order: **Platform Chapters → Advanced Configuration → Troubleshooting**. If you encounter a specific issue, you can jump directly to the troubleshooting chapter.
:::
