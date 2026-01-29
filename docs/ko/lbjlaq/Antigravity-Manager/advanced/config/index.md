---
title: "설정: 핫 리로드와 마이그레이션 | Antigravity-Manager"
subtitle: "설정: 핫 리로드와 마이그레이션 | Antigravity-Manager"
sidebarTitle: "설정이 적용되지 않을 때"
description: "설정 시스템의 저장, 핫 리로드, 마이그레이션 메커니즘을 학습합니다. 필드 기본값과 인증 검증 방법을 마스터하여 일반적인 문제를 피하세요."
tags:
  - "설정"
  - "gui_config.json"
  - "AppConfig"
  - "ProxyConfig"
  - "핫 리로드"
prerequisite:
  - "start-first-run-data"
  - "start-proxy-and-first-client"
order: 1
---
# 설정 완벽 가이드: AppConfig/ProxyConfig, 저장 위치 및 핫 리로드 의미

`auth_mode`를 변경했는데 클라이언트가 여전히 401을 반환합니다. `allow_lan_access`를 켰는데 같은 네트워크 세그먼트의 기기에서 연결되지 않습니다. 설정을 새 머신으로 이동하려고 하는데 어떤 파일을 복사해야 할지 모릅니다.

이 수업에서는 Antigravity Tools의 설정 시스템을 한 번에 완벽하게 설명합니다. 설정이 어디에 저장되는지, 기본값이 무엇인지, 어떤 항목이 핫 리로드되는지, 어떤 항목이 리버스 프록시를 재시작해야 하는지 알게 됩니다.

## AppConfig/ProxyConfig란 무엇인가요?

**AppConfig/ProxyConfig**는 Antigravity Tools의 설정 데이터 모델입니다. AppConfig는 데스크톱 앱의 일반 설정(언어, 테마, 워밍업, 쿼터 보호 등)을 관리하고, ProxyConfig는 로컬 리버스 프록시 서비스의 실행 매개변수(포트, 인증, 모델 매핑, 업스트림 프록시 등)를 관리합니다. 이들은 모두 동일한 `gui_config.json` 파일에 직렬화되며, 리버스 프록시 시작 시 그 안의 ProxyConfig를 읽습니다.

## 이 수업을 마치면 할 수 있는 것

- 설정 파일 `gui_config.json`의 실제 저장 위치를 찾고, 백업/마이그레이션을 수행할 수 있습니다
- AppConfig/ProxyConfig의 핵심 필드와 기본값을 이해할 수 있습니다(소스 코드 기준)
- 어떤 설정이 저장 후 핫 리로드되는지, 어떤 설정이 리버스 프록시 재시작이 필요한지 명확히 알 수 있습니다
- "설정 마이그레이션"(이전 필드가 자동으로 병합/삭제되는 과정)의 발생 조건을 이해할 수 있습니다

## 현재의 문제점

- 설정을 변경했는데 "적용되지 않습니다" - 저장되지 않았는지, 핫 리로드되지 않았는지, 아니면 재시작이 필요한지 모릅니다
- "리버스 프록시 설정"만 새 머신으로 가져가고 싶은데, 계정 데이터도 함께 나가는 것이 걱정됩니다
- 업그레이드 후 이전 필드가 나타나 설정 파일 형식이 "망가졌다"고 걱정합니다

## 언제 이 방법을 사용해야 할까요?

- 리버스 프록시를 "로컬 전용"에서 "LAN 액세스 가능"으로 전환하려고 할 때
- 인증 정책(`auth_mode`/`api_key`)을 변경하고 즉시 적용 여부를 확인하고 싶을 때
- 모델 매핑/업스트림 프록시/z.ai 설정을 대량으로 관리할 때

## 🎒 시작 전 준비

- 데이터 디렉터리가 무엇인지 이미 알고 있습니다([최초 실행 필독: 데이터 디렉터리, 로그, 트레이 및 자동 시작](../../start/first-run-data/) 참조)
- 리버스 프록시 서비스를 한 번 이상 시작할 수 있습니다([로컬 리버스 프록시 시작 및 첫 번째 클라이언트 연결](../../start/proxy-and-first-client/) 참조)

::: warning 먼저 경계 정의하기
이 수업에서는 `gui_config.json`을 읽기/백업/마이그레이션하는 방법을 가르치지만, 이것을 "장기간 수동으로 유지하는 설정 파일"으로 사용하는 것은 권장하지 않습니다. 백엔드가 설정을 저장할 때 Rust의 `AppConfig` 구조체에 따라 다시 직렬화하기 때문에, 수동으로 추가한 알 수 없는 필드는 다음 저장 시 자동으로 삭제될 수 있습니다.
:::

## 핵심 아이디어

설정에 관해 세 가지만 기억하세요:

1. AppConfig는 영구 설정의 루트 객체이며, `gui_config.json`에 저장됩니다.
2. ProxyConfig는 `AppConfig.proxy`의 하위 객체이며, 리버스 프록시 시작/핫 리로드는 이것을 중심으로 이루어집니다.
3. 핫 리로드는 "메모리 상태만 업데이트"하는 것입니다: 핫 리로드 가능하다고 해서 리스닝 포트/주소를 변경할 수 있는 것은 아닙니다.

## 따라해 보세요

### 1단계: `gui_config.json` 위치 찾기(설정의 단일 진실 소스)

**왜 필요한가요?**
나중에 모든 "백업/마이그레이션/문제 해결"은 이 파일을 기준으로 해야 합니다.

백엔드의 데이터 디렉터리는 홈 디렉터리 아래의 `.antigravity_tools`입니다(없으면 자동으로 생성됨). 설정 파일 이름은 고정적으로 `gui_config.json`입니다.

::: code-group

```bash [macOS/Linux]
CONFIG_FILE="$HOME/.antigravity_tools/gui_config.json"
echo "$CONFIG_FILE"
ls -la "$CONFIG_FILE" || true
```

```powershell [Windows]
$configFile = Join-Path $HOME ".antigravity_tools\gui_config.json"
$configFile
Get-ChildItem -Force $configFile -ErrorAction SilentlyContinue
```

:::

**보아야 할 것**:
- 아직 리버스 프록시를 시작하지 않았다면 이 파일이 존재하지 않을 수 있습니다(백엔드가 기본 설정을 직접 사용합니다).
- 리버스 프록시 서비스를 시작하거나 설정을 저장하면, 자동으로 생성되고 JSON이 작성됩니다.

### 2단계: 백업 만들기(실수 방지 + 롤백 편의)

**왜 필요한가요?**
설정에는 `proxy.api_key`, z.ai의 `api_key` 등 민감한 필드가 포함될 수 있습니다. 마이그레이션/비교할 때 백업은 "기억"보다 더 신뢰할 수 있습니다.

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/antigravity-config-backup"
cp "$HOME/.antigravity_tools/gui_config.json" "$HOME/antigravity-config-backup/gui_config.$(date +%Y%m%d%H%M%S).json"
```

```powershell [Windows]
$backupDir = Join-Path $HOME "antigravity-config-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$ts = Get-Date -Format "yyyyMMddHHmmss"
Copy-Item (Join-Path $HOME ".antigravity_tools\gui_config.json") (Join-Path $backupDir "gui_config.$ts.json")
```

:::

**보아야 할 것**: 백업 디렉터리에 타임스탬프가 포함된 JSON 파일이 나타납니다.

### 3단계: 기본값 명확히 하기(감대로 추측하지 말기)

**왜 필요한가요?**
많은 "어떻게 해도 설정이 안 맞는" 문제는 실제로는 기본값에 대한 기대가 다른 것입니다.

다음 기본값들은 백엔드 `AppConfig::new()`와 `ProxyConfig::default()`에서 가져온 것입니다:

| 설정 블록 | 필드 | 기본값(소스 코드) | 기억해야 할 점 |
|--- | --- | --- | ---|
| AppConfig | `language` | `"zh"` | 기본 중국어 |
| AppConfig | `theme` | `"system"` | 시스템 따라가기 |
| AppConfig | `auto_refresh` | `true` | 기본적으로 쿼터 자동 새로고침 |
| AppConfig | `refresh_interval` | `15` | 단위: 분 |
| ProxyConfig | `enabled` | `false` | 기본적으로 리버스 프록시 시작 안 함 |
| ProxyConfig | `allow_lan_access` | `false` | 기본적으로 로컬만 바인딩(프라이버시 우선) |
| ProxyConfig | `auth_mode` | `"off"` | 기본적으로 인증 안 함(로컬 전용 시나리오) |
| ProxyConfig | `port` | `8045` | 가장 자주 변경하는 필드 |
| ProxyConfig | `api_key` | `"sk-<uuid>"` | 기본적으로 랜덤 키 생성 |
| ProxyConfig | `request_timeout` | `120` | 단위: 초(주의: 리버스 프록시 내부에서 현재 사용하지 않을 수 있음) |
| ProxyConfig | `enable_logging` | `true` | 기본적으로 모니터링/통계에 필요한 로그 수집 활성화 |
| StickySessionConfig | `mode` | `Balance` | 스케줄링 전략 기본값은 균형 |
| StickySessionConfig | `max_wait_seconds` | `60` | CacheFirst 모드에서만 의미 있음 |

::: tip 전체 필드를 보려면?
`gui_config.json`을 직접 열어 소스 코드와 비교할 수 있습니다: `src-tauri/src/models/config.rs`(AppConfig)와 `src-tauri/src/proxy/config.rs`(ProxyConfig). 이 수업 끝부분의 "소스 코드 참조"에 클릭 가능한 라인 번호 링크가 있습니다.
:::

### 4단계: "확실히 핫 리로드되는" 설정을 하나 변경하고 즉시 확인(인증 예시)

**왜 필요한가요?**
"변경하고 즉시 확인할 수 있는" 폐루프가 필요해서, UI에서 맹목적으로 변경하는 것을 피하기 위해서입니다.

리버스 프록시가 실행 중일 때, 백엔드 `save_config`는 다음 내용을 메모리로 핫 리로드합니다:

- `proxy.custom_mapping`
- `proxy.upstream_proxy`
- `proxy.auth_mode` / `proxy.api_key`(보안 정책)
- `proxy.zai`
- `proxy.experimental`

여기서 `auth_mode`를 예로 사용하겠습니다:

1. `API Proxy` 페이지를 열고, 리버스 프록시 서비스가 Running 상태인지 확인합니다.
2. `auth_mode`를 `all_except_health`로 설정하고, 현재 `api_key`를 기억합니다.
3. 다음 요청으로 "헬스 체크 통과, 다른 인터페이스 차단"을 확인합니다.

::: code-group

```bash [macOS/Linux]
#key 없이 /healthz 요청: 성공해야 함
curl -sS "http://127.0.0.1:8045/healthz" && echo

#key 없이 /v1/models 요청: 401이어야 함
curl -sS -i "http://127.0.0.1:8045/v1/models"

#key 있이 /v1/models 요청: 성공해야 함
curl -sS -H "Authorization: Bearer <proxy.api_key>" "http://127.0.0.1:8045/v1/models"
```

```powershell [Windows]
#key 없이 /healthz 요청: 성공해야 함
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/healthz" | Select-Object -ExpandProperty StatusCode

#key 없이 /v1/models 요청: 401이어야 함
try { Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" } catch { $_.Exception.Response.StatusCode.value__ }

#key 있이 /v1/models 요청: 성공해야 함
$headers = @{ Authorization = "Bearer <proxy.api_key>" }
(Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" -Headers $headers).StatusCode
```

:::

**보아야 할 것**: `/healthz`는 200을 반환합니다. `/v1/models`는 key 없이 401을 반환하고, key 있으면 성공합니다.

### 5단계: "리버스 프록시 재시작 필요" 설정 변경(포트/리스닝 주소)

**왜 필요한가요?**
많은 설정은 "저장했는데 적용되지 않습니다"인데, 근본 원인은 버그가 아니라 TCP 리스너를 어떻게 바인딩할지 결정하기 때문입니다.

리버스 프록시 시작 시, 백엔드는 `allow_lan_access`를 사용해 리스닝 주소(`127.0.0.1` 또는 `0.0.0.0`)를 계산하고, `port`를 사용해 포트를 바인딩합니다. 이 단계는 `start_proxy_service`에서만 발생합니다.

작업 제안:

1. `API Proxy` 페이지에서 `port`를 새 값(예: `8050`)으로 변경하고 저장합니다.
2. 리버스 프록시 서비스를 중지한 다음 다시 시작합니다.
3. 새 포트로 `/healthz`를 확인합니다.

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:8050/healthz" && echo
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8050/healthz" | Select-Object -ExpandProperty StatusCode
```

:::

**보아야 할 것**: 새 포트에 접근 가능합니다. 이전 포트는 연결 실패하거나 빈 응답을 반환합니다.

::: warning `allow_lan_access`에 대해
소스 코드에서 `allow_lan_access`는 두 가지에 동시에 영향을 줍니다:

1. **리스닝 주소**: `127.0.0.1` 또는 `0.0.0.0`을 바인딩할지 결정(재바인드하려면 리버스 프록시 재시작 필요).
2. **auto 인증 정책**: `auth_mode=auto`일 때, LAN 시나리오는 자동으로 `all_except_health`로 전환됩니다(이 부분은 핫 리로드 가능).
:::

### 6단계: "설정 마이그레이션" 이해(이전 필드는 자동으로 정리됨)

**왜 필요한가요?**
업그레이드 후 `gui_config.json`에서 이전 필드가 보이면 "망가졌다"고 걱정할 수 있습니다. 실제로는 백엔드가 설정을 로드할 때 마이그레이션을 수행합니다: `anthropic_mapping/openai_mapping`을 `custom_mapping`으로 병합하고 이전 필드를 삭제한 다음 자동으로 한 번 저장합니다.

이 규칙으로 자체 확인할 수 있습니다:

- 파일에서 `proxy.anthropic_mapping` 또는 `proxy.openai_mapping`을 보면, 다음 시작/설정 로드 후 제거됩니다.
- 병합 시 `-series`로 끝나는 키는 건너뜁니다(이것은 이제 preset/builtin 로직이 처리합니다).

**보아야 할 것**: 마이그레이션이 발생하면, `gui_config.json`에는 `proxy.custom_mapping`만 남습니다.

## 체크포인트 ✅

- 로컬에서 `$HOME/.antigravity_tools/gui_config.json`를 찾을 수 있습니다
- `auth_mode/api_key/custom_mapping` 같은 설정이 왜 핫 리로드되는지 설명할 수 있습니다
- `port/allow_lan_access` 같은 설정이 왜 리버스 프록시 재시작이 필요한지 설명할 수 있습니다

## 일반적인 실수

1. `save_config`의 핫 리로드는 소수의 필드만 덮어씁니다: 리스너를 재시작하지 않고, `scheduling` 같은 설정을 TokenManager로 푸시하지도 않습니다.
2. `request_timeout`은 리버스 프록시 내부의 현재 구현에서 실제로 작동하지 않습니다: AxumServer의 `start` 매개변수에서는 `_request_timeout`이고, 상태에서는 타임아웃이 `300`초로 하드코딩되어 있습니다.
3. 수동으로 `gui_config.json`에 "커스텀 필드"를 추가하는 것은 신뢰할 수 없습니다: 백엔드가 저장할 때 `AppConfig`로 다시 직렬화하며, 알 수 없는 필드는 삭제됩니다.

## 이 수업 요약

- 설정 저장은 하나의 진입점만 있습니다: `$HOME/.antigravity_tools/gui_config.json`
- ProxyConfig의 "핫 리로드 가능"이 "포트/리스닝 주소 변경 가능"과 같지 않습니다. 바인딩 관련 항목은 모두 리버스 프록시 재시작이 필요합니다
- 이전 매핑 필드를 보면 당황하지 마세요: 설정 로드 시 자동으로 `custom_mapping`으로 마이그레이션되고 이전 필드가 정리됩니다

## 다음 수업 예고

> 다음 수업에서는 **[보안 및 프라이버시: auth_mode, allow_lan_access, 그리고 "계정 정보 누출 금지" 설계](/ko/lbjlaq/Antigravity-Manager/advanced/security/)**를 학습합니다.
>
> 학습하게 될 내용:
> - 언제 인증을 활성화해야 하는지(그리고 왜 `auto`가 LAN 시나리오에서 더 엄격한지)
> - 로컬 리버스 프록시를 LAN/공개 네트워크에 노출할 때의 최소 노출 전략
> - 어떤 데이터가 업스트림으로 전송되고, 어떤 데이터가 로컬에만 저장되는지

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

| 주제 | 파일 경로 | 라인 |
|--- | --- | ---|
| AppConfig 기본값(`AppConfig::new()`) | [`src-tauri/src/models/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/config.rs#L4-L158) | 4-158 |
| ProxyConfig 기본값(포트/인증/리스닝 주소) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L74-L292) | 74-292 |
| StickySessionConfig 기본값(스케줄링) | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L36) | 3-36 |
| 설정 저장 파일 이름 + 마이그레이션 로직(`gui_config.json`) | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| 데이터 디렉터리(`$HOME/.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| `save_config`: 설정 저장 + 핫 리로드할 필드 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| AxumServer: `update_mapping/update_proxy/update_security/...` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L45-L117) | 45-117 |
| `allow_lan_access`의 리스닝 주소 선택 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L81-L92) | 81-92 |
| Proxy 시작 시 바인드 주소와 포트(재시작해야만 변경됨) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L134) | 42-134 |
| `auth_mode=auto`의 실제 규칙 | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L3-L31) | 3-31 |
| 프론트엔드 스케줄링 설정 저장(저장만 하고 백엔드 런타임으로 푸시하지 않음) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L476-L501) | 476-501 |
| Monitor 페이지에서 로그 수집 동적 활성화/비활성화 | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L263) | 174-263 |

</details>
