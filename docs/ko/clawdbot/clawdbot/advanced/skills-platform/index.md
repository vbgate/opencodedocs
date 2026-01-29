---
title: "스킬 플랫폼과 ClawdHub: AI 어시스턴트 확장하기 | Clawdbot 튜토리얼 | Clawdbot"
sidebarTitle: "AI 능력 확장"
subtitle: "스킬 플랫폼과 ClawdHub: AI 어시스턴트 확장하기 | Clawdbot 튜토리얼 | Clawdbot"
description: "Clawdbot 스킬 시스템 아키텍처를 배우고, Bundled, Managed, Workspace 스킬의 세 가지 로드 우선순위를 마스터하세요. ClawdHub를 사용하여 스킬을 설치하고 업데이트하며, 스킬 게이팅 규칙과 환경 변수 주입 메커니즘을 구성하세요."
tags:
  - "스킬 시스템"
  - "ClawdHub"
  - "AI 확장"
  - "스킬 구성"
prerequisite:
  - "start-getting-start"
order: 280
---

# 스킬 플랫폼과 ClawdHub로 AI 어시스턴트 확장하기 | Clawdbot 튜토리얼

## 학습 후 목표

이 수업을 완료하면 다음을 할 수 있습니다:

- Clawdbot의 스킬 시스템 아키텍처(Bundled, Managed, Workspace의 세 가지 스킬 유형) 이해
- ClawdHub에서 스킬을 발견, 설치, 업데이트하여 AI 어시스턴트 기능 확장
- 스킬의 활성 상태, 환경 변수 및 API 키 구성
- 스킬 게이팅(Gating) 규칙 사용하여 조건이 충족될 때만 스킬이 로드되도록 보장
- 다중 Agent 시나리오에서 스킬 공유 및 덮어쓰기 우선순위 관리

## 현재 문제점

Clawdbot은 이미 풍부한 내장 도구(브라우저, 명령 실행, 웹 검색 등)를 제공하지만, 다음과 같은 경우:

- 타사 CLI 도구(`gemini`, `peekaboo` 등)를 호출하고 싶을 때
- 특정 도메인의 자동화 스크립트를 추가하고 싶을 때
- AI에게 사용자 정의 도구 세트 사용 방법을 학습시키고 싶을 때

이렇게 생각할 수 있습니다: "AI에 사용 가능한 도구가 무엇인지 어떻게 알려줄까요? 이 도구들은 어디에 배치해야 하나요? 여러 Agent가 스킬을 공유할 수 있나요?"

Clawdbot의 스킬 시스템은 이를 위해 설계되었습니다: **SKILL.md 파일로 스킬을 선언하면 Agent가 자동으로 로드하고 사용합니다**.

## 이 기능을 사용해야 할 때

- **AI 능력을 확장할 때**: 새 도구나 자동화 프로세스를 추가하고 싶을 때
- **다중 Agent 협업 시**: 다른 Agent가 스킬을 공유하거나 독점적으로 사용해야 할 때
- **스킬 버전 관리 시**: ClawdHub에서 스킬을 설치, 업데이트, 동기화할 때
- **스킬 게이팅 시**: 스킬이 특정 환경(OS, 바이너리, 구성)에서만 로드되도록 할 때

## 🎒 시작 전 준비

시작하기 전에 다음을 확인하세요:

- [ ] [빠른 시작](../../start/getting-start/)을 완료하고 Gateway가 정상적으로 실행 중
- [ ] 하나 이상의 AI 모델(Anthropic, OpenAI, Ollama 등) 구성 완료
- [ ] 기본 명령줄 작업(`mkdir`, `cp`, `rm`) 이해

## 핵심 개념

### 스킬이란?

스킬은 `SKILL.md` 파일(LLM에 대한 지침 및 도구 정의)과 선택적 스크립트 또는 리소스를 포함하는 디렉토리입니다. `SKILL.md`는 YAML frontmatter로 메타데이터를 정의하고 Markdown으로 스킬 사용법을 설명합니다.

Clawdbot은 [AgentSkills](https://agentskills.io) 사양과 호환되며, 이 사양을 준수하는 다른 도구에서도 스킬을 로드할 수 있습니다.

#### 스킬이 로드되는 세 가지 위치

스킬은 세 가지 위치에서 로드되며 우선순위는 높은 순입니다:

1. **Workspace 스킬**: `<workspace>/skills`(가장 높은 우선순위)
2. **Managed/로컬 스킬**: `~/.clawdbot/skills`
3. **Bundled 스킬**: 설치 패키지와 함께 제공(가장 낮은 우선순위)

::: info 우선순위 규칙
동일한 이름의 스킬이 여러 위치에 있는 경우, Workspace 스킬이 Managed 및 Bundled 스킬을 덮어씁니다.
:::

또한 `skills.load.extraDirs` 구성으로 추가 스킬 디렉토리를 지정할 수 있습니다(가장 낮은 우선순위).

#### 다중 Agent 시나리오에서의 스킬 공유

다중 Agent 구성에서 각 Agent는 자체 workspace를 가집니다:

- **Per-agent 스킬**: `<workspace>/skills`에 있으며 해당 Agent에만 표시
- **공유 스킬**: `~/.clawdbot/skills`에 있으며 동일한 머신의 모든 Agent에 표시
- **공유 폴더**: `skills.load.extraDirs`로 추가할 수 있음(가장 낮은 우선순위). 여러 Agent가 동일한 스킬 패키지를 공유하는 데 사용

동명 충돌 시 우선순위 규칙도 동일하게 적용됩니다: Workspace > Managed > Bundled.

#### 스킬 게이팅(Gating)

Clawdbot은 로드 시 `metadata` 필드로 스킬을 필터링하여 조건이 충족될 때만 스킬이 로드되도록 합니다:

```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"clawdbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

`metadata.clawdbot` 아래 필드:

- `always: true`: 항상 스킬 로드(다른 게이팅 건너뜀)
- `emoji`: macOS Skills UI에 표시되는 이모지
- `homepage`: macOS Skills UI에 표시되는 웹사이트 링크
- `os`: 플랫폼 목록(`darwin`, `linux`, `win32`), 스킬은 이러한 OS에서만 사용 가능
- `requires.bins`: 목록, 각 항목이 `PATH`에 있어야 함
- `requires.anyBins`: 목록, 하나 이상이 `PATH`에 있어야 함
- `requires.env`: 목록, 환경 변수가 존재하거나 구성에서 제공되어야 함
- `requires.config`: `clawdbot.json` 경로 목록, 참이어야 함
- `primaryEnv`: `skills.entries.<name>.apiKey`와 연결된 환경 변수 이름
- `install`: 선택적 설치기 사양 배열(macOS Skills UI용)

::: warning 샌드박스 환경에서의 바이너리 검사
`requires.bins`는 스킬 로드 시 **호스트**에서 검사됩니다. Agent가 샌드박스에서 실행 중인 경우 바이너리도 컨테이너 내에 있어야 합니다.
`agents.defaults.sandbox.docker.setupCommand`으로 의존성을 설치할 수 있습니다.
:::

### 환경 변수 주입

Agent 실행이 시작되면 Clawdbot은 다음을 수행합니다:

1. 스킬 메타데이터 읽기
2. 모든 `skills.entries.<key>.env` 또는 `skills.entries.<key>.apiKey`를 `process.env`에 적용
3. 조건을 충족하는 스킬을 사용하여 시스템 프롬프트 빌드
4. Agent 실행 종료 후 원래 환경 복원

이는 **Agent 실행 범위로 제한**되며 전역 Shell 환경이 아닙니다.

## 실습해보기

### 1단계: 설치된 스킬 보기

CLI를 사용하여 현재 사용 가능한 스킬을 나열합니다:

```bash
clawdbot skills list
```

또는 조건을 충족하는 스킬만 봅니다:

```bash
clawdbot skills list --eligible
```

**예상 결과**: 스킬 목록(이름, 설명, 조건 충족 여부(바이너리, 환경 변수 등))

### 2단계: ClawdHub에서 스킬 설치

ClawdHub는 Clawdbot의 공용 스킬 레지스트리로, 스킬을 탐색, 설치, 업데이트, 게시할 수 있습니다.

#### CLI 설치

다음 중 하나로 ClawdHub CLI를 설치합니다:

```bash
npm i -g clawdhub
```

또는

```bash
pnpm add -g clawdhub
```

#### 스킬 검색

```bash
clawdhub search "postgres backups"
```

#### 스킬 설치

```bash
clawdhub install <skill-slug>
```

기본적으로 CLI는 현재 작업 디렉토리의 `./skills` 하위 디렉토리(또는 구성된 Clawdbot workspace로 폴백)에 설치합니다. Clawdbot은 다음 세션에서 이를 `<workspace>/skills`로 로드합니다.

**예상 결과**: 설치 출력, 스킬 폴더 및 버전 정보 표시

### 3단계: 설치된 스킬 업데이트

모든 설치된 스킬 업데이트:

```bash
clawdhub update --all
```

또는 특정 스킬 업데이트:

```bash
clawdhub update <slug>
```

**예상 결과**: 각 스킬의 업데이트 상태(버전 변경 등)

### 4단계: 스킬 덮어쓰기 구성

`~/.clawdbot/clawdbot.json`에서 스킬의 활성 상태, 환경 변수 등을 구성합니다:

```json5
{
  "skills": {
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": {
          "GEMINI_API_KEY": "GEMINI_KEY_HERE"
        },
        "config": {
          "endpoint": "https://example.invalid",
          "model": "nano-pro"
        }
      },
      "peekaboo": { "enabled": true },
      "sag": { "enabled": false }
    }
  }
}
```

**규칙**:

- `enabled: false`: Bundled 또는 설치된 경우에도 스킬 비활성화
- `env`: 환경 변수 주입(변수가 프로세스에서 설정되지 않은 경우에만)
- `apiKey`: `metadata.clawdbot.primaryEnv`가 선언된 스킬용 편리한 필드
- `config`: 선택적 사용자 정의 필드 패키지. 사용자 정의 키는 여기에 배치해야 함

**예상 결과**: 구성을 저장하면 Clawdbot은 다음 Agent 실행 시 이 설정을 적용합니다.

### 5단계: 스킬 모니터 활성화(선택 사항)

기본적으로 Clawdbot은 스킬 폴더를 모니터링하고 `SKILL.md` 파일이 변경되면 스킬 스냅샷을 새로 고칩니다. `skills.load`에서 구성할 수 있습니다:

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

**예상 결과**: 스킬 파일을 수정하면 Gateway를 다시 시작할 필요 없이 Clawdbot은 다음 Agent 턴에서 자동으로 스킬 목록을 새로 고칩니다.

### 6단계: 스킬 문제 디버깅

스킬의 세부 정보 및 누락된 의존성 확인:

```bash
clawdbot skills info <name>
```

모든 스킬의 의존성 상태 확인:

```bash
clawdbot skills check
```

**예상 결과**: 스킬의 세부 정보(바이너리, 환경 변수, 구성 상태, 누락된 조건 등)

## 체크포인트 ✅

위 단계를 완료하면 다음을 수행할 수 있어야 합니다:

- [ ] `clawdbot skills list`로 모든 사용 가능한 스킬 보기
- [ ] ClawdHub에서 새 스킬 설치
- [ ] 설치된 스킬 업데이트
- [ ] `clawdbot.json`에서 스킬 덮어쓰기 구성
- [ ] `skills check`로 스킬 의존성 문제 디버깅

## 일반적인 실수

### 일반적인 오류 1: 스킬 이름에 하이픈 포함

**문제**: `skills.entries`에서 하이픈이 있는 스킬 이름을 키로 사용

```json
// ❌ 오류: 따옴표 없음
{
  "skills": {
    "entries": {
      nano-banana-pro: { "enabled": true }  // JSON 구문 오류
    }
  }
}
```

**수정**: 키에 따옴표 사용(JSON5는 따옴표가 있는 키 지원)

```json
// ✅ 올바름: 따옴표 사용
{
  "skills": {
    "entries": {
      "nano-banana-pro": { "enabled": true }
    }
  }
}
```

### 일반적인 오류 2: 샌드박스 환경에서의 환경 변수

**문제**: 스킬이 샌드박스에서 실행 중이지만 `skills.entries.<skill>.env` 또는 `apiKey`가 작동하지 않음

**원인**: 전역 `env` 및 `skills.entries.<skill>.env/apiKey`는 **호스트 실행**에만 적용되며 샌드박스는 호스트 `process.env`를 상속하지 않습니다.

**수정**: 다음 중 하나를 사용합니다:

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "docker": {
          "env": {
            "GEMINI_API_KEY": "your_key_here"
          }
        }
      }
    }
  }
}
```

또는 환경 변수를 사용자 정의 샌드박스 이미지에 baked 합니다.

### 일반적인 오류 3: 스킬이 목록에 표시되지 않음

**문제**: 스킬이 설치되었지만 `clawdbot skills list`에 표시되지 않음

**가능한 원인**:

1. 스킬이 게이팅 조건을 충족하지 않음(바이너리, 환경 변수, 구성 누락)
2. 스킬이 비활성화됨(`enabled: false`)
3. 스킬이 Clawdbot이 스캔하는 디렉토리에 없음

**문제 해결 단계**:

```bash
# 스킬 의존성 확인
clawdbot skills check

# 스킬 디렉토리 스캔 여부 확인
ls -la ~/.clawdbot/skills/
ls -la <workspace>/skills/
```

### 일반적인 오류 4: 스킬 충돌 및 우선순위 혼동

**문제**: 동일한 이름의 스킬이 여러 위치에 있는 경우 어느 것이 로드되나요?

**우선순위 기억하기**:

`<workspace>/skills` (최고) → `~/.clawdbot/skills` → bundled skills (최저)

Bundled 스킬을 사용하고 Workspace 덮어쓰기를 피하려면:

1. `<workspace>/skills/<skill-name>` 삭제 또는 이름 변경
2. 또는 `skills.entries`에서 해당 스킬 비활성화

## 수업 요약

이 수업에서는 Clawdbot 스킬 플랫폼의 핵심 개념을 학습했습니다:

- **세 가지 스킬 유형**: Bundled, Managed, Workspace. 우선순위로 로드됨
- **ClawdHub 통합**: 스킬 검색, 설치, 업데이트, 게시를 위한 공용 레지스트리
- **스킬 게이팅**: metadata의 `requires` 필드로 스킬 필터링
- **구성 덮어쓰기**: `clawdbot.json`에서 스킬 활성화, 환경 변수, 사용자 정의 구성 제어
- **스킬 모니터**: Gateway를 다시 시작하지 않고 스킬 목록 자동 새로 고침

스킬 시스템은 Clawdbot 기능을 확장하는 핵심 메커니즘입니다. 이를 마스터하면 AI 어시스턴트를 더 많은 시나리오와 도구에 적용할 수 있습니다.

## 다음 수업 예고

> 다음 수업에서 **[보안 및 샌드박스 격리](../security-sandbox/)**를 학습합니다.
>
> 학습 내용:
> - 보안 모델 및 권한 제어
> - 도구 권한의 allowlist/denylist
> - Docker 샌드박스 격리 메커니즘
> - 원격 Gateway의 보안 구성

---

#### 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 표시</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 스킬 구성 유형 정의 | [`src/config/types.skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.skills.ts) | 1-32 |
| 스킬 시스템 문서 | [`docs/tools/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills.md) | 1-260 |
| 스킬 구성 참조 | [`docs/tools/skills-config.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills-config.md) | 1-76 |
| ClawdHub 문서 | [`docs/tools/clawdhub.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/clawdhub.md) | 1-202 |
| 스킬 생성 가이드 | [`docs/tools/creating-skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/creating-skills.md) | 1-42 |
| CLI 명령 | [`docs/cli/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/skills.md) | 1-26 |

**주요 유형**:

- `SkillConfig`: 단일 스킬 구성(enabled, apiKey, env, config)
- `SkillsLoadConfig`: 스킬 로드 구성(extraDirs, watch, watchDebounceMs)
- `SkillsInstallConfig`: 스킬 설치 구성(preferBrew, nodeManager)
- `SkillsConfig`: 최상위 스킬 구성(allowBundled, load, install, entries)

**내장 스킬 예제**:

- `skills/gemini/SKILL.md`: Gemini CLI 스킬
- `skills/peekaboo/SKILL.md`: Peekaboo macOS UI 자동화 스킬

</details>
