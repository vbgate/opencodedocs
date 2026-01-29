---
title: "고급 기능"
sidebarTitle: "AI 초능력 잠금 해제"
subtitle: "고급 기능"
description: "Clawdbot의 고급 기능 구성을 학습합니다. AI 모델 구성, 다중 Agent 협업, 브라우저 자동화, 명령 실행 도구, 웹 검색 도구, Canvas 시각화 인터페이스, 음성 웨이크업 및 TTS, 메모리 시스템, Cron 예약 작업, 스킬 플랫폼, 보안 샌드박스 및 원격 Gateway를 포함합니다."
prerequisite:
  - "start/getting-started"
  - "start/gateway-startup"
order: 185
---

# 고급 기능

## 개요

이 장에서는 Clawdbot의 고급 기능을 심층적으로 소개하며, AI 어시스턴트의 강력한 기능을 최대한 활용할 수 있도록 도와드립니다. AI 모델 구성 및 다중 Agent 협업부터 브라우저 자동화, 메모리 시스템 및 음성 기능까지, 필요에 따라 학습 내용을 선택할 수 있습니다.

::: info 사전 요구사항
이 장을 학습하기 전에 다음 내용을 완료하세요:
- [빠른 시작](../../start/getting-started/)
- [Gateway 시작](../../start/gateway-startup/)
:::

## 학습 경로

요구사항에 따라 다른 학습 경로를 선택할 수 있습니다:

### 🚀 빠른 시작 경로 (신규 사용자 추천)
1. [AI 모델 및 인증 구성](./models-auth/) - 선호하는 AI 모델 구성
2. [명령 실행 도구 및 승인](./tools-exec/) - AI가 명령을 안전하게 실행하도록 설정
3. [웹 검색 및 스크래핑 도구](./tools-web/) - AI의 지식 습득 능력 확장

### 🤖 AI 능력 확장 경로
1. [세션 관리 및 다중 Agent](./session-management/) - AI 협업 메커니즘 이해
2. [메모리 시스템 및 벡터 검색](./memory-system/) - AI가 중요한 정보를 기억하도록 설정
3. [스킬 플랫폼 및 ClawdHub](./skills-platform/) - 스킬 팩 사용 및 공유

### 🔧 자동화 도구 경로
1. [브라우저 자동화 도구](./tools-browser/) - 웹페이지 작업 자동화
2. [Cron 예약 작업 및 Webhook](./cron-automation/) - 예약 작업 및 이벤트 트리거
3. [원격 Gateway 및 Tailscale](./remote-gateway/) - 원격 AI 어시스턴트 액세스

### 🎨 상호작용 경험 경로
1. [Canvas 시각화 인터페이스 및 A2UI](./canvas/) - 시각화 상호작용 인터페이스
2. [음성 웨이크업 및 텍스트 음성 변환](./voice-tts/) - 음성 상호작용 기능

### 🔒 보안 및 배포 경로
1. [보안 및 샌드박스 격리](./security-sandbox/) - 보안 메커니즘 심층 이해
2. [원격 Gateway 및 Tailscale](./remote-gateway/) - 안전한 원격 액세스

## 하위 페이지 탐색

### 핵심 구성

| 주제 | 설명 | 예상 시간 |
|--- | --- | ---|
| [AI 모델 및 인증 구성](./models-auth/) | Anthropic, OpenAI, OpenRouter, Ollama 등 다양한 AI 모델 공급자 및 인증 방식 구성 | 15분 |
| [세션 관리 및 다중 Agent](./session-management/) | 세션 모델, 세션 격리, 하위 Agent 협업, 컨텍스트 압축 등 핵심 개념 학습 | 20분 |

### 도구 시스템

| 주제 | 설명 | 예상 시간 |
|--- | --- | ---|
| [브라우저 자동화 도구](./tools-browser/) | 브라우저 도구를 사용하여 웹페이지 자동화, 스크린샷, 양식 작업 등 수행 | 25분 |
| [명령 실행 도구 및 승인](./tools-exec/) | exec 도구 구성 및 사용, 보안 승인 메커니즘 및 권한 제어 이해 | 15분 |
| [웹 검색 및 스크래핑 도구](./tools-web/) | web_search 및 web_fetch 도구를 사용하여 웹 검색 및 콘텐츠 스크래핑 수행 | 20분 |

### 상호작용 경험

| 주제 | 설명 | 예상 시간 |
|--- | --- | ---|
| [Canvas 시각화 인터페이스 및 A2UI](./canvas/) | Canvas A2UI 푸시 메커니즘, 시각화 인터페이스 작업 및 사용자 정의 인터페이스 이해 | 20분 |
| [음성 웨이크업 및 텍스트 음성 변환](./voice-tts/) | Voice Wake, Talk Mode 및 TTS 공급자 구성, 음성 상호작용 구현 | 15분 |

### 지능형 확장

| 주제 | 설명 | 예상 시간 |
|--- | --- | ---|
| [메모리 시스템 및 벡터 검색](./memory-system/) | 메모리 시스템(SQLite-vec, FTS5, 하이브리드 검색) 구성 및 사용 | 25분 |
| [스킬 플랫폼 및 ClawdHub](./skills-platform/) | 스킬 시스템, Bundled/Managed/Workspace 스킬, ClawdHub 통합 이해 | 20분 |

### 자동화 및 배포

| 주제 | 설명 | 예상 시간 |
|--- | --- | ---|
| [Cron 예약 작업 및 Webhook](./cron-automation/) | 예약 작업, Webhook 트리거, Gmail Pub/Sub 등 자동화 기능 구성 | 20분 |
| [원격 Gateway 및 Tailscale](./remote-gateway/) | Tailscale Serve/Funnel 또는 SSH 터널을 통해 원격 Gateway 액세스 | 15분 |

### 보안 메커니즘

| 주제 | 설명 | 예상 시간 |
|--- | --- | ---|
| [보안 및 샌드박스 격리](./security-sandbox/) | 보안 모델, 도구 권한 제어, 샌드박스 격리, Docker화 배포 이해 | 20분 |

## 다음 단계

이 장의 학습을 완료한 후 다음을 수행할 수 있습니다:

1. **심층 학습** - [문제 해결](../../faq/troubleshooting/)을 확인하여 발생한 문제 해결
2. **배포 이해** - [배포 옵션](../../appendix/deployment/)을 확인하여 Clawdbot을 프로덕션 환경에 배포
3. **확장 개발** - [개발 가이드](../../appendix/development/)를 확인하여 플러그인 개발 및 코드 기여 방법 학습
4. **구성 확인** - [전체 구성 참조](../../appendix/config-reference/)를 참조하여 모든 구성 옵션 확인

::: tip 학습 제안
실제 요구사항에 따라 학습 경로를 선택하는 것이 좋습니다. 어디서부터 시작해야 할지 확실하지 않다면 '빠른 시작 경로'를 따라 단계적으로 학습하고, 다른 주제는 필요할 때 심층적으로 학습할 수 있습니다.
:::
