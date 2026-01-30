---
title: "모범 사례: Agent Skills 효율적 사용 | Agent Skills"
sidebarTitle: "AI 속도 높이기"
subtitle: "모범 사례 사용하기"
description: "Agent Skills의 효율적인 사용법을 배워보세요. 트리거 키워드 선택 기법, 컨텍스트 관리 전략, 다중 스킬 협업 시나리오 및 성능 최적화 팁을 익혀 토큰 소비를 줄이고 AI 응답 속도를 향상시키세요."
tags:
  - "모범 사례"
  - "성능 최적화"
  - "효율성 향상"
  - "AI 사용 팁"
order: 100
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# 모범 사례 사용하기

## 학습 후 할 수 있는 것

이 강의를 마치면 다음을 할 수 있습니다:

- ✅ 정확한 트리거 키워드를 선택하여 AI가 적절한 시점에 스킬을 활성화하도록 합니다
- ✅ 컨텍스트를 최적화하여 토큰 소비를 줄이고 응답 속도를 향상시킵니다
- ✅ 다중 스킬 협업 시나리오를 처리하여 충돌과 혼란을 방지합니다
- ✅ 일반적인 사용 패턴을 익혀 업무 효율성을 높입니다

## 현재의 어려움

다음과 같은 상황을 경험해 보셨나요:

- ✗ "배포해줘"라고 입력했지만 AI가 Vercel Deploy 스킬을 활성화하지 않았습니다
- ✗ 동일한 작업이 여러 스킬을 트리거하여 AI가 어떤 것을 사용해야 할지 몰랐습니다
- ✗ 스킬이 너무 많은 컨텍스트를 차지하여 AI가 사용자의 요구사항을 "기억하지 못했습니다"
- ✗ 매번 작업을 다시 설명해야 해서 AI가 사용자의 습관을 기억하게 하는 방법을 몰랐습니다

## 언제 이 기법을 사용하나요

Agent Skills 사용 중 다음과 같은 상황에서:

- 🎯 **부정확한 트리거**: 스킬이 활성화되지 않았거나 잘못된 스킬이 활성화됨
- 💾 **컨텍스트 압력**: 스킬이 너무 많은 토큰을 차지하여 다른 대화에 영향을 줌
- 🔄 **스킬 충돌**: 여러 스킬이 동시에 활성화되어 AI 실행이 혼란스러움
- ⚡ **성능 저하**: AI 응답이 느려져 사용 방식을 최적화해야 함

## 핵심 개념

**Agent Skills의 설계 철학**:

Agent Skills는 **온디맨드 로딩 메커니즘**을 채택합니다 — Claude는 시작 시 스킬의 이름과 설명만 로드합니다(약 1-2줄). 관련 키워드가 감지되면 전체 `SKILL.md` 내용을 읽습니다. 이러한 설계는 컨텍스트 소비를 최소화하면서도 스킬의 정확한 트리거를 유지할 수 있습니다.

**사용 효율성의 세 가지 핵심 차원**:

1. **트리거 정확도**: 적절한 트리거 키워드를 선택하여 스킬이 올바른 시점에 활성화되도록 합니다
2. **컨텍스트 효율성**: 스킬 내용 길이를 제어하여 과도한 토큰 사용을 방지합니다
3. **협업 명확성**: 스킬 경계를 명확히 하여 다중 스킬 충돌을 방지합니다

---

## 모범 사례 1: 정확한 트리거 키워드 선택

### 트리거 키워드란?

트리거 키워드는 `SKILL.md`의 `description` 필드에 정의되며, AI에게 이 스킬을 언제 활성화해야 하는지 알려줍니다.

**핵심 원칙**: 설명은 구체적이어야 하며, 트리거는 명확해야 합니다

### 효과적인 설명을 작성하는 방법?

#### ❌ 잘못된 예시: 설명이 모호함

```yaml
---
name: my-deploy-tool
description: A deployment tool for applications  # 너무 모호하여 트리거되지 않음
---
```

**문제점**:
- 명확한 사용 시나리오가 없음
- 사용자가 말할 수 있는 키워드를 포함하지 않음
- AI가 활성화 시점을 판단할 수 없음

#### ✅ 올바른 예시: 구체적인 설명과 트리거 단어 포함

```yaml
---
name: vercel-deploy
description: Deploy applications and websites to Vercel. Use this skill when the user requests deployment actions such as "Deploy my app", "Deploy this to production", "Create a preview deployment", "Deploy and give me the link", or "Push this live". No authentication required.
---
```

**장점**:
- 명확한 사용 시나리오(Deploy applications)
- 구체적인 트리거 구문 나열("Deploy my app", "Deploy this to production")
- 고유 가치 설명(No authentication required)

### 트리거 키워드 선택 가이드

| 작성 시나리오 | 추천 키워드 | 사용 피하기 |
| --- | --- | --- |
| **배포 작업** | "deploy", "production", "push", "publish" | "send", "move" |
| **코드 검토** | "review", "check", "audit", "optimize" | "look at", "see" |
| **디자인 검사** | "accessibility", "a11y", "UX check", "design audit" | "design", "style" |
| **성능 최적화** | "optimize", "performance", "improve speed" | "faster", "better" |

### 함정 경고: 일반적인 실수

::: warning 이런 실수를 피하세요

❌ **일반적인 단어만 사용**
```yaml
description: A tool for code review  # "code review"는 너무 일반적임
```

✅ **구체적인 시나리오 + 키워드**
```yaml
description: Review React components for performance issues. Use when user says "review performance", "check optimization", or "find bottlenecks".
```

❌ **키워드가 너무 적음**
```yaml
description: Deploy to Vercel  # 하나의 시나리오만 있음
```

✅ **다양한 표현 커버**
```yaml
description: Deploy to Vercel. Use when user says "deploy", "push live", "create preview", or "publish".
```

:::

---

## 모범 사례 2: 컨텍스트 관리 기법

### 왜 컨텍스트 관리가 중요한가?

토큰은 유한한 자원입니다. `SKILL.md` 파일이 너무 길면 많은 컨텍스트를 차지하여 AI가 사용자의 요구사항을 "기억하지 못하거나" 응답이 느려집니다.

### 핵심 원칙: SKILL.md를 간결하게 유지

::: tip 황금 규칙

**SKILL.md 파일을 500줄 이내로 유지하세요**

:::

공식 문서에 따르면, 다음 전략으로 컨텍스트 사용을 최소화할 수 있습니다:

| 전략 | 설명 | 효과 |
| --- | --- | --- |
| **SKILL.md 간결하게 유지** | 상세 참조 자료를 별도 파일에 배치 | 초기 로딩량 감소 |
| **구체적인 설명 작성** | AI가 정확하게 활성화 시점을 판단하도록 도움 | 오작동 방지 |
| **점진적 공개** | 필요할 때만 지원 파일 읽기 | 실제 토큰 소비 제어 |
| **스크립트 실행 우선** | 스크립트 출력은 컨텍스트를 소비하지 않음, 결과만 소비 | 토큰 사용 대폭 감소 |
| **단일 레벨 파일 참조** | SKILL.md에서 지원 파일로 직접 링크 | 다중 중첩 방지 |

### 점진적 공개는 어떻게 하나요?

**시나리오**: 스킬에 API 문서, 설정 예시 등 상세 참조가 필요한 경우

#### ❌ 잘못된 방법: 모두 SKILL.md에 작성

```markdown
---
name: my-api-skill
---

# API Skill

## API Reference

(여기에 2000줄의 API 문서 작성)


## Configuration Examples

(여기에 500줄의 예시 작성)


## Usage Guide

(200줄의 사용 설명)
```

**문제점**:
- 파일이 500줄을 초과함
- 활성화할 때마다 전체 내용을 로드함
- 대부분의 내용은 사용되지 않을 수 있음

#### ✅ 올바른 방법: 지원 파일로 분리

```markdown
---
name: my-api-skill
description: Integrate with My API. Use when user says "call API", "send request", or "fetch data".
---

# API Skill

Quick start guide for My API integration.

## Quick Setup

1. Get API key from https://api.example.com/keys
2. Add to environment: `export MY_API_KEY="your-key"`
3. Run: `bash scripts/api-client.sh`

## Common Operations

### Fetch user data
```bash
bash scripts/api-client.sh get /users/123
```

### Create new resource
```bash
bash scripts/api-client.sh post /users '{"name":"John"}'
```

## Reference Documentation

For complete API reference, see:
- [API Endpoints](references/api-endpoints.md)
- [Configuration Examples](references/config-examples.md)
- [Error Handling](references/errors.md)
```

**장점**:
- `SKILL.md`는 30줄만 있음
- AI는 필요할 때만 상세 문서를 읽음
- 대부분의 토큰 소비는 문서 로딩이 아닌 스크립트 출력에서 발생

### 실전 예시: Vercel Deploy vs React Best Practices

| 스킬 | SKILL.md 줄 수 | 로드 내용 | 최적화 전략 |
| --- | --- | --- | --- |
| Vercel Deploy | ~60줄 | 간결한 사용법 + 출력 형식 | 스크립트가 복잡한 로직 처리 |
| React Best Practices | ~300줄 | 규칙 인덱스 + 분류 | 상세 규칙은 AGENTS.md에 있음 |
| Web Design Guidelines | ~50줄 | 감사 프로세스 | GitHub에서 규칙을 동적으로 가져옴 |

**시사점**: `SKILL.md`에 모든 것을 넣지 마세요. "입문 가이드"가 되게 하고, "완전한 매뉴얼"이 되게 하지 마세요.

---

## 모범 사례 3: 다중 스킬 협업 시나리오

### 시나리오 1: 스킬 A와 스킬 B의 트리거 조건이 겹침

**문제**: "review my code"라고 말하면 React Best Practices와 Web Design Guidelines가 모두 트리거됩니다.

#### ✅ 해결책: 트리거 단어를 명확히 구분

```yaml
# React Best Practices
name: react-performance
description: Review React components for performance issues. Use when user says "review performance", "optimize React", "check bottlenecks".

# Web Design Guidelines
name: web-design-audit
description: Audit UI for accessibility and UX issues. Use when user says "check accessibility", "review UX", "audit interface".
```

**결과**:
- "review performance" → React 스킬만 트리거
- "check accessibility" → Web 스킬만 트리거
- "review my code" → 둘 다 트리거되지 않음, AI가 판단

### 시나리오 2: 여러 스킬을 동시에 사용해야 함

**모범 사례**: AI에게 어떤 스킬이 필요한지 명확히 알려주세요

**추천 대화 방식**:
```
두 가지 작업을 완료해야 합니다:
1. Vercel에 배포 (vercel-deploy 스킬 사용)
2. React 성능 문제 검사 (react-best-practices 스킬 사용)
```

**이유**:
- 스킬 경계를 명확히 하여 AI 혼란 방지
- AI가 순차적으로 실행하여 리소스 충돌 방지
- 실행 효율성 향상

### 시나리오 3: 스킬 체인 호출(한 스킬의 출력이 다른 스킬의 입력)

**예시**: 배포 전에 먼저 성능 최적화

```bash
# 단계 1: React Best Practices로 코드 최적화
"Review src/components/Header.tsx for performance issues using react-best-practices skill"

# 단계 2: Vercel Deploy로 배포
"Deploy the optimized code to Vercel"
```

**모범 사례**:
- 단계 순서를 명확히 합니다
- 각 단계 사이에 완료를 확인합니다
- 의존성이 있는 작업을 병렬 처리하지 않습니다

---

## 모범 사례 4: 성능 최적화 팁

### 1. 대화 컨텍스트 간소화

**문제**: 장시간 대화 후 컨텍스트가 매우 길어져 응답이 느려집니다.

#### ✅ 해결책: 새 대화 시작 또는 "Clear Context" 사용

```bash
# Claude Code
/clear  # 컨텍스트를 지우고 스킬은 유지
```

### 2. 스킬 반복 로딩 방지

**문제**: 동일한 작업에서 스킬을 여러 번 트리거하여 토큰을 낭비합니다.

#### ❌ 잘못된 방법

```
사용자: Deploy my app
AI: (vercel-deploy 로드, 실행)
사용자: Deploy to production
AI: (vercel-deploy 다시 로드, 실행)
```

#### ✅ 올바른 방법

```
사용자: Deploy to production
AI: (vercel-deploy 로드, 한 번 실행)
```

### 3. 인라인 코드 대신 스크립트 사용

**비교**: 동일한 작업을 완료하는데 어떤 방식이 더 적은 소비를 하나요?

| 방식 | 토큰 소비 | 추천 시나리오 |
| --- | --- | --- |
| **인라인 코드**(SKILL.md에 로직 작성) | 높음(트리거할 때마다 로드) | 간단한 작업(<10줄) |
| **Bash 스크립트** | 낮음(스크립트 경로만 로드, 내용은 로드되지 않음) | 복잡한 작업(>10줄) |

**예시**:

```markdown
## ❌ 인라인 코드(비추천)

```bash
# 이 코드는 활성화할 때마다 컨텍스트에 로드됨
tar -czf package.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  && curl -X POST $API_URL \
  -F "file=@package.tar.gz"
```

## ✅ 스크립트(추천)

```bash
bash scripts/deploy.sh
```

(스크립트 내용은 파일에 있어 컨텍스트에 로드되지 않음)
```

### 4. 토큰 사용 모니터링

**Claude Code 유용한 명령어**:

```bash
# 현재 토큰 사용량 확인
/token

# 스킬 로딩 상황 확인
/skills
```

---

## 일반적인 사용 패턴과 예시

### 패턴 1: 빠른 반복 워크플로우

```bash
# 1. 코드 작성
vim src/App.tsx

# 2. 즉시 성능 검토
"Review this for performance issues"

# 3. 제안에 따라 코드 수정
(수정)

# 4. 다시 검토
"Review again"

# 5. 배포
"Deploy to production"
```

**핵심 포인트**:
- 짧은 지시어를 사용하세요. AI는 이미 컨텍스트를 알고 있습니다
- 반복 지시어로 동일한 스킬을 빠르게 활성화할 수 있습니다

### 패턴 2: 새 프로젝트 시작 체크리스트

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest my-app

# Agent Skills 설치
npx add-skill vercel-labs/agent-skills

# 초기 감사
"Check accessibility for all UI files"
"Review performance for all components"

# 배포 테스트
"Deploy to production"
```

### 패턴 3: 팀 협업 템플릿

```bash
# 팀 프로젝트 클론
git clone team-project
cd team-project

1. "Review performance for all new changes"
2. "Check accessibility of modified files"
3. "Deploy to staging"
```

**팀 표준**: 통일된 트리거 키워드를 정의하여 모든 팀원이 동일한 효율성 패턴을 사용하도록 합니다.

---

## 함정 경고: 일반적인 실수

### 함정 1: 스킬이 활성화되었지만 효과가 없음

**증상**: "Deploy my app"이라고 말하면 AI가 "vercel-deploy 스킬을 사용하겠습니다"라고 하지만 아무 일도 일어나지 않습니다.

**원인**:
- 스킬 스크립트 경로 오류
- 스크립트에 실행 권한이 없음
- 파일이 올바른 위치에 없음

**해결**:
```bash
# 스킬 디렉토리 확인
ls -la ~/.claude/skills/vercel-deploy/

# 스크립트 권한 확인
chmod +x ~/.claude/skills/vercel-deploy/scripts/deploy.sh

# 스크립트 수동 테스트
bash ~/.claude/skills/vercel-deploy/scripts/deploy.sh .
```

### 함정 2: 잘못된 스킬이 트리거됨

**증상**: "check code"라고 말하면 Web Design이 아닌 React Best Practices가 트리거됩니다.

**원인**: 스킬 설명 키워드 충돌

**해결**: 트리거 단어를 더 구체적으로 수정:
```yaml
# ❌ 이전
description: "Check code for issues"

# ✅ 이후
description: "Review React code for accessibility and UX"
```

### 함정 3: AI가 스킬을 "잊어버림"

**증상**: 첫 번째 대화에서는 작동하지만 두 번째에서는 안 됩니다.

**원인**: 컨텍스트가 너무 길어 스킬 정보가 밀려남

**해결**:
```bash
/clear  # 컨텍스트를 지우고 스킬은 유지
```

---

## 강의 요약

**핵심 포인트**:

1. **트리거 키워드**: 설명은 구체적이어야 하며, 사용자가 말할 수 있는 다양한 표현을 포함해야 합니다
2. **컨텍스트 관리**: SKILL.md를 500줄 미만으로 유지하고, 점진적 공개를 사용하며, 스크립트를 우선시합니다
3. **다중 스킬 협업**: 트리거 단어로 스킬을 명확히 구분하고, 다중 작업 처리 시 순서를 명확히 합니다
4. **성능 최적화**: 대화 컨텍스트를 간소화하고, 반복 로딩을 피하며, 토큰 사용을 모니터링합니다

**모범 사례 암기법**:

> 설명은 구체적으로, 트리거는 명확하게
> 파일은 너무 길지 않게, 스크립트가 공간을 차지
> 다중 스킬은 경계를 나누고, 작업 순서는 명확히
> 컨텍스트는 간결하게, 정기적으로 정리하여 지연 방지

---

## 다음 강의 예고

> 다음 강의에서는 **[Agent Skills의 기술 아키텍처와 구현 세부사항](../../appendix/architecture/)**에 대해 자세히 알아보겠습니다.
>
> 배울 내용:
> - 빌드 프로세스 상세(parse → validate → group → sort → generate)
> - 규칙 파서의 작동 방식
> - 타입 시스템과 데이터 모델
> - 테스트 케이스 추출 메커니즘
> - 배포 스크립트의 프레임워크 감지 알고리즘

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간:2026-01-25

| 기능 | 파일 경로 | 줄 번호 |
| --- | --- | --- |
| 컨텍스트 관리 모범 사례 | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78) | 70-78 |
| 스킬 트리거 예시 | [`README.md:88-102`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L88-L102) | 88-102 |
| React 스킬 트리거 단어 | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | 1-30 |
| Vercel Deploy 트리거 단어 | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 1-30 |

**핵심 원칙**:
- Keep SKILL.md under 500 lines:스킬 파일을 간결하게 유지
- Write specific descriptions:AI 판단을 돕기 위해 구체적인 설명 작성
- Use progressive disclosure:상세 내용을 점진적으로 공개
- Prefer scripts over inline code:토큰 소비 감소를 위해 스크립트 실행 우선

</details>
