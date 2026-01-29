---
title: "LINE 渠道設定與使用指南 | Clawdbot 教程"
sidebarTitle: "在 LINE 上用 AI"
subtitle: "LINE 渠道設定與使用指南"
description: "學習如何設定和使用 Clawdbot 的 LINE 渠道。本教程介紹 LINE Messaging API 整合、Webhook 設定、存取控制、富媒體訊息（Flex 模板、快速回覆、Rich Menu）以及常見問題排查技巧。"
tags:
  - "LINE"
  - "Messaging API"
  - "渠道設定"
prerequisite:
  - "start-gateway-startup"
order: 140
---

# LINE 渠道設定與使用指南

## 學完你能做什麼

完成本教程後，你將能夠：

- ✅ 建立 LINE Messaging API 渠道並取得憑證
- ✅ 設定 Clawdbot 的 LINE 外掛和 Webhook
- ✅ 設定 DM 配對、群組存取控制和媒體限制
- ✅ 發送富媒體訊息（Flex 卡片、快速回覆、位置資訊）
- ✅ 排查 LINE 渠道的常見問題

## 你現在的困境

你可能在想：

- "我想透過 LINE 和 AI 助手對話，怎麼整合？"
- "LINE Messaging API 的 Webhook 怎麼設定？"
- "LINE 支援 Flex 訊息和快速回覆嗎？"
- "如何控制誰能透過 LINE 存取我的 AI 助手？"

好消息是：**Clawdbot 提供了完整的 LINE 外掛，支援 Messaging API 的所有核心功能**。

## 什麼時候用這一招

當你需要：

- 📱 **在 LINE 上**與 AI 助手對話
- 🎨 **使用富媒體訊息**（Flex 卡片、快速回覆、Rich Menu）
- 🔒 **控制存取權限**（DM 配對、群組白名單）
- 🌐 **整合 LINE 到**現有的工作流程中

## 核心思路

LINE 渠道透過 **LINE Messaging API** 整合，使用 Webhook 接收事件並發送訊息。

```
LINE 使用者
    │
    ▼ (發送訊息)
┌──────────────────┐
│  LINE Platform  │
│  (Messaging API)│
└────────┬─────────┘
         │ (Webhook POST)
         ▼
┌──────────────────┐
│  Clawdbot       │
│  Gateway        │
│  /line/webhook   │
└────────┬─────────┘
         │ (呼叫 AI)
         ▼
     ┌────────┐
     │ Agent  │
     └───┬────┘
         │ (回應)
         ▼
     LINE 使用者
```

**關鍵概念**：

| 概念 | 作用 |
|--- | ---|
| **Channel Access Token** | 用於發送訊息的認證權杖 |
| **Channel Secret** | 用於驗證 Webhook 簽名的金鑰 |
| **Webhook URL** | Clawdbot 接收 LINE 事件的端點（必須 HTTPS） |
| **DM Policy** | 控制未知發送者的存取策略（pairing/allowlist/open/disabled） |
| **Rich Menu** | LINE 的固定選單，使用者可點選快速觸發操作 |

## 🎒 開始前的準備

### 需要的帳號和工具

| 項目 | 要求 | 取得方式 |
|--- | --- | ---|
| **LINE Developers 帳號** | 免費註冊 | https://developers.line.biz/console/ |
| **LINE Provider** | 建立 Provider 和 Messaging API channel | LINE Console |
| **HTTPS 伺服器** | Webhook 必須是 HTTPS | ngrok、Cloudflare Tunnel、Tailscale Serve/Funnel |

::: tip 推薦的暴露方式
如果你在本地開發，可以使用：
- **ngrok**：`ngrok http 18789`
- **Tailscale Funnel**：`gateway.tailscale.mode = "funnel"`
- **Cloudflare Tunnel**：免費且穩定
:::

## 跟我做

### 第 1 步：安裝 LINE 外掛

**為什麼**
LINE 渠道是透過外掛實作的，需要先安裝。

```bash
clawdbot plugins install @clawdbot/line
```

**你應該看到**：
```
✓ Installed @clawdbot/line plugin
```

::: tip 本地開發
如果你從原始碼執行，可以使用本地安裝：
```bash
clawdbot plugins install ./extensions/line
```
:::

### 第 2 步：建立 LINE Messaging API Channel

**為什麼**
需要取得 `Channel Access Token` 和 `Channel Secret` 來設定 Clawdbot。

#### 2.1 登入 LINE Developers Console

存取：https://developers.line.biz/console/

#### 2.2 建立 Provider（如果還沒有）

1. 點擊 "Create new provider"
2. 輸入 Provider 名稱（如 `Clawdbot`）
3. 點擊 "Create"

#### 2.3 新增 Messaging API Channel

1. 在 Provider 下，點擊 "Add channel" → 選擇 "Messaging API"
2. 設定 Channel 資訊：
   - Channel name: `Clawdbot AI Assistant`
   - Channel description: `Personal AI assistant powered by Clawdbot`
   - Category: `Communication`
   - Subcategory: `Bot`
3. 勾選 "Agree" → 點擊 "Create"

#### 2.4 啟用 Webhook

1. 在 Channel 設定頁面，找到 "Messaging API" 標籤
2. 點擊 "Use webhook" 開關 → 設定為 ON
3. 複製以下資訊：

| 項目 | 位置 | 範例 |
|--- | --- | ---|
| **Channel Access Token** | Basic settings → Channel access token (long-lived) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Channel Secret** | Basic settings → Channel secret | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7` |

::: warning 保存好憑證！
Channel Access Token 和 Channel Secret 是敏感資訊，妥善保管，不要洩露到公開儲存庫。
:::

### 第 3 步：設定 Clawdbot 的 LINE 渠道

**為什麼**
設定 Gateway 以使用 LINE Messaging API 發送和接收訊息。

#### 方式 A：透過命令列設定

```bash
clawdbot configure
```

精靈會詢問：
- 是否啟用 LINE 渠道
- Channel Access Token
- Channel Secret
- DM 策略（預設 `pairing`）

#### 方式 B：直接編輯設定檔

編輯 `~/.clawdbot/clawdbot.json`：

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
      channelSecret: "YOUR_CHANNEL_SECRET",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    }
  }
}
```

::: tip 使用環境變數
你也可以透過環境變數設定（僅對預設帳號有效）：
```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_token_here"
export LINE_CHANNEL_SECRET="your_secret_here"
```
:::

#### 方式 C：使用檔案儲存憑證

更安全的方式是將憑證儲存在單獨的檔案中：

```json5
{
  channels: {
    line: {
      enabled: true,
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
      dmPolicy: "pairing"
    }
  }
}
```

### 第 4 步：設定 Webhook URL

**為什麼**
LINE 需要 Webhook URL 來向 Clawdbot 推送訊息事件。

#### 4.1 確保你的 Gateway 可從外網存取

如果你在本地開發，需要使用隧道服務：

```bash
# 使用 ngrok
ngrok http 18789

# 輸出會顯示 HTTPS URL，如：
# Forwarding: https://abc123.ngrok.io -> http://localhost:18789
```

#### 4.2 在 LINE Console 設定 Webhook URL

1. 在 Messaging API 設定頁面，找到 "Webhook settings"
2. 輸入 Webhook URL：
   ```
   https://your-gateway-host/line/webhook
   ```
   - 預設路徑：`/line/webhook`
   - 可透過 `channels.line.webhookPath` 自訂
3. 點擊 "Verify" → 確認 LINE 能存取你的 Gateway

**你應該看到**：
```
✓ Webhook URL verification succeeded
```

#### 4.3 啟用必要的事件類型

在 Webhook settings 中，勾選以下事件：

| 事件 | 用途 |
|--- | ---|
| **Message event** | 接收使用者發送的訊息 |
| **Follow event** | 使用者新增 Bot 為好友 |
| **Unfollow event** | 使用者移除 Bot |
| **Join event** | Bot 加入群組 |
| **Leave event** | Bot 離開群組 |
| **Postback event** | 快速回覆和按鈕點擊 |

### 第 5 步：啟動 Gateway

**為什麼**
Gateway 需要執行才能接收 LINE 的 Webhook 事件。

```bash
clawdbot gateway --verbose
```

**你應該看到**：
```
✓ Gateway listening on ws://127.0.0.1:18789
✓ LINE webhook server started on /line/webhook
✓ LINE plugin initialized
```

### 第 6 步：測試 LINE 渠道

**為什麼**
驗證設定是否正確，AI 助手是否能正常回應。

#### 6.1 新增 Bot 為好友

1. 在 LINE Console → Messaging API → Channel settings
2. 複製 "Basic ID" 或 "QR Code"
3. 在 LINE App 中搜尋或掃描 QR Code，新增 Bot 為好友

#### 6.2 發送測試訊息

在 LINE 中發送訊息給 Bot：
```
你好，請幫我總結今天的天氣。
```

**你應該看到**：
- Bot 顯示 "typing" 狀態（如果設定了 typing indicators）
- AI 助手串流回傳回應
- 訊息正確顯示在 LINE 中

### 第 7 步：DM 配對驗證（可選）

**為什麼**
如果使用預設的 `dmPolicy="pairing"`，未知發送者需要先被批准。

#### 查看待批准的配對請求

```bash
clawdbot pairing list line
```

**你應該看到**：
```
Pending pairing requests for LINE:
  CODE: ABC123 - User ID: U1234567890abcdef1234567890ab
```

#### 批准配對請求

```bash
clawdbot pairing approve line ABC123
```

**你應該看到**：
```
✓ Approved pairing request for LINE user U1234567890abcdef1234567890ab
```

::: info DM 策略說明
- `pairing`（預設）：未知發送者收到配對碼，訊息被忽略直到批准
- `allowlist`：只允許白名單中的使用者發送訊息
- `open`：任何人都可以發送訊息（需謹慎使用）
- `disabled`：停用私訊
:::

## 檢查點 ✅

驗證你的設定是否正確：

| 檢查項 | 驗證方法 | 預期結果 |
|--- | --- | ---|
| **外掛已安裝** | `clawdbot plugins list` | 看到 `@clawdbot/line` |
| **設定有效** | `clawdbot doctor` | 無 LINE 相關錯誤 |
| **Webhook 可達** | LINE Console 驗證 | `✓ Verification succeeded` |
| **Bot 可存取** | 在 LINE 新增好友並發送訊息 | AI 助手正常回覆 |
| **配對機制** | 使用新使用者發送 DM | 收到配對碼（如使用 pairing 策略） |

## 踩坑提醒

### 常見問題 1：Webhook 驗證失敗

**症狀**：
```
Webhook URL verification failed
```

**原因**：
- Webhook URL 不是 HTTPS
- Gateway 沒有執行或連接埠不正確
- 防火牆阻擋了入站連線

**解決方法**：
1. 確保使用 HTTPS：`https://your-gateway-host/line/webhook`
2. 檢查 Gateway 是否執行：`clawdbot gateway status`
3. 驗證連接埠：`netstat -an | grep 18789`
4. 使用隧道服務（ngrok/Tailscale/Cloudflare）

### 常見問題 2：無法接收訊息

**症狀**：
- Webhook 驗證成功
- 但發送訊息給 Bot 無回應

**原因**：
- Webhook 路徑設定錯誤
- 事件類型未啟用
- 設定檔中的 `channelSecret` 不匹配

**解決方法**：
1. 檢查 `channels.line.webhookPath` 是否與 LINE Console 一致
2. 確保在 LINE Console 中啟用了 "Message event"
3. 驗證 `channelSecret` 是否正確複製（無多餘空格）

### 常見問題 3：媒體下載失敗

**症狀**：
```
Error downloading LINE media: size limit exceeded
```

**原因**：
- 媒體檔案超過預設限制（10MB）

**解決方法**：
在設定中增加限制：
```json5
{
  channels: {
    line: {
      mediaMaxMb: 25  // LINE 官方限制 25MB
    }
  }
}
```

### 常見問題 4：群組訊息無回應

**症狀**：
- DM 正常
- 群組中發送訊息無回應

**原因**：
- 預設 `groupPolicy="allowlist"`，群組未加入白名單
- 未在群組中 @mention Bot

**解決方法**：
1. 在設定中新增群組 ID 到白名單：
```json5
{
  channels: {
    line: {
      groupAllowFrom: ["C1234567890abcdef1234567890ab"]
    }
  }
}
```

2. 或在群組中 @mention Bot：`@Clawdbot 幫我處理這個任務`

## 進階功能

### 富媒體訊息（Flex 模板和快速回覆）

Clawdbot 支援 LINE 的富媒體訊息，包括 Flex 卡片、快速回覆、位置資訊等。

#### 發送快速回覆

```json5
{
  text: "今天能幫你做什麼？",
  channelData: {
    line: {
      quickReplies: ["查天氣", "設定提醒", "生成程式碼"]
    }
  }
}
```

#### 發送 Flex 卡片

```json5
{
  text: "狀態卡片",
  channelData: {
    line: {
      flexMessage: {
        altText: "伺服器狀態",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            contents: [
              {
                type: "text",
                text: "CPU: 45%"
              },
              {
                type: "text",
                text: "Memory: 2.1GB"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### 發送位置資訊

```json5
{
  text: "這是我的辦公室位置",
  channelData: {
    line: {
      location: {
        title: "Office",
        address: "123 Main St, San Francisco",
        latitude: 37.7749,
        longitude: -122.4194
      }
    }
  }
}
```

### Rich Menu（固定選單）

Rich Menu 是 LINE 的固定選單，使用者可以透過點選快速觸發操作。

```bash
# 建立 Rich Menu
clawdbot line rich-menu create

# 上傳選單圖片
clawdbot line rich-menu upload --image /path/to/menu.png

# 設定為預設選單
clawdbot line rich-menu set-default --rich-menu-id <MENU_ID>
```

::: info Rich Menu 限制
- 圖片尺寸：2500x1686 或 2500x843 像素
- 圖片格式：PNG 或 JPEG
- 最多 10 個選單項目
:::

### Markdown 轉換

Clawdbot 會自動將 Markdown 格式轉換為 LINE 支援的格式：

| Markdown | LINE 轉換結果 |
|--- | ---|
| 程式碼區塊 | Flex 卡片 |
| 表格 | Flex 卡片 |
| 連結 | 自動偵測並轉換為 Flex 卡片 |
| 粗體/斜體 | 被移除（LINE 不支援） |

::: tip 保留格式
LINE 不支援 Markdown 格式，Clawdbot 會嘗試轉換為 Flex 卡片。如果你希望純文字，可以在設定中停用自動轉換。
:::

## 本課小結

本教程介紹了：

1. ✅ 安裝 LINE 外掛
2. ✅ 建立 LINE Messaging API Channel
3. ✅ 設定 Webhook 和憑證
4. ✅ 設定存取控制（DM 配對、群組白名單）
5. ✅ 發送富媒體訊息（Flex、快速回覆、位置）
6. ✅ 使用 Rich Menu
7. ✅ 排查常見問題

LINE 渠道提供了豐富的訊息類型和互動方式，非常適合在 LINE 上建構個人化的 AI 助手體驗。

---

## 下一課預告

> 下一課我們學習 **[WebChat 介面](../webchat/)**。
>
> 你會學到：
> - 如何透過瀏覽器存取 WebChat 介面
> - WebChat 的核心功能（會話管理、附件上傳、Markdown 支援）
> - 設定遠端存取（SSH 隧道、Tailscale）
> - 理解 WebChat 與其他渠道的區別

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| LINE Bot 核心實作 | [`src/line/bot.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot.ts) | 27-83 |
| 設定 Schema 定義 | [`src/line/config-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/config-schema.ts) | 1-54 |
| Webhook 事件處理器 | [`src/line/bot-handlers.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/bot-handlers.ts) | 1-100 |
| 訊息發送功能 | [`src/line/send.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/send.ts) | - |
| Flex 模板生成 | [`src/line/flex-templates.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/flex-templates.ts) | - |
| Rich Menu 操作 | [`src/line/rich-menu.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/rich-menu.ts) | - |
| Template 訊息 | [`src/line/template-messages.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/template-messages.ts) | - |
| Markdown 轉 LINE | [`src/line/markdown-to-line.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/markdown-to-line.ts) | - |
| Webhook 伺服器 | [`src/line/webhook.ts`](https://github.com/moltbot/moltbot/blob/main/src/line/webhook.ts) | - |

**關鍵設定欄位**：
- `channelAccessToken`: LINE Channel Access Token（`config-schema.ts:19`）
- `channelSecret`: LINE Channel Secret（`config-schema.ts:20`）
- `dmPolicy`: DM 存取策略（`config-schema.ts:26`）
- `groupPolicy`: 群組存取策略（`config-schema.ts:27`）
- `mediaMaxMb`: 媒體大小限制（`config-schema.ts:28`）
- `webhookPath`: 自訂 Webhook 路徑（`config-schema.ts:29`）

**關鍵函式**：
- `createLineBot()`: 建立 LINE Bot 實例（`bot.ts:27`）
- `handleLineWebhookEvents()`: 處理 LINE Webhook 事件（`bot-handlers.ts:100`）
- `sendMessageLine()`: 發送 LINE 訊息（`send.ts`）
- `createFlexMessage()`: 建立 Flex 訊息（`send.ts:20`）
- `createQuickReplyItems()`: 建立快速回覆（`send.ts:21`）

**支援的 DM 策略**：
- `open`: 開放存取
- `allowlist`: 白名單模式
- `pairing`: 配對模式（預設）
- `disabled`: 停用

**支援的群組策略**：
- `open`: 開放存取
- `allowlist`: 白名單模式（預設）
- `disabled`: 停用

</details>
