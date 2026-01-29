---
title: "进阶: 高级特性与工作流 | oh-my-opencode"
sidebarTitle: "像团队一样工作"
subtitle: "进阶: 高级特性与工作流"
description: "掌握 oh-my-opencode 的高级特性。学习 AI 代理团队、并行任务、Categories/Skills 系统、生命周期钩子等核心功能，实现高效 AI 工作流编排。"
order: 60
---

# 进阶

本章节深入讲解 oh-my-opencode 的高级特性：专业 AI 代理团队、并行后台任务、Categories 和 Skills 系统、生命周期钩子等。掌握这些功能后，你将能够像管理真实团队一样编排 AI 工作流，实现更高效的开发体验。

## 本章内容

<div class="grid-cards">

### [AI 代理团队：10 位专家介绍](./ai-agents-overview/)

全面介绍 10 个内置代理的功能、使用场景和调用方式。学会根据任务类型选择合适的代理，实现高效团队协作、并行任务执行与深度代码分析。

### [Prometheus 规划：面试式需求收集](./prometheus-planning/)

通过面试模式明确需求并生成工作计划。Prometheus 会持续提问直到需求清晰，并自动咨询 Oracle、Metis、Momus 验证计划质量。

### [后台并行任务：像团队一样工作](./background-tasks/)

深入讲解后台代理管理系统的使用方法。学会并发控制、任务轮询和结果获取，让多个 AI 代理同时处理不同任务，大幅提升工作效率。

### [LSP 与 AST-Grep：代码重构利器](./lsp-ast-tools/)

介绍 LSP 工具和 AST-Grep 工具的使用方法。展示如何实现 IDE 级别的代码分析和操作，包括符号导航、引用查找、结构化代码搜索。

### [Categories 和 Skills：动态代理组合](./categories-skills/)

学会使用 Categories 和 Skills 系统创建专业化的子代理。实现灵活的代理组合，根据任务需求动态分配模型、工具和技能。

### [内置 Skills：浏览器自动化与 Git 专家](./builtin-skills/)

详细介绍三个内置 Skills（playwright、frontend-ui-ux、git-master）的使用场景和最佳实践。快速接入浏览器自动化、前端 UI 设计、Git 操作等专业能力。

### [生命周期钩子：自动化上下文与质量控制](./lifecycle-hooks/)

介绍 32 个生命周期钩子的使用方法。理解如何自动化上下文注入、错误恢复和质量控制，构建完整的 AI 工作流自动化体系。

### [斜杠命令：预设工作流](./slash-commands/)

介绍 6 个内置斜杠命令的使用方法。包括 /ralph-loop（快速修复循环）、/refactor（代码重构）、/start-work（启动项目执行）等常用工作流。

### [配置深度定制：代理与权限管理](./advanced-configuration/)

教会用户深度自定义代理配置、权限设置、模型覆盖和提示词修改。掌握完整配置能力，打造符合团队规范的 AI 工作流。

</div>

## 学习路径

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  第 1 步                  第 2 步                     第 3 步                          第 4 步                  │
│  了解 AI 代理团队    →   掌握规划与并行     →   学会动态代理组合     →   深度定制与自动化       │
│  (基础概念)               (核心能力)                 (高级用法)                   (专家级)                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**建议顺序**：

1. **先学 AI 代理团队**：了解 10 个代理的职责和使用场景，这是理解整个系统的基石。
2. **再学规划与并行任务**：掌握 Prometheus 规划和后台任务系统，这是高效协作的核心。
3. **接着学动态代理组合**：学习 Categories 和 Skills，实现灵活的代理专业化。
4. **最后学深度定制**：掌握生命周期钩子、斜杠命令和配置定制，打造完整工作流。

**进阶路线**：
- 如果你的目标是**快速上手**：重点学习「AI 代理团队」和「斜杠命令」
- 如果你的目标是**团队协作**：深入学习「Prometheus 规划」和「后台并行任务」
- 如果你的目标是**工作流自动化**：学习「生命周期钩子」和「配置深度定制」

## 前置条件

::: warning 开始前请确认
本章内容假设你已完成以下学习：

- ✅ [快速安装与配置](../start/installation/)：已安装 oh-my-opencode 并配置至少一个 Provider
- ✅ [初识 Sisyphus：主编排器](../start/sisyphus-orchestrator/)：了解基本代理调用和委托机制
- ✅ [Provider 配置：Claude、OpenAI、Gemini](../platforms/provider-setup/)：已配置至少一个 AI Provider
:::

## 下一步

完成本章后，建议继续学习：

- **[配置诊断与故障排除](../faq/troubleshooting/)**：遇到问题时快速定位和解决。
- **[配置参考](../appendix/configuration-reference/)：** 查看完整的配置文件 schema，了解所有配置选项。
- **[Claude Code 兼容性](../appendix/claude-code-compatibility/)：** 了解如何将现有 Claude Code 工作流迁移到 oh-my-opencode。
