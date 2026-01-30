---
title: "opencode-notify 附錄：事件類型與設定檔完全參考 | 教學"
sidebarTitle: "查閱設定和事件"
subtitle: "附錄：事件類型與設定參考"
description: "查閱 opencode-notify 外掛的事件類型說明和設定檔範例。本教學列出四種 OpenCode 事件類型及觸發條件，詳細說明每個事件的過濾規則和平台差異，提供完整設定檔範本、所有設定欄位的詳細註解、預設值設定、最小化設定範例、停用外掛的方法以及 macOS 可用音效完整列表。"
order: 5
---

# 附錄：事件類型與設定參考

本節提供參考文件和設定範例，幫助你深入理解 opencode-notify 的事件類型和設定選項。這些內容適合作為查閱資料，不需要按順序學習。

## 學習路徑

### 1. [事件類型說明](./event-types/)

了解外掛監聽的 OpenCode 事件類型及其觸發條件。

- 四種事件類型（session.idle、session.error、permission.updated、tool.execute.before）
- 每種事件的觸發時機和處理邏輯
- 父會話檢查、靜音時段檢查、終端機焦點檢查的過濾規則
- 不同平台的功能差異

### 2. [設定檔範例](./config-file-example/)

查看完整的設定檔範例和所有欄位的詳細註解。

- 完整設定檔範本
- notifyChildSessions、sounds、quietHours、terminal 等欄位說明
- macOS 可用音效完整列表
- 最小化設定範例
- 停用外掛的方法

## 前置條件

::: tip 學習建議

本節是參考文件，可以在需要時查閱。建議在完成以下基礎教學後再來參考本節內容：

- [快速開始](../../start/quick-start/) - 完成安裝和初步設定
- [工作原理](../../start/how-it-works/) - 了解外掛的核心機制

:::

## 下一步

學完附錄內容後，你可以：

- 查看 [更新日誌](../changelog/release-notes/) 了解版本歷史和新功能
- 返回 [設定參考](../../advanced/config-reference/) 深入學習進階設定選項
- 瀏覽 [常見問題](../../faq/common-questions/) 查找答案
