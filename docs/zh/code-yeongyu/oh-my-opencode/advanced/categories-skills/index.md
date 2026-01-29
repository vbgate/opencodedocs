---
title: "Categories 和 Skills: 动态代理组合 | oh-my-opencode"
sidebarTitle: "动态代理像搭积木"
subtitle: "Categories 和 Skills: 动态代理组合（v3.0）"
description: "学习 oh-my-opencode 的 Categories 和 Skills 系统，掌握如何组合模型和知识创建专业化 AI 子代理。通过内置的 7 个 Categories、4 个 Skills 和 delegate_task 工具，优化开发成本。"
tags:
  - "categories"
  - "skills"
  - "delegate-task"
  - "sisyphus-junior"
prerequisite:
  - "start-quick-start"
order: 100
---

# Categories 和 Skills：动态代理组合（v3.0）

## 学完你能做什么

- ✅ 使用 7 个内置 Categories 为不同类型任务自动选择最优模型
- ✅ 加载 4 个内置 Skills 为代理注入专业知识和 MCP 工具
- ✅ 通过 `delegate_task` 组合 Category 和 Skill，创建专业化子代理
- ✅ 自定义 Category 和 Skill，满足特定项目需求

## 你现在的困境

**代理不够专业？成本太高？**

想想这个场景：

| 问题 | 传统方案 | 实际需求 |
|------|---------|---------|
| **UI 任务用超强大模型** | 用 Claude Opus 处理简单样式调整 | 成本高，浪费算力 |
| **复杂逻辑用轻量模型** | 用 Haiku 处理架构设计 | 推理能力不足，方案错误 |
| **Git 提交风格不统一** | 手动管理 commit，容易出错 | 需要自动检测并遵循项目规范 |
| **需要浏览器测试** | 手动打开浏览器验证 | 需要 Playwright MCP 工具支持 |

**核心问题**：
1. 所有任务用一个代理处理 → 模型和工具不匹配
2. 硬编码 10 个固定代理 → 无法灵活组合
3. 专业技能缺失 → 代理缺乏特定领域知识

**解决**：v3.0 的 Categories 和 Skills 系统，让你像搭积木一样组合代理：
- **Category**（模型抽象）：定义任务类型 → 自动选择最优模型
- **Skill**（专业知识）：注入领域知识和 MCP 工具 → 让代理更专业

## 什么时候用这一招

| 场景 | 推荐组合 | 效果 |
|------|----------|------|
| **UI 设计和实现** | `category="visual-engineering"` + `skills=["frontend-ui-ux", "playwright"]` | 自动选择 Gemini 3 Pro + 设计师思维 + 浏览器验证 |
| **快速修复和提交** | `category="quick"` + `skills=["git-master"]` | 用 Haiku 低成本完成 + 自动检测提交风格 |
| **深度架构分析** | `category="ultrabrain"` + `skills=[]` | 用 GPT-5.2 Codex (xhigh) 纯推理 |
| **文档编写** | `category="writing"` + `skills=[]` | 用 Gemini 3 Flash 快速生成文档 |

## 🎒 开始前的准备

::: warning 前置条件

开始本教程前，请确保：
1. 已安装 oh-my-opencode（见 [安装教程](../../start/installation/)）
2. 已配置至少一个 Provider（见 [Provider 配置](../../platforms/provider-setup/)）
3. 了解基本的 delegate_task 工具使用（见 [后台并行任务](../background-tasks/)）

:::

::: info 关键概念
**Category** 是"这是什么类型的工作"（决定模型、温度、思维模式），**Skill** 是"需要什么专业知识和工具"（注入提示词和 MCP 服务器）。通过 `delegate_task(category=..., skills=[...])` 组合两者。
:::

## 核心思路

### Categories：任务类型决定模型

oh-my-opencode 提供了 7 个内置 Categories，每个类别都预配置了最优模型和思维模式：

| Category | 默认模型 | Temperature | 用途 |
|----------|-----------|-------------|------|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | 前端、UI/UX、设计任务 |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | 高智商推理任务（复杂架构决策） |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | 创意和艺术任务（新颖想法） |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | 快速、低成本任务（单文件修改） |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | 不匹配其他类别的中等任务 |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | 不匹配其他类别的高质量任务 |
| `writing` | `google/gemini-3-flash` | 0.1 | 文档和写作任务 |

**为什么需要 Categories？**

不同任务需要不同能力的模型：
- UI 设计 → 需要**视觉创造力**（Gemini 3 Pro）
- 架构决策 → 需要**深度推理**（GPT-5.2 Codex xhigh）
- 简单修改 → 需要**快速响应**（Claude Haiku）

手动为每个任务选择模型很麻烦，Categories 让你只需声明任务类型，系统自动选择最优模型。

### Skills：注入专业知识

Skill 是通过 SKILL.md 文件定义的领域专家，可以注入：
- **专业知识**（提示词扩展）
- **MCP 服务器**（自动加载）
- **工作流指南**（具体操作步骤）

内置 4 个 Skills：

| Skill | 功能 | MCP | 用途 |
|-------|------|-----|------|
| `playwright` | 浏览器自动化 | `@playwright/mcp` | UI 验证、截图、爬虫 |
| `agent-browser` | 浏览器自动化（Vercel） | 手动安装 | 同上，备选方案 |
| `frontend-ui-ux` | 设计师思维 | 无 | 打造精美界面 |
| `git-master` | Git 专家 | 无 | 自动提交、历史搜索、rebase |

**Skill 的工作原理**：

当你加载 Skill 时，系统会：
1. 读取 SKILL.md 文件的提示词内容
2. 如果定义了 MCP，自动启动对应服务器
3. 将 Skill 提示词追加到代理的系统提示词中

例如 `git-master` Skill 包含了：
- 提交风格检测（自动识别项目的 commit 格式）
- 原子提交规则（3 文件 → 最少 2 个提交）
- Rebase 工作流（squash、fixup、冲突处理）
- 历史搜索（blame、bisect、log -S）

### Sisyphus Junior：任务执行器

当你使用 Category 时，会生成一个特殊的子代理——**Sisyphus Junior**。

**关键特性**：
- ✅ 继承 Category 的模型配置
- ✅ 继承加载的 Skills 提示词
- ❌ **不能再次委托**（禁止使用 `task` 和 `delegate_task` 工具）

**为什么禁止再次委托？**

防止无限循环和任务发散：
```
Sisyphus (主代理)
  ↓ delegate_task(category="quick")
Sisyphus Junior
  ↓ 尝试 delegate_task (如果允许)
Sisyphus Junior 2
  ↓ delegate_task
...无限循环...
```

通过禁止再次委托，Sisyphus Junior 专注于完成分配的任务，确保目标清晰、执行高效。

## 跟我做

### 第 1 步：快速修复（Quick + Git Master）

让我们用一个实际场景：你修改了几个文件，需要自动提交并遵循项目风格。

**为什么**
使用 `quick` Category 的 Haiku 模型成本低，配合 `git-master` Skill 自动检测提交风格，实现完美提交。

在 OpenCode 中输入：

```
使用 delegate_task 提交当前的更改
- category: quick
- load_skills: ["git-master"]
- prompt: "提交当前的所有更改。遵循项目的提交风格（通过 git log 检测）。确保原子提交，一个 commit 最多 3 个文件。"
- run_in_background: false
```

**你应该看到**：

1. Sisyphus Junior 启动，使用 `claude-haiku-4-5` 模型
2. `git-master` Skill 加载，提示词包含 Git 专家知识
3. 代理执行以下操作：
   ```bash
   # 并行收集上下文
   git status
   git diff --stat
   git log -30 --oneline
   ```
4. 检测提交风格（如 Semantic vs Plain vs Short）
5. 规划原子提交（3 文件 → 至少 2 个提交）
6. 执行提交，遵循检测到的风格

**检查点 ✅**：

验证提交是否成功：
```bash
git log --oneline -5
```

你应该看到多个原子提交，每个都有清晰的消息风格。

### 第 2 步：UI 实现和验证（Visual + Playwright + UI/UX）

场景：你需要为一个页面添加响应式图表组件，并进行浏览器验证。

**为什么**
- `visual-engineering` Category 选择 Gemini 3 Pro（擅长视觉设计）
- `playwright` Skill 提供 MCP 工具进行浏览器测试
- `frontend-ui-ux` Skill 注入设计师思维（配色、排版、动画）

在 OpenCode 中输入：

```
使用 delegate_task 实现图表组件
- category: visual-engineering
- load_skills: ["frontend-ui-ux", "playwright"]
- prompt: "在 dashboard 页面添加响应式图表组件。要求：
  - 使用 Tailwind CSS
  - 支持移动端和桌面端
  - 使用鲜明的配色方案（避免紫色渐变）
  - 添加交错动画效果
  - 完成后用 playwright 截图验证"
- run_in_background: false
```

**你应该看到**：

1. Sisyphus Junior 启动，使用 `google/gemini-3-pro` 模型
2. 加载两个 Skills 的提示词：
   - `frontend-ui-ux`：设计师心态指南
   - `playwright`：浏览器自动化指令
3. `@playwright/mcp` 服务器自动启动
4. 代理执行：
   - 设计图表组件（应用设计师思维）
   - 实现响应式布局
   - 添加动画效果
   - 使用 Playwright 工具：
     ```
     playwright_navigate: http://localhost:3000/dashboard
     playwright_take_screenshot: output=dashboard-chart.png
     ```

**检查点 ✅**：

验证组件是否正确渲染：
```bash
# 检查新文件
git diff --name-only
git diff --stat

# 查看截图
ls screenshots/
```

你应该看到：
- 新的图表组件文件
- 响应式样式代码
- 截图文件（验证通过）

### 第 3 步：深度架构分析（Ultrabrain 纯推理）

场景：你需要为微服务架构设计一个复杂的通信模式。

**为什么**
- `ultrabrain` Category 选择 GPT-5.2 Codex (xhigh)，提供最强的推理能力
- 不加载 Skills → 纯推理，避免专业知识干扰

在 OpenCode 中输入：

```
使用 delegate_task 分析架构
- category: ultrabrain
- load_skills: []
- prompt: "为我们的微服务架构设计一个高效的通信模式。要求：
  - 支持服务发现
  - 处理网络分区
  - 最小化延迟
  - 提供降级策略

  当前架构：[简述]
  技术栈：gRPC, Kubernetes, Consul"
- run_in_background: false
```

**你应该看到**：

1. Sisyphus Junior 启动，使用 `openai/gpt-5.2-codex` 模型（xhigh 变体）
2. 不加载任何 Skills
3. 代理进行深度推理：
   - 分析现有架构
   - 比较通信模式（如 CQRS、Event Sourcing、Saga）
   - 权衡利弊
   - 提供分层建议（Bottom Line → Action Plan → Risks）

**输出结构**：

```
Bottom Line: 建议使用混合模式（gRPC + Event Bus）

Action Plan:
1. 在服务间使用 gRPC 实现同步通信
2. 关键事件通过 Event Bus 异步发布
3. 实现幂等性处理重复消息

Risks and Mitigations:
- Risk: 网络分区导致消息丢失
  Mitigation: 实现消息重试和死信队列
```

**检查点 ✅**：

验证方案是否全面：
- 是否考虑了服务发现？
- 是否处理了网络分区？
- 是否提供了降级策略？

### 第 4 步：自定义 Category（可选）

如果内置 Categories 不满足你的需求，可以在 `oh-my-opencode.json` 中自定义。

**为什么**
有些项目需要特定的模型配置（如 Korean Writer、Deep Reasoning）。

编辑 `~/.config/opencode/oh-my-opencode.json`：

```jsonc
{
  "categories": {
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },
    
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false
      }
    }
  }
}
```

**字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `model` | string | 覆盖 Category 使用的模型 |
| `temperature` | number | 创造性级别（0-2） |
| `prompt_append` | string | 追加到系统提示词的内容 |
| `thinking` | object | Thinking 配置（`{ type, budgetTokens }`） |
| `tools` | object | 工具权限禁用（`{ toolName: false }`） |

**检查点 ✅**：

验证自定义 Category 是否生效：
```bash
# 使用自定义 Category
delegate_task(category="korean-writer", load_skills=[], prompt="...")
```

你应该看到系统使用了你配置的模型和提示词。

## 踩坑提醒

### 坑 1：Quick Category 提示词不够明确

**问题**：`quick` Category 使用 Haiku 模型，推理能力有限。如果提示词太模糊，结果会很差。

**错误示例**：
```
delegate_task(category="quick", load_skills=["git-master"], prompt="提交更改")
```

**正确做法**：
```
TASK: 提交当前的所有代码更改

MUST DO:
1. 检测项目的提交风格（通过 git log -30）
2. 将 8 个文件按目录分割为 3+ 个原子提交
3. 每个提交最多 3 个文件
4. 遵循检测到的风格（Semantic/Plain/Short）

MUST NOT DO:
- 合并不同目录的文件到同一个提交
- 跳过提交规划直接执行

EXPECTED OUTPUT:
- 多个原子提交
- 每个提交消息匹配项目风格
- 遵循依赖顺序（类型定义 → 实现 → 测试）
```

### 坑 2：忘记指定 `load_skills`

**问题**：`load_skills` 是**必填参数**，不指定会报错。

**错误**：
```
delegate_task(category="quick", prompt="...")
```

**错误输出**：
```
Error: Invalid arguments: 'load_skills' parameter is REQUIRED.
Pass [] if no skills needed, but IT IS HIGHLY RECOMMENDED to pass proper skills.
```

**正确做法**：
```
# 不需要 Skill，显式传递空数组
delegate_task(category="unspecified-low", load_skills=[], prompt="...")
```

### 坑 3：Category 和 subagent_type 同时指定

**问题**：这两个参数是互斥的，不能同时指定。

**错误**：
```
delegate_task(
  category="quick",
  subagent_type="oracle",  # ❌ 冲突
  ...
)
```

**正确做法**：
```
# 使用 Category（推荐）
delegate_task(category="quick", load_skills=[], prompt="...")

# 或者直接指定代理
delegate_task(subagent_type="oracle", load_skills=[], prompt="...")
```

### 坑 4：Git Master 的多提交规则

**问题**：`git-master` Skill 强制要求**多提交**，1 个提交从 3+ 文件会失败。

**错误**：
```
# 尝试 1 个提交 8 个文件
git commit -m "Update landing page"  # ❌ git-master 会拒绝
```

**正确做法**：
```
# 按目录分割为多个提交
git add app/page.tsx app/layout.tsx
git commit -m "Add app layer"  # ✅ Commit 1

git add components/demo/*
git commit -m "Add demo components"  # ✅ Commit 2

git add e2e/*
git commit -m "Add tests"  # ✅ Commit 3
```

### 坑 5：Playwright Skill 未安装 MCP

**问题**：使用 `playwright` Skill 前，需要确保 MCP 服务器可用。

**错误**：
```
delegate_task(category="visual-engineering", load_skills=["playwright"], prompt="截图...")
```

**正确做法**：

检查 MCP 配置（`~/.config/opencode/mcp.json` 或 `.claude/.mcp.json`）：

```jsonc
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

如果 Playwright MCP 未配置，`playwright` Skill 会自动启动它。

## 本课小结

Categories 和 Skills 系统让你可以灵活组合代理：

| 组件 | 作用 | 配置方式 |
|------|------|---------|
| **Category** | 决定模型和思维模式 | `delegate_task(category="...")` 或配置文件 |
| **Skill** | 注入专业知识和 MCP | `delegate_task(load_skills=["..."])` 或 SKILL.md 文件 |
| **Sisyphus Junior** | 执行任务，不能再次委托 | 自动生成，无需手动指定 |

**组合策略**：
1. **UI 任务**：`visual-engineering` + `frontend-ui-ux` + `playwright`
2. **快速修复**：`quick` + `git-master`
3. **深度推理**：`ultrabrain`（不加 Skill）
4. **文档编写**：`writing`（不加 Skill）

**最佳实践**：
- ✅ 总是指定 `load_skills`（即使是空数组）
- ✅ `quick` Category 的提示词必须明确（Haiku 推理能力有限）
- ✅ Git 任务总是用 `git-master` Skill（自动检测风格）
- ✅ UI 任务总是用 `playwright` Skill（浏览器验证）
- ✅ 根据任务类型选择合适的 Category（而不是默认用主代理）

## 下一课预告

> 下一课我们将学习 **[内置 Skills：浏览器自动化、Git 专家与 UI 设计师](../builtin-skills/)**。
>
> 你会学到：
> - `playwright` Skill 的详细工作流程
> - `git-master` Skill 的 3 种模式（Commit/Rebase/History Search）
> - `frontend-ui-ux` Skill 的设计理念
> - 如何创建自定义 Skill

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| delegate_task 工具实现 | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 全文（1070 行） |
| resolveCategoryConfig 函数 | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 113-152 |
| buildSystemContent 函数 | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 176-188 |
| 默认 Categories 配置 | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 158-166 |
| Categories 提示词追加 | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 168-176 |
| Categories 描述 | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 178-186 |
| Category 配置 Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172 |
| 内置 Skills 定义 | [`src/features/builtin-skills/`](https://github.com/code-yeongyu/oh-my-opencode/tree/main/src/features/builtin-skills) | 目录结构 |
| git-master Skill 提示词 | [`src/features/builtin-skills/git-master/SKILL.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/git-master/SKILL.md) | 全文（1106 行） |

**关键常量**：
- `SISYPHUS_JUNIOR_AGENT = "sisyphus-junior"`：Category 委托的执行代理
- `DEFAULT_CATEGORIES`：7 个内置 Category 的模型配置
- `CATEGORY_PROMPT_APPENDS`：每个 Category 的提示词追加内容
- `CATEGORY_DESCRIPTIONS`：每个 Category 的描述（显示在 delegate_task 提示中）

**关键函数**：
- `resolveCategoryConfig()`：解析 Category 配置，合并用户覆盖和默认值
- `buildSystemContent()`：合并 Skill 和 Category 的提示词内容
- `createDelegateTask()`：创建 delegate_task 工具定义

**内置 Skills 文件**：
- `src/features/builtin-skills/frontend-ui-ux/SKILL.md`：设计师思维提示词
- `src/features/builtin-skills/git-master/SKILL.md`：Git 专家完整工作流
- `src/features/builtin-skills/agent-browser/SKILL.md`：Vercel agent-browser 配置
- `src/features/builtin-skills/dev-browser/SKILL.md`：浏览器自动化参考文档

</details>
