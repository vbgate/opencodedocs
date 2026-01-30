---
title: "FAQ: 故障排查 | opencode-md-table-formatter"
sidebarTitle: "遇到問題怎麼辦"
subtitle: "FAQ: 故障排查 | opencode-md-table-formatter"
description: "學習 opencode-md-table-formatter 外掛的常見問題和故障排查方法。快速定位表格格式化問題，解決設定、結構、對齊等疑難雜症。"
order: 3
---

# 常見問題

## 章節概述

本章節涵蓋 opencode-md-table-formatter 外掛的常見問題和故障排查方法，幫助你快速定位和解決表格格式化過程中遇到的各種問題。

---

## 子頁面導覽

### [常見問題：表格沒格式化怎麼辦](troubleshooting/)

全面介紹外掛使用中的常見問題和解決方案：

- **表格不格式化**：檢查設定、版本要求、重新啟動 OpenCode
- **無效表格結構**：理解 "invalid structure" 錯誤含義，學習正確表格語法
- **格式化失敗**：處理 "table formatting failed" 錯誤和異常情況
- **不支援的表格類型**：了解 HTML 表格、多行儲存格等限制場景
- **格式化後不對齊**：排查隱藏模式、儲存格超長、行內代碼等問題

---

## 學習路徑建議

建議在完成 [功能全覽](../start/features/) 後，遇到實際問題時查閱本章節，或作為問題排查的參考手冊。

你可以按照以下順序學習：

1. **遇到問題時**：先根據症狀定位問題類型（表格不格式化、報錯資訊等）
2. **按步驟排查**：按照故障排查指南的檢查清單逐一驗證
3. **深入理解**：閱讀[表格規範](../advanced/table-spec/)和[隱藏模式原理](../advanced/concealment-mode/)了解技術細節
4. **已知限制**：查看[已知限制](../appendix/limitations/)了解外掛邊界

---

## 前置條件

學習本章節前，建議先完成：

- ✅ [一分鐘上手：安裝與設定](../start/getting-started/) - 了解如何安裝和設定外掛
- ✅ [功能全覽：自動格式化的魔法](../start/features/) - 理解外掛的核心功能和工作原理

同時，你應該具備：

- 熟悉 Markdown 表格的基本語法
- 了解 OpenCode 的外掛設定方式（`opencode.jsonc`）

---

## 下一步指引

完成本章節後，你可以繼續學習：

- **進階知識**：
  - [表格規範：什麼樣的表格能被格式化](../advanced/table-spec/) - 掌握有效表格的結構要求
  - [隱藏模式原理：為什麼寬度計算如此重要](../advanced/concealment-mode/) - 理解 OpenCode 隱藏模式的工作原理
  - [對齊方式詳解：左對齊、置中、右對齊](../advanced/alignment/) - 掌握三種對齊方式的語法和效果

- **技術細節**：
  - [已知限制：外掛的邊界在哪裡](../appendix/limitations/) - 了解外掛的已知限制和不適用的場景
  - [技術細節：快取機制與效能優化](../appendix/tech-details/) - 了解外掛的內部快取機制和效能優化策略

---
