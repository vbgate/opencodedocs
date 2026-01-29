---
title: "Agents: 9 个专业化代理 | Everything Claude Code"
sidebarTitle: "用对 Agent，效率翻倍"
subtitle: "Agents: 9 个专业化代理 | Everything Claude Code"
description: "学习 Everything Claude Code 的 9 个专业化 agents，掌握不同场景的调用方法，提升 AI 辅助开发的效率和质量。"
tags:
  - "agents"
  - "ai-assistant"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 60
---

# 核心 Agents 详解：9 个专业化子代理

## 学完你能做什么

- 理解 9 个专业化 agents 的职责和使用场景
- 知道在不同开发任务中应该调用哪个 agent
- 掌握 agents 之间的协作方式，构建高效开发流程
- 避免"通用 AI"的局限性，利用专业化 agents 提升效率

## 你现在的困境

- 经常让 Claude 做一些任务，但得到的回复不够专业或不够深入
- 不确定什么时候该用 /plan、/tdd、/code-review 等命令
- 觉得 AI 给出的建议太泛，缺少针对性
- 想要一套系统化的开发工作流，但不知道如何组织

## 什么时候用这一招

当你需要完成以下任务时，这个教程会帮到你：
- 复杂功能开发前的规划
- 编写新功能或修复 bug
- 代码审查和安全审计
- 构建错误修复
- 端到端测试
- 代码重构和清理
- 文档更新

## 核心思路

Everything Claude Code 提供了 9 个专业化 agents，每个 agent 都专注于特定领域。就像你在真实团队中会找不同角色的专家一样，不同的开发任务应该调用不同的 agent。

::: info Agent vs Command
- **Agent**：专业的 AI 助手，有特定领域的知识和工具
- **Command**：快捷方式，用于快速调用 agent 或执行特定操作

例如：`/tdd` 命令会调用 `tdd-guide` agent 来执行测试驱动开发流程。
:::

### 9 个 Agents 总览

| Agent | 角色 | 典型场景 | 关键能力 |
|--- | --- | --- | ---|
| **planner** | 规划专家 | 复杂功能开发前的计划制定 | 需求分析、架构审查、步骤拆解 |
| **architect** | 架构师 | 系统设计和技术决策 | 架构评估、模式推荐、权衡分析 |
| **tdd-guide** | TDD 导师 | 编写测试和实现功能 | Red-Green-Refactor 流程、覆盖率保证 |
| **code-reviewer** | 代码审查员 | 审查代码质量 | 质量、安全、可维护性检查 |
| **security-reviewer** | 安全审计员 | 安全漏洞检测 | OWASP Top 10、密钥泄露、注入防护 |
| **build-error-resolver** | 构建错误修复师 | 修复 TypeScript/构建错误 | 最小化修复、类型推断 |
| **e2e-runner** | E2E 测试专家 | 端到端测试管理 | Playwright 测试、flaky 管理、artifact |
| **refactor-cleaner** | 重构清理师 | 删除死代码和重复 | 依赖分析、安全删除、文档记录 |
| **doc-updater** | 文档更新师 | 生成和更新文档 | codemap 生成、AST 分析 |

## 详细介绍

### 1. Planner - 规划专家

**何时使用**：需要实现复杂功能、架构变更或大型重构时。

::: tip 最佳实践
在开始写代码前，先用 `/plan` 创建实现计划。这可以避免遗漏依赖、发现潜在风险、制定合理的实现顺序。
:::

**核心能力**：
- 需求分析和澄清
- 架构审查和依赖识别
- 详细的实现步骤拆解
- 风险识别和缓解方案
- 测试策略规划

**输出格式**：
```markdown
# Implementation Plan: [Feature Name]

## Overview
[2-3 句话总结]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Architecture Changes
- [Change 1: 文件路径和描述]
- [Change 2: 文件路径和描述]

## Implementation Steps

### Phase 1: [Phase Name]
1. **[Step Name]** (File: path/to/file.ts)
   - Action: 具体操作
   - Why: 原因
   - Dependencies: None / Requires step X
   - Risk: Low/Medium/High

## Testing Strategy
- Unit tests: [要测试的文件]
- Integration tests: [要测试的流程]
- E2E tests: [要测试的用户旅程]

## Risks & Mitigations
- **Risk**: [描述]
  - Mitigation: [如何解决]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

**示例场景**：
- 添加新的 API 端点（需要数据库迁移、缓存更新、文档）
- 重构核心模块（影响多个依赖）
- 添加新功能（涉及前端、后端、数据库）

### 2. Architect - 架构师

**何时使用**：需要设计系统架构、评估技术方案、做架构决策时。

**核心能力**：
- 系统架构设计
- 技术权衡分析
- 设计模式推荐
- 可扩展性规划
- 安全性考虑

**架构原则**：
- **模块化**：单一职责、高内聚低耦合
- **可扩展性**：水平扩展、无状态设计
- **可维护性**：清晰结构、一致模式
- **安全性**：防御深度、最小权限
- **性能**：高效算法、最小网络请求

**常用模式**：

**前端模式**：
- 组件组合、Container/Presenter 模式、自定义 Hooks、Context 全局状态、代码分割

**后端模式**：
- Repository 模式、Service 层、中间件模式、事件驱动架构、CQRS

**数据模式**：
- 规范化数据库、反规范化读性能、事件溯源、缓存层、最终一致性

**架构决策记录 (ADR) 格式**：
```markdown
# ADR-001: 使用 Redis 存储语义搜索向量

## Context
需要存储和查询 1536 维嵌入向量用于语义市场搜索。

## Decision
使用 Redis Stack 的向量搜索功能。

## Consequences

### Positive
- 快速向量相似度搜索 (<10ms)
- 内置 KNN 算法
- 部署简单
- 性能良好（直到 10K 向量）

### Negative
- 内存存储（大数据集成本高）
- 单点故障（无集群）
- 仅支持余弦相似度

### Alternatives Considered
- **PostgreSQL pgvector**: 较慢，但持久存储
- **Pinecone**: 托管服务，成本更高
- **Weaviate**: 功能更多，设置更复杂

## Status
Accepted

## Date
2025-01-15
```

### 3. TDD Guide - TDD 导师

**何时使用**：编写新功能、修复 bug、重构代码时。

::: warning 核心原则
TDD Guide 要求所有代码必须**先写测试**，再实现功能，确保 80%+ 测试覆盖率。
:::

**TDD 工作流程**：

**Step 1: 先写测试 (RED)**
```typescript
describe('searchMarkets', () => {
  it('returns semantically similar markets', async () => {
    const results = await searchMarkets('election')

    expect(results).toHaveLength(5)
    expect(results[0].name).toContain('Trump')
    expect(results[1].name).toContain('Biden')
  })
})
```

**Step 2: 运行测试（验证失败）**
```bash
npm test
# Test should fail - we haven't implemented yet
```

**Step 3: 写最小实现 (GREEN)**
```typescript
export async function searchMarkets(query: string) {
  const embedding = await generateEmbedding(query)
  const results = await vectorSearch(embedding)
  return results
}
```

**Step 4: 运行测试（验证通过）**
```bash
npm test
# Test should now pass
```

**Step 5: 重构 (IMPROVE)**
- 移除重复代码
- 改进命名
- 优化性能
- 提升可读性

**Step 6: 验证覆盖率**
```bash
npm run test:coverage
# Verify 80%+ coverage
```

**必须编写的测试类型**：

1. **单元测试**（必填）：测试独立函数
2. **集成测试**（必填）：测试 API 端点和数据库操作
3. **E2E 测试**（关键流程）：测试完整用户旅程

**必须覆盖的边界情况**：
- Null/Undefined：如果输入为 null 怎么办？
- 空：数组/字符串为空怎么办？
- 无效类型：传了错误的类型怎么办？
- 边界：最小/最大值
- 错误：网络失败、数据库错误
- 竞态条件：并发操作
- 大数据：10k+ 项的性能
- 特殊字符：Unicode、emoji、SQL 字符

### 4. Code Reviewer - 代码审查员

**何时使用**：写完或修改代码后，立即进行审查。

::: tip 强制使用
Code Reviewer 是**必须使用**的 agent，所有代码变更都需要通过它的审查。
:::

**审查清单**：

**安全检查 (CRITICAL)**：
- 硬编码凭证（API keys、密码、tokens）
- SQL 注入风险（查询中的字符串拼接）
- XSS 漏洞（未转义的用户输入）
- 缺失输入验证
- 不安全的依赖（过时、有漏洞）
- 路径遍历风险（用户控制的文件路径）
- CSRF 漏洞
- 认证绕过

**代码质量 (HIGH)**：
- 大函数（>50 行）
- 大文件（>800 行）
- 深层嵌套（>4 层）
- 缺失错误处理（try/catch）
- console.log 语句
- 变更模式
- 新代码缺失测试

**性能 (MEDIUM)**：
- 低效算法（O(n²) 当 O(n log n) 可行时）
- React 中不必要的重渲染
- 缺失 memoization
- 大的 bundle 大小
- 未优化的图片
- 缺失缓存
- N+1 查询

**最佳实践 (MEDIUM)**：
- 代码/注释中使用 emoji
- TODO/FIXME 没有关联 ticket
- 公共 API 缺失 JSDoc
- 可访问性问题（缺失 ARIA 标签、对比度差）
- 变量命名差（x, tmp, data）
- 未解释的 magic numbers
- 格式不一致

**审查输出格式**：
```markdown
[CRITICAL] Hardcoded API key
File: src/api/client.ts:42
Issue: API key exposed in source code
Fix: Move to environment variable

const apiKey = "sk-abc123";  // ❌ Bad
const apiKey = process.env.API_KEY;  // ✓ Good
```

**批准标准**：
- ✅ 批准：没有 CRITICAL 或 HIGH 问题
- ⚠️ 警告：只有 MEDIUM 问题（可以谨慎合并）
- ❌ 阻止：发现 CRITICAL 或 HIGH 问题

### 5. Security Reviewer - 安全审计员

**何时使用**：编写处理用户输入、认证、API 端点或敏感数据的代码后。

::: danger 关键
Security Reviewer 会标记密钥泄露、SSRF、注入、不安全加密和 OWASP Top 10 漏洞。发现 CRITICAL 问题必须立即修复！
:::

**核心职责**：
1. **漏洞检测**：识别 OWASP Top 10 和常见安全问题
2. **密钥检测**：查找硬编码的 API keys、密码、tokens
3. **输入验证**：确保所有用户输入都经过适当清理
4. **认证/授权**：验证适当的访问控制
5. **依赖安全**：检查有漏洞的 npm 包
6. **安全最佳实践**：强制安全编码模式

**OWASP Top 10 检查**：

1. **注入**（SQL、NoSQL、Command）
   - 查询是否参数化？
   - 用户输入是否清理？
   - ORM 是否安全使用？

2. **损坏的认证**
   - 密码是否哈希（bcrypt、argon2）？
   - JWT 是否正确验证？
   - 会话是否安全？
   - 是否有 MFA？

3. **敏感数据暴露**
   - 是否强制使用 HTTPS？
   - 密钥是否在环境变量中？
   - PII 是否在静态加密？
   - 日志是否清理？

4. **XML 外部实体 (XXE)**
   - XML 解析器是否安全配置？
   - 外部实体处理是否禁用？

5. **损坏的访问控制**
   - 每个路由是否检查授权？
   - 对象引用是否间接？
   - CORS 是否正确配置？

6. **安全配置错误**
   - 默认凭证是否更改？
   - 错误处理是否安全？
   - 安全头是否设置？
   - 生产环境是否禁用调试模式？

7. **跨站脚本攻击 (XSS)**
   - 输出是否转义/清理？
   - Content-Security-Policy 是否设置？
   - 框架是否默认转义？

8. **不安全的反序列化**
   - 用户输入是否安全反序列化？
   - 反序列化库是否最新？

9. **使用有已知漏洞的组件**
   - 所有依赖是否最新？
   - npm audit 是否干净？
   - CVE 是否监控？

10. **日志和监控不足**
    - 安全事件是否记录？
    - 日志是否监控？
    - 告警是否配置？

**常见漏洞模式**：

**1. 硬编码密钥 (CRITICAL)**
```javascript
// ❌ CRITICAL: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ✅ CORRECT: Environment variables
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

**2. SQL 注入 (CRITICAL)**
```javascript
// ❌ CRITICAL: SQL injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ CORRECT: Parameterized queries
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

**3. XSS (HIGH)**
```javascript
// ❌ HIGH: XSS vulnerability
element.innerHTML = userInput

// ✅ CORRECT: Use textContent or sanitize
element.textContent = userInput
```

**安全审查报告格式**：
```markdown
# Security Review Report

**File/Component:** [path/to/file.ts]
**Reviewed:** YYYY-MM-DD
**Reviewer:** security-reviewer agent

## Summary
- **Critical Issues:** X
- **High Issues:** Y
- **Medium Issues:** Z
- **Low Issues:** W
- **Risk Level:** 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW

## Critical Issues (Fix Immediately)

### 1. [Issue Title]
**Severity:** CRITICAL
**Category:** SQL Injection / XSS / Authentication / etc.
**Location:** `file.ts:123`

**Issue:**
[漏洞描述]

**Impact:**
[如果被利用会发生什么]

**Proof of Concept:**
```javascript
// 漏洞利用示例
```

**Remediation:**
```javascript
// ✅ 安全实现
```

**References:**
- OWASP: [link]
- CWE: [number]
```

### 6. Build Error Resolver - 构建错误修复师

**何时使用**：构建失败或出现类型错误时。

::: tip 最小化修复
Build Error Resolver 的核心原则是**最小化修复**，只修复错误，不做架构修改或重构。
:::

**核心职责**：
1. **TypeScript 错误修复**：修复类型错误、推断问题、泛型约束
2. **构建错误修复**：解决编译失败、模块解析
3. **依赖问题**：修复导入错误、缺失包、版本冲突
4. **配置错误**：解决 tsconfig.json、webpack、Next.js 配置问题
5. **最小化差异**：做尽可能小的更改来修复错误
6. **不做架构更改**：只修复错误，不重构或重新设计

**诊断命令**：
```bash
# TypeScript 类型检查（无输出）
npx tsc --noEmit

# TypeScript 带美观输出
npx tsc --noEmit --pretty

# 显示所有错误（不在第一个停止）
npx tsc --noEmit --pretty --incremental false

# 检查特定文件
npx tsc --noEmit path/to/file.ts

# ESLint 检查
npx eslint . --ext .ts,.tsx,.js,.jsx

# Next.js 构建（生产）
npm run build
```

**错误修复流程**：

**1. 收集所有错误**
```
a) 运行完整类型检查
   - npx tsc --noEmit --pretty
   - 捕获 ALL 错误，不只是第一个

b) 按类型分类错误
   - 类型推断失败
   - 缺失类型定义
   - 导入/导出错误
   - 配置错误
   - 依赖问题

c) 按影响优先级排序
   - 阻止构建：先修复
   - 类型错误：按顺序修复
   - 警告：有时间就修复
```

**2. 修复策略（最小化更改）**
```
对每个错误：

1. 理解错误
   - 仔细阅读错误消息
   - 检查文件和行号
   - 理解预期 vs 实际类型

2. 找最小修复
   - 添加缺失的类型注解
   - 修复导入语句
   - 添加 null 检查
   - 使用类型断言（最后手段）

3. 验证修复不破坏其他代码
   - 每个修复后运行 tsc
   - 检查相关文件
   - 确保没有引入新错误

4. 迭代直到构建通过
   - 一次修复一个错误
   - 每个修复后重新编译
   - 跟踪进度（X/Y 错误已修复）
```

**常见错误模式与修复**：

**模式 1：类型推断失败**
```typescript
// ❌ ERROR: Parameter 'x' implicitly has an 'any' type
function add(x, y) {
  return x + y
}

// ✅ FIX: Add type annotations
function add(x: number, y: number): number {
  return x + y
}
```

**模式 2：Null/Undefined 错误**
```typescript
// ❌ ERROR: Object is possibly 'undefined'
const name = user.name.toUpperCase()

// ✅ FIX: Optional chaining
const name = user?.name?.toUpperCase()

// ✅ OR: Null check
const name = user && user.name ? user.name.toUpperCase() : ''
```

**模式 3：导入错误**
```typescript
// ❌ ERROR: Cannot find module '@/lib/utils'
import { formatDate } from '@/lib/utils'

// ✅ FIX 1: 检查 tsconfig paths 是否正确
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ✅ FIX 2: 使用相对导入
import { formatDate } from '../lib/utils'
```

**最小化差异策略**：

**CRITICAL：做尽可能小的更改**

**DO：**
✅ 添加缺失的类型注解
✅ 添加需要的 null 检查
✅ 修复导入/导出
✅ 添加缺失的依赖
✅ 更新类型定义
✅ 修复配置文件

**DON'T：**
❌ 重构不相关的代码
❌ 更改架构
❌ 重命名变量/函数（除非导致错误）
❌ 添加新功能
❌ 更改逻辑流程（除非修复错误）
❌ 优化性能
❌ 改进代码风格

### 7. E2E Runner - E2E 测试专家

**何时使用**：需要生成、维护和运行 E2E 测试时。

::: tip 端到端测试的价值
E2E 测试是生产前的最后一道防线，它们捕获单元测试遗漏的集成问题。
:::

**核心职责**：
1. **测试旅程创建**：为用户流程编写 Playwright 测试
2. **测试维护**：保持测试与 UI 变更同步
3. **Flaky 测试管理**：识别和隔离不稳定测试
4. **Artifact 管理**：捕获截图、视频、traces
5. **CI/CD 集成**：确保测试在管道中可靠运行
6. **测试报告**：生成 HTML 报告和 JUnit XML

**测试命令**：
```bash
# 运行所有 E2E 测试
npx playwright test

# 运行特定测试文件
npx playwright test tests/markets.spec.ts

# 以 headed 模式运行测试（看到浏览器）
npx playwright test --headed

# 用 inspector 调试测试
npx playwright test --debug

# 从浏览器操作生成测试代码
npx playwright codegen http://localhost:3000

# 运行带 trace 的测试
npx playwright test --trace on

# 显示 HTML 报告
npx playwright show-report

# 更新快照
npx playwright test --update-snapshots

# 在特定浏览器运行测试
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**E2E 测试工作流程**：

**1. 测试规划阶段**
```
a) 识别关键用户旅程
   - 认证流程（登录、登出、注册）
   - 核心功能（市场创建、交易、搜索）
   - 支付流程（存款、取款）
   - 数据完整性（CRUD 操作）

b) 定义测试场景
   - Happy path（一切都正常）
   - Edge cases（空状态、限制）
   - Error cases（网络失败、验证）

c) 按风险优先级排序
   - HIGH：金融交易、认证
   - MEDIUM：搜索、过滤、导航
   - LOW：UI 打磨、动画、样式
```

**2. 测试创建阶段**
```
对每个用户旅程：

1. 在 Playwright 中编写测试
   - 使用 Page Object Model (POM) 模式
   - 添加有意义的测试描述
   - 在关键步骤添加断言
   - 在关键点添加截图

2. 使测试有弹性
   - 使用合适的定位器（data-testid 优先）
   - 添加动态内容等待
   - 处理竞态条件
   - 实现重试逻辑

3. 添加 artifact 捕获
   - 失败时截图
   - 视频录制
   - 用于调试的 trace
   - 需要时的网络日志
```

**Playwright 测试结构**：

**测试文件组织**：
```
tests/
├── e2e/                       # 端到端用户旅程
│   ├── auth/                  # 认证流程
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── markets/               # 市场功能
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   ├── create.spec.ts
│   │   └── trade.spec.ts
│   ├── wallet/                # 钱包操作
│   │   ├── connect.spec.ts
│   │   └── transactions.spec.ts
│   └── api/                   # API 端点测试
│       ├── markets-api.spec.ts
│       └── search-api.spec.ts
├── fixtures/                  # 测试数据和辅助工具
│   ├── auth.ts                # 认证 fixtures
│   ├── markets.ts             # 市场测试数据
│   └── wallets.ts             # 钱包 fixtures
└── playwright.config.ts       # Playwright 配置
```

**Page Object Model 模式**：
```typescript
// pages/MarketsPage.ts
import { Page, Locator } from '@playwright/test'

export class MarketsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly marketCards: Locator
  readonly createMarketButton: Locator
  readonly filterDropdown: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.marketCards = page.locator('[data-testid="market-card"]')
    this.createMarketButton = page.locator('[data-testid="create-market-btn"]')
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]')
  }

  async goto() {
    await this.page.goto('/markets')
    await this.page.waitForLoadState('networkidle')
  }

  async searchMarkets(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp => resp.url().includes('/api/markets/search'))
    await this.page.waitForLoadState('networkidle')
  }

  async getMarketCount() {
    return await this.marketCards.count()
  }

  async clickMarket(index: number) {
    await this.marketCards.nth(index).click()
  }

  async filterByStatus(status: string) {
    await this.filterDropdown.selectOption(status)
    await this.page.waitForLoadState('networkidle')
  }
}
```

**最佳实践测试示例**：
```typescript
// tests/e2e/markets/search.spec.ts
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test.describe('Market Search', () => {
  let marketsPage: MarketsPage

  test.beforeEach(async ({ page }) => {
    marketsPage = new MarketsPage(page)
    await marketsPage.goto()
  })

  test('should search markets by keyword', async ({ page }) => {
    // Arrange
    await expect(page).toHaveTitle(/Markets/)

    // Act
    await marketsPage.searchMarkets('trump')

    // Assert
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBeGreaterThan(0)

    // Verify first result contains search term
    const firstMarket = marketsPage.marketCards.first()
    await expect(firstMarket).toContainText(/trump/i)

    // Take screenshot for verification
    await page.screenshot({ path: 'artifacts/search-results.png' })
  })

  test('should handle no results gracefully', async ({ page }) => {
    // Act
    await marketsPage.searchMarkets('xyznonexistentmarket123')

    // Assert
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBe(0)
  })
})
```

**Flaky 测试管理**：

**识别 Flaky 测试**：
```bash
# 多次运行测试检查稳定性
npx playwright test tests/markets/search.spec.ts --repeat-each=10

# 带重试运行特定测试
npx playwright test tests/markets/search.spec.ts --retries=3
```

**隔离模式**：
```typescript
// 标记 flaky 测试进行隔离
test('flaky: market search with complex query', async ({ page }) => {
  test.fixme(true, 'Test is flaky - Issue #123')

  // Test code here...
})

// 或使用条件跳过
test('market search with complex query', async ({ page }) => {
  test.skip(process.env.CI, 'Test is flaky in CI - Issue #123')

  // Test code here...
})
```

**常见 Flakiness 原因与修复**：

**1. 竞态条件**
```typescript
// ❌ FLAKY: Don't assume element is ready
await page.click('[data-testid="button"]')

// ✅ STABLE: Wait for element to be ready
await page.locator('[data-testid="button"]').click() // Built-in auto-wait
```

**2. 网络时序**
```typescript
// ❌ FLAKY: Arbitrary timeout
await page.waitForTimeout(5000)

// ✅ STABLE: Wait for specific condition
await page.waitForResponse(resp => resp.url().includes('/api/markets'))
```

**3. 动画时序**
```typescript
// ❌ FLAKY: Click during animation
await page.click('[data-testid="menu-item"]')

// ✅ STABLE: Wait for animation to complete
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.click('[data-testid="menu-item"]')
```

### 8. Refactor Cleaner - 重构清理师

**何时使用**：需要删除未使用代码、重复代码和进行重构时。

::: warning 谨慎操作
Refactor Cleaner 运行分析工具（knip、depcheck、ts-prune）识别死代码并安全删除。删除前一定要充分验证！
:::

**核心职责**：
1. **死代码检测**：查找未使用代码、导出、依赖
2. **重复消除**：识别和合并重复代码
3. **依赖清理**：移除未使用包和导入
4. **安全重构**：确保更改不破坏功能
5. **文档记录**：在 `DELETION_LOG.md` 中跟踪所有删除

**检测工具**：
- **knip**：查找未使用文件、导出、依赖、类型
- **depcheck**：识别未使用 npm 依赖
- **ts-prune**：查找未使用 TypeScript 导出
- **eslint**：检查未使用的 disable-directives 和变量

**分析命令**：
```bash
# 运行 knip 查找未使用导出/文件/依赖
npx knip

# 检查未使用依赖
npx depcheck

# 查找未使用 TypeScript 导出
npx ts-prune

# 检查未使用 disable-directives
npx eslint . --report-unused-disable-directives
```

**重构工作流程**：

**1. 分析阶段**
```
a) 并行运行检测工具
b) 收集所有发现
c) 按风险级别分类：
   - SAFE：未使用导出、未使用依赖
   - CAREFUL：可能通过动态导入使用
   - RISKY：公共 API、共享工具
```

**2. 风险评估**
```
对每个要删除的项目：
- 检查是否在任何地方导入（grep 搜索）
- 验证没有动态导入（grep 字符串模式）
- 检查是否是公共 API 的一部分
- 查看历史记录获取上下文
- 测试对构建/测试的影响
```

**3. 安全删除过程**
```
a) 只从 SAFE 项目开始
b) 一次删除一个类别：
   1. 未使用 npm 依赖
   2. 未使用内部导出
   3. 未使用文件
   4. 重复代码
c) 每批后运行测试
d) 为每批创建 git commit
```

**4. 重复合并**
```
a) 查找重复组件/工具
b) 选择最佳实现：
   - 功能最全
   - 最好测试
   - 最近使用
c) 更新所有导入使用选定版本
d) 删除重复
e) 验证测试仍然通过
```

**删除日志格式**：

创建/更新 `docs/DELETION_LOG.md`，使用以下结构：
```markdown
# Code Deletion Log

## [YYYY-MM-DD] Refactor Session

### Unused Dependencies Removed
- package-name@version - Last used: never, Size: XX KB
- another-package@version - Replaced by: better-package

### Unused Files Deleted
- src/old-component.tsx - Replaced by: src/new-component.tsx
- lib/deprecated-util.ts - Functionality moved to: lib/utils.ts

### Duplicate Code Consolidated
- src/components/Button1.tsx + Button2.tsx → Button.tsx
- Reason: Both implementations were identical

### Unused Exports Removed
- src/utils/helpers.ts - Functions: foo(), bar()
- Reason: No references found in codebase

### Impact
- Files deleted: 15
- Dependencies removed: 5
- Lines of code removed: 2,300
- Bundle size reduction: ~45 KB

### Testing
- All unit tests passing: ✓
- All integration tests passing: ✓
- Manual testing completed: ✓
```

**安全检查清单**：

**删除任何东西之前：**
- [ ] 运行检测工具
- [ ] Grep 所有引用
- [ ] 检查动态导入
- [ ] 查看历史记录
- [ ] 检查是否是公共 API
- [ ] 运行所有测试
- [ ] 创建备份分支
- [ ] 在 DELETION_LOG.md 中文档化

**每次删除后：**
- [ ] 构建成功
- [ ] 测试通过
- [ ] 无控制台错误
- [ ] 提交更改
- [ ] 更新 DELETION_LOG.md

**常见要删除的模式**：

**1. 未使用导入**
```typescript
// ❌ Remove unused imports
import { useState, useEffect, useMemo } from 'react' // Only useState used

// ✅ Keep only what's used
import { useState } from 'react'
```

**2. 死代码分支**
```typescript
// ❌ Remove unreachable code
if (false) {
  // This never executes
  doSomething()
}

// ❌ Remove unused functions
export function unusedHelper() {
  // No references in codebase
}
```

**3. 重复组件**
```typescript
// ❌ Multiple similar components
components/Button.tsx
components/PrimaryButton.tsx
components/NewButton.tsx

// ✅ Consolidate to one
components/Button.tsx (with variant prop)
```

### 9. Doc Updater - 文档更新师

**何时使用**：需要更新 codemaps 和文档时。

::: tip 文档与代码同步
Doc Updater 运行 `/update-codemaps` 和 `/update-docs`，生成 `docs/CODEMAPS/*`，更新 READMEs 和指南。
:::

**核心职责**：
1. **Codemap 生成**：从代码库结构创建架构映射
2. **文档更新**：从代码刷新 READMEs 和指南
3. **AST 分析**：使用 TypeScript 编译器 API 理解结构
4. **依赖映射**：跨模块跟踪导入/导出
5. **文档质量**：确保文档匹配实际代码

**分析工具**：
- **ts-morph**：TypeScript AST 分析和操作
- **TypeScript Compiler API**：深度代码结构分析
- **madge**：依赖图可视化
- **jsdoc-to-markdown**：从 JSDoc 注释生成文档

**分析命令**：
```bash
# 分析 TypeScript 项目结构（运行使用 ts-morph 库的自定义脚本）
npx tsx scripts/codemaps/generate.ts

# 生成依赖图
npx madge --image graph.svg src/

# 提取 JSDoc 注释
npx jsdoc2md src/**/*.ts
```

**Codemap 生成工作流程**：

**1. 仓库结构分析**
```
a) 识别所有 workspaces/packages
b) 映射目录结构
c) 查找入口点（apps/*, packages/*, services/*）
d) 检测框架模式（Next.js, Node.js 等）
```

**2. 模块分析**
```
对每个模块：
- 提取导出（公共 API）
- 映射导入（依赖）
- 识别路由（API 路由、页面）
- 查找数据库模型（Supabase, Prisma）
- 定位 queue/worker 模块
```

**3. 生成 Codemaps**
```
结构：
docs/CODEMAPS/
├── INDEX.md              # 所有区域的概览
├── frontend.md           # 前端结构
├── backend.md            # Backend/API 结构
├── database.md           # 数据库 schema
├── integrations.md       # 外部服务
└── workers.md            # 后台任务
```

**Codemap 格式**：
```markdown
# [Area] Codemap

**Last Updated:** YYYY-MM-DD
**Entry Points:** 主要文件列表

## Architecture

[组件关系的 ASCII 图表]

## Key Modules

| Module | Purpose | Exports | Dependencies |
|--- | --- | --- | ---|
| ... | ... | ... | ... |

## Data Flow

[描述数据如何在此区域流动]

## External Dependencies

- package-name - Purpose, Version
- ...

## Related Areas

链接到与此区域交互的其他 codemaps
```

**文档更新工作流程**：

**1. 从代码提取文档**
```
- 读取 JSDoc/TSDoc 注释
- 从 package.json 提取 README 部分
- 从 .env.example 解析环境变量
- 收集 API 端点定义
```

**2. 更新文档文件**
```
要更新的文件：
- README.md - 项目概览、设置说明
- docs/GUIDES/*.md - 功能指南、教程
- package.json - 描述、脚本文档
- API documentation - 端点规范
```

**3. 文档验证**
```
- 验证所有提到的文件存在
- 检查所有链接有效
- 确保示例可运行
- 验证代码片段编译
```

**示例项目特定 Codemaps**：

**前端 Codemap (docs/CODEMAPS/frontend.md)**：
```markdown
# Frontend Architecture

**Last Updated:** YYYY-MM-DD
**Framework:** Next.js 15.1.4 (App Router)
**Entry Point:** website/src/app/layout.tsx

## Structure

website/src/
├── app/                # Next.js App Router
│   ├── api/           # API 路由
│   ├── markets/       # 市场页面
│   ├── bot/           # 机器人交互
│   └── creator-dashboard/
├── components/        # React 组件
├── hooks/             # 自定义 hooks
└── lib/               # 工具

## Key Components

| Component | Purpose | Location |
|--- | --- | ---|
| HeaderWallet | Wallet connection | components/HeaderWallet.tsx |
| MarketsClient | Markets listing | app/markets/MarketsClient.js |
| SemanticSearchBar | Search UI | components/SemanticSearchBar.js |

## Data Flow

User → Markets Page → API Route → Supabase → Redis (optional) → Response

## External Dependencies

- Next.js 15.1.4 - Framework
- React 19.0.0 - UI library
- Privy - Authentication
- Tailwind CSS 3.4.1 - Styling
```

**后端 Codemap (docs/CODEMAPS/backend.md)**：
```markdown
# Backend Architecture

**Last Updated:** YYYY-MM-DD
**Runtime:** Next.js API Routes
**Entry Point:** website/src/app/api/

## API Routes

| Route | Method | Purpose |
|--- | --- | ---|
| /api/markets | GET | List all markets |
| /api/markets/search | GET | Semantic search |
| /api/market/[slug] | GET | Single market |
| /api/market-price | GET | Real-time pricing |

## Data Flow

API Route → Supabase Query → Redis (cache) → Response

## External Services

- Supabase - PostgreSQL database
- Redis Stack - Vector search
- OpenAI - Embeddings
```

**README 更新模板**：

当更新 README.md 时：
```markdown
# Project Name

Brief description

## Setup
\`\`\`bash
# Installation
npm install

# Environment variables
cp .env.example .env.local
# Fill in: OPENAI_API_KEY, REDIS_URL, etc.

# Development
npm run dev

# Build
npm run build
\`\`\`

## Architecture

See [docs/CODEMAPS/INDEX.md](docs/CODEMAPS/INDEX.md) for detailed architecture.

### Key Directories

- `src/app` - Next.js App Router 页面和 API 路由
- `src/components` - 可重用 React 组件
- `src/lib` - 工具库和客户端

## Features

- [Feature 1] - Description
- [Feature 2] - Description

## Documentation

- [Setup Guide](docs/GUIDES/setup.md)
- [API Reference](docs/GUIDES/api.md)
- [Architecture](docs/CODEMAPS/INDEX.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
```

## 什么时候调用哪个 Agent

基于你的任务类型，选择合适的 agent：

| 任务类型 | 推荐调用 | 替代方案 |
|--- | --- | ---|
| **规划新功能** | `/plan` → planner agent | 手动调用 planner agent |
| **系统架构设计** | 手动调用 architect agent | `/orchestrate` → 序列调用 agents |
| **编写新功能** | `/tdd` → tdd-guide agent | planner → tdd-guide |
| **修复 bug** | `/tdd` → tdd-guide agent | build-error-resolver（如果是类型错误） |
| **代码审查** | `/code-review` → code-reviewer agent | 手动调用 code-reviewer agent |
| **安全审计** | 手动调用 security-reviewer agent | code-reviewer（部分覆盖） |
| **构建失败** | `/build-fix` → build-error-resolver agent | 手动修复 |
| **E2E 测试** | `/e2e` → e2e-runner agent | 手动编写 Playwright 测试 |
| **清理死代码** | `/refactor-clean` → refactor-cleaner agent | 手动删除 |
| **更新文档** | `/update-docs` → doc-updater agent | `/update-codemaps` → doc-updater agent |

## Agent 协作示例

### 场景 1：从零开始开发新功能

```
1. /plan (planner agent)
   - 创建实现计划
   - 识别依赖和风险

2. /tdd (tdd-guide agent)
   - 按照计划编写测试
   - 实现功能
   - 确保覆盖率

3. /code-review (code-reviewer agent)
   - 审查代码质量
   - 检查安全漏洞

4. /verify (命令)
   - 运行构建、类型检查、测试
   - 检查 console.log、git 状态
```

### 场景 2：修复构建错误

```
1. /build-fix (build-error-resolver agent)
   - 修复 TypeScript 错误
   - 确保构建通过

2. /test-coverage (命令)
   - 检查覆盖率是否达标

3. /code-review (code-reviewer agent)
   - 审查修复的代码
```

### 场景 3：代码清理

```
1. /refactor-clean (refactor-cleaner agent)
   - 运行检测工具
   - 删除死代码
   - 合并重复代码

2. /update-docs (doc-updater agent)
   - 更新 codemaps
   - 刷新文档

3. /verify (命令)
   - 运行所有检查
```

## 本课小结

Everything Claude Code 提供了 9 个专业化 agents，每个 agent 都专注于特定领域：

1. **planner** - 复杂功能规划
2. **architect** - 系统架构设计
3. **tdd-guide** - TDD 流程执行
4. **code-reviewer** - 代码质量审查
5. **security-reviewer** - 安全漏洞检测
6. **build-error-resolver** - 构建错误修复
7. **e2e-runner** - 端到端测试管理
8. **refactor-cleaner** - 死代码清理
9. **doc-updater** - 文档和 codemap 更新

**核心原则**：
- 根据任务类型选择合适的 agent
- 利用 agents 之间的协作构建高效工作流
- 复杂任务可以序列调用多个 agents
- 代码变更后务必进行 code review

## 下一课预告

> 下一课我们学习 **[TDD 开发流程](../tdd-workflow/)**。
>
> 你会学到：
> - 如何使用 `/plan` 创建实现计划
> - 如何使用 `/tdd` 执行 Red-Green-Refactor 周期
> - 如何确保 80%+ 测试覆盖率
> - 如何使用 `/verify` 运行全面验证

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Planner Agent | [agents/planner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| Architect Agent | [agents/architect.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/architect.md) | 1-212 |
| TDD Guide Agent | [agents/tdd-guide.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [agents/code-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| Security Reviewer Agent | [agents/security-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| Build Error Resolver Agent | [agents/build-error-resolver.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/build-error-resolver.md) | 1-533 |
| E2E Runner Agent | [agents/e2e-runner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/e2e-runner.md) | 1-709 |
| Refactor Cleaner Agent | [agents/refactor-cleaner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/refactor-cleaner.md) | 1-307 |
| Doc Updater Agent | [agents/doc-updater.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/doc-updater.md) | 1-453 |

**关键常量**：
- 无

**关键函数**：
- 无

</details>
