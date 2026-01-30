---
title: "CI/CD: 비대화식 통합 | OpenSkills"
sidebarTitle: "원클릭 CI/CD 구성"
subtitle: "CI/CD: 비대화식 통합 | OpenSkills"
description: "OpenSkills CI/CD 통합을 배우고, -y 플래그로 비대화식 설치 및 동기화를 마스터합니다. GitHub Actions, Docker 실전 예제를 포함하여 스킬 관리 자동화를 구현합니다."
tags:
  - "고급"
  - "CI/CD"
  - "자동화"
  - "배포"
prerequisite:
  - "start-first-skill"
  - "start-sync-to-agents"
  - "platforms-cli-commands"
order: 6
---

# CI/CD 통합

## 이 수업을 마치면 할 수 있는 것

- CI/CD 환경에서 비대화식 모드가 필요한 이유 이해
- `install` 및 `sync` 명령에서 `--yes/-y` 플래그 사용 마스터
- GitHub Actions, GitLab CI 등 CI 플랫폼에서 OpenSkills 통합
- Docker 컨테이너에서 스킬 자동 설치 프로세스 이해
- CI/CD 환경에서 스킬 업데이트 및 동기화 전략 마스터
- CI/CD 프로세스에서 대화식 프롬프트로 인한 실패 방지

::: info 사전 지식

이 튜토리얼은 [첫 번째 스킬 설치](../../start/first-skill/) 및 [스킬을 AGENTS.md에 동기화](../../start/sync-to-agents/), 기본적인 [명령어 상세 설명](../../platforms/cli-commands/)을 이미 이해했다고 가정합니다.

:::

---

## 현재 겪고 있는 어려움

로컬 환경에서는 OpenSkills를 능숙하게 사용할 수 있지만, CI/CD 환경에서 다음 문제에 직면했을 수 있습니다:

- **대화식 프롬프트로 인한 실패**: CI 프로세스에서 선택 화면이 표시되어 계속 진행할 수 없음
- **자동 배포 시 스킬 설치 필요**: 빌드할 때마다 스킬을 다시 설치해야 하지만 자동으로 확인할 수 없음
- **다중 환경 구성 동기화 안 됨**: 개발, 테스트, 프로덕션 환경의 스킬 구성이 일관되지 않음
- **AGENTS.md 생성 자동화 안 됨**: 배포 후마다 수동으로 sync 명령 실행 필요
- **Docker 이미지 빌드 시 스킬 누락**: 컨테이너 시작 후 스킬을 수동으로 설치해야 함

사실 OpenSkills는 `--yes/-y` 플래그를 제공하여 비대화식 환경을 위한 특별한 기능을 지원합니다. 이를 통해 CI/CD 프로세스에서 모든 작업을 자동화할 수 있습니다.

---

## 언제 이 방법을 사용해야 할까

**CI/CD 통합에 적합한 시나리오**:

| 시나리오 | 비대화식 모드 필요 여부 | 예시 |
|--- | --- | ---|
| **GitHub Actions** | ✅ 예 | PR 또는 push 시 자동으로 스킬 설치 |
| **GitLab CI** | ✅ 예 | 병합 요청 시 자동으로 AGENTS.md 동기화 |
| **Docker 빌드** | ✅ 예 | 이미지 빌드 시 컨테이너에 자동으로 스킬 설치 |
| **Jenkins 파이프라인** | ✅ 예 | 지속적 통합 시 자동으로 스킬 업데이트 |
| **개발 환경 초기화 스크립트** | ✅ 예 | 신규 팀원이 코드를 가져온 후 원클릭으로 환경 구성 |
| **프로덕션 환경 배포** | ✅ 예 | 배포 시 자동으로 최신 스킬 동기화 |

::: tip 권장 사항

- **로컬 개발용 대화식**: 수동 작업 시 설치할 스킬을 신중하게 선택
- **CI/CD용 비대화식**: 자동화 프로세스에서는 `-y` 플래그를 사용하여 모든 프롬프트 건너뛰기
- **환경 분리 전략**: 다른 환경에서 다른 스킬 소스 사용(예: 프라이빗 저장소)

:::

---

## 핵심 아이디어: 비대화식 모드

OpenSkills의 `install` 및 `sync` 명령은 모두 `--yes/-y` 플래그를 지원하여 대화식 프롬프트를 건너뜁니다:

**install 명령의 비대화식 동작**(소스 코드 `install.ts:424-427`):

```typescript
// Interactive selection (unless -y flag or single skill)
let skillsToInstall = skillInfos;

if (!options.yes && skillInfos.length > 1) {
  // 대화식 선택 프로세스 진입
  // ...
}
```

**비대화식 모드 특징**:

1. **스킬 선택 건너뛰기**: 찾은 모든 스킬 설치
2. **자동 덮어쓰기**: 이미 존재하는 스킬이 있으면 바로 덮어씀(`Overwriting: <skill-name>` 표시)
3. **충돌 확인 건너뛰기**: 덮어쓸지 묻지 않고 바로 실행
4. **headless 환경 호환**: TTY가 없는 CI 환경에서 정상 작동

**warnIfConflict 함수 동작**(소스 코드 `install.ts:524-527`):

```typescript
if (skipPrompt) {
  // 비대화식 모드에서 자동 덮어쓰기
  console.log(chalk.dim(`Overwriting: ${skillName}`));
  return true;
}
```

::: important 중요 개념

**비대화식 모드**: `--yes/-y` 플래그를 사용하여 대화식 프롬프트를 건너뛰고, CI/CD, 스크립트, TTY가 없는 환경에서 사용자 입력 없이 명령을 자동 실행합니다.

:::

---

## 따라해 보세요

### 1단계: 비대화식 설치 체험

**왜 이 작업인가**
먼저 로컬에서 비대화식 모드의 동작을 체험하여 대화식과의 차이를 이해합니다.

터미널에서 다음을 실행합니다:

```bash
# 비대화식 설치(찾은 모든 스킬 설치)
npx openskills install anthropics/skills --yes

# 또는 약어 사용
npx openskills install anthropics/skills -y
```

**다음을 볼 수 있어야 합니다**:

```
Cloning into '/tmp/openskills-temp-...'...
...
Found 3 skill(s)

Overwriting: codebase-reviewer
Overwriting: file-writer
Overwriting: git-helper

✅ Installed 3 skill(s)

Next: Run 'openskills sync' to generate AGENTS.md
```

**설명**:
- `-y` 플래그를 사용하면 스킬 선택 화면이 건너뜁니다
- 찾은 모든 스킬이 자동으로 설치됩니다
- 이미 존재하는 스킬이 있으면 `Overwriting: <skill-name>`을 표시하고 바로 덮어씁니다
- 확인 대화 상자가 표시되지 않습니다

---

### 2단계: 대화식과 비대화식 비교

**왜 이 작업인가**
비교를 통해 두 모드의 차이와 적용 시나리오를 더 명확하게 이해합니다.

다음 명령을 실행하여 두 모드를 비교합니다:

```bash
# 기존 스킬 삭제(테스트용)
rm -rf .claude/skills

# 대화식 설치(선택 화면이 표시됨)
echo "=== 대화식 설치 ==="
npx openskills install anthropics/skills

# 기존 스킬 삭제
rm -rf .claude/skills

# 비대화식 설치(모든 스킬 자동 설치)
echo "=== 비대화식 설치 ==="
npx openskills install anthropics/skills -y
```

**다음을 볼 수 있어야 합니다**:

**대화식 모드**:
- 스킬 목록 표시, Space 키로 선택
- Enter 키로 확인 필요
- 일부 스킬만 선택적으로 설치 가능

**비대화식 모드**:
- 설치 프로세스를 바로 표시
- 모든 스킬 자동 설치
- 사용자 입력 불필요

**비교 테이블**:

| 기능 | 대화식 모드(기본) | 비대화식 모드(-y) |
|--- | --- | ---|
| **스킬 선택** | 선택 화면 표시, 수동으로 선택 | 찾은 모든 스킬 자동 설치 |
| **덮어쓰기 확인** | 이미 존재하는 스킬 덮어쓸지 묻기 | 자동으로 덮어쓰기, 프롬프트 표시 |
| **TTY 요구** | 대화식 터미널 필요 | 불필요, CI 환경에서 실행 가능 |
| **적용 시나리오** | 로컬 개발, 수동 작업 | CI/CD, 스크립트, 자동화 프로세스 |
| **입력 요구** | 사용자 입력 필요 | 입력 불필요, 자동 실행 |

---

### 3단계: AGENTS.md 비대화식 동기화

**왜 이 작업인가**
자동화 프로세스에서 AGENTS.md를 생성하여 AI 에이전트가 항상 최신 스킬 목록을 사용하도록 합니다.

다음을 실행합니다:

```bash
# 비대화식 동기화(모든 스킬을 AGENTS.md에 동기화)
npx openskills sync -y

# 생성된 AGENTS.md 보기
cat AGENTS.md | head -20
```

**다음을 볼 수 있어야 합니다**:

```
✅ Synced 3 skill(s) to AGENTS.md
```

AGENTS.md 내용:

```xml
<skills_system>
This project uses the OpenSkills system for AI agent extensibility.

Usage:
- Ask the AI agent to load specific skills using: "Use the <skill-name> skill"
- The agent will read the skill definition from .claude/skills/<skill-name>/SKILL.md
- Skills provide specialized capabilities like code review, file writing, etc.
</skills_system>

<available_skills>
  <skill name="codebase-reviewer">
    <description>Review code changes for issues...</description>
  </skill>
  <skill name="file-writer">
    <description>Write files with format...</description>
  </skill>
  <skill name="git-helper">
    <description>Git operations and utilities...</description>
  </skill>
</available_skills>
```

**설명**:
- `-y` 플래그로 스킬 선택 화면이 건너뜁니다
- 설치된 모든 스킬이 AGENTS.md에 동기화됩니다
- 확인 대화 상자가 표시되지 않습니다

---

### 4단계: GitHub Actions 통합

**왜 이 작업인가**
실제 CI/CD 프로세스에서 OpenSkills를 통합하여 스킬 관리 자동화를 구현합니다.

프로젝트에서 `.github/workflows/setup-skills.yml` 파일을 생성합니다:

```yaml
name: Setup Skills

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills (non-interactive)
        run: openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: openskills sync -y

      - name: Verify AGENTS.md
        run: |
          echo "=== AGENTS.md generated ==="
          cat AGENTS.md

      - name: Upload AGENTS.md as artifact
        uses: actions/upload-artifact@v4
        with:
          name: agents-md
          path: AGENTS.md
```

커밋하고 GitHub로 푸시합니다:

```bash
git add .github/workflows/setup-skills.yml
git commit -m "Add GitHub Actions workflow for OpenSkills"
git push
```

**다음을 볼 수 있어야 합니다**: GitHub Actions가 자동으로 실행되고 스킬을 성공적으로 설치한 후 AGENTS.md를 생성합니다.

**설명**:
- push 또는 PR 시 자동으로 트리거됨
- `openskills install anthropics/skills -y`로 스킬 비대화식 설치
- `openskills sync -y`로 AGENTS.md 비대화식 동기화
- AGENTS.md를 artifact로 저장하여 디버깅에 용이

---

### 5단계: 프라이빗 저장소 사용

**왜 이 작업인가**
엔터프라이즈 환경에서 스킬은 일반적으로 프라이빗 저장소에 호스팅되며, CI/CD에서 SSH를 통해 액세스해야 합니다.

GitHub Actions에서 SSH를 구성합니다:

```yaml
name: Setup Skills from Private Repo

on:
  push:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH key
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills from private repo
        run: openskills install git@github.com:your-org/private-skills.git -y

      - name: Sync to AGENTS.md
        run: openskills sync -y
```

GitHub 저장소의 **Settings → Secrets and variables → Actions**에서 `SSH_PRIVATE_KEY`를 추가합니다.

**다음을 볼 수 있어야 합니다**: GitHub Actions가 프라이빗 저장소에서 스킬을 성공적으로 설치합니다.

**설명**:
- Secrets를 사용하여 개인 키를 저장하여 노출 방지
- SSH로 프라이빗 저장소 액세스 구성
- `openskills install git@github.com:your-org/private-skills.git -y`로 프라이빗 저장소 설치 지원

---

### 6단계: Docker 시나리오 통합

**왜 이 작업인가**
Docker 이미지 빌드 시 자동으로 스킬을 설치하여 컨테이너 시작 후 즉시 사용할 수 있도록 합니다.

`Dockerfile`을 생성합니다:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# OpenSkills 설치
RUN npm install -g openskills

# 스킬 설치(비대화식)
RUN openskills install anthropics/skills -y

# AGENTS.md 동기화
RUN openskills sync -y

# 애플리케이션 코드 복사
COPY . .

# 기타 빌드 단계...
RUN npm install
RUN npm run build

# 시작 명령
CMD ["node", "dist/index.js"]
```

빌드 및 실행:

```bash
# Docker 이미지 빌드
docker build -t myapp:latest .

# 컨테이너 실행
docker run -it --rm myapp:latest sh

# 컨테이너에서 스킬 설치 확인
ls -la .claude/skills/
cat AGENTS.md
```

**다음을 볼 수 있어야 합니다**: 컨테이너에 스킬이 이미 설치되어 있고 AGENTS.md가 생성되어 있습니다.

**설명**:
- Docker 이미지 빌드 단계에서 스킬 설치
- `RUN openskills install ... -y`로 비대화식 설치 사용
- 컨테이너 시작 후 스킬 수동 설치 불필요
- 마이크로서비스, Serverless 등 시나리오에 적합

---

### 7단계: 환경 변수 구성

**왜 이 작업인가**
환경 변수를 통해 유연하게 스킬 소스를 구성하여 다른 환경에서 다른 스킬 저장소를 사용합니다.

`.env.ci` 파일을 생성합니다:

```bash
# CI/CD 환경 구성
SKILLS_SOURCE=anthropics/skills
SKILLS_INSTALL_FLAGS=-y
SYNC_FLAGS=-y
```

CI/CD 스크립트에서 사용:

```bash
#!/bin/bash
# .github/scripts/setup-skills.sh

set -e

# 환경 변수 로드
if [ -f .env.ci ]; then
  export $(cat .env.ci | grep -v '^#' | xargs)
fi

echo "Installing skills from: $SKILLS_SOURCE"
npx openskills install $SKILLS_SOURCE $SKILLS_INSTALL_FLAGS

echo "Syncing to AGENTS.md"
npx openskills sync $SYNC_FLAGS

echo "✅ Skills setup completed"
```

GitHub Actions에서 호출:

```yaml
- name: Setup skills
  run: .github/scripts/setup-skills.sh
```

**다음을 볼 수 있어야 합니다**: 스크립트가 환경 변수에 따라 자동으로 스킬 소스와 플래그를 구성합니다.

**설명**:
- 환경 변수를 통해 유연하게 스킬 소스 구성
- 다른 환경(개발, 테스트, 프로덕션)에서 다른 `.env` 파일 사용 가능
- CI/CD 구성의 유지 관리성 유지

---

## 체크포인트 ✅

다음 항목을 확인하여 이 수업 내용을 마스터했는지 확인합니다:

- [ ] 비대화식 모드의 용도와 특징 이해
- [ ] `-y` 플래그로 비대화식 설치 가능
- [ ] `-y` 플래그로 비대화식 동기화 가능
- [ ] 대화식과 비대화식의 차이 이해
- [ ] GitHub Actions에서 OpenSkills 통합 가능
- [ ] Docker 이미지 빌드 시 스킬 설치 가능
- [ ] CI/CD에서 프라이빗 저장소 처리 방법 이해
- [ ] 환경 변수 구성 모범 사례 이해

---

## 흔한 실수 알림

### 일반적인 실수 1: -y 플래그 추가를 잊음

**오류 시나리오**: GitHub Actions에서 `-y` 플래그 사용을 잊음

```yaml
# ❌ 오류: -y 플래그 누락
- name: Install skills
  run: openskills install anthropics/skills
```

**문제점**:
- CI 환경에는 대화식 터미널(TTY)이 없음
- 명령이 사용자 입력을 기다려 workflow가 시간 초과 실패
- 오류 메시지가 명확하지 않을 수 있음

**올바른 방법**:

```yaml
# ✅ 올바름: -y 플래그 사용
- name: Install skills
  run: openskills install anthropics/skills -y
```

---

### 일반적인 실수 2: 스킬 덮어쓰기로 인한 구성 손실

**오류 시나리오**: CI/CD가 매번 스킬을 덮어써서 로컬 구성이 손실됨

```bash
# CI/CD에서 스킬을 전역 디렉터리에 설치
openskills install anthropics/skills --global -y

# 로컬 사용자가 프로젝트 디렉터리에 설치했지만 전역으로 덮어씀
```

**문제점**:
- 전역 설치된 스킬의 우선순위가 프로젝트 로컬보다 낮음
- CI/CD와 로컬 설치 위치가 일치하지 않아 혼란
- 로컬 사용자가 신중하게 구성한 스킬을 덮어쓸 수 있음

**올바른 방법**:

```bash
# 방법 1: CI/CD와 로컬 모두 프로젝트 설치 사용
openskills install anthropics/skills -y

# 방법 2: Universal 모드 사용으로 충돌 방지
openskills install anthropics/skills --universal -y

# 방법 3: CI/CD에 전용 디렉터리 사용(사용자 정의 출력 경로)
openskills install anthropics/skills -y
openskills sync -o .agents-md/AGENTS.md -y
```

---

### 일반적인 실수 3: Git 액세스 권한 부족

**오류 시나리오**: 프라이빗 저장소에서 스킬을 설치할 때 SSH 키를 구성하지 않음

```yaml
# ❌ 오류: SSH 키 미구성
- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

**문제점**:
- CI 환경에서 프라이빗 저장소 액세스 불가
- 오류 메시지: `Permission denied (publickey)`
- 복제 실패, workflow 실패

**올바른 방법**:

```yaml
# ✅ 올바름: SSH 키 구성
- name: Setup SSH key
  env:
    SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts

- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

---

### 일반적인 실수 4: Docker 이미지 크기 과대

**오류 시나리오**: Dockerfile에서 스킬 설치로 인해 이미지 크기가 너무 큼

```dockerfile
# ❌ 오류: 매번 복제 및 설치 반복
RUN openskills install anthropics/skills -y
```

**문제점**:
- 빌드할 때마다 GitHub에서 저장소 복제
- 빌드 시간 및 이미지 크기 증가
- 네트워크 문제로 실패 가능

**올바른 방법**:

```dockerfile
# ✅ 올바름: 다단계 빌드 및 캐시 사용
FROM node:20-alpine AS skills-builder

RUN npm install -g openskills
RUN openskills install anthropics/skills -y
RUN openskills sync -y

# 메인 이미지
FROM node:20-alpine

WORKDIR /app

# 설치된 스킬 복사
COPY --from=skills-builder ~/.claude /root/.claude
COPY --from=skills-builder /app/AGENTS.md /app/

# 애플리케이션 코드 복사
COPY . .

# 기타 빌드 단계...
```

---

### 일반적인 실수 5: 스킬 업데이트 누락

**오류 시나리오**: CI/CD가 매번 구버전 스킬을 설치함

```yaml
# ❌ 오류: 설치만 하고 업데이트 안 함
- name: Install skills
  run: openskills install anthropics/skills -y
```

**문제점**:
- 스킬 저장소가 업데이트되었을 수 있음
- CI/CD가 설치한 스킬 버전이 최신이 아님
- 기능 누락 또는 버그 가능

**올바른 방법**:

```yaml
# ✅ 올바름: 업데이트 후 동기화
- name: Update skills
  run: openskills update -y

- name: Sync to AGENTS.md
  run: openskills sync -y

# 또는 install 시 업데이트 전략 사용
- name: Install or update skills
  run: |
    openskills install anthropics/skills -y || openskills update -y
```

---

## 수업 요약

**핵심 포인트**:

1. **CI/CD에는 비대화식 모드 사용**: `-y` 플래그로 대화식 프롬프트 건너뛰기
2. **install 명령의 -y 플래그**: 찾은 모든 스킬 자동 설치, 존재하는 스킬 덮어쓰기
3. **sync 명령의 -y 플래그**: 모든 스킬을 AGENTS.md에 자동 동기화
4. **GitHub Actions 통합**: workflow에서 비대화식 명령 사용으로 스킬 관리 자동화
5. **Docker 시나리오**: 이미지 빌드 단계에서 스킬 설치, 컨테이너 시작 후 즉시 사용 가능
6. **프라이빗 저장소 액세스**: SSH 키 구성으로 프라이빗 스킬 저장소 액세스
7. **환경 변수 구성**: 환경 변수로 유연하게 스킬 소스 및 설치 파라미터 구성

**결정 프로세스**:

```
[CI/CD에서 OpenSkills 사용 필요] → [스킬 설치]
                                     ↓
                             [-y 플래그로 대화 건너뛰기]
                                     ↓
                             [AGENTS.md 생성]
                                     ↓
                             [-y 플래그로 대화 건너뛰기]
                                     ↓
                             [스킬이 올바르게 설치되었는지 확인]
```

**기억할 점**:

- **CI/CD에 -y 추가**: 비대화식이 핵심
- **GitHub Actions에 SSH 사용**: 프라이빗 저장소에 키 구성 필요
- **Docker 빌드에 조기 설치**: 이미지 크기 주의
- **환경 변수 구성**: 다른 환경 구분 필요

---

## 다음 수업 미리보기

> 다음 수업에서는 **[보안 설명](../security/)**을 학습합니다.
>
> 다음을 배울 수 있습니다:
> - OpenSkills 보안 기능 및 보호 메커니즘
> - 경로 순회 보호 작동 원리
> - 심볼릭 링크의 보안 처리 방식
> - YAML 구문 분석 보안 조치
> - 권한 관리 모범 사례

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 줄 번호 |
|--- | --- | ---|
| 비대화식 설치 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L424-L455) | 424-455 |
| 충돌 감지 및 덮어쓰기 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L521-L550) | 521-550 |
| 비대화식 동기화 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| 명령줄 인수 정의 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L49) | 49 |
| 명령줄 인수 정의 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L65) | 65 |

**핵심 상수**:
- `-y, --yes`: 대화식 선택을 건너뛰는 명령줄 플래그

**핵심 함수**:
- `warnIfConflict(skillName, targetPath, isProject, skipPrompt)`: 스킬 충돌을 감지하고 덮어쓸지 결정
- `installFromRepo()`: 저장소에서 스킬 설치(비대화식 모드 지원)
- `syncAgentsMd()`: 스킬을 AGENTS.md에 동기화(비대화식 모드 지원)

**비즈니스 규칙**:
- `-y` 플래그 사용 시 모든 대화식 프롬프트 건너뜀
- 스킬이 이미 존재하면 비대화식 모드에서 자동으로 덮어씀(`Overwriting: <skill-name>` 표시)
- 비대화식 모드는 headless 환경(TTY 없음)에서 정상 작동
- `install` 및 `sync` 명령 모두 `-y` 플래그 지원

</details>
