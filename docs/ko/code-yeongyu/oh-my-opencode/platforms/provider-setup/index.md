---
title: "Provider 설정: AI 다중 모델 전략 | oh-my-opencode"
sidebarTitle: "여러 AI 서비스 연결"
subtitle: "Provider 설정: AI 다중 모델 전략"
description: "oh-my-opencode의 다양한 AI Provider를 설정하는 방법을 배우세요. Anthropic, OpenAI, Google, GitHub Copilot을 포함하며, 다중 모델 자동 다운그레이드 메커니즘의 작동 원리도 설명합니다."
tags:
  - "configuration"
  - "providers"
  - "models"
prerequisite:
  - "start-installation"
order: 40
---

# Provider 설정: Claude, OpenAI, Gemini 및 다중 모델 전략

## 학습 완료 후 할 수 있는 것

- Anthropic Claude, OpenAI, Google Gemini, GitHub Copilot 등 다양한 AI Provider 설정
- 다중 모델 우선순위 다운그레이드 메커니즘 이해 및 시스템이 자동으로 최적의 사용 가능 모델을 선택하도록 설정
- 다양한 AI 에이전트와 작업 유형에 가장 적합한 모델 지정
- Z.ai Coding Plan 및 OpenCode Zen과 같은 타사 서비스 설정
- doctor 명령어를 사용하여 모델 해석 설정 진단

## 현재의 어려움

oh-my-opencode를 설치했지만 다음 사항이 명확하지 않습니다:
- 여러 AI Provider(Claude, OpenAI, Gemini 등)를 추가하는 방법
- 때때로 에이전트가 예상과 다른 모델을 사용하는 이유
- 다양한 작업(예: 연구 작업에는 저렴한 모델, 프로그래밍 작업에는 강력한 모델)에 다른 모델을 구성하는 방법
- 특정 Provider를 사용할 수 없을 때 시스템이 백업 모델로 자동 전환하는 방식
- `opencode.json`과 `oh-my-opencode.json`에서 모델 설정이 어떻게 협력하는지

## 이 기능을 사용하는 시점

- **최초 구성**: oh-my-opencode 설치 후 AI Provider를 추가하거나 조정해야 할 때
- **새 구독 추가**: 새 AI 서비스 구독(예: Gemini Pro)을 구매하여 통합하려 할 때
- **비용 최적화**: 특정 에이전트가 더 저렴하거나 빠른 모델을 사용하도록 하려 할 때
- **문제 해결**: 에이전트가 예상대로 모델을 사용하지 않는 문제를 진단해야 할 때
- **다중 모델 오케스트레이션**: 다양한 모델의 강점을 최대한 활용하여 지능형 개발 워크플로우를 구축하려 할 때

## 🎒 시작하기 전 준비사항

::: warning 사전 확인
이 튜토리얼은 다음을 완료했다고 가정합니다:
- ✅ [설치 및 초기 구성](../installation/) 완료
- ✅ OpenCode 설치(버전 >= 1.0.150)
- ✅ 기본적인 JSON/JSONC 구성 파일 형식 이해
:::

## 핵심 개념

oh-my-opencode는 **다중 모델 오케스트레이션 시스템**을 사용하여, 사용자의 구독 및 구성에 따라 다양한 AI 에이전트와 작업 유형에 가장 적합한 모델을 선택합니다.

**다중 모델이 필요한 이유**

다양한 모델에는 각각 다른 강점이 있습니다:
- **Claude Opus 4.5**: 복잡한 추론 및 아키텍처 설계에 탁월(비용이 높지만 품질이 우수)
- **GPT-5.2**: 코드 디버깅 및 전략 컨설팅에 탁월
- **Gemini 3 Pro**: 프론트엔드 및 UI/UX 작업에 탁월(시각적 능력이 뛰어남)
- **GPT-5 Nano**: 빠르고 무료이며, 코드 검색 및 간단한 탐색에 적합
- **GLM-4.7**: 가성비가 우수하여 연구 및 문서 검색에 적합

oh-my-opencode의 지능적인 점은 **모든 작업에 동일한 모델을 사용하는 대신, 각 작업에 가장 적합한 모델을 사용**하는 것입니다.

## 구성 파일 위치

oh-my-opencode 구성은 두 가지 레벨을 지원합니다:

| 위치 | 경로 | 우선순위 | 사용 사례 |
|--- | --- | --- | ---|
| **프로젝트 구성** | `.opencode/oh-my-opencode.json` | 낮음 | 프로젝트별 구성(코드베이스에 커밋) |
| **사용자 구성** | `~/.config/opencode/oh-my-opencode.json` | 높음 | 전역 구성(모든 프로젝트에서 공유) |

**구성 병합 규칙**: 사용자 구성이 프로젝트 구성을 덮어씁니다.

**권장 구성 파일 구조**:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  // JSON Schema 자동 완성 활성화

  "agents": {
    // 에이전트 모델 오버라이드
  },
  "categories": {
    // 카테고리 모델 오버라이드
  }
}
```

::: tip Schema 자동 완성
VS Code 등의 편집기에서 `$schema` 필드를 추가하면, 입력할 때 완전한 자동 완성 및 타입 검사를 받을 수 있습니다.
:::

## Provider 구성 방법

oh-my-opencode는 6가지 주요 Provider를 지원합니다. 구성 방법은 Provider마다 다릅니다.

### Anthropic Claude(권장)

**사용 사례**: 주 오케스트레이터 Sisyphus 및 대부분의 핵심 에이전트

**구성 단계**:

1. **OpenCode 인증 실행**:
   ```bash
   opencode auth login
   ```

2. **Provider 선택**:
   - `Provider`: `Anthropic` 선택
   - `Login method`: `Claude Pro/Max` 선택

3. **OAuth 프로세스 완료**:
   - 시스템이 자동으로 브라우저 열기
   - Claude 계정으로 로그인
   - 인증 완료 대기

4. **성공 확인**:
   ```bash
   opencode models | grep anthropic
   ```

   다음을 확인해야 합니다:
   - `anthropic/claude-opus-4-5`
   - `anthropic/claude-sonnet-4-5`
   - `anthropic/claude-haiku-4-5`

**모델 매핑**(Sisyphus 기본 구성):

| 에이전트 | 기본 모델 | 용도 |
|--- | --- | ---|
| Sisyphus | `anthropic/claude-opus-4-5` | 주 오케스트레이터, 복잡한 추론 |
| Prometheus | `anthropic/claude-opus-4-5` | 프로젝트 계획 |
| Metis | `anthropic/claude-sonnet-4-5` | 사전 계획 분석 |
| Momus | `anthropic/claude-opus-4-5` | 계획 검토 |

### OpenAI(ChatGPT Plus)

**사용 사례**: Oracle 에이전트(아키텍처 검토, 디버깅)

**구성 단계**:

1. **OpenCode 인증 실행**:
   ```bash
   opencode auth login
   ```

2. **Provider 선택**:
   - `Provider`: `OpenAI` 선택
   - `Login method`: OAuth 또는 API Key 선택

3. **인증 프로세스 완료**(선택한 방법에 따라)

4. **성공 확인**:
   ```bash
   opencode models | grep openai
   ```

**모델 매핑**(Oracle 기본 구성):

| 에이전트 | 기본 모델 | 용도 |
|--- | --- | ---|
| Oracle | `openai/gpt-5.2` | 아키텍처 검토, 디버깅 |

**수동 오버라이드 예시**:

```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2",  // 전략적 추론에 GPT 사용
      "temperature": 0.1
    }
  }
}
```

### Google Gemini(권장)

**사용 사례**: Multimodal Looker(미디어 분석), Frontend UI/UX 작업

::: tip 강력 추천
Gemini 인증을 위해 [`opencode-antigravity-auth`](https://github.com/NoeFabris/opencode-antigravity-auth) 플러그인을 강력히 추천합니다. 제공 기능:
- 최대 10개 계정의 다중 계정 로드 밸런싱
- Variant 시스템 지원(`low`/`high` 변형)
- 이중 할당량 시스템(Antigravity + Gemini CLI)
:::

**구성 단계**:

1. **Antigravity 인증 플러그인 추가**:
   
   `~/.config/opencode/opencode.json`을 편집합니다:
   ```json
   {
     "plugin": [
       "oh-my-opencode",
       "opencode-antigravity-auth@latest"
     ]
   }
   ```

2. **Gemini 모델 구성**(중요):
   
   Antigravity 플러그인은 다른 모델 이름을 사용합니다. `opencode.json`에 전체 모델 구성을 복사해야 하며, 기존 설정을 손상시키지 않도록 주의하여 병합하세요.

   사용 가능한 모델(Antigravity 할당량):
   - `google/antigravity-gemini-3-pro` — 변형: `low`, `high`
   - `google/antigravity-gemini-3-flash` — 변형: `minimal`, `low`, `medium`, `high`
   - `google/antigravity-claude-sonnet-4-5` — 변형 없음
   - `google/antigravity-claude-sonnet-4-5-thinking` — 변형: `low`, `max`
   - `google/antigravity-claude-opus-4-5-thinking` — 변형: `low`, `max`

   사용 가능한 모델(Gemini CLI 할당량):
   - `google/gemini-2.5-flash`, `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

3. **에이전트 모델 오버라이드**(`oh-my-opencode.json`에서):
   
   ```jsonc
   {
     "agents": {
       "multimodal-looker": {
         "model": "google/antigravity-gemini-3-flash"
       }
     }
   }
   ```

4. **인증 실행**:
   ```bash
   opencode auth login
   ```

5. **Provider 선택**:
   - `Provider`: `Google` 선택
   - `Login method`: `OAuth with Google (Antigravity)` 선택

6. **인증 프로세스 완료**:
   - 시스템이 자동으로 브라우저 열기
   - Google 로그인 완료
   - 선택사항: 로드 밸런싱을 위해 더 많은 Google 계정 추가

**모델 매핑**(기본 구성):

| 에이전트 | 기본 모델 | 용도 |
|--- | --- | ---|
| Multimodal Looker | `google/antigravity-gemini-3-flash` | PDF, 이미지 분석 |

### GitHub Copilot(백업 Provider)

**사용 사례**: 기본 Provider를 사용할 수 없을 때 백업 옵션

::: info 백업 Provider
GitHub Copilot은 프록시 Provider로, 요청을 구독한 기본 모델로 라우팅합니다.
:::

**구성 단계**:

1. **OpenCode 인증 실행**:
   ```bash
   opencode auth login
   ```

2. **Provider 선택**:
   - `Provider`: `GitHub` 선택
   - `Login method`: `Authenticate via OAuth` 선택

3. **GitHub OAuth 프로세스 완료**

4. **성공 확인**:
   ```bash
   opencode models | grep github-copilot
   ```

**모델 매핑**(GitHub Copilot이 최적의 사용 가능 Provider일 때):

| 에이전트 | 모델 | 용도 |
|--- | --- | ---|
| Sisyphus | `github-copilot/claude-opus-4.5` | 주 오케스트레이터 |
| Oracle | `github-copilot/gpt-5.2` | 아키텍처 검토 |
| Explore | `opencode/gpt-5-nano` | 빠른 탐색 |
| Librarian | `zai-coding-plan/glm-4.7` (Z.ai를 사용할 수 있을 경우) | 문서 검색 |

### Z.ai Coding Plan(선택사항)

**사용 사례**: Librarian 에이전트(다중 저장소 연구, 문서 검색)

**특징**:
- GLM-4.7 모델 제공
- 높은 가성비
- 활성화되면 **Librarian 에이전트는** 다른 사용 가능한 Provider에 관계없이 `zai-coding-plan/glm-4.7`을 사용함

**구성 단계**:

대화형 설치기 사용:

```bash
bunx oh-my-opencode install
# 프롬프트: "Do you have a Z.ai Coding Plan subscription?" → "Yes" 선택
```

**모델 매핑**(Z.ai가 유일한 사용 가능 Provider일 때):

| 에이전트 | 모델 | 용도 |
|--- | --- | ---|
| Sisyphus | `zai-coding-plan/glm-4.7` | 주 오케스트레이터 |
| Oracle | `zai-coding-plan/glm-4.7` | 아키텍처 검토 |
| Explore | `zai-coding-plan/glm-4.7-flash` | 빠른 탐색 |
| Librarian | `zai-coding-plan/glm-4.7` | 문서 검색 |

### OpenCode Zen(선택사항)

**사용 사례**: `opencode/` 접두사 모델 제공(Claude Opus 4.5, GPT-5.2, GPT-5 Nano, Big Pickle)

**구성 단계**:

```bash
bunx oh-my-opencode install
# 프롬프트: "Do you have access to OpenCode Zen (opencode/ models)?" → "Yes" 선택
```

**모델 매핑**(OpenCode Zen이 최적의 사용 가능 Provider일 때):

| 에이전트 | 모델 | 용도 |
|--- | --- | ---|
| Sisyphus | `opencode/claude-opus-4-5` | 주 오케스트레이터 |
| Oracle | `opencode/gpt-5.2` | 아키텍처 검토 |
| Explore | `opencode/gpt-5-nano` | 빠른 탐색 |
| Librarian | `opencode/big-pickle` | 문서 검색 |

## 모델 해석 시스템(3단계 우선순위)

oh-my-opencode는 **3단계 우선순위 메커니즘**을 사용하여 각 에이전트와 카테고리에 사용할 모델을 결정합니다. 이 메커니즘은 시스템이 항상 사용 가능한 모델을 찾을 수 있도록 보장합니다.

### 단계 1: 사용자 오버라이드

사용자가 `oh-my-opencode.json`에 모델을 명시적으로 지정하면 해당 모델을 사용합니다.

**예시**:
```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2"  // 사용자가 명시적으로 지정
    }
  }
}
```

이 경우:
- ✅ `openai/gpt-5.2`를 직접 사용
- ❌ Provider 다운그레이드 단계 건너뛰기

### 단계 2: Provider 다운그레이드

사용자가 모델을 명시적으로 지정하지 않으면, 시스템은 에이전트가 정의한 Provider 우선순위 체인을 따라 사용 가능한 모델을 찾을 때까지 순차적으로 시도합니다.

**Sisyphus의 Provider 우선순위 체인**:

```
anthropic → github-copilot → opencode → antigravity → google
```

**해석 프로세스**:
1. `anthropic/claude-opus-4-5` 시도
   - 사용 가능? → 해당 모델 반환
   - 사용 불가? → 다음 단계로
2. `github-copilot/claude-opus-4-5` 시도
   - 사용 가능? → 해당 모델 반환
   - 사용 불가? → 다음 단계로
3. `opencode/claude-opus-4-5` 시도
   - ...
4. `google/antigravity-claude-opus-4-5-thinking` 시도(구성된 경우)
   - ...
5. 시스템 기본 모델 반환

**모든 에이전트의 Provider 우선순위 체인**:

| 에이전트 | 모델(접두사 없음) | Provider 우선순위 체인 |
|--- | --- | ---|
| **Sisyphus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Oracle** | `gpt-5.2` | openai → anthropic → google → github-copilot → opencode |
| **Librarian** | `big-pickle` | opencode → github-copilot → anthropic |
| **Explore** | `gpt-5-nano` | anthropic → opencode |
| **Multimodal Looker** | `gemini-3-flash` | google → openai → zai-coding-plan → anthropic → opencode |
| **Prometheus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Metis** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Momus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Atlas** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |

**카테고리의 Provider 우선순위 체인**:

| 카테고리 | 모델(접두사 없음) | Provider 우선순위 체인 |
|--- | --- | ---|
| **ultrabrain** | `gpt-5.2-codex` | openai → anthropic → google → github-copilot → opencode |
| **artistry** | `gemini-3-pro` | google → openai → anthropic → github-copilot → opencode |
| **quick** | `claude-haiku-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **writing** | `gemini-3-flash` | google → openai → anthropic → github-copilot → opencode |

### 단계 3: 시스템 기본

모든 Provider를 사용할 수 없으면 OpenCode의 기본 모델(`opencode.json`에서 읽음)을 사용합니다.

**전역 우선순위 순서**:

```
사용자 오버라이드 > Provider 다운그레이드 > 시스템 기본
```

## 함께 해보기: 여러 Provider 구성

### 1단계: 구독 계획 수립

구성을 시작하기 전에 구독 상황을 정리하세요:

```markdown
- [ ] Anthropic Claude (Pro/Max)
- [ ] OpenAI ChatGPT Plus
- [ ] Google Gemini
- [ ] GitHub Copilot
- [ ] Z.ai Coding Plan
- [ ] OpenCode Zen
```

### 2단계: 대화형 설치기 사용(권장)

oh-my-opencode는 대부분의 구성을 자동으로 처리하는 대화형 설치기를 제공합니다:

```bash
bunx oh-my-opencode install
```

설치기가 다음을 묻습니다:
1. **Do you have a Claude Pro/Max Subscription?**
   - `yes, max20` → `--claude=max20`
   - `yes, regular` → `--claude=yes`
   - `no` → `--claude=no`

2. **Do you have an OpenAI/ChatGPT Plus Subscription?**
   - `yes` → `--openai=yes`
   - `no` → `--openai=no`

3. **Will you integrate Gemini models?**
   - `yes` → `--gemini=yes`
   - `no` → `--gemini=no`

4. **Do you have a GitHub Copilot Subscription?**
   - `yes` → `--copilot=yes`
   - `no` → `--copilot=no`

5. **Do you have access to OpenCode Zen (opencode/ models)?**
   - `yes` → `--opencode-zen=yes`
   - `no` → `--opencode-zen=no`

6. **Do you have a Z.ai Coding Plan subscription?**
   - `yes` → `--zai-coding-plan=yes`
   - `no` → `--zai-coding-plan=no`

**비대화형 모드**(스크립트화된 설치에 적합):

```bash
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no
```

### 3단계: 각 Provider 인증

설치기 구성을 완료한 후, 개별적으로 인증합니다:

```bash
# Anthropic 인증
opencode auth login
# Provider: Anthropic
# Login method: Claude Pro/Max
# OAuth 프로세스 완료

# OpenAI 인증
opencode auth login
# Provider: OpenAI
# OAuth 프로세스 완료

# Google Gemini 인증(antigravity 플러그인 필요)
opencode auth login
# Provider: Google
# Login method: OAuth with Google (Antigravity)
# OAuth 프로세스 완료

# GitHub Copilot 인증
opencode auth login
# Provider: GitHub
# Login method: Authenticate via OAuth
# GitHub OAuth 완료
```

### 4단계: 구성 확인

```bash
# OpenCode 버전 확인
opencode --version
# >= 1.0.150이어야 함

# 사용 가능한 모든 모델 보기
opencode models

# doctor 진단 실행
bunx oh-my-opencode doctor --verbose
```

**확인해야 할 사항**(doctor 출력 예시):

```
✅ OpenCode version: 1.0.150
✅ Plugin loaded: oh-my-opencode

📊 Model Resolution:
┌─────────────────────────────────────────────────────┐
│ Agent           │ Requirement            │ Resolved         │
├─────────────────────────────────────────────────────┤
│ Sisyphus        │ anthropic/claude-opus-4-5  │ anthropic/claude-opus-4-5 │
│ Oracle           │ openai/gpt-5.2              │ openai/gpt-5.2              │
│ Librarian        │ opencode/big-pickle           │ opencode/big-pickle           │
│ Explore          │ anthropic/gpt-5-nano          │ anthropic/gpt-5-nano          │
│ Multimodal Looker│ google/gemini-3-flash          │ google/gemini-3-flash          │
└─────────────────────────────────────────────────────┘

✅ All models resolved successfully
```

### 5단계: 에이전트 모델 사용자 정의(선택사항)

특정 에이전트에 다른 모델을 지정하려면:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle은 아키텍처 검토에 GPT 사용
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },

    // Librarian은 연구에 더 저렴한 모델 사용
    "librarian": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Multimodal Looker는 Antigravity Gemini 사용
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash",
      "variant": "high"
    }
  }
}
```

### 6단계: Category 모델 사용자 정의(선택사항)

다양한 유형의 작업에 모델 지정:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "categories": {
    // 빠른 작업에는 저렴한 모델 사용
    "quick": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // 프론트엔드 작업에는 Gemini 사용
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },

    // 고급 추론 작업에는 GPT Codex 사용
    "ultrabrain": {
      "model": "openai/gpt-5.2-codex",
      "temperature": 0.1
    }
  }
}
```

**Category 사용**:

```markdown
// 대화에서 delegate_task 사용
delegate_task(category="visual", prompt="Create a responsive dashboard component")
delegate_task(category="quick", skills=["git-master"], prompt="Commit these changes")
```

## 체크포인트 ✅

- [ ] `opencode --version`이 버전 >= 1.0.150을 표시함
- [ ] `opencode models`가 구성한 모든 Provider의 모델을 나열함
- [ ] `bunx oh-my-opencode doctor --verbose`가 모든 에이전트의 모델이 올바르게 해석되었음을 표시함
- [ ] `opencode.json`에서 `"oh-my-opencode"`가 `plugin` 배열에 있음을 확인할 수 있음
- [ ] 에이전트(예: Sisyphus) 사용을 시도하여 모델이 정상 작동하는지 확인함

## 주의사항

### ❌ 함정 1: Provider 인증을 잊음

**증상**: Provider를 구성했지만 모델 해석에 실패함.

**원인**: 설치기가 모델을 구성했지만 인증을 완료하지 않음.

**해결**:
```bash
opencode auth login
# 해당 Provider를 선택하고 인증 완료
```

### ❌ 함정 2: Antigravity 모델 이름 오류

**증상**: Gemini를 구성했지만 에이전트가 사용하지 않음.

**원인**: Antigravity 플러그인은 다른 모델 이름을 사용함(`google/gemini-3-pro`가 아닌 `google/antigravity-gemini-3-pro`).

**해결**:
```jsonc
{
  "agents": {
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash"  // 올바름
      // model: "google/gemini-3-flash"  // ❌ 잘못됨
    }
  }
}
```

### ❌ 함정 3: 구성 파일 위치 오류

**증상**: 구성을 수정했지만 시스템에 적용되지 않음.

**원인**: 잘못된 구성 파일을 수정함(사용자 구성 vs 프로젝트 구성).

**해결**:
```bash
# 사용자 구성(전역, 우선순위 높음)
~/.config/opencode/oh-my-opencode.json

# 프로젝트 구성(로컬, 우선순위 낮음)
.opencode/oh-my-opencode.json

# 어떤 파일이 사용되는지 확인
bunx oh-my-opencode doctor --verbose
```

### ❌ 함정 4: Provider 우선순위 체인이 중단됨

**증상**: 특정 에이전트가 항상 잘못된 모델을 사용함.

**원인**: 사용자 오버라이드(1단계)가 Provider 다운그레이드(2단계)를 완전히 건너뜀.

**해결**: 자동 다운그레이드를 활용하려면 `oh-my-opencode.json`에 모델을 하드코딩하지 말고, 시스템이 우선순위 체인에 따라 자동으로 선택하도록 하세요.

**예시**:
```jsonc
{
  "agents": {
    "oracle": {
      // ❌ 하드코딩: Anthropic을 사용할 수 있어도 항상 GPT 사용
      "model": "openai/gpt-5.2"
    }
  }
}
```

다운그레이드를 활용하려면 `model` 필드를 제거하고 시스템이 자동으로 선택하도록 하세요:
```jsonc
{
  "agents": {
    "oracle": {
      // ✅ 자동: anthropic → google → github-copilot → opencode
      "temperature": 0.1
    }
  }
}
```

### ❌ 함정 5: Z.ai가 Librarian을 항상 차지함

**증상**: 다른 Provider를 구성했어도 Librarian이 GLM-4.7을 사용함.

**원인**: Z.ai가 활성화되면 Librarian이 `zai-coding-plan/glm-4.7`을 사용하도록 하드코딩됨.

**해결**: 이 동작이 필요 없으면 Z.ai를 비활성화하세요:
```bash
bunx oh-my-opencode install --no-tui --zai-coding-plan=no
```

또는 수동으로 오버라이드:
```jsonc
{
  "agents": {
    "librarian": {
      "model": "opencode/big-pickle"  // Z.ai의 하드코딩을 오버라이드
    }
  }
}
```

## 본 강의 요약

- oh-my-opencode는 Anthropic, OpenAI, Google, GitHub Copilot, Z.ai, OpenCode Zen 등 6가지 주요 Provider를 지원함
- 대화형 설치기 `bunx oh-my-opencode install`를 사용하여 여러 Provider를 빠르게 구성할 수 있음
- 모델 해석 시스템은 3단계 우선순위(사용자 오버라이드 → Provider 다운그레이드 → 시스템 기본)를 통해 동적으로 모델을 선택함
- 각 에이전트와 카테고리는 항상 사용 가능한 모델을 찾을 수 있도록 자체 Provider 우선순위 체인을 가짐
- `doctor --verbose` 명령을 사용하여 모델 해석 구성을 진단할 수 있음
- 에이전트와 카테고리 모델을 사용자 정의할 때는 자동 다운그레이드 메커니즘을 깨뜨리지 않도록 주의해야 함

## 다음 강의 예고

> 다음 강의에서는 **[다중 모델 전략: 자동 다운그레이드와 우선순위](../model-resolution/)**를 학습합니다.
>
> 배울 내용:
> - 모델 해석 시스템의 완전한 워크플로우
> - 다양한 작업에 최적의 모델 조합을 설계하는 방법
> - 백그라운드 작업의 동시성 제어 전략
> - 모델 해석 문제를 진단하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능 | 파일 경로 | 라인 |
|--- | --- | ---|
| 구성 Schema 정의 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378 |
| 설치 가이드(Provider 구성) | [`docs/guide/installation.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/guide/installation.md) | 1-299 |
| 구성 참조(모델 해석) | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 391-512 |
| 에이전트 오버라이드 구성 Schema | [`src/config/schema.ts:AgentOverrideConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L98-L119) | 98-119 |
| 카테고리 구성 Schema | [`src/config/schema.ts:CategoryConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L154-L172) | 154-172 |
| Provider 우선순위 체인 문서 | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md#L445-L473) | 445-473 |

**주요 상수**:
- 없음: Provider 우선순위 체인은 구성 문서에 하드코딩되며, 코드 상수가 아님

**주요 함수**:
- 없음: 모델 해석 로직은 OpenCode 코어에서 처리하며, oh-my-opencode는 구성 및 우선순위 정의를 제공함

</details>
