---
title: "배포: 서버 배포 방안 | Antigravity-Manager"
sidebarTitle: "서버에서 실행하기"
subtitle: "배포: 서버 배포 방안"
description: "Antigravity-Manager의 서버 배포 방법을 학습합니다. Docker noVNC와 Headless Xvfb 두 가지 방안을 비교하고, 설치 구성, 데이터 영구화, 헬스 체크 및 문제 해결을 완료하여 운영 가능한 서버 환경을 구축합니다."
tags:
  - "deployment"
  - "docker"
  - "xvfb"
  - "novnc"
  - "systemd"
  - "backup"
prerequisite:
  - "start-installation"
  - "start-backup-migrate"
  - "advanced-security"
duration: 20
order: 10
---
# 서버 배포: Docker noVNC vs Headless Xvfb(선형 및 운영)

Antigravity Tools를 서버에 배포하고 NAS/서버에서 실행하려고 합니다. 일반적으로는 "GUI를 원격으로 열어보는" 것이 목적이 아니라, 장기간 실행되는 로컬 API 게이트웨이로 만드는 것입니다. 항상 온라인 상태이고, 헬스 체크 가능하고, 업그레이드 가능하고, 백업 가능하고, 문제가 발생하면 위치를 찾을 수 있어야 합니다.

이 수업에서는 프로젝트에서 이미 제공된 실현 가능한 두 가지 경로만 설명합니다: Docker(noVNC 포함)와 Headless Xvfb(systemd 관리). 모든 명령과 기본값은 리포지토리의 배포 파일을 기준으로 합니다.

::: tip "일단 실행해 보기"만 원한다면
빠른 시작 편에서 이미 Docker와 Headless Xvfb의 입구 명령을 다루었습니다. 먼저 **[설치 및 업그레이드](/ko/lbjlaq/Antigravity-Manager/start/installation/)**를 보고, 다시 이 수업으로 돌아와 "운영 폐루프"를 완성하세요.
:::

## 이 수업을 마치면 할 수 있는 것

- 올바른 배포 형태를 선택할 수 있습니다: Docker noVNC와 Headless Xvfb가 각각 어떤 문제를 해결하는지 알 수 있습니다
- 폐루프를 완성할 수 있습니다: 배포 → 계정 데이터 동기화 → `/healthz` 헬스 체크 → 로그 보기 → 백업
- 업그레이드를 제어 가능한 동작으로 만들 수 있습니다: Docker의 "시작 시 자동 업데이트"와 Xvfb `upgrade.sh`의 차이를 알 수 있습니다

## 현재의 문제점

- 서버에 데스크톱이 없지만, OAuth/인증 같은 "브라우저 필수" 동작을 떠날 수 없습니다
- 한 번만 실행하는 것만으로는 부족하고, 더 원하는 것은: 전원 재부팅 후 자동 복구, 헬스 체크 가능, 백업 가능
- 8045 포트를 공개하면 보안 리스크가 있는 것을 걱정하지만, 어디서부터 제한해야 할지 모릅니다

## 언제 이 방법을 사용해야 할까요?

- NAS/가정용 서버: 브라우저로 GUI를 열어 인증을 완료할 수 있기를 원합니다(Docker/noVNC가 편함)
- 서버 장기 실행: systemd로 프로세스를 관리하고, 로그를 디스크에 저장하고, 스크립트로 업그레이드하기를 원합니다(Headless Xvfb가 "운영 프로젝트"와 유사함)

## "서버 배포" 모드란 무엇인가요?

**서버 배포**는 로컬 데스크톱에서 Antigravity Tools를 실행하는 것이 아니라, 장기간 온라인 상태인 머신에 배치하여, 리버스 프록시 포트(기본 8045)를 대외 서비스 진입점으로 사용하는 것을 말합니다. 핵심은 "원격으로 인터페이스 보기"가 아니라, 안정적인 운영 폐루프를 구축하는 것입니다: 데이터 영구화, 헬스 체크, 로그, 업그레이드 및 백업.

## 핵심 아이디어

1. 먼저 "가장 부족한 능력"을 선택하세요: 브라우저 인증이 부족하면 Docker/noVNC; 운영 제어 가능성이 부족하면 Headless Xvfb.
2. 다음 "데이터"를 정하세요: 계정/구성은 모두 `.antigravity_tools/`에 있으며, Docker 볼륨이든 `/opt/antigravity/.antigravity_tools/`로 고정하든 합니다.
3. 마지막으로 "운영 가능한 폐루프"를 만드세요: 헬스 체크는 `/healthz`, 문제가 발생하면 먼저 logs를 보고, 재시작 또는 업그레이드를 결정하세요.

::: warning 전제 알림: 보안 기선을 먼저 정하세요
8045를 LAN/공개 네트워크에 공개하려면, 먼저 **[보안 및 프라이버시: auth_mode, allow_lan_access, 그리고 "계정 정보 누출 금지" 설계](/ko/lbjlaq/Antigravity-Manager/advanced/security/)**를 보세요.
:::

## 선형 빠른 참조: Docker vs Headless Xvfb

| 가장 중요한 점 | 더 추천하는 것 | 왜? |
|--- | --- | ---|
| 브라우저가 필요한 OAuth/인증 | Docker(noVNC) | 컨테이너 내에 Firefox ESR이 내장되어 있어, 브라우저에서 직접 조작할 수 있음(`deploy/docker/README.md` 참조) |
| systemd 관리/로그 디스크 저장 원함 | Headless Xvfb | install 스크립트는 systemd service를 설치하고, 로그를 `logs/app.log`에 추가함(`deploy/headless-xvfb/install.sh` 참조) |
| 격리 및 리소스 제한 원함 | Docker | compose 방식은 자연스럽게 격리되며, 리소스 제한 구성도 더 쉬움(`deploy/docker/README.md` 참조) |

## 따라해 보세요

### 1단계: 먼저 "데이터 디렉터리"가 어디에 있는지 확인

**왜 필요한가요?**
배포 성공했지만 "계정/구성이 없다"는 본질적으로 데이터 디렉터리를 가져오지 않았거나 영구화하지 않은 것입니다.

- Docker 방안은 데이터를 컨테이너 내의 `/home/antigravity/.antigravity_tools`에 마운트합니다(compose volume)
- Headless Xvfb 방안은 데이터를 `/opt/antigravity/.antigravity_tools`에 둡니다(그리고 `HOME=$(pwd)`로 쓰기 위치를 고정함)

**보아야 할 것**
- Docker: `docker volume ls`에서 `antigravity_data`를 볼 수 있습니다
- Xvfb: `/opt/antigravity/.antigravity_tools/`가 존재하고, `accounts/`, `gui_config.json`을 포함합니다

### 2단계: Docker/noVNC 실행(브라우저 인증이 필요한 경우에 적합)

**왜 필요한가요?**
Docker 방안은 "가상 디스플레이 + 윈도우 관리자 + noVNC + 애플리케이션 + 브라우저"를 하나의 컨테이너로 패키징하여, 서버에 그래픽 의존성을 많이 설치할 필요가 없게 합니다.

서버에서 실행:

```bash
cd deploy/docker
docker compose up -d
```

noVNC 열기:

```text
http://<server-ip>:6080/vnc_lite.html
```

**보아야 할 것**
- `docker compose ps`에서 컨테이너가 실행 중임을 표시합니다
- 브라우저에서 noVNC 페이지를 열 수 있습니다

::: tip noVNC 포트에 대해(기본값 유지 추천)
`deploy/docker/README.md`에서 `NOVNC_PORT`로 포트를 커스터마이즈할 수 있다고 하지만, 현재 구현에서 `start.sh`가 `websockify`를 시작할 때 하드코딩된 6080 포트를 리스닝합니다. 포트를 수정하려면 docker-compose의 포트 매핑과 start.sh의 리스닝 포트를 동시에 조정해야 합니다.

구성 불일치를 피하기 위해 기본 6080을 직접 사용하는 것이 좋습니다.
:::

### 3단계: Docker의 영구화, 헬스 체크 및 백업

**왜 필요한가요?**
컨테이너의 가용성은 두 가지에 달려 있습니다: 프로세스 건강(여전히 실행 중인지)과 데이터 영구화(재부팅 후 계정이 여전히 있는지).

1) 영구화 volume이 마운트되었는지 확인:

```bash
cd deploy/docker
docker compose ps
```

2) volume 백업(프로젝트 README는 tar 백업 방식을 제공):

```bash
docker run --rm -v antigravity_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/antigravity-backup.tar.gz /data
```

3) 컨테이너 건강 체크(Dockerfile에 HEALTHCHECK 있음):

```bash
docker inspect --format '{{json .State.Health}}' antigravity-manager | jq
```

**보아야 할 것**
- `.State.Health.Status`가 `healthy`입니다
- 현재 디렉터리에 `antigravity-backup.tar.gz`가 생성됩니다

### 4단계: Headless Xvfb 원클릭 설치(systemd 운영을 원하는 경우에 적합)

**왜 필요한가요?**
Headless Xvfb는 "순수 백엔드 모드"가 아니라, 가상 디스플레이를 사용해 GUI 프로그램을 서버에서 실행합니다. 하지만 더 익숙한 운영 방식으로 바꿉니다: systemd, 고정 디렉터리, 로그 디스크 저장.

서버에서 실행(프로젝트 제공 원클릭 스크립트):

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

**보아야 할 것**
- 디렉터리 `/opt/antigravity/`가 존재합니다
- `systemctl status antigravity`에서 서비스가 running임을 표시합니다

::: tip 더 안정적인 방법: 먼저 스크립트 검토
`curl -O .../install.sh`로 다운로드한 후 먼저 한 번 보고, `sudo bash install.sh`를 실행하세요.
:::

### 5단계: 로컬 계정을 서버로 동기화(Xvfb 방안 필수)

**왜 필요한가요?**
Xvfb 설치는 프로그램만 실행합니다. 리버스 프록시가 실제로 작동하려면, 로컬에 이미 있는 계정/구성을 서버의 데이터 디렉터리로 동기화해야 합니다.

프로젝트는 `sync.sh`를 제공하여, 자동으로 머신에서 우선순위별로 데이터 디렉터리를 검색(예: `~/.antigravity_tools`, `~/Library/Application Support/Antigravity Tools`)한 다음, rsync로 서버에 전송합니다:

```bash
curl -O https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/sync.sh
chmod +x sync.sh

./sync.sh root@your-server /opt/antigravity
```

**보아야 할 것**
- 터미널 출력이 유사함: `동기화: <local> -> root@your-server:/opt/antigravity/.antigravity_tools/`
- 원격 서비스가 재시작 시도됩니다(스크립트는 `systemctl restart antigravity`를 호출합니다)

### 6단계: 헬스 체크 및 문제 해결(두 가지 방안 공통)

**왜 필요한가요?**
배포 후 첫 번째 일은 "먼저 클라이언트를 연결하는" 것이 아니라, 빠르게 건강 상태를 판단할 수 있는 진입점을 만드는 것입니다.

1) 헬스 체크(리버스 프록시 서비스가 `/healthz` 제공):

```bash
curl -i http://127.0.0.1:8045/healthz
```

2) 로그 보기:

```bash
## Docker
cd deploy/docker
docker compose logs -f

## Headless Xvfb
tail -f /opt/antigravity/logs/app.log
```

**보아야 할 것**
- `/healthz`가 200을 반환합니다(구체적 응답 바디는 실제 상황을 기준으로 함)
- 로그에서 리버스 프록시 서비스 시작 정보를 볼 수 있습니다

### 7단계: 업그레이드 전략("자동 업데이트"를 유일한 방안으로 간주하지 말기)

**왜 필요한가요?**
업그레이드는 "시스템을 사용할 수 없게 업그레이드"하기 가장 쉬운 동작입니다. 각 방안의 업그레이드가 실제로 무엇을 하는지 알아야 합니다.

- Docker: 컨테이너 시작 시 GitHub API를 통해 최신 `.deb`를 가져와서 설치하려고 시도합니다(속도 제한 또는 네트워크 오류 시 캐시 버전을 계속 사용).
- Headless Xvfb: `upgrade.sh`를 사용해 최신 AppImage를 가져오고, 재시작 실패 시 백업으로 롤백합니다.

Headless Xvfb 업그레이드 명령(프로젝트 README):

```bash
cd /opt/antigravity
sudo ./upgrade.sh
```

**보아야 할 것**
- 출력이 유사함: `업그레이드: v<current> -> v<latest>`
- 업그레이드 후 서비스가 여전히 active입니다(스크립트는 `systemctl restart antigravity`를 호출하고 상태를 확인합니다)

## 일반적인 실수

| 시나리오 | 일반적인 오류(❌) | 추천 방법(✓) |
|--- | --- | ---|
| 계정/구성 분실 | ❌ "프로그램 실행"만 신경씀 | ✓ 먼저 `.antigravity_tools/`가 영구화되었는지 확인(volume 또는 `/opt/antigravity`) |
| noVNC 포트 변경이 적용되지 않음 | ❌ `NOVNC_PORT`만 변경 | ✓ 기본 6080 유지; 변경하려면 `start.sh`에서 `websockify` 포트도 동시에 확인 |
| 8045를 공개 네트워크에 공개 | ❌ `api_key` 설정하지 않음 / auth_mode 확인하지 않음 | ✓ 먼저 **[보안 및 프라이버시](/ko/lbjlaq/Antigravity-Manager/advanced/security/)**로 기선을 만들고, 터널/리버스 프록시 고려 |

## 이 수업 요약

- Docker/noVNC는 "서버에 브라우저/데스크톱이 없지만 인증이 필요한" 문제를 해결하며, NAS 시나리오에 적합합니다
- Headless Xvfb는 더 표준적인 운영과 유사합니다: 고정 디렉터리, systemd 관리, 스크립트 업그레이드/롤백
- 어느 방안이든, 폐루프를 먼저 맞추세요: 데이터 → 헬스 체크 → 로그 → 백업 → 업그레이드

## 계속 보기를 추천합니다

- 서비스를 LAN/공개 네트워크에 공개하려면: **[보안 및 프라이버시: auth_mode, allow_lan_access](/ko/lbjlaq/Antigravity-Manager/advanced/security/)**
- 배포 후 401을 만나면: **[401/인증 실패: auth_mode, Header 호환 및 클라이언트 구성 목록](/ko/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- 터널로 서비스를 공개하려면: **[Cloudflared 원클릭 터널](/ko/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 라인 |
|--- | --- | ---|
| Docker 배포 입구 및 noVNC URL | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L5-L13) | 5-13 |
| Docker 배포 환경 변수 설명(VNC_PASSWORD/RESOLUTION/NOVNC_PORT) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L32-L39) | 32-39 |
| Docker compose 포트 매핑 및 데이터 볼륨(antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L21) | 1-21 |
| Docker 시작 스크립트: 자동 버전 업데이트(GitHub rate limit) | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L27-L58) | 27-58 |
| Docker 시작 스크립트: Xtigervnc/Openbox/noVNC/애플리케이션 시작 | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L60-L78) | 60-78 |
| Docker 건강 체크: Xtigervnc/websockify/antigravity_tools 프로세스 존재 확인 | [`deploy/docker/Dockerfile`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/Dockerfile#L60-L79) | 60-79 |
| Headless Xvfb: 디렉터리 구조 및 운영 명령(systemctl/healthz) | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L19-L78) | 19-78 |
| Headless Xvfb: install.sh 의존성 설치 및 gui_config.json 초기화(기본 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L16-L67) | 16-67 |
| Headless Xvfb: sync.sh 로컬 데이터 디렉터리 자동 발견 및 서버로 rsync | [`deploy/headless-xvfb/sync.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/sync.sh#L8-L32) | 8-32 |
| Headless Xvfb: upgrade.sh 새 버전 다운로드 및 실패 시 롤백 | [`deploy/headless-xvfb/upgrade.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/upgrade.sh#L11-L51) | 11-51 |
| 리버스 프록시 서비스 헬스 체크 엔드포인트 `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |

</details>
