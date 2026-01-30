---
title: "네임스페이스: 스킬 우선순위 | opencode-agent-skills"
sidebarTitle: "스킬 충돌 해결"
subtitle: "네임스페이스: 스킬 우선순위 | opencode-agent-skills"
description: "네임스페이스 시스템과 스킬 발견 우선순위 규칙을 학습합니다. 5가지 라벨과 6단계 우선순위를 익히고, 네임스페이스로 같은 이름의 스킬을 구분하고 충돌을 해결하는 방법을 알아봅니다."
tags:
  - "고급"
  - "네임스페이스"
  - "스킬 관리"
prerequisite:
  - "start-what-is-opencode-agent-skills"
  - "platforms-skill-discovery-mechanism"
  - "platforms-listing-available-skills"
order: 3
---

# 네임스페이스와 스킬 우선순위

## 학습 후 할 수 있는 것

- 스킬의 네임스페이스 시스템을 이해하고, 다른 출처의 동명 스킬을 구분하기
- 스킬 발견 우선순위 규칙을 파악하고, 어떤 스킬이 로드될지 예측하기
- 네임스페이스 접두사를 사용하여 스킬 출처를 정확히 지정하기
- 동명 스킬 충돌 문제 해결하기

## 현재 겪고 있는 문제

스킬 수가 증가하면서 이런 혼란스러운 상황을 겪을 수 있습니다:

- **동명 스킬 충돌**: 프로젝트 디렉터리와 사용자 디렉터리 모두 `git-helper`라는 이름의 스킬이 있을 때, 어떤 것이 로드되는지 모름
- **스킬 출처 혼란**: 어떤 스킬이 프로젝트 레벨에서 온 것이고, 어떤 것이 사용자 레벨이나 플러그인 캐시에서 온 것인지 불분명
- **덮어쓰기 동작 이해 불가**: 사용자 레벨 스킬을 수정했는데도 적용되지 않고, 프로젝트 레벨 스킬이 덮어씀
- **정확한 제어 어려움**: 특정 출처의 스킬을 강제로 사용하고 싶은데, 어떻게 지정해야 할지 모름

이러한 문제들은 스킬 네임스페이스와 우선순위 규칙을 이해하지 못해서 발생합니다.

## 핵심 개념

**네임스페이스**는 OpenCode Agent Skills가 다양한 출처의 동명 스킬을 구분하기 위해 사용하는 메커니즘입니다. 각 스킬에는 출처를 식별하는 라벨(label)이 있으며, 이러한 라벨들이 스킬의 네임스페이스를 구성합니다.

::: info 네임스페이스가 필요한 이유는?

두 개의 동명 스킬이 있다고 상상해보세요:
- 프로젝트 레벨 `.opencode/skills/git-helper/` (현재 프로젝트에 맞게 커스텀)
- 사용자 레벨 `~/.config/opencode/skills/git-helper/` (범용 버전)

네임스페이스가 없으면 시스템은 어떤 것을 사용할지 알 수 없습니다. 네임스페이스가 있으면 명확하게 지정할 수 있습니다:
- `project:git-helper` - 프로젝트 레벨 버전을 강제로 사용
- `user:git-helper` - 사용자 레벨 버전을 강제로 사용
:::

**우선순위 규칙**은 네임스페이스를 지정하지 않을 때 시스템이 합리적인 선택을 할 수 있도록 합니다. 프로젝트 레벨 스킬이 사용자 레벨 스킬보다 우선하므로, 프로젝트에서 특정 동작을 커스텀할 수 있으면서도 전역 설정에는 영향을 주지 않습니다.

## 스킬 출처와 라벨

OpenCode Agent Skills는 여러 스킬 출처를 지원하며, 각 출처에는 대응하는 라벨이 있습니다:

| 출처 | 라벨 (label) | 경로 | 설명 |
| --- | --- | --- | ---|
| **OpenCode 프로젝트 레벨** | `project` | `.opencode/skills/` | 현재 프로젝트 전용 스킬 |
| **Claude 프로젝트 레벨** | `claude-project` | `.claude/skills/` | Claude Code 호환 프로젝트 스킬 |
| **OpenCode 사용자 레벨** | `user` | `~/.config/opencode/skills/` | 모든 프로젝트에서 공유하는 범용 스킬 |
| **Claude 사용자 레벨** | `claude-user` | `~/.claude/skills/` | Claude Code 호환 사용자 스킬 |
| **Claude 플러그인 캐시** | `claude-plugins` | `~/.claude/plugins/cache/` | 설치된 Claude 플러그인 |
| **Claude 플러그인 마켓** | `claude-plugins` | `~/.claude/plugins/marketplaces/` | 마켓에서 설치한 Claude 플러그인 |

::: tip 실제 사용 권장 사항
- 프로젝트 특정 설정: `.opencode/skills/`에 배치
- 범용 도구 스킬: `~/.config/opencode/skills/`에 배치
- Claude Code에서 마이그레이션: 이동할 필요 없음, 시스템이 자동으로 발견
:::

## 스킬 발견 우선순위

시스템이 스킬을 발견할 때, 다음 순서로 각 위치를 스캔합니다:

```
1. .opencode/skills/              (project)        ← 가장 높은 우선순위
2. .claude/skills/                (claude-project)
3. ~/.config/opencode/skills/     (user)
4. ~/.claude/skills/              (claude-user)
5. ~/.claude/plugins/cache/       (claude-plugins)
6. ~/.claude/plugins/marketplaces/ (claude-plugins)  ← 가장 낮은 우선순위
```

**핵심 규칙**:
- **첫 번째 일치 적용**: 첫 번째로 발견된 스킬이 유지됨
- **동명 스킬 중복 제거**: 이후 발견된 동명 스킬은 무시됨 (경고는 출력)
- **프로젝트 레벨 우선**: 프로젝트 레벨 스킬이 사용자 레벨 스킬을 덮어씀

### 우선순위 예시

다음과 같은 스킬 분포가 있다고 가정해봅시다:

```
프로젝트 디렉터리:
.opencode/skills/
  └── git-helper/              ← 버전 A (프로젝트 커스텀)

사용자 디렉터리:
~/.config/opencode/skills/
  └── git-helper/              ← 버전 B (범용)

플러그인 캐시:
~/.claude/plugins/cache/xxx/skills/
  └── git-helper/              ← 버전 C (Claude 플러그인)
```

결과: 시스템은 **버전 A** (`project:git-helper`)를 로드하며, 이후 두 개의 동명 스킬은 무시됩니다.

## 네임스페이스를 사용하여 스킬 지정

`use_skill` 또는 다른 도구를 호출할 때, 네임스페이스 접두사를 사용하여 스킬 출처를 정확히 지정할 수 있습니다.

### 문법 형식

```
namespace:skill-name
```

또는

```
skill-name  # 네임스페이스 미지정, 기본 우선순위 사용
```

### 네임스페이스 목록

```
project:skill-name         # 프로젝트 레벨 OpenCode 스킬
claude-project:skill-name  # 프로젝트 레벨 Claude 스킬
user:skill-name            # 사용자 레벨 OpenCode 스킬
claude-user:skill-name     # 사용자 레벨 Claude 스킬
claude-plugins:skill-name  # Claude 플러그인 스킬
```

### 사용 예시

**시나리오 1: 기본 로드 (우선순위에 따라)**

```
use_skill("git-helper")
```

- 시스템이 우선순위에 따라 첫 번째로 일치하는 스킬을 찾아 로드
- 즉 `project:git-helper` (존재하는 경우)

**시나리오 2: 사용자 레벨 스킬 강제 사용**

```
use_skill("user:git-helper")
```

- 우선순위 규칙을 무시하고 사용자 레벨 스킬을 직접 로드
- 프로젝트 레벨이 사용자 레벨을 덮어쓰더라도 접근 가능

**시나리오 3: Claude 플러그인 스킬 로드**

```
use_skill("claude-plugins:git-helper")
```

- Claude 플러그인에서 가져온 스킬을 명확하게 로드
- 특정 플러그인 기능이 필요한 시나리오에 적합

## 네임스페이스 매칭 로직

`namespace:skill-name` 형식을 사용할 때, 시스템의 매칭 로직은 다음과 같습니다:

1. **입력 파싱**: 네임스페이스와 스킬 이름을 분리
2. **모든 스킬 순회**: 일치하는 스킬을 찾음
3. **매칭 조건**:
   - 스킬 이름 일치
   - 스킬의 `label` 필드가 지정된 네임스페이스와 같음
   - 또는 스킬의 `namespace` 커스텀 필드가 지정된 네임스페이스와 같음
4. **결과 반환**: 조건을 만족하는 첫 번째 스킬

::: details 매칭 로직 소스코드

```typescript
export function resolveSkill(
  skillName: string,
  skillsByName: Map<string, Skill>
): Skill | null {
  if (skillName.includes(':')) {
    const [namespace, name] = skillName.split(':');
    for (const skill of skillsByName.values()) {
      if (skill.name === name &&
          (skill.label === namespace || skill.namespace === namespace)) {
        return skill;
      }
    }
    return null;
  }
  return skillsByName.get(skillName) || null;
}
```

:::

## Superpowers 모드에서의 네임스페이스

Superpowers 모드를 활성화하면, 시스템이 세션 초기화 시 네임스페이스 우선순위 설명을 주입합니다:

```markdown
**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
```

이는 AI가 스킬을 선택할 때 올바른 우선순위 규칙을 따르도록 보장합니다.

::: tip Superpowers 모드 활성화 방법

환경 변수를 설정하세요:

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

:::

## 일반적인 사용 시나리오

### 시나리오 1: 프로젝트 커스텀으로 범용 스킬 덮어쓰기

**요구사항**: 프로젝트에 특수한 Git 워크플로우가 필요한데, 사용자 레벨에는 이미 범용 `git-helper` 스킬이 있음.

**해결방안**:
1. 프로젝트 디렉터리에 `.opencode/skills/git-helper/` 생성
2. 프로젝트별 Git 워크플로우 구성
3. 기본 호출 `use_skill("git-helper")`이 자동으로 프로젝트 레벨 버전 사용

**검증**:

```bash
## 스킬 목록 확인, 태그에 주목
get_available_skills("git-helper")
```

출력 예시:
```
git-helper (project)
  Project-specific Git workflow
```

### 시나리오 2: 일시적으로 범용 스킬로 전환

**요구사항**: 특정 작업에서 프로젝트 커스텀 버전이 아닌 사용자 레벨 범용 스킬을 사용해야 함.

**해결방안**:

```
use_skill("user:git-helper")
```

`user:` 네임스페이스를 명확히 지정하여 프로젝트 레벨 덮어쓰기를 우회.

### 시나리오 3: Claude 플러그인에서 스킬 로드

**요구사항**: Claude Code에서 마이그레이션하여 특정 Claude 플러그인 스킬을 계속 사용하고 싶음.

**해결방안**:

1. Claude 플러그인 캐시 경로가 올바른지 확인: `~/.claude/plugins/cache/`
2. 스킬 목록 확인:

```
get_available_skills()
```

3. 네임스페이스를 사용하여 로드:

```
use_skill("claude-plugins:plugin-name")
```

## 함정 피하기

### ❌ 오류 1: 동명 스킬이 덮어쓰여지는 것을 모름

**증상**: 사용자 레벨 스킬을 수정했는데 AI가 여전히 이전 버전을 사용함.

**원인**: 프로젝트 레벨 동명 스킬의 우선순위가 더 높아 사용자 레벨 스킬을 덮어씀.

**해결**:
1. 프로젝트 디렉터리에 동명 스킬이 있는지 확인
2. 네임스페이스를 사용하여 강제 지정: `use_skill("user:skill-name")`
3. 또는 프로젝트 레벨 동명 스킬 삭제

### ❌ 오류 2: 네임스페이스 철자 오류

**증상**: `use_skill("project:git-helper")`를 사용했는데 404 반환.

**원인**: 네임스페이스 철자 오류(예: `projcet`로 작성) 또는 대소문자가 맞지 않음.

**해결**:
1. 먼저 스킬 목록 확인: `get_available_skills()`
2. 괄호 안의 태그(예: `(project)`)에 주목
3. 올바른 네임스페이스 이름 사용

### ❌ 오류 3: 라벨과 커스텀 네임스페이스 혼동

**증상**: `use_skill("project:custom-skill")`를 사용했는데 스킬을 찾을 수 없음.

**원인**: `project`는 라벨(label)이며, 커스텀 네임스페이스가 아님. 스킬의 `namespace` 필드가 명시적으로 `project`로 설정되지 않으면 매칭되지 않음.

**해결**:
- 스킬 이름을 직접 사용: `use_skill("custom-skill")`
- 또는 스킬의 `label` 필드를 확인하여 올바른 네임스페이스 사용

## 이번 강의 요약

OpenCode Agent Skills의 네임스페이스 시스템은 라벨과 우선순위 규칙을 통해 다양한 출처의 스킬을 통합 관리합니다:

- **5가지 출처 라벨**: `project`, `claude-project`, `user`, `claude-user`, `claude-plugins`
- **6단계 우선순위**: 프로젝트 레벨 > Claude 프로젝트 레벨 > 사용자 레벨 > Claude 사용자 레벨 > 플러그인 캐시 > 플러그인 마켓
- **첫 번째 일치 적용**: 동명 스킬은 우선순위에 따라 로드되며, 이후 것은 무시됨
- **네임스페이스 접두사**: `namespace:skill-name` 형식으로 스킬 출처를 정확히 지정

이 메커니즘을 통해 자동 발견의 편리함을 누리면서도 필요할 때 스킬 출처를 정확히 제어할 수 있습니다.

## 다음 강의 예고

> 다음 강의에서는 **[컨텍스트 압축 복구 메커니즘](../context-compaction-resilience/)**을 학습합니다.
>
> 배울 내용:
> - 컨텍스트 압축이 스킬에 미치는 영향
> - 플러그인이 스킬 목록을 자동 복구하는 방법
> - 장시간 세션에서 스킬을 계속 사용 가능하게 유지하는 팁

---

## 부록: 소스코드 참고

<details>
<summary><strong>클릭하여 소스코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | ---|
| SkillLabel 타입 정의 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| 발견 우선순위 목록 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| 동명 스킬 중복 제거 로직 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |
| resolveSkill 네임스페이스 처리 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Superpowers 네임스페이스 설명 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |

**주요 타입**:
- `SkillLabel`: 스킬 출처 라벨 열거형
- `Skill`: 스킬 메타데이터 인터페이스 (`namespace` 및 `label` 필드 포함)

**주요 함수**:
- `discoverAllSkills()`: 우선순위에 따라 스킬을 발견하고 자동으로 중복 제거
- `resolveSkill()`: 네임스페이스 접두사를 파싱하여 스킬을 조회
- `maybeInjectSuperpowersBootstrap()`: 네임스페이스 우선순위 설명 주입

**발견 경로 목록** (우선순위 순):
1. `project` - `.opencode/skills/`
2. `claude-project` - `.claude/skills/`
3. `user` - `~/.config/opencode/skills/`
4. `claude-user` - `~/.claude/skills/`
5. `claude-plugins` - `~/.claude/plugins/cache/` 및 `~/.claude/plugins/marketplaces/`

</details>
