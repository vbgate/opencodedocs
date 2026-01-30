---
title: "opencode-notify 常見問題：效能影響、隱私安全與平台相容性詳解"
sidebarTitle: "搞懂關鍵問題"
subtitle: "常見問題：效能、隱私與相容性"
description: "了解 opencode-notify 對 AI 上下文的影響和系統資源佔用機制，確認外掛完全本機執行無需上傳資料，掌握智慧通知過濾策略和靜音時段設定方法，學習與其他 OpenCode 外掛的相容性以及 macOS/Windows/Linux 平台功能差異，全面解答通知頻率、隱私安全、資源佔用、終端機偵測失敗處理、設定檔位置等使用者最關心的常見疑問。"
tags:
  - "FAQ"
  - "效能"
  - "隱私"
prerequisite:
  - "start-quick-start"
order: 120
---

# 常見問題：效能、隱私與相容性

## 學完你能做什麼

- 了解外掛的效能影響和資源佔用
- 明確隱私安全保證
- 掌握通知策略和設定技巧
- 理解平台差異和相容性

---

## 效能相關

### 會不會增加 AI 上下文？

**不會**。外掛使用事件驅動模式，不向 AI 對話中添加任何工具或提示詞。

從原始碼實作來看：

| 元件 | 類型 | 實作 | 對上下文的影響 |
| --- | --- | --- | --- |
| 事件監聽 | 事件 | 監聽 `session.idle`、`session.error`、`permission.updated` 事件 | ✅ 無影響 |
| 工具鉤子 | 鉤子 | 透過 `tool.execute.before` 監聽 `question` 工具 | ✅ 無影響 |
| 對話內容 | - | 不讀取、不修改、不注入任何對話內容 | ✅ 無影響 |

原始碼中外掛只負責**監聽和通知**，AI 對話的上下文完全不受影響。

### 會佔用多少系統資源？

**極低**。外掛採用「啟動時快取 + 事件觸發」的設計：

1. **設定載入**：外掛啟動時讀取一次設定檔（`~/.config/opencode/kdco-notify.json`），後續不再讀取
2. **終端機偵測**：啟動時偵測終端機類型並快取資訊（名稱、Bundle ID、程序名稱），後續事件直接使用快取
3. **事件驅動**：只有當 AI 觸發特定事件時，外掛才會執行通知邏輯

資源佔用特點：

| 資源類型 | 佔用情況 | 說明 |
| --- | --- | --- |
| CPU | 幾乎為 0 | 僅在事件觸發時短暫執行 |
| 記憶體 | < 5 MB | 啟動後進入待機狀態 |
| 磁碟 | < 100 KB | 設定檔和程式碼本身 |
| 網路 | 0 | 不進行任何網路請求 |

---

## 隱私與安全

### 資料會上傳到伺服器嗎？

**不會**。外掛完全在本機執行，不進行任何資料上傳。

**隱私保證**：

| 資料類型 | 處理方式 | 是否上傳 |
| --- | --- | --- |
| AI 對話內容 | 不讀取、不儲存 | ❌ 否 |
| 工作階段資訊（標題） | 僅用於通知文案 | ❌ 否 |
| 錯誤訊息 | 僅用於通知文案（最多 100 字元） | ❌ 否 |
| 終端機資訊 | 本機偵測並快取 | ❌ 否 |
| 設定資訊 | 本機檔案（`~/.config/opencode/`） | ❌ 否 |
| 通知內容 | 透過系統原生通知 API 發送 | ❌ 否 |

**技術實作**：

外掛使用系統原生通知：
- macOS：透過 `node-notifier` 呼叫 `NSUserNotificationCenter`
- Windows：透過 `node-notifier` 呼叫 `SnoreToast`
- Linux：透過 `node-notifier` 呼叫 `notify-send`

所有通知均在本機觸發，不會透過 OpenCode 的雲端服務。

### 外掛是否會竊取我的工作階段內容？

**不會**。外掛只讀取**必要的中繼資料**：

| 讀取的資料 | 用途 | 限制 |
| --- | --- | --- |
| 工作階段標題（title） | 通知文案 | 只取前 50 字元 |
| 錯誤訊息（error） | 通知文案 | 只取前 100 字元 |
| 終端機資訊 | 焦點偵測和點擊聚焦 | 不讀取終端機內容 |
| 設定檔 | 使用者自訂設定 | 本機檔案 |

原始碼中沒有任何讀取對話訊息（messages）或使用者輸入（user input）的邏輯。

---

## 通知策略

### 會不會被通知轟炸？

**不會**。外掛內建多重智慧過濾機制，避免通知轟炸。

**預設通知策略**：

| 類型 | 事件/工具 | 是否通知 | 理由 |
| --- | --- | --- | --- |
| 事件 | 父工作階段完成（session.idle） | ✅ 是 | 主要任務完成 |
| 事件 | 子工作階段完成（session.idle） | ❌ 否 | 父工作階段會統一通知 |
| 事件 | 工作階段錯誤（session.error） | ✅ 是 | 需要立即處理 |
| 事件 | 權限請求（permission.updated） | ✅ 是 | AI 阻塞等待 |
| 工具鉤子 | 問題詢問（tool.execute.before - question） | ✅ 是 | AI 需要輸入 |

**智慧過濾機制**：

1. **只通知父工作階段**
   - 原始碼：`notify.ts:256-259`
   - 預設設定：`notifyChildSessions: false`
   - 避免 AI 拆解任務時每個子任務都通知

2. **終端機聚焦時抑制**（macOS）
   - 原始碼：`notify.ts:265`
   - 邏輯：當終端機是前景視窗時，不發送通知（內建行為，無需設定）
   - 避免「正在看終端機時還要通知」的重複提醒
   - **注意**：此功能僅在 macOS 可用（需要終端機資訊才能偵測）

3. **靜音時段**
   - 原始碼：`notify.ts:262`、`notify.ts:181-199`
   - 預設設定：`quietHours: { enabled: false, start: "22:00", end: "08:00" }`
   - 可設定，避免夜間打擾

4. **權限請求始終通知**
   - 原始碼：`notify.ts:319`
   - 理由：AI 阻塞等待使用者授權，必須及時通知
   - 不做父工作階段檢查

### 能否只接收特定類型的通知？

**可以**。雖然外掛沒有單獨的通知開關，但可以透過靜音時段和終端機聚焦偵測來實現：

- **只接收緊急通知**：終端機聚焦偵測是內建行為，當你在終端機時不會收到通知（macOS）
- **只接收夜間通知**：啟用靜音時段（如 09:00-18:00），反向使用

如果需要更細緻的控制，可以考慮提交 Feature Request。

---

## 外掛相容性

### 會與其他 OpenCode 外掛衝突嗎？

**不會**。外掛透過標準 OpenCode Plugin API 整合，不修改 AI 行為或干擾其他外掛。

**整合方式**：

| 元件 | 整合方式 | 衝突風險 |
| --- | --- | --- |
| 事件監聽 | OpenCode SDK 的 `event` 鉤子 | ❌ 無衝突 |
| 工具鉤子 | OpenCode Plugin API 的 `tool.execute.before` 鉤子 | ❌ 無衝突（只監聽 `question` 工具） |
| 工作階段查詢 | OpenCode SDK 的 `client.session.get()` | ❌ 無衝突（唯讀不寫） |
| 通知發送 | `node-notifier` 獨立程序 | ❌ 無衝突 |

**可能共存的其他外掛**：

- OpenCode 官方外掛（如 `opencode-coder`）
- 第三方外掛（如 `opencode-db`、`opencode-browser`）
- 自訂外掛

所有外掛透過標準的 Plugin API 並行執行，互不干擾。

### 支援哪些平台？功能有差異嗎？

**支援 macOS、Windows、Linux 三大平台，但功能有差異**。

| 功能 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| 原生通知 | ✅ 支援 | ✅ 支援 | ✅ 支援 |
| 自訂音效 | ✅ 支援 | ❌ 不支援 | ❌ 不支援 |
| 終端機焦點偵測 | ✅ 支援 | ❌ 不支援 | ❌ 不支援 |
| 點擊通知聚焦 | ✅ 支援 | ❌ 不支援 | ❌ 不支援 |
| 終端機自動偵測 | ✅ 支援 | ✅ 支援 | ✅ 支援 |
| 靜音時段 | ✅ 支援 | ✅ 支援 | ✅ 支援 |

**平台差異原因**：

| 平台 | 差異說明 |
| --- | --- |
| macOS | 系統提供了豐富的通知 API 和應用程式管理介面（如 `osascript`），支援音效、焦點偵測、點擊聚焦 |
| Windows | 系統通知 API 功能有限，不支援應用程式層級的前景偵測和音效自訂 |
| Linux | 依賴 `notify-send` 標準，功能與 Windows 類似 |

**跨平台核心功能**：

無論使用哪個平台，以下核心功能均可用：
- 任務完成通知（session.idle）
- 錯誤通知（session.error）
- 權限請求通知（permission.updated）
- 問題詢問通知（tool.execute.before）
- 靜音時段設定

---

## 終端機與系統

### 支援哪些終端機？如何偵測？

**支援 37+ 終端機模擬器**。

外掛使用 [`detect-terminal`](https://github.com/jonschlinkert/detect-terminal) 函式庫自動識別終端機，支援的終端機包括：

**macOS 終端機**：
- Ghostty、Kitty、iTerm2、WezTerm、Alacritty
- macOS Terminal、Hyper、Warp
- VS Code 整合終端機（Code / Code - Insiders）

**Windows 終端機**：
- Windows Terminal、Git Bash、ConEmu、Cmder
- PowerShell、CMD（透過預設偵測）

**Linux 終端機**：
- gnome-terminal、konsole、xterm、lxterminal
- terminator、tilix、alacritty、kitty

**偵測機制**：

1. **自動偵測**：外掛啟動時呼叫 `detectTerminal()` 函式庫
2. **手動覆寫**：使用者可在設定檔中指定 `terminal` 欄位覆寫自動偵測
3. **macOS 對應**：終端機名稱對應到程序名稱（如 `ghostty` → `Ghostty`），用於焦點偵測

**設定範例**：

```json
{
  "terminal": "ghostty"
}
```

### 如果終端機偵測失敗會怎樣？

**外掛仍可正常運作，只是焦點偵測功能失效**。

**失敗處理邏輯**：

| 失敗情境 | 表現 | 影響 |
| --- | --- | --- |
| `detectTerminal()` 回傳 `null` | 終端機資訊為 `{ name: null, bundleId: null, processName: null }` | 無焦點偵測，但通知正常發送 |
| macOS `osascript` 執行失敗 | Bundle ID 取得失敗 | macOS 點擊聚焦功能失效，但通知正常 |
| 設定檔中 `terminal` 值無效 | 使用自動偵測結果 | 如果自動偵測也失敗，則無焦點偵測 |

原始碼中相關邏輯（`notify.ts:149-150`）：

```typescript
if (!terminalName) {
  return { name: null, bundleId: null, processName: null }
}
```

**解決方法**：

如果終端機偵測失敗，可以手動指定終端機類型：

```json
{
  "terminal": "iterm2"
}
```

---

## 設定與故障排除

### 設定檔在哪裡？如何修改？

**設定檔路徑**：`~/.config/opencode/kdco-notify.json`

**完整設定範例**：

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
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

**修改設定步驟**：

1. 開啟終端機，編輯設定檔：
   ```bash
   # macOS/Linux
   nano ~/.config/opencode/kdco-notify.json
   
   # Windows
   notepad %USERPROFILE%\.config\opencode\kdco-notify.json
   ```

2. 修改設定項（參考上面的範例）

3. 儲存檔案，設定自動生效（無需重新啟動）

### 設定檔損壞會怎樣？

**外掛會使用預設設定，並靜默處理錯誤**。

**錯誤處理邏輯**（`notify.ts:110-113`）：

```typescript
} catch {
  // Config doesn't exist or is invalid, use defaults
  return DEFAULT_CONFIG
}
```

**解決方法**：

如果設定檔損壞（JSON 格式錯誤），外掛會回退到預設設定。修復步驟：

1. 刪除損壞的設定檔：
   ```bash
   rm ~/.config/opencode/kdco-notify.json
   ```

2. 外掛會使用預設設定繼續運作

3. 如需自訂設定，重新建立設定檔

---

## 本課小結

本課解答了使用者最關心的常見問題：

- **效能影響**：外掛不增加 AI 上下文，資源佔用極低（CPU 幾乎為 0，記憶體 < 5 MB）
- **隱私安全**：完全本機執行，不上傳任何資料，只讀取必要的中繼資料
- **通知策略**：智慧過濾機制（只通知父工作階段、macOS 終端機聚焦時抑制、靜音時段）
- **外掛相容性**：不與其他外掛衝突，支援三大平台但功能有差異
- **終端機支援**：支援 37+ 終端機，自動偵測失敗時仍可正常運作

---

## 下一課預告

> 下一課我們學習 **[事件類型說明](../../appendix/event-types/)**。
>
> 你會學到：
> - 外掛監聽的四種 OpenCode 事件類型
> - 每種事件的觸發時機和通知內容
> - 事件的過濾規則（父工作階段檢查、靜音時段、終端機焦點）
> - 不同平台的事件處理差異

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 外掛啟動與設定載入 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L357-L364) | 357-364 |
| 事件監聽邏輯 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L372-L400) | 372-400 |
| 父工作階段檢查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| 靜音時段檢查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| 終端機焦點偵測 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| 設定檔載入 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| 終端機資訊偵測 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| 預設設定定義 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |

**關鍵常數**：
- `DEFAULT_CONFIG`：預設設定（只通知父工作階段、Glass/Basso/Submarine 音效、靜音時段預設停用）

**關鍵函式**：
- `loadConfig()`：載入使用者設定並合併預設值
- `detectTerminalInfo()`：偵測終端機資訊並快取
- `isQuietHours()`：檢查目前時間是否在靜音時段
- `isTerminalFocused()`：檢查終端機是否為前景視窗（macOS）
- `isParentSession()`：檢查工作階段是否為父工作階段

</details>
