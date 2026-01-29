---
title: "프로젝트 초기화: Agent 메모리 구축 | opencode-supermemory"
sidebarTitle: "초기화"
subtitle: "프로젝트 초기화: 첫인상 형성"
description: "배우세요: /supermemory-init으로 Agent가 코드베이스를 스캔하고 아키텍처와 규칙을 메모리에 저장하여 세션 간 컨텍스트를 유지하는 방법."
tags:
  - "초기화"
  - "메모리 생성"
  - "워크플로우"
prerequisite:
  - "start-getting-started"
order: 2
---

# 프로젝트 초기화: 첫인상 형성

## 학습 완료 후 할 수 있는 것

- **프로젝트를 한 번에 파악**: Agent가 신규 입사자처럼 코드베이스를 능동적으로 탐색하고 이해하도록 합니다.
- **장기 메모리 구축**: 프로젝트의 기술 스택, 아키텍처 패턴, 코딩 규칙을 자동으로 추출하여 Supermemory에 저장합니다.
- **반복 설명 제거**: 매번 세션을 시작할 때 "우리는 Bun을 사용해" 또는 "모든 컴포넌트는 테스트를 작성해야 해"라고 반복할 필요가 없어집니다.

## 현재 상황

다음과 같은 상황을 겪어본 적이 있나요?

- **반복 작업**: 새로운 세션을 시작할 때마다 Agent에게 프로젝트의 기본 상황을 길게 설명해야 합니다.
- **컨텍스트 손실**: Agent가 프로젝트 특정 디렉토리 구조를 자주 잊어 파일을 잘못된 위치에 만듭니다.
- **일관성 없는 규칙**: Agent가 쓴 코드 스타일이 일정하지 않아 때로는 `interface`를, 때로는 `type`을 사용합니다.

## 언제 이 방법을 사용할까요

- **플러그인 설치 직후**: opencode-supermemory를 사용하는 첫 번째 단계입니다.
- **새 프로젝트 인수 시**: 해당 프로젝트의 메모리 베이스를 빠르게 구축합니다.
- **주요 리팩토링 후**: 프로젝트 아키텍처가 변경되어 Agent의 인지를 업데이트해야 할 때.

## 🎒 시작 전 준비

::: warning 사전 확인
[빠른 시작](./../getting-started/index.md)의 설치 및 설정 단계를 완료했는지 확인하고 `SUPERMEMORY_API_KEY`가 올바르게 설정되었는지 확인하세요.
:::

## 핵심 아이디어

`/supermemory-init` 명령어는 본질적으로 실행 파일이 아니라 **정교하게 설계된 Prompt**(프롬프트)입니다.

이 명령어를 실행하면 Agent에게 상세한 "입사 가이드"를 보내어 다음을 지시합니다:

1.  **심층 조사**: `README.md`, `package.json`, Git 커밋 기록 등을 능동적으로 읽습니다.
2.  **구조화된 분석**: 프로젝트의 기술 스택, 아키텍처 패턴, 암시적 규칙을 식별합니다.
3.  **지속적 저장**: `supermemory` 도구를 사용하여 이러한 통찰을 클라우드 데이터베이스에 저장합니다.

::: info 메모리 범위
초기화 과정은 두 가지 메모리를 구분합니다:
- **Project Scope**: 현재 프로젝트에만 적용됩니다(예: 빌드 명령, 디렉토리 구조).
- **User Scope**: 당신의 모든 프로젝트에 적용됩니다(예: 당신의 코드 스타일 선호도).
:::

## 함께 따라하세요

### 1단계: 초기화 명령어 실행

OpenCode의 입력창에 다음 명령어를 입력하고 전송하세요:

```bash
/supermemory-init
```

**이유**
이는 미리 정의된 Prompt를 로드하고 Agent의 탐색 모드를 시작합니다.

**다음을 보아야 합니다**
Agent가 응답을 시작하며 작업을 이해했다고 표시하고 조사 단계를 계획하기 시작합니다. 다음과 같이 말할 수 있습니다: "I will start by exploring the codebase structure and configuration files..."

### 2단계: Agent의 탐색 과정 관찰

Agent가 일련의 작업을 자동으로 수행하며 당신은 그저 지켜보면 됩니다. 일반적으로 다음을 수행합니다:

1.  **구성 파일 읽기**: `package.json`, `tsconfig.json` 등을 읽어 기술 스택을 이해합니다.
2.  **Git 기록 확인**: `git log`를 실행하여 커밋 규칙과 활동적인 기여자를 이해합니다.
3.  **디렉토리 구조 탐색**: `ls` 또는 `list_files`를 사용하여 프로젝트 레이아웃을 봅니다.

**예시 출력**:
```
[Agent] Reading package.json to identify dependencies...
[Agent] Running git log to understand commit conventions...
```

::: tip 소비 알림
이 과정은 심층 조사이므로 많은 Token을 소비할 수 있습니다(일반적으로 50회 이상의 도구 호출). 완료될 때까지 인내심을 갖고 기다리세요.
:::

### 3단계: 생성된 메모리 확인

Agent가 초기화 완료를 알리면 무엇을 기억했는지 확인할 수 있습니다. 다음을 입력하세요:

```bash
/ask 현재 프로젝트의 메모리 나열
```

또는 원시 데이터를 보려면 도구를 직접 호출하세요:

```
supermemory(mode: "list", scope: "project")
```

**다음을 보아야 합니다**
Agent가 다음과 같은 구조화된 메모리 목록을 표시합니다:

| 유형 | 예시 내용 |
|--- | ---|
| `project-config` | "Uses Bun runtime. Build command: bun run build" |
| `architecture` | "API routes are located in src/routes/, using Hono framework" |
| `preference` | "Strict TypeScript usage: no 'any' type allowed" |

### 4단계: 누락된 정보 보완(선택사항)

Agent가 중요한 정보를 놓쳤다면(예: 구두로만 약속된 특수 규칙), 수동으로 보완할 수 있습니다:

```
기억해 주세요: 이 프로젝트에서는 모든 날짜 처리에 dayjs 라이브러리를 사용해야 하며, 기본 Date 객체 사용은 금지되어 있습니다.
```

**다음을 보아야 합니다**
Agent가 확인 응답을 보내고 `supermemory(mode: "add")`를 호출하여 이 새 규칙을 저장합니다.

## 체크포인트 ✅

- [ ] `/supermemory-init` 실행 후 Agent가 탐색 작업을 자동으로 수행했나요?
- [ ] `list` 명령어로 새로 생성된 메모리를 볼 수 있나요?
- [ ] 메모리 내용이 현재 프로젝트의 실제 상황을 정확하게 반영하고 있나요?

## 주의사항

::: warning 자주 실행하지 마세요
초기화는 시간이 많이 걸리고 Token을 소비하는 과정입니다. 일반적으로 각 프로젝트에서 한 번만 실행하면 됩니다. 프로젝트에 큰 변화가 있을 때만 다시 실행해야 합니다.
:::

::: danger 프라이버시 주의
플러그인은 `<private>` 태그 내의 내용을 자동으로 비식별화하지만, 초기화 과정에서 Agent는 많은 파일을 읽습니다. 코드베이스에 하드코딩된 민감한 키(예: AWS Secret Key)가 없는지 확인하세요. 그렇지 않으면 "프로젝트 설정"으로 메모리에 저장될 수 있습니다.
:::

## 이 수업 요약

`/supermemory-init`을 통해 "낯선 사람"에서 "숙련된 작업자"로의 전환을 완료했습니다. 이제 Agent는 프로젝트의 핵심 아키텍처와 규칙을 기억하며, 다음 코딩 작업에서 이러한 컨텍스트를 자동으로 활용하여 더 정확한 지원을 제공합니다.

## 다음 수업 예고

> 다음 수업에서 **[자동 컨텍스트 주입 메커니즘](./../../core/context-injection/index.md)**을 학습합니다.
>
> 배우게 될 내용:
> - Agent가 세션 시작 시 메모리를 어떻게 "떠올리는지"
> - 키워드로 특정 메모리를 검색하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보려면 클릭</strong></summary>

> 업데이트: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 초기화 Prompt 정의 | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L13-L163) | 13-163 |
| 메모리 도구 구현 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |

**주요 상수**:
- `SUPERMEMORY_INIT_COMMAND`: `/supermemory-init` 명령어의 구체적인 Prompt 내용을 정의하며 Agent에게 조사와 메모리 방법을 안내합니다.

</details>
