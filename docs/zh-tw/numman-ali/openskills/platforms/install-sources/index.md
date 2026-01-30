---
title: "安裝來源：多種方式安裝技能 | openskills"
sidebarTitle: "三種來源任你選"
subtitle: "安裝來源詳解"
description: "學習 OpenSkills 技能的三種安裝方式。掌握從 GitHub 儲存庫、本機路徑、私有 Git 儲存庫安裝技能的方法，包括 SSH/HTTPS 認證和子路徑設定。"
tags:
  - "平台整合"
  - "技能管理"
  - "安裝設定"
prerequisite:
  - "start-first-skill"
order: 2
---

# 安裝來源詳解

## 學完你能做什麼

- 使用三種方式安裝技能：GitHub 儲存庫、本機路徑、私有 Git 儲存庫
- 根據情境選擇最合適的安裝來源
- 理解不同來源的優缺點和注意事項
- 掌握 GitHub shorthand、相對路徑、私有儲存庫 URL 等寫法

::: info 前置知識

本教學假設你已經完成了 [安裝第一個技能](../../start/first-skill/)，了解基本的安裝流程。

:::

---

## 你現在的困境

你可能已經學會了從官方儲存庫安裝技能，但是：

- **只有 GitHub 能用嗎？**：想用公司內部的 GitLab 儲存庫，不知道怎麼設定
- **本機開發的技能怎麼裝？**：正在開發自己的技能，想先在本機測試
- **想直接指定某個技能**：儲存庫裡有很多技能，不想每次都透過互動介面選擇
- **私有儲存庫怎麼存取？**：公司技能儲存庫是私有的，不知道怎麼認證

其實 OpenSkills 支援多種安裝來源，讓我們一個個來看。

---

## 什麼時候用這一招

**不同安裝來源的適用情境**：

| 安裝來源 | 適用情境 | 範例 |
| --- | --- | --- |
| **GitHub 儲存庫** | 使用開源社群的技能 | `openskills install anthropics/skills` |
| **本機路徑** | 開發和測試自己的技能 | `openskills install ./my-skill` |
| **私有 Git 儲存庫** | 使用公司內部的技能 | `openskills install git@github.com:my-org/private-skills.git` |

::: tip 建議做法

- **開源技能**：優先從 GitHub 儲存庫安裝，方便更新
- **開發階段**：從本機路徑安裝，即時測試修改
- **團隊協作**：使用私有 Git 儲存庫，統一管理內部技能

:::

---

## 核心思路：三種來源，同一機制

雖然安裝來源不同，但 OpenSkills 的底層機制是一樣的：

```
[識別來源類型] → [取得技能檔案] → [複製到 .claude/skills/]
```

**來源識別邏輯**（原始碼 `install.ts:25-45`）：

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**判斷優先順序**：
1. 先檢查是否為本機路徑（`isLocalPath`）
2. 再檢查是否為 Git URL（`isGitUrl`）
3. 最後作為 GitHub shorthand 處理（`owner/repo`）

---

## 跟我做

### 方式一：從 GitHub 儲存庫安裝

**適用情境**：安裝開源社群的技能，如 Anthropic 官方儲存庫、第三方的技能包。

#### 基本用法：安裝整個儲存庫

```bash
npx openskills install owner/repo
```

**範例**：從 Anthropic 官方儲存庫安裝技能

```bash
npx openskills install anthropics/skills
```

**你應該看到**：

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### 進階用法：指定子路徑（直接安裝某個技能）

如果儲存庫中有很多技能，你可以直接指定要安裝的技能子路徑，跳過互動式選擇：

```bash
npx openskills install owner/repo/skill-name
```

**範例**：直接安裝 PDF 處理技能

```bash
npx openskills install anthropics/skills/pdf
```

**你應該看到**：

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
   Location: /path/to/project/.claude/skills/pdf
```

::: tip 建議做法

當你只需要儲存庫中的一個技能時，使用子路徑格式可以跳過互動式選擇，更快捷。

:::

#### GitHub shorthand 規則（原始碼 `install.ts:131-143`）

| 格式 | 範例 | 轉換結果 |
| --- | --- | --- |
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |

---

### 方式二：從本機路徑安裝

**適用情境**：正在開發自己的技能，想在本機測試後再發布到 GitHub。

#### 使用絕對路徑

```bash
npx openskills install /absolute/path/to/skill
```

**範例**：從主目錄的技能目錄安裝

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### 使用相對路徑

```bash
npx openskills install ./local-skills/my-skill
```

**範例**：從專案目錄下的 `local-skills/` 子目錄安裝

```bash
npx openskills install ./local-skills/web-scraper
```

**你應該看到**：

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
   Location: /path/to/project/.claude/skills/web-scraper
```

::: warning 注意事項

本機路徑安裝會複製技能檔案到 `.claude/skills/`，後續對原始檔案的修改不會自動同步。如需更新，需重新安裝。

:::

#### 安裝包含多個技能的本機目錄

如果你的本機目錄結構是這樣的：

```
local-skills/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

你可以直接安裝整個目錄：

```bash
npx openskills install ./local-skills
```

這會啟動互動式選擇介面，讓你選擇要安裝的技能。

#### 本機路徑支援的格式（原始碼 `install.ts:25-32`）

| 格式 | 說明 | 範例 |
| --- | --- | --- |
| `/absolute/path` | 絕對路徑 | `/home/user/skills/my-skill` |
| `./relative/path` | 目前目錄的相對路徑 | `./local-skills/my-skill` |
| `../relative/path` | 父目錄的相對路徑 | `../shared-skills/common` |
| `~/path` | 主目錄的相對路徑 | `~/dev/my-skills` |

::: tip 開發技巧

使用 `~` 簡寫可以快速引用主目錄下的技能，適合個人開發環境。

:::

---

### 方式三：從私有 Git 儲存庫安裝

**適用情境**：使用公司內部的 GitLab/Bitbucket 儲存庫，或私有 GitHub 儲存庫。

#### SSH 方式（推薦）

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**範例**：從 GitHub 私有儲存庫安裝

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**你應該看到**：

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip 認證設定

SSH 方式要求你已經設定了 SSH 金鑰。如果複製失敗，請檢查：

```bash
# 測試 SSH 連線
ssh -T git@github.com

# 如果提示 "Hi username! You've successfully authenticated..."，說明設定正確
```

:::

#### HTTPS 方式（需要憑證）

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning HTTPS 認證

HTTPS 方式複製私有儲存庫時，Git 會提示輸入使用者名稱和密碼（或 Personal Access Token）。如果你使用的是雙重驗證，需要使用 Personal Access Token 而非帳戶密碼。

:::

#### 其他 Git 託管平台

**GitLab（SSH）**：

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab（HTTPS）**：

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket（SSH）**：

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket（HTTPS）**：

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip 建議做法

團隊內部技能建議使用私有 Git 儲存庫，這樣：
- 所有成員可以從同一個來源安裝
- 更新技能時只需 `openskills update`
- 便於版本管理和權限控制

:::

#### Git URL 識別規則（原始碼 `install.ts:37-45`）

| 前綴/後綴 | 說明 | 範例 |
| --- | --- | --- |
| `git@` | SSH 協定 | `git@github.com:owner/repo.git` |
| `git://` | Git 協定 | `git://github.com/owner/repo.git` |
| `http://` | HTTP 協定 | `http://github.com/owner/repo.git` |
| `https://` | HTTPS 協定 | `https://github.com/owner/repo.git` |
| `.git` 後綴 | Git 儲存庫（任何協定） | `owner/repo.git` |

---

## 檢查點 ✅

完成本課後，請確認：

- [ ] 知道如何從 GitHub 儲存庫安裝技能（`owner/repo` 格式）
- [ ] 知道如何直接安裝儲存庫中的某個技能（`owner/repo/skill-name`）
- [ ] 知道如何使用本機路徑安裝技能（`./`、`~/` 等）
- [ ] 知道如何從私有 Git 儲存庫安裝技能（SSH/HTTPS）
- [ ] 理解不同安裝來源的適用情境

---

## 踩坑提醒

### 問題 1：本機路徑不存在

**現象**：

```
Error: Path does not exist: ./local-skills/my-skill
```

**原因**：
- 路徑拼寫錯誤
- 相對路徑計算錯誤

**解決方法**：
1. 檢查路徑是否存在：`ls ./local-skills/my-skill`
2. 使用絕對路徑避免相對路徑混淆

---

### 問題 2：私有儲存庫複製失敗

**現象**：

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**原因**：
- SSH 金鑰未設定
- 沒有儲存庫存取權限
- 儲存庫位址錯誤

**解決方法**：
1. 測試 SSH 連線：`ssh -T git@github.com`
2. 確認你有儲存庫的存取權限
3. 檢查儲存庫位址是否正確

::: tip 提示

對於私有儲存庫，工具會顯示以下提示（原始碼 `install.ts:167`）：

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### 問題 3：子路徑中找不到 SKILL.md

**現象**：

```
Error: SKILL.md not found at skills/my-skill
```

**原因**：
- 子路徑錯誤
- 儲存庫中的目錄結構與你預期不同

**解決方法**：
1. 先不帶子路徑安裝整個儲存庫：`npx openskills install owner/repo`
2. 透過互動式介面查看可用的技能
3. 使用正確的子路徑重新安裝

---

### 問題 4：GitHub shorthand 識別錯誤

**現象**：

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**原因**：
- 格式不符合任何一種規則
- 拼寫錯誤（如 `owner / repo` 中間有空格）

**解決方法**：
- 檢查格式是否正確（無空格、斜線數量正確）
- 使用完整的 Git URL 而非 shorthand

---

## 本課小結

透過本課，你學會了：

- **三種安裝來源**：GitHub 儲存庫、本機路徑、私有 Git 儲存庫
- **GitHub shorthand**：`owner/repo` 和 `owner/repo/skill-name` 兩種格式
- **本機路徑格式**：絕對路徑、相對路徑、主目錄簡寫
- **私有儲存庫安裝**：SSH 和 HTTPS 兩種方式，不同平台的寫法
- **來源識別邏輯**：工具如何判斷你提供的安裝來源類型

**核心指令速查**：

| 指令 | 作用 |
| --- | --- |
| `npx openskills install owner/repo` | 從 GitHub 儲存庫安裝（互動式選擇） |
| `npx openskills install owner/repo/skill-name` | 直接安裝儲存庫中的某個技能 |
| `npx openskills install ./local-skills/skill` | 從本機路徑安裝 |
| `npx openskills install ~/dev/my-skills` | 從主目錄安裝 |
| `npx openskills install git@github.com:owner/private-skills.git` | 從私有 Git 儲存庫安裝 |

---

## 下一課預告

> 下一課我們學習 **[全域安裝 vs 專案本機安裝](../global-vs-project/)**。
>
> 你會學到：
> - `--global` 旗標的作用和安裝位置
> - 全域安裝和專案本機安裝的區別
> - 根據情境選擇合適的安裝位置
> - 多專案共享技能的最佳實踐

安裝來源只是技能管理的一部分，接下來需要理解技能的安裝位置對專案的影響。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 安裝指令入口 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| 本機路徑判斷 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Git URL 判斷 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| GitHub shorthand 解析 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| 本機路徑安裝 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Git 儲存庫複製 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| 私有儲存庫錯誤提示 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**關鍵函式**：
- `isLocalPath(source)` - 判斷是否為本機路徑（第 25-32 行）
- `isGitUrl(source)` - 判斷是否為 Git URL（第 37-45 行）
- `installFromLocal()` - 從本機路徑安裝技能（第 199-226 行）
- `installSpecificSkill()` - 安裝指定子路徑的技能（第 272-316 行）
- `getRepoName()` - 從 Git URL 擷取儲存庫名稱（第 50-56 行）

**關鍵邏輯**：
1. 來源類型判斷優先順序：本機路徑 → Git URL → GitHub shorthand（第 111-143 行）
2. GitHub shorthand 支援兩種格式：`owner/repo` 和 `owner/repo/skill-name`（第 132-142 行）
3. 私有儲存庫複製失敗時提示設定 SSH 金鑰或憑證（第 167 行）

</details>
