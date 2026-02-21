---
title: "5 分钟上手 Superpowers：安装、验证与第一个命令 | Superpowers 教程"
sidebarTitle: "5 分钟跑起来"
subtitle: "快速开始：5 分钟上手 Superpowers"
description: "在 5 分钟内安装并体验 Superpowers 的核心功能，包括安装、验证和第一个命令的使用。本教程让你快速了解 Superpowers 如何提升 AI 编码代理的开发效率。"
tags:
  - "快速开始"
  - "入门"
  - "安装"
order: 20
---

# 快速开始：5 分钟上手 Superpowers

## 学完你能做什么

- 在 5 分钟内完成 Superpowers 安装
- 验证插件正确加载
- 使用第一个核心命令体验 AI 代理的新能力

---

## 你现在的困境

用 AI 写代码时，你是不是遇到过这些问题：

- AI 直接跳过设计就开始写代码，改来改去还是不对
- 写完一堆代码才发现逻辑错误，浪费半小时
- 没有测试，上线后才发现 Bug
- AI 偷懒跳过 TDD，代码质量不稳定

**Superpowers 专治这些问题**——它不是给"更聪明的 AI"用的，是给"听话的 AI"用的。通过强制的工作流，让 AI 遵循最佳实践。

---

## 什么时候用这一招

任何时候你要用 AI 写代码：
- ✅ 构建新功能
- ✅ 修复 Bug
- ✅ 重构代码
- ✅ 编写测试

Superpowers 会自动检查任务类型，触发对应的技能工作流。

---

## 🎒 开始前的准备

### 平台选择

Superpowers 支持三大 AI 编码平台：

| 平台 | 安装难度 | 推荐度 |
| ---- | -------- | ------ |
| Claude Code | ⭐ 最简单 | ✅ 推荐新手 |
| OpenCode | ⭐⭐⭐ 中等 | 高级用户 |
| Codex | ⭐⭐⭐ 复杂 | 有 CLI 经验 |

**本教程使用 Claude Code**，因为它有内置插件市场，安装最快。

### 前置条件

- 已安装 [Claude Code](https://claude.ai/code)
- 有 GitHub 账号（用于插件市场）
- 基本的终端使用能力

---

## 核心思路

Superpowers 是什么？

**简单说**：一套"强制最佳实践"的技能包。

**工作方式**：在你让 AI 写代码前，它**不会**直接开写，而是：
1. **先问你问题**（brainstorming）——搞清楚你要做什么
2. **再写计划**（writing-plans）——把任务拆成 2-5 分钟的小块
3. **用 TDD 开发**（test-driven-development）——先写测试，再写代码
4. **代码审查**（requesting-code-review）——每步都检查质量

**这不是建议，是强制规则**——技能会自动触发，AI 必须遵守。

---

## 跟我做

### 第 1 步：注册插件市场

打开 Claude Code，输入：

```bash
/plugin marketplace add obra/superpowers-marketplace
```

**为什么**

注册插件市场，让 Claude Code 知道去哪里找 Superpowers 插件。

**你应该看到**：

```
✅ Successfully added marketplace: obra/superpowers-marketplace
```

---

### 第 2 步：安装 Superpowers 插件

```bash
/plugin install superpowers@superpowers-marketplace
```

**为什么**

从刚才注册的市场下载并安装 Superpowers 插件。

**你应该看到**：

```
📦 Installing superpowers from superpowers-marketplace...
✅ Successfully installed superpowers
```

---

### 第 3 步：验证安装

```bash
/help
```

**为什么**

检查 Superpowers 的命令是否正确加载。

**你应该看到**以下命令：

| 命令 | 功能 |
| ---- | ---- |
| `/superpowers:brainstorm` | 交互式设计优化 |
| `/superpowers:write-plan` | 创建实施计划 |
| `/superpowers:execute-plan` | 批量执行计划 |

如果看到这三个命令，说明安装成功！

---

### 第 4 步：体验第一个命令

现在试一下最核心的功能——让 AI 在写代码前先跟你聊清楚需求。

输入：

```bash
/superpowers:brainstorm 我要给博客添加一个评论功能
```

**为什么**

触发 brainstorming 技能，让 AI 先询问需求，而不是直接写代码。

**你会看到**：

1. AI 不会直接写代码
2. AI 会问你问题（比如："评论需要支持什么功能？需要登录吗？要不要点赞？"）
3. 你回答后，AI 会分段展示设计（每次 200-300 字，方便你消化）
4. 设计确认后，AI 会把设计文档保存到 `docs/plans/` 目录

这就是 Superpowers 的核心——**先聊清楚，再写代码**。

---

## 检查点 ✅

确认以下检查点都通过：

- [ ] `/help` 能看到 `/superpowers:brainstorm` 等三个命令
- [ ] `/superpowers:brainstorm` 命令能触发（AI 会先问问题，不是直接写代码）
- [ ] AI 不会跳过设计直接开始编码

如果以上都 OK，恭喜你已经完成了 Superpowers 的快速上手！

---

## 踩坑提醒

### 命令不出现

**症状**：`/help` 里看不到 Superpowers 命令

**解决**：
1. 确认你输入的是 `/superpowers:brainstorm`（冒号不是空格）
2. 尝试重启 Claude Code
3. 重新执行安装步骤

### AI 还是直接写代码

**症状**：使用 `/superpowers:brainstorm` 后，AI 直接开始写代码

**解决**：
- 这可能是因为你的问题太简单，AI 认为"不需要设计"
- 试试更复杂的任务（比如："重构用户认证系统，添加双因素认证"）
- 确保安装了最新版本：`/plugin update superpowers`

---

## 本课小结

5 分钟内你完成了：
1. ✅ 安装 Superpowers 插件
2. ✅ 验证命令正确加载
3. ✅ 体验第一个核心功能（brainstorming）

**核心收获**：
- Superpowers 不是"更聪明的 AI"，是"听话的 AI"
- 它通过强制工作流（设计→计划→TDD→审查）保证代码质量
- 技能会自动触发，你不需要手动选择

---

## 下一课预告

> 下一课我们学习 **[安装指南](../installation/)**。
>
> 你会学到：
> - 三大平台的完整安装步骤
> - OpenCode 和 Codex 的手动配置
> - 详细的问题排查方法
