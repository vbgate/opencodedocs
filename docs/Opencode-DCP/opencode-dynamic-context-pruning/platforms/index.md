---
title: "Core Features: Auto-Pruning & Tools | opencode-dynamic-context-pruning"
sidebarTitle: "Core Features"
subtitle: "Core Features: Auto-Pruning & Tools | opencode-dynamic-context-pruning"
description: "Master DCP's core capabilities: auto-pruning strategies, LLM-driven tools, and slash commands. Learn to optimize context efficiently for better AI interactions."
order: 20
---

# Core Features

This chapter dives deep into DCP's three core capabilities: auto-pruning strategies, LLM-driven tools, and Slash commands. After mastering these features, you can fully leverage DCP's token optimization potential.

## Chapter Contents

<div class="grid-cards">

### [Auto-Pruning Strategies](./auto-pruning/)

Deep dive into how DCP's three automatic strategies work: deduplication strategy, overwrite strategy, and error clearing strategy. Learn the trigger conditions and use cases for each strategy.

### [LLM-Driven Pruning Tools](./llm-tools/)

Understand how AI autonomously calls `discard` and `extract` tools to optimize context. This is DCP's most intelligent feature, allowing AI to actively participate in context management.

### [Slash Command Usage](./commands/)

Master all DCP command usage: `/dcp context` to view context status, `/dcp stats` to view statistics, `/dcp sweep` to manually trigger pruning.

</div>

## Learning Path

We recommend studying the contents of this chapter in the following order:

```
Auto-Pruning Strategies → LLM-Driven Tools → Slash Commands
          ↓                    ↓                  ↓
     Understand Principles   Master Smart Pruning   Learn Monitoring & Debugging
```

1. **First learn auto-pruning strategies**: This is the foundation of DCP, understand the working principles of the three strategies
2. **Then learn LLM-driven tools**: After understanding automatic strategies, learn more advanced AI active pruning capabilities
3. **Finally learn Slash commands**: Master monitoring and manual control methods for debugging and optimization

::: tip Prerequisites
Before studying this chapter, ensure you have completed:
- [Installation & Quick Start](../start/getting-started/) - Complete DCP plugin installation
- [Configuration Guide](../start/configuration/) - Understand basic concepts of the configuration system
:::

## Next Steps

After completing this chapter, you can continue exploring:

- **[Protection Mechanisms](../advanced/protection/)** - Learn how to protect critical content from being mistakenly pruned
- **[State Persistence](../advanced/state-persistence/)** - Understand how DCP preserves state across sessions
- **[Prompt Caching Impact](../advanced/prompt-caching/)** - Understand the trade-offs between DCP and Prompt Caching
