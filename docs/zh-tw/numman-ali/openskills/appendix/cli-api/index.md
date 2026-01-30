---
title: "CLI API：指令參考 | OpenSkills"
subtitle: "CLI API：指令參考 | OpenSkills"
sidebarTitle: "指令全搞定"
description: "學習 OpenSkills 的完整命令列 API。查閱所有指令的參數、選項和使用範例，快速掌握指令用法。"
tags:
  - "API"
  - "CLI"
  - "指令參考"
  - "選項說明"
prerequisite: []
order: 1
---

# OpenSkills CLI API 參考

## 學完你能做什麼

- 了解所有 OpenSkills 指令的完整用法
- 掌握每個指令的參數和選項
- 知道如何組合使用指令完成任務

## 這是什麼

OpenSkills CLI API 參考提供了所有指令的完整文件，包括參數、選項和使用範例。這是當你需要深入了解某個指令時查閱的參考手冊。

---

## 概覽

OpenSkills CLI 提供以下指令：

```bash
openskills install <source>   # 安裝技能
openskills list                # 列出已安裝技能
openskills read <name>         # 讀取技能內容
openskills sync                # 同步到 AGENTS.md
openskills update [name...]    # 更新技能
openskills manage              # 互動式管理技能
openskills remove <name>       # 刪除技能
```

---

## install 指令

安裝技能從 GitHub、本機路徑或私有 git 儲存庫。

### 語法

```bash
openskills install <source> [options]
```

### 參數

| 參數       | 類型   | 必填 | 說明                      |
| --- | --- | --- | --- |
| `<source>` | string | Y    | 技能來源（見下方來源格式） |

### 選項

| 選項              | 簡寫 | 類型 | 預設值 | 說明                                            |
| --- | --- | --- | --- | --- |
| `--global`        | `-g`  | flag | false  | 全域安裝到 `~/.claude/skills/`                  |
| `--universal`     | `-u`  | flag | false  | 安裝到 `.agent/skills/`（多代理環境）          |
| `--yes`           | `-y`  | flag | false  | 跳過互動式選擇，安裝所有找到的技能            |

### 來源格式

| 格式                          | 範例                                    | 說明                     |
| --- | --- | --- |
| GitHub shorthand               | `anthropics/skills`                    | 從 GitHub 公開儲存庫安裝   |
| Git URL                       | `https://github.com/owner/repo.git`    | 完整 Git URL             |
| SSH Git URL                   | `git@github.com:owner/repo.git`        | SSH 私有儲存庫             |
| 本機路徑                      | `./my-skill` 或 `~/dev/skills`         | 從本機目錄安裝           |

### 範例

```bash
# 從 GitHub 安裝（互動式選擇）
openskills install anthropics/skills

# 從 GitHub 安裝（非互動式）
openskills install anthropics/skills -y

# 全域安裝
openskills install anthropics/skills --global

# 多代理環境安裝
openskills install anthropics/skills --universal

# 從本機路徑安裝
openskills install ./my-custom-skill

# 從私有儲存庫安裝
openskills install git@github.com:your-org/private-skills.git
```

### 輸出

安裝成功後會顯示：
- 安裝的技能列表
- 安裝位置（project/global）
- 提示執行 `openskills sync`

---

## list 指令

列出所有已安裝的技能。

### 語法

```bash
openskills list
```

### 參數

無。

### 選項

無。

### 範例

```bash
openskills list
```

### 輸出

```
已安裝的技能：

┌────────────────────┬────────────────────────────────────┬──────────┐
│ 技能名稱            │ 描述                                 │ 位置     │
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit             │ project  │
│ git-workflow       │ Git workflow automation              │ global   │
│ skill-creator      │ Guide for creating effective skills  │ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

統計：3 個技能（2 個專案級，1 個全域）
```

### 技能位置說明

- **project**: 安裝在 `.claude/skills/` 或 `.agent/skills/`
- **global**: 安裝在 `~/.claude/skills/` 或 `~/.agent/skills/`

---

## read 指令

讀取技能內容到標準輸出（供 AI 代理使用）。

### 語法

```bash
openskills read <skill-names...>
```

### 參數

| 參數             | 類型   | 必填 | 說明                          |
| --- | --- | --- | --- |
| `<skill-names...>` | string | Y    | 技能名稱（支援逗號分隔的列表） |

### 選項

無。

### 範例

```bash
# 讀取單個技能
openskills read pdf

# 讀取多個技能（逗號分隔）
openskills read pdf,git-workflow

# 讀取多個技能（空格分隔）
openskills read pdf git-workflow
```

### 輸出

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### 用途

此指令主要用於 AI 代理載入技能內容。使用者也可以使用它查看技能的詳細說明。

---

## sync 指令

將已安裝技能同步到 AGENTS.md（或其他檔案）。

### 語法

```bash
openskills sync [options]
```

### 參數

無。

### 選項

| 選項                | 簡寫 | 類型   | 預設值     | 說明                         |
| --- | --- | --- | --- | --- |
| `--output <path>`   | `-o`  | string | `AGENTS.md` | 輸出檔案路徑                |
| `--yes`             | `-y`  | flag   | false      | 跳過互動式選擇，同步所有技能 |

### 範例

```bash
# 同步到預設 AGENTS.md（互動式）
openskills sync

# 同步到自訂路徑
openskills sync -o .ruler/AGENTS.md

# 非互動式同步（CI/CD）
openskills sync -y

# 非互動式同步到自訂路徑
openskills sync -y -o .ruler/AGENTS.md
```

### 輸出

同步完成後會在指定檔案中生成以下內容：

```xml
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## update 指令

從來源重新整理已安裝技能。

### 語法

```bash
openskills update [skill-names...]
```

### 參數

| 參數             | 類型   | 必填 | 說明                          |
| --- | --- | --- | --- |
| `[skill-names...]` | string | N    | 技能名稱（逗號分隔），預設全部 |

### 選項

無。

### 範例

```bash
# 更新所有已安裝技能
openskills update

# 更新指定技能
openskills update pdf,git-workflow

# 更新單個技能
openskills update pdf
```

### 輸出

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### 更新規則

- 僅更新有元資料記錄的技能
- 本機路徑技能：直接從來源路徑複製
- Git 儲存庫技能：重新複製並複製
- 無元資料的技能：跳過並提示重新安裝

---

## manage 指令

互動式管理（刪除）已安裝技能。

### 語法

```bash
openskills manage
```

### 參數

無。

### 選項

無。

### 範例

```bash
openskills manage
```

### 互動式介面

```
選擇要刪除的技能：

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

操作：[↑/↓] 選擇 [空白] 切換 [Enter] 確認 [Esc] 取消
```

### 輸出

```
已刪除 1 個技能：
- skill-creator (project)
```

---

## remove 指令

刪除指定的已安裝技能（腳本化方式）。

### 語法

```bash
openskills remove <skill-name>
```

### 別名

`rm`

### 參數

| 參數           | 類型   | 必填 | 說明     |
| --- | --- | --- | --- |
| `<skill-name>` | string | Y    | 技能名稱 |

### 選項

無。

### 範例

```bash
# 刪除技能
openskills remove pdf

# 使用別名
openskills rm pdf
```

### 輸出

```
已刪除技能：pdf (project)
位置：/path/to/.claude/skills/pdf
來源：anthropics/skills
```

---

## 全域選項

以下選項適用於所有指令：

| 選項            | 簡寫 | 類型 | 預設值 | 說明            |
| --- | --- | --- | --- | --- |
| `--version`     | `-V`  | flag | -      | 顯示版本號      |
| `--help`        | `-h`  | flag | -      | 顯示說明資訊    |

### 範例

```bash
# 顯示版本
openskills --version

# 顯示全域說明
openskills --help

# 顯示特定指令說明
openskills install --help
```

---

## 技能查找優先順序

當存在多個安裝位置時，技能按以下優先順序查找（從高到低）：

1. `./.agent/skills/` - 專案級 universal
2. `~/.agent/skills/` - 全域級 universal
3. `./.claude/skills/` - 專案級
4. `~/.claude/skills/` - 全域級

**重要**：只會返回找到的第一個匹配技能（優先順序最高的）。

---

## 退出碼

| 退出碼 | 說明                        |
| --- | --- |
| 0      | 成功                        |
| 1      | 錯誤（參數錯誤、指令失敗等） |

---

## 環境變數

目前版本不支援環境變數設定。

---

## 設定檔

OpenSkills 使用以下設定檔：

- **技能元資料**：`.claude/skills/<skill-name>/.openskills.json`
  - 記錄安裝來源、時間戳記等
  - 用於 `update` 指令重新整理技能

### 元資料範例

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 下一課預告

> 下一課我們學習 **[AGENTS.md 格式規範](../agents-md-format/)**。
>
> 你會學到：
> - AGENTS.md 的 XML 標籤結構和各個標籤的含義
> - 技能列表的欄位定義和使用限制
> - OpenSkills 如何生成和更新 AGENTS.md
> - 標記方式（XML 標記和 HTML 註解標記）

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 指令         | 檔案路徑                                                                           | 行號   |
| --- | --- | --- |
| CLI 入口     | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)         | 13-80  |
| install 指令 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562  |
| list 指令    | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts)    | 1-50   |
| read 指令    | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts)    | 1-50   |
| sync 指令    | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)    | 1-101  |
| update 指令  | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173  |
| manage 指令  | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50   |
| remove 指令  | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30   |
| 類型定義     | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts)        | 1-25   |

**關鍵常數**：
- 無全域常數

**關鍵類型**：
- `Skill`: 技能資訊介面（name, description, location, path）
- `SkillLocation`: 技能位置介面（path, baseDir, source）
- `InstallOptions`: 安裝選項介面（global, universal, yes）

**關鍵函式**：
- `program.command()`: 定義指令（commander.js）
- `program.option()`: 定義選項（commander.js）
- `program.action()`: 定義指令處理函式（commander.js）

</details>
