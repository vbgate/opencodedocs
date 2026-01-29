---
title: "데이터 모델: 인증 파일 및 API 응답 형식 | opencode-mystatus"
sidebarTitle: "데이터 모델"
subtitle: "데이터 모델: 인증 파일 구조 및 API 응답 형식"
description: "opencode-mystatus의 인증 파일 구조와 API 응답 형식을 이해합니다. 3개 인증 파일과 5개 플랫폼의 데이터 모델을 상세히 설명합니다."
tags:
  - "데이터 모델"
  - "인증 파일"
  - "API 응답"
prerequisite:
  - "start-quick-start"
order: 1
---

# 데이터 모델: 인증 파일 구조 및 API 응답 형식

> 💡 **이 부록은 개발자용입니다**: 플러그인이 인증 파일을 읽고 파싱하는 방법을 이해하거나 새 플랫폼 지원을 확장하고 싶다면 완전한 데이터 모델 참조가 여기에 있습니다.

## 학습 완료 후 할 수 있는 것

- 플러그인이 어떤 인증 파일을 읽는지 이해
- 각 플랫폼 API 응답 형식 파악
- 새 플랫폼 지원으로 플러그인 확장 방법 알기

## 이 부록 내용

- 인증 파일 구조(3개 구성 파일)
- API 응답 형식(5개 플랫폼)
- 내부 데이터 유형

---

## 인증 파일 구조

### 메인 인증 파일: `~/.local/share/opencode/auth.json`

OpenCode 공식 인증 저장소로, 플러그인은 여기서 OpenAI, Zhipu AI, Z.ai, GitHub Copilot 인증 정보를 읽습니다.

```typescript
interface AuthData {
  /** OpenAI OAuth 인증 */
  openai?: OpenAIAuthData;

  /** Zhipu AI API 인증 */
  "zhipuai-coding-plan"?: ZhipuAuthData;

  /** Z.ai API 인증 */
  "zai-coding-plan"?: ZhipuAuthData;

  /** GitHub Copilot OAuth 인증 */
  "github-copilot"?: CopilotAuthData;
}
```

#### OpenAI 인증 데이터

```typescript
interface OpenAIAuthData {
  type: string;        // 고정 값 "oauth"
  access?: string;     // OAuth 액세스 토큰
  refresh?: string;    // OAuth 새로 고침 토큰
  expires?: number;    // 만료 타임스탬프(밀리초)
}
```

**데이터 출처**: OpenCode 공식 OAuth 인증 흐름

#### Zhipu AI / Z.ai 인증 데이터

```typescript
interface ZhipuAuthData {
  type: string;   // 고정 값 "api"
  key?: string;    // API 키
}
```

**데이터 출처**: OpenCode에서 사용자가 구성한 API 키

#### GitHub Copilot 인증 데이터

```typescript
interface CopilotAuthData {
  type: string;        // 고정 값 "oauth"
  refresh?: string;     // OAuth 토큰
  access?: string;      // Copilot 세션 토큰(선택 사항)
  expires?: number;    // 만료 타임스탬프(밀리초)
}
```

**데이터 출처**: OpenCode 공식 OAuth 인증 흐름

---

### Copilot PAT 구성: `~/.config/opencode/copilot-quota-token.json`

사용자가 선택적으로 구성한 Fine-grained PAT(Personal Access Token)로, 공용 API를 통해 할당량을 조회합니다(Copilot 권한 불필요).

```typescript
interface CopilotQuotaConfig {
  /** Fine-grained PAT("Plan" 읽기 권한 필요) */
  token: string;

  /** GitHub 사용자 이름(API 호출 필요) */
  username: string;

  /** Copilot 구독 유형(월별 한도 상한 결정) */
  tier: CopilotTier;
}

/** Copilot 구독 유형 열거형 */
type CopilotTier = "free" | "pro" | "pro+" | "business" | "enterprise";
```

**각 구독 유형의 한도 상한**:

| tier      | 월별 한도(Premium Requests) |
|--- | ---|
| `free`    | 50                          |
| `pro`     | 300                         |
| `pro+`    | 1,500                       |
| `business` | 300                         |
| `enterprise` | 1,000                     |

---

### Google Cloud 계정: `~/.config/opencode/antigravity-accounts.json`

`opencode-antigravity-auth` 플러그인에서 생성한 계정 파일로, 다중 계정을 지원합니다.

```typescript
interface AntigravityAccountsFile {
  version: number;               // 파일 형식 버전 번호
  accounts: AntigravityAccount[];
}

interface AntigravityAccount {
  /** Google 이메일(표시용) */
  email?: string;

  /** OAuth 새로 고침 토큰(필수) */
  refreshToken: string;

  /** Google 프로젝트 ID(둘 중 하나 선택) */
  projectId?: string;

  /** 관리형 프로젝트 ID(둘 중 하나 선택) */
  managedProjectId?: string;

  /** 계정 추가 타임스탬프(밀리초) */
  addedAt: number;

  /** 마지막 사용 타임스탬프(밀리초) */
  lastUsed: number;

  /** 각 모델 재설정 시간(모델 키 → 타임스탬프) */
  rateLimitResetTimes?: Record<string, number>;
}
```

**데이터 출처**: `opencode-antigravity-auth` 플러그인의 OAuth 인증 흐름

---

## API 응답 형식

### OpenAI 응답 형식

**API 엔드포인트**: `GET https://chatgpt.com/backend-api/wham/usage`

**인증 방식**: Bearer Token(OAuth 액세스 토큰)

```typescript
interface OpenAIUsageResponse {
  /** 계획 유형: plus, team, pro 등 */
  plan_type: string;

  /** 할당량 제한 정보 */
  rate_limit: {
    /** 한도에 도달했는지 여부 */
    limit_reached: boolean;

    /** 주 창(3시간) */
    primary_window: RateLimitWindow;

    /** 보조 창(24시간, 선택 사항) */
    secondary_window: RateLimitWindow | null;
  } | null;
}

/** 한도 창 정보 */
interface RateLimitWindow {
  /** 사용된 비율 */
  used_percent: number;

  /** 한도 창 길이(초) */
  limit_window_seconds: number;

  /** 재설정까지 남은 시간(초) */
  reset_after_seconds: number;
}
```

**응답 예시**:

```json
{
  "plan_type": "team",
  "rate_limit": {
    "limit_reached": false,
    "primary_window": {
      "used_percent": 15,
      "limit_window_seconds": 10800,
      "reset_after_seconds": 9000
    },
    "secondary_window": {
      "used_percent": 23,
      "limit_window_seconds": 86400,
      "reset_after_seconds": 43200
    }
  }
}
```

---

### Zhipu AI / Z.ai 응답 형식

**API 엔드포인트**:
- Zhipu AI: `GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai: `GET https://api.z.ai/api/monitor/usage/quota/limit`

**인증 방식**: Authorization 헤더(API 키)

```typescript
interface QuotaLimitResponse {
  code: number;   // 성공 시 200
  msg: string;    // 오류 메시지(성공 시 "success")
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}

/** 단일 한도 항목 */
interface UsageLimitItem {
  /** 한도 유형 */
  type: "TOKENS_LIMIT" | "TIME_LIMIT";

  /** 현재 값 */
  currentValue: number;

  /** 총 값 */
  usage: number;

  /** 사용 비율 */
  percentage: number;

  /** 다음 재설정 타임스탬프(밀리초, TOKENS_LIMIT에만 유효) */
  nextResetTime?: number;
}
```

**한도 유형 설명**:

| type          | 설명               | 재설정 주기  |
|--- | --- | ---|
| `TOKENS_LIMIT` | 5시간 토큰 한도  | 5시간   |
| `TIME_LIMIT`   | MCP 월별 할당량      | 1개월   |

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
        "currentValue": 500000,
        "usage": 10000000,
        "percentage": 5,
        "nextResetTime": 1737926400000
      },
      {
        "type": "TIME_LIMIT",
        "currentValue": 120,
        "usage": 2000,
        "percentage": 6
      }
    ]
  }
}
```

---

### GitHub Copilot 응답 형식

Copilot은 두 가지 API 조회 방식을 지원하며, 응답 형식이 다릅니다.

#### 방식 1: 내부 API(Copilot 권한 필요)

**API 엔드포인트**: `GET https://api.github.com/copilot_internal/user`

**인증 방식**: Bearer Token(OAuth 또는 토큰 교환 후 토큰)

```typescript
interface CopilotUsageResponse {
  /** SKU 유형(구독 구분용) */
  access_type_sku: string;

  /** 분석 추적 ID */
  analytics_tracking_id: string;

  /** 할당 날짜 */
  assigned_date: string;

  /** 제한된 계획 등록 가능 여부 */
  can_signup_for_limited: boolean;

  /** 채팅 활성화 여부 */
  chat_enabled: boolean;

  /** Copilot 계획 유형 */
  copilot_plan: string;

  /** 할당량 재설정 날짜(형식: YYYY-MM) */
  quota_reset_date: string;

  /** 할당량 스냅샷 */
  quota_snapshots: QuotaSnapshots;
}

/** 할당량 스냅샷 */
interface QuotaSnapshots {
  /** 채팅 할당량(선택 사항) */
  chat?: QuotaDetail;

  /** 완성 할당량(선택 사항) */
  completions?: QuotaDetail;

  /** Premium Interactions(필수) */
  premium_interactions: QuotaDetail;
}

/** 할당량 상세 */
interface QuotaDetail {
  /** 할당량 상한 */
  entitlement: number;

  /** 초과 사용 횟수 */
  overage_count: number;

  /** 초과 사용 허용 여부 */
  overage_permitted: boolean;

  /** 남은 비율 */
  percent_remaining: number;

  /** 할당량 ID */
  quota_id: string;

  /** 남은 할당량 */
  quota_remaining: number;

  /** 남은 수량(quota_remaining과 동일) */
  remaining: number;

  /** 무제한 여부 */
  unlimited: boolean;
}
```

#### 방식 2: 공용 Billing API(Fine-grained PAT 필요)

**API 엔드포인트**: `GET https://api.github.com/users/{username}/settings/billing/premium_request/usage`

**인증 방식**: Bearer Token(Fine-grained PAT, "Plan" 읽기 권한 필요)

```typescript
interface BillingUsageResponse {
  /** 시간 주기 */
  timePeriod: {
    year: number;
    month?: number;
  };

  /** 사용자 이름 */
  user: string;

  /** 사용 항목 목록 */
  usageItems: BillingUsageItem[];
}

/** 사용 항목 */
interface BillingUsageItem {
  /** 제품 이름 */
  product: string;

  /** SKU 식별자 */
  sku: string;

  /** 모델 이름(선택 사항) */
  model?: string;

  /** 단위 유형(예: "requests") */
  unitType: string;

  /** 총 요청 수(할인 적용 전) */
  grossQuantity: number;

  /** 순 요청 수(할인 적용 후) */
  netQuantity: number;

  /** 할당량 상한(선택 사항) */
  limit?: number;
}
```

**응답 예시**:

```json
{
  "timePeriod": {
    "year": 2026,
    "month": 1
  },
  "user": "octocat",
  "usageItems": [
    {
      "product": "GitHub Copilot",
      "sku": "Copilot Premium Request",
      "model": "gpt-4o",
      "unitType": "requests",
      "grossQuantity": 229,
      "netQuantity": 229,
      "limit": 300
    },
    {
      "product": "GitHub Copilot",
      "sku": "Copilot Premium Request",
      "model": "claude-3-5-sonnet",
      "unitType": "requests",
      "grossQuantity": 71,
      "netQuantity": 71,
      "limit": 300
    }
  ]
}
```

---

### Google Cloud 응답 형식

**API 엔드포인트**: `POST https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels`

**인증 방식**: Bearer Token(OAuth 액세스 토큰)

**요청 본문**:

```json
{
  "project": "your-project-id"
}
```

```typescript
interface GoogleQuotaResponse {
  /** 모델 목록(키가 모델 ID) */
  models: Record<
    string,
    {
      /** 할당량 정보(선택 사항) */
      quotaInfo?: {
        /** 남은 비율(0-1) */
        remainingFraction?: number;

        /** 재설정 시간(ISO 8601 형식) */
        resetTime?: string;
      };
    }
  >;
}
```

**응답 예시**:

```json
{
  "models": {
    "gemini-3-pro-high": {
      "quotaInfo": {
        "remainingFraction": 0.83,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "gemini-3-pro-image": {
      "quotaInfo": {
        "remainingFraction": 0.91,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "gemini-3-flash": {
      "quotaInfo": {
        "remainingFraction": 1.0,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "claude-opus-4-5-thinking": {
      "quotaInfo": {
        "remainingFraction": 0.0,
        "resetTime": "2026-01-25T00:00:00Z"
      }
    }
  }
}
```

**표시되는 4개 모델**:

| 표시 이름     | 모델 키                                  | 대체 키              |
|--- | --- | ---|
| G3 Pro       | `gemini-3-pro-high`                        | `gemini-3-pro-low`    |
| G3 Image     | `gemini-3-pro-image`                      | -                     |
| G3 Flash     | `gemini-3-flash`                          | -                     |
| Claude       | `claude-opus-4-5-thinking`                | `claude-opus-4-5`     |

---

## 내부 데이터 유형

### 조회 결과 유형

모든 플랫폼 조회 함수는 통일된 결과 형식을 반환합니다.

```typescript
interface QueryResult {
  /** 성공 여부 */
  success: boolean;

  /** 성공 시 출력 내용 */
  output?: string;

  /** 실패 시 오류 메시지 */
  error?: string;
}
```

### 상수 구성

```typescript
/** 높은 사용량 경고 임계값(비율) */
export const HIGH_USAGE_THRESHOLD = 80;

/** API 요청 시간 초과 시간(밀리초) */
export const REQUEST_TIMEOUT_MS = 10000;
```

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 확인하려면 클릭</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능              | 파일 경로                                                                                              | 행번호    |
|--- | --- | ---|
| 인증 데이터 유형      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L99-L104)        | 99-104  |
| OpenAI 인증       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)         | 28-33   |
| Zhipu AI 인증      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L38-L41)         | 38-41   |
| Copilot 인증      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)         | 46-51   |
| Copilot PAT 구성  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)         | 66-73   |
| Antigravity 계정  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94)         | 78-94   |
| OpenAI 응답 형식   | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L29-L36)         | 29-36   |
| Zhipu AI 응답 형식  | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L43-L50)         | 43-50   |
| Copilot 내부 API   | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L47-L58)        | 47-58   |
| Copilot Billing API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L80-L84)        | 80-84   |
| Google Cloud 응답  | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L27-L37)       | 27-37   |

**핵심 상수**:
- `HIGH_USAGE_THRESHOLD = 80`: 높은 사용량 경고 임계값(types.ts:111)
- `REQUEST_TIMEOUT_MS = 10000`: API 요청 시간 초과 시간(types.ts:114)

**핵심 유형**:
- `QueryResult`: 조회 결과 유형(types.ts:15-19)
- `CopilotTier`: Copilot 구독 유형 열거형(types.ts:57)

</details>
