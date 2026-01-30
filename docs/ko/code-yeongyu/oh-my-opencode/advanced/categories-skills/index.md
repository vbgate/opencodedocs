---
title: "Categories 와 Skills: 동적 에이전트 구성 | oh-my-opencode"
sidebarTitle: "블록 쌓기처럼 동적 에이전트 구성"
subtitle: "Categories 와 Skills: 동적 에이전트 구성 (v3.0)"
description: "oh-my-opencode 의 Categories 와 Skills 시스템을 배우고, 모델과 지식을 조합하여 전문화된 AI 서브 에이전트를 만드는 방법을 익히세요. 내장된 7 개의 Categories, 4 개의 Skills, 그리고 delegate_task 도구를 통해 개발 비용을 최적화합니다."
tags:
  - "categories"
  - "skills"
  - "delegate-task"
  - "sisyphus-junior"
prerequisite:
  - "start-quick-start"
order: 100
---

# Categories 와 Skills: 동적 에이전트 구성 (v3.0)

## 학습 후 할 수 있는 것

- ✅ 7 개의 내장 Categories 를 사용하여 다양한 작업 유형에 맞는 최적의 모델을 자동 선택
- ✅ 4 개의 내장 Skills 를 로드하여 에이전트에 전문 지식과 MCP 도구 주입
- ✅ `delegate_task` 를 통해 Category 와 Skill 을 조합하여 전문화된 서브 에이전트 생성
- ✅ 특정 프로젝트 요구사항에 맞는 사용자 정의 Category 와 Skill 생성

## 현재 직면한 문제

**에이전트가 전문성이 부족하거나 비용이 너무 높나요?**

이러한 시나리오를 생각해보세요:

| 문제 | 전통적 방안 | 실제 요구사항 |
| --- | --- | --- |
| **UI 작업에 초고성능 모델 사용** | Claude Opus 로 간단한 스타일 조정 처리 | 비용이 높고 컴퓨팅 자원 낭비 |
| **복잡한 로직에 경량 모델 사용** | Haiku 로 아키텍처 설계 처리 | 추론 능력 부족, 잘못된 방안 |
| **Git 커밋 스타일 불일치** | 커밋을 수동으로 관리하여 오류 발생 | 프로젝트 표준 자동 감지 및 준수 필요 |
| **브라우저 테스트 필요** | 브라우저를 수동으로 열어 검증 | Playwright MCP 도구 지원 필요 |

**핵심 문제**:
1. 모든 작업을 하나의 에이전트로 처리 → 모델과 도구 불일치
2. 10 개의 고정 에이전트를 하드코딩 → 유연한 조합 불가
3. 전문 기술 부족 → 에이전트의 특정 도메인 지식 부재

**해결책**: v3.0 의 Categories 와 Skills 시스템을 통해 블록 쌓기처럼 에이전트를 조합:
- **Category** (모델 추상화): 작업 유형 정의 → 최적의 모델 자동 선택
- **Skill** (전문 지식): 도메인 지식과 MCP 도구 주입 → 에이전트 전문성 향상

## 언제 이 기술을 사용할지

| 시나리오 | 추천 조합 | 효과 |
| --- | --- | --- |
| **UI 디자인 및 구현** | `category="visual-engineering"` + `skills=["frontend-ui-ux", "playwright"]` | Gemini 3 Pro + 디자이너 사고방식 + 브라우저 검증 자동 선택 |
| **빠른 수정 및 커밋** | `category="quick"` + `skills=["git-master"]` | Haiku 로 저비용 완료 + 자동 커밋 스타일 감지 |
| **심층 아키텍처 분석** | `category="ultrabrain"` + `skills=[]` | GPT-5.2 Codex (xhigh) 로 순수 추론 |
| **문서 작성** | `category="writing"` + `skills=[]` | Gemini 3 Flash 로 빠른 문서 생성 |

## 🎒 시작 전 준비

::: warning 전제 조건

본 튜토리얼을 시작하기 전에 다음을 확인하세요:
1. oh-my-opencode 가 설치되어 있는지 ([설치 튜토리얼](../../start/installation/) 참조)
2. 하나 이상의 Provider 가 설정되어 있는지 ([Provider 설정](../../platforms/provider-setup/) 참조)
3. 기본적인 delegate_task 도구 사용 방법을 알고 있는지 ([백그라운드 병렬 작업](../background-tasks/) 참조)

:::

::: info 핵심 개념
**Category** 는 "어떤 유형의 작업인가"를 결정합니다 (모델, 온도, 사고방식 결정). **Skill** 은 "어떤 전문 지식과 도구가 필요한가"를 결정합니다 (프롬프트와 MCP 서버 주입). `delegate_task(category=..., skills=[...])` 를 통해 둘을 조합하세요.
:::

## 핵심 개념

### Categories: 작업 유형이 모델을 결정

oh-my-opencode 는 7 개의 내장 Categories 를 제공하며, 각 카테고리는 최적의 모델과 사고방식으로 사전 구성되어 있습니다:

| Category | 기본 모델 | Temperature | 용도 |
| --- | --- | --- | --- |
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | 프론트엔드, UI/UX, 디자인 작업 |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | 고지능 추론 작업 (복잡한 아키텍처 결정) |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | 창의적/예술적 작업 (참신한 아이디어) |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | 빠르고 저비용 작업 (단일 파일 수정) |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | 다른 카테고리와 일치하지 않는 중간 수준 작업 |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | 다른 카테고리와 일치하지 않는 고품질 작업 |
| `writing` | `google/gemini-3-flash` | 0.1 | 문서 및 작문 작업 |

**왜 Categories 가 필요한가요?**

다양한 작업에는 다양한 능력을 가진 모델이 필요합니다:
- UI 디자인 → **시각적 창의력** 필요 (Gemini 3 Pro)
- 아키텍처 결정 → **심층 추론** 필요 (GPT-5.2 Codex xhigh)
- 단순 수정 → **빠른 응답** 필요 (Claude Haiku)

수동으로 각 작업에 맞는 모델을 선택하는 것은 번거롭습니다. Categories 는 작업 유형만 선언하면 시스템이 최적의 모델을 자동 선택합니다.

### Skills: 전문 지식 주입

Skill 은 SKILL.md 파일로 정의된 도메인 전문가로, 다음을 주입할 수 있습니다:
- **전문 지식** (프롬프트 확장)
- **MCP 서버** (자동 로드)
- **작업 흐름 가이드** (구체적 조작 단계)

내장된 4 개의 Skills:

| Skill | 기능 | MCP | 용도 |
| --- | --- | --- | --- |
| `playwright` | 브라우저 자동화 | `@playwright/mcp` | UI 검증, 스크린샷, 크롤링 |
| `agent-browser` | 브라우저 자동화 (Vercel) | 수동 설치 | 위와 동일, 대안 방안 |
| `frontend-ui-ux` | 디자이너 사고방식 | 없음 | 아름다운 인터페이스 구축 |
| `git-master` | Git 전문가 | 없음 | 자동 커밋, 이력 검색, rebase |

**Skill 의 작동 원리**:

Skill 을 로드하면 시스템은 다음을 수행합니다:
1. SKILL.md 파일의 프롬프트 내용 읽기
2. MCP 가 정의된 경우 해당 서버 자동 시작
3. Skill 프롬프트를 에이전트의 시스템 프롬프트에 추가

예를 들어 `git-master` Skill 은 다음을 포함합니다:
- 커밋 스타일 감지 (프로젝트의 커밋 형식 자동 식별)
- 원자적 커밋 규칙 (3 파일 → 최소 2 개의 커밋)
- Rebase 워크플로우 (squash, fixup, 충돌 처리)
- 이력 검색 (blame, bisect, log -S)

### Sisyphus Junior: 작업 실행기

Category 를 사용하면 특별한 서브 에이전트인 **Sisyphus Junior** 가 생성됩니다.

**주요 특성**:
- ✅ Category 의 모델 구성 상속
- ✅ 로드된 Skills 프롬프트 상속
- ❌ **재위임 불가** (`task` 및 `delegate_task` 도구 사용 금지)

**왜 재위임이 금지되나요?**

무한 루프와 작업 분산 방지:
```
Sisyphus (메인 에이전트)
  ↓ delegate_task(category="quick")
Sisyphus Junior
  ↓ 재위임 시도 (허용된 경우)
Sisyphus Junior 2
  ↓ delegate_task
...무한 루프...
```

재위임을 금지함으로써 Sisyphus Junior 는 할당된 작업 완료에 집중하여 명확한 목표와 효율적인 실행을 보장합니다.

## 따라 해보기

### 1 단계: 빠른 수정 (Quick + Git Master)

실제 시나리오를 사용해 보겠습니다: 여러 파일을 수정했고 프로젝트 스타일에 맞게 자동으로 커밋해야 합니다.

**이유**
`quick` Category 의 Haiku 모델은 비용이 저렴하고, `git-master` Skill 이 커밋 스타일을 자동 감지하여 완벽한 커밋을 구현합니다.

OpenCode 에 입력하세요:

```
delegate_task 를 사용하여 현재 변경사항 커밋하기
- category: quick
- load_skills: ["git-master"]
- prompt: "현재 모든 변경사항을 커밋하세요. 프로젝트의 커밋 스타일을 따르세요 (git log 로 감지). 원자적 커밋을 보장하세요, 하나의 커밋은 최대 3 개의 파일."
- run_in_background: false
```

**확인해야 할 내용**:

1. Sisyphus Junior 가 `claude-haiku-4-5` 모델로 시작됩니다
2. `git-master` Skill 이 로드되고, 프롬프트에 Git 전문가 지식이 포함됩니다
3. 에이전트가 다음 작업을 수행합니다:
   ```bash
   # 병렬로 컨텍스트 수집
   git status
   git diff --stat
   git log -30 --oneline
   ```
4. 커밋 스타일 감지 (예: Semantic vs Plain vs Short)
5. 원자적 커밋 계획 (3 파일 → 최소 2 개의 커밋)
6. 감지된 스타일에 따라 커밋 실행

**확인 포인트 ✅**:

커밋이 성공했는지 확인하세요:
```bash
git log --oneline -5
```

여러 개의 원자적 커밋이 각각 명확한 메시지 스타일을 가지고 표시되어야 합니다.

### 2 단계: UI 구현 및 검증 (Visual + Playwright + UI/UX)

시나리오: 페이지에 반응형 차트 컴포넌트를 추가하고 브라우저에서 검증해야 합니다.

**이유**
- `visual-engineering` Category 는 시각적 디자인에 능숙한 Gemini 3 Pro 를 선택합니다
- `playwright` Skill 은 브라우저 테스트를 위한 MCP 도구를 제공합니다
- `frontend-ui-ux` Skill 은 디자이너 사고방식을 주입합니다 (색상, 타이포그래피, 애니메이션)

OpenCode 에 입력하세요:

```
delegate_task 를 사용하여 차트 컴포넌트 구현하기
- category: visual-engineering
- load_skills: ["frontend-ui-ux", "playwright"]
- prompt: "대시보드 페이지에 반응형 차트 컴포넌트를 추가하세요. 요구사항:
  - Tailwind CSS 사용
  - 모바일 및 데스크톱 지원
  - 선명한 색상 구성 사용 (보라색 그라디언트 피하기)
  - 스태거 애니메이션 효과 추가
  - 완료 후 playwright 로 스크린샷 검증"
- run_in_background: false
```

**확인해야 할 내용**:

1. Sisyphus Junior 가 `google/gemini-3-pro` 모델로 시작됩니다
2. 두 개의 Skill 프롬프트를 로드합니다:
   - `frontend-ui-ux`: 디자이너 마인드셋 가이드
   - `playwright`: 브라우저 자동화 명령
3. `@playwright/mcp` 서버가 자동으로 시작됩니다
4. 에이전트가 다음을 실행합니다:
   - 디자이너 사고방식 적용하여 차트 컴포넌트 디자인
   - 반응형 레이아웃 구현
   - 애니메이션 효과 추가
   - Playwright 도구 사용:
     ```
     playwright_navigate: http://localhost:3000/dashboard
     playwright_take_screenshot: output=dashboard-chart.png
     ```

**확인 포인트 ✅**:

컴포넌트가 올바르게 렌더링되었는지 확인하세요:
```bash
# 새 파일 확인
git diff --name-only
git diff --stat

# 스크린샷 보기
ls screenshots/
```

다음이 표시되어야 합니다:
- 새 차트 컴포넌트 파일
- 반응형 스타일 코드
- 스크린샷 파일 (검증 통과)

### 3 단계: 심층 아키텍처 분석 (Ultrabrain 순수 추론)

시나리오: 마이크로서비스 아키텍처를 위해 복잡한 통신 패턴을 설계해야 합니다.

**이유**
- `ultrabrain` Category 는 GPT-5.2 Codex (xhigh) 를 선택하여 최강의 추론 능력을 제공합니다
- Skill 을 로드하지 않음 → 순수 추론, 전문 지식 간섭 방지

OpenCode 에 입력하세요:

```
delegate_task 를 사용하여 아키텍처 분석하기
- category: ultrabrain
- load_skills: []
- prompt: "우리의 마이크로서비스 아키텍처를 위해 효율적인 통신 패턴을 설계하세요. 요구사항:
  - 서비스 검색 지원
  - 네트워크 분할 처리
  - 지연 시간 최소화
  - 우회 전략 제공

  현재 아키텍처: [간략히 설명]
  기술 스택: gRPC, Kubernetes, Consul"
- run_in_background: false
```

**확인해야 할 내용**:

1. Sisyphus Junior 가 `openai/gpt-5.2-codex` 모델로 시작됩니다 (xhigh 변형)
2. 어떤 Skill 도 로드하지 않습니다
3. 에이전트가 심층 추론을 수행합니다:
   - 기존 아키텍처 분석
   - 통신 패턴 비교 (예: CQRS, Event Sourcing, Saga)
   - 장단점 분석
   - 계층적 제안 제공 (Bottom Line → Action Plan → Risks)

**출력 구조**:

```
Bottom Line: 하이브리드 모드 (gRPC + Event Bus) 사용 권장

Action Plan:
1. 서비스 간 gRPC 로 동기 통신 구현
2. 중요 이벤트는 Event Bus 로 비동기 발행
3. 중복 메시지 처리를 위한 멱등성 구현

Risks and Mitigations:
- Risk: 네트워크 분할로 인한 메시지 손실
  Mitigation: 메시지 재시도 및 데드 레터 큐 구현
```

**확인 포인트 ✅**:

솔루션이 포괄적인지 확인하세요:
- 서비스 검색이 고려되었나요?
- 네트워크 분할이 처리되었나요?
- 우회 전략이 제공되었나요?

### 4 단계: 사용자 정의 Category (선택사항)

내장 Categories 가 요구사항을 충족하지 않는 경우 `oh-my-opencode.json` 에서 사용자 정의할 수 있습니다.

**이유**
일부 프로젝트에는 특정 모델 구성이 필요합니다 (예: Korean Writer, Deep Reasoning).

`~/.config/opencode/oh-my-opencode.json` 을 편집하세요:

```jsonc
{
  "categories": {
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },
    
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false
      }
    }
  }
}
```

**필드 설명**:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `model` | string | Category 가 사용하는 모델 재정의 |
| `temperature` | number | 창의성 레벨 (0-2) |
| `prompt_append` | string | 시스템 프롬프트에 추가할 내용 |
| `thinking` | object | Thinking 구성 (`{ type, budgetTokens }`) |
| `tools` | object | 도구 권한 비활성화 (`{ toolName: false }`) |

**확인 포인트 ✅**:

사용자 정의 Category 가 작동하는지 확인하세요:
```bash
# 사용자 정의 Category 사용
delegate_task(category="korean-writer", load_skills=[], prompt="...")
```

구성한 모델과 프롬프트가 시스템에서 사용되는 것을 확인할 수 있어야 합니다.

## 함정 경고

### 함정 1: Quick Category 프롬프트가 명확하지 않음

**문제**: `quick` Category 는 Haiku 모델을 사용하며, 추론 능력이 제한적입니다. 프롬프트가 너무 모호하면 결과가 좋지 않습니다.

**잘못된 예시**:
```
delegate_task(category="quick", load_skills=["git-master"], prompt="변경사항 커밋")
```

**올바른 방법**:
```
TASK: 모든 현재 코드 변경사항 커밋

MUST DO:
1. 프로젝트 커밋 스타일 감지 (git log -30 통해)
2. 8 개의 파일을 3+ 개의 원자적 커밋으로 디렉터리별 분할
3. 각 커밋 최대 3 개 파일
4. 감지된 스타일 따르기 (Semantic/Plain/Short)

MUST NOT DO:
- 다른 디렉터리의 파일을 하나의 커밋으로 병합
- 커밋 계획 없이 바로 실행

EXPECTED OUTPUT:
- 여러 개의 원자적 커밋
- 각 커밋 메시지가 프로젝트 스타일과 일치
- 의존성 순서 따르기 (타입 정의 → 구현 → 테스트)
```

### 함정 2: `load_skills` 지정 잊음

**문제**: `load_skills` 는 **필수 매개변수**이며, 지정하지 않으면 오류가 발생합니다.

**잘못됨**:
```
delegate_task(category="quick", prompt="...")
```

**오류 출력**:
```
Error: Invalid arguments: 'load_skills' parameter is REQUIRED.
Pass [] if no skills needed, but IT IS HIGHLY RECOMMENDED to pass proper skills.
```

**올바른 방법**:
```
# Skill 이 필요 없음, 빈 배열 명시적 전달
delegate_task(category="unspecified-low", load_skills=[], prompt="...")
```

### 함정 3: Category 와 subagent_type 동시 지정

**문제**: 이 두 매개변수는 상호 배타적이며, 동시에 지정할 수 없습니다.

**잘못됨**:
```
delegate_task(
  category="quick",
  subagent_type="oracle",  # ❌ 충돌
  ...
)
```

**올바른 방법**:
```
# Category 사용 (권장)
delegate_task(category="quick", load_skills=[], prompt="...")

# 또는 에이전트 직접 지정
delegate_task(subagent_type="oracle", load_skills=[], prompt="...")
```

### 함정 4: Git Master 의 다중 커밋 규칙

**문제**: `git-master` Skill 은 **다중 커밋**을 강제하며, 3+ 파일을 하나의 커밋으로 시도하면 실패합니다.

**잘못됨**:
```
# 8 개의 파일을 하나의 커밋으로 시도
git commit -m "Update landing page"  # ❌ git-master 가 거부함
```

**올바른 방법**:
```
# 디렉터리별로 여러 커밋으로 분할
git add app/page.tsx app/layout.tsx
git commit -m "Add app layer"  # ✅ Commit 1

git add components/demo/*
git commit -m "Add demo components"  # ✅ Commit 2

git add e2e/*
git commit -m "Add tests"  # ✅ Commit 3
```

### 함정 5: Playwright Skill MCP 미설치

**문제**: `playwright` Skill 을 사용하기 전에 MCP 서버가 사용 가능한지 확인해야 합니다.

**잘못됨**:
```
delegate_task(category="visual-engineering", load_skills=["playwright"], prompt="스크린샷...")
```

**올바른 방법**:

MCP 구성 확인 (`~/.config/opencode/mcp.json` 또는 `.claude/.mcp.json`):

```jsonc
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Playwright MCP 가 구성되지 않은 경우, `playwright` Skill 이 자동으로 시작합니다.

## 강의 요약

Categories 와 Skills 시스템을 통해 에이전트를 유연하게 조합할 수 있습니다:

| 구성 요소 | 역할 | 구성 방법 |
| --- | --- | --- |
| **Category** | 모델과 사고방식 결정 | `delegate_task(category="...")` 또는 구성 파일 |
| **Skill** | 전문 지식과 MCP 주입 | `delegate_task(load_skills=["..."])` 또는 SKILL.md 파일 |
| **Sisyphus Junior** | 작업 실행, 재위임 불가 | 자동 생성, 수동 지정 불필요 |

**조합 전략**:
1. **UI 작업**: `visual-engineering` + `frontend-ui-ux` + `playwright`
2. **빠른 수정**: `quick` + `git-master`
3. **심층 추론**: `ultrabrain` (Skill 없음)
4. **문서 작성**: `writing` (Skill 없음)

**모범 사례**:
- ✅ 항상 `load_skills` 지정 (빈 배열이라도)
- ✅ `quick` Category 의 프롬프트는 명확해야 함 (Haiku 의 추론 능력 제한)
- ✅ Git 작업은 항상 `git-master` Skill 사용 (스타일 자동 감지)
- ✅ UI 작업은 항상 `playwright` Skill 사용 (브라우저 검증)
- ✅ 작업 유형에 맞는 Category 선택 (기본 메인 에이전트 사용 금지)

## 다음 강의 예고

> 다음 강의에서는 **[내장 Skills: 브라우저 자동화, Git 전문가 및 UI 디자이너](../builtin-skills/)** 를 배웁니다.
> 
> 배울 내용:
> - `playwright` Skill 의 상세한 워크플로우
> - `git-master` Skill 의 3 가지 모드 (Commit/Rebase/History Search)
> - `frontend-ui-ux` Skill 의 디자인 철학
> - 사용자 정의 Skill 생성 방법

---

## 부록: 소스 코드 참고

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| delegate_task 도구 구현 | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 전체 (1070 라인) |
| resolveCategoryConfig 함수 | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 113-152 |
| buildSystemContent 함수 | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 176-188 |
| 기본 Categories 구성 | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 158-166 |
| Categories 프롬프트 추가 | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 168-176 |
| Categories 설명 | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 178-186 |
| Category 구성 Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172 |
| 내장 Skills 정의 | [`src/features/builtin-skills/`](https://github.com/code-yeongyu/oh-my-opencode/tree/main/src/features/builtin-skills) | 디렉토리 구조 |
| git-master Skill 프롬프트 | [`src/features/builtin-skills/git-master/SKILL.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/git-master/SKILL.md) | 전체 (1106 라인) |

**핵심 상수**:
- `SISYPHUS_JUNIOR_AGENT = "sisyphus-junior"`: Category 위임의 실행 에이전트
- `DEFAULT_CATEGORIES`: 7 개 내장 Category 의 모델 구성
- `CATEGORY_PROMPT_APPENDS`: 각 Category 의 프롬프트 추가 내용
- `CATEGORY_DESCRIPTIONS`: 각 Category 의 설명 (delegate_task 프롬프트에 표시)

**핵심 함수**:
- `resolveCategoryConfig()`: Category 구성 파싱, 사용자 재정의와 기본값 병합
- `buildSystemContent()`: Skill 및 Category 의 프롬프트 내용 병합
- `createDelegateTask()`: delegate_task 도구 정의 생성

**내장 Skills 파일**:
- `src/features/builtin-skills/frontend-ui-ux/SKILL.md`: 디자이너 사고방식 프롬프트
- `src/features/builtin-skills/git-master/SKILL.md`: Git 전문가 전체 워크플로우
- `src/features/builtin-skills/agent-browser/SKILL.md`: Vercel agent-browser 구성
- `src/features/builtin-skills/dev-browser/SKILL.md`: 브라우저 자동화 참조 문서

</details>
