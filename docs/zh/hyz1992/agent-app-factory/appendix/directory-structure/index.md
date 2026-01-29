---
title: "目录结构详解：Factory 项目完整结构与文件用途 | AI App Factory 教程"
sidebarTitle: "目录结构详解"
subtitle: "目录结构详解：Factory 项目完整指南"
description: "学习 AI App Factory 项目的完整目录结构和各文件用途。本教程详细解释 agents、skills、policies、artifacts 等核心目录的作用和文件功能，帮助你深入理解 Factory 项目的工作原理，快速定位和修改配置文件，以及调试流水线问题。"
tags:
  - "附录"
  - "目录结构"
  - "项目架构"
prerequisite:
  - "start-init-project"
order: 220
---

# 目录结构详解：Factory 项目完整指南

## 学完你能做什么

- ✅ 了解 Factory 项目的完整目录结构
- ✅ 知道每个目录和文件的用途
- ✅ 理解产物（artifacts）的存储方式
- ✅ 掌握配置文件的作用和修改方法

## 核心思路

Factory 项目采用清晰的目录分层结构，将配置、代码、产物和文档分离。理解这些目录结构，有助于你快速定位文件、修改配置和调试问题。

Factory 项目有两种形态：

**形态 1：源码仓库**（你从 GitHub 克隆的）
**形态 2：初始化后的项目**（`factory init` 生成的）

本教程重点讲解**形态 2**——初始化后的 Factory 项目结构，因为这是你日常工作的目录。

---

## Factory 项目完整结构

```
my-app/                          # 你的 Factory 项目根目录
├── .factory/                    # Factory 核心配置目录（不要手动修改）
│   ├── pipeline.yaml             # 流水线定义（7 个阶段）
│   ├── config.yaml               # 项目配置文件（技术栈、MVP 约束等）
│   ├── state.json                # 流水线运行状态（当前阶段、已完成阶段）
│   ├── agents/                   # Agent 定义（AI 助手的任务说明）
│   ├── skills/                   # 技能模块（可复用的知识）
│   ├── policies/                 # 策略文档（权限、失败处理、代码规范）
│   └── templates/                # 配置模板（CI/CD、Git Hooks）
├── .claude/                      # Claude Code 配置目录（自动生成）
│   └── settings.local.json       # Claude Code 权限配置
├── input/                        # 用户输入目录
│   └── idea.md                   # 结构化的产品想法（由 Bootstrap 生成）
└── artifacts/                    # 流水线产物目录（7 个阶段的输出）
    ├── prd/                      # PRD 产物
    │   └── prd.md                # 产品需求文档
    ├── ui/                       # UI 产物
    │   ├── ui.schema.yaml        # UI 结构定义
    │   └── preview.web/          # 可预览的 HTML 原型
    │       └── index.html
    ├── tech/                     # Tech 产物
    │   └── tech.md               # 技术架构文档
    ├── backend/                  # 后端代码（Express + Prisma）
    │   ├── src/                  # 源代码
    │   ├── prisma/               # 数据库配置
    │   │   ├── schema.prisma     # Prisma 数据模型
    │   │   └── seed.ts           # 种子数据
    │   ├── tests/                # 测试
    │   ├── docs/                 # API 文档
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    ├── client/                   # 前端代码（React Native）
    │   ├── src/                  # 源代码
    │   ├── __tests__/            # 测试
    │   ├── app.json
    │   ├── package.json
    │   └── README.md
    ├── validation/               # 验证产物
    │   └── report.md             # 代码质量验证报告
    ├── preview/                  # Preview 产物
    │   ├── README.md             # 部署和运行指南
    │   └── GETTING_STARTED.md    # 快速启动指南
    ├── _failed/                  # 失败产物归档
    │   └── <stage-id>/           # 失败阶段的产物
    └── _untrusted/               # 越权产物隔离
        └── <stage-id>/           # 越权 Agent 写入的文件
```

---

## .factory/ 目录详解

`.factory/` 目录是 Factory 项目的核心，包含了流水线定义、Agent 配置和策略文档。这个目录由 `factory init` 命令自动创建，通常不需要手动修改。

### pipeline.yaml - 流水线定义

**用途**：定义 7 个阶段的执行顺序、输入输出和退出条件。

**关键内容**：
- 7 个阶段：bootstrap、prd、ui、tech、code、validation、preview
- 每个阶段的 Agent、输入文件、输出文件
- 退出条件（exit_criteria）：阶段完成的验证标准

**示例**：
```yaml
stages:
  - id: bootstrap
    description: 初始化项目想法
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs:
      - input/idea.md
    exit_criteria:
      - idea.md 存在
      - idea.md 描述了一个连贯的产品想法
```

**何时修改**：通常不需要修改，除非你要自定义流水线流程。

### config.yaml - 项目配置文件

**用途**：配置技术栈、MVP 约束、UI 偏好等全局设置。

**主要配置项**：
- `preferences`：技术栈偏好（后端语言、数据库、前端框架等）
- `mvp_constraints`：MVP 范围控制（最大页面数、最大模型数等）
- `ui_preferences`：UI 设计偏好（审美方向、颜色方案）
- `pipeline`：流水线行为（检查点模式、失败处理）
- `advanced`：高级选项（Agent 超时、并发控制）

**示例**：
```yaml
preferences:
  backend:
    language: typescript
    framework: express
    database: sqlite
  mvp_constraints:
    max_pages: 3
    enable_auth: false
```

**何时修改**：当你想调整技术栈或改变 MVP 范围时。

### state.json - 流水线状态

**用途**：记录流水线的运行状态，支持断点续传。

**关键内容**：
- `status`：当前状态（idle/running/waiting_for_confirmation/paused/failed）
- `current_stage`：当前执行到的阶段
- `completed_stages`：已完成的阶段列表
- `last_updated`：最后更新时间

**何时修改**：自动更新，不要手动修改。

### agents/ - Agent 定义目录

**用途**：定义每个 Agent 的职责、输入输出和执行约束。

**文件列表**：
| 文件 | 说明 |
|------|------|
| `orchestrator.checkpoint.md` | 调度器核心定义（流水线协调） |
| `orchestrator-implementation.md` | 调度器实现指南（开发参考） |
| `bootstrap.agent.md` | Bootstrap Agent（结构化产品想法） |
| `prd.agent.md` | PRD Agent（生成需求文档） |
| `ui.agent.md` | UI Agent（设计 UI 原型） |
| `tech.agent.md` | Tech Agent（设计技术架构） |
| `code.agent.md` | Code Agent（生成代码） |
| `validation.agent.md` | Validation Agent（验证代码质量） |
| `preview.agent.md` | Preview Agent（生成部署指南） |

**何时修改**：通常不需要修改，除非你要自定义某个 Agent 的行为。

### skills/ - 技能模块目录

**用途**：可复用的知识模块，每个 Agent 会加载对应的 Skill 文件。

**目录结构**：
```
skills/
├── bootstrap/skill.md         # 产品想法结构化
├── prd/skill.md               # PRD 生成
├── ui/skill.md                # UI 设计
├── tech/skill.md              # 技术架构 + 数据库迁移
├── code/skill.md              # 代码生成 + 测试 + 日志
│   └── references/            # 代码生成参考模板
│       ├── backend-template.md   # 生产就绪后端模板
│       └── frontend-template.md  # 生产就绪前端模板
└── preview/skill.md           # 部署配置 + 快速启动指南
```

**何时修改**：通常不需要修改，除非你要扩展某个 Skill 的能力。

### policies/ - 策略文档目录

**用途**：定义权限、失败处理、代码规范等策略。

**文件列表**：
| 文件 | 说明 |
|------|------|
| `capability.matrix.md` | 能力边界矩阵（Agent 读写权限） |
| `failure.policy.md` | 失败处理策略（重试、回滚、人工介入） |
| `context-isolation.md` | 上下文隔离策略（节省 Token） |
| `error-codes.md` | 统一错误码规范 |
| `code-standards.md` | 代码规范（编码风格、文件结构） |
| `pr-template.md` | PR 模板和代码审查清单 |
| `changelog.md` | Changelog 生成规范 |

**何时修改**：通常不需要修改，除非你要调整策略或规范。

### templates/ - 配置模板目录

**用途**：CI/CD、Git Hooks 等配置模板。

**文件列表**：
| 文件 | 说明 |
|------|------|
| `cicd-github-actions.md` | CI/CD 配置（GitHub Actions） |
| `git-hooks-husky.md` | Git Hooks 配置（Husky） |

**何时修改**：通常不需要修改，除非你要自定义 CI/CD 流程。

---

## .claude/ 目录详解

### settings.local.json - Claude Code 权限配置

**用途**：定义 Claude Code 可以访问的目录和操作权限。

**何时生成**：`factory init` 时自动生成。

**何时修改**：通常不需要修改，除非你要调整权限范围。

---

## input/ 目录详解

### idea.md - 结构化的产品想法

**用途**：存储结构化的产品想法，由 Bootstrap Agent 生成。

**生成时机**：Bootstrap 阶段完成后。

**内容结构**：
- 问题定义（Problem）
- 目标用户（Target Users）
- 核心价值（Core Value）
- 假设（Assumptions）
- 非目标（Out of Scope）

**何时修改**：如果你想调整产品方向，可以手动编辑，然后重新运行 Bootstrap 或后续阶段。

---

## artifacts/ 目录详解

`artifacts/` 目录是流水线产物的存放位置，每个阶段会将产物写入对应的子目录。

### prd/ - PRD 产物目录

**产物文件**：
- `prd.md`：产品需求文档

**内容**：
- 用户故事（User Stories）
- 功能列表（Features）
- 非功能需求（Non-functional Requirements）
- 非目标（Out of Scope）

**生成时机**：PRD 阶段完成后。

### ui/ - UI 产物目录

**产物文件**：
- `ui.schema.yaml`：UI 结构定义（页面、组件、交互）
- `preview.web/index.html`：可预览的 HTML 原型

**内容**：
- 页面结构（页面数量、布局）
- 组件定义（按钮、表单、列表等）
- 交互流程（导航、跳转）
- 设计系统（配色、字体、间距）

**生成时机**：UI 阶段完成后。

**预览方式**：在浏览器中打开 `preview.web/index.html`。

### tech/ - Tech 产物目录

**产物文件**：
- `tech.md`：技术架构文档

**内容**：
- 技术栈选择（后端、前端、数据库）
- 数据模型设计
- API 端点设计
- 安全策略
- 性能优化建议

**生成时机**：Tech 阶段完成后。

### backend/ - 后端代码目录

**产物文件**：
```
backend/
├── src/                      # 源代码
│   ├── routes/               # API 路由
│   ├── services/             # 业务逻辑
│   ├── middleware/           # 中间件
│   └── utils/               # 工具函数
├── prisma/                   # Prisma 配置
│   ├── schema.prisma         # Prisma 数据模型
│   └── seed.ts              # 种子数据
├── tests/                    # 测试
│   ├── unit/                 # 单元测试
│   └── integration/          # 集成测试
├── docs/                     # 文档
│   └── api-spec.yaml        # API 规范（Swagger）
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

**内容**：
- Express 后端服务器
- Prisma ORM（SQLite/PostgreSQL）
- Vitest 测试框架
- Swagger API 文档

**生成时机**：Code 阶段完成后。

### client/ - 前端代码目录

**产物文件**：
```
client/
├── src/                      # 源代码
│   ├── screens/              # 页面
│   ├── components/           # 组件
│   ├── navigation/           # 导航配置
│   ├── services/             # API 服务
│   └── utils/               # 工具函数
├── __tests__/               # 测试
│   └── components/          # 组件测试
├── assets/                  # 静态资源
├── app.json                 # Expo 配置
├── package.json
├── tsconfig.json
└── README.md
```

**内容**：
- React Native + Expo
- React Navigation
- Jest + React Testing Library
- TypeScript

**生成时机**：Code 阶段完成后。

### validation/ - 验证产物目录

**产物文件**：
- `report.md`：代码质量验证报告

**内容**：
- 依赖安装验证
- TypeScript 类型检查
- Prisma schema 验证
- 测试覆盖率

**生成时机**：Validation 阶段完成后。

### preview/ - Preview 产物目录

**产物文件**：
- `README.md`：部署和运行指南
- `GETTING_STARTED.md`：快速启动指南

**内容**：
- 本地运行步骤
- Docker 部署配置
- CI/CD 流水线
- 访问地址和演示流程

**生成时机**：Preview 阶段完成后。

### _failed/ - 失败产物归档

**用途**：存放失败阶段的产物，便于调试。

**目录结构**：
```
_failed/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**何时生成**：某个阶段连续失败两次后。

### _untrusted/ - 越权产物隔离

**用途**：存放越权 Agent 写入的文件，防止污染主产物。

**目录结构**：
```
_untrusted/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**何时生成**：Agent 尝试写入未授权目录时。

---

## 常见问题

### 1. 我可以手动修改 .factory/ 下的文件吗？

::: warning 谨慎修改
**不推荐**直接修改 `.factory/` 下的文件，除非你非常清楚自己在做什么。错误的修改可能导致流水线无法正常运行。

如果你需要自定义配置，优先考虑修改 `config.yaml` 文件。
:::

### 2. artifacts/ 下的文件可以手动修改吗？

**可以**。`artifacts/` 下的文件是流水线的输出产物，你可以：

- 修改 `input/idea.md` 或 `artifacts/prd/prd.md` 来调整产品方向
- 手动修复 `artifacts/backend/` 或 `artifacts/client/` 中的代码
- 调整 `artifacts/ui/preview.web/index.html` 中的样式

修改后，可以从相应阶段重新运行流水线。

### 3. _failed/ 和 _untrusted/ 下的文件如何处理？

- **_failed/**：检查失败原因，修复问题后重新运行该阶段。
- **_untrusted/**：确认文件是否应该存在，如果是，将文件移动到正确的目录。

### 4. state.json 文件损坏了怎么办？

如果 `state.json` 损坏，可以运行以下命令重置：

```bash
factory reset
```

### 5. 如何查看流水线的当前状态？

运行以下命令查看当前状态：

```bash
factory status
```

---

## 本课小结

本课我们详细讲解了 Factory 项目的完整目录结构：

- ✅ `.factory/`：Factory 核心配置（pipeline、agents、skills、policies）
- ✅ `.claude/`：Claude Code 权限配置
- ✅ `input/`：用户输入（idea.md）
- ✅ `artifacts/`：流水线产物（prd、ui、tech、backend、client、validation、preview）
- ✅ `_failed/` 和 `_untrusted/`：失败和越权产物归档

理解这些目录结构，有助于你快速定位文件、修改配置和调试问题。

---

## 下一课预告

> 下一课我们学习 **[代码规范](../code-standards/)**。
>
> 你会学到：
> - TypeScript 编码规范
> - 文件结构和命名约定
> - 注释和文档要求
> - Git 提交消息规范
