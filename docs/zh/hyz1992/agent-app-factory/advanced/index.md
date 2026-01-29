---
title: "进阶：流水线与内部机制 | AI App Factory 教程"
sidebarTitle: "进阶：流水线"
subtitle: "进阶：流水线与内部机制"
description: "深入了解 AI App Factory 的 7 阶段流水线、Sisyphus 调度器、权限安全机制和失败处理策略。掌握上下文优化与高级配置技巧。"
tags:
  - "流水线"
  - "调度器"
  - "权限安全"
  - "失败处理"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# 进阶：流水线与内部机制

本章节深入讲解 AI App Factory 的核心机制和高级功能，包括 7 阶段流水线的详细工作原理、Sisyphus 调度器的调度策略、权限与安全机制、失败处理策略，以及如何通过上下文优化节省 Token 成本。

::: warning 前置条件
学习本章节前，请确保已完成：
- [快速开始](../../start/getting-started/) 和 [安装配置](../../start/installation/)
- [7 阶段流水线概览](../../start/pipeline-overview/)
- [平台集成](../../platforms/claude-code/) 配置
:::

## 章节内容

本章节包含以下主题：

### 7 阶段流水线详解

- **[阶段 1：Bootstrap - 结构化产品想法](stage-bootstrap/)**
  - 学习如何将模糊的产品想法转化为结构化文档
  - 理解 Bootstrap Agent 的输入输出格式

- **[阶段 2：PRD - 生成产品需求文档](stage-prd/)**
  - 生成 MVP 级 PRD，包含用户故事、功能列表和非目标
  - 掌握需求分解和优先级排序技巧

- **[阶段 3：UI - 设计界面与原型](stage-ui/)**
  - 使用 ui-ux-pro-max 技能设计 UI 结构和可预览原型
  - 理解界面设计流程和最佳实践

- **[阶段 4：Tech - 设计技术架构](stage-tech/)**
  - 设计最小可行的技术架构和 Prisma 数据模型
  - 掌握技术选型和架构设计原则

- **[阶段 5：Code - 生成可运行代码](stage-code/)**
  - 根据 UI Schema 和 Tech 设计生成前后端代码、测试和配置
  - 理解代码生成流程和模板系统

- **[阶段 6：Validation - 验证代码质量](stage-validation/)**
  - 验证依赖安装、类型检查、Prisma schema 和代码质量
  - 掌握自动化质量检查流程

- **[阶段 7：Preview - 生成部署指南](stage-preview/)**
  - 生成完整的运行说明文档和部署配置
  - 学习 CI/CD 集成和 Git Hooks 配置

### 内部机制

- **[Sisyphus 调度器详解](orchestrator/)**
  - 理解调度器如何协调流水线、管理状态和执行权限检查
  - 掌握调度策略和状态机原理

- **[上下文优化：分会话执行](context-optimization/)**
  - 学习如何使用 `factory continue` 命令节省 Token
  - 掌握在每个阶段新建会话的最佳实践

- **[权限与安全机制](security-permissions/)**
  - 理解能力边界矩阵、越权处理和安全检查机制
  - 掌握安全配置和权限管理

- **[失败处理与回滚](failure-handling/)**
  - 学习失败识别、重试机制、回滚策略和人工介入流程
  - 掌握故障排查和恢复技巧

## 学习路径建议

### 推荐学习顺序

1. **先学完 7 阶段流水线**（按顺序）
   - Bootstrap → PRD → UI → Tech → Code → Validation → Preview
   - 每个阶段都有明确的输入输出，按顺序学习能建立完整的认知

2. **再学习调度器和上下文优化**
   - 理解 Sisyphus 如何协调这 7 个阶段
   - 学习如何优化上下文以节省 Token 成本

3. **最后学习安全与失败处理**
   - 掌握权限边界和安全机制
   - 了解失败场景和应对策略

### 不同角色的学习重点

| 角色 | 重点学习章节 |
| ---- | ------------ |
| **开发者** | Code、Validation、Tech、Orchestrator |
| **产品经理** | Bootstrap、PRD、UI、Preview |
| **技术负责人** | Tech、Code、Security、Failure Handling |
| **DevOps 工程师** | Validation、Preview、Context Optimization |

## 下一步

完成本章节后，你可以继续学习：

- **[常见问题与故障排除](../../faq/troubleshooting/)** - 解决实际使用中的问题
- **[最佳实践](../../faq/best-practices/)** - 掌握高效使用 Factory 的技巧
- **[CLI 命令参考](../../appendix/cli-commands/)** - 查看完整的命令列表
- **[代码规范](../../appendix/code-standards/)** - 了解生成的代码应遵循的规范

---

💡 **提示**：如果在使用过程中遇到问题，请先查看 [常见问题与故障排除](../../faq/troubleshooting/) 章节。
