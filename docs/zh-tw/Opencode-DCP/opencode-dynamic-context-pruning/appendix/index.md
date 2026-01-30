---
title: "附錄: 技術參考資料 | opencode-dynamic-context-pruning"
sidebarTitle: "深入理解原理"
subtitle: "附錄: 技術參考資料 | opencode-dynamic-context-pruning"
description: "了解 DCP 的技術參考資料，包括內部架構設計、Token 計算原理和完整的 API 文件。適合深入理解原理或進行二次開發的用戶。"
order: 5
---

# 附錄

本章节提供 DCP 的技術參考資料，包括內部架構設計、Token 計算原理和完整的 API 文件。這些內容面向希望深入理解 DCP 工作原理或進行二次開發的用戶。

## 本章內容

| 文件 | 說明 | 適合誰 |
|--- | --- | ---|
| [架構概覽](./architecture/) | 了解 DCP 的內部架構、模組依賴和呼叫鏈路 | 想理解 DCP 工作原理的用戶 |
| [Token 計算原理](./token-calculation/) | 理解 DCP 如何計算 Token 使用量和節省統計 | 想準確評估節省效果的用戶 |
| [API 參考](./api-reference/) | 完整的 API 文件，包括設定介面、工具規範、狀態管理 | 外掛開發者 |

## 學習路徑

```
架構概覽 → Token 計算原理 → API 參考
   ↓              ↓              ↓
 理解設計      理解統計      開發擴充
```

**推薦順序**：

1. **架構概覽**：先建立整體認知，理解 DCP 的模組劃分和呼叫鏈路
2. **Token 計算原理**：了解 `/dcp context` 輸出的計算邏輯，學會分析 Token 分佈
3. **API 參考**：如果你需要開發外掛或進行二次開發，查閱完整的介面文件

::: tip 按需閱讀
如果你只是想用好 DCP，可以跳過本章節。這些內容主要面向想深入理解原理或進行開發的用戶。
:::

## 前置條件

閱讀本章節前，建議先完成以下內容：

- [安裝與快速開始](../start/getting-started/)：確保 DCP 已正常運行
- [設定全解](../start/configuration/)：了解設定系統的基本概念
- [Slash 指令使用](../platforms/commands/)：熟悉 `/dcp context` 和 `/dcp stats` 指令

## 下一步

完成本章節後，你可以：

- 查看 [常見問題與排錯](../faq/troubleshooting/)：解決使用中遇到的問題
- 查看 [最佳實踐](../faq/best-practices/)：學習如何最大化 Token 節省效果
- 查看 [版本歷史](../changelog/version-history/)：了解 DCP 的更新記錄
