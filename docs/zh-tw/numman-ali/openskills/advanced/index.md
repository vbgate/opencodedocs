---
title: "進階功能：多代理與技能開發 | OpenSkills"
sidebarTitle: "多帳號與自訂技能"
subtitle: "進階功能：多代理與技能開發"
description: "學習 OpenSkills 的進階特性，包括多代理環境設定、自訂技能開發、CI/CD 整合和安全機制，高效管理複雜場景。"
order: 3
---

# 進階功能

本章節涵蓋 OpenSkills 的進階用法，包括多代理環境設定、自訂輸出、符號連結開發、技能創作、CI/CD 整合和安全機制。掌握這些內容後，你可以在複雜場景下高效管理技能，並建立屬於自己的專屬技能庫。

::: warning 前置條件
學習本章節前，請確保你已完成：
- [快速開始](../start/quick-start/)：了解基本安裝和使用流程
- [安裝第一個技能](../start/first-skill/)：掌握技能安裝方法
- [同步技能到 AGENTS.md](../start/sync-to-agents/)：理解技能同步機制
:::

## 本章內容

### 多代理與輸出設定

| 教程 | 說明 |
| --- | --- |
| --- | --- |
| --- | --- |

### 技能開發

| 教程 | 說明 |
| --- | --- |
| [符號連結支援](./symlink-support/) | 透過符號連結實現基於 git 的技能更新和本地開發工作流程，多專案共用技能 |
| [建立自訂技能](./create-skills/) | 從零開始建立 SKILL.md 技能檔案，掌握 YAML frontmatter 和目錄結構規範 |
| [技能結構詳解](./skill-structure/) | 深入理解 SKILL.md 完整欄位規範、references/scripts/assets/ 資源設計和效能最佳化 |

### 自動化與安全

| 教程 | 說明 |
| --- | --- |
| --- | --- |
| [安全性說明](./security/) | 了解路徑遍歷防護、符號連結安全處理、YAML 解析安全等三層防護機制 |

### 綜合指南

| 教程 | 說明 |
| --- | --- |
| [最佳實踐](./best-practices/) | 專案設定、技能管理、團隊協作的經驗總結，幫助你高效使用 OpenSkills |

## 學習路徑建議

根據你的使用場景，選擇合適的學習路徑：

### 路徑 A：多代理使用者

如果你同時使用多個 AI 編碼工具（Claude Code + Cursor + Windsurf 等）：

```
Universal 模式 → 自訂輸出路徑 → 最佳實踐
```

### 路徑 B：技能創作者

如果你想建立自己的技能並分享給團隊：

```
建立自訂技能 → 技能結構詳解 → 符號連結支援 → 最佳實踐
```

### 路徑 C：DevOps/自動化

如果你需要在 CI/CD 流程中整合 OpenSkills：

```
CI/CD 整合 → 安全性說明 → 最佳實踐
```

### 路徑 D：完整學習

如果你想全面掌握所有進階功能，按以下順序學習：

1. [Universal 模式](./universal-mode/) - 多代理環境基礎
2. [自訂輸出路徑](./custom-output-path/) - 靈活的輸出設定
3. [符號連結支援](./symlink-support/) - 高效的開發工作流程
4. [建立自訂技能](./create-skills/) - 技能創作入門
5. [技能結構詳解](./skill-structure/) - 深入理解技能格式
6. [CI/CD 整合](./ci-integration/) - 自動化部署
7. [安全性說明](./security/) - 安全機制詳解
8. [最佳實踐](./best-practices/) - 經驗總結

## 下一步

完成本章節後，你可以：

- 查閱 [常見問題](../faq/faq/) 解決使用中遇到的問題
- 參考 [CLI API 參考](../appendix/cli-api/) 了解完整的命令列介面
- 閱讀 [AGENTS.md 格式規範](../appendix/agents-md-format/) 深入理解產生的檔案格式
- 查看 [更新日誌](../changelog/changelog/) 了解最新功能和變更
