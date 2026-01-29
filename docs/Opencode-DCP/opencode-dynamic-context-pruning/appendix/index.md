---
title: "附录: 架构与 API 参考 | opencode-dynamic-context-pruning"
sidebarTitle: "Appendix"
subtitle: "附录: 架构与 API 参考 | opencode-dynamic-context-pruning"
description: "了解 opencode-dynamic-context-pruning 的内部架构、token 计算原理和完整 API 文档。适用于深入理解设计或二次开发。"
order: 5
---

# Appendix

This chapter provides technical reference materials for DCP, including internal architecture design, token calculation principles, and complete API documentation. These contents are aimed at users who want to deeply understand DCP's working principles or perform secondary development.

## Chapter Contents

| Document | Description | Suitable For |
|--- | --- | ---|
| [Architecture Overview](./architecture/) | Understand DCP's internal architecture, module dependencies, and call chains | Users who want to understand DCP's working principles |
| [Token Calculation Principles](./token-calculation/) | Understand how DCP calculates token usage and savings statistics | Users who want to accurately evaluate savings effects |
| [API Reference](./api-reference/) | Complete API documentation, including configuration interfaces, tool specifications, and state management | Plugin developers |

## Learning Path

```
Architecture Overview → Token Calculation Principles → API Reference
          ↓                    ↓                       ↓
    Understand Design     Understand Statistics      Develop Extensions
```

**Recommended Order**:

1. **Architecture Overview**: First establish overall understanding, understand DCP's module division and call chains
2. **Token Calculation Principles**: Understand the calculation logic of `/dcp context` output, learn to analyze token distribution
3. **API Reference**: If you need to develop plugins or perform secondary development, consult the complete interface documentation

::: tip Read as Needed
If you just want to use DCP well, you can skip this chapter. These contents are mainly aimed at users who want to deeply understand principles or perform development.
:::

## Prerequisites

Before reading this chapter, it is recommended to complete the following:

- [Installation & Quick Start](../start/getting-started/): Ensure DCP is running normally
- [Configuration Guide](../start/configuration/): Understand basic concepts of the configuration system
- [Slash Command Usage](../platforms/commands/): Be familiar with `/dcp context` and `/dcp stats` commands

## Next Steps

After completing this chapter, you can:

- Check [Troubleshooting & FAQ](../faq/troubleshooting/): Solve problems encountered during use
- Check [Best Practices](../faq/best-practices/): Learn how to maximize token savings
- Check [Version History](../changelog/version-history/): Understand DCP's update history
