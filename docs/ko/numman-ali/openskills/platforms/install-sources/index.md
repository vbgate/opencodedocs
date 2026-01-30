---
title: "설치 출처: 다양한 방식으로 스킬 설치 | openskills"
sidebarTitle: "세 가지 출처 중 선택"
subtitle: "설치 출처 상세 설명"
description: "OpenSkills 스킬의 세 가지 설치 방식을 학습합니다. GitHub 저장소, 로컬 경로, 프라이빗 Git 저장소에서 스킬을 설치하는 방법을 포함하여 SSH/HTTPS 인증 및 서브 경로 설정을 익히세요."
tags:
- "플랫폼 통합"
- "스킬 관리"
- "설치 설정"
prerequisite:
- "start-first-skill"
order: 2
---

# 설치 출처 상세 설명

## 학습 완료 후 할 수 있는 것

- 세 가지 방식으로 스킬 설치: GitHub 저장소, 로컬 경로, 프라이빗 Git 저장소
- 상황에 가장 적합한 설치 출처 선택
- 다양한 출처의 장단점과 주의사항 이해
- GitHub shorthand, 상대 경로, 프라이빗 저장소 URL 등의 작성법 익히기

::: info 사전 지식

본 튜토리얼은 [첫 번째 스킬 설치](../../start/first-skill/)를 완료하고 기본 설치 프로세스를 이해하고 있다고 가정합니다.

:::

---

## 현재 직면한 문제

공식 저장소에서 스킬을 설치하는 방법을 배웠지만, 다음과 같은 의문이 있을 수 있습니다:

- **GitHub만 사용할 수 있나요?**: 내부 GitLab 저장소를 사용하고 싶은데 설정 방법을 모름
- **로컬 개발 중인 스킬은 어떻게 설치하나요?**: 자체 스킬을 개발 중이며 로컬에서 먼저 테스트하고 싶음
- **특정 스킬을 직접 지정하고 싶음**: 저장소에 여러 스킬이 있는데 매번 대화형 인터페이스를 통해 선택하고 싶지 않음
- **프라이빗 저장소는 어떻게 접근하나요?**: 회사 스킬 저장소가 프라이빗인데 인증 방법을 모름

실제로 OpenSkills는 다양한 설치 출처를 지원합니다. 하나씩 살펴보겠습니다.

---

## 이 기능을 사용해야 할 때

**다양한 설치 출처의 적용 상황**:

| 설치 출처 | 적용 상황 | 예시 |
| --- | --- | --- |
| **GitHub 저장소** | 오픈소스 커뮤니티의 스킬 사용 | `openskills install anthropics/skills` |
| **로컬 경로** | 자체 스킬 개발 및 테스트 | `openskills install ./my-skill` |
| **프라이빗 Git 저장소** | 회사 내부 스킬 사용 | `openskills install git@github.com:my-org/private-skills.git` |

::: tip 권장 사항

- **오픈소스 스킬**: 업데이트 편의를 위해 GitHub 저장소 설치를 우선적으로 고려
- **개발 단계**: 실시간 수정 테스트를 위해 로컬 경로에서 설치
- **팀 협업**: 프라이빗 Git 저장소를 사용하여 내부 스킬을 통합 관리

:::

---

## 핵심 개념: 세 가지 출처, 동일한 메커니즘

설치 출처가 다르더라도 OpenSkills의 기본 메커니즘은 동일합니다:

```
[출처 유형 식별] → [스킬 파일 가져오기] → [.claude/skills/에 복사]
```

**출처 식별 로직** (소스코드 `install.ts:25-45`):

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**판단 우선순위**:
1. 먼저 로컬 경로인지 확인 (`isLocalPath`)
2. 다음으로 Git URL인지 확인 (`isGitUrl`)
3. 마지막으로 GitHub shorthand로 처리 (`owner/repo`)

---

## 따라하기

### 방식 1: GitHub 저장소에서 설치

**적용 상황**: 오픈소스 커뮤니티의 스킬을 설치할 때, 예를 들어 Anthropic 공식 저장소나 서드파티 스킬 패키지.

#### 기본 사용법: 전체 저장소 설치

```bash
npx openskills install owner/repo
```

**예시**: Anthropic 공식 저장소에서 스킬 설치

```bash
npx openskills install anthropics/skills
```

**예상 출력**:

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### 고급 사용법: 서브 경로 지정 (특정 스킬 직접 설치)

저장소에 여러 스킬이 있는 경우, 설치할 스킬의 서브 경로를 직접 지정하여 대화형 선택을 건너뛸 수 있습니다:

```bash
npx openskills install owner/repo/skill-name
```

**예시**: PDF 처리 스킬을 직접 설치

```bash
npx openskills install anthropics/skills/pdf
```

**예상 출력**:

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
Location: /path/to/project/.claude/skills/pdf
```

::: tip 권장 사항

저장소에서 하나의 스킬만 필요한 경우, 서브 경로 형식을 사용하면 대화형 선택을 건너뛰고 더 빠르게 설치할 수 있습니다.

:::

#### GitHub shorthand 규칙 (소스코드 `install.ts:131-143`)

| 형식 | 예시 | 변환 결과 |
| --- | --- | --- |
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |

---

### 방식 2: 로컬 경로에서 설치

**적용 상황**: 자체 스킬을 개발 중이며 GitHub에 게시하기 전에 로컬에서 테스트하고 싶을 때.

#### 절대 경로 사용

```bash
npx openskills install /absolute/path/to/skill
```

**예시**: 홈 디렉토리의 스킬 디렉토리에서 설치

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### 상대 경로 사용

```bash
npx openskills install ./local-skills/my-skill
```

**예시**: 프로젝트 디렉토리의 `local-skills/` 서브 디렉토리에서 설치

```bash
npx openskills install ./local-skills/web-scraper
```

**예상 출력**:

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
Location: /path/to/project/.claude/skills/web-scraper
```

::: warning 주의사항

로컬 경로 설치는 스킬 파일을 `.claude/skills/`에 복사하며, 이후 원본 파일의 수정 내용이 자동으로 동기화되지 않습니다. 업데이트가 필요한 경우 재설치해야 합니다.

:::

#### 여러 스킬이 포함된 로컬 디렉토리 설치

로컬 디렉토리 구조가 다음과 같은 경우:

```
local-skills/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

전체 디렉토리를 직접 설치할 수 있습니다:

```bash
npx openskills install ./local-skills
```

이렇게 하면 대화형 선택 인터페이스가 시작되어 설치할 스킬을 선택할 수 있습니다.

#### 로컬 경로 지원 형식 (소스코드 `install.ts:25-32`)

| 형식 | 설명 | 예시 |
| --- | --- | --- |
| `/absolute/path` | 절대 경로 | `/home/user/skills/my-skill` |
| `./relative/path` | 현재 디렉토리의 상대 경로 | `./local-skills/my-skill` |
| `../relative/path` | 상위 디렉토리의 상대 경로 | `../shared-skills/common` |
| `~/path` | 홈 디렉토리의 상대 경로 | `~/dev/my-skills` |

::: tip 개발 팁

`~` 축약어를 사용하면 홈 디렉토리의 스킬을 빠르게 참조할 수 있어 개인 개발 환경에 적합합니다.

:::

---

### 방식 3: 프라이빗 Git 저장소에서 설치

**적용 상황**: 회사 내부 GitLab/Bitbucket 저장소나 프라이빗 GitHub 저장소를 사용할 때.

#### SSH 방식 (권장)

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**예시**: GitHub 프라이빗 저장소에서 설치

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**예상 출력**:

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip 인증 설정

SSH 방식은 SSH 키가 이미 설정되어 있어야 합니다. 클론에 실패하면 다음을 확인하세요:

```bash
# SSH 연결 테스트
ssh -T git@github.com

# "Hi username! You've successfully authenticated..." 메시지가 표시되면 설정이 올바른 것입니다
```

:::

#### HTTPS 방식 (자격 증명 필요)

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning HTTPS 인증

HTTPS 방식으로 프라이빗 저장소를 클론할 때 Git은 사용자 이름과 비밀번호(또는 Personal Access Token)를 입력하라고 요청합니다. 2단계 인증을 사용하는 경우 계정 비밀번호 대신 Personal Access Token을 사용해야 합니다.

:::

#### 기타 Git 호스팅 플랫폼

**GitLab (SSH)**:

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab (HTTPS)**:

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket (SSH)**:

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket (HTTPS)**:

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip 권장 사항

팀 내부 스킬은 프라이빗 Git 저장소를 사용하는 것이 좋습니다:
- 모든 팀원이 동일한 출처에서 설치 가능
- 스킬 업데이트 시 `openskills update`만 실행하면 됨
- 버전 관리와 권한 제어가 용이

:::

#### Git URL 인식 규칙 (소스코드 `install.ts:37-45`)

| 접두사/접미사 | 설명 | 예시 |
| --- | --- | --- |
| `git@` | SSH 프로토콜 | `git@github.com:owner/repo.git` |
| `git://` | Git 프로토콜 | `git://github.com/owner/repo.git` |
| `http://` | HTTP 프로토콜 | `http://github.com/owner/repo.git` |
| `https://` | HTTPS 프로토콜 | `https://github.com/owner/repo.git` |
| `.git` 접미사 | Git 저장소 (모든 프로토콜) | `owner/repo.git` |

---

## 체크포인트 ✅

본 강의를 완료한 후 다음 사항을 확인하세요:

- [ ] GitHub 저장소에서 스킬을 설치하는 방법을 알고 있음 (`owner/repo` 형식)
- [ ] 저장소에서 특정 스킬을 직접 설치하는 방법을 알고 있음 (`owner/repo/skill-name`)
- [ ] 로컬 경로를 사용하여 스킬을 설치하는 방법을 알고 있음 (`./`, `~/` 등)
- [ ] 프라이빗 Git 저장소에서 스킬을 설치하는 방법을 알고 있음 (SSH/HTTPS)
- [ ] 다양한 설치 출처의 적용 상황을 이해하고 있음

---

## 문제 해결 팁

### 문제 1: 로컬 경로가 존재하지 않음

**현상**:

```
Error: Path does not exist: ./local-skills/my-skill
```

**원인**:
- 경로 철자 오류
- 상대 경로 계산 오류

**해결 방법**:
1. 경로가 존재하는지 확인: `ls ./local-skills/my-skill`
2. 상대 경로 혼란을 피하기 위해 절대 경로 사용

---

### 문제 2: 프라이빗 저장소 클론 실패

**현상**:

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**원인**:
- SSH 키가 설정되지 않음
- 저장소 접근 권한이 없음
- 저장소 주소가 잘못됨

**해결 방법**:
1. SSH 연결 테스트: `ssh -T git@github.com`
2. 저장소 접근 권한이 있는지 확인
3. 저장소 주소가 올바른지 확인

::: tip 힌트

프라이빗 저장소의 경우 도구는 다음과 같은 힌트를 표시합니다 (소스코드 `install.ts:167`):

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### 문제 3: 서브 경로에서 SKILL.md를 찾을 수 없음

**현상**:

```
Error: SKILL.md not found at skills/my-skill
```

**원인**:
- 서브 경로 오류
- 저장소의 디렉토리 구조가 예상과 다름

**해결 방법**:
1. 먼저 서브 경로 없이 전체 저장소 설치: `npx openskills install owner/repo`
2. 대화형 인터페이스를 통해 사용 가능한 스킬 확인
3. 올바른 서브 경로를 사용하여 재설치

---

### 문제 4: GitHub shorthand 인식 오류

**현상**:

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**원인**:
- 형식이 어떤 규칙에도 맞지 않음
- 철자 오류 (예: `owner / repo` 중간에 공백)

**해결 방법**:
- 형식이 올바른지 확인 (공백 없음, 슬래시 수량 정확)
- shorthand 대신 전체 Git URL 사용

---

## 강의 요약

본 강의를 통해 다음을 학습했습니다:

- **세 가지 설치 출처**: GitHub 저장소, 로컬 경로, 프라이빗 Git 저장소
- **GitHub shorthand**: `owner/repo` 및 `owner/repo/skill-name` 두 가지 형식
- **로컬 경로 형식**: 절대 경로, 상대 경로, 홈 디렉토리 축약
- **프라이빗 저장소 설치**: SSH 및 HTTPS 두 가지 방식, 다양한 플랫폼의 작성법
- **출처 식별 로직**: 도구가 제공된 설치 출처 유형을 판단하는 방법

**핵심 명령어 요약**:

| 명령어 | 기능 |
| --- | --- |
| `npx openskills install owner/repo` | GitHub 저장소에서 설치 (대화형 선택) |
| `npx openskills install owner/repo/skill-name` | 저장소에서 특정 스킬 직접 설치 |
| `npx openskills install ./local-skills/skill` | 로컬 경로에서 설치 |
| `npx openskills install ~/dev/my-skills` | 홈 디렉토리에서 설치 |
| `npx openskills install git@github.com:owner/private-skills.git` | 프라이빗 Git 저장소에서 설치 |

---

## 다음 강의 예고

> 다음 강의에서는 **[전역 설치 vs 프로젝트 로컬 설치](../global-vs-project/)**를 학습합니다.
>
> 학습 내용:
> - `--global` 플래그의 기능과 설치 위치
> - 전역 설치와 프로젝트 로컬 설치의 차이점
> - 상황에 따른 적절한 설치 위치 선택
> - 다중 프로젝트에서 스킬 공유하는 모범 사례

설치 출처는 스킬 관리의 일부일 뿐, 다음으로는 스킬의 설치 위치가 프로젝트에 미치는 영향을 이해해야 합니다.

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| 설치 명령어 진입점 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| 로컬 경로 판단 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Git URL 판단 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| GitHub shorthand 파싱 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| 로컬 경로 설치 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Git 저장소 클론 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| 프라이빗 저장소 오류 힌트 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**핵심 함수**:
- `isLocalPath(source)` - 로컬 경로인지 판단 (25-32 라인)
- `isGitUrl(source)` - Git URL인지 판단 (37-45 라인)
- `installFromLocal()` - 로컬 경로에서 스킬 설치 (199-226 라인)
- `installSpecificSkill()` - 지정된 서브 경로의 스킬 설치 (272-316 라인)
- `getRepoName()` - Git URL에서 저장소명 추출 (50-56 라인)

**핵심 로직**:
1. 출처 유형 판단 우선순위: 로컬 경로 → Git URL → GitHub shorthand (111-143 라인)
2. GitHub shorthand는 두 가지 형식 지원: `owner/repo` 및 `owner/repo/skill-name` (132-142 라인)
3. 프라이빗 저장소 클론 실패 시 SSH 키 또는 자격 증명 설정 힌트 표시 (167 라인)

</details>
