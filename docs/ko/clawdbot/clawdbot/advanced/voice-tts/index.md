---
title: "음성 웨이크 및 TTS: Voice Wake, Talk Mode, 음성 구성 | Clawdbot 튜토리얼"
sidebarTitle: "한마디로 AI 깨우기"
subtitle: "음성 웨이크 및 텍스트 음성 변환"
description: "Clawdbot의 음성 기능을 구성하는 방법을 배웁니다: Voice Wake 음성 웨이크, Talk Mode 지속 대화 모드, TTS 텍스트 음성 변환 제공자(Edge, OpenAI, ElevenLabs). 이 튜토리얼에서는 음성 웨이크 워드 설정, 지속 음성 대화, 다중 제공자 TTS 구성 및 일반적인 문제 해결을 다룹니다."
tags:
  - "advanced"
  - "voice"
  - "tts"
  - "configuration"
prerequisite:
  - "start-getting-started"
order: 250
---

# 음성 웨이크 및 텍스트 음성 변환

## 학습 후 할 수 있는 것

- Voice Wake 음성 웨이크 구성, macOS/iOS/Android 노드 지원
- Talk Mode를 사용하여 지속 음성 대화(음성 입력 → AI → 음성 출력)
- 다중 TTS 제공자(Edge, OpenAI, ElevenLabs) 및 자동 장애 조치 구성
- 사용자 정의 음성 웨이크 워드, TTS 음성 및 대화 매개변수
- 음성 기능 일반 문제 해결(권한, 오디오 형식, API 오류)

## 현재 문제점

음성 상호작용은 편리하지만 구성은 혼란스러울 수 있습니다:

- 어떤 TTS 제공자를 사용해야 할까요? Edge는 무료지만 품질은 보통, ElevenLabs는 고품질이지만 유료
- Voice Wake와 Talk Mode의 차이점은 무엇인가요? 언제 어느 것을 사용해야 할까요?
- 기본 "clawd"가 아닌 사용자 정의 웨이크 워드를 설정하는 방법은 무엇인가요?
- 다른 장치(macOS, iOS, Android)에서 음성 구성을 동기화하는 방법은 무엇인가요?
- TTS 출력 형식에 대한 고려 사항은 무엇인가요? 왜 Telegram은 Opus를 사용하고 다른 채널은 MP3를 사용하는가요?

## 언제 이 기능을 사용할까요

- **Voice Wake**: 핸즈프리 음성 어시스턴트 경험이 필요할 때. 예: macOS 또는 iOS/Android에서 직접 말하여 AI 웨이크, 키보드 작업 불필요.
- **Talk Mode**: 지속 음성 대화가 필요할 때. 예: 운전, 요리, 걷기 중에 음성으로 AI와 다 라운드 대화.
- **TTS 구성**: AI 응답을 음성으로 재생하길 원할 때. 예: 노인이나 시각 장애인을 위한 음성 어시스턴트 또는 개인 음성 어시스턴트 경험.
- **사용자 정의 음성**: 기본 음성에 만족하지 않을 때. 예: 속도, 피치, 안정성 조정 또는 중국어 음성 모델로 전환.

## 🎒 시작 전 준비

::: warning 전제 조건
이 튜토리얼은 [빠른 시작](../../start/getting-started/)을 완료하고 Gateway를 설치 및 시작했다고 가정합니다.
::

- Gateway 데몬 실행 중
- 최소 하나의 AI 모델 제공자 구성됨(Anthropic 또는 OpenAI)
- **Voice Wake의 경우**: macOS/iOS/Android 장치가 설치되고 Gateway에 연결됨
- **Talk Mode의 경우**: iOS 또는 Android 노드가 연결됨(macOS 메뉴 바 앱은 Voice Wake만 지원)
- **ElevenLabs TTS의 경우**: ElevenLabs API Key 준비(고품질 음성 필요 시)
- **OpenAI TTS의 경우**: OpenAI API Key 준비(선택 사항, Edge TTS는 무료지만 품질은 보통)

::: info 권한 알림
Voice Wake와 Talk Mode에는 다음 권한이 필요합니다:
- **마이크 권한**: 음성 입력 필수
- **음성 인식 권한**(Speech Recognition): 음성을 텍스트로
- **보조 기능 권한**(macOS): 전역 단축키 감시(Cmd+Fn 푸시 투 토크 등)
::

## 핵심 개념

Clawdbot 음성 기능은 세 개의 독립 모듈로 구성되지만 함께 작동합니다: Voice Wake(음성 웨이크), Talk Mode(지속 대화), TTS(텍스트 음성 변환).

### Voice Wake: 전역 웨이크 워드 시스템

웨이크 워드는 Gateway 전역 구성입니다.

### Talk Mode: 음성 대화 루프

지속 음성 대화 루프로 Listening → Thinking → Speaking 상태 전환을 반복합니다.

### TTS: 다중 제공자 자동 장애 조치

세 개의 TTS 제공자(Edge, OpenAI, ElevenLabs)를 지원하며 자동으로 장애 조치합니다.

## 같이 해보기

### 1단계: 기본 TTS 구성

`~/.clawdbot/clawdbot.json` 편집:

```yaml
messages:
  tts:
    auto: "always"
    provider: "edge"
    edge:
      enabled: true
      voice: "zh-CN-XiaoxiaoNeural"
      lang: "zh-CN"
      outputFormat: "audio-24khz-48kbitrate-mono-mp3"
```

```bash
clawdbot gateway restart
```

### 2단계: ElevenLabs TTS 구성

[ElevenLabs 콘솔](https://elevenlabs.io/app)에서 API Key 생성.

환경 변수 설정:

```bash
export ELEVENLABS_API_KEY="xi_..."
```

또는 설정 파일:

```yaml
messages:
  tts:
    provider: "elevenlabs"
    elevenlabs:
      voiceId: "pMsXgVXv3BLzUgSXRplE"
      modelId: "eleven_multilingual_v2"
```

### 3단계: OpenAI TTS 백업 구성

```yaml
messages:
  tts:
    provider: "elevenlabs"
    openai:
      model: "gpt-4o-mini-tts"
      voice: "alloy"
```

### 4단계: Voice Wake 웨이크 워드 구성

macOS App에서 Settings → Voice Wake로 이동하여 웨이크 워드 편집.

또는 RPC:

```bash
clawdbot gateway rpc voicewake.set '{"triggers":["助手","小助"]}'
```

### 5단계: Talk Mode 사용(iOS/Android)

iOS/Android 앱에서 Talk 버튼 탭하여 활성화.

## 검사점 ✅

- [ ] TTS 기본 구성 완료
- [ ] 최소 하나의 채널에서 AI 음성 응답 수신
- [ ] Voice Wake 웨이크 워드 사용자 정의
- [ ] iOS/Android Talk Mode 시작 및 지속 대화 가능
- [ ] TTS 중단 기능 정상 작동
- [ ] `/tts` 명령으로 제공자 전환 가능
- [ ] Gateway 로그에 TTS 관련 오류 없음

## 요약

- Clawdbot 음성 기능은 세 개의 모듈로 구성: Voice Wake, Talk Mode, TTS
- TTS는 세 개의 제공자 지원: Edge(무료), OpenAI(안정), ElevenLabs(고품질)
- Voice Wake는 전역 웨이크 워드 구성 사용
- Talk Mode는 iOS/Android만 지원
- TTS 출력 형식은 채널에 의해 결정
- 추천 구성: 기본 ElevenLabs, 백업 OpenAI, 비상시 Edge TTS

## 다음 레슨

> 다음 레슨에서는 **[메모리 시스템 및 벡터 검색](../memory-system/)**을 학습합니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 표시</strong></summary>

> 업데이트: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| TTS 코어 로직 | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 1-1472 |
| ElevenLabs TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 916-991 |
| OpenAI TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 993-1037 |
| Edge TTS | [`src/tts/tts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/tts/tts.ts) | 1050-1069 |
| Voice Wake 설정 관리 | [`src/infra/voicewake.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/voicewake.ts) | 1-91 |

</details>
