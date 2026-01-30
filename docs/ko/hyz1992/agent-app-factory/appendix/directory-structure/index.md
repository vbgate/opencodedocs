---
title: "디렉토리 구조 상세 설명: Factory 프로젝트 전체 구조와 파일 용도 | AI App Factory 튜토리얼"
sidebarTitle: "디렉토리 구조 상세 설명"
subtitle: "디렉토리 구조 상세 설명: Factory 프로젝트 완전 가이드"
description: "AI App Factory 프로젝트의 전체 디렉토리 구조와 각 파일 용도를 학습합니다. 이 튜토리얼은 agents, skills, policies, artifacts 등 핵심 디렉토리의 역할과 파일 기능을 상세히 설명하며, Factory 프로젝트의 작동 원리를 깊이 이해하고, 구성 파일을 빠르게 찾아 수정하며, 파이프라인 문제를 디버깅하는 데 도움을 줍니다."
tags:
  - "부록"
  - "디렉토리 구조"
  - "프로젝트 아키텍처"
prerequisite:
  - "start-init-project"
order: 220
---

# 디렉토리 구조 상세 설명: Factory 프로젝트 완전 가이드

## 학습 후 달성할 수 있는 것

- ✅ Factory 프로젝트의 전체 디렉토리 구조 이해
- ✅ 각 디렉토리와 파일의 용도 파악
- ✅ 아티팩트(artifacts) 저장 방식 이해
- ✅ 구성 파일의 역할과 수정 방법 숙지

## 핵심 개념

Factory 프로젝트는 명확한 디렉토리 계층 구조를 채택하여 구성, 코드, 아티팩트, 문서를 분리합니다. 이러한 디렉토리 구조를 이해하면 파일을 빠르게 찾고, 구성을 수정하며, 문제를 디버깅하는 데 도움이 됩니다.

Factory 프로젝트에는 두 가지 형태가 있습니다:

**형태 1: 소스 코드 저장소** (GitHub에서 클론한 것)
**형태 2: 초기화된 프로젝트** (`factory init`로 생성된 것)

본 튜토리얼은 **형태 2**인 초기화된 Factory 프로젝트 구조를 중점적으로 설명합니다. 이것이 일상 작업에 사용하는 디렉토리이기 때문입니다.

---

## Factory 프로젝트 전체 구조

```
my-app/                          # Factory 프로젝트 루트 디렉토리
├── .factory/                    # Factory 핵심 구성 디렉토리(수동 수정 금지)
│   ├── pipeline.yaml             # 파이프라인 정의(7개 단계)
│   ├── config.yaml               # 프로젝트 구성 파일(기술 스택, MVP 제약 등)
│   ├── state.json                # 파이프라인 실행 상태(현재 단계, 완료된 단계)
│   ├── agents/                   # Agent 정의(AI 어시스턴트의 작업 설명)
│   ├── skills/                   # 스킬 모듈(재사용 가능한 지식)
│   ├── policies/                 # 정책 문서(권한, 실패 처리, 코드 표준)
│   └── templates/                # 구성 템플릿(CI/CD, Git Hooks)
├── .claude/                      # Claude Code 구성 디렉토리(자동 생성)
│   └── settings.local.json       # Claude Code 권한 구성
├── input/                        # 사용자 입력 디렉토리
│   └── idea.md                   # 구조화된 제품 아이디어(Bootstrap에서 생성)
└── artifacts/                    # 파이프라인 아티팩트 디렉토리(7개 단계의 출력)
    ├── prd/                      # PRD 아티팩트
    │   └── prd.md                # 제품 요구사항 문서
    ├── ui/                       # UI 아티팩트
    │   ├── ui.schema.yaml        # UI 구조 정의
    │   └── preview.web/          # 미리볼 수 있는 HTML 프로토타입
    │       └── index.html
    ├── tech/                     # Tech 아티팩트
    │   └── tech.md               # 기술 아키텍처 문서
    ├── backend/                  # 백엔드 코드(Express + Prisma)
    │   ├── src/                  # 소스 코드
    │   ├── prisma/               # 데이터베이스 구성
    │   │   ├── schema.prisma     # Prisma 데이터 모델
    │   │   └── seed.ts           # 시드 데이터
    │   ├── tests/                # 테스트
    │   ├── docs/                 # API 문서
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    ├── client/                   # 프론트엔드 코드(React Native)
    │   ├── src/                  # 소스 코드
    │   ├── __tests__/            # 테스트
    │   ├── app.json
    │   ├── package.json
    │   └── README.md
    ├── validation/               # Validation 아티팩트
    │   └── report.md             # 코드 품질 검증 보고서
    ├── preview/                  # Preview 아티팩트
    │   ├── README.md             # 배포 및 실행 가이드
    │   └── GETTING_STARTED.md    # 빠른 시작 가이드
    ├── _failed/                  # 실패 아티팩트 아카이브
    │   └── <stage-id>/           # 실패한 단계의 아티팩트
    └── _untrusted/               # 권한 초과 아티팩트 격리
        └── <stage-id>/           # 권한 없는 Agent가 작성한 파일
```

---

## .factory/ 디렉토리 상세 설명

`.factory/` 디렉토리는 Factory 프로젝트의 핵심으로, 파이프라인 정의, Agent 구성, 정책 문서가 포함되어 있습니다. 이 디렉토리는 `factory init` 명령으로 자동 생성되며, 일반적으로 수동으로 수정할 필요가 없습니다.

### pipeline.yaml - 파이프라인 정의

**용도**: 7개 단계의 실행 순서, 입력/출력, 종료 조건을 정의합니다.

**핵심 내용**:
- 7개 단계: bootstrap, prd, ui, tech, code, validation, preview
- 각 단계의 Agent, 입력 파일, 출력 파일
- 종료 조건(exit_criteria): 단계 완료 검증 기준

**예시**:
```yaml
stages:
  - id: bootstrap
    description: 프로젝트 아이디어 초기화
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs:
      - input/idea.md
    exit_criteria:
      - idea.md 존재
      - idea.md가 일관된 제품 아이디어를 설명
```

**수정 시기**: 일반적으로 수정할 필요가 없지만, 파이프라인 흐름을 커스터마이즈하려는 경우 수정합니다.

### config.yaml - 프로젝트 구성 파일

**용도**: 기술 스택, MVP 제약, UI 선호도 등 전역 설정을 구성합니다.

**주요 구성 항목**:
- `preferences`: 기술 스택 선호도(백엔드 언어, 데이터베이스, 프론트엔드 프레임워크 등)
- `mvp_constraints`: MVP 범위 제어(최대 페이지 수, 최대 모델 수 등)
- `ui_preferences`: UI 디자인 선호도(미적 방향, 색상 스킴)
- `pipeline`: 파이프라인 동작(체크포인트 모드, 실패 처리)
- `advanced`: 고급 옵션(Agent 타임아웃, 동시성 제어)

**예시**:
```yaml
preferences:
  backend:
    language: typescript
    framework: express
    database: sqlite
  mvp_constraints:
    max_pages: 3
    enable_auth: false
```

**수정 시기**: 기술 스택을 조정하거나 MVP 범위를 변경하려는 경우.

### state.json - 파이프라인 상태

**용도**: 파이프라인의 실행 상태를 기록하여 체크포인트에서 재개를 지원합니다.

**핵심 내용**:
- `status`: 현재 상태(idle/running/waiting_for_confirmation/paused/failed)
- `current_stage`: 현재 실행 중인 단계
- `completed_stages`: 완료된 단계 목록
- `last_updated`: 마지막 업데이트 시간

**수정 시기**: 자동으로 업데이트되며, 수동으로 수정하지 않습니다.

### agents/ - Agent 정의 디렉토리

**용도**: 각 Agent의 책임, 입력/출력, 실행 제약을 정의합니다.

**파일 목록**:
| 파일 | 설명 |
|------|------|
| `orchestrator.checkpoint.md` | 오케스트레이터 핵심 정의(파이프라인 조정) |
| `orchestrator-implementation.md` | 오케스트레이터 구현 가이드(개발 참조) |
| `bootstrap.agent.md` | Bootstrap Agent(구조화된 제품 아이디어) |
| `prd.agent.md` | PRD Agent(요구사항 문서 생성) |
| `ui.agent.md` | UI Agent(UI 프로토타입 설계) |
| `tech.agent.md` | Tech Agent(기술 아키텍처 설계) |
| `code.agent.md` | Code Agent(코드 생성) |
| `validation.agent.md` | Validation Agent(코드 품질 검증) |
| `preview.agent.md` | Preview Agent(배포 가이드 생성) |

**수정 시기**: 일반적으로 수정할 필요가 없지만, 특정 Agent의 동작을 커스터마이즈하려는 경우 수정합니다.

### skills/ - 스킬 모듈 디렉토리

**용도**: 재사용 가능한 지식 모듈로, 각 Agent가 해당 Skill 파일을 로드합니다.

**디렉토리 구조**:
```
skills/
├── bootstrap/skill.md         # 제품 아이디어 구조화
├── prd/skill.md               # PRD 생성
├── ui/skill.md                # UI 디자인
├── tech/skill.md              # 기술 아키텍처 + 데이터베이스 마이그레이션
├── code/skill.md              # 코드 생성 + 테스트 + 로깅
│   └── references/            # 코드 생성 참조 템플릿
│       ├── backend-template.md   # 프로덕션 레디 백엔드 템플릿
│       └── frontend-template.md  # 프로덕션 레디 프론트엔드 템플릿
└── preview/skill.md           # 배포 구성 + 빠른 시작 가이드
```

**수정 시기**: 일반적으로 수정할 필요가 없지만, 특정 Skill의 기능을 확장하려는 경우 수정합니다.

### policies/ - 정책 문서 디렉토리

**용도**: 권한, 실패 처리, 코드 표준 등 정책을 정의합니다.

**파일 목록**:
| 파일 | 설명 |
|------|------|
| `capability.matrix.md` | 기능 경계 매트릭스(Agent 읽기/쓰기 권한) |
| `failure.policy.md` | 실패 처리 정책(재시도, 롤백, 수동 개입) |
| `context-isolation.md` | 컨텍스트 격리 정책(Token 절약) |
| `error-codes.md` | 통일된 에러 코드 표준 |
| `code-standards.md` | 코드 표준(코딩 스타일, 파일 구조) |
| `pr-template.md` | PR 템플릿 및 코드 리뷰 체크리스트 |
| `changelog.md` | Changelog 생성 표준 |

**수정 시기**: 일반적으로 수정할 필요가 없지만, 정책이나 표준을 조정하려는 경우 수정합니다.

### templates/ - 구성 템플릿 디렉토리

**용도**: CI/CD, Git Hooks 등 구성 템플릿.

**파일 목록**:
| 파일 | 설명 |
|------|------|
| `cicd-github-actions.md` | CI/CD 구성(GitHub Actions) |
| `git-hooks-husky.md` | Git Hooks 구성(Husky) |

**수정 시기**: 일반적으로 수정할 필요가 없지만, CI/CD 흐름을 커스터마이즈하려는 경우 수정합니다.

---

## .claude/ 디렉토리 상세 설명

### settings.local.json - Claude Code 권한 구성

**용도**: Claude Code가 접근할 수 있는 디렉토리와 작업 권한을 정의합니다.

**생성 시기**: `factory init` 실행 시 자동 생성됩니다.

**수정 시기**: 일반적으로 수정할 필요가 없지만, 권한 범위를 조정하려는 경우 수정합니다.

---

## input/ 디렉토리 상세 설명

### idea.md - 구조화된 제품 아이디어

**용도**: 구조화된 제품 아이디어를 저장하며, Bootstrap Agent가 생성합니다.

**생성 시기**: Bootstrap 단계 완료 후.

**내용 구조**:
- 문제 정의(Problem)
- 타겟 사용자(Target Users)
- 핵심 가치(Core Value)
- 가정(Assumptions)
- 비목표(Out of Scope)

**수정 시기**: 제품 방향을 조정하려는 경우 수동으로 편집한 후 Bootstrap 또는 후속 단계를 다시 실행할 수 있습니다.

---

## artifacts/ 디렉토리 상세 설명

`artifacts/` 디렉토리는 파이프라인 아티팩트의 저장 위치로, 각 단계에서 해당 하위 디렉토리에 아티팩트를 작성합니다.

### prd/ - PRD 아티팩트 디렉토리

**아티팩트 파일**:
- `prd.md`: 제품 요구사항 문서

**내용**:
- 사용자 스토리(User Stories)
- 기능 목록(Features)
- 비기능 요구사항(Non-functional Requirements)
- 비목표(Out of Scope)

**생성 시기**: PRD 단계 완료 후.

### ui/ - UI 아티팩트 디렉토리

**아티팩트 파일**:
- `ui.schema.yaml`: UI 구조 정의(페이지, 컴포넌트, 인터랙션)
- `preview.web/index.html`: 미리볼 수 있는 HTML 프로토타입

**내용**:
- 페이지 구조(페이지 수, 레이아웃)
- 컴포넌트 정의(버튼, 폼, 리스트 등)
- 인터랙션 흐름(네비게이션, 이동)
- 디자인 시스템(색상, 폰트, 간격)

**생성 시기**: UI 단계 완료 후.

**미리보기 방법**: 브라우저에서 `preview.web/index.html`을 엽니다.

### tech/ - Tech 아티팩트 디렉토리

**아티팩트 파일**:
- `tech.md`: 기술 아키텍처 문서

**내용**:
- 기술 스택 선택(백엔드, 프론트엔드, 데이터베이스)
- 데이터 모델 설계
- API 엔드포인트 설계
- 보안 전략
- 성능 최적화 제안

**생성 시기**: Tech 단계 완료 후.

### backend/ - 백엔드 코드 디렉토리

**아티팩트 파일**:
```
backend/
├── src/                      # 소스 코드
│   ├── routes/               # API 라우트
│   ├── services/             # 비즈니스 로직
│   ├── middleware/           # 미들웨어
│   └── utils/               # 유틸리티 함수
├── prisma/                   # Prisma 구성
│   ├── schema.prisma         # Prisma 데이터 모델
│   └── seed.ts              # 시드 데이터
├── tests/                    # 테스트
│   ├── unit/                 # 단위 테스트
│   └── integration/          # 통합 테스트
├── docs/                     # 문서
│   └── api-spec.yaml        # API 사양(Swagger)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

**내용**:
- Express 백엔드 서버
- Prisma ORM(SQLite/PostgreSQL)
- Vitest 테스트 프레임워크
- Swagger API 문서

**생성 시기**: Code 단계 완료 후.

### client/ - 프론트엔드 코드 디렉토리

**아티팩트 파일**:
```
client/
├── src/                      # 소스 코드
│   ├── screens/              # 화면
│   ├── components/           # 컴포넌트
│   ├── navigation/           # 네비게이션 구성
│   ├── services/             # API 서비스
│   └── utils/               # 유틸리티 함수
├── __tests__/               # 테스트
│   └── components/          # 컴포넌트 테스트
├── assets/                  # 정적 리소스
├── app.json                 # Expo 구성
├── package.json
├── tsconfig.json
└── README.md
```

**내용**:
- React Native + Expo
- React Navigation
- Jest + React Testing Library
- TypeScript

**생성 시기**: Code 단계 완료 후.

### validation/ - 검증 아티팩트 디렉토리

**아티팩트 파일**:
- `report.md`: 코드 품질 검증 보고서

**내용**:
- 의존성 설치 검증
- TypeScript 타입 검사
- Prisma 스키마 검증
- 테스트 커버리지

**생성 시기**: Validation 단계 완료 후.

### preview/ - Preview 아티팩트 디렉토리

**아티팩트 파일**:
- `README.md`: 배포 및 실행 가이드
- `GETTING_STARTED.md`: 빠른 시작 가이드

**내용**:
- 로컬 실행 단계
- Docker 배포 구성
- CI/CD 파이프라인
- 접근 주소 및 데모 흐름

**생성 시기**: Preview 단계 완료 후.

### _failed/ - 실패 아티팩트 아카이브

**용도**: 실패한 단계의 아티팩트를 저장하여 디버깅을 용이하게 합니다.

**디렉토리 구조**:
```
_failed/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**생성 시기**: 특정 단계가 연속으로 두 번 실패한 후.

### _untrusted/ - 권한 초과 아티팩트 격리

**용도**: 권한 없는 Agent가 작성한 파일을 저장하여 메인 아티팩트 오염을 방지합니다.

**디렉토리 구조**:
```
_untrusted/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**생성 시기**: Agent가 권한이 없는 디렉토리에 쓰기를 시도할 때.

---

## 자주 묻는 질문

### 1. .factory/ 아래의 파일을 수동으로 수정할 수 있나요?

::: warning 신중하게 수정
`.factory/` 아래의 파일을 직접 수정하는 것은 **권장하지 않습니다**. 무엇을 하고 있는지 명확히 알지 못하는 경우 특히 그렇습니다. 잘못된 수정은 파이프라인이 정상적으로 실행되지 않게 만들 수 있습니다.

구성을 커스터마이즈해야 하는 경우, `config.yaml` 파일을 수정하는 것을 우선 고려하세요.
:::

### 2. artifacts/ 아래의 파일을 수동으로 수정할 수 있나요?

**네**. `artifacts/` 아래의 파일은 파이프라인의 출력 아티팩트이므로 다음 작업을 할 수 있습니다:

- `input/idea.md` 또는 `artifacts/prd/prd.md`를 수정하여 제품 방향 조정
- `artifacts/backend/` 또는 `artifacts/client/`의 코드를 수동으로 수정
- `artifacts/ui/preview.web/index.html`의 스타일 조정

수정 후 해당 단계부터 파이프라인을 다시 실행할 수 있습니다.

### 3. _failed/ 및 _untrusted/ 아래의 파일을 어떻게 처리하나요?

- **_failed/**: 실패 원인을 확인하고 문제를 수정한 후 해당 단계를 다시 실행합니다.
- **_untrusted/**: 파일이 존재해야 하는지 확인하고, 그렇다면 파일을 올바른 디렉토리로 이동합니다.

### 4. state.json 파일이 손상되면 어떻게 하나요?

`state.json`이 손상된 경우 다음 명령을 실행하여 재설정할 수 있습니다:

```bash
factory reset
```

### 5. 파이프라인의 현재 상태를 어떻게 확인하나요?

다음 명령을 실행하여 현재 상태를 확인합니다:

```bash
factory status
```

---

## 이번 강의 요약

이번 강의에서는 Factory 프로젝트의 전체 디렉토리 구조를 상세히 설명했습니다:

- ✅ `.factory/`: Factory 핵심 구성(pipeline, agents, skills, policies)
- ✅ `.claude/`: Claude Code 권한 구성
- ✅ `input/`: 사용자 입력(idea.md)
- ✅ `artifacts/`: 파이프라인 아티팩트(prd, ui, tech, backend, client, validation, preview)
- ✅ `_failed/` 및 `_untrusted/`: 실패 및 권한 초과 아티팩트 아카이브

이러한 디렉토리 구조를 이해하면 파일을 빠르게 찾고, 구성을 수정하며, 문제를 디버깅하는 데 도움이 됩니다.

---

## 다음 강의 예고

> 다음 강의에서는 **[코드 표준](../code-standards/)**을 학습합니다.
>
> 배우게 될 내용:
> - TypeScript 코딩 표준
> - 파일 구조 및 명명 규칙
> - 주석 및 문서 요구사항
> - Git 커밋 메시지 표준
