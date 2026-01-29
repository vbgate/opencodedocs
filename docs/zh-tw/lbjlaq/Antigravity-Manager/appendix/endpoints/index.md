---
title: "端點速查: HTTP 路由一覽 | Antigravity-Manager"
sidebarTitle: "秒查所有路由"
subtitle: "端點速查表：對外 HTTP 路由一覽"
description: "學習 Antigravity 網關的 HTTP 端點分布。透過表格對照 OpenAI/Anthropic/Gemini/MCP 路由，掌握鑑權模式和 API Key Header 的使用方法。"
tags:
  - "端點速查"
  - "API 參考"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 1
---
# 端點速查表：對外 HTTP 路由一覽

## 學完你能做什麼

- 快速定位需要調用的端點路徑
- 理解不同協議的端點分布
- 了解鑑權模式和健康檢查的特殊規則

## 端點總覽

Antigravity Tools 的本地反代服務提供以下幾類端點：

| 協議分類 | 用途 | 典型客戶端 |
|--- | --- | ---|
| **OpenAI 協議** | 通用 AI 應用相容 | OpenAI SDK / 相容客戶端 |
| **Anthropic 協議** | Claude 系列調用 | Claude Code / Anthropic SDK |
| **Gemini 協議** | Google 官方 SDK | Google Gemini SDK |
| **MCP 端點** | 工具調用增強 | MCP 客戶端 |
| **內部/輔助** | 健康檢查、攔截/內部能力 | 自動化腳本 / 監控探活 |

---

## OpenAI 協議端點

這些端點相容 OpenAI API 格式，適合大多數支持 OpenAI SDK 的客戶端。

| 方法 | 路徑 | 路由入口（Rust handler） | 備註 |
|--- | --- | --- | ---|
| GET | `/v1/models` | `handlers::openai::handle_list_models` | OpenAI 相容：模型列表 |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | OpenAI 相容：Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | OpenAI 相容：Legacy Completions |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | OpenAI 相容：Codex CLI 請求（與 `/v1/completions` 同 handler） |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | OpenAI 相容：Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | OpenAI 相容：Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | OpenAI 相容：Audio Transcriptions |

::: tip 相容性提示
`/v1/responses` 端點專為 Codex CLI 設計，實際與 `/v1/completions` 使用相同的處理邏輯。
:::

---

## Anthropic 協議端點

這些端點按 Anthropic API 的路徑與請求格式組織，供 Claude Code / Anthropic SDK 調用。

| 方法 | 路徑 | 路由入口（Rust handler） | 備註 |
|--- | --- | --- | ---|
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Anthropic 相容：Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Anthropic 相容：count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Anthropic 相容：模型列表 |

---

## Gemini 協議端點

這些端點相容 Google Gemini API 格式，可直接使用 Google 官方 SDK。

| 方法 | 路徑 | 路由入口（Rust handler） | 備註 |
|--- | --- | --- | ---|
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Gemini 原生：模型列表 |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Gemini 原生：GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Gemini 原生：generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Gemini 原生：countTokens |

::: warning 路徑說明
`/v1beta/models/:model` 在同一路徑下同時註冊了 GET 和 POST（見路由定義）。
:::

---

## MCP 端點

MCP（Model Context Protocol）端點用於對外暴露「工具調用」介面（由 `handlers::mcp::*` 處理）。是否啟用與具體行為以設定為準；細節見 [MCP 端點](../../platforms/mcp/)。

| 方法 | 路徑 | 路由入口（Rust handler） | 備註 |
|--- | --- | --- | ---|
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP：Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP：Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP：z.ai MCP Server |

::: details MCP 相關說明
MCP 的可用範圍與邊界說明，參見 [z.ai 整合的能力邊界（已實作 vs 明確未實作）](../zai-boundaries/)。
:::

---

## 內部與輔助端點

這些端點用於系統內部功能和外部監控。

| 方法 | 路徑 | 路由入口（Rust handler） | 備註 |
|--- | --- | --- | ---|
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | 內部預熱端點 |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | 遙測日誌攔截：直接返回 200 |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | 遙測日誌攔截：直接返回 200 |
| GET | `/healthz` | `health_check_handler` | 健康檢查：返回 `{"status":"ok"}` |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | 模型自動偵測 |

::: tip 靜默處理
事件日誌端點會直接返回 `200 OK`，不進行實際處理，用於攔截客戶端的遙測上報。
:::

::: warning 這些端點是否需要 API Key？
除了 `GET /healthz` 可能被豁免，其他路由是否需要攜帶 key，都由 `proxy.auth_mode` 的「有效模式」決定（詳見下方「鑑權模式」與原始碼中的 `auth_middleware`）。
:::

---

## 鑑權模式

所有端點的訪問權限由 `proxy.auth_mode` 控制：

| 模式 | 說明 | `/healthz` 要求鑑權？ | 其他端點要求鑑權？ |
|--- | --- | --- | ---|
| `off` | 完全開放 | ❌ 否 | ❌ 否 |
| `strict` | 全部需要鑑權 | ✅ 是 | ✅ 是 |
| `all_except_health` | 僅健康檢查開放 | ❌ 否 | ✅ 是 |
| `auto` | 自動判斷（預設） | ❌ 否 | 視 `allow_lan_access` 而定 |

::: info auto 模式邏輯
`auto` 不是獨立策略，而是從設定推導：當 `proxy.allow_lan_access=true` 時等同 `all_except_health`，否則等同 `off`（見 `docs/proxy/auth.md`）。
:::

**鑑權請求格式**：

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
 curl -H "Authorization: Bearer YOUR_API_KEY" \
   "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key（OpenAI 風格）
 curl -H "x-api-key: YOUR_API_KEY" \
   "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key（Gemini 風格）
 curl -H "x-goog-api-key: YOUR_API_KEY" \
   "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
 curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
   "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key（OpenAI 風格）
 curl.exe -H "x-api-key: YOUR_API_KEY" `
   "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key（Gemini 風格）
 curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
   "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## 本節小結

Antigravity Tools 提供了一套完整的多協議相容端點，支持 OpenAI、Anthropic、Gemini 三大主流 API 格式，以及 MCP 工具調用擴展。

- **快速接入**：優先使用 OpenAI 協議端點，相容性最強
- **原生功能**：需要 Claude Code 完整功能時使用 Anthropic 協議端點
- **Google 生態**：使用 Google 官方 SDK 時選擇 Gemini 協議端點
- **安全設定**：根據使用場景（本地/LAN/公網）選擇合適的鑑權模式

---

## 下一課預告

> 下一課我們學習 **[資料與模型](../storage-models/)**。
>
> 你會學到：
> - 帳號檔案的儲存結構
> - SQLite 統計庫的表結構
> - 關鍵欄位口徑與備份策略

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 路由註冊（全部端點） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 鑑權中介層（Header 相容 + `/healthz` 豁免 + OPTIONS 放行） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| auth_mode 模式與 auto 衍生規則 | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| `/healthz` 返回值 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| 遙測日誌攔截（silent 200） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**關鍵函數**：
- `AxumServer::start()`：啟動 Axum 伺服器並註冊路由（第 79-254 行）
- `health_check_handler()`：健康檢查處理（第 266-272 行）
- `silent_ok_handler()`：靜默成功處理（第 274-277 行）

</details>
