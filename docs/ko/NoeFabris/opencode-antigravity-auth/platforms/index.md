---
title: "플랫폼 기능: 모델 및 할당량 | opencode-antigravity-auth"
sidebarTitle: "이중 할당량 시스템 활성화"
subtitle: "플랫폼 기능: 모델 및 할당량"
description: "Antigravity Auth의 모델 유형과 이중 할당량 시스템을 알아보세요. 모델 선택, Thinking 구성 및 Google Search 방법을 활용하여 할당량을 최적화하세요."
order: 2
---

# 플랫폼 기능

이 장에서는 Antigravity Auth 플러그인이 지원하는 모델, 할당량 시스템 및 플랫폼 특성에 대해 자세히 알아봅니다. 적절한 모델 선택, Thinking 기능 구성, Google Search 활성화 및 할당량 최대 활용 방법을 익힐 수 있습니다.

## 사전 요구사항

::: warning 시작하기 전에 확인하세요
이 장을 학습하기 전에 다음을 완료했는지 확인하세요:
- [빠른 설치](../start/quick-install/): 플러그인 설치 및 첫 인증 완료
- [첫 번째 요청](../start/first-request/): 첫 번째 모델 요청 성공
:::

## 학습 경로

다음 순서대로 학습하며 플랫폼 기능을 단계별로 익혀보세요:

### 1. [사용 가능한 모델](./available-models/)

사용 가능한 모든 모델과 변형 구성에 대해 알아보기

- Claude Opus 4.5, Sonnet 4.5 및 Gemini 3 Pro/Flash 이해
- Antigravity와 Gemini CLI 두 가지 할당량 풀의 모델 분포 파악
- `--variant` 매개변수 사용법 숙달

### 2. [이중 할당량 시스템](./dual-quota-system/)

Antigravity와 Gemini CLI 이중 할당량 풀의 작동 방식 이해

- 각 계정이 두 개의 독립적인 Gemini 할당량 풀을 보유하는 방식
- 자동 fallback 구성을 활성화하여 할당량 두 배 확보
- 특정 할당량 풀을 사용하도록 모델을 명시적으로 지정

### 3. [Google Search Grounding](./google-search-grounding/)

Gemini 모델에 Google Search를 활성화하여 사실 정확도 향상

- Gemini가 실시간 웹 정보를 검색할 수 있도록 설정
- 검색 임계값을 조절하여 검색 빈도 제어
- 작업 요구사항에 맞는 적절한 구성 선택

### 4. [Thinking 모델](./thinking-models/)

Claude와 Gemini 3 Thinking 모델의 구성 및 사용법 익히기

- Claude의 thinking budget 구성
- Gemini 3의 thinking level 활용(minimal/low/medium/high)
- interleaved thinking과 사고 블록 보존 전략 이해

## 다음 단계

이 장을 완료한 후 다음을 학습할 수 있습니다:

- [다중 계정 구성](../advanced/multi-account-setup/): 여러 Google 계정을 구성하여 할당량 풀링과 로드 밸런싱 구현
- [계정 선택 전략](../advanced/account-selection-strategies/): sticky, round-robin, hybrid 세 가지 전략의 모범 사례 숙달
- [구성 가이드](../advanced/configuration-guide/): 모든 구성 옵션을 익혀 필요에 맞게 플러그인 동작 커스터마이즈
