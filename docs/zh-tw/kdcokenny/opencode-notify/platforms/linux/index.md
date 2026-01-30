---
title: "Linux 平台使用指南：notify-send 通知與終端機偵測 | opencode-notify 教學"
sidebarTitle: "Linux 上也能發通知"
subtitle: "Linux 平台特性：notify-send 通知與終端機偵測"
description: "學習 opencode-notify 在 Linux 平台的功能和限制。掌握 Linux 原生通知和終端機偵測能力，了解與 macOS/Windows 平台的功能差異，設定適合 Linux 的通知策略以提升效率，避免通知打擾並保持專注工作狀態，解決 notify-send 安裝、通知顯示和常見設定問題。"
tags:
  - "Linux"
  - "平台特性"
  - "終端機偵測"
prerequisite:
  - "start-quick-start"
order: 50
---

# Linux 平台特性：notify-send 通知與終端機偵測

## 學完你能做什麼

- 了解 opencode-notify 在 Linux 平台支援的功能
- 掌握 Linux 原生通知和終端機偵測的運作方式
- 理解與 macOS/Windows 平台的功能差異
- 設定適合 Linux 的通知策略

## 你現在的困境

你在 Linux 上使用 OpenCode，發現某些功能不像 macOS 上那麼智慧。終端機聚焦時通知還是會彈出，點擊通知也不能回到終端機視窗。這是正常現象嗎？Linux 平台有哪些限制？

## 什麼時候用這一招

**在以下情境下了解 Linux 平台特性**：
- 你在 Linux 系統上使用 opencode-notify
- 你發現某些 macOS 功能在 Linux 上不可用
- 你想知道如何最大化利用 Linux 平台的可用功能

## 核心思路

opencode-notify 在 Linux 平台上提供**基礎通知能力**，但相比 macOS 有一些功能限制。這是由作業系統特性決定的，不是外掛的問題。

::: info 為什麼 macOS 功能更豐富？

macOS 提供了更強大的系統 API：
- NSUserNotificationCenter 支援點擊聚焦
- AppleScript 可以偵測前景應用程式
- 系統音效 API 允許自訂聲音

Linux 和 Windows 的系統通知 API 相對基礎，opencode-notify 在這些平台上透過 `node-notifier` 呼叫系統原生通知。
:::

## Linux 平台功能一覽

| 功能 | Linux | 說明 |
| --- | --- | --- |
| **原生通知** | ✅ 支援 | 透過 notify-send 發送通知 |
| **終端機偵測** | ✅ 支援 | 自動識別 37+ 終端機模擬器 |
| **焦點偵測** | ❌ 不支援 | 無法偵測終端機是否為前景視窗 |
| **點擊聚焦** | ❌ 不支援 | 點擊通知不會切換到終端機 |
| **自訂音效** | ❌ 不支援 | 使用系統預設通知聲音 |

### Linux 通知機制

opencode-notify 在 Linux 上使用 **notify-send** 指令發送系統通知，透過 `node-notifier` 函式庫呼叫系統原生 API。

**通知觸發時機**：
- AI 任務完成時（session.idle）
- AI 執行出錯時（session.error）
- AI 需要權限時（permission.updated）
- AI 詢問問題時（tool.execute.before）

::: tip notify-send 通知特點
- 通知顯示在螢幕右上角（GNOME/Ubuntu）
- 自動消失（約 5 秒）
- 使用系統預設通知聲音
- 點擊通知會開啟通知中心（不會切換到終端機）
:::

## 終端機偵測

### 自動識別終端機

opencode-notify 使用 `detect-terminal` 函式庫自動偵測你使用的終端機模擬器。

**Linux 支援的終端機**：
- gnome-terminal（GNOME 桌面預設）
- konsole（KDE 桌面）
- xterm
- lxterminal（LXDE 桌面）
- alacritty
- kitty
- terminator
- guake
- tilix
- hyper
- VS Code 整合終端機
- 以及其他 37+ 終端機模擬器

::: details 終端機偵測原理

外掛啟動時，`detect-terminal()` 會掃描系統程序，識別目前終端機類型。

原始碼位置：`src/notify.ts:145-164`

`detectTerminalInfo()` 函式會：
1. 讀取設定中的 `terminal` 欄位（如果有手動指定）
2. 呼叫 `detectTerminal()` 自動偵測終端機類型
3. 取得程序名稱（用於 macOS 焦點偵測）
4. 在 macOS 上取得 bundle ID（用於點擊聚焦）

在 Linux 平台上，`bundleId` 和 `processName` 會是 `null`，因為 Linux 不需要這些資訊。
:::

### 手動指定終端機

如果自動偵測失敗，你可以在設定檔中手動指定終端機類型。

**設定範例**：

```json
{
  "terminal": "gnome-terminal"
}
```

**可用終端機名稱**：參考 [`detect-terminal` 支援的終端機清單](https://github.com/jonschlinkert/detect-terminal#supported-terminals)。

## 平台功能對比

| 功能 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **原生通知** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **自訂音效** | ✅ 系統音效清單 | ❌ 系統預設 | ❌ 系統預設 |
| **焦點偵測** | ✅ AppleScript API | ❌ 不支援 | ❌ 不支援 |
| **點擊聚焦** | ✅ activate bundleId | ❌ 不支援 | ❌ 不支援 |
| **終端機偵測** | ✅ 37+ 終端機 | ✅ 37+ 終端機 | ✅ 37+ 終端機 |

### 為什麼 Linux 不支援焦點偵測？

原始碼中，`isTerminalFocused()` 函式在 Linux 上直接回傳 `false`：

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux 直接回傳 false
	// ... macOS 的焦點偵測邏輯
}
```

**原因**：
- Linux 桌面環境多樣（GNOME、KDE、XFCE 等），沒有統一的前景應用程式查詢 API
- Linux DBus 可以取得活動視窗，但實作複雜且依賴桌面環境
- 目前版本優先保證穩定性，暫未實作 Linux 焦點偵測

### 為什麼 Linux 不支援點擊聚焦？

原始碼中，`sendNotification()` 函式只在 macOS 上設定 `activate` 選項：

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**原因**：
- notify-send 不支援 `activate` 參數
- Linux 通知只能透過應用程式 ID 關聯，無法動態指定目標視窗
- 點擊通知會開啟通知中心，而不是聚焦到特定視窗

### 為什麼 Linux 不支援自訂音效？

::: details 音效設定原理

在 macOS 上，`sendNotification()` 會傳遞 `sound` 參數給系統通知：

```typescript
// src/notify.ts:227-243
function sendNotification(options: NotificationOptions): void {
	const { title, message, sound, terminalInfo } = options
	
	const notifyOptions: Record<string, unknown> = {
		title,
		message,
		sound,  // ← macOS 接受此參數
	}
	
	// macOS-specific: click notification to focus terminal
	if (process.platform === "darwin" && terminalInfo.bundleId) {
		notifyOptions.activate = terminalInfo.bundleId
	}
	
	notifier.notify(notifyOptions)
}
```

Linux notify-send 不支援自訂聲音參數，因此 `sounds` 設定在 Linux 上無效。
:::

## Linux 平台的最佳實踐

### 設定建議

由於 Linux 不支援焦點偵測，建議調整設定以減少通知噪音。

**推薦設定**：

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**設定說明**：
- `notifyChildSessions: false` - 只通知父工作階段，避免子任務噪音
- `quietHours.enabled: true` - 啟用靜音時段，避免夜間打擾

### 不支援的設定項

以下設定項在 Linux 上無效：

| 設定項 | macOS 效果 | Linux 效果 |
| --- | --- | --- |
| `sounds.idle` | 播放 Glass 音效 | 使用系統預設聲音 |
| `sounds.error` | 播放 Basso 音效 | 使用系統預設聲音 |
| `sounds.permission` | 播放 Submarine 音效 | 使用系統預設聲音 |

### 使用技巧

**技巧 1：手動關閉通知**

如果你正在檢視終端機，不想被打擾：

1. 點擊螢幕右上角的通知圖示
2. 關閉 opencode-notify 的通知

**技巧 2：使用靜音時段**

設定工作時間和休息時間，避免非工作時間被打擾：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**技巧 3：暫時停用外掛**

如需完全停用通知，建議使用 `quietHours` 設定設定全天靜音，或刪除/重新命名設定檔以停用外掛。

**技巧 4：設定系統通知聲音**

雖然 opencode-notify 不支援自訂音效，你可以在系統設定中更改預設通知聲音：

- **GNOME**：設定 → 聲音 → 提示音
- **KDE**：系統設定 → 通知 → 預設聲音
- **XFCE**：設定 → 外觀 → 通知 → 聲音

## 跟我做

### 驗證 Linux 通知

**第 1 步：觸發測試通知**

在 OpenCode 中輸入一個簡單任務：

```
請計算 1+1 的結果。
```

**你應該看到**：
- 螢幕右上角彈出 notify-send 通知（GNOME/Ubuntu）
- 通知標題為 "Ready for review"
- 播放系統預設通知聲音

**第 2 步：測試焦點抑制（驗證不支援）**

保持終端機視窗在前景，再次觸發任務。

**你應該看到**：
- 通知仍然彈出（因為 Linux 不支援焦點偵測）

**第 3 步：測試點擊通知**

點擊彈出的通知。

**你應該看到**：
- 通知中心展開，而不是切換到終端機視窗

### 設定靜音時段

**第 1 步：建立設定檔**

編輯設定檔（bash）：

```bash
nano ~/.config/opencode/kdco-notify.json
```

**第 2 步：新增靜音時段設定**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**第 3 步：儲存並測試**

等待目前時間進入靜音時段，然後觸發一個任務。

**你應該看到**：
- 不彈出通知（靜音時段生效）

## 檢查點 ✅

完成上述步驟後，請確認：

- [ ] notify-send 通知正常顯示
- [ ] 通知顯示正確的任務標題
- [ ] 靜音時段設定生效
- [ ] 了解 Linux 平台不支援的功能

## 踩坑提醒

### 常見問題 1：通知不顯示

**原因 1**：notify-send 未安裝

**解決方法**：

```bash
# Ubuntu/Debian
sudo apt install libnotify-bin

# Fedora/RHEL
sudo dnf install libnotify

# Arch Linux
sudo pacman -S libnotify
```

**原因 2**：Linux 通知權限未授予

**解決方法**：

1. 開啟系統設定
2. 找到「通知」或「隱私」→「通知」
3. 確保啟用了「允許應用程式發送通知」
4. 找到 OpenCode，確保通知權限已開啟

### 常見問題 2：終端機偵測失敗

**原因**：`detect-terminal` 無法識別你的終端機

**解決方法**：

在設定檔中手動指定終端機類型：

```json
{
  "terminal": "gnome-terminal"
}
```

### 常見問題 3：自訂音效不生效

**原因**：Linux 平台不支援自訂音效

**說明**：這是正常現象。notify-send 使用系統預設聲音，無法透過設定檔更改。

**解決方法**：在系統設定中更改預設通知聲音。

### 常見問題 4：點擊通知不聚焦終端機

**原因**：notify-send 不支援 `activate` 參數

**說明**：這是 Linux API 的限制。點擊通知會開啟通知中心，需要手動切換到終端機視窗。

### 常見問題 5：不同桌面環境的通知行為差異

**現象**：在不同桌面環境（GNOME、KDE、XFCE）中，通知顯示位置和行為可能不同。

**說明**：這是正常的，每個桌面環境都有自己的通知系統實作。

**解決方法**：根據你使用的桌面環境，調整系統設定中的通知行為。

## 本課小結

本課我們了解了：

- ✅ Linux 平台支援原生通知和終端機偵測
- ✅ Linux 不支援焦點偵測和點擊聚焦
- ✅ Linux 不支援自訂音效
- ✅ 推薦設定（靜音時段、只通知父工作階段）
- ✅ 常見問題的解決方法

**關鍵要點**：
1. Linux 平台功能相對基礎，但核心通知能力完整
2. 焦點偵測和點擊聚焦是 macOS 獨有功能
3. 透過靜音時段設定可以減少通知噪音
4. 終端機偵測支援手動指定，提高相容性
5. notify-send 需要預先安裝（部分發行版預設包含）

## 下一課預告

> 下一課我們學習 **[支援的終端機](../terminals/)**。
>
> 你會學到：
> - opencode-notify 支援的 37+ 終端機清單
> - 不同終端機的偵測機制
> - 終端機類型覆蓋設定方法
> - VS Code 整合終端機的使用技巧

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Linux 平台限制檢查（osascript） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Linux 平台限制檢查（焦點偵測） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS 特定：點擊聚焦 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| 通知發送（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 終端機偵測（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| 設定載入（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**關鍵函式**：
- `runOsascript()`：只在 macOS 上執行，Linux 回傳 null
- `isTerminalFocused()`：Linux 直接回傳 false
- `sendNotification()`：只在 macOS 上設定 `activate` 參數
- `detectTerminalInfo()`：跨平台終端機偵測

**平台判斷**：
- `process.platform === "darwin"`：macOS
- `process.platform === "win32"`：Windows
- `process.platform === "linux"`：Linux

**Linux 通知相依性**：
- 外部相依性：`node-notifier` → `notify-send` 指令
- 系統要求：libnotify-bin 或等效套件

</details>
