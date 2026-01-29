---
title: "Copilot 인증: OAuth와 PAT 구성 | opencode-mystatus"
sidebarTitle: "Copilot 인증"
subtitle: "Copilot 인증 구성: OAuth 토큰 및 Fine-grained PAT"
description: "GitHub Copilot의 OAuth 토큰과 Fine-grained PAT 인증 방법을 배웁니다. 권한 문제 해결 및 할당량 조회 구성 방법을 안내합니다."
tags:
  - "GitHub Copilot"
  - "OAuth 인증"
  - "PAT 구성"
  - "권한 문제"
prerequisite:
  - "start-quick-start"
  - "platforms-copilot-usage"
order: 2
---

# Copilot 인증 구성: OAuth 토큰 및 Fine-grained PAT

## 학습 완료 후 할 수 있는 것

- Copilot의 두 가지 인증 방식 이해: OAuth 토큰 및 Fine-grained PAT
- OAuth 토큰 권한 부족 문제 해결
- Fine-grained PAT 생성 및 구독 유형 구성
- Copilot Premium Requests 할당량 원활하게 조회

## 현재 문제 상황

`/mystatus` 명령으로 Copilot 할당량을 조회할 때, 다음과 같은 오류 메시지가 표시될 수 있습니다:

```
⚠️ GitHub Copilot 할당량 조회가 일시적으로 사용 불가능합니다.
OpenCode의 새 OAuth 통합은 할당량 API 액세스를 지원하지 않습니다.

해결 방법:
1. fine-grained PAT 생성 (https://github.com/settings/tokens?type=beta 방문)
2. 'Account permissions'에서 'Plan'을 'Read-only'로 설정
3. 구성 파일 ~/.config/opencode/copilot-quota-token.json 생성:
   {"token": "github_pat_xxx...", "username": "사용자 이름"}
```

알 수 없는 사항:
- OAuth 토큰이란 무엇인가요? Fine-grained PAT란 무엇인가요?
- 왜 OAuth 통합은 할당량 API 액세스를 지원하지 않나요?
- Fine-grained PAT를 어떻게 생성하나요?
- 구독 유형(free, pro, pro+ 등)을 어떻게 선택하나요?

이러한 문제로 인해 Copilot 할당량을 확인할 수 없습니다.

## 이 방법을 사용해야 할 때

다음과 같은 상황일 때:
- "OpenCode의 새 OAuth 통합은 할당량 API 액세스를 지원하지 않습니다" 메시지가 표시될 때
- 더 안정적인 Fine-grained PAT 방식으로 할당량을 조회하고 싶을 때
- 팀 또는 엔터프라이즈 계정에 Copilot 할당량 조회를 구성해야 할 때

## 핵심 개념

mystatus는 **두 가지 Copilot 인증 방식**을 지원합니다:

| 인증 방식 | 설명 | 장점 | 단점 |
|---------|------|------|------|
| **OAuth 토큰** (기본값) | OpenCode 로그인 시 얻은 GitHub OAuth 토큰 사용 | 추가 구성 불필요, 즉시 사용 가능 | 새로운 OpenCode의 OAuth 토큰은 Copilot 권한이 없을 수 있음 |
| **Fine-grained PAT** (권장) | 사용자가 수동으로 생성한 Fine-grained Personal Access Token | 안정적이고 신뢰할 수 있음, OAuth 권한에 의존하지 않음 | 수동으로 한 번 생성 필요 |

**우선순위 규칙**:
1. mystatus는 Fine-grained PAT를 우선 사용합니다(구성된 경우)
2. PAT가 구성되지 않은 경우에만 OAuth 토큰으로 폴백합니다

::: tip 권장 방법
OAuth 토큰에 권한 문제가 있는 경우, Fine-grained PAT를 생성하는 것이 가장 안정적인 해결책입니다.
:::

### 두 방식의 차이점

**OAuth 토큰**:
- 저장 위치: `~/.local/share/opencode/auth.json`
- 획득 방식: OpenCode에서 GitHub에 로그인할 때 자동 획득
- 권한 문제: 새로운 OpenCode는 다른 OAuth 클라이언트를 사용하므로 Copilot 관련 권한이 부여되지 않을 수 있음

**Fine-grained PAT**:
- 저장 위치: `~/.config/opencode/copilot-quota-token.json`
- 획득 방식: GitHub Developer Settings에서 수동으로 생성
- 권한 요구: "Plan"(구독 정보)의 읽기 권한 필요

## 단계별 따라하기

### 1단계: Fine-grained PAT가 구성되어 있는지 확인

터미널에서 다음 명령을 실행하여 구성 파일이 있는지 확인합니다:

::: code-group

```bash [macOS/Linux]
ls -la ~/.config/opencode/copilot-quota-token.json
```

```powershell [Windows]
Test-Path "$env:APPDATA\opencode\copilot-quota-token.json"
```

:::

**다음을 확인해야 합니다**:
- 파일이 존재하면 Fine-grained PAT가 이미 구성된 것입니다
- 파일이 존재하지 않거나 오류가 표시되면 생성해야 합니다

### 2단계: Fine-grained PAT 생성(구성되지 않은 경우)

이전 단계에서 파일이 없는 경우, 다음 단계에 따라 생성합니다:

#### 2.1 GitHub PAT 생성 페이지 방문

브라우저에서 다음 주소를 방문합니다:
```
https://github.com/settings/tokens?type=beta
```

이것은 GitHub의 Fine-grained PAT 생성 페이지입니다.

#### 2.2 새 Fine-grained PAT 생성

**Generate new token (classic)** 또는 **Generate new token (beta)**를 클릭합니다. Fine-grained(beta) 사용을 권장합니다.

**구성 매개변수**:

| 필드 | 값 |
|------|-----|
| **Name** | `mystatus-copilot`(또는 원하는 이름) |
| **Expiration** | 만료 시간 선택(예: 90 days 또는 No expiration) |
| **Resource owner** | 선택 불필요(기본값) |

**권한 구성**(중요!):

**Account permissions** 섹션에서 다음을 체크합니다:
- ✅ **Plan** → **Read** 선택(이 권한은 할당량 조회에 필수입니다)

::: warning 중요 팁
"Plan"의 읽기 권한만 체크하고, 계정 보안을 위해 불필요한 권한은 체크하지 마세요.
:::

**다음을 확인해야 합니다**:
- "Plan: Read"가 체크되어 있습니다
- 다른 권한은 체크되지 않았습니다(최소 권한 원칙 준수)

#### 2.3 토큰 생성 및 저장

페이지 하단의 **Generate token** 버튼을 클릭합니다.

**다음을 확인해야 합니다**:
- 페이지에 새로 생성된 토큰이 표시됩니다(예: `github_pat_xxxxxxxxxxxx`)
- ⚠️ **이 토큰을 즉시 복사하세요**, 페이지를 새로고침하면 더 이상 볼 수 없습니다

### 3단계: GitHub 사용자 이름 가져오기

브라우저에서 GitHub 홈페이지를 방문합니다:
```
https://github.com/
```

**다음을 확인해야 합니다**:
- 우측 상단 또는 좌측 상단에 사용자 이름이 표시됩니다(예: `john-doe`)

이 사용자 이름을 기록해 두세요. 구성 시 필요합니다.

### 4단계: Copilot 구독 유형 결정

Copilot 구독 유형을 알아야 합니다. 다른 유형은 월별 할당량이 다릅니다:

| 구독 유형 | 월별 할당량 | 적용 대상 |
|---------|---------|---------|
| `free` | 50 | Copilot Free(무료 사용자) |
| `pro` | 300 | Copilot Pro(개인 프로 버전) |
| `pro+` | 1500 | Copilot Pro+(개인 향상 버전) |
| `business` | 300 | Copilot Business(팀 비즈니스 버전) |
| `enterprise` | 1000 | Copilot Enterprise(엔터프라이즈 버전) |

::: tip 구독 유형 결정 방법?
1. [GitHub Copilot 구독 페이지](https://github.com/settings/copilot) 방문
2. 현재 표시된 구독 계획 확인
3. 위 표에서 해당 유형 선택
:::

### 5단계: 구성 파일 생성

운영 체제에 따라 구성 파일을 생성하고 정보를 입력합니다.

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/copilot-quota-token.json << 'EOF'
{
  "token": "당신의_PAT_토큰",
  "username": "당신의_GitHub_사용자명",
  "tier": "구독_유형"
}
EOF
```

```powershell [Windows]
# 디렉토리 생성(존재하지 않는 경우)
New-Item -ItemType Directory -Force -Path "$env:APPDATA\opencode" | Out-Null

# 구성 파일 생성
@"
{
  "token": "당신의_PAT_토큰",
  "username": "당신의_GitHub_사용자명",
  "tier": "구독_유형"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\copilot-quota-token.json" -Encoding utf8
```

:::

**구성 예시**:

PAT가 `github_pat_abc123`이고, 사용자 이름이 `johndoe`이며, 구독 유형이 `pro`인 경우:

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

::: danger 보안 경고
- 토큰을 Git 저장소에 커밋하거나 다른 사람과 공유하지 마세요
- 토큰은 GitHub 계정에 액세스하는 자격 증명이므로 유출 시 보안 문제가 발생할 수 있습니다
:::

### 6단계: 구성 확인

OpenCode에서 `/mystatus` 명령을 실행합니다.

**다음을 확인해야 합니다**:
- Copilot 섹션이 정상적으로 할당량 정보를 표시합니다
- 권한 오류 메시지가 더 이상 표시되지 않습니다
- 다음과 같은 내용이 표시됩니다:

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (@johndoe)

Premium requests
████████████████████░░░░░░░ 70% (90/300)

Period: 2026-01
```

## 검사점 ✅

이해했는지 확인해 보세요:

| 시나리오 | 확인해야 할 것/해야 할 작업 |
|------|--------------|
| 구성 파일이 이미 존재함 | `ls ~/.config/opencode/copilot-quota-token.json`가 파일을 표시함 |
| PAT 생성 성공 | 토큰이 `github_pat_`로 시작함 |
| 구독 유형이 올바름 | 구성의 `tier` 값이 free/pro/pro+/business/enterprise 중 하나임 |
| 확인 성공 | `/mystatus` 실행 후 Copilot 할당량 정보가 표시됨 |

## 주의 사항

### ❌ 잘못된 작업: "Plan: Read" 권한 체크를 잊음

**오류 현상**: `/mystatus` 실행 시 API 오류(403 또는 401)가 표시됨

**원인**: PAT 생성 시 필요한 권한을 체크하지 않았습니다.

**올바른 방법**:
1. GitHub Settings에서 이전 토큰 삭제
2. **Plan: Read**가 체크되도록 다시 생성
3. 구성 파일의 `token` 필드 업데이트

### ❌ 잘못된 작업: 구독 유형 잘못 입력

**오류 현상**: 할당량이 올바르게 표시되지 않음(예: Free 사용자가 300회 할당량으로 표시됨)

**원인**: `tier` 필드가 잘못 입력되었습니다(예: `pro`라고 입력했지만 실제는 `free`임).

**올바른 방법**:
1. GitHub Copilot 설정 페이지에서 구독 유형 확인
2. 구성 파일의 `tier` 필드 수정

### ❌ 잘못된 작업: 토큰 만료

**오류 현상**: `/mystatus` 실행 시 401 오류가 표시됨

**원인**: Fine-grained PAT에 만료 시간이 설정되어 있어 이미 만료되었습니다.

**올바른 방법**:
1. GitHub Settings → Tokens 페이지 방문
2. 만료된 토큰 찾아 삭제
3. 새 토큰 생성, 구성 파일 업데이트

### ❌ 잘못된 작업: 사용자 이름 대소문자 오류

**오류 현상**: 404 또는 사용자 없음 오류가 표시됨

**원인**: GitHub 사용자 이름은 대소문자를 구분합니다(예: `Johndoe`와 `johndoe`는 다른 사용자임).

**올바른 방법**:
1. GitHub 홈페이지에 표시된 사용자 이름을 정확히 복사(완전히 일치해야 함)
2. 수동으로 입력하지 말고 대소문자 오류를 방지하세요

::: tip 팁
404 오류가 발생하면 GitHub URL에서 사용자 이름을 직접 복사하세요. 예: `https://github.com/YourName` 방문 시 URL의 `YourName`이 사용자 이름입니다.
:::

## 이 수업 요약

mystatus는 두 가지 Copilot 인증 방식을 지원합니다:

1. **OAuth 토큰**(기본값): 자동 획득하지만 권한 문제가 있을 수 있음
2. **Fine-grained PAT**(권장): 수동 구성, 안정적이고 신뢰할 수 있음

Fine-grained PAT 구성 권장 단계:
1. GitHub Settings에서 Fine-grained PAT 생성
2. "Plan: Read" 권한 체크
3. GitHub 사용자 이름 및 구독 유형 기록
4. `~/.config/opencode/copilot-quota-token.json` 구성 파일 생성
5. 구성 확인 성공

구성 완료 후, mystatus는 PAT를 우선 사용하여 Copilot 할당량을 조회하고, OAuth 권한 문제를 방지합니다.

## 다음 수업 예고

> 다음 수업에서 **[다국어 지원: 중국어 및 영어 자동 전환](../i18n-setup/)**을 배웁니다.
>
> 학습할 내용:
> - 언어 감지 메커니즘(Intl API, 환경 변수)
> - 언어를 수동으로 전환하는 방법
> - 중국어 및 영어 대조표

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 확인하려면 클릭</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능                        | 파일 경로                                                                                   | 행번호    |
| --------------------------- | ------------------------------------------------------------------------------------------ | ------- |
| Copilot 인증 전략 진입점        | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L481-L524) | 481-524 |
| Fine-grained PAT 구성 읽기  | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L122-L151) | 122-151 |
| 공용 Billing API 호출       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| OAuth 토큰 교환           | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| 내부 API 호출(OAuth)     | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| 공용 Billing API 출력 포맷팅 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L410-L468) | 410-468 |
| CopilotAuthData 유형 정의    | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)    | 46-51   |
| CopilotQuotaConfig 유형 정의 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)    | 66-73   |
| CopilotTier 열거형 정의       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L57)        | 57      |
| Copilot 구독 유형 할당량       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L397-L403) | 397-403 |

**핵심 상수**:
- `COPILOT_QUOTA_CONFIG_PATH = "~/.config/opencode/copilot-quota-token.json"`: Fine-grained PAT 구성 파일 경로
- `COPILOT_PLAN_LIMITS`: 각 구독 유형의 월별 할당량 제한(397-403행)

**핵심 함수**:
- `queryCopilotUsage(authData)`: Copilot 할당량 조회 주 함수, 두 가지 인증 전략 포함
- `readQuotaConfig()`: Fine-grained PAT 구성 파일 읽기
- `fetchPublicBillingUsage(config)`: GitHub 공용 Billing API 호출(PAT 사용)
- `fetchCopilotUsage(authData)`: GitHub 내부 API 호출(OAuth 토큰 사용)
- `exchangeForCopilotToken(oauthToken)`: OAuth 토큰을 Copilot 세션 토큰으로 교환
- `formatPublicBillingUsage(data, tier)`: 공용 Billing API 응답 포맷팅
- `formatCopilotUsage(data)`: 내부 API 응답 포맷팅

**인증 흐름 비교**:

| 전략 | 토큰 유형 | API 엔드포인트 | 우선순위 |
|------|-----------|---------|--------|
| Fine-grained PAT | Fine-grained PAT | `/users/{username}/settings/billing/premium_request/usage` | 1(우선) |
| OAuth 토큰(캐시) | Copilot 세션 토큰 | `/copilot_internal/user` | 2 |
| OAuth 토큰(직접) | GitHub OAuth 토큰 | `/copilot_internal/user` | 3 |
| OAuth 토큰(교환) | Copilot 세션 토큰(교환 후) | `/copilot_internal/v2/token` | 4 |

</details>
