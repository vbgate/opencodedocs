---
title: "Diff 뷰: 여러 각도에서 변경 사항 검토 | Plannotator"
sidebarTitle: "5가지 diff 뷰 전환"
subtitle: "Diff 뷰: 여러 각도에서 변경 사항 검토"
description: "Plannotator 코드 리뷰에서 diff 유형을 전환하는 방법을 알아보세요. 드롭다운 메뉴에서 uncommitted, staged, last commit 또는 branch 뷰를 선택하여 여러 각도에서 코드 변경 사항을 검토합니다."
tags:
  - "code-review"
  - "git"
  - "diff"
  - "tutorial"
prerequisite:
  - "code-review-basics"
order: 6
---

# Diff 뷰 전환

## 학습 완료 후 가능한 것

코드 리뷰 시 다음을 수행할 수 있습니다:
- 드롭다운 메뉴로 5가지 diff 뷰 간에 빠르게 전환
- 각 뷰에서 표시되는 코드 변경 범위 이해
- 검토 요구에 따라 적절한 diff 유형 선택
- 잘못된 뷰 선택으로 인한 중요한 변경 누락 방지

## 현재 겪고 있는 문제

**리뷰 시 작업 디렉토리만 보고 스테이징된 파일 누락**:

`/plannotator-review` 명령을 실행하여 일부 코드 변경 사항을 보고, 몇 개의 주석을 추가했습니다. 하지만 커밋 후에 리뷰에서 이미 `git add`로 스테이징한 파일들이 누락되었다는 것을 발견했습니다 — 이 파일들은 diff에 전혀 나타나지 않았습니다.

**현재 브랜치와 main 브랜치의 전체 차이점 알고 싶음**:

수주 동안 기능 브랜치에서 개발했고, 총 무엇을 변경했는지 보고 싶지만 기본 "Uncommitted changes" 뷰는 최근 며칠의 수정만 표시합니다.

**두 특정 커밋 간의 차이점을 비교하고 싶음**:

특정 버그 수정이 올바른지 확인하기 위해 수정 전후의 코드를 비교해야 하지만, Plannotator에서 과거 커밋 diff를 표시하는 방법을 알지 못합니다.

## 활용 시점

- **포괄적 검토 시**: 작업 디렉토리와 스테이징 영역의 변경 사항을 동시에 확인
- **브랜치 병합 전**: main/master 브랜치에 대한 현재 브랜치의 모든 변경 사항 확인
- **롤백 검토 시**: 마지막 커밋에서 변경된 파일 확인
- **협업 시**: 동료가 스테이징했지만 아직 커밋하지 않은 코드 검토

## 핵심 개념

Git diff 명령에는 여러 변형이 있으며, 각각 다른 코드 범위를 표시합니다. Plannotator는 이러한 변형들을 하나의 드롭다운 메뉴로 통합하여 복잡한 git 명령을 기억할 필요가 없도록 만들었습니다.

::: info Git Diff 유형 빠른 참조

| diff 유형 | 표시 범위 | 전형적인 사용 시나리오 |
|--- | --- | ---|
| Uncommitted changes | 작업 디렉토리 + 스테이징 영역 | 이번 개발의 모든 수정 리뷰 |
| Staged changes | 스테이징 영역만 | 커밋 전 제출할 내용 검토 |
| Unstaged changes | 작업 디렉토리만 | 아직 `git add`하지 않은 수정 검토 |
| Last commit | 최근 커밋 | 롤백하거나 방금 커밋한 것 검토 |
| vs main | 현재 브랜치 vs 기본 브랜치 | 브랜치 병합 전 포괄적 검토 |

:::

드롭다운 메뉴의 옵션은 Git 상태에 따라 동적으로 변경됩니다:
- 현재 기본 브랜치에 없으면 "vs main" 옵션이 표시됩니다
- 스테이징된 파일이 없으면 Staged 뷰가 "No staged changes"를 표시합니다

## 따라해 보세요
### 1단계: 코드 리뷰 시작

**이유**

먼저 Plannotator의 코드 리뷰 인터페이스를 열어야 합니다.

**작업**

터미널에서 다음을 실행하세요:

```bash
/plannotator-review
```

**예상 결과**

브라우저에서 코드 리뷰 페이지가 열리고 왼쪽 파일 트리 상단에 현재 diff 유형을 표시하는 드롭다운 메뉴가 있습니다(보통 "Uncommitted changes").

### 2단계: Staged 뷰로 전환

**이유**

이미 `git add`했지만 아직 커밋하지 않은 파일을 봅니다.

**작업**

1. 왼쪽 파일 트리 상단의 드롭다운 메뉴 클릭
2. "Staged changes" 선택

**예상 결과**

- 스테이징된 파일이 있으면 파일 트리에서 해당 파일들을 표시
- 스테이징된 파일이 없으면 주 영역에 "No staged changes. Stage some files with git add." 메시지 표시

### 3단계: Last Commit 뷰로 전환

**이유**

방금 커밋한 코드를 검토하여 문제가 없는지 확인합니다.

**작업**

1. 드롭다운 메뉴를 다시 열기
2. "Last commit" 선택

**예상 결과**

- 최근 커밋에서 수정한 모든 파일 표시
- diff 내용은 `HEAD~1..HEAD`의 차이점

### 4단계: vs main 뷰로 전환(사용 가능한 경우)

**이유**

기본 브랜치에 대한 현재 브랜치의 모든 변경 사항을 봅니다.

**작업**

1. 드롭다운 메뉴에서 "vs main" 또는 "vs master" 옵션이 있는지 확인
2. 있으면 선택

**예상 결과**

- 파일 트리가 현재 브랜치와 기본 브랜치 사이의 모든 차이 파일들을 표시
- diff 내용은 `main..HEAD`의 전체 변경 사항

::: tip 현재 브랜치 확인

"vs main" 옵션이 보이지 않는다면 기본 브랜치에 있는 것입니다. 다음 명령으로 현재 브랜치를 확인하세요:

```bash
git rev-parse --abbrev-ref HEAD
```

기능 브랜치로 전환한 후 다시 시도하세요:

```bash
git checkout feature-branch
```

:::

## 검사점 ✅

다음을 마스터했는지 확인하세요:

- [ ] diff 유형 드롭다운 메뉴를 찾고 열 수 있음
- [ ] "Uncommitted", "Staged", "Last commit"의 차이점 이해
- [ ] "vs main" 옵션이 언제 나타나는지 식별
- [ ] 어떤 시나리오에서 어떤 diff 유형을 사용할지 알고 있음

## 일반적인 실수

### 실수 1: 리뷰 시 Uncommitted만 보고 스테이징된 파일 누락

**증상**

커밋 후에 리뷰에서 일부 스테이징된 파일들이 누락된 것을 발견합니다.

**원인**

Uncommitted 뷰는 작업 디렉토리와 스테이징 영역의 모든 변경 사항을 표시(`git diff HEAD`)하므로 이미 스테이징된 파일들도 포함됩니다.

**해결**

리뷰 전에 먼저 Staged 뷰로 전환하여 확인하거나 Uncommitted 뷰(스테이징 영역 포함)를 사용하세요.

### 실수 2: 브랜치 병합 전에 main과 비교하지 않음

**증상**

main에 병합한 후 관련 없는 수정이 포함된 것을 발견합니다.

**원인**

최근 며칠의 커밋만 보았고 main에 대한 전체 브랜치 차이점을 비교하지 않았습니다.

**해결**

병합 전에 "vs main" 뷰로 포괄적으로 검토하세요.

### 실수 3: 뷰 전환 시 주석이 손실된다고 생각함

**증상**

이전에 추가한 주석이 사라질까 봐 diff 유형 전환을 꺼려합니다.

**원인**

전환 메커니즘을 오해했습니다.

**실제 상황**

diff 유형 전환 시 Plannotator는 이전 주석을 유지합니다 — 여전히 적용될 수 있거나, 관련 없는 주석을 수동으로 삭제할 수 있습니다.

## 이번 수업 요약

Plannotator가 지원하는 5가지 diff 유형:

| 유형 | Git 명령 | 시나리오 |
|--- | --- | ---|
| Uncommitted | `git diff HEAD` | 이번 개발의 모든 수정 리뷰 |
| Staged | `git diff --staged` | 커밋 전 스테이징 영역 검토 |
| Unstaged | `git diff` | 작업 디렉토리 수정 검토 |
| Last commit | `git diff HEAD~1..HEAD` | 롤백하거나 최근 커밋 검토 |
| vs main | `git diff main..HEAD` | 브랜치 병합 전 포괄적 검토 |

뷰 전환은 주석을 손실하지 않으므로 동일하거나 새 주석에 대해 다른 관점에서 볼 수 있습니다.

## 다음 수업 예고

> 다음 수업에서 **[URL 공유](../../advanced/url-sharing/)**을 학습합니다.
>
> 학습할 내용:
> - 리뷰 내용을 URL로 압축하여 동료에게 공유하는 방법
> - 수신자가 공유된 리뷰 링크를 여는 방법
> - 공유 모드의 제한 사항과 주의점

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| Diff 유형 정의 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15) | 10-15 |
| Git 컨텍스트 가져오기 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79-L96) | 79-96 |
| Git Diff 실행 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101-L147) | 101-147 |
| Diff 전환 처리 | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L300-L331) | 300-331 |
| 파일 트리에서 Diff 옵션 렌더링 | [`packages/review-editor/components/FileTree.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/FileTree.tsx) | - |

**주요 타입**:

- `DiffType`: `'uncommitted' | 'staged' | 'unstaged' | 'last-commit' | 'branch'`

**주요 함수**:

- `getGitContext()`: 현재 브랜치, 기본 브랜치 및 사용 가능한 diff 옵션 가져오기
- `runGitDiff(diffType, defaultBranch)`: diff 유형에 따라 해당 git 명령 실행

**주요 API**:

- `POST /api/diff/switch`: diff 유형 전환, 새 diff 데이터 반환

</details>
