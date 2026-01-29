---
title: "Gemini API：本地閘道接入 | Antigravity-Manager"
subtitle: "Gemini API 接入：讓 Google SDK 直連本地閘道"
sidebarTitle: "直連本地 Gemini"
description: "學習 Antigravity-Manager 的 Gemini 本地閘道接入。透過 /v1beta/models 端點，掌握 generateContent 和 streamGenerateContent 呼叫，並用 cURL 與 Python 驗證。"
tags:
  - "Gemini"
  - "Google SDK"
  - "API Proxy"
  - "v1beta"
prerequisite:
  - "/zh-tw/lbjlaq/Antigravity-Manager/start/quick-start/"
  - "/zh-tw/lbjlaq/Antigravity-Manager/start/add-account/"
order: 3
---

# Gemini API 接入：讓 Google SDK 直連本地閘道

## 學完你能做什麼

- 用 Antigravity Tools 暴露的 Gemini 原生端點（`/v1beta/models/*`）接入你的客戶端
- 用 Google 風格的 `:generateContent` / `:streamGenerateContent` 路徑呼叫本地閘道
- 在開啟 Proxy 鑑權時，理解為什麼 `x-goog-api-key` 能直接用

## 你現在的困境

你可能已經把本地反向代理跑起來了，但一到 Gemini 這裡就開始卡：

- Google SDK 預設打 `generativelanguage.googleapis.com`，怎麼改成你自己的 `http://127.0.0.1:<port>`？
- Gemini 的路徑帶冒號（`models/<model>:generateContent`），很多客戶端一拼接就變成 404
- 你啟用了代理鑑權，但 Google 客戶端不發 `x-api-key`，於是一直 401

## 什麼時候用這一招

- 你希望用「Gemini 原生協定」而不是 OpenAI/Anthropic 相容層
- 你手上已經有 Google/第三方 Gemini 風格客戶端，想最低成本遷移到本地閘道

## 🎒 開始前的準備

::: warning 前置條件
- 你已經在 App 裡新增了至少 1 個帳號（否則後端拿不到上游 access token）
- 你已經啟動了本地反向代理服務，並知道監聽連接埠（預設會用到 `8045`）
:::

## 核心思路

Antigravity Tools 在本地 Axum 伺服器上暴露了 Gemini 原生路徑：

- 列表：`GET /v1beta/models`
- 呼叫：`POST /v1beta/models/<model>:generateContent`
- 串流：`POST /v1beta/models/<model>:streamGenerateContent`

後端會把你的 Gemini 原生請求 body 包一層 v1internal 的結構（注入 `project`、`requestId`、`requestType` 等），再轉發到 Google 的 v1internal 上游端點（並帶上帳號 access token）。（原始碼：`src-tauri/src/proxy/mappers/gemini/wrapper.rs`、`src-tauri/src/proxy/upstream/client.rs`）

::: info 為什麼教學裡的 base URL 推薦用 127.0.0.1？
App 的快速整合範例裡寫死推薦 `127.0.0.1`，原因是「避免部分環境 IPv6 解析延遲問題」。（原始碼：`src/pages/ApiProxy.tsx`）
:::

## 跟我做

### 第 1 步：確認閘道線上（/healthz）

**為什麼**
先確認服務線上，再排查協定/鑑權問題會省很多時間。

::: code-group

```bash [macOS/Linux]
curl -s "http://127.0.0.1:8045/healthz"
```

```powershell [Windows]
Invoke-RestMethod "http://127.0.0.1:8045/healthz"
```

:::

**你應該看到**：返回 JSON，包含 `{"status":"ok"}`（原始碼：`src-tauri/src/proxy/server.rs`）。

### 第 2 步：列出 Gemini 模型（/v1beta/models）

**為什麼**
你需要先確認「對外暴露的模型 ID」是什麼，後面的 `<model>` 都以這裡為準。

```bash
curl -s "http://127.0.0.1:8045/v1beta/models" | head
```

**你應該看到**：回應裡有 `models` 陣列，每個元素的 `name` 類似 `models/<id>`（原始碼：`src-tauri/src/proxy/handlers/gemini.rs`）。

::: tip 重要
模型 ID 用哪個欄位？
- ✅ 使用 `displayName` 欄位（如 `gemini-2.0-flash`）
- ✅ 或從 `name` 欄位去掉 `models/` 前綴
- ❌ 不要直接複製 `name` 欄位的完整值（會導致路徑錯誤）

如果你複製了 `name` 欄位（如 `models/gemini-2.0-flash`）用作模型 ID，請求路徑會變成 `/v1beta/models/models/gemini-2.0-flash:generateContent`，這是錯的。（原始碼：`src-tauri/src/proxy/common/model_mapping.rs`）
:::

::: warning 重要
當前 `/v1beta/models` 是「把本地動態模型列表偽裝成 Gemini models 列表」的返回，不是向上游即時拉取。（原始碼：`src-tauri/src/proxy/handlers/gemini.rs`）
:::

### 第 3 步：呼叫 generateContent（帶冒號的路徑）

**為什麼**
Gemini 原生 REST API 的關鍵就是 `:generateContent` 這種「帶冒號的 action」。後端會在同一路由裡解析 `model:method`。（原始碼：`src-tauri/src/proxy/handlers/gemini.rs`）

```bash
curl -s \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:generateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Hello"}]}
    ]
  }'
```

**你應該看到**：回應 JSON 裡有 `candidates`（或外層有 `response.candidates`，代理會解包）。

### 第 4 步：呼叫 streamGenerateContent（SSE）

**為什麼**
串流對「長輸出/大模型」更穩；代理會把上游 SSE 轉發回你的客戶端，並設定 `Content-Type: text/event-stream`。（原始碼：`src-tauri/src/proxy/handlers/gemini.rs`）

```bash
curl -N \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:streamGenerateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Tell me a short story"}]}
    ]
  }'
```

**你應該看到**：終端機持續輸出 `data: {...}` 形式的 SSE 行，正常情況下最後會出現 `data: [DONE]`（表示串流結束）。

::: tip 注意
`data: [DONE]` 是 SSE 的標準結束標記，但**不是一定出現**：
- 如果上游正常結束並發送 `[DONE]`，代理會轉發它
- 如果上游異常斷開、逾時或發送其他結束訊號，代理不會補發 `[DONE]`

客戶端程式碼應按 SSE 標準處理：遇到 `data: [DONE]` 或連線斷開都應視為串流結束。（原始碼：`src-tauri/src/proxy/handlers/gemini.rs`）
:::

### 第 5 步：用 Python Google SDK 直連本地閘道

**為什麼**
這是專案 UI 裡給的「快速整合」範例路徑：用 Google Generative AI Python 套件把 `api_endpoint` 指到你的本地反向代理位址。（原始碼：`src/pages/ApiProxy.tsx`）

```python
 #需要安裝: pip install google-generativeai
import google.generativeai as genai

genai.configure(
    api_key="YOUR_PROXY_API_KEY",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

model = genai.GenerativeModel('<modelId>')
response = model.generate_content("Hello")
print(response.text)
```

**你應該看到**：程式輸出一段模型回應文字。

## 檢查點 ✅

- `/healthz` 能返回 `{"status":"ok"}`
- `/v1beta/models` 能列出模型（至少 1 個）
- `:generateContent` 能返回 `candidates`
- `:streamGenerateContent` 返回 `Content-Type: text/event-stream` 且能持續出流

## 踩坑提醒

- **401 一直過不去**：如果你啟用了鑑權，但 `proxy.api_key` 為空，後端會直接拒絕請求。（原始碼：`src-tauri/src/proxy/middleware/auth.rs`）
- **Header 帶什麼 key**：代理會同時識別 `Authorization`、`x-api-key`、`x-goog-api-key`。所以「Google 風格客戶端只發 `x-goog-api-key`」也能過。（原始碼：`src-tauri/src/proxy/middleware/auth.rs`）
- **countTokens 結果永遠是 0**：當前 `POST /v1beta/models/<model>/countTokens` 返回固定 `{"totalTokens":0}`，屬於占位實作。（原始碼：`src-tauri/src/proxy/handlers/gemini.rs`）

## 本課小結

- 你要接的是 `/v1beta/models/*`，不是 `/v1/*`
- 關鍵路徑寫法是 `models/<modelId>:generateContent` / `:streamGenerateContent`
- 啟用鑑權時，`x-goog-api-key` 是被代理明確支援的請求標頭

## 下一課預告

> 下一課我們學習 **[Imagen 3 圖片生成：OpenAI Images 參數 size/quality 的自動對應](../imagen/)**。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| Gemini 路由註冊（/v1beta/models/*） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L181) | 170-181 |
| 模型 ID 解析與路由（為什麼 `models/` 前綴會導致路由錯誤） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L58-L77) | 58-77 |
| 解析 `model:method` + generate/stream 主邏輯 | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L14-L337) | 14-337 |
| SSE 出流邏輯（轉發 `[DONE]` 而非自動補發） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L161-L183) | 161-183 |
| `/v1beta/models` 返回結構（動態模型列表偽裝） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L39-L71) | 39-71 |
| `countTokens` 占位實作（固定 0） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L73-L79) | 73-79 |
|--- | --- | ---|
| Google SDK Python 範例（`api_endpoint` 指向本地閘道） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L692-L734) | 692-734 |
| Gemini 會話指紋（黏性/快取用 session_id） | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L121-L158) | 121-158 |
| Gemini 請求 v1internal 包裝（注入 project/requestId/requestType 等） | [`src-tauri/src/proxy/mappers/gemini/wrapper.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/gemini/wrapper.rs#L5-L160) | 5-160 |
| 上游 v1internal 端點與 fallback | [`src-tauri/src/proxy/upstream/client.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/client.rs#L8-L182) | 8-182 |

**關鍵常數**：
- `MAX_RETRY_ATTEMPTS = 3`：Gemini 請求最大輪換次數上限（原始碼：`src-tauri/src/proxy/handlers/gemini.rs`）

</details>
