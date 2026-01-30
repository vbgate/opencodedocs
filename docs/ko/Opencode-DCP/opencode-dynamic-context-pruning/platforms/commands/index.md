---
title: "명령어: 모니터링 및 프루닝 | opencode-dynamic-context-pruning"
sidebarTitle: "토큰 모니터링, 수동 프루닝"
subtitle: "DCP 명령어 가이드: 모니터링 및 수동 프루닝"
description: "DCP의 4가지 명령어를 사용하여 모니터링과 수동 프루닝을 수행하는 방법을 학습합니다. /dcp context로 세션 확인, /dcp stats로 통계 확인, /dcp sweep으로 수동 프루닝 트리거 방법을 알아봅니다."
tags:
  - "DCP 명령어"
  - "토큰 모니터링"
  - "수동 프루닝"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 3
---

# DCP 명령어 가이드: 모니터링 및 수동 프루닝

## 학습 완료 후 할 수 있는 것

- `/dcp context`를 사용하여 현재 세션의 토큰 사용 분포 확인
- `/dcp stats`를 사용하여 누적 프루닝 통계 확인
- `/dcp sweep [n]`를 사용하여 수동 프루닝 트리거
- 보호된 도구와 파일의 보호 메커니즘 이해
- 토큰 계산 전략과 절약 효과 학습

## 현재 당신의 어려움

긴 대화에서 토큰 소비가 점점 빨라지고 있지만, 당신은 알지 못합니다:
- 현재 세션의 토큰이 어디에 쓰이고 있는가?
- DCP가 실제로 얼마나 절약해 주었는가?
- 더 이상 필요 없는 도구 출력을 어떻게 수동으로 정리하는가?
- 어떤 도구가 보호되어 프루닝되지 않는가?

이러한 문제를 이해하지 못하면 DCP의 최적화 효과를 충분히 활용하지 못할 수 있고, 심지어 중요한 순간에 중요한 정보를 실수로 삭제할 수도 있습니다.

## 이 기술을 사용해야 할 때

당신이 다음과 같은 경우:
- 현재 세션의 토큰 구성을 이해하고 싶을 때
- 대화 기록을 빠르게 정리해야 할 때
- DCP의 프루닝 효과를 검증하고 싶을 때
- 새로운 작업을 시작하기 전에 컨텍스트 정리를 할 때

## 핵심 개념

DCP는 토큰 사용을 모니터링하고 제어하는 데 도움이 되는 4가지 Slash 명령어를 제공합니다:

| 명령어 | 용도 | 사용 시나리오 |
|---|---|---|
| `/dcp` | 도움말 표시 | 명령어를 잊었을 때 확인 |
| `/dcp context` | 현재 세션 토큰 분석 | 컨텍스트 구성 이해 |
| `/dcp stats` | 누적 프루닝 통계 확인 | 장기 효과 검증 |
| `/dcp sweep [n]` | 수동 도구 프루닝 | 컨텍스트 크기 빠르게 줄이기 |

**보호 메커니즘**:

모든 프루닝 작업은 다음을 자동으로 건너뜁니다:
- **보호된 도구**: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- **보호된 파일**: 설정의 `protectedFilePatterns`와 일치하는 파일 경로

::: info
보호된 도구와 보호된 파일 설정은 구성 파일을 통해 사용자 정의할 수 있습니다. 자세한 내용은 [구성 가이드](../../start/configuration/)를 참조하세요.
:::

## 따라하기

### 1단계: 도움말 정보 보기

OpenCode 대화창에 `/dcp`를 입력합니다.

**보게 될 내용**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

**체크포인트 ✅**: 3개의 하위 명령어 설명이 보이는지 확인하세요.

### 2단계: 현재 세션 토큰 분석

`/dcp context`를 입력하여 현재 세션의 토큰 사용량을 확인합니다.

**보게 될 내용**:

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**토큰 카테고리 설명**:

| 카테고리 | 계산 방식 | 설명 |
|---|---|---|
| **System** | `firstAssistant.input + cache.read - tokenizer(firstUserMessage)` | 시스템 프롬프트 |
| **Tools** | `tokenizer(toolInputs + toolOutputs) - prunedTokens` | 도구 호출 (프루닝된 부분 차감) |
| **User** | `tokenizer(all user messages)` | 모든 사용자 메시지 |
| **Assistant** | `total - system - user - tools` | AI 텍스트 출력 + 추론 토큰 |

**체크포인트 ✅**: 각 카테고리의 토큰 비율과 수량이 보이는지 확인하세요.

### 3단계: 누적 프루닝 통계 보기

`/dcp stats`를 입력하여 누적 프루닝 효과를 확인합니다.

**보게 될 내용**:

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.2K
  Tools pruned:   12

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~284.5K
  Tools pruned:   156
  Sessions:       8
```

**통계 설명**:
- **Session**: 현재 세션의 프루닝 데이터 (메모리)
- **All-time**: 모든 과거 세션의 누적 데이터 (디스크 지속성)

**체크포인트 ✅**: 현재 세션과 과거 누적의 프루닝 통계가 모두 보이는지 확인하세요.

### 4단계: 수동 도구 프루닝

`/dcp sweep`를 사용하는 두 가지 방법이 있습니다:

#### 방법 1: 마지막 사용자 메시지 이후의 모든 도구 프루닝

`/dcp sweep`를 입력합니다 (매개변수 없이).

**보게 될 내용**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept 8 tool(s) since previous user message.
Tokens saved: ~12,345

  • Read: src/config.ts
  • Read: src/utils.ts
  • Bash: npm test
  • Read: package.json
  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
```

#### 방법 2: 마지막 N개 도구 프루닝

`/dcp sweep 5`를 입력하여 마지막 5개 도구를 프루닝합니다.

**보게 될 내용**:

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept last 5 tool(s).
Tokens saved: ~7,892

  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
  • Bash: npm run build
```

**보호된 도구 팁**:

보호된 도구가 건너뛰어지면 출력에 다음이 표시됩니다:

```
Swept 5 tool(s).
Tokens saved: ~7,892
(2 protected tool(s) skipped)
```

::: warning
보호된 도구(예: `write`, `edit`)와 보호된 파일 경로는 자동으로 건너뛰어지며 프루닝되지 않습니다.
:::

**체크포인트 ✅**: 프루닝된 도구 목록과 절약된 토큰 수량이 보이는지 확인하세요.

### 5단계: 프루닝 효과 다시 보기

프루닝 후, `/dcp context`를 다시 입력하여 새로운 토큰 분포를 확인합니다.

**보게 될 내용**:
- `Tools` 카테고리 비율 감소
- `Summary`에 프루닝된 도구 수 증가 표시
- `Current context` 총액 감소

**체크포인트 ✅**: 토큰 사용량이 현저히 감소했는지 확인하세요.

## 주의사항

### ❌ 오류: 중요한 도구를 실수로 삭제

**시나리오**: `write` 도구를 사용하여 중요한 파일을 방금 생성했는데 `/dcp sweep`을 실행했습니다.

**잘못된 결과**: `write` 도구가 프루닝되어 AI가 파일이 생성되었는지 몰라도 됩니다.

**올바른 방법**:
- `write`, `edit` 등의 도구는 기본적으로 보호됩니다
- `protectedTools` 설정을 수동으로 수정하여 이러한 도구를 제거하지 마세요
- 중요한 작업 후 몇 턴 기다렸다가 정리하세요

### ❌ 오류: 부적절한 프루닝 타이밍

**시나리오**: 대화가 막 시작되었는데 도구 호출이 몇 개만 있었고 `/dcp sweep`을 실행했습니다.

**잘못된 결과**: 절약된 토큰이 매우 적고 컨텍스트 일관성에 영향을 줄 수 있습니다.

**올바른 방법**:
- 대화가 일정 수준에 도달할 때까지 기다리세요(예: 10+ 도구 호출) 정리 전에
- 새로운 작업을 시작하기 전에 이전 라운드의 도구 출력을 정리하세요
- 정리할 가치가 있는지 `/dcp context`를 사용하여 판단하세요

### ❌ 오류: 수동 프루닝에 과도하게 의존

**시나리오**: 매번 대화마다 `/dcp sweep`을 수동으로 실행합니다.

**잘못된 결과**:
- 자동 프루닝 전략(중복 제거, 덮어쓰기, 오류 지우기)이 낭비됩니다
- 운영 부담 증가

**올바른 방법**:
- 기본적으로 자동 프루닝 전략 활성화(구성: `strategies.*.enabled`)
- 필요할 때 수동 프루닝을 보충으로 사용하세요
- `/dcp stats`를 통해 자동 프루닝 효과를 검증하세요

## 수업 요약

DCP의 4가지 명령어는 토큰 사용을 모니터링하고 제어하는 데 도움이 됩니다:

| 명령어 | 핵심 기능 |
|---|---|
| `/dcp` | 도움말 정보 표시 |
| `/dcp context` | 현재 세션 토큰 분석 |
| `/dcp stats` | 누적 프루닝 통계 보기 |
| `/dcp sweep [n]` | 수동 도구 프루닝 |

**토큰 계산 전략**:
- System: 시스템 프롬프트(첫 번째 응답에서 추론)
- Tools: 도구 입력/출력(프루닝된 부분 차감)
- User: 모든 사용자 메시지(추정)
- Assistant: AI 출력 + 추론 토큰(잔차)

**보호 메커니즘**:
- 보호된 도구: `task`, `todowrite`, `todoread`, `discard`, `extract`, `batch`, `write`, `edit`, `plan_enter`, `plan_exit`
- 보호된 파일: 구성된 글로브 패턴
- 모든 프루닝 작업이 자동으로 이러한 항목을 건너뜀

**모범 사례**:
- `/dcp context`를 정기적으로 확인하여 토큰 구성 이해
- 새로운 작업 전 `/dcp sweep` 실행하여 기록 정리
- 자동 프루닝에 의존하고 수동 프루닝을 보충으로 사용
- `/dcp stats`를 통해 장기 효과 검증

## 다음 수업 예고

> 다음 수업에서는 **[보호 메커니즘](../../advanced/protection/)**을 배웁니다.
>
> 배울 내용:
> - 라운드 보호가 어떻게 실수로 프루닝을 방지하는지
> - 보호된 도구 목록을 어떻게 사용자 정의하는지
> - 보호된 파일 패턴의 구성 방법
> - 하위 에이전트 세션의 특수 처리

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 위치 보기(클릭하여 확장)</strong></summary>

> 마지막 업데이트: 2026-01-23

| 기능 | 파일 경로 | 줄 번호 |
|---|---|---|
| /dcp 도움말 명령어 | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 19-32 |
| /dcp context 명령어 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 238-247 |
| 토큰 계산 전략 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 5-38 |
| /dcp stats 명령어 | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| /dcp sweep 명령어 | [`lib/commands/sweep.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/sweep.ts) | 123-259 |
| 보호된 도구 구성 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 461 |
| 기본 보호된 도구 목록 | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 150-151 |

**키 상수**:
- `DEFAULT_PROTECTED_TOOLS`: 기본 보호된 도구 목록

**키 함수**:
- `handleHelpCommand()`: /dcp 도움말 명령어 처리
- `handleContextCommand()`: /dcp context 명령어 처리
- `analyzeTokens()`: 각 카테고리의 토큰 수량 계산
- `handleStatsCommand()`: /dcp stats 명령어 처리
- `handleSweepCommand()`: /dcp sweep 명령어 처리
- `buildToolIdList()`: 도구 ID 목록 구축

</details>
