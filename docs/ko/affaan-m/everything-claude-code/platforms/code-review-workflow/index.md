---
title: "코드 리뷰: /code-review 프로세스 | Everything Claude Code"
subtitle: "코드 리뷰: /code-review 프로세스"
sidebarTitle: "커밋하기 전 코드 확인하기"
description: "/code-review 명령어 사용 방법을 배웁니다. code-reviewer와 security-reviewer agent의 코드 품질 및 보안 검사를 익혀 커밋 전 보안 취약점과 코드 문제를 발견하세요."
tags:
  - "code-review"
  - "security"
  - "code-quality"
  - "owasp"
prerequisite:
  - "start-quickstart"
order: 80
---

# 코드 리뷰 프로세스: /code-review와 보안 감사

## 배우게 될 내용

**코드 리뷰**는 코드 품질과 보안을 보장하는 핵심 단계입니다. 이 튜토리얼에서는 다음을 배울 수 있습니다:

- ✅ `/code-review` 명령어를 사용하여 코드 변경 사항을 자동으로 검사하기
- ✅ code-reviewer agent와 security-reviewer agent의 차이점 이해하기
- ✅ 보안 검사 체크리스트(OWASP Top 10) 활용하기
- ✅ 일반적인 보안 취약점(SQL 인젝션, XSS, 하드코딩된 키 등) 탐지 및 수정하기
- ✅ 코드 품질 표준(함수 크기, 파일 길이, 테스트 커버리지 등) 적용하기
- ✅ 승인 기준(CRITICAL, HIGH, MEDIUM, LOW) 이해하기

## 현재 겪고 있는 문제

코드를 작성하고 커밋하려고 하는데:

- ❌ 코드에 보안 취약점이 있는지 모릅니다
- ❌ 코드 품질 문제를 놓치는 것이 걱정됩니다
- ❌ 최적의 실천 방법을 따르고 있는지 확신이 없습니다
- ❌ 수동 검사는 시간이 오래 걸리고 쉽게 놓치게 됩니다
- ❌ 커밋 전에 문제를 자동으로 발견하고 싶습니다

**Everything Claude Code**의 코드 리뷰 프로세스가 이러한 문제를 해결합니다:

- **자동화된 검사**: `/code-review` 명령어가 모든 변경 사항을 자동으로 분석합니다
- **전문화된 리뷰**: code-reviewer agent는 코드 품질에 집중하고, security-reviewer agent는 보안에 집중합니다
- **표준 분류**: 문제는 심각도에 따라 분류됩니다(CRITICAL, HIGH, MEDIUM, LOW)
- **상세한 제안**: 각 문제에는 구체적인 수정 제안이 포함됩니다

## 이 기능을 사용할 때

**코드를 커밋할 때마다** 코드 리뷰를 실행해야 합니다:

- ✅ 새로운 기능 코드 작성 완료 후
- ✅ 버그 수정 후
- ✅ 코드 리팩토링 후
- ✅ API 엔드포인트 추가 시(security-reviewer 필수 실행)
- ✅ 사용자 입력을 처리하는 코드(security-reviewer 필수 실행)
- ✅ 인증/인가와 관련된 코드(security-reviewer 필수 실행)

::: tip 모범 사례
습관을 들이세요: `git commit` 전에 항상 `/code-review`를 실행하세요. CRITICAL 또는 HIGH 문제가 있는 경우 수정 후 커밋하세요.
:::

## 🎒 시작하기 전 준비사항

**필요한 것**:
- Everything Claude Code가 설치되어 있음(아직 설치하지 않았다면 [빠른 시작](../../start/quickstart/) 참조)
- 일부 코드 변경 사항(먼저 `/tdd`로 코드 작성 가능)
- Git 기본 작업에 대한 이해

**필요하지 않은 것**:
- 보안 전문가일 필요 없음(agent가 탐지해 드립니다)
- 모든 보안 모범 사례를 기억할 필요 없음(agent가 알려드립니다)

---

## 핵심 개념

Everything Claude Code는 두 가지 전문 리뷰 agent를 제공합니다:

### code-reviewer agent

**코드 품질과 모범 사례에 집중**, 다음을 검사합니다:

- **코드 품질**: 함수 크기(50줄 이상), 파일 길이(800줄 이상), 중첩 깊이(4레벨 이상)
- **오류 처리**: 누락된 try/catch, console.log 문
- **코드 규격**: 명명 규칙, 중복 코드, 불변 패턴
- **모범 사례**: 이모지 사용, ticket 없는 TODO/FIXME, 누락된 JSDoc
- **테스트 커버리지**: 새 코드에 테스트 누락

**사용 시나리오**: 모든 코드 변경 사항은 code-reviewer를 거쳐야 합니다.

### security-reviewer agent

**보안 취약점과 위협에 집중**, 다음을 검사합니다:

- **OWASP Top 10**: SQL 인젝션, XSS, CSRF, 인증 우회 등
- **키 노출**: 하드코딩된 API 키, 비밀번호, 토큰
- **입력 검증**: 누락되거나 부적절한 사용자 입력 검증
- **인증 인가**: 부적절한 인증 및 권한 검사
- **의존성 보안**: 오래되거나 알려진 취약점이 있는 의존성 패키지

**사용 시나리오**: 보안에 민감한 코드(API, 인증, 결제, 사용자 입력)는 security-reviewer를 거쳐야 합니다.

### 문제 심각도 등급

| 레벨 | 의미 | 커밋 차단 여부 | 예시 |
| --- | --- | --- | --- |
| **CRITICAL** | 심각한 보안 취약점 또는 주요 품질 문제 | ❌ 반드시 차단 | 하드코딩된 API 키, SQL 인젝션 |
| **HIGH** | 중요한 보안 문제 또는 코드 품질 문제 | ❌ 반드시 차단 | 오류 처리 누락, XSS 취약점 |
| **MEDIUM** | 중간 우선순위 문제 | ⚠️ 주의하여 커밋 가능 | 이모지 사용, JSDoc 누락 |
| **LOW** | 경미한 문제 | ✓ 나중에 수정 가능 | 형식 불일치, 매직 넘버 |

---

## 따라하기: 첫 번째 코드 리뷰

### 1단계: 코드 변경 사항 생성하기

먼저 `/tdd`로 간단한 API 엔드포인트를 작성합니다(일부 보안 문제 포함):

```bash
/tdd
```

Claude Code에 사용자 로그인 API를 만들도록 요청하면, 다음과 같은 코드가 생성됩니다:

```typescript
// src/api/login.ts
export async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`  // ❌ SQL 인젝션 위험
  const user = await db.query(query)
  
  if (user.password === password) {  // ❌ 평문 비밀번호 비교
    const token = generateToken(user.id)
    console.log('User logged in:', { email, password })  // ❌ 로그에 비밀번호 유출
    return { token }
  }
}
```

**이유**
이 코드에는 여러 보안 취약점과 코드 품질 문제가 있어 코드 리뷰 기능을 시연하기에 적합합니다.

**확인할 것**: 코드 파일이 생성되었습니다.

---

### 2단계: 코드 리뷰 실행하기

이제 `/code-review` 명령어를 실행합니다:

```bash
/code-review
```

**이유**
`/code-review`는 자동으로 code-reviewer agent를 호출하여 커밋되지 않은 모든 변경 사항을 검사합니다.

**확인할 것**: agent가 코드를 분석한 후 리뷰 보고서를 출력합니다.

---

### 3단계: 리뷰 보고서 확인하기

code-reviewer는 다음과 유사한 보고서를 출력합니다:

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

**이유**
보고서는 심각도에 따라 분류되며, 각 문제에는 위치, 설명, 수정 제안 및 코드 예시가 포함됩니다.

**확인할 것**: 모든 문제와 수정 제안을 지적하는 명확한 리뷰 보고서입니다.

---

### 4단계: 문제 수정하기

보고서에 따라 코드를 수정합니다:

```typescript
// src/api/login.ts
import bcrypt from 'bcrypt'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function loginUser(input: unknown) {
  // 입력 검증
  const validated = LoginSchema.parse(input)
  
  // 파라미터화된 쿼리(SQL 인젝션 방지)
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.email)
    .single()
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // 해시된 비밀번호 비교
  const isValid = await bcrypt.compare(validated.password, user.password_hash)
  
  if (isValid) {
    const token = generateToken(user.id)
    console.log('User logged in:', { email: validated.email, userId: user.id })
    return { token }
  }
  
  throw new Error('Invalid credentials')
}
```

**이유**
모든 CRITICAL 및 HIGH 문제를 수정하고, 입력 검증과 해시된 비밀번호 비교를 추가합니다.

**확인할 것**: 코드가 업데이트되어 보안 취약점이 제거되었습니다.

---

### 5단계: 다시 리뷰하기

`/code-review`를 다시 실행합니다:

```bash
/code-review
```

**이유**
모든 문제가 수정되었는지 확인하고 코드를 커밋할 수 있는지 확인합니다.

**확인할 것**: 다음과 유사한 통과 보고서입니다:

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

**확인할 것**: 리뷰가 통과되어 코드를 커밋할 수 있습니다.

---

### 6단계: 보안 전문 리뷰(선택사항)

코드가 API 엔드포인트, 인증, 결제 등 보안에 민감한 기능을 포함하는 경우, security-reviewer를 특별히 호출할 수 있습니다:

```bash
/security-reviewer
```

**이유**
security-reviewer는 더 깊은 OWASP Top 10 분석을 수행하여 더 많은 보안 취약점 패턴을 검사합니다.

**확인할 것**: OWASP 분석, 의존성 취약점 검사, 보안 도구 권장 사항 등이 포함된 상세한 보안 리뷰 보고서입니다.

---

## 체크포인트 ✅

위 단계를 완료하면 다음을 할 수 있어야 합니다:

- ✅ `/code-review` 명령어를 실행할 수 있습니다
- ✅ 리뷰 보고서의 구조와 내용을 이해합니다
- ✅ 보고서에 따라 코드 문제를 수정할 수 있습니다
- ✅ CRITICAL 및 HIGH 문제는 반드시 수정해야 한다는 것을 알고 있습니다
- ✅ code-reviewer와 security-reviewer의 차이점을 이해합니다
- ✅ 커밋하기 전에 리뷰하는 습관이 있습니다

---

## 주의사항

### 일반적인 실수 1: 코드 리뷰 건 뛰기

**문제**: 코드가 간단하다고 생각하여 리뷰 없이 바로 커밋합니다.

**결과**: 보안 취약점을 놓칠 수 있어 CI/CD에서 거부되거나 프로덕션 사고가 발생할 수 있습니다.

**올바른 방법**: 습관적으로 커밋 전에 `/code-review`를 실행하세요.

---

### 일반적인 실수 2: MEDIUM 문제 무시하기

**문제**: MEDIUM 문제를 보고 무시하여 쌓아둡니다.

**결과**: 코드 품질이 저하되고 기술 부채가 쌓여 나중에 유지보수가 어려워집니다.

**올바른 방법**: MEDIUM 문제가 커밋을 차단하지는 않지만, 합리적인 시간 내에 수정해야 합니다.

---

### 일반적인 실수 3: SQL 인젝션을 수동으로 수정하기

**문제**: 파라미터화된 쿼리를 사용하는 대신 직접 문자열 이스케이프를 작성합니다.

**결과**: 이스케이프가 완전하지 않아 여전히 SQL 인젝션 위험이 있습니다.

**올바른 방법**: 항상 ORM 또는 파라미터화된 쿼리를 사용하고, SQL을 수동으로 연결하지 마세요.

---

### 일반적인 실수 4: 두 리뷰어를 혼동하기

**문제**: 모든 코드에 code-reviewer만 실행하고 security-reviewer를 무시합니다.

**결과**: API, 인증, 결제 관련 코드에서 보안 취약점이 누락될 수 있습니다.

**올바른 방법**:
- 일반 코드: code-reviewer만으로 충분함
- 보안에 민감한 코드: security-reviewer도 반드시 실행해야 함

---

## 강의 요약

**코드 리뷰 프로세스**는 Everything Claude Code의 핵심 기능 중 하나입니다:

| 기능 | agent | 검사 내용 | 심각도 |
| --- | --- | --- | --- |
| **코드 품질 리뷰** | code-reviewer | 함수 크기, 오류 처리, 모범 사례 | HIGH/MEDIUM/LOW |
| **보안 리뷰** | security-reviewer | OWASP Top 10, 키 유출, 인젝션 취약점 | CRITICAL/HIGH/MEDIUM |

**핵심 요점**:

1. **커밋할 때마다** `/code-review` 실행하기
2. **CRITICAL/HIGH 문제**는 커밋 전에 반드시 수정해야 함
3. **보안에 민감한 코드**는 security-reviewer를 거쳐야 함
4. **리뷰 보고서**에는 상세한 위치와 수정 제안이 포함됨
5. **습관 들이기**: 리뷰 → 수정 → 다시 리뷰 → 커밋

---

## 다음 강의 예고

> 다음 강의에서는 **[Hooks 자동화](../../advanced/hooks-automation/)**를 배웁니다.
>
> 배울 내용:
> - Hooks란 무엇이며 개발 프로세스를 자동화하는 방법
> - 15개 이상의 자동화된 Hook 사용 방법
> - 프로젝트 요구사항에 맞게 Hooks를 사용자 정의하는 방법
> - SessionStart, SessionEnd, PreToolUse 등의 Hook 사용 사례

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-25

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**주요 상수**:
- 함수 크기 제한: 50줄(code-reviewer.md:47)
- 파일 크기 제한: 800줄(code-reviewer.md:48)
- 중첩 깊이 제한: 4레벨(code-reviewer.md:49)

**주요 함수**:
- `/code-review`: code-reviewer agent를 호출하여 코드 품질 리뷰 수행
- `/security-reviewer`: security-reviewer agent를 호출하여 보안 감사 수행
- `git diff --name-only HEAD`: 커밋되지 않은 변경 파일 가져오기(code-review.md:5)

**승인 기준**(code-reviewer.md:90-92):
- ✅ Approve: CRITICAL 또는 HIGH 문제 없음
- ⚠️ Warning: MEDIUM 문제만 있음(주의하여 머지 가능)
- ❌ Block: CRITICAL 또는 HIGH 문제 발견

</details>
