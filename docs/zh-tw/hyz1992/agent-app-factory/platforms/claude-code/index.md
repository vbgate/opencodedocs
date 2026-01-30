---
title: "Claude Code 整合：設定權限執行流水線 | AI App Factory 教學"
sidebarTitle: "5 分鐘設定 Claude Code"
subtitle: "Claude Code 整合：設定權限執行流水線 | AI App Factory 教學"
description: "學習如何設定 Claude Code 權限，安全執行 AI App Factory 流水線。了解自動產生 settings.local.json 的方法、白名單機制和跨平台權限設定最佳實踐，避免使用危險的 --dangerously-skip-permissions 參數。本教學涵蓋 Windows/macOS/Linux 路徑處理和常見權限錯誤排查。"
tags:
  - "Claude Code"
  - "權限設定"
  - "AI 助理"
prerequisite:
  - "start-installation"
  - "start-init-project"
order: 50
---

# Claude Code 整合：設定權限執行流水線 | AI App Factory 教學

## 學完你能做什麼

- 設定 Claude Code 的安全權限，無需使用 `--dangerously-skip-permissions`
- 理解 Factory 自動產生的權限白名單
- 在 Claude Code 中執行完整的 7 階段流水線
- 掌握跨平台權限設定（Windows/macOS/Linux）

## 你現在的困境

第一次使用 Factory 時，你可能會遇到：

- **權限被阻擋**：Claude Code 提示「沒有權限讀取檔案」
- **使用危險參數**：被迫加上 `--dangerously-skip-permissions` 繞過安全檢查
- **手動設定麻煩**：不知道應該允許哪些操作
- **跨平台問題**：Windows 和 Unix 路徑權限不一致

其實，Factory 會**自動產生**完整的權限設定，你只需要正確使用即可。

## 什麼時候用這一招

當你需要在 Claude Code 中執行 Factory 流水線時：

- 使用 `factory init` 初始化專案後（自動啟動）
- 使用 `factory run` 繼續流水線時
- 手動啟動 Claude Code 時

::: info 為什麼推薦 Claude Code？
Claude Code 是 Anthropic 官方的 AI 程式設計助理，� Factory 的權限系統深度整合。相比其他 AI 助理，Claude Code 的權限管理更精細、更安全。
:::

## 核心思路

Factory 的權限設定採用**白名單機制**：只明確允許的操作，其他一律禁止。

### 權限白名單的類別

| 類別 | 允許的操作 | 用途 |
| --- | --- | --- |
| **檔案操作** | Read/Write/Edit/Glob | 讀取和修改專案檔案 |
| **Git 操作** | git add/commit/push 等 | 版本控制 |
| **目錄操作** | ls/cd/tree/pwd | 瀏覽目錄結構 |
| **建構工具** | npm/yarn/pnpm | 安裝依賴、執行腳本 |
| **TypeScript** | tsc/npx tsc | 類型檢查 |
| **資料庫** | npx prisma | 資料庫遷移和管理 |
| **Python** | python/pip | UI 設計系統 |
| **測試** | vitest/jest/test | 執行測試 |
| **Factory CLI** | factory init/run/continue | 流水線命令 |
| **Docker** | docker compose | 容器化部署 |
| **Web 操作** | WebFetch(domain:...) | 取得 API 文件 |
| **Skills** | superpowers/ui-ux-pro-max | 外掛技能 |

### 為什麼不用 `--dangerously-skip-permissions`？

| 方式 | 安全性 | 推薦 |
| --- | --- | --- |
| `--dangerously-skip-permissions` | ❌ 允許 Claude 任意操作（包括刪除檔案） | 不推薦 |
| 白名單設定 | ✅ 只允許明確的操作，越權會提示錯誤 | 推薦 |

白名單設定雖然初始設定複雜，但一次產生後自動複用，更安全。

## 🎒 開始前的準備

在開始前，請確認：

- [x] 已完成 **安裝與設定**（[start/installation/](../../start/installation/)）
- [x] 已完成 **初始化 Factory 專案**（[start/init-project/](../../start/init-project/)）
- [x] 已安裝 Claude Code：https://claude.ai/code
- [x] 專案目錄已初始化（存在 `.factory/` 目錄）

::: warning 檢查 Claude Code 是否安裝
在終端機執行以下命令確認：

```bash
claude --version
```

如果提示「command not found」，請先安裝 Claude Code。
:::

## 跟我做

### 第 1 步：初始化專案（自動產生權限）

**為什麼**：`factory init` 會自動產生 `.claude/settings.local.json`，包含完整的權限白名單。

在專案目錄中執行：

```bash
# 建立新目錄並進入
mkdir my-factory-project && cd my-factory-project

# 初始化 Factory 專案
factory init
```

**你應該看到**：

```
✓ Factory project initialized!
✓ Claude Code is starting...
  (Please wait for window to open)
```

Claude Code 視窗會自動開啟，並顯示以下提示：

```
請閱讀.factory/pipeline.yaml和.factory/agents/orchestrator.checkpoint.md，
啟動流水線，幫我將產品想法碎片轉化為可執行的應用，
接下來我將會輸入想法碎片。注意：Agent引用的skills/和policies/
檔案需要先查找.factory/目錄，再查找根目錄。
```

**發生了什麼**：

1. 建立 `.factory/` 目錄，包含流水線設定
2. 產生 `.claude/settings.local.json`（權限白名單）
3. 自動啟動 Claude Code，並傳入啟動提示

### 第 2 步：驗證權限設定

**為什麼**：確認權限檔案已正確產生，避免執行時遇到權限問題。

檢查產生的權限檔案：

```bash
# 檢視權限檔案內容
cat .claude/settings.local.json
```

**你應該看到**（部分內容）：

```json
{
  "permissions": {
    "allow": [
      "Read(/path/to/project/**)",
      "Write(/path/to/project/**)",
      "Glob(/path/to/project/**)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(npm install:*)",
      "Bash(npx prisma generate:*)",
      "Skill(superpowers:brainstorming)",
      "Skill(ui-ux-pro-max)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.org)"
    ]
  },
  "features": {
    "autoSave": true,
    "telemetry": false
  }
}
```

::: tip 路徑說明
權限中的路徑會根據你的作業系統自動調整：

- **Windows**：`Read(//c/Users/...)`（盤符小寫和大寫都支援）
- **macOS/Linux**：`Read(/Users/...)`（絕對路徑）
:::

### 第 3 步：在 Claude Code 中啟動流水線

**為什麼**：Claude Code 已設定好權限，可以直接讀取 Agent 定義和 Skill 檔案。

在已開啟的 Claude Code 視窗中，輸入你的產品想法：

```
我想做一個行動端記帳應用，幫助年輕人快速記錄日常支出，
避免月底超支。主要功能是記錄金額、選擇分類（飲食、交通、娛樂、其他），
查看本月總支出。
```

**你應該看到**：

Claude Code 會執行以下步驟（自動完成）：

1. 讀取 `.factory/pipeline.yaml`
2. 讀取 `.factory/agents/orchestrator.checkpoint.md`
3. 開始 **Bootstrap 階段**，將你的想法結構化為 `input/idea.md`
4. 完成後暫停，等待你確認

**檢查點 ✅**：確認 Bootstrap 階段已完成

```bash
# 檢視產生的結構化想法
cat input/idea.md
```

### 第 4 步：繼續流水線

**為什麼**：每個階段完成後，需要手動確認，避免錯誤累積。

在 Claude Code 中回覆：

```
繼續
```

Claude Code 會自動進入下一個階段（PRD），並重複「執行→暫停→確認」的流程，直到完成所有 7 個階段。

::: tip 使用 `factory run` 重新啟動
如果 Claude Code 視窗關閉了，你可以在終端機執行：

```bash
factory run
```

這會重新顯示 Claude Code 的執行指令。
:::

### 第 5 步：跨平台權限處理（Windows 使用者）

**為什麼**：Windows 路徑權限需要特殊處理，確保 Claude Code 能正確存取專案檔案。

如果你使用的是 Windows，`factory init` 會自動產生支援盤符的權限：

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Read(//C/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)",
      "Write(//C/Users/yourname/project/**)"
    ]
  }
}
```

**檢查點 ✅**：Windows 使用者驗證權限

```powershell
# PowerShell
Get-Content .claude\settings.local.json | Select-String -Pattern "Read|Write"
```

如果看到 `//c/` 和 `//C/` 兩種路徑格式，說明已正確設定。

## 檢查點 ✅

完成上述步驟後，你應該能夠：

- [x] 找到 `.claude/settings.local.json` 檔案
- [x] 看到完整的權限白名單（包含 Read/Write/Bash/Skill/WebFetch）
- [x] 在 Claude Code 中成功啟動 Bootstrap 階段
- [x] 檢視 `input/idea.md` 確認想法已結構化
- [x] 繼續執行流水線到下一個階段

如果遇到權限錯誤，請查看下方的「踩坑提醒」。

## 踩坑提醒

### 問題 1：權限被阻擋

**錯誤提示**：
```
Permission denied: Read(path/to/file)
```

**原因**：
- 權限檔案產生失敗或路徑不正確
- Claude Code 使用了舊的權限快取

**解決方案**：

1. 檢查權限檔案是否存在：

```bash
ls -la .claude/settings.local.json
```

2. 重新產生權限：

```bash
# 刪除舊的權限檔案
rm .claude/settings.local.json

# 重新初始化（會重新產生）
factory init --force
```

3. 重新啟動 Claude Code，清除快取。

### 問題 2：`--dangerously-skip-permissions` 警告

**錯誤提示**：
```
Using --dangerously-skip-permissions is not recommended.
```

**原因**：
- 未找到 `.claude/settings.local.json`
- 權限檔案格式錯誤

**解決方案**：

檢查權限檔案格式（JSON 語法）：

```bash
# 驗證 JSON 格式
python -m json.tool .claude/settings.local.json
```

如果提示語法錯誤，刪除檔案後重新執行 `factory init`。

### 問題 3：Windows 路徑權限不生效

**錯誤提示**：
```
Permission denied: Read(C:\Users\yourname\project\file.js)
```

**原因**：
- 權限設定中缺少盤符路徑
- 路徑格式不正確（Windows 需要使用 `//c/` 格式）

**解決方案**：

手動編輯 `.claude\settings.local.json`，新增盤符路徑：

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)"
    ]
  }
}
```

注意盤符大小寫都要支援（`//c/` 和 `//C/`）。

### 問題 4：Skills 權限被阻擋

**錯誤提示**：
```
Permission denied: Skill(superpowers:brainstorming)
```

**原因**：
- 未安裝必需的 Claude Code 外掛（superpowers、ui-ux-pro-max）
- 外掛版本不相容

**解決方案**：

1. 新增外掛市集：

```bash
# 新增 superpowers 外掛市集
claude plugin marketplace add obra/superpowers-marketplace
```

2. 安裝 superpowers 外掛：

```bash
claude plugin install superpowers@superpowers-marketplace
```

3. 新增 ui-ux-pro-max 外掛市集：

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

4. 安裝 ui-ux-pro-max 外掛：

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

5. 重新執行流水線。

::: info Factory 會自動嘗試安裝外掛
`factory init` 命令會自動嘗試安裝這些外掛。如果失敗，請手動安裝。
:::

## 本課小結

- **權限白名單**比 `--dangerously-skip-permissions` 更安全
- **`factory init`** 會自動產生 `.claude/settings.local.json`
- 權限設定包含 **檔案操作、Git、建構工具、資料庫、Web 操作** 等類別
- **跨平台支援**：Windows 使用 `//c/` 路徑，Unix 使用絕對路徑
- **手動安裝外掛**：如果自動安裝失敗，需要在 Claude Code 中手動安裝 superpowers 和 ui-ux-pro-max

## 下一課預告

> 下一課我們學習 **[OpenCode 與其他 AI 助理](../other-ai-assistants/)**。
>
> 你會學到：
> - 如何在 OpenCode 中執行 Factory 流水線
> - Cursor、GitHub Copilot 等其他 AI 助理的整合方法
> - 不同助理的權限設定差異

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-29

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 權限設定產生 | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-292 |
| 自動啟動 Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| AI 助理偵測 | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 105-124 |
| Claude Code 指令產生 | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 138-156 |
| 跨平台路徑處理 | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 14-67 |

**關鍵函數**：
- `generatePermissions(projectDir)`：產生完整的權限白名單，包含 Read/Write/Bash/Skill/WebFetch 等操作
- `generateClaudeSettings(projectDir)`：產生並寫入 `.claude/settings.local.json` 檔案
- `launchClaudeCode(projectDir)`：啟動 Claude Code 視窗並傳入啟動提示
- `detectAIAssistant()`：偵測目前執行的 AI 助理類型（Claude Code/Cursor/OpenCode）

**關鍵常數**：
- Windows 路徑模式：`Read(//c/**)`、`Write(//c/**)`（支援盤符小寫和大寫）
- Unix 路徑模式：`Read(/path/to/project/**)`、`Write(/path/to/project/**)`
- Skills 權限：`'Skill(superpowers:brainstorming)'`、`'Skill(ui-ux-pro-max)'`

**權限白名單類別**：
- **檔案操作**：Read/Write/Glob（支援萬用字元）
- **Git 操作**：git add/commit/push/pull 等（完整 Git 命令集）
- **建構工具**：npm/yarn/pnpm install/build/test/dev
- **TypeScript**：tsc/npx tsc/npx type-check
- **資料庫**：npx prisma validate/generate/migrate/push
- **Python**：python/pip install（用於 ui-ux-pro-max）
- **測試**：vitest/jest/test
- **Factory CLI**：factory init/run/continue/status/reset
- **Docker**：docker compose/ps/build/run
- **Web 操作**：WebFetch(domain:github.com) 等（指定網域白名單）

</details>
