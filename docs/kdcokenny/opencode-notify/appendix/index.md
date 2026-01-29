---
title: "opencode-notify Appendix: Event Types and Config File Reference | Tutorial"
sidebarTitle: "Appendix"
subtitle: "Appendix: Event Types and Config Reference"
description: "Browse opencode-notify plugin event type descriptions and configuration file examples. This tutorial lists four OpenCode event types with trigger conditions, explains filtering rules and platform differences for each event, provides complete config file templates, detailed comments for all config fields, default value settings, minimal config examples, plugin disable methods, and complete macOS sound lists."
---

# Appendix: Event Types and Configuration Reference

This chapter provides reference documentation and configuration examples to help you deeply understand opencode-notify's event types and configuration options. These contents are suitable for reference material and do not need to be learned in order.

## Learning Path

### 1. [Event Types Description](./event-types/)

Learn about the OpenCode event types listened to by the plugin and their trigger conditions.

- Four event types (session.idle, session.error, permission.updated, tool.execute.before)
- Trigger timing and processing logic for each event
- Filtering rules for parent session check, quiet hours check, and terminal focus check
- Functional differences across platforms

### 2. [Configuration File Example](./config-file-example/)

View complete configuration file examples and detailed comments for all fields.

- Complete configuration file template
- Field descriptions for notifyChildSessions, sounds, quietHours, terminal, etc.
- Complete list of macOS available sounds
- Minimal configuration example
- Methods to disable the plugin

## Prerequisites

::: tip Learning Recommendation

This chapter is reference documentation that can be consulted when needed. We recommend referencing this chapter after completing the following basic tutorials:

- [Quick Start](../../start/quick-start/) - Complete installation and initial configuration
- [How It Works](../../start/how-it-works/) - Understand the plugin's core mechanism

:::

## Next Steps

After completing the appendix content, you can:

- View [Changelog](../changelog/release-notes/) to learn about version history and new features
- Return to [Configuration Reference](../../advanced/config-reference/) to deeply learn advanced configuration options
- Browse [FAQ](../../faq/common-questions/) to find answers
