---
title: "메모리 범위와 생명주기 관리 | opencode-supermemory"
sidebarTitle: "메모리 관리"
subtitle: "메모리 범위와 생명주기: 디지털 뇌 관리"
description: "학습하세요: opencode-supermemory의 User/Project 범위와 메모리 CRUD 작업으로 프로젝트 간 경험 재사용과 격리를 실현하세요."
tags:
  - "memory-management"
  - "scope"
  - "crud"
prerequisite:
  - "core-tools"
order: 3
---

# 메모리 범위와 생명주기: 디지털 뇌 관리

## 학습 완료 후 할 수 있는 것

- **범위 구분**: 어떤 메모리가 "나를 따라가는"(프로젝트 간) 것이고, 어떤 것이 "프로젝트를 따라가는"(프로젝트 전용) 것인지 이해.
- **메모리 관리**: 수동으로 메모리를 보고, 추가하고, 삭제하여 Agent의 인지를 깨끗하게 유지.
- **Agent 디버깅**: Agent가 "잘못 기억"하고 있을 때, 어디서 수정할지 알 수 있음.

## 핵심 아이디어

opencode-supermemory는 메모리를 두 개의 격리된 **범위(Scope)**로 나눕니다. 이는 프로그래밍 언어의 전역 변수와 지역 변수와 유사합니다.

### 1. 두 가지 범위

| 범위 | 식별자(Scope ID) | 생명주기 | 전형적인 용도 |
| :--- | :--- | :--- | :--- |
| **User Scope**<br>(사용자 범위) | `user` | **영구적으로 따라감**<br>모든 프로젝트에 걸쳐 공유 | • 코딩 스타일 기본 설정 (예: "TypeScript 선호")<br>• 개인 습관 (예: "항상 주석 작성")<br>• 일반적인 지식 |
| **Project Scope**<br>(프로젝트 범위) | `project` | **현재 프로젝트에 한함**<br>디렉토리 전환 시 무효화 | • 프로젝트 아키텍처 설계<br>• 비즈니스 로직 설명<br>• 특정 버그 수정 방안 |

::: info 범위는 어떻게 생성되나요?
플러그인은 `src/services/tags.ts`를 통해 자동으로 고유한 태그를 생성:
- **User Scope**: Git 이메일 해시 기반 (`opencode_user_{hash}`).
- **Project Scope**: 현재 프로젝트 경로 해시 기반 (`opencode_project_{hash}`).
:::

### 2. 메모리의 생명주기

1.  **생성(Add)**: CLI 초기화 또는 Agent 대화(`Remember this...`)를 통해 작성.
2.  **활성화(Inject)**: 새로운 세션을 시작할 때마다, 플러그인은 관련된 User와 Project 메모리를 자동으로 가져와 컨텍스트에 주입.
3.  **검색(Search)**: 대화 중 Agent가 특정 메모리를 능동적으로 검색 가능.
4.  **망각(Forget)**: 메모리가 오래되었거나 잘못되었을 때, ID를 통해 삭제.

---

## 함께 따라하세요: 메모리 관리

Agent와 대화하여 두 범위의 메모리를 수동으로 관리해 보겠습니다.

### 1단계: 기존 메모리 확인

먼저, Agent가 현재 무엇을 기억하고 있는지 확인하세요.

**작업**: OpenCode 채팅창에 입력:

```text
현재 프로젝트의 모든 메모리를 나열해 주세요 (List memories in project scope)
```

**다음을 보아야 합니다**:
Agent가 `supermemory` 도구의 `list` 모드를 호출하고 목록을 반환:

```json
// 예시 출력
{
  "success": true,
  "scope": "project",
  "count": 3,
  "memories": [
    {
      "id": "mem_123456",
      "content": "프로젝트는 MVC 아키텍처를 사용하며, Service 계층이 비즈니스 로직 담당",
      "createdAt": "2023-10-01T10:00:00Z"
    }
    // ...
  ]
}
```

### 2단계: 프로젝트 간 메모리 추가(User Scope)

Agent가 **모든** 프로젝트에서 한국어로 응답하길 원한다고 가정해 봅시다. 이는 User Scope에 적합한 메모리입니다.

**작업**: 다음 명령어를 입력:

```text
나의 개인 기본 설정을 기억해 주세요: 어떤 프로젝트든 항상 한국어로 응답해 주세요.
이것을 User Scope에 저장해 주세요.
```

**다음을 보아야 합니다**:
Agent가 `add` 도구를 호출하며, 매개변수 `scope: "user"`:

```json
{
  "mode": "add",
  "content": "User prefers responses in Korean across all projects",
  "scope": "user",
  "type": "preference"
}
```

시스템이 메모리 추가를 확인하고 `id`를 반환.

### 3단계: 프로젝트 전용 메모리 추가(Project Scope)

이제 **현재 프로젝트**에 특정 규칙을 추가해 보겠습니다.

**작업**: 다음 명령어를 입력:

```text
기억해 주세요: 이 프로젝트에서 모든 날짜 형식은 YYYY-MM-DD이어야 합니다.
Project Scope에 저장해 주세요.
```

**다음을 보아야 합니다**:
Agent가 `add` 도구를 호출하며, 매개변수 `scope: "project"`(기본값, Agent가 생략할 수 있음):

```json
{
  "mode": "add",
  "content": "Date format must be YYYY-MM-DD in this project",
  "scope": "project",
  "type": "project-config"
}
```

### 4단계: 격리성 확인

범위가 적용되었는지 확인하기 위해 검색을 시도해 봅시다.

**작업**: 입력:

```text
"날짜 형식"에 관한 메모리를 검색해 주세요
```

**다음을 보아야 합니다**:
Agent가 `search` 도구를 호출. `scope: "project"`를 지정하거나 혼합 검색을 수행하면, 방금 추가한 메모리를 찾아야 함.

::: tip 프로젝트 간 능력 확인
새로운 터미널 창을 열어 다른 프로젝트 디렉토리로 이동한 후, 다시 "날짜 형식"을 물어보면, Agent는 **찾을 수 없음**(원래 프로젝트의 Project Scope에 격리되어 있기 때문). 하지만 "어떤 언어로 응답하기를 원하나요"를 물어보면, User Scope에서 "한국어 응답" 기본 설정을 찾을 수 있음.
:::

### 5단계: 오래된 메모리 삭제

프로젝트 규칙이 변경되면, 오래된 메모리를 삭제해야 합니다.

**작업**:
1. 먼저 **1단계**를 수행하여 메모리 ID를 확인(예: `mem_987654`).
2. 명령어 입력:

```text
ID가 mem_987654인 날짜 형식에 관한 메모리를 잊어 주세요.
```

**다음을 보아야 합니다**:
Agent가 `forget` 도구를 호출:

```json
{
  "mode": "forget",
  "memoryId": "mem_987654"
}
```

시스템이 `success: true`를 반환.

---

## 자주 묻는 질문(FAQ)

### Q: 컴퓨터를 바꾸면 User Scope의 메모리가 남아있나요?
**A: Git 설정에 따라 다릅니다.**
User Scope는 `git config user.email`을 기반으로 생성됩니다. 두 컴퓨터에서 동일한 Git 이메일을 사용하고, 동일한 Supermemory 계정(동일한 API Key 사용)에 연결되어 있다면, 메모리는 **동기화**됩니다.

### Q: 방금 추가한 메모리가 보이지 않는 이유는 무엇인가요?
**A: 캐시 또는 인덱스 지연일 수 있습니다.**
Supermemory의 벡터 인덱스는 보통 초 단위이지만, 네트워크 불안정 시 일시적인 지연이 있을 수 있습니다. 또한, Agent는 세션 시작 시 주입하는 컨텍스트가 **정적**(스냅샷)이므로, 새로 추가한 메모리는 "자동 주입"에 적용되려면 세션을 재시작(`/clear` 또는 OpenCode 재시작)해야 하지만, `search` 도구를 통해 즉시 검색할 수 있습니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보려면 클릭</strong></summary>

> 업데이트: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| :--- | :--- | :--- |
| Scope 생성 로직 | [`src/services/tags.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/tags.ts#L18-L36) | 18-36 |
| 메모리 도구 정의 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| 메모리 타입 정의 | [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) | - |
| 클라이언트 구현 | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 23-182 |

**핵심 함수**:
- `getUserTag()`: Git 이메일 기반 사용자 태그 생성
- `getProjectTag()`: 디렉토리 경로 기반 프로젝트 태그 생성
- `supermemoryClient.addMemory()`: 메모리 추가 API 호출
- `supermemoryClient.deleteMemory()`: 메모리 삭제 API 호출

</details>

## 다음 수업 예고

> 다음 수업에서 **[선점형 압축 원리](../../advanced/compaction/index.md)**를 학습합니다.
>
> 배우게 될 내용:
> - 왜 Agent가 "망각"하는지(컨텍스트 오버플로우)
> - 플러그인이 어떻게 자동으로 Token 사용률을 감지하는지
> - 핵심 정보를 잃지 않으면서 세션을 압축하는 방법
