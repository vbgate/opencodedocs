---
title: "快速开始: 安装配置 | opencode-dynamic-context-pruning"
sidebarTitle: "5 分钟跑起来"
subtitle: "快速开始: 安装配置"
description: "学习 OpenCode DCP 插件的安装和配置方法。在 5 分钟内完成插件安装，体验 Token 节省效果，掌握三级配置系统。"
order: 1
---

# 快速开始

本章节帮助你从零开始使用 DCP 插件。你将学会安装插件、验证效果，并根据需求自定义配置。

## 本章内容

<div class="vp-card-container">

<a href="./getting-started/" class="vp-card">
  <h3>安装与快速开始</h3>
  <p>5 分钟完成 DCP 插件安装，立即看到 Token 节省效果。学习使用 /dcp 命令监控修剪统计。</p>
</a>

<a href="./configuration/" class="vp-card">
  <h3>配置全解</h3>
  <p>掌握三级配置系统（全局、环境变量、项目级），理解配置优先级，按需调整修剪策略和保护机制。</p>
</a>

</div>

## 学习路径

```
安装与快速开始 → 配置全解
     ↓              ↓
  插件能用了    知道怎么调了
```

**推荐顺序**：

1. **先完成 [安装与快速开始](./getting-started/)**：确保插件正常工作，体验默认修剪效果
2. **再学习 [配置全解](./configuration/)**：根据项目需求自定义修剪策略

::: tip 新手建议
如果你是第一次使用 DCP，建议先用默认配置跑一段时间，观察修剪效果后再调整配置。
:::

## 前置条件

开始本章学习前，请确认：

- [x] 已安装 **OpenCode**（支持插件功能的版本）
- [x] 了解基本的 **JSONC 语法**（支持注释的 JSON）
- [x] 知道如何编辑 **OpenCode 配置文件**

## 下一步

完成本章后，你可以继续学习：

- **[自动修剪策略详解](../platforms/auto-pruning/)**：深入理解去重、覆盖写入、清除错误三种策略的工作原理
- **[LLM 驱动修剪工具](../platforms/llm-tools/)**：了解 AI 如何主动调用 discard 和 extract 工具优化上下文
- **[Slash 命令使用](../platforms/commands/)**：掌握 /dcp context、/dcp stats、/dcp sweep 等命令的用法

<style>
.vp-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.vp-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.vp-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vp-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vp-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
