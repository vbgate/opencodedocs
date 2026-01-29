---
title: "代码审查: /code-review 流程 | Everything Claude Code"
subtitle: "代码审查: /code-review 流程"
sidebarTitle: "提交前先查查代码"
description: "学习 /code-review 命令的使用方法。掌握 code-reviewer 和 security-reviewer agent 的代码质量与安全检查，在提交前发现安全漏洞和代码问题。"
tags:
  - "code-review"
  - "security"
  - "code-quality"
  - "owasp"
prerequisite:
  - "start-quickstart"
order: 80
---

# 代码审查流程：/code-review 与安全审计

## 学完你能做什么

**代码审查**是确保代码质量和安全的关键环节。本教程帮你：

- ✅ 使用 `/code-review` 命令自动检查代码变更
- ✅ 理解 code-reviewer agent 和 security-reviewer agent 的区别
- ✅ 掌握安全检查清单（OWASP Top 10）
- ✅ 检测和修复常见安全漏洞（SQL 注入、XSS、硬编码密钥等）
- ✅ 应用代码质量标准（函数大小、文件长度、测试覆盖率等）
- ✅ 理解审批标准（CRITICAL、HIGH、MEDIUM、LOW）

## 你现在的困境

你写好了代码，准备提交，但：

- ❌ 不知道代码里有没有安全漏洞
- ❌ 担心遗漏了代码质量问题
- ❌ 不确定是否遵循了最佳实践
- ❌ 手动检查费时费力，容易遗漏
- ❌ 希望在提交前自动发现问题

**Everything Claude Code** 的代码审查流程解决这些问题：

- **自动化检查**：`/code-review` 命令自动分析所有变更
- **专业化审查**：code-reviewer agent 专注代码质量，security-reviewer agent 专注安全
- **标准分级**：问题按严重程度分类（CRITICAL、HIGH、MEDIUM、LOW）
- **详细建议**：每个问题都包含具体修复建议

## 什么时候用这一招

**每次提交代码前**都应该运行代码审查：

- ✅ 新增功能代码完成后
- ✅ 修复 bug 后
- ✅ 重构代码后
- ✅ 添加 API 端点时（必须运行 security-reviewer）
- ✅ 处理用户输入的代码（必须运行 security-reviewer）
- ✅ 涉及认证/授权的代码（必须运行 security-reviewer）

::: tip 最佳实践
养成习惯：每次 `git commit` 前，先运行 `/code-review`。如果有 CRITICAL 或 HIGH 问题，修复后再提交。
:::

## 🎒 开始前的准备

**你需要的**：
- 已安装 Everything Claude Code（如果还没安装，查看[快速开始](../../start/quickstart/)）
- 有一些代码变更（可以先用 `/tdd` 写一些代码）
- 对 Git 基本操作有了解

**你不需要的**：
- 不需要是安全专家（agent 会帮你检测）
- 不需要记住所有安全最佳实践（agent 会提醒你）

---

## 核心思路

Everything Claude Code 提供两个专业的审查 agent：

### code-reviewer agent

**专注代码质量和最佳实践**，检查：

- **代码质量**：函数大小（>50 行）、文件长度（>800 行）、嵌套深度（>4 层）
- **错误处理**：缺失 try/catch、console.log 语句
- **代码规范**：命名规范、重复代码、不可变模式
- **最佳实践**：Emoji 使用、TODO/FIXME 缺少 ticket、JSDoc 缺失
- **测试覆盖**：新代码缺少测试

**使用场景**：所有代码变更都应该经过 code-reviewer。

### security-reviewer agent

**专注安全漏洞和威胁**，检查：

- **OWASP Top 10**：SQL 注入、XSS、CSRF、认证绕过等
- **密钥泄露**：硬编码 API keys、密码、tokens
- **输入验证**：缺失或不当的用户输入验证
- **认证授权**：不当的身份验证和权限检查
- **依赖安全**：过时的或有已知漏洞的依赖包

**使用场景**：涉及安全敏感的代码（API、认证、支付、用户输入）必须经过 security-reviewer。

### 问题严重程度分级

| 级别 | 含义 | 是否阻止提交 | 示例 |
|--- | --- | --- | ---|
| **CRITICAL** | 严重安全漏洞或重大质量问题 | ❌ 必须阻止 | 硬编码 API key、SQL 注入 |
| **HIGH** | 重要安全问题或代码质量问题 | ❌ 必须阻止 | 缺少错误处理、XSS 漏洞 |
| **MEDIUM** | 中等优先级问题 | ⚠️ 可以小心提交 | Emoji 使用、缺少 JSDoc |
| **LOW** | 轻微问题 | ✓ 可以后续修复 | 格式不一致、魔法数字 |

---

## 跟我做：第一次代码审查

### 第 1 步：创建一些代码变更

先用 `/tdd` 写一个简单的 API 端点（包含一些安全隐患）：

```bash
/tdd
```

让 Claude Code 创建一个用户登录 API，代码大概这样：

```typescript
// src/api/login.ts
export async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`  // ❌ SQL 注入风险
  const user = await db.query(query)
  
  if (user.password === password) {  // ❌ 明文密码比较
    const token = generateToken(user.id)
    console.log('User logged in:', { email, password })  // ❌ 日志泄露密码
    return { token }
  }
}
```

**为什么**
这段代码包含多个安全隐患和代码质量问题，适合用来演示代码审查功能。

**你应该看到**：代码文件已创建。

---

### 第 2 步：运行代码审查

现在运行 `/code-review` 命令：

```bash
/code-review
```

**为什么**
`/code-review` 会自动调用 code-reviewer agent 检查所有未提交的变更。

**你应该看到**：agent 开始分析代码，然后输出审查报告。

---

### 第 3 步：查看审查报告

code-reviewer 会输出类似这样的报告：

```markdown
# Code Review Report

## Critical Issues (Fix Immediately)

### 1. [CRITICAL] Hardcoded credentials
**File:** src/api/login.ts:3
**Issue:** Password logging in console
**Fix:** Remove password from logs, only log user ID

```typescript
// ❌ Bad
console.log('User logged in:', { email, password })

// ✓ Good
console.log('User logged in:', { email, userId: user.id })
```

---

### 2. [CRITICAL] SQL injection vulnerability
**File:** src/api/login.ts:2
**Issue:** String concatenation in SQL query
**Fix:** Use parameterized queries

```typescript
// ❌ Bad
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✓ Good
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
```

---

## High Issues (Fix Before Production)

### 3. [HIGH] Plaintext password comparison
**File:** src/api/login.ts:4
**Issue:** Password stored in plaintext
**Fix:** Use bcrypt to hash passwords

```typescript
// ❌ Bad
if (user.password === password) {

// ✓ Good
import bcrypt from 'bcrypt'
const isValid = await bcrypt.compare(password, user.password)
```

---

## Recommendations

1. Add input validation for email format
2. Add rate limiting to prevent brute force attacks
3. Use JWT tokens instead of generating custom tokens

## Approval Status

❌ BLOCKED - 2 CRITICAL issues found

Please fix all CRITICAL and HIGH issues before committing.
```

**为什么**
报告按严重程度分类，每个问题都包含位置、描述、修复建议和代码示例。

**你应该看到**：清晰的审查报告，指出所有问题和修复建议。

---

### 第 4 步：修复问题

根据报告修复代码：

```typescript
// src/api/login.ts
import bcrypt from 'bcrypt'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function loginUser(input: unknown) {
  // 输入验证
  const validated = LoginSchema.parse(input)
  
  // 参数化查询（防止 SQL 注入）
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.email)
    .single()
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // 哈希密码比较
  const isValid = await bcrypt.compare(validated.password, user.password_hash)
  
  if (isValid) {
    const token = generateToken(user.id)
    console.log('User logged in:', { email: validated.email, userId: user.id })
    return { token }
  }
  
  throw new Error('Invalid credentials')
}
```

**为什么**
修复所有 CRITICAL 和 HIGH 问题，添加输入验证和哈希密码比较。

**你应该看到**：代码已更新，消除了安全隐患。

---

### 第 5 步：再次审查

再次运行 `/code-review`：

```bash
/code-review
```

**为什么**
验证所有问题已修复，确保代码可以提交。

**你应该看到**：类似这样的通过报告：

```markdown
# Code Review Report

## Summary

- **Critical Issues:** 0 ✓
- **High Issues:** 0 ✓
- **Medium Issues:** 1 ⚠️
- **Low Issues:** 1 💡

## Medium Issues (Fix When Possible)

### 1. [MEDIUM] Missing JSDoc for public API
**File:** src/api/login.ts:9
**Issue:** loginUser function missing documentation
**Fix:** Add JSDoc comments

```typescript
/**
 * Authenticates a user with email and password
 * @param input - Login credentials (email, password)
 * @returns Object with JWT token
 * @throws Error if credentials invalid
 */
export async function loginUser(input: unknown) {
```

---

## Low Issues (Consider Fixing)

### 2. [LOW] Add rate limiting
**File:** src/api/login.ts:9
**Issue:** Login endpoint lacks rate limiting
**Fix:** Add express-rate-limit middleware

```typescript
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per window
})

app.post('/api/login', loginLimiter, loginUser)
```

---

## Approval Status

✅ APPROVED - No CRITICAL or HIGH issues

**Note:** Medium and Low issues can be fixed in follow-up commits.
```

**你应该看到**：审查通过，代码可以提交。

---

### 第 6 步：安全专项审查（可选）

如果你的代码涉及 API 端点、认证、支付等安全敏感功能，可以专门调用 security-reviewer：

```bash
/security-reviewer
```

**为什么**
security-reviewer 会进行更深入的 OWASP Top 10 分析，检查更多安全漏洞模式。

**你应该看到**：详细的安全审查报告，包括 OWASP 分析、依赖漏洞检查、安全工具推荐等。

---

## 检查点 ✅

完成上述步骤后，你应该：

- ✅ 能够运行 `/code-review` 命令
- ✅ 理解审查报告的结构和内容
- ✅ 能够根据报告修复代码问题
- ✅ 知道 CRITICAL 和 HIGH 问题必须修复
- ✅ 理解 code-reviewer 和 security-reviewer 的区别
- ✅ 养成提交前先审查的习惯

---

## 踩坑提醒

### 常见错误 1：跳过代码审查

**问题**：觉得代码简单，直接提交，不运行审查。

**后果**：可能遗漏安全漏洞，被 CI/CD 拒绝或造成生产事故。

**正确做法**：养成习惯，每次提交前运行 `/code-review`。

---

### 常见错误 2：忽略 MEDIUM 问题

**问题**：看到 MEDIUM 问题就不管了，积累下来。

**后果**：代码质量下降，技术债累积，后续难以维护。

**正确做法**：虽然 MEDIUM 问题不阻止提交，但应该在合理时间内修复。

---

### 常见错误 3：手动修复 SQL 注入

**问题**：自己写字符串转义，而不是使用参数化查询。

**后果**：转义不完整，仍然有 SQL 注入风险。

**正确做法**：始终使用 ORM 或参数化查询，不要手动拼接 SQL。

---

### 常见错误 4：混淆两个 reviewer

**问题**：所有代码都只运行 code-reviewer，忽略 security-reviewer。

**后果**：安全漏洞可能被遗漏，特别是涉及 API、认证、支付的代码。

**正确做法**：
- 普通代码：code-reviewer 足够
- 安全敏感代码：必须同时运行 security-reviewer

---

## 本课小结

**代码审查流程**是 Everything Claude Code 的核心功能之一：

| 功能 | agent | 检查内容 | 严重程度 |
|--- | --- | --- | ---|
| **代码质量审查** | code-reviewer | 函数大小、错误处理、最佳实践 | HIGH/MEDIUM/LOW |
| **安全审查** | security-reviewer | OWASP Top 10、密钥泄露、注入漏洞 | CRITICAL/HIGH/MEDIUM |

**关键要点**：

1. **每次提交前**运行 `/code-review`
2. **CRITICAL/HIGH 问题**必须修复才能提交
3. **安全敏感代码**必须经过 security-reviewer
4. **审查报告**包含详细位置和修复建议
5. **养成习惯**：审查 → 修复 → 再次审查 → 提交

---

## 下一课预告

> 下一课我们学习 **[Hooks 自动化](../../advanced/hooks-automation/)**。
>
> 你会学到：
> - Hooks 是什么，如何自动化开发流程
> - 15+ 个自动化钩子的使用方法
> - 如何自定义 Hooks 适应项目需求
> - SessionStart、SessionEnd、PreToolUse 等钩子的应用场景

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**关键常量**：
- 函数大小限制：50 行（code-reviewer.md:47）
- 文件大小限制：800 行（code-reviewer.md:48）
- 嵌套深度限制：4 层（code-reviewer.md:49）

**关键函数**：
- `/code-review`：调用 code-reviewer agent 进行代码质量审查
- `/security-reviewer`：调用 security-reviewer agent 进行安全审计
- `git diff --name-only HEAD`：获取未提交的变更文件（code-review.md:5）

**审批标准**（code-reviewer.md:90-92）：
- ✅ Approve: No CRITICAL or HIGH issues
- ⚠️ Warning: MEDIUM issues only (can merge with caution)
- ❌ Block: CRITICAL or HIGH issues found

</details>
