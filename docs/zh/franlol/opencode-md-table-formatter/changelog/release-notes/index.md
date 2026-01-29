---
title: "更新日志: 版本历史 | opencode-md-table-formatter"
sidebarTitle: "版本变化一览"
subtitle: "更新日志：版本历史与变更记录"
description: "了解 opencode-md-table-formatter 的版本演进和新功能。查看 v0.1.0 特性，包括自动格式化和宽度缓存等。"
tags:
  - "changelog"
  - "version-history"
  - "release-notes"
prerequisite: []
order: 90
---

# 更新日志：版本历史与变更记录

::: info 学完你能做什么
- 追踪插件的版本演进历程
- 了解每个版本的新功能和修复
- 掌握已知限制和技术细节
- 了解未来可能的功能增强
:::

---

## [0.1.0] - 2025-01-07

### 新增功能

这是 opencode-md-table-formatter 的**初始发布版本**，包含以下核心功能：

- **自动表格格式化**：通过 `experimental.text.complete` 钩子自动格式化 AI 生成的 Markdown 表格
- **隐藏模式支持**：计算宽度时正确处理隐藏的 Markdown 符号（如 `**`、`*`）
- **嵌套 Markdown 处理**：支持任意深度的嵌套 Markdown 语法，使用多遍剥离算法
- **代码块保护**：行内代码（`` `code` ``）内的 Markdown 符号保持字面形式，不参与宽度计算
- **对齐方式支持**：支持左对齐（`---` 或 `:---`）、居中对齐（`:---:`）、右对齐（`---:`）
- **宽度缓存优化**：缓存字符串显示宽度计算结果，提升性能
- **无效表格验证**：自动验证表格结构，无效表格会添加错误注释
- **多字符支持**：支持 Emoji、Unicode 字符、空单元格、超长内容
- **静默错误处理**：格式化失败不会中断 OpenCode 工作流

### 技术细节

本版本包含约 **230 行生产就绪的 TypeScript 代码**：

- **12 个函数**：职责清晰，分离良好
- **类型安全**：正确使用 `Hooks` 接口
- **智能缓存清理**：在操作数超过 100 次或缓存条目超过 1000 时触发清理
- **多遍正则处理**：支持任意嵌套深度的 Markdown 符号剥离

::: tip 缓存机制
缓存设计用于优化重复内容的宽度计算。例如，当表格中多次出现相同的单元格文本时，只会计算一次宽度，后续直接从缓存读取。
:::

### 已知限制

本版本不支持以下场景：

- **HTML 表格**：仅支持 Markdown 管道表格（Pipe Table）
- **多行单元格**：不支持包含 `<br>` 标签的单元格
- **无分隔行表格**：表格必须包含分隔行（`|---|`）才能被格式化
- **依赖要求**：需要 `@opencode-ai/plugin` >= 0.13.7（使用未公开的 `experimental.text.complete` 钩子）

::: info 版本要求
插件依赖 OpenCode >= 1.0.137 和 `@opencode-ai/plugin` >= 0.13.7 才能正常工作。
:::

---

## 未来计划

以下功能计划在未来的版本中实现：

- **配置选项**：支持自定义最小/最大列宽、禁用特定功能
- **无表头表格支持**：格式化没有表头行的表格
- **性能优化**：针对超大表格（100+ 行）的性能分析和优化
- **更多对齐选项**：扩展对齐方式的语法和功能

::: tip 参与贡献
如果你有功能建议或想贡献代码，欢迎在 [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) 提出你的想法。
:::

---

## 变更记录格式说明

本项目的更新日志遵循 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) 格式，版本号遵循 [语义化版本规范 (Semantic Versioning)](https://semver.org/spec/v2.0.0.html)。

**版本号格式**：`MAJOR.MINOR.PATCH`

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向后兼容的新功能
- **PATCH**：向后兼容的问题修复

**变更类型**：

- **Added**：新增功能
- **Changed**：现有功能的变更
- **Deprecated**：即将移除的功能
- **Removed**：已移除的功能
- **Fixed**：问题修复
- **Security**：安全相关修复

---

## 建议阅读顺序

如果你是新用户，建议按以下顺序学习：

1. [一分钟上手：安装与配置](../../start/getting-started/) —— 快速上手
2. [功能全览：自动格式化的魔法](../../start/features/) —— 了解核心功能
3. [常见问题：表格没格式化怎么办](../../faq/troubleshooting/) —— 故障排查
4. [已知限制：插件的边界在哪里](../../appendix/limitations/) —— 了解限制
