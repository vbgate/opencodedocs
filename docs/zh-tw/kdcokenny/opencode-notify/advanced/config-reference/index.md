---
title: "opencode-notify 設定參考：完整設定項說明與平台差異 | 教學"
sidebarTitle: "自訂通知行為"
subtitle: "設定參考：完整設定項說明"
description: "學習 opencode-notify 的完整設定項說明，包括子會話通知開關、自訂音效、靜音時段和終端類型覆蓋。本教學提供詳細的設定參數說明、預設值、平台差異和完整範例，幫你自訂通知行為，優化工作流程，掌握 macOS、Windows、Linux 的設定技巧。"
tags:
  - "設定參考"
  - "進階設定"
prerequisite:
  - "start-quick-start"
order: 70
---

# 設定參考

## 學完你能做什麼

- ✅ 了解所有可設定的參數及其含義
- ✅ 根據需求自訂通知行為
- ✅ 設定靜音時段避免特定時間打擾
- ✅ 理解平台差異對設定的影響

## 你現在的困境

預設設定已經夠用了，但你的工作流程可能比較特殊：
- 你需要在夜間也收到重要通知，但平時不想被打擾
- 你使用多會話並行工作，希望所有會話都通知
- 你在 tmux 中工作，發現焦點檢測不符合預期
- 你想知道某個設定項到底有什麼作用

## 什麼時候用這一招

- **你需要自訂通知行為** - 預設設定不滿足你的工作習慣
- **你想減少通知打擾** - 設定靜音時段或子會話開關
- **你想除錯外掛行為** - 理解每個設定項的作用
- **你在多個平台使用** - 了解平台差異對設定的影響

## 核心思路

設定檔案讓你在不修改程式碼的情況下調整外掛行為，就像給外掛「設定選單」。設定檔案是一個 JSON 格式，放在 `~/.config/opencode/kdco-notify.json`。

**設定載入流程**：

```
外掛啟動
    ↓
讀取使用者設定檔
    ↓
與預設設定合併（使用者設定優先）
    ↓
使用合併後的設定執行
```

::: info 設定檔路徑
`~/.config/opencode/kdco-notify.json`
:::

## 📋 設定項說明

### 完整設定結構

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
  "terminal": ""
}
```

### 逐項說明

#### notifyChildSessions

| 設定項 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| `notifyChildSessions` | boolean | `false` | 是否通知子會話 |

**作用**：控制是否為子會話（sub-session）發送通知。

**什麼是子會話**：
當你使用 OpenCode 的多會話功能時，會話可以分為父會話和子會話。子會話通常是父會話啟動的輔助任務，比如檔案讀寫、網路請求等。

**預設行為**（`false`）：
- 只通知父會話的完成、錯誤、權限請求事件
- 不通知子會話的任何事件
- 這樣可以避免在多任務並行時收到大量通知

**啟用後**（`true`）：
- 所有會話（父會話和子會話）都會通知
- 適合需要追蹤所有子任務進度的場景

::: tip 推薦設定
保持預設 `false`，除非你確實需要追蹤每個子任務的狀態。
:::

#### 焦點檢測（macOS）

外掛會自動檢測終端是否在前台，如果終端是當前活動視窗，則抑制通知發送，避免重複提醒。

**工作原理**：
- 使用 macOS 的 `osascript` 檢測當前前台應用
- 對比前台應用程序名與你的終端程序名
- 如果終端在前台，不發送通知
- **問題詢問通知除外**（支援 tmux 工作流）

::: info 平台差異
焦點檢測功能僅在 macOS 上生效。Windows 和 Linux 不支援此特性。
:::

#### sounds

| 設定項 | 類型 | 預設值 | 平台支援 | 說明 |
|---|---|---|---|---|
| `sounds.idle` | string | `"Glass"` | ✅ macOS | 任務完成音效 |
| `sounds.error` | string | `"Basso"` | ✅ macOS | 錯誤通知音效 |
| `sounds.permission` | string | `"Submarine"` | ✅ macOS | 權限請求音效 |
| `sounds.question` | string | 未設定 | ✅ macOS | 問題詢問音效（選用） |

**作用**：為不同類型的通知設定不同的系統音效（僅 macOS）。

**可用音效列表**：

| 音效名 | 聽感特點 | 推薦場景 |
|---|---|---|
| Glass | 輕快、清脆 | 任務完成（預設） |
| Basso | 低沉、警告 | 錯誤通知（預設） |
| Submarine | 提醒、柔和 | 權限請求（預設） |
| Blow | 強勁 | 重要事件 |
| Bottle | 清脆 | 子任務完成 |
| Frog | 輕鬆 | 非正式提醒 |
| Funk | 節奏感 | 多任務完成 |
| Hero | 宏偉 | 里程碑完成 |
| Morse | 摩斯電碼 | 除錯相關 |
| Ping | 清脆 | 輕量級提醒 |
| Pop | 短促 | 快速任務 |
| Purr | 柔和 | 不打擾提醒 |
| Sosumi | 獨特 | 特殊事件 |
| Tink | 清亮 | 小任務完成 |

**question 欄位說明**：
`sounds.question` 是選用欄位，用於 AI 詢問問題的通知。如果未設定，會使用 `permission` 的音效。

::: tip 音效設定技巧
- 用輕快的音效表示成功（idle）
- 用低沉的音效表示錯誤（error）
- 用柔和的音效表示需要你的注意（permission、question）
- 不同音效組合讓你不看通知也能大致了解情況
:::

::: warning 平台差異
`sounds` 設定僅在 macOS 上有效。Windows 和 Linux 會使用系統預設通知聲音，無法自訂。
:::

#### quietHours

| 設定項 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| `quietHours.enabled` | boolean | `false` | 是否啟用靜音時段 |
| `quietHours.start` | string | `"22:00"` | 靜音開始時間（HH:MM 格式） |
| `quietHours.end` | string | `"08:00"` | 靜音結束時間（HH:MM 格式） |

**作用**：在指定時間段內抑制所有通知的發送。

**預設行為**（`enabled: false`）：
- 不啟用靜音時段
- 任何時間都可能收到通知

**啟用後**（`enabled: true`）：
- 在 `start` 到 `end` 時間段內，不發送任何通知
- 支援跨午夜時段（如 22:00-08:00）

**時間格式**：
- 使用 24 小時制的 `HH:MM` 格式
- 範例：`"22:30"` 表示晚上 10 點 30 分

**跨午夜時段**：
- 如果 `start > end`（如 22:00-08:00），表示跨午夜
- 從晚上 22:00 到次日早上 08:00 都在靜音時段內

::: info 靜音時段的優先級
靜音時段的優先級最高。即使其他條件都滿足，只要在靜音時段內，就不會發送通知。
:::

#### terminal

| 設定項 | 類型 | 預設值 | 說明 |
|---|---|---|---|
| `terminal` | string | 未設定 | 手動指定終端機類型（覆蓋自動偵測） |

**作用**：手動指定你使用的終端機模擬器類型，覆蓋外掛的自動偵測。

**預設行為**（未設定）：
- 外掛使用 `detect-terminal` 庫自動偵測你的終端機
- 支援 37+ 終端機模擬器

**設定後**：
- 外掛使用指定的終端機類型
- 用於焦點偵測和點擊聚焦功能（macOS）

**常用終端機值**：

| 終端機應用程式 | 設定值 |
|---|---|
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code 整合終端機 | `"vscode"` |

::: tip 何時需要手動設定
- 自動偵測失敗，焦點偵測不工作
- 你使用多個終端機，需要指定特定終端機
- 你的終端機名稱不在常用列表中
:::

## 平台差異總結

不同平台對設定項的支援程度不同：

| 設定項 | macOS | Windows | Linux |
|---|---|---|---|
| `notifyChildSessions` | ✅ | ✅ | ✅ |
| 焦點偵測（硬編碼） | ✅ | ❌ | ❌ |
| `sounds.*` | ✅ | ❌ | ❌ |
| `quietHours.*` | ✅ | ✅ | ✅ |
| `terminal` | ✅ | ✅ | ✅ |

::: warning Windows/Linux 使用者注意
`sounds` 設定和焦點偵測功能在 Windows 和 Linux 上無效。
- Windows/Linux 會使用系統預設通知聲音
- Windows/Linux 不支援焦點偵測（無法透過設定控制）
:::

## 設定範例

### 基礎設定（推薦）

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

這個設定適合大多數使用者：
- 只通知父會話，避免子任務噪音
- macOS 上終端機在前台時會自動抑制通知（無需設定）
- 使用預設的音效組合
- 不啟用靜音時段

### 啟用靜音時段

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

適合希望夜間不受打擾的使用者：
- 晚上 10 點到早上 8 點不發送任何通知
- 其他時間正常通知

### 追蹤所有子任務

```json
{
  "notifyChildSessions": true,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Ping"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

適合需要追蹤所有任務進度的使用者：
- 所有會話（父會話和子會話）都通知
- 為問題詢問設定獨立音效（Ping）

### 手動指定終端機

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

適合自動偵測失敗或使用多個終端機的使用者：
- 手動指定使用 Ghostty 終端機
- 確保焦點偵測和點擊聚焦功能正常工作

### Windows/Linux 最小設定

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

適合 Windows/Linux 使用者（簡化設定）：
- 只保留平台支援的設定項
- `sounds` 設定和焦點偵測功能在 Windows/Linux 上無效，無需設定

## 設定檔管理

### 建立設定檔

**macOS/Linux**：

```bash
# 建立設定目錄（如果不存在）
mkdir -p ~/.config/opencode

# 建立設定檔
nano ~/.config/opencode/kdco-notify.json
```

**Windows (PowerShell)**：

```powershell
# 建立設定目錄（如果不存在）
New-Item -ItemType Directory -Path "$env:APPDATA\opencode" -Force

# 建立設定檔
notepad "$env:APPDATA\opencode\kdco-notify.json"
```

### 驗證設定檔

**檢查檔案是否存在**：

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
Get-Content "$env:APPDATA\opencode\kdco-notify.json"
```

**檢查設定是否生效**：

1. 修改設定檔
2. 重新啟動 OpenCode（或觸發設定重新載入）
3. 觀察通知行為是否符合預期

### 設定檔錯誤處理

如果設定檔格式錯誤：
- 外掛會忽略錯誤的設定檔
- 使用預設設定繼續執行
- 在 OpenCode 日誌中輸出警告訊息

**常見 JSON 錯誤**：

| 錯誤類型 | 範例 | 修正方法 |
|---|---|---|
| 缺少逗號 | `"key1": "value1" "key2": "value2"` | 添加逗號：`"key1": "value1",` |
| 多餘逗號 | `"key1": "value1",}` | 刪除最後一個逗號：`"key1": "value1"}` |
| 引號未閉合 | `"key": value` | 添加引號：`"key": "value"` |
| 使用單引號 | `'key': 'value'` | 改用雙引號：`"key": "value"` |
| 註解語法錯誤 | `{"key": "value" /* comment */}` | JSON 不支援註解，刪除註解 |

::: tip 使用 JSON 驗證工具
可以使用線上 JSON 驗證工具（如 jsonlint.com）檢查設定檔格式是否正確。
:::

## 本課小結

本課提供了 opencode-notify 的完整設定參考：

**核心設定項**：

| 設定項 | 作用 | 預設值 | 平台支援 |
|---|---|---|---|
| `notifyChildSessions` | 子會話通知開關 | `false` | 全平台 |
| 焦點檢測（硬編碼） | 終端聚焦抑制（硬編碼） | 無設定 | 僅 macOS |
| `sounds.*` | 自訂音效 | 見各欄位 | 僅 macOS |
| `quietHours.*` | 靜音時段設定 | 見各欄位 | 全平台 |
| `terminal` | 手動指定終端機 | 未設定 | 全平台 |

**設定原則**：
- **大多數使用者**：使用預設設定即可
- **需要靜音**：啟用 `quietHours`
- **需要追蹤子任務**：啟用 `notifyChildSessions`
- **macOS 使用者**：可自訂 `sounds`，享受自動焦點檢測
- **Windows/Linux 使用者**：設定項較少，關注 `notifyChildSessions` 和 `quietHours`

**設定檔路徑**：`~/.config/opencode/kdco-notify.json`

## 下一課預告

> 下一課我們學習 **[靜音時段詳解](../quiet-hours/)**。
>
> 你會學到：
> - 靜音時段的詳細工作原理
> - 跨午夜時段的設定方法
> - 靜音時段與其他設定的優先級
> - 常見問題和解決方案

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
|---|---|---|
| 設定介面定義 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| 預設設定 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| 設定檔載入 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L91-L114) | 91-114 |
| 子會話檢查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| 終端機焦點檢查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| 靜音時段檢查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| 音效設定使用 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L236) | 227-236 |
| README 設定範例 | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L68-L79) | 68-79 |

**設定介面** (NotifyConfig)：

```typescript
interface NotifyConfig {
  /** Notify for child/sub-session events (default: false) */
  notifyChildSessions: boolean
  /** Sound configuration per event type */
  sounds: {
    idle: string
    error: string
    permission: string
    question?: string
  }
  /** Quiet hours configuration */
  quietHours: {
    enabled: boolean
    start: string // "HH:MM" format
    end: string // "HH:MM" format
  }
  /** Override terminal detection (optional) */
  terminal?: string
}
```

**注意**：設定介面中**沒有** `suppressWhenFocused` 欄位。焦點檢測是 macOS 平台的硬編碼行為，使用者無法透過設定檔控制。

**預設設定** (DEFAULT_CONFIG)：

```typescript
const DEFAULT_CONFIG: NotifyConfig = {
  notifyChildSessions: false,
  sounds: {
    idle: "Glass",      // 任務完成音效
    error: "Basso",     // 錯誤音效
    permission: "Submarine",  // 權限請求音效
  },
  quietHours: {
    enabled: false,     // 預設不啟用靜音時段
    start: "22:00",    // 晚上 10 點
    end: "08:00",      // 早上 8 點
  },
}
```

**設定載入函式** (loadConfig)：

- 路徑：`~/.config/opencode/kdco-notify.json`
- 使用 `fs.readFile()` 讀取設定檔
- 與 `DEFAULT_CONFIG` 合併（使用者設定優先）
- 巢狀物件（`sounds`、`quietHours`）也會合併
- 設定檔不存在或格式錯誤時，使用預設設定

**子會話檢查** (isParentSession)：

- 檢查 `sessionID` 是否包含 `/`（子會話標識）
- 如果 `notifyChildSessions` 為 `false`，跳過子會話通知
- 權限請求通知（`permission.updated`）始終發送，不受此限制

**終端機焦點檢查** (isTerminalFocused)：

- 使用 `osascript` 取得目前前台應用程序名
- 與終端機的 `processName` 進行比對（不區分大小寫）
- 僅在 macOS 平台啟用，**無法透過設定關閉**
- 問題詢問通知（`question`）不做焦點檢查（支援 tmux 工作流）

**靜音時段檢查** (isQuietHours)：

- 將目前時間轉換為分鐘數（從午夜 0 點開始）
- 與設定的 `start` 和 `end` 進行比較
- 支援跨午夜時段（如 22:00-08:00）
- 如果 `start > end`，表示跨午夜

**音效設定使用** (sendNotification)：

- 從設定中讀取對應事件的音效名稱
- 傳遞給 `node-notifier` 的 `sound` 選項
- 僅在 macOS 平台生效
- `question` 事件如果未設定音效，使用 `permission` 的音效

</details>
