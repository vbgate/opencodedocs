---
title: "常見問題: OAuth 認證與模型排查 | Antigravity Auth"
sidebarTitle: "認證失敗怎麼辦"
subtitle: "常見問題: OAuth 認證與模型排查"
description: "了解 Antigravity Auth 插件的常見問題與解決方案。涵蓋 OAuth 認證失敗排查、模型未找到錯誤處理、插件相容性配置等實用指南，幫助你快速定位並解決使用中遇到的各類問題。"
order: 4
---

# 常見問題

本章節收錄了使用 Antigravity Auth 插件時最常遇到的問題和解決方案。無論是 OAuth 認證失敗、模型請求報錯，還是插件相容性問題，這裡都有對應的排查指南。

## 前置條件

::: warning 開始前請確保
- ✅ 已完成 [快速安裝](../start/quick-install/) 並成功添加帳戶
- ✅ 已完成 [首次認證](../start/first-auth-login/) 並理解 OAuth 流程
:::

## 學習路徑

根據你遇到的問題類型，選擇對應的排查指南：

### 1. [OAuth 認證失敗排查](./common-auth-issues/)

解決 OAuth 認證、令牌刷新和帳戶相關常見問題。

- 瀏覽器授權成功但終端提示「授權失敗」
- 突然報錯「Permission Denied」或「invalid_grant」
- Safari 瀏覽器 OAuth 回調失敗
- WSL2/Docker 環境下無法完成認證

### 2. [遷移帳戶](./migration-guide/)

在不同機器間遷移帳戶，處理版本升級。

- 將帳戶從舊電腦遷移到新電腦
- 理解儲存格式的版本變化（v1/v2/v3）
- 解決遷移後的 invalid_grant 錯誤

### 3. [模型未找到排查](./model-not-found/)

解決模型未找到、400 錯誤等模型相關問題。

- `Model not found` 錯誤排查
- `Invalid JSON payload received. Unknown name "parameters"` 400 錯誤
- MCP 伺服器調用報錯

### 4. [插件相容性](./plugin-compatibility/)

解決與 oh-my-opencode、DCP 等插件的相容性問題。

- 正確配置插件載入順序
- 在 oh-my-opencode 中停用衝突的認證方式
- 為並行代理場景啟用 PID 偏移

### 5. [ToS 警告](./tos-warning/)

理解使用風險，避免帳戶被封禁。

- 了解 Google 服務條款限制
- 識別高風險場景（新帳戶、密集請求）
- 掌握避免帳戶封禁的最佳實踐

## 快速定位問題

| 錯誤現象 | 推薦閱讀 |
|--- | ---|
| 認證失敗、授權超時 | [OAuth 認證失敗排查](./common-auth-issues/) |
| invalid_grant、Permission Denied | [OAuth 認證失敗排查](./common-auth-issues/) |
| Model not found、400 錯誤 | [模型未找到排查](./model-not-found/) |
| 與其他插件衝突 | [插件相容性](./plugin-compatibility/) |
| 換新電腦、版本升級 | [遷移帳戶](./migration-guide/) |
| 擔心帳戶安全 | [ToS 警告](./tos-warning/) |

## 下一步

解決問題後，你可以：

- 📖 閱讀 [進階功能](../advanced/) 深入掌握多帳戶、會話恢復等特性
- 📚 查閱 [附錄](../appendix/) 了解架構設計和完整配置參考
- 🔄 關注 [更新日誌](../changelog/) 獲取最新功能和變更
