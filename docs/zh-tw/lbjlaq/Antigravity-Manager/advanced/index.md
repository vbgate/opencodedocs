---
title: "進階配置：高級功能詳解 | Antigravity-Manager"
order: 300
sidebarTitle: "將系統升級到生產級"
subtitle: "進階配置：高級功能詳解"
description: "學習 Antigravity-Manager 的進階配置方法。掌握帳號調度、模型路由、配額治理和監控統計等高級功能。"
---

# 進階配置

本章節深入講解 Antigravity Tools 的高級功能：配置管理、安全策略、帳號調度、模型路由、配額治理、監控統計，以及伺服器部署方案。掌握這些內容後，你可以把 Antigravity Tools 從"能用"升級到"好用、穩定、可運維"。

## 本章包含

| 教程 | 說明 |
|-----|------|
| [配置全解](./config/) | AppConfig/ProxyConfig 的完整欄位、落盤位置與熱更新語義 |
| [安全與隱私](./security/) | `auth_mode`、`allow_lan_access` 與安全基線設計 |
| [高可用調度](./scheduling/) | 輪換、固定帳號、黏性會話與失敗重試機制 |
| [模型路由](./model-router/) | 自訂映射、萬用字元優先順序與預設策略 |
| [配額治理](./quota/) | Quota Protection + Smart Warmup 的組合打法 |
| [Proxy Monitor](./monitoring/) | 請求日誌、篩選、詳情還原與匯出 |
| [Token Stats](./token-stats/) | 成本視角的統計口徑與圖表解讀 |
| [長會話穩定性](./context-compression/) | 上下文壓縮、簽名快取與工具結果壓縮 |
| [系統能力](./system/) | 多語言/主題/更新/開機自啟/HTTP API Server |
| [伺服器部署](./deployment/) | Docker noVNC vs Headless Xvfb 選型與運維 |

## 學習路徑建議

::: tip 推薦順序
本章內容較多，建議按以下模組分批學習：
:::

**第一階段：配置與安全（必學）**

```
配置全解 → 安全與隱私
config      security
```

先了解配置體系（哪些需要重啟、哪些熱更新），再學安全設定（尤其是暴露到區域網路/公網時）。

**第二階段：調度與路由（推薦）**

```
高可用調度 → 模型路由
scheduling    model-router
```

學會用最小帳號數獲得最大穩定性，再用模型路由遮蔽上游變化。

**第三階段：配額與監控（按需）**

```
配額治理 → Proxy Monitor → Token Stats
quota        monitoring      token-stats
```

防止配額無感耗盡，把呼叫黑盒變成可觀測系統，量化成本優化。

**第四階段：穩定性與部署（進階）**

```
長會話穩定性 → 系統能力 → 伺服器部署
context-compression  system    deployment
```

解決長會話的隱性問題，讓客戶端更像產品，最後學伺服器部署。

**快速選擇**：

| 你的場景 | 推薦先看 |
|---------|---------|
| 多帳號輪換不穩定 | [高可用調度](./scheduling/) |
| 想固定某個模型名 | [模型路由](./model-router/) |
| 配額總是用完 | [配額治理](./quota/) |
| 想看請求日誌 | [Proxy Monitor](./monitoring/) |
| 想統計 Token 消耗 | [Token Stats](./token-stats/) |
| 長對話經常出錯 | [長會話穩定性](./context-compression/) |
| 要暴露到區域網路 | [安全與隱私](./security/) |
| 要部署到伺服器 | [伺服器部署](./deployment/) |

## 前置條件

::: warning 開始前請確認
- 已完成 [快速開始](../start/) 章節（至少完成安裝、新增帳號、啟動反代）
- 已完成 [平台與整合](../platforms/) 中至少一個協議的接入（如 OpenAI 或 Anthropic）
- 本地反代已能正常回應請求
:::

## 下一步

學完本章節後，你可以繼續學習：

- [常見問題](../faq/)：遇到 401/404/429/流式中斷等問題時的排查指南
- [附錄](../appendix/)：端點速查表、資料模型、z.ai 能力邊界等參考資料
