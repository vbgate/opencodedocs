---
title: "附錄: 配置參考與遷移 | oh-my-opencode"
sidebarTitle: "配置遷移全搞定"
subtitle: "附錄: 配置參考與遷移"
description: "學習 oh-my-opencode 的配置參考、Claude Code 相容性指南和內建 MCP 伺服器使用方法。了解配置選項、遷移步驟和搜尋能力配置，實作從 Claude Code 的無縫遷移。"
tags:
  - "附錄"
  - "參考"
order: 170
---

# 附錄：參考資料與相容性指南

本章節包含 **oh-my-opencode** 的詳細參考資料和相容性指南，涵蓋完整配置說明、Claude Code 遷移支援以及內建擴充伺服器的詳細介紹。

## 章節內容

本章節包含三個重要部分：

| 子頁面 | 描述 | 難度 |
|--- | --- | ---|
| [Claude Code 相容性](./claude-code-compatibility/) | 從 Claude Code 遷移到 OpenCode 的完整指南，包括 Commands、Skills、Agents、MCPs 和 Hooks 的相容機制 | ⭐⭐ |
| [配置參考](./configuration-reference/) | oh-my-opencode 配置檔案的完整 Schema 說明，涵蓋所有欄位、類型和預設值 | ⭐⭐⭐ |
| [內建 MCP](./builtin-mcps/) | 3 個內建 MCP 伺服器（Exa Websearch、Context7、Grep.app）的功能和使用方法 | ⭐⭐ |

## 學習路徑建議

根據你的需求選擇學習順序：

### 路徑 1：從 Claude Code 遷移

如果你是從 Claude Code 遷移的使用者：

1. 先閱讀 **[Claude Code 相容性](./claude-code-compatibility/)**，了解如何無縫遷移現有配置
2. 再查看 **[配置參考](./configuration-reference/)**，深入了解可用配置選項
3. 最後學習 **[內建 MCP](./builtin-mcps/)**，了解如何配置額外的搜尋能力

### 路徑 2：深度定制配置

如果你希望深度定制 oh-my-opencode 的行為：

1. 從 **[配置參考](./configuration-reference/)** 開始，了解所有可配置項
2. 學習 **[內建 MCP](./builtin-mcps/)**，配置搜尋和文件查詢能力
3. 參考 **[Claude Code 相容性](./claude-code-compatibility/)**，了解相容層的配置選項

### 路徑 3：快速查閱

如果你只需要查閱特定資訊：

- **配置問題** → 直接查看 **[配置參考](./configuration-reference/)**
- **遷移問題** → 直接查看 **[Claude Code 相容性](./claude-code-compatibility/)**
- **MCP 配置** → 直接查看 **[內建 MCP](./builtin-mcps/)**

## 前置條件

學習本章節建議你已經：

- ✅ 完成了 **[安裝與配置](../start/installation/)**
- ✅ 了解了 **[Sisyphus 編排器](../start/sisyphus-orchestrator/)** 的基本概念
- ✅ 熟悉 JSON 配置檔案的編輯

## 下一步指引

完成本章節學習後，你可以：

- 🚀 嘗試 **[進階功能](../advanced/)**，學習更多進階用法
- 🔧 查看 **[常見問題解答](../faq/)**，解決使用中的問題
- 📖 閱讀 **[更新日誌](../changelog/)**，了解最新功能改進

::: tip 提示
本章節的內容主要作為參考資料，不需要按順序閱讀。你可以根據需要隨時查閱對應部分。
:::
