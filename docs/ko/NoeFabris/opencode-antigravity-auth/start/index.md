---
title: "빠른 시작: Antigravity Auth 설치 및 설정 | OpenCode"
sidebarTitle: "10분 만에 시작하기"
subtitle: "빠른 시작: Antigravity Auth 설치 및 설정"
description: "Antigravity Auth 플러그인의 설치 및 설정 방법을 배웁니다. 10분 안에 Google OAuth 인증을 완료하고, 첫 번째 모델 요청을 보내 Claude와 Gemini 모델 접근이 성공했는지 확인합니다."
order: 1
---

# 빠른 시작

본 섹션에서는 Antigravity Auth 플러그인을 처음부터 사용하는 방법을 안내합니다. 플러그인의 핵심 가치를 이해하고, 설치 및 OAuth 인증을 완료한 후, 첫 번째 모델 요청을 보내 설정이 성공했는지 확인합니다.

## 학습 경로

다음 순서대로 학습하세요. 각 단계는 이전 단계를 기반으로 합니다:

### 1. [플러그인 소개](./what-is-antigravity-auth/)

Antigravity Auth 플러그인의 핵심 가치, 적용 시나리오 및 위험 안내를 알아봅니다.

- 플러그인이 사용 시나리오에 적합한지 판단
- 지원되는 AI 모델 확인 (Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash)
- 사용 위험 및 주의사항 명확히 이해

### 2. [빠른 설치](./quick-install/)

5분 만에 플러그인 설치와 첫 인증을 완료합니다.

- 두 가지 설치 방법 (AI 지원 / 수동 설정)
- 모델 정의 설정
- Google OAuth 인증 실행

### 3. [OAuth 2.0 PKCE 인증](./first-auth-login/)

OAuth 2.0 PKCE 인증 흐름을 이해하고 첫 로그인을 완료합니다.

- PKCE 인증의 보안 메커니즘 이해
- 첫 로그인으로 API 접근 권한 획득
- 토큰 갱신의 자동화 처리 이해

### 4. [첫 번째 요청](./first-request/)

첫 번째 모델 요청을 보내 설치 성공을 확인합니다.

- 첫 번째 Antigravity 모델 요청 전송
- `--model` 및 `--variant` 매개변수 이해
- 일반적인 모델 요청 오류 해결

## 사전 요구사항

본 섹션을 시작하기 전에 확인하세요:

- ✅ OpenCode CLI 설치 완료 (`opencode` 명령어 사용 가능)
- ✅ Google 계정 보유 (OAuth 인증용)

## 다음 단계

빠른 시작을 완료한 후:

- **[사용 가능한 모델 알아보기](../platforms/available-models/)** — 지원되는 모든 모델과 변형 설정 탐색
- **[다중 계정 설정](../advanced/multi-account-setup/)** — 여러 Google 계정으로 할당량 풀링 설정
- **[일반적인 인증 문제](../faq/common-auth-issues/)** — 문제 발생 시 문제 해결 가이드 참조
