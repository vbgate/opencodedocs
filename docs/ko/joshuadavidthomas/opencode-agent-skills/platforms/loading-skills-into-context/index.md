---
title: "스킬 로드: XML 콘텐츠 주입 | opencode-agent-skills"
sidebarTitle: "AI가 당신의 스킬을 활용할 수 있도록"
subtitle: "대화 컨텍스트에 스킬 로드하기"
description: "use_skill 도구를 사용하여 대화에 스킬을 로드하는 방법을 마스터하세요. XML 주입과 Synthetic Message Injection 메커니즘을 이해하고 스킬 메타데이터 관리를 학습하세요."
tags:
  - "스킬 로드"
  - "XML 주입"
  - "컨텍스트 관리"
prerequisite:
  - "start-creating-your-first-skill"
  - "platforms-listing-available-skills"
order: "3"
---

# 대화 컨텍스트에 스킬 로드하기

## 배운 후 당신이 할 수 있는 것

- `use_skill` 도구를 사용하여 현재 대화에서 스킬 로드
- 스킬 콘텐츠가 XML 형식으로 컨텍스트에 주입되는 방식 이해
- Synthetic Message Injection 메커니즘 마스터 (synthetic 메시지 주입)
- 스킬 메타데이터 구조 이해 (소스, 디렉토리, 스크립트, 파일)
- 대화 압축 후에도 스킬이 계속 사용 가능한지 확인

## 현재 당신이 직면한 문제

스킬을 생성했지만 AI가 해당 콘텐츠에 접근할 수 없는 것 같습니다. 또는 긴 대화에서 스킬 가이드라인이 갑자기 사라지고 AI가 이전 규칙을 잊어버립니다. 이러한 문제는 모두 스킬 로드 메커니즘과 관련이 있습니다.

## 이 방법을 사용해야 하는 경우

- **수동 스킬 로드**: AI의 자동 추천이 적절하지 않을 때 필요한 스킬을 직접 지정
- **긴 대화 유지**: 대화 압축 후에도 스킬 콘텐츠가 계속 접근 가능한지 확인
- **Claude Code 호환성**: Claude 형식의 스킬을 로드하여 도구 매핑 얻기
- **정밀한 제어**: 특정 버전의 스킬 로드 필요 (네임스페이스를 통해)

## 핵심 개념

`use_skill` 도구는 스킬의 SKILL.md 콘텐츠를 대화 컨텍스트에 주입하여 AI가 스킬에 정의된 규칙과 워크플로우를 따르도록 합니다.

### XML 콘텐츠 주입

스킬 콘텐츠는 구조화된 XML 형식으로 주입되며, 세 가지 부분을 포함합니다:

```xml
<skill name="skill-name">
  <metadata>
    <source>스킬 소스 레이블</source>
    <directory>스킬 디렉토리 경로</directory>
    <scripts>
      <script>tools/script1.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
    </files>
  </metadata>

  <tool-mapping>
    <!-- Claude Code 도구 매핑 -->
  </tool-mapping>

  <content>
    SKILL.md의 전체 콘텐츠
  </content>
</skill>
```

### Synthetic Message Injection

플러그인은 OpenCode SDK의 `session.prompt()` 메서드를 사용하여 스킬 콘텐츠를 주입하며, 두 가지 주요 플래그를 설정합니다:

::: info Synthetic Message Injection
- `noReply: true` - AI가 이 주입 자체에 응답하지 않음
- `synthetic: true` - 메시지를 시스템 생성으로 표시 (사용자에게 숨겨짐, 사용자 입력으로 계산되지 않음)
:::

이것은 다음을 의미합니다:
- **사용자에게 보이지 않음**: 스킬 주입이 대화 기록에 표시되지 않음
- **입력 소비 안 함**: 사용자 메시지 수에 포함되지 않음
- **지속적 가용성**: 대화 압축 후에도 스킬 콘텐츠가 컨텍스트에 유지됨

### 대화 수명 주기

1. **첫 메시지 시**: 플러그인이 자동으로 `<available-skills>` 목록을 주입하여 사용 가능한 모든 스킬을 표시
2. **`use_skill` 사용**: 선택한 스킬의 XML 콘텐츠를 컨텍스트에 주입
3. **대화 압축 후**: 플러그인이 `session.compacted` 이벤트를 수신하여 스킬 목록을 다시 주입

## 함께 해보기

### 1단계: 기본 스킬 로드

OpenCode에서 AI에게 스킬을 로드하도록 요청합니다:

```
사용자 입력:
brainstorming 스킬 로드

시스템 응답:
Skill "brainstorming" loaded.
```

**당신이 확인해야 할 것**: AI가 로드 성공 메시지를 반환하고 스킬 콘텐츠가 컨텍스트에 주입되었습니다.

이제 AI가 스킬 규칙을 따르는지 테스트할 수 있습니다:

```
사용자 입력:
제품 설명 작성 도와줘

시스템 응답:
(AI는 brainstorming 스킬의 규칙에 따라 콘텐츠를 생성하며,其中的 기법과 프로세스를 따릅니다)
```

### 2단계: 로드 후 사용 가능한 리소스 확인

스킬을 로드할 때 시스템은 사용 가능한 스크립트와 파일 목록을 반환합니다:

```
사용자 입력:
git-helper 로드

시스템 응답:
Skill "git-helper" loaded.
Available scripts: tools/branch.sh, tools/commit.sh
Available files: docs/usage.md, examples/workflow.md
```

이 정보는 스킬 디렉토리에서 사용 가능한 리소스를 알려줍니다:
- **스크립트**: `run_skill_script` 도구로 실행 가능
- **파일**: `read_skill_file` 도구로 읽기 가능

**당신이 확인해야 할 것**: 성공 메시지와 함께 사용 가능한 스크립트 및 파일 목록.

### 3단계: 네임스페이스를 사용하여 동명 스킬 로드

프로젝트 수준과 사용자 수준 모두에 `build-helper` 스킬이 있다고 가정합니다:

```
사용자 입력:
build-helper 로드

시스템 응답:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh

사용자 입력:
(로드된 build-helper 버전 확인)
```

스킬 발견 우선순위에 따라 기본적으로 프로젝트 수준의 스킬이 로드됩니다. 사용자 수준의 스킬이 필요한 경우:

```
사용자 입력:
user:build-helper 로드

시스템 응답:
Skill "build-helper" loaded.
Available scripts: ci.sh, test.sh
Available files: README.md
```

**당신이 확인해야 할 것**: `namespace:skill-name` 형식을 사용하여 다양한 소스의 동명 스킬을 로드.

### 4단계: 스킬 가이드라인 효과 경험

스킬을 로드한 후 AI의 동작은 스킬에 정의된 규칙을 따라야 합니다. brainstorming 스킬을 예로 들면:

```
사용자 입력:
brainstorming 로드
스마트 홈 제품의 핵심 판매 포인트 아이디어

시스템 응답:
(AI는 brainstorming 스킬에 정의된 기법을 사용합니다:
- 먼저 가능한 방향을 나열한 후 심층 탐색
- 아이디어에 대한 판단을 피하고
- "예, 그리고..."를 사용하여 사고 확장
- 모든 아이디어를 기록한 후 선택)

가능한 방향을 먼저 나열해 봅시다:
1. 편의성 제어
2. 에너지 관리
3. 보안 보호
...
```

**당신이 확인해야 할 것**: AI의 답변 스타일과 프로세스가 스킬에 정의된 것과 일치합니다.

### 5단계: 긴 대화에서 스킬 지속성 이해

오래 동안 대화를 진행하면서 스킬이 계속 효과적인지 관찰합니다:

```
사용자 입력:
docker-helper 로드
(构建, 배포 등을 포함한 다중 라운드 대화 진행)
...
(대화가 길어져 OpenCode의 컨텍스트 압축이 트리거되었다고 가정)
사용자 입력:
이전 Docker 배포 계속

시스템 응답:
(AI仍然能够访问 docker-helper 의内容,
因为插件在压缩后重新注入了技能列表)
```

::: tip 압축 복구 메커니즘
플러그인이 `session.compacted` 이벤트를 수신하여 대화 압축 시 스킬 목록을 다시 주입하여 로드된 스킬이 압축 후에도 계속 접근 가능하도록 합니다.
:::

**당신이 확인해야 할 것**: 대화가 길고 컨텍스트가 압축되어도 AI가 스킬 콘텐츠에 계속 접근할 수 있습니다.

### 6단계: Claude Code 형식의 스킬 로드

Claude Code 스킬이 있는 경우 자동으로 발견됩니다:

```
사용자 입력:
사용 가능한 모든 스킬 나열

시스템 응답:
...
claude-code-superpowers (claude-plugins)
  완전한 소프트웨어 개발 워크플로우

사용자 입력:
claude-code-superpowers 로드

시스템 응답:
Skill "claude-code-superpowers" loaded.
```

Claude 형식 스킬을 로드할 때 도구 매핑(toolTranslation)이 자동으로 주입되어 Claude의 도구 이름을 OpenCode의 도구에 매핑합니다:

::: info 도구 매핑 예
- Claude의 `TodoWrite` → OpenCode의 `todowrite`
- Claude의 `Task` → OpenCode의 `task` (하위 에이전트)
- Claude의 `Bash` → OpenCode의 `bash`
:::

**당신이 확인해야 할 것**: 스킬 로드 성공, AI가 Claude 형식의 워크플로우를 이해하고 사용할 수 있습니다.

## 체크포인트 ✅

- [ ] `use_skill`를 사용하여 스킬을 로드할 수 있습니까?
- [ ] 스킬 콘텐츠가 XML 형식으로 주입되는 메커니즘을 이해할 수 있습니까?
- [ ] synthetic 메시지의 두 가지 주요 플래그를 말할 수 있습니까?
- [ ] 대화 압축 후에도 스킬이 계속 사용 가능한 이유를 설명할 수 있습니까?
- [ ] 네임스페이스를 사용하여 동명 스킬의 다른 버전을 로드할 수 있습니까?

## 함정 주의

### 함정 1: 스킬 이름 오타

잘못된 스킬 이름을 입력하면:

```
사용자 입력:
brainstormig 로드

시스템 응답:
Skill "brainstormig" not found. Did you mean "brainstorming"?
```

플러그인이 편집 거리를 기반으로 퍼지 매칭 제안을 제공합니다.

**해결**: 철자를 확인하거나 `get_available_skills`를 사용하여 올바른 이름을 확인합니다.

### 함정 2: 동명 스킬 혼동

프로젝트 수준과 사용자 수준에 동명 스킬이 있으면 잘못된 버전을 로드할 수 있습니다:

```
사용자 입력:
build-helper 로드

시스템 응답:
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh  # 이것은 프로젝트 수준의 것입니다

사용자 수준을 로드하고 싶었지만 기본적으로 프로젝트 수준이 로드되었습니다
```

**해결**: `user:build-helper`와 같이 네임스페이스를 사용하여 명시적으로 지정합니다.

### 함정 3: 스킬 콘텐츠가 적용되지 않음

가끔 스킬을 로드했지만 AI가 규칙을 따르지 않는 것 같습니다:

```
사용자 입력:
my-conventions 로드
(AI가 코드 규칙을 따르기를 기대)
사용자 입력:
함수 작성

시스템 응답:
(AI가 예상한 규칙에 맞지 않는 코드를 작성함)
```

**가능한 원인**:
- 스킬 SKILL.md의 콘텐츠가 충분히 명확하지 않음
- 스킬 설명이 너무 간략하여 AI가 오해함
- 긴 대화에서 컨텍스트가 압축되어 스킬 목록을 다시 주입해야 함

**해결**:
- 스킬의 frontmatter와 콘텐츠가 명확한지 확인
- AI에게 특정 규칙을 사용하도록 명시적으로 지시: "my-conventions 스킬의 규칙을 사용하세요"
- 압축 후 스킬을 다시 로드

### 함정 4: Claude 스킬의 도구 매핑 문제

Claude Code 스킬을 로드한 후 AI가 여전히 잘못된 도구 이름을 사용할 수 있습니다:

```
사용자 입력:
claude-code-superpowers 로드
TodoWrite 도구 사용

시스템 응답:
(AI가 도구 이름을 올바르게 매핑하지 않아 잘못된 도구 이름을 사용하려 할 수 있습니다)
```

**원인**: 스킬을 로드할 때 도구 매핑이 자동으로 주입되지만 AI가 명시적인 힌트가 필요할 수 있습니다.

**해결**: 스킬을 로드한 후 AI에게 매핑된 도구를 사용하도록 명시적으로 지시합니다:

```
사용자 입력:
claude-code-superpowers 로드
todowrite 도구 사용 (TodoWrite 아님)
```

## 본 수업 요약

`use_skill` 도구는 Synthetic Message Injection 메커니즘을 통해 스킬 콘텐츠를 XML 형식으로 대화 컨텍스트에 주입합니다:

- **XML 구조화된 주입**: 메타데이터, 도구 매핑 및 스킬 콘텐츠 포함
- **Synthetic 메시지**: `noReply: true`와 `synthetic: true`가 메시지를 사용자에게 숨김
- **지속적 가용성**: 컨텍스트 압축 후에도 스킬 콘텐츠 접근 가능
- **네임스페이스 지원**: `namespace:skill-name` 형식으로 스킬 소스를 정확하게 지정
- **Claude 호환성**: 도구 매핑 자동 주입, Claude Code 스킬 지원

스킬 로드는 AI가 특정 워크플로우와 규칙을 따르게 하는 핵심 메커니즘입니다. 콘텐츠 주입을 통해 AI는 전체 대화 과정에서 일관된 동작 스타일을 유지할 수 있습니다.

## 다음 수업 예고

> 다음 수업에서는 **[자동 스킬 추천: 의미 일치 원리](../automatic-skill-matching/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - 플러그인이 의미 유사도를 기반으로 관련 스킬을 자동으로 추천하는 방식 이해
> - embedding 모델과 코사인 유사도 계산의 기본 원리 마스터
> - 더 나은 추천 결과를 얻기 위한 스킬 설명 최적화 기법 이해
> - embedding 캐싱 메커니즘이 성능을 어떻게 향상시키는지 확인

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| UseSkill 도구 정의 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| injectSyntheticContent 함수 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| injectSkillsList 함수 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L345-L370) | 345-370 |
| resolveSkill 함수 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| listSkillFiles 함수 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |

**주요 상수**:
- 없음

**주요 함수**:
- `UseSkill()`: `skill` 매개변수를 수락하여 XML 형식의 스킬 콘텐츠를 구성하고 대화에 주입
- `injectSyntheticContent(client, sessionID, text, context)`: `client.session.prompt()`를 통해 synthetic 메시지를 주입하고 `noReply: true`와 `synthetic: true` 설정
- `injectSkillsList()`: 첫 메시지 시 `<available-skills>` 목록 주입
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: `namespace:skill-name` 형식의 스킬 파싱 지원
- `listSkillFiles(skillPath: string, maxDepth: number)`: 스킬 디렉토리 아래의 모든 파일을 재귀적으로 나열 (SKILL.md 제외)

**비즈니스 규칙**:
- 스킬 콘텐츠는 메타데이터, 도구 매핑 및 콘텐츠를 포함하여 XML 형식으로 주입 (`tools.ts:238-249`)
- 주입된 메시지는 synthetic으로 표시되어 사용자 입력으로 계산되지 않음 (`utils.ts:159`)
- 로드된 스킬은 현재 대화에서 더 이상 추천되지 않음 (`plugin.ts:128-132`)
- 스킬 목록은 첫 메시지 시 자동으로 주입 (`plugin.ts:70-105`)
- 대화 압축 후 스킬 목록 다시 주입 (`plugin.ts:145-151`)

**XML 콘텐츠 형식**:
```xml
<skill name="${skill.name}">
  <metadata>
    <source>${skill.label}</source>
    <directory>${skill.path}</directory>
    <scripts>
      <script>${script.relativePath}</script>
    </scripts>
    <files>
      <file>${file}</file>
    </files>
  </metadata>

  ${toolTranslation}

  <content>
  ${skill.template}
  </content>
</skill>
```

</details>
