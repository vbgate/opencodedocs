---
title: "快速开始: 使用 Agent Skills | opencode-agent-skills"
sidebarTitle: "30 分钟上手"
order: 1
subtitle: "快速开始"
description: "学习 OpenCode Agent Skills 插件的快速上手方法。在 30 分钟内完成安装配置，创建第一个技能，掌握插件核心功能。"
---

# 快速开始

本章节帮助你从零开始使用 OpenCode Agent Skills 插件。你将了解插件的核心价值，完成安装配置，并创建你的第一个技能。

## 本章内容

<div class="grid-cards">

<a href="./what-is-opencode-agent-skills/" class="card">
  <h3>什么是 OpenCode Agent Skills？</h3>
  <p>了解插件的核心价值和功能特性，包括动态技能发现、上下文注入、压缩恢复等机制。</p>
</a>

<a href="./installation/" class="card">
  <h3>安装指南</h3>
  <p>完成插件安装并验证运行，支持基本安装、固定版本安装和本地开发安装三种方式。</p>
</a>

<a href="./creating-your-first-skill/" class="card">
  <h3>创建你的第一个技能</h3>
  <p>掌握技能目录结构和 SKILL.md 格式规范，动手创建并测试一个简单技能。</p>
</a>

</div>

## 学习路径

建议按以下顺序学习：

1. **[什么是 OpenCode Agent Skills？](./what-is-opencode-agent-skills/)** — 先了解插件能做什么，建立整体认知
2. **[安装指南](./installation/)** — 安装插件，让 OpenCode 具备技能管理能力
3. **[创建你的第一个技能](./creating-your-first-skill/)** — 动手实践，创建属于你的第一个技能

::: tip 预计时间
完成本章节大约需要 30-45 分钟。
:::

## 下一步

完成本章节后，你可以继续学习 **[平台功能](../platforms/)**，深入了解技能发现机制、技能加载、自动匹配等高级功能。

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
