---
title: "macOS 平台特性：焦點偵測、點擊聚焦和自訂音效 | opencode-notify"
sidebarTitle: "點擊通知回到終端機"
subtitle: "macOS 平台特性"
description: "學習 opencode-notify 在 macOS 平台的獨有功能：智慧焦點偵測避免重複通知、點擊通知自動聚焦終端機、12 種內建音效自訂。本教學詳細講解設定方法、可用音效清單和實用技巧，幫你充分利用 macOS 原生通知能力，提升工作效率，減少不必要的視窗切換。"
tags:
  - "平台特性"
  - "macOS"
  - "焦點偵測"
prerequisite:
  - "start-quick-start"
order: 30
---

# macOS 平台特性

## 學完你能做什麼

- ✅ 設定智慧焦點偵測，讓外掛知道你在看終端機
- ✅ 點擊通知自動聚焦終端機視窗
- ✅ 自訂不同事件的通知音效
- ✅ 理解 macOS 平台獨有的優勢和限制

## 你現在的困境

你使用 OpenCode 時經常切換視窗：AI 在背景執行任務，你切換到瀏覽器查資料，每過幾十秒就得切回去看看：任務完成了嗎？出錯了？還是在等待你的輸入？

如果有個原生的桌面通知就好了，就像收到 LINE 訊息那樣，AI 完成任務或需要你時提醒你一下。

## 什麼時候用這一招

- **你在 macOS 上使用 OpenCode** - 本課內容僅適用於 macOS
- **你希望優化工作流程** - 避免頻繁切視窗檢查 AI 狀態
- **你想要更好的通知體驗** - 利用 macOS 原生通知的優勢

::: info 為什麼 macOS 更強大？
macOS 平台提供完整的通知能力：焦點偵測、點擊聚焦、自訂音效。Windows 和 Linux 目前只支援基礎的原生通知功能。
:::

## 🎒 開始前的準備

在開始之前，確保你已經完成：

::: warning 前置檢查
- [ ] 已完成[快速開始](/zh-tw/kdcokenny/opencode-notify/start/quick-start/)教學
- [ ] 外掛已安裝並正常運作
- [ ] 使用 macOS 系統
:::

## 核心思路

macOS 平台的完整通知體驗建立在三個關鍵能力上：

### 1. 智慧焦點偵測

外掛知道你目前是否在看終端機視窗。如果你正在審查 AI 的輸出，就不會再發通知打擾你。只有當你切換到其他應用程式時，通知才會發送。

**實現原理**：透過 macOS 的 `osascript` 系統服務查詢目前前景應用程式的程序名稱，與你使用的終端機程序名稱進行比對。

### 2. 點擊通知聚焦終端機

收到通知後，直接點擊通知卡片，終端機視窗會自動置頂。你可以立即回到工作狀態。

**實現原理**：macOS Notification Center 支援 `activate` 選項，傳入應用程式的 Bundle ID 就能實現點擊聚焦。

### 3. 自訂音效

為不同類型的事件設定不同的聲音：任務完成用清脆的音效，出錯用低沉的音效，讓你不看通知也能大致了解情況。

**實現原理**：利用 macOS 系統內建的 14 種標準音效（如 Glass、Basso、Submarine），設定檔的 `sounds` 欄位指定即可。

::: tip 三大能力的協作
焦點偵測避免打擾 → 點擊通知快速回歸 → 音效快速區分事件類型
:::

## 跟我做

### 第 1 步：驗證自動偵測的終端機

外掛會在啟動時自動偵測你使用的終端機模擬器。讓我們檢查一下是否識別正確。

**為什麼**

外掛需要知道你的終端機是什麼，才能實現焦點偵測和點擊聚焦功能。

**操作**

1. 開啟你的 OpenCode 設定目錄：
   ```bash
   ls ~/.config/opencode/
   ```

2. 如果你已經建立過 `kdco-notify.json` 設定檔，查看是否有 `terminal` 欄位：
   ```bash
   cat ~/.config/opencode/kdco-notify.json
   ```

3. 如果設定檔中沒有 `terminal` 欄位，說明外掛正在使用自動偵測。

**你應該看到**

如果設定檔中沒有 `terminal` 欄位，外掛會自動偵測。支援的終端機包括：
- **常見終端機**：Ghostty、Kitty、iTerm2、WezTerm、Alacritty
- **系統終端機**：macOS 自帶的 Terminal.app
- **其他終端機**：Hyper、Warp、VS Code 整合終端機等

::: info 37+ 終端機支援
外掛使用 `detect-terminal` 函式庫，支援 37+ 終端機模擬器。如果你的終端機不在常用清單中，也會嘗試自動識別。
:::

### 第 2 步：設定自訂音效

macOS 提供了 14 種內建音效，你可以為不同事件分配不同的聲音。

**為什麼**

不同的聲音讓你不看通知就能大致了解發生了什麼：任務完成還是出錯，AI 在等待還是僅僅完成任務。

**操作**

1. 開啟或建立設定檔：
   ```bash
   nano ~/.config/opencode/kdco-notify.json
   ```

2. 新增或修改 `sounds` 設定：

```json
{
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

3. 儲存並退出（Ctrl+O，Enter，Ctrl+X）

**你應該看到**

設定檔中 `sounds` 欄位有四個選項：

| 欄位 | 作用 | 預設值 | 推薦設定 |
| --- | --- | --- | --- |
| `idle` | 任務完成音效 | Glass | Glass（清脆） |
| `error` | 錯誤通知音效 | Basso | Basso（低沉） |
| `permission` | 權限請求音效 | Submarine | Submarine（提醒） |
| `question` | AI 提問音效（可選） | permission | Purr（柔和） |

::: tip 推薦組合
這個預設組合符合直覺：完成用輕快的聲音，出錯用警告的聲音，權限請求用提醒的聲音。
:::

### 第 3 步：了解可用的音效清單

macOS 有 14 種內建音效，你可以隨意組合。

**為什麼**

了解所有可用的音效，幫你找到最適合自己工作習慣的組合。

**可用音效**

| 音效名 | 聽感特點 | 適用場景 |
| --- | --- | --- |
| Glass | 輕快、清脆 | 任務完成 |
| Basso | 低沉、警告 | 錯誤通知 |
| Submarine | 提醒、柔和 | 權限請求 |
| Blow | 強勁 | 重要事件 |
| Bottle | 清脆 | 子任務完成 |
| Frog | 輕鬆 | 非正式提醒 |
| Funk | 節奏感 | 多任務完成 |
| Hero | 宏偉 | 里程碑完成 |
| Morse | 摩爾斯電碼 | 除錯相關 |
| Ping | 清脆 | 輕量級提醒 |
| Pop | 短促 | 快速任務 |
| Purr | 柔和 | 不打擾提醒 |
| Sosumi | 獨特 | 特殊事件 |
| Tink | 清亮 | 小任務完成 |

::: tip 聽音識意
設定完成後，試試不同音效的組合，找到最適合你工作流程的設定。
:::

### 第 4 步：測試點擊聚焦功能

點擊通知後，終端機視窗會自動置頂。這是 macOS 的獨有功能。

**為什麼**

當你收到通知時，不需要手動切換到終端機並尋找視窗，點擊通知直接回到工作狀態。

**操作**

1. 確保 OpenCode 正在執行，並啟動一個 AI 任務
2. 切換到其他應用程式（如瀏覽器）
3. 等待 AI 任務完成，你會收到 "Ready for review" 通知
4. 點擊通知卡片

**你應該看到**

- 通知消失
- 終端機視窗自動置頂並取得焦點
- 你可以立即審查 AI 的輸出

::: info 聚焦原理
外掛透過 osascript 動態取得終端機應用程式的 Bundle ID，然後在發送通知時傳入 `activate` 選項。macOS Notification Center 收到這個選項後，點擊通知就會自動啟用對應應用程式。
:::

### 第 5 步：驗證焦點偵測功能

當你正在查看終端機時，不會收到通知。這樣避免重複提醒。

**為什麼**

如果你已經在看終端機，通知就是多餘的。只有當你切換到其他應用程式時，通知才有意義。

**操作**

1. 開啟 OpenCode，啟動一個 AI 任務
2. 保持終端機視窗在前景（不要切換）
3. 等待任務完成

**你應該看到**

- 沒有收到 "Ready for review" 通知
- 終端機內顯示任務完成

**接著試試**：

1. 啟動另一個 AI 任務
2. 切換到瀏覽器或其他應用程式
3. 等待任務完成

**你應該看到**

- 收到了 "Ready for review" 通知
- 播放了設定的音效（預設 Glass）

::: tip 焦點偵測的智慧之處
外掛知道你什麼時候在看終端機，什麼時候不在。這樣既不會錯過重要提醒，也不會被重複通知打擾。
:::

## 檢查點 ✅

### 設定檢查

- [ ] 設定檔 `~/.config/opencode/kdco-notify.json` 存在
- [ ] `sounds` 欄位已設定（至少包含 idle、error、permission）
- [ ] 沒有設定 `terminal` 欄位（使用自動偵測）

### 功能檢查

- [ ] AI 任務完成後能收到通知
- [ ] 點擊通知後終端機視窗置頂
- [ ] 在終端機視窗前景時，不會收到重複通知
- [ ] 不同事件類型播放不同的音效

::: danger 焦點偵測失效？
如果點擊通知後終端機沒有置頂，可能是：
1. 終端機應用程式沒有被正確識別 - 檢查設定檔中的 `terminal` 欄位
2. Bundle ID 取得失敗 - 查看 OpenCode 日誌中的錯誤資訊
:::

## 踩坑提醒

### 音效不播放

**問題**：設定了音效，但通知時沒有聲音

**可能原因**：
1. 系統音量太低或靜音
2. macOS 系統偏好設定中停用了通知聲音

**解決方法**：
1. 檢查系統音量和通知設定
2. 開啟「系統設定 → 通知 → OpenCode」，確保啟用了聲音

### 點擊通知沒有聚焦

**問題**：點擊通知後，終端機視窗沒有置頂

**可能原因**：
1. 終端機應用程式沒有被自動偵測到
2. Bundle ID 取得失敗

**解決方法**：
1. 手動指定終端機類型：
   ```json
   {
     "terminal": "ghostty"  // 或其他終端機名稱
   }
   ```

2. 確保終端機應用程式名稱正確（大小寫敏感）

### 焦點偵測不運作

**問題**：即使終端機在前景，仍然收到通知

**可能原因**：
1. 終端機程序名稱偵測失敗
2. 終端機應用程式不在自動偵測清單中

**解決方法**：
1. 手動指定終端機類型：
   ```json
   {
     "terminal": "ghostty"  // 或其他終端機名稱
   }
   ```

2. 確保終端機應用程式名稱正確（大小寫敏感）
3. 查看日誌，確認終端機是否被正確識別

## 本課小結

macOS 平台提供了完整的通知體驗：

| 功能 | 作用 | 平台支援 |
| --- | --- | --- |
| 原生通知 | 顯示系統級通知 | ✅ macOS<br>✅ Windows<br>✅ Linux |
| 自訂音效 | 不同事件不同聲音 | ✅ macOS |
| 焦點偵測 | 避免重複通知 | ✅ macOS |
| 點擊聚焦 | 快速回歸工作 | ✅ macOS |

**核心設定**：
```json
{
  "sounds": {
    "idle": "Glass",       // 任務完成
    "error": "Basso",      // 出錯
    "permission": "Submarine"  // 權限請求
  }
}
```

**工作流程**：
1. AI 完成任務 → 發送通知 → 播放 Glass 音效
2. 你在瀏覽器工作 → 收到通知 → 點擊
3. 終端機自動置頂 → 審查 AI 輸出

## 下一課預告

> 下一課我們學習 **[Windows 平台特性](/zh-tw/kdcokenny/opencode-notify/platforms/windows/)**。
>
> 你會學到：
> - Windows 平台支援哪些功能
> - 與 macOS 相比有哪些差異
> - 如何在 Windows 上設定通知

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 焦點偵測 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| 點擊聚焦 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Bundle ID 取得 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| 前景應用程式偵測 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| 終端機名稱對應 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 預設音效設定 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L59-L61) | 59-61 |
| macOS 音效清單 | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
| 平台功��對比表 | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L54-L62) | 54-62 |

**關鍵常數**：

- `TERMINAL_PROCESS_NAMES` (行 71-84)：終端機名稱到 macOS 程序名稱的對應表
  - `ghostty` → `"Ghostty"`
  - `kitty` → `"kitty"`
  - `iterm` / `iterm2` → `"iTerm2"`
  - `wezterm` → `"WezTerm"`
  - `alacritty` → `"Alacritty"`
  - `terminal` / `apple_terminal` → `"Terminal"`
  - `hyper` → `"Hyper"`
  - `warp` → `"Warp"`
  - `vscode` → `"Code"`
  - `vscode-insiders` → `"Code - Insiders"`

**預設設定**：

- `sounds.idle = "Glass"`：任務完成音效
- `sounds.error = "Basso"`：錯誤通知音效
- `sounds.permission = "Submarine"`：權限請求音效

**關鍵函式**：

- `isTerminalFocused(terminalInfo)` (行 166-175)：偵測終端機是否為前景應用程式
  - 使用 `osascript` 取得前景應用程式程序名稱
  - 與終端機的 `processName` 進行比對（不區分大小寫）
  - 僅在 macOS 平台啟用

- `getBundleId(appName)` (行 135-137)：動態取得應用程式的 Bundle ID
  - 使用 `osascript` 查詢
  - Bundle ID 用於點擊通知聚焦功能

- `getFrontmostApp()` (行 139-143)：取得目前前景應用程式
  - 使用 `osascript` 查詢 System Events
  - 回傳前景應用程式的程序名稱

- `sendNotification(options)` (行 227-243)：發送通知
  - macOS 特性：如果偵測到平台為 darwin 且有 `terminalInfo.bundleId`，設定 `activate` 選項實現點擊聚焦

</details>
