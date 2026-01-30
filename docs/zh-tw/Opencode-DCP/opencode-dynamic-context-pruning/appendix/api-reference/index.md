---
title: "API 參考: 外掛介面文件 | opencode-dynamic-context-pruning"
sidebarTitle: "外掛 API 參考"
subtitle: "DCP API 參考"
description: "學習 OpenCode DCP 外掛的完整 API 參考文件，包含外掛入口函數、設定介面、工具定義、鉤子處理器和會話狀態管理介面的詳細說明。"
tags:
  - "API"
  - "外掛開發"
  - "介面參考"
prerequisite:
  - "start-configuration"
order: 3
---

# DCP API 參考

## 學完你能做什麼

本節為外掛開發者提供 DCP 的完整 API 參考，讓你能夠：

- 理解 DCP 的外掛入口和鉤子機制
- 掌握設定介面和所有設定項的作用
- 了解 discard 和 extract 工具的規範
- 使用狀態管理 API 進行會話狀態操作

## 核心概念

DCP 外掛基於 OpenCode Plugin SDK，透過註冊鉤子、工具和命令來實現上下文修剪功能。

**外掛生命週期**：

```
1. OpenCode 載入外掛
    ↓
2. Plugin 函數執行
    ↓
3. 註冊鉤子、工具、命令
    ↓
4. OpenCode 呼叫鉤子處理訊息
    ↓
5. 外掛執行修剪邏輯
    ↓
6. 回傳修改後的訊息
```

---

## 外掛入口 API

### Plugin 函數

DCP 的主入口函數，回傳外掛設定物件。

**簽名**：

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // 外掛初始化邏輯
    return {
        // 註冊的鉤子、工具、命令
    }) satisfies Plugin

export default plugin
```

**參數**：

| 參數名 | 類型 | 描述 |
| --- | --- | --- |
| ctx | `PluginInput` | OpenCode 外掛上下文，包含 client 和 directory 等資訊 |

**回傳值**：

外掛設定物件，包含以下欄位：

| 欄位 | 類型 | 描述 |
| --- | --- | --- |
| `experimental.chat.system.transform` | `Handler` | 系統提示詞注入鉤子 |
| `experimental.chat.messages.transform` | `Handler` | 訊息轉換鉤子 |
| `chat.message` | `Handler` | 訊息捕獲鉤子 |
| `command.execute.before` | `Handler` | 命令執行鉤子 |
| `tool` | `Record<string, Tool>` | 註冊的工具對應 |
| `config` | `ConfigHandler` | 設定變異鉤子 |

**原始碼位置**：[`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## 設定 API

### PluginConfig 介面

DCP 的完整設定類型定義。

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

**原始碼位置**：[`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### 設定項詳解

#### 頂層設定

| 設定項 | 類型 | 預設值 | 描述 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否啟用外掛 |
| `debug` | `boolean` | `false` | 是否啟用偵錯日誌，日誌寫入 `~/.config/opencode/logs/dcp/` |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | 通知顯示模式 |
| `protectedFilePatterns` | `string[]` | `[]` | 檔案保護 glob 模式列表，符合的檔案不會被修剪 |

#### Commands 設定

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| 欄位 | 類型 | 預設值 | 描述 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否啟用 `/dcp` 命令 |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 命令保護工具列表，這些工具不會被 `/dcp sweep` 修剪 |

#### TurnProtection 設定

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| 欄位 | 類型 | 預設值 | 描述 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | 是否啟用回合保護 |
| `turns` | `number` | `4` | 保護回合數，最近 N 個回合的工具不會被修剪 |

#### Tools 設定

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

| 欄位 | 類型 | 預設值 | 描述 |
| --- | --- | --- | --- |
| `nudgeEnabled` | `boolean` | `true` | 是否啟用 AI 提醒 |
| `nudgeFrequency` | `number` | `10` | 提醒頻率，每 N 個工具結果後提醒 AI 使用修剪工具 |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 工具保護列表 |

**DiscardTool**：

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| 欄位 | 類型 | 預設值 | 描述 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否啟用 discard 工具 |

**ExtractTool**：

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| 欄位 | 類型 | 預設值 | 描述 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否啟用 extract 工具 |
| `showDistillation` | `boolean` | `false` | 是否在通知中顯示提取內容 |

#### Strategies 設定

**Deduplication**：

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| 欄位 | 類型 | 預設值 | 描述 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否啟用去重策略 |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 不參與去重的工具列表 |

**SupersedeWrites**：

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| 欄位 | 類型 | 預設值 | 描述 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | 是否啟用覆蓋寫入策略 |

**PurgeErrors**：

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| 欄位 | 類型 | 預設值 | 描述 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否啟用錯誤清理策略 |
| `turns` | `number` | `4` | 錯誤清理閾值（回合數） |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 不參與清理的工具列表 |

### getConfig 函數

載入並合併多層級設定。

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**參數**：

| 參數名 | 類型 | 描述 |
| --- | --- | --- |
| ctx | `PluginInput` | OpenCode 外掛上下文 |

**回傳值**：

合併後的設定物件，優先順序從高到低：

1. 專案設定 (`.opencode/dcp.jsonc`)
2. 環境變數設定 (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. 全域設定 (`~/.config/opencode/dcp.jsonc`)
4. 預設設定（程式碼中定義）

**原始碼位置**：[`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## 工具 API

### createDiscardTool

建立 discard 工具，用於移除已完成的任務或雜訊工具輸出。

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**參數**：

| 參數名 | 類型 | 描述 |
| --- | --- | --- |
| ctx | `PruneToolContext` | 工具上下文，包含 client、state、logger、config、workingDirectory |

**工具規範**：

| 欄位 | 類型 | 描述 |
| --- | --- | --- |
| `ids` | `string[]` | 首元素為原因（`'completion'` 或 `'noise'`），後續為數字 ID |

**原始碼位置**：[`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

建立 extract 工具，用於提取關鍵發現後刪除原始工具輸出。

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**參數**：

| 參數名 | 類型 | 描述 |
| --- | --- | --- |
| ctx | `PruneToolContext` | 工具上下文，包含 client、state、logger、config、workingDirectory |

**工具規範**：

| 欄位 | 類型 | 描述 |
| --- | --- | --- |
| `ids` | `string[]` | 數字 ID 陣列 |
| `distillation` | `string[]` | 提取內容陣列，長度與 ids 一致 |

**原始碼位置**：[`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## 狀態 API

### SessionState 介面

會話狀態物件，管理單個會話的執行時狀態。

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

**欄位說明**：

| 欄位 | 類型 | 描述 |
| --- | --- | --- |
| `sessionId` | `string \| null` | OpenCode 會話 ID |
| `isSubAgent` | `boolean` | 是否為子代理會話 |
| `prune` | `Prune` | 修剪狀態 |
| `stats` | `SessionStats` | 統計資料 |
| `toolParameters` | `Map<string, ToolParameterEntry>` | 工具呼叫快取（callID → 中繼資料） |
| `nudgeCounter` | `number` | 累計工具呼叫次數（用於觸發提醒） |
| `lastToolPrune` | `boolean` | 上一次操作是否為修剪工具 |
| `lastCompaction` | `number` | 最後一次上下文壓縮時間戳 |
| `currentTurn` | `number` | 目前回合數 |
| `variant` | `string \| undefined` | 模型變體（如 claude-3.5-sonnet） |

**原始碼位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### SessionStats 介面

會話層級的 Token 修剪統計。

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**欄位說明**：

| 欄位 | 類型 | 描述 |
| --- | --- | --- |
| `pruneTokenCounter` | `number` | 目前會話已修剪 Token 數（累計） |
| `totalPruneTokens` | `number` | 歷史累計已修剪 Token 數 |

**原始碼位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Prune 介面

修剪狀態物件。

```typescript
export interface Prune {
    toolIds: string[]
}
```

**欄位說明**：

| 欄位 | 類型 | 描述 |
| --- | --- | --- |
| `toolIds` | `string[]` | 已標記修剪的工具呼叫 ID 列表 |

**原始碼位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### ToolParameterEntry 介面

單個工具呼叫的中繼資料快取。

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**欄位說明**：

| 欄位 | 類型 | 描述 |
| --- | --- | --- |
| `tool` | `string` | 工具名稱 |
| `parameters` | `any` | 工具參數 |
| `status` | `ToolStatus \| undefined` | 工具執行狀態 |
| `error` | `string \| undefined` | 錯誤資訊（如有） |
| `turn` | `number` | 建立該呼叫的回合數 |

**ToolStatus 列舉**：

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**原始碼位置**：[`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

建立新的會話狀態物件。

```typescript
export function createSessionState(): SessionState
```

**回傳值**：初始化的 SessionState 物件

---

## 鉤子 API

### createSystemPromptHandler

建立系統提示詞注入鉤子處理器。

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**參數**：

| 參數名 | 類型 | 描述 |
| --- | --- | --- |
| state | `SessionState` | 會話狀態物件 |
| logger | `Logger` | 日誌系統實例 |
| config | `PluginConfig` | 設定物件 |

**行為**：

- 檢查是否為子代理會話，如果是則跳過
- 檢查是否為內部代理（如摘要產生器），如果是則跳過
- 根據設定載入對應的提示詞範本（both/discard/extract）
- 將修剪工具說明注入到系統提示詞

**原始碼位置**：[`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

建立訊息轉換鉤子處理器，執行自動修剪邏輯。

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**參數**：

| 參數名 | 類型 | 描述 |
| --- | --- | --- |
| client | `any` | OpenCode 用戶端實例 |
| state | `SessionState` | 會話狀態物件 |
| logger | `Logger` | 日誌系統實例 |
| config | `PluginConfig` | 設定物件 |

**處理流程**：

1. 檢查會話狀態（是否為子代理）
2. 同步工具快取
3. 執行自動策略（去重、覆蓋寫入、清除錯誤）
4. 修剪已標記的工具內容
5. 注入 `<prunable-tools>` 列表
6. 儲存上下文快照（如果設定了）

**原始碼位置**：[`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

建立命令執行鉤子處理器，處理 `/dcp` 系列命令。

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**參數**：

| 參數名 | 類型 | 描述 |
| --- | --- | --- |
| client | `any` | OpenCode 用戶端實例 |
| state | `SessionState` | 會話狀態物件 |
| logger | `Logger` | 日誌系統實例 |
| config | `PluginConfig` | 設定物件 |
| workingDirectory | `string` | 工作目錄路徑 |

**支援的命令**：

- `/dcp` - 顯示說明資訊
- `/dcp context` - 顯示目前會話 Token 使用分析
- `/dcp stats` - 顯示累計修剪統計
- `/dcp sweep [n]` - 手動修剪工具（可選指定數量）

**原始碼位置**：[`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## 本課小結

本節提供了 DCP 外掛的完整 API 參考，涵蓋了：

- 外掛入口函數和鉤子註冊機制
- 設定介面和所有設定項的詳細說明
- discard 和 extract 工具的規範和建立方法
- 會話狀態、統計資料和工具快取的類型定義
- 系統提示詞、訊息轉換和命令執行的鉤子處理器

如果你需要深入了解 DCP 的內部實作細節，建議閱讀[架構概覽](/zh-tw/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/)和[Token 計算原理](/zh-tw/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/)。

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 外掛入口函數 | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102) | 12-102 |
| 設定介面定義 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66 |
| getConfig 函數 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| discard 工具建立 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181 |
| extract 工具建立 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| 狀態類型定義 | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39 |
| 系統提示詞鉤子 | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53 |
| 訊息轉換鉤子 | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82) | 55-82 |
| 命令執行鉤子 | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156 |

**關鍵類型**：
- `Plugin`: OpenCode 外掛函數簽名
- `PluginConfig`: DCP 設定介面
- `SessionState`: 會話狀態介面
- `ToolStatus`: 工具狀態列舉（pending | running | completed | error）

**關鍵函數**：
- `plugin()`: 外掛入口函數
- `getConfig()`: 載入和合併設定
- `createDiscardTool()`: 建立 discard 工具
- `createExtractTool()`: 建立 extract 工具
- `createSessionState()`: 建立會話狀態

</details>
