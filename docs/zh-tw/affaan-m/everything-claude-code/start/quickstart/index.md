---
title: "快速上手: 安裝外掛 | everything-claude-code"
sidebarTitle: "5分鐘上手"
subtitle: "快速上手: 安裝 everything-claude-code 外掛"
description: "學習 everything-claude-code 的安裝方法和核心功能。在 5 分鐘內完成外掛安裝，使用 /plan、/tdd、/code-review 指令提升開發效率。"
tags:
  - "quickstart"
  - "installation"
  - "getting-started"
prerequisite: []
order: 10
---

# 快速開始：5分鐘上手 Everything Claude Code

## 學完你能做什麼

**Everything Claude Code** 是一個 Claude Code 外掛，提供專業化的 agents、commands、rules 和 hooks，幫助你提升程式碼品質和開發效率。本教程幫你：

- ✅ 在 5 分鐘內完成 Everything Claude Code 安裝
- ✅ 使用 `/plan` 指令建立實作計畫
- ✅ 使用 `/tdd` 指令進行測試驅動開發
- ✅ 使用 `/code-review` 進行程式碼審查
- ✅ 理解外掛的核心元件

## 你現在的困境

你想讓 Claude Code 更強大，但：
- ❌ 每次都要重複說明編碼規範和最佳實踐
- ❌ 測試覆蓋率低，bug 頻出
- ❌ 程式碼審查總是遺漏安全問題
- ❌ 想要 TDD 但不知道如何開始
- ❌ 希望有專業的子代理幫助處理特定任務

**Everything Claude Code** 解決這些問題：
- 9 個專業化 agents（planner, tdd-guide, code-reviewer, security-reviewer 等）
- 14 個斜線指令（/plan, /tdd, /code-review 等）
- 8 套強制規則（security, coding-style, testing 等）
- 15+ 個自動化 hooks
- 11 個 workflow skills

## 核心思路

**Everything Claude Code** 是一個 Claude Code 外掛，提供：
- **Agents**：專業化子代理，處理特定領域任務（如 TDD、程式碼審查、安全審計）
- **Commands**：斜線指令，快速啟動工作流（如 `/plan`、`/tdd`）
- **Rules**：強制規則，確保程式碼品質和安全（如 80%+ 覆蓋率、禁止 console.log）
- **Skills**：工作流定義，複用最佳實踐
- **Hooks**：自動化鉤子，在特定事件時觸發（如會話持久化、console.log 警告）

::: tip 什麼是 Claude Code 外掛？
Claude Code 外掛擴展了 Claude Code 的能力，就像 VS Code 外掛擴展編輯器功能。安裝後，你就可以使用外掛提供的所有 agents、commands、skills 和 hooks。
:::

## 🎒 開始前的準備

**你需要的**：
- 已安裝 Claude Code
- 對終端機指令有基本了解
- 有一個專案目錄（用於測試）

**你不需要的**：
- 不需要特殊的程式語言知識
- 不需要預先設定任何內容

---

## 跟我做：5 分鐘安裝

### 第 1 步：開啟 Claude Code

啟動 Claude Code 並開啟一個專案目錄。

**你應該看到**：Claude Code 的命令列介面準備就緒。

---

### 第 2 步：新增 Marketplace

在 Claude Code 中，執行以下指令新增 marketplace：

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**為什麼**
將 Everything Claude Code 新增為 Claude Code 的外掛來源，這樣就可以從中安裝外掛。

**你應該看到**：
```
✓ Successfully added marketplace: everything-claude-code
```

---

### 第 3 步：安裝外掛

執行以下指令安裝外掛：

```bash
/plugin install everything-claude-code@everything-claude-code
```

**為什麼**
安裝 Everything Claude Code 外掛，這樣就可以使用它提供的所有功能。

**你應該看到**：
```
✓ Successfully installed plugin: everything-claude-code@everything-claude-code
```

---

### 第 4 步：驗證安裝

執行以下指令查看已安裝的外掛：

```bash
/plugin list
```

**你應該看到**：
```
Installed Plugins:
  everything-claude-code@everything-claude-code
```

✅ 安裝成功！

---

## 跟我做：體驗核心功能

### 第 5 步：使用 /plan 建立實作計畫

假設你想新增一個使用者認證功能，執行：

```bash
/plan I need to add user authentication with email and password
```

**為什麼**
使用 planner agent 建立詳細的實作計畫，避免遺漏關鍵步驟。

**你應該看到**：
```
# Implementation Plan: User Authentication with Email and Password

## Requirements Restatement
- User registration with email and password
- User login with email and password
- Password hashing with bcrypt
- JWT token generation
- Session management

## Implementation Phases
[詳細的實作步驟...]

## Risks
- HIGH: Password security (use bcrypt, salt rounds)
- MEDIUM: JWT token expiration
- LOW: Email uniqueness validation

## Estimated Complexity: MEDIUM
**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

輸入 `yes` 確認計畫，然後 planner 會開始實施。

---

### 第 6 步：使用 /tdd 進行測試驅動開發

在實作功能時，執行：

```bash
/tdd I need to implement a function to validate email format
```

**為什麼**
使用 tdd-guide agent 強制 TDD 流程，確保先寫測試，再實作程式碼，達到 80%+ 覆蓋率。

**你應該看到**：
```
# TDD Session: Email Format Validator

## Step 1: Define Interface (SCAFFOLD)
```typescript
// lib/email-validator.ts
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)
[測試程式碼...]

## Step 3: Run Tests - Verify FAIL
[測試失敗...]

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)
[實作程式碼...]

## Step 5: Run Tests - Verify PASS
[測試通過...]

## Step 6: Refactor (IMPROVE)
[重構程式碼...]

## Step 7: Verify Tests Still Pass
[測試仍然通過...]

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)

✅ TDD session complete!
```

---

### 第 7 步：使用 /code-review 審查程式碼

在提交程式碼前，執行：

```bash
/code-review
```

**為什麼**
使用 code-reviewer agent 檢查程式碼品質、安全性和最佳實踐。

**你應該看到**：
```
# Code Review Report

## Overview
- Files reviewed: 3
- Total lines: 150
- Issues found: 2

## Issues Found

### 1. [CRITICAL] Hardcoded JWT Secret
**Location**: `lib/auth.ts:15`
**Issue**: JWT secret is hardcoded in source code
**Fix**: Move to environment variable
**Impact**: Security vulnerability - secret exposed in code

### 2. [MEDIUM] Missing Error Handling
**Location**: `lib/email-validator.ts:23`
**Issue**: No error handling for null/undefined input
**Fix**: Add null check at function start
**Impact**: Potential runtime errors

## Recommendations
✓ Tests are well written
✓ Code is readable
✓ Follows TypeScript best practices

**Action Required**: Fix CRITICAL issues before commit.
```

修復問題後，再次執行 `/code-review` 確認所有問題已解決。

---

## 檢查點 ✅

確認你已經成功完成以下步驟：

- [ ] 成功新增 marketplace
- [ ] 成功安裝 everything-claude-code 外掛
- [ ] 使用 `/plan` 建立了實作計畫
- [ ] 使用 `/tdd` 進行了 TDD 開發
- [ ] 使用 `/code-review` 進行了程式碼審查

如果遇到問題，查看 [常見問題排查](../../faq/troubleshooting-hooks/) 或檢查 [MCP 連接失敗](../../faq/troubleshooting-mcp/)。

---

## 踩坑提醒

::: warning 安裝失敗
如果 `/plugin marketplace add` 失敗，確保：
1. 你使用的是 Claude Code 最新版本
2. 網路連線正常
3. GitHub 存取正常（可能需要代理）
:::

::: warning 指令不可用
如果 `/plan` 或 `/tdd` 指令不可用：
1. 執行 `/plugin list` 確認外掛已安裝
2. 檢查外掛狀態是否為 enabled
3. 重啟 Claude Code
:::

::: tip Windows 使用者
Everything Claude Code 完全支援 Windows。所有 hooks 和腳本都使用 Node.js 重寫，確保跨平台相容性。
:::

---

## 本課小結

✅ 你已經：
1. 成功安裝 Everything Claude Code 外掛
2. 理解了核心概念：agents、commands、rules、skills、hooks
3. 體驗了 `/plan`、`/tdd`、`/code-review` 三個核心指令
4. 掌握了基本的 TDD 開發流程

**記住**：
- Agents 是專業化子代理，處理特定任務
- Commands 是快速啟動工作流的入口
- Rules 是強制規則，確保程式碼品質和安全
- 從有共鳴的功能開始，逐步擴展
- 不要啟用所有 MCPs，保持少於 10 個

---

## 下一課預告

> 下一課我們學習 **[安裝指南：外掛市場 vs 手動安裝](../installation/)**。
>
> 你會學到：
> - 外掛市場安裝的詳細步驟
> - 手動安裝的完整流程
> - 如何只複製需要的元件
> - MCP 伺服器的設定方法

繼續學習，深入了解 Everything Claude Code 的完整安裝和設定。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能          | 檔案路徑                                                                                    | 行號  |
|--- | --- | ---|
| 外掛清單       | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28  |
| Marketplace 設定 | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45  |
| 安裝說明       | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                        | 175-242 |
| /plan 指令      | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114 |
| /tdd 指令      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)            | 1-327 |

**關鍵常數**：
- 外掛名稱: `everything-claude-code`
- Marketplace 倉庫: `affaan-m/everything-claude-code`

**關鍵檔案**：
- `plugin.json`: 外掛中繼資料和元件路徑
- `commands/*.md`: 14 個斜線指令定義
- `agents/*.md`: 9 個專業化子代理
- `rules/*.md`: 8 套強制規則
- `hooks/hooks.json`: 15+ 個自動化鉤子設定

</details>
