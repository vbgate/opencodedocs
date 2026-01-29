---
title: "API 엔드포인트: 인증 및 요청 형식 참조 | opencode-mystatus"
sidebarTitle: "API 엔드포인트"
subtitle: "API 엔드포인트: 인증 및 요청 형식 참조"
description: "opencode-mystatus가 호출하는 API 엔드포인트를 학습합니다. OpenAI, Zhipu AI, Google Cloud, GitHub Copilot의 인증 방식과 요청 형식을 포함합니다."
tags:
  - "api"
  - "endpoints"
  - "reference"
prerequisite:
  - "appendix-data-models"
order: 2
---

# API 엔드포인트 요약

## 학습 완료 후 할 수 있는 것

- 플러그인이 호출하는 모든 공식 API 엔드포인트 이해
- 각 플랫폼의 인증 방식(OAuth / API Key) 파악
- 요청 형식 및 응답 데이터 구조 마스터
- 이러한 API를 독립적으로 호출하는 방법 알기

## API 엔드포인트란 무엇인가

API 엔드포인트(Application Programming Interface)는 프로그램 간 통신의 다리입니다. opencode-mystatus는 각 플랫폼의 공식 API 엔드포인트를 호출하여 귀하의 계정 할당량 데이터를 가져옵니다.

::: info 이러한 인터페이스를 이해하는 이유는 무엇인가?
이러한 인터페이스를 이해하면 다음을 할 수 있습니다:
1. 플러그인의 데이터 출처를 확인하여 보안성 보장
2. 플러그인을 사용할 수 없을 때 수동으로 인터페이스를 호출하여 데이터 가져오기
3. 유사한 할당량 조회 도구 구축 방법 학습
:::

## OpenAI 인터페이스

### 할당량 조회

**인터페이스 정보**:

| 항목 | 값 |
| --- | --- |
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| 메서드 | GET |
| 인증 방식 | Bearer Token (OAuth) |
| 소스 코드 위치 | `plugin/lib/openai.ts:127-155` |

**요청 헤더**:

```http
Authorization: Bearer {access_token}
User-Agent: OpenCode-Status-Plugin/1.0
ChatGPT-Account-Id: {team_account_id}  // 선택 사항, 팀 계정 필요
```

**응답 예시**:

```json
{
  "plan_type": "Plus",
  "rate_limit": {
    "limit_reached": false,
    "primary_window": {
      "used_percent": 15,
      "limit_window_seconds": 10800,
      "reset_after_seconds": 9180
    },
    "secondary_window": {
      "used_percent": 5,
      "limit_window_seconds": 86400,
      "reset_after_seconds": 82800
    }
  }
}
```

**응답 필드 설명**:

- `plan_type`: 구독 유형(Plus / Team / Pro)
- `rate_limit.primary_window`: 주 창 한도(일반적으로 3시간)
- `rate_limit.secondary_window`: 보조 창 한도(일반적으로 24시간)
- `used_percent`: 사용 비율(0-100)
- `reset_after_seconds`: 재설정까지 남은 시간(초)

---

## Zhipu AI 인터페이스

### 할당량 조회

**인터페이스 정보**:

| 항목 | 값 |
| --- | --- |
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| 메서드 | GET |
| 인증 방식 | API Key |
| 소스 코드 위치 | `plugin/lib/zhipu.ts:62-106` |

**요청 헤더**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**응답 예시**:

```json
{
  "code": 200,
  "msg": "success",
  "success": true,
  "data": {
    "limits": [
      {
        "type": "TOKENS_LIMIT",
        "usage": 10000000,
        "currentValue": 500000,
        "percentage": 5,
        "nextResetTime": 1706200000000
      },
      {
        "type": "TIME_LIMIT",
        "usage": 100,
        "currentValue": 10,
        "percentage": 10
      }
    ]
  }
}
```

**응답 필드 설명**:

- `limits[].type`: 제한 유형
  - `TOKENS_LIMIT`: 5시간 토큰 한도
  - `TIME_LIMIT`: MCP 검색 횟수(월별 할당량)
- `usage`: 총 할당량
- `currentValue`: 현재 사용량
- `percentage`: 사용 비율(0-100)
- `nextResetTime`: 다음 재설정 시간 타임스탬프(TOKENS_LIMIT에만 유효, 단위: 밀리초)

---

## Z.ai 인터페이스

### 할당량 조회

**인터페이스 정보**:

| 항목 | 값 |
| --- | --- |
| URL | `https://api.z.ai/api/monitor/usage/quota/limit` |
| 메서드 | GET |
| 인증 방식 | API Key |
| 소스 코드 위치 | `plugin/lib/zhipu.ts:64, 85-106` |

**요청 헤더**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**응답 형식**: Zhipu AI와 동일, 위 참조.

---

## Google Cloud 인터페이스

### 1. 액세스 토큰 새로 고침

**인터페이스 정보**:

| 항목 | 값 |
| --- | --- |
| URL | `https://oauth2.googleapis.com/token` |
| 메서드 | POST |
| 인증 방식 | OAuth Refresh Token |
| 소스 코드 위치 | `plugin/lib/google.ts:90, 162-184` |

**요청 헤더**:

```http
Content-Type: application/x-www-form-urlencoded
```

**요청 본문**:

```
client_id={client_id}
&client_secret={client_secret}
&refresh_token={refresh_token}
&grant_type=refresh_token
```

**응답 예시**:

```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3600
}
```

**필드 설명**:

- `access_token`: 새 액세스 토큰(유효기간 1시간)
- `expires_in`: 만료 시간(초)

---

### 2. 사용 가능한 모델 할당량 조회

**인터페이스 정보**:

| 항목 | 값 |
| --- | --- |
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| 메서드 | POST |
| 인증 방식 | Bearer Token (OAuth) |
| 소스 코드 위치 | `plugin/lib/google.ts:65, 193-213` |

**요청 헤더**:

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.9 windows/amd64
```

**요청 본문**:

```json
{
  "project": "{project_id}"
}
```

**응답 예시**:

```json
{
  "models": {
    "gemini-3-pro-high": {
      "quotaInfo": {
        "remainingFraction": 1.0,
        "resetTime": "2026-01-24T00:00:00Z"
      }
    },
    "gemini-3-pro-image": {
      "quotaInfo": {
        "remainingFraction": 0.85,
        "resetTime": "2026-01-24T00:00:00Z"
      }
    },
    "claude-opus-4-5-thinking": {
      "quotaInfo": {
        "remainingFraction": 0.0,
        "resetTime": "2026-01-25T12:00:00Z"
      }
    }
  }
}
```

**응답 필드 설명**:

- `models`: 모델 목록(키는 모델 이름)
- `quotaInfo.remainingFraction`: 남은 비율(0.0-1.0)
- `quotaInfo.resetTime`: 재설정 시간(ISO 8601 형식)

---

## GitHub Copilot 인터페이스

### 1. 공용 Billing API(권장)

**인터페이스 정보**:

| 항목 | 값 |
| --- | --- |
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| 메서드 | GET |
| 인증 방식 | Fine-grained PAT(Personal Access Token) |
| 소스 코드 위치 | `plugin/lib/copilot.ts:157-177` |

**요청 헤더**:

```http
Accept: application/vnd.github+json
Authorization: Bearer {fine_grained_pat}
X-GitHub-Api-Version: 2022-11-28
```

::: tip Fine-grained PAT란 무엇인가?
Fine-grained PAT(Fine-grained Personal Access Token)은 GitHub의 새로운 세대 토큰으로, 더 세분화된 권한 제어를 지원합니다. Copilot 할당량을 조회하려면 "Plan" 읽기 권한을 부여해야 합니다.
:::

**응답 예시**:

```json
{
  "timePeriod": {
    "year": 2026,
    "month": 1
  },
  "user": "username",
  "usageItems": [
    {
      "product": "copilot",
      "sku": "Copilot Premium Request",
      "model": "gpt-4",
      "unitType": "request",
      "grossQuantity": 229,
      "netQuantity": 229,
      "limit": 300
    },
    {
      "product": "copilot",
      "sku": "Copilot Premium Request",
      "model": "claude-3.5-sonnet",
      "unitType": "request",
      "grossQuantity": 71,
      "netQuantity": 71,
      "limit": 300
    }
  ]
}
```

**응답 필드 설명**:

- `timePeriod`: 시간 주기(년월)
- `user`: GitHub 사용자 이름
- `usageItems`: 사용 상세 목록
  - `sku`: SKU 이름(`Copilot Premium Request`는 Premium Requests를 나타냄)
  - `model`: 모델 이름
  - `grossQuantity`: 총 요청 수(할인 미적용)
  - `netQuantity`: 순 요청 수(할인 적용 후)
  - `limit`: 한도

---

### 2. 내부 할당량 API(구버전)

**인터페이스 정보**:

| 항목 | 값 |
| --- | --- |
| URL | `https://api.github.com/copilot_internal/user` |
| 메서드 | GET |
| 인증 방식 | Copilot Session Token |
| 소스 코드 위치 | `plugin/lib/copilot.ts:242-304` |

**요청 헤더**:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {copilot_session_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**응답 예시**:

```json
{
  "copilot_plan": "pro",
  "quota_reset_date": "2026-02-01",
  "quota_snapshots": {
    "premium_interactions": {
      "entitlement": 300,
      "overage_count": 0,
      "overage_permitted": true,
      "percent_remaining": 24,
      "quota_id": "premium_interactions",
      "quota_remaining": 71,
      "remaining": 71,
      "unlimited": false
    },
    "chat": {
      "entitlement": 1000,
      "percent_remaining": 50,
      "quota_remaining": 500,
      "unlimited": false
    },
    "completions": {
      "entitlement": 2000,
      "percent_remaining": 80,
      "quota_remaining": 1600,
      "unlimited": false
    }
  }
}
```

**응답 필드 설명**:

- `copilot_plan`: 구독 유형(`free` / `pro` / `pro+` / `business` / `enterprise`)
- `quota_reset_date`: 할당량 재설정 날짜(YYYY-MM-DD)
- `quota_snapshots.premium_interactions`: Premium Requests(주 할당량)
- `quota_snapshots.chat`: Chat 할당량(별도 계산 시)
- `quota_snapshots.completions`: Completions 할당량(별도 계산 시)

---

### 3. 토큰 교환 API

**인터페이스 정보**:

| 항목 | 값 |
| --- | --- |
| URL | `https://api.github.com/copilot_internal/v2/token` |
| 메서드 | POST |
| 인증 방식 | OAuth Token(OpenCode에서 가져옴) |
| 소스 코드 위치 | `plugin/lib/copilot.ts:183-208` |

**요청 헤더**:

```http
Accept: application/json
Authorization: Bearer {oauth_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**응답 예시**:

```json
{
  "token": "gho_xxx_copilot_session",
  "expires_at": 1706203600,
  "refresh_in": 3600,
  "endpoints": {
    "api": "https://api.github.com"
  }
}
```

**응답 필드 설명**:

- `token`: Copilot Session Token(내부 API 호출용)
- `expires_at`: 만료 타임스탬프(초)
- `refresh_in`: 권장 새로 고침 시간(초)

::: warning 주의
이 인터페이스는 구버전 GitHub OAuth 인증 흐름에만 적용됩니다. 새로운 OpenCode 공식 파트너 인증 흐름(2026년 1월부터)은 Fine-grained PAT를 사용해야 할 수 있습니다.
:::

---

## 인증 방식 비교

| 플랫폼 | 인증 방식 | 자격 증명 출처 | 자격 증명 파일 |
| --- | --- | --- | --- |
| **OpenAI** | OAuth Bearer Token | OpenCode OAuth | `~/.local/share/opencode/auth.json` |
| **Zhipu AI** | API Key | 사용자 수동 구성 | `~/.local/share/opencode/auth.json` |
| **Z.ai** | API Key | 사용자 수동 구성 | `~/.local/share/opencode/auth.json` |
| **Google Cloud** | OAuth Bearer Token | opencode-antigravity-auth 플러그인 | `~/.config/opencode/antigravity-accounts.json` |
| **GitHub Copilot** | Fine-grained PAT / Copilot Session Token | 사용자 수동 구성 또는 OAuth | `~/.config/opencode/copilot-quota-token.json` 또는 `~/.local/share/opencode/auth.json` |

---

## 요청 시간 초과

모든 API 요청은 10초 시간 초과 제한을 설정하여 오래 기다리지 않도록 합니다:

| 구성 | 값 | 소스 코드 위치 |
| --- | --- | --- |
| 시간 초과 시간 | 10초 | `plugin/lib/types.ts:114` |
| 시간 초과 구현 | `fetchWithTimeout` 함수 | `plugin/lib/utils.ts:84-100` |

---

## 보안성

### API Key 마스킹

플러그인은 표시 시 API Key를 자동으로 마스킹하며, 앞뒤 각 2자만 표시합니다:

```typescript
// 예시: sk-1234567890abcdef → sk-1****cdef
maskString("sk-1234567890abcdef")  // "sk-1****cdef"
```

**소스 코드 위치**: `plugin/lib/utils.ts:130-139`

### 데이터 저장

- 모든 인증 파일은 **읽기 전용**이며, 플러그인은 파일을 수정하지 않습니다
- API 응답 데이터는 **캐시되지 않고** **저장되지 않습니다**
- 민감 정보(API Key, 토큰)는 메모리에서 마스킹된 후 표시됩니다

**소스 코드 위치**:
- `plugin/mystatus.ts:35-46`(인증 파일 읽기)
- `plugin/lib/utils.ts:130-139`(마스킹 함수)

---

## 이 수업 요약

이 수업에서는 opencode-mystatus 플러그인이 호출하는 모든 공식 API 엔드포인트를 소개했습니다:

| 플랫폼 | API 수량 | 인증 방식 |
| --- | --- | --- |
| OpenAI | 1개 | OAuth Bearer Token |
| Zhipu AI | 1개 | API Key |
| Z.ai | 1개 | API Key |
| Google Cloud | 2개 | OAuth Refresh Token + Access Token |
| GitHub Copilot | 3개 | Fine-grained PAT / Copilot Session Token |

모든 인터페이스는 각 플랫폼의 공식 인터페이스로, 데이터 출처가 신뢰할 수 있고 안전합니다. 플러그인은 로컬 읽기 전용 인증 파일에서 자격 증명을 가져오며, 데이터를 업로드하지 않습니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 확인하려면 클릭</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행번호 |
| --- | --- | --- |
| OpenAI 할당량 조회 API | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L127-L155) | 127-155 |
| Zhipu AI 할당량 조회 API | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L62-L106) | 62-106 |
| Z.ai 할당량 조회 API | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L64) | 64(공통 인터페이스) |
| Google Cloud OAuth 토큰 새로 고침 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| Google Cloud 할당량 조회 API | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L193-L213) | 193-213 |
| GitHub Copilot 공용 Billing API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| GitHub Copilot 내부 할당량 API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| GitHub Copilot 토큰 교환 API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| API Key 마스킹 함수 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L139) | 130-139 |
| 요청 시간 초과 구성 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |

**핵심 상수**:

- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: OpenAI 할당량 조회 인터페이스
- `ZHIPU_QUOTA_QUERY_URL = "https://bigmodel.cn/api/monitor/usage/quota/limit"`: Zhipu AI 할당량 조회 인터페이스
- `ZAI_QUOTA_QUERY_URL = "https://api.z.ai/api/monitor/usage/quota/limit"`: Z.ai 할당량 조회 인터페이스
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`: Google Cloud 할당량 조회 인터페이스
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`: Google Cloud OAuth 토큰 새로 고침 인터페이스

**핵심 함수**:

- `fetchOpenAIUsage()`: OpenAI 할당량 API 호출
- `fetchUsage()`: Zhipu AI / Z.ai 할당량 API 호출(공통)
- `refreshAccessToken()`: Google 액세스 토큰 새로 고침
- `fetchGoogleUsage()`: Google Cloud 할당량 API 호출
- `fetchPublicBillingUsage()`: GitHub Copilot 공용 Billing API 호출
- `fetchCopilotUsage()`: GitHub Copilot 내부 할당량 API 호출
- `exchangeForCopilotToken()`: OAuth 토큰을 Copilot 세션 토큰으로 교환
- `maskString()`: API Key 마스킹

</details>
