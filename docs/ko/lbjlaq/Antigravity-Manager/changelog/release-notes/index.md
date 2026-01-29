---
title: "릴리스 노트: 버전 변경 이력 | Antigravity-Manager"
sidebarTitle: "3분 만에 버전 업데이트 이해"
subtitle: "버전 변경 이력: README 내장 Changelog 기준"
description: "Antigravity-Manager의 버전 변경 이력 방법을 이해합니다. Settings 페이지에서 버전을 확인하고 업데이트를 검사하며, README Changelog를 통해 수정 사항 및 알림을 보고 /healthz로 업그레이드 후 가용성을 검증합니다."
tags:
  - "changelog"
  - "release"
  - "upgrade"
  - "troubleshooting"
prerequisite:
  - "start-installation"
  - "start-proxy-and-first-client"
order: 1
---

# 버전 변경 이력: README 내장 Changelog 기준

Antigravity Tools를 업그레이드할 준비를 할 때 가장 두려운 것은 "업데이트되지 않음"이 아니라 "업데이트 후 호환성 변경을 발견"하는 것입니다. 이 페이지는 **Antigravity Tools Changelog(버전 변경 이력)**의 읽는 방법을 명확히 설명하여 업그레이드 전에 이번 업데이트가 무엇에 영향을 미치는지 판단할 수 있게 해줍니다.

## 학습 후 가능한 작업

- Settings의 About 페이지에서 현재 버전을 빠르게 확인하고, 업데이트를 검사하여 다운로드 진입점 획득
- README의 Changelog에서 자신에게 영향을 미치는 버전 구간만 읽기 (처음부터 끝까지 읽지 않음)
- 업그레이드 전 한 가지 작업 수행: "구성/모델 매핑 수동 수정" 알림이 있는지 확인
- 업그레이드 후 최소 검증(`/healthz`) 한 번 실행하여 프록시 사용 가능 여부 확인

## Changelog란?

**Changelog**는 버전별로 "이번에 무엇이 변경되었는지"를 기록한 목록입니다. Antigravity Tools는 이를 README의 "버전 변경 이력"에 직접 작성하며, 각 버전마다 날짜와 핵심 변경 사항을 표시합니다. 업그레이드 전 Changelog를 확인하면 호환성 변경 또는 회귀 문제에 빠질 확률이 줄어듭니다.

## 이 페이지를 사용하는 경우

- 이전 버전에서 새 버전으로 업그레이드할 준비 중, 먼저 위험 지점을 확인하고 싶을 때
- 특정 문제(예: 429/0 Token/Cloudflared)를 만나서 최근 버전에서 수정되었는지 확인하고 싶을 때
- 팀에서 통합 버전을 유지하며 동료에게 "버전별 변경 사항 읽는 방법"을 제공해야 할 때

## 🎒 시작 전 준비

::: warning 업그레이드 경로 먼저 준비 권장
설치/업그레이드 방법이 많습니다 (brew, Releases 수동 다운로드, 앱 내 업데이트). 아직 어떤 경로를 사용할지 결정하지 않았다면 먼저 **[설치 및 업그레이드: 데스크톱용 최적 설치 경로(brew / releases)](/ko/lbjlaq/Antigravity-Manager/start/installation/)**를 보세요.
:::

## 같이 해보기

### 1단계: About 페이지에서 현재 사용 중인 버전 확인

**왜인가요**
Changelog는 버전별로 구성되어 있습니다. 현재 버전을 먼저 알아야 "어디서부터 읽어야 하는지" 알 수 있습니다.

조작 경로: **Settings** → **About**.

**다음을 볼 수 있어야 함**: 페이지 제목 영역에 애플리케이션 이름 및 버전 번호가 표시됩니다 (예: `v3.3.49`).

### 2단계: "업데이트 검사" 클릭, 최신 버전 및 다운로드 진입점 획득

**왜인가요**
"최신 버전 번호"를 먼저 알아야 Changelog에서 중간에 건너뛴 버전 구간을 선택할 수 있습니다.

About 페이지에서 "업데이트 검사" 클릭.

**다음을 볼 수 있어야 함**:
- 업데이트가 있는 경우: "new version available" 메시지와 다운로드 버튼이 표시됨 (`download_url` 열림)
- 이미 최신 버전인 경우: "latest version" 메시지

### 3단계: README의 Changelog에서 건너뛴 버전만 보기

**왜인가요**
"현재 버전에서 최신 버전까지"의 변경 사항만 관심을 가지면 되며, 다른 과거 버전은 일단 건너뛸 수 있습니다.

README를 열고 **"버전 변경 이력(Changelog)"**으로 이동한 다음 최신 버전부터 내려가서 현재 버전까지 읽습니다.

**다음을 볼 수 있어야 함**: 버전이 `vX.Y.Z (YYYY-MM-DD)` 형식으로 나열되며, 각 버전마다 그룹 설명(예: 핵심 수정/기능 향상)이 있습니다.

### 4단계: 업그레이드 후 최소 검증 한 번 수행

**왜인가요**
업그레이드 후 첫 번째 작업은 "복잡한 시나리오 실행"이 아니라 프록시가 정상적으로 시작되고 클라이언트에서 활성화되는지 먼저 확인하는 것입니다.

**[로컬 리버스 프록시 시작 및 첫 번째 클라이언트 연결(/healthz + SDK 구성)](/ko/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**의 흐름에 따라 최소한 한 번 `GET /healthz`를 검증합니다.

**다음을 볼 수 있어야 함**: `/healthz`가 성공을 반환 (서비스 가용성 확인용).

## 최근 버전 요약 (README에서 발췌)

| 버전 | 날짜 | 주의해야 할 점 |
|--- | --- | ---|
| `v3.3.49` | 2026-01-22 | Thinking 중단 및 0 Token 방어; `gemini-2.5-flash-lite` 제거 및 사용자 정의 매핑 수동 교체 알림; 언어/테마 등 설정 즉시 적용; 모니터링 대시보드 강화; OAuth 호환성 향상 |
| `v3.3.48` | 2026-01-21 | Windows 플랫폼 백그라운드 프로세스 무음 실행 (콘솔 깜빡임 수정) |
| `v3.3.47` | 2026-01-21 | 이미지 생성 파라미터 매핑 강화(`size`/`quality`); Cloudflared 터널 지원; 병합 충돌로 인한 시작 실패 수정; 3단계 점진적 컨텍스트 압축 |

::: tip "이번 업데이트가 나에게 영향을 미치는지" 빠르게 판단하는 방법
다음 두 가지 유형의 문장을 우선 찾으세요:

- **사용자 알림/사용자 수정 필요**: 예를 들어 특정 기본 모델이 제거되어 사용자 정의 매핑을 수동으로 조정해야 한다는 명시
- **핵심 수정/호환성 수정**: 예를 들어 0 Token, 429, Windows 깜빡임, 시작 실패 같은 "사용 불가능하게 만드는" 문제
:::

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 내용 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| README 내장 Changelog(버전 변경 이력) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L324-L455) | 324-455 |
| About 페이지 버전 번호 표시 및 "업데이트 검사" 버튼 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L821-L954) | 821-954 |
| About 페이지 "업데이트 검사" 명령 반환 구조 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L187-L215) | 187-215 |
| 자동 업데이트 알림(다운로드 및 재시작) | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L33-L96) | 33-96 |
| 현재 버전 번호(빌드 메타데이터) | [`package.json`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/package.json#L1-L4) | 1-4 |

</details>
