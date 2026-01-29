---
title: "Diff 檢視: 多角度審查變更 | Plannotator"
sidebarTitle: "5種 diff 檢視切換"
subtitle: "Diff 檢視: 多角度審查變更"
description: "學習 Plannotator 程式碼審查中切換 diff 類型的方法。在下拉選單中選擇 uncommitted、staged、last commit 或 branch 檢視，從多角度審查程式碼變更。"
tags:
  - "code-review"
  - "git"
  - "diff"
  - "tutorial"
prerequisite:
  - "code-review-basics"
order: 6
---

# 切換 Diff 檢視

## 學完你能做什麼

在程式碼審查時，你可以：
- 用下拉選單在 5 種 diff 檢視之間快速切換
- 理解每種檢視顯示的程式碼變更範圍
- 根據審查需求選擇合適的 diff 類型
- 避免因選擇錯誤的檢視而遺漏重要變更

## 你現在的困境

**審查時只看工作區，遺漏了已暫存的檔案**：

你執行 `/plannotator-review` 指令，看到一些程式碼變更，新增了幾條註解。但提交後發現，審查裡漏掉了那些已經 `git add` 到暫存區的檔案——這些檔案根本沒有出現在 diff 中。

**想知道目前分支和 main 分支的整體差異**：

你在一個 feature 分支上開發了幾週，想看看總共改了哪些東西，但預設的「未提交變更」檢視只能顯示最近幾天的修改。

**想對比兩個特定提交之間的差異**：

你想確認某個 bug 修復是否正確，需要對比修復前後的程式碼，但不知道如何讓 Plannotator 顯示歷史提交的 diff。

## 什麼時候用這一招

- **全面審查時**：同時檢視工作區和暫存區的變更
- **分支合併前**：檢查目前分支相對於 main/master 的所有改動
- **回滾審查時**：確認最後一次提交改了哪些檔案
- **多人協作時**：檢查同事暫存但未提交的程式碼

## 核心思路

Git diff 指令有很多變體，每個變體顯示不同的程式碼範圍。Plannotator 把這些變體集中到了一個下拉選單裡，讓你不需要記住複雜的 git 指令。

::: info Git Diff 類型速查

| diff 類型 | 顯示範圍 | 典型使用情境 |
|--- | --- | ---|
| Uncommitted changes | 工作區 + 暫存區 | 審查本次開發的所有修改 |
| Staged changes | 僅暫存區 | 提交前審查準備提交的內容 |
| Unstaged changes | 僅工作區 | 審查還沒 `git add` 的修改 |
| Last commit | 最近一次提交 | 回滾或審查剛才的提交 |
| vs main | 目前分支 vs 預設分支 | 分支合併前全面檢查 |

:::

下拉選單的選項會根據你的 Git 狀態動態變化：
- 如果目前不在預設分支，會顯示「vs main」選項
- 如果沒有已暫存的檔案，Staged 檢視會提示「No staged changes」

## 跟我做

### 第 1 步：啟動程式碼審查

**為什麼**

需要先開啟 Plannotator 的程式碼審查介面。

**操作**

在終端機執行：

```bash
/plannotator-review
```

**你應該看到**

瀏覽器開啟了程式碼審查頁面，左側檔案樹上方有一個下拉選單顯示目前 diff 類型（通常是「Uncommitted changes」）。

### 第 2 步：切換到 Staged 檢視

**為什麼**

檢視已經 `git add` 但還沒提交的檔案。

**操作**

1. 點擊左側檔案樹上方的下拉選單
2. 選擇「Staged changes」

**你應該看到**

- 如果有暫存檔案，檔案樹顯示這些檔案
- 如果沒有暫存檔案，主區域顯示：「No staged changes. Stage some files with git add.」

### 第 3 步：切換到 Last Commit 檢視

**為什麼**

審查剛才提交的程式碼，確認沒有問題。

**操作**

1. 再次開啟下拉選單
2. 選擇「Last commit」

**你應該看到**

- 顯示最近一次提交修改的所有檔案
- diff 內容是 `HEAD~1..HEAD` 的差異

### 第 4 步：切換到 vs main 檢視（如果可用）

**為什麼**

檢視目前分支相對於預設分支的所有改動。

**操作**

1. 檢查下拉選單中是否有「vs main」或「vs master」選項
2. 如果有，選擇它

**你應該看到**

- 檔案樹顯示目前分支和預設分支之間的所有差異檔案
- diff 內容是 `main..HEAD` 的完整變更

::: tip 檢查目前分支

如果看不到「vs main」選項，說明你在預設分支上。可以用以下指令檢視目前分支：

```bash
git rev-parse --abbrev-ref HEAD
```

切換到 feature 分支後再試：

```bash
git checkout feature-branch
```

:::

## 檢查點 ✅

確認你已經掌握了：

- [ ] 能找到並開啟 diff 類型下拉選單
- [ ] 理解「Uncommitted」「Staged」「Last commit」的區別
- [ ] 能識別「vs main」選項什麼時候出現
- [ ] 知道在什麼情境下用哪種 diff 類型

## 踩坑提醒

### 坑 1：審查時只看 Uncommitted，漏掉了 Staged 檔案

**症狀**

提交後發現審查漏掉了一些已暫存的檔案。

**原因**

Uncommitted 檢視顯示工作區和暫存區的所有變更（`git diff HEAD`），已暫存的檔案也會包含其中。

**解決**

審查前先切到 Staged 檢視檢查一遍，或者用 Uncommitted 檢視（包含暫存區）。

### 坑 2：分支合併前沒有對比 main

**症狀**

合併到 main 後發現引入了不相關的修改。

**原因**

只看了最近幾天的提交，沒有對比整個分支相對於 main 的差異。

**解決**

合併前用「vs main」檢視全面檢查一遍。

### 坑 3：以為切換檢視會遺失註解

**症狀**

不敢切換 diff 類型，擔心之前新增的註解會消失。

**原因**

誤解了切換機制。

**實際情況**

切換 diff 類型時，Plannotator 會保留之前的註解——它們可能仍然適用，或者你可以手動刪除不相關的註解。

## 本課小結

Plannotator 支援的 5 種 diff 類型：

| 類型 | Git 指令 | 情境 |
|--- | --- | ---|
| Uncommitted | `git diff HEAD` | 審查本次開發的所有修改 |
| Staged | `git diff --staged` | 提交前審查暫存區 |
| Unstaged | `git diff` | 審查工作區修改 |
| Last commit | `git diff HEAD~1..HEAD` | 回滾或審查最近提交 |
| vs main | `git diff main..HEAD` | 分支合併前全面檢查 |

切換檢視不會遺失註解，你可以在不同視角下檢視同一批或新的註解。

## 下一課預告

> 下一課我們學習 **[URL 分享](../../advanced/url-sharing/)**。
>
> 你會學到：
> - 如何將審查內容壓縮到 URL 中分享給同事
> - 接收方如何開啟共享的審查連結
> - 分享模式下的限制和注意事項

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| Diff 類型定義 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15) | 10-15 |
| Git 上下文取得 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79-L96) | 79-96 |
| 執行 Git Diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101-L147) | 101-147 |
| Diff 切換處理 | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L300-L331) | 300-331 |
| 檔案樹中的 Diff 選項渲染 | [`packages/review-editor/components/FileTree.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/FileTree.tsx) | - |

**關鍵類型**：

- `DiffType`: `'uncommitted' | 'staged' | 'unstaged' | 'last-commit' | 'branch'`

**關鍵函式**：

- `getGitContext()`: 取得目前分支、預設分支和可用的 diff 選項
- `runGitDiff(diffType, defaultBranch)`: 根據 diff 類型執行對應的 git 指令

**關鍵 API**：

- `POST /api/diff/switch`: 切換 diff 類型，回傳新的 diff 資料

</details>
