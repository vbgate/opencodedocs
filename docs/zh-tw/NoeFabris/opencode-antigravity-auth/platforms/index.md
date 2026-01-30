---
title: "平台功能：模型與配額 | opencode-antigravity-auth"
sidebarTitle: "解鎖雙配額系統"
subtitle: "平台功能：模型與配額"
description: "了解 Antigravity Auth 的模型類型和雙配額系統。掌握模型選擇、Thinking 配置和 Google Search 方法，優化配額使用。"
order: 2
---

# 平台功能

本章節幫助你深入了解 Antigravity Auth 插件支援的模型、配額系統和平台特性。你將學會選擇合適的模型、配置 Thinking 能力、啟用 Google Search 以及最大化配額利用率。

## 前置條件

::: warning 開始前請確認
在學習本章節之前，請確保你已完成：
- [快速安裝](../../zh-tw/NoeFabris/opencode-antigravity-auth/start/quick-install/)：完成插件安裝和首次認證
- [首次請求](../../zh-tw/NoeFabris/opencode-antigravity-auth/start/first-request/)：成功發起第一個模型請求
:::

## 學習路徑

按以下順序學習，循序漸進掌握平台功能：

### 1. [可用模型](./available-models/)

了解所有可用的模型及其變體配置

- 認識 Claude Opus 4.5、Sonnet 4.5 和 Gemini 3 Pro/Flash
- 理解 Antigravity 和 Gemini CLI 兩個配額池的模型分佈
- 掌握 `--variant` 參數的使用方法

### 2. [雙配額系統](./dual-quota-system/)

理解 Antigravity 和 Gemini CLI 雙配額池的工作原理

- 了解每個帳戶如何擁有兩個獨立的 Gemini 配額池
- 啟用自動 fallback 配置，實現配額翻倍
- 顯式指定模型使用特定配額池

### 3. [Google Search Grounding](./google-search-grounding/)

為 Gemini 模型啟用 Google Search，提升事實準確性

- 讓 Gemini 能夠搜尋即時網路資訊
- 調節搜尋閾值，控制搜尋頻率
- 根據任務需求選擇合適的配置

### 4. [Thinking 模型](./thinking-models/)

掌握 Claude 和 Gemini 3 Thinking 模型的配置和使用

- 配置 Claude 的 thinking budget
- 使用 Gemini 3 的 thinking level（minimal/low/medium/high）
- 理解 interleaved thinking 和思考塊保留策略

## 下一步

完成本章節後，你可以繼續學習：

- [多帳戶配置](../advanced/multi-account-setup/)：配置多個 Google 帳戶，實現配額池化和負載平衡
- [帳戶選擇策略](../advanced/account-selection-strategies/)：掌握 sticky、round-robin、hybrid 三種策略的最佳實踐
- [配置指南](../advanced/configuration-guide/)：掌握所有配置選項，按需定制插件行為
