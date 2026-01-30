---
title: "자동 정리: 3가지 전략 | opencode-dcp"
sidebarTitle: "전략으로 토큰 절약"
subtitle: "자동 정리: 3가지 전략 | opencode-dcp"
description: "DCP의 3가지 자동 정리 전략 학습: 중복 제거, 덮어쓰기, 오류 정리. 작동 원리, 적용 시나리오, 설정 방법을 상세히 설명하여 토큰 비용 절약과 대화 품질 향상을 도와드립니다. 모든 전략은 LLM 비용 없이 동작합니다."
tags:
  - "자동 정리"
  - "전략"
  - "중복 제거"
  - "덮어쓰기"
  - "오류 정리"
prerequisite:
  - "start-getting-started"
  - "start-configuration"
order: 1
---

# 자동 정리 전략 상세 설명

## 학습 후 활용 방법

- 3가지 자동 정리 전략의 작동 원리 이해
- 각 전략의 활성화/비활성화 시점 파악
- 설정을 통한 전략 효과 최적화

## 현재 겪고 있는 문제

대화가 길어질수록 컨텍스트에 도구 호출이 쌓입니다:
- AI가 같은 파일을 반복해서 읽고, 매번 전체 내용을 컨텍스트에 담음
- 파일에 쓴 후에도 읽을 때, 원래 쓴 내용이 컨텍스트에 그대로 남아 있음
- 도구 호출이 실패한 후에도, 방대한 입력 파라미터가 그 자리를 차지함

이러한 문제들로 인해 토큰 비용이 계속 증가하고, 컨텍스트가 "오염"되어 AI의 판단에 영향을 미칠 수 있습니다.

## 핵심 개념

DCP는 **자동 정리 전략** 3가지를 제공하여, 각 요청 전에 조용히 실행되며 **LLM 비용 없이** 동작합니다:

| 전략 | 기본 설정 | 역할 |
| --- | --- | ---|
| 중복 제거 | ✅ 활성화 | 중복된 도구 호출을 감지하여 최신 호출만 유지 |
| 덮어쓰기 | ❌ 비활성화 | 읽기로 덮어쓰기된 쓰기 작업 입력 정리 |
| 오류 정리 | ✅ 활성화 | N회 이상 지난 오류 도구 입력 정리 |

모든 전략은 다음 규칙을 따릅니다:
- **보호 대상 도구 건너뛰기**: task, write, edit 등 핵심 도구는 정리되지 않음
- **보호 대상 파일 건너뛰기**: 설정된 glob 패턴으로 보호된 파일 경로
- **오류 메시지 보존**: 오류 정리 전략은 입력 파라미터만 제거하고 오류 정보는 유지

---

## 중복 제거 전략

### 작동 원리

중복 제거 전략은 **같은 도구명과 파라미터**의 반복 호출을 감지하여 최신 호출만 유지합니다.

::: info 서명 일치 메커니즘

DCP는 "서명"으로 중복을 판단합니다:
- 도구 이름이 동일
- 파라미터 값이 동일 (null/undefined 제외, 키 순서 무관)

예시:
```json
// 1차 호출
{ "tool": "read", "path": "src/config.ts" }

// 2차 호출 (서명 동일)
{ "tool": "read", "path": "src/config.ts" }

// 3차 호출 (서명 다름)
{ "tool": "read", "path": "src/utils.ts" }
```
:::

### 적용 시나리오

**활성화 권장** (기본 켜짐):
- AI가 코드 분석을 위해 동일 파일을 자주 읽을 때
- 다중 턴 대화에서 동일 설정을 반복 조회할 때
- 최신 상태를 유지해야 하고 과거 출력은 버려도 되는 시나리오

**비활성화 고려**:
- 각 도구 호출의 컨텍스트를 모두 유지해야 할 때 (예: 디버깅 출력)

### 설정 방법

```json
// ~/.config/opencode/dcp.jsonc
{
  "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/main/dcp.schema.json",
  "strategies": {
    "deduplication": {
      "enabled": true  // true 활성화, false 비활성화
    }
  }
}
```

**보호 대상 도구** (기본 정리 안 됨):
- task、write、edit、batch、plan_enter、plan_exit
- todowrite、todoread (작업 목록 도구)
- discard、extract (DCP 자체 도구)

이러한 도구는 설정에서도 중복 제거 정리가 불가능합니다 (하드코딩된 보호).

---

## 덮어쓰기 전략

### 작동 원리

덮어쓰기 전략은 **후속 읽기로 덮어쓰기된 쓰기 작업 입력**을 정리합니다.

::: details 예시: 쓰기 후 읽기

```text
1단계: 파일 쓰기
AI가 write("config.json", {...}) 호출
↓
2단계: 파일 읽기 확인
AI가 read("config.json") 호출 → 최신 내용 반환
↓
덮어쓰기 전략 인식
write의 입력(크기가 클 수 있음)이 중복됨
read가 파일의 현재 상태를 이미 캡처했으므로
↓
정리
read의 출력만 유지하고 write의 입력 제거
```

:::

### 적용 시나리오

**활성화 권장**:
- 빈번한 "쓰기 → 검증 → 수정" 반복 개발 시나리오
- 쓰기 작업에 많은 템플릿 또는 전체 파일 내용을 포함할 때

**기본 비활성화 이유**:
- 일부 워크플로우는 "쓰기 이력"을 컨텍스트로 사용에 의존
- 일부 버전 제어 관련 도구 호출에 영향을 줄 수 있음

**수동 활성화 시점**:
```json
{
  "strategies": {
    "supersedeWrites": {
      "enabled": true
    }
  }
}
```

### 주의사항

이 전략은 **write 도구의 입력만 정리**하고 출력은 정리하지 않습니다. 이는:
- write의 출력은 보통 확인 메시지(작음)
- write의 입력은 전체 파일 내용을 포함할 수 있음(큼)

---

## 오류 정리 전략

### 작동 원리

오류 정리 전략은 도구 호출 실패 후 N 회 대기한 다음 **입력 파라미터**를 제거합니다(오류 메시지는 유지).

::: info 턴(turn)이란?

OpenCode 대화에서:
- 사용자 메시지 전송 → AI 응답 = 1 턴
- 도구 호출은 턴으로 카운트되지 않음

기본 임계값은 4 턴으로, 오류 도구의 입력은 4 턴 후 자동 정리됩니다.
:::

### 적용 시나리오

**활성화 권장** (기본 켜짐):
- 도구 호출이 실패하고 입력이 클 때 (예: 큰 파일 읽기 실패)
- 오류 정보는 유지해야 하지만 입력 파라미터는 더 이상 가치가 없을 때

**비활성화 고려**:
- 디버깅을 위해 실패 도구의 전체 입력을 유지해야 할 때
- "간헐적" 오류를 자주 만나고 이력을 유지하고 싶을 때

### 설정 방법

```json
{
  "strategies": {
    "purgeErrors": {
      "enabled": true,   // 활성화 스위치
      "turns": 4        // 정리 임계값 (턴 수)
    }
  }
}
```

**보호 대상 도구** (기본 정리 안 됨):
- 중복 제거 전략과 동일한 보호 도구 목록

---

## 전략 실행 순서

3가지 전략은 **고정된 순서**로 실행됩니다:

```mermaid
graph LR
    A["메시지 목록"] --> B["동기 도구 캐시"]
    B --> C["중복 제거 전략"]
    C --> D["덮어쓰기 전략"]
    D --> E["오류 정리 전략"]
    E --> F["정리 콘텐츠 교체"]
```

이는:
1. 먼저 중복 제거 (중복 감소)
2. 그 다음 덮어쓰기 정리 (무효화된 쓰기 정리)
3. 마지막으로 오류 정리 (만료된 오류 입력 정리)

각 전략은 이전 전략의 결과를 기반으로 하며, 동일 도구를 중복 정리하지 않습니다.

---

## 함정 경고

### ❌ 오해 1: 모든 도구가 자동으로 정리된다고 생각

**문제**: task, write 등의 도구가 정리되지 않는 이유는?

**원인**: 이러한 도구는 **보호 도구 목록**에 있어 하드코딩된 보호를 받습니다.

**해결책**:
- write 정리가 필요하다면 덮어쓰기 전략 활성화 고려
- task 정리가 필요하다면 보호 파일 경로 설정을 통해 간접적으로 제어 가능

### ❌ 오해 2: 덮어쓰기 전략으로 컨텍스트가 불완전해짐

**문제**: 덮어쓰기 전략 활성화 후 AI가 이전 쓰기 내용을 찾지 못함.

**원인**: 전략은 "읽기로 덮어쓰기된" 쓰기만 정리하며, 쓰기 후 읽기가 없었다면 정리되지 않습니다.

**해결책**:
- 파일이 실제로 읽혔는지 확인 (`/dcp context`로 확인 가능)
- 쓰기 이력 유지가 필요하다면 이 전략 비활성화

### ❌ 오해 3: 오류 정리 전략이 너무 빨리 정리됨

**문제**: 오류 입력이 방금 정리되자마자 AI가 같은 오류를 다시 만남.

**원인**: `turns` 임계값이 너무 작게 설정됨.

**해결책**:
```json
{
  "strategies": {
    "purgeErrors": {
      "turns": 8  // 기본값 4에서 8로 증가
    }
  }
}
```

---

## 언제 이 기술을 사용할까

| 시나리오 | 추천 전략 조합 |
| --- | ---|
| 일상 개발 (읽기 위주) | 중복 제거 + 오류 정리 (기본 설정) |
| 빈번한 쓰기 검증 | 모두 활성화 (수동으로 덮어쓰기 활성화) |
| 도구 실패 디버깅 | 중복 제거만 활성화 (오류 정리 비활성화) |
| 전체 컨텍스트 이력 필요 | 모두 비활성화 |

---

## 본 강의 요약

- **중복 제거 전략**: 중복 도구 호출 감지, 최신 호출만 유지 (기본 활성화)
- **덮어쓰기 전략**: 읽기로 덮어쓰기된 쓰기 작업 입력 정리 (기본 비활성화)
- **오류 정리 전략**: N 회 후 오류 도구 입력 정리 (기본 활성화, 임계값 4)
- 모든 전략은 보호 대상 도구와 보호 대상 파일 경로를 건너뜀
- 전략은 고정된 순서로 실행: 중복 제거 → 덮어쓰기 → 오류 정리

---

## 다음 강의 예고

> 다음 강의에서는 **[LLM 기반 정리 도구](../llm-tools/)**를 학습합니다.
>
> 학습할 내용:
> - AI가 discard와 extract 도구를 자율적으로 호출하는 방법
> - 의미 수준의 컨텍스트 최적화 구현 방식
> - 핵심 발견을 추출하는 모범 사례

---

## 부록: 소스 코드 참고

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 줄 번호 |
| --- | --- | ---|
| 중복 제거 전략 구현 | [`lib/strategies/deduplication.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/deduplication.ts) | 13-83 |
| 덮어쓰기 전략 구현 | [`lib/strategies/supersede-writes.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/supersede-writes.ts) | 16-105 |
| 오류 정리 전략 구현 | [`lib/strategies/purge-errors.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/purge-errors.ts) | 16-80 |
| 전략 엔트리 익스포트 | [`lib/strategies/index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/index.ts) | 1-5 |
| 기본 설정 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 423-464 |
| 보호 대상 도구 목록 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 68-79 |

**주요 함수**:
- `deduplicate()` - 중복 제거 전략 메인 함수
- `supersedeWrites()` - 덮어쓰기 전략 메인 함수
- `purgeErrors()` - 오류 정리 전략 메인 함수
- `createToolSignature()` - 중복 제거 매칭을 위한 도구 서명 생성
- `normalizeParameters()` - 파라미터 정규화 (null/undefined 제거)
- `sortObjectKeys()` - 파라미터 키 정렬 (서명 일관성 보장)

**기본 설정값**:
- `strategies.deduplication.enabled = true`
- `strategies.supersedeWrites.enabled = false`
- `strategies.purgeErrors.enabled = true`
- `strategies.purgeErrors.turns = 4`

**보호 대상 도구 (기본 정리 안 됨)**:
- task、todowrite、todoread、discard、extract、batch、write、edit、plan_enter、plan_exit

</details>
