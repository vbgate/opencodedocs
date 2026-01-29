---
title: "技能平台與 ClawdHub：整合擴充 AI 助手 | Clawdbot 教程 | Clawdbot"
sidebarTitle: "擴充 AI 能力"
subtitle: "技能平台與 ClawdHub：整合擴充 AI 助手 | Clawdbot 教程 | Clawdbot"
description: "學習 Clawdbot 技能系統架構，掌握 Bundled、Managed、Workspace 技能的三種載入優先級。使用 ClawdHub 安裝和更新技能，設定技能門控規則與環境變數注入機制。"
tags:
  - "技能系統"
  - "ClawdHub"
  - "AI 擴充"
  - "技能設定"
prerequisite:
  - "start-getting-start"
order: 280
---

# 技能平台與 ClawdHub 整合擴充 AI 助手 | Clawdbot 教程

## 學完你能做什麼

學完這一課，你將能夠：

- 理解 Clawdbot 的技能系統架構（Bundled、Managed、Workspace 三種技能類型）
- 從 ClawdHub 發現、安裝、更新技能，擴充 AI 助手能力
- 設定技能的啟用狀態、環境變數和 API 金鑰
- 使用技能門控（Gating）規則，確保技能只在滿足條件時載入
- 管理多 Agent 場景下的技能共享和覆蓋優先級

## 你現在的困境

Clawdbot 本身已經提供了豐富的內建工具（瀏覽器、指令執行、Web 搜尋等），但當你需要：

- 呼叫第三方 CLI 工具（如 `gemini`、`peekaboo`）
- 新增特定領域的自動化腳本
- 讓 AI 學習使用你自訂的工具集

你可能會想：「要怎麼告訴 AI 有哪些工具可以用？這些工具應該放在哪裡？多個 Agent 能否共享技能？」

Clawdbot 的技能系統就是為此設計的：**透過 SKILL.md 檔案宣告技能，由 Agent 自動載入和使用**。

## 什麼時候用這一招

- **需要擴充 AI 能力時**：想新增新的工具或自動化流程
- **多 Agent 協作時**：不同 Agent 需要共享或獨佔技能
- **技能版本管理時**：從 ClawdHub 安裝、更新、同步技能
- **技能門控時**：確保技能只在特定環境（OS、二進制、設定）下載入

## 🎒 開始前的準備

開始前，請確認：

- [ ] 已完成 [快速開始](../../start/getting-start/)，Gateway 正常運作
- [ ] 已設定至少一個 AI 模型（Anthropic、OpenAI、Ollama 等）
- [ ] 了解基本的命令列操作（`mkdir`、`cp`、`rm`）

## 核心思路

### 技能是什麼？

技能是一個目錄，包含 `SKILL.md` 檔案（給 LLM 的指令和工具定義），以及可選的腳本或資源。`SKILL.md` 使用 YAML frontmatter 定義元資料，用 Markdown 描述技能用法。

Clawdbot 相容 [AgentSkills](https://agentskills.io) 規格，技能可以被其他遵循該規格的工具載入。

#### 技能載入的三個位置

技能從三個地方載入，按優先級從高到低：

1. **Workspace 技能**：`<workspace>/skills`（優先級最高）
2. **Managed/本機技能**：`~/.clawdbot/skills`
3. **Bundled 技能**：隨安裝套件一起提供（優先級最低）

::: info 優先級規則
如果同名的技能存在於多個位置，Workspace 技能會覆蓋 Managed 和 Bundled 技能。
:::

此外，你還可以透過 `skills.load.extraDirs` 設定額外的技能目錄（優先級最低）。

#### 多 Agent 場景下的技能共享

在多 Agent 設定中，每個 Agent 都有自己的 workspace：

- **Per-agent 技能**：位於 `<workspace>/skills`，僅對該 Agent 可見
- **共享技能**：位於 `~/.clawdbot/skills`，對同一台機器上的所有 Agent 可見
- **共享資料夾**：可以透過 `skills.load.extraDirs` 新增（優先級最低），用於多個 Agent 共用同一個技能套件

同名衝突時，優先級規則同樣適用：Workspace > Managed > Bundled。

#### 技能門控（Gating）

Clawdbot 在載入時根據 `metadata` 欄位過濾技能，確保技能只在滿足條件時載入：

```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"clawdbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

`metadata.clawdbot` 下的欄位：

- `always: true`：總是載入技能（跳過其他門控）
- `emoji`：macOS Skills UI 中顯示的 emoji
- `homepage`：macOS Skills UI 中顯示的網站連結
- `os`：平台列表（`darwin`、`linux`、`win32`），技能僅在這些 OS 上可用
- `requires.bins`：列表，每個必須在 `PATH` 中存在
- `requires.anyBins`：列表，至少一個在 `PATH` 中存在
- `requires.env`：列表，環境變數必須存在或在設定中提供
- `requires.config`：`clawdbot.json` 路徑列表，必須為真值
- `primaryEnv`：與 `skills.entries.<name>.apiKey` 關聯的環境變數名稱
- `install`：可選的安裝器規格陣列（供 macOS Skills UI 使用）

::: warning 沙箱環境下的二進制檢查
`requires.bins` 在技能載入時在**主機**上檢查。如果 Agent 在沙箱中執行，二進制必須也存在於容器內。
可透過 `agents.defaults.sandbox.docker.setupCommand` 安裝相依套件。
:::

### 環境變數注入

當 Agent 執行開始時，Clawdbot：

1. 讀取技能元資料
2. 套用任何 `skills.entries.<key>.env` 或 `skills.entries.<key>.apiKey` 到 `process.env`
3. 使用符合條件的技能建構系統提示詞
4. Agent 執行結束後恢復原始環境

這是**限定在 Agent 執行範圍**，不是全域 Shell 環境。

## 跟我做

### 第 1 步：查看已安裝的技能

使用 CLI 列出目前可用的技能：

```bash
clawdbot skills list
```

或只查看符合條件的技能：

```bash
clawdbot skills list --eligible
```

**你應該看到**：技能列表，包括名稱、描述、是否滿足條件（如二進制、環境變數）。

### 第 2 步：從 ClawdHub 安裝技能

ClawdHub 是 Clawdbot 的公共技能註冊表，你可以瀏覽、安裝、更新和發布技能。

#### 安裝 CLI

選擇一種方式安裝 ClawdHub CLI：

```bash
npm i -g clawdhub
```

或

```bash
pnpm add -g clawdhub
```

#### 搜尋技能

```bash
clawdhub search "postgres backups"
```

#### 安裝技能

```bash
clawdhub install <skill-slug>
```

預設情況下，CLI 安裝到目前工作目錄的 `./skills` 子目錄（或回退到設定的 Clawdbot workspace）。Clawdbot 會在下一次會話中將其作為 `<workspace>/skills` 載入。

**你應該看到**：安裝輸出，顯示技能資料夾和版本資訊。

### 第 3 步：更新已安裝的技能

更新所有已安裝的技能：

```bash
clawdhub update --all
```

或更新特定技能：

```bash
clawdhub update <slug>
```

**你應該看到**：每個技能的更新狀態，包括版本變更。

### 第 4 步：設定技能覆蓋

在 `~/.clawdbot/clawdbot.json` 中設定技能的啟用狀態、環境變數等：

```json5
{
  "skills": {
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": {
          "GEMINI_API_KEY": "GEMINI_KEY_HERE"
        },
        "config": {
          "endpoint": "https://example.invalid",
          "model": "nano-pro"
        }
      },
      "peekaboo": { "enabled": true },
      "sag": { "enabled": false }
    }
  }
}
```

**規則**：

- `enabled: false`：停用技能，即使是 Bundled 或已安裝的
- `env`：注入環境變數（僅當變數未在程序中設定時）
- `apiKey`：便捷欄位，用於宣告了 `metadata.clawdbot.primaryEnv` 的技能
- `config`：可選的自訂欄位套件，自訂鍵必須放在這裡

**你應該看到**：設定儲存後，Clawdbot 會在下一次 Agent 執行時套用這些設定。

### 第 5 步：啟用技能監視器（可選）

預設情況下，Clawdbot 監視技能資料夾，在 `SKILL.md` 檔案變更時重新整理技能快照。你可以在 `skills.load` 下設定：

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

**你應該看到**：修改技能檔案後，無需重新啟動 Gateway，Clawdbot 會在下一次 Agent 輪次中自動重新整理技能列表。

### 第 6 步：偵錯技能問題

檢查技能的詳細資訊和缺失的相依套件：

```bash
clawdbot skills info <name>
```

檢查所有技能的相依套件狀態：

```bash
clawdbot skills check
```

**你應該看到**：技能的詳細資訊，包括二進制、環境變數、設定狀態，以及缺失的條件。

## 檢查點 ✅

完成上述步驟後，你應該能夠：

- [ ] 使用 `clawdbot skills list` 查看所有可用技能
- [ ] 從 ClawdHub 安裝新技能
- [ ] 更新已安裝的技能
- [ ] 在 `clawdbot.json` 中設定技能覆蓋
- [ ] 使用 `skills check` 偵錯技能相依套件問題

## 踩坑提醒

### 常見錯誤 1：技能名稱包含連字號

**問題**：`skills.entries` 中使用帶連字號的技能名稱作為鍵

```json
// ❌ 錯誤：未加引號
{
  "skills": {
    "entries": {
      nano-banana-pro: { "enabled": true }  // JSON 語法錯誤
    }
  }
}
```

**修正**：使用引號包裹鍵（JSON5 支援帶引號的鍵）

```json
// ✅ 正確：加引號
{
  "skills": {
    "entries": {
      "nano-banana-pro": { "enabled": true }
    }
  }
}
```

### 常見錯誤 2：沙箱環境下的環境變數

**問題**：技能在沙箱中執行，但 `skills.entries.<skill>.env` 或 `apiKey` 沒有生效

**原因**：全域 `env` 和 `skills.entries.<skill>.env/apiKey` 只套用於**主機執行**，沙箱不繼承主機 `process.env`。

**修正**：使用以下方式之一：

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "docker": {
          "env": {
            "GEMINI_API_KEY": "your_key_here"
          }
        }
      }
    }
  }
}
```

或將環境變數 baked 進自訂沙箱映像檔。

### 常見錯誤 3：技能不顯示在列表中

**問題**：已安裝技能，但 `clawdbot skills list` 不顯示

**可能原因**：

1. 技能不滿足門控條件（缺少二進制、環境變數、設定）
2. 技能已停用（`enabled: false`）
3. 技能不在 Clawdbot 掃描的目錄中

**排查步驟**：

```bash
# 檢查技能相依套件
clawdbot skills check

# 檢查技能目錄是否被掃描
ls -la ~/.clawdbot/skills/
ls -la <workspace>/skills/
```

### 常見錯誤 4：技能衝突和優先級混淆

**問題**：同名的技能存在於多個位置，載入的是哪一個？

**記住優先級**：

`<workspace>/skills` (最高) → `~/.clawdbot/skills` → bundled skills (最低)

如果想使用 Bundled 技能而非 Workspace 覆蓋：

1. 刪除或重新命名 `<workspace>/skills/<skill-name>`
2. 或在 `skills.entries` 中停用該技能

## 本課小結

本課學習了 Clawdbot 技能平台的核心概念：

- **三種技能類型**：Bundled、Managed、Workspace，按優先級載入
- **ClawdHub 整合**：搜尋、安裝、更新、發布技能的公共註冊表
- **技能門控**：透過 metadata 的 `requires` 欄位過濾技能
- **設定覆蓋**：在 `clawdbot.json` 中控制技能的啟用、環境變數和自訂設定
- **技能監視器**：自動重新整理技能列表，無需重新啟動 Gateway

技能系統是擴充 Clawdbot 能力的核心機制，掌握它可以讓你的 AI 助手適應更多場景和工具。

## 下一課預告

> 下一課我們學習 **[安全與沙箱隔離](../security-sandbox/)**。
>
> 你會學到：
> - 安全模型和權限控制
> - 工具權限的 allowlist/denylist
> - Docker 沙箱隔離機制
> - 遠端 Gateway 的安全設定

---

#### 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 技能設定類型定義 | [`src/config/types.skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.skills.ts) | 1-32 |
| 技能系統文件 | [`docs/tools/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills.md) | 1-260 |
| 技能設定參考 | [`docs/tools/skills-config.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills-config.md) | 1-76 |
| ClawdHub 文件 | [`docs/tools/clawdhub.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/clawdhub.md) | 1-202 |
| 建立技能指南 | [`docs/tools/creating-skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/creating-skills.md) | 1-42 |
| CLI 指令 | [`docs/cli/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/skills.md) | 1-26 |

**關鍵類型**：

- `SkillConfig`：單個技能的設定（enabled、apiKey、env、config）
- `SkillsLoadConfig`：技能載入設定（extraDirs、watch、watchDebounceMs）
- `SkillsInstallConfig`：技能安裝設定（preferBrew、nodeManager）
- `SkillsConfig`：頂層技能設定（allowBundled、load、install、entries）

**內建技能範例**：

- `skills/gemini/SKILL.md`：Gemini CLI 技能
- `skills/peekaboo/SKILL.md`：Peekaboo macOS UI 自動化技能

</details>
