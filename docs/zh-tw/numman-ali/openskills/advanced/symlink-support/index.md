---
title: "符號連結：Git 自動更新 | OpenSkills"
subtitle: "符號連結：Git 自動更新"
sidebarTitle: "Git 自動更新技能"
description: "學習 OpenSkills 符號連結功能，透過 symlink 實現基於 git 的技能自動更新和本地開發工作流程，大幅提升效率。"
tags:
  - "進階"
  - "符號連結"
  - "本地開發"
  - "技能管理"
prerequisite:
  - "platforms-install-sources"
  - "start-first-skill"
order: 3
---

# 符號連結支援

## 學完你能做什麼

- 理解符號連結的核心價值和適用場景
- 掌握 `ln -s` 指令建立符號連結
- 了解 OpenSkills 如何自動處理符號連結
- 實現基於 git 的技能自動更新
- 高效進行本地技能開發
- 處理損壞的符號連結

::: info 前置知識

本教程假設你已經了解了 [安裝來源詳解](../../platforms/install-sources/) 和 [安裝第一個技能](../../start/first-skill/)，理解基本的技能安裝流程。

:::

---

## 你現在的困境

你可能已經學會了如何安裝和更新技能，但是在使用**符號連結**時面臨以下問題：

- **本地開發更新麻煩**：修改技能後需要重新安裝或手動複製檔案
- **多專案共享技能困難**：同一個技能在多個專案中使用，每次更新都需要同步
- **版本管理混亂**：技能檔案分散在不同專案，難以用 git 統一管理
- **更新流程繁瑣**：從 git 倉庫更新技能需要重新安裝整個倉庫

其實 OpenSkills 支援符號連結，可以讓你透過 symlink 實現基於 git 的技能自動更新和高效的本地開發工作流程。

---

## 什麼時候用這一招

**符號連結的適用場景**：

| 場景 | 是否需要符號連結 | 範例 |
|--- | --- | ---|
| **本地技能開發** | ✅ 是 | 開發自訂技能，頻繁修改和測試 |
| **多專案共享技能** | ✅ 是 | 團隊共享技能倉庫，多個專案同時使用 |
| **基於 git 的自動更新** | ✅ 是 | 技能倉庫更新後，所有專案自動獲得最新版本 |
| **一次安裝，永久使用** | ❌ 否 | 只安裝不修改，直接用 `install` 即可 |
| **測試第三方技能** | ❌ 否 | 臨時測試技能，不需要符號連結 |

::: tip 推薦做法

- **本地開發用符號連結**：開發自己的技能時，使用 symlink 避免重複複製
- **團隊共享用 git + symlink**：團隊技能倉庫放在 git 中，各專案透過 symlink 共享
- **生產環境用普通安裝**：穩定部署時，使用普通 `install` 安裝，避免依賴外部目錄

:::

---

## 核心思路：連結而非複製

**傳統安裝方式**：

```
┌─────────────────┐
│  Git 倉庫       │
│  ~/dev/skills/ │
│  └── my-skill/ │
└────────┬────────┘
          │ 複製
          ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/ │
│     └── 完整副本 │
└─────────────────┘
```

**問題**：Git 倉庫更新後，`.claude/skills/` 中的技能不會自動更新。

**符號連結方式**：

```
┌─────────────────┐
│  Git 倉庫       │
│  ~/dev/skills/ │
│  └── my-skill/ │ ← 真實檔案在這裡
└────────┬────────┘
          │ 符號連結（ln -s）
          ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/ │ → 指向 ~/dev/skills/my-skill
└─────────────────┘
```

**優勢**：Git 倉庫更新後，符號連結指向的內容自動更新，無需重新安裝。

::: info 重要概念

**符號連結**：一種特殊的檔案類型，它指向另一個檔案或目錄。OpenSkills 在查找技能時會自動識別符號連結並跟隨它們指向的實際內容。損壞的符號連結（指向不存在的目標）會被自動跳過，不會導致崩潰。

:::

**原始碼實作**（`src/utils/skills.ts:10-25`）：

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync follows symlinks
      return stats.isDirectory();
    } catch {
      // Broken symlink or permission error
      return false;
    }
  }
  return false;
}
```

**關鍵點**：
- `entry.isSymbolicLink()` 偵測符號連結
- `statSync()` 自動跟隨符號連結到目標
- `try/catch` 擷取損壞的符號連結，返回 `false` 跳過

---

## 跟我做

### 第 1 步：建立技能倉庫

**為什麼**
先建立一個 git 倉庫用於存放技能，模擬團隊共享的場景。

開啟終端機，執行：

```bash
# 建立技能倉庫目錄
mkdir -p ~/dev/my-skills
cd ~/dev/my-skills

# 初始化 git 倉庫
git init

# 建立一個範例技能
mkdir -p my-first-skill
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: A sample skill for demonstrating symlink support
---

# My First Skill

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
EOF

# 提交到 git
git add .
git commit -m "Initial commit: Add my-first-skill"
```

**你應該看到**：成功建立 git 倉庫並提交技能。

**說明**：
- 技能存放在 `~/dev/my-skills/` 目錄
- 使用 git 版本管理，方便團隊協作
- 這個目錄是技能的「真實位置」

---

### 第 2 步：建立符號連結

**為什麼**
學習如何使用 `ln -s` 指令建立符號連結。

繼續在專案目錄執行：

```bash
# 返回專案根目錄
cd ~/my-project

# 建立技能目錄
mkdir -p .claude/skills

# 建立符號連結
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# 查看符號連結
ls -la .claude/skills/
```

**你應該看到**：

```
.claude/skills/
└── my-first-skill -> /Users/yourname/dev/my-skills/my-first-skill
```

**說明**：
- `ln -s` 建立符號連結
- `->` 後面顯示指向的實際路徑
- 符號連結本身只是一個「指標」，不佔用實際空間

---

### 第 3 步：驗證符號連結工作正常

**為什麼**
確認 OpenSkills 能夠正確識別和讀取符號連結技能。

執行：

```bash
# 列出技能
npx openskills list

# 讀取技能內容
npx openskills read my-first-skill
```

**你應該看到**：

```
  my-first-skill           (project)
    A sample skill for demonstrating symlink support

Summary: 1 project, 0 global (1 total)
```

讀取技能輸出：

```markdown
---
name: my-first-skill
description: A sample skill for demonstrating symlink support
---

# My First Skill

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
```

**說明**：
- OpenSkills 自動識別符號連結
- 符號連結技能顯示 `(project)` 標籤
- 讀取的內容來自符號連結指向的原始檔案

---

### 第 4 步：基於 git 的自動更新

**為什麼**
體驗符號連結的最大優勢：git 倉庫更新後，技能自動同步。

在技能倉庫中修改技能：

```bash
# 進入技能倉庫
cd ~/dev/my-skills

# 修改技能內容
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: Updated version with new features
---

# My First Skill (Updated)

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
3. NEW: This feature was updated via git!
EOF

# 提交更新
git add .
git commit -m "Update skill: Add new feature"
```

現在在專案目錄驗證更新：

```bash
# 返回專案目錄
cd ~/my-project

# 讀取技能（無需重新安裝）
npx openskills read my-first-skill
```

**你應該看到**：技能內容已自動更新，包含新的功能說明。

**說明**：
- 符號連結指向的檔案更新後，OpenSkills 自動讀取最新內容
- 無需重新執行 `openskills install`
- 實現了「一次更新，處處生效」

---

### 第 5 步：多專案共享技能

**為什麼**
體驗符號連結在多專案場景下的優勢，避免技能重複安裝。

建立第二個專案：

```bash
# 建立第二個專案
mkdir ~/my-second-project
cd ~/my-second-project

# 建立技能目錄和符號連結
mkdir -p .claude/skills
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# 驗證技能可用
npx openskills list
```

**你應該看到**：

```
  my-first-skill           (project)
    Updated version with new features

Summary: 1 project, 0 global (1 total)
```

**說明**：
- 多個專案可以建立指向同一個技能的符號連結
- 技能倉庫更新後，所有專案自動獲得最新版本
- 避免了技能重複安裝和更新

---

### 第 6 步：處理損壞的符號連結

**為什麼**
了解 OpenSkills 如何優雅地處理損壞的符號連結。

模擬損壞的符號連結：

```bash
# 刪除技能倉庫
rm -rf ~/dev/my-skills

# 嘗試列出技能
npx openskills list
```

**你應該看到**：損壞的符號連結被自動跳過，不會報錯。

```
Summary: 0 project, 0 global (0 total)
```

**說明**：
- 原始碼中的 `try/catch` 擷取損壞的符號連結
- OpenSkills 會跳過損壞的連結，繼續查找其他技能
- 不會導致 `openskills` 指令崩潰

---

## 檢查點 ✅

完成以下檢查，確認你掌握了本課內容：

- [ ] 理解符號連結的核心價值
- [ ] 掌握 `ln -s` 指令的使用
- [ ] 了解符號連結和複製檔案的區別
- [ ] 能夠建立基於 git 的技能倉庫
- [ ] 能夠實現技能的自動更新
- [ ] 知道如何在多專案中共享技能
- [ ] 理解損壞符號連結的處理機制

---

## 踩坑提醒

### 常見錯誤 1：符號連結路徑錯誤

**錯誤場景**：使用相對路徑建立符號連結，移動專案後連結失效。

```bash
# ❌ 錯誤：使用相對路徑
cd ~/my-project
ln -s ../dev/my-skills/my-first-skill .claude/skills/my-first-skill

# 移動專案後連結失效
mv ~/my-project ~/new-location/project
npx openskills list  # ❌ 找不到技能
```

**問題**：
- 相對路徑依賴於當前工作目錄
- 移動專案後相對路徑失效
- 符號連結指向錯誤位置

**正確做法**：

```bash
# ✅ 正確：使用絕對路徑
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# 移動專案後仍然有效
mv ~/my-project ~/new-location/project
npx openskills list  # ✅ 仍然可以找到技能
```

---

### 常見錯誤 2：混淆硬連結和符號連結

**錯誤場景**：使用硬連結而不是符號連結。

```bash
# ❌ 錯誤：使用硬連結（沒有 -s 參數）
ln ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# 硬連結是檔案的另一個入口，不是指標
# 無法實現「更新一處，處處生效」
```

**問題**：
- 硬連結是檔案的另一個入口名
- 修改任何一個硬連結，其他硬連結也會更新
- 但刪除來源檔案後，硬連結仍然存在，造成混亂
- 無法跨檔案系統使用

**正確做法**：

```bash
# ✅ 正確：使用符號連結（帶 -s 參數）
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# 符號連結是指標
# 刪除來源檔案後，符號連結會失效（OpenSkills 會跳過）
```

---

### 常見錯誤 3：符號連結指向錯誤的位置

**錯誤場景**：符號連結指向技能目錄的父目錄，而不是技能目錄本身。

```bash
# ❌ 錯誤：指向父目錄
ln -s ~/dev/my-skills .claude/skills/my-skills-link

# OpenSkills 會在 .claude/skills/my-skills-link/ 下查找 SKILL.md
# 但實際 SKILL.md 在 ~/dev/my-skills/my-first-skill/SKILL.md
```

**問題**：
- OpenSkills 會查找 `<link>/SKILL.md`
- 但實際技能在 `<link>/my-first-skill/SKILL.md`
- 導致找不到技能檔案

**正確做法**：

```bash
# ✅ 正確：直接指向技能目錄
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# OpenSkills 會查找 .claude/skills/my-first-skill/SKILL.md
# 符號連結指向的目錄中就包含 SKILL.md
```

---

### 常見錯誤 4：忘記同步 AGENTS.md

**錯誤場景**：建立符號連結後忘記同步 AGENTS.md。

```bash
# 建立符號連結
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ❌ 錯誤：忘記同步 AGENTS.md
# AI 代理無法知道有新技能可用
```

**問題**：
- 符號連結建立了，但 AGENTS.md 未更新
- AI 代理不知道有新技能
- 無法呼叫新技能

**正確做法**：

```bash
# 建立符號連結
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ✅ 正確：同步 AGENTS.md
npx openskills sync

# 現在 AI 代理可以看到新技能
```

---

## 本課小結

**核心要點**：

1. **符號連結是指標**：使用 `ln -s` 建立，指向真實的檔案或目錄
2. **自動跟隨連結**：OpenSkills 使用 `statSync()` 自動跟隨符號連結
3. **損壞連結自動跳過**：`try/catch` 擷取異常，避免崩潰
4. **基於 git 自動更新**：Git 倉庫更新後，技能自動同步
5. **多專案共享**：多個專案可以建立指向同一技能的符號連結

**決策流程**：

```
[需要使用技能] → [是否需要頻繁修改？]
                         ↓ 是
                 [使用符號連結（本地開發）]
                         ↓ 否
                 [是否多個專案共享？]
                         ↓ 是
                 [使用 git + 符號連結]
                         ↓ 否
                 [使用普通 install]
```

**記憶口訣**：

- **本地開發用 symlink**：頻繁修改，避免重複複製
- **團隊共享 git 連結**：一次更新，處處生效
- **絕對路徑保穩定**：避免相對路徑失效
- **損壞連結自動跳**：OpenSkills 自動處理

---

## 下一課預告

> 下一課我們學習 **[建立自訂技能](../create-skills/)**。
>
> 你會學到：
> - 如何從零開始建立自己的技能
> - 理解 SKILL.md 格式和 YAML frontmatter
> - 如何組織技能目錄結構（references/、scripts/、assets/）
> - 如何編寫高品質的技能說明

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能            | 檔案路徑                                                                                              | 行號    |
|--- | --- | ---|
| 符號連結偵測    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)      | 10-25   |
| 技能查找        | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L30-L64)      | 30-64   |
| 單個技能查找    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84)      | 69-84   |

**關鍵函式**：

- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`：判斷目錄項是真實目錄還是指向目錄的符號連結
  - 使用 `entry.isSymbolicLink()` 偵測符號連結
  - 使用 `statSync()` 自動跟隨符號連結到目標
  - `try/catch` 擷取損壞的符號連結，返回 `false`

- `findAllSkills()`：查找所有已安裝的技能
  - 遍歷 4 個搜尋目錄
  - 呼叫 `isDirectoryOrSymlinkToDirectory` 識別符號連結
  - 自動跳過損壞的符號連結

**業務規則**：

- 符號連結被自動識別為技能目錄
- 損壞的符號連結會被優雅地跳過，不會導致崩潰
- 符號連結和真實目錄的查找優先級相同

</details>
