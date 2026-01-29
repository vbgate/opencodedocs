---
title: "验证循环: Checkpoint 与 Evals | Everything Claude Code"
subtitle: "验证循环: Checkpoint 与 Evals"
sidebarTitle: "PR 前检查不踩坑"
description: "学习 Everything Claude Code 的验证循环机制。掌握 Checkpoint 管理、Evals 定义和持续验证，通过 checkpoint 保存状态并回退，使用 evals 确保代码质量。"
tags:
  - "verification"
  - "checkpoint"
  - "evals"
  - "quality-gates"
prerequisite:
  - "platforms-tdd-workflow"
order: 120
---

# 验证循环：Checkpoint 与 Evals

## 学完你能做什么

学习验证循环机制后，你可以：

- 使用 `/checkpoint` 保存和恢复工作状态
- 使用 `/verify` 运行全面的代码质量检查
- 掌握 Eval-Driven Development（EDD）理念，定义和运行 evals
- 建立持续验证循环，在开发过程中保持代码质量

## 你现在的困境

你刚完成一个功能，但不敢提交 PR，因为：
- 不确定是否破坏了现有功能
- 担心测试覆盖率下降
- 忘了最开始的目标是什么，不知道是否偏离了方向
- 想回退到某个稳定状态，但没有记录

如果有一个机制，能在关键时刻"拍照存档"，并在开发过程中持续验证，这些问题就迎刃而解了。

## 什么时候用这一招

- **开始新功能前**：创建 checkpoint，记录起始状态
- **完成里程碑后**：保存进度，便于回退和对比
- **提交 PR 前**：运行全面验证，确保代码质量
- **重构时**：频繁验证，避免破坏现有功能
- **多人协作时**：共享 checkpoint，同步工作状态

## 🎒 开始前的准备

::: warning 前置条件

本教程假设你已经：

- ✅ 完成了 [TDD 工作流程](../../platforms/tdd-workflow/) 的学习
- ✅ 熟悉基本的 Git 操作
- ✅ 了解如何使用 Everything Claude Code 的基本命令

:::

---

## 核心思路

**验证循环**是一个质量保证机制，它把"写代码 → 测试 → 验证"这个循环变成了系统化流程。

### 三层验证体系

Everything Claude Code 提供三层验证：

| 层级 | 机制 | 目的 | 何时使用 |
|--- | --- | --- | ---|
| **实时验证** | PostToolUse Hooks | 立即捕获类型错误、console.log 等 | 每次工具调用后 |
| **周期验证** | `/verify` 命令 | 全面检查：构建、类型、测试、安全 | 每 15 分钟或重大变更后 |
| **里程碑验证** | `/checkpoint` | 对比状态差异，追踪质量趋势 | 完成里程碑、提交 PR 前 |

### Checkpoint：代码的"存档点"

Checkpoint 会在关键时刻"拍照存档"：

- 记录 Git SHA
- 记录测试通过率
- 记录代码覆盖率
- 记录时间戳

验证时，你可以对比当前状态与任意 checkpoint 的差异。

### Evals：AI 开发的"单元测试"

**Eval-Driven Development（EDD）** 把 evals 当作 AI 开发的单元测试：

1. **先定义成功标准**（写 evals）
2. **再写代码**（实现功能）
3. **持续运行 evals**（验证正确性）
4. **追踪回归**（确保不破坏现有功能）

这与 TDD（测试驱动开发）理念一致，但面向 AI 辅助开发。

---

## 跟我做：使用 Checkpoint

### 第 1 步：创建初始 checkpoint

开始新功能前，先创建 checkpoint：

```bash
/checkpoint create "feature-start"
```

**为什么**
记录起始状态，便于后续对比。

**你应该看到**：

```
VERIFICATION: Running quick checks...
Build:    OK
Types:    OK

CHECKPOINT CREATED: feature-start
Time:     2026-01-25-14:30
Git SHA:  abc1234
Logged to: .claude/checkpoints.log
```

Checkpoint 会：
1. 先运行 `/verify quick`（只检查构建和类型）
2. 创建 git stash 或 commit（命名：`checkpoint-feature-start`）
3. 记录到 `.claude/checkpoints.log`

### 第 2 步：实现核心功能

开始编写代码，完成核心逻辑。

### 第 3 步：创建里程碑 checkpoint

完成核心功能后：

```bash
/checkpoint create "core-done"
```

**为什么**
记录里程碑，便于回退。

**你应该看到**：

```
CHECKPOINT CREATED: core-done
Time:     2026-01-25-16:45
Git SHA:  def5678
Logged to: .claude/checkpoints.log
```

### 第 4 步：验证与对比

验证当前状态是否偏离目标：

```bash
/checkpoint verify "feature-start"
```

**为什么**
对比从开始到现在，质量指标的变化。

**你应该看到**：

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

查看历史 checkpoint：

```bash
/checkpoint list
```

**你应该看到**：

```
CHECKPOINTS HISTORY
===================
Name           | Time             | Git SHA  | Status
---------------|------------------|----------|--------
feature-start  | 2026-01-25-14:30 | abc1234  | behind
core-done      | 2026-01-25-16:45 | def5678  | current
```

**检查点 ✅**：验证理解

- Checkpoint 会自动运行 `/verify quick` 吗？✅ 是
- Checkpoint 记录在哪个文件？✅ `.claude/checkpoints.log`
- `/checkpoint verify` 会对比哪些指标？✅ 文件变更、测试通过率、覆盖率

---

## 跟我做：使用 Verify 命令

### 第 1 步：运行快速验证

开发过程中，频繁运行快速验证：

```bash
/verify quick
```

**为什么**
只检查构建和类型，速度最快。

**你应该看到**：

```
VERIFICATION: PASS

Build:    OK
Types:    OK

Ready for next task: YES
```

### 第 2 步：运行全面验证

准备提交 PR 前，运行完整检查：

```bash
/verify full
```

**为什么**
全面检查所有质量门。

**你应该看到**：

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

### 第 3 步：运行 PR 前验证

最严格的检查，包含安全扫描：

```bash
/verify pre-pr
```

**你应该看到**：

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

### 第 4 步：修复问题后重新验证

修复问题后，再次运行验证：

```bash
/verify full
```

**你应该看到**：

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

**检查点 ✅**：验证理解

- `/verify quick` 只检查什么？✅ 构建和类型
- `/verify full` 会检查哪些项目？✅ 构建、类型、Lint、测试、Secrets、Console.log、Git 状态
- 哪个验证模式包含安全扫描？✅ `pre-pr`

---

## 跟我做：使用 Evals（Eval-Driven Development）

### 第 1 步：定义 Evals（写代码前）

**在开始编码前，先定义成功标准**：

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

**为什么**
先定义成功标准，强迫思考"完成的标准是什么"。

保存到：`.claude/evals/user-authentication.md`

### 第 2 步：实现功能

根据 evals 编写代码。

### 第 3 步：运行能力 Evals

测试新功能是否满足 evals：

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

### 第 4 步：运行回归 Evals

确保不破坏现有功能：

```bash
npm test -- --testPathPattern="existing"
```

**你应该看到**：

```
PASS  existing/auth.test.ts
PASS  existing/api.test.ts
PASS  existing/db.test.ts

All regression tests: 15/15 passed
```

### 第 5 步：生成 Eval 报告

汇总结果：

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

**检查点 ✅**：验证理解

- Evals 应该在什么时候定义？✅ 写代码前
- capability evals 和 regression evals 的区别？✅ 前者测试新功能，后者确保不破坏现有功能
- pass@3 的含义？✅ 3 次尝试内成功的概率

---

## 踩坑提醒

### 坑 1：忘记创建 checkpoint

**问题**：开发一段时间后，想回退到某个状态，但没有记录。

**解决**：在开始每个新功能前，创建 checkpoint：

```bash
# 好习惯：新功能开始前
/checkpoint create "feature-name-start"

# 好习惯：每个里程碑
/checkpoint create "phase-1-done"
/checkpoint create "phase-2-done"
```

### 坑 2：Evals 定义过于模糊

**问题**：Evals 写得很模糊，无法验证。

**错误示例**：
```markdown
- [ ] 用户可以登录
```

**正确示例**：
```markdown
- [ ] User can login with valid credentials
  Task: POST /api/login with email="test@example.com", password="Test123!"
  Expected: HTTP 200 with JWT token in response body
  Actual: ___________
```

### 坑 3：只在提交 PR 前运行验证

**问题**：等到 PR 前才发现问题，修复成本高。

**解决**：建立持续验证习惯：

```
每 15 分钟运行：/verify quick
每次功能完成：/checkpoint create "milestone"
提交 PR 前：   /verify pre-pr
```

### 坑 4：Evals 不更新

**问题**：需求变更后，Evals 还是旧的，导致验证失效。

**解决**：Evals 是"第一类代码"，需求变更时同步更新：

```bash
# 需求变更 → 更新 Evals → 更新代码
1. 修改 .claude/evals/feature-name.md
2. 根据新 evals 修改代码
3. 重新运行 evals
```

---

## 本课小结

验证循环是保持代码质量的系统化方法：

| 机制 | 作用 | 使用频率 |
|--- | --- | ---|
| **PostToolUse Hooks** | 实时捕获错误 | 每次工具调用 |
| **`/verify`** | 周期性全面检查 | 每 15 分钟 |
| **`/checkpoint`** | 里程碑记录和对比 | 每个功能阶段 |
| **Evals** | 功能验证和回归测试 | 每个新功能 |

核心原则：
1. **先定义，后实现**（Evals）
2. **频繁验证，持续改进**（`/verify`）
3. **记录里程碑，便于回退**（`/checkpoint`）

---

## 下一课预告

> 下一课我们学习 **[自定义 Rules：构建项目专属规范](../custom-rules/)**。
>
> 你会学到：
> - 如何创建自定义 Rules 文件
> - Rule 文件格式和检查清单编写
> - 定义项目特定的安全规则
> - 将团队规范集成到代码审查流程

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Checkpoint 命令定义 | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify 命令定义 | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Verification Loop Skill | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| Eval Harness Skill | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |

**关键流程**：
- Checkpoint 创建流程：先运行 `/verify quick` → 创建 git stash/commit → 记录到 `.claude/checkpoints.log`
- Verify 验证流程：Build Check → Type Check → Lint Check → Test Suite → Console.log Audit → Git Status
- Eval 工作流：Define（定义 evals）→ Implement（实现代码）→ Evaluate（运行 evals）→ Report（生成报告）

**关键参数**：
- `/checkpoint [create\|verify\|list] [name]` - Checkpoint 操作
- `/verify [quick\|full\|pre-commit\|pre-pr]` - 验证模式
- pass@3 - 3 次尝试内成功的目标（>90%）
- pass^3 - 3 次连续成功（100%，用于关键路径）

</details>
