---
title: "API 参考: 插件接口文档 | opencode-dynamic-context-pruning"
sidebarTitle: "插件 API 参考"
subtitle: "DCP API 参考"
description: "学习 OpenCode DCP 插件的完整 API 参考文档，包含插件入口函数、配置接口、工具定义、钩子处理器和会话状态管理接口的详细说明。"
tags:
  - "API"
  - "插件开发"
  - "接口参考"
prerequisite:
  - "start-configuration"
order: 3
---

# DCP API 参考

## 学完你能做什么

本节为插件开发者提供 DCP 的完整 API 参考，让你能够：

- 理解 DCP 的插件入口和钩子机制
- 掌握配置接口和所有配置项的作用
- 了解 discard 和 extract 工具的规范
- 使用状态管理 API 进行会话状态操作

## 核心概念

DCP 插件基于 OpenCode Plugin SDK，通过注册钩子、工具和命令来实现上下文修剪功能。

**插件生命周期**：

```
1. OpenCode 加载插件
    ↓
2. Plugin 函数执行
    ↓
3. 注册钩子、工具、命令
    ↓
4. OpenCode 调用钩子处理消息
    ↓
5. 插件执行修剪逻辑
    ↓
6. 返回修改后的消息
```

---

## 插件入口 API

### Plugin 函数

DCP 的主入口函数，返回插件配置对象。

**签名**：

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // 插件初始化逻辑
    return {
        // 注册的钩子、工具、命令
    }) satisfies Plugin

export default plugin
```

**参数**：

| 参数名 | 类型 | 描述 |
|--- | --- | ---|
| ctx | `PluginInput` | OpenCode 插件上下文，包含 client 和 directory 等信息 |

**返回值**：

插件配置对象，包含以下字段：

| 字段 | 类型 | 描述 |
|--- | --- | ---|
| `experimental.chat.system.transform` | `Handler` | 系统提示词注入钩子 |
| `experimental.chat.messages.transform` | `Handler` | 消息转换钩子 |
| `chat.message` | `Handler` | 消息捕获钩子 |
| `command.execute.before` | `Handler` | 命令执行钩子 |
| `tool` | `Record<string, Tool>` | 注册的工具映射 |
| `config` | `ConfigHandler` | 配置变异钩子 |

**源码位置**：[`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## 配置 API

### PluginConfig 接口

DCP 的完整配置类型定义。

```typescript
export interface PluginConfig {
    enabled: boolean
    debug: boolean
    pruneNotification: "off" | "minimal" | "detailed"
    commands: Commands
    turnProtection: TurnProtection
    protectedFilePatterns: string[]
    tools: Tools
    strategies: {
        deduplication: Deduplication
        supersedeWrites: SupersedeWrites
        purgeErrors: PurgeErrors
    }
}
```

**源码位置**：[`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### 配置项详解

#### 顶层配置

| 配置项 | 类型 | 默认值 | 描述 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | 是否启用插件 |
| `debug` | `boolean` | `false` | 是否启用调试日志，日志写入 `~/.config/opencode/logs/dcp/` |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | 通知显示模式 |
| `protectedFilePatterns` | `string[]` | `[]` | 文件保护 glob 模式列表，匹配的文件不会被修剪 |

#### Commands 配置

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| 字段 | 类型 | 默认值 | 描述 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | 是否启用 `/dcp` 命令 |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 命令保护工具列表，这些工具不会被 `/dcp sweep` 修剪 |

#### TurnProtection 配置

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| 字段 | 类型 | 默认值 | 描述 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `false` | 是否启用回合保护 |
| `turns` | `number` | `4` | 保护回合数，最近 N 个回合的工具不会被修剪 |

#### Tools 配置

```typescript
export interface Tools {
    settings: ToolSettings
    discard: DiscardTool
    extract: ExtractTool
}
```

**ToolSettings**：

```typescript
export interface ToolSettings {
    nudgeEnabled: boolean
    nudgeFrequency: number
    protectedTools: string[]
}
```

| 字段 | 类型 | 默认值 | 描述 |
|--- | --- | --- | ---|
| `nudgeEnabled` | `boolean` | `true` | 是否启用 AI 提醒 |
| `nudgeFrequency` | `number` | `10` | 提醒频率，每 N 个工具结果后提醒 AI 使用修剪工具 |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 工具保护列表 |

**DiscardTool**：

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| 字段 | 类型 | 默认值 | 描述 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | 是否启用 discard 工具 |

**ExtractTool**：

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| 字段 | 类型 | 默认值 | 描述 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | 是否启用 extract 工具 |
| `showDistillation` | `boolean` | `false` | 是否在通知中显示提取内容 |

#### Strategies 配置

**Deduplication**：

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| 字段 | 类型 | 默认值 | 描述 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | 是否启用去重策略 |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 不参与去重的工具列表 |

**SupersedeWrites**：

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| 字段 | 类型 | 默认值 | 描述 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `false` | 是否启用覆盖写入策略 |

**PurgeErrors**：

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| 字段 | 类型 | 默认值 | 描述 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | 是否启用错误清理策略 |
| `turns` | `number` | `4` | 错误清理阈值（回合数） |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 不参与清理的工具列表 |

### getConfig 函数

加载并合并多层级配置。

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**参数**：

| 参数名 | 类型 | 描述 |
|--- | --- | ---|
| ctx | `PluginInput` | OpenCode 插件上下文 |

**返回值**：

合并后的配置对象，优先级从高到低：

1. 项目配置 (`.opencode/dcp.jsonc`)
2. 环境变量配置 (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. 全局配置 (`~/.config/opencode/dcp.jsonc`)
4. 默认配置（代码中定义）

**源码位置**：[`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## 工具 API

### createDiscardTool

创建 discard 工具，用于移除已完成的任务或噪声工具输出。

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**参数**：

| 参数名 | 类型 | 描述 |
|--- | --- | ---|
| ctx | `PruneToolContext` | 工具上下文，包含 client、state、logger、config、workingDirectory |

**工具规范**：

| 字段 | 类型 | 描述 |
|--- | --- | ---|
| `ids` | `string[]` | 首元素为原因（`'completion'` 或 `'noise'`），后续为数字 ID |

**源码位置**：[`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

创建 extract 工具，用于提取关键发现后删除原始工具输出。

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**参数**：

| 参数名 | 类型 | 描述 |
|--- | --- | ---|
| ctx | `PruneToolContext` | 工具上下文，包含 client、state、logger、config、workingDirectory |

**工具规范**：

| 字段 | 类型 | 描述 |
|--- | --- | ---|
| `ids` | `string[]` | 数字 ID 数组 |
| `distillation` | `string[]` | 提取内容数组，长度与 ids 一致 |

**源码位置**：[`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## 状态 API

### SessionState 接口

会话状态对象，管理单个会话的运行时状态。

```typescript
export interface SessionState {
    sessionId: string | null
    isSubAgent: boolean
    prune: Prune
    stats: SessionStats
    toolParameters: Map<string, ToolParameterEntry>
    nudgeCounter: number
    lastToolPrune: boolean
    lastCompaction: number
    currentTurn: number
    variant: string | undefined
}
```

**字段说明**：

| 字段 | 类型 | 描述 |
|--- | --- | ---|
| `sessionId` | `string \| null` | OpenCode 会话 ID |
| `isSubAgent` | `boolean` | 是否为子代理会话 |
| `prune` | `Prune` | 修剪状态 |
| `stats` | `SessionStats` | 统计数据 |
| `toolParameters` | `Map<string, ToolParameterEntry>` | 工具调用缓存（callID → 元数据） |
| `nudgeCounter` | `number` | 累计工具调用次数（用于触发提醒） |
| `lastToolPrune` | `boolean` | 上一次操作是否为修剪工具 |
| `lastCompaction` | `number` | 最后一次上下文压缩时间戳 |
| `currentTurn` | `number` | 当前回合数 |
| `variant` | `string \| undefined` | 模型变体（如 claude-3.5-sonnet） |

**源码位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### SessionStats 接口

会话级别的 Token 修剪统计。

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**字段说明**：

| 字段 | 类型 | 描述 |
|--- | --- | ---|
| `pruneTokenCounter` | `number` | 当前会话已修剪 Token 数（累计） |
| `totalPruneTokens` | `number` | 历史累计已修剪 Token 数 |

**源码位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Prune 接口

修剪状态对象。

```typescript
export interface Prune {
    toolIds: string[]
}
```

**字段说明**：

| 字段 | 类型 | 描述 |
|--- | --- | ---|
| `toolIds` | `string[]` | 已标记修剪的工具调用 ID 列表 |

**源码位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### ToolParameterEntry 接口

单个工具调用的元数据缓存。

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**字段说明**：

| 字段 | 类型 | 描述 |
|--- | --- | ---|
| `tool` | `string` | 工具名称 |
| `parameters` | `any` | 工具参数 |
| `status` | `ToolStatus \| undefined` | 工具执行状态 |
| `error` | `string \| undefined` | 错误信息（如有） |
| `turn` | `number` | 创建该调用的回合数 |

**ToolStatus 枚举**：

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**源码位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

创建新的会话状态对象。

```typescript
export function createSessionState(): SessionState
```

**返回值**：初始化的 SessionState 对象

---

## 钩子 API

### createSystemPromptHandler

创建系统提示词注入钩子处理器。

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**参数**：

| 参数名 | 类型 | 描述 |
|--- | --- | ---|
| state | `SessionState` | 会话状态对象 |
| logger | `Logger` | 日志系统实例 |
| config | `PluginConfig` | 配置对象 |

**行为**：

- 检查是否为子代理会话，如果是则跳过
- 检查是否为内部代理（如摘要生成器），如果是则跳过
- 根据配置加载对应的提示词模板（both/discard/extract）
- 将修剪工具说明注入到系统提示词

**源码位置**：[`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

创建消息转换钩子处理器，执行自动修剪逻辑。

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**参数**：

| 参数名 | 类型 | 描述 |
|--- | --- | ---|
| client | `any` | OpenCode 客户端实例 |
| state | `SessionState` | 会话状态对象 |
| logger | `Logger` | 日志系统实例 |
| config | `PluginConfig` | 配置对象 |

**处理流程**：

1. 检查会话状态（是否为子代理）
2. 同步工具缓存
3. 执行自动策略（去重、覆盖写入、清除错误）
4. 修剪已标记的工具内容
5. 注入 `<prunable-tools>` 列表
6. 保存上下文快照（如果配置了）

**源码位置**：[`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

创建命令执行钩子处理器，处理 `/dcp` 系列命令。

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**参数**：

| 参数名 | 类型 | 描述 |
|--- | --- | ---|
| client | `any` | OpenCode 客户端实例 |
| state | `SessionState` | 会话状态对象 |
| logger | `Logger` | 日志系统实例 |
| config | `PluginConfig` | 配置对象 |
| workingDirectory | `string` | 工作目录路径 |

**支持的命令**：

- `/dcp` - 显示帮助信息
- `/dcp context` - 显示当前会话 Token 使用分析
- `/dcp stats` - 显示累计修剪统计
- `/dcp sweep [n]` - 手动修剪工具（可选指定数量）

**源码位置**：[`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## 本课小结

本节提供了 DCP 插件的完整 API 参考，涵盖了：

- 插件入口函数和钩子注册机制
- 配置接口和所有配置项的详细说明
- discard 和 extract 工具的规范和创建方法
- 会话状态、统计数据和工具缓存的类型定义
- 系统提示词、消息转换和命令执行的钩子处理器

如果你需要深入了解 DCP 的内部实现细节，建议阅读[架构概览](/zh/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/)和[Token 计算原理](/zh/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/)。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| 插件入口函数 | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)         | 12-102   |
| 配置接口定义 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66   |
| getConfig 函数 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797   |
| discard 工具创建 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181   |
| extract 工具创建 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220   |
| 状态类型定义 | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39   |
| 系统提示词钩子 | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53   |
| 消息转换钩子 | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82) | 55-82   |
| 命令执行钩子 | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156   |

**关键类型**：
- `Plugin`: OpenCode 插件函数签名
- `PluginConfig`: DCP 配置接口
- `SessionState`: 会话状态接口
- `ToolStatus`: 工具状态枚举（pending | running | completed | error）

**关键函数**：
- `plugin()`: 插件入口函数
- `getConfig()`: 加载和合并配置
- `createDiscardTool()`: 创建 discard 工具
- `createExtractTool()`: 创建 extract 工具
- `createSessionState()`: 创建会话状态

</details>
