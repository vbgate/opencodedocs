---
title: "기여 가이드: 설정 제출 | Everything Claude Code"
sidebarTitle: "첫 번째 설정 제출"
subtitle: "기여 가이드: 설정 제출"
description: "Everything Claude Code에 설정을 제출하는 표준 프로세스를 학습하세요. 프로젝트 Fork, 브랜치 생성, 형식 준수, 로컬 테스트, PR 제출 단계를 마스터하여 기여자가 되세요."
tags:
  - "contributing"
  - "agents"
  - "skills"
  - "commands"
  - "hooks"
  - "rules"
  - "mcp"
  - "github"
prerequisite:
  - "start-installation"
  - "start-quickstart"
order: 230
---

# 기여 가이드: 프로젝트에 설정, Agent, Skill 기여하는 방법

## 학습 후 할 수 있는 것

- 프로젝트의 기여 프로세스와 표준 이해
- Agents, Skills, Commands, Hooks, Rules, MCP 구성 올바르게 제출
- 코드 스타일 및 명명 규칙 준수
- 일반적인 기여 오류 방지
- Pull Request를 통한 효율적인 커뮤니티 협력

## 현재 직면한 문제

Everything Claude Code에 기여하고 싶지만 다음 문제에 직면해 있습니다:
- "어떤 내용을 기여해야 가치 있는지 모르겠다"
- "첫 번째 PR을 어떻게 시작해야 할지 모르겠다"
- "파일 형식과 명명 규칙이 명확하지 않다"
- "제출한 내용이 요구사항을 충족하지 않을까 걱정된다"

이 튜토리얼은 이념에서 실천까지 완전한 기여 가이드를 제공합니다.

## 핵심 아이디어

Everything Claude Code는 **커뮤니티 리소스**이며, 한 사람의 프로젝트가 아닙니다. 이 저장소의 가치는 다음과 같습니다:

1. **실전 검증** - 모든 구성은 10개월 이상의 프로덕션 환경 사용을 거쳤습니다
2. **모듈형 설계** - 각 Agent, Skill, Command는 독립적으로 재사용 가능한 컴포넌트입니다
3. **품질 우선** - 코드 검토 및 보안 감사로 기여 품질을 보장합니다
4. **개방형 협력** - MIT 라이선스, 기여와 커스터마이징을 장려합니다

::: tip 기여의 가치
- **지식 공유**: 귀하의 경험이 다른 개발자들을 도울 수 있습니다
- **영향력**: 수백/수천 명이 사용하는 구성
- **기술 향상**: 프로젝트 구조와 커뮤니티 협력 학습
- **네트워크 구축**: Anthropic 및 Claude Code 커뮤니티와 연결
:::

## 우리가 찾고 있는 것

### Agents

특정 도메인의 복잡한 작업을 처리하는 전문화된 하위 에이전트:

| 유형 | 예시 |
|--- | ---|
| 언어 전문가 | Python, Go, Rust 코드 리뷰 |
| 프레임워크 전문가 | Django, Rails, Laravel, Spring |
| DevOps 전문가 | Kubernetes, Terraform, CI/CD |
| 도메인 전문가 | ML pipelines, data engineering, mobile |

### Skills

워크플로우 정의 및 도메인 지식 베이스:

| 유형 | 예시 |
|--- | ---|
| 언어 모범 사례 | Python, Go, Rust 코딩 표준 |
| 프레임워크 패턴 | Django, Rails, Laravel 아키텍처 패턴 |
| 테스트 전략 | 단위 테스트, 통합 테스트, E2E 테스트 |
| 아키텍처 가이드 | 마이크로서비스, 이벤트 기반, CQRS |
| 도메인 지식 | ML, 데이터 분석, 모바일 개발 |

### Commands

슬래시 명령, 빠른 워크플로우 진입점 제공:

| 유형 | 예시 |
|--- | ---|
| 배포 명령 | Vercel, Railway, AWS에 배포 |
| 테스트 명령 | 단위 테스트 실행, E2E 테스트, 커버리지 분석 |
| 문서 명령 | API 문서 생성, README 업데이트 |
| 코드 생성 명령 | 타입 생성, CRUD 템플릿 생성 |

### Hooks

자동화 훅, 특정 이벤트 발생 시 트리거:

| 유형 | 예시 |
|--- | ---|
| Linting/formatting | 코드 포맷팅, lint 검사 |
| 보안 검사 | 민감 데이터 탐지, 취약점 스캔 |
| 검증 훅 | Git commit 검증, PR 검사 |
| 알림 훅 | Slack/Email 알림 |

### Rules

강제 규칙, 코드 품질과 보안 표준 보장:

| 유형 | 예시 |
|--- | ---|
| 보안 규칙 | 하드코딩된 키 금지, OWASP 검사 |
| 코드 스타일 | 불변 패턴, 파일 크기 제한 |
| 테스트 요구사항 | 80%+ 커버리지, TDD 프로세스 |
| 명명 규칙 | 변수 명명, 파일 명명 |

### MCP Configurations

MCP 서버 구성, 외부 서비스 통합 확장:

| 유형 | 예시 |
|--- | ---|
| 데이터베이스 통합 | PostgreSQL, MongoDB, ClickHouse |
| 클라우드 공급자 | AWS, GCP, Azure |
| 모니터링 도구 | Datadog, New Relic, Sentry |
| 통신 도구 | Slack, Discord, Email |

## 기여하는 방법

### 1단계: 프로젝트 Fork

**이유**: 원본 저장소에 영향을 주지 않고 수정을 위한 본인만의 사본이 필요합니다.

```bash
# 1. https://github.com/affaan-m/everything-claude-code 방문
# 2. 오른쪽 상단 "Fork" 버튼 클릭
# 3. Fork한 저장소 클론
git clone https://github.com/YOUR_USERNAME/everything-claude-code.git
cd everything-claude-code

# 4. 업스트림 저장소 추가 (이후 동기화 편의)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
```

**확인해야 할 것**: 전체 프로젝트 파일을 포함하는 로컬 `everything-claude-code` 디렉토리.

### 2단계: 기능 브랜치 생성

**이유**: 브랜치는 수정 사항을 격리하여 관리와 병합을 용이하게 합니다.

```bash
# 설명적인 브랜치 이름 생성
git checkout -b add-python-reviewer

# 또는 더 구체적인 명명 사용
git checkout -b feature/django-pattern-skill
git checkout -b fix/hook-tmux-reminder
```

**브랜치 명명 규칙**:
- `feature/` - 새 기능
- `fix/` - 버그 수정
- `docs/` - 문서 업데이트
- `refactor/` - 코드 리팩토링

### 3단계: 기여 내용 추가

**이유**: 파일을 올바른 디렉토리에 배치하여 Claude Code가 올바르게 로드하도록 합니다.

```bash
# 기여 유형에 따라 디렉토리 선택
agents/           # 새 Agent
skills/           # 새 Skill (단일 .md 또는 디렉토리 가능)
commands/         # 새 슬래시 명령
rules/            # 새 규칙 파일
hooks/            # Hook 구성 (hooks/hooks.json 수정)
mcp-configs/      # MCP 서버 구성 (mcp-configs/mcp-servers.json 수정)
```

::: tip 디렉토리 구조
- **단일 파일**: 디렉토리에 직접 배치, 예: `agents/python-reviewer.md`
- **복잡한 컴포넌트**: 하위 디렉토리 생성, 예: `skills/coding-standards/` (여러 파일 포함)
:::

### 4단계: 형식 규칙 준수

#### Agent 형식

**이유**: Front Matter는 Agent의 메타데이터를 정의하며, Claude Code는 이 정보에 의존하여 Agent를 로드합니다.

```markdown
---
name: python-reviewer
description: Reviews Python code for PEP 8 compliance, type hints, and best practices
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---

You are a senior Python code reviewer...

Your review should cover:
- PEP 8 style compliance
- Type hints usage
- Docstring completeness
- Security best practices
- Performance optimizations
```

**필수 필드**:
- `name`: Agent 식별자 (소문자 하이픈)
- `description`: 기능 설명
- `tools`: 허용된 도구 목록 (쉼표로 구분)
- `model`: 선호 모델 (`opus` 또는 `sonnet`)

#### Skill 형식

**이유**: 명확한 Skill 정의는 재사용과 이해가 쉽습니다.

```markdown
# Python Best Practices

## When to Use

Use this skill when:
- Writing new Python code
- Reviewing Python code
- Refactoring Python modules

## How It Works

Follow these principles:

1. **Type Hints**: Always include type hints for function parameters and return values
2. **Docstrings**: Use Google style docstrings for all public functions
3. **PEP 8**: Follow PEP 8 style guide
4. **Immutability**: Prefer immutable data structures

## Examples

### Good
```python
def process_user_data(user_id: str) -> dict:
    """Process user data and return result.

    Args:
        user_id: The user ID to process

    Returns:
        A dictionary with processed data
    """
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```

### Bad
```python
def process_user_data(user_id):
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```
```

**권장 섹션**:
- `When to Use`: 사용 시나리오
- `How It Works`: 작동 원리
- `Examples`: 예제 (Good vs Bad)
- `References`: 관련 리소스 (선택 사항)

#### Command 형식

**이유**: 명확한 명령 설명은 사용자가 기능을 이해하는 데 도움이 됩니다.

Front Matter (필수):

```markdown
---
description: Run Python tests with coverage report
---
```

본문 내용 (선택 사항):

```markdown
# Test

Run tests for the current project:

Coverage requirements:
- Minimum 80% line coverage
- 100% coverage for critical paths
```

명령 예제 (선택 사항):

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

**필수 필드**:
- `description`: 간단한 기능 설명

#### Hook 형식

**이유**: Hook은 명확한 일치 규칙과 실행 동작이 필요합니다.

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(py)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Python file edited')\""
    }
  ],
  "description": "Triggered when Python files are edited"
}
```

**필수 필드**:
- `matcher`: 트리거 조건 표현식
- `hooks`: 실행 동작 배열
- `description`: Hook 기능 설명

### 5단계: 기여 테스트

**이유**: 구성이 실제 사용에서 정상 작동하는지 확인합니다.

::: warning 중요
PR 제출 전, **반드시** 로컬 환경에서 구성을 테스트하세요.
:::

**테스트 단계**:

```bash
# 1. Claude Code 구성에 복사
cp agents/python-reviewer.md ~/.claude/agents/
cp skills/python-patterns/* ~/.claude/skills/

# 2. Claude Code에서 테스트
# Claude Code를 시작하고 새 구성 사용

# 3. 기능 검증
# - Agent가 올바르게 호출되나요?
# - Command가 올바르게 실행되나요?
# - Hook이 올바른 시점에 트리거되나요?
```

**확인해야 할 것**: Claude Code에서 구성이 정상 작동하고 오류나 예외가 없습니다.

### 6단계: PR 제출

**이유**: Pull Request는 커뮤니티 협력의 표준 방식입니다.

```bash
# 모든 변경 추가
git add .

# 커밋 (명확한 커밋 메시지 사용)
git commit -m "Add Python code reviewer agent

- Implements PEP 8 compliance checks
- Adds type hints validation
- Includes security best practices
- Tested on real Python projects"

# fork로 푸시
git push origin add-python-reviewer
```

**그 다음 GitHub에서 PR 생성**:

1. fork 저장소 방문
2. "Compare & pull request" 클릭
3. PR 템플릿 작성:

```markdown
## What you added
- [ ] Description of what you added

## Why it's useful
- [ ] Why this contribution is valuable

## How you tested it
- [ ] Testing steps you performed

## Related issues
- [ ] Link to any related issues
```

**확인해야 할 것**: PR이 성공적으로 생성되고 유지 관리자의 검토를 기다립니다.

## 지침 원칙

### Do (해야 할 것)

✅ **구성을 집중적이고 모듈형으로 유지**
- 각 Agent/Skill은 한 가지 작업만 수행
- 기능 혼합 방지

✅ **명확한 설명 포함**
- Front Matter 설명 정확
- 코드 주석 도움이 됨

✅ **제출 전 테스트**
- 로컬에서 구성 검증
- 오류가 없는지 확인

✅ **기존 패턴 준수**
- 기존 파일 형식 참고
- 코드 스타일 일관성 유지

✅ **종속성 문서화**
- 외부 종속성 나열
- 설치 요구사항 설명

### Don't (하면 안 되는 것)

❌ **민감한 데이터 포함**
- API keys, tokens
- 하드코딩된 경로
- 개인 자격 증명

❌ **지나치게 복잡하거나 틈새 시장용 구성 추가**
- 범용성 우선
- 과도 설계 피하기

❌ **테스트되지 않은 구성 제출**
- 테스트는 필수
- testing steps 제공

❌ **중복 기능 생성**
- 기존 구성 검색
- 이미 있는 것을 다시 만들지 않기

❌ **특정 유료 서비스에 의존하는 구성 추가**
- 무료 대안 제공
- 또는 오픈 소스 도구 사용

## 파일 명명 규칙

**이유**: 통일된 명명 규칙은 프로젝트 유지보수를 쉽게 만듭니다.

### 명명 규칙

| 규칙 | 예시 |
|--- | ---|
| 소문자 사용 | `python-reviewer.md` |
| 하이픈으로 구분 | `tdd-workflow.md` |
| 설명적 명명 | `django-pattern-skill.md` |
| 모호한 이름 피하기 | ❌ `workflow.md` → ✅ `tdd-workflow.md` |

### 일치 원칙

파일 이름은 Agent/Skill/Command 이름과 일치해야 합니다:

```bash
# Agent
agents/python-reviewer.md          # name: python-reviewer

# Skill
skills/django-patterns/SKILL.md    # # Django Patterns

# Command
commands/test.md                   # # Test
```

::: tip 명명 팁
- 업계 용어 사용 (예: "PEP 8", "TDD", "REST")
- 약어 피하기 (표준 약어 제외)
- 간결하지만 설명적으로 유지
:::

## 기여 프로세스 체크리스트

PR 제출 전 다음 조건이 충족되는지 확인하세요:

### 코드 품질
- [ ] 기존 코드 스타일 준수
- [ ] 필수 Front Matter 포함
- [ ] 명확한 설명과 문서 포함
- [ ] 로컬 테스트 통과

### 파일 규칙
- [ ] 파일 이름이 명명 규칙에 맞음
- [ ] 파일이 올바른 디렉토리에 있음
- [ ] JSON 형식 올바름 (해당하는 경우)
- [ ] 민감한 데이터 없음

### PR 품질
- [ ] PR 제목이 변경 사항을 명확히 설명
- [ ] PR 설명에 "What", "Why", "How" 포함
- [ ] 관련 issue 링크 (있는 경우)
- [ ] testing steps 제공

### 커뮤니티 규칙
- [ ] 중복 기능이 없는지 확인
- [ ] 대안 제공 (유료 서비스 관련인 경우)
- [ ] review 의견에 응답
- [ ] 친절하고 건설적인 토론 유지

## 자주 묻는 질문

### Q: 어떤 기여가 가치 있는지 어떻게 알 수 있나요?

**A**: 본인의 필요에서 시작하세요:
- 최근 어떤 문제에 직면했나요?
- 어떤 해결책을 사용했나요?
- 이 해결책을 재사용할 수 있나요?

프로젝트 Issues도 확인할 수 있습니다:
- 해결되지 않은 feature requests
- Enhancement suggestions
- Bug reports

### Q: 기여가 거절될 수 있나요?

**A**: 가능하지만 이것은 정상입니다. 일반적인 이유:
- 기능이 이미 존재
- 구성이 규칙에 맞지 않음
- 테스트 부족
- 보안 또는 개인정보 문제

유지 관리자는 상세한 피드백을 제공하며, 피드백에 따라 수정 후 재제출할 수 있습니다.

### Q: PR 상태를 어떻게 추적하나요?

**A**:
1. GitHub PR 페이지에서 상태 확인
2. review comments 주목
3. 유지 관리자 피드백에 응답
4. 필요에 따라 PR 업데이트

### Q: 버그 수정을 기여할 수 있나요?

**A**: 물론입니다! 버그 수정은 가장 가치 있는 기여 중 하나입니다:
1. Issues에서 검색하거나 새 issue 생성
2. 프로젝트 Fork하고 버그 수정
3. 테스트 추가 (필요한 경우)
4. PR 제출, 설명에 issue 인용

### Q: fork를 업스트림과 어떻게 동기화하나요?

**A**:

```bash
# 1. 업스트림 저장소 추가 (아직 없는 경우)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git

# 2. 업스트림 업데이트 가져오기
git fetch upstream

# 3. 업스트림 업데이트를 main 브랜치에 병합
git checkout main
git merge upstream/main

# 4. 업데이트를 fork로 푸시
git push origin main

# 5. 최신 main 브랜치 기반으로 재베이스
git checkout your-feature-branch
git rebase main
```

## 연락처

질문이나 도움이 필요한 경우:

- **Open an Issue**: [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)
- **Twitter**: [@affaanmustafa](https://x.com/affaanmustafa)
- **Email**: GitHub를 통해 연락

::: tip 질문 팁
- 기존 Issues와 Discussions 먼저 검색
- 명확한 컨텍스트와 재현 단계 제공
- 예의 바르고 건설적 유지
:::

## 수업 요약

이 수업에서는 Everything Claude Code의 기여 프로세스와 표준을 체계적으로 설명했습니다:

**핵심 이념**:
- 커뮤니티 리소스, 공동 건설
- 실전 검증, 품질 우선
- 모듈형 설계, 재사용 용이
- 개방형 협력, 지식 공유

**기여 유형**:
- **Agents**: 전문화된 하위 에이전트 (언어, 프레임워크, DevOps, 도메인 전문가)
- **Skills**: 워크플로우 정의 및 도메인 지식 베이스
- **Commands**: 슬래시 명령 (배포, 테스트, 문서, 코드 생성)
- **Hooks**: 자동화 훅 (linting, 보안 검사, 검증, 알림)
- **Rules**: 강제 규칙 (보안, 코드 스타일, 테스트, 명명)
- **MCP Configurations**: MCP 서버 구성 (데이터베이스, 클라우드, 모니터링, 통신)

**기여 프로세스**:
1. 프로젝트 Fork
2. 기능 브랜치 생성
3. 기여 내용 추가
4. 형식 규칙 준수
5. 로컬 테스트
6. PR 제출

**형식 규칙**:
- Agent: Front Matter + 설명 + 지시
- Skill: When to Use + How It Works + Examples
- Command: Description + 사용 예제
- Hook: Matcher + Hooks + Description

**지침 원칙**:
- **Do**: 집중, 명확, 테스트, 패턴 준수, 문서화
- **Don't**: 민감 데이터, 복잡한 틈새, 미테스트, 중복, 유료 종속성

**파일 명명**:
- 소문자 + 하이픈
- 설명적 명명
- Agent/Skill/Command 이름과 일치

**체크리스트**:
- 코드 품질, 파일 규칙, PR 품질, 커뮤니티 규칙

## 다음 수업 예고

> 다음 수업에서는 **[예제 구성: 프로젝트 수준 및 사용자 수준 구성](../examples/)**을 학습합니다.
>
> 학습할 내용:
> > - 프로젝트 수준 구성의 모범 사례
> > - 사용자 수준 구성의 개인화 설정
> > - 특정 프로젝트에 맞게 구성 사용자 정의
> > - 실제 프로젝트 구성 예제

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능          | 파일路径                                                                                     | 행번호  |
|--- | --- | ---|
| 기여 가이드      | [`CONTRIBUTING.md`](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md)           | 1-192 |
| Agent 예제    | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | -     |
| Skill 예제    | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | -     |
| Command 예제  | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)           | -     |
| Hook 구성     | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json)     | 1-158 |
| Rule 예제     | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | -     |
| MCP 구성 예제  | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92  |
| 예제 구성      | [`examples/CLAUDE.md`](https://github.com/affaan-m/everything-claude-code/blob/main/examples/CLAUDE.md) | -     |

**핵심 Front Matter 필드**:
- `name`: Agent/Skill/Command 식별자
- `description`: 기능 설명
- `tools`: 허용된 도구 (Agent)
- `model`: 선호 모델 (Agent, 선택 사항)

**핵심 디렉토리 구조**:
- `agents/`: 9개 전문화된 하위 에이전트
- `skills/`: 11개 워크플로우 정의
- `commands/`: 14개 슬래시 명령
- `rules/`: 8세트 규칙
- `hooks/`: 자동화 훅 구성
- `mcp-configs/`: MCP 서버 구성
- `examples/`: 예제 구성 파일

**기여 관련 링크**:
- GitHub Issues: https://github.com/affaan-m/everything-claude-code/issues
- Twitter: https://x.com/affaanmustafa

</details>
