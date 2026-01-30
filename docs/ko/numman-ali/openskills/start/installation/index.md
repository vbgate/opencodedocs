---
title: "설치: 빠른 배포 | OpenSkills"
sidebarTitle: "5분 안에 실행하기"
subtitle: "설치: 빠른 배포 | OpenSkills"
description: "OpenSkills 설치 방법을 학습합니다. 5분 내에 환경 설정을 완료하고, npx와 전역 설치 두 가지 방식을 지원하며, 환경 검증 및 문제 해결을 다룹니다."
tags:
  - "설치"
  - "환경 설정"
  - "Node.js"
  - "Git"
prerequisite:
  - "터미널 기본 조작"
duration: 3
order: 3
---

# OpenSkills 도구 설치

## 학습 후 할 수 있는 것

이 과정을 완료하면 다음을 할 수 있습니다:

- Node.js와 Git 환경 확인 및 설정
- `npx` 또는 전역 설치 방식으로 OpenSkills 사용
- OpenSkills가 올바르게 설치되고 사용 가능한지 확인
- 일반적인 설치 문제 해결(버전 불일치, 네트워크 문제 등)

## 현재 겪고 계신 문제

다음과 같은 문제를 겪고 계실 수 있습니다:

- **환경 요구사항 불확실**: 어떤 버전의 Node.js와 Git이 필요한지 모름
- **설치 방법을 모름**: OpenSkills는 npm 패키지지만, npx 또는 전역 설치 중 무엇을 사용해야 할지 불확실
- **설치 실패**: 버전 호환성 또는 네트워크 문제 발생
- **권한 문제**: 전역 설치 시 EACCES 오류 발생

이 과정에서 이러한 문제를 단계별로 해결해 드립니다.

## 언제 사용하는가

다음과 같은 상황에서 사용합니다:

- OpenSkills를 처음 사용할 때
- 새 버전으로 업데이트할 때
- 새로운 기기에서 개발 환경 설정할 때
- 설치 관련 문제를 해결할 때

## 🎒 시작 전 준비

::: tip 시스템 요구사항

OpenSkills는 최소 시스템 요구사항이 있으며, 이를 충족하지 않으면 설치가 실패하거나 실행 오류가 발생합니다.

:::

::: warning 사전 확인

시작하기 전에 다음 소프트웨어가 설치되어 있는지 확인하세요:

1. **Node.js 20.6 이상**
2. **Git** (스킬 저장소에서 복제용)

:::

## 핵심 아이디어

OpenSkills는 Node.js CLI 도구로 두 가지 사용 방식이 있습니다:

| 방식 | 명령 | 장점 | 단점 | 적용 시나리오 |
|--- | --- | --- | --- | ---|
| **npx** | `npx openskills` | 설치 불필요, 최신 버전 자동 사용 | 실행할 때마다 다운로드(캐시 있음) | 가끔 사용, 새 버전 테스트 |
| **전역 설치** | `openskills` | 명령어가 더 짧고 응답이 빠름 | 수동 업데이트 필요 | 자주 사용, 고정 버전 |

**npx 사용을 권장**합니다. OpenSkills를 매우 자주 사용하는 경우가 아니라면 말입니다.

---

## 따라해 보세요

### 1단계: Node.js 버전 확인

먼저 시스템에 Node.js가 설치되어 있는지, 그리고 버전이 요구사항을 충족하는지 확인하세요:

```bash
node --version
```

**이유**

OpenSkills는 Node.js 20.6 이상이 필요하며, 이 버전 미만에서는 런타임 오류가 발생합니다.

**다음과 같이 보여야 합니다**:

```bash
v20.6.0
```

또는 더 높은 버전(예: `v22.0.0`)입니다.

::: danger 버전이 너무 낮음

`v18.x.x` 또는 그 이하 버전(예: `v16.x.x`)이 보인다면 Node.js를 업그레이드해야 합니다.

:::

**버전이 너무 낮은 경우**:

[nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)를 사용하여 Node.js를 설치하고 관리하는 것을 권장합니다:

::: code-group

```bash [macOS/Linux]
# nvm 설치(설치되지 않은 경우)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 터미널 설정 다시 로드
source ~/.bashrc  # 또는 source ~/.zshrc

# Node.js 20 LTS 설치
nvm install 20
nvm use 20

# 버전 확인
node --version
```

```powershell [Windows]
# nvm-windows 다운로드 및 설치
# 방문: https://github.com/coreybutler/nvm-windows/releases

# 설치 후 PowerShell에서 실행:
nvm install 20
nvm use 20

# 버전 확인
node --version
```

:::

**다음과 같이 보여야 합니다** (업그레이드 후):

```bash
v20.6.0
```

---

### 2단계: Git 설치 확인

OpenSkills는 Git을 사용하여 스킬 저장소를 복제합니다:

```bash
git --version
```

**이유**

GitHub에서 스킬을 설치할 때 OpenSkills는 `git clone` 명령을 사용하여 저장소를 다운로드합니다.

**다음과 같이 보여야 합니다**:

```bash
git version 2.40.0
```

(버전 번호는 다를 수 있지만, 출력만 있으면 됩니다)

::: danger Git이 설치되지 않음

`command not found: git` 또는 유사한 오류가 보인다면 Git을 설치해야 합니다.

:::

**Git이 설치되지 않은 경우**:

::: code-group

```bash [macOS]
# macOS는 보통 Git이 사전 설치되어 있지만, 없다면 Homebrew 사용:
brew install git
```

```powershell [Windows]
# Git for Windows 다운로드 및 설치
# 방문: https://git-scm.com/download/win
```

```bash [Linux (Ubuntu/Debian)]
sudo apt update
sudo apt install git
```

```bash [Linux (CentOS/RHEL)]
sudo yum install git
```

:::

설치 완료 후 `git --version`을 다시 실행하여 확인하세요.

---

### 3단계: 환경 확인

이제 Node.js와 Git이 모두 사용 가능한지 확인하세요:

```bash
node --version && git --version
```

**다음과 같이 보여야 합니다**:

```bash
v20.6.0
git version 2.40.0
```

두 명령이 모두 성공적으로 출력되면 환경이 올바르게 구성된 것입니다.

---

### 4단계: npx 방식 사용 (권장)

OpenSkills는 `npx`를 사용하여 직접 실행하는 것을 권장하며, 추가 설치가 필요하지 않습니다:

```bash
npx openskills --version
```

**이유**

`npx`는 최신 버전의 OpenSkills를 자동으로 다운로드하고 실행하며, 수동 설치나 업데이트가 필요 없습니다. 처음 실행할 때 패키지를 로컬 캐시로 다운로드하고, 이후 실행에는 캐시를 사용하므로 속도가 빠릅니다.

**다음과 같이 보여야 합니다**:

```bash
1.5.0
```

(버전 번호는 다를 수 있습니다)

::: tip npx 작동 원리

`npx` (Node Package eXecute)는 npm 5.2.0+에 포함된 도구입니다:
- 첫 번째 실행: npm에서 패키지를 임시 디렉토리로 다운로드
- 이후 실행: 캐시 사용(기본 24시간 만료)
- 업데이트: 캐시 만료 후 자동으로 최신 버전 다운로드

:::

**설치 명령어 테스트**:

```bash
npx openskills list
```

**다음과 같이 보여야 합니다**:

```bash
Installed Skills:

No skills installed. Run: npx openskills install <source>
```

또는 설치된 스킬의 목록이 표시됩니다.

---

### 5단계: (선택 사항) 전역 설치

OpenSkills를 자주 사용한다면 전역 설치를 선택할 수 있습니다:

```bash
npm install -g openskills
```

**이유**

전역 설치 후에는 `openskills` 명령을 직접 사용할 수 있으며, 매번 `npx`를 입력할 필요가 없고 응답이 더 빠릅니다.

**다음과 같이 보여야 합니다**:

```bash
added 4 packages in 3s
```

(출력은 다를 수 있습니다)

::: warning 권한 문제

전역 설치 중 `EACCES` 오류가 발생하면 전역 디렉토리에 쓸 권한이 없는 것입니다.

**해결 방법**:

```bash
# 방법 1: sudo 사용(macOS/Linux)
sudo npm install -g openskills

# 방법 2: npm 권한 수정(권장)
# 전역 설치 디렉토리 확인
npm config get prefix

# 올바른 권한 설정(/usr/local을 실제 경로로 교체)
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin
```

:::

**전역 설치 확인**:

```bash
openskills --version
```

**다음과 같이 보여야 합니다**:

```bash
1.5.0
```

::: tip 전역 설치 업데이트

전역 설치된 OpenSkills를 업데이트하려면:

```bash
npm update -g openskills
```

:::

---

## 체크포인트 ✅

위 단계를 완료한 후 다음을 확인하세요:

- [ ] Node.js 버전이 20.6 이상입니다 (`node --version`)
- [ ] Git이 설치되어 있습니다 (`git --version`)
- [ ] `npx openskills --version` 또는 `openskills --version`이 버전 번호를 올바르게 출력합니다
- [ ] `npx openskills list` 또는 `openskills list`가 정상적으로 실행됩니다

모든 확인 통과 시 축하합니다! OpenSkills가 성공적으로 설치되었습니다.

---

## 일반적인 문제

### 문제 1: Node.js 버전이 너무 낮음

**오류 메시지**:

```bash
Error: The module was compiled against a different Node.js version
```

**원인**: Node.js 버전이 20.6 미만

**해결 방법**:

nvm를 사용하여 Node.js 20 이상 버전을 설치하세요:

```bash
nvm install 20
nvm use 20
```

---

### 문제 2: npx 명령을 찾을 수 없음

**오류 메시지**:

```bash
command not found: npx
```

**원인**: npm 버전이 너무 낮음(npx는 npm 5.2.0+ 필요)

**해결 방법**:

```bash
# npm 업데이트
npm install -g npm@latest

# 버전 확인
npx --version
```

---

### 문제 3: 네트워크 시간 초과 또는 다운로드 실패

**오류 메시지**:

```bash
Error: network timeout
```

**원인**: npm 저장소 접근 제한

**해결 방법**:

```bash
# npm 미러 사용(예: Taobao 미러)
npm config set registry https://registry.npmmirror.com

# 다시 시도
npx openskills --version
```

기본 소스 복원:

```bash
npm config set registry https://registry.npmjs.org
```

---

### 문제 4: 전역 설치 권한 오류

**오류 메시지**:

```bash
Error: EACCES: permission denied
```

**원인**: 전역 설치 디렉토리에 쓸 권한이 없음

**해결 방법**:

"5단계"의 권한 수정 방법을 참조하거나, `sudo`를 사용하세요(권장하지 않음).

---

### 문제 5: Git 복제 실패

**오류 메시지**:

```bash
Error: git clone failed
```

**원인**: SSH 키가 구성되지 않았거나 네트워크 문제

**해결 방법**:

```bash
# Git 연결 테스트
git ls-remote https://github.com/numman-ali/openskills.git

# 실패 시 네트워크 확인 또는 프록시 구성
git config --global http.proxy http://proxy.example.com:8080
```

---

## 요약

이 과정에서 학습한 내용:

1. **환경 요구사항**: Node.js 20.6+ 및 Git
2. **권장 사용 방법**: `npx openskills` (설치 불필요)
3. **선택적 전역 설치**: `npm install -g openskills` (자주 사용 시)
4. **환경 확인**: 버전 번호 및 명령 사용 가능성 확인
5. **일반적인 문제**: 버전 불일치, 권한 문제, 네트워크 문제

이제 OpenSkills 설치가 완료되었습니다. 다음 과정에서는 첫 번째 스킬을 설치하는 방법을 학습합니다.

---

## 다음 과정 예고

> 다음 과정에서 **[첫 번째 스킬 설치](../first-skill/)**를 학습합니다
>
> 학습할 내용:
> - Anthropic 공식 저장소에서 스킬 설치 방법
> - 스킬을 대화형으로 선택하는 기술
> - 스킬 디렉토리 구조
> - 스킬이 올바르게 설치되었는지 확인

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

### 핵심 구성

| 구성 항목         | 파일 경로                                                                                       | 행 번호      |
|--- | --- | ---|
| Node.js 버전 요구사항 | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 45-47     |
| 패키지 정보         | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 1-9       |
| CLI 진입점       | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)             | 39-80     |

### 주요 상수

- **Node.js 요구사항**: `>=20.6.0` (package.json:46)
- **패키지 이름**: `openskills` (package.json:2)
- **버전**: `1.5.0` (package.json:3)
- **CLI 명령어**: `openskills` (package.json:8)

### 종속성 설명

**런타임 종속성** (package.json:48-53):
- `@inquirer/prompts`: 대화형 선택
- `chalk`: 터미널 컬러 출력
- `commander`: CLI 매개변수 구문 분석
- `ora`: 로딩 애니메이션

**개발 종속성** (package.json:54-59):
- `typescript`: TypeScript 컴파일
- `vitest`: 단위 테스트
- `tsup`: 번들 도구

</details>
