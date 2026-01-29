---
title: "快速開始: 安裝持久化記憶外掛 | opencode-supermemory"
sidebarTitle: "快速開始"
subtitle: "快速開始: 安裝持久化記憶外掛"
description: "學習 opencode-supermemory 的安裝和配置方法。在 10 分鐘內完成設定，讓 Agent 具備持久化記憶能力，自動記住專案架構和偏好設定。"
order: 1
---

# 快速開始

本章節幫助你從零開始安裝和配置 opencode-supermemory 外掛，讓你的 OpenCode Agent 具備持久化記憶能力。完成本章後，Agent 將能夠記住專案架構和你的偏好設定。

## 本章內容

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">快速開始：安裝與配置</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">安裝外掛、配置 API Key、解決外掛衝突，讓 Agent 連接雲端記憶庫。</p>
</a>

<a href="./initialization/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">專案初始化：建立第一印象</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">使用 /supermemory-init 指令讓 Agent 深度掃描程式碼庫，自動記住專案架構和規範。</p>
</a>

</div>

## 學習路徑

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. 快速開始          2. 專案初始化                             │
│   ─────────────   →   ─────────────                             │
│   安裝外掛              讓 Agent 記住                            │
│   配置 API Key          專案架構                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**建議按順序學習**：

1. **[快速開始](./getting-started/)**：先完成外掛安裝和 API Key 配置，這是使用所有功能的前提。
2. **[專案初始化](./initialization/)**：安裝完成後，執行初始化指令讓 Agent 熟悉你的專案。

## 前置條件

開始本章學習前，請確保：

- ✅ 已安裝 [OpenCode](https://opencode.ai)，且 `opencode` 指令在終端機可用
- ✅ 已註冊 [Supermemory](https://console.supermemory.ai) 帳號並取得 API Key

## 下一步

完成本章後，你可以繼續學習：

- **[核心功能](../core/)**：深入理解上下文注入機制、工具集使用和記憶管理
- **[進階配置](../advanced/)**：自訂壓縮閾值、關鍵詞觸發規則等進階設定
