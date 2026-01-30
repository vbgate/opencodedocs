---
title: "Obsidian 통합: 계획 자동 저장 | plannotator"
sidebarTitle: "Obsidian에 자동 저장"
subtitle: "Obsidian 통합: 계획 자동 저장 | plannotator"
description: "Plannotator의 Obsidian 통합 구성 방법을 배웁니다. 승인된 계획을 vault에 자동 저장하고, frontmatter 및 태그 생성 기능을 포함하며, 사용자 정의 저장 경로를 지원합니다."
tags:
  - "plannotator"
  - "integration"
  - "obsidian"
  - "advanced"
prerequisite:
  - "start-getting-started"
order: 2
---

# Obsidian 통합: 계획을 노트 저장소에 자동 저장

## 학습 목표

- 승인 또는 거절된 계획을 Obsidian vault에 자동 저장
- frontmatter와 태그 생성 메커니즘 이해
- 저장 경로와 폴더 사용자 정의
- 백링크를 활용해 지식 그래프 구축

## 현재 겪고 있는 문제

Plannotator에서 AI가 생성한 계획을 검토할 때, 승인 후 이 계획들이 "사라집니다". 가치 있는 계획을 Obsidian에 저장하여 나중에 검토하고 찾고 싶지만, 수동으로 복사하고 붙여넣는 것은 번거롭고 포맷이 깨집니다.

## 이 방법이 필요한 상황

- Obsidian을 지식 관리 도구로 사용하는 경우
- AI가 생성한 실행 계획을 장기적으로 보관하고 검토하고 싶을 때
- Obsidian의 그래프 뷰와 태그 시스템을 활용해 계획을 조직화하고 싶을 때

## 핵심 개념

Plannotator의 Obsidian 통합 기능은 계획을 승인하거나 거절할 때 자동으로 계획 내용을 Obsidian vault에 저장합니다. 시스템은 다음 작업을 수행합니다:

1. **vault 감지**: Obsidian 구성 파일에서 모든 vault를 자동으로 읽음
2. **frontmatter 생성**: 생성 시간, 소스, 태그 포함
3. **태그 추출**: 계획 제목과 코드 블록 언어에서 태그 자동 추출
4. **백링크 추가**: 지식 그래프 구축을 위해 `[[Plannotator Plans]]` 링크 삽입

::: info Obsidian이란?

Obsidian은 로컬 우선 양방향 링크 노트 앱으로, Markdown 형식을 지원하고 그래프 뷰를 통해 노트 간 관계를 시각화할 수 있습니다.

:::

## 🎒 시작 전 준비

Obsidian이 설치되고 구성되어 있는지 확인합니다. Plannotator는 시스템의 vaults를 자동으로 감지하지만, 최소 하나의 vault가 있어야 이 기능을 사용할 수 있습니다.

## 따라하기

### 1단계: 설정 패널 열기

Plannotator 인터페이스에서 우측 상단의 톱니바퀴 아이콘을 클릭하여 설정 패널을 엽니다.

여러 구성 옵션이 포함된 설정 대화상자가 표시되어야 합니다.

### 2단계: Obsidian 통합 활성화

설정 패널에서 "Obsidian Integration" 섹션을 찾아 스위치를 클릭하여 기능을 활성화합니다.

활성화하면 Plannotator가 시스템의 Obsidian vaults를 자동으로 감지합니다.

드롭다운 메뉴에 감지된 vaults(예: `My Vault`, `Work Notes`)가 나열되어야 합니다.

### 3단계: vault 및 폴더 선택

드롭다운 메뉴에서 계획을 저장할 vault를 선택합니다. 감지된 vault가 없는 경우:

1. "Custom path..." 옵션을 선택
2. 텍스트 상자에 vault의 전체 경로를 입력

그런 다음 "Folder" 필드에 저장 폴더의 이름을 설정합니다(기본값 `plannotator`).

아래에 계획이 저장될 위치를 보여주는 미리보기 경로가 표시되어야 합니다.

### 4단계: 계획 승인 또는 거절

구성을 완료한 후 AI가 생성한 계획을 정상적으로 검토합니다. "Approve" 또는 "Send Feedback"을 클릭하면 계획이 구성된 vault에 자동으로 저장됩니다.

Obsidian에 새로 생성된 파일이 표시되어야 합니다. 파일명 형식은 `Title - Jan 2, 2026 2-30pm.md`입니다.

### 5단계: 저장된 파일 확인

Obsidian에서 저장된 파일을 열면 다음 내용이 표시됩니다:

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [plan, authentication, typescript, sql]
---

[[Plannotator Plans]]

## Implementation Plan: User Authentication

...
```

파일 상단에 생성 시간, 소스, 태그를 포함한 YAML frontmatter가 있어야 합니다.

## 체크포인트 ✅

- [ ] 설정 패널에서 Obsidian Integration이 활성화됨
- [ ] vault 선택(또는 사용자 정의 경로 입력) 완료
- [ ] 폴더 이름 설정 완료
- [ ] 계획 승인 또는 거절 후 Obsidian에 새 파일이 나타남
- [ ] 파일에 frontmatter와 `[[Plannotator Plans]]` 백링크 포함

## Frontmatter 및 태그 상세 설명

### Frontmatter 구조

각 저장된 계획은 다음 frontmatter 필드를 포함합니다:

| 필드   | 값 예시                           | 설명                         |
|--- | --- | ---|
| `created` | `2026-01-24T14:30:00.000Z`    | ISO 8601 형식의 생성 타임스탬프     |
| `source` | `plannotator`                   | 고정값, 소스 식별             |
| `tags` | `[plan, authentication, typescript]` | 자동 추출된 태그 배열 |

### 태그 생성 규칙

Plannotator는 다음 규칙을 사용하여 태그를 자동으로 추출합니다:

1. **기본 태그**: 항상 `plannotator` 태그 포함
2. **프로젝트 이름 태그**: git 저장소 이름 또는 디렉토리 이름에서 자동 추출
3. **제목 키워드**: 첫 번째 H1 제목에서 의미 있는 단어 추출(일반적인 불용어 제외)
4. **코드 언어 태그**: 코드 블록의 언어 식별자에서 추출(예: `typescript`, `sql`). 일반 구성 언어(`json`, `yaml`, `markdown`)는 자동 필터링됩니다.

불용어 목록(태그로 사용되지 않음):
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

태그 수 제한: 최대 7개 태그, 추출 순서대로 정렬.

### 파일명 형식

파일명은 가독성이 높은 형식을 사용합니다: `Title - Jan 2, 2026 2-30pm.md`

| 부분       | 예시         | 설명                  |
|--- | --- | ---|
| 제목       | `User Authentication` | H1에서 추출, 50자 제한 |
| 날짜       | `Jan 2, 2026` | 현재 날짜               |
| 시간       | `2-30pm`     | 현재 시간(12시간제)   |

### 백링크 메커니즘

각 계획 파일 하단에 `[[Plannotator Plans]]` 링크가 삽입됩니다. 이 백링크의 역할:

- **지식 그래프 연결**: Obsidian의 그래프 뷰에서 모든 계획이 동일한 노드에 연결됨
- **빠른 네비게이션**: `[[Plannotator Plans]]`를 클릭하여 모든 저장된 계획을 요약한 인덱스 페이지 생성
- **양방향 링크**: 인덱스 페이지에서 역방향 링크를 사용해 모든 계획 확인

## 크로스 플랫폼 지원

Plannotator는 다양한 운영체제의 Obsidian 구성 파일 위치를 자동으로 감지합니다:

| 운영체제 | 구성 파일 경로                                    |
|--- | ---|
| macOS     | `~/Library/Application Support/obsidian/obsidian.json` |
| Windows   | `%APPDATA%\obsidian/obsidian.json`                 |
| Linux     | `~/.config/obsidian/obsidian.json`                 |

자동 감지가 실패하면 vault 경로를 수동으로 입력할 수 있습니다.

## 문제 해결

### 문제 1: vaults를 감지하지 못함

**증상**: 드롭다운 메뉴에 "Detecting..."이 표시되지만 결과가 없음

**원인**: Obsidian 구성 파일이 없거나 형식이 잘못됨

**해결책**:
1. Obsidian이 설치되고 최소 한 번 이상 열렸는지 확인
2. 구성 파일이 있는지 확인(위 표의 경로 참조)
3. "Custom path..."를 사용하여 vault 경로를 수동으로 입력

### 문제 2: 저장 후 파일을 찾을 수 없음

**증상**: 계획을 승인한 후 Obsidian에 새 파일이 없음

**원인**: vault 경로가 잘못되었거나 Obsidian이 새로고침되지 않음

**해결책**:
1. 설정 패널의 미리보기 경로가 올바른지 확인
2. Obsidian에서 "Reload vault"를 클릭하거나 `Cmd+R`(macOS) / `Ctrl+R`(Windows/Linux)을 누름
3. 올바른 vault를 선택했는지 확인

### 문제 3: 파일명에 특수 문자 포함

**증상**: 파일명에 `_` 또는 다른 대체 문자가 나타남

**원인**: 제목에 파일 시스템이 지원하지 않는 문자(`< > : " / \ | ? *`)가 포함됨

**해결책**: 예상된 동작입니다. Plannotator는 파일 시스템 오류를 방지하기 위해 이러한 문자를 자동으로 대체합니다.

## 이번 강의 요약

Obsidian 통합 기능은 계획 검토 워크플로우와 지식 관리를 원활하게 연결합니다:

- ✅ 승인 또는 거절된 계획 자동 저장
- ✅ 향후 검색을 위한 스마트 태그 추출
- ✅ 통일된 메타데이터 형식을 위한 frontmatter 생성
- ✅ 지식 그래프 구축을 위한 백링크 추가

한 번 구성하면 모든 검토가 자동으로 아카이빙되며, 수동으로 복사 및 붙여넣을 필요가 없습니다.

## 다음 강의 예고

> 다음 강의에서는 **[Bear 통합](../bear-integration/)**을 배웁니다.
>
> 다음 내용을 배울 수 있습니다:
> - 계획을 Bear 노트 앱에 저장하는 방법
> - Bear 통합과 Obsidian 통합의 차이점
> - x-callback-url을 사용하여 노트를 자동으로 생성하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트: 2026-01-24

| 기능                | 파일 경로                                                                                     | 라인    |
|--- | --- | ---|
| Obsidian vaults 감지 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L135-L175) | 135-175 |
| Obsidian에 계획 저장 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L227) | 180-227 |
| 태그 추출             | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74   |
| frontmatter 생성     | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L81-L89) | 81-89   |
| 파일명 생성           | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L111-L127) | 111-127 |
| Obsidian 설정 저장     | [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L36-L43) | 36-43   |
| Settings UI 컴포넌트      | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L387-L491) | 387-491 |

**주요 함수**:
- `detectObsidianVaults()`: Obsidian 구성 파일을 읽고 사용 가능한 vault 경로 목록을 반환
- `saveToObsidian(config)`: 계획을 지정된 vault에 저장, frontmatter 및 백링크 포함
- `extractTags(markdown)`: 계획 내용에서 태그 추출(제목 키워드, 코드 언어, 프로젝트 이름)
- `generateFrontmatter(tags)`: YAML frontmatter 문자열 생성
- `generateFilename(markdown)`: 가독성 높은 파일명 생성

**비즈니스 규칙**:
- 태그 수 최대 7개(L73)
- 파일명 제한 50자(L102)
- 크로스 플랫폼 구성 파일 경로 감지 지원(L141-149)
- 존재하지 않는 폴더 자동 생성(L208)

</details>
