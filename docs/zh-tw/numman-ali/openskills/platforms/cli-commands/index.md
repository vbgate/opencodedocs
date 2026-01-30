---
title: "命令詳解: OpenSkills CLI 參考 | openskills"
sidebarTitle: "7 個命令全掌握"
subtitle: "命令詳解: OpenSkills CLI 參考"
description: "學習 OpenSkills 的 7 個命令及參數使用。掌握 install、list、read、update、sync、manage、remove 的完整參考，提升 CLI 工具效率。"
tags:
  - "CLI"
  - "命令參考"
  - "速查表"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 1
---
# 命令詳解：OpenSkills 完整命令速查表

## 學完你能做什麼

- 熟練使用所有 7 個 OpenSkills 命令
- 理解全局選項的作用和適用場景
- 快速查找命令參數和標誌的含義
- 在腳本中使用非交互式命令

## 命令總覽

OpenSkills 提供以下 7 個命令：

| 命令 | 用途 | 使用場景 |
|--- | --- | ---|
| `install` | 安裝技能 | 從 GitHub、本地路徑或私有倉庫安裝新技能 |
| `list` | 列出技能 | 查看所有已安裝的技能及位置 |
| `read` | 讀取技能 | 讓 AI 代理加載技能內容（通常由代理自動調用） |
| `update` | 更新技能 | 從源倉庫刷新已安裝的技能 |
| `sync` | 同步 | 將技能列表寫入 AGENTS.md |
| `manage` | 管理 | 交互式刪除技能 |
| `remove` | 刪除 | 刪除指定技能（腳本化方式） |

::: info 小貼士
使用 `npx openskills --help` 可以查看所有命令的簡要說明。
:::

## 全局選項

某些命令支持以下全局選項：

| 選項 | 簡寫 | 作用 | 適用命令 |
|--- | --- | --- | ---|
| `--global` | `-g` | 安裝到全局目錄 `~/.claude/skills/` | `install` |
| `--universal` | `-u` | 安裝到通用目錄 `.agent/skills/`（多代理環境） | `install` |
| `--yes` | `-y` | 跳過交互式提示，使用默認行為 | `install`, `sync` |
| `--output <path>` | `-o <path>` | 指定輸出文件路徑 | `sync` |

## 命令詳解

### install - 安裝技能

從 GitHub 倉庫、本地路徑或私有 git 倉庫安裝技能。

```bash
openskills install <source> [options]
```

**參數**：

| 參數 | 必填 | 說明 |
|--- | --- | ---|
| `<source>` | ✅ | 技能來源（GitHub shorthand、git URL 或本地路徑） |

**選項**：

| 選項 | 簡寫 | 默認值 | 說明 |
|--- | --- | --- | ---|
| `--global` | `-g` | `false` | 安裝到全局目錄 `~/.claude/skills/` |
| `--universal` | `-u` | `false` | 安裝到通用目錄 `.agent/skills/` |
| `--yes` | `-y` | `false` | 跳過交互式選擇，安裝所有找到的技能 |

**source 參數示例**：

```bash
# GitHub shorthand（推薦）
openskills install anthropics/skills

# 指定分支
openskills install owner/repo@branch

# 私有倉庫
openskills install git@github.com:owner/repo.git

# 本地路徑
openskills install ./path/to/skill

# Git URL
openskills install https://github.com/owner/repo.git
```

**行為說明**：

- 安裝時會列出所有找到的技能供選擇
- 使用 `--yes` 可跳過選擇，安裝所有技能
- 安裝位置優先級：`--universal` → `--global` → 默認項目目錄
- 安裝後會在技能目錄創建 `.openskills.json` 元數據文件

---

### list - 列出技能

列出所有已安裝的技能。

```bash
openskills list
```

**選項**：無

**輸出格式**：

```
Available Skills:

skill-name           [description]            (project/global)
```

**行為說明**：

- 按位置排序：項目技能在前，全局技能在後
- 同一位置內按字母順序排序
- 顯示技能名稱、描述和位置標籤

---

### read - 讀取技能

讀取一個或多個技能的內容到標準輸出。這個命令主要用於 AI 代理按需加載技能。

```bash
openskills read <skill-names...>
```

**參數**：

| 參數 | 必填 | 說明 |
|--- | --- | ---|
| `<skill-names...>` | ✅ | 技能名稱列表（支持多個，空格或逗號分隔） |

**選項**：無

**示例**：

```bash
# 讀取單個技能
openskills read pdf

# 讀取多個技能
openskills read pdf git

# 逗號分隔（也支持）
openskills read "pdf,git,excel"
```

**輸出格式**：

```
Skill: pdf
Base Directory: /path/to/.claude/skills/pdf

---SKILL.md 內容---

[SKILL.END]
```

**行為說明**：

- 按 4 個目錄優先級查找技能
- 輸出技能名稱、基礎目錄路徑和完整的 SKILL.md 內容
- 未找到的技能會顯示錯誤信息

---

### update - 更新技能

從記錄的源刷新已安裝的技能。如果不指定技能名稱，則更新所有已安裝的技能。

```bash
openskills update [skill-names...]
```

**參數**：

| 參數 | 必填 | 說明 |
|--- | --- | ---|
| `[skill-names...]` | ❌ | 要更新的技能名稱列表（默認全部） |

**選項**：無

**示例**：

```bash
# 更新所有技能
openskills update

# 更新指定技能
openskills update pdf git

# 逗號分隔（也支持）
openskills update "pdf,git,excel"
```

**行為說明**：

- 只更新有元數據的技能（即通過 install 安裝的技能）
- 跳過無元數據的技能並提示
- 更新成功後更新安裝時間戳
- 從 git 倉庫更新時使用淺克隆（`--depth 1`）

---

### sync - 同步到 AGENTS.md

將已安裝的技能同步到 AGENTS.md（或其他自定義文件），生成 AI 代理可用的技能列表。

```bash
openskills sync [options]
```

**選項**：

| 選項 | 簡寫 | 默認值 | 說明 |
|--- | --- | --- | ---|
| `--output <path>` | `-o <path>` | `AGENTS.md` | 輸出文件路徑 |
| `--yes` | `-y` | `false` | 跳過交互式選擇，同步所有技能 |

**示例**：

```bash
# 同步到默認文件
openskills sync

# 同步到自定義文件
openskills sync -o .ruler/AGENTS.md

# 跳過交互式選擇
openskills sync -y
```

**行為說明**：

- 解析現有文件並預選已啟用的技能
- 首次同步默認選中項目技能
- 生成 Claude Code 兼容的 XML 格式
- 支持在現有文件中替換或追加技能部分

---

### manage - 管理技能

交互式刪除已安裝的技能。提供友好的刪除界面。

```bash
openskills manage
```

**選項**：無

**行為說明**：

- 顯示所有已安裝的技能供選擇
- 默認不選中任何技能
- 選擇後立即刪除，無需二次確認

---

### remove - 刪除技能

刪除指定的已安裝技能（腳本化方式）。如果在腳本中使用，比 `manage` 更方便。

```bash
openskills remove <skill-name>
```

**參數**：

| 參數 | 必填 | 說明 |
|--- | --- | ---|
| `<skill-name>` | ✅ | 要刪除的技能名稱 |

**選項**：無

**示例**：

```bash
openskills remove pdf

# 也可以使用別名
openskills rm pdf
```

**行為說明**：

- 刪除整個技能目錄（包括所有文件和子目錄）
- 顯示刪除位置和來源
- 未找到技能時顯示錯誤並退出

## 快捷操作速查表

| 任務 | 命令 |
|--- | ---|
| 查看所有已安裝技能 | `openskills list` |
| 安裝官方技能 | `openskills install anthropics/skills` |
| 從本地路徑安裝 | `openskills install ./my-skill` |
| 全局安裝技能 | `openskills install owner/skill --global` |
| 更新所有技能 | `openskills update` |
| 更新特定技能 | `openskills update pdf git` |
| 交互式刪除技能 | `openskills manage` |
| 刪除指定技能 | `openskills remove pdf` |
| 同步到 AGENTS.md | `openskills sync` |
| 自定義輸出路徑 | `openskills sync -o custom.md` |

## 踩坑提醒

### 1. 命令找不到

**問題**：執行命令時提示 "command not found"

**原因**：
- Node.js 未安裝或版本過低（需要 20.6+）
- 未使用 `npx` 或未全局安裝

**解決**：
```bash
# 使用 npx（推薦）
npx openskills list

# 或全局安裝
npm install -g openskills
```

### 2. 技能未找到

**問題**：`openskills read skill-name` 提示 "Skill not found"

**原因**：
- 技能未安裝
- 技能名稱拼寫錯誤
- 技能安裝位置不在搜索路徑中

**解決**：
```bash
# 檢查已安裝技能
openskills list

# 查看技能目錄
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

### 3. 更新失敗

**問題**：`openskills update` 提示 "No metadata found"

**原因**：
- 技能未通過 `install` 命令安裝
- 元數據文件 `.openskills.json` 被刪除

**解決**：重新安裝技能
```bash
openskills install <original-source>
```

## 本課小結

OpenSkills 提供了完整的命令行接口，涵蓋技能的安裝、列表、讀取、更新、同步和管理。掌握這些命令是高效使用 OpenSkills 的基礎：

- `install` - 安裝新技能（支持 GitHub、本地、私有倉庫）
- `list` - 查看已安裝技能
- `read` - 讀取技能內容（AI 代理使用）
- `update` - 更新已安裝技能
- `sync` - 同步到 AGENTS.md
- `manage` - 交互式刪除技能
- `remove` - 刪除指定技能

記住全局選項的作用：
- `--global` / `--universal` - 控制安裝位置
- `--yes` - 跳過交互式提示（適合 CI/CD）
- `--output` - 自定義輸出文件路徑

## 下一課預告

> 下一課我們學習 **[安裝來源詳解](../install-sources/)**。
>
> 你會學到：
> - 三種安裝方式的詳細用法
> - 每種方式的適用場景
> - 私有倉庫的配置方法
