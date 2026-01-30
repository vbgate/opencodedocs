---
title: "OAuth 인증 문제 해결: 일반적인 문제 해결 | Antigravity Auth"
sidebarTitle: "OAuth 인증 실패 시 대처법"
subtitle: "OAuth 인증 문제 해결: 일반적인 문제 해결"
description: "Antigravity Auth 플러그인의 OAuth 인증 문제 해결 방법을 학습하세요. Safari 콜백 실패, 403 오류, 속도 제한, WSL2/Docker 환경 구성 등 일반적인 문제 해결 방법을 다룹니다."
tags:
  - FAQ
  - 문제 해결
  - OAuth
  - 인증
prerequisite:
  - start-first-auth-login
  - start-quick-install
order: 1
---

# 일반적인 인증 문제 해결

이 수업을 마치면 OAuth 인증 실패, 토큰 갱신 오류, 권한 거부 등 일반적인 문제를 스스로 해결하여 플러그인을 빠르게 정상화할 수 있습니다.

## 현재의 어려움

Antigravity Auth 플러그인을 설치하고 Claude 또는 Gemini 3 모델로 작업을 시작하려는데:

- `opencode auth login` 실행 후 브라우저 인증은 성공했지만, 터미널에 "인증 실패"가 표시됨
- 일정 시간 사용 후 갑자기 "Permission Denied" 또는 "invalid_grant" 오류가 발생함
- 모든 계정이 "속도 제한"을 표시하지만, 할당량은 충분함
- WSL2 또는 Docker 환경에서 OAuth 인증을 완료할 수 없음
- Safari 브라우저 OAuth 콜백이 항상 실패함

이러한 문제는 매우 일반적이며, 대부분의 경우 재설치나 지원팀에 문의할 필요 없이 이 문서의 단계별 가이드를 따라 해결할 수 있습니다.

## 이 가이드는 언제 사용하나요?

다음과 같은 경우 이 튜토리얼을 참조하세요:
- **OAuth 인증 실패**: `opencode auth login`을 완료할 수 없음
- **토큰 만료**: invalid_grant, Permission Denied 오류
- **속도 제한**: 429 오류, "모든 계정 속도 제한"
- **환경 문제**: WSL2, Docker, 원격 개발 환경
- **플러그인 충돌**: oh-my-opencode 또는 다른 플러그인과 호환되지 않음

::: tip 빠른 재설정
인증 문제의 **90%**는 계정 파일을 삭제하고 다시 인증하면 해결됩니다:
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```
:::

---

## 빠른 진단 흐름

문제가 발생하면 다음 순서로 빠르게 원인을 파악하세요:

1. **설정 경로 확인** → 파일 위치가 정확한지 확인
2. **계정 파일 삭제 후 재인증** → 대부분의 인증 문제 해결
3. **오류 메시지 확인** → 구체적인 오류 유형에 따라 해결책 찾기
4. **네트워크 환경 확인** → WSL2/Docker에는 추가 구성 필요

---

## 핵심 개념: OAuth 인증 및 토큰 관리

문제를 해결하기 전에 몇 가지 핵심 개념을 이해하세요.

::: info OAuth 2.0 PKCE 인증이란?

Antigravity Auth는 **OAuth 2.0 with PKCE** (Proof Key for Code Exchange) 인증 메커니즘을 사용합니다:

1. **인증 코드**: 사용자가 인증하면 Google은 임시 인증 코드를 반환합니다
2. **토큰 교환**: 플러그인은 인증 코드를 `access_token` (API 호출용) 및 `refresh_token` (갱신용)으로 교환합니다
3. **자동 갱신**: `access_token` 만료 30분 전에 플러그인이 `refresh_token`을 사용하여 자동으로 갱신합니다
4. **토큰 저장**: 모든 토큰은 로컬 `~/.config/opencode/antigravity-accounts.json`에 저장되며, 어떤 서버에도 업로드되지 않습니다

**보안성**: PKCE 메커니즘은 인증 코드 도난을 방지하며, 토큰이 유출되더라도 공격자는 다시 인증할 수 없습니다.

:::

::: info 속도 제한(Rate Limit)이란?

Google은 각 Google 계정의 API 호출에 대해 빈도 제한을 설정합니다. 제한이 트리거되면:

- **429 Too Many Requests**: 요청이 너무 자주 발생하여 대기 필요
- **403 Permission Denied**: 소프트 밴 또는 악용 감지가 트리거되어 접근 거부
- **요청 중단**: 200 OK 응답이 있지만 콘텐츠가 없음, 일반적으로 무음 속도 제한을 나타냄

**다중 계정의 이점**: 여러 계정을 순환 사용하여 단일 계정의 제한을 우회하고 전체 할당량을 최대화할 수 있습니다.

:::

---

## 설정 경로 설명

모든 플랫폼(Windows 포함)은 `~/.config/opencode/`를 설정 디렉터리로 사용합니다:

| 파일 | 경로 | 설명 |
|---|---|---|
| 주 설정 | `~/.config/opencode/opencode.json` | OpenCode 주 설정 파일 |
| 계정 파일 | `~/.config/opencode/antigravity-accounts.json` | OAuth 토큰 및 계정 정보 |
| 플러그인 설정 | `~/.config/opencode/antigravity.json` | 플러그인별 설정 |
| 디버그 로그 | `~/.config/opencode/antigravity-logs/` | 디버그 로그 파일 |

> **Windows 사용자 참고**: `~`는 자동으로 사용자 디렉터리(예: `C:\Users\YourName`)로 해석됩니다. `%APPDATA%`를 사용하지 마세요.

---

## OAuth 인증 문제

### Safari OAuth 콜백 실패 (macOS)

**증상**:
- 브라우저 인증 성공 후 터미널에 "fail to authorize" 표시
- Safari가 "Safari can't open the page" 또는 "connection refused" 표시

**원인**: Safari의 "HTTPS-Only Mode"가 `http://localhost` 콜백 주소를 차단합니다.

**해결책**:

**방법 1: 다른 브라우저 사용 (가장 간단)**

1. `opencode auth login` 실행
2. 터미널에 표시된 OAuth URL 복사
3. Chrome 또는 Firefox에 붙여넣어 열기
4. 인증 완료

**방법 2: HTTPS-Only Mode 일시적으로 비활성화**

1. Safari → Settings (⌘,) → Privacy
2. "Enable HTTPS-Only Mode" 체크 해제
3. `opencode auth login` 실행
4. 인증 완료 후 HTTPS-Only Mode 다시 활성화

**방법 3: 수동 콜백 추출 (고급)**

Safari가 오류를 표시할 때 주소창에 `?code=...&scope=...`가 포함되어 있으며, 이 콜백 매개변수를 수동으로 추출할 수 있습니다. 자세한 내용은 [issue #119](https://github.com/NoeFabris/opencode-antigravity-auth/issues/119)를 참조하세요.

### 포트가 이미 사용 중

**오류 메시지**: `Address already in use`

**원인**: OAuth 콜백 서버는 기본적으로 `localhost:51121`를 사용하며, 포트가 이미 사용 중이면 시작할 수 없습니다.

**해결책**:

**macOS / Linux:**
```bash
# 포트를 사용 중인 프로세스 찾기
lsof -i :51121

# 프로세스 종료 (<PID>를 실제 프로세스 ID로 대체)
kill -9 <PID>

# 다시 인증
opencode auth login
```

**Windows:**
```powershell
# 포트를 사용 중인 프로세스 찾기
netstat -ano | findstr :51121

# 프로세스 종료 (<PID>를 실제 프로세스 ID로 대체)
taskkill /PID <PID> /F

# 다시 인증
opencode auth login
```

### WSL2 / Docker / 원격 개발 환경

**문제**: OAuth 콜백은 브라우저가 OpenCode가 실행되는 `localhost`에 접근할 수 있어야 하지만, 컨테이너나 원격 환경에서는 직접 접근할 수 없습니다.

**WSL2 해결책**:
- VS Code의 포트 포워딩 사용
- 또는 Windows → WSL 포트 포워딩 구성

**SSH / 원격 개발 해결책**:
```bash
# SSH 터널 설정, 원격의 51121 포트를 로컬로 포워딩
ssh -L 51121:localhost:51121 user@remote-host
```

**Docker / 컨테이너 해결책**:
- 컨테이너 내에서는 localhost 콜백 사용 불가
- 30초 대기 후 수동 URL 프로세스 사용
- 또는 SSH 포트 포워딩 사용

### 다중 계정 인증 문제

**증상**: 여러 계정이 인증에 실패하거나 혼동됩니다.

**해결책**:
1. 계정 파일 삭제: `rm ~/.config/opencode/antigravity-accounts.json`
2. 다시 인증: `opencode auth login`
3. 각 계정이 다른 Google 이메일을 사용하는지 확인

---

## 토큰 갱신 문제

### invalid_grant 오류

**오류 메시지**:
```
Error: invalid_grant
Token has been revoked or expired.
```

**원인**:
- Google 계정 비밀번호 변경
- 계정에서 보안 이벤트 발생(예: 의심스러운 로그인)
- `refresh_token` 만료

**해결책**:
```bash
# 계정 파일 삭제
rm ~/.config/opencode/antigravity-accounts.json

# 다시 인증
opencode auth login
```

### 토큰 만료

**증상**: 일정 시간 사용하지 않은 후 다시 모델을 호출할 때 오류가 발생함.

**원인**: `access_token`은 약 1시간 동안 유효하고, `refresh_token`은 더 오래 유효하지만 만료될 수도 있습니다.

**해결책**:
- 플러그인은 토큰 만료 30분 전에 자동으로 새로고침하므로 수동 조작이 필요 없습니다.
- 자동 갱신에 실패하면 다시 인증하세요: `opencode auth login`

---

## 권한 오류

### 403 Permission Denied (rising-fact-p41fc)

**오류 메시지**:
```
Permission 'cloudaicompanion.companions.generateChat' denied on resource
'//cloudaicompanion.googleapis.com/projects/rising-fact-p41fc/locations/global'
```

**원인**: 플러그인이 유효한 프로젝트를 찾지 못하면 기본 Project ID(예: `rising-fact-p41fc`)로 폴백합니다. 이는 Antigravity 모델에는 적용되지만, Gemini CLI 모델에는 실패하는데, Gemini CLI에는 사용자 자신의 GCP 프로젝트가 필요하기 때문입니다.

**해결책**:

**1단계: GCP 프로젝트 생성 또는 선택**

1. [Google Cloud Console](https://console.cloud.google.com/) 방문
2. 새 프로젝트를 생성하거나 기존 프로젝트를 선택
3. 프로젝트 ID를 기록해 두세요(예: `my-gemini-project`)

**2단계: Gemini for Google Cloud API 활성화**

1. Google Cloud Console에서 "API 및 서비스" → "라이브러리"로 이동
2. "Gemini for Google Cloud API" (`cloudaicompanion.googleapis.com`) 검색
3. "사용"을 클릭

**3단계: 계정 파일에 projectId 추가**

`~/.config/opencode/antigravity-accounts.json`을 편집하세요:

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "your@gmail.com",
      "refreshToken": "...",
      "projectId": "my-gemini-project"
    }
  ]
}
```

::: warning 다중 계정 구성
여러 Google 계정을 구성한 경우 각 계정에 해당하는 `projectId`를 추가해야 합니다.
:::

---

## 속도 제한 문제

### 모든 계정 속도 제한(할당량은 충분함)

**증상**:
- "All accounts rate-limited" 메시지가 표시됨
- 할당량은 충분해 보이지만 새 요청을 보낼 수 없음
- 새로 추가한 계정이 즉시 속도 제한에 걸림

**원인**: 이는 하이브리드 모드에서 발생하는 연속 버그(`clearExpiredRateLimits()`)이며, 최근 베타 버전에서 수정되었습니다.

**해결책**:

**방법 1: 최신 베타 버전으로 업데이트**
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**방법 2: 계정 파일 삭제 후 다시 인증**
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**방법 3: 계정 선택 전략 변경**
`~/.config/opencode/antigravity.json`을 편집하여 전략을 `sticky`로 변경하세요:
```json
{
  "account_selection_strategy": "sticky"
}
```

### 429 Too Many Requests

**증상**:
- 빈번하게 429 오류가 반환됨
- "Rate limit exceeded" 메시지가 표시됨

**원인**: Google은 할당량과 속도 제한 시행을 크게 강화했습니다. 이는 모든 사용자에게 영향을 미치며 이 플러그인에만 국한된 문제가 아닙니다. 주요 요인:

1. **더 엄격한 시행**: 할당량이 "사용 가능해 보일" 때도 Google은 악용 감지를 트리거한 계정을 스로틀링하거나 소프트 밴할 수 있습니다.
2. **OpenCode의 요청 패턴**: OpenCode는 네이티브 애플리케이션보다 더 많은 API 호출(도구 호출, 재시도, 스트리밍, 다중 턴 대화 체인)을 시작하여 "정상" 사용보다 더 빨리 제한을 트리거합니다.
3. **Shadow bans**: 일부 계정이 표시되면 장기간 사용할 수 없게 되는 반면, 다른 계정은 정상적으로 계속 작동합니다.

::: danger 사용 위험
이 플러그인을 사용하면 자동 악용/속도 제한 보호를 트리거할 가능성이 높아집니다. 상위 제공업체는 자체적으로 액세스를 제한, 일시 중지 또는 종료할 수 있습니다. **사용은 자신의 책임 하에** 진행하세요.
:::

**해결책**:

**방법 1: 리셋 대기(가장 신뢰할 수 있음)**

속도 제한은 일반적으로 몇 시간 후에 리셋됩니다. 문제가 지속되면:
- 영향을 받는 계정을 24-48시간 동안 중지
- 그 기간 동안 다른 계정 사용
- 계정 파일의 `rateLimitResetTimes`를 확인하여 제한이 만료되는 시간 확인

**방법 2: Antigravity IDE에서 계정 "웜업"(커뮤니티 경험)**

사용자들이 이 방법이 효과적이라고 보고했습니다:
1. 브라우저에서 직접 [Antigravity IDE](https://idx.google.com/) 열기
2. 영향을 받는 Google 계정으로 로그인
3. 몇 가지 간단한 프롬프트 실행(예: "안녕", "2+2는?")
4. 5-10회 성공적인 프롬프트 후 플러그인에서 계정을 다시 사용해 보기

**원리**: "공식" 인터페이스를 통해 계정을 사용하면 일부 내부 플래그가 리셋되거나 계정이 덜 의심스러워 보일 수 있습니다.

**방법 3: 요청량과 급증 감소**

- 더 짧은 세션 사용
- 병렬/재시도 집약적인 워크플로우(예: 동시에 여러 하위 에이전트 생성) 피하기
- oh-my-opencode을 사용하는 경우 동시 에이전트 생성 수 줄이기 고려
- 빠른 실패와 재시도 대신 `max_rate_limit_wait_seconds: 0` 설정

**방법 4: Antigravity IDE 직접 사용(단일 계정 사용자)**

계정이 하나만 있는 경우 [Antigravity IDE](https://idx.google.com/)를 직접 사용하는 것이 더 나은 경험을 제공할 수 있습니다. OpenCode의 요청 패턴이 제한을 더 빨리 트리거하기 때문입니다.

**방법 5: 새 계정 설정**

새 계정을 추가하는 경우:
1. 계정 파일 삭제: `rm ~/.config/opencode/antigravity-accounts.json`
2. 다시 인증: `opencode auth login`
3. 최신 베타로 업데이트: `"plugin": ["opencode-antigravity-auth@beta"]`
4. Antigravity IDE에서 먼저 계정을 "웜업"하는 것을 고려

**보고할 정보**:

비정상적인 속도 제한 동작을 경험하는 경우 [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues)에서 다음을 공유하세요:
- 디버그 로그의 상태 코드(403, 429 등)
- 속도 제한 상태가 지속된 시간
- 계정 수와 사용된 선택 전략

### 요청 중단(응답 없음)

**증상**:
- 프롬프트가 계속 중단 상태로 유지되며 반환되지 않음
- 로그에 200 OK가 표시되지만 응답 콘텐츠가 없음

**원인**: 일반적으로 Google의 무음 속도 제한 또는 소프트 밴입니다.

**해결책**:
1. 현재 요청 중지(Ctrl+C 또는 ESC)
2. 24-48시간 기다린 후 해당 계정을 다시 사용
3. 그 기간 동안 다른 계정 사용

---

## 세션 복구 문제

### 도구 실행 중단 후 오류

**증상**: 도구 실행 중 ESC를 눌러 중단하면 후속 대화에서 `tool_result_missing` 오류가 발생합니다.

**해결책**:
1. 대화에 `continue`를 입력하여 자동 복구 트리거
2. 차단된 경우 `/undo`를 사용하여 오류 이전 상태로 되돌리기
3. 작업 다시 시도

::: tip 자동 복구
플러그인 세션 복구 기능은 기본적으로 활성화되어 있습니다. 도구 실행이 중단되면 자동으로 synthetic `tool_result`를 주입하고 복구를 시도합니다.
:::

---

## 플러그인 호환성 문제

### oh-my-opencode과의 충돌

**문제**: oh-my-opencode에는 내장 Google 인증이 있어 이 플러그인과 충돌합니다.

**해결책**: `~/.config/opencode/oh-my-opencode.json`에서 내장 인증을 비활성화하세요:
```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**병렬 에이전트 문제**: 병렬 하위 에이전트를 생성할 때 여러 프로세스가 동일한 계정에 도달할 수 있습니다. **해결책**:
- `pid_offset_enabled: true` 활성화(`antigravity.json`에서 구성)
- 또는 더 많은 계정 추가

### @tarquinen/opencode-dcp과의 충돌

**문제**: DCP는 생각 블록이 없는 synthetic assistant 메시지를 생성하여 이 플러그인과 충돌합니다.

**해결책**: **이 플러그인을 DCP 앞에 배치**하세요:
```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

### 기타 gemini-auth 플러그인

**문제**: 다른 Google Gemini 인증 플러그인이 설치되어 충돌을 일으킵니다.

**해결책**: 이러한 플러그인은 필요하지 않습니다. 이 플러그인은 이미 모든 Google OAuth 인증을 처리합니다. 다른 gemini-auth 플러그인을 제거하세요.

---

## 구성 문제

### 구성 키 철자 오류

**오류 메시지**: `Unrecognized key: "plugins"`

**원인**: 잘못된 키 이름이 사용되었습니다.

**해결책**: 올바른 키는 `plugin`(단수)입니다:
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**"plugins"**(복수)가 아닙니다. 이것은 "Unrecognized key" 오류를 일으킵니다.

### 모델을 찾을 수 없음

**증상**: 모델을 사용할 때 "Model not found" 또는 400 오류가 발생합니다.

**해결책**: `google` provider 구성에 추가하세요:
```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

---

## 마이그레이션 문제

### 머신 간 계정 마이그레이션

**문제**: `antigravity-accounts.json`을 새 머신에 복사한 후 "API key missing" 메시지가 표시됩니다.

**해결책**:
1. 플러그인이 설치되어 있는지 확인: `"plugin": ["opencode-antigravity-auth@beta"]`
2. `~/.config/opencode/antigravity-accounts.json`을 새 머신의 동일한 경로에 복사
3. 오류가 계속되면 `refresh_token`이 만료되었을 수 있습니다 → 다시 인증: `opencode auth login`

---

## 디버깅 팁

### 디버그 로그 활성화

**기본 로그**:
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

**상세 로그**(전체 요청/응답):
```bash
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode
```

로그 파일 위치: `~/.config/opencode/antigravity-logs/`

### 속도 제한 상태 확인

계정 파일의 `rateLimitResetTimes` 필드 확인:
```bash
cat ~/.config/opencode/antigravity-accounts.json | grep rateLimitResetTimes
```

---

## 체크포인트 ✅

문제 해결을 마치면 다음 작업을 수행할 수 있어야 합니다:
- [ ] 설정 파일 경로를 올바르게 이해함(`~/.config/opencode/`)
- [ ] Safari OAuth 콜백 실패 문제를 해결함
- [ ] invalid_grant 및 403 오류를 처리함
- [ ] 속도 제한의 원인과 대처 전략을 이해함
- [ ] oh-my-opencode와의 충돌을 해결함
- [ ] 디버그 로그를 활성화하여 문제를 식별함

---

## 함정 경고

### 계정 파일을 버전 관리에 커밋하지 마세요

`antigravity-accounts.json`은 OAuth refresh 토큰을 포함하며, 이는 비밀번호 파일과 동일합니다. 플러그인은 자동으로 `.gitignore`를 생성하지만, `.gitignore`에 다음이 포함되어 있는지 확인하세요:
```
~/.config/opencode/antigravity-accounts.json
```

### 빈번한 재시도 피하기

429 제한을 트리거한 후 반복적으로 재시도하지 마세요. 다시 시도하기 전에 잠시 기다리세요. 그렇지 않으면 악용으로 표시될 수 있습니다.

### 다중 계정 설정 시 projectId 주의

Gemini CLI 모델을 사용하는 경우 **각 계정**에 자체 `projectId`를 구성해야 합니다. 동일한 프로젝트 ID를 사용하지 마세요.

---

## 수업 요약

이 수업은 Antigravity Auth 플러그인의 가장 일반적인 인증 및 계정 문제를 다룹니다:

1. **OAuth 인증 문제**: Safari 콜백 실패, 포트 점유, WSL2/Docker 환경
2. **토큰 갱신 문제**: invalid_grant, 토큰 만료
3. **권한 오류**: 403 Permission Denied, projectId 누락
4. **속도 제한 문제**: 429 오류, Shadow bans, 모든 계정 속도 제한
5. **플러그인 호환성**: oh-my-opencode, DCP 충돌
6. **구성 문제**: 철자 오류, 모델을 찾을 수 없음

문제가 발생하면 **빠른 재설정**(계정 파일 삭제 후 다시 인증)을 먼저 시도하세요. 90%의 경우 이것이 해결됩니다. 문제가 지속되면 자세한 정보를 보려면 디버그 로그를 활성화하세요.

---

## 다음 수업 예고

> 다음 수업에서는 **[모델을 찾을 수 없음 오류 문제 해결](../model-not-found/)**을 학습합니다.
>
> 배울 내용:
> - Gemini 3 모델의 400 오류(Unknown name 'parameters')
> - Tool Schema 호환성 문제
> - MCP 서버 오류 진단 방법
> - 디버깅을 통해 문제 원인을 식별하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-23

| 기능 | 파일 경로 | 라인 번호 |
|---|---|---|
| OAuth 인증(PKCE) | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts) | 91-270 |
| 토큰 검증 및 갱신 | [`src/plugin/auth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/auth.ts) | 1-53 |
| 계정 저장 및 관리 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-715 |
| 속도 제한 감지 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 9-75 |
| 세션 복구 | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | 1-150 |
| 디버그 로그 시스템 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 1-300 |

**주요 상수**:
- `OAUTH_PORT = 51121`: OAuth 콜백 서버 포트(`constants.ts:25`)
- `CLIENT_ID`: OAuth 클라이언트 ID(`constants.ts:4`)
- `TOKEN_EXPIRY_BUFFER = 30 * 60 * 1000`: 토큰 만료 30분 전에 갱신(`auth.ts:33`)

**주요 함수**:
- `authorizeAntigravity()`: OAuth 인증 흐름 시작(`oauth.ts:91`)
- `exchangeAntigravity()`: 인증 코드를 토큰으로 교환(`oauth.ts:209`)
- `refreshAccessToken()`: 만료된 액세스 토큰 갱신(`oauth.ts:263`)
- `isOAuthAuth()`: OAuth 인증 유형인지 확인(`auth.ts:5`)
- `accessTokenExpired()`: 토큰이 곧 만료되는지 확인(`auth.ts:33`)
- `markRateLimitedWithReason()`: 계정을 속도 제한 상태로 표시(`accounts.ts:9`)
- `detectErrorType()`: 복구 가능한 오류 유형 감지(`recovery/index.ts`)

</details>
