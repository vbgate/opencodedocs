---
title: "WebChat 介面：瀏覽器內的 AI 助手 | Clawdbot 教程"
sidebarTitle: "試試網頁版 AI"
subtitle: "WebChat 介面：瀏覽器內的 AI 助手"
description: "學習如何使用 Clawdbot 內建的 WebChat 介面與 AI 助手對話。本教程介紹 WebChat 的存取方式、核心功能（對話管理、附件上傳、Markdown 支援）和遠端存取設定（SSH 隧道、Tailscale），無需額外埠或單獨設定。"
tags:
  - "WebChat"
  - "瀏覽器介面"
  - "聊天"
prerequisite:
  - "start-gateway-startup"
order: 150
---

# WebChat 介面：瀏覽器內的 AI 助手

## 學完你能做什麼

完成本教程後，你將能夠：

- ✅ 透過瀏覽器存取 WebChat 介面
- ✅ 在 WebChat 中傳送訊息並接收 AI 回覆
- ✅ 管理對話歷史和切換對話
- ✅ 上傳附件（圖片、音訊、影片）
- ✅ 設定遠端存取（Tailscale/SSH 隧道）
- ✅ 理解 WebChat 與其他管道的差別

## 你現在的困境

你可能已經啟動了 Gateway，但希望有更直觀的圖形介面與 AI 助手對話，而不是只使用指令列。

你可能想知道：

- "有沒有類似 ChatGPT 的網頁介面？"
- "WebChat 和 WhatsApp/Telegram 管道有什麼差別？"
- "WebChat 需要單獨設定嗎？"
- "如何在遠端伺服器上使用 WebChat？"

好消息是：**WebChat 是 Clawdbot 內建的聊天介面**，無需單獨安裝或設定，啟動 Gateway 後即可使用。

## 什麼時候用這一招

當你需要：

- 🖥️ **圖形介面對話**：偏好瀏覽器內的聊天體驗，而非指令列
- 📊 **對話管理**：檢視歷史記錄、切換不同對話
- 🌐 **本機存取**：在同一台裝置上與 AI 對話
- 🔄 **遠端存取**：透過 SSH/Tailscale 隧道存取遠端 Gateway
- 💬 **富文字互動**：支援 Markdown 格式和附件

---

## 🎒 開始前的準備

在使用 WebChat 之前，請確認：

### 必要條件

| 條件                     | 如何檢查                                        |
| ---------------------- | ------------------------------------------- |
| **Gateway 已啟動**   | `clawdbot gateway status` 或檢視行程是否在執行 |
| **埠可存取**       | 確認 18789 埠（或自訂埠）未被佔用 |
| **AI 模型已設定** | `clawdbot models list` 檢視是否有可用模型      |

::: warning 前置課程
本教程假設你已經完成了：
- [快速開始](../../start/getting-started/) - 安裝、設定和啟動 Clawdbot
- [啟動 Gateway](../../start/gateway-startup/) - 了解 Gateway 的不同啟動模式

如果還沒完成，請先返回這些課程。
:::

### 可選：設定驗證

WebChat 預設需要驗證（即使在本地存取），以保護你的 AI 助手。

快速檢查：

```bash
## 檢視目前驗證設定
clawdbot config get gateway.auth.mode
clawdbot config get gateway.auth.token
```

如果未設定，建議先設定：

```bash
## 設定 token 驗證（推薦）
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here
```

詳細說明：[Gateway 驗證設定](../../advanced/security-sandbox/)。

---

## 核心思路

### 什麼是 WebChat

**WebChat** 是 Clawdbot 內建的聊天介面，透過 Gateway WebSocket 直接與 AI 助手互動。

**關鍵特點**：

```
┌─────────────────────────────────────────────────────┐
│              WebChat 架構                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  瀏覽器/用戶端                                     │
│      │                                              │
│      ▼                                              │
│  Gateway WebSocket (ws://127.0.0.1:18789)          │
│      │                                              │
│      ├─ chat.send → Agent → 處理訊息              │
│      ├─ chat.history → 傳回對話歷史               │
│      ├─ chat.inject → 新增系統備註              │
│      └─ 事件流 → 即時更新                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**與其他管道的差別**：

| 特性         | WebChat                          | WhatsApp/Telegram 等                |
| ------------ | -------------------------------- | ------------------------------ |
| **存取方式** | 瀏覽器直接存取 Gateway           | 需要第三方 APP 和登入         |
| **設定需求** | 無需單獨設定，複用 Gateway 埠   | 需要管道特定的 API Key/Token  |
| **回覆路由** | 確定性路由回 WebChat          | 路由到對應的管道              |
| **遠端存取** | 透過 SSH/Tailscale 隧道       | 由管道平台提供遠端存取         |
| **對話模型** | 使用 Gateway 的對話管理        | 使用 Gateway 的對話管理        |

### WebChat 的工作原理

WebChat 不需要單獨的 HTTP 伺服器或埠設定，它直接使用 Gateway 的 WebSocket 服務。

**關鍵點**：
- **共享埠**：WebChat 使用與 Gateway 相同的埠（預設 18789）
- **無額外設定**：沒有專門的 `webchat.*` 設定區塊
- **即時同步**：歷史記錄從 Gateway 即時取得，本機不快取
- **唯讀模式**：如果 Gateway 無法連接，WebChat 變為唯讀

::: info WebChat vs 控制介面
WebChat 專注於聊天體驗，而 **Control UI** 提供完整的 Gateway 控制面板（設定、對話管理、技能管理等）。

- WebChat：`http://localhost:18789/chat` 或 macOS app 中的聊天視圖
- Control UI：`http://localhost:18789/` 完整控制面板
:::

---

## 跟我做

### 第 1 步：存取 WebChat

**為什麼**
WebChat 是 Gateway 內建的聊天介面，無需安裝額外軟體。

#### 方式 1：瀏覽器存取

開啟瀏覽器，存取：

```bash
## 預設位址（使用預設埠 18789）
http://localhost:18789

## 或使用回環位址（更可靠）
http://127.0.0.1:18789
```

**你應該看到**：
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  [對話列表]  [設定]      │   │
│  └───────────────────────────────────┘   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  你好！我是你的 AI 助手。       │   │
│  │  有什麼我可以幫你的嗎？        │   │
│  └───────────────────────────────────┘   │
│                                             │
│  [輸入訊息...]                  [傳送]   │
└─────────────────────────────────────────────┘
```

#### 方式 2：macOS 應用程式

如果你安裝了 Clawdbot macOS 選單列應用程式：

1. 點選選單列圖示
2. 選擇 "Open WebChat" 或點選聊天圖示
3. WebChat 會在獨立的視窗中開啟

**優勢**：
- 原生 macOS 體驗
- 快捷鍵支援
- 與 Voice Wake 和 Talk Mode 整合

#### 方式 3：指令列快捷

```bash
## 自動開啟瀏覽器到 WebChat
clawdbot web
```

**你應該看到**：預設瀏覽器自動開啟並導覽到 `http://localhost:18789`

---

### 第 2 步：傳送第一條訊息

**為什麼**
驗證 WebChat 與 Gateway 的連線是否正常，AI 助手是否能正確回應。

1. 在輸入框中輸入你的第一條訊息
2. 點選「傳送」按鈕或按 `Enter`
3. 觀察聊天介面的回應

**範例訊息**：
```
Hello! I'm testing WebChat. Can you introduce yourself?
```

**你應該看到**：
```
┌─────────────────────────────────────────────┐
│  你 → AI: Hello! I'm testing...      │
│                                             │
│  AI → 你: 你好！我是 Clawdbot AI    │
│  助手。我可以幫你解答問題、          │
│  撰寫程式碼、管理工作等。              │
│  有什麼我可以幫你的嗎？            │
│                                             │
│  [輸入訊息...]                  [傳送]   │
└─────────────────────────────────────────────┘
```

::: tip 驗證提示
如果 Gateway 設定了驗證，存取 WebChat 時會提示輸入 token 或密碼：

```
┌─────────────────────────────────────────────┐
│          Gateway 驗證                    │
│                                             │
│  請輸入 Token:                             │
│  [•••••••••••••]              │
│                                             │
│              [取消]  [登入]               │
└─────────────────────────────────────────────┘
```

輸入你設定的 `gateway.auth.token` 或 `gateway.auth.password` 即可。
:::

---

### 第 3 步：使用 WebChat 功能

**為什麼**
WebChat 提供豐富的互動功能，熟悉這些功能能提升使用體驗。

#### 對話管理

WebChat 支援多對話管理，讓你在不同語境中與 AI 對話。

**操作步驟**：

1. 點選左側對話列表（或「新建對話」按鈕）
2. 選擇或建立新對話
3. 在新對話中繼續對話

**對話特點**：
- ✅ 獨立語境：每個對話的訊息歷史是隔離的
- ✅ 自動儲存：所有對話由 Gateway 管理，持久化儲存
- ✅ 跨平台同步：與 CLI、macOS app、iOS/Android 節點共享同一對話資料

::: info 主對話
WebChat 預設使用 Gateway 的 **主對話鍵**（`main`），這意味著所有用戶端（CLI、WebChat、macOS app、iOS/Android 節點）共享同一個主對話歷史。

如果需要隔離的語境，可以在設定中設定不同的對話鍵。
:::

#### 附件上傳

WebChat 支援上傳圖片、音訊、影片等附件。

**操作步驟**：

1. 點選輸入框旁的「附件」圖示（通常是 📎 或 📎️）
2. 選擇要上傳的檔案（或拖曳檔案到聊天區域）
3. 輸入相關的文字描述
4. 點選「傳送」

**支援的格式**：
- 📷 **圖片**：JPEG、PNG、GIF
- 🎵 **音訊**：MP3、WAV、M4A
- 🎬 **影片**：MP4、MOV
- 📄 **文件**：PDF、TXT 等（視 Gateway 設定而定）

**你應該看到**：
```
┌─────────────────────────────────────────────┐
│  你 → AI: 請分析這張圖片         │
│  [📎 photo.jpg]                         │
│                                             │
│  AI → 你: 我看到這是一張...        │
│  [分析結果...]                              │
└─────────────────────────────────────────────┘
```

::: warning 檔案大小限制
WebChat 和 Gateway 對上傳的檔案大小有限制（通常為幾 MB）。如果上傳失敗，檢查檔案大小或 Gateway 的媒體設定。
:::

#### Markdown 支援

WebChat 支援 Markdown 格式，讓你可以格式化訊息。

**範例**：

```markdown
# 標題
## 二級標題
- 列表項目 1
- 列表項目 2

**粗體** 和 *斜體*
`程式碼`
```

**預覽效果**：
```
# 標題
## 二級標題
- 列表項目 1
- 列表項目 2

**粗體** 和 *斜體*
`程式碼`
```

#### 指令快捷方式

WebChat 支援斜線指令，快速執行特定操作。

**常用指令**：

| 指令             | 功能                         |
| ---------------- | ---------------------------- |
| `/new`          | 建立新對話                   |
| `/reset`        | 重設目前對話的歷史           |
| `/clear`        | 清空目前對話的所有訊息       |
| `/status`       | 顯示 Gateway 和管道狀態       |
| `/models`       | 列出可用的 AI 模型         |
| `/help`         | 顯示說明資訊                 |

**使用範例**：

```
/new
## 建立新對話

/reset
## 重設目前對話
```

---

### 第 4 步（可選）：設定遠端存取

**為什麼**
如果你在遠端伺服器上執行 Gateway，或者想從其他裝置存取 WebChat，需要設定遠端存取。

#### 透過 SSH 隧道存取

**適用場景**：Gateway 在遠端伺服器，你想從本機機器存取 WebChat。

**操作步驟**：

1. 建立 SSH 隧道，將遠端 Gateway 埠對應到本機：

```bash
## 將遠端的 18789 埠對應到本機的 18789 埠
ssh -L 18789:localhost:18789 user@your-remote-server.com
```

2. 保持 SSH 連線開啟（或使用 `-N` 參數不執行遠端指令）

3. 在本機瀏覽器存取：`http://localhost:18789`

**你應該看到**：與本機存取相同的 WebChat 介面

::: tip SSH 隧道保持
SSH 隧道在連線斷開時會失效。如果需要持久化存取：

- 使用 `autossh` 自動重連
- 設定 SSH Config 中的 `LocalForward`
- 使用 systemd/launchd 自動啟動隧道
:::

#### 透過 Tailscale 存取

**適用場景**：使用 Tailscale 建立私有網路，Gateway 和用戶端在同一 tailnet。

**設定步驟**：

1. 在 Gateway 機器上啟用 Tailscale Serve 或 Funnel：

```bash
## 編輯設定檔
clawdbot config set gateway.tailscale.mode serve
## 或
clawdbot config set gateway.tailscale.mode funnel
```

2. 重新啟動 Gateway

```bash
## 重新啟動 Gateway 以套用設定
clawdbot gateway restart
```

3. 取得 Gateway 的 Tailscale 位址

```bash
## 檢視狀態（會顯示 Tailscale URL）
clawdbot gateway status
```

4. 在用戶端裝置（同一 tailnet）存取：

```
http://<gateway-tailscale-name>.tailnet-<tailnet-id>.ts.net:18789
```

::: info Tailscale Serve vs Funnel
- **Serve**：僅在 tailnet 內可存取，更安全
- **Funnel**：公開存取到網際網路，需要 `gateway.auth` 保護

推薦使用 Serve 模式，除非你需要從公網存取。
:::

#### 遠端存取驗證

無論使用 SSH 隧道還是 Tailscale，如果 Gateway 設定了驗證，你仍需提供 token 或密碼。

**檢查驗證設定**：

```bash
## 檢視驗證模式
clawdbot config get gateway.auth.mode

## 如果是 token 模式，確認 token 已設定
clawdbot config get gateway.auth.token
```

---

## 檢查點 ✅

完成上述步驟後，你應該能夠：

- [ ] 在瀏覽器中存取 WebChat（`http://localhost:18789`）
- [ ] 傳送訊息並收到 AI 回覆
- [ ] 使用對話管理功能（新建、切換、重設對話）
- [ ] 上傳附件並讓 AI 分析
- [ ] （可選）透過 SSH 隧道遠端存取 WebChat
- [ ] （可選）透過 Tailscale 存取 WebChat

::: tip 驗證連線
如果 WebChat 無法存取或訊息傳送失敗，檢查：

1. Gateway 是否在執行：`clawdbot gateway status`
2. 埠是否正確：確認存取 `http://127.0.0.1:18789`（而不是 `localhost:18789`）
3. 驗證是否設定：`clawdbot config get gateway.auth.*`
4. 檢視詳細日誌：`clawdbot gateway --verbose`
:::

---

## 踩坑提醒

### ❌ Gateway 未啟動

**錯誤做法**：
```
直接存取 http://localhost:18789
## 結果：連線失敗或無法載入
```

**正確做法**：
```bash
## 先啟動 Gateway
clawdbot gateway --port 18789

## 再存取 WebChat
open http://localhost:18789
```

::: warning Gateway 必須先啟動
WebChat 依賴 Gateway 的 WebSocket 服務。沒有執行的 Gateway，WebChat 無法正常運作。
:::

### ❌ 埠設定錯誤

**錯誤做法**：
```
存取 http://localhost:8888
## Gateway 實際執行在 18789 埠
## 結果：連線被拒絕
```

**正確做法**：
```bash
## 1. 檢視 Gateway 實際埠
clawdbot config get gateway.port

## 2. 使用正確的埠存取
open http://localhost:<gateway.port>
```

### ❌ 驗證設定遺漏

**錯誤做法**：
```
未設定 gateway.auth.mode 或 token
## 結果：WebChat 提示驗證失敗
```

**正確做法**：
```bash
## 設定 token 驗證（推薦）
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here

## 重新啟動 Gateway
clawdbot gateway restart

## 存取 WebChat 時輸入 token
```

### ❌ 遠端存取未設定

**錯誤做法**：
```
從本機直接存取遠端伺服器 IP
http://remote-server-ip:18789
## 結果：連線逾時（防火牆阻止）
```

**正確做法**：
```bash
## 使用 SSH 隧道
ssh -L 18789:localhost:18789 user@remote-server.com

## 或使用 Tailscale Serve
clawdbot config set gateway.tailscale.mode serve
clawdbot gateway restart

## 從本機瀏覽器存取
http://localhost:18789
```

---

## 本課小結

本課你學會了：

1. ✅ **WebChat 簡介**：基於 Gateway WebSocket 的內建聊天介面，無需單獨設定
2. ✅ **存取方式**：瀏覽器存取、macOS 應用程式、指令列快捷
3. ✅ **核心功能**：對話管理、附件上傳、Markdown 支援、斜線指令
4. ✅ **遠端存取**：透過 SSH 隧道或 Tailscale 存取遠端 Gateway
5. ✅ **驗證設定**：理解 Gateway 驗證模式（token/password/Tailscale）
6. ✅ **故障排查**：常見問題和解決方案

**關鍵概念回顧**：

- WebChat 使用與 Gateway 相同的埠，無需單獨的 HTTP 伺服器
- 歷史記錄由 Gateway 管理，即時同步，本機不快取
- 如果 Gateway 無法連接，WebChat 變為唯讀模式
- 回覆確定性路由回 WebChat，與其他管道不同

**下一步**：

- 探索 [macOS 應用程式](../macos-app/)，了解選單列控制和 Voice Wake 功能
- 學習 [iOS 節點](../ios-node/)，設定行動裝置執行本機操作
- 了解 [Canvas 視覺化介面](../../advanced/canvas/)，體驗 AI 驅動的視覺化工作空間

---

## 下一課預告

> 下一課我們學習 **[macOS 應用程式](../macos-app/)**。
>
> 你會學到：
> - macOS 選單列應用程式的功能和版面配置
> - Voice Wake 和 Talk Mode 的使用
> - WebChat 與 macOS 應用程式的整合方式
> - 除錯工具和遠端 Gateway 控制

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能                  | 檔案路徑                                                                                    | 行號    |
| ------------------- | ------------------------------------------------------------------------------------------- | ------- |
| WebChat 原理說明     | [`docs/web/webchat.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/web/webchat.md) | 全檔案   |
| Gateway WebSocket API | [`src/gateway/protocol/`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/) | 全目錄   |
| chat.send 方法        | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380  |
| chat.history 方法     | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 1-295    |
| chat.inject 方法      | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 381-450  |
| Web UI 入口         | [`ui/index.html`](https://github.com/clawdbot/clawdbot/blob/main/ui/index.html) | 1-15     |
| Gateway 驗證設定     | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-100    |
| Tailscale 整合       | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 全檔案   |
| macOS WebChat 整合  | [`apps/macos/`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/) | 全目錄   |

**關鍵常數**：
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`：WebChat 內部訊息管道識別碼（來自 `src/utils/message-channel.ts:17`）

**關鍵設定項**：
- `gateway.port`：WebSocket 埠（預設 18789）
- `gateway.auth.mode`：驗證模式（token/password/tailscale）
- `gateway.auth.token`：Token 驗證的令牌值
- `gateway.auth.password`：密碼驗證的密碼值
- `gateway.tailscale.mode`：Tailscale 模式（serve/funnel/disabled）
- `gateway.remote.url`：遠端 Gateway 的 WebSocket 位址
- `gateway.remote.token`：遠端 Gateway 驗證令牌
- `gateway.remote.password`：遠端 Gateway 驗證密碼

**關鍵 WebSocket 方法**：
- `chat.send(message)`：傳送訊息到 Agent（來自 `src/gateway/server-methods/chat.ts`）
- `chat.history(sessionId)`：取得對話歷史（來自 `src/gateway/server-methods/chat.ts`）
- `chat.inject(message)`：直接注入系統備註到對話，不經過 Agent（來自 `src/gateway/server-methods/chat.ts`）

**架構特點**：
- WebChat 不需要單獨的 HTTP 伺服器或埠設定
- 使用與 Gateway 相同的埠（預設 18789）
- 歷史記錄即時從 Gateway 取得，本機不快取
- 回覆確定性路由回 WebChat（與其他管道不同）

</details>
