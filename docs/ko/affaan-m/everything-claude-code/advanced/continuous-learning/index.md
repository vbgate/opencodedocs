---
title: "지속적 학습: 자동 패턴 추출 | Everything Claude Code"
sidebarTitle: "Claude Code를 더 똑똑하게 만들기"
subtitle: "지속적 학습: 재사용 가능한 패턴 자동 추출"
description: "Everything Claude Code의 지속적 학습 메커니즘을 배웁니다. /learn으로 패턴 추출, 자동 평가 설정, Stop hook 구성을 통해 Claude Code가 경험을 축적하고 개발 효율성을 높이는 방법을 알아봅니다."
tags:
  - "continuous-learning"
  - "knowledge-extraction"
  - "automation"
prerequisite:
  - "start-quick-start"
  - "platforms-commands-overview"
order: 100
---

# 지속적 학습 메커니즘: 재사용 가능한 패턴 자동 추출

## 이 강의를 마치면 할 수 있는 것

- `/learn` 명령어로 세션에서 재사용 가능한 패턴을 수동 추출
- continuous-learning skill을 설정하여 세션 종료 시 자동 평가
- Stop hook을 설정하여 패턴 추출 자동 트리거
- 추출된 패턴을 learned skills로 저장하여 향후 세션에서 재사용
- 추출 임계값, 세션 길이 요구사항 등 매개변수 설정

## 현재 겪고 있는 어려움

Claude Code로 개발할 때 이런 상황을 겪어본 적 있나요?

- 복잡한 문제를 해결했는데, 다음에 비슷한 문제를 만나면 다시 처음부터 시작
- 특정 프레임워크의 디버깅 기법을 배웠는데, 시간이 지나면 잊어버림
- 프로젝트의 특정 코딩 규칙을 발견했지만, 체계적으로 기록할 방법이 없음
- workaround 방법을 찾았는데, 다음에 비슷한 문제를 만나면 기억이 안 남

이런 문제들로 인해 경험과 지식이 효과적으로 축적되지 않고, 매번 처음부터 시작하게 됩니다.

## 언제 이 방법을 사용하나요

지속적 학습 메커니즘을 사용하는 상황:

- **복잡한 문제 해결 시**: 오랜 시간 디버깅한 버그의 해결 방법을 기억해야 할 때
- **새 프레임워크 학습 시**: 프레임워크의 quirks나 모범 사례를 발견했을 때
- **프로젝트 개발 중반**: 프로젝트 특유의 규칙과 패턴을 점차 발견할 때
- **코드 리뷰 후**: 새로운 보안 검사 방법이나 코딩 규칙을 배웠을 때
- **성능 최적화 시**: 효과적인 최적화 기법이나 도구 조합을 찾았을 때

::: tip 핵심 가치
지속적 학습 메커니즘은 Claude Code를 사용할수록 더 똑똑하게 만듭니다. 경험 많은 멘토처럼 문제 해결 과정에서 유용한 패턴을 자동으로 기록하고, 향후 비슷한 상황에서 제안을 제공합니다.
:::

## 핵심 개념

지속적 학습 메커니즘은 세 가지 핵심 구성요소로 이루어져 있습니다:

```
1. /learn 명령어     → 수동 추출: 언제든 실행하여 현재 가치 있는 패턴 저장
2. Continuous Learning Skill → 자동 평가: Stop hook 트리거로 세션 분석
3. Learned Skills   → 지식 베이스: 패턴 저장, 향후 자동 로드
```

**작동 원리**:

- **수동 추출**: 복잡한 문제를 해결한 후, `/learn`을 사용하여 패턴을 직접 추출
- **자동 평가**: 세션 종료 시, Stop hook 스크립트가 세션 길이를 확인하고 Claude에게 평가 요청
- **지식 축적**: 추출된 패턴은 learned skills로 `~/.claude/skills/learned/` 디렉토리에 저장
- **향후 재사용**: Claude Code가 향후 세션에서 이러한 skills를 자동으로 로드

**Stop hook을 선택한 이유**:

- **경량**: 세션 종료 시 한 번만 실행되어 상호작용 응답 속도에 영향 없음
- **완전한 컨텍스트**: 전체 세션 기록에 접근 가능하여 가치 있는 패턴을 더 쉽게 발견
- **비차단**: 메시지를 보낼 때마다 실행되지 않아 지연 시간 증가 없음

## 🎒 시작하기 전 준비

지속적 학습 메커니즘을 사용하기 전에 확인하세요:

- ✅ Everything Claude Code 플러그인 설치 완료
- ✅ [핵심 Commands 상세 설명](../../platforms/commands-overview/)에서 `/learn` 명령어 이해
- ✅ [Hooks 자동화](../hooks-automation/)에서 Stop hook 개념 이해

::: warning 사전 조건
이 튜토리얼은 Claude Code의 기본 작업과 hooks 개념에 익숙하다고 가정합니다. 아직 설치를 완료하지 않았다면 먼저 [빠른 시작](../../start/quickstart/)을 읽어주세요.
:::

## 따라하기: 완전한 지속적 학습 흐름

실제 예제를 통해 전체 흐름을 배워봅시다. TypeScript 타입 오류를 디버깅하다가 마침내 해결책을 찾았다고 가정합니다.

### 1단계: /learn으로 패턴 수동 추출

**왜 필요한가**
수동 추출은 방금 해결한 중요한 문제에 적합하며, 즉시 저장하여 잊어버리는 것을 방지합니다.

**작업**
Claude Code에서 입력:

```
/learn
```

**예상 결과**
Claude가 현재 세션을 분석하고 추출 가능한 패턴이 있는지 물어봅니다:

```markdown
현재 세션을 분석한 결과, 다음과 같은 추출 가능한 패턴을 발견했습니다:

1. TypeScript 타입 오류: 제네릭 제약으로 해결
   - 문제 설명: 함수 매개변수 타입 추론 오류
   - 해결 방법: 명시적 제네릭 제약 `<T extends ...>` 추가
   - 적용 상황: 복잡한 타입 추론, 콜백 함수

이 패턴들을 추출하시겠습니까? (yes/no/skip)
```

**체크포인트 ✅**
- Claude가 해결한 문제를 인식했는가
- 추출된 패턴 설명이 정확한가
- 적용 상황이 합리적인가

**다음 단계**
패턴이 정확하면 `yes`로 응답합니다. 수정이 필요하면 구체적인 변경 사항을 설명합니다.

---

### 2단계: learned skill로 저장

**왜 필요한가**
skill 파일로 저장하면 향후 세션에서 이 지식을 자동으로 로드할 수 있습니다.

**작업**
추출을 확인하면 Claude가 skill 파일을 생성합니다:

```markdown
패턴을 저장할 위치: ~/.claude/skills/learned/typescript-generic-constraints.md

# TypeScript Generic Constraints

**Extracted:** 2026-01-25
**Context:** 복잡한 타입 추론 문제 해결

## Problem
TypeScript 함수 매개변수 타입 추론이 올바르지 않아 타입 오류 발생.

## Solution
명시적 제네릭 제약 `<T extends ...>`를 추가하여 타입 관계를 명확히 함.

## Example
```typescript
// Before
function process(data) { ... }  // 타입 추론 실패

// After
function process<T extends Record<string, unknown>>(data: T) { ... }
```

## When to Use
- 복잡한 타입 추론 상황
- 콜백 함수 타입 정의
- 제네릭 함수 매개변수 제약
```

**예상 결과**
Claude가 파일 저장 완료를 알립니다:

```markdown
✅ Skill이 저장되었습니다: ~/.claude/skills/learned/typescript-generic-constraints.md

향후 비슷한 타입 문제를 만나면 Claude가 이 skill을 자동으로 로드합니다.
```

**체크포인트 ✅**
- 파일이 성공적으로 생성되었는가
- 파일 경로가 `~/.claude/skills/learned/` 디렉토리에 있는가
- skill 내용이 정확한가

---

### 3단계: Continuous Learning Skill 설정

**왜 필요한가**
자동 평가를 설정하면 Claude가 매 세션 종료 시 추출 가능한 패턴이 있는지 자동으로 확인합니다.

**작업**

설정 파일 `~/.claude/skills/continuous-learning/config.json` 생성:

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

**설정 설명**:

| 필드 | 설명 | 권장값 |
| --- | --- | --- |
| `min_session_length` | 최소 세션 길이(사용자 메시지 수) | 10 |
| `extraction_threshold` | 추출 임계값 | medium |
| `auto_approve` | 자동 저장 여부(false 권장) | false |
| `learned_skills_path` | learned skills 저장 경로 | `~/.claude/skills/learned/` |
| `patterns_to_detect` | 감지할 패턴 유형 | 위 참조 |
| `ignore_patterns` | 무시할 패턴 유형 | 위 참조 |

**예상 결과**
설정 파일이 `~/.claude/skills/continuous-learning/config.json`에 생성됩니다.

**체크포인트 ✅**
- 설정 파일 형식이 올바른가(유효한 JSON)
- `learned_skills_path`에 `~` 기호가 포함되어 있는가(실제 home 디렉토리로 대체됨)
- `auto_approve`가 `false`로 설정되어 있는가(권장)

---

### 4단계: Stop Hook 자동 트리거 설정

**왜 필요한가**
Stop hook은 매 세션 종료 시 자동으로 트리거되어 `/learn`을 수동으로 실행할 필요가 없습니다.

**작업**

`~/.claude/settings.json`을 편집하여 Stop hook 추가:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**스크립트 경로 설명**:

| 플랫폼 | 스크립트 경로 |
| --- | --- |
| macOS/Linux | `~/.claude/skills/continuous-learning/evaluate-session.sh` |
| Windows | `C:\Users\YourName\.claude\skills\continuous-learning\evaluate-session.cmd` |

**예상 결과**
Stop hook이 `~/.claude/settings.json`에 추가됩니다.

**체크포인트 ✅**
- hooks 구조가 올바른가(Stop → matcher → hooks)
- command 경로가 올바른 스크립트를 가리키는가
- matcher가 `"*"`로 설정되어 있는가(모든 세션 매칭)

---

### 5단계: Stop Hook 정상 작동 확인

**왜 필요한가**
설정이 올바른지 확인한 후에야 자동 추출 기능을 안심하고 사용할 수 있습니다.

**작업**
1. 새 Claude Code 세션 열기
2. 개발 작업 수행(최소 10개 메시지 전송)
3. 세션 종료

**예상 결과**
Stop hook 스크립트 로그 출력:

```
[ContinuousLearning] Session has 12 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/yourname/.claude/skills/learned/
```

**체크포인트 ✅**
- 로그에 세션 메시지 수 ≥ 10이 표시되는가
- 로그에 learned skills 경로가 올바르게 출력되는가
- 오류 메시지가 없는가

---

### 6단계: 향후 세션에서 learned skills 자동 로드

**왜 필요한가**
저장된 skills는 향후 비슷한 상황에서 자동으로 로드되어 컨텍스트를 제공합니다.

**작업**
향후 세션에서 비슷한 문제를 만나면 Claude가 관련 learned skills를 자동으로 로드합니다.

**예상 결과**
Claude가 관련 skills 로드를 알립니다:

```markdown
이 상황이 이전에 해결한 타입 추론 문제와 비슷한 것 같습니다.

저장된 skill(typescript-generic-constraints)에 따르면, 명시적 제네릭 제약 사용을 권장합니다:

```typescript
function process<T extends Record<string, unknown>>(data: T) { ... }
```
```

**체크포인트 ✅**
- Claude가 저장된 skill을 참조했는가
- 제안된 해결책이 정확한가
- 문제 해결 효율성이 향상되었는가

## 체크포인트 ✅: 설정 확인

위 단계를 완료한 후, 다음 검사를 실행하여 모든 것이 정상인지 확인합니다:

1. **설정 파일 존재 확인**:
```bash
ls -la ~/.claude/skills/continuous-learning/config.json
```

2. **Stop hook 설정 확인**:
```bash
cat ~/.claude/settings.json | grep -A 10 "Stop"
```

3. **learned skills 디렉토리 확인**:
```bash
ls -la ~/.claude/skills/learned/
```

4. **Stop hook 수동 테스트**:
```bash
node ~/.claude/skills/continuous-learning/scripts/hooks/evaluate-session.js
```

## 주의사항

### 함정 1: 세션이 너무 짧아 추출이 트리거되지 않음

**문제**:
Stop hook 스크립트가 세션 길이를 확인하고, `min_session_length` 미만이면 건너뜁니다.

**원인**:
기본 `min_session_length: 10`으로, 짧은 세션은 평가를 트리거하지 않습니다.

**해결 방법**:
```json
{
  "min_session_length": 5  // 임계값 낮추기
}
```

::: warning 주의
너무 낮게 설정하지 마세요(예: < 5). 그렇지 않으면 의미 없는 패턴(단순한 문법 오류 수정 등)이 대량으로 추출됩니다.
:::

---

### 함정 2: `auto_approve: true`로 인한 저품질 패턴 자동 저장

**문제**:
자동 저장 모드에서 Claude가 저품질 패턴을 저장할 수 있습니다.

**원인**:
`auto_approve: true`는 수동 확인 단계를 건너뜁니다.

**해결 방법**:
```json
{
  "auto_approve": false  // 항상 false 유지
}
```

**권장 방법**:
항상 추출된 패턴을 수동으로 확인하여 품질을 보장합니다.

---

### 함정 3: learned skills 디렉토리가 없어 저장 실패

**문제**:
Stop hook이 성공적으로 실행되었지만 skill 파일이 생성되지 않음.

**원인**:
`learned_skills_path`가 가리키는 디렉토리가 존재하지 않음.

**해결 방법**:
```bash
# 디렉토리 수동 생성
mkdir -p ~/.claude/skills/learned/

# 또는 설정에서 절대 경로 사용
{
  "learned_skills_path": "/absolute/path/to/learned/"
}
```

---

### 함정 4: Stop hook 스크립트 경로 오류(Windows)

**문제**:
Windows에서 Stop hook이 트리거되지 않음.

**원인**:
설정 파일이 Unix 스타일 경로(`~/.claude/...`)를 사용하지만, Windows 실제 경로는 다름.

**해결 방법**:
```json
{
  "command": "C:\\Users\\YourName\\.claude\\skills\\continuous-learning\\evaluate-session.cmd"
}
```

**권장 방법**:
Shell 스크립트 대신 Node.js 스크립트(크로스 플랫폼)를 사용합니다.

---

### 함정 5: 추출된 패턴이 너무 일반적이어서 재사용성이 낮음

**문제**:
추출된 패턴 설명이 너무 일반적(예: "타입 오류 수정")이고 구체적인 컨텍스트가 부족함.

**원인**:
추출 시 충분한 컨텍스트 정보(오류 메시지, 코드 예제, 적용 상황)가 포함되지 않음.

**해결 방법**:
`/learn` 시 더 자세한 컨텍스트 제공:

```
/learn TypeScript 타입 오류를 해결했습니다: Property 'xxx' does not exist on type 'yyy'. 타입 단언 as로 임시 해결했지만, 더 좋은 방법은 제네릭 제약을 사용하는 것입니다.
```

**체크리스트**:
- [ ] 문제 설명이 구체적인가(오류 메시지 포함)
- [ ] 해결 방법이 상세한가(코드 예제 포함)
- [ ] 적용 상황이 명확한가(언제 이 패턴을 사용하는지)
- [ ] 이름이 구체적인가(예: "type-fix"가 아닌 "typescript-generic-constraints")

---

### 함정 6: learned skills 수가 너무 많아 관리가 어려움

**문제**:
시간이 지나면서 `learned/` 디렉토리에 많은 skills가 쌓여 찾기와 관리가 어려움.

**원인**:
저품질이거나 오래된 skills를 정기적으로 정리하지 않음.

**해결 방법**:

1. **정기 검토**: 매월 learned skills 확인
```bash
# 모든 skills 나열
ls -la ~/.claude/skills/learned/

# skill 내용 확인
cat ~/.claude/skills/learned/pattern-name.md
```

2. **저품질 skills 표시**: 파일 이름 앞에 `deprecated-` 접두사 추가
```bash
mv ~/.claude/skills/learned/old-pattern.md \
   ~/.claude/skills/learned/deprecated-old-pattern.md
```

3. **분류 관리**: 하위 디렉토리로 분류
```bash
mkdir -p ~/.claude/skills/learned/{types,debugging,testing}
mv ~/.claude/skills/learned/*types*.md ~/.claude/skills/learned/types/
```

**권장 방법**:
분기별로 정리하여 learned skills를 간결하고 효과적으로 유지합니다.

---

## 이 강의 요약

지속적 학습 메커니즘은 세 가지 핵심 구성요소로 작동합니다:

1. **`/learn` 명령어**: 세션에서 재사용 가능한 패턴을 수동 추출
2. **Continuous Learning Skill**: 자동 평가 매개변수 설정(세션 길이, 추출 임계값)
3. **Stop Hook**: 세션 종료 시 자동으로 평가 트리거

**핵심 포인트**:

- ✅ 수동 추출은 방금 해결한 중요한 문제에 적합
- ✅ 자동 평가는 Stop hook을 통해 세션 종료 시 트리거
- ✅ 추출된 패턴은 learned skills로 `~/.claude/skills/learned/` 디렉토리에 저장
- ✅ `min_session_length`로 최소 세션 길이 제어(권장 10)
- ✅ 항상 `auto_approve: false` 유지, 추출 품질을 수동으로 확인
- ✅ 저품질이거나 오래된 learned skills를 정기적으로 정리

**모범 사례**:

- 복잡한 문제를 해결한 후 즉시 `/learn`으로 패턴 추출
- 상세한 컨텍스트 제공(문제 설명, 해결책, 코드 예제, 적용 상황)
- 구체적인 skill 이름 사용(예: "typescript-generic-constraints"가 아닌 "type-fix")
- learned skills를 정기적으로 검토하고 정리하여 지식 베이스를 간결하게 유지

## 다음 강의 예고

> 다음 강의에서는 **[토큰 최적화 전략](../token-optimization/)**을 배웁니다.
>
> 배울 내용:
> - 토큰 사용을 최적화하여 컨텍스트 윈도우 효율성 극대화
> - strategic-compact skill 설정 및 사용
> - PreCompact 및 PostToolUse hooks 자동화
> - 비용과 품질의 균형을 위한 적절한 모델 선택(opus vs sonnet)

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트: 2026-01-25

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| /learn 명령어 정의 | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Continuous Learning Skill | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81 |
| Stop Hook 스크립트 | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Checkpoint 명령어 | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |

**주요 상수**:
- `min_session_length = 10`: 기본 최소 세션 길이(사용자 메시지 수)
- `CLAUDE_TRANSCRIPT_PATH`: 환경 변수, 세션 기록 경로
- `learned_skills_path`: learned skills 저장 경로, 기본값 `~/.claude/skills/learned/`

**주요 함수**:
- `main()`: evaluate-session.js 메인 함수, 설정 읽기, 세션 길이 확인, 로그 출력
- `getLearnedSkillsDir()`: learned skills 디렉토리 경로 가져오기(`~` 확장 처리)
- `countInFile()`: 파일에서 패턴 일치 횟수 계산

**설정 항목**:
| 설정 항목 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `min_session_length` | number | 10 | 최소 세션 길이(사용자 메시지 수) |
| `extraction_threshold` | string | "medium" | 추출 임계값 |
| `auto_approve` | boolean | false | 자동 저장 여부(false 권장) |
| `learned_skills_path` | string | "~/.claude/skills/learned/" | learned skills 저장 경로 |
| `patterns_to_detect` | array | 소스 코드 참조 | 감지할 패턴 유형 |
| `ignore_patterns` | array | 소스 코드 참조 | 무시할 패턴 유형 |

**패턴 유형**:
- `error_resolution`: 오류 해결 패턴
- `user_corrections`: 사용자 수정 패턴
- `workarounds`: workaround 방법
- `debugging_techniques`: 디버깅 기법
- `project_specific`: 프로젝트 특정 패턴

**Hook 유형**:
- Stop: 세션 종료 시 실행(evaluate-session.js)

</details>
