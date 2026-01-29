---
title: "音訊 API: Whisper 相容端點 | Antigravity-Manager"
subtitle: "音訊 API: Whisper 相容端點"
sidebarTitle: "5 分鐘音訊轉文字"
description: "學習 Antigravity-Manager 音訊轉錄 API 的使用。掌握 6 種格式支援、15MB 限制和大包體處理方法，快速實現音訊轉文字。"
tags:
  - "音訊轉錄"
  - "OpenAI"
  - "Whisper"
  - "Gemini"
  - "API Proxy"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 5
---
# 音訊轉錄：/v1/audio/transcriptions 的限制與大包體處理

你可以用 **`POST /v1/audio/transcriptions 音訊轉錄端點`**把音訊檔案轉成文字。它長得像 OpenAI Whisper API，但會在本地閘道裡做格式校驗、檔案大小限制，並把音訊作為 Gemini 的 `inlineData` 上游請求發送出去。

## 學完你能做什麼

- 用 curl / OpenAI SDK 呼叫 `POST /v1/audio/transcriptions` 把音訊轉成 `{"text":"..."}`
- 弄清楚支援的 6 種音訊格式，以及 **15MB 硬限制**的真實報錯形態
- 知道 `model` / `prompt` 的預設值與透傳方式（不猜測上游規則）
- 在 Proxy Monitor 裡定位音訊請求，並理解 `[Binary Request Data]` 的來源

## 你現在的困境

你想把會議錄音、播客或客服通話轉成文字，但經常卡在這些點：

- 不同工具對音訊格式/介面形狀不一樣，腳本和 SDK 很難複用
- 上傳失敗時只看到「壞請求/閘道錯誤」，不知道是格式不對還是檔案太大
- 你想把轉錄放進 Antigravity Tools 的「本地閘道」統一調度和監控，但不確定它到底相容到什麼程度

## 🎒 開始前的準備

::: warning 前置條件
- 你已經跑通 [啟動本地反代並接入第一個客戶端](/zh-tw/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)，並知道反代連接埠（本頁用 `8045` 舉例）
- 你已經跑通 [新增帳號](/zh-tw/lbjlaq/Antigravity-Manager/start/add-account/)，至少有 1 個可用帳號
:::

## 什麼是音訊轉錄端點（/v1/audio/transcriptions）？

**音訊轉錄端點**是 Antigravity Tools 暴露的一條 OpenAI Whisper 相容路由。客戶端用 `multipart/form-data` 上傳音訊檔案，服務端校驗副檔名與大小後，把音訊轉成 Base64 的 `inlineData`，再呼叫上游 `generateContent`，最後只返回一個 `text` 欄位。

## 端點與限制速覽

| 專案 | 結論 | 程式碼證據 |
|--- | --- | ---|
| 入口路由 | `POST /v1/audio/transcriptions` | `src-tauri/src/proxy/server.rs` 註冊路由到 `handlers::audio::handle_audio_transcription` |
| 支援格式 | 透過檔案副檔名識別：`mp3/wav/m4a/ogg/flac/aiff(aif)` | `src-tauri/src/proxy/audio/mod.rs` `detect_mime_type()` |
| 檔案大小 | **15MB 硬限制**（超過返回 413 + 文字錯誤資訊） | `src-tauri/src/proxy/audio/mod.rs` `exceeds_size_limit()`；`src-tauri/src/proxy/handlers/audio.rs` |
| 反代總體 body limit | Axum 層面允許到 100MB | `src-tauri/src/proxy/server.rs` `DefaultBodyLimit::max(100 * 1024 * 1024)` |
| 預設參數 | `model="gemini-2.0-flash-exp"`；`prompt="Generate a transcript of the speech."` | `src-tauri/src/proxy/handlers/audio.rs` |

## 跟我做

### 第 1 步：確認閘道在跑（/healthz）

**為什麼**
先把連接埠不對/服務沒啟動這類問題排掉。

::: code-group

```bash [macOS/Linux]
curl -s http://127.0.0.1:8045/healthz
```

```powershell [Windows]
curl http://127.0.0.1:8045/healthz
```

:::

**你應該看到**：類似 `{"status":"ok"}` 的 JSON。

### 第 2 步：準備一個不超過 15MB 的音訊檔案

**為什麼**
服務端會在處理器裡做 15MB 校驗，超過會直接返回 413。

::: code-group

```bash [macOS/Linux]
ls -lh audio.mp3
```

```powershell [Windows]
Get-Item audio.mp3 | Select-Object Length
```

:::

**你應該看到**：檔案大小不超過 `15MB`。

### 第 3 步：用 curl 呼叫 /v1/audio/transcriptions

**為什麼**
curl 最直接，方便你先驗證協議形狀和報錯資訊。

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3" \
  -F "model=gemini-2.0-flash-exp" \
  -F "prompt=Generate a transcript of the speech."
```

**你應該看到**：返回 JSON，只有一個 `text` 欄位。

```json
{
  "text": "..."
}
```

### 第 4 步：用 OpenAI Python SDK 呼叫

```python
from openai import OpenAI

client = OpenAI(
  base_url="http://127.0.0.1:8045/v1",
  api_key="your-proxy-api-key"  # 如果開啟了鑑權
)

audio_file = open("audio.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="gemini-2.0-flash-exp",
  file=audio_file
)

print(transcript.text)
```

**你應該看到**：`print(transcript.text)` 輸出一段轉錄文字。

## 支援的音訊格式

Antigravity Tools 透過檔案副檔名決定 MIME 類型（不是透過檔案內容嗅探）。

| 格式 | MIME 類型 | 副檔名 |
|--- | --- | ---|
| MP3 | `audio/mp3` | `.mp3` |
| WAV | `audio/wav` | `.wav` |
| AAC (M4A) | `audio/aac` | `.m4a` |
| OGG | `audio/ogg` | `.ogg` |
| FLAC | `audio/flac` | `.flac` |
| AIFF | `audio/aiff` | `.aiff`, `.aif` |

::: warning 不支援的格式
如果副檔名不在表裡，會返回 `400`，響應體是一段文字，例如：`不支援的音訊格式: txt`。
:::

## 檢查點 ✅

- [ ] 返回體是 `{"text":"..."}`（沒有 `segments`、`verbose_json` 等額外結構）
- [ ] 響應標頭包含 `X-Account-Email`（標記實際使用的帳號）
- [ ] 在 "Monitor" 頁面能看到這條請求記錄

## 處理大包體：為什麼你看到的是 100MB，但還是卡在 15MB

服務端在 Axum 層面把請求 body 上限放到了 100MB（防止一些大請求直接被框架拒絕），但音訊轉錄處理器會額外做一次 **15MB 校驗**。

也就是說：

- `15MB < 檔案 <= 100MB`：請求能進到處理器，但會返回 `413` + 文字錯誤資訊
- `檔案 > 100MB`：請求可能會在框架層直接失敗（不保證具體錯誤形態）

### 超過 15MB 時你會看到什麼

返回狀態碼 `413 Payload Too Large`，響應體是一段文字（不是 JSON），內容類似：

```
音訊檔案過大 (18.5 MB)。最大支援 15 MB (約 16 分鐘 MP3)。建議: 1) 壓縮音訊品質 2) 分段上傳
```

### 兩個可執行的拆分辦法

1) 壓縮音訊品質（把 WAV 轉成更小的 MP3）

```bash
ffmpeg -i input.wav -b:a 64k -ac 1 output.mp3
```

2) 分段（把長音訊切成多段）

```bash
ffmpeg -i long_audio.mp3 -f segment -segment_time 600 -c copy segment_%03d.mp3
```

## 日誌採集注意事項

### 為什麼 Monitor 裡經常看不到真實請求體

Monitor 中介軟體會把 **POST 請求體**先讀出來做日誌記錄：

- 如果請求體能被當作 UTF-8 文字解析，就記錄原始文字
- 否則記錄為 `[Binary Request Data]`

音訊轉錄走 `multipart/form-data`，裡面有二進制音訊內容，所以很容易落到第二種情況。

### 你在 Monitor 裡應該看到什麼

```
URL: /v1/audio/transcriptions
Request Body: [Binary Request Data]
Response Body: {"text":"..."}
```

::: info 日誌限制說明
日誌裡看不到音訊本體，但你仍然能用 `status/duration/X-Account-Email` 快速判斷：是協議不相容、檔案太大、還是上游失敗。
:::

## 參數說明（不做「經驗性補全」）

這個端點只顯式讀取 3 個表單欄位：

| 欄位 | 是否必需 | 預設值 | 處理方式 |
|--- | --- | --- | ---|
| `file` | ✅ | 無 | 必須提供；缺失會返回 `400` + 文字 `缺少音訊檔案` |
| `model` | ❌ | `gemini-2.0-flash-exp` | 作為字串透傳，並參與 token 獲取（具體上游規則以實際響應為準） |
| `prompt` | ❌ | `Generate a transcript of the speech.` | 作為第一段 `text` 發送給上游，用來引導轉錄 |

## 踩坑提醒

### ❌ 錯誤 1：用錯了 curl 參數，導致不是 multipart

```bash
#錯誤：直接用 -d
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -d "file=@audio.mp3"
```

正確做法：

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3"
```

### ❌ 錯誤 2：檔案副檔名不在支援列表裡

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@document.txt"
```

正確做法：只上傳音訊檔案（`.mp3`、`.wav` 等）。

### ❌ 錯誤 3：把 413 當成「閘道壞了」

`413` 在這裡通常就是 15MB 校驗觸發了。先做壓縮/分段，比盲目重試更快。

## 本課小結

- **核心端點**：`POST /v1/audio/transcriptions`（Whisper 相容形狀）
- **格式支援**：mp3、wav、m4a、ogg、flac、aiff（aif）
- **大小限制**：15MB（超過返回 `413` + 文字錯誤資訊）
- **日誌行為**：multipart 裡有二進制內容時，Monitor 會顯示 `[Binary Request Data]`
- **關鍵參數**：`file` / `model` / `prompt`（預設值見上表）

## 下一課預告

> 下一課我們學習 **[MCP 端點：把 Web Search/Reader/Vision 作為可呼叫工具暴露出去](/zh-tw/lbjlaq/Antigravity-Manager/platforms/mcp/)**。
>
> 你會學到：
> - MCP 端點的路由形態與鑑權策略
> - Web Search/Web Reader/Vision 走的是「上游轉發」還是「內建工具」
> - 哪些能力是實驗性的，別在生產裡踩雷

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 路由註冊（/v1/audio/transcriptions + body limit） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 音訊轉錄處理器（multipart/15MB/inlineData） | [`src-tauri/src/proxy/handlers/audio.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/audio.rs#L16-L162) | 16-162 |
|--- | --- | ---|
| Monitor 中介軟體（Binary Request Data） | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |

**關鍵常量**：
- `MAX_SIZE = 15 * 1024 * 1024`：音訊檔案大小限制（15MB）
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`：Monitor 讀取 POST 請求體的上限（100MB）
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`：Monitor 讀取響應體的上限（100MB）

**關鍵函數**：
- `handle_audio_transcription()`：解析 multipart、校驗副檔名與大小、拼 `inlineData` 並呼叫上游
- `AudioProcessor::detect_mime_type()`：副檔名 -> MIME
- `AudioProcessor::exceeds_size_limit()`：15MB 校驗
- `monitor_middleware()`：將請求/響應體落到 Proxy Monitor（UTF-8 才會完整記錄）

</details>
