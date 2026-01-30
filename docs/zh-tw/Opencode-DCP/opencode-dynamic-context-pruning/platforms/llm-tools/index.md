---
title: "LLM 修剪：智慧最佳化 | opencode-dynamic-context-pruning"
sidebarTitle: "讓 AI 自動修剪"
subtitle: "LLM 修剪：智慧最佳化上下文"
description: "學習 DCP 的 discard/extract 工具，理解區別、注入機制和保護機制，設定開關選項，實戰驗證修剪效果，最佳化 Token、降低成本。"
tags:
  - "DCP"
  - "上下文修剪"
  - "AI 工具"
  - "Token 最佳化"
prerequisite:
  - "start-configuration"
order: 2
---

# LLM 驅動修剪工具：讓 AI 智慧最佳化上下文

## 學完你能做什麼

- 理解 discard 和 extract 工具的區別和使用情境
- 知道 AI 如何透過 `<prunable-tools>` 列表選擇要修剪的內容
- 設定修剪工具的開關、提醒頻率和顯示選項
- 了解保護機制如何防止誤修剪關鍵檔案

## 你現在的困境

隨著對話深入，工具呼叫累積，上下文越來越大。你可能遇到：
- Token 使用量激增，成本上升
- AI 需要處理大量無關的舊工具輸出
- 不知道如何讓 AI 主動清理上下文

傳統方案是手動清理，但這樣會中斷對話流程。DCP 提供了更好的方式：讓 AI 自主決定何時清理上下文。

## 什麼時候用這一招

當你：
- 經常進行長對話，工具呼叫累積較多
- 發現 AI 需要處理大量歷史工具輸出
- 想最佳化 Token 使用成本而不中斷對話
- 希望根據具體情境選擇保留還是刪除內容

## 核心思路

DCP 提供了兩個工具，讓 AI 在對話中主動最佳化上下文：

| 工具 | 用途 | 是否保留內容 |
| --- | --- | --- |
| **discard** | 移除已完成的任務或雜訊 | ❌ 不保留 |
| **extract** | 擷取關鍵發現後刪除原始內容 | ✅ 保留精簡資訊 |

### 運作機制

每次 AI 準備傳送訊息前，DCP 會：

```
1. 掃描目前會話中的工具呼叫
   ↓
2. 過濾已修剪、受保護的工具
   ↓
3. 產生 <prunable-tools> 列表
   格式：ID: tool, parameter
   ↓
4. 將列表注入到上下文中
   ↓
5. AI 根據列表選擇工具並呼叫 discard/extract
   ↓
6. DCP 替換被修剪內容為佔位符
```

### 選擇工具的決策邏輯

AI 會根據這個流程選擇：

```
「這個工具輸出需要保留資訊嗎？」
  │
  ├─ 否 → discard（預設清理方式）
  │   - 任務完成，無價值內容
  │   - 雜訊、無關資訊
  │
  ├─ 是 → extract（保留知識）
  │   - 需要後續引用的關鍵資訊
  │   - 函式簽章、設定值等
  │
  └─ 不確定 → extract（更安全）
```

::: info
AI 會批次修剪，而不是修剪單個小工具輸出。這樣效率更高。
:::

### 保護機制

DCP 有多層保護，防止 AI 誤修剪關鍵內容：

| 保護層 | 說明 | 設定項 |
| --- | --- | --- |
| **受保護工具** | 如 task、write、edit 等核心工具不能修剪 | `tools.settings.protectedTools` |
| **受保護檔案** | 符合 glob 模式的檔案路徑不能修剪 | `protectedFilePatterns` |
| **回合保護** | 新工具在 N 回合內不會被放入修剪列表 | `turnProtection.turns` |

::: tip
預設受保護的工具包括：task、todowrite、todoread、discard、extract、batch、write、edit、plan_enter、plan_exit
:::

## 跟我做

### 第 1 步：理解 `<prunable-tools>` 列表

在對話中，DCP 會自動注入 `<prunable-tools>` 列表。AI 看到這樣的內容：

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

**你應該看到**：
- 每行一個工具，格式為 `ID: tool, parameter`
- ID 是數字索引（從 0 開始）
- 只顯示可修剪的工具（已修剪、受保護、保護檔案不會顯示）

### 第 2 步：查看 AI 使用 discard 的情境

當 AI 完成一個任務，判斷無需保留資訊時：

```
使用者輸入：測試認證功能

AI 輸出：
測試通過。認證邏輯正常運作，無需保留測試日誌。
[呼叫 discard(ids: ["completion", "5", "12"])]
```

**你應該看到**：
- AI 使用了 `discard` 工具
- 參數格式：`["原因", "ID1", "ID2", ...]`
- 原因只有兩種：`"completion"`（任務完成）或 `"noise"`（雜訊）

### 第 3 步：查看 AI 使用 extract 的情境

當 AI 完成任務後需要保留關鍵資訊時：

```
使用者輸入：分析認證服務的實作

AI 輸出：
我發現了一些關鍵細節，擷取如下：
[呼叫 extract(ids: ["5", "12"], distillation: [
  "auth.ts: validateToken 檢查快取 (5min TTL) 後呼叫 OIDC",
  "bash: npm test 結果 - 所有測試通過"
])]
```

**你應該看到**：
- AI 使用了 `extract` 工具
- `distillation` 陣列與 `ids` 陣列長度一致
- 每個擷取內容對應一個工具輸出的精簡資訊

### 第 4 步：設定修剪工具選項

編輯 DCP 設定檔（`~/.config/opencode/dcp.jsonc` 或專案級 `.opencode/dcp.jsonc`）：

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

**你應該看到**：
- `discard.enabled`：啟用 discard 工具（預設 true）
- `extract.enabled`：啟用 extract 工具（預設 true）
- `extract.showDistillation`：是否顯示擷取內容（預設 false）
- `nudgeEnabled`：是否啟用修剪提醒（預設 true）
- `nudgeFrequency`：提醒頻率（預設 10，即每 10 次工具呼叫）

**你應該看到**：
- 如果 `showDistillation` 為 false，擷取內容不會顯示在對話中
- 如果 `showDistillation` 為 true，擷取內容以 ignored message 形式顯示

### 第 5 步：測試修剪功能

1. 進行一次較長的對話，觸發多個工具呼叫
2. 觀察 AI 是否在適當時機呼叫 discard 或 extract
3. 使用 `/dcp stats` 查看修剪統計

**你應該看到**：
- 在工具呼叫累積到一定數量後，AI 開始主動修剪
- `/dcp stats` 顯示已節省的 Token 數量
- 對話上下文更加聚焦於目前任務

## 檢查點 ✅

::: details 點擊展開驗證你的設定

**檢查設定是否生效**

```bash
# 查看 DCP 設定
cat ~/.config/opencode/dcp.jsonc

# 或專案級設定
cat .opencode/dcp.jsonc
```

你應該看到：
- `tools.discard.enabled` 為 true（啟用 discard）
- `tools.extract.enabled` 為 true（啟用 extract）
- `tools.settings.nudgeEnabled` 為 true（啟用提醒）

**檢查修剪是否運作**

在對話中，觸發多個工具呼叫後：

你應該看到：
- AI 在適當時機呼叫 discard 或 extract
- 收到修剪通知（顯示被修剪的工具和節省的 Token）
- `/dcp stats` 顯示累計節省的 Token

:::

## 踩坑提醒

### 常見錯誤 1：AI 沒有修剪工具

**可能原因**：
- 修剪工具未啟用
- 保護設定過於嚴格，沒有可修剪的工具

**解決方法**：
```jsonc
{
  "tools": {
    "discard": {
      "enabled": true  // 確保啟用
    },
    "extract": {
      "enabled": true  // 確保啟用
    }
  }
}
```

### 常見錯誤 2：誤修剪了關鍵內容

**可能原因**：
- 關鍵檔案沒有加入保護模式
- 受保護工具列表不完整

**解決方法**：
```jsonc
{
  "protectedFilePatterns": [
    "src/auth/*",  // 保護認證相關檔案
    "config/*"     // 保護設定檔
  ],
  "tools": {
    "settings": {
      "protectedTools": [
        "read",  // 新增 read 到保護列表
        "write"
      ]
    }
  }
}
```

### 常見錯誤 3：看不到擷取內容

**可能原因**：
- `showDistillation` 設定為 false

**解決方法**：
```jsonc
{
  "tools": {
    "extract": {
      "showDistillation": true  // 啟用顯示
    }
  }
}
```

::: warning
擷取內容會以 ignored message 形式顯示，不影響對話上下文。
:::

## 本課小結

DCP 提供了兩個工具讓 AI 自主最佳化上下文：

- **discard**：移除已完成任務或雜訊，無需保留資訊
- **extract**：擷取關鍵發現後刪除原始內容，保留精簡資訊

AI 透過 `<prunable-tools>` 列表了解可修剪的工具，並根據情境選擇合適的工具。保護機制確保關鍵內容不會被誤修剪。

設定要點：
- 啟用工具：`tools.discard.enabled` 和 `tools.extract.enabled`
- 顯示擷取內容：`tools.extract.showDistillation`
- 調整提醒頻率：`tools.settings.nudgeFrequency`
- 保護關鍵工具和檔案：`protectedTools` 和 `protectedFilePatterns`

## 下一課預告

> 下一課我們學習 **[Slash 命令使用](../commands/)**
>
> 你會學到：
> - 使用 `/dcp context` 查看目前會話的 Token 分佈
> - 使用 `/dcp stats` 查看累計修剪統計
> - 使用 `/dcp sweep` 手動觸發修剪

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| discard 工具定義 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L180) | 155-180 |
| extract 工具定義 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| 修剪操作執行 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L26-L153) | 26-153 |
| --- | --- | --- |
| 修剪上下文注入 | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L102-L156) | 102-156 |
| discard 工具規範 | [`lib/prompts/discard-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/discard-tool-spec.ts#L1-L41) | 1-41 |
| extract 工具規範 | [`lib/prompts/extract-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/extract-tool-spec.ts#L1-L48) | 1-48 |
| 系統提示詞（both） | [`lib/prompts/system/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/system/both.ts#L1-L60) | 1-60 |
| 提醒提示詞 | [`lib/prompts/nudge/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/nudge/both.ts#L1-L10) | 1-10 |
| 設定定義 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L436-L449) | 436-449 |
| 預設受保護工具 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-L441) | 438-441 |

**關鍵常數**：
- `DISCARD_TOOL_DESCRIPTION`：discard 工具的提示詞說明
- `EXTRACT_TOOL_DESCRIPTION`：extract 工具的提示詞說明
- `DEFAULT_PROTECTED_TOOLS`：預設受保護工具列表

**關鍵函式**：
- `createDiscardTool(ctx)`：建立 discard 工具
- `createExtractTool(ctx)`：建立 extract 工具
- `executePruneOperation(ctx, toolCtx, ids, reason, toolName, distillation)`：執行修剪操作
- `buildPrunableToolsList(state, config, logger, messages)`：產生可修剪工具列表
- `insertPruneToolContext(state, config, logger, messages)`：注入修剪上下文

**設定項**：
- `tools.discard.enabled`：是否啟用 discard 工具（預設 true）
- `tools.extract.enabled`：是否啟用 extract 工具（預設 true）
- `tools.extract.showDistillation`：是否顯示擷取內容（預設 false）
- `tools.settings.nudgeEnabled`：是否啟用提醒（預設 true）
- `tools.settings.nudgeFrequency`：提醒頻率（預設 10）
- `tools.settings.protectedTools`：受保護工具列表
- `protectedFilePatterns`：受保護檔案 glob 模式

</details>
