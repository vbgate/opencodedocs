---
title: "附录: 技术参考资料 | opencode-dynamic-context-pruning"
sidebarTitle: "深入理解原理"
subtitle: "附录: 技术参考资料 | opencode-dynamic-context-pruning"
description: "了解 DCP 的技术参考资料，包括内部架构设计、Token 计算原理和完整的 API 文档。适合深入理解原理或进行二次开发的用户。"
order: 5
---

# 附录

本章节提供 DCP 的技术参考资料，包括内部架构设计、Token 计算原理和完整的 API 文档。这些内容面向希望深入理解 DCP 工作原理或进行二次开发的用户。

## 本章内容

| 文档 | 说明 | 适合谁 |
|--- | --- | ---|
| [架构概览](./architecture/) | 了解 DCP 的内部架构、模块依赖和调用链路 | 想理解 DCP 工作原理的用户 |
| [Token 计算原理](./token-calculation/) | 理解 DCP 如何计算 Token 使用量和节省统计 | 想准确评估节省效果的用户 |
| [API 参考](./api-reference/) | 完整的 API 文档，包括配置接口、工具规范、状态管理 | 插件开发者 |

## 学习路径

```
架构概览 → Token 计算原理 → API 参考
   ↓              ↓              ↓
 理解设计      理解统计      开发扩展
```

**推荐顺序**：

1. **架构概览**：先建立整体认知，理解 DCP 的模块划分和调用链路
2. **Token 计算原理**：了解 `/dcp context` 输出的计算逻辑，学会分析 Token 分布
3. **API 参考**：如果你需要开发插件或进行二次开发，查阅完整的接口文档

::: tip 按需阅读
如果你只是想用好 DCP，可以跳过本章节。这些内容主要面向想深入理解原理或进行开发的用户。
:::

## 前置条件

阅读本章节前，建议先完成以下内容：

- [安装与快速开始](../start/getting-started/)：确保 DCP 已正常运行
- [配置全解](../start/configuration/)：了解配置系统的基本概念
- [Slash 命令使用](../platforms/commands/)：熟悉 `/dcp context` 和 `/dcp stats` 命令

## 下一步

完成本章节后，你可以：

- 查看 [常见问题与排错](../faq/troubleshooting/)：解决使用中遇到的问题
- 查看 [最佳实践](../faq/best-practices/)：学习如何最大化 Token 节省效果
- 查看 [版本历史](../changelog/version-history/)：了解 DCP 的更新记录
