---
title: "建立技能: 編寫 SKILL.md | openskills"
sidebarTitle: "寫一個技能"
subtitle: "建立技能: 編寫 SKILL.md"
description: "學習從零建立自訂技能，掌握 SKILL.md 格式和 YAML frontmatter 規範。透過完整範例和符號連結開發流程，快速上手技能創作，確保符合 Anthropic 標準。"
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "start-quick-start"
  - "start-first-skill"
order: 4
---

# 建立自訂技能

## 學完你能做什麼

- 從零建立一個完整的 SKILL.md 技能檔案
- 編寫符合 Anthropic 標準的 YAML frontmatter
- 設計合理的技能目錄結構（references/、scripts/、assets/）
- 使用符號連結進行本地開發和迭代
- 透過 `openskills` 指令安裝和驗證自訂技能

## 你現在的困境

你想讓 AI 代理幫你解決特定問題，但現有技能庫中沒有合適的方案。你嘗試在對話中反覆描述需求，但 AI 總是記不住或執行不完整。你需要一種方式來**封裝專業知識**，讓 AI 代理能夠穩定、可靠地複用。

## 什麼時候用這一招

- **封裝工作流程**：將重複性的操作步驟寫成技能，讓 AI 一次執行到位
- **團隊知識沉澱**：把團隊內部的規範、API 文件、腳本打包成技能，共享給所有成員
- **工具整合**：為特定工具（如 PDF 處理、資料清洗、部署流程）建立專用技能
- **本地開發**：在開發中即時修改和測試技能，無需反覆安裝

## 🎒 開始前的準備

::: warning 前置檢查

在開始前，請確保：

- ✅ 已安裝 [OpenSkills](/start/installation/)
- ✅ 已安裝並同步過至少一個技能（了解基本流程）
- ✅ 熟悉 Markdown 基礎語法

:::

## 核心思路

### 什麼是 SKILL.md？

**SKILL.md** 是 Anthropic 技能系統的標準格式，用 YAML frontmatter 描述技能後設資料，用 Markdown 正文提供執行指令。它有三個核心優勢：

1. **統一的格式** - 所有代理（Claude Code、Cursor、Windsurf 等）使用相同的技能描述
2. **漸進式載入** - 只在需要時載入完整內容，保持 AI 上下文精簡
3. **可打包資源** - 支援 references/、scripts/、assets/ 三類附加資源

### 最小 vs 完整結構

**最小結構**（適合簡單技能）：
```
my-skill/
└── SKILL.md          # 只有一個檔案
```

**完整結構**（適合複雜技能）：
```
my-skill/
├── SKILL.md          # 核心指令（< 5000 詞）
├── references/       # 詳細文件（按需載入）
│   └── api-docs.md
├── scripts/          # 可執行腳本
│   └── helper.py
└── assets/           # 範本和輸出檔案
    └── template.json
```

::: info 什麼時候用完整結構？

- **references/**：當 API 文件、資料庫 schema、詳細指南超過 5000 詞時
- **scripts/**：當需要執行確定性的、可重複的任務時（如資料轉換、格式化）
- **assets/**：當需要輸出範本、圖片、樣板程式碼時

:::

## 跟我做

### 第 1 步：建立技能目錄

**為什麼**：建立獨立目錄來組織技能檔案

```bash
mkdir my-skill
cd my-skill
```

**你應該看到**：當前目錄為空

---

### 第 2 步：編寫 SKILL.md 核心結構

**為什麼**：SKILL.md 必須以 YAML frontmatter 開頭，定義技能後設資料

建立 `SKILL.md` 檔案：

```markdown
---
name: my-skill                    # 必需：連字元格式的識別碼
description: When to use this skill.  # 必需：1-2 句話，第三人稱
---

# 技能標題

技能的詳細說明。
```

**驗證點**：

- ✅ 第一行是 `---`
- ✅ 包含 `name` 欄位（連字元格式，如 `pdf-editor`、`api-client`）
- ✅ 包含 `description` 欄位（1-2 句話，用第三人稱）
- ✅ 結束 YAML 後再次使用 `---`

::: danger 常見錯誤

| 錯誤範例 | 修正方法 |
|---|---|
| `name: My Skill`（空格） | 改為 `name: my-skill`（連字元） |
| `description: You should use this for...`（第二人稱） | 改為 `description: Use this skill for...`（第三人稱） |
| `description` 太長（超過 100 詞） | 精簡為 1-2 句話的概述 |

:::

---

### 第 3 步：編寫指令內容

**為什麼**：指令告訴 AI 代理如何執行任務，必須使用 imperative/infinitive 形式

繼續編輯 `SKILL.md`：

```markdown
---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill

## When to Use

Load this skill when:
- Demonstrating instruction writing patterns
- Understanding imperative/infinitive form
- Learning SKILL.md format

## Instructions

To execute this skill:

1. Read the user's input
2. Process the data
3. Return the result

For detailed information, see references/guide.md
```

**寫作規範**：

| ✅ 正確寫法（imperative/infinitive） | ❌ 錯誤寫法（second person） |
|---|---|
| "To accomplish X, execute Y"        | "You should do X"          |
| "Load this skill when Z"            | "If you need Y"            |
| "See references/guide.md"           | "When you want Z"           |

::: tip 口訣

**指令寫作三原則**：
1. **動詞開頭**："Create" → "Use" → "Return"
2. **省略 "You"**：不說 "You should"
3. **明確路徑**：引用資源用 `references/` 開頭

:::

---

### 第 4 步：新增 Bundled Resources（可選）

**為什麼**：當技能需要大量詳細文件或可執行腳本時，使用 bundled resources 保持 SKILL.md 簡潔

#### 4.1 新增 references/

```bash
mkdir references
```

建立 `references/api-docs.md`：

```markdown
# API Documentation

## Overview

This section provides detailed API information...

## Endpoints

### GET /api/data

Returns processed data.

Response:
```json
{
  "status": "success",
  "data": [...]
}
```
```

在 `SKILL.md` 中引用：

```markdown
## Instructions

To fetch data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format
3. Process the result
```

#### 4.2 新增 scripts/

```bash
mkdir scripts
```

建立 `scripts/process.py`：

```python
#!/usr/bin/env python3
import sys

def main():
    # Processing logic
    print("Processing complete")

if __name__ == "__main__":
    main()
```

在 `SKILL.md` 中引用：

```markdown
## Instructions

To process data:

1. Execute the script:
   ```bash
   python scripts/process.py
   ```
2. Review the output
```

::: info scripts/ 的優勢

- **不載入到上下文**：節省 token，適合大檔案
- **可獨立執行**：AI 代理可以直接呼叫，無需先載入內容
- **適合確定性任務**：資料轉換、格式化、生成等

:::

#### 4.3 新增 assets/

```bash
mkdir assets
```

新增範本檔案 `assets/template.json`：

```json
{
  "title": "{{ title }}",
  "content": "{{ content }}"
}
```

在 `SKILL.md` 中引用：

```markdown
## Instructions

To generate output:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
```

---

### 第 5 步：驗證 SKILL.md 格式

**為什麼**：在安裝前驗證格式，避免安裝時報錯

```bash
npx openskills install ./my-skill
```

**你應該看到**：

```
✔ Found skill: my-skill
  Description: Use this skill to demonstrate how to write proper instructions.
  Size: 1.2 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

選擇技能並按回車，應該看到：

```
✔ Installing my-skill...
✔ Skill installed successfully to .claude/skills/my-skill

Next steps:
  Run: npx openskills sync
  Then: Ask your AI agent to use the skill
```

::: tip 驗證清單

在安裝前，檢查以下項目：

- [ ] SKILL.md 以 `---` 開頭
- [ ] 包含 `name` 和 `description` 欄位
- [ ] `name` 使用連字元格式（`my-skill` 而非 `my_skill`）
- [ ] `description` 是 1-2 句話的概述
- [ ] 指令使用 imperative/infinitive 形式
- [ ] 所有 `references/`、`scripts/`、`assets/` 引用路徑正確

:::

---

### 第 6 步：同步到 AGENTS.md

**為什麼**：讓 AI 代理知道有這個技能可用

```bash
npx openskills sync
```

**你應該看到**：

```
✔ Found 1 skill:
  ☑ my-skill

✔ Syncing to AGENTS.md...
✔ Updated AGENTS.md successfully
```

檢查生成的 `AGENTS.md`：

```markdown
<!-- SKILLS_SYSTEM_START -->
...
<available_skills>
  <skill name="my-skill">Use this skill to demonstrate how to write proper instructions.</skill>
</available_skills>
...
<!-- SKILLS_SYSTEM_END -->
```

---

### 第 7 步：測試技能載入

**為什麼**：驗證技能能夠正確載入到 AI 上下文

```bash
npx openskills read my-skill
```

**你應該看到**：

```
Loading skill: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill
... (完整 SKILL.md 內容)
```

## 檢查點 ✅

完成以上步驟後，你應該：

- ✅ 建立了一個包含 SKILL.md 的技能目錄
- ✅ SKILL.md 包含正確的 YAML frontmatter 和 Markdown 內容
- ✅ 技能成功安裝到 `.claude/skills/`
- ✅ 技能已同步到 AGENTS.md
- ✅ 使用 `openskills read` 能夠載入技能內容

## 踩坑提醒

### 問題 1：安裝時報 "Invalid SKILL.md (missing YAML frontmatter)"

**原因**：SKILL.md 沒有以 `---` 開頭

**解決方法**：檢查檔案第一行是否是 `---`，不是 `# My Skill` 或其他內容

---

### 問題 2：AI 代理無法識別技能

**原因**：未執行 `openskills sync` 或 AGENTS.md 未更新

**解決方法**：執行 `npx openskills sync` 並檢查 AGENTS.md 中是否包含技能條目

---

### 問題 3：資源路徑解析錯誤

**原因**：在 SKILL.md 中使用了絕對路徑或錯誤的相對路徑

**解決方法**：
- ✅ 正確：`references/api-docs.md`（相對路徑）
- ❌ 錯誤：`/path/to/skill/references/api-docs.md`（絕對路徑）
- ❌ 錯誤：`../other-skill/references/api-docs.md`（跨技能引用）

---

### 問題 4：SKILL.md 過長導致 token 超限

**原因**：SKILL.md 超過 5000 詞或包含大量詳細文件

**解決方法**：將詳細內容移到 `references/` 目錄，在 SKILL.md 中引用

## 本課小結

建立自訂技能的核心步驟：

1. **建立目錄結構**：最小結構（只有 SKILL.md）或完整結構（包含 references/、scripts/、assets/）
2. **編寫 YAML frontmatter**：必需欄位 `name`（連字元格式）和 `description`（1-2 句話）
3. **編寫指令內容**：使用 imperative/infinitive 形式，避免 second person
4. **新增資源**（可選）：references/、scripts/、assets/
5. **驗證格式**：使用 `openskills install ./my-skill` 驗證
6. **同步到 AGENTS.md**：執行 `openskills sync` 讓 AI 代理知道
7. **測試載入**：使用 `openskills read my-skill` 驗證載入

## 下一課預告

> 下一課我們學習 **[技能結構詳解](../skill-structure/)**。
>
> 你會學到：
> - SKILL.md 的完整欄位說明
> - references/、scripts/、assets/ 的最佳實踐
> - 如何最佳化技能的可讀性和可維護性

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能           | 檔案路徑                                                                 | 行號    |
|---|---|---|
| YAML frontmatter 驗證 | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14   |
| YAML 欄位提取  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7     |
| 安裝時驗證格式  | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |
| 技能名稱提取    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 344-345 |

**範例技能檔案**：
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - 最小結構範例
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - 格式規範參考

**關鍵函式**：
- `hasValidFrontmatter(content: string): boolean` - 驗證 SKILL.md 是否以 `---` 開頭
- `extractYamlField(content: string, field: string): string` - 提取 YAML 欄位值（非貪婪匹配）

</details>
