---
title: "스킬 업데이트: 최신 버전 유지 | opencode-openskills"
sidebarTitle: "원클릭 스킬 업데이트"
subtitle: "스킬 업데이트: 최신 버전 유지"
description: "OpenSkills update 명령어로 설치된 스킬을 새로고침하는 방법을 배우세요. 모든 스킬 또는 지정된 스킬을 일괄 업데이트하고, 로컬 경로와 git 저장소 업데이트의 차이를 이해하여 스킬을 최신 상태로 유지하세요."
tags:
  - "skills"
  - "update"
  - "git"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 5
---

# 스킬 업데이트: 스킬을 소스 저장소와 동기화 유지

## 이 과정을 배우면 할 수 있는 것

이 과정에서는 OpenSkills 스킬을 항상 최신 버전으로 유지하는 방법을 배웁니다. OpenSkills update 명령어를 통해 다음을 수행할 수 있습니다:

- 설치된 모든 스킬을 원클릭으로 업데이트
- 지정된 몇 개의 스킬만 선택적 업데이트
- 다른 설치 출처에 따른 업데이트 차이 이해
- 업데이트 실패 원인 분석 및 해결

## 현재 겪고 있는 문제

스킬 저장소는 지속적으로 업데이트됩니다—저자가 버그를 수정하고, 새로운 기능을 추가하고, 문서를 개선할 수 있습니다. 하지만 설치된 스킬은 여전히 이전 버전입니다.

다음 상황을 이미 겪어보셨을지도 모릅니다:
- 스킬 문서에서 "특정 기능을 지원한다"고 하지만 AI 에이전트는 모른다고 합니다
- 스킬이 더 나은 오류 메시지로 업데이트되었지만, 여전히 이전 메시지를 봅니다
- 설치 시 발생했던 버그가 이미 수정되었지만 여전히 영향을 받고 있습니다

**매번 삭제 후 다시 설치하는 것은 번거로운 작업**—효율적인 업데이트 방법이 필요합니다.

## 언제 이 기능을 사용해야 하나요

`update` 명령어의 일반적인 사용 시나리오:

| 시나리오 | 작업 |
|--- | ---|
| 스킬에 업데이트가 있음을 발견 | `openskills update` 실행 |
| 몇 개의 스킬만 업데이트 | `openskills update skill1,skill2` |
| 로컬 개발 중인 스킬 테스트 | 로컬 경로에서 업데이트 |
| GitHub 저장소에서 업데이트 | 자동으로 git clone으로 최신 코드 가져오기 |

::: tip 업데이트 빈도 권장사항
- **커뮤니티 스킬**: 월 1회 업데이트로 최신 개선사항 확보
- **직접 개발한 스킬**: 수정 후 수동 업데이트
- **로컬 경로 스킬**: 코드 수정 후 매번 업데이트
:::

## 🎒 시작 전 준비

시작하기 전에 다음이 완료되었는지 확인하세요:

- [x] OpenSkills가 설치됨 ([OpenSkills 설치](../../start/installation/) 참조)
- [x] 최소 하나의 스킬이 설치됨 ([첫 번째 스킬 설치](../../start/first-skill/) 참조)
- [x] GitHub에서 설치한 경우 인터넷 연결 확인

## 핵심 원리

OpenSkills의 업데이트 메커니즘은 간단합니다:

**설치 시 출처 정보 기록 → 업데이트 시 원본 출처에서 다시 복사**

::: info 왜 재설치가 필요한가요?
이전 버전의 스킬(설치 시 출처가 기록되지 않음)은 업데이트할 수 없습니다. 이 경우 한 번 다시 설치하면 OpenSkills가 출처를 기억하고, 이후 자동 업데이트가 가능해집니다.
:::

**세 가지 설치 출처의 업데이트 방식**:

| 출처 유형 | 업데이트 방식 | 사용 시나리오 |
|--- | --- | ---|
| **로컬 경로** | 로컬 경로에서 직접 복사 | 자체 스킬 개발 |
| **git 저장소** | 임시 디렉토리에 최신 코드 클론 | GitHub/GitLab에서 설치 |
| **GitHub shorthand** | 전체 URL로 변환 후 클론 | GitHub 공식 저장소에서 설치 |

업데이트 시 출처 메타데이터가 없는 스킬은 건너뛰고, 재설치가 필요한 스킬 이름을 나열합니다.

## 따라해 보세요

### 1단계: 설치된 스킬 확인

먼저 업데이트 가능한 스킬이 무엇인지 확인하세요:

```bash
npx openskills list
```

**예상 결과**: 설치된 스킬 목록, 이름, 설명, 설치 위치 태그(project/global) 포함

### 2단계: 모든 스킬 업데이트

가장 간단한 방법은 설치된 모든 스킬을 업데이트하는 것입니다:

```bash
npx openskills update
```

**예상 결과**: 스킬을 하나씩 업데이트하며 각 스킬의 업데이트 결과 표시

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Skipped: my-old-skill (no source metadata; re-install once to enable updates)
Summary: 2 updated, 1 skipped (3 total)
```

::: details 건너뛴 스킬의 의미
`Skipped: xxx (no source metadata)`가 표시되면, 이 스킬은 업데이트 기능이 추가되기 전에 설치된 것입니다. 자동 업데이트를 활성화하려면 한 번 다시 설치해야 합니다.
:::

### 3단계: 지정된 스킬 업데이트

특정 몇 개의 스킬만 업데이트하려면 스킬 이름을 쉼표로 구분하여 전달하세요:

```bash
npx openskills update git-workflow,check-branch-first
```

**예상 결과**: 지정된 두 스킬만 업데이트됨

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Summary: 2 updated, 0 skipped (2 total)
```

### 4단계: 로컬 개발 스킬 업데이트

로컬에서 스킬을 개발 중이라면 로컬 경로에서 업데이트할 수 있습니다:

```bash
npx openskills update my-skill
```

**예상 결과**: 스킬이 설치 시 로컬 경로에서 다시 복사됨

```
✅ Updated: my-skill
Summary: 1 updated, 0 skipped (1 total)
```

::: tip 로컬 개발 워크플로우
개발 프로세스:
1. 스킬 설치: `openskills install ./my-skill`
2. 코드 수정
3. 스킬 업데이트: `openskills update my-skill`
4. AGENTS.md에 동기화: `openskills sync`
:::

### 5단계: 업데이트 실패 처리

일부 스킬 업데이트가 실패하면 OpenSkills가 자세한 원인을 표시합니다:

```bash
npx openskills update
```

**발생 가능한 상황**:

```
Skipped: git-workflow (git clone failed)
Skipped: my-skill (local source missing)
Missing source metadata (1): old-skill
Clone failed (1): git-workflow
```

**해결 방법**:

| 오류 메시지 | 원인 | 해결 방법 |
|--- | --- | ---|
| `no source metadata` | 이전 버전 설치 | 재설치: `openskills install <source>` |
| `local source missing` | 로컬 경로 삭제됨 | 로컬 경로 복구 또는 재설치 |
| `SKILL.md missing at local source` | 로컬 파일 삭제됨 | SKILL.md 파일 복구 |
| `git clone failed` | 네트워크 문제 또는 저장소 없음 | 네트워크 또는 저장소 주소 확인 |
| `SKILL.md not found in repo` | 저장소 구조 변경 | 스킬 저자에게 문의 또는 subpath 업데이트 |

## 체크포인트 ✅

다음을 학습했는지 확인하세요:

- [ ] `openskills update`로 모든 스킬 업데이트 가능
- [ ] 쉼표로 구분하여 지정된 스킬 업데이트 가능
- [ ] "건너뜀" 스킬의 의미와 해결 방법 이해
- [ ] 로컬 개발 스킬의 업데이트 프로세스 이해

## 주의사항

### ❌ 일반적인 실수

| 실수 | 올바른 방법 |
|--- | ---|
| 건너뛴 스킬을 무시함 | 힌트에 따라 재설치 또는 문제 해결 |
| 매번 삭제 후 재설치 | `update` 명령어 사용이 더 효율적 |
| 스킬이 어디에서 설치되었는지 모름 | `openskills list`로 출처 확인 |

### ⚠️ 주의할 점

**업데이트는 로컬 수정을 덮어씁니다**

설치 디렉토리의 스킬 파일을 직접 수정한 경우, 업데이트 시 이러한 수정이 덮어씌워집니다. 올바른 방법은:
1. **소스 파일** 수정 (로컬 경로 또는 저장소)
2. 그 다음 `openskills update` 실행

**심볼릭 링크 스킬은 특별한 처리가 필요합니다**

스킬이 심볼릭 링크로 설치된 경우 ([심볼릭 링크 지원](../../advanced/symlink-support/) 참조), 업데이트는 링크를 다시 생성하며 심볼릭 링크 관계를 파괴하지 않습니다.

**전역 및 프로젝트 스킬은 각각 업데이트해야 합니다**

```bash
# 프로젝트 스킬만 업데이트 (기본값)
openskills update

# 전역 스킬 업데이트는 별도 처리 필요
# 또는 --universal 모드로 통합 관리
```

## 이 과정 요약

이 과정에서는 OpenSkills의 업데이트 기능을 학습했습니다:

- **일괄 업데이트**: `openskills update`로 모든 스킬을 원클릭 업데이트
- **지정 업데이트**: `openskills update skill1,skill2`로 특정 스킬 업데이트
- **출처 인식**: 로컬 경로와 git 저장소를 자동으로 식별
- **오류 메시지**: 건너뛴 원인과 해결 방법을 상세히 설명

업데이트 기능으로 스킬을 최신 버전으로 유지하여, 항상 최신 개선사항과 수정사항이 포함된 스킬을 사용할 수 있습니다.

## 다음 과정 예고

> 다음 과정에서 **[스킬 삭제](../remove-skills/)**를 학습합니다.
>
> 다음을 학습하게 됩니다:
> - 대화식 `manage` 명령어로 스킬 삭제 방법
> - `remove` 명령어로 스크립트화된 삭제 방법
> - 스킬 삭제 후 주의사항

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능              | 파일 경로                                                                                            | 행 번호    |
|--- | --- | ---|
| 스킬 업데이트 메인 로직    | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L14-L150) | 14-150  |
| 로컬 경로 업데이트      | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L64-L82) | 64-82   |
| Git 저장소 업데이트      | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L85-L125) | 85-125  |
| 디렉토리에서 스킬 복사    | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L152-L163) | 152-163 |
| 경로 안전성 검증      | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L165-L172) | 165-172 |
| 메타데이터 구조 정의    | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L8-L15) | 8-15    |
| 스킬 메타데이터 읽기    | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L17-L27) | 17-27   |
| 스킬 메타데이터 쓰기    | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L29-L36) | 29-36   |
| CLI 명령어 정의      | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L58-L62) | 58-62   |

**핵심 상수**:
- `SKILL_METADATA_FILE = '.openskills.json'`：메타데이터 파일명, 스킬 설치 출처 기록

**핵심 함수**:
- `updateSkills(skillNames)`：지정된 또는 모든 스킬을 업데이트하는 메인 함수
- `updateSkillFromDir(targetPath, sourceDir)`：소스 디렉토리에서 스킬을 대상 디렉토리로 복사
- `isPathInside(targetPath, targetDir)`：설치 경로 안전성 검증 (경로 순회 방지)
- `readSkillMetadata(skillDir)`：스킬 메타데이터 읽기
- `writeSkillMetadata(skillDir, metadata)`：스킬 메타데이터 쓰기/업데이트

**비즈니스 규칙**:
- **BR-5-1**：기본적으로 설치된 모든 스킬 업데이트 (update.ts:37-38)
- **BR-5-2**：쉼표로 구분된 스킬 이름 목록 지원 (update.ts:15)
- **BR-5-3**：소스 메타데이터가 없는 스킬 건너뛰기 (update.ts:56-62)
- **BR-5-4**：로컬 경로 업데이트 지원 (update.ts:64-82)
- **BR-5-5**：git 저장소에서 업데이트 지원 (update.ts:85-125)
- **BR-5-6**：경로 안전성 검증 (update.ts:156-162)

</details>
