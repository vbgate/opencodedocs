---
title: "自動修剪：三種策略 | opencode-dcp"
sidebarTitle: "用策略省 Token"
subtitle: "自動修剪：三種策略 | opencode-dcp"
description: "學習 DCP 的三種自動修剪策略：去重、覆寫、清除錯誤。深入講解運作原理、適用情境和設定方法，幫你節省 Token 成本並提升對話品質。所有策略零 LLM 成本。"
tags:
  - "自動修剪"
  - "策略"
  - "去重"
  - "覆寫"
  - "清除錯誤"
prerequisite:
  - "start-getting-started"
  - "start-configuration"
order: 1
---

# 自動修剪策略詳解

## 學完你能做什麼

- 理解三種自動修剪策略的運作原理
- 知道何時啟用或停用每種策略
- 透過設定最佳化策略效果

## 你現在的困境

隨著對話越來越長，上下文中的工具呼叫堆積如山：
- AI 反覆讀取同一個檔案，每次都把完整內容塞進上下文
- 寫入檔案後又讀取，原來的寫入內容還在上下文裡「吃灰」
- 工具呼叫失敗後，龐大的輸入參數一直佔著位置

這些問題讓 Token 帳單越滾越大，還可能「污染」上下文，影響 AI 的判斷。

## 核心思路

DCP 提供三種**自動修剪策略**，在每次發送請求前靜默執行，**零 LLM 成本**：

| 策略 | 預設開關 | 作用 |
| --- | --- | --- |
| 去重 | ✅ 啟用 | 偵測重複工具呼叫，只保留最新一次 |
| 覆寫 | ❌ 停用 | 清理已被讀取覆蓋的寫入操作輸入 |
| 清除錯誤 | ✅ 啟用 | 超過 N 回合後清理錯誤工具輸入 |

所有策略都遵循以下規則：
- **跳過受保護工具**：task、write、edit 等關鍵工具不會被修剪
- **跳過受保護檔案**：透過設定的 glob 模式保護的檔案路徑
- **保留錯誤訊息**：清除錯誤策略只移除輸入參數，錯誤資訊保留

---

## 去重策略

### 運作原理

去重策略偵測**相同工具名稱和參數**的重複呼叫，只保留最新一次。

::: info 簽章比對機制

DCP 透過「簽章」判斷重複：
- 工具名稱相同
- 參數值相同（忽略 null/undefined，鍵順序不影響）

例如：
```json
// 第 1 次呼叫
{ "tool": "read", "path": "src/config.ts" }

// 第 2 次呼叫（簽章相同）
{ "tool": "read", "path": "src/config.ts" }

// 第 3 次呼叫（簽章不同）
{ "tool": "read", "path": "src/utils.ts" }
```
:::

### 適用情境

**建議啟用**（預設開啟）：
- AI 頻繁讀取同一檔案進行程式碼分析
- 多輪對話中反覆查詢同一設定
- 需要保持最新狀態，歷史輸出可丟棄的情境

**可能想停用**：
- 需要保留每次工具呼叫的上下文（如除錯工具輸出）

### 設定方法

```json
// ~/.config/opencode/dcp.jsonc
{
  "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/main/dcp.schema.json",
  "strategies": {
    "deduplication": {
      "enabled": true  // true 啟用，false 停用
    }
  }
}
```

**受保護工具**（預設不修剪）：
- task、write、edit、batch、plan_enter、plan_exit
- todowrite、todoread（任務清單工具）
- discard、extract（DCP 自身工具）

這些工具即使在設定中也無法被去重修剪（硬編碼保護）。

---

## 覆寫策略

### 運作原理

覆寫策略清理**已被後續讀取覆蓋的寫入操作輸入**。

::: details 範例：寫入後讀取

```text
第 1 步：寫入檔案
AI 呼叫 write("config.json", {...})
↓
第 2 步：讀取檔案確認
AI 呼叫 read("config.json") → 回傳最新內容
↓
覆寫策略識別
write 的輸入（可能很大）變得冗餘
因為 read 已經擷取了檔案的目前狀態
↓
修剪
只保留 read 的輸出，移除 write 的輸入
```

:::

### 適用情境

**建議啟用**：
- 頻繁「寫入→驗證→修改」的迭代開發情境
- 寫入操作包含大量範本或完整檔案內容

**預設停用原因**：
- 某些工作流程依賴「歷史寫入記錄」作為上下文
- 可能影響某些版本控制相關的工具呼叫

**何時手動啟用**：
```json
{
  "strategies": {
    "supersedeWrites": {
      "enabled": true
    }
  }
}
```

### 注意事項

此策略**只修剪 write 工具的輸入**，不修剪輸出。因為：
- write 的輸出通常是確認訊息（很小）
- write 的輸入可能包含完整檔案內容（很大）

---

## 清除錯誤策略

### 運作原理

清除錯誤策略在工具呼叫失敗後，等待 N 回合，然後移除**輸入參數**（保留錯誤訊息）。

::: info 回合（turn）是什麼？
在 OpenCode 對話中：
- 使用者發送訊息 → AI 回覆 = 1 個回合
- 工具呼叫不單獨計回合

預設閾值為 4 回合，意味著錯誤工具的輸入會在 4 個回合後自動清理。
:::

### 適用情境

**建議啟用**（預設開啟）：
- 工具呼叫失敗且輸入很大（如讀取超大檔案失敗）
- 錯誤資訊需要保留，但輸入參數不再有價值

**可能想停用**：
- 需要保留失敗工具的完整輸入以供除錯
- 頻繁遇到「間歇性」錯誤，希望保留歷史

### 設定方法

```json
{
  "strategies": {
    "purgeErrors": {
      "enabled": true,   // 啟用開關
      "turns": 4        // 清除閾值（回合數）
    }
  }
}
```

**受保護工具**（預設不修剪）：
- 與去重策略相同的受保護工具清單

---

## 策略執行順序

三種策略按**固定順序**執行：

```mermaid
graph LR
    A["訊息列表"] --> B["同步工具快取"]
    B --> C["去重策略"]
    C --> D["覆寫策略"]
    D --> E["清除錯誤策略"]
    E --> F["修剪內容替換"]
```

這意味著：
1. 先去重（減少冗餘）
2. 再覆寫（清理已失效的寫入）
3. 最後清除錯誤（清理過期的錯誤輸入）

每個策略都基於前一個策略的結果，不會重複修剪同一工具。

---

## 踩坑提醒

### ❌ 誤區 1：以為會自動修剪所有工具

**問題**：為什麼 task、write 等工具沒有被修剪？

**原因**：這些工具在**受保護工具清單**中，硬編碼保護。

**解決方案**：
- 如果確實需要修剪 write，考慮啟用覆寫策略
- 如果需要修剪 task，可以透過設定新增受保護檔案路徑來間接控制

### ❌ 誤區 2：覆寫策略導致上下文不完整

**問題**：啟用覆寫後，AI 找不到之前的寫入內容。

**原因**：策略只清理「已被讀取覆蓋」的寫入操作，但如果寫入後從未讀取，就不會被修剪。

**解決方案**：
- 檢查檔案是否真的被讀取過（`/dcp context` 可查看）
- 如果確實需要保留寫入記錄，停用此策略

### ❌ 誤區 3：清除錯誤策略太快清理

**問題**：錯誤輸入剛被修剪，AI 立即又遇到相同錯誤。

**原因**：`turns` 閾值設定太小。

**解決方案**：
```json
{
  "strategies": {
    "purgeErrors": {
      "turns": 8  // 從預設 4 增加到 8
    }
  }
}
```

---

## 什麼時候用這一招

| 情境 | 建議策略組合 |
| --- | --- |
| 日常開發（讀多寫少） | 去重 + 清除錯誤（預設設定） |
| 頻繁寫入驗證 | 全部啟用（手動開啟覆寫） |
| 除錯工具失敗 | 只啟用去重（停用清除錯誤） |
| 需要完整上下文歷史 | 全部停用 |

---

## 本課小結

- **去重策略**：偵測重複工具呼叫，保留最新一次（預設啟用）
- **覆寫策略**：清理已被讀取覆蓋的寫入操作輸入（預設停用）
- **清除錯誤策略**：N 回合後清理錯誤工具輸入（預設啟用，閾值 4）
- 所有策略都跳過受保護工具和受保護檔案路徑
- 策略按固定順序執行：去重 → 覆寫 → 清除錯誤

---

## 下一課預告

> 下一課我們學習 **[LLM 驅動修剪工具](../llm-tools/)**。
>
> 你會學到：
> - AI 如何自主呼叫 discard 和 extract 工具
> - 語意級上下文最佳化的實作方式
> - 擷取關鍵發現的最佳實踐

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 去重策略實作 | [`lib/strategies/deduplication.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/deduplication.ts) | 13-83 |
| 覆寫策略實作 | [`lib/strategies/supersede-writes.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/supersede-writes.ts) | 16-105 |
| 清除錯誤策略實作 | [`lib/strategies/purge-errors.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/purge-errors.ts) | 16-80 |
| 策略入口匯出 | [`lib/strategies/index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/index.ts) | 1-5 |
| 預設設定 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 423-464 |
| 受保護工具清單 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 68-79 |

**關鍵函式**：
- `deduplicate()` - 去重策略主函式
- `supersedeWrites()` - 覆寫策略主函式
- `purgeErrors()` - 清除錯誤策略主函式
- `createToolSignature()` - 建立工具簽章用於去重比對
- `normalizeParameters()` - 參數正規化（去除 null/undefined）
- `sortObjectKeys()` - 參數鍵排序（確保簽章一致性）

**預設設定值**：
- `strategies.deduplication.enabled = true`
- `strategies.supersedeWrites.enabled = false`
- `strategies.purgeErrors.enabled = true`
- `strategies.purgeErrors.turns = 4`

**受保護工具（預設不修剪）**：
- task、todowrite、todoread、discard、extract、batch、write、edit、plan_enter、plan_exit

</details>
