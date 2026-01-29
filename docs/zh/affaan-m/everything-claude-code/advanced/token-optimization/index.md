---
title: "Token 优化: 上下文窗口 | Everything Claude Code"
sidebarTitle: "上下文窗口饱和了怎么办"
subtitle: "Token 优化: 上下文窗口"
description: "学习 Claude Code Token 优化策略。掌握模型选择、策略性压缩和 MCP 配置，最大化上下文窗口效率，提升响应质量。"
tags:
  - "token-optimization"
  - "context-management"
  - "performance"
prerequisite:
  - "start-quick-start"
order: 110
---

# Token 优化策略：上下文窗口管理

## 学完你能做什么

- 根据任务类型选择合适的模型，平衡成本和性能
- 使用策略性压缩在逻辑边界保留关键上下文
- 合理配置 MCP 服务器，避免过度消耗上下文窗口
- 避免上下文窗口饱和，保持响应质量

## 你现在的困境

你遇到过这些问题吗？

- 对话进行到一半，突然上下文被压缩，关键信息丢失
- 启用了太多 MCP 服务器，上下文窗口从 200k 降到 70k
- 大型重构时，模型"忘记"了之前的讨论
- 不知道什么时候该压缩，什么时候不该

## 什么时候用这一招

- **需要处理复杂任务时** - 选择合适的模型和上下文管理策略
- **上下文窗口接近饱和时** - 使用策略性压缩保留关键信息
- **配置 MCP 服务器时** - 平衡工具数量和上下文容量
- **长期会话时** - 在逻辑边界压缩，避免自动压缩丢失信息

## 核心思路

Token 优化的核心不是"减少使用"，而是**在关键时刻保留有价值的信息**。

### 三大优化支柱

1. **模型选择策略** - 不同任务用不同模型，避免"杀鸡用牛刀"
2. **策略性压缩** - 在逻辑边界压缩，而不是任意时刻
3. **MCP 配置管理** - 控制启用的工具数量，保护上下文窗口

### 关键概念

::: info 什么是上下文窗口？

上下文窗口是 Claude Code 能"记住"的对话历史长度。当前模型支持约 200k tokens，但会受以下因素影响：

- **启用的 MCP 服务器** - 每个 MCP 都消耗系统提示空间
- **加载的 Skills** - 技能定义占用上下文
- **对话历史** - 你和 Claude 的对话记录

当上下文接近饱和，Claude 会自动压缩历史，可能丢失关键信息。
:::

::: tip 为什么手动压缩更好？

Claude 的自动压缩在任意时刻触发，往往在任务中间打断流程。策略性压缩让你在**逻辑边界**（如完成规划后、切换任务前）主动压缩，保留重要上下文。
:::

## 跟我做

### 第 1 步：选择合适的模型

根据任务复杂度选择模型，避免浪费成本和上下文。

**为什么**

不同模型的推理能力和成本差异很大，合理选择可以节省大量 Token。

**模型选择指南**

| 模型 | 适用场景 | 成本 | 推理能力 |
|------|---------|------|---------|
| **Haiku 4.5** | 轻量级 agent、频繁调用、代码生成 | 低（Sonnet 的 1/3） | 90% 的 Sonnet 能力 |
| **Sonnet 4.5** | 主开发工作、复杂编码任务、orchestration | 中 | 最佳编码模型 |
| **Opus 4.5** | 架构决策、深度推理、研究分析 | 高 | 最强推理能力 |

**配置方法**

在 `agents/` 目录的 agent 文件中设置：

```markdown
---
name: planner
description: 规划复杂功能的实现步骤
model: opus
---

你是一个高级规划者...
```

**你应该看到**：
- 高推理任务（如架构设计）使用 Opus，质量更高
- 编码任务使用 Sonnet，性价比最佳
- 频繁调用的 worker agent 使用 Haiku，节省成本

### 第 2 步：启用策略性压缩 Hook

配置 Hook 在逻辑边界提醒你压缩上下文。

**为什么**

自动压缩在任意时刻触发，可能丢失关键信息。策略性压缩让你决定压缩时机。

**配置步骤**

确保 `hooks/hooks.json` 中有 PreToolUse 和 PreCompact 配置：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Edit\" || tool == \"Write\"",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
          }
        ],
        "description": "Suggest manual compaction at logical intervals"
      }
    ],
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
          }
        ],
        "description": "Save state before context compaction"
      }
    ]
  }
}
```

**自定义阈值**

设置环境变量 `COMPACT_THRESHOLD` 控制建议频率（默认 50 次工具调用）：

```json
// 在 ~/.claude/settings.json 中添加
{
  "env": {
    "COMPACT_THRESHOLD": "50"  // 50 次工具调用后首次建议
  }
}
```

**你应该看到**：
- 每次编辑或写入文件后，Hook 统计工具调用次数
- 达到阈值（默认 50 次）后，看到提示：
  ```
  [StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
  ```
- 之后每 25 次工具调用，看到提示：
  ```
  [StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
  ```

### 第 3 步：在逻辑边界压缩

根据 Hook 的提示，在合适的时机手动压缩。

**为什么**

在任务切换或完成里程碑后压缩，可以保留关键上下文，清除冗余信息。

**压缩时机指南**

✅ **推荐压缩的时机**：
- 完成规划后，开始实现前
- 完成一个功能里程碑，开始下一个
- 调试完成后，继续开发前
- 切换到不同的任务类型时

❌ **避免压缩的时机**：
- 实现功能的过程中
- 调试问题中间
- 多个相关文件修改中

**操作步骤**

当看到 Hook 提示后：

1. 评估当前任务阶段
2. 如果适合压缩，执行：
   ```bash
   /compact
   ```
3. 等待 Claude 总结上下文
4. 验证关键信息已保留

**你应该看到**：
- 压缩后，上下文窗口释放大量空间
- 关键信息（如实现计划、已完成的功能）被保留
- 新的交互从精简的上下文开始

### 第 4 步：优化 MCP 配置

控制启用的 MCP 服务器数量，保护上下文窗口。

**为什么**

每个 MCP 服务器都消耗系统提示空间。启用太多会大幅压缩上下文窗口。

**配置原则**

根据 README 中的经验：

```json
{
  "mcpServers": {
    // 可以配置 20-30 个 MCP...
    "github": { ... },
    "supabase": { ... },
    // ...更多配置
  },
  "disabledMcpServers": [
    "firecrawl",       // 禁用不常用的 MCP
    "clickhouse",
    // ...根据项目需求禁用
  ]
}
```

**最佳实践**：

- **配置所有 MCP**（20-30 个），在项目中灵活切换
- **启用 < 10 个 MCP**，保持活跃工具 < 80 个
- **根据项目选择**：开发后端时启用数据库相关，前端时启用构建相关

**验证方法**

检查工具数量：

```bash
// Claude Code 会显示当前启用的工具
/tool list
```

**你应该看到**：
- 工具总数 < 80 个
- 上下文窗口保持在 180k+（避免降到 70k 以下）
- 根据项目需求动态调整启用列表

### 第 5 步：配合 Memory Persistence

使用 Hooks 让关键状态在压缩后保留。

**为什么**

策略性压缩会丢失上下文，但关键状态（如实现计划、checkpoint）需要保留。

**配置 Hooks**

确保以下 Hook 已启用：

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
          }
        ],
        "description": "Load previous context and detect package manager on new session"
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
          }
        ],
        "description": "Persist session state on end"
      }
    ]
  }
}
```

**工作流程**：

1. 完成任务后，使用 `/checkpoint` 保存状态
2. 压缩上下文前，PreCompact Hook 自动保存
3. 新会话开始时，SessionStart Hook 自动加载
4. 关键信息（计划、状态）持久化，不受压缩影响

**你应该看到**：
- 压缩后，重要状态仍然可用
- 新会话自动恢复之前的上下文
- 关键决策和实现计划不会丢失

## 检查点 ✅

- [ ] 已配置 `strategic-compact` Hook
- [ ] 根据任务选择合适的模型（Haiku/Sonnet/Opus）
- [ ] 启用的 MCP < 10 个，工具总数 < 80
- [ ] 在逻辑边界（完成规划/里程碑）压缩
- [ ] Memory Persistence Hooks 已启用，关键状态可保留

## 踩坑提醒

### ❌ 常见错误 1：所有任务都用 Opus

**问题**：Opus 虽然最强，但成本是 Sonnet 的 10 倍，Haiku 的 30 倍。

**修正**：根据任务类型选择模型：
- 频繁调用的 agent（如代码审查、格式化）用 Haiku
- 主开发工作用 Sonnet
- 架构决策、深度推理用 Opus

### ❌ 常见错误 2：忽略 Hook 压缩提示

**问题**：看到 `[StrategicCompact]` 提示后继续工作，上下文最终被自动压缩，丢失关键信息。

**修正**：评估任务阶段，在合适时机响应提示执行 `/compact`。

### ❌ 常见错误 3：启用所有 MCP 服务器

**问题**：配置了 20+ 个 MCP 并全部启用，上下文窗口从 200k 降到 70k。

**修正**：使用 `disabledMcpServers` 禁用不常用的 MCP，保持 < 10 个活跃 MCP。

### ❌ 常见错误 4：在实现过程中压缩

**问题**：压缩了正在实现功能的上下文，模型"忘记"了之前的讨论。

**修正**：只在逻辑边界（完成规划、切换任务、里程碑完成）压缩。

## 本课小结

Token 优化的核心是**在关键时刻保留有价值的信息**：

1. **模型选择** - Haiku/Sonnet/Opus 各有适用场景，合理选择节省成本
2. **策略性压缩** - 在逻辑边界手动压缩，避免自动压缩丢失信息
3. **MCP 管理** - 控制启用数量，保护上下文窗口
4. **Memory Persistence** - 让关键状态在压缩后仍然可用

遵循这些策略，你可以最大化 Claude Code 的上下文效率，避免上下文饱和导致的质量下降。

## 下一课预告

> 下一课我们学习 **[验证循环：Checkpoint 与 Evals](../verification-loop/)**。
>
> 你会学到：
> - 如何使用 Checkpoint 保存和恢复工作状态
> - 持续验证的 Eval Harness 方法
> - Grader 类型和 Pass@K 指标
> - 验证循环在 TDD 中的应用

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能              | 文件路径                                                                                      | 行号    |
| ----------------- | --------------------------------------------------------------------------------------------- | ------- |
| 策略性压缩 Skill  | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64    |
| 压缩建议 Hook     | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61    |
| 压缩前保存 Hook   | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49    |
| 性能优化规则      | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48    |
| Hooks 配置        | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158   |
| 上下文窗口说明    | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 349-359 |

**关键常量**：
- `COMPACT_THRESHOLD = 50`：工具调用阈值（默认值）
- `MCP_LIMIT = 10`：建议启用的 MCP 数量上限
- `TOOL_LIMIT = 80`：建议的工具总数上限

**关键函数**：
- `suggest-compact.js:main()`：统计工具调用次数并建议压缩
- `pre-compact.js:main()`：在压缩前保存会话状态

</details>
