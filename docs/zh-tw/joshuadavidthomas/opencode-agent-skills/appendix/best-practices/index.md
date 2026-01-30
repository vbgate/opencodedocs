---
title: "最佳實務：技能開發 | opencode-agent-skills"
sidebarTitle: "寫出高品質技能"
subtitle: "最佳實務：技能開發"
description: "掌握 OpenCode Agent Skills 的開發規範。學習命名、描述、目錄、指令稿、Frontmatter 等最佳實務，提升技能品質和 AI 使用效率。"
tags:
  - "最佳實務"
  - "技能開發"
  - "規範"
  - "Anthropic Skills"
prerequisite:
  - "creating-your-first-skill"
order: 1
---

# 技能開發最佳實務

## 學完你能做什麼

完成本教學後，你將能夠：
- 撰寫符合命名規範的技能名稱
- 撰寫易於被自動推薦識別的描述
- 組織清晰的技能目錄結構
- 合理使用指令稿功能
- 避免 Frontmatter 常見錯誤
- 提高技能的探索率和可用性

## 為什麼需要最佳實務

OpenCode Agent Skills 外掛不僅僅是儲存技能，還會：
- **自動探索**：從多個位置掃描技能目錄
- **語意匹配**：根據技能描述與使用者訊息的相似度推薦技能
- **命名空間管理**：支援多個來源的技能共存
- **指令稿執行**：自動掃描並執行可執行指令稿

遵循最佳實務可以讓你的技能：
- ✅ 被外掛正確識別和載入
- ✅ 在語意匹配時獲得更高推薦優先順序
- ✅ 避免與其他技能衝突
- ✅ 更容易被團隊成員理解和使用

---

## 命名規範

### 技能名稱規則

技能名稱必須符合以下規範：

::: tip 命名規則
- ✅ 使用小寫字母、數字和連字號
- ✅ 以字母開頭
- ✅ 使用連字號分隔單字
- ❌ 不使用大寫字母或底線
- ❌ 不使用空格或特殊字元
:::

**範例**：

| ✅ 正確範例 | ❌ 錯誤範例 | 原因 |
| --- | --- | ---|
| `git-helper` | `GitHelper` | 包含大寫字母 |
| `docker-build` | `docker_build` | 使用了底線 |
| `code-review` | `code review` | 包含空格 |
| `test-utils` | `1-test` | 以數字開頭 |

**原始碼依據**：`src/skills.ts:106-108`

```typescript
name: z.string()
  .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
  .min(1, { message: "Name cannot be empty" }),
```

### 目錄命名與 frontmatter 的關係

技能目錄名和 frontmatter 中的 `name` 欄位可以不同：

```yaml
---
# 目錄是 my-git-tools，但 frontmatter 的 name 是 git-helper
name: git-helper
description: Git 常用操作助手
---
```

**推薦做法**：
- 保持目錄名和 `name` 欄位一致，便於維護
- 目錄名使用簡短易記的識別碼
- `name` 欄位可以更具體描述技能用途

**原始碼依據**：`src/skills.ts:155-158`

---

## 描述編寫技巧

### 描述的作用

技能描述不僅僅是對使用者的說明，還會用於：

1. **語意匹配**：外掛會計算描述與使用者訊息的相似度
2. **技能推薦**：根據相似度自動推薦相關技能
3. **模糊匹配**：當技能名稱拼寫錯誤時，用於推薦近似技能

### 好的描述 vs 差的描述

| ✅ 好的描述 | ❌ 差的描述 | 原因 |
| --- | --- | ---|
| "自動化 Git 分支管理和提交流程，支援自動產生 commit 資訊" | "Git 工具" | 太模糊，缺乏具體功能 |
| "為 Node.js 專案產生型別安全的 API 用戶端程式碼" | "一個有用的工具" | 未說明適用場景 |
| "將 PDF 翻譯成中文並保留原始排版格式" | "翻譯工具" | 未說明特殊能力 |

### 描述編寫原則

::: tip 描述編寫原則
1. **具體化**：說明技能的具體用途和適用場景
2. **包含關鍵詞**：包含使用者可能搜尋的關鍵詞（如 "Git"、"Docker"、"翻譯"）
3. **突出獨特價值**：說明這個技能相比其他同類技能的優勢
4. **避免冗餘**：不要重複技能名稱
:::

**範例**：

```markdown
---
name: pdf-translator
description: 將英文 PDF 文件翻譯成中文，保留原始排版格式、圖片位置和表格結構。支援批次翻譯和自訂術語表。
---
```

這個描述包含了：
- ✅ 具體功能（翻譯 PDF、保留格式）
- ✅ 適用場景（英文文件）
- ✅ 獨特價值（保留格式、批次、術語表）

**原始碼依據**：`src/skills.ts:109`

```typescript
description: z.string()
  .min(1, { message: "Description cannot be empty" }),
```

---

## 目錄組織

### 基本結構

一個標準的技能目錄包含：

```
my-skill/
├── SKILL.md              # 技能主檔案（必需）
├── README.md             # 詳細文件（選用）
├── tools/                # 可執行指令稿（選用）
│   ├── setup.sh
│   └── run.sh
└── docs/                 # 支援文件（選用）
    ├── guide.md
    └── examples.md
```

### 跳過的目錄

外掛會自動跳過以下目錄（不掃描指令稿）：

::: warning 自動跳過的目錄
- `node_modules` - Node.js 相依套件
- `__pycache__` - Python 位元組碼快取
- `.git` - Git 版本控制
- `.venv`, `venv` - Python 虛擬環境
- `.tox`, `.nox` - Python 測試環境
- 任何以 `.` 開頭的隱藏目錄
:::

**原始碼依據**：`src/skills.ts:61`

```typescript
const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);
```

### 推薦的目錄命名

| 用途 | 推薦目錄名 | 說明 |
| --- | --- | ---|
| 指令稿檔案 | `tools/` 或 `scripts/` | 存放可執行指令稿 |
| 文件 | `docs/` 或 `examples/` | 存放輔助文件 |
| 組態 | `config/` | 存放組態檔案 |
| 範本 | `templates/` | 存放範本檔案 |

---

## 指令稿使用

### 指令稿探索規則

外掛會自動掃描技能目錄下的可執行檔案：

::: tip 指令稿探索規則
- ✅ 指令稿必須有可執行權限（`chmod +x script.sh`）
- ✅ 最大遞迴深度為 10 層
- ✅ 跳過隱藏目錄和相依套件目錄
- ❌ 不可執行的檔案不會被識別為指令稿
:::

**原始碼依據**：`src/skills.ts:86`

```typescript
if (stats.mode & 0o111) {
  scripts.push({
    relativePath: newRelPath,
    absolutePath: fullPath
  });
}
```

### 設定指令稿權限

**Bash 指令稿**：
```bash
chmod +x tools/setup.sh
chmod +x tools/run.sh
```

**Python 指令稿**：
```bash
chmod +x tools/scan.py
```

並在檔案開頭加入 shebang：
```python
#!/usr/bin/env python3
import sys
# ...
```

### 指令稿呼叫範例

當技能被載入時，AI 會看到可用的指令稿列表：

```
Available scripts:
- tools/setup.sh: 初始化開發環境
- tools/build.sh: 建置專案
- tools/deploy.sh: 部署到生產環境
```

AI 可以透過 `run_skill_script` 工具呼叫這些指令稿：

```javascript
run_skill_script({
  skill: "project-builder",
  script: "tools/build.sh",
  arguments: ["--release", "--verbose"]
})
```

---

## Frontmatter 最佳實務

### 必要欄位

**name**：技能唯一識別碼
- 小寫字母數字連字號
- 簡短但具有描述性
- 避免通用名稱（如 `helper`、`tool`）

**description**：技能描述
- 具體說明功能
- 包含適用場景
- 長度適中（1-2 句話）

### 選用欄位

**license**：授權條款資訊
```yaml
license: MIT
```

**allowed-tools**：限制技能可使用的工具
```yaml
allowed-tools:
  - read
  - write
  - bash
```

**metadata**：自訂中繼資料
```yaml
metadata:
  author: "Your Name"
  version: "1.0.0"
  category: "development"
```

**原始碼依據**：`src/skills.ts:105-114`

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

### 完整範例

```markdown
---
name: docker-deploy
description: 自動化 Docker 映像檔建置和部署流程，支援多環境組態、健康檢查和回復
license: MIT
allowed-tools:
  - read
  - write
  - bash
metadata:
  version: "2.1.0"
  author: "DevOps Team"
  category: "deployment"
---

# Docker 自動部署

本技能幫助你自動化 Docker 映像檔的建置、推送和部署流程。

## 使用方式

...
```

---

## 避免常見錯誤

### 錯誤 1：名稱不符合規範

**錯誤範例**：
```yaml
name: MyAwesomeSkill  # ❌ 大寫字母
```

**修正**：
```yaml
name: my-awesome-skill  # ✅ 小寫字母 + 連字號
```

### 錯誤 2：描述太模糊

**錯誤範例**：
```yaml
description: "一個有用的工具"  # ❌ 太模糊
```

**修正**：
```yaml
description: "自動化 Git 提交流程，自動產生符合規範的 commit 資訊"  # ✅ 具體明確
```

### 錯誤 3：指令稿沒有執行權限

**問題**：指令稿沒有被識別為可執行指令稿

**解決**：
```bash
chmod +x tools/setup.sh
```

**驗證**：
```bash
ls -l tools/setup.sh
# 應該顯示：-rwxr-xr-x（有 x 權限）
```

### 錯誤 4：目錄命名衝突

**問題**：多個技能使用相同的名稱

**解決方案**：
- 使用命名空間（透過外掛組態或目錄結構）
- 或使用更具描述性的名稱

**原始碼依據**：`src/skills.ts:258-259`

```typescript
// 同名技能僅保留首個，後續被忽略
if (skillsByName.has(skill.name)) {
  continue;
}
```

---

## 提高探索率

### 1. 最佳化描述關鍵詞

在描述中包含使用者可能搜尋的關鍵詞：

```yaml
---
name: code-reviewer
description: 自動化程式碼審查工具，檢查程式碼品質、潛在 Bug、安全漏洞和效能問題。支援 JavaScript、TypeScript、Python 等多種語言。
---
```

關鍵詞：程式碼審查、程式碼品質、Bug、安全漏洞、效能問題、JavaScript、TypeScript、Python

### 2. 使用規範的技能位置

外掛按以下優先順序發現技能：

1. `.opencode/skills/` - 專案級（優先順序最高）
2. `.claude/skills/` - 專案級 Claude
3. `~/.config/opencode/skills/` - 使用者級
4. `~/.claude/skills/` - 使用者級 Claude

**推薦做法**：
- 專案特定技能 → 放在專案級
- 通用技能 → 放在使用者級

### 3. 提供詳細的文件

除了 SKILL.md，還可以提供：
- `README.md` - 詳細說明和使用範例
- `docs/guide.md` - 完整使用指南
- `docs/examples.md` - 實戰範例

---

## 本課小結

本教學介紹了技能開發的最佳實務：

- **命名規範**：使用小寫字母數字連字號
- **描述編寫**：具體化、包含關鍵詞、突出獨特價值
- **目錄組織**：清晰的結構、跳過不必要的目錄
- **指令稿使用**：設定可執行權限、注意深度限制
- **Frontmatter 規範**：正確填寫必要和選用欄位
- **避免錯誤**：常見問題及解決方法

遵循這些最佳實務，可以讓你的技能：
- ✅ 被外掛正確識別和載入
- ✅ 在語意匹配時獲得更高推薦優先順序
- ✅ 避免與其他技能衝突
- ✅ 更容易被團隊成員理解和使用

## 下一課預告

> 下一課我們學習 **[API 工具參考](../api-reference/)**。
>
> 你會看到：
> - 所有可用工具的詳細參數說明
> - 工具呼叫範例和回傳值格式
> - 進階用法和注意事項

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | ---|
| 技能名稱驗證 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L106-L108) | 106-108 |
| 技能描述驗證 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L109-L110) | 109-110 |
| Frontmatter Schema 定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| 跳過的目錄列表 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61) | 61 |
| 指令稿可執行權限檢查 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| 同名技能去重邏輯 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |

**關鍵常數**：
- 跳過的目錄：`['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`

**關鍵函式**：
- `findScripts(skillPath: string, maxDepth: number = 10)`：遞迴尋找技能目錄下的可執行指令稿
- `parseSkillFile(skillPath: string)`：解析 SKILL.md 並驗證 frontmatter

</details>
