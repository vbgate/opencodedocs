---
title: "CLI 指令參考：完整指令列表與參數 | Agent App Factory 教程"
sidebarTitle: "CLI 指令大全"
subtitle: "CLI 指令參考：完整指令列表與參數說明"
description: "Agent App Factory CLI 指令完整參考，包含 init、run、continue、status、list、reset 六個指令的參數說明和使用範例，幫助你快速掌握命令列工具。"
tags:
  - "CLI"
  - "命令列"
  - "參考"
order: 210
---

# CLI 指令參考：完整指令列表與參數說明

本章節提供 Agent App Factory CLI 工具的完整指令參考。

## 指令概覽

| 指令 | 功能 | 使用場景 |
| ----- | ---- | ---- |
| `factory init` | 初始化 Factory 專案 | 開始新專案 |
| `factory run [stage]` | 執行流水線 | 執行或繼續流水線 |
| `factory continue` | 新會話繼續 | 節省 Token，分會話執行 |
| `factory status` | 查看專案狀態 | 了解目前進度 |
| `factory list` | 列出所有專案 | 管理多個專案 |
| `factory reset` | 重置專案狀態 | 重新開始流水線 |

---

## factory init

初始化目前目錄為 Factory 專案。

### 語法

```bash
factory init [options]
```

### 參數

| 參數 | 簡寫 | 類型 | 必填 | 說明 |
| ---- | ----- | ---- | ---- | ---- |
| `--name` | `-n` | string | 否 | 專案名稱 |
| `--description` | `-d` | string | 否 | 專案描述 |

### 功能說明

執行 `factory init` 指令後，會：

1. 檢查目錄安全性（僅允許 `.git`、`.gitignore`、`README.md` 等設定檔）
2. 建立 `.factory/` 目錄
3. 複製以下檔案到 `.factory/`：
   - `agents/` - Agent 定義檔案
   - `skills/` - 技能模組
   - `policies/` - 策略文件
   - `templates/` - 設定模板
   - `pipeline.yaml` - 流水線定義
4. 產生 `config.yaml` 和 `state.json`
5. 產生 `.claude/settings.local.json`（Claude Code 權限設定）
6. 嘗試安裝必要外掛：
   - superpowers（Bootstrap 階段需要）
   - ui-ux-pro-max-skill（UI 階段需要）
7. 自動啟動 AI 助手（Claude Code 或 OpenCode）

### 範例

**初始化專案並指定名稱和描述**：

```bash
factory init --name "Todo App" --description "一個簡單的待辦事項應用"
```

**在目前目錄初始化專案**：

```bash
factory init
```

### 注意事項

- 目錄必須為空或僅包含設定檔（`.git`、`.gitignore`、`README.md`）
- 如果已存在 `.factory/` 目錄，會提示使用 `factory reset` 重置

---

## factory run

執行流水線，從目前階段或指定階段開始。

### 語法

```bash
factory run [stage] [options]
```

### 參數

| 參數 | 簡寫 | 類型 | 必填 | 說明 |
| ---- | ----- | ---- | ---- | ---- |
| `stage` | - | string | 否 | 流水線階段名稱（bootstrap/prd/ui/tech/code/validation/preview） |

### 選項

| 選項 | 簡寫 | 類型 | 說明 |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | 跳過確認提示 |

### 功能說明

執行 `factory run` 指令後，會：

1. 檢查是否為 Factory 專案
2. 讀取 `config.yaml` 和 `state.json`
3. 顯示目前流水線狀態
4. 決定目標階段（參數指定或目前階段）
5. 偵測 AI 助手類型（Claude Code / Cursor / OpenCode）
6. 產生對應助手的執行指令
7. 顯示可用階段列表和進度

### 範例

**從 bootstrap 階段開始執行流水線**：

```bash
factory run bootstrap
```

**從目前階段繼續執行**：

```bash
factory run
```

**跳過確認直接執行**：

```bash
factory run bootstrap --force
```

### 輸出範例

```
Agent Factory - Pipeline Runner

Pipeline Status:
──────────────────────────────────────
Project: Todo App
Status: Running
Current Stage: bootstrap
Completed: 

🤖 Claude Code Instructions:
──────────────────────────
This is an Agent Factory project. To execute the pipeline:

1. Read pipeline definition:
   Read(/path/to/.factory/pipeline.yaml)

2. Read orchestrator agent:
   Read(/path/to/.factory/agents/orchestrator.checkpoint.md)

3. Read project config:
   Read(/path/to/.factory/config.yaml)

Then execute the pipeline starting from: bootstrap

──────────────────────────────────────
Available stages:
  ○ bootstrap
  ○ prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

──────────────────────────────────────
Ready! Follow instructions above to continue.
```

---

## factory continue

新建會話繼續執行流水線，節省 Token。

### 語法

```bash
factory continue
```

### 功能說明

執行 `factory continue` 指令後，會：

1. 檢查是否為 Factory 專案
2. 讀取 `state.json` 取得目前狀態
3. 重新產生 Claude Code 權限設定
4. 啟動新的 Claude Code 視窗
5. 從目前階段繼續執行

### 使用場景

- 每個階段完成後，避免 Token 累積
- 每個階段獨享乾淨上下文
- 支援中斷恢復

### 範例

**繼續執行流水線**：

```bash
factory continue
```

### 注意事項

- 需要安裝 Claude Code
- 會自動啟動新的 Claude Code 視窗

---

## factory status

顯示目前 Factory 專案的詳細狀態。

### 語法

```bash
factory status
```

### 功能說明

執行 `factory status` 指令後，會顯示：

- 專案名稱、描述、路徑、建立時間
- 流水線狀態（idle/running/waiting_for_confirmation/paused/failed/completed）
- 目前階段
- 已完成的階段列表
- 各階段進度
- 輸入檔案狀態（input/idea.md）
- 產物目錄狀態（artifacts/）
- 產物檔案數量和大小

### 範例

```bash
factory status
```

### 輸出範例

```
Agent Factory - Project Status

Project:
  Name: Todo App
  Description: 一個簡單的待辦事項應用
  Path: /Users/user/Projects/todo-app
  Created: 2026-01-29T10:00:00.000Z

Pipeline:
  Status: Running
  Current Stage: prd
  Completed: bootstrap

Progress:
  ✓ bootstrap
  → prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

Input:
  File: input/idea.md
  Lines: 25
  Preview:
    # Todo App

    一個簡單的待辦事項應用...

Artifacts:
  ✓ prd (3 files, 12.5 KB)

──────────────────────────────────────
Commands:
  factory run     - Run pipeline
  factory run <stage> - Run from stage
  factory reset  - Reset pipeline state
```

---

## factory list

列出所有 Factory 專案。

### 語法

```bash
factory list
```

### 功能說明

執行 `factory list` 指令後，會：

1. 搜尋常見專案目錄（`~/Projects`、`~/Desktop`、`~/Documents`、`~`）
2. 搜尋目前目錄及其上層目錄（最多 3 層）
3. 列出所有包含 `.factory/` 目錄的專案
4. 顯示專案狀態（按執行中、等待中、失敗、完成排序）

### 範例

```bash
factory list
```

### 輸出範例

```
Agent Factory - Projects

Found 2 project(s):

◉ Todo App
  一個簡單的待辦事項應用
  Path: /Users/user/Projects/todo-app
  Stage: prd

○ Blog System
  部落格系統
  Path: /Users/user/Projects/blog
  Completed: bootstrap

──────────────────────────────────────
Work on a project: cd <path> && factory run
```

---

## factory reset

重置目前專案的流水線狀態，保留產物。

### 語法

```bash
factory reset [options]
```

### 選項

| 選項 | 簡寫 | 類型 | 說明 |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | 跳過確認 |

### 功能說明

執行 `factory reset` 指令後，會：

1. 檢查是否為 Factory 專案
2. 顯示目前狀態
3. 確認重置（除非使用 `--force`）
4. 重置 `state.json` 為初始狀態
5. 更新 `config.yaml` 的 pipeline 部分
6. 保留所有 `artifacts/` 產物

### 使用場景

- 重新從 bootstrap 階段開始
- 清除狀態錯誤
- 重新設定流水線

### 範例

**重置專案狀態**：

```bash
factory reset
```

**跳過確認直接重置**：

```bash
factory reset --force
```

### 注意事項

- 僅重置流水線狀態，產物不會被刪除
- 如果要完全刪除專案，需要手動刪除 `.factory/` 和 `artifacts/` 目錄

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-29

| 指令 | 檔案路徑 | 行號 |
| ----- | --------- | ---- |
| CLI 入口 | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 17-122 |
| init 指令 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| run 指令 | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-335 |
| continue 指令 | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |
| status 指令 | [`cli/commands/status.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/status.js) | 1-203 |
| list 指令 | [`cli/commands/list.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/list.js) | 1-160 |
| reset 指令 | [`cli/commands/reset.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/reset.js) | 1-100 |

**關鍵函式**：
- `getFactoryRoot()` - 取得 Factory 根目錄（factory.js:22-52）
- `isFactoryProject()` - 檢查是否為 Factory 專案（init.js:22-26）
- `generateConfig()` - 產生專案設定（init.js:58-76）
- `launchClaudeCode()` - 啟動 Claude Code（init.js:119-147）
- `launchOpenCode()` - 啟動 OpenCode（init.js:152-215）
- `detectAIAssistant()` - 偵測 AI 助手類型（run.js:105-124）
- `updateState()` - 更新流水線狀態（run.js:94-100）

**相依函式庫**：
- `commander` - CLI 參數解析
- `chalk` - 終端彩色輸出
- `ora` - 載入動畫
- `inquirer` - 互動式提示
- `yaml` - YAML 檔案解析
- `fs-extra` - 檔案系統操作

</details>
