---
title: "다중 채널 및 플랫폼 | Clawdbot 튜토리얼"
sidebarTitle: "일반적으로 사용되는 채팅 도구 연결"
subtitle: "다중 채널 및 플랫폼"
description: "WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, LINE, WebChat, macOS, iOS 및 Android 플랫폼을 포함하여 Clawdbot의 다중 채널 시스템을 구성하고 사용하는 방법을 학습하세요."
tags:
  - "channels"
  - "platforms"
  - "integration"
order: 60
---

# 다중 채널 및 플랫폼

Clawdbot은 통합된 Gateway 제어 평면을 통해 다양한 통신 채널과 플랫폼을 지원하므로, 익숙한 인터페이스에서 AI 어시스턴트와 상호 작용할 수 있습니다.

## 장 개요

이 장에서는 Clawdbot이 지원하는 모든 통신 채널과 플랫폼을 소개합니다. 여기에는 인스턴트 메시징 앱(WhatsApp, Telegram, Slack, Discord 등), 모바일 노드(iOS, Android) 및 데스크톱 애플리케이션(macOS)이 포함됩니다. 이러한 채널을 구성하여 AI 어시스턴트를 일상적인 업무 흐름에 매끄럽게 통합하는 방법을 알아보세요.

## 하위 페이지 탐색

### 채널 개요

- **[다중 채널 시스템 개요](channels-overview/)** - Clawdbot이 지원하는 모든 통신 채널과 그 특징을 알아보고 채널 구성의 기본 개념을 파악하세요.

### 인스턴트 메시징 채널

- **[WhatsApp](whatsapp/)** - WhatsApp 채널 구성 및 사용(Baileys 기반), 기기 연결 및 그룹 관리 지원.
- **[Telegram](telegram/)** - Telegram 채널 구성 및 사용(grammY Bot API 기반), Bot Token 및 Webhook 설정.
- **[Slack](slack/)** - Slack 채널 구성 및 사용(Bolt 기반), 작업 공간에 통합.
- **[Discord](discord/)** - Discord 채널 구성 및 사용(discord.js 기반), 서버 및 채널 지원.
- **[Google Chat](googlechat/)** - Google Chat 채널 구성 및 사용, Google Workspace와 통합.
- **[Signal](signal/)** - Signal 채널 구성 및 사용(signal-cli 기반), 프라이버시 보호 통신.
- **[iMessage](imessage/)** - iMessage 채널 구성 및 사용(macOS 전용), macOS 메시지 앱과 통합.
- **[LINE](line/)** - LINE 채널 구성 및 사용(Messaging API 기반), LINE 사용자와 상호 작용.

### 웹 및 네이티브 애플리케이션

- **[WebChat 인터페이스](webchat/)** - 내장된 WebChat 인터페이스를 사용하여 외부 채널 구성 없이 AI 어시스턴트와 상호 작용.
- **[macOS 애플리케이션](macos-app/)** - macOS 메뉴 바 애플리케이션의 기능인 Voice Wake, Talk Mode 및 원격 제어를 알아보세요.
- **[iOS 노드](ios-node/)** - 장치 로컬 작업(Camera, Canvas, Voice Wake)을 수행하도록 iOS 노드를 구성.
- **[Android 노드](android-node/)** - 장치 로컬 작업(Camera, Canvas)을 수행하도록 Android 노드를 구성.

## 학습 경로 추천

사용 시나리오에 따라 다음과 같은 학습 순서를 추천합니다:

### 초보자 빠른 시작

Clawdbot을 처음 사용하는 경우 다음 순서대로 학습하는 것이 좋습니다:

1. **[다중 채널 시스템 개요](channels-overview/)** - 전체 아키텍처와 채널 개념 먼저 이해
2. **[WebChat 인터페이스](webchat/)** - 구성 없이 바로 사용할 수 있는 가장 간단한 방법
3. **일반적으로 사용되는 채널 하나 선택** - 일상적인 습관에 따라 선택:
   - 일상 채팅 → [WhatsApp](whatsapp/) 또는 [Telegram](telegram/)
   - 팀 협업 → [Slack](slack/) 또는 [Discord](discord/)
   - macOS 사용자 → [iMessage](imessage/)

### 모바일 통합

휴대폰에서 Clawdbot을 사용하려는 경우:

1. **[iOS 노드](ios-node/)** - iPhone/iPad에서 로컬 기능 구성
2. **[Android 노드](android-node/)** - Android 장치에서 로컬 기능 구성
3. **[macOS 애플리케이션](macos-app/)** - macOS 앱을 제어 센터로 사용

### 엔터프라이즈 배포

팀 환경에 배포해야 하는 경우:

1. **[Slack](slack/)** - 팀 작업 공간 통합
2. **[Discord](discord/)** - 커뮤니티 서버 구축
3. **[Google Chat](googlechat/)** - Google Workspace 통합

## 전제 조건

이 장을 학습하기 전에 먼저 다음을 완료하는 것이 좋습니다:

- **[빠른 시작](../start/getting-started/)** - Clawdbot 설치 및 기본 구성 완료
- **[마법사 구성](../start/onboarding-wizard/)** - 마법사를 통해 Gateway 및 채널의 기본 설정 완료

::: tip 팁
마법사 구성을 완료한 경우 일부 채널이 이미 자동으로 구성되어 있을 수 있습니다. 중복되는 구성 단계를 건너뛰고 특정 채널의 고급 기능을 바로 확인할 수 있습니다.
:::

## 다음 단계 안내

이 장의 학습을 완료한 후 다음을 계속 탐색할 수 있습니다:

- **[AI 모델 및 인증 구성](../advanced/models-auth/)** - 다양한 AI 모델 제공업체 구성
- **[세션 관리 및 다중 Agent](../advanced/session-management/)** - 세션 격리 및 하위 Agent 협업 학습
- **[도구 시스템](../advanced/tools-browser/)** - 브라우저 자동화, 명령 실행 등 도구 사용

## 자주 묻는 질문

::: details 여러 채널을 동시에 사용할 수 있나요?
네! Clawdbot은 동시에 여러 채널을 활성화하는 것을 지원합니다. 다른 채널에서 메시지를 수신하고 보낼 수 있으며 모든 메시지는 통합된 Gateway를 통해 처리됩니다.
:::

::: details 어떤 채널을 가장 추천하나요?
사용 시나리오에 따라 다릅니다:
- **WebChat** - 가장 간단하며 구성이 필요 없음
- **WhatsApp** - 친구 및 가족과 채팅하기에 적합
- **Telegram** - Bot API가 안정적이며 자동 응답에 적합
- **Slack/Discord** - 팀 협업에 적합
:::

::: details 채널 구성에 비용이 드나요?
대부분의 채널은 무료이지만 일부 채널에는 비용이 발생할 수 있습니다:
- WhatsApp Business API - 비용이 발생할 수 있음
- Google Chat - Google Workspace 계정 필요
- 기타 채널 - 일반적으로 무료이며 Bot Token만 신청하면 됨
:::
