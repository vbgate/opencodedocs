---
title: "安裝與設定 | Agent App Factory 教程"
sidebarTitle: "5 分鐘完成安裝"
subtitle: "安裝與設定 | Agent App Factory 教程"
description: "學習如何安裝 Agent App Factory CLI 工具，設定 Claude Code 或 OpenCode，以及安裝必需的外掛。本教程涵蓋 Node.js 環境要求、AI 助手設定和外掛安裝步驟。"
tags:
  - "安裝"
  - "設定"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 20
---

# 安裝與設定

## 學完你能做什麼

✅ 安裝 Agent App Factory CLI 工具並驗證安裝
✅ 設定 Claude Code 或 OpenCode 作為 AI 執行引擎
✅ 安裝執行管線所需的必需外掛
✅ 完成專案初始化並啟動第一個 Factory 專案

## 你現在的困境

想用 AI App Factory 把想法變成應用，但不知道該裝什麼工具、配什麼環境。裝好了又怕漏掉必需的外掛，管線跑到一半報錯。

## 什麼時候用這一招

當你第一次使用 AI App Factory，或者在新機器上重新搭建開發環境時，先完成安裝設定，再開始生成應用。

## 🎒 開始前的準備

::: warning 前置要求

在開始安裝前，請確保：

- **Node.js 版本 >= 16.0.0** - 這是 CLI 工具的最低要求
- **npm 或 yarn** - 用於全域安裝套件
- **一個 AI 助手** - Claude Code 或 OpenCode（推薦 Claude Code）

:::

**檢查 Node.js 版本**：

```bash
node --version
```

如果版本低於 16.0.0，請從 [Node.js 官網](https://nodejs.org) 下載並安裝最新 LTS 版本。

## 核心思路

AI App Factory 的安裝包含 3 個關鍵部分：

1. **CLI 工具** - 提供指令列介面，管理專案狀態
2. **AI 助手** - 執行管線的「大腦」，解讀 Agent 指令
3. **必需外掛** - 增強 AI 能力的擴充套件（Bootstrap 頭腦風暴、UI 設計系統）

安裝流程：安裝 CLI → 設定 AI 助手 → 初始化專案（自動安裝外掛）

## 跟我做

### 第 1 步：安裝 CLI 工具

全域安裝 Agent App Factory CLI，這樣你就可以在任何目錄使用 `factory` 指令。

```bash
npm install -g agent-app-factory
```

**你應該看到**：安裝成功的輸出

```
added 1 package in Xs
```

**驗證安裝**：

```bash
factory --version
```

**你應該看到**：版本號輸出

```
1.0.0
```

如果看不到版本號，檢查是否安裝成功：

```bash
which factory  # macOS/Linux
where factory  # Windows
```

::: tip 安裝失敗？

如果遇到權限問題（macOS/Linux），嘗試：

```bash
sudo npm install -g agent-app-factory
```

或者使用 npx 而不全域安裝（不推薦，每次使用需要下載）：

```bash
npx agent-app-factory init
```

:::

### 第 2 步：安裝 AI 助手

AI App Factory 必須配合 AI 助手使用，因為 Agent 定義和 Skill 檔案是 Markdown 格式的 AI 指令，需要 AI 來解讀和執行。

#### 方案 A：Claude Code（推薦）

Claude Code 是 Anthropic 官方的 AI 程式設計助手，與 AI App Factory 深度整合。

**安裝方式**：

1. 訪問 [Claude Code 官網](https://claude.ai/code)
2. 下載並安裝對應平台的應用程式
3. 完成安裝後，驗證指令是否可用：

```bash
claude --version
```

**你應該看到**：版本號輸出

```
Claude Code 1.x.x
```

#### 方案 B：OpenCode

OpenCode 是另一個支援 Agent 模式的 AI 程式設計助手。

**安裝方式**：

1. 訪問 [OpenCode 官網](https://opencode.sh)
2. 下載並安裝對應平台的應用程式
3. 如果沒有指令列工具，手動下載安裝到：

- **Windows**: `%LOCALAPPDATA%\Programs\OpenCode\`
- **macOS**: `/Applications/OpenCode.app/`
- **Linux**: `/usr/bin/opencode` 或 `/usr/local/bin/opencode`

::: info 為什麼推薦 Claude Code？

- 官方支援，與 AI App Factory 的權限系統整合最好
- 外掛安裝自動化，`factory init` 會自動設定必需的外掛
- 更好的上下文管理，節省 Token

:::
### 第 3 步：初始化第一個 Factory 專案

現在你有了一個乾淨的工廠，讓我們初始化第一個專案。

**建立專案目錄**：

```bash
mkdir my-first-app && cd my-first-app
```

**初始化 Factory 專案**：

```bash
factory init
```

**你應該看到**：

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
  .factory/
    agents/
    skills/
    policies/
    templates/
    pipeline.yaml
    config.yaml
    state.json

✓ Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

**檢查點 ✅**：確認以下檔案已建立

```bash
ls -la .factory/
```

**你應該看到**：

```
agents/
skills/
policies/
templates/
pipeline.yaml
config.yaml
state.json
```

同時，Claude Code 視窗應該會自動開啟。

::: tip 目錄必須為空

`factory init` 只能在空目錄或只包含 `.git`、`README.md` 等設定檔的目錄執行。

如果目錄中有其他檔案，會看到錯誤：

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

:::

### 第 4 步：自動安裝的外掛

`factory init` 會嘗試自動安裝兩個必需的外掛：

1. **superpowers** - Bootstrap 階段的頭腦風暴技能
2. **ui-ux-pro-max-skill** - UI 階段的設計系統（67 種樣式、96 種調色盤、100 條產業規則）

如果自動安裝失敗，你會看到警告：

```
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

::: warning 外掛安裝失敗怎麼辦？

如果在初始化時外掛安裝失敗，後續可以在 Claude Code 中手動安裝：

1. 在 Claude Code 中輸入：
   ```
   /install superpowers
   /install ui-ux-pro-max-skill
   ```

2. 或者訪問外掛市集手動安裝

:::

### 第 5 步：驗證 AI 助手權限

`factory init` 會自動產生 `.claude/settings.local.json` 檔案，設定必要的權限。

**檢查權限設定**：

```bash
cat .claude/settings.local.json
```

**你應該看到**（簡化版）：

```json
{
  "allowedCommands": [
    "read",
    "write",
    "glob",
    "bash"
  ],
  "allowedPaths": [
    ".factory/**",
    "input/**",
    "artifacts/**"
  ]
}
```

這些權限確保 AI 助手可以：
- 讀取 Agent 定義和 Skill 檔案
- 寫入產物到 `artifacts/` 目錄
- 執行必要的腳本和測試

::: danger 不要使用 --dangerously-skip-permissions

AI App Factory 產生的權限設定已經足夠安全，不要在 Claude Code 中使用 `--dangerously-skip-permissions`，這會降低安全性並可能導致越權操作。

:::
## 踩坑提醒

### ❌ Node.js 版本過低

**錯誤**：`npm install -g agent-app-factory` 安裝失敗或執行時報錯

**原因**：Node.js 版本低於 16.0.0

**解決**：升級 Node.js 到最新 LTS 版本

```bash
# 使用 nvm 升級（推薦）
nvm install --lts
nvm use --lts
```

### ❌ Claude Code 未正確安裝

**錯誤**：`factory init` 執行後提示 "Claude CLI not found"

**原因**：Claude Code 沒有正確新增到 PATH

**解決**：重新安裝 Claude Code，或者手動將可執行檔路徑新增到環境變數

- **Windows**: 新增 Claude Code 安裝目錄到 PATH
- **macOS/Linux**: 檢查 `/usr/local/bin/` 中是否有 `claude` 可執行檔

### ❌ 目錄非空

**錯誤**：`factory init` 提示 "directory is not empty"

**原因**：目錄中已有其他檔案（除 `.git`、`README.md` 等設定檔外）

**解決**：在新空目錄中初始化，或者清理現有目錄

```bash
# 清理目錄中的非設定檔
rm -rf * !(.git) !(README.md)
```

### ❌ 外掛安裝失敗

**錯誤**：`factory init` 顯示外掛安裝失敗的警告

**原因**：網路問題或 Claude Code 外掛市集暫時無法使用

**解決**：手動在 Claude Code 中安裝外掛，或者在後續管線執行時按提示安裝

```
/install superpowers
/install ui-ux-pro-max-skill
```

## 本課小結

本課完成了 AI App Factory 的完整安裝設定：

1. ✅ **CLI 工具** - 透過 `npm install -g agent-app-factory` 全域安裝
2. ✅ **AI 助手** - Claude Code 或 OpenCode，推薦 Claude Code
3. ✅ **專案初始化** - `factory init` 建立 `.factory/` 目錄並自動設定
4. ✅ **必需外掛** - superpowers 和 ui-ux-pro-max-skill（自動或手動安裝）
5. ✅ **權限設定** - 自動產生 Claude Code 權限檔案

現在你有了一個可以執行的 Factory 專案，Claude Code 視窗已經開啟，準備執行管線。

## 下一課預告

> 下一課我們學習 **[初始化 Factory 專案](../init-project/)**。
>
> 你會學到：
> - 了解 `factory init` 產生的目錄結構
> - 理解 `.factory/` 目錄中每個檔案的用途
> - 掌握如何修改專案設定
> - 學習如何查看專案狀態

準備好開始產生你的第一個應用了嗎？繼續吧！

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-29

| 功能           | 檔案路徑                                                                                           | 行號    |
| -------------- | -------------------------------------------------------------------------------------------------- | ------- |
| CLI 入口       | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)         | 1-123   |
| 初始化指令     | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)     | 1-457   |
| Node.js 需求   | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json)                    | 41      |
| Claude Code 啟動 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| OpenCode 啟動 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| 外掛安裝檢查 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L360-L392) | 360-392 |
| 權限設定產生   | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-275   |

**關鍵常數**：
- `NODE_VERSION_MIN = "16.0.0"`：最低 Node.js 版本需求（package.json:41）

**關鍵函式**：
- `getFactoryRoot()`：取得 Factory 安裝根目錄（factory.js:22-52）
- `init()`：初始化 Factory 專案（init.js:220-456）
- `launchClaudeCode()`：啟動 Claude Code（init.js:119-147）
- `launchOpenCode()`：啟動 OpenCode（init.js:152-215）
- `generateClaudeSettings()`：產生 Claude Code 權限設定

</details>
