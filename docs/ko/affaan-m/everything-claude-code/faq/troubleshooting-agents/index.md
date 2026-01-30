---
title: "Agent 문제 해결: 진단 및 복구 | Everything Claude Code"
sidebarTitle: "Agent가 작동하지 않을 때"
subtitle: "Agent 문제 해결: 진단 및 복구"
description: "Everything Claude Code Agent 호출 실패 문제 해결 방법을 학습합니다. Agent가 로드되지 않음, 구성 오류, 도구 권한 부족, 호출 시간 초과 등 일반적인 문제의 진단 및 해결을 다루며, 체계적인 디버깅 기술을 마스터하는 데 도움을 드립니다."
tags:
  - "agents"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "platforms-agents-overview"
order: 170
---

# Agent 호출 실패 문제 해결

## 겪을 수 있는 문제

Agent 사용 시 어려움을 겪고 계신가요? 다음 상황 중 하나를 경험할 수 있습니다:

- `/plan` 또는 다른 명령을 입력했지만 Agent가 호출되지 않음
- "Agent not found" 오류 메시지 표시
- Agent 실행 시간 초과 또는 멈춤
- Agent 출력이 기대와 다름
- Agent가 규칙대로 작동하지 않음

걱정하지 마세요. 이러한 문제는 대부분 명확한 해결 방법이 있습니다. 이 수업에서는 Agent 관련 문제를 체계적으로 진단하고 복구하는 방법을 도와드립니다.

## 🎒 시작 전 준비

::: warning 사전 확인
다음 사항을 확인하세요:
1. ✅ Everything Claude Code [설치](../../start/installation/) 완료
2. ✅ [Agents 개념](../../platforms/agents-overview/) 및 9개의 전문화된 하위 에이전트 이해
3. ✅ Agent 호출 시도 (`/plan`, `/tdd`, `/code-review` 등)
:::

---

## 일반적인 문제 1: Agent가 전혀 호출되지 않음

### 증상
`/plan` 또는 다른 명령을 입력했지만 Agent가 트리거되지 않고 일반 채팅만 수행됨.

### 가능한 원인

#### 원인 A: Agent 파일 경로 오류

**문제**: Agent 파일이 올바른 위치에 없어 Claude Code가 찾을 수 없음.

**해결 방법**:

Agent 파일 위치가 올바른지 확인:

```bash
# 다음 위치 중 하나에 있어야 함:
~/.claude/agents/              # 사용자 수준 구성(전역)
.claude/agents/                 # 프로젝트 수준 구성
```

**확인 방법**:

```bash
# 사용자 수준 구성 확인
ls -la ~/.claude/agents/

# 프로젝트 수준 구성 확인
ls -la .claude/agents/
```

**9개의 Agent 파일이 표시되어야 함**:
- `planner.md`
- `architect.md`
- `tdd-guide.md`
- `code-reviewer.md`
- `security-reviewer.md`
- `build-error-resolver.md`
- `e2e-runner.md`
- `refactor-cleaner.md`
- `doc-updater.md`

**파일이 존재하지 않는 경우**, Everything Claude Code 플러그인 디렉토리에서 복사:

```bash
# 플러그인이 ~/.claude-plugins/에 설치된 경우
cp ~/.claude-plugins/everything-claude-code/agents/*.md ~/.claude/agents/

# 또는 클론된 저장소에서 복사
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

#### 원인 B: Command 파일 누락 또는 경로 오류

**문제**: Command 파일(예: `/plan`에 해당하는 `plan.md`)이 존재하지 않거나 경로가 잘못됨.

**해결 방법**:

Command 파일 위치 확인:

```bash
# Commands는 다음 위치 중 하나에 있어야 함:
~/.claude/commands/             # 사용자 수준 구성(전역)
.claude/commands/                # 프로젝트 수준 구성
```

**확인 방법**:

```bash
# 사용자 수준 구성 확인
ls -la ~/.claude/commands/

# 프로젝트 수준 구성 확인
ls -la .claude/commands/
```

**14개의 Command Command 파일이 표시되어야 함**:
- `plan.md` → `planner` agent 호출
- `tdd.md` → `tdd-guide` agent 호출
- `code-review.md` → `code-reviewer` agent 호출
- `build-fix.md` → `build-error-resolver` agent 호출
- `e2e.md` → `e2e-runner` agent 호출
- 기타...

**파일이 존재하지 않는 경우**, Command 파일 복사:

```bash
cp ~/.claude-plugins/everything-claude-code/commands/*.md ~/.claude/commands/
```

#### 원인 C: 플러그인이 올바르게 로드되지 않음

**문제**: 플러그인 마켓플레이스를 통해 설치했지만 플러그인이 올바르게 로드되지 않음.

**해결 방법**:

`~/.claude/settings.json`에서 플러그인 구성 확인:

```bash
# 플러그인 구성 확인
cat ~/.claude/settings.json | jq '.enabledPlugins'
```

**다음이 표시되어야 함**:

```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**활성화되지 않은 경우**, 수동으로 추가:

```bash
# settings.json 편집
nano ~/.claude/settings.json

# enabledPlugins 필드 추가 또는 수정
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Claude Code를 다시 시작하여 구성 적용**.

---

## 일반적인 문제 2: Agent 호출 오류 "Agent not found"

### 증상
명령을 입력한 후 "Agent not found" 또는 "Could not find agent: xxx" 오류 메시지 표시.

### 가능한 원인

#### 원인 A: Command 파일의 Agent 이름 불일치

**문제**: Command 파일의 `invokes` 필드가 Agent 파일 이름과 일치하지 않음.

**해결 방법**:

Command 파일의 `invokes` 필드 확인:

```bash
# 특정 Command 파일 확인
cat ~/.claude/commands/plan.md | grep -A 5 "invokes"
```

**Command 파일 구조**(`plan.md` 예시):

```markdown
---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes **planner** agent...
```

**Agent 파일 존재 여부 확인**:

Command 파일에 언급된 agent 이름(예: `planner`)은 파일 `planner.md`에 해당해야 함

```bash
# Agent 파일 존재 확인
ls -la ~/.claude/agents/planner.md

# 존재하지 않는 경우 유사한 이름의 파일 확인
ls -la ~/.claude/agents/ | grep -i plan
```

**일반적인 불일치 예시**:

| Command invokes | 실제 Agent 파일명 | 문제 |
|--- | --- | ---|
| `planner` | `planner.md` | ✅ 정상 |
| `planner` | `Planner.md` | ❌ 대소문자 불일치(Unix 시스템은 대소문자 구분) |
| `planner` | `planner.md.backup` | ❌ 파일 확장자 오류 |
| `tdd-guide` | `tdd_guide.md` | ❌ 하이픈 vs 밑줄 |

#### 원인 B: Agent 파일명 오류

**문제**: Agent 파일명이 기대와 다름.

**해결 방법**:

모든 Agent 파일명 확인:

```bash
# 모든 Agent 파일 나열
ls -la ~/.claude/agents/

# 예상되는 9개의 Agent 파일
# planner.md
# architect.md
# tdd-guide.md
# code-reviewer.md
# security-reviewer.md
# build-error-resolver.md
# e2e-runner.md
# refactor-cleaner.md
# doc-updater.md
```

**파일명이 올바르지 않은 경우**, 파일 이름 변경:

```bash
# 예시: 파일명 수정
cd ~/.claude/agents/
mv Planner.md planner.md
mv tdd_guide.md tdd-guide.md
```

---

## 일반적인 문제 3: Agent Front Matter 형식 오류

### 증상
Agent가 호출되었지만 "Invalid agent metadata" 또는 유사한 형식 오류 메시지 표시.

### 가능한 원인

#### 원인 A: 필수 필드 누락

**문제**: Agent Front Matter에 필수 필드(`name`, `description`, `tools`)가 누락됨.

**해결 방법**:

Agent Front Matter 형식 확인:

```bash
# 특정 Agent 파일의 헤더 확인
head -20 ~/.claude/agents/planner.md
```

**올바른 Front Matter 형식**:

```markdown
---
name: planner
description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.
tools: Read, Grep, Glob
model: opus
---
```

**필수 필드**:
- `name`: Agent 이름(파일명과 일치해야 하며 확장자 제외)
- `description`: Agent 설명(Agent의 책임 이해용)
- `tools`: 허용된 도구 목록(쉼표로 구분)

**선택적 필드**:
- `model`: 선호 모델(`opus` 또는 `sonnet`)

#### 원인 B: Tools 필드 오류

**문제**: `tools` 필드에 잘못된 도구 이름이나 형식 사용됨.

**해결 방법**:

`tools` 필드 확인:

```bash
# tools 필드 추출
grep "^tools:" ~/.claude/agents/*.md
```

**허용된 도구 이름**(대소문자 구분):
- `Read`
- `Write`
- `Edit`
- `Bash`
- `Grep`
- `Glob`

**일반적인 오류**:

| 잘못된 작성 | 올바른 작성 | 문제 |
|--- | --- | ---|
| `tools: read, grep, glob` | `tools: Read, Grep, Glob` | ❌ 대소문자 오류 |
| `tools: Read, Grep, Glob,` | `tools: Read, Grep, Glob` | ❌ 후행 쉼표(YAML 구문 오류) |
| `tools: "Read, Grep, Glob"` | `tools: Read, Grep, Glob` | ❌ 따옴표 불필요 |
| `tools: Read Grep Glob` | `tools: Read, Grep, Glob` | ❌ 쉼표 구분 누락 |

#### 원인 C: YAML 구문 오류

**문제**: Front Matter YAML 형식 오류(들여쓰기, 따옴표, 특수 문자 등).

**해결 방법**:

YAML 형식 검증:

```bash
# Python으로 YAML 검증
python3 -c "import yaml; yaml.safe_load(open('~/.claude/agents/planner.md'))"

# 또는 yamllint 사용(설치 필요)
pip install yamllint
yamllint ~/.claude/agents/*.md
```

**일반적인 YAML 오류**:
- 들여쓰기 불일치(YAML은 들여쓰기에 민감)
- 콜론 뒤 공백 누락: `name:planner` → `name: planner`
- 문자열에 이스케이프되지 않은 특수 문자 포함(콜론, 샵 등)
- Tab 들여쓰기 사용(YAML은 공백만 허용)

---

## 일반적인 문제 4: Agent 실행 시간 초과 또는 멈춤

### 증상
Agent가 실행을 시작했지만 장시간 응답 없거나 멈춤.

### 가능한 원인

#### 원인 A: 작업 복잡도 과도

**문제**: 요청된 작업이 너무 복잡하여 Agent의 처리 능력을 초과함.

**해결 방법**:

**작업을 더 작은 단계로 분할**:

```
❌ 오류: 한 번에 전체 프로젝트 처리 요청
"전체 사용자 인증 시스템을 리팩토링해 주세요. 모든 테스트와 문서 포함"

✅ 정상: 단계별 실행
1단계: /plan 사용자 인증 시스템 리팩토링
2단계: /tdd 1단계 구현(로그인 API)
3단계: /tdd 2단계 구현(회원가입 API)
...
```

**`/plan` 명령으로 먼저 계획**:

```
사용자: /plan 사용자 인증 시스템을 리팩토링해야 합니다

Agent (planner):
# Implementation Plan: Refactor User Authentication System

## Phase 1: Audit Current Implementation
- Review existing auth code
- Identify security issues
- List dependencies

## Phase 2: Design New System
- Define authentication flow
- Choose auth method (JWT, OAuth, etc.)
- Design API endpoints

## Phase 3: Implement Core Features
[상세 단계...]

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

#### 원인 B: 모델 선택 부적절

**문제**: 작업 복잡도가 높지만 약한 모델 사용(예: `opus` 대신 `sonnet`).

**해결 방법**:

Agent의 `model` 필드 확인:

```bash
# 모든 Agent가 사용하는 모델 확인
grep "^model:" ~/.claude/agents/*.md
```

**권장 구성**:
- **추론 집약형 작업**(예: `planner`, `architect`): `opus` 사용
- **코드 생성/수정**(예: `tdd-guide`, `code-reviewer`): `opus` 사용
- **단순 작업**(예: `refactor-cleaner`): `sonnet` 사용 가능

**모델 구성 수정**:

Agent 파일 편집:

```markdown
---
name: my-custom-agent
description: Custom agent for...
tools: Read, Write, Edit, Bash, Grep
model: opus  # 복잡한 작업 성능 향상을 위해 opus 사용
---
```

#### 원인 C: 파일 읽기 과다

**문제**: Agent가 많은 파일을 읽어 Token 제한을 초과함.

**해결 방법**:

**Agent가 읽는 파일 범위 제한**:

```
❌ 오류: Agent에 전체 프로젝트 읽기 요청
"프로젝트의 모든 파일을 읽고 아키텍처를 분석하세요"

✅ 정상: 관련 파일 지정
"src/auth/ 디렉토리의 파일을 읽고 인증 시스템 아키텍처를 분석하세요"
```

**Glob 패턴으로 정확한 일치**:

```
사용자: 성능 최적화를 도와주세요

Agent는 다음을 수행해야 함:
# Glob로 성능 핵심 파일 찾기
Glob pattern="**/*.{ts,tsx}" path="src/api"

# 다음 대신
Glob pattern="**/*" path="."  # 모든 파일 읽기
```

---

## 일반적인 문제 5: Agent 출력이 기대와 다름

### 증상
Agent가 호출되고 실행되었지만 출력이 기대와 다르거나 품질이 낮음.

### 가능한 원인

#### 원인 A: 작업 설명 불명확

**문제**: 사용자 요청이 모호하여 Agent가 요구사항을 정확히 이해하지 못함.

**해결 방법**:

**명확하고 구체적인 작업 설명 제공**:

```
❌ 오류: 모호한 요청
"코드를 최적화해 주세요"

✅ 정상: 구체적인 요청
"src/api/markets.ts의 searchMarkets 함수를 최적화해 주세요.
쿼리 성능을 개선하고, 응답 시간을 500ms에서 100ms 미만으로 낮추는 것이 목표입니다"
```

**다음 정보 포함**:
- 구체적인 파일 또는 함수명
- 명확한 목표(성능, 보안, 가독성 등)
- 제약 조건(기존 기능 파괴 금지, 호환성 유지 필수 등)

#### 원인 B: 컨텍스트 부족

**문제**: Agent에 필요한 컨텍스트 정보가 부족하여 올바른 결정을 내리지 못함.

**해결 방법**:

**배경 정보 능동적 제공**:

```
사용자: 테스트 실패를 도와주세요

❌ 오류: 컨텍스트 없음
"npm test 오류가 발생했습니다. 수정해 주세요"

✅ 정상: 완전한 컨텍스트 제공
"npm test 실행 시 searchMarkets 테스트가 실패했습니다.
오류 메시지: Expected 5 but received 0.
방금 vectorSearch 함수를 수정했는데, 이와 관련이 있을 수 있습니다.
문제를 찾아 수정해 주세요."
```

**Skills로 도메인 지식 제공**:

프로젝트에 특정 스킬 라이브러리(`~/.claude/skills/`)가 있는 경우 Agent가 자동으로 관련 지식을 로드합니다.

#### 원인 C: Agent 전문 분야 불일치

**문제**: 작업에 부적절한 Agent 사용.

**해결 방법**:

**작업 유형에 따라 올바른 Agent 선택**:

| 작업 유형 | 권장 사용 | Command |
|--- | --- | ---|
| 새 기능 구현 | `tdd-guide` | `/tdd` |
| 복잡한 기능 계획 | `planner` | `/plan` |
| 코드 리뷰 | `code-reviewer` | `/code-review` |
| 보안 감사 | `security-reviewer` | 수동 호출 |
| 빌드 오류 수정 | `build-error-resolver` | `/build-fix` |
| E2E 테스트 | `e2e-runner` | `/e2e` |
| 데드 코드 정리 | `refactor-cleaner` | `/refactor-clean` |
| 문서 업데이트 | `doc-updater` | `/update-docs` |
| 시스템 아키텍처 설계 | `architect` | 수동 호출 |

**[Agent 개요](../../platforms/agents-overview/)를 확인하여 각 Agent의 책임 이해**.

---

## 일반적인 문제 6: Agent 도구 권한 부족

### 증상
Agent가 특정 도구를 사용하려 할 때 거부되고 "Tool not available: xxx" 오류 표시.

### 가능한 원인

#### 원인 A: Tools 필드에 도구 누락

**문제**: Agent Front Matter의 `tools` 필드에 필요한 도구가 포함되지 않음.

**해결 방법**:

Agent의 `tools` 필드 확인:

```bash
# Agent가 사용할 수 있는 도구 확인
grep -A 1 "^tools:" ~/.claude/agents/planner.md
```

**도구가 누락된 경우**, `tools` 필드에 추가:

```markdown
---
name: my-custom-agent
description: Agent that needs to write code
tools: Read, Write, Edit, Grep, Glob  # Write와 Edit 포함 확인
model: opus
---
```

**도구 사용 시나리오**:
- `Read`: 파일 내용 읽기(거의 모든 Agent 필요)
- `Write`: 새 파일 생성
- `Edit`: 기존 파일 편집
- `Bash`: 명령 실행(테스트 실행, 빌드 등)
- `Grep`: 파일 내용 검색
- `Glob`: 파일 경로 찾기

#### 원인 B: 도구 이름 철자 오류

**문제**: `tools` 필드에 잘못된 도구 이름 사용됨.

**해결 방법**:

**도구 이름 철자 검증**(대소문자 구분):

| ✅ 정상 | ❌ 오류 |
|--- | ---|
| `Read` | `read`, `READ` |
| `Write` | `write`, `WRITE` |
| `Edit` | `edit`, `EDIT` |
| `Bash` | `bash`, `BASH` |
| `Grep` | `grep`, `GREP` |
| `Glob` | `glob`, `GLOB` |

---

## 일반적인 문제 7: Proactive Agent가 자동으로 트리거되지 않음

### 증상
일부 Agent는 자동으로 트리거되어야 함(예: 코드 수정 후 `code-reviewer` 자동 호출)하지만 그렇지 않음.

### 가능한 원인

#### 원인 A: 트리거 조건 불충족

**문제**: Agent 설명에 `Use PROACTIVELY`로 표시되었지만 트리거 조건이 충족되지 않음.

**해결 방법**:

Agent의 `description` 필드 확인:

```bash
# Agent 설명 확인
grep "^description:" ~/.claude/agents/code-reviewer.md
```

**예시(code-reviewer)**:

```markdown
description: Reviews code for quality, security, and maintainability. Use PROACTIVELY when users write or modify code.
```

**Proactive 트리거 조건**:
- 사용자가 명시적으로 코드 리뷰 요청
- 코드 작성/수정 완료 직후
- 코드 커밋 준비 전

**수동 트리거**:

자동 트리거가 작동하지 않는 경우 수동으로 호출:

```
사용자: 방금 작성한 코드를 리뷰해 주세요

또는 Command 사용:
사용자: /code-review
```

---

## 진단 도구 및 기술

### Agent 로드 상태 확인

Claude Code가 모든 Agent를 올바르게 로드했는지 확인:

```bash
# Claude Code 로그 확인(가능한 경우)
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log | grep -i agent

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait | Select-String "agent"
```

### Agent 수동 테스트

Claude Code에서 Agent 호출 수동 테스트:

```
사용자: planner agent를 호출하여 새 기능 계획을 도와주세요

# Agent가 올바르게 호출되는지 관찰
# 출력이 기대와 일치하는지 확인
```

### Front Matter 형식 검증

Python으로 모든 Agent의 Front Matter 검증:

```bash
#!/bin/bash

for file in ~/.claude/agents/*.md; do
    echo "Validating $file..."
    python3 << EOF
import yaml
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        # Extract front matter (between ---)
        start = content.find('---')
        end = content.find('---', start + 3)
        if start == -1 or end == -1:
            print("Error: No front matter found")
            sys.exit(1)
        
        front_matter = content[start + 3:end].strip()
        metadata = yaml.safe_load(front_matter)
        
        # Check required fields
        required = ['name', 'description', 'tools']
        for field in required:
            if field not in metadata:
                print(f"Error: Missing required field '{field}'")
                sys.exit(1)
        
        print("✅ Valid")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF
done
```

`validate-agents.sh`로 저장 후 실행:

```bash
chmod +x validate-agents.sh
./validate-agents.sh
```

---

## 체크리스트 ✅

다음 목록을 하나씩 확인:

- [ ] Agent 파일이 올바른 위치에 있음(`~/.claude/agents/` 또는 `.claude/agents/`)
- [ ] Command 파일이 올바른 위치에 있음(`~/.claude/commands/` 또는 `.claude/commands/`)
- [ ] Agent Front Matter 형식이 올바름(name, description, tools 포함)
- [ ] Tools 필드에 올바른 도구 이름 사용될(대소문자 구분)
- [ ] Command의 `invokes` 필드가 Agent 파일명과 일치
- [ ] 플러그인이 `~/.claude/settings.json`에서 올바르게 활성화됨
- [ ] 작업 설명이 명확하고 구체적임
- [ ] 작업에 적절한 Agent 선택됨

---

## 도움이 필요한 경우

위의 방법으로 문제를 해결할 수 없는 경우:

1. **진단 정보 수집**:
   ```bash
   # 다음 정보 출력
   echo "Claude Code version: $(claude-code --version 2>/dev/null || echo 'N/A')"
   echo "Agent files:"
   ls -la ~/.claude/agents/
   echo "Command files:"
   ls -la ~/.claude/commands/
   echo "Plugin config:"
   cat ~/.claude/settings.json | jq '.enabledPlugins'
   ```

2. **GitHub Issues 확인**:
   - [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues) 방문
   - 유사한 문제 검색

3. **Issue 제출**:
   - 완전한 오류 메시지 포함
   - 운영체제 및 버전 정보 제공
   - 관련 Agent 및 Command 파일 내용 첨부

---

## 수업 요약

Agent 호출 실패는 일반적으로 다음과 같은 원인이 있습니다:

| 문제 유형 | 일반적인 원인 | 빠른 문제 해결 |
|--- | --- | ---|
| **전혀 호출되지 않음** | Agent/Command 파일 경로 오류, 플러그인 미로드 | 파일 위치 확인, 플러그인 구성 검증 |
| **Agent not found** | 이름 불일치(Command invokes vs 파일명) | 파일명 및 invokes 필드 검증 |
| **형식 오류** | Front Matter 필드 누락, YAML 구문 오류 | 필수 필드 확인, YAML 형식 검증 |
| **실행 시간 초과** | 작업 복잡도 과도, 모델 선택 부적절 | 작업 분할, opus 모델 사용 |
| **출력이 기대와 다름** | 작업 설명 불명확, 컨텍스트 부족, Agent 불일치 | 구체적인 작업 제공, 올바른 Agent 선택 |
| **도구 권한 부족** | Tools 필드에 도구 누락, 이름 철자 오류 | tools 필드 확인, 도구 이름 검증 |

기억하세요: 대부분의 문제는 파일 경로 확인, Front Matter 형식 검증, 올바른 Agent 선택으로 해결할 수 있습니다.

---

## 다음 수업 예고

> 다음 수업에서는 **[성능 최적화 팁](../performance-tips/)**을 학습합니다.
>
> 다음을 배우게 됩니다:
> - Token 사용 최적화 방법
> - Claude Code 응답 속도 향상
> - 컨텍스트 윈도우 관리 전략

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능             | 파일 경로                                                                                    | 행 번호    |
|--- | --- | ---|
| 플러그인 매니페스트 구성     | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28    |
| Planner Agent    | [`agents/planner.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120   |
| TDD Guide Agent  | [`agents/tdd-guide.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281   |
| Code Reviewer Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-281   |
| Plan Command     | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114   |
| TDD Command      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-281   |
| Agent 사용 규칙    | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50    |

**Front Matter 필수 필드**(모든 Agent 파일):
- `name`: Agent 식별자(파일명과 일치해야 하며 `.md` 확장자 제외)
- `description`: Agent 기능 설명(트리거 조건 설명 포함)
- `tools`: 허용된 도구 목록(쉼표로 구분: `Read, Grep, Glob`)
- `model`: 선호 모델(`opus` 또는 `sonnet`, 선택적)

**허용된 도구 이름**(대소문자 구분):
- `Read`: 파일 내용 읽기
- `Write`: 새 파일 생성
- `Edit`: 기존 파일 편집
- `Bash`: 명령 실행
- `Grep`: 파일 내용 검색
- `Glob`: 파일 경로 찾기

**핵심 구성 경로**:
- 사용자 수준 Agents: `~/.claude/agents/`
- 사용자 수준 Commands: `~/.claude/commands/`
- 사용자 수준 Settings: `~/.claude/settings.json`
- 프로젝트 수준 Agents: `.claude/agents/`
- 프로젝트 수준 Commands: `.claude/commands/`

**플러그인 로드 구성**(`~/.claude/settings.json`):
```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

</details>
