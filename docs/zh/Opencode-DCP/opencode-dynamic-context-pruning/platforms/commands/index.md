---
title: "命令: 监控与修剪 | opencode-dynamic-context-pruning"
sidebarTitle: "监控 Token、手动修剪"
subtitle: "DCP 命令使用指南：监控与手动修剪"
description: "学习使用 DCP 的 4 个命令监控和手动修剪。教你 /dcp context 查看会话，/dcp stats 查看统计，/dcp sweep 手动触发修剪。"
tags:
  - "DCP 命令"
  - "Token 监控"
  - "手动修剪"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 3
---

# DCP 命令使用指南：监控与手动修剪

## 学完你能做什么

- 使用 `/dcp context` 查看当前会话的 Token 使用分布
- 使用 `/dcp stats` 查看累计修剪统计
- 使用 `/dcp sweep [n]` 手动触发修剪
- 理解受保护工具和文件的保护机制
- 了解 Token 计算策略和节省效果

## 你现在的困境

长对话中，Token 消耗越来越快，但你不知道：
- 当前会话的 Token 都花在哪了？
- DCP 究竟帮你省了多少？
- 怎么手动清理那些不再需要的工具输出？
- 哪些工具会被保护，不会被修剪？

这些问题不搞清楚，你可能无法充分利用 DCP 的优化效果，甚至可能在关键时刻误删重要信息。

## 什么时候用这一招

当你：
- 想了解当前会话的 Token 构成
- 需要快速清理对话历史
- 想验证 DCP 的修剪效果
- 准备开始新的任务前做一次上下文清理

## 核心思路

DCP 提供了 4 个 Slash 命令，帮助你监控和控制 Token 使用：

| 命令 | 用途 | 适用场景 |
|------|------|---------|
| `/dcp` | 显示帮助 | 忘记命令时查看 |
| `/dcp context` | 分析当前会话 Token 分布 | 了解上下文构成 |
| `/dcp stats` | 查看累计修剪统计 | 验证长期效果 |
| `/dcp sweep [n]` | 手动修剪工具 | 快速减少上下文大小 |

**受保护机制**：

所有修剪操作都会自动跳过：
- **受保护工具**：`task`、`todowrite`、`todoread`、`discard`、`extract`、`batch`、`write`、`edit`、`plan_enter`、`plan_exit`
- **受保护文件**：匹配配置中的 `protectedFilePatterns` 的文件路径

::: info
受保护工具和受保护文件的设置可以通过配置文件自定义。详见[配置全解](../../start/configuration/)。
:::

## 跟我做

### 第 1 步：查看帮助信息

在 OpenCode 对话框中输入 `/dcp`。

**你应该看到**：

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

**检查点 ✅**：确认看到了 3 个子命令的说明。

### 第 2 步：分析当前会话 Token 分布

输入 `/dcp context` 查看当前会话的 Token 使用情况。

**你应该看到**：

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Token 分类说明**：

| 分类 | 计算方式 | 说明 |
|------|---------|------|
| **System** | `firstAssistant.input + cache.read - tokenizer(firstUserMessage)` | 系统提示词 |
| **Tools** | `tokenizer(toolInputs + toolOutputs) - prunedTokens` | 工具调用（已扣除修剪部分） |
| **User** | `tokenizer(all user messages)` | 所有用户消息 |
| **Assistant** | `total - system - user - tools` | AI 文本输出 + 推理 Token |

**检查点 ✅**：确认看到了各分类的 Token 占比和数量。

### 第 3 步：查看累计修剪统计

输入 `/dcp stats` 查看历史累计的修剪效果。

**你应该看到**：

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.2K
  Tools pruned:   12

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~284.5K
  Tools pruned:   156
  Sessions:       8
```

**统计说明**：
- **Session**：当前会话的修剪数据（内存中）
- **All-time**：所有历史会话的累计数据（磁盘持久化）

**检查点 ✅**：确认看到了当前会话和历史累计的修剪统计。

### 第 4 步：手动修剪工具

有两种方式使用 `/dcp sweep`：

#### 方式一：修剪上一条用户消息后的所有工具

输入 `/dcp sweep`（不带参数）。

**你应该看到**：

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept 8 tool(s) since previous user message.
Tokens saved: ~12,345

  • Read: src/config.ts
  • Read: src/utils.ts
  • Bash: npm test
  • Read: package.json
  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
```

#### 方式二：修剪最后 N 个工具

输入 `/dcp sweep 5` 修剪最后 5 个工具。

**你应该看到**：

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept last 5 tool(s).
Tokens saved: ~7,892

  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
  • Bash: npm run build
```

**受保护工具提示**：

如果跳过了受保护工具，输出会显示：

```
Swept 5 tool(s).
Tokens saved: ~7,892
(2 protected tool(s) skipped)
```

::: warning
受保护工具（如 `write`、`edit`）和受保护文件路径会被自动跳过，不会被修剪。
:::

**检查点 ✅**：确认看到了修剪的工具列表和节省的 Token 数量。

### 第 5 步：再次查看修剪效果

修剪后，再次输入 `/dcp context` 查看新的 Token 分布。

**你应该看到**：
- `Tools` 分类占比下降
- `Summary` 中显示已修剪的工具数增加
- `Current context` 总数减少

**检查点 ✅**：确认 Token 使用量明显减少。

## 踩坑提醒

### ❌ 错误：误删重要工具

**场景**：你刚用 `write` 工具写了一个关键文件，然后执行 `/dcp sweep`。

**错误结果**：`write` 工具被修剪，AI 可能不知道文件已创建。

**正确做法**：
- `write`、`edit` 等工具默认受保护
- 不要手动修改 `protectedTools` 配置删除这些工具
- 关键任务完成后等待几个回合再清理

### ❌ 错误：修剪时机不当

**场景**：对话刚开始，只有几个工具调用就执行 `/dcp sweep`。

**错误结果**：节省的 Token 很少，反而可能影响上下文连贯性。

**正确做法**：
- 等对话进行到一定程度（如 10+ 个工具调用）再清理
- 开始新任务前清理上一轮的工具输出
- 结合 `/dcp context` 判断是否值得清理

### ❌ 错误：过度依赖手动修剪

**场景**：每次对话都手动执行 `/dcp sweep`。

**错误结果**：
- 自动修剪策略（去重、覆盖写入、清除错误）被浪费
- 增加操作负担

**正确做法**：
- 默认开启自动修剪策略（配置：`strategies.*.enabled`）
- 手动修剪作为补充，在必要时使用
- 通过 `/dcp stats` 验证自动修剪效果

## 本课小结

DCP 的 4 个命令帮助你监控和控制 Token 使用：

| 命令 | 核心功能 |
|------|---------|
| `/dcp` | 显示帮助信息 |
| `/dcp context` | 分析当前会话 Token 分布 |
| `/dcp stats` | 查看累计修剪统计 |
| `/dcp sweep [n]` | 手动修剪工具 |

**Token 计算策略**：
- System：系统提示词（从第一条响应推算）
- Tools：工具输入输出（扣除修剪部分）
- User：所有用户消息（估算）
- Assistant：AI 输出 + 推理 Token（残差）

**受保护机制**：
- 受保护工具：`task`、`todowrite`、`todoread`、`discard`、`extract`、`batch`、`write`、`edit`、`plan_enter`、`plan_exit`
- 受保护文件：配置的 glob 模式
- 所有修剪操作自动跳过这些内容

**最佳实践**：
- 定期查看 `/dcp context` 了解 Token 构成
- 新任务前执行 `/dcp sweep` 清理历史
- 依赖自动修剪，手动修剪作为补充
- 通过 `/dcp stats` 验证长期效果

## 下一课预告

> 下一课我们学习 **[保护机制](../../advanced/protection/)**。
>
> 你会学到：
> - 回合保护如何防止误修剪
> - 如何自定义受保护工具列表
> - 受保护文件模式的配置方法
> - 子代理会话的特殊处理

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|------|---------|------|
| /dcp 帮助命令 | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 19-32 |
| /dcp context 命令 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 238-247 |
| Token 计算策略 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 5-38 |
| /dcp stats 命令 | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| /dcp sweep 命令 | [`lib/commands/sweep.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/sweep.ts) | 123-259 |
| 受保护工具配置 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 461 |
| 默认受保护工具列表 | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 150-151 |

**关键常量**：
- `DEFAULT_PROTECTED_TOOLS`：默认受保护工具列表

**关键函数**：
- `handleHelpCommand()`：处理 /dcp 帮助命令
- `handleContextCommand()`：处理 /dcp context 命令
- `analyzeTokens()`：计算各类别的 Token 数量
- `handleStatsCommand()`：处理 /dcp stats 命令
- `handleSweepCommand()`：处理 /dcp sweep 命令
- `buildToolIdList()`：构建工具 ID 列表

</details>
