---
title: "附录: 配置参考与迁移 | oh-my-opencode"
sidebarTitle: "配置迁移全搞定"
subtitle: "附录: 配置参考与迁移"
description: "学习 oh-my-opencode 的配置参考、Claude Code 兼容性指南和内置 MCP 服务器使用方法。了解配置选项、迁移步骤和搜索能力配置，实现从 Claude Code 的无缝迁移。"
tags:
  - "附录"
  - "参考"
order: 170
---

# 附录：参考资料与兼容性指南

本章节包含 **oh-my-opencode** 的详细参考资料和兼容性指南，涵盖完整配置说明、Claude Code 迁移支持以及内置扩展服务器的详细介绍。

## 章节内容

本章节包含三个重要部分：

| 子页面 | 描述 | 难度 |
| ------ | ---- | ---- |
| [Claude Code 兼容性](./claude-code-compatibility/) | 从 Claude Code 迁移到 OpenCode 的完整指南，包括 Commands、Skills、Agents、MCPs 和 Hooks 的兼容机制 | ⭐⭐ |
| [配置参考](./configuration-reference/) | oh-my-opencode 配置文件的完整 Schema 说明，涵盖所有字段、类型和默认值 | ⭐⭐⭐ |
| [内置 MCP](./builtin-mcps/) | 3 个内置 MCP 服务器（Exa Websearch、Context7、Grep.app）的功能和使用方法 | ⭐⭐ |

## 学习路径建议

根据你的需求选择学习顺序：

### 路径 1：从 Claude Code 迁移

如果你是从 Claude Code 迁移的用户：

1. 先阅读 **[Claude Code 兼容性](./claude-code-compatibility/)**，了解如何无缝迁移现有配置
2. 再查看 **[配置参考](./configuration-reference/)**，深入了解可用配置选项
3. 最后学习 **[内置 MCP](./builtin-mcps/)**，了解如何配置额外的搜索能力

### 路径 2：深度定制配置

如果你希望深度定制 oh-my-opencode 的行为：

1. 从 **[配置参考](./configuration-reference/)** 开始，了解所有可配置项
2. 学习 **[内置 MCP](./builtin-mcps/)**，配置搜索和文档查询能力
3. 参考 **[Claude Code 兼容性](./claude-code-compatibility/)**，了解兼容层的配置选项

### 路径 3：快速查阅

如果你只需要查阅特定信息：

- **配置问题** → 直接查看 **[配置参考](./configuration-reference/)**
- **迁移问题** → 直接查看 **[Claude Code 兼容性](./claude-code-compatibility/)**
- **MCP 配置** → 直接查看 **[内置 MCP](./builtin-mcps/)**

## 前置条件

学习本章节建议你已经：

- ✅ 完成了 **[安装与配置](../start/installation/)**
- ✅ 了解了 **[Sisyphus 编排器](../start/sisyphus-orchestrator/)** 的基本概念
- ✅ 熟悉 JSON 配置文件的编辑

## 下一步指引

完成本章节学习后，你可以：

- 🚀 尝试 **[进阶功能](../advanced/)**，学习更多高级用法
- 🔧 查看 **[常见问题解答](../faq/)**，解决使用中的问题
- 📖 阅读 **[更新日志](../changelog/)**，了解最新功能改进

::: tip 提示
本章节的内容主要作为参考资料，不需要按顺序阅读。你可以根据需要随时查阅对应部分。
:::
