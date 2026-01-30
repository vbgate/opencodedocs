---
title: "疑難排解：解決 OpenSkills 常見問題 | openskills"
sidebarTitle: "遇到錯誤怎麼辦"
subtitle: "疑難排解：解決 OpenSkills 常見問題"
description: "解決 OpenSkills 常見錯誤。本教學涵蓋 Git clone 失敗、找不到 SKILL.md、技能未找到、權限錯誤、更新跳過等問題，提供詳細的排查步驟和修復方法，幫助你快速解決使用中的各種故障。"
tags:
- FAQ
- 疑難排解
- 錯誤解決
prerequisite:
- "start-quick-start"
- "start-installation"
order: 2
---

# 疑難排解：解決 OpenSkills 常見問題

## 學完你能做什麼

- 快速診斷和修復 OpenSkills 使用中的常見問題
- 理解錯誤訊息背後的原因
- 掌握排查 Git 複製、權限、檔案格式等問題的技巧
- 了解何時需要重新安裝技能

## 你現在的困境

使用 OpenSkills 時遇到了錯誤，不知道怎麼辦：

```
Error: No SKILL.md files found in repository
```

或者 git clone 失敗、權限錯誤、檔案格式不正確……這些問題都可能導致技能無法正常使用。

## 什麼時候需要看這篇教學

當你遇到以下情況時：

- **安裝失敗**：從 GitHub 或本地路徑安裝時出錯
- **讀取失敗**：`openskills read` 提示找不到技能
- **同步失敗**：`openskills sync` 提示無技能或檔案格式錯誤
- **更新失敗**：`openskills update` 跳過某些技能
- **權限錯誤**：提示路徑存取受限或安全錯誤

## 核心思路

OpenSkills 的錯誤主要分為 4 類：

| 錯誤類型 | 常見原因 | 解決思路 |
| --- | --- | --- |
| **Git 相關** | 網路問題、SSH 設定、儲存庫不存在 | 檢查網路、設定 Git 憑證、驗證儲存庫位址 |
| **檔案相關** | SKILL.md 缺失、格式錯誤、路徑錯誤 | 檢查檔案存在性、驗證 YAML 格式 |
| **權限相關** | 目錄權限、路徑遍歷、符號連結 | 檢查目錄權限、驗證安裝路徑 |
| **中繼資料相關** | 更新時中繼資料遺失、源路徑變化 | 重新安裝技能以恢復中繼資料 |

**排查技巧**：
1. **看錯誤訊息**：紅色輸出通常包含具體原因
2. **看黃色提示**：通常是警告和建議，如 `Tip: For private repos...`
3. **檢查目錄結構**：用 `openskills list` 查看已安裝技能
4. **查看原始碼位置**：錯誤訊息會列出搜尋路徑（4 個目錄）

---

## 安裝失敗

### 問題 1：Git clone 失敗

**錯誤訊息**：
```
Failed to clone repository
fatal: repository '...' not found
Tip: For private repos, ensure git SSH keys or credentials are configured
```

**可能原因**：

| 原因 | 場景 |
| --- | --- |
| 儲存庫不存在 | 拼寫錯誤的 owner/repo |
| 私有儲存庫 | 未設定 SSH key 或 Git 憑證 |
| 網路問題 | 無法存取 GitHub |

**解決方法**：

1. **驗證儲存庫位址**：
```bash
# 在瀏覽器中存取儲存庫 URL
https://github.com/owner/repo
```

2. **檢查 Git 設定**（私有儲存庫）：
```bash
# 檢查 SSH 設定
ssh -T git@github.com

# 設定 Git 憑證
git config --global credential.helper store
```

3. **測試複製**：
```bash
git clone https://github.com/owner/repo.git
```

**你應該看到**：
- 儲存庫成功複製到本地目錄

---

### 問題 2：找不到 SKILL.md

**錯誤訊息**：
```
Error: No SKILL.md files found in repository
Error: No valid SKILL.md files found
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 儲存庫無 SKILL.md | 儲存庫不是技能儲存庫 |
| SKILL.md 無 frontmatter | 缺少 YAML 中繼資料 |
| SKILL.md 格式錯誤 | YAML 語法錯誤 |

**解決方法**：

1. **檢查儲存庫結構**：
```bash
# 查看儲存庫根目錄
ls -la

# 查看是否有 SKILL.md
find . -name "SKILL.md"
```

2. **驗證 SKILL.md 格式**：
```markdown
---
name: 技能名稱
description: 技能描述
---

技能內容...
```

**必須**：
- 開頭有 `---` 分隔的 YAML frontmatter
- 包含 `name` 和 `description` 欄位

3. **查看官方範例**：
```bash
git clone https://github.com/anthropics/skills.git
cd skills
ls -la
```

**你應該看到**：
- 儲存庫中包含一個或多個 `SKILL.md` 檔案
- 每個 SKILL.md 開頭有 YAML frontmatter

---

### 問題 3：路徑不存在或不是目錄

**錯誤訊息**：
```
Error: Path does not exist: /path/to/skill
Error: Path must be a directory
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 路徑拼寫錯誤 | 輸入了錯誤的路徑 |
| 路徑指向檔案 | 應該是目錄而不是檔案 |
| 路徑未展開 | 使用 `~` 時需要展開 |

**解決方法**：

1. **驗證路徑存在**：
```bash
# 檢查路徑
ls -la /path/to/skill

# 檢查是否為目錄
file /path/to/skill
```

2. **使用絕對路徑**：
```bash
# 取得絕對路徑
realpath /path/to/skill

# 安裝時使用絕對路徑
openskills install /absolute/path/to/skill
```

3. **使用相對路徑**：
```bash
# 在專案目錄中
openskills install ./skills/my-skill
```

**你應該看到**：
- 路徑存在且是目錄
- 目錄中包含 `SKILL.md` 檔案

---

### 問題 4：SKILL.md 無效

**錯誤訊息**：
```
Error: Invalid SKILL.md (missing YAML frontmatter)
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 缺少必要欄位 | 必須有 `name` 和 `description` |
| YAML 語法錯誤 | 冒號、引號等格式問題 |

**解決方法**：

1. **檢查 YAML frontmatter**：
```markdown
--- ← 開始分隔符
name: my-skill ← 必要
description: 技能描述 ← 必要
--- ← 結束分隔符
```

2. **使用線上 YAML 驗證工具**：
- 存取 YAML Lint 或類似工具驗證語法

3. **參考官方範例**：
```bash
openskills install anthropics/skills
cat .claude/skills/*/SKILL.md | head -20
```

**你應該看到**：
- SKILL.md 開頭有正確的 YAML frontmatter
- 包含 `name` 和 `description` 欄位

---

### 問題 5：路徑遍歷安全錯誤

**錯誤訊息**：
```
Security error: Installation path outside target directory
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 技能名稱包含 `..` | 嘗試存取目標目錄外的路徑 |
| 符號連結指向外部 | symlink 指向目標目錄外 |
| 惡意技能 | 技能試圖繞過安全限制 |

**解決方法**：

1. **檢查技能名稱**：
- 確保技能名稱不包含 `..`、`/` 等特殊字元

2. **檢查符號連結**：
```bash
# 查看技能目錄中的符號連結
find .claude/skills/skill-name -type l

# 查看符號連結目標
ls -la .claude/skills/skill-name
```

3. **使用安全的技能**：
- 僅從可信來源安裝技能
- 審查技能程式碼後再安裝

**你應該看到**：
- 技能名稱只包含字母、數字、連字號
- 無指向外部的符號連結

---

## 讀取失敗

### 問題 6：技能未找到

**錯誤訊息**：
```
Error: Skill(s) not found: my-skill

Searched:
.agent/skills/ (project universal)
~/.agent/skills/ (global universal)
.claude/skills/ (project)
~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 技能未安裝 | 該技能沒有安裝在任意目錄中 |
| 技能名稱拼寫錯誤 | 名稱不匹配 |
| 安裝在其他位置 | 技能安裝在非標準目錄 |

**解決方法**：

1. **查看已安裝技能**：
```bash
openskills list
```

2. **檢查技能名稱**：
- 對比 `openskills list` 輸出
- 確保名稱完全匹配（區分大小寫）

3. **安裝缺失技能**：
```bash
openskills install owner/repo
```

4. **搜尋所有目錄**：
```bash
# 檢查 4 個技能目錄
ls -la .agent/skills/
ls -la ~/.agent/skills/
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

**你應該看到**：
- `openskills list` 顯示目標技能
- 技能存在於 4 個目錄之一

---

### 問題 7：未提供技能名

**錯誤訊息**：
```
Error: No skill names provided
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 忘記傳參 | `openskills read` 後沒有參數 |
| 空字串 | 傳遞了空字串 |

**解決方法**：

1. **提供技能名**：
```bash
# 單個技能
openskills read my-skill

# 多個技能（逗號分隔）
openskills read skill1,skill2,skill3
```

2. **先查看可用技能**：
```bash
openskills list
```

**你應該看到**：
- 成功讀取技能內容到標準輸出

---

## 同步失敗

### 問題 8：輸出檔案不是 Markdown

**錯誤訊息**：
```
Error: Output file must be a markdown file (.md)
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 輸出檔案不是 .md | 指定了 .txt、.json 等格式 |
| --output 參數錯誤 | 路徑不以 .md 結尾 |

**解決方法**：

1. **使用 .md 檔案**：
```bash
# 正確
openskills sync -o AGENTS.md
openskills sync -o custom.md

# 錯誤
openskills sync -o AGENTS.txt
openskills sync -o AGENTS
```

2. **自訂輸出路徑**：
```bash
# 輸出到子目錄
openskills sync -o .ruler/AGENTS.md
openskills sync -o docs/agents.md
```

**你應該看到**：
- 成功產生 .md 檔案
- 檔案包含技能 XML 部分

---

### 問題 9：無技能安裝

**錯誤訊息**：
```
No skills installed. Install skills first:
npx openskills install anthropics/skills --project
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 從未安裝技能 | 首次使用 OpenSkills |
| 刪除了技能目錄 | 手動刪除了技能檔案 |

**解決方法**：

1. **安裝技能**：
```bash
# 安裝官方技能
openskills install anthropics/skills

# 從其他儲存庫安裝
openskills install owner/repo
```

2. **驗證安裝**：
```bash
openskills list
```

**你應該看到**：
- `openskills list` 顯示至少一個技能
- 同步成功

---

## 更新失敗

### 問題 10：無源中繼資料

**錯誤訊息**：
```
Skipped: my-skill (no source metadata; re-install once to enable updates)
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 舊版本安裝 | 技能安裝於中繼資料功能之前 |
| 手動複製 | 直接複製技能目錄，未透過 OpenSkills 安裝 |
| 中繼資料檔案損壞 | `.openskills.json` 損壞或遺失 |

**解決方法**：

1. **重新安裝技能**：
```bash
# 刪除舊技能
openskills remove my-skill

# 重新安裝
openskills install owner/repo
```

2. **檢查中繼資料檔案**：
```bash
# 查看技能中繼資料
cat .claude/skills/my-skill/.openskills.json
```

3. **保留技能但新增中繼資料**：
- 手動建立 `.openskills.json`（不建議）
- 重新安裝更簡單可靠

**你應該看到**：
- 更新成功，無跳過警告

---

### 問題 11：本地源缺失

**錯誤訊息**：
```
Skipped: my-skill (local source missing)
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 本地路徑被移動 | 源目錄位置改變 |
| 本地路徑被刪除 | 源目錄不存在 |
| 路徑未展開 | 使用 `~` 但中繼資料中儲存了展開路徑 |

**解決方法**：

1. **檢查中繼資料中的本地路徑**：
```bash
cat .claude/skills/my-skill/.openskills.json
```

2. **恢復源目錄或更新中繼資料**：
```bash
# 如果源目錄移動了
openskills remove my-skill
openskills install /new/path/to/skill

# 或者手動編輯中繼資料（不建議）
vi .claude/skills/my-skill/.openskills.json
```

**你應該看到**：
- 本地源路徑存在且包含 `SKILL.md`

---

### 問題 12：儲存庫中找不到 SKILL.md

**錯誤訊息**：
```
SKILL.md missing for my-skill
Skipped: my-skill (SKILL.md not found in repo at subpath)
```

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 儲存庫結構變化 | 技能子路徑或名稱改變 |
| 技能被刪除 | 儲存庫中不再包含該技能 |
| 子路徑錯誤 | 中繼資料中記錄的子路徑不正確 |

**解決方法**：

1. **存取儲存庫查看結構**：
```bash
# 複製儲存庫查看
git clone https://github.com/owner/repo.git
cd repo
ls -la
find . -name "SKILL.md"
```

2. **重新安裝技能**：
```bash
openskills remove my-skill
openskills install owner/repo/subpath
```

3. **檢查儲存庫更新歷史**：
- 在 GitHub 上查看儲存庫的 commit 歷史
- 查找技能移動或刪除的記錄

**你應該看到**：
- 更新成功
- SKILL.md 存在於記錄的子路徑中

---

## 權限問題

### 問題 13：目錄權限受限

**現象**：

| 操作 | 現象 |
| --- | --- |
| 安裝失敗 | 提示權限錯誤 |
| 刪除失敗 | 提示無法刪除檔案 |
| 讀取失敗 | 提示檔案存取受限 |

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 目錄權限不足 | 使用者無寫入權限 |
| 檔案權限不足 | 檔案唯讀 |
| 系統保護 | macOS SIP、Windows UAC 限制 |

**解決方法**：

1. **檢查目錄權限**：
```bash
# 查看權限
ls -la .claude/skills/

# 修改權限（謹慎使用）
chmod -R 755 .claude/skills/
```

2. **使用 sudo（不建議）**：
```bash
# 最後的手段
sudo openskills install owner/repo
```

3. **檢查系統保護**：
```bash
# macOS：檢查 SIP 狀態
csrutil status

# 如需停用 SIP（需要恢復模式）
# 不建議，僅在必要時使用
```

**你應該看到**：
- 正常讀寫目錄和檔案

---

## 符號連結問題

### 問題 14：符號連結損壞

**現象**：

| 現象 | 說明 |
| --- | --- |
| 列表時跳過技能 | `openskills list` 不顯示該技能 |
| 讀取失敗 | 提示檔案不存在 |
| 更新失敗 | 源路徑無效 |

**可能原因**：

| 原因 | 說明 |
| --- | --- |
| 目標目錄被刪除 | 符號連結指向不存在的路徑 |
| 符號連結損壞 | 連結檔案本身損壞 |
| 跨裝置連結 | 某些系統不支援跨裝置的符號連結 |

**解決方法**：

1. **檢查符號連結**：
```bash
# 查找所有符號連結
find .claude/skills -type l

# 查看連結目標
ls -la .claude/skills/my-skill

# 測試連結
readlink .claude/skills/my-skill
```

2. **刪除損壞的符號連結**：
```bash
openskills remove my-skill
```

3. **重新安裝**：
```bash
openskills install owner/repo
```

**你應該看到**：
- 無損壞的符號連結
- 技能正常顯示和讀取

---

## 踩坑提醒

::: warning 常見錯誤操作

**❌ 不要這樣做**：

- **直接複製技能目錄** → 會導致中繼資料缺失，更新失敗
- **手動編輯 `.openskills.json`** → 容易破壞格式，導致更新失敗
- **使用 sudo 安裝技能** → 會建立 root 擁有的檔案，後續操作可能需要 sudo
- **刪除 `.openskills.json`** → 會導致更新時跳過該技能

**✅ 應該這樣做**：

- 透過 `openskills install` 安裝 → 自動建立中繼資料
- 透過 `openskills remove` 刪除 → 正確清理檔案
- 透過 `openskills update` 更新 → 自動從源重新整理
- 透過 `openskills list` 檢查 → 確認技能狀態

:::

::: tip 排查技巧

1. **從簡單開始**：先執行 `openskills list` 確認狀態
2. **看完整錯誤訊息**：黃色提示通常包含解決建議
3. **檢查目錄結構**：用 `ls -la` 查看檔案和權限
4. **驗證原始碼位置**：錯誤訊息會列出 4 個搜尋目錄
5. **使用 -y 跳過互動**：在 CI/CD 或指令碼中使用 `-y` 標誌

:::

---

## 本課小結

本課學習了 OpenSkills 常見問題的排查和修復方法：

| 問題類型 | 關鍵解決方法 |
| --- | --- |
| Git clone 失敗 | 檢查網路、設定憑證、驗證儲存庫位址 |
| 找不到 SKILL.md | 檢查儲存庫結構、驗證 YAML 格式 |
| 讀取失敗 | 用 `openskills list` 檢查技能狀態 |
| 更新失敗 | 重新安裝技能恢復中繼資料 |
| 權限問題 | 檢查目錄權限、避免使用 sudo |

**記住**：
- 錯誤訊息通常包含明確的提示
- 重新安裝是解決中繼資料問題的最簡單方法
- 只從可信來源安裝技能

## 下一步

- **查看 [常見問題 (FAQ)](../faq/)** → 更多疑問的解答
- **學習 [最佳實踐](../../advanced/best-practices/)** → 避免常見錯誤
- **探索 [安全說明](../../advanced/security/)** → 了解安全機制

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Git clone 失敗處理 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L162-L168) | 162-168 |
| 路徑不存在錯誤 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L205-L207) | 205-207 |
| 不是目錄錯誤 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L210-L213) | 210-213 |
| SKILL.md 無效 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L241-L243) | 241-243 |
| 路徑遍歷安全錯誤 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L256-L259) | 256-259 |
| 找不到 SKILL.md | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L378-L380) | 378-380 |
| 未提供技能名 | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L10-L12) | 10-12 |
| 技能未找到 | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L26-L34) | 26-34 |
| 輸出檔案不是 Markdown | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L23-L25) | 23-25 |
| 無技能安裝 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L40-L43) | 40-43 |
| 無源中繼資料跳過 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L57-L61) | 57-61 |
| 本地源缺失 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L66-L71) | 66-71 |
| 儲存庫中找不到 SKILL.md | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L102-L107) | 102-107 |

**關鍵函式**：
- `hasValidFrontmatter(content)`: 驗證 SKILL.md 是否有有效的 YAML frontmatter
- `isPathInside(targetPath, targetDir)`: 驗證路徑是否在目標目錄內（安全檢查）
- `findSkill(name)`: 按優先順序在 4 個目錄中查找技能
- `readSkillMetadata(path)`: 讀取技能的安裝源中繼資料

**關鍵常數**：
- 搜尋目錄順序（`src/utils/skills.ts`）：
1. `.agent/skills/` (project universal)
2. `~/.agent/skills/` (global universal)
3. `.claude/skills/` (project)
4. `~/.claude/skills/` (global)

</details>
