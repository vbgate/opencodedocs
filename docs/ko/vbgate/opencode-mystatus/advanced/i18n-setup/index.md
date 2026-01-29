---
title: "다국어 지원: 언어 자동 감지 | opencode-mystatus"
sidebarTitle: "다국어 지원"
subtitle: "다국어 지원: 중국어 및 영어 자동 전환"
description: "opencode-mystatus의 다국어 지원을 이해합니다. Intl API 및 환경 변수를 통한 언어 감지 원리와 출력 언어 전환 방법을 배웁니다."
tags:
  - "i18n"
  - "internationalization"
  - "language-detection"
  - "multi-language"
prerequisite:
  - "start-quick-start"
order: 3
---

# 다국어 지원: 중국어 및 영어 자동 전환

## 학습 완료 후 할 수 있는 것

- mystatus가 시스템 언어를 자동 감지하는 방법 이해
- 시스템 언어를 전환하여 출력 언어를 변경하는 방법 알기
- 언어 감지의 우선순위 및 폴백 메커니즘 이해
- Intl API 및 환경 변수의 작동 원리 파악

## 현재 문제 상황

mystatus의 **다국어 지원**이 때로는 중국어, 때로는 영어인 것을 눈치챘을 것입니다:

```
# 중국어 출력
3시간 한도
███████████████████████████ 남은 85%
재설정: 2시간30분 후

# 영어 출력
3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m
```

하지만 다음을 모릅니다:
- 플러그인은 어떤 언어를 사용해야 하는지 어떻게 아는가?
- 수동으로 중국어 또는 영어로 전환할 수 있는가?
- 감지가 틀리면 어떻게 해결하나?

이 수업에서 언어 감지 메커니즘을 명확히 이해하게 됩니다.

## 핵심 개념

**다국어 지원**은 시스템 언어 환경에 따라 자동으로 중국어 또는 영어 출력을 선택하며, 수동 구성이 필요하지 않습니다. 감지 우선순위는 Intl API → 환경 변수 → 기본 영어입니다.

**감지 우선순위**(높은 순서대로):

1. **Intl API**(권장) → `Intl.DateTimeFormat().resolvedOptions().locale`
2. **환경 변수**(폴백) → `LANG`, `LC_ALL`, `LANGUAGE`
3. **기본 영어**(兜底) → `"en"`

::: tip 왜 수동 구성이 필요 없나?
언어 감지는 시스템 환경을 기반으로 하며, 플러그인은 시작 시 자동으로 인식하므로 사용자가 구성 파일을 수정할 필요가 없습니다.
:::

**지원 언어**:
| 언어 | 코드 | 감지 조건 |
| ---- | ---- | -------- |
| 중국어 | `zh` | locale이 `zh`로 시작(예: `zh-CN`, `zh-TW`) |
| 영어 | `en` | 기타 경우 |

**번역 범위**:
- 시간 단위(일, 시간, 분)
- 한도 관련(남은 비율, 재설정 시간)
- 오류 메시지(인증 실패, API 오류, 시간 초과)
- 플랫폼 제목(OpenAI, Zhipu AI, Z.ai, Google Cloud, GitHub Copilot)

## 단계별 따라하기

### 1단계: 현재 시스템 언어 확인

먼저 시스템 언어 설정을 확인합니다:

::: code-group

```bash [macOS/Linux]
echo $LANG
```

```powershell [Windows]
Get-ChildItem Env:LANG
```

:::

**다음을 확인해야 합니다**:

- 중국어 시스템: `zh_CN.UTF-8`, `zh_TW.UTF-8` 또는 유사
- 영어 시스템: `en_US.UTF-8`, `en_GB.UTF-8` 또는 유사

### 2단계: 언어 감지 테스트

`/mystatus` 명령을 실행하고 출력 언어를 관찰합니다:

```
/mystatus
```

**다음을 확인해야 합니다**:

- 시스템 언어가 중국어인 경우 → 중국어로 출력됨(예: `3시간 한도`, `재설정: 2시간30분 후`)
- 시스템 언어가 영어인 경우 → 영어로 출력됨(예: `3-hour limit`, `Resets in: 2h 30m`)

### 3단계: 시스템 언어 임시 전환(테스트용)

다른 언어의 출력 효과를 테스트하려면 환경 변수를 임시로 수정할 수 있습니다:

::: code-group

```bash [macOS/Linux (임시로 영어로 전환)]
LANG=en_US.UTF-8 /mystatus
```

```powershell [Windows (임시로 영어로 전환)]
$env:LANG="en_US.UTF-8"; /mystatus
```

:::

**다음을 확인해야 합니다**:

시스템이 중국어라도 출력이 영어 형식으로 바뀝니다.

::: warning
이것은 임시 테스트용이며, 시스템 언어를 영구적으로 변경하지 않습니다. 터미널을 닫으면 원래 설정으로 복원됩니다.
:::

### 4단계: Intl API 감지 메커니즘 이해

Intl API는 브라우저 및 Node.js가 제공하는 국제화 표준 인터페이스입니다. 플러그인은 이것을 우선 사용하여 언어를 감지합니다:

**감지 코드**(간소화 버전):

```javascript
// 1. Intl API 우선 사용
const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
if (intlLocale.startsWith("zh")) {
  return "zh";  // 중국어
}

// 2. 환경 변수로 폴백
const lang = process.env.LANG || process.env.LC_ALL || "";
if (lang.startsWith("zh")) {
  return "zh";
}

// 3. 기본 영어
return "en";
```

**Intl API의 장점**:
- 더 신뢰할 수 있음, 실제 시스템 설정 기반
- 브라우저 및 Node.js 환경 지원
- 완전한 locale 정보 제공(예: `zh-CN`, `en-US`)

**환경 변수를 폴백으로 사용**:
- Intl API를 지원하지 않는 환경 호환
- 환경 변수 수정을 통한 수동 제어 언어 방법 제공

### 5단계: 시스템 언어 영구 전환(필요한 경우)

mystatus가 항상 특정 언어를 사용하기를 원하면 시스템 언어 설정을 수정할 수 있습니다:

::: info
시스템 언어 수정은 mystatus뿐만 아니라 모든 응용 프로그램에 영향을 줍니다.
:::

**macOS**:
1. 「시스템 설정」→「일반」→「언어 및 지역」 열기
2. 필요한 언어 추가 및 맨 위로 드래그
3. OpenCode 재시작

**Linux**:
```bash
# ~/.bashrc 또는 ~/.zshrc 수정
export LANG=zh_CN.UTF-8

# 구성 다시 로드
source ~/.bashrc
```

**Windows**:
1. 「설정」→「시간 및 언어」→「언어 및 지역」 열기
2. 필요한 언어 추가 및 기본으로 설정
3. OpenCode 재시작

## 검사점 ✅

언어 감지가 올바른지 확인하세요:

| 테스트 항목 | 작업 | 예상 결과 |
| ------ | ---- | -------- |
| 중국어 시스템 | `/mystatus` 실행 | 중국어로 출력됨(예: `3시간 한도`) |
| 영어 시스템 | `/mystatus` 실행 | 영어로 출력됨(예: `3-hour limit`) |
| 임시 전환 | `LANG` 환경 변수 수정 후 명령 실행 | 출력 언어가随之 변경됨 |

## 주의 사항

### 일반적인 문제

| 문제 | 원인 | 해결 방법 |
| ---- | ---- | -------- |
| 출력 언어이 예상과 다름 | 시스템 언어 설정 오류 | `LANG` 환경 변수 또는 시스템 언어 설정 확인 |
| Intl API 사용 불가 | Node.js 버전이 너무 낮거나 환경이 지원하지 않음 | 플러그인은 자동으로 환경 변수 감지로 폴백합니다 |
| 중국어 시스템에서 영어 표시됨 | 환경 변수 `LANG`이 `zh_*`로 설정되지 않음 | 올바른 `LANG` 값 설정(예: `zh_CN.UTF-8`) |

### 감지 로직 설명

**Intl API 사용 시점**:
- Node.js ≥ 0.12(Intl API 지원)
- 브라우저 환경(모든 최신 브라우저)

**환경 변수로 폴백하는 시점**:
- Intl API에서 예외 발생
- 환경이 Intl API를 지원하지 않음

**기본 영어 사용 시점**:
- 환경 변수 설정되지 않음
- 환경 변수가 `zh`로 시작하지 않음

::: tip
플러그인은 모듈 로드 시 **언어를 한 번만** 감지합니다. 시스템 언어를 수정한 후 OpenCode를 재시작해야 적용됩니다.
:::

## 이 수업 요약

- **자동 감지**: mystatus는 시스템 언어를 자동으로 감지하며, 수동 구성이 필요하지 않습니다
- **감지 우선순위**: Intl API → 환경 변수 → 기본 영어
- **지원 언어**: 중국어(zh) 및 영어(en)
- **번역 범위**: 시간 단위, 한도 관련, 오류 메시지, 플랫폼 제목
- **언어 전환**: 시스템 언어 설정 수정, OpenCode 재시작

## 다음 수업 예고

> 다음 수업에서 **[일반적인 문제: 할당량 조회 불가, 토큰 만료, 권한 문제](../../faq/troubleshooting/)**을 배웁니다.
>
> 학습할 내용:
> - 인증 파일 읽기 불가 문제 해결 방법
> - 토큰 만료 시 해결 방법
> - 권한 부족 시 구성 제안

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 확인하려면 클릭</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행번호 |
| --- | --- | --- |
| 언어 감지 함수 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L24-L40) | 24-40 |
| 중국어 번역 정의 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L46-L124) | 46-124 |
| 영어 번역 정의 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L125-L203) | 125-203 |
| 현재 언어 내보내기 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L210) | 210 |
| 번역 함수 내보내기 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L213) | 213 |

**핵심 함수**:
- `detectLanguage()`: 사용자 시스템 언어 감지, Intl API 우선 사용, 환경 변수로 폴백, 기본 영어
- `currentLang`: 현재 언어(모듈 로드 시 한 번 감지)
- `t`: 번역 함수, 현재 언어에 따라 해당 번역 내용 반환

**핵심 상수**:
- `translations`: 번역 사전, `zh` 및 `en` 두 가지 언어 패키지 포함
- 지원하는 번역 유형: 시간 단위(days, hours, minutes), 한도 관련(hourLimit, dayLimit, remaining, resetIn), 오류 메시지(authError, apiError, timeoutError), 플랫폼 제목(openaiTitle, zhipuTitle, googleTitle, copilotTitle)

**감지 로직**:
1. `Intl.DateTimeFormat().resolvedOptions().locale`을 사용하여 언어 감지 우선
2. Intl API를 사용할 수 없으면 환경 변수 `LANG`, `LC_ALL`, `LANGUAGE`로 폴백
3. 환경 변수도 없거나 `zh`로 시작하지 않으면 기본 영어

</details>
