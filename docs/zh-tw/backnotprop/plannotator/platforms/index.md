---
title: "平台功能: 計畫與程式碼審查 | Plannotator"
sidebarTitle: "審查 AI 計畫和程式碼"
subtitle: "平台功能: 計畫與程式碼審查"
description: "學習 Plannotator 的平台功能，包括計畫審查和程式碼審查。掌握視覺化審查、新增註解、圖像標註等核心技能。"
order: 2
---

# 平台功能

本章節介紹 Plannotator 的兩大核心功能：**計畫審查**和**程式碼審查**。你將學會如何視覺化審查 AI 產生的計畫、新增各類註解、附加圖像標註，以及審查 git diff 程式碼變更。

## 前置條件

::: warning 開始前請確認
在學習本章節之前，請確保你已完成以下準備：

- ✅ 已完成 [快速開始](../start/getting-started/) 教學
- ✅ 已安裝 Plannotator 外掛（[Claude Code](../start/installation-claude-code/) 或 [OpenCode](../start/installation-opencode/)）
:::

## 本章內容

### 計畫審查

學習如何審查 AI 產生的執行計畫，新增修改建議，讓 AI 按你的意圖執行。

| 教學 | 說明 |
|------|------|
| [計畫審查基礎](./plan-review-basics/) | 學會使用 Plannotator 視覺化審查 AI 產生的計畫，包括批准或拒絕計畫 |
| [新增計畫註解](./plan-review-annotations/) | 掌握如何在計畫中新增不同類型的註解（刪除、取代、插入、評論） |
| [新增圖像標註](./plan-review-images/) | 學會在計畫審查中附加圖像，並使用畫筆、箭頭、圓形工具進行標註 |

### 程式碼審查

學習如何審查程式碼變更，新增行級註解，在提交前發現問題。

| 教學 | 說明 |
|------|------|
| [程式碼審查基礎](./code-review-basics/) | 學會使用 `/plannotator-review` 指令審查 git diff，支援 side-by-side 和 unified 檢視 |
| [新增程式碼註解](./code-review-annotations/) | 掌握如何在程式碼審查中新增行級註解（comment/suggestion/concern） |
| [切換 Diff 檢視](./code-review-diff-types/) | 學會在程式碼審查中切換不同的 diff 類型（uncommitted/staged/last commit/branch） |

## 學習路徑

::: tip 推薦學習順序
根據你的使用情境，選擇合適的學習路徑：

**路徑 A：計畫審查優先**（推薦新手）
1. [計畫審查基礎](./plan-review-basics/) → 先學會基本的計畫審查流程
2. [新增計畫註解](./plan-review-annotations/) → 學習如何精確修改計畫
3. [新增圖像標註](./plan-review-images/) → 用圖像更清晰地表達意圖
4. 然後再學習程式碼審查系列

**路徑 B：程式碼審查優先**（適合有 Code Review 經驗的開發者）
1. [程式碼審查基礎](./code-review-basics/) → 熟悉程式碼審查介面
2. [新增程式碼註解](./code-review-annotations/) → 學習行級註解
3. [切換 Diff 檢視](./code-review-diff-types/) → 掌握不同 diff 類型
4. 然後再學習計畫審查系列
:::

## 下一步

完成本章節後，你可以繼續學習：

- [URL 分享](../advanced/url-sharing/) - 透過 URL 分享計畫和註解，實現團隊協作
- [Obsidian 整合](../advanced/obsidian-integration/) - 將批准的計畫自動儲存到 Obsidian
- [遠端模式](../advanced/remote-mode/) - 在 SSH、devcontainer、WSL 環境中使用 Plannotator
