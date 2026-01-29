---
title: "컨텍스트 주입: 자동 메모리 로드 | opencode-supermemory"
sidebarTitle: "컨텍스트 주입"
subtitle: "자동 컨텍스트 주입 메커니즘: Agent에게 \"미리 아는\" 능력 부여"
description: "opencode-supermemory 컨텍스트 주입을 학습하세요. 세션 시작 시 프로필과 프로젝트 지식을 Agent에게 자동 주입합니다."
tags:
  - "context"
  - "injection"
  - "prompt"
  - "memory"
prerequisite:
  - "start-getting-started"
order: 1
---

# 자동 컨텍스트 주입 메커니즘: Agent에게 "미리 아는" 능력 부여

## 학습 완료 후 할 수 있는 것

이 수업을 완료하면 다음을 할 수 있습니다:
1.  **이해** 왜 Agent가 처음부터 당신의 코딩 습관과 프로젝트 아키텍처를 아는지.
2.  **마스터** 컨텍스트 주입의 "3차원 모델"(사용자 프로필, 프로젝트 지식, 관련 메모리).
3.  **학습** 키워드(예: "Remember this")를 사용하여 Agent의 메모리 동작을 능동적으로 제어.
4.  **설정** 주입 항목 수를 조절하여 컨텍스트 길이와 정보 풍부도의 균형 맞추기.

---

## 핵심 아이디어

메모리 플러그인 이전에는 새로운 세션을 시작할 때마다 Agent는 빈 상태였습니다. 매번 "나는 TypeScript를 사용해", "이 프로젝트는 Next.js를 사용해"라고 반복해서 말해야 했습니다.

**컨텍스트 주입(Context Injection)**이 이 문제를 해결합니다. Agent가 깨어나는 순간 "업무 브리핑"을 그 뇌에 주입하는 것과 같습니다.

### 트리거 타이밍

opencode-supermemory는 매우 절제적이며 **세션의 첫 번째 메시지**에만 자동 주입을 트리거합니다.

- **왜 첫 번째일까요?** 세션의 기조를 설정하는 핵심 순간이기 때문입니다.
- **후속 메시지는요?** 대화 흐름을 방해하지 않도록 후속 메시지에는 더 이상 자동 주입하지 않습니다. 다만 능동적 트리거가 있을 때는 제외(아래 "키워드 트리거" 참조).

### 3차원 주입 모델

플러그인은 병렬로 세 가지 유형의 데이터를 가져와 `[SUPERMEMORY]` 프롬프트 블록으로 조합합니다:

| 데이터 차원 | 출처 | 역할 | 예시 |
|--- | --- | --- | ---|
| **1. 사용자 프로필** (Profile) | `getProfile` | 당신의 장기적 선호도 | "사용자는 함수형 프로그래밍 선호", "화살표 함수 선호" |
| **2. 프로젝트 지식** (Project) | `listMemories` | 현재 프로젝트의 전역 지식 | "이 프로젝트는 Clean Architecture 사용", "API는 src/api에 위치" |
| **3. 관련 메모리** (Relevant) | `searchMemories` | 첫 문장과 관련된 과거 경험 | "이 버그를 어떻게 고치냐"라고 물으면 이전 유사 수정 기록 검색 |

---

## 무엇을 주입하나요?

OpenCode에서 첫 번째 메시지를 보낼 때 플러그인은 백그라운드에서 자동으로 다음 내용을 System Prompt에 삽입합니다.

::: details 주입 내용의 실제 구조 보려면 클릭
```text
[SUPERMEMORY]

User Profile:
- User prefers concise responses
- User uses Zod for all validations

Recent Context:
- Working on auth module refactoring

Project Knowledge:
- [100%] Architecture follows MVC pattern
- [100%] Use 'npm run test' for testing

Relevant Memories:
- [85%] Previous fix for hydration error: use useEffect
```
:::

Agent가 이 정보를 보면 오랫동안 이 프로젝트에서 일한 베테랑 직원처럼 행동하며 새로 온 인턴처럼 보이지 않습니다.

---

## 키워드 트리거 메커니즘 (Nudge)

시작 부분의 자동 주입 외에도 대화 중 언제든지 메모리 기능을 "깨울" 수 있습니다.

플러그인에는 **키워드 감지기**가 내장되어 있습니다. 메시지에 특정 트리거 단어가 포함되면 플러그인이 Agent에게 "보이지 않는 힌트"(Nudge)를 보내 저장 도구를 강제로 호출하게 합니다.

### 기본 트리거 단어

- `remember`
- `save this`
- `don't forget`
- `memorize`
- `take note`
- ... (소스 코드 구성에서 더 확인 가능)

### 상호작용 예시

**입력**:
> 이곳의 API 응답 형식이 변경되었습니다. **remember** 앞으로는 `data.result`가 아니라 `data.payload`를 사용하세요.

**플러그인이 "remember" 감지**:
> (백그라운드에서 힌트 주입): `[MEMORY TRIGGER DETECTED] The user wants you to remember something...`

**Agent 반응**:
> 확인했습니다. 이 변경사항을 기억하겠습니다.
> *(백그라운드에서 `supermemory.add`를 호출하여 메모리 저장)*

---

## 심층 설정

`~/.config/opencode/supermemory.jsonc`를 수정하여 주입 동작을 조절할 수 있습니다.

### 일반적인 설정 항목

```jsonc
{
  // 사용자 프로필 주입 여부(기본값 true)
  "injectProfile": true,

  // 각 주입 시 몇 개의 프로젝트 메모리를 주입할지(기본값 10)
  // 늘리면 Agent가 프로젝트를 더 잘 이해하지만 더 많은 Token을 소비
  "maxProjectMemories": 10,

  // 각 주입 시 몇 개의 사용자 프로필 항목을 주입할지(기본값 5)
  "maxProfileItems": 5,

  // 사용자 정의 트리거 단어(정규 표현식 지원)
  "keywordPatterns": [
    "기록해",
    "영구 저장"
  ]
}
```

::: tip 팁
설정을 수정한 후 OpenCode를 재시작하거나 플러그인을 다시 로드해야 적용됩니다.
:::

---

## 자주 묻는 질문

### Q: 주입된 정보가 많은 Token을 사용하나요?
**A**: 일부 사용하지만 일반적으로 제어 가능합니다. 기본 설정(10개 프로젝트 메모리 + 5개 프로필)에서 약 500-1000 Token을 사용합니다. Claude 3.5 Sonnet 같은 현대 대형 모델의 200k 컨텍스트에서는 이는 매우 작은 비중입니다.

### Q: "remember"라고 했는데 반응이 없어요?
**A**:
1. 철자가 올바른지 확인하세요(정규 표현식 매칭 지원).
2. API Key가 올바르게 구성되었는지 확인하세요(플러그인이 초기화되지 않으면 트리거되지 않음).
3. Agent가 무시하기로 결정했을 수 있습니다(플러그인이 강제로 힌트를 줬지만 Agent가 최종 결정권을 가짐).

### Q: "관련 메모리"는 어떻게 검색되나요?
**A**: **첫 번째 메시지 내용**을 기반으로 의미 검색을 수행합니다. 첫 문장이 "Hi"뿐이라면 유용한 관련 메모리를 찾지 못할 수 있지만 "프로젝트 지식"과 "사용자 프로필"은 여전히 주입됩니다.

---

## 이 수업 요약

- **자동 주입**은 세션 첫 번째 메시지에서만 트리거됩니다.
- **3차원 모델**은 사용자 프로필, 프로젝트 지식, 관련 메모리를 포함합니다.
- **키워드 트리거**를 통해 언제든지 Agent에 메모리 저장을 명령할 수 있습니다.
- **설정 파일**을 통해 주입 정보량을 제어할 수 있습니다.

## 다음 수업 예고

> 다음 수업에서 **[도구 세트 상세: Agent에게 메모리 가르치기](../tools/index.md)**를 학습합니다.
>
> 배우게 될 내용:
> - `add`, `search` 등 도구를 수동으로 사용하는 방법.
> - 잘못된 메모리를 보고 삭제하는 방법.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보려면 클릭</strong></summary>

> 업데이트: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 주입 트리거 로직 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L125-L176) | 125-176 |
| 키워드 감지 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Prompt 형식화 | [`src/services/context.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/context.ts#L14-L64) | 14-64 |
| 기본 설정 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |

**주요 함수**:
- `formatContextForPrompt()`: `[SUPERMEMORY]` 텍스트 블록을 조립합니다.
- `detectMemoryKeyword()`: 사용자 메시지에서 트리거 단어를 정규 표현식으로 매칭합니다.

</details>

## 다음 수업 예고

> 다음 수업에서 **[도구 세트 상세: Agent에게 메모리 가르치기](../tools/index.md)**를 학습합니다.
>
> 배우게 될 내용:
> - `add`, `search`, `profile` 등 5가지 핵심 도구 모드 마스터
> - 메모리를 수동으로 제어 및 수정하는 방법
> - 자연어로 메모리 저장 트리거
