---
title: "最佳實踐：專案設定與團隊協作 | OpenSkills"
sidebarTitle: "5 分鐘設定團隊技能"
subtitle: "最佳實踐：專案設定與團隊協作"
description: "學習 OpenSkills 的最佳實踐。掌握專案本地 vs 全域安裝、Universal 模式設定、SKILL.md 寫作規範和 CI/CD 整合，提升團隊協作效率。"
tags:
  - "advanced"
  - "best-practices"
  - "skills"
  - "team"
prerequisite:
  - "start-quick-start"
  - "start-installation"
  - "start-first-skill"
order: 8
---

# 最佳實踐

## 學完你能做什麼

- 根據專案需求選擇合適的技能安裝方式（專案本地 vs 全域 vs Universal）
- 編寫符合規範的 SKILL.md 檔案（命名、描述、指令）
- 使用符號連結進行高效的本地開發
- 管理技能的版本和更新
- 在團隊環境中協作使用技能
- 將 OpenSkills 整合到 CI/CD 流程

## 你現在的困境

你已經學會安裝和使用技能，但在實際專案中遇到這些問題：

- 技能應該安裝在專案目錄還是全域？
- 多個 AI 代理之間如何共享技能？
- 技能寫了很多遍，但 AI 還是記不住
- 團隊成員各自安裝技能，版本不一致
- 本地修改技能後，每次重新安裝太麻煩

這節課我們彙總 OpenSkills 的最佳實踐，幫你解決這些問題。

## 什麼時候用這一招

- **專案設定最佳化**：根據專案類型選擇合適的技能安裝位置
- **多代理環境**：同時使用 Claude Code、Cursor、Windsurf 等工具
- **技能標準化**：團隊統一技能格式和寫作規範
- **本地開發**：快速迭代和測試技能
- **團隊協作**：共享技能、版本控制、CI/CD 整合

## 🎒 開始前的準備

::: warning 前置檢查

在開始前，請確保：

- ✅ 已完成 [快速開始](../../start/quick-start/)
- ✅ 已安裝至少一個技能並同步到 AGENTS.md
- ✅ 了解 [SKILL.md 基本格式](../../start/what-is-openskills/)

:::

## 專案設定最佳實踐

### 1. 專案本地 vs 全域 vs Universal 安裝

選擇合適的安裝位置是專案設定的第一步。

#### 專案本地安裝（預設）

**適用場景**：特定專案的專屬技能

```bash
# 安裝到 .claude/skills/
npx openskills install anthropics/skills
```

**優勢**：

- ✅ 技能隨專案版本控制
- ✅ 不同專案使用不同技能版本
- ✅ 無需全域安裝，減少依賴

**推薦做法**：

- 專案的專用技能（如特定框架的建置流程）
- 團隊內部開發的業務技能
- 依賴專案設定的技能

#### 全域安裝

**適用場景**：所有專案通用的技能

```bash
# 安裝到 ~/.claude/skills/
npx openskills install anthropics/skills --global
```

**優勢**：

- ✅ 所有專案共享同一套技能
- ✅ 無需每個專案重複安裝
- ✅ 集中管理更新

**推薦做法**：

- Anthropic 官方技能庫（anthropics/skills）
- 通用工具技能（如 PDF 處理、Git 操作）
- 個人常用的技能

#### Universal 模式（多代理環境）

**適用場景**：同時使用多個 AI 代理

```bash
# 安裝到 .agent/skills/
npx openskills install anthropics/skills --universal
```

**優先級順序**（從高到低）：

1. `./.agent/skills/`（專案本地 Universal）
2. `~/.agent/skills/`（全域 Universal）
3. `./.claude/skills/`（專案本地 Claude Code）
4. `~/.claude/skills/`（全域 Claude Code）

**推薦做法**：

- ✅ 使用多個代理（Claude Code + Cursor + Windsurf）時使用
- ✅ 避免與 Claude Code Marketplace 衝突
- ✅ 統一管理所有代理的技能

::: tip 什麼時候用 Universal 模式？

如果你的 `AGENTS.md` 被 Claude Code 和其他代理共享，使用 `--universal` 避免技能衝突。Universal 模式使用 `.agent/skills/` 目錄，與 Claude Code 的 `.claude/skills/` 隔離。

:::

### 2. 優先使用 npx 而不是全域安裝

OpenSkills 設計為即用即走，推薦始終使用 `npx`：

```bash
# ✅ 推薦：使用 npx
npx openskills install anthropics/skills
npx openskills sync
npx openskills list

# ❌ 避免：全域安裝後直接呼叫
openskills install anthropics/skills
```

**優勢**：

- ✅ 無需全域安裝，避免版本衝突
- ✅ 始終使用最新版本（npx 會自動更新）
- ✅ 減少系統依賴

**何時需要全域安裝**：

- 在 CI/CD 環境中（為了效能）
- 腳本中頻繁呼叫（減少 npx 啟動時間）

```bash
# CI/CD 或腳本中全域安裝
npm install -g openskills
openskills install anthropics/skills -y
openskills sync -y
```

## 技能管理最佳實踐

### 1. SKILL.md 寫作規範

#### 命名規範：使用連字元格式

**規則**：

- ✅ 正確：`pdf-editor`、`api-client`、`git-workflow`
- ❌ 錯誤：`PDF Editor`（空格）、`pdf_editor`（底線）、`PdfEditor`（駝峰）

**原因**：連字元格式是 URL 友好的識別符，符合 GitHub 儲存庫和檔案系統命名規範。

#### 描述寫作：第三人稱，1-2 句話

**規則**：

- ✅ 正確：`Use this skill for comprehensive PDF manipulation.`
- ❌ 錯誤：`You should use this skill to manipulate PDFs.`（第二人稱）

**範例對比**：

| 場景 | ❌ 錯誤（第二人稱） | ✅ 正確（第三人稱） |
|--- | --- | ---|
| PDF 技能 | You can use this to extract text from PDFs. | Extract text from PDFs with this skill. |
| Git 技能 | When you need to manage branches, use this. | Manage Git branches with this skill. |
| API 技能 | If you want to call the API, load this skill. | Call external APIs with this skill. |

#### 指令寫作：Imperative/Infinitive 形式

**規則**：

- ✅ 正確：`"To accomplish X, execute Y"`
- ✅ 正確：`"Load this skill when Z"`
- ❌ 錯誤：`"You should do X"`
- ❌ 錯誤：`"If you need Y"`

**寫作口訣**：

1. **動詞開頭**："Create" → "Use" → "Return"
2. **省略 "You"**：不說 "You should"
3. **明確路徑**：引用資源用 `references/` 開頭

**範例對比**：

| ❌ 錯誤寫法 | ✅ 正確寫法 |
|--- | ---|
| "You should create a file" | "Create a file" |
| "When you want to load this skill" | "Load this skill when" |
| "If you need to see the docs" | "See references/guide.md" |

::: tip 為什麼用 Imperative/Infinitive？

這種寫作風格讓 AI 代理更容易解析和執行指令。Imperative（命令式）和 Infinitive（不定式）形式消除了"你"這個主體，讓指令更直接、更明確。

:::

### 2. 檔案大小控制

**SKILL.md 檔案大小**：

- ✅ **推薦**：5000 詞以內
- ⚠️ **警告**：超過 8000 詞可能導致上下文超限
- ❌ **禁止**：超過 10000 詞

**控制方法**：

將詳細文件移到 `references/` 目錄：

```markdown
# SKILL.md（核心指令）

## Instructions

To process data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format  # 詳細文件
3. Process the result

## Bundled Resources

For detailed API documentation, see:
- `references/api-docs.md`  # 不會載入到上下文，節省 token
- `references/examples.md`
```

**檔案大小對比**：

| 檔案 | 大小限制 | 是否載入到上下文 |
|--- | --- | ---|
| `SKILL.md` | < 5000 詞 | ✅ 是 |
| `references/` | 無限制 | ❌ 否（按需載入） |
| `scripts/` | 無限制 | ❌ 否（可執行） |
| `assets/` | 無限制 | ❌ 否（範本檔案） |

### 3. 技能查找優先級

OpenSkills 按以下優先級查找技能（從高到低）：

```
1. ./.agent/skills/        # Universal 專案本地
2. ~/.agent/skills/        # Universal 全域
3. ./.claude/skills/      # Claude Code 專案本地
4. ~/.claude/skills/      # Claude Code 全域
```

**去重機制**：

- 同名技能只回傳第一個找到的
- 專案本地技能優先於全域技能

**範例場景**：

```
專案 A：
- .claude/skills/pdf        # 專案本地版本 v1.0
- ~/.claude/skills/pdf     # 全域版本 v2.0

# openskills read pdf 會載入 .claude/skills/pdf（v1.0）
```

**建議**：

- 專案的特殊需求技能放在專案本地
- 通用技能放在全域
- 多代理環境使用 Universal 模式

## 本地開發最佳實踐

### 1. 使用符號連結進行迭代開發

**問題**：每次修改技能後需要重新安裝，開發效率低。

**解決方案**：使用符號連結（symlink）

```bash
# 1. 複製技能儲存庫到開發目錄
git clone git@github.com:your-org/my-skills.git ~/dev/my-skills

# 2. 建立技能目錄
mkdir -p .claude/skills

# 3. 建立符號連結
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill

# 4. 同步到 AGENTS.md
npx openskills sync
```

**優勢**：

- ✅ 修改來源檔案立即生效（無需重新安裝）
- ✅ 支援基於 Git 的更新（pull 即可）
- ✅ 多個專案共享同一技能開發版本

**驗證符號連結**：

```bash
# 查看符號連結
ls -la .claude/skills/

# 輸出範例：
# my-skill -> /Users/yourname/dev/my-skills/my-skill
```

**注意事項**：

- ✅ 符號連結會被 `openskills list` 識別
- ✅ Broken symlinks 會自動跳過（不崩潰）
- ⚠️ Windows 使用者需使用 Git Bash 或 WSL（Windows 原生不支援符號連結）

### 2. 多專案共享技能

**場景**：多個專案需要使用同一套團隊技能。

**方法 1：全域安裝**

```bash
# 全域安裝團隊技能儲存庫
npx openskills install your-org/team-skills --global
```

**方法 2：符號連結到開發目錄**

```bash
# 在每個專案中建立符號連結
ln -s ~/dev/team-skills/my-skill .claude/skills/my-skill
```

**方法 3：Git Submodule**

```bash
# 將技能儲存庫作為子模組
git submodule add git@github.com:your-org/team-skills.git .claude/skills

# 更新子模組
git submodule update --init --recursive
```

**推薦選擇**：

| 方法 | 適用場景 | 優勢 | 劣勢 |
|--- | --- | --- | ---|
| 全域安裝 | 所有專案共享統一技能 | 集中管理，更新方便 | 無法按專案客製化 |
| 符號連結 | 本地開發和測試 | 修改立即生效 | 需要手動建立連結 |
| Git Submodule | 團隊協作，版本控制 | 隨專案版本控制 | 子模組管理複雜 |

## 團隊協作最佳實踐

### 1. 技能版本控制

**最佳實踐**：將技能儲存庫獨立版本控制

```bash
# 團隊技能儲存庫結構
team-skills/
├── .git/
├── pdf-editor/
│   └── SKILL.md
├── api-client/
│   └── SKILL.md
└── git-workflow/
    └── SKILL.md
```

**安裝方式**：

```bash
# 從團隊儲存庫安裝技能
npx openskills install git@github.com:your-org/team-skills.git
```

**更新流程**：

```bash
# 更新所有技能
npx openskills update

# 更新特定技能
npx openskills update pdf-editor,api-client
```

**版本管理建議**：

- 使用 Git Tag 標記穩定版本：`v1.0.0`、`v1.1.0`
- 在 AGENTS.md 中記錄技能版本：`<skill name="pdf-editor" version="1.0.0">`
- CI/CD 中固定使用穩定版本

### 2. 技能命名規範

**團隊統一命名規範**：

| 技能類型 | 命名模式 | 範例 |
|--- | --- | ---|
| 通用工具 | `<tool-name>` | `pdf`、`git`、`docker` |
| 框架相關 | `<framework>-<purpose>` | `react-component`、`django-model` |
| 工作流程 | `<workflow>` | `ci-cd`、`code-review` |
| 團隊專屬 | `<team>-<purpose>` | `team-api`、`company-deploy` |

**範例**：

```bash
# ✅ 統一命名
team-skills/
├── pdf/                     # PDF 處理
├── git-workflow/           # Git 工作流程
├── react-component/        # React 元件生成
└── team-api/             # 團隊 API 客戶端
```

### 3. 技能文件規範

**團隊統一文件結構**：

```markdown
---
name: <skill-name>
description: <1-2 句話，第三人稱>
author: <團隊/作者>
version: <版本號>
---

# <技能標題>

## When to Use

Load this skill when:
- 場景 1
- 場景 2

## Instructions

To accomplish task:

1. 步驟 1
2. 步驟 2

## Bundled Resources

For detailed information:
- `references/api-docs.md`
- `scripts/helper.py`
```

**必檢清單**：

- [ ] `name` 使用連字元格式
- [ ] `description` 是 1-2 句話，第三人稱
- [ ] 指令使用 imperative/infinitive 形式
- [ ] 包含 `author` 和 `version` 欄位（團隊規範）
- [ ] 詳細的 `When to Use` 說明

## CI/CD 整合最佳實踐

### 1. 非互動式安裝和同步

**場景**：在 CI/CD 環境中自動化技能管理

**使用 `-y` 標誌跳過互動式提示**：

```bash
# CI/CD 腳本範例
#!/bin/bash

# 安裝技能（非互動式）
npx openskills install anthropics/skills -y
npx openskills install git@github.com:your-org/team-skills.git -y

# 同步到 AGENTS.md（非互動式）
npx openskills sync -y
```

**GitHub Actions 範例**：

```yaml
name: Setup Skills

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install OpenSkills
        run: npx openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Verify Skills
        run: npx openskills list
```

### 2. 技能更新自動化

**定時更新技能**：

```yaml
# .github/workflows/update-skills.yml
name: Update Skills

on:
  schedule:
    - cron: '0 0 * * 0'  # 每週日更新
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update Skills
        run: npx openskills update -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add AGENTS.md
          git diff --staged --quiet || git commit -m "Update skills"
          git push
```

### 3. 自訂輸出路徑

**場景**：將技能同步到自訂檔案（如 `.ruler/AGENTS.md`）

```bash
# 同步到自訂檔案
npx openskills sync -o .ruler/AGENTS.md -y
```

**CI/CD 範例**：

```yaml
# 為不同 AI 代理生成不同的 AGENTS.md
- name: Sync for Claude Code
  run: npx openskills sync -o AGENTS.md -y

- name: Sync for Cursor
  run: npx openskills sync -o .cursor/AGENTS.md -y

- name: Sync for Windsurf
  run: npx openskills sync -o .windsurf/AGENTS.md -y
```

## 常見問題與解決方案

### 問題 1：技能找不到

**症狀**：

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**排查步驟**：

1. 檢查技能是否已安裝：
   ```bash
   npx openskills list
   ```

2. 檢查技能名稱是否正確（區分大小寫）：
   ```bash
   # ❌ 錯誤
   npx openskills read My-Skill

   # ✅ 正確
   npx openskills read my-skill
   ```

3. 檢查技能是否在優先級更高的目錄中被覆蓋：
   ```bash
   # 查看技能位置
   ls -la .claude/skills/my-skill
   ls -la ~/.claude/skills/my-skill
   ```

### 問題 2：符號連結無法存取

**症狀**：

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**解決方案**：

- **macOS**：在系統偏好設定中允許符號連結
- **Windows**：使用 Git Bash 或 WSL（Windows 原生不支援符號連結）
- **Linux**：檢查檔案系統權限

### 問題 3：技能更新後未生效

**症狀**：

```bash
npx openskills update
# ✅ Skills updated successfully

npx openskills read my-skill
# 內容仍然是舊版本
```

**原因**：AI 代理快取了舊的技能內容。

**解決方案**：

1. 重新同步 AGENTS.md：
   ```bash
   npx openskills sync
   ```

2. 檢查技能檔案的時間戳記：
   ```bash
   ls -la .claude/skills/my-skill/SKILL.md
   ```

3. 如果使用符號連結，重新載入技能：
   ```bash
   npx openskills read my-skill
   ```

## 本課小結

OpenSkills 最佳實踐核心要點：

### 專案設定

- ✅ 專案本地安裝：特定專案的專屬技能
- ✅ 全域安裝：所有專案通用的技能
- ✅ Universal 模式：多代理環境共享技能
- ✅ 優先使用 `npx` 而不是全域安裝

### 技能管理

- ✅ SKILL.md 寫作規範：連字元命名、第三人稱描述、imperative 指令
- ✅ 檔案大小控制：SKILL.md < 5000 詞，詳細文件放 `references/`
- ✅ 技能查找優先級：理解 4 個目錄的優先級和去重機制

### 本地開發

- ✅ 使用符號連結進行迭代開發
- ✅ 多專案共享技能：全域安裝、符號連結、Git Submodule

### 團隊協作

- ✅ 技能版本控制：獨立儲存庫、Git Tag
- ✅ 統一命名規範：工具、框架、工作流程
- ✅ 統一文件規範：author、version、When to Use

### CI/CD 整合

- ✅ 非互動式安裝和同步：`-y` 標誌
- ✅ 自動化更新：定時任務、workflow_dispatch
- ✅ 自訂輸出路徑：`-o` 標誌

## 下一課預告

> 下一課我們學習 **[常見問題解答](../faq/faq/)**。
>
> 你會學到：
> - OpenSkills 常見問題的快速解答
> - 安裝失敗、技能未載入等問題的排查方法
> - 與 Claude Code 共存的設定技巧

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 技能查找優先級 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| 技能去重機制 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 42-43, 57 |
| 符號連結處理 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 10-25 |
| YAML 欄位提取 | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| 路徑遍歷防護 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 71-78 |
| 非互動式安裝 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 424 |
| 自訂輸出路徑 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 19-36 |

**關鍵常數**：
- 4 個技能查找目錄：`./.agent/skills/`、`~/.agent/skills/`、`./.claude/skills/`、`~/.claude/skills/`

**關鍵函數**：
- `getSearchDirs(): string[]` - 回傳按優先級排序的技能查找目錄
- `isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean` - 檢查目錄或符號連結指向目錄
- `extractYamlField(content: string, field: string): string` - 提取 YAML 欄位值（非貪婪匹配）
- `isPathInside(path: string, targetDir: string): boolean` - 驗證路徑是否在目標目錄內（防止路徑遍歷）

**範例技能檔案**：
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - 最小結構範例
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - 格式規範參考

</details>
