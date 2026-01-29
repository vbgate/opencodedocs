---
title: "平台功能: AI 额度查询 | opencode-mystatus"
sidebarTitle: "平台功能"
subtitle: "平台功能: AI 额度查询"
description: "学习 opencode-mystatus 支持的 AI 平台额度查询功能。涵盖 OpenAI、智證 AI、GitHub Copilot 和 Google Cloud 四大平台。"
order: 2
---

# 平台功能

本章節詳細介紹 opencode-mystatus 支援的各個 AI 平台的額度查詢功能。

## 支援的平台

opencode-mystatus 支援以下 4 個主流 AI 平台：

| 平台 | 限額類型 | 特點 |
|--- | --- | ---|
| OpenAI | 3 小時 / 24 小時滑動視窗 | 支援 Plus、Team、Pro 訂閱 |
| 智證 AI | 5 小時 Token / MCP 月度配額 | 支援 Coding Plan |
| GitHub Copilot | 月度配額 | 顯示 Premium Requests 使用量 |
| Google Cloud | 按模型獨立計算 | 支援多帳號、4 個模型 |

## 平台詳解

### [OpenAI 額度](./openai-usage/)

深入瞭解 OpenAI 的額度查詢機制：

- 3 小時和 24 小時滑動視窗的區別
- Team 帳號的額度共用機制
- JWT Token 解析取得帳號資訊

### [智證 AI 額度](./zhipu-usage/)

瞭解智證 AI 和 Z.ai 的額度查詢：

- 5 小時 Token 限額的計算方式
- MCP 月度配額的用途
- API Key 脫敏顯示

### [GitHub Copilot 額度](./copilot-usage/)

掌握 GitHub Copilot 的額度管理：

- Premium Requests 的含義
- 不同訂閱類型的配額差異
- 月度重置時間計算

### [Google Cloud 額度](./google-usage/)

學習 Google Cloud 多帳號額度查詢：

- 4 個模型（G3 Pro、G3 Image、G3 Flash、Claude）的區別
- 多帳號管理和切換
- 認證檔案讀取機制

## 選擇指南

根據你使用的平台，選擇對應的教學：

- **只用 OpenAI**：直接看 [OpenAI 額度](./openai-usage/)
- **只用智證 AI**：直接看 [智證 AI 額度](./zhipu-usage/)
- **多平台使用者**：建議按順序閱讀所有平台教學
- **Google Cloud 使用者**：需要先安裝 [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) 外掛

## 下一步

完成本章節後，可以繼續學習 [進階功能](../advanced/)，瞭解更多設定選項。
