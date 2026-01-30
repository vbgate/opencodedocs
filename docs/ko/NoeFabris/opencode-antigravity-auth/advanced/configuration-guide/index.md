---
title: "설정 가이드: 완전한 구성 옵션 상세 설명 | Antigravity Auth"
sidebarTitle: "설정 완벽 가이드"
subtitle: "구성 옵션 완전 가이드"
description: "Antigravity Auth 플러그인의 완전한 구성 옵션을 마스터하세요. 구성 파일 위치, 모델 동작, 계정 순환 전략 및 앱 동작 설정에 대해 자세히 알아보고, 단일 계정, 다중 계정 및 병렬 프록시 시나리오에 대한 권장 구성을 제공합니다."
tags:
  - "구성"
  - "고급 구성"
  - "다중 계정"
  - "계정 순환"
prerequisite:
  - "start-quick-install"
  - "advanced-multi-account-setup"
order: 2
---

# 구성 옵션 완전 가이드

## 배우면 할 수 있는 것

- ✅ 올바른 위치에 구성 파일 생성
- ✅ 사용 사례에 맞는 구성 선택
- ✅ 모든 구성 옵션의 작동 방식과 기본값 이해
- ✅ 환경 변수를 사용하여 구성 일시적으로 재정의
- ✅ 모델 동작, 계정 순환 및 플러그인 동작 조정

## 현재의 어려움

구성 옵션이 너무 많아서 어디서부터 시작해야 할지 모르겠나요? 기본 구성은 작동하지만 더 최적화하고 싶으신가요? 다중 계정 시나리오에서 어떤 순환 전략을 사용해야 할지 모르겠나요?

## 핵심 아이디어

구성 파일은 마치 플러그인에게「사용 설명서」를 쓰는 것과 같습니다—어떻게 작동할지 알려주면 플러그인은 그 방식대로 실행합니다. Antigravity Auth 플러그인은 풍부한 구성 옵션을 제공하지만, 대부분의 사용자는 몇 가지 핵심 옵션만 구성하면 됩니다.

### 구성 파일 우선 순위

구성 항목의 우선 순위는 높은 순에서 낮은 순:

1. **환경 변수** (일시적 재정의)
2. **프로젝트 수준 구성** `.opencode/antigravity.json` (현재 프로젝트)
3. **사용자 수준 구성** `~/.config/opencode/antigravity.json` (전역)

::: info
환경 변수의 우선 순위가 가장 높아 일시적인 테스트에 적합합니다. 구성 파일은 지속적인 설정에 적합합니다.
:::

### 구성 파일 위치

운영 체제에 따라 사용자 수준 구성 파일 위치가 다릅니다:

| 시스템 | 경로 |
| --- | --- |
| Linux/macOS | `~/.config/opencode/antigravity.json` |
| Windows | `%APPDATA%\opencode\antigravity.json` |

프로젝트 수준 구성 파일은 항상 프로젝트 루트의 `.opencode/antigravity.json`에 있습니다.

### 구성 옵션 분류

구성 옵션은 네 가지로 분류됩니다:

1. **모델 동작**: 생각 블록, 세션 복구, Google Search
2. **계정 순환**: 다중 계정 관리, 선택 전략, PID 오프셋
3. **앱 동작**: 디버그 로그, 자동 업데이트, 알림 조용 모드
4. **고급 설정**: 오류 복구, 토큰 관리, 건강 점수

---

## 🎒 시작하기 전 준비 사항

- [x] 플러그인 설치 완료 ([빠른 설치](../../start/quick-install/) 참조)
- [x] 하나 이상의 Google 계정 구성
- [x] JSON 기본 문법 이해

---

## 따라하기

### 1단계: 구성 파일 생성

**이유**: 구성 파일은 플러그인이 사용자의 필요에 맞게 작동하게 합니다

운영 체제에 따라 해당 경로에서 구성 파일을 생성합니다:

::: code-group

```bash [macOS/Linux]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell [Windows]
## PowerShell 사용
$env:APPDATA\opencode\antigravity.json = @{
  '$schema' = "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
} | ConvertTo-Json -Depth 10

Set-Content -Path "$env:APPDATA\opencode\antigravity.json" -Value $json
```

:::

**예상 결과**: 파일이 성공적으로 생성되고 내용은 `$schema` 필드만 있습니다.

::: tip
`$schema` 필드를 추가하면 VS Code가 자동으로 인텔리센스 및 타입 검사를 제공합니다.
:::

### 2단계: 기본 옵션 구성

**이유**: 사용 사례에 따라 플러그인 동작을 최적화

구성에 따라 다음 중 하나를 선택하세요:

**시나리오 A: 단일 계정 + Google Search 필요**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**시나리오 B: 2-3 개 계정 + 스마트 순환**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**시나리오 C: 다중 계정 + 병렬 프록시**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**예상 결과**: 구성 파일이 성공적으로 저장되고 OpenCode가 플러그인 구성을 자동으로 다시 로드합니다.

### 3단계: 구성 검증

**이유**: 구성이 적용되었는지 확인

OpenCode에서 모델 요청을 시작하고 관찰하세요:

1. 단일 계정 `sticky` 전략 사용: 모든 요청이 동일한 계정 사용
2. 다중 계정 `hybrid` 전략 사용: 요청이 다른 계정에 스마트하게 분배됨
3. Gemini 모델 `web_search` 활성화: 필요시 모델이 웹 검색

**예상 결과**: 플러그인 동작이 구성 예상과 일치합니다.

---

## 구성 옵션 상세 설명

### 모델 동작

이 옵션은 모델의 사고 및 응답 방식에 영향을 줍니다.

#### keep_thinking

| 값 | 기본값 | 설명 |
| --- | --- | --- |
| `true` | - | Claude 생각 블록 유지, 라운드 간 일관성 유지 |
| `false` | ✓ | 생각 블록 분리, 더 안정적, 컨텍스트 작음 |

::: warning 주의
`keep_thinking` 활성화는 모델 안정성 저하 및 서명 오류를 유발할 수 있습니다. `false` 유지를 권장합니다.
:::

#### session_recovery

| 값 | 기본값 | 설명 |
| --- | --- | --- |
| `true` | ✓ | 도구 호출 중단된 세션 자동 복구 |
| `false` | - | 오류 발생시 자동 복구하지 않음 |

#### auto_resume

| 값 | 기본값 | 설명 |
| --- | --- | --- |
| `true` | - | 복구 후 자동으로 "continue" 전송 |
| `false` | ✓ | 복구 후 프롬프트만 표시, 수동 계속 |

#### resume_text

복구 시 전송할 텍스트를 사용자 정의합니다. 기본값은 `"continue"`이며, 원하는 텍스트로 변경할 수 있습니다.

#### web_search

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `default_mode` | `"off"` | `"auto"` 또는 `"off"` |
| `grounding_threshold` | `0.3` | 검색 임계값 (0=항상 검색, 1=검색 안함) |

::: info
`grounding_threshold`는 `default_mode: "auto"`일 때만 적용됩니다. 값이 클수록 모델 검색이 보수적이 됩니다.
:::

---

### 계정 순환

이 옵션은 다중 계정의 요청 분배를 관리합니다.

#### account_selection_strategy

| 전략 | 기본값 | 사용 사례 |
| --- | --- | --- |
| `sticky` | - | 단일 계정, prompt cache 유지 |
| `round-robin` | - | 4+ 계정, 처리량 최대화 |
| `hybrid` | ✓ | 2-3 계정, 스마트 순환 |

::: tip
다른 계정 수에 따른 권장 전략:
- 1개 계정 → `sticky`
- 2-3개 계정 → `hybrid`
- 4+ 계정 → `round-robin`
- 병렬 프록시 → `round-robin` + `pid_offset_enabled: true`
:::

#### switch_on_first_rate_limit

| 값 | 기본값 | 설명 |
| --- | --- | --- |
| `true` | ✓ | 첫 번째 429 즉시 계정 전환 |
| `false` | - | 먼저 현재 계정 재시도, 두 번째 429에서 전환 |

#### pid_offset_enabled

| 값 | 기본값 | 설명 |
| --- | --- | --- |
| `true` | - | 다른 세션(PID)에 다른 시작 계정 사용 |
| `false` | ✓ | 모든 세션이 동일한 계정에서 시작 |

::: tip
단일 세션 사용 시 `false`로 유지하여 Anthropic prompt cache 유지. 다중 세션 병렬 사용 시 `true` 활성화 권장.
:::

#### quota_fallback

| 값 | 기본값 | 설명 |
| --- | --- | --- |
| `true` | - | Gemini 모델 할당량 풀 fallback |
| `false` | ✓ | fallback 활성화 안함 |

::: info
Gemini 모델에만 적용. 주 할당량 풀이 소진되면 동일 계정의 대체 할당량 풀 시도.
:::

---

### 앱 동작

이 옵션은 플러그인 자체의 동작을 제어합니다.

#### quiet_mode

| 값 | 기본값 | 설명 |
| --- | --- | --- |
| `true` | - | 대부분의 toast 알림 무음(복구 알림 제외) |
| `false` | ✓ | 모든 알림 표시 |

#### debug

| 값 | 기본값 | 설명 |
| --- | --- | --- |
| `true` | - | 디버그 로그 활성화 |
| `false` | ✓ | 디버그 로그 기록 안함 |

::: tip
임시로 디버그 로그 활성화 시 구성 파일 수정 없이 환경 변수 사용:
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode   # 기본 로그
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode   # 상세 로그
```
:::

#### log_dir

사용자 정의 디버그 로그 디렉토리. 기본값은 `~/.config/opencode/antigravity-logs/`.

#### auto_update

| 값 | 기본값 | 설명 |
| --- | --- | --- |
| `true` | ✓ | 플러그인 자동 확인 및 업데이트 |
| `false` | - | 자동 업데이트 안함 |

---

### 고급 설정

이 옵션은 엣지 케이스용이며, 대부분의 사용자는 수정할 필요가 없습니다.

<details>
<summary><strong>고급 설정 펼쳐보기</strong></summary>

#### 오류 복구

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `empty_response_max_attempts` | `4` | 빈 응답 재시도 횟수 |
| `empty_response_retry_delay_ms` | `2000` | 재시도 간격(밀리초) |
| `tool_id_recovery` | `true` | 도구 ID 불일치 수정 |
| `claude_tool_hardening` | `true` | 도구 매개변수 환각 방지 |
| `max_rate_limit_wait_seconds` | `300` | 속도 제한 최대 대기 시간(0=무제한) |

#### 토큰 관리

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `proactive_token_refresh` | `true` | 만료 전 토큰 사전 갱신 |
| `proactive_refresh_buffer_seconds` | `1800` | 30분 전 갱신 |
| `proactive_refresh_check_interval_seconds` | `300` | 갱신 확인 간격(초) |

#### 서명 캐시(`keep_thinking: true`일 때 적용)

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `signature_cache.enabled` | `true` | 디스크 캐시 활성화 |
| `signature_cache.memory_ttl_seconds` | `3600` | 메모리 캐시 TTL(1시간) |
| `signature_cache.disk_ttl_seconds` | `172800` | 디스크 캐시 TTL(48시간) |
| `signature_cache.write_interval_seconds` | `60` | 백그라운드 쓰기 간격(초) |

#### 건강 점수(`hybrid` 전략 사용)

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `health_score.initial` | `70` | 초기 건강 점수 |
| `health_score.success_reward` | `1` | 성공 보상 점수 |
| `health_score.rate_limit_penalty` | `-10` | 속도 제한 페널티 점수 |
| `health_score.failure_penalty` | `-20` | 실패 페널티 점수 |
| `health_score.recovery_rate_per_hour` | `2` | 시간당 복구 점수 |
| `health_score.min_usable` | `50` | 사용 가능 계정 최저 점수 |
| `health_score.max_score` | `100` | 건강 점수 상한 |

#### Token Bucket(`hybrid` 전략 사용)

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `token_bucket.max_tokens` | `50` | 버킷 최대 용량 |
| `token_bucket.regeneration_rate_per_minute` | `6` | 분당 복구 속도 |
| `token_bucket.initial_tokens` | `50` | 초기 토큰 수 |

</details>

---

## 권장 구성 시나리오

### 단일 계정 구성

적합: Google 계정이 하나만 있는 사용자

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**구성 설명**:
- `sticky`: 순환 없음, Anthropic prompt cache 유지
- `web_search: auto`: Gemini가 필요시 검색

### 2-3 계정 구성

적합: 작은 팀 또는 일정한 탄력성이 필요한 사용자

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**구성 설명**:
- `hybrid`: 스마트 순환, 건강 점수로 최적 계정 선택
- `web_search: auto`: Gemini가 필요시 검색

### 다중 계정 + 병렬 프록시 구성

적합: 여러 동시 에이전트를 실행하는 사용자

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**구성 설명**:
- `round-robin`: 매 요청마다 계정 순환
- `switch_on_first_rate_limit: true`: 첫 번째 429 즉시 전환
- `pid_offset_enabled: true`: 다른 세션이 다른 시작 계정 사용
- `web_search: auto`: Gemini가 필요시 검색

---

## 함정 경고

### ❌ 오류: 구성 수정 후 적용되지 않음

**원인**: OpenCode가 구성 파일을 다시 로드하지 않았을 수 있습니다.

**해결책**: OpenCode를 다시 시작하거나 JSON 문법이 올바른지 확인하세요.

### ❌ 오류: 구성 파일 JSON 형식 오류

**원인**: JSON 문법 오류 (쉼표 누락, 불필요한 쉼표, 주석 등).

**해결책**: JSON 검증 도구를 사용하거나 `$schema` 필드를 추가하여 IDE 인텔리센스를 활성화하세요.

### ❌ 오류: 환경 변수가 적용되지 않음

**원인**: 환경 변수 이름 오타 또는 OpenCode를 다시 시작하지 않음.

**해결책**: 변수 이름이 `OPENCODE_ANTIGRAVITY_*`인지 확인 (전부 대문자, 올바른 접두사), OpenCode를 다시 시작하세요.

### ❌ 오류: `keep_thinking: true` 활성화 후 빈번한 오류

**원인**: 생각 블록 서명 불일치.

**해결책**: `keep_thinking: false` (기본값) 유지 또는 `signature_cache` 구성 조정.

---

## 본 강의 요약

구성 파일 위치 우선 순위: 환경 변수 > 프로젝트 수준 > 사용자 수준.

핵심 구성 항목:
- 모델 동작: `keep_thinking`, `session_recovery`, `web_search`
- 계정 순환: `account_selection_strategy`, `pid_offset_enabled`
- 앱 동작: `debug`, `quiet_mode`, `auto_update`

다른 시나리오 권장 구성:
- 단일 계정: `sticky`
- 2-3 계정: `hybrid`
- 4+ 계정: `round-robin`
- 병렬 프록시: `round-robin` + `pid_offset_enabled: true`

---

## 다음 강의 예고

> 다음 강의에서는 **[디버그 로깅](../debug-logging/)**을 배웁니다.
>
> 배울 내용:
> - 디버그 로그를 활성화하는 방법
> - 로그 내용을 해석하는 방법
> - 일반적인 문제를 해결하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 줄 번호 |
| --- | --- | --- |
| 구성 Schema 정의 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 12-323 |
| 기본 구성 값 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 325-373 |
| 구성 로드 로직 | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 1-100 |

**핵심 상수**:
- `DEFAULT_CONFIG`: 모든 구성 항목의 기본값

**핵심 타입**:
- `AntigravityConfig`: 구성 객체 타입
- `AccountSelectionStrategy`: 계정 선택 전략 타입
- `SignatureCacheConfig`: 서명 캐시 구성 타입

</details>
