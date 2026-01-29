---
title: "瀏覽器自動化工具：網頁控制與 UI 自動化 | Clawdbot 教學"
sidebarTitle: "5 分鐘控制瀏覽器"
subtitle: "瀏覽器自動化工具：網頁控制與 UI 自動化 | Clawdbot 教學"
description: "學習如何使用 Clawdbot 的瀏覽器工具進行網頁自動化、截圖、操作表單和控制 UI。本教學涵蓋瀏覽器啟動、頁面快照、UI 互動（click/type/drag 等）、檔案上傳、對話框處理和遠端瀏覽器控制。掌握完整的工作流程，包括 Chrome 擴充功能中繼模式和獨立瀏覽器配置，以及在 iOS/Android 節點上執行瀏覽器操作。"
tags:
  - "browser"
  - "automation"
  - "ui"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 210
---

# 瀏覽器自動化工具：網頁控制與 UI 自動化

## 學完你能做什麼

- 啟動和控制 Clawdbot 管理的瀏覽器
- 使用 Chrome 擴充功能中繼接管你現有的 Chrome 分頁
- 拍攝網頁快照（AI/ARIA 格式）和截圖（PNG/JPEG）
- 執行 UI 自動化操作：點擊、輸入文字、拖曳、選擇、填表
- 處理檔案上傳和對話框（alert/confirm/prompt）
- 透過遠端瀏覽器控制伺服器操作分散式瀏覽器
- 使用節點代理在 iOS/Android 裝置上執行瀏覽器操作

## 你現在的困境

你已經執行了 Gateway，配置了 AI 模型，但瀏覽器工具的使用還有一些困惑：

- AI 無法存取網頁內容，只能靠你描述頁面結構？
- 想讓 AI 自動填表、點擊按鈕，但不知道怎麼做？
- 想截圖或儲存網頁，但每次都需要手動操作？
- 想用你自己的 Chrome 分頁（已登入的工作階段），而不是啟動一個新瀏覽器？
- 想在遠端裝置（如 iOS/Android 節點）上執行瀏覽器操作？

## 什麼時候用這一招

**瀏覽器工具適用場景**：

| 場景 | Action | 範例 |
| ---- | ------ | ---- |
| 自動化表單 | `act` + `fill` | 填寫註冊表單、提交訂單 |
| 網頁抓取 | `snapshot` | 提取網頁結構、抓取資料 |
| 截圖儲存 | `screenshot` | 儲存網頁截圖、儲存證據 |
| 檔案上傳 | `upload` | 上傳履歷、上傳附件 |
| 對話框處理 | `dialog` | 接受/拒絕 alert/confirm |
| 使用現有工作階段 | `profile="chrome"` | 在已登入的 Chrome 分頁上操作 |
| 遠端控制 | `target="node"` | 在 iOS/Android 節點上執行 |

## 🎒 開始前的準備

::: warning 前置檢查

在使用瀏覽器工具前，請確保：

1. ✅ Gateway 已啟動（`clawdbot gateway start`）
2. ✅ AI 模型已配置（Anthropic / OpenAI / OpenRouter 等）
3. ✅ 瀏覽器工具已啟用（`browser.enabled=true`）
4. ✅ 了解你要使用的 target（sandbox/host/custom/node）
5. ✅ 如使用 Chrome 擴充功能中繼，已安裝並啟用擴充功能

:::

## 核心思路

**瀏覽器工具是什麼？**

瀏覽器工具是 Clawdbot 內建的自動化工具，允許 AI 透過 CDP（Chrome DevTools Protocol）控制瀏覽器：

- **控制伺服器**：`http://127.0.0.1:18791`（預設）
- **UI 自動化**：基於 Playwright 的元素定位和操作
- **快照機制**：AI 格式或 ARIA 格式，傳回頁面結構和元素參考
- **多目標支援**：sandbox（預設）、host（Chrome 中繼）、custom（遠端）、node（裝置節點）

**兩種瀏覽器模式**：

| 模式 | Profile | 驅動 | 說明 |
| ---- | ------- | ---- | ---- |
| **獨立瀏覽器** | `clawd`（預設） | clawd | Clawdbot 啟動一個獨立的 Chrome/Chromium 實例 |
| **Chrome 中繼** | `chrome` | extension | 接管你現有的 Chrome 分頁（需安裝擴充功能） |

**工作流程**：

```
1. 啟動瀏覽器（start）
   ↓
2. 開啟分頁（open）
   ↓
3. 取得頁面快照（snapshot）→ 得到元素參考（ref）
   ↓
4. 執行 UI 操作（act：click/type/fill/drag）
   ↓
5. 驗證結果（screenshot/snapshot）
```

## 跟我做

### 第 1 步：啟動瀏覽器

**為什麼**

第一次使用瀏覽器工具時，需要先啟動瀏覽器控制伺服器。

```bash
# 在聊天中告訴 AI 啟動瀏覽器
請啟動瀏覽器

# 或使用瀏覽器工具
action: start
profile: clawd  # 或 chrome（Chrome 擴充功能中繼）
target: sandbox
```

**你應該看到**：

```
✓ Browser control server: http://127.0.0.1:18791
✓ Profile: clawd
✓ CDP endpoint: http://127.0.0.1:18792
✓ Headless: false
✓ Color: #FF4500
```

::: tip 檢查點

- 看到 `Browser control server` 表示啟動成功
- 預設使用 `clawd` profile（獨立瀏覽器）
- 如需使用 Chrome 擴充功能中繼，使用 `profile="chrome"`
- 瀏覽器視窗會自動開啟（非 headless 模式）

:::

### 第 2 步：開啟網頁

**為什麼**

開啟目標網頁，準備進行自動化操作。

```bash
# 在聊天中
請開啟 https://example.com

# 或使用瀏覽器工具
action: open
targetUrl: https://example.com
profile: clawd
target: sandbox
```

**你應該看到**：

```
✓ Tab opened: https://example.com
targetId: tab_abc123
url: https://example.com
```

::: tip 元素參考（targetId）

每次開啟或聚焦分頁時，都會傳回 `targetId`，這個 ID 用於後續操作（snapshot/act/screenshot）。

:::

### 第 3 步：取得頁面快照

**為什麼**

快照讓 AI 理解頁面結構，傳回可操作的元素參考（ref）。

```bash
# 取得 AI 格式快照（預設）
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: ai
refs: aria  # 使用 Playwright aria-ref ids（跨呼叫穩定）

# 或取得 ARIA 格式快照（結構化輸出）
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: aria
```

**你應該看到**（AI 格式）：

```
Page snapshot:

[header]
  Logo [aria-label="Example Logo"]
  Navigation [role="navigation"]
    Home [href="/"] [ref="e1"]
    About [href="/about"] [ref="e2"]
    Contact [href="/contact"] [ref="e3"]

[main]
  Hero section
    Title: "Welcome to Example" [ref="e4"]
    Button: "Get Started" [ref="e5"] [type="primary"]

[form section]
  Login form
    Input: Email [type="email"] [ref="e6"]
    Input: Password [type="password"] [ref="e7"]
    Button: "Sign In" [ref="e8"]
```

::: tip 快照格式選擇

| 格式 | 用途 | 特點 |
| ---- | ---- | ---- |
| `ai` | 預設，AI 理解 | 可讀性好，適合 AI 解析 |
| `aria` | 結構化輸出 | 適合需要精確結構的場景 |
| `refs="aria"` | 跨呼叫穩定 | 推薦用於多步操作（snapshot → act） |

:::

### 第 4 步：執行 UI 操作（act）

**為什麼**

使用快照中傳回的元素參考（ref）執行自動化操作。

```bash
# 點擊按鈕
action: act
request: {
  kind: "click",
  ref: "e5",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 輸入文字
action: act
request: {
  kind: "type",
  ref: "e6",
  text: "user@example.com",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 填寫表單（多個欄位）
action: act
request: {
  kind: "fill",
  fields: [
    { ref: "e6", value: "user@example.com" },
    { ref: "e7", value: "password123" }
  ],
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 點擊提交按鈕
action: act
request: {
  kind: "click",
  ref: "e8",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox
```

**你應該看到**：

```
✓ Clicked ref=e5
✓ Typed "user@example.com" into ref=e6
✓ Typed "password123" into ref=e7
✓ Clicked ref=e8
✓ Form submitted successfully
```

::: tip 常用 UI 操作

| 操作 | Kind | 參數 |
| ---- | ---- | ---- |
| 點擊 | `click` | `ref`, `doubleClick`, `button`, `modifiers` |
| 輸入文字 | `type` | `ref`, `text`, `submit`, `slowly` |
| 按鍵 | `press` | `key`, `targetId` |
| 懸停 | `hover` | `ref`, `targetId` |
| 拖曳 | `drag` | `startRef`, `endRef`, `targetId` |
| 選擇 | `select` | `ref`, `values` |
| 填表 | `fill` | `fields`（陣列） |
| 等待 | `wait` | `timeMs`, `text`, `textGone`, `selector` |
| 執行 JS | `evaluate` | `fn`, `ref`, `targetId` |

:::

### 第 5 步：截取網頁截圖

**為什麼**

驗證操作結果或儲存網頁截圖。

```bash
# 截取當前分頁
action: screenshot
profile: clawd
targetId: tab_abc123
type: png

# 截取全頁
action: screenshot
profile: clawd
targetId: tab_abc123
fullPage: true
type: png

# 截取指定元素
action: screenshot
profile: clawd
targetId: tab_abc123
ref: "e4"  # 使用快照中的 ref
type: jpeg
```

**你應該看到**：

```
📸 Screenshot saved: ~/.clawdbot/media/browser-screenshot-12345.png
```

::: tip 截圖格式

| 格式 | 用途 |
| ---- | ---- |
| `png` | 預設，無損壓縮，適合文件 |
| `jpeg` | 有損壓縮，檔案較小，適合儲存 |

:::

### 第 6 步：處理檔案上傳

**為什麼**

自動化表單中的檔案上傳操作。

```bash
# 先觸發檔案選擇器（點擊上傳按鈕）
action: act
request: {
  kind: "click",
  ref: "upload_button"
}
profile: clawd
targetId: tab_abc123

# 然後上傳檔案
action: upload
paths:
  - "/Users/you/Documents/resume.pdf"
  - "/Users/you/Documents/photo.jpg"
ref: "upload_button"  # 可選：指定檔案選擇器的 ref
targetId: tab_abc123
profile: clawd
```

**你應該看到**：

```
✓ Files uploaded: 2
  - /Users/you/Documents/resume.pdf
  - /Users/you/Documents/photo.jpg
```

::: warning 檔案路徑注意

- 使用絕對路徑，不支援相對路徑
- 確保檔案存在且有讀取權限
- 多個檔案時按陣列順序上傳

:::

### 第 7 步：處理對話框

**為什麼**

自動處理網頁中的 alert、confirm、prompt 對話框。

```bash
# 接受對話框（alert/confirm）
action: dialog
accept: true
targetId: tab_abc123
profile: clawd

# 拒絕對話框（confirm）
action: dialog
accept: false
targetId: tab_abc123
profile: clawd

# 回答 prompt 對話框
action: dialog
accept: true
promptText: "使用者輸入的答案"
targetId: tab_abc123
profile: clawd
```

**你應該看到**：

```
✓ Dialog handled: accepted (prompt: "使用者輸入的答案")
```

## 踩坑提醒

### ❌ 錯誤：Chrome 擴充功能中繼未連接

**錯誤訊息**：
```
No Chrome tabs are attached via Clawdbot Browser Relay extension. Click toolbar icon on tab you want to control (badge ON), then retry.
```

**原因**：使用了 `profile="chrome"` 但沒有附加任何分頁

**解決方法**：

1. 安裝 Clawdbot Browser Relay 擴充功能（Chrome Web Store）
2. 在要控制的分頁上點擊擴充功能圖示（徽章顯示 ON）
3. 重新執行 `action: snapshot profile="chrome"`

### ❌ 錯誤：元素參考過期（stale targetId）

**錯誤訊息**：
```
Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.
```

**原因**：分頁已關閉或 targetId 過期

**解決方法**：

```bash
# 重新取得分頁列表
action: tabs
profile: chrome

# 使用新的 targetId
action: snapshot
targetId: "新的_targetId"
profile: chrome
```

### ❌ 錯誤：瀏覽器控制伺服器未啟動

**錯誤訊息**：
```
Browser control server not available. Run action=start first.
```

**原因**：瀏覽器控制伺服器未啟動

**解決方法**：

```bash
# 啟動瀏覽器
action: start
profile: clawd
target: sandbox
```

### ❌ 錯誤：遠端瀏覽器連線逾時

**錯誤訊息**：
```
Remote CDP handshake timeout. Check remoteCdpTimeoutMs/remoteCdpHandshakeTimeoutMs.
```

**原因**：遠端瀏覽器連線逾時

**解決方法**：

```bash
# 在設定檔中增加逾時時間
# ~/.clawdbot/clawdbot.json
{
  "browser": {
    "remoteCdpTimeoutMs": 3000,
    "remoteCdpHandshakeTimeoutMs": 5000
  }
}
```

### ❌ 錯誤：節點瀏覽器代理不可用

**錯誤訊息**：
```
Node browser proxy is disabled (gateway.nodes.browser.mode=off).
```

**原因**：節點瀏覽器代理被停用

**解決方法**：

```bash
# 在設定檔中啟用節點瀏覽器
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "nodes": {
      "browser": {
        "mode": "auto"  # 或 "manual"
      }
    }
  }
}
```

## 本課小結

本課學習了：

✅ **瀏覽器控制**：啟動/停止/狀態檢查
✅ **分頁管理**：開啟/聚焦/關閉分頁
✅ **頁面快照**：AI/ARIA 格式，取得元素參考
✅ **UI 自動化**：click/type/drag/fill/wait/evaluate
✅ **截圖功能**：PNG/JPEG 格式，全頁或元素截圖
✅ **檔案上傳**：處理檔案選擇器，支援多檔案
✅ **對話框處理**：accept/reject/alert/confirm/prompt
✅ **Chrome 中繼**：使用 `profile="chrome"` 接管現有分頁
✅ **節點代理**：透過 `target="node"` 在裝置節點上執行

**關鍵操作速查**：

| 操作 | Action | 關鍵參數 |
| ---- | ------ | -------- |
| 啟動瀏覽器 | `start` | `profile`（clawd/chrome） |
| 開啟網頁 | `open` | `targetUrl` |
| 取得快照 | `snapshot` | `targetId`, `snapshotFormat`, `refs` |
| UI 操作 | `act` | `request.kind`, `request.ref` |
| 截圖 | `screenshot` | `targetId`, `fullPage`, `ref` |
| 檔案上傳 | `upload` | `paths`, `ref` |
| 對話框 | `dialog` | `accept`, `promptText` |

## 下一課預告

> 下一課我們學習 **[命令執行工具與審批](../tools-exec/)**。
>
> 你會學到：
> - 配置和使用 exec 工具
> - 了解安全審批機制
> - 設定 allowlist 控制可執行命令
> - 使用沙箱隔離風險操作

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
| ---- | -------- | ---- |
| Browser 工具定義 | [`src/agents/tools/browser-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/browser-tool.ts) | 269-791 |
| Browser Schema | [`src/agents/tools/browser-tool.schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/browser-tool.schema.ts) | 1-115 |
| Action 類型定義 | [`src/browser/client-actions-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/client-actions-core.ts) | 18-86 |
| 瀏覽器配置解析 | [`src/browser/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/config.ts) | 140-231 |
| 瀏覽器常數 | [`src/browser/constants.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/constants.ts) | 1-9 |
| CDP 客戶端 | [`src/browser/cdp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/cdp.ts) | 1-500 |
| Chrome 執行檔偵測 | [`src/browser/chrome.executables.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/chrome.executables.ts) | 1-500 |

**關鍵常數**：
- `DEFAULT_CLAWD_BROWSER_CONTROL_URL = "http://127.0.0.1:18791"`：預設控制伺服器位址（來源：`src/browser/constants.ts:2`）
- `DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000`：AI 快照預設最大字元數（來源：`src/browser/constants.ts:6`）
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 10000`：efficient 模式最大字元數（來源：`src/browser/constants.ts:7`）
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH = 6`：efficient 模式深度（來源：`src/browser/constants.ts:8`）

**關鍵函數**：
- `createBrowserTool()`：建立瀏覽器工具，定義所有 actions 和參數處理
- `browserSnapshot()`：取得頁面快照，支援 AI/ARIA 格式
- `browserScreenshotAction()`：執行截圖操作，支援全頁和元素截圖
- `browserAct()`：執行 UI 自動化操作（click/type/drag/fill/wait/evaluate 等）
- `browserArmFileChooser()`：處理檔案上傳，觸發檔案選擇器
- `browserArmDialog()`：處理對話框（alert/confirm/prompt）
- `resolveBrowserConfig()`：解析瀏覽器配置，傳回控制伺服器位址和連接埠
- `resolveProfile()`：解析 profile 配置（clawd/chrome）

**Browser Actions Kind**（來源：`src/agents/tools/browser-tool.schema.ts:5-17`）：
- `click`：點擊元素
- `type`：輸入文字
- `press`：按鍵
- `hover`：懸停
- `drag`：拖曳
- `select`：選擇下拉選項
- `fill`：填寫表單（多個欄位）
- `resize`：調整視窗大小
- `wait`：等待
- `evaluate`：執行 JavaScript
- `close`：關閉分頁

**Browser Tool Actions**（來源：`src/agents/tools/browser-tool.schema.ts:19-36`）：
- `status`：取得瀏覽器狀態
- `start`：啟動瀏覽器
- `stop`：停止瀏覽器
- `profiles`：列出所有 profiles
- `tabs`：列出所有分頁
- `open`：開啟新分頁
- `focus`：聚焦分頁
- `close`：關閉分頁
- `snapshot`：取得頁面快照
- `screenshot`：截取截圖
- `navigate`：導航到指定 URL
- `console`：取得主控台訊息
- `pdf`：儲存頁面為 PDF
- `upload`：上傳檔案
- `dialog`：處理對話框
- `act`：執行 UI 操作

</details>
