---
title: "全域 vs 專案: 安裝位置 | OpenSkills"
sidebarTitle: "全域安裝：專案間共享技能"
subtitle: "全域安裝 vs 專案本地安裝"
description: "學習 OpenSkills 技能的全域安裝和專案本地安裝區別。掌握 --global 標誌的使用，理解搜尋優先級規則，根據場景選擇合適的安裝位置。"
tags:
  - "平台整合"
  - "技能管理"
  - "設定技巧"
prerequisite:
  - "start-first-skill"
  - "platforms-install-sources"
order: 3
---

# 全域安裝 vs 專案本地安裝

## 學完你能做什麼

- 理解 OpenSkills 的兩種安裝位置（全域 vs 專案本地）的區別
- 根據場景選擇合適的安裝位置
- 掌握 `--global` 標誌的使用方法
- 理解技能的搜尋優先級規則
- 避免常見的安裝位置設定錯誤

::: info 前置知識

本教學假設你已經完成了 [安裝第一個技能](../../start/first-skill/) 和 [安裝來源詳解](../install-sources/)，了解基本的技能安裝流程。

:::

---

## 你現在的困境

你可能已經學會了如何安裝技能，但是：

- **技能裝在哪裡了？**：執行 `openskills install` 後，不知道技能檔案被複製到哪個目錄
- **新專案又得重新裝？**：切換到另一個專案時，之前安裝的技能不見了
- **只想全域用一次的技能怎麼辦？**：有些技能所有專案都需要，不想每個專案都裝
- **多個專案共享技能？**：有些技能是團隊通用的，想統一管理

其實 OpenSkills 提供了兩種安裝位置，讓你靈活管理技能。

---

## 什麼時候用這一招

**兩種安裝位置的適用場景**：

| 安裝位置 | 適用場景 | 範例 |
|--- | --- | ---|
| **專案本地**（預設） | 專案專用的技能，需要版本控制 | 團隊業務規則、專案特定工具 |
| **全域安裝**（`--global`） | 所有專案通用的技能，無需版本控制 | 通用程式碼生成工具、檔案格式轉換 |

::: tip 推薦做法

- **預設使用專案本地安裝**：讓技能跟隨專案，便於團隊協作和版本控制
- **通用工具才用全域安裝**：比如 `git-helper`、`docker-generator` 等跨專案工具
- **避免過度全域化**：全域安裝的技能會被所有專案共享，可能導致衝突或版本不一致

:::

---

## 核心思路：兩種位置，靈活選擇

OpenSkills 的技能安裝位置由 `--global` 標誌控制：

**預設（專案本地安裝）**：
- 安裝位置：`./.claude/skills/`（專案根目錄）
- 適用：單個專案專用的技能
- 優勢：技能跟隨專案，可以提交到 Git，便於團隊協作

**全域安裝**：
- 安裝位置：`~/.claude/skills/`（使用者主目錄）
- 適用：所有專案通用的技能
- 優勢：所有專案共享，無需重複安裝

::: info 重要概念

**專案本地**：技能安裝在目前專案的 `.claude/skills/` 目錄下，只對目前專案可見。

**全域安裝**：技能安裝在使用者主目錄的 `.claude/skills/` 下，對所有專案可見。

:::

---

## 跟我做

### 第 1 步：檢視預設安裝行為

**為什麼**
先了解預設安裝方式，理解 OpenSkills 的設計思路。

開啟終端機，在任意專案中執行：

```bash
# 安裝一個測試技能（預設專案本地）
npx openskills install anthropics/skills -y

# 檢視技能列表
npx openskills list
```

**你應該看到**：技能列表中每個技能後面有 `(project)` 標籤

```
  codebase-reviewer         (project)
    Review code changes for issues...

Summary: 3 project, 0 global (3 total)
```

**解釋**：
- 預設情況下，技能安裝在 `./.claude/skills/` 目錄
- `list` 指令會顯示 `(project)` 或 `(global)` 標籤
- 預設不使用 `--global` 標誌時，技能只對目前專案可見

---

### 第 2 步：檢視技能安裝位置

**為什麼**
確認技能檔案的實際儲存位置，便於後續管理。

在專案根目錄執行：

```bash
# 檢視專案本地的技能目錄
ls -la .claude/skills/

# 檢視技能目錄內容
ls -la .claude/skills/codebase-reviewer/
```

**你應該看到**：

```
.claude/skills/
├── codebase-reviewer/
│   ├── SKILL.md
│   └── .openskills.json    # 安裝元資料
├── file-writer/
│   ├── SKILL.md
│   └── .openskills.json
└── ...
```

**解釋**：
- 每個技能都有自己的目錄
- `SKILL.md` 是技能的核心內容
- `.openskills.json` 記錄安裝來源和元資料（用於更新）

---

### 第 3 步：全域安裝技能

**為什麼**
了解全域安裝的指令和效果。

執行：

```bash
# 全域安裝一個技能
npx openskills install anthropics/skills --global -y

# 再次檢視技能列表
npx openskills list
```

**你應該看到**：

```
  codebase-reviewer         (project)
    Review code changes for issues...
  file-writer              (global)
    Write files with format...

Summary: 1 project, 2 global (3 total)
```

**解釋**：
- 使用 `--global` 標誌後，技能安裝在 `~/.claude/skills/`
- `list` 指令顯示 `(global)` 標籤
- 同名的技能會優先使用專案本地的版本（搜尋優先級）

---

### 第 4 步：對比兩種安裝位置

**為什麼**
透過實際對比，理解兩種安裝位置的差異。

執行以下指令：

```bash
# 檢視全域安裝的技能目錄
ls -la ~/.claude/skills/

# 對比專案本地和全域安裝的技能
echo "=== Project Skills ==="
ls .claude/skills/

echo "=== Global Skills ==="
ls ~/.claude/skills/
```

**你應該看到**：

```
=== Project Skills ===
codebase-reviewer
file-writer

=== Global Skills ===
codebase-reviewer
file-writer
test-generator
```

**解釋**：
- 專案本地技能：`./.claude/skills/`
- 全域技能：`~/.claude/skills/`
- 兩個目錄可以包含同名技能，但專案本地的優先級更高

---

### 第 5 步：驗證搜尋優先級

**為什麼**
理解 OpenSkills 如何在多個位置查找技能。

執行：

```bash
# 在兩個位置安裝同名技能
npx openskills install anthropics/skills -y  # 專案本地
npx openskills install anthropics/skills --global -y  # 全域

# 讀取技能（會優先使用專案本地版本）
npx openskills read codebase-reviewer | head -5
```

**你應該看到**：輸出的是專案本地版本的技能內容。

**搜尋優先級規則**（原始碼 `dirs.ts:18-24`）：

```typescript
export function getSearchDirs(): string[] {
  return [
    join(process.cwd(), '.claude/skills'),   // 1. 專案本地（最高優先級）
    join(homedir(), '.claude/skills'),       // 2. 全域
  ];
}
```

**解釋**：
- 專案本地的技能優先級高於全域
- 當同名技能同時存在時，優先使用專案本地版本
- 這樣可以實現"專案覆蓋全域"的靈活設定

---

## 檢查點 ✅

完成以下檢查，確認你掌握了本課內容：

- [ ] 能夠區分專案本地安裝和全域安裝
- [ ] 知道 `--global` 標誌的作用
- [ ] 理解技能的搜尋優先級規則
- [ ] 能夠根據場景選擇合適的安裝位置
- [ ] 知道如何檢視已安裝技能的位置標籤

---

## 踩坑提醒

### 常見錯誤 1：誤用全域安裝

**錯誤場景**：把專案專用技能全域安裝

```bash
**錯誤場景**：把專案專用技能全域安裝

```bash
# ❌ 錯誤：團隊業務規則不應該全域安裝
npx openskills install my-company/rules --global
```

**問題**：
- 團隊其他成員無法獲取該技能
- 技能不會被版本控制
- 可能與其他專案的技能衝突

**正確做法**：

```bash
# ✅ 正確：專案專用技能使用預設安裝（專案本地）
npx openskills install my-company/rules
```

---

### 常見錯誤 2：忘記 `--global` 標誌

**錯誤場景**：想讓所有專案共享技能，但忘記加 `--global`

```bash
# ❌ 錯誤：預設安裝到專案本地，其他專案無法使用
npx openskills install universal-tool
```

**問題**：
- 技能只安裝在目前專案的 `./.claude/skills/`
- 切換到其他專案後，需要重新安裝

**正確做法**：

```bash
# ✅ 正確：通用工具使用全域安裝
npx openskills install universal-tool --global
```

---

### 常見錯誤 3：同名技能衝突

**錯誤場景**：專案本地和全域安裝了同名技能，但期望使用全域版本

```bash
# 專案本地和全域都有 codebase-reviewer
# 但想用全域版本（新的）
npx openskills install codebase-reviewer --global  # 安裝新版
npx openskills read codebase-reviewer  # ❌ 還是讀到舊版
```

**問題**：
- 專案本地版本的優先級更高
- 即使全域安裝了新版本，仍然讀取專案本地舊版本

**正確做法**：

```bash
# 方案 1：刪除專案本地版本
npx openskills remove codebase-reviewer  # 刪除專案本地
npx openskills read codebase-reviewer  # ✅ 現在讀取全域版本

# 方案 2：在專案本地更新
npx openskills update codebase-reviewer  # 更新專案本地版本
```

---

## 本課小結

**核心要點**：

1. **預設安裝到專案本地**：技能安裝在 `./.claude/skills/`，只對目前專案可見
2. **全域安裝使用 `--global`**：技能安裝在 `~/.claude/skills/`，所有專案共享
3. **搜尋優先級**：專案本地 > 全域
4. **推薦原則**：專案專用用本地，通用工具用全域

**決策流程**：

```
[需要安裝技能] → [是否專案專用？]
                      ↓ 是
              [專案本地安裝（預設）]
                      ↓ 否
              [是否需要版本控制？]
                      ↓ 是
              [專案本地安裝（可提交 Git）]
                      ↓ 否
              [全域安裝（--global）]
```

**記憶口訣**：

- **專案本地**：技能跟著專案走，團隊協作不用愁
- **全域安裝**：通用工具放全域，所有專案都能用

---

## 下一課預告

> 下一課我們學習 **[列出已安裝技能](../list-skills/)**。
>
> 你會學到：
> - 如何檢視所有已安裝技能
> - 理解技能位置標籤的含義
> - 如何統計專案技能和全域技能的數量
> - 如何根據位置篩選技能

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能        | 檔案路徑                                                                                          | 行號    |
|--- | --- | ---|
| 安裝位置判斷 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92   |
| 目錄路徑工具 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L7-L25)     | 7-25    |
| 技能列表顯示 | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts#L20-L43)   | 20-43   |

**關鍵常數**：
- `.claude/skills`：預設技能目錄（Claude Code 相容）
- `.agent/skills`：通用技能目錄（多代理環境）

**關鍵函數**：
- `getSkillsDir(projectLocal, universal)`：根據標誌返回技能目錄路徑
- `getSearchDirs()`：返回技能搜尋目錄列表（按優先級排序）
- `listSkills()`：列出所有已安裝技能，顯示位置標籤

**業務規則**：
- 預設安裝到專案本地（`!options.global`）
- 技能搜尋優先級：專案本地 > 全域
- `list` 指令顯示 `(project)` 和 `(global)` 標籤

</details>
