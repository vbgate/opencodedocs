---
title: "外掛介紹: 功能與風險 | Antigravity Auth"
sidebarTitle: "這個外掛適合你嗎"
subtitle: "了解 Antigravity Auth 外掛的核心價值"
description: "學習 Antigravity Auth 外掛的核心價值和風險提示。透過 Google OAuth 存取 Claude 和 Gemini 3 模型，支援多帳戶負載平衡。"
tags:
  - "入門"
  - "外掛介紹"
  - "OpenCode"
  - "Antigravity"
order: 1
---

# 了解 Antigravity Auth 外掛的核心價值

**Antigravity Auth** 是一個 OpenCode 外掛，透過 Google OAuth 認證存取 Antigravity API。它讓你用熟悉的 Google 帳號就能呼叫 Claude Opus 4.5、Sonnet 4.5 和 Gemini 3 Pro/Flash 等進階模型，無需管理 API 金鑰。外掛還提供多帳戶負載平衡、雙配額池和自動對話恢復等功能，適合需要進階模型和自動管理的用戶。

## 學完你能做什麼

- 判斷這個外掛是否適合你的使用情境
- 了解外掛支援哪些 AI 模型和核心功能
- 明確使用此外掛的風險和注意事項
- 決定是否繼續安裝和設定

## 你現在的困境

想要使用最先進的 AI 模型（如 Claude Opus 4.5、Gemini 3 Pro），但官方存取受限。尋找可靠的方式取得這些模型，同時希望：

- 不需要手動管理多個 API 金鑰
- 遇到速率限制時能自動切換帳戶
- 對話中斷後能自動恢復，不遺失上下文

## 核心思路

**Antigravity Auth** 是一個 OpenCode 外掛，透過 **Google OAuth 認證** 存取 Google Antigravity API，讓你用自己熟悉的 Google 帳號就能呼叫進階 AI 模型。

它不是代理所有請求，而是**攔截並轉換**你的模型呼叫請求，將其轉發到 Antigravity API，再把回應轉換回 OpenCode 可以識別的格式。

## 主要功能

### 支援的模型

| 模型系列 | 可用模型 | 特點 |
|---|---|---|
| **Claude** | Opus 4.5、Sonnet 4.5 | 支援擴展思考模式 |
| **Gemini 3** | Pro、Flash | Google Search 整合、擴展思考 |

::: info 思考模式（Thinking）
Thinking 模型會在生成回答前先進行「深度思考」，展示推理過程。你可以設定思考預算，平衡品質和回應速度。
:::

### 多帳戶負載平衡

- **最多支援 10 個 Google 帳戶**
- 遇到速率限制（429 錯誤）時自動切換到下一個帳戶
- 三種帳戶選擇策略：sticky（固定）、round-robin（輪換）、hybrid（智慧混合）

### 雙配額系統

外掛同時存取**兩個獨立的配額池**：

1. **Antigravity 配額**：來自 Google Antigravity API
2. **Gemini CLI 配額**：來自 Google Gemini CLI

當一個池限速時，外掛會自動嘗試另一個池，最大化配額利用率。

### 自動對話恢復

- 檢測工具呼叫失敗（如按 ESC 中斷）
- 自動注入 synthetic tool_result，避免對話崩潰
- 支援自動發送 "continue" 繼續對話

### Google Search 整合

為 Gemini 模型啟用網頁搜尋，提升事實準確性：

- **Auto 模式**：模型根據需要決定是否搜尋
- **Always-on 模式**：每次都搜尋

## 什麼時候用這個外掛

::: tip 適合以下情境
- 你有多個 Google 帳號，希望提高總體配額
- 需要使用 Claude 或 Gemini 3 的 Thinking 模型
- 想要為 Gemini 模型啟用 Google Search
- 不想手動管理 API 金鑰，更習慣 OAuth 認證
- 經常遇到速率限制，希望自動切換帳戶
:::

::: warning 不適合以下情境
- 你需要使用 Google 官方未公開的模型
- 你對 Google ToS 風險非常敏感（見下方風險提示）
- 你只需要基礎的 Gemini 1.5 或 Claude 3 模型（官方介面更穩定）
- 你在 WSL、Docker 等環境中開啟瀏覽器困難
:::

## ⚠️ 重要風險提示

使用此外掛**可能違反 Google 的服務條款**。少量用戶報告他們的 Google 帳號被**封禁**或**影子封禁**（限制存取但不明確通知）。

### 高風險情境

- 🚨 **全新的 Google 帳號**：被封禁機率極高
- 🚨 **新開通 Pro/Ultra 訂閱的帳號**：容易被標記並封禁

### 使用前請確認

- 這是一個**非官方工具**，Google 未認可
- 你的帳號可能被暫停或永久封禁
- 你承擔使用此外掛的所有風險

### 建議

- 使用**成熟的 Google 帳號**，而非為此外掛建立新帳號
- 避免使用與關鍵服務繫結的重要帳號
- 如果帳號被封禁，無法透過此外掛申訴

::: danger 帳號安全
所有 OAuth 令牌都儲存在本地 `~/.config/opencode/antigravity-accounts.json`，不會上傳到任何伺服器。但請確保你的電腦安全，防止令牌洩漏。
:::

## 本課小結

Antigravity Auth 是一個強大的 OpenCode 外掛，讓你透過 Google OAuth 存取 Claude 和 Gemini 3 進階模型。它提供多帳戶負載平衡、雙配額池、自動對話恢復等功能，適合需要進階模型和自動管理的用戶。

但請務必注意：**使用此外掛有封號風險**。請使用非關鍵的 Google 帳號，並了解相關風險後再繼續安裝。

## 下一課預告

> 下一課我們學習 **[快速安裝](../quick-install/)**。
>
> 你會學到：
> - 5 分鐘完成外掛安裝
> - 新增第一個 Google 帳戶
> - 驗證安裝成功
