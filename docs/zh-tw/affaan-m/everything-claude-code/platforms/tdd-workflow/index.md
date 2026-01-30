---
title: "TDD 開發流程: Red-Green-Refactor | everything-claude-code"
sidebarTitle: "先測試再寫程式"
subtitle: "TDD 開發流程: Red-Green-Refactor"
description: "學習 Everything Claude Code 的 TDD 開發流程。掌握 /plan、/tdd、/code-review、/verify 指令，達成 80%+ 測試覆蓋率。"
tags:
  - "tdd"
  - "test-driven-development"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 70
---

# TDD 開發流程：從 /plan 到 /verify 的完整 Red-Green-Refactor 週期

## 學完你能做什麼

- 使用 `/plan` 指令建立系統化的實作計畫，避免遺漏
- 運用 `/tdd` 指令執行測試驅動開發，遵循 RED-GREEN-REFACTOR 週期
- 透過 `/code-review` 確保程式碼安全和品質
- 使用 `/verify` 驗證程式碼是否可以安全提交
- 達到 80%+ 測試覆蓋率，建立可靠的測試套件

## 你現在的困境

開發新功能時，你是否遇過這些情況：

- 寫完程式碼才發現需求理解錯誤，不得不返工
- 測試覆蓋率低，上線後發現 bug
- 程式碼審查時發現安全問題，被打回修改
- 提交後才發現型別錯誤或建置失敗
- 不清楚什麼時候該寫測試，測試寫得不完整

這些問題都會導致開發效率低落，程式碼品質難以保證。

## 什麼時候用這一招

使用 TDD 開發流程的場景：

- **開發新功能**：從需求到實作，保證功能完整且測試充分
- **修復 bug**：先寫測試重現 bug，再修復，確保不會引入新問題
- **重構程式碼**：有測試保護，放心最佳化程式碼結構
- **實作 API 端點**：寫好整合測試，驗證介面正確性
- **開發核心業務邏輯**：財務計算、認證等關鍵程式碼需要 100% 測試覆蓋

::: tip 核心原則
測試驅動開發不是先寫測試的簡單流程，而是確保程式碼品質、提升開發效率的系統化方法。所有新程式碼都應該透過 TDD 流程實作。
:::

## 核心思路

TDD 開發流程由 4 個核心指令組成，形成一個完整的開發週期：

```
1. /plan     → 規劃：明確需求、識別風險、分階段實施
2. /tdd      → 實作：測試先行、最小程式碼、持續重構
3. /code-review → 審查：安全檢查、品質評估、最佳實踐
4. /verify   → 驗證：建置、型別、測試、程式碼稽核
```

**為什麼這個流程有效**：

- **規劃先行**：`/plan` 確保理解正確，避免方向錯誤
- **測試驅動**：`/tdd` 強制測試先行，保證每個功能都有測試保護
- **審查把關**：`/code-review` 發現安全漏洞和程式碼品質問題
- **驗證收尾**：`/verify` 確保程式碼可以安全提交

## 🎒 開始前的準備

在開始 TDD 開發流程之前，請確認：

- ✅ 已安裝 Everything Claude Code 外掛
- ✅ 專案設定了測試框架（Jest、Vitest 等）
- ✅ 專案有基本的建置流程（`npm run build`）
- ✅ 了解了 [快速開始](../../start/quickstart/) 中的基本指令用法

::: warning 前置條件
本教學假設你已熟悉 [快速開始](../../start/quickstart/) 中的基本操作。如果還沒完成安裝，請先閱讀[安裝指南](../../start/installation/)。
:::

## 跟我做：完整的 TDD 開發流程

讓我們透過一個實際範例來學習整個流程。假設你要實作一個「市場流動性評分計算器」功能。

### 第 1 步：使用 /plan 建立實作計畫

**為什麼**
規劃階段確保你理解了需求，識別了潛在風險，避免了後續返工。

**操作**
在 Claude Code 中輸入：

```
/plan 我需要實作一個市場流動性評分計算器，根據交易量、買賣價差、活躍交易者數量和最近交易時間計算評分（0-100）
```

**你應該看到**
planner agent 會產生一份詳細的實作計畫：

```markdown
## Implementation Plan: 市場流動性評分計算器

## Requirements Restatement
- 根據多個指標計算市場流動性評分（0-100）
- 評分越高表示市場流動性越好
- 考慮交易量、買賣價差、活躍交易者、最近交易時間

## Implementation Phases

### Phase 1: Define Interface
- 建立 `MarketData` 介面定義輸入資料
- 定義 `calculateLiquidityScore` 函式簽章

### Phase 2: Write Tests
- 撰寫單元測試覆蓋各種情境
- 邊界條件：零交易量、極大值
- 錯誤處理：缺失欄位、無效型別

### Phase 3: Implement Calculation
- 實作評分演算法
- 加權計算各項指標
- 正規化到 0-100 範圍

### Phase 4: Integration
- 整合到現有 API
- 新增端點暴露計算功能
- 文件化使用方法

## Dependencies
- 無外部相依性

## Risks
- MEDIUM: 評分演算法可能需要調整權重
- LOW: 邊界條件處理

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

**檢查點 ✅**
- 確認需求理解正確
- 確認實施步驟合理
- 檢查是否有遺漏的風險

**下一步**
如果計畫沒問題，回覆 `yes` 或 `proceed`。需要修改就說明具體變更。

---

### 第 2 步：使用 /tdd 執行測試驅動開發

**為什麼**
`/tdd` 指令強制測試先行，確保每個功能都有測試保護，避免後期補測試的痛苦。

**操作**
在計畫確認後，輸入：

```
/tdd 按照計畫實作市場流動性評分計算器
```

**你應該看到**
tdd-guide agent 會引導你完成 TDD 流程：

#### RED 階段：先寫測試

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

```typescript
// lib/liquidity.test.ts
import { calculateLiquidityScore } from './liquidity'

describe('calculateLiquidityScore', () => {
  it('should return high score for liquid market', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('should return low score for illiquid market', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // 1 天前
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('should handle edge case: zero volume', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBe(0)
  })
})
```

```bash
npm test lib/liquidity.test.ts

## 你應該看到測試失敗
FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market
    Error: Not implemented
```

✅ **測試失敗，符合預期**

#### GREEN 階段：實作最小程式碼

```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // 處理零交易量邊界情況
  if (market.totalVolume === 0) {
    return 0
  }

  // 計算各項分數（0-100 範圍）
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // 近期活動加分
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // 加權平均
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // 限制在 0-100
}
```

```bash
npm test lib/liquidity.test.ts

## 你應該看到測試通過
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **所有測試通過**

#### REFACTOR 階段：改進程式碼

```typescript
// lib/liquidity.ts - 重構後
const WEIGHTS = {
  VOLUME: 0.4,
  SPREAD: 0.3,
  TRADERS: 0.2,
  RECENCY: 0.1,
} as const

const SCALE_FACTORS = {
  VOLUME: 1000,
  SPREAD: 1000,
  TRADERS: 10,
  RECENCY_PENALTY: 10,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) return 0

  const volumeScore = Math.min(market.totalVolume / SCALE_FACTORS.VOLUME, 100)
  const spreadScore = clamp(100 - (market.bidAskSpread * SCALE_FACTORS.SPREAD), 0, 100)
  const traderScore = Math.min(market.activeTraders / SCALE_FACTORS.TRADERS, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = clamp(100 - (hoursSinceLastTrade * SCALE_FACTORS.RECENCY_PENALTY), 0, 100)

  const weightedScore =
    volumeScore * WEIGHTS.VOLUME +
    spreadScore * WEIGHTS.SPREAD +
    traderScore * WEIGHTS.TRADERS +
    recencyScore * WEIGHTS.RECENCY

  return clamp(weightedScore, 0, 100)
}
```

```bash
npm test lib/liquidity.test.ts

## 你應該看到測試仍然通過
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **重構完成，測試仍然通過**

#### 檢查覆蓋率

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 80%)
```

✅ **TDD 流程完成，覆蓋率達到要求**

**檢查點 ✅**
- 測試寫在程式碼之前（RED）
- 測試失敗後再實作（GREEN）
- 程式碼通過後重構（REFACTOR）
- 覆蓋率達到 80% 以上

---

### 第 3 步：使用 /code-review 審查程式碼

**為什麼**
程式碼審查可以發現安全問題、程式碼品質和最佳實踐問題，確保程式碼可以安全合併。

**操作**
輸入：

```
/code-review
```

**你應該看到**
code-reviewer agent 會檢查：

```markdown
## Code Review Report

## Security Issues (CRITICAL)
- ✅ No hardcoded credentials found
- ✅ No SQL injection vulnerabilities
- ✅ No XSS vulnerabilities

## Code Quality (HIGH)
- ✅ Functions under 50 lines (current: 8 lines max)
- ✅ Files under 800 lines (current: 25 lines)
- ✅ No missing error handling
- ⚠️ Found 1 console.log statement at lib/liquidity.ts:15
  - **Suggestion**: Remove or replace with proper logging

## Best Practices (MEDIUM)
- ✅ Using immutable patterns
- ✅ No TODO/FIXME comments
- ✅ All new code has tests
- ✅ JSDoc for public API present

## Summary
- Critical: 0 issues
- High: 1 issue (console.log)
- Medium: 0 issues

**Recommendation**: Fix console.log issue, then ready for commit.
```

**下一步**
根據審查結果修復問題：

```typescript
// 移除 console.log
// console.log(`Calculated score: ${score}`)  // 已刪除
return clamp(weightedScore, 0, 100)
```

**檢查點 ✅**
- 修復所有 CRITICAL 級別問題
- 修復或說明 HIGH 級別問題
- 檢查程式碼品質是否符合標準

---

### 第 4 步：使用 /verify 驗證程式碼

**為什麼**
驗證指令確保程式碼可以安全提交，建置、型別、測試都通過，沒有遺留問題。

**操作**
輸入：

```
/verify
```

**你應該看到**
完整的驗證報告：

```markdown
VERIFICATION: PASS

Build:    OK
Types:    OK (0 errors)
Lint:     OK (0 issues)
Tests:    3/3 passed, 100% coverage
Secrets:  OK (0 found)
Logs:      OK (0 console.logs)

Ready for PR: YES ✅
```

如果出現問題，會詳細列出：

```markdown
VERIFICATION: FAIL

Build:    OK
Types:    ❌ 2 errors
  - lib/liquidity.ts:15:25 - Type 'string' is not assignable to type 'number'
  - lib/utils.ts:8:10 - Property 'toFixed' does not exist on type 'unknown'
Lint:     ⚠️ 2 warnings
  - lib/liquidity.ts:10:1 - Missing JSDoc for WEIGHTS constant
Tests:    ✅ 3/3 passed, 100% coverage
Secrets:  OK
Logs:      OK

Ready for PR: NO ❌

Fix these issues before committing.
```

**檢查點 ✅**
- 建置通過
- 型別檢查通過
- Lint 通過（或只有警告）
- 所有測試通過
- 覆蓋率達到 80%+
- 沒有 console.log
- 沒有寫死的金鑰

---

### 第 5 步：提交程式碼

**為什麼**
驗證通過後，程式碼已經準備好提交，可以放心推送到遠端儲存庫。

**操作**
```bash
git add lib/liquidity.ts lib/liquidity.test.ts
git commit -m "feat: add market liquidity score calculator

- Calculate 0-100 score based on volume, spread, traders, recency
- 100% test coverage with unit tests
- Edge cases handled (zero volume, illiquid markets)
- Refactored with constants and helper functions

Closes #123"
```

```bash
git push origin feature/liquidity-score
```

## 踩坑提醒

### 陷阱 1：跳過 RED 階段直接寫程式碼

**錯誤做法**：
```
先實作 calculateLiquidityScore 函式
再寫測試
```

**後果**：
- 測試可能只是「驗證現有實作」，沒有真正驗證行為
- 容易遺漏邊界情況和錯誤處理
- 重構時缺乏安全感

**正確做法**：
```
1. 先寫測試（應該失敗）
2. 執行測試確認失敗（RED）
3. 實作程式碼讓測試通過（GREEN）
4. 重構並保持測試通過（REFACTOR）
```

---

### 陷阱 2：測試覆蓋率不達標

**錯誤做法**：
```
只寫一個測試，覆蓋率只有 40%
```

**後果**：
- 大量程式碼沒有測試保護
- 重構時容易引入 bug
- 程式碼審查時會被退回修改

**正確做法**：
```
確保 80%+ 覆蓋率：
- 單元測試：覆蓋所有函式和分支
- 整合測試：覆蓋 API 端點
- E2E 測試：覆蓋關鍵使用者流程
```

---

### 陷阱 3：忽略 code-review 的建議

**錯誤做法**：
```
看到 CRITICAL 問題還是繼續提交
```

**後果**：
- 安全漏洞被帶到正式環境
- 程式碼品質低落，難以維護
- 被 PR reviewers 打回

**正確做法**：
```
- CRITICAL 問題必須修復
- HIGH 問題盡量修復，或說明理由
- MEDIUM/LOW 問題可以後續最佳化
```

---

### 陷阱 4：不執行 /verify 直接提交

**錯誤做法**：
```
寫完程式碼直接 git commit，跳過驗證
```

**後果**：
- 建置失敗，浪費 CI 資源
- 型別錯誤導致執行時期錯誤
- 測試不通過，主分支狀態異常

**正確做法**：
```
提交前總是執行 /verify：
/verify
# 看到 "Ready for PR: YES" 才提交
```

---

### 陷阱 5：測試實作細節而非行為

**錯誤做法**：
```typescript
// 測試內部狀態
expect(component.state.count).toBe(5)
```

**後果**：
- 測試脆弱，重構時大量失敗
- 測試沒有反映使用者實際看到的

**正確做法**：
```typescript
// 測試使用者可見行為
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

## 本課小結

TDD 開發流程的核心要點：

1. **規劃先行**：使用 `/plan` 確保理解正確，避免方向錯誤
2. **測試驅動**：使用 `/tdd` 強制測試先行，遵循 RED-GREEN-REFACTOR
3. **程式碼審查**：使用 `/code-review` 發現安全和品質問題
4. **全面驗證**：使用 `/verify` 確保程式碼可以安全提交
5. **覆蓋率要求**：確保 80%+ 測試覆蓋率，關鍵程式碼 100%

這四個指令形成一個完整的開發週期，確保程式碼品質和開發效率。

::: tip 記住這個流程
```
需求 → /plan → /tdd → /code-review → /verify → 提交
```

每個新功能都應該遵循這個流程。
:::

## 下一課預告

> 下一課我們學習 **[程式碼審查流程：/code-review 與安全稽核](../code-review-workflow/)**。
>
> 你會學到：
> - 深入理解 code-reviewer agent 的檢查邏輯
> - 掌握安全稽核的檢查清單
> - 學會修復常見的安全漏洞
> - 了解如何設定自訂審查規則

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| /plan 指令 | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| /tdd 指令 | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| /verify 指令 | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**關鍵函式**：
- `plan` 呼叫 planner agent，建立實作計畫
- `tdd` 呼叫 tdd-guide agent，執行 RED-GREEN-REFACTOR 流程
- `verify` 執行全面驗證檢查（建置、型別、lint、測試）
- `code-review` 檢查安全漏洞、程式碼品質、最佳實踐

**覆蓋率要求**：
- 最低 80% 程式碼覆蓋率（branches、functions、lines、statements）
- 財務計算、認證邏輯、安全關鍵程式碼要求 100% 覆蓋率

</details>
