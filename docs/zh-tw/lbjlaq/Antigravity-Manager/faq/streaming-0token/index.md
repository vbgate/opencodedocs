---
title: "串流中斷: 0 Token 排查 | Antigravity-Manager"
sidebarTitle: "自癒還是手動介入"
subtitle: "串流中斷/0 Token/簽名失效：自癒機制與排查路徑"
description: "學習 Antigravity Tools 串流中斷、0 Token 與簽名失效的排查路徑。確認 /v1/messages 或 Gemini 串流呼叫，讀懂 peek 預讀與退避重試，結合 Proxy Monitor 和日誌快速定位原因並判斷是否需要輪換帳號。"
tags:
  - "faq"
  - "streaming"
  - "troubleshooting"
  - "retry"
prerequisite:
  - "/zh-tw/lbjlaq/Antigravity-Manager/start/getting-started/"
  - "/zh-tw/lbjlaq/Antigravity-Manager/start/first-run-data/"
  - "/zh-tw/lbjlaq/Antigravity-Manager/advanced/monitoring/"
  - "/zh-tw/lbjlaq/Antigravity-Manager/advanced/scheduling/"
order: 5
---

# 串流中斷/0 Token/簽名失效：自癒機制與排查路徑

在 Antigravity Tools 裡呼叫 `/v1/messages`（Anthropic 相容）或 Gemini 原生串流介面時，如果你遇到「串流輸出中斷」「200 OK 但 0 Token」「Invalid `signature`」這類問題，本課給你一條從 UI 到日誌的排查路徑。

## 學完你能做什麼

- 知道 0 Token/中斷問題在代理裡通常會先被「peek 預讀」攔下來
- 能從 Proxy Monitor 裡確認本次請求的帳號與映射模型（`X-Account-Email` / `X-Mapped-Model`）
- 能透過日誌判斷是「上游串流早夭」「退避重試」「輪換帳號」還是「簽名修復重試」
- 知道哪些情況該等代理自癒，哪些情況要手動介入

## 你現在的困境

你可能看到這些「現象」，但不知道要從哪裡下手：

- 串流輸出到一半斷掉，客戶端像「卡死」一樣不再繼續
- 200 OK，但 `usage.output_tokens=0` 或內容為空
- 400 錯誤裡出現 `Invalid \`signature\``、`Corrupted thought signature`、`must be \`thinking\`` 等

這類問題大多不是「你請求寫錯了」，而是串流傳輸、上游限流/波動、或歷史訊息裡攜帶的簽名區塊觸發了上游校驗。Antigravity Tools 在代理層做了多道防線，你只需要按固定路徑驗證它到底卡在哪一步。

## 什麼是 0 Token？

**0 Token**通常指一次請求最終返回的 `output_tokens=0`，並且看起來「沒生成內容」。在 Antigravity Tools 裡，它更常見的成因是「串流回應在真正輸出前就結束/報錯」，而不是模型真的生成了 0 個 token。代理會嘗試用 peek 預讀把這類空回應攔下來並觸發重試。

## 代理在背後做的三件事（先有心智模型）

### 1) 非串流請求可能被自動轉換為串流

`/v1/messages` 路徑裡，代理會在內部把「客戶端非串流請求」轉換為串流請求來請求上游，並在收到 SSE 後再收集成 JSON 返回（這樣做的原因在日誌裡寫明是「better quota」）。

原始碼證據：`src-tauri/src/proxy/handlers/claude.rs#L665-L913`。

### 2) Peek 預讀：先等到「第一塊有效資料」再把串流交給客戶端

對 `/v1/messages` 的 SSE 輸出，代理會先 `timeout + next()` 預讀，跳過心跳/註解行（以 `:` 開頭），直到拿到第一塊「不是空、不是心跳」的資料再開始正式轉發。如果 peek 階段就報錯/逾時/串流結束，會直接進入下一輪嘗試（下一輪通常會觸發帳號輪換）。

原始碼證據：`src-tauri/src/proxy/handlers/claude.rs#L812-L926`；Gemini 原生串流也有類似 peek：`src-tauri/src/proxy/handlers/gemini.rs#L117-L149`。

### 3) 統一退避重試 + 按狀態碼決定「要不要輪換帳號」

代理對常見狀態碼做了明確的退避策略，並定義了哪些狀態碼會觸發輪換帳號。

原始碼證據：`src-tauri/src/proxy/handlers/claude.rs#L117-L236`。

## 🎒 開始前的準備

- 你能打開 Proxy Monitor（見 [Proxy Monitor：請求日誌、篩選、詳情還原與匯出](/zh-tw/lbjlaq/Antigravity-Manager/advanced/monitoring/)）
- 你知道日誌在資料目錄的 `logs/` 下（見 [首次啟動必懂：資料目錄、日誌、托盤與自動啟動](/zh-tw/lbjlaq/Antigravity-Manager/start/first-run-data/)）

## 跟我做

### 第 1 步：確認你呼叫的是哪條介面路徑

**為什麼**
`/v1/messages`（claude handler）和 Gemini 原生（gemini handler）的自癢細節不同，先確認路徑能避免你在錯的日誌關鍵字上浪費時間。

打開 Proxy Monitor，找到那條失敗的請求，先記下 Path：

- `/v1/messages`：看 `src-tauri/src/proxy/handlers/claude.rs` 的邏輯
- `/v1beta/models/...:streamGenerateContent`：看 `src-tauri/src/proxy/handlers/gemini.rs` 的邏輯

**你應該看到**：請求記錄裡能看到 URL/方法/狀態碼（以及請求耗時）。

### 第 2 步：從回應 Header 裡抓住「帳號 + 映射模型」

**為什麼**
同一個請求失敗/成功，很多時候取決於「這次選到哪個帳號」「被路由到哪個上游模型」。代理會把這兩個資訊寫到回應標頭，先記下來，後面看日誌能對上號。

在失敗的那條請求裡，找這些回應標頭：

- `X-Account-Email`
- `X-Mapped-Model`

這兩項在 `/v1/messages` 和 Gemini handler 裡都會設定（例如 `/v1/messages` 的 SSE 回應裡：`src-tauri/src/proxy/handlers/claude.rs#L887-L896`；Gemini SSE：`src-tauri/src/proxy/handlers/gemini.rs#L235-L245`）。

**你應該看到**：`X-Account-Email` 是信箱，`X-Mapped-Model` 是實際請求的模型名。

### 第 3 步：在 app.log 裡判斷是不是「peek 階段就失敗」

**為什麼**
peek 失敗通常意味著「上游根本沒開始吐有效資料」。這類問題最常見的處理方式是重試/輪換帳號，你需要確認代理有沒有觸發。

先定位日誌檔案（日誌目錄來自資料目錄的 `logs/`，並按天滾動寫入 `app.log*`）。

::: code-group

```bash [macOS/Linux]
# 列出最近的日誌檔案
ls -lt "$HOME/.antigravity_tools/logs" | head
```

```powershell [Windows]
# 列出最近的日誌檔案
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs") | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

:::

然後在最新的 `app.log*` 裡搜這些關鍵字：

- `/v1/messages`（claude handler）：`Stream error during peek` / `Stream ended during peek` / `Timeout waiting for first data`（`src-tauri/src/proxy/handlers/claude.rs#L828-L864`）
- Gemini 原生串流：`[Gemini] Empty first chunk received, retrying...` / `Stream error during peek` / `Stream ended immediately`（`src-tauri/src/proxy/handlers/gemini.rs#L117-L144`）

**你應該看到**：如果觸發了 peek 重試，日誌裡會出現類似 "retrying..." 的警告，並且隨後會進入下一輪 attempt（通常會帶來帳號輪換）。

### 第 4 步：如果是 400/Invalid `signature`，確認代理是否做了「簽名修復重試」

**為什麼**
簽名類錯誤經常來自歷史訊息裡的 Thinking 區塊/簽名區塊不符合上游要求。Antigravity Tools 會嘗試「降級歷史 thinking 區塊 + 注入修復提示詞」再重試，你應該先讓它自癒跑完。

你可以用 2 個訊號判斷它是否進入了修復邏輯：

1. 日誌裡出現 `Unexpected thinking signature error ... Retrying with all thinking blocks removed.`（`src-tauri/src/proxy/handlers/claude.rs#L999-L1025`）
2. 隨後會把歷史 `Thinking` 區塊轉換為 `Text`，並在最後一條 user message 追加修復提示詞（`src-tauri/src/proxy/handlers/claude.rs#L1027-L1102`；Gemini handler 也會對 `contents[].parts` 追加同樣的提示詞：`src-tauri/src/proxy/handlers/gemini.rs#L300-L325`）

**你應該看到**：代理會在短延遲後自動重試（`FixedDelay`），並可能進入下一輪嘗試。

## 檢查點 ✅

- [ ] 你能在 Proxy Monitor 裡確認請求路徑（`/v1/messages` 或 Gemini 原生）
- [ ] 你能拿到本次請求的 `X-Account-Email` 與 `X-Mapped-Model`
- [ ] 你能在 `logs/app.log*` 裡搜到 peek/重試相關關鍵字
- [ ] 遇到 400 簽名錯誤時，你能確認代理是否進入「修復提示詞 + 清理 thinking 區塊」的重試邏輯

## 踩坑提醒

| 場景 | 你可能會怎麼做（❌） | 推薦做法（✓） |
| --- | --- | --- |
| 看到 0 Token 就立刻手動重試很多次 | 一直按客戶端重試按鈕，完全不看日誌 | 先看一次 Proxy Monitor + app.log，確認是否是 peek 階段早夭（會自動重試/輪換） |
| 遇到 `Invalid \`signature\`` 就直接清空資料目錄 | 把 `.antigravity_tools` 整個刪掉，帳號/統計全沒了 | 先讓代理執行一次「簽名修復重試」；只有在日誌明確提示不可恢復時，再考慮手動介入 |
| 把「伺服器端波動」當成「帳號壞了」 | 400/503/529 一律輪換帳號 | 輪換是否有效取決於狀態碼；代理本身有 `should_rotate_account(...)` 規則（`src-tauri/src/proxy/handlers/claude.rs#L226-L236`） |

## 本課小結

- 0 Token/串流中斷在代理裡通常先經過 peek 預讀；peek 階段失敗會觸發重試並進入下一輪 attempt
- `/v1/messages` 可能會把非串流請求內部轉換為串流再收集回 JSON，這會影響你理解「為什麼看起來像串流問題」
- 簽名失效類 400 錯誤，代理會嘗試「修復提示詞 + 清理 thinking 區塊」再重試，你優先驗證這條自癒路徑是否走通

## 下一課預告

> 下一課我們學習 **[端點速查表](/zh-tw/lbjlaq/Antigravity-Manager/appendix/endpoints/)**。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Claude handler：退避重試策略 + 輪換規則 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L117-L236) | 117-236 |
| Claude handler：內部把非串流轉換為串流（better quota） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L665-L776) | 665-776 |
| Claude handler：peek 預讀（跳過心跳/註解，避免空串流） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L812-L926) | 812-926 |
| Claude handler：400 簽名/區塊順序錯誤的修復重試 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L999-L1102) | 999-1102 |
| Gemini handler：peek 預讀（防止空串流 200 OK） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L117-L149) | 117-149 |
| Gemini handler：400 簽名錯誤的修復提示詞注入 | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L300-L325) | 300-325 |
| 簽名快取（三層：tool/family/session，含 TTL/最小長度） | [`src-tauri/src/proxy/signature_cache.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/signature_cache.rs#L5-L207) | 5-207 |
| Claude SSE 轉換：捕獲簽名並寫入簽名快取 | [`src-tauri/src/proxy/mappers/claude/streaming.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/streaming.rs#L639-L787) | 639-787 |

**關鍵常量**：
- `MAX_RETRY_ATTEMPTS = 3`：最大重試次數（`src-tauri/src/proxy/handlers/claude.rs#L27`）
- `SIGNATURE_TTL = 2 * 60 * 60` 秒：簽名快取 TTL（`src-tauri/src/proxy/signature_cache.rs#L6`）
- `MIN_SIGNATURE_LENGTH = 50`：簽名最小長度（`src-tauri/src/proxy/signature_cache.rs#L7`）

**關鍵函式**：
- `determine_retry_strategy(...)`：按狀態碼選擇退避策略（`src-tauri/src/proxy/handlers/claude.rs#L117-L167`）
- `should_rotate_account(...)`：按狀態碼決定是否輪換帳號（`src-tauri/src/proxy/handlers/claude.rs#L226-L236`）
- `SignatureCache::cache_session_signature(...)`：快取會話簽名（`src-tauri/src/proxy/signature_cache.rs#L149-L188`）

</details>
