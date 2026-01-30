---
title: "更新日誌：版本歷史 | opencode-md-table-formatter"
sidebarTitle: "版本變化一覽"
subtitle: "更新日誌：版本歷史與變更記錄"
description: "了解 opencode-md-table-formatter 的版本演進和新功能。查看 v0.1.0 特性，包括自動格式化和寬度快取等。"
tags:
  - "changelog"
  - "version-history"
  - "release-notes"
prerequisite: []
order: 90
---

# 更新日誌：版本歷史與變更記錄

::: info 學完你能做什麼
- 追蹤外掛的版本演進歷程
- 了解每個版本的新功能和修復
- 掌握已知限制和技術細節
- 了解未來可能的功能增強
:::

---

## [0.1.0] - 2025-01-07

### 新增功能

這是 opencode-md-table-formatter 的**初始發布版本**，包含以下核心功能：

- **自動表格格式化**：透過 `experimental.text.complete` 鉤子自動格式化 AI 生成的 Markdown 表格
- **隱藏模式支援**：計算寬度時正確處理隱藏的 Markdown 符號（如 `**`、`*`）
- **巢狀 Markdown 處理**：支援任意深度的巢狀 Markdown 語法，使用多遍剝離演算法
- **程式碼區塊保護**：行內程式碼（`` `code` ``）內的 Markdown 符號保持字面形式，不參與寬度計算
- **對齊方式支援**：支援左對齊（`---` 或 `:---`）、置中對齊（`:---:`）、右對齊（`---:`）
- **寬度快取最佳化**：快取字串顯示寬度計算結果，提升效能
- **無效表格驗證**：自動驗證表格結構，無效表格會添加錯誤註釋
- **多字元支援**：支援 Emoji、Unicode 字元、空白儲存格、超長內容
- **靜默錯誤處理**：格式化失敗不會中斷 OpenCode 工作流程

### 技術細節

本版本包含約 **230 行生產就緒的 TypeScript 程式碼**：

- **12 個函數**：職責清晰，分離良好
- **類型安全**：正確使用 `Hooks` 介面
- **智慧快取清理**：在操作數超過 100 次或快取條目超過 1000 時觸發清理
- **多遍正規表示式處理**：支援任意巢狀深度的 Markdown 符號剝離

::: tip 快取機制
快取設計用於最佳化重複內容的寬度計算。例如，當表格中多次出現相同的儲存格文字時，只會計算一次寬度，後續直接從快取讀取。
:::

### 已知限制

本版本不支援以下情境：

- **HTML 表格**：僅支援 Markdown 管道表格（Pipe Table）
- **多行儲存格**：不支援包含 `<br>` 標籤的儲存格
- **無分隔行表格**：表格必須包含分隔行（`|---|`）才能被格式化
- **依賴要求**：需要 `@opencode-ai/plugin` >= 0.13.7（使用未公開的 `experimental.text.complete` 鉤子）

::: info 版本要求
外掛依賴 OpenCode >= 1.0.137 和 `@opencode-ai/plugin` >= 0.13.7 才能正常運作。
:::

---

## 未來計畫

以下功能計畫在未來的版本中實現：

- **配置選項**：支援自訂最小/最大列寬、停用特定功能
- **無表頭表格支援**：格式化沒有表頭行的表格
- **效能最佳化**：針對超大表格（100+ 行）的效能分析和最佳化
- **更多對齊選項**：擴展對齊方式的語法和功能

::: tip 參與貢獻
如果你有功能建議或想貢獻程式碼，歡迎在 [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) 提出你的想法。
:::

---

## 變更記錄格式說明

本專案的更新日誌遵循 [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) 格式，版本號遵循 [語義化版本規範 (Semantic Versioning)](https://semver.org/spec/v2.0.0.html)。

**版本號格式**：`MAJOR.MINOR.PATCH`

- **MAJOR**：不相容的 API 變更
- **MINOR**：向後相容的新功能
- **PATCH**：向後相容的問題修復

**變更類型**：

- **Added**：新增功能
- **Changed**：現有功能的變更
- **Deprecated**：即將移除的功能
- **Removed**：已移除的功能
- **Fixed**：問題修復
- **Security**：安全相關修復

---

## 建議閱讀順序

如果你是新使用者，建議按以下順序學習：

1. [一分鐘上手：安裝與配置](../../start/getting-started/) —— 快速上手
2. [功能全覽：自動格式化的魔法](../../start/features/) —— 了解核心功能
3. [常見問題：表格沒格式化怎麼辦](../../faq/troubleshooting/) —— 故障排查
4. [已知限制：外掛的邊界在哪裡](../../appendix/limitations/) —— 了解限制
