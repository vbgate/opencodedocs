---
title: "快速開始: 安裝配置與效果驗證 | OpenCode DCP"
sidebarTitle: "快速開始"
subtitle: "快速開始: 安裝配置與效果驗證"
description: "學習從零開始使用 OpenCode DCP 外掛。完成安裝配置，5 分鐘內看到 Token 節省效果，並掌握多層級配置系統的使用方法。"
order: 1
---

# 快速開始

本章節幫助你從零開始使用 DCP 外掛。你將學會安裝外掛、驗證效果，並根據需求自訂配置。

## 本章內容

<div class="vp-card-container">

<a href="./getting-started/" class="vp-card">
  <h3>安裝與快速開始</h3>
  <p>5 分鐘完成 DCP 外掛安裝，立即看到 Token 節省效果。學習使用 /dcp 指令監控修剪統計。</p>
</a>

<a href="./configuration/" class="vp-card">
  <h3>配置全解</h3>
  <p>掌握三級配置系統（全域、環境變數、專案級），理解配置優先順序，按需調整修剪策略和保護機制。</p>
</a>

</div>

## 學習路徑

```
安裝與快速開始 → 配置全解
     ↓              ↓
   外掛能用了    知道怎麼調了
```

**推薦順序**：

1. **先完成 [安裝與快速開始](./getting-started/)**：確保外掛正常運作，體驗預設修剪效果
2. **再學習 [配置全解](./configuration/)**：根據專案需求自訂修剪策略

::: tip 新手建議
如果你是第一次使用 DCP，建議先用預設配置跑一段時間，觀察修剪效果後再調整配置。
:::

## 前置條件

開始本章學習前，請確認：

- [x] 已安裝 **OpenCode**（支援外掛功能的版本）
- [x] 了解基本的 **JSONC 語法**（支援註解的 JSON）
- [x] 知道如何編輯 **OpenCode 配置檔案**

## 下一步

完成本章後，你可以繼續學習：

- **[自動修剪策略詳解](../platforms/auto-pruning/)**：深入理解去重、覆蓋寫入、清除錯誤三種策略的工作原理
- **[LLM 驅動修剪工具](../platforms/llm-tools/)**：了解 AI 如何主動呼叫 discard 和 extract 工具優化上下文
- **[Slash 指令使用](../platforms/commands/)**：掌握 /dcp context、/dcp stats、/dcp sweep 等指令的用法

<style>
.vp-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.vp-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.vp-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vp-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vp-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
