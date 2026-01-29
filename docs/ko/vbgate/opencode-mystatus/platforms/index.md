---
title: "플랫폼 기능: AI 할당량 조회 | opencode-mystatus"
sidebarTitle: "플랫폼 기능"
subtitle: "플랫폼 기능: AI 할당량 조회"
description: "opencode-mystatus의 플랫폼별 할당량 조회 기능을 학습합니다. OpenAI, 지푸 AI, GitHub Copilot, Google Cloud 4개 플랫폼을 지원합니다."
order: 2
---

# 플랫폼 기능

이 장에서는 opencode-mystatus가 지원하는 각 AI 플랫폼의 할당량 조회 기능을 상세히 소개합니다.

## 지원되는 플랫폼

opencode-mystatus는 다음 4개의 주요 AI 플랫폼을 지원합니다:

| 플랫폼 | 할당량 유형 | 특징 |
|------|---------|------|
| OpenAI | 3시간 / 24시간 슬라이딩 창 | Plus, Team, Pro 구독 지원 |
| 지푸 AI | 5시간 Token / MCP 월간 할당량 | Coding Plan 지원 |
| GitHub Copilot | 월간 할당량 | Premium Requests 사용량 표시 |
| Google Cloud | 모델별 독립 계산 | 다중 계정, 4개 모델 지원 |

## 플랫폼 상세 설명

### [OpenAI 할당량](./openai-usage/)

OpenAI 할당량 조회 메커니즘을 깊이 이해합니다:

- 3시간 및 24시간 슬라이딩 창의 차이
- 팀 계정의 할당량 공유 메커니즘
- JWT 토큰 파싱으로 계정 정보 얻기

### [지푸 AI 할당량](./zhipu-usage/)

지푸 AI 및 Z.ai 할당량 조회를 이해합니다:

- 5시간 Token 할당량의 계산 방식
- MCP 월간 할당량의 용도
- API Key 마스킹 표시

### [GitHub Copilot 할당량](./copilot-usage/)

GitHub Copilot 할당량 관리를 마스터합니다:

- Premium Requests의 의미
- 다른 구독 유형의 할당량 차이
- 월간 재설정 시간 계산

### [Google Cloud 할당량](./google-usage/)

Google Cloud 다중 계정 할당량 조회를 학습합니다:

- 4개 모델(G3 Pro, G3 Image, G3 Flash, Claude)의 차이
- 다중 계정 관리 및 전환
- 인증 파일 읽기 메커니즘

## 선택 가이드

사용하는 플랫폼에 따라 해당 튜토리얼을 선택하세요:

- **OpenAI만 사용**: 바로 [OpenAI 할당량](./openai-usage/) 보기
- **지푸 AI만 사용**: 바로 [지푸 AI 할당량](./zhipu-usage/) 보기
- **다중 플랫폼 사용자**: 모든 플랫폼 튜토리얼을 순서대로 읽는 것이 좋습니다
- **Google Cloud 사용자**: 먼저 [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) 플러그인 설치 필요

## 다음 단계

이 장을 완료하면 [고급 기능](../advanced/)을 계속 학습하여 더 많은 설정 옵션을 이해할 수 있습니다.
