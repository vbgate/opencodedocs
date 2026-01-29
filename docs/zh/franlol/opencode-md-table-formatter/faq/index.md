---
title: "FAQ: 故障排查 | opencode-md-table-formatter"
sidebarTitle: "遇到问题怎么办"
subtitle: "FAQ: 故障排查 | opencode-md-table-formatter"
description: "学习 opencode-md-table-formatter 插件的常见问题和故障排查方法。快速定位表格格式化问题，解决配置、结构、对齐等疑难杂症。"
order: 3
---

# 常见问题

## 章节概述

本章节涵盖 opencode-md-table-formatter 插件的常见问题和故障排查方法，帮助你快速定位和解决表格格式化过程中遇到的各种问题。

---

## 子页面导航

### [常见问题：表格没格式化怎么办](troubleshooting/)

全面介绍插件使用中的常见问题和解决方案：

- **表格不格式化**：检查配置、版本要求、重启 OpenCode
- **无效表格结构**：理解 "invalid structure" 错误含义，学习正确表格语法
- **格式化失败**：处理 "table formatting failed" 错误和异常情况
- **不支持的表格类型**：了解 HTML 表格、多行单元格等限制场景
- **格式化后不对齐**：排查隐藏模式、单元格超长、行内代码等问题

---

## 学习路径建议

建议在完成 [功能全览](../start/features/) 后，遇到实际问题时查阅本章节，或作为问题排查的参考手册。

你可以按照以下顺序学习：

1. **遇到问题时**：先根据症状定位问题类型（表格不格式化、报错信息等）
2. **按步骤排查**：按照故障排查指南的检查清单逐一验证
3. **深入理解**：阅读[表格规范](../advanced/table-spec/)和[隐藏模式原理](../advanced/concealment-mode/)了解技术细节
4. **已知限制**：查看[已知限制](../appendix/limitations/)了解插件边界

---

## 前置条件

学习本章节前，建议先完成：

- ✅ [一分钟上手：安装与配置](../start/getting-started/) - 了解如何安装和配置插件
- ✅ [功能全览：自动格式化的魔法](../start/features/) - 理解插件的核心功能和工作原理

同时，你应该具备：

- 熟悉 Markdown 表格的基本语法
- 了解 OpenCode 的插件配置方式（`opencode.jsonc`）

---

## 下一步指引

完成本章节后，你可以继续学习：

- **进阶知识**：
  - [表格规范：什么样的表格能被格式化](../advanced/table-spec/) - 掌握有效表格的结构要求
  - [隐藏模式原理：为什么宽度计算如此重要](../advanced/concealment-mode/) - 理解 OpenCode 隐藏模式的工作原理
  - [对齐方式详解：左对齐、居中、右对齐](../advanced/alignment/) - 掌握三种对齐方式的语法和效果

- **技术细节**：
  - [已知限制：插件的边界在哪里](../appendix/limitations/) - 了解插件的已知限制和不适用的场景
  - [技术细节：缓存机制与性能优化](../appendix/tech-details/) - 了解插件的内部缓存机制和性能优化策略

---