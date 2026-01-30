---
title: "고급 사용: 심층 구성 및 최적화 | opencode-notify 튜토리얼"
sidebarTitle: "알림 경험 커스터마이징"
subtitle: "고급 사용: 심층 구성 및 최적화"
description: "opencode-notify 고급 구성 학습: 구성 참조, 무음 시간대, 터미널 감지 및 모범 사례. 개인 요구에 맞게 알림 경험을 최적화하여 업무 효율성을 높입니다."
tags:
  - "고급"
  - "구성"
  - "최적화"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 3
---

# 고급 사용: 심층 구성 및 최적화

이 섹션에서는 opencode-notify의 고급 기능을 마스터하고, 구성 옵션을 깊이 이해하며, 알림 경험을 최적화하고, 개인 요구에 따라 알림 동작을 커스터마이징하는 데 도움을 줍니다.

## 학습 경로

이 섹션의 내용은 다음 순서대로 학습하는 것을 권장합니다:

### 1. [구성 참조](./config-reference/)

사용 가능한 모든 구성 옵션과 그 역할을 포괄적으로 이해합니다.

- 구성 파일의 구조와 문법 마스터
- 알림 사운드 커스터마이징 방법 학습
- 하위 세션 알림 스위치 사용 시나리오 이해
- 터미널 유형 재정의 구성 방법 파악

### 2. [무음 시간대 상세 설명](./quiet-hours/)

특정 시간대의 알림 방지를 위해 무음 시간대 설정을 학습합니다.

- 무음 시간대의 시작 및 종료 시간 구성
- 밤샘 무음 시간대 처리 (예: 22:00 - 08:00)
- 필요 시 무음 기능 일시 비활성화
- 무음 시간대와 다른 필터링 규칙의 우선순위 이해

### 3. [터미널 감지 원리](./terminal-detection/)

터미널 자동 감지 작동 메커니즘을 심층적으로 탐구합니다.

- 플러그인이 37+ 종류의 터미널 에뮬레이터를 식별하는 방법 학습
- macOS 플랫폼의 포커스 감지 구현 방법 이해
- 터미널 유형을 수동으로 지정하는 방법 마스터
- 감지 실패 시의 기본 동작 이해

### 4. [고급 사용법](./advanced-usage/)

구성 기술과 모범 사례를 마스터합니다.

- 알림 스팸을 방지하는 구성 전략
- 작업 흐름에 맞춰 알림 동작 조정
- 다중 윈도우 및 다중 터미널 환경에서의 구성 제안
- 성능 최적화 및 문제 해결 기술

## 전제 조건

이 섹션 학습을 시작하기 전 다음 기본 내용을 완료하는 것을 권장합니다:

- ✅ **빠른 시작**: 플러그인 설치 및 기본 구성 완료
- ✅ **작동 원리**: 플러그인의 핵심 기능과 이벤트 수신 메커니즘 이해
- ✅ **플랫폼 기능**(선택사항): 사용 중인 플랫폼의 특정 기능 학습

::: tip 학습 제안
알림 사운드를 커스터마이징하거나 무음 시간대를 설정하고 싶다면, 해당 하위 페이지로 바로 이동할 수 있습니다. 문제가 발생하면 언제든지 구성 참조 섹션을 참조할 수 있습니다.
:::

## 다음 단계

이 섹션 학습을 완료한 후, 다음을 계속 탐색할 수 있습니다:

- **[문제 해결](../../faq/troubleshooting/)**: 일반적인 문제 및 난제 해결
- **[자주 묻는 질문](../../faq/common-questions/)**: 사용자의 주요 관심사 파악
- **[이벤트 유형 설명](../../appendix/event-types/)**: 플러그인이 수신하는 모든 이벤트 유형 심층 학습
- **[구성 파일 예제](../../appendix/config-file-example/)**: 전체 구성 예제 및 주석 보기

---

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능        | 파일 경로                                                                                    | 행 번호    |
|--- | --- | ---|
| 구성 인터페이스 정의 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48   |
| 기본 구성    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68   |
| 구성 로드    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114  |
| 무음 시간대 확인 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| 터미널 감지    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| 터미널 프로세스 이름 매핑 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84   |

**핵심 인터페이스**:
- `NotifyConfig`: 모든 구성 가능한 항목을 포함한 구성 인터페이스
- `quietHours`: 무음 시간대 구성 (enabled/start/end)
- `sounds`: 사운드 구성 (idle/error/permission)
- `terminal`: 터미널 유형 재정의 (선택사항)

**핵심 상수**:
- `DEFAULT_CONFIG`: 모든 구성 항목의 기본값
- `TERMINAL_PROCESS_NAMES`: 터미널 이름에서 macOS 프로세스 이름으로의 매핑 테이블

</details>
