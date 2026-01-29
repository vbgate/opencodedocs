---
title: "Canvas 可視化介面與 A2UI | Clawdbot 教程"
sidebarTitle: "為 AI 建立視覺化介面"
subtitle: "Canvas 可視化介面與 A2UI"
description: "學習使用 Clawdbot 的 Canvas 可視化介面，了解 A2UI 推送機制、Canvas Host 配置和節點 Canvas 操作，為 AI 助手建立互動式 UI。本教程涵蓋靜態 HTML 和動態 A2UI 兩種方式，包括 canvas 工具的完整指令參考、安全機制、配置選項和疑難排解技巧。"
tags:
  - "Canvas"
  - "A2UI"
  - "視覺化介面"
  - "節點"
prerequisite:
  - "start-getting-started"
  - "platforms-ios-node"
  - "platforms-android-node"
order: 240
---

# Canvas 可視化介面與 A2UI

## 學完你能做什麼

完成本課後，你將能夠：

- 配置 Canvas Host 並部署自訂 HTML/CSS/JS 介面
- 使用 `canvas` 工具控制節點 Canvas（顯示、隱藏、導航、執行 JS）
- 掌握 A2UI 協定，讓 AI 動態推送 UI 更新
- 擷取 Canvas 截圖用於 AI 上下文
- 理解 Canvas 安全機制和權限控制

## 你現在的困境

你有一個 AI 助手，但它只能透過文字與你互動。你想：

- 讓 AI 顯示視覺化介面，例如表格、圖表、表單
- 在行動裝置上看到 Agent 產生的動態 UI
- 建立類似「App」的互動體驗，而不需要獨立開發

## 什麼時候用這一招

**Canvas + A2UI 適合這些場景**：

| 場景 | 範例 |
| ------ | ------ |
| **資料視覺化** | 顯示統計圖表、進度條、時間線 |
| **互動式表單** | 讓使用者確認操作、選擇選項 |
| **狀態面板** | 即時顯示任務進度、系統狀態 |
| **遊戲和娛樂** | 簡單小遊戲、互動示範 |

::: tip A2UI vs. 靜態 HTML
- **A2UI**（Agent-to-UI）：AI 動態產生和更新 UI，適合即時資料
- **靜態 HTML**：預先寫好的介面，適合固定版面和複雜互動
:::

## 🎒 開始前的準備

在開始之前，確保你已完成：

- [ ] **Gateway 已啟動**：Canvas Host 預設隨 Gateway 自動啟動（連接埠 18793）
- [ ] **節點已配對**：macOS/iOS/Android 節點已連接到 Gateway
- [ ] **節點支援 Canvas**：確認節點有 `canvas` 能力（`clawdbot nodes list`）

::: warning 前置知識
本教程假設你已了解：
- [節點配對基礎](../../platforms/android-node/)
- [AI 工具呼叫機制](../tools-browser/)
:::

## 核心思路

Canvas 系統包含三個核心元件：

```
┌─────────────────┐
│   Canvas Host  │ ────▶ HTTP 伺服器 (連接埠 18793)
│   (Gateway)   │        └── 服務 ~/clawd/canvas/ 檔案
└─────────────────┘
        │
        │ WebSocket 通訊
        │
┌─────────────────┐
│    Node App   │ ────▶ WKWebView 渲染 Canvas
│ (iOS/Android) │        └── 透過 A2UI 接收推送
└─────────────────┘
        │
        │ userAction 事件
        │
┌─────────────────┐
│   AI Agent    │ ────▶ canvas 工具呼叫
│  (pi-mono)   │        └── 推送 A2UI 更新
└─────────────────┘
```

**關鍵概念**：

1. **Canvas Host**（Gateway 端）
   - 提供靜態檔案服務：`http://<gateway-host>:18793/__clawdbot__/canvas/`
   - 託管 A2UI 主機：`http://<gateway-host>:18793/__clawdbot__/a2ui/`
   - 支援熱重載：檔案修改後自動重新整理

2. **Canvas Panel**（節點端）
   - macOS/iOS/Android 節點嵌入 WKWebView
   - 透過 WebSocket 連接 Gateway（即時重載、A2UI 通訊）
   - 支援 `eval` 執行 JS、`snapshot` 擷取畫面

3. **A2UI 協定**（v0.8）
   - Agent 透過 WebSocket 推送 UI 更新
   - 支援：`beginRendering`、`surfaceUpdate`、`dataModelUpdate`、`deleteSurface`

## 跟我做

### 第 1 步：驗證 Canvas Host 狀態

**為什麼**
確保 Canvas Host 正在執行，節點才能載入 Canvas 內容。

```bash
# 檢查連接埠 18793 是否被監聽
lsof -i :18793
```

**你應該看到**：

```text
COMMAND   PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
node     12345  user   16u  IPv6  0x1234      0t0  TCP *:18793 (LISTEN)
```

::: info 配置路徑
- **Canvas 根目錄**：`~/clawd/canvas/`（可透過 `canvasHost.root` 修改）
- **連接埠**：`18793` = `gateway.port + 4`（可透過 `canvasHost.port` 修改）
- **熱重載**：預設開啟（可透過 `canvasHost.liveReload: false` 關閉）
:::

### 第 2 步：建立第一個 Canvas 頁面

**為什麼**
建立自訂 HTML 介面，讓節點顯示你的內容。

```bash
# 建立 Canvas 根目錄（如果不存在）
mkdir -p ~/clawd/canvas

# 建立簡單的 HTML 檔案
cat > ~/clawd/canvas/hello.html <<'EOF'
<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hello Canvas</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    padding: 20px;
    background: #000;
    color: #fff;
    text-align: center;
  }
  h1 { color: #24e08a; }
</style>
<h1>🎉 Hello from Canvas!</h1>
<p>這是你的第一個 Canvas 頁面。</p>
<button onclick="alert('按鈕被點擊了！')">點擊我</button>
EOF
```

**你應該看到**：

```text
檔案已建立：~/clawd/canvas/hello.html
```

### 第 3 步：在節點上顯示 Canvas

**為什麼**
讓節點載入並顯示你剛建立的頁面。

首先查找你的節點 ID：

```bash
clawdbot nodes list
```

**你應該看到**：

```text
ID                                  Name          Type       Capabilities
──────────────────────────────────────────────────────────────────────────
abc123-def456-ghi789               iOS Phone     canvas, camera, screen
jkl012-mno345-pqr678               Android Tab   canvas, camera
```

然後顯示 Canvas（以 iOS 節點為例）：

```bash
# 方式 1：透過 CLI 指令
clawdbot nodes canvas present --node abc123-def456-ghi789 --target http://127.0.0.1:18793/__clawdbot__/canvas/hello.html
```

**你應該看到**：

- iOS 裝置上彈出一個無邊框面板，顯示你的 HTML 內容
- 面板靠近功能表列或滑鼠位置
- 內容居中對齊，帶有綠色標題和按鈕

**AI 呼叫範例**：

```
AI: 我在 iOS 裝置上為你開啟了一個 Canvas 面板，顯示歡迎頁面。
```

::: tip Canvas URL 格式
- **本機檔案**：`http://<gateway-host>:18793/__clawdbot__/canvas/hello.html`
- **外部網址**：`https://example.com`（需要節點有網路存取權限）
- **返回預設**：`/` 或空字串，顯示內建腳手架頁面
:::

### 第 4 步：使用 A2UI 推送動態 UI

**為什麼**
AI 可以不修改檔案，直接推送 UI 更新到 Canvas，適合即時資料和互動。

**方式 A：快速文字推送**

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --text "Hello from A2UI"
```

**你應該看到**：

- Canvas 顯示藍色 A2UI 介面
- 文字居中顯示：`Hello from A2UI`

**方式 B：完整 JSONL 推送**

建立 A2UI 定義檔案：

```bash
cat > /tmp/a2ui-demo.jsonl <<'EOF'
{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","status","button"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"A2UI 演示"},"usageHint":"h1"}}},{"id":"status","component":{"Text":{"text":{"literalString":"系統狀態：執行中"},"usageHint":"body"}}},{"id":"button","component":{"Button":{"label":{"literalString":"測試按鈕"},"onClick":{"action":{"name":"testAction","sourceComponentId":"demo.test"}}}}}]}
{"beginRendering":{"surfaceId":"main","root":"root"}}
EOF
```

推送 A2UI：

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --jsonl /tmp/a2ui-demo.jsonl
```

**你應該看到**：

```
┌────────────────────────────┐
│     A2UI 演示         │
│                        │
│  系統狀態：執行中       │
│                        │
│   [ 測試按鈕 ]          │
└────────────────────────────┘
```

::: details A2UI JSONL 格式說明
JSONL（JSON Lines）每行一個 JSON 物件，適合串流更新：

```jsonl
{"surfaceUpdate":{...}}   // 更新表面元件
{"beginRendering":{...}}   // 開始渲染
{"dataModelUpdate":{...}} // 更新資料模型
{"deleteSurface":{...}}   // 刪除表面
```
:::

### 第 5 步：執行 Canvas JavaScript

**為什麼**
在 Canvas 中執行自訂 JS，例如修改 DOM、讀取狀態。

```bash
clawdbot nodes canvas eval --node abc123-def456-ghi789 --js "document.title"
```

**你應該看到**：

```text
"Hello from Canvas"
```

::: tip JS 執行範例
- 讀取元素：`document.querySelector('h1').textContent`
- 修改樣式：`document.body.style.background = '#333'`
- 計算值：`innerWidth + 'x' + innerHeight`
- 閉包執行：`(() => { ... })()`
:::

### 第 6 步：擷取 Canvas 截圖

**為什麼**
讓 AI 看到目前的 Canvas 狀態，用於上下文理解。

```bash
# 預設格式（JPEG）
clawdbot nodes canvas snapshot --node abc123-def456-ghi789

# PNG 格式 + 最大寬度限制
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format png --max-width 1200

# 高品質 JPEG
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format jpg --quality 0.9
```

**你應該看到**：

```text
Canvas snapshot saved to: /var/folders/.../canvas-snapshot.jpg
```

檔案路徑由系統自動產生，通常在暫存目錄。

### 第 7 步：隱藏 Canvas

**為什麼**
關閉 Canvas 面板，釋放螢幕空間。

```bash
clawdbot nodes canvas hide --node abc123-def456-ghi789
```

**你應該看到**：

- iOS 裝置上的 Canvas 面板消失
- 節點狀態恢復（如果之前被佔用）

## 檢查點 ✅

**驗證 Canvas 功能是否正常運作**：

| 檢查項 | 驗證方法 |
| ------- | -------- |
| Canvas Host 執行 | `lsof -i :18793` 有輸出 |
| 節點 Canvas 能力 | `clawdbot nodes list` 顯示 `canvas` |
| 頁面載入成功 | 節點顯示 HTML 內容 |
| A2UI 推送成功 | Canvas 顯示藍色 A2UI 介面 |
| JS 執行傳回結果 | `eval` 指令傳回值 |
| 截圖產生檔案 | 暫存目錄有 `.jpg` 或 `.png` 檔案 |

## 踩坑提醒

::: warning 前台/後台限制
- **iOS/Android 節點**：`canvas.*` 和 `camera.*` 指令**必須在前台執行**
- 後台呼叫會傳回：`NODE_BACKGROUND_UNAVAILABLE`
- 解決方法：將裝置喚醒到前台
:::

::: danger 安全注意事項
- **目錄遍歷保護**：Canvas URL 禁止 `..` 存取上層目錄
- **自訂 Scheme**：`clawdbot-canvas://` 僅限節點內部使用
- **HTTPS 限制**：外部 HTTPS URL 需要節點網路權限
- **檔案存取**：Canvas Host 僅允許存取 `canvasHost.root` 下的檔案
:::

::: tip 除錯技巧
- **查看 Gateway 日誌**：`clawdbot gateway logs`
- **查看節點日誌**：iOS 設定 → Debug Logs，Android 應用內日誌
- **測試 URL**：在瀏覽器直接存取 `http://<gateway-host>:18793/__clawdbot__/canvas/`
:::

## 本課小結

本課你學會了：

1. **Canvas 架構**：理解 Canvas Host、Node App 和 A2UI 協定的關係
2. **配置 Canvas Host**：調整根目錄、連接埠和熱重載設定
3. **建立自訂頁面**：撰寫 HTML/CSS/JS 並部署到節點
4. **使用 A2UI**：透過 JSONL 推送動態 UI 更新
5. **執行 JavaScript**：在 Canvas 中執行程式碼，讀取和修改狀態
6. **擷取截圖**：讓 AI 看到目前 Canvas 狀態

**核心要點**：

- Canvas Host 隨 Gateway 自動啟動，無需額外配置
- A2UI 適合即時資料，靜態 HTML 適合複雜互動
- 節點必須在前台才能執行 Canvas 操作
- 使用 `canvas snapshot` 將 UI 狀態傳遞給 AI

## 下一課預告

> 下一課我們學習 **[語音喚醒與文字轉語音](../voice-tts/)**。
>
> 你會學到：
> - 配置 Voice Wake 喚醒關鍵字
> - 使用 Talk Mode 進行持續語音對話
> - 整合多種 TTS 提供商（Edge、Deepgram、ElevenLabs）

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
| ----- | --------- | ---- |
| Canvas Host 伺服器 | [`src/canvas-host/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/server.ts) | 372-441 |
| A2UI 協定處理 | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 150-203 |
| Canvas 工具定義 | [`src/agents/tools/canvas-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/canvas-tool.ts) | 52-179 |
| Canvas 路徑常數 | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 8-10 |

**關鍵常數**：
- `A2UI_PATH = "/__clawdbot__/a2ui"`：A2UI 主機路徑
- `CANVAS_HOST_PATH = "/__clawdbot__/canvas"`：Canvas 檔案路徑
- `CANVAS_WS_PATH = "/__clawdbot__/ws"`：WebSocket 熱重載路徑

**關鍵函式**：
- `createCanvasHost()`：啟動 Canvas HTTP 伺服器（連接埠 18793）
- `injectCanvasLiveReload()`：注入 WebSocket 熱重載腳本到 HTML
- `handleA2uiHttpRequest()`：處理 A2UI 資源請求
- `createCanvasTool()`：註冊 `canvas` 工具（present/hide/navigate/eval/snapshot/a2ui_push/a2ui_reset）

**支援的 Canvas Actions**：
- `present`：顯示 Canvas（可選 URL、位置、尺寸）
- `hide`：隱藏 Canvas
- `navigate`：導航到 URL（本機路徑/HTTP/file://）
- `eval`：執行 JavaScript
- `snapshot`：擷取截圖（PNG/JPEG，可選 maxWidth/quality）
- `a2ui_push`：推送 A2UI 更新（JSONL 或文字）
- `a2ui_reset`：重置 A2UI 狀態

**配置 Schema**：
- `canvasHost.root`：Canvas 根目錄（預設 `~/clawd/canvas`）
- `canvasHost.port`：HTTP 連接埠（預設 18793）
- `canvasHost.liveReload`：是否啟用熱重載（預設 true）
- `canvasHost.enabled`：是否啟用 Canvas Host（預設 true）

**A2UI v0.8 支援的訊息**：
- `beginRendering`：開始渲染指定表面
- `surfaceUpdate`：更新表面元件（Column、Text、Button 等）
- `dataModelUpdate`：更新資料模型
- `deleteSurface`：刪除指定表面

</details>
