---
title: "WhatsApp 渠道設定完全指南 | Clawdbot 教學"
sidebarTitle: "5 分鐘接入 WhatsApp"
subtitle: "WhatsApp 渠道設定完全指南"
description: "學習如何在 Clawdbot 中設定和使用 WhatsApp 渠道（基於 Baileys），包括 QR 碼登入、多帳戶管理、DM 存取控制和群組支援。"
tags:
  - "whatsapp"
  - "渠道設定"
  - "baileys"
  - "qr-login"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 70
---

# WhatsApp 渠道設定完全指南

## 學完你能做什麼

- 透過 QR 碼連結 WhatsApp 帳戶到 Clawdbot
- 設定多帳戶 WhatsApp 支援
- 設定 DM 存取控制（配對/白名單/公開）
- 啟用和管理 WhatsApp 群組支援
- 設定自動訊息確認和已讀回條

## 你現在的困境

WhatsApp 是你最常用的訊息平台，但你的 AI 助手還無法接收到 WhatsApp 訊息。你想要：
- 在 WhatsApp 上直接和 AI 對話，不用切換應用程式
- 控制誰能給你的 AI 傳訊息
- 支援多個 WhatsApp 帳號（工作/個人分離）

## 什麼時候用這一招

- 你需要在 WhatsApp 上接入 AI 助手
- 你需要分離工作/個人 WhatsApp 帳號
- 你想精確控制誰能給 AI 傳訊息

::: info 什麼是 Baileys？

Baileys 是一個 WhatsApp Web 函式庫，讓程式透過 WhatsApp Web 通訊協定收發訊息。Clawdbot 使用 Baileys 連結 WhatsApp，無需使用 WhatsApp Business API，更隱私也更靈活。

:::

## 🎒 開始前的準備

在設定 WhatsApp 渠道前，請確認：

- [ ] 已安裝並啟動 Clawdbot Gateway
- [ ] 已完成[快速開始](../../start/getting-started/)
- [ ] 有一個可用的手機號碼（推薦用備用號碼）
- [ ] WhatsApp 手機能存取網路（用於掃描 QR 碼）

::: warning 注意事項

- **推薦使用獨立號碼**：單獨的 SIM 卡或舊手機，避免干擾個人使用
- **避免虛擬號碼**：TextNow、Google Voice 等虛擬號碼會被 WhatsApp 封鎖
- **Node 執行環境**：WhatsApp 和 Telegram 在 Bun 上不穩定，請使用 Node ≥22

:::

## 核心思路

WhatsApp 渠道的核心架構：

```
你的 WhatsApp 手機 ←--(QR 碼)--> Baileys ←--→ Clawdbot Gateway
                                                       ↓
                                                  AI Agent
                                                       ↓
                                                  回覆訊息
```

**關鍵概念**：

1. **Baileys 會話**：透過 WhatsApp Linked Devices 建立連線
2. **DM 策略**：控制誰能給 AI 傳送私聊訊息
3. **多帳戶支援**：一個 Gateway 管理多個 WhatsApp 帳號
4. **訊息確認**：自動傳送表情/已讀回條，提升使用者體驗

## 跟我做

### 第 1 步：設定基礎設定

**為什麼**
設定 WhatsApp 的存取控制策略，保護你的 AI 助手不被濫用。

編輯 `~/.clawdbot/clawdbot.json`，新增 WhatsApp 設定：

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "allowFrom": ["+15551234567"]
    }
  }
}
```

**欄位說明**：

| 欄位 | 類型 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `dmPolicy` | string | `"pairing"` | DM 存取策略：`pairing`（配對）、`allowlist`（白名單）、`open`（公開）、`disabled`（停用） |
| `allowFrom` | string[] | `[]` | 允許傳送者的電話號碼列表（E.164 格式，如 `+15551234567`） |

**DM 策略對比**：

| 策略 | 行為 | 適用場景 |
|--- | --- | ---|
| `pairing` | 未知傳送者收到配對碼，需要手動批准 | **推薦**，平衡安全和便利性 |
| `allowlist` | 只允許 `allowFrom` 列表中的號碼 | 嚴格控制，已知使用者 |
| `open` | 任何人都可以傳送（需 `allowFrom` 包含 `"*"`） | 公開測試或社群服務 |
| `disabled` | 忽略所有 WhatsApp 訊息 | 暫時停用該渠道 |

**你應該看到**：設定檔儲存成功，沒有 JSON 格式錯誤。

### 第 2 步：登入 WhatsApp

**為什麼**
透過 QR 碼將 WhatsApp 帳戶連結到 Clawdbot，Baileys 會維護會話狀態。

在終端機執行：

```bash
clawdbot channels login whatsapp
```

**多帳戶登入**：

登入特定帳戶：

```bash
clawdbot channels login whatsapp --account work
```

登入預設帳戶：

```bash
clawdbot channels login whatsapp
```

**操作步驟**：

1. 終端機會顯示 QR 碼（或在 CLI 介面顯示）
2. 開啟 WhatsApp 手機應用程式
3. 進入 **Settings → Linked Devices**
4. 點擊 **Link a Device**
5. 掃描終端機顯示的 QR 碼

**你應該看到**：

```
✓ WhatsApp linked successfully!
Credentials stored: ~/.clawdbot/credentials/whatsapp/default/creds.json
```

::: tip 憑證儲存

WhatsApp 登入憑證保存在 `~/.clawdbot/credentials/whatsapp/<accountId>/creds.json`。首次登入後，後續啟動會自動恢復會話，無需重複掃描 QR 碼。

:::

### 第 3 步：啟動 Gateway

**為什麼**
啟動 Gateway 讓 WhatsApp 渠道開始接收和傳送訊息。

```bash
clawdbot gateway
```

或使用守護程式模式：

```bash
clawdbot gateway start
```

**你應該看到**：

```
[WhatsApp] Connected to WhatsApp Web
[WhatsApp] Default account linked: +15551234567
Gateway listening on ws://127.0.0.1:18789
```

### 第 4 步：傳送測試訊息

**為什麼**
驗證 WhatsApp 渠道設定正確，能正常收發訊息。

從你的 WhatsApp 手機向連結的號碼傳送訊息：

```
你好
```

**你應該看到**：
- 終端機顯示收到的訊息日誌
- WhatsApp 收到 AI 回覆

**檢查點 ✅**

- [ ] Gateway 日誌顯示 `[WhatsApp] Received message from +15551234567`
- [ ] WhatsApp 收到 AI 回覆
- [ ] 回覆內容與你的輸入相關

### 第 5 步：設定進階選項（可選）

#### 啟用自動訊息確認

在 `clawdbot.json` 中新增：

```json
{
  "channels": {
    "whatsapp": {
      "ackReaction": {
        "emoji": "👀",
        "direct": true,
        "group": "mentions"
      }
    }
  }
}
```

**欄位說明**：

| 欄位 | 類型 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `emoji` | string | - | 確認表情（如 `"👀"`、`"✅"`），空字串表示停用 |
| `direct` | boolean | `true` | 是否在私聊中傳送確認 |
| `group` | string | `"mentions"` | 群組行為：`"always"`（所有訊息）、`"mentions"`（僅 @ 提及）、`"never"`（從不） |

#### 設定已讀回條

預設情況下，Clawdbot 會自動標記訊息為已讀（藍勾）。要停用：

```json
{
  "channels": {
    "whatsapp": {
      "sendReadReceipts": false
    }
  }
}
```

#### 調整訊息限制

```json
{
  "channels": {
    "whatsapp": {
      "textChunkLimit": 4000,
      "mediaMaxMb": 50,
      "chunkMode": "length"
    }
  }
}
```

| 欄位 | 預設值 | 說明 |
|--- | --- | ---|
| `textChunkLimit` | 4000 | 單條文字訊息最大字元數 |
| `mediaMaxMb` | 50 | 接收的媒體檔案最大大小（MB） |
| `chunkMode` | `"length"` | 分塊模式：`"length"`（按長度）、`"newline"`（按段落） |

**你應該看到**：設定生效後，長訊息自動分塊，媒體檔案大小受控。

## 踩坑提醒

### 問題 1：QR 碼掃描失敗

**症狀**：掃描 QR 碼後，終端機顯示連線失敗或逾時。

**原因**：網路連線問題或 WhatsApp 服務不穩定。

**解決方法**：

1. 檢查手機網路連線
2. 確保 Gateway 伺服器能存取網際網路
3. 登出並重新登入：
   ```bash
   clawdbot channels logout whatsapp
   clawdbot channels login whatsapp
   ```

### 問題 2：訊息未送達或延遲

**症狀**：傳送訊息後，很長時間才收到回覆。

**原因**：Gateway 未執行或 WhatsApp 連線斷開。

**解決方法**：

1. 檢查 Gateway 狀態：`clawdbot gateway status`
2. 重新啟動 Gateway：`clawdbot gateway restart`
3. 查看日誌：`clawdbot logs --follow`

### 問題 3：配對碼未收到

**症狀**：陌生人傳送訊息後，沒有收到配對碼。

**原因**：`dmPolicy` 未設定為 `pairing`。

**解決方法**：

檢查 `clawdbot.json` 中的 `dmPolicy` 設定：

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing"  // ← 確保是 "pairing"
    }
  }
}
```

### 問題 4：Bun 執行環境問題

**症狀**：WhatsApp 和 Telegram 頻繁斷線或登入失敗。

**原因**：Baileys 和 Telegram SDK 在 Bun 上不穩定。

**解決方法**：

使用 Node ≥22 執行 Gateway：

檢查目前執行環境：

```bash
node --version
```

如需切換，使用 Node 執行 Gateway：

```bash
clawdbot gateway --runtime node
```

::: tip 推薦執行環境

WhatsApp 和 Telegram 渠道強烈推薦使用 Node 執行環境，Bun 可能導致連線不穩定。

:::

## 本課小結

WhatsApp 渠道設定要點：

1. **基礎設定**：`dmPolicy` + `allowFrom` 控制存取
2. **登入流程**：`clawdbot channels login whatsapp` 掃描 QR 碼
3. **多帳戶**：使用 `--account` 參數管理多個 WhatsApp 帳號
4. **進階選項**：自動訊息確認、已讀回條、訊息限制
5. **故障排除**：檢查 Gateway 狀態、日誌和執行環境

## 下一課預告

> 下一課我們學習 **[Telegram 渠道](../telegram/)** 設定。
>
> 你會學到：
> - 使用 Bot Token 設定 Telegram Bot
> - 設定指令和內聯查詢
> - 管理 Telegram 特定的安全策略

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| WhatsApp 設定類型定義 | [`src/config/types.whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.whatsapp.ts) | 1-160 |
| WhatsApp 設定 Schema | [`src/config/zod-schema.providers-whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-whatsapp.ts) | 13-100 |
| WhatsApp 引導設定 | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 1-341 |
| WhatsApp 文件 | [`docs/channels/whatsapp.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/whatsapp.md) | 1-363 |
| WhatsApp 登入工具 | [`src/channels/plugins/agent-tools/whatsapp-login.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/agent-tools/whatsapp-login.ts) | 1-72 |
| WhatsApp Actions 工具 | [`src/agents/tools/whatsapp-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/whatsapp-actions.ts) | 1-42 |

**關鍵設定項**：
- `dmPolicy`: DM 存取策略（`pairing`/`allowlist`/`open`/`disabled`）
- `allowFrom`: 允許的傳送者列表（E.164 格式電話號碼）
- `ackReaction`: 自動訊息確認設定（`{emoji, direct, group}`）
- `sendReadReceipts`: 是否傳送已讀回條（預設 `true`）
- `textChunkLimit`: 文字分塊限制（預設 4000 字元）
- `mediaMaxMb`: 媒體檔案大小限制（預設 50 MB）

**關鍵函數**：
- `loginWeb()`: 執行 WhatsApp QR 碼登入
- `startWebLoginWithQr()`: 啟動 QR 碼產生流程
- `sendReactionWhatsApp()`: 傳送 WhatsApp 表情反應
- `handleWhatsAppAction()`: 處理 WhatsApp 特定操作（如反應）

**關鍵常數**：
- `DEFAULT_ACCOUNT_ID`: 預設帳戶 ID（`"default"`）
- `creds.json`: WhatsApp 認證憑證儲存路徑

</details>
