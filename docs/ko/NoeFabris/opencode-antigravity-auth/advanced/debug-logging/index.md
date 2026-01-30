---
title: "디버깅 로그: 문제 해결 및 상태 모니터링 | opencode-antigravity-auth"
sidebarTitle: "로그로 문제 해결하기"
subtitle: "디버깅 로그: 문제 해결 및 상태 모니터링"
description: "디버깅 로그를 활용하여 Antigravity Auth 플러그인 문제를 해결하는 방법을 학습하세요. 로그 레벨, 내용 해석, 환경 변수 구성 및 로그 파일 관리 방법을 다룹니다."
tags:
  - "고급"
  - "디버깅"
  - "로깅"
  - "문제 해결"
prerequisite:
  - "../../start/quick-install/"
  - "../../start/first-request/"
order: 3
---

# 디버깅 로그: 문제 해결 및 상태 모니터링

## 학습 완료 후 할 수 있는 것

- 디버깅 로그를 활성화하여 모든 요청과 응답의 상세 정보를 기록하기
- 다양한 로그 레벨과 적용 시나리오 이해하기
- 로그 내용을 해석하여 문제의 근본 원인을 빠르게 찾아내기
- 환경 변수를 사용하여 구성 파일 수정 없이 임시로 디버깅 활성화하기
- 로그 파일을 관리하여 디스크 공간 과도 점유 방지하기

## 현재 당신이 처한 상황

문제가 발생했을 때, 다음과 같은 상황에 직면할 수 있습니다:

- 모호한 오류 메시지만 보고 구체적인 원인을 알 수 없음
- 요청이 Antigravity API에 성공적으로 도달했는지 확인할 수 없음
- 계정 선택, 속도 제한 또는 요청 변환에 문제가 있는 것으로 의심됨
- 타인에게 도움을 요청할 때 가치 있는 진단 정보를 제공할 수 없음

## 언제 이 방법을 사용해야 하는가

디버깅 로그는 다음 시나리오에 적합합니다:

| 시나리오 | 필요 여부 | 이유 |
|--- | --- | ---|
| 429 속도 제한 문제 해결 | ✅ 필요 | 어떤 계정, 어떤 모델이 속도 제한되었는지 확인 |
| 인증 실패 문제 해결 | ✅ 필요 | 토큰 갱신, OAuth 흐름 확인 |
| 요청 변환 문제 해결 | ✅ 필요 | 원본 요청과 변환된 요청 비교 |
| 계정 선택 전략 문제 해결 | ✅ 필요 | 플러그인이 계정을 선택하는 방법 확인 |
| 일일 운영 상태 모니터링 | ✅ 필요 | 요청 빈도, 성공/실패률 통계 |
| 장기간 실행 | ⚠️ 주의 필요 | 로그가 계속 증가하므로 관리 필요 |

::: warning 사전 확인
이 강의를 시작하기 전에 다음을 완료했는지 확인하세요:
- ✅ opencode-antigravity-auth 플러그인 설치 완료
- ✅ OAuth 인증 성공
- ✅ Antigravity 모델을 사용하여 요청 전송 가능

[빠른 설치 강의](../../start/quick-install/) | [첫 번째 요청 강의](../../start/first-request/)
:::

## 핵심 개념

디버깅 로그 시스템의 작동 원리:

1. **구조화된 로그**: 각 로그는 타임스탬프와 라벨을 포함하며, 필터링 및 분석에 용이
2. **레벨별 기록**:
   - Level 1(basic): 요청/응답 메타 정보, 계정 선택, 속도 제한 이벤트 기록
   - Level 2(verbose): 전체 요청/응답 body 기록(최대 50,000자)
3. **보안 마스킹**: 민감 정보(Authorization header 등)를 자동으로 숨김
4. **독립 파일**: 매번 시작 시 새로운 로그 파일을 생성하여 혼란 방지

**로그 내용 개요**:

| 로그 유형 | 라벨 | 내용 예시 |
|--- | --- | ---|
| 요청 추적 | `Antigravity Debug ANTIGRAVITY-1` | URL, headers, body 미리보기 |
| 응답 추적 | `Antigravity Debug ANTIGRAVITY-1` | 상태 코드, 소요 시간, 응답 body |
| 계정 컨텍스트 | `[Account]` | 선택된 계정, 계정 인덱스, 모델 패밀리 |
| 속도 제한 | `[RateLimit]` | 속도 제한 세부 정보, 재설정 시간, 재시도 지연 |
| 모델 식별 | `[ModelFamily]` | URL 파싱, 모델 추출, 모델 패밀리 판단 |

## 따라하기

### 1단계: 기본 디버깅 로그 활성화

**이유**
기본 디버깅 로그를 활성화하면 플러그인이 모든 요청의 메타 정보(URL, headers, 계정 선택, 속도 제한 이벤트 등)를 기록하여, 민감 데이터를 노출하지 않고 문제를 해결할 수 있습니다.

**작업**

플러그인 구성 파일을 편집하세요:

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/antigravity.json
```

```powershell [Windows]
notepad %APPDATA%\opencode\antigravity.json
```

:::

다음 구성을 추가하거나 수정하세요:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true
}
```

파일을 저장하고 OpenCode를 재시작하세요.

**예상 결과**:

1. OpenCode가 시작되면 구성 디렉토리에 새로운 로그 파일이 생성됨
2. 로그 파일 명명 형식: `antigravity-debug-YYYY-MM-DDTHH-MM-SS-mmmZ.log`
3. 요청을 전송하면 로그 파일에 새로운 기록이 나타남

::: tip 로그 파일 위치
- **Linux/macOS**: `~/.config/opencode/antigravity-logs/`
- **Windows**: `%APPDATA%\opencode\antigravity-logs\`
:::

### 2단계: 로그 내용 해석

**이유**
로그의 형식과 내용을 이해해야만 문제를 빠르게 찾아낼 수 있습니다.

**작업**

테스트 요청을 전송한 후 로그 파일을 확인하세요:

```bash
<!-- macOS/Linux -->
tail -f ~/.config/opencode/antigravity-logs/antigravity-debug-*.log

<!-- Windows PowerShell -->
Get-Content "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" -Wait
```

**예상 결과**:

```log
[2026-01-23T10:30:15.123Z] [Account] Request: Account 1 (1/2) family=claude
[2026-01-23T10:30:15.124Z] [Antigravity Debug ANTIGRAVITY-1] POST https://cloudcode-pa.googleapis.com/...
[2026-01-23T10:30:15.125Z] [Antigravity Debug ANTIGRAVITY-1] Streaming: yes
[2026-01-23T10:30:15.126Z] [Antigravity Debug ANTIGRAVITY-1] Headers: {"user-agent":"opencode-antigravity-auth/1.3.0","authorization":"[redacted]",...}
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Body Preview: {"model":"google/antigravity-claude-sonnet-4-5",...}
[2026-01-23T10:30:18.456Z] [Antigravity Debug ANTIGRAVITY-1] Response 200 OK (3330ms)
[2026-01-23T10:30:18.457Z] [Antigravity Debug ANTIGRAVITY-1] Response Headers: {"content-type":"application/json",...}
```

**로그 해석**:

1. **타임스탬프**: `[2026-01-23T10:30:15.123Z]` - ISO 8601 형식, 밀리초 단위까지 정확
2. **계정 선택**: `[Account]` - 플러그인이 계정 1을 선택했고, 총 2개 계정 중 1번째, 모델 패밀리는 claude
3. **요청 시작**: `Antigravity Debug ANTIGRAVITY-1` - 요청 ID는 1
4. **요청 메서드**: `POST https://...` - HTTP 메서드와 대상 URL
5. **스트리밍 여부**: `Streaming: yes/no` - SSE 스트리밍 응답 사용 여부
6. **요청 헤더**: `Headers: {...}` - Authorization을 자동으로 숨김(`[redacted]` 표시)
7. **요청 본문**: `Body Preview: {...}` - 요청 내용(최대 12,000자, 초과 시 잘림)
8. **응답 상태**: `Response 200 OK (3330ms)` - HTTP 상태 코드와 소요 시간
9. **응답 헤더**: `Response Headers: {...}` - 응답 headers

### 3단계: 상세 로그(Verbose) 활성화

**이유**
상세 로그는 전체 요청/응답 body(최대 50,000자)를 기록하여 요청 변환, 응답 파싱 등 심층 문제 해결에 적합합니다.

**작업**

구성을 verbose 레벨로 수정하세요:

```json
{
  "debug": true,
  "OPENCODE_ANTIGRAVITY_DEBUG": "2"
}
```

또는 환경 변수를 사용하세요(권장, 구성 파일 수정 불필요):

::: code-group

```bash [macOS/Linux]
export OPENCODE_ANTIGRAVITY_DEBUG=2
opencode
```

```powershell [Windows]
$env:OPENCODE_ANTIGRAVITY_DEBUG="2"
opencode
```

:::

**예상 결과**:

1. 로그 파일에 전체 요청/응답 body가 나타남(더 이상 잘린 preview가 아님)
2. 대형 응답의 경우 처음 50,000자를 표시하고 잘린 문자 수를 표시

```log
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Response Body (200): {"id":"msg_...","type":"message","role":"assistant",...}
```

::: warning 디스크 공간 경고
상세 로그는 전체 요청/응답 내용을 기록하므로 로그 파일이 급격히 증가할 수 있습니다. 디버깅이 완료된 후에는 반드시 verbose 모드를 비활성화하세요.
:::

### 4단계: 속도 제한 문제 해결

**이유**
속도 제한(429 오류)은 가장 흔한 문제 중 하나입니다. 로그를 통해 어떤 계정, 어떤 모델이 속도 제한되었는지, 얼마나 기다려야 하는지 알 수 있습니다.

**작업**

여러 동시 요청을 전송하여 속도 제한을 유발하세요:

```bash
<!-- macOS/Linux -->
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait
```

로그에서 속도 제한 이벤트를 확인하세요:

```bash
grep "RateLimit" ~/.config/opencode/antigravity-logs/antigravity-debug-*.log
```

**예상 결과**:

```log
[2026-01-23T10:30:20.123Z] [RateLimit] 429 on Account 1 family=claude retryAfterMs=60000
[2026-01-23T10:30:20.124Z] [RateLimit] message: Resource has been exhausted
[2026-01-23T10:30:20.125Z] [RateLimit] quotaResetTime: 2026-01-23T10:31:00.000Z
[2026-01-23T10:30:20.126Z] [Account] Request: Account 2 (2/2) family=claude
[2026-01-23T10:30:20.127Z] [RateLimit] snapshot family=claude Account 1=wait 60s | Account 2=ready
```

**로그 해석**:

1. **속도 제한 세부 정보**: `429 on Account 1 family=claude retryAfterMs=60000`
   - 계정 1(claude 모델 패밀리)에서 429 오류 발생
   - 60,000밀리초(60초) 후에 재시도 필요
2. **오류 메시지**: `message: Resource has been exhausted` - 할당량 고갈
3. **재설정 시간**: `quotaResetTime: 2026-01-23T10:31:00.000Z` - 할당량 재설정 정확 시간
4. **계정 전환**: 플러그인이 자동으로 계정 2로 전환됨
5. **전체 스냅샷**: `snapshot` - 모든 계정의 속도 제한 상태 표시

### 5단계: 사용자 정의 로그 디렉토리

**이유**
기본적으로 로그 파일은 `~/.config/opencode/antigravity-logs/` 디렉토리에 저장됩니다. 로그를 다른 위치(예: 프로젝트 디렉토리)에 저장하려는 경우 사용자 정의 로그 디렉토리를 설정할 수 있습니다.

**작업**

구성 파일에 `log_dir` 구성 항목을 추가하세요:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true,
  "log_dir": "/path/to/your/custom/logs"
}
```

또는 환경 변수를 사용하세요:

```bash
export OPENCODE_ANTIGRAVITY_LOG_DIR="/path/to/your/custom/logs"
opencode
```

**예상 결과**:

1. 로그 파일이 지정된 디렉토리에 기록됨
2. 디렉토리가 없으면 플러그인이 자동으로 생성
3. 로그 파일 명명 형식은 그대로 유지됨

::: tip 경로 권장 사항
- 개발 디버깅: 프로젝트 루트 디렉토리에 저장(`.logs/`)
- 프로덕션 환경: 시스템 로그 디렉토리에 저장(`/var/log/` 또는 `~/Library/Logs/`)
- 임시 디버깅: `/tmp/` 디렉토리에 저장하여 정리 용이
:::

### 6단계: 로그 파일 정리 및 관리

**이유**
장기간 실행 시 로그 파일이 계속 증가하여 디스크 공간을 많이 차지할 수 있습니다. 정기적인 정리가 필요합니다.

**작업**

로그 디렉토리 크기 확인:

```bash
<!-- macOS/Linux -->
du -sh ~/.config/opencode/antigravity-logs/

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\" | Measure-Object -Property Length -Sum
```

오래된 로그 정리:

```bash
<!-- macOS/Linux -->
find ~/.config/opencode/antigravity-logs/ -name "antigravity-debug-*.log" -mtime +7 -delete

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item
```

**예상 결과**:

1. 로그 디렉토리 크기 감소
2. 최근 7일간의 로그 파일만 유지

::: tip 자동화된 정리
정리 스크립트를 cron(Linux/macOS) 또는 작업 스케줄러(Windows)에 추가하여 정기적으로 정리를 실행할 수 있습니다.
:::

## 체크포인트 ✅

위 단계를 완료한 후 다음을 수행할 수 있어야 합니다:

- [ ] 구성 파일을 통해 디버깅 로그 활성화
- [ ] 환경 변수를 사용하여 임시로 디버깅 활성화
- [ ] 로그 내용을 해석하여 요청/응답 세부 정보 찾기
- [ ] 다양한 로그 레벨의 역할 이해
- [ ] 사용자 정의 로그 디렉토리 설정
- [ ] 로그 파일 관리 및 정리

## 일반적인 문제 해결

### 로그 파일이 계속 증가함

**증상**: 디스크 공간이 로그 파일에 의해 점유됨

**원인**: 장기간 디버깅 로그가 활성화되어 있음, 특히 verbose 모드

**해결 방법**:

1. 디버깅이 완료된 후 즉시 `debug: false`로 설정
2. 정기적인 정리 스크립트 설정(6단계 참조)
3. 로그 디렉토리 크기 모니터링 및 임계값 알림 설정

### 로그 파일을 찾을 수 없음

**증상**: `debug: true`를 활성화했지만 로그 디렉토리가 비어 있음

**원인**:
- 구성 파일 경로가 잘못됨
- 권한 문제(로그 디렉토리에 쓸 수 없음)
- 환경 변수가 구성을 재정의함

**해결 방법**:

1. 구성 파일 경로 확인:
   ```bash
   # 구성 파일 찾기
   find ~/.config/opencode/ -name "antigravity.json" 2>/dev/null
   ```
2. 환경 변수가 구성을 재정의하는지 확인:
   ```bash
   echo $OPENCODE_ANTIGRAVITY_DEBUG
   ```
3. 로그 디렉토리 권한 확인:
   ```bash
   ls -la ~/.config/opencode/antigravity-logs/
   ```

### 로그 내용이 불완전함

**증상**: 로그에서 요청/응답 body를 볼 수 없음

**원인**: 기본적으로 basic 레벨(Level 1)을 사용하므로 body preview만 기록됨(최대 12,000자)

**해결 방법**:

1. verbose 레벨(Level 2) 활성화:
   ```json
   {
     "OPENCODE_ANTIGRAVITY_DEBUG": "2"
   }
   ```
2. 또는 환경 변수 사용:
   ```bash
   export OPENCODE_ANTIGRAVITY_DEBUG=2
   ```

### 민감 정보 유출

**증상**: 로그에 민감 데이터(Authorization token 등)가 포함될까 걱정됨

**원인**: 플러그인이 자동으로 `Authorization` header를 마스킹하지만 다른 headers에 민감 정보가 포함될 수 있음

**해결 방법**:

1. 플러그인이 `Authorization` header를 자동으로 마스킹함(`[redacted]` 표시)
2. 로그를 공유할 때 다른 민감 headers(`Cookie`, `Set-Cookie` 등) 확인
3. 민감 정보가 발견되면 수동으로 삭제 후 공유

### 로그 파일을 열 수 없음

**증상**: 로그 파일이 다른 프로세스에서 사용 중이어서 볼 수 없음

**원인**: OpenCode가 로그 파일에 기록 중임

**해결 방법**:

1. `tail -f` 명령어를 사용하여 실시간 로그 확인(파일 잠금 없음)
2. 편집이 필요하면 먼저 OpenCode를 닫으세요
3. `cat` 명령어를 사용하여 내용 확인(파일 잠금 없음)

## 강의 요약

- 디버깅 로그는 문제 해결을 위한 강력한 도구로, 요청/응답 세부 정보, 계정 선택, 속도 제한 이벤트를 기록할 수 있습니다
- 두 가지 로그 레벨이 있습니다: basic(Level 1)과 verbose(Level 2)
- 환경 변수를 사용하여 구성 파일 수정 없이 임시로 디버깅을 활성화할 수 있습니다
- 플러그인은 자동으로 민감 정보(Authorization header 등)를 마스킹합니다
- 장기간 실행 시에는 정기적으로 로그 파일을 정리해야 합니다

## 다음 강의 예고

> 다음 강의에서는 **[속도 제한 처리](../rate-limit-handling/)**를 학습합니다.
>
> 학습 내용:
> - 속도 제한 감지 메커니즘 및 재시도 전략
> - 지수 백오프 알고리즘의 작동 원리
> - 최대 대기 시간 및 재시도 횟수 구성 방법
> - 다중 계정 시나리오에서의 속도 제한 처리

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능        | 파일 경로                                                                                    | 행 번호    |
|--- | --- | ---|
| Debug 모듈 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 전체   |
| 디버깅 초기화 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L98-L118) | 98-118 |
| 요청 추적 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L189-L212) | 189-212 |
| 응답 기록 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L217-L250) | 217-250 |
| Header 마스킹 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L255-L270) | 255-270 |
| 속도 제한 로그 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L354-L396) | 354-396 |
| 구성 Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L64-L72) | 64-72 |

**핵심 상수**:

| 상수명 | 값 | 설명 |
|--- | --- | ---|
| `MAX_BODY_PREVIEW_CHARS` | 12000 | Basic 레벨의 body 미리보기 길이 |
| `MAX_BODY_VERBOSE_CHARS` | 50000 | Verbose 레벨의 body 미리보기 길이 |
| `DEBUG_MESSAGE_PREFIX` | `"[opencode-antigravity-auth debug]"` | 디버깅 로그 접두사 |

**핵심 함수**:

- `initializeDebug(config)`: 디버깅 상태 초기화, 구성 및 환경 변수 읽기
- `parseDebugLevel(flag)`: 디버깅 레벨 문자열 파싱("0"/"1"/"2"/"true"/"verbose")
- `getLogsDir(customLogDir?)`: 로그 디렉토리 가져오기, 사용자 정의 경로 지원
- `createLogFilePath(customLogDir?)`: 타임스탬프가 포함된 로그 파일 경로 생성
- `startAntigravityDebugRequest(meta)`: 요청 추적 시작, 요청 메타 정보 기록
- `logAntigravityDebugResponse(context, response, meta)`: 응답 세부 정보 기록
- `logAccountContext(label, info)`: 계정 선택 컨텍스트 기록
- `logRateLimitEvent(...)`: 속도 제한 이벤트 기록
- `maskHeaders(headers)`: 민감 headers 마스킹(Authorization)

**구성 항목**(schema.ts에서):

| 구성 항목 | 타입 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `debug` | boolean | `false` | 디버깅 로그 활성화 |
| `log_dir` | string? | undefined | 사용자 정의 로그 디렉토리 |

**환경 변수**:

| 환경 변수 | 값 | 설명 |
|--- | --- | ---|
| `OPENCODE_ANTIGRAVITY_DEBUG` | "0"/"1"/"2"/"true"/"verbose" | debug 구성 재정의, 로그 레벨 제어 |
| `OPENCODE_ANTIGRAVITY_LOG_DIR` | string | log_dir 구성 재정의, 로그 디렉토리 지정 |

</details>
