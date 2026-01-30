---
title: "事件類型說明：了解 OpenCode 通知觸發時機 | opencode-notify"
sidebarTitle: "通知什麼時候發"
subtitle: "事件類型說明：了解 OpenCode 通知觸發時機"
description: "學習 opencode-notify 外掛監聽的 OpenCode 事件類型，掌握 session.idle、session.error、permission.updated 和 tool.execute.before 的觸發條件和過濾規則。"
tags:
  - "附錄"
  - "事件類型"
  - "OpenCode"
prerequisite: []
order: 130
---

# 事件類型說明：了解 OpenCode 通知觸發時機

本頁列出 `opencode-notify` 外掛監聽的 **OpenCode 事件類型** 及其觸發條件。外掛監聽四種事件：session.idle、session.error、permission.updated 和 tool.execute.before。了解這些事件的觸發時機和過濾規則，有助於更好地設定通知行為。

## 事件類型概覽

| 事件類型 | 觸發時機 | 通知標題 | 預設音效 | 是否檢查父工作階段 | 是否檢查終端機焦點 |
| --- | --- | --- | --- | --- | --- |
| `session.idle` | AI 工作階段進入閒置狀態 | "Ready for review" | Glass | ✅ | ✅ |
| `session.error` | AI 工作階段執行出錯 | "Something went wrong" | Basso | ✅ | ✅ |
| `permission.updated` | AI 需要使用者授權 | "Waiting for you" | Submarine | ❌ | ✅ |
| `tool.execute.before` | AI 詢問問題（question 工具） | "Question for you" | Submarine* | ❌ | ❌ |

> *註：question 事件預設使用 permission 音效，可透過設定自訂

## 事件詳細說明

### session.idle

**觸發條件**：AI 工作階段完成任務後進入閒置狀態

**通知內容**：
- 標題：`Ready for review`
- 訊息：工作階段標題（最多 50 字元）

**處理邏輯**：
1. 檢查是否為父工作階段（`notifyChildSessions=false` 時）
2. 檢查是否在靜音時段
3. 檢查終端機是否聚焦（聚焦時抑制通知）
4. 發送原生通知

**原始碼位置**：`src/notify.ts:249-284`

---

### session.error

**觸發條件**：AI 工作階段執行過程中出錯

**通知內容**：
- 標題：`Something went wrong`
- 訊息：錯誤摘要（最多 100 字元）

**處理邏輯**：
1. 檢查是否為父工作階段（`notifyChildSessions=false` 時）
2. 檢查是否在靜音時段
3. 檢查終端機是否聚焦（聚焦時抑制通知）
4. 發送原生通知

**原始碼位置**：`src/notify.ts:286-313`

---

### permission.updated

**觸發條件**：AI 需要使用者授權執行某操作

**通知內容**：
- 標題：`Waiting for you`
- 訊息：`OpenCode needs your input`

**處理邏輯**：
1. **不檢查父工作階段**（權限請求始終需要人工處理）
2. 檢查是否在靜音時段
3. 檢查終端機是否聚焦（聚焦時抑制通知）
4. 發送原生通知

**原始碼位置**：`src/notify.ts:315-334`

---

### tool.execute.before

**觸發條件**：AI 執行工具前，工具名稱為 `question` 時

**通知內容**：
- 標題：`Question for you`
- 訊息：`OpenCode needs your input`

**處理邏輯**：
1. **不檢查父工作階段**
2. **不檢查終端機焦點**（支援 tmux 工作流程）
3. 檢查是否在靜音時段
4. 發送原生通知

**特殊說明**：此事件不做焦點偵測，以便在 tmux 多視窗工作流程中正常收到通知。

**原始碼位置**：`src/notify.ts:336-351`

## 觸發條件和過濾規則

### 父工作階段檢查

預設情況下，外掛只通知父工作階段（根工作階段），避免子任務產生大量通知。

**檢查邏輯**：
- 透過 `client.session.get()` 取得工作階段資訊
- 如果工作階段有 `parentID`，則跳過通知

**設定選項**：
- `notifyChildSessions: false`（預設）- 只通知父工作階段
- `notifyChildSessions: true` - 通知所有工作階段

**適用事件**：
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ❌（不檢查）
- `tool.execute.before` ❌（不檢查）

### 靜音時段檢查

在設定的靜音時段內，不發送任何通知。

**檢查邏輯**：
- 讀取 `quietHours.enabled`、`quietHours.start`、`quietHours.end`
- 支援跨午夜時段（如 22:00-08:00）

**適用事件**：
- 所有事件 ✅

### 終端機焦點檢查

當使用者正在查看終端機時，抑制通知，避免重複提醒。

**檢查邏輯**：
- macOS：透過 `osascript` 取得前景應用程式名稱
- 比較 `frontmostApp` 與終端機 `processName`

**適用事件**：
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ✅
- `tool.execute.before` ❌（不檢查，支援 tmux）

## 平台差異

| 功能 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| 原生通知 | ✅ | ✅ | ✅ |
| 終端機焦點偵測 | ✅ | ❌ | ❌ |
| 點擊通知聚焦終端機 | ✅ | ❌ | ❌ |
| 自訂音效 | ✅ | ❌ | ❌ |

## 設定影響

通知行為可透過設定檔自訂：

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**相關教學**：
- [設定參考](../../advanced/config-reference/)
- [靜音時段詳解](../../advanced/quiet-hours/)

---

## 下一課預告

> 下一課我們學習 **[設定檔範例](../config-file-example/)**。
>
> 你會學到：
> - 完整的設定檔範本
> - 所有設定欄位的詳細註解
> - 設定檔的預設值說明

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 事件類型 | 檔案路徑 | 行號 | 處理函式 |
| --- | --- | --- | --- |
| session.idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 | `handleSessionIdle` |
| session.error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 | `handleSessionError` |
| permission.updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 | `handlePermissionUpdated` |
| tool.execute.before | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 | `handleQuestionAsked` |
| 事件監聽器設定 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L367-L402) | 367-402 | `NotifyPlugin` |

**關鍵常數**：
- `DEFAULT_CONFIG` (L56-68)：預設設定，包含音效和靜音時段設定
- `TERMINAL_PROCESS_NAMES` (L71-84)：終端機名稱到 macOS 程序名的對應

**關鍵函式**：
- `sendNotification()` (L227-243)：發送原生通知，處理 macOS 聚焦功能
- `isParentSession()` (L205-214)：檢查是否為父工作階段
- `isQuietHours()` (L181-199)：檢查是否在靜音時段
- `isTerminalFocused()` (L166-175)：檢查終端機是否聚焦（僅 macOS）

</details>
