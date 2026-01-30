---
title: "附錄 | Clawdbot 教程"
sidebarTitle: "設定、部署、開發實戰"
subtitle: "附錄"
description: "Clawdbot 附錄章節：完整設定參考、Gateway WebSocket API 協議、部署選項和開發指南。"
tags: []
order: 340
---

# 附錄

本章節提供了 Clawdbot 的高級參考文件和開發資源，包括完整的設定參考、Gateway WebSocket API 協議規格、部署選項和開發指南。

::: info 適用場景
本章節適合需要深入了解 Clawdbot 內部機制、進行高級設定、部署或參與開發的用戶。如果您剛開始使用，建議先完成 [快速開始](../../start/getting-started/) 章節。
:::

## 子頁面導航

### [完整設定參考](./config-reference/)
**詳細設定檔參考** - 涵蓋所有設定項、預設值和範例。查找 Gateway、Agent、渠道、工具等模組的完整設定說明。

### [Gateway WebSocket API 協議](./api-protocol/)
**協議規格文件** - Gateway WebSocket 協議的完整規格，包括端點定義、訊息格式、認證方式和事件訂閱機制。適合需要自訂客戶端或整合 Gateway 的開發者。

### [部署選項](./deployment/)
**部署方式指南** - 不同平台的部署方式：本地安裝、Docker、VPS、Fly.io、Nix 等。了解如何在各種環境中執行 Clawdbot。

### [開發指南](./development/)
**開發者文件** - 從原始碼建置、外掛開發、測試和貢獻流程。學習如何參與 Clawdbot 專案開發，或撰寫自訂外掛。

## 學習路徑建議

根據您的需求，選擇適合的學習路徑：

### 設定與運維人員
1. 先閱讀 [完整設定參考](./config-reference/) - 了解所有可設定項
2. 參考 [部署選項](./deployment/) - 選擇合適的部署方案
3. 根據需要查閱 Gateway WebSocket API 文件進行整合

### 應用程式開發者
1. 閱讀 [Gateway WebSocket API 協議](./api-protocol/) - 理解協議機制
2. 查看 [完整設定參考](./config-reference/) - 了解如何設定相關功能
3. 參考協議範例建置客戶端

### 外掛/功能開發者
1. 閱讀 [開發指南](./development/) - 了解開發環境和建置流程
2. 深入 [Gateway WebSocket API 協議](./api-protocol/) - 理解 Gateway 架構
3. 參考 [完整設定參考](./config-reference/) - 了解設定系統

## 前置條件

::: warning 前置知識
在深入本章節之前，建議您已完成以下內容：
- ✅ 完成了 [快速開始](../../start/getting-started/)
- ✅ 設定了至少一個渠道（如 [WhatsApp](../../platforms/whatsapp/) 或 [Telegram](../../platforms/telegram/)）
- ✅ 了解了基礎的 AI 模型設定（參見 [AI 模型與認證](../../advanced/models-auth/)）
- ✅ 對 JSON 設定檔和 TypeScript 有基本了解
:::

## 下一步指引

完成本章節學習後，您可以：

- **進行高級設定** - 參考 [完整設定參考](./config-reference/) 客製化您的 Clawdbot
- **部署到生產環境** - 按照 [部署選項](./deployment/) 選擇適合的部署方案
- **開發自訂功能** - 參考 [開發指南](./development/) 撰寫外掛或貢獻程式碼
- **深入學習其他功能** - 探索 [進階功能](../../advanced/) 章節，如會話管理、工具系統等

::: tip 尋找協助
如果您在使用過程中遇到問題，可以查閱 [疑難排解](../../faq/troubleshooting/) 取得常見問題的解決方案。
:::
