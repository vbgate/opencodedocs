---
title: "Agents: 9개의 전문화된 에이전트 | Everything Claude Code"
sidebarTitle: "적합한 Agent로 효율 2배"
subtitle: "Agents: 9개의 전문화된 에이전트 | Everything Claude Code"
description: "Everything Claude Code의 9개 전문화된 에이전트를 학습하고, 다양한 시나리오에서의 호출 방법을 마스터하여 AI 보조 개발의 효율성과 품질을 향상시키세요."
tags:
  - "agents"
  - "ai-assistant"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 60
---

# 핵심 Agents 상세 설명: 9개의 전문화된 서브 에이전트

## 학습 후 할 수 있는 것

- 9개 전문화된 에이전트의 역할과 사용 시나리오 이해
- 다양한 개발 작업에서 어떤 에이전트를 호출해야 하는지 파악
- 에이전트 간 협업 방식을 마스터하여 효율적인 개발 워크플로우 구축
- "범용 AI"의 한계를 피하고 전문화된 에이전트를 활용하여 효율성 향상

## 현재 겪고 있는 어려움

- Claude에게 작업을 요청하지만 응답이 충분히 전문적이거나 심층적이지 않음
- /plan, /tdd, /code-review 등의 명령을 언제 사용해야 하는지 불확실함
- AI가 제공하는 조언이 너무 일반적이고 구체성이 부족함
- 체계적인 개발 워크플로우를 원하지만 어떻게 구성해야 할지 모름

## 이 방법이 필요한 시점

다음 작업을 수행해야 할 때 이 튜토리얼이 도움이 됩니다:
- 복잡한 기능 개발 전 계획 수립
- 새로운 기능 작성 또는 버그 수정
- 코드 리뷰 및 보안 감사
- 빌드 오류 수정
- 엔드투엔드 테스트
- 코드 리팩토링 및 정리
- 문서 업데이트

## 핵심 개념

Everything Claude Code는 9개의 전문화된 에이전트를 제공하며, 각 에이전트는 특정 영역에 집중합니다. 실제 팀에서 다른 역할의 전문가를 찾는 것처럼, 다른 개발 작업에는 다른 에이전트를 호출해야 합니다.

::: info Agent vs Command
- **Agent**: 특정 영역의 지식과 도구를 가진 전문 AI 어시스턴트
- **Command**: 에이전트를 빠르게 호출하거나 특정 작업을 실행하기 위한 단축키

예: `/tdd` 명령은 `tdd-guide` 에이전트를 호출하여 테스트 주도 개발 프로세스를 실행합니다.
:::

### 9개 Agents 개요

| Agent | 역할 | 대표적인 시나리오 | 핵심 능력 |
| --- | --- | --- | --- |
| **planner** | 계획 전문가 | 복잡한 기능 개발 전 계획 수립 | 요구사항 분석, 아키텍처 검토, 단계 분해 |
| **architect** | 아키텍트 | 시스템 설계 및 기술 결정 | 아키텍처 평가, 패턴 추천, 트레이드오프 분석 |
| **tdd-guide** | TDD 멘토 | 테스트 작성 및 기능 구현 | Red-Green-Refactor 프로세스, 커버리지 보장 |
| **code-reviewer** | 코드 리뷰어 | 코드 품질 검토 | 품질, 보안, 유지보수성 검사 |
| **security-reviewer** | 보안 감사자 | 보안 취약점 탐지 | OWASP Top 10, 키 유출, 인젝션 방어 |
| **build-error-resolver** | 빌드 오류 해결사 | TypeScript/빌드 오류 수정 | 최소화된 수정, 타입 추론 |
| **e2e-runner** | E2E 테스트 전문가 | 엔드투엔드 테스트 관리 | Playwright 테스트, flaky 관리, artifact |
| **refactor-cleaner** | 리팩토링 정리사 | 데드 코드 및 중복 제거 | 의존성 분석, 안전한 삭제, 문서화 |
| **doc-updater** | 문서 업데이트 담당자 | 문서 생성 및 업데이트 | codemap 생성, AST 분석 |

## 상세 설명

### 1. Planner - 계획 전문가

**사용 시점**: 복잡한 기능 구현, 아키텍처 변경 또는 대규모 리팩토링이 필요할 때.

::: tip 모범 사례
코드 작성을 시작하기 전에 `/plan`을 사용하여 구현 계획을 만드세요. 이를 통해 의존성 누락을 방지하고, 잠재적 위험을 발견하며, 합리적인 구현 순서를 수립할 수 있습니다.
:::

**핵심 능력**:
- 요구사항 분석 및 명확화
- 아키텍처 검토 및 의존성 식별
- 상세한 구현 단계 분해
- 위험 식별 및 완화 방안
- 테스트 전략 계획

**출력 형식**:
```markdown
# Implementation Plan: [Feature Name]

## Overview
[2-3문장 요약]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Architecture Changes
- [Change 1: 파일 경로 및 설명]
- [Change 2: 파일 경로 및 설명]

## Implementation Steps

### Phase 1: [Phase Name]
1. **[Step Name]** (File: path/to/file.ts)
   - Action: 구체적인 작업
   - Why: 이유
   - Dependencies: None / Requires step X
   - Risk: Low/Medium/High

## Testing Strategy
- Unit tests: [테스트할 파일]
- Integration tests: [테스트할 프로세스]
- E2E tests: [테스트할 사용자 여정]

## Risks & Mitigations
- **Risk**: [설명]
  - Mitigation: [해결 방법]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

**예시 시나리오**:
- 새로운 API 엔드포인트 추가 (데이터베이스 마이그레이션, 캐시 업데이트, 문서 필요)
- 핵심 모듈 리팩토링 (여러 의존성에 영향)
- 새로운 기능 추가 (프론트엔드, 백엔드, 데이터베이스 관련)

### 2. Architect - 아키텍트

**사용 시점**: 시스템 아키텍처 설계, 기술 방안 평가, 아키텍처 결정이 필요할 때.

**핵심 능력**:
- 시스템 아키텍처 설계
- 기술 트레이드오프 분석
- 디자인 패턴 추천
- 확장성 계획
- 보안 고려사항

**아키텍처 원칙**:
- **모듈화**: 단일 책임, 높은 응집도와 낮은 결합도
- **확장성**: 수평 확장, 무상태 설계
- **유지보수성**: 명확한 구조, 일관된 패턴
- **보안**: 심층 방어, 최소 권한
- **성능**: 효율적인 알고리즘, 최소 네트워크 요청

**일반적인 패턴**:

**프론트엔드 패턴**:
- 컴포넌트 합성, Container/Presenter 패턴, 커스텀 Hooks, Context 전역 상태, 코드 분할

**백엔드 패턴**:
- Repository 패턴, Service 레이어, 미들웨어 패턴, 이벤트 기반 아키텍처, CQRS

**데이터 패턴**:
- 정규화된 데이터베이스, 읽기 성능을 위한 비정규화, 이벤트 소싱, 캐시 레이어, 최종 일관성

**아키텍처 결정 기록 (ADR) 형식**:
```markdown
# ADR-001: 시맨틱 검색 벡터 저장에 Redis 사용

## Context
시맨틱 마켓 검색을 위해 1536차원 임베딩 벡터를 저장하고 쿼리해야 함.

## Decision
Redis Stack의 벡터 검색 기능 사용.

## Consequences

### Positive
- 빠른 벡터 유사도 검색 (<10ms)
- 내장 KNN 알고리즘
- 간단한 배포
- 우수한 성능 (10K 벡터까지)

### Negative
- 메모리 저장 (대규모 데이터셋에서 비용 높음)
- 단일 장애점 (클러스터 없음)
- 코사인 유사도만 지원

### Alternatives Considered
- **PostgreSQL pgvector**: 더 느리지만 영구 저장
- **Pinecone**: 관리형 서비스, 비용 더 높음
- **Weaviate**: 더 많은 기능, 설정 더 복잡

## Status
Accepted

## Date
2025-01-15
```

### 3. TDD Guide - TDD 멘토

**사용 시점**: 새로운 기능 작성, 버그 수정, 코드 리팩토링 시.

::: warning 핵심 원칙
TDD Guide는 모든 코드가 **테스트를 먼저 작성**한 후 기능을 구현하도록 요구하며, 80% 이상의 테스트 커버리지를 보장합니다.
:::

**TDD 워크플로우**:

**Step 1: 테스트 먼저 작성 (RED)**
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

**Step 2: 테스트 실행 (실패 확인)**
```bash
npm test
# Test should fail - we haven't implemented yet
```

**Step 3: 최소 구현 작성 (GREEN)**
```typescript
export async function searchMarkets(query: string) {
  const embedding = await generateEmbedding(query)
  const results = await vectorSearch(embedding)
  return results
}
```

**Step 4: 테스트 실행 (통과 확인)**
```bash
npm test
# Test should now pass
```

**Step 5: 리팩토링 (IMPROVE)**
- 중복 코드 제거
- 네이밍 개선
- 성능 최적화
- 가독성 향상

**Step 6: 커버리지 확인**
```bash
npm run test:coverage
# Verify 80%+ coverage
```

**필수 작성 테스트 유형**:

1. **단위 테스트** (필수): 독립 함수 테스트
2. **통합 테스트** (필수): API 엔드포인트 및 데이터베이스 작업 테스트
3. **E2E 테스트** (핵심 플로우): 완전한 사용자 여정 테스트

**필수 커버 엣지 케이스**:
- Null/Undefined: 입력이 null이면 어떻게 되는가?
- 빈 값: 배열/문자열이 비어있으면 어떻게 되는가?
- 잘못된 타입: 잘못된 타입이 전달되면 어떻게 되는가?
- 경계값: 최소/최대 값
- 오류: 네트워크 실패, 데이터베이스 오류
- 경쟁 조건: 동시 작업
- 대용량 데이터: 10k+ 항목의 성능
- 특수 문자: Unicode, emoji, SQL 문자

### 4. Code Reviewer - 코드 리뷰어

**사용 시점**: 코드 작성 또는 수정 후 즉시 리뷰 수행.

::: tip 필수 사용
Code Reviewer는 **필수** 에이전트이며, 모든 코드 변경은 이 에이전트의 리뷰를 거쳐야 합니다.
:::

**리뷰 체크리스트**:

**보안 검사 (CRITICAL)**:
- 하드코딩된 자격 증명 (API keys, 비밀번호, tokens)
- SQL 인젝션 위험 (쿼리에서 문자열 연결)
- XSS 취약점 (이스케이프되지 않은 사용자 입력)
- 누락된 입력 검증
- 안전하지 않은 의존성 (오래되거나 취약한)
- 경로 탐색 위험 (사용자 제어 파일 경로)
- CSRF 취약점
- 인증 우회

**코드 품질 (HIGH)**:
- 큰 함수 (>50줄)
- 큰 파일 (>800줄)
- 깊은 중첩 (>4레벨)
- 누락된 오류 처리 (try/catch)
- console.log 문
- 변경 패턴
- 새 코드에 테스트 누락

**성능 (MEDIUM)**:
- 비효율적인 알고리즘 (O(n log n)이 가능할 때 O(n²))
- React에서 불필요한 리렌더링
- 누락된 memoization
- 큰 번들 크기
- 최적화되지 않은 이미지
- 누락된 캐싱
- N+1 쿼리

**모범 사례 (MEDIUM)**:
- 코드/주석에 이모지 사용
- 티켓과 연결되지 않은 TODO/FIXME
- 공개 API에 JSDoc 누락
- 접근성 문제 (ARIA 레이블 누락, 대비 부족)
- 나쁜 변수 명명 (x, tmp, data)
- 설명되지 않은 매직 넘버
- 일관성 없는 포맷팅

**리뷰 출력 형식**:
```markdown
[CRITICAL] Hardcoded API key
File: src/api/client.ts:42
Issue: API key exposed in source code
Fix: Move to environment variable

const apiKey = "sk-abc123";  // ❌ Bad
const apiKey = process.env.API_KEY;  // ✓ Good
```

**승인 기준**:
- ✅ 승인: CRITICAL 또는 HIGH 이슈 없음
- ⚠️ 경고: MEDIUM 이슈만 있음 (주의하여 머지 가능)
- ❌ 차단: CRITICAL 또는 HIGH 이슈 발견

### 5. Security Reviewer - 보안 감사자

**사용 시점**: 사용자 입력, 인증, API 엔드포인트 또는 민감한 데이터를 처리하는 코드 작성 후.

::: danger 중요
Security Reviewer는 키 유출, SSRF, 인젝션, 안전하지 않은 암호화 및 OWASP Top 10 취약점을 표시합니다. CRITICAL 이슈가 발견되면 즉시 수정해야 합니다!
:::

**핵심 책임**:
1. **취약점 탐지**: OWASP Top 10 및 일반적인 보안 문제 식별
2. **키 탐지**: 하드코딩된 API keys, 비밀번호, tokens 찾기
3. **입력 검증**: 모든 사용자 입력이 적절히 정제되었는지 확인
4. **인증/권한 부여**: 적절한 접근 제어 검증
5. **의존성 보안**: 취약한 npm 패키지 확인
6. **보안 모범 사례**: 보안 코딩 패턴 강제

**OWASP Top 10 검사**:

1. **인젝션** (SQL, NoSQL, Command)
   - 쿼리가 파라미터화되어 있는가?
   - 사용자 입력이 정제되었는가?
   - ORM이 안전하게 사용되고 있는가?

2. **손상된 인증**
   - 비밀번호가 해시되어 있는가 (bcrypt, argon2)?
   - JWT가 올바르게 검증되는가?
   - 세션이 안전한가?
   - MFA가 있는가?

3. **민감한 데이터 노출**
   - HTTPS가 강제되는가?
   - 키가 환경 변수에 있는가?
   - PII가 저장 시 암호화되는가?
   - 로그가 정제되는가?

4. **XML 외부 엔티티 (XXE)**
   - XML 파서가 안전하게 구성되어 있는가?
   - 외부 엔티티 처리가 비활성화되어 있는가?

5. **손상된 접근 제어**
   - 각 라우트에서 권한이 확인되는가?
   - 객체 참조가 간접적인가?
   - CORS가 올바르게 구성되어 있는가?

6. **보안 구성 오류**
   - 기본 자격 증명이 변경되었는가?
   - 오류 처리가 안전한가?
   - 보안 헤더가 설정되어 있는가?
   - 프로덕션에서 디버그 모드가 비활성화되어 있는가?

7. **크로스 사이트 스크립팅 (XSS)**
   - 출력이 이스케이프/정제되는가?
   - Content-Security-Policy가 설정되어 있는가?
   - 프레임워크가 기본적으로 이스케이프하는가?

8. **안전하지 않은 역직렬화**
   - 사용자 입력이 안전하게 역직렬화되는가?
   - 역직렬화 라이브러리가 최신인가?

9. **알려진 취약점이 있는 컴포넌트 사용**
   - 모든 의존성이 최신인가?
   - npm audit가 깨끗한가?
   - CVE가 모니터링되고 있는가?

10. **불충분한 로깅 및 모니터링**
    - 보안 이벤트가 기록되는가?
    - 로그가 모니터링되는가?
    - 알림이 구성되어 있는가?

**일반적인 취약점 패턴**:

**1. 하드코딩된 시크릿 (CRITICAL)**
```javascript
// ❌ CRITICAL: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ✅ CORRECT: Environment variables
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

**2. SQL 인젝션 (CRITICAL)**
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

**보안 리뷰 보고서 형식**:
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
[취약점 설명]

**Impact:**
[악용될 경우 발생하는 일]

**Proof of Concept:**
```javascript
// 취약점 악용 예시
```

**Remediation:**
```javascript
// ✅ 안전한 구현
```

**References:**
- OWASP: [link]
- CWE: [number]
```

### 6. Build Error Resolver - 빌드 오류 해결사

**사용 시점**: 빌드 실패 또는 타입 오류가 발생했을 때.

::: tip 최소화된 수정
Build Error Resolver의 핵심 원칙은 **최소화된 수정**으로, 오류만 수정하고 아키텍처 변경이나 리팩토링은 하지 않습니다.
:::

**핵심 책임**:
1. **TypeScript 오류 수정**: 타입 오류, 추론 문제, 제네릭 제약 수정
2. **빌드 오류 수정**: 컴파일 실패, 모듈 해석 해결
3. **의존성 문제**: 가져오기 오류, 누락된 패키지, 버전 충돌 수정
4. **구성 오류**: tsconfig.json, webpack, Next.js 구성 문제 해결
5. **최소화된 차이**: 오류를 수정하기 위해 가능한 한 작은 변경
6. **아키텍처 변경 금지**: 오류만 수정, 리팩토링이나 재설계 금지

**진단 명령**:
```bash
# TypeScript 타입 검사 (출력 없음)
npx tsc --noEmit

# TypeScript 예쁜 출력
npx tsc --noEmit --pretty

# 모든 오류 표시 (첫 번째에서 멈추지 않음)
npx tsc --noEmit --pretty --incremental false

# 특정 파일 검사
npx tsc --noEmit path/to/file.ts

# ESLint 검사
npx eslint . --ext .ts,.tsx,.js,.jsx

# Next.js 빌드 (프로덕션)
npm run build
```

**오류 수정 프로세스**:

**1. 모든 오류 수집**
```
a) 전체 타입 검사 실행
   - npx tsc --noEmit --pretty
   - 첫 번째뿐만 아니라 모든 오류 캡처

b) 타입별로 오류 분류
   - 타입 추론 실패
   - 누락된 타입 정의
   - 가져오기/내보내기 오류
   - 구성 오류
   - 의존성 문제

c) 영향별 우선순위 지정
   - 빌드 차단: 먼저 수정
   - 타입 오류: 순서대로 수정
   - 경고: 시간이 있으면 수정
```

**2. 수정 전략 (최소화된 변경)**
```
각 오류에 대해:

1. 오류 이해
   - 오류 메시지를 주의 깊게 읽기
   - 파일과 줄 번호 확인
   - 예상 vs 실제 타입 이해

2. 최소 수정 찾기
   - 누락된 타입 주석 추가
   - 가져오기 문 수정
   - null 검사 추가
   - 타입 단언 사용 (최후의 수단)

3. 수정이 다른 코드를 깨뜨리지 않는지 확인
   - 각 수정 후 tsc 실행
   - 관련 파일 확인
   - 새로운 오류가 도입되지 않았는지 확인

4. 빌드가 통과할 때까지 반복
   - 한 번에 하나의 오류 수정
   - 각 수정 후 재컴파일
   - 진행 상황 추적 (X/Y 오류 수정됨)
```

**일반적인 오류 패턴 및 수정**:

**패턴 1: 타입 추론 실패**
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

**패턴 2: Null/Undefined 오류**
```typescript
// ❌ ERROR: Object is possibly 'undefined'
const name = user.name.toUpperCase()

// ✅ FIX: Optional chaining
const name = user?.name?.toUpperCase()

// ✅ OR: Null check
const name = user && user.name ? user.name.toUpperCase() : ''
```

**패턴 3: 가져오기 오류**
```typescript
// ❌ ERROR: Cannot find module '@/lib/utils'
import { formatDate } from '@/lib/utils'

// ✅ FIX 1: tsconfig paths가 올바른지 확인
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ✅ FIX 2: 상대 가져오기 사용
import { formatDate } from '../lib/utils'
```

**최소화된 차이 전략**:

**CRITICAL: 가능한 한 작은 변경**

**DO:**
✅ 누락된 타입 주석 추가
✅ 필요한 null 검사 추가
✅ 가져오기/내보내기 수정
✅ 누락된 의존성 추가
✅ 타입 정의 업데이트
✅ 구성 파일 수정

**DON'T:**
❌ 관련 없는 코드 리팩토링
❌ 아키텍처 변경
❌ 변수/함수 이름 변경 (오류를 일으키지 않는 한)
❌ 새로운 기능 추가
❌ 로직 흐름 변경 (오류 수정이 아닌 한)
❌ 성능 최적화
❌ 코드 스타일 개선

### 7. E2E Runner - E2E 테스트 전문가

**사용 시점**: E2E 테스트를 생성, 유지 관리 및 실행해야 할 때.

::: tip 엔드투엔드 테스트의 가치
E2E 테스트는 프로덕션 전 마지막 방어선으로, 단위 테스트가 놓친 통합 문제를 포착합니다.
:::

**핵심 책임**:
1. **테스트 여정 생성**: 사용자 플로우를 위한 Playwright 테스트 작성
2. **테스트 유지 관리**: UI 변경과 테스트 동기화 유지
3. **Flaky 테스트 관리**: 불안정한 테스트 식별 및 격리
4. **Artifact 관리**: 스크린샷, 비디오, traces 캡처
5. **CI/CD 통합**: 파이프라인에서 테스트가 안정적으로 실행되도록 보장
6. **테스트 보고**: HTML 보고서 및 JUnit XML 생성

**테스트 명령**:
```bash
# 모든 E2E 테스트 실행
npx playwright test

# 특정 테스트 파일 실행
npx playwright test tests/markets.spec.ts

# headed 모드로 테스트 실행 (브라우저 보기)
npx playwright test --headed

# inspector로 테스트 디버그
npx playwright test --debug

# 브라우저 동작에서 테스트 코드 생성
npx playwright codegen http://localhost:3000

# trace와 함께 테스트 실행
npx playwright test --trace on

# HTML 보고서 표시
npx playwright show-report

# 스냅샷 업데이트
npx playwright test --update-snapshots

# 특정 브라우저에서 테스트 실행
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**E2E 테스트 워크플로우**:

**1. 테스트 계획 단계**
```
a) 핵심 사용자 여정 식별
   - 인증 플로우 (로그인, 로그아웃, 회원가입)
   - 핵심 기능 (마켓 생성, 거래, 검색)
   - 결제 플로우 (입금, 출금)
   - 데이터 무결성 (CRUD 작업)

b) 테스트 시나리오 정의
   - Happy path (모든 것이 정상)
   - Edge cases (빈 상태, 제한)
   - Error cases (네트워크 실패, 검증)

c) 위험별 우선순위 지정
   - HIGH: 금융 거래, 인증
   - MEDIUM: 검색, 필터링, 내비게이션
   - LOW: UI 다듬기, 애니메이션, 스타일링
```

**2. 테스트 생성 단계**
```
각 사용자 여정에 대해:

1. Playwright에서 테스트 작성
   - Page Object Model (POM) 패턴 사용
   - 의미 있는 테스트 설명 추가
   - 핵심 단계에 assertion 추가
   - 핵심 지점에 스크린샷 추가

2. 테스트를 탄력적으로 만들기
   - 적절한 locator 사용 (data-testid 우선)
   - 동적 콘텐츠 대기 추가
   - 경쟁 조건 처리
   - 재시도 로직 구현

3. artifact 캡처 추가
   - 실패 시 스크린샷
   - 비디오 녹화
   - 디버깅을 위한 trace
   - 필요 시 네트워크 로그
```

**Playwright 테스트 구조**:

**테스트 파일 구성**:
```
tests/
├── e2e/                       # 엔드투엔드 사용자 여정
│   ├── auth/                  # 인증 플로우
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── markets/               # 마켓 기능
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   ├── create.spec.ts
│   │   └── trade.spec.ts
│   ├── wallet/                # 지갑 작업
│   │   ├── connect.spec.ts
│   │   └── transactions.spec.ts
│   └── api/                   # API 엔드포인트 테스트
│       ├── markets-api.spec.ts
│       └── search-api.spec.ts
├── fixtures/                  # 테스트 데이터 및 헬퍼
│   ├── auth.ts                # 인증 fixtures
│   ├── markets.ts             # 마켓 테스트 데이터
│   └── wallets.ts             # 지갑 fixtures
└── playwright.config.ts       # Playwright 구성
```

**Page Object Model 패턴**:
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

**모범 사례 테스트 예시**:
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

**Flaky 테스트 관리**:

**Flaky 테스트 식별**:
```bash
# 안정성 확인을 위해 테스트를 여러 번 실행
npx playwright test tests/markets/search.spec.ts --repeat-each=10

# 재시도로 특정 테스트 실행
npx playwright test tests/markets/search.spec.ts --retries=3
```

**격리 모드**:
```typescript
// flaky 테스트를 격리하여 표시
test('flaky: market search with complex query', async ({ page }) => {
  test.fixme(true, 'Test is flaky - Issue #123')

  // Test code here...
})

// 또는 조건부 스킵
test('market search with complex query', async ({ page }) => {
  test.skip(process.env.CI, 'Test is flaky in CI - Issue #123')

  // Test code here...
})
```

**일반적인 Flakiness 원인 및 수정**:

**1. 경쟁 조건**
```typescript
// ❌ FLAKY: Don't assume element is ready
await page.click('[data-testid="button"]')

// ✅ STABLE: Wait for element to be ready
await page.locator('[data-testid="button"]').click() // Built-in auto-wait
```

**2. 네트워크 타이밍**
```typescript
// ❌ FLAKY: Arbitrary timeout
await page.waitForTimeout(5000)

// ✅ STABLE: Wait for specific condition
await page.waitForResponse(resp => resp.url().includes('/api/markets'))
```

**3. 애니메이션 타이밍**
```typescript
// ❌ FLAKY: Click during animation
await page.click('[data-testid="menu-item"]')

// ✅ STABLE: Wait for animation to complete
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.click('[data-testid="menu-item"]')
```

### 8. Refactor Cleaner - 리팩토링 정리사

**사용 시점**: 사용하지 않는 코드, 중복 코드를 제거하고 리팩토링해야 할 때.

::: warning 신중한 조작
Refactor Cleaner는 분석 도구 (knip, depcheck, ts-prune)를 실행하여 죽은 코드를 식별하고 안전하게 삭제합니다. 삭제하기 전에 반드시 충분히 검증하세요!
:::

**핵심 책임**:
1. **죽은 코드 탐지**: 사용되지 않는 코드, 내보내기, 의존성 찾기
2. **중복 제거**: 중복 코드 식별 및 병합
3. **의존성 정리**: 사용되지 않는 패키지와 가져오기 제거
4. **안전한 리팩토링**: 변경이 기능을 깨뜨리지 않도록 보장
5. **문서 기록**: `DELETION_LOG.md`에서 모든 삭제 추적

**탐지 도구**:
- **knip**: 사용되지 않는 파일, 내보내기, 의존성, 타입 찾기
- **depcheck**: 사용되지 않는 npm 의존성 식별
- **ts-prune**: 사용되지 않는 TypeScript 내보내기 찾기
- **eslint**: 사용되지 않는 disable-directives 및 변수 확인

**분석 명령**:
```bash
# 사용되지 않는 내보내기/파일/의존성 찾기 위해 knip 실행
npx knip

# 사용되지 않는 의존성 확인
npx depcheck

# 사용되지 않는 TypeScript 내보내기 찾기
npx ts-prune

# 사용되지 않는 disable-directives 확인
npx eslint . --report-unused-disable-directives
```

**리팩토링 워크플로우**:

**1. 분석 단계**
```
a) 탐지 도구를 병렬로 실행
b) 모든 발견 수집
c) 위험 수준별로 분류:
   - SAFE: 사용되지 않는 내보내기, 사용되지 않는 의존성
   - CAREFUL: 동적 가져오기로 사용될 수 있는 것
   - RISKY: 공개 API, 공유 유틸리티
```

**2. 위험 평가**
```
삭제할 각 항목에 대해:
- 어디서 가져오는지 확인 (grep 검색)
- 동적 가져오기가 없는지 확인 (grep 문자열 패턴)
- 공개 API의 일부인지 확인
- 맥락을 얻기 위해 히스토리 보기
- 빌드/테스트에 미치는 영향 테스트
```

**3. 안전한 삭제 프로세스**
```
a) SAFE 항목부터만 시작
b) 한 번에 한 카테고리씩 삭제:
   1. 사용되지 않는 npm 의존성
   2. 사용되지 않는 내부 내보내기
   3. 사용되지 않는 파일
   4. 중복 코드
c) 각 배치 후 테스트 실행
d) 각 배치에 대해 git commit 생성
```

**4. 중복 병합**
```
a) 중복 컴포넌트/유틸리티 찾기
b) 최선의 구현 선택:
   - 가장 기능이 풍부한
   - 가장 잘 테스트된
   - 가장 최근에 사용된
c) 선택된 버전을 사용하도록 모든 가져오기 업데이트
d) 중복 제거
e) 테스트가 여전히 통과하는지 확인
```

**삭제 로그 형식**:

`docs/DELETION_LOG.md`를 생성/업데이트하고, 다음 구조 사용:
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

**안전 검사 체크리스트**:

**무언가를 삭제하기 전에:**
- [ ] 탐지 도구 실행
- [ ] 모든 참조 grep
- [ ] 동적 가져오기 확인
- [ ] 히스토리 보기
- [ ] 공개 API인지 확인
- [ ] 모든 테스트 실행
- [ ] 백업 브랜치 생성
- [ ] DELETION_LOG.md에 문서화

**각 삭제 후:**
- [ ] 빌드 성공
- [ ] 테스트 통과
- [ ] 콘솔 오류 없음
- [ ] 변경사항 커밋
- [ ] DELETION_LOG.md 업데이트

**일반적인 삭제 패턴**:

**1. 사용되지 않는 가져오기**
```typescript
// ❌ Remove unused imports
import { useState, useEffect, useMemo } from 'react' // Only useState used

// ✅ Keep only what's used
import { useState } from 'react'
```

**2. 죽은 코드 브랜치**
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

**3. 중복 컴포넌트**
```typescript
// ❌ Multiple similar components
components/Button.tsx
components/PrimaryButton.tsx
components/NewButton.tsx

// ✅ Consolidate to one
components/Button.tsx (with variant prop)
```

### 9. Doc Updater - 문서 업데이트 담당자

**사용 시점**: codemaps와 문서를 업데이트해야 할 때.

::: tip 문서와 코드 동기화
Doc Updater는 `/update-codemaps` 및 `/update-docs`를 실행하여 `docs/CODEMAPS/*`를 생성하고 READMEs 및 가이드를 업데이트합니다.
:::

**핵심 책임**:
1. **Codemap 생성**: 코드베이스 구조에서 아키텍처 매핑 생성
2. **문서 업데이트**: 코드에서 READMEs 및 가이드를 새로고침
3. **AST 분석**: TypeScript 컴파일러 API를 사용하여 구조 이해
4. **의존성 매핑**: 모듈 간 가져오기/내보내기 추적
5. **문서 품질**: 문서가 실제 코드와 일치하도록 보장

**분석 도구**:
- **ts-morph**: TypeScript AST 분석 및 조작
- **TypeScript Compiler API**: 심층 코드 구조 분석
- **madge**: 의존성 그래프 시각화
- **jsdoc-to-markdown**: JSDoc 주석에서 문서 생성

**분석 명령**:
```bash
# TypeScript 프로젝트 구조 분석 (ts-morph 라이브러리를 사용하는 커스텀 스크립트 실행)
npx tsx scripts/codemaps/generate.ts

# 의존성 그래프 생성
npx madge --image graph.svg src/

# JSDoc 주석 추출
npx jsdoc2md src/**/*.ts
```

**Codemap 생성 워크플로우**:

**1. 저장소 구조 분석**
```
a) 모든 workspaces/packages 식별
b) 디렉토리 구조 매핑
c) 진입점 찾기 (apps/*, packages/*, services/*)
d) 프레임워크 패턴 감지 (Next.js, Node.js 등)
```

**2. 모듈 분석**
```
각 모듈에 대해:
- 내보내기 추출 (공개 API)
- 가져오기 매핑 (의존성)
- 라우트 식별 (API 라우트, 페이지)
- 데이터베이스 모델 찾기 (Supabase, Prisma)
- queue/worker 모듈 위치
```

**3. Codemaps 생성**
```
구조:
docs/CODEMAPS/
├── INDEX.md              # 모든 영역의 개요
├── frontend.md           # 프론트엔드 구조
├── backend.md            # Backend/API 구조
├── database.md           # 데이터베이스 스키마
├── integrations.md       # 외부 서비스
└── workers.md            # 백그라운드 작업
```

**Codemap 형식**:
```markdown
# [영역] Codemap

**Last Updated:** YYYY-MM-DD
**Entry Points:** 주요 파일 목록

## Architecture

[컴포넌트 관계의 ASCII 다이어그램]

## Key Modules

| Module | Purpose | Exports | Dependencies |
| --- | --- | --- | --- |
| ... | ... | ... | ... |

## Data Flow

[이 영역에서 데이터가 어떻게 흐르는지 설명]

## External Dependencies

- package-name - Purpose, Version
- ...

## Related Areas

이 영역과 상호작용하는 다른 codemaps에 대한 링크
```

**문서 업데이트 워크플로우**:

**1. 코드에서 문서 추출**
```
- JSDoc/TSDoc 주석 읽기
- README 섹션을 package.json에서 추출
- .env.example에서 환경 변수 파싱
- API 엔드포인트 정의 수집
```

**2. 문서 파일 업데이트**
```
업데이트할 파일:
- README.md - 프로젝트 개요, 설정 지침
- docs/GUIDES/*.md - 기능 가이드, 튜토리얼
- package.json - 설명, 스크립트 문서
- API documentation - 엔드포인트 사양
```

**3. 문서 검증**
```
- 언급된 모든 파일이 존재하는지 확인
- 모든 링크가 유효한지 확인
- 예제가 실행 가능한지 확인
- 코드 스니펫이 컴파일되는지 확인
```

**예시 프로젝트 특정 Codemaps**:

**프론트엔드 Codemap (docs/CODEMAPS/frontend.md)**:
```markdown
# Frontend Architecture

**Last Updated:** YYYY-MM-DD
**Framework:** Next.js 15.1.4 (App Router)
**Entry Point:** website/src/app/layout.tsx

## Structure

website/src/
├── app/                # Next.js App Router
│   ├── api/           # API 라우트
│   ├── markets/       # 마켓 페이지
│   ├── bot/           # 봇 상호작용
│   └── creator-dashboard/
├── components/        # React 컴포넌트
├── hooks/             # 커스텀 hooks
└── lib/               # 유틸

## Key Components

| Component | Purpose | Location |
| --- | --- | --- |
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

**백엔드 Codemap (docs/CODEMAPS/backend.md)**:
```markdown
# Backend Architecture

**Last Updated:** YYYY-MM-DD
**Runtime:** Next.js API Routes
**Entry Point:** website/src/app/api/

## API Routes

| Route | Method | Purpose |
| --- | --- | --- |
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

**README 업데이트 템플릿**:

README.md를 업데이트할 때:
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

- `src/app` - Next.js App Router 페이지 및 API 라우트
- `src/components` - 재사용 가능한 React 컴포넌트
- `src/lib` - 유틸리티 라이브러리 및 클라이언트

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

## 언제 어떤 Agent를 호출할지

작업 유형에 따라 적절한 agent를 선택하세요:

| 작업 유형 | 권장 호출 | 대안 |
| --- | --- | --- |
| **새 기능 계획** | `/plan` → planner agent | planner agent 수동 호출 |
| **시스템 아키텍처 설계** | architect agent 수동 호출 | `/orchestrate` → agents 순차 호출 |
| **새 기능 작성** | `/tdd` → tdd-guide agent | planner → tdd-guide |
| **버그 수정** | `/tdd` → tdd-guide agent | build-error-resolver (타입 오류인 경우) |
| **코드 리뷰** | `/code-review` → code-reviewer agent | code-reviewer agent 수동 호출 |
| **보안 감사** | security-reviewer agent 수동 호출 | code-reviewer (부분 커버) |
| **빌드 실패** | `/build-fix` → build-error-resolver agent | 수동 수정 |
| **E2E 테스트** | `/e2e` → e2e-runner agent | Playwright 테스트 수동 작성 |
| **죽은 코드 정리** | `/refactor-clean` → refactor-cleaner agent | 수동 삭제 |
| **문서 업데이트** | `/update-docs` → doc-updater agent | `/update-codemaps` → doc-updater agent |

## Agent 협업 예시

### 시나리오 1: 처음부터 새 기능 개발

```
1. /plan (planner agent)
   - 구현 계획 생성
   - 의존성 및 위험 식별

2. /tdd (tdd-guide agent)
   - 계획에 따라 테스트 작성
   - 기능 구현
   - 커버리지 보장

3. /code-review (code-reviewer agent)
   - 코드 품질 검토
   - 보안 취약점 확인

4. /verify (command)
   - 빌드, 타입 검사, 테스트 실행
   - console.log, git 상태 확인
```

### 시나리오 2: 빌드 오류 수정

```
1. /build-fix (build-error-resolver agent)
   - TypeScript 오류 수정
   - 빌드 통과 보장

2. /test-coverage (command)
   - 커버리지가 기준에 도달하는지 확인

3. /code-review (code-reviewer agent)
   - 수정된 코드 검토
```

### 시나리오 3: 코드 정리

```
1. /refactor-clean (refactor-cleaner agent)
   - 탐지 도구 실행
   - 죽은 코드 삭제
   - 중복 코드 병합

2. /update-docs (doc-updater agent)
   - codemaps 업데이트
   - 문서 새로고침

3. /verify (command)
   - 모든 검사 실행
```

## 이 과정 요약

Everything Claude Code는 9개의 전문화된 agents를 제공하며, 각 agent는 특정 분야에 집중합니다:

1. **planner** - 복잡한 기능 계획
2. **architect** - 시스템 아키텍처 설계
3. **tdd-guide** - TDD 프로세스 실행
4. **code-reviewer** - 코드 품질 검토
5. **security-reviewer** - 보안 취약점 탐지
6. **build-error-resolver** - 빌드 오류 수정
7. **e2e-runner** - 엔드투엔드 테스트 관리
8. **refactor-cleaner** - 죽은 코드 정리
9. **doc-updater** - 문서 및 codemap 업데이트

**핵심 원칙**:
- 작업 유형에 따라 적절한 agent 선택
- agents 간의 협업을 활용하여 효율적인 워크플로우 구축
- 복잡한 작업은 여러 agents를 순차적으로 호출할 수 있음
- 코드 변경 후 반드시 code review 수행

## 다음 과정 예고

> 다음 과정에서는 **[TDD 개발 프로세스](../tdd-workflow/)**를 학습합니다.
>
> 배울 내용:
> - `/plan`을 사용하여 구현 계획을 만드는 방법
> - `/tdd`를 사용하여 Red-Green-Refactor 주기를 실행하는 방법
> - 80%+ 테스트 커버리지를 보장하는 방법
> - `/verify`를 사용하여 전면적인 검증을 실행하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| Planner Agent | [agents/planner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| Architect Agent | [agents/architect.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/architect.md) | 1-212 |
| TDD Guide Agent | [agents/tdd-guide.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [agents/code-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| Security Reviewer Agent | [agents/security-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| Build Error Resolver Agent | [agents/build-error-resolver.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/build-error-resolver.md) | 1-533 |
| E2E Runner Agent | [agents/e2e-runner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/e2e-runner.md) | 1-709 |
| Refactor Cleaner Agent | [agents/refactor-cleaner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/refactor-cleaner.md) | 1-307 |
| Doc Updater Agent | [agents/doc-updater.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/doc-updater.md) | 1-453 |

**주요 상수**:
- 없음

**주요 함수**:
- 없음

</details>
