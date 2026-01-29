---
title: "配額治理：Quota Protection 與預熱 | Antigravity-Manager"
subtitle: "配額治理：Quota Protection 與預熱 | Antigravity-Manager"
sidebarTitle: "保護你的模型配額"
description: "學習 Antigravity-Manager 配額治理機制。使用 Quota Protection 按閾值保護模型，Smart Warmup 自動預熱，支援定時掃描與冷卻控制。"
tags:
  - "quota"
  - "warmup"
  - "accounts"
  - "proxy"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
order: 5
---

# 配額治理：Quota Protection + Smart Warmup 的組合打法

你用 Antigravity Tools 跑代理跑得挺穩，但最怕還是一件事：主力模型的配額被「悄悄吃光」，等你真要用的時候才發現已經低到沒法打。

這一課專講 **配額治理**：用 Quota Protection 把關鍵模型留住；用 Smart Warmup 在配額回滿時做一次「輕量熱身」，減少臨時掉鏈子。

## 什麼是配額治理？

**配額治理**是指在 Antigravity Tools 裡用兩套聯動機制控制「配額怎麼花」：當某個模型的剩餘配額低到閾值以下時，Quota Protection 會把該模型加入帳號的 `protected_models`，請求該模型時會優先避開；當配額回到 100% 時，Smart Warmup 會觸發一次極小流量的預熱請求，並用本地歷史檔案做 4 小時冷卻。

## 學完你能做什麼

- 開啟 Quota Protection，讓低配額帳號自動「讓路」，把高價值模型留給關鍵請求
- 開啟 Smart Warmup，讓配額回滿後自動預熱（並知道 4 小時冷卻怎麼影響觸發頻率）
- 搞清楚 `quota_protection` / `scheduled_warmup` / `protected_models` 三個欄位分別在哪裡生效
- 知道哪些模型名會被歸一化成「保護組」（以及哪些不會）

## 你現在的困境

- 你以為自己在「輪換帳號」，但其實一直在消耗同一類高價值模型
- 配額低了才發現，甚至是 Claude Code/客戶端在後台 warmup 把額度啃掉
- 你開了預熱，但不知道它到底何時觸發、有沒有冷卻、是否會影響配額

## 什麼時候用這一招

- 你有多個帳號池，希望關鍵模型在「重要時刻」還有餘糧
- 你不想手動盯著配額回滿時間，想讓系統自動做「回滿後的輕量驗證」

## 🎒 開始前的準備

::: warning 前置條件
本課預設你已經能：

- 在 **Accounts** 頁面看到帳號列表，並能手動刷新配額
- 已經啟動過本地反代（至少能存取 `/healthz`）

如果還沒跑通，先看 **[啟動本地反代並接入第一個客戶端](/zh-tw/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**。
:::

另外，Smart Warmup 會寫入本地歷史檔案 `warmup_history.json`。它放在資料目錄裡，資料目錄位置和備份方式可以先看 **[首次啟動必懂：資料目錄、日誌、托盤與自動啟動](/zh-tw/lbjlaq/Antigravity-Manager/start/first-run-data/)**。

## 核心思路

這套「組合打法」背後其實很樸素：

- Quota Protection 負責「別再浪費」：當某個模型低於閾值，就把它標記為受保護，請求該模型時優先避開（模型級別，而不是一刀切禁用帳號）。
- Smart Warmup 負責「配額回滿就驗一下」：當模型回到 100% 時，觸發一次輕量請求，確認鏈路可用，並用 4 小時冷卻避免反覆打擾。

它們對應的設定欄位都在前端的 `AppConfig` 裡：

- `quota_protection.enabled / threshold_percentage / monitored_models`（見 `src/types/config.ts`）
- `scheduled_warmup.enabled / monitored_models`（見 `src/types/config.ts`）

而真正決定「請求該模型時要不要跳過該帳號」的邏輯在後端 TokenManager：

- 帳號檔案裡的 `protected_models` 會在 `get_token(..., target_model)` 裡參與過濾（見 `src-tauri/src/proxy/token_manager.rs`）
- `target_model` 會先做一次歸一化（`normalize_to_standard_id`），所以 `claude-sonnet-4-5-thinking` 這類變體會被折疊到同一個「保護組」（見 `src-tauri/src/proxy/common/model_mapping.rs`）

## 下一課預告

> 下一課我們學習 **[Proxy Monitor：請求日誌、篩選、詳情還原與匯出](/zh-tw/lbjlaq/Antigravity-Manager/advanced/monitoring/)**，把呼叫黑盒變成可覆盤的證據鏈。

## 跟我做

### 第 1 步：先把配額刷到「有數」

**為什麼**
Quota Protection 是基於帳號的 `quota.models[].percentage` 做判斷的。你配額沒刷出來，保護邏輯就沒法對你做任何事。

操作路徑：打開 **Accounts** 頁面，點工具欄的刷新按鈕（單個帳號或全量都行）。

**你應該看到**：帳號行裡出現各模型的配額百分比（例如 0-100）和 reset time。

### 第 2 步：在 Settings 裡打開 Smart Warmup（可選，但推薦）

**為什麼**
Smart Warmup 的目標不是「省配額」，而是「配額回滿就自檢一下鏈路」。它只在模型配額到 100% 時觸發，而且有 4 小時冷卻。

操作路徑：進入 **Settings**，切到帳號相關設定區域，打開 **Smart Warmup** 開關，然後勾選你要監控的模型。

別忘了儲存設定。

**你應該看到**：Smart Warmup 展開後出現模型列表；至少保留 1 個模型被勾選。

### 第 3 步：打開 Quota Protection，並設定閾值與監控模型

**為什麼**
Quota Protection 是「留餘糧」的核心：當監控模型的配額百分比 `<= threshold_percentage` 時，會把該模型寫進帳號檔案的 `protected_models`，後續請求該模型會優先避開這類帳號。

操作路徑：在 **Settings** 裡打開 **Quota Protection**。

1. 設定閾值（`1-99`）
2. 勾選你要監控的模型（至少 1 個）

::: tip 一個很好用的起手設定
如果你不想糾結，從預設 `threshold_percentage=10` 開始就行（見 `src/pages/Settings.tsx`）。
:::

**你應該看到**：Quota Protection 的模型勾選至少保留 1 個（UI 會阻擋你把最後一個也取消掉）。

### 第 4 步：確認「保護組歸一化」不會讓你踩坑

**為什麼**
TokenManager 做配額保護判斷時，會先把 `target_model` 歸一化成標準 ID（`normalize_to_standard_id`）。例如 `claude-sonnet-4-5-thinking` 會被歸一到 `claude-sonnet-4-5`。

這意味著：

- 你在 Quota Protection 裡勾選 `claude-sonnet-4-5`
- 當你實際請求 `claude-sonnet-4-5-thinking`

仍然會命中保護（因為它們屬於同一組）。

**你應該看到**：當某帳號的 `protected_models` 裡包含 `claude-sonnet-4-5` 時，對 `claude-sonnet-4-5-thinking` 的請求會優先避開該帳號。

### 第 5 步：需要立刻驗證時，用「手動預熱」觸發一次 warmup

**為什麼**
定時 Smart Warmup 的掃描週期是 10 分鐘一次（見 `src-tauri/src/modules/scheduler.rs`）。你想立刻驗證鏈路，手動預熱更直接。

操作路徑：打開 **Accounts** 頁面，點工具欄的「預熱」按鈕：

- 不選帳號：觸發全量預熱（呼叫 `warm_up_all_accounts`）
- 選中帳號：對選中的帳號逐個觸發預熱（呼叫 `warm_up_account`）

**你應該看到**：出現 toast，內容來自後端返回的字串（例如 "Warmup task triggered ..."）。

## 檢查點 ✅

- 你能在 Accounts 頁面看到每個帳號的模型配額百分比（證明配額資料鏈路 OK）
- 你能在 Settings 裡打開 Quota Protection / Smart Warmup，並成功儲存設定
- 你理解 `protected_models` 是「模型級」限制：一個帳號可能只對某些模型被避開
- 你知道 warmup 有 4 小時冷卻：短時間內重複點預熱，可能會看到 "skipped/cooldown" 相關提示

## 踩坑提醒

### 1) 你開了 Quota Protection，但一直沒生效

最常見原因是：帳號沒有 `quota` 資料。保護邏輯在後端需要先讀取 `quota.models[]` 才能判斷閾值（見 `src-tauri/src/proxy/token_manager.rs`）。

你可以回到 **第 1 步**，先把配額刷新出來。

### 2) 為什麼只有少數模型會被當成「保護組」？

TokenManager 對 `target_model` 的歸一化是「白名單式」的：只有明確列出來的模型名才會被映射到標準 ID（見 `src-tauri/src/proxy/common/model_mapping.rs`）。

歸一化後的邏輯是：用歸一化後的名稱（標準 ID 或原始模型名）去匹配帳號的 `protected_models` 欄位。如果匹配成功，該帳號會被跳過（見 `src-tauri/src/proxy/token_manager.rs:555-560, 716-719`）。這意味著：

- 白名單內的模型（如 `claude-sonnet-4-5-thinking`）會被歸一化為標準 ID（`claude-sonnet-4-5`），然後判斷是否在 `protected_models` 中
- 白名單外的模型歸一化失敗時，回退到原始模型名，仍然會去匹配 `protected_models`

換句話說，配額保護判斷對「所有模型名」都生效，只是白名單內的模型會先歸一化。

### 3) 手動/定時預熱為什麼需要代理在跑？

預熱請求最終會打到本地代理的內部端點：`POST /internal/warmup`（見 `src-tauri/src/proxy/server.rs` 的路由，以及 `src-tauri/src/proxy/handlers/warmup.rs` 的實作）。如果你沒啟動代理服務，warmup 會失敗。

另外，預熱呼叫的連接埠來自設定：`proxy.port`（如果讀取設定失敗，會回退到 `8045`，見 `src-tauri/src/modules/quota.rs`）。

## 本課小結

- Quota Protection 做「止損」：閾值以下就把模型寫進 `protected_models`，請求該模型時優先避開
- Smart Warmup 做「回滿自檢」：只在 100% 時觸發，10 分鐘掃描一次，4 小時冷卻
- 兩者都依賴「配額刷新」鏈路：先有 `quota.models[]`，治理才有基礎

## 下一課預告

配額治理解決的是「怎麼花更穩」。下一課建議接著看 **Proxy Monitor**，把請求日誌、帳號命中、模型映射都變成可回放的證據鏈。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Quota Protection UI（閾值、模型勾選、至少保留 1 個） | [`src/components/settings/QuotaProtection.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/QuotaProtection.tsx#L13-L168) | 13-168 |
| Smart Warmup UI（啟用後預設勾選、至少保留 1 個） | [`src/components/settings/SmartWarmup.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/SmartWarmup.tsx#L14-L120) | 14-120 |
| 配額治理設定欄位（`quota_protection` / `scheduled_warmup`） | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L54-L94) | 54-94 |
| 預設閾值與預設設定（`threshold_percentage: 10`） | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L20-L51) | 20-51 |
| 寫入/恢復 `protected_models`（閾值判斷與落盤） | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L254-L467) | 254-467 |
| 請求側配額保護過濾（`get_token(..., target_model)`） | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L470-L674) | 470-674 |
| 保護組歸一化（`normalize_to_standard_id`） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L230-L254) | 230-254 |
| Smart Warmup 定時掃描（10 分鐘一次 + 4 小時冷卻 + `warmup_history.json`） | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L11-L221) | 11-221 |
| 手動預熱指令（`warm_up_all_accounts` / `warm_up_account`） | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L167-L212) | 167-212 |
| 預熱實作（呼叫內部端點 `/internal/warmup`） | [`src-tauri/src/modules/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/quota.rs#L271-L512) | 271-512 |
| 內部預熱端點實作（建構請求 + 呼叫上游） | [`src-tauri/src/proxy/handlers/warmup.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/warmup.rs#L3-L220) | 3-220 |

</details>
