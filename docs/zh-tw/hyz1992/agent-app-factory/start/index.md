---
title: "快速上手 AI App Factory：從安裝到運行第一個應用 | agent-app-factory"
sidebarTitle: "上手"
subtitle: "上手"
description: "學習如何快速啟動 AI App Factory，從安裝配置 CLI 工具到理解 7 階段流水線的工作原理，掌握初始化專案並開始你的第一個應用生成之旅。本章節包含快速開始、安裝配置、專案初始化和流水線概覽四個核心課程，幫助你全面了解從想法到可運行應用的端到端自動化流程。"
order: 10
---

# 上手

本章節幫助你快速上手 AI App Factory，了解核心價值、安裝配置工具，並理解 7 階段流水線的工作原理，為生成第一個應用做好準備。

## 學習路徑

建議按照以下順序學習本章節內容：

### 1. [快速開始：從想法到應用](../getting-started/)
了解 AI App Factory 的核心價值和前置要求，透過一個完整的案例體驗從想法到應用的端到端流程。
- 理解基於檢查點的多 Agent 協作機制
- 了解 7 階段流水線的完整工作流程
- 掌握提供清晰產品描述的技巧

### 2. [安裝與配置](../installation/)
全域安裝 CLI 工具，配置 AI 助手（Claude Code/OpenCode）及相關環境。
- 使用 npm 全域安裝 agent-app-factory
- 配置 Claude Code 或 OpenCode
- 驗證安裝是否成功

### 3. [初始化 Factory 專案](../init-project/)
使用 `factory init` 命令初始化目錄，了解生成的專案結構和配置檔案。
- 執行專案初始化命令
- 理解專案目錄結構和配置檔案
- 準備產品想法輸入

### 4. [7 階段流水線概覽](../pipeline-overview/)
深入理解從 Bootstrap 到 Preview 的完整流水線流程，各階段的輸入輸出和檢查點機制。
- 理解 7 個階段的目標和產物
- 掌握檢查點機制和人工確認流程
- 學習如何控制流水線執行

## 前置條件

開始本章節學習前，你需要：

::: warning 前置要求

1. **Node.js 環境**：已安裝 Node.js v18 或更高版本
2. **AI 程式設計助手**：必須配置以下工具之一
   - [Claude Code](https://claude.ai/code)（推薦）⭐
   - [OpenCode](https://opencode.design/) 或其他支援 Agent 模式的 AI 助手
3. **基礎命令列操作**：能夠使用終端執行命令

:::

## 下一步

完成本章節學習後，你將掌握：

- ✅ AI App Factory 的核心工作原理
- ✅ CLI 工具的安裝和配置
- ✅ 專案初始化和結構理解
- ✅ 7 階段流水線的完整流程

接下來，建議學習 **[平台與整合](../../platforms/)** 章節，了解如何在不同的 AI 助手（Claude Code、OpenCode 等）上運行流水線。
