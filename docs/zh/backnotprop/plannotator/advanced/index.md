---
title: "高级功能: 协作分享与笔记集成 | plannotator"
sidebarTitle: "多人协作+笔记存档"
subtitle: "高级功能: 协作分享与笔记应用集成"
order: 3
description: "掌握 Plannotator 的团队协作和笔记集成功能。通过 URL 分享实现协作，集成 Obsidian/Bear 笔记，支持远程开发环境。"
---

# 高级功能

掌握了基础的计划评审和代码评审后，本章节将带你解锁 Plannotator 的进阶能力：团队协作分享、笔记应用集成、远程开发支持，以及灵活的环境变量配置。

::: warning 前置条件
学习本章节前，请确保你已完成：
- [快速开始](../start/getting-started/)：了解 Plannotator 的基本概念
- [计划评审基础](../platforms/plan-review-basics/)：掌握基本的计划评审操作
:::

## 本章内容

| 课程 | 说明 | 适合场景 |
|--- | --- | ---|
| [URL 分享](./url-sharing/) | 通过 URL 分享计划和注释，实现无后端的团队协作 | 需要与团队成员分享评审结果 |
| [Obsidian 集成](./obsidian-integration/) | 将批准的计划自动保存到 Obsidian vault | 使用 Obsidian 管理知识库 |
| [Bear 集成](./bear-integration/) | 通过 x-callback-url 将计划保存到 Bear | macOS/iOS 用户使用 Bear 笔记 |
| [远程模式](./remote-mode/) | 在 SSH、devcontainer、WSL 等远程环境中使用 | 远程开发场景 |
| [环境变量配置](./environment-variables/) | 了解所有可用的环境变量及其用途 | 需要自定义 Plannotator 行为 |

## 学习路径建议

```
┌─────────────────────────────────────────────────────────────────┐
│  推荐学习顺序                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. URL 分享          ← 最常用，团队协作必备                      │
│       ↓                                                         │
│  2. 笔记应用集成       ← 根据你使用的笔记应用选择                  │
│     ├─ Obsidian 集成   （Obsidian 用户）                         │
│     └─ Bear 集成       （Bear 用户）                             │
│       ↓                                                         │
│  3. 远程模式          ← 如果你在远程环境开发                      │
│       ↓                                                         │
│  4. 环境变量配置       ← 需要深度定制时再看                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

::: tip 按需学习
不必按顺序学完所有内容。如果你只需要分享功能，学完 URL 分享即可；如果你不使用远程开发，可以跳过远程模式。
:::

## 下一步

完成高级功能的学习后，你可以：

- 查看 [常见问题](../faq/common-problems/)：解决使用中遇到的问题
- 查看 [API 参考](../appendix/api-reference/)：了解 Plannotator 的完整 API
- 查看 [数据模型](../appendix/data-models/)：深入理解内部数据结构
