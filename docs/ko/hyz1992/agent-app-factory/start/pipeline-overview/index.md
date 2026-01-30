---
title: "7단계 파이프라인 전체 개요: Bootstrap부터 Preview까지 완전한 프로세스 상세 | AI App Factory 튜토리얼"
sidebarTitle: "7단계 파이프라인 전체 개요"
subtitle: "7단계 파이프라인 개요"
description: "AI App Factory의 전체 파이프라인을 학습합니다. Bootstrap으로 아이디어 구조화부터 Preview 배포 가이드 생성까지, 체크포인트, 권한 제어, 실패 처리 메커니즘을 완전히 파악하세요."
tags:
  - "파이프라인"
  - "Sisyphus"
  - "Agent"
prerequisite:
  - "/ko/hyz1992/agent-app-factory/start/init-project/"
order: 40
---

# 7단계 파이프라인 개요

## 학습 후 할 수 있는 것

- 7단계 파이프라인의 전체 흐름과 각 단계의 역할을 이해합니다.
- 각 단계의 입력, 출력, 종료 조건을 알게 됩니다.
- 체크포인트 메커니즘이 어떻게 품질을 보장하는지 이해합니다.
- Sisyphus 스케줄러가 Agent 실행을 어떻게 조율하는지 이해합니다.
- 권한 행렬이 Agent의 권한을 어떻게 제한하는지 숙지합니다.
- "새 세션에서 계속하기"를 사용하여 Token을 절약하는 방법을 익힙니다.

## 핵심 개념

**파이프라인이란 무엇인가요?**

AI App Factory의 파이프라인은 제품 아이디어를 실제 실행 가능한 애플리케이션으로 단계별로 변환하는 자동화된 생산 라인입니다. 공장의 생산 라인과 마찬가지로, 원자재(제품 아이디어)가 7개의 공정(단계)을 거쳐 완제품(전체 애플리케이션)으로 만들어집니다.

각 공정은 전담 Agent가 담당하며, 각자 역할을 수행해 서로 간섭하지 않습니다.

| 단계 | Agent | 역할 | 산출물 |
| ----- | ----- | ---- | ---- |
| Bootstrap | Bootstrap Agent | 제품 아이디어를 깊이 파악 | `input/idea.md` |
| PRD | PRD Agent | 제품 요구사항 문서 생성 | `artifacts/prd/prd.md` |
| UI | UI Agent | 인터페이스 및 프로토타입 설계 | `artifacts/ui/ui.schema.yaml` + 미리보기 페이지 |
| Tech | Tech Agent | 기술 아키텍처 설계 | `artifacts/tech/tech.md` + Prisma Schema |
| Code | Code Agent | 실행 가능한 코드 생성 | `artifacts/backend/` + `artifacts/client/` |
| Validation | Validation Agent | 코드 품질 검증 | `artifacts/validation/report.md` |
| Preview | Preview Agent | 배포 가이드 생성 | `artifacts/preview/README.md` |

**주요 기능**

1. **체크포인트 메커니즘**: 각 단계 완료 후 일시 중지하며, 사용자 확인 후 다음으로 진행합니다.
2. **권한 격리**: 각 Agent는 허가된 디렉터리만 읽고 쓸 수 있어 오염을 방지합니다.
3. **실패 시 롤백 가능**: 단계 실패 시 자동 재시도하며, 연속 실패 시 마지막 성공한 체크포인트로 롤백합니다.
4. **컨텍스트 최적화**: 새 세션에서 계속 실행하여 Token을 절약할 수 있습니다.

## 파이프라인 전체 개요

```mermaid
graph LR
    A[Bootstrap<br/>구조화된 제품 아이디어] -->|idea.md| B[PRD<br/>요구사항 문서 생성]
    B -->|prd.md| C[UI<br/>인터페이스 프로토타입 설계]
    C -->|ui.schema.yaml| D[Tech<br/>기술 아키텍처 설계]
    D -->|tech.md + schema.prisma| E[Code<br/>실행 가능한 코드 생성]
    E -->|backend + client| F[Validation<br/>코드 품질 검증]
    F -->|검증 보고서| G[Preview<br/>배포 가이드 생성]
    
    style A fill:#e0f2fe
    style B fill:#f0fdf4
    style C fill:#fef3c7
    style D fill:#ede9fe
    style E fill:#fce7f3
    style F fill:#dbeafe
    style G fill:#d1fae5
```

**파이프라인 실행 규칙**

::: tip 실행 규칙

1. **엄격한 순서**: Bootstrap부터 순서대로 Preview까지 실행하며, 건너뛰거나 병렬로 실행할 수 없습니다.
2. **단일 Agent 활성화**: 동시에 하나의 Agent만 작업할 수 있습니다.
3. **되돌릴 수 없음**: 이미 확인된 산출물은 수정할 수 없으며, 해당 단계를 다시 실행해야 합니다.

주의: 이 규칙은 파이프라인의 실행 규칙이지 체크포인트 옵션 수가 아닙니다. 각 단계 완료 시 Sisyphus는 5개의 체크포인트 옵션을 제공합니다(아래 '체크포인트 메커니즘' 참조).

:::

## 단계별 상세

### 단계 1: Bootstrap - 구조화된 제품 아이디어

**무엇을 하나요?**

사용자가 제공한 자연어 제품 설명을 구조화된 문서로 변환하여 문제, 사용자, 가치, 가정을 깊이 파악합니다.

**왜 중요한가요?**

명확한 제품 정의는 전체 파이프라인의 기초입니다. 이 단계를 제대로 하지 않으면 이후 모든 단계가 방향을 잃게 됩니다.

**입력과 출력**

| 유형 | 경로 | 설명 |
| ---- | ---- | ---- |
| 입력 | 사용자 자연어 설명 | 예: "가계부 앱을 만들고 싶어요" |
| 출력 | `input/idea.md` | 구조화된 제품 아이디어 문서 |

**종료 조건**

- [ ] `idea.md`가 존재합니다.
- [ ] 일관성 있는 제품 아이디어를 설명합니다.
- [ ] Agent가 `superpowers:brainstorm` 스킬을 사용하여 깊이 파악했습니다.

**필수 스킬 사용**

::: warning 반드시 superpowers:brainstorm 사용

Bootstrap 단계에서는 `superpowers:brainstorm` 스킬을 사용하여 깊이 파악해야 합니다. Agent가 이 스킬을 사용하지 않은 경우 산출물이 거부되며, 다시 실행하도록 요청합니다.

:::

### 단계 2: PRD - 제품 요구사항 문서 생성

**무엇을 하나요?**

구조화된 제품 아이디어를 MVP 레벨의 제품 요구사항 문서로 변환하여 기능 범위, 비목표, 사용자 스토리를 명확히 합니다.

**왜 중요한가요?**

PRD는 설계와 개발을 위한 '계약'으로, '무엇을 할 것인가'와 '하지 않을 것인가'를 명확히 하여 범위 확장을 방지합니다.

**입력과 출력**

| 유형 | 경로 | 설명 |
| ---- | ---- | ---- |
| 입력 | `input/idea.md` | Bootstrap 단계에서 출력된 구조화된 아이디어 |
| 출력 | `artifacts/prd/prd.md` | MVP 레벨 제품 요구사항 문서 |

**종료 조건**

- [ ] PRD에 대상 사용자가 포함되어 있습니다.
- [ ] PRD가 MVP 범위를 정의합니다.
- [ ] PRD가 비목표를 나열합니다.
- [ ] PRD에 기술 구현 세부 사항이 포함되지 않습니다.

**주의: PRD에는 기술 세부 사항을 포함하지 않음**

PRD는 '사용자가 필요로 하는 것'을 설명해야 하며, '어떻게 구현할 것인가'가 아닙니다. 기술 구현 세부 사항은 Tech와 Code 단계가 담당합니다.

### 단계 3: UI - 인터페이스 및 프로토타입 설계

**무엇을 하나요?**

PRD를 바탕으로 UI 구조, 색상 계획을 설계하고 브라우저에서 미리 볼 수 있는 HTML 프로토타입을 생성합니다.

**왜 중요한가요?**

시각적 설계는 팀과 초기 사용자가 제품의 형태를 직관적으로 이해하게 하여 개발 재작업을 줄여줍니다.

**입력과 출력**

| 유형 | 경로 | 설명 |
| ---- | ---- | ---- |
| 입력 | `artifacts/prd/prd.md` | PRD 문서 |
| 출력 | `artifacts/ui/ui.schema.yaml` | UI 구조 정의 |
| 출력 | `artifacts/ui/preview.web/index.html` | 미리 볼 수 있는 HTML 프로토타입 |

**종료 조건**

- [ ] `ui.schema.yaml`이 존재합니다.
- [ ] 페이지 수가 3개를 넘지 않습니다.
- [ ] 미리보기 페이지를 브라우저에서 열 수 있습니다.
- [ ] Agent가 `ui-ux-pro-max` 스킬을 사용했습니다.

**필수 스킬 사용**

::: warning 반드시 ui-ux-pro-max 사용

UI 단계에서는 `ui-ux-pro-max` 스킬을 사용하여 전문적인 디자인 시스템을 생성해야 합니다. 이 스킬에는 67가지 스타일, 96가지 색상 팔레트, 100가지 업계 규칙이 포함되어 있습니다.

:::

### 단계 4: Tech - 기술 아키텍처 설계

**무엇을 하나요?**

최소 기술 아키텍처와 데이터 모델을 설계하고, 기술 스택을 선택하며 API 엔드포인트를 정의합니다.

**왜 중요한가요?**

기술 아키텍처는 코드의 유지 관리성, 확장성, 성능을 결정합니다. 과도하게 설계하면 개발이 어렵고, 설계가 부족하면 요구사항을 지원할 수 없습니다.

**입력과 출력**

| 유형 | 경로 | 설명 |
| ---- | ---- | ---- |
| 입력 | `artifacts/prd/prd.md` | PRD 문서 |
| 출력 | `artifacts/tech/tech.md` | 기술 아키텍처 문서 |
| 출력 | `artifacts/backend/prisma/schema.prisma` | Prisma 데이터 모델 |

**종료 조건**

- [ ] 기술 스택이 명확하게 선언되었습니다.
- [ ] 데이터 모델이 PRD와 일치합니다.
- [ ] 조기 최적화나 과도한 설계가 수행되지 않았습니다.

**기술 스택 기본 선택**

- 백엔드: Node.js + Express + Prisma
- 데이터베이스: SQLite(개발) / PostgreSQL(프로덕션)
- 프론트엔드: React Native + Expo

### 단계 5: Code - 실행 가능한 코드 생성

**무엇을 하나요?**

UI Schema, Tech 설계, Prisma Schema를 바탕으로 전체 프론트엔드와 백엔드 코드, 테스트, 설정, 문서를 생성합니다.

**왜 중요한가요?**

이는 '아이디어에서 애플리케이션으로'의 핵심 단계로, 생성된 코드는 실행 가능하고 프로덕션 준비 상태여야 합니다.

**입력과 출력**

| 유형 | 경로 | 설명 |
| ---- | ---- | ---- |
| 입력 | `artifacts/ui/ui.schema.yaml` | UI 구조 정의 |
| 입력 | `artifacts/tech/tech.md` | 기술 아키텍처 문서 |
| 입력 | `artifacts/backend/prisma/schema.prisma` | 데이터 모델 |
| 출력 | `artifacts/backend/` | 백엔드 코드(Express + Prisma) |
| 출력 | `artifacts/client/` | 프론트엔드 코드(React Native) |

**종료 조건**

- [ ] 백엔드가 시작되며 심각한 오류가 없습니다.
- [ ] 클라이언트를 렌더링하고 액세스할 수 있습니다.
- [ ] 추가 인증이나 무관한 기능이 도입되지 않았습니다.

**생성되는 내용**

Code Agent는 다음을 생성합니다.

**백엔드**:
- Express 서버 + 라우트
- Prisma ORM + 데이터 모델
- 단위 테스트 및 통합 테스트(Vitest)
- API 문서(Swagger/OpenAPI)
- 시드 데이터(`prisma/seed.ts`)
- Docker 구성
- 로깅 및 모니터링

**프론트엔드**:
- React Native 페이지 및 컴포넌트
- React Navigation 라우트
- 단위 테스트(Jest + React Testing Library)
- 환경 설정

::: info 인증 기능을 생성하지 않는 이유는 무엇인가요?

AI App Factory는 MVP에 집중하며, 기본적으로 인증, 권한 부여와 같은 복잡한 기능을 생성하지 않습니다. 이러한 기능은 후속 반복에서 추가할 수 있습니다.

:::

### 단계 6: Validation - 코드 품질 검증

**무엇을 하나요?**

생성된 코드가 의존성을 설치할 수 있는지, 유형 검사를 통과하는지, 코드 표준을 준수하는지 검증합니다.

**왜 중요한가요?**

코드를 실행하기 전에 문제를 발견하여 배포 후 오류가 발견되는 것을 방지하고 디버깅 시간을 절약합니다.

**입력과 출력**

| 유형 | 경로 | 설명 |
| ---- | ---- | ---- |
| 입력 | `artifacts/backend/` | 백엔드 코드 |
| 입력 | `artifacts/client/` | 프론트엔드 코드 |
| 출력 | `artifacts/validation/report.md` | 검증 보고서 |

**종료 조건**

- [ ] 검증 보고서가 생성되었습니다.
- [ ] 백엔드 의존성을 정상적으로 해석할 수 있습니다.
- [ ] 프론트엔드 의존성을 정상적으로 해석할 수 있습니다.
- [ ] TypeScript 컴파일에 심각한 오류가 없습니다.
- [ ] Prisma schema 검증을 통과했습니다.

**검증 내용**

Validation Agent는 다음을 확인합니다.

1. **의존성 해석**: `npm install`이 성공하는지 확인
2. **유형 검사**: `tsc --noEmit`을 통과하는지 확인
3. **코드 표준**: `policies/code-standards.md`를 준수하는지 확인
4. **Prisma Schema**: `prisma validate`를 통과하는지 확인
5. **테스트 통과율**: 테스트가 존재하고 실행 가능한지 확인

**실패 처리**

검증에 실패하면 Validation Agent는 상세한 오류 보고서를 생성하여 구체적인 문제와 수정 제안을 지적합니다.

### 단계 7: Preview - 배포 가이드 생성

**무엇을 하나요?**

모든 산출물을 요약하여 전체 실행 안내서, 배포 설정, 데모 절차 문서를 생성합니다.

**왜 중요한가요?**

이는 파이프라인의 마지막 단계로, 생성된 애플리케이션을 빠르게 실행하고 배포할 수 있게 합니다.

**입력과 출력**

| 유형 | 경로 | 설명 |
| ---- | ---- | ---- |
| 입력 | `artifacts/backend/` | 백엔드 코드 |
| 입력 | `artifacts/client/` | 프론트엔드 코드 |
| 출력 | `artifacts/preview/README.md` | 전체 실행 안내서 |
| 출력 | `artifacts/preview/GETTING_STARTED.md` | 빠른 시작 가이드 |

**종료 조건**

- [ ] README에 설치 단계가 포함되어 있습니다.
- [ ] README에 실행 명령어가 포함되어 있습니다.
- [ ] README에 접근 주소와 데모 절차가 나열되어 있습니다.

**생성되는 내용**

Preview Agent는 다음을 생성합니다.

- 로컬 실행 안내서(Web, iOS, Android)
- Docker 배포 설정(`docker-compose.yml`)
- CI/CD 설정 참조(GitHub Actions)
- Git Hooks 설정 참조(Husky)
- 데이터베이스 마이그레이션 가이드(SQLite → PostgreSQL)

## 체크포인트 메커니즘

**체크포인트란 무엇인가요?**

각 단계 완료 후 파이프라인이 일시 중지되고, 생성된 산출물 목록을 보여주어 기대에 부합하는지 확인합니다. 부합하지 않으면 '재시도' 또는 '수정 후 다시 실행'을 선택할 수 있습니다.

**체크포인트가 필요한 이유는 무엇인가요?**

- **오류 누적 방지**: 초기 문제는 현재 단계에서 해결하지 않으면 이후 단계에서 오류가 확대됩니다.
- **품질 보장**: 각 단계에서 출력이 기대에 부합하는지 확인하여 사용 불가능한 코드를 생성하는 것을 방지합니다.
- **유연한 제어**: 모든 체크포인트에서 일시 중지, 재시도, 입력 수정을 할 수 있습니다.

**체크포인트 옵션**

각 단계 완료 시 Sisyphus 스케줄러는 다음 옵션을 보여줍니다.

```
┌──────┬──────────────────────────────────────────────────────┐
│ 옵션 │ 설명                                                  │
├──────┼──────────────────────────────────────────────────────┤
│  1   │ 다음 단계 계속(동일 세션)                              │
│      │ [다음 단계 이름] 단계를 계속 실행합니다.                │
├──────┼──────────────────────────────────────────────────────┤
│  2   │ 새 세션에서 계속 ⭐ 추천 옵션, Token 절약               │
│      │ 새 명령줄 창에서 다음을 실행합니다: factory continue    │
│      │ (새 Claude Code 창을 자동으로 시작하고 파이프라인 계속)  │
├──────┼──────────────────────────────────────────────────────┤
│  3   │ 현재 단계 다시 실행                                    │
│      │ [현재 단계 이름] 단계를 다시 실행합니다.                 │
├──────┼──────────────────────────────────────────────────────┤
│  4   │ 수정 후 다시 실행                                      │
│      │ [입력 파일]을 수정한 후 다시 실행합니다.                │
├──────┼──────────────────────────────────────────────────────┤
│  5   │ 파이프라인 일시 중지                                   │
│      │ 현재 진행 상황을 저장하고 나중에 계속합니다.             │
└──────┴──────────────────────────────────────────────────────┘
```

**권장 사항**

::: tip '새 세션에서 계속' 선택으로 Token 절약

각 단계 완료 후 '새 세션에서 계속'(옵션 2)을 선택하는 것을 권장합니다.

1. 새 명령줄 창에서 `factory continue`를 실행합니다.
2. 명령이 새 Claude Code 창을 자동으로 시작합니다.
3. 각 단계가 깨끗한 컨텍스트를 독점적으로 사용하여 Token 누적을 방지합니다.

:::

## 권한 행렬

**권한 격리가 필요한 이유는 무엇인가요?**

Agent가 임의로 모든 디렉터리를 읽고 쓸 수 있다면 다음이 발생할 수 있습니다.

- Bootstrap Agent가 완료된 PRD를 실수로 수정할 수 있습니다.
- Code Agent가 UI 설계를 실수로 삭제할 수 있습니다.
- Validation Agent가 백엔드 코드를 잘못 수정할 수 있습니다.

**능력 경계 행렬**

Sisyphus 스케줄러는 각 단계 실행 전후에 Agent 권한을 확인합니다.

| Agent | 읽기 허용 | 쓰기 허용 |
| ----- | ------ | ------ |
| bootstrap | 없음 | `input/` |
| prd | `input/` | `artifacts/prd/` |
| ui | `artifacts/prd/` | `artifacts/ui/` |
| tech | `artifacts/prd/` | `artifacts/tech/`, `artifacts/backend/prisma/` |
| code | `artifacts/ui/`, `artifacts/tech/`, `artifacts/backend/prisma/` | `artifacts/backend/`, `artifacts/client/` |
| validation | `artifacts/backend/`, `artifacts/client/` | `artifacts/validation/` |
| preview | `artifacts/backend/`, `artifacts/client/` | `artifacts/preview/` |

**권한 초과 처리**

Agent가 권한 없는 디렉터리에 쓰면, Sisyphus 스케줄러는 파일을 `artifacts/_untrusted/<stage-id>/`로 이동하고, 파이프라인을 일시 중지한 후 보고합니다.

::: warning 권한 초과 예시

PRD Agent가 `artifacts/ui/ui.schema.yaml`에 쓴다고 가정해 봅시다(이는 권한 범위가 아닙니다). 스케줄러는 다음을 수행합니다.

1. 파일을 `artifacts/_untrusted/prd/ui.schema.yaml`로 이동합니다.
2. 파이프라인을 일시 중지합니다.
3. 다음과 같이 보고합니다: 권한 없는 쓰기가 감지되었습니다. 수동으로 처리해 주세요.

:::

## 실패 처리

**무엇이 실패로 간주되나요?**

- 출력 파일이 누락되었습니다.
- 산출물 내용이 `exit_criteria`를 충족하지 않습니다.
- Agent가 권한 없는 디렉터리에 썼습니다.
- 스크립트 오류 또는 입력을 읽을 수 없습니다.

**기본 처리 전략**

1. **자동 재시도**: 각 단계는 자동 재시도를 한 번 허용합니다.
2. **실패 보관**: 실패한 산출물을 `artifacts/_failed/<stage-id>/`로 이동합니다.
3. **파이프라인 일시 중지**: 연속 실패 2회 후 수동 개입을 기다립니다.
4. **롤백 메커니즘**: 가장 최근 성공한 체크포인트로 롤백하여 다시 실행합니다.

::: tip 수동 개입 후 처리

연속 실패 2회 발생 시 다음을 수행할 수 있습니다.

1. 입력 파일(예: `input/idea.md`) 수정
2. Agent 프롬프트 조정
3. 권한 문제 수정
4. `factory run [stage]`를 실행하여 해당 단계부터 다시 시작

:::

## 상태 관리

**상태 파일**

파이프라인의 모든 상태는 `.factory/state.json`에 저장되며, 다음을 포함합니다.

```json
{
  "version": 1,
  "status": "waiting_for_confirmation",
  "current_stage": "prd",
  "completed_stages": ["bootstrap"],
  "started_at": "2026-01-29T10:00:00Z",
  "last_updated": "2026-01-29T10:30:00Z"
}
```

**상태 머신**

| 상태 | 의미 | 트리거 조건 |
| ---- | ---- | -------- |
| idle | 시작되지 않음 | `factory run` 대기 중 |
| running | 실행 중 | 단 Stage 시작 |
| waiting_for_confirmation | 확인 대기 중 | 단계 완료 |
| paused | 일시 중지됨 | 사용자가 일시 중지 선택 |
| failed | 실패로 개입 필요 | 연속 실패 또는 권한 초과 조작 |

Sisyphus 스케줄러만 상태를 업데이트할 권한이 있습니다.

## 문제 해결 팁

### 일반적인 오류 1: Bootstrap 단계에서 brainstorm 스킬 미사용

**현상**: Sisyphus가 `input/idea.md`를 거부하며 'superpowers:brainstorm 스킬 사용 감지 안 됨'을 표시합니다.

**원인**: Bootstrap Agent가 `superpowers:brainstorm` 스킬을 사용하여 제품 아이디어를 깊이 파악하지 않았습니다.

**해결 방법**: 산출물 확인 시 '현재 단계 다시 실행'을 선택하고, Agent가 명시적으로 `superpowers:brainstorm` 스킬을 사용하도록 요청합니다.

### 일반적인 오류 2: UI 단계에서 평범한 디자인

**현상**: 생성된 UI 디자인이 획일적이며 모두 보라색 그라데이션, Inter 폰트입니다.

**원인**: UI Agent가 `ui-ux-pro-max` 스킬을 사용하지 않았습니다.

**해결 방법**: 산출물 확인 시 '현재 단계 다시 실행'을 선택하고, Agent가 명시적으로 `ui-ux-pro-max` 스킬을 사용하도록 요청하며, 명확한 미학적 방향(예: '사이버펑크', '미니멀리즘')을 지정합니다.

### 일반적인 오류 3: Code 단계에서 인증 기능 생성

**현상**: 생성된 백엔드 코드에 JWT 인증, 사용자 로그인 등 복잡한 기능이 포함되어 있습니다.

**원인**: Code Agent가 MVP 범위를 초과했습니다.

**해결 방법**: PRD를 수정하여 '비목표'(예: '사용자 로그인 미지원', '다중 사용자 협업 미지원')를 명시하고 나열한 후 Code 단계를 다시 실행합니다.

### 일반적인 오류 4: Token 소모 과도

**현상**: 파이프라인 후반부로 갈수록 Token 소모가 급증하고 AI 어시스턴트의 응답이 느려집니다.

**원인**: 동일 세션에서 여러 단계를 실행하여 컨텍스트가 계속 누적됩니다.

**해결 방법**: **항상 '새 세션에서 계속'(옵션 2)을 선택**하여 각 단계가 깨끗한 컨텍스트를 독점적으로 사용하도록 합니다.

## 요약

- 파이프라인은 7단계로 구성됩니다: Bootstrap → PRD → UI → Tech → Code → Validation → Preview
- 각 단계 완료 후 일시 중지하여 확인하며 출력이 기대에 부합하는지 보장합니다.
- Sisyphus 스케줄러는 Agent 실행을 조율하고 상태 및 권한을 관리합니다.
- 능력 경계 행렬은 Agent의 권한 초과를 방지하여 책임 분리를 보장합니다.
- '새 세션에서 계속'을 선택하면 Token을 크게 절약할 수 있습니다.

## 다음 강좌 미리보기

> 다음 강좌에서는 **[Claude Code 통합 가이드](../../platforms/claude-code/)**를 학습합니다.
>
> 다음을 배울 수 있습니다:
> - Claude Code 권한 구성 방법
> - 파이프라인 실행 방법
> - Claude Code 모범 사례

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼쳐보기</strong></summary>

> 업데이트: 2026-01-29

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 파이프라인 정의 | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 1-111 |
| 스케줄러 핵심 | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-302 |
| 프로젝트 README | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md) | 1-253 |

**핵심 상수**:
- 파이프라인 모드: `checkpoint`(각 단계마다 확인 대기 체크포인트 모드)

**핵심 Agent 정의**:
- **Bootstrap Agent**: `superpowers:brainstorm` 스킬 사용, `input/idea.md` 생성
- **PRD Agent**: `input/idea.md` 읽기, `artifacts/prd/prd.md` 생성
- **UI Agent**: `ui-ux-pro-max` 스킬 사용, `artifacts/ui/ui.schema.yaml` 및 미리보기 페이지 생성
- **Tech Agent**: `artifacts/tech/tech.md` 및 `artifacts/backend/prisma/schema.prisma` 생성
- **Code Agent**: UI, Tech, Schema를 기반으로 `artifacts/backend/` 및 `artifacts/client/` 생성
- **Validation Agent**: 코드 품질 검증, `artifacts/validation/report.md` 생성
- **Preview Agent**: `artifacts/preview/README.md` 생성

</details>
