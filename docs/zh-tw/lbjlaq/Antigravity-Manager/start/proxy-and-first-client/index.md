---
title: "啟動代理: 反代與客戶端接入 | Antigravity-Manager"
sidebarTitle: "5 分鐘跑通反代"
subtitle: "啟動本地反代並接入第一個客戶端（/healthz + SDK 配置）"
description: "學習 Antigravity 反代啟動與客戶端接入：設定連接埠和鑑權，用 /healthz 探活驗證，完成 SDK 首次呼叫。"
tags:
  - "API Proxy"
  - "healthz"
  - "OpenAI SDK"
  - "Anthropic SDK"
  - "Gemini SDK"
  - "Base URL"
prerequisite:
  - "start-installation"
  - "start-add-account"
duration: 18
order: 6
---

# 啟動本地反代並接入第一個客戶端（/healthz + SDK 配置）

這節課用 Antigravity Tools 把本地反代（API Proxy）跑通：啟動服務、用 `/healthz` 探活，再接入一個 SDK 完成第一次請求。

## 學完你能做什麼

- 在 Antigravity Tools 的 API Proxy 頁面啟動/停止本地反代服務
- 用 `GET /healthz` 做探活，確認「連接埠沒錯、服務真在跑」
- 搞清楚 `auth_mode` 與 API Key 的關係：哪些路徑需要鑑權、要帶哪個 Header
- 任選一個客戶端（OpenAI / Anthropic / Gemini SDK）完成第一次真實請求

## 你現在的困境

- 你已經裝好了 Antigravity Tools，也加了帳戶，但不知道「反代到底有沒有啟動成功」
- 客戶端接入時容易遇到 `401`（沒帶 key）或 `404`（Base URL 拼錯/疊路徑）
- 你不想靠猜，想要一個最短閉環：啟動 → 探活 → 第一次請求成功

## 什麼時候用這一招

- 你剛安裝完，想確認本地閘道能對外工作
- 你換了連接埠、開啟了區域網路存取、或改了鑑權模式，想快速驗證配置沒翻車
- 你要接入一個新客戶端/新 SDK，想用最小範例先跑通

## 🎒 開始前的準備

::: warning 前置條件
- 你已經完成安裝，並能正常打開 Antigravity Tools。
- 你至少有一個可用帳戶；否則啟動反代時會回傳錯誤 `"沒有可用帳戶，請先新增帳戶"`（僅當 z.ai 分發也未啟用時）。
:::

::: info 這節課裡會反覆出現的幾個詞
- **Base URL**：客戶端請求的「服務根位址」。不同 SDK 的拼接方式不一樣，有的要帶 `/v1`，有的不需要。
- **探活**：用一個最小請求確認服務可達。本專案的探活端點是 `GET /healthz`，回傳 `{"status":"ok"}`。
:::

## 核心思路

1. Antigravity Tools 啟動反代時，會根據配置綁定監聽位址和連接埠：
   - `allow_lan_access=false` 時綁定 `127.0.0.1`
   - `allow_lan_access=true` 時綁定 `0.0.0.0`
2. 你不需要先寫任何程式碼。先用 `GET /healthz` 做探活，確認「服務在跑」。
3. 如果你開啟了鑑權：
   - `auth_mode=all_except_health` 會豁免 `/healthz`
   - `auth_mode=strict` 則所有路徑都需要 API Key

## 跟我做

### 第 1 步：確認連接埠、區域網路存取、鑑權模式

**為什麼**
你要先確定「客戶端應該連哪裡（host/port）」以及「是否要帶 key」，否則後面 401/404 會很難排。

在 Antigravity Tools 打開 `API Proxy` 頁面，重點看這 4 個欄位：

- `port`：預設是 `8045`
- `allow_lan_access`：預設關閉（僅本機存取）
- `auth_mode`：可選 `off/strict/all_except_health/auto`
- `api_key`：預設會產生 `sk-...`，並且 UI 會校驗必須以 `sk-` 開頭且長度至少 10

**你應該看到**
- 頁面右上角有一個 Start/Stop 按鈕（啟動/停止反代），連接埠輸入框在服務執行時會被停用

::: tip 新手推薦配置（先跑通再加安全）
- 第一次跑通：`allow_lan_access=false` + `auth_mode=off`
- 需要區域網路存取再開：先打開 `allow_lan_access=true`，再把 `auth_mode` 切到 `all_except_health`（至少別把整個 LAN 暴露成「裸奔 API」）
:::

### 第 2 步：啟動反代服務

**為什麼**
GUI 的 Start 會呼叫後端命令啟動 Axum Server，並載入帳戶池；這是「對外提供 API」的前提。

點擊頁面右上角的 Start。

**你應該看到**
- 狀態從 stopped 變成 running
- 旁邊會顯示目前載入到的帳戶數量（active accounts）

::: warning 如果啟動失敗，最常見的兩類錯誤
- `"沒有可用帳戶，請先新增帳戶"`：說明帳戶池為空，且 z.ai 分發未啟用。
- `"啟動 Axum 伺服器失敗: 位址 <host:port> 綁定失敗: ..."`：連接埠被佔用或沒有權限（換個連接埠再試）。
:::

### 第 3 步：用 /healthz 探活（最短閉環）

**為什麼**
`/healthz` 是最穩定的「連通性確認」。它不依賴模型、帳戶或通訊協定轉換，只驗證服務是否可達。

把 `<PORT>` 換成你在 UI 裡看到的連接埠（預設 `8045`）：

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**你應該看到**

```json
{"status":"ok"}
```

::: details 需要帶鑑權時怎麼測？
當你把 `auth_mode` 切到 `strict`，所有路徑都要帶 key（包括 `/healthz`）。

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```

鑑權 Header 的推薦寫法（相容更多形式）：
- `Authorization: Bearer <proxy.api_key>` 或 `Authorization: <proxy.api_key>`
- `x-api-key: <proxy.api_key>`
- `x-goog-api-key: <proxy.api_key>`
:::

### 第 4 步：接入你的第一個客戶端（OpenAI / Anthropic / Gemini 三選一）

**為什麼**
`/healthz` 只能說明「服務可達」；真正的接入成功，要以 SDK 發起一次真實請求為準。

::: code-group

```python [OpenAI SDK (Python)]
import openai

client = openai.OpenAI(
    api_key="<API_KEY>",
    base_url="http://127.0.0.1:8045/v1",
)

resp = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "你好，請自我介紹"}],
)

print(resp.choices[0].message.content)
```

```bash [Claude Code / Anthropic CLI]
export ANTHROPIC_API_KEY="<API_KEY>"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

```python [Gemini SDK (Python)]
import google.generativeai as genai

genai.configure(
    api_key="<API_KEY>",
    transport="rest",
    client_options={"api_endpoint": "http://127.0.0.1:8045"},
)

model = genai.GenerativeModel("gemini-3-flash")
resp = model.generate_content("Hello")
print(resp.text)
```

:::

**你應該看到**
- 客戶端能拿到一個非空的文字回覆
- 如果開啟了 Proxy Monitor，你還會在監控裡看到這次請求記錄

## 檢查點 ✅

- `GET /healthz` 回傳 `{"status":"ok"}`
- API Proxy 頁面顯示 running
- 你選的一個 SDK 範例能回傳內容（不是 401/404，也不是空回應）

## 踩坑提醒

::: warning 401：多數是鑑權沒對齊
- 你開啟了 `auth_mode`，但客戶端沒帶 key。
- 你帶了 key，但 Header 名不對：本專案同時相容 `Authorization` / `x-api-key` / `x-goog-api-key`。
:::

::: warning 404：多數是 Base URL 拼錯或「疊路徑」
- OpenAI SDK 通常需要 `base_url=.../v1`；而 Anthropic/Gemini 的範例是不帶 `/v1` 的。
- 有些客戶端會把路徑重複拼接成類似 `/v1/chat/completions/responses`，會導致 404（專案 README 裡專門提到過 Kilo Code 的 OpenAI 模式疊路徑問題）。
:::

::: warning 區域網路存取不是「打開就完事」
當你開啟 `allow_lan_access=true`，服務會綁定到 `0.0.0.0`。這意味著同一區域網路內的其他裝置可以透過你的機器 IP + 連接埠存取。

如果你要這麼用，至少把 `auth_mode` 打開，並設定一個強 `api_key`。
:::

## 本課小結

- 啟動反代後，先用 `/healthz` 做探活，再去配 SDK
- `auth_mode` 決定哪些路徑要帶 key；`all_except_health` 會豁免 `/healthz`
- 接入 SDK 時，最容易錯的是 Base URL 是否要帶 `/v1`

## 下一課預告

> 下一課我們把 OpenAI 相容 API 的細節講清楚：包括 `/v1/chat/completions` 和 `/v1/responses` 的相容邊界。
>
> 去看 **[OpenAI 相容 API：/v1/chat/completions 與 /v1/responses 的落地策略](/zh-tw/lbjlaq/Antigravity-Manager/platforms/openai/)**。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 主題 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 反代服務啟動/停止/狀態 | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L178) | 42-178 |
| 啟動前帳戶池檢查（無帳戶時的報錯條件） | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L81-L91) | 81-91 |
| 路由註冊（含 `/healthz`） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| `/healthz` 回傳值 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| 代理鑑權中介軟體（Header 相容與 `/healthz` 豁免） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| `auth_mode=auto` 的實際解析邏輯 | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L19-L30) | 19-30 |
| ProxyConfig 預設值（連接埠 8045、預設僅本機） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| 綁定位址推導（127.0.0.1 vs 0.0.0.0） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L291) | 281-291 |
| UI 啟動/停止按鈕呼叫 `start_proxy_service/stop_proxy_service` | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L624-L639) | 624-639 |
| UI 連接埠/區域網路/鑑權/API key 配置區域 | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L868-L1121) | 868-1121 |
| README 的 Claude Code / Python 接入範例 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L227) | 197-227 |

</details>
