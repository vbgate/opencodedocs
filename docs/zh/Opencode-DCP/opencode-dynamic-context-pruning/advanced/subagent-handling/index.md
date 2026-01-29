---
title: "子代理处理: 自动禁用机制 | opencode-dynamic-context-pruning"
subtitle: "子代理处理: 自动禁用机制"
sidebarTitle: "子代理不修剪？原来如此"
description: "学习 DCP 在子代理会话中的行为和限制。理解为何 DCP 自动禁用子代理修剪，以及子代理与主代理在 Token 使用上的不同策略。"
tags:
  - "子代理"
  - "会话管理"
  - "使用限制"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 4
---

# 子代理处理

## 学完你能做什么

- 理解 DCP 为什么会在子代理会话中自动禁用
- 知道子代理与主代理在 Token 使用上的不同策略
- 避免在子代理中使用 DCP 功能导致的问题

## 你现在的困境

你可能注意到了：在有些 OpenCode 对话中，DCP 的修剪功能似乎"不工作了"——工具调用没有被清理，Token 节省统计也没有变化。这可能发生在你使用某些特定的 OpenCode 功能时，比如代码审查、深度分析等。

这不是 DCP 出问题了，而是这些功能使用了**子代理（Subagent）**机制，而 DCP 对子代理有特殊处理。

## 什么是子代理

::: info 子代理（Subagent）是什么？

**子代理**是 OpenCode 的内部 AI 代理机制。主代理将复杂任务委托给子代理处理，子代理完成后以摘要形式返回结果。

**典型使用场景**：
- 代码审查：主代理启动子代理，子代理仔细读取多个文件，分析问题，然后返回一个简洁的问题列表
- 深度分析：主代理启动子代理，子代理进行大量工具调用和推理，最后返回核心发现

从技术角度，子代理会话有一个 `parentID` 属性，指向其父会话。
:::

## DCP 对子代理的行为

DCP 在子代理会话中会**自动禁用所有修剪功能**。

### 为什么 DCP 不修剪子代理？

这背后有一个重要的设计理念：

| 角色       | Token 使用策略             | 核心目标                     |
|--- | --- | ---|
| **主代理** | 需要高效使用 Token        | 长对话保持上下文，降低成本    |
| **子代理** | 可以自由使用 Token        | 生成丰富的信息，便于主代理汇总 |

**子代理的价值**在于它能"花 Token 换信息质量"——通过大量工具调用和详细分析，为父代理提供高质量的信息汇总。如果 DCP 在子代理中修剪了工具调用，可能会导致：

1. **信息丢失**：子代理的详细分析过程被删除，无法生成完整摘要
2. **汇总质量下降**：主代理收到的摘要不完整，影响最终决策
3. **违背设计初衷**：子代理就是为"不惜 Token 换质量"设计的

**结论**：子代理不需要修剪，因为它最终只返回一个简洁的摘要给父代理。

### DCP 如何检测子代理

DCP 通过以下步骤检测当前会话是否为子代理：

```typescript
// lib/state/utils.ts:1-8
export async function isSubAgentSession(client: any, sessionID: string): Promise<boolean> {
    try {
        const result = await client.session.get({ path: { id: sessionID } })
        return !!result.data?.parentID  // 如果有 parentID，就是子代理
    } catch (error: any) {
        return false
    }
}
```

**检测时机**：
- 会话初始化时（`ensureSessionInitialized()`）
- 每次消息转换前（`createChatMessageTransformHandler()`）

### 子代理会话中 DCP 的行为

DCP 在检测到子代理后，会跳过以下功能：

| 功能               | 正常会话 | 子代理会话 | 跳过位置 |
|--- | --- | --- | ---|
| 系统提示词注入     | ✅ 执行  | ❌ 跳过    | `hooks.ts:26-28` |
| 自动修剪策略       | ✅ 执行  | ❌ 跳过    | `hooks.ts:64-66` |
| 工具列表注入       | ✅ 执行  | ❌ 跳过    | `hooks.ts:64-66` |

**代码实现**（`lib/hooks.ts`）：

```typescript
// 系统提示词处理器
export function createSystemPromptHandler(state: SessionState, ...) {
    return async (_input: unknown, output: { system: string[] }) => {
        if (state.isSubAgent) {  // ← 子代理检测
            return               // ← 直接返回，不注入修剪工具说明
        }
        // ... 正常逻辑
    }
}

// 消息转换处理器
export function createChatMessageTransformHandler(...) {
    return async (input: {}, output: { messages: WithParts[] }) => {
        await checkSession(client, state, logger, output.messages)

        if (state.isSubAgent) {  // ← 子代理检测
            return               // ← 直接返回，不执行任何修剪
        }

        // ... 正常逻辑：去重、覆盖写入、清除错误、注入工具列表等
    }
}
```

## 实际案例对比

### 案例 1：主代理会话

**场景**：你在与主代理对话，要求它分析代码

**DCP 行为**：
```
用户输入："分析 src/utils.ts 中的工具函数"
    ↓
[主代理] 读取 src/utils.ts
    ↓
[主代理] 分析代码
    ↓
用户输入："再检查 src/helpers.ts"
    ↓
DCP 检测到重复读取模式
    ↓
DCP 标记第一次 src/utils.ts 读取为可修剪 ✅
    ↓
上下文发送给 LLM 时，第一次读取内容被替换为占位符
    ↓
✅ Token 节省
```

### 案例 2：子代理会话

**场景**：主代理启动子代理进行深度代码审查

**DCP 行为**：
```
用户输入："深度审查 src/ 下的所有文件"
    ↓
[主代理] 检测到任务复杂，启动子代理
    ↓
[子代理] 读取 src/utils.ts
    ↓
[子代理] 读取 src/helpers.ts
    ↓
[子代理] 读取 src/config.ts
    ↓
[子代理] 读取更多文件...
    ↓
DCP 检测到子代理会话
    ↓
DCP 跳过所有修剪操作 ❌
    ↓
[子代理] 生成详细的审查结果
    ↓
[子代理] 返回简洁摘要给主代理
    ↓
[主代理] 基于摘要生成最终回复
```

## 常见问题

### Q: 如何确认当前会话是子代理？

**A**: 你可以通过以下方式确认：

 1. **查看 DCP 日志**（如果启用 debug 模式）：
   ```
   2026-01-23T10:30:45.123Z INFO state: session ID = abc-123
   2026-01-23T10:30:45.124Z INFO state: isSubAgent = true
   ```

2. **观察对话特征**：
   - 子代理通常在处理复杂任务时启动（如深度分析、代码审查）
   - 主代理会提示"正在启动子代理"或类似消息

3. **使用 /dcp stats 命令**：
   - 子代理会话中，工具调用不会被修剪
   - Token 统计中"已修剪"数量为 0

### Q: 子代理中完全不修剪，会不会很浪费 Token？

**A**: 不会。原因如下：

1. **子代理是短命的**：子代理完成任务后就结束，不像主代理那样进行长对话
2. **子代理返回摘要**：最终传给主代理的是简洁摘要，不会增加主代理的上下文负担
3. **设计目标不同**：子代理的目的是"用 Token 换质量"，而不是"省 Token"

### Q: 能否强制 DCP 修剪子代理？

**A**: **不能，也不应该**。DCP 的设计就是为了让子代理能够完整保留上下文，以便生成高质量的摘要。如果强制修剪，可能会：

- 导致摘要信息不完整
- 影响主代理的决策质量
- 违背 OpenCode 的子代理设计理念

### Q: 子代理会话中的 Token 使用会被统计吗？

**A**: 子代理会话本身不会被 DCP 统计。DCP 的统计只跟踪主代理会话中的 Token 节省。

## 本课小结

- **子代理检测**：DCP 通过检查 `session.parentID` 来识别子代理会话
- **自动禁用**：在子代理会话中，DCP 会自动跳过所有修剪功能
- **设计原因**：子代理需要完整上下文来生成高质量摘要，修剪会干扰这个过程
- **使用边界**：子代理不追求 Token 效率，而是追求信息质量，这与主代理的目标不同

## 下一课预告

> 下一课我们学习 **[常见问题与排错](/zh/Opencode-DCP/opencode-dynamic-context-pruning/faq/troubleshooting/)**。
>
> 你会学到：
> - 配置错误如何修复
> - 如何启用调试日志
> - Token 没有减少的常见原因
> - 子代理会话的限制

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能           | 文件路径                                                                                                              | 行号    |
|--- | --- | ---|
| 子代理检测函数 | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts)         | 1-8     |
| 会话状态初始化 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts)         | 80-116   |
| 系统提示词处理器（跳过子代理） | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts)         | 26-28    |
| 消息转换处理器（跳过子代理） | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts)         | 64-66    |
| SessionState 类型定义 | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts)         | 27-38    |

**关键函数**：
- `isSubAgentSession()`：通过 `session.parentID` 检测子代理
- `ensureSessionInitialized()`：初始化会话状态时检测子代理
- `createSystemPromptHandler()`：子代理会话跳过系统提示词注入
- `createChatMessageTransformHandler()`：子代理会话跳过所有修剪操作

**关键常量**：
- `state.isSubAgent`：会话状态中的子代理标志

</details>
