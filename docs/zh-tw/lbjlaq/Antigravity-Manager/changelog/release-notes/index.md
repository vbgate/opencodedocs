---
title: "發布說明：版本演進 | Antigravity-Manager"
sidebarTitle: "3 分鐘看懂版本更新"
subtitle: "版本演進：以 README 內嵌 Changelog 為準"
description: "了解 Antigravity-Manager 的版本演進方法。在 Settings 頁確認版本並檢查更新，透過 README Changelog 查看修復與提醒，用 /healthz 驗證升級後可用性。"
tags:
  - "changelog"
  - "release"
  - "upgrade"
  - "troubleshooting"
prerequisite:
  - "start-installation"
  - "start-proxy-and-first-client"
order: 1
---

# 版本演進：以 README 內嵌 Changelog 為準

你準備升級 Antigravity Tools，最怕的不是「沒更新到」，而是「更新了才發現有相容性變化」。這頁把 **Antigravity Tools Changelog（版本演進）** 的閱讀方法講清楚，讓你能在升級前就判斷：這次更新會影響你什麼。

## 學完你能做什麼

- 在 Settings 的 About 頁快速確認目前版本、檢查更新並拿到下載入口
- 在 README 的 Changelog 裡只讀對你有影響的版本段落（而不是從頭翻到尾）
- 升級前先做一件事：確認是否有「需要你手動改設定/改模型映射」的提醒
- 升級後跑一遍最小驗證（`/healthz`）確認代理還能用

## 什麼是 Changelog？

**Changelog** 是按版本記錄「這次改了什麼」的清單。Antigravity Tools 把它直接寫在 README 的「版本演進」裡，每個版本都會標出日期與關鍵變更。升級前先看 Changelog，能減少踩到相容性變化或回歸問題的機率。

## 什麼時候用這一頁

- 你準備從舊版本升級到新版本，想先確認風險點
- 你遇到某個問題（比如 429/0 Token/Cloudflared），想確認它是否在近期版本被修復
- 你在團隊裡維護統一版本，需要給同事一個「按版本讀變化」的方法

## 🎒 開始前的準備

::: warning 建議先把升級路徑準備好
安裝/升級方式很多（brew、Releases 手動下載、應用程式內更新）。如果你還沒確定自己用哪條路，先看 **[安裝與升級：桌面端最佳安裝路徑（brew / releases）](/zh-tw/lbjlaq/Antigravity-Manager/start/installation/)**。
:::

## 跟我做

### 第 1 步：在 About 頁確認你正在用的版本

**為什麼**
Changelog 是按版本組織的。你先知道自己目前版本，才知道「要從哪裡開始看」。

操作路徑：**Settings** → **About**。

**你應該看到**：頁面標題區顯示應用程式名稱與版本號（例如 `v3.3.49`）。

### 第 2 步：點「檢查更新」，拿到最新版本與下載入口

**為什麼**
你需要先知道「最新版本號是什麼」，再去 Changelog 裡挑出中間跨過的版本段落。

在 About 頁點擊「檢查更新」。

**你應該看到**：
- 若有更新：提示「new version available」，並出現一個下載按鈕（開啟 `download_url`）
- 若已是最新：提示「latest version」

### 第 3 步：去 README 的 Changelog 只看你跨過的版本

**為什麼**
你只需要關心「從你目前版本到最新版本之間」的變化，其他歷史版本可以先跳過。

開啟 README，定位到 **「版本演進 (Changelog)」**，從最新版本開始往下看，直到看到你目前版本為止。

**你應該看到**：版本按 `vX.Y.Z (YYYY-MM-DD)` 的格式列出，並且每個版本都有分組說明（如核心修復/功能增強）。

### 第 4 步：升級後做一次最小驗證

**為什麼**
升級後的第一件事不是「跑複雜場景」，而是先確認代理還能正常啟動、能被客戶端探活。

按 **[啟動本地反代並接入第一個客戶端（/healthz + SDK 設定）](/zh-tw/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** 的流程，至少驗證一次 `GET /healthz`。

**你應該看到**：`/healthz` 返回成功（用於確認服務可用）。

## 近期版本摘要（摘自 README）

| 版本 | 日期 | 你需要關注的點 |
|--- | --- | ---|
| `v3.3.49` | 2026-01-22 | Thinking 中斷與 0 Token 防禦；移除 `gemini-2.5-flash-lite` 並提醒你手動替換自訂映射；語言/主題等設定即時生效；監控看板增強；OAuth 相容性提升 |
| `v3.3.48` | 2026-01-21 | Windows 平台背景程序靜默執行（修復控制台閃爍） |
| `v3.3.47` | 2026-01-21 | 圖片生成參數映射增強（`size`/`quality`）；Cloudflared 隧道支援；修復合併衝突導致的啟動失敗；三層漸進式內容壓縮 |

::: tip 怎麼快速判斷「這次更新會不會影響我」
優先找這兩類句子：

- **使用者提醒/你需要修改**：比如明確點名某個預設模型被移除，要求你手動調整自訂映射
- **核心修復/相容性修復**：比如 0 Token、429、Windows 閃爍、啟動失敗這類「會讓你用不了」的問題
:::

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 內容 | 檔案路徑 | 行號 |
|--- | --- | ---|
| README 內嵌 Changelog（版本演進） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L324-L455) | 324-455 |
| About 頁顯示版本號與「檢查更新」按鈕 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L821-L954) | 821-954 |
| About 頁「檢查更新」指令返回結構 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L187-L215) | 187-215 |
| 自動更新通知（下載並重新啟動） | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L33-L96) | 33-96 |
| 目前版本號（建置元資料） | [`package.json`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/package.json#L1-L4) | 1-4 |

</details>
