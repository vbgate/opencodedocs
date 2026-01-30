---
title: "FAQ: 常見問題排查 | opencode-dcp"
sidebarTitle: "遇到問題怎麼辦"
subtitle: "常見問題與排錯"
description: "學習如何解決 OpenCode DCP 使用中的常見問題，包括設定錯誤修復、除錯方法啟用、Token 未減少原因等故障排除技巧。"
tags:
  - "FAQ"
  - "troubleshooting"
  - "設定"
  - "除錯"
prerequisite:
  - "start-getting-started"
order: 1
---

# 常見問題與排錯

## 設定相關問題

### 為什麼我的設定沒有生效？

DCP 設定檔按優先順序合併：**預設值 < 全域 < 環境變數 < 專案**。專案級設定優先順序最高。

**檢查步驟**：

1. **確認設定檔位置**：
   ```bash
   # macOS/Linux
   ls -la ~/.config/opencode/dcp.jsonc
   ls -la ~/.config/opencode/dcp.json

   # 或在專案根目錄
   ls -la .opencode/dcp.jsonc
   ```

2. **檢視生效的設定**：
   啟用除錯模式後，DCP 會在首次載入設定時輸出設定資訊到日誌檔。

3. **重新啟動 OpenCode**：
   修改設定後必須重新啟動 OpenCode 才能生效。

::: tip 設定優先順序
如果你同時存在多個設定檔，專案級設定（`.opencode/dcp.jsonc`）會覆蓋全域設定。
:::

### 設定檔報錯怎麼辦？

DCP 會在偵測到設定錯誤時顯示 Toast 警告（7 秒後顯示），並降級使用預設值。

**常見錯誤類型**：

| 錯誤類型 | 問題描述 | 解決方法 |
| --- | --- | --- |
| 類型錯誤 | `pruneNotification` 應為 `"off" | "minimal" | "detailed"` | 檢查列舉值拼寫 |
| 陣列錯誤 | `protectedFilePatterns` 必須是字串陣列 | 確保使用 `["pattern1", "pattern2"]` 格式 |
| 未知鍵 | 設定檔包含不支援的鍵 | 刪除或註解掉未知鍵 |

**啟用除錯日誌檢視詳細錯誤**：

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true  // 啟用除錯日誌
}
```

日誌檔位置：`~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`

---

## 功能相關問題

### 為什麼 Token 使用量沒有減少？

DCP 只修剪**工具呼叫**內容，如果你的對話沒有使用工具，或者使用的都是受保護工具，Token 不會減少。

**可能原因**：

1. **受保護工具**
   預設受保護的工具包括：`task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

2. **回合保護未過期**
   如果啟用了 `turnProtection`，工具在保護期間內不會被修剪。

3. **對話中沒有重複或可修剪的內容**
   DCP 的自動策略只針對：
   - 重複的工具呼叫（去重）
   - 已被讀取覆蓋的寫入操作（覆蓋寫入）
   - 過期的錯誤工具輸入（清除錯誤）

**檢查方法**：

```bash
# 在 OpenCode 中輸入
/dcp context
```

檢視輸出中的 `Pruned` 欄位，了解已修剪的工具數量和節省的 Token。

::: info 手動修剪
如果自動策略沒有觸發，可以使用 `/dcp sweep` 手動修剪工具。
:::

### 子代理工作階段為什麼沒有修剪？

**這是預期行為**。DCP 在子代理工作階段中完全停用。

**原因**：子代理的設計目標是回傳簡潔的發現摘要，而不是最佳化 Token 使用。DCP 的修剪可能干擾子代理的總結行為。

**如何判斷是否為子代理工作階段**：
- 檢查工作階段中繼資料中的 `parentID` 欄位
- 啟用除錯日誌後，會看到 `isSubAgent: true` 的標記

---

## 除錯和日誌

### 如何啟用除錯日誌？

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true
}
```

**日誌檔位置**：
- **每日日誌**：`~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`
- **上下文快照**：`~/.config/opencode/logs/dcp/context/{sessionId}/{timestamp}.json`

::: warning 效能影響
除錯日誌會寫入磁碟檔案，可能影響效能。正式環境建議關閉。
:::

### 如何檢視當前工作階段的 Token 分佈？

```bash
# 在 OpenCode 中輸入
/dcp context
```

**輸出範例**：

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

### 如何檢視累計修剪統計？

```bash
# 在 OpenCode 中輸入
/dcp stats
```

這會顯示所有歷史工作階段的累計修剪 Token 數。

---

## Prompt Caching 相關

### DCP 會影響 Prompt Caching 嗎？

**會**，但權衡後通常是正收益。

LLM 供應商（如 Anthropic、OpenAI）基於**精確前綴匹配**快取 prompt。當 DCP 修剪工具輸出時，會改變訊息內容，從該點向前快取失效。

**實際測試結果**：
- 無 DCP：快取命中率約 85%
- 啟用 DCP：快取命中率約 65%

**但 Token 節省通常超過快取損失**，特別是在長對話中。

**最佳使用情境**：
- 使用按請求計費的服務（如 GitHub Copilot、Google Antigravity）時，快取損失無負面影響

---

## 進階設定

### 如何保護特定檔案不被修剪？

使用 `protectedFilePatterns` 設定 glob 模式：

```jsonc
{
    "protectedFilePatterns": [
        "src/config/*",     // 保護 config 目錄
        "*.env",           // 保護所有 .env 檔案
        "**/secrets/**"    // 保護 secrets 目錄
    ]
}
```

模式匹配工具參數中的 `filePath` 欄位（如 `read`、`write`、`edit` 工具）。

### 如何自訂受保護工具？

每個策略和工具設定都有 `protectedTools` 陣列：

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_tool"]  // 額外保護的工具
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["another_tool"]
        }
    },
    "commands": {
        "protectedTools": ["sweep_protected"]
    }
}
```

這些設定會**累加**到預設受保護工具清單。

---

## 常見錯誤情境

### 錯誤：DCP 未載入

**可能原因**：
1. 外掛未在 `opencode.jsonc` 中註冊
2. 外掛安裝失敗
3. OpenCode 版本不相容

**解決方法**：
1. 檢查 `opencode.jsonc` 是否包含 `"plugin": ["@tarquinen/opencode-dcp@latest"]`
2. 重新啟動 OpenCode
3. 檢視日誌檔確認載入狀態

### 錯誤：設定檔無效 JSON

**可能原因**：
- 缺少逗號
- 多餘逗號
- 字串未使用雙引號
- JSONC 註解格式錯誤

**解決方法**：
使用支援 JSONC 的編輯器（如 VS Code）編輯，或使用線上 JSON 驗證工具檢查語法。

### 錯誤：/dcp 指令不回應

**可能原因**：
- `commands.enabled` 設為 `false`
- 外掛未正確載入

**解決方法**：
1. 檢查設定檔中 `"commands.enabled"` 是否為 `true`
2. 確認外掛已載入（檢視日誌）

---

## 取得幫助

如果以上方法無法解決問題：

1. **啟用除錯日誌**並重現問題
2. **檢視上下文快照**：`~/.config/opencode/logs/dcp/context/{sessionId}/`
3. **在 GitHub 提交 Issue**：
   - 附帶日誌檔（刪除敏感資訊）
   - 描述重現步驟
    - 說明預期行為和實際行為

---

## 下一課預告

> 下一課我們學習 **[DCP 最佳實踐](../best-practices/)**。
>
> 你會學到：
> - Prompt Caching 與 Token 節省的權衡關係
> - 設定優先順序規則和使用策略
> - 保護機制的選擇和設定
> - 指令使用技巧和最佳化建議

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 設定驗證 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375) | 147-375 |
| 設定錯誤處理 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L391-421) | 391-421 |
| 日誌系統 | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L6-109) | 6-109 |
| 上下文快照 | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L196-210) | 196-210 |
| 子代理偵測 | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8) | 1-8 |
| 受保護工具 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79) | 68-79 |

**關鍵函式**：
- `validateConfigTypes()`：驗證設定項類型
- `getInvalidConfigKeys()`：偵測設定檔中的未知鍵
- `Logger.saveContext()`：儲存上下文快照用於除錯
- `isSubAgentSession()`：偵測子代理工作階段

</details>
