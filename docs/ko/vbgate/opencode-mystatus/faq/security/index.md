---
title: "보안 및 개인정보 보호 | opencode-mystatus"
sidebarTitle: "보안 및 개인정보"
subtitle: "보안 및 개인정보: 로컬 파일 액세스, API 마스킹, 공용 인터페이스"
description: "opencode-mystatus의 보안 메커니즘을 학습합니다. 로컬 파일 읽기 전용, API 키 마스킹, 공용 인터페이스 호출로 개인정보를 보호합니다."
tags:
  - "보안"
  - "개인정보"
  - "FAQ"
prerequisite: []
order: 2
---

# 보안 및 개인정보: 로컬 파일 액세스, API 마스킹, 공용 인터페이스

## 현재 문제 상황

타사 도구를 사용할 때 가장 걱정하는 것은 무엇인가요?

- "내 API 키를 읽나요?"
- "내 인증 정보가 서버에 업로드되나요?"
- "데이터 유출 위험이 있나요?"
- "내 구성 파일이 수정되면 어떡하지?"

이러한 우려는 합리적입니다. 특히 민감한 AI 플랫폼 인증 정보를 처리할 때는 더욱 그렇습니다. 이 튜토리얼에서는 opencode-mystatus 플러그인이 설계를 통해 귀하의 데이터와 개인정보를 어떻게 보호하는지 상세히 설명합니다.

::: info 로컬 우선 원칙
opencode-mystatus는 「읽기 전용 로컬 파일 + 공용 API 직접 조회」 원칙을 준수하며, 모든 민감 작업이 귀하의 컴퓨터에서 완료되며, 타사 서버를 거치지 않습니다.
:::

## 핵심 개념

플러그인의 보안 설계는 세 가지 핵심 원칙을 중심으로 합니다:

1. **읽기 전용 원칙**: 로컬 인증 파일만 읽으며, 아무 내용도 기록하거나 수정하지 않음
2. **공용 인터페이스**: 각 플랫폼의 공용 API만 호출하며, 타사 서비스를 사용하지 않음
3. **데이터 마스킹**: 표시 출력 시 자동으로 민감 정보(API 키 등)를 숨김

이 세 가지 원칙은 계층적으로 중첩되어 읽기에서 표시까지 전체 프로세스가 안전합니다.

---

## 로컬 파일 액세스(읽기 전용)

### 플러그인이 읽는 파일

플러그인은 두 개의 로컬 구성 파일만 읽으며, 모두 **읽기 전용 모드**입니다:

| 파일 경로 | 용도 | 소스 코드 위치 |
| -------- | ---- | -------- |
| `~/.local/share/opencode/auth.json` | OpenCode 공용 인증 저장소 | `mystatus.ts:35` |
| `~/.config/opencode/antigravity-accounts.json` | Antigravity 플러그인 계정 저장소 | `google.ts`(읽기 로직) |

::: tip 파일 수정 안 함
소스 코드에서는 `readFile` 함수만 사용하여 파일을 읽으며, `writeFile` 또는 기타 수정 작업은 수행하지 않습니다. 즉, 플러그인은 실수로 구성을 덮어쓰지 않습니다.
:::

### 소스 코드 증거

```typescript
// mystatus.ts 38-40행
const content = await readFile(authPath, "utf-8");
authData = JSON.parse(content);
```

여기서는 Node.js의 `fs/promises.readFile`를 사용하며, 이것은 **읽기 전용 작업**입니다. 파일이 존재하지 않거나 형식이 틀린 경우, 플러그인은 파일을 생성하거나 수정하는 대신 친절한 오류 메시지를 반환합니다.

---

## API 키 자동 마스킹

### 마스킹이란 무엇인가

마스킹(Masking)은 민감 정보를 표시할 때 일부 문자만 표시하고 핵심 부분을 숨기는 것입니다.

예를 들어, 귀하의 Zhipu AI API 키는 다음과 같을 수 있습니다:
```
sk-9c89abc1234567890abcdefAQVM
```

마스킹 후에는 다음과 같이 표시됩니다:
```
sk-9c8****fAQVM
```

### 마스킹 규칙

플러그인은 `maskString` 함수를 사용하여 모든 민감 정보를 처리합니다:

```typescript
// utils.ts 130-135행
export function maskString(str: string, showChars: number = 4): string {
  if (str.length <= showChars * 2) {
    return str;
  }
  return `${str.slice(0, showChars)}****${str.slice(-showChars)}`;
}
```

**규칙 설명**:
- 기본적으로 앞 4자와 뒤 4자만 표시
- 중간 부분은 `****`로 대체
- 문자열이 너무 짧으면(≤8자), 원래대로 반환

### 실제 사용 예시

Zhipu AI 할당량 조회에서, 마스킹된 API 키가 출력에 나타납니다:

```typescript
// zhipu.ts 124행
const maskedKey = maskString(apiKey);
lines.push(`${t.account}        ${maskedKey} (${accountLabel})`);
```

출력 효과:
```
Account:        9c89****AQVM (Coding Plan)
```

::: tip 마스킹의 역할
조회 결과 스크린샷을 다른 사람과 공유하더라도 귀하의 실제 API 키가 유출되지 않습니다. 표시되는 것은 「앞뒤 4자」뿐이며, 중간 핵심 부분은 이미 숨겨져 있습니다.
:::

---

## 공용 인터페이스 호출

### 플러그인이 호출하는 API

플러그인은 각 플랫폼의 **공용 API**만 호출하며, 타사 서버를 거치지 않습니다:

| 플랫폼 | API 엔드포인트 | 용도 |
| ---- | -------- | ---- |
| OpenAI | `https://chatgpt.com/backend-api/wham/usage` | 할당량 조회 |
| Zhipu AI | `https://bigmodel.cn/api/monitor/usage/quota/limit` | 토큰 한도 조회 |
| Z.ai | `https://api.z.ai/api/monitor/usage/quota/limit` | 토큰 한도 조회 |
| GitHub Copilot | `https://api.github.com/copilot_internal/user` | 할당량 조회 |
| GitHub Copilot | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` | 공용 API 조회 |
| Google Cloud | `https://oauth2.googleapis.com/token` | OAuth 토큰 새로 고침 |
| Google Cloud | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` | 모델 할당량 조회 |

::: info 공용 API의 보안성
이러한 API 엔드포인트는 모두 각 플랫폼의 공용 인터페이스이며, HTTPS 암호화 전송을 사용합니다. 플러그인은 단순히 「클라이언트」로서 요청을 전송하며, 데이터를 저장하거나 전달하지 않습니다.
:::

### 요청 시간 초과 보호

네트워크 요청이 멈추는 것을 방지하기 위해, 플러그인은 10초 시간 초과를 설정했습니다:

```typescript
// types.ts 114행
export const REQUEST_TIMEOUT_MS = 10000;

// utils.ts 84-106행
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(t.timeoutError(Math.round(timeoutMs / 1000)));
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**시간 초과 메커니즘의 역할**:
- 네트워크 오류로 인해 플러그인이 무한 대기하는 것을 방지
- 시스템 자원 점유 방지
- 10초 시간 초과 후 자동으로 요청을 취소하고 오류 메시지 반환

---

## 개인정보 보호 요약

### 플러그인이 하지 않는 것

| 작업 | 플러그인 행동 |
| ---- | -------- |
| 데이터 저장 | ❌ 사용자 데이터 저장 안 함 |
| 데이터 업로드 | ❌ 타사 서버에 데이터 업로드 안 함 |
| 결과 캐시 | ❌ 조회 결과 캐시 안 함 |
| 파일 수정 | ❌ 로컬 구성 파일 수정 안 함 |
| 로그 기록 | ❌ 사용 로그 기록 안 함 |

### 플러그인이 하는 것

| 작업 | 플러그인 행동 |
| ---- | -------- |
| 파일 읽기 | ✅ 로컬 인증 파일 읽기 전용 |
| API 호출 | ✅ 공용 API 엔드포인트만 호출 |
| 마스킹 표시 | ✅ API 키 등 민감 정보 자동 숨김 |
| 오픈 소스 감사 | ✅ 소스 코드 전체 오픈 소스, 직접 감사 가능 |

### 소스 코드 감사 가능

플러그인의 모든 코드는 오픈 소스이므로 다음을 할 수 있습니다:
- GitHub 소스 코드 저장소 확인
- 각 API 호출의 엔드포인트 검사
- 데이터 저장 로직이 있는지 확인
- 마스킹 함수의 구현 방식 확인

---

## 일반적인 의문 사항

::: details 플러그인은 내 API 키를 훔칠까요?
아니요. 플러그인은 API 키를 사용하여 공용 API로 요청을 전송할 뿐, 타사 서버에 저장하거나 전달하지 않습니다. 모든 코드는 오픈 소스이며 직접 감사할 수 있습니다.
:::

::: details 왜 마스킹된 API 키를 표시하나요?
이것은 귀하의 개인정보를 보호하기 위함입니다. 조회 결과 스크린샷을 공유하더라도 완전한 API 키가 유출되지 않습니다. 마스킹 후에는 앞 4자와 뒤 4자만 표시되며, 중간 부분은 이미 숨겨져 있습니다.
:::

::: details 플러그인은 내 구성 파일을 수정하나요?
아니요. 플러그인은 파일을 읽기 위해서만 `readFile`을 사용하며, 쓰기 작업은 수행하지 않습니다. 구성 파일 형식이 틀린 경우, 플러그인은 파일을 수정하거나 덮어쓰는 대신 오류 메시지를 반환합니다.
:::

::: details 조회 결과가 플러그인에 캐시되나요?
아니요. 플러그인은 호출할 때마다 실시간으로 파일을 읽고 API를 조회하며, 결과를 캐시하지 않습니다. 조회 완료 후 즉시 모든 데이터를 버립니다.
:::

::: details 플러그인은 사용 데이터를 수집하나요?
아니요. 플러그인에는 추적 또는 데이터 수집 기능이 없으며, 사용자의 사용 행동을 추적하지 않습니다.
:::

---

## 이 수업 요약

- **읽기 전용 원칙**: 플러그인은 로컬 인증 파일만 읽으며, 아무 내용도 수정하지 않음
- **API 마스킹**: 출력 표시 시 API 키의 핵심 부분을 자동으로 숨김
- **공용 인터페이스**: 각 플랫폼의 공용 API만 호출하며, 타사 서비스를 사용하지 않음
- **오픈 소스 투명성**: 모든 코드는 오픈 소스이며, 보안 메커니즘을 직접 감사할 수 있음

## 다음 수업 예고

> 다음 수업에서 **[데이터 모델: 인증 파일 구조 및 API 응답 형식](/ko/vbgate/opencode-mystatus/appendix/data-models/)**를 배웁니다.
>
> 학습할 내용:
> - AuthData의 완전한 구조 정의
> - 각 플랫폼 인증 데이터의 필드 의미
> - API 응답의 데이터 형식

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 확인하려면 클릭</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행번호 |
| --- | --- | --- |
| 인증 파일 읽기 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts#L38-L40) | 38-40 |
| API 마스킹 함수 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L135) | 130-135 |
| 요청 시간 초과 구성 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |
| 요청 시간 초과 구현 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L84-L106) | 84-106 |
| Zhipu AI 마스킹 예시 | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L124) | 124 |

**핵심 함수**:
- `maskString(str, showChars = 4)`: 민감한 문자열을 마스킹하여 표시, 앞뒤 각 `showChars` 자를 표시하고 중간을 `****`로 대체

**핵심 상수**:
- `REQUEST_TIMEOUT_MS = 10000`: API 요청 시간 초과 시간(10초)

</details>
