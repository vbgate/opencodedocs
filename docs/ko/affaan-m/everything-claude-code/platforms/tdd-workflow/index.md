---
title: "TDD 개발 워크플로우: Red-Green-Refactor | everything-claude-code"
sidebarTitle: "테스트 먼저, 코드는 나중에"
subtitle: "TDD 개발 워크플로우: Red-Green-Refactor"
description: "Everything Claude Code의 TDD 개발 워크플로우를 학습합니다. /plan, /tdd, /code-review, /verify 명령어를 마스터하여 80% 이상의 테스트 커버리지를 달성하세요."
tags:
  - "tdd"
  - "test-driven-development"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 70
---

# TDD 개발 워크플로우: /plan에서 /verify까지 완전한 Red-Green-Refactor 사이클

## 이 강의를 마치면 할 수 있는 것

- `/plan` 명령어로 체계적인 구현 계획을 세워 누락을 방지
- `/tdd` 명령어로 테스트 주도 개발을 실행하며 RED-GREEN-REFACTOR 사이클 준수
- `/code-review`로 코드 보안과 품질 확보
- `/verify`로 코드가 안전하게 커밋될 수 있는지 검증
- 80% 이상의 테스트 커버리지를 달성하고 신뢰할 수 있는 테스트 스위트 구축

## 지금 겪고 있는 어려움

새로운 기능을 개발할 때 이런 상황을 겪어본 적 있나요?

- 코드를 다 작성한 후에야 요구사항을 잘못 이해했다는 걸 깨닫고 다시 작업해야 하는 경우
- 테스트 커버리지가 낮아서 배포 후 버그가 발견되는 경우
- 코드 리뷰에서 보안 문제가 발견되어 수정 요청을 받는 경우
- 커밋 후에야 타입 오류나 빌드 실패를 발견하는 경우
- 언제 테스트를 작성해야 하는지 모르겠고, 테스트가 불완전한 경우

이런 문제들은 개발 효율을 떨어뜨리고 코드 품질을 보장하기 어렵게 만듭니다.

## 이 방법을 사용해야 할 때

TDD 개발 워크플로우를 사용해야 하는 상황:

- **새 기능 개발**: 요구사항부터 구현까지, 기능의 완전성과 충분한 테스트 보장
- **버그 수정**: 먼저 버그를 재현하는 테스트를 작성한 후 수정하여 새로운 문제 유입 방지
- **코드 리팩토링**: 테스트의 보호 아래 안심하고 코드 구조 최적화
- **API 엔드포인트 구현**: 통합 테스트를 작성하여 인터페이스 정확성 검증
- **핵심 비즈니스 로직 개발**: 금융 계산, 인증 등 중요한 코드는 100% 테스트 커버리지 필요

::: tip 핵심 원칙
테스트 주도 개발은 단순히 테스트를 먼저 작성하는 프로세스가 아니라, 코드 품질을 보장하고 개발 효율을 높이는 체계적인 방법론입니다. 모든 새 코드는 TDD 워크플로우를 통해 구현해야 합니다.
:::

## 핵심 아이디어

TDD 개발 워크플로우는 4개의 핵심 명령어로 구성되어 완전한 개발 사이클을 형성합니다:

```
1. /plan     → 계획: 요구사항 명확화, 리스크 식별, 단계별 실행
2. /tdd      → 구현: 테스트 우선, 최소 코드, 지속적 리팩토링
3. /code-review → 검토: 보안 점검, 품질 평가, 모범 사례
4. /verify   → 검증: 빌드, 타입, 테스트, 코드 감사
```

**이 워크플로우가 효과적인 이유**:

- **계획 우선**: `/plan`으로 올바른 이해를 확보하여 방향 오류 방지
- **테스트 주도**: `/tdd`로 테스트 우선을 강제하여 모든 기능에 테스트 보호 보장
- **검토 관문**: `/code-review`로 보안 취약점과 코드 품질 문제 발견
- **검증 마무리**: `/verify`로 코드가 안전하게 커밋될 수 있음을 확인

## 🎒 시작하기 전 준비사항

TDD 개발 워크플로우를 시작하기 전에 확인하세요:

- ✅ Everything Claude Code 플러그인 설치 완료
- ✅ 프로젝트에 테스트 프레임워크 설정됨 (Jest, Vitest 등)
- ✅ 프로젝트에 기본 빌드 프로세스 있음 (`npm run build`)
- ✅ [빠른 시작](../../start/quickstart/)의 기본 명령어 사용법 숙지

::: warning 선행 조건
이 튜토리얼은 [빠른 시작](../../start/quickstart/)의 기본 조작에 익숙하다고 가정합니다. 아직 설치를 완료하지 않았다면 먼저 [설치 가이드](../../start/installation/)를 읽어주세요.
:::

## 따라하기: 완전한 TDD 개발 워크플로우

실제 예제를 통해 전체 워크플로우를 학습해 봅시다. 「시장 유동성 점수 계산기」 기능을 구현한다고 가정합니다.

### 1단계: /plan으로 구현 계획 수립

**왜 필요한가**
계획 단계에서 요구사항을 이해하고 잠재적 리스크를 식별하여 이후 재작업을 방지합니다.

**실행**
Claude Code에서 입력:

```
/plan 거래량, 매수-매도 스프레드, 활성 거래자 수, 최근 거래 시간을 기반으로 점수(0-100)를 계산하는 시장 유동성 점수 계산기를 구현해야 합니다
```

**예상 결과**
planner agent가 상세한 구현 계획을 생성합니다:

```markdown
## Implementation Plan: 시장 유동성 점수 계산기

## Requirements Restatement
- 여러 지표를 기반으로 시장 유동성 점수(0-100) 계산
- 점수가 높을수록 시장 유동성이 좋음을 의미
- 거래량, 매수-매도 스프레드, 활성 거래자, 최근 거래 시간 고려

## Implementation Phases

### Phase 1: Define Interface
- 입력 데이터를 정의하는 `MarketData` 인터페이스 생성
- `calculateLiquidityScore` 함수 시그니처 정의

### Phase 2: Write Tests
- 다양한 시나리오를 커버하는 단위 테스트 작성
- 경계 조건: 거래량 0, 극단적으로 큰 값
- 오류 처리: 누락된 필드, 잘못된 타입

### Phase 3: Implement Calculation
- 점수 계산 알고리즘 구현
- 각 지표의 가중치 계산
- 0-100 범위로 정규화

### Phase 4: Integration
- 기존 API에 통합
- 계산 기능을 노출하는 엔드포인트 추가
- 사용 방법 문서화

## Dependencies
- 외부 의존성 없음

## Risks
- MEDIUM: 점수 알고리즘의 가중치 조정이 필요할 수 있음
- LOW: 경계 조건 처리

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

**체크포인트 ✅**
- 요구사항 이해가 정확한지 확인
- 실행 단계가 합리적인지 확인
- 누락된 리스크가 있는지 점검

**다음 단계**
계획에 문제가 없으면 `yes` 또는 `proceed`로 응답합니다. 수정이 필요하면 구체적인 변경사항을 설명합니다.

---

### 2단계: /tdd로 테스트 주도 개발 실행

**왜 필요한가**
`/tdd` 명령어는 테스트 우선을 강제하여 모든 기능에 테스트 보호가 있도록 하고, 나중에 테스트를 추가하는 고통을 방지합니다.

**실행**
계획 확인 후 입력:

```
/tdd 계획에 따라 시장 유동성 점수 계산기 구현
```

**예상 결과**
tdd-guide agent가 TDD 워크플로우를 안내합니다:

#### RED 단계: 테스트 먼저 작성

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
      lastTradeTime: new Date(Date.now() - 86400000) // 1일 전
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

## 테스트 실패를 확인해야 합니다
FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market
    Error: Not implemented
```

✅ **테스트 실패, 예상대로입니다**

#### GREEN 단계: 최소 코드 구현

```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // 거래량 0인 경계 케이스 처리
  if (market.totalVolume === 0) {
    return 0
  }

  // 컴포넌트 점수 계산 (0-100 스케일)
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // 최근 활동 보너스
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // 가중 평균
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // 0-100으로 클램프
}
```

```bash
npm test lib/liquidity.test.ts

## 테스트 통과를 확인해야 합니다
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **모든 테스트 통과**

#### REFACTOR 단계: 코드 개선

```typescript
// lib/liquidity.ts - 리팩토링 후
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

## 테스트가 여전히 통과하는지 확인해야 합니다
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **리팩토링 완료, 테스트 여전히 통과**

#### 커버리지 확인

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 80%)
```

✅ **TDD 워크플로우 완료, 커버리지 요구사항 충족**

**체크포인트 ✅**
- 테스트를 코드보다 먼저 작성 (RED)
- 테스트 실패 후 구현 (GREEN)
- 코드 통과 후 리팩토링 (REFACTOR)
- 커버리지 80% 이상 달성

---

### 3단계: /code-review로 코드 검토

**왜 필요한가**
코드 리뷰는 보안 문제, 코드 품질, 모범 사례 문제를 발견하여 코드가 안전하게 병합될 수 있도록 합니다.

**실행**
입력:

```
/code-review
```

**예상 결과**
code-reviewer agent가 검사합니다:

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

**다음 단계**
검토 결과에 따라 문제 수정:

```typescript
// console.log 제거
// console.log(`Calculated score: ${score}`)  // 삭제됨
return clamp(weightedScore, 0, 100)
```

**체크포인트 ✅**
- 모든 CRITICAL 레벨 문제 수정
- HIGH 레벨 문제 수정 또는 사유 설명
- 코드 품질이 표준에 부합하는지 확인

---

### 4단계: /verify로 코드 검증

**왜 필요한가**
검증 명령어는 코드가 안전하게 커밋될 수 있는지, 빌드, 타입, 테스트가 모두 통과하고 남은 문제가 없는지 확인합니다.

**실행**
입력:

```
/verify
```

**예상 결과**
완전한 검증 보고서:

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

문제가 있으면 상세히 나열됩니다:

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

**체크포인트 ✅**
- 빌드 통과
- 타입 검사 통과
- Lint 통과 (또는 경고만 있음)
- 모든 테스트 통과
- 커버리지 80% 이상 달성
- console.log 없음
- 하드코딩된 시크릿 없음

---

### 5단계: 코드 커밋

**왜 필요한가**
검증 통과 후 코드는 커밋할 준비가 되었으며, 안심하고 원격 저장소에 푸시할 수 있습니다.

**실행**
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

## 주의해야 할 함정

### 함정 1: RED 단계를 건너뛰고 바로 코드 작성

**잘못된 방법**:
```
먼저 calculateLiquidityScore 함수 구현
그 다음 테스트 작성
```

**결과**:
- 테스트가 단순히 "기존 구현 검증"이 되어 실제 동작을 검증하지 못함
- 경계 케이스와 오류 처리를 놓치기 쉬움
- 리팩토링 시 안전감 부족

**올바른 방법**:
```
1. 먼저 테스트 작성 (실패해야 함)
2. 테스트 실행하여 실패 확인 (RED)
3. 테스트를 통과시키는 코드 구현 (GREEN)
4. 리팩토링하며 테스트 통과 유지 (REFACTOR)
```

---

### 함정 2: 테스트 커버리지 미달

**잘못된 방법**:
```
테스트 하나만 작성, 커버리지 40%에 불과
```

**결과**:
- 대량의 코드가 테스트 보호 없음
- 리팩토링 시 버그 유입 쉬움
- 코드 리뷰에서 수정 요청 받음

**올바른 방법**:
```
80% 이상 커버리지 확보:
- 단위 테스트: 모든 함수와 분기 커버
- 통합 테스트: API 엔드포인트 커버
- E2E 테스트: 핵심 사용자 플로우 커버
```

---

### 함정 3: code-review 제안 무시

**잘못된 방법**:
```
CRITICAL 문제가 있어도 그냥 커밋
```

**결과**:
- 보안 취약점이 프로덕션 환경에 배포됨
- 코드 품질 저하, 유지보수 어려움
- PR 리뷰어에게 반려됨

**올바른 방법**:
```
- CRITICAL 문제는 반드시 수정
- HIGH 문제는 가능한 수정하거나 사유 설명
- MEDIUM/LOW 문제는 추후 최적화 가능
```

---

### 함정 4: /verify 없이 바로 커밋

**잘못된 방법**:
```
코드 작성 후 바로 git commit, 검증 건너뜀
```

**결과**:
- 빌드 실패, CI 리소스 낭비
- 타입 오류로 런타임 에러 발생
- 테스트 실패, 메인 브랜치 상태 이상

**올바른 방법**:
```
커밋 전 항상 /verify 실행:
/verify
# "Ready for PR: YES"를 확인한 후 커밋
```

---

### 함정 5: 구현 세부사항 테스트 (동작이 아닌)

**잘못된 방법**:
```typescript
// 내부 상태 테스트
expect(component.state.count).toBe(5)
```

**결과**:
- 테스트가 취약해져 리팩토링 시 대량 실패
- 테스트가 사용자가 실제로 보는 것을 반영하지 않음

**올바른 방법**:
```typescript
// 사용자에게 보이는 동작 테스트
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

## 이 강의 요약

TDD 개발 워크플로우의 핵심 포인트:

1. **계획 우선**: `/plan`으로 올바른 이해를 확보하여 방향 오류 방지
2. **테스트 주도**: `/tdd`로 테스트 우선을 강제하며 RED-GREEN-REFACTOR 준수
3. **코드 검토**: `/code-review`로 보안 및 품질 문제 발견
4. **전면 검증**: `/verify`로 코드가 안전하게 커밋될 수 있음을 확인
5. **커버리지 요구사항**: 80% 이상 테스트 커버리지 확보, 핵심 코드는 100%

이 네 가지 명령어가 완전한 개발 사이클을 형성하여 코드 품질과 개발 효율을 보장합니다.

::: tip 이 워크플로우를 기억하세요
```
요구사항 → /plan → /tdd → /code-review → /verify → 커밋
```

모든 새 기능은 이 워크플로우를 따라야 합니다.
:::

## 다음 강의 예고

> 다음 강의에서는 **[코드 리뷰 워크플로우: /code-review와 보안 감사](../code-review-workflow/)**를 학습합니다.
>
> 배우게 될 내용:
> - code-reviewer agent의 검사 로직 심층 이해
> - 보안 감사 체크리스트 마스터
> - 일반적인 보안 취약점 수정 방법
> - 커스텀 검토 규칙 설정 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| /plan 명령어 | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| /tdd 명령어 | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| /verify 명령어 | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**핵심 함수**:
- `plan`은 planner agent를 호출하여 구현 계획 생성
- `tdd`는 tdd-guide agent를 호출하여 RED-GREEN-REFACTOR 워크플로우 실행
- `verify`는 전면 검증 검사 실행 (빌드, 타입, lint, 테스트)
- `code-review`는 보안 취약점, 코드 품질, 모범 사례 검사

**커버리지 요구사항**:
- 최소 80% 코드 커버리지 (branches, functions, lines, statements)
- 금융 계산, 인증 로직, 보안 핵심 코드는 100% 커버리지 필요

</details>
