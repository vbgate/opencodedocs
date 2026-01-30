---
title: "故障排除：通知不顯示、焦點偵測失效等常見問題 | opencode-notify 教學"
sidebarTitle: "通知不顯示怎麼辦"
subtitle: "故障排除：通知不顯示、焦點偵測失效等常見問題"
description: "解決 opencode-notify 使用中的常見問題，包括通知不顯示、焦點偵測失效、設定錯誤、音效不播放等。學會排查 macOS 通知權限、靜音時段設定、終端機偵測等問題，快速恢復外掛程式正常運作。"
tags:
  - "故障排除"
  - "FAQ"
prerequisite:
  - "start-quick-start"
order: 110
---

# 故障排除：通知不顯示、焦點偵測失效等常見問題

## 學完你能做什麼

- 快速定位通知不顯示的原因
- 解決 macOS 通知權限問題
- 排查焦點偵測失效的問題
- 修復設定檔格式錯誤
- 了解平台功能差異

## 你現在的困境

AI 完成了任務，但沒有收到通知；或者點擊通知後終端機沒有置頂。不知道哪裡出了問題，也不知道該從哪裡開始排查。

## 什麼時候用這一招

- 安裝外掛程式後第一次使用，沒有收到任何通知
- 更新外掛程式或系統後，通知突然不運作了
- 想停用某些通知行為，但設定似乎沒生效
- 從 macOS 切換到 Windows/Linux，發現某些功能不可用

## 核心思路

opencode-notify 的工作流程比較簡單，但涉及的環節較多：OpenCode SDK → 事件監聽 → 過濾邏輯 → 作業系統通知。任何一個環節出問題，都可能導致通知不顯示。

排查的關鍵是**按順序檢查每個環節**，從最可能的原因開始。80% 的問題都可以透過以下 5 類問題解決：

1. **通知不顯示** - 最常見的問題
2. **焦點偵測失效**（僅 macOS）
3. **設定不生效** - JSON 格式或路徑錯誤
4. **音效不播放**（僅 macOS）
5. **平台差異** - 某些功能不支援

---

## 問題 1：通知不顯示

這是最常見的問題，可能的原因有 6 種。按順序檢查：

### 1.1 檢查外掛程式是否正確安裝

**症狀**：OpenCode 正常執行，但從未收到任何通知。

**排查步驟**：

```bash
# 檢查外掛程式是否已安裝
ls ~/.opencode/plugin/kdco-notify

# 如果不存在，重新安裝
ocx add kdco/notify
```

**你應該看到**：`~/.opencode/plugin/kdco-notify` 目錄存在，並且包含 `package.json` 和 `src/notify.ts` 等檔案。

::: tip 手動安裝檢查
如果你使用手動安裝，確保：
1. 已安裝相依套件：`npm install node-notifier detect-terminal`
2. 外掛程式檔案在正確的位置：`~/.opencode/plugin/`
3. OpenCode 已重新啟動（外掛程式變更需要重新啟動）
:::

### 1.2 檢查 macOS 通知權限

**症狀**：僅限 macOS 使用者，外掛程式已安裝，但從未收到通知。

**原因**：macOS 需要明確授權終端機應用程式傳送通知的權限。

**排查步驟**：

```bash
# 1. 開啟系統設定
# macOS Ventura 及以上：系統設定 → 通知與專注模式
# macOS 舊版本：系統偏好設定 → 通知

# 2. 找到你的終端機應用程式（如 Ghostty、iTerm2、Terminal.app）
# 3. 確保「允許通知」已開啟
# 4. 確保「在鎖定畫面上」和「在螢幕鎖定時顯示橫幅」已開啟
```

**你應該看到**：你的終端機應用程式在通知設定中，且「允許通知」開關為綠色。

::: warning 常見錯誤
OpenCode 本身不會出現在通知設定中，你需要授權的是**終端機應用程式**（Ghostty、iTerm2、Terminal.app 等），不是 OpenCode。
:::

### 1.3 檢查靜音時段設定

**症狀**：特定時間段內沒有通知，其他時間段有通知。

**原因**：設定檔中啟用了靜音時段。

**排查步驟**：

```bash
# 檢查設定檔
cat ~/.config/opencode/kdco-notify.json
```

**解決方案**：

```json
{
  "quietHours": {
    "enabled": false,  // 改為 false 停用靜音時段
    "start": "22:00",
    "end": "08:00"
  }
}
```

**你應該看到**：`quietHours.enabled` 為 `false`，或者目前時間不在靜音時段內。

::: tip 跨午夜靜音時段
靜音時段支援跨午夜（如 22:00-08:00），這是正確的行為。如果目前時間是晚上 10 點到次日早上 8 點之間，通知會被抑制。
:::

### 1.4 檢查終端機視窗焦點

**症狀**：當你正在看終端機時，沒有收到通知。

**原因**：這是**預期行為**，不是 bug。焦點偵測機制會在你查看終端機時抑制通知，避免重複提醒。

**排查步驟**：

**檢查是否聚焦終端機**：
1. 切換到其他應用程式（如瀏覽器、VS Code）
2. 讓 AI 執行一個任務
3. 等待任務完成

**你應該看到**：在其他應用程式中時，通知正常顯示。

::: tip 焦點偵測說明
焦點偵測是內建行為，無法透過設定停用。外掛程式預設會抑制終端機聚焦時的通知，避免重複提醒。這是設計的預期行為。
:::

### 1.5 檢查子工作階段過濾

**症狀**：AI 執行了多個子任務，但沒有收到每個子任務的通知。

**原因**：這是**預期行為**。外掛程式預設只通知父工作階段，不通知子工作階段，避免通知轟炸。

**排查步驟**：

**理解父工作階段與子工作階段**：
- 父工作階段：你直接讓 AI 執行的任務（如「最佳化程式碼庫」）
- 子工作階段：AI 自己拆分的子任務（如「最佳化 src/components」、「最佳化 src/utils」）

**如果你確實需要子工作階段通知**：

```json
{
  "notifyChildSessions": true
}
```

**你應該看到**：每個子工作階段完成時都會收到通知。

::: tip 建議做法
除非你在監控多個並行任務，否則保持 `notifyChildSessions: false`，只接收父工作階段通知即可。
:::

### 1.6 檢查設定檔是否被刪除或重新命名

**症狀**：之前有通知，突然不顯示了。

**排查步驟**：

```bash
# 檢查設定檔是否存在
ls -la ~/.config/opencode/kdco-notify.json
```

**解決方案**：

如果設定檔被刪除或路徑錯誤，外掛程式會使用預設設定：

**刪除設定檔，恢復預設**：

```bash
# 刪除設定檔，使用預設設定
rm ~/.config/opencode/kdco-notify.json
```

**你應該看到**：外掛程式重新開始傳送通知（使用預設設定）。

---

## 問題 2：焦點偵測失效（僅 macOS）

**症狀**：你在看終端機時，仍然收到通知，焦點偵測似乎沒有生效。

### 2.1 檢查終端機是否被正確偵測

**原因**：外掛程式使用 `detect-terminal` 函式庫自動識別終端機，如果識別失敗，焦點偵測就無法運作。

**排查步驟**：

```bash
# 檢查終端機偵測是否正常
node -e "console.log(require('detect-terminal')())"
```

**你應該看到**：輸出你的終端機名稱（如 `ghostty`、`iterm2` 等）。

如果輸出為空，說明終端機偵測失敗。

### 2.2 手動指定終端機類型

**如果自動偵測失敗，可以手動指定**：

```json
{
  "terminal": "ghostty"  // 替換為你的終端機名稱
}
```

**支援的終端機名稱**（小寫）：

| 終端機 | 名稱 | 終端機 | 名稱 |
| --- | --- | --- | --- |
| Ghostty | `ghostty` | Kitty | `kitty` |
| iTerm2 | `iterm2` 或 `iterm` | WezTerm | `wezterm` |
| Alacritty | `alacritty` | macOS Terminal | `terminal` 或 `apple_terminal` |
| Hyper | `hyper` | Warp | `warp` |
| VS Code 終端機 | `vscode` | VS Code Insiders | `vscode-insiders` |

::: tip 處理程序名稱對應
外掛程式內部有終端機名稱到 macOS 處理程序名稱的對應表。如果你手動指定了 `terminal`，確保使用對應表中的名稱（第 71-84 行）。
:::

---

## 問題 3：設定不生效

**症狀**：修改了設定檔，但外掛程式行為沒有變化。

### 3.1 檢查 JSON 格式是否正確

**常見錯誤**：

```json
// ❌ 錯誤：缺少引號
{
  notifyChildSessions: true
}

// ❌ 錯誤：尾部逗號
{
  "notifyChildSessions": true,
}

// ❌ 錯誤：註解不支援
{
  "notifyChildSessions": true  // 這會導致 JSON 解析失敗
}
```

**正確格式**：

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

**驗證 JSON 格式**：

```bash
# 使用 jq 驗證 JSON 格式
cat ~/.config/opencode/kdco-notify.json | jq '.'

# 如果輸出格式化的 JSON，說明格式正確
# 如果報錯，說明 JSON 有問題
```

### 3.2 檢查設定檔路徑

**症狀**：建立了設定檔，但外掛程式似乎沒讀取。

**正確路徑**：

```
~/.config/opencode/kdco-notify.json
```

**排查步驟**：

```bash
# 檢查設定檔是否存在
ls -la ~/.config/opencode/kdco-notify.json

# 如果不存在，建立目錄和檔案
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/kdco-notify.json << 'EOF'
{
  "notifyChildSessions": false
}
EOF
```

### 3.3 重新啟動 OpenCode

**原因**：外掛程式在啟動時載入一次設定，修改後需要重新啟動。

**排查步驟**：

```bash
# 完全重新啟動 OpenCode
# 1. 結束 OpenCode
# 2. 重新啟動 OpenCode
```

---

## 問題 4：音效不播放（僅 macOS）

**症狀**：通知正常顯示，但沒有播放音效。

### 4.1 檢查音效名稱是否正確

**支援的 macOS 音效**：

| 音效名稱 | 說明 | 音效名稱 | 說明 |
| --- | --- | --- | --- |
| Basso | 低音 | Blow | 吹氣聲 |
| Bottle | 瓶子聲 | Frog | 青蛙聲 |
| Funk | 放克 | Glass | 玻璃聲（預設任務完成） |
| Hero | 英雄 | Morse | 摩斯電碼 |
| Ping | 叮聲 | Pop | 氣泡聲 |
| Purr | 呼嚕聲 | Sosumi | Sosumi |
| Submarine | 潛艇（預設權限請求） | Tink | 叮叮聲 |

**設定範例**：

```json
{
  "sounds": {
    "idle": "Glass",      // 任務完成音效
    "error": "Basso",    // 錯誤音效
    "permission": "Submarine",  // 權限請求音效
    "question": "Ping"   // 問題詢問音效（可選）
  }
}
```

### 4.2 檢查系統音量設定

**排查步驟**：

```bash
# 開啟系統設定 → 聲音 → 輸出音量
# 確保音量未靜音，且音量適中
```

### 4.3 其他平台不支援自訂音效

**症狀**：Windows 或 Linux 使用者，設定了音效但沒有聲音。

**原因**：自訂音效是 macOS 獨有功能，Windows 和 Linux 不支援。

**解決方案**：Windows 和 Linux 使用者會收到通知，但音效由系統預設設定控制，無法透過外掛程式設定。

::: tip Windows/Linux 音效
Windows 和 Linux 的通知音效由系統設定控制：
- Windows：設定 → 系統 → 通知 → 選擇通知音效
- Linux：桌面環境設定 → 通知 → 音效
:::

---

## 問題 5：點擊通知不聚焦（僅 macOS）

**症狀**：點擊通知後，終端機視窗沒有置頂。

### 5.1 檢查 Bundle ID 是否取得成功

**原因**：點擊通知聚焦功能需要取得終端機的 Bundle ID（如 `com.ghostty.Ghostty`），如果取得失敗，就無法聚焦。

**排查步驟**：

外掛程式會在啟動時自動偵測終端機並取得 Bundle ID。如果失敗，點擊通知聚焦功能不可用。

**常見原因**：
1. 終端機不在對應表中（如自訂終端機）
2. `osascript` 執行失敗（macOS 權限問題）

**解決方案**：手動指定終端機類型（見 2.2 節）。

### 5.2 檢查系統輔助使用權限

**原因**：macOS 需要「輔助使用」權限才能控制其他應用程式的視窗。

**排查步驟**：

```bash
# 開啟系統設定 → 隱私權與安全性 → 輔助使用
# 確保終端機應用程式有輔助使用權限
```

**你應該看到**：你的終端機應用程式（Ghostty、iTerm2 等）在輔助使用清單中，且開關已開啟。

---

## 問題 6：平台功能差異

**症狀**：從 macOS 切換到 Windows/Linux，發現某些功能不可用。

### 6.1 功能對照表

| 功能 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| 原生通知 | ✅ | ✅ | ✅ |
| 自訂音效 | ✅ | ❌ | ❌ |
| 焦點偵測 | ✅ | ❌ | ❌ |
| 點擊通知聚焦 | ✅ | ❌ | ❌ |
| 終端機偵測 | ✅ | ✅ | ✅ |
| 靜音時段 | ✅ | ✅ | ✅ |
| 子工作階段通知 | ✅ | ✅ | ✅ |

**說明**：
- **Windows/Linux**：只支援基礎通知功能，進階功能（焦點偵測、點擊聚焦、自訂音效）不可用
- **macOS**：支援所有功能

### 6.2 設定檔跨平台相容性

**問題**：在 macOS 上設定了 `sounds`，切換到 Windows 後音效不生效。

**原因**：`sounds` 設定只在 macOS 上有效。

**解決方案**：設定檔可以跨平台使用，外掛程式會自動忽略不支援的設定項目。無需刪除 `sounds` 欄位，Windows/Linux 會靜默忽略。

::: tip 最佳實務
使用同一套設定檔在多個平台之間切換，外掛程式會自動處理平台差異。無需為每個平台建立單獨的設定檔。
:::

---

## 本課小結

opencode-notify 的故障排查可以歸納為以下 6 類問題：

1. **通知不顯示**：檢查外掛程式安裝、macOS 通知權限、靜音時段、終端機焦點、子工作階段過濾、外掛程式是否停用
2. **焦點偵測失效**（macOS）：檢查終端機是否被正確偵測，或手動指定終端機類型
3. **設定不生效**：檢查 JSON 格式、設定檔路徑、重新啟動 OpenCode
4. **音效不播放**（macOS）：檢查音效名稱是否正確，確認音效只在 macOS 支援
5. **點擊通知不聚焦**（macOS）：檢查 Bundle ID 取得和輔助使用權限
6. **平台功能差異**：Windows/Linux 只支援基礎通知，進階功能僅在 macOS 可用

**快速排查清單**：

```
□ 外掛程式是否正確安裝？
□ macOS 通知權限是否授權？
□ 靜音時段是否啟用？
□ 終端機是否聚焦？
□ 子工作階段過濾是否啟用？
□ 設定檔 JSON 格式是否正確？
□ 設定檔路徑是否正確？
□ 是否重新啟動了 OpenCode？
□ 音效名稱是否在支援清單中（僅 macOS）？
□ Bundle ID 是否取得成功（僅 macOS）？
□ 系統音量是否正常？
```

---

## 下一課預告

> 下一課我們學習 **[常見問題](../common-questions/)**。
>
> 你會學到：
> - opencode-notify 是否會增加對話上下文的開銷
> - 會不會收到大量通知轟炸
> - 如何臨時停用通知
> - 效能影響和隱私安全問題

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 設定載入與錯誤處理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| 終端機偵測 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS osascript 執行 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L120-L133) | 120-133 |
| 終端機焦點偵測 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| 靜音時段檢查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| 父工作階段偵測 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| 通知傳送 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 預設設定 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| 終端機處理程序名稱對應 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 任務完成處理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 |
| 錯誤通知處理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 |
| 權限請求處理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 |
| 問題詢問處理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 |

**關鍵常數**：

- `DEFAULT_CONFIG`：預設設定（第 56-68 行）
  - `notifyChildSessions: false`：預設不通知子工作階段
  - `sounds.idle: "Glass"`：任務完成音效
  - `sounds.error: "Basso"`：錯誤音效
  - `sounds.permission: "Submarine"`：權限請求音效
  - `quietHours.start: "22:00"`、`quietHours.end: "08:00"`：預設靜音時段

- `TERMINAL_PROCESS_NAMES`：終端機名稱到 macOS 處理程序名稱的對應（第 71-84 行）

**關鍵函式**：

- `loadConfig()`：載入並合併設定檔與預設設定，設定檔不存在或無效時使用預設值
- `detectTerminalInfo()`：偵測終端機資訊（名稱、Bundle ID、處理程序名稱）
- `isTerminalFocused()`：檢查終端機是否為目前前景應用程式（macOS）
- `isQuietHours()`：檢查目前時間是否在靜音時段內
- `isParentSession()`：檢查工作階段是否為父工作階段
- `sendNotification()`：傳送原生通知，支援 macOS 點擊聚焦
- `runOsascript()`：執行 AppleScript（macOS），失敗時傳回 null
- `getBundleId()`：取得應用程式的 Bundle ID（macOS）

**業務規則**：

- BR-1-1：預設只通知父工作階段，不通知子工作階段（`notify.ts:256-259`）
- BR-1-2：終端機聚焦時抑制通知（`notify.ts:265`）
- BR-1-3：靜音時段內不傳送通知（`notify.ts:262`）
- BR-1-4：權限請求始終通知，無需父工作階段檢查（`notify.ts:319`）
- BR-1-5：問題詢問不做焦點檢查，支援 tmux 工作流程（`notify.ts:340`）
- BR-1-6：macOS 支援點擊通知聚焦終端機（`notify.ts:238-240`）

**例外處理**：

- `loadConfig()`：設定檔不存在或 JSON 解析失敗時，使用預設設定（`notify.ts:110-113`）
- `isParentSession()`：工作階段查詢失敗時，假設是父工作階段（通知而非遺漏）（`notify.ts:210-212`）
- `runOsascript()`：osascript 執行失敗時傳回 null（`notify.ts:120-132`）
- `handleSessionIdle()`：工作階段資訊取得失敗時，使用預設標題（`notify.ts:274-276`）

</details>
