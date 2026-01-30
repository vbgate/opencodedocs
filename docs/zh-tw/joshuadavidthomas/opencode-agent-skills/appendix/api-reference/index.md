---
title: "API: 工具參考 | opencode-agent-skills"
sidebarTitle: "呼叫這 4 個工具"
subtitle: "API: 工具參考 | opencode-agent-skills"
description: "學習 opencode-agent-skills 的 4 個核心 API 工具的使用方法。掌握參數配置、回傳值處理和錯誤排查技巧，了解工具的命名空間支援和安全機制，透過實際範例提升開發效率，在專案中高效呼叫工具。"
tags:
  - "API"
  - "工具參考"
  - "介面文件"
prerequisite:
  - "start-installation"
order: 2
---

# API 工具參考

## 學完你能做什麼

透過本篇 API 參考，你將：

- 了解 4 個核心工具的參數和回傳值
- 掌握正確的工具呼叫方式
- 學會處理常見的錯誤情況

## 工具概覽

OpenCode Agent Skills 外掛提供以下 4 個工具：

| 工具名稱 | 功能描述 | 使用場景 |
| --- | --- | ---|
| `get_available_skills` | 取得可用技能列表 | 查看所有可用技能，支援搜尋過濾 |
| `read_skill_file` | 讀取技能檔案 | 存取技能的文件、配置等支援檔案 |
| `run_skill_script` | 執行技能指令碼 | 在技能目錄下執行自動化指令碼 |
| `use_skill` | 載入技能 | 將技能的 SKILL.md 內容注入到會話上下文 |

---

## get_available_skills

取得可用技能列表，支援可選的搜尋過濾。

### 參數

| 參數名 | 類型 | 必填 | 描述 |
| --- | --- | --- | ---|
| `query` | string | 否 | 搜尋查詢字串，匹配技能名稱和描述（支援 `*` 萬用字元） |

### 回傳值

返回格式化的技能列表，每項包含：

- 技能名稱和來源標籤（如 `skill-name (project)`）
- 技能描述
- 可用指令碼列表（如果有）

**範例回傳**：
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### 錯誤處理

- 無匹配結果時，返回提示訊息
- 如果查詢參數拼寫錯誤，會返回相似技能建議

### 使用範例

**列出所有技能**：
```
使用者輸入：
列出所有可用的技能

AI 呼叫：
get_available_skills()
```

**搜尋包含 "git" 的技能**：
```
使用者輸入：
查詢與 git 相關的技能

AI 呼叫：
get_available_skills({
  "query": "git"
})
```

**使用萬用字元搜尋**：
```
AI 呼叫：
get_available_skills({
  "query": "code*"
})

回傳：
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

讀取技能目錄下的支援檔案（文件、配置、範例等）。

### 參數

| 參數名 | 類型 | 必填 | 描述 |
| --- | --- | --- | ---|
| `skill` | string | 是 | 技能名稱 |
| `filename` | string | 是 | 檔案路徑（相對於技能目錄，如 `docs/guide.md`、`scripts/helper.sh`） |

### 回傳值

返回檔案載入成功的確認訊息。

**範例回傳**：
```
File "docs/guide.md" from skill "code-review" loaded.
```

檔案內容會以 XML 格式注入到會話上下文中：

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[檔案實際內容]
  </content>
</skill-file>
```

### 錯誤處理

| 錯誤類型 | 返回訊息 |
| --- | ---|
| 技能不存在 | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| 路徑不安全 | `Invalid path: cannot access files outside skill directory.` |
| 檔案不存在 | `File "xxx" not found. Available files: file1, file2, ...` |

### 安全機制

- 路徑安全檢查：防止目錄穿越攻擊（如 `../../../etc/passwd`）
- 僅限存取技能目錄內的檔案

### 使用範例

**讀取技能文件**：
```
使用者輸入：
檢視 code-review 技能的使用指南

AI 呼叫：
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**讀取配置檔案**：
```
AI 呼叫：
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

在技能目錄下執行可執行指令碼。

### 參數

| 參數名 | 類型 | 必填 | 描述 |
| --- | --- | --- | ---|
| `skill` | string | 是 | 技能名稱 |
| `script` | string | 是 | 指令碼相對路徑（如 `build.sh`、`tools/deploy.sh`） |
| `arguments` | string[] | 否 | 傳遞給指令碼的命令列參數陣列 |

### 回傳值

返回指令碼的輸出內容。

**範例回傳**：
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### 錯誤處理

| 錯誤類型 | 返回訊息 |
| --- | ---|
| 技能不存在 | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| 指令碼不存在 | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| 執行失敗 | `Script failed (exit 1): error message` |

### 指令碼發現規則

外掛會自動掃描技能目錄下的可執行檔案：

- 最大遞迴深度：10 層
- 跳過隱藏目錄（以 `.` 開頭）
- 跳過常見依賴目錄（`node_modules`、`__pycache__`、`.git` 等）
- 僅包含具有可執行位元（`mode & 0o111`）的檔案

### 執行環境

- 工作目錄（CWD）切換到技能目錄
- 指令碼在技能目錄上下文中執行
- 輸出直接返回給 AI

### 使用範例

**執行建構指令碼**：
```
使用者輸入：
執行專案的建構指令碼

AI 呼叫：
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**帶參數執行**：
```
AI 呼叫：
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

載入技能的 SKILL.md 內容到會話上下文。

### 參數

| 參數名 | 類型 | 必填 | 描述 |
| --- | --- | --- | ---|
| `skill` | string | 是 | 技能名稱（支援命名空間前綴，如 `project:my-skill`、`user:my-skill`） |

### 回傳值

返回技能載入成功的確認訊息，包含可用指令碼和檔案列表。

**範例回傳**：
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

技能內容會以 XML 格式注入到會話上下文中：

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Claude Code 工具映射...]
  
  <content>
[SKILL.md 實際內容]
  </content>
</skill>
```

### 命名空間支援

使用命名空間前綴精確指定技能來源：

| 命名空間 | 說明 | 範例 |
| --- | --- | ---|
| `project:` | 專案級 OpenCode 技能 | `project:my-skill` |
| `user:` | 使用者級 OpenCode 技能 | `user:my-skill` |
| `claude-project:` | 專案級 Claude 技能 | `claude-project:my-skill` |
| `claude-user:` | 使用者級 Claude 技能 | `claude-user:my-skill` |
| 無前綴 | 使用預設優先順序 | `my-skill` |

### 錯誤處理

| 錯誤類型 | 返回訊息 |
| --- | ---|
| 技能不存在 | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### 自動注入功能

載入技能時，外掛會自動：

1. 列出技能目錄下的所有檔案（排除 SKILL.md）
2. 列出所有可執行指令碼
3. 注入 Claude Code 工具映射（如果技能需要）

### 使用範例

**載入技能**：
```
使用者輸入：
幫我進行程式碼審查

AI 呼叫：
use_skill({
  "skill": "code-review"
})
```

**使用命名空間指定來源**：
```
AI 呼叫：
use_skill({
  "skill": "user:git-helper"
})
```

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 工具 | 檔案路徑 | 行號 |
| --- | --- | ---|
| GetAvailableSkills 工具 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| ReadSkillFile 工具 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| RunSkillScript 工具 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| UseSkill 工具 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| 工具註冊 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Skill 類型定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Script 類型定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| SkillLabel 類型定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| resolveSkill 函式 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**關鍵類型**：
- `Skill`：技能完整中繼資料（name, description, path, scripts, template 等）
- `Script`：指令碼中繼資料（relativePath, absolutePath）
- `SkillLabel`：技能來源識別（project, user, claude-project 等）

**關鍵函式**：
- `resolveSkill()`：解析技能名稱，支援命名空間前綴
- `isPathSafe()`：驗證路徑安全性，防止目錄穿越
- `findClosestMatch()`：模糊匹配建議

</details>

---

## 下一課預告

本課程已完成 OpenCode Agent Skills 的 API 工具參考文件。

如需了解更多資訊，請查閱：
- [技能開發最佳實踐](../best-practices/) - 學習編寫高品質技能的技巧與規範
- [常見問題排查](../../faq/troubleshooting/) - 解決使用外掛時遇到的常見問題
