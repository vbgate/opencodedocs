---
title: "일반적인 문제 해결 | opencode-mystatus"
sidebarTitle: "일반적인 문제"
subtitle: "일반적인 문제: 할당량 조회 불가, 토큰 만료, 권한 문제"
description: "opencode-mystatus의 일반적인 문제 해결 방법을 학습합니다. 토큰 만료, 권한 부족, API 오류 등 문제의 원인과 해결 단계를 안내합니다."
tags:
  - "문제 해결"
  - "일반적인 문제"
  - "토큰 만료"
  - "권한 문제"
prerequisite:
  - "start-quick-start"
order: 1
---

# 일반적인 문제: 할당량 조회 불가, 토큰 만료, 권한 문제

opencode-mystatus 플러그인을 사용할 때, 인증 파일 읽기 불가, OAuth 토큰 만료, GitHub Copilot 권한 부족, API 요청 실패 등 다양한 오류를 만날 수 있습니다. 이러한 일반적인 문제는 일반적으로 간단한 구성 또는 다시 인증으로 해결할 수 있습니다. 이 튜토리얼은 모든 일반적인 오류의 해결 단계를 정리하여 문제의 근원을 빠르게 파악하는 데 도움을 줍니다.

## 학습 완료 후 할 수 있는 것

- mystatus 조회 실패 원인 빠르게 파악
- OpenAI 토큰 만료 문제 해결
- GitHub Copilot Fine-grained PAT 구성
- Google Cloud project_id 누락 처리
- 다양한 API 요청 실패 및 시간 초과 문제 대응

## 현재 문제 상황

`/mystatus`로 할당량을 조회하지만, 다양한 오류 메시지를 보며 어디서부터 시작해야 할지 모릅니다.

## 이 방법을 사용해야 할 때

- **모든 오류 메시지를 볼 때**: 이 튜토리얼은 모든 일반적인 오류를 다룹니다
- **새 계정을 방금 구성했을 때**: 구성이 올바른지 확인
- **할당량 조회가 갑자기 실패할 때**: 토큰 만료 또는 권한 변화 가능성

::: tip 문제 해결 원칙

오류를 만나면, 오류 메시지의 핵심 키워드를 먼저 보고 이 튜토리얼의 해결 방법에 대응합니다. 대부분의 오류에는 명확한 메시지가 있습니다.

:::

## 핵심 개념

mystatus 도구의 오류 처리 메커니즘은 세 계층으로 나뉩니다:

1. **인증 파일 읽기 계층**: `auth.json`이 존재하는지, 형식이 올바른지 확인
2. **플랫폼 조회 계층**: 각 플랫폼 독립적으로 조회하며, 실패 시 다른 플랫폼에 영향을 미치지 않음
3. **API 요청 계층**: 네트워크 요청은 시간 초과 또는 오류를 반환할 수 있지만, 도구는 다른 플랫폼을 계속 시도합니다

이것은 다음을 의미합니다:
- 한 플랫폼 실패는 다른 플랫폼은 정상적으로 표시됩니다
- 오류 메시지는 어느 플랫폼에 문제가 있는지 명확히 지적합니다
- 대부분의 오류는 구성 또는 다시 인증으로 해결할 수 있습니다

## 문제 해결 체크리스트

### 문제 1: 인증 파일 읽기 불가

**오류 메시지**:

```
❌ 인증 파일을 읽을 수 없습니다: ~/.local/share/opencode/auth.json
오류: ENOENT: no such file or directory
```

**원인**:
- OpenCode 인증 파일이 존재하지 않습니다
- 아직 어떤 플랫폼 계정도 구성하지 않았습니다

**해결 방법**:

1. **OpenCode가 설치되고 구성되었는지 확인**
   - OpenCode에서 최소한 하나의 플랫폼(OpenAI, Zhipu AI 등)을 구성했는지 확인
   - 없으면 먼저 OpenCode에서 인증 완료

2. **파일 경로 확인**
   - OpenCode 인증 파일은 `~/.local/share/opencode/auth.json`에 있어야 합니다
   - 사용자 지정 구성 디렉토리를 사용하는 경우, 파일 경로가 올바른지 확인

3. **파일 형식 확인**
   - `auth.json`이 유효한 JSON 파일인지 확인
   - 파일 내용에 최소한 하나의 플랫폼 인증 정보가 포함되어 있어야 함

**다음을 확인해야 합니다**:
`/mystatus`를 다시 실행한 후, 최소한 하나의 플랫폼 할당량 정보를 볼 수 있습니다.

---

### 문제 2: 구성된 계정을 찾을 수 없음

**오류 메시지**:

```
구성된 계정을 찾을 수 없습니다.

지원되는 계정 유형:
- OpenAI (Plus/Team/Pro 구독 사용자)
- Zhipu AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

**원인**:
- `auth.json`이 존재하지만, 유효한 구성이 없습니다
- 기존 구성 형식이 틀렸습니다(예: 필수 필드 누락)

**해결 방법**:

1. **auth.json 내용 확인**
   `~/.local/share/opencode/auth.json`을 열어 최소한 하나의 플랫폼 구성이 있는지 확인:

   ```json
   {
     "openai": {
       "type": "oauth",
       "access": "eyJ...",
       "expires": 1738000000000
     }
   }
   ```

2. **최소한 하나의 플랫폼 구성**
   - OpenCode에서 OAuth 인증 완료
   - 또는 수동으로 플랫폼 API 키 추가(Zhipu AI, Z.ai)

3. **구성 형식 참조**
   각 플랫폼의 구성 요구 사항:
   - OpenAI: `type: "oauth"` 및 `access` 토큰 필수
   - Zhipu AI / Z.ai: `type: "api"` 및 `key` 필수
   - GitHub Copilot: `type: "oauth"` 및 `refresh` 토큰 필수
   - Google Cloud: `auth.json`에 의존하지 않음, 별도 구성 필요(문제 6 참조)

---

### 문제 3: OpenAI OAuth 토큰 만료

**오류 메시지**:

```
⚠️ OAuth 인증이 만료되었습니다. OpenCode에서 OpenAI 모델을 한 번 사용하여 인증을 새로 고침하세요.
```

**원인**:
- OpenAI OAuth 토큰 유효 기간이 제한적이며, 만료 후 할당량 조회 불가
- 토큰 만료 시간은 `auth.json`의 `expires` 필드에 저장됨

**해결 방법**:

1. **OpenCode에서 OpenAI 모델 사용**
   - ChatGPT 또는 Codex에 질문
   - OpenCode가 자동으로 토큰 새로 고침 및 `auth.json` 업데이트

2. **토큰 업데이트 확인**
   - `auth.json`의 `expires` 필드 확인
   - 미래의 타임스탬프인지 확인

3. **/mystatus 다시 실행**
   - 이제 OpenAI 할당량을 정상적으로 조회할 수 있음

**왜 모델을 다시 사용해야 하는가**:
OpenAI OAuth 토큰에는 만료 메커니즘이 있으며, 모델 사용 시 토큰 새로 고침이 트리거됩니다. 이것은 OpenCode 공용 인증 흐름의 보안 기능입니다.

---

### 문제 4: API 요청 실패(일반)

**오류 메시지**:

```
OpenAI API 요청 실패 (401): Unauthorized
Zhipu API 요청 실패 (403): Forbidden
Google API 요청 실패 (500): Internal Server Error
```

**원인**:
- 토큰 또는 API 키가 유효하지 않음
- 네트워크 연결 문제
- API 서비스 일시적으로 사용 불가
- 권한 부족(일부 플랫폼은 특정 권한 요구)

**해결 방법**:

1. **토큰 또는 API 키 확인**
   - OpenAI: `access` 토큰이 만료되지 않았는지 확인(문제 3)
   - Zhipu AI / Z.ai: `key`가 올바르고, 여분 공백이 없는지 확인
   - GitHub Copilot: `refresh` 토큰이 유효한지 확인

2. **네트워크 연결 확인**
   - 네트워크가 정상인지 확인
   - 일부 플랫폼은 지역 제한이 있을 수 있음(예: Google Cloud)

3. **다시 인증 시도**
   - OpenCode에서 OAuth 인증 다시 수행
   - 또는 수동으로 API 키 업데이트

4. **구체적인 HTTP 상태 코드 보기**
   - `401` / `403`: 권한 문제, 일반적으로 토큰 또는 API 키가 유효하지 않음
   - `500` / `503`: 서버측 오류, 일반적으로 API 일시적으로 사용 불가, 나중에 다시 시도
   - `429`: 요청이 너무 빈번, 잠시 기다려야 함

---

### 문제 5: 요청 시간 초과

**오류 메시지**:

```
요청 시간 초과 (10초)
```

**원인**:
- 네트워크 연결이 느림
- API 응답 시간이 너무 김
- 방화벽 또는 프록시가 요청을 차단함

**해결 방법**:

1. **네트워크 연결 확인**
   - 네트워크가 안정적인지 확인
   - 해당 플랫폼 웹사이트를 방문하여 정상적으로 액세스할 수 있는지 확인

2. **프록시 설정 확인**
   - 프록시를 사용하는 경우, 프록시 구성이 올바른지 확인
   - 일부 플랫폼은 특별한 프록시 구성이 필요할 수 있음

3. **다시 시도**
   - 때로는 일시적인 네트워크 변동
   - 다시 시도하면 보통 해결됨

---

### 문제 6: GitHub Copilot 할당량 조회 불가

**오류 메시지**:

```
⚠️ GitHub Copilot 할당량 조회가 일시적으로 사용 불가능합니다.
OpenCode의 새 OAuth 통합은 할당량 API 액세스를 지원하지 않습니다.

해결 방법:
1. fine-grained PAT 생성 (https://github.com/settings/tokens?type=beta 방문)
2. 'Account permissions'에서 'Plan'을 'Read-only'로 설정
3. 구성 파일을 생성하고 다음 내용을 입력(필수 `tier` 필드 포함):
   ```json
   {
     "token": "github_pat_xxx...",
     "username": "사용자 이름",
     "tier": "pro"
   }
   ```

기타 방법:
• VS Code에서 상태 표시줄의 Copilot 아이콘 클릭하여 할당량 보기
• https://github.com/settings/billing 방문하여 사용 현황 보기
```

**원인**:
- OpenCode 공용 OAuth 통합은 새로운 인증 흐름을 사용
- 새 OAuth 토큰에는 `copilot` 권한이 없어 내부 할당량 API를 호출할 수 없음
- 이것은 OpenCode 공용 보안 제한입니다

**해결 방법**(권장):

1. **Fine-grained PAT 생성**
   - https://github.com/settings/tokens?type=beta 방문
   - "Generate new token" → "Fine-grained token" 클릭
   - 토큰 이름 입력(예: "OpenCode Copilot Quota")

2. **권한 구성**
   - "Account permissions"에서 "Plan" 권한 찾기
   - "Read-only"로 설정
   - "Generate token" 클릭

3. **구성 파일 생성**
   `~/.config/opencode/copilot-quota-token.json` 생성:

   ```json
   {
     "token": "github_pat_xxx...",
     "username": "귀하의 GitHub 사용자 이름",
     "tier": "pro"
   }
   ```

   **tier 필드 설명**:
   - `free`: Copilot Free(50회/월)
   - `pro`: Copilot Pro(300회/월)
   - `pro+`: Copilot Pro+(1500회/월)
   - `business`: Copilot Business(300회/월)
   - `enterprise`: Copilot Enterprise(1000회/월)

4. **/mystatus 다시 실행**
   - 이제 GitHub Copilot 할당량을 정상적으로 조회할 수 있음

**대안 방법**:

PAT를 구성하지 않으려면:
- VS Code에서 상태 표시줄의 Copilot 아이콘 클릭하여 할당량 보기
- https://github.com/settings/billing 방문하여 사용 현황 보기

---

### 문제 7: Google Cloud project_id 누락

**오류 메시지**:

```
⚠️ project_id가 없어 할당량을 조회할 수 없습니다.
```

**원인**:
- Google Cloud 계정 구성에 `projectId` 또는 `managedProjectId`가 없습니다
- mystatus는 Google Cloud API를 호출하기 위해 프로젝트 ID가 필요합니다

**해결 방법**:

1. **antigravity-accounts.json 확인**
   구성 파일을 열어 계정 구성에 `projectId` 또는 `managedProjectId`가 포함되어 있는지 확인:

   ::: code-group

   ```bash [macOS/Linux]
   ~/.config/opencode/antigravity-accounts.json
   ```

   ```powershell [Windows]
   %APPDATA%\opencode\antigravity-accounts.json
   ```

   :::

   ```json
   {
     "accounts": [
       {
         "email": "your-email@gmail.com",
         "refreshToken": "1//xxx",
         "projectId": "your-project-id",
         "addedAt": 1738000000000,
         "lastUsed": 1738000000000,
         "rateLimitResetTimes": {}
       }
     ]
   }
   ```

2. **project_id 가져오는 방법**
   - https://console.cloud.google.com/ 방문
   - 프로젝트 선택
   - 프로젝트 정보에서 "프로젝트 ID"(Project ID) 찾기
   - 구성 파일에 복사

3. **project_id가 없는 경우**
   - 관리형 프로젝트를 사용하는 경우, `managedProjectId`를 사용해야 할 수 있음
   - Google Cloud 관리자에게 연락하여 프로젝트 ID 확인

---

### 문제 8: Zhipu AI / Z.ai API가 유효하지 않은 데이터 반환

**오류 메시지**:

```
Zhipu API 요청 실패 (200): {"code": 401, "msg": "Invalid API key"}
Z.ai API 요청 실패 (200): {"code": 400, "msg": "Bad request"}
```

**원인**:
- API 키가 유효하지 않거나 형식이 틀림
- API 키가 만료되었거나 취소됨
- 계정에 해당 서비스 권한이 없음

**해결 방법**:

1. **API 키 올바른지 확인**
   - Zhipu AI 또는 Z.ai 콘솔에 로그인
   - API 키가 유효한지 확인
   - 여분 공백 또는 줄바꿈 문자가 없는지 확인

2. **API 키 권한 확인**
   - Zhipu AI: "Coding Plan" 권한이 있는지 확인
   - Z.ai: "Coding Plan" 권한이 있는지 확인

3. **API 키 다시 생성**
   - API 키에 문제가 있으면 콘솔에서 다시 생성
   - `auth.json`의 `key` 필드 업데이트

---

## 검사점 ✅

독립적으로 일반적인 문제를 해결할 수 있는지 확인하세요:

| 기술 | 확인 방법 | 예상 결과 |
|--- | --- | ---|
| 인증 파일 문제 해결 | auth.json이 존재하고 형식이 올바른지 확인 | 파일이 존재하며 JSON 형식 올바름 |
| OpenAI 토큰 새로 고침 | OpenCode에서 OpenAI 모델 사용 | 토큰이 업데이트되고 할당량 정상 조회 가능 |
| Copilot PAT 구성 | copilot-quota-token.json 생성 | Copilot 할당량 정상 조회 가능 |
| API 오류 처리 | HTTP 상태 코드 보고 대응 조치 취하기 | 401/403/500 등 오류 코드 의미 파악 |
| Google project_id 구성 | antigravity-accounts.json에 projectId 추가 | Google Cloud 할당량 정상 조회 가능 |

## 이 수업 요약

mystatus의 오류 처리는 세 계층으로 나뉩니다: 인증 파일 읽기, 플랫폼 조회, API 요청. 오류를 만나면 먼저 오류 메시지의 핵심 키워드를 보고 해결 방법에 대응합니다. 가장 일반적인 문제는 다음과 같습니다:

1. **인증 파일 문제**: `auth.json`이 존재하는지, 형식이 올바른지 확인
2. **토큰 만료**: OpenCode에서 해당 모델을 한 번 사용하여 토큰 새로 고침
3. **API 오류**: HTTP 상태 코드에 따라 권한 문제인지 서버측 문제인지 판단
4. **Copilot 특별 권한**: 새 OAuth 통합은 Fine-grained PAT 구성 필요
5. **Google 구성**: 할당량 조회를 위해 project_id 필요

대부분의 오류는 구성 또는 다시 인증으로 해결할 수 있으며, 한 플랫폼 실패는 다른 플랫폼 조회에 영향을 미치지 않습니다.

## 다음 수업 예고

> 다음 수업에서 **[보안 및 개인정보: 로컬 파일 액세스, API 마스킹, 공용 인터페이스](/ko/vbgate/opencode-mystatus/faq/security/)**를 배웁니다.
>
> 학습할 내용:
> - mystatus가 귀하의 민감 데이터를 보호하는 방법
> - API 키 자동 마스킹 원리
> - 왜 플러그인이 안전한 로컬 도구인가
> - 데이터 저장 안 함, 업로드 안 함 보증

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 확인하려면 클릭</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행번호 |
|--- | --- | ---|
| 오류 처리 주요 로직 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 41-87 |
| 인증 파일 읽기 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 38-46 |
| 계정 찾을 수 없음 메시지 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 78-80 |
| 결과 수집 및 요약 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| OpenAI 토큰 만료 확인 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 216-221 |
| API 오류 처리 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 149-152 |
| Copilot PAT 읽기 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Copilot OAuth 실패 메시지 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 298-303 |
| Google project_id 확인 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 232-234 |
| Zhipu API 오류 처리 | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 94-103 |
| 오류 메시지 정의 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts) | 66-123 (중국어), 144-201 (영어) |

**핵심 상수**:

- `HIGH_USAGE_THRESHOLD = 80`: 높은 사용량 경고 임계값(`plugin/lib/types.ts:111`)

**핵심 함수**:

- `collectResult()`: 조회 결과를 results 및 errors 배열에 수집(`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()`: OpenAI 할당량 조회, 토큰 만료 확인 포함(`plugin/lib/openai.ts:207-236`)
- `readQuotaConfig()`: Copilot PAT 구성 읽기(`plugin/lib/copilot.ts:122-151`)
- `fetchAccountQuota()`: 단일 Google Cloud 계정 할당량 조회(`plugin/lib/google.ts:218-256`)
- `fetchUsage()`: Zhipu/Z.ai 사용량 조회(`plugin/lib/zhipu.ts:81-106`)

</details>
