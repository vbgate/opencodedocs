---
title: "Quick Start: Persistent Memory for Agent | opencode-supermemory"
order: 1
sidebarTitle: "Quick Start"
subtitle: "Quick Start: Persistent Memory for Agent"
description: "Learn how to install and configure the opencode-supermemory plugin. Enable persistent memory capabilities for your OpenCode Agent, remember project architecture, and improve coding efficiency."
---

# Quick Start

This chapter helps you install and configure the opencode-supermemory plugin from scratch, giving your OpenCode Agent persistent memory capabilities. After completing this chapter, the Agent will be able to remember your project architecture and preference settings.

## Chapter Contents

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Quick Start: Installation and Configuration</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">Install the plugin, configure API Key, resolve plugin conflicts, and connect the Agent to the cloud memory repository.</p>
</a>

<a href="./initialization/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Project Initialization: First Impressions</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">Use the /supermemory-init command to let the Agent deeply scan your codebase and automatically remember project architecture and conventions.</p>
</a>

</div>

## Learning Path

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. Quick Start      2. Project Initialization                  │
│   ─────────────   →   ─────────────                             │
│   Install Plugin        Let Agent Remember                      │
│   Configure API Key     Project Architecture                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Recommended Sequence**:

1. **[Quick Start](./getting-started/)**: Complete plugin installation and API Key configuration first—this is the prerequisite for using all features.
2. **[Project Initialization](./initialization/)**: After installation, run the initialization command to help the Agent familiarize with your project.

## Prerequisites

Before starting this chapter, ensure:

- ✅ [OpenCode](https://opencode.ai) is installed and the `opencode` command is available in your terminal
- ✅ You have registered for a [Supermemory](https://console.supermemory.ai) account and obtained an API Key

## Next Steps

After completing this chapter, you can continue learning:

- **[Core Features](../core/)**: Deep dive into context injection mechanisms, toolset usage, and memory management
- **[Advanced Configuration](../advanced/)**: Customize compression thresholds, keyword triggering rules, and other advanced settings
