---
title: "核心功能: 三大能力 | opencode-dcp"
sidebarTitle: "解鎖三大能力"
subtitle: "核心功能: 三大能力"
description: "學習 opencode-dcp 的三大核心功能：自動修剪策略、LLM 驅動工具和 Slash 指令。掌握這些功能，充分發揮 Token 最佳化潛力。"
order: 20
---

# 核心功能

本章節深入講解 DCP 的三大核心能力：自動修剪策略、LLM 驅動工具和 Slash 指令。掌握這些功能後，您就能充分發揮 DCP 的 Token 最佳化潛力。

## 本章內容

<div class="grid-cards">

### [自動修剪策略](./auto-pruning/)

深入理解 DCP 的三種自動策略如何運作：去重策略、覆蓋寫入策略和清除錯誤策略。了解每種策略的觸發條件和適用情境。

### [LLM 驅動修剪工具](./llm-tools/)

理解 AI 如何自主呼叫 `discard` 和 `extract` 工具來最佳化上下文。這是 DCP 最智慧的功能，讓 AI 主動參與上下文管理。

### [Slash 指令使用](./commands/)

掌握所有 DCP 指令的用法：`/dcp context` 檢視上下文狀態、`/dcp stats` 檢視統計資料、`/dcp sweep` 手動觸發修剪。

</div>

## 學習路徑

建議按以下順序學習本章內容：

```
自動修剪策略 → LLM 驅動工具 → Slash 指令
     ↓              ↓            ↓
   理解原理      掌握智慧修剪    學會監控和除錯
```

1. **先學自動修剪策略**：這是 DCP 的基礎，理解三種策略的運作原理
2. **再學 LLM 驅動工具**：在理解自動策略後，學習更進階的 AI 主動修剪能力
3. **最後學 Slash 指令**：掌握監控和手動控制的方法，方便除錯和最佳化

::: tip 前置條件
學習本章前，請確保已完成：
- [安裝與快速開始](../start/getting-started/) - 完成 DCP 外掛安裝
- [設定全解](../start/configuration/) - 了解設定系統的基本概念
:::

## 下一步

完成本章學習後，您可以繼續探索：

- **[保護機制](../advanced/protection/)** - 學習如何保護關鍵內容不被誤修剪
- **[狀態持久化](../advanced/state-persistence/)** - 了解 DCP 如何跨工作階段保留狀態
- **[Prompt 快取影響](../advanced/prompt-caching/)** - 理解 DCP 與 Prompt Caching 的權衡
