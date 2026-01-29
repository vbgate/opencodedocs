---
title: "Commands: 15 个斜杠命令 | Everything Claude Code"
subtitle: "Commands: 15 个斜杠命令 | Everything Claude Code"
sidebarTitle: "用 15 个命令搞定开发"
description: "学习 Everything Claude Code 的 15 个斜杠命令。掌握 /plan、/tdd、/code-review、/e2e、/verify 等核心命令的使用方法，提升开发效率。"
tags:
  - "commands"
  - "slash-commands"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# 核心 Commands 详解：15 个斜杠命令全攻略

## 学完你能做什么

- 快速启动 TDD 开发流程，实现高质量代码
- 创建系统化实现计划，避免遗漏关键步骤
- 运行全面代码审查和安全审计
- 生成端到端测试，验证关键用户流程
- 自动化修复构建错误，节省调试时间
- 安全清理死代码，保持代码库精简
- 提取和复用已解决问题的模式
- 管理工作状态和检查点
- 运行全面验证，确保代码就绪

## 你现在的困境

开发过程中你可能会遇到这些问题：

- **不知道从哪里开始** —— 面对新需求，如何拆解实现步骤？
- **测试覆盖率低** —— 写的代码很多，但测试不够，质量难以保证
- **构建错误堆积** —— 修改代码后，类型错误一个接一个，不知道从哪里修
- **代码审查不系统** —— 靠眼看容易漏掉安全问题
- **重复解决同样的问题** —— 遇过的坑下次又掉进去了

Everything Claude Code 的 15 个斜杠命令就是为了解决这些痛点设计的。

## 核心思路

**命令是工作流的入口点**。每个命令封装了一个完整的开发流程，调用相应的 agent 或技能，帮你完成特定任务。

::: tip 命令 vs Agent vs Skill

- **命令**：你直接在 Claude Code 中输入的快捷入口（如 `/tdd`、`/plan`）
- **Agent**：命令调用的专业子代理，负责具体执行
- **Skill**：Agent 可以引用的工作流定义和领域知识

一个命令通常会调用一个或多个 agent，agent 可能会引用相关的 skill。

:::

## 命令概览

15 个命令按功能分类：

| 类别 | 命令 | 用途 |
|-----|------|------|
| **开发流程** | `/plan` | 创建实现计划 |
| | `/tdd` | 执行测试驱动开发 |
| | `/orchestrate` | 序列执行多个 agents |
| **代码质量** | `/code-review` | 代码审查 |
| | `/build-fix` | 修复构建错误 |
| | `/refactor-clean` | 清理死代码 |
| | `/verify` | 全面验证 |
| **测试** | `/e2e` | 端到端测试 |
| | `/test-coverage` | 分析测试覆盖率 |
| | `/eval` | 管理 eval 驱动开发 |
| **文档与架构** | `/update-docs` | 同步文档 |
| | `/update-codemaps` | 更新架构文档 |
| **状态管理** | `/checkpoint` | 保存工作状态 |
| **学习与优化** | `/learn` | 提取可复用模式 |
| **配置** | `/setup-pm` | 配置包管理器 |

## 开发流程类命令

### /plan：规划复杂功能

**用途**：在开始编码前，创建详细的实现计划。

**适用场景**：
- 开始新功能开发
- 进行重大架构变更
- 需求不清晰或模糊时
- 多文件/多组件协同修改

**工作流程**：

```
1. 重述需求
   ↓
2. 识别风险和依赖
   ↓
3. 拆分为具体阶段
   ↓
4. 等待你确认
```

::: warning 关键特性

planner agent **不会写任何代码**，直到你明确确认计划。

:::

**示例**：

```
你：/plan 我需要添加实时通知功能

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

**最佳实践**：
- ✅ 复杂功能先规划再实现
- ✅ 仔细检查风险和依赖
- ✅ 按阶段执行，每阶段验证
- ❌ 不要直接跳过规划

---

### /tdd：测试驱动开发

**用途**：强制执行 TDD 流程，确保测试覆盖率 ≥ 80%。

**适用场景**：
- 实现新功能
- 修复 Bug（先写能复现 bug 的测试）
- 重构现有代码
- 编写核心业务逻辑

**TDD 循环**：

```
RED → GREEN → REFACTOR → REPEAT

RED:      写一个会失败的测试
GREEN:    写最少的代码让测试通过
REFACTOR: 改进代码，保持测试通过
REPEAT:   下一个功能/场景
```

::: warning 强制要求

**必须先写测试，再写代码**。不能跳过 RED 阶段。

:::

**示例**：

```
你：/tdd 我需要一个计算市场流动性分数的函数

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
  // 实现代码...
}
```

## Step 5: Run Tests - Verify PASS
```bash
npm test lib/liquidity.test.ts
PASS ✓ should return high score for liquid market
```

## Step 6: Refactor (IMPROVE)
// 改进代码结构...

## Step 7: Verify Tests Still Pass
```bash
npm test lib/liquidity.test.ts
PASS ✓ all tests passing
```

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)
```

**最佳实践**：
- ✅ 先写接口定义
- ✅ 测试失败后再实现
- ✅ 每写完一个功能立即测试
- ✅ 重构前后都验证测试通过
- ✅ 覆盖率 ≥ 80%（关键代码 100%）
- ❌ 不要写太多代码才测试
- ❌ 不要跳过 RED 阶段
- ❌ 不要测试实现细节

---

### /orchestrate：序列执行 agents

**用途**：自动化执行多个 agents 的序列工作流。

**适用场景**：
- 完整功能开发（planner → tdd-guide → code-reviewer → security-reviewer）
- Bug 修复流程（explorer → tdd-guide → code-reviewer）
- 安全审查（security-reviewer → code-reviewer → architect）

**工作流类型**：

| 工作流类型 | Agent 序列 |
|-----------|-----------|
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**示例**：

```
你：/orchestrate feature "添加用户认证功能"

Claude：
### ORCHESTRATION REPORT
Workflow: feature
Task: 添加用户认证功能
Agents: planner → tdd-guide → code-reviewer → security-reviewer

SUMMARY
-------
成功实现用户认证功能，包括注册、登录、会话管理。

AGENT OUTPUTS
-------------
Planner: 创建了 4 阶段实现计划
TDD Guide: 实现了认证服务，覆盖率 95%
Code Reviewer: 发现 3 个高优先级问题，已修复
Security Reviewer: 通过安全审计，无漏洞

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

**最佳实践**：
- ✅ 复杂功能使用 orchestrate
- ✅ 每个 agent 之间有清晰的手持文档
- ✅ 并行执行独立的检查（code-reviewer 和 security-reviewer）
- ❌ 不要在简单任务上使用 orchestrate

---

## 代码质量类命令

### /code-review：代码审查

**用途**：全面审查未提交的代码，检查安全问题和代码质量。

**适用场景**：
- 提交代码前
- 合并 PR 前
- 完成功能开发后

**检查项**：

| 类别 | 检查内容 | 严重程度 |
|-----|---------|---------|
| **安全** | 硬编码密钥、SQL 注入、XSS、缺少输入验证 | CRITICAL |
| **代码质量** | 函数 > 50 行、文件 > 800 行、嵌套深度 > 4 | HIGH |
| **最佳实践** | 变异模式、console.log、缺少测试、TODO/FIXME | MEDIUM |

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

::: danger 阻止提交规则

如果发现 **CRITICAL** 或 **HIGH** 级别问题，会阻止提交。

:::

---

### /build-fix：修复构建错误

**用途**：逐个修复 TypeScript 和构建错误。

**适用场景**：
- 运行 `npm run build` 失败
- TypeScript 类型错误
- 编译错误

**工作流程**：

```
1. 运行构建
   ↓
2. 解析错误输出，按严重程度排序
   ↓
3. 逐个修复：
   - 显示错误上下文
   - 解释问题
   - 提出修复方案
   - 应用修复
   - 重新运行构建
   ↓
4. 生成修复总结
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

一次只修复一个错误，防止引入新问题。

:::

---

### /refactor-clean：清理死代码

**用途**：安全识别和移除未使用的代码。

**适用场景**：
- 代码库中有大量未使用的文件和导出
- 减少维护负担
- 提升代码可读性

**工作流程**：

```
1. 运行死代码分析工具
   - knip：查找未使用的导出和文件
   - depcheck：查找未使用的依赖
   - ts-prune：查找未使用的 TypeScript 导出
   ↓
2. 生成综合报告
   ↓
3. 按严重程度分类
   - SAFE：测试文件、未使用的工具函数
   - CAUTION：API 路由、组件
   - DANGER：配置文件、入口文件
   ↓
4. 逐个删除（先测试）
   ↓
5. 生成清理总结
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

::: warning 测试优先

**删除代码前必须先运行测试**，确保没有破坏现有功能。

:::

---

### /verify：全面验证

**用途**：运行完整的代码验证检查。

**适用场景**：
- 提交代码前
- 合并 PR 前
- 准备发布时

**检查项**（按顺序）：

1. **构建检查** - 运行构建命令
2. **类型检查** - 运行 TypeScript 检查器
3. **Lint 检查** - 运行 linter
4. **测试套件** - 运行所有测试，报告覆盖率
5. **Console.log 审计** - 搜索源文件中的 console.log
6. **Git 状态** - 显示未提交的变更

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

**参数**：
- `quick` - 仅构建 + 类型检查
- `full` - 所有检查（默认）
- `pre-commit` - 提交相关检查
- `pre-pr` - 完整检查 + 安全扫描

---

## 测试类命令

### /e2e：端到端测试

**用途**：使用 Playwright 生成和运行端到端测试。

**适用场景**：
- 测试关键用户流程（登录、交易、支付）
- 验证多步骤流程的端到端集成
- 测试 UI 交互和导航
- 准备生产部署

**工作流程**：

```
1. 分析用户流程，识别测试场景
   ↓
2. 生成 Playwright 测试（使用 Page Object 模式）
   ↓
3. 跨多个浏览器运行测试（Chrome、Firefox、Safari）
   ↓
4. 捕获失败时的截图、视频、追踪
   ↓
5. 生成包含结果和工件的报告
   ↓
6. 识别不稳定的测试并建议修复
```

**示例**：

```
你：/e2e 测试市场搜索和查看流程

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

**快速命令**：

```bash
# 运行所有 E2E 测试
npx playwright test

# 运行特定测试文件
npx playwright test tests/e2e/markets/search.spec.ts

# 以 headed 模式运行（看到浏览器）
npx playwright test --headed

# 调试测试
npx playwright test --debug

# 查看报告
npx playwright show-report
```

**最佳实践**：
- ✅ 使用 Page Object Model 提高可维护性
- ✅ 使用 data-testid 属性作为选择器
- ✅ 等待 API 响应，而非任意超时
- ✅ 测试关键用户流程
- ❌ 不要使用脆弱的选择器（CSS 类会变化）
- ❌ 不要测试实现细节

---

### /test-coverage：测试覆盖率分析

**用途**：分析测试覆盖率并生成缺失的测试。

**适用场景**：
- 覆盖率低于 80%
- 需要补充测试

**工作流程**：

```
1. 运行带覆盖率的测试
   ↓
2. 分析覆盖率报告（coverage/coverage-summary.json）
   ↓
3. 识别低于 80% 覆盖率阈值的文件
   ↓
4. 为每个覆盖率不足的文件：
   - 分析未测试的代码路径
   - 生成函数的单元测试
   - 生成 API 的集成测试
   ↓
5. 验证新测试通过
   ↓
6. 显示前后覆盖率指标
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

### /eval：评估驱动开发

**用途**：管理 eval 驱动开发工作流。

**适用场景**：
- 评估驱动开发（EDD）
- 功能验收测试
- 回归测试

**子命令**：

- `define <name>` - 创建新的 eval 定义
- `check <name>` - 运行并检查 evals
- `report <name>` - 生成完整报告
- `list` - 显示所有 evals

**示例 - 定义 Eval**：

```
你：/eval define user-auth

Claude：
创建 eval 定义...

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

请填写具体的评估标准...
```

**示例 - 检查 Eval**：

```
你：/eval check user-auth

Claude：
运行 evals...

EVAL CHECK: user-auth
=======================
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

**示例 - 报告 Eval**：

```
你：/eval report user-auth

Claude：
生成综合报告...

EVAL REPORT: user-auth
=========================
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

## 文档与架构类命令

### /update-docs：同步文档

**用途**：从源码同步文档。

**适用场景**：
- 代码变更后更新文档
- 保持文档与代码同步

**工作流程**：

```
1. 读取 package.json scripts 部分
   - 生成脚本参考表
   - 从注释中提取描述
   ↓
2. 读取 .env.example
   - 提取所有环境变量
   - 记录用途和格式
   ↓
3. 生成 docs/CONTRIB.md
   - 开发工作流
   - 可用脚本
   - 环境设置
   - 测试程序
   ↓
4. 生成 docs/RUNBOOK.md
   - 部署程序
   - 监控和告警
   - 常见问题和修复
   - 回滚程序
   ↓
5. 识别过时文档
   - 找出 90+ 天未修改的文档
   - 列出供人工审查
   ↓
6. 显示 diff 总结
```

::: tip 单一真相源

package.json 和 .env.example 是唯一真相源。

:::

---

### /update-codemaps：更新架构文档

**用途**：分析代码库结构并更新架构文档。

**适用场景**：
- 代码结构变更后
- 需要更新架构文档

**工作流程**：

```
1. 扫描所有源文件的导入、导出和依赖
   ↓
2. 生成精简的 codemaps：
   - codemaps/architecture.md - 整体架构
   - codemaps/backend.md - 后端结构
   - codemaps/frontend.md - 前端结构
   - codemaps/data.md - 数据模型和 schema
   ↓
3. 计算与前一版本的 diff 百分比
   ↓
4. 如果变更 > 30%，请求用户批准后再更新
   ↓
5. 为每个 codemap 添加新鲜度时间戳
   ↓
6. 将报告保存到 .reports/codemap-diff.txt
```

**示例**：

```
你：/update-codemaps

Claude：
分析代码库结构...

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

## 状态管理类命令

### /checkpoint：保存工作状态

**用途**：创建或验证工作流中的检查点。

**适用场景**：
- 保存重要的开发阶段
- 支持回退和进度跟踪

**子命令**：

- `create <name>` - 创建命名检查点
- `verify <name>` - 验证检查点
- `list` - 显示所有检查点
- `clear` - 移除旧检查点（保留最近 5 个）

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
[开始] → /checkpoint create "feature-start"
   |
[实现] → /checkpoint create "core-done"
   |
[测试] → /checkpoint verify "core-done"
   |
[重构] → /checkpoint create "refactor-done"
   |
[PR] → /checkpoint verify "feature-start"
```

---

## 学习与优化类命令

### /learn：提取可复用模式

**用途**：分析当前会话并提取可保存为 skill 的模式。

**适用场景**：
- 解决非平凡问题后
- 发现可复用的错误解决模式
- 记录项目特定约定

**提取内容**：

1. **错误解决模式**
   - 发生了什么错误？
   - 根本原因是什么？
   - 如何修复的？
   - 对类似错误是否可复用？

2. **调试技巧**
   - 非显而易见的调试步骤
   - 有效的工具组合
   - 诊断模式

3. **Workarounds**
   - 库的 quirks
   - API 限制
   - 版本特定修复

4. **项目特定模式**
   - 发现的代码库约定
   - 做出的架构决策
   - 集成模式

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

::: tip 聚焦原则

一次提取一个模式，保持技能专注。

:::

---

## 配置类命令

### /setup-pm：配置包管理器

**用途**：配置项目或全局的首选包管理器。

**适用场景**：
- 检测当前使用的包管理器
- 设置全局或项目偏好

**检测优先级**：

1. 环境变量：`CLAUDE_PACKAGE_MANAGER`
2. 项目配置：`.claude/package-manager.json`
3. package.json：`packageManager` 字段
4. Lock 文件：package-lock.json、yarn.lock、pnpm-lock.yaml、bun.lockb
5. 全局配置：`~/.claude/package-manager.json`
6. 回退：第一个可用的包管理器

**支持包管理器优先级**：pnpm > bun > yarn > npm

**示例**：

```bash
# 检测当前包管理器
node scripts/setup-package-manager.js --detect

# 设置全局偏好
node scripts/setup-package-manager.js --global pnpm

# 设置项目偏好
node scripts/setup-package-manager.js --project bun

# 列出可用的包管理器
node scripts/setup-package-manager.js --list
```

**配置文件**：

全局配置（`~/.claude/package-manager.json`）：
```json
{
  "packageManager": "pnpm"
}
```

项目配置（`.claude/package-manager.json`）：
```json
{
  "packageManager": "bun"
}
```

环境变量覆盖所有检测方法：
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

---

## 命令组合工作流

### 完整功能开发流程

```
1. /plan "添加用户认证功能"
   ↓ 创建实现计划
2. /tdd "实现认证服务"
   ↓ TDD 开发
3. /test-coverage
   ↓ 确保覆盖率 ≥ 80%
4. /code-review
   ↓ 代码审查
5. /verify pre-pr
   ↓ 全面验证
6. /checkpoint create "auth-feature-done"
   ↓ 保存检查点
7. /update-docs
   ↓ 更新文档
8. /update-codemaps
   ↓ 更新架构文档
```

### Bug 修复流程

```
1. /checkpoint create "bug-start"
   ↓ 保存当前状态
2. /orchestrate bugfix "修复登录错误"
   ↓ 自动化 bug 修复流程
3. /test-coverage
   ↓ 确保测试覆盖
4. /verify quick
   ↓ 验证修复
5. /checkpoint verify "bug-start"
   ↓ 对比检查点
```

### 安全审查流程

```
1. /orchestrate security "审查支付流程"
   ↓ 安全优先的审查流程
2. /e2e "测试支付流程"
   ↓ 端到端测试
3. /code-review
   ↓ 代码审查
4. /verify pre-pr
   ↓ 全面验证
```

---

## 命令对比速查表

| 命令 | 主要用途 | 触发 Agent | 输出 |
|------|---------|------------|------|
| `/plan` | 创建实现计划 | planner | 分阶段计划 |
| `/tdd` | TDD 开发 | tdd-guide | 测试 + 实现 + 覆盖率 |
| `/orchestrate` | 序列执行 agents | 多个 agents | 综合报告 |
| `/code-review` | 代码审查 | code-reviewer, security-reviewer | 安全和质量报告 |
| `/build-fix` | 修复构建错误 | build-error-resolver | 修复总结 |
| `/refactor-clean` | 清理死代码 | refactor-cleaner | 清理总结 |
| `/verify` | 全面验证 | Bash | 验证报告 |
| `/e2e` | 端到端测试 | e2e-runner | Playwright 测试 + 工件 |
| `/test-coverage` | 分析覆盖率 | Bash | 覆盖率报告 + 缺失测试 |
| `/eval` | 评估驱动开发 | Bash | Eval 状态报告 |
| `/checkpoint` | 保存状态 | Bash + Git | 检查点报告 |
| `/learn` | 提取模式 | continuous-learning skill | Skill 文件 |
| `/update-docs` | 同步文档 | doc-updater agent | 文档更新 |
| `/update-codemaps` | 更新架构 | doc-updater agent | Codemap 更新 |
| `/setup-pm` | 配置包管理器 | Node.js 脚本 | 包管理器检测 |

---

## 踩坑提醒

### ❌ 不要跳过规划阶段

对于复杂功能，直接开始编码会导致：
- 遗漏重要依赖
- 架构不一致
- 需求理解偏差

**✅ 正确做法**：使用 `/plan` 创建详细计划，等待确认后再实现。

---

### ❌ 不要在 TDD 中跳过 RED 阶段

先写代码再写测试，就不是 TDD 了。

**✅ 正确做法**：严格执行 RED → GREEN → REFACTOR 循环。

---

### ❌ 不要忽略 /code-review 的 CRITICAL 问题

安全漏洞可能导致数据泄露、金钱损失等严重后果。

**✅ 正确做法**：修复所有 CRITICAL 和 HIGH 级别问题后再提交。

---

### ❌ 不要删除代码前不测试

死代码分析可能有误报，直接删除可能破坏功能。

**✅ 正确做法**：每次删除前先运行测试，确保没有破坏现有功能。

---

### ❌ 不要忘记使用 /learn

解决了非平凡问题后不提取模式，下次遇到相同问题又得从头解决。

**✅ 正确做法**：定期使用 `/learn` 提取可复用模式，积累知识。

---

## 本课小结

Everything Claude Code 的 15 个斜杠命令提供了完整的开发工作流支持：

- **开发流程**：`/plan` → `/tdd` → `/orchestrate`
- **代码质量**：`/code-review` → `/build-fix` → `/refactor-clean` → `/verify`
- **测试**：`/e2e` → `/test-coverage` → `/eval`
- **文档与架构**：`/update-docs` → `/update-codemaps`
- **状态管理**：`/checkpoint`
- **学习与优化**：`/learn`
- **配置**：`/setup-pm`

掌握这些命令，你可以高效、安全、有质量地完成开发工作。

---

## 下一课预告

> 下一课我们学习 **[核心 Agents 详解](../agents-overview/)**。
>
> 你会学到：
> - 9 个专业化 agents 的职责和适用场景
> - 何时调用哪个 agent
> - Agent 之间的协作方式
> - 如何自定义 agent 配置

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能 | 文件路径 | 行号 |
|------|---------|------|
| TDD 命令 | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Plan 命令 | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Code Review 命令 | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| E2E 命令 | [`commands/e2e.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/e2e.md) | 1-364 |
| Build Fix 命令 | [`commands/build-fix.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/build-fix.md) | 1-30 |
| Refactor Clean 命令 | [`commands/refactor-clean.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/refactor-clean.md) | 1-29 |
| Learn 命令 | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Checkpoint 命令 | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify 命令 | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Test Coverage 命令 | [`commands/test-coverage.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/test-coverage.md) | 1-28 |
| Setup PM 命令 | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md) | 1-81 |
| Update Docs 命令 | [`commands/update-docs.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-docs.md) | 1-32 |
| Orchestrate 命令 | [`commands/orchestrate.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/orchestrate.md) | 1-173 |
| Update Codemaps 命令 | [`commands/update-codemaps.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-codemaps.md) | 1-18 |
| Eval 命令 | [`commands/eval.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/eval.md) | 1-121 |
| Plugin 定义 | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |

**关键常量**：
- TDD 覆盖率目标：80%（critical 代码 100%） - `commands/tdd.md:293-300`

**关键函数**：
- TDD 循环：RED → GREEN → REFACTOR - `commands/tdd.md:40-47`
- Plan 等待确认机制 - `commands/plan.md:96`
- Code Review 严重级别：CRITICAL, HIGH, MEDIUM - `commands/code-review.md:33`

</details>
