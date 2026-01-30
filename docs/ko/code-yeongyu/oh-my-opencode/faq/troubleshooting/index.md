---
title: "문제 해결: Doctor 진단 구성 | oh-my-opencode"
sidebarTitle: "5분 안에 문제 찾기"
subtitle: "문제 해결: Doctor 진단 구성"
description: "Doctor 명령어 진단 방법을 학습합니다. 버전, 플러그인, 인증, 종속성 등 17개 이상의 항목을 검사하며, --verbose, --json, --category 옵션을 사용하여 구성 문제를 빠르게 파악합니다."
tags:
  - "troubleshooting"
  - "diagnostics"
  - "configuration"
prerequisite:
  - "start-installation"
order: 150
---

# 구성 진단 및 문제 해결: Doctor 명령어로 문제 신속 해결

## 학습 완료 후 할 수 있는 것

- `oh-my-opencode doctor` 명령어를 실행하여 17개 이상의 건강 검사 수행
- OpenCode 버전이 낮거나 플러그인이 등록되지 않은 문제, Provider 구성 등의 문제 파악 및 수정
- 모델 해석 메커니즘 이해, 에이전트 및 Categories의 모델 할당 확인
- 상세 모드를 사용하여 문제 진단을 위한 완전한 정보 얻기

## 지금 당신이 처한 어려움

oh-my-opencode 설치 후 다음과 같은 상황에 어떻게 대응해야 할까요?

- OpenCode에서 플러그인이 로드되지 않는다는 메시지가 표시되지만, 구성 파일은 문제가 없어 보입니다
- 일부 AI 에이전트가 항상 "Model not found" 오류를 반환합니다
- 모든 Provider(Claude, OpenAI, Gemini)가 올바르게 구성되었는지 확인하고 싶습니다
- 문제가 설치, 구성, 인증 중 어디에 있는지 확실하지 않습니다

개별적으로 하나씩 확인하는 것은 시간이 너무 오래 걸립니다. **원클릭 진단 도구**가 필요합니다.

## 핵심 아이디어

**Doctor 명령어는 oh-my-opencode의 건강 검사 시스템**입니다. Mac의 Disk Utility나 자동차의 고장 진단기와 유사하게, 환경을 항목별로 점검하여 정상 여부와 문제 여부를 알려줍니다.

Doctor의 검사 로직은 전체 소스코드 구현(`src/cli/doctor/checks/`)에서 가져옵니다:

- ✅ **installation**: OpenCode 버전, 플러그인 등록
- ✅ **configuration**: 구성 파일 형식, Schema 검증
- ✅ **authentication**: Anthropic, OpenAI, Google 인증 플러그인
- ✅ **dependencies**: Bun, Node.js, Git 종속성
- ✅ **tools**: LSP 및 MCP 서버 상태
- ✅ **updates**: 버전 업데이트 검사

## 따라 해보기

### 1단계: 기본 진단 실행하기

**왜 필요한가**
전체 검사를 실행하여 전반적인 건강 상태를 파악합니다.

```bash
bunx oh-my-opencode doctor
```

**보여야 하는 결과**:

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**확인 포인트 ✅**:
- [ ] 6개 카테고리의 검사 결과 보기
- [ ] 각 항목 앞에 ✓(통과), ⚠(경고), ✗(실패) 표시 확인
- [ ] 하단에 요약 통계 확인

### 2단계: 일반적인 문제 해석하기

진단 결과를 바탕으로 문제를 빠르게 파악할 수 있습니다. 다음은 일반적인 오류와 해결책입니다:

#### ✗ "OpenCode version too old"

**문제**: OpenCode 버전이 1.0.150(최소 요구사항)보다 낮습니다

**원인**: oh-my-opencode는 OpenCode의 새로운 기능에 의존하며, 이전 버전에서는 지원되지 않습니다

**해결책**:

```bash
# OpenCode 업데이트
npm install -g opencode@latest
# 또는 Bun 사용
bun install -g opencode@latest
```

**검증**: `bunx oh-my-opencode doctor`를 다시 실행

#### ✗ "Plugin not registered"

**문제**: 플러그인이 `opencode.json`의 `plugin` 배열에 등록되지 않았습니다

**원인**: 설치 과정이 중단되었거나 구성 파일을 수동으로 편집했습니다

**해결책**:

```bash
# 설치 프로그램 다시 실행
bunx oh-my-opencode install
```

**소스코드 참고**(`src/cli/doctor/checks/plugin.ts:79-117`):
- `opencode.json`의 `plugin` 배열에서 플러그인 등록 여부 확인
- 지원 형식: `oh-my-opencode` 또는 `oh-my-opencode@version` 또는 `file://` 경로

#### ✗ "Configuration has validation errors"

**문제**: 구성 파일이 Schema 정의에 부합하지 않습니다

**원인**: 수동 편집 시 오류 발생(예: 철자 오류, 유형 불일치)

**해결책**:

1. 자세한 오류 메시지를 보려면 `--verbose` 사용:

```bash
bunx oh-my-opencode doctor --verbose
```

2. 일반적인 오류 유형(`src/config/schema.ts`에서 제공):

| 오류 메시지 | 원인 | 수정 방법 |
|---|---|---|
| `agents.sisyphus.mode: Invalid enum value` | `mode`는 `subagent`/`primary`/`all`만 가능 | `primary`로 변경 |
| `categories.quick.model: Expected string` | `model`은 문자열이어야 함 | 따옴표 추가: `"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | 동시 실행 수는 숫자여야 함 | 숫자로 변경: `3` |

3. 필드 정의 검증은 [구성 참고](../../appendix/configuration-reference/)를 참조

#### ⚠ "Auth plugin not installed"

**문제**: Provider에 해당하는 인증 플러그인이 설치되지 않았습니다

**원인**: 설치 시 해당 Provider를 건너뛰었거나 플러그인을 수동으로 제거했습니다

**해결책**:

```bash
# 누락된 Provider 선택하여 다시 설치
bunx oh-my-opencode install
```

**소스코드 참고**(`src/cli/doctor/checks/auth.ts:11-15`):

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### 3단계: 모델 해석 검사하기

모델 해석은 oh-my-opencode의 핵심 메커니즘입니다. 에이전트와 Categories의 모델 할당이 올바른지 확인합니다.

```bash
bunx oh-my-opencode doctor --category configuration
```

**보여야 하는 결과**:

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══
  
    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15
    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh
  
  ═══ Configured Models ═══
  
  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...
  
  Categories:
    ○ visual-engineering: google/gemini-3-pro
    ○ ultrabrain: openai/gpt-5.2-codex
    ...
  
  ○ = provider fallback
```

**확인 포인트 ✅**:
- [ ] 에이전트와 Categories의 모델 할당 보기
- [ ] `○`는 Provider 폴백 메커니즘 사용(수동 재정의 없음)을 표시
- [ ] `●`는 사용자가 구성에서 기본 모델을 재정의했음을 표시

**일반적인 문제**:

| 문제 | 원인 | 해결책 |
|---|---|---|
| `unknown` 모델 | Provider 폴백 체인이 비어 있음 | 하나 이상의 Provider가 사용 가능한지 확인 |
| 모델이 사용되지 않음 | Provider가 연결되지 않음 | Provider 연결을 위해 `opencode` 실행 |
| 모델 재정의를 원함 | 기본 모델 사용 | `oh-my-opencode.json`에서 `agents.<name>.model` 설정 |

**소스코드 참고**(`src/cli/doctor/checks/model-resolution.ts:129-148`):
- `~/.cache/opencode/models.json`에서 사용 가능한 모델 읽기
- 에이전트 모델 요구사항: `AGENT_MODEL_REQUIREMENTS` (`src/shared/model-requirements.ts`)
- Category 모델 요구사항: `CATEGORY_MODEL_REQUIREMENTS`

### 4단계: JSON 출력 사용하기(스크립트화)

CI/CD에서 진단을 자동화하려면 JSON 형식을 사용합니다:

```bash
bunx oh-my-opencode doctor --json
```

**보여야 하는 결과**:

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**사용 시나리오**:

```bash
# 진단 보고서를 파일에 저장
bunx oh-my-opencode doctor --json > doctor-report.json

# CI/CD에서 건강 상태 확인
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "All checks passed"
else
  echo "Some checks failed"
  exit 1
fi
```

## 함정 피하기

### ❌ 실수 1: 경고 메시지 무시하기

**문제**: `⚠` 표시를 "옵션"으로 생각하지만, 실제로는 중요한 힌트일 수 있음

**수정 방법**:
- 예: "using default model" 경고는 Category 모델을 구성하지 않았음을 나타내며, 최적의 선택이 아닐 수 있음
- `--verbose`를 사용하여 자세한 정보를 확인하고 처리가 필요한지 판단

### ❌ 실수 2: opencode.json 수동 편집

**문제**: OpenCode의 `opencode.json`을 직접 수정하여 플러그인 등록이 손상됨

**수정 방법**:
- `bunx oh-my-opencode install`을 사용하여 다시 등록
- 또는 OpenCode의 구성 파일을 건드리지 않고 `oh-my-opencode.json`만 수정

### ❌ 실수 3: 캐시가 새로고침되지 않음

**문제**: 모델 해석이 "cache not found"를 표시하지만 Provider는 구성되어 있음

**수정 방법**:

```bash
# 모델 캐시를 새로고침하기 위해 OpenCode 시작
opencode

# 또는 수동으로 새로고침(opencode models 명령어가 있는 경우)
opencode models --refresh
```

## 이번 수업 요약

Doctor 명령어는 oh-my-opencode의 스위스 군용 칼입니다. 문제를 빠르게 파악하는 데 도움을 줍니다:

| 명령어 | 용도 | 사용 시기 |
|---|---|---|
| `bunx oh-my-opencode doctor` | 전체 진단 | 처음 설치 후, 문제가 발생했을 때 |
| `--verbose` | 자세한 정보 | 오류 세부 정보를 봐야 할 때 |
| `--json` | JSON 출력 | CI/CD, 스크립트 자동화 |
| `--category <name>` | 단일 카테고리 검사 | 특정 부분만 확인하고 싶을 때 |

**기억하세요**: 문제가 발생할 때마다 먼저 `doctor`를 실행하고, 오류를 명확히 파악한 후에 조치를 취하세요.

## 다음 수업 예고

> 다음 수업에서는 **[자주 묻는 질문](../faq/)**을 배웁니다.
>
> 배울 내용:
> - oh-my-opencode와 다른 AI 도구의 차이점
> - 모델 사용 비용을 최적화하는 방법
> - 백그라운드 작업 동시 실행 제어의 모범 사례

---

## 부록: 소스코드 참고

<details>
<summary><strong>클릭하여 소스코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능 | 파일 경로 | 줄 번호 |
|---|---|---|
| Doctor 명령어 진입점 | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| 모든 검사 항목 등록 | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| 플러그인 등록 검사 | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| 구성 검증 검사 | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| 인증 검사 | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| 모델 해석 검사 | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| 구성 Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| 모델 요구사항 정의 | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | 전체 |

**주요 상수**:
- `MIN_OPENCODE_VERSION = "1.0.150"`: OpenCode 최소 버전 요구사항
- `AUTH_PLUGINS`: 인증 플러그인 매핑(Anthropic=내장, OpenAI/GitHub=플러그인)
- `AGENT_MODEL_REQUIREMENTS`: 에이전트 모델 요구사항(각 에이전트의 우선순위 체인)
- `CATEGORY_MODEL_REQUIREMENTS`: Category 모델 요구사항(visual, quick 등)

**주요 함수**:
- `doctor(options)`: 진단 명령어를 실행하고 종료 코드 반환
- `getAllCheckDefinitions()`: 모든 17개 이상의 검사 항목 정의 가져오기
- `checkPluginRegistration()`: 플러그인이 opencode.json에 등록되었는지 확인
- `validateConfig(configPath)`: 구성 파일이 Schema에 부합하는지 검증
- `checkAuthProvider(providerId)`: Provider 인증 플러그인 상태 확인
- `checkModelResolution()`: 모델 해석 및 할당 확인

</details>
