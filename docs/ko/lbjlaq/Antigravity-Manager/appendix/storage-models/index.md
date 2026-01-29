---
title: "저장소 모델: 데이터 구조 | Antigravity Tools"
sidebarTitle: "데이터 위치"
subtitle: "데이터와 모델: 계정 파일, SQLite 통계 라이브러리 및 핵심 필드 정의"
description: "Antigravity Tools의 데이터 저장 구조를 학습합니다. accounts.json, 계정 파일, token_stats.db/proxy_logs.db의 위치와 필드 의미를 파악합니다."
tags:
  - "부록"
  - "데이터 모델"
  - "저장 구조"
  - "백업"
prerequisite:
  - "start-backup-migrate"
order: 2
---

# 데이터와 모델: 계정 파일, SQLite 통계 라이브러리 및 핵심 필드 정의

## 학습 후 가능한 작업

- 계정 데이터, 통계 라이브러리, 구성 파일, 로그 디렉터리의 저장 위치 빠르게 찾기
- 계정 파일의 JSON 구조와 핵심 필드 의미 이해
- SQLite를 통해 직접 프록시 요청 로그 및 Token 소모 통계 조회
- 백업, 이전, 문제 해결 시 확인해야 할 파일 식별

## 현재 어려움

다음 상황에서 도움이 필요할 수 있습니다:
- **계정을 새 머신으로 이전**: 복사해야 할 파일을 모르는 경우
- **계정 이상 원인 조사**: 계정 파일에서 계정 상태를 판단할 수 있는 필드를 모르는 경우
- **Token 소모 내보내기**: 데이터베이스에서 직접 쿼리하고 싶지만 테이블 구조를 모르는 경우
- **과거 데이터 삭제**: 잘못된 파일 삭제로 인한 데이터 손실을 우려하는 경우

이 부록은 완전한 데이터 모델 인지를 구축하는 데 도움을 줍니다.

---

## 데이터 디렉터리 구조

Antigravity Tools의 핵심 데이터는 기본적으로 "사용자 홈 디렉터리" 아래 `.antigravity_tools` 디렉터리에 저장됩니다 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: warning 먼저 보안 경계 명시
이 디렉터리에는 `refresh_token`/`access_token` 등의 민감한 정보가 포함됩니다 (출처: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`). 백업/복사/공유 전, 대상 환경이 신뢰할 수 있는지 확인하세요.
:::

### 이 디렉터리는 어디에서 찾아야 하나요?

::: code-group

```bash [macOS/Linux]
## 데이터 디렉터리로 이동
cd ~/.antigravity_tools

## 또는 Finder에서 열기 (macOS)
open ~/.antigravity_tools
```

```powershell [Windows]
## 데이터 디렉터리로 이동
Set-Location "$env:USERPROFILE\.antigravity_tools"

## 또는 탐색기에서 열기
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### 디렉터리 트리 개요

```
~/.antigravity_tools/
├── accounts.json          # 계정 인덱스 (버전 2.0)
├── accounts/              # 계정 디렉터리
│   └── <account_id>.json  # 계정당 하나의 파일
├── gui_config.json        # 애플리케이션 구성 (GUI 작성)
├── token_stats.db         # Token 통계 라이브러리 (SQLite)
├── proxy_logs.db          # Proxy 모니터링 로그 라이브러리 (SQLite)
├── logs/                  # 애플리케이션 로그 디렉터리
│   └── app.log*           # 일별 롤링 (파일명은 날짜에 따라 변경)
├── bin/                   # 외부 도구 (예: cloudflared)
│   └── cloudflared(.exe)
└── device_original.json   # 장치 지문 기준 (선택 사항)
```

**데이터 디렉터리 경로 규칙**: `dirs::home_dir()`를 가져와 `.antigravity_tools`를 결합 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`).

::: tip 백업 권장 사항
정기적으로 `accounts/` 디렉터리, `accounts.json`, `token_stats.db`, `proxy_logs.db`를 백업하면 모든 핵심 데이터를 보존할 수 있습니다.
:::

---

## 계정 데이터 모델

### accounts.json (계정 인덱스)

계정 인덱스 파일은 모든 계정의 요약 정보와 현재 선택된 계정을 기록합니다.

**위치**: `~/.antigravity_tools/accounts.json`

**Schema** (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`):

```json
{
  "version": "2.0",                  // 인덱스 버전
  "accounts": [                       // 계정 요약 목록
    {
      "id": "uuid-v4",              // 계정 고유 ID
      "email": "user@gmail.com",     // 계정 이메일
      "name": "Display Name",        // 표시 이름 (선택 사항)
      "created_at": 1704067200,      // 생성 시간 (Unix 타임스탬프)
      "last_used": 1704067200       // 마지막 사용 시간 (Unix 타임스탬프)
    }
  ],
  "current_account_id": "uuid-v4"    // 현재 선택된 계정 ID
}
```

### 계정 파일 ({account_id}.json)

각 계정의 전체 데이터는 JSON 형식으로 `accounts/` 디렉터리에 독립적으로 저장됩니다.

**위치**: `~/.antigravity_tools/accounts/{account_id}.json`

**Schema** (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42`; 프론트엔드 타입: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`):

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // OAuth Token 데이터
    "access_token": "ya29...",      // 현재 액세스 토큰
    "refresh_token": "1//...",      // 리프레시 토큰 (가장 중요)
    "expires_in": 3600,            // 만료 시간 (초)
    "expiry_timestamp": 1704070800, // 만료 타임스탬프
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // 선택 사항: Google Cloud 프로젝트 ID
    "session_id": "..."            // 선택 사항: Antigravity sessionId
  },

  "device_profile": {               // 장치 지문 (선택 사항)
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // 장치 지문 역사 버전
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Saved from device X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // 할당량 데이터 (선택 사항)
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // 남은 할당량 백분율
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // 구독 유형: FREE/PRO/ULTRA
  },

  "disabled": false,                // 계정이 완전히 비활성화되었는지 여부
  "disabled_reason": null,          // 비활성화 사유 (예: invalid_grant)
  "disabled_at": null,             // 비활성화 타임스탬프

  "proxy_disabled": false,         // 프록시 기능만 비활성화되었는지 여부 (GUI 사용에는 영향 없음)
  "proxy_disabled_reason": null,   // 프록시 비활성화 사유
  "proxy_disabled_at": null,       // 프록시 비활성화 타임스탬프

  "protected_models": [             // 할당량 보호 모델 목록
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### 핵심 필드 설명

| 필드 | 타입 | 비즈니스 의미 | 트리거 조건 |
| ----- | ---- | -------- | -------- |
| `disabled` | bool | 계정이 완전히 비활성화됨 (예: refresh_token 만료) | `invalid_grant` 발생 시 자동으로 `true`로 설정 |
| `proxy_disabled` | bool | 프록시 기능만 비활성화, GUI 사용에는 영향 없음 | 수동 비활성화 또는 할당량 보호 트리거 |
| `protected_models` | string[] | 모델 수준 할당량 보호의 "제한 모델 목록" | 할당량 보호 로직에 의해 업데이트 |
| `quota.models[].percentage` | number | 남은 할당량 백분율 (0-100) | 할당량 새로고침 시마다 업데이트 |
| `token.refresh_token` | string | access_token을 얻기 위한 자격 증명 | OAuth 권한 부여 시 획득, 장기 유효 |

**중요 규칙 1: invalid_grant는 비활성화를 트리거함** (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889`; 디스크 쓰기: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`):

- 토큰 새로고침 실패 및 오류에 `invalid_grant`가 포함된 경우, TokenManager는 계정 파일에 `disabled=true`/`disabled_at`/`disabled_reason`를 기록하고 계정을 토큰 풀에서 제거합니다.

**중요 규칙 2: protected_models의 의미** (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250`; 할당량 보호 쓰기: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`):

- `protected_models`에는 "표준화된 모델 ID"가 저장되며, 모델 수준 할당량 보호 및 스케줄링 건너뛰기에 사용됩니다.

---

## Token 통계 데이터베이스

Token 통계 라이브러리는 각 프록시 요청의 Token 소모를 기록하며, 비용 모니터링 및 추세 분석에 사용됩니다.

**위치**: `~/.antigravity_tools/token_stats.db`

**데이터베이스 엔진**: SQLite + WAL 모드 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`)

### 테이블 구조

#### token_usage (원시 사용 기록)

| 필드 | 타입 | 설명 |
| ---- | ---- | ---- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 자동 증가 기본 키 |
| timestamp | INTEGER | 요청 타임스탬프 |
| account_email | TEXT | 계정 이메일 |
| model | TEXT | 모델 이름 |
| input_tokens | INTEGER | 입력 Token 수 |
| output_tokens | INTEGER | 출력 Token 수 |
| total_tokens | INTEGER | 총 Token 수 |

**테이블 생성 문** (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`):

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly (시간별 집계 테이블)

매시간 Token 사용량을 집계하여 추세 데이터를 빠르게 조회합니다.

**테이블 생성 문** (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`):

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- 시간 버킷 (형식: YYYY-MM-DD HH:00)
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### 인덱스

쿼리 성능을 향상시키기 위해 데이터베이스에 다음 인덱스가 생성되었습니다 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`):

```sql
-- 시간 내림차순 인덱스
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- 계정별 인덱스
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### 일반 쿼리 예제

#### 최근 24시간 Token 소모 조회

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### 모델별 소모 통계

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info 시간 필드 정의
`token_usage.timestamp`은 `chrono::Utc::now().timestamp()`로 기록된 Unix 타임스탬프(초)이며, `token_stats_hourly.hour_bucket`도 UTC로 생성된 문자열입니다 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`).
:::

---

## Proxy 모니터링 로그 데이터베이스

Proxy 로그 라이브러리는 각 프록시 요청의 상세 정보를 기록하며, 문제 해결 및 요청 감사에 사용됩니다.

**위치**: `~/.antigravity_tools/proxy_logs.db`

**데이터베이스 엔진**: SQLite + WAL 모드 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`)

### 테이블 구조: request_logs

| 필드 | 타입 | 설명 |
| ---- | ---- | ---- |
| id | TEXT PRIMARY KEY | 요청 고유 ID (UUID) |
| timestamp | INTEGER | 요청 타임스탬프 |
| method | TEXT | HTTP 메서드 (GET/POST) |
| url | TEXT | 요청 URL |
| status | INTEGER | HTTP 상태 코드 |
| duration | INTEGER | 요청 소요 시간 (밀리초) |
| model | TEXT | 클라이언트 요청 모델명 |
| mapped_model | TEXT | 실제 라우팅 후 사용된 모델명 |
| account_email | TEXT | 사용된 계정 이메일 |
| error | TEXT | 오류 정보 (있는 경우) |
| request_body | TEXT | 요청 본문 (선택 사항, 공간 차지 큼) |
| response_body | TEXT | 응답 본문 (선택 사항, 공간 차지 큼) |
| input_tokens | INTEGER | 입력 Token 수 |
| output_tokens | INTEGER | 출력 Token 수 |
| protocol | TEXT | 프로토콜 유형 (openai/anthropic/gemini) |

**테이블 생성 문** (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`):

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- 호환성: ALTER TABLE을 통해 새 필드를 점진적으로 추가
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### 인덱스

```sql
-- 시간 내림차순 인덱스
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- 상태 코드별 인덱스
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### 자동 정리

시스템이 ProxyMonitor를 시작할 때 30일 이전 로그를 자동 정리하고 데이터베이스를 `VACUUM`합니다 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`; 구현: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`).

### 일반 쿼리 예제

#### 최근 실패한 요청 조회

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### 각 계정의 요청 성공률 통계

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## 구성 파일

### gui_config.json

애플리케이션 구성 정보를 저장하며, 프록시 설정, 모델 매핑, 인증 모드 등이 포함됩니다.

**위치**: `~/.antigravity_tools/gui_config.json` (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`)

이 파일의 구조는 `AppConfig`를 기준으로 합니다 (출처: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`).

::: tip "백업/이전만을 위해" 필요한 경우
가장 안전한 방법은 애플리케이션을 종료한 후 전체 `~/.antigravity_tools/`를 아카이브하는 것입니다. 구성 핫 업데이트/재시작 의미는 "런타임 동작"에 속하므로, 고급 수업 **[구성 상세 설명](../../advanced/config/)**을 참조하세요.
:::

---

## 로그 파일

### 애플리케이션 로그

**위치**: `~/.antigravity_tools/logs/` (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`)

로그는 일별 롤링 파일을 사용하며, 기본 파일명은 `app.log`입니다 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`).

**로그 수준**: INFO/WARN/ERROR

**용도**: 애플리케이션 실행 시 주요 이벤트, 오류 정보 및 디버깅 정보를 기록하여 문제 해결에 사용합니다.

---

## 데이터 이전 및 백업

### 핵심 데이터 백업

::: code-group

```bash [macOS/Linux]
## 전체 데이터 디렉터리 백업 (가장 안전)
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## 전체 데이터 디렉터리 백업 (가장 안전)
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### 새 머신으로 이전

1. Antigravity Tools 종료 (중간 쓰기 중 복사 방지)
2. 원본 머신의 `.antigravity_tools`를 대상 머신의 사용자 홈 디렉터리로 복사
3. Antigravity Tools 시작

::: tip 크로스 플랫폼 이전
Windows에서 macOS/Linux로 (또는 그 반대로) 이전하는 경우, 전체 `.antigravity_tools` 디렉터리만 복사하면 되며, 데이터 형식은 크로스 플랫폼 호환됩니다.
:::

### 과거 데이터 정리

::: info 결론 먼저
- `proxy_logs.db`: 30일 자동 정리 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`).
- `token_stats.db`: 시작 시 테이블 구조 초기화 (출처: `source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`), 하지만 소스코드에서 "일별 자동 정리" 로직은 확인되지 않았습니다.
:::

::: danger 과거 데이터가 필요 없는 것으로 확인된 경우에만 수행
통계/로그를 지우면 과거 문제 해결 및 비용 분석 데이터를 잃게 됩니다. 작업 전 전체 `.antigravity_tools`를 백업하세요.
:::

"과거를 지우고 다시 시작"만 원한다면 가장 안전한 방법은 애플리케이션을 종료한 후 DB 파일을 직접 삭제하는 것입니다 (다음 시작 시 테이블 구조가 다시 생성됨).

::: code-group

```bash [macOS/Linux]
## Token 통계 지우기 (과거 데이터 손실됨)
rm -f ~/.antigravity_tools/token_stats.db

## Proxy 모니터링 로그 지우기 (과거 데이터 손실됨)
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## Token 통계 지우기 (과거 데이터 손실됨)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## Proxy 모니터링 로그 지우기 (과거 데이터 손실됨)
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## 일반 필드 정의 설명

### Unix 타임스탬프

시간 관련 필드(예: `created_at`, `last_used`, `timestamp`)는 모두 Unix 타임스탬프(초 단위 정밀도)를 사용합니다.

**가독성 있는 시간으로 변환**:

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## SQLite 쿼리 (예: request_logs.timestamp을 인간 가독 시간으로 변환)
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### 할당량 백분율

`quota.models[].percentage`는 남은 할당량 백분율(0-100)을 나타냅니다 (출처: `source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40`; 백엔드 모델: `source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`).

"할당량 보호" 트리거 여부는 `quota_protection.enabled/threshold_percentage/monitored_models`로 결정됩니다 (출처: `source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63`; `protected_models` 쓰기: `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`).

---

## 이 장 요약

- Antigravity Tools의 데이터 디렉터리는 사용자 홈 디렉터리 아래 `.antigravity_tools`입니다.
- 계정 데이터: `accounts.json` (인덱스) + `accounts/<account_id>.json` (단일 계정 전체 데이터)
- 통계 데이터: `token_stats.db` (Token 통계) + `proxy_logs.db` (Proxy 모니터링 로그)
- 구성 및 운영: `gui_config.json`, `logs/`, `bin/cloudflared*`, `device_original.json`
- 백업/이전의 가장 안전한 방법은 "애플리케이션 종료 후 전체 `.antigravity_tools` 패키징"입니다.

---

## 다음 강의 예고

> 다음 강의에서는 **[z.ai 통합 경계](../zai-boundaries/)**를 학습합니다.
>
> 다음 내용을 배우게 됩니다:
> - z.ai 통합의 구현된 기능 목록
> - 명확히 구현되지 않은 기능 및 사용 제한
> - Vision MCP의 실험적 구현 설명

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 데이터 디렉터리(.antigravity_tools) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| 계정 디렉터리(accounts/) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| accounts.json 구조 | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Account 구조(백엔드) | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Account 구조(프론트엔드) | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| TokenData/QuotaData 구조 | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| TokenData/QuotaData 구조 | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Token 통계 라이브러리 초기화(schema) | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Proxy 로그 라이브러리 초기화(schema) | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Proxy 로그 자동 정리(30일) | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Proxy 로그 자동 정리 구현 | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| gui_config.json 읽기/쓰기 | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| logs/ 디렉터리 및 app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| bin/cloudflared 경로 | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
| invalid_grant -> disabled 디스크 쓰기 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L869-L969) | 869-969 |

**핵심 상수**:
- `DATA_DIR = ".antigravity_tools"`: 데이터 디렉터리 이름 (`src-tauri/src/modules/account.rs:16-18`)
- `ACCOUNTS_INDEX = "accounts.json"`: 계정 인덱스 파일명 (`src-tauri/src/modules/account.rs:16-18`)
- `CONFIG_FILE = "gui_config.json"`: 구성 파일명 (`src-tauri/src/modules/config.rs:7`)

**핵심 함수**:
- `get_data_dir()`: 데이터 디렉터리 경로 가져오기 (`src-tauri/src/modules/account.rs`)
- `record_usage()`: `token_usage`/`token_stats_hourly` 쓰기 (`src-tauri/src/modules/token_stats.rs`)
- `save_log()`: `request_logs` 쓰기 (`src-tauri/src/modules/proxy_db.rs`)
- `cleanup_old_logs(days)`: 오래된 `request_logs` 삭제 및 `VACUUM` (`src-tauri/src/modules/proxy_db.rs`)

</details>
