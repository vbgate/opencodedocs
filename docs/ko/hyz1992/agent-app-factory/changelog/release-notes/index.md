---
title: "릴리스 노트: 버전 히스토리 및 기능 변경 | Agent App Factory"
sidebarTitle: "릴리스 노트"
subtitle: "릴리스 노트: 버전 히스토리 및 기능 변경 | Agent App Factory"
description: "Agent App Factory의 버전 업데이트 히스토리, 기능 변경 사항, 버그 수정 및 주요 개선 사항을 확인하세요. 이 페이지는 1.0.0 버전부터 시작하는 완전한 변경 히스토리를 자세히 기록하며, 7단계 파이프라인 시스템, Sisyphus 스케줄러, 권한 관리, 컨텍스트 최적화 및 실패 처리 전략 등 핵심 기능과 개선 사항을 포함합니다."
tags:
  - "릴리스 노트"
  - "버전 히스토리"
prerequisite: []
order: 250
---

# 릴리스 노트

이 페이지는 Agent App Factory의 버전 업데이트 히스토리를 기록하며, 새로운 기능, 개선 사항, 버그 수정 및 호환성에 영향을 미치는 변경 사항을 포함합니다.

형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/) 규격을 따르며, 버전 번호는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

## [1.0.0] - 2024-01-29

### 추가됨

**핵심 기능**
- **7단계 파이프라인 시스템**: 아이디어에서 실행 가능한 애플리케이션까지의 완전한 자동화 프로세스
  - Bootstrap - 제품 아이디어 구조화 (input/idea.md)
  - PRD - 제품 요구사항 문서 생성 (artifacts/prd/prd.md)
  - UI - UI 구조 및 미리보기 가능한 프로토타입 설계 (artifacts/ui/)
  - Tech - 기술 아키텍처 및 Prisma 데이터 모델 설계 (artifacts/tech/)
  - Code - 프론트엔드 및 백엔드 코드 생성 (artifacts/backend/, artifacts/client/)
  - Validation - 코드 품질 검증 (artifacts/validation/report.md)
  - Preview - 배포 가이드 생성 (artifacts/preview/README.md)

- **Sisyphus 스케줄러**: 파이프라인의 핵심 제어 컴포넌트
  - pipeline.yaml에 정의된 각 Stage를 순서대로 실행
  - 각 단계의 입력/출력 및 종료 조건 검증
  - 파이프라인 상태 유지 (.factory/state.json)
  - 권한 검사 수행, Agent의 권한 초과 접근 방지
  - 실패 전략에 따른 예외 상황 처리
  - 각 체크포인트에서 일시 중지, 수동 확인 후 계속

**CLI 도구**
- `factory init` - Factory 프로젝트 초기화
- `factory run [stage]` - 파이프라인 실행 (현재 또는 지정된 단계부터)
- `factory continue` - 새 세션에서 실행 계속 (토큰 절약)
- `factory status` - 현재 프로젝트 상태 확인
- `factory list` - 모든 Factory 프로젝트 나열
- `factory reset` - 현재 프로젝트 상태 초기화

**권한 및 보안**
- **능력 경계 매트릭스** (capability.matrix.md): 각 Agent의 엄격한 읽기/쓰기 권한 정의
  - 각 Agent는 승인된 디렉토리만 접근 가능
  - 권한 초과 파일 쓰기 시 artifacts/_untrusted/로 이동
  - 실패 후 파이프라인 자동 일시 중지, 수동 개입 대기

**컨텍스트 최적화**
- **분기 실행**: 각 단계를 새 세션에서 실행
  - 컨텍스트 누적 방지, 토큰 절약
  - 중단 및 복구 지원
  - 모든 AI 어시스턴트(Claude Code, OpenCode, Cursor)에 적용 가능

**실패 처리 전략**
- 자동 재시도 메커니즘: 각 단계당 한 번 재시도 허용
- 실패 보관: 실패한 산출물을 artifacts/_failed/로 이동
- 롤백 메커니즘: 최근 성공 체크포인트로 롤백
- 수동 개입: 연속 두 번 실패 후 일시 중지

**품질 보장**
- **코드 규격** (code-standards.md)
  - TypeScript 코딩 규격 및 모범 사례
  - 파일 구조 및 명명 규칙
  - 주석 및 문서화 요구 사항
  - Git 커밋 메시지 규격(Conventional Commits)

- **에러 코드 규격** (error-codes.md)
  - 통일된 에러 코드 구조: [MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - 표준 에러 유형: VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - 프론트엔드 및 백엔드 에러 코드 매핑 및 사용자 친화적 안내

**Changelog 관리**
- Keep a Changelog 형식 준수
- Conventional Commits와 통합
- 자동화 도구 지원: conventional-changelog-cli, release-it

**구성 템플릿**
- CI/CD 구성(GitHub Actions)
- Git Hooks 구성(Husky)

**생성된 애플리케이션 특성**
- 완전한 프론트엔드 및 백엔드 코드(Express + Prisma + React Native)
- 단위 테스트 및 통합 테스트(Vitest + Jest)
- API 문서(Swagger/OpenAPI)
- 데이터베이스 시드 데이터
- Docker 배포 구성
- 에러 처리 및 로그 모니터링
- 성능 최적화 및 보안 검사

### 개선됨

**MVP 집중**
- 비목표(Non-Goals)를 명확히 나열하여 범위 확장 방지
- 페이지 수를 3페이지 이내로 제한
- 핵심 기능에 집중, 과도한 설계 방지

**책임 분리**
- 각 Agent는 자신의 영역만 담당하며 영역을 넘지 않음
- PRD는 기술 세부 사항을 포함하지 않으며, Tech는 UI 설계에 관여하지 않음
- Code Agent는 UI Schema와 Tech 설계를 엄격히 구현

**검증 가능성**
- 각 단계에서 명확한 exit_criteria 정의
- 모든 기능이 테스트 가능하며 로컬에서 실행 가능
- 산출물은 반드시 구조화되어 있어 다운스트림에서 사용 가능

### 기술 스택

**CLI 도구**
- Node.js >= 16.0.0
- Commander.js - 명령줄 프레임워크
- Chalk - 컬러 터미널 출력
- Ora - 진행 표시기
- Inquirer - 대화형 명령줄
- fs-extra - 파일 시스템 작업
- YAML - YAML 파싱

**생성된 애플리케이션**
- 백엔드: Node.js + Express + Prisma + TypeScript + Vitest
- 프론트엔드: React Native + Expo + TypeScript + Jest + React Testing Library
- 배포: Docker + GitHub Actions

### 의존성

- `chalk@^4.1.2` - 터미널 색상 스타일
- `commander@^11.0.0` - 명령줄 인자 파싱
- `fs-extra@^11.1.1` - 파일 시스템 확장
- `inquirer@^8.2.5` - 대화형 명령줄
- `ora@^5.4.1` - 우아한 터미널 로더
- `yaml@^2.3.4` - YAML 파싱 및 직렬화

## 버전 설명

### Semantic Versioning

이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/) 버전 번호 형식을 따릅니다: MAJOR.MINOR.PATCH

- **MAJOR**: 하위 호환되지 않는 API 변경
- **MINOR**: 하위 호환되는 새로운 기능
- **PATCH**: 하위 호환되는 버그 수정

### 변경 유형

- **추가됨** (Added): 새로운 기능
- **변경됨** (Changed): 기존 기능의 변경
- **사용 중단** (Deprecated): 곧 제거될 기능
- **제거됨** (Removed): 제거된 기능
- **수정됨** (Fixed): 버그 수정
- **보안** (Security): 보안 수정

## 관련 자료

- [GitHub 릴리스](https://github.com/hyz1992/agent-app-factory/releases) - 공식 릴리스 페이지
- [프로젝트 저장소](https://github.com/hyz1992/agent-app-factory) - 소스 코드
- [이슈 트래커](https://github.com/hyz1992/agent-app-factory/issues) - 문제 및 제안 피드백
- [기여 가이드](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - 기여 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2024-01-29

| 기능        | 파일 경로                                                                                                                               | 라인 번호    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json)                                                  | 1-52    |
| CLI 진입점     | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)                                        | 1-123   |
| 초기화 명령   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)                                  | 1-427   |
| 실행 명령     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js)                                     | 1-294   |
| 계속 명령     | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js)                            | 1-87    |
| 파이프라인 정의   | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)                                               | 1-87    |
| 스케줄러 정의   | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md)          | 1-301   |
| 권한 매트릭스     | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md)                  | 1-44    |
| 실패 정책     | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md)                        | 1-200   |
| 코드 규격     | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md)                        | 1-287   |
| 에러 코드 규격   | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md)                              | 1-134   |
| Changelog 규격 | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md)                                  | 1-87    |

**주요 버전 정보**:
- `version = "1.0.0"`: 초기 릴리스 버전
- `engines.node = ">=16.0.0"`: 최소 Node.js 버전 요구사항

**의존성 버전**:
- `chalk@^4.1.2`: 터미널 색상 스타일
- `commander@^11.0.0`: 명령줄 인자 파싱
- `fs-extra@^11.1.1`: 파일 시스템 확장
- `inquirer@^8.2.5`: 대화형 명령줄
- `ora@^5.4.1`: 우아한 터미널 로더
- `yaml@^2.3.4`: YAML 파싱 및 직렬화

</details>
