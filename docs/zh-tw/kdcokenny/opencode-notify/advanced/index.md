---
title: "進階使用：深入設定與最佳化 | opencode-notify教學"
sidebarTitle: "打造你的通知體驗"
subtitle: "進階使用：深入設定與最佳化"
description: "學習 opencode-notify 進階設定：設定參考、靜音時段、終端機偵測和最佳實踐。依據個人需求最佳化通知體驗，提升工作效率。"
tags:
  - "進階"
  - "設定"
  - "最佳化"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 3
---

# 進階使用：深入設定與最佳化

本章節協助你掌握 opencode-notify 的進階功能，深入了解設定選項、最佳化通知體驗，並依據個人需求打造通知行為。

## 學習路徑

建議依以下順序學習本章節內容：

### 1. [設定參考](./config-reference/)

全面了解所有可用的設定選項及其作用。

- 掌握設定檔的結構和語法
- 學習通知音效的客製化方法
- 理解子會話通知開關的使用情境
- 了解終端機類型覆蓋的設定方法

### 2. [靜音時段詳解](./quiet-hours/)

學習如何設定靜音時段以避免特定時間被打擾。

- 設定靜音時段的開始與結束時間
- 處理跨夜的靜音時段（如 22:00 - 08:00）
- 在需要時暫時停用靜音功能
- 理解靜音時段與其他過濾規則的優先順序

### 3. [終端機偵測原理](./terminal-detection/)

深入了解終端機自動偵測的工作機制。

- 學習外掛如何辨識 37+ 種終端機模擬器
- 了解 macOS 平台的焦點偵測實作
- 掌握手動指定終端機類型的方法
- 理解偵測失敗時的預設行為

### 4. [進階用法](./advanced-usage/)

掌握設定技巧和最佳實踐。

- 避免通知轟炸的設定策略
- 依據工作流程調整通知行為
- 多視窗和多終端機環境下的設定建議
- 效能最佳化和問題排查技巧

## 前置條件

開始本章節學習前，建議先完成以下基礎內容：

- ✅ **快速開始**：完成外掛安裝和基本設定
- ✅ **運作原理**：理解外掛的核心功能和事件監聽機制
- ✅ **平台特性**（選用）：了解你所使用平台的特定功能

::: tip 學習建議
如果你只想客製化通知音效或設定靜音時段，可以直接跳到對應的子頁面。如果遇到問題，可以隨時查閱設定參考章節。
:::

## 下一步

完成本章節學習後，你可以繼續探索：

- **[故障排除](../../faq/troubleshooting/)**：解決常見問題和疑難雜症
- **[常見問題](../../faq/common-questions/)**：了解使用者關心的熱門問題
- **[事件類型說明](../../appendix/event-types/)**：深入學習外掛監聽的所有事件類型
- **[設定檔範例](../../appendix/config-file-example/)**：查看完整的設定範例和註解

---

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能        | 檔案路徑                                                                                    | 行號    |
| --- | --- | ---|
| 設定介面定義 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48   |
| 預設設定    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68   |
| 設定載入    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114  |
| 靜音時段檢查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| 終端機偵測    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| 終端機程序名稱映射 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84   |

**關鍵介面**：
- `NotifyConfig`：設定介面，包含所有可設定項目
- `quietHours`：靜音時段設定（enabled/start/end）
- `sounds`：音效設定（idle/error/permission）
- `terminal`：終端機類型覆蓋（選用）

**關鍵常數**：
- `DEFAULT_CONFIG`：所有設定項目的預設值
- `TERMINAL_PROCESS_NAMES`：終端機名稱到 macOS 程序名稱的映射表

</details>
