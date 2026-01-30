---
title: "最佳實踐: 配置優化 | opencode-dynamic-context-pruning"
subtitle: "最佳實踐: 配置優化"
sidebarTitle: "省 40% Token"
description: "學習 DCP 最佳實踐配置方法。掌握策略選擇、回合保護、工具保護及通知模式配置，優化 Token 使用。"
tags:
  - "最佳實踐"
  - "Token 節省"
  - "配置"
  - "優化"
prerequisite:
  - "start-configuration"
  - "platforms-auto-pruning"
order: 2
---

# DCP 最佳實踐

## 學完你能做什麼

- 了解 Prompt Caching 與 Token 節省的權衡關係
- 選擇適合你的保護策略（回合保護、受保護工具、檔案模式）
- 使用命令手動優化 Token 使用
- 根據專案需求定制 DCP 配置

## Prompt Caching 權衡

### 理解快取與修剪的權衡

DCP 修剪工具輸出時會改變訊息內容，這會導致基於**精確前綴匹配**的 Prompt Caching 從該點向前失效。

**測試數據對比**：

| 場景           | 快取命中率 | Token 節省 | 綜合收益 |
| --- | --- | --- | --- |
| 無 DCP         | ~85%      | 0%        | 基線   |
| 啟用 DCP       | ~65%      | 20-40%    | ✅ 正收益 |

### 何時應該忽略快取損失

**推薦使用 DCP 的場景**：

- ✅ **長對話**（超過 20 輪）：上下文膨脹顯著，Token 節省遠超快取損失
- ✅ **按請求計費**的服務：GitHub Copilot、Google Antigravity 等快取損失無負面影響
- ✅ **密集工具呼叫**：頻繁讀取檔案、執行搜尋等場景
- ✅ **程式碼重構任務**：重複讀取同一檔案的場景頻繁

**可能需要關閉 DCP 的場景**：

- ⚠️ **短對話**（< 10 輪）：修剪收益有限，快取損失可能更明顯
- ⚠️ **快取敏感型任務**：需要最大化快取命中率的場景（如批次處理任務）

::: tip 靈活配置
你可以根據專案需求動態調整 DCP 配置，甚至在專案級配置中禁用特定策略。
:::

---

## 配置優先級最佳實踐

### 多層級配置的正確使用

DCP 配置按以下優先級合併：

```
預設值 < 全域配置 < 自訂配置目錄 < 專案配置
```

::: info 配置目錄說明
「自訂配置目錄」是通過設定 `$OPENCODE_CONFIG_DIR` 環境變數來指定的目錄。該目錄下需要放置 `dcp.jsonc` 或 `dcp.json` 檔案。
:::

### 推薦的配置策略

| 場景             | 推薦配置位置 | 範例配置重點                     |
| --- | --- | --- |
| **個人開發環境**   | 全域配置    | 啟用自動策略、禁用除錯日誌          |
| **團隊協作專案**   | 專案配置    | 專案特定的受保護檔案、策略開關         |
| **CI/CD 環境**   | 自訂配置目錄  | 禁用通知、啟用除錯日誌             |
| **臨時除錯**       | 專案配置    | 啟用 `debug`、詳細通知模式           |

**範例：專案級配置覆蓋**

```jsonc
// ~/.config/opencode/dcp.jsonc（全域配置）
{
    "enabled": true,
    "strategies": {
        "deduplication": {
            "enabled": true
        }
    }
}
```

```jsonc
// .opencode/dcp.jsonc（專案配置）
{
    "strategies": {
        // 專案級覆蓋：禁用去重（比如專案需要保留歷史上下文）
        "deduplication": {
            "enabled": false
        }
    }
}
```

::: warning 修改配置後重啟
配置修改後必須重啟 OpenCode 才能生效。
:::

---

## 保護策略選擇

### 回合保護的使用場景

**回合保護**（Turn Protection）防止工具在指定回合數內被修剪，給 AI 足夠時間引用最近的內容。

**推薦設定**：

| 場景                   | 推薦值    | 原因                     |
| --- | --- | --- |
| **複雜問題解決**       | 4-6 回合 | AI 需要多次迭代分析工具輸出      |
| **程式碼重構**           | 2-3 回合 | 上下文切換較快，保護期過長影響效果    |
| **快速原型開發**       | 2-4 回合 | 平衡保護和 Token 節省        |
| **預設配置**           | 4 回合    | 經過測試的平衡點              |

**何時啟用回合保護**：

```jsonc
{
    "turnProtection": {
        "enabled": true,   // 啟用回合保護
        "turns": 6        // 保護 6 回合（適合複雜任務）
    }
}
```

**何時不建議啟用**：

- 簡單問答場景（AI 直接回答，不需要工具）
- 高頻短對話（保護期過長導致修剪不及時）

### 受保護工具的設定

**預設受保護工具**（無需額外設定）：
- `task`、`write`、`edit`、`batch`、`discard`、`extract`、`todowrite`、`todoread`、`plan_enter`、`plan_exit`

::: warning Schema 預設值說明
如果你使用 IDE 的自動完成功能，Schema 檔案（`dcp.schema.json`）中的預設受保護工具列表可能顯示不完整。實際以原始碼定義的 `DEFAULT_PROTECTED_TOOLS` 為準，包含所有 10 個工具。
:::

**何時添加額外受保護工具**：

| 場景                   | 範例配置                              | 原因                     |
| --- | --- | --- |
| **關鍵業務工具**       | `protectedTools: ["critical_tool"]` | 確保關鍵操作始終可見            |
| **需要歷史上下文的工具** | `protectedTools: ["analyze_history"]` | 保留完整歷史用於分析            |
| **自訂任務工具**     | `protectedTools: ["custom_task"]` | 保護自訂任務的工作流            |

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_analyze"]  // 額外保護特定工具
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["important_check"]  // LLM 工具額外保護
        }
    }
}
```

### 受保護檔案模式的使用

**推薦的保護模式**：

| 檔案類型             | 推薦模式                     | 保護原因                 |
| --- | --- | --- |
| **配置文件**           | `"*.env"`, `".env*"`        | 防止敏感資訊被修剪丟失          |
| **資料庫配置**          | `"**/config/database/*"`    | 確保資料庫連接配置始終可用        |
| **金鑰檔案**           | `"**/secrets/**"`          | 保護所有金鑰和憑證            |
| **核心業務邏輯**        | `"src/core/*"`            | 防止關鍵程式碼上下文丟失          |

```jsonc
{
    "protectedFilePatterns": [
        "*.env",                // 保護所有環境變數檔案
        ".env.*",              // 包括 .env.local 等
        "**/secrets/**",       // 保護 secrets 目錄
        "**/config/*.json",    // 保護配置文件
        "src/auth/**"          // 保護認證相關程式碼
    ]
}
```

::: tip 模式匹配規則
`protectedFilePatterns` 匹配工具參數中的 `filePath` 欄位（如 `read`、`write`、`edit` 工具）。
:::

---

## 自動策略的選擇

### 去重策略（Deduplication）

**預設啟用**，適合大多數場景。

**適用場景**：
- 重複讀取同一檔案（如程式碼審查、多輪除錯）
- 執行相同的搜尋或分析命令

**何時不建議啟用**：
- 需要保留每次呼叫的精確輸出（如效能監控）
- 工具輸出包含時間戳或隨機值（每次呼叫都不同）

### 覆蓋寫入策略（Supersede Writes）

**預設禁用**，需要根據專案需求決定是否啟用。

**推薦啟用場景**：
- 檔案修改後立即讀取驗證（重構、批次處理）
- 寫操作輸出很大，讀取後會覆蓋其價值

```jsonc
{
    "strategies": {
        "supersedeWrites": {
            "enabled": true  // 啟用覆蓋寫入策略
        }
    }
}
```

**何時不建議啟用**：
- 需要追蹤檔案修改歷史（程式碼審計）
- 寫操作包含重要中繼資料（如變更原因）

### 清除錯誤策略（Purge Errors）

**預設啟用**，推薦保持啟用狀態。

**配置建議**：

| 場景                   | 推薦值  | 原因                     |
| --- | --- | --- |
| **預設配置**           | 4 回合 | 經過測試的平衡點              |
| **快速失敗場景**       | 2 回合 | 盡早清理錯誤輸入，減少上下文污染       |
| **需要錯誤歷史**       | 6-8 回合 | 保留更多錯誤資訊用於除錯          |

```jsonc
{
    "strategies": {
        "purgeErrors": {
            "enabled": true,
            "turns": 2  // 快速失敗場景：2 回合後清理錯誤輸入
        }
    }
}
```

---

## LLM 驅動工具的最佳使用

### 提醒功能的優化

DCP 預設每 10 次工具呼叫後提醒 AI 使用修剪工具。

**推薦配置**：

| 場景                   | nudgeFrequency | 效果說明                |
| --- | --- | --- |
| **密集工具呼叫**       | 8-12          | 及時提醒 AI 清理            |
| **低頻工具呼叫**       | 15-20         | 減少提醒干擾              |
| **禁用提醒**           | Infinity      | 完全依賴 AI 自主判斷         |

```jsonc
{
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 15  // 低頻場景：15 次工具呼叫後提醒
        }
    }
}
```

### Extract 工具的使用

**何時使用 Extract**：
- 工具輸出包含關鍵發現或資料，需要保留摘要
- 原始輸出很大，但提取的資訊足以支撐後續推理

**配置建議**：

```jsonc
{
    "tools": {
        "extract": {
            "enabled": true,
            "showDistillation": false  // 預設不顯示提取內容（減少干擾）
        }
    }
}
```

**何時啟用 `showDistillation`**：
- 需要查看 AI 提取了哪些關鍵資訊
- 除錯或驗證 Extract 工具的行為

### Discard 工具的使用

**何時使用 Discard**：
- 工具輸出只是暫時狀態或雜訊
- 任務完成後不需要保留工具輸出

**配置建議**：

```jsonc
{
    "tools": {
        "discard": {
            "enabled": true
        }
    }
}
```

---

## 命令使用技巧

### 何時使用 `/dcp context`

**推薦使用場景**：
- 懷疑 Token 使用量異常
- 需要了解目前會話的上下文分布
- 評估 DCP 的修剪效果

**最佳實踐**：
- 在長對話中期檢查一次，了解上下文構成
- 在對話結束時檢查，查看總 Token 消耗

### 何時使用 `/dcp stats`

**推薦使用場景**：
- 需要了解長期 Token 節省效果
- 評估 DCP 的整體價值
- 對比不同配置的節省效果

**最佳實踐**：
- 每週查看一次累計統計資料
- 優化配置後對比前後效果

### 何時使用 `/dcp sweep`

**推薦使用場景**：
- 上下文過大導致回應變慢
- 需要立即減少 Token 消耗
- 自動策略沒有觸發修剪

**使用技巧**：

| 命令              | 用途               |
| --- |
| `/dcp sweep`      | 修剪上一條使用者訊息後的所有工具 |
| `/dcp sweep 10`   | 只修剪最後 10 個工具      |
| `/dcp sweep 5`    | 只修剪最後 5 個工具       |

**推薦工作流**：
1. 先使用 `/dcp context` 查看目前狀態
2. 根據情況決定修剪數量
3. 使用 `/dcp sweep N` 執行修剪
4. 再次使用 `/dcp context` 確認效果

---

## 通知模式的選擇

### 三種通知模式的對比

| 模式       | 顯示內容                          | 適用場景             |
| --- | --- | --- |
| **off**   | 不顯示任何通知                       | 不需要干擾的工作環境      |
| **minimal** | 只顯示修剪數量和 Token 節省             | 需要了解效果但不關注細節    |
| **detailed** | 顯示修剪的每個工具和原因（預設）          | 除錯或需要詳細監控的場景   |

### 推薦配置

| 場景             | 推薦模式   | 原因               |
| --- | --- | --- |
| **日常開發**       | minimal | 關注效果，減少干擾        |
| **除錯問題**       | detailed | 查看每個修剪操作的原因      |
| **示範或示範錄製**  | off     | 避免通知干擾示範流程       |

```jsonc
{
    "pruneNotification": "minimal"  // 日常開發推薦
}
```

---

## 子代理場景的處理

### 理解子代理限制

**DCP 在子代理會話中完全禁用**。

**原因**：
- 子代理的目標是返回簡潔的發現摘要
- DCP 的修剪可能干擾子代理的總結行為
- 子代理通常執行時間短，上下文膨脹有限

### 如何判斷是否為子代理會話

1. **啟用除錯日誌**：
   ```jsonc
   {
       "debug": true
   }
   ```

2. **查看日誌**：
   日誌中會顯示 `isSubAgent: true` 標記

### 子代理的 Token 優化建議

雖然 DCP 在子代理中禁用，但你仍可以：

- 優化子代理的提示詞，減少輸出長度
- 限制子代理的工具呼叫範圍
- 使用 `task` 工具的 `max_length` 參數控制輸出

---

## 本課小結

| 最佳實踐領域       | 核心建議                          |
| --- |
| **Prompt Caching**  | 長對話中 Token 節省通常超過快取損失          |
| **配置優先級**      | 全域配置用於通用設定，專案配置用於特定需求         |
| **回合保護**       | 複雜任務 4-6 回合，快速任務 2-3 回合         |
| **受保護工具**     | 預設保護已足夠，按需添加關鍵業務工具             |
| **受保護檔案**     | 保護配置、金鑰、核心業務邏輯檔案               |
| **自動策略**       | 去重和清除錯誤預設啟用，覆蓋寫入按需啟用           |
| **LLM 工具**     | 提醒頻率 10-15 次，Extract 除錯時顯示提取內容    |
| **命令使用**     | 定期檢查上下文，按需手動修剪                |
| **通知模式**       | 日常開發用 minimal，除錯用 detailed       |

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能         | 檔案路徑                                                                                              | 行號        |
| --- | --- | --- |
| 配置合併      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L691-794)    | 691-794     |
| 配置驗證      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375)    | 147-375     |
| 預設配置      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-134)     | 68-134      |
| 回合保護      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L432-437)   | 432-437     |
| 受保護工具     | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79)     | 68-79       |
| 受保護檔案模式   | [`protected-file-patterns.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/protected-file-patterns.ts#L1-60) | 1-60        |
| 子代理檢測     | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8)      | 1-8         |
| 提醒功能      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-441)   | 438-441     |

**關鍵常數**：
- `MAX_TOOL_CACHE_SIZE = 1000`：工具快取最大條目數
- `turnProtection.turns`：預設 4 回合保護

**關鍵函式**：
- `getConfig()`：載入並合併多層級配置
- `validateConfigTypes()`：驗證配置項類型
- `mergeConfig()`：按優先級合併配置
- `isSubAgentSession()`：檢測子代理會話

</details>
