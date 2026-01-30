---
title: "Windows 平台使用指南：原生通知、終端機偵測與設定詳解 | opencode-notify 教學"
sidebarTitle: "Windows 上用通知"
subtitle: "Windows 平台特性：原生通知與終端機偵測"
description: "學習 opencode-notify 在 Windows 平台的功能和限制。掌握 Windows 原生通知和終端機偵測能力，了解與 macOS 平台的功能差異，設定最佳通知策略以提升效率，避免通知打擾並保持專注工作狀態。"
tags:
  - "Windows"
  - "平台特性"
  - "終端機偵測"
prerequisite:
  - "start-quick-start"
order: 40
---

# Windows 平台特性：原生通知與終端機偵測

## 學完你能做什麼

- 了解 opencode-notify 在 Windows 平台支援的功能
- 掌握 Windows 終端機偵測的工作方式
- 理解與 macOS 平台的功能差異
- 設定適合 Windows 的通知策略

## 你現在的困境

你在 Windows 上使用 OpenCode，發現某些功能不像 macOS 上那麼智慧。終端機聚焦時通知還是會彈出，點擊通知也不能回到終端機視窗。這是正常現象嗎？Windows 平台有哪些限制？

## 什麼時候用這一招

**在以下場景下了解 Windows 平台特性**：
- 你在 Windows 系統上使用 opencode-notify
- 你發現某些 macOS 功能在 Windows 上不可用
- 你想知道如何最大化利用 Windows 平台的可用功能

## 核心思路

opencode-notify 在 Windows 平台上提供**基礎通知能力**，但相比 macOS 有一些功能限制。這是由作業系統特性決定的，不是外掛程式的問題。

::: info 為什麼 macOS 功能更豐富？

macOS 提供了更強大的系統 API：
- NSUserNotificationCenter 支援點擊聚焦
- AppleScript 可以偵測前景應用程式
- 系統音效 API 允許自訂聲音

Windows 和 Linux 的系統通知 API 相對基礎，opencode-notify 在這些平台上透過 `node-notifier` 呼叫系統原生通知。
:::

## Windows 平台功能一覽

| 功能 | Windows | 說明 |
| --- | --- | --- |
| **原生通知** | ✅ 支援 | 透過 Windows Toast 發送通知 |
| **終端機偵測** | ✅ 支援 | 自動識別 37+ 終端機模擬器 |
| **焦點偵測** | ❌ 不支援 | 無法偵測終端機是否為前景視窗 |
| **點擊聚焦** | ❌ 不支援 | 點擊通知不會切換到終端機 |
| **自訂音效** | ❌ 不支援 | 使用系統預設通知聲音 |

### Windows 通知機制

opencode-notify 在 Windows 上使用 **Windows Toast** 通知，透過 `node-notifier` 函式庫呼叫系統原生 API。

**通知觸發時機**：
- AI 任務完成時（session.idle）
- AI 執行出錯時（session.error）
- AI 需要權限時（permission.updated）
- AI 詢問問題時（tool.execute.before）

::: tip Windows Toast 通知特點
- 通知顯示在螢幕右下角
- 自動消失（約 5 秒）
- 使用系統預設通知聲音
- 點擊通知會開啟通知中心（不會切換到終端機）
:::

## 終端機偵測

### 自動識別終端機

opencode-notify 使用 `detect-terminal` 函式庫自動偵測你使用的終端機模擬器。

**Windows 支援的終端機**：
- Windows Terminal（推薦）
- Git Bash
- ConEmu
- Cmder
- PowerShell
- VS Code 整合終端機

::: details 終端機偵測原理
外掛程式啟動時，`detect-terminal()` 會掃描系統程序，識別目前終端機類型。

原始碼位置：`src/notify.ts:145-147`

```typescript
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
	const terminalName = config.terminal || detectTerminal() || null
	
	if (!terminalName) {
		return { name: null, bundleId: null, processName: null }
	}
	
	return {
		name: terminalName,
		bundleId: null,  // Windows 不需要 bundleId
		processName: null,  // Windows 不需要程序名稱
	}
}
```
:::

### 手動指定終端機

如果自動偵測失敗，你可以在設定檔中手動指定終端機類型。

**設定範例**：

```json
{
  "terminal": "Windows Terminal"
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

### 為什麼 Windows 不支援焦點偵測？

原始碼中，`isTerminalFocused()` 函式在 Windows 上直接回傳 `false`：

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux 直接回傳 false
	// ... macOS 的焦點偵測邏輯
}
```

**原因**：
- Windows 不提供類似 macOS AppleScript 的前景應用程式查詢 API
- Windows PowerShell 可以取得前景視窗，但需要呼叫 COM 介面，實作複雜
- 目前版本優先保證穩定性，暫未實作 Windows 焦點偵測

### 為什麼 Windows 不支援點擊聚焦？

原始碼中，`sendNotification()` 函式只在 macOS 上設定 `activate` 選項：

```typescript
// src/notify.ts:238-240
// macOS-specific: click notification to focus terminal
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**原因**：
- Windows Toast 不支援 `activate` 參數
- Windows 通知只能透過應用程式 ID 關聯，無法動態指定目標視窗
- 點擊通知會開啟通知中心，而不是聚焦到特定視窗

## Windows 平台的最佳實踐

### 設定建議

由於 Windows 不支援焦點偵測，建議調整設定以減少通知噪音。

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
- `notifyChildSessions: false` - 只通知父會話，避免子任務噪音
- `quietHours.enabled: true` - 啟用靜音時段，避免夜間打擾

### 不支援的設定項

以下設定項在 Windows 上無效：

| 設定項 | macOS 效果 | Windows 效果 |
| --- | --- | --- |
| `sounds.idle` | 播放 Glass 音效 | 使用系統預設聲音 |
| `sounds.error` | 播放 Basso 音效 | 使用系統預設聲音 |
| `sounds.permission` | 播放 Submarine 音效 | 使用系統預設聲音 |

### 使用技巧

**技巧 1：手動關閉通知**

如果你正在查看終端機，不想被打擾：

1. 點擊工作列的「重要訊息中心」圖示（Windows + A）
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

**技巧 3：臨時停用外掛程式**

如果需要完全停用通知，可以刪除設定檔或設定靜音時段為全天：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "00:00",
    "end": "23:59"
  }
}
```

## 跟我做

### 驗證 Windows 通知

**第 1 步：觸發測試通知**

在 OpenCode 中輸入一個簡單任務：

```
請計算 1+1 的結果。
```

**你應該看到**：
- 右下角彈出 Windows Toast 通知
- 通知標題為 "Ready for review"
- 播放系統預設通知聲音

**第 2 步：測試焦點抑制（驗證不支援）**

保持終端機視窗在前景，再次觸發任務。

**你應該看到**：
- 通知仍然彈出（因為 Windows 不支援焦點偵測）

**第 3 步：測試點擊通知**

點擊彈出的通知。

**你應該看到**：
- 通知中心展開，而不是切換到終端機視窗

### 設定靜音時段

**第 1 步：建立設定檔**

編輯設定檔（PowerShell）：

```powershell
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
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

- [ ] Windows Toast 通知正常顯示
- [ ] 通知顯示正確的任務標題
- [ ] 靜音時段設定生效
- [ ] 了解 Windows 平台不支援的功能

## 踩坑提醒

### 常見問題 1：通知不顯示

**原因**：Windows 通知權限未授予

**解決方法**：

1. 開啟「設定」→「系統」→「通知」
2. 確保「取得來自應用程式和其他傳送者的通知」已開啟
3. 找到 OpenCode，確保通知權限已開啟

### 常見問題 2：終端機偵測失敗

**原因**：`detect-terminal` 無法識別你的終端機

**解決方法**：

在設定檔中手動指定終端機類型：

```json
{
  "terminal": "Windows Terminal"
}
```

### 常見問題 3：自訂音效不生效

**原因**：Windows 平台不支援自訂音效

**說明**：這是正常現象。Windows Toast 通知使用系統預設聲音，無法透過設定檔更改。

### 常見問題 4：點擊通知不聚焦終端機

**原因**：Windows Toast 不支援 `activate` 參數

**說明**：這是 Windows API 的限制。點擊通知會開啟通知中心，需要手動切換到終端機視窗。

## 本課小結

本課我們了解了：

- ✅ Windows 平台支援原生通知和終端機偵測
- ✅ Windows 不支援焦點偵測和點擊聚焦
- ✅ Windows 不支援自訂音效
- ✅ 推薦設定（靜音時段、只通知父會話）
- ✅ 常見問題的解決方法

**關鍵要點**：
1. Windows 平台功能相對基礎，但核心通知能力完整
2. 焦點偵測和點擊聚焦是 macOS 獨有功能
3. 透過靜音時段設定可以減少通知噪音
4. 終端機偵測支援手動指定，提高相容性

## 下一課預告

> 下一課我們學習 **[Linux 平台特性](../linux/)**。
>
> 你會學到：
> - Linux 平台的通知機制（notify-send）
> - Linux 終端機偵測能力
> - 與 Windows 平台的功能對比
> - Linux 發行版的相容性問題

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Windows 平台限制檢查（osascript） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Windows 平台限制檢查（焦點偵測） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS 特定：點擊聚焦 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| 通知發送（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 終端機偵測（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| 設定載入（跨平台） | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**關鍵函式**：
- `runOsascript()`：只在 macOS 上執行，Windows 回傳 null
- `isTerminalFocused()`：Windows 直接回傳 false
- `sendNotification()`：只在 macOS 上設定 `activate` 參數
- `detectTerminalInfo()`：跨平台終端機偵測

**平台判斷**：
- `process.platform === "darwin"`：macOS
- `process.platform === "win32"`：Windows
- `process.platform === "linux"`：Linux

</details>
