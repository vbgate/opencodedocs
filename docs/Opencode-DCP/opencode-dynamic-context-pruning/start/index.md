---
title: "Quick Start: Installation and Setup | opencode-dynamic-context-pruning"
sidebarTitle: "Quick Start"
subtitle: "Quick Start: Installation and Setup"
description: "Get started with the OpenCode DCP plugin from scratch. Install the plugin, configure the multi-level settings, and see token savings within 5 minutes. Master the configuration system to optimize context pruning."
order: 1
---

# Quick Start

This chapter helps you get started with the DCP plugin from scratch. You'll learn how to install the plugin, verify its effects, and customize configurations according to your needs.

## Chapter Contents

<div class="vp-card-container">

<a href="./getting-started/" class="vp-card">
  <h3>Installation & Quick Start</h3>
  <p>Complete DCP plugin installation in 5 minutes and see token savings immediately. Learn to use the /dcp command to monitor pruning statistics.</p>
</a>

<a href="./configuration/" class="vp-card">
  <h3>Configuration Guide</h3>
  <p>Master the three-level configuration system (global, environment variables, project-level), understand configuration priority, and adjust pruning strategies and protection mechanisms as needed.</p>
</a>

</div>

## Learning Path

```
Installation & Quick Start → Configuration Guide
          ↓                    ↓
     Plugin works         Know how to tune
```

**Recommended Order**:

1. **First complete [Installation & Quick Start](./getting-started/)**: Ensure the plugin works properly and experience default pruning effects
2. **Then learn [Configuration Guide](./configuration/)**: Customize pruning strategies according to project requirements

::: tip Beginner Advice
If this is your first time using DCP, we recommend running with the default configuration for a while, observing the pruning effects before adjusting the configuration.
:::

## Prerequisites

Before starting this chapter, please confirm:

- [x] **OpenCode** is installed (version with plugin support)
- [x] You understand basic **JSONC syntax** (JSON with comments)
- [x] You know how to edit **OpenCode configuration files**

## Next Steps

After completing this chapter, you can continue learning:

- **[Auto-Pruning Strategies Explained](../platforms/auto-pruning/)**: Deep dive into the working principles of deduplication, overwrite, and error clearing strategies
- **[LLM-Driven Pruning Tools](../platforms/llm-tools/)**: Understand how AI actively calls discard and extract tools to optimize context
- **[Slash Command Usage](../platforms/commands/)**: Master the usage of /dcp context, /dcp stats, /dcp sweep, and other commands

<style>
.vp-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.vp-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.vp-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vp-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vp-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
