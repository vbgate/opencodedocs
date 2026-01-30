---
title: "安裝: 快速部署 | oh-my-opencode"
sidebarTitle: "5 分鐘跑起來"
subtitle: "快速安裝與配置：Provider 設定與驗證"
description: "學習 oh-my-opencode 的安裝和配置方法。在 5 分鐘內完成 AI Provider 配置，支援 Claude、OpenAI、Gemini、GitHub Copilot。"
tags:
  - "installation"
  - "setup"
  - "provider-configuration"
prerequisite: []
order: 10
---

# 快速安裝與配置：Provider 設定與驗證

## 學完你能做什麼

- ✅ 使用推薦的 AI 代理方式自動安裝和配置 oh-my-opencode
- ✅ 手動使用 CLI 互動式安裝器完成配置
- ✅ 配置 Claude、OpenAI、Gemini、GitHub Copilot 等多個 AI Provider
- ✅ 驗證安裝是否成功並診斷配置問題
- ✅ 了解 Provider 優先級和降級機制

## 你現在的困境

- 你剛剛安裝了 OpenCode，但面對空白配置介面無從下手
- 你有多個 AI 服務訂閱（Claude、ChatGPT、Gemini），不知道如何統一配置
- 你想讓 AI 幫你安裝，但不知道該如何給 AI 提供準確的安裝指令
- 你擔心配置錯誤導致外掛無法正常工作

## 什麼時候用這一招

- **首次安裝 oh-my-opencode 時**：這是第一步，必須完成
- **新增 AI Provider 訂閱後**：例如新買了 Claude Max 或 ChatGPT Plus
- **更換開發環境時**：在新機器上重新配置開發環境
- **遇到 Provider 連接問題時**：通過診斷命令排查配置問題

## 🎒 開始前的準備

::: warning 前置條件
本教程假設你已經：
1. 安裝了 **OpenCode >= 1.0.150**
2. 擁有至少一個 AI Provider 訂閱（Claude、OpenAI、Gemini、GitHub Copilot 等）

如果 OpenCode 未安裝，請先參考 [OpenCode 官方文件](https://opencode.ai/docs) 完成安裝。
:::

::: tip 檢查 OpenCode 版本
```bash
opencode --version
# 應該顯示 1.0.150 或更高版本
```
:::

## 核心思路

oh-my-opencode 的安裝設計有兩個核心理念：

**1. AI 代理優先（推薦）**

讓 AI 代理幫你安裝配置，而不是自己手動操作。為什麼？因為：
- AI 不會遺漏步驟（它有完整的安裝指南）
- AI 會自動根據你的訂閱情況選擇最佳配置
- AI 可以在出錯時自動診斷和修復

**2. 互動式 vs 非互動式**

- **互動式安裝**：運行 `bunx oh-my-opencode install`，通過問答方式配置
- **非互動式安裝**：使用命令行參數（適合自動化或 AI 代理）

**3. Provider 優先級**

oh-my-opencode 使用三步模型解析機制：
1. **用戶覆蓋**：如果配置文件中明確指定了模型，使用該模型
2. **Provider 降級**：按優先級鏈嘗試：`Native（anthropic/openai/google）> GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`
3. **系統預設**：如果所有 Provider 都不可用，使用 OpenCode 預設模型

::: info 什麼是 Provider？
Provider 是 AI 模型服務的提供商，例如：
- **Anthropic**：提供 Claude 模型（Opus、Sonnet、Haiku）
- **OpenAI**：提供 GPT 模型（GPT-5.2、GPT-5-nano）
- **Google**：提供 Gemini 模型（Gemini 3 Pro、Flash）
- **GitHub Copilot**：提供 GitHub 託管的多種模型作為 fallback

oh-my-opencode 可以同時配置多個 Provider，根據任務類型和優先級自動選擇最優模型。
:::

## 跟我做

### 第 1 步：推薦方式——讓 AI 代理安裝（人類友好）

**為什麼**
這是官方推薦的安裝方式，讓 AI 代理自動完成配置，避免人為遺漏步驟。

**操作**

打開你的 AI 對話介面（Claude Code、AmpCode、Cursor 等），輸入以下提示：

```bash
請按照以下指南安裝和配置 oh-my-opencode：
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**你應該看到**
AI 代理會：
1. 詢問你的訂閱情況（Claude、OpenAI、Gemini、GitHub Copilot 等）
2. 自動執行安裝命令
3. 配置 Provider 認證
4. 驗證安裝結果
5. 告訴你安裝完成

::: tip AI 代理的測試口令
AI 代理在完成安裝後，會用 "oMoMoMoMo..." 作為測試口令向你確認。
:::

### 第 2 步：手動安裝——使用 CLI 互動式安裝器

**為什麼**
如果你想完全控制安裝過程，或者 AI 代理安裝失敗時使用。

::: code-group

```bash [使用 Bun（推薦）]
bunx oh-my-opencode install
```

```bash [使用 npm]
npx oh-my-opencode install
```

:::

> **注意**：CLI 會自動下載適合你平台的獨立二進位檔案，安裝後無需 Bun/Node.js 運行時。
>
> **支援平台**：macOS (ARM64, x64)、Linux (x64, ARM64, Alpine/musl)、Windows (x64)

**你應該看到**
安裝器會詢問以下問題：

```
oMoMoMoMo... Install

[?] Do you have a Claude Pro/Max Subscription? (Y/n)
[?] Are you on max20 (20x mode)? (Y/n)
[?] Do you have an OpenAI/ChatGPT Plus Subscription? (Y/n)
[?] Will you integrate Gemini models? (Y/n)
[?] Do you have a GitHub Copilot Subscription? (Y/n)
[?] Do you have access to OpenCode Zen (opencode/ models)? (Y/n)
[?] Do you have a Z.ai Coding Plan subscription? (Y/n)

Configuration Summary
────────────────────────────────────────────────

  [OK] Claude (max20)
  [OK] OpenAI/ChatGPT (GPT-5.2 for Oracle)
  [OK] Gemini
  [OK] GitHub Copilot (fallback)
  ○ OpenCode Zen (opencode/ models)
  ○ Z.ai Coding Plan (Librarian/Multimodal)

────────────────────────────────────────────────

Model Assignment

  [i] Models auto-configured based on provider priority
  * Priority: Native > Copilot > OpenCode Zen > Z.ai

✓ Plugin registered in opencode.json
✓ Configuration written to ~/.config/opencode/oh-my-opencode.json
✓ Auth setup hints displayed

[!] Please configure authentication for your providers:

1. Anthropic (Claude): Run 'opencode auth login' → Select Anthropic
2. Google (Gemini): Run 'opencode auth login' → Select Google → Choose OAuth with Google (Antigravity)
3. GitHub (Copilot): Run 'opencode auth login' → Select GitHub

Done! 🎉
```

### 第 3 步：配置 Provider 認證

#### 3.1 Claude (Anthropic) 認證

**為什麼**
Sisyphus 主代理強烈推薦使用 Opus 4.5 模型，必須先認證。

**操作**

```bash
opencode auth login
```

然後按照提示操作：
1. **選擇 Provider**：選擇 `Anthropic`
2. **選擇登入方式**：選擇 `Claude Pro/Max`
3. **完成 OAuth 流程**：在瀏覽器中登入並授權
4. **等待完成**：終端會顯示認證成功

**你應該看到**
```
✓ Authentication successful
✓ Anthropic provider configured
```

::: warning Claude OAuth 訪問限制
> 截至 2026 年 1 月，Anthropic 已限制第三方 OAuth 訪問，引用 ToS 違規。
>
> [**Anthropic 引用本專案 oh-my-opencode 作為封鎖 OpenCode 的理由**](https://x.com/thdxr/status/2010149530486911014)
>
> 確實存在一些偽造 Claude Code OAuth 請求簽名的外掛在社群中。這些工具可能技術上可行，但用戶應了解 ToS 影響，我個人不推薦使用。
>
> 本專案不對使用非官方工具引起的任何問題負責，且**我們沒有任何自定義的 OAuth 系統實現**。
:::

#### 3.2 Google Gemini (Antigravity OAuth) 認證

**為什麼**
Gemini 模型用於 Multimodal Looker（媒體分析）和部分專業任務。

**操作**

**步驟 1**：添加 Antigravity Auth 外掛

編輯 `~/.config/opencode/opencode.json`，在 `plugin` 陣列中添加 `opencode-antigravity-auth@latest`：

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**步驟 2**：配置 Antigravity 模型（必需）

從 [opencode-antigravity-auth 文件](https://github.com/NoeFabris/opencode-antigravity-auth) 複製完整的模型配置，小心合併到 `~/.config/opencode/oh-my-opencode.json`，避免破壞現有配置。

該外掛使用 **variant 系統**——模型如 `antigravity-gemini-3-pro` 支援 `low`/`high` 變體，而不是單獨的 `-low`/`-high` 模型條目。

**步驟 3**：覆蓋 oh-my-opencode 代理模型

在 `oh-my-opencode.json`（或 `.opencode/oh-my-opencode.json`）中覆蓋代理模型：

```json
{
  "agents": {
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**可用模型（Antigravity 配額）**：
- `google/antigravity-gemini-3-pro` — 變體：`low`, `high`
- `google/antigravity-gemini-3-flash` — 變體：`minimal`, `low`, `medium`, `high`
- `google/antigravity-claude-sonnet-4-5` — 無變體
- `google/antigravity-claude-sonnet-4-5-thinking` — 變體：`low`, `max`
- `google/antigravity-claude-opus-4-5-thinking` — 變體：`low`, `max`

**可用模型（Gemini CLI 配額）**：
- `google/gemini-2.5-flash`, `google/gemini-2.5-pro`
- `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

> **注意**：傳統的帶後綴名稱如 `google/antigravity-gemini-3-pro-high` 仍然可用，但推薦使用變體。改用 `--variant=high` 和基礎模型名稱代替。

**步驟 4**：執行認證

```bash
opencode auth login
```

然後按照提示操作：
1. **選擇 Provider**：選擇 `Google`
2. **選擇登入方式**：選擇 `OAuth with Google (Antigravity)`
3. **完成瀏覽器登入**：（自動檢測）完成登入
4. **可選**：添加更多 Google 帳戶實現多帳戶負載均衡
5. **驗證成功**：與用戶確認

**你應該看到**
```
✓ Authentication successful
✓ Google provider configured (Antigravity)
✓ Multiple accounts available for load balancing
```

::: tip 多帳戶負載均衡
該外掛支援最多 10 個 Google 帳戶。當一個帳戶達到速率限制時，它會自動切換到下一個可用帳戶。
:::

#### 3.3 GitHub Copilot (Fallback Provider) 認證

**為什麼**
GitHub Copilot 作為 **fallback provider**，當 Native providers 不可用時使用。

**優先級**：`Native (anthropic/, openai/, google/) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`

**操作**

```bash
opencode auth login
```

然後按照提示操作：
1. **選擇 Provider**：選擇 `GitHub`
2. **選擇認證方式**：選擇 `Authenticate via OAuth`
3. **完成瀏覽器登入**：GitHub OAuth 流程

**你應該看到**
```
✓ Authentication successful
✓ GitHub Copilot configured as fallback
```

::: info GitHub Copilot 模型對應
當 GitHub Copilot 是最佳可用 provider 時，oh-my-opencode 使用以下模型分配：

| 代理          | 模型                            |
|--- | ---|
| **Sisyphus**  | `github-copilot/claude-opus-4.5`  |
| **Oracle**    | `github-copilot/gpt-5.2`         |
| **Explore**   | `opencode/gpt-5-nano`             |
| **Librarian** | `zai-coding-plan/glm-4.7`（如果 Z.ai 可用）或 fallback |

GitHub Copilot 作為代理 provider，根據你的訂閱路由請求到底層模型。
:::

### 第 4 步：非互動式安裝（適合 AI 代理）

**為什麼**
AI 代理需要使用非互動式模式，通過命令行參數一次性完成所有配置。

**操作**

```bash
bunx oh-my-opencode install --no-tui \
  --claude=<yes|no|max20> \
  --openai=<yes|no> \
  --gemini=<yes|no> \
  --copilot=<yes|no> \
  [--opencode-zen=<yes|no>] \
  [--zai-coding-plan=<yes|no>]
```

**參數說明**：

| 參數              | 值            | 說明                               |
|--- | --- | ---|
| `--no-tui`        | -             | 禁用互動式介面（必須指定其他參數） |
| `--claude`         | `yes/no/max20` | Claude 訂閱狀態                          |
| `--openai`         | `yes/no`       | OpenAI/ChatGPT 訂閱（GPT-5.2 for Oracle） |
| `--gemini`         | `yes/no`       | Gemini 整合                              |
| `--copilot`        | `yes/no`       | GitHub Copilot 訂閱                        |
| `--opencode-zen`   | `yes/no`       | OpenCode Zen 訪問（預設 no）                |
| `--zai-coding-plan` | `yes/no`       | Z.ai Coding Plan 訂閱（預設 no）         |

**範例**：

```bash
# 用戶有所有 native 訂閱
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no

# 用戶只有 Claude
bunx oh-my-opencode install --no-tui \
  --claude=yes \
  --openai=no \
  --gemini=no \
  --copilot=no

# 用戶只有 GitHub Copilot
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=yes

# 用戶沒有訂閱
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no
```

**你應該看到**
與非互動式安裝相同的輸出，但無需手動回答問題。

## 檢查點 ✅

### 驗證安裝是否成功

**檢查 1**：確認 OpenCode 版本

```bash
opencode --version
```

**預期結果**：顯示 `1.0.150` 或更高版本。

::: warning OpenCode 版本要求
如果你在 1.0.132 或更舊版本，OpenCode 的 bug 可能會破壞配置。
>
> 該修復在 1.0.132 之後合併——使用更新的版本。
> 有趣的事實：這個 PR 是由於 OhMyOpenCode 的 Librarian、Explore 和 Oracle 設定而被發現和修復的。
:::

**檢查 2**：確認外掛已註冊

```bash
cat ~/.config/opencode/opencode.json
```

**預期結果**：在 `plugin` 陣列中看到 `"oh-my-opencode"`。

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**檢查 3**：確認配置檔案已生成

```bash
cat ~/.config/opencode/oh-my-opencode.json
```

**預期結果**：顯示完整的配置結構，包括 `agents`、`categories`、`disabled_agents` 等欄位。

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/gpt-5.2"
    },
    ...
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1
    },
    ...
  },
  "disabled_agents": [],
  "disabled_skills": [],
  "disabled_hooks": [],
  "disabled_mcps": []
}
```

### 運行診斷命令

```bash
oh-my-opencode doctor --verbose
```

**你應該看到**：
- 模型解析檢查
- 代理配置驗證
- MCP 連接狀態
- Provider 認證狀態

```bash
✓ OpenCode version: 1.0.150 (required: >=1.0.150)
✓ Plugin registered: oh-my-opencode
✓ Config file found: ~/.config/opencode/oh-my-opencode.json
✓ Anthropic provider: authenticated
✓ OpenAI provider: authenticated
✓ Google provider: authenticated (Antigravity)
✓ GitHub Copilot: authenticated (fallback)
✓ MCP servers: 3 connected (websearch, context7, grep_app)
✓ Agents: 10 enabled
✓ Hooks: 32 enabled
```

::: danger 如果診斷失敗
如果診斷顯示任何錯誤，請先解決：
1. **Provider 認證失敗**：重新運行 `opencode auth login`
2. **配置檔案錯誤**：檢查 `oh-my-opencode.json` 語法（JSONC 支援註釋和尾隨逗號）
3. **版本不相容**：升級 OpenCode 到最新版本
4. **Plugin 未註冊**：重新運行 `bunx oh-my-opencode install`
:::

## 踩坑提醒

### ❌ 錯誤 1：忘記配置 Provider 認證

**問題**：安裝後直接使用，但 AI 模型無法工作。

**原因**：外掛已安裝，但 Provider 沒有通過 OpenCode 認證。

**解決**：
```bash
opencode auth login
# 選擇對應的 Provider 並完成認證
```

### ❌ 錯誤 2：OpenCode 版本過舊

**問題**：配置檔案被破壞或無法載入。

**原因**：OpenCode 1.0.132 或更早版本有 bug 會破壞配置。

**解決**：
```bash
# 升級 OpenCode
npm install -g @opencode/cli@latest

# 或使用套件管理器（Bun, Homebrew 等）
bun install -g @opencode/cli@latest
```

### ❌ 錯誤 3：CLI 命令參數錯誤

**問題**：運行非互動式安裝時提示參數錯誤。

**原因**：`--claude` 是必需參數，必須提供 `yes`、`no` 或 `max20`。

**解決**：
```bash
# ❌ 錯誤：缺少 --claude 參數
bunx oh-my-opencode install --no-tui --gemini=yes

# ✅ 正確：提供所有必需參數
bunx oh-my-opencode install --no-tui --claude=yes --gemini=yes
```

### ❌ 錯誤 4：Antigravity 配額耗盡

**問題**：Gemini 模型突然停止工作。

**原因**：Antigravity 配額有限，單個帳戶可能達到速率限制。

**解決**：添加多個 Google 帳戶實現負載均衡
```bash
opencode auth login
# 選擇 Google
# 添加更多帳戶
```

外掛會自動在帳戶間切換，避免單個帳戶耗盡。

### ❌ 錯誤 5：配置檔案位置錯誤

**問題**：修改配置後沒有生效。

**原因**：修改了錯誤的配置檔案（專案配置 vs 用戶配置）。

**解決**：確認配置檔案位置

| 配置類型 | 檔案路徑 | 優先級 |
|--- | --- | ---|
| **用戶配置** | `~/.config/opencode/oh-my-opencode.json` | 高 |
| **專案配置** | `.opencode/oh-my-opencode.json` | 低 |

::: tip 配置合併規則
如果同時存在用戶配置和專案配置，**用戶配置會覆蓋專案配置**。
:::

## 本課小結

- **推薦使用 AI 代理安裝**：讓 AI 自動完成配置，避免人為遺漏
- **CLI 支援互動式和非互動式模式**：互動式適合人類，非互動式適合 AI
- **Provider 優先級**：Native > Copilot > OpenCode Zen > Z.ai
- **認證是必需的**：安裝後必須配置 Provider 認證才能使用
- **診斷命令很重要**：`oh-my-opencode doctor --verbose` 可以快速排查問題
- **支援 JSONC 格式**：配置檔案支援註釋和尾隨逗號

## 下一課預告

> 下一課我們學習 **[初識 Sisyphus：主編排器](../sisyphus-orchestrator/)**。
>
> 你會學到：
> - Sisyphus 代理的核心功能和設計理念
> - 如何使用 Sisyphus 規劃和委託任務
> - 並行後臺任務的運作機制
> - Todo 強制完成器的原理

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能              | 檔案路徑                                                                                               | 行號    |
|--- | --- | ---|
| CLI 安裝入口      | [`src/cli/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/index.ts)         | 22-60   |
| 互動式安裝器      | [`src/cli/install.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/install.ts)         | 1-400+  |
| 配置管理器        | [`src/cli/config-manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/config-manager.ts) | 1-200+  |
| 配置 Schema       | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts)       | 1-400+  |
| 診斷命令          | [`src/cli/doctor.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/doctor.ts)          | 1-200+  |

**關鍵常量**：
- `VERSION = packageJson.version`：當前 CLI 版本號
- `SYMBOLS`：UI 符號（check、cross、arrow、bullet、info、warn、star）

**關鍵函式**：
- `install(args: InstallArgs)`：主安裝函式，處理互動式和非互動式安裝
- `validateNonTuiArgs(args: InstallArgs)`：驗證非互動式模式的參數
- `argsToConfig(args: InstallArgs)`：將 CLI 參數轉換為配置物件
- `addPluginToOpenCodeConfig()`：將外掛註冊到 opencode.json
- `writeOmoConfig(config)`：寫入 oh-my-opencode.json 配置檔案
- `isOpenCodeInstalled()`：檢查 OpenCode 是否已安裝
- `getOpenCodeVersion()`：取得 OpenCode 版本號

**配置 Schema 欄位**：
- `AgentOverrideConfigSchema`：代理覆蓋配置（model、variant、skills、temperature、prompt 等）
- `CategoryConfigSchema`：Category 配置（description、model、temperature、thinking 等）
- `ClaudeCodeConfigSchema`：Claude Code 相容性配置（mcp、commands、skills、agents、hooks、plugins）
- `BuiltinAgentNameSchema`：內建代理列舉（sisyphus、prometheus、oracle、librarian、explore、multimodal-looker、metis、momus、atlas）
- `PermissionValue`：許可權值列舉（ask、allow、deny）

**安裝支援的平台**（來自 README）：
- macOS (ARM64, x64)
- Linux (x64, ARM64, Alpine/musl)
- Windows (x64)

**Provider 優先級鏈**（來自 docs/guide/installation.md）：
1. Native（anthropic/, openai/, google/）
2. GitHub Copilot
3. OpenCode Zen
4. Z.ai Coding Plan

</details>
