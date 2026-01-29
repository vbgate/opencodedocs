---
title: "Advanced Usage: Configuration and Optimization"
sidebarTitle: "Advanced Usage"
subtitle: "Advanced Usage: Configuration and Optimization"
description: "Master opencode-notify advanced features: configuration reference, quiet hours, terminal detection, and best practices. Optimize notification experience based on your needs."
tags:
  - "Advanced"
  - "Configuration"
  - "Optimization"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 69
---

# Advanced Usage: Configuration and Optimization

This chapter helps you master opencode-notify's advanced features, understand configuration options in depth, optimize notification experience, and customize notification behavior based on personal needs.

## Learning Path

Follow this sequence to learn the content in this chapter:

### 1. [Configuration Reference](./config-reference/)

Get a comprehensive understanding of all available configuration options and their purposes.

- Master configuration file structure and syntax
- Learn notification sound customization methods
- Understand sub-session notification toggle use cases
- Learn terminal type override configuration methods

### 2. [Quiet Hours Explained](./quiet-hours/)

Learn how to set up quiet hours to avoid interruptions during specific times.

- Configure quiet hours start and end times
- Handle overnight quiet hours (e.g., 22:00 - 08:00)
- Temporarily disable quiet hours when needed
- Understand priority of quiet hours vs other filtering rules

### 3. [Terminal Detection Principles](./terminal-detection/)

Deep dive into the working mechanism of automatic terminal detection.

- Learn how the plugin identifies 37+ terminal emulators
- Understand macOS platform focus detection implementation
- Master manual terminal type specification methods
- Understand default behavior when detection fails

### 4. [Advanced Usage](./advanced-usage/)

Master configuration techniques and best practices.

- Configuration strategies to avoid notification spam
- Adjust notification behavior based on workflow
- Configuration recommendations for multi-window and multi-terminal environments
- Performance optimization and troubleshooting techniques

## Prerequisites

Before starting this chapter, it's recommended to complete the following basics:

- ✅ **Quick Start**: Complete plugin installation and basic configuration
- ✅ **How It Works**: Understand the plugin's core functionality and event listening mechanisms
- ✅ **Platform Features** (Optional): Learn about platform-specific features

::: tip Learning Tips
If you just want to customize notification sounds or set up quiet hours, you can jump directly to the corresponding sub-pages. If you encounter problems, you can always refer to the configuration reference chapter.
:::

## Next Steps

After completing this chapter, you can continue exploring:

- **[Troubleshooting](../../faq/troubleshooting/)**: Solve common problems and tricky issues
- **[Common Questions](../../faq/common-questions/)**: Learn about hot topics users care about
- **[Event Types](../../appendix/event-types/)**: Deep dive into all event types the plugin listens to
- **[Configuration File Examples](../../appendix/config-file-example/)**: View complete configuration examples with comments

---

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature | File Path | Lines |
|--- | --- | ---|
| Configuration Interface Definition | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48   |
| Default Configuration | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68   |
| Configuration Loading | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114  |
| Quiet Hours Check | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| Terminal Detection | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| Terminal Process Name Mapping | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84   |

**Key Interfaces**:
- `NotifyConfig`: Configuration interface containing all configurable items
- `quietHours`: Quiet hours configuration (enabled/start/end)
- `sounds`: Sound configuration (idle/error/permission)
- `terminal`: Terminal type override (optional)

**Key Constants**:
- `DEFAULT_CONFIG`: Default values for all configuration items
- `TERMINAL_PROCESS_NAMES`: Mapping table of terminal names to macOS process names

</details>
