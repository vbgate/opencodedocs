---
title: "MCP 端點：暴露工具 | Antigravity-Manager"
sidebarTitle: "讓 Claude 用上 z.ai 能力"
subtitle: "MCP 端點：把 Web Search/Reader/Vision 作為可調用工具暴露出去"
description: "學習 Antigravity Manager 的 MCP 端點配置。啟用 Web Search/Reader/Vision，驗證工具調用，對接外部客戶端，掌握常見錯誤排查方法。"
tags:
  - "MCP"
  - "Web Search"
  - "Web Reader"
  - "Vision"
  - "z.ai"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 6
---
# MCP 端點：把 Web Search/Reader/Vision 作為可調用工具暴露出去

你會用這套 **MCP 端點**把 z.ai 的搜尋、閱讀、視覺能力暴露給外部 MCP 客戶端，重點搞清楚「遠端反向代理」和「內建伺服器」的區別，以及如何啟用並調用這些端點。

## 學完你能做什麼

- 理解三種 MCP 端點的工作原理（遠端反向代理 vs 內建伺服器）
- 在 Antigravity Tools 中啟用 Web Search/Web Reader/Vision MCP 端點
- 讓外部 MCP 客戶端（如 Claude Desktop、Cursor）透過本機閘道調用這些能力
- 掌握會話管理（Vision MCP）和鑑權模型

## 你現在的困境

很多 AI 工具開始支援 MCP（Model Context Protocol），但需要配置上游 API Key 和 URL。z.ai 的 MCP 伺服器也提供了強大的能力（搜尋、閱讀、視覺分析），但直接配置意味著要在每個客戶端暴露 z.ai Key。

Antigravity Tools 的方案是：在本機閘道層面統一管理 z.ai Key，把 MCP 端點暴露出來，客戶端只需連本機閘道，無需知道 z.ai Key。

## 什麼時候用這一招

- 你有多個 MCP 客戶端（Claude Desktop、Cursor、自研工具），想統一用一套 z.ai Key
- 你希望把 z.ai 的 Web Search/Web Reader/Vision 能力作為工具暴露給 AI 使用
- 你不想在多個地方重複配置和輪換 z.ai Key

## 🎒 開始前的準備

::: warning 前置條件
- 你已經在 Antigravity Tools 的 "API Proxy" 頁面啟動了反代服務
- 你已經獲取了 z.ai API Key（從 z.ai 控制台）
- 你知道反代的端口（預設 `8045`）
:::

::: info 什麼是 MCP？
MCP（Model Context Protocol）是一個開放協議，讓 AI 客戶端可以調用外部工具/資料源。

典型的 MCP 交互流程：
1. 客戶端（如 Claude Desktop）向 MCP Server 發送 `tools/list` 請求，獲取可用工具列表
2. 客戶端根據上下文選擇工具，發送 `tools/call` 請求
3. MCP Server 執行工具並返回結果（文字、圖像、資料等）

Antigravity Tools 提供了三種 MCP 端點：
- **遠端反向代理**：直接轉發到 z.ai MCP 伺服器（Web Search/Web Reader）
- **內建伺服器**：本地實作 JSON-RPC 2.0 協議，處理工具調用（Vision）
:::

## 什麼是 MCP 端點？

**MCP 端點**是 Antigravity Tools 暴露的一組 HTTP 路由，讓外部 MCP 客戶端可以調用 z.ai 的能力，同時由 Antigravity Tools 統一管理鑑權和配置。

### 端點分類

| 端點類型 | 實作方式 | 本地路徑 | 上游目標 |
|--- | --- | --- | ---|
| **Web Search** | 遠端反向代理 | `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` |
| **Web Reader** | 遠端反向代理 | `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` |
| **Vision MCP** | 內建伺服器（JSON-RPC 2.0） | `/mcp/zai-mcp-server/mcp` | 內部調用 z.ai PaaS API |

### 關鍵區別

::: info 遠端反向代理 vs 內建伺服器
**遠端反向代理**（Web Search/Web Reader）：
- 代理會保留部分請求標頭（`content-type`、`accept`、`user-agent`）並注入 `Authorization` 標頭
- 代理會轉發上游的響應體和狀態碼，但只保留 `CONTENT_TYPE` 響應標頭
- 無狀態，無需會話管理

**內建伺服器**（Vision MCP）：
- 完整實作 JSON-RPC 2.0 協議（`initialize`、`tools/list`、`tools/call`）
- 有狀態：建立會話（`mcp-session-id`），GET 端點返回 SSE keepalive
- 工具邏輯在本地實作，調用 z.ai PaaS API 執行視覺分析
:::

## 核心思路

Antigravity Tools 的 MCP 端點遵循以下設計原則：

1. **統一鑑權**：由 Antigravity 管理 z.ai Key，客戶端無需配置
2. **可開關**：三個端點可以獨立啟用/停用
3. **會話隔離**：Vision MCP 使用 `mcp-session-id` 隔離不同客戶端
4. **錯誤透明**：上游的響應體和狀態碼會原樣轉發（響應標頭會過濾）

### 鑑權模型

```
MCP 客戶端 → Antigravity 本機代理 → z.ai 上游
               ↓
           [可選] proxy.auth_mode
               ↓
           [自動] 注入 z.ai Key
```

Antigravity Tools 的代理中介層（`src-tauri/src/proxy/middleware/auth.rs`）會檢查 `proxy.auth_mode`，如果開啟鑑權，需要客戶端帶 API Key。

**重要**：無論 `proxy.auth_mode` 如何，z.ai Key 都是代理自動注入的，客戶端不需要配置。

## 跟我做

### 第 1 步：配置 z.ai 並啟用 MCP 功能

**為什麼**
先確保 z.ai 基礎配置正確，再逐個啟用 MCP 端點。

1. 打開 Antigravity Tools，進入 **API Proxy** 頁面
2. 找到 **z.ai 配置** 卡片，點擊展開
3. 配置以下欄位：

```yaml
 # z.ai 配置
base_url: "https://api.z.ai/api/anthropic"  # z.ai Anthropic 相容端點
api_key: "你的-z.ai-api-key"               # 從 z.ai 控制台獲取
enabled: true                              # 啟用 z.ai
```

4. 找到 **MCP 配置** 子卡片，配置：

```yaml
 # MCP 配置
enabled: true                              # 啟用 MCP 總開關
web_search_enabled: true                    # 啟用 Web Search
web_reader_enabled: true                    # 啟用 Web Reader
vision_enabled: true                        # 啟用 Vision MCP
```

**你應該看到**：配置儲存後，頁面下方會出現「本地 MCP 端點」列表，顯示三個端點的完整 URL。

### 第 2 步：驗證 Web Search 端點

**為什麼**
Web Search 是遠端反向代理，最簡單，適合先驗證基礎配置。

```bash
 # 1) 先列出 Web Search 端點提供的工具（工具名以實際返回為準）
curl -X POST http://127.0.0.1:8045/mcp/web_search_prime/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**你應該看到**：返回一個包含 `tools` 列表的 JSON 響應。

::: tip 繼續驗證 tools/call（可選）
拿到 `tools[].name` 和 `tools[].inputSchema` 後，你就能按 schema 拼 `tools/call` 請求（參數以 schema 為準，別猜欄位）。
:::

::: tip 端點未找到？
如果收到 `404 Not Found`，檢查：
1. `proxy.zai.mcp.enabled` 是否為 `true`
2. `proxy.zai.mcp.web_search_enabled` 是否為 `true`
3. 反代服務是否正在執行
:::

### 第 3 步：驗證 Web Reader 端點

**為什麼**
Web Reader 也是遠端反向代理，但參數和返回格式不同，驗證代理能正確處理不同端點。

```bash
 # 2) 列出 Web Reader 端點提供的工具
curl -X POST http://127.0.0.1:8045/mcp/web_reader/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**你應該看到**：返回一個包含 `tools` 列表的 JSON 響應。

### 第 4 步：驗證 Vision MCP 端點（會話管理）

**為什麼**
Vision MCP 是內建伺服器，有會話狀態，需要先 `initialize`，再調用工具。

#### 4.1 初始化會話

```bash
 # 1) 發送 initialize 請求
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05"
    },
    "id": 1
  }'
```

**你應該看到**：響應中包含 `mcp-session-id` 標頭，儲存這個 ID。

```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "serverInfo": {
      "name": "zai-mcp-server",
      "version": "<app-version>"
    }
  },
  "id": 1
}
```

::: info 提醒
`serverInfo.version` 來自 Rust 的 `env!("CARGO_PKG_VERSION")`，以你本機實際安裝版本為準。
:::

響應標頭：
```
mcp-session-id: uuid-v4-string
```

#### 4.2 獲取工具列表

```bash
 # 2) 發送 tools/list 請求（帶上會話 ID）
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: 你的會話ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**你應該看到**：返回 8 個工具的定義（`ui_to_artifact`、`extract_text_from_screenshot`、`diagnose_error_screenshot` 等）。

#### 4.3 調用工具

```bash
 # 3) 調用 analyze_image 工具
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: 你的會話ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "analyze_image",
      "arguments": {
        "image_source": "https://example.com/image.jpg",
        "prompt": "描述這張圖片的內容"
      }
    },
    "id": 3
  }'
```

**你應該看到**：返回圖片分析結果的文字描述。

::: danger 會話 ID 重要
Vision MCP 的所有請求（除了 `initialize`）都必須帶 `mcp-session-id` 標頭。

會話 ID 在 `initialize` 響應中返回，後續請求必須使用同一個 ID。會話遺失後需要重新 `initialize`。
:::
### 第 5 步：測試 SSE keepalive（可選）

**為什麼**
Vision MCP 的 GET 端點返回 SSE（Server-Sent Events）流，用於保持連線活躍。

```bash
 # 4) 調用 GET 端點（獲取 SSE 流）
curl -N http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "mcp-session-id: 你的會話ID"
```

**你應該看到**：每 15 秒收到一個 `event: ping` 訊息，格式如下：

```
event: ping
data: keepalive

event: ping
data: keepalive
...
```

## 檢查點 ✅

### 配置檢查

- [ ] `proxy.zai.enabled` 為 `true`
- [ ] `proxy.zai.api_key` 已配置（非空）
- [ ] `proxy.zai.mcp.enabled` 為 `true`
- [ ] 至少啟用了一個 MCP 端點（`web_search_enabled` / `web_reader_enabled` / `vision_enabled`）
- [ ] 反代服務正在執行

### 功能驗證

- [ ] Web Search 端點返回搜尋結果
- [ ] Web Reader 端點返回網頁內容
- [ ] Vision MCP 端點成功 `initialize` 並獲取 `mcp-session-id`
- [ ] Vision MCP 端點返回工具列表（8 個工具）
- [ ] Vision MCP 端點成功調用工具並返回結果

## Vision MCP 工具速查

| 工具名 | 功能 | 必需參數 | 範例場景 |
|--- | --- | --- | ---|
| `ui_to_artifact` | 把 UI 截圖轉為代碼/提示詞/規格/描述 | `image_source`、`output_type`、`prompt` | 從設計稿生成前端代碼 |
| `extract_text_from_screenshot` | 從截圖提取文字/代碼（類似 OCR） | `image_source`、`prompt` | 讀取錯誤日誌截圖 |
| `diagnose_error_screenshot` | 診斷錯誤截圖（堆疊追蹤、日誌） | `image_source`、`prompt` | 分析執行時錯誤 |
| `understand_technical_diagram` | 分析架構/流程/UML/ER 圖 | `image_source`、`prompt` | 理解系統架構圖 |
| `analyze_data_visualization` | 分析圖表/儀表板 | `image_source`、`prompt` | 從儀表板提取趨勢 |
| `ui_diff_check` | 比較兩個 UI 截圖並報告差異 | `expected_image_source`、`actual_image_source`、`prompt` | 視覺迴歸測試 |
| `analyze_image` | 通用圖像分析 | `image_source`、`prompt` | 描述圖片內容 |
| `analyze_video` | 影片內容分析 | `video_source`、`prompt` | 分析影片場景 |

::: info 參數說明
- `image_source`：本地檔案路徑（如 `/tmp/screenshot.png`）或遠端 URL（如 `https://example.com/image.jpg`）
- `video_source`：本地檔案路徑或遠端 URL（支援 MP4、MOV、M4V）
- `output_type`（`ui_to_artifact`）：`code` / `prompt` / `spec` / `description`
:::

## 踩坑提醒

### 404 Not Found

**現象**：調用 MCP 端點返回 `404 Not Found`。

**原因**：
1. 端點未啟用（對應的 `*_enabled` 為 `false`）
2. 反代服務未啟動
3. URL 路徑錯誤（注意 `/mcp/` 前綴）

**解決**：
1. 檢查 `proxy.zai.mcp.enabled` 和對應的 `*_enabled` 配置
2. 檢查反代服務狀態
3. 確認 URL 路徑格式（如 `/mcp/web_search_prime/mcp`）

### 400 Bad Request: Missing Mcp-Session-Id

**現象**：調用 Vision MCP（除 `initialize` 外）返回 `400 Bad Request`。

- GET 端點：返回純文字 `Missing Mcp-Session-Id`
- POST 端點：返回 JSON-RPC 錯誤 `{"error":{"code":-32000,"message":"Bad Request: missing Mcp-Session-Id"}}`

**原因**：請求標頭缺少 `mcp-session-id` 或 ID 無效。

**解決**：
1. 確保 `initialize` 請求成功，並從響應標頭獲取 `mcp-session-id`
2. 後續請求（`tools/list`、`tools/call`，以及 SSE keepalive）都必須帶該標頭
3. 如果會話遺失（如服務重啟），需要重新 `initialize`

### z.ai is not configured

**現象**：返回 `400 Bad Request`，提示 `z.ai is not configured`。

**原因**：`proxy.zai.enabled` 為 `false` 或 `api_key` 為空。

**解決**：
1. 確保 `proxy.zai.enabled` 為 `true`
2. 確保 `proxy.zai.api_key` 已配置（非空）

### 上游請求失敗

**現象**：返回 `502 Bad Gateway` 或內部錯誤。

**原因**：
1. z.ai API Key 無效或過期
2. 網路連線問題（需要上游代理）
3. z.ai 伺服器錯誤

**解決**：
1. 驗證 z.ai API Key 是否正確
2. 檢查 `proxy.upstream_proxy` 配置（如果需要代理訪問 z.ai）
3. 查看日誌獲取詳細錯誤資訊

## 與外部 MCP 客戶端集成

### Claude Desktop 配置範例

Claude Desktop 的 MCP 客戶端配置檔案（`~/.config/claude/claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "antigravity-vision": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/zai-mcp-server/mcp"
      ]
    },
    "antigravity-web-search": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/web_search_prime/mcp"
      ]
    }
  }
}
```

::: tip Claude Desktop 的限制
Claude Desktop 的 MCP 客戶端需要透過 `stdio` 通訊，如果你直接用 HTTP 端點，需要編寫一個 wrapper 腳本把 `stdio` 轉為 HTTP 請求。

或者使用支援 HTTP MCP 的客戶端（如 Cursor）。
:::

### HTTP MCP 客戶端（如 Cursor）

如果客戶端支援 HTTP MCP，直接配置端點 URL 即可：

```yaml
 # Cursor MCP 配置
mcpServers:
  - name: antigravity-vision
    url: http://127.0.0.1:8045/mcp/zai-mcp-server/mcp
  - name: antigravity-web-search
    url: http://127.0.0.1:8045/mcp/web_search_prime/mcp
```

## 本課小結

Antigravity Tools 的 MCP 端點把 z.ai 的能力暴露為可調用工具，分為兩類：
- **遠端反向代理**（Web Search/Web Reader）：簡單轉發，無狀態
- **內建伺服器**（Vision MCP）：完整實作 JSON-RPC 2.0，有會話管理

關鍵點：
1. 統一鑑權：z.ai Key 由 Antigravity 管理，客戶端無需配置
2. 可開關：三個端點可獨立啟用/停用
3. 會話隔離：Vision MCP 使用 `mcp-session-id` 隔離客戶端
4. 靈活集成：支援任何相容 MCP 協議的客戶端

## 下一課預告

> 下一課我們學習 **[Cloudflared 一鍵隧道](/zh-tw/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**。
>
> 你會學到：
> - 如何一鍵安裝和啟動 Cloudflared 隧道
> - quick 模式 vs auth 模式的區別
> - 如何安全地把本地 API 暴露到公網

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| Web Search 端點 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L115-L135) | 115-135 |
| Web Reader 端點 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L137-L157) | 137-157 |
| Vision MCP 端點（主入口） | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397) | 376-397 |
| Vision MCP initialize 處理 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L271-L293) | 271-293 |
| Vision MCP tools/list 處理 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L311-L314) | 311-314 |
| Vision MCP tools/call 處理 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L315-L363) | 315-363 |
| Vision MCP 會話狀態管理 | [`src-tauri/src/proxy/zai_vision_mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_mcp.rs#L1-L42) | 1-42 |
| Vision MCP 工具定義 | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L271) | 166-271 |
| Vision MCP 工具調用實作 | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L273-L400) | 273-400 |
| 路由註冊 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169) | 157-169 |
| 鑑權中介層 | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L1-L78) | 1-78 |
| MCP 配置 UI | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1304-L1357) | 1304-1357 |
| 倉庫內說明文件 | [`docs/zai/mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/mcp.md#L1-L57) | 1-57 |

**關鍵常量**：
- `ZAI_PAAZ_CHAT_COMPLETIONS_URL = "https://api.z.ai/api/paas/v4/chat/completions"`：z.ai PaaS API 端點（用於 Vision 工具調用）

**關鍵函數**：
- `handle_web_search_prime()`：處理 Web Search 端點的遠端反向代理
- `handle_web_reader()`：處理 Web Reader 端點的遠端反向代理
- `handle_zai_mcp_server()`：處理 Vision MCP 端點的所有方法（GET/POST/DELETE）
- `mcp_session_id()`：從請求標頭提取 `mcp-session-id`
- `forward_mcp()`：通用 MCP 轉發函數（注入鑑權並轉發到上游）
- `tool_specs()`：返回 Vision MCP 的工具定義列表
- `call_tool()`：執行指定的 Vision MCP 工具

</details>
