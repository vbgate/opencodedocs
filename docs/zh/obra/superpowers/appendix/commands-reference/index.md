---
title: "命令参考：斜杠命令速查表 | Superpowers 教程"
sidebarTitle: "命令速查表"
subtitle: "命令参考：斜杠命令速查表"
description: "学习 Superpowers 斜杠命令。本参考详解 /brainstorm、/write-plan、/execute-plan 命令的触发条件、使用场景、执行步骤和最佳实践，帮助你快速调用核心工作流，遵循 TDD 原则和系统化调试，提高代码质量和开发效率，减少调试时间和错误率，加快迭代速度和交付频率。"
tags:
  - "命令"
  - "参考"
  - "斜杠命令"
prerequisite: []
order: 270
---

# 命令参考：斜杠命令速查表

Superpowers 提供了三个斜杠命令，用于快速调用核心工作流技能。

## 命令一览

| 命令 | 描述 | 调用技能 | 适用场景 |
| --- | --- | --- | --- |
| `/brainstorm` | 创意设计需求澄清 | brainstorming | 创造性工作前 |
| `/write-plan` | 编写详细实施计划 | writing-plans | 有规格/需求的多步任务前 |
| `/execute-plan` | 批量执行计划任务 | executing-plans | 执行已有计划时 |

---

## /brainstorm

**描述**：在设计前进行需求澄清和创意探索

**触发条件**：
- 创建新功能
- 构建新组件
- 添加新功能
- 修改现有行为

**调用技能**：`superpowers:brainstorming`

**使用示例**：
```bash
/brainstorm "为用户添加个人资料编辑功能"
```

**核心流程**：
1. 理解项目上下文
2. 逐个提出澄清问题（一次一个）
3. 展示设计方案（200-300 字分段）
4. 保存设计文档到 `docs/plans/`
5. 提交设计到版本控制

**注意事项**：
- 必须在写代码前执行
- 每次只提一个问题
- 设计文档必须提交

---

## /write-plan

**描述**：将需求分解为可执行的小任务

**触发条件**：
- 已有清晰的需求或规格
- 需要多步实施的任务
- 需要详细实施计划

**调用技能**：`superpowers:writing-plans`

**使用示例**：
```bash
/write-plan "docs/plans/2024-02-01-user-profile-design.md"
```

**核心流程**：
1. 阅读设计文档或需求规格
2. 分解为 2-5 分钟可完成的任务
3. 为每个任务编写完整代码
4. 包含测试步骤
5. 保存实施计划

**任务分解原则**：
- 每个任务可在 2-5 分钟内完成
- 任务粒度小到"无需上下文"的工程师也能执行
- 每个任务包含实现和验证

**注意事项**：
- 任务必须足够小
- 每个任务必须有验收标准
- 计划文档应清晰易读

---

## /execute-plan

**描述**：批量执行计划中的任务，包含审查检查点

**触发条件**：
- 已有编写好的实施计划
- 需要批量执行任务
- 在独立会话中执行（推荐）

**调用技能**：`superpowers:executing-plans`

**使用示例**：
```bash
/execute-plan "docs/plans/2024-02-01-user-profile-implementation.md"
```

**核心流程**：
1. 读取实施计划
2. 逐个执行任务
3. 每个任务后运行测试
4. 每批任务后设置审查检查点
5. 完成所有任务后验证

**执行策略**：
- 按顺序执行任务
- 每个任务后验证测试
- 每批任务（通常 3-5 个）后进行代码审查
- 失败时停止并调试

**注意事项**：
- 适用于独立会话执行
- 与 subagent-driven-development 的区别在于执行方式
- 必须遵守 TDD 原则

---

## 命令使用建议

### 何时使用命令

**使用命令时**：
- 你清楚知道需要哪个工作流
- 想快速启动标准流程
- 在 Claude Code 中使用

**直接使用技能时**：
- 不确定需要哪个技能
- AI 主动建议使用技能
- 通过 Skill tool 调用

### 命令 vs 技能

| 方面 | 斜杠命令 | 技能调用 |
| --- | --- | --- |
| 调用方式 | 用户主动输入 `/command` | AI 自动调用或通过 Skill tool |
| 适用场景 | 明确知道需要哪个流程 | 让 AI 推荐合适流程 |
| 平台支持 | Claude Code | Claude Code、OpenCode、Codex |

### 典型工作流

**完整开发流程**：
1. `/brainstorm` - 设计需求
2. `/write-plan` - 编写计划
3. `/execute-plan` - 执行实施

**修复 Bug 流程**：
- 直接使用 `systematic-debugging` 技能

**快速原型流程**：
- `/brainstorm` - 快速设计
- 直接实现（跳过详细计划）

---

## 本课小结

本课介绍了 Superpowers 提供的三个斜杠命令：

- `/brainstorm`：创意设计需求澄清
- `/write-plan`：编写详细实施计划
- `/execute-plan`：批量执行计划任务

这些命令在 Claude Code 中提供快速访问核心工作流的便捷方式，适用于你知道需要哪个流程的场景。

## 下一课预告

> 下一课我们学习 **[代理参考](../agents-reference/)**。
>
> 你会学到：
> - 代理系统的概念和用途
> - code-reviewer 代理的详细说明
> - 如何定义和使用自定义代理

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-01

| 命令 | 文件路径 | 行号 |
| --- | --- | --- |
| /brainstorm 命令定义 | [`commands/brainstorm.md`](https://github.com/obra/superpowers/blob/main/commands/brainstorm.md) | 1-7 |
| /write-plan 命令定义 | [`commands/write-plan.md`](https://github.com/obra/superpowers/blob/main/commands/write-plan.md) | 1-7 |
| /execute-plan 命令定义 | [`commands/execute-plan.md`](https://github.com/obra/superpowers/blob/main/commands/execute-plan.md) | 1-7 |

**关键特性**：
- `disable-model-invocation: true`：禁止模型直接调用，确保通过技能系统执行
- 命令文件仅包含指令调用，实际逻辑在对应技能中

**调用链路**：
```
斜杠命令 → 技能系统 (Skill tool) → 对应技能 (SKILL.md) → 执行工作流
```

</details>
