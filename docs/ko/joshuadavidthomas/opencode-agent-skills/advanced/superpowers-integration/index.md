---
title: "Superpowers 통합: 워크플로우 구성 | opencode-agent-skills"
subtitle: "Superpowers 통합: 워크플로우 구성 | opencode-agent-skills"
sidebarTitle: "Superpowers 활성화"
description: "Superpowers 모드의 설치 및 구성 방법을 학습합니다. 환경 변수를 통해 워크플로우 가이드를 활성화하고, 도구 매핑과 네임스페이스 우선순위 규칙을 마스터하세요."
tags:
  - "고급 구성"
  - "워크플로우"
  - "Superpowers"
prerequisite:
  - "start-installation"
order: 2
---

# Superpowers 워크플로우 통합

## 배우면 할 수 있는 것

- Superpowers 워크플로우의 가치와 적용 시나리오 이해
- Superpowers 모드의 올바른 설치 및 구성
- 도구 매핑과 스킬 네임스페이스 시스템 이해
- 압축 복구 시 Superpowers의 자동 주입 메커니즘 마스터

## 현재 직면한 어려움

다음과 같은 문제를 고려하고 있을 수 있습니다:

- **워크플로우가 충분히 표준화되지 않음**: 팀원들의 개발 습관이 통일되지 않아 코드 품질이 일정하지 않음
- **엄격한 프로세스 부재**: 스킬 라이브러리는 있지만, AI 어시스턴트에게 명확한 프로세스 가이드가 없음
- **도구 호출 혼란**: Superpowers가 정의한 도구와 OpenCode의 네이티브 도구 이름이 달라 호출 실패
- **마이그레이션 비용 우려**: 이미 Superpowers를 사용 중인데, OpenCode로 전환하면 재구성이 필요할까 걱정

이러한 문제들은 모두 개발 효율성과 코드 품질에 영향을 줍니다.

## 핵심 개념

::: info Superpowers란?
Superpowers는 조합형 스킬을 통해 엄격한 워크플로우 가이드를 제공하는 완전한 소프트웨어 개발 워크플로우 프레임워크입니다. 표준화된 개발 단계, 도구 호출 방식, 네임스페이스 시스템을 정의합니다.
:::

**OpenCode Agent Skills는 원활한 Superpowers 통합을 제공합니다**. 환경 변수를 통해 활성화하면 다음을 포함한 완전한 워크플로우 가이드를 자동으로 주입합니다:

1. **using-superpowers 스킬 콘텐츠**: Superpowers 핵심 워크플로우 지침
2. **도구 매핑**: Superpowers가 정의한 도구 이름을 OpenCode 네이티브 도구로 매핑
3. **스킬 네임스페이스**: 스킬의 우선순위와 참조 방식 명확화

## 🎒 시작 전 준비사항

시작하기 전에 다음을 확인하세요:

::: warning 사전 체크
- ✅ [opencode-agent-skills 플러그인](../../start/installation/)이 설치됨
- ✅ 기본적인 스킬 발견 메커니즘에 익숙함
:::

## 따라해보기

### 1단계: Superpowers 설치

**이유**
Superpowers 프로젝트를 먼저 설치해야 본 플러그인이 `using-superpowers` 스킬을 발견할 수 있습니다.

**방법**

요구사항에 따라 다음 방법 중 하나를 선택하여 Superpowers를 설치하세요:

::: code-group

```bash [Claude Code 플러그인으로]
// Superpowers 공식 문서에 따라 설치
// https://github.com/obra/superpowers
// 스킬은 ~/.claude/plugins/...에 자동 위치
```

```bash [OpenCode 스킬로]
// 수동으로 OpenCode 스킬로 설치
mkdir -p ~/.config/opencode/skills
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
// 스킬은 .opencode/skills/superpowers/ (프로젝트 레벨) 또는 ~/.config/opencode/skills/superpowers/ (사용자 레벨)에 위치
```

:::

**확인 사항**:
- 설치 후 Superpowers 스킬 디렉토리에 `using-superpowers/SKILL.md` 파일이 있어야 함

### 2단계: Superpowers 모드 활성화

**이유**
환경 변수를 통해 플러그인에 Superpowers 모드를 활성화하도록 알리면, 플러그인이 세션 초기화 시 자동으로 관련 콘텐츠를 주입합니다.

**방법**

임시 활성화 (현재 터미널 세션에만):

```bash
export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true
opencode
```

영구 활성화 (셸 설정 파일에 추가):

::: code-group

```bash [Bash (~/.bashrc 또는 ~/.bash_profile)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.bashrc
source ~/.bashrc
```

```zsh [Zsh (~/.zshrc)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.zshrc
source ~/.zshrc
```

```powershell [PowerShell (~/.config/powershell/Microsoft.PowerShell_profile.ps1)]
[System.Environment]::SetEnvironmentVariable('OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE', 'true', 'User')
```

:::

**확인 사항**:
- `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` 입력 시 `true`가 표시됨

### 3단계: 자동 주입 검증

**이유**
플러그인이 Superpowers 스킬을 올바르게 인식하고, 새 세션 시작 시 콘텐츠를 자동으로 주입하는지 확인합니다.

**방법**

1. OpenCode를 다시 시작
2. 새 세션을 생성
3. 새 세션에 아무 메시지나 입력 (예: "안녕")
4. 세션 컨텍스트 확인 (OpenCode에서 지원하는 경우)

**확인 사항**:
- 플러그인이 백그라운드에서 다음 콘텐츠를 자동으로 주입함 (XML 형식):

```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - do not call use_skill for it again. Use use_skill only for OTHER skills.**

[using-superpowers 스킬의 실제 콘텐츠...]

**Tool Mapping for OpenCode:**
- `TodoWrite` → `todowrite`
- `Task` tool with subagents → Use `task` tool with `subagent_type`
- `Skill` tool → `use_skill`
- `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebFetch` → Use native lowercase OpenCode tools

**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
</EXTREMELY_IMPORTANT>
```

## 체크포인트 ✅

위 단계를 완료한 후 다음을 확인하세요:

| 검사 항목 | 예상 결과 |
|---|---|
| 환경 변수 설정 정확함 | `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` 출력이 `true` |
| Superpowers 스킬 발견 가능 | `get_available_skills()` 호출 시 `using-superpowers`가 목록에 보임 |
| 새 세션 자동 주입 | 새 세션 생성 후 AI가 superpowers를 가지고 있다는 것을 인지 |

## 주의사항

### ❌ 오류 1: 스킬 발견되지 않음

**증상**: 환경 변수를 활성화했지만 플러그인이 Superpowers 콘텐츠를 주입하지 않음.

**원인**: Superpowers 설치 위치가 스킬 발견 경로에 없음.

**해결책**:
- Superpowers가 다음 위치 중 하나에 설치되어 있는지 확인:
  - `.claude/plugins/...` (Claude Code 플러그인 캐시)
  - `.opencode/skills/...` (OpenCode 스킬 디렉토리)
  - `~/.config/opencode/skills/...` (OpenCode 사용자 스킬)
  - `~/.claude/skills/...` (Claude 사용자 스킬)
- `get_available_skills()`를 실행하여 `using-superpowers`가 목록에 있는지 확인

### ❌ 오류 2: 도구 호출 실패

**증상**: AI가 `TodoWrite` 또는 `Skill` 도구를 호출하려고 시도하지만, 도구가 존재하지 않는다는 메시지.

**원인**: AI가 도구 매핑을 적용하지 않고 Superpowers에서 정의한 이름을 여전히 사용 중.

**해결책**:
- 플러그인이 `<EXTREMELY_IMPORTANT>` 태그를 올바르게 주입하는지 확인
- 문제가 지속되면, 세션이 환경 변수 활성화 후에 생성되었는지 확인

### ❌ 오류 3: 압축 후 Superpowers 사라짐

**증상**: 장시간 세션 후, AI가 더 이상 Superpowers 워크플로우를 따르지 않음.

**원인**: 컨텍스트 압축으로 인해 이전 주입 콘텐츠가 삭제됨.

**해결책**:
- 플러그인이 `session.compacted` 이벤트 후 자동으로 Superpowers 콘텐츠를 다시 주입
- 문제가 지속되면 플러그인이 이벤트를 정상적으로 수신하는지 확인

## 도구 매핑 상세 설명

플러그인은 다음 도구 매핑을 자동으로 주입하여 AI가 OpenCode 도구를 올바르게 호출할 수 있도록 돕습니다:

| Superpowers 도구 | OpenCode 도구 | 설명 |
|---|---|---|
| `TodoWrite` | `todowrite` | Todo 쓰기 도구 |
| `Task` (subagents 포함) | `task` + `subagent_type` | 서브에이전트 호출 |
| `Skill` | `use_skill` | 스킬 로드 |
| `Read` / `Write` / `Edit` | 네이티브 소문자 도구 | 파일 작업 |
| `Bash` / `Glob` / `Grep` / `WebFetch` | 네이티브 소문자 도구 | 시스템 작업 |

::: tip 도구 매핑이 필요한 이유?
Superpowers는 원래 Claude Code를 기반으로 설계되어 도구 이름이 OpenCode와 일치하지 않습니다. 자동 매핑을 통해 AI는 수동 변환 없이 OpenCode의 네이티브 도구를 원활하게 사용할 수 있습니다.
:::

## 스킬 네임스페이스 우선순위

여러 소스에 동일한 이름의 스킬이 존재할 때, 플러그인은 다음 우선순위에 따라 선택합니다:

```
1. project:skill-name         (프로젝트 레벨 OpenCode 스킬)
2. claude-project:skill-name  (프로젝트 레벨 Claude 스킬)
3. skill-name                (사용자 레벨 OpenCode 스킬)
4. claude-user:skill-name    (사용자 레벨 Claude 스킬)
5. claude-plugins:skill-name (플러그인 마켓 스킬)
```

::: info 네임스페이스 참조
네임스페이스를 명시적으로 지정할 수 있습니다: `use_skill("project:my-skill")`  
또는 플러그인이 자동으로 매칭하도록 할 수 있습니다: `use_skill("my-skill")`
:::

**첫 번째로 발견된 매칭이 적용**되며, 이후 동명 스킬은 무시됩니다. 이를 통해 프로젝트 레벨 스킬이 사용자 레벨 스킬을 덮어쓸 수 있습니다.

## 압축 복구 메커니즘

장시간 세션 중 OpenCode는 토큰 절약을 위해 컨텍스트 압축을 실행합니다. 플러그인은 다음 메커니즘을 통해 Superpowers가 지속적으로 사용 가능하도록 보장합니다:

1. **이벤트 수신**: 플러그인이 `session.compacted` 이벤트를 수신
2. **재주입**: 압축 완료 후, Superpowers 콘텐츠를 자동으로 다시 주입
3. **무감지 전환**: AI의 워크플로우 가이드가 압축으로 인해 중단되지 않고 항상 존재

## 본 강의 요약

Superpowers 통합은 엄격한 워크플로우 가이드를 제공하며, 핵심 포인트는 다음과 같습니다:

- **Superpowers 설치**: Claude Code 플러그인 또는 OpenCode 스킬 중 하나의 방식 선택
- **환경 변수 활성화**: `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true` 설정
- **자동 주입**: 플러그인이 세션 초기화 및 압축 후 자동으로 콘텐츠 주입
- **도구 매핑**: Superpowers 도구 이름을 OpenCode 네이티브 도구로 자동 매핑
- **네임스페이스 우선순위**: 프로젝트 레벨 스킬이 사용자 레벨 스킬보다 우선

## 다음 강의 예고

> 다음 강의에서는 **[네임스페이스와 스킬 우선순위](../namespaces-and-priority/)**를 학습합니다.
>
> 배울 내용:
> - 스킬의 네임스페이스 시스템과 발견 우선순위 규칙 이해
> - 네임스페이스를 사용하여 스킬 소스를 명시적으로 지정하는 방법
> - 동명 스킬의 덮어쓰기 및 충돌 처리 메커니즘

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 라인 |
|---|---|---|
| Superpowers 통합 모듈 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L1-L59) | 1-59 |
| 도구 매핑 정의 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L12-L16) | 12-16 |
| 스킬 네임스페이스 정의 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |
| Superpowers 콘텐츠 주입 함수 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L31-L58) | 31-58 |
| 환경 변수 확인 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L37) | 37 |
| 세션 초기화 주입 호출 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L101) | 101 |
| 압축 후 재주입 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L148) | 148 |

**핵심 상수**:
- `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE`: 환경 변수, `'true'`로 설정하면 Superpowers 모드 활성화

**핵심 함수**:
- `maybeInjectSuperpowersBootstrap()`: 환경 변수와 스킬 존재 여부를 확인하여 Superpowers 콘텐츠 주입
- `discoverAllSkills()`: 모든 사용 가능한 스킬 발견 (`using-superpowers` 조회용)
- `injectSyntheticContent()`: 콘텐츠를 synthetic 메시지 형태로 세션에 주입

</details>
