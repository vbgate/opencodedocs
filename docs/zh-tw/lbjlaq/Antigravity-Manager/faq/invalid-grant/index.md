---
title: "Invalid Grant 排查: 帳號停用恢復 | Antigravity-Manager"
sidebarTitle: "帳號被停用了怎麼恢復"
subtitle: "invalid_grant 與帳號自動停用：為什麼會發生、如何恢復"
description: "學習 invalid_grant 錯誤的含義與自動處理邏輯。確認 refresh_token 失效後，透過重新 OAuth 新增帳號觸發自動解禁，並驗證恢復對 Proxy 生效。"
tags:
  - "FAQ"
  - "錯誤排查"
  - "OAuth"
  - "帳號管理"
  - "invalid_grant"
prerequisite:
  - "../../start/add-account/"
  - "../../start/first-run-data/"
  - "../../advanced/scheduling/"
order: 1
---
# invalid_grant 與帳號自動停用：為什麼會發生、如何恢復

## 學完你能做什麼

- 看到 `invalid_grant` 時，知道它對應的是哪一類 refresh_token 問題
- 搞清楚「帳號為什麼突然不可用」：什麼情況下會被自動停用、停用後系統怎麼處理
- 用最短路徑恢復帳號，並確認恢復已經對正在執行的 Proxy 生效

## 你遇到的症狀

- 呼叫本機 Proxy 時突然失敗，錯誤資訊裡出現 `invalid_grant`
- 明明帳號還在 Accounts 清單裡，但 Proxy 總是跳過它（或者你覺得它「再也沒被用到」）
- 只有少量帳號時，遇到一次 `invalid_grant` 後，整體可用性明顯變差

## 什麼是 invalid_grant？

**invalid_grant** 是 Google OAuth 在重新整理 `access_token` 時傳回的一類錯誤。對 Antigravity Tools 來說，它意味著某個帳號的 `refresh_token` 很可能已經被撤銷或過期，繼續重試只會反覆失敗，所以系統會把該帳號標記為不可用並從代理池中移出。

## 核心思路：系統不是「暫時跳過」，而是「持久停用」

當 Proxy 發現重新整理 token 的錯誤字串包含 `invalid_grant` 時，會做兩件事：

1. **把帳號寫成 disabled**（落盤到帳號 JSON）
2. **把帳號從記憶體 token pool 移除**（避免反覆選中同一個壞帳號）

這就是你看到「帳號還在，但 Proxy 不再用它」的原因。

::: info disabled vs proxy_disabled

- `disabled=true`：帳號被「徹底停用」（典型原因就是 `invalid_grant`）。載入帳號池時會直接跳過。
- `proxy_disabled=true`：帳號只是「對 Proxy 不可用」（手動停用/批次操作/配額保護相關邏輯），語意不同。

這兩個狀態在載入帳號池時是分開判斷的：先判斷 `disabled`，再做配額保護與 `proxy_disabled` 判斷。

:::

## 跟我做

### 第 1 步：確認是不是 refresh_token 重新整理觸發的 invalid_grant

**為什麼**：`invalid_grant` 可能出現在多個呼叫鏈路裡，但本專案的「自動停用」只在**重新整理 access_token 失敗**時觸發。

在 Proxy 日誌裡，你會看到類似的錯誤日誌（關鍵字是 `Token 重新整理失敗` + `invalid_grant`）：

```text
Token 重新整理失敗 (<email>): <...invalid_grant...>，嘗試下一個帳號
Disabling account due to invalid_grant (<email>): refresh_token likely revoked/expired
```

**你應該看到**：同一個帳號在出現 `invalid_grant` 後，很快就不再被選中（因為它被移出 token pool）。

### 第 2 步：在帳號檔案裡檢查 disabled 欄位（可選，但最準確）

**為什麼**：自動停用是「落盤」的，你確認檔案內容後，就能排除「只是暫時輪換」的誤判。

帳號檔案位於應用程式資料目錄的 `accounts/` 目錄下（資料目錄位置見 **[首次啟動必懂：資料目錄、日誌、系統匣與自動啟動](../../start/first-run-data/)**）。當帳號被停用時，檔案會出現這三個欄位：

```json
{
  "disabled": true,
  "disabled_at": 1700000000,
  "disabled_reason": "invalid_grant: ..."
}
```

**你應該看到**：`disabled` 為 `true`，並且 `disabled_reason` 裡包含 `invalid_grant:` 前綴。

### 第 3 步：恢復帳號（推薦做法：重新新增同一個帳號）

**為什麼**：本專案的「恢復」不是在 Proxy 裡手動點一個開關，而是透過「明確更新 token」來觸發自動解禁。

到 **Accounts** 頁面，用你新的憑證重新新增帳號（兩種方式任選其一）：

1. 重新走 OAuth 授權流程（見 **[新增帳號：OAuth/Refresh Token 雙通道與最佳實務](../../start/add-account/)**）
2. 用新的 `refresh_token` 再新增一次（系統會以 Google 傳回的電子郵件為準做 upsert）

當系統偵測到你這次 upsert 的 `refresh_token` 或 `access_token` 與舊值不同，並且該帳號之前處於 `disabled=true`，會自動清掉：

- `disabled`
- `disabled_reason`
- `disabled_at`

**你應該看到**：帳號不再處於 disabled 狀態，並且（如果 Proxy 正在執行）帳號池會被自動 reload，讓恢復立即生效。

### 第 4 步：驗證恢復是否已對 Proxy 生效

**為什麼**：如果你只有一個帳號，或者其他帳號也不可用，恢復後你應該立刻看到「可用性回來了」。

驗證方法：

1. 發起一次會觸發 token 重新整理的請求（例如等待 token 臨近過期後再請求）
2. 觀察日誌不再出現「跳過 disabled 帳號」的提示

**你應該看到**：請求能正常通過，且日誌裡不再出現針對該帳號的 `invalid_grant` 停用流程。

## 踩坑提醒

### ❌ 把 disabled 當成「暫時輪換」

如果你只在 UI 裡看「帳號還在」，很容易誤判為「系統只是暫時不用它」。但 `disabled=true` 是寫到磁碟上的，重新啟動後也會繼續生效。

### ❌ 只補充 access_token，不更新 refresh_token

`invalid_grant` 的觸發點是重新整理 `access_token` 時使用的 `refresh_token`。如果你只是暫時拿到了一個還能用的 `access_token`，但 `refresh_token` 依舊失效，後續還是會再次觸發停用。

## 檢查點 ✅

- [ ] 你能在日誌裡確認 `invalid_grant` 來自 refresh_token 重新整理失敗
- [ ] 你知道 `disabled` 和 `proxy_disabled` 的語意差異
- [ ] 你能透過重新新增帳號（OAuth 或 refresh_token）恢復帳號
- [ ] 你能驗證恢復已經對執行中的 Proxy 生效

## 本課小結

- `invalid_grant` 觸發時，Proxy 會把帳號 **落盤為 disabled**，並從 token pool 移除，避免反覆失敗
- 恢復的關鍵是「明確更新 token」（重新 OAuth 或用新 refresh_token 再新增一次），系統會自動清掉 `disabled_*` 欄位
- 資料目錄中的帳號 JSON 是最權威的狀態來源（停用/原因/時間都在裡面）

## 下一課預告

> 下一課我們學習 **[401/鑑權失敗：auth_mode、Header 相容與客戶端設定清單](../auth-401/)**。
>
> 你會學到：
> - 401 通常是「模式/Key/Header」哪一層不匹配
> - 不同客戶端該帶什麼鑑權 Header
> - 如何用最短路徑自檢並修復

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 設計說明：invalid_grant 的問題與變更行為 | [`docs/proxy-invalid-grant.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-invalid-grant.md#L1-L52) | 1-52 |
| 載入帳號池時跳過 `disabled=true` | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L70-L158) | 70-158 |
| 重新整理 token 失敗時識別 `invalid_grant` 並停用帳號 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L840-L890) | 840-890 |
| 持久化寫入 `disabled/disabled_at/disabled_reason` 並從記憶體移除 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| `disabled_reason` 截斷（避免帳號檔案膨脹） | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1464-L1471) | 1464-1471 |
| upsert 時自動清理 `disabled_*`（token 變化即視為使用者已修復憑證） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L178-L206) | 178-206 |
| 重新新增帳號後自動 reload proxy accounts（執行中立即生效） | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L21-L59) | 21-59 |

</details>
