---
title: "AI 模型與認證設定完全指南：多提供者、認證方式與故障排除 | Clawdbot 教程"
sidebarTitle: "設定你的 AI 帳號"
subtitle: "AI 模型與認證設定"
description: "學習如何為 Clawdbot 設定 AI 模型提供者（Anthropic、OpenAI、OpenRouter、Ollama 等）和三種認證方式（API Key、OAuth、Token）。本教程涵蓋認證檔案管理、多帳號輪換、OAuth Token 自動重新整理、模型別名設定、故障切換和常見錯誤排除，包含實際設定範例和 CLI 指令，協助您快速上手。"
tags:
  - "advanced"
  - "configuration"
  - "authentication"
  - "models"
prerequisite:
  - "start-getting-started"
order: 190
---

# AI 模型與認證設定

## 學完你能做什麼

- 設定多個 AI 模型提供者（Anthropic、OpenAI、OpenRouter 等）
- 使用三種認證方式（API Key、OAuth、Token）
- 管理多帳號認證和認證輪換
- 設定模型選擇和備用模型
- 排除常見認證問題

## 你現在的困境

Clawdbot 支援數十種模型提供者，但設定起來可能讓人困惑：

- 應該用 API Key 還是 OAuth？
- 不同的提供者認證方式有什麼差別？
- 如何設定多個帳號？
- OAuth token 如何自動重新整理？

## 什麼時候用這一招

- 首次安裝後需要設定 AI 模型
- 新增新的模型提供者或備用帳號
- 遇到認證錯誤或配額限制
- 需要設定模型切換和備用機制

## 🎒 開始前的準備

::: warning 前置條件
本教程假設你已完成 [快速開始](../../start/getting-started/)，已安裝並啟動了 Gateway。
:::

- 確保 Node ≥22 已安裝
- Gateway 守護程式正在執行
- 準備好至少一個 AI 模型提供者的憑證（API Key 或訂閱帳號）

## 核心思路

### 模型設定與認證是分離的

在 Clawdbot 中，**模型選擇**和**認證憑證**是兩個獨立的概念：

- **模型設定**：告訴 Clawdbot 使用哪個模型（如 `anthropic/claude-opus-4-5`），儲存在 `~/.clawdbot/models.json`
- **認證設定**：提供存取模型的憑證（如 API Key 或 OAuth token），儲存在 `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`

::: info 為什麼分離？
這種設計讓你可以在多個提供者和帳號之間靈活切換，無需重複設定模型參數。
:::

### 三種認證方式

Clawdbot 支援三種認證方式，適用於不同場景：

| 認證方式 | 儲存格式 | 典型場景 | 支援的提供者 |
|--- | --- | --- | ---|
| **API Key** | `{ type: "api_key", key: "sk-..." }` | 快速開始、測試 | Anthropic、OpenAI、OpenRouter、DeepSeek 等 |
| **OAuth** | `{ type: "oauth", access: "...", refresh: "..." }` | 長期執行、自動重新整理 | Anthropic (Claude Code CLI)、OpenAI (Codex)、Qwen Portal |
| **Token** | `{ type: "token", token: "..." }` | 靜態 Bearer token | GitHub Copilot、某些自訂代理 |

### 支援的模型提供者

Clawdbot 內建支援以下模型提供者：

::: details 內建提供者清單
| 提供者 | 認證方式 | 推薦模型 | 備註 |
|--- | --- | --- | ---|
| **Anthropic** | API Key / OAuth (Claude Code CLI) | `anthropic/claude-opus-4-5` | 推薦 Claude Pro/Max + Opus 4.5 |
| **OpenAI** | API Key / OAuth (Codex) | `openai/gpt-5.2` | 支援標準 OpenAI 和 Codex 版本 |
| **OpenRouter** | API Key | `openrouter/anthropic/claude-sonnet-4-5` | 聚合數百個模型 |
| **Ollama** | HTTP Endpoint | `ollama/<model>` | 本地模型，無需 API Key |
| **DeepSeek** | API Key | `deepseek/deepseek-r1` | 中國友善 |
| **Qwen Portal** | OAuth | `qwen-portal/<model>` | 通義千問 OAuth |
| **Venice** | API Key | `venice/<model>` | 隱私優先 |
| **Bedrock** | AWS SDK | `amazon-bedrock/<model>` | AWS 託管模型 |
| **Antigravity** | API Key | `google-antigravity/<model>` | 模型代理服務 |
:::

::: tip 推薦組合
對於大多數使用者，推薦設定 **Anthropic Opus 4.5** 作為主模型，**OpenAI GPT-5.2** 作為備用。Opus 在長上下文和安全性方面表現更好。
:::

## 跟我做

### 第 1 步：設定 Anthropic（推薦）

**為什麼**
Anthropic Claude 是 Clawdbot 的推薦模型，特別是 Opus 4.5，它在長上下文處理和安全性方面表現優秀。

**選項 A：使用 Anthropic API Key（最快）**

```bash
clawdbot onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

**你應該看到**：
- Gateway 重新載入設定
- 預設模型設定為 `anthropic/claude-opus-4-5`
- 認證檔案 `~/.clawdbot/agents/default/agent/auth-profiles.json` 建立

**選項 B：使用 OAuth（長期執行推薦）**

OAuth 適合長期執行的 Gateway，token 會自動重新整理。

1. 產生 setup-token（需要在任意機器執行 Claude Code CLI）：
```bash
claude setup-token
```

2. 複製輸出的 token

3. 在 Gateway 主機上執行：
```bash
clawdbot models auth paste-token --provider anthropic
# 貼上 token
```

**你應該看到**：
- 提示 "Auth profile added: anthropic:claude-cli"
- 認證類型為 `oauth`（不是 `api_key`）

::: tip OAuth 優勢
OAuth token 會自動重新整理，無需手動更新。適合持續執行的 Gateway 守護程式。
:::

### 第 2 步：設定 OpenAI 作為備用

**為什麼**
設定備用模型可以在主模型（如 Anthropic）遇到配額限制或錯誤時自動切換。

```bash
clawdbot onboard --openai-api-key "$OPENAI_API_KEY"
```

或使用 OpenAI Codex OAuth：

```bash
clawdbot onboard --openai-codex
```

**你應該看到**：
- `~/.clawdbot/clawdbot.json` 中新增 OpenAI 提供者設定
- 認證檔案中新增 `openai:default` 或 `openai-codex:codex-cli` 設定

### 第 3 步：設定模型選擇和備用

**為什麼**
設定模型選擇策略，定義主模型、備用模型和別名。

編輯 `~/.clawdbot/clawdbot.json`：

```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-5"
      fallbacks:
        - "openai/gpt-5.2"
        - "openai/gpt-5-mini"
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**欄位說明**：
- `primary`：預設使用的模型
- `fallbacks`：按順序嘗試的備用模型（失敗時自動切換）
- `alias`：模型別名（如 `/model opus` 等同於 `/model anthropic/claude-opus-4-5`）

**你應該看到**：
- 重新啟動 Gateway 後，主模型變為 Opus 4.5
- 備用模型設定生效

### 第 4 步：新增 OpenRouter（可選）

**為什麼**
OpenRouter 聚合了數百個模型，適合存取特殊模型或免費模型。

```bash
clawdbot onboard --auth-choice openrouter-api-key --token "$OPENROUTER_API_KEY"
```

然後設定模型：

```yaml
agents:
  defaults:
    model:
      primary: "openrouter/anthropic/claude-sonnet-4-5"
```

**你應該看到**：
- 模型參考格式為 `openrouter/<provider>/<model>`
- 可以使用 `clawdbot models scan` 查看可用模型

### 第 5 步：設定 Ollama（本地模型）

**為什麼**
Ollama 讓你在本地執行模型，無需 API Key，適合隱私敏感場景。

編輯 `~/.clawdbot/clawdbot.json`：

```yaml
models:
  providers:
    ollama:
      baseUrl: "http://localhost:11434"
      api: "openai-completions"
      models:
        - id: "ollama/llama3.2"
          name: "Llama 3.2"
          api: "openai-completions"
          reasoning: false
          input: ["text"]
          cost:
            input: 0
            output: 0
            cacheRead: 0
            cacheWrite: 0
          contextWindow: 128000
          maxTokens: 4096

agents:
  defaults:
    model:
      primary: "ollama/llama3.2"
```

**你應該看到**：
- Ollama 模型無需 API Key
- 需要確保 Ollama 服務在 `http://localhost:11434` 執行

### 第 6 步：驗證設定

**為什麼**
確保認證和模型設定正確，Gateway 可以正常呼叫 AI。

```bash
clawdbot doctor
```

**你應該看到**：
- 無認證錯誤
- 模型清單包含你設定的提供者
- 狀態顯示 "OK"

或傳送測試訊息：

```bash
clawdbot message send --to +1234567890 --message "Hello from Clawdbot"
```

**你應該看到**：
- AI 回覆正常
- 無 "No credentials found" 錯誤

## 檢查點 ✅

- [ ] 已設定至少一個模型提供者（Anthropic 或 OpenAI）
- [ ] 認證檔案 `auth-profiles.json` 已建立
- [ ] 模型設定檔 `models.json` 已產生
- [ ] 可以透過 `/model <alias>` 切換模型
- [ ] Gateway 日誌無認證錯誤
- [ ] 測試訊息成功收到 AI 回覆

## 踩坑提醒

### 認證模式不匹配

**問題**：OAuth 設定與認證模式不匹配

```yaml
# ❌ 錯誤：OAuth credentials 但模式是 token
anthropic:claude-cli:
  provider: "anthropic"
  mode: "token"  # 應該是 "oauth"
```

**修復**：

```yaml
# ✅ 正確
anthropic:claude-cli:
  provider: "anthropic"
  mode: "oauth"
```

::: tip
Clawdbot 會自動將 Claude Code CLI 匯入的設定設定為 `mode: "oauth"`，無需手動修改。
:::

### OAuth Token 重新整理失敗

**問題**：看到 "OAuth token refresh failed for anthropic" 錯誤

**原因**：
- Claude Code CLI 憑證在另一台機器上失效
- OAuth token 過期

**修復**：
```bash
# 重新產生 setup-token
claude setup-token

# 重新貼上
clawdbot models auth paste-token --provider anthropic
```

::: warning token vs oauth
`type: "token"` 是靜態 Bearer token，不會自動重新整理。`type: "oauth"` 支援自動重新整理。
:::

### 配額限制和故障切換

**問題**：主模型遇到配額限制（429 錯誤）

**現象**：
```
HTTP 429: rate_limit_error
```

**自動處理**：
- Clawdbot 會自動嘗試 `fallbacks` 中的下一個模型
- 如果所有模型都失敗，傳回錯誤

**設定冷卻期**（可選）：

```yaml
auth:
  cooldowns:
    billingBackoffHours: 24  # 配額錯誤後 24 小時停用該提供者
    failureWindowHours: 1      # 1 小時內的失敗計入冷卻
```

### 環境變數覆蓋

**問題**：設定檔中使用了環境變數，但未設定

```yaml
models:
  providers:
    openai:
      apiKey: "${OPENAI_KEY}"  # 未設定會報錯
```

**修復**：
```bash
# 設定環境變數
export OPENAI_KEY="sk-..."

# 或在 .zshrc/.bashrc 中新增
echo 'export OPENAI_KEY="sk-..."' >> ~/.zshrc
```

## 進階設定

### 多帳號和認證輪換

**為什麼**
為同一提供者設定多個帳號，實現負載平衡和配額管理。

**設定認證檔案**（`~/.clawdbot/agents/default/agent/auth-profiles.json`）：

```json
{
  "version": 1,
  "profiles": {
    "anthropic:me@example.com": {
      "type": "oauth",
      "provider": "anthropic",
      "email": "me@example.com"
    },
    "anthropic:work": {
      "type": "api_key",
      "provider": "anthropic",
      "key": "sk-ant-work..."
    },
    "openai:personal": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-1..."
    },
    "openai:work": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-2..."
    }
  },
  "order": {
    "anthropic": ["anthropic:me@example.com", "anthropic:work"],
    "openai": ["openai:personal", "openai:work"]
  }
}
```

**`order` 欄位**：
- 定義認證輪換順序
- Clawdbot 會按順序嘗試每個帳號
- 失敗的帳號會自動跳過

**CLI 指令管理順序**：

```bash
# 查看目前順序
clawdbot models auth order get --provider anthropic

# 設定順序
clawdbot models auth order set --provider anthropic anthropic:me@example.com anthropic:work

# 清除順序（使用預設輪換）
clawdbot models auth order clear --provider anthropic
```

### 指定會話的認證

**為什麼**
為特定會話或子 Agent 鎖定認證設定。

**使用 `/model <alias>@<profileId>` 語法**：

```bash
# 為目前會話鎖定使用特定帳號
/model opus@anthropic:work

# 建立子 Agent 時指定認證
clawdbot sessions spawn --model "opus@anthropic:work" --workspace "~/clawd-work"
```

**設定檔中的鎖定**（`~/.clawdbot/clawdbot.json`）：

```yaml
auth:
  order:
    # 為 main Agent 鎖定 anthropic 順序
    main: ["anthropic:me@example.com", "anthropic:work"]
```

### OAuth Token 自動重新整理

Clawdbot 支援以下 OAuth 提供者的自動重新整理：

| 提供者 | OAuth 流程 | 重新整理機制 |
|--- | --- | ---|
| **Anthropic** (Claude Code CLI) | 標準授權碼 | pi-mono RPC 重新整理 |
| **OpenAI** (Codex) | 標準授權碼 | pi-mono RPC 重新整理 |
| **Qwen Portal** | 自訂 OAuth | `refreshQwenPortalCredentials` |
| **Chutes** | 自訂 OAuth | `refreshChutesTokens` |

**自動重新整理邏輯**：

1. 檢查 token 過期時間（`expires` 欄位）
2. 如果未過期，直接使用
3. 如果已過期，使用 `refresh` token 請求新的 `access` token
4. 更新儲存的憑證

::: tip Claude Code CLI 同步
如果使用 Anthropic OAuth（`anthropic:claude-cli`），Clawdbot 會在重新整理 token 時同步回 Claude Code CLI 的儲存，確保兩邊一致。
:::

### 模型別名和捷徑

**為什麼**
模型別名讓你可以快速切換模型，無需記住完整 ID。

**預先定義別名**（推薦設定）：

```yaml
agents:
  defaults:
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "anthropic/claude-haiku-4-5":
        alias: "haiku"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**使用方式**：

```bash
# 快速切換到 Opus
/model opus

# 等同於
/model anthropic/claude-opus-4-5

# 使用特定認證
/model opus@anthropic:work
```

::: tip 別名與認證分離
別名只是模型 ID 的捷徑，不影響認證選擇。要指定認證，使用 `@<profileId>` 語法。
:::

### 設定隱含提供者

某些提供者無需明確設定，Clawdbot 會自動偵測：

| 提供者 | 偵測方式 | 設定檔 |
|--- | --- | ---|
| **GitHub Copilot** | `~/.copilot/credentials.json` | 無需設定 |
| **AWS Bedrock** | 環境變數或 AWS SDK 憑證 | `~/.aws/credentials` |
| **Codex CLI** | `~/.codex/auth.json` | 無需設定 |

::: tip 隱含設定優先順序
隱含設定會自動合併到 `models.json` 中，但明確設定可以覆寫它們。
:::

## 常見問題

### OAuth vs API Key：有什麼差別？

**OAuth**：
- 適合長期執行的 Gateway
- Token 會自動重新整理
- 需要訂閱帳號（Claude Pro/Max、OpenAI Codex）

**API Key**：
- 適合快速開始和測試
- 不會自動重新整理
- 可以用於免費層級帳號

::: info 推薦選擇
- 長期執行 → 使用 OAuth（Anthropic、OpenAI）
- 快速測試 → 使用 API Key
- 隱私敏感 → 使用本地模型（Ollama）
:::

### 如何查看目前認證設定？

```bash
# 查看認證檔案
cat ~/.clawdbot/agents/default/agent/auth-profiles.json

# 查看模型設定
cat ~/.clawdbot/models.json

# 查看主設定檔
cat ~/.clawdbot/clawdbot.json
```

或使用 CLI：

```bash
# 列出模型
clawdbot models list

# 查看認證順序
clawdbot models auth order get --provider anthropic
```

### 如何移除某個認證？

```bash
# 編輯認證檔案，刪除對應的 profile
nano ~/.clawdbot/agents/default/agent/auth-profiles.json

# 或使用 CLI（手動操作）
clawdbot doctor  # 查看問題設定
```

::: warning 刪除前確認
刪除認證設定會導致使用該提供者的模型無法運作。確保有備用設定。
:::

### 配額限制後如何恢復？

**自動恢復**：
- Clawdbot 會在冷卻期後自動重試
- 查看日誌了解重試時間

**手動恢復**：
```bash
# 清除冷卻狀態
clawdbot models auth clear-cooldown --provider anthropic --profile-id anthropic:me@example.com

# 或重新啟動 Gateway
clawdbot gateway restart
```

## 本課小結

- Clawdbot 支援三種認證方式：API Key、OAuth、Token
- 模型設定和認證是分離的，儲存在不同檔案中
- 推薦設定 Anthropic Opus 4.5 作為主模型，OpenAI GPT-5.2 作為備用
- OAuth 支援自動重新整理，適合長期執行
- 可以設定多帳號和認證輪換，實現負載平衡
- 使用模型別名快速切換模型

## 下一課預告

> 下一課我們學習 **[會話管理與多 Agent](../session-management/)**。
>
> 你會學到：
> - 會話模型和會話隔離
> - 子 Agent 協作
> - 上下文壓縮
> - 多 Agent 路由設定

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 認證憑證類型定義 | [`src/agents/auth-profiles/types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/types.ts) | 1-74 |
| OAuth Token 解析和重新整理 | [`src/agents/auth-profiles/oauth.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/oauth.ts) | 1-220 |
| 認證設定檔管理 | [`src/agents/auth-profiles/profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/profiles.ts) | 1-85 |
| 模型設定類型 | [`src/config/types.models.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.models.ts) | 1-60 |
| 模型設定產生 | [`src/agents/models-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/models-config.ts) | 1-139 |
| Zod Schema 設定 | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300+ |

**關鍵類型**：
- `AuthProfileCredential`：認證憑證聯合類型（`ApiKeyCredential | TokenCredential | OAuthCredential`）
- `ModelProviderConfig`：模型提供者設定結構
- `ModelDefinitionConfig`：模型定義結構

**關鍵函數**：
- `resolveApiKeyForProfile()`：解析認證憑證並傳回 API Key
- `refreshOAuthTokenWithLock()`：帶鎖的 OAuth Token 重新整理
- `ensureClawdbotModelsJson()`：產生和合併模型設定

**設定檔位置**：
- `~/.clawdbot/clawdbot.json`：主設定檔
- `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`：認證憑證
- `~/.clawdbot/models.json`：產生的模型設定

</details>
