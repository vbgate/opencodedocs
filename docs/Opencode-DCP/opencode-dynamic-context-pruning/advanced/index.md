---
title: "Advanced: Protection & State | opencode-dynamic-context-pruning"
sidebarTitle: "Advanced"
subtitle: "Advanced: Protection & State | opencode-dynamic-context-pruning"
description: "Master DCP's advanced features including protection mechanisms, state persistence, and caching optimization for complex production scenarios."
order: 30
---

# Advanced Features

This chapter dives deep into DCP's advanced features, helping you understand the plugin's internal mechanisms and use DCP correctly in complex scenarios.

::: warning Prerequisites
Before studying this chapter, ensure you have completed:
- [Installation & Quick Start](../start/getting-started/) - Understand DCP's basic installation and usage
- [Configuration Guide](../start/configuration/) - Familiarize with DCP's configuration system
- [Auto-Pruning Strategies Explained](../platforms/auto-pruning/) - Understand DCP's core pruning strategies
:::

## Chapter Contents

| Course | Description | Suitable For |
|--- | --- | ---|
| [Protection Mechanisms](./protection/) | Turn protection, protected tools, and protected file patterns | Avoid mistakenly pruning critical content |
| [State Persistence](./state-persistence/) | How DCP preserves pruning state and statistics across sessions | Understand data storage mechanisms |
| [Prompt Caching Impact](./prompt-caching/) | Impact of DCP pruning on Prompt Caching | Optimize cache hit rates |
| [Subagent Handling](./subagent-handling/) | DCP behavior and limitations in subagent sessions | When using Task tools |

## Recommended Learning Path

```
Protection Mechanisms → State Persistence → Prompt Caching Impact → Subagent Handling
          ↓                   ↓                     ↓                      ↓
       Required        Learn as Needed    Learn for Optimization    Learn when Using Subagents
```

**Recommended Order**:

1. **Protection Mechanisms** (Required) - The most important advanced feature, understanding it prevents DCP from mistakenly deleting critical content
2. **State Persistence** (As Needed) - If you want to understand how DCP records statistics or need to debug state issues
3. **Prompt Caching Impact** (For Optimization) - When you focus on API cost optimization, need to weigh the relationship between pruning and caching
4. **Subagent Handling** (When Using Subagents) - If you use OpenCode's Task tool to dispatch subtasks, need to understand DCP's limitations

## Next Steps

After completing this chapter, you can:

- Check [Troubleshooting & FAQ](../faq/troubleshooting/) to solve problems encountered during use
- Read [Best Practices](../faq/best-practices/) to learn how to maximize token savings
- Deep dive into [Architecture Overview](../appendix/architecture/) to understand DCP's internal implementation
