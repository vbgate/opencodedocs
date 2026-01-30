---
title: "FAQ: Ultrawork 모드 | oh-my-opencode"
subtitle: "자주 묻는 질문"
sidebarTitle: "문제 발생 시 대처법"
description: "oh-my-opencode의 자주 묻는 질문을 학습하세요. Ultrawork 모드, 다중 에이전트 협업, 백그라운드 작업, Ralph Loop 및 설정 문제 해결을 다룹니다."
tags:
  - "faq"
  - "troubleshooting"
  - "설치"
  - "설정"
order: 160
---

# 자주 묻는 질문

## 학습 완료 후 할 수 있는 것

이 FAQ를 읽은 후에는:

- 설치 및 설정 문제에 대한 빠른 해결책 찾기
- Ultrawork 모드의 올바른 사용법 이해
- 에이전트 호출의 모범 사례 습득
- Claude Code 호환성의 경계와 제한 이해
- 일반적인 보안 및 성능 함정 피하기

---

## 설치 및 설정

### oh-my-opencode를 어떻게 설치하나요?

**가장 쉬운 방법**: AI 에이전트에게 설치를 요청하세요.

다음 프롬프트를 LLM 에이전트(Claude Code, AmpCode, Cursor 등)에게 전송하세요:

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**수동 설치**: [설치 가이드](../start/installation/)를 참조하세요.

::: tip 왜 AI 에이전트 설치를 추천하나요?
사람은 JSONC 형식을 설정할 때 실수하기 쉽습니다(따옴표 누락, 콜론 위치 오류 등). AI 에이전트에게 처리하도록 하면 일반적인 구문 오류를 피할 수 있습니다.
:::

### oh-my-opencode를 어떻게 제거하나요?

세 단계로 정리하세요:

**1단계**: OpenCode 설정에서 플러그인 제거

`~/.config/opencode/opencode.json`(또는 `opencode.jsonc`)을 편집하여 `plugin` 배열에서 `"oh-my-opencode"`를 삭제하세요.

```bash
# jq를 사용하여 자동 제거
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**2단계**: 설정 파일 삭제(선택 사항)

```bash
# 사용자 설정 삭제
rm -f ~/.config/opencode/oh-my-opencode.json

# 프로젝트 설정 삭제(존재하는 경우)
rm -f .opencode/oh-my-opencode.json
```

**3단계**: 제거 확인

```bash
opencode --version
# 플러그인이 더 이상 로드되지 않아야 함
```

### 설정 파일은 어디에 있나요?

설정 파일은 두 가지 수준으로 존재합니다:

| 수준 | 위치 | 용도 | 우선순위 |
| --- | --- | --- | ---|
| 프로젝트 수준 | `.opencode/oh-my-opencode.json` | 프로젝트별 설정 | 낮음 |
| 사용자 수준 | `~/.config/opencode/oh-my-opencode.json` | 전역 기본 설정 | 높음 |

**병합 규칙**: 사용자 수준 설정이 프로젝트 수준 설정을 덮어씁니다.

설정 파일은 JSONC 형식(JSON with Comments)을 지원하여 주석과 후행 쉼표를 추가할 수 있습니다:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // 이것은 주석입니다
  "disabled_agents": [], // 후행 쉼표 가능
  "agents": {}
}
```

### 특정 기능을 어떻게 비활성화하나요?

설정 파일에서 `disabled_*` 배열을 사용하세요:

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Claude Code 호환성 스위치**:

```json
{
  "claude_code": {
    "mcp": false,        // Claude Code의 MCP 비활성화
    "commands": false,    // Claude Code의 Commands 비활성화
    "skills": false,      // Claude Code의 Skills 비활성화
    "hooks": false        // settings.json hooks 비활성화
  }
}
```

---

## 사용 관련

### ultrawork란 무엇인가요?

**ultrawork**(또는 `ulw`로 축약)은 마법의 단어입니다—프롬프트에 포함하면 모든 기능이 자동으로 활성화됩니다:

- 병렬 백그라운드 작업
- 모든 전문 에이전트(Sisyphus, Oracle, Librarian, Explore, Prometheus 등)
- 심층 탐색 모드
- Todo 강제 완료 메커니즘

**사용 예시**:

```
ultrawork REST API 개발, JWT 인증과 사용자 관리 필요
```

또는 더 짧게:

```
ulw 이 모듈 리팩토링
```

::: info 원리
`keyword-detector` Hook이 `ultrawork` 또는 `ulw` 키워드를 감지하면 `message.variant`를 특별한 값으로 설정하여 모든 고급 기능을 트리거합니다.
:::

### 특정 에이전트를 어떻게 호출하나요?

**방식 1: @ 기호 사용**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**방식 2: delegate_task 도구 사용**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**에이전트 권한 제한**:

| 에이전트 | 코드 작성 가능 | Bash 실행 가능 | 작업 위임 가능 | 설명 |
| --- | --- | --- | --- | ---|
| Sisyphus | ✅ | ✅ | ✅ | 메인 오케스트레이터 |
| Oracle | ❌ | ❌ | ❌ | 읽기 전용 어드바이저 |
| Librarian | ❌ | ❌ | ❌ | 읽기 전용 리서치 |
| Explore | ❌ | ❌ | ❌ | 읽기 전용 검색 |
| Multimodal Looker | ❌ | ❌ | ❌ | 읽기 전용 미디어 분석 |
| Prometheus | ✅ | ✅ | ✅ | 플래너 |

### 백그라운드 작업은 어떻게 작동하나요?

백그라운드 작업을 통해 여러 AI 에이전트가 실제 개발 팀처럼 병렬로 작업할 수 있습니다:

**백그라운드 작업 시작**:

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**계속 작업...**

**시스템이 자동으로 완료를 알림**(background-notification Hook 통해)

**결과 가져오기**:

```
background_output(task_id="bg_abc123")
```

**동시성 제어**:

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**우선순위**: `modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip 왜 동시성 제어가 필요한가요?
API 속도 제한과 비용 통제를 피하기 위해. 예를 들어, Claude Opus 4.5는 비용이 높아 동시 수를 제한하고; Haiku는 비용이 낮아 더 많은 동시 작업이 가능합니다.
:::

### Ralph Loop는 어떻게 사용하나요?

**Ralph Loop**는 작업이 완료될 때까지 지속적으로 작업하는 자기 참조 개발 루프입니다.

**시작**:

```
/ralph-loop "Build a REST API with authentication"
/ralph-loop "Refactor the payment module" --max-iterations=50
```

**완료 판단**: 에이전트가 `<promise>DONE</promise>` 마커를 출력합니다.

**루프 취소**:

```
/cancel-ralph
```

**설정**:

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip ultrawork와의 차이점
`/ralph-loop`는 일반 모드, `/ulw-loop`는 ultrawork 모드(모든 고급 기능 활성화)입니다.
:::

### Categories와 Skills란 무엇인가요?

**Categories**(v3.0 신규): 작업 유형에 따라 최적의 모델을 자동으로 선택하는 모델 추상화 레이어입니다.

**내장 Categories**:

| Category | 기본 모델 | Temperature | 사용 사례 |
| --- | --- | --- | ---|
| visual-engineering | google/gemini-3-pro | 0.7 | 프론트엔드, UI/UX, 디자인 |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | 고지능 추론 작업 |
| artistry | google/gemini-3-pro | 0.7 | 창의 및 예술 작업 |
| quick | anthropic/claude-haiku-4-5 | 0.1 | 빠르고 저비용 작업 |
| writing | google/gemini-3-flash | 0.1 | 문서 및 글쓰기 작업 |

**Skills**: 특정 도메인의 모범 사례를 주입하는 전문 지식 모듈입니다.

**내장 Skills**:

| Skill | 트리거 조건 | 설명 |
| --- | --- | ---|
| playwright | 브라우저 관련 작업 | Playwright MCP 브라우저 자동화 |
| frontend-ui-ux | UI/UX 작업 | 디자이너에서 개발자로 전환, 아름다운 인터페이스 구축 |
| git-master | Git 작업(commit, rebase, squash) | Git 전문가, 원자적 커밋, 히스토리 검색 |

**사용 예시**:

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="이 페이지의 UI 디자인")
delegate_task(category="quick", skills=["git-master"], prompt="이 변경사항 커밋")
```

::: info 장점
Categories는 비용을 최적화하고(저렴한 모델 사용), Skills는 품질을 보장합니다(전문 지식 주입).
:::

---

## Claude Code 호환성

### Claude Code의 설정을 사용할 수 있나요?

**예**, oh-my-opencode는 **완전 호환 레이어**를 제공합니다:

**지원되는 설정 유형**:

| 유형 | 로드 위치 | 우선순위 |
| --- | --- | ---|
| Commands | `~/.claude/commands/`, `.claude/commands/` | 낮음 |
| Skills | `~/.claude/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` | 중간 |
| Agents | `~/.claude/agents/*.md`, `.claude/agents/*.md` | 높음 |
| MCPs | `~/.claude/.mcp.json`, `.claude/.mcp.json` | 높음 |
| Hooks | `~/.claude/settings.json`, `.claude/settings.json` | 높음 |

**설정 로드 우선순위**:

OpenCode 프로젝트 설정 > Claude Code 사용자 설정

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // 특정 플러그인 비활성화
    }
  }
}
```

### Claude Code 구독을 사용할 수 있나요?

**기술적으로 가능하지만 권장하지 않습니다**.

::: warning Claude OAuth 액세스 제한
2026년 1월 기준으로 Anthropic은 ToS 위반을 이유로 제3자 OAuth 액세스를 제한했습니다.
:::

**공식 성명**(README에서 발췌):

> Claude Code OAuth 요청 서명을 위조하는 일부 커뮤니티 도구가 존재합니다. 이러한 도구는 기술적으로 탐지 불가능할 수 있지만, 사용자는 ToS 영향을 이해해야 하며 개인적으로는 권장하지 않습니다.
>
> **이 프로젝트는 비공식 도구 사용으로 인한 문제에 대해 책임을 지지 않으며, 이러한 OAuth 시스템을 직접 구현하지 않았습니다.**

**권장 솔루션**: 이미 보유한 AI Provider 구독(Claude, OpenAI, Gemini 등)을 사용하세요.

### 데이터가 호환되나요?

**예**, 데이터 저장 형식이 호환됩니다:

| 데이터 | 위치 | 형식 | 호환성 |
| --- | --- | --- | ---|
| Todos | `~/.claude/todos/` | JSON | ✅ Claude Code 호환 |
| Transcripts | `~/.claude/transcripts/` | JSONL | ✅ Claude Code 호환 |

Claude Code와 oh-my-opencode 간에 원활하게 전환할 수 있습니다.

---

## 보안 및 성능

### 보안 경고가 있나요?

**예**, README 상단에 명확한 경고가 있습니다:

::: danger 경고: 사칭 사이트
**ohmyopencode.com은 이 프로젝트와 관련이 없습니다.** 우리는 해당 웹사이트를 운영하거나 보증하지 않습니다.
>
> OhMyOpenCode는 **묣제 및 오픈 소스**입니다. "공식"이라고 주장하는 제3자 사이트에서 설치 프로그램을 다운로드하거나 결제 정보를 입력하지 마세요.
>
> 사칭 사이트가 유료 벽 뒤에 있기 때문에, 우리는 **해당 배포 내용을 검증할 수 없습니다**. 그곳의 모든 다운로드를 **잠재적으로 위험한 것으로** 간주하세요.
>
> ✅ 공식 다운로드: https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### 성능을 어떻게 최적화하나요?

**전략 1: 적절한 모델 사용**

- 빠른 작업 → `quick` category 사용(Haiku 모델)
- UI 디자인 → `visual` category 사용(Gemini 3 Pro)
- 복잡한 추론 → `ultrabrain` category 사용(GPT 5.2)

**전략 2: 동시성 제어 활성화**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // Anthropic 동시성 제한
      "openai": 5       // OpenAI 동시성 증가
    }
  }
}
```

**전략 3: 백그라운드 작업 사용**

가벼운 모델(예: Haiku)이 백그라운드에서 정보를 수집하도록 하고, 메인 에이전트(Opus)가 핵심 로직에 집중하도록 합니다.

**전략 4: 불필요한 기능 비활성화**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // Claude Code hooks 비활성화(사용하지 않는 경우)
  }
}
```

### OpenCode 버전 요구사항은 무엇인가요?

**권장**: OpenCode >= 1.0.132

::: warning 구버전 버그
1.0.132 이전 버전을 사용하는 경우, OpenCode의 버그가 설정을 손상시킬 수 있습니다.
>
> 해당 수정은 1.0.132 이후에 병합되었습니다—업데이트된 버전을 사용하세요.
:::

버전 확인:

```bash
opencode --version
```

---

## 문제 해결

### 에이전트가 작동하지 않나요?

**체크리스트**:

1. ✅ 설정 파일 형식이 올바른지 확인(JSONC 구문)
2. ✅ Provider 설정 확인(API Key가 유효한지)
3. ✅ 진단 도구 실행: `oh-my-opencode doctor --verbose`
4. ✅ OpenCode 로그에서 오류 메시지 확인

**일반적인 문제**:

| 문제 | 원인 | 해결책 |
| --- | --- | ---|
| 에이전트가 작업을 거부함 | 권한 설정 오류 | `agents.permission` 설정 확인 |
| 백그라운드 작업 시간 초과 | 동시성 제한이 너무 엄격함 | `providerConcurrency` 증가 |
| 사고 블록 오류 | 모델이 thinking을 지원하지 않음 | thinking을 지원하는 모델로 전환 |

### 설정 파일이 적용되지 않나요?

**가능한 원인**:

1. JSON 구문 오류(따옴표 누락, 쉼표)
2. 설정 파일 위치 오류
3. 사용자 설정이 프로젝트 설정을 덮어쓰지 않음

**검증 단계**:

```bash
# 설정 파일이 존재하는지 확인
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# JSON 구문 검증
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**JSON Schema 검증 사용**:

설정 파일 시작 부분에 `$schema` 필드를 추가하면 편집기가 자동으로 오류를 표시합니다:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### 백그라운드 작업이 완료되지 않나요?

**체크리스트**:

1. ✅ 작업 상태 확인: `background_output(task_id="...")`
2. ✅ 동시성 제한 확인: 사용 가능한 동시 슬롯이 있는지
3. ✅ 로그 확인: API 속도 제한 오류가 있는지

**작업 강제 취소**:

```javascript
background_cancel(task_id="bg_abc123")
```

**작업 TTL**: 백그라운드 작업은 30분 후에 자동으로 정리됩니다.

---

## 추가 리소스

### 어디에서 도움을 받을 수 있나요?

- **GitHub Issues**: https://github.com/code-yeongyu/oh-my-opencode/issues
- **Discord 커뮤니티**: https://discord.gg/PUwSMR9XNk
- **X (Twitter)**: https://x.com/justsisyphus

### 권장 읽기 순서

초보자라면 다음 순서로 읽는 것을 권장합니다:

1. [빠른 설치 및 설정](../start/installation/)
2. [Sisyphus 첫 만남: 메인 오케스트레이터](../start/sisyphus-orchestrator/)
3. [Ultrawork 모드](../start/ultrawork-mode/)
4. [설정 진단 및 문제 해결](../troubleshooting/)

### 코드 기여

Pull Request를 환영합니다! 프로젝트의 99%는 OpenCode로 구축되었습니다.

특정 기능을 개선하거나 버그를 수정하려면:

1. 저장소 Fork
2. 기능 브랜치 생성
3. 변경사항 커밋
4. 브랜치에 푸시
5. Pull Request 생성

---

## 본 강의 요약

이 FAQ는 oh-my-opencode의 일반적인 질문을 다룹니다:

- **설치 및 설정**: 설치 방법, 제거 방법, 설정 파일 위치, 기능 비활성화 방법
- **사용 팁**: ultrawork 모드, 에이전트 호출, 백그라운드 작업, Ralph Loop, Categories 및 Skills
- **Claude Code 호환성**: 설정 로드, 구독 사용 제한, 데이터 호환성
- **보안 및 성능**: 보안 경고, 성능 최적화 전략, 버전 요구사항
- **문제 해결**: 일반적인 문제와 해결책

이 핵심 사항들을 기억하세요:

- `ultrawork` 또는 `ulw` 키워드를 사용하여 모든 기능 활성화
- 가벼운 모델이 백그라운드에서 정보를 수집하도록 하고, 메인 에이전트가 핵심 로직에 집중하도록 함
- 설정 파일은 JSONC 형식을 지원하며 주석 추가 가능
- Claude Code 설정을 원활하게 로드할 수 있지만, OAuth 액세스에는 제한이 있음
- 공식 GitHub 저장소에서 다운로드하고, 사칭 사이트 주의

## 다음 강의 예고

> 사용 중에 구체적인 설정 문제를 만나면 **[설정 진단 및 문제 해결](../troubleshooting/)**을 확인하세요.
>
> 배울 내용:
> - 진단 도구를 사용하여 설정 확인하는 방법
> - 일반적인 오류 코드의 의미와 해결 방법
> - Provider 설정 문제 해결 팁
> - 성능 문제 식별 및 최적화 권장 사항

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | ---|
| Keyword Detector (ultrawork 감지) | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | 전체 디렉토리 |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | 전체 파일 |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | 전체 파일 |
| Delegate Task (Category & Skill 파싱) | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Config Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 전체 파일 |
| Claude Code Hooks | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | 전체 디렉토리 |

**핵심 상수**:
- `DEFAULT_MAX_ITERATIONS = 100`: Ralph Loop 기본 최대 반복 횟수
- `TASK_TTL_MS = 30 * 60 * 1000`: 백그라운드 작업 TTL(30분)
- `POLL_INTERVAL_MS = 2000`: 백그라운드 작업 폴 간격(2초)

**핵심 설정**:
- `disabled_agents`: 비활성화된 에이전트 목록
- `disabled_skills`: 비활성화된 스킬 목록
- `disabled_hooks`: 비활성화된 훅 목록
- `claude_code`: Claude Code 호환성 설정
- `background_task`: 백그라운드 작업 동시성 설정
- `categories`: Category 사용자 정의 설정
- `agents`: 에이전트 오버라이드 설정

</details>
