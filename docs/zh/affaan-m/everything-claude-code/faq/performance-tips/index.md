---
title: "性能优化: 模型与上下文 | Everything Claude Code"
sidebarTitle: "响应快 10 倍的秘诀"
subtitle: "性能优化：提升响应速度"
description: "学习 Everything Claude Code 的性能优化策略。掌握模型选择、上下文窗口管理、MCP 配置和策略性压缩，提升响应速度和开发效率。"
tags:
  - "performance"
  - "optimization"
  - "token-usage"
prerequisite:
  - "start-quick-start"
order: 180
---

# 性能优化：提升响应速度

## 学完你能做什么

- 根据任务复杂度选择合适的模型，平衡成本和性能
- 有效管理上下文窗口，避免达到限制
- 合理配置 MCP 服务器，最大化可用上下文
- 使用策略性压缩保持对话逻辑连贯

## 你现在的困境

Claude Code 响应变慢？上下文窗口很快满了？不知道什么时候用 Haiku、Sonnet 还是 Opus？这些问题都会严重影响开发效率。

## 核心思路

性能优化的核心是**在合适的时候用合适的工具**。选择模型、管理上下文、配置 MCP，都是在做一个权衡：速度 vs 智能度，成本 vs 质量。

::: info 关键概念

**上下文窗口**是 Claude 能"记住"的对话历史长度。当前模型支持约 200k tokens，但会受 MCP 服务器数量、工具调用次数等因素影响。

:::

## 常见性能问题

### 问题 1：响应速度慢

**症状**：简单任务也要等很久

**可能原因**：
- 用 Opus 处理简单任务
- 上下文过长，需要处理大量历史信息
- 启用了太多 MCP 服务器

**解决方案**：
- 用 Haiku 处理轻量任务
- 定期压缩上下文
- 减少启用的 MCP 数量

### 问题 2：上下文窗口很快满了

**症状**：开发一会儿就需要压缩或重启会话

**可能原因**：
- 启用了太多 MCP 服务器（每个 MCP 都会占用上下文）
- 没有及时压缩对话历史
- 使用了复杂的工具调用链

**解决方案**：
- 按需启用 MCP，用 `disabledMcpServers` 禁用不用的
- 使用策略性压缩，在任务边界手动压缩
- 避免不必要的文件读取和搜索

### 问题 3：Token 消耗快

**症状**：配额用得很快，成本高

**可能原因**：
- 总是用 Opus 处理任务
- 重复读取大量文件
- 没有合理使用压缩

**解决方案**：
- 根据任务复杂度选择模型
- 使用 `/compact` 主动压缩
- 使用 strategic-compact hooks 智能提醒

## 模型选择策略

根据任务复杂度选择合适的模型，可以大幅提升性能和降低成本。

### Haiku 4.5（90% Sonnet 能力，3x 成本节省）

**适用场景**：
- 轻量级 Agent，频繁调用
- 结对编程和代码生成
- 多 Agent 系统中的 Worker agents

**示例**：
```markdown
简单代码修改、格式化、生成注释
使用 Haiku
```

### Sonnet 4.5（最佳编码模型）

**适用场景**：
- 主要开发工作
- 协调多 Agent 工作流
- 复杂编码任务

**示例**：
```markdown
实现新功能、重构、修复复杂 bug
使用 Sonnet
```

### Opus 4.5（最强推理能力）

**适用场景**：
- 复杂架构决策
- 需要最大推理深度的任务
- 研究和分析任务

**示例**：
```markdown
系统设计、安全审计、复杂问题排查
使用 Opus
```

::: tip 模型选择提示

在 agent 配置中通过 `model` 字段指定：
```markdown
---
name: my-agent
model: haiku  # 或 sonnet, opus
---
```

:::

## 上下文窗口管理

避免在上下文窗口使用过多会影响性能，甚至导致任务失败。

### 避免使用上下文窗口后 20% 的任务

对于这些任务，建议先压缩上下文：
- 大规模重构
- 跨多个文件的功能实现
- 复杂交互的调试

### 上下文敏感性较低的任务

这些任务对上下文要求不高，可以在接近上限时继续：
- 单文件编辑
- 独立工具创建
- 文档更新
- 简单 bug 修复

::: warning 重要提醒

上下文窗口受以下因素影响：
- 启用的 MCP 服务器数量
- 工具调用次数
- 历史对话长度
- 当前会话的文件操作

:::

## MCP 配置优化

MCP 服务器是扩展 Claude Code 能力的重要方式，但每个 MCP 都会占用上下文。

### 基本原则

根据 README 的建议：

```json
{
  "mcpServers": {
    "mcp-server-1": { ... },
    "mcp-server-2": { ... }
    // ... 更多配置
  },
  "disabledMcpServers": [
    "mcp-server-3",
    "mcp-server-4"
    // 禁用不用的 MCP
  ]
}
```

**最佳实践**：
- 可以配置 20-30 个 MCP 服务器
- 每个项目启用不超过 10 个
- 保持活跃工具数量在 80 个以下

### 按需启用 MCP

根据项目类型选择相关 MCP：

| 项目类型 | 推荐启用 | 可选 |
|--- | --- | ---|
| 前端项目 | Vercel, Magic | Filesystem, GitHub |
| 后端项目 | Supabase, ClickHouse | GitHub, Railway |
| 全栈项目 | 全部 | - |
| 工具库 | GitHub | Filesystem |

::: tip 如何切换 MCP

在项目配置（`~/.claude/settings.json`）中使用 `disabledMcpServers`：
```json
{
  "disabledMcpServers": ["cloudflare-observability", "clickhouse-io"]
}
```

:::

## 策略性压缩

自动压缩会在任意时刻触发，可能打断任务逻辑。策略性压缩在任务边界手动执行，保持逻辑连贯。

### 为什么需要策略性压缩

**自动压缩的问题**：
- 往往在任务中途触发，丢失重要上下文
- 不了解任务逻辑边界
- 可能打断复杂的多步骤操作

**策略性压缩的优势**：
- 在任务边界压缩，保留关键信息
- 逻辑更清晰
- 避免中断重要流程

### 最佳压缩时机

1. **探索完成后，执行前** - 压缩研究上下文，保留实现计划
2. **完成一个里程碑后** - 为下一阶段重新开始
3. **任务切换前** - 清除探索上下文，准备新任务

### Strategic Compact Hook

本插件包含 `strategic-compact` skill，自动提醒你何时应该压缩。

**Hook 工作原理**：
- 跟踪工具调用次数
- 达到阈值时提醒（默认 50 次调用）
- 之后每 25 次调用提醒一次

**配置阈值**：
```bash
# 设置环境变量
export COMPACT_THRESHOLD=40
```

**Hook 配置**（已包含在 `hooks/hooks.json` 中）：
```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }]
}
```

### 使用技巧

1. **规划后压缩** - 计划确定后，压缩重新开始
2. **调试后压缩** - 清除错误解决上下文，继续下一步
3. **实现中不要压缩** - 保留相关变更的上下文
4. **关注提醒** - Hook 告诉你"什么时候"，你决定"是否压缩"

::: tip 查看当前状态

使用 `/checkpoint` 命令可以保存当前状态，再压缩会话。

:::

## 性能检查清单

在日常使用中，定期检查以下项目：

### 模型使用
- [ ] 简单任务用 Haiku 而不是 Sonnet/Opus
- [ ] 复杂推理用 Opus 而不是 Sonnet
- [ ] Agent 配置中指定了合适的 model

### 上下文管理
- [ ] 启用的 MCP 不超过 10 个
- [ ] 定期使用 `/compact` 压缩
- [ ] 在任务边界而不是任务中途压缩

### MCP 配置
- [ ] 项目只启用需要的 MCP
- [ ] 用 `disabledMcpServers` 管理不用的 MCP
- [ ] 定期检查活跃工具数量（建议 < 80）

## 常见问题

### Q: 什么时候用 Haiku、Sonnet 还是 Opus？

**A**: 根据任务复杂度：
- **Haiku**: 轻量任务、频繁调用（如代码格式化、注释生成）
- **Sonnet**: 主要开发工作、协调 Agent（如功能实现、重构）
- **Opus**: 复杂推理、架构决策（如系统设计、安全审计）

### Q: 上下文窗口满了怎么办？

**A**: 立即使用 `/compact` 压缩会话。如果启用了 strategic-compact hook，它会在合适的时候提醒你。压缩前可以用 `/checkpoint` 保存重要状态。

### Q: 如何知道启用了多少个 MCP？

**A**: 查看 `~/.claude/settings.json` 中的 `mcpServers` 和 `disabledMcpServers` 配置。活跃的 MCP 数量 = 总数 - `disabledMcpServers` 中的数量。

### Q: 为什么我的响应特别慢？

**A**: 检查以下几点：
1. 是否用了 Opus 处理简单任务？
2. 上下文窗口是否快满了？
3. 启用了太多 MCP 服务器？
4. 是否在执行大规模文件操作？

## 本课小结

性能优化的核心是"在合适的时候用合适的工具"：

- **模型选择**：根据任务复杂度选择 Haiku/Sonnet/Opus
- **上下文管理**：避免窗口后 20%，及时压缩
- **MCP 配置**：按需启用，不超过 10 个
- **策略性压缩**：在任务边界手动压缩，保持逻辑连贯

## 相关课程

- [Token 优化策略](../../advanced/token-optimization/) - 深入学习上下文窗口管理
- [Hooks 自动化](../../advanced/hooks-automation/) - 了解 strategic-compact hook 的配置
- [MCP 服务器配置](../../start/mcp-setup/) - 学习如何配置 MCP 服务器

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 性能优化规则 | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| 策略性压缩 Skill | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Hooks 配置 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Strategic Compact Hook | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json#L46-L54) | 46-54 |
| Suggest Compact 脚本 | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | - |
| MCP 配置示例 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | - |

**关键规则**：
- **模型选择**：Haiku（轻量任务）、Sonnet（主要开发）、Opus（复杂推理）
- **上下文窗口**：避免使用后 20%，及时压缩
- **MCP 配置**：每项目启用不超过 10 个，活跃工具 < 80 个
- **策略性压缩**：在任务边界手动压缩，避免自动压缩中断

**关键环境变量**：
- `COMPACT_THRESHOLD`：工具调用次数阈值（默认：50）

</details>
