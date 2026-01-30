---
title: "故障排除：Doctor 診斷設定 | oh-my-opencode"
sidebarTitle: "5 分鐘定位問題"
subtitle: "故障排除：Doctor 診斷設定"
description: "學習 Doctor 命令診斷方法，涵蓋版本、外掛、認證、相依性等 17+ 項檢查，使用 --verbose、--json、--category 選項快速定位設定問題。"
tags:
  - "troubleshooting"
  - "diagnostics"
  - "configuration"
prerequisite:
  - "start-installation"
order: 150
---

# 設定診斷與故障排除：使用 Doctor 命令快速解決問題

## 學完你能做什麼

- 執行 `oh-my-opencode doctor` 快速診斷 17+ 項健康檢查
- 定位和修復 OpenCode 版本過低、外掛未註冊、Provider 設定等問題
- 理解模型解析機制，檢查代理和 Categories 的模型分配
- 使用詳細模式取得問題診斷的完整資訊

## 你現在的困境

安裝完 oh-my-opencode 後，遇到以下情況怎麼辦？

- OpenCode 提示外掛未載入，但設定檔看起來沒問題
- 某些 AI 代理總是報錯「Model not found」
- 想確認所有 Provider（Claude、OpenAI、Gemini）都設定正確
- 不確定問題出在建置、設定還是認證環節

逐個排查太耗時，你需要一個**一鍵診斷工具**。

## 核心思路

**Doctor 命令是 oh-my-opencode 的健康檢查系統**，類似 Mac 的磁碟工具程式或汽車的故障檢測儀。它會逐項檢查你的環境，告訴你哪裡正常、哪裡有問題。

Doctor 的檢查邏輯完全來自原始碼實作（`src/cli/doctor/checks/`），包括：
- ✅ **installation**：OpenCode 版本、外掛註冊
- ✅ **configuration**：設定檔格式、Schema 驗證
- ✅ **authentication**：Anthropic、OpenAI、Google 認證外掛
- ✅ **dependencies**：Bun、Node.js、Git 相依性
- ✅ **tools**：LSP 和 MCP 伺服器狀態
- ✅ **updates**：版本更新檢查

## 跟我做

### 第 1 步：執行基礎診斷

**為什麼**
先跑一遍完整檢查，了解整體健康狀況。

```bash
bunx oh-my-opencode doctor
```

**你應該看到**：

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**檢查點 ✅**：
- [ ] 看到 6 個分類的檢查結果
- [ ] 每項前面有 ✓（通過）、⚠（警告）、✗（失敗）標記
- [ ] 底部有彙總統計

### 第 2 步：解讀常見問題

根據診斷結果，你可以快速定位問題。以下是常見錯誤及解決方案：

#### ✗ "OpenCode version too old"

**問題**：OpenCode 版本低於 1.0.150（最低要求）

**原因**：oh-my-opencode 依賴 OpenCode 的新功能，舊版本不支援

**解決方法**：

```bash
# 更新 OpenCode
npm install -g opencode@latest
# 或使用 Bun
bun install -g opencode@latest
```

**驗證**：重新執行 `bunx oh-my-opencode doctor`

#### ✗ "Plugin not registered"

**問題**：外掛未在 `opencode.json` 的 `plugin` 陣列中註冊

**原因**：安裝過程被中斷，或手動編輯了設定檔

**解決方法**：

```bash
# 重新執行安裝程式
bunx oh-my-opencode install
```

**原始碼依據**（`src/cli/doctor/checks/plugin.ts:79-117`）：
- 檢查外掛是否在 `opencode.json` 的 `plugin` 陣列中
- 支援格式：`oh-my-opencode` 或 `oh-my-opencode@version` 或 `file://` 路徑

#### ✗ "Configuration has validation errors"

**問題**：設定檔不符合 Schema 定義

**原因**：手動編輯時引入了錯誤（如拼字錯誤、型別不匹配）

**解決方法**：

1. 使用 `--verbose` 檢視詳細錯誤資訊：

```bash
bunx oh-my-opencode doctor --verbose
```

2. 常見錯誤類型（來自 `src/config/schema.ts`）：

| 錯誤訊息 | 原因 | 修正方法 |
|--- | --- | ---|
| `agents.sisyphus.mode: Invalid enum value` | `mode` 只能是 `subagent`/`primary`/`all` | 改為 `primary` |
| `categories.quick.model: Expected string` | `model` 必須是字串 | 加引號：`"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | 並行數必須是數字 | 改為數字：`3` |

3. 參考 [設定參考](../../appendix/configuration-reference/) 驗證欄位定義

#### ⚠ "Auth plugin not installed"

**問題**：Provider 對應的認證外掛未安裝

**原因**：安裝時跳過了該 Provider，或手動解除了外掛

**解決方法**：

```bash
# 重新安裝並選擇缺失的 Provider
bunx oh-my-opencode install
```

**原始碼依據**（`src/cli/doctor/checks/auth.ts:11-15`）：

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### 第 3 步：檢查模型解析

模型解析是 oh-my-opencode 的核心機制，檢查代理和 Categories 的模型分配是否正確。

```bash
bunx oh-my-opencode doctor --category configuration
```

**你應該看到**：

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══
  
    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15
    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh
  
  ═══ Configured Models ═══
  
  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...
  
  Categories:
    ○ visual-engineering: google/gemini-3-pro
    ○ ultrabrain: openai/gpt-5.2-codex
    ...
  
  ○ = provider fallback
```

**檢查點 ✅**：
- [ ] 看到 Agent 和 Categories 的模型分配
- [ ] `○` 表示使用 Provider 降級機制（未手動覆寫）
- [ ] `●` 表示使用者在設定中覆寫了預設模型

**常見問題**：

| 問題 | 原因 | 解決方法 |
|--- | --- | ---|
| `unknown` 模型 | Provider 降級鏈為空 | 確保至少有一個 Provider 可用 |
| 模型未被使用 | Provider 未連接 | 執行 `opencode` 連接 Provider |
| 想覆寫模型 | 使用預設模型 | 在 `oh-my-opencode.json` 中設定 `agents.<name>.model` |

**原始碼依據**（`src/cli/doctor/checks/model-resolution.ts:129-148`）：
- 從 `~/.cache/opencode/models.json` 讀取可用模型
- 代理模型要求：`AGENT_MODEL_REQUIREMENTS`（`src/shared/model-requirements.ts`）
- Category 模型要求：`CATEGORY_MODEL_REQUIREMENTS`

### 第 4 步：使用 JSON 輸出（指令碼化）

如果你想在 CI/CD 中自動化診斷，使用 JSON 格式：

```bash
bunx oh-my-opencode doctor --json
```

**你應該看到**：

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**使用情境**：

```bash
# 儲存診斷報告到檔案
bunx oh-my-opencode doctor --json > doctor-report.json

# 在 CI/CD 中檢查健康狀態
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "All checks passed"
else
  echo "Some checks failed"
  exit 1
fi
```

## 踩坑提醒

### ❌ 錯誤 1：忽略警告資訊

**問題**：看到 `⚠` 標記以為是「可選」的，實際上可能是重要提示

**修正方法**：
- 例如：「using default model」警告表示你未設定 Category 模型，可能不是最優選擇
- 使用 `--verbose` 檢視詳細資訊，判斷是否需要處理

### ❌ 錯誤 2：手動編輯 opencode.json

**問題**：直接修改 OpenCode 的 `opencode.json`，破壞了外掛註冊

**修正方法**：
- 使用 `bunx oh-my-opencode install` 重新註冊
- 或者只修改 `oh-my-opencode.json`，不動 OpenCode 的設定檔

### ❌ 錯誤 3：快取未重新整理

**問題**：模型解析顯示「cache not found」，但 Provider 已設定

**修正方法**：

```bash
# 啟動 OpenCode 以重新整理模型快取
opencode

# 或手動重新整理（如果有 opencode models 命令）
opencode models --refresh
```

## 本課小結

Doctor 命令是 oh-my-opencode 的瑞士刀，幫你快速定位問題：

| 命令 | 用途 | 何時使用 |
|--- | --- | ---|
| `bunx oh-my-opencode doctor` | 完整診斷 | 首次安裝後、遇到問題時 |
| `--verbose` | 詳細資訊 | 需要檢視錯誤詳情 |
| `--json` | JSON 輸出 | CI/CD、指令碼自動化 |
| `--category <name>` | 單類別檢查 | 只想檢查特定環節 |

**記住**：每次遇到問題，先跑 `doctor`，看清楚錯誤再動手。

## 下一課預告

> 下一課我們學習 **[常見問題解答](../faq/)**。
>
> 你會學到：
> - oh-my-opencode 與其他 AI 工具的區別
> - 如何優化模型使用成本
> - 背景任務並行控制的最佳實踐

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| Doctor 命令入口 | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| 所有檢查項註冊 | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| 外掛註冊檢查 | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| 設定驗證檢查 | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| 認證檢查 | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| 模型解析檢查 | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| 設定 Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| 模型要求定義 | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | 全文 |

**關鍵常數**：
- `MIN_OPENCODE_VERSION = "1.0.150"`：OpenCode 最低版本要求
- `AUTH_PLUGINS`：認證外掛對映（Anthropic=內建，OpenAI/GitHub=外掛）
- `AGENT_MODEL_REQUIREMENTS`：代理模型要求（每個代理的優先級鏈）
- `CATEGORY_MODEL_REQUIREMENTS`：Category 模型要求（visual、quick 等）

**關鍵函式**：
- `doctor(options)`：執行診斷命令，返回退出碼
- `getAllCheckDefinitions()`：取得所有 17+ 個檢查項定義
- `checkPluginRegistration()`：檢查外掛是否在 opencode.json 中註冊
- `validateConfig(configPath)`：驗證設定檔符合 Schema
- `checkAuthProvider(providerId)`：檢查 Provider 認證外掛狀態
- `checkModelResolution()`：檢查模型解析和分配

</details>
