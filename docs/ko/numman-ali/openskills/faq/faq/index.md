---
title: "자주 묻는 질문: 문제 해결 가이드 | opencode"
subtitle: "자주 묻는 질문: 문제 해결 가이드"
sidebarTitle: "문제가 생겼을 때"
description: "OpenSkills의 자주 묻는 질문 해결 방법을 배웁니다. 설치 실패, 스킬 미로드, AGENTS.md 동기화 등의 문제를 빠르게 해결하고 스킬 관리 효율을 높이세요."
tags:
  - "FAQ"
  - "문제 해결"
  - "자주 묻는 질문"
prerequisite:
  - "start-quick-start"
order: 1
---

# 자주 묻는 질문

## 배우고 나면 할 수 있는 것

이 강의는 OpenSkills 사용 중 자주 묻는 질문을 해결하며, 여러분이 다음을 수행할 수 있도록 돕습니다:

- ✅ 설치 실패 문제를 빠르게 찾고 해결하기
- ✅ OpenSkills와 Claude Code의 관계 이해하기
- ✅ 스킬이 AGENTS.md에 나타나지 않는 문제 해결하기
- ✅ 스킬 업데이트 및 삭제 관련 의문 해결하기
- ✅ 다중 에이전트 환경에서 스킬을 올바르게 구성하기

## 당신의 현재 어려움

OpenSkills를 사용할 때 다음과 같은 문제를 겪을 수 있습니다:

- "설치가 계속 실패하는데, 어디가 잘못된지 모르겠어요"
- "AGENTS.md에 방금 설치한 스킬이 보이지 않아요"
- "스킬이 실제로 어디에 설치된 건지 모르겠어요"
- "OpenSkills를 쓰고 싶은데, Claude Code와 충돌할까 봐 걱정돼요"

이 강의는 이러한 문제의 원인과 해결책을 빠르게 찾도록 돕습니다.

---

## 핵심 개념 질문

### OpenSkills와 Claude Code의 차이점은 무엇인가요?

**간단한 답변**: OpenSkills는 "범용 설치기", Claude Code는 "공식 에이전트"입니다.

**상세 설명**:

| 비교 항목 | OpenSkills | Claude Code |
|---|---|---|
| **포지셔닝** | 범용 스킬 로더 | Anthropic 공식 AI 코딩 에이전트 |
| **지원 범위** | 모든 AI 에이전트(Cursor, Windsurf, Aider 등) | Claude Code 전용 |
| **스킬 형식** | Claude Code와 완벽히 동일 (`SKILL.md`) | 공식 사양 |
| **설치 방식** | GitHub, 로컬 경로, 비공개 저장소에서 설치 | 내장 Marketplace에서 설치 |
| **스킬 저장** | `.claude/skills/` 또는 `.agent/skills/` | `.claude/skills/` |
| **호출 방식** | `npx openskills read <name>` | 내장 `Skill()` 도구 |

**핵심 가치**: OpenSkills는 다른 에이전트도 Anthropic의 스킬 시스템을 사용할 수 있게 해서, 각 에이전트가 개별적으로 구현할 때까지 기다리지 않아도 됩니다.

### 왜 MCP 대신 CLI를 사용하나요?

**핵심 원인**: 스킬은 정적 파일이고, MCP는 동적 도구이며, 둘은 서로 다른 문제를 해결합니다.

| 비교 차원 | MCP(Model Context Protocol) | OpenSkills(CLI) |
|---|---|---|
| **적용 시나리오** | 동적 도구, 실시간 API 호출 | 정적 명령어, 문서, 스크립트 |
| **실행 요구사항** | MCP 서버 필요 | 서버 불필요(순수 파일) |
| **에이전트 지원** | MCP를 지원하는 에이전트 전용 | `AGENTS.md`를 읽을 수 있는 모든 에이전트 |
| **복잡도** | 서버 배포 필요 | 제로 설정 |

**핵심 포인트**:

- **스킬은 파일입니다**: SKILL.md는 정적 명령어 + 리소스(references/, scripts/, assets/)이며, 서버가 필요하지 않습니다
- **에이전트 지원 불필요**: 셸 명령어를 실행할 수 있는 모든 에이전트는 사용 가능합니다
- **공식 설계와 일치**: Anthropic의 스킬 시스템 자체가 파일 시스템 설계이며, MCP 설계가 아닙니다

**요약**: MCP와 스킬 시스템은 서로 다른 문제를 해결합니다. OpenSkills는 스킬의 경량성과 범용성을 유지하며, 모든 에이전트가 MCP를 지원하도록 강제하지 않습니다.

---

## 설치 및 구성 질문

### 설치에 실패하면 어떻게 하나요?

**일반적인 오류와 해결책**:

#### 오류 1: 복제 실패

```bash
Error: Git clone failed
```

**가능한 원인**:
- 네트워크 문제(GitHub 접근 불가)
- Git이 설치되지 않았거나 버전이 오래됨
- 비공개 저장소에 SSH 키가 구성되지 않음

**해결책**:

1. Git이 설치되었는지 확인:
   ```bash
   git --version
   # 다음과 같이 표시되어야 함: git version 2.x.x
   ```

2. 네트워크 연결 확인:
   ```bash
   # GitHub 접근 가능 여부 테스트
   ping github.com
   ```

3. 비공개 저장소는 SSH 구성 필요:
   ```bash
   # SSH 연결 테스트
   ssh -T git@github.com
   ```

#### 오류 2: 경로가 존재하지 않음

```bash
Error: Path does not exist: ./nonexistent-path
```

**해결책**:
- 로컬 경로가 올바른지 확인
- 절대 경로 또는 상대 경로 사용:
  ```bash
  # 절대 경로
  npx openskills install /Users/dev/my-skills

  # 상대 경로
  npx openskills install ./my-skills
  ```

#### 오류 3: SKILL.md를 찾을 수 없음

```bash
Error: No valid SKILL.md found
```

**해결책**:

1. 스킬 디렉토리 구조 확인:
   ```bash
   ls -la ./my-skill
   # 반드시 SKILL.md가 포함되어야 함
   ```

2. SKILL.md에 유효한 YAML frontmatter가 있는지 확인:
   ```markdown
   ---
   name: my-skill
   description: Skill description
   ---

   # Skill content
   ```

### 스킬은 어떤 디렉토리에 설치되나요?

**기본 설치 위치**（프로젝트 로컬）:
```bash
.claude/skills/
```

**전역 설치 위치**（`--global` 사용）:
```bash
~/.claude/skills/
```

**Universal 모드**（`--universal` 사용）:
```bash
.agent/skills/
```

**스킬 검색 우선순위**（높은 순서부터 낮은 순서）:
1. `./.agent/skills/` （프로젝트 로컬, Universal）
2. `~/.agent/skills/` （전역, Universal）
3. `./.claude/skills/` （프로젝트 로컬, 기본）
4. `~/.claude/skills/` （전역, 기본）

**설치된 스킬 위치 확인**:
```bash
npx openskills list
# 출력에 [project] 또는 [global] 태그 표시
```

### Claude Code Marketplace와 어떻게 공존하나요?

**문제**: Claude Code와 OpenSkills를 모두 사용하고 싶은데, 충돌을 어떻게 피할 수 있나요?

**해결책**: Universal 모드 사용

```bash
# .claude/skills/ 대신 .agent/skills/에 설치
npx openskills install anthropics/skills --universal
```

**왜 효과가 있는가**:

| 디렉토리 | 누가 사용 | 설명 |
|---|---|---|
| `.claude/skills/` | Claude Code | Claude Code Marketplace 사용 |
| `.agent/skills/` | OpenSkills | 다른 에이전트(Cursor, Windsurf) 사용 |

**충돌 경고**:

공식 저장소에서 설치할 때 OpenSkills가 다음과 같이 경고합니다:
```
⚠️  Warning: These skills are also available in Claude Code Marketplace.
   Installing to .claude/skills/ may cause conflicts.
   Use --universal to install to .agent/skills/ instead.
```

---

## 사용 관련 질문

### 스킬이 AGENTS.md에 표시되지 않나요?

**증상**: 스킬을 설치한 후 AGENTS.md에 해당 스킬이 없습니다.

**해결 단계**:

#### 1. 동기화 여부 확인

스킬을 설치한 후 `sync` 명령을 실행해야 합니다:

```bash
npx openskills install anthropics/skills
# 스킬 선택...

# 반드시 sync를 실행해야 합니다!
npx openskills sync
```

#### 2. AGENTS.md 위치 확인

```bash
# 기본적으로 AGENTS.md는 프로젝트 루트에 있습니다
cat AGENTS.md
```

사용자 정의 출력 경로를 사용하는 경우, 경로가 올바른지 확인하세요:
```bash
npx openskills sync -o custom-path/AGENTS.md
```

#### 3. 스킬이 선택되었는지 확인

`sync` 명령은 대화형이며, 동기화할 스킬을 선택해야 합니다:

```bash
npx openskills sync

? Select skills to sync:
  ◉ pdf                  [선택됨]
  ◯ check-branch-first   [선택 안됨]
```

#### 4. AGENTS.md 내용 확인

XML 태그가 올바른지 확인하세요:

```xml
<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
```

### 스킬을 어떻게 업데이트하나요?

**모든 스킬 업데이트**:
```bash
npx openskills update
```

**지정한 스킬 업데이트**（쉼표로 구분）:
```bash
npx openskills update pdf,git-workflow
```

**일반적인 문제**:

#### 스킬이 업데이트되지 않음

**증상**: `update` 실행 후 "skipped" 표시됨

**원인**: 스킬 설치 시 소스 정보가 기록되지 않음（이전 버전 동작）

**해결책**:
```bash
# 소스를 기록하여 다시 설치
npx openskills install anthropics/skills
```

#### 로컬 스킬을 업데이트할 수 없음

**증상**: 로컬 경로에서 설치한 스킬이 update 시 오류 발생

**원인**: 로컬 경로 스킬은 수동 업데이트가 필요함

**해결책**:
```bash
# 로컬 경로에서 다시 설치
npx openskills install ./my-skill
```

### 스킬을 어떻게 삭제하나요?

**방법 1: 대화형 삭제**

```bash
npx openskills manage
```

삭제할 스킬을 선택하고, 스페이스바로 선택한 후 엔터로 확인합니다.

**방법 2: 직접 삭제**

```bash
npx openskills remove <skill-name>
```

**삭제 후**: AGENTS.md를 업데이트하기 위해 `sync`를 실행하는 것을 잊지 마세요:
```bash
npx openskills sync
```

**일반적인 문제**:

#### 스킬을 실수로 삭제함

**복구 방법**:
```bash
# 소스에서 다시 설치
npx openskills install anthropics/skills
# 삭제된 스킬 선택
```

#### 삭제 후에도 AGENTS.md에 여전히 표시됨

**해결책**: 다시 동기화
```bash
npx openskills sync
```

---

## 고급 질문

### 스킬을 여러 프로젝트에서 어떻게 공유하나요?

**시나리오**: 여러 프로젝트에서 동일한 스킬 세트를 사용하고 싶지만, 반복 설치를 원하지 않습니다.

**해결책 1: 전역 설치**

```bash
# 한 번 전역 설치
npx openskills install anthropics/skills --global

# 모든 프로젝트에서 사용 가능
cd project-a
npx openskills read pdf

cd project-b
npx openskills read pdf
```

**장점**:
- 한 번 설치하면 어디서나 사용 가능
- 디스크 사용량 감소

**단점**:
- 스킬이 프로젝트에 없어서 버전 관리에 포함되지 않음

**해결책 2: 심볼릭 링크**

```bash
# 1. 전역 스킬 설치
npx openskills install anthropics/skills --global

# 2. 프로젝트에 심볼릭 링크 생성
cd project-a
ln -s ~/.claude/skills/pdf .claude/skills/pdf

# 3. sync 시 [project] 위치로 인식됨
npx openskills sync
```

**장점**:
- 스킬이 프로젝트에 있음(`[project]` 태그)
- 버전 관리가 심볼릭 링크를 포함할 수 있음
- 한 번 설치하면 여러 곳에서 사용

**단점**:
- 특정 시스템에서 심볼릭 링크에 권한이 필요할 수 있음

**해결책 3: Git Submodule**

```bash
# 프로젝트에 스킬 저장소를 submodule로 추가
cd project-a
git submodule add https://github.com/anthropics/skills.git .claude/skills-repo

# submodule의 스킬 설치
npx openskills install .claude/skills-repo/pdf
```

**장점**:
- 완전한 버전 관리
- 스킬 버전 지정 가능

**단점**:
- 구성이 더 복잡함

### 심볼릭 링크에 접근할 수 없나요?

**증상**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**시스템별 해결책**:

#### macOS

1. "시스템 환경 설정" 열기
2. "보안 및 개인 정보 보호"로 이동
3. "전체 디스크 접근 권한"에서 터미널 앱 허용

#### Windows

Windows는 기본적으로 심볼릭 링크를 지원하지 않으므로, 다음을 권장합니다:
- **Git Bash 사용**: 내장 심볼릭 링크 지원
- **WSL 사용**: Linux 하위 시스템이 심볼릭 링크 지원
- **개발자 모드 활성화**: 설정 → 업데이트 및 보안 → 개발자 모드

```bash
# Git Bash에서 심볼릭 링크 생성
ln -s /c/dev/my-skills/my-skill .claude/skills/my-skill
```

#### Linux

파일 시스템 권한 확인:

```bash
# 디렉토리 권한 확인
ls -la .claude/

# 쓰기 권한 추가
chmod +w .claude/
```

### 스킬을 찾을 수 없나요?

**증상**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**해결 단계**:

#### 1. 스킬이 설치되었는지 확인

```bash
npx openskills list
```

#### 2. 스킬 이름 대소문자 확인

```bash
# ❌ 잘못됨 (대문자)
npx openskills read My-Skill

# ✅ 올바름 (소문자)
npx openskills read my-skill
```

#### 3. 더 높은 우선순위의 스킬에 의해 덮어쓰여졌는지 확인

```bash
# 모든 스킬 위치 확인
ls -la .claude/skills/my-skill
ls -la ~/.claude/skills/my-skill
ls -la .agent/skills/my-skill
ls -la ~/.agent/skills/my-skill
```

**스킬 검색 규칙**: 가장 높은 우선순위 위치가 동일한 이름의 다른 위치 스킬을 덮어씁니다.

---

## 이번 강의 요약

OpenSkills 자주 묻는 질문의 핵심 요점:

### 핵심 개념

- ✅ OpenSkills는 범용 설치기이고, Claude Code는 공식 에이전트입니다
- ✅ 스킬 시스템에는 CLI가 MCP보다 더 적합합니다(정적 파일)

### 설치 및 구성

- ✅ 스킬은 기본적으로 `.claude/skills/`에 설치됩니다
- ✅ Claude Code와의 충돌을 피하려면 `--universal`을 사용하세요
- ✅ 설치 실패는 일반적으로 네트워크, Git, 경로 문제 때문입니다

### 사용 팁

- ✅ 설치 후 AGENTS.md에 나타나려면 반드시 `sync`를 실행해야 합니다
- ✅ `update` 명령은 소스 정보가 있는 스킬만 업데이트합니다
- ✅ 스킬을 삭제한 후에는 `sync`를 잊지 마세요

### 고급 시나리오

- ✅ 다중 프로젝트에서 스킬 공유: 전역 설치, 심볼릭 링크, Git Submodule
- ✅ 심볼릭 링크 문제: 시스템별 권한 구성
- ✅ 스킬을 찾을 수 없음: 이름 확인, 우선순위 확인

## 다음 강의 예고

> 다음 강의에서는 **[문제 해결](../troubleshooting/)**을 학습합니다.
>
> 배울 내용:
> - 일반적인 오류의 빠른 진단 및 해결 방법
> - 경로 오류, 복제 실패, 잘못된 SKILL.md 등의 문제 처리
> - 권한 문제 및 심볼릭 링크 오류 해결 기법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|---|---|---|
| 설치 명령 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-424 |
| 동기화 명령 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 1-99 |
| 업데이트 명령 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-113 |
| 삭제 명령 | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30 |
| 스킬 검색 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 1-50 |
| 디렉토리 우선순위 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| AGENTS.md 생성 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93 |

**핵심 함수**:
- `findAllSkills()`: 모든 스킬 검색(우선순위별 정렬)
- `findSkill(name)`: 지정한 스킬 검색
- `generateSkillsXml()`: AGENTS.md XML 형식 생성
- `updateSkillFromDir()`: 디렉토리에서 스킬 업데이트

</details>
