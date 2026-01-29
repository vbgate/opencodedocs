---
title: "Anthropic: 相容 API | Antigravity-Manager"
sidebarTitle: "讓 Claude Code 走本地閘道"
subtitle: "Anthropic: 相容 API"
description: "學習 Antigravity-Manager 的 Anthropic 相容 API。設定 Claude Code 的 Base URL、用 /v1/messages 跑通對話、理解驗證與 warmup 攔截。"
tags:
  - "anthropic"
  - "claude"
  - "claude-code"
  - "proxy"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---
# Anthropic 相容 API：/v1/messages 與 Claude Code 的關鍵契約

想讓 Claude Code 走本地閘道、但又不想改它的 Anthropic 協定用法，你只要把 Base URL 指向 Antigravity Tools，然後用 `/v1/messages` 跑通一次請求就行。

## 什麼是 Anthropic 相容 API？

**Anthropic 相容 API** 指 Antigravity Tools 對外提供的 Anthropic Messages 協定端點。它接收 `/v1/messages` 請求，在本地做報文清理、串流封裝與重試輪換後，再把請求轉發到上游提供真實模型能力。

## 學完你能做什麼

- 用 Antigravity Tools 的 `/v1/messages` 介面跑通 Claude Code（或任何 Anthropic Messages 客戶端）
- 分清楚 Base URL 和驗證 header 怎麼配，避免 401/404 盲試
- 需要串流就拿到標準 SSE；不需要串流也能拿到 JSON
- 知道代理在後台做了哪些「協定修補」（warmup 攔截、訊息清理、簽名兜底）

## 你現在的困境

你想用 Claude Code/Anthropic SDK，但網路、帳號、配額、限流這些問題讓對話很不穩定；你已經把 Antigravity Tools 當作本地閘道跑起來了，卻常卡在這幾類問題：

- Base URL 寫成了 `.../v1` 或被客戶端「疊路徑」，結果直接 404
- 開了代理驗證但不知道客戶端到底用哪個 header 傳 key，結果 401
- Claude Code 的後台 warmup/摘要任務把配額悄悄吃掉

## 什麼時候用這一招

- 你要接入 **Claude Code CLI**，並希望它「按 Anthropic 協定」直連本地閘道
- 你手頭的客戶端只支援 Anthropic Messages API（`/v1/messages`），不想改程式碼

## 🎒 開始前的準備

::: warning 前置條件
本課預設你已經跑通了本地反代的基本閉環（能訪問 `/healthz`，知道代理連接埠與是否開啟驗證）。如果還沒跑通，先看 **[啟動本地反代並接入第一個客戶端](/zh-tw/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**。
:::

你需要準備三樣東西：

1. 代理位址（範例：`http://127.0.0.1:8045`）
2. 是否開啟了代理驗證（以及對應的 `proxy.api_key`）
3. 一個能發 Anthropic Messages 請求的客戶端（Claude Code / curl 都行）

## 核心思路

**Anthropic 相容 API** 在 Antigravity Tools 裡對應一組固定路由：`POST /v1/messages`、`POST /v1/messages/count_tokens`、`GET /v1/models/claude`（見 `src-tauri/src/proxy/server.rs` 的 Router 定義）。

其中 `/v1/messages` 是「主線入口」，代理會在真正發上游請求前做一堆相容性處理：

- 清理歷史訊息裡不被協定接受的欄位（例如 `cache_control`）
- 合併連續同角色訊息，避免「角色交替」驗證失敗
- 偵測 Claude Code 的 warmup 報文並直接回傳模擬回應，減少配額浪費
- 根據錯誤類型做重試與帳號輪換（最多 3 次嘗試），提升長會話穩定性

## 跟我做

### 第 1 步：確認 Base URL 只寫到連接埠

**為什麼**
`/v1/messages` 是代理側固定路由，Base URL 寫成 `.../v1` 很容易被客戶端再拼一次 `/v1/messages`，最終變成 `.../v1/v1/messages`。

你可以先用 curl 直接探活：

```bash
#你應該看到：{"status":"ok"}
curl -sS "http://127.0.0.1:8045/healthz"
```

### 第 2 步：如果你開啟了驗證，先記住這 3 種 header

**為什麼**
代理的驗證中介程式會從 `Authorization`、`x-api-key`、`x-goog-api-key` 裡取 key；開了驗證但 header 沒對上，就會穩定 401。

::: info 代理接受哪些驗證 header？
`Authorization: Bearer <key>`、`x-api-key: <key>`、`x-goog-api-key: <key>` 都能用（見 `src-tauri/src/proxy/middleware/auth.rs`）。
:::

### 第 3 步：用 Claude Code CLI 直連本地閘道

**為什麼**
Claude Code 使用 Anthropic Messages 協定；把它的 Base URL 指向本地閘道，就能複用 `/v1/messages` 這套契約。

按 README 的範例設定環境變數：

```bash
export ANTHROPIC_API_KEY="sk-antigravity"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

**你應該看到**：Claude Code 能正常啟動，並在你發送訊息後收到回覆。

### 第 4 步：先列出可用模型（給 curl/SDK 用）

**為什麼**
不同客戶端會把 `model` 原樣傳過來；先把模型列表拿到手，排查問題會快很多。

```bash
curl -sS "http://127.0.0.1:8045/v1/models/claude" | jq
```

**你應該看到**：回傳一個 `object: "list"` 的 JSON，其中 `data[].id` 就是可用的模型 ID。

### 第 5 步：用 curl 呼叫 `/v1/messages`（非串流）

**為什麼**
這是最小可重現鏈路：不用 Claude Code，也能確認「路由 + 驗證 + 請求體」到底哪裡出錯。

```bash
curl -i "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<從 /v1/models/claude 裡選一個>",
    "max_tokens": 128,
    "messages": [
      {"role": "user", "content": "你好，簡單介紹一下你自己"}
    ]
  }'
```

**你應該看到**：

- HTTP 200
- 回應標頭裡可能包含 `X-Account-Email` 和 `X-Mapped-Model`（用於排障）
- 回應體是 Anthropic Messages 風格的 JSON（`type: "message"`）

### 第 6 步：需要串流時，打開 `stream: true`

**為什麼**
Claude Code 會用 SSE；你自己用 curl 也能把 SSE 跑通，確認中間沒有代理/緩衝問題。

```bash
curl -N "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<從 /v1/models/claude 裡選一個>",
    "max_tokens": 128,
    "stream": true,
    "messages": [
      {"role": "user", "content": "用 3 句話解釋什麼是本地反代"}
    ]
  }'
```

**你應該看到**：一 行行的 SSE 事件（`event: message_start`、`event: content_block_delta` 等）。

## 檢查點 ✅

- `GET /healthz` 回傳 `{"status":"ok"}`
- `GET /v1/models/claude` 能拿到 `data[].id`
- `POST /v1/messages` 能 200 回傳（非串流 JSON 或串流 SSE 二選一）

## 踩坑提醒

### 1) Base URL 不要寫成 `.../v1`

Claude Code 的範例是 `ANTHROPIC_BASE_URL="http://127.0.0.1:8045"`，因為代理側路由本身就帶 `/v1/messages`。

### 2) 開了驗證但 `proxy.api_key` 為空，會直接拒絕

代理驗證開啟但 `api_key` 為空時，中介程式會直接回傳 401（見 `src-tauri/src/proxy/middleware/auth.rs` 的保護邏輯）。

### 3) `/v1/messages/count_tokens` 在預設路徑下是佔位實作

當 z.ai 轉發沒啟用時，這個端點會直接回傳 `input_tokens: 0, output_tokens: 0`（見 `handle_count_tokens`）。不要用它來判斷真實 token。

### 4) 你明明沒開串流，但看到伺服器在「內部走 SSE」

代理對 `/v1/messages` 有一個相容策略：當客戶端不要求串流時，伺服器可能會**內部強制走串流**再把結果收集成 JSON 回傳（見 `handle_messages` 裡 `force_stream_internally` 的邏輯）。

## 本課小結

- Claude Code/Anthropic 客戶端要跑通，本質是 3 件事：Base URL、驗證 header、`/v1/messages` 請求體
- 代理為了「協定能跑 + 長會話穩定」，會對歷史訊息做清理、對 warmup 做攔截、並在失敗時重試/輪換帳號
- `count_tokens` 目前不能當真實口徑（除非你啟用了對應的轉發路徑）

## 下一課預告

> 下一課我們學習 **[Gemini 原生 API：/v1beta/models 以及 Google SDK 的端點接入](/zh-tw/lbjlaq/Antigravity-Manager/platforms/gemini/)**。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 代理路由：`/v1/messages` / `count_tokens` / `models/claude` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| Anthropic 主入口：`handle_messages`（含 warmup 攔截與重試迴圈） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L240-L1140) | 240-1140 |
| 模型列表：`GET /v1/models/claude` | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1163-L1183) | 1163-1183 |
| `count_tokens`（z.ai 未啟用時回傳 0） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1210) | 1186-1210 |
| Warmup 偵測與模擬回應 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1375-L1493) | 1375-1493 |
| 驗證 header 相容：`Authorization`/`x-api-key`/`x-goog-api-key` | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| 請求清理：移除 `cache_control` | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L68-L148) | 68-148 |
| 請求清理：合併連續同角色訊息 | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L253-L296) | 253-296 |
| Claude -> Gemini v1internal 轉換入口：`transform_claude_request_in()` | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L332-L618) | 332-618 |

**關鍵常數**：
- `MAX_RETRY_ATTEMPTS = 3`：`/v1/messages` 的最大重試次數

</details>
