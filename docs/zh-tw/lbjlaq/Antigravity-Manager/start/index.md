---
title: "快速開始: 從零使用 Antigravity Tools | Antigravity-Manager"
sidebarTitle: "從零跑起來"
subtitle: "快速開始: 從零使用 Antigravity Tools"
description: "學習 Antigravity Tools 的完整上手流程。從安裝設定到首次 API 呼叫，快速掌握本地閘道的核心使用方法。"
order: 1
---

# 快速開始

本章節帶你從零開始使用 Antigravity Tools，完成從安裝到第一次成功呼叫 API 的完整流程。你會學到核心概念、帳號管理、資料備份，以及如何讓你的 AI 用戶端接入本地閘道。

## 本章內容

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Antigravity Tools 是什麼</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">建立正確心智模型：本地閘道、協定相容、帳號池調度的核心概念與使用邊界。</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">安裝與升級</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">桌面端最佳安裝路徑（brew / releases），以及常見系統攔截的處理方式。</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">首次啟動必懂</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">資料目錄、日誌、托盤與自動啟動，避免誤刪與不可逆遺失。</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">新增帳號</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">OAuth/Refresh Token 雙通道與最佳實踐，用最穩的方式建立帳號池。</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">帳號備份與遷移</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">匯入/匯出、V1/DB 熱遷移，支援多機複用與伺服器部署場景。</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">啟動反代並接入用戶端</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">從啟動服務到外部用戶端成功呼叫，一次跑通驗證閉環。</p>
</a>

</div>

## 學習路徑

::: tip 推薦順序
按照以下順序學習，可以最快速地上手 Antigravity Tools：
:::

```
1. 概念理解        →  2. 安裝軟體        →  3. 了解資料目錄
   getting-started      installation          first-run-data
        ↓                    ↓                      ↓
4. 新增帳號        →  5. 備份帳號        →  6. 啟動反代
   add-account          backup-migrate        proxy-and-first-client
```

| 步驟 | 課程 | 預計時間 | 你會學到 |
|------|------|----------|----------|
| 1 | [概念理解](./getting-started/) | 5 分鐘 | 什麼是本地閘道、為什麼需要帳號池 |
| 2 | [安裝軟體](./installation/) | 3 分鐘 | brew 安裝或手動下載，處理系統攔截 |
| 3 | [了解資料目錄](./first-run-data/) | 5 分鐘 | 資料存在哪、日誌怎麼看、托盤操作 |
| 4 | [新增帳號](./add-account/) | 10 分鐘 | OAuth 授權或手動填寫 Refresh Token |
| 5 | [備份帳號](./backup-migrate/) | 5 分鐘 | 匯出帳號、跨裝置遷移 |
| 6 | [啟動反代](./proxy-and-first-client/) | 10 分鐘 | 啟動服務、設定用戶端、驗證呼叫 |

**最小可用路徑**：如果你趕時間，可以只完成 1 → 2 → 4 → 6，大約 25 分鐘即可開始使用。

## 下一步

完成本章節後，你已經可以正常使用 Antigravity Tools 了。接下來可以根據需要深入學習：

- **[平台與整合](../platforms/)**：了解 OpenAI、Anthropic、Gemini 等不同協定的接入細節
- **[進階設定](../advanced/)**：模型路由、配額保護、高可用調度等進階功能
- **[常見問題](../faq/)**：遇到 401、429、404 等錯誤時的排查指南
