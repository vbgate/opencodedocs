---
title: "AGENTS.md 格式: 技能規範 | openskills"
sidebarTitle: "讓 AI 認識你的技能"
subtitle: "AGENTS.md 格式規範"
description: "學習 AGENTS.md 檔案的 XML 標籤結構和技能列表定義。了解欄位含義、生成機制和最佳實踐，掌握技能系統工作原理。"
tags:
  - "appendix"
  - "reference"
  - "format"
prerequisite:
  - "sync-to-agents"
order: 2
---

# AGENTS.md 格式規範

**AGENTS.md** 是 OpenSkills 生成的技能描述檔案，告訴 AI 代理（如 Claude Code、Cursor、Windsurf 等）有哪些技能可用，以及如何呼叫這些技能。

## 學完你能做什麼

- 讀懂 AGENTS.md 的 XML 結構和各個標籤的含義
- 理解技能列表的欄位定義和使用限制
- 知道如何手動編輯 AGENTS.md（不建議，但有時需要）
- 了解 OpenSkills 如何生成和更新這個檔案

## 完整格式範例

下面是一個完整的 AGENTS.md 檔案範例：

```xml
# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
- For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>open-source-maintainer</name>
<description>End-to-end GitHub repository maintenance for open-source projects. Use when asked to triage issues, review PRs, analyze contributor activity, generate maintenance reports, or maintain a repository.</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

## 標籤結構詳解

### 外層容器：`<skills_system>`

```xml
<skills_system priority="1">
  <!-- 技能內容 -->
</skills_system>
```

- **priority**：優先級標記（固定為 `"1"`），告訴 AI 代理這個技能系統的重要程度

::: tip 說明
`priority` 屬性目前保留為未來擴展使用，所有 AGENTS.md 都使用固定值 `"1"`。
:::

### 使用說明：`<usage>`

`<usage>` 標籤包含 AI 代理應該如何使用技能的指導：

```xml
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>
```

**關鍵要點**：
- **觸發條件**：檢查使用者任務是否可以用技能更高效完成
- **呼叫方式**：使用 `npx openskills read <skill-name>` 指令
- **批次呼叫**：支援逗號分隔的多個技能名稱
- **基礎目錄**：輸出包含 `base_dir` 欄位，用於解析技能中的引用檔案（如 `references/`、`scripts/`、`assets/`）
- **使用限制**：
  - 只使用 `<available_skills>` 中列出的技能
  - 不要重複載入已經在上下文中的技能
  - 每次技能呼叫是無狀態的

### 技能列表：`<available_skills>`

`<available_skills>` 包含所有可用技能的列表，每個技能用 `<skill>` 標籤定義：

```xml
<available_skills>

<skill>
<name>skill-name</name>
<description>技能描述...</description>
<location>project</location>
</skill>

<skill>
<name>another-skill</name>
<description>另一個技能描述...</description>
<location>global</location>
</skill>

</available_skills>
```

#### `<skill>` 標籤欄位

每個 `<skill>` 包含以下必需欄位：

| 欄位 | 類型 | 可選值 | 說明 |
| --- | --- | --- | --- |
| `<name>` | string | - | 技能名稱（與 SKILL.md 檔案名稱或 YAML 中的 `name` 一致） |
| `<description>` | string | - | 技能描述（來自 SKILL.md 的 YAML frontmatter） |
| `<location>` | string | `project` \| `global` | 技能安裝位置標記（用於 AI 代理理解技能來源） |

**欄位說明**：

- **`<name>`**：技能的唯一識別碼，AI 代理透過這個名稱呼叫技能
- **`<description>`**：詳細說明技能的功能和使用場景，幫助 AI 判斷是否需要使用這個技能
- **`<location>`**：
  - `project`：安裝在專案本地（`.claude/skills/` 或 `.agent/skills/`）
  - `global`：安裝在全域目錄（`~/.claude/skills/`）

::: info 為什麼需要 location 標記？
`<location>` 標記幫助 AI 代理理解技能的可見範圍：
- `project` 技能只在當前專案可用
- `global` 技能在所有專案中都可用
這影響 AI 代理的技能選擇策略。
:::

## 標記方式

AGENTS.md 支援兩種標記方式，OpenSkills 會自動識別：

### 方式 1：XML 標記（推薦）

```xml
<skills_system priority="1">
  <!-- 技能內容 -->
</skills_system>
```

這是預設方式，使用標準 XML 標籤標記技能系統的開始和結束。

### 方式 2：HTML 註解標記（相容模式）

```xml
<!-- SKILLS_TABLE_START -->

## Available Skills

<usage>
  <!-- 使用說明 -->
</usage>

<available_skills>
  <!-- 技能列表 -->
</available_skills>

<!-- SKILLS_TABLE_END -->
```

這種格式去掉了外層的 `<skills_system>` 容器，只用 HTML 註解標記技能區域的開始和結束。

::: tip OpenSkills 的處理邏輯
`replaceSkillsSection()` 函數（`src/utils/agents-md.ts:67-93`）會按以下優先順序查找標記：
1. 先查找 `<skills_system>` XML 標記
2. 如果沒找到，查找 `<!-- SKILLS_TABLE_START -->` HTML 註解
3. 如果都沒找到，將內容附加到檔案末尾
:::

## OpenSkills 如何生成 AGENTS.md

當執行 `openskills sync` 時，OpenSkills 會：

1. **查找所有已安裝技能**（`findAllSkills()`）
2. **互動式選擇技能**（除非使用 `-y` 標誌）
3. **生成 XML 內容**（`generateSkillsXml()`）
   - 建構 `<usage>` 使用說明
   - 為每個技能生成 `<skill>` 標籤
4. **替換檔案中的技能部分**（`replaceSkillsSection()`）
   - 查找現有標記（XML 或 HTML 註解）
   - 替換標記之間的內容
   - 如果沒有標記，附加到檔案末尾

### 原始碼位置

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 生成 XML | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| 替換技能部分 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| 解析現有技能 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |

## 手動編輯注意事項

::: warning 不建議手動編輯
雖然可以手動編輯 AGENTS.md，但建議：
1. 使用 `openskills sync` 指令生成和更新
2. 手動編輯的內容會在下次 `sync` 時被覆蓋
3. 如果需要自訂技能列表，使用互動式選擇（不帶 `-y` 標誌）
:::

如果確實需要手動編輯，請注意：

1. **保持 XML 語法正確**：確保所有標籤都正確閉合
2. **不要修改標記**：保留 `<skills_system>` 或 `<!-- SKILLS_TABLE_START -->` 等標記
3. **欄位完整**：每個 `<skill>` 必須包含 `<name>`、`<description>`、`<location>` 三個欄位
4. **無重複技能**：不要重複添加同名的技能

## 常見問題

### Q1：為什麼 AGENTS.md 有時沒有 `<skills_system>` 標籤？

**A**：這是相容模式。如果你的檔案使用 HTML 註解標記（`<!-- SKILLS_TABLE_START -->`），OpenSkills 也會識別。下次 `sync` 時會自動轉換為 XML 標記。

### Q2：如何刪除所有技能？

**A**：執行 `openskills sync` 並在互動式介面中取消選擇所有技能，或者執行：

```bash
openskills sync -y --output /dev/null
```

這會清空 AGENTS.md 中的技能部分（但保留標記）。

### Q3：location 欄位對 AI 代理有實際影響嗎？

**A**：這取決於具體的 AI 代理實現。一般來說：
- `location="project"` 表示技能只在當前專案上下文中有意義
- `location="global"` 表示技能是通用工具，可以在任何專案使用

AI 代理可能會根據這個標記調整技能載入策略，但大多數代理（如 Claude Code）會忽略這個欄位，直接呼叫 `openskills read`。

### Q4：技能描述應該寫多長？

**A**：技能描述應該：
- **簡潔但完整**：說明技能的核心功能和主要使用場景
- **避免太短**：單行描述很難讓 AI 理解何時使用
- **避免太長**：過長的描述會浪費上下文，AI 不會仔細閱讀

建議長度：**50-150 詞**。

## 最佳實踐

1. **使用 sync 指令**：始終用 `openskills sync` 生成 AGENTS.md，而不是手動編輯
2. **定期更新**：安裝或更新技能後，記得執行 `openskills sync`
3. **選擇合適的技能**：不是所有已安裝的技能都需要放在 AGENTS.md 中，根據專案需求選擇
4. **檢查格式**：如果 AI 代理無法識別技能，檢查 AGENTS.md 的 XML 標籤是否正確

## 下一課預告

> 下一課我們學習 **[檔案結構](../file-structure/)**。
>
> 你會學到：
> - OpenSkills 生成的目錄和檔案結構
> - 各個檔案的作用和位置
> - 如何理解和管理技能目錄

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 生成技能 XML | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| 替換技能部分 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| 解析現有技能 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Skill 類型定義 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |

**關鍵常數**：
- `priority="1"`：技能系統優先級標記（固定值）

**關鍵函數**：
- `generateSkillsXml(skills: Skill[])`：生成 XML 格式的技能列表
- `replaceSkillsSection(content: string, newSection: string)`：替換或附加技能部分
- `parseCurrentSkills(content: string)`：從 AGENTS.md 中解析已啟用的技能名稱

</details>
