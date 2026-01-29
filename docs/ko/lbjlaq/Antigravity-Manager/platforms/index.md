---
title: "플랫폼 통합: 다양한 프로토콜 연결 | Antigravity-Manager"
sidebarTitle: "AI 플랫폼 연결"
subtitle: "플랫폼 통합: 다양한 프로토콜 연결"
description: "Antigravity Tools의 플랫폼 프로토콜 연결 방법을 학습합니다. OpenAI, Anthropic, Gemini 등 7가지 프로토콜의 통합 API 게이트웨이 변환을 지원합니다."
order: 200
---

# 플랫폼 및 통합

Antigravity Tools의 핵심 능력은 여러 AI 플랫폼의 프로토콜을 통합 로컬 API 게이트웨이로 변환하는 것입니다. 이 장에서는 각 프로토콜의 연결 방식, 호환 경계 및 모범 사례를 상세히 소개합니다.

## 이 장에 포함된 내용

| 튜토리얼 | 설명 |
|-----|------|
| [OpenAI 호환 API](./openai/) | `/v1/chat/completions` 및 `/v1/responses`의 구현 전략으로 OpenAI SDK 무감각 연결 |
| [Anthropic 호환 API](./anthropic/) | `/v1/messages` 및 Claude Code의 핵심 계약으로 사고 체인, 시스템 프롬프트 등 핵심 능력 지원 |
| [Gemini 네이티브 API](./gemini/) | `/v1beta/models` 및 Google SDK 엔드포인트 연결로 `x-goog-api-key` 호환 지원 |
| [Imagen 3 이미지 생성](./imagen/) | OpenAI Images 매개변수 `size`/`quality` 자동 매핑으로 임의 가로세로 비율 지원 |
| [오디오 변환](./audio/) | `/v1/audio/transcriptions`의 제한 및 대용량 본문 처리 |
| [MCP 엔드포인트](./mcp/) | Web Search/Reader/Vision을 호출 가능한 도구로 노출 |
| [Cloudflared 터널](./cloudflared/) | 로컬 API를 공개 네트워크에 안전하게 노출하는 원클릭(기본적으로 안전하지 않음) |

## 학습 경로 추천

::: tip 추천 순서
1. **먼저 사용할 프로토콜 학습**: Claude Code를 사용하면 먼저 [Anthropic 호환 API](./anthropic/) 보기. OpenAI SDK를 사용하면 먼저 [OpenAI 호환 API](./openai/) 보기
2. **그다음 Gemini 네이티브 학습**: Google SDK 직접 연결 방법 이해
3. **필요에 따라 확장 기능 학습**: 이미지 생성, 오디오 변환, MCP 도구
4. **마지막으로 터널 학습**: 공개 네트워크 노출이 필요할 때만 [Cloudflared 터널](./cloudflared/) 보기
:::

**빠른 선택**:

| 시나리오 | 먼저 볼 것 |
|---------|---------|
| Claude Code CLI 사용 | [Anthropic 호환 API](./anthropic/) |
| OpenAI Python SDK 사용 | [OpenAI 호환 API](./openai/) |
| Google 공식 SDK 사용 | [Gemini 네이티브 API](./gemini/) |
| AI 이미지 그리기 필요 | [Imagen 3 이미지 생성](./imagen/) |
| 음성을 텍스트로 변환 필요 | [오디오 변환](./audio/) |
| 인터넷 검색/웹 읽기 필요 | [MCP 엔드포인트](./mcp/) |
| 원격 액세스 필요 | [Cloudflared 터널](./cloudflared/) |

## 전제 조건

::: warning 시작 전 확인
- [설치 및 업그레이드](../start/installation/) 완료
- [계정 추가](../start/add-account/) 완료
- [로컬 리버스 프록시 시작](../start/proxy-and-first-client/) 완료(최소 `/healthz` 액세스 가능)
:::

## 다음 단계

이 장을 학습한 후 다음을 계속 학습할 수 있습니다:

- [고급 구성](../advanced/): 모델 라우팅, 할당량 거버넌스, 고가용성 스케줄링 등 고급 기능
- [일반적인 문제](../faq/): 401/404/429 등 오류 발생 시 문제 해결 가이드
