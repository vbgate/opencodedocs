---
title: "支援的終端：37+ 終端模擬器全收錄與自動偵測原理完全詳解 | opencode-notify 教學"
sidebarTitle: "你的終端支援嗎"
subtitle: "支援的終端列表：37+ 終端模擬器全收錄"
description: "學習 opencode-notify 支援的 37+ 終端模擬器，包括 macOS、Windows、Linux 平台的完整終端列表。本教學介紹終端自動偵測原理、手動指定方法、解決終端識別失敗問題，幫助你優化通知體驗、啟用智慧過濾功能、避免通知噪音、減少視窗切換、保持專注工作狀態並有效提升工作效率與體驗。"
tags:
  - "終端"
  - "終端偵測"
  - "平台支援"
prerequisite:
  - "start-quick-start"
order: 60
---

# 支援的終端列表：37+ 終端模擬器全收錄

## 學完你能做什麼

- 了解 opencode-notify 支援的所有終端模擬器
- 查看你使用的終端是否在支援列表中
- 理解終端自動偵測的工作原理
- 學會如何手動指定終端類型

## 你現在的困境

你安裝了 opencode-notify,但通知功能不太正常。可能終端識別不到,或者焦點偵測失效。你使用的終端是 Alacritty / Windows Terminal / tmux,不確定是否被支援。終端識別失敗會導致智慧過濾功能失效,影響使用體驗。

## 什麼時候用這一招

**在以下場景下查看支援的終端列表**:
- 你想知道自己使用的終端是否被支援
- 終端自動偵測失敗,需要手動設定
- 你在多個終端之間切換,想了解相容性
- 你想知道終端偵測的技術原理

## 核心思路

opencode-notify 使用 `detect-terminal` 庫自動識別你使用的終端模擬器,**支援 37+ 終端**。偵測成功後,外掛可以:
- **啟用焦點偵測**(僅 macOS): 終端在前台時抑制通知
- **支援點擊聚焦**(僅 macOS): 點擊通知切換到終端視窗

::: info 為什麼終端偵測很重要?

終端偵測是智慧過濾的基礎:
- **焦點偵測**: 避免你正在查看終端時還彈出通知
- **點擊聚焦**: macOS 使用者點擊通知可以直接回到終端
- **效能優化**: 不同終端可能需要特殊處理

如果偵測失敗,通知功能仍可用,但智慧過濾會失效。
:::

## 支援的終端列表

### macOS 終端

| 終端名稱 | 程序名 | 特性 |
|--- | --- | ---|
| **Ghostty** | Ghostty | ✅ 焦點偵測 + ✅ 點擊聚焦 |
| **iTerm2** | iTerm2 | ✅ 焦點偵測 + ✅ 點擊聚焦 |
| **Kitty** | kitty | ✅ 焦點偵測 + ✅ 點擊聚焦 |
| **WezTerm** | WezTerm | ✅ 焦點偵測 + ✅ 點擊聚焦 |
| **Alacritty** | Alacritty | ✅ 焦點偵測 + ✅ 點擊聚焦 |
| **Terminal.app** | Terminal | ✅ 焦點偵測 + ✅ 點擊聚焦 |
| **Hyper** | Hyper | ✅ 焦點偵測 + ✅ 點擊聚焦 |
| **Warp** | Warp | ✅ 焦點偵測 + ✅ 點擊聚焦 |
| **VS Code 整合終端** | Code / Code - Insiders | ✅ 焦點偵測 + ✅ 點擊聚焦 |

::: tip macOS 終端特性
macOS 終端支援完整功能:
- 原生通知(Notification Center)
- 焦點偵測(透過 AppleScript)
- 點擊通知自動聚焦終端
- 自訂系統音效

所有終端都使用 macOS Notification Center 傳送通知。
:::

### Windows 終端

| 終端名稱 | 特性 |
|--- | ---|
| **Windows Terminal** | ✅ 原生通知(Toast) |
| **Git Bash** | ✅ 原生通知(Toast) |
| **ConEmu** | ✅ 原生通知(Toast) |
| **Cmder** | ✅ 原生通知(Toast) |
| **PowerShell** | ✅ 原生通知(Toast) |
| **VS Code 整合終端** | ✅ 原生通知(Toast) |
| **其他 Windows 終端** | ✅ 原生通知(Toast) |

::: details Windows 終端限制
Windows 平台功能相對基礎:
- ✅ 原生通知(Windows Toast)
- ✅ 終端偵測
- ❌ 焦點偵測(系統限制)
- ❌ 點擊聚焦(系統限制)

所有 Windows 終端都透過 Windows Toast 傳送通知,使用系統預設聲音。
:::

### Linux 終端

| 終端名稱 | 特性 |
|--- | ---|
| **konsole** | ✅ 原生通知(notify-send) |
| **xterm** | ✅ 原生通知(notify-send) |
| **lxterminal** | ✅ 原生通知(notify-send) |
| **alacritty** | ✅ 原生通知(notify-send) |
| **kitty** | ✅ 原生通知(notify-send) |
| **wezterm** | ✅ 原生通知(notify-send) |
| **VS Code 整合終端** | ✅ 原生通知(notify-send) |
| **其他 Linux 終端** | ✅ 原生通知(notify-send) |

::: details Linux 終端限制
Linux 平台功能相對基礎:
- ✅ 原生通知(notify-send)
- ✅ 終端偵測
- ❌ 焦點偵測(系統限制)
- ❌ 點擊聚焦(系統限制)

所有 Linux 終端都透過 notify-send 傳送通知,使用桌面環境預設聲音。
:::

### 其他支援的終端

`detect-terminal` 庫還支援以下終端(可能不完全列出):

**Windows / WSL**:
- WSL 終端
- Windows Command Prompt (cmd)
- PowerShell (pwsh)
- PowerShell Core (pwsh-preview)
- Cygwin Mintty
- MSYS2 MinTTY

**macOS / Linux**:
- tmux(透過環境變數偵測)
- screen
- rxvt-unicode (urxvt)
- rxvt
- Eterm
- eterm
- aterm
- wterm
- sakura
- roxterm
- xfce4-terminal
- pantheon-terminal
- lxterminal
- mate-terminal
- terminator
- tilix
- guake
- yakuake
- qterminal
- terminology
- deepin-terminal
- gnome-terminal
- konsole
- xterm
- uxterm
- eterm

::: tip 終端數量統計
opencode-notify 透過 `detect-terminal` 庫支援 **37+ 終端模擬器**。
如果你使用的終端不在列表中,可以查看[detect-terminal 完整列表](https://github.com/jonschlinkert/detect-terminal#supported-terminals)。
:::

## 終端偵測原理

### 自動偵測流程

外掛啟動時會自動偵測終端類型:

```
1. 呼叫 detect-terminal() 庫
    ↓
2. 掃描系統程序,識別目前終端
    ↓
3. 返回終端名稱(如 "ghostty", "kitty")
    ↓
4. 查詢對應表,取得 macOS 程序名稱
    ↓
5. macOS: 動態取得 Bundle ID
    ↓
6. 儲存終端資訊,用於後續通知
```

### macOS 終端對應表

源碼中預定義了常用終端的程序名稱對應:

```typescript
// src/notify.ts:71-84
const TERMINAL_PROCESS_NAMES: Record<string, string> = {
    ghostty: "Ghostty",
    kitty: "kitty",
    iterm: "iTerm2",
    iterm2: "iTerm2",
    wezterm: "WezTerm",
    alacritty: "Alacritty",
    terminal: "Terminal",
    apple_terminal: "Terminal",
    hyper: "Hyper",
    warp: "Warp",
    vscode: "Code",
    "vscode-insiders": "Code - Insiders",
}
```

::: details 偵測源碼
完整的終端偵測邏輯:

```typescript
// src/notify.ts:145-164
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
    // Use config override if provided
    const terminalName = config.terminal || detectTerminal() || null
    
    if (!terminalName) {
        return { name: null, bundleId: null, processName: null }
    }
    
    // Get process name for focus detection
    const processName = TERMINAL_PROCESS_NAMES[terminalName.toLowerCase()] || terminalName
    
    // Dynamically get bundle ID from macOS (no hardcoding!)
    const bundleId = await getBundleId(processName)
    
    return {
        name: terminalName,
        bundleId,
        processName,
    }
}
```

:::

### macOS 特殊處理

macOS 平台有額外的偵測步驟:

1. **取得 Bundle ID**: 透過 `osascript` 動態查詢應用程式的 Bundle ID(如 `com.mitchellh.ghostty`)
2. **焦點偵測**: 透過 `osascript` 查詢前台應用程式程序名稱
3. **點擊聚焦**: 通知設定 `activate` 參數,點擊時透過 Bundle ID 切換到終端

::: info 動態 Bundle ID 的好處
源碼不硬編碼 Bundle ID,而是透過 `osascript` 動態查詢。這意味著:
- ✅ 支援終端更新(Bundle ID 不變即可)
- ✅ 減少維護成本(不需要手動更新列表)
- ✅ 相容性更好(任何 macOS 終端理論上都支援)
:::

### tmux 終端支援

tmux 是一個終端多工器,外掛透過環境變數偵測 tmux 工作階段:

```bash
# 在 tmux 工作階段中
echo $TMUX
# 輸出: /tmp/tmux-1000/default,1234,0

# 不在 tmux 中
echo $TMUX
# 輸出: (空)
```

::: tip tmux 工作流程支援
tmux 使用者可以正常使用通知功能:
- 自動偵測到 tmux 工作階段
- 通知傳送到目前終端視窗
- **不進行焦點偵測**(支援 tmux 多視窗工作流程)
:::

## 手動指定終端

如果自動偵測失敗,你可以在設定檔中手動指定終端類型。

### 何時需要手動指定

以下情況需要手動設定:
- 你使用的終端不在 `detect-terminal` 支援列表中
- 你在一個終端中巢狀使用另一個終端(如 tmux + Alacritty)
- 自動偵測結果不正確(誤識別為其他終端)

### 設定方法

**第 1 步: 開啟設定檔**

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/kdco-notify.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

:::

**第 2 步: 新增 terminal 設定**

```json
{
  "terminal": "ghostty"
}
```

**第 3 步: 儲存並重啟 OpenCode**

### 可用終端名稱

終端名稱必須是 `detect-terminal` 庫識別的名稱。常見名稱:

| 終端 | 設定值 |
|--- | ---|
| Ghostty | `"ghostty"` |
| iTerm2 | `"iterm2"` 或 `"iterm"` |
| Kitty | `"kitty"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` 或 `"apple_terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code | `"vscode"` |
| VS Code Insiders | `"vscode-insiders"` |
| Windows Terminal | `"windows-terminal"` 或 `"Windows Terminal"` |

::: details 完整可用名稱
查看[detect-terminal 源碼](https://github.com/jonschlinkert/detect-terminal)取得完整列表。
:::

### macOS 終端完整功能範例

```json
{
  "terminal": "ghostty",
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

### Windows/Linux 終端範例

```json
{
  "terminal": "Windows Terminal",
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

::: warning Windows/Linux 設定限制
Windows 和 Linux 不支援 `sounds` 設定項(使用系統預設聲音),也不支援焦點偵測(系統限制)。
:::

## 檢查點 ✅

完成閱讀後,請確認:

- [ ] 知道自己使用的終端是否被支援
- [ ] 了解終端自動偵測的原理
- [ ] 知道如何手動指定終端類型
- [ ] 理解不同平台的功能差異

## 踩坑提醒

### 常見問題 1: 終端偵測失敗

**現象**: 通知不顯示,或者焦點偵測失效。

**原因**: `detect-terminal` 無法識別你的終端。

**解決方法**:

1. 確認你的終端名稱是否正確(大小寫敏感)
2. 在設定檔中手動指定:

```json
{
  "terminal": "你的終端名稱"
}
```

3. 查看[detect-terminal 支援列表](https://github.com/jonschlinkert/detect-terminal#supported-terminals)

### 常見問題 2: macOS 點擊聚焦失效

**現象**: 點擊通知不能切換到終端視窗。

**原因**: Bundle ID 取得失敗,或者終端未在對應表中。

**解決方法**:

1. 檢查終端是否在 `TERMINAL_PROCESS_NAMES` 對應表中
2. 如果不在,可以手動指定終端名稱

**驗證方法**:

```typescript
// 暫時除錯(在 notify.ts 中新增 console.log)
console.log("Terminal info:", terminalInfo)
// 應該看到 { name: "ghostty", bundleId: "com.mitchellh.ghostty", processName: "Ghostty" }
```

### 常見問題 3: tmux 終端焦點偵測不工作

**現象**: 在 tmux 工作階段中,終端在前台時仍彈出通知。

**原因**: tmux 有自己的工作階段管理,焦點偵測可能不準確。

**說明**: 這是正常現象。tmux 工作流程中,焦點偵測功能受限,但仍可以正常接收通知。

### 常見問題 4: VS Code 整合終端識別為 Code

**現象**: 設定中 `"vscode"` 和 `"vscode-insiders"` 都有效,但不知道該用哪個。

**說明**:
- 使用 **VS Code Stable** → 設定 `"vscode"`
- 使用 **VS Code Insiders** → 設定 `"vscode-insiders"`

自動偵測會根據安裝的版本自動選擇正確的程序名稱。

### 常見問題 5: Windows Terminal 識別失敗

**現象**: Windows Terminal 使用 "windows-terminal" 名稱,但偵測不到。

**原因**: Windows Terminal 的程序名稱可能是 `WindowsTerminal.exe` 或 `Windows Terminal`。

**解決方法**: 嘗試不同的設定值:

```json
{
  "terminal": "windows-terminal"  // 或 "Windows Terminal"
}
```

## 本課小結

本課我們了解了:

- ✅ opencode-notify 支援 37+ 終端模擬器
- ✅ macOS 終端支援完整功能(焦點偵測 + 點擊聚焦)
- ✅ Windows/Linux 終端支援基礎通知
- ✅ 終端自動偵測的原理和源碼實現
- ✅ 如何手動指定終端類型
- ✅ 常見終端識別問題的解決方法

**關鍵要點**:
1. 終端偵測是智慧過濾的基礎,支援 37+ 終端
2. macOS 終端功能最豐富,Windows/Linux 功能相對基礎
3. 自動偵測失敗時,可以手動設定終端名稱
4. tmux 使用者可以正常使用通知,但焦點偵測受限
5. macOS 的 Bundle ID 動態獲取,相容性更好

## 下一課預告

> 下一課我們學習 **[設定參考](../../advanced/config-reference/)**。
>
> 你會學到:
> - 完整的設定項說明和預設值
> - 音效自訂(macOS)
> - 靜音時段設定
> - 子工作階段通知開關
> - 終端類型覆蓋
> - 進階設定技巧

---

## 附錄:源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間:2026-01-27

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 終端對應表 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 終端偵測函式 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS Bundle ID 取得 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| macOS 前台應用程式偵測 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| macOS 焦點偵測 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |

**關鍵常數**:
- `TERMINAL_PROCESS_NAMES`: 終端名稱到 macOS 程序名的對應表

**關鍵函式**:
- `detectTerminalInfo()`: 偵測終端資訊(名稱、Bundle ID、程序名)
- `detectTerminal()`: 呼叫 detect-terminal 庫識別終端
- `getBundleId()`: 透過 osascript 動態取得 macOS 應用程式的 Bundle ID
- `getFrontmostApp()`: 查詢目前前台應用程式名稱
- `isTerminalFocused()`: 偵測終端是否為前台視窗(僅 macOS)

**外部依賴**:
- [detect-terminal](https://github.com/jonschlinkert/detect-terminal): 終端偵測庫,支援 37+ 終端

</details>
