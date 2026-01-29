---
title: "빠른 시작: 설치 및 설정 | opencode-md-table-formatter"
sidebarTitle: "1분 만에 테이블 정렬"
subtitle: "1분 만에 시작: 설치 및 설정"
description: "opencode-md-table-formatter의 설치 및 설정 방법을 배웁니다. 1분 안에 플러그인을 설치하고, 구성 파일을 통해 AI가 생성한 테이블을 자동으로 정렬합니다."
tags:
  - "installation"
  - "configuration"
  - "opencode-plugin"
prerequisite: []
order: 10
---

# 1분 만에 시작: 설치 및 설정

::: info 학습 후 할 수 있는 것
- OpenCode에서 테이블 포맷터 플러그인 설치
- AI가 생성한 Markdown 테이블 자동 정렬
- 플러그인이 정상적으로 작동하는지 확인
:::

## 현재 겪고 있는 문제

AI가 생성한 Markdown 테이블은 종종 다음과 같습니다:

```markdown
| 名称 | 描述 | 状态 |
|--- | --- | ---|
| 功能A | 这是一个很长的描述文本 | 已完成 |
| B | 短 | 进行中 |
```

열 너비가 고르지 않아 보기 불편합니다. 수동으로 조정하시겠습니까? 시간이 너무 많이 걸립니다.

## 언제 사용해야 할까요

- AI에게 테이블 생성을 자주 요청하는 경우 (비교, 목록, 구성 설명)
- OpenCode에서 테이블이 깔끔하게 표시되기를 원하는 경우
- 매번 열 너비를 수동으로 조정하고 싶지 않은 경우

## 🎒 시작 전 준비

::: warning 전제 조건
- OpenCode가 설치되어 있어야 합니다 (버전 >= 1.0.137)
- `.opencode/opencode.jsonc` 구성 파일의 위치를 알고 있어야 합니다
:::

## 따라해 보세요

### 1단계: 구성 파일 열기

**이유**: 플러그인은 구성 파일을 통해 선언되며, OpenCode 시작 시 자동으로 로드됩니다.

OpenCode 구성 파일을 찾으세요:

::: code-group

```bash [macOS/Linux]
# 구성 파일은 보통 프로젝트 루트 디렉토리에 있습니다
ls -la .opencode/opencode.jsonc

# 또는 사용자 디렉토리에 있습니다
ls -la ~/.config/opencode/opencode.jsonc
```

```powershell [Windows]
# 구성 파일은 보통 프로젝트 루트 디렉토리에 있습니다
Get-ChildItem .opencode\opencode.jsonc

# 또는 사용자 디렉토리에 있습니다
Get-ChildItem "$env:APPDATA\opencode\opencode.jsonc"
```

:::

좋아하는 편집기로 이 파일을 엽니다.

### 2단계: 플러그인 구성 추가

**이유**: OpenCode에 테이블 포맷터 플러그인을 로드하도록 지시합니다.

구성 파일에 `plugin` 필드를 추가하세요:

```jsonc
{
  // ... 다른 구성 ...
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

::: tip 다른 플러그인이 이미 있나요?
이미 `plugin` 배열이 있다면, 새 플러그인을 배열에 추가하세요:

```jsonc
{
  "plugin": [
    "existing-plugin",
    "@franlol/opencode-md-table-formatter@0.0.3"  // 여기에 추가
  ]
}
```
:::

**확인해야 할 것**: 구성 파일이 성공적으로 저장되었고, 구문 오류 메시지가 없습니다.

### 3단계: OpenCode 재시작

**이유**: 플러그인은 OpenCode 시작 시 로드되므로, 구성을 수정한 후 재시작해야 적용됩니다.

현재 OpenCode 세션을 닫고 다시 시작하세요.

**확인해야 할 것**: OpenCode가 정상적으로 시작되고 오류가 없습니다.

### 4단계: 플러그인 작동 확인

**이유**: 플러그인이 올바르게 로드되고 작동하는지 확인합니다.

AI에게 테이블을 생성하도록 요청하세요. 예를 들어 다음과 같이 입력하세요:

```
React, Vue, Angular 세 프레임워크의 특징을 비교하는 테이블을 생성해 주세요
```

**확인해야 할 것**: AI가 생성한 테이블의 열 너비가 정렬되어 다음과 같이 보입니다:

```markdown
| 프레임워크 | 특징                     | 학습 곡선 |
|--- | --- | ---|
| React     | 컴포넌트 기반, 가상 DOM   | 중간     |
| Vue       | 점진적, 양방향 바인딩     | 낮음     |
| Angular   | 전체 기능 프레임워크, TypeScript | 높음     |
```

## 체크포인트 ✅

위 단계를 완료한 후 다음 사항을 확인하세요:

| 확인 항목                 | 예상 결과                           |
|--- | ---|
| 구성 파일 구문            | 오류 없음                          |
| OpenCode 시작             | 정상 시작, 플러그인 로드 오류 없음 |
| AI가 생성한 테이블        | 열 너비 자동 정렬, 구분선 형식 통일 |

## 문제 해결 팁

### 테이블이 포맷되지 않나요?

1. **구성 파일 경로 확인**: OpenCode가 실제로 읽는 구성 파일을 수정했는지 확인하세요
2. **플러그인 이름 확인**: 반드시 `@franlol/opencode-md-table-formatter@0.0.3`이어야 하며, `@` 기호에 주의하세요
3. **OpenCode 재시작**: 구성을 수정한 후 반드시 재시작해야 합니다

### "invalid structure" 주석이 보이나요?

테이블 구조가 Markdown 규격에 맞지 않는다는 뜻입니다. 일반적인 원인:

- 구분선 누락 (`|---|---|`)
- 각 행의 열 수가 일치하지 않음

자세한 내용은 [자주 묻는 질문](../../faq/troubleshooting/) 장을 참조하세요.

## 이번 수업 요약

- 플러그인은 `.opencode/opencode.jsonc`의 `plugin` 필드를 통해 구성합니다
- 버전 번호 `@0.0.3`은 안정적인 버전을 사용하도록 보장합니다
- 구성을 수정한 후 OpenCode를 재시작해야 합니다
- 플러그인은 AI가 생성한 모든 Markdown 테이블을 자동으로 포맷합니다

## 다음 수업 예고

> 다음 수업에서는 **[기능 개요](../features/)**를 학습합니다.
>
> 배우게 될 내용:
> - 플러그인의 8가지 핵심 기능
> - 숨김 모드에서의 너비 계산 원리
> - 포맷할 수 있는 테이블과 포맷할 수 없는 테이블

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능           | 파일 경로                                                                                     | 행 번호 |
|--- | --- | ---|
| 플러그인 진입점       | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23    |
| 훅 등록       | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L11-L13) | 11-13   |
| 패키지 구성         | [`package.json`](https://github.com/franlol/opencode-md-table-formatter/blob/main/package.json#L1-L41) | 1-41    |

**핵심 상수**:
- `@franlol/opencode-md-table-formatter@0.0.3`: npm 패키지 이름 및 버전
- `experimental.text.complete`: 플러그인이 감시하는 훅 이름

**종속성 요구사항**:
- OpenCode >= 1.0.137
- `@opencode-ai/plugin` >= 0.13.7

</details>
