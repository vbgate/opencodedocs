---
title: "Rules: 8가지 규칙 세트 상세 가이드 | everything-claude-code"
sidebarTitle: "8가지 규칙 빠른 참조"
subtitle: "Rules: 8가지 규칙 세트 상세 가이드 | everything-claude-code"
description: "everything-claude-code의 8가지 규칙 세트를 학습하세요. 보안, 코드 스타일, 테스트, Git 워크플로우, 성능 최적화, Agent 사용, 디자인 패턴, Hooks 시스템을 포함합니다."
tags:
  - "rules"
  - "security"
  - "coding-style"
  - "testing"
  - "git-workflow"
  - "performance"
prerequisite:
  - "start-quickstart"
order: 200
---

# Rules 완전 참조: 8가지 규칙 세트 상세 가이드

## 학습 완료 후 할 수 있는 것

- 모든 8가지 필수 규칙 세트를 빠르게 찾고 이해하기
- 개발 과정에서 보안, 코드 스타일, 테스트 등의 규범을 올바르게 적용하기
- 규칙을 준수하는 데 도움이 되는 Agent를 언제 사용할지 알기
- 성능 최적화 전략과 Hooks 시스템의 작동 원리 이해하기

## 현재 당신이 겪고 있는 문제

프로젝트의 8가지 규칙 세트를 마주하면 다음과 같은 어려움을 겪을 수 있습니다:

- **모든 규칙을 기억할 수 없음**: security, coding-style, testing, git-workflow... 어떤 것을 반드시 준수해야 할까?
- **적용 방법을 모름**: 규칙에서 불변 패턴, TDD 프로세스를 언급하지만 구체적으로 어떻게 해야 할까?
- **누구에게 도움을 요청해야 할지 모름**: 보안 문제가 발생하면 어떤 Agent를 사용할까? 코드 리뷰는 누구에게 요청할까?
- **성능과 보안의 균형**: 코드 품질을 보장하면서 개발 효율성을 최적화하려면 어떻게 해야 할까?

이 참조 문서는 각 규칙 세트의 내용, 적용 시나리오, 해당 Agent 도구를 포괄적으로 이해하는 데 도움을 줍니다.

---

## Rules 개요

Everything Claude Code는 8가지 필수 규칙 세트를 포함하며, 각 규칙 세트는 명확한 목표와 적용 시나리오를 가지고 있습니다:

| 규칙 세트 | 목표 | 우선순위 | 해당 Agent |
| --- | --- | --- | --- |
| **Security** | 보안 취약점, 민감 데이터 유출 방지 | P0 | security-reviewer |
| **Coding Style** | 코드 가독성, 불변 패턴, 작은 파일 | P0 | code-reviewer |
| **Testing** | 80%+ 테스트 커버리지, TDD 프로세스 | P0 | tdd-guide |
| **Git Workflow** | 표준 커밋, PR 프로세스 | P1 | code-reviewer |
| **Agents** | 서브 에이전트 올바르게 사용 | P1 | N/A |
| **Performance** | Token 최적화, 컨텍스트 관리 | P1 | N/A |
| **Patterns** | 디자인 패턴, 아키텍처 모범 사례 | P2 | architect |
| **Hooks** | Hooks 이해 및 사용 | P2 | N/A |

::: info 규칙 우선순위 설명

- **P0 (중요)**: 반드시 엄격히 준수해야 하며, 위반 시 보안 위험 또는 코드 품질 심각한 저하 초래
- **P1 (중요)**: 준수해야 하며, 개발 효율성과 팀 협업에 영향
- **P2 (권장)**: 준수를 권장하며, 코드 아키텍처와 유지보수성 향상
:::

---

## 1. Security (보안 규칙)

### 필수 보안 검사

**모든 커밋 전에** 다음 검사를 완료해야 합니다:

- [ ] 하드코딩된 키 없음 (API keys, 비밀번호, tokens)
- [ ] 모든 사용자 입력 검증됨
- [ ] SQL 인젝션 방지 (매개변수화된 쿼리)
- [ ] XSS 방지 (HTML 정리)
- [ ] CSRF 보호 활성화됨
- [ ] 인증/권한 부여 검증됨
- [ ] 모든 엔드포인트에 속도 제한 있음
- [ ] 오류 메시지가 민감한 데이터를 유출하지 않음

### 키 관리

**❌ 잘못된 방법**: 하드코딩된 키

```typescript
const apiKey = "sk-proj-xxxxx"
```

**✅ 올바른 방법**: 환경 변수 사용

```typescript
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### 보안 대응 프로토콜

보안 문제를 발견한 경우:

1. **즉시 중단** 현재 작업
2. **security-reviewer** agent를 사용하여 전면 분석
3. 계속하기 전에 CRITICAL 문제 수정
4. 노출된 키 교체
5. 전체 코드베이스에서 유사한 문제 확인

::: tip 보안 Agent 사용

`/code-review` 명령을 사용하면 자동으로 security-reviewer 검사가 트리거되어 코드가 보안 규범을 준수하는지 확인합니다.
:::

---

## 2. Coding Style (코드 스타일 규칙)

### 불변성 (CRITICAL)

**항상 새 객체를 생성하고, 기존 객체를 절대 수정하지 마세요**:

**❌ 잘못된 방법**: 객체 직접 수정

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ 올바른 방법**: 새 객체 생성

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### 파일 구조

**많은 작은 파일 > 적은 큰 파일**:

- **높은 응집도, 낮은 결합도**
- **일반적으로 200-400줄, 최대 800줄**
- 대형 컴포넌트에서 유틸리티 함수 추출
- 타입별이 아닌 기능/도메인별로 구성

### 오류 처리

**항상 포괄적으로 오류 처리**:

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### 입력 검증

**항상 사용자 입력 검증**:

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### 코드 품질 검사 체크리스트

작업 완료로 표시하기 전에 다음을 확인해야 합니다:

- [ ] 코드가 읽기 쉽고 명명이 명확함
- [ ] 함수가 작음 (< 50줄)
- [ ] 파일이 집중됨 (< 800줄)
- [ ] 깊은 중첩 없음 (> 4단계)
- [ ] 올바른 오류 처리
- [ ] console.log 문 없음
- [ ] 하드코딩된 값 없음
- [ ] 직접 수정 없음 (불변 패턴 사용)

---

## 3. Testing (테스트 규칙)

### 최소 테스트 커버리지: 80%

**모든 테스트 유형을 포함해야 합니다**:

1. **단위 테스트** - 독립 함수, 유틸리티 함수, 컴포넌트
2. **통합 테스트** - API 엔드포인트, 데이터베이스 작업
3. **E2E 테스트** - 주요 사용자 흐름 (Playwright)

### 테스트 주도 개발 (TDD)

**필수 워크플로우**:

1. 먼저 테스트 작성 (RED)
2. 테스트 실행 - 실패해야 함
3. 최소 구현 작성 (GREEN)
4. 테스트 실행 - 통과해야 함
5. 리팩토링 (IMPROVE)
6. 커버리지 검증 (80%+)

### 테스트 문제 해결

1. **tdd-guide** agent 사용
2. 테스트 격리성 확인
3. mocks가 올바른지 검증
4. 구현 수정, 테스트 수정 안 함 (테스트 자체가 잘못된 경우 제외)

### Agent 지원

- **tdd-guide** - 새 기능에 적극적으로 사용, 먼저 테스트 작성 강제
- **e2e-runner** - Playwright E2E 테스트 전문가

::: tip TDD 명령 사용

`/tdd` 명령을 사용하면 자동으로 tdd-guide agent가 호출되어 완전한 TDD 프로세스를 안내합니다.
:::

---

## 4. Git Workflow (Git 워크플로우 규칙)

### 커밋 메시지 형식

```
<type>: <description>

<optional body>
```

**타입**: feat, fix, refactor, docs, test, chore, perf, ci

::: info 커밋 메시지

커밋 메시지의 attribution은 `~/.claude/settings.json`을 통해 전역적으로 비활성화되었습니다.
:::

### Pull Request 워크플로우

PR 생성 시:

1. 전체 커밋 히스토리 분석 (최신 커밋만이 아님)
2. `git diff [base-branch]...HEAD`를 사용하여 모든 변경 사항 확인
3. 포괄적인 PR 요약 작성
4. 테스트 계획 및 TODOs 포함
5. 새 브랜치인 경우 `-u` 플래그로 푸시

### 기능 구현 워크플로우

#### 1. 계획 우선

- **planner** agent를 사용하여 구현 계획 생성
- 의존성 및 위험 식별
- 여러 단계로 분해

#### 2. TDD 접근

- **tdd-guide** agent 사용
- 먼저 테스트 작성 (RED)
- 테스트를 통과하도록 구현 (GREEN)
- 리팩토링 (IMPROVE)
- 80%+ 커버리지 검증

#### 3. 코드 리뷰

- 코드 작성 후 즉시 **code-reviewer** agent 사용
- CRITICAL 및 HIGH 문제 수정
- 가능한 한 MEDIUM 문제 수정

#### 4. 커밋 및 푸시

- 상세한 커밋 메시지
- conventional commits 형식 준수

---

## 5. Agents (Agent 규칙)

### 사용 가능한 Agents

`~/.claude/agents/`에 위치:

| Agent | 용도 | 사용 시기 |
| --- | --- | --- |
| planner | 구현 계획 | 복잡한 기능, 리팩토링 |
| architect | 시스템 설계 | 아키텍처 결정 |
| tdd-guide | 테스트 주도 개발 | 새 기능, 버그 수정 |
| code-reviewer | 코드 리뷰 | 코드 작성 후 |
| security-reviewer | 보안 분석 | 커밋 전 |
| build-error-resolver | 빌드 오류 수정 | 빌드 실패 시 |
| e2e-runner | E2E 테스트 | 주요 사용자 흐름 |
| refactor-cleaner | 죽은 코드 정리 | 코드 유지보수 |
| doc-updater | 문서 업데이트 | 문서 업데이트 |

### 즉시 Agent 사용

**사용자 프롬프트 없이**:

1. 복잡한 기능 요청 - **planner** agent 사용
2. 코드 방금 작성/수정 - **code-reviewer** agent 사용
3. 버그 수정 또는 새 기능 - **tdd-guide** agent 사용
4. 아키텍처 결정 - **architect** agent 사용

### 병렬 작업 실행

**독립적인 작업에는 항상 병렬 작업 실행 사용**:

| 방식 | 설명 |
| --- | --- |
| ✅ 좋음: 병렬 실행 | 3개의 agents를 병렬로 시작: Agent 1 (auth.ts 보안 분석), Agent 2 (캐시 시스템 성능 검토), Agent 3 (utils.ts 타입 검사) |
| ❌ 나쁨: 순차 실행 | 먼저 agent 1 실행, 그 다음 agent 2, 그 다음 agent 3 |

### 다각도 분석

복잡한 문제의 경우 역할별 서브 에이전트 사용:

- 사실 검토자
- 고급 엔지니어
- 보안 전문가
- 일관성 검토자
- 중복 검사자

---

## 6. Performance (성능 최적화 규칙)

### 모델 선택 전략

**Haiku 4.5** (Sonnet 능력의 90%, 비용 3배 절감):

- 경량 agent, 빈번한 호출
- 페어 프로그래밍 및 코드 생성
- 다중 에이전트 시스템의 worker agents

**Sonnet 4.5** (최고의 코딩 모델):

- 주요 개발 작업
- 다중 에이전트 워크플로우 조정
- 복잡한 코딩 작업

**Opus 4.5** (가장 깊은 추론):

- 복잡한 아키텍처 결정
- 최대 추론 요구
- 연구 및 분석 작업

### 컨텍스트 윈도우 관리

**컨텍스트 윈도우의 마지막 20% 사용 피하기**:

- 대규모 리팩토링
- 여러 파일에 걸친 기능 구현
- 복잡한 상호작용 디버깅

**낮은 컨텍스트 민감도 작업**:

- 단일 파일 편집
- 독립 도구 생성
- 문서 업데이트
- 간단한 버그 수정

### Ultrathink + Plan Mode

깊은 추론이 필요한 복잡한 작업의 경우:

1. `ultrathink`를 사용하여 향상된 사고
2. **Plan Mode**를 활성화하여 구조화된 접근
3. 다중 라운드 비평을 위한 "엔진 재시작"
4. 다양한 분석을 위한 역할별 서브 에이전트 사용

### 빌드 문제 해결

빌드 실패 시:

1. **build-error-resolver** agent 사용
2. 오류 메시지 분석
3. 단계별 수정
4. 각 수정 후 검증

---

## 7. Patterns (일반 패턴 규칙)

### API 응답 형식

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### 커스텀 Hooks 패턴

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Repository 패턴

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### 스켈레톤 프로젝트

새 기능 구현 시:

1. 실전 검증된 스켈레톤 프로젝트 검색
2. 병렬 agents를 사용하여 옵션 평가:
   - 보안 평가
   - 확장성 분석
   - 관련성 점수
   - 구현 계획
3. 최적의 매치를 기반으로 클론
4. 검증된 구조에서 반복

---

## 8. Hooks (Hooks 시스템 규칙)

### Hook 타입

- **PreToolUse**: 도구 실행 전 (검증, 매개변수 수정)
- **PostToolUse**: 도구 실행 후 (자동 포맷팅, 검사)
- **Stop**: 세션 종료 시 (최종 검증)

### 현재 Hooks (~/.claude/settings.json에 있음)

#### PreToolUse

- **tmux 알림**: 장시간 실행 명령에 tmux 사용 제안 (npm, pnpm, yarn, cargo 등)
- **git push 검토**: 푸시 전 Zed에서 검토 열기
- **문서 차단기**: 불필요한 .md/.txt 파일 생성 차단

#### PostToolUse

- **PR 생성**: PR URL 및 GitHub Actions 상태 기록
- **Prettier**: 편집 후 JS/TS 파일 자동 포맷팅
- **TypeScript 검사**: .ts/.tsx 파일 편집 후 tsc 실행
- **console.log 경고**: 편집된 파일의 console.log 경고

#### Stop

- **console.log 감사**: 세션 종료 전 모든 수정된 파일의 console.log 확인

### 자동 수락 권한

**신중하게 사용**:

- 신뢰할 수 있고 명확하게 정의된 계획에 대해 활성화
- 탐색 작업 시 비활성화
- dangerously-skip-permissions 플래그 절대 사용 안 함
- 대신 `~/.claude.json`에서 `allowedTools` 구성

### TodoWrite 모범 사례

TodoWrite 도구를 사용하여:

- 다단계 작업의 진행 상황 추적
- 지침에 대한 이해 검증
- 실시간 안내 활성화
- 세밀한 구현 단계 표시

Todo 목록이 드러내는 것:

- 순서가 잘못된 단계
- 누락된 항목
- 추가 불필요한 항목
- 잘못된 세분성
- 오해된 요구사항

---

## 다음 강의 예고

> 다음 강의에서는 **[Skills 완전 참조](../skills-reference/)**를 학습합니다.
>
> 배울 내용:
> - 11개 스킬 라이브러리의 완전한 참조
> - 코딩 표준, 백엔드/프론트엔드 패턴, 지속적 학습 등의 스킬
> - 다양한 작업에 적합한 스킬을 선택하는 방법

---

## 이 강의 요약

Everything Claude Code의 8가지 규칙 세트는 개발 프로세스에 대한 포괄적인 지침을 제공합니다:

1. **Security** - 보안 취약점 및 민감한 데이터 유출 방지
2. **Coding Style** - 코드 가독성, 불변성, 작은 파일 보장
3. **Testing** - 80%+ 커버리지 및 TDD 프로세스 강제
4. **Git Workflow** - 표준 커밋 및 PR 프로세스
5. **Agents** - 9개의 전문화된 서브 에이전트의 올바른 사용 안내
6. **Performance** - Token 사용 및 컨텍스트 관리 최적화
7. **Patterns** - 일반적인 디자인 패턴 및 모범 사례 제공
8. **Hooks** - 자동화 훅 시스템의 작동 원리 설명

이러한 규칙은 제약이 아니라 고품질, 안전하고 유지보수 가능한 코드를 작성하는 데 도움이 되는 지침입니다. 해당 Agents (예: code-reviewer, security-reviewer)를 사용하면 이러한 규칙을 자동으로 준수하는 데 도움이 됩니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| Security 규칙 | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Coding Style 규칙 | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Testing 규칙 | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Git Workflow 규칙 | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Agents 규칙 | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Performance 규칙 | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Patterns 규칙 | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks 규칙 | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |

**핵심 규칙**:
- **Security**: 하드코딩된 비밀 없음, OWASP Top 10 검사
- **Coding Style**: 불변 패턴, 파일 < 800줄, 함수 < 50줄
- **Testing**: 80%+ 테스트 커버리지, TDD 프로세스 강제
- **Performance**: 모델 선택 전략, 컨텍스트 윈도우 관리

**관련 Agents**:
- **security-reviewer**: 보안 취약점 탐지
- **code-reviewer**: 코드 품질 및 스타일 검토
- **tdd-guide**: TDD 프로세스 안내
- **planner**: 구현 계획

</details>
