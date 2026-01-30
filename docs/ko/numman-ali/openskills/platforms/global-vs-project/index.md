---
title: "전역 vs 프로젝트: 설치 위치 | OpenSkills"
sidebarTitle: "전역 설치: 프로젝트 간 스킬 공유"
subtitle: "전역 설치 vs 프로젝트 로컬 설치"
description: "OpenSkills 스킬의 전역 설치와 프로젝트 로컬 설치 차이를 학습합니다. --global 플래그 사용을 마스터하고 검색 우선순위 규칙을 이해하여 시나리오에 따른 적절한 설치 위치를 선택합니다."
tags:
  - "플랫폼 통합"
  - "스킬 관리"
  - "구성 팁"
prerequisite:
  - "start-first-skill"
  - "platforms-install-sources"
order: 3
---

# 전역 설치 vs 프로젝트 로컬 설치

## 이 수업을 마치면 할 수 있는 것

- OpenSkills의 두 가지 설치 위치(전역 vs 프로젝트 로컬) 차이 이해
- 시나리오에 따른 적절한 설치 위치 선택
- `--global` 플래그 사용법 마스터
- 스킬 검색 우선순위 규칙 이해
- 일반적인 설치 위치 구성 오류 방지

::: info 사전 지식

이 자습서는 이미 [첫 번째 스킬 설치](../../start/first-skill/)과 [설치 소스 상세 설명](../install-sources/)을 완료했고, 기본적인 스킬 설치 프로세스를 이해하고 있다고 가정합니다.

:::

---

## 현재 겪고 있는 문제

이미 스킬을 설치하는 방법을 배웠을 수도 있지만:

- **스킬이 어디에 설치되었나요?**: `openskills install`을 실행한 후 스킬 파일이 어떤 디렉터리로 복사되었는지 모릅니다.
- **새 프로젝트에서 다시 설치해야 하나요?**: 다른 프로젝트로 전환하면 이전에 설치한 스킬이 보이지 않습니다.
- **전역에서 한 번만 사용하고 싶은 스킬은 어떻게 하나요?**: 모든 프로젝트에 필요한 스킬이 있지만, 각 프로젝트에 모두 설치하고 싶지 않습니다.
- **여러 프로젝트에서 스킬을 공유하고 싶나요?**: 일부 스킬은 팀 전체에서 공통적으로 사용하며 통합 관리하고 싶습니다.

사실 OpenSkills는 두 가지 설치 위치를 제공하여 스킬을 유연하게 관리할 수 있게 해줍니다.

---

## 언제 이 기능을 사용해야 할까요

**두 가지 설치 위치의 적용 시나리오**:

| 설치 위치 | 적용 시나리오 | 예시 |
|--- | --- | ---|
| **프로젝트 로컬**(기본값) | 프로젝트 전용 스킬, 버전 제어 필요 | 팀 비즈니스 규칙, 프로젝트별 도구 |
| **전역 설치**(`--global`) | 모든 프로젝트에 공통적인 스킬, 버전 제어 불필요 | 범용 코드 생성 도구, 파일 형식 변환 |

::: tip 권장 사항

- **기본적으로 프로젝트 로컬 설치 사용**: 스킬이 프로젝트를 따라가도록 하여 팀 협업과 버전 제어가 용이합니다.
- **범용 도구만 전역 설치 사용**: `git-helper`, `docker-generator`와 같은 프로젝트 간 도구의 경우
- **과도한 전역화 피하기**: 전역 설치된 스킬은 모든 프로젝트에서 공유되므로 충돌이나 버전 불일치가 발생할 수 있습니다.

:::

---

## 핵심 아이디어: 두 가지 위치, 유연한 선택

OpenSkills의 스킬 설치 위치는 `--global` 플래그로 제어됩니다:

**기본값(프로젝트 로컬 설치)**:
- 설치 위치: `./.claude/skills/`(프로젝트 루트 디렉터리)
- 적용: 단일 프로젝트 전용 스킬
- 장점: 스킬이 프로젝트를 따르고 Git에 커밋할 수 있으며 팀 협업이 용이합니다.

**전역 설치**:
- 설치 위치: `~/.claude/skills/`(사용자 홈 디렉터리)
- 적용: 모든 프로젝트에 공통적인 스킬
- 장점: 모든 프로젝트에서 공유하며 반복 설치가 필요 없습니다.

::: info 중요한 개념

**프로젝트 로컬**: 스킬은 현재 프로젝트의 `.claude/skills/` 디렉터리에 설치되며 현재 프로젝트에서만 볼 수 있습니다.

**전역 설치**: 스킬은 사용자 홈 디렉터리의 `.claude/skills/`에 설치되며 모든 프로젝트에서 볼 수 있습니다.

:::

---

## 함께 해보기

### 1단계: 기본 설치 동작 확인

**이유**
기본 설치 방법을 먼저 이해하고 OpenSkills의 설계 아이디어를 파악합니다.

터미널을 열고 임의의 프로젝트에서 실행합니다:

```bash
# 테스트 스킬 설치(기본 프로젝트 로컬)
npx openskills install anthropics/skills -y

# 스킬 목록 보기
npx openskills list
```

**다음을 볼 수 있습니다**: 스킬 목록의 각 스킬 뒤에 `(project)` 라벨이 표시됩니다.

```
  codebase-reviewer         (project)
    Review code changes for issues...

Summary: 3 project, 0 global (3 total)
```

**설명**:
- 기본적으로 스킬은 `./.claude/skills/` 디렉터리에 설치됩니다.
- `list` 명령은 `(project)` 또는 `(global)` 라벨을 표시합니다.
- `--global` 플래그를 사용하지 않은 경우 스킬은 현재 프로젝트에서만 볼 수 있습니다.

---

### 2단계: 스킬 설치 위치 확인

**이유**
스킬 파일의 실제 저장 위치를 확인하여 향후 관리가 용이하도록 합니다.

프로젝트 루트 디렉터리에서 실행합니다:

```bash
# 프로젝트 로컬 스킬 디렉터리 보기
ls -la .claude/skills/

# 스킬 디렉터리 내용 보기
ls -la .claude/skills/codebase-reviewer/
```

**다음을 볼 수 있습니다**:

```
.claude/skills/
├── codebase-reviewer/
│   ├── SKILL.md
│   └── .openskills.json    # 설치 메타데이터
├── file-writer/
│   ├── SKILL.md
│   └── .openskills.json
└── ...
```

**설명**:
- 각 스킬은 자신의 디렉터리를 가집니다.
- `SKILL.md`는 스킬의 핵심 내용입니다.
- `.openskills.json`은 설치 소스와 메타데이터를 기록합니다(업데이트에 사용).

---

### 3단계: 스킬 전역 설치

**이유**
전역 설치 명령과 효과를 이해합니다.

실행합니다:

```bash
# 스킬 전역 설치
npx openskills install anthropics/skills --global -y

# 다시 스킬 목록 보기
npx openskills list
```

**다음을 볼 수 있습니다**:

```
  codebase-reviewer         (project)
    Review code changes for issues...
  file-writer              (global)
    Write files with format...

Summary: 1 project, 2 global (3 total)
```

**설명**:
- `--global` 플래그를 사용하면 스킬은 `~/.claude/skills/`에 설치됩니다.
- `list` 명령은 `(global)` 라벨을 표시합니다.
- 동일한 이름의 스킬이 있는 경우 프로젝트 로컬 버전을 우선 사용합니다(검색 우선순위).

---

### 4단계: 두 가지 설치 위치 비교

**이유**
실제 비교를 통해 두 가지 설치 위치의 차이를 이해합니다.

다음 명령을 실행합니다:

```bash
# 전역 설치된 스킬 디렉터리 보기
ls -la ~/.claude/skills/

# 프로젝트 로컬과 전역 설치된 스킬 비교
echo "=== Project Skills ==="
ls .claude/skills/

echo "=== Global Skills ==="
ls ~/.claude/skills/
```

**다음을 볼 수 있습니다**:

```
=== Project Skills ===
codebase-reviewer
file-writer

=== Global Skills ===
codebase-reviewer
file-writer
test-generator
```

**설명**:
- 프로젝트 로컬 스킬: `./.claude/skills/`
- 전역 스킬: `~/.claude/skills/`
- 두 디렉터리에 동일한 이름의 스킬이 포함될 수 있지만 프로젝트 로컬의 우선순위가 더 높습니다.

---

### 5단계: 검색 우선순위 확인

**이유**
OpenSkills가 여러 위치에서 스킬을 찾는 방법을 이해합니다.

실행합니다:

```bash
# 두 위치에 동일한 이름의 스킬 설치
npx openskills install anthropics/skills -y  # 프로젝트 로컬
npx openskills install anthropics/skills --global -y  # 전역

# 스킬 읽기(프로젝트 로컬 버전을 우선 사용)
npx openskills read codebase-reviewer | head -5
```

**다음을 볼 수 있습니다**: 출력은 프로젝트 로컬 버전의 스킬 내용입니다.

**검색 우선순위 규칙**(소스 코드 `dirs.ts:18-24`):

```typescript
export function getSearchDirs(): string[] {
  return [
    join(process.cwd(), '.claude/skills'),   // 1. 프로젝트 로컬(최우선순위)
    join(homedir(), '.claude/skills'),       // 2. 전역
  ];
}
```

**설명**:
- 프로젝트 로컬 스킬의 우선순위는 전역보다 높습니다.
- 동일한 이름의 스킬이 동시에 존재하는 경우 프로젝트 로컬 버전을 우선 사용합니다.
- 이를 통해 "프로젝트가 전역을 덮어쓰는" 유연한 구성을 실현할 수 있습니다.

---

## 체크포인트 ✅

다음 확인을 완료하여 이 수업의 내용을 마스터했는지 확인하세요:

- [ ] 프로젝트 로컬 설치와 전역 설치를 구분할 수 있습니다.
- [ ] `--global` 플래그의 역할을 알고 있습니다.
- [ ] 스킬 검색 우선순위 규칙을 이해합니다.
- [ ] 시나리오에 따른 적절한 설치 위치를 선택할 수 있습니다.
- [ ] 설치된 스킬의 위치 라벨을 보는 방법을 알고 있습니다.

---

## 일반적인 실수提醒

### 일반적인 실수 1: 전역 설치 오용

**오류 시나리오**: 프로젝트 전용 스킬을 전역으로 설치

```bash
**오류 시나리오**: 프로젝트 전용 스킬을 전역으로 설치

```bash
# ❌ 오류: 팀 비즈니스 규칙은 전역으로 설치하면 안 됩니다.
npx openskills install my-company/rules --global
```

**문제점**:
- 팀의 다른 멤버는 해당 스킬을 얻을 수 없습니다.
- 스킬이 버전 제어되지 않습니다.
- 다른 프로젝트의 스킬과 충돌할 수 있습니다.

**올바른 방법**:

```bash
# ✅ 올바름: 프로젝트 전용 스킬은 기본 설치(프로젝트 로컬)를 사용합니다.
npx openskills install my-company/rules
```

---

### 일반적인 실수 2: `--global` 플래그 누락

**오류 시나리오**: 모든 프로젝트에서 스킬을 공유하고 싶지만 `--global`을 추가하는 것을 잊음

```bash
# ❌ 오류: 기본적으로 프로젝트 로컬에 설치되므로 다른 프로젝트에서 사용할 수 없습니다.
npx openskills install universal-tool
```

**문제점**:
- 스킬은 현재 프로젝트의 `./.claude/skills/`에만 설치됩니다.
- 다른 프로젝트로 전환하면 다시 설치해야 합니다.

**올바른 방법**:

```bash
# ✅ 올바름: 범용 도구는 전역 설치를 사용합니다.
npx openskills install universal-tool --global
```

---

### 일반적인 실수 3: 동일한 이름의 스킬 충돌

**오류 시나리오**: 프로젝트 로컬과 전역에 동일한 이름의 스킬이 설치되어 있지만 전역 버전을 사용하려 함

```bash
# 프로젝트 로컬과 전역에 codebase-reviewer가 있습니다.
# 하지만 전역 버전(새 버전)을 사용하고 싶습니다.
npx openskills install codebase-reviewer --global  # 새 버전 설치
npx openskills read codebase-reviewer  # ❌ 여전히 이전 버전을 읽습니다.
```

**문제점**:
- 프로젝트 로컬 버전의 우선순위가 더 높습니다.
- 전역에 새 버전을 설치하더라도 여전히 프로젝트 로컬 이전 버전을 읽습니다.

**올바른 방법**:

```bash
# 방법 1: 프로젝트 로컬 버전 삭제
npx openskills remove codebase-reviewer  # 프로젝트 로컬 삭제
npx openskills read codebase-reviewer  # ✅ 이제 전역 버전을 읽습니다.

# 방법 2: 프로젝트 로컬에서 업데이트
npx openskills update codebase-reviewer  # 프로젝트 로컬 버전 업데이트
```

---

## 이 수업 요약

**핵심 포인트**:

1. **기본적으로 프로젝트 로컬에 설치**: 스킬은 `./.claude/skills/`에 설치되며 현재 프로젝트에서만 볼 수 있습니다.
2. **전역 설치는 `--global` 사용**: 스킬은 `~/.claude/skills/`에 설치되며 모든 프로젝트에서 공유됩니다.
3. **검색 우선순위**: 프로젝트 로컬 > 전역
4. **권장 원칙**: 프로젝트 전용은 로컬, 범용 도구는 전역

**결정 흐름**:

```
[스킬 설치 필요] → [프로젝트 전용인가?]
                      ↓ 예
              [프로젝트 로컬 설치(기본)]
                      ↓ 아니오
              [버전 제어가 필요한가?]
                      ↓ 예
              [프로젝트 로컬 설치(Git 커밋 가능)]
                      ↓ 아니오
              [전역 설치(--global)]
```

**기억 포인트**:

- **프로젝트 로컬**: 스킬이 프로젝트를 따르고 팀 협업에 걱정 없음
- **전역 설치**: 범용 도구를 전역에 두고 모든 프로젝트에서 사용 가능

---

## 다음 수업 예고

> 다음 수업에서는 **[설치된 스킬 나열](../list-skills/)**을 학습합니다.
>
> 다음을 배우게 됩니다:
> - 설치된 모든 스킬 보는 방법
> - 스킬 위치 라벨의 의미 이해
> - 프로젝트 스킬과 전역 스킬의 개수를 통계하는 방법
> - 위치에 따라 스킬을 필터링하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-24

| 기능        | 파일 경로                                                                                          | 행 번호    |
|--- | --- | ---|
| 설치 위치 판단 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92   |
| 디렉터리 경로 도구 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L7-L25)     | 7-25    |
| 스킬 목록 표시 | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts#L20-L43)   | 20-43   |

**주요 상수**:
- `.claude/skills`: 기본 스킬 디렉터리(Claude Code 호환)
- `.agent/skills`: 범용 스킬 디렉터리(다중 에이전트 환경)

**주요 함수**:
- `getSkillsDir(projectLocal, universal)`: 플래그에 따라 스킬 디렉터리 경로를 반환합니다.
- `getSearchDirs()`: 스킬 검색 디렉터리 목록을 반환합니다(우선순위순).
- `listSkills()`: 설치된 모든 스킬을 나열하고 위치 라벨을 표시합니다.

**비즈니스 규칙**:
- 기본적으로 프로젝트 로컬에 설치됩니다(`!options.global`).
- 스킬 검색 우선순위: 프로젝트 로컬 > 전역
- `list` 명령은 `(project)`와 `(global)` 라벨을 표시합니다.

</details>
