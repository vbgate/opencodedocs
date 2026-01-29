---
title: "iOS 節點設定：連接 Gateway 與相機 Canvas Voice Wake | Clawdbot 教程"
sidebarTitle: "讓 AI 用 iPhone"
subtitle: "iOS 節點設定指南"
description: "學習如何設定 iOS 節點連接到 Gateway，使用相機拍照、Canvas 視覺化介面、Voice Wake 語音喚醒、Talk Mode 連續對話、位置取得等裝置本機操作功能，透過 Bonjour 和 Tailscale 自動發現，配對認證和安全控制後實現多裝置 AI 協同，支援前景背景和權限管理。"
tags:
  - "iOS 節點"
  - "裝置節點"
  - "Canvas"
  - "Voice Wake"
prerequisite:
  - "start-gateway-startup"
order: 170
---

# iOS 節點設定指南

## 學完你能做什麼

設定 iOS 節點後，你可以：

- ✅ 讓 AI 助手呼叫 iOS 裝置的相機拍照或錄製影片
- ✅ 在 iOS 裝置上渲染 Canvas 視覺化介面
- ✅ 使用 Voice Wake 和 Talk Mode 進行語音互動
- ✅ 取得 iOS 裝置的位置資訊
- ✅ 透過 Gateway 統一管理多個裝置節點

## 你現在的困境

你希望在自己的 iOS 裝置上擴充 AI 助手的能力，讓它能夠：

- **呼叫相機拍照或錄製影片**：當你說「拍張照」時，AI 能自動使用 iPhone 拍照
- **顯示視覺化介面**：在 iPhone 上展示 AI 生成的圖表、表單或控制面板
- **語音喚醒和連續對話**：無需動手，直接說「Clawd」就能喚醒助手開始對話
- **取得裝置資訊**：讓 AI 知道你的位置、螢幕狀態等資訊

## 什麼時候用這一招

- **行動場景**：你希望 AI 能使用 iPhone 的相機、螢幕等能力
- **多裝置協同**： Gateway 執行在伺服器上，但需要呼叫本機裝置功能
- **語音互動**：想要用 iPhone 作為便攜式語音助手終端

::: info 什麼是 iOS 節點？
iOS 節點是執行在 iPhone/iPad 上的 Companion 應用程式，透過 WebSocket 連接到 Clawdbot Gateway。它不是 Gateway 本身，而是作為「外設」提供裝置本機操作能力。

**與 Gateway 的差別**：
- **Gateway**：執行在伺服器/macOS 上，負責訊息路由、AI 模型呼叫、工具分發
- **iOS 節點**：執行在 iPhone 上，負責執行裝置本機操作（相機、Canvas、位置等）
:::

---

## 🎒 開始前的準備

::: warning 前置要求

在開始之前，請確認：

1. **Gateway 已啟動並執行**
   - 確保 Gateway 在另一台裝置上執行（macOS、Linux 或 Windows via WSL2）
   - Gateway 綁定到可存取的網路位址（區域網路或 Tailscale）

2. **網路連線性**
   - iOS 裝置和 Gateway 在同一區域網路（推薦），或透過 Tailscale 連線
   - iOS 裝置能存取 Gateway 的 IP 位址和連接埠（預設 18789）

3. **取得 iOS 應用程式**
   - iOS 應用程式目前是**內部預覽版**，不公開發布
   - 需要從原始碼建置或取得 TestFlight 測試版
:::

## 核心思路

iOS 節點的工作流程：

```
[Gateway] ←→ [iOS 節點]
     ↓            ↓
  [AI 模型]   [裝置能力]
     ↓            ↓
  [決策執行]   [相機/Canvas/語音]
```

**關鍵技術點**：

1. **自動發現**：透過 Bonjour（區域網路）或 Tailscale（跨網路）自動發現 Gateway
2. **配對認證**：首次連線需要 Gateway 端手動核准，建立信任關係
3. **通訊協定**：使用 WebSocket 通訊協定 (`node.invoke`) 傳送指令
4. **權限控制**：裝置本機指令需要使用者授權（相機、位置等）

**架構特點**：

- **安全性**：所有裝置操作都需要使用者在 iOS 端明確授權
- **隔離性**：節點不執行 Gateway，只執行本機操作
- **彈性**：支援前景、背景、遠端等多種使用場景

---

## 跟我做

### 第 1 步：啟動 Gateway

在 Gateway 主機上啟動服務：

```bash
clawdbot gateway --port 18789
```

**你應該看到**：

```
✅ Gateway running on ws://0.0.0.0:18789
✅ Bonjour advertisement active: _clawdbot._tcp
```

::: tip 跨網路存取
如果 Gateway 和 iOS 裝置不在同一區域網路，使用 **Tailscale Serve/Funnel**：

```bash
clawdbot gateway --port 18789 --tailscale funnel
```

iOS 裝置會透過 Tailscale 自動發現 Gateway。
:::

### 第 2 步：iOS 應用程式連線

在 iOS 應用程式中：

1. 開啟 **Settings**（設定）
2. 找到 **Gateway** 部分
3. 選擇一個自動發現的 Gateway（或在下方啟用 **Manual Host** 手動輸入主機和連接埠）

**你應該看到**：

- 應用程式嘗試連線到 Gateway
- 狀態顯示為 "Connected" 或 "Pairing pending"

::: details 手動設定主機

如果自動發現失敗，手動輸入 Gateway 位址：

1. 啟用 **Manual Host**
2. 輸入 Gateway 主機（如 `192.168.1.100`）
3. 輸入連接埠（預設 `18789`）
4. 點擊 "Connect"

:::

### 第 3 步：核准配對請求

**在 Gateway 主機上**，核准 iOS 節點的配對請求：

```bash
# 查看待核准的節點
clawdbot nodes pending

# 核准特定節點（替換 <requestId>）
clawdbot nodes approve <requestId>
```

**你應該看到**：

```
✅ Node paired successfully
Node: iPhone (iOS)
ID: node-abc123
```

::: tip 拒絕配對
如果想拒絕某個節點的連線請求：

```bash
clawdbot nodes reject <requestId>
```

:::

**檢查點 ✅**：在 Gateway 上驗證節點狀態

```bash
clawdbot nodes status
```

你應該看到你的 iOS 節點顯示為 `paired` 狀態。

### 第 4 步：測試節點連線

**從 Gateway 測試節點通訊**：

```bash
# 透過 Gateway 呼叫節點指令
clawdbot gateway call node.list --params "{}"
```

**你應該看到**：

```json
{
  "result": [
    {
      "id": "node-abc123",
      "displayName": "iPhone (iOS)",
      "platform": "ios",
      "capabilities": ["camera", "canvas", "location", "screen", "voicewake"]
    }
  ]
}
```

---

## 使用節點功能

### 相機拍照

iOS 節點支援相機拍照和錄製影片：

```bash
# 拍照（預設前置攝像頭）
clawdbot nodes camera snap --node "iPhone (iOS)"

# 拍照（後置攝像頭，自訂解析度）
clawdbot nodes camera snap --node "iPhone (iOS)" --facing back --max-width 1920

# 錄製影片（5秒）
clawdbot nodes camera clip --node "iPhone (iOS)" --duration 5000
```

**你應該看到**：

```
MEDIA:/tmp/clawdbot-camera-snap-abc123.jpg
```

::: warning 前景要求
相機指令要求 iOS 應用程式處於**前景**。如果應用程式在背景，會返回 `NODE_BACKGROUND_UNAVAILABLE` 錯誤。

:::

**iOS 相機參數**：

| 參數 | 類型 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `facing` | `front\|back` | `front` | 攝像頭朝向 |
| `maxWidth` | number | `1600` | 最大寬度（像素） |
| `quality` | `0..1` | `0.9` | JPEG 品質（0-1） |
| `durationMs` | number | `3000` | 影片長度（毫秒） |
| `includeAudio` | boolean | `true` | 是否包含音訊 |

### Canvas 視覺化介面

iOS 節點可以顯示 Canvas 視覺化介面：

```bash
# 導航到 URL
clawdbot nodes canvas navigate --node "iPhone (iOS)" --target "https://example.com"

# 執行 JavaScript
clawdbot nodes canvas eval --node "iPhone (iOS)" --js "document.title"

# 截圖（儲存為 JPEG）
clawdbot nodes canvas snapshot --node "iPhone (iOS)" --format jpeg --max-width 900
```

**你應該看到**：

```
MEDIA:/tmp/clawdbot-canvas-snap-abc123.jpg
```

::: tip A2UI 自動推送
如果 Gateway 設定了 `canvasHost`，iOS 節點會在連線時自動導航到 A2UI 介面。
:::

### Voice Wake 語音喚醒

在 iOS 應用程式的 **Settings** 中啟用 Voice Wake：

1. 開啟 **Voice Wake** 開關
2. 設定喚醒詞（預設："clawd"、"claude"、"computer"）
3. 確保 iOS 授權了麥克風權限

::: info 全域喚醒詞
Clawdbot 的喚醒詞是**全域設定**，由 Gateway 管理。所有節點（iOS、Android、macOS）使用同一份喚醒詞清單。

修改喚醒詞會自動同步到所有裝置。
:::

### Talk Mode 連續對話

啟用 Talk Mode 後，AI 會持續透過 TTS 朗讀回覆，並持續監聽語音輸入：

1. 在 iOS 應用程式 **Settings** 中啟用 **Talk Mode**
2. AI 回覆時會自動朗讀
3. 可以透過語音持續對話，無需手動點擊

::: warning 背景限制
iOS 可能會暫停背景音訊。當應用程式不在前景時，語音功能是**盡力而為**（best-effort）。
:::

---

## 常見問題

### 配對提示從未出現

**問題**：iOS 應用程式顯示 "Connected"，但 Gateway 沒有彈出配對提示。

**解決**：

```bash
# 1. 手動查看待核准節點
clawdbot nodes pending

# 2. 核准節點
clawdbot nodes approve <requestId>

# 3. 驗證連線
clawdbot nodes status
```

### 連線失敗（重裝後）

**問題**：重裝 iOS 應用程式後無法連線到 Gateway。

**原因**：Keychain 中的配對 Token 已被清除。

**解決**：重新執行配對流程（步驟 3）。

### A2UI_HOST_NOT_CONFIGURED

**問題**：Canvas 指令失敗，提示 `A2UI_HOST_NOT_CONFIGURED`。

**原因**：Gateway 沒有設定 `canvasHost` URL。

**解決**：

在 Gateway 設定中設定 Canvas 主機：

```bash
clawdbot config set canvasHost "http://<gateway-host>:18793/__clawdbot__/canvas/"
```

### NODE_BACKGROUND_UNAVAILABLE

**問題**：相機/Canvas 指令失敗，返回 `NODE_BACKGROUND_UNAVAILABLE`。

**原因**：iOS 應用程式不在前景。

**解決**：將 iOS 應用程式切換到前景，然後重試指令。

---

## 本課小結

透過本課，你學會了：

✅ iOS 節點的概念和架構
✅ 如何自動發現和連線到 Gateway
✅ 配對認證流程
✅ 使用相機、Canvas、Voice Wake 等功能
✅ 常見問題的排查方法

**核心要點**：

- iOS 節點是裝置本機操作能力的提供者，不是 Gateway
- 所有裝置操作都需要使用者授權和前景狀態
- 配對是安全的必要步驟，只信任已核准的節點
- Voice Wake 和 Talk Mode 需要麥克風權限

## 下一課預告

> 下一課我們學習 **[Android 節點設定](../android-node/)**。
>
> 你會學到：
> - 如何設定 Android 節點連線到 Gateway
> - 使用 Android 裝置的相機、螢幕錄製、Canvas 功能
> - 處理 Android 特有的權限和相容性問題

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| iOS 應用程式入口 | [`apps/ios/Sources/ClawdbotApp.swift`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/ClawdbotApp.swift) | 1-30 |
| Canvas 渲染 | [`apps/ios/Sources/RootCanvas.swift`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/RootCanvas.swift) | 1-250 |
| Gateway 連線 | [`apps/ios/Sources/Gateway/`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/Gateway/) | - |
| 節點通訊協定 runner | [`src/node-host/runner.ts`](https://github.com/moltbot/moltbot/blob/main/src/node-host/runner.ts) | 1-1100 |
| 節點設定 | [`src/node-host/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/node-host/config.ts) | 1-50 |
| iOS 平台文件 | [`docs/platforms/ios.md`](https://github.com/moltbot/moltbot/blob/main/docs/platforms/ios.md) | 1-105 |
| 節點系統文件 | [`docs/nodes/index.md`](https://github.com/moltbot/moltbot/blob/main/docs/nodes/index.md) | 1-306 |

**關鍵常數**：
- `GATEWAY_DEFAULT_PORT = 18789`：Gateway 預設連接埠
- `NODE_ROLE = "node"`：節點連線的角色識別

**關鍵指令**：
- `clawdbot nodes pending`：列出待核准的節點
- `clawdbot nodes approve <requestId>`：核准節點配對
- `clawdbot nodes invoke --node <id> --command <cmd>`：呼叫節點指令
- `clawdbot nodes camera snap --node <id>`：拍照
- `clawdbot nodes canvas navigate --node <id> --target <url>`：導航 Canvas

**通訊協定方法**：
- `node.invoke.request`：節點指令呼叫請求
- `node.invoke.result`：節點指令執行結果
- `voicewake.get`：取得喚醒詞清單
- `voicewake.set`：設定喚醒詞清單
- `voicewake.changed`：喚醒詞變更事件

</details>
