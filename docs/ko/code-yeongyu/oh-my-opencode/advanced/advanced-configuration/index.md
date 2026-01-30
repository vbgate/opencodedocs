---
title: "심층 구성: 에이전트와 권한 | oh-my-opencode"
sidebarTitle: "에이전트 동작 제어"
subtitle: "심층 구성: 에이전트와 권한 | oh-my-opencode"
description: "oh-my-opencode의 에이전트 구성, 권한 설정, 모델 재정의 및 프롬프트 수정 방법을 학습하세요. 심층 맞춤화를 통해 귀하에게 가장 적합한 AI 개발 팀을 구축하고 각 에이전트의 동작과 능력을 정밀하게 제어하세요."
tags:
  - "configuration"
  - "agents"
  - "permissions"
  - "customization"
prerequisite:
  - "start-installation"
  - "platforms-provider-setup"
order: 140
---

# 구성 심층 맞춤화: 에이전트와 권한 관리

## 이 레슨을 완료하면 할 수 있는 것

- 각 에이전트에서 사용하는 모델과 매개변수를 맞춤 설정
- 에이전트의 권한(파일 편집, Bash 실행, 웹 요청 등)을 정밀하게 제어
- `prompt_append`를 통해 에이전트에 추가 명령어 추가
- 맞춤 Category를 생성하여 동적 에이전트 조합 구현
- 특정 에이전트, Skill, Hook 및 MCP를 활성화/비활성화

## 현재 겪고 계신 문제

**기본 구성은 잘 작동하지만 귀하의 요구에 완벽하게 부합하지 않습니다:**
- Oracle에서 사용하는 GPT 5.2가 너무 비싸서 더 저렴한 모델로 변경하고 싶음
- Explore 에이전트에 파일 쓰기 권한이 없어야 하며 검색만 허용하고 싶음
- Librarian이 공식 문서를 우선 검색하도록 하고 싶음
- 특정 Hook이 항상 잘못된 경고를 표시해서 일시적으로 비활성화하고 싶음

**필요한 것은 "심층 맞춤화"입니다** - "그냥 작동하는 것"이 아니라 "정확히 필요한 만큼" 작동하는 것입니다.

---

## 🎒 시작 전 준비

::: warning 전제 조건
이 튜토리얼은 [설치 구성](../../start/installation/)과 [Provider 설정](../../platforms/provider-setup/)을 완료했다고 가정합니다.
:::

**알아야 할 것**:
- 구성 파일 위치: `~/.config/opencode/oh-my-opencode.json`(사용자 레벨) 또는 `.opencode/oh-my-opencode.json`(프로젝트 레벨)
- 사용자 레벨 구성이 프로젝트 레벨 구성보다 우선함

---

## 핵심 아이디어

**구성 우선순위**: 사용자 레벨 구성 > 프로젝트 레벨 구성 > 기본 구성

```
~/.config/opencode/oh-my-opencode.json (최우선 순위)
    ↓ 덮어쓰기
.opencode/oh-my-opencode.json (프로젝트 레벨)
    ↓ 덮어쓰기
oh-my-opencode 내장 기본값 (최저 우선 순위)
```

**구성 파일은 JSONC를 지원합니다**:
- `//`로 주석 추가 가능
- `/* */`로 블록 주석 추가 가능
- 뒤따르는 콤마 허용

---

## 따라해 보세요

### 1단계: 구성 파일 찾기 및 Schema 자동 완성 활성화

**이유**
JSON Schema를 활성화하면 편집기에서 사용 가능한 모든 필드와 유형을 자동으로 제안하여 구성 오류를 방지할 수 있습니다.

**작업**:

```jsonc
{
  // 자동 완성을 활성화하려면 이 줄 추가
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  
  // 귀하의 구성...
}
```

**확인해야 할 것**:
- VS Code / JetBrains 등 편집기에서 `{`를 입력하면 사용 가능한 모든 필드가 자동으로 표시됨
- 필드 위에 마우스를 올리면 설명과 유형이 표시됨

---

### 2단계: 에이전트 모델 맞춤 설정

**이유**
다른 작업에는 다른 모델이 필요합니다:
- **아키텍처 설계**: 가장 강력한 모델 사용(Claude Opus 4.5)
- **빠른 탐색**: 가장 빠른 모델 사용(Grok Code)
- **UI 설계**: 시각적 모델 사용(Gemini 3 Pro)
- **비용 제어**: 단순 작업에는 저렴한 모델 사용

**작업**:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle: 전략 고문, GPT 5.2 사용
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1  // 낮은 온도, 더 결정적
    },

    // Explore: 빠른 탐색, 무료 모델 사용
    "explore": {
      "model": "opencode/gpt-5-nano",  // 무료
      "temperature": 0.3
    },

    // Librarian: 문서 검색, 큰 컨텍스트 모델 사용
    "librarian": {
      "model": "anthropic/claude-sonnet-4-5"
    },

    // 멀티모달 Looker: 미디어 분석, Gemini 사용
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

**확인해야 할 것**:
- 각 에이전트가 작업 특성에 맞게 최적화된 다른 모델 사용
- 구성을 저장한 후 해당 에이전트를 다시 호출하면 새 모델이 사용됨

---

### 3단계: 에이전트 권한 구성

**이유**
일부 에이전트에는 **모든 권한이 없어야 합니다**:
- Oracle(전략 고문): 읽기 전용, 파일 쓰기 불필요
- Librarian(연구 전문가): 읽기 전용, Bash 실행 불필요
- Explore(탐색): 읽기 전용, 웹 요청 불필요

**작업**:

```jsonc
{
  "agents": {
    "explore": {
      // 파일 쓰기 및 Bash 실행 금지, 웹 검색만 허용
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"
      }
    },

    "librarian": {
      // 읽기 전용 권한
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // 문서 검색 필요
      }
    },

    "oracle": {
      // 읽기 전용 권한
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // 자료 검색 필요
      }
    },

    // Sisyphus: 주 오케스트레이터, 모든 작업 실행 가능
    "sisyphus": {
      "permission": {
        "edit": "allow",
        "bash": "allow",
        "webfetch": "allow"
      }
    }
  }
}
```

**권한 설명**:

| 권한           | 값            | 설명                                               |
|--- | --- | ---|
| `edit`         | `ask/allow/deny` | 파일 편집 권한                                    |
| `bash`         | `ask/allow/deny` 또는 객체 | Bash 실행 권한(구체적 명령어로 세분화 가능)             |
| `webfetch`     | `ask/allow/deny` | 웹 요청 권한                                  |
| `doom_loop`    | `ask/allow/deny` | 에이전트가 무한 루프 감지를 재정의할 수 있도록 허용                   |
| `external_directory` | `ask/allow/deny` | 프로젝트 외부 디렉터리 액세스 권한                         |

**Bash 권한 세분화**:

```jsonc
{
  "agents": {
    "explore": {
      "permission": {
        "bash": {
          "git": "allow",      // git 명령 실행 허용
          "grep": "allow",     // grep 실행 허용
          "rm": "deny",       // 파일 삭제 금지
          "mv": "deny"        // 파일 이동 금지
        }
      }
    }
  }
}
```

**확인해야 할 것**:
- 권한을 구성하면 에이전트가 비활성화된 작업을 시도할 때 자동으로 거부됨
- OpenCode에서 권한 거부 알림이 표시됨

---

### 4단계: prompt_append로 추가 명령어 사용

**이유**
기본 시스템 프롬프트는 이미 잘 작동하지만 **특별한 요구사항**이 있을 수 있습니다:
- Librarian이 특정 문서를 우선 검색하도록 설정
- Oracle이 특정 아키텍처 패턴을 따르도록 설정
- Explore가 특정 검색 키워드를 사용하도록 설정

**작업**:

```jsonc
{
  "agents": {
    "librarian": {
      // 기본 시스템 프롬프트 뒤에 추가, 덮어쓰지 않음
      "prompt_append": "Always use elisp-dev-mcp for Emacs Lisp documentation lookups. " +
                      "When searching for docs, prioritize official documentation over blog posts."
    },

    "oracle": {
      "prompt_append": "Follow SOLID principles and Clean Architecture patterns. " +
                    "Always suggest TypeScript types for all function signatures."
    },

    "explore": {
      "prompt_append": "When searching code, prioritize recent commits and actively maintained files. " +
                    "Ignore test files unless explicitly asked."
    }
  }
}
```

**확인해야 할 것**:
- 에이전트의 동작이 변경되지만 기존 능력은 유지됨
- 예를 들어 Oracle이 항상 TypeScript 유형을 제안하도록 설정

---

### 5단계: Category 구성 맞춤 설정

**이유**
Category는 v3.0의 새로운 기능으로 **동적 에이전트 조합**을 구현합니다:
- 특정 작업 유형에 대한 모델과 매개변수를 미리 설정
- `delegate_task(category="...")`를 통해 빠르게 호출
- "수동으로 모델 선택+프롬프트 작성"보다 효율적

**작업**:

```jsonc
{
  "categories": {
    // 맞춤: 데이터 과학 작업
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "prompt_append": "Focus on data analysis, ML pipelines, and statistical methods. " +
                     "Use pandas/numpy for Python and dplyr/tidyr for R."
    },

    // 기본값 재정의: UI 작업은 맞춤 프롬프트 사용
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "prompt_append": "Use shadcn/ui components and Tailwind CSS. " +
                     "Ensure responsive design and accessibility."
    },

    // 기본값 재정의: 빠른 작업
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1,
      "prompt_append": "Be concise. Focus on simple fixes and quick searches."
    }
  }
}
```

**Category 구성 필드**:

| 필드              | 설명                         | 예시                              |
|--- | --- | ---|
| `model`           | 사용하는 모델                   | `"anthropic/claude-sonnet-4-5"`    |
| `temperature`     | 온도(0-2)                 | `0.2` (결정적) / `0.8` (창의적)    |
| `top_p`           | 핵 샘플링(0-1)               | `0.9`                              |
| `maxTokens`       | 최대 토큰 수               | `4000`                             |
| `thinking`        | Thinking 구성               | `{"type": "enabled", "budgetTokens": 16000}` |
| `prompt_append`    | 프롬프트 추가                   | `"Use X for Y"`                    |
| `tools`           | 도구 권한                   | `{"bash": false}`                    |
| `is_unstable_agent` | 불안정(강제 백그라운드 모드)로 표시 | `true`                              |

**Category 사용**:

```
// OpenCode에서
delegate_task(category="data-science", prompt="이 데이터셋을 분석하고 시각화를 생성하세요")
delegate_task(category="visual-engineering", prompt="반응형 대시보드 컴포넌트를 생성하세요")
delegate_task(category="quick", prompt="이 함수의 정의를 검색하세요")
```

**확인해야 할 것**:
- 다른 유형의 작업이 자동으로 가장 적합한 모델과 구성 사용
- 매번 수동으로 모델과 매개변수를 지정할 필요 없음

---

### 6단계: 특정 기능 비활성화

**이유**
일부 기능은 귀하의 워크플로우에 적합하지 않을 수 있습니다:
- `comment-checker`: 귀하의 프로젝트는 상세한 주석을 허용
- `agent-usage-reminder`: 언제 어떤 에이전트를 사용할지 알고 있음
- 특정 MCP: 필요하지 않음

**작업**:

```jsonc
{
  // 특정 Hooks 비활성화
  "disabled_hooks": [
    "comment-checker",           // 주석 검사 안 함
    "agent-usage-reminder",       // 에이전트 사용 제안 표시 안 함
    "startup-toast"               // 시작 알림 표시 안 함
  ],

  // 특정 Skills 비활성화
  "disabled_skills": [
    "playwright",                // Playwright 사용 안 함
    "frontend-ui-ux"            // 내장 frontend Skill 사용 안 함
  ],

  // 특정 MCPs 비활성화
  "disabled_mcps": [
    "websearch",                // Exa 검색 사용 안 함
    "context7",                // Context7 사용 안 함
    "grep_app"                 // grep.app 사용 안 함
  ],

  // 특정 에이전트 비활성화
  "disabled_agents": [
    "multimodal-looker",        // 멀티모달 Looker 사용 안 함
    "metis"                   // Metis 사전 계획 분석 사용 안 함
  ]
}
```

**사용 가능한 Hooks 목록**(일부):

| Hook 이름                | 기능                           |
|--- | ---|
| `todo-continuation-enforcer` | TODO 목록 완료 강제              |
| `comment-checker`          | 중복 주석 감지                  |
| `tool-output-truncator`     | 컨텍스트 절약을 위해 도구 출력 자르기        |
| `keyword-detector`         | ultrawork 등 키워드 감지          |
| `agent-usage-reminder`     | 사용해야 할 에이전트 표시           |
| `session-notification`      | 세션 종료 알림                  |
| `background-notification`    | 백그라운드 작업 완료 알림              |

**확인해야 할 것**:
- 비활성화된 기능은 더 이상 실행되지 않음
- 다시 활성화하면 기능이 복원됨

---

### 7단계: 백그라운드 작업 동시성 제어 구성

**이유**
병렬 백그라운드 작업은 **동시성 수를 제어**해야 합니다:
- API 속도 제한 방지
- 비용 제어(비싼 모델은 너무 많은 동시성 불가능)
- Provider 할당량 준수

**작업**:

```jsonc
{
  "background_task": {
    // 기본 최대 동시성 수
    "defaultConcurrency": 5,

    // Provider 레벨 동시성 제한
    "providerConcurrency": {
      "anthropic": 3,      // Anthropic API 최대 3개 동시
      "openai": 5,         // OpenAI API 최대 5개 동시
      "google": 10          // Gemini API 최대 10개 동시
    },

    // Model 레벨 동시성 제한(최우선 순위)
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,     // Opus는 너무 비싸서 2개 동시로 제한
      "google/gemini-3-flash": 10,          // Flash는 저렴해서 10개 동시 허용
      "anthropic/claude-haiku-4-5": 15      // Haiku는 더 저렴해서 15개 동시 허용
    }
  }
}
```

**우선순위 순서**:
```
modelConcurrency > providerConcurrency > defaultConcurrency
```

**확인해야 할 것**:
- 동시성 제한을 초과하는 백그라운드 작업은 대기열에서 대기
- 비싼 모델의 동시성이 제한되어 비용 절감

---

### 8단계: 실험적 기능 활성화

**이유**
실험적 기능은 **추가 능력**을 제공하지만 불안정할 수 있습니다:
- `aggressive_truncation`: 더 공격적인 컨텍스트 자르기
- `auto_resume`: 충돌에서 자동 복구
- `truncate_all_tool_outputs`: 모든 도구 출력 자르기

::: danger 경고
실험적 기능은 향후 버전에서 제거되거나 동작이 변경될 수 있습니다. 활성화하기 전에 충분히 테스트하세요.
:::

**작업**:

```jsonc
{
  "experimental": {
    // 더 공격적인 도구 출력 자르기 활성화
    "aggressive_truncation": true,

    // thinking block 오류에서 자동 복구
    "auto_resume": true,

    // 모든 도구 출력 자르기(Grep/Glob/LSP/AST-Grep만 아님)
    "truncate_all_tool_outputs": false
  }
}
```

**확인해야 할 것**:
- 공격적 모드에서 도구 출력이 더 엄격하게 잘려 컨텍스트 절약
- `auto_resume`를 활성화하면 에이전트가 오류를 만나면 자동으로 복구하여 계속 작업

---

## 체크포인트 ✅

**구성이 적용되었는지 확인**:

```bash
# 진단 명령 실행
bunx oh-my-opencode doctor --verbose
```

**확인해야 할 것**:
- 각 에이전트의 모델 해석 결과
- 귀하의 구성 재정의가 적용되었는지 여부
- 비활성화된 기능이 올바르게 식별되었는지 여부

---

## 주의 사항

### 1. 구성 파일 형식 오류

**문제**:
- JSON 구문 오류(콤마 누락, 콤마 중복)
- 필드명 오타(`temperature`를 `temparature`로 작성)

**해결**:
```bash
# JSON 형식 확인
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

### 2. 권한 구성이 너무 엄격함

**문제**:
- 일부 에이전트가 완전히 비활성화됨(`edit: "deny"`, `bash: "deny"`)
- 에이전트가 정상 작업을 완료할 수 없음

**해결**:
- 읽기 전용 에이전트(Oracle, Librarian)는 `edit`와 `bash`를 비활성화 가능
- 주 오케스트레이터(Sisyphus)는 전체 권한 필요

### 3. Category 구성이 적용되지 않음

**문제**:
- Category 이름 오타(`visual-engineering`를 `visual-engineering`로 작성)
- `delegate_task`에 `category` 매개변수가 지정되지 않음

**해결**:
- `delegate_task(category="...")`의 이름이 구성과 일치하는지 확인
- `doctor --verbose`로 Category 해석 결과 확인

### 4. 동시성 제한이 너무 낮음

**문제**:
- `modelConcurrency`가 너무 낮게 설정됨(예: `1`)
- 백그라운드 작업이 거의 직렬로 실행되어 병렬 이점을 잃음

**해결**:
- 예산과 API 할당량에 따라 합리적으로 설정
- 비싼 모델(Opus)은 2-3으로 제한, 저렴한 모델(Haiku)은 10+ 허용

---

## 이 레슨 요약

**구성 심층 맞춤화 = 정밀 제어**:

| 구성항목           | 용도                          | 일반적인 사용 사롘                         |
|--- | --- | ---|
| `agents.model`    | 에이전트 모델 재정의                  | 비용 최적화, 작업 적합성             |
| `agents.permission` | 에이전트 권한 제어                | 보안 격리, 읽기 전용 모드           |
| `agents.prompt_append` | 추가 명령어 추가                | 아키텍처 규정 준수, 검색 전략 최적화 |
| `categories`      | 동적 에이전트 조합                  | 특정 유형 작업 빠른 호출           |
| `background_task` | 동시성 제어                     | 비용 제어, API 할당량           |
| `disabled_*`      | 특정 기능 비활성화                 | 자주 사용하지 않는 기능 제거               |

**기억하세요**:
- 사용자 레벨 구성(`~/.config/opencode/oh-my-opencode.json`)이 프로젝트 레벨보다 우선함
- JSONC를 사용하여 구성을 더 읽기 쉽게 만드세요
- `oh-my-opencode doctor --verbose`를 실행하여 구성을 확인하세요

---

## 다음 레슨 미리보기

> 다음 레슨에서는 **[구성 진단 및 문제 해결](../../faq/troubleshooting/)**을 학습합니다.
>
> 배우게 될 내용:
> - doctor 명령을 사용한 상태 확인
> - OpenCode 버전, 플러그인 등록, Provider 구성 등 문제 진단
> - 모델 해석 메커니즘 및 Categories 구성 이해
> - JSON 출력을 사용한 자동화 진단

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능                | 파일 경로                                                                 | 행 번호    |
|--- | --- | ---|
| 구성 Schema 정의    | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378   |
| AgentOverrideConfig | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 98-119   |
| CategoryConfig      | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172  |
| AgentPermissionSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 11-17    |
| OhMyOpenCodeConfigSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 329-350  |
| 구성 문서          | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 1-595   |

**핵심 상수**:
- `PermissionValue = z.enum(["ask", "allow", "deny"])`: 권한 값 열거형

**핵심 유형**:
- `AgentOverrideConfig`: 에이전트 재정의 구성(모델, 온도, 프롬프트 등)
- `CategoryConfig`: Category 구성(모델, 온도, 프롬프트 등)
- `AgentPermissionSchema`: 에이전트 권한 구성(edit, bash, webfetch 등)
- `BackgroundTaskConfig`: 백그라운드 작업 동시성 구성

**내장 에이전트 열거형**(`BuiltinAgentNameSchema`):
- `sisyphus`, `prometheus`, `oracle`, `librarian`, `explore`, `multimodal-looker`, `metis`, `momus`, `atlas`

**내장 Skill 열거형**(`BuiltinSkillNameSchema`):
- `playwright`, `agent-browser`, `frontend-ui-ux`, `git-master`

**내장 Category 열거형**(`BuiltinCategoryNameSchema`):
- `visual-engineering`, `ultrabrain`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`

</details>
