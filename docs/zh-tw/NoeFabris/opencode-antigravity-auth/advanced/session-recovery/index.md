---
title: "會話恢復: 工具中斷自動修復 | Antigravity"
sidebarTitle: "工具中斷自動修復"
subtitle: "會話恢復：自動處理工具呼叫失敗和中斷"
description: "學習會話恢復機制，自動處理工具中斷和錯誤。涵蓋錯誤偵測、synthetic tool_result 注入和 auto_resume 設定。"
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

# 會話恢復：自動處理工具呼叫失敗和中斷

## 學完你能做什麼

- 理解會話恢復機制如何自動處理工具執行中斷
- 設定 session_recovery 和 auto_resume 選項
- 排查 tool_result_missing 和 thinking_block_order 錯誤
- 理解 synthetic tool_result 的運作原理

## 你現在的困境

使用 OpenCode 時，你可能會遇到這些中斷情境：

- 工具執行時按 ESC 中斷，導致會話卡住，需要手動重試
- 思考區塊順序錯誤（thinking_block_order），AI 無法繼續生成
- 在非思考模型中誤用了思考功能（thinking_disabled_violation）
- 需要手動修復損壞的會話狀態，浪費時間

## 什麼時候用這一招

會話恢復適合以下情境：

| 情境 | 錯誤類型 | 恢復方式 |
| --- | --- | --- |
| 按 ESC 中斷工具 | `tool_result_missing` | 自動注入 synthetic tool_result |
| 思考區塊順序錯誤 | `thinking_block_order` | 自動預置空思考區塊 |
| 非思考模型用思考 | `thinking_disabled_violation` | 自動剝離所有思考區塊 |
| 所有上述錯誤 | 通用 | 自動修復 + 自動 continue（如果啟用） |

::: warning 前置檢查
開始本教學前，請確保你已經完成：
- ✅ 安裝了 opencode-antigravity-auth 外掛
- ✅ 可以使用 Antigravity 模型發起請求
- ✅ 理解工具呼叫的基本概念

[快速安裝教學](../../start/quick-install/) | [首次請求教學](../../start/first-request/)
:::

## 核心思路

會話恢復的核心機制：

1. **錯誤偵測**：自動識別三種可恢復的錯誤類型
   - `tool_result_missing`：工具執行時缺少結果
   - `thinking_block_order`：思考區塊順序錯誤
   - `thinking_disabled_violation`：非思考模型禁止思考

2. **自動修復**：根據錯誤類型注入 synthetic 訊息
   - 注入 synthetic tool_result（內容為 "Operation cancelled by user (ESC pressed)"）
   - 預置空思考區塊（thinking 區塊必須在訊息開頭）
   - 剝離所有思考區塊（非思考模型不允許思考）

3. **自動繼續**：如果啟用了 `auto_resume`，自動發送 continue 訊息恢復對話

4. **去重處理**：使用 `Set` 防止同一錯誤被重複處理

::: info 什麼是 synthetic 訊息？
Synthetic 訊息是外掛注入的「虛擬」訊息，用於修復損壞的會話狀態。例如，當工具被中斷時，外掛會注入一個 synthetic tool_result，告訴 AI「這個工具已被取消」，讓 AI 能夠繼續生成新的回覆。
:::

## 跟我做

### 第 1 步：啟用會話恢復（預設已啟用）

**為什麼**
會話恢復預設啟用，但如果之前手動關閉過，需要重新開啟。

**操作**

編輯外掛設定檔：

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

確認以下設定：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**你應該看到**：

1. `session_recovery` 為 `true`（預設值）
2. `auto_resume` 為 `false`（建議手動 continue，避免誤操作）
3. `quiet_mode` 為 `false`（顯示 toast 通知，便於了解恢復狀態）

::: tip 設定項說明
- `session_recovery`：啟用/停用會話恢復功能
- `auto_resume`：自動發送 "continue" 訊息（慎用，可能導致 AI 意外執行）
- `quiet_mode`：隱藏 toast 通知（除錯時可以關閉）
:::

### 第 2 步：測試 tool_result_missing 恢復

**為什麼**
驗證當工具執行被中斷時，會話恢復機制是否正常運作。

**操作**

1. 開啟 OpenCode，選擇一個支援工具呼叫的模型（如 `google/antigravity-claude-sonnet-4-5`）
2. 輸入一個需要呼叫工具的任務（例如：「幫我查看目前目錄的檔案」）
3. 在工具執行過程中按 `ESC` 中斷

**你應該看到**：

1. OpenCode 立即停止工具執行
2. 彈出 toast 通知：「Tool Crash Recovery - Injecting cancelled tool results...」
3. AI 自動繼續生成，不再等待工具結果

::: info tool_result_missing 錯誤原理
當你按 ESC 時，OpenCode 會中斷工具執行，導致會話中出現 `tool_use` 但缺少對應的 `tool_result`。Antigravity API 會偵測到這個不一致，回傳 `tool_result_missing` 錯誤。外掛捕獲這個錯誤，注入 synthetic tool_result，使會話恢復一致狀態。
:::

### 第 3 步：測試 thinking_block_order 恢復

**為什麼**
驗證當思考區塊順序錯誤時，會話恢復機制能否自動修復。

**操作**

1. 開啟 OpenCode，選擇一個支援思考的模型（如 `google/antigravity-claude-opus-4-5-thinking`）
2. 輸入一個需要深入思考的任務
3. 如果遇到 "Expected thinking but found text" 或 "First block must be thinking" 錯誤

**你應該看到**：

1. 彈出 toast 通知：「Thinking Block Recovery - Fixing message structure...」
2. 會話自動修復，AI 能夠繼續生成

::: tip thinking_block_order 錯誤原因
這個錯誤通常由以下原因引起：
- 思考區塊被意外剝離（例如透過其他工具）
- 會話狀態損壞（例如磁碟寫入失敗）
- 跨模型遷移時格式不相容
:::

### 第 4 步：測試 thinking_disabled_violation 恢復

**為什麼**
驗證在非思考模型中誤用思考功能時，會話恢復能否自動剝離思考區塊。

**操作**

1. 開啟 OpenCode，選擇一個不支援思考的模型（如 `google/antigravity-claude-sonnet-4-5`）
2. 如果歷史訊息中包含思考區塊

**你應該看到**：

1. 彈出 toast 通知：「Thinking Strip Recovery - Stripping thinking blocks...」
2. 所有思考區塊被自動移除
3. AI 能夠繼續生成

::: warning 思考區塊遺失
剝離思考區塊會導致 AI 的思考內容遺失，可能影響回答品質。請確保在思考模型中使用思考功能。
:::

### 第 5 步：設定 auto_resume（選用）

**為什麼**
啟用 auto_resume 後，會話恢復完成後會自動發送 "continue"，無需手動操作。

**操作**

在 `antigravity.json` 中設定：

```json
{
  "auto_resume": true
}
```

儲存檔案並重新啟動 OpenCode。

**你應該看到**：

1. 會話恢復完成後，AI 自動繼續生成
2. 不需要手動輸入 "continue"

::: danger auto_resume 風險
自動 continue 可能導致 AI 意外執行工具呼叫。如果你對工具呼叫的安全性有疑慮，建議保持 `auto_resume: false`，手動控制恢復時機。
:::

## 檢查點 ✅

完成上述步驟後，你應該能夠：

- [ ] 在 `antigravity.json` 中看到 session_recovery 設定
- [ ] 按 ESC 中斷工具時看到 "Tool Crash Recovery" 通知
- [ ] 會話自動恢復，無需手動重試
- [ ] 理解 synthetic tool_result 的運作原理
- [ ] 知道何時啟用/停用 auto_resume

## 踩坑提醒

### 會話恢復未觸發

**症狀**：遇到錯誤但沒有自動恢復

**原因**：`session_recovery` 被停用或錯誤類型不符合

**解決方案**：

1. 確認 `session_recovery: true`：

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. 檢查錯誤類型是否為可恢復錯誤：

```bash
# 啟用除錯日誌查看詳細錯誤資訊
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. 查看主控台是否有錯誤日誌：

```bash
# 日誌位置
~/.config/opencode/antigravity-logs/session-recovery.log
```

### Synthetic tool_result 未注入

**症狀**：工具中斷後，AI 仍然等待工具結果

**原因**：OpenCode 的儲存路徑設定錯誤

**解決方案**：

1. 確認 OpenCode 的儲存路徑正確：

```bash
# 查看 OpenCode 設定
cat ~/.config/opencode/opencode.json | grep storage
```

2. 檢查訊息和部分儲存目錄是否存在：

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. 如果目錄不存在，檢查 OpenCode 的設定

### Auto Resume 意外觸發

**症狀**：AI 在不合適的時候自動繼續

**原因**：`auto_resume` 設定為 `true`

**解決方案**：

1. 關閉 auto_resume：

```json
{
  "auto_resume": false
}
```

2. 手動控制恢復時機

### Toast 通知太頻繁

**症狀**：頻繁彈出恢復通知，影響使用體驗

**原因**：`quiet_mode` 未啟用

**解決方案**：

1. 啟用 quiet_mode：

```json
{
  "quiet_mode": true
}
```

2. 如果需要除錯，可以暫時關閉

## 本課小結

- 會話恢復機制自動處理三種可恢復錯誤：tool_result_missing、thinking_block_order、thinking_disabled_violation
- Synthetic tool_result 是修復會話狀態的關鍵，注入內容為 "Operation cancelled by user (ESC pressed)"
- session_recovery 預設啟用，auto_resume 預設關閉（建議手動控制）
- 思考區塊恢復（thinking_block_order）會預置空思考區塊，使 AI 能夠重新生成思考內容
- 思考區塊剝離（thinking_disabled_violation）會導致思考內容遺失，請確保在思考模型中使用思考功能

## 下一課預告

> 下一課我們學習 **[請求轉換機制](../request-transformation/)**。
>
> 你會學到：
> - Claude 和 Gemini 請求格式的差異
> - Tool Schema 清理和轉換規則
> - 思考區塊簽名注入機制
> - Google Search Grounding 設定方法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 會話恢復主邏輯 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | 全文 |
| 錯誤類型偵測 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110 |
| tool_result_missing 恢復 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| thinking_block_order 恢復 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| thinking_disabled_violation 恢復 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| 儲存工具函式 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | 全文 |
| 訊息讀取 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78 |
| 部分（part）讀取 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104 |
| 預置思考區塊 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| 剝離思考區塊 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| 類型定義 | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | 全文 |

**關鍵常數**：

| 常數名 | 值 | 說明 |
| --- | --- | --- |
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Auto Resume 時發送的恢復文字 |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | 思考區塊類型集合 |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | 中繼資料類型集合 |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | 內容類型集合 |

**關鍵函式**：

- `detectErrorType(error: unknown): RecoveryErrorType`：偵測錯誤類型，回傳 `"tool_result_missing"`、`"thinking_block_order"`、`"thinking_disabled_violation"` 或 `null`
- `isRecoverableError(error: unknown): boolean`：判斷錯誤是否可恢復
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null`：建立會話恢復鉤子
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>`：恢復 tool_result_missing 錯誤
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>`：恢復 thinking_block_order 錯誤
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>`：恢復 thinking_disabled_violation 錯誤
- `readMessages(sessionID): StoredMessageMeta[]`：讀取會話的所有訊息
- `readParts(messageID): StoredPart[]`：讀取訊息的所有部分（parts）
- `prependThinkingPart(sessionID, messageID): boolean`：在訊息開頭預置空思考區塊
- `stripThinkingParts(messageID): boolean`：移除訊息中的所有思考區塊

**設定項**（來自 schema.ts）：

| 設定項 | 類型 | 預設值 | 說明 |
| --- | --- | --- | --- |
| `session_recovery` | boolean | `true` | 啟用會話恢復功能 |
| `auto_resume` | boolean | `false` | 自動發送 "continue" 訊息 |
| `quiet_mode` | boolean | `false` | 隱藏 toast 通知 |

</details>
