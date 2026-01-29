---
title: "CLI 命令参考：完整命令列表与参数 | Agent App Factory 教程"
sidebarTitle: "CLI 命令大全"
subtitle: "CLI 命令参考：完整命令列表与参数说明"
description: "Agent App Factory CLI 命令完整参考，包含 init、run、continue、status、list、reset 六个命令的参数说明和使用示例，帮助你快速掌握命令行工具。"
tags:
  - "CLI"
  - "命令行"
  - "参考"
order: 210
---

# CLI 命令参考：完整命令列表与参数说明

本章节提供 Agent App Factory CLI 工具的完整命令参考。

## 命令概览

| 命令 | 功能 | 使用场景 |
| ----- | ---- | ---- |
| `factory init` | 初始化 Factory 项目 | 开始新项目 |
| `factory run [stage]` | 运行流水线 | 执行或继续流水线 |
| `factory continue` | 新会话继续 | 节省 Token，分会话执行 |
| `factory status` | 查看项目状态 | 了解当前进度 |
| `factory list` | 列出所有项目 | 管理多个项目 |
| `factory reset` | 重置项目状态 | 重新开始流水线 |

---

## factory init

初始化当前目录为 Factory 项目。

### 语法

```bash
factory init [options]
```

### 参数

| 参数 | 简写 | 类型 | 必填 | 说明 |
| ---- | ----- | ---- | ---- | ---- |
| `--name` | `-n` | string | 否 | 项目名称 |
| `--description` | `-d` | string | 否 | 项目描述 |

### 功能说明

执行 `factory init` 命令后，会：

1. 检查目录安全性（仅允许 `.git`、`.gitignore`、`README.md` 等配置文件）
2. 创建 `.factory/` 目录
3. 复制以下文件到 `.factory/`：
   - `agents/` - Agent 定义文件
   - `skills/` - 技能模块
   - `policies/` - 策略文档
   - `templates/` - 配置模板
   - `pipeline.yaml` - 流水线定义
4. 生成 `config.yaml` 和 `state.json`
5. 生成 `.claude/settings.local.json`（Claude Code 权限配置）
6. 尝试安装必需插件：
   - superpowers（Bootstrap 阶段需要）
   - ui-ux-pro-max-skill（UI 阶段需要）
7. 自动启动 AI 助手（Claude Code 或 OpenCode）

### 示例

**初始化项目并指定名称和描述**：

```bash
factory init --name "Todo App" --description "一个简单的待办事项应用"
```

**在当前目录初始化项目**：

```bash
factory init
```

### 注意事项

- 目录必须为空或仅包含配置文件（`.git`、`.gitignore`、`README.md`）
- 如果已存在 `.factory/` 目录，会提示使用 `factory reset` 重置

---

## factory run

运行流水线，从当前阶段或指定阶段开始。

### 语法

```bash
factory run [stage] [options]
```

### 参数

| 参数 | 简写 | 类型 | 必填 | 说明 |
| ---- | ----- | ---- | ---- | ---- |
| `stage` | - | string | 否 | 流水线阶段名称（bootstrap/prd/ui/tech/code/validation/preview） |

### 选项

| 选项 | 简写 | 类型 | 说明 |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | 跳过确认提示 |

### 功能说明

执行 `factory run` 命令后，会：

1. 检查是否为 Factory 项目
2. 读取 `config.yaml` 和 `state.json`
3. 显示当前流水线状态
4. 确定目标阶段（参数指定或当前阶段）
5. 检测 AI 助手类型（Claude Code / Cursor / OpenCode）
6. 生成对应助手的执行指令
7. 显示可用阶段列表和进度

### 示例

**从 bootstrap 阶段开始运行流水线**：

```bash
factory run bootstrap
```

**从当前阶段继续运行**：

```bash
factory run
``**跳过确认直接运行**：

```bash
factory run bootstrap --force
```

### 输出示例

```
Agent Factory - Pipeline Runner

Pipeline Status:
────────────────────────────────────────
Project: Todo App
Status: Running
Current Stage: bootstrap
Completed: 

🤖 Claude Code Instructions:
──────────────────────────
This is an Agent Factory project. To execute the pipeline:

1. Read pipeline definition:
   Read(/path/to/.factory/pipeline.yaml)

2. Read orchestrator agent:
   Read(/path/to/.factory/agents/orchestrator.checkpoint.md)

3. Read project config:
   Read(/path/to/.factory/config.yaml)

Then execute the pipeline starting from: bootstrap

────────────────────────────────────────
Available stages:
  ○ bootstrap
  ○ prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

────────────────────────────────────────
Ready! Follow instructions above to continue.
```

---

## factory continue

新建会话继续执行流水线，节省 Token。

### 语法

```bash
factory continue
```

### 功能说明

执行 `factory continue` 命令后，会：

1. 检查是否为 Factory 项目
2. 读取 `state.json` 获取当前状态
3. 重新生成 Claude Code 权限配置
4. 启动新的 Claude Code 窗口
5. 从当前阶段继续执行

### 使用场景

- 每个阶段完成后，避免 Token 累积
- 每个阶段独享干净上下文
- 支持中断恢复

### 示例

**继续执行流水线**：

```bash
factory continue
```

### 注意事项

- 需要安装 Claude Code
- 会自动启动新的 Claude Code 窗口

---

## factory status

显示当前 Factory 项目的详细状态。

### 语法

```bash
factory status
```

### 功能说明

执行 `factory status` 命令后，会显示：

- 项目名称、描述、路径、创建时间
- 流水线状态（idle/running/waiting_for_confirmation/paused/failed/completed）
- 当前阶段
- 已完成的阶段列表
- 各阶段进度
- 输入文件状态（input/idea.md）
- 产物目录状态（artifacts/）
- 产物文件数量和大小

### 示例

```bash
factory status
```

### 输出示例

```
Agent Factory - Project Status

Project:
  Name: Todo App
  Description: 一个简单的待办事项应用
  Path: /Users/user/Projects/todo-app
  Created: 2026-01-29T10:00:00.000Z

Pipeline:
  Status: Running
  Current Stage: prd
  Completed: bootstrap

Progress:
  ✓ bootstrap
  → prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

Input:
  File: input/idea.md
  Lines: 25
  Preview:
    # Todo App

    一个简单的待办事项应用...

Artifacts:
  ✓ prd (3 files, 12.5 KB)

────────────────────────────────────────
Commands:
  factory run     - Run pipeline
  factory run <stage> - Run from stage
  factory reset  - Reset pipeline state
```

---

## factory list

列出所有 Factory 项目。

### 语法

```bash
factory list
```

### 功能说明

执行 `factory list` 命令后，会：

1. 搜索常见项目目录（`~/Projects`、`~/Desktop`、`~/Documents`、`~`）
2. 搜索当前目录及其上级目录（最多 3 层）
3. 列出所有包含 `.factory/` 目录的项目
4. 显示项目状态（按运行中、等待中、失败、完成排序）

### 示例

```bash
factory list
```

### 输出示例

```
Agent Factory - Projects

Found 2 project(s):

◉ Todo App
  一个简单的待办事项应用
  Path: /Users/user/Projects/todo-app
  Stage: prd

○ Blog System
  博客系统
  Path: /Users/user/Projects/blog
  Completed: bootstrap

────────────────────────────────────────
Work on a project: cd <path> && factory run
```

---

## factory reset

重置当前项目的流水线状态，保留产物。

### 语法

```bash
factory reset [options]
```

### 选项

| 选项 | 简写 | 类型 | 说明 |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | 跳过确认 |

### 功能说明

执行 `factory reset` 命令后，会：

1. 检查是否为 Factory 项目
2. 显示当前状态
3. 确认重置（除非使用 `--force`）
4. 重置 `state.json` 为初始状态
5. 更新 `config.yaml` 的 pipeline 部分
6. 保留所有 `artifacts/` 产物

### 使用场景

- 重新从 bootstrap 阶段开始
- 清除状态错误
- 重新配置流水线

### 示例

**重置项目状态**：

```bash
factory reset
```

**跳过确认直接重置**：

```bash
factory reset --force
```

### 注意事项

- 仅重置流水线状态，产物不会被删除
- 如果要完全删除项目，需要手动删除 `.factory/` 和 `artifacts/` 目录

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-29

| 命令 | 文件路径 | 行号 |
| ----- | --------- | ---- |
| CLI 入口 | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 17-122 |
| init 命令 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| run 命令 | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-335 |
| continue 命令 | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |
| status 命令 | [`cli/commands/status.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/status.js) | 1-203 |
| list 命令 | [`cli/commands/list.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/list.js) | 1-160 |
| reset 命令 | [`cli/commands/reset.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/reset.js) | 1-100 |

**关键函数**：
- `getFactoryRoot()` - 获取 Factory 根目录（factory.js:22-52）
- `isFactoryProject()` - 检查是否为 Factory 项目（init.js:22-26）
- `generateConfig()` - 生成项目配置（init.js:58-76）
- `launchClaudeCode()` - 启动 Claude Code（init.js:119-147）
- `launchOpenCode()` - 启动 OpenCode（init.js:152-215）
- `detectAIAssistant()` - 检测 AI 助手类型（run.js:105-124）
- `updateState()` - 更新流水线状态（run.js:94-100）

**依赖库**：
- `commander` - CLI 参数解析
- `chalk` - 终端彩色输出
- `ora` - 加载动画
- `inquirer` - 交互式提示
- `yaml` - YAML 文件解析
- `fs-extra` - 文件系统操作

</details>
