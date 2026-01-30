---
title: "自訂輸出路徑: 靈活管理技能位置 | openskills"
sidebarTitle: "把技能放到任意位置"
subtitle: "自訂輸出路徑: 靈活管理技能位置 | openskills"
description: "學習 openskills sync -o 命令靈活同步技能到任意位置。支援多工具環境自動建立目錄，滿足靈活整合需求。"
tags:
- "進階功能"
- "自訂輸出"
- "技能同步"
- "-o 標誌"
prerequisite:
- "start-sync-to-agents"
order: 2
---

# 自訂輸出路徑

## 學完你能做什麼

- 使用 `-o` 或 `--output` 標誌將技能同步到任意位置的 `.md` 檔案
- 理解工具如何自動建立不存在的檔案和目錄
- 為不同工具（Windsurf、Cursor 等）設定不同的 AGENTS.md
- 在多檔案環境下管理技能清單
- 跳過預設的 `AGENTS.md`，整合到現有文件系統

::: info 前置知識

本教學假設你已經掌握了 [基礎同步技能](../../start/sync-to-agents/) 的使用方法。如果你還沒有安裝任何技能或同步過 AGENTS.md，請先完成前置課程。

:::

---

## 你現在的困境

你可能已經習慣了 `openskills sync` 預設產生 `AGENTS.md`，但可能會遇到：

- **工具需要特定路徑**：某些 AI 工具（如 Windsurf）期望 AGENTS.md 在特定目錄（如 `.ruler/`），而不是專案根目錄
- **多工具衝突**：同時使用多個編碼工具，它們可能期望 AGENTS.md 在不同位置
- **現有文件整合**：已經有了一個技能清單文件，想把 OpenSkills 的技能整合進去，而不是新增檔案
- **目錄不存在**：想輸出到某個巢狀目錄（如 `docs/ai-skills.md`），但目錄還不存在

這些問題的根源是：**預設輸出路徑無法滿足所有場景**。你需要更靈活的輸出控制。

---

## 什麼時候用這一招

**自訂輸出路徑**適合這些場景：

- **多工具環境**：為不同 AI 工具設定獨立的 AGENTS.md（如 `.ruler/AGENTS.md` vs `AGENTS.md`）
- **目錄結構要求**：工具期望 AGENTS.md 在特定目錄（如 Windsurf 的 `.ruler/`）
- **現有文件整合**：將技能清單整合到現有的文件系統，而不是新增 AGENTS.md
- **組織性管理**：按專案或功能分類存放技能清單（如 `docs/ai-skills.md`）
- **CI/CD 環境**：在自動化流程中使用固定路徑輸出

::: tip 推薦做法

如果你的專案只使用一個 AI 工具，且工具支援專案根目錄的 AGENTS.md，使用預設路徑即可。只有在需要多檔案管理或工具特定路徑要求時，才使用自訂輸出路徑。

:::

---

## 🎒 開始前的準備

在開始之前，請確認：

- [ ] 已完成 [至少一個技能的安裝](../../start/first-skill/)
- [ ] 已進入你的專案目錄
- [ ] 了解 `openskills sync` 的基本用法

::: warning 前置檢查

確認你有已安裝的技能：

```bash
npx openskills list
```

如果清單為空，先安裝技能：

```bash
npx openskills install anthropics/skills
```

:::

---

## 核心思路：靈活的輸出控制

OpenSkills 的同步功能預設輸出到 `AGENTS.md`，但你可以使用 `-o` 或 `--output` 標誌自訂輸出路徑。

```
[預設行為] [自訂輸出]
openskills sync → AGENTS.md (專案根目錄)
openskills sync -o custom.md → custom.md (專案根目錄)
openskills sync -o .ruler/AGENTS.md → .ruler/AGENTS.md (巢狀目錄)
```

**關鍵特性**：

1. **任意路徑**：可以指定任何 `.md` 檔案路徑（相對路徑或絕對路徑）
2. **自動建立檔案**：如果檔案不存在，工具會自動建立
3. **自動建立目錄**：如果檔案所在的目錄不存在，工具會遞迴建立
4. **智慧標題**：建立檔案時，自動新增基於檔案名的標題（如 `# AGENTS`）
5. **格式驗證**：必須以 `.md` 結尾，否則會報錯

**為什麼需要這個功能？**

不同的 AI 工具可能有不同的期望路徑：

| 工具 | 期望路徑 | 預設路徑是否可用 |
| --- | --- | --- |
| Claude Code | `AGENTS.md` | ✅ 可用 |
| Cursor | `AGENTS.md` | ✅ 可用 |
| Windsurf | `.ruler/AGENTS.md` | ❌ 不可用 |
| Aider | `.aider/agents.md` | ❌ 不可用 |

使用 `-o` 標誌，你可以為每個工具設定正確的路徑。

---

## 跟我做

### 第 1 步：基礎用法 - 輸出到目前目錄

首先，嘗試將技能同步到目前目錄的自訂檔案：

```bash
npx openskills sync -o my-skills.md
```

**為什麼**

使用 `-o my-skills.md` 告訴工具輸出到 `my-skills.md` 而不是預設的 `AGENTS.md`。

**你應該看到**：

如果 `my-skills.md` 不存在，工具會建立它：

```
Created my-skills.md
```

然後啟動互動式選擇介面：

```
Found 2 skill(s)

? Select skills to sync to my-skills.md:
❯ ◉ pdf (project) Comprehensive PDF manipulation toolkit...
◉ git-workflow (project) Git workflow: Best practices for commits...

<Space> 選擇 <a> 全選 <i> 反選 <Enter> 確認
```

選擇技能後，你會看到：

```
✅ Synced 2 skill(s) to my-skills.md
```

::: tip 檢查產生的檔案

檢視產生的檔案：

```bash
cat my-skills.md
```

你會看到：

```markdown
<!-- 檔案標題：# my-skills -->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help...
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

注意第一行是 `# my-skills`，這是工具根據檔案名自動產生的標題。

:::

---

### 第 2 步：輸出到巢狀目錄

現在，嘗試將技能同步到不存在的巢狀目錄：

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**為什麼**

某些工具（如 Windsurf）期望 AGENTS.md 在 `.ruler/` 目錄。如果目錄不存在，工具會自動建立。

**你應該看到**：

如果 `.ruler/` 目錄不存在，工具會建立目錄和檔案：

```
Created .ruler/AGENTS.md
```

然後啟動互動式選擇介面（與上一步相同）。

**操作指南**：

```
┌─────────────────────────────────────────────────────────────┐
│ 目錄自動建立說明 │
│ │
│ 輸入命令：openskills sync -o .ruler/AGENTS.md │
│ │
│ 工具執行： │
│ 1. 檢查 .ruler 目錄是否存在 → 不存在 │
│ 2. 遞迴建立 .ruler 目錄 → mkdir .ruler │
│ 3. 建立 .ruler/AGENTS.md → 寫入 # AGENTS 標題 │
│ 4. 同步技能內容 → 寫入 XML 格式的技能清單 │
│ │
│ 結果：.ruler/AGENTS.md 檔案已產生，技能已同步 │
└─────────────────────────────────────────────────────────────┘
```

::: tip 遞迴建立

工具會遞迴建立所有不存在的父目錄。例如：

- `docs/ai/skills.md` - 如果 `docs` 和 `docs/ai` 都不存在，都會被建立
- `.config/agents.md` - 會建立隱藏目錄 `.config`

:::

---

### 第 3 步：多檔案管理 - 為不同工具設定

假設你同時使用 Windsurf 和 Cursor，需要為它們設定不同的 AGENTS.md：

```bash
<!-- 為 Windsurf 設定（期望 .ruler/AGENTS.md） -->
npx openskills sync -o .ruler/AGENTS.md

<!-- 為 Cursor 設定（使用專案根目錄的 AGENTS.md） -->
npx openskills sync
```

**為什麼**

不同工具可能期望 AGENTS.md 在不同位置。使用 `-o` 可以為每個工具設定正確的路徑，避免衝突。

**你應該看到**：

兩個檔案分別產生：

```bash
<!-- 檢視 Windsurf 的 AGENTS.md -->
cat .ruler/AGENTS.md

<!-- 檢視 Cursor 的 AGENTS.md -->
cat AGENTS.md
```

::: tip 檔案獨立性

每個 `.md` 檔案都是獨立的，包含自己的技能清單。你可以在不同檔案中選擇不同的技能：

- `.ruler/AGENTS.md` - 為 Windsurf 選擇的技能
- `AGENTS.md` - 為 Cursor 選擇的技能
- `docs/ai-skills.md` - 文件中的技能清單

:::

---

### 第 4 步：非互動式同步到自訂檔案

在 CI/CD 環境中，你可能需要跳過互動式選擇，直接同步所有技能到自訂檔案：

```bash
npx openskills sync -o .ruler/AGENTS.md -y
```

**為什麼**

`-y` 標誌跳過互動式選擇，同步所有已安裝技能。結合 `-o` 標誌，可以在自動化流程中輸出到自訂路徑。

**你應該看到**：

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: info CI/CD 使用場景

在 CI/CD 指令碼中使用：

```bash
#!/bin/bash
<!-- 安裝技能 -->
npx openskills install anthropics/skills -y

<!-- 同步到自訂檔案（非互動式） -->
npx openskills sync -o .ruler/AGENTS.md -y
```

:::

---

### 第 5 步：驗證輸出檔案

最後，驗證輸出檔案是否正確產生：

```bash
<!-- 檢視檔案內容 -->
cat .ruler/AGENTS.md

<!-- 檢查檔案是否存在 -->
ls -l .ruler/AGENTS.md

<!-- 確認技能數量 -->
grep -c "<name>" .ruler/AGENTS.md
```

**你應該看到**：

1. 檔案包含正確的標題（如 `# AGENTS`）
2. 檔案包含 `<skills_system>` XML 標籤
3. 檔案包含 `<available_skills>` 技能清單
4. 每個 `<skill>` 包含 `<name>`, `<description>`, `<location>`

::: tip 檢查輸出路徑

如果你不確定目前工作目錄，可以使用：

```bash
<!-- 檢視目前目錄 -->
pwd

<!-- 檢視相對路徑會解析到哪裡 -->
realpath .ruler/AGENTS.md
```

:::

---

## 檢查點 ✅

完成上述步驟後，請確認：

- [ ] 成功使用 `-o` 標誌輸出到自訂檔案
- [ ] 工具自動建立了不存在的檔案
- [ ] 工具自動建立了不存在的巢狀目錄
- [ ] 產生的檔案包含正確的標題（基於檔案名）
- [ ] 產生的檔案包含 `<skills_system>` XML 標籤
- [ ] 產生的檔案包含完整的技能清單
- [ ] 可以為不同工具設定不同的輸出路徑
- [ ] 可以在 CI/CD 環境中使用 `-y` 和 `-o` 組合

如果以上檢查項都通過，恭喜你！你已經掌握了自訂輸出路徑的使用方法，可以靈活地將技能同步到任意位置。

---

## 踩坑提醒

### 問題 1：輸出檔案不是 markdown

**現象**：

```
Error: Output file must be a markdown file (.md)
```

**原因**：

使用 `-o` 標誌時，指定的檔案副檔名不是 `.md`。工具強制要求輸出到 markdown 檔案，以確保 AI 工具能正確解析。

**解決方法**：

確保輸出檔案以 `.md` 結尾：

```bash
<!-- ❌ 錯誤 -->
npx openskills sync -o skills.txt

<!-- ✅ 正確 -->
npx openskills sync -o skills.md
```

---

### 問題 2：目錄建立權限錯誤

**現象**：

```
Error: EACCES: permission denied, mkdir '.ruler'
```

**原因**：

嘗試建立目錄時，目前使用者沒有父目錄的寫入權限。

**解決方法**：

1. 檢查父目錄權限：

```bash
ls -ld .
```

2. 如果權限不足，聯絡管理員或使用有權限的目錄：

```bash
<!-- 使用專案目錄 -->
cd ~/projects/my-project
npx openskills sync -o .ruler/AGENTS.md
```

---

### 問題 3：輸出路徑過長

**現象**：

檔案路徑很長，導致命令難以閱讀和維護：

```bash
npx openskills sync -o docs/ai/skills/v2/internal/agents.md
```

**原因**：

巢狀目錄過深，導致路徑難以管理。

**解決方法**：

1. 使用相對路徑（從專案根目錄開始）
2. 簡化目錄結構
3. 考慮使用符號連結（參見 [符號連結支援](../symlink-support/)）

```bash
<!-- 推薦做法：扁平化目錄結構 -->
npx openskills sync -o docs/agents.md
```

---

### 問題 4：忘記使用 -o 標誌

**現象**：

期望輸出到自訂檔案，但工具仍然輸出到預設的 `AGENTS.md`。

**原因**：

忘記使用 `-o` 標誌，或拼寫錯誤。

**解決方法**：

1. 檢查命令是否包含 `-o` 或 `--output`：

```bash
<!-- ❌ 錯誤：忘記 -o 標誌 -->
npx openskills sync

<!-- ✅ 正確：使用 -o 標誌 -->
npx openskills sync -o .ruler/AGENTS.md
```

2. 使用 `--output` 完整形式（更清晰）：

```bash
npx openskills sync --output .ruler/AGENTS.md
```

---

### 問題 5：檔案名包含特殊字元

**現象**：

檔案名包含空格或特殊字元，導致路徑解析錯誤：

```bash
npx openskills sync -o "my skills.md"
```

**原因**：

某些 shell 對特殊字元的處理方式不同，可能導致路徑錯誤。

**解決方法**：

1. 避免使用空格和特殊字元
2. 如果必須使用，用引號包裹：

```bash
<!-- 不推薦 -->
npx openskills sync -o "my skills.md"

<!-- 推薦 -->
npx openskills sync -o my-skills.md
```

---

## 本課小結

透過本課，你學會了：

- **使用 `-o` 或 `--output` 標誌** 將技能同步到自訂的 `.md` 檔案
- **自動建立檔案和目錄** 的機制，無需手動準備目錄結構
- **為不同工具設定不同的 AGENTS.md**，避免多工具衝突
- **多檔案管理技巧**，按工具或功能分類存放技能清單
- **CI/CD 環境使用** `-y` 和 `-o` 組合實現自動化同步

**核心命令**：

| 命令 | 作用 |
| --- | --- |
| `npx openskills sync -o custom.md` | 同步到專案根目錄的 `custom.md` |
| `npx openskills sync -o .ruler/AGENTS.md` | 同步到 `.ruler/AGENTS.md`（自動建立目錄） |
| `npx openskills sync -o path/to/file.md` | 同步到任意路徑（自動建立巢狀目錄） |
| `npx openskills sync -o custom.md -y` | 非互動式同步到自訂檔案 |

**關鍵要點**：

- 輸出檔案必須以 `.md` 結尾
- 工具會自動建立不存在的檔案和目錄
- 建立檔案時，自動新增基於檔案名的標題
- 每個 `.md` 檔案都是獨立的，包含自己的技能清單
- 適用於多工具環境、目錄結構要求、現有文件整合等場景

---

## 下一課預告

> 下一課我們學習 **[符號連結支援](../symlink-support/)**。
>
> 你會學到：
> - 如何使用符號連結實現基於 git 的技能更新
> - 符號連結的優勢和使用場景
> - 如何管理本地開發中的技能
> - 符號連結的檢測和處理機制

自訂輸出路徑讓你可以靈活地控制技能清單的位置，而符號連結則提供了一種更高階的技能管理方式，特別適合本地開發場景。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| sync 命令入口 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| CLI 選項定義 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 66 |
| 輸出路徑取得 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19) | 19 |
| 輸出檔案驗證 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L22-L26) | 22-26 |
| 建立不存在的檔案 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| 遞迴建立目錄 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L31-L32) | 31-32 |
| 自動產生標題 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L34) | 34 |
| 互動式提示使用輸出檔案名 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L70) | 70 |

**關鍵函式**：
- `syncAgentsMd(options: SyncOptions)` - 同步技能到指定輸出檔案
- `options.output` - 自訂輸出路徑（選用，預設 'AGENTS.md'）

**關鍵常數**：
- `'AGENTS.md'` - 預設輸出檔案名
- `'.md'` - 強制要求的檔案副檔名

**重要邏輯**：
- 輸出檔案必須以 `.md` 結尾，否則報錯並退出（sync.ts:23-26）
- 如果檔案不存在，自動建立父目錄（遞迴）和檔案（sync.ts:28-36）
- 建立檔案時，寫入基於檔案名的標題：`# ${outputName.replace('.md', '')}`（sync.ts:34）
- 在互動式提示中顯示輸出檔案名（sync.ts:70）
- 同步成功訊息中顯示輸出檔案名（sync.ts:105, 107）

</details>
