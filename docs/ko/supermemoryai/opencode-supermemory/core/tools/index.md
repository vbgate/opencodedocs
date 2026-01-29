---
title: "도구 세트: 메모리 제어 | opencode-supermemory"
sidebarTitle: "도구 세트"
subtitle: "도구 세트 상세: Agent에게 메모리 가르치기"
description: "supermemory의 5가지 핵심 모드를 마스터하세요. 자연어로 Agent 메모리를 추가, 검색, 삭제하는 방법을 배웁니다."
tags:
  - "도구 사용"
  - "메모리 관리"
  - "핵심 기능"
prerequisite:
  - "start-getting-started"
order: 2
---

# 도구 세트 상세: Agent에게 메모리 가르치기

## 학습 완료 후 할 수 있는 것

이 수업에서는 `supermemory` 플러그인의 핵심 상호작용 방식을 마스터합니다. Agent가 일반적으로 메모리를 자동으로 관리하지만 개발자로서 수동으로 제어해야 할 때가 자주 있습니다.

이 수업을 완료하면 다음을 할 수 있습니다:
1.  `add` 모드를 사용하여 핵심 기술 의사결정을 수동으로 저장.
2.  `search` 모드를 사용하여 Agent가 선호도를 기억하는지 확인.
3.  `profile`을 사용하여 Agent가 보는 "당신"을 확인.
4.  `list`와 `forget`을 사용하여 오래되거나 잘못된 메모리를 정리.

## 핵심 아이디어

opencode-supermemory는 블랙박스가 아니며 표준 OpenCode Tool 프로토콜을 통해 Agent와 상호작용합니다. 이는 함수를 호출하는 것처럼 호출할 수도 있고 자연어로 Agent에 사용하도록 지시할 수도 있음을 의미합니다.

플러그인은 Agent에 `supermemory`라는 도구를 등록하며 이는 스위스 아미 나이프와 같이 6가지 모드를 갖습니다:

| 모드 | 역할 | 일반적인 시나리오 |
|--- | --- | ---|
| **add** | 메모리 추가 | "기억해, 이 프로젝트는 반드시 Bun으로 실행해야 해" |
| **search** | 메모리 검색 | "인증 처리를 어떻게 하는지 말한 적이 있나요?" |
| **profile** | 사용자 프로필 | Agent가 요약한 당신의 코딩 습관 확인 |
| **list** | 메모리 나열 | 최근 저장된 10개 메모리 감사 |
| **forget** | 메모리 삭제 | 잘못된 설정 레코드 삭제 |
| **help** | 사용 가이드 | 도구 도움말 문서 확인 |

::: info 자동 트리거 메커니즘
수동 호출 외에도 플러그인은 채팅 내용을 감시합니다. 자연어로 "Remember this" 또는 "Save this"라고 말하면 플러그인이 키워드를 자동으로 감지하고 Agent에 `add` 도구를 강제로 호출하게 합니다.
:::

## 함께 따라하세요: 수동 메모리 관리

일반적으로 Agent가 자동으로 작동하도록 하지만 디버깅이나 초기 메모리를 구축할 때 수동으로 도구를 호출하는 것이 매우 유용합니다. OpenCode 대화창에서 자연어로 Agent에 이러한 작업을 수행하도록 지시할 수 있습니다.

### 1. 메모리 추가 (Add)

가장 자주 사용하는 기능입니다. 메모리의 내용, 유형, 범위를 지정할 수 있습니다.

**작업**: 프로젝트 아키텍처에 대한 메모리를 저장하도록 Agent에 지시.

**입력 명령어**:
```text
supermemory 도구를 사용하여 메모리를 저장하세요:
내용: "이 프로젝트의 모든 서비스 레이어 코드는 반드시 src/services 디렉토리에 있어야 합니다"
유형: architecture
범위: project
```

**Agent의 내부 동작**(소스 코드 로직):
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "add",
    "content": "이 프로젝트의 모든 서비스 레이어 코드는 반드시 src/services 디렉토리에 있어야 합니다",
    "type": "architecture",
    "scope": "project"
  }
}
```

**다음을 보아야 합니다**:
Agent가 다음과 같은 확인 메시지를 반환합니다:
> ✅ Memory added to project scope (ID: mem_12345...)

::: tip 메모리 유형(Type) 선택
검색을 더 정확하게 하려면 정확한 유형을 사용하는 것이 좋습니다:
- `project-config`: 기술 스택, 도구체인 설정
- `architecture`: 아키텍처 패턴, 디렉토리 구조
- `preference`: 당신의 개인 코딩 선호도(예: "화살표 함수 선호")
- `error-solution`: 특정 오류에 대한 특정 솔루션
- `learned-pattern`: Agent가 관찰한 코드 패턴
:::

### 2. 메모리 검색 (Search)

Agent가 무언가를 "알고" 있는지 확인하려면 검색 기능을 사용하세요.

**작업**: "서비스"에 대한 메모리 검색.

**입력 명령어**:
```text
supermemory를 쿼리하세요. 키워드는 "services", 범위는 project입니다.
```

**Agent의 내부 동작**:
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "search",
    "query": "services",
    "scope": "project"
  }
}
```

**다음을 보아야 합니다**:
Agent가 관련 메모리 조각 및 유사도(Similarity)를 나열합니다.

### 3. 사용자 프로필 확인 (Profile)

Supermemory는 당신의 장기적 선호도를 포함하는 "사용자 프로필"을 자동으로 유지합니다.

**작업**: 프로필 확인.

**입력 명령어**:
```text
supermemory 도구의 profile 모드를 호출하여 나에 대해 무엇을 알고 있는지 확인하세요.
```

**다음을 보아야 합니다**:
두 가지 유형의 정보를 반환합니다:
- **Static**: 정적 사실(예: "사용자는 풀스택 엔지니어")
- **Dynamic**: 동적 선호도(예: "사용자는 최근 Rust에 관심을 가짐")

### 4. 감사 및 삭제 (List & Forget)

Agent가 잘못된 정보를 기억했다면(예: 이미 폐기된 API Key), 삭제해야 합니다.

**1단계: 최근 메모리 나열**
```text
최근 5개 프로젝트 메모리를 나열하세요.
```
*(Agent가 `mode: "list", limit: 5`를 호출)*

**2단계: ID 가져오기 및 삭제**
잘못된 메모리 ID가 `mem_abc123`이라고 가정.

```text
메모리 ID가 mem_abc123인 레코드를 삭제하세요.
```
*(Agent가 `mode: "forget", memoryId: "mem_abc123"`를 호출)*

**다음을 보아야 합니다**:
> ✅ Memory mem_abc123 removed from project scope

## 고급: 자연어 트리거

매번 도구 파라미터를 자세히 설명할 필요가 없습니다. 플러그인에는 키워드 감지 메커니즘이 내장되어 있습니다.

**시도해 보세요**:
대화에서 직접 다음과 같이 말하세요:
> **Remember this**: 모든 날짜 처리는 date-fns 라이브러리를 사용해야 하며 moment.js 사용은 금지되어 있습니다.

**무슨 일이 일어났나요?**
1.  플러그인의 `chat.message` 훅이 "Remember this" 키워드를 감지.
2.  플러그인이 Agent에 시스템 힌트를 주입: `[MEMORY TRIGGER DETECTED]`.
3.  Agent가 명령어 수신: "You MUST use the supermemory tool with mode: 'add'...".
4.  Agent가 자동으로 내용을 추출하고 도구를 호출.

이는 매우 자연스러운 상호작용 방식으로 코딩 과정에서 언제든지 지식을 "고정"할 수 있습니다.

## 자주 묻는 질문 (FAQ)

**Q: `scope` 기본값은 무엇인가요?**
A: 기본값은 `project`입니다. 프로젝트 간 공통 선호도(예: "나는 항상 TypeScript를 사용")를 저장하려면 명시적으로 `scope: "user"`를 지정하세요.

**Q: 추가한 메모리가 즉시 적용되지 않는 이유는 무엇인가요?**
A: `add` 작업은 비동기입니다. 일반적으로 Agent는 도구 호출 성공 후 즉시 새 메모리를 "알게" 되지만 일부 극단적인 네트워크 지연에서는 몇 초가 걸릴 수 있습니다.

**Q: 민감 정보가 업로드되나요?**
A: 플러그인은 `<private>` 태그 내의 내용을 자동으로 비식별화합니다. 그러나 보안을 위해 비밀번호나 API Key를 메모리에 넣지 않는 것이 좋습니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보려면 클릭</strong></summary>

> 업데이트: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 도구 정의 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| 키워드 감지 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| 트리거 Prompt | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L20-L28) | 20-28 |
| 클라이언트 구현 | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 전체 |

**주요 유형 정의**:
- `MemoryType`: [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)에 정의
- `MemoryScope`: [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)에 정의

</details>

## 다음 수업 예고

> 다음 수업에서 **[메모리 범위 및 생명주기](../memory-management/index.md)**를 학습합니다.
>
> 배우게 될 내용:
> - User Scope와 Project Scope의 기본 격리 메커니즘
> - 효율적인 메모리 파티셔닝 전략 설계
> - 메모리 생명주기 관리
