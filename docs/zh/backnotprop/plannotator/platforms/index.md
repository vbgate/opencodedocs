---
title: "平台功能: 计划与代码评审 | Plannotator"
sidebarTitle: "评审 AI 计划和代码"
subtitle: "平台功能: 计划与代码评审"
description: "学习 Plannotator 的平台功能，包括计划评审和代码评审。掌握可视化评审、添加注释、图像标注等核心技能。"
order: 2
---

# 平台功能

本章节介绍 Plannotator 的两大核心功能：**计划评审**和**代码评审**。你将学会如何可视化评审 AI 生成的计划、添加各类注释、附加图像标注，以及评审 git diff 代码变更。

## 前置条件

::: warning 开始前请确认
在学习本章节之前，请确保你已完成以下准备：

- ✅ 已完成 [快速开始](../start/getting-started/) 教程
- ✅ 已安装 Plannotator 插件（[Claude Code](../start/installation-claude-code/) 或 [OpenCode](../start/installation-opencode/)）
:::

## 本章内容

### 计划评审

学习如何评审 AI 生成的执行计划，添加修改建议，让 AI 按你的意图执行。

| 教程 | 说明 |
|--- | ---|
| [计划评审基础](./plan-review-basics/) | 学会使用 Plannotator 可视化评审 AI 生成的计划，包括批准或拒绝计划 |
| [添加计划注释](./plan-review-annotations/) | 掌握如何在计划中添加不同类型的注释（删除、替换、插入、评论） |
| [添加图像标注](./plan-review-images/) | 学会在计划评审中附加图像，并使用画笔、箭头、圆形工具进行标注 |

### 代码评审

学习如何评审代码变更，添加行级注释，在提交前发现问题。

| 教程 | 说明 |
|--- | ---|
|--- | ---|
| [添加代码注释](./code-review-annotations/) | 掌握如何在代码评审中添加行级注释（comment/suggestion/concern） |
| [切换 Diff 视图](./code-review-diff-types/) | 学会在代码评审中切换不同的 diff 类型（uncommitted/staged/last commit/branch） |

## 学习路径

::: tip 推荐学习顺序
根据你的使用场景，选择合适的学习路径：

**路径 A：计划评审优先**（推荐新手）
1. [计划评审基础](./plan-review-basics/) → 先学会基本的计划评审流程
2. [添加计划注释](./plan-review-annotations/) → 学习如何精确修改计划
3. [添加图像标注](./plan-review-images/) → 用图像更清晰地表达意图
4. 然后再学习代码评审系列

**路径 B：代码评审优先**（适合有 Code Review 经验的开发者）
1. [代码评审基础](./code-review-basics/) → 熟悉代码评审界面
2. [添加代码注释](./code-review-annotations/) → 学习行级注释
3. [切换 Diff 视图](./code-review-diff-types/) → 掌握不同 diff 类型
4. 然后再学习计划评审系列
:::

## 下一步

完成本章节后，你可以继续学习：

- [URL 分享](../advanced/url-sharing/) - 通过 URL 分享计划和注释，实现团队协作
- [Obsidian 集成](../advanced/obsidian-integration/) - 将批准的计划自动保存到 Obsidian
- [远程模式](../advanced/remote-mode/) - 在 SSH、devcontainer、WSL 环境中使用 Plannotator
