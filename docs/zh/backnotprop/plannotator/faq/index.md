---
title: "常见问题: 解决使用疑难 | opencode-plannotator"
sidebarTitle: "遇到问题怎么办"
subtitle: "常见问题: 解决使用疑难"
description: "学习 Plannotator 常见问题的解决方法。掌握端口占用、浏览器未打开、集成失败等问题的快速排查技巧。"
order: 4
---

# 常见问题

本章节帮助你解决使用 Plannotator 过程中遇到的各种问题。无论是端口占用、浏览器未打开，还是集成失败，这里都有对应的解决方案和调试技巧。

## 本章内容

<div class="grid-cards">

<a href="./common-problems/" class="card">
  <h3>🔧 常见问题</h3>
  <p>解决使用过程中遇到的常见问题，包括端口占用、浏览器未打开、计划未显示、Git 错误、图片上传失败、Obsidian/Bear 集成问题等。</p>
</a>

<a href="./troubleshooting/" class="card">
  <h3>🔍 故障排查</h3>
  <p>掌握故障排查的基本方法，包括日志查看、错误处理和调试技巧。学会通过日志输出快速定位问题来源。</p>
</a>

</div>

## 学习路径

```
常见问题 → 故障排查
   ↓           ↓
 快速解决    深入调试
```

**推荐顺序**：

1. **先看常见问题**：大多数问题都能在这里找到现成的解决方案
2. **再学故障排查**：如果常见问题没有覆盖，学习如何通过日志和调试技巧自行排查

::: tip 遇到问题时的建议
先在「常见问题」中搜索关键词（如"端口"、"浏览器"、"Obsidian"），找到对应的解决方案。如果问题比较复杂或不在列表中，再参考「故障排查」学习调试方法。
:::

## 前置条件

在学习本章节之前，建议你已经完成：

- ✅ [快速开始](../start/getting-started/) - 了解 Plannotator 的基本概念
- ✅ 安装了 Claude Code 或 OpenCode 插件（二选一）：
  - [安装 Claude Code 插件](../start/installation-claude-code/)
  - [安装 OpenCode 插件](../start/installation-opencode/)

## 下一步

完成本章节后，你可以继续学习：

- [API 参考](../appendix/api-reference/) - 了解所有 API 端点和请求/响应格式
- [数据模型](../appendix/data-models/) - 了解 Plannotator 使用的数据结构
- [环境变量配置](../advanced/environment-variables/) - 深入了解所有可用的环境变量

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
  transition: all 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dark .grid-cards .card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
