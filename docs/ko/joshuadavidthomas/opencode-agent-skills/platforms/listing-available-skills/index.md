---
title: "스킬 관리: 사용 가능한 스킬 조회 | opencode-agent-skills"
sidebarTitle: "스킬 빠르게 찾기"
subtitle: "스킬 관리: 사용 가능한 스킬 조회"
description: "get_available_skills 도구 사용법을 배워보세요. 검색, 네임스페이스 및 필터링을 통해 스킬을 빠르게 찾고, 스킬 발견 및 관리의 핵심 기능을 익히세요."
tags:
  - "스킬 관리"
  - "도구 사용"
  - "네임스페이스"
prerequisite:
  - "start-installation"
order: 2
---

# 사용 가능한 스킬 조회 및 목록화

## 학습 완료 후 할 수 있는 것

- `get_available_skills` 도구를 사용하여 모든 사용 가능한 스킬 목록화
- 검색 쿼리를 통해 특정 스킬 필터링
- 네임스페이스(예: `project:skill-name`)를 사용하여 스킬 정확히 찾기
- 스킬 출처 및 실행 가능한 스크립트 목록 식별

## 현재의 어려움

특정 스킬을 사용하고 싶지만 정확한 이름이 기억나지 않습니다. 프로젝트 내의 어떤 스킬인지는 알지만 어떤 발견 경로에 있는지 모르거나, 현재 프로젝트에서 사용 가능한 스킬을 빠르게 둘러보고 싶을 수 있습니다.

## 언제 이 기능을 사용하나요

- **새 프로젝트 탐색**: 새 프로젝트에 참여했을 때 사용 가능한 스킬 빠르게 파악
- **스킬 이름 불확실**: 스킬의 일부 이름이나 설명만 기억할 때, 퍼지 매칭 필요
- **다중 네임스페이스 충돌**: 프로젝트 수준과 사용자 수준에 동일한 이름의 스킬이 있을 때, 어떤 것을 사용할지 명확히 지정
- **스크립트 찾기**: 스킬 디렉토리에 어떤 실행 가능한 자동화 스크립트가 있는지 확인

## 핵심 개념

`get_available_skills` 도구는 현재 세션에서 사용 가능한 모든 스킬을 확인하는 데 도움을 줍니다. 플러그인은 자동으로 6개의 발견 경로에서 스킬을 스캔합니다:

::: info 스킬 발견 우선순위
1. `.opencode/skills/` (프로젝트 수준 OpenCode)
2. `.claude/skills/` (프로젝트 수준 Claude)
3. `~/.config/opencode/skills/` (사용자 수준 OpenCode)
4. `~/.claude/skills/` (사용자 수준 Claude)
5. `~/.claude/plugins/cache/` (플러그인 캐시)
6. `~/.claude/plugins/marketplaces/` (설치된 플러그인)
:::

동일한 이름의 스킬은 우선순위에 따라 첫 번째 것만 유지되고, 이후의 것은 무시됩니다.

도구가 반환하는 정보는 다음과 같습니다:
- **스킬 이름**
- **출처 태그** (project, user, claude-project 등)
- **설명**
- **실행 가능한 스크립트 목록** (있는 경우)

::: tip 네임스페이스 구문
`namespace:skill-name` 형식으로 출처를 명확히 지정할 수 있습니다:
- `project:my-skill` - 프로젝트 수준 OpenCode 스킬 사용 (`.opencode/skills/`)
- `claude-project:my-skill` - 프로젝트 수준 Claude 스킬 사용 (`.claude/skills/`)
- `user:my-skill` - 사용자 수준 OpenCode 스킬 사용 (`~/.config/opencode/skills/`)
- `claude-user:my-skill` - 사용자 수준 Claude 스킬 사용 (`~/.claude/skills/`)
- `claude-plugins:my-skill` - Claude 플러그인의 스킬 사용
:::

## 따라 해보기

### 1단계: 모든 사용 가능한 스킬 목록화

OpenCode에서 AI에게 직접 스킬 목록을 요청하세요:

```
사용자 입력:
사용 가능한 모든 스킬 목록화

시스템 응답:
skill-helper (project)
  Git 작업 및 브랜치 관리 도우미 [scripts: tools/branch.sh, tools/commit.sh]

test-helper (user)
  단위 테스트 및 커버리지 분석 도구

docker-helper (project)
  Docker 컨테이너화 및 배포 가이드 [scripts: build.sh, deploy.sh]

claude-code-superpowers (claude-plugins)
  완전한 소프트웨어 개발 워크플로우
```

**보게 될 것**: 스킬 목록으로, 각 스킬은 이름, 출처 태그, 설명, 스크립트 목록을 표시합니다.

### 2단계: 검색 쿼리로 필터링

스킬의 일부 이름만 기억한다면:

```
사용자 입력:
"docker"가 포함된 스킬 찾기

시스템 응답:
docker-helper (project)
  Docker 컨테이너화 및 배포 가이드 [scripts: build.sh, deploy.sh]
```

검색은 스킬 이름과 설명의 키워드를 매칭하며, `*` 와일드카드를 지원합니다:

```
사용자 입력:
"test"로 시작하는 스킬 찾기

시스템 응답:
test-helper (user)
  단위 테스트 및 커버리지 분석 도구
```

**보게 될 것**: 쿼리 조건과 일치하는 스킬만 표시됩니다.

### 3단계: 퍼지 매칭 제안 체험

잘못된 스킬 이름을 입력하면:

```
사용자 입력:
docker-asistant를 사용하고 싶어요

시스템 응답:
"docker-asistant"와 일치하는 스킬을 찾을 수 없습니다. "docker-helper"를 의미하셨나요?
```

플러그인은 레벤슈타인 거리를 기반으로 유사도를 계산하여, 자동으로 가장 가까운 스킬 이름을 제안합니다.

**보게 될 것**: 오류 메시지와 올바른 스킬 제안.

### 4단계: 네임스페이스로 정확히 찾기

프로젝트 수준과 사용자 수준에 모두 `build-helper`라는 이름의 스킬이 있다고 가정해 봅시다:

```
사용자 입력:
build-helper의 상세 정보 목록화

시스템 응답:
build-helper (project)
  프로젝트별 빌드 구성 및 컴파일 최적화 [scripts: build.sh, optimize.sh]
```

사용자가 사용자 수준의 스킬을 원한다면:

```
사용자 입력:
user:build-helper 사용

시스템 응답:
build-helper (user)
  일반 빌드 도구체인 및 지속적 통합 구성 [scripts: ci.sh, test.sh]
```

**보게 될 것**: 네임스페이스 접두사를 통해 다른 출처의 동일한 이름 스킬에 접근할 수 있습니다.

### 5단계: 실행 가능한 스크립트 확인

스킬 디렉토리에 어떤 스크립트가 있는지 확인:

```
사용자 입력:
docker-helper에 어떤 스크립트가 있나요?

시스템 응답:
docker-helper (project)
  Docker 컨테이너화 및 배포 가이드 [scripts: build.sh, deploy.sh]
```

스크립트는 스킬 정보의 대괄호 안에 쉼표로 구분되어 표시됩니다. `run_skill_script` 도구로 이러한 스크립트를 실행할 수 있습니다.

**보게 될 것**: 스킬 이름 뒤에 `[scripts: 스크립트경로1, 스크립트경로2, ...]` 형식의 목록이 표시됩니다.

## 체크포인트 ✅

- [ ] 사용 가능한 모든 스킬을 목록화할 수 있나요?
- [ ] 검색 쿼리로 특정 스킬을 필터링할 수 있나요?
- [ ] 스킬 출처 태그의 의미를 이해하나요 (project, user, claude-project 등)?
- [ ] 스킬 네임스페이스의 역할과 구문을 설명할 수 있나요?
- [ ] 스킬 정보에서 실행 가능한 스크립트 목록을 식별할 수 있나요?

## 주의사항

### 함정 1: 동일 이름 스킬의 덮어쓰기

프로젝트 수준과 사용자 수준에 동일한 이름의 스킬이 있으면, 예상한 스킬이 로드되지 않는 것에 대해 혼란스러울 수 있습니다.

**원인**: 스킬은 우선순위에 따라 발견되며, 프로젝트 수준이 사용자 수준보다 우선하고, 동일한 이름은 첫 번째 것만 유지됩니다.

**해결**: 네임스페이스를 사용하여 명확히 지정하세요. 예: `user:my-skill` 대신 `my-skill`.

### 함정 2: 검색 대소문자 구분

검색 쿼리는 정규 표현식을 사용하지만 `i` 플래그가 설정되어 있어 대소문자를 구분하지 않습니다.

```bash
# 이 검색들은 동일합니다
get_available_skills(query="docker")
get_available_skills(query="DOCKER")
get_available_skills(query="Docker")
```

### 함정 3: 와일드카드 이스케이프

검색에서 `*`는 자동으로 `.*` 정규 표현식으로 변환되며, 수동으로 이스케이프할 필요가 없습니다:

```bash
# "test"로 시작하는 스킬 검색
get_available_skills(query="test*")

# 정규 표현식 /test.*/i와 동일
```

## 강의 요약

`get_available_skills`는 스킬 생태계를 탐색하는 도구로, 다음을 지원합니다:

- **모든 스킬 목록화**: 매개변수 없이 호출
- **검색 필터링**: `query` 매개변수로 이름과 설명 매칭
- **네임스페이스**: `namespace:skill-name`으로 정확히 찾기
- **퍼지 매칭 제안**: 철자 오류 시 자동으로 올바른 이름 제안
- **스크립트 목록**: 실행 가능한 자동화 스크립트 표시

플러그인은 세션 시작 시 자동으로 스킬 목록을 주입하므로, 일반적으로 이 도구를 수동으로 호출할 필요가 없습니다. 하지만 다음 시나리오에서 유용합니다:
- 사용 가능한 스킬을 빠르게 둘러보고 싶을 때
- 스킬의 정확한 이름이 기억나지 않을 때
- 동일한 이름의 스킬의 다른 출처를 구분해야 할 때
- 특정 스킬의 스크립트 목록을 확인하고 싶을 때

## 다음 강의 예고

> 다음 강의에서는 **[세션 컨텍스트에 스킬 로드](../loading-skills-into-context/)**를 배웁니다.
>
> 배울 내용:
> - use_skill 도구를 사용하여 현재 세션에 스킬 로드
> - 스킬 콘텐츠가 XML 형식으로 컨텍스트에 주입되는 방식 이해
> - Synthetic Message Injection 메커니즘(합성 메시지 주입) 익히기
> - 세션 압축 후 스킬이 어떻게 계속 사용 가능한지 알아보기

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| GetAvailableSkills 도구 정의 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| discoverAllSkills 함수 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L240-L263) | 240-263 |
| resolveSkill 함수 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| findClosestMatch 함수 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**주요 타입**:
- `SkillLabel = "project" | "user" | "claude-project" | "claude-user" | "claude-plugins"`: 스킬 출처 태그 열거형

**주요 상수**:
- 퍼지 매칭 임계값: `0.4` (`utils.ts:124`) - 유사도가 이 값보다 낮으면 제안을 반환하지 않음

**주요 함수**:
- `GetAvailableSkills()`: 쿼리 필터링 및 퍼지 매칭 제안을 지원하는 형식화된 스킬 목록 반환
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: `namespace:skill-name` 형식의 스킬 파싱 지원
- `findClosestMatch(input: string, candidates: string[])`: 다양한 매칭 전략(접두사, 포함, 편집 거리)을 기반으로 최적 매칭 계산

**비즈니스 규칙**:
- 동일한 이름의 스킬은 발견 순서에 따라 중복 제거되며, 첫 번째 것만 유지됨 (`skills.ts:258`)
- 검색 쿼리는 와일드카드 `*`를 지원하며, 자동으로 정규 표현식으로 변환됨 (`tools.ts:43`)
- 퍼지 매칭 제안은 쿼리 매개변수가 있고 결과가 없을 때만 트리거됨 (`tools.ts:49-57`)

</details>
