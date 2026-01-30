---
title: "스킬 파일 읽기: 리소스 액세스 | opencode-agent-skills"
subtitle: "스킬 파일 읽기: 리소스 액세스 | opencode-agent-skills"
sidebarTitle: "스킬 추가 리소스 접근"
description: "스킬 파일 읽기 방법을 배우세요. 경로 안전 검사 및 XML 주입 메커니즘을 마스터하여 스킬 디렉터리 아래의 문서와 설정에 안전하게 액세스하세요."
tags:
  - "스킬 파일"
  - "도구 사용"
  - "경로 안전"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: "6"
---

# 스킬 파일 읽기

## 배운 후 할 수 있는 것

- `read_skill_file` 도구를 사용하여 스킬 디렉터리 아래의 문서, 설정 및 예제 파일 읽기
- 경로 안전 메커니즘 이해하여 디렉터리 탈출 공격 방지
- XML 형식의 파일 내용 주입 방식 마스터
- 파일이 없을 때의 오류 처리 및 사용 가능한 파일 목록 확인

## 현재 어려운 점

스킬의 SKILL.md에는 핵심 가이드만 포함되어 있지만, 많은 스킬은配套 문서, 설정 예제, 사용 가이드 등 지원 파일을 제공합니다. 이러한 파일에 액세스하여 더 자세한 설명을 얻고 싶지만, 스킬 디렉터리 아래의 파일을 안전하게 읽는 방법을 모릅니다.

## 언제 이 방법을 사용하는가

- **상세 문서 확인**: 스킬의 `docs/` 디렉터리에 상세한 사용 가이드가 있음
- **설정 예제**: `config/` 디렉터리 아래의 예제 설정 파일 참고가 필요할 때
- **코드 예제**: 스킬의 `examples/` 디렉터리에 코드 예제가 포함됨
- **디버깅 지원**: 스킬의 README 또는 기타 설명 파일 확인
- **리소스 구조 파악**: 스킬 디렉터리에 사용 가능한 파일이 무엇인지 탐색

## 핵심 컨셉

`read_skill_file` 도구를 사용하면 스킬 디렉터리 아래의 지원 파일에 안전하게 액세스할 수 있습니다. 다음 메커니즘을 통해 안전성과 사용성을 보장합니다:

::: info 안전 메커니즘
플러그인이 파일 경로를 엄격하게 검사하여 디렉터리 탈출 공격을 방지합니다:
- `..`를 사용하여 스킬 디렉터리 외부의 파일에 접근하는 것을 금지
- 절대 경로 사용 금지
- 스킬 디렉터리 및 그 하위 디렉터리 내의 파일만 접근 허용
:::

도구 실행 흐름:
1. 스킬 이름 존재 여부 확인 (네임스페이스 지원)
2. 요청한 파일 경로가 안전한지 검사
3. 파일 내용 읽기
4. XML 형식으로 래핑하여 세션 컨텍스트에 주입
5. 성공적으로 로드되었음을 확인하는 메시지 반환

::: tip 파일 내용 영속화
파일 내용은 `synthetic: true` 및 `noReply: true` 플래그로 주입됩니다. 이는:
- 파일 내용이 세션 컨텍스트의 일부가 됨
- 세션이 압축되어도 여전히 접근 가능
- 주입이 AI의 직접 응답을 트리거하지 않음
:::

## 따라 해보기

### 1단계: 스킬 문서 읽기

스킬 디렉터리에 상세 사용 문서가 있다고 가정합니다:

```
사용자 입력:
git-helper의 문서를 읽어줘

시스템 호출:
read_skill_file(skill="git-helper", filename="docs/usage-guide.md")

시스템 응답:
File "docs/usage-guide.md" from skill "git-helper" loaded.
```

파일 내용은 XML 형식으로 세션 컨텍스트에 주입됩니다:

```xml
<skill-file skill="git-helper" file="docs/usage-guide.md">
  <metadata>
    <directory>/path/to/project/.opencode/skills/git-helper</directory>
  </metadata>

  <content>
# Git Helper 사용 가이드

이 스킬은 Git 브랜치 관리, 커밋 규칙 및 협업 워크플로우에 대한 가이드를 제공합니다...

[문서 내용 계속]
  </content>
</skill-file>
```

**보게 될 것**: 성공적으로 로드된 메시지와 세션 컨텍스트에 주입된 파일 내용.

### 2단계: 설정 예제 읽기

스킬의 예제 설정을 확인합니다:

```
사용자 입력:
docker-helper의 설정 예제를 보여줘

시스템 호출:
read_skill_file(skill="docker-helper", filename="config/docker-compose.yml.example")

시스템 응답:
File "config/docker-compose.yml.example" from skill "docker-helper" loaded.
```

**보게 될 것**: 설정 파일 내용이 주입되어, AI가 예제를 참고하여 실제 설정을 생성할 수 있습니다.

### 3단계: 네임스페이스를 사용하여 파일 읽기

프로젝트급과 사용자급에 동일한 이름의 스킬이 있는 경우:

```
사용자 입력:
project:build-helper의 빌드 스크립트를 읽어줘

시스템 호출:
read_skill_file(skill="project:build-helper", filename="scripts/build.sh")

시스템 응답:
File "scripts/build.sh" from skill "build-helper" loaded.
```

**보게 될 것**: 네임스페이스를 통해 스킬 출처를 명확하게 지정했습니다.

### 4단계: 파일이 없는 상황 처리

존재하지 않는 파일을 읽으려고 하면:

```
사용자 입력:
git-helper의 api-docs.md를 읽어줘

시스템 호출:
read_skill_file(skill="git-helper", filename="api-docs.md")

시스템 응답:
File "api-docs.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md, SKILL.md
```

도구가 스킬 디렉터리 아래의 모든 사용 가능한 파일을 나열하여 올바른 파일 이름을 찾는 데 도움을 줍니다.

**보게 될 것**: 오류 메시지와 사용 가능한 파일 목록.

### 5단계: 경로 안전 보호 체험

스킬 디렉터리 외부의 파일에 접근 시도:

```
사용자 입력:
git-helper의 상위 디렉터리 파일을 읽어줘

시스템 호출:
read_skill_file(skill="git-helper", filename="../secrets.txt")

시스템 응답:
Invalid path: cannot access files outside skill directory.
```

도구가 스킬 디렉터리 외부의 파일에 접근하려는 모든 시도를 거부합니다.

**보게 될 것**: 경로 안전 오류 메시지.

## 체크리스트 ✅

- [ ] `read_skill_file`를 사용하여 스킬 파일을 읽을 수 있나요?
- [ ] 경로 안전 메커니즘의 역할을 이해하나요?
- [ ] 파일 내용 주입의 XML 형식을 인식할 수 있나요?
- [ ] 오류 메시지에서 사용 가능한 파일 목록을 찾을 수 있나요?
- [ ] 네임스페이스를 사용하여 스킬을 정확하게 지정할 수 있나요?

## 주의할 점

### 함정 1: 파일 경로 오류

파일이 하위 디렉터리에 있는 것을 잊은 경우:

```
사용자 입력:
git-helper의 usage-guide.md를 읽어줘

시스템 응답:
File "usage-guide.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md
```

**원인**: 파일이 하위 디렉터리에 있을 수 있으므로 상대 경로를 지정해야 합니다.

**해결**: `docs/usage-guide.md`와 같은 전체 경로를 사용하세요.

### 함정 2: 네임스페이스 충돌 무시

동일한 이름의 스킬이 여러 네임스페이스에 있는 경우:

```
사용자 입력:
build-helper의 README를 읽어줘

시스템 응답:
File "README.md" from skill "build-helper" loaded.
```

프로젝트급 스킬을 읽었지만 사용자급 스킬을 원하는 것일 수 있습니다.

**해결**: 네임스페이스를 명확하게 지정하세요. 예: `read_skill_file(skill="user:build-helper", filename="README.md")`.

### 함정 3: 경로 탈출 시도

`..`를 사용하여 상위 디렉터리에 접근 시도:

```
사용자 입력:
스킬 디렉터리 외부의 파일을 읽어줘

시스템 호출:
read_skill_file(skill="my-skill", filename="../../../etc/passwd")

시스템 응답:
Invalid path: cannot access files outside skill directory.
```

**원인**: 이는 디렉터리 탈출 공격을 방지하는 보안 제한입니다.

**해결**: 스킬 디렉터리 내의 파일에만 접근할 수 있습니다. 다른 파일이 필요한 경우 AI에게 직접 `Read` 도구를 사용하도록 요청하세요.

### 함정 4: 파일이 이미 세션 컨텍스트에 있는 경우

이미 스킬을 로드한 경우, 파일 내용이 스킬의 SKILL.md 또는 기타 주입된 내용에 있을 수 있습니다:

```
사용자 입력:
스킬의 핵심 문서를 읽어줘

시스템 호출:
read_skill_file(skill="my-skill", filename="core-guide.md")
```

그러나 핵심 내용은 일반적으로 SKILL.md에 있으므로 불필요할 수 있습니다.

**해결**: 먼저 로드된 스킬의 내용을 확인하여 추가 파일이 필요한지 확인하세요.

## 요약

`read_skill_file` 도구를 사용하면 스킬 디렉터리 아래의 지원 파일에 안전하게 액세스할 수 있습니다:

- **안전한 경로 검사**: 디렉터리 탈출을 방지하고 스킬 디렉터리 내의 파일만 접근 허용
- **XML 주입 메커니즘**: 파일 내용이 `<skill-file>` XML 태그로 래핑되어 메타데이터 포함
- **친절한 오류 처리**: 파일이 없을 때 사용 가능한 파일을 나열하여 올바른 경로를 찾는 데 도움
- **네임스페이스 지원**: `namespace:skill-name` 형식으로 동명의 스킬을 정확하게 지정 가능
- **컨텍스트 영속화**: `synthetic: true` 플래그로 세션 압축 후에도 파일 내용 접근 가능

이 도구는 다음과 같은 스킬을 읽는 데 매우 적합합니다:
- 상세 문서 (`docs/` 디렉터리)
- 설정 예제 (`config/` 디렉터리)
- 코드 예제 (`examples/` 디렉터리)
- README 및 설명 파일
- 스크립트 소스 (구현을 확인해야 하는 경우)

## 다음 수업 예고

> 다음 수업에서는 **[Claude Code 스킬 호환성](../../advanced/claude-code-compatibility/)**을 학습합니다.
>
> 학습 내용:
> - 플러그인이 Claude Code의 스킬 및 플러그인 시스템과 호환되는 방식 이해
> - 도구 매핑 메커니즘 이해 (Claude Code 도구에서 OpenCode 도구로의 변환)
> - Claude Code 설치 위치에서 스킬을 발견하는 방법 마스터

---

## 부록: 소스 코드 참고

<details>
<summary><strong>소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| ReadSkillFile 도구 정의 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| 경로 안전 검사 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| 스킬 파일 목록 조회 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |
| resolveSkill 함수 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| injectSyntheticContent 함수 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |

**주요 타입**:
- `Skill`: 스킬 메타데이터 인터페이스 (`skills.ts:43-52`)
- `OpencodeClient`: OpenCode SDK 클라이언트 타입 (`utils.ts:140`)
- `SessionContext`: 세션 컨텍스트로, model 및 agent 정보 포함 (`utils.ts:142-145`)

**주요 함수**:
- `ReadSkillFile(directory: string, client: OpencodeClient)`: 도구 정의를 반환하여 스킬 파일 읽기 처리
- `isPathSafe(basePath: string, requestedPath: string): boolean`: 경로가基 디렉터리 내에 있는지 확인하여 디렉터리 탈출 방지
- `listSkillFiles(skillPath: string, maxDepth: number = 3): Promise<string[]>`: 스킬 디렉터리 아래의 모든 파일 목록 조회 (SKILL.md 제외)
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>): Skill | null`: `namespace:skill-name` 형식의 스킬解析 지원
- `injectSyntheticContent(client, sessionID, text, context)`: `noReply: true` 및 `synthetic: true`를 사용하여 세션에 내용 주입

**비즈니스 규칙**:
- 경로 안전 검사는 `path.resolve()`를 사용하여 확인하며, 해결된 경로가基 디렉터리로 시작하는지 검증 (`utils.ts:131-132`)
- 파일이 없을 때 `fs.readdir()`를 사용하여 사용 가능한 파일을 나열하고, 친절한 오류 메시지 제공 (`tools.ts:126-131`)
- 파일 내용은 `skill`, `file` 속성과 `<metadata>`, `<content>` 태그가 포함된 XML 형식으로 래핑 (`tools.ts:111-119`)
- 주입 시 현재 세션의 model 및 agent 컨텍스트를 가져와서 올바른 컨텍스트에 내용 주입 (`tools.ts:121-122`)

**안전 메커니즘**:
- 디렉터리 탈출 방지: `isPathSafe()`가 경로가基 디렉터리 내에 있는지 확인 (`utils.ts:130-133`)
- 스킬이 없을 때模糊 매칭 제안 제공 (`tools.ts:90-95`)
- 파일이 없을 때 사용 가능한 파일을 나열하여 사용자가 올바른 경로를 찾을 수 있도록 도움 (`tools.ts:126-131`)

</details>
