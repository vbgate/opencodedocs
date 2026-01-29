---
title: "会话恢复: 工具中断自动修复 | Antigravity"
sidebarTitle: "工具中断自动修复"
subtitle: "会话恢复：自动处理工具调用失败和中断"
description: "学习会话恢复机制，自动处理工具中断和错误。涵盖错误检测、synthetic tool_result 注入和 auto_resume 配置。"
tags:
  - "advanced"
  - "session-recovery"
  - "error-handling"
  - "auto-recovery"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 8
---

# 会话恢复：自动处理工具调用失败和中断

## 学完你能做什么

- 理解会话恢复机制如何自动处理工具执行中断
- 配置 session_recovery 和 auto_resume 选项
- 排查 tool_result_missing 和 thinking_block_order 错误
- 理解 synthetic tool_result 的工作原理

## 你现在的困境

使用 OpenCode 时，你可能会遇到这些中断场景：

- 工具执行时按 ESC 中断，导致会话卡住，需要手动重试
- 思考块顺序错误（thinking_block_order），AI 无法继续生成
- 在非思考模型中误用了思考功能（thinking_disabled_violation）
- 需要手动修复损坏的会话状态，浪费时间

## 什么时候用这一招

会话恢复适合以下场景：

| 场景 | 错误类型 | 恢复方式 |
| ---- | -------- | ------ |
| 按 ESC 中断工具 | `tool_result_missing` | 自动注入 synthetic tool_result |
| 思考块顺序错误 | `thinking_block_order` | 自动预置空思考块 |
| 非思考模型用思考 | `thinking_disabled_violation` | 自动剥离所有思考块 |
| 所有上述错误 | 通用 | 自动修复 + 自动 continue（如果启用） |

::: warning 前置检查
开始本教程前，请确保你已经完成：
- ✅ 安装了 opencode-antigravity-auth 插件
- ✅ 可以使用 Antigravity 模型发起请求
- ✅ 理解工具调用的基本概念

[快速安装教程](../../start/quick-install/) | [首次请求教程](../../start/first-request/)
:::

## 核心思路

会话恢复的核心机制：

1. **错误检测**：自动识别三种可恢复的错误类型
   - `tool_result_missing`：工具执行时缺少结果
   - `thinking_block_order`：思考块顺序错误
   - `thinking_disabled_violation`：非思考模型禁止思考

2. **自动修复**：根据错误类型注入 synthetic 消息
   - 注入 synthetic tool_result（内容为 "Operation cancelled by user (ESC pressed)"）
   - 预置空思考块（thinking 块必须在消息开头）
   - 剥离所有思考块（非思考模型不允许思考）

3. **自动继续**：如果启用了 `auto_resume`，自动发送 continue 消息恢复对话

4. **去重处理**：使用 `Set` 防止同一错误被重复处理

::: info 什么是 synthetic 消息？
Synthetic 消息是插件注入的"虚拟"消息，用于修复损坏的会话状态。例如，当工具被中断时，插件会注入一个 synthetic tool_result，告诉 AI "这个工具已被取消"，让 AI 能够继续生成新的回复。
:::

## 跟我做

### 第 1 步：启用会话恢复（默认已启用）

**为什么**
会话恢复默认启用，但如果之前手动关闭过，需要重新开启。

**操作**

编辑插件配置文件：

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

确认以下配置：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**你应该看到**：

1. `session_recovery` 为 `true`（默认值）
2. `auto_resume` 为 `false`（推荐手动 continue，避免误操作）
3. `quiet_mode` 为 `false`（显示 toast 通知，便于了解恢复状态）

::: tip 配置项说明
- `session_recovery`：启用/禁用会话恢复功能
- `auto_resume`：自动发送 "continue" 消息（慎用，可能导致 AI 意外执行）
- `quiet_mode`：隐藏 toast 通知（调试时可以关闭）
:::

### 第 2 步：测试 tool_result_missing 恢复

**为什么**
验证当工具执行被中断时，会话恢复机制是否正常工作。

**操作**

1. 打开 OpenCode，选择一个支持工具调用的模型（如 `google/antigravity-claude-sonnet-4-5`）
2. 输入一个需要调用工具的任务（例如："帮我查看当前目录的文件"）
3. 在工具执行过程中按 `ESC` 中断

**你应该看到**：

1. OpenCode 立即停止工具执行
2. 弹出 toast 通知："Tool Crash Recovery - Injecting cancelled tool results..."
3. AI 自动继续生成，不再等待工具结果

::: info tool_result_missing 错误原理
当你按 ESC 时，OpenCode 会中断工具执行，导致会话中出现 `tool_use` 但缺少对应的 `tool_result`。Antigravity API 会检测到这个不一致，返回 `tool_result_missing` 错误。插件捕获这个错误，注入 synthetic tool_result，使会话恢复一致状态。
:::

### 第 3 步：测试 thinking_block_order 恢复

**为什么**
验证当思考块顺序错误时，会话恢复机制能否自动修复。

**操作**

1. 打开 OpenCode，选择一个支持思考的模型（如 `google/antigravity-claude-opus-4-5-thinking`）
2. 输入一个需要深入思考的任务
3. 如果遇到 "Expected thinking but found text" 或 "First block must be thinking" 错误

**你应该看到**：

1. 弹出 toast 通知："Thinking Block Recovery - Fixing message structure..."
2. 会话自动修复，AI 能够继续生成

::: tip thinking_block_order 错误原因
这个错误通常由以下原因引起：
- 思考块被意外剥离（例如通过其他工具）
- 会话状态损坏（例如磁盘写入失败）
- 跨模型迁移时格式不兼容
:::

### 第 4 步：测试 thinking_disabled_violation 恢复

**为什么**
验证在非思考模型中误用思考功能时，会话恢复能否自动剥离思考块。

**操作**

1. 打开 OpenCode，选择一个不支持思考的模型（如 `google/antigravity-claude-sonnet-4-5`）
2. 如果历史消息中包含思考块

**你应该看到**：

1. 弹出 toast 通知："Thinking Strip Recovery - Stripping thinking blocks..."
2. 所有思考块被自动移除
3. AI 能够继续生成

::: warning 思考块丢失
剥离思考块会导致 AI 的思考内容丢失，可能影响回答质量。请确保在思考模型中使用思考功能。
:::

### 第 5 步：配置 auto_resume（可选）

**为什么**
启用 auto_resume 后，会话恢复完成后会自动发送 "continue"，无需手动操作。

**操作**

在 `antigravity.json` 中设置：

```json
{
  "auto_resume": true
}
```

保存文件并重启 OpenCode。

**你应该看到**：

1. 会话恢复完成后，AI 自动继续生成
2. 不需要手动输入 "continue"

::: danger auto_resume 风险
自动 continue 可能导致 AI 意外执行工具调用。如果你对工具调用的安全性有疑虑，建议保持 `auto_resume: false`，手动控制恢复时机。
:::

## 检查点 ✅

完成上述步骤后，你应该能够：

- [ ] 在 `antigravity.json` 中看到 session_recovery 配置
- [ ] 按 ESC 中断工具时看到 "Tool Crash Recovery" 通知
- [ ] 会话自动恢复，无需手动重试
- [ ] 理解 synthetic tool_result 的工作原理
- [ ] 知道何时启用/禁用 auto_resume

## 踩坑提醒

### 会话恢复未触发

**症状**：遇到错误但没有自动恢复

**原因**：`session_recovery` 被禁用或错误类型不匹配

**解决方案**：

1. 确认 `session_recovery: true`：

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. 检查错误类型是否为可恢复错误：

```bash
# 启用调试日志查看详细错误信息
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. 查看控制台是否有错误日志：

```bash
# 日志位置
~/.config/opencode/antigravity-logs/session-recovery.log
```

### Synthetic tool_result 未注入

**症状**：工具中断后，AI 仍然等待工具结果

**原因**：OpenCode 的存储路径配置错误

**解决方案**：

1. 确认 OpenCode 的存储路径正确：

```bash
# 查看 OpenCode 配置
cat ~/.config/opencode/opencode.json | grep storage
```

2. 检查消息和部分存储目录是否存在：

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. 如果目录不存在，检查 OpenCode 的配置

### Auto Resume 意外触发

**症状**：AI 在不合适的时候自动继续

**原因**：`auto_resume` 设置为 `true`

**解决方案**：

1. 关闭 auto_resume：

```json
{
  "auto_resume": false
}
```

2. 手动控制恢复时机

### Toast 通知太频繁

**症状**：频繁弹出恢复通知，影响使用体验

**原因**：`quiet_mode` 未启用

**解决方案**：

1. 启用 quiet_mode：

```json
{
  "quiet_mode": true
}
```

2. 如果需要调试，可以临时关闭

## 本课小结

- 会话恢复机制自动处理三种可恢复错误：tool_result_missing、thinking_block_order、thinking_disabled_violation
- Synthetic tool_result 是修复会话状态的关键，注入内容为 "Operation cancelled by user (ESC pressed)"
- session_recovery 默认启用，auto_resume 默认关闭（推荐手动控制）
- 思考块恢复（thinking_block_order）会预置空思考块，使 AI 能够重新生成思考内容
- 思考块剥离（thinking_disabled_violation）会导致思考内容丢失，请确保在思考模型中使用思考功能

## 下一课预告

> 下一课我们学习 **[请求转换机制](../request-transformation/)**。
>
> 你会学到：
> - Claude 和 Gemini 请求格式的差异
> - Tool Schema 清理和转换规则
> - 思考块签名注入机制
> - Google Search Grounding 配置方法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能        | 文件路径                                                                                    | 行号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| 会话恢复主逻辑 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | 全文   |
| 错误类型检测   | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110  |
| tool_result_missing 恢复 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| thinking_block_order 恢复 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| thinking_disabled_violation 恢复 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| 存储工具函数   | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | 全文   |
| 消息读取     | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78   |
| 部分（part）读取 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104  |
| 预置思考块   | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| 剥离思考块   | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| 类型定义     | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | 全文   |

**关键常量**：

| 常量名 | 值 | 说明 |
| -------- | --- | ---- |
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Auto Resume 时发送的恢复文本 |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | 思考块类型集合 |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | 元数据类型集合 |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | 内容类型集合 |

**关键函数**：

- `detectErrorType(error: unknown): RecoveryErrorType`：检测错误类型，返回 `"tool_result_missing"`、`"thinking_block_order"`、`"thinking_disabled_violation"` 或 `null`
- `isRecoverableError(error: unknown): boolean`：判断错误是否可恢复
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null`：创建会话恢复钩子
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>`：恢复 tool_result_missing 错误
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>`：恢复 thinking_block_order 错误
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>`：恢复 thinking_disabled_violation 错误
- `readMessages(sessionID): StoredMessageMeta[]`：读取会话的所有消息
- `readParts(messageID): StoredPart[]`：读取消息的所有部分（parts）
- `prependThinkingPart(sessionID, messageID): boolean`：在消息开头预置空思考块
- `stripThinkingParts(messageID): boolean`：移除消息中的所有思考块

**配置项**（来自 schema.ts）：

| 配置项 | 类型 | 默认值 | 说明 |
| -------- | ---- | ------ | ---- |
| `session_recovery` | boolean | `true` | 启用会话恢复功能 |
| `auto_resume` | boolean | `false` | 自动发送 "continue" 消息 |
| `quiet_mode` | boolean | `false` | 隐藏 toast 通知 |

</details>
