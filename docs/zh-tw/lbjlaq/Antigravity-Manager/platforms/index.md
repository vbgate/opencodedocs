---
title: "平台整合：多種協定接入 | Antigravity-Manager"
sidebarTitle: "接入你的 AI 平台"
subtitle: "平台整合：多種協定接入"
description: "學習 Antigravity Tools 的平台協定接入方法。支援 OpenAI、Anthropic、Gemini 等 7 種協定的統一 API 閘道轉換。"
order: 200
---

# 平台與整合

Antigravity Tools 的核心能力是把多家 AI 平台的協定轉換為統一的本地 API 閘道。本章節詳細介紹每種協定的接入方式、相容邊界和最佳實踐。

## 本章包含

| 教程 | 說明 |
|--- | ---|
| [OpenAI 相容 API](./openai/) | `/v1/chat/completions` 與 `/v1/responses` 的落地方案，讓 OpenAI SDK 無感接入 |
| [Anthropic 相容 API](./anthropic/) | `/v1/messages` 與 Claude Code 的關鍵契約，支撐思維鏈、系統提示詞等核心能力 |
| [Gemini 原生 API](./gemini/) | `/v1beta/models` 以及 Google SDK 的端點接入，支援 `x-goog-api-key` 相容 |
| [Imagen 3 圖片生成](./imagen/) | OpenAI Images 參數 `size`/`quality` 的自動映射，支援任意寬高比 |
| [音訊轉錄](./audio/) | `/v1/audio/transcriptions` 的限制與大封包處理 |
| [MCP 端點](./mcp/) | 把 Web Search/Reader/Vision 作為可呼叫工具暴露出去 |
| [Cloudflared 隧道](./cloudflared/) | 一鍵把本地 API 安全暴露到公網（並非預設安全） |

## 學習路徑建議

::: tip 推薦順序
1. **先學你要用的協定**：如果你用 Claude Code，先看 [Anthropic 相容 API](./anthropic/)；如果用 OpenAI SDK，先看 [OpenAI 相容 API](./openai/)
2. **再學 Gemini 原生**：了解 Google SDK 的直接接入方式
3. **按需學習擴充功能**：圖片生成、音訊轉錄、MCP 工具
4. **最後學隧道**：需要公網暴露時再看 [Cloudflared 隧道](./cloudflared/)
:::

**快速選擇**：

| 你的場景 | 推薦先看 |
|--- | ---|
| 使用 Claude Code CLI | [Anthropic 相容 API](./anthropic/) |
| 使用 OpenAI Python SDK | [OpenAI 相容 API](./openai/) |
| 使用 Google 官方 SDK | [Gemini 原生 API](./gemini/) |
| 需要 AI 畫圖 | [Imagen 3 圖片生成](./imagen/) |
| 需要語音轉文字 | [音訊轉錄](./audio/) |
| 需要聯網搜尋/網頁閱讀 | [MCP 端點](./mcp/) |
| 需要遠端存取 | [Cloudflared 隧道](./cloudflared/) |

## 前置條件

::: warning 開始前請確認
- 已完成 [安裝與升級](../start/installation/)
- 已完成 [新增帳號](../start/add-account/)
- 已完成 [啟動本地反代](../start/proxy-and-first-client/)（至少能存取 `/healthz`）
:::

## 下一步

學完本章節後，你可以繼續學習：

- [進階設定](../advanced/)：模型路由、配額治理、高可用排程等進階功能
- [常見問題](../faq/)：遇到 401/404/429 等錯誤時的排查指南
