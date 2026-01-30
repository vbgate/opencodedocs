---
title: "빠른 설치: 5분 만에 플러그인 구성 완료 | Antigravity Auth"
sidebarTitle: "5분 만에 실행하기"
subtitle: "Antigravity Auth 빠른 설치: 5분 만에 플러그인 구성"
description: "Antigravity Auth 플러그인의 빠른 설치 방법을 배우세요. 두 가지 설치 방법(AI 지원/수동), 모델 정의 구성, Google OAuth 인증 및 성공 확인을 알려드립니다."
tags:
  - "빠른 시작"
  - "설치 가이드"
  - "OAuth"
  - "플러그인 구성"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity Auth 빠른 설치: 5분 만에 플러그인 구성 완료

Antigravity Auth 빠른 설치를 통해 5분 안에 OpenCode 플러그인을 구성하고 Claude 및 Gemini 3 고급 모델을 사용할 수 있습니다. 본 튜토리얼은 두 가지 설치 방법(AI 지원/수동 구성)을 제공하며, 플러그인 설치, OAuth 인증, 모델 정의 및 검증 단계를 다루어 빠르게 시작할 수 있도록 도와드립니다.

## 학습 후 할 수 있는 것

- ✅ 5분 안에 Antigravity Auth 플러그인 설치 완료
- ✅ Claude 및 Gemini 3 모델의 액세스 권한 구성
- ✅ Google OAuth 인증 실행 및 설치 성공 확인

## 현재 겪고 있는 문제

Antigravity Auth의 강력한 기능(Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash)을 사용해보고 싶지만, 플러그인 설치 방법과 모델 구성 방법을 몰라 한 단계 실수하면 막힐까 봐 걱정되시나요?

## 언제 사용해야 하나요?

- Antigravity Auth 플러그인을 처음 사용할 때
- 새로운 기기에 OpenCode를 설치할 때
- 플러그인을 재구성해야 할 때

## 🎒 시작 전 준비

::: warning 사전 확인

시작하기 전에 다음을 확인해주세요:
- [ ] OpenCode CLI가 설치되었는지(`opencode` 명령어 사용 가능)
- [ ] Google 계정이 있는지(OAuth 인증용)
- [ ] Antigravity Auth의 기본 개념을 이해했는지([Antigravity Auth란 무엇인가요?](/ko/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/) 읽기)

:::

## 핵심 접근 방식

Antigravity Auth 설치 프로세스는 4단계로 구성됩니다:

1. **플러그인 설치** → OpenCode 구성에서 플러그인 활성화
2. **OAuth 인증** → Google 계정으로 로그인
3. **모델 구성** → Claude/Gemini 모델 정의 추가
4. **설치 검증** → 첫 번째 요청 테스트 실행

**중요 참고**: 모든 시스템에서 구성 파일 경로는 `~/.config/opencode/opencode.json`입니다(Windows의 `~`는 사용자 디렉토리로 자동 변환됨, 예: `C:\Users\YourName`).

## 따라해 보세요

### 1단계: 설치 방법 선택

Antigravity Auth는 두 가지 설치 방법을 제공합니다. 둘 중 하나를 선택하세요.

::: tip 추천 방법

LLM Agent(Claude Code, Cursor, OpenCode 등)를 사용 중이라면 **AI 지원 설치를 추천**합니다. 더 빠르고 편리합니다.

:::

**방법 1: AI 지원 설치(추천)**

다음 프롬프트를 복사하여 모든 LLM Agent에 붙여넣으세요:

```
Install opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

**AI가 자동으로 수행**:
- `~/.config/opencode/opencode.json` 편집
- 플러그인 구성 추가
- 전체 모델 정의 추가
- `opencode auth login` 실행하여 인증 수행

**다음을 볼 수 있습니다**: AI가 "플러그인 설치 성공" 또는 유사한 메시지를 출력합니다.

**방법 2: 수동 설치**

수동 제어를 선호한다면 다음 단계를 따르세요:

**1.1단계: 구성 파일에 플러그인 추가**

`~/.config/opencode/opencode.json`을 편집하세요(파일이 없으면 생성):

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> **Beta 버전**: 최신 기능을 체험하려면 `@latest` 대신 `opencode-antigravity-auth@beta`를 사용하세요.

**다음을 볼 수 있습니다**: 구성 파일에 `plugin` 필드가 있고 그 값이 배열인지 확인하세요.

---

### 2단계: Google OAuth 인증 실행

터미널에서 다음을 실행하세요:

```bash
opencode auth login
```

**시스템이 자동으로 수행**:
1. 로컬 OAuth 서버 시작(`localhost:51121` 대기)
2. 브라우저에서 Google 권한 부여 페이지로 이동
3. OAuth 콜백 수신 및 토큰 교환
4. Google Cloud 프로젝트 ID 자동 획득

**사용자가 수행해야 할 작업**:
1. 브라우저에서 "허용"을 클릭하여 액세스 권한 부여
2. WSL 또는 Docker 환경인 경우 콜백 URL을 수동으로 복사해야 할 수 있음

**다음을 볼 수 있습니다**:

```
✅ Authentication successful
✅ Account added: your-email@gmail.com
✅ Project ID resolved: cloud-project-id-xxx
```

::: tip 다중 계정 지원

더 많은 계정을 추가하여 할당량을 늘리고 싶으신가요? `opencode auth login`을 다시 실행하세요. 플러그인은 최대 10개 계정을 지원하며 자동으로 부하 분산을 위해 순환합니다.

:::

---

### 3단계: 모델 정의 구성

다음 전체 구성을 복사하여 `~/.config/opencode/opencode.json`에 추가하세요(기존 `plugin` 필드를 덮어쓰지 않도록 주의):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: info 모델 분류

- **Antigravity 할당량**(Claude + Gemini 3): `antigravity-gemini-*`, `antigravity-claude-*`
- **Gemini CLI 할당량**(독립): `gemini-2.5-*`, `gemini-3-*-preview`

더 많은 모델 구성 세부정보는 [사용 가능한 모델 전체 목록](/ko/NoeFabris/opencode-antigravity-auth/platforms/available-models/)을 참조하세요.

:::

**다음을 볼 수 있습니다**: 구성 파일에 전체 `provider.google.models` 정의가 포함되어 있고, JSON 형식이 유효한지(구문 오류 없음) 확인하세요.

---

### 4단계: 설치 검증

다음 명령을 실행하여 플러그인이 정상적으로 작동하는지 테스트하세요:

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**다음을 볼 수 있습니다**:

```
현재 사용 중: google/antigravity-claude-sonnet-4-5-thinking (max)
...

Claude: 안녕하세요! 저는 Claude Sonnet 4.5 Thinking입니다.
```

::: tip 체크포인트 ✅

AI가 정상적으로 응답하면 축하합니다! Antigravity Auth 플러그인이 성공적으로 설치 및 구성되었습니다.

:::

---

## 문제 해결 팁

### 문제 1: OAuth 인증 실패

**증상**: `opencode auth login` 실행 후 오류 메시지가 표시됨(예: `invalid_grant` 또는 권한 부여 페이지가 열리지 않음).

**원인**: Google 계정 비밀번호 변경, 보안 이벤트 또는 콜백 URL이 불완전함.

**해결 방법**:
1. 브라우저에서 Google 권한 부여 페이지가 올바르게 열리는지 확인
2. WSL/Docker 환경인 경우 터미널에 표시된 콜백 URL을 수동으로 브라우저에 복사
3. `~/.config/opencode/antigravity-accounts.json`을 삭제한 후 다시 인증

### 문제 2: 모델을 찾을 수 없음(400 오류)

**증상**: 요청 실행 시 `400 Unknown name 'xxx'`가 반환됨.

**원인**: 모델 이름의 오타 또는 구성 파일 형식 문제.

**해결 방법**:
1. `--model` 매개변수가 구성 파일의 키와 정확히 일치하는지 확인(대소문자 구분)
2. `opencode.json`이 유효한 JSON인지 확인(`cat ~/.config/opencode/opencode.json | jq`로 확인)
3. `provider.google.models` 필드 아래에 해당 모델 정의가 있는지 확인

### 문제 3: 구성 파일 경로 오류

**증상**: "구성 파일이 없습니다" 또는 수정이 적용되지 않음.

**원인**: 다른 시스템에서 잘못된 경로를 사용함.

**해결 방법**: 모든 시스템에서 `~/.config/opencode/opencode.json`을 통일해서 사용하세요(Windows 포함, `~`는 사용자 디렉토리로 자동 변환됨).

| 시스템 | 올바른 경로 | 잘못된 경로 |
|--- | --- | ---|
| macOS/Linux | `~/.config/opencode/opencode.json` | `/usr/local/etc/...` |
| Windows | `C:\Users\YourName\.config\opencode\opencode.json` | `%APPDATA%\opencode\...` |

## 수업 요약

본 수업에서는 다음을 완료했습니다:
1. ✅ 두 가지 설치 방법(AI 지원 / 수동 구성)
2. ✅ Google OAuth 인증 프로세스
3. ✅ 전체 모델 구성(Claude + Gemini 3)
4. ✅ 설치 검증 및 일반적인 문제 해결

**핵심 요점**:
- 통일된 구성 파일 경로: `~/.config/opencode/opencode.json`
- OAuth 인증은 Project ID를 자동으로 가져오므로 수동 구성 불필요
- 다중 계정 지원으로 할당량 한도 향상
- `variant` 매개변수로 Thinking 모델의 사고 깊이 제어

## 다음 수업 예고

> 다음 수업에서는 **[처음 인증: OAuth 2.0 PKCE 프로세스 심층 이해](/ko/NoeFabris/opencode-antigravity-auth/start/first-auth-login/)**를 학습합니다.
>
> 학습할 내용:
> - OAuth 2.0 PKCE 작동 원리
> - 토큰 새로고침 메커니즘
> - Project ID 자동 확인 프로세스
> - 계정 저장 형식

---

## 부록: 소스 코드 참조

<details>
<summary><strong>펼쳐서 소스 코드 위치 보기</strong></summary>

> 업데이트: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| OAuth 권한 부여 URL 생성 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L91-L113) | 91-113  |
| PKCE 키 쌍 생성 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L1-L2)   | 1-2     |
| 토큰 교환 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L201-L270) | 201-270 |
| Project ID 자동 획득 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L131-L196) | 131-196 |
| 사용자 정보 가져오기 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L231-L242) | 231-242 |

**핵심 상수**:
- `ANTIGRAVITY_CLIENT_ID`: OAuth 클라이언트 ID(Google 인증용)
- `ANTIGRAVITY_REDIRECT_URI`: OAuth 콜백 주소(고정: `http://localhost:51121/oauth-callback`)
- `ANTIGRAVITY_SCOPES`: OAuth 권한 범위 목록

**핵심 함수**:
- `authorizeAntigravity()`: PKCE challenge를 포함한 OAuth 권한 부여 URL 생성
- `exchangeAntigravity()`: 권한 부여 코드를 교환하여 액세스 토큰 및 새로고침 토큰 가져오기
- `fetchProjectID()`: Google Cloud 프로젝트 ID 자동 확인
- `encodeState()` / `decodeState()`: OAuth state 매개변수 인코딩/디코딩(PKCE verifier 포함)

</details>
