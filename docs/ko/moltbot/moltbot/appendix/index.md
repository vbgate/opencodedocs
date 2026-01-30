---
title: "부록 | Clawdbot 튜토리얼"
sidebarTitle: "설정, 배포, 개발 실전"
subtitle: "부록"
description: "Clawdbot 부록 장: 완전한 설정 참조, Gateway WebSocket API 프로토콜, 배포 옵션 및 개발 가이드."
tags: []
order: 340
---

# 부록

이 장은 Clawdbot의 고급 참조 문서와 개발 리소스를 제공하며, 완전한 설정 참조, Gateway WebSocket API 프로토콜 사양, 배포 옵션 및 개발 가이드를 포함합니다.

::: info 적용 시나리오
이 장은 Clawdbot의 내부 메커니즘을 깊이 이해하고, 고급 설정을 수행하고, 배포하거나 개발에 참여해야 하는 사용자에게 적합합니다. 처음 시작하는 경우 먼저 [빠른 시작](../../start/getting-started/) 장을 완료하는 것이 좋습니다.
:::

## 하위 페이지 탐색

### [완전한 설정 참조](./config-reference/)
**상세 설정 파일 참조** - 모든 설정 항목, 기본값 및 예제를 다룹니다. Gateway, Agent, 채널, 도구 등 모듈의 완전한 설정 설명을 찾아보세요.

### [Gateway WebSocket API 프로토콜](./api-protocol/)
**프로토콜 사양 문서** - Gateway WebSocket 프로토콜의 완전한 사양을 포함하며, 엔드포인트 정의, 메시지 형식, 인증 방법 및 이벤트 구독 메커니즘을 다룹니다. 사용자 지정 클라이언트를 만들거나 Gateway를 통합해야 하는 개발자에게 적합합니다.

### [배포 옵션](./deployment/)
**배포 방법 가이드** - 다양한 플랫폼의 배포 방법: 로컬 설치, Docker, VPS, Fly.io, Nix 등. 다양한 환경에서 Clawdbot을 실행하는 방법을 알아보세요.

### [개발 가이드](./development/)
**개발자 문서** - 소스에서 빌드, 플러그인 개발, 테스트 및 기여 프로세스. Clawdbot 프로젝트 개발에 참여하거나 사용자 지정 플러그인을 작성하는 방법을 배우세요.

## 학습 경로 권장

요구 사항에 따라 적합한 학습 경로를 선택하세요:

### 설정 및 운영 담당자
1. 먼저 [완전한 설정 참조](./config-reference/)를 읽어 모든 설정 가능한 항목을 파악하세요.
2. [배포 옵션](./deployment/)을 참조하여 적합한 배포 방안을 선택하세요.
3. 필요에 따라 Gateway WebSocket API 문서를 참조하여 통합하세요.

### 애플리케이션 개발자
1. [Gateway WebSocket API 프로토콜](./api-protocol/)을 읽어 프로토콜 메커니즘을 이해하세요.
2. [완전한 설정 참조](./config-reference/)를 확인하여 관련 기능을 구성하는 방법을 파악하세요.
3. 프로토콜 예제를 참조하여 클라이언트를 구축하세요.

### 플러그인/기능 개발자
1. [개발 가이드](./development/)를 읽어 개발 환경 및 빌드 프로세스를 파악하세요.
2. [Gateway WebSocket API 프로토콜](./api-protocol/)을 깊이 있게 이해하여 Gateway 아키텍처를 파악하세요.
3. [완전한 설정 참조](./config-reference/)를 참조하여 설정 시스템을 파악하세요.

## 전제 조건

::: warning 전제 지식
이 장을 깊이 있게 이해하기 전에 다음 내용을 완료했는지 확인하세요:
- ✅ [빠른 시작](../../start/getting-started/)을 완료했습니다.
- ✅ 하나 이상의 채널을 구성했습니다(예: [WhatsApp](../../platforms/whatsapp/) 또는 [Telegram](../../platforms/telegram/))
- ✅ 기본 AI 모델 구성에 대해 이해했습니다( [AI 모델 및 인증](../../advanced/models-auth/) 참조)
- ✅ JSON 설정 파일 및 TypeScript에 대한 기본적인 이해가 있습니다.
:::

## 다음 단계 안내

이 장의 학습을 완료한 후 다음을 수행할 수 있습니다:

- **고급 설정 수행** - [완전한 설정 참조](./config-reference/)를 참조하여 Clawdbot을 사용자 지정하세요.
- **프로덕션 환경 배포** - 적합한 배포 방안을 선택하려면 [배포 옵션](./deployment/)을 따르세요.
- **사용자 지정 기능 개발** - 플러그인을 작성하거나 코드를 기여하려면 [개발 가이드](./development/)를 참조하세요.
- **기타 기능 심화 학습** - [고급 기능](../../advanced/) 장을 탐색하세요. 예: 세션 관리, 도구 시스템 등

::: tip 도움 찾기
사용 중 문제가 발생하면 [문제 해결](../../faq/troubleshooting/)에서 일반적인 문제의 해결책을 찾아보세요.
:::
