---
title: "程式碼審查: /code-review 流程 | Everything Claude Code"
subtitle: "程式碼審查: /code-review 流程"
sidebarTitle: "提交前先查查程式碼"
description: "學習 /code-review 指令的使用方法。掌握 code-reviewer 和 security-reviewer agent 的程式碼品質與安全檢查，在提交前發現安全漏洞和程式碼問題。"
tags:
  - "code-review"
  - "security"
  - "code-quality"
  - "owasp"
prerequisite:
  - "start-quickstart"
order: 80
---

# 程式碼審查流程：/code-review 與安全稽核

## 學完你能做什麼

**程式碼審查**是確保程式碼品質和安全的關鍵環節。本教程幫你：

- ✅ 使用 `/code-review` 指令自動檢查程式碼變更
- ✅ 理解 code-reviewer agent 和 security-reviewer agent 的區別
- ✅ 掌握安全檢查清單（OWASP Top 10）
- ✅ 檢測和修復常見安全漏洞（SQL 注入、XSS、硬編碼金鑰等）
- ✅ 應用程式碼品質標準（函式大小、檔案長度、測試覆蓋率等）
- ✅ 理解審批標準（CRITICAL、HIGH、MEDIUM、LOW）

## 你現在的困境

你寫好了程式碼，準備提交，但：

- ❌ 不知道程式碼裡有沒有安全漏洞
- ❌ 擔心遺漏了程式碼品質問題
- ❌ 不確定是否遵循了最佳實踐
- ❌ 手動檢查費時費力，容易遺漏
- ❌ 希望在提交前自動發現問題

**Everything Claude Code** 的程式碼審查流程解決這些問題：

- **自動化檢查**：`/code-review` 指令自動分析所有變更
- **專業化審查**：code-reviewer agent 專注程式碼品質，security-reviewer agent 專注安全
- **標準分級**：問題按嚴重程度分類（CRITICAL、HIGH、MEDIUM、LOW）
- **詳細建議**：每個問題都包含具體修復建議

## 什麼時候用這一招

**每次提交程式碼前**都應該執行程式碼審查：

- ✅ 新增功能程式碼完成後
- ✅ 修復 bug 後
- ✅ 重構程式碼後
- ✅ 新增 API 端點時（必須執行 security-reviewer）
- ✅ 處理使用者輸入的程式碼（必須執行 security-reviewer）
- ✅ 涉及認證/授權的程式碼（必須執行 security-reviewer）

::: tip 最佳實踐
養成習慣：每次 `git commit` 前，先執行 `/code-review`。如果有 CRITICAL 或 HIGH 問題，修復後再提交。
:::

## 🎒 開始前的準備

**你需要的**：
- 已安裝 Everything Claude Code（如果還沒安裝，查看[快速開始](../../start/quickstart/)）
- 有一些程式碼變更（可以先用 `/tdd` 寫一些程式碼）
- 對 Git 基本操作有了解

**你不需要的**：
- 不需要是安全專家（agent 會幫你檢測）
- 不需要記住所有安全最佳實踐（agent 會提醒你）

---

## 核心思路

Everything Claude Code 提供兩個專業的審查 agent：

### code-reviewer agent

**專注程式碼品質和最佳實踐**，檢查：

- **程式碼品質**：函式大小（>50 行）、檔案長度（>800 行）、巢狀深度（>4 層）
- **錯誤處理**：缺失 try/catch、console.log 陳述式
- **程式碼規範**：命名規範、重複程式碼、不可變模式
- **最佳實踐**：Emoji 使用、TODO/FIXME 缺少 ticket、JSDoc 缺失
- **測試覆蓋**：新程式碼缺少測試

**使用場景**：所有程式碼變更都應該經過 code-reviewer。

### security-reviewer agent

**專注安全漏洞和威脅**，檢查：

- **OWASP Top 10**：SQL 注入、XSS、CSRF、認證繞過等
- **金鑰洩露**：硬編碼 API keys、密碼、tokens
- **輸入驗證**：缺失或不當的使用者輸入驗證
- **認證授權**：不當的身分驗證和權限檢查
- **依賴安全**：過時的或有已知漏洞的依賴套件

**使用場景**：涉及安全敏感的程式碼（API、認證、支付、使用者輸入）必須經過 security-reviewer。

### 問題嚴重程度分級

| 級別 | 含義 | 是否阻止提交 | 示例 |
| --- | --- | --- | --- |
| **CRITICAL** | 嚴重安全漏洞或重大品質問題 | ❌ 必須阻止 | 硬編碼 API key、SQL 注入 |
| **HIGH** | 重要安全問題或程式碼品質問題 | ❌ 必須阻止 | 缺少錯誤處理、XSS 漏洞 |
| **MEDIUM** | 中等優先級問題 | ⚠️ 可以小心提交 | Emoji 使用、缺少 JSDoc |
| **LOW** | 輕微問題 | ✓ 可以後續修復 | 格式不一致、魔法數字 |

---

## 跟我做：第一次程式碼審查

### 第 1 步：建立一些程式碼變更

先用 `/tdd` 寫一個簡單的 API 端點（包含一些安全隱患）：

```bash
/tdd
```

讓 Claude Code 建立一個使用者登入 API，程式碼大概這樣：

```typescript
// src/api/login.ts
export async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`  // ❌ SQL 注入風險
  const user = await db.query(query)
  
  if (user.password === password) {  // ❌ 明文密碼比較
    const token = generateToken(user.id)
    console.log('User logged in:', { email, password })  // ❌ 日誌洩露密碼
    return { token }
  }
}
```

**為什麼**
這段程式碼包含多個安全隱患和程式碼品質問題，適合用來示範程式碼審查功能。

**你應該看到**：程式碼檔案已建立。

---

### 第 2 步：執行程式碼審查

現在執行 `/code-review` 指令：

```bash
/code-review
```

**為什麼**
`/code-review` 會自動呼叫 code-reviewer agent 檢查所有未提交的變更。

**你應該看到**：agent 開始分析程式碼，然後輸出審查報告。

---

### 第 3 步：查看審查報告

code-reviewer 會輸出類似這樣的報告：

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

**為什麼**
報告按嚴重程度分類，每個問題都包含位置、描述、修復建議和程式碼範例。

**你應該看到**：清晰的審查報告，指出所有問題和修復建議。

---

### 第 4 步：修復問題

根據報告修復程式碼：

```typescript
// src/api/login.ts
import bcrypt from 'bcrypt'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function loginUser(input: unknown) {
  // 輸入驗證
  const validated = LoginSchema.parse(input)
  
  // 參數化查詢（防止 SQL 注入）
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.email)
    .single()
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // 雜湊密碼比較
  const isValid = await bcrypt.compare(validated.password, user.password_hash)
  
  if (isValid) {
    const token = generateToken(user.id)
    console.log('User logged in:', { email: validated.email, userId: user.id })
    return { token }
  }
  
  throw new Error('Invalid credentials')
}
```

**為什麼**
修復所有 CRITICAL 和 HIGH 問題，新增輸入驗證和雜湊密碼比較。

**你應該看到**：程式碼已更新，消除了安全隱患。

---

### 第 5 步：再次審查

再次執行 `/code-review`：

```bash
/code-review
```

**為什麼**
驗證所有問題已修復，確保程式碼可以提交。

**你應該看到**：類似這樣的通過報告：

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

**你應該看到**：審查通過，程式碼可以提交。

---

### 第 6 步：安全專項審查（可選）

如果你的程式碼涉及 API 端點、認證、支付等安全敏感功能，可以專門呼叫 security-reviewer：

```bash
/security-reviewer
```

**為什麼**
security-reviewer 會進行更深入的 OWASP Top 10 分析，檢查更多安全漏洞模式。

**你應該看到**：詳細的安全審查報告，包括 OWASP 分析、依賴漏洞檢查、安全工具推薦等。

---

## 檢查點 ✅

完成上述步驟後，你應該：

- ✅ 能夠執行 `/code-review` 指令
- ✅ 理解審查報告的結構和內容
- ✅ 能夠根據報告修復程式碼問題
- ✅ 知道 CRITICAL 和 HIGH 問題必須修復
- ✅ 理解 code-reviewer 和 security-reviewer 的區別
- ✅ 養成提交前先審查的習慣

---

## 踩坑提醒

### 常見錯誤 1：跳過程式碼審查

**問題**：覺得程式碼簡單，直接提交，不執行審查。

**後果**：可能遺漏安全漏洞，被 CI/CD 拒絕或造成生產事故。

**正確做法**：養成習慣，每次提交前執行 `/code-review`。

---

### 常見錯誤 2：忽略 MEDIUM 問題

**問題**：看到 MEDIUM 問題就不管了，累積下來。

**後果**：程式碼品質下降，技術債累積，後續難以維護。

**正確做法**：雖然 MEDIUM 問題不阻止提交，但應該在合理時間內修復。

---

### 常見錯誤 3：手動修復 SQL 注入

**問題**：自己寫字串跳脫，而不是使用參數化查詢。

**後果**：跳脫不完整，仍然有 SQL 注入風險。

**正確做法**：始終使用 ORM 或參數化查詢，不要手動拼接 SQL。

---

### 常見錯誤 4：混淆兩個 reviewer

**問題**：所有程式碼都只執行 code-reviewer，忽略 security-reviewer。

**後果**：安全漏洞可能被遺漏，特別是涉及 API、認證、支付的程式碼。

**正確做法**：
- 普通程式碼：code-reviewer 足夠
- 安全敏感程式碼：必須同時執行 security-reviewer

---

## 本課小結

**程式碼審查流程**是 Everything Claude Code 的核心功能之一：

| 功能 | agent | 檢查內容 | 嚴重程度 |
| --- | --- | --- | --- |
| **程式碼品質審查** | code-reviewer | 函式大小、錯誤處理、最佳實踐 | HIGH/MEDIUM/LOW |
| **安全審查** | security-reviewer | OWASP Top 10、金鑰洩露、注入漏洞 | CRITICAL/HIGH/MEDIUM |

**關鍵要點**：

1. **每次提交前**執行 `/code-review`
2. **CRITICAL/HIGH 問題**必須修復才能提交
3. **安全敏感程式碼**必須經過 security-reviewer
4. **審查報告**包含詳細位置和修復建議
5. **養成習慣**：審查 → 修復 → 再次審查 → 提交

---

## 下一課預告

> 下一課我們學習 **[Hooks 自動化](../../advanced/hooks-automation/)**。
>
> 你會學到：
> - Hooks 是什麼，如何自動化開發流程
> - 15+ 個自動化鉤子的使用方法
> - 如何自訂 Hooks 適應專案需求
> - SessionStart、SessionEnd、PreToolUse 等鉤子的應用場景

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**關鍵常數**：
- 函式大小限制：50 行（code-reviewer.md:47）
- 檔案大小限制：800 行（code-reviewer.md:48）
- 巢狀深度限制：4 層（code-reviewer.md:49）

**關鍵函式**：
- `/code-review`：呼叫 code-reviewer agent 進行程式碼品質審查
- `/security-reviewer`：呼叫 security-reviewer agent 進行安全稽核
- `git diff --name-only HEAD`：取得未提交的變更檔案（code-review.md:5）

**審批標準**（code-reviewer.md:90-92）：
- ✅ Approve: No CRITICAL or HIGH issues
- ⚠️ Warning: MEDIUM issues only (can merge with caution)
- ❌ Block: CRITICAL or HIGH issues found

</details>
