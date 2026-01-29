---
title: "구성 참조: 전체 구성 옵션 | oh-my-opencode"
sidebarTitle: "구성 완벽 가이드"
subtitle: "구성 참조: 전체 구성 옵션"
description: "oh-my-opencode의 전체 구성 옵션과 필드 정의를 학습하세요. 에이전트, Categories, Hooks, 백그라운드 작업 등 모든 구성을 다루며 OpenCode 개발 환경을 심층 커스터마이징하고 AI 코딩 워크플로우를 최적화하는 방법을 안내합니다."
tags:
  - "configuration"
  - "reference"
  - "schema"
prerequisite: []
order: 180
---

# 구성 참조: 전체 구성 파일 Schema 설명

이 페이지는 oh-my-opencode 구성 파일의 전체 필드 정의와 설명을 제공합니다.

::: info 구성 파일 위치
- 프로젝트 수준: `.opencode/oh-my-opencode.json`
- 사용자 수준 (macOS/Linux): `~/.config/opencode/oh-my-opencode.json`
- 사용자 수준 (Windows): `%APPDATA%\opencode\oh-my-opencode.json`

프로젝트 수준 구성이 사용자 수준 구성보다 우선합니다.
:::

::: tip 자동 완성 활성화
구성 파일 상단에 `$schema` 필드를 추가하면 IDE 자동 완성을 사용할 수 있습니다:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
}
```
:::

## 루트 수준 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `$schema` | string | 아니오 | - | 자동 완성을 위한 JSON Schema 링크 |
| `disabled_mcps` | string[] | 아니오 | [] | 비활성화된 MCP 목록 |
| `disabled_agents` | string[] | 아니오 | [] | 비활성화된 에이전트 목록 |
| `disabled_skills` | string[] | 아니오 | [] | 비활성화된 스킬 목록 |
| `disabled_hooks` | string[] | 아니오 | [] | 비활성화된 훅 목록 |
| `disabled_commands` | string[] | 아니오 | [] | 비활성화된 명령어 목록 |
| `agents` | object | 아니오 | - | 에이전트 오버라이드 구성 |
| `categories` | object | 아니오 | - | Category 커스텀 구성 |
| `claude_code` | object | 아니오 | - | Claude Code 호환성 구성 |
| `sisyphus_agent` | object | 아니오 | - | Sisyphus 에이전트 구성 |
| `comment_checker` | object | 아니오 | - | 주석 검사기 구성 |
| `experimental` | object | 아니오 | - | 실험적 기능 구성 |
| `auto_update` | boolean | 아니오 | true | 자동 업데이트 확인 |
| `skills` | object\|array | 아니오 | - | Skills 구성 |
| `ralph_loop` | object | 아니오 | - | Ralph Loop 구성 |
| `background_task` | object | 아니오 | - | 백그라운드 작업 동시성 구성 |
| `notification` | object | 아니오 | - | 알림 구성 |
| `git_master` | object | 아니오 | - | Git Master 스킬 구성 |
| `browser_automation_engine` | object | 아니오 | - | 브라우저 자동화 엔진 구성 |
| `tmux` | object | 아니오 | - | Tmux 세션 관리 구성 |

## agents - 에이전트 구성

내장 에이전트 설정을 오버라이드합니다. 각 에이전트는 다음 필드를 지원합니다:

### 일반 에이전트 필드

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `model` | string | 아니오 | 에이전트가 사용하는 모델 오버라이드 (사용 중단됨, category 사용 권장) |
| `variant` | string | 아니오 | 모델 변형 |
| `category` | string | 아니오 | Category에서 모델과 구성 상속 |
| `skills` | string[] | 아니오 | 에이전트 프롬프트에 주입할 스킬 목록 |
| `temperature` | number | 아니오 | 0-2, 무작위성 제어 |
| `top_p` | number | 아니오 | 0-1, 핵 샘플링 파라미터 |
| `prompt` | string | 아니오 | 기본 시스템 프롬프트 완전 오버라이드 |
| `prompt_append` | string | 아니오 | 기본 프롬프트 뒤에 추가 |
| `tools` | object | 아니오 | 도구 권한 오버라이드 (`{toolName: boolean}`) |
| `disable` | boolean | 아니오 | 해당 에이전트 비활성화 |
| `description` | string | 아니오 | 에이전트 설명 |
| `mode` | enum | 아니오 | `subagent` / `primary` / `all` |
| `color` | string | 아니오 | Hex 색상 (예: `#FF0000`) |
| `permission` | object | 아니오 | 에이전트 권한 제한 |

### permission - 에이전트 권한

| 필드 | 타입 | 필수 | 값 | 설명 |
|--- | --- | --- | --- | ---|
| `edit` | string | 아니오 | `ask`/`allow`/`deny` | 파일 편집 권한 |
| `bash` | string/object | 아니오 | `ask`/`allow`/`deny` 또는 명령어별 | Bash 실행 권한 |
| `webfetch` | string | 아니오 | `ask`/`allow`/`deny` | 웹 요청 권한 |
| `doom_loop` | string | 아니오 | `ask`/`allow`/`deny` | 무한 루프 감지 오버라이드 권한 |
| `external_directory` | string | 아니오 | `ask`/`allow`/`deny` | 외부 디렉토리 접근 권한 |

### 구성 가능한 에이전트 목록

| 에이전트명 | 설명 |
|--- | ---|
| `sisyphus` | 메인 오케스트레이터 에이전트 |
| `prometheus` | 전략 기획자 에이전트 |
| `oracle` | 전략 자문 에이전트 |
| `librarian` | 다중 저장소 연구 전문가 에이전트 |
| `explore` | 빠른 코드베이스 탐색 전문가 에이전트 |
| `multimodal-looker` | 미디어 분석 전문가 에이전트 |
| `metis` | 사전 계획 분석 에이전트 |
| `momus` | 계획 검토자 에이전트 |
| `atlas` | 메인 오케스트레이터 에이전트 |
| `sisyphus-junior` | 카테고리 생성된 작업 실행자 에이전트 |

### 구성 예시

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": ["git-master"]
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    },
    "multimodal-looker": {
      "disable": true
    }
  }
}
```

## categories - Category 구성

Categories(모델 추상화)를 정의하여 동적 에이전트 조합에 사용합니다.

### Category 필드

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `description` | string | 아니오 | Category의 목적 설명 (delegate_task 프롬프트에 표시) |
| `model` | string | 아니오 | Category가 사용하는 모델 오버라이드 |
| `variant` | string | 아니오 | 모델 변형 |
| `temperature` | number | 아니오 | 0-2, 온도 |
| `top_p` | number | 아니오 | 0-1, 핵 샘플링 |
| `maxTokens` | number | 아니오 | 최대 토큰 수 |
| `thinking` | object | 아니오 | Thinking 구성 `{type, budgetTokens}` |
| `reasoningEffort` | enum | 아니오 | `low` / `medium` / `high` / `xhigh` |
| `textVerbosity` | enum | 아니오 | `low` / `medium` / `high` |
| `tools` | object | 아니오 | 도구 권한 |
| `prompt_append` | string | 아니오 | 프롬프트 추가 |
| `is_unstable_agent` | boolean | 아니오 | 불안정한 에이전트로 표시 (백그라운드 모드 강제) |

### thinking 구성

| 필드 | 타입 | 필수 | 값 | 설명 |
|--- | --- | --- | --- | ---|
| `type` | string | 예 | `enabled`/`disabled` | Thinking 활성화 여부 |
| `budgetTokens` | number | 아니오 | - | Thinking budget 토큰 수 |

### 내장 Categories

| Category | 기본 모델 | Temperature | 설명 |
|--- | --- | --- | ---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | 프론트엔드, UI/UX, 디자인 작업 |
| `ultrabrain` | `openai/gpt-5.2-codex` | 0.1 | 고지능 추론 작업 |
| `artistry` | `google/gemini-3-pro` | 0.7 | 창의적 및 예술 작업 |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | 빠르고 저비용 작업 |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | 지정되지 않은 유형의 중간 작업 |
| `unspecified-high` | `anthropic/claude-opus-4-5` | 0.1 | 지정되지 않은 유형의 고품질 작업 |
| `writing` | `google/gemini-3-flash` | 0.1 | 문서화 및 작문 작업 |

### 구성 예시

```jsonc
{
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Data analysis and ML tasks"
    }
  }
}
```

## claude_code - Claude Code 호환 구성

Claude Code 호환성 계층의 각 기능을 제어합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `mcp` | boolean | 아니오 | - | `.mcp.json` 파일 로드 여부 |
| `commands` | boolean | 아니오 | - | Commands 로드 여부 |
| `skills` | boolean | 아니오 | - | Skills 로드 여부 |
| `agents` | boolean | 아니오 | - | Agents 로드 여부 (예약) |
| `hooks` | boolean | 아니오 | - | settings.json hooks 로드 여부 |
| `plugins` | boolean | 아니오 | - | Marketplace 플러그인 로드 여부 |
| `plugins_override` | object | 아니오 | - | 특정 플러그인 비활성화 (`{pluginName: boolean}`) |

### 구성 예시

```jsonc
{
  "claude_code": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "hooks": false,
    "plugins": true,
    "plugins_override": {
      "some-plugin": false
    }
  }
}
```

## sisyphus_agent - Sisyphus 에이전트 구성

Sisyphus 오케스트레이션 시스템의 동작을 제어합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `disabled` | boolean | 아니오 | false | Sisyphus 오케스트레이션 시스템 비활성화 |
| `default_builder_enabled` | boolean | 아니오 | false | OpenCode-Builder 에이전트 활성화 |
| `planner_enabled` | boolean | 아니오 | true | Prometheus(Planner) 에이전트 활성화 |
| `replace_plan` | boolean | 아니오 | true | 기본 plan 에이전트를 subagent로 강등 |

### 구성 예시

```jsonc
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

## background_task - 백그라운드 작업 구성

백그라운드 에이전트 관리 시스템의 동시성 동작을 제어합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `defaultConcurrency` | number | 아니오 | - | 기본 최대 동시성 수 |
| `providerConcurrency` | object | 아니오 | - | Provider 수준 동시성 제한 (`{providerName: number}`) |
| `modelConcurrency` | object | 아니오 | - | Model 수준 동시성 제한 (`{modelName: number}`) |
| `staleTimeoutMs` | number | 아니오 | 180000 | 타임아웃 시간(밀리초), 최소 60000 |

### 우선순위 순서

`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### 구성 예시

```jsonc
{
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,
      "google/gemini-3-flash": 10
    },
    "staleTimeoutMs": 180000
  }
}
```

## git_master - Git Master 스킬 구성

Git Master 스킬의 동작을 제어합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `commit_footer` | boolean | 아니오 | true | 커밋 메시지에 "Ultraworked with Sisyphus" footer 추가 |
| `include_co_authored_by` | boolean | 아니오 | true | 커밋 메시지에 "Co-authored-by: Sisyphus" trailer 추가 |

### 구성 예시

```jsonc
{
  "git_master": {
    "commit_footer": true,
    "include_co_authored_by": true
  }
}
```

## browser_automation_engine - 브라우저 자동화 구성

브라우저 자동화 공급자를 선택합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `provider` | enum | 아니오 | `playwright` | 브라우저 자동화 공급자 |

### provider 선택 가능한 값

| 값 | 설명 | 설치 요구사항 |
|--- | --- | ---|
| `playwright` | Playwright MCP 서버 사용 | 자동 설치 |
| `agent-browser` | Vercel의 agent CLI 사용 | `bun add -g agent-browser` |

### 구성 예시

```jsonc
{
  "browser_automation_engine": {
    "provider": "playwright"
  }
}
```

## tmux - Tmux 세션 구성

Tmux 세션 관리 동작을 제어합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 아니오 | false | Tmux 세션 관리 활성화 여부 |
| `layout` | enum | 아니오 | `main-vertical` | Tmux 레이아웃 |
| `main_pane_size` | number | 아니오 | 60 | 메인 패인 크기 (20-80) |
| `main_pane_min_width` | number | 아니오 | 120 | 메인 패인 최소 너비 |
| `agent_pane_min_width` | number | 아니오 | 40 | 에이전트 패인 최소 너비 |

### layout 선택 가능한 값

| 값 | 설명 |
|--- | ---|
| `main-horizontal` | 메인 패인이 상단에 있고 에이전트 패인이 하단에 스택 |
| `main-vertical` | 메인 패인이 좌측에 있고 에이전트 패인이 우측에 스택 (기본값) |
| `tiled` | 모든 패인이 동일한 크기의 그리드 |
| `even-horizontal` | 모든 패인이 수평으로 배열 |
| `even-vertical` | 모든 패인이 수직으로 스택 |

### 구성 예시

```jsonc
{
  "tmux": {
    "enabled": false,
    "layout": "main-vertical",
    "main_pane_size": 60,
    "main_pane_min_width": 120,
    "agent_pane_min_width": 40
  }
}
```

## ralph_loop - Ralph Loop 구성

Ralph Loop 반복 워크플로우의 동작을 제어합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 아니오 | false | Ralph Loop 기능 활성화 여부 |
| `default_max_iterations` | number | 아니오 | 100 | 기본 최대 반복 횟수 (1-1000) |
| `state_dir` | string | 아니오 | - | 커스텀 상태 파일 디렉토리 (프로젝트 루트 디렉토리 기준) |

### 구성 예시

```jsonc
{
  "ralph_loop": {
    "enabled": false,
    "default_max_iterations": 100,
    "state_dir": ".opencode/"
  }
}
```

## notification - 알림 구성

시스템 알림 동작을 제어합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `force_enable` | boolean | 아니오 | false | 외부 알림 플러그인이 감지되어도 session-notification 강제 활성화 |

### 구성 예시

```jsonc
{
  "notification": {
    "force_enable": false
  }
}
```

## comment_checker - 주석 검사기 구성

주석 검사기 동작을 제어합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `custom_prompt` | string | 아니오 | - | 커스텀 프롬프트, 기본 경고 메시지 대체. `{{comments}}` 플레이스홀더를 사용하여 감지된 주석 XML 표시 |

### 구성 예시

```jsonc
{
  "comment_checker": {
    "custom_prompt": "Please review these redundant comments: {{comments}}"
  }
}
```

## experimental - 실험적 기능 구성

실험적 기능의 활성화를 제어합니다.

### 필드

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `aggressive_truncation` | boolean | 아니오 | - | 더 공격적인 자르기 동작 활성화 |
| `auto_resume` | boolean | 아니오 | - | 자동 복구 활성화 (생각 블록 오류 또는 생각 비활성화 위반에서 복구) |
| `truncate_all_tool_outputs` | boolean | 아니오 | false | 화이트리스트 도구뿐만 아니라 모든 도구 출력 자르기 |
| `dynamic_context_pruning` | object | 아니오 | - | 동적 컨텍스트 프루닝 구성 |

### dynamic_context_pruning 구성

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 아니오 | false | 동적 컨텍스트 프루닝 활성화 |
| `notification` | enum | 아니오 | `detailed` | 알림 수준: `off` / `minimal` / `detailed` |
| `turn_protection` | object | 아니오 | - | Turn 보호 구성 |
| `protected_tools` | string[] | 아니오 | - | 절대 프루닝하지 않는 도구 목록 |
| `strategies` | object | 아니오 | - | 프루닝 전략 구성 |

### turn_protection 구성

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 아니오 | true | Turn 보호 활성화 |
| `turns` | number | 아니오 | 3 | 최근 N 턴의 도구 출력 보호 (1-10) |

### strategies 구성

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `deduplication` | object | 아니오 | - | 중복 제거 전략 구성 |
| `supersede_writes` | object | 아니오 | - | 쓰기 덮어쓰기 전략 구성 |
| `purge_errors` | object | 아니오 | - | 오류 제거 전략 구성 |

### deduplication 구성

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 아니오 | true | 중복 도구 호출 제거 (동일 도구 + 동일 매개변수) |

### supersede_writes 구성

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 아니오 | true | 후속 읽기 시 쓰기 입력 프루닝 |
| `aggressive` | boolean | 아니오 | false | 공격 모드: 모든 후속 읽기가 있으면 모든 쓰기 프루닝 |

### purge_errors 구성

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 아니오 | true | N 턴 후 오류 도구 입력 프루닝 |
| `turns` | number | 아니오 | 5 | 오류 도구 입력 프루닝 턴 수 (1-20) |

### 구성 예시

```jsonc
{
  "experimental": {
    "aggressive_truncation": true,
    "auto_resume": true,
    "truncate_all_tool_outputs": false,
    "dynamic_context_pruning": {
      "enabled": false,
      "notification": "detailed",
      "turn_protection": {
        "enabled": true,
        "turns": 3
      },
      "protected_tools": [
        "task",
        "todowrite",
        "todoread",
        "lsp_rename",
        "session_read",
        "session_write",
        "session_search"
      ],
      "strategies": {
        "deduplication": {
          "enabled": true
        },
        "supersede_writes": {
          "enabled": true,
          "aggressive": false
        },
        "purge_errors": {
          "enabled": true,
          "turns": 5
        }
      }
    }
  }
}
```

## skills - Skills 구성

Skills(전문 기술)의 로드와 동작을 구성합니다.

### 구성 형식

Skills는 두 가지 형식을 지원합니다:

**형식 1: 단순 배열**

```jsonc
{
  "skills": ["skill1", "skill2", "skill3"]
}
```

**형식 2: 객체 구성**

```jsonc
{
  "skills": {
    "sources": [
      "path/to/skills",
      {
        "path": "another/path",
        "recursive": true,
        "glob": "*.md"
      }
    ],
    "enable": ["skill1", "skill2"],
    "disable": ["skill3"]
  }
}
```

### Skill 정의 필드

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `description` | string | 아니오 | Skill 설명 |
| `template` | string | 아니오 | Skill 템플릿 |
| `from` | string | 아니오 | 소스 |
| `model` | string | 아니오 | 사용하는 모델 |
| `agent` | string | 아니오 | 사용하는 에이전트 |
| `subtask` | boolean | 아니오 | 하위 작업 여부 |
| `argument-hint` | string | 아니오 | 매개변수 힌트 |
| `license` | string | 아니오 | 라이선스 |
| `compatibility` | string | 아니오 | 호환성 |
| `metadata` | object | 아니오 | 메타데이터 |
| `allowed-tools` | string[] | 아니오 | 허용된 도구 목록 |
| `disable` | boolean | 아니오 | 해당 Skill 비활성화 |

### 내장 Skills

| Skill | 설명 |
|--- | ---|
| `playwright` | 브라우저 자동화 (기본값) |
| `agent-browser` | 브라우저 자동화 (Vercel CLI) |
| `frontend-ui-ux` | 프론트엔드 UI/UX 디자인 |
| `git-master` | Git 전문가 |

## 비활성화 목록

다음 필드는 특정 기능 모듈을 비활성화하는 데 사용됩니다.

### disabled_mcps - 비활성화된 MCP 목록

```jsonc
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

### disabled_agents - 비활성화된 에이전트 목록

```jsonc
{
  "disabled_agents": ["oracle", "multimodal-looker"]
}
```

### disabled_skills - 비활성화된 스킬 목록

```jsonc
{
  "disabled_skills": ["playwright"]
}
```

### disabled_hooks - 비활성화된 훅 목록

```jsonc
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

### disabled_commands - 비활성화된 명령어 목록

```jsonc
{
  "disabled_commands": ["init-deep", "start-work"]
}
```

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 구성 Schema 정의 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-378 |
| JSON Schema | [`assets/oh-my-opencode.schema.json`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/assets/oh-my-opencode.schema.json) | 1-51200 |
| 구성 문서 | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/docs/configurations.md) | 1-595 |

**주요 타입**:
- `OhMyOpenCodeConfig`: 메인 구성 타입
- `AgentOverrideConfig`: 에이전트 오버라이드 구성 타입
- `CategoryConfig`: Category 구성 타입
- `BackgroundTaskConfig`: 백그라운드 작업 구성 타입
- `PermissionValue`: 권한 값 타입 (`ask`/`allow`/`deny`)

**주요 열거형**:
- `BuiltinAgentNameSchema`: 내장 에이전트 이름 열거형
- `BuiltinSkillNameSchema`: 내장 스킬 이름 열거형
- `BuiltinCategoryNameSchema`: 내장 Category 이름 열거형
- `HookNameSchema`: 훅 이름 열거형
- `BrowserAutomationProviderSchema`: 브라우저 자동화 공급자 열거형

---

## 다음 강의 예고

> 다음 강의에서는 **[내장 MCP 서버](../builtin-mcps/)**를 학습합니다.
>
> 다음 내용을 학습하게 됩니다:
> - 3개 내장 MCP 서버의 기능과 사용 방법
> - Exa Websearch, Context7, grep.app의 구성과 모범 사례
> - MCP를 사용하여 문서와 코드를 검색하는 방법

</details>