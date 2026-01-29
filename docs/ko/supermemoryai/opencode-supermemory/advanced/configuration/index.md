---
title: "고급 설정: 메모리 엔진 사용자 정의 | opencode-supermemory"
sidebarTitle: "고급 설정"
subtitle: "심층 설정 상세: 메모리 엔진 사용자 정의"
description: "마스터하세요: opencode-supermemory 고급 설정. 트리거 키워드 사용자 정의, 컨텍스트 주입 전략, 압축 임계값 최적화 방법을 다룹니다."
tags:
  - "설정"
  - "고급"
  - "사용자 정의"
prerequisite:
  - "start-getting-started"
order: 2
---

# 심층 설정 상세: 메모리 엔진 사용자 정의

## 학습 완료 후 할 수 있는 것

- **사용자 정의 트리거**: Agent가 사용자의 전용 명령어(예: "기록하기", "mark")를 이해하도록.
- **메모리 용량 조정**: 컨텍스트에 주입할 메모리 수 제어하여 Token 소비와 정보량의 균형 유지.
- **압축 전략 최적화**: 프로젝트 규모에 따라 선점형 압축의 트리거 시점 조정.
- **다중 환경 관리**: 환경 변수를 통해 API Key를 유연하게 전환.

## 설정 파일 위치

opencode-supermemory는 다음 순서대로 설정 파일을 찾으며, **찾으면 즉시 종료**:

1. `~/.config/opencode/supermemory.jsonc`(권장, 주석 지원)
2. `~/.config/opencode/supermemory.json`

::: tip 왜 .jsonc를 권장하나요?
`.jsonc` 형식은 JSON에서 주석(`//`)을 작성할 수 있어, 설정 항목의 용도를 설명하기에 적합.
:::

## 핵심 설정 상세

다음은 모든 사용 가능한 옵션과 기본값을 포함한 완전한 설정 예시입니다.

### 기본 설정

```jsonc
// ~/.config/opencode/supermemory.jsonc
{
  // Supermemory API Key
  // 우선순위: 설정 파일 > 환경 변수 SUPERMEMORY_API_KEY
  "apiKey": "your-api-key-here",

  // 시맨틱 검색 유사도 임계값 (0.0 - 1.0)
  // 값이 높을수록 검색 결과가 더 정확하지만 수량이 줄어들고, 값이 낮을수록 결과가 더 분산됨
  "similarityThreshold": 0.6
}
```

### 컨텍스트 주입 제어

이 설정은 Agent가 세션을 시작할 때, 자동으로 읽을 메모리 양을 결정합니다.

```jsonc
{
  // 사용자 프로필(User Profile) 자동 주입 여부
  // false로 설정하면 Token을 절약할 수 있지만, Agent는 기본 기본 설정을 잊을 수 있음
  "injectProfile": true,

  // 주입할 사용자 프로필 항목 최대 수
  "maxProfileItems": 5,

  // 주입할 사용자 수준 메모리(User Scope) 최대 수
  // 이는 프로젝트 간 공유되는 일반적인 메모리
  "maxMemories": 5,

  // 주입할 프로젝트 수준 메모리(Project Scope) 최대 수
  // 이는 현재 프로젝트에 특유한 메모리
  "maxProjectMemories": 10
}
```

### 사용자 정의 트리거

Agent가 특정 명령어를 인식하고 자동으로 메모리를 저장하도록 하기 위해, 사용자 정의 정규 표현식을 추가할 수 있습니다.

```jsonc
{
  // 사용자 정의 트리거 키워드 목록(정규 표현식 지원)
  // 이 키워드는 내장된 기본 트리거 키워드와 병합하여 적용
  "keywordPatterns": [
    "기록하기",           // 단순 매칭
    "mark\\s+this",     // 정규 표현식: mark this
    "중요[:：]",         // "중요:" 또는 "중요：" 매칭
    "TODO\\(memory\\)"  // 특정 표시 매칭
  ]
}
```

::: details 내장 기본 트리거 보기
플러그인은 다음 기본 트리거를 내장하고 있어, 설정 없이 사용 가능:
- `remember`, `memorize`
- `save this`, `note this`
- `keep in mind`, `don't forget`
- `learn this`, `store this`
- `record this`, `make a note`
- `take note`, `jot down`
- `commit to memory`
- `remember that`
- `never forget`, `always remember`
:::

### 선점형 압축(Preemptive Compaction)

세션 컨텍스트가 너무 길면, 플러그인은 자동으로 압축 메커니즘을 트리거합니다.

```jsonc
{
  // 압축 트리거 임계값 (0.0 - 1.0)
  // Token 사용률이 이 비율을 초과하면 압축 트리거
  // 기본 0.80 (80%)
  "compactionThreshold": 0.80
}
```

::: warning 임계값 설정 권장
- **너무 높게 설정**(예: > 0.95): 압축 완료 전에 컨텍스트 윈도우가 고갈될 수 있음.
- **너무 낮게 설정**(예: < 0.50): 빈번한 압축으로 플로우가 끊기고 Token 낭비 발생.
- **권장 값**: 0.70 - 0.85 사이.
:::

## 환경 변수 지원

설정 파일 외에도, 환경 변수를 사용하여 민감한 정보를 관리하거나 기본 동작을 재정의할 수 있습니다.

| 환경 변수 | 설명 | 우선순위 |
| :--- | :--- | :--- |
| `SUPERMEMORY_API_KEY` | Supermemory API 키 | 설정 파일보다 낮음 |
| `USER` 또는 `USERNAME` | 사용자 범위 Hash 생성 식별자 | 시스템 기본값 |

### 사용 시나리오: 다중 환경 전환

회사와 개인 프로젝트에서 서로 다른 Supermemory 계정을 사용하는 경우, 환경 변수를 활용할 수 있습니다:

::: code-group

```bash [macOS/Linux]
# .zshrc 또는 .bashrc에 기본 Key 설정
export SUPERMEMORY_API_KEY="key_personal"

# 회사 프로젝트 디렉토리에서 Key 일시 재정의
export SUPERMEMORY_API_KEY="key_work" && opencode
```

```powershell [Windows]
# 환경 변수 설정
$env:SUPERMEMORY_API_KEY="key_work"
opencode
```

:::

## 함께 따라하세요: 전용 설정 사용자 정의

대부분 개발자에게 적합한 최적화된 설정을 만들어 보겠습니다.

### 1단계: 설정 파일 생성

파일이 없으면 생성하세요.

```bash
mkdir -p ~/.config/opencode
touch ~/.config/opencode/supermemory.jsonc
```

### 2단계: 최적화된 설정 작성

다음 내용을 `supermemory.jsonc`에 복사하세요. 이 설정은 프로젝트 메모리의 가중치를 높이고 한국어 트리거를 추가합니다.

```jsonc
{
  // 기본 유사도 유지
  "similarityThreshold": 0.6,

  // 프로젝트 메모리 수 증가, 일반 메모리 감소, 딥 개발에 적합
  "maxMemories": 3,
  "maxProjectMemories": 15,

  // 한국어 습관에 맞는 트리거 추가
  "keywordPatterns": [
    "기록하기",
    "기억하기",
    "메모 저장",
    "잊지 마세요"
  ],

  // 압축을 조금 일찍 트리거하여 더 많은 안전 공간 확보
  "compactionThreshold": 0.75
}
```

### 3단계: 설정 확인

OpenCode를 재시작한 후, 대화에서 새로 정의한 트리거를 사용해 보세요:

```
사용자 입력:
기록하기: 이 프로젝트의 API 기본 경로는 /api/v2

시스템 응답(예상):
(Agent가 supermemory 도구를 호출하여 메모리 저장)
메모리가 저장되었습니다: 이 프로젝트의 API 기본 경로는 /api/v2
```

## 자주 묻는 질문

### Q: 설정 수정 후 재시작이 필요한가요?
**A: 네.** 플러그인은 시작 시 설정을 로드하므로, `supermemory.jsonc`를 수정한 후 반드시 OpenCode를 재시작해야 적용됩니다.

### Q: `keywordPatterns`는 한국어 정규 표현식을 지원하나요?
**A: 네.** 내부적으로 JavaScript의 `new RegExp()`를 사용하며, 완전히 Unicode 문자를 지원합니다.

### Q: 설정 파일 형식이 잘못되면 어떻게 되나요?
**A: 플러그인은 기본값으로 되돌아갑니다.** JSON 형식이 유효하지 않으면(예: 불필요한 쉼표), 플러그인은 오류를 감지하고 내장된 `DEFAULTS`를 사용하며, OpenCode가 충돌하지 않습니다.

## 다음 수업 예고

> 다음 수업에서 **[프라이버시와 데이터 보안](../../security/privacy/)**를 학습합니다.
>
> 배우게 될 내용:
> - 민감한 데이터 자동 마스킹 메커니즘
> - `<private>` 태그를 사용하여 프라이버시 보호
> - 데이터 저장의 보안 경계

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보려면 클릭</strong></summary>

> 업데이트: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| :--- | :--- | :--- |
| 설정 인터페이스 정의 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L12-L23) | 12-23 |
| 기본값 정의 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |
| 기본 트리거 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L25-L42) | 25-42 |
| 설정 파일 로드 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L73-L86) | 73-86 |
| 환경 변수 읽기 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |

</details>
