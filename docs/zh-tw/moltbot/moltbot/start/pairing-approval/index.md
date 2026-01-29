---
title: "DM 配對與存取控制：保護你的 AI 助手 | Clawdbot 教程"
sidebarTitle: "管理陌生人存取"
subtitle: "DM 配對與存取控制：保護你的 AI 助手"
description: "了解 Clawdbot 的 DM 配對保護機制，學習如何透過 CLI 批准陌生發送者的配對請求、列出待批准請求和管理允許清單。本教程完整介紹配對流程、CLI 指令使用、存取策略設定和安全最佳實踐，包含常見錯誤排除和 doctor 指令。"
tags:
  - "入門"
  - "安全"
  - "配對"
  - "存取控制"
prerequisite:
  - "start-gateway-startup"
order: 50
---

# DM 配對與存取控制：保護你的 AI 助手

## 學完你能做什麼

完成本教程後，你將能夠：

- ✅ 理解預設的 DM 配對保護機制
- ✅ 批准陌生發送者的配對請求
- ✅ 列出和管理待批准的配對請求
- ✅ 設定不同的 DM 存取策略（pairing/allowlist/open）
- ✅ 執行 doctor 檢查安全設定

## 你現在的困境

你可能剛設定了 WhatsApp 或 Telegram 頻道，希望與 AI 助手對話，但遇到了以下問題：

- "為什麼陌生人給我發訊息，Clawdbot 不回覆？"
- "收到一個配對代碼，不知道是什麼意思"
- "想批准某個人的請求，但不知道用什麼指令"
- "如何確認目前有哪些人在等待批准？"

好消息是：**Clawdbot 預設啟用 DM 配對保護**，這是為了確保只有你授權的發送者才能與 AI 助手對話。

## 什麼時候用這一招

當你需要：

- 🛡 **保護隱私**：確保只有信任的人能與 AI 助手對話
- ✅ **批准陌生人**：允許新的發送者存取你的 AI 助手
- 🔒 **嚴格存取控制**：限制特定使用者的存取權限
- 📋 **批次管理**：查看和管理所有待批准的配對請求

---

## 核心思路

### 什麼是 DM 配對？

Clawdbot 連接到真實的訊息平台（WhatsApp、Telegram、Slack 等），這些平台上的**私聊（DM）預設被視為不受信任的輸入**。

為了保護你的 AI 助手，Clawdbot 提供了**配對機制**：

::: info 配對流程
1. 陌生發送者向你發送訊息
2. Clawdbot 偵測到該發送者未被授權
3. Clawdbot 返回一個**配對代碼**（8 位字元）
4. 發送者需要將配對代碼提供給你
5. 你透過 CLI 批准該代碼
6. 發送者 ID 被新增到允許清單
7. 發送者可以正常與 AI 助手對話
:::

### 預設 DM 策略

**所有頻道預設使用 `dmPolicy="pairing"`**，這表示：

| 策略 | 行為 |
|--- | ---|
| `pairing` | 未知發送者收到配對代碼，訊息不處理（預設） |
| `allowlist` | 只允許 `allowFrom` 清單中的發送者 |
| `open` | 允許所有發送者（需顯式設定 `"*"`） |
| `disabled` | 完全停用 DM 功能 |

::: warning 安全提醒
預設的 `pairing` 模式是最安全的選擇。除非你有特殊需求，否則不要修改為 `open` 模式。
:::

---

## 🎒 開始前的準備

確保你已經：

- [x] 完成了 [快速開始](../getting-started/) 教程
- [x] 完成了 [啟動 Gateway](../gateway-startup/) 教程
- [x] 設定了至少一個訊息頻道（WhatsApp、Telegram、Slack 等）
- [x] Gateway 正在執行

---

## 跟我做

### 第 1 步：理解配對代碼的來源

當一個陌生發送者向你的 Clawdbot 發送訊息時，他們會收到類似以下的回覆：

```
Clawdbot: access not configured.

Telegram ID: 123456789

Pairing code: AB3D7X9K

Ask the bot owner to approve with:
clawdbot pairing approve telegram <code>
```

**配對代碼的關鍵特性**（來源：`src/pairing/pairing-store.ts`）：

- **8 位字元**：便於輸入和記憶
- **大寫字母和數字**：避免混淆
- **排除易混淆字元**：不包含 0、O、1、I
- **1 小時有效期**：超過時間會自動失效
- **最多保留 3 個待批准請求**：超過後會自動清理最舊的請求

### 第 2 步：列出待批准的配對請求

在終端機中執行以下指令：

```bash
clawdbot pairing list telegram
```

**你應該看到**：

```
Pairing requests (1)

┌──────────────────┬────────────────┬────────┬──────────────────────┐
│ Code            │ ID            │ Meta   │ Requested            │
├──────────────────┼────────────────┼────────┼──────────────────────┤
│ AB3D7X9K        │ 123456789      │        │ 2026-01-27T10:30:00Z │
└──────────────────┴────────────────┴────────┴──────────────────────┘
```

如果沒有待批准的請求，你會看到：

```
No pending telegram pairing requests.
```

::: tip 支援的頻道
配對功能支援以下頻道：
- telegram
- whatsapp
- slack
- discord
- signal
- imessage
- msteams
- googlechat
- bluebubbles
:::

### 第 3 步：批准配對請求

使用發送者提供的配對代碼批准存取：

```bash
clawdbot pairing approve telegram AB3D7X9K
```

**你應該看到**：

```
✅ Approved telegram sender 123456789
```

::: info 批准後的效果
批准後，發送者 ID（123456789）會被自動新增到該頻道的允許清單中，儲存在：
`~/.clawdbot/credentials/telegram-allowFrom.json`
:::

### 第 4 步：通知發送者（可選）

如果你想自動通知發送者，可以使用 `--notify` 標誌：

```bash
clawdbot pairing approve telegram AB3D7X9K --notify
```

發送者會收到以下訊息（來源：`src/channels/plugins/pairing-message.ts`）：

```
✅ Clawdbot access approved. Send a message to start chatting.
```

**注意**：`--notify` 標誌要求 Clawdbot Gateway 正在執行，並且該頻道處於活躍狀態。

### 第 5 步：驗證發送者可以正常對話

讓發送者再次發送一條訊息，AI 助手應該會正常回覆。

---

## 檢查點 ✅

完成以下檢查確認設定正確：

- [ ] 執行 `clawdbot pairing list <channel>` 能看到待批准的請求
- [ ] 使用 `clawdbot pairing approve <channel> <code>` 能成功批准
- [ ] 批准後的發送者能正常與 AI 助手對話
- [ ] 配對代碼會在 1 小時後自動過期（可以透過再次發送訊息驗證）

---

## 踩坑提醒

### 錯誤 1：找不到配對代碼

**錯誤訊息**：
```
No pending pairing request found for code: AB3D7X9K
```

**可能原因**：
- 配對代碼已經過期（超過 1 小時）
- 配對代碼輸入錯誤（檢查大小寫）
- 發送者沒有實際發送訊息（配對代碼只有在收到訊息時才會產生）

**解決方法**：
- 讓發送者再次發送一條訊息，產生新的配對代碼
- 確保配對代碼正確複製（注意大小寫）

### 錯誤 2：頻道不支援配對

**錯誤訊息**：
```
Channel xxx does not support pairing
```

**可能原因**：
- 頻道名稱拼字錯誤
- 該頻道不支援配對功能

**解決方法**：
- 執行 `clawdbot pairing list` 查看支援的頻道清單
- 使用正確的頻道名稱

### 錯誤 3：通知失敗

**錯誤訊息**：
```
Failed to notify requester: <error details>
```

**可能原因**：
- Gateway 未執行
- 頻道連線斷開
- 網路問題

**解決方法**：
- 確認 Gateway 正在執行
- 檢查頻道連線狀態：`clawdbot channels status`
- 不使用 `--notify` 標誌，手動通知發送者

---

## 本課小結

本教程介紹了 Clawdbot 的 DM 配對保護機制：

- **預設安全**：所有頻道預設使用 `pairing` 模式，保護你的 AI 助手
- **配對流程**：陌生發送者收到 8 位配對代碼，你需要透過 CLI 批准
- **管理指令**：
  - `clawdbot pairing list <channel>`：列出待批准請求
  - `clawdbot pairing approve <channel> <code>`：批准配對
- **儲存位置**：允許清單儲存在 `~/.clawdbot/credentials/<channel>-allowFrom.json`
- **自動過期**：配對請求 1 小時後自動失效

記住：**配對機制是 Clawdbot 的安全基石**，確保只有你授權的人能與 AI 助手對話。

---

## 下一課預告

> 下一課我們將學習 **[疑難排解：解決常見問題](../../faq/troubleshooting/)**。
>
> 你會學到：
> - 快速診斷和系統狀態檢查
> - 解決 Gateway 啟動、頻道連線、認證錯誤等問題
> - 工具呼叫失敗和效能優化的排除方法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 配對代碼產生（8 位，排除易混淆字元） | [`src/pairing/pairing-store.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-store.ts#L173-L181) | 173-181 |
| 配對請求儲存與 TTL（1 小時） | [`src/pairing/pairing-store.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-store.ts#L11-L14) | 11-14 |
| 批准配對指令 | [`src/cli/pairing-cli.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/pairing-cli.ts#L107-L143) | 107-143 |
| 配對代碼訊息產生 | [`src/pairing/pairing-messages.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-messages.ts#L4-L20) | 4-20 |
| 允許清單儲存 | [`src/pairing/pairing-store.ts`](https://github.com/moltbot/moltbot/blob/main/src/pairing/pairing-store.ts#L457-L461) | 457-461 |
| 支援 `pairing` 的頻道清單 | [`src/channels/plugins/pairing.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/pairing.ts#L11-L16) | 11-16 |
| 預設 DM 策略（pairing） | [`src/config/zod-schema.providers-core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.providers-core.ts#L93) | 93 |

**關鍵常數**：
- `PAIRING_CODE_LENGTH = 8`：配對代碼長度
- `PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"`：配對代碼字元集（排除 0O1I）
- `PAIRING_PENDING_TTL_MS = 60 * 60 * 1000`：配對請求有效期（1 小時）
- `PAIRING_PENDING_MAX = 3`：最大待批准請求數

**關鍵函數**：
- `approveChannelPairingCode()`：批准配對代碼並新增到允許清單
- `listChannelPairingRequests()`：列出待批准的配對請求
- `upsertChannelPairingRequest()`：建立或更新配對請求
- `addChannelAllowFromStoreEntry()`：新增發送者到允許清單

</details>
