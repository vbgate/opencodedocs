---
title: "Web 搜尋與抓取工具：Brave、Perplexity 與網頁內容擷取 | Clawdbot 教學"
sidebarTitle: "讓 AI 上網搜尋"
subtitle: "Web 搜尋與抓取工具"
description: "學習如何配置與使用 Clawdbot 的 web_search 與 web_fetch 工具，讓 AI 助手存取即時網路資訊。本教學涵蓋 Brave Search API 與 Perplexity Sonar 配置、網頁內容擷取、快取機制與常見問題排查。包括 API Key 取得、參數配置、地區語言設定與 Firecrawl 後備配置。"
tags:
  - "advanced"
  - "tools"
  - "web"
  - "search"
  - "fetch"
prerequisite:
  - "start-getting-started"
order: 230
---

# Web 搜尋與抓取工具

## 學完你能做什麼

- 配置 **web_search** 工具，讓 AI 助手使用 Brave Search 或 Perplexity Sonar 進行網路搜尋
- 配置 **web_fetch** 工具，讓 AI 助手抓取與擷取網頁內容
- 理解兩種工具的差異與使用場景
- 配置 API Key 與進階參數（地區、語言、快取時間等）
- 排查常見問題（API Key 錯誤、抓取失敗、快取問題等）

## 你現在的困境

AI 助手的知識庫是靜態的，無法存取即時網路資訊：

- AI 不知道今天發生的新聞
- AI 無法查詢最新的 API 文件或技術部落格
- AI 無法檢索特定網站的最新內容

你希望 AI 助手「連網」，但不知道：

- 應該用 Brave 還是 Perplexity？
- API Key 從哪裡取得？如何配置？
- web_search 與 web_fetch 有什麼差別？
- 如何處理動態網頁或登入保護的站台？

## 什麼時候用這一招

- **web_search**：需要快速查詢資訊、搜尋多個網站、取得即時資料（如新聞、價格、天氣）
- **web_fetch**：需要擷取特定網頁的完整內容、讀取文件頁面、分析部落格文章

::: tip 工具選擇指南
| 場景 | 推薦工具 | 原因 |
|--- | --- | ---|
| 搜尋多個來源 | web_search | 一次查詢返回多個結果 |
| 擷取單頁內容 | web_fetch | 取得完整文字，支援 markdown |
| 動態網頁/需登入 | [browser](../tools-browser/) | 需要執行 JavaScript |
| 簡單靜態頁面 | web_fetch | 輕量快速 |
:::

## 🎒 開始前的準備

::: warning 前置條件
本教學假設你已完成 [快速開始](../../start/getting-started/)，已安裝並啟動了 Gateway。
:::

- Gateway 守護程序正在執行
- 已完成基礎管道配置（至少有一個可用的通訊管道）
- 準備好至少一個搜尋提供商的 API Key（Brave 或 Perplexity/OpenRouter）

::: info 注意
web_search 與 web_fetch 是**輕量級工具**，不執行 JavaScript。對於需要登入的網站或複雜動態頁面，請使用 [browser 工具](../tools-browser/)。
:::

## 核心思路

### 兩個工具的差異

**web_search**：網路搜尋工具
- 呼叫搜尋引擎（Brave 或 Perplexity）返回搜尋結果
- **Brave**：返回結構化結果（標題、URL、描述、發布時間）
- **Perplexity**：返回 AI 合成的答案，並附帶引用連結

**web_fetch**：網頁內容抓取工具
- 對指定 URL 發起 HTTP GET 請求
- 使用 Readability 演算法擷取主要內容（去除導航、廣告等）
- 將 HTML 轉換為 Markdown 或純文字
- 不執行 JavaScript

### 為什麼需要兩個工具？

```
┌─────────────────┐     web_search      ┌──────────────────┐
│  使用者問 AI    │ ──────────────────→  │   搜尋引擎 API   │
│ "最新的新聞"    │                      │   (Brave/Perplexity) │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   AI 得到 5 個結果                          返回搜尋結果
        ↓
┌─────────────────┐     web_fetch       ┌──────────────────┐
│  AI 選擇結果    │ ──────────────────→  │   目標網頁       │
│ "開啟連結 1"    │                      │   (HTTP/HTTPS)   │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   AI 得到完整內容                          擷取 Markdown
```

**典型工作流程**：
1. AI 使用 **web_search** 查詢相關資訊
2. AI 從搜尋結果中選擇合適的連結
3. AI 使用 **web_fetch** 抓取具體頁面內容
4. AI 基於內容回應使用者的問題

### 快取機制

兩個工具都內建快取以減少重複請求：

| 工具 | 快取鍵 | 預設 TTL | 配置項 |
|--- | --- | --- | ---|
| web_search | `provider:query:count:country:search_lang:ui_lang:freshness` | 15 分鐘 | `tools.web.search.cacheTtlMinutes` |
| web_fetch | `fetch:url:extractMode:maxChars` | 15 分鐘 | `tools.web.fetch.cacheTtlMinutes` |

::: info 快取的好處
- 減少外部 API 呼叫次數（節省費用）
- 加快回應速度（相同查詢直接返回快取）
- 避免頻繁請求被限流
:::

## 跟我做

### 第 1 步：選擇搜尋提供商

Clawdbot 支援兩種搜尋提供商：

| 提供商 | 優勢 | 劣勢 | API Key |
|--- | --- | --- | ---|
| **Brave**（預設） | 快速、結構化結果、免費層 | 傳統搜尋結果 | `BRAVE_API_KEY` |
| **Perplexity** | AI 合成答案、引用、即時 | 需要 Perplexity 或 OpenRouter 存取 | `OPENROUTER_API_KEY` 或 `PERPLEXITY_API_KEY` |

::: tip 推薦選擇
- **初學者**：推薦使用 Brave（免費層足夠日常使用）
- **需要 AI 總結**：選擇 Perplexity（返回合成的答案而非原始結果）
:::

### 第 2 步：取得 Brave Search API Key

**為什麼用 Brave**：免費層慷慨、速度快、結構化結果易於解析

#### 2.1 註冊 Brave Search API

1. 瀏覽 https://brave.com/search/api/
2. 建立帳戶並登入
3. 在 Dashboard 中選擇 **"Data for Search"** 方案（不是"Data for AI"）
4. 產生 API Key

#### 2.2 配置 API Key

**方式 A：使用 CLI（推薦）**

```bash
# 執行互動式配置精靈
clawdbot configure --section web
```

CLI 會提示你輸入 API Key，並將其儲存到 `~/.clawdbot/clawdbot.json`。

**方式 B：使用環境變數**

將 API Key 新增到 Gateway 程序的環境變數：

```bash
# 在 ~/.clawdbot/.env 中新增
echo "BRAVE_API_KEY=你的API金鑰" >> ~/.clawdbot/.env

# 重新啟動 Gateway 使環境變數生效
clawdbot gateway restart
```

**方式 C：直接編輯設定檔**

編輯 `~/.clawdbot/clawdbot.json`：

```json5
{
  "tools": {
    "web": {
      "search": {
        "apiKey": "BRAVE_API_KEY_HERE",
        "provider": "brave"
      }
    }
  }
}
```

**你應該看到**：

- 設定儲存後，重新啟動 Gateway
- 在已配置的管道（如 WhatsApp）傳送訊息：「幫我搜尋最近的 AI 新聞」
- AI 應該返回搜尋結果（標題、URL、描述）

### 第 3 步：配置 web_search 進階參數

在 `~/.clawdbot/clawdbot.json` 中可以配置更多參數：

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,           // 是否啟用（預設 true）
        "provider": "brave",       // 搜尋提供商
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 5,          // 返回結果數（1-10，預設 5）
        "timeoutSeconds": 30,       // 逾時時間（預設 30）
        "cacheTtlMinutes": 15      // 快取時間（預設 15 分鐘）
      }
    }
  }
}
```

#### 3.1 配置地區與語言

讓搜尋結果更精準：

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 10,
        // 可選：AI 可以在呼叫時覆寫這些值
        "defaultCountry": "US",   // 預設國家（2 位代碼）
        "defaultSearchLang": "en",  // 搜尋結果語言
        "defaultUiLang": "en"      // UI 元素語言
      }
    }
  }
}
```

**常用國家代碼**：`US`（美國）、`DE`（德國）、`FR`（法國）、`CN`（中國）、`JP`（日本）、`ALL`（全球）

**常用語言代碼**：`en`（英語）、`zh`（中文）、`fr`（法語）、`de`（德語）、`es`（西班牙語）

#### 3.2 配置時間過濾（Brave 專屬）

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        // 可選：AI 可以在呼叫時覆寫
        "defaultFreshness": "pw"  // 過濾最近一週的結果
      }
    }
  }
}
```

**Freshness 值**：
- `pd`：過去 24 小時
- `pw`：過去一週
- `pm`：過去一月
- `py`：過去一年
- `YYYY-MM-DDtoYYYY-MM-DD`：自訂日期範圍（如 `2024-01-01to2024-12-31`）

### 第 4 步：配置 Perplexity Sonar（選用）

如果你更傾向於 AI 合成的答案，可以使用 Perplexity。

#### 4.1 取得 API Key

**方式 A：Perplexity 直連**

1. 瀏覽 https://www.perplexity.ai/
2. 建立帳戶並訂閱
3. 在 Settings 中產生 API Key（以 `pplx-` 開頭）

**方式 B：透過 OpenRouter（無需信用卡）**

1. 瀏覽 https://openrouter.ai/
2. 建立帳戶並充值（支援加密貨幣或預付）
3. 產生 API Key（以 `sk-or-v1-` 開頭）

#### 4.2 配置 Perplexity

編輯 `~/.clawdbot/clawdbot.json`：

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "perplexity",
        "perplexity": {
          // API Key（可選，也可透過環境變數設定）
          "apiKey": "sk-or-v1-...",  // 或 "pplx-..."
          // Base URL（可選，Clawdbot 會根據 API Key 自動推斷）
          "baseUrl": "https://openrouter.ai/api/v1",  // 或 "https://api.perplexity.ai"
          // 模型（預設 perplexity/sonar-pro）
          "model": "perplexity/sonar-pro"
        }
      }
    }
  }
}
```

::: info 自動推斷 Base URL
如果省略 `baseUrl`，Clawdbot 會根據 API Key 前綴自動選擇：
- `pplx-...` → `https://api.perplexity.ai`
- `sk-or-...` → `https://openrouter.ai/api/v1`
:::

#### 4.3 選擇 Perplexity 模型

| 模型 | 描述 | 適用場景 |
|--- | --- | ---|
| `perplexity/sonar` | 快速問答 + 網路搜尋 | 簡單查詢、快速查找 |
| `perplexity/sonar-pro`（預設） | 多步推理 + 網路搜尋 | 複雜問題、需要推理 |
| `perplexity/sonar-reasoning-pro` | 思維鏈分析 | 深度研究、需要推理過程 |

### 第 5 步：配置 web_fetch 工具

web_fetch 預設啟用，無需額外配置即可使用。但你可以調整參數：

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "enabled": true,           // 是否啟用（預設 true）
        "maxChars": 50000,        // 最大字元數（預設 50000）
        "timeoutSeconds": 30,       // 逾時時間（預設 30）
        "cacheTtlMinutes": 15,     // 快取時間（預設 15 分鐘）
        "maxRedirects": 3,         // 最大重新導向次數（預設 3）
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "readability": true         // 是否啟用 Readability（預設 true）
      }
    }
  }
}
```

#### 5.1 配置 Firecrawl 後備（選用）

如果 Readability 擷取失敗，可以使用 Firecrawl 作為後備（需要 API Key）：

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "readability": true,
        "firecrawl": {
          "enabled": true,
          "apiKey": "FIRECRAWL_API_KEY_HERE",  // 或設定 FIRECRAWL_API_KEY 環境變數
          "baseUrl": "https://api.firecrawl.dev",
          "onlyMainContent": true,  // 只擷取主要內容
          "maxAgeMs": 86400000,    // 快取時間（毫秒，預設 1 天）
          "timeoutSeconds": 60
        }
      }
    }
  }
}
```

::: tip Firecrawl 的優勢
- 支援渲染 JavaScript（需要啟用）
- 更強的反爬蟲繞過能力
- 支援複雜網站（SPA、單頁應用程式）
:::

**取得 Firecrawl API Key**：
1. 瀏覽 https://www.firecrawl.dev/
2. 建立帳戶並產生 API Key
3. 在設定中設定或使用環境變數 `FIRECRAWL_API_KEY`

### 第 6 步：驗證配置

**檢查 web_search**：

在已配置的管道（如 WebChat）傳送訊息：

```
幫我搜尋 TypeScript 5.0 的新特性
```

**你應該看到**：
- AI 返回 5 個搜尋結果（標題、URL、描述）
- 如果使用 Perplexity，返回 AI 總結的答案 + 引用連結

**檢查 web_fetch**：

傳送訊息：

```
幫我抓取 https://www.typescriptlang.org/docs/handbook/intro.html 的內容
```

**你應該看到**：
- AI 返回該頁面的 Markdown 格式內容
- 內容已經去除導航、廣告等無關元素

### 第 7 步：測試進階功能

**測試地區過濾**：

```
搜尋德國的 TypeScript 培訓課程
```

AI 可以使用 `country: "DE"` 參數進行地區特定搜尋。

**測試時間過濾**：

```
搜尋上週 AI 領域的新聞
```

AI 可以使用 `freshness: "pw"` 參數過濾最近一週的結果。

**測試擷取模式**：

```
抓取 https://example.com 並以純文字格式返回
```

AI 可以使用 `extractMode: "text"` 參數取得純文字而非 Markdown。

## 檢查點 ✅

確保以下配置正確：

- [ ] Gateway 正在執行
- [ ] 已配置至少一個搜尋提供商（Brave 或 Perplexity）
- [ ] API Key 已正確儲存（透過 CLI 或環境變數）
- [ ] web_search 測試成功（返回搜尋結果）
- [ ] web_fetch 測試成功（返回頁面內容）
- [ ] 快取配置合理（避免過度請求）

::: tip 快速驗證命令
```bash
# 檢視 Gateway 配置
clawdbot configure --show

# 檢視 Gateway 日誌
clawdbot gateway logs --tail 50
```
:::

## 踩坑提醒

### 常見錯誤 1：API Key 未設定

**錯誤訊息**：

```json
{
  "error": "missing_brave_api_key",
  "message": "web_search needs a Brave Search API key. Run `clawdbot configure --section web` to store it, or set BRAVE_API_KEY in Gateway environment."
}
```

**解決方案**：

1. 執行 `clawdbot configure --section web`
2. 輸入 API Key
3. 重新啟動 Gateway：`clawdbot gateway restart`

### 常見錯誤 2：抓取失敗（動態網頁）

**問題**：web_fetch 無法抓取需要 JavaScript 的內容。

**解決方案**：

1. 確認網站是否是 SPA（單頁應用程式）
2. 如果是，使用 [browser 工具](../tools-browser/)
3. 或配置 Firecrawl 後備（需要 API Key）

### 常見錯誤 3：快取導致內容過期

**問題**：搜尋結果或抓取內容是舊的。

**解決方案**：

1. 調整 `cacheTtlMinutes` 配置
2. 或在 AI 對話中明確要求「不使用快取」
3. 重新啟動 Gateway 清空記憶體快取

### 常見錯誤 4：請求逾時

**問題**：抓取大頁面或慢速網站時逾時。

**解決方案**：

```json5
{
  "tools": {
    "web": {
      "search": {
        "timeoutSeconds": 60
      },
      "fetch": {
        "timeoutSeconds": 60
      }
    }
  }
}
```

### 常見錯誤 5：內網 IP 被 SSRF 阻止

**問題**：抓取內網位址（如 `http://localhost:8080`）被阻止。

**解決方案**：

web_fetch 預設阻止內網 IP 以防止 SSRF 攻擊。如果確實需要存取內網：

1. 使用 [browser 工具](../tools-browser/)（更彈性）
2. 或編輯設定允許特定主機（需要修改原始碼）

## 本課小結

- **web_search**：網路搜尋工具，支援 Brave（結構化結果）與 Perplexity（AI 合成答案）
- **web_fetch**：網頁內容抓取工具，使用 Readability 擷取主要內容（HTML → Markdown/text）
- 兩者都內建快取（預設 15 分鐘），減少重複請求
- Brave API Key 可透過 CLI、環境變數或設定檔設定
- Perplexity 支援直連與 OpenRouter 兩種方式
- 對於需要 JavaScript 的網站，使用 [browser 工具](../tools-browser/)
- 配置參數包括：結果數、逾時時間、地區、語言、時間過濾等

## 下一課預告

> 下一課我們學習 **[Canvas 可視化介面與 A2UI](../canvas/)**。
>
> 你會學到：
> - Canvas A2UI 推送機制
> - 可視化介面操作
> - 如何讓 AI 助手控制 Canvas 元素

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| web_search 工具定義 | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 409-483 |
| web_fetch 工具定義 | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 572-624 |
| Brave Search API 呼叫 | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 309-407 |
| Perplexity API 呼叫 | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 268-307 |
| Readability 內容擷取 | [`src/agents/tools/web-fetch-utils.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch-utils.ts) | - |
| Firecrawl 整合 | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 257-330 |
| 快取實作 | [`src/agents/tools/web-shared.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-shared.ts) | - |
| SSRF 保護 | [`src/infra/net/ssrf.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/net/ssrf.ts) | - |
| 配置 Schema | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**關鍵常數**：

- `DEFAULT_SEARCH_COUNT = 5`：預設搜尋結果數
- `MAX_SEARCH_COUNT = 10`：最大搜尋結果數
- `DEFAULT_CACHE_TTL_MINUTES = 15`：預設快取時間（分鐘）
- `DEFAULT_TIMEOUT_SECONDS = 30`：預設逾時時間（秒）
- `DEFAULT_FETCH_MAX_CHARS = 50_000`：預設最大抓取字元數

**關鍵函數**：

- `createWebSearchTool()`：建立 web_search 工具執行個體
- `createWebFetchTool()`：建立 web_fetch 工具執行個體
- `runWebSearch()`：執行搜尋並返回結果
- `runWebFetch()`：執行抓取並擷取內容
- `normalizeFreshness()`：正規化時間過濾參數
- `extractReadableContent()`：使用 Readability 擷取內容

</details>
