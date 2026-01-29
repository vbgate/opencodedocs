---
title: "Ultrawork 모드: 모든 기능 활성화 | oh-my-opencode"
sidebarTitle: "Ultrawork 모드"
subtitle: "Ultrawork 모드: 하나의 명령으로 모든 기능 활성화"
description: "oh-my-opencode의 Ultrawork 모드를 배워 하나의 명령으로 모든 기능을 활성화하세요. 병렬 에이전트, 강제 완료, Category + Skills 시스템을 활성화합니다."
tags:
  - "ultrawork"
  - "백그라운드 작업"
  - "에이전트 협업"
prerequisite:
  - "/ko/code-yeongyu/oh-my-opencode/start/installation/"
  - "/ko/code-yeongyu/oh-my-opencode/start/sisyphus-orchestrator/"
order: 30
---

# Ultrawork 모드: 하나의 명령으로 모든 기능 활성화

## 학습 내용

- 하나의 명령으로 oh-my-opencode의 모든 고급 기능 활성화
- 여러 AI 에이전트가 실제 팀처럼 병렬로 작동하도록 설정
- 여러 에이전트와 백그라운드 작업을 수동으로 구성하는 번거로움 방지
- Ultrawork 모드의 설계 철학과 모범 사례 이해

## 현재 겪고 있는 문제

개발 중에 다음 상황에 직면했을 수 있습니다:

- **너무 많은 기능, 사용법을 모름**: 10개의 전문 에이전트, 백그라운드 작업, LSP 도구가 있지만 빠르게 활성화하는 방법을 모름
- **수동 구성 필요**: 모든 복잡한 작업마다 에이전트, 백그라운드 동시성 등 설정을 수동으로 지정해야 함
- **비효율적인 에이전트 협업**: 에이전트를 순차적으로 호출하여 시간과 비용 낭비
- **작업이 중간에 멈춤**: 에이전트가 작업을 완료할 충분한 동기와 제약이 없음

이 모든 것이 oh-my-opencode의 진정한 힘을 발휘하는 데 방해가 되고 있습니다.

## 핵심 개념

**Ultrawork 모드**는 oh-my-opencode의 "원클릭 전체 활성화" 메커니즘입니다.

::: info Ultrawork 모드란?
Ultrawork 모드는 키워드로 트리거되는 특수 작업 모드입니다. 프롬프트에 `ultrawork` 또는 약어 `ulw`가 포함되면 시스템이 자동으로 모든 고급 기능을 활성화합니다: 병렬 백그라운드 작업, 깊은 탐색, 강제 완료, 다중 에이전트 협업 등.
:::

### 설계 철학

Ultrawork 모드는 다음 핵심 원칙을 기반으로 합니다 ([Ultrawork 선언문](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) 참조):

| 원칙 | 설명 |
|-----------|-------------|
| **사람 개입은 실패 신호** | AI 출력을 지속적으로 수정해야 한다면 시스템 설계에 문제가 있다는 의미 |
| **구별할 수 없는 코드** | AI가 작성한 코드는 시니어 엔지니어가 작성한 코드와 구별할 수 없어야 함 |
| **인지 부하 최소화** | "무엇을 할지"만 말하면 에이전트가 "어떻게 할지"를 담당 |
| **예측 가능하고 일관적이며 위임 가능** | 에이전트는 컴파일러처럼 안정적이고 신뢰할 수 있어야 함 |

### 활성화 메커니즘

시스템이 `ultrawork` 또는 `ulw` 키워드를 감지하면:

1. **최대 정밀도 모드 설정**: `message.variant = "max"`
2. **Toast 알림 표시**: "Ultrawork Mode Activated - Maximum precision engaged. All agents at your disposal."
3. **완전한 지침 주입**: 에이전트에 200줄 이상의 ULTRAWORK 지침 주입:
   - 구현 시작 전 100% 확신 요구
   - 백그라운드 작업 병렬 사용 요구
   - Category + Skills 시스템 강제 사용
   - 완료 검증 강제 (TDD 워크플로우)
   - "할 수 없음"이라는 변명 금지

## 실습

### 1단계: Ultrawork 모드 트리거

OpenCode에서 `ultrawork` 또는 `ulw` 키워드가 포함된 프롬프트 입력:

```
ultrawork develop a REST API
```

또는 더 간결하게:

```
ulw add user authentication
```

**다음을 확인해야 합니다**:
- 인터페이스에 Toast 알림 팝업: "Ultrawork Mode Activated"
- 에이전트 응답이 "ULTRAWORK MODE ENABLED!"로 시작

### 2단계: 에이전트 동작 변화 관찰

Ultrawork 모드 활성화 후 에이전트는 다음을 수행합니다:

1. **코드베이스 병렬 탐색**
   ```
   delegate_task(agent="explore", prompt="find existing API patterns", background=true)
   delegate_task(agent="explore", prompt="find test infrastructure", background=true)
   delegate_task(agent="librarian", prompt="find authentication best practices", background=true)
   ```

2. **Plan 에이전트 호출하여 작업 계획 생성**
   ```
   delegate_task(subagent_type="plan", prompt="create detailed plan based on gathered context")
   ```

3. **Category + Skills 사용하여 작업 실행**
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"], ...)
   ```

**다음을 확인해야 합니다**:
- 여러 백그라운드 작업이 동시에 실행
- 에이전트가 전문 에이전트(Oracle, Librarian, Explore)를 적극적으로 호출
- 완전한 테스트 계획과 작업 분해
- 작업이 100% 완료될 때까지 계속 실행

### 3단계: 작업 완료 검증

에이전트 완료 후 다음을 수행합니다:

1. **검증 증거 표시**: 실제 테스트 실행 출력, 수동 검증 설명
2. **모든 TODO 완료 확인**: 조기 완료 선언하지 않음
3. **완료된 작업 요약**: 수행한 작업과 이유 나열

**다음을 확인해야 합니다**:
- 명확한 테스트 결과 ("작동해야 함"이 아님)
- 모든 문제 해결됨
- 미완료 TODO 목록 없음

## 체크포인트 ✅

위 단계 완료 후 다음을 확인:

- [ ] `ulw` 입력 후 Toast 알림 표시
- [ ] 에이전트 응답이 "ULTRAWORK MODE ENABLED!"로 시작
- [ ] 병렬 백그라운드 작업 실행 관찰
- [ ] 에이전트가 Category + Skills 시스템 사용
- [ ] 작업 완료 후 검증 증거 존재

항목 실패 시 다음 확인:
- 키워드 철자가 올바른지 (`ultrawork` 또는 `ulw`)
- 메인 세션에 있는지 (백그라운드 작업은 모드 트리거하지 않음)
- 구성 파일에서 관련 기능이 활성화되어 있는지

## 언제 이 기법을 사용할까

| 시나리오 | Ultrawork 사용 | 일반 모드 |
|----------|--------------|-------------|
| **복잡한 새 기능** | ✅ 권장 (다중 에이전트 협업 필요) | ❌ 효율성 부족 |
| **긴급 수정** | ✅ 권장 (빠른 진단과 탐색 필요) | ❌ 컨텍스트 누락 가능 |
| **간단한 수정** | ❌ 과도함 (자원 낭비) | ✅ 더 적합 |
| **빠른 아이디어 검증** | ❌ 과도함 | ✅ 더 적합 |

**경험칙**:
- 작업이 여러 모듈이나 시스템과 관련 → `ulw` 사용
- 코드베이스 깊은 연구 필요 → `ulw` 사용
- 여러 전문 에이전트 호출 필요 → `ulw` 사용
- 단일 파일 작은 변경 → `ulw` 불필요

## 일반적인 실수

::: warning 중요 참고사항

**1. 모든 프롬프트에 `ulw` 사용하지 마세요**

Ultrawork 모드는 많은 지침을 주입하므로 간단한 작업에는 과도합니다. 진정으로 다중 에이전트 협업, 병렬 탐색, 깊은 분석이 필요한 복잡한 작업에만 사용하세요.

**2. 백그라운드 작업은 Ultrawork 모드를 트리거하지 않습니다**

키워드 감지기는 백그라운드 세션을 건너뛰어 모드가 하위 에이전트에 잘못 주입되는 것을 방지합니다. Ultrawork 모드는 메인 세션에서만 작동합니다.

**3. Provider 구성이 올바른지 확인하세요**

Ultrawork 모드는 여러 AI 모델이 병렬로 작동하는 것에 의존합니다. 특정 Provider가 구성되지 않았거나 사용할 수 없는 경우 에이전트가 전문 에이전트를 호출할 수 없을 수 있습니다.
:::

## 수업 요약

Ultrawork 모드는 키워드 트리거를 통해 "하나의 명령으로 모든 기능 활성화"라는 설계 목표를 달성합니다:

- **사용 쉬움**: `ulw` 입력만으로 활성화
- **자동 협업**: 에이전트가 자동으로 다른 에이전트를 호출하고 백그라운드 작업을 병렬로 실행
- **강제 완료**: 완전한 검증 메커니즘으로 100% 완료 보장
- **제로 구성**: 에이전트 우선순위, 동시성 제한 등 수동 설정 불필요

기억하세요: Ultrawork 모드는 에이전트가 실제 팀처럼 작동하도록 설계되었습니다. 의도만 표현하면 에이전트가 실행을 담당합니다.

## 다음 수업 미리보기

> 다음 수업에서 **[Provider 구성](../../platforms/provider-setup/)**을 배웁니다.
>
> 학습 내용:
> - Anthropic, OpenAI, Google와 같은 여러 Provider 구성 방법
> - 다중 모델 전략이 자동으로 저하되고 최적 모델을 선택하는 방법
> - Provider 연결 및 할당량 사용 테스트 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 펼치기</strong></summary>

> 마지막 업데이트: 2026-01-26

| 기능 | 파일 경로 | 줄 번호 |
|---------|-----------|--------------|
| Ultrawork 설계 철학 | [`docs/ultrawork-manifesto.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) | 1-198 |
| 키워드 감지기 Hook | [`src/hooks/keyword-detector/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/index.ts) | 12-100 |
| ULTRAWORK 지침 템플릿 | [`src/hooks/keyword-detector/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/constants.ts) | 54-280 |
| 키워드 감지 로직 | [`src/hooks/keyword-detector/detector.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/detector.ts) | 26-53 |

**핵심 상수**:
- `KEYWORD_DETECTORS`: 키워드 감지기 구성, 세 가지 모드 포함: ultrawork, search, analyze
- `CODE_BLOCK_PATTERN`: 코드 블록 정규식 패턴, 코드 블록 내 키워드 필터링에 사용
- `INLINE_CODE_PATTERN`: 인라인 코드 정규식 패턴, 인라인 코드 내 키워드 필터링에 사용

**핵심 함수**:
- `createKeywordDetectorHook()`: 키워드 감지기 Hook 생성, UserPromptSubmit 이벤트 수신
- `detectKeywordsWithType()`: 텍스트에서 키워드 감지 및 유형 반환 (ultrawork/search/analyze)
- `getUltraworkMessage()`: 완전한 ULTRAWORK 모드 지침 생성 (에이전트 유형에 따라 Planner 또는 일반 모드 선택)
- `removeCodeBlocks()`: 코드 블록 제거하여 코드 블록 내 키워드 트리거 방지

**비즈니스 규칙**:
| 규칙 ID | 규칙 설명 | 태그 |
|---------|------------------|-----|
| BR-4.8.4-1 | "ultrawork" 또는 "ulw" 감지 시 Ultrawork 모드 활성화 | [Fact] |
| BR-4.8.4-2 | Ultrawork 모드는 `message.variant = "max"` 설정 | [Fact] |
| BR-4.8.4-3 | Ultrawork 모드는 Toast 알림 표시: "Ultrawork Mode Activated" | [Fact] |
| BR-4.8.4-4 | 백그라운드 작업 세션은 키워드 감지 건너뛰어 모드 주입 방지 | [Fact] |
| BR-4.8.4-5 | 비메인 세션은 ultrawork 키워드만 허용, 다른 모드 주입 차단 | [Fact] |

</details>
