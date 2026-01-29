---
title: "發送第一條訊息：透過 WebChat 或管道與 AI 對話 | Clawdbot 教程"
sidebarTitle: "和 AI 說上話了"
subtitle: "發送第一條訊息：透過 WebChat 或管道與 AI 對話"
description: "學習如何透過 WebChat 介面或已設定管道（WhatsApp/Telegram/Slack/Discord 等）發送第一條訊息給 Clawdbot AI 助手。本教程介紹 CLI 指令、WebChat 存取和管道訊息發送的三種方式，包含預期結果和常見問題排查。"
tags:
  - "入門"
  - "WebChat"
  - "管道"
  - "訊息"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 40
---

# 發送第一條訊息：透過 WebChat 或管道與 AI 對話

## 學完你能做什麼

完成本教程後，你將能夠：

- ✅ 透過 CLI 與 AI 助手對話
- ✅ 使用 WebChat 介面發送訊息
- ✅ 在已設定的管道（WhatsApp、Telegram、Slack 等）中與 AI 對話
- ✅ 理解訊息發送的預期結果和狀態碼

## 你現在的困境

你可能剛完成了 Clawdbot 的安裝和 Gateway 啟動，但不知道如何驗證一切是否正常運作。

你可能想知道：

- "Gateway 啟動了，怎麼確認它能回應訊息？"
- "除了指令列，有沒有圖形介面可以用？"
- "我設定了 WhatsApp/Telegram，怎麼在那些平台上和 AI 對話？"

好消息是：**Clawdbot 提供了多種方式發送第一條訊息**，總有一種適合你。

## 什麼時候用這一招

當你需要：

- 🧪 **驗證安裝**：確認 Gateway 和 AI 助手正常運作
- 🌐 **測試管道**：檢查 WhatsApp/Telegram/Slack 等管道連線是否正常
- 💬 **快速對話**：無需開啟管道 APP，直接透過 CLI 或 WebChat 與 AI 交流
- 🔄 **交付回覆**：將 AI 的回覆發送回特定管道或聯絡人

---

## 🎒 開始前的準備

在發送第一條訊息之前，請確認：

### 必要條件

| 條件                     | 如何檢查                                        |
|--- | ---|
| **Gateway 已啟動**   | `clawdbot gateway status` 或查看行程是否在執行 |
| **AI 模型已設定** | `clawdbot models list` 查看是否有可用模型      |
| **埠號可存取**       | 確認 18789 埠號（或自訂埠號）未被占用 |

::: warning 前置課程
本教程假設你已經完成了：
- [快速開始](../getting-started/) - 安裝、設定和啟動 Clawdbot
- [啟動 Gateway](../gateway-startup/) - 了解 Gateway 的不同啟動模式

如果還沒完成，請先返回這些課程。
:::

### 可選：設定管道

如果你想透過 WhatsApp/Telegram/Slack 等管道發送訊息，需要先設定管道。

快速檢查：

```bash
## 查看已設定的管道
clawdbot channels list
```

如果傳回空列表或缺少你想用的管道，參考對應管道的設定教程（在 `platforms/` 章節）。

---

## 核心思路

Clawdbot 支援三種主要方式發送訊息：

```
┌─────────────────────────────────────────────────────────────┐
│              Clawdbot 訊息發送方式                    │
├─────────────────────────────────────────────────────────────┤
│                                                         │
│  方式 1：CLI Agent 對話                                   │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → AI → 傳回結果              │
│  │ agent        │                                       │
│  │ --message    │                                       │
│  └─────────────┘                                       │
│                                                         │
│  方式 2：CLI 直接發送訊息到管道                          │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → 管道 → 發送訊息              │
│  │ message send │                                       │
│  │ --target     │                                       │
│  └─────────────┘                                       │
│                                                         │
│  方式 3：WebChat / 已設定管道                              │
│  ┌─────────────┐               ┌──────────────┐   │
│  │ WebChat     │   或         │ WhatsApp    │   │
│  │ 瀏覽器介面   │              │ Telegram    │ → Gateway → AI → 管道回覆 │
│  └─────────────┘               │ Slack       │   │
│                                 │ Discord     │   │
│                                 └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**關鍵區別**：

| 方式                     | 是否經過 AI | 用途                           |
|--- | --- | ---|
| `clawdbot agent`     | ✅ 是       | 與 AI 對話，取得回覆和思考過程    |
| `clawdbot message send` | ❌ 否       | 直接發送訊息到管道，不經過 AI    |
| WebChat / 管道       | ✅ 是       | 透過圖形介面與 AI 對話         |

::: info 選擇合適的方式
- **驗證安裝**：用 `clawdbot agent` 或 WebChat
- **測試管道**：用 WhatsApp/Telegram 等管道 APP
- **批次發送**：用 `clawdbot message send`（不經過 AI）
:::

---

## 跟我做

### 第 1 步：透過 CLI 與 AI 對話

**為什麼**
CLI 是最快的驗證方式，不需要開啟瀏覽器或管道 APP。

#### 基本對話

```bash
## 發送簡單訊息給 AI 助手
clawdbot agent --message "Hello, I'm testing Clawdbot!"
```

**你應該看到**：
```
[clawdbot] Thinking...
[clawdbot] Hello! I'm your AI assistant powered by Clawdbot. How can I help you today?
```

#### 使用思考層級

Clawdbot 支援不同的思考層級，控制 AI 的"透明度"：

```bash
## 高思考層級（顯示完整推理過程）
clawdbot agent --message "Ship checklist" --thinking high

## 關閉思考（只看最終答案）
clawdbot agent --message "What's 2+2?" --thinking off
```

**你應該看到**（高思考層級）：
```
[clawdbot] I'll create a comprehensive ship checklist for you.

[THINKING]
Let me think about what needs to be checked for shipping:

1. Code readiness
   - All tests passing?
   - Code review completed?
   - Documentation updated?

2. Build configuration
   - Environment variables set correctly?
   - Build artifacts generated?

[THINKING END]

[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

**思考層級選項**：

| 層級        | 說明                           | 適用場景             |
|--- | --- | ---|
| `off`     | 不顯示思考過程               | 簡單問答、快速回應 |
| `minimal` | 最小化思考輸出              | 除錯、檢查流程     |
| `low`     | 低詳細度                     | 日常對話           |
| `medium`   | 中等詳細度                   | 複雜任務           |
| `high`     | 高詳細度（包含完整推理過程） | 學習、程式碼生成     |

#### 指定接收管道

你可以讓 AI 將回覆發送到特定管道（而不是預設管道）：

```bash
## 讓 AI 回覆發送到 Telegram
clawdbot agent --message "Send me a weather update" --deliver --reply-channel telegram
```

::: tip 常用參數
- `--to <號碼>`：指定接收者的 E.164 號碼（用於建立特定會話）
- `--agent <id>`：使用特定的 Agent ID（而不是預設 main）
- `--session-id <id>`：繼續已有會話，而不是建立新會話
- `--verbose on`：啟用詳細日誌輸出
- `--json`：輸出 JSON 格式（適合腳本解析）
:::

---

### 第 2 步：透過 WebChat 介面發送訊息

**為什麼**
WebChat 提供了瀏覽器內的圖形介面，更直觀，支援富文本和附件。

#### 存取 WebChat

WebChat 使用 Gateway 的 WebSocket 服務，**不需要單獨設定或額外埠號**。

**存取方式**：

1. **開啟瀏覽器，存取**：`http://localhost:18789`
2. **或在終端機執行**：`clawdbot dashboard`（自動開啟瀏覽器）

::: info WebChat 埠號
WebChat 使用與 Gateway 相同的埠號（預設 18789）。如果你修改了 Gateway 埠號，WebChat 也會使用相同的埠號。
:::

**你應該看到**：
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│  ┌───────────────────────────────────┐   │
│  │  你好！我是你的 AI 助手。       │   │
│  │  有什麼我可以幫你的嗎？        │   │
│  └───────────────────────────────────┘   │
│  [輸入框...                       │   │
│  [發送]                            │   │
└─────────────────────────────────────────────┘
```

#### 發送訊息

1. 在輸入框中輸入你的訊息
2. 點擊"發送"或按 `Enter`
3. 等待 AI 回應

**你應該看到**：
- AI 的回覆顯示在聊天介面
- 如果啟用了思考層級，會顯示 `[THINKING]` 標記

**WebChat 功能**：

| 功能     | 說明                           |
|--- | ---|
| 富文本   | 支援 Markdown 格式            |
| 附件     | 支援圖片、音訊、影片上傳    |
| 歷史紀錄 | 自動儲存會話歷史             |
| 會話切換 | 左側面板切換不同會話         |

::: tip macOS 選單列應用
如果你安裝了 Clawdbot macOS 應用，也可以從選單列的"Open WebChat"按鈕直接開啟 WebChat。
:::

---

### 第 3 步：透過已設定管道發送訊息

**為什麼**
驗證管道（WhatsApp、Telegram、Slack 等）的連線是否正常，並體驗真實的跨平台對話。

#### WhatsApp 範例

如果你在 onboarding 或設定中設定了 WhatsApp：

1. **開啟 WhatsApp APP**（手機或桌面版）
2. **搜尋你的 Clawdbot 號碼**（或已儲存的聯絡人）
3. **發送訊息**：`Hello from WhatsApp!`

**你應該看到**：
```
[WhatsApp]
你 → Clawdbot: Hello from WhatsApp!

Clawdbot → 你: Hello! I received your message via WhatsApp.
How can I help you today?
```

#### Telegram 範例

如果你設定了 Telegram Bot：

1. **開啟 Telegram APP**
2. **搜尋你的 Bot**（使用使用者名稱）
3. **發送訊息**：`/start` 或 `Hello from Telegram!`

**你應該看到**：
```
[Telegram]
你 → @your_bot: /start

@your_bot → 你: Welcome! I'm Clawdbot's AI assistant.
You can talk to me here, and I'll respond via AI.
```

#### Slack/Discord 範例

對於 Slack 或 Discord：

1. **開啟對應 APP**
2. **找到 Bot 所在的頻道或伺服器**
3. **發送訊息**：`Hello from Slack!`

**你應該看到**：
- Bot 回覆你的訊息
- 訊息前可能顯示"AI Assistant"標籤

::: info DM 配對保護
預設情況下，Clawdbot 啟用 **DM 配對保護**：
- 未知的發送者會收到一個配對代碼
- 訊息不會被處理，直到你核准配對

如果你是第一次從管道發送訊息，可能需要：
```bash
## 查看待核准的配對請求
clawdbot pairing list

## 核准配對請求（替換 <channel> 和 <code> 為實際值）
clawdbot pairing approve <channel> <code>
```

詳細說明：[DM 配對與存取控制](../pairing-approval/)
:::

---

### 第 4 步（可選）：直接發送訊息到管道

**為什麼**
不經過 AI，直接發送訊息到管道。適合批次通知、推播訊息等場景。

#### 發送文字訊息

```bash
## 發送文字訊息到 WhatsApp
clawdbot message send --target +15555550123 --message "Hello from CLI!"
```

#### 發送帶附件的訊息

```bash
## 發送圖片
clawdbot message send --target +15555550123 \
  --message "Check out this photo" \
  --media ~/Desktop/photo.jpg

## 發送 URL 圖片
clawdbot message send --target +15555550123 \
  --message "Here's a link" \
  --media https://example.com/image.png
```

**你應該看到**：
```
[clawdbot] Message sent successfully
[clawdbot] Message ID: 3EB0A1234567890
```

::: tip message send 常用參數
- `--channel`：指定管道（預設：whatsapp）
- `--reply-to <id>`：回覆指定訊息
- `--thread-id <id>`：Telegram 主題 ID
- `--buttons <json>`：Telegram 內聯按鈕（JSON 格式）
- `--card <json>`：Adaptive Card（支援的管道）
:::

---

## 檢查點 ✅

完成上述步驟後，你應該能夠：

- [ ] 透過 CLI 發送訊息並收到 AI 回覆
- [ ] 在 WebChat 介面發送訊息並看到回應
- [ ] （可選）在已設定的管道發送訊息並收到 AI 回覆
- [ ] （可選）使用 `clawdbot message send` 直接發送訊息到管道

::: tip 常見問題

**Q: AI 不回覆我的訊息？**

A: 檢查以下幾點：
1. Gateway 是否在執行：`clawdbot gateway status`
2. AI 模型是否設定：`clawdbot models list`
3. 查看詳細日誌：`clawdbot agent --message "test" --verbose on`

**Q: WebChat 無法開啟？**

A: 檢查：
1. Gateway 是否在執行
2. 埠號是否正確：預設 18789
3. 瀏覽器是否存取 `http://127.0.0.1:18789`（而不是 `localhost`）

**Q: 管道訊息發送失敗？**

A: 檢查：
1. 管道是否已登入：`clawdbot channels status`
2. 網路連線是否正常
3. 查看管道特定的錯誤日誌：`clawdbot gateway --verbose`
:::

---

## 踩坑提醒

### ❌ Gateway 未啟動

**錯誤做法**：
```bash
clawdbot agent --message "Hello"
## 報錯：Gateway connection failed
```

**正確做法**：
```bash
## 先啟動 Gateway
clawdbot gateway --port 18789

## 再發送訊息
clawdbot agent --message "Hello"
```

::: warning Gateway 必須先啟動
所有訊息發送方式（CLI、WebChat、管道）都依賴 Gateway 的 WebSocket 服務。確保 Gateway 在執行是第一步。
:::

### ❌ 管道未登入

**錯誤做法**：
```bash
## WhatsApp 未登入就發送訊息
clawdbot message send --target +15555550123 --message "Hi"
## 報錯：WhatsApp not authenticated
```

**正確做法**：
```bash
## 先登入管道
clawdbot channels login whatsapp

## 確認狀態
clawdbot channels status

## 再發送訊息
clawdbot message send --target +15555550123 --message "Hi"
```

### ❌ 忘記 DM 配對

**錯誤做法**：
```bash
## 第一次從 Telegram 發送訊息，但未核准配對
## 結果：Bot 收到訊息但不處理
```

**正確做法**：
```bash
## 1. 查看待核准的配對請求
clawdbot pairing list

## 2. 核准配對
clawdbot pairing approve telegram ABC123
## 3. 再次發送訊息

### 現在訊息會被處理並得到 AI 回覆
```

### ❌ 混淆 agent 和 message send

**錯誤做法**：
```bash
## 想與 AI 對話，但用了 message send
clawdbot message send --target +15555550123 --message "Help me write code"
## 結果：訊息直接發送到管道，AI 不會處理
```

**正確做法**：
```bash
## 與 AI 對話：使用 agent
clawdbot agent --message "Help me write code" --to +15555550123

## 直接發送訊息：使用 message send（不經過 AI）
clawdbot message send --target +15555550123 --message "Meeting at 3pm"
```

---

## 本課小結

本課你學會了：

1. ✅ **CLI Agent 對話**：`clawdbot agent --message` 與 AI 交流，支援思考層級控制
2. ✅ **WebChat 介面**：存取 `http://localhost:18789` 使用圖形介面發送訊息
3. ✅ **管道訊息**：在 WhatsApp、Telegram、Slack 等已設定管道中與 AI 對話
4. ✅ **直接發送**：`clawdbot message send` 繞過 AI 直接發送訊息到管道
5. ✅ **問題排查**：了解常見失敗原因和解決方案

**下一步**：

- 學習 [DM 配對與存取控制](../pairing-approval/)，了解如何安全地管理陌生發送者
- 探索 [多管道系統概觀](../../platforms/channels-overview/)，了解所有支援的管道及其設定
- 設定更多管道（WhatsApp、Telegram、Slack、Discord 等）來體驗跨平台 AI 助手

---

## 下一課預告

> 下一課我們學習 **[DM 配對與存取控制](../pairing-approval/)**。
>
> 你會學到：
> - 理解預設的 DM 配對保護機制
> - 如何核准陌生發送者的配對請求
> - 設定 allowlist 和安全策略

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能                  | 檔案路徑                                                                                             | 行號    |
|--- | --- | ---|
| CLI Agent 指令註冊  | [`src/cli/program/register.agent.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.agent.ts) | 20-82    |
| Agent CLI 執行        | [`src/commands/agent-via-gateway.ts`](https://github.com/moltbot/moltbot/blob/main/src/commands/agent-via-gateway.ts) | 82-184   |
| CLI message send 註冊 | [`src/cli/program/message/register.send.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/message/register.send.ts) | 1-30     |
| Gateway chat.send 方法 | [`src/gateway/server-methods/chat.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380   |
| WebChat 內部訊息處理 | [`src/gateway/server-chat.gateway-server-chat.e2e.test.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-chat.gateway-server-chat.e2e.test.ts) | 50-290    |
| 訊息管道類型定義   | [`src/gateway/protocol/client-info.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/protocol/client-info.ts) | 2-23     |
| 管道註冊表         | [`src/channels/registry.js`](https://github.com/moltbot/moltbot/blob/main/src/channels/registry.js) | 全檔案   |

**關鍵常數**：
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`：預設訊息管道（來自 `src/channels/registry.js`）
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`：WebChat 內部訊息管道（來自 `src/utils/message-channel.ts`）

**關鍵函式**：
- `agentViaGatewayCommand()`：透過 Gateway WebSocket 呼叫 agent 方法（`src/commands/agent-via-gateway.ts`）
- `agentCliCommand()`：CLI agent 指令入口，支援本機和 Gateway 模式（`src/commands/agent-via-gateway.ts`）
- `registerMessageSendCommand()`：註冊 `message send` 指令（`src/cli/program/message/register.send.ts`）
- `chat.send`：Gateway WebSocket 方法，處理訊息發送請求（`src/gateway/server-methods/chat.ts`）

</details>
