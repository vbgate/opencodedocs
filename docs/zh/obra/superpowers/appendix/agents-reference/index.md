---
title: "Superpowers 代理参考：code-reviewer 触发条件与六个审查维度完整使用指南 | 教程"
sidebarTitle: "代理参考"
subtitle: "代理参考"
description: "学习 Superpowers 代理系统的完整参考。本文详细介绍 code-reviewer 代理的触发条件、六个审查维度（计划对齐分析、代码质量评估、架构设计评审、文档和标准检查、问题识别建议、沟通协议）和最佳实践。掌握如何高效使用代码审查代理提升项目质量和开发效率，确保代码符合设计规范和最佳实践。"
tags:
  - "参考"
  - "代理"
  - "代码审查"
prerequisite:
  - "start-using-skills"
order: 280
---

# 代理参考

Superpowers 通过代理系统为特定任务提供专业化的 AI 能力。每个代理都有明确的触发条件、审查标准和工作流程。

## 概述

代理与技能的区别：

| 特性     | 技能 (Skills)               | 代理 (Agents)              |
| -------- | --------------------------- | -------------------------- |
| 定义方式 | Markdown 文件（SKILL.md）  | Agent 定义文件（.md）      |
| 调用方式 | 通过 Skill tool 加载        | 通过 @mention 或 skill 调用 |
| 适用场景 | 通用工作流程和最佳实践      | 特定任务的专业化执行       |
| 数量     | 14 个                       | 1 个（code-reviewer）     |

## code-reviewer 代理

### 基本信息

| 项目     | 内容                                   |
| -------- | -------------------------------------- |
| **名称** | code-reviewer                          |
| **类型** | Senior Code Reviewer                   |
| **领域** | 代码审查、架构评审、质量保证           |
| **模型** | inherit（继承当前会话的模型）          |
| **定义文件** | `agents/code-reviewer.md`             |

### 触发条件

当满足以下任一条件时，应调用 code-reviewer 代理：

1. **完成主要项目步骤**：逻辑代码块编写完成，需要验证是否符合原计划
2. **完成功能实现**：重要功能实现完毕，需要对照架构文档或规划文档进行审查
3. **完成计划步骤**：规划文档中的某个编号步骤已完成

::: info 示例场景

**场景 1**：用户完成了一个主要系统模块
```
用户输入：
"I've finished implementing the user authentication system as outlined in step 3 of our plan"

AI 回应：
"Great work! Now let me use the code-reviewer agent to review the implementation against our plan and coding standards"
```

**场景 2**：用户完成了一个功能模块
```
用户输入：
"The API endpoints for the task management system are now complete - that covers step 2 from our architecture document"

AI 回应：
"Excellent! Let me have the code-reviewer agent examine this implementation to ensure it aligns with our plan and follows best practices"
```

:::

### 审查维度

code-reviewer 代理会从以下六个维度进行审查：

#### 1. 计划对齐分析

- ✅ 将实现与原始规划文档或步骤描述进行对比
- ✅ 识别偏离计划的实现方式、架构或需求
- ✅ 评估偏离是否是合理的改进或有害的偏离
- ✅ 验证所有计划功能已实现

#### 2. 代码质量评估

- ✅ 审查代码是否遵循既定的模式和约定
- ✅ 检查错误处理、类型安全和防御性编程
- ✅ 评估代码组织、命名约定和可维护性
- ✅ 评估测试覆盖率和测试实现质量
- ✅ 查找潜在的安全漏洞或性能问题

#### 3. 架构和设计评审

- ✅ 确保实现遵循 SOLID 原则和既定架构模式
- ✅ 检查职责分离和松耦合
- ✅ 验证代码与现有系统的集成
- ✅ 评估可扩展性和可扩展性考虑

#### 4. 文档和标准

- ✅ 验证代码包含适当的注释和文档
- ✅ 检查文件头、函数文档和内联注释是否存在且准确
- ✅ 确保遵循项目特定的编码标准和约定

#### 5. 问题识别和建议

- ✅ 将问题清晰分类为：Critical（必须修复）、Important（应该修复）或 Suggestions（建议改进）
- ✅ 对每个问题提供具体示例和可操作的建议
- ✅ 识别计划偏离时，说明是有害的还是有益的
- ✅ 提出具体改进建议，并在有帮助时提供代码示例

#### 6. 沟通协议

- ✅ 如果发现与计划的重大偏离，要求编码代理审查并确认更改
- ✅ 如果发现原始计划本身的问题，建议更新计划
- ✅ 对于实现问题，提供明确的修复指导
- ✅ 在突出显示问题之前，始终先承认做得好的地方

### 输出格式要求

code-reviewer 代理的输出应：

1. **结构化**：按问题分类清晰组织
2. **可操作**：每个问题都有具体建议和示例
3. **建设性**：既指出问题也肯定优点
4. **简洁**：全面但不冗长
5. **有帮助**：帮助改进当前实现和未来开发实践

### 最佳实践

::: tip 使用建议

1. **及时调用**：在完成主要步骤后立即调用，避免问题累积
2. **具体反馈**：避免模糊的评价，提供代码行号和示例
3. **平衡反馈**：既要指出问题，也要肯定优点
4. **可操作建议**：每个建议都应该能直接转化为行动
5. **尊重计划**：偏离计划时解释原因和影响

:::

## 未来扩展

当前 Superpowers 仅包含 code-reviewer 代理，未来可能增加的代理类型：

| 代理类型 | 潜在用途                                   |
| -------- | ------------------------------------------ |
| test-writer | 专门生成测试用例的代理                    |
| debugger | 专注于系统化调试的代理                    |
| security-auditor | 安全审计专用代理                          |
| performance-optimizer | 性能优化专项代理                          |
| documentation-writer | 文档生成和维护的代理                      |

## 相关技能

代理系统与以下技能协同工作：

| 技能名称                     | 与代理的关系           |
| ---------------------------- | ---------------------- |
| requesting-code-review        | 调用 code-reviewer 代理 |
| receiving-code-review         | 接收代理审查反馈       |
| subagent-driven-development   | 在子代理开发中使用代理  |

## 附录：代理定义文件结构

代理定义文件使用 YAML frontmatter 配置基本属性：

```yaml
---
name: <代理名称>
description: |
  代理的详细描述，包括触发条件和使用示例
model: inherit | <模型名称>
---

[代理的详细角色定义和工作流程]
```

**字段说明**：

| 字段   | 类型   | 必填 | 说明                       |
| ------ | ------ | ---- | -------------------------- |
| name   | string | Y    | 代理唯一标识符（kebab-case） |
| description | string | Y    | 代理的用途和触发条件描述     |
| model  | string | N    | 使用的模型，inherit 表示继承当前会话模型 |

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-01

| 功能        | 文件路径                                                                                              | 行号    |
| ----------- | ----------------------------------------------------------------------------------------------------- | ------- |
| code-reviewer 代理定义 | [`agents/code-reviewer.md`](https://github.com/obra/superpowers/blob/main/agents/code-reviewer.md) | 1-49    |

**关键配置**：
- `name: code-reviewer`：代理唯一标识符
- `model: inherit`：继承当前会话模型
- `description`：包含触发条件和使用示例

**审查维度**：
- Plan Alignment Analysis（计划对齐分析）
- Code Quality Assessment（代码质量评估）
- Architecture and Design Review（架构和设计评审）
- Documentation and Standards（文档和标准）
- Issue Identification and Recommendations（问题识别和建议）
- Communication Protocol（沟通协议）

</details>
