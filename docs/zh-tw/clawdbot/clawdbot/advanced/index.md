---
title: "進階功能"
sidebarTitle: "解鎖 AI 超能力"
subtitle: "進階功能"
description: "學習 Clawdbot 的高級功能設定，包括 AI 模型設定、多 Agent 協作、瀏覽器自動化、指令執行工具、Web 搜尋工具、Canvas 可視化介面、語音喚醒與 TTS、記憶系統、Cron 定時任務、技能平台、安全沙箱和遠端 Gateway。"
prerequisite:
  - "start/getting-started"
  - "start/gateway-startup"
order: 185
---

# 進階功能

## 本章概述

本章深入介紹 Clawdbot 的高級功能，幫助你充分利用 AI 助手的強大能力。從 AI 模型設定和多 Agent 協作，到瀏覽器自動化、記憶系統和語音功能，你可以根據需求選擇學習。

::: info 前置條件
學習本章前，請先完成以下內容：
- [快速開始](../../start/getting-started/)
- [啟動 Gateway](../../start/gateway-startup/)
:::

## 學習路徑

根據你的需求，可以選擇不同的學習路徑：

### 🚀 快速上手路徑（推薦新手）
1. [AI 模型與認證設定](./models-auth/) - 設定你喜歡的 AI 模型
2. [指令執行工具與審批](./tools-exec/) - 讓 AI 安全地執行指令
3. [Web 搜尋與抓取工具](./tools-web/) - 擴展 AI 的知識獲取能力

### 🤖 AI 能力擴展路徑
1. [會話管理與多 Agent](./session-management/) - 理解 AI 協作機制
2. [記憶系統與向量搜尋](./memory-system/) - 讓 AI 記住重要資訊
3. [技能平台與 ClawdHub](./skills-platform/) - 使用和分享技能包

### 🔧 自動化工具路徑
1. [瀏覽器自動化工具](./tools-browser/) - 網頁操作自動化
2. [Cron 定時任務與 Webhook](./cron-automation/) - 定時任務與事件觸發
3. [遠端 Gateway 與 Tailscale](./remote-gateway/) - 遠端存取你的 AI 助手

### 🎨 互動體驗路徑
1. [Canvas 可視化介面與 A2UI](./canvas/) - 可視化互動介面
2. [語音喚醒與文字轉語音](./voice-tts/) - 語音互動功能

### 🔒 安全與部署路徑
1. [安全與沙箱隔離](./security-sandbox/) - 深入了解安全機制
2. [遠端 Gateway 與 Tailscale](./remote-gateway/) - 安全的遠端存取

## 子頁面導航

### 核心設定

| 主題 | 描述 | 預計時間 |
|------|------|----------|
| [AI 模型與認證設定](./models-auth/) | 設定 Anthropic、OpenAI、OpenRouter、Ollama 等多種 AI 模型提供商和認證方式 | 15 分鐘 |
| [會話管理與多 Agent](./session-management/) | 學習會話模型、會話隔離、子 Agent 協作、上下文壓縮等核心概念 | 20 分鐘 |

### 工具系統

| 主題 | 描述 | 預計時間 |
|------|------|----------|
| [瀏覽器自動化工具](./tools-browser/) | 使用瀏覽器工具進行網頁自動化、截圖、操作表單等 | 25 分鐘 |
| [指令執行工具與審批](./tools-exec/) | 設定和使用 exec 工具，了解安全審批機制和權限控制 | 15 分鐘 |
| [Web 搜尋與抓取工具](./tools-web/) | 使用 web_search 和 web_fetch 工具進行網路搜尋和內容抓取 | 20 分鐘 |

### 互動體驗

| 主題 | 描述 | 預計時間 |
|------|------|----------|
| [Canvas 可視化介面與 A2UI](./canvas/) | 了解 Canvas A2UI 推送機制、可視化介面操作和自訂介面 | 20 分鐘 |
| [語音喚醒與文字轉語音](./voice-tts/) | 設定 Voice Wake、Talk Mode 和 TTS 提供商，實現語音互動 | 15 分鐘 |

### 智慧擴展

| 主題 | 描述 | 預計時間 |
|------|------|----------|
| [記憶系統與向量搜尋](./memory-system/) | 設定和使用記憶系統（SQLite-vec、FTS5、混合搜尋） | 25 分鐘 |
| [技能平台與 ClawdHub](./skills-platform/) | 了解技能系統、Bundled/Managed/Workspace 技能、ClawdHub 整合 | 20 分鐘 |

### 自動化與部署

| 主題 | 描述 | 預計時間 |
|------|------|----------|
| [Cron 定時任務與 Webhook](./cron-automation/) | 設定定時任務、Webhook 觸發、Gmail Pub/Sub 等自動化功能 | 20 分鐘 |
| [遠端 Gateway 與 Tailscale](./remote-gateway/) | 透過 Tailscale Serve/Funnel 或 SSH 隧道遠端存取 Gateway | 15 分鐘 |

### 安全機制

| 主題 | 描述 | 預計時間 |
|------|------|----------|
| [安全與沙箱隔離](./security-sandbox/) | 了解安全模型、工具權限控制、Sandbox 隔離、Docker 化部署 | 20 分鐘 |

## 下一步

完成本章學習後，你可以：

1. **深入學習** - 查看 [故障排除](../../faq/troubleshooting/) 解決遇到的問題
2. **了解部署** - 查看 [部署選項](../../appendix/deployment/) 將 Clawdbot 部署到生產環境
3. **開發擴展** - 查看 [開發指南](../../appendix/development/) 學習如何開發外掛和貢獻程式碼
4. **查看設定** - 參考 [完整設定參考](../../appendix/config-reference/) 了解所有設定選項

::: tip 學習建議
建議你根據自己的實際需求選擇學習路徑。如果不確定從哪裡開始，可以按照「快速上手路徑」逐步學習，其他主題可以在需要時再深入學習。
:::
