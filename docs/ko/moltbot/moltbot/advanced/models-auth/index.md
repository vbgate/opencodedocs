---
title: "AI 모델 및 인증 설정 완전 가이드: 다중 제공업체, 인증 방식 및 문제 해결 | Clawdbot 튜토리얼"
sidebarTitle: "AI 계정 설정"
subtitle: "AI 모델 및 인증 설정"
description: "Clawdbot에서 AI 모델 제공업체(Anthropic, OpenAI, OpenRouter, Ollama 등)와 세 가지 인증 방식(API Key, OAuth, Token)을 구성하는 방법을 배우세요. 이 튜토리얼은 인증 파일 관리, 다중 계정 순환, OAuth Token 자동 갱신, 모델 별칭 설정, 장애 조치 및 일반적인 오류 해결을 다루며, 실제 구성 예제와 CLI 명령을 포함하여 빠르게 시작할 수 있도록 도와줍니다."
tags:
  - "advanced"
  - "configuration"
  - "authentication"
  - "models"
prerequisite:
  - "start-getting-started"
order: 190
---

# AI 모델 및 인증 설정

## 학습 후 할 수 있는 것

- 여러 AI 모델 제공업체 구성(Anthropic, OpenAI, OpenRouter 등)
- 세 가지 인증 방식 사용(API Key, OAuth, Token)
- 다중 계정 인증 및 인증 순환 관리
- 모델 선택 및 대체 모델 구성
- 일반적인 인증 문제 해결

## 현재 문제점

Clawdbot은 수십 가지 모델 제공업체를 지원하지만 구성이 혼란스러울 수 있습니다:

- API Key 또는 OAuth 중 어떤 것을 사용해야 할까요?
- 다른 제공업체의 인증 방식은 무엇이 다른가요?
- 여러 계정을 구성하는 방법은 무엇인가요?
- OAuth token을 어떻게 자동으로 갱신하나요?

## 언제 이 방법을 사용하나요?

- 처음 설치 후 AI 모델 구성이 필요할 때
- 새로운 모델 제공업체 또는 대체 계정 추가 시
- 인증 오류 또는 할당량 제한 발생 시
- 모델 전환 및 대체 메커니즘 구성이 필요할 때

## 🎒 시작 전 준비

::: warning 사전 요구사항
이 튜토리얼은 [빠른 시작](../../start/getting-started/)을 완료하고 Gateway를 설치하고 시작했다고 가정합니다.
:::

- Node ≥22가 설치되어 있는지 확인하세요
- Gateway 데몬이 실행 중인지 확인하세요
- 최소 하나의 AI 모델 제공업체 자격 증명(API Key 또는 구독 계정)을 준비하세요

## 핵심 개념

### 모델 구성과 인증은 분리되어 있습니다

Clawdbot에서 **모델 선택**과 **인증 자격 증명**은 두 가지 독립적인 개념입니다:

- **모델 구성**: Clawdbot에 사용할 모델(예: `anthropic/claude-opus-4-5`)을 지정하며, `~/.clawdbot/models.json`에 저장됩니다
- **인증 구성**: 모델에 액세스하기 위한 자격 증명(API Key 또는 OAuth token)을 제공하며, `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`에 저장됩니다

::: info 왜 분리되나요?
이 설계는 모델 매개변수를 반복해서 구성하지 않고도 여러 제공업체와 계정 간에 유연하게 전환할 수 있게 해줍니다.
:::

### 세 가지 인증 방식

Clawdbot은 다양한 시나리오에 맞는 세 가지 인증 방식을 지원합니다:

| 인증 방식 | 저장 형식 | 일반적인 시나리오 | 지원하는 제공업체 |
|--- | --- | --- | ---|
| **API Key** | `{ type: "api_key", key: "sk-..." }` | 빠른 시작, 테스트 | Anthropic, OpenAI, OpenRouter, DeepSeek 등 |
| **OAuth** | `{ type: "oauth", access: "...", refresh: "..." }` | 장기 실행, 자동 갱신 | Anthropic (Claude Code CLI), OpenAI (Codex), Qwen Portal |
| **Token** | `{ type: "token", token: "..." }` | 정적 Bearer token | GitHub Copilot, 일부 사용자 지정 프록시 |

### 지원하는 모델 제공업체

Clawdbot은 기본적으로 다음 모델 제공업체를 지원합니다:

::: details 기본 제공업체 목록
| 제공업체 | 인증 방식 | 권장 모델 | 비고 |
|--- | --- | --- | ---|
| **Anthropic** | API Key / OAuth (Claude Code CLI) | `anthropic/claude-opus-4-5` | Claude Pro/Max + Opus 4.5 권장 |
| **OpenAI** | API Key / OAuth (Codex) | `openai/gpt-5.2` | 표준 OpenAI 및 Codex 버전 지원 |
| **OpenRouter** | API Key | `openrouter/anthropic/claude-sonnet-4-5` | 수백 개의 모델 집계 |
| **Ollama** | HTTP Endpoint | `ollama/<model>` | 로컬 모델, API Key 불필요 |
| **DeepSeek** | API Key | `deepseek/deepseek-r1` | 중국 친화적 |
| **Qwen Portal** | OAuth | `qwen-portal/<model>` | Qwen OAuth |
| **Venice** | API Key | `venice/<model>` | 프라이버시 우선 |
| **Bedrock** | AWS SDK | `amazon-bedrock/<model>` | AWS 호스팅 모델 |
| **Antigravity** | API Key | `google-antigravity/<model>` | 모델 프록시 서비스 |
:::

::: tip 권장 조합
대부분의 사용자에게 **Anthropic Opus 4.5**를 주 모델로, **OpenAI GPT-5.2**를 대체 모델로 구성하는 것이 좋습니다. Opus는 긴 컨텍스트와 보안 측면에서 더 나은 성능을 보입니다.
:::

## 따라해보기

### 1단계: Anthropic 구성(권장)

**이유**
Anthropic Claude는 Clawdbot의 권장 모델이며, 특히 Opus 4.5는 긴 컨텍스트 처리와 보안 측면에서 우수한 성능을 발휘합니다.

**옵션 A: Anthropic API Key 사용(가장 빠름)**

```bash
clawdbot onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

**다음을 볼 수 있습니다**:
- Gateway 구성 다시 로드
- 기본 모델이 `anthropic/claude-opus-4-5`로 설정됨
- 인증 파일 `~/.clawdbot/agents/default/agent/auth-profiles.json` 생성됨

**옵션 B: OAuth 사용(장기 실행 권장)**

OAuth는 장기 실행되는 Gateway에 적합하며, token이 자동으로 갱신됩니다.

1. setup-token 생성(모든 머신에서 Claude Code CLI 실행 필요):
```bash
claude setup-token
```

2. 출력된 token 복사

3. Gateway 호스트에서 실행:
```bash
clawdbot models auth paste-token --provider anthropic
# token 붙여넣기
```

**다음을 볼 수 있습니다**:
- "Auth profile added: anthropic:claude-cli" 메시지
- 인증 유형이 `oauth`로 표시됨(`api_key` 아님)

::: tip OAuth 장점
OAuth token은 자동으로 갱신되므로 수동으로 업데이트할 필요가 없습니다. 지속적으로 실행되는 Gateway 데몬에 적합합니다.
:::

### 2단계: OpenAI를 대체 모델로 구성

**이유**
대체 모델을 구성하면 주 모델(예: Anthropic)이 할당량 제한 또는 오류를 겪을 때 자동으로 전환됩니다.

```bash
clawdbot onboard --openai-api-key "$OPENAI_API_KEY"
```

또는 OpenAI Codex OAuth 사용:

```bash
clawdbot onboard --openai-codex
```

**다음을 볼 수 있습니다**:
- `~/.clawdbot/clawdbot.json`에 OpenAI 제공업체 구성 추가됨
- 인증 파일에 `openai:default` 또는 `openai-codex:codex-cli` 구성 추가됨

### 3단계: 모델 선택 및 대체 구성

**이유**
모델 선택 전략을 구성하여 주 모델, 대체 모델 및 별칭을 정의합니다.

`~/.clawdbot/clawdbot.json` 편집:

```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-5"
      fallbacks:
        - "openai/gpt-5.2"
        - "openai/gpt-5-mini"
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**필드 설명**:
- `primary`: 기본적으로 사용할 모델
- `fallbacks`: 순서대로 시도할 대체 모델(실패 시 자동 전환)
- `alias`: 모델 별칭(예: `/model opus`는 `/model anthropic/claude-opus-4-5`와 동일)

**다음을 볼 수 있습니다**:
- Gateway 재시작 후 주 모델이 Opus 4.5로 변경됨
- 대체 모델 구성이 적용됨

### 4단계: OpenRouter 추가(선택 사항)

**이유**
OpenRouter는 수백 개의 모델을 집계하여 특수 모델 또는 무료 모델에 액세스하는 데 적합합니다.

```bash
clawdbot onboard --auth-choice openrouter-api-key --token "$OPENROUTER_API_KEY"
```

그런 다음 모델 구성:

```yaml
agents:
  defaults:
    model:
      primary: "openrouter/anthropic/claude-sonnet-4-5"
```

**다음을 볼 수 있습니다**:
- 모델 참조 형식이 `openrouter/<provider>/<model>`입니다
- `clawdbot models scan`을 사용하여 사용 가능한 모델을 볼 수 있습니다

### 5단계: Ollama 구성(로컬 모델)

**이유**
Ollama를 사용하면 API Key 없이 로컬에서 모델을 실행할 수 있으며, 프라이버시에 민감한 시나리오에 적합합니다.

`~/.clawdbot/clawdbot.json` 편집:

```yaml
models:
  providers:
    ollama:
      baseUrl: "http://localhost:11434"
      api: "openai-completions"
      models:
        - id: "ollama/llama3.2"
          name: "Llama 3.2"
          api: "openai-completions"
          reasoning: false
          input: ["text"]
          cost:
            input: 0
            output: 0
            cacheRead: 0
            cacheWrite: 0
          contextWindow: 128000
          maxTokens: 4096

agents:
  defaults:
    model:
      primary: "ollama/llama3.2"
```

**다음을 볼 수 있습니다**:
- Ollama 모델은 API Key가 필요하지 않습니다
- Ollama 서비스가 `http://localhost:11434`에서 실행 중인지 확인해야 합니다

### 6단계: 구성 확인

**이유**
인증과 모델 구성이 올바르고 Gateway가 정상적으로 AI를 호출할 수 있는지 확인합니다.

```bash
clawdbot doctor
```

**다음을 볼 수 있습니다**:
- 인증 오류 없음
- 모델 목록에 구성한 제공업체가 포함됨
- 상태가 "OK"로 표시됨

또는 테스트 메시지 전송:

```bash
clawdbot message send --to +1234567890 --message "Hello from Clawdbot"
```

**다음을 볼 수 있습니다**:
- AI 응답 정상
- "No credentials found" 오류 없음

## 체크포인트 ✅

- [ ] 최소 하나의 모델 제공업체(Anthropic 또는 OpenAI) 구성 완료
- [ ] 인증 파일 `auth-profiles.json` 생성됨
- [ ] 모델 구성 파일 `models.json` 생성됨
- [ ] `/model <alias>`로 모델 전환 가능
- [ ] Gateway 로그에 인증 오류 없음
- [ ] 테스트 메시지에서 AI 응답 수신 성공

## 주의사항

### 인증 모드 불일치

**문제**: OAuth 구성이 인증 모드와 일치하지 않음

```yaml
# ❌ 오류: OAuth credentials이지만 모드가 token임
anthropic:claude-cli:
  provider: "anthropic"
  mode: "token"  # "oauth"여야 함
```

**수정**:

```yaml
# ✅ 올바름
anthropic:claude-cli:
  provider: "anthropic"
  mode: "oauth"
```

::: tip
Clawdbot은 Claude Code CLI에서 가져온 구성을 자동으로 `mode: "oauth"`로 설정하므로 수동으로 수정할 필요가 없습니다.
:::

### OAuth Token 갱신 실패

**문제**: "OAuth token refresh failed for anthropic" 오류 발생

**원인**:
- 다른 머신에서 Claude Code CLI 자격 증명이 만료됨
- OAuth token이 만료됨

**수정**:
```bash
# setup-token 다시 생성
claude setup-token

# 다시 붙여넣기
clawdbot models auth paste-token --provider anthropic
```

::: warning token vs oauth
`type: "token"`은 정적 Bearer token으로 자동으로 갱신되지 않습니다. `type: "oauth"`는 자동 갱신을 지원합니다.
:::

### 할당량 제한 및 장애 조치

**문제**: 주 모델이 할당량 제한(429 오류)을 겪음

**증상**:
```
HTTP 429: rate_limit_error
```

**자동 처리**:
- Clawdbot은 `fallbacks`의 다음 모델을 자동으로 시도합니다
- 모든 모델이 실패하면 오류를 반환합니다

**쿨다운 기간 구성**(선택 사항):

```yaml
auth:
  cooldowns:
    billingBackoffHours: 24  # 할당량 오류 후 24시간 동안 해당 제공업체 비활성화
    failureWindowHours: 1      # 1시간 내의 실패가 쿨다운에 포함됨
```

### 환경 변수 재정의

**문제**: 구성 파일에서 환경 변수를 사용했지만 설정되지 않음

```yaml
models:
  providers:
    openai:
      apiKey: "${OPENAI_KEY}"  # 설정되지 않으면 오류 발생
```

**수정**:
```bash
# 환경 변수 설정
export OPENAI_KEY="sk-..."

# 또는 .zshrc/.bashrc에 추가
echo 'export OPENAI_KEY="sk-..."' >> ~/.zshrc
```

## 고급 구성

### 다중 계정 및 인증 순환

**이유**
동일한 제공업체에 대해 여러 계정을 구성하여 로드 밸런싱 및 할당량 관리를 구현합니다.

**인증 파일 구성**(`~/.clawdbot/agents/default/agent/auth-profiles.json`):

```json
{
  "version": 1,
  "profiles": {
    "anthropic:me@example.com": {
      "type": "oauth",
      "provider": "anthropic",
      "email": "me@example.com"
    },
    "anthropic:work": {
      "type": "api_key",
      "provider": "anthropic",
      "key": "sk-ant-work..."
    },
    "openai:personal": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-1..."
    },
    "openai:work": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-2..."
    }
  },
  "order": {
    "anthropic": ["anthropic:me@example.com", "anthropic:work"],
    "openai": ["openai:personal", "openai:work"]
  }
}
```

**`order` 필드**:
- 인증 순환 순서를 정의합니다
- Clawdbot은 순서대로 각 계정을 시도합니다
- 실패한 계정은 자동으로 건너뜁니다

**CLI 명령으로 순서 관리**:

```bash
# 현재 순서 보기
clawdbot models auth order get --provider anthropic

# 순서 설정
clawdbot models auth order set --provider anthropic anthropic:me@example.com anthropic:work

# 순서 지우기(기본 순환 사용)
clawdbot models auth order clear --provider anthropic
```

### 특정 세션의 인증 지정

**이유**
특정 세션 또는 하위 Agent에 대해 인증 구성을 고정합니다.

**`/model <alias>@<profileId>` 구문 사용**:

```bash
# 현재 세션에 대해 특정 계정 사용 고정
/model opus@anthropic:work

# 하위 Agent 생성 시 인증 지정
clawdbot sessions spawn --model "opus@anthropic:work" --workspace "~/clawd-work"
```

**구성 파일에서 고정**(`~/.clawdbot/clawdbot.json`):

```yaml
auth:
  order:
    # main Agent에 대해 anthropic 순서 고정
    main: ["anthropic:me@example.com", "anthropic:work"]
```

### OAuth Token 자동 갱신

Clawdbot은 다음 OAuth 제공업체의 자동 갱신을 지원합니다:

| 제공업체 | OAuth 흐름 | 갱신 메커니즘 |
|--- | --- | ---|
| **Anthropic** (Claude Code CLI) | 표준 권한 부여 코드 | pi-mono RPC 갱신 |
| **OpenAI** (Codex) | 표준 권한 부여 코드 | pi-mono RPC 갱신 |
| **Qwen Portal** | 사용자 지정 OAuth | `refreshQwenPortalCredentials` |
| **Chutes** | 사용자 지정 OAuth | `refreshChutesTokens` |

**자동 갱신 로직**:

1. token 만료 시간 확인(`expires` 필드)
2. 만료되지 않았으면 바로 사용
3. 만료되었으면 `refresh` token을 사용하여 새로운 `access` token 요청
4. 저장된 자격 증명 업데이트

::: tip Claude Code CLI 동기화
Anthropic OAuth(`anthropic:claude-cli`)를 사용하는 경우 Clawdbot은 token을 갱신할 때 Claude Code CLI 저장소와 동기화하여 양쪽이 일치하도록 합니다.
:::

### 모델 별칭 및 바로가기

**이유**
모델 별칭을 사용하면 전체 ID를 기억할 필요 없이 빠르게 모델을 전환할 수 있습니다.

**미리 정의된 별칭**(권장 구성):

```yaml
agents:
  defaults:
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "anthropic/claude-haiku-4-5":
        alias: "haiku"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**사용 방법**:

```bash
# Opus로 빠르게 전환
/model opus

# 다음과 동일
/model anthropic/claude-opus-4-5

# 특정 인증 사용
/model opus@anthropic:work
```

::: tip 별칭과 인증 분리
별칭은 모델 ID의 바로가기일 뿐이며 인증 선택에 영향을 미치지 않습니다. 인증을 지정하려면 `@<profileId>` 구문을 사용하세요.
:::

### 암시적 제공업체 구성

일부 제공업체는 명시적으로 구성할 필요가 없으며 Clawdbot이 자동으로 감지합니다:

| 제공업체 | 감지 방식 | 구성 파일 |
|--- | --- | ---|
| **GitHub Copilot** | `~/.copilot/credentials.json` | 구성 불필요 |
| **AWS Bedrock** | 환경 변수 또는 AWS SDK 자격 증명 | `~/.aws/credentials` |
| **Codex CLI** | `~/.codex/auth.json` | 구성 불필요 |

::: tip 암시적 구성 우선순위
암시적 구성은 `models.json`에 자동으로 병합되지만 명시적 구성으로 재정의할 수 있습니다.
:::

## 자주 묻는 질문

### OAuth vs API Key: 차이점은 무엇인가요?

**OAuth**:
- 장기 실행되는 Gateway에 적합
- Token이 자동으로 갱신됨
- 구독 계정 필요(Claude Pro/Max, OpenAI Codex)

**API Key**:
- 빠른 시작 및 테스트에 적합
- 자동으로 갱신되지 않음
- 무료 계정에서 사용 가능

::: info 권장 선택
- 장기 실행 → OAuth 사용(Anthropic, OpenAI)
- 빠른 테스트 → API Key 사용
- 프라이버시 민감 → 로컬 모델 사용(Ollama)
:::

### 현재 인증 구성을 어떻게 확인하나요?

```bash
# 인증 파일 보기
cat ~/.clawdbot/agents/default/agent/auth-profiles.json

# 모델 구성 보기
cat ~/.clawdbot/models.json

# 기본 구성 파일 보기
cat ~/.clawdbot/clawdbot.json
```

또는 CLI 사용:

```bash
# 모델 나열
clawdbot models list

# 인증 순서 보기
clawdbot models auth order get --provider anthropic
```

### 특정 인증을 제거하려면 어떻게 하나요?

```bash
# 인증 파일 편집, 해당 profile 삭제
nano ~/.clawdbot/agents/default/agent/auth-profiles.json

# 또는 CLI 사용(수동 작업)
clawdbot doctor  # 문제 구성 확인
```

::: warning 삭제 전 확인
인증 구성을 삭제하면 해당 제공업체를 사용하는 모델이 작동하지 않습니다. 대체 구성이 있는지 확인하세요.
:::

### 할당량 제한 후 어떻게 복구하나요?

**자동 복구**:
- Clawdbot은 쿨다운 기간 후 자동으로 재시도합니다
- 로그를 확인하여 재시도 시간을 알아보세요

**수동 복구**:
```bash
# 쿨다운 상태 지우기
clawdbot models auth clear-cooldown --provider anthropic --profile-id anthropic:me@example.com

# 또는 Gateway 재시작
clawdbot gateway restart
```

## 이 과정 요약

- Clawdbot은 세 가지 인증 방식을 지원합니다: API Key, OAuth, Token
- 모델 구성과 인증은 분리되어 있으며 별도의 파일에 저장됩니다
- Anthropic Opus 4.5를 주 모델로, OpenAI GPT-5.2를 대체 모델로 구성하는 것이 권장됩니다
- OAuth는 자동 갱신을 지원하므로 장기 실행에 적합합니다
- 다중 계정 및 인증 순환을 구성하여 로드 밸런싱을 구현할 수 있습니다
- 모델 별칭을 사용하여 빠르게 모델을 전환할 수 있습니다

## 다음 과정 예고

> 다음 과정에서는 **[세션 관리 및 다중 Agent](../session-management/)**를 학습합니다.
>
> 학습할 내용:
> - 세션 모델 및 세션 격리
> - 하위 Agent 협업
> - 컨텍스트 압축
> - 다중 Agent 라우팅 구성

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 인증 자격 증명 유형 정의 | [`src/agents/auth-profiles/types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/types.ts) | 1-74 |
| OAuth Token 구문 분석 및 갱신 | [`src/agents/auth-profiles/oauth.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/oauth.ts) | 1-220 |
| 인증 구성 파일 관리 | [`src/agents/auth-profiles/profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/profiles.ts) | 1-85 |
| 모델 구성 유형 | [`src/config/types.models.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.models.ts) | 1-60 |
| 모델 구성 생성 | [`src/agents/models-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/models-config.ts) | 1-139 |
| Zod Schema 구성 | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300+ |

**핵심 유형**:
- `AuthProfileCredential`: 인증 자격 증명 유니온 유형(`ApiKeyCredential | TokenCredential | OAuthCredential`)
- `ModelProviderConfig`: 모델 제공업체 구성 구조
- `ModelDefinitionConfig`: 모델 정의 구조

**핵심 함수**:
- `resolveApiKeyForProfile()`: 인증 자격 증명을 구문 분석하여 API Key 반환
- `refreshOAuthTokenWithLock()`: 잠금이 있는 OAuth Token 갱신
- `ensureClawdbotModelsJson()`: 모델 구성 생성 및 병합

**구성 파일 위치**:
- `~/.clawdbot/clawdbot.json`: 기본 구성 파일
- `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`: 인증 자격 증명
- `~/.clawdbot/models.json`: 생성된 모델 구성

</details>
