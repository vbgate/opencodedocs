---
title: "快速開始: Antigravity Auth 安裝配置 | OpenCode"
sidebarTitle: "10 分鐘跑起來"
subtitle: "快速開始: Antigravity Auth 安裝配置"
description: "學習 Antigravity Auth 外掛的安裝和配置方法。在 10 分鐘內完成 Google OAuth 認證，發送第一個模型請求，驗證 Claude 和 Gemini 模型存取是否成功。"
order: 1
---

# 快速開始

本章節協助你從零開始使用 Antigravity Auth 外掛。你將了解外掛的核心價值，完成安裝和 OAuth 認證，並發送第一個模型請求驗證配置是否成功。

## 學習路徑

按以下順序學習，每一步都建立在前一步的基礎上：

### 1. [外掛介紹](./what-is-antigravity-auth/)

了解 Antigravity Auth 外掛的核心價值、適用情境和風險提示。

- 判斷外掛是否適合你的使用情境
- 了解支援的 AI 模型（Claude Opus 4.5、Sonnet 4.5、Gemini 3 Pro/Flash）
- 明確使用風險和注意事項

### 2. [快速安裝](./quick-install/)

5 分鐘快速完成外掛安裝和首次認證。

- 兩種安裝方式（AI 輔助 / 手動配置）
- 配置模型定義
- 執行 Google OAuth 認證

### 3. [OAuth 2.0 PKCE 認證](./first-auth-login/)

理解 OAuth 2.0 PKCE 認證流程，完成首次登入。

- 理解 PKCE 認證的安全機制
- 完成首次登入取得 API 存取權限
- 了解權杖更新的自動化處理

### 4. [第一個請求](./first-request/)

發起第一個模型請求，驗證安裝成功。

- 發送第一個 Antigravity 模型請求
- 理解 `--model` 和 `--variant` 參數
- 排查常見的模型請求錯誤

## 前置條件

開始本章節前，請確認：

- ✅ 已安裝 OpenCode CLI（`opencode` 指令可用）
- ✅ 有可用的 Google 帳戶（用於 OAuth 認證）

## 下一步

完成快速開始後，你可以：

- **[了解可用模型](../platforms/available-models/)** — 探索所有支援的模型及其變體配置
- **[配置多帳戶](../advanced/multi-account-setup/)** — 設定多個 Google 帳戶實現配額池化
- **[常見認證問題](../faq/common-auth-issues/)** — 遇到問題時查閱疑難排解指南
