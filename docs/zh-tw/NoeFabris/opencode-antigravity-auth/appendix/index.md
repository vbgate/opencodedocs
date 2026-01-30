---
title: "附錄：技術參考資料 | Antigravity Auth"
sidebarTitle: "徹底搞懂外掛原理"
subtitle: "附錄：架構、API 與設定技術參考"
description: "了解 Antigravity Auth 外掛的技術參考資料，包括架構設計、API 規範、儲存格式和完整設定選項，深入理解外掛內部機制。"
order: 5
---

# 附錄

本章節提供 Antigravity Auth 外掛的技術參考資料，包括架構設計、API 規範、儲存格式和完整設定手冊，幫助你深入理解外掛內部機制。

## 學習路徑

### 1. [架構概覽](./architecture-overview/)

了解外掛的模組結構和請求處理流程。

- 模組分層設計和職責劃分
- 請求從 OpenCode 到 Antigravity API 的完整鏈路
- 多帳戶負載均衡和會話恢復機制

### 2. [API 規範](./api-spec/)

深入了解 Antigravity API 的技術細節。

- 統一網關介面和端點設定
- 請求/響應格式和 JSON Schema 限制
- Thinking 模型設定和函數呼叫規則

### 3. [儲存格式](./storage-schema/)

了解帳戶儲存檔案的結構和版本管理。

- 儲存檔案位置和各欄位含義
- v1/v2/v3 版本演進和自動遷移
- 跨機器遷移帳戶設定

### 4. [完整設定選項](./all-config-options/)

所有設定選項的完整參考手冊。

- 30+ 設定項的預設值和適用場景
- 環境變數覆蓋設定
- 不同使用場景的最佳設定組合

## 前置條件

::: warning 建議先完成
本章節內容偏向技術深度，建議先完成以下學習：

- [快速安裝](../start/quick-install/) - 完成外掛安裝和首次認證
- [設定指南](../advanced/configuration-guide/) - 了解常用設定方法
:::

## 下一步

完成附錄學習後，你可以：

- 查看 [常見問題](../faq/) 解決使用中遇到的問題
- 關注 [更新日誌](../changelog/version-history/) 了解版本變更
- 參與外掛開發，貢獻程式碼或文件
