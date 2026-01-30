---
title: "베스트 프랙티스: 구성 최적화 | opencode-dynamic-context-pruning"
subtitle: "베스트 프랙티스: 구성 최적화"
sidebarTitle: "토큰 40% 절약"
description: "DCP 베스트 프랙티스 구성 방법을 학습하세요. 전략 선택, 턴 보호, 도구 보호 및 알림 모드 구성을 마스터하고 토큰 사용을 최적화하세요."
tags:
  - "베스트 프랙티스"
  - "토큰 절약"
  - "구성"
  - "최적화"
prerequisite:
  - "/ko/Opencode-DCP/opencode-dynamic-context-pruning/start/configuration"
  - "/ko/Opencode-DCP/opencode-dynamic-context-pruning/platforms/auto-pruning"
order: 2
---

# DCP 베스트 프랙티스

## 학습 후 할 수 있는 것

- Prompt Caching과 토큰 절약의 트레이드오프 이해
- 상황에 맞는 보호 전략 선택 (턴 보호, 보호 도구, 파일 모드)
- 명령어로 토큰 사용 수동 최적화
- 프로젝트 요구사항에 맞는 DCP 구성 사용자 정의

## Prompt Caching 트레이드오프

### 캐싱과 프루닝의 트레이드오프 이해

DCP가 도구 출력을 프루닝할 때 메시지 내용이 변경되어, **정확한 접두사 일치**를 기반으로 하는 Prompt Caching이 해당 지점부터 유효하지 않게 됩니다.

**테스트 데이터 비교**:

| 시나리오           | 캐시 적중률 | 토큰 절약 | 종합 수익 |
|--- | --- | --- | ---|
| DCP 없음         | ~85%      | 0%        | 기준선   |
| DCP 활성화       | ~65%      | 20-40%    | ✅ 순수익 |

### 캐시 손실을 무시해야 할 때

**DCP 사용을 권장하는 시나리오**:

- ✅ **긴 대화** (20라운드 초과): 컨텍스트 팽창이 뚜렷하며, 토큰 절약이 캐시 손실을 훨씬 상회함
- ✅ **요청별 과금** 서비스: GitHub Copilot, Google Antigravity 등 캐시 손실의 부정적 영향 없음
- ✅ **집중적인 도구 호출**: 빈번한 파일 읽기, 검색 실행 등 시나리오
- ✅ **코드 리팩토링 작업**: 동일 파일을 반복해서 읽는 시나리오가 빈번함

**DCP 비활성화 고려 시나리오**:

- ⚠️ **짧은 대화** (< 10라운드): 프루닝 수익이 제한적이며, 캐시 손실이 더 뚜렷할 수 있음
- ⚠️ **캐시 민감형 작업**: 캐시 적중률을 최대화해야 하는 시나리오 (배치 작업 등)

::: tip 유연한 구성
프로젝트 요구사항에 따라 DCP 구성을 동적으로 조정할 수 있으며, 심지어 프로젝트 수준 구성에서 특정 전략을 비활성화할 수도 있습니다.
:::

---

## 구성 우선순위 베스트 프랙티스

### 다중 계층 구성의 올바른 사용

DCP 구성은 다음 우선순위로 병합됩니다:

```
기본값 < 전역 구성 < 사용자 정의 구성 디렉토리 < 프로젝트 구성
```

::: info 구성 디렉토리 설명
"사용자 정의 구성 디렉토리"는 `$OPENCODE_CONFIG_DIR` 환경 변수를 설정하여 지정하는 디렉토리입니다. 해당 디렉토리에는 `dcp.jsonc` 또는 `dcp.json` 파일이 있어야 합니다.
:::

### 권장 구성 전략

| 시나리오             | 권장 구성 위치 | 예제 구성 초점                     |
|--- | --- | ---|
| **개인 개발 환경**   | 전역 구성    | 자동 전략 활성화, 디버그 로그 비활성화          |
| **팀 협업 프로젝트**   | 프로젝트 구성    | 프로젝트별 보호 파일, 전략 스위치         |
| **CI/CD 환경**   | 사용자 정의 구성 디렉토리  | 알림 비활성화, 디버그 로그 활성화             |
| **임시 디버깅**       | 프로젝트 구성    | `debug` 활성화, 상세 알림 모드           |

**예제: 프로젝트 수준 구성 오버라이드**

```jsonc
// ~/.config/opencode/dcp.jsonc（전역 구성）
{
    "enabled": true,
    "strategies": {
        "deduplication": {
            "enabled": true
        }
    }
}
```

```jsonc
// .opencode/dcp.jsonc（프로젝트 구성）
{
    "strategies": {
        // 프로젝트 수준 오버라이드: 중복 제거 비활성화 (프로젝트에서 히스토리 컨텍스트 보존 필요 시)
        "deduplication": {
            "enabled": false
        }
    }
}
```

::: warning 구성 수정 후 재시작
구성을 수정한 후에는 OpenCode를 재시작해야 적용됩니다.
:::

---

## 보호 전략 선택

### 턴 보호의 사용 시나리오

**턴 보호** (Turn Protection)는 지정된 턴 수 내에서 도구가 프루닝되는 것을 방지하여, AI가 최신 내용을 충분히 참조할 수 있도록 합니다.

**권장 설정**:

| 시나리오                   | 권장 값    | 이유                     |
|--- | --- | ---|
| **복잡한 문제 해결**       | 4-6 턴 | AI가 도구 출력을 여러 번 반복 분석해야 함      |
| **코드 리팩토링**           | 2-3 턴 | 컨텍스트 전환이 빠르며, 보호 기간이 너무 길면 효과에 영향    |
| **빠른 프로토타이핑**       | 2-4 턴 | 보호와 토큰 절약의 균형        |
| **기본 구성**           | 4 턴    | 테스트를 거친 균형점              |

**턴 보호 활성화 시기**:

```jsonc
{
    "turnProtection": {
        "enabled": true,   // 턴 보호 활성화
        "turns": 6        // 6턴 보호 (복잡한 작업에 적합)
    }
}
```

**비활성화 추천 시점**:

- 단순한 질의응답 시나리오 (AI가 직접 답변, 도구 불필요)
- 고빈도 짧은 대화 (보호 기간이 너무 길면 프루닝이 지연됨)

### 보호 도구 구성

**기본 보호 도구** (추가 구성 불필요):
- `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

::: warning Schema 기본값 설명
IDE의 자동 완성 기능을 사용하는 경우, Schema 파일(`dcp.schema.json`)의 기본 보호 도구 목록이 불완전하게 표시될 수 있습니다. 실제로는 소스 코드에 정의된 `DEFAULT_PROTECTED_TOOLS`를 따르며, 총 10개 도구가 포함됩니다.
:::

**추가 보호 도구 추가 시기**:

| 시나리오                   | 예제 구성                              | 이유                     |
|--- | --- | ---|
| **핵심 비즈니스 도구**       | `protectedTools: ["critical_tool"]` | 핵심 작업이 항상 표시되도록 보장            |
| **히스토리 컨텍스트가 필요한 도구** | `protectedTools: ["analyze_history"]` | 분석을 위한 완전한 히스토리 보존            |
| **사용자 정의 작업 도구**     | `protectedTools: ["custom_task"]` | 사용자 정의 작업 워크플로우 보호            |

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_analyze"]  // 특정 도구 추가 보호
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["important_check"]  // LLM 도구 추가 보호
        }
    }
}
```

### 보호 파일 패턴의 사용

**권장 보호 패턴**:

| 파일 타입             | 권장 패턴                     | 보호 이유                 |
|--- | --- | ---|
| **구성 파일**           | `"*.env"`, `".env*"`        | 민감 정보가 프루닝되어 손실되는 것 방지          |
| **데이터베이스 구성**          | `"**/config/database/*"`    | 데이터베이스 연결 구성이 항상 사용 가능하도록 보장        |
| **비밀키 파일**           | `"**/secrets/**"`          | 모든 비밀키와 인증서 보호            |
| **핵심 비즈니스 로직**        | `"src/core/*"`            | 핵심 코드 컨텍스트 손실 방지          |

```jsonc
{
    "protectedFilePatterns": [
        "*.env",                // 모든 환경 변수 파일 보호
        ".env.*",              // .env.local 등 포함
        "**/secrets/**",       // secrets 디렉토리 보호
        "**/config/*.json",    // 구성 파일 보호
        "src/auth/**"          // 인증 관련 코드 보호
    ]
}
```

::: tip 패턴 매칭 규칙
`protectedFilePatterns`는 도구 매개변수의 `filePath` 필드를 매칭합니다 (예: `read`, `write`, `edit` 도구).
:::

---

## 자동 전략 선택

### 중복 제거 전략 (Deduplication)

**기본적으로 활성화**, 대부분의 시나리오에 적합합니다.

**적용 시나리오**:
- 동일 파일을 반복해서 읽는 경우 (코드 리뷰, 다중 라운드 디버깅)
- 동일한 검색 또는 분석 명령 실행

**비활성화 추천 시점**:
- 각 호출의 정확한 출력을 보존해야 하는 경우 (성능 모니터링)
- 도구 출력에 타임스탬프나 랜덤 값이 포함된 경우 (호출할 때마다 다름)

### 덮어쓰기 전략 (Supersede Writes)

**기본적으로 비활성화**, 프로젝트 요구사항에 따라 활성화 여부 결정.

**활성화 권장 시나리오**:
- 파일 수정 후 즉시 읽어 검증 (리팩토링, 배치 처리)
- 쓰기 작업 출력이 커서, 읽기 후 가치가 덮어씌어짐

```jsonc
{
    "strategies": {
        "supersedeWrites": {
            "enabled": true  // 덮어쓰기 전략 활성화
        }
    }
}
```

**비활성화 추천 시점**:
- 파일 수정 히스토리를 추적해야 하는 경우 (코드 감사)
- 쓰기 작업에 중요한 메타데이터가 포함된 경우 (변경 사유 등)

### 오류 제거 전략 (Purge Errors)

**기본적으로 활성화**, 활성화 상태 유지를 권장합니다.

**구성 제안**:

| 시나리오                   | 권장 값  | 이유                     |
|--- | --- | ---|
| **기본 구성**           | 4 턴 | 테스트를 거친 균형점              |
| **빠른 실패 시나리오**       | 2 턴 | 오류 입력을 조기에 정리하여 컨텍스트 오염 감소       |
| **오류 히스토리 필요**       | 6-8 턴 | 디버깅을 위해 더 많은 오류 정보 보존          |

```jsonc
{
    "strategies": {
        "purgeErrors": {
            "enabled": true,
            "turns": 2  // 빠른 실패 시나리오: 2턴 후 오류 입력 정리
        }
    }
}
```

---

## LLM 기반 도구의 최적 사용

### 알림 기능 최적화

DCP는 기본적으로 도구 호출 10회마다 AI에게 프루닝 도구를 사용하도록 알립니다.

**권장 구성**:

| 시나리오                   | nudgeFrequency | 효과 설명                |
|--- | --- | ---|
| **집중적인 도구 호출**       | 8-12          | AI가 제때 정리하도록 알림            |
| **저빈도 도구 호출**       | 15-20         | 알림 간섭 감소              |
| **알림 비활성화**           | Infinity      | AI의 자율 판단에 완전히 의존         |

```jsonc
{
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 15  // 저빈도 시나리오: 15회 도구 호출 후 알림
        }
    }
}
```

### Extract 도구 사용

**Extract 사용 시점**:
- 도구 출력에 핵심 발견이나 데이터가 포함되어 있어 요약을 보존해야 할 때
- 원본 출력이 크지만, 추출된 정보만으로도 후속 추론에 충분할 때

**구성 제안**:

```jsonc
{
    "tools": {
        "extract": {
            "enabled": true,
            "showDistillation": false  // 기본적으로 추출 내용 표시 안 함 (간섭 감소)
        }
    }
}
```

**`showDistillation` 활성화 시점**:
- AI가 어떤 핵심 정보를 추출했는지 확인해야 할 때
- Extract 도구 동작을 디버깅하거나 검증할 때

### Discard 도구 사용

**Discard 사용 시점**:
- 도구 출력이 일시적인 상태이거나 노이즈일 때
- 작업 완료 후 도구 출력을 보존할 필요가 없을 때

**구성 제안**:

```jsonc
{
    "tools": {
        "discard": {
            "enabled": true
        }
    }
}
```

---

## 명령어 사용 팁

### `/dcp context` 사용 시기

**사용 권장 시나리오**:
- 토큰 사용량이 이상하다고 의심될 때
- 현재 세션의 컨텍스트 분포를 알고 싶을 때
- DCP의 프루닝 효과를 평가할 때

**베스트 프랙티스**:
- 긴 대화 중간에 한 번 확인하여 컨텍스트 구성 이해
- 대화 종료 시 확인하여 총 토큰 소모량 확인

### `/dcp stats` 사용 시기

**사용 권장 시나리오**:
- 장기적인 토큰 절약 효과를 알고 싶을 때
- DCP의 전체 가치를 평가할 때
- 다른 구성의 절약 효과를 비교할 때

**베스트 프랙티스**:
- 주 1회 누적 통계 확인
- 구성 최적화 전후 효과 비교

### `/dcp sweep` 사용 시기

**사용 권장 시나리오**:
- 컨텍스트가 너무 커서 응답이 느려질 때
- 토큰 소모를 즉시 줄여야 할 때
- 자동 전략이 프루닝을 트리거하지 않을 때

**사용 팁**:

| 명령              | 용도               |
|--- | ---|
| `/dcp sweep`      | 마지막 사용자 메시지 이후의 모든 도구 프루닝 |
| `/dcp sweep 10`   | 마지막 10개 도구만 프루닝      |
| `/dcp sweep 5`    | 마지막 5개 도구만 프루닝       |

**권장 워크플로우**:
1. 먼저 `/dcp context`로 현재 상태 확인
2. 상황에 따라 프루닝 수량 결정
3. `/dcp sweep N`으로 프루닝 실행
4. 다시 `/dcp context`로 효과 확인

---

## 알림 모드 선택

### 세 가지 알림 모드 비교

| 모드       | 표시 내용                          | 적용 시나리오             |
|--- | --- | ---|
| **off**   | 알림 표시 안 함                       | 간섭이 없는 작업 환경      |
| **minimal** | 프루닝 수량과 토큰 절약만 표시             | 효과는 알고 싶으나 세부 사항은 필요 없음    |
| **detailed** | 프루닝된 각 도구와 이유 표시 (기본값)          | 디버깅이나 상세 모니터링이 필요한 시나리오   |

### 권장 구성

| 시나리오             | 권장 모드   | 이유               |
|--- | --- | ---|
| **일상 개발**       | minimal | 효과에 집중, 간섭 감소        |
| **문제 디버깅**       | detailed | 각 프루닝 작업의 이유 확인      |
| **데모 또는 데모 녹화**  | off     | 알림이 데모 플로우를 방해하는 것 방지       |

```jsonc
{
    "pruneNotification": "minimal"  // 일상 개발에 권장
}
```

---

## 하위 에이전트 시나리오 처리

### 하위 에이전트 제한 이해

**DCP는 하위 에이전트 세션에서 완전히 비활성화됩니다**.

**이유**:
- 하위 에이전트의 목표는 간결한 발견 요약을 반환하는 것
- DCP의 프루닝이 하위 에이전트의 요약 동작을 방해할 수 있음
- 하위 에이전트는 보통 실행 시간이 짧고 컨텍스트 팽창이 제한적임

### 하위 에이전트 세션 여부 판단 방법

1. **디버그 로그 활성화**:
    ```jsonc
    {
        "debug": true
    }
    ```

2. **로그 확인**:
    로그에 `isSubAgent: true` 표시가 나타납니다

### 하위 에이전트의 토큰 최적화 제안

DCP는 하위 에이전트에서 비활성화되지만, 여전히 다음 작업을 수행할 수 있습니다:

- 하위 에이전트의 프롬프트를 최적화하여 출력 길이 감소
- 하위 에이전트의 도구 호출 범위 제한
- `task` 도구의 `max_length` 매개변수로 출력 제어

---

## 이 강좌 요약

| 베스트 프랙티스 영역       | 핵심 제안                          |
|--- | ---|
| **Prompt Caching**  | 긴 대화에서 토큰 절약이 보통 캐시 손실을 상회함          |
| **구성 우선순위**      | 전역 구성은 일반 설정용, 프로젝트 구성은 특정 요구사항용         |
| **턴 보호**       | 복잡한 작업 4-6턴, 빠른 작업 2-3턴         |
| **보호 도구**     | 기본 보호로 충분하며, 필요시 핵심 비즈니스 도구 추가             |
| **보호 파일**     | 구성, 비밀키, 핵심 비즈니스 로직 파일 보호               |
| **자동 전략**       | 중복 제거와 오류 제거는 기본 활성화, 덮어쓰기는 필요에 따라 활성화           |
| **LLM 도구**     | 알림 빈도 10-15회, 디버깅 시 Extract 추출 내용 표시    |
| **명령어 사용**     | 정기적으로 컨텍스트 확인, 필요에 따라 수동 프루닝                |
| **알림 모드**       | 일상 개발에는 minimal, 디버깅에는 detailed       |

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능         | 파일 경로                                                                                              | 행 번호        |
|--- | --- | ---|
| 구성 병합      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L691-794)    | 691-794     |
| 구성 검증      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375)    | 147-375     |
| 기본 구성      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-134)     | 68-134      |
| 턴 보호      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L432-437)   | 432-437     |
| 보호 도구     | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79)     | 68-79       |
| 보호 파일 패턴   | [`protected-file-patterns.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/protected-file-patterns.ts#L1-60) | 1-60        |
| 하위 에이전트 감지     | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8)      | 1-8         |
| 알림 기능      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-441)   | 438-441     |

**핵심 상수**:
- `MAX_TOOL_CACHE_SIZE = 1000`: 도구 캐시 최대 항목 수
- `turnProtection.turns`: 기본 4턴 보호

**핵심 함수**:
- `getConfig()`: 다중 계층 구성 로드 및 병합
- `validateConfigTypes()`: 구성 항목 유형 검증
- `mergeConfig()`: 우선순위에 따른 구성 병합
- `isSubAgentSession()`: 하위 에이전트 세션 감지

</details>
