---
title: "Invalid Grant 문제 해결: 계정 비활성화 복구 | Antigravity-Manager"
sidebarTitle: "계정이 비활성화되었을 때 복구 방법"
subtitle: "invalid_grant 및 계정 자동 비활성화: 발생 이유, 복구 방법"
description: "invalid_grant 오류의 의미와 자동 처리 논리를 학습합니다. refresh_token 무효화 후 OAuth를 통해 계정을 다시 추가하여 자동 비활성화 해제를 트리거하고 복구가 Proxy에 적용되는지 확인하세요."
tags:
  - "FAQ"
  - "오류 문제 해결"
  - "OAuth"
  - "계정 관리"
  - "invalid_grant"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
  - "advanced-scheduling"
order: 1
---
# invalid_grant 및 계정 자동 비활성화: 발생 이유, 복구 방법

## 이 과정을 통해 할 수 있는 것

- `invalid_grant`를 보았을 때 어떤 refresh_token 문제 유형인지 알 수 있음
- "계정이 갑자기 사용할 수 없게 되는 이유" 명확히 이해: 어떤 상황에서 자동으로 비활성화되는지, 비활성화 후 시스템이 어떻게 처리하는지
- 가장 짧은 경로로 계정을 복구하고 복구가 실행 중인 Proxy에 이미 적용되는지 확인

## 겪고 있는 증상

- 로컬 Proxy를 호출할 때 갑자기 실패하고 오류 메시지에 `invalid_grant`가 나타남
- 명백히 계정이 Accounts 목록에 있는데 Proxy가 계속해서 건너뜀(또는 "다시 사용되지 않는 것"처럼 느껴짐)
- 소량의 계정만 있는 경우, 한 번 `invalid_grant`를 만난 후 전체 가용성이 명백하게 나빠짐

## invalid_grant란?

**invalid_grant**는 Google OAuth가 `access_token`을 새로고침할 때 반환하는 오류 유형입니다. Antigravity Tools의 관점에서 이는 특정 계정의 `refresh_token`이 이미 취소되었거나 만료되었음을 의미하며, 계속 재시도하면 계속 실패하므로 시스템은 해당 계정을 사용할 수 없음으로 표시하고 프록시 풀에서 제거합니다.

## 핵심 원리: 시스템은 "일시적으로 건너뜀"이 아니라 "영구적으로 비활성화"함

Proxy가 토큰 새로고침 오류 문자열에 `invalid_grant`가 포함되어 있는 것을 발견하면 두 가지 작업을 수행합니다:

1. **계정을 disabled로 기록**(계정 JSON에 저장)
2. **계정을 메모리 토큰 풀에서 제거**(동일한 잘못된 계정이 반복적으로 선택되는 것을 방지)

이것이 "계정은 있는데 Proxy가 더 이상 사용하지 않음"을 보게 되는 이유입니다.

::: info disabled vs proxy_disabled

- `disabled=true`: 계정이 "완전히 비활성화"됨(전형적인 원인은 `invalid_grant`). 계정 풀을 로드할 때 직접 건너뜁니다.
- `proxy_disabled=true`: 계정이 "Proxy에 사용할 수 없음"만 의미(수동 비활성화/일괄 작업/할당량 보호 관련 논리), 의미가 다름.

이 두 가지 상태는 계정 풀 로드 시 개별적으로 판단됩니다: 먼저 `disabled`를 판단하고, 다음 할당량 보호 및 `proxy_disabled` 판단을 수행합니다.

:::

## 따라 해보세요

### 1단계: refresh_token 새로고칭으로 트리거된 invalid_grant인지 확인

**이유**: `invalid_grant`는 여러 호출 체인에서 나타날 수 있지만, 이 프로젝트의 "자동 비활성화"는 **access_token 새로고칭 실패**시에만 트리거됩니다.

Proxy 로그에서 다음과 유사한 오류 로그를 볼 수 있습니다(키워드는 `Token 새로고칭 실패` + `invalid_grant`):

```text
Token 새로고칭 실패 (<email>): <...invalid_grant...>，다음 계정 시도
Disabling account due to invalid_grant (<email>): refresh_token likely revoked/expired
```

**예상 결과**: 동일한 계정이 `invalid_grant`를 나타낸 후 곧 다시 선택되지 않음(토큰 풀에서 제거되었기 때문).

### 2단계: 계정 파일에서 disabled 필드 확인(선택 사항이지만 가장 정확함)

**이유**: 자동 비활성화는 "저장"된 것이므로 파일 내용을 확인하면 "일시적인 로테이션" 오해를 배제할 수 있습니다.

계정 파일은 애플리케이션 데이터 디렉토리의 `accounts/` 디렉토리에 위치합니다(데이터 디렉토리 위치 참조: **[첫 시작 필수: 데이터 디렉토리, 로그, 트레이 및 자동 시작](../../start/first-run-data/)**). 계정이 비활성화되면 파일에 이 세 가지 필드가 나타납니다:

```json
{
  "disabled": true,
  "disabled_at": 1700000000,
  "disabled_reason": "invalid_grant: ..."
}
```

**예상 결과**: `disabled`가 `true`이고 `disabled_reason`에 `invalid_grant:` 접두사가 포함되어 있음.

### 3단계: 계정 복구(권장 방법: 동일 계정 다시 추가)

**이유**: 이 프로젝트의 "복구"는 Proxy에서 수동으로 스위치를 켜는 것이 아니라 "명시적 토큰 업데이트"를 통해 자동 비활성화 해제를 트리거하는 것입니다.

**Accounts** 페이지로 이동하여 새 자격 증명으로 계정을 다시 추가하세요(두 가지 방법 중 하나 선택):

1. OAuth 인증 프로세스 다시 진행(참조: **[계정 추가: OAuth/Refresh Token 이중 채널 및 모범 사례](../../start/add-account/)**)
2. 새 `refresh_token`으로 다시 한 번 추가(시스템은 Google에서 반환한 이메일을 기준으로 upsert를 수행함)

시스템이 이번 upsert의 `refresh_token` 또는 `access_token`이 이전 값과 다르고, 해당 계정이 이전에 `disabled=true` 상태였음을 감지하면 자동으로 다음을 지웁니다:

- `disabled`
- `disabled_reason`
- `disabled_at`

**예상 결과**: 계정이 더 이상 disabled 상태가 아니며 (Proxy가 실행 중인 경우) 계정 풀은 자동으로 reload되어 복구가 즉시 적용됩니다.

### 4단계: 복구가 이미 Proxy에 적용되는지 확인

**이유**: 계정이 하나만 있거나 다른 계정도 사용할 수 없는 경우, 복구 후 즉시 "가용성이 돌아온 것"을 볼 수 있어야 합니다.

검증 방법:

1. 토큰 새로고침을 트리거하는 요청 보내기(예: 토큰이 만료에 가까워질 때까지 기다린 후 요청)
2. 로그에서 "disabled 계정 건너뜀" 프롬프트가 더 이상 나타나지 않는지 관찰

**예상 결과**: 요청이 정상적으로 통과하며 로그에 더 이상 해당 계정에 대한 `invalid_grant` 비활성화 프로세스가 나타나지 않습니다.

## 일반적인 문제

### ❌ disabled를 "일시적인 로테이션"으로 오해

UI에서 "계정은 있는" 것만 보면 쉽게 "시스템이 일시적으로 사용하지 않는 것"으로 오해합니다. 하지만 `disabled=true`는 디스크에 기록되며 재시작 후에도 계속 적용됩니다.

### ❌ access_token만 보충하고 refresh_token을 업데이트하지 않음

`invalid_grant`의 트리거 포인트는 `access_token` 새로고침에 사용되는 `refresh_token`입니다. 일시적으로 사용할 수 있는 `access_token`을 얻었지만 `refresh_token`은 여전히 무효라면 나중에 다시 비활성화가 트리거됩니다.

## 확인 체크리스트 ✅

- [ ] 로그에서 `invalid_grant`가 refresh_token 새로고침 실패에서 오는지 확인할 수 있음
- [ ] `disabled`와 `proxy_disabled`의 의미 차이를 알고 있음
- [ ] 계정을 다시 추가하여(OAuth 또는 refresh_token) 계정을 복구할 수 있음
- [ ] 복구가 이미 실행 중인 Proxy에 적용되는지 확인할 수 있음

## 이 과정 요약

- `invalid_grant`가 트리거되면 Proxy는 계정을 **저장된 disabled**로 만들고 토큰 풀에서 제거하여 반복 실패를 방지
- 복구의 핵심은 "명시적 토큰 업데이트"(OAuth를 다시 하거나 새 refresh_token으로 다시 한 번 추가)이며, 시스템은 자동으로 `disabled_*` 필드를 지움
- 데이터 디렉토리의 계정 JSON은 가장 권위 있는 상태 소스임(비활성화/원인/시간이 모두 포함됨)

## 다음 과정 예고

> 다음 과정에서는 **[401/인증 실패: auth_mode, Header 호환 및 클라이언트 구성 체크리스트](../auth-401/)**를 학습합니다.
>
> 배울 내용:
> - 401은 보통 "모드/Key/Header" 어느 계층 불일치인지
> - 다른 클라이언트가 어떤 인증 Header를 가져야 하는지
> - 가장 짧은 경로로 자가 검사하고 수정하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 설계 문서: invalid_grant의 문제와 변경 동작 | [`docs/proxy-invalid-grant.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-invalid-grant.md#L1-L52) | 1-52 |
| 계정 풀 로드 시 `disabled=true` 건너뜀 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L70-L158) | 70-158 |
| 토큰 새로고침 실패 시 `invalid_grant` 식별 및 계정 비활성화 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L840-L890) | 840-890 |
| `disabled/disabled_at/disabled_reason` 영구 저장 및 메모리에서 제거 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| `disabled_reason` 자르기(계정 파일 팽창 방지) | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1464-L1471) | 1464-1471 |
| upsert 시 `disabled_*` 자동 정리(토큰 변경 시 사용자가 자격 증명을 수정한 것으로 간주) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L178-L206) | 178-206 |
| 계정 다시 추가 후 자동으로 proxy accounts reload(실행 중 즉시 적용) | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L21-L59) | 21-59 |

</details>
