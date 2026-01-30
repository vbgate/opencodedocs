---
title: "技能同步：產生 AGENTS.md | openskills"
sidebarTitle: "讓 AI 知道技能"
subtitle: "技能同步：產生 AGENTS.md"
description: "學習使用 openskills sync 命令產生 AGENTS.md 檔案，讓 AI 代理程式（Claude Code、Cursor）了解已安裝的技能。掌握技能選擇和同步技巧，最佳化 AI 上下文使用。"
tags:
  - "入門教學"
  - "技能同步"
  - "AGENTS.md"
prerequisite:
  - "start-first-skill"
order: 5
---

# 同步技能到 AGENTS.md

## 學完你能做什麼

- 使用 `openskills sync` 產生 AGENTS.md 檔案
- 理解 AI 代理程式如何透過 AGENTS.md 了解可用技能
- 選擇要同步的技能，控制 AI 上下文大小
- 使用自訂輸出路徑整合到現有文件
- 理解 AGENTS.md 的 XML 格式和使用方法

::: info 前置知識

本教學假設你已經完成了 [第一個技能的安裝](../first-skill/)。如果你還沒有安裝任何技能，請先完成安裝步驟。

:::

---

## 你現在的困境

你可能已經安裝了一些技能，但是：

- **AI 代理程式不知道有技能可用**：技能安裝了，但 AI 代理程式（如 Claude Code）根本不知道它們的存在
- **不知道怎麼讓 AI 知道技能**：聽說過 `AGENTS.md`，但不知道它是什麼，怎麼產生
- **擔心技能太多占用上下文**：安裝了很多技能，想選擇性同步，不想一次性全部告訴 AI

這些問題的根源是：**技能安裝和技能可用是兩回事**。安裝只是把檔案放下來，要讓 AI 知道，還需要同步到 AGENTS.md。

---

## 什麼時候用這一招

**同步技能到 AGENTS.md**適合這些場景：

- 剛安裝完技能，需要讓 AI 代理程式知道它們存在
- 新增新技能後，更新 AI 的可用技能列表
- 刪除技能後，從 AGENTS.md 中移除
- 想選擇性同步技能，控制 AI 的上下文大小
- 多代理程式環境，需要統一技能列表

::: tip 推薦做法

每次安裝、更新或刪除技能後，都執行一次 `openskills sync`，保持 AGENTS.md 與實際技能一致。

:::

---

## 🎒 開始前的準備

在開始之前，請確認：

- [ ] 已完成 [至少一個技能的安裝](../first-skill/)
- [ ] 已進入你的專案目錄
- [ ] 了解技能的安裝位置（project 或 global）

::: warning 前置檢查

如果還沒有安裝任何技能，先執行：

```bash
npx openskills install anthropics/skills
```

:::

---

## 核心思路：技能安裝 ≠ AI 可用

OpenSkills 的技能管理分為兩個階段：

```
[安裝階段]            [同步階段]
技能 → .claude/skills/  →  AGENTS.md
   ↓                        ↓
 檔案存在              AI 代理程式讀取
   ↓                        ↓
 本地可用            AI 知道並可以呼叫
```

**關鍵點**：

1. **安裝階段**：使用 `openskills install`，技能被複製到 `.claude/skills/` 目錄
2. **同步階段**：使用 `openskills sync`，技能資訊寫入 `AGENTS.md`
3. **AI 讀取**：AI 代理程式讀取 `AGENTS.md`，知道有哪些技能可用
4. **按需載入**：AI 根據任務需要，使用 `openskills read <skill>` 載入具體技能

**為什麼需要 AGENTS.md？**

AI 代理程式（如 Claude Code、Cursor）不會主動掃描檔案系統。它們需要一個明確的「技能清單」，告訴它們有哪些工具可以使用。這個清單就是 `AGENTS.md`。

---

## 跟我做

### 第 1 步：進入專案目錄

首先，進入你安裝了技能的專案目錄：

```bash
cd /path/to/your/project
```

**為什麼**

`openskills sync` 預設在目前目錄查找已安裝的技能，並在目前目錄產生或更新 `AGENTS.md`。

**你應該看到**：

你的專案目錄應該包含 `.claude/skills/` 目錄（如果你安裝了技能）：

```bash
ls -la
# 輸出範例：
drwxr-xr-x  5 user  staff  .claude
drwxr-xr-x  5 user  staff  .claude/skills/
-rw-r--r--  1 user  staff  package.json
```

---

### 第 2 步：同步技能

使用以下命令同步已安裝的技能到 AGENTS.md：

```bash
npx openskills sync
```

**為什麼**

`sync` 命令會查找所有已安裝的技能，產生一個 XML 格式的技能列表，並寫入 `AGENTS.md` 檔案。

**你應該看到**：

命令會啟動一個互動式選擇介面：

```
Found 2 skill(s)

? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...
  ◉ check-branch-first          (global)   Git workflow: Always check current branch...

<Space> 選擇  <a> 全選  <i> 反選  <Enter> 確認
```

**操作指南**：

```
┌─────────────────────────────────────────────────────────────┐
│  操作說明                                                    │
│                                                             │
│  第 1 步         第 2 步          第 3 步                   │
│  移動游標   →   按 Space 選中   →   按 Enter 確認           │
│                                                             │
│  ○ 未選中           ◉ 已選中                                │
│                                                             │
│  (project)         專案技能，藍色高亮                        │
│  (global)          全域技能，灰色顯示                          │
└─────────────────────────────────────────────────────────────┘

你應該看到：
- 游標可以上下移動
- 按空格鍵切換選中狀態（○ ↔ ◉）
- 專案技能顯示為藍色，全域技能顯示為灰色
- 按 Enter 確認同步
```

::: tip 智慧預選

如果是第一次同步，工具會預設選中所有**專案技能**。如果是更新已存在的 AGENTS.md，工具會預選**檔案中已啟用的技能**。

:::

---

### 第 3 步：選擇技能

在互動式介面中，選擇你想讓 AI 代理程式知道的技能。

**範例**：

假設你想同步所有已安裝的技能：

```
? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)
  ◉ git-workflow                (project)
  ◯ check-branch-first          (global)   ← 不選這個全域技能
```

操作：

1. **移動游標**：使用上下方向鍵移動
2. **選中/取消選中**：按 **空格鍵** 切換選中狀態（`○` ↔ `◉`）
3. **確認同步**：按 **Enter 鍵** 開始同步

**你應該看到**：

```
✅ Synced 2 skill(s) to AGENTS.md
```

::: tip 選擇策略

- **專案技能**：目前專案專用的技能，建議同步
- **全域技能**：通用的技能（如編碼規範），按需同步
- **避免過多**：技能太多會占用 AI 上下文，建議只同步常用技能

:::

---

### 第 4 步：查看 AGENTS.md

同步完成後，查看產生的 AGENTS.md 檔案：

```bash
cat AGENTS.md
```

**你應該看到**：

```markdown
# AGENTS.md

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help complete the task more effectively.

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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms...</description>
<location>project</location>
</skill>

<skill>
<name>git-workflow</name>
<description>Git workflow: Best practices for commits, branches, and PRs, ensuring clean history and effective collaboration.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

**關鍵元素說明**：

| 元素 | 作用 |
| --- | --- |
| `<skills_system>` | XML 標籤，告訴 AI 這是一個技能系統定義 |
| `<usage>` | 使用說明，告訴 AI 如何呼叫技能 |
| `<available_skills>` | 可用技能列表 |
| `<skill>` | 單個技能的定義 |
| `<name>` | 技能名稱 |
| `<description>` | 技能描述 |
| `<location>` | 技能位置 |

::: info 為什麼用 XML 格式？

XML 格式是 AI 代理程式（特別是 Claude Code）的標準格式，便於解析和理解。工具也支援 HTML 註解格式作為備選方案。

:::

---

### 第 5 步：驗證 AI 讀取

現在，讓 AI 代理程式讀取 AGENTS.md，看看它是否知道有哪些技能可用。

**範例對話**：

```
使用者：
我想從 PDF 檔案中提取表格資料

AI 代理程式：
我可以使用 `pdf` 技能來幫助你提取表格資料。讓我先讀取這個技能的詳細內容。

AI 執行：
npx openskills read pdf

輸出：
Skill: pdf
Base Directory: /path/to/project/.claude/skills/pdf

[PDF 技能的詳細內容...]

AI：
好的，我已經載入了 PDF 技能。現在我可以幫你提取表格資料了...
```

**你應該看到**：

- AI 代理程式識別出可以使用 `pdf` 技能
- AI 自動執行 `npx openskills read pdf` 載入技能內容
- AI 根據技能的指令執行任務

---

### 第 6 步（可選）：自訂輸出路徑

如果你想把技能同步到其他檔案（如 `.ruler/AGENTS.md`），使用 `-o` 或 `--output` 選項：

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**為什麼**

某些工具（如 Windsurf）可能期望 AGENTS.md 在特定目錄。使用 `-o` 可以彈性地自訂輸出路徑。

**你應該看到**：

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: tip 非互動式同步

在 CI/CD 環境中，可以使用 `-y` 或 `--yes` 標誌跳過互動式選擇，同步所有技能：

```bash
npx openskills sync -y
```

:::

---

## 檢查點 ✅

完成上述步驟後，請確認：

- [ ] 命令列顯示了互動式選擇介面
- [ ] 成功選中了至少一個技能（前面是 `◉`）
- [ ] 同步成功，顯示了 `✅ Synced X skill(s) to AGENTS.md` 訊息
- [ ] `AGENTS.md` 檔案已建立或更新
- [ ] 檔案中包含 `<skills_system>` XML 標籤
- [ ] 檔案中包含 `<available_skills>` 技能列表
- [ ] 每個 `<skill>` 包含 `<name>`, `<description>`, `<location>`

如果以上檢查項都通過，恭喜你！技能已成功同步到 AGENTS.md，AI 代理程式現在可以知道並使用這些技能了。

---

## 踩坑提醒

### 問題 1：沒有找到技能

**現象**：

```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**原因**：

- 目前目錄或全域目錄都沒有安裝技能

**解決方法**：

1. 檢查是否有技能安裝：

```bash
npx openskills list
```

2. 如果沒有，先安裝技能：

```bash
npx openskills install anthropics/skills
```

---

### 問題 2：AGENTS.md 沒有更新

**現象**：

執行 `openskills sync` 後，AGENTS.md 內容沒有變化。

**原因**：

- 使用了 `-y` 標誌，但技能列表與之前相同
- AGENTS.md 已存在，但同步的是相同技能

**解決方法**：

1. 檢查是否使用了 `-y` 標誌

```bash
# 去掉 -y，進入互動模式重新選擇
npx openskills sync
```

2. 檢查目前目錄是否正確

```bash
# 確認在安裝技能的專案目錄
pwd
ls .claude/skills/
```

---

### 問題 3：AI 代理程式不知道技能

**現象**：

AGENTS.md 已產生，但 AI 代理程式仍然不知道有技能可用。

**原因**：

- AI 代理程式沒有讀取 AGENTS.md
- AGENTS.md 格式不正確
- AI 代理程式不支援技能系統

**解決方法**：

1. 確認 AGENTS.md 在專案根目錄
2. 檢查 AGENTS.md 格式是否正確（包含 `<skills_system>` 標籤）
3. 檢查 AI 代理程式是否支援 AGENTS.md（如 Claude Code 支援，其他工具可能需要設定）

---

### 問題 4：輸出檔案不是 markdown

**現象**：

```
Error: Output file must be a markdown file (.md)
```

**原因**：

- 使用了 `-o` 選項，但指定的檔案不是 `.md` 副檔名

**解決方法**：

1. 確保輸出檔案以 `.md` 結尾

```bash
# ❌ 錯誤
npx openskills sync -o skills.txt

# ✅ 正確
npx openskills sync -o skills.md
```

---

### 問題 5：取消所有選擇

**現象**：

在互動式介面中，取消選中所有技能後，AGENTS.md 中的技能部分被刪除。

**原因**：

這是正常行為。如果取消所有技能，工具會移除 AGENTS.md 中的技能部分。

**解決方法**：

如果這是誤操作，重新執行 `openskills sync`，選擇要同步的技能。

---

## 本課小結

透過本課，你學會了：

- **使用 `openskills sync`** 產生 AGENTS.md 檔案
- **理解技能同步的流程**：安裝 → 同步 → AI 讀取 → 按需載入
- **互動式選擇技能**，控制 AI 上下文大小
- **自訂輸出路徑**，整合到現有文件系統
- **理解 AGENTS.md 格式**，包含 `<skills_system>` XML 標籤和技能列表

**核心命令**：

| 命令 | 作用 |
| --- | --- |
| `npx openskills sync` | 互動式同步技能到 AGENTS.md |
| `npx openskills sync -y` | 非互動式同步所有技能 |
| `npx openskills sync -o custom.md` | 同步到自訂檔案 |
| `cat AGENTS.md` | 查看產生的 AGENTS.md 內容 |

**AGENTS.md 格式要點**：

- 使用 `<skills_system>` XML 標籤包裹
- 包含 `<usage>` 使用說明
- 包含 `<available_skills>` 技能列表
- 每個 `<skill>` 包含 `<name>`, `<description>`, `<location>`

---

## 下一課預告

> 下一課我們學習 **[使用技能](../read-skills/)**。
>
> 你會學到：
> - AI 代理程式如何使用 `openskills read` 命令載入技能
> - 技能的完整載入流程
> - 如何讀取多個技能
> - 技能內容的結構和組成

同步技能只是讓 AI 知道有哪些工具可用，真正使用時，AI 會透過 `openskills read` 命令載入具體的技能內容。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| sync 命令入口 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| 輸出檔案驗證 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19-L26) | 19-26 |
| 建立不存在的檔案 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| 互動式選擇介面 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| 解析現有 AGENTS.md | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| 產生技能 XML | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| 替換技能部分 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| 刪除技能部分 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L98-L122) | 98-122 |

**關鍵函數**：
- `syncAgentsMd()` - 同步技能到 AGENTS.md 檔案
- `parseCurrentSkills()` - 解析現有 AGENTS.md 中的技能名
- `generateSkillsXml()` - 產生 XML 格式的技能列表
- `replaceSkillsSection()` - 替換或添加技能部分到檔案
- `removeSkillsSection()` - 從檔案中移除技能部分

**關鍵常數**：
- `AGENTS.md` - 預設輸出檔案名稱
- `<skills_system>` - XML 標籤，用於標記技能系統定義
- `<available_skills>` - XML 標籤，用於標記可用技能列表

**重要邏輯**：
- 預設預選檔案中已存在的技能（增量更新）
- 首次同步預設選中所有專案技能
- 支援兩種標記格式：XML 標籤和 HTML 註解
- 取消所有選擇時刪除技能部分，而非保留空列表

</details>
