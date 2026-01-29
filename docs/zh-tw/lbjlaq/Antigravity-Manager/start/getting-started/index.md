---
title: "介紹: 本地 AI 閘道 | Antigravity Manager"
sidebarTitle: "什麼是本地 AI 閘道"
subtitle: "Antigravity Tools 是什麼：把「帳號 + 協議」做成本地 AI 閘道"
description: "了解 Antigravity Manager 的核心定位。它提供桌面端和本地 HTTP 閘道，支援多協議端點和帳號池排程，幫助你快速上手本地反代並避免常見設定錯誤。"
tags:
  - "入門"
  - "概念"
  - "本地閘道"
  - "API Proxy"
prerequisite: []
order: 1
---

# Antigravity Tools 是什麼：把「帳號 + 協議」做成本地 AI 閘道

很多 AI 客戶端/SDK 的接入門檻，不在「會不會呼叫 API」，而在「你到底要對接哪家協議、怎麼管理多個帳號、怎麼讓失敗自動恢復」。Antigravity Tools 試圖把這三件事，收斂成一個本地閘道。

## 什麼是 Antigravity Tools？

**Antigravity Tools** 是一個桌面應用程式：你在 GUI 裡管理帳號與設定，它在本機啟動一個 HTTP 反代服務，把不同廠商/協議的請求統一轉發到上游，並把回應再轉換回客戶端熟悉的格式。

## 學完你能做什麼

- 說清楚 Antigravity Tools 解決的是什麼問題（以及它不解決什麼）
- 認清它的核心組成：GUI、帳號池、HTTP 反代閘道、協議適配
- 了解預設安全邊界（127.0.0.1、埠、驗證模式）以及什麼情況下需要改
- 知道下一步該去哪一章：安裝、新增帳號、啟動反代、接入客戶端

## 你現在的困境

你可能遇到過這些麻煩：

- 同一個客戶端要支援 OpenAI/Anthropic/Gemini 三種協議，設定經常寫亂
- 有多個帳號，但切換、輪換、限流重試都靠手動
- 請求失敗時，你只能盯日誌猜是「帳號失效」還是「上游限流/容量耗盡」

Antigravity Tools 的目標是把我們把這些「邊角工作」做進一個本地閘道裡，讓你的客戶端/SDK 盡量只關心一件事：把請求發到本地。

## 核心思路

你可以把它理解成一套本地的「AI 排程閘道」，由三層組成：

1) GUI（桌面應用程式）
- 負責讓你管理帳號、設定、監控與統計。
- 主頁面包含：Dashboard、Accounts、API Proxy、Monitor、Token Stats、Settings。

2) HTTP 反代服務（Axum Server）
- 負責對外暴露多個協議的端點，並把請求轉交給對應 handler。
- 反代服務會掛載驗證、中介軟體監控、CORS、Trace 等層。

3) 帳號池與排程（TokenManager 等）
- 負責從本地帳號池中挑選可用帳號，必要時刷新 token、做輪換與自癒。

::: info 「本地閘道」是什麼意思？
這裡的「本地」是字面意思：服務跑在你自己的機器上，你的客戶端（Claude Code、OpenAI SDK、各類第三方客戶端）把 Base URL 指向 `http://127.0.0.1:<port>`，請求先到本機，再由 Antigravity Tools 轉發到上游。
:::

## 它對外提供哪些端點

反代服務在一個 Router 裡註冊了多套協議端點，你可以先記住這幾個「入口」：

- OpenAI 相容：`/v1/chat/completions`、`/v1/completions`、`/v1/responses`、`/v1/models`
- Anthropic 相容：`/v1/messages`、`/v1/messages/count_tokens`
- Gemini 原生：`/v1beta/models`、`/v1beta/models/:model`、`/v1beta/models/:model/countTokens`
- 健康檢查：`GET /healthz`

如果你的客戶端能對接其中任意一種協議，理論上都可以透過「改 Base URL」的方式，把請求導到這個本地閘道。

## 預設安全邊界（別跳過）

這類「本地反代」最大的坑，往往不是功能不夠，而是你不小心把它暴露出去了。

先記住幾條預設值（都來自預設設定）：

- 預設埠：`8045`
- 預設僅本機存取：`allow_lan_access=false`，監聽位址為 `127.0.0.1`
- 預設驗證模式：`auth_mode=off`（不要求客戶端帶 key）
- 預設會產生一個 `sk-...` 形式的 `api_key`（供你在需要驗證時開啟）

::: warning 什麼時候必須開啟驗證？
只要你開啟了區域網路存取（`allow_lan_access=true`，監聽位址變為 `0.0.0.0`），就應該同時啟用驗證，並把 API Key 當作密碼管理。
:::

## 什麼時候用 Antigravity Tools

它更適合這類場景：

- 你有多個 AI 客戶端/SDK，希望統一走一個 Base URL
- 你需要把不同協議（OpenAI/Anthropic/Gemini）收斂到同一套「本地出口」
- 你有多個帳號，希望由系統負責輪換與穩定性處理

如果你只想「寫兩行程式直接呼叫官方 API」，並且帳號/協議都很固定，那它可能有點重。

## 跟我做：先建立一個正確的使用順序

這節課不教你細節設定，只把主線順序先對齊，避免你跳著用導致卡住：

### 第 1 步：先安裝再啟動

**為什麼**
桌面端負責帳號管理與啟動反代服務，沒有它，後續的 OAuth/反代都無從談起。

去下一章按 README 的安裝方式完成安裝。

**你應該看到**：你能打開 Antigravity Tools，並看到 Dashboard 頁面。

### 第 2 步：新增至少一個帳號

**為什麼**
反代服務需要從帳號池裡拿到可用身份去向上游發請求；沒有帳號，閘道也無法「代替你呼叫」。

去「新增帳號」那一章，按 OAuth 或 Refresh Token 流程把帳號加進來。

**你應該看到**：Accounts 頁面裡出現你的帳號，並能看到配額/狀態資訊。

### 第 3 步：啟動 API Proxy，並用 /healthz 做最小驗證

**為什麼**
先用 `GET /healthz` 驗證「本地服務在跑」，再去接入客戶端，排障會簡單很多。

去「啟動本地反代並接入第一個客戶端」那一章完成閉環。

**你應該看到**：你的客戶端/SDK 能透過本地 Base URL 成功拿到回應。

## 踩坑提醒

| 場景 | 你可能會怎麼做（❌） | 推薦做法（✓） |
|--- | --- | ---|
| 想讓手機/另一台電腦存取 | 直接打開 `allow_lan_access=true` 但不設驗證 | 同時啟用驗證，並先在區域網路裡驗證 `GET /healthz` |
| 客戶端報 404 | 只改 host/port，不管客戶端如何拼接 `/v1` | 先確認客戶端的 base_url 拼接策略，再決定是否需要帶 `/v1` 前綴 |
| 一上來就排 Claude Code | 直接接入複雜客戶端，失敗後不知道從哪查 | 先跑通最小閉環：啟動 Proxy -> `GET /healthz` -> 再接入客戶端 |

## 本課小結

- Antigravity Tools 的定位是「桌面端 + 本地 HTTP 反代閘道」：GUI 管理，Axum 提供多協議端點
- 你需要把它當作一個本地基礎設施：先安裝、再加帳號、再啟動 Proxy、最後接入客戶端
- 預設只監聽 `127.0.0.1:8045`，如果要暴露到區域網路，務必同時啟用驗證

## 下一課預告

> 下一課我們把安裝這一步走完：**[安裝與升級：桌面端最佳安裝路徑](../installation/)**。
>
> 你會學到：
> - README 裡列出的幾種安裝方式（以及優先級）
> - 升級入口與常見系統攔截的處理方式

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 產品定位（本地 AI 中轉站/協議鴻溝） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L35-L77) | 35-77 |
| Router 端點總覽（OpenAI/Claude/Gemini/healthz） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 預設埠/預設僅本機/預設 key 與 bind address 邏輯 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L291) | 174-291 |
|--- | --- | ---|
| GUI 頁面路由結構（Dashboard/Accounts/API Proxy/Monitor/Token Stats/Settings） | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L19-L48) | 19-48 |

**關鍵預設值**：
- `ProxyConfig.port = 8045`：反代服務預設埠
- `ProxyConfig.allow_lan_access = false`：預設僅本機存取
- `ProxyAuthMode::default() = off`：預設不要求驗證

</details>
