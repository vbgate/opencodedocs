---
title: "Diff 视图: 多角度审查变更 | Plannotator"
sidebarTitle: "5种 diff 视图切换"
subtitle: "Diff 视图: 多角度审查变更"
description: "学习 Plannotator 代码评审中切换 diff 类型的方法。在下拉菜单中选择 uncommitted、staged、last commit 或 branch 视图，从多角度审查代码变更。"
tags:
  - "code-review"
  - "git"
  - "diff"
  - "tutorial"
prerequisite:
  - "code-review-basics"
order: 6
---

# 切换 Diff 视图

## 学完你能做什么

在代码评审时，你可以：
- 用下拉菜单在 5 种 diff 视图之间快速切换
- 理解每种视图显示的代码变更范围
- 根据审查需求选择合适的 diff 类型
- 避免因选择错误的视图而遗漏重要变更

## 你现在的困境

**评审时只看工作区，遗漏了已暂存的文件**：

你运行 `/plannotator-review` 命令，看到一些代码变更，添加了几条注释。但提交后发现，评审里漏掉了那些已经 `git add` 到暂存区的文件——这些文件根本没有出现在 diff 中。

**想知道当前分支和 main 分支的总体差异**：

你在一个 feature 分支上开发了几周，想看看总共改了哪些东西，但默认的「未提交变更」视图只能显示最近几天的修改。

**想对比两个特定提交之间的差异**：

你想确认某个 bug 修复是否正确，需要对比修复前后的代码，但不知道如何让 Plannotator 显示历史提交的 diff。

## 什么时候用这一招

- **全面审查时**：同时查看工作区和暂存区的变更
- **分支合并前**：检查当前分支相对于 main/master 的所有改动
- **回滚审查时**：确认最后一次提交改了哪些文件
- **多人协作时**：检查同事暂存但未提交的代码

## 核心思路

Git diff 命令有很多变种，每个变种显示不同的代码范围。Plannotator 把这些变种集中到了一个下拉菜单里，让你不需要记住复杂的 git 命令。

::: info Git Diff 类型速查

| diff 类型 | 显示范围 | 典型使用场景 |
|--- | --- | ---|
| Uncommitted changes | 工作区 + 暂存区 | 评审本次开发的所有修改 |
| Staged changes | 仅暂存区 | 提交前审查准备提交的内容 |
| Unstaged changes | 仅工作区 | 审查还没 `git add` 的修改 |
| Last commit | 最近一次提交 | 回滚或审查刚才的提交 |
| vs main | 当前分支 vs 默认分支 | 分支合并前全面检查 |

:::

下拉菜单的选项会根据你的 Git 状态动态变化：
- 如果当前不在默认分支，会显示「vs main」选项
- 如果没有已暂存的文件，Staged 视图会提示「No staged changes」

## 跟我做

### 第 1 步：启动代码评审

**为什么**

需要先打开 Plannotator 的代码评审界面。

**操作**

在终端运行：

```bash
/plannotator-review
```

**你应该看到**

浏览器打开了代码评审页面，左侧文件树上方有一个下拉菜单显示当前 diff 类型（通常是「Uncommitted changes」）。

### 第 2 步：切换到 Staged 视图

**为什么**

查看已经 `git add` 但还没提交的文件。

**操作**

1. 点击左侧文件树上方的下拉菜单
2. 选择「Staged changes」

**你应该看到**

- 如果有暂存文件，文件树显示这些文件
- 如果没有暂存文件，主区域显示：「No staged changes. Stage some files with git add.」

### 第 3 步：切换到 Last Commit 视图

**为什么**

审查刚才提交的代码，确认没有问题。

**操作**

1. 再次打开下拉菜单
2. 选择「Last commit」

**你应该看到**

- 显示最近一次提交修改的所有文件
- diff 内容是 `HEAD~1..HEAD` 的差异

### 第 4 步：切换到 vs main 视图（如果可用）

**为什么**

查看当前分支相对于默认分支的所有改动。

**操作**

1. 检查下拉菜单中是否有「vs main」或「vs master」选项
2. 如果有，选择它

**你应该看到**

- 文件树显示当前分支和默认分支之间的所有差异文件
- diff 内容是 `main..HEAD` 的完整变更

::: tip 检查当前分支

如果看不到「vs main」选项，说明你在默认分支上。可以用以下命令查看当前分支：

```bash
git rev-parse --abbrev-ref HEAD
```

切换到 feature 分支后再试：

```bash
git checkout feature-branch
```

:::

## 检查点 ✅

确认你已经掌握了：

- [ ] 能找到并打开 diff 类型下拉菜单
- [ ] 理解「Uncommitted」「Staged」「Last commit」的区别
- [ ] 能识别「vs main」选项什么时候出现
- [ ] 知道在什么场景下用哪种 diff 类型

## 踩坑提醒

### 坑 1：评审时只看 Uncommitted，漏掉了 Staged 文件

**症状**

提交后发现评审漏掉了一些已暂存的文件。

**原因**

Uncommitted 视图显示工作区和暂存区的所有变更（`git diff HEAD`），已暂存的文件也会包含其中。

**解决**

评审前先切到 Staged 视图检查一遍，或者用 Uncommitted 视图（包含暂存区）。

### 坑 2：分支合并前没有对比 main

**症状**

合并到 main 后发现引入了不相关的修改。

**原因**

只看了最近几天的提交，没有对比整个分支相对于 main 的差异。

**解决**

合并前用「vs main」视图全面检查一遍。

### 坑 3：以为切换视图会丢失注释

**症状**

不敢切换 diff 类型，担心之前添加的注释会消失。

**原因**

误解了切换机制。

**实际情况**

切换 diff 类型时，Plannotator 会保留之前的注释——它们可能仍然适用，或者你可以手动删除不相关的注释。

## 本课小结

Plannotator 支持的 5 种 diff 类型：

| 类型 | Git 命令 | 场景 |
|--- | --- | ---|
| Uncommitted | `git diff HEAD` | 评审本次开发的所有修改 |
| Staged | `git diff --staged` | 提交前审查暂存区 |
| Unstaged | `git diff` | 审查工作区修改 |
| Last commit | `git diff HEAD~1..HEAD` | 回滚或审查最近提交 |
| vs main | `git diff main..HEAD` | 分支合并前全面检查 |

切换视图不会丢失注释，你可以在不同视角下查看同一批或新的注释。

## 下一课预告

> 下一课我们学习 **[URL 分享](../../advanced/url-sharing/)**。
>
> 你会学到：
> - 如何将评审内容压缩到 URL 中分享给同事
> - 接收方如何打开共享的评审链接
> - 分享模式下的限制和注意事项

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Diff 类型定义 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15) | 10-15 |
| Git 上下文获取 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79-L96) | 79-96 |
| 运行 Git Diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101-L147) | 101-147 |
| Diff 切换处理 | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L300-L331) | 300-331 |
| 文件树中的 Diff 选项渲染 | [`packages/review-editor/components/FileTree.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/FileTree.tsx) | - |

**关键类型**：

- `DiffType`: `'uncommitted' | 'staged' | 'unstaged' | 'last-commit' | 'branch'`

**关键函数**：

- `getGitContext()`: 获取当前分支、默认分支和可用的 diff 选项
- `runGitDiff(diffType, defaultBranch)`: 根据 diff 类型执行对应的 git 命令

**关键 API**：

- `POST /api/diff/switch`: 切换 diff 类型，返回新的 diff 数据

</details>
