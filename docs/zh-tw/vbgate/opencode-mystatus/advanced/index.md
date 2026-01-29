---
title: "進階功能: 客製化設定 | opencode-mystatus"
sidebarTitle: "進階功能"
subtitle: "進階功能: 客製化設定"
description: "學習 opencode-mystatus 的進階設定方法。掌握多帳號管理、Copilot 認證和多語言支援等客製化功能。"
order: 3
---

# 進階功能

本章節介紹 opencode-mystatus 的進階設定選項，適合需要更多客製化的使用者。

## 功能列表

### [Google Cloud 設定](./google-setup/)

設定和管理多個 Google Cloud Antigravity 帳號：

- 新增多個 Google Cloud 帳號
- 4 個模型（G3 Pro、G3 Image、G3 Flash、Claude）的映射關係
- projectId 和 managedProjectId 的區別
- 解決單帳號模型額度不足的問題

### [Copilot 認證設定](./copilot-auth/)

解決 GitHub Copilot 認證問題：

- OAuth Token 和 Fine-grained PAT 的區別
- 解決 OAuth Token 權限不足的問題
- 建立 Fine-grained PAT 並設定訂閱類型
- 設定 `copilot-quota-token.json` 檔案

### [多語言支援](./i18n-setup/)

瞭解自動語言偵測機制：

- 系統語言自動偵測原理
- Intl API 和環境變數回退機制
- 如何切換輸出語言（中文/英文）

## 適用場景

| 場景 | 推薦教學 |
|--- | ---|
| 使用多個 Google 帳號 | [Google Cloud 設定](./google-setup/) |
| Copilot 額度查詢失敗 | [Copilot 認證設定](./copilot-auth/) |
| 想切換輸出語言 | [多語言支援](./i18n-setup/) |

## 前置條件

學習本章節前，建議先完成：

- [快速開始](../start/) - 完成外掛安裝
- [平台功能](../platforms/) - 瞭解各平台基礎用法

## 下一步

遇到問題？查看 [常見問題](../faq/) 獲得幫助。
