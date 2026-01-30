---
title: "驗證循環: Checkpoint 與 Evals | Everything Claude Code"
subtitle: "驗證循環: Checkpoint 與 Evals"
sidebarTitle: "PR 前檢查不踩坑"
description: "學習 Everything Claude Code 的驗證循環機制。掌握 Checkpoint 管理、Evals 定義和持續驗證，透過 checkpoint 儲存狀態並回退，使用 evals 確保程式碼品質。"
tags:
  - "verification"
  - "checkpoint"
  - "evals"
  - "quality-gates"
prerequisite:
  - "platforms-tdd-workflow"
order: 120
---

# 驗證循環：Checkpoint 與 Evals

## 學完你能做什麼

學習驗證循環機制後，你可以：

- 使用 `/checkpoint` 儲存和恢復工作狀態
- 使用 `/verify` 執行全面的程式碼品質檢查
- 掌握 Eval-Driven Development（EDD）理念，定義和執行 evals
- 建立持續驗證循環，在開發過程中維持程式碼品質

## 你現在的困境

你剛完成一個功能，但不敢提交 PR，因為：
- 不確定是否破壞了現有功能
- 擔心測試覆蓋率下降
- 忘了最開始的目標是什麼，不知道是否偏離了方向
- 想回退到某個穩定狀態，但沒有記錄

如果有一個機制，能在關鍵時刻「拍照存檔」，並在開發過程中持續驗證，這些問題就迎刃而解了。

## 什麼時候用這一招

- **開始新功能前**：建立 checkpoint，記錄起始狀態
- **完成里程碑後**：儲存進度，便於回退和對比
- **提交 PR 前**：執行全面驗證，確保程式碼品質
- **重構時**：頻繁驗證，避免破壞現有功能
- **多人協作時**：共享 checkpoint，同步工作狀態

## 🎒 開始前的準備

::: warning 前置條件

本教學假設你已經：

- ✅ 完成了 [TDD 工作流程](../../platforms/tdd-workflow/) 的學習
- ✅ 熟悉基本的 Git 操作
- ✅ 了解如何使用 Everything Claude Code 的基本指令

:::

---

## 核心思路

**驗證循環**是一個品質保證機制，它把「寫程式碼 → 測試 → 驗證」這個循環變成了系統化流程。

### 三層驗證體系

Everything Claude Code 提供三層驗證：

| 層級 | 機制 | 目的 | 何時使用 |
| --- | --- | --- | --- |
| **即時驗證** | PostToolUse Hooks | 立即捕獲型別錯誤、console.log 等 | 每次工具呼叫後 |
| **週期驗證** | `/verify` 指令 | 全面檢查：建置、型別、測試、安全 | 每 15 分鐘或重大變更後 |
| **里程碑驗證** | `/checkpoint` | 對比狀態差異，追蹤品質趨勢 | 完成里程碑、提交 PR 前 |

### Checkpoint：程式碼的「存檔點」

Checkpoint 會在關鍵時刻「拍照存檔」：

- 記錄 Git SHA
- 記錄測試通過率
- 記錄程式碼覆蓋率
- 記錄時間戳記

驗證時，你可以對比當前狀態與任意 checkpoint 的差異。

### Evals：AI 開發的「單元測試」

**Eval-Driven Development（EDD）** 把 evals 當作 AI 開發的單元測試：

1. **先定義成功標準**（寫 evals）
2. **再寫程式碼**（實作功能）
3. **持續執行 evals**（驗證正確性）
4. **追蹤回歸**（確保不破壞現有功能）

這與 TDD（測試驅動開發）理念一致，但面向 AI 輔助開發。

---

## 跟我做：使用 Checkpoint

### 第 1 步：建立初始 checkpoint

開始新功能前，先建立 checkpoint：

```bash
/checkpoint create "feature-start"
```

**為什麼**
記錄起始狀態，便於後續對比。

**你應該看到**：

```
VERIFICATION: Running quick checks...
Build:    OK
Types:    OK

CHECKPOINT CREATED: feature-start
Time:     2026-01-25-14:30
Git SHA:  abc1234
Logged to: .claude/checkpoints.log
```

Checkpoint 會：
1. 先執行 `/verify quick`（只檢查建置和型別）
2. 建立 git stash 或 commit（命名：`checkpoint-feature-start`）
3. 記錄到 `.claude/checkpoints.log`

### 第 2 步：實作核心功能

開始撰寫程式碼，完成核心邏輯。

### 第 3 步：建立里程碑 checkpoint

完成核心功能後：

```bash
/checkpoint create "core-done"
```

**為什麼**
記錄里程碑，便於回退。

**你應該看到**：

```
CHECKPOINT CREATED: core-done
Time:     2026-01-25-16:45
Git SHA:  def5678
Logged to: .claude/checkpoints.log
```

### 第 4 步：驗證與對比

驗證當前狀態是否偏離目標：

```bash
/checkpoint verify "feature-start"
```

**為什麼**
對比從開始到現在，品質指標的變化。

**你應該看到**：

```
CHECKPOINT COMPARISON: feature-start
=====================================
Files changed: 12
Tests: +25 passed / -0 failed
Coverage: +15% / -2% (from 60% to 75%)
Build: PASS
Status: ✅ Quality improved
```

### 第 5 步：查看所有 checkpoints

查看歷史 checkpoint：

```bash
/checkpoint list
```

**你應該看到**：

```
CHECKPOINTS HISTORY
===================
Name           | Time             | Git SHA  | Status
---------------|------------------|----------|--------
feature-start  | 2026-01-25-14:30 | abc1234  | behind
core-done      | 2026-01-25-16:45 | def5678  | current
```

**檢查點 ✅**：驗證理解

- Checkpoint 會自動執行 `/verify quick` 嗎？✅ 是
- Checkpoint 記錄在哪個檔案？✅ `.claude/checkpoints.log`
- `/checkpoint verify` 會對比哪些指標？✅ 檔案變更、測試通過率、覆蓋率

---

## 跟我做：使用 Verify 指令

### 第 1 步：執行快速驗證

開發過程中，頻繁執行快速驗證：

```bash
/verify quick
```

**為什麼**
只檢查建置和型別，速度最快。

**你應該看到**：

```
VERIFICATION: PASS

Build:    OK
Types:    OK

Ready for next task: YES
```

### 第 2 步：執行全面驗證

準備提交 PR 前，執行完整檢查：

```bash
/verify full
```

**為什麼**
全面檢查所有品質關卡。

**你應該看到**：

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK (2 warnings)
Tests:    120/125 passed, 76% coverage
Secrets:  OK
Logs:     3 console.logs found in src/

Ready for PR: NO

Issues to Fix:
1. Remove console.log statements before PR
   Found in: src/utils/logger.ts:15, src/api/client.ts:23, src/ui/button.ts:8
2. Increase test coverage from 76% to 80% (target)
   Missing coverage in: src/components/Form.tsx
```

### 第 3 步：執行 PR 前驗證

最嚴格的檢查，包含安全掃描：

```bash
/verify pre-pr
```

**你應該看到**：

```
VERIFICATION: FAIL

Build:    OK
Types:    OK (1 error)
Lint:     OK
Tests:    120/125 passed, 76% coverage
Secrets:  ❌ FOUND (2 API keys)
Logs:     3 console.logs

Security Issues Found:
1. Hardcoded API key in src/api/config.ts:10
2. Secret key in .env.example

Ready for PR: NO

Critical Issues:
1. Remove hardcoded secrets
2. Fix type error in src/components/Form.tsx:45
3. Remove console.logs
4. Increase coverage to 80%
```

### 第 4 步：修復問題後重新驗證

修復問題後，再次執行驗證：

```bash
/verify full
```

**你應該看到**：

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK
Tests:    125/125 passed, 81% coverage
Secrets:  OK
Logs:     OK

Ready for PR: YES
```

**檢查點 ✅**：驗證理解

- `/verify quick` 只檢查什麼？✅ 建置和型別
- `/verify full` 會檢查哪些項目？✅ 建置、型別、Lint、測試、Secrets、Console.log、Git 狀態
- 哪個驗證模式包含安全掃描？✅ `pre-pr`

---

## 跟我做：使用 Evals（Eval-Driven Development）

### 第 1 步：定義 Evals（寫程式碼前）

**在開始編碼前，先定義成功標準**：

```markdown
## EVAL: user-authentication

### Capability Evals
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

### Regression Evals
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

**為什麼**
先定義成功標準，強迫思考「完成的標準是什麼」。

儲存到：`.claude/evals/user-authentication.md`

### 第 2 步：實作功能

根據 evals 撰寫程式碼。

### 第 3 步：執行能力 Evals

測試新功能是否滿足 evals：

```markdown
[CERTAIN CAPABILITY EVAL: user-authentication]

Test 1: User can register with email/password
Task: Call registration API with valid credentials
Expected: User account created, token returned
Actual: PASS

Test 2: User can login with valid credentials
Task: Call login API with registered credentials
Expected: JWT token returned
Actual: PASS

Test 3: Invalid credentials rejected
Task: Call login API with wrong password
Expected: 401 Unauthorized with error message
Actual: PASS

Overall: 3/3 passed
```

### 第 4 步：執行回歸 Evals

確保不破壞現有功能：

```bash
npm test -- --testPathPattern="existing"
```

**你應該看到**：

```
PASS  existing/auth.test.ts
PASS  existing/api.test.ts
PASS  existing/db.test.ts

All regression tests: 15/15 passed
```

### 第 5 步：產生 Eval 報告

彙總結果：

```markdown
EVAL REPORT: user-authentication
=================================

Capability Evals:
  register-user:       PASS (pass@1)
  login-user:          PASS (pass@2)
  reject-invalid:      PASS (pass@1)
  session-persistence: PASS (pass@1)
  logout-clears:       PASS (pass@1)
  Overall:             5/5 passed

Regression Evals:
  public-routes:       PASS
  api-responses:       PASS
  db-schema:           PASS
  Overall:             3/3 passed

Metrics:
  pass@1: 80% (4/5)
  pass@3: 100% (5/5)
  pass^3: 100% (3/3)

Status: READY FOR REVIEW
```

**檢查點 ✅**：驗證理解

- Evals 應該在什麼時候定義？✅ 寫程式碼前
- capability evals 和 regression evals 的區別？✅ 前者測試新功能，後者確保不破壞現有功能
- pass@3 的含義？✅ 3 次嘗試內成功的機率

---

## 踩坑提醒

### 坑 1：忘記建立 checkpoint

**問題**：開發一段時間後，想回退到某個狀態，但沒有記錄。

**解決**：在開始每個新功能前，建立 checkpoint：

```bash
# 好習慣：新功能開始前
/checkpoint create "feature-name-start"

# 好習慣：每個里程碑
/checkpoint create "phase-1-done"
/checkpoint create "phase-2-done"
```

### 坑 2：Evals 定義過於模糊

**問題**：Evals 寫得很模糊，無法驗證。

**錯誤示例**：
```markdown
- [ ] 使用者可以登入
```

**正確示例**：
```markdown
- [ ] User can login with valid credentials
  Task: POST /api/login with email="test@example.com", password="Test123!"
  Expected: HTTP 200 with JWT token in response body
  Actual: ___________
```

### 坑 3：只在提交 PR 前執行驗證

**問題**：等到 PR 前才發現問題，修復成本高。

**解決**：建立持續驗證習慣：

```
每 15 分鐘執行：/verify quick
每次功能完成：/checkpoint create "milestone"
提交 PR 前：   /verify pre-pr
```

### 坑 4：Evals 不更新

**問題**：需求變更後，Evals 還是舊的，導致驗證失效。

**解決**：Evals 是「第一類程式碼」，需求變更時同步更新：

```bash
# 需求變更 → 更新 Evals → 更新程式碼
1. 修改 .claude/evals/feature-name.md
2. 根據新 evals 修改程式碼
3. 重新執行 evals
```

---

## 本課小結

驗證循環是維持程式碼品質的系統化方法：

| 機制 | 作用 | 使用頻率 |
| --- | --- | --- |
| **PostToolUse Hooks** | 即時捕獲錯誤 | 每次工具呼叫 |
| **`/verify`** | 週期性全面檢查 | 每 15 分鐘 |
| **`/checkpoint`** | 里程碑記錄和對比 | 每個功能階段 |
| **Evals** | 功能驗證和回歸測試 | 每個新功能 |

核心原則：
1. **先定義，後實作**（Evals）
2. **頻繁驗證，持續改進**（`/verify`）
3. **記錄里程碑，便於回退**（`/checkpoint`）

---

## 下一課預告

> 下一課我們學習 **[自訂 Rules：建構專案專屬規範](../custom-rules/)**。
>
> 你會學到：
> - 如何建立自訂 Rules 檔案
> - Rule 檔案格式和檢查清單撰寫
> - 定義專案特定的安全規則
> - 將團隊規範整合到程式碼審查流程

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Checkpoint 指令定義 | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify 指令定義 | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Verification Loop Skill | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| Eval Harness Skill | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |

**關鍵流程**：
- Checkpoint 建立流程：先執行 `/verify quick` → 建立 git stash/commit → 記錄到 `.claude/checkpoints.log`
- Verify 驗證流程：Build Check → Type Check → Lint Check → Test Suite → Console.log Audit → Git Status
- Eval 工作流：Define（定義 evals）→ Implement（實作程式碼）→ Evaluate（執行 evals）→ Report（產生報告）

**關鍵參數**：
- `/checkpoint [create\|verify\|list] [name]` - Checkpoint 操作
- `/verify [quick\|full\|pre-commit\|pre-pr]` - 驗證模式
- pass@3 - 3 次嘗試內成功的目標（>90%）
- pass^3 - 3 次連續成功（100%，用於關鍵路徑）

</details>
