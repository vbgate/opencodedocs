---
title: "전체 설정 옵션: 30개 이상의 매개변수 상세 설명 | Antigravity Auth"
sidebarTitle: "30개 이상의 매개변수 커스터마이징"
subtitle: "Antigravity Auth 설정 옵션 완전 참조 매뉴얼"
description: "Antigravity Auth 플러그인의 30개 이상의 설정 옵션을 학습합니다. 일반 설정, 세션 복구, 계정 선택 전략, 속도 제한, 토큰 갱신 등 설정 항목의 기본값과 모범 사례를 다룹니다."
tags:
  - "설정 참조"
  - "고급 설정"
  - "완전 매뉴얼"
  - "Antigravity"
  - "OpenCode"
prerequisite:
  - "quick-install"
order: 1
---

# Antigravity Auth 설정 옵션 완전 참조 매뉴얼

## 학습 목표

- Antigravity Auth 플러그인의 모든 설정 옵션을 찾고 수정할 수 있습니다
- 각 설정 항목의 역할과 적용 시나리오를 이해합니다
- 사용 시나리오에 따라 최적의 설정 조합을 선택합니다
- 환경 변수를 통해 설정 파일 값을 재정의합니다

## 핵심 개념

Antigravity Auth 플러그인은 설정 파일을 통해 거의 모든 동작을 제어합니다: 로그 레벨부터 계정 선택 전략, 세션 복구부터 토큰 갱신 메커니즘까지.

::: info 설정 파일 위치 (우선순위 높은 순)
1. **프로젝트 설정**: `.opencode/antigravity.json`
2. **사용자 설정**:
   - Linux/Mac: `~/.config/opencode/antigravity.json`
   - Windows: `%APPDATA%\opencode\antigravity.json`
:::

::: tip 환경 변수 우선순위
모든 설정 항목은 환경 변수로 재정의할 수 있으며, 환경 변수의 우선순위가 설정 파일보다 **높습니다**.
:::

## 설정 개요

| 분류 | 설정 항목 수 | 핵심 시나리오 |
| --- | --- | --- |
| 일반 설정 | 3 | 로그, 디버그 모드 |
| 사고 블록 | 1 | 사고 과정 보존 |
| 세션 복구 | 3 | 오류 자동 복구 |
| 서명 캐시 | 4 | 사고 블록 서명 영속화 |
| 빈 응답 재시도 | 2 | 빈 응답 처리 |
| 도구 ID 복구 | 1 | 도구 매칭 |
| 도구 환각 방지 | 1 | 매개변수 오류 방지 |
| 토큰 갱신 | 3 | 사전 갱신 메커니즘 |
| 속도 제한 | 5 | 계정 순환 및 대기 |
| 건강 점수 | 7 | Hybrid 전략 점수 |
| 토큰 버킷 | 3 | Hybrid 전략 토큰 |
| 자동 업데이트 | 1 | 플러그인 자동 업데이트 |
| 웹 검색 | 2 | Gemini 검색 |

---

## 일반 설정

### `quiet_mode`

**타입**: `boolean`  
**기본값**: `false`  
**환경 변수**: `OPENCODE_ANTIGRAVITY_QUIET=1`

대부분의 토스트 알림(속도 제한, 계정 전환 등)을 억제합니다. 복구 알림(세션 복구 성공)은 항상 표시됩니다.

**적용 시나리오**:
- 다중 계정 고빈도 사용 시나리오에서 잦은 알림 방해 방지
- 자동화 스크립트 또는 백그라운드 서비스 사용

**예시**:
```json
{
  "quiet_mode": true
}
```

### `debug`

**타입**: `boolean`  
**기본값**: `false`  
**환경 변수**: `OPENCODE_ANTIGRAVITY_DEBUG=1`

파일에 디버그 로그를 활성화합니다. 로그 파일은 기본적으로 `~/.config/opencode/antigravity-logs/`에 저장됩니다.

**적용 시나리오**:
- 문제 해결 시 활성화
- 버그 리포트 제출 시 상세 로그 제공

::: danger 디버그 로그에 민감한 정보가 포함될 수 있음
로그 파일에는 API 응답, 계정 인덱스 등의 정보가 포함되어 있으므로 제출 전 민감 정보를 제거하세요.
:::

### `log_dir`

**타입**: `string`  
**기본값**: OS별 설정 디렉토리 + `/antigravity-logs`  
**환경 변수**: `OPENCODE_ANTIGRAVITY_LOG_DIR=/path/to/logs`

디버그 로그 저장 디렉토리를 사용자 정의합니다.

**적용 시나리오**:
- 로그를 특정 위치(예: 네트워크 공유 디렉토리)에 저장해야 하는 경우
- 로그 순환 및 아카이브 스크립트

---

## 사고 블록 설정

### `keep_thinking`

**타입**: `boolean`  
**기본값**: `false`  
**환경 변수**: `OPENCODE_ANTIGRAVITY_KEEP_THINKING=1`

::: warning 실험적 기능
Claude 모델의 사고 블록을 보존합니다(서명 캐시를 통해).

**동작 설명**:
- `false`(기본값): 사고 블록을 제거하여 서명 오류를 방지하고 안정성 우선
- `true`: 사고 블록을 포함한 전체 컨텍스트를 보존하지만 서명 오류가 발생할 수 있음

**적용 시나리오**:
- 모델의 전체 추론 과정을 확인해야 하는 경우
- 대화에서 사고 내용을 자주 사용하는 경우

**비권장 시나리오**:
- 프로덕션 환경(안정성 우선)
- 다중 턴 대화(서명 충돌이 발생하기 쉬움)

::: tip `signature_cache`와 함께 사용
`keep_thinking`을 활성화할 때 `signature_cache`도 함께 설정하여 서명 적중률을 높이는 것이 좋습니다.
:::

---

## 세션 복구

### `session_recovery`

**타입**: `boolean`  
**기본값**: `true`

`tool_result_missing` 오류에서 세션을 자동으로 복구합니다. 활성화하면 복구 가능한 오류 발생 시 토스트 알림이 표시됩니다.

**복구되는 오류 유형**:
- `tool_result_missing`: 도구 결과 누락(ESC 중단, 타임아웃, 크래시)
- `Expected thinking but found text`: 사고 블록 순서 오류

**적용 시나리오**:
- 도구를 사용하는 모든 시나리오(기본적으로 활성화 권장)
- 장시간 대화 또는 도구 실행이 빈번한 경우

### `auto_resume`

**타입**: `boolean`  
**기본값**: `false`

세션 복구를 위해 "continue" 프롬프트를 자동으로 전송합니다. `session_recovery`가 활성화된 경우에만 작동합니다.

**동작 설명**:
- `false`: 토스트 알림만 표시하고 사용자가 수동으로 "continue"를 전송해야 함
- `true`: 자동으로 "continue"를 전송하여 세션 계속

**적용 시나리오**:
- 자동화 스크립트 또는 무인 시나리오
- 완전 자동화된 복구 프로세스를 원하는 경우

**비권장 시나리오**:
- 복구 결과를 수동으로 확인해야 하는 경우
- 도구 실행 중단 후 상태를 확인한 후 계속해야 하는 경우

### `resume_text`

**타입**: `string`  
**기본값**: `"continue"`

자동 복구 시 전송할 사용자 정의 텍스트입니다. `auto_resume`이 활성화된 경우에만 사용됩니다.

**적용 시나리오**:
- 다국어 환경(예: "계속", "계속해 주세요"로 변경)
- 추가 프롬프트가 필요한 시나리오

**예시**:
```json
{
  "auto_resume": true,
  "resume_text": "이전 작업을 계속 완료해 주세요"
}
```

---

## 서명 캐시

> `keep_thinking`이 활성화된 경우에만 작동

### `signature_cache.enabled`

**타입**: `boolean`  
**기본값**: `true`

사고 블록 서명의 디스크 캐시를 활성화합니다.

**역할**: 서명을 캐시하면 다중 턴 대화에서 중복 서명으로 인한 오류를 방지할 수 있습니다.

### `signature_cache.memory_ttl_seconds`

**타입**: `number`(범위: 60-86400)  
**기본값**: `3600`(1시간)

메모리 캐시의 만료 시간(초)입니다.

### `signature_cache.disk_ttl_seconds`

**타입**: `number`(범위: 3600-604800)  
**기본값**: `172800`(48시간)

디스크 캐시의 만료 시간(초)입니다.

### `signature_cache.write_interval_seconds`

**타입**: `number`(범위: 10-600)  
**기본값**: `60`

백그라운드에서 디스크에 쓰는 간격 시간(초)입니다.

**예시**:
```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  }
}
```

---

## 빈 응답 재시도

Antigravity가 빈 응답(candidates/choices 없음)을 반환할 때 자동으로 재시도합니다.

### `empty_response_max_attempts`

**타입**: `number`(범위: 1-10)  
**기본값**: `4`

최대 재시도 횟수입니다.

### `empty_response_retry_delay_ms`

**타입**: `number`(범위: 500-10000)  
**기본값**: `2000`(2초)

각 재시도 사이의 지연 시간(밀리초)입니다.

**적용 시나리오**:
- 네트워크가 불안정한 환경(재시도 횟수 증가)
- 빠른 실패가 필요한 경우(재시도 횟수 및 지연 감소)

---

## 도구 ID 복구

### `tool_id_recovery`

**타입**: `boolean`  
**기본값**: `true`

도구 ID 고아 복구를 활성화합니다. 도구 응답의 ID가 일치하지 않을 때(컨텍스트 압축으로 인해) 함수 이름 매칭 또는 플레이스홀더 생성을 시도합니다.

**역할**: 다중 턴 대화에서 도구 호출의 안정성을 향상시킵니다.

**적용 시나리오**:
- 긴 대화 시나리오(활성화 권장)
- 도구를 자주 사용하는 시나리오

---

## 도구 환각 방지

### `claude_tool_hardening`

**타입**: `boolean`  
**기본값**: `true`

Claude 모델에 대한 도구 환각 방지를 활성화합니다. 활성화하면 자동으로 주입됩니다:
- 도구 설명에 매개변수 서명
- 엄격한 도구 사용 규칙 시스템 지시

**역할**: Claude가 실제 스키마의 매개변수 이름 대신 학습 데이터의 매개변수 이름을 사용하는 것을 방지합니다.

**적용 시나리오**:
- MCP 플러그인 또는 사용자 정의 도구 사용(활성화 권장)
- 도구 스키마가 복잡한 경우

**비권장 시나리오**:
- 도구 호출이 스키마를 완전히 준수하는 것이 확인된 경우(추가 프롬프트를 줄이기 위해 비활성화 가능)

---

## 사전 토큰 갱신

### `proactive_token_refresh`

**타입**: `boolean`  
**기본값**: `true`

사전 백그라운드 토큰 갱신을 활성화합니다. 활성화하면 토큰이 만료되기 전에 자동으로 갱신되어 요청이 토큰 갱신으로 인해 차단되지 않습니다.

**역할**: 토큰 갱신 대기로 인한 요청 지연을 방지합니다.

### `proactive_refresh_buffer_seconds`

**타입**: `number`(범위: 60-7200)  
**기본값**: `1800`(30분)

토큰 만료 전 사전 갱신을 트리거하는 시간(초)입니다.

### `proactive_refresh_check_interval_seconds`

**타입**: `number`(범위: 30-1800)  
**기본값**: `300`(5분)

사전 갱신 확인 간격 시간(초)입니다.

**적용 시나리오**:
- 고빈도 요청 시나리오(사전 갱신 활성화 권장)
- 갱신 실패 위험을 줄이고 싶은 경우(버퍼 시간 증가)

---

## 속도 제한 및 계정 선택

### `max_rate_limit_wait_seconds`

**타입**: `number`(범위: 0-3600)  
**기본값**: `300`(5분)

모든 계정이 속도 제한될 때 최대 대기 시간(초)입니다. 모든 계정의 최소 대기 시간이 이 임계값을 초과하면 플러그인은 중단되지 않고 빠르게 실패합니다.

**0으로 설정**: 타임아웃을 비활성화하고 무기한 대기합니다.

**적용 시나리오**:
- 빠른 실패가 필요한 시나리오(대기 시간 감소)
- 긴 대기 시간을 허용할 수 있는 시나리오(대기 시간 증가)

### `quota_fallback`

**타입**: `boolean`  
**기본값**: `false`

Gemini 모델에 대한 쿼터 폴백을 활성화합니다. 선호하는 쿼터 풀(Gemini CLI 또는 Antigravity)이 소진되면 동일 계정의 대체 쿼터 풀을 시도합니다.

**적용 시나리오**:
- Gemini 모델 고빈도 사용(활성화 권장)
- 각 계정의 쿼터 활용률을 최대화하고 싶은 경우

::: tip 쿼터 접미사를 명시적으로 지정하지 않은 경우에만 작동
모델 이름에 `:antigravity` 또는 `:gemini-cli`가 명시적으로 포함된 경우 항상 지정된 쿼터 풀을 사용하며 폴백하지 않습니다.
:::

### `account_selection_strategy`

**타입**: `string`(열거형: `sticky`, `round-robin`, `hybrid`)  
**기본값**: `"hybrid"`  
**환경 변수**: `OPENCODE_ANTIGRAVITY_ACCOUNT_SELECTION_STRATEGY`

계정 선택 전략입니다.

| 전략 | 설명 | 적용 시나리오 |
| --- | --- | --- |
| `sticky` | 속도 제한될 때까지 동일 계정 사용, 프롬프트 캐시 유지 | 단일 세션, 캐시 민감 시나리오 |
| `round-robin` | 매 요청마다 다음 계정으로 순환, 처리량 최대화 | 다중 계정 고처리량 시나리오 |
| `hybrid` | 건강 점수 + 토큰 버킷 + LRU 기반 결정적 선택 | 일반 권장, 성능과 안정성 균형 |

::: info 상세 설명
[계정 선택 전략](/ko/NoeFabris/opencode-antigravity-auth/advanced/account-selection-strategies/) 장을 참조하세요.
:::

### `pid_offset_enabled`

**타입**: `boolean`  
**기본값**: `false`  
**환경 변수**: `OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1`

PID 기반 계정 오프셋을 활성화합니다. 활성화하면 서로 다른 세션(PID)이 서로 다른 시작 계정을 우선 선택하여 여러 병렬 에이전트 실행 시 부하를 분산하는 데 도움이 됩니다.

**동작 설명**:
- `false`(기본값): 모든 세션이 동일한 계정 인덱스에서 시작, Anthropic 프롬프트 캐시 유지(단일 세션 사용 권장)
- `true`: PID에 따라 시작 계정 오프셋, 부하 분산(다중 세션 병렬 사용 권장)

**적용 시나리오**:
- 여러 병렬 OpenCode 세션 실행
- 서브 에이전트 또는 병렬 작업 사용

### `switch_on_first_rate_limit`

**타입**: `boolean`  
**기본값**: `true`

첫 번째 속도 제한 시 즉시 계정 전환(1초 지연 후)합니다. 비활성화하면 먼저 동일 계정을 재시도하고 두 번째 속도 제한 시 전환합니다.

**적용 시나리오**:
- 빠른 계정 전환을 원하는 경우(활성화 권장)
- 단일 계정 쿼터를 최대화하고 싶은 경우(비활성화)

---

## 건강 점수 (Hybrid 전략)

> `account_selection_strategy`가 `hybrid`인 경우에만 작동

### `health_score.initial`

**타입**: `number`(범위: 0-100)  
**기본값**: `70`

계정의 초기 건강 점수입니다.

### `health_score.success_reward`

**타입**: `number`(범위: 0-10)  
**기본값**: `1`

성공적인 요청마다 증가하는 건강 점수입니다.

### `health_score.rate_limit_penalty`

**타입**: `number`(범위: -50-0)  
**기본값**: `-10`

속도 제한마다 차감되는 건강 점수입니다.

### `health_score.failure_penalty`

**타입**: `number`(범위: -100-0)  
**기본값**: `-20`

실패마다 차감되는 건강 점수입니다.

### `health_score.recovery_rate_per_hour`

**타입**: `number`(범위: 0-20)  
**기본값**: `2`

시간당 회복되는 건강 점수입니다.

### `health_score.min_usable`

**타입**: `number`(범위: 0-100)  
**기본값**: `50`

계정을 사용할 수 있는 최소 건강 점수 임계값입니다.

### `health_score.max_score`

**타입**: `number`(범위: 50-100)  
**기본값**: `100`

건강 점수 상한입니다.

**적용 시나리오**:
- 기본 설정은 대부분의 시나리오에 적합
- 고빈도 속도 제한 환경에서는 `rate_limit_penalty`를 낮추거나 `recovery_rate_per_hour`를 높일 수 있음
- 더 빠른 계정 전환이 필요하면 `min_usable`을 낮출 수 있음

**예시**:
```json
{
  "account_selection_strategy": "hybrid",
  "health_score": {
    "initial": 80,
    "success_reward": 2,
    "rate_limit_penalty": -5,
    "failure_penalty": -15,
    "recovery_rate_per_hour": 5,
    "min_usable": 40,
    "max_score": 100
  }
}
```

---

## 토큰 버킷 (Hybrid 전략)

> `account_selection_strategy`가 `hybrid`인 경우에만 작동

### `token_bucket.max_tokens`

**타입**: `number`(범위: 1-1000)  
**기본값**: `50`

토큰 버킷의 최대 용량입니다.

### `token_bucket.regeneration_rate_per_minute`

**타입**: `number`(범위: 0.1-60)  
**기본값**: `6`

분당 생성되는 토큰 수입니다.

### `token_bucket.initial_tokens`

**타입**: `number`(범위: 1-1000)  
**기본값**: `50`

계정 초기 토큰 수입니다.

**적용 시나리오**:
- 고빈도 요청 시나리오에서는 `max_tokens`와 `regeneration_rate_per_minute`를 높일 수 있음
- 더 빠른 계정 순환을 원하면 `initial_tokens`를 낮출 수 있음

---

## 자동 업데이트

### `auto_update`

**타입**: `boolean`  
**기본값**: `true`

플러그인 자동 업데이트를 활성화합니다.

**적용 시나리오**:
- 최신 기능을 자동으로 받고 싶은 경우(활성화 권장)
- 고정 버전이 필요한 경우(비활성화)

---

## 웹 검색 (Gemini Grounding)

### `web_search.default_mode`

**타입**: `string`(열거형: `auto`, `off`)  
**기본값**: `"off"`

웹 검색의 기본 모드(variant로 지정하지 않은 경우)입니다.

| 모드 | 설명 |
| --- | --- |
| `auto` | 모델이 검색 시점을 결정(동적 검색) |
| `off` | 기본적으로 검색 비활성화 |

### `web_search.grounding_threshold`

**타입**: `number`(범위: 0-1)  
**기본값**: `0.3`

동적 검색 임계값(0.0~1.0)입니다. 값이 높을수록 모델의 검색 빈도가 낮아집니다(검색을 트리거하려면 더 높은 신뢰도가 필요). `auto` 모드에서만 작동합니다.

**적용 시나리오**:
- 불필요한 검색 줄이기(임계값 높이기, 예: 0.5)
- 모델이 더 많이 검색하도록 유도(임계값 낮추기, 예: 0.2)

**예시**:
```json
{
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.4
  }
}
```

---

## 설정 예시

### 단일 계정 기본 설정

```json
{
  "quiet_mode": false,
  "debug": false,
  "keep_thinking": false,
  "session_recovery": true,
  "auto_resume": false,
  "account_selection_strategy": "sticky"
}
```

### 다중 계정 고성능 설정

```json
{
  "quiet_mode": true,
  "debug": false,
  "session_recovery": true,
  "auto_resume": true,
  "account_selection_strategy": "hybrid",
  "quota_fallback": true,
  "switch_on_first_rate_limit": true,
  "max_rate_limit_wait_seconds": 120,
  "health_score": {
    "initial": 70,
    "min_usable": 40
  },
  "token_bucket": {
    "max_tokens": 100,
    "regeneration_rate_per_minute": 10
  }
}
```

### 디버그 및 진단 설정

```json
{
  "debug": true,
  "log_dir": "/tmp/antigravity-logs",
  "quiet_mode": false,
  "session_recovery": true,
  "auto_resume": true,
  "tool_id_recovery": true
}
```

### 사고 블록 보존 설정

```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  },
  "session_recovery": true
}
```

---

## 자주 묻는 질문

### Q: 특정 설정을 임시로 비활성화하려면?

**A**: 환경 변수로 재정의하면 설정 파일을 수정할 필요가 없습니다.

```bash
# 임시로 디버그 모드 활성화
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode

# 임시로 조용한 모드 활성화
OPENCODE_ANTIGRAVITY_QUIET=1 opencode
```

### Q: 설정 파일 수정 후 OpenCode를 재시작해야 하나요?

**A**: 네, 설정 파일은 OpenCode 시작 시 로드되므로 수정 후 재시작이 필요합니다.

### Q: 설정이 적용되었는지 어떻게 확인하나요?

**A**: `debug` 모드를 활성화하고 로그 파일에서 설정 로드 정보를 확인하세요.

```json
{
  "debug": true
}
```

로그에 로드된 설정이 표시됩니다:
```
[config] Loaded configuration: {...}
```

### Q: 가장 자주 조정해야 하는 설정 항목은?

**A**:
- `account_selection_strategy`: 다중 계정 시나리오에서 적절한 전략 선택
- `quiet_mode`: 알림 방해 줄이기
- `session_recovery` / `auto_resume`: 세션 복구 동작 제어
- `debug`: 문제 해결 시 활성화

### Q: 설정 파일에 JSON Schema 검증이 있나요?

**A**: 네, 설정 파일에 `$schema` 필드를 추가하면 IDE 자동 완성 및 검증을 활성화할 수 있습니다:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  ...
}
```

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| 설정 Schema 정의 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 1-373 |
| JSON Schema | [`assets/antigravity.schema.json`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/assets/antigravity.schema.json) | 1-157 |
| 설정 로드 | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | - |

**주요 상수**:
- `DEFAULT_CONFIG`: 기본 설정 객체(`schema.ts:328-372`)

**주요 타입**:
- `AntigravityConfig`: 메인 설정 타입(`schema.ts:322`)
- `SignatureCacheConfig`: 서명 캐시 설정 타입(`schema.ts:323`)
- `AccountSelectionStrategy`: 계정 선택 전략 타입(`schema.ts:22`)

</details>
