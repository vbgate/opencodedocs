---
title: "精靈式配置：一站式配置 Clawdbot | Clawdbot 教學"
sidebarTitle: "一鍵配置完成"
subtitle: "精靈式配置：一站式配置 Clawdbot"
description: "學習使用互動式精靈完成 Clawdbot 的完整配置，包括 Gateway 網路設定、AI 模型認證（支援 setup-token 和 API Key）、通訊渠道（WhatsApp、Telegram、Slack 等）和技能系統的初始化。"
tags:
  - "入門"
  - "配置"
  - "精靈"
  - "Gateway"
prerequisite:
  - "getting-started"
order: 20
---

# 精靈式配置：一站式配置 Clawdbot

## 學完你能做什麼

透過本教學，你將：

- ✅ 使用互動式精靈完成 Clawdbot 完整配置
- ✅ 理解 QuickStart 和 Manual 兩種模式的區別
- ✅ 配置 Gateway 網路和認證選項
- ✅ 設定 AI 模型提供商（setup-token 和 API Key）
- ✅ 啟用通訊渠道（WhatsApp、Telegram 等）
- ✅ 安裝和管理技能包

完成精靈後，Clawdbot Gateway 將在背景執行，你可以透過已配置的渠道與 AI 助手對話。

## 你現在的困境

手動編輯設定檔案很麻煩：

- 不知道配置項的含義和預設值
- 容易遺漏關鍵設定導致無法啟動
- AI 模型認證方式多樣（OAuth、API Key）不知道怎麼選
- 渠道配置複雜，每個平台的認證方式不同
- 技能系統不知道該安裝哪些

精靈式配置解決了這些問題，它透過互動式問題引導你完成所有配置，並提供合理的預設值。

## 什麼時候用這一招

- **首次安裝**：新使用者第一次使用 Clawdbot
- **重新配置**：需要修改 Gateway 設定、切換 AI 模型或添加新渠道
- **快速驗證**：想快速體驗基本功能，不想深入研究設定檔案
- **故障排查**：配置出錯後，使用精靈重新初始化

::: tip 提示
精靈會偵測現有配置，可以選擇保留、修改或重置配置。
:::

## 核心思路

### 兩種模式

精靈提供兩種配置模式：

**QuickStart 模式**（推薦新手）
- 使用安全預設值：Gateway 綁定到 loopback（127.0.0.1），通訊埠 18789，token 認證
- 跳過大部分詳細配置項
- 適合單機使用，快速上手

**Manual 模式**（適合進階使用者）
- 手動配置所有選項
- 支援 LAN 綁定、Tailscale 遠端存取、自訂認證方式
- 適合多機部署、遠端存取或特殊網路環境

### 配置流程

```
1. 安全警告確認
2. 模式選擇（QuickStart / Manual）
3. Gateway 配置（通訊埠、綁定、認證、Tailscale）
4. AI 模型認證（setup-token / API Key）
5. 工作區設定（預設 ~/clawd）
6. 渠道配置（WhatsApp / Telegram / Slack 等）
7. 技能安裝（可選）
8. 完成（啟動 Gateway）
```

### 安全提醒

精靈開始時會顯示安全警告，你需要確認以下內容：

- Clawdbot 是業餘專案，仍在 beta 階段
- 工具啟用後，AI 可以讀取檔案和執行操作
- 惡意提示詞可能誘導 AI 做不安全的操作
- 建議使用配對/白名單 + 最小權限工具
- 定期執行安全稽核

::: danger 重要
如果你不理解基本安全和存取控制機制，請勿啟用工具或將 Gateway 暴露到網際網路。建議請有經驗的人協助配置後再使用。
:::

---

## 🎒 開始前的準備

在執行精靈前，請確認：

- **已安裝 Clawdbot**：參考[快速開始](../getting-started/)完成安裝
- **Node.js 版本**：確保 Node.js ≥ 22（使用 `node -v` 檢查）
- **AI 模型帳號**（推薦）：
  - Anthropic Claude 帳號（Pro/Max 訂閱），支援 OAuth 流程
  - 或準備好 OpenAI/DeepSeek 等提供商的 API Key
- **渠道帳號**（可選）：如需使用 WhatsApp、Telegram 等，先註冊相應帳號
- **網路權限**：如需使用 Tailscale，確保已安裝 Tailscale 用戶端

---

## 跟我做

### 第 1 步：啟動精靈

開啟終端機，執行以下指令：

```bash
clawdbot onboard
```

**為什麼**
啟動互動式配置精靈，引導你完成所有必要設定。

**你應該看到**：
```
  ┌─────────────────────────────────────────────────────┐
  │                                                   │
  │   Clawdbot onboarding                              │
  │                                                   │
  └─────────────────────────────────────────────────────┘
```

### 第 2 步：確認安全警告

精靈首先顯示安全警告（如上節「核心思路」所述）。

**為什麼**
確保使用者了解潛在風險，避免誤用導致安全問題。

**操作**：
- 閱讀安全警告內容
- 輸入 `y` 或選擇 `Yes` 確認理解風險
- 如果不接受風險，精靈會退出

**你應該看到**：
```
Security warning — please read.

Clawdbot is a hobby project and still in beta. Expect sharp edges.
...

I understand this is powerful and inherently risky. Continue? (y/N)
```

### 第 3 步：選擇配置模式

::: code-group

```bash [QuickStart 模式]
推薦新手使用，使用安全預設值：
- Gateway 通訊埠：18789
- 綁定位址：Loopback (127.0.0.1)
- 認證方式：Token（自動生成）
- Tailscale：關閉
```

```bash [Manual 模式]
適合進階使用者，手動配置所有選項：
- 自訂 Gateway 通訊埠和綁定
- 選擇 Token 或 Password 認證
- 配置 Tailscale Serve/Funnel 遠端存取
- 詳細配置每個步驟
```

:::

**為什麼**
QuickStart 模式讓新手快速上手，Manual 模式讓進階使用者精確控制。

**操作**：
- 使用方向鍵選擇 `QuickStart` 或 `Manual`
- 按 Enter 確認

**你應該看到**：
```
? Onboarding mode
  QuickStart         Configure details later via clawdbot configure.
  Manual            Configure port, network, Tailscale, and auth options.
```

### 第 4 步：選擇部署模式（僅 Manual 模式）

如果選擇 Manual 模式，精靈會詢問 Gateway 部署位置：

::: code-group

```bash [Local gateway (this machine)]
Gateway 執行在當前機器上：
- 可以執行 OAuth 流程並寫入本機憑證
- 精靈會完成所有配置
- 適合本機開發或單機部署
```

```bash [Remote gateway (info-only)]
Gateway 執行在另一台機器上：
- 精靈僅配置遠端 URL 和認證
- 不執行 OAuth 流程，需在遠端主機手動設定憑證
- 適合多機部署場景
```

:::

**為什麼**
Local 模式支援完整的配置流程，Remote 模式僅配置存取資訊。

**操作**：
- 選擇部署模式
- 如果是 Remote 模式，輸入遠端 Gateway 的 URL 和 token

### 第 5 步：配置 Gateway（僅 Manual 模式）

如果選擇 Manual 模式，精靈會逐項詢問 Gateway 配置：

#### Gateway 通訊埠

```bash
? Gateway port (18789)
```

**說明**：
- 預設值 18789
- 如果通訊埠被佔用，輸入其他通訊埠
- 確保通訊埠未被防火牆阻止

#### Gateway 綁定位址

```bash
? Gateway bind
  Loopback (127.0.0.1)
  LAN (0.0.0.0)
  Tailnet (Tailscale IP)
  Auto (Loopback → LAN)
  Custom IP
```

**選項說明**：
- **Loopback**：僅本機存取，最安全
- **LAN**：區域網路內裝置可存取
- **Tailnet**：透過 Tailscale 虛擬網路存取
- **Auto**：先嘗試 loopback，失敗後切換到 LAN
- **Custom IP**：手動指定 IP 位址

::: tip 提示
推薦使用 Loopback 或 Tailnet，避免直接暴露到區域網路。
:::

#### Gateway 認證方式

```bash
? Gateway auth
  Token              Recommended default (local + remote)
  Password
```

**選項說明**：
- **Token**：推薦選項，自動生成隨機 token，支援遠端存取
- **Password**：使用自訂密碼，Tailscale Funnel 模式必需

#### Tailscale 遠端存取（可選）

```bash
? Tailscale exposure
  Off               No Tailscale exposure
  Serve             Private HTTPS for your tailnet (devices on Tailscale)
  Funnel            Public HTTPS via Tailscale Funnel (internet)
```

::: warning Tailscale 警告
- Serve 模式：僅 Tailscale 網路內裝置可存取
- Funnel 模式：透過公網 HTTPS 暴露（需密碼認證）
- 確保 Tailscale 用戶端已安裝：https://tailscale.com/download/mac
:::

### 第 6 步：設定工作區

精靈會詢問工作區目錄：

```bash
? Workspace directory (~/clawd)
```

**說明**：
- 預設值 `~/clawd`（即 `/Users/你的使用者名稱/clawd`）
- 工作區儲存會話歷史、代理配置、技能等資料
- 可以使用絕對路徑或相對路徑

::: info 多配置檔案（Profile）支援
透過設定 `CLAWDBOT_PROFILE` 環境變數，可以為不同工作環境使用獨立配置：

| Profile 值 | 工作區路徑 | 設定檔 |
|----------|----------|----------|
| `default` 或未設定 | `~/clawd` | `~/.clawdbot/clawdbot.json` |
| `work` | `~/clawd-work` | `~/.clawdbot/clawdbot.json` (work profile) |
| `dev` | `~/clawd-dev` | `~/.clawdbot/clawdbot.json` (dev profile) |

範例：
```bash
# 使用 work profile
export CLAWDBOT_PROFILE=work
clawdbot onboard
```
:::

**你應該看到**：
```
Ensuring workspace directory: /Users/你的使用者名稱/clawd
Creating sessions.json...
Creating agents directory...
```

### 第 7 步：配置 AI 模型認證

精靈會列出支援的 AI 模型提供商：

```bash
? Choose AI model provider
  Anthropic                    Claude Code CLI + API key
  OpenAI                       Codex OAuth + API key
  MiniMax                      M2.1 (recommended)
  Qwen                         OAuth
  Venice AI                     Privacy-focused (uncensored models)
  Google                       Gemini API key + OAuth
  Copilot                      GitHub + local proxy
  Vercel AI Gateway            API key
  Moonshot AI                  Kimi K2 + Kimi Code
  Z.AI (GLM 4.7)            API key
  OpenCode Zen                 API key
  OpenRouter                   API key
  Custom API Endpoint
  Skip for now
```

選擇提供商後，精靈會根據提供商類型顯示具體的認證方式。以下是主要提供商的認證選項：

**Anthropic** 認證方式：
- `claude-cli`：使用現有的 Claude Code CLI OAuth 認證（需 Keychain 存取）
- `token`：貼上透過 `claude setup-token` 生成的 setup-token
- `apiKey`：手動輸入 Anthropic API Key

::: info Anthropic setup-token 方式（推薦）
推薦使用 setup-token 方式，原因：
- 無需手動管理 API Key
- 生成長期有效的 token
- 適合個人 Pro/Max 訂閱使用者

流程：
1. 先在另一個終端機執行：`claude setup-token`
2. 此指令會開啟瀏覽器進行 OAuth 授權
3. 複製生成的 setup-token
4. 在精靈中選擇 `Anthropic` → `token`
5. 貼上 setup-token 到精靈中
6. 憑證自動儲存到 `~/.clawdbot/credentials/` 目錄
:::

::: info API Key 方式
如果選擇 API Key：
- 精靈會提示輸入 API Key
- 憑證儲存到 `~/.clawdbot/credentials/` 目錄
- 支援多個提供商，可隨時切換

範例：
```bash
? Enter API Key
sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
:::

### 第 8 步：選擇預設模型

認證成功後，精靈會顯示可用模型列表：

```bash
? Select default model
  anthropic/claude-sonnet-4-5      Anthropic Sonnet 4.5 (200k ctx)
  anthropic/claude-opus-4-5          Anthropic Opus 4.5 (200k ctx)
  openai/gpt-4-turbo                OpenAI GPT-4 Turbo
  deepseek/DeepSeek-V3                DeepSeek V3
  (Keep current selection)
```

**建議**：
- 推薦使用 **Claude Sonnet 4.5** 或 **Opus 4.5**（200k 上下文，更強安全性）
- 如果預算有限，可選擇 Mini 版本
- 點擊 `Keep current selection` 保留現有配置

### 第 9 步：配置通訊渠道

精靈會列出所有可用的通訊渠道外掛：

```bash
? Select channels to enable
  ✓ whatsapp       WhatsApp (Baileys Web Client)
  ✓ telegram       Telegram (Bot Token)
  ✓ slack          Slack (Bot Token + App Token)
  ✓ discord        Discord (Bot Token)
  ✓ googlechat     Google Chat (OAuth)
  (Press Space to select, Enter to confirm)
```

**操作**：
- 使用方向鍵導航
- 按 **空白鍵** 切換選中狀態
- 按 **Enter** 確認選擇

::: tip QuickStart 模式優化
QuickStart 模式下，精靈會自動選中支援快速啟用的渠道（如 WebChat），並跳過 DM 策略配置，使用安全的預設值（pairing 模式）。
:::

選中渠道後，精靈會逐個詢問每個渠道的配置：

#### WhatsApp 配置

```bash
? Configure WhatsApp
  Link new account     Open QR code in browser
  Skip
```

**操作**：
- 選擇 `Link new account`
- 精靈會顯示 QR Code
- 使用 WhatsApp 掃描 QR Code 登入
- 登入成功後，會話資料儲存到 `~/.clawdbot/credentials/`

#### Telegram 配置

```bash
? Configure Telegram
  Bot Token
  Skip
```

**操作**：
- 選擇 `Bot Token`
- 輸入從 @BotFather 獲取的 Bot Token
- 精靈會測試連線是否成功

::: tip Bot Token 取得
1. 在 Telegram 中搜尋 @BotFather
2. 傳送 `/newbot` 建立新 bot
3. 按提示設定 bot 名稱和使用者名稱
4. 複製生成的 Bot Token
:::

#### Slack 配置

```bash
? Configure Slack
  App Token         xapp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Bot Token         xoxb-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Signing Secret   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Skip
```

**說明**：
Slack 需要三個憑證，從 Slack App 設定取得：
- **App Token**：Workspace level token
- **Bot Token**：Bot user OAuth token
- **Signing Secret**：用於驗證請求簽名

::: tip Slack App 建立
1. 訪問 https://api.slack.com/apps
2. 建立新 App
3. 在 Basic Information 頁面取得 Signing Secret
4. 在 OAuth & Permissions 頁面安裝 App 到 Workspace
5. 取得 Bot Token 和 App Token
:::

### 第 10 步：配置技能（可選）

精靈會提示是否安裝技能：

```bash
? Install skills? (Y/n)
```

**推薦**：
- 選擇 `Y` 安裝推薦技能（如 bird 套件管理器、sherpa-onnx-tts 本地 TTS）
- 選擇 `n` 跳過，後續可透過 `clawdbot skills` 指令管理

如果選擇安裝，精靈會列出可用技能：

```bash
? Select skills to install
  ✓ bird           macOS Homebrew 套件安裝
  ✓ sherpa-onnx-tts  本地 TTS 引擎（隱私優先）
  (Press Space to select, Enter to confirm)
```

### 第 11 步：完成配置

精靈會總結所有配置並寫入設定檔：

```bash
✓ Writing config to ~/.clawdbot/clawdbot.json
✓ Workspace initialized at ~/clawd
✓ Channels configured: whatsapp, telegram, slack
✓ Skills installed: bird, sherpa-onnx-tts

────────────────────────────────────────────────────

Configuration complete!

Next steps:
  1. Start Gateway:
     clawdbot gateway --daemon

  2. Test connection:
     clawdbot message send --to +1234567890 --message "Hello!"

  3. Manage configuration:
     clawdbot configure

Docs: https://docs.clawd.bot/start/onboarding
────────────────────────────────────────────────────
```

## 檢查點 ✅

完成精靈後，請確認以下內容：

- [ ] 設定檔已建立：`~/.clawdbot/clawdbot.json`
- [ ] 工作區已初始化：`~/clawd/` 目錄存在
- [ ] AI 模型憑證已儲存：檢查 `~/.clawdbot/credentials/`
- [ ] 渠道已配置：查看 `clawdbot.json` 中的 `channels` 節點
- [ ] 技能已安裝（如果選擇）：查看 `clawdbot.json` 中的 `skills` 節點

**驗證指令**：

```bash
## 查看配置摘要
```bash
clawdbot doctor
```

## 查看 Gateway 狀態
```bash
clawdbot gateway status
```

## 查看可用渠道
```bash
clawdbot channels list
```
```

## 踩坑提醒

### 常見錯誤 1：通訊埠被佔用

**錯誤資訊**：
```
Error: Port 18789 is already in use
```

**解決方法**：
1. 尋找佔用程序：`lsof -i :18789`（macOS/Linux）或 `netstat -ano | findstr 18789`（Windows）
2. 停止衝突程序或使用其他通訊埠

### 常見錯誤 2：OAuth 流程失敗

**錯誤資訊**：
```
Error: OAuth exchange failed
```

**可能原因**：
- 網路問題導致無法存取 Anthropic 伺服器
- OAuth code 過期或格式錯誤
- 瀏覽器被攔截導致無法開啟

**解決方法**：
1. 檢查網路連線
2. 重新執行 `clawdbot onboard` 重試 OAuth
3. 或改用 API Key 方式

### 常見錯誤 3：渠道配置失敗

**錯誤資訊**：
```
Error: WhatsApp authentication failed
```

**可能原因**：
- QR Code 過期
- 帳號被 WhatsApp 限制
- 相依套件未安裝（如 signal-cli）

**解決方法**：
1. WhatsApp：重新掃描 QR Code
2. Signal：確保已安裝 signal-cli（見渠道特定文件）
3. Bot Token：確認 token 格式正確且未過期

### 常見錯誤 4：Tailscale 配置失敗

**錯誤資訊**：
```
Error: Tailscale binary not found in PATH or /Applications.
```

**解決方法**：
1. 安裝 Tailscale：https://tailscale.com/download/mac
2. 確保新增到 PATH 或安裝到 `/Applications`
3. 或跳過 Tailscale 配置，後續手動設定

### 常見錯誤 5：設定檔格式錯誤

**錯誤資訊**：
```
Error: Invalid config at ~/.clawdbot/clawdbot.json
```

**解決方法**：
```bash
# 修復配置
clawdbot doctor

# 或重置配置
clawdbot onboard --mode reset
```

---

## 本課小結

精靈式配置是配置 Clawdbot 的推薦方式，它透過互動式問題引導你完成所有必要設定：

**關鍵點回顧**：
- ✅ 支援 **QuickStart** 和 **Manual** 兩種模式
- ✅ 安全警告提醒潛在風險
- ✅ 自動偵測現有配置，可保留/修改/重置
- ✅ 支援 **Anthropic setup-token** 流程（推薦）和 API Key 方式
- ✅ 支援 **CLAWDBOT_PROFILE** 多配置檔案環境
- ✅ 自動配置渠道和技能
- ✅ 生成安全的預設值（loopback 綁定、token 認證）

**推薦工作流程**：
1. 首次使用：`clawdbot onboard --install-daemon`
2. 修改配置：`clawdbot configure`
3. 故障排查：`clawdbot doctor`
4. 遠端存取：配置 Tailscale Serve/Funnel

**下一步**：
- [啟動 Gateway](../gateway-startup/)：讓 Gateway 在背景執行
- [傳送第一條訊息](../first-message/)：與 AI 助手開始對話
- [了解 DM 配對](../pairing-approval/)：安全控制陌生傳送者

---

## 下一課預告

> 下一課我們學習 **[啟動 Gateway](../gateway-startup/)**。
>
> 你將學到：
> - 如何啟動 Gateway 守護程序
> - 開發模式和生產模式的區別
> - 如何監控 Gateway 狀態
> - 使用 launchd/systemd 自動啟動

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能           | 檔案路徑                                                                                                  | 行號      |
| -------------- | ------------------------------------------------------------------------------------------------- | --------- |
| 精靈主流程     | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 87-452    |
| 安全警告確認   | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 46-85     |
| Gateway 配置   | [`src/wizard/onboarding.gateway-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.gateway-config.ts) | 28-249    |
| 精靈介面定義   | [`src/wizard/prompts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/prompts.ts) | 36-52     |
| 渠道配置     | [`src/commands/onboard-channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/onboard-channels.ts) | -         |
| 技能配置     | [`src/commands/onboard-skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/onboard-skills.ts) | -         |
| 精靈型別定義   | [`src/wizard/onboarding.types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.types.ts) | 1-26      |
| 設定檔 Schema | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | -         |

**關鍵型別**：
- `WizardFlow`：`"quickstart" | "advanced"` - 精靈模式型別
- `QuickstartGatewayDefaults`：QuickStart 模式的 Gateway 預設配置
- `GatewayWizardSettings`：Gateway 配置設定
- `WizardPrompter`：精靈互動介面

**關鍵函式**：
- `runOnboardingWizard()`：主精靈流程
- `configureGatewayForOnboarding()`：配置 Gateway 網路和認證
- `requireRiskAcknowledgement()`：顯示並確認安全警告

**預設配置值**（QuickStart 模式）：
- Gateway 通訊埠：18789
- 綁定位址：loopback (127.0.0.1)
- 認證方式：token（自動生成隨機 token）
- Tailscale：off
- 工作區：`~/clawd`

**設定檔位置**：
- 主配置：`~/.clawdbot/clawdbot.json`
- OAuth 憑證：`~/.clawdbot/credentials/oauth.json`
- API Key 憑證：`~/.clawdbot/credentials/`
- 會話資料：`~/clawd/sessions.json`

</details>
