---
title: "平台功能: 模型与配额 | opencode-antigravity-auth"
sidebarTitle: "解锁双配额系统"
subtitle: "平台功能: 模型与配额"
description: "了解 Antigravity Auth 的模型类型和双配额系统。掌握模型选择、Thinking 配置和 Google Search 方法，优化配额使用。"
order: 2
---

# 平台功能

本章节帮助你深入了解 Antigravity Auth 插件支持的模型、配额系统和平台特性。你将学会选择合适的模型、配置 Thinking 能力、启用 Google Search 以及最大化配额利用率。

## 前置条件

::: warning 开始前请确认
在学习本章节之前，请确保你已完成：
- [快速安装](../start/quick-install/)：完成插件安装和首次认证
- [首次请求](../start/first-request/)：成功发起第一个模型请求
:::

## 学习路径

按以下顺序学习，循序渐进掌握平台功能：

### 1. [可用模型](./available-models/)

了解所有可用的模型及其变体配置

- 认识 Claude Opus 4.5、Sonnet 4.5 和 Gemini 3 Pro/Flash
- 理解 Antigravity 和 Gemini CLI 两个配额池的模型分布
- 掌握 `--variant` 参数的使用方法

### 2. [双配额系统](./dual-quota-system/)

理解 Antigravity 和 Gemini CLI 双配额池的工作原理

- 了解每个账户如何拥有两个独立的 Gemini 配额池
- 启用自动 fallback 配置，实现配额翻倍
- 显式指定模型使用特定配额池

### 3. [Google Search Grounding](./google-search-grounding/)

为 Gemini 模型启用 Google Search，提升事实准确性

- 让 Gemini 能够搜索实时网络信息
- 调节搜索阈值，控制搜索频率
- 根据任务需求选择合适的配置

### 4. [Thinking 模型](./thinking-models/)

掌握 Claude 和 Gemini 3 Thinking 模型的配置和使用

- 配置 Claude 的 thinking budget
- 使用 Gemini 3 的 thinking level（minimal/low/medium/high）
- 理解 interleaved thinking 和思考块保留策略

## 下一步

完成本章节后，你可以继续学习：

- [多账户配置](../advanced/multi-account-setup/)：配置多个 Google 账户，实现配额池化和负载均衡
- [账户选择策略](../advanced/account-selection-strategies/)：掌握 sticky、round-robin、hybrid 三种策略的最佳实践
- [配置指南](../advanced/configuration-guide/)：掌握所有配置选项，按需定制插件行为
