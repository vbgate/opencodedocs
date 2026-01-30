---
title: "404 路徑不相容: Base URL 設定 | Antigravity-Manager"
sidebarTitle: "修復 404 路徑"
subtitle: "404/路徑不相容：Base URL、/v1 前置詞與疊路徑用戶端"
description: "學習解決 Antigravity Tools 整合時 404 路徑不相容問題。掌握 Base URL 正確設定，避免 /v1 前置詞重複，處理疊路徑用戶端，涵蓋常見情境。"
tags:
  - "faq"
  - "base-url"
  - "404"
  - "openai"
  - "anthropic"
  - "gemini"
prerequisite:
  - "start-proxy-and-first-client"
  - "faq-auth-401"
order: 4
---

# 404/路徑不相容：Base URL、/v1 前置詞與疊路徑用戶端

## 學完你能做什麼

- 看到 404 時，先判斷是「Base URL 拼接問題」還是「鑑權/服務沒開」
- 按用戶端類型選對 Base URL（要不要帶 `/v1`）
- 識別兩類高頻坑：重複前置詞（`/v1/v1/...`）和疊路徑（`/v1/chat/completions/responses`）

## 你現在的困境

接入外部用戶端時遇到 `404 Not Found` 錯誤，排查半天發現是 Base URL 設定問題：

- Kilo Code 呼叫失敗，日誌顯示 `/v1/chat/completions/responses` 找不到
- Claude Code 雖然能連，但總提示路徑不相容
- Python OpenAI SDK 報 `404`，但明明服務已經啟動

這些問題的根源不是帳號配額或鑑權，而是用戶端把「自己的路徑」拼到了你寫的 Base URL 上，結果路徑就歪了。

## 什麼時候用這一招

- 你確定反代已啟動，但呼叫任意介面都返回 404
- 你把 Base URL 填成了帶路徑的形式（比如 `/v1/...`），但不知道用戶端會不會再拼一遍
- 你用的用戶端「自帶一套路徑拼接邏輯」，請求出來的路徑看起來不像標準 OpenAI/Anthropic/Gemini

## 🎒 開始前的準備

先把「服務沒開/鑑權失敗」排除掉，不然你會在錯誤方向上越繞越遠。

### 第 1 步：確認反代在跑

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/healthz
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/healthz | Select-Object -ExpandProperty Content
```

:::

**你應該看到**：HTTP 200，返回 JSON（至少包含 `{"status":"ok"}`）。

### 第 2 步：確認你遇到的是 404（不是 401）

如果你在 `auth_mode=strict/all_except_health/auto(allow_lan_access=true)` 模式下沒帶 key，你更可能遇到 401。先看一眼狀態碼，必要時先做完 **[401 鑑權失敗排查](../auth-401/)**。

## 什麼是 Base URL？

**Base URL** 是用戶端發請求時的「根位址」。用戶端通常會把自己的 API 路徑拼到 Base URL 後面再請求，所以 Base URL 裡到底要不要帶 `/v1`，取決於用戶端會追加什麼路徑。你只要把最終請求路徑對齊到 Antigravity Tools 的路由，就不會再被 404 卡住。

## 核心思路

Antigravity Tools 的反代路由是「全路徑硬編碼」的（見 `src-tauri/src/proxy/server.rs`），常用入口是：

| 協定 | 路徑 | 用途 |
| --- | --- | ---|
| OpenAI | `/v1/models` | 列出模型 |
| OpenAI | `/v1/chat/completions` | 聊天補全 |
| OpenAI | `/v1/responses` | Codex CLI 相容 |
| Anthropic | `/v1/messages` | Claude 訊息 API |
| Gemini | `/v1beta/models` | 列出模型 |
| Gemini | `/v1beta/models/:model` | 產生內容 |
| 健康檢查 | `/healthz` | 探活端點 |

你要做的是：讓用戶端拼出來的「最終路徑」，剛好落在這些路由上。

---

## 跟我做

### 第 1 步：用 curl 先打到「正確的路徑」

**為什麼**
先確認「你要走的協定」在本地確實有對應路由，避免把 404 當成「模型/帳號問題」。

::: code-group

```bash [macOS/Linux]
 # OpenAI 協定：列模型
 curl -i http://127.0.0.1:8045/v1/models

 # Anthropic 協定：訊息介面（這裡只看 404/401，不要求一定成功）
 curl -i http://127.0.0.1:8045/v1/messages

 # Gemini 協定：列模型
 curl -i http://127.0.0.1:8045/v1beta/models
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/models | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/messages | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1beta/models | Select-Object -ExpandProperty StatusCode
```

:::

**你應該看到**：這些路徑至少不應該是 404。若出現 401，先按 **[401 鑑權失敗排查](../auth-401/)** 配好 key。

### 第 2 步：按用戶端「會不會自己拼 /v1」選 Base URL

**為什麼**
Base URL 的坑，本質是「你寫的路徑」和「用戶端追加的路徑」疊在一起了。

| 你在用的東西 | Base URL 推薦寫法 | 你在對齊的路由 |
| --- | --- | ---|
| OpenAI SDK（Python/Node 等） | `http://127.0.0.1:8045/v1` | `/v1/chat/completions`、`/v1/models` |
| Claude Code CLI（Anthropic） | `http://127.0.0.1:8045` | `/v1/messages` |
| Gemini SDK / Gemini 模式用戶端 | `http://127.0.0.1:8045` | `/v1beta/models/*` |

::: tip 口訣
OpenAI SDK 通常要你把 `/v1` 放在 Base URL 裡；Anthropic/Gemini 更常見的是只寫到 host:port。
:::

### 第 3 步：處理 Kilo Code 這種「疊路徑」用戶端

**為什麼**
Antigravity Tools 沒有 `/v1/chat/completions/responses` 這個路由。用戶端拼出這個路徑就一定 404。

按 README 的推薦設定：

1. 協定選擇：優先用 **Gemini 協定**
2. Base URL：填寫 `http://127.0.0.1:8045`

**你應該看到**：請求會走 `/v1beta/models/...` 這套路徑，不再出現 `/v1/chat/completions/responses`。

### 第 4 步：別把 Base URL 寫到「具體資源路徑」

**為什麼**
多數 SDK 會在 Base URL 後拼接自己的資源路徑。如果你把 Base URL 寫到了過深的位置，最終就會變成「雙層路徑」。

✅ 推薦（OpenAI SDK）：

```text
http://127.0.0.1:8045/v1
```

❌ 常見錯誤：

```text
http://127.0.0.1:8045
http://127.0.0.1:8045/v1/chat/completions
```

**你應該看到**：把 Base URL 改淺之後，請求路徑回到 `/v1/...` 或 `/v1beta/...`，404 消失。

---

## 檢查點 ✅

你可以用這張表快速對照你的「最終請求路徑」是否可能命中 Antigravity Tools：

| 你在日誌裡看到的路徑 | 結論 |
| --- | ---|
| 以 `/v1/` 開頭（比如 `/v1/models`、`/v1/chat/completions`） | 走 OpenAI/Anthropic 相容路由 |
| 以 `/v1beta/` 開頭（比如 `/v1beta/models/...`） | 走 Gemini 原生路由 |
| 出現 `/v1/v1/` | Base URL 帶了 `/v1`，用戶端又拼了一次 |
| 出現 `/v1/chat/completions/responses` | 用戶端疊路徑，當前路由表不支援 |

---

## 踩坑提醒

### 坑 1：重複 /v1 前置詞

**錯誤現象**：路徑變成 `/v1/v1/chat/completions`

**原因**：Base URL 已經帶 `/v1`，用戶端又拼了一次。

**解決**：把 Base URL 改為「只到 `/v1`」，不要再往後寫具體資源路徑。

### 坑 2：疊路徑用戶端

**錯誤現象**：路徑變成 `/v1/chat/completions/responses`

**原因**：用戶端在 OpenAI 協定路徑基礎上又追加了業務路徑。

**解決**：優先切換到該用戶端的其他協定模式（比如 Kilo Code 用 Gemini）。

### 坑 3：埠號寫錯

**錯誤現象**：`Connection refused` 或逾時

**解決**：在 Antigravity Tools 的 "API 反代" 頁面確認當前監聽埠（預設 8045），Base URL 埠號必須一致。

---

## 本課小結

| 現象 | 最常見原因 | 你應該怎麼改 |
| --- | --- | ---|
| 一直 404 | Base URL 拼接錯 | 先用 curl 驗證 `/v1/models`/`/v1beta/models` 不為 404 |
| `/v1/v1/...` | `/v1` 重複 | OpenAI SDK 的 Base URL 保持到 `/v1` 結束 |
| `/v1/chat/completions/responses` | 用戶端疊路徑 | 換 Gemini 協定或做路徑重寫（不推薦新手） |

---

## 下一課預告

> 下一課我們學習 **[串流中斷與 0 Token 問題](../streaming-0token/)**
>
> 你會學到：
> - 為什麼串流回應會意外中斷
> - 0 Token 錯誤的排查方法
> - Antigravity 的自動兜底機制

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | ---|
| 反代路由定義（完整路由表） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| `AxumServer::start()`（路由建構入口） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L79-L216) | 79-216 |
| `health_check_handler()` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| README：Claude Code 的 Base URL 推薦 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L204) | 197-204 |
| README：Kilo Code 疊路徑說明與推薦協定 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L206-L211) | 206-211 |
| README：Python OpenAI SDK 的 base_url 範例 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L213-L227) | 213-227 |

**關鍵函式**：
- `AxumServer::start()`: 啟動 Axum 反代伺服器並註冊所有對外路由
- `health_check_handler()`: 健康檢查處理器（`GET /healthz`）

</details>
