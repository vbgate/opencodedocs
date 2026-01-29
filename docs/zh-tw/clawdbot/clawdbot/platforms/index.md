---
title: "多管道與平台 | Clawdbot 教學"
sidebarTitle: "接入常用通訊工具"
subtitle: "多管道與平台"
description: "學習如何設定和使用 Clawdbot 的多管道系統，包括 WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、LINE、WebChat、macOS、iOS 和 Android 平台。"
tags:
  - "channels"
  - "platforms"
  - "integration"
order: 60
---

# 多管道與平台

Clawdbot 透過統一的 Gateway 控制平面，支援多種通訊管道和平台，讓你在熟悉的介面上與 AI 助理互動。

## 章節概述

本章節介紹 Clawdbot 支援的所有通訊管道和平台，包括即時通訊應用（WhatsApp、Telegram、Slack、Discord 等）、行動端節點（iOS、Android）和桌面應用（macOS）。學習如何設定這些管道，讓 AI 助理無縫融入你的日常工作流程。

## 子頁面導覽

### 管道概覽

- **[多管道系統概覽](channels-overview/)** - 了解 Clawdbot 支援的所有通訊管道及其特點，掌握管道設定的基本概念。

### 即時通訊管道

- **[WhatsApp](whatsapp/)** - 設定和使用 WhatsApp 管道（基於 Baileys），支援裝置連結和群組管理。
- **[Telegram](telegram/)** - 設定和使用 Telegram 管道（基於 grammY Bot API），設定 Bot Token 和 Webhook。
- **[Slack](slack/)** - 設定和使用 Slack 管道（基於 Bolt），整合到你的工作空間。
- **[Discord](discord/)** - 設定和使用 Discord 管道（基於 discord.js），支援伺服器和頻道。
- **[Google Chat](googlechat/)** - 設定和使用 Google Chat 管道，與 Google Workspace 整合。
- **[Signal](signal/)** - 設定和使用 Signal 管道（基於 signal-cli），保護隱私的通訊。
- **[iMessage](imessage/)** - 設定和使用 iMessage 管道（macOS 專屬），與 macOS 訊息應用整合。
- **[LINE](line/)** - 設定和使用 LINE 管道（Messaging API），與 LINE 使用者互動。

### Web 與原生應用

- **[WebChat 介面](webchat/)** - 使用內建的 WebChat 介面與 AI 助理互動，無需設定外部管道。
- **[macOS 應用](macos-app/)** - 了解 macOS 選單列應用的功能，包括 Voice Wake、Talk Mode 和遠端控制。
- **[iOS 節點](ios-node/)** - 設定 iOS 節點以執行裝置本地操作（Camera、Canvas、Voice Wake）。
- **[Android 節點](android-node/)** - 設定 Android 節點以執行裝置本地操作（Camera、Canvas）。

## 學習路徑建議

根據你的使用場景，推薦以下學習順序：

### 新手快速上手

如果你是第一次使用 Clawdbot，建議按照以下順序學習：

1. **[多管道系統概覽](channels-overview/)** - 先了解整體架構和管道概念
2. **[WebChat 介面](webchat/)** - 最簡單的方式，無需任何設定即可開始使用
3. **選擇一個常用管道** - 根據你的日常習慣選擇：
   - 日常聊天 → [WhatsApp](whatsapp/) 或 [Telegram](telegram/)
   - 團隊協作 → [Slack](slack/) 或 [Discord](discord/)
   - macOS 使用者 → [iMessage](imessage/)

### 行動端整合

如果你想在手機上使用 Clawdbot：

1. **[iOS 節點](ios-node/)** - 設定 iPhone/iPad 上的本地功能
2. **[Android 節點](android-node/)** - 設定 Android 裝置上的本地功能
3. **[macOS 應用](macos-app/)** - 使用 macOS 應用作為控制中心

### 企業級部署

如果你需要在團隊環境中部署：

1. **[Slack](slack/)** - 與團隊工作空間整合
2. **[Discord](discord/)** - 建立社群伺服器
3. **[Google Chat](googlechat/)** - 與 Google Workspace 整合

## 前置條件

在開始學習本章節之前，建議先完成：

- **[快速開始](../start/getting-started/)** - 完成 Clawdbot 的安裝和基礎設定
- **[精靈式設定](../start/onboarding-wizard/)** - 透過精靈完成 Gateway 和管道的基礎設定

::: tip 提示
如果你已經完成了精靈式設定，一些管道可能已經自動設定好了。可以跳過重複的設定步驟，直接查看特定管道的進階功能。
:::

## 下一步指引

完成本章節的學習後，你可以繼續探索：

- **[AI 模型與驗證設定](../advanced/models-auth/)** - 設定不同的 AI 模型提供商
- **[工作階段管理與多 Agent](../advanced/session-management/)** - 學習工作階段隔離和子 Agent 協作
- **[工具系統](../advanced/tools-browser/)** - 使用瀏覽器自動化、命令執行等工具

## 常見問題

::: details 我可以同時使用多個管道嗎？
是的！Clawdbot 支援同時啟用多個管道。你可以在不同管道上接收和傳送訊息，所有訊息都透過統一的 Gateway 處理。
:::

::: details 哪個管道最推薦？
這取決於你的使用場景：
- **WebChat** - 最簡單，無需任何設定
- **WhatsApp** - 適合與朋友和家人聊天
- **Telegram** - Bot API 穩定，適合自動回覆
- **Slack/Discord** - 適合團隊協作
:::

::: details 設定管道需要付費嗎？
大多數管道本身是免費的，但部分管道可能有成本：
- WhatsApp Business API - 可能產生費用
- Google Chat - 需要 Google Workspace 帳戶
- 其他管道 - 通常免費，只需申請 Bot Token
:::
