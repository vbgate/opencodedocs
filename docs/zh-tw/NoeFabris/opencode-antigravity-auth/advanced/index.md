---
title: "進階功能：多帳戶管理 | Antigravity Auth"
sidebarTitle: "搞定多帳戶"
subtitle: "進階功能：多帳戶管理"
description: "掌握 Antigravity Auth 外掛的進階特性。深入學習多帳戶負載平衡、智慧帳戶選擇、速率限制處理、會話恢復和請求轉換等核心機制。"
order: 3
---

# 進階功能

本章節幫助你深入掌握 Antigravity Auth 外掛的進階特性，包括多帳戶負載平衡、智慧帳戶選擇、速率限制處理、會話恢復、請求轉換等核心機制。無論是優化配額利用率，還是排查複雜問題，這裡都有你需要的答案。

## 前置條件

::: warning 開始前請確保
- ✅ 已完成 [快速安裝](../start/quick-install/) 並成功新增第一個帳戶
- ✅ 已完成 [首次認證](../start/first-auth-login/) 並理解 OAuth 流程
- ✅ 已完成 [首次請求](../start/first-request/) 並驗證外掛正常運作
:::

## 學習路徑

### 1. [多帳戶設定](./multi-account-setup/)

設定多個 Google 帳戶，實現配額池化和負載平衡。

- 新增多個帳戶，提升整體配額上限
- 理解雙配額系統（Antigravity + Gemini CLI）
- 根據場景選擇合適的帳戶數量

### 2. [帳戶選擇策略](./account-selection-strategies/)

掌握 sticky、round-robin、hybrid 三種帳戶選擇策略的最佳實踐。

- 1 個帳戶 → sticky 策略保留 prompt 快取
- 2-3 個帳戶 → hybrid 策略智慧分佈請求
- 4+ 個帳戶 → round-robin 策略最大化輸送量

### 3. [速率限制處理](./rate-limit-handling/)

理解速率限制檢測、自動重試和帳戶切換機制。

- 區分 5 種不同類型的 429 錯誤
- 理解自動重試的指數退避演算法
- 掌握多帳戶場景下的自動切換邏輯

### 4. [會話恢復](./session-recovery/)

了解會話恢復機制，自動處理工具呼叫失敗和中断。

- 自動處理 tool_result_missing 錯誤
- 修復 thinking_block_order 問題
- 設定 auto_resume 和 session_recovery 選項

### 5. [請求轉換機制](./request-transformation/)

深入理解請求轉換機制，如何相容不同 AI 模型的協議差異。

- 理解 Claude 和 Gemini 模型的協議差異
- 排查 Schema 不相容導致的 400 錯誤
- 優化 Thinking 設定以獲得最佳效能

### 6. [設定指南](./configuration-guide/)

掌握所有設定選項，按需自訂外掛行為。

- 設定檔位置和優先順序
- 模型行為、帳戶輪替、應用程式行為設定
- 單帳戶/多帳戶/並行代理場景推薦設定

### 7. [並行代理最佳化](./parallel-agents/)

為並行代理場景最佳化帳戶分配，啟用 PID 偏移。

- 理解並行代理場景下的帳戶衝突問題
- 啟用 PID 偏移讓不同程序優先選擇不同帳戶
- 配合 round-robin 策略最大化多帳戶利用率

### 8. [除錯日誌](./debug-logging/)

啟用除錯日誌，排查問題和監控執行狀態。

- 啟用除錯日誌記錄詳細資訊
- 理解不同日誌層級和適用場景
- 解讀日誌內容快速定位問題

## 下一步

完成進階功能學習後，你可以：

- 📖 查閱 [常見問題](../faq/) 解決使用中遇到的問題
- 📚 閱讀 [附錄](../appendix/) 了解架構設計和完整設定參考
- 🔄 關注 [更新日誌](../changelog/) 取得最新功能和變更
