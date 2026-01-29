---
title: "OpenAI API: 接入設定 | Antigravity-Manager"
sidebarTitle: "5 分鐘接上 OpenAI SDK"
subtitle: "OpenAI API: 接入設定"
description: "學習 OpenAI 相容 API 的接入設定。掌握路由轉換、base_url 設定與 401/404/429 排查，快速使用 Antigravity Tools。"
tags:
  - "OpenAI"
  - "API Proxy"
  - "Chat Completions"
  - "Responses"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 1
---

# OpenAI 相容 API：/v1/chat/completions 與 /v1/responses 的落地策略

你會用這套 **OpenAI 相容 API** 把現成的 OpenAI SDK/客戶端直連到 Antigravity Tools 本地閘道，重點跑通 `/v1/chat/completions` 和 `/v1/responses`，並學會用回應標頭快速排障。

## 學完你能做什麼

- 用 OpenAI SDK（或 curl）直連 Antigravity Tools 的本地閘道
- 跑通 `/v1/chat/completions`（含 `stream: true`）和 `/v1/responses`
- 看懂 `/v1/models` 的模型列表，以及回應標頭裡的 `X-Mapped-Model`
- 遇到 401/404/429 時，知道該先排查哪裡

## 你現在的困境

很多客戶端/SDK 只認 OpenAI 的介面形狀：固定的 URL、固定的 JSON 欄位、固定的 SSE 串流格式。
Antigravity Tools 的目標不是讓你改客戶端，而是讓客戶端「以為自己在調 OpenAI」，實際上把請求轉成內部上游呼叫，再把結果轉回 OpenAI 格式。

## 什麼時候用這一招

- 你已經有一堆只支援 OpenAI 的工具（IDE 外掛、腳本、Bot、SDK），不想為每個都寫一套新整合
- 你希望統一用 `base_url` 把請求打到本機（或區域網路）閘道，再由閘道做帳號調度、重試與監控

## 🎒 開始前的準備

::: warning 前置條件
- 你已經在 Antigravity Tools 的「API Proxy」頁面啟動了反向代理服務，並記下連接埠（例如 `8045`）
- 你已經新增了至少一個可用帳號，否則反向代理拿不到上游 token
:::

::: info 驗證怎麼帶？
當你開啟 `proxy.auth_mode` 且設定了 `proxy.api_key` 時，請求需要攜帶 API Key。

Antigravity Tools 的中介程式會優先讀取 `Authorization`，也相容 `x-api-key`、`x-goog-api-key`。（實作見 `src-tauri/src/proxy/middleware/auth.rs`）
:::

## 什麼是 OpenAI 相容 API？

**OpenAI 相容 API**是一組「看起來像 OpenAI」的 HTTP 路由與 JSON/SSE 協定。客戶端按 OpenAI 的請求格式發送到本地閘道，閘道再把請求轉換為內部上游呼叫，並把上游回應轉換回 OpenAI 的回應結構，讓現成的 OpenAI SDK 基本無需改動就能用。

### 相容端點速覽（本課相關）

| 端點 | 用途 | 程式碼證據 |
|--- | --- | ---|
| `POST /v1/chat/completions` | Chat Completions（含串流） | `src-tauri/src/proxy/server.rs` 路由註冊；`src-tauri/src/proxy/handlers/openai.rs` |
| `POST /v1/completions` | Legacy Completions（複用同一處理器） | `src-tauri/src/proxy/server.rs` 路由註冊 |
| `POST /v1/responses` | Responses/Codex CLI 相容（複用同一處理器） | `src-tauri/src/proxy/server.rs` 路由註冊（註解：相容 Codex CLI） |
| `GET /v1/models` | 回傳模型列表（含自訂對應 + 動態產生） | `src-tauri/src/proxy/handlers/openai.rs` + `src-tauri/src/proxy/common/model_mapping.rs` |

## 跟我做

### 第 1 步：用 curl 確認服務活著（/healthz + /v1/models）

**為什麼**
先把「服務沒啟動/連接埠不對/被防火牆擋了」這類低級問題排掉。

```bash
 # 1) 健康檢查
curl -s http://127.0.0.1:8045/healthz

 # 2) 拉取模型列表
curl -s http://127.0.0.1:8045/v1/models
```

**你應該看到**：`/healthz` 回傳類似 `{"status":"ok"}`；`/v1/models` 回傳 `{"object":"list","data":[...]}`。

### 第 2 步：用 OpenAI Python SDK 呼叫 /v1/chat/completions

**為什麼**
這一步證明「OpenAI SDK → 本地閘道 → 上游 → OpenAI 回應轉換」整條鏈路是通的。

```python
import openai

client = openai.OpenAI(
    api_key="sk-antigravity",
    base_url="http://127.0.0.1:8045/v1",
)

response = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "你好，請自我介紹"}],
)

print(response.choices[0].message.content)
```

**你應該看到**：終端機印出一段模型回應文字。

### 第 3 步：打開 stream，確認 SSE 串流回傳

**為什麼**
很多客戶端依賴 OpenAI 的 SSE 協定（`Content-Type: text/event-stream`）。這一步確認串流鏈路和事件格式可用。

```bash
curl -N http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "stream": true,
    "messages": [
      {"role": "user", "content": "用三句話解釋一下什麼是本地反向代理閘道"}
    ]
  }'
```

**你應該看到**：終端機不斷輸出以 `data: { ... }` 開頭的行，並以 `data: [DONE]` 結束。

### 第 4 步：用 /v1/responses（Codex/Responses 風格）跑通一條請求

**為什麼**
有些工具走的是 `/v1/responses` 或會在請求體裡使用 `instructions`、`input` 等欄位。本專案會把這類請求「正規化」為 `messages` 再複用同一套轉換邏輯。（處理器見 `src-tauri/src/proxy/handlers/openai.rs`）

```bash
curl -s http://127.0.0.1:8045/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "instructions": "你是一個嚴謹的程式碼審查員。",
    "input": "請指出下面這段程式碼最可能的 bug：\n\nfunction add(a, b) { return a - b }"
  }'
```

**你應該看到**：回應體是一個 OpenAI 風格的回應物件（本專案會把 Gemini 回應轉換為 OpenAI `choices[].message.content`）。

### 第 5 步：確認模型路由生效（看 X-Mapped-Model 回應標頭）

**為什麼**
你在客戶端裡寫的 `model` 不一定是實際呼叫的「物理模型」。閘道會先做模型對應（含自訂對應/萬用字元，見 [模型路由：自訂對應、萬用字元優先級與預設策略](/zh-tw/lbjlaq/Antigravity-Manager/advanced/model-router/)），並把最終結果放在回應標頭裡，方便你排障。

```bash
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

**你應該看到**：回應標頭裡包含 `X-Mapped-Model: ...`（例如對應到 `gemini-2.5-flash`），並且可能還會包含 `X-Account-Email: ...`。

## 檢查點 ✅

- `GET /healthz` 回傳 `{"status":"ok"}`（或等價 JSON）
- `GET /v1/models` 回傳 `object=list` 且 `data` 是陣列
- `/v1/chat/completions` 非串流請求能拿到 `choices[0].message.content`
- `stream: true` 時能收到 SSE，並以 `[DONE]` 結束
- `curl -i` 能看到 `X-Mapped-Model` 回應標頭

## 踩坑提醒

### 1) Base URL 寫錯導致 404（最常見）

- OpenAI SDK 範例裡，`base_url` 需要以 `/v1` 結尾（見專案 README 的 Python 範例）。
- 有些客戶端會「疊路徑」。例如 README 明確提到：Kilo Code 在 OpenAI 模式下可能會拼出 `/v1/chat/completions/responses` 這類非標準路徑，從而觸發 404。

### 2) 401：不是上游掛了，是你沒帶 key 或模式不對

當驗證策略的「有效模式」不是 `off` 時，中介程式會校驗請求標頭：`Authorization: Bearer <proxy.api_key>`，也相容 `x-api-key`、`x-goog-api-key`。（實作見 `src-tauri/src/proxy/middleware/auth.rs`）

::: tip 驗證模式提示
`auth_mode = auto` 時會根據 `allow_lan_access` 自動決定：
- `allow_lan_access = true` → 有效模式為 `all_except_health`（除 `/healthz` 外都需要驗證）
- `allow_lan_access = false` → 有效模式為 `off`（本機存取無需驗證）
:::

### 3) 429/503/529：代理會重試 + 輪換帳號，但也可能「池子耗盡」

OpenAI 處理器內建最多 3 次嘗試（並受帳號池大小限制），遇到部分錯誤會等待/輪換帳號重試。（實作見 `src-tauri/src/proxy/handlers/openai.rs`）

## 本課小結

- `/v1/chat/completions` 是最通用的接入點，`stream: true` 會走 SSE
- `/v1/responses` 和 `/v1/completions` 走同一套相容處理器，核心是先把請求正規化為 `messages`
- `X-Mapped-Model` 幫你確認「客戶端模型名 → 最終物理模型」的對應結果

## 下一課預告

> 下一課我們會繼續看 **Anthropic 相容 API：/v1/messages 與 Claude Code 的關鍵契約**（對應章節：`platforms-anthropic`）。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| OpenAI 路由註冊（含 /v1/responses） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Chat Completions 處理器（含 Responses 格式偵測） | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L70-L462) | 70-462 |
| /v1/completions 與 /v1/responses 處理器（Codex/Responses 正規化 + 重試/輪換） | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L464-L1080) | 464-1080 |
| /v1/models 的回傳（動態模型列表） | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1082-L1102) | 1082-1102 |
| OpenAI 請求資料結構（messages/instructions/input/size/quality） | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L7-L38) | 7-38 |
|--- | --- | ---|
|--- | --- | ---|
| 模型對應與萬用字元優先級（精確 > 萬用字元 > 預設） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
|--- | --- | ---|

**關鍵常數**：
- `MAX_RETRY_ATTEMPTS = 3`：OpenAI 協定最大嘗試次數（含輪換）（見 `src-tauri/src/proxy/handlers/openai.rs`）

**關鍵函式**：
- `transform_openai_request(...)`：把 OpenAI 請求體轉換成內部上游請求（見 `src-tauri/src/proxy/mappers/openai/request.rs`）
- `transform_openai_response(...)`：把上游回應轉換成 OpenAI `choices`/`usage`（見 `src-tauri/src/proxy/mappers/openai/response.rs`）

</details>
