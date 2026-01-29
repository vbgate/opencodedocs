---
title: "Cloudflared: 공개 네트워크 노출 로컬 API | Antigravity-Manager"
sidebarTitle: "원격 장치가 로컬 API에 접근"
subtitle: "Cloudflared 원클릭 터널: 로컬 API를 공개 네트워크에 안전하게 노출(기본적으로 안전하지 않음)"
description: "Antigravity Tools의 Cloudflared 원클릭 터널을 학습합니다. Quick/Auth 두 가지 시작 방법을 실행하고, URL이 언제 표시되는지, 복사 및 테스트 방법을 파악하며, proxy.auth_mode + 강력한 API Key로 최소 노출을 수행합니다. 설치 위치, 일반적인 오류 및 문제 해결 아이디어를 포함하여 원격 장치도 로컬 게이트웨이를 안정적으로 호출할 수 있습니다."
tags:
  - "Cloudflared"
  - "내부 네트워크 터널링"
  - "공개 네트워크 액세스"
  - "Tunnel"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 7
---
# Cloudflared 원클릭 터널: 로컬 API를 공개 네트워크에 안전하게 노출(기본적으로 안전하지 않음)

**Cloudflared 원클릭 터널**을 사용하여 로컬 Antigravity Tools API 게이트웨이를 공개 네트워크에 노출합니다(명시적으로 활성화한 경우에만). 원격 장치도 호출할 수 있으며, Quick 및 Auth 두 가지 모드의 동작 차이와 위험 경계를 명확히 파악합니다.

## 학습 후 할 수 있는 것

- 원클릭으로 Cloudflared 터널 설치 및 시작
- Quick 모드(임시 URL) 또는 Auth 모드(명명된 터널) 선택
- 공개 URL을 복사하여 원격 장치가 로컬 API에 액세스
- 터널 보안 위험 이해 및 최소 노출 전략 채택

## 현재 직면한 문제

로컬에서 Antigravity Tools의 API 게이트웨이를 실행했지만 로컬 또는 LAN에서만 액세스할 수 있습니다. 원격 서버, 모바일 장치 또는 클라우드 서비스도 이 게이트웨이를 호출하고 싶지만 공개 IP가 없고 복잡한 서버 배포 솔루션을 설정하고 싶지 않습니다.

## 이 방법을 사용하는 경우

- 공개 IP가 없지만 원격 장치가 로컬 API에 액세스해야 할 때
- 테스트/개발 단계에서 서비스를 빠르게 외부에 노출하고 싶을 때
- 서버 구매를 하지 않고 기존 장치를 사용하고 싶을 때

::: warning 보안 경고
공개 네트워크 노출에는 위험이 있습니다! 반드시:
1. 강력한 API Key 구성(`proxy.auth_mode=strict/all_except_health`)
2. 필요할 때만 터널 활성화, 사용 후 즉시 종료
3. 정기적으로 Monitor 로그 확인, 이상 발견 시 즉시 중지
:::

## 🎒 시작 전 준비

::: warning 전제 조건
- 로컬 리버스 프록시 서비스가 이미 시작됨("API Proxy" 페이지의 스위치가 켜져 있음)
- 최소 1개의 사용 가능한 계정이 추가됨
:::

## Cloudflared란?

**Cloudflared**는 Cloudflare에서 제공하는 터널 클라이언트입니다. 장치와 Cloudflare 사이에 암호화된 채널을 설정하여 로컬 HTTP 서비스를 공개 네트워크에서 액세스할 수 있는 URL로 매핑합니다. Antigravity Tools는 설치, 시작, 중지 및 URL 복사를 UI 작업으로 만들어 검증 폐루프를 빠르게 실행할 수 있게 합니다.

### 지원되는 플랫폼

프로젝트 내장의 "자동 다운로드 + 설치" 로직은 다음 OS/아키텍처 조합만 포함합니다(다른 플랫폼은 `Unsupported platform`을 보고함).

| 운영체제 | 아키텍처 | 지원 상태 |
| --- | --- | --- |
| macOS | Apple Silicon (arm64) | ✅ |
| macOS | Intel (x86_64) | ✅ |
| Linux | x86_64 | ✅ |
| Linux | ARM64 | ✅ |
| Windows | x86_64 | ✅ |

### 두 가지 모드 비교

| 특성 | Quick 모드 | Auth 모드 |
| --- | --- | --- |
| **URL 유형** | `https://xxx.trycloudflare.com`(로그에서 추출한 임시 URL) | 애플리케이션이 자동으로 URL을 추출하지 않을 수 있음(cloudflared 로그에 따라 다름). 진입 도메인은 Cloudflare 측 구성을 기준으로 함 |
| **토큰 필요** | ❌ 필요 없음 | ✅ 필요(Cloudflare 콘솔에서 획득) |
| **안정성** | 프로세스 재시작 시 URL이 변경될 수 있음 | Cloudflare 측 구성 방법에 따라 다름(애플리케이션은 프로세스 시작만 담당) |
| **적합한 시나리오** | 임시 테스트, 빠른 검증 | 장기간 안정적인 서비스, 프로덕션 환경 |
| **추천도** | ⭐⭐⭐ 테스트용 | ⭐⭐⭐⭐⭐ 프로덕션용 |

::: info Quick 모드 URL의 특성
Quick 모드 URL은 시작할 때마다 변경될 수 있으며 랜덤 생성된 `*.trycloudflare.com` 하위 도메인입니다. 고정된 URL이 필요하면 Auth 모드를 사용하고 Cloudflare 콘솔에서 도메인을 바인딩해야 합니다.
:::

## 따라 해 보기

### 1단계: API Proxy 페이지 열기

**이유**
Cloudflared 구성 진입점을 찾습니다.

1. Antigravity Tools 열기
2. 왼쪽 네비게이션에서 **"API Proxy"**(API 리버스 프록시) 클릭
3. **"Public Access (Cloudflared)"** 카드 찾기(페이지 하단, 주황색 아이콘)

**다음을 보아야 합니다**: 확장 가능한 카드, "Cloudflared not installed"(설치되지 않음) 또는 "Installed: xxx"(설치됨) 표시.

### 2단계: Cloudflared 설치

**이유**
Cloudflared 바이너리 파일을 데이터 디렉토리의 `bin` 폴더에 다운로드 및 설치합니다.

#### 설치되지 않은 경우

1. **"Install"**(설치) 버튼 클릭
2. 다운로드 완료까지 대기(네트워크 속도에 따라 약 10-30초)

**다음을 보아야 합니다**:
- 버튼에 로딩 애니메이션 표시
- 완료 후 "Cloudflared installed successfully" 메시지
- 카드에 "Installed: cloudflared version 202X.X.X" 표시

#### 이미 설치된 경우

이 단계를 건너뛰고 3단계로 직접 이동합니다.

::: tip 설치 위치
Cloudflared 바이너리 파일은 "데이터 디렉토리"의 `bin/` 아래에 설치됩니다(데이터 디렉토리 이름은 `.antigravity_tools`).

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/bin/"
```

```powershell [Windows]
Get-ChildItem "$HOME\.antigravity_tools\bin\"
```

:::

데이터 디렉토리 위치가 확실하지 않으면 먼저 **[처음 시작 시 필독: 데이터 디렉토리, 로그, 트레이 및 자동 시작](../../start/first-run-data/)**를 참조하세요.
:::

### 3단계: 터널 모드 선택

**이유**
사용 시나리오에 따라 적절한 모드를 선택합니다.

1. 카드에서 모드 선택 영역 찾기(두 개의 큰 버튼)
2. 클릭하여 선택:

| 모드 | 설명 | 선택 시기 |
| --- | --- | --- |
| **Quick Tunnel** | 자동으로 임시 URL 생성(`*.trycloudflare.com`) | 빠른 테스트, 임시 액세스 |
| **Named Tunnel** | Cloudflare 계정 및 사용자 정의 도메인 사용 | 프로덕션 환경, 고정 도메인 필요 |

::: tip 추천 선택
처음 사용하는 경우 **먼저 Quick 모드**를 선택하여 기능이 요구 사항을 충족하는지 빠르게 검증합니다.
:::

### 4단계: 매개변수 구성

**이유**
모드에 따라 필요한 매개변수 및 옵션을 입력합니다.

#### Quick 모드

1. 포트는 현재 Proxy 포트를 자동으로 사용(기본값은 `8045`, 실제 구성을 기준)
2. **"Use HTTP/2"** 체크(기본적으로 체크됨)

#### Auth 모드

1. **Tunnel Token** 입력(Cloudflare 콘솔에서 획득)
2. 포트는 현재 Proxy 포트를 자동으로 사용(실제 구성을 기준)
3. **"Use HTTP/2"** 체크(기본적으로 체크됨)

::: info Tunnel Token 획득 방법?
1. [Cloudflare Zero Trust 콘솔](https://dash.cloudflare.com/sign-up-to-cloudflare-zero-trust)에 로그인
2. **"Networks"** → **"Tunnels"** 진입
3. **"Create a tunnel"** → **"Remote browser"** 또는 **"Cloudflared"** 클릭
4. 생성된 토큰 복사(예: `eyJhIjoiNj...` 긴 문자열)
:::

#### HTTP/2 옵션 설명

`Use HTTP/2`는 cloudflared를 `--protocol http2`로 시작합니다. 프로젝트 내 문구는 "더 호환 가능(중국 본토 사용자 권장)"으로 설명하며 기본적으로 활성화됩니다.

::: tip 추천 체크
**HTTP/2 옵션은 기본적으로 체크하는 것을 권장**합니다. 특히 중국 네트워크 환경에서는.
:::

### 5단계: 터널 시작

**이유**
로컬에서 Cloudflare로의 암호화된 터널을 설정합니다.

1. 카드 오른쪽 상단의 스위치 클릭(또는 확장 후 **"Start Tunnel"** 버튼)
2. 터널 시작까지 대기(약 5-10초)

**다음을 보아야 합니다**:
- 카드 제목 오른쪽에 녹색 점 표시
- **"Tunnel Running"** 메시지
- 공개 URL 표시(예: `https://random-name.trycloudflare.com`)
- 오른쪽에 복사 버튼: 버튼에 URL의 앞 20자만 표시되지만 클릭하면 전체 URL이 복사됨

::: warning Auth 모드에서는 URL을 볼 수 없을 수 있음
현재 애플리케이션은 cloudflared 로그에서 `*.trycloudflare.com`과 같은 URL만 추출하여 표시합니다. Auth 모드는 보통 이러한 도메인을 출력하지 않으므로 "Running"만 볼 수 있고 URL은 볼 수 없을 수 있습니다. 이 경우 진입 도메인은 Cloudflare 측 구성을 기준으로 합니다.
:::

### 6단계: 공개 네트워크 액세스 테스트

**이유**
터널이 정상적으로 작동하는지 검증합니다.

#### 상태 확인

::: code-group

```bash [macOS/Linux]
#실제 터널 URL로 변경
curl -s "https://your-url.trycloudflare.com/healthz"
```

```powershell [Windows]
Invoke-RestMethod "https://your-url.trycloudflare.com/healthz"
```

:::

**다음을 보아야 합니다**: `{"status":"ok"}`

#### 모델 목록 조회

::: code-group

```bash [macOS/Linux]
#인증 활성화 시 <proxy_api_key>를 키로 변경
curl -s \
  -H "Authorization: Bearer <proxy_api_key>" \
  "https://your-url.trycloudflare.com/v1/models"
```

```powershell [Windows]
Invoke-RestMethod \
  -Headers @{ Authorization = "Bearer <proxy_api_key>" } \
  "https://your-url.trycloudflare.com/v1/models"
```

:::

**다음을 보아야 합니다**: 모델 목록 JSON 반환.

::: tip HTTPS 주의
터널 URL은 HTTPS 프로토콜이며 추가 인증서 구성이 필요 없습니다.
:::

#### OpenAI SDK로 호출(예시)

```python
import openai

#공개 URL 사용
client = openai.OpenAI(
    api_key="your-proxy-api-key",  # 인증 활성화 시
    base_url="https://your-url.trycloudflare.com/v1"
)

#modelId는 /v1/models의 실제 반환을 기준으로

response = client.chat.completions.create(
    model="<modelId>",
    messages=[{"role": "user", "content": "안녕하세요"}]
)

print(response.choices[0].message.content)
```

::: warning 인증 알림
"API Proxy" 페이지에서 인증을 활성화했으면(`proxy.auth_mode=strict/all_except_health`), 요청에 API Key를 휴대해야 합니다:
- Header: `Authorization: Bearer your-api-key`
- 또는: `x-api-key: your-api-key`
:::

### 7단계: 터널 중지

**이유**
사용 후 즉시 중지하여 보안 노출 시간을 줄입니다.

1. 카드 오른쪽 상단의 스위치 클릭(또는 확장 후 **"Stop Tunnel"** 버튼)
2. 중지 완료까지 대기(약 2초)

**다음을 보아야 합니다**:
- 녹색 점 사라짐
- **"Tunnel Stopped"** 메시지
- 공개 URL 사라짐

## 체크포인트 ✅

위 단계를 완료한 후 다음을 수행할 수 있어야 합니다:

- [ ] Cloudflared 바이너리 파일 설치
- [ ] Quick 및 Auth 모드 간 전환
- [ ] 터널 시작 및 공개 URL 획득
- [ ] 공개 URL로 로컬 API 호출
- [ ] 터널 중지

## 피해야 할 함정

### 문제 1: 설치 실패(다운로드 시간 초과)

**증상**: "Install" 클릭 후 오랫동안 응답이 없거나 다운로드 실패 메시지.

**원인**: 네트워크 문제(특히 중국 본토에서 GitHub Releases 액세스).

**해결**:
1. 네트워크 연결 확인
2. VPN 또는 프록시 사용
3. 수동 다운로드: [Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases), 해당 플랫폼 버전 선택, 데이터 디렉토리의 `bin` 폴더에 수동으로 배치, 실행 권한 부여(macOS/Linux).

### 문제 2: 터널 시작 실패

**증상**: 시작 클릭 후 URL이 표시되지 않거나 오류 메시지.

**원인**:
- Auth 모드에서 토큰 무효
- 로컬 리버스 프록시 서비스 시작되지 않음
- 포트가 사용 중

**해결**:
1. Auth 모드: 토큰이 올바르고 만료되지 않았는지 확인
2. "API Proxy" 페이지의 리버스 프록시 스위치가 켜져 있는지 확인
3. 포트 `8045`가 다른 프로그램에서 사용 중인지 확인

### 문제 3: 공개 URL에 액세스할 수 없음

**증상**: curl 또는 SDK로 공개 URL 호출 시 시간 초과.

**원인**:
- 터널 프로세스 예기치 않게 종료
- Cloudflare 네트워크 문제
- 로컬 방화벽 차단

**해결**:
1. 카드에 "Tunnel Running" 표시가 있는지 확인
2. 카드에 오류 메시지(빨간색 텍스트)가 있는지 확인
3. 로컬 방화벽 설정 확인
4. 터널 재시작 시도

### 문제 4: 인증 실패(401)

**증상**: 요청이 401 오류를 반환.

**원인**: 프록시가 인증을 활성화했지만 요청에 API Key가 휴대되지 않음.

**해결**:
1. "API Proxy" 페이지의 인증 모드 확인
2. 요청에 올바른 Header 추가:
    ```bash
    curl -H "Authorization: Bearer your-api-key" \
          https://your-url.trycloudflare.com/v1/models
    ```

## 이 수업 요약

Cloudflared 터널은 로컬 서비스를 빠르게 노출하는 강력한 도구입니다. 이 수업을 통해 다음을 학습했습니다:

- **원클릭 설치**: UI 내에서 Cloudflared 자동 다운로드 및 설치
- **두 가지 모드**: Quick(임시) 및 Auth(명명) 선택
- **공개 네트워크 액세스**: HTTPS URL 복사, 원격 장치 직접 호출
- **보안 인식**: 인증 활성화, 사용 후 즉시 중지, 정기적으로 로그 확인

기억하세요: **터널은 양날의 검**입니다. 잘 사용하면 편리하지만 잘못 사용하면 위험이 있습니다. 항상 최소 노출 원칙을 따르세요.

## 다음 수업 예고

다음 수업에서는 **[구성 완전 해설: AppConfig/ProxyConfig, 저장 위치 및 핫 업데이트 의미](/ko/lbjlaq/Antigravity-Manager/advanced/config/)**를 학습합니다.

학습하게 될 내용:
- AppConfig 및 ProxyConfig의 완전한 필드
- 구성 파일의 저장 위치
- 어떤 구성이 재시작이 필요하고 어떤 구성이 핫 업데이트 가능

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 데이터 디렉토리 이름(`.antigravity_tools`) | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| 구성 구조 및 기본값(`CloudflaredConfig`, `TunnelMode`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L16-L59) | 16-59 |
| 자동 다운로드 URL 규칙(지원되는 OS/아키텍처) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L70-L88) | 70-88 |
| 설치 로직(다운로드/쓰기/압축 해제/권한) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L147-L211) | 147-211 |
| Quick/Auth 시작 매개변수(`tunnel --url` vs `tunnel run --token`) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L233-L266) | 233-266 |
| URL 추출 규칙(`*.trycloudflare.com`만 인식) | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L390-L413) | 390-413 |
| Tauri 명령 인터페이스(check/install/start/stop/get_status) | [`src-tauri/src/commands/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/cloudflared.rs#L6-L118) | 6-118 |
| UI 카드(모드/Token/HTTP2/URL 표시 및 복사) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1597-L1753) | 1597-1753 |
| 시작 전에 Proxy Running 필요(toast + return) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L256-L306) | 256-306 |

**핵심 상수**:
- `DATA_DIR = ".antigravity_tools"`: 데이터 디렉토리 이름(소스코드: `src-tauri/src/modules/account.rs`)

**핵심 함수**:
- `get_download_url()`: GitHub Releases 다운로드 주소 조합(소스코드: `src-tauri/src/modules/cloudflared.rs`)
- `extract_tunnel_url()`: 로그에서 Quick 모드 URL 추출(소스코드: `src-tauri/src/modules/cloudflared.rs`)

</details>
