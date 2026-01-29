---
title: "설치: Homebrew와 Releases 배포 | Antigravity Manager"
sidebarTitle: "5분 안에 설치"
subtitle: "설치 및 업그레이드: 데스크톱 최적 설치 경로(brew / releases)"
description: "Antigravity Tools의 Homebrew 및 Releases 설치 방법을 학습합니다. 5분 안에 배포 완료, macOS quarantine 문제 및 애플리케이션 손상된 일반 오류 처리, 업그레이드 프로세스 마스터."
tags:
  - "설치"
  - "업그레이드"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 2
---

# 설치 및 업그레이드: 데스크톱 최적 설치 경로(brew / releases)

Antigravity Tools를 빠르게 설치하고 이후 과정을 실행하려면, 이 수업은 한 가지만 합니다: "설치 + 열 수 있음 + 업그레이드 방법 알기"를 명확히 합니다.

## 학습 완료 후 가능한 작업

- 올바른 설치 경로 선택: Homebrew 우선, 다음 GitHub Releases
- macOS 일반 차단(quarantine / "애플리케이션 손상됨") 처리
- 특별한 환경에서 설치: Arch 스크립트, Headless Xvfb, Docker
- 각 설치 방법의 업그레이드 진입점 및 자체 검사 방법 알기

## 현재 겪고 있는 문제

- 문서에 설치 방법이 너무 많아서 어느 것을 선택해야 할지 모름
- macOS 다운로드 후 열 수 없고, "손상됨/열 수 없음" 메시지 표시
- NAS/서버에서 실행 중인데, 데스크톱도 없고 권한 부여가 불편함

## 이 기능을 언제 사용해야 할까

- Antigravity Tools 처음 설치
- 컴퓨터 교체/시스템 재설치 후 환경 복구
- 버전 업그레이드 후 시스템 차단 또는 시작 이상 발생

::: warning 사전 지식
Antigravity Tools가 해결하는 문제가 확실하지 않다면, 먼저 **[Antigravity Tools란 무엇인가](/ko/lbjlaq/Antigravity-Manager/start/getting-started/)**를 보고 와서 설치하면 더 원활합니다.
:::

## 핵심 개념

"데스크톱 우선, 서버는 나중에" 순서로 선택할 것을 권장합니다:

1. 데스크톱(macOS/Linux): Homebrew로 설치 (가장 빠르고, 업그레이드도 가장 편리)
2. 데스크톱(전 플랫폼): GitHub Releases에서 다운로드 (brew 설치 싫거나 네트워크 제한에 적합)
3. 서버/NAS: Docker 우선; 다음 Headless Xvfb (서버에서 데스크톱 애플리케이션 실행처럼 더 가까움)

## 함께 실습

### 1단계: 먼저 설치 방법 선택

**이유**
다른 설치 방법의 "업그레이드/롤백/문제 해결" 비용이 매우 다르므로, 먼저 경로를 선택하면 더 많은 우회를 피할 수 있습니다.

**권장**:

| 시나리오 | 권장 설치 방법 |
|--- | ---|
| macOS / Linux 데스크톱 | Homebrew (옵션 A) |
| Windows 데스크톱 | GitHub Releases (옵션 B) |
| Arch Linux | 공식 스크립트 (Arch 옵션) |
| 원격 서버 데스크톱 없음 | Docker (옵션 D) 또는 Headless Xvfb (옵션 C-Headless) |

**예상 화면**: 어느 행에 속하는지 명확히 알 수 있습니다.

### 2단계: Homebrew로 설치 (macOS / Linux)

**이유**
Homebrew는 "다운로드 및 설치 자동 처리" 경로이며, 업그레이드도 가장 편리합니다.

```bash
#1) 이 저장소의 Tap 구독
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

#2) 애플리케이션 설치
brew install --cask antigravity-tools
```

::: tip macOS 권한 프롬프트
README 언급: macOS에서 권한/격리 관련 문제를 겪으면 다음으로 변경:

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**예상 화면**: `brew`가 설치 성공을 출력하고 시스템에 Antigravity Tools 애플리케이션이 나타납니다.

### 3단계: GitHub Releases에서 수동 설치 (macOS / Windows / Linux)

**이유**
Homebrew를 사용하지 않거나, 설치 패키지 소스를 직접 제어하고 싶을 때, 이 경로가 가장 직접적입니다.

1. 프로젝트 Releases 페이지 열기: `https://github.com/lbjlaq/Antigravity-Manager/releases`
2. 시스템에 맞는 설치 패키지 선택:
   - macOS: `.dmg` (Apple Silicon / Intel)
   - Windows: `.msi` 또는 포터블 버전 `.zip`
   - Linux: `.deb` 또는 `AppImage`
3. 시스템 설치 프로그램 프롬프트에 따라 설치 완료

**예상 화면**: 설치 완료 후 시스템 애플리케이션 목록에서 Antigravity Tools를 찾고 시작할 수 있습니다.

### 4단계: macOS "애플리케이션 손상됨, 열 수 없음" 처리

**이유**
README는 이 시나리오의 수정 방법을 명확히 제공합니다; 동일한 프롬프트를 겪으면 직접 따르세요.

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**예상 화면**: 다시 애플리케이션을 시작할 때 "손상됨/열 수 없음" 차단 프롬프트가 나타나지 않습니다.

### 5단계: 업그레이드 (설치 방법에 따라 선택)

**이유**
업그레이드 시 가장 흔히 하는 함정은 "설치 방법이 변경되어" 어디서 업데이트해야 하는지 모르는 것입니다.

::: code-group

```bash [Homebrew]
#업그레이드 전 먼저 tap 정보 업데이트
brew update

#cask 업그레이드
brew upgrade --cask antigravity-tools
```

```text [Releases]
최신 버전 설치 패키지 재다운로드(.dmg/.msi/.deb/AppImage), 시스템 프롬프트에 따라 덮어쓰기 설치.
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

#README에서 컨테이너 시작 시 최신 release를 가져오려고 시도; 가장 간단한 업그레이드는 컨테이너 재시작
docker compose restart
```

:::

**예상 화면**: 업그레이드 완료 후 애플리케이션이 여전히 정상적으로 시작됨; Docker/Headless 사용 시 계속 헬스체크 엔드포인트에 액세스 가능.

## 기타 설치 방법 (특정 시나리오)

### Arch Linux: 공식 원 클릭 설치 스크립트

README는 Arch 스크립트 진입점을 제공합니다:

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details 이 스크립트가 하는 것은 무엇인가?
GitHub API를 통해 최신 release를 가져오고 `.deb` 자산을 다운로드하여 SHA256을 계산한 다음, PKGBUILD를 생성하고 `makepkg -si`로 설치합니다.
:::

### 원격 서버: Headless Xvfb

인터페이스 없는 Linux 서버에서 GUI 애플리케이션을 실행해야 하는 경우, 프로젝트는 Xvfb 배포를 제공합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

설치 완료 후, 문서가 제공하는 자주 사용하는 자체 검사 명령 포함:

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/서버: Docker (브라우저 VNC 포함)

Docker 배포는 브라우저에서 noVNC 제공 (OAuth/권한 부여 작업에 편리), 동시에 프록시 포트 매핑:

```bash
cd deploy/docker
docker compose up -d
```

다음에 액세스 가능: `http://localhost:6080/vnc_lite.html`.

## 흔한 오류

- brew 설치 실패: 먼저 Homebrew 설치를 확인한 다음 README의 `brew tap` / `brew install --cask` 재시도
- macOS 열 수 없음: `--no-quarantine` 우선 시도; 이미 설치된 경우 `xattr`로 quarantine 정리
- 서버 배포의 한계: Headless Xvfb은 본질적으로 "가상 디스플레이로 데스크톱 프로그램 실행", 리소스 점유는 순수 백엔드 서비스보다 높음

## 이 수업 요약

- 데스크톱 최선: Homebrew (설치 및 업그레이드 모두 편리)
- brew 사용하지 않음: 직접 GitHub Releases 사용
- 서버/NAS: Docker 우선; systemd 관리 필요 시 Headless Xvfb

## 다음 수업 예고

다음 수업에서 "열 수 있음"을 한 단계 더 앞으로: **[데이터 디렉토리, 로그, 트레이 및 자동 시작](/ko/lbjlaq/Antigravity-Manager/start/first-run-data/)** 명확히 하면, 문제 발생 시 어디서 해결할지 알게 됩니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>확장하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 주제 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| Homebrew 설치 (tap + cask) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L112-L127) | 112-127 |
| Releases 수동 다운로드 (각 플랫폼 설치 패키지) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
| Arch 원 클릭 설치 스크립트 진입점 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L134-L140) | 134-140 |
| Arch 설치 스크립트 구현 (GitHub API + makepkg) | [`deploy/arch/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/arch/install.sh#L1-L56) | 1-56 |
| Headless Xvfb 설치 진입점 (curl \| sudo bash) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
| Headless Xvfb 배포/업그레이드/운영 명령 | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L1-L99) | 1-99 |
| Headless Xvfb install.sh (systemd + 8045 기본 구성) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
|--- | --- | ---|
| Docker 배포 설명 (noVNC 6080 / 프록시 8045) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L1-L35) | 1-35 |
| Docker 포트/데이터 볼륨 구성 (8045 + antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L25) | 1-25 |
|--- | --- | ---|

</details>
