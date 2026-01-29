---
title: "TDD 开发流程: Red-Green-Refactor | everything-claude-code"
sidebarTitle: "先测试再写代码"
subtitle: "TDD 开发流程: Red-Green-Refactor"
description: "学习 Everything Claude Code 的 TDD 开发流程。掌握 /plan、/tdd、/code-review、/verify 命令，实现 80%+ 测试覆盖率。"
tags:
  - "tdd"
  - "test-driven-development"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 70
---

# TDD 开发流程：从 /plan 到 /verify 的完整 Red-Green-Refactor 周期

## 学完你能做什么

- 使用 `/plan` 命令创建系统化的实现计划，避免遗漏
- 运用 `/tdd` 命令执行测试驱动开发，遵循 RED-GREEN-REFACTOR 周期
- 通过 `/code-review` 确保代码安全和质量
- 使用 `/verify` 验证代码是否可以安全提交
- 达到 80%+ 测试覆盖率，建立可靠的测试套件

## 你现在的困境

开发新功能时，你是否遇到过这些情况：

- 写完代码才发现需求理解错误，不得不返工
- 测试覆盖率低，上线后发现 bug
- 代码审查时发现安全问题，被打回修改
- 提交后才发现类型错误或构建失败
- 不清楚什么时候该写测试，测试写得不完整

这些问题都会导致开发效率低下，代码质量难以保证。

## 什么时候用这一招

使用 TDD 开发流程的场景：

- **开发新功能**：从需求到实现，保证功能完整且测试充分
- **修复 bug**：先写测试复现 bug，再修复，确保不会引入新问题
- **重构代码**：有测试保护，放心优化代码结构
- **实现 API 端点**：写好集成测试，验证接口正确性
- **开发核心业务逻辑**：财务计算、认证等关键代码需要 100% 测试覆盖

::: tip 核心原则
测试驱动开发不是先写测试的简单流程，而是确保代码质量、提升开发效率的系统化方法。所有新代码都应该通过 TDD 流程实现。
:::

## 核心思路

TDD 开发流程由 4 个核心命令组成，形成一个完整的开发周期：

```
1. /plan     → 规划：明确需求、识别风险、分阶段实施
2. /tdd      → 实现：测试先行、最小代码、持续重构
3. /code-review → 审查：安全检查、质量评估、最佳实践
4. /verify   → 验证：构建、类型、测试、代码审计
```

**为什么这个流程有效**：

- **规划先行**：`/plan` 确保理解正确，避免方向错误
- **测试驱动**：`/tdd` 强制测试先行，保证每个功能都有测试保护
- **审查把关**：`/code-review` 发现安全漏洞和代码质量问题
- **验证收尾**：`/verify` 确保代码可以安全提交

## 🎒 开始前的准备

在开始 TDD 开发流程之前，请确认：

- ✅ 已安装 Everything Claude Code 插件
- ✅ 项目配置了测试框架（Jest、Vitest 等）
- ✅ 项目有基本的构建流程（`npm run build`）
- ✅ 了解了 [快速开始](../../start/quickstart/) 中的基本命令用法

::: warning 前置条件
本教程假设你已熟悉 [快速开始](../../start/quickstart/) 中的基本操作。如果还没完成安装，请先阅读[安装指南](../../start/installation/)。
:::

## 跟我做：完整的 TDD 开发流程

让我们通过一个实际例子来学习整个流程。假设你要实现一个「市场流动性评分计算器」功能。

### 第 1 步：使用 /plan 创建实现计划

**为什么**
规划阶段确保你理解了需求，识别了潜在风险，避免了后续返工。

**操作**
在 Claude Code 中输入：

```
/plan 我需要实现一个市场流动性评分计算器，根据交易量、买卖价差、活跃交易者数量和最近交易时间计算评分（0-100）
```

**你应该看到**
planner agent 会生成一份详细的实现计划：

```markdown
## Implementation Plan: 市场流动性评分计算器

## Requirements Restatement
- 根据多个指标计算市场流动性评分（0-100）
- 评分越高表示市场流动性越好
- 考虑交易量、买卖价差、活跃交易者、最近交易时间

## Implementation Phases

### Phase 1: Define Interface
- 创建 `MarketData` 接口定义输入数据
- 定义 `calculateLiquidityScore` 函数签名

### Phase 2: Write Tests
- 编写单元测试覆盖各种场景
- 边界条件：零交易量、极大值
- 错误处理：缺失字段、无效类型

### Phase 3: Implement Calculation
- 实现评分算法
- 加权计算各项指标
- 归一化到 0-100 范围

### Phase 4: Integration
- 集成到现有 API
- 添加端点暴露计算功能
- 文档化使用方法

## Dependencies
- 无外部依赖

## Risks
- MEDIUM: 评分算法可能需要调整权重
- LOW: 边界条件处理

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

**检查点 ✅**
- 确认需求理解正确
- 确认实施步骤合理
- 检查是否有遗漏的风险

**下一步**
如果计划没问题，回复 `yes` 或 `proceed`。需要修改就说明具体变更。

---

### 第 2 步：使用 /tdd 执行测试驱动开发

**为什么**
`/tdd` 命令强制测试先行，确保每个功能都有测试保护，避免后期补测试的痛苦。

**操作**
在计划确认后，输入：

```
/tdd 按照计划实现市场流动性评分计算器
```

**你应该看到**
tdd-guide agent 会引导你完成 TDD 流程：

#### RED 阶段：先写测试

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
      lastTradeTime: new Date(Date.now() - 86400000) // 1 day ago
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

## 你应该看到测试失败
FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market
    Error: Not implemented
```

✅ **测试失败，符合预期**

#### GREEN 阶段：实现最小代码

```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Handle zero volume edge case
  if (market.totalVolume === 0) {
    return 0
  }

  // Calculate component scores (0-100 scale)
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // Recent activity bonus
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // Weighted average
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // Clamp to 0-100
}
```

```bash
npm test lib/liquidity.test.ts

## 你应该看到测试通过
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **所有测试通过**

#### REFACTOR 阶段：改进代码

```typescript
// lib/liquidity.ts - 重构后
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

## 你应该看到测试仍然通过
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **重构完成，测试仍然通过**

#### 检查覆盖率

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 80%)
```

✅ **TDD 流程完成，覆盖率达到要求**

**检查点 ✅**
- 测试写在代码之前（RED）
- 测试失败后再实现（GREEN）
- 代码通过后重构（REFACTOR）
- 覆盖率达到 80% 以上

---

### 第 3 步：使用 /code-review 审查代码

**为什么**
代码审查可以发现安全问题、代码质量和最佳实践问题，确保代码可以安全合并。

**操作**
输入：

```
/code-review
```

**你应该看到**
code-reviewer agent 会检查：

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
根据审查结果修复问题：

```typescript
// 移除 console.log
// console.log(`Calculated score: ${score}`)  // 已删除
return clamp(weightedScore, 0, 100)
```

**检查点 ✅**
- 修复所有 CRITICAL 级别问题
- 修复或说明 HIGH 级别问题
- 检查代码质量是否符合标准

---

### 第 4 步：使用 /verify 验证代码

**为什么**
验证命令确保代码可以安全提交，构建、类型、测试都通过，没有遗留问题。

**操作**
输入：

```
/verify
```

**你应该看到**
完整的验证报告：

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

如果出现问题，会详细列出：

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

**检查点 ✅**
- 构建通过
- 类型检查通过
- Lint 通过（或只有警告）
- 所有测试通过
- 覆盖率达到 80%+
- 没有 console.log
- 没有硬编码密钥

---

### 第 5 步：提交代码

**为什么**
验证通过后，代码已经准备好提交，可以放心推送到远程仓库。

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

### 陷阱 1：跳过 RED 阶段直接写代码

**错误做法**：
```
先实现 calculateLiquidityScore 函数
再写测试
```

**后果**：
- 测试可能只是"验证现有实现"，没有真正验证行为
- 容易遗漏边界情况和错误处理
- 重构时缺乏安全感

**正确做法**：
```
1. 先写测试（应该失败）
2. 运行测试确认失败（RED）
3. 实现代码让测试通过（GREEN）
4. 重构并保持测试通过（REFACTOR）
```

---

### 陷阱 2：测试覆盖率不达标

**错误做法**：
```
只写一个测试，覆盖率只有 40%
```

**后果**：
- 大量代码没有测试保护
- 重构时容易引入 bug
- 代码审查时会返回修改

**正确做法**：
```
确保 80%+ 覆盖率：
- 单元测试：覆盖所有函数和分支
- 集成测试：覆盖 API 端点
- E2E 测试：覆盖关键用户流程
```

---

### 陷阱 3：忽略 code-review 的建议

**错误做法**：
```
看到 CRITICAL 问题还是继续提交
```

**后果**：
- 安全漏洞被带到生产环境
- 代码质量低下，难以维护
- 被 PR reviewers 打回

**正确做法**：
```
- CRITICAL 问题必须修复
- HIGH 问题尽量修复，或说明理由
- MEDIUM/LOW 问题可以后续优化
```

---

### 陷阱 4：不运行 /verify 直接提交

**错误做法**：
```
写完代码直接 git commit，跳过验证
```

**后果**：
- 构建失败，浪费 CI 资源
- 类型错误导致运行时错误
- 测试不通过，主分支状态异常

**正确做法**：
```
提交前总是运行 /verify：
/verify
# 看到 "Ready for PR: YES" 才提交
```

---

### 陷阱 5：测试实现细节而非行为

**错误做法**：
```typescript
// 测试内部状态
expect(component.state.count).toBe(5)
```

**后果**：
- 测试脆弱，重构时大量失败
- 测试没有反映用户实际看到的

**正确做法**：
```typescript
// 测试用户可见行为
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

## 本课小结

TDD 开发流程的核心要点：

1. **规划先行**：使用 `/plan` 确保理解正确，避免方向错误
2. **测试驱动**：使用 `/tdd` 强制测试先行，遵循 RED-GREEN-REFACTOR
3. **代码审查**：使用 `/code-review` 发现安全和质量问题
4. **全面验证**：使用 `/verify` 确保代码可以安全提交
5. **覆盖率要求**：确保 80%+ 测试覆盖率，关键代码 100%

这四个命令形成一个完整的开发周期，确保代码质量和开发效率。

::: tip 记住这个流程
```
需求 → /plan → /tdd → /code-review → /verify → 提交
```

每个新功能都应该遵循这个流程。
:::

## 下一课预告

> 下一课我们学习 **[代码审查流程：/code-review 与安全审计](../code-review-workflow/)**。
>
> 你会学到：
> - 深入理解 code-reviewer agent 的检查逻辑
> - 掌握安全审计的检查清单
> - 学会修复常见的安全漏洞
> - 了解如何配置自定义审查规则

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能              | 文件路径                                                                                     | 行号      |
|--- | --- | ---|
| /plan 命令        | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114     |
| /tdd 命令        | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)              | 1-327     |
| /verify 命令      | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md)          | 1-60      |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**关键函数**：
- `plan` 调用 planner agent，创建实现计划
- `tdd` 调用 tdd-guide agent，执行 RED-GREEN-REFACTOR 流程
- `verify` 执行全面验证检查（构建、类型、lint、测试）
- `code-review` 检查安全漏洞、代码质量、最佳实践

**覆盖率要求**：
- 最低 80% 代码覆盖率（branches、functions、lines、statements）
- 财务计算、认证逻辑、安全关键代码要求 100% 覆盖率

</details>
