---
title: "LLM 修剪: 智能优化 | opencode-dynamic-context-pruning"
sidebarTitle: "让 AI 自动修剪"
subtitle: "LLM 修剪: 智能优化上下文"
description: "学习 DCP 的 discard/extract 工具，理解区别、注入机制和保护机制，配置开关选项，实战验证修剪效果，优化 Token、降低成本。"
tags:
  - "DCP"
  - "上下文修剪"
  - "AI 工具"
  - "Token 优化"
prerequisite:
  - "start-configuration"
order: 2
---

# LLM 驱动修剪工具：让 AI 智能优化上下文

## 学完你能做什么

- 理解 discard 和 extract 工具的区别和使用场景
- 知道 AI 如何通过 `<prunable-tools>` 列表选择要修剪的内容
- 配置修剪工具的开关、提醒频率和显示选项
- 了解保护机制如何防止误修剪关键文件

## 你现在的困境

随着对话深入，工具调用累积，上下文越来越大。你可能遇到：
- Token 使用量激增，成本上升
- AI 需要处理大量无关的旧工具输出
- 不知道如何让 AI 主动清理上下文

传统方案是手动清理，但这样会中断对话流程。DCP 提供了更好的方式：让 AI 自主决定何时清理上下文。

## 什么时候用这一招

当你：
- 经常进行长对话，工具调用累积较多
- 发现 AI 需要处理大量历史工具输出
- 想优化 Token 使用成本而不中断对话
- 希望根据具体场景选择保留还是删除内容

## 核心思路

DCP 提供了两个工具，让 AI 在对话中主动优化上下文：

| 工具 | 用途 | 是否保留内容 |
|--- | --- | ---|
| **discard** | 移除已完成的任务或噪声 | ❌ 不保留 |
| **extract** | 提取关键发现后删除原始内容 | ✅ 保留精简信息 |

### 工作机制

每次 AI 准备发送消息前，DCP 会：

```
1. 扫描当前会话中的工具调用
   ↓
2. 过滤已修剪、受保护的工具
   ↓
3. 生成 <prunable-tools> 列表
   格式：ID: tool, parameter
   ↓
4. 将列表注入到上下文中
   ↓
5. AI 根据列表选择工具并调用 discard/extract
   ↓
6. DCP 替换被修剪内容为占位符
```

### 选择工具的决策逻辑

AI 会根据这个流程选择：

```
"这个工具输出需要保留信息吗？"
  │
  ├─ 否 → discard（默认清理方式）
  │   - 任务完成，无价值内容
  │   - 噪声、无关信息
  │
  ├─ 是 → extract（保留知识）
  │   - 需要后续引用的关键信息
  │   - 函数签名、配置值等
  │
  └─ 不确定 → extract（更安全）
```

::: info
AI 会批量修剪，而不是修剪单个小工具输出。这样效率更高。
:::

### 保护机制

DCP 有多层保护，防止 AI 误修剪关键内容：

| 保护层 | 说明 | 配置项 |
|--- | --- | ---|
| **受保护工具** | 如 task、write、edit 等核心工具不能修剪 | `tools.settings.protectedTools` |
| **受保护文件** | 匹配 glob 模式的文件路径不能修剪 | `protectedFilePatterns` |
| **回合保护** | 新工具在 N 回合内不会被放入修剪列表 | `turnProtection.turns` |

::: tip
默认受保护的工具包括：task、todowrite、todoread、discard、extract、batch、write、edit、plan_enter、plan_exit
:::

## 跟我做

### 第 1 步：理解 `<prunable-tools>` 列表

在对话中，DCP 会自动注入 `<prunable-tools>` 列表。AI 看到这样的内容：

```xml
<prunable-tools>
The following tools have been invoked and are available for pruning.
This list does not mandate immediate action.
Consider your current goals and resources you need before discarding valuable tool inputs or outputs.
Consolidate your prunes for efficiency; it is rarely worth pruning a single tiny tool output.
Keep your context free of noise.

5: read, /path/to/auth.ts
12: bash, npm test
18: grep, "function login"
</prunable-tools>
```

**你应该看到**：
- 每行一个工具，格式为 `ID: tool, parameter`
- ID 是数字索引（从 0 开始）
- 只显示可修剪的工具（已修剪、受保护、保护文件不会显示）

### 第 2 步：查看 AI 使用 discard 的场景

当 AI 完成一个任务，判断无需保留信息时：

```
用户输入：测试认证功能

AI 输出：
测试通过。认证逻辑正常工作，无需保留测试日志。
[调用 discard(ids: ["completion", "5", "12"])]
```

**你应该看到**：
- AI 使用了 `discard` 工具
- 参数格式：`["原因", "ID1", "ID2", ...]`
- 原因只有两种：`"completion"`（任务完成）或 `"noise"`（噪声）

### 第 3 步：查看 AI 使用 extract 的场景

当 AI 完成任务后需要保留关键信息时：

```
用户输入：分析认证服务的实现

AI 输出：
我发现了一些关键细节，提取如下：
[调用 extract(ids: ["5", "12"], distillation: [
  "auth.ts: validateToken 检查缓存 (5min TTL) 后调用 OIDC",
  "bash: npm test 结果 - 所有测试通过"
])]
```

**你应该看到**：
- AI 使用了 `extract` 工具
- `distillation` 数组与 `ids` 数组长度一致
- 每个提取内容对应一个工具输出的精简信息

### 第 4 步：配置修剪工具选项

编辑 DCP 配置文件（`~/.config/opencode/dcp.jsonc` 或项目级 `.opencode/dcp.jsonc`）：

```jsonc
{
  "tools": {
    "discard": {
      "enabled": true
    },
    "extract": {
      "enabled": true,
      "showDistillation": false
    },
    "settings": {
      "nudgeEnabled": true,
      "nudgeFrequency": 10,
      "protectedTools": [
        "task",
        "todowrite",
        "todoread",
        "discard",
        "extract",
        "batch",
        "write",
        "edit",
        "plan_enter",
        "plan_exit"
      ]
    }
  }
}
```

**你应该看到**：
- `discard.enabled`：启用 discard 工具（默认 true）
- `extract.enabled`：启用 extract 工具（默认 true）
- `extract.showDistillation`：是否显示提取内容（默认 false）
- `nudgeEnabled`：是否启用修剪提醒（默认 true）
- `nudgeFrequency`：提醒频率（默认 10，即每 10 次工具调用）

**你应该看到**：
- 如果 `showDistillation` 为 false，提取内容不会显示在对话中
- 如果 `showDistillation` 为 true，提取内容以 ignored message 形式显示

### 第 5 步：测试修剪功能

1. 进行一次较长的对话，触发多个工具调用
2. 观察 AI 是否在适当时机调用 discard 或 extract
3. 使用 `/dcp stats` 查看修剪统计

**你应该看到**：
- 在工具调用累积到一定数量后，AI 开始主动修剪
- `/dcp stats` 显示已节省的 Token 数量
- 对话上下文更加聚焦于当前任务

## 检查点 ✅

::: details 点击展开验证你的配置

**检查配置是否生效**

```bash
# 查看 DCP 配置
cat ~/.config/opencode/dcp.jsonc

# 或项目级配置
cat .opencode/dcp.jsonc
```

你应该看到：
- `tools.discard.enabled` 为 true（启用 discard）
- `tools.extract.enabled` 为 true（启用 extract）
- `tools.settings.nudgeEnabled` 为 true（启用提醒）

**检查修剪是否工作**

在对话中，触发多个工具调用后：

你应该看到：
- AI 在适当时机调用 discard 或 extract
- 收到修剪通知（显示被修剪的工具和节省的 Token）
- `/dcp stats` 显示累计节省的 Token

:::

## 踩坑提醒

### 常见错误 1：AI 没有修剪工具

**可能原因**：
- 修剪工具未启用
- 保护配置过于严格，没有可修剪的工具

**解决方法**：
```jsonc
{
  "tools": {
    "discard": {
      "enabled": true  // 确保启用
    },
    "extract": {
      "enabled": true  // 确保启用
    }
  }
}
```

### 常见错误 2：误修剪了关键内容

**可能原因**：
- 关键文件没有加入保护模式
- 受保护工具列表不完整

**解决方法**：
```jsonc
{
  "protectedFilePatterns": [
    "src/auth/*",  // 保护认证相关文件
    "config/*"     // 保护配置文件
  ],
  "tools": {
    "settings": {
      "protectedTools": [
        "read",  // 添加 read 到保护列表
        "write"
      ]
    }
  }
}
```

### 常见错误 3：看不到提取内容

**可能原因**：
- `showDistillation` 配置为 false

**解决方法**：
```jsonc
{
  "tools": {
    "extract": {
      "showDistillation": true  // 启用显示
    }
  }
}
```

::: warning
提取内容会以 ignored message 形式显示，不影响对话上下文。
:::

## 本课小结

DCP 提供了两个工具让 AI 自主优化上下文：

- **discard**：移除已完成任务或噪声，无需保留信息
- **extract**：提取关键发现后删除原始内容，保留精简信息

AI 通过 `<prunable-tools>` 列表了解可修剪的工具，并根据场景选择合适的工具。保护机制确保关键内容不会被误修剪。

配置要点：
- 启用工具：`tools.discard.enabled` 和 `tools.extract.enabled`
- 显示提取内容：`tools.extract.showDistillation`
- 调整提醒频率：`tools.settings.nudgeFrequency`
- 保护关键工具和文件：`protectedTools` 和 `protectedFilePatterns`

## 下一课预告

> 下一课我们学习 **[Slash 命令使用](../commands/)**
>
> 你会学到：
> - 使用 `/dcp context` 查看当前会话的 Token 分布
> - 使用 `/dcp stats` 查看累计修剪统计
> - 使用 `/dcp sweep` 手动触发修剪

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| discard 工具定义 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L180) | 155-180 |
| extract 工具定义 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| 修剪操作执行 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L26-L153) | 26-153 |
|--- | --- | ---|
| 修剪上下文注入 | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L102-L156) | 102-156 |
| discard 工具规范 | [`lib/prompts/discard-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/discard-tool-spec.ts#L1-L41) | 1-41 |
| extract 工具规范 | [`lib/prompts/extract-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/extract-tool-spec.ts#L1-L48) | 1-48 |
| 系统提示词（both） | [`lib/prompts/system/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/system/both.ts#L1-L60) | 1-60 |
| 提醒提示词 | [`lib/prompts/nudge/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/nudge/both.ts#L1-L10) | 1-10 |
| 配置定义 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L436-L449) | 436-449 |
| 默认受保护工具 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-L441) | 438-441 |

**关键常量**：
- `DISCARD_TOOL_DESCRIPTION`：discard 工具的提示词说明
- `EXTRACT_TOOL_DESCRIPTION`：extract 工具的提示词说明
- `DEFAULT_PROTECTED_TOOLS`：默认受保护工具列表

**关键函数**：
- `createDiscardTool(ctx)`：创建 discard 工具
- `createExtractTool(ctx)`：创建 extract 工具
- `executePruneOperation(ctx, toolCtx, ids, reason, toolName, distillation)`：执行修剪操作
- `buildPrunableToolsList(state, config, logger, messages)`：生成可修剪工具列表
- `insertPruneToolContext(state, config, logger, messages)`：注入修剪上下文

**配置项**：
- `tools.discard.enabled`：是否启用 discard 工具（默认 true）
- `tools.extract.enabled`：是否启用 extract 工具（默认 true）
- `tools.extract.showDistillation`：是否显示提取内容（默认 false）
- `tools.settings.nudgeEnabled`：是否启用提醒（默认 true）
- `tools.settings.nudgeFrequency`：提醒频率（默认 10）
- `tools.settings.protectedTools`：受保护工具列表
- `protectedFilePatterns`：受保护文件 glob 模式

</details>
