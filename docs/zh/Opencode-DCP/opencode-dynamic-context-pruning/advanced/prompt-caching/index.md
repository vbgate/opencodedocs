---
title: "缓存影响: 权衡命中率和节省 | opencode-dcp"
subtitle: "Prompt Caching: DCP 如何权衡缓存命中率和 Token 节省"
sidebarTitle: "缓存降了就亏？"
description: "理解 DCP 如何影响 Prompt Caching 的缓存命中率和 Token 节省。掌握 Anthropic、OpenAI 等提供商的最佳实践，根据计费模式动态调整策略。"
tags:
  - "advanced"
  - "prompt-caching"
  - "token-optimization"
  - "cost-optimization"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
  - "platforms-llm-tools"
order: 3
---

# Prompt 缓存影响：权衡缓存命中率和 Token 节省

## 学完你能做什么

- 理解 LLM 提供商的 Prompt Caching 机制如何工作
- 知道 DCP 修剪为什么会影响缓存命中率
- 学会如何权衡缓存损失和 Token 节省
- 根据使用的提供商和计费模式，制定最佳策略

## 你现在的困境

你启用了 DCP 后，注意到缓存命中率从 85% 降到了 65%，担心这是否反而增加了成本？或者你想了解在不同 LLM 提供商（Anthropic、OpenAI、GitHub Copilot）上使用 DCP 是否会有不同的影响？

DCP 的修剪操作会改变消息内容，这会影响 Prompt Caching。但这个权衡是否值得？让我们深入分析。

## 什么时候用这一招

- 长会话中，上下文膨胀变得显著
- 使用按请求计费的提供商（如 GitHub Copilot、Google Antigravity）
- 想要减少上下文污染，提高模型响应质量
- Token 节省的价值超过缓存命中率损失

## 核心思路

**什么是 Prompt Caching**

**Prompt Caching** 是 LLM 提供商（如 Anthropic、OpenAI）为了优化性能和成本而提供的技术。它基于**精确前缀匹配**来缓存已处理过的 prompt，相同的 prompt 前缀不会重复计算 Token。

::: info 缓存机制示例

假设你有以下对话历史：

```
[系统提示词]
[用户消息 1]
[AI 响应 1 + 工具调用 A]
[用户消息 2]
[AI 响应 2 + 工具调用 A]  ← 相同的工具调用
[用户消息 3]
```

如果没有缓存，每次发送到 LLM 都需要重新计算所有 Token。有了缓存，第二次发送时，提供商可以复用之前计算的结果，只需计算新的「用户消息 3」部分。

:::

**DCP 如何影响缓存**

当 DCP 修剪工具输出时，它会将工具的原始输出内容替换为一个占位符文本：`"[Output removed to save context - information superseded or no longer needed]"`

这个操作改变了消息的精确内容（原本是完整的工具输出，现在变成了占位符），从而导致**缓存失效**——从该点开始的缓存前缀无法再被复用。

**权衡分析**

| 指标 | 无 DCP | 启用 DCP | 影响 |
|--- | --- | --- | ---|
| **缓存命中率** | ~85% | ~65% | ⬇️ 减少 20% |
| **上下文大小** | 持续增长 | 受控修剪 | ⬇️ 显著减少 |
| **Token 节省** | 0 | 10-40% | ⬆️ 显著增加 |
| **响应质量** | 可能下降 | 更稳定 | ⬆️ 提升（减少上下文污染） |

::: tip 为什么缓存命中率下降但成本可能更低？

缓存命中率的下降并不等于成本增加。原因：

1. **Token 节省通常超过缓存损失**：在长会话中，DCP 修剪节省的 Token 数量（10-40%）往往超过缓存失效带来的额外 Token 计算
2. **上下文污染减少**：冗余内容被移除后，模型可以更专注于当前任务，响应质量更高
3. **缓存命中率的绝对值仍很高**：即使降到 65%，仍有近 2/3 的内容可以被缓存

测试数据显示，大多数情况下 DCP 的 Token 节省效果更明显。
:::

## 不同计费模型的影响

### 按请求计费（GitHub Copilot、Google Antigravity）

**最佳用例**，没有负面影响。

这些提供商按请求次数收费，而不是按 Token 数量。因此：

- ✅ DCP 修剪节省的 Token 不直接影响费用
- ✅ 减少上下文大小可以提高响应速度
- ✅ 缓存失效不会增加额外成本

::: info GitHub Copilot 和 Google Antigravity

这两个平台按请求计费，DCP 是**零成本优化**——即使缓存命中率下降，也不会增加费用，反而能提升性能。

:::

### 按 Token 计费（Anthropic、OpenAI）

需要权衡缓存损失和 Token 节省。

**计算示例**：

假设一个长会话，包含 100 个消息，总 Token 数为 100K：

| 场景 | 缓存命中率 | 缓存节省 Token | DCP 修剪节省 Token | 总节省 |
|--- | --- | --- | --- | ---|
| 无 DCP | 85% | 85K × (1-0.85) = 12.75K | 0 | 12.75K |
| 启用 DCP | 65% | 100K × (1-0.65) = 35K | 20K（估算） | 35K + 20K - 12.75K = **42.25K** |

DCP 修剪后虽然缓存命中率下降，但由于上下文减小了 20K Token，实际总节省更多。

::: warning 长会话优势明显

在长会话中，DCP 的优势更明显：

- **短会话**（< 10 消息）：缓存失效可能占主导，收益有限
- **长会话**（> 30 消息）：上下文膨胀严重，DCP 修剪节省的 Token 远超缓存损失

建议：在长会话中优先启用 DCP，短会话可以关闭。
:::

## 观察与验证

### 第 1 步：观察缓存 Token 使用

**为什么**
了解缓存 Token 在总 Token 中的占比，评估缓存的重要性

```bash
# 在 OpenCode 中执行
/dcp context
```

**你应该看到**：类似这样的 Token 分析

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**关键指标解读**：

| 指标 | 含义 | 如何评估 |
|--- | --- | ---|
| **Pruned** | 已修剪的工具数量和 Token 数 | 越高说明 DCP 节省越多 |
| **Current context** | 当前会话上下文的 Token 总数 | 应该显著小于 Without DCP |
| **Without DCP** | 如果不启用 DCP，上下文会有多大 | 用于对比节省效果 |

### 第 2 步：对比启用/禁用 DCP

**为什么**
通过对比，直观感受缓存和 Token 节省的差异

```bash
# 1. 禁用 DCP（在配置中设置 enabled: false）
# 或者临时关闭：
/dcp sweep 999  # 修剪所有工具，观察缓存效果

# 2. 进行几次对话

# 3. 查看统计
/dcp stats

# 4. 重新启用 DCP
# （修改配置或恢复默认值）

# 5. 继续对话，对比统计
/dcp stats
```

**你应该看到**：

使用 `/dcp context` 观察关键指标的变化：

| 指标 | 禁用 DCP | 启用 DCP | 说明 |
|--- | --- | --- | ---|
| **Pruned** | 0 tools | 5-20 tools | DCP 修剪的工具数量 |
| **Current context** | 较大 | 较小 | DCP 后上下文显著减小 |
| **Without DCP** | 与 Current 相同 | 大于 Current | 显示 DCP 的节省潜力 |

::: tip 实际测试建议

在不同的会话类型中测试：

1. **短会话**（5-10 消息）：观察缓存是否更重要
2. **长会话**（30+ 消息）：观察 DCP 的节省是否更明显
3. **重复读取**：频繁读取相同文件的场景

这能帮助你根据实际使用习惯做出最佳选择。
:::

### 第 3 步：理解上下文污染的影响

**为什么**
DCP 修剪不仅能节省 Token，还能减少上下文污染，提高响应质量

::: info 什么是上下文污染？

**上下文污染**是指过多的冗余、无关或过时的信息充斥在对话历史中，导致：

- 模型注意力分散，难以聚焦当前任务
- 可能引用旧的数据（如已修改的文件内容）
- 响应质量下降，需要更多 Token 来"理解"上下文

DCP 通过移除已完成的工具输出、重复的读取操作等，减少了这种污染。
:::

**实际效果对比**：

| 场景 | 无 DCP | 启用 DCP |
|--- | --- | ---|
| 读取同一文件 3 次 | 保留 3 次完整输出（冗余） | 只保留最新一次 |
| 写入文件后重新读取 | 旧写操作 + 新读取 | 只保留新读取 |
| 错误工具输出 | 保留完整的错误输入 | 只保留错误消息 |

减少上下文污染后，模型可以更准确地理解当前状态，减少"胡说八道"或引用过时数据的情况。

## 最佳实践建议

### 根据提供商选择策略

| 提供商 | 计费模式 | 建议 | 原因 |
|--- | --- | --- | ---|
| **GitHub Copilot** | 按请求 | ✅ 始终启用 | 零成本优化，只提升性能 |
| **Google Antigravity** | 按请求 | ✅ 始终启用 | 同上 |
| **Anthropic** | 按 Token | ✅ 长会话启用<br>⚠️ 短会话可选 | 权衡缓存和节省 |
| **OpenAI** | 按 Token | ✅ 长会话启用<br>⚠️ 短会话可选 | 同上 |

### 根据会话类型调整配置

```jsonc
// ~/.config/opencode/dcp.jsonc 或项目配置

{
  // 长会话（> 30 消息）：启用所有策略
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": true },  // 推荐启用
    "purgeErrors": { "enabled": true }
  },

  // 短会话（< 10 消息）：只启用去重
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": false },
    "purgeErrors": { "enabled": false }
  }
}
```

**策略说明**：

- **deduplication（去重）**：影响小，推荐始终启用
- **supersedeWrites（覆盖写入）**：影响中等，长会话推荐
- **purgeErrors（清除错误）**：影响小，推荐启用

### 动态调整策略

使用 `/dcp context` 观察 Token 构成和修剪效果：

```bash
# 如果 Pruned 值很高，说明 DCP 正在积极节省 Token
# 可以对比 Current context 和 Without DCP 来评估节省效果

/dcp context
```

## 检查点 ✅

确认你理解了以下要点：

- [ ] Prompt Caching 基于精确前缀匹配，消息内容变化会失效缓存
- [ ] DCP 修剪会改变消息内容，导致缓存命中率下降（约 20%）
- [ ] 在长会话中，Token 节省通常超过缓存损失
- [ ] GitHub Copilot 和 Google Antigravity 按请求计费，DCP 是零成本优化
- [ ] Anthropic 和 OpenAI 按 Token 计费，需要权衡缓存和节省
- [ ] 使用 `/dcp context` 观察 Token 构成和修剪效果
- [ ] 根据会话长度动态调整策略配置

## 踩坑提醒

### ❌ 误以为缓存命中率下降等于成本增加

**问题**：看到缓存命中率从 85% 降到 65%，以为成本会增加

**原因**：只关注了缓存命中率，忽略了 Token 节省和上下文减小的效果

**解决**：使用 `/dcp context` 查看实际数据，重点关注：
1. DCP 修剪节省的 Token（`Pruned`）
2. 当前上下文大小（`Current context`）
3. 不修剪时的理论大小（`Without DCP`）

通过对比 `Without DCP` 和 `Current context`，你可以看到 DCP 实际节省的 Token 数量。

### ❌ 在短会话中过度激进修剪

**问题**：5-10 个消息的短会话，启用了所有策略，缓存失效明显

**原因**：短会话中上下文膨胀不严重，激进修剪的收益小

**解决**：
- 短会话只启用 `deduplication` 和 `purgeErrors`
- 关闭 `supersedeWrites` 策略
- 或者完全禁用 DCP（`enabled: false`）

### ❌ 忽略不同提供商的计费差异

**问题**：在 GitHub Copilot 上担心缓存失效增加成本

**原因**：没有注意到 Copilot 是按请求计费，缓存失效不增加费用

**解决**：
- Copilot 和 Antigravity：始终启用 DCP
- Anthropic 和 OpenAI：根据会话长度调整策略

### ❌ 没有观察实际数据就做决策

**问题**：凭感觉判断是否应该启用 DCP

**原因**：没有使用 `/dcp context` 和 `/dcp stats` 观察实际效果

**解决**：
- 在不同会话中收集数据
- 对比启用/禁用 DCP 的差异
- 根据自己的使用习惯做出选择

## 本课小结

**Prompt Caching 的核心机制**：

- LLM 提供商基于**精确前缀匹配**缓存 prompt
- DCP 修剪改变消息内容，导致缓存失效
- 缓存命中率下降（约 20%），但 Token 节省更显著

**权衡决策矩阵**：

| 场景 | 推荐配置 | 原因 |
|--- | --- | ---|
| GitHub Copilot/Google Antigravity | ✅ 始终启用 | 按请求计费，零成本优化 |
| Anthropic/OpenAI 长会话 | ✅ 启用所有策略 | Token 节省 > 缓存损失 |
| Anthropic/OpenAI 短会话 | ⚠️ 只启用去重+清除错误 | 缓存更重要 |

**关键要点**：

1. **缓存命中率的下降不等于成本增加**：需要看总 Token 节省
2. **不同提供商的计费模式影响策略**：按请求 vs 按 Token
3. **根据会话长度动态调整**：长会话受益更多
4. **使用工具观察数据**：`/dcp context` 和 `/dcp stats`

**最佳实践总结**：

```
1. 确认你使用的提供商和计费模式
2. 根据会话长度调整策略配置
3. 定期使用 /dcp context 观察效果
4. 在长会话中优先考虑 Token 节省
5. 在短会话中优先考虑缓存命中率
```

## 下一课预告

> 下一课我们学习 **[子代理处理](/zh/Opencode-DCP/opencode-dynamic-context-pruning/advanced/subagent-handling/)**。
>
> 你会学到：
> - DCP 如何检测子代理会话
> - 为什么子代理不参与修剪
> - 子代理中的修剪结果如何传递给主代理

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Prompt Caching 说明 | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 46-52 |
| Token 计算（含缓存） | [`lib/messages/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/utils.ts) | 66-78 |
| 上下文分析命令 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174 |
| 缓存 Token 计算 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 106-107 |
| 日志记录缓存 Token | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts) | 141 |
| 修剪占位符定义 | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 6-7 |
| 工具输出修剪 | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 22-46 |

**关键常量**：
- 无

**关键函数**：
- `calculateTokens(messages, tokenizer)`：计算消息 Token 数，包含 cache.read 和 cache.write
- `buildSessionContext(messages)`：构建会话上下文分析，区分 System/User/Assistant/Tools
- `formatContextAnalysis(analysis)`：格式化上下文分析输出

**关键类型**：
- `TokenCounts`：Token 计数结构，包含 input/output/reasoning/cache

**缓存机制说明**（来自 README）：
- Anthropic 和 OpenAI 基于精确前缀匹配缓存 prompt
- DCP 修剪改变消息内容，导致缓存失效
- 启用 DCP 时缓存命中率约 65%，不启用时约 85%
- 最佳用例：按请求计费的提供商（GitHub Copilot、Google Antigravity）无负面影响

</details>
