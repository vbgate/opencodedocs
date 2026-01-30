---
title: "進階：流水線與內部機制 | AI App Factory 教程"
sidebarTitle: "進階：流水線"
subtitle: "進階：流水線與內部機制"
description: "深入了解 AI App Factory 的 7 階段流水線、Sisyphus 調度器、權限安全機制和失敗處理策略。掌握上下文優化與高級配置技巧。"
tags:
  - "流水線"
  - "調度器"
  - "權限安全"
  - "失敗處理"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# 進階：流水線與內部機制

本章節深入講解 AI App Factory 的核心機制和高級功能，包括 7 階段流水線的詳細工作原理、Sisyphus 調度器的調度策略、權限與安全機制、失敗處理策略，以及如何通過上下文優化節省 Token 成本。

::: warning 前置條件
學習本章節前，請確保已完成：
- [快速開始](../../start/getting-started/) 和 [安裝配置](../../start/installation/)
- [7 階段流水線概覽](../../start/pipeline-overview/)
- [平台整合](../../platforms/claude-code/) 配置
:::

## 章節內容

本章節包含以下主題：

### 7 階段流水線詳解

- **[階段 1：Bootstrap - 結構化產品想法](stage-bootstrap/)**
  - 學習如何將模糊的產品想法轉化為結構化文件
  - 理解 Bootstrap Agent 的輸入輸出格式

- **[階段 2：PRD - 產生產品需求文件](stage-prd/)**
  - 產生 MVP 級 PRD，包含使用者故事、功能清單和非目標
  - 掌握需求分解和優先級排序技巧

- **[階段 3：UI - 設計介面與原型](stage-ui/)**
  - 使用 ui-ux-pro-max 技能設計 UI 結構和可預覽原型
  - 理解介面設計流程和最佳實踐

- **[階段 4：Tech - 設計技術架構](stage-tech/)**
  - 設計最小可行的技術架構和 Prisma 資料模型
  - 掌握技術選型和架構設計原則

- **[階段 5：Code - 產生可執行程式碼](stage-code/)**
  - 根據 UI Schema 和 Tech 設計產生前後端程式碼、測試和配置
  - 理解程式碼產生流程和模板系統

- **[階段 6：Validation - 驗證程式碼品質](stage-validation/)**
  - 驗證依賴安裝、型別檢查、Prisma schema 和程式碼品質
  - 掌握自動化品質檢查流程

- **[階段 7：Preview - 產生部署指南](stage-preview/)**
  - 產生完整的執行說明文件和部署配置
  - 學習 CI/CD 整合和 Git Hooks 配置

### 內部機制

- **[Sisyphus 調度器詳解](orchestrator/)**
  - 理解調度器如何協調流水線、管理狀態和執行權限檢查
  - 掌握調度策略和狀態機原理

- **[上下文優化：分會話執行](context-optimization/)**
  - 學習如何使用 `factory continue` 指令節省 Token
  - 掌握在每個階段新建會話的最佳實踐

- **[權限與安全機制](security-permissions/)**
  - 理解能力邊界矩陣、越權處理和安全檢查機制
  - 掌握安全配置和權限管理

- **[失敗處理與回滾](failure-handling/)**
  - 學習失敗識別、重試機制、回滾策略和人工介入流程
  - 掌握故障排查和恢復技巧

## 學習路徑建議

### 推薦學習順序

1. **先學完 7 階段流水線**（按順序）
   - Bootstrap → PRD → UI → Tech → Code → Validation → Preview
   - 每個階段都有明確的輸入輸出，按順序學習能建立完整的認知

2. **再學習調度器和上下文優化**
   - 理解 Sisyphus 如何協調這 7 個階段
   - 學習如何優化上下文以節省 Token 成本

3. **最後學習安全與失敗處理**
   - 掌握權限邊界和安全機制
   - 了解失敗場景和應對策略

### 不同角色的學習重點

| 角色 | 重點學習章節 |
| ---- | ------------ |
| **開發者** | Code、Validation、Tech、Orchestrator |
| **產品經理** | Bootstrap、PRD、UI、Preview |
| **技術負責人** | Tech、Code、Security、Failure Handling |
| **DevOps 工程師** | Validation、Preview、Context Optimization |

## 下一步

完成本章節後，你可以繼續學習：

- **[常見問題與故障排除](../../faq/troubleshooting/)** - 解決實際使用中的問題
- **[最佳實踐](../../faq/best-practices/)** - 掌握高效使用 Factory 的技巧
- **[CLI 指令參考](../../appendix/cli-commands/)** - 查看完整的指令清單
- **[程式碼規範](../../appendix/code-standards/)** - 了解產生的程式碼應遵循的規範

---

💡 **提示**：如果在使用過程中遇到問題，請先查看 [常見問題與故障排除](../../faq/troubleshooting/) 章節。
