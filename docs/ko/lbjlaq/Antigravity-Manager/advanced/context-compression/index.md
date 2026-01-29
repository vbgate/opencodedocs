---
title: "컨텍스트 압축: 안정적인 긴 세션 | Antigravity-Manager"
sidebarTitle: "긴 세션이 충돌하지 않게"
subtitle: "컨텍스트 압축: 안정적인 긴 세션"
description: "Antigravity의 세 레이어 컨텍스트 압축 메커니즘을 학습합니다. 툴 라운드 트리밍, Thinking 압축, 서명 캐시를 통해 400 오류와 Prompt가 너무 긴 실패를 줄입니다."
tags:
  - "컨텍스트 압축"
  - "서명 캐시"
  - "Thinking"
  - "Tool Result"
  - "안정성"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-monitoring"
order: 8
---

# 긴 세션 안정성: 컨텍스트 압축, 서명 캐시 및 툴 결과 압축

Claude Code / Cherry Studio 같은 클라이언트로 긴 세션을 실행할 때, 가장 성가신 것은 모델이 충분히 똑똑하지 않은 것이 아니라, 대화가 진행되다가 갑자기 오류를 시작하는 것입니다: `Prompt is too long`, 400 서명 오류, 툴 호출 체인 끊김, 또는 툴 루프가 갈수록 느려집니다.

이 수업에서는 Antigravity Tools가 이 문제들을 위해 한 세 가지 일을 명확히 설명합니다: 컨텍스트 압축(세 레이어 단계적으로 개입), 서명 캐시(Thinking의 서명 체인을 이어줌), 툴 결과 압축(툴 출력이 컨텍스트를 터뜨리지 않도록 함).

## 이 수업을 마치면 할 수 있는 것

- 세 레이어 점진적 컨텍스트 압축이 각각 무엇을 하는지, 각각의 비용이 무엇인지 명확히 설명할 수 있습니다
- 서명 캐시가 무엇을 저장하는지(Tool/Family/Session 세 레이어)와 2시간 TTL의 영향을 알 수 있습니다
- 툴 결과 압축 규칙을 이해합니다: 언제 base64 이미지를 버리고, 언제 브라우저 스냅샷을 머리+꼬리 요약으로 변환하는지
- 필요할 때 `proxy.experimental`의 임계값 스위치로 압축 트리거 타이밍을 조절할 수 있습니다

## 현재의 문제점

- 긴 대화 후 갑자기 400이 시작됩니다: 서명이 만료된 것처럼 보이지만, 서명이 어디서 오는지, 어디서 잃어버리는지 모릅니다
- 툴 호출이 점점 많아지고, 역사적 tool_result가 업스트림에서 직접 거부되거나(아주 느려짐)
- 압축으로 구원하고 싶지만, Prompt Cache를 깨트리거나, 일관성에 영향을 주거나, 모델이 정보를 잃는 것을 걱정합니다

## 언제 이 방법을 사용해야 할까요?

- 긴 체인 툴 작업을 실행할 때(검색/파일 읽기/브라우저 스냅샷/다중 라운드 툴 루프)
- Thinking 모델로 복잡한 추론을 하고 있고, 세션이 자주 수십 라운드를 초과할 때
- 클라이언트에서 재현 가능하지만 왜인지 설명할 수 없는 안정성 문제를 해결할 때

## 컨텍스트 압축이란 무엇인가요?

**컨텍스트 압축**은 프록시가 컨텍스트 압력이 너무 높다고 감지했을 때, 역사 메시지에 대해 수행하는 자동 노이즈 감소와 슬림화입니다: 먼저 오래된 툴 라운드를 자르고, 그 다음 오래된 Thinking 텍스트를 플레이스홀더로 압축하지만 서명은 유지하고, 마지막으로 극단적인 경우 XML 요약을 생성하고 새 세션을 Fork하여 대화를 계속함으로써, `Prompt is too long`과 서명 체인 단절로 인한 실패를 줄입니다.

::: info 컨텍스트 압력은 어떻게 계산되나요?
Claude 프로세서는 `ContextManager::estimate_token_usage()`으로 가벼운 추정을 하고, `estimation_calibrator`로 보정한 다음, `usage_ratio = estimated_usage / context_limit`으로 압력 퍼센트를 얻습니다(로그에 raw/calibrated 값이 인쇄됨).
:::

## 🎒 시작 전 준비

- 이미 로컬 프록시를 실행했고, 클라이언트가 실제로 `/v1/messages` 체인을 거치고 있습니다(로컬 리버스 프록시 시작 및 첫 번째 클라이언트 연결 참조)
- 프록시 로그를 볼 수 있습니다(개발자 디버깅 또는 로컬 로그 파일). 리포지토리의 테스트 계획은 예제 로그 경로와 grep 방법을 제공합니다(`docs/testing/context_compression_test_plan.md` 참조)

::: tip Proxy Monitor와 함께 사용하면 더 잘 찾을 수 있습니다
압축 트리거를 어떤 요청/어떤 계정/어떤 라운드 툴 호출에 대응시키려면, Proxy Monitor를 동시에 여는 것이 좋습니다.
:::

## 핵심 아이디어

이 안정성 설계는 역사를 모두 지우는 것이 아니라, 비용이 낮은 것에서 높은 것으로 단계적으로 개입합니다:

| 레이어 | 트리거 지점(구성 가능) | 하는 일 | 비용/부작용 |
| --- | --- | --- | --- |
| Layer 1 | `proxy.experimental.context_compression_threshold_l1`(기본값 0.4) | 툴 라운드를 식별하고, 최근 N 라운드(코드에서는 5)만 유지하며, 더 오래된 tool_use/tool_result 쌍을 삭제함 | 남은 메시지 내용을 수정하지 않아 Prompt Cache에 더 친화적 |
| Layer 2 | `proxy.experimental.context_compression_threshold_l2`(기본값 0.55) | 오래된 Thinking 텍스트를 `"..."`로 압축하지만 `signature`는 유지하고, 최근 4개 메시지는 보호함 | 역사 내용을 수정하며, 주석에서 명시적으로 cache를 깬다고 하지만, 서명 체인을 보호할 수 있음 |
| Layer 3 | `proxy.experimental.context_compression_threshold_l3`(기본값 0.7) | 백그라운드 모델을 호출하여 XML 요약을 생성한 다음, 새 메시지 시퀀스를 Fork하여 대화를 계속함 | 백그라운드 모델 호출에 의존함; 실패하면 400을 반환함(친절한 프롬프트 있음) |

다음으로 세 레이어를 나누어 설명하면서, 서명 캐시와 툴 결과 압축도 함께 설명합니다.

### Layer 1: 툴 라운드 트리밍(Trim Tool Messages)

Layer 1의 핵심 포인트는 툴 상호작용 전체 라운드만 삭제하여, 반쪽 삭제로 인한 컨텍스트 불일치를 피하는 것입니다.

- 한 라운드 툴 상호작용 식별 규칙은 `identify_tool_rounds()`에 있습니다: `assistant`에서 `tool_use`가 나타나면 한 라운드가 시작되고, 후속 `user`에서 `tool_result`가 나타나도 여전히 이 라운드로 계산하며, 일반 user 텍스트를 만날 때까지 이 라운드가 끝납니다.
- 실제로 트리밍을 실행하는 것은 `ContextManager::trim_tool_messages(&mut messages, 5)`입니다: 역사 툴 라운드가 5 라운드를 초과하면, 더 오래된 라운드에 관련된 메시지를 삭제합니다.

### Layer 2: Thinking 압축하지만 서명 유지

많은 400 문제는 Thinking이 너무 긴 것이 아니라, Thinking의 서명 체인이 끊어진 것입니다. Layer 2의 전략은 다음과 같습니다:

- `assistant` 메시지의 `ContentBlock::Thinking { thinking, signature, .. }`만 처리합니다
- `signature.is_some()`이고 `thinking.len() > 10`일 때만 압축하며, `thinking`을 직접 `"..."`로 변경합니다
- 최근 `protected_last_n = 4`개 메시지는 압축하지 않습니다(대략 최근 2 라운드 user/assistant)

이렇게 하면 많은 토큰을 절약할 수 있지만, 여전히 `signature`를 역사에 남겨두어, 툴 체인이 서명을 채워야 할 때 복구할 수 있게 합니다.

### Layer 3: Fork + XML 요약(극단적兜底)

압력이 계속 높아질 때, Claude 프로세서는 세션을 다시 열지만 핵심 정보를 잃지 않으려고 시도합니다:

1. 원래 메시지에서 마지막 유효한 Thinking 서명을 추출합니다(`ContextManager::extract_last_valid_signature()`)
2. 전체 역사 + `CONTEXT_SUMMARY_PROMPT`를 XML 요약을 생성하는 요청으로 이어 붙이고, 모델을 `BACKGROUND_MODEL_LITE`(현재 코드는 `gemini-2.5-flash`)로 고정합니다
3. 요약에 `<latest_thinking_signature>`을 포함하도록 요구하여, 후속 서명 체인 연속에 사용합니다
4. 새 메시지 시퀀스를 Fork합니다:
   - `User: Context has been compressed... + XML summary`
   - `Assistant: I have reviewed...`
   - 원래 요청의 마지막 user 메시지를 첨부합니다(만약 그것이 방금의 요약 명령이 아니라면)

Fork + 요약이 실패하면, `StatusCode::BAD_REQUEST`를 직접 반환하고, `/compact`나 `/clear` 같은 방법으로 수동으로 처리하라고 알려줍니다(프로세서가 반환하는 error JSON 참조).

### 사이드 라인 1: 세 레이어 서명 캐시(Tool / Family / Session)

서명 캐시는 컨텍스트 압축의 퓨즈입니다, 특히 클라이언트가 서명 필드를 트리밍/버릴 때 더욱 그렇습니다.

- TTL: `SIGNATURE_TTL = 2 * 60 * 60`(2시간)
- Layer 1: `tool_use_id -> signature`(툴 체인 복구)
- Layer 2: `signature -> model family`(크로스 모델 호환성 체크, Claude 서명이 Gemini 패밀리 모델로 가는 것을 방지)
- Layer 3: `session_id -> latest signature`(세션 레벨 격리, 다른 대화 오염 방지)

이 세 레이어 캐시는 Claude SSE 스트리밍 파싱과 요청 변환 시 쓰기/읽기됩니다:

- 스트리밍 파싱에서 thinking의 `signature`를 만나면 Session Cache(및 캐시 패밀리)에 씁니다
- 스트리밍 파싱에서 tool_use의 `signature`를 만나면 Tool Cache + Session Cache에 씁니다
- Claude 툴 호출을 Gemini `functionCall`으로 변환할 때, Session Cache나 Tool Cache에서 우선적으로 서명을 채워넣습니다

### 사이드 라인 2: 툴 결과 압축(Tool Result Compressor)

툴 결과는 채팅 텍스트보다 컨텍스트를 터뜨리기 쉬우므로, 요청 변환 단계에서 tool_result에 대해 예측 가능한 삭제를 수행합니다.

핵심 규칙(모두 `tool_result_compressor.rs`에 있음):

- 총 문자 상한: `MAX_TOOL_RESULT_CHARS = 200_000`
- base64 이미지 블록은 직접 제거(프롬프트 텍스트를 추가)
- 출력이 파일에 저장되었다는 프롬프트를 감지하면, 핵심 정보를 추출하고 `[tool_result omitted ...]`로 플레이스홀더
- 브라우저 스냅샷(`page snapshot` / `ref=` 등 특징 포함)을 감지하면, 머리+꼬리 요약으로 변경하고, 생략된 문자 수를 표시
- 입력이 HTML 같으면, `<style>`/`<script>`/base64 조각을 먼저 제거한 다음 트렁케이션을 수행

## 따라해 보세요

### 1단계: 압축 임계값 확인(및 기본값)

**왜 필요한가요?**
압축 트리거 지점은 하드코딩된 것이 아니라, `proxy.experimental.*`에서 옵니다. 현재 임계값을 먼저 알아야, 왜 이렇게 일찍/늦게 개입하는지 판단할 수 있습니다.

기본값(Rust 측 `ExperimentalConfig::default()`):

```json
{
  "proxy": {
    "experimental": {
      "enable_signature_cache": true,
      "enable_tool_loop_recovery": true,
      "enable_cross_model_checks": true,
      "enable_usage_scaling": true,
      "context_compression_threshold_l1": 0.4,
      "context_compression_threshold_l2": 0.55,
      "context_compression_threshold_l3": 0.7
    }
  }
}
```

**보아야 할 것**: 설정에 `proxy.experimental`가 있고(필드 이름은 위와 일치), 임계값이 `0.x` 같은 비율 값입니다.

::: warning 설정 파일 위치는 이 수업에서 반복하지 않음
설정 파일의 저장 위치와 수정 후 재시작이 필요한지 여부는 설정 관리 범주입니다. 이 튜토리얼 시스템에 따라, 우선 설정 완벽 가이드: AppConfig/ProxyConfig, 저장 위치 및 핫 리로드 의미를 기준으로 합니다.
:::

### 2단계: 로그로 Layer 1/2/3 트리거 여부 확인

**왜 필요한가요?**
이 세 레이어는 모두 프록시 내부 동작이므로, 가장 신뢰할 수 있는 검증 방법은 로그에 `[Layer-1]` / `[Layer-2]` / `[Layer-3]`이 나타나는지 보는 것입니다.

리포지토리의 테스트 계획은 예제 명령을 제공합니다(머신의 실제 로그 경로로 필요에 따라 조정):

```bash
tail -f ~/Library/Application\ Support/com.antigravity.tools/logs/antigravity.log | grep -E "Layer-[123]"
```

**보아야 할 것**: 압력이 높아질 때, 로그에 `Tool trimming triggered`, `Thinking compression triggered`, `Fork successful` 같은 기록이 나타납니다(구체적인 필드는 로그 원문을 기준으로 함).

### 3단계: 정화와 압축의 차이 이해(기대를 혼동하지 말기)

**왜 필요한가요?**
일부 문제(예: Thinking을 지원하지 않는 모델로 강제 다운그레이드)는 압축이 아니라 정화가 필요합니다. 정화는 Thinking block을 직접 삭제합니다; 압축은 서명 체인을 유지합니다.

Claude 프로세서에서, 백그라운드 작업 다운그레이드는 `ContextManager::purify_history(..., PurificationStrategy::Aggressive)`를 거치며, 이것은 역사 Thinking block을 직접 제거합니다.

**보아야 할 것**: 두 가지 동작을 구별할 수 있습니다:

- 정화는 Thinking block을 삭제합니다
- Layer 2 압축은 오래된 Thinking 텍스트를 `"..."`로 교체하지만, 서명은 여전히 있습니다

### 4단계: 400 서명 오류를 만났을 때, 먼저 Session Cache 적중 여부 확인

**왜 필요한가요?**
많은 400의 근본 원인은 서명이 없는 것이 아니라, 서명이 메시지를 따라가지 않는 것입니다. 요청 변환 시 Session Cache에서 우선적으로 서명을 채웁니다.

단서(요청 변환 단계의 로그는 SESSION/TOOL cache에서 서명을 복구한다고 알려줌):

- `[Claude-Request] Recovered signature from SESSION cache ...`
- `[Claude-Request] Recovered signature from TOOL cache ...`

**보아야 할 것**: 클라이언트가 서명을 버리지만 프록시 캐시가 여전히 있을 때, 로그에 Recovered signature from ... cache 기록이 나타납니다.

### 5단계: 툴 결과 압축이 무엇을 잃는지 이해

**왜 필요한가요?**
툴이 대용량 HTML / 브라우저 스냅샷 / base64 이미지를 대화에 다시 넣게 하면, 프록시가 자동으로 삭제합니다. 어떤 내용이 플레이스홀더로 교체될지 미리 알아야, 모델이 못 본 것으로 오해하지 않습니다.

세 가지만 기억하세요:

1. base64 이미지는 제거됩니다(프롬프트 텍스트로 변경)
2. 브라우저 스냅샷은 머리/꼬리 요약이 됩니다(생략된 문자 수 포함)
3. 200,000 문자를 초과하면 트렁케이션되고 `...[truncated ...]` 프롬프트가 추가됩니다

**보아야 할 것**: `tool_result_compressor.rs`에서 이 규칙들은 모두 명확한 상수와 분기로 되어 있으며, 경험으로 삭제하는 것이 아닙니다.

## 체크포인트

- L1/L2/L3의 트리거 지점이 `proxy.experimental.context_compression_threshold_*`에서 온다는 것을 말할 수 있고, 기본값은 `0.4/0.55/0.7`입니다
- 왜 Layer 2가 cache를 깬다고 설명할 수 있습니다: 역사 thinking 텍스트 내용을 수정하기 때문입니다
- 왜 Layer 3을 Fork라고 하는지 설명할 수 있습니다: 대화를 XML 요약 + 확인 + 최신 user 메시지의 새 시퀀스로 만들기 때문입니다
- 툴 결과 압축이 base64 이미지를 삭제하고, 브라우저 스냅샷을 머리/꼬리 요약으로 만든다고 설명할 수 있습니다

## 일반적인 실수

| 현상 | 가능한 원인 | 할 수 있는 것 |
| --- | --- | --- |
| Layer 2 트리거 후 컨텍스트가 덜 안정해 보임 | Layer 2는 역사 내용을 수정하며, 주석에서 명시적으로 cache를 깬다고 함 | Prompt Cache 일관성에 의존한다면, L1이 먼저 문제를 해결하게 하거나, L2 임계값을 높임 |
| Layer 3 트리거 후 직접 400 반환 | Fork + 요약 백그라운드 모델 호출 실패(네트워크/계정/업스트림 오류 등) | 먼저 error JSON의 제안에 따라 `/compact`나 `/clear` 사용; 동시에 백그라운드 모델 호출 체인 확인 |
| 툴 출력에서 이미지/대용량 내용이 사라짐 | tool_result는 base64 이미지를 제거하고, 초장 출력을 트렁케이션함 | 중요한 내용을 로컬 파일/링크에 저장한 다음 참조; 10만 행 텍스트를 대화에 직접 넣는 것을 기대하지 마세요 |
| 명확히 Gemini 모델인데 Claude 서명을 가져와서 오류 | 서명이 크로스 모델에 호환되지 않음(코드에 family 체크 있음) | 서명 소스 확인; 필요시 프록시가 retry 시나리오에서 역사 서명을 제거하게 함(요청 변환 로직 참조) |

## 이 수업 요약

- 세 레이어 압축의 핵심은 비용으로 분류하는 것: 먼저 오래된 툴 라운드를 삭제하고, 다음 오래된 Thinking을 압축하고, 마지막으로 Fork + XML 요약
- 서명 캐시는 툴 체인이 계속되도록 하는 핵심: Session/Tool/Family 세 레이어가 각각 한 유형의 문제를 관리하며, TTL은 2시간입니다
- 툴 결과 압축은 툴 출력이 컨텍스트를 터뜨리지 않도록 하는 하드 제한: 200,000 문자 상한 + 스냅샷/대용량 파일 프롬프트 특화

## 다음 수업 예고

> 다음 수업에서는 시스템 능력을 이야기합니다: 다국어/테마/업데이트/시작 자동 시작/HTTP API Server.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| 실험적 설정: 압축 임계값과 스위치 기본값 | `src-tauri/src/proxy/config.rs` | 119-168 |
| 컨텍스트 추정: 다국어 문자 추정 + 15% 여유 | `src-tauri/src/proxy/mappers/context_manager.rs` | 9-37 |
| 토큰 사용량 추정: system/messages/tools/thinking 순회 | `src-tauri/src/proxy/mappers/context_manager.rs` | 103-198 |
| Layer 1: 툴 라운드 식별 + 오래된 라운드 트리밍 | `src-tauri/src/proxy/mappers/context_manager.rs` | 311-439 |
| Layer 2: Thinking 압축하지만 서명 유지(최근 N개 보호) | `src-tauri/src/proxy/mappers/context_manager.rs` | 200-271 |
| Layer 3 보조: 마지막 유효한 서명 추출 | `src-tauri/src/proxy/mappers/context_manager.rs` | 73-109 |
| 백그라운드 작업 다운그레이드: Aggressive Thinking block 정화 | `src-tauri/src/proxy/handlers/claude.rs` | 540-583 |
| 세 레이어 압축 메인 플로우: 추정, 보정, 임계값에 따라 L1/L2/L3 트리거 | `src-tauri/src/proxy/handlers/claude.rs` | 379-731 |
| Layer 3: XML 요약 + Fork 세션 구현 | `src-tauri/src/proxy/handlers/claude.rs` | 1560-1687 |
| 서명 캐시: TTL/세 레이어 캐시 구조(Tool/Family/Session) | `src-tauri/src/proxy/signature_cache.rs` | 5-88 |
| 서명 캐시: Session 서명 쓰기/읽기 | `src-tauri/src/proxy/signature_cache.rs` | 141-223 |
| SSE 스트리밍 파싱: thinking/tool의 서명을 Session/Tool cache에 캐시 | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 766-776 |
| SSE 스트리밍 파싱: tool_use 캐시 tool_use_id -> signature | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 958-975 |
| 요청 변환: tool_use 우선 Session/Tool cache에서 서명 복구 | `src-tauri/src/proxy/mappers/claude/request.rs` | 1045-1142 |
| 요청 변환: tool_result 트리거 툴 결과 압축 | `src-tauri/src/proxy/mappers/claude/request.rs` | 1159-1225 |
| 툴 결과 압축: 입구 `compact_tool_result_text()` | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 28-69 |
| 툴 결과 압축: 브라우저 스냅샷 머리/꼬리 요약 | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 123-178 |
| 툴 결과 압축: base64 이미지 제거 + 총 문자 상한 | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 247-320 |
| 테스트 계획: 세 레이어 압축 트리거와 로그 검증 | `docs/testing/context_compression_test_plan.md` | 1-116 |

</details>
