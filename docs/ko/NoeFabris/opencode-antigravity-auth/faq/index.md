---
title: "자주 묻는 질문: OAuth 인증 및 모델 문제 해결 | Antigravity Auth"
sidebarTitle: "인증 실패 시 대처 방법"
subtitle: "자주 묻는 질문: OAuth 인증 및 모델 문제 해결"
description: "Antigravity Auth 플러그인의 자주 묻는 질문과 해결 방법을 알아보세요. OAuth 인증 실패 해결, 모델을 찾을 수 없음 오류 처리, 플러그인 호환성 구성 등 실용적인 가이드를 제공하여 사용 중 발생하는 다양한 문제를 신속하게 파악하고 해결할 수 있도록 도와드립니다."
order: 4
---

# 자주 묻는 질문

본 섹션에서는 Antigravity Auth 플러그인 사용 시 가장 흔히 발생하는 문제와 해결 방법을 수록했습니다. OAuth 인증 실패, 모델 요청 오류, 플러그인 호환성 문제 등 어떤 문제든 여기에서 해당하는 해결 가이드를 찾을 수 있습니다.

## 전제 조건

::: warning 시작하기 전에 확인하세요
- ✅ [빠른 설치](../start/quick-install/)를 완료하고 계정을 성공적으로 추가했는지
- ✅ [첫 인증](../start/first-auth-login/)을 완료하고 OAuth 흐름을 이해했는지
:::

## 학습 경로

발생한 문제 유형에 따라 해당하는 해결 가이드를 선택하세요:

### 1. [OAuth 인증 실패 해결](./common-auth-issues/)

OAuth 인증, 토큰 갱신 및 계정 관련 일반적인 문제를 해결합니다.

- 브라우저 인증은 성공했지만 터미널에 "인증 실패" 메시지가 표시됨
- 갑자기 "Permission Denied" 또는 "invalid_grant" 오류 발생
- Safari 브라우저에서 OAuth 콜백 실패
- WSL2/Docker 환경에서 인증을 완료할 수 없음

### 2. [계정 마이그레이션](./migration-guide/)

다른 머신 간 계정을 마이그레이션하고 버전 업그레이드를 처리합니다.

- 계정을 이전 컴퓨터에서 새 컴퓨터로 마이그레이션
- 저장 형식의 버전 변경 이해 (v1/v2/v3)
- 마이그레이션 후 invalid_grant 오류 해결

### 3. [모델을 찾을 수 없음 해결](./model-not-found/)

모델을 찾을 수 없음, 400 오류 등 모델 관련 문제를 해결합니다.

- `Model not found` 오류 해결
- `Invalid JSON payload received. Unknown name "parameters"` 400 오류
- MCP 서버 호출 오류

### 4. [플러그인 호환성](./plugin-compatibility/)

oh-my-opencode, DCP 등의 플러그인과의 호환성 문제를 해결합니다.

- 플러그인 로드 순서 올바르게 구성
- oh-my-opencode에서 충돌하는 인증 방식 비활성화
- 병렬 에이전트 시나리오를 위해 PID 오프셋 활성화

### 5. [ToS 경고](./tos-warning/)

사용 위험을 이해하고 계정 정지를 방지합니다.

- Google 서비스 약관 제한 이해
- 고위험 시나리오 식별 (신규 계정, 집중적 요청)
- 계정 정지를 방지하는 모범 사례 숙지

## 문제 신속 파악

| 오류 현상 | 권장 읽기 |
| --- | --- |
| 인증 실패, 인증 시간 초과 | [OAuth 인증 실패 해결](./common-auth-issues/) |
| invalid_grant, Permission Denied | [OAuth 인증 실패 해결](./common-auth-issues/) |
| Model not found, 400 오류 | [모델을 찾을 수 없음 해결](./model-not-found/) |
| 다른 플러그인과 충돌 | [플러그인 호환성](./plugin-compatibility/) |
| 새 컴퓨터로 변경, 버전 업그레이드 | [계정 마이그레이션](./migration-guide/) |
| 계정 보안 우려 | [ToS 경고](./tos-warning/) |

## 다음 단계

문제를 해결한 후 다음을 수행할 수 있습니다:

- 📖 [고급 기능](../advanced/)을 읽어 다중 계정, 세션 복구 등의 기능을 깊이 있게 이해하세요
- 📚 [부록](../appendix/)을 참조하여 아키텍처 설계와 전체 구성 참조를 확인하세요
- 🔄 [변경 로그](../changelog/)를 팔로우하여 최신 기능과 변경 사항을 받아보세요
