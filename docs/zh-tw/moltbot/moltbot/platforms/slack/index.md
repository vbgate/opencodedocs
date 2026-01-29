---
title: "Slack 頻道設定完全指南：Socket/HTTP Mode、安全設定 | Clawdbot 教程"
sidebarTitle: "Slack 也用 AI"
subtitle: "Slack 頻道設定完全指南 | Clawdbot 教程"
description: "學習如何在 Clawdbot 中設定和使用 Slack 頻道。本教學涵蓋 Socket Mode 和 HTTP Mode 兩種連線方式、Token 取得步驟、DM 安全設定、群組管理策略以及 Slack Actions 工具使用。"
tags:
  - "platforms"
  - "slack"
  - "設定"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 90
---

# Slack 頻道設定完全指南

## 學完你能做什麼

- ✅ 在 Slack 中與 Clawdbot 互動，使用 AI 助手完成任務
- ✅ 設定 DM 安全策略，保護個人隱私
- ✅ 在群組中整合 Clawdbot，智慧回覆 @ 提及和指令
- ✅ 使用 Slack Actions 工具（傳送訊息、管理 Pin、檢視成員資訊等）
- ✅ 選擇 Socket Mode 或 HTTP Mode 兩種連線方式

## 你現在的困境

Slack 是團隊協作的核心工具，但你可能遇到以下問題：

- 團隊討論分散在多個頻道，錯過重要資訊
- 需要快速查詢歷史訊息、Pin 或成員資訊，但 Slack 介面不夠便利
- 希望在 Slack 中直接使用 AI 能力，而不用切換到其他應用程式
- 擔心在群組中開啟 AI 助手會造成訊息氾濫或隱私外洩

## 什麼時候用這一招

- **團隊日常溝通**：Slack 是你團隊的主要溝通工具
- **需要 Slack 原生整合**：利用 Reaction、Pin、Thread 等功能
- **多帳戶需求**：需要連接多個 Slack Workspace
- **遠端部署場景**：使用 HTTP Mode 連接遠端 Gateway

## 🎒 開始前的準備

::: warning 前置檢查
在開始前，請確認：
- 已完成 [快速開始](../../start/getting-started/)
- Gateway 已啟動並執行
- 擁有 Slack Workspace 的管理員權限（建立 App）
:

**你需要的資源**：
- [Slack API 控制台](https://api.slack.com/apps) - 建立和管理 Slack App
- Clawdbot 設定檔 - 通常位於 `~/.clawdbot/clawdbot.json`

## 核心思路

Clawdbot 的 Slack 頻道基於 [Bolt](https://slack.dev/bolt-js) 框架實作，支援兩種連線模式：

| 模式 | 適用場景 | 優勢 | 劣勢 |
|--- | --- | --- | ---|
| **Socket Mode** | 本地 Gateway、個人使用 | 設定簡單（只需 Token） | 需要常連 WebSocket |
| **HTTP Mode** | 伺服器部署、遠端存取 | 可透過防火牆、支援負載平衡 | 需要公網 IP、設定複雜 |

**預設使用 Socket Mode**，適合大多數使用者。

**認證機制**：
- **Bot Token** (`xoxb-...`) - 必需，用於 API 呼叫
- **App Token** (`xapp-...`) - Socket Mode 必需，用於 WebSocket 連線
- **User Token** (`xoxp-...`) - 可選，用於唯讀操作（歷史紀錄、Pin、Reactions）
- **Signing Secret** - HTTP Mode 必需，用於驗證 Webhook 請求

## 跟我做

### 第 1 步：建立 Slack App

**為什麼**
Slack App 是 Clawdbot 與 Workspace 之間的橋樑，提供認證和權限控制。

1. 前往 [Slack API 控制台](https://api.slack.com/apps)
2. 點擊 **Create New App** → 選擇 **From scratch**
3. 填寫 App 資訊：
   - **App Name**：`Clawdbot`（或你喜歡的名稱）
   - **Pick a workspace to develop your app in**：選擇你的 Workspace
4. 點擊 **Create App**

**你應該看到**：
App 建立成功，進入基本設定頁面。

### 第 2 步：設定 Socket Mode（推薦）

::: tip 提示
如果你使用本地 Gateway，推薦 Socket Mode，設定更簡單。
:

**為什麼**
Socket Mode 不需要公網 IP，透過 Slack 的 WebSocket 服務連線。

1. 在 App 設定頁面，找到 **Socket Mode**，切換為 **On**
2. 滾動到 **App-Level Tokens**，點擊 **Generate Token and Scopes**
3. 在 **Token** 部分，選擇 scope：
   - 勾選 `connections:write`
4. 點擊 **Generate Token**，複製生成的 **App Token**（以 `xapp-` 開頭）

**你應該看到**：
生成的 Token 類似：`xapp-1-A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P`

::: danger 安全提醒
App Token 是敏感資訊，請妥善保管，不要外洩到公開倉庫。
:

### 第 3 步：設定 Bot Token 和權限

1. 滾動到 **OAuth & Permissions** → **Bot Token Scopes**
2. 新增以下 scopes（權限）：

**Bot Token Scopes（必需）**：

```yaml
    chat:write                    # 傳送/編輯/刪除訊息
    channels:history              # 讀取頻道歷史
    channels:read                 # 取得頻道資訊
    groups:history                # 讀取群組歷史
    groups:read                   # 取得群組資訊
    im:history                   # 讀取 DM 歷史
    im:read                      # 取得 DM 資訊
    im:write                     # 開啟 DM 會話
    mpim:history                # 讀取群組 DM 歷史
    mpim:read                   # 取得群組 DM 資訊
    users:read                   # 查詢使用者資訊
    app_mentions:read            # 讀取 @ 提及
    reactions:read               # 讀取 Reaction
    reactions:write              # 新增/刪除 Reaction
    pins:read                    # 讀取 Pin 列表
    pins:write                   # 新增/刪除 Pin
    emoji:read                   # 讀取自訂 Emoji
    commands                     # 處理斜線指令
    files:read                   # 讀取檔案資訊
    files:write                  # 上傳檔案
```

::: info 說明
以上是 **Bot Token** 的必需權限，確保 Bot 能正常讀取訊息、傳送回覆、管理 Reaction 和 Pin。
:

3. 滾動到頁面頂部，點擊 **Install to Workspace**
4. 點擊 **Allow** 授權 App 存取你的 Workspace
5. 複製生成的 **Bot User OAuth Token**（以 `xoxb-` 開頭）

**你應該看到**：
Token 類似：`xoxb-YOUR-BOT-TOKEN-HERE`

::: tip 提示
 如果你需要 **User Token**（用於唯讀操作），滾動到 **User Token Scopes**，新增以下權限：
- `channels:history`, `groups:history`, `im:history`, `mpim:history`
- `channels:read`, `groups:read`, `im:read`, `mpim:read`
- `users:read`, `reactions:read`, `pins:read`, `emoji:read`
- `search:read`

然後在 **Install App** 頁面複製 **User OAuth Token**（以 `xoxp-` 開頭）。

**User Token Scopes（可選，唯讀）**：
- 僅用於讀取歷史紀錄、Reaction、Pin、Emoji 和搜尋
- 寫入操作仍使用 Bot Token（除非設定 `userTokenReadOnly: false`）
:

### 第 4 步：設定事件訂閱

1. 在 App 設定頁面，找到 **Event Subscriptions**，啟用 **Enable Events**
2. 在 **Subscribe to bot events** 中新增以下事件：

```yaml
    app_mention                  # @ 提及 Bot
    message.channels              # 頻道訊息
    message.groups               # 群組訊息
    message.im                   # DM 訊息
    message.mpim                # 群組 DM 訊息
    reaction_added               # 新增 Reaction
    reaction_removed             # 刪除 Reaction
    member_joined_channel       # 成員加入頻道
    member_left_channel          # 成員離開頻道
    channel_rename               # 頻道重新命名
    pin_added                   # 新增 Pin
    pin_removed                 # 刪除 Pin
```

3. 點擊 **Save Changes**

### 第 5 步：啟用 DM 功能

1. 在 App 設定頁面，找到 **App Home**
2. 啟用 **Messages Tab** → 開啟 **Enable Messages Tab**
3. 確保顯示 **Messages tab read-only disabled: No**

**你應該看到**：
Messages Tab 已啟用，使用者可以與 Bot 進行 DM 對話。

### 第 6 步：設定 Clawdbot

**為什麼**
將 Slack Token 設定到 Clawdbot，建立連線。

#### 方式一：使用環境變數（推薦）

```bash
    # 設定環境變數
    export SLACK_BOT_TOKEN="xoxb-你的BotToken"
    export SLACK_APP_TOKEN="xapp-你的AppToken"

    # 重啟 Gateway
    clawdbot gateway restart
```

**你應該看到**：
Gateway 啟動日誌中顯示 `Slack: connected`。

#### 方式二：設定檔

編輯 `~/.clawdbot/clawdbot.json`：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken"
    }
  }
}
```

**如果你有 User Token**：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken",
      "userToken": "xoxp-你的UserToken",
      "userTokenReadOnly": true
    }
  }
}
```

**你應該看到**：
重啟 Gateway 後，Slack 連線成功。

### 第 7 步：邀請 Bot 到頻道

1. 在 Slack 中開啟你想讓 Bot 加入的頻道
2. 輸入 `/invite @Clawdbot`（替換為你的 Bot 名稱）
3. 點擊 **Add to channel**

**你應該看到**：
Bot 成功加入頻道，並顯示 "Clawdbot has joined the channel"。

### 第 8 步：設定群組安全策略

**為什麼**
防止 Bot 在所有頻道中自動回覆，保護隱私。

編輯 `~/.clawdbot/clawdbot.json`：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken",
      "groupPolicy": "allowlist",
      "channels": {
        "C1234567890": {
          "allow": true,
          "requireMention": true
        },
        "#general": {
          "allow": true,
          "requireMention": true
        }
      }
    }
  }
}
```

**欄位說明**：
- `groupPolicy`: 群組策略
  - `"open"` - 允許所有頻道（不推薦）
  - `"allowlist"` - 僅允許列出的頻道（推薦）
  - `"disabled"` - 禁止所有頻道
- `channels`: 頻道設定
  - `allow`: 允許/拒絕
  - `requireMention`: 是否需要 @ 提及 Bot 才回覆（預設 `true`）
  - `users`: 額外的使用者白名單
  - `skills`: 限制該頻道使用的技能
  - `systemPrompt`: 額外的系統提示詞

**你應該看到**：
Bot 只在設定的頻道中回覆訊息，且需要 @ 提及。

### 第 9 步：設定 DM 安全策略

**為什麼**
防止陌生人透過 DM 與 Bot 互動，保護隱私。

編輯 `~/.clawdbot/clawdbot.json`：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-你的BotToken",
      "appToken": "xapp-你的AppToken",
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["U1234567890", "@alice", "user@example.com"]
      }
    }
  }
}
```

**欄位說明**：
- `dm.enabled`: 啟用/停用 DM（預設 `true`）
- `dm.policy`: DM 策略
  - `"pairing"` - 陌生人收到配對碼，需要審批（預設）
  - `"open"` - 允許任何人 DM
  - `"allowlist"` - 僅允許白名單使用者
- `dm.allowFrom`: 白名單列表
  - 支援使用者 ID（`U1234567890`）
  - 支援 @ 提及（`@alice`）
  - 支援電子郵件（`user@example.com`）

**配對流程**：
1. 陌生人傳送 DM 給 Bot
2. Bot 回覆配對碼（有效期 1 小時）
3. 使用者提供配對碼給管理員
4. 管理員執行：`clawdbot pairing approve slack <配對碼>`
5. 使用者被加入白名單，可以正常使用

**你應該看到**：
未知發送者收到配對碼，Bot 不處理他們的訊息。

### 第 10 步：測試 Bot

1. 在設定的頻道中傳送訊息：`@Clawdbot 你好`
2. 或傳送 DM 給 Bot
3. 觀察 Bot 的回覆

**你應該看到**：
Bot 正常回覆你的訊息。

### 檢查點 ✅

- [ ] Slack App 建立成功
- [ ] Socket Mode 已啟用
- [ ] Bot Token 和 App Token 已複製
- [ ] Clawdbot 設定檔已更新
- [ ] Gateway 已重啟
- [ ] Bot 已邀請到頻道
- [ ] 群組安全策略已設定
- [ ] DM 安全策略已設定
- [ ] 測試訊息收到回覆

## 踩坑提醒

### 常見錯誤 1：Bot 無回應

**問題**：傳送訊息後，Bot 沒有回覆。

**可能原因**：
1. Bot 未加入頻道 → 使用 `/invite @Clawdbot` 邀請
2. `requireMention` 設定為 `true` → 傳送訊息時需要 `@Clawdbot`
3. Token 設定錯誤 → 檢查 `clawdbot.json` 中的 Token 是否正確
4. Gateway 未執行 → 執行 `clawdbot gateway status` 檢查狀態

### 常見錯誤 2：Socket Mode 連線失敗

**問題**：Gateway 日誌顯示連線失敗。

**解決方法**：
1. 檢查 App Token 是否正確（以 `xapp-` 開頭）
2. 檢查 Socket Mode 是否啟用
3. 檢查網路連線

### 常見錯誤 3：User Token 權限不足

**問題**：某些操作失敗，提示權限錯誤。

**解決方法**：
1. 確保 User Token 包含所需權限（見步驟 3）
2. 檢查 `userTokenReadOnly` 設定（預設 `true`，唯讀）
3. 如需寫入操作，設定 `"userTokenReadOnly": false`

### 常見錯誤 4：頻道 ID 解析失敗

**問題**：設定的頻道名稱無法解析為 ID。

**解決方法**：
1. 優先使用頻道 ID（如 `C1234567890`）而非名稱
2. 確保頻道名稱以 `#` 開頭（如 `#general`）
3. 檢查 Bot 是否有權限存取該頻道

## 進階設定

### 權限說明

::: info Bot Token vs User Token
- **Bot Token**：必需，用於 Bot 的主要功能（傳送訊息、讀取歷史、管理 Pin/Reaction 等）
- **User Token**：可選，僅用於唯讀操作（歷史紀錄、Reaction、Pin、Emoji、搜尋）
  - 預設 `userTokenReadOnly: true`，確保唯讀
  - 寫入操作（傳送訊息、新增 Reaction 等）仍使用 Bot Token
:

**未來可能需要的權限**：

以下權限在目前版本中不是必需的，但未來可能新增支援：

| 權限 | 用途 |
|--- | ---|
| `groups:write` | 私有頻道管理（建立、重新命名、邀請、封存） |
| `mpim:write` | 群組 DM 會話管理 |
| `chat:write.public` | 向 Bot 未加入的頻道發布訊息 |
| `files:read` | 列出/讀取檔案詮釋資料 |

如需啟用這些功能，請在 Slack App 的 **Bot Token Scopes** 中新增對應權限。

### HTTP Mode（伺服器部署）

如果你的 Gateway 部署在遠端伺服器，使用 HTTP Mode：

1. 建立 Slack App，停用 Socket Mode
2. 複製 **Signing Secret**（Basic Information 頁面）
3. 設定 Event Subscriptions，設定 **Request URL** 為 `https://你的網域/slack/events`
4. 設定 Interactivity & Shortcuts，設定相同的 **Request URL**
5. 設定 Slash Commands，設定 **Request URL**

**設定檔**：

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "http",
      "botToken": "xoxb-你的BotToken",
      "signingSecret": "你的SigningSecret",
      "webhookPath": "/slack/events"
    }
  }
}
```

### 多帳戶設定

支援連接多個 Slack Workspace：

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "workspace1": {
          "name": "Team A",
          "enabled": true,
          "botToken": "xoxb-Workspace1Token",
          "appToken": "xapp-Workspace1Token"
        },
        "workspace2": {
          "name": "Team B",
          "enabled": true,
          "botToken": "xoxb-Workspace2Token",
          "appToken": "xapp-Workspace2Token"
        }
      }
    }
  }
}
```

### 設定斜線指令

啟用 `/clawd` 指令：

1. 在 App 設定頁面，找到 **Slash Commands**
2. 建立指令：
   - **Command**：`/clawd`
   - **Request URL**：Socket Mode 不需要（透過 WebSocket 處理）
   - **Description**：`Send a message to Clawdbot`

**設定檔**：

```json
{
  "channels": {
    "slack": {
      "slashCommand": {
        "enabled": true,
        "name": "clawd",
        "ephemeral": true
      }
    }
  }
}
```

### 回覆執行緒設定

控制 Bot 在頻道中的回覆方式：

```json
{
  "channels": {
    "slack": {
      "replyToMode": "off",
      "replyToModeByChatType": {
        "direct": "all",
        "group": "first"
      }
    }
  }
}
```

| 模式 | 行為 |
|--- | ---|
| `off` | 預設，在主頻道回覆 |
| `first` | 首條回覆進入執行緒，後續回覆在主頻道 |
| `all` | 所有回覆都在執行緒 |

### 啟用 Slack Actions 工具

允許 Agent 呼叫 Slack 特定操作：

```json
{
  "channels": {
    "slack": {
      "actions": {
        "reactions": true,
        "messages": true,
        "pins": true,
        "memberInfo": true,
        "emojiList": true
      }
    }
  }
}
```

**可用操作**：
- `sendMessage` - 傳送訊息
- `editMessage` - 編輯訊息
- `deleteMessage` - 刪除訊息
- `readMessages` - 讀取歷史訊息
- `react` - 新增 Reaction
- `reactions` - 列出 Reactions
- `pinMessage` - Pin 訊息
- `unpinMessage` - 取消 Pin
- `listPins` - 列出 Pin
- `memberInfo` - 取得成員資訊
- `emojiList` - 列出自訂 Emoji

## 本課小結

- Slack 頻道支援 Socket Mode 和 HTTP Mode 兩種連線方式
- Socket Mode 設定簡單，推薦本地使用
- DM 安全策略預設為 `pairing`，陌生人需要審批
- 群組安全策略支援白名單和 @ 提及過濾
- Slack Actions 工具提供豐富的操作能力
- 多帳戶支援連接多個 Workspace

## 下一課預告

> 下一課我們學習 **[Discord 頻道](../discord/)**。
>
> 你會學到：
> - Discord Bot 的設定方法
> - Token 取得和權限設定
> - 群組和 DM 安全策略
> - Discord 特定工具的使用

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能            | 檔案路徑                                                                                               | 行號       |
|--- | --- | ---|
| Slack 設定類型 | [`src/config/types.slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/types.slack.ts) | 1-150      |
| Slack onboarding 邏輯 | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 1-539      |
| Slack Actions 工具 | [`src/agents/tools/slack-actions.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/slack-actions.ts) | 1-301      |
| Slack 官方文件 | [`docs/channels/slack.md`](https://github.com/moltbot/moltbot/blob/main/docs/channels/slack.md) | 1-508      |

**關鍵類型定義**：
- `SlackConfig`：Slack 頻道主設定類型
- `SlackAccountConfig`：單一帳戶設定（支援 socket/http 模式）
- `SlackChannelConfig`：頻道設定（白名單、mention 策略等）
- `SlackDmConfig`：DM 設定（pairing、allowlist 等）
- `SlackActionConfig`：Actions 工具權限控制

**關鍵函式**：
- `handleSlackAction()`：處理 Slack Actions 工具呼叫
- `resolveThreadTsFromContext()`：根據 replyToMode 解析執行緒 ID
- `buildSlackManifest()`：產生 Slack App Manifest

</details>
