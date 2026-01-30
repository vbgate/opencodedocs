---
title: "快速開始：快速上手使用 OpenSkills | OpenSkills"
sidebarTitle: "15 分鐘上手"
subtitle: "快速開始：快速上手使用 OpenSkills | OpenSkills"
description: "學習 OpenSkills 快速入門方法。15 分鐘內完成工具和技能安裝，使 AI 代理能夠使用新技能並理解其工作原理。"
order: 1
---

# 快速開始

本章節幫助你快速上手 OpenSkills，從安裝工具到讓 AI 代理使用技能，只需 10-15 分鐘。

## 學習路徑

建議按以下順序學習：

### 1. [快速開始](./quick-start/)

5 分鐘內完成工具安裝、技能安裝和同步，體驗 OpenSkills 的核心價值。

- 安裝 OpenSkills 工具
- 從 Anthropic 官方倉庫安裝技能
- 同步技能到 AGENTS.md
- 驗證 AI 代理可以使用技能

### 2. [什麼是 OpenSkills？](./what-is-openskills/)

理解 OpenSkills 的核心概念和工作原理。

- OpenSkills 與 Claude Code 的關係
- 統一技能格式、漸進式載入、多代理支援
- 何時使用 OpenSkills 而不是內建技能系統

### 3. [安裝指南](./installation/)

詳細的安裝步驟和環境配置。

- Node.js 和 Git 環境檢查
- npx 臨時使用 vs 全域安裝
- 常見安裝問題排查

### 4. [安裝第一個技能](./first-skill/)

從 Anthropic 官方倉庫安裝技能，體驗交互式選擇。

- 使用 `openskills install` 指令
- 交互式選擇需要的技能
- 理解技能目錄結構（.claude/skills/）

### 5. [同步技能到 AGENTS.md](./sync-to-agents/)

生成 AGENTS.md 檔案，讓 AI 代理知道可用技能。

- 使用 `openskills sync` 指令
- 理解 AGENTS.md 的 XML 格式
- 選擇要同步的技能，控制上下文大小

### 6. [使用技能](./read-skills/)

了解 AI 代理如何載入技能內容。

- 使用 `openskills read` 指令
- 技能查找的 4 級優先級順序
- 一次讀取多個技能

## 前置條件

開始學習前，請確認：

- 已安裝 [Node.js](https://nodejs.org/) 20.6.0 或更高版本
- 已安裝 [Git](https://git-scm.com/)（用於從 GitHub 安裝技能）
- 已安裝至少一個 AI 編碼代理（Claude Code、Cursor、Windsurf、Aider 等）

::: tip 快速檢查環境
```bash
node -v  # 應顯示 v20.6.0 或更高
git -v   # 應顯示 git version x.x.x
```
:::

## 下一步

完成本章节後，可以繼續學習：

- [指令詳解](../platforms/cli-commands/)：深入了解所有指令和參數
- [安裝來源詳解](../platforms/install-sources/)：學習從 GitHub、本機路徑、私有倉庫安裝技能
- [建立自訂技能](../advanced/create-skills/)：打造屬於你自己的技能
