---
title: "z.ai 整合：能力邊界詳解 | Antigravity-Manager"
sidebarTitle: "z.ai 邊界速查"
subtitle: "z.ai 整合：能力邊界詳解"
description: "掌握 Antigravity Tools 的 z.ai 整合邊界。了解請求路由、dispatch_mode 分流、模型映射、Header 安全策略，以及 MCP 反代與限制，避免誤判。"
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "能力邊界"
prerequisite:
  - "start-getting-started"
  - "platforms-mcp"
order: 3
---
# z.ai 整合的能力邊界（已實作 vs 明確未實作）

這篇文件只講 Antigravity Tools 的 z.ai「邊界」，不講「怎麼接」。如果你發現某個能力沒生效，先來這裡對照一下：它到底是沒開、沒設，還是根本就沒實作。

## 學完你能做什麼

- 判斷一件事該不該指望 z.ai：哪些是「已實作」，哪些是「文件明確沒做」
- 搞清 z.ai 只影響哪些端點（以及哪些端點完全不受影響）
- 看到每個結論的原始碼/文件證據（帶 GitHub 行號連結），方便你自己複核

## 你現在的困境

你可能在 Antigravity Tools 裡已經開啟了 z.ai，但一用就遇到這些疑惑：

- 為什麼有些請求會走 z.ai，有些完全不走？
- MCP 端點能不能當成「完整 MCP Server」？
- UI 裡看得到的開關，到底有沒有對應到真實實作？

## 什麼是 z.ai 整合（在本專案裡）？

**z.ai 整合**在 Antigravity Tools 裡是一個可選的「上游 provider + MCP 擴充」。它只在特定條件下接管 Claude 協議請求，並提供 MCP Search/Reader 反代與一個最小化的 Vision MCP 內建伺服器；它不是全協議、全能力的替換方案。

::: info 一句話記憶
你可以把 z.ai 當成「Claude 請求的可選上游 + 一組可開關的 MCP 端點」，別把它當成「把 z.ai 的所有能力完整搬進來」。
:::

## 已實作：穩定可用（以原始碼為準）

### 1) 僅 Claude 協議會走 z.ai（/v1/messages + /v1/messages/count_tokens）

z.ai 的 Anthropic 上游轉發只在 Claude handler 的 z.ai 分支發生：

- `POST /v1/messages`：當 `use_zai=true` 時呼叫 `forward_anthropic_json(...)` 把 JSON 請求轉發到 z.ai Anthropic 相容端點
- `POST /v1/messages/count_tokens`：當 z.ai 啟用時同樣轉發；否則傳回佔位的 `{input_tokens:0, output_tokens:0}`

證據：

- z.ai 分支選擇與轉發入口：[`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- count_tokens 的 z.ai 分支與佔位回傳：[`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- z.ai Anthropic 轉發實作：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip 「回應串流」怎麼理解？
`forward_anthropic_json` 會把上游回應體以 `bytes_stream()` 串流回傳給客戶端，不解析 SSE（見 `providers/zai_anthropic.rs` 的 Response body 建構）。
:::

### 2) 排程模式（dispatch_mode）的「真實含義」

`dispatch_mode` 決定 `/v1/messages` 是否走 z.ai：

| dispatch_mode | 會發生什麼 | 證據 |
| --- | --- | --- |
| `off` | 永不使用 z.ai | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | 所有 Claude 請求都走 z.ai | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Google 池不可用（0 帳號或「沒有可用帳號」）才走 z.ai | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | 把 z.ai 當作「額外 1 個槽位」參與輪詢（不保證一定命中） | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning pooled 的常見誤解
`pooled` 不是「z.ai + Google 帳號池都用，而且按權重穩定分流」。程式碼裡明確寫了「no strict guarantees」，本質是一個輪詢槽位（`slot == 0` 才走 z.ai）。
:::
### 3) 模型映射：Claude 模型名稱怎麼變成 z.ai 的 glm-*？

在轉發到 z.ai 之前，如果請求體裡有 `model` 欄位，會被重寫：

1. `proxy.zai.model_mapping` 精確匹配（同時支援原串和 lower-case key）
2. `zai:<model>` 前綴：去掉 `zai:` 直接用
3. `glm-*`：保持不變
4. 非 `claude-*`：保持不變
5. `claude-*` 且包含 `opus/haiku`：映射到 `proxy.zai.models.opus/haiku`；否則預設 `sonnet`

證據：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37)、[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) 轉發時的 Header 安全策略（避免洩露本地 proxy key）

z.ai 上游轉發不會「原樣帶所有 Header」，而是做了兩層防線：

- 只放行一小部分 Header（例如 `content-type`、`accept`、`anthropic-version`、`user-agent`）
- 把 z.ai 的 API Key 注入到上游（優先保持客戶端用的鑑權方式：`x-api-key` 或 `Authorization: Bearer ...`）

證據：

- Header 白名單：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- 注入 z.ai auth：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## 已實作：MCP（Search/Reader 反代 + Vision 內建）

### 1) MCP Search/Reader：反向代理到 z.ai 的 MCP 端點

本地端點與上游位址是寫死的：

| 本地端點 | 上游位址 | 開關 | 證據 |
| --- | --- | --- | --- |
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404 不是「網路問題」
只要 `proxy.zai.mcp.enabled=false`，或者對應 `web_search_enabled/web_reader_enabled=false`，這些端點就會直接傳回 404。
:::

證據：

- MCP 總開關與 z.ai key 校驗：[`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- 路由註冊：[`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)
### 2) Vision MCP：一個「最小化 Streamable HTTP MCP」內建伺服器

Vision MCP 不是反代，它是本地內建實作：

- 端點：`/mcp/zai-mcp-server/mcp`
- `POST` 支援：`initialize`、`tools/list`、`tools/call`
- `GET` 傳回 SSE keepalive（要求已初始化的 session）
- `DELETE` 結束 session

證據：

- handler 主入口與方法分發：[`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- `initialize`、`tools/list`、`tools/call` 的實作：[`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Vision MCP 的「最小實作」定位：[`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Vision MCP 工具集（8 個）與檔案大小限制

工具列表來自 `tool_specs()`：

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

證據：[`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270)、[`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

本地檔案會被讀出來並編碼成 `data:<mime>;base64,...`，同時有硬限制：

- 圖片上限 5 MB（`image_source_to_content(..., 5)`）
- 影片上限 8 MB（`video_source_to_content(..., 8)`）

證據：[`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## 明確未實作 / 不要期待（以文件宣告與實作細節為準）

### 1) z.ai 用量/預算監控（usage/budget）未實作

`docs/zai/implementation.md` 明確寫了「not implemented yet」。這意味著：

- 你不能指望 Antigravity Tools 提供 z.ai 的 usage/budget 查詢或告警
- 配額治理（Quota Protection）也不會自動讀 z.ai 的預算/用量資料

證據：[`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP 不是完整 MCP Server

Vision MCP 目前定位就是「只夠工具呼叫」的最小實作：prompts/resources、resumability、streamed tool output 等都還沒做。

證據：[`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36)、[`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude` 不會反映 z.ai 的真實模型列表

這個端點傳回的模型列表來自本地內建映射與自訂映射（`get_all_dynamic_models`），不會去請求 z.ai 上游的 `/v1/models`。

證據：

- handler：[`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- 列表生成邏輯：[`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## 設定欄位速查（z.ai 相關）

z.ai 設定在 `ProxyConfig.zai` 下，包含這些欄位：

- `enabled` / `base_url` / `api_key`
- `dispatch_mode`（`off/exclusive/pooled/fallback`）
- `model_mapping`（精確匹配覆寫）
- `models.{opus,sonnet,haiku}`（Claude 家族預設映射）
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

預設值（base_url / 預設模型）也在同一個檔案裡：

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

證據：[`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116)、[`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)
---

## 本課小結

- z.ai 目前只會接管 Claude 協議（`/v1/messages` + `count_tokens`），其他協議端點不是「自動走 z.ai」
- MCP Search/Reader 是反代；Vision MCP 是本地最小實作，不是完整 MCP Server
- `/v1/models/claude` 的模型列表來自本地映射，不代表 z.ai 上游真實模型

---

## 下一課預告

> 下一課我們學習 **[版本演進](../../changelog/release-notes/)**。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| z.ai 整合範圍（Claude 協議 + MCP + Vision MCP） | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| z.ai 排程模式與模型預設值 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| z.ai 預設 base_url / 預設模型 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| `/v1/messages` 是否走 z.ai 的選擇邏輯 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| `/v1/messages/count_tokens` 的 z.ai 轉發與佔位回傳 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| z.ai Anthropic 上游轉發（JSON 轉發 + 回應串流回傳） | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| z.ai 模型映射規則（map_model_for_zai） | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Header 白名單 + 注入 z.ai auth | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| MCP Search/Reader 反代與開關 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
| Vision MCP 內建伺服器（GET/POST/DELETE + JSON-RPC） | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L190-L397) | 190-397 |
| Vision MCP 最小實作定位（非完整 MCP Server） | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Vision 工具列表與限制（tool_specs + 檔案大小 + stream=false） | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| `/v1/models/claude` 模型列表來源（本地映射，不查上游） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| 用量/預算監控未實作（文件宣告） | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
