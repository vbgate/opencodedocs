---
title: "自动修剪: 三种策略 | opencode-dcp"
sidebarTitle: "用策略省 Token"
subtitle: "自动修剪: 三种策略 | opencode-dcp"
description: "学习 DCP 的三种自动修剪策略：去重、覆盖写入、清除错误。深入讲解工作原理、适用场景和配置方法，帮你节省 Token 成本并提升对话质量。所有策略零 LLM 成本。"
tags:
  - "自动修剪"
  - "策略"
  - "去重"
  - "覆盖写入"
  - "清除错误"
prerequisite:
  - "start-getting-started"
  - "start-configuration"
order: 1
---

# 自动修剪策略详解

## 学完你能做什么

- 理解三种自动修剪策略的工作原理
- 知道何时启用或禁用每种策略
- 通过配置优化策略效果

## 你现在的困境

随着对话越来越长，上下文中的工具调用堆积如山：
- AI 反复读取同一个文件，每次都把完整内容塞进上下文
- 写入文件后又读取，原来的写内容还在上下文里"吃灰"
- 工具调用失败后，庞大的输入参数一直占着位置

这些问题让 Token 账单越滚越大，还可能"污染"上下文，影响 AI 的判断。

## 核心思路

DCP 提供三种**自动修剪策略**，在每次发送请求前静默执行，**零 LLM 成本**：

| 策略 | 默认开关 | 作用 |
|--- | --- | ---|
| 去重 | ✅ 启用 | 检测重复工具调用，只保留最新一次 |
| 覆盖写入 | ❌ 禁用 | 清理已被读取覆盖的写操作输入 |
| 清除错误 | ✅ 启用 | 超过 N 回合后清理错误工具输入 |

所有策略都遵循以下规则：
- **跳过受保护工具**：task、write、edit 等关键工具不会被修剪
- **跳过受保护文件**：通过配置的 glob 模式保护的文件路径
- **保留错误消息**：清除错误策略只移除输入参数，错误信息保留

---

## 去重策略

### 工作原理

去重策略检测**相同工具名和参数**的重复调用，只保留最新一次。

::: info 签名匹配机制

DCP 通过"签名"判断重复：
- 工具名称相同
- 参数值相同（忽略 null/undefined，键顺序不影响）

例如：
```json
// 第 1 次调用
{ "tool": "read", "path": "src/config.ts" }

// 第 2 次调用（签名相同）
{ "tool": "read", "path": "src/config.ts" }

// 第 3 次调用（签名不同）
{ "tool": "read", "path": "src/utils.ts" }
```
:::

### 适用场景

**推荐启用**（默认开启）：
- AI 频繁读取同一文件进行代码分析
- 多轮对话中反复查询同一配置
- 需要保持最新状态，历史输出可丢弃的场景

**可能想禁用**：
- 需要保留每次工具调用的上下文（如调试工具输出）

### 配置方法

```json
// ~/.config/opencode/dcp.jsonc
{
  "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/main/dcp.schema.json",
  "strategies": {
    "deduplication": {
      "enabled": true  // true 启用，false 禁用
    }
  }
}
```

**受保护工具**（默认不修剪）：
- task、write、edit、batch、plan_enter、plan_exit
- todowrite、todoread（任务列表工具）
- discard、extract（DCP 自身工具）

这些工具即使在配置中也无法被去重修剪（硬编码保护）。

---

## 覆盖写入策略

### 工作原理

覆盖写入策略清理**已被后续读取覆盖的写操作输入**。

::: details 示例：写入后读取

```text
第 1 步：写入文件
AI 调用 write("config.json", {...})
↓
第 2 步：读取文件确认
AI 调用 read("config.json") → 返回最新内容
↓
覆盖写入策略识别
write 的输入（可能很大）变得冗余
因为 read 已经捕获了文件的当前状态
↓
修剪
只保留 read 的输出，移除 write 的输入
```

:::

### 适用场景

**推荐启用**：
- 频繁"写入→验证→修改"的迭代开发场景
- 写入操作包含大量模板或完整文件内容

**默认禁用原因**：
- 某些工作流依赖"历史写入记录"作为上下文
- 可能影响某些版本控制相关的工具调用

**何时手动启用**：
```json
{
  "strategies": {
    "supersedeWrites": {
      "enabled": true
    }
  }
}
```

### 注意事项

此策略**只修剪 write 工具的输入**，不修剪输出。因为：
- write 的输出通常是确认消息（很小）
- write 的输入可能包含完整文件内容（很大）

---

## 清除错误策略

### 工作原理

清除错误策略在工具调用失败后，等待 N 回合，然后移除**输入参数**（保留错误消息）。

::: info 回合（turn）是什么？
在 OpenCode 对话中：
- 用户发送消息 → AI 回复 = 1 个回合
- 工具调用不单独计回合

默认阈值为 4 回合，意味着错误工具的输入会在 4 个回合后自动清理。
:::

### 适用场景

**推荐启用**（默认开启）：
- 工具调用失败且输入很大（如读取超大文件失败）
- 错误信息需要保留，但输入参数不再有价值

**可能想禁用**：
- 需要保留失败工具的完整输入以供调试
- 频繁遇到"间歇性"错误，希望保留历史

### 配置方法

```json
{
  "strategies": {
    "purgeErrors": {
      "enabled": true,   // 启用开关
      "turns": 4        // 清除阈值（回合数）
    }
  }
}
```

**受保护工具**（默认不修剪）：
- 与去重策略相同的受保护工具列表

---

## 策略执行顺序

三种策略按**固定顺序**执行：

```mermaid
graph LR
    A["消息列表"] --> B["同步工具缓存"]
    B --> C["去重策略"]
    C --> D["覆盖写入策略"]
    D --> E["清除错误策略"]
    E --> F["修剪内容替换"]
```

这意味着：
1. 先去重（减少冗余）
2. 再覆盖写入（清理已失效的写入）
3. 最后清除错误（清理过期的错误输入）

每个策略都基于前一个策略的结果，不会重复修剪同一工具。

---

## 踩坑提醒

### ❌ 误区 1：以为会自动修剪所有工具

**问题**：为什么 task、write 等工具没有被修剪？

**原因**：这些工具在**受保护工具列表**中，硬编码保护。

**解决方案**：
- 如果确实需要修剪 write，考虑启用覆盖写入策略
- 如果需要修剪 task，可以通过配置添加受保护文件路径来间接控制

### ❌ 误区 2：覆盖写入策略导致上下文不完整

**问题**：启用覆盖写入后，AI 找不到之前的写入内容。

**原因**：策略只清理"已被读取覆盖"的写操作，但如果写入后从未读取，就不会被修剪。

**解决方案**：
- 检查文件是否真的被读取过（`/dcp context` 可查看）
- 如果确实需要保留写入记录，禁用此策略

### ❌ 误区 3：清除错误策略太快清理

**问题**：错误输入刚被修剪，AI 立即又遇到相同错误。

**原因**：`turns` 阈值设置太小。

**解决方案**：
```json
{
  "strategies": {
    "purgeErrors": {
      "turns": 8  // 从默认 4 增加到 8
    }
  }
}
```

---

## 什么时候用这一招

| 场景 | 推荐策略组合 |
|--- | ---|
| 日常开发（读多写少） | 去重 + 清除错误（默认配置） |
| 频繁写入验证 | 全部启用（手动开启覆盖写入） |
| 调试工具失败 | 只启用去重（禁用清除错误） |
| 需要完整上下文历史 | 全部禁用 |

---

## 本课小结

- **去重策略**：检测重复工具调用，保留最新一次（默认启用）
- **覆盖写入策略**：清理已被读取覆盖的写操作输入（默认禁用）
- **清除错误策略**：N 回合后清理错误工具输入（默认启用，阈值 4）
- 所有策略都跳过受保护工具和受保护文件路径
- 策略按固定顺序执行：去重 → 覆盖写入 → 清除错误

---

## 下一课预告

> 下一课我们学习 **[LLM 驱动修剪工具](../llm-tools/)**。
>
> 你会学到：
> - AI 如何自主调用 discard 和 extract 工具
> - 语义级上下文优化的实现方式
> - 提取关键发现的最佳实践

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 去重策略实现 | [`lib/strategies/deduplication.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/deduplication.ts) | 13-83 |
| 覆盖写入策略实现 | [`lib/strategies/supersede-writes.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/supersede-writes.ts) | 16-105 |
| 清除错误策略实现 | [`lib/strategies/purge-errors.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/purge-errors.ts) | 16-80 |
| 策略入口导出 | [`lib/strategies/index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/index.ts) | 1-5 |
| 默认配置 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 423-464 |
| 受保护工具列表 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 68-79 |

**关键函数**：
- `deduplicate()` - 去重策略主函数
- `supersedeWrites()` - 覆盖写入策略主函数
- `purgeErrors()` - 清除错误策略主函数
- `createToolSignature()` - 创建工具签名用于去重匹配
- `normalizeParameters()` - 参数归一化（去除 null/undefined）
- `sortObjectKeys()` - 参数键排序（确保签名一致性）

**默认配置值**：
- `strategies.deduplication.enabled = true`
- `strategies.supersedeWrites.enabled = false`
- `strategies.purgeErrors.enabled = true`
- `strategies.purgeErrors.turns = 4`

**受保护工具（默认不修剪）**：
- task、todowrite、todoread、discard、extract、batch、write、edit、plan_enter、plan_exit

</details>
