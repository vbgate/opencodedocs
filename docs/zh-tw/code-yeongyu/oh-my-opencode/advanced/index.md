---
title: "進階: 高級特性與工作流 | oh-my-opencode"
sidebarTitle: "像團隊一樣工作"
subtitle: "進階: 高級特性與工作流"
description: "掌握 oh-my-opencode 的高級特性。學習 AI 代理團隊、並行任務、Categories/Skills 系統、生命週期鉤子等核心功能，實現高效 AI 工作流編排。"
order: 60
---

# 進階

本章節深入講解 oh-my-opencode 的高級特性：專業 AI 代理團隊、並行後臺任務、Categories 和 Skills 系統、生命週期鉤子等。掌握這些功能後，你將能夠像管理真實團隊一樣編排 AI 工作流，實現更高效的開發體驗。

## 本章內容

<div class="grid-cards">

### [AI 代理團隊：10 位專家介紹](./ai-agents-overview/)

全面介紹 10 個內置代理的功能、使用場景和調用方式。學會根據任務類型選擇合適的代理，實現高效團隊協作、並行任務執行與深度代碼分析。

### [Prometheus 規劃：面試式需求收集](./prometheus-planning/)

通過面試模式明確需求並生成工作計劃。Prometheus 會持續提問直到需求清晰，並自動諮詢 Oracle、Metis、Momus 驗證計劃質量。

### [後臺並行任務：像團隊一樣工作](./background-tasks/)

深入講解後臺代理管理系統的使用方法。學會並發控制、任務輪詢和結果獲取，讓多個 AI 代理同時處理不同任務，大幅提升工作效率。

### [LSP 與 AST-Grep：代碼重構利器](./lsp-ast-tools/)

介紹 LSP 工具和 AST-Grep 工具的使用方法。展示如何實現 IDE 級別的代碼分析和操作，包括符號導航、引用查找、結構化代碼搜索。

### [Categories 和 Skills：動態代理組合](./categories-skills/)

學會使用 Categories 和 Skills 系統創建專業化的子代理。實現靈活的代理組合，根據任務需求動態分配模型、工具和技能。

### [內置 Skills：瀏覽器自動化與 Git 專家](./builtin-skills/)

詳細介紹三個內置 Skills（playwright、frontend-ui-ux、git-master）的使用場景和最佳實踐。快速接入瀏覽器自動化、前端 UI 設計、Git 操作等專業能力。

### [生命週期鉤子：自動化上下文與質量控制](./lifecycle-hooks/)

介紹 32 個生命週期鉤子的使用方法。理解如何自動化上下文注入、錯誤恢復和質量控制，構建完整的 AI 工作流自動化體系。

### [斜杠命令：預設工作流](./slash-commands/)

介紹 6 個內置斜杠命令的使用方法。包括 /ralph-loop（快速修復循環）、/refactor（代碼重構）、/start-work（啟動項目執行）等常用工作流。

### [配置深度定製：代理與權限管理](./advanced-configuration/)

教會用戶深度自定義代理配置、權限設置、模型覆蓋和提示詞修改。掌握完整配置能力，打造符合團隊規範的 AI 工作流。

</div>

## 學習路徑

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  第 1 步                  第 2 步                     第 3 步                          第 4 步                  │
│  了解 AI 代理團隊    →   掌握規劃與並行     →   學會動態代理組合     →   深度定製與自動化       │
│  (基礎概念)               (核心能力)                 (高級用法)                   (專家級)                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**建議順序**：

1. **先學 AI 代理團隊**：了解 10 個代理的職責和使用場景，這是理解整個系統的基石。
2. **再學規劃與並行任務**：掌握 Prometheus 規劃和後臺任務系統，這是高效協作的核心。
3. **接著學動態代理組合**：學習 Categories 和 Skills，實現靈活的代理專業化。
4. **最後學深度定製**：掌握生命週期鉤子、斜杠命令和配置定製，打造完整工作流。

**進階路線**：
- 如果你的目標是**快速上手**：重點學習「AI 代理團隊」和「斜杠命令」
- 如果你的目標是**團隊協作**：深入學習「Prometheus 規劃」和「後臺並行任務」
- 如果你的目標是**工作流自動化**：學習「生命週期鉤子」和「配置深度定製」

## 前置條件

::: warning 開始前請確認
本章內容假設你已完成以下學習：

- ✅ [快速安裝與配置](../start/installation/)：已安裝 oh-my-opencode 並配置至少一個 Provider
- ✅ [初識 Sisyphus：主編排器](../start/sisyphus-orchestrator/)：了解基本代理調用和委託機制
- ✅ [Provider 配置：Claude、OpenAI、Gemini](../platforms/provider-setup/)：已配置至少一個 AI Provider
:::

## 下一步

完成本章後，建議繼續學習：

- **[配置診斷與故障排除](../faq/troubleshooting/)**：遇到問題時快速定位和解決。
- **[配置參考](../appendix/configuration-reference/)：** 查看完整的配置文件 schema，了解所有配置選項。
- **[Claude Code 兼容性](../appendix/claude-code-compatibility/)：** 了解如何將現有 Claude Code 工作流遷移到 oh-my-opencode。
