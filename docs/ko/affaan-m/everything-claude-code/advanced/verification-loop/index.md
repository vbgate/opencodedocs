---
title: "검증 루프: Checkpoint와 Evals | Everything Claude Code"
subtitle: "검증 루프: Checkpoint와 Evals"
sidebarTitle: "PR 전 검증으로 실수 방지"
description: "Everything Claude Code의 검증 루프 메커니즘을 학습합니다. Checkpoint 관리, Evals 정의, 지속적 검증을 마스터하여 checkpoint로 상태를 저장하고 롤백하며, evals로 코드 품질을 보장합니다."
tags:
  - "verification"
  - "checkpoint"
  - "evals"
  - "quality-gates"
prerequisite:
  - "platforms-tdd-workflow"
order: 120
---

# 검증 루프：Checkpoint와 Evals

## 이 강의를 마치면 할 수 있는 것

검증 루프 메커니즘을 학습한 후, 다음을 할 수 있습니다:

- `/checkpoint`로 작업 상태를 저장하고 복원
- `/verify`로 포괄적인 코드 품질 검사 실행
- Eval-Driven Development（EDD）이념을 마스터하여 evals를 정의하고 실행
- 지속적 검증 루프를 구축하여 개발 과정에서 코드 품질 유지

## 지금 겪고 있는 어려움

새 기능을 완료했지만 PR을 제출하기가 두렵습니다:

- 기존 기능을 깨뜨렸는지 확실하지 않음
- 테스트 커버리지가 감소할 것을 우려
- 처음 목표가 무엇이었는지 잊어서 방향에서 벗어났는지 모름
- 안정적인 상태로 돌아가고 싶지만 기록이 없음

만약 중요한 순간에 "스냅샷 저장"을 하고 개발 과정에서 지속적으로 검증하는 메커니즘이 있다면, 이 문제는 쉽게 해결됩니다.

## 이 방법을 사용해야 할 때

- **새 기능 시작 전**: checkpoint 생성으로 시작 상태 기록
- **마일스톤 완료 후**: 진도 저장으로 롤백과 비교 용이
- **PR 제출 전**: 포괄적 검증으로 코드 품질 보장
- **리팩토링 시**: 빈번한 검증으로 기존 기능 파손 방지
- **다인 협업 시**: checkpoint 공유로 작업 상태 동기화

## 🎒 시작하기 전 준비사항

::: warning 선행 조건

이 튜토리얼은 다음을 완료했다고 가정합니다:

- ✅ [TDD 개발 워크플로우](../../platforms/tdd-workflow/) 학습 완료
- ✅ 기본 Git 작업에 익숙함
- ✅ Everything Claude Code의 기본 명령어 사용 방법 이해

:::

---

## 핵심 아이디어

**검증 루프**는 "코드 작성 → 테스트 → 검증" 사이클을 체계적인 프로세스로 변환하는 품질 보장 메커니즘입니다.

### 세 계층 검증 시스템

Everything Claude Code는 세 계층 검증을 제공합니다:

| 계층 | 메커니즘 | 목적 | 사용 시점 |
|--- | --- | --- | ---|
| **실시간 검증** | PostToolUse Hooks | 타입 오류, console.log 등 즉시 캡처 | 모든 도구 호출 후 |
| **주기적 검증** | `/verify` 명령어 | 포괄적 검사: 빌드, 타입, 테스트, 보안 | 15분마다 또는 주요 변경 후 |
| **마일스톤 검증** | `/checkpoint` | 상태 차이 비교, 품질 추세 추적 | 마일스톤 완료, PR 제출 전 |

### Checkpoint: 코드의 "저장 포인트"

Checkpoint는 중요한 순간에 "스냅샷 저장"을 합니다:

- Git SHA 기록
- 테스트 통과율 기록
- 코드 커버리지 기록
- 타임스탬프 기록

검증 시 현재 상태와 임의의 checkpoint 간 차이를 비교할 수 있습니다.

### Evals: AI 개발의 "단위 테스트"

**Eval-Driven Development（EDD）**는 evals를 AI 개발의 단위 테스트로 사용합니다:

1. **성공 기준 먼저 정의** (evals 작성)
2. **그 다음 코드 작성** (기능 구현)
3. **evals 지속 실행** (정확성 검증)
4. **회귀 추적** (기존 기능 파손 방지)

이는 TDD（테스트 주도 개발）이념과 일치하지만 AI 지원 개발을 대상으로 합니다.

---

## 따라하기: Checkpoint 사용

### 1단계: 초기 checkpoint 생성

새 기능 시작 전, 먼저 checkpoint 생성:

```bash
/checkpoint create "feature-start"
```

**왜 필요한가**
시작 상태를 기록하여 후속 비교를 용이하게 합니다.

**예상 결과**:

```
VERIFICATION: Running quick checks...
Build:    OK
Types:    OK

CHECKPOINT CREATED: feature-start
Time:     2026-01-25-14:30
Git SHA:  abc1234
Logged to: .claude/checkpoints.log
```

Checkpoint는 다음을 수행합니다:
1. 먼저 `/verify quick` 실행 (빌드와 타입만 검사)
2. git stash 또는 commit 생성 (이름: `checkpoint-feature-start`)
3. `.claude/checkpoints.log`에 기록

### 2단계: 핵심 기능 구현

코드 작성을 시작하여 핵심 로직을 완성합니다.

### 3단계: 마일스톤 checkpoint 생성

핵심 기능 완료 후:

```bash
/checkpoint create "core-done"
```

**왜 필요한가**
마일스톤을 기록하여 롤백을 용이하게 합니다.

**예상 결과**:

```
CHECKPOINT CREATED: core-done
Time:     2026-01-25-16:45
Git SHA:  def5678
Logged to: .claude/checkpoints.log
```

### 4단계: 검증과 비교

현재 상태가 목표에서 벗어났는지 검증:

```bash
/checkpoint verify "feature-start"
```

**왜 필요한가**
시작부터 현재까지 품질 지표의 변화를 비교합니다.

**예상 결과**:

```
CHECKPOINT COMPARISON: feature-start
=====================================
Files changed: 12
Tests: +25 passed / -0 failed
Coverage: +15% / -2% (from 60% to 75%)
Build: PASS
Status: ✅ Quality improved
```

### 5단계: 모든 checkpoints 보기

기록된 checkpoint 기록 보기:

```bash
/checkpoint list
```

**예상 결과**:

```
CHECKPOINTS HISTORY
===================
Name           | Time             | Git SHA  | Status
---------------|------------------|----------|--------
feature-start  | 2026-01-25-14:30 | abc1234  | behind
core-done      | 2026-01-25-16:45 | def5678  | current
```

**체크포인트 ✅**: 이해 검증

- Checkpoint는 자동으로 `/verify quick`를 실행하나요? ✅ 예
- Checkpoint는 어느 파일에 기록되나요? ✅ `.claude/checkpoints.log`
- `/checkpoint verify`는 어떤 지표를 비교하나요? ✅ 파일 변경, 테스트 통과율, 커버리지

---

## 따라하기: Verify 명령어 사용

### 1단계: 빠른 검증 실행

개발 과정에서 빈번하게 빠른 검증 실행:

```bash
/verify quick
```

**왜 필요한가**
빌드와 타입만 검사하여 가장 빠릅니다.

**예상 결과**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK

Ready for next task: YES
```

### 2단계: 포괄적 검증 실행

PR 제출 준비 전, 완전한 검사 실행:

```bash
/verify full
```

**왜 필요한가**
모든 품질 관문을 포괄적으로 검사합니다.

**예상 결과**:

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

### 3단계: PR 전 검증 실행

가장 엄격한 검사, 보안 스캔 포함:

```bash
/verify pre-pr
```

**예상 결과**:

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

### 4단계: 문제 수정 후 재검증

문제를 수정한 후 다시 검증:

```bash
/verify full
```

**예상 결과**:

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

**체크포인트 ✅**: 이해 검증

- `/verify quick`은 무엇만 검사하나요? ✅ 빌드와 타입
- `/verify full`은 어떤 항목을 검사하나요? ✅ 빌드, 타입, Lint, 테스트, Secrets, Console.log, Git 상태
- 어떤 검증 모드가 보안 스캔을 포함하나요? ✅ `pre-pr`

---

## 따라하기: Evals 사용（Eval-Driven Development）

### 1단계: Evals 정의（코드 작성 전）

**코딩을 시작하기 전, 먼저 성공 기준 정의**:

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

**왜 필요한가**
성공 기준을 먼저 정의하여 "완료의 기준은 무엇인가"를 강제로 생각하게 합니다.

저장 경로: `.claude/evals/user-authentication.md`

### 2단계: 기능 구현

evals를 기준으로 코드 작성.

### 3단계: 기능 Evals 실행

새 기능이 evals를 충족하는지 테스트:

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

### 4단계: 회귀 Evals 실행

기존 기능 파손 방지:

```bash
npm test -- --testPathPattern="existing"
```

**예상 결과**:

```
PASS  existing/auth.test.ts
PASS  existing/api.test.ts
PASS  existing/db.test.ts

All regression tests: 15/15 passed
```

### 5단계: Eval 보고서 생성

결과 요약:

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

**체크포인트 ✅**: 이해 검증

- Evals는 언제 정의해야 하나요? ✅ 코드 작성 전
- capability evals와 regression evals의 차이점은? ✅ 전자는 새 기능 테스트, 후자는 기존 기능 파손 방지
- pass@3의 의미는? ✅ 3회 시도 내 성공 확률

---

## 주의해야 할 함정

### 함정 1: checkpoint 생성 잊음

**문제**: 개발을 일정 시간 한 후, 특정 상태로 돌아가고 싶지만 기록이 없습니다.

**해결**: 모든 새 기능 시작 전 checkpoint 생성:

```bash
# 좋은 습관: 새 기능 시작 전
/checkpoint create "feature-name-start"

# 좋은 습관: 모든 마일스톤
/checkpoint create "phase-1-done"
/checkpoint create "phase-2-done"
```

### 함정 2: Evals 정의가 너무 모호함

**문제**: Evals가 모호하게 작성되어 검증할 수 없습니다.

**잘못된 예시**:
```markdown
- [ ] 사용자가 로그인할 수 있음
```

**올바른 예시**:
```markdown
- [ ] User can login with valid credentials
  Task: POST /api/login with email="test@example.com", password="Test123!"
  Expected: HTTP 200 with JWT token in response body
  Actual: ___________
```

### 함정 3: PR 제출 전에만 검증 실행

**문제**: PR 전에야 문제를 발견하여 수정 비용이 높습니다.

**해결**: 지속적 검증 습관 구축:

```
15분마다 실행: /verify quick
기능 완료 시: /checkpoint create "milestone"
PR 제출 전:   /verify pre-pr
```

### 함정 4: Evals 업데이트 안 함

**문제**: 요구사항 변경 후 Evals가 여전히 예전 상태라 검증이 무력화됩니다.

**해결**: Evals는 "1급 코드", 요구사항 변경 시 동기 업데이트:

```bash
# 요구사항 변경 → Evals 업데이트 → 코드 업데이트
1. .claude/evals/feature-name.md 수정
2. 새 evals에 따라 코드 수정
3. evals 재실행
```

---

## 이 강의 요약

검증 루프는 코드 품질을 유지하는 체계적인 방법입니다:

| 메커니즘 | 역할 | 사용 빈도 |
|--- | --- | ---|
| **PostToolUse Hooks** | 실시간 오류 캡처 | 모든 도구 호출 시 |
| **`/verify`** | 주기적 포괄적 검사 | 15분마다 |
| **`/checkpoint`** | 마일스톤 기록과 비교 | 모든 기능 단계 |
| **Evals** | 기능 검증과 회귀 테스트 | 모든 새 기능 |

핵심 원칙:
1. **먼저 정의, 후 구현**（Evals）
2. **빈번한 검증, 지속적 개선**（`/verify`）
3. **마일스톤 기록, 롤백 용이**（`/checkpoint`）

---

## 다음 강의 예고

> 다음 강의에서는 **[커스텀 Rules: 프로젝트 전용 규칙 구축](../custom-rules/)**을 학습합니다.
>
> 배우게 될 내용:
> - 커스텀 Rules 파일 생성 방법
> - Rule 파일 형식과 체크리스트 작성
> - 프로젝트별 보안 규칙 정의
> - 팀 표준을 코드 리뷰 프로세스에 통합

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 |
|--- | --- | ---|
| Checkpoint 명령어 정의 | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify 명령어 정의 | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Verification Loop Skill | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| Eval Harness Skill | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |

**핵심 프로세스**:
- Checkpoint 생성 프로세스: 먼저 `/verify quick` 실행 → git stash/commit 생성 → `.claude/checkpoints.log`에 기록
- Verify 검증 프로세스: Build Check → Type Check → Lint Check → Test Suite → Console.log Audit → Git Status
- Eval 워크플로우: Define（evals 정의）→ Implement（코드 구현）→ Evaluate（evals 실행）→ Report（보고서 생성）

**핵심 파라미터**:
- `/checkpoint [create|verify|list] [name]` - Checkpoint 작업
- `/verify [quick|full|pre-commit|pre-pr]` - 검증 모드
- pass@3 - 3회 시도 내 성공 목표（>90%）
- pass^3 - 3회 연속 성공（100%, 핵심 경로용）

</details>
