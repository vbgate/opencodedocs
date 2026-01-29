---
title: "多管道系統概覽：Clawdbot 支援的 13+ 種通訊管道完整全面詳解 | Clawdbot 教學"
sidebarTitle: "選對適合的管道"
subtitle: "多管道系統概覽：Clawdbot 支援的所有通訊管道"
description: "學習 Clawdbot 支援的 13+ 種通訊管道（WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、LINE 等）。掌握各管道的驗證方式、特點、使用場景，選擇最適合的管道開始設定。教學涵蓋 DM 配對保護、群組訊息處理、設定方式。"
tags:
  - "管道"
  - "平台"
  - "多管道"
  - "入門"
prerequisite:
  - "start-getting-started"
order: 60
---

# 多管道系統概覽：Clawdbot 支援的所有通訊管道

## 學完你能做什麼

完成本教學後，你將能夠：

- ✅ 了解 Clawdbot 支援的 13+ 種通訊管道
- ✅ 掌握各管道的驗證方式和設定要點
- ✅ 根據使用場景選擇最適合的管道
- ✅ 理解 DM 配對保護機制的安全價值

## 你現在的困境

你可能正在想：

- "Clawdbot 支援哪些平台？"
- "WhatsApp、Telegram、Slack 有什麼區別？"
- "哪個管道最簡單快速？"
- "我需要在每個平台都註冊機器人嗎？"

好消息是：**Clawdbot 提供了豐富的管道選擇，你可以根據習慣和需求自由組合**。

## 什麼時候用這一招

當你需要：

- 🌐 **多管道統一管理** —— 一套 AI 助理，多個管道同時可用
- 🤝 **團隊協作** —— Slack、Discord、Google Chat 等工作場所整合
- 💬 **個人聊天** —— WhatsApp、Telegram、iMessage 等日常通訊工具
- 🔧 **靈活擴展** —— 支援 LINE、Zalo 等地區性平台

::: tip 多管道的價值
使用多個管道的好處：
- **無縫切換**：在家用 WhatsApp，公司用 Slack，外出用 Telegram
- **多端同步**：訊息和工作階段在所有管道保持一致
- **覆蓋場景**：不同平台有不同優勢，組合使用效果最佳
:::

---

## 核心思路

Clawdbot 的管道系統採用 **外掛架構**：

```
┌─────────────────────────────────────────────────┐
│              Gateway (控制平面)                   │
│         ws://127.0.0.1:18789                  │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┼───────┬─────────┬───────┐
        │       │       │         │       │
    WhatsApp  Telegram  Slack  Discord  ... 等 13+ 種管道
        │       │       │         │       │
    Baileys  grammY   Bolt  discord.js ...
```

**關鍵概念**：

| 概念         | 作用                         |
|--- | ---|
| **管道外掛** | 每個管道都是一個獨立的外掛    |
| **統一介面** | 所有管道使用相同的 API        |
| **DM 保護**   | 預設啟用配對機制，拒絕未知發送者 |
| **群組支援**  | 支援 `@mention` 和命令觸發    |

---

## 支援的管道概覽

Clawdbot 支援 **13+ 種通訊管道**，分為兩類：

### 核心管道（內建）

| 管道           | 驗證方式             | 難度 | 特點                              |
|--- | --- | --- | ---|
| **Telegram**   | Bot Token            | ⭐   | 最簡單快速，推薦新手                |
| **WhatsApp**   | QR Code / Phone Link | ⭐⭐  | 使用真實號碼，推薦單獨手機 + eSIM |
| **Slack**      | Bot Token + App Token | ⭐⭐ | 工作場所首選，Socket Mode         |
| **Discord**    | Bot Token            | ⭐⭐  | 社群和遊戲場景，功能豐富         |
| **Google Chat** | OAuth / Service Account | ⭐⭐⭐ | Google Workspace 企業整合        |
| **Signal**     | signal-cli           | ⭐⭐⭐ | 高度安全，設定複雜              |
| **iMessage**   | imsg (macOS)        | ⭐⭐⭐ | macOS 專屬，仍在開發中          |

### 擴展管道（外部外掛）

| 管道             | 驗證方式             | 類型       | 特點                              |
|--- | --- | --- | ---|
| **WebChat**       | Gateway WebSocket     | 內建       | 無需第三方驗證，最簡單            |
| **LINE**          | Messaging API        | 外部外掛   | 亞洲使用者常用                       |
| **BlueBubbles**   | Private API         | 擴展外掛   | iMessage 擴展，支援遠端裝置       |
| **Microsoft Teams** | Bot Framework       | 擴展外掛   | 企業協作                           |
| **Matrix**        | Matrix Bot SDK      | 擴展外掛   | 去中心化通訊                       |
| **Zalo**         | Zalo OA             | 擴展外掛   | 越南使用者常用                       |
| **Zalo Personal** | Personal Account     | 擴展外掛   | Zalo 個人帳戶                       |

::: info 如何選擇管道？
- **新手**：從 Telegram 或 WebChat 開始
- **個人使用**：WhatsApp（如果已有號碼）、Telegram
- **團隊協作**：Slack、Google Chat、Discord
- **隱私優先**：Signal
- **Apple 生態**：iMessage、BlueBubbles
:::

---

## 核心管道詳解

### 1. Telegram（推薦新手）

**為什麼推薦**：
- ⚡ 最簡單的設定流程（只需要 Bot Token）
- 📱 原生支援 Markdown、富媒體
- 🌍 全球可用，無需特殊網路環境

**驗證方式**：
1. 在 Telegram 中找到 `@BotFather`
2. 發送 `/newbot` 指令
3. 按提示設定機器人名稱
4. 獲得 Bot Token（格式：`123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`）

**設定範例**：
```yaml
channels:
  telegram:
    botToken: "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"  # 預設 DM 配對保護
    allowFrom: ["*"]     # 允許所有使用者（配對後）
```

**特點**：
- ✅ 支援 Thread/Topic
- ✅ 支援 Reaction 表情
- ✅ 支援檔案、圖片、影片

---

### 2. WhatsApp（推薦個人使用者）

**為什麼推薦**：
- 📱 使用真實手機號碼，好友無需新增聯絡人
- 🌍 全球最受歡迎的即時通訊工具
- 📞 支援語音訊息、通話

**驗證方式**：
1. 執行 `clawdbot channels login whatsapp`
2. 掃描二維碼（類似 WhatsApp Web）
3. 或使用手機連結（新功能）

**設定範例**：
```yaml
channels:
  whatsapp:
    accounts:
      my-phone:
        dmPolicy: "pairing"  # 預設 DM 配對保護
        allowFrom: ["*"]     # 允許所有使用者（配對後）
```

**特點**：
- ✅ 支援富媒體（圖片、影片、文件）
- ✅ 支援語音訊息
- ✅ 支援 Reaction 表情
- ⚠️ **需要單獨手機**（推薦 eSIM + 備用機）

::: warning WhatsApp 限制
- 不要在多個地方同時登入同一號碼
- 避免頻繁重連（可能被暫時封禁）
- 推薦使用單獨的測試號碼
:::

---

### 3. Slack（推薦團隊協作）

**為什麼推薦**：
- 🏢 企業和團隊廣泛使用
- 🔧 支援豐富的 Actions 和 Slash Commands
- 📋 與工作流無縫整合

**驗證方式**：
1. 在 [Slack API](https://api.slack.com/apps) 建立應用程式
2. 啟用 Bot Token Scopes
3. 啟用 App-Level Token
4. 啟用 Socket Mode
5. 獲得 Bot Token 和 App Token

**設定範例**：
```yaml
channels:
  slack:
    botToken: "xoxb-YOUR-BOT-TOKEN-HERE"
    appToken: "xapp-YOUR-APP-TOKEN-HERE"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**特點**：
- ✅ 支援頻道、私聊、群組
- ✅ 支援 Slack Actions（建立頻道、邀請使用者等）
- ✅ 支援檔案上傳、表情符號
- ⚠️ 需要啟用 Socket Mode（避免暴露連接埠）

---

### 4. Discord（推薦社群場景）

**為什麼推薦**：
- 🎮 遊戲和社群場景首選
- 🤖 支援 Discord 特有功能（角色、頻道管理）
- 👥 強大的群組和社群功能

**驗證方式**：
1. 在 [Discord Developer Portal](https://discord.com/developers/applications) 建立應用程式
2. 建立 Bot 使用者
3. 啟用 Message Content Intent
4. 獲得 Bot Token

**設定範例**：
```yaml
channels:
  discord:
    botToken: "MTIzNDU2Nzg5MDEyMzQ1Njgw.GhIJKlmNoPQRsTUVwxyZABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**特點**：
- ✅ 支援角色和權限管理
- ✅ 支援頻道、執行緒、表情符號
- ✅ 支援特定 Actions（建立頻道、管理角色等）
- ⚠️ 需要正確設定 Intents

---

### 5. 其他核心管道

#### Google Chat
- **適用場景**：Google Workspace 企業使用者
- **驗證方式**：OAuth 或 Service Account
- **特點**：與 Gmail、Calendar 整合

#### Signal
- **適用場景**：隱私優先使用者
- **驗證方式**：signal-cli
- **特點**：端對端加密，高度安全

#### iMessage
- **適用場景**：macOS 使用者
- **驗證方式**：imsg (macOS 專屬)
- **特點**：Apple 生態整合，仍在開發中

---

## 擴展管道介紹

### WebChat（最簡單）

**為什麼推薦**：
- 🚀 無需第三方帳號或 Token
- 🌐 內建 Gateway WebSocket 支援
- 🔧 開發除錯快速

**使用方式**：

啟動 Gateway 後，直接透過以下方式存取：
- **macOS/iOS app**：原生 SwiftUI 介面
- **Control UI**：瀏覽器存取控制台的聊天標籤頁

**特點**：
- ✅ 無需設定，開箱即用
- ✅ 支援測試和除錯
- ✅ 與其他管道共享工作階段和路由規則
- ⚠️ 僅本機存取（可透過 Tailscale 暴露）

---

### LINE（亞洲使用者）

**適用場景**：日本、台灣、泰國等 LINE 使用者

**驗證方式**：Messaging API（LINE Developers Console）

**特點**：
- ✅ 支援按鈕、快速回覆
- ✅ 亞洲市場廣泛使用
- ⚠️ 需要審核和商業帳戶

---

### BlueBubbles（iMessage 擴展）

**適用場景**：需要遠端 iMessage 存取

**驗證方式**：Private API

**特點**：
- ✅ 遠端控制 iMessage
- ✅ 支援多個裝置
- ⚠️ 需要單獨的 BlueBubbles 伺服器

---

### Microsoft Teams（企業協作）

**適用場景**：使用 Office 365 的企業

**驗證方式**：Bot Framework

**特點**：
- ✅ 與 Teams 深度整合
- ✅ 支援 Adaptive Cards
- ⚠️ 設定複雜

---

### Matrix（去中心化）

**適用場景**：去中心化通訊愛好者

**驗證方式**：Matrix Bot SDK

**特點**：
- ✅ 聯邦化網路
- ✅ 端對端加密
- ⚠️ 需要設定 Homeserver

---

### Zalo / Zalo Personal（越南使用者）

**適用場景**：越南市場

**驗證方式**：Zalo OA / Personal Account

**特點**：
- ✅ 支援個人帳戶和企業帳戶
- ⚠️ 地區限制（越南）

---

## DM 配對保護機制

### 什麼是 DM 配對保護？

Clawdbot 預設啟用 **DM 配對保護**（`dmPolicy="pairing"`），這是一項安全特性：

1. **未知發送者**會收到一個配對代碼
2. 訊息不會被處理，直到你核准配對
3. 核准後，發送者被加入本機白名單

::: warning 為什麼需要配對保護？
Clawdbot 連接真實訊息平台，**必須將入站 DM 視為不可信輸入**。配對保護可以：
- 防止垃圾訊息和濫用
- 避免處理惡意指令
- 保護你的 AI 配額和隱私
:::

### 如何核准配對？

```bash
# 查看待核准的配對請求
clawdbot pairing list

# 核准配對
clawdbot pairing approve <channel> <code>

# 範例：核准 Telegram 發送者
clawdbot pairing approve telegram 123456
```

### 配對流程範例

```
未知發送者：Hello AI!
Clawdbot：🔒 請先配對。配對代碼：ABC123
你的操作：clawdbot pairing approve telegram ABC123
Clawdbot：✅ 配對成功！現在可以發送訊息了。
```

::: tip 關閉 DM 配對保護（不推薦）
如果你想公開存取，可以設定：
```yaml
channels:
  telegram:
    dmPolicy: "open"
    allowFrom: ["*"]  # 允許所有使用者
```

⚠️ 這會降低安全性，請謹慎使用！
:::

---

## 群組訊息處理

### @mention 觸發

預設情況下，群組訊息需要 **@mention** 機器人才會回應：

```yaml
channels:
  slack:
    allowUnmentionedGroups: false  # 預設：需要 @mention
```

### 指令觸發

也可以使用指令前綴觸發：

```bash
# 在群組中發送
/ask 解釋一下量子糾纏
/help 列出可用指令
/new 開始新工作階段
```

### 設定範例

```yaml
channels:
  discord:
    allowUnmentionedGroups: false  # 需要 @mention
    # 或
    allowUnmentionedGroups: true   # 回應所有訊息（不推薦）
```

---

## 設定管道：精靈 vs 手動

### 方式 A：使用 Onboarding 精靈（推薦）

```bash
clawdbot onboard
```

精靈會引導你完成：
1. 選擇管道
2. 設定驗證（Token、API Key 等）
3. 設定 DM 策略
4. 測試連線

### 方式 B：手動設定

編輯設定檔 `~/.clawdbot/clawdbot.json`：

```yaml
channels:
  telegram:
    botToken: "your-bot-token"
    dmPolicy: "pairing"
    allowFrom: ["*"]
  whatsapp:
    accountId: "my-phone"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

重新啟動 Gateway 使設定生效：

```bash
clawdbot gateway restart
```

---

## 檢查點 ✅

完成本教學後，你應該能夠：

- [ ] 列出 Clawdbot 支援的所有管道
- [ ] 理解 DM 配對保護機制
- [ ] 選擇最適合你的管道
- [ ] 知道如何設定管道（精靈或手動）
- [ ] 理解群組訊息的觸發方式

::: tip 下一步
選擇一個管道，開始設定：
- [WhatsApp 管道設定](../whatsapp/) - 使用真實號碼
- [Telegram 管道設定](../telegram/) - 最簡單快速
- [Slack 管道設定](../slack/) - 團隊協作首選
- [Discord 管道設定](../discord/) - 社群場景
:::

---

## 踩坑提醒

### ❌ 忘記啟用 DM 配對保護

**錯誤做法**：
```yaml
channels:
  telegram:
    dmPolicy: "open"  # 太開放了！
```

**正確做法**：
```yaml
channels:
  telegram:
    dmPolicy: "pairing"  # 安全預設
```

::: danger DM 開放風險
開放 DM 意味著任何人都可以向你的 AI 助理發送訊息，可能導致：
- 配額濫用
- 隱私洩露
- 惡意指令執行
:::

### ❌ WhatsApp 在多個地方登入

**錯誤做法**：
- 在手機和 Clawdbot 同時登入同一號碼
- 頻繁重連 WhatsApp

**正確做法**：
- 使用單獨的測試號碼
- 避免頻繁重連
- 監控連線狀態

### ❌ Slack 未啟用 Socket Mode

**錯誤做法**：
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    # 缺少 appToken
```

**正確做法**：
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    appToken: "xapp-..."  # 必需
```

### ❌ Discord Intents 設定錯誤

**錯誤做法**：
- 只啟用基礎 Intents
- 忘記啟用 Message Content Intent

**正確做法**：
- 在 Discord Developer Portal 啟用所有必需的 Intents
- 特別是 Message Content Intent

---

## 本課小結

本課你學會了：

1. ✅ **管道概覽**：Clawdbot 支援 13+ 種通訊管道
2. ✅ **核心管道**：Telegram、WhatsApp、Slack、Discord 的特點和設定
3. ✅ **擴展管道**：LINE、BlueBubbles、Teams、Matrix 等特色管道
4. ✅ **DM 保護**：配對機制的安全價值和使用方法
5. ✅ **群組處理**：@mention 和指令觸發機制
6. ✅ **設定方式**：精靈和手動設定兩種方法

**下一步**：

- 學習 [WhatsApp 管道設定](../whatsapp/)，設定真實號碼
- 學習 [Telegram 管道設定](../telegram/)，最快上手方式
- 了解 [Slack 管道設定](../slack/)，團隊協作整合
- 掌握 [Discord 管道設定](../discord/)，社群場景

---

## 下一課預告

> 下一課我們學習 **[WhatsApp 管道設定](../whatsapp/)**。
>
> 你會學到：
> - 如何使用 QR Code 或手機連結登入 WhatsApp
> - 如何設定 DM 策略和群組規則
> - 如何管理多個 WhatsApp 帳戶
> - 如何排查 WhatsApp 連線問題

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能            | 檔案路徑                                                                                               | 行號    |
|--- | --- | ---|
| 管道註冊表       | [`src/channels/registry.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/registry.ts) | 7-100   |
| 管道外掛目錄   | [`src/channels/plugins/`](https://github.com/moltbot/moltbot/tree/main/src/channels/plugins/) | 全目錄  |
| 管道元資料類型   | [`src/channels/plugins/types.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/types.core.ts) | 74-93   |
| DM 配對機制     | [`src/channels/plugins/pairing.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/pairing.ts) | 全檔案  |
| 群組 @mention | [`src/channels/plugins/group-mentions.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/group-mentions.ts) | 全檔案  |
| 白名單匹配     | [`src/channels/plugins/allowlist-match.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/allowlist-match.ts) | 全檔案  |
| 管道目錄設定   | [`src/channels/plugins/directory-config.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/directory-config.ts) | 全檔案  |
| WhatsApp 外掛 | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 全檔案  |
| Telegram 外掛 | [`src/channels/plugins/onboarding/telegram.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/telegram.ts) | 全檔案  |
| Slack 外掛     | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 全檔案  |
| Discord 外掛   | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 全檔案  |

**關鍵常數**：
- `CHAT_CHANNEL_ORDER`：核心管道順序陣列（來自 `src/channels/registry.ts:7-15`）
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`：預設管道（來自 `src/channels/registry.ts:21`）
- `dmPolicy="pairing"`：預設 DM 配對策略（來自 `README.md:110`）

**關鍵類型**：
- `ChannelMeta`：管道元資料介面（來自 `src/channels/plugins/types.core.ts:74-93`）
- `ChannelAccountSnapshot`：管道帳戶狀態快照（來自 `src/channels/plugins/types.core.ts:95-142`）
- `ChannelSetupInput`：管道設定輸入介面（來自 `src/channels/plugins/types.core.ts:19-51`）

**關鍵函式**：
- `listChatChannels()`：列出所有核心管道（`src/channels/registry.ts:114-116`）
- `normalizeChatChannelId()`：規範化管道 ID（`src/channels/registry.ts:126-133`）
- `buildChannelUiCatalog()`：建構 UI 目錄（`src/channels/plugins/catalog.ts:213-239`）

</details>
