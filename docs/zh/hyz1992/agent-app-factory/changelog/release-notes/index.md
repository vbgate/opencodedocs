---
title: "更新日志：版本历史和功能变更 | Agent App Factory"
sidebarTitle: "更新日志"
subtitle: "更新日志：版本历史和功能变更 | Agent App Factory"
description: "了解 Agent App Factory 的版本更新历史、功能变更、bug 修复和重大改进。本页面详细记录从 1.0.0 版本开始的完整变更历史，包括 7 阶段流水线系统、Sisyphus 调度器、权限管理、上下文优化和失败处理策略等核心功能和改进。"
tags:
  - "更新日志"
  - "版本历史"
prerequisite: []
order: 250
---

# 更日志

本页面记录 Agent App Factory 的版本更新历史，包括新增功能、改进、bug 修复和破坏性变更。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 规范，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2024-01-29

### 新增

**核心功能**
- **7 阶段流水线系统**：从想法到可运行应用的完整自动化流程
  - Bootstrap - 结构化产品想法（input/idea.md）
  - PRD - 生成产品需求文档（artifacts/prd/prd.md）
  - UI - 设计 UI 结构和可预览原型（artifacts/ui/）
  - Tech - 设计技术架构和 Prisma 数据模型（artifacts/tech/）
  - Code - 生成前后端代码（artifacts/backend/, artifacts/client/）
  - Validation - 验证代码质量（artifacts/validation/report.md）
  - Preview - 生成部署指南（artifacts/preview/README.md）

- **Sisyphus 调度器**：流水线核心控制组件
  - 按顺序执行 pipeline.yaml 定义的各个 Stage
  - 验证每个阶段的输入/输出和退出条件
  - 维护流水线状态（.factory/state.json）
  - 执行权限检查，防止 Agent 越权读写
  - 根据失败策略处理异常情况
  - 在每个检查点暂停，等待人工确认后继续

**CLI 工具**
- `factory init` - 初始化 Factory 项目
- `factory run [stage]` - 运行流水线（从当前或指定阶段）
- `factory continue` - 在新会话中继续执行（节省 Token）
- `factory status` - 查看当前项目状态
- `factory list` - 列出所有 Factory 项目
- `factory reset` - 重置当前项目状态

**权限与安全**
- **能力边界矩阵**（capability.matrix.md）：定义每个 Agent 严格的读写权限
  - 每个 Agent 只能访问授权目录
  - 越权写入文件移至 artifacts/_untrusted/
  - 失败后自动暂停流水线，等待人工介入

**上下文优化**
- **分会话执行**：每个阶段在新会话中执行
  - 避免上下文累积，节省 Token
  - 支持中断恢复
  - 适用于所有 AI 助手（Claude Code、OpenCode、Cursor）

**失败处理策略**
- 自动重试机制：每个阶段允许重试一次
- 失败归档：失败的产物移至 artifacts/_failed/
- 回滚机制：回滚到最近成功检查点
- 人工介入：连续失败两次后暂停

**质量保证**
- **代码规范**（code-standards.md）
  - TypeScript 编码规范和最佳实践
  - 文件结构和命名约定
  - 注释和文档要求
  - Git 提交消息规范（Conventional Commits）

- **错误码规范**（error-codes.md）
  - 统一错误码结构：[MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - 标准错误类型：VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - 前后端错误码映射和用户友好提示

**Changelog 管理**
- 遵循 Keep a Changelog 格式
- 与 Conventional Commits 集成
- 自动化工具支持：conventional-changelog-cli, release-it

**配置模板**
- CI/CD 配置（GitHub Actions）
- Git Hooks 配置（Husky）

**生成的应用特性**
- 完整的前后端代码（Express + Prisma + React Native）
- 单元测试和集成测试（Vitest + Jest）
- API 文档（Swagger/OpenAPI）
- 数据库种子数据
- Docker 部署配置
- 错误处理和日志监控
- 性能优化和安全检查

### 改进

**MVP 聚焦**
- 明确列出非目标（Non-Goals），防止范围蔓延
- 页面数量限制在 3 页以内
- 专注核心功能，避免过度设计

**职责分离**
- 每个 Agent 只负责自己的领域，不越界
- PRD 不包含技术细节，Tech 不涉及 UI 设计
- Code Agent 严格按照 UI Schema 和 Tech 设计实现

**可验证性**
- 每个阶段定义明确的 exit_criteria
- 所有功能可测试、可本地运行
- 产物必须结构化、可被下游消费

### 技术栈

**CLI 工具**
- Node.js >= 16.0.0
- Commander.js - 命令行框架
- Chalk - 彩色终端输出
- Ora - 进度指示器
- Inquirer - 交互式命令行
- fs-extra - 文件系统操作
- YAML - YAML 解析

**生成的应用**
- 后端：Node.js + Express + Prisma + TypeScript + Vitest
- 前端：React Native + Expo + TypeScript + Jest + React Testing Library
- 部署：Docker + GitHub Actions

### 依赖

- `chalk@^4.1.2` - 终端颜色样式
- `commander@^11.0.0` - 命令行参数解析
- `fs-extra@^11.1.1` - 文件系统扩展
- `inquirer@^8.2.5` - 交互式命令行
- `ora@^5.4.1` - 优雅的终端加载器
- `yaml@^2.3.4` - YAML 解析和序列化

## 版本说明

### Semantic Versioning

本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 版本号格式：MAJOR.MINOR.PATCH

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向后兼容的新增功能
- **PATCH**：向后兼容的 bug 修复

### 变更类型

- **新增**（Added）：新功能
- **变更**（Changed）：现有功能的变更
- **弃用**（Deprecated）：即将移除的功能
- **移除**（Removed）：已移除的功能
- **修复**（Fixed）：bug 修复
- **安全**（Security）：安全修复

## 相关资源

- [GitHub Releases](https://github.com/hyz1992/agent-app-factory/releases) - 官方发布页面
- [项目仓库](https://github.com/hyz1992/agent-app-factory) - 源代码
- [问题追踪](https://github.com/hyz1992/agent-app-factory/issues) - 反馈问题和建议
- [贡献指南](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - 如何贡献

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2024-01-29

| 功能        | 文件路径                                                                                                                               | 行号    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json)                                                  | 1-52    |
| CLI 入口     | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)                                        | 1-123   |
| 初始化命令   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)                                  | 1-427   |
| 运行命令     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js)                                     | 1-294   |
| 继续命令     | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js)                            | 1-87    |
| 流水线定义   | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)                                               | 1-87    |
| 调度器定义   | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md)          | 1-301   |
| 权限矩阵     | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md)                  | 1-44    |
| 失败策略     | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md)                        | 1-200   |
| 代码规范     | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md)                        | 1-287   |
| 错误码规范   | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md)                              | 1-134   |
| Changelog 规范 | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md)                                  | 1-87    |

**关键版本信息**：
- `version = "1.0.0"`：初始发布版本
- `engines.node = ">=16.0.0"`：最低 Node.js 版本要求

**依赖版本**：
- `chalk@^4.1.2`：终端颜色样式
- `commander@^11.0.0`：命令行参数解析
- `fs-extra@^11.1.1`：文件系统扩展
- `inquirer@^8.2.5`：交互式命令行
- `ora@^5.4.1`：优雅的终端加载器
- `yaml@^2.3.4`：YAML 解析和序列化

</details>
