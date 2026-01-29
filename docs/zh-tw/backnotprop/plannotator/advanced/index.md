---
title: "進階功能：協作分享與筆記整合 | plannotator"
sidebarTitle: "多人協作+筆記存檔"
subtitle: "進階功能：協作分享與筆記應用整合"
order: 3
description: "掌握 Plannotator 的團隊協作和筆記整合功能。透過 URL 分享實現協作，整合 Obsidian/Bear 筆記，支援遠端開發環境。"
---

# 進階功能

掌握了基礎的計畫審查和程式碼審查後，本章節將帶你解鎖 Plannotator 的進階能力：團隊協作分享、筆記應用整合、遠端開發支援，以及靈活的環境變數設定。

::: warning 前置條件
學習本章節前，請確保你已完成：
- [快速開始](../start/getting-started/)：瞭解 Plannotator 的基本概念
- [計畫審查基礎](../platforms/plan-review-basics/)：掌握基本的計畫審查操作
:::

## 本章內容

| 課程 | 說明 | 適合情境 |
|------|------|----------|
| [URL 分享](./url-sharing/) | 透過 URL 分享計畫和註解，實現無後端的團隊協作 | 需要與團隊成員分享審查結果 |
| [Obsidian 整合](./obsidian-integration/) | 將批准的計畫自動儲存到 Obsidian vault | 使用 Obsidian 管理知識庫 |
| [Bear 整合](./bear-integration/) | 透過 x-callback-url 將計畫儲存到 Bear | macOS/iOS 使用者使用 Bear 筆記 |
| [遠端模式](./remote-mode/) | 在 SSH、devcontainer、WSL 等遠端環境中使用 | 遠端開發情境 |
| [環境變數設定](./environment-variables/) | 瞭解所有可用的環境變數及其用途 | 需要自訂 Plannotator 行為 |

## 學習路徑建議

```
┌─────────────────────────────────────────────────────────────────┐
│  推薦學習順序                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. URL 分享          ← 最常用，團隊協作必備                      │
│       ↓                                                         │
│  2. 筆記應用整合       ← 根據你使用的筆記應用選擇                  │
│     ├─ Obsidian 整合   （Obsidian 使用者）                       │
│     └─ Bear 整合       （Bear 使用者）                           │
│       ↓                                                         │
│  3. 遠端模式          ← 如果你在遠端環境開發                      │
│       ↓                                                         │
│  4. 環境變數設定       ← 需要深度自訂時再看                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

::: tip 按需學習
不必按順序學完所有內容。如果你只需要分享功能，學完 URL 分享即可；如果你不使用遠端開發，可以跳過遠端模式。
:::

## 下一步

完成進階功能的學習後，你可以：

- 查看 [常見問題](../faq/common-problems/)：解決使用中遇到的問題
- 查看 [API 參考](../appendix/api-reference/)：瞭解 Plannotator 的完整 API
- 查看 [資料模型](../appendix/data-models/)：深入理解內部資料結構
