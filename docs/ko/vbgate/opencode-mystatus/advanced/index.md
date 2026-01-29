---
title: "고급 기능: 커스텀 설정 | opencode-mystatus"
sidebarTitle: "고급 기능"
subtitle: "고급 기능: 커스텀 설정"
description: "opencode-mystatus 고급 설정을 학습합니다. Google Cloud 다중 계정, Copilot 인증, 다국어 지원 등 커스텀 기능 설정 방법을 안내합니다."
order: 3
---

# 고급 기능

이 장에서는 opencode-mystatus의 고급 설정 옵션을 소개하며, 더 많은 사용자 정의가 필요한 사용자에게 적합합니다.

## 기능 목록

### [Google Cloud 설정](./google-setup/)

여러 Google Cloud Antigravity 계정을 설정하고 관리합니다:

- 여러 Google Cloud 계정 추가
- 4개 모델(G3 Pro, G3 Image, G3 Flash, Claude)의 매핑 관계
- projectId와 managedProjectId의 차이
- 단일 계정 모델 할당량 부족 문제 해결

### [Copilot 인증 설정](./copilot-auth/)

GitHub Copilot 인증 문제를 해결합니다:

- OAuth Token과 Fine-grained PAT의 차이
- OAuth Token 권한 부족 문제 해결
- Fine-grained PAT 생성 및 구독 유형 설정
- `copilot-quota-token.json` 파일 설정

### [다국어 지원](./i18n-setup/)

자동 언어 감지 메커니즘을 이해합니다:

- 시스템 언어 자동 감지 원리
- Intl API 및 환경 변수 대체 메커니즘
- 출력 언어 전환 방법(한국어/영어)

## 적용 시나리오

| 시나리오 | 권장 튜토리얼 |
|--- | ---|
| 여러 Google 계정 사용 | [Google Cloud 설정](./google-setup/) |
| Copilot 할당량 조회 실패 | [Copilot 인증 설정](./copilot-auth/) |
| 출력 언어 전환 | [다국어 지원](./i18n-setup/) |

## 전제 조건

이 장을 학습하기 전에 다음을 완료하는 것이 좋습니다:

- [빠른 시작](../start/) - 플러그인 설치 완료
- [플랫폼 기능](../platforms/) - 각 플랫폼 기본 사용법 이해

## 다음 단계

문제가 있나요? [常见问题](../faq/)을 보여 도움을 받으세요.
