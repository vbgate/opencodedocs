---
title: "用 OpenAI Images 呼叫 Imagen 3：參數對應 | Antigravity"
sidebarTitle: "按 OpenAI 習慣呼叫"
subtitle: "Imagen 3 圖片產生：OpenAI Images 參數 size/quality 自動對應"
description: "學習用 OpenAI Images API 呼叫 Imagen 3，掌握參數對應。size(寬x高)控制比例，quality控制畫質，支援 b64_json 和 url 回傳。"
tags:
  - "Imagen 3"
  - "OpenAI Images API"
  - "圖片產生"
  - "Gemini"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-security"
duration: 12
order: 4
---

# Imagen 3 圖片產生：OpenAI Images 參數 size/quality 自動對應

想用 OpenAI Images API 的習慣呼叫 Imagen 3？Antigravity Tools 的本地反向代理提供了 `/v1/images/generations`，並把 `size` / `quality` 自動對應成 Imagen 3 需要的圖片比例與解析度設定。

## 學完你能做什麼

- 用 `POST /v1/images/generations` 產生 Imagen 3 圖片，不改現有 OpenAI 客戶端/SDK 的呼叫習慣
- 用 `size: "WIDTHxHEIGHT"` 穩定控制 `aspectRatio`（16:9、9:16 等）
- 用 `quality: "standard" | "medium" | "hd"` 控制 `imageSize`（標準/2K/4K）
- 看懂回傳的 `b64_json` / `url(data:...)`，並透過回應標頭確認實際用到的帳號

## 你現在的困境

你可能遇到過這些情況：

- 客戶端只會呼叫 OpenAI 的 `/v1/images/generations`，但你想用的是 Imagen 3
- 同樣的 prompt，有時是方圖、有時是橫圖，比例控制不穩定
- 你把 `size` 寫成了 `16:9`，結果還是 1:1（而且不知道為什麼）

## 什麼時候用這一招

- 你已經用上了 Antigravity Tools 的本地反向代理，希望把「圖片產生」也統一走同一套閘道
- 你希望讓支援 OpenAI Images API 的工具（Cherry Studio、Kilo Code 等）直接產生 Imagen 3 圖片

## 🎒 開始前的準備

::: warning 前置檢查
本課預設你已經能啟動本地反向代理，並且知道自己的 Base URL（例如 `http://127.0.0.1:<port>`）。如果還沒跑通，請先完成「啟動本地反向代理並接入第一個客戶端」。
:::

::: info 鑑權提醒
如果你開啟了 `proxy.auth_mode`（例如 `strict` / `all_except_health`），呼叫 `/v1/images/generations` 時需要帶：

- `Authorization: Bearer <proxy.api_key>`
:::

## 核心思路

### 這套「自動對應」到底做了什麼？

**Imagen 3 的 OpenAI Images 對應**指的是：你仍然按 OpenAI Images API 發送 `prompt/size/quality`，代理把 `size` 解析為標準寬高比（如 16:9），把 `quality` 解析為解析度檔位（2K/4K），再用內部請求格式呼叫上游的 `gemini-3-pro-image`。

::: info 模型說明
`gemini-3-pro-image` 是 Google Imagen 3 圖片產生的模型名稱（來自專案 README 文件）。原始碼中預設使用此模型進行圖片產生。
:::

### 1) size -> aspectRatio（動態計算）

- 代理會把 `size` 當作 `WIDTHxHEIGHT` 來解析，然後根據寬高比匹配到標準比例。
- 如果 `size` 解析失敗（例如不是 `x` 分隔、或數字非法），會回退到 `1:1`。

### 2) quality -> imageSize（解析度檔位）

- `quality: "hd"` -> `imageSize: "4K"`
- `quality: "medium"` -> `imageSize: "2K"`
- `quality: "standard"`（或其他值）-> 不設定 `imageSize`（保持預設）

### 3) n 多圖是「並發發 n 次」

這個實作不會依賴上游的 `candidateCount > 1`，而是把 `n` 次產生拆成並發的多次請求，再把結果合併成 OpenAI 風格的 `data[]` 回傳。

## 跟我做

### 第 1 步：確認反向代理已啟動（可選但強烈建議）

**為什麼**
先確認你的 Base URL 和鑑權模式，避免後面把問題誤判成「圖片產生失敗」。

::: code-group

```bash [macOS/Linux]
 # 探活（auth_mode=all_except_health 時也能無鑑權存取）
curl -sS http://127.0.0.1:PORT/healthz
```

```powershell [Windows]
 # 探活（auth_mode=all_except_health 時也能無鑑權存取）
curl.exe -sS http://127.0.0.1:PORT/healthz
```

:::

**你應該看到**：回傳 JSON，包含 `"status": "ok"`。

### 第 2 步：發起一次最小可用的圖片產生請求

**為什麼**
先用最少欄位把鏈路跑通，再疊加比例/畫質/數量等參數。

::: code-group

```bash [macOS/Linux]
curl -sS http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

```powershell [Windows]
curl.exe -sS http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

:::

**你應該看到**：回應 JSON 裡有 `data` 陣列，陣列裡包含 `b64_json` 欄位（內容較長）。

### 第 3 步：確認你用到的是哪一個帳號（看回應標頭）

**為什麼**
圖片產生也會走帳號池排程；在排障時，確認「到底是哪一個帳號在產生」很關鍵。

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

```powershell [Windows]
curl.exe -i http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

:::

**你應該看到**：回應標頭裡包含 `X-Account-Email: ...`。

### 第 4 步：用 size 控制寬高比（推薦只用 WIDTHxHEIGHT）

**為什麼**
Imagen 3 上游接的是標準化 `aspectRatio`；你只要把 `size` 寫成一組常見的寬高，就能穩定對應到標準比例。

| 你傳的 size | 代理計算出的 aspectRatio |
|--- | ---|
| `"1024x1024"` | `1:1` |
| `"1920x1080"` / `"1280x720"` | `16:9` |
| `"1080x1920"` / `"720x1280"` | `9:16` |
| `"800x600"` | `4:3` |
| `"600x800"` | `3:4` |
| `"2560x1080"` | `21:9` |

**你應該看到**：圖片的比例隨 `size` 改變而改變。

### 第 5 步：用 quality 控制解析度檔位（standard/medium/hd）

**為什麼**
你不需要記 Imagen 3 的內部欄位，只用 OpenAI Images 的 `quality` 就能切換解析度檔位。

| 你傳的 quality | 代理寫入的 imageSize |
|--- | ---|
| `"standard"` | 不設定（走上游預設） |
| `"medium"` | `"2K"` |
| `"hd"` | `"4K"` |

**你應該看到**：`hd` 的細節更豐富（同時更慢/更吃資源，這是上游行為，具體以實際回傳為準）。

### 第 6 步：決定你要 b64_json 還是 url

**為什麼**
這個實作裡 `response_format: "url"` 並不會給你一個可公網存取的 URL，而是回傳 `data:<mime>;base64,...` 的 Data URI；很多工具更適合直接用 `b64_json`。

| response_format | data[] 的欄位 |
|--- | ---|
| `"b64_json"`（預設） | `{ "b64_json": "..." }` |
| `"url"` | `{ "url": "data:image/png;base64,..." }` |

## 檢查點 ✅

- 你能用 `/v1/images/generations` 回傳至少 1 張圖（`data.length >= 1`）
- 你能在回應標頭裡看到 `X-Account-Email`，並能在需要時重現同一帳號問題
- 你把 `size` 改成 `1920x1080` 後，圖片比例會變成橫圖（16:9）
- 你把 `quality` 改成 `hd` 後，代理會把它對應到 `imageSize: "4K"`

## 踩坑提醒

### 1) size 寫成 16:9 不會得到 16:9

這裡的 `size` 解析邏輯是按 `WIDTHxHEIGHT` 來拆分的；如果 `size` 不是這種格式，會直接回退到 `1:1`。

| 寫法 | 結果 |
|--- | ---|
| ✓ `"1920x1080"` | 16:9 |
| ❌ `"16:9"` | 回退 1:1 |

### 2) 沒開鑑權卻帶了 Authorization，也不會導致成功

鑑權是「是否必須」的問題：

- `proxy.auth_mode=off`：帶不帶 `Authorization` 都行
- `proxy.auth_mode=strict/all_except_health`：不帶 `Authorization` 會被拒絕

### 3) n > 1 時，可能出現「部分成功」

實作是並發請求並合併結果：如果部分請求失敗，仍可能回傳部分圖片，並在日誌裡記錄失敗原因。

## 本課小結

- 用 `/v1/images/generations` 呼叫 Imagen 3，關鍵是記住：`size` 用 `WIDTHxHEIGHT`，`quality` 用 `standard/medium/hd`
- `size` 控制的是 `aspectRatio`，`quality` 控制的是 `imageSize(2K/4K)`
- `response_format=url` 回傳的是 Data URI，不是公網 URL

## 下一課預告

> 下一課我們學習 **[音訊轉錄：/v1/audio/transcriptions 的限制與大封包處理](../audio/)**。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 暴露 OpenAI Images 路由 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L123-L146) | 123-146 |
| Images 產生端點：解析 prompt/size/quality + 拼裝 OpenAI 回應 | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1104-L1333) | 1104-1333 |
|--- | --- | ---|
| OpenAIRequest 宣告 size/quality（用於協定層相容） | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L6-L38) | 6-38 |
|--- | --- | ---|

**關鍵欄位（來自原始碼）**：
- `size`：按 `WIDTHxHEIGHT` 解析為 `aspectRatio`
- `quality`：`hd -> 4K`，`medium -> 2K`，其他不設定

</details>
