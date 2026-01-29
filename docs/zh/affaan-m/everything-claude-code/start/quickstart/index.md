---
title: "快速上手: 安装插件 | everything-claude-code"
sidebarTitle: "5分钟上手"
subtitle: "快速上手: 安装 everything-claude-code 插件"
description: "学习 everything-claude-code 的安装方法和核心功能。在 5 分钟内完成插件安装，使用 /plan、/tdd、/code-review 命令提升开发效率。"
tags:
  - "quickstart"
  - "installation"
  - "getting-started"
prerequisite: []
order: 10
---

# 快速开始：5分钟上手 Everything Claude Code

## 学完你能做什么

**Everything Claude Code** 是一个 Claude Code 插件，提供专业的 agents、commands、rules 和 hooks，帮助你提升代码质量和开发效率。本教程帮你：

- ✅ 在 5 分钟内完成 Everything Claude Code 安装
- ✅ 使用 `/plan` 命令创建实现计划
- ✅ 使用 `/tdd` 命令进行测试驱动开发
- ✅ 使用 `/code-review` 进行代码审查
- ✅ 理解插件的核心组件

## 你现在的困境

你想让 Claude Code 更强大，但：
- ❌ 每次都要重复说明编码规范和最佳实践
- ❌ 测试覆盖率低，bug 频出
- ❌ 代码审查总是遗漏安全问题
- ❌ 想要 TDD 但不知道如何开始
- ❌ 希望有专业的子代理帮助处理特定任务

**Everything Claude Code** 解决这些问题：
- 9 个专业化 agents（planner, tdd-guide, code-reviewer, security-reviewer 等）
- 14 个斜杠命令（/plan, /tdd, /code-review 等）
- 8 套强制规则（security, coding-style, testing 等）
- 15+ 个自动化 hooks
- 11 个 workflow skills

## 核心思路

**Everything Claude Code** 是一个 Claude Code 插件，提供：
- **Agents**：专业化子代理，处理特定领域任务（如 TDD、代码审查、安全审计）
- **Commands**：斜杠命令，快速启动工作流（如 `/plan`、`/tdd`）
- **Rules**：强制规则，确保代码质量和安全（如 80%+ 覆盖率、禁止 console.log）
- **Skills**：工作流定义，复用最佳实践
- **Hooks**：自动化钩子，在特定事件时触发（如会话持久化、console.log 警告）

::: tip 什么是 Claude Code 插件？
Claude Code 插件扩展了 Claude Code 的能力，就像 VS Code 插件扩展编辑器功能。安装后，你就可以使用插件提供的所有 agents、commands、skills 和 hooks。
:::

## 🎒 开始前的准备

**你需要的**：
- 已安装 Claude Code
- 对终端命令有基本了解
- 有一个项目目录（用于测试）

**你不需要的**：
- 不需要特殊的编程语言知识
- 不需要预先配置任何内容

---

## 跟我做：5 分钟安装

### 第 1 步：打开 Claude Code

启动 Claude Code 并打开一个项目目录。

**你应该看到**：Claude Code 的命令行界面准备就绪。

---

### 第 2 步：添加 Marketplace

在 Claude Code 中，运行以下命令添加 marketplace：

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**为什么**
将 Everything Claude Code 添加为 Claude Code 的插件源，这样就可以从中安装插件。

**你应该看到**：
```
✓ Successfully added marketplace: everything-claude-code
```

---

### 第 3 步：安装插件

运行以下命令安装插件：

```bash
/plugin install everything-claude-code@everything-claude-code
```

**为什么**
安装 Everything Claude Code 插件，这样就可以使用它提供的所有功能。

**你应该看到**：
```
✓ Successfully installed plugin: everything-claude-code@everything-claude-code
```

---

### 第 4 步：验证安装

运行以下命令查看已安装的插件：

```bash
/plugin list
```

**你应该看到**：
```
Installed Plugins:
  everything-claude-code@everything-claude-code
```

✅ 安装成功！

---

## 跟我做：体验核心功能

### 第 5 步：使用 /plan 创建实现计划

假设你想添加一个用户认证功能，运行：

```bash
/plan I need to add user authentication with email and password
```

**为什么**
使用 planner agent 创建详细的实现计划，避免遗漏关键步骤。

**你应该看到**：
```
# Implementation Plan: User Authentication with Email and Password

## Requirements Restatement
- User registration with email and password
- User login with email and password
- Password hashing with bcrypt
- JWT token generation
- Session management

## Implementation Phases
[详细的实现步骤...]

## Risks
- HIGH: Password security (use bcrypt, salt rounds)
- MEDIUM: JWT token expiration
- LOW: Email uniqueness validation

## Estimated Complexity: MEDIUM
**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

输入 `yes` 确认计划，然后 planner 会开始实施。

---

### 第 6 步：使用 /tdd 进行测试驱动开发

在实施功能时，运行：

```bash
/tdd I need to implement a function to validate email format
```

**为什么**
使用 tdd-guide agent 强制 TDD 流程，确保先写测试，再实现代码，达到 80%+ 覆盖率。

**你应该看到**：
```
# TDD Session: Email Format Validator

## Step 1: Define Interface (SCAFFOLD)
```typescript
// lib/email-validator.ts
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)
[测试代码...]

## Step 3: Run Tests - Verify FAIL
[测试失败...]

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)
[实现代码...]

## Step 5: Run Tests - Verify PASS
[测试通过...]

## Step 6: Refactor (IMPROVE)
[重构代码...]

## Step 7: Verify Tests Still Pass
[测试仍然通过...]

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)

✅ TDD session complete!
```

---

### 第 7 步：使用 /code-review 审查代码

在提交代码前，运行：

```bash
/code-review
```

**为什么**
使用 code-reviewer agent 检查代码质量、安全性和最佳实践。

**你应该看到**：
```
# Code Review Report

## Overview
- Files reviewed: 3
- Total lines: 150
- Issues found: 2

## Issues Found

### 1. [CRITICAL] Hardcoded JWT Secret
**Location**: `lib/auth.ts:15`
**Issue**: JWT secret is hardcoded in source code
**Fix**: Move to environment variable
**Impact**: Security vulnerability - secret exposed in code

### 2. [MEDIUM] Missing Error Handling
**Location**: `lib/email-validator.ts:23`
**Issue**: No error handling for null/undefined input
**Fix**: Add null check at function start
**Impact**: Potential runtime errors

## Recommendations
✓ Tests are well written
✓ Code is readable
✓ Follows TypeScript best practices

**Action Required**: Fix CRITICAL issues before commit.
```

修复问题后，再次运行 `/code-review` 确认所有问题已解决。

---

## 检查点 ✅

确认你已经成功完成以下步骤：

- [ ] 成功添加 marketplace
- [ ] 成功安装 everything-claude-code 插件
- [ ] 使用 `/plan` 创建了实现计划
- [ ] 使用 `/tdd` 进行了 TDD 开发
- [ ] 使用 `/code-review` 进行了代码审查

如果遇到问题，查看 [常见问题排查](../../faq/troubleshooting-hooks/) 或检查 [MCP 连接失败](../../faq/troubleshooting-mcp/)。

---

## 踩坑提醒

::: warning 安装失败
如果 `/plugin marketplace add` 失败，确保：
1. 你使用的是 Claude Code 最新版本
2. 网络连接正常
3. GitHub 访问正常（可能需要代理）
:::

::: warning 命令不可用
如果 `/plan` 或 `/tdd` 命令不可用：
1. 运行 `/plugin list` 确认插件已安装
2. 检查插件状态是否为 enabled
3. 重启 Claude Code
:::

::: tip Windows 用户
Everything Claude Code 完全支持 Windows。所有 hooks 和脚本都使用 Node.js 重写，确保跨平台兼容性。
:::

---

## 本课小结

✅ 你已经：
1. 成功安装 Everything Claude Code 插件
2. 理解了核心概念：agents、commands、rules、skills、hooks
3. 体验了 `/plan`、`/tdd`、`/code-review` 三个核心命令
4. 掌握了基本的 TDD 开发流程

**记住**：
- Agents 是专业化子代理，处理特定任务
- Commands 是快速启动工作流的入口
- Rules 是强制规则，确保代码质量和安全
- 从有共鸣的功能开始，逐步扩展
- 不要启用所有 MCPs，保持少于 10 个

---

## 下一课预告

> 下一课我们学习 **[安装指南：插件市场 vs 手动安装](../installation/)**。
>
> 你会学到：
> - 插件市场安装的详细步骤
> - 手动安装的完整流程
> - 如何只复制需要的组件
> - MCP 服务器的配置方法

继续学习，深入了解 Everything Claude Code 的完整安装和配置。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能          | 文件路径                                                                                    | 行号  |
|--- | --- | ---|
| 插件清单       | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28  |
| Marketplace 配置 | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45  |
| 安装说明       | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                        | 175-242 |
| /plan 命令      | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114 |
| /tdd 命令      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)            | 1-327 |
|--- | --- | ---|

**关键常量**：
- 插件名称: `everything-claude-code`
- Marketplace 仓库: `affaan-m/everything-claude-code`

**关键文件**：
- `plugin.json`: 插件元数据和组件路径
- `commands/*.md`: 14 个斜杠命令定义
- `agents/*.md`: 9 个专业化子代理
- `rules/*.md`: 8 套强制规则
- `hooks/hooks.json`: 15+ 个自动化钩子配置

</details>
