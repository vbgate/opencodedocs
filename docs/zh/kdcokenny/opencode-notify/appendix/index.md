---
title: "opencode-notify 附录：事件类型与配置文件完全参考 | 教程"
sidebarTitle: "查阅配置和事件"
subtitle: "附录：事件类型与配置参考"
description: "查阅 opencode-notify 插件的事件类型说明和配置文件示例。本教程列出四种 OpenCode 事件类型及触发条件，详细说明每个事件的过滤规则和平台差异，提供完整配置文件模板、所有配置字段的详细注释、默认值设置、最小化配置示例、禁用插件方法以及 macOS 可用音效完整列表。"
order: 5
---

# 附录：事件类型与配置参考

本章节提供参考文档和配置示例，帮助你深入理解 opencode-notify 的事件类型和配置选项。这些内容适合作为查阅资料，不需要按顺序学习。

## 学习路径

### 1. [事件类型说明](./event-types/)

了解插件监听的 OpenCode 事件类型及其触发条件。

- 四种事件类型（session.idle、session.error、permission.updated、tool.execute.before）
- 每种事件的触发时机和处理逻辑
- 父会话检查、静音时段检查、终端焦点检查的过滤规则
- 不同平台的功能差异

### 2. [配置文件示例](./config-file-example/)

查看完整的配置文件示例和所有字段的详细注释。

- 完整配置文件模板
- notifyChildSessions、sounds、quietHours、terminal 等字段说明
- macOS 可用音效完整列表
- 最小化配置示例
- 禁用插件的方法

## 前置条件

::: tip 学习建议

本章节是参考文档，可以在需要时查阅。建议在完成以下基础教程后再来参考本章节内容：

- [快速开始](../../start/quick-start/) - 完成安装和初步配置
- [工作原理](../../start/how-it-works/) - 了解插件的核心机制

:::

## 下一步

学习完附录内容后，你可以：

- 查看 [更新日志](../changelog/release-notes/) 了解版本历史和新功能
- 返回 [配置参考](../../advanced/config-reference/) 深入学习高级配置选项
- 浏览 [常见问题](../../faq/common-questions/) 查找答案
