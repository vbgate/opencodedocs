---
title: "Advanced: Compaction & Configuration | opencode-supermemory"
sidebarTitle: "Advanced Features"
subtitle: "Advanced: Compaction & Configuration"
description: "Learn Supermemory's proactive compaction mechanism and advanced configuration options. Optimize memory engine performance and customize plugin behavior for your workflow."
order: 3
---

# Advanced Features

This chapter delves into Supermemory's underlying mechanisms and advanced configuration options. You will learn how to optimize the memory engine's performance and customize plugin behavior according to your project needs.

## Chapter Contents

<div class="grid-cards">

### [Proactive Compaction Mechanism](./compaction/)

Gain a deep understanding of the automatic compression mechanism triggered by Token thresholds. Learn how Supermemory proactively generates structured summaries and persists them before context overflow, preventing "memory loss" issues during long sessions.

### [In-Depth Configuration](./configuration/)

Customize compression thresholds, keyword triggering rules, and search parameters. Master all configuration file options to make Supermemory perfectly adapt to your workflow.

</div>

## Learning Path

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1             Step 2                                   │
│  Proactive Compaction Mechanism   →   In-Depth Configuration│
│  (Understand Mechanism)             (Customize Manually)     │
└─────────────────────────────────────────────────────────────┘
```

**Recommended Sequence**:

1. **First learn compaction principles**: Understand how Supermemory automatically manages context—this is the foundation for advanced configuration.
2. **Then learn configuration details**: Only after understanding the mechanism can you make reasonable configuration decisions (e.g., what threshold value is appropriate).

## Prerequisites

::: warning Before You Begin
This chapter assumes you have completed the following learning:

- ✅ [Quick Start](../start/getting-started/): Plugin installed and API Key configured
- ✅ [Memory Scope and Lifecycle](../core/memory-management/): Understanding the difference between User Scope and Project Scope
:::

## Next Steps

After completing this chapter, we recommend continuing with:

- **[Privacy and Data Security](../security/privacy/)**: Learn about sensitive data redaction mechanisms to ensure your code and keys are not accidentally uploaded.
