---
title: "設定檔範例：notifyChildSessions 和 sounds 說明 | opencode-notify 教學"
sidebarTitle: "自訂設定檔"
subtitle: "設定檔範例：notifyChildSessions 和 sounds 說明"
description: "查看 opencode-notify 完整的設定檔範例，學習 notifyChildSessions、sounds、quietHours、terminal 等所有設定欄位的詳細註解、預設值設定、最小化設定範例、macOS 可用音效完整清單和停用外掛方法，並連結到更新日誌以了解版本歷史和新功能改進。"
tags:
  - "設定"
  - "範例"
  - "附錄"
order: 140
---

# 設定檔範例

## 完整設定範例

將以下內容儲存到 `~/.config/opencode/kdco-notify.json`：

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
  },
  "terminal": "Ghostty"
}
```

## 欄位說明

### notifyChildSessions

- **型別**：boolean
- **預設值**：`false`
- **說明**：是否通知子工作階段（子任務）

預設情況下，外掛只通知父工作階段，避免子任務帶來的通知干擾。如果你需要追蹤所有子任務的完成狀態，設定為 `true`。

```json
{
  "notifyChildSessions": false  // 只通知父工作階段（推薦）
}
```

### sounds

音效設定，只在 macOS 平台生效。

#### sounds.idle

- **型別**：string
- **預設值**：`"Glass"`
- **說明**：任務完成時的音效

當 AI 工作階段進入閒置狀態（任務完成）時播放。

#### sounds.error

- **型別**：string
- **預設值**：`"Basso"`
- **說明**：出錯時的音效

當 AI 工作階段執行出錯時播放。

#### sounds.permission

- **型別**：string
- **預設值**：`"Submarine"`
- **說明**：權限請求時的音效

當 AI 需要使用者授權執行某操作時播放。

#### sounds.question

- **型別**：string（選用）
- **預設值**：未設定（使用 permission 音效）
- **說明**：問題詢問時的音效

當 AI 向使用者提問時播放。如果不設定，會使用 `permission` 音效。

### quietHours

靜音時段設定，避免在指定時間段內收到通知打擾。

#### quietHours.enabled

- **型別**：boolean
- **預設值**：`false`
- **說明**：是否啟用靜音時段

#### quietHours.start

- **型別**：string
- **預設值**：`"22:00"`
- **說明**：靜音開始時間（24 小時制，HH:MM 格式）

#### quietHours.end

- **型別**：string
- **預設值**：`"08:00"`
- **說明**：靜音結束時間（24 小時制，HH:MM 格式）

支援跨午夜時段，例如 `"22:00"` 到 `"08:00"` 表示晚上 10 點到次日早上 8 點不發送通知。

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### terminal

- **型別**：string（選用）
- **預設值**：未設定（自動偵測）
- **說明**：手動指定終端機類型，覆蓋自動偵測結果

如果自動偵測失敗或需要手動指定，可以設定為你的終端機名稱。

```json
{
  "terminal": "Ghostty"  // 或 "iTerm"、"Kitty"、"WezTerm" 等
}
```

## macOS 可用音效清單

以下是 macOS 系統內建的通知音效，可用於 `sounds` 設定：

- Basso
- Blow
- Bottle
- Frog
- Funk
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## 最小化設定範例

如果你只想修改少量設定，可以只包含需要修改的欄位，其他欄位會使用預設值：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## 停用外掛

要暫時停用外掛，刪除設定檔即可，外掛會恢復到預設設定。

## 下一課預告

> 下一課我們學習 **[更新日誌](../changelog/release-notes/)**。
>
> 你會了解：
> - 版本歷史和重要變更
> - 新功能和改進記錄
