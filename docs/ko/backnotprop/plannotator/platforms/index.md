---
title: "플랫폼 기능: 계획 및 코드 리뷰 | Plannotator"
sidebarTitle: "AI 계획 및 코드 리뷰"
subtitle: "플랫폼 기능: 계획 및 코드 리뷰"
description: "Plannotator의 플랫폼 기능을 학습하세요. 계획 리뷰와 코드 리뷰를 포함합니다. 시각적 리뷰, 주석 추가, 이미지 어노테이션 등 핵심 기술을 마스터하세요."
order: 2
---

# 플랫폼 기능

이 장에서는 Plannotator의 두 가지 핵심 기능인 **계획 리뷰**와 **코드 리뷰**를 소개합니다. AI가 생성한 계획을 시각적으로 리뷰하는 방법, 다양한 주석 추가, 이미지 어노테이션 첨부, 그리고 git diff 코드 변경 사항 리뷰 방법을 배우게 됩니다.

## 전제 조건

::: warning 시작 전 확인
이 장을 학습하기 전에 다음 사항을 확인하세요:

- ✅ [빠른 시작](../start/getting-started/) 튜토리얼 완료
- ✅ Plannotator 플러그인 설치 완료 ([Claude Code](../start/installation-claude-code/) 또는 [OpenCode](../start/installation-opencode/))
:::

## 이 장 내용

### 계획 리뷰

AI가 생성한 실행 계획을 리뷰하고 수정 제안을 추가하여 AI가 의도한 대로 실행하도록 하는 방법을 학습합니다.

| 튜토리얼 | 설명 |
|--- | ---|
| [계획 리뷰 기초](./plan-review-basics/) | Plannotator를 사용하여 AI가 생성한 계획을 시각적으로 리뷰하고 계획 승인 또는 거부하는 방법 학습 |
| [계획 주석 추가](./plan-review-annotations/) | 계획에 다양한 유형의 주석(삭제, 교체, 삽입, 코멘트)을 추가하는 방법 마스터 |
| [이미지 어노테이션 추가](./plan-review-images/) | 계획 리뷰에 이미지를 첨부하고 브러시, 화살표, 원형 도구를 사용하여 어노테이션을 추가하는 방법 학습 |

### 코드 리뷰

코드 변경 사항을 리뷰하고 행 단위 주석을 추가하여 커밋 전에 문제를 발견하는 방법을 학습합니다.

| 튜토리얼 | 설명 |
|--- | ---|
| [코드 주석 추가](./code-review-annotations/) | 코드 리뷰에서 행 단위 주석(comment/suggestion/concern)을 추가하는 방법 마스터 |
| [Diff 뷰 전환](./code-review-diff-types/) | 코드 리뷰에서 다른 diff 타입(uncommitted/staged/last commit/branch)으로 전환하는 방법 학습 |

## 학습 경로

::: tip 권장 학습 순서
사용 시나리오에 따라 적절한 학습 경로를 선택하세요:

**경로 A: 계획 리뷰 우선** (초보자 권장)
1. [계획 리뷰 기초](./plan-review-basics/) → 기본적인 계획 리뷰 프로세스 먼저 학습
2. [계획 주석 추가](./plan-review-annotations/) → 계획을 정밀하게 수정하는 방법 학습
3. [이미지 어노테이션 추가](./plan-review-images/) → 이미지로 의도를 더 명확하게 표현
4. 그 후 코드 리뷰 시리즈 학습

**경로 B: 코드 리뷰 우선** (Code Review 경험이 있는 개발자에게 적합)
1. [코드 리뷰 기초](./code-review-basics/) → 코드 리뷰 인터페이스 익숙해지기
2. [코드 주석 추가](./code-review-annotations/) → 행 단위 주석 학습
3. [Diff 뷰 전환](./code-review-diff-types/) → 다른 diff 타입 마스터
4. 그 후 계획 리뷰 시리즈 학습
:::

## 다음 단계

이 장을 완료한 후 다음을 계속 학습할 수 있습니다:

- [URL 공유](../advanced/url-sharing/) - URL을 통해 계획과 주석을 공유하여 팀 협업 구현
- [Obsidian 통합](../advanced/obsidian-integration/) - 승인된 계획을 Obsidian에 자동 저장
- [원격 모드](../advanced/remote-mode/) - SSH, devcontainer, WSL 환경에서 Plannotator 사용
