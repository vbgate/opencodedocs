---
title: "빠른 시작: 플러그인 설치 | everything-claude-code"
sidebarTitle: "5분 안에 시작하기"
subtitle: "빠른 시작: everything-claude-code 플러그인 설치"
description: "everything-claude-code의 설치 방법과 핵심 기능을 학습하세요. 5분 안에 플러그인 설치를 완료하고 /plan, /tdd, /code-review 명령어를 사용하여 개발 효율성을 높이세요."
tags:
  - "quickstart"
  - "installation"
  - "getting-started"
prerequisite: []
order: 10
---

# 빠른 시작: 5분 안에 Everything Claude Code 시작하기

## 학습 완료 후 할 수 있는 것

**Everything Claude Code**는 Claude Code를 위한 플러그인으로, 전문적인 agents, commands, rules, hooks을 제공하여 코드 품질과 개발 효율성을 높여줍니다. 이 튜토리얼에서는:

- ✅ 5분 안에 Everything Claude Code 설치 완료
- ✅ `/plan` 명령어로 구현 계획 생성하기
- ✅ `/tdd` 명령어로 테스트 주도 개발하기
- ✅ `/code-review`로 코드 검토하기
- ✅ 플러그인의 핵심 구성 요소 이해하기

## 현재 당신이 겪고 있는 문제

Claude Code의 기능을 더 강력하게 만들고 싶지만:
- ❌ 매번 코딩 규칙과 모범 사례를 반복해서 설명해야 함
- ❌ 테스트 커버리지가 낮고 버그가 자주 발생
- ❌ 코드 검토에서 보안 문제를 자주 놓침
- ❌ TDD를 하고 싶지만 어디서 시작해야 할지 모름
- ❌ 특정 작업을 처리할 전문 서브 에이전트가 있으면 좋겠음

**Everything Claude Code**가 이러한 문제를 해결합니다:
- 9개의 전문화된 agents (planner, tdd-guide, code-reviewer, security-reviewer 등)
- 14개의 슬래시 명령어 (/plan, /tdd, /code-review 등)
- 8개의 강제 규칙 세트 (security, coding-style, testing 등)
- 15개 이상의 자동화 hooks
- 11개의 workflow skills

## 핵심 개념

**Everything Claude Code**는 Claude Code 플러그인으로 다음을 제공합니다:
- **Agents**: 특정 도메인 작업을 처리하는 전문화된 서브 에이전트 (예: TDD, 코드 검토, 보안 감사)
- **Commands**: 워크플로우를 빠르게 시작하는 슬래시 명령어 (예: `/plan`, `/tdd`)
- **Rules**: 코드 품질과 보안을 보장하는 강제 규칙 (예: 80%+ 커버리지, console.log 금지)
- **Skills**: 재사용 가능한 모범 사례 워크플로우 정의
- **Hooks**: 특정 이벤트 시 트리거되는 자동화 후크 (예: 세션 유지, console.log 경고)

::: tip Claude Code 플러그인이란?
Claude Code 플러그인은 Claude Code의 기능을 확장합니다. VS Code 플러그인이 에디터 기능을 확장하는 것처럼요. 설치 후에는 플러그인이 제공하는 모든 agents, commands, skills, hooks을 사용할 수 있습니다.
:::

## 🎒 시작하기 전 준비물

**필요한 것**:
- Claude Code가 설치되어 있음
- 터미널 명령어에 대한 기본적인 이해
- 테스트용 프로젝트 디렉터리

**필요 없는 것**:
- 특별한 프로그래밍 언어 지식
- 사전 설정이 필요하지 않음

---

## 따라하기: 5분 안에 설치하기

### 1단계: Claude Code 열기

Claude Code를 시작하고 프로젝트 디렉터리를 엽니다.

**확인할 사항**: Claude Code 명령줄 인터페이스가 준비되어 있습니다.

---

### 2단계: 마켓플레이스 추가하기

Claude Code에서 다음 명령어를 실행하여 마켓플레이스를 추가합니다:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**이유**
Everything Claude Code를 Claude Code의 플러그인 소스로 추가하여 플러그인을 설치할 수 있게 합니다.

**확인할 사항**:
```
✓ Successfully added marketplace: everything-claude-code
```

---

### 3단계: 플러그인 설치하기

다음 명령어를 실행하여 플러그인을 설치합니다:

```bash
/plugin install everything-claude-code@everything-claude-code
```

**이유**
Everything Claude Code 플러그인을 설치하여 제공하는 모든 기능을 사용할 수 있게 합니다.

**확인할 사항**:
```
✓ Successfully installed plugin: everything-claude-code@everything-claude-code
```

---

### 4단계: 설치 확인하기

다음 명령어를 실행하여 설치된 플러그인을 확인합니다:

```bash
/plugin list
```

**확인할 사항**:
```
Installed Plugins:
  everything-claude-code@everything-claude-code
```

✅ 설치 성공!

---

## 따라하기: 핵심 기능 체험하기

### 5단계: /plan으로 구현 계획 생성하기

사용자 인증 기능을 추가하려는 경우 다음을 실행합니다:

```bash
/plan I need to add user authentication with email and password
```

**이유**
planner agent를 사용하여 자세한 구현 계획을 만들고 중요한 단계를 놓치지 않도록 합니다.

**확인할 사항**:
```
# Implementation Plan: User Authentication with Email and Password

## Requirements Restatement
- User registration with email and password
- User login with email and password
- Password hashing with bcrypt
- JWT token generation
- Session management

## Implementation Phases
[자세한 구현 단계...]

## Risks
- HIGH: Password security (use bcrypt, salt rounds)
- MEDIUM: JWT token expiration
- LOW: Email uniqueness validation

## Estimated Complexity: MEDIUM
**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

`yes`를 입력하여 계획을 확인하면 planner가 구현을 시작합니다.

---

### 6단계: /tdd로 테스트 주도 개발하기

기능을 구현할 때 다음을 실행합니다:

```bash
/tdd I need to implement a function to validate email format
```

**이유**
tdd-guide agent를 사용하여 TDD 프로세스를 강제하고, 테스트를 먼저 작성한 다음 코드를 구현하여 80%+ 커버리지를 달성하도록 합니다.

**확인할 사항**:
```
# TDD Session: Email Format Validator

## Step 1: Define Interface (SCAFFOLD)
```typescript
// lib/email-validator.ts
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)
[테스트 코드...]

## Step 3: Run Tests - Verify FAIL
[테스트 실패...]

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)
[구현 코드...]

## Step 5: Run Tests - Verify PASS
[테스트 통과...]

## Step 6: Refactor (IMPROVE)
[리팩토링 코드...]

## Step 7: Verify Tests Still Pass
[테스트 여전히 통과...]

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)

✅ TDD session complete!
```

---

### 7단계: /code-review로 코드 검토하기

코드를 커밋하기 전에 다음을 실행합니다:

```bash
/code-review
```

**이유**
code-reviewer agent를 사용하여 코드 품질, 보안 및 모범 사례를 확인합니다.

**확인할 사항**:
```
# Code Review Report

## Overview
- Files reviewed: 3
- Total lines: 150
- Issues found: 2

## Issues Found

### 1. [CRITICAL] Hardcoded JWT Secret
**Location**: `lib/auth.ts:15`
**Issue**: JWT secret is hardcoded in source code
**Fix**: Move to environment variable
**Impact**: Security vulnerability - secret exposed in code

### 2. [MEDIUM] Missing Error Handling
**Location**: `lib/email-validator.ts:23`
**Issue**: No error handling for null/undefined input
**Fix**: Add null check at function start
**Impact**: Potential runtime errors

## Recommendations
✓ Tests are well written
✓ Code is readable
✓ Follows TypeScript best practices

**Action Required**: Fix CRITICAL issues before commit.
```

문제를 수정한 후 다시 `/code-review`를 실행하여 모든 문제가 해결되었는지 확인합니다.

---

## 체크포인트 ✅

다음 단계를 성공적으로 완료했는지 확인하세요:

- [ ] marketplace를 성공적으로 추가함
- [ ] everything-claude-code 플러그인을 성공적으로 설치함
- [ ] `/plan`으로 구현 계획을 생성함
- [ ] `/tdd`로 TDD 개발을 수행함
- [ ] `/code-review`로 코드 검토를 수행함

문제가 발생하면 [자주 묻는 문제 해결](../../faq/troubleshooting-hooks/)을 확인하거나 [MCP 연결 실패](../../faq/troubleshooting-mcp/)를 확인하세요.

---

## 함정 경고

::: warning 설치 실패
`/plugin marketplace add`가 실패하는 경우:
1. Claude Code 최신 버전을 사용하는지 확인하세요
2. 네트워크 연결이 정상인지 확인하세요
3. GitHub 접근이 정상인지 확인하세요 (프록시가 필요할 수 있음)
:::

::: warning 명령어 사용 불가
`/plan` 또는 `/tdd` 명령어를 사용할 수 없는 경우:
1. `/plugin list`를 실행하여 플러그인이 설치되어 있는지 확인하세요
2. 플러그인 상태가 enabled인지 확인하세요
3. Claude Code를 재시작하세요
:::

::: tip Windows 사용자
Everything Claude Code는 Windows를 완벽하게 지원합니다. 모든 hooks와 스크립트는 Node.js로 다시 작성되어 플랫폼 간 호환성을 보장합니다.
:::

---

## 이 강의 요약

✅ 당신은 이제:
1. Everything Claude Code 플러그인을 성공적으로 설치했습니다
2. 핵심 개념을 이해했습니다: agents, commands, rules, skills, hooks
3. `/plan`, `/tdd`, `/code-review` 세 가지 핵심 명령어를 체험했습니다
4. 기본적인 TDD 개발 프로세스를 익혔습니다

**기억하세요**:
- Agents는 특정 작업을 처리하는 전문화된 서브 에이전트입니다
- Commands는 워크플로우를 빠르게 시작하는 진입점입니다
- Rules는 코드 품질과 보안을 보장하는 강제 규칙입니다
- 공감할 수 있는 기능부터 시작하여 점진적으로 확장하세요
- 모든 MCP를 활성화하지 마세요, 10개 이하로 유지하세요

---

## 다음 강의 예고

> 다음 강의에서는 **[설치 가이드: 플러그인 마켓플레이스 vs 수동 설치](../installation/)**를 학습합니다.
>
> 배울 내용:
> - 플러그인 마켓플레이스 설치의 자세한 단계
> - 수동 설치의 전체 프로세스
> - 필요한 구성 요소만 복사하는 방법
> - MCP 서버 구성 방법

계속 학습하여 Everything Claude Code의 완전한 설치와 구성에 대해 깊이 있게 알아보세요.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 |
|--- | --- | ---|
| 플러그인 매니페스트 | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| Marketplace 구성 | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45 |
| 설치 안내 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 175-242 |
| /plan 명령어 | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| /tdd 명령어 | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
|--- | --- | ---|

**핵심 상수**:
- 플러그인 이름: `everything-claude-code`
- Marketplace 저장소: `affaan-m/everything-claude-code`

**핵심 파일**:
- `plugin.json`: 플러그인 메타데이터와 구성 요소 경로
- `commands/*.md`: 14개의 슬래시 명령어 정의
- `agents/*.md`: 9개의 전문화된 서브 에이전트
- `rules/*.md`: 8개의 강제 규칙 세트
- `hooks/hooks.json`: 15개 이상의 자동화 hook 구성

</details>
