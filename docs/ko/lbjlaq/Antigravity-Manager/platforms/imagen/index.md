---
title: "OpenAI Images로 Imagen 3 호출: 매개변수 매핑 | Antigravity"
sidebarTitle: "OpenAI 스타일로 호출"
subtitle: "Imagen 3 이미지 생성: OpenAI Images 매개변수 size/quality 자동 매핑"
description: "OpenAI Images API로 Imagen 3을 호출하는 방법을 학습합니다. 매개변수 매핑을 마스터합니다. size(너비x높이)는 비율을 제어하고 quality는 화질을 제어하며 b64_json 및 url 반환을 지원합니다."
tags:
  - "Imagen 3"
  - "OpenAI Images API"
  - "이미지 생성"
  - "Gemini"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-security"
duration: 12
order: 4
---

# Imagen 3 이미지 생성: OpenAI Images 매개변수 size/quality 자동 매핑

OpenAI Images API 습관으로 Imagen 3을 호출하고 싶으신가요? Antigravity Tools의 로컬 리버스 프록시는 `/v1/images/generations`를 제공하며 `size` / `quality`를 자동으로 Imagen 3에 필요한 이미지 비율 및 해상도 설정으로 매핑합니다.

## 학습 후 할 수 있는 것

- `POST /v1/images/generations`로 Imagen 3 이미지 생성, 기존 OpenAI 클라이언트/SDK 호출 습관 변경 없음
- `size: "WIDTHxHEIGHT"`로 안정적으로 `aspectRatio` 제어(16:9, 9:16 등)
- `quality: "standard" | "medium" | "hd"`로 `imageSize` 제어(표준/2K/4K)
- 반환된 `b64_json` / `url(data:...)` 이해 및 응답 헤더로 실제 사용된 계정 확인

## 현재 직면한 문제

다음과 같은 상황을 겪을 수 있습니다:

- 클라이언트는 OpenAI의 `/v1/images/generations`만 호출할 수 있는데 Imagen 3을 사용하고 싶음
- 동일한 프롬프트로 때로는 정사각형, 때로는 가로 이미지가 생성되며 비율 제어가 불안정함
- `size`를 `16:9`로 작성했는데 여전히 1:1이며 그 이유를 모름

## 이 방법을 사용하는 경우

- 이미 Antigravity Tools의 로컬 리버스 프록시를 사용하고 있으며 "이미지 생성"도 동일한 게이트웨이로 통합하고 싶음
- OpenAI Images API를 지원하는 도구(Cherry Studio, Kilo Code 등)가 Imagen 3 이미지를 직접 생성하기를 원함

## 🎒 시작 전 준비

::: warning 사전 확인
이 수업은 이미 로컬 리버스 프록시를 시작할 수 있고 Base URL(예: `http://127.0.0.1:<port>`)을 알고 있다고 가정합니다. 아직 실행하지 못했다면 먼저 「로컬 리버스 프록시 시작 및 첫 번째 클라이언트 연결」을 완료하세요.
:::

::: info 인증 알림
`proxy.auth_mode`(예: `strict` / `all_except_health`)를 활성화했으면 `/v1/images/generations` 호출 시 다음을 휴대해야 합니다:

- `Authorization: Bearer <proxy.api_key>`
:::

## 핵심 아이디어

### 이 "자동 매핑"은 정확히 무엇을 합니까?

**Imagen 3의 OpenAI Images 매핑**은 다음을 의미합니다: 여전히 OpenAI Images API 형식으로 `prompt/size/quality`를 전송하고, 프록시는 `size`를 표준 가로세로 비율(예: 16:9)로 파싱하고 `quality`를 해상도 레벨(2K/4K)로 파싱한 다음 내부 요청 형식으로 업스트림의 `gemini-3-pro-image`를 호출합니다.

::: info 모델 설명
`gemini-3-pro-image`는 Google Imagen 3 이미지 생성 모델 이름입니다(프로젝트 README 문서 참조). 소스코드에서 기본적으로 이 모델을 사용하여 이미지 생성을 수행합니다.
:::

### 1) size -> aspectRatio(동적 계산)

- 프록시는 `size`를 `WIDTHxHEIGHT`로 파싱한 다음 가로세로 비율에 따라 표준 비율과 매칭합니다.
- `size` 파싱 실패(예: `x`로 구분되지 않거나 숫자가 아닌 경우)하면 `1:1`로 돌아갑니다.

### 2) quality -> imageSize(해상도 레벨)

- `quality: "hd"` -> `imageSize: "4K"`
- `quality: "medium"` -> `imageSize: "2K"`
- `quality: "standard"`(또는 다른 값) -> `imageSize`를 설정하지 않음(기본값 유지)

### 3) n 다중 이미지는 "동시에 n회 호출"

이 구현은 업스트림의 `candidateCount > 1`에 의존하지 않고 `n`회 생성을 동시에 여러 번 요청으로 분리한 다음 결과를 OpenAI 스타일의 `data[]`로 병합하여 반환합니다.

## 따라 해 보기

### 1단계: 리버스 프록시가 시작되었는지 확인(선택 사항이지만 강력히 권장)

**이유**
먼저 Base URL과 인증 모드를 확인하여 나중에 문제를 "이미지 생성 실패"로 잘못 판단하지 않도록 합니다.

::: code-group

```bash [macOS/Linux]
 # 활성 확인(auth_mode=all_except_health 시 인증 없이도 액세스 가능)
curl -sS http://127.0.0.1:PORT/healthz
```

```powershell [Windows]
 # 활성 확인(auth_mode=all_except_health 시 인증 없이도 액세스 가능)
curl.exe -sS http://127.0.0.1:PORT/healthz
```

:::

**다음을 보아야 합니다**: `"status": "ok"`가 포함된 JSON을 반환합니다.

### 2단계: 최소 사용 가능한 이미지 생성 요청 발송

**이유**
최소 필드로 체인을 먼저 실행한 다음 비율/화질/수량 등 매개변수를 추가합니다.

::: code-group

```bash [macOS/Linux]
curl -sS http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

```powershell [Windows]
curl.exe -sS http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

:::

**다음을 보아야 합니다**: 응답 JSON에 `data` 배열이 있으며 배열에 `b64_json` 필드가 포함되어 있습니다(내용이 긺).

### 3단계: 어떤 계정을 사용하는지 확인(응답 헤더 보기)

**이유**
이미지 생성도 계정 풀 스케줄링을 거칩니다. 문제 해결 시 "어떤 계정이 생성 중인지" 확인하는 것이 매우 중요합니다.

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

```powershell [Windows]
curl.exe -i http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

:::

**다음을 보아야 합니다**: 응답 헤더에 `X-Account-Email: ...`가 포함되어 있습니다.

### 4단계: size로 가로세로 비율 제어(너비x높이만 사용 권장)

**이유**
Imagen 3 업스트림은 표준화된 `aspectRatio`를 수신합니다. `size`를 일반적인 가로세로로 작성하면 표준 비율로 안정적으로 매핑할 수 있습니다.

| 전송한 size | 프록시가 계산한 aspectRatio |
| --- | --- |
| `"1024x1024"` | `1:1` |
| `"1920x1080"` / `"1280x720"` | `16:9` |
| `"1080x1920"` / `"720x1280"` | `9:16` |
| `"800x600"` | `4:3` |
| `"600x800"` | `3:4` |
| `"2560x1080"` | `21:9` |

**다음을 보아야 합니다**: 이미지 비율이 `size` 변경에 따라 변경됩니다.

### 5단계: quality로 해상도 레벨 제어(standard/medium/hd)

**이유**
Imagen 3의 내부 필드를 기억할 필요가 없습니다. OpenAI Images의 `quality`만으로 해상도 레벨을 전환할 수 있습니다.

| 전송한 quality | 프록시가 쓴 imageSize |
| --- | --- |
| `"standard"` | 설정하지 않음(업스트림 기본값 사용) |
| `"medium"` | `"2K"` |
| `"hd"` | `"4K"` |

**다음을 보아야 합니다**: `hd`의 디테일이 더 풍부함(동시에 더 느리고 리소스를 더 소모하며 이는 업스트림 동작, 실제 반환을 기준으로 함).

### 6단계: b64_json 또는 url 결정

**이유**
이 구현에서 `response_format: "url"`은 공개 네트워크에서 액세스할 수 있는 URL을 제공하지 않고 `data:<mime>;base64,...` Data URI를 반환합니다. 많은 도구는 `b64_json`을 직접 사용하는 것이 더 적합합니다.

| response_format | data[] 필드 |
| --- | --- |
| `"b64_json"`(기본값) | `{ "b64_json": "..." }` |
| `"url"` | `{ "url": "data:image/png;base64,..." }` |

## 체크포인트 ✅

- `/v1/images/generations`로 최소 1장의 이미지를 반환할 수 있음(`data.length >= 1`)
- 응답 헤더에서 `X-Account-Email`을 볼 수 있으며 필요할 때 동일 계정 문제를 재현할 수 있음
- `size`를 `1920x1080`으로 변경한 후 이미지 비율이 가로 이미지(16:9)로 변경됨
- `quality`를 `hd`로 변경한 후 프록시가 이를 `imageSize: "4K"`로 매핑

## 피해야 할 함정

### 1) size를 16:9로 작성하면 16:9를 얻지 못함

여기서 `size` 파싱 로직은 `WIDTHxHEIGHT`로 분리합니다. `size`가 이 형식이 아니면 직접 `1:1`로 돌아갑니다.

| 작성법 | 결과 |
| --- | --- |
| ✓ `"1920x1080"` | 16:9 |
| ❌ `"16:9"` | 돌아감 1:1 |

### 2) 인증을 활성화하지 않았지만 Authorization을 휴대해도 성공하지 않음

인증은 "필수 여부" 문제입니다:

- `proxy.auth_mode=off`: Authorization을 휴대하든 아니든 상관없음
- `proxy.auth_mode=strict/all_except_health`: Authorization을 휴대하지 않으면 거부됨

### 3) n > 1일 때 "부분 성공"이 발생할 수 있음

구현은 동시 요청 및 결과 병합입니다. 일부 요청이 실패해도 여전히 부분 이미지를 반환할 수 있으며 로그에 실패 원인을 기록합니다.

## 이 수업 요약

- `/v1/images/generations`로 Imagen 3을 호출하는 핵심은 다음을 기억하는 것입니다: `size`는 `WIDTHxHEIGHT`, `quality`는 `standard/medium/hd`
- `size`는 `aspectRatio`를 제어하고 `quality`는 `imageSize(2K/4K)`를 제어합니다
- `response_format=url`은 Data URI를 반환하며 공개 URL이 아닙니다

## 다음 수업 예고

> 다음 수업에서는 **[오디오 변환: /v1/audio/transcriptions의 제한 및 대용량 본문 처리](../audio/)**를 학습합니다.

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| OpenAI Images 라우팅 노출 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L123-L146) | 123-146 |
| Images 생성 엔드포인트: prompt/size/quality 파싱 + OpenAI 응답 조립 | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1104-L1333) | 1104-1333 |
| size/quality 파싱 및 매핑(size->aspectRatio, quality->imageSize) | [`src-tauri/src/proxy/mappers/common_utils.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/common_utils.rs#L19-L222) | 19-222 |
| OpenAIRequest 선언 size/quality(프로토콜 레벨 호환용) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L6-L38) | 6-38 |
| OpenAI->Gemini 요청 변환: size/quality를 통합 파싱 함수에 전달 | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L19-L27) | 19-27 |

**핵심 필드(소스코드에서)**:
- `size`: `WIDTHxHEIGHT`로 파싱하여 `aspectRatio`로
- `quality`: `hd -> 4K`, `medium -> 2K`, 기타 설정하지 않음

</details>
