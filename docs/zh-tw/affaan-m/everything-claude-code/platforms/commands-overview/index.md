---
title: "Commands: 15 個斜槓指令 | Everything Claude Code"
subtitle: "Commands: 15 個斜槓指令 | Everything Claude Code"
sidebarTitle: "用 15 個指令搞定開發"
description: "學習 Everything Claude Code 的 15 個斜槓指令。掌握 /plan、/tdd、/code-review、/e2e、/verify 等核心指令的使用方法，提升開發效率。"
tags:
  - "commands"
  - "slash-commands"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# 核心 Commands 詳解：15 個斜槓指令全攻略

## 學完你能做什麼

- 快速啟動 TDD 開發流程，實現高品質程式碼
- 建立系統化實作計畫，避免遺漏關鍵步驟
- 執行全面程式碼審查和安全稽核
- 產生端對端測試，驗證關鍵使用者流程
- 自動化修復建置錯誤，節省除錯時間
- 安全清理死程式碼，保持程式碼庫精簡
- 提取和復用已解決問題的模式
- 管理工作狀態和檢查點
- 執行全面驗證，確保程式碼就緒

## 你現在的困境

開發過程中你可能會遇到這些問題：

- **不知道從哪裡開始** —— 面對新需求，如何拆解實作步驟？
- **測試覆蓋率低** —— 寫的程式碼很多，但測試不夠，品質難以保證
- **建置錯誤堆積** —— 修改程式碼後，類型錯誤一個接一個，不知道從哪裡修
- **程式碼審查不系統** —— 靠眼看容易漏掉安全問題
- **重複解決同樣的問題** —— 遇過的坑下次又掉進去了

Everything Claude Code 的 15 個斜槓指令就是為了解決這些痛點設計的。

## 核心思路

**指令是工作流的入口點**。每個指令封裝了一個完整的開發流程，呼叫相應的 agent 或技能，幫你完成特定任務。

::: tip 指令 vs Agent vs Skill

- **指令**：你直接在 Claude Code 中輸入的快捷入口（如 `/tdd`、`/plan`）
- **Agent**：指令呼叫的專業子代理，負責具體執行
- **Skill**：Agent 可以引用的工作流定義和領域知識

一個指令通常會呼叫一個或多個 agent，agent 可能會引用相關的 skill。

:::

## 指令概覽

15 個指令按功能分類：

| 類別 | 指令 | 用途 |
|--- | --- | ---|
| **開發流程** | `/plan` | 建立實作計畫 |
| | `/tdd` | 執行測試驅動開發 |
| | `/orchestrate` | 序列執行多個 agents |
| **程式碼品質** | `/code-review` | 程式碼審查 |
| | `/build-fix` | 修復建置錯誤 |
| | `/refactor-clean` | 清理死程式碼 |
| | `/verify` | 全面驗證 |
| **測試** | `/e2e` | 端對端測試 |
| | `/test-coverage` | 分析測試覆蓋率 |
| | `/eval` | 管理 eval 驅動開發 |
| **文件與架構** | `/update-docs` | 同步文件 |
| | `/update-codemaps` | 更新架構文件 |
| **狀態管理** | `/checkpoint` | 保存工作狀態 |
| **學習與優化** | `/learn` | 提取可復用模式 |
| **組態** | `/setup-pm` | 組態套件管理員 |

## 開發流程類指令

### /plan：規劃複雜功能

**用途**：在開始編碼前，建立詳細的實作計畫。

**適用場景**：
- 開始新功能開發
- 進行重大架構變更
- 需求不清晰或模糊時
- 多檔案/多元件協同修改

**工作流程**：

```
1. 重述需求
   ↓
2. 識別風險和相依性
   ↓
3. 拆分為具體階段
   ↓
4. 等待你確認
```

::: warning 關鍵特性

planner agent **不會寫任何程式碼**，直到你明確確認計畫。

:::

**示例**：

```
你：/plan 我需要添加即時通知功能

Claude：
# Implementation Plan: Real-Time Market Resolution Notifications

## Requirements Restatement
- Send notifications when markets resolve
- Support multiple channels (in-app, email, webhook)
- Ensure reliable delivery
- Include market outcome and user's position result

## Implementation Phases
### Phase 1: Database Schema
- Add notifications table
- Add user_notification_preferences table
- Create indexes

### Phase 2: Notification Service
- Create notification queue using BullMQ/Redis
- Implement retry logic
- Create notification templates

...

WAITING FOR CONFIRMATION: Proceed with this plan? (yes/no/modify)
```

**最佳實踐**：
- ✅ 複雜功能先規劃再實作
- ✅ 仔細檢查風險和相依性
- ✅ 按階段執行，每階段驗證
- ❌ 不要直接跳過規劃

---

### /tdd：測試驅動開發

**用途**：強制執行 TDD 流程，確保測試覆蓋率 ≥ 80%。

**適用場景**：
- 實作新功能
- 修復 Bug（先寫能重現 bug 的測試）
- 重構現有程式碼
- 撰寫核心業務邏輯

**TDD 循環**：

```
RED → GREEN → REFACTOR → REPEAT

RED:      寫一個會失敗的測試
GREEN:    寫最少的程式碼讓測試通過
REFACTOR: 改進程式碼，保持測試通過
REPEAT:   下一個功能/場景
```

::: warning 強制要求

**必須先寫測試，再寫程式碼**。不能跳過 RED 階段。

:::

**示例**：

```
你：/tdd 我需要一個計算市場流動性分數的函式

Claude（tdd-guide agent）：
## Step 1: Define Interface (SCAFFOLD)
```typescript
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}
```

## Step 2: Write Failing Test (RED)
```typescript
test('should return high score for liquid market', () => {
  const market = { ... }
  expect(calculateLiquidityScore(market)).toBeGreaterThan(80)
})
```

## Step 3: Run Tests - Verify FAIL
```bash
npm test lib/liquidity.test.ts
FAIL ✕ should return high score for liquid market
  Error: Not implemented
```

## Step 4: Implement Minimal Code (GREEN)
```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // 實作程式碼...
}
```

## Step 5: Run Tests - Verify PASS
```bash
npm test lib/liquidity.test.ts
PASS ✓ should return high score for liquid market
```

## Step 6: Refactor (IMPROVE)
// 改進程式碼結構...

## Step 7: Verify Tests Still Pass
```bash
npm test lib/liquidity.test.ts
PASS ✓ all tests passing
```

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)
```

**最佳實踐**：
- ✅ 先寫介面定義
- ✅ 測試失敗後再實作
- ✅ 每寫完一個功能立即測試
- ✅ 重構前後都驗證測試通過
- ✅ 覆蓋率 ≥ 80%（關鍵程式碼 100%）
- ❌ 不要寫太多程式碼才測試
- ❌ 不要跳過 RED 階段
- ❌ 不要測試實作細節

---

### /orchestrate：序列執行 agents

**用途**：自動化執行多個 agents 的序列工作流。

**適用場景**：
- 完整功能開發（planner → tdd-guide → code-reviewer → security-reviewer）
- Bug 修復流程（explorer → tdd-guide → code-reviewer）
- 安全審查（security-reviewer → code-reviewer → architect）

**工作流類型**：

| 工作流類型 | Agent 序列 |
|--- | ---|
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**示例**：

```
你：/orchestrate feature "添加使用者認證功能"

Claude：
### ORCHESTRATION REPORT
Workflow: feature
Task: 添加使用者認證功能
Agents: planner → tdd-guide → code-reviewer → security-reviewer

SUMMARY
-------
成功實現使用者認證功能，包括註冊、登入、工作階段管理。

AGENT OUTPUTS
-------------
Planner: 建立了 4 階段實作計畫
TDD Guide: 實現了認證服務，覆蓋率 95%
Code Reviewer: 發現 3 個高優先順序問題，已修復
Security Reviewer: 通過安全稽核，無漏洞

FILES CHANGED
-------------
- src/services/auth.ts
- src/api/auth/route.ts
- tests/auth.test.ts
- ...

TEST RESULTS
------------
PASS: 24/24 tests (100%)

SECURITY STATUS
---------------
✅ No vulnerabilities found

RECOMMENDATION
--------------
✅ SHIP - Ready for production
```

**最佳實踐**：
- ✅ 複雜功能使用 orchestrate
- ✅ 每個 agent 之間有清晰的手持文件
- ✅ 並行執行獨立的檢查（code-reviewer 和 security-reviewer）
- ❌ 不要在簡單任務上使用 orchestrate

---

## 程式碼品質類指令

### /code-review：程式碼審查

**用途**：全面審查未提交的程式碼，檢查安全問題和程式碼品質。

**適用場景**：
- 提交程式碼前
- 合併 PR 前
- 完成功能開發後

**檢查項**：

| 類別 | 檢查內容 | 嚴重程度 |
|--- | --- | ---|
| **安全** | 硬編碼金鑰、SQL 注入、XSS、缺少輸入驗證 | CRITICAL |
| **程式碼品質** | 函式 > 50 行、檔案 > 800 行、巢狀深度 > 4 | HIGH |
| **最佳實踐** | 變異模式、console.log、缺少測試、TODO/FIXME | MEDIUM |

**示例**：

```
你：/code-review

Claude（code-reviewer agent）：
# Code Review Report

## Security Issues (CRITICAL)
🔴 [HIGH] Hardcoded API key
File: src/api/github.ts:15
Issue: GitHub token is hardcoded
Fix: Move to environment variable

## Code Quality (HIGH)
🟡 [MEDIUM] Function exceeds 50 lines
File: src/utils/formatter.ts:62
Lines: 78
Issue: FormatLargeData function is too long
Fix: Split into smaller functions

## Best Practices (MEDIUM)
🟢 [LOW] TODO comment
File: src/services/user.ts:45
Issue: TODO: Add rate limiting
Fix: Implement or remove comment

SUMMARY
--------
CRITICAL: 1 (Must fix before commit)
HIGH: 2 (Should fix)
MEDIUM: 3 (Nice to have)

❌ BLOCKED - Critical security issues found
```

::: danger 阻止提交規則

如果發現 **CRITICAL** 或 **HIGH** 級別問題，會阻止提交。

:::

---

### /build-fix：修復建置錯誤

**用途**：逐個修復 TypeScript 和建置錯誤。

**適用場景**：
- 執行 `npm run build` 失敗
- TypeScript 類型錯誤
- 編譯錯誤

**工作流程**：

```
1. 執行建置
   ↓
2. 解析錯誤輸出，按嚴重程度排序
   ↓
3. 逐個修復：
   - 顯示錯誤上下文
   - 解釋問題
   - 提出修復方案
   - 應用修復
   - 重新執行建置
   ↓
4. 產生修復總結
```

**示例**：

```
你：/build-fix

Claude（build-error-resolver agent）：
# Fixing Build Errors

Running build: npm run build
Found 5 errors

## Error 1: Type 'string' is not assignable to type 'number'
File: src/calculator.ts:15
```typescript
const result = add("10", "20")  // Error
```
Issue: add function expects numbers, received strings
Fix: Convert to numbers
```typescript
const result = add(Number("10"), Number("20"))
```
✅ Fixed. Re-running build...

## Error 2: Cannot find module './utils'
File: src/index.ts:3
Issue: Import path is incorrect
Fix: Change to './utils/helper'
```typescript
import { helper } from './utils/helper'
```
✅ Fixed. Re-running build...

...

SUMMARY
-------
Errors Fixed: 5
Errors Remaining: 0
Build Status: ✅ PASS
```

::: tip 安全第一

一次只修復一個錯誤，防止引入新問題。

:::

---

### /refactor-clean：清理死程式碼

**用途**：安全識別和移除未使用的程式碼。

**適用場景**：
- 程式碼庫中有大量未使用的檔案和匯出
- 減少維護負擔
- 提升程式碼可讀性

**工作流程**：

```
1. 執行死程式碼分析工具
   - knip：查找未使用的匯出和檔案
   - depcheck：查找未使用的相依性
   - ts-prune：查找未使用的 TypeScript 匯出
   ↓
2. 產生綜合報告
   ↓
3. 按嚴重程度分類
   - SAFE：測試檔案、未使用的工具函式
   - CAUTION：API 路由、元件
   - DANGER：組態檔案、入口檔案
   ↓
4. 逐個刪除（先測試）
   ↓
5. 產生清理總結
```

**示例**：

```
你：/refactor-clean

Claude（refactor-cleaner agent）：
# Dead Code Analysis

## Tools Run
- ✅ knip: Found 12 unused exports
- ✅ depcheck: Found 5 unused dependencies
- ✅ ts-prune: Found 8 unused TypeScript exports

## Classification

### SAFE (Can delete)
- `src/utils/old-helper.ts` - Unused utility function
- `src/components/Button.tsx` - Not used anywhere
- `lodash` - Unused dependency

### CAUTION (Review first)
- `src/api/users.ts` - Only used in tests
- `@types/node` - May be used in build scripts

### DANGER (Do not delete)
- `src/index.ts` - Main entry point
- `tsconfig.json` - Configuration file

## Deletion Plan

Run full test suite first:
✅ Tests passing (98% coverage)

Deleting SAFE items...

1. Removing src/utils/old-helper.ts
   ✅ Tests still passing

2. Removing src/components/Button.tsx
   ✅ Tests still passing

3. Removing lodash from package.json
   ✅ Tests still passing

SUMMARY
-------
Files deleted: 12
Dependencies removed: 5
Tests still passing: ✅
```

::: warning 測試優先

**刪除程式碼前必須先執行測試**，確保沒有破壞現有功能。

:::

---

### /verify：全面驗證

**用途**：執行完整的程式碼驗證檢查。

**適用場景**：
- 提交程式碼前
- 合併 PR 前
- 準備發布時

**檢查項**（按順序）：

1. **建置檢查** - 執行建置命令
2. **類型檢查** - 執行 TypeScript 檢查器
3. **Lint 檢查** - 執行 linter
4. **測試套件** - 執行所有測試，報告覆蓋率
5. **Console.log 稽核** - 搜尋原始檔案中的 console.log
6. **Git 狀態** - 顯示未提交的變更

**示例**：

```
你：/verify pre-pr

Claude：
# Verification Report

VERIFICATION: ✅ PASS

Build:    ✅ OK
Types:    ✅ OK (0 errors)
Lint:     ✅ OK (0 issues)
Tests:    ✅ 142/145 passed, 98% coverage
Secrets:  ✅ OK (0 found)
Logs:     ⚠️ 3 console.logs found

Console.log locations:
- src/utils/logger.ts:15 (intentional logger)
- src/api/webhook.ts:42 (debug, remove before commit)
- src/services/auth.ts:89 (debug, remove before commit)

Ready for PR: ⚠️ YES (remove debug logs)

Files modified since last commit:
- src/api/webhook.ts (new)
- src/services/auth.ts (modified)
- tests/auth.test.ts (modified)
```

**參數**：
- `quick` - 僅建置 + 類型檢查
- `full` - 所有檢查（預設）
- `pre-commit` - 提交相關檢查
- `pre-pr` - 完整檢查 + 安全掃描

---

## 測試類指令

### /e2e：端對端測試

**用途**：使用 Playwright 產生和執行端對端測試。

**適用場景**：
- 測試關鍵使用者流程（登入、交易、支付）
- 驗證多步驟流程的端對端整合
- 測試 UI 互動和導覽
- 準備生產部署

**工作流程**：

```
1. 分析使用者流程，識別測試場景
   ↓
2. 產生 Playwright 測試（使用 Page Object 模式）
   ↓
3. 跨多個瀏覽器執行測試（Chrome、Firefox、Safari）
   ↓
4. 擷取失敗時的截圖、影片、追蹤
   ↓
5. 產生包含結果和工件的報告
   ↓
6. 識別不穩定的測試並建議修復
```

**示例**：

```
你：/e2e 測試市場搜尋和查看流程

Claude（e2e-runner agent）：
# E2E Test Generation: Market Search and View Flow

## Test Scenario Identified
**User Journey:** Market Search → View Results → Click Market → View Details

## Generated Test Code
```typescript
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test('user can search markets and view details', async ({ page }) => {
  const marketsPage = new MarketsPage(page)
  await marketsPage.goto()

  // Perform search
  await marketsPage.searchMarkets('election')
  await page.waitForResponse(resp =>
    resp.url().includes('/api/markets/search') && resp.status() === 200
  )

  // Verify results
  const marketCards = marketsPage.marketCards
  await expect(marketCards.first()).toBeVisible()

  // Click on first result
  await marketCards.first().click()

  // Verify market details page loads
  await expect(page).toHaveURL(/\/markets\/[a-z0-9-]+/)
  await expect(page.locator('[data-testid="market-name"]')).toBeVisible()
})
```

## Running Tests
```bash
npx playwright test tests/e2e/markets/search-and-view.spec.ts

✓ [chromium] user can search markets and view details (4.2s)
✓ [chromium] search with no results shows empty state (1.8s)

2 passed (6.0s)

Artifacts generated:
- artifacts/search-results.png
- artifacts/market-details.png
- playwright-report/index.html
```

## Test Report
╔══════════════════════════════════════════════════════╗
║ Status:     ✅ ALL TESTS PASSED                       ║
║ Total:      2 tests                                    ║
║ Passed:     2 (100%)                                   ║
║ Flaky:      0                                           ║
╚══════════════════════════════════════════════════════╝
```

**快速指令**：

```bash
# 執行所有 E2E 測試
npx playwright test

# 執行特定測試檔案
npx playwright test tests/e2e/markets/search.spec.ts

# 以 headed 模式執行（看到瀏覽器）
npx playwright test --headed

# 除錯測試
npx playwright test --debug

# 查看報告
npx playwright show-report
```

**最佳實踐**：
- ✅ 使用 Page Object Model 提高可維護性
- ✅ 使用 data-testid 屬性作為選擇器
- ✅ 等待 API 回應，而非任意超時
- ✅ 測試關鍵使用者流程
- ❌ 不要使用脆弱的選擇器（CSS 類會變化）
- ❌ 不要測試實作細節

---

### /test-coverage：測試覆蓋率分析

**用途**：分析測試覆蓋率並產生缺失的測試。

**適用場景**：
- 覆蓋率低於 80%
- 需要補充測試

**工作流程**：

```
1. 執行帶覆蓋率的測試
   ↓
2. 分析覆蓋率報告（coverage/coverage-summary.json）
   ↓
3. 識別低於 80% 覆蓋率閾值的檔案
   ↓
4. 為每個覆蓋率不足的檔案：
   - 分析未測試的程式碼路徑
   - 產生函式的單元測試
   - 產生 API 的整合測試
   ↓
5. 驗證新測試通過
   ↓
6. 顯示前後覆蓋率指標
```

**示例**：

```
你：/test-coverage

Claude：
# Test Coverage Analysis

Running tests with coverage...
npm test --coverage

## Coverage Report

File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   65    |   50     |   75    |   63  ⚠️
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   45    |   30     |   50    |   44  ⚠️

Overall                   |   78    |   72     |   85    |   76  ⚠️

Target: 80%
Current: 76% ❌ Need to improve

## Generating Missing Tests

### File: src/utils/formatter.ts (65% coverage)
Untested paths:
- FormatCurrency with negative values
- FormatDate with custom locale
- TruncateText with long strings

Generating tests...
```typescript
describe('formatter', () => {
  it('should format negative currency', () => {
    expect(formatCurrency(-100)).toBe('-$100.00')
  })

  it('should format date with custom locale', () => {
    expect(formatDate(new Date(), 'ja-JP')).toMatch('2024年')
  })

  it('should truncate long text', () => {
    expect(truncateText('a'.repeat(100), 10)).toBe('aaaaaaaaaa...')
  })
})
```

### File: src/components/Button.tsx (45% coverage)
Untested paths:
- Disabled state
- Loading state
- onClick handler

Generating tests...

## After Adding Tests

Running tests again...

File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   100   |   95     |   100   |   99  ✅
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   95    |   90     |   100   |   94  ✅

Overall                   |   95    |   92     |   100   |   94  ✅

Target: 80%
Current: 94% ✅ EXCEEDED

Summary: +12 tests added, Coverage: 76% → 94%
```

---

### /eval：評估驅動開發

**用途**：管理 eval 驅動開發工作流。

**適用場景**：
- 評估驅動開發（EDD）
- 功能驗收測試
- 迴歸測試

**子指令**：

- `define <name>` - 建立新的 eval 定義
- `check <name>` - 執行並檢查 evals
- `report <name>` - 產生完整報告
- `list` - 顯示所有 evals

**示例 - 定義 Eval**：

```
你：/eval define user-auth

Claude：
建立 eval 定義...

.claude/evals/user-auth.md:

## EVAL: user-auth
Created: 2026-01-25

### Capability Evals
- [ ] User can register with email and password
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong password
- [ ] User can reset password via email

### Regression Evals
- [ ] Existing users can still login
- [ ] Session tokens still work
- [ ] OAuth login still works

### Success Criteria
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals

請填寫具體的評估標準...
```

**示例 - 檢查 Eval**：

```
你：/eval check user-auth

Claude：
執行 evals...

EVAL CHECK: user-auth
======================
Capability: 2/4 passing
Regression: 2/3 passing
Status: IN PROGRESS

Capability Results:
✅ User can register with email and password
✅ User can login with correct credentials
❌ User cannot login with wrong password (fails intermittently)
❌ User can reset password via email (not implemented)

Regression Results:
✅ Existing users can still login
✅ Session tokens still work
❌ OAuth login still works (test failing due to rate limit)

RECOMMENDATION: NEEDS WORK - Fix password validation and implement password reset
```

**示例 - 報告 Eval**：

```
你：/eval report user-auth

Claude：
產生綜合報告...

EVAL REPORT: user-auth
========================
Generated: 2026-01-25

CAPABILITY EVALS
----------------
[register-email-pass]: PASS (pass@1)
[login-credentials-pass]: PASS (pass@2) - required retry
[login-wrong-pass-fail]: FAIL - see notes
[password-reset-pass]: FAIL - not implemented

REGRESSION EVALS
----------------
[existing-users-login]: PASS
[session-tokens]: PASS
[oauth-login]: PASS

METRICS
-------
Capability pass@1: 50%
Capability pass@3: 100%
Regression pass^3: 100%

NOTES
-----
Password validation test is flaky due to timing issue.
Need to implement password reset flow.

RECOMMENDATION
--------------
NEEDS WORK - Complete password reset implementation
```

---

## 文件與架構類指令

### /update-docs：同步文件

**用途**：從原始碼同步文件。

**適用場景**：
- 程式碼變更後更新文件
- 保持文件與程式碼同步

**工作流程**：

```
1. 讀取 package.json scripts 部分
   - 產生指令參考表
   - 從註解中提取描述
   ↓
2. 讀取 .env.example
   - 提取所有環境變數
   - 記錄用途和格式
   ↓
3. 產生 docs/CONTRIB.md
   - 開發工作流
   - 可用指令
   - 環境設定
   - 測試程式
   ↓
4. 產生 docs/RUNBOOK.md
   - 部署程式
   - 監控和警示
   - 常見問題和修復
   - 復原程式
   ↓
5. 識別過時文件
   - 找出 90+ 天未修改的文件
   - 列出供人工審查
   ↓
6. 顯示 diff 總結
```

::: tip 單一事實來源

package.json 和 .env.example 是唯一事實來源。

:::

---

### /update-codemaps：更新架構文件

**用途**：分析程式碼庫結構並更新架構文件。

**適用場景**：
- 程式碼結構變更後
- 需要更新架構文件

**工作流程**：

```
1. 掃描所有原始檔案的匯入、匯出和相依性
   ↓
2. 產生精簡的 codemaps：
   - codemaps/architecture.md - 整體架構
   - codemaps/backend.md - 後端結構
   - codemaps/frontend.md - 前端結構
   - codemaps/data.md - 資料模型和 schema
   ↓
3. 計算與前一版本的 diff 百分比
   ↓
4. 如果變更 > 30%，請求使用者批准後再更新
   ↓
5. 為每個 codemap 添加新鮮度時間戳
   ↓
6. 將報告保存到 .reports/codemap-diff.txt
```

**示例**：

```
你：/update-codemaps

Claude：
分析程式碼庫結構...

Scanning 156 files...
Found 89 imports and 124 exports

## Codemap Diff

Previous version: 2026-01-20
Current version: 2026-01-25
Diff: 12% (under 30% threshold)

✅ Safe to update

## Updated Codemaps

codemaps/architecture.md
- Updated module dependencies
- Added new services: auth, notifications
- Removed deprecated modules: legacy-db

codemaps/backend.md
- Updated API routes structure
- Added middleware documentation

codemaps/frontend.md
- Updated component hierarchy
- Added new pages: profile, settings

codemaps/data.md
- Updated database schemas
- Added new tables: users, sessions

Summary: 4 codemaps updated, 12% change
```

---

## 狀態管理類指令

### /checkpoint：保存工作狀態

**用途**：建立或驗證工作流中的檢查點。

**適用場景**：
- 保存重要的開發階段
- 支援回退和進度追蹤

**子指令**：

- `create <name>` - 建立命名檢查點
- `verify <name>` - 驗證檢查點
- `list` - 顯示所有檢查點
- `clear` - 移除舊檢查點（保留最近 5 個）

**示例**：

```
你：/checkpoint create feature-start

Claude：
# Creating Checkpoint: feature-start

Running /verify quick...

Build: ✅ OK
Types: ✅ OK

Creating checkpoint...

✅ Checkpoint "feature-start" created
├─ Timestamp: 2026-01-25-14:30
├─ Git SHA: abc1234
└─ Status: Clean (no uncommitted changes)
```

```
你：/checkpoint verify feature-start

Claude：
CHECKPOINT COMPARISON: feature-start
===========================
Files changed: 5
Tests: +3 passed / -0 failed
Coverage: +5% / -0%
Build: PASS

Changes since checkpoint:
✅ src/services/auth.ts (modified)
✅ tests/auth.test.ts (added)
✅ src/components/Login.tsx (added)
```

**工作流**：

```
[開始] → /checkpoint create "feature-start"
   |
[實作] → /checkpoint create "core-done"
   |
[測試] → /checkpoint verify "core-done"
   |
[重構] → /checkpoint create "refactor-done"
   |
[PR] → /checkpoint verify "feature-start"
```

---

## 學習與優化類指令

### /learn：提取可復用模式

**用途**：分析目前工作階段並提取可保存為 skill 的模式。

**適用場景**：
- 解決非平凡問題後
- 發現可復用的錯誤解決模式
- 記錄專案特定約定

**提取內容**：

1. **錯誤解決模式**
   - 發生了什麼錯誤？
   - 根本原因是什麼？
   - 如何修復的？
   - 對類似錯誤是否可復用？

2. **除錯技巧**
   - 非顯而易見的除錯步驟
   - 有效的工具組合
   - 診斷模式

3. **Workarounds**
   - 庫的 quirks
   - API 限制
   - 版本特定修復

4. **專案特定模式**
   - 發現的程式碼庫約定
   - 做出的架構決策
   - 整合模式

**示例**：

```
你：/learn

Claude：
# Extracting Patterns from Session

Reviewing session history...

Found 3 extractable patterns:

## Pattern 1: Supabase Auth Session Recovery
**Type:** Error Resolution
**Reusability:** High (affects all auth endpoints)

### Problem
After user logs in, subsequent API calls fail with 401 Unauthorized.

### Root Cause
Supabase session cookie is not being sent to backend API due to CORS configuration.

### Solution
```typescript
// Configure Supabase with correct URL
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storageKey: 'my-app-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
```

### When to Use
Trigger: Auth endpoints returning 401 unexpectedly

---

## Pattern 2: Playwright Test Flakiness Fix
**Type:** Debugging Technique
**Reusability:** Medium (affects async UI tests)

### Problem
Test "user can click submit button" fails intermittently with timeout.

### Root Cause
Button is disabled initially due to async validation, but test doesn't wait.

### Solution
```typescript
// Use explicit wait with predicate
await page.waitForSelector('[data-testid="submit-btn"]:not(:disabled)', {
  timeout: 10000
})

// Then click
await page.locator('[data-testid="submit-btn"]').click()
```

### When to Use
Trigger: Test timing issues with async UI state

---

Do you want to save these patterns? (yes/no/modify)
```

::: tip 聚焦原則

一次提取一個模式，保持技能專注。

:::

---

## 組態類指令

### /setup-pm：組態套件管理員

**用途**：組態專案或全域的首選套件管理員。

**適用場景**：
- 偵測目前使用的套件管理員
- 設定全域或專案偏好

**偵測優先順序**：

1. 環境變數：`CLAUDE_PACKAGE_MANAGER`
2. 專案組態：`.claude/package-manager.json`
3. package.json：`packageManager` 欄位
4. Lock 檔案：package-lock.json、yarn.lock、pnpm-lock.yaml、bun.lockb
5. 全域組態：`~/.claude/package-manager.json`
6. 回退：第一個可用的套件管理員

**支援套件管理員優先順序**：pnpm > bun > yarn > npm

**示例**：

```bash
# 偵測目前套件管理員
node scripts/setup-package-manager.js --detect

# 設定全域偏好
node scripts/setup-package-manager.js --global pnpm

# 設定專案偏好
node scripts/setup-package-manager.js --project bun

# 列出可用的套件管理員
node scripts/setup-package-manager.js --list
```

**組態檔案**：

全域組態（`~/.claude/package-manager.json`）：
```json
{
  "packageManager": "pnpm"
}
```

專案組態（`.claude/package-manager.json`）：
```json
{
  "packageManager": "bun"
}
```

環境變數覆蓋所有偵測方法：
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

---

## 指令組合工作流

### 完整功能開發流程

```
1. /plan "添加使用者認證功能"
   ↓ 建立實作計畫
2. /tdd "實現認證服務"
   ↓ TDD 開發
3. /test-coverage
   ↓ 確保覆蓋率 ≥ 80%
4. /code-review
   ↓ 程式碼審查
5. /verify pre-pr
   ↓ 全面驗證
6. /checkpoint create "auth-feature-done"
   ↓ 保存檢查點
7. /update-docs
   ↓ 更新文件
8. /update-codemaps
   ↓ 更新架構文件
```

### Bug 修復流程

```
1. /checkpoint create "bug-start"
   ↓ 保存目前狀態
2. /orchestrate bugfix "修復登入錯誤"
   ↓ 自動化 bug 修復流程
3. /test-coverage
   ↓ 確保測試覆蓋
4. /verify quick
   ↓ 驗證修復
5. /checkpoint verify "bug-start"
   ↓ 對比檢查點
```

### 安全審查流程

```
1. /orchestrate security "審查支付流程"
   ↓ 安全優先的審查流程
2. /e2e "測試支付流程"
   ↓ 端對端測試
3. /code-review
   ↓ 程式碼審查
4. /verify pre-pr
   ↓ 全面驗證
```

---

## 指令對比速查表

| 指令 | 主要用途 | 觸發 Agent | 輸出 |
|--- | --- | --- | ---|
| `/plan` | 建立實作計畫 | planner | 分階段計畫 |
| `/tdd` | TDD 開發 | tdd-guide | 測試 + 實作 + 覆蓋率 |
| `/orchestrate` | 序列執行 agents | 多個 agents | 綜合報告 |
| `/code-review` | 程式碼審查 | code-reviewer, security-reviewer | 安全和品質報告 |
| `/build-fix` | 修復建置錯誤 | build-error-resolver | 修復總結 |
| `/refactor-clean` | 清理死程式碼 | refactor-cleaner | 清理總結 |
| `/verify` | 全面驗證 | Bash | 驗證報告 |
| `/e2e` | 端對端測試 | e2e-runner | Playwright 測試 + 工件 |
| `/test-coverage` | 分析覆蓋率 | Bash | 覆蓋率報告 + 缺失測試 |
| `/eval` | 評估驅動開發 | Bash | Eval 狀態報告 |
| `/checkpoint` | 保存狀態 | Bash + Git | 檢查點報告 |
| `/learn` | 提取模式 | continuous-learning skill | Skill 檔案 |
| `/update-docs` | 同步文件 | doc-updater agent | 文件更新 |
| `/update-codemaps` | 更新架構 | doc-updater agent | Codemap 更新 |
| `/setup-pm` | 組態套件管理員 | Node.js 指令稿 | 套件管理員偵測 |

---

## 踩坑提醒

### ❌ 不要跳過規劃階段

對於複雜功能，直接開始編碼會導致：
- 遺漏重要相依性
- 架構不一致
- 需求理解偏差

**✅ 正確做法**：使用 `/plan` 建立詳細計畫，等待確認後再實作。

---

### ❌ 不要在 TDD 中跳過 RED 階段

先寫程式碼再寫測試，就不是 TDD 了。

**✅ 正確做法**：嚴格執行 RED → GREEN → REFACTOR 循環。

---

### ❌ 不要忽略 /code-review 的 CRITICAL 問題

安全漏洞可能導致資料洩露、金錢損失等嚴重後果。

**✅ 正確做法**：修復所有 CRITICAL 和 HIGH 級別問題後再提交。

---

### ❌ 不要刪除程式碼前不測試

死程式碼分析可能有誤報，直接刪除可能破壞功能。

**✅ 正確做法**：每次刪除前先執行測試，確保沒有破壞現有功能。

---

### ❌ 不要忘記使用 /learn

解決了非平凡問題後不提取模式，下次遇到相同問題又得從頭解決。

**✅ 正確做法**：定期使用 `/learn` 提取可復用模式，累積知識。

---

## 本課小結

Everything Claude Code 的 15 個斜槓指令提供了完整的開發工作流支援：

- **開發流程**：`/plan` → `/tdd` → `/orchestrate`
- **程式碼品質**：`/code-review` → `/build-fix` → `/refactor-clean` → `/verify`
- **測試**：`/e2e` → `/test-coverage` → `/eval`
- **文件與架構**：`/update-docs` → `/update-codemaps`
- **狀態管理**：`/checkpoint`
- **學習與優化**：`/learn`
- **組態**：`/setup-pm`

掌握這些指令，你可以高效、安全、有品質地完成開發工作。

---

## 下一課預告

> 下一課我們學習 **[核心 Agents 詳解](../agents-overview/)**。
>
> 你會學到：
> - 9 個專業化 agents 的職責和適用場景
> - 何時呼叫哪個 agent
> - Agent 之間的協作方式
> - 如何自訂 agent 組態

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| TDD 指令 | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Plan 指令 | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Code Review 指令 | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| E2E 指令 | [`commands/e2e.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/e2e.md) | 1-364 |
| Build Fix 指令 | [`commands/build-fix.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/build-fix.md) | 1-30 |
| Refactor Clean 指令 | [`commands/refactor-clean.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/refactor-clean.md) | 1-29 |
| Learn 指令 | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Checkpoint 指令 | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify 指令 | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Test Coverage 指令 | [`commands/test-coverage.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/test-coverage.md) | 1-28 |
| Setup PM 指令 | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md) | 1-81 |
| Update Docs 指令 | [`commands/update-docs.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-docs.md) | 1-32 |
| Orchestrate 指令 | [`commands/orchestrate.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/orchestrate.md) | 1-173 |
| Update Codemaps 指令 | [`commands/update-codemaps.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-codemaps.md) | 1-18 |
| Eval 指令 | [`commands/eval.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/eval.md) | 1-121 |
| Plugin 定義 | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |

**關鍵常數**：
- TDD 覆蓋率目標：80%（critical 程式碼 100%） - `commands/tdd.md:293-300`

**關鍵函式**：
- TDD 循環：RED → GREEN → REFACTOR - `commands/tdd.md:40-47`
- Plan 等待確認機制 - `commands/plan.md:96`
- Code Review 嚴重級別：CRITICAL, HIGH, MEDIUM - `commands/code-review.md:33`

</details>
