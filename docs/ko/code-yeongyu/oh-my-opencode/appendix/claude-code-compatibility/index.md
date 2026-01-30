---
title: "호환성: Claude Code 통합 | oh-my-opencode"
sidebarTitle: "Claude Code 구성 재사용"
subtitle: "Claude Code 호환성: Commands, Skills, Agents, MCPs 및 Hooks의 완전한 지원"
description: "oh-my-opencode의 Claude Code 호환 레이어를 학습하세요. 구성 로딩, 우선순위 규칙 및 비활성화 스위치를 마스터하여 OpenCode로의 원활한 마이그레이션을 구현하세요."
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Claude Code 호환성: Commands, Skills, Agents, MCPs 및 Hooks의 완전한 지원

## 학습 완료 후 할 수 있는 것

- OpenCode에서 Claude Code의 기존 구성 및 플러그인 사용하기
- 다양한 구성 소스의 우선순위 규칙 이해하기
- 구성 스위치를 통해 Claude Code 호환 기능의 로딩 제어하기
- Claude Code에서 OpenCode로의 원활한 마이그레이션 수행하기

## 현재 직면한 문제

Claude Code에서 OpenCode로 마이그레이션하는 경우, `~/.claude/` 디렉토리에 많은 사용자 정의 Commands, Skills 및 MCP 서버를 구성했을 수 있습니다. 이러한 내용을 다시 구성하는 것은 번거롭습니다. 이 구성을 OpenCode에서 직접 재사용할 수 있기를 원할 것입니다.

Oh My OpenCode는 기존 Claude Code 구성 및 플러그인을 수정 없이 바로 사용할 수 있는 완전한 Claude Code 호환 레이어를 제공합니다.

## 핵심 개념

Oh My OpenCode는 **자동 로딩 메커니즘**을 통해 Claude Code의 구성 형식을 호환합니다. 시스템은 시작 시 Claude Code의 표준 구성 디렉토리를 자동으로 스캔하여 이러한 리소스를 OpenCode에서 인식할 수 있는 형식으로 변환하고 시스템에 등록합니다.

다음 기능을 포함하는 호환성이 제공됩니다:

| 기능 | 호환 상태 | 설명 |
|---|---|---|
| **Commands** | ✅ 완전히 지원 | `~/.claude/commands/` 및 `.claude/commands/`에서 슬래시 명령 로드 |
| **Skills** | ✅ 완전히 지원 | `~/.claude/skills/` 및 `.claude/skills/`에서 전문 Skills 로드 |
| **Agents** | ⚠️ 예약됨 | 예약된 인터페이스, 현재 내장 Agents만 지원 |
| **MCPs** | ✅ 완전히 지원 | `.mcp.json` 및 `~/.claude/.mcp.json`에서 MCP 서버 구성 로드 |
| **Hooks** | ✅ 완전히 지원 | `settings.json`에서 사용자 정의 수명 주기 훅 로드 |
| **Plugins** | ✅ 완전히 지원 | `installed_plugins.json`에서 Marketplace 플러그인 로드 |

---

## 구성 로딩 우선순위

Oh My OpenCode는 여러 위치에서 구성을 로드하는 것을 지원하며, 고정된 우선순위 순서에 따라 병합됩니다. **우선순위가 높은 구성이 우선순위가 낮은 구성을 덮어씁니다**.

### Commands 로딩 우선순위

Commands는 다음 순서로 로드됩니다 (높은 순에서 낮은 순):

1. `.opencode/command/` (프로젝트 레벨, 가장 높은 우선순위)
2. `~/.config/opencode/command/` (사용자 레벨)
3. `.claude/commands/` (프로젝트 레벨 Claude Code 호환)
4. `~/.claude/commands/` (사용자 레벨 Claude Code 호환)

**소스 위치**: `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// 4개의 디렉토리에서 Commands 로드, 우선순위별로 병합
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**예시**: `.opencode/command/refactor.md`와 `~/.claude/commands/refactor.md`에 같은 이름의 명령이 있다면, `.opencode/`의 명령이 적용됩니다.

### Skills 로딩 우선순위

Skills는 다음 순서로 로드됩니다 (높은 순에서 낮은 순):

1. `.opencode/skills/*/SKILL.md` (프로젝트 레벨, 가장 높은 우선순위)
2. `~/.config/opencode/skills/*/SKILL.md` (사용자 레벨)
3. `.claude/skills/*/SKILL.md` (프로젝트 레벨 Claude Code 호환)
4. `~/.claude/skills/*/SKILL.md` (사용자 레벨 Claude Code 호환)

**소스 위치**: `src/features/opencode-skill-loader/loader.ts:206-215`

**예시**: 프로젝트 레벨 Skills가 사용자 레벨 Skills를 덮어써서, 각 프로젝트의 특정 요구사항이 우선하도록 합니다.

### MCPs 로딩 우선순위

MCP 구성은 다음 순서로 로드됩니다 (높은 순에서 낮은 순):

1. `.claude/.mcp.json` (프로젝트 레벨, 가장 높은 우선순위)
2. `.mcp.json` (프로젝트 레벨)
3. `~/.claude/.mcp.json` (사용자 레벨)

**소스 위치**: `src/features/claude-code-mcp-loader/loader.ts:18-27`

**특성**: MCP 구성은 환경 변수 확장(예: `${OPENAI_API_KEY}`)을 지원하며, `env-expander.ts`를 통해 자동으로 해석됩니다.

**소스 위치**: `src/features/claude-code-mcp-loader/env-expander.ts`

### Hooks 로딩 우선순위

Hooks는 `settings.json`의 `hooks` 필드에서 로드되며, 다음 경로를 지원합니다 (우선순위 순):

1. `.claude/settings.local.json` (로컬 구성, 가장 높은 우선순위)
2. `.claude/settings.json` (프로젝트 레벨)
3. `~/.claude/settings.json` (사용자 레벨)

**소스 위치**: `src/hooks/claude-code-hooks/config.ts:46-59`

**특성**: 여러 구성 파일의 Hooks는 서로 덮어쓰지 않고 자동으로 병합됩니다.

---

## 구성 비활성화 스위치

Claude Code의 특정 구성을 로드하고 싶지 않다면, `oh-my-opencode.json`의 `claude_code` 필드를 통해 세밀하게 제어할 수 있습니다.

### 완전히 호환성 비활성화

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### 부분 비활성화

특정 기능만 비활성화할 수도 있습니다:

```jsonc
{
  "claude_code": {
    "mcp": false,         // .mcp.json 파일 비활성화 (내장 MCPs는 유지)
    "commands": false,     // ~/.claude/commands/ 및 .claude/commands/ 비활성화
    "skills": false,       // ~/.claude/skills/ 및 .claude/skills/ 비활성화
    "agents": false,       // ~/.claude/agents/ 비활성화 (내장 Agents는 유지)
    "hooks": false,        // settings.json hooks 비활성화
    "plugins": false       // Claude Code Marketplace 플러그인 비활성화
  }
}
```

**스위치 설명**:

| 스위치 | 비활성화되는 내용 | 유지되는 내용 |
|---|---|---|
| `mcp` | `.mcp.json` 파일 | 내장 MCPs (websearch, context7, grep_app) |
| `commands` | `~/.claude/commands/`, `.claude/commands/` | OpenCode 네이티브 Commands |
| `skills` | `~/.claude/skills/`, `.claude/skills/` | OpenCode 네이티브 Skills |
| `agents` | `~/.claude/agents/` | 내장 Agents (Sisyphus, Oracle, Librarian 등) |
| `hooks` | `settings.json` hooks | Oh My OpenCode 내장 Hooks |
| `plugins` | Claude Code Marketplace 플러그인 | 내장 플러그인 기능 |

### 특정 플러그인 비활성화

`plugins_override`를 사용하여 특정 Claude Code Marketplace 플러그인을 비활성화할 수 있습니다:

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // claude-mem 플러그인 비활성화
    }
  }
}
```

**소스 위치**: `src/config/schema.ts:143`

---

## 데이터 저장 호환성

Oh My OpenCode는 Claude Code의 데이터 저장 형식과 호환되어 세션 및 작업 데이터의 영속성과 마이그레이션을 보장합니다.

### Todos 저장

- **위치**: `~/.claude/todos/`
- **형식**: Claude Code 호환 JSON 형식
- **용도**: 작업 목록 및 할 일 항목 저장

**소스 위치**: `src/features/claude-code-session-state/index.ts`

### Transcripts 저장

- **위치**: `~/.claude/transcripts/`
- **형식**: JSONL (한 줄에 하나의 JSON 객체)
- **용도**: 세션 기록 및 메시지 기록 저장

**소스 위치**: `src/features/claude-code-session-state/index.ts`

**장점**: Claude Code와 동일한 데이터 디렉토리를 공유하여 세션 기록을 직접 마이그레이션할 수 있습니다.

---

## Claude Code Hooks 통합

Claude Code의 `settings.json`에 있는 `hooks` 필드는 특정 이벤트 시점에서 실행되는 사용자 정의 스크립트를 정의합니다. Oh My OpenCode는 이러한 Hooks를 완전히 지원합니다.

### Hook 이벤트 유형

| 이벤트 | 트리거 시점 | 수행 가능한 작업 |
|---|---|---|
| **PreToolUse** | 도구 실행 전 | 도구 호출 차단, 입력 매개변수 수정, 컨텍스트 주입 |
| **PostToolUse** | 도구 실행 후 | 경고 추가, 출력 수정, 메시지 주입 |
| **UserPromptSubmit** | 사용자 프롬프트 제출 시 | 프롬프트 차단, 메시지 주입, 프롬프트 변환 |
| **Stop** | 세션이 유휴 상태일 때 | 후속 프롬프트 주입, 자동화 작업 실행 |

**소스 위치**: `src/hooks/claude-code-hooks/index.ts`

### Hook 구성 예시

다음은 일반적인 Claude Code Hooks 구성입니다:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**필드 설명**:

- **matcher**: 도구 이름 일치 패턴 (`*` 와일드카드 지원)
- **type**: Hook 유형 (`command`, `inject` 등)
- **command**: 실행할 셸 명령어 (`$FILE`과 같은 변수 지원)
- **content**: 주입할 메시지 내용

### Hook 실행 메커니즘

Oh My OpenCode는 `claude-code-hooks` Hook을 통해 이러한 사용자 정의 Hooks를 자동으로 실행합니다. 이 Hook은 모든 이벤트 시점에서 Claude Code의 구성을 확인하고 로드합니다.

**소스 위치**: `src/hooks/claude-code-hooks/index.ts:36-401`

**실행 흐름**:

1. Claude Code의 `settings.json` 로드
2. `hooks` 필드를 구문 분석하고 현재 이벤트와 일치
3. 일치하는 Hooks를 순서대로 실행
4. 반환 결과에 따라 에이전트 동작 수정(차단, 주입, 경고 등)

**예시**: PreToolUse Hook이 `deny`를 반환하면 도구 호출이 차단되고 에이전트는 오류 메시지를 수신합니다.

---

## 일반적인 사용 시나리오

### 시나리오 1: Claude Code 구성 마이그레이션

이미 Claude Code에서 Commands와 Skills를 구성한 경우, OpenCode에서 직접 사용할 수 있습니다:

**단계**:

1. `~/.claude/` 디렉토리가 존재하고 구성이 포함되어 있는지 확인
2. OpenCode를 시작하면 Oh My OpenCode가 자동으로 이러한 구성을 로드
3. 채팅에서 `/`를 입력하여 로드된 Commands 확인
4. Commands 사용하거나 Skills 호출

**확인**: Oh My OpenCode의 시작 로그에서 로드된 구성 수를 확인하세요.

### 시나리오 2: 프로젝트 레벨 구성 재정의

특정 프로젝트에 다른 Skills를 사용하고 싶지만 다른 프로젝트에 영향을 주지 않으려는 경우:

**단계**:

1. 프로젝트 루트에 `.claude/skills/` 디렉토리 생성
2. 프로젝트별 Skill 추가(예: `./.claude/skills/my-skill/SKILL.md`)
3. OpenCode 다시 시작
4. 프로젝트 레벨 Skill이 사용자 레벨 Skill을 자동으로 재정의

**장점**: 각 프로젝트는 독립적인 구성을 가질 수 있어 서로 간섭하지 않습니다.

### 시나리오 3: Claude Code 호환성 비활성화

OpenCode 네이티브 구성만 사용하고 Claude Code의 이전 구성을 로드하고 싶지 않은 경우:

**단계**:

1. `oh-my-opencode.json` 편집
2. 다음 구성 추가:

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. OpenCode 다시 시작

**결과**: 시스템은 모든 Claude Code 구성을 무시하고 OpenCode 네이티브 구성만 사용합니다.

---

## 함정 경고

### ⚠️ 구성 충돌

**문제**: 여러 위치에 같은 이름의 구성이 있는 경우(예: 같은 이름의 Command가 `.opencode/command/`와 `~/.claude/commands/`에 모두 존재), 불확실한 동작이 발생할 수 있습니다.

**해결**: 로딩 우선순위를 이해하고, 가장 높은 우선순위의 구성을 가장 높은 우선순위 디렉토리에 배치하세요.

### ⚠️ MCP 구성 형식 차이

**문제**: Claude Code의 MCP 구성 형식은 OpenCode와 약간 다르므로, 직접 복사하면 작동하지 않을 수 있습니다.

**해결**: Oh My OpenCode가 자동으로 형식을 변환하지만, 공식 문서를 참조하여 구성이 올바른지 확인하는 것이 좋습니다.

**소스 위치**: `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Hooks 성능 영향

**문제**: 너무 많은 Hooks 또는 복잡한 Hook 스크립트는 성능 저하를 일으킬 수 있습니다.

**해결**: Hooks 수를 제한하고, 필수적인 Hooks만 유지하세요. `disabled_hooks`를 통해 특정 Hooks를 비활성화할 수 있습니다.

---

## 강의 요약

Oh My OpenCode는 기존 구성을 원활하게 마이그레이션하고 재사용할 수 있는 완전한 Claude Code 호환 레이어를 제공합니다:

- **구성 로딩 우선순위**: 프로젝트 레벨 > 사용자 레벨 > Claude Code 호환 순으로 구성 로딩
- **호환성 스위치**: `claude_code` 필드를 통해 어떤 기능을 로드할지 정확히 제어
- **데이터 저장 호환성**: `~/.claude/` 디렉토리 공유, 세션 및 작업 데이터 마이그레이션 지원
- **Hooks 통합**: Claude Code의 수명 주기 훅 시스템을 완전히 지원

Claude Code에서 마이그레이션하는 사용자라면, 이 호환성 레이어를 통해 구성 없이 즉시 OpenCode 사용을 시작할 수 있습니다.

---

## 다음 강의 예고

> 다음 강의에서는 **[구성 참조](../configuration-reference/)**를 학습합니다.
>
> 학습할 내용:
> - 완전한 `oh-my-opencode.json` 구성 필드 설명
> - 각 필드의 타입, 기본값 및 제약 조건
> - 일반적인 구성 패턴과 모범 사례

---

## 부록: 소스 참조

<details>
<summary><strong>클릭하여 소스 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능 | 파일 경로 | 라인 |
|---|---|---|
| Claude Code Hooks 메인 진입점 | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Hooks 구성 로딩 | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| MCP 구성 로더 | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Commands 로더 | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Skills 로더 | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Plugins 로더 | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | 전체 |
| 데이터 저장 호환성 | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | 전체 |
| MCP 구성 변환기 | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | 전체 |
| 환경 변수 확장 | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | 전체 |

**핵심 함수**:

- `createClaudeCodeHooksHook()`: Claude Code Hooks 통합 Hook 생성, 모든 이벤트 처리 (PreToolUse, PostToolUse, UserPromptSubmit, Stop)
- `loadClaudeHooksConfig()`: Claude Code의 `settings.json` 구성 로드
- `loadMcpConfigs()`: MCP 서버 구성 로드, 환경 변수 확장 지원
- `loadAllCommands()`: 4개의 디렉토리에서 Commands 로드, 우선순위별로 병합
- `discoverSkills()`: 4개의 디렉토리에서 Skills 로드, Claude Code 호환 경로 지원
- `getClaudeConfigDir()`: Claude Code 구성 디렉토리 경로 가져오기 (플랫폼 관련)

**핵심 상수**:

- 구성 로딩 우선순위: `.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Hook 이벤트 유형: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `PreCompact`

</details>
