---
title: "고급: 파이프라인과 내부 메커니즘 | AI App Factory 튜토리얼"
sidebarTitle: "고급: 파이프라인"
subtitle: "고급: 파이프라인과 내부 메커니즘"
description: "AI App Factory의 7단계 파이프라인, Sisyphus 스케줄러, 권한 보안 메커니즘, 실패 처리 전략을 심층적으로 알아보세요. 컨텍스트 최적화와 고급 설정 기법을 익히세요."
tags:
  - "파이프라인"
  - "스케줄러"
  - "권한 보안"
  - "실패 처리"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# 고급: 파이프라인과 내부 메커니즘

이 챕터에서는 AI App Factory의 핵심 메커니즘과 고급 기능을 심층적으로 설명합니다. 7단계 파이프라인의 상세한 작동 원리, Sisyphus 스케줄러의 스케줄링 전략, 권한과 보안 메커니즘, 실패 처리 전략, 그리고 컨텍스트 최적화를 통해 Token 비용을 절약하는 방법을 다룹니다.

::: warning 전제 조건
이 챕터를 학습하기 전에 다음 내용을 완료했는지 확인하세요:
- [빠른 시작](../../start/getting-started/) 및 [설치 설정](../../start/installation/)
- [7단계 파이프라인 개요](../../start/pipeline-overview/)
- [플랫폼 통합](../../platforms/claude-code/) 설정
:::

## 챕터 내용

이 챕터는 다음 주제를 포함합니다:

### 7단계 파이프라인 상세 설명

- **[단계 1: Bootstrap - 제품 아이디어 구조화](stage-bootstrap/)**
  - 모호한 제품 아이디어를 구조화된 문서로 변환하는 방법 학습
  - Bootstrap Agent의 입력 출력 형식 이해

- **[단계 2: PRD - 제품 요구사항 문서 생성](stage-prd/)**
  - 사용자 스토리, 기능 목록, 비목표를 포함한 MVP 수준 PRD 생성
  - 요구사항 분해와 우선순위 정렬 기법 익히기

- **[단계 3: UI - 인터페이스와 프로토타입 설계](stage-ui/)**
  - ui-ux-pro-max 스킬을 사용하여 UI 구조와 미리보기 가능한 프로토타입 설계
  - 인터페이스 설계 프로세스와 모범 사례 이해

- **[단계 4: Tech - 기술 아키텍처 설계](stage-tech/)**
  - 최소한의 실행 가능한 기술 아키텍처와 Prisma 데이터 모델 설계
  - 기술 선정과 아키텍처 설계 원칙 익히기

- **[단계 5: Code - 실행 가능한 코드 생성](stage-code/)**
  - UI Schema와 Tech 설계를 기반으로 프론트엔드/백엔드 코드, 테스트, 설정 생성
  - 코드 생성 프로세스와 템플릿 시스템 이해

- **[단계 6: Validation - 코드 품질 검증](stage-validation/)**
  - 의존성 설치, 타입 체크, Prisma 스키마, 코드 품질 검증
  - 자동화된 품질 검사 프로세스 익히기

- **[단계 7: Preview - 배포 가이드 생성](stage-preview/)**
  - 완전한 실행 설명 문서와 배포 설정 생성
  - CI/CD 통합과 Git Hooks 설정 학습

### 내부 메커니즘

- **[Sisyphus 스케줄러 상세 설명](orchestrator/)**
  - 스케줄러가 파이프라인을 조정하고, 상태를 관리하며, 권한 검사를 실행하는 방법 이해
  - 스케줄링 전략과 상태 머신 원리 익히기

- **[컨텍스트 최적화: 분할 세션 실행](context-optimization/)**
  - `factory continue` 명령어를 사용하여 Token을 절약하는 방법 학습
  - 각 단계에서 새 세션을 생성하는 모범 사례 익히기

- **[권한과 보안 메커니즘](security-permissions/)**
  - 능력 경계 매트릭스, 권한 초과 처리, 보안 검사 메커니즘 이해
  - 보안 설정과 권한 관리 익히기

- **[실패 처리와 롤백](failure-handling/)**
  - 실패 식별, 재시도 메커니즘, 롤백 전략, 수동 개입 프로세스 학습
  - 장애 진단과 복구 기법 익히기

## 학습 경로 권장사항

### 권장 학습 순서

1. **먼저 7단계 파이프라인 완료하기** (순서대로)
   - Bootstrap → PRD → UI → Tech → Code → Validation → Preview
   - 각 단계는 명확한 입력 출력이 있으며, 순서대로 학습하면 완전한 이해를 구축할 수 있습니다

2. **그 다음 스케줄러와 컨텍스트 최적화 학습**
   - Sisyphus가 이 7개 단계를 어떻게 조정하는지 이해
   - Token 비용을 절약하기 위한 컨텍스트 최적화 방법 학습

3. **마지막으로 보안과 실패 처리 학습**
   - 권한 경계와 보안 메커니즘 익히기
   - 실패 시나리오와 대응 전략 이해

### 다른 역할의 학습 중점

| 역할 | 중점 학습 챕터 |
| --- | --- |
| **개발자** | Code, Validation, Tech, Orchestrator |
| **제품 관리자** | Bootstrap, PRD, UI, Preview |
| **기술 책임자** | Tech, Code, Security, Failure Handling |
| **DevOps 엔지니어** | Validation, Preview, Context Optimization |

## 다음 단계

이 챕터를 완료한 후 다음 내용을 계속 학습할 수 있습니다:

- **[FAQ와 문제 해결](../../faq/troubleshooting/)** - 실제 사용 중 문제 해결
- **[모범 사례](../../faq/best-practices/)** - Factory를 효율적으로 사용하는 기법 익히기
- **[CLI 명령어 참조](../../appendix/cli-commands/)** - 완전한 명령어 목록 확인
- **[코드 표준](../../appendix/code-standards/)** - 생성된 코드가 따라야 할 표준 이해

---

💡 **팁**: 사용 중 문제가 발생하면 먼저 [FAQ와 문제 해결](../../faq/troubleshooting/) 챕터를 확인하세요.
