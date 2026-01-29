---
title: "核心功能: 三大能力 | opencode-dcp"
sidebarTitle: "解锁三大能力"
subtitle: "核心功能: 三大能力"
description: "学习 opencode-dcp 的三大核心功能：自动修剪策略、LLM 驱动工具和 Slash 命令。掌握这些功能充分发挥 Token 优化潜力。"
order: 20
---

# 核心功能

本章节深入讲解 DCP 的三大核心能力：自动修剪策略、LLM 驱动工具和 Slash 命令。掌握这些功能后，你就能充分发挥 DCP 的 Token 优化潜力。

## 本章内容

<div class="grid-cards">

### [自动修剪策略](./auto-pruning/)

深入理解 DCP 的三种自动策略如何工作：去重策略、覆盖写入策略和清除错误策略。了解每种策略的触发条件和适用场景。

### [LLM 驱动修剪工具](./llm-tools/)

理解 AI 如何自主调用 `discard` 和 `extract` 工具优化上下文。这是 DCP 最智能的功能，让 AI 主动参与上下文管理。

### [Slash 命令使用](./commands/)

掌握所有 DCP 命令的用法：`/dcp context` 查看上下文状态、`/dcp stats` 查看统计数据、`/dcp sweep` 手动触发修剪。

</div>

## 学习路径

建议按以下顺序学习本章内容：

```
自动修剪策略 → LLM 驱动工具 → Slash 命令
     ↓              ↓            ↓
  理解原理      掌握智能修剪    学会监控和调试
```

1. **先学自动修剪策略**：这是 DCP 的基础，理解三种策略的工作原理
2. **再学 LLM 驱动工具**：在理解自动策略后，学习更高级的 AI 主动修剪能力
3. **最后学 Slash 命令**：掌握监控和手动控制的方法，方便调试和优化

::: tip 前置条件
学习本章前，请确保已完成：
- [安装与快速开始](../start/getting-started/) - 完成 DCP 插件安装
- [配置全解](../start/configuration/) - 了解配置系统的基本概念
:::

## 下一步

完成本章学习后，你可以继续探索：

- **[保护机制](../advanced/protection/)** - 学习如何保护关键内容不被误修剪
- **[状态持久化](../advanced/state-persistence/)** - 了解 DCP 如何跨会话保留状态
- **[Prompt 缓存影响](../advanced/prompt-caching/)** - 理解 DCP 与 Prompt Caching 的权衡
