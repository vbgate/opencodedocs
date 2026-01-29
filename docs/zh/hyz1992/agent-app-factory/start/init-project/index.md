---
title: "Factory 初始化：3 分钟配置目录 | Agent Factory"
sidebarTitle: "3 分钟初始化项目"
subtitle: "初始化 Factory 项目：从零开始的 3 分钟设置"
description: "学习使用 factory init 命令快速初始化 Agent App Factory 项目。教程涵盖目录要求、文件结构、权限配置和 AI 助手启动。"
tags:
  - "项目初始化"
  - "factory init"
  - "目录结构"
prerequisite:
  - "start-installation"
order: 30
---

# 初始化 Factory 项目：从零开始的 3 分钟设置

## 学完你能做什么

- 在任意空目录初始化一个 Factory 项目
- 理解生成的 `.factory/` 目录结构
- 配置项目参数（技术栈、UI 偏好、MVP 约束）
- 自动启动 AI 助手并开始流水线

## 你现在的困境

想试试 AI App Factory，但不知道从哪里开始？看着空荡荡的文件夹，不知道该创建什么文件？或者已经有一些代码，不确定能不能直接用？别担心，`factory init` 命令会帮你搞定一切。

## 什么时候用这一招

- 第一次使用 AI App Factory
- 开始一个新的产品想法
- 需要一个干净的 Factory 项目环境

## 🎒 开始前的准备

::: warning 前置检查

在开始之前，请确认：

- ✅ 已完成 [安装与配置](../installation/)
- ✅ 已安装 AI 助手（Claude Code 或 OpenCode）
- ✅ 有一个**空目录**或只包含 Git/编辑器配置的目录

:::

## 核心思路

`factory init` 命令的核心是**自包含**：

1. 将所有必要的文件（agents、skills、policies、pipeline.yaml）复制到项目的 `.factory/` 目录
2. 生成项目配置文件（`config.yaml` 和 `state.json`）
3. 配置 Claude Code 权限（`.claude/settings.local.json`）
4. 自动安装必需插件（superpowers、ui-ux-pro-max）
5. 启动 AI 助手，开始流水线

这样，每个 Factory 项目都包含运行所需的一切，不依赖全局安装。

::: tip 为什么是自包含？

自包含设计带来的好处：

- **版本隔离**：不同项目可以使用不同版本的 Factory 配置
- **可移植**：可以直接把 `.factory/` 目录提交到 Git，团队成员可以复用
- **安全**：权限配置只在项目目录内生效，不会影响其他项目

:::

## 跟我做

### 第 1 步：进入项目目录

**为什么**：需要一个干净的工作目录来存放生成的应用。

```bash
# 创建新目录
mkdir my-app && cd my-app

# 或者进入已有的空目录
cd /path/to/your/project
```

**你应该看到**：目录为空，或只包含 `.git/`、`.gitignore`、`README.md` 等允许的文件。

### 第 2 步：运行初始化命令

**为什么**：`factory init` 会创建 `.factory/` 目录并复制所有必要文件。

```bash
factory init
```

**你应该看到**：

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
  .factory/
    agents/
    skills/
    templates/
    policies/
    pipeline.yaml
    config.yaml
    state.json

Checking and installing required Claude plugins...
Installing superpowers plugin... ✓
Installing ui-ux-pro-max-skill plugin... ✓
Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

### 第 3 步：使用可选参数自定义（可选）

**为什么**：如果你有明确的技术栈偏好，可以在初始化时指定。

```bash
factory init --name "我的记账应用" --description "帮助年轻人记录日常支出"
```

这些参数会写入 `config.yaml`，影响后续生成的代码。

### 第 4 步：验证生成的目录结构

**为什么**：确认所有文件都已正确生成。

```bash
ls -la
```

**你应该看到**：

```
.claude/              # Claude Code 配置目录
  └── settings.local.json   # 权限配置

.factory/            # Factory 核心目录
  ├── agents/          # Agent 定义文件
  ├── skills/          # 技能模块
  ├── templates/       # 配置模板
  ├── policies/        # 策略和规范
  ├── pipeline.yaml    # 流水线定义
  ├── config.yaml      # 项目配置
  └── state.json      # 流水线状态
```

## 检查点 ✅

确保以下文件都已创建：

- [ ] `.factory/pipeline.yaml` 存在
- [ ] `.factory/config.yaml` 存在
- [ ] `.factory/state.json` 存在
- [ ] `.claude/settings.local.json` 存在
- [ ] `.factory/agents/` 目录包含 8 个 `.agent.md` 文件
- [ ] `.factory/skills/` 目录包含 6 个技能模块
- [ ] `.factory/policies/` 目录包含 7 个策略文档

## 生成文件详解

### config.yaml：项目配置

`config.yaml` 控制生成应用的技术栈和偏好设置：

```yaml
# 技术栈偏好
preferences:
  backend:
    language: typescript
    framework: express
    database: sqlite
    orm: prisma
  
  frontend:
    platform: react-native
    state_management: context
    styling: stylesheet

# MVP 约束
mvp_constraints:
  max_pages: 3
  max_models: 10
  enable_auth: false

# UI 设计偏好
ui_preferences:
  aesthetic: minimalism
  color_scheme:
    mode: auto
    primary_hue: blue
```

::: tip 修改配置

可以在 `factory init` 后直接编辑 `config.yaml`，然后在流水线运行时自动生效。不需要重新初始化。

:::

### state.json：流水线状态

`state.json` 记录流水线的执行进度：

```json
{
  "version": 1,
  "status": "idle",
  "current_stage": null,
  "completed_stages": [],
  "started_at": null,
  "last_updated": "2026-01-29T13:00:00.000Z"
}
```

- `status`：当前状态（idle、running、waiting_for_confirmation、paused、failed）
- `current_stage`：正在执行的阶段
- `completed_stages`：已完成的阶段列表

::: warning 不要手动编辑

`state.json` 由流水线自动维护，手动编辑可能导致状态不一致。如需重置，使用 `factory reset` 命令。

:::

### pipeline.yaml：流水线定义

定义了 7 个阶段的执行顺序和依赖关系：

```yaml
stages:
  - id: bootstrap
    description: 初始化项目想法
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs: [input/idea.md]

  - id: prd
    description: 生成产品需求文档
    agent: agents/prd.agent.md
    inputs: [input/idea.md]
    outputs: [artifacts/prd/prd.md]

  # ... 其他阶段
```

::: info 流水线顺序

流水线严格按顺序执行，不可跳过。每个阶段完成后会暂停等待确认。

:::

### .claude/settings.local.json：权限配置

自动生成的 Claude Code 权限配置，包含：

- **文件操作权限**：Read/Write/Glob/Edit 对项目目录
- **Bash 命令权限**：git、npm、npx、docker 等
- **Skills 权限**：superpowers、ui-ux-pro-max 等必需技能
- **WebFetch 权限**：允许访问特定域名（GitHub、NPM 等）

::: danger 安全性

权限配置只针对当前项目目录，不会影响系统其他位置。这是 Factory 的安全设计之一。

:::

## 踩坑提醒

### 目录非空错误

**错误信息**：

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

**原因**：目录中存在不兼容的文件或目录（如 `artifacts/`、`input/` 等）

**解决方法**：

1. 清理冲突文件：
   ```bash
   rm -rf artifacts/ input/
   ```

2. 或使用新目录：
   ```bash
   mkdir my-app-new && cd my-app-new
   factory init
   ```

### 已是 Factory 项目

**错误信息**：

```
This directory is already a Factory project:
  Name: my-app
  Created: 2026-01-29T13:00:00.000Z

To reset project, use: factory reset
```

**原因**：`.factory/` 目录已存在

**解决方法**：

```bash
# 重置项目状态（保留产物）
factory reset

# 或完全重新初始化（删除所有内容）
rm -rf .factory/
factory init
```

### Claude Code 未安装

**错误信息**：

```
Claude CLI not found - skipping plugin installation
Install Claude Code to enable plugins: https://claude.ai/code
```

**原因**：未安装 Claude Code CLI

**解决方法**：

1. 安装 Claude Code：https://claude.ai/code
2. 或手动运行流水线（参考[快速开始](../getting-started/)）

### 插件安装失败

**错误信息**：

```
Installing superpowers plugin... (failed)
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

**原因**：网络问题或 Claude Code 配置问题

**解决方法**：

忽略警告，继续使用。Bootstrap 阶段会提示你手动安装插件。

## 本课小结

本课你学会了：

1. ✅ 使用 `factory init` 命令初始化 Factory 项目
2. ✅ 理解生成的 `.factory/` 目录结构
3. ✅ 了解 `config.yaml` 的配置项
4. ✅ 理解 `state.json` 的状态管理
5. ✅ 知道 `.claude/settings.local.json` 的权限配置

初始化完成后，项目已经准备好运行流水线了。下一步，我们学习[流水线概览](../pipeline-overview/)，了解从想法到应用的完整流程。

## 下一课预告

> 下一课我们学习 **[流水线概览](../pipeline-overview/)**。
>
> 你会学到：
> - 7 个阶段的顺序和依赖关系
> - 每个阶段的输入和输出
> - 检查点机制如何保证质量
> - 失败处理和重试策略

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-29

| 功能        | 文件路径                                                                                    | 行号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| init 主逻辑 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 220-456  |
| 目录安全检查 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 32-53    |
| 配置生成    | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)         | 58-76    |
| Claude 权限配置 | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 41-248   |
| 流水线定义  | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)               | 7-111    |
| 项目配置模板 | [`config.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/config.yaml)                   | 1-102    |

**关键函数**：
- `isFactoryProject()`：检查目录是否已是 Factory 项目（第 22-26 行）
- `isDirectorySafeToInit()`：检查目录是否可以安全初始化（第 32-53 行）
- `generateConfig()`：生成项目配置（第 58-76 行）
- `generateClaudeSettings()`：生成 Claude Code 权限配置（第 256-275 行）

</details>
