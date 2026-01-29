---
title: "项目初始化: 快速建立记忆 | opencode-supermemory"
sidebarTitle: "让 Agent 记住项目"
subtitle: "项目初始化: 快速建立记忆"
description: "学习如何使用 /supermemory-init 命令让 Agent 深度扫描代码库，自动提取架构和规范并存入持久记忆，实现跨会话的上下文保持。"
tags:
  - "初始化"
  - "记忆生成"
  - "工作流"
prerequisite:
  - "start-getting-started"
order: 2
---

# 项目初始化：建立第一印象

## 学完你能做什么

- **一键熟悉项目**：让 Agent 像新入职员工一样，主动探索并理解整个代码库。
- **建立长期记忆**：自动提取项目的技术栈、架构模式和编码规范，存入 Supermemory。
- **消除重复解释**：再也不用在每次会话开始时重复 "我们用的是 Bun" 或 "所有组件都要写测试"。

## 你现在的困境

你是否遇到过这些情况：

- **重复劳动**：每次开启新会话，都要花大量篇幅告诉 Agent 项目的基本情况。
- **上下文遗忘**：Agent 经常忘记项目特定的目录结构，把文件建错位置。
- **规范不统一**：Agent 写的代码风格飘忽不定，一会儿用 `interface` 一会儿用 `type`。

## 什么时候用这一招

- **刚安装插件后**：这是使用 opencode-supermemory 的第一步。
- **接手新项目时**：快速建立该项目的记忆库。
- **重大重构后**：当项目架构发生变化，需要更新 Agent 的认知时。

## 🎒 开始前的准备

::: warning 前置检查
请确保你已经完成了 [快速开始](./../getting-started/index.md) 中的安装和配置步骤，并且 `SUPERMEMORY_API_KEY` 已正确设置。
:::

## 核心思路

`/supermemory-init` 命令本质上不是一个二进制程序，而是一个**精心设计的 Prompt**（提示词）。

当你运行这个命令时，它会向 Agent 发送一份详细的"入职指南"，指示 Agent：

1.  **深度调研**：主动阅读 `README.md`、`package.json`、Git 提交记录等。
2.  **结构化分析**：识别项目的技术栈、架构模式、隐式约定。
3.  **持久化存储**：使用 `supermemory` 工具将这些洞察存入云端数据库。

::: info 记忆作用域
初始化过程会区分两种记忆：
- **Project Scope**：仅对当前项目生效（如：构建命令、目录结构）。
- **User Scope**：对你所有项目生效（如：你偏好的代码风格）。
:::

## 跟我做

### 第 1 步：运行初始化命令

在 OpenCode 的输入框中，输入以下命令并发送：

```bash
/supermemory-init
```

**为什么**
这会加载预定义的 Prompt，启动 Agent 的探索模式。

**你应该看到**
Agent 开始回复，表示它理解了任务，并开始规划调研步骤。它可能会说："I will start by exploring the codebase structure and configuration files..."

### 第 2 步：观察 Agent 的探索过程

Agent 会自动执行一系列操作，你只需要看着就行。它通常会：

1.  **读取配置文件**：读取 `package.json`、`tsconfig.json` 等了解技术栈。
2.  **查看 Git 历史**：运行 `git log` 了解提交规范和活跃贡献者。
3.  **探索目录结构**：使用 `ls` 或 `list_files` 查看项目布局。

**示例输出**：
```
[Agent] Reading package.json to identify dependencies...
[Agent] Running git log to understand commit conventions...
```

::: tip 消耗提示
这个过程是一次深度调研，可能会消耗较多的 Token（通常会进行 50+ 次工具调用）。请耐心等待，直到 Agent 报告完成。
:::

### 第 3 步：验证生成的记忆

当 Agent 提示初始化完成后，你可以检查一下它到底记住了什么。输入：

```bash
/ask 列出当前项目的记忆
```

或者直接调用工具（如果你想看原始数据）：

```
supermemory(mode: "list", scope: "project")
```

**你应该看到**
Agent 列出了一系列结构化的记忆，例如：

| 类型 | 内容示例 |
| :--- | :--- |
| `project-config` | "Uses Bun runtime. Build command: bun run build" |
| `architecture` | "API routes are located in src/routes/, using Hono framework" |
| `preference` | "Strict TypeScript usage: no 'any' type allowed" |

### 第 4 步：补充遗漏（可选）

如果 Agent 漏掉了某些关键信息（比如某个只有口头约定的特殊规则），你可以手动补充：

```
请记住：在这个项目中，所有的日期处理必须使用 dayjs 库，禁止使用原生 Date。
```

**你应该看到**
Agent 回复确认，并调用 `supermemory(mode: "add")` 保存这条新规则。

## 检查点 ✅

- [ ] 运行 `/supermemory-init` 后，Agent 是否自动执行了探索任务？
- [ ] 使用 `list` 命令是否能查看到新生成的记忆？
- [ ] 记忆内容是否准确反映了当前项目的实际情况？

## 踩坑提醒

::: warning 不要频繁运行
初始化是一个耗时且消耗 Token 的过程。通常每个项目只需要运行一次。只有在项目发生巨大变化时才需要重新运行。
:::

::: danger 隐私注意
虽然插件会自动脱敏 `<private>` 标签的内容，但在初始化过程中，Agent 会读取大量文件。请确保你的代码库中没有硬编码的敏感密钥（如 AWS Secret Key），否则它们可能会被作为"项目配置"存入记忆。
:::

## 本课小结

通过 `/supermemory-init`，我们完成了从"陌生人"到"熟练工"的转变。现在，Agent 已经记住了项目的核心架构和规范，在接下来的编码任务中，它将自动利用这些上下文，为你提供更精准的辅助。

## 下一课预告

> 下一课我们学习 **[自动上下文注入机制](./../../core/context-injection/index.md)**。
>
> 你会学到：
> - Agent 是如何在会话开始时"想起"这些记忆的。
> - 如何通过关键词触发特定的记忆召回。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| :--- | :--- | :--- |
| 初始化 Prompt 定义 | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L13-L163) | 13-163 |
| 记忆工具实现 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |

**关键常量**：
- `SUPERMEMORY_INIT_COMMAND`：定义了 `/supermemory-init` 命令的具体 Prompt 内容，指导 Agent 如何进行调研和记忆。

</details>
