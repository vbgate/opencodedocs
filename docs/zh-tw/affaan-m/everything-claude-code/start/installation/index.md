---
title: "安裝：外掛與手動 | Everything Claude Code"
sidebarTitle: "5 分鐘完成安裝"
subtitle: "安裝：外掛與手動"
description: "學習 Everything Claude Code 的兩種安裝方式。外掛市場一鍵安裝最快，手動安裝支援精確配置元件。"
tags:
  - "installation"
  - "plugin"
  - "setup"
prerequisite:
  - "start-quickstart"
order: 20
---

# 安裝指南：外掛市場 vs 手動安裝

## 學完你能做什麼

本教程完成後，你將能夠：

- 透過外掛市場一鍵安裝 Everything Claude Code
- 手動選擇需要的元件進行精細化配置
- 正確配置 MCP 伺服器和 Hooks
- 驗證安裝是否成功

## 你現在的困境

想要快速上手 Everything Claude Code，但不知道應該：

- 用外掛市場一鍵安裝，還是手動控制每個元件？
- 如何避免配置錯誤導致功能無法使用？
- 手動安裝時需要複製哪些檔案到哪些位置？

## 什麼時候用這一招

| 場景 | 推薦方式 | 原因 |
| --- | --- | --- |
| 第一次使用 | 外掛市場安裝 | 最簡單，5 分鐘搞定 |
| 想試用特定功能 | 外掛市場安裝 | 完整體驗後再決定 |
| 有特定需求 | 手動安裝 | 精確控制每個元件 |
| 已有自訂配置 | 手動安裝 | 避免覆蓋現有設定 |

## 核心思路

Everything Claude Code 提供兩種安裝方式：

1. **外掛市場安裝**（推薦）
   - 適合大多數使用者
   - 自動處理所有依賴
   - 一條指令完成安裝

2. **手動安裝**
   - 適合有特定需求的使用者
   - 精確控制安裝哪些元件
   - 需要手動配置

無論選擇哪種方式，最終都會將配置檔案複製到 `~/.claude/` 目錄下，讓 Claude Code 識別和使用這些元件。

## 🎒 開始前的準備

::: warning 前置條件

開始前請確認：
- [ ] 已安裝 Claude Code
- [ ] 有存取 GitHub 的網路連線
- [ ] 了解基本的命令列操作（如果選擇手動安裝）

:::

---

## 跟我做

### 方式一：外掛市場安裝（推薦）

這是最簡單的方式，適合第一次使用或想要快速體驗的使用者。

#### 第 1 步：新增外掛市場

**為什麼**
將 GitHub 倉庫註冊為 Claude Code 的外掛市場，才能安裝其中的外掛。

在 Claude Code 中輸入：

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**你應該看到**：
```
Successfully added marketplace affaan-m/everything-claude-code
```

#### 第 2 步：安裝外掛

**為什麼**
從剛新增的市場中安裝 Everything Claude Code 外掛。

在 Claude Code 中輸入：

```bash
/plugin install everything-claude-code@everything-claude-code
```

**你應該看到**：
```
Successfully installed everything-claude-code@everything-claude-code
```

::: tip 檢查點 ✅

驗證外掛是否已安裝：

```bash
/plugin list
```

你應該在輸出中看到 `everything-claude-code@everything-claude-code`。

:::

#### 第 3 步（可選）：直接配置 settings.json

**為什麼**
如果你想跳過命令列，直接修改配置檔案。

開啟 `~/.claude/settings.json`，新增以下內容：

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  },
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**你應該看到**：
- 配置檔案更新後，Claude Code 會自動載入外掛
- 所有 agents、skills、commands 和 hooks 立即生效

---

### 方式二：手動安裝

適合想要精確控制安裝哪些元件的使用者。

#### 第 1 步：複製倉庫

**為什麼**
取得 Everything Claude Code 的所有原始檔案。

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
```

**你應該看到**：
```
Cloning into 'everything-claude-code'...
remote: Enumerating objects...
```

#### 第 2 步：複製 agents

**為什麼**
將專業化子代理複製到 Claude Code 的 agents 目錄。

```bash
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

**你應該看到**：
- `~/.claude/agents/` 目錄下新增了 9 個 agent 檔案

::: tip 檢查點 ✅

驗證 agents 是否已複製：

```bash
ls ~/.claude/agents/
```

你應該看到類似：
```
planner.md architect.md tdd-guide.md code-reviewer.md ...
```

:::

#### 第 3 步：複製 rules

**為什麼**
將強制性規則複製到 Claude Code 的 rules 目錄。

```bash
cp everything-claude-code/rules/*.md ~/.claude/rules/
```

**你應該看到**：
- `~/.claude/rules/` 目錄下新增了 8 個規則檔案

#### 第 4 步：複製 commands

**為什麼**
將斜線指令複製到 Claude Code 的 commands 目錄。

```bash
cp everything-claude-code/commands/*.md ~/.claude/commands/
```

**你應該看到**：
- `~/.claude/commands/` 目錄下新增了 14 個指令檔案

#### 第 5 步：複製 skills

**為什麼**
將工作流定義和領域知識複製到 Claude Code 的 skills 目錄。

```bash
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

**你應該看到**：
- `~/.claude/skills/` 目錄下新增了 11 個技能目錄

#### 第 6 步：配置 hooks

**為什麼**
將自動化鉤子配置新增到 Claude Code 的 settings.json。

複製 `hooks/hooks.json` 的內容到你的 `~/.claude/settings.json`：

```bash
cat everything-claude-code/hooks/hooks.json
```

將輸出內容新增到 `~/.claude/settings.json` 中，格式如下：

```json
{
  "hooks": [
    {
      "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
      "hooks": [
        {
          "type": "command",
          "command": "#!/bin/bash\ngrep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
        }
      ]
    }
  ]
}
```

**你應該看到**：
- 編輯 TypeScript/JavaScript 檔案時，如果有 `console.log` 會出現警告

::: warning 重要提醒

確保 `hooks` 陣列不會覆蓋 `~/.claude/settings.json` 中已有的配置。如果有現有 hooks，需要合併。

:::

#### 第 7 步：配置 MCP 伺服器

**為什麼**
擴展 Claude Code 的外部服務整合能力。

從 `mcp-configs/mcp-servers.json` 中選擇你需要的 MCP 伺服器，新增到 `~/.claude.json`：

```bash
cat everything-claude-code/mcp-configs/mcp-servers.json
```

將需要的配置複製到 `~/.claude.json` 中，例如：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

::: danger 重要：替換佔位符

必須將 `YOUR_*_HERE` 佔位符替換為你的實際 API Key，否則 MCP 伺服器無法工作。

:::

::: tip MCP 使用建議

**不要啟用所有 MCP！** 太多的 MCP 會佔用大量上下文視窗。

- 建議配置 20-30 個 MCP 伺服器
- 每個專案保持 10 個以下啟用
- 保持 80 個以下的工具活躍

使用 `disabledMcpServers` 在專案配置中停用不需要的 MCP：

```json
{
  "disabledMcpServers": ["firecrawl", "supabase"]
}
```

:::

---

## 檢查點 ✅

### 驗證外掛市場安裝

```bash
/plugin list
```

你應該看到 `everything-claude-code@everything-claude-code` 已啟用。

### 驗證手動安裝

```bash
# 檢查 agents
ls ~/.claude/agents/ | head -5

# 檢查 rules
ls ~/.claude/rules/ | head -5

# 檢查 commands
ls ~/.claude/commands/ | head -5

# 檢查 skills
ls ~/.claude/skills/ | head -5
```

你應該看到：
- agents 目錄下有 `planner.md`、`tdd-guide.md` 等
- rules 目錄下有 `security.md`、`coding-style.md` 等
- commands 目錄下有 `tdd.md`、`plan.md` 等
- skills 目錄下有 `coding-standards`、`backend-patterns` 等

### 驗證功能是否可用

在 Claude Code 中輸入：

```bash
/tdd
```

你應該看到 TDD Guide agent 開始工作。

---

## 踩坑提醒

### 常見錯誤 1：外掛安裝後不生效

**症狀**：安裝外掛後，指令無法使用。

**原因**：外掛未正確載入。

**解決方案**：
```bash
# 檢查外掛清單
/plugin list

# 如果未啟用，手動啟用
/plugin enable everything-claude-code@everything-claude-code
```

### 常見錯誤 2：MCP 伺服器連線失敗

**症狀**：MCP 功能無法使用，報錯連線失敗。

**原因**：API Key 未替換或格式錯誤。

**解決方案**：
- 檢查 `~/.claude.json` 中所有 `YOUR_*_HERE` 佔位符是否已替換
- 驗證 API Key 是否有效
- 確認 MCP 伺服器指令路徑正確

### 常見錯誤 3：hooks 不觸發

**症狀**：編輯檔案時沒有看到 hooks 提示。

**原因**：`~/.claude/settings.json` 中 hooks 配置格式錯誤。

**解決方案**：
- 檢查 `hooks` 陣列格式是否正確
- 確保 `matcher` 表達式語法正確
- 驗證 hook 指令路徑是否可執行

### 常見錯誤 4：檔案權限問題（手動安裝）

**症狀**：複製檔案時報錯 "Permission denied"。

**原因**：`~/.claude/` 目錄權限不足。

**解決方案**：
```bash
# 確保 .claude 目錄存在且有權限
mkdir -p ~/.claude/{agents,rules,commands,skills}

# 使用 sudo（僅必要時）
sudo cp -r everything-claude-code/agents/*.md ~/.claude/agents/
```

---

## 本課小結

**兩種安裝方式對比**：

| 特性 | 外掛市場安裝 | 手動安裝 |
| --- | --- | --- |
| 速度 | ⚡ 快 | 🐌 慢 |
| 難度 | 🟢 簡單 | 🟡 中等 |
| 靈活性 | 🔒 固定 | 🔓 自訂 |
| 推薦場景 | 初學者、快速體驗 | 進階使用者、特定需求 |

**核心要點**：
- 外掛市場安裝是最簡單的方式，一條指令搞定
- 手動安裝適合需要精確控制元件的使用者
- MCP 配置時記得替換佔位符，不要啟用太多
- 驗證安裝時檢查目錄結構和指令可用性

---

## 下一課預告

> 下一課我們學習 **[套件管理器配置：自動化檢測與自訂](../package-manager-setup/)**。
>
> 你會學到：
> - Everything Claude Code 如何自動檢測套件管理器
> - 6 種檢測優先順序的工作機制
> - 如何自訂專案級和使用者級套件管理器配置
> - 使用 `/setup-pm` 指令快速配置

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 外掛中繼資料 | [`source/affaan-m/everything-claude-code/.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| 市場清單 | [`source/affaan-m/everything-claude-code/.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45 |
| 安裝指南 | [`source/affaan-m/everything-claude-code/README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 175-242 |
| Hooks 配置 | [`source/affaan-m/everything-claude-code/hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-146 |
| MCP 配置 | [`source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-95 |

**關鍵配置**：
- 外掛名稱：`everything-claude-code`
- 倉庫：`affaan-m/everything-claude-code`
- 授權：MIT
- 支援 9 個 agents、14 個 commands、8 套 rules、11 個 skills

**安裝方式**：
1. 外掛市場安裝：`/plugin marketplace add` + `/plugin install`
2. 手動安裝：複製 agents、rules、commands、skills 到 `~/.claude/`

</details>
