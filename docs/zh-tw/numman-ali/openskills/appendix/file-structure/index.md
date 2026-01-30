---
title: "檔案結構: 目錄組織 | opencode-openskills"
sidebarTitle: "技能放哪"
subtitle: "檔案結構: 目錄組織 | opencode-openskills"
description: "學習 OpenSkills 的目錄和檔案組織方式。掌握技能安裝目錄、目錄結構、AGENTS.md 格式規範及查找優先級。"
tags:
  - "附錄"
  - "檔案結構"
  - "目錄組織"
prerequisite: []
order: 3
---

# 檔案結構

## 概覽

OpenSkills 的檔案結構分為三類：**技能安裝目錄**、**技能目錄結構**和 **AGENTS.md 同步檔案**。理解這些結構有助於你更好地管理和使用技能。

## 技能安裝目錄

OpenSkills 支援 4 個技能安裝位置，按優先級從高到低排列：

| 優先級 | 位置 | 說明 | 何時使用 |
|--- | --- | --- | ---|
| 1 | `./.agent/skills/` | 專案本地 Universal 模式 | 多代理環境，避免與 Claude Code 衝突 |
| 2 | `~/.agent/skills/` | 全域 Universal 模式 | 多代理環境 + 全域安裝 |
| 3 | `./.claude/skills/` | 專案本地（預設） | 標準安裝，專案特定技能 |
| 4 | `~/.claude/skills/` | 全域安裝 | 所有專案共用的技能 |

**選擇建議**：
- 單代理環境：使用預設的 `.claude/skills/`
- 多代理環境：使用 `.agent/skills/`（`--universal` 標誌）
- 跨專案通用技能：使用全域安裝（`--global` 標誌）

## 技能目錄結構

每個技能都是一個獨立的目錄，包含必需檔案和可選資源：

```
skill-name/
├── SKILL.md              # 必需：技能主檔案
├── .openskills.json      # 必需：安裝元數據（自動生成）
├── references/           # 可選：參考文檔
│   └── api-docs.md
├── scripts/             # 可選：可執行腳本
│   └── helper.py
└── assets/              # 可選：模板和輸出檔案
    └── template.json
```

### 檔案說明

#### SKILL.md（必需）

技能主檔案，包含 YAML frontmatter 和技能指令：

```yaml
---
name: my-skill
description: 技能描述
---

## 技能標題

技能指令內容...
```

**關鍵點**：
- 檔名必須為 `SKILL.md`（大寫）
- YAML frontmatter 必須包含 `name` 和 `description`
- 內容使用祈使語氣（imperative form）

#### .openskills.json（必需，自動生成）

OpenSkills 自動建立的元數據檔案，記錄安裝來源：

```json
{
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2026-01-24T12:00:00.000Z"
}
```

**用途**：
- 支援技能更新（`openskills update`）
- 記錄安裝時間戳
- 追蹤技能來源

**源位置**：
- `src/utils/skill-metadata.ts:29-36` - 寫入元數據
- `src/utils/skill-metadata.ts:17-27` - 讀取元數據

#### references/（可選）

存放參考文檔和 API 規範：

```
references/
├── skill-format.md      # 技能格式規範
├── api-docs.md         # API 文檔
└── best-practices.md   # 最佳實踐
```

**使用場景**：
- 詳細的技術文檔（保持 SKILL.md 簡潔）
- API 參考手冊
- 範例程式碼和模板

#### scripts/（可選）

存放可執行腳本：

```
scripts/
├── extract_text.py      # Python 腳本
├── deploy.sh          # Shell 腳本
└── build.js          # Node.js 腳本
```

**使用場景**：
- 技能執行時需要運行的自動化腳本
- 資料處理和轉換工具
- 部署和建置腳本

#### assets/（可選）

存放模板和輸出檔案：

```
assets/
├── template.json      # JSON 模板
├── config.yaml       # 設定檔
└── output.md        # 範例輸出
```

**使用場景**：
- 技能生成內容的模板
- 設定檔範例
- 預期的輸出範例

## AGENTS.md 結構

`openskills sync` 生成的 AGENTS.md 檔案包含技能系統說明和可用技能列表：

### 完整格式

```markdown
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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### 組件說明

| 組件 | 說明 |
|--- | ---|
| `<skills_system>` | XML 標籤，標記技能系統部分 |
| `<usage>` | 技能使用說明（告訴 AI 如何呼叫技能） |
| `<available_skills>` | 可用技能列表（每個技能一個 `<skill>` 標籤） |
| `<skill>` | 單個技能資訊（name, description, location） |
| `<!-- SKILLS_TABLE_START -->` | 開始標記（用於同步時定位） |
| `<!-- SKILLS_TABLE_END -->` | 結束標記（用於同步時定位） |

**location 欄位**：
- `project` - 專案本地技能（`.claude/skills/` 或 `.agent/skills/`）
- `global` - 全域技能（`~/.claude/skills/` 或 `~/.agent/skills/`）

## 目錄查找優先級

OpenSkills 在查找技能時，按以下優先級遍歷目錄：

```typescript
// 源位置：src/utils/dirs.ts:18-25
[
  join(process.cwd(), '.agent/skills'),   // 1. 專案 Universal
  join(homedir(), '.agent/skills'),        // 2. 全域 Universal
  join(process.cwd(), '.claude/skills'),  // 3. 專案 Claude
  join(homedir(), '.claude/skills'),       // 4. 全域 Claude
]
```

**規則**：
- 找到第一個符合的技能後立即停止查找
- 專案本地技能優先於全域技能
- Universal 模式優先於標準模式

**源位置**：`src/utils/skills.ts:30-64` - 查找所有技能的實作

## 範例：完整專案結構

一個使用 OpenSkills 的典型專案結構：

```
my-project/
├── AGENTS.md                    # 同步生成的技能列表
├── .claude/                     # Claude Code 設定
│   └── skills/                  # 技能安裝目錄
│       ├── pdf/
│       │   ├── SKILL.md
│       │   ├── .openskills.json
│       │   ├── references/
│       │   ├── scripts/
│       │   └── assets/
│       └── git-workflow/
│           ├── SKILL.md
│           └── .openskills.json
├── .agent/                      # Universal 模式目錄（可選）
│   └── skills/
│       └── my-custom-skill/
│           ├── SKILL.md
│           └── .openskills.json
├── src/                         # 專案原始碼
├── package.json
└── README.md
```

## 最佳實踐

### 1. 目錄選擇

| 場景 | 推薦目錄 | 指令 |
|--- | --- | ---|
| 專案特定技能 | `.claude/skills/` | `openskills install repo` |
| 多代理共用 | `.agent/skills/` | `openskills install repo --universal` |
| 跨專案通用 | `~/.claude/skills/` | `openskills install repo --global` |

### 2. 技能組織

- **單技能儲存庫**：根目錄放 `SKILL.md`
- **多技能儲存庫**：子目錄各自包含 `SKILL.md`
- **符號連結**：開發時用 symlink 連結到本地儲存庫（見 [符號連結支援](../../advanced/symlink-support/)）

### 3. AGENTS.md 版本控制

- **建議提交**：將 `AGENTS.md` 加入版本控制
- **CI 同步**：在 CI/CD 中執行 `openskills sync -y`（見 [CI/CD 整合](../../advanced/ci-integration/)）
- **團隊協作**：團隊成員同步執行 `openskills sync` 保持一致

## 本課小結

OpenSkills 的檔案結構設計簡潔清晰：

- **4 個安裝目錄**：支援專案本地、全域、Universal 模式
- **技能目錄**：必需的 SKILL.md + 自動生成的 .openskills.json + 可選的 resources/scripts/assets
- **AGENTS.md**：同步生成的技能列表，遵循 Claude Code 格式

理解這些結構有助於你更有效率地管理和使用技能。

## 下一課預告

> 下一課我們學習 **[術語表](../glossary/)**。
>
> 你會學到：
> - OpenSkills 和 AI 技能系統的關鍵術語
> - 專業概念的準確定義
> - 常見縮寫的含義

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 目錄路徑工具 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 1-25 |
| 技能查找 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-84 |
| 元數據管理 | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts) | 1-36 |

**關鍵函式**：
- `getSkillsDir(projectLocal, universal)` - 取得技能目錄路徑
- `getSearchDirs()` - 取得 4 個查找目錄（按優先級）
- `findAllSkills()` - 查找所有已安裝技能
- `findSkill(skillName)` - 查找指定技能
- `readSkillMetadata(skillDir)` - 讀取技能元數據
- `writeSkillMetadata(skillDir, metadata)` - 寫入技能元數據

</details>
