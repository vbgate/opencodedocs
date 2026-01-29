---
title: "快速開始：安裝並啟動 Clawdbot | 教學"
sidebarTitle: "5 分鐘跑起來"
subtitle: "快速開始：安裝、設定和啟動 Clawdbot"
description: "學習如何安裝 Clawdbot，設定 AI 模型，啟動 Gateway，並透過 WhatsApp/Telegram/Slack 等管道發送第一則訊息。"
tags:
  - "入門"
  - "安裝"
  - "設定"
  - "Gateway"
prerequisite: []
order: 10
---

# 快速開始：安裝、設定和啟動 Clawdbot

## 學完你能做什麼

完成本教學後，你將能夠：

- ✅ 在你的裝置上安裝 Clawdbot
- ✅ 設定 AI 模型驗證（Anthropic / OpenAI / 其他提供商）
- ✅ 啟動 Gateway 背景程式
- ✅ 透過 WebChat 或設定的管道發送第一則訊息

## 你現在的困境

你可能正在想：

- "本地 AI 助理聽起來很複雜，從哪裡開始？"
- "我有很多裝置（手機、電腦），怎麼統一管理？"
- "我熟悉 WhatsApp/Telegram/Slack，能不能用這些和 AI 對話？"

好消息是：**Clawdbot 就是為了解決這些問題而設計的**。

## 什麼時候用這一招

當你需要：

- 🚀 **首次設定**個人 AI 助理
- 🔧 **設定多管道**（WhatsApp、Telegram、Slack、Discord 等）
- 🤖 **連接 AI 模型**（Anthropic Claude、OpenAI GPT 等）
- 📱 **跨裝置協同**（macOS、iOS、Android 節點）

::: tip 為什麼推薦 Gateway 模式？
Gateway 是 Clawdbot 的控制平面，它：
- 統一管理所有工作階段、管道、工具和事件
- 支援多用戶端並行連線
- 允許裝置節點執行本地操作
:::

## 🎒 開始前的準備

### 系統要求

| 元件           | 要求                          |
| -------------- | ----------------------------- |
| **Node.js**    | ≥ 22.12.0                     |
| **作業系統**   | macOS / Linux / Windows (WSL2) |
| **套件管理器** | npm / pnpm / bun              |

::: warning Windows 使用者請注意
Windows 上強烈推薦使用 **WSL2**，因為：
- 許多管道依賴本地二進位檔案
- 背景程式（launchd/systemd）在 Windows 上不可用
:::

### 推薦的 AI 模型

雖然任何模型都支援，但我們強烈推薦：

| 提供商     | 推薦模型          | 理由                               |
| ---------- | ----------------- | ---------------------------------- |
| Anthropic  | Claude Opus 4.5   | 長上下文優勢、更強的提示注入抵抗力 |
| OpenAI     | GPT-5.2 + Codex   | 程式設計能力強、多模態支援         |

---

## 核心思路

Clawdbot 的架構很簡單：**一個 Gateway，多個管道，一個 AI 助理**。

```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat
                │
                ▼
        ┌──────────────────┐
        │   Gateway        │  ← 控制平面（背景程式）
        │   127.0.0.1:18789 │
        └────────┬─────────┘
                 │
                 ├─→ AI Agent (pi-mono RPC)
                 ├─→ CLI (clawdbot ...)
                 ├─→ WebChat UI
                 └─→ macOS / iOS / Android 節點
```

**關鍵概念**：

| 概念        | 作用                                    |
| ----------- | --------------------------------------- |
| **Gateway** | 背景程式，負責工作階段管理、管道連線、工具呼叫 |
| **Channel** | 訊息管道（WhatsApp、Telegram、Slack 等） |
| **Agent**   | AI 執行階段（基於 pi-mono 的 RPC 模式）  |
| **Node**    | 裝置節點（macOS/iOS/Android），執行裝置本地操作 |

---

## 跟我做

### 第 1 步：安裝 Clawdbot

**為什麼**
全域安裝後，`clawdbot` 命令可以在任何地方使用。

#### 方式 A：使用 npm（推薦）

```bash
npm install -g clawdbot@latest
```

#### 方式 B：使用 pnpm

```bash
pnpm add -g clawdbot@latest
```

#### 方式 C：使用 bun

```bash
bun install -g clawdbot@latest
```

**你應該看到**：
```
added 1 package, and audited 1 package in 3s
```

::: tip 開發者選項
如果你打算從原始碼開發或貢獻，請跳到 [附錄：從原始碼建置](#從原始碼建置)。
:::

---

### 第 2 步：執行 onboarding 精靈

**為什麼**
精靈會引導你完成所有必要的設定：Gateway、管道、技能。

#### 啟動精靈（推薦）

```bash
clawdbot onboard --install-daemon
```

**精靈會問你什麼**：

| 步驟 | 問題                                | 說明                  |
| ---- | ----------------------------------- | --------------------- |
| 1    | 選擇 AI 模型驗證方式                | OAuth / API Key       |
| 2    | 設定 Gateway（連接埠、驗證）        | 預設：127.0.0.1:18789 |
| 3    | 設定管道（WhatsApp、Telegram 等）   | 可跳過，稍後設定      |
| 4    | 設定技能（選用）                    | 可跳過                |

**你應該看到**：
```
✓ Gateway configured
✓ Workspace initialized: ~/clawd
✓ Channels configured
✓ Skills installed

To start the gateway, run:
  clawdbot gateway
```

::: info 什麼是 Daemon？
`--install-daemon` 會安裝 Gateway 背景程式：
- **macOS**: launchd 服務（使用者層級）
- **Linux**: systemd 使用者服務

這樣 Gateway 會在背景自動執行，無需手動啟動。
:::

---

### 第 3 步：啟動 Gateway

**為什麼**
Gateway 是 Clawdbot 的控制平面，必須先啟動它。

#### 前景啟動（除錯用）

```bash
clawdbot gateway --port 18789 --verbose
```

**你應該看到**：
```
[clawdbot] Gateway started
[clawdbot] Listening on ws://127.0.0.1:18789
[clawdbot] Ready to accept connections
```

#### 背景啟動（推薦）

如果你在精靈中使用了 `--install-daemon`，Gateway 會自動啟動。

檢查狀態：

```bash
clawdbot gateway status
```

**你應該看到**：
```
Gateway is running
PID: 12345
Port: 18789
```

::: tip 常用選項
- `--port 18789`：指定 Gateway 連接埠（預設 18789）
- `--verbose`：啟用詳細記錄檔（除錯時有用）
- `--reset`：重新啟動 Gateway（清除工作階段）
:::

---

### 第 4 步：發送第一則訊息

**為什麼**
驗證安裝是否成功，體驗 AI 助理的回應。

#### 方式 A：使用 CLI 直接對話

```bash
clawdbot agent --message "Ship checklist" --thinking high
```

**你應該看到**：
```
[clawdbot] Agent is thinking...
[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

#### 方式 B：透過管道發送訊息

如果你在精靈中設定了管道（如 WhatsApp、Telegram），可以在對應的 APP 中直接發送訊息給你的 AI 助理。

**WhatsApp 範例**：

1. 開啟 WhatsApp
2. 搜尋你的 Clawdbot 號碼
3. 發送訊息：`Hello, I'm testing Clawdbot!`

**你應該看到**：
- AI 助理回覆你的訊息

::: info DM 配對保護
預設情況下，Clawdbot 啟用 **DM 配對保護**：
- 未知發送者會收到一個配對代碼
- 訊息不會被處理，直到你核准配對

更多詳情：[DM 配對與存取控制](../pairing-approval/)
:::

---

## 檢查點 ✅

完成上述步驟後，你應該能夠：

- [ ] 執行 `clawdbot --version` 看到版本號
- [ ] 執行 `clawdbot gateway status` 看到 Gateway 在執行
- [ ] 透過 CLI 發送訊息並收到 AI 回覆
- [ ] （選用）在設定的管道中發送訊息並收到 AI 回覆

::: tip 常見問題
**Q: Gateway 啟動失敗？**
A: 檢查連接埠是否被占用：
```bash
lsof -i :18789  # macOS/Linux
netstat -ano | findstr :18789  # Windows
```

**Q: AI 不回覆？**
A: 檢查 API Key 是否正確設定：
```bash
clawdbot models list
```

**Q: 如何檢視詳細記錄檔？**
A: 啟動時新增 `--verbose`：
```bash
clawdbot gateway --verbose
```
:::

---

## 踩坑提醒

### ❌ 忘記安裝 Daemon

**錯誤做法**：
```bash
clawdbot onboard  # 忘記 --install-daemon
```

**正確做法**：
```bash
clawdbot onboard --install-daemon
```

::: warning 前景 vs 背景
- 前景：適合除錯，關閉終端機會停止 Gateway
- 背景：適合生產環境，會自動重新啟動
:::

### ❌ Node.js 版本過低

**錯誤做法**：
```bash
node --version
# v20.x.x  # 太舊
```

**正確做法**：
```bash
node --version
# v22.12.0 或更高
```

### ❌ 設定檔案路徑錯誤

Clawdbot 預設設定檔位置：

| 作業系統       | 設定路徑                    |
| -------------- | --------------------------- |
| macOS/Linux    | `~/.clawdbot/clawdbot.json` |
| Windows (WSL2) | `~/.clawdbot/clawdbot.json` |

如果你手動編輯設定檔，確保路徑正確。

---

## 本課小結

本課你學會了：

1. ✅ **安裝 Clawdbot**：使用 npm/pnpm/bun 全域安裝
2. ✅ **執行精靈**：`clawdbot onboard --install-daemon` 完成設定
3. ✅ **啟動 Gateway**：`clawdbot gateway` 或背景程式自動啟動
4. ✅ **發送訊息**：透過 CLI 或設定的管道與 AI 對話

**下一步**：

- 學習 [精靈式設定](../onboarding-wizard/)，了解更多精靈的各個選項
- 了解 [啟動 Gateway](../gateway-startup/)，學習不同的啟動模式（dev/production）
- 學習 [發送第一則訊息](../first-message/)，探索更多訊息格式和互動方式

---

## 下一課預告

> 下一課我們學習 **[精靈式設定](../onboarding-wizard/)**。
>
> 你會學到：
> - 如何使用互動式精靈設定 Gateway
> - 如何設定多管道（WhatsApp、Telegram、Slack 等）
> - 如何管理技能和 AI 模型驗證

---

## 附錄：從原始碼建置

如果你打算從原始碼開發或貢獻，可以：

### 1. 複製儲存庫

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

### 2. 安裝相依性

```bash
pnpm install
```

### 3. 建置 UI（首次執行）

```bash
pnpm ui:build  # 自動安裝 UI 相依性
```

### 4. 建置 TypeScript

```bash
pnpm build
```

### 5. 執行 onboarding

```bash
pnpm clawdbot onboard --install-daemon
```

### 6. 開發循環（自動重新載入）

```bash
pnpm gateway:watch  # TS 檔案改動時自動重新載入
```

::: info 開發模式 vs 生產模式
- `pnpm clawdbot ...`：直接執行 TypeScript（開發模式）
- `pnpm build` 後：產生 `dist/` 目錄（生產模式）
:::

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能             | 檔案路徑                                                                                     | 行號    |
| ---------------- | -------------------------------------------------------------------------------------------- | ------- |
| CLI 入口         | [`src/cli/run-main.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/run-main.ts) | 26-60   |
| Onboarding 命令  | [`src/cli/program/register.onboard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.onboard.ts) | 34-100  |
| Daemon 安裝      | [`src/cli/daemon-cli/install.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/daemon-cli/install.ts) | 15-100  |
| Gateway 服務     | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | 全檔案  |
| 執行階段檢查     | [`src/infra/runtime-guard.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/runtime-guard.ts) | 全檔案  |

**關鍵常數**：
- `DEFAULT_GATEWAY_DAEMON_RUNTIME = "node"`：預設背景程式執行階段（來自 `src/commands/daemon-runtime.ts`）
- `DEFAULT_GATEWAY_PORT = 18789`：預設 Gateway 連接埠（來自設定）

**關鍵函式**：
- `runCli()`：CLI 主入口，處理參數解析和命令路由（`src/cli/run-main.ts`）
- `runDaemonInstall()`：安裝 Gateway 背景程式（`src/cli/daemon-cli/install.ts`）
- `onboardCommand()`：互動式精靈命令（`src/commands/onboard.ts`）

</details>
