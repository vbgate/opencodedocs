---
title: "오디오 API: Whisper 호환 엔드포인트 | Antigravity-Manager"
subtitle: "오디오 API: Whisper 호환 엔드포인트"
sidebarTitle: "5분 오디오를 텍스트로"
description: "Antigravity-Manager 오디오 변환 API 사용법을 학습합니다. 6가지 형식 지원, 15MB 제한 및 대용량 본문 처리 방법을 마스터하여 오디오를 텍스트로 빠르게 변환합니다."
tags:
  - "오디오 변환"
  - "OpenAI"
  - "Whisper"
  - "Gemini"
  - "API 프록시"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 5
---
# 오디오 변환: /v1/audio/transcriptions의 제한 및 대용량 본문 처리

**`POST /v1/audio/transcriptions` 오디오 변환 엔드포인트**를 사용하여 오디오 파일을 텍스트로 변환할 수 있습니다. OpenAI Whisper API처럼 보이지만 로컬 게이트웨이에서 형식 검증, 파일 크기 제한을 수행하고 오디오를 Gemini의 `inlineData`로 업스트림 요청을 보냅니다.

## 학습 후 할 수 있는 것

- curl / OpenAI SDK로 `POST /v1/audio/transcriptions`를 호출하여 오디오를 `{"text":"..."}`로 변환
- 지원되는 6가지 오디오 형식 및 **15MB 하드 제한**의 실제 오류 형태 파악
- `model` / `prompt`의 기본값 및 전달 방식 이해(업스트림 규칙 추측하지 않음)
- Proxy Monitor에서 오디오 요청을 찾고 `[Binary Request Data]`의 출처 이해

## 현재 직면한 문제

회의 녹음, 팟캐스트 또는 고객 서비스 통화를 텍스트로 변환하고 싶지만 다음과 같은 지점에 자주 막힙니다:

- 다른 도구가 오디오 형식/인터페이스 모양이 다르며 스크립트와 SDK 재사용이 어려움
- 업로드 실패 시 "잘못된 요청/게이트웨이 오류"만 보고 형식이 잘못되었는지 파일이 너무 큰지 알 수 없음
- 변환을 Antigravity Tools의 "로컬 게이트웨이"로 통합하여 통합 예약 및 모니터링하고 싶지만 호환 정도가 확실하지 않음

## 🎒 시작 전 준비

::: warning 전제 조건
- 이미 [로컬 리버스 프록시 시작 및 첫 번째 클라이언트 연결](/ko/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)을 실행했고 리버스 프록시 포트를 알고 있습니다(이 페이지에서 `8045`를 예로 사용)
- 이미 [계정 추가](/ko/lbjlaq/Antigravity-Manager/start/add-account/)를 실행했고 최소 1개의 사용 가능한 계정이 있음
:::

## 오디오 변환 엔드포인트(/v1/audio/transcriptions)란?

**오디오 변환 엔드포인트**는 Antigravity Tools가 노출하는 OpenAI Whisper 호환 라우트입니다. 클라이언트는 `multipart/form-data`로 오디오 파일을 업로드하고 서버는 확장명과 크기를 검증한 후 오디오를 Base64 `inlineData`로 변환하여 업스트림 `generateContent`를 호출하고 마지막으로 `text` 필드만 반환합니다.

## 엔드포인트 및 제한 개요

| 항목 | 결론 | 코드 증거 |
| --- | --- | --- |
| 엔트리 라우트 | `POST /v1/audio/transcriptions` | `src-tauri/src/proxy/server.rs` 라우트를 `handlers::audio::handle_audio_transcription`에 등록 |
| 지원 형식 | 파일 확장명으로 식별: `mp3/wav/m4a/ogg/flac/aiff(aif)` | `src-tauri/src/proxy/audio/mod.rs` `detect_mime_type()` |
| 파일 크기 | **15MB 하드 제한**(초과 시 413 + 텍스트 오류 메시지 반환) | `src-tauri/src/proxy/audio/mod.rs` `exceeds_size_limit()`; `src-tauri/src/proxy/handlers/audio.rs` |
| 리버스 프록시 전체 body 제한 | Axum 레벨에서 100MB까지 허용 | `src-tauri/src/proxy/server.rs` `DefaultBodyLimit::max(100 * 1024 * 1024)` |
| 기본 매개변수 | `model="gemini-2.0-flash-exp"`; `prompt="Generate a transcript of the speech."` | `src-tauri/src/proxy/handlers/audio.rs` |

## 따라 해 보기

### 1단계: 게이트웨이가 실행 중인지 확인(/healthz)

**이유**
포트가 잘못되었거나 서비스가 시작되지 않은 문제를 먼저 제거합니다.

::: code-group

```bash [macOS/Linux]
curl -s http://127.0.0.1:8045/healthz
```

```powershell [Windows]
curl http://127.0.0.1:8045/healthz
```

:::

**다음을 보아야 합니다**: `{"status":"ok"}`와 같은 JSON.

### 2단계: 15MB를 초과하지 않는 오디오 파일 준비

**이유**
서버는 핸들러에서 15MB 검증을 수행하며 초과 시 413을 직접 반환합니다.

::: code-group

```bash [macOS/Linux]
ls -lh audio.mp3
```

```powershell [Windows]
Get-Item audio.mp3 | Select-Object Length
```

:::

**다음을 보아야 합니다**: 파일 크기가 `15MB`를 초과하지 않음.

### 3단계: curl로 /v1/audio/transcriptions 호출

**이유**
curl이 가장 직관적이며 프로토콜 모양과 오류 메시지를 먼저 검증하기 편리합니다.

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3" \
  -F "model=gemini-2.0-flash-exp" \
  -F "prompt=Generate a transcript of the speech."
```

**다음을 보아야 합니다**: JSON을 반환하며 `text` 필드 하나만 있습니다.

```json
{
  "text": "..."
}
```

### 4단계: OpenAI Python SDK로 호출

```python
from openai import OpenAI

client = OpenAI(
  base_url="http://127.0.0.1:8045/v1",
  api_key="your-proxy-api-key"  # 인증 활성화 시
)

audio_file = open("audio.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="gemini-2.0-flash-exp",
  file=audio_file
)

print(transcript.text)
```

**다음을 보아야 합니다**: `print(transcript.text)`가 변환 텍스트를 출력합니다.

## 지원되는 오디오 형식

Antigravity Tools는 파일 확장명으로 MIME 유형을 결정합니다(파일 내용 스니핑이 아님).

| 형식 | MIME 유형 | 확장명 |
| --- | --- | --- |
| MP3 | `audio/mp3` | `.mp3` |
| WAV | `audio/wav` | `.wav` |
| AAC (M4A) | `audio/aac` | `.m4a` |
| OGG | `audio/ogg` | `.ogg` |
| FLAC | `audio/flac` | `.flac` |
| AIFF | `audio/aiff` | `.aiff`, `.aif` |

::: warning 지원되지 않는 형식
확장명이 표에 없으면 `400`을 반환하며 응답 본문은 텍스트입니다. 예: `지원되지 않는 오디오 형식: txt`.
:::

## 체크포인트 ✅

- [ ] 반환 본문이 `{"text":"..."}`(`segments`, `verbose_json` 등 추가 구조 없음)
- [ ] 응답 헤더에 `X-Account-Email` 포함(실제 사용된 계정 표시)
- [ ] "Monitor" 페이지에서 이 요청 기록을 볼 수 있음

## 대용량 본문 처리: 100MB를 보지만 여전히 15MB에 막히는 이유

서버는 Axum 레벨에서 요청 본문 상한을 100MB로 설정합니다(일부 대용량 요청이 프레임워크에 의해 직접 거부되는 것을 방지), 하지만 오디오 변환 핸들러는 추가로 **15MB 검증**을 수행합니다.

즉:

- `15MB < 파일 <= 100MB`: 요청이 핸들러로 들어가지만 `413` + 텍스트 오류 메시지 반환
- `파일 > 100MB`: 요청이 프레임워크 레벨에서 직접 실패할 수 있음(구체적인 오류 형태 보장하지 않음)

### 15MB 초과 시 볼 수 있는 것

상태 코드 `413 Payload Too Large`를 반환하며 응답 본문은 텍스트(JSON 아님)입니다. 내용은 다음과 유사합니다:

```
오디오 파일이 너무 큽니다 (18.5 MB). 최대 15 MB 지원 (약 16분 MP3). 제안: 1) 오디오 품질 압축 2) 분할 업로드
```

### 실행 가능한 두 가지 분할 방법

1) 오디오 품질 압축(WAV를 더 작은 MP3로 변환)

```bash
ffmpeg -i input.wav -b:a 64k -ac 1 output.mp3
```

2) 분할(긴 오디오를 여러 세그먼트로 자름)

```bash
ffmpeg -i long_audio.mp3 -f segment -segment_time 600 -c copy segment_%03d.mp3
```

## 로그 수집 주의 사항

### Monitor에서 실제 요청 본문을 자주 볼 수 없는 이유

Monitor 미들웨어는 **POST 요청 본문**을 먼저 읽어 로그 기록을 수행합니다:

- 요청 본문이 UTF-8 텍스트로 파싱될 수 있으면 원본 텍스트 기록
- 그렇지 않으면 `[Binary Request Data]`로 기록

오디오 변환은 `multipart/form-data`를 사용하며 이진 오디오 내용이 포함되어 있으므로 두 번째 경우로 쉽게 떨어집니다.

### Monitor에서 볼 수 있는 것

```
URL: /v1/audio/transcriptions
Request Body: [Binary Request Data]
Response Body: {"text":"..."}
```

::: info 로그 제한 설명
로그에서 오디오 본체를 볼 수 없지만 `status/duration/X-Account-Email`로 빠르게 판단할 수 있습니다: 프로토콜 호환, 파일이 너무 큼, 또는 업스트림 실패.
:::

## 매개변수 설명("경험적 보완" 수행 안 함)

이 엔드포인트는 3개의 폼 필드만 명시적으로 읽습니다:

| 필드 | 필수 여부 | 기본값 | 처리 방식 |
| --- | --- | --- | --- |
| `file` | ✅ | 없음 | 반드시 제공해야 함. 누락 시 `400` + 텍스트 `오디오 파일 누락` 반환 |
| `model` | ❌ | `gemini-2.0-flash-exp` | 문자열로 전달하며 토큰 획득에 참여(구체적인 업스트림 규칙은 실제 응답을 기준) |
| `prompt` | ❌ | `Generate a transcript of the speech.` | 첫 번째 `text`로 업스트림에 전송하여 변환 안내에 사용 |

## 피해야 할 함정

### ❌ 오류 1: 잘못된 curl 매개변수 사용으로 인해 multipart가 아님

```bash
#오류: -d를 직접 사용
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -d "file=@audio.mp3"
```

올바른 방법:

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3"
```

### ❌ 오류 2: 파일 확장명이 지원 목록에 없음

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@document.txt"
```

올바른 방법: 오디오 파일만 업로드합니다(`.mp3`, `.wav` 등).

### ❌ 오류 3: 413을 "게이트웨이 고장"으로 간주

여기서 `413`은 보통 15MB 검증이 트리거된 것입니다. 압축/분할을 먼저 수행하는 것이 맹목적인 재시작보다 빠릅니다.

## 이 수업 요약

- **핵심 엔드포인트**: `POST /v1/audio/transcriptions`(Whisper 호환 형태)
- **형식 지원**: mp3, wav, m4a, ogg, flac, aiff(aif)
- **크기 제한**: 15MB(초과 시 `413` + 텍스트 오류 메시지 반환)
- **로그 동작**: multipart에 이진 내용이 있으면 Monitor가 `[Binary Request Data]`를 표시
- **핵심 매개변수**: `file` / `model` / `prompt`(기본값은 위 표 참조)

## 다음 수업 예고

> 다음 수업에서는 **[MCP 엔드포인트: Web Search/Reader/Vision을 호출 가능한 도구로 노출](/ko/lbjlaq/Antigravity-Manager/platforms/mcp/)**를 학습합니다.
>
> 학습하게 될 내용:
> - MCP 엔드포인트의 라우팅 형태 및 인증 전략
> - Web Search/Web Reader/Vision이 "업스트림 전달"인지 "내장 도구"인지
> - 어떤 능력이 실험적인지, 프로덕션에서 문제를 일으키지 않도록 주의

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 라우팅 등록(/v1/audio/transcriptions + body 제한) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 오디오 변환 핸들러(multipart/15MB/inlineData) | [`src-tauri/src/proxy/handlers/audio.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/audio.rs#L16-L162) | 16-162 |
| 지원 형식(확장명 -> MIME + 15MB) | [`src-tauri/src/proxy/audio/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/audio/mod.rs#L6-L35) | 6-35 |
| Monitor 미들웨어(Binary Request Data) | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |

**핵심 상수**:
- `MAX_SIZE = 15 * 1024 * 1024`: 오디오 파일 크기 제한(15MB)
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`: Monitor가 POST 요청 본문을 읽는 상한(100MB)
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`: Monitor가 응답 본문을 읽는 상한(100MB)

**핵심 함수**:
- `handle_audio_transcription()`: multipart 파싱, 확장명 및 크기 검증, `inlineData` 조립 및 업스트림 호출
- `AudioProcessor::detect_mime_type()`: 확장명 -> MIME
- `AudioProcessor::exceeds_size_limit()`: 15MB 검증
- `monitor_middleware()`: 요청/응답 본문을 Proxy Monitor에 저장(UTF-8만 완전히 기록)

</details>
