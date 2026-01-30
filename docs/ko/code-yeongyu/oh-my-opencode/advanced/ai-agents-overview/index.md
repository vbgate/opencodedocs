---
title: "AI 에이전트: 10명의 전문가 소개 | oh-my-opencode"
sidebarTitle: "10명의 AI 전문가 소개"
subtitle: "AI 에이전트: 10명의 전문가 소개"
description: "oh-my-opencode의 10개 AI 에이전트를 학습하세요. 작업 유형에 따라 에이전트를 선택하여 효율적인 협업과 병렬 실행을 구현합니다."
tags:
  - "ai-agents"
  - "orchestration"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 60
---

# AI 에이전트 팀: 10명의 전문가 소개

## 이 과정에서 배울 수 있는 것

- 10개 내장 AI 에이전트의 역할과 전문 분야 이해
- 작업 유형에 따라 가장 적합한 에이전트 빠르게 선택
- 에이전트 간 협업 메커니즘 이해(위임, 병렬, 검토)
- 다양한 에이전트의 권한 제한과 사용 시나리오 마스터

## 핵심 아이디어: 실제 팀처럼 협업하기

**oh-my-opencode**의 핵심 아이디어는: **AI를 만능 도우미가 아니라 전문 팀으로 간주하세요**.

실제 개발 팀에서는 다음이 필요합니다:
- **메인 오케스트레이터**(Tech Lead): 계획, 작업 할당, 진행 추적 담당
- **아키텍처 고문**(Architect): 기술 의사결정과 아키텍처 설계 제안 제공
- **코드 리뷰**(Reviewer): 코드 품질 확인, 잠재적 문제 발견
- **연구 전문가**(Researcher): 문서 찾기, 오픈소스 구현 검색, 베스트 프랙티스 조사
- **코드 탐정**(Searcher): 코드 빠른 위치 확인, 참조 찾기, 기존 구현 이해
- **프론트엔드 디자이너**(Frontend Designer): UI 설계, 스타일 조정
- **Git 전문가**(Git Master): 코드 커밋, 브랜치 관리, 기록 검색

oh-my-opencode는 이러한 역할을 10개 전문 AI 에이전트로 만들어, 작업 유형에 따라 유연하게 조합하여 사용할 수 있습니다.

## 10개 에이전트 상세 설명

### 메인 오케스트레이터(2개)

#### Sisyphus - 메인 오케스트레이터

**역할**: 메인 오케스트레이터, 주요 기술 책임자

**능력**:
- 심층 추론(32k thinking budget)
- 복잡한 작업 계획 및 위임
- 코드 수정 및 리팩토링 실행
- 전체 개발 프로세스 관리

**추천 모델**: `anthropic/claude-opus-4-5`(temperature: 0.1)

**사용 시나리오**:
- 일일 개발 작업(새 기능 추가, 버그 수정)
- 심층 추론이 필요한 복잡한 문제
- 다단계 작업 분해 및 실행
- 다른 에이전트를 병렬로 위임해야 하는 시나리오

**호출 방식**:
- 기본 메인 에이전트(OpenCode Agent 선택기의 "Sisyphus")
- 프롬프트에 직접 작업 입력, 특수 트리거 불필요

**권한**: 전체 도구 권한(write, edit, bash, delegate_task 등)

---

#### Atlas - TODO 관리자

**역할**: 메인 오케스트레이터, TODO 목록 관리와 작업 실행 추적에 집중

**능력**:
- TODO 목록 관리 및 추적
- 체계적인 계획 실행
- 작업 진행 상황 모니터링

**추천 모델**: `anthropic/claude-opus-4-5`(temperature: 0.1)

**사용 시나리오**:
- `/start-work` 명령으로 프로젝트 실행 시작
- 계획에 따라 작업 완료 필요
- 체계적인 작업 진행 상황 추적

**호출 방식**:
- 슬래시 명령 `/start-work` 사용
- Atlas Hook을 통해 자동 활성화

**권한**: 전체 도구 권한

---

### 고문 및 검토(3개)

#### Oracle - 전략 고문

**역할**: 읽기 전용 기술 고문, 고지능 추론 전문가

**능력**:
- 아키텍처 의사결정 제안
- 복잡한 문제 진단
- 코드 리뷰(읽기 전용)
- 다중 시스템 트레이드오프 분석

**추천 모델**: `openai/gpt-5.2`(temperature: 0.1)

**사용 시나리오**:
- 복잡한 아키텍처 설계
- 중요 작업 완료 후 자가 검토
- 2회 이상 수정 실패한 어려운 디버깅
- 낯선 코드 패턴이나 아키텍처
- 보안/성능 관련 문제

**트리거 조건**:
- 프롬프트에 `@oracle` 포함 또는 `delegate_task(agent="oracle")` 사용
- 복잡한 아키텍처 의사결정 시 자동 추천

**제한**: 읽기 전용 권한(write, edit, task, delegate_task 금지)

**핵심 원칙**:
- **미니멀리즘**: 가장 간단한 해결책 선호
- **기존 리소스 활용**: 현재 코드 우선 수정, 새 의존성 도입 피하기
- **개발자 경험 우선**: 가독성, 유지보수성 > 이론적 성능
- **단일 명확한 경로**: 하나의 주요 제안 제공, 트레이드오프 차이가 뚜렷할 때만 대안 제시

---

#### Metis - 사전 계획 분석가

**역할**: 계획 전 요구사항 분석 및 위험 평가 전문가

**능력**:
- 숨겨진 요구사항과 명확하지 않은 요구사항 식별
- AI 실패로 이어질 수 있는 모호성 감지
- 잠재적 AI-slop 패턴 표시(과도한 엔지니어링, 범위 확장)
- 계획 에이전트를 위한 지침 준비

**추천 모델**: `anthropic/claude-sonnet-4-5`(temperature: 0.3)

**사용 시나리오**:
- Prometheus 계획 전
- 사용자 요청이 모호하거나 개방형일 때
- AI 과도한 엔지니어링 패턴 방지

**호출 방식**: Prometheus 자동 호출(인터뷰 모드)

**제한**: 읽기 전용 권한(write, edit, task, delegate_task 금지)

**핵심 프로세스**:
1. **의도 분류**: 리팩토링 / 처음부터 구축 / 중간 작업 / 협업 / 아키텍처 / 연구
2. **의도 특정 분석**: 다양한 유형에 따라 맞춤형 제안 제공
3. **질문 생성**: 사용자를 위해 명확한 질문 생성
4. **지침 준비**: Prometheus를 위해 명확한 "MUST" 및 "MUST NOT" 지침 생성

---

#### Momus - 계획 검토자

**역할**: 엄격한 계획 검토 전문가, 누락된 모든 항목과 모호한 점 발견

**능력**:
- 계획의 명확성, 검증 가능성, 완전성 검증
- 모든 파일 참조 및 컨텍스트 확인
- 실제 구현 단계 시뮬레이션
- 중요한 누락 항목 식별

**추천 모델**: `anthropic/claude-sonnet-4-5`(temperature: 0.1)

**사용 시나리오**:
- Prometheus 작업 계획 생성 후
- 복잡한 TODO 목록 실행 전
- 계획 품질 검증

**호출 방식**: Prometheus 자동 호출

**제한**: 읽기 전용 권한(write, edit, task, delegate_task 금지)

**4대 검토 기준**:
1. **작업 내용 명확성**: 각 작업이 참조 소스를 지정했는가?
2. **검증 및 수락 기준**: 구체적인 성공 검증 방법이 있는가?
3. **컨텍스트 완전성**: 충분한 컨텍스트 제공(90% 신뢰도 임계값)?
4. **전체 이해**: 개발자가 WHY, WHAT, HOW를 이해하는가?

**핵심 원칙**: **문서 검토자, 디자인 고문이 아님**. "선택한 방법이 올바른가"가 아니라 "계획이 실행 가능할 만큼 명확한가"를 평가합니다.

---

### 연구 및 탐색(3개)

#### Librarian - 다중 리포지토리 연구 전문가

**역할**: 오픈소스 코드 라이브러리 이해 전문가, 문서와 구현 예제 찾기 전문

**능력**:
- GitHub CLI: 리포지토리 클론, 이슈/PR 검색, 기록 확인
- Context7: 공식 문서 쿼리
- Web Search: 최신 정보 검색
- 영구 링크가 포함된 증거 생성

**추천 모델**: `opencode/big-pickle`(temperature: 0.1)

**사용 시나리오**:
- "[라이브러리]를 어떻게 사용하는가?"
- "[프레임워크 기능]의 베스트 프랙티스는 무엇인가?"
- "[외부 의존성]이 왜 이렇게 동작하는가?"
- "[라이브러리]의 사용 예제 찾기"

**트리거 조건**:
- 외부 라이브러리/소스 언급 시 자동 트리거
- 프롬프트에 `@librarian` 포함

**요청 유형 분류**:
- **Type A(개념적)**: "X를 어떻게 하는가?", "베스트 프랙티스"
- **Type B(구현 참조)**: "X가 Y를 어떻게 구현하는가?", "Z의 소스코드 보여줘"
- **Type C(컨텍스트 및 기록)**: "왜 이렇게 변경했는가?", "X의 기록?"
- **Type D(종합 연구)**: 복잡/모호한 요청

**제한**: 읽기 전용 권한(write, edit, task, delegate_task, call_omo_agent 금지)

**필수 요구사항**: 모든 코드 선언은 GitHub 영구 링크를 포함해야 함

---

#### Explore - 빠른 코드베이스 탐색 전문가

**역할**: 컨텍스트 인식 코드 검색 전문가

**능력**:
- LSP 도구: 정의, 참조, 심볼 네비게이션
- AST-Grep: 구조적 패턴 검색
- Grep: 텍스트 패턴 검색
- Glob: 파일명 패턴 매칭
- 병렬 실행(3개 이상 도구 동시 실행)

**추천 모델**: `opencode/gpt-5-nano`(temperature: 0.1)

**사용 시나리오**:
- 2개 이상 검색 각도가 필요한 광범위한 검색
- 낯선 모듈 구조
- 계층 간 패턴 발견
- "X가 어디에 있는가?", "어떤 파일에 Y가 있는가?" 찾기

**트리거 조건**:
- 2개 이상 모듈 관련 시 자동 트리거
- 프롬프트에 `@explore` 포함

**필수 출력 형식**:
```
<analysis>
**Literal Request**: [사용자 문자 그대로 요청]
**Actual Need**: [실제 필요한 것]
**Success Looks Like**: [성공이 어떻게 보이는지]
</analysis>

<results>
<files>
- /absolute/path/to/file1.ts — [이 파일이 관련되는 이유]
- /absolute/path/to/file2.ts — [이 파일이 관련되는 이유]
</files>

<answer>
[실제 요구사항에 대한 직접 답변]
</answer>

<next_steps>
[다음에 무엇을 해야 하는지]
</next_steps>
</results>
```

**제한**: 읽기 전용 권한(write, edit, task, delegate_task, call_omo_agent 금지)

---

#### Multimodal Looker - 미디어 분석 전문가

**역할**: 텍스트로 읽을 수 없는 미디어 파일 설명

**능력**:
- PDF: 텍스트, 구조, 테이블, 특정 섹션 데이터 추출
- 이미지: 레이아웃, UI 요소, 텍스트, 차트 설명
- 차트: 관계, 프로세스, 아키텍처 설명

**추천 모델**: `google/gemini-3-flash`(temperature: 0.1)

**사용 시나리오**:
- PDF에서 구조화된 데이터 추출 필요
- 이미지의 UI 요소나 차트 설명
- 기술 문서의 차트 분석

**호출 방식**: `look_at` 도구를 통해 자동 트리거

**제한**: **읽기 전용 허용목록**(read 도구만 허용)

---

### 계획 및 실행(2개)

#### Prometheus - 전략 계획가

**역할**: 인터뷰식 요구사항 수집 및 작업 계획 생성 전문가

**능력**:
- 인터뷰 모드: 요구사항이 명확해질 때까지 지속적인 질문
- 작업 계획 생성: 구조화된 Markdown 계획 문서
- 병렬 위임: Oracle, Metis, Momus에 계획 검토 요청

**추천 모델**: `anthropic/claude-opus-4-5`(temperature: 0.1)

**사용 시나리오**:
- 복잡한 프로젝트를 위한 상세 계획 수립
- 명확한 요구사항이 필요한 프로젝트
- 체계적인 워크플로우

**호출 방식**:
- 프롬프트에 `@prometheus` 또는 "Prometheus 사용" 포함
- 슬래시 명령 `/start-work` 사용

**워크플로우**:
1. **인터뷰 모드**: 요구사항이 명확해질 때까지 지속적인 질문
2. **계획 초안**: 구조화된 Markdown 계획 생성
3. **병렬 위임**:
   - `delegate_task(agent="oracle", prompt="아키텍처 의사결정 검토")` → 백그라운드 실행
   - `delegate_task(agent="metis", prompt="잠재적 위험 식별")` → 백그라운드 실행
   - `delegate_task(agent="momus", prompt="계획 완전성 검증")` → 백그라운드 실행
4. **피드백 통합**: 계획 개선
5. **계획 출력**: `.sisyphus/plans/{name}.md`에 저장

**제한**: 계획만 하고 코드는 구현하지 않음(`prometheus-md-only` Hook이 강제)

---

#### Sisyphus Junior - 작업 실행자

**역할**: 카테고리 생성 자식 에이전트 실행자

**능력**:
- Category 구성 상속(모델, temperature, prompt_append)
- Skills 로드(전문 기술)
- 위임된 하위 작업 실행

**추천 모델**: Category에서 상속(기본 `anthropic/claude-sonnet-4-5`)

**사용 시나리오**:
- `delegate_task(category="...", skills=["..."])` 사용 시 자동 생성
- 특정 Category와 Skill 조합이 필요한 작업
- 가벼운 빠른 작업("quick" Category는 Haiku 모델 사용)

**호출 방식**: `delegate_task` 도구를 통해 자동 생성

**제한**: task, delegate_task 금지(다시 위임 불가)

---

## 에이전트 호출 방식 요약

| 에이전트 | 호출 방식 | 트리거 조건 |
|--- | --- | ---|
| **Sisyphus** | 기본 메인 에이전트 | 일일 개발 작업 |
| **Atlas** | `/start-work` 명령 | 프로젝트 실행 시작 |
| **Oracle** | `@oracle` 또는 `delegate_task(agent="oracle")` | 복잡한 아키텍처 의사결정, 2회 이상 수정 실패 |
| **Librarian** | `@librarian` 또는 `delegate_task(agent="librarian")` | 외부 라이브러리/소스 언급 시 자동 트리거 |
| **Explore** | `@explore` 또는 `delegate_task(agent="explore")` | 2개 이상 모듈 관련 시 자동 트리거 |
| **Multimodal Looker** | `look_at` 도구 | PDF/이미지 분석 필요 시 |
| **Prometheus** | `@prometheus` 또는 `/start-work` | 프롬프트에 "Prometheus" 포함 또는 계획 필요 |
| **Metis** | Prometheus 자동 호출 | 계획 전 자동 분석 |
| **Momus** | Prometheus 자동 호출 | 계획 생성 후 자동 검토 |
| **Sisyphus Junior** | `delegate_task(category=...)` | Category/Skill 사용 시 자동 생성 |

---

## 어떤 에이전트를 언제 사용할 것인가

::: tip 빠른 의사결정 트리

**시나리오 1: 일일 개발(코드 작성, 버그 수정)**
→ **Sisyphus**(기본)

**시나리오 2: 복잡한 아키텍처 의사결정**
→ **@oracle** 자문

**시나리오 3: 외부 라이브러리의 문서나 구현을 찾아야 할 때**
→ **@librarian** 또는 자동 트리거

**시나리오 4: 낯선 코드베이스, 관련 코드 찾기 필요**
→ **@explore** 또는 자동 트리거(2개 이상 모듈)

**시나리오 5: 복잡한 프로젝트에 상세 계획 필요**
→ **@prometheus** 또는 `/start-work` 사용

**시나리오 6: PDF나 이미지 분석 필요**
→ `look_at` 도구(자동으로 Multimodal Looker 트리거)

**시나리오 7: 빠르고 간단한 작업, 비용 절감**
→ `delegate_task(category="quick")`

**시나리오 8: Git 전문 작업 필요**
→ `delegate_task(category="quick", skills=["git-master"])`

**시나리오 9: 프론트엔드 UI 디자인 필요**
→ `delegate_task(category="visual-engineering")`

**시나리오 10: 고지능 추론 작업 필요**
→ `delegate_task(category="ultrabrain")`

:::

---

## 에이전트 협업 예제: 완전 워크플로우

### 예제 1: 복잡한 기능 개발

```
사용자: 사용자 인증 시스템 개발

→ Sisyphus 작업 수신
  → 요구사항 분석, 외부 라이브러리 필요(JWT) 확인
  → 병렬 위임:
    - @librarian: "Next.js JWT 베스트 프랙티스 찾기" → [백그라운드]
    - @explore: "기존 인증 관련 코드 찾기" → [백그라운드]
  → 결과 대기, 정보 통합
  → JWT 인증 기능 구현
  → 완료 후 위임:
    - @oracle: "아키텍처 설계 검토" → [백그라운드]
  → 제안에 따라 최적화
```

---

### 예제 2: 프로젝트 계획

```
사용자: Prometheus로 이 프로젝트 계획 세우기

→ Prometheus 작업 수신
  → 인터뷰 모드:
    - 질문 1: 핵심 기능은 무엇인가?
    - [사용자 답변]
    - 질문 2: 타겟 사용자 그룹?
    - [사용자 답변]
    - ...
  → 요구사항 명확해진 후 병렬 위임:
    - delegate_task(agent="oracle", prompt="아키텍처 의사결정 검토") → [백그라운드]
    - delegate_task(agent="metis", prompt="잠재적 위험 식별") → [백그라운드]
    - delegate_task(agent="momus", prompt="계획 완전성 검증") → [백그라운드]
  → 모든 백그라운드 작업 완료 대기
  → 피드백 통합, 계획 개선
  → Markdown 계획 문서 출력
→ 사용자 계획 확인
→ /start-work로 실행 시작
```

---

## 에이전트 권한 및 제한

| 에이전트 | write | edit | bash | delegate_task | webfetch | read | LSP | AST-Grep |
|--- | --- | --- | --- | --- | --- | --- | --- | ---|
| **Sisyphus** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Atlas** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Oracle** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Librarian** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Explore** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Multimodal Looker** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Prometheus** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metis** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Momus** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Sisyphus Junior** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## 이 과정 요약

oh-my-opencode의 10개 AI 에이전트는 개발 프로세스의 모든 단계를 포괄합니다:

- **오케스트레이션 및 실행**: Sisyphus(메인 오케스트레이터), Atlas(TODO 관리)
- **고문 및 검토**: Oracle(전략 고문), Metis(사전 계획 분석), Momus(계획 검토)
- **연구 및 탐색**: Librarian(다중 리포지토리 연구), Explore(코드베이스 탐색), Multimodal Looker(미디어 분석)
- **계획**: Prometheus(전략 계획), Sisyphus Junior(하위 작업 실행)

**핵심 요점**:
1. AI를 만능 도우미가 아니라 전문 팀으로 간주하세요
2. 작업 유형에 따라 가장 적합한 에이전트를 선택하세요
3. 병렬 위임을 활용하여 효율성 높이기(Librarian, Explore, Oracle은 백그라운드에서 실행 가능)
4. 각 에이전트의 권한 제한 이해(읽기 전용 에이전트는 코드 수정 불가)
5. 에이전트 간 협업으로 완전 워크플로우 형성(계획 → 실행 → 검토)

---

## 다음 과정 미리보기

> 다음 과정에서는 **[Prometheus 계획: 인터뷰식 요구사항 수집](../prometheus-planning/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - Prometheus를 사용하여 인터뷰식 요구사항 수집 방법
> - 구조화된 작업 계획 생성 방법
> - Metis와 Momus가 계획을 검토하도록 하는 방법
> - 백그라운드 작업 가져오기 및 취소 방법

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-26

| 에이전트 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| Sisyphus 메인 오케스트레이터 | [`src/agents/sisyphus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus.ts) | - |
| Atlas 메인 오케스트레이터 | [`src/agents/atlas.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/atlas.ts) | - |
| Oracle 고문 | [`src/agents/oracle.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/oracle.ts) | 1-123 |
| Librarian 연구 전문가 | [`src/agents/librarian.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/librarian.ts) | 1-327 |
| Explore 검색 전문가 | [`src/agents/explore.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/explore.ts) | 1-123 |
| Multimodal Looker | [`src/agents/multimodal-looker.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/multimodal-looker.ts) | 1-57 |
| Prometheus 계획가 | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1-1196 |
| Metis 사전 계획 분석 | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | 1-316 |
| Momus 계획 검토자 | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | 1-445 |
| Sisyphus Junior | [`src/agents/sisyphus-junior.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus-junior.ts) | - |
| 에이전트 메타데이터 정의 | [`src/agents/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/types.ts) | - |
| 에이전트 도구 제한 | [`src/shared/permission-compat.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/permission-compat.ts) | - |

**핵심 구성**:
- `ORACLE_PROMPT_METADATA`: Oracle 에이전트의 메타데이터(트리거 조건, 사용 시나리오)
- `LIBRARIAN_PROMPT_METADATA`: Librarian 에이전트의 메타데이터
- `EXPLORE_PROMPT_METADATA`: Explore 에이전트의 메타데이터
- `MULTIMODAL_LOOKER_PROMPT_METADATA`: Multimodal Looker 에이전트의 메타데이터
- `METIS_SYSTEM_PROMPT`: Metis 에이전트의 시스템 프롬프트
- `MOMUS_SYSTEM_PROMPT`: Momus 에이전트의 시스템 프롬프트

**핵심 함수**:
- `createOracleAgent(model)`: Oracle 에이전트 구성 생성
- `createLibrarianAgent(model)`: Librarian 에이전트 구성 생성
- `createExploreAgent(model)`: Explore 에이전트 구성 생성
- `createMultimodalLookerAgent(model)`: Multimodal Looker 에이전트 구성 생성
- `createMetisAgent(model)`: Metis 에이전트 구성 생성
- `createMomusAgent(model)`: Momus 에이전트 구성 생성

**권한 제한**:
- `createAgentToolRestrictions()`: 에이전트 도구 제한 생성(Oracle, Librarian, Explore, Metis, Momus 사용)
- `createAgentToolAllowlist()`: 에이전트 도구 허용목록 생성(Multimodal Looker 사용)

</details>
