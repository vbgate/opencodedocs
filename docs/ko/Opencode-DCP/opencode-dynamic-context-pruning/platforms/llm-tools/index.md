---
title: "LLM 프루닝: 지능형 최적화 | opencode-dynamic-context-pruning"
sidebarTitle: "AI 자동 프루닝"
subtitle: "LLM 프루닝: 컨텍스트 지능형 최적화"
description: "DCP의 discard/extract 도구를 학습하고, 차이점, 주입 메커니즘, 보호 메커니즘을 이해하며, 스위치 옵션을 구성하고, 프루닝 효과를 실전 검증하여 토큰을 최적화하고 비용을 절감합니다."
tags:
  - "DCP"
  - "컨텍스트 프루닝"
  - "AI 도구"
  - "토큰 최적화"
prerequisite:
  - "start-configuration"
order: 2
---

# LLM 기반 프루닝 도구: AI가 컨텍스트를 지능적으로 최적화하도록

## 학습 목표

- discard와 extract 도구의 차이점과 사용 시나리오 이해
- AI가 `<prunable-tools>` 목록을 통해 프루닝할 콘텐츠를 선택하는 방법 파악
- 프루닝 도구의 스위치, 알림 빈도, 표시 옵션 구성
- 보호 메커니즘이 중요한 파일의 오프루닝을 방지하는 방법 이해

## 현재 직면한 문제

대화가 진행될수록 도구 호출이 누적되어 컨텍스트가 점점 커집니다. 다음과 같은 문제를 겪을 수 있습니다:
- 토큰 사용량 급증으로 비용 상승
- AI가 관련 없는 이전 도구 출력을 처리해야 함
- AI가 컨텍스트를 주도적으로 정리하도록 하는 방법을 모름

기존 방식은 수동 정리였지만, 이는 대화 흐름을 중단시킵니다. DCP는 더 나은 방법을 제공합니다: AI가 컨텍스트 정리 시점을 스스로 결정하도록 합니다.

## 이 기능이 필요한 경우

다음과 같은 상황에서 유용합니다:
- 긴 대화를 자주 진행하여 도구 호출이 많이 누적되는 경우
- AI가 대량의 과거 도구 출력을 처리해야 하는 경우
- 대화를 중단하지 않고 토큰 사용 비용을 최적화하고 싶은 경우
- 특정 시나리오에 따라 콘텐츠를 유지할지 삭제할지 선택하고 싶은 경우

## 핵심 개념

DCP는 AI가 대화 중 컨텍스트를 주도적으로 최적화할 수 있는 두 가지 도구를 제공합니다:

| 도구 | 용도 | 콘텐츠 보존 여부 |
| --- | --- | --- |
| **discard** | 완료된 작업이나 노이즈 제거 | ❌ 보존하지 않음 |
| **extract** | 핵심 발견 사항 추출 후 원본 삭제 | ✅ 요약 정보 보존 |

### 작동 메커니즘

AI가 메시지를 보내기 전에 DCP는 다음을 수행합니다:

```
1. 현재 세션의 도구 호출 스캔
   ↓
2. 이미 프루닝되었거나 보호된 도구 필터링
   ↓
3. <prunable-tools> 목록 생성
   형식: ID: tool, parameter
   ↓
4. 목록을 컨텍스트에 주입
   ↓
5. AI가 목록을 기반으로 도구를 선택하고 discard/extract 호출
   ↓
6. DCP가 프루닝된 콘텐츠를 플레이스홀더로 대체
```

### 도구 선택 결정 로직

AI는 다음 흐름에 따라 선택합니다:

```
"이 도구 출력에서 정보를 보존해야 하나요?"
  │
  ├─ 아니오 → discard (기본 정리 방식)
  │   - 작업 완료, 가치 없는 콘텐츠
  │   - 노이즈, 관련 없는 정보
  │
  ├─ 예 → extract (지식 보존)
  │   - 나중에 참조해야 할 핵심 정보
  │   - 함수 시그니처, 설정 값 등
  │
  └─ 불확실 → extract (더 안전함)
```

::: info
AI는 개별 작은 도구 출력이 아닌 일괄 프루닝을 수행합니다. 이 방식이 더 효율적입니다.
:::

### 보호 메커니즘

DCP는 AI가 중요한 콘텐츠를 실수로 프루닝하는 것을 방지하기 위해 여러 보호 계층을 갖추고 있습니다:

| 보호 계층 | 설명 | 설정 항목 |
| --- | --- | --- |
| **보호된 도구** | task, write, edit 등 핵심 도구는 프루닝 불가 | `tools.settings.protectedTools` |
| **보호된 파일** | glob 패턴과 일치하는 파일 경로는 프루닝 불가 | `protectedFilePatterns` |
| **턴 보호** | 새 도구는 N턴 동안 프루닝 목록에 포함되지 않음 | `turnProtection.turns` |

::: tip
기본 보호 도구 목록: task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
:::

## 따라하기

### 1단계: `<prunable-tools>` 목록 이해하기

대화 중 DCP는 자동으로 `<prunable-tools>` 목록을 주입합니다. AI는 다음과 같은 내용을 봅니다:

```xml
<prunable-tools>
The following tools have been invoked and are available for pruning.
This list does not mandate immediate action.
Consider your current goals and resources you need before discarding valuable tool inputs or outputs.
Consolidate your prunes for efficiency; it is rarely worth pruning a single tiny tool output.
Keep your context free of noise.

5: read, /path/to/auth.ts
12: bash, npm test
18: grep, "function login"
</prunable-tools>
```

**확인 사항**:
- 각 줄에 하나의 도구, 형식은 `ID: tool, parameter`
- ID는 숫자 인덱스 (0부터 시작)
- 프루닝 가능한 도구만 표시 (이미 프루닝됨, 보호됨, 보호 파일은 표시되지 않음)

### 2단계: AI가 discard를 사용하는 시나리오 확인

AI가 작업을 완료하고 정보를 보존할 필요가 없다고 판단할 때:

```
사용자 입력: 인증 기능 테스트

AI 출력:
테스트 통과. 인증 로직이 정상 작동하며, 테스트 로그를 보존할 필요가 없습니다.
[discard(ids: ["completion", "5", "12"]) 호출]
```

**확인 사항**:
- AI가 `discard` 도구를 사용함
- 매개변수 형식: `["이유", "ID1", "ID2", ...]`
- 이유는 두 가지만 있음: `"completion"` (작업 완료) 또는 `"noise"` (노이즈)

### 3단계: AI가 extract를 사용하는 시나리오 확인

AI가 작업을 완료한 후 핵심 정보를 보존해야 할 때:

```
사용자 입력: 인증 서비스 구현 분석

AI 출력:
몇 가지 핵심 세부 사항을 발견했습니다. 다음과 같이 추출합니다:
[extract(ids: ["5", "12"], distillation: [
  "auth.ts: validateToken이 캐시 (5분 TTL) 확인 후 OIDC 호출",
  "bash: npm test 결과 - 모든 테스트 통과"
]) 호출]
```

**확인 사항**:
- AI가 `extract` 도구를 사용함
- `distillation` 배열과 `ids` 배열의 길이가 동일함
- 각 추출 내용은 하나의 도구 출력에 대한 요약 정보에 해당

### 4단계: 프루닝 도구 옵션 구성

DCP 설정 파일 (`~/.config/opencode/dcp.jsonc` 또는 프로젝트 수준 `.opencode/dcp.jsonc`)을 편집합니다:

```jsonc
{
  "tools": {
    "discard": {
      "enabled": true
    },
    "extract": {
      "enabled": true,
      "showDistillation": false
    },
    "settings": {
      "nudgeEnabled": true,
      "nudgeFrequency": 10,
      "protectedTools": [
        "task",
        "todowrite",
        "todoread",
        "discard",
        "extract",
        "batch",
        "write",
        "edit",
        "plan_enter",
        "plan_exit"
      ]
    }
  }
}
```

**확인 사항**:
- `discard.enabled`: discard 도구 활성화 (기본값 true)
- `extract.enabled`: extract 도구 활성화 (기본값 true)
- `extract.showDistillation`: 추출 내용 표시 여부 (기본값 false)
- `nudgeEnabled`: 프루닝 알림 활성화 여부 (기본값 true)
- `nudgeFrequency`: 알림 빈도 (기본값 10, 즉 10회 도구 호출마다)

**확인 사항**:
- `showDistillation`이 false이면 추출 내용이 대화에 표시되지 않음
- `showDistillation`이 true이면 추출 내용이 ignored message 형태로 표시됨

### 5단계: 프루닝 기능 테스트

1. 비교적 긴 대화를 진행하여 여러 도구 호출을 트리거
2. AI가 적절한 시점에 discard 또는 extract를 호출하는지 관찰
3. `/dcp stats`를 사용하여 프루닝 통계 확인

**확인 사항**:
- 도구 호출이 일정 수량에 도달하면 AI가 주도적으로 프루닝 시작
- `/dcp stats`에서 절약된 토큰 수 표시
- 대화 컨텍스트가 현재 작업에 더 집중됨

## 체크포인트 ✅

::: details 클릭하여 설정 검증 펼치기

**설정이 적용되었는지 확인**

```bash
# DCP 설정 확인
cat ~/.config/opencode/dcp.jsonc

# 또는 프로젝트 수준 설정
cat .opencode/dcp.jsonc
```

확인 사항:
- `tools.discard.enabled`가 true (discard 활성화)
- `tools.extract.enabled`가 true (extract 활성화)
- `tools.settings.nudgeEnabled`가 true (알림 활성화)

**프루닝이 작동하는지 확인**

대화에서 여러 도구 호출을 트리거한 후:

확인 사항:
- AI가 적절한 시점에 discard 또는 extract 호출
- 프루닝 알림 수신 (프루닝된 도구와 절약된 토큰 표시)
- `/dcp stats`에서 누적 절약된 토큰 표시

:::

## 주의사항

### 일반적인 오류 1: AI가 도구를 프루닝하지 않음

**가능한 원인**:
- 프루닝 도구가 활성화되지 않음
- 보호 설정이 너무 엄격하여 프루닝 가능한 도구가 없음

**해결 방법**:
```jsonc
{
  "tools": {
    "discard": {
      "enabled": true  // 활성화 확인
    },
    "extract": {
      "enabled": true  // 활성화 확인
    }
  }
}
```

### 일반적인 오류 2: 중요한 콘텐츠가 실수로 프루닝됨

**가능한 원인**:
- 중요한 파일이 보호 패턴에 추가되지 않음
- 보호된 도구 목록이 불완전함

**해결 방법**:
```jsonc
{
  "protectedFilePatterns": [
    "src/auth/*",  // 인증 관련 파일 보호
    "config/*"     // 설정 파일 보호
  ],
  "tools": {
    "settings": {
      "protectedTools": [
        "read",  // read를 보호 목록에 추가
        "write"
      ]
    }
  }
}
```

### 일반적인 오류 3: 추출 내용이 보이지 않음

**가능한 원인**:
- `showDistillation`이 false로 설정됨

**해결 방법**:
```jsonc
{
  "tools": {
    "extract": {
      "showDistillation": true  // 표시 활성화
    }
  }
}
```

::: warning
추출 내용은 ignored message 형태로 표시되며, 대화 컨텍스트에 영향을 주지 않습니다.
:::

## 이번 강의 요약

DCP는 AI가 컨텍스트를 자율적으로 최적화할 수 있는 두 가지 도구를 제공합니다:

- **discard**: 완료된 작업이나 노이즈를 제거하며, 정보를 보존할 필요가 없음
- **extract**: 핵심 발견 사항을 추출한 후 원본 콘텐츠를 삭제하고, 요약 정보를 보존

AI는 `<prunable-tools>` 목록을 통해 프루닝 가능한 도구를 파악하고, 시나리오에 따라 적절한 도구를 선택합니다. 보호 메커니즘은 중요한 콘텐츠가 실수로 프루닝되지 않도록 보장합니다.

설정 요점:
- 도구 활성화: `tools.discard.enabled` 및 `tools.extract.enabled`
- 추출 내용 표시: `tools.extract.showDistillation`
- 알림 빈도 조정: `tools.settings.nudgeFrequency`
- 중요한 도구 및 파일 보호: `protectedTools` 및 `protectedFilePatterns`

## 다음 강의 예고

> 다음 강의에서는 **[Slash 명령어 사용법](../commands/)**을 학습합니다
>
> 배울 내용:
> - `/dcp context`를 사용하여 현재 세션의 토큰 분포 확인
> - `/dcp stats`를 사용하여 누적 프루닝 통계 확인
> - `/dcp sweep`를 사용하여 수동으로 프루닝 트리거

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| discard 도구 정의 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L180) | 155-180 |
| extract 도구 정의 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| 프루닝 작업 실행 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L26-L153) | 26-153 |
| --- | --- | --- |
| 프루닝 컨텍스트 주입 | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L102-L156) | 102-156 |
| discard 도구 사양 | [`lib/prompts/discard-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/discard-tool-spec.ts#L1-L41) | 1-41 |
| extract 도구 사양 | [`lib/prompts/extract-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/extract-tool-spec.ts#L1-L48) | 1-48 |
| 시스템 프롬프트 (both) | [`lib/prompts/system/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/system/both.ts#L1-L60) | 1-60 |
| 알림 프롬프트 | [`lib/prompts/nudge/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/nudge/both.ts#L1-L10) | 1-10 |
| 설정 정의 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L436-L449) | 436-449 |
| 기본 보호 도구 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-L441) | 438-441 |

**주요 상수**:
- `DISCARD_TOOL_DESCRIPTION`: discard 도구의 프롬프트 설명
- `EXTRACT_TOOL_DESCRIPTION`: extract 도구의 프롬프트 설명
- `DEFAULT_PROTECTED_TOOLS`: 기본 보호 도구 목록

**주요 함수**:
- `createDiscardTool(ctx)`: discard 도구 생성
- `createExtractTool(ctx)`: extract 도구 생성
- `executePruneOperation(ctx, toolCtx, ids, reason, toolName, distillation)`: 프루닝 작업 실행
- `buildPrunableToolsList(state, config, logger, messages)`: 프루닝 가능한 도구 목록 생성
- `insertPruneToolContext(state, config, logger, messages)`: 프루닝 컨텍스트 주입

**설정 항목**:
- `tools.discard.enabled`: discard 도구 활성화 여부 (기본값 true)
- `tools.extract.enabled`: extract 도구 활성화 여부 (기본값 true)
- `tools.extract.showDistillation`: 추출 내용 표시 여부 (기본값 false)
- `tools.settings.nudgeEnabled`: 알림 활성화 여부 (기본값 true)
- `tools.settings.nudgeFrequency`: 알림 빈도 (기본값 10)
- `tools.settings.protectedTools`: 보호된 도구 목록
- `protectedFilePatterns`: 보호된 파일 glob 패턴

</details>
