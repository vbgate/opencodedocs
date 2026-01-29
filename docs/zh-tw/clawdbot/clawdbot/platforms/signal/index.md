---
title: "Signal 頻道設定：基於 signal-cli 的安全 AI 助手整合 | Clawdbot 教程"
sidebarTitle: "連接私密的 Signal AI"
subtitle: "Signal 頻道設定：基於 signal-cli 的安全 AI 助手整合 | Clawdbot 教程"
description: "學習如何在 Clawdbot 中設定 Signal 頻道，包括 signal-cli 安裝、帳戶連結、多帳戶支援、DM 配對機制、群組訊息和存取控制等核心功能。本教程詳細講解從安裝到使用的完整流程，幫助你快速搭建基於 Signal 的個人 AI 助手。"
tags:
  - "Signal"
  - "signal-cli"
  - "頻道設定"
  - "訊息平台"
prerequisite:
  - "start-getting-started"
order: 120
---

# Signal 頻道設定：使用 signal-cli 連接個人 AI 助手 | Clawdbot 教程

## 學完你能做什麼

完成本課後，你將能夠：

- ✅ 安裝並設定 signal-cli
- ✅ 在 Clawdbot 中設定 Signal 頻道
- ✅ 透過私訊和群組與 AI 助手互動
- ✅ 使用 DM 配對機制保護你的帳戶
- ✅ 設定多帳戶 Signal 支援
- ✅ 使用 Signal 的打字指示器、已讀回執和 Reactions

## 你現在的困境

你想在 Signal 上使用 AI 助手，但遇到了這些問題：

- ❌ 不知道如何連接 Signal 和 Clawdbot
- ❌ 擔心隱私問題，不想將資料上傳到雲端
- ❌ 不確定如何控制誰能向 AI 助手發送訊息
- ❌ 需要在多個 Signal 帳戶之間切換

::: info 為什麼選擇 Signal？
Signal 是一個端到端加密的即時通訊應用程式，所有通訊都經過加密，只有發送方和接收方能讀取訊息。Clawdbot 透過 signal-cli 整合，讓你在保持隱私的同時享受 AI 助手的功能。
:::

## 什麼時候用這一招

**適合使用 Signal 頻道的場景**：

- 你需要一個隱私優先的通訊管道
- 你的團隊或朋友群組使用 Signal
- 你需要在個人裝置上執行 AI 助手（本機優先）
- 你需要透過受保護的 DM 配對機制控制存取

::: tip 獨立的 Signal 帳號
推薦使用一個**獨立的 Signal 號碼**作為 bot 帳戶，而不是你的個人號碼。這樣可以避免訊息迴圈（bot 忽略自己的訊息），並保持工作和個人通訊分離。
:::

## 開始前的準備

在開始之前，請確認你已經完成了以下步驟：

::: warning 前置條件
- ✅ 已完成 [快速開始](../../start/getting-started/) 教程
- ✅ Clawdbot 已安裝並可以正常執行
- ✅ 已設定至少一個 AI 模型供應商（Anthropic、OpenAI、OpenRouter 等）
- ✅ 已安裝 Java（signal-cli 需要）
:::

## 核心思路

Clawdbot 的 Signal 整合基於 **signal-cli**，透過以下方式工作：

1. **守護程序模式**：signal-cli 作為後台守護程序執行，提供 HTTP JSON-RPC 介面
2. **事件流（SSE）**：Clawdbot 透過 Server-Sent Events（SSE）接收訊號事件
3. **標準化訊息**：Signal 訊息被轉換為統一的內部格式，然後路由到 AI Agent
4. **確定性路由**：所有回覆都會發送回原始訊息的發送者或群組

**關鍵設計原則**：

- **本機優先**：signal-cli 在你的裝置上執行，所有通訊都經過加密
- **多帳戶支援**：可以設定多個 Signal 帳戶
- **存取控制**：預設啟用 DM 配對機制，陌生人需要批准才能發送訊息
- **上下文隔離**：群組訊息有獨立的會話上下文，不會與私訊混合

## 跟我做

### 第 1 步：安裝 signal-cli

**為什麼**
signal-cli 是 Signal 的命令列介面，Clawdbot 透過它與 Signal 網路通訊。

**安裝方法**

::: code-group

```bash [macOS (Homebrew)]
brew install signal-cli
```

```bash [Linux (Ubuntu/Debian)]
# 訪問 https://github.com/AsamK/signal-cli/releases 查看最新版本
# 下載最新的 signal-cli 發布包（將 VERSION 替換為實際版本號）
wget https://github.com/AsamK/signal-cli/releases/download/vVERSION/signal-cli-VERSION.tar.gz

# 解壓縮到 /opt 目錄
sudo tar -xvf signal-cli-VERSION.tar.gz -C /opt/

# 建立符號連結（可選）
sudo ln -s /opt/signal-cli-VERSION/bin/signal-cli /usr/local/bin/signal-cli
```

```bash [Windows (WSL2)]
# 在 WSL2 中使用 Linux 安裝方法
# 注意：Windows 使用 WSL2，signal-cli 安裝遵循 Linux 流程
```

:::

**驗證安裝**

```bash
signal-cli --version
# 應該看到：signal-cli 版本號（如 0.13.x 或更高版本）
```

**你應該看到**：signal-cli 的版本號輸出。

::: danger Java 要求
signal-cli 需要 Java 執行時（通常為 Java 11 或更高版本）。請確保已安裝並設定好 Java：

```bash
java -version
# 應該看到：openjdk version "11.x.x" 或更高版本
```

**注意**：具體 Java 版本要求請參考 [signal-cli 官方文件](https://github.com/AsamK/signal-cli#readme)。
:::

### 第 2 步：連結 Signal 帳戶

**為什麼**
連結帳戶後，signal-cli 才能代表你的 Signal 號碼發送和接收訊息。

**推薦做法**：使用一個獨立的 Signal 號碼作為 bot 帳戶。

**連結步驟**

1. **產生連結指令**：

```bash
signal-cli link -n "Clawdbot"
```

`-n "Clawdbot"` 指定裝置名稱為 "Clawdbot"（你可以自訂）。

2. **掃描 QR Code**：

執行指令後，終端機會顯示一個 QR Code：

```
tsconfig: 2369:35 - warning - *! is deprecated: Use .nonNull().
  (deprecated-non-null)

To link your device, navigate to
  Signal Settings > Linked Devices > (+) Link New Device
  on your phone and scan the QR code displayed below.

████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
████████████████████████████████████████████████
...
```

3. **在 Signal 手機應用程式中**：

   - 開啟 Signal 設定
   - 選擇"已關聯的裝置"（Linked Devices）
   - 點擊"(+) 關聯新裝置"（Link New Device）
   - 掃描終端機顯示的 QR Code

**你應該看到**：連結成功後，終端機會顯示類以下的輸出：

```
INFO  Account restored (Number: +15551234567)
INFO  Configuration created at: ~/.local/share/signal-cli/data
```

::: tip 多裝置支援
Signal 允許最多關聯 4 個裝置。Clawdbot 會作為其中一個裝置執行。你可以在 Signal 手機應用程式的"已關聯的裝置"中查看和管理這些裝置。
:::

### 第 3 步：設定 Clawdbot 的 Signal 頻道

**為什麼**
設定檔告訴 Clawdbot 如何連接到 signal-cli，以及如何處理來自 Signal 的訊息。

**設定方式**

有三種設定方式，選擇最適合你的：

#### 方式 1：快速設定（單一帳戶）

這是最簡單的方式，適合單一帳戶場景。

編輯 `~/.clawdbot/clawdbot.json`：

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "account": "+15551234567",
      "cliPath": "signal-cli",
      "dmPolicy": "pairing",
      "allowFrom": ["+15557654321"]
    }
  }
}
```

**設定說明**：

| 欄位 | 值 | 說明 |
|------|-----|------|
| `enabled` | `true` | 啟用 Signal 頻道 |
| `account` | `"+15551234567"` | 你的 Signal 帳號（E.164 格式） |
| `cliPath` | `"signal-cli"` | signal-cli 指令路徑 |
| `dmPolicy` | `"pairing"` | DM 存取策略（預設配對模式） |
| `allowFrom` | `["+15557654321"]` | 允許發送 DM 的號碼白名單 |

#### 方式 2：多帳戶設定

如果你需要管理多個 Signal 帳戶，使用 `accounts` 物件：

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "accounts": {
        "work": {
          "account": "+15551234567",
          "name": "Work Bot",
          "httpPort": 8080,
          "dmPolicy": "pairing",
          "allowFrom": ["+15557654321"]
        },
        "personal": {
          "account": "+15559876543",
          "name": "Personal Bot",
          "httpPort": 8081,
          "dmPolicy": "allowlist",
          "allowFrom": ["*"]
        }
      }
    }
  }
}
```

**設定說明**：

- 每個帳戶有一個唯一的 ID（如 `work`、`personal`）
- 每個帳戶可以有不同的連接埠、策略和權限
- `name` 是可選的顯示名稱，用於 CLI/UI 列表

#### 方式 3：外部守護程序模式

如果你想自己管理 signal-cli（例如在容器中或共用 CPU），停用自動啟動：

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "httpUrl": "http://127.0.0.1:8080",
      "autoStart": false
    }
  }
}
```

**設定說明**：

- `httpUrl`：完整的守護程序 URL（覆蓋 `httpHost` 和 `httpPort`）
- `autoStart`：設為 `false` 停用自動啟動 signal-cli
- Clawdbot 會連接到已執行的 signal-cli 守護程序

**你應該看到**：設定檔儲存後，沒有語法錯誤。

::: tip 設定驗證
Clawdbot 會在啟動時驗證設定。如果設定有誤，會在日誌中顯示詳細的錯誤資訊。
:::

### 第 4 步：啟動 Gateway

**為什麼**
啟動 Gateway 後，Clawdbot 會自動啟動 signal-cli 守護程序（除非你停用了 `autoStart`），並開始監聽 Signal 訊息。

**啟動指令**

```bash
clawdbot gateway start
```

**你應該看到**：類以下的輸出：

```
[INFO] Starting Clawdbot Gateway...
[INFO] Starting signal-cli daemon...
[INFO] signal-cli: INFO  Starting daemon...
[INFO] signal-cli: INFO  Daemon started on http://127.0.0.1:8080
[INFO] Signal channel ready (account: +15551234567)
[INFO] Gateway listening on ws://127.0.0.1:18789
[INFO] Clawdbot Gateway started successfully
```

**檢查 Channel 狀態**

```bash
clawdbot channels status
```

**你應該看到**：類以下的輸出：

```
Signal Channels:
  ├─ +15551234567 (Work Bot)
  │   ├─ Status: Connected
  │   ├─ Daemon: http://127.0.0.1:8080
  │   └─ Mode: Auto-start
```

### 第 5 步：發送第一則訊息

**為什麼**
驗證設定是否正確，確保 Clawdbot 能接收和處理 Signal 訊息。

**發送訊息**

1. **從你的 Signal 手機應用程式**，發送訊息給你的 bot 號碼：

```
你好，Clawdbot！
```

2. **首次訊息處理**：

   如果 `dmPolicy="pairing"`（預設），陌生人會收到配對代碼：

   ```
   ❌ 未授權的發送者

   要繼續，請使用以下代碼批准此配對：

   📝 配對代碼：ABC123

   代碼將在 1 小時後過期。

   要批准，請執行：
   clawdbot pairing approve signal ABC123
   ```

3. **批准配對**：

   ```bash
   clawdbot pairing list signal
   ```

   列出待批准的配對請求：

   ```
   Pending Pairings (Signal):
     ├─ ABC123
     │   ├─ Sender: +15557654321
     │   ├─ UUID: uuid:123e4567-e89b-12d3-a456-426614174000
     │   └─ Expires: 2026-01-27 12:00:00
   ```

   批准配對：

   ```bash
   clawdbot pairing approve signal ABC123
   ```

4. **發送第二則訊息**：

   配對成功後，再次發送訊息：

   ```
   你好，Clawdbot！
   ```

**你應該看到**：

- Signal 手機應用程式收到 AI 的回覆：
  ```
  你好！我是 Clawdbot，你的個人 AI 助手。有什麼可以幫助你的嗎？
  ```

- Gateway 日誌顯示：
  ```
  [INFO] Received Signal message from +15557654321
  [INFO] Processing message through Agent...
  [INFO] Sending Signal response to +15557654321
  ```

**檢查點 ✅**：

- [ ] signal-cli 守護程序執行中
- [ ] Channel 狀態顯示 "Connected"
- [ ] 發送訊息後收到 AI 回覆
- [ ] Gateway 日誌沒有錯誤資訊

::: danger 自己的訊息會被忽略
如果你在個人 Signal 號碼上執行 bot，bot 會忽略你自己發送的訊息（迴圈保護）。推薦使用獨立的 bot 號碼。
:::

## 踩坑提醒

### 坑 1：signal-cli 啟動失敗

**問題**：signal-cli 守護程序無法啟動

**可能原因**：

1. Java 未安裝或版本過低
2. 連接埠已被佔用
3. signal-cli 路徑不正確

**解決方案**：

```bash
# 檢查 Java 版本
java -version

# 檢查連接埠佔用
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows (PowerShell)

# 檢查 signal-cli 路徑
which signal-cli
```

### 坑 2：配對代碼過期

**問題**：配對代碼在 1 小時後過期

**解決方案**：

重新發送訊息，取得新的配對代碼，並在 1 小時內批准。

### 坑 3：群組訊息不回應

**問題**：在 Signal 群組中 @ 提及 bot，但沒有回應

**可能原因**：

- `groupPolicy` 設定為 `allowlist`，但你不在 `groupAllowFrom` 中
- Signal 不支援原生 @ 提及（不像 Discord/Slack）

**解決方案**：

設定群組策略：

```json
{
  "channels": {
    "signal": {
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["+15557654321"]
    }
  }
}
```

或使用指令觸發（如果設定了 `commands.config: true`）：

```
@clawdbot help
```

### 坑 4：媒體檔案下載失敗

**問題**：Signal 訊息中的圖片或附件無法處理

**可能原因**：

- 檔案大小超過 `mediaMaxMb` 限制（預設 8MB）
- `ignoreAttachments` 設定為 `true`

**解決方案**：

```json
{
  "channels": {
    "signal": {
      "mediaMaxMb": 20,
      "ignoreAttachments": false
    }
  }
}
```

### 坑 5：長訊息被截斷

**問題**：發送的訊息被分割成多段

**原因**：Signal 有訊息長度限制（預設 4000 字元），Clawdbot 會自動分塊

**解決方案**：

調整分塊設定：

```json
{
  "channels": {
    "signal": {
      "textChunkLimit": 2000,
      "chunkMode": "newline"
    }
  }
}
```

`chunkMode` 選項：
- `length`（預設）：按長度分塊
- `newline`：先按空行分割（段落邊界），再按長度分塊

## 本課小結

本課我們完成了 Signal 頻道的設定和使用：

**核心概念**：
- Signal 頻道基於 signal-cli，透過 HTTP JSON-RPC + SSE 通訊
- 推薦使用獨立的 bot 號碼，避免訊息迴圈
- 預設啟用 DM 配對機制，保護你的帳戶安全

**關鍵設定**：
- `account`：Signal 帳號（E.164 格式）
- `cliPath`：signal-cli 路徑
- `dmPolicy`：DM 存取策略（預設 `pairing`）
- `allowFrom`：DM 白名單
- `groupPolicy` / `groupAllowFrom`：群組策略

**實用功能**：
- 多帳戶支援
- 群組訊息（獨立上下文）
- 打字指示器
- 已讀回執
- Reactions（表情反應）

**故障排除**：
- 使用 `clawdbot channels status` 檢查 Channel 狀態
- 使用 `clawdbot pairing list signal` 查看待批准的配對請求
- 查看 Gateway 日誌取得詳細錯誤資訊

## 下一課預告

> 下一課我們學習 **[iMessage 頻道](../imessage/)**。
>
> 你會學到：
> - 如何在 macOS 上設定 iMessage 頻道
> - 使用 BlueBubbles 擴充支援
> - iMessage 的特殊功能（已讀回執、打字指示器等）
> - iOS 節點整合（Camera、Canvas、Voice Wake）

繼續探索 Clawdbot 的強大功能吧！🚀

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能        | 檔案路徑                                                                                    | 行號    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| Signal RPC 客戶端 | [`src/signal/client.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/client.ts)         | 1-186   |
| Signal 守護程序管理 | [`src/signal/daemon.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/daemon.ts)         | 1-85    |
| 多帳戶支援 | [`src/signal/accounts.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/accounts.ts)       | 1-84    |
| Signal 監控和事件處理 | [`src/signal/monitor.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/monitor.ts)       | -       |
| 訊息發送 | [`src/signal/send.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send.ts)             | -       |
| Reactions 發送 | [`src/signal/send-reactions.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/send-reactions.ts) | -       |
| Reaction 級別設定 | [`src/signal/reaction-level.ts`](https://github.com/clawd/clawdbot/blob/main/src/signal/reaction-level.ts) | -       |

**設定類型定義**：
- `SignalAccountConfig`: [`src/config/types.signal.ts:13-87`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L13-L87)
- `SignalConfig`: [`src/config/types.signal.ts:89-93`](https://github.com/clawd/clawdbot/blob/main/src/config/types.signal.ts#L89-L93)

**關鍵常量**：
- `DEFAULT_TIMEOUT_MS = 10_000`：Signal RPC 請求預設逾時時間（10 秒）來源：`src/signal/client.ts:29`
- 預設 HTTP 連接埠：`8080` 來源：`src/signal/accounts.ts:59`
- 預設文字分塊大小：`4000` 字元 來源：`docs/channels/signal.md:113`

**關鍵函數**：
- `signalRpcRequest<T>()`：發送 JSON-RPC 請求到 signal-cli 來源：`src/signal/client.ts:54-90`
- `streamSignalEvents()`：透過 SSE 訂閱 Signal 事件 來源：`src/signal/client.ts:112-185`
- `spawnSignalDaemon()`：啟動 signal-cli 守護程序 來源：`src/signal/daemon.ts:50-84`
- `resolveSignalAccount()`：解析 Signal 帳戶設定 來源：`src/signal/accounts.ts:49-77`
- `listEnabledSignalAccounts()`：列出已啟用的 Signal 帳戶 來源：`src/signal/accounts.ts:79-83`

</details>
