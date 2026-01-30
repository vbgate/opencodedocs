---
title: "계획 검토: AI 계획을 시각적으로 검토하기 | Plannotator"
subtitle: "계획 검토 기초: AI 계획을 시각적으로 검토하기"
description: "Plannotator 계획 검토 기능을 배워보세요. 시각적 인터페이스로 AI가 생성한 계획을 검토하고, 주석을 추가하여 승인하거나 거부하는 방법과 Approve와 Request Changes의 차이점을 알아봅니다."
sidebarTitle: "5분 만에 계획 검토 배우기"
tags:
  - "계획 검토"
  - "시각적 검토"
  - "주석"
  - "승인"
  - "거부"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 1
---

# 계획 검토 기초: AI 계획을 시각적으로 검토하기

## 이 강의를 마치면 할 수 있는 것

- ✅ Plannotator 시각적 인터페이스로 AI가 생성한 계획 검토하기
- ✅ 계획 텍스트를 선택하고 다양한 유형의 주석 추가하기 (삭제, 대체, 코멘트)
- ✅ 계획을 승인하여 AI가 구현을 계속하도록 하기
- ✅ 계획을 거부하고 주석을 피드백으로 AI에게 전송하기
- ✅ 주석 유형의 사용 시나리오와 차이점 이해하기

## 현재 겪고 있는 어려움

**문제 1**: AI가 생성한 구현 계획을 터미널에서 읽으면 텍스트 양이 많고 구조가 불명확해서 검토하기 힘듭니다.

**문제 2**: AI에게 피드백을 주고 싶을 때 "3번째 단락 삭제", "이 함수 수정" 같은 텍스트 설명만 가능해서 소통 비용이 높고, AI가 잘못 이해할 수도 있습니다.

**문제 3**: 계획 중 일부는 수정이 필요 없고, 일부는 대체가 필요하고, 일부는 코멘트가 필요한데, 이런 피드백을 구조화해주는 도구가 없습니다.

**문제 4**: AI에게 계획을 승인했는지, 수정이 필요한지 어떻게 알려야 할지 모르겠습니다.

**Plannotator가 도와드립니다**:
- 터미널 대신 시각적 UI로 명확한 구조 제공
- 텍스트 선택만으로 주석 추가 가능 (삭제, 대체, 코멘트), 정확한 피드백
- 주석이 자동으로 구조화된 데이터로 변환되어 AI가 의도를 정확히 이해
- 원클릭 승인 또는 거부, AI가 즉시 응답

## 언제 이 기능을 사용하나요

**사용 시나리오**:
- AI Agent가 계획을 완료하고 `ExitPlanMode` 호출 시 (Claude Code)
- AI Agent가 `submit_plan` 도구 호출 시 (OpenCode)
- AI가 생성한 구현 계획을 검토해야 할 때
- 계획에 대한 수정 의견을 정확하게 피드백해야 할 때

**적합하지 않은 시나리오**:
- AI에게 직접 코드 구현을 시킬 때 (계획 검토 건너뛰기)
- 이미 계획을 승인했고, 실제 코드 변경을 검토해야 할 때 (코드 검토 기능 사용)

## 🎒 시작하기 전 준비사항

**사전 조건**:
- ✅ Plannotator CLI 설치 완료 ([빠른 시작](../start/getting-started/) 참조)
- ✅ Claude Code 또는 OpenCode 플러그인 설정 완료 (해당 설치 가이드 참조)
- ✅ AI Agent가 계획 검토 지원 (Claude Code 2.1.7+, 또는 OpenCode)

**트리거 방식**:
- **Claude Code**: AI가 plan을 완료하면 자동으로 `ExitPlanMode` 호출, Plannotator 자동 시작
- **OpenCode**: AI가 `submit_plan` 도구 호출, Plannotator 자동 시작

## 핵심 개념

### 계획 검토란 무엇인가

**계획 검토**는 Plannotator의 핵심 기능으로, AI가 생성한 구현 계획을 시각적으로 검토하는 데 사용됩니다.

::: info 왜 계획 검토가 필요한가요?
AI가 계획을 생성한 후 보통 "이 계획 괜찮나요?" 또는 "구현을 시작할까요?"라고 묻습니다. 시각적 도구가 없으면 터미널에서 순수 텍스트 계획을 읽고 "좋아요", "안 돼요, XX 수정해주세요" 같은 모호한 피드백만 할 수 있습니다. Plannotator를 사용하면 시각적 인터페이스로 계획을 보고, 수정이 필요한 부분을 정확히 선택하여 구조화된 주석을 추가할 수 있어 AI가 의도를 더 쉽게 이해합니다.
:::

### 워크플로우

```
┌─────────────────┐
│  AI Agent      │
│  (계획 생성)    │
└────────┬────────┘
         │
         │ ExitPlanMode / submit_plan
         ▼
┌─────────────────┐
│ Plannotator UI  │  ← 브라우저 자동 열림
│                 │
│ ┌───────────┐  │
│ │ 계획 내용   │  │
│ │ (Markdown) │  │
│ └───────────┘  │
│       │         │
│       │ 텍스트 선택
│       ▼         │
│ ┌───────────┐  │
│ │ 주석 추가   │  │
│ │ Delete/    │  │
│ │ Replace/   │  │
│ │ Comment    │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ 결정      │  │
│ │ Approve/  │  │
│ │ Request   │  │
│ │ Changes   │  │
│ └───────────┘  │
└────────┬────────┘
         │
         │ {"behavior": "allow"} 또는
         │ {"behavior": "deny", "message": "..."}
         ▼
┌─────────────────┐
│  AI Agent      │
│  (구현 계속)    │
└─────────────────┘
```

### 주석 유형

Plannotator는 네 가지 주석 유형을 지원하며, 각각 다른 용도가 있습니다:

| 주석 유형 | 용도 | AI가 받는 피드백 |
| --- | --- | --- |
| **Delete** | 불필요한 내용 삭제 | "삭제: [선택한 텍스트]" |
| **Replace** | 더 나은 내용으로 대체 | "대체: [선택한 텍스트]를 [입력한 텍스트]로" |
| **Comment** | 특정 내용에 코멘트, 수정 요구 없음 | "코멘트: [선택한 텍스트]. 설명: [입력한 코멘트]" |
| **Global Comment** | 전역 코멘트, 특정 텍스트와 연결 없음 | "전역 코멘트: [입력한 코멘트]" |

### Approve vs Request Changes

| 결정 유형 | 동작 | AI가 받는 피드백 | 적용 시나리오 |
| --- | --- | --- | --- |
| **Approve** | Approve 버튼 클릭 | `{"behavior": "allow"}` | 계획에 문제 없음, 바로 승인 |
| **Request Changes** | Request Changes 버튼 클릭 | `{"behavior": "deny", "message": "..."}` | 수정이 필요한 부분 있음 |

::: tip Claude Code와 OpenCode의 차이점
- **Claude Code**: Approve 시 주석을 전송하지 않음 (주석 무시됨)
- **OpenCode**: Approve 시 주석을 메모로 전송 가능 (선택사항)

**계획 거부 시**: 어느 플랫폼이든 주석이 AI에게 전송됨
:::

## 따라하기

### 1단계: 계획 검토 트리거

**Claude Code 예시**:

Claude Code에서 AI와 대화하여 구현 계획을 생성하도록 합니다:

```
사용자: 사용자 인증 모듈 구현 계획을 작성해줘

Claude: 네, 구현 계획입니다:
1. 사용자 모델 생성
2. 회원가입 API 구현
3. 로그인 API 구현
...
(AI가 ExitPlanMode 호출)
```

**OpenCode 예시**:

OpenCode에서 AI는 자동으로 `submit_plan` 도구를 호출합니다.

**확인해야 할 것**:
1. 브라우저가 자동으로 Plannotator UI를 엽니다
2. AI가 생성한 계획 내용이 표시됩니다 (Markdown 형식)
3. 페이지 하단에 "Approve"와 "Request Changes" 버튼이 있습니다

### 2단계: 계획 내용 살펴보기

브라우저에서 계획을 확인합니다:

- 계획이 Markdown 형식으로 렌더링됩니다 (제목, 단락, 목록, 코드 블록 포함)
- 스크롤하여 전체 계획을 볼 수 있습니다
- 라이트/다크 모드 전환 지원 (오른쪽 상단의 테마 전환 버튼 클릭)

### 3단계: 계획 텍스트 선택하고 주석 추가하기

**Delete 주석 추가**:

1. 마우스로 계획에서 삭제할 텍스트를 선택합니다
2. 팝업 툴바에서 **Delete** 버튼을 클릭합니다
3. 텍스트가 삭제 스타일로 표시됩니다 (빨간색 취소선)

**Replace 주석 추가**:

1. 마우스로 계획에서 대체할 텍스트를 선택합니다
2. 팝업 툴바에서 **Replace** 버튼을 클릭합니다
3. 팝업 입력창에 대체할 내용을 입력합니다
4. Enter를 누르거나 확인을 클릭합니다
5. 원본 텍스트가 대체 스타일로 표시되고 (노란색 배경), 아래에 대체 내용이 표시됩니다

**Comment 주석 추가**:

1. 마우스로 계획에서 코멘트할 텍스트를 선택합니다
2. 팝업 툴바에서 **Comment** 버튼을 클릭합니다
3. 팝업 입력창에 코멘트 내용을 입력합니다
4. Enter를 누르거나 확인을 클릭합니다
5. 텍스트가 코멘트 스타일로 표시되고 (파란색 하이라이트), 사이드바에 코멘트가 표시됩니다

**Global Comment 추가**:

1. 페이지 오른쪽 상단의 **Add Global Comment** 버튼을 클릭합니다
2. 팝업 입력창에 전역 코멘트 내용을 입력합니다
3. Enter를 누르거나 확인을 클릭합니다
4. 코멘트가 사이드바의 "Global Comments" 섹션에 표시됩니다

**확인해야 할 것**:
- 텍스트 선택 후 툴바가 즉시 팝업됩니다 (Delete, Replace, Comment)
- 주석 추가 후 텍스트에 해당 스타일이 표시됩니다 (취소선, 배경색, 하이라이트)
- 사이드바에 모든 주석 목록이 표시되며, 클릭하면 해당 위치로 이동합니다
- 주석 옆의 **삭제** 버튼을 클릭하여 주석을 제거할 수 있습니다

### 4단계: 계획 승인하기

**계획에 문제가 없다면**:

페이지 하단의 **Approve** 버튼을 클릭합니다.

**확인해야 할 것**:
- 브라우저가 자동으로 닫힙니다 (1.5초 지연)
- Claude Code/OpenCode 터미널에 계획 승인됨이 표시됩니다
- AI가 계획 구현을 계속합니다

::: info Approve의 동작
- **Claude Code**: `{"behavior": "allow"}`만 전송, 주석은 무시됨
- **OpenCode**: `{"behavior": "allow"}` 전송, 주석을 메모로 전송 가능 (선택사항)
:::

### 5단계: 계획 거부하기 (Request Changes)

**계획에 수정이 필요하다면**:

1. 필요한 주석을 추가합니다 (Delete, Replace, Comment)
2. 페이지 하단의 **Request Changes** 버튼을 클릭합니다
3. 브라우저에 확인 대화상자가 표시됩니다

**확인해야 할 것**:
- 확인 대화상자에 "Send X annotations to AI?"가 표시됩니다
- 확인을 클릭하면 브라우저가 자동으로 닫힙니다
- Claude Code/OpenCode 터미널에 피드백 내용이 표시됩니다
- AI가 피드백에 따라 계획을 수정합니다

::: tip Request Changes의 동작
- **Claude Code**와 **OpenCode**: 모두 `{"behavior": "deny", "message": "..."}`를 전송합니다
- 주석이 구조화된 Markdown 텍스트로 변환됩니다
- AI가 주석에 따라 계획을 수정하고 다시 ExitPlanMode/submit_plan을 호출합니다
:::

### 6단계: 피드백 내용 확인하기 (선택사항)

Plannotator가 AI에게 보낸 피드백 내용을 확인하려면 터미널에서 볼 수 있습니다:

**Claude Code**:
```
Plan rejected by user
Please modify the plan based on the following feedback:

[구조화된 주석 내용]
```

**OpenCode**:
```
<feedback>
[구조화된 주석 내용]
</feedback>
```

## 체크포인트 ✅

위 단계를 완료하면 다음을 할 수 있어야 합니다:

- [ ] AI가 계획 검토를 트리거하면 브라우저가 자동으로 Plannotator UI를 엽니다
- [ ] 계획 텍스트를 선택하고 Delete, Replace, Comment 주석을 추가합니다
- [ ] Global Comment를 추가합니다
- [ ] 사이드바에서 모든 주석을 확인하고 해당 위치로 이동합니다
- [ ] Approve를 클릭하면 브라우저가 닫히고 AI가 구현을 계속합니다
- [ ] Request Changes를 클릭하면 브라우저가 닫히고 AI가 계획을 수정합니다

**특정 단계가 실패하면** 다음을 참조하세요:
- [자주 묻는 질문](../../faq/common-problems/)
- [Claude Code 설치 가이드](../../start/installation-claude-code/)
- [OpenCode 설치 가이드](../../start/installation-opencode/)

## 주의사항

**흔한 오류 1**: 텍스트 선택 후 툴바가 팝업되지 않음

**원인**: 코드 블록 내의 텍스트를 선택했거나, 여러 요소에 걸쳐 텍스트를 선택했을 수 있습니다.

**해결방법**:
- 단일 단락이나 목록 항목 내의 텍스트를 선택하세요
- 코드 블록의 경우 Comment 주석을 사용하고, 여러 줄에 걸쳐 선택하지 마세요

**흔한 오류 2**: Replace 주석 추가 후 대체 내용이 표시되지 않음

**원인**: 대체 내용 입력창이 제대로 제출되지 않았을 수 있습니다.

**해결방법**:
- 대체 내용 입력 후 Enter 키를 누르거나 확인 버튼을 클릭하세요
- 사이드바에 대체 내용이 표시되는지 확인하세요

**흔한 오류 3**: Approve 또는 Request Changes 클릭 후 브라우저가 닫히지 않음

**원인**: 서버 오류 또는 네트워크 문제일 수 있습니다.

**해결방법**:
- 터미널에 오류 메시지가 있는지 확인하세요
- 브라우저를 수동으로 닫으세요
- 문제가 지속되면 [문제 해결](../../faq/troubleshooting/)을 참조하세요

**흔한 오류 4**: AI가 피드백을 받은 후 주석대로 수정하지 않음

**원인**: AI가 주석의 의도를 제대로 이해하지 못했을 수 있습니다.

**해결방법**:
- 더 명확한 주석을 사용해보세요 (Replace가 Comment보다 더 명확함)
- Comment를 사용하여 자세한 설명을 추가하세요
- 문제가 지속되면 계획을 다시 거부하고 주석 내용을 조정하세요

**흔한 오류 5**: 여러 Delete 주석 추가 후 AI가 일부 내용만 삭제함

**원인**: 여러 Delete 주석 간에 중복이나 충돌이 있을 수 있습니다.

**해결방법**:
- 각 Delete 주석의 텍스트 범위가 중복되지 않도록 하세요
- 큰 단락을 삭제해야 한다면 전체 단락을 한 번에 선택하여 삭제하세요

## 이번 강의 요약

계획 검토는 Plannotator의 핵심 기능으로, AI가 생성한 계획을 시각적으로 검토할 수 있게 해줍니다:

**핵심 동작**:
1. **트리거**: AI가 `ExitPlanMode` 또는 `submit_plan` 호출, 브라우저가 자동으로 UI를 엽니다
2. **살펴보기**: 시각적 인터페이스에서 계획 내용 확인 (Markdown 형식)
3. **주석**: 텍스트 선택 후 Delete, Replace, Comment 또는 Global Comment 추가
4. **결정**: Approve (승인) 또는 Request Changes (거부) 클릭
5. **피드백**: 주석이 구조화된 데이터로 변환되어 AI가 피드백에 따라 계속하거나 계획 수정

**주석 유형**:
- **Delete**: 불필요한 내용 삭제
- **Replace**: 더 나은 내용으로 대체
- **Comment**: 특정 내용에 코멘트, 수정 요구 없음
- **Global Comment**: 전역 코멘트, 특정 텍스트와 연결 없음

**결정 유형**:
- **Approve**: 계획에 문제 없음, 바로 승인 (Claude Code는 주석 무시)
- **Request Changes**: 수정이 필요한 부분 있음, 주석이 AI에게 전송됨

## 다음 강의 예고

> 다음 강의에서는 **[계획 주석 추가하기](../plan-review-annotations/)**를 배웁니다.
>
> 배울 내용:
> - Delete, Replace, Comment 주석을 정확하게 사용하는 방법
> - 이미지 주석 추가하는 방법
> - 주석 편집 및 삭제하는 방법
> - 주석의 모범 사례와 일반적인 시나리오

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트: 2026-01-24

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| 계획 검토 UI | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| 주석 유형 정의 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L70) | 1-70 |
| 계획 검토 서버 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L310) | 91-310 |
| API: 계획 내용 가져오기 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| API: 계획 승인 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L201-L277) | 201-277 |
| API: 계획 거부 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L280-L309) | 280-309 |
| Viewer 컴포넌트 | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L1-L100) | 1-100 |
| AnnotationPanel 컴포넌트 | [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L1-L50) | 1-50 |

**주요 타입**:
- `AnnotationType`: 주석 유형 열거형 (DELETION, INSERTION, REPLACEMENT, COMMENT, GLOBAL_COMMENT) (`packages/ui/types.ts:1-7`)
- `Annotation`: 주석 인터페이스 (`packages/ui/types.ts:11-33`)
- `Block`: 계획 블록 인터페이스 (`packages/ui/types.ts:35-44`)

**주요 함수**:
- `startPlannotatorServer()`: 계획 검토 서버 시작 (`packages/server/index.ts:91`)
- `parseMarkdownToBlocks()`: Markdown을 Blocks로 파싱 (`packages/ui/utils/parser.ts`)

**API 라우트**:
- `GET /api/plan`: 계획 내용 가져오기 (`packages/server/index.ts:132`)
- `POST /api/approve`: 계획 승인 (`packages/server/index.ts:201`)
- `POST /api/deny`: 계획 거부 (`packages/server/index.ts:280`)

**비즈니스 규칙**:
- Claude Code 승인 시 주석 전송 안 함 (`apps/hook/server/index.ts:132`)
- OpenCode 승인 시 주석을 메모로 전송 가능 (`apps/opencode-plugin/index.ts:270`)
- 계획 거부 시 주석은 항상 전송됨 (`apps/hook/server/index.ts:154`)

</details>
