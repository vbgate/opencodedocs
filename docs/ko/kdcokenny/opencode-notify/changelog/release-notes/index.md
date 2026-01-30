---
title: "opencode-notify 업데이트 로그: 버전 히스토리 및 기능 변경 기록"
sidebarTitle: "새로운 기능 알아보기"
subtitle: "업데이트 로그"
description: "opencode-notify 플러그인의 버전 히스토리와 주요 변경 사항을 확인하세요. 각 버전의 기능 업데이트, 문제 수정 및 설정 개선 사항을 알아보세요."
tags:
  - "업데이트 로그"
  - "버전 히스토리"
order: 150
---

# 업데이트 로그

## 버전 설명

이 플러그인은 OCX를 통해 배포되며, 전통적인 버전 번호는 없습니다. 다음은 시간 역순으로 기록된 주요 변경 사항입니다.

---

## 2026-01-23

**변경 유형**: 동기화 업데이트

- kdcokenny/ocx 메인 저장소와 동기화 유지

---

## 2026-01-22

**변경 유형**: 동기화 업데이트

- kdcokenny/ocx 메인 저장소와 동기화 유지

---

## 2026-01-13

**변경 유형**: 동기화 업데이트

- kdcokenny/ocx 메인 저장소와 동기화 유지

---

## 2026-01-12

**변경 유형**: 동기화 업데이트

- kdcokenny/ocx 메인 저장소와 동기화 유지

---

## 2026-01-08

**변경 유형**: 동기화 업데이트

- kdcokenny/ocx 메인 저장소와 동기화 유지

---

## 2026-01-07

**변경 유형**: 동기화 업데이트

- ocx@30a9af5에서 업데이트
- CI 빌드 스킵

---

## 2026-01-01

### 수정: Cargo 스타일 네임스페이스 구문

**변경 내용**:
- 네임스페이스 구문 업데이트: `ocx add kdco-notify` → `ocx add kdco/notify`
- 네임스페이스 구문 업데이트: `ocx add kdco-workspace` → `ocx add kdco/workspace`
- 소스 파일 이름 변경: `kdco-notify.ts` → `notify.ts`

**영향**:
- 설치 명령이 `ocx add kdco-notify`에서 `ocx add kdco/notify`로 변경됨
- 소스 코드 파일 구조가 더 명확해지고 Cargo 명명 규칙을 따름

---

### 최적화: README 문서

**변경 내용**:
- README 문서 최적화 및 가치 제안 설명 추가
- FAQ 섹션 추가하여 자주 묻는 질문 답변
- "스마트 알림" 관련 설명 문구 개선
- 설치 단계 설명 간소화

**추가 내용**:
- 가치 제안 테이블 (이벤트, 알림 여부, 소리, 이유)
- 자주 묻는 질문: 컨텍스트가 추가되는지, 스팸 알림을 받는지, 임시 비활성화 방법

---

## 2025-12-31

### 문서: README 간소화

**변경 내용**:
- 유효하지 않은 아이콘 및 다크 모드 참조 제거
- README 문서 간소화, 핵심 기능 설명에 집중

### 제거: 아이콘 지원

**변경 내용**:
- OpenCode 아이콘 지원 제거 (크로스 플랫폼 다크 모드 감지)
- 알림 프로세스 간소화, 불안정한 아이콘 기능 제거
- `src/plugin/assets/` 디렉토리 정리

**제거된 파일**:
- `src/plugin/assets/opencode-icon-dark.png`
- `src/plugin/assets/opencode-icon-light.png`

**영향**:
- 알림에 사용자 정의 아이콘이 더 이상 표시되지 않음
- 알림 프로세스가 더 안정적이며 플랫폼 호환성 문제 감소

### 추가: OpenCode 아이콘 (이후 제거됨)

**변경 내용**:
- OpenCode 아이콘 지원 추가
- 크로스 플랫폼 다크 모드 감지 구현

::: info
이 기능은 후속 버전에서 제거되었습니다. 2025-12-31 "제거: 아이콘 지원"을 참조하세요.
:::

### 추가: 터미널 감지 및 포커스 인식

**변경 내용**:
- 터미널 자동 감지 기능 추가 (37개 이상의 터미널 지원)
- 포커스 감지 기능 추가 (macOS 전용)
- 클릭 포커스 기능 추가 (macOS 전용)

**추가된 기능**:
- 터미널 에뮬레이터 자동 인식
- 터미널 포커스 시 알림 억제
- 알림 클릭 시 터미널 창 포커스 (macOS)

**기술 세부 사항**:
- `detect-terminal` 라이브러리를 사용하여 터미널 유형 감지
- macOS osascript를 통해 전경 애플리케이션 가져오기
- node-notifier의 activate 옵션을 사용하여 클릭 포커스 구현

### 추가: 초기 버전

**변경 내용**:
- 초기 커밋: kdco-notify 플러그인
- 기본 네이티브 알림 기능
- 기본 설정 시스템

**핵심 기능**:
- session.idle 이벤트 알림 (작업 완료)
- session.error 이벤트 알림 (오류)
- permission.updated 이벤트 알림 (권한 요청)
- node-notifier 통합 (크로스 플랫폼 네이티브 알림)

**초기 파일**:
- `LICENSE` - MIT 라이선스
- `README.md` - 프로젝트 문서
- `registry.json` - OCX 등록 설정
- `src/plugin/kdco-notify.ts` - 메인 플러그인 코드

---

## 관련 리소스

- **GitHub 저장소**: https://github.com/kdcokenny/ocx/tree/main/registry/src/kdco/notify
- **커밋 히스토리**: https://github.com/kdcokenny/ocx/commits/main/registry/src/kdco/notify
- **OCX 문서**: https://github.com/kdcokenny/ocx

---

## 버전 정책

이 플러그인은 OCX 생태계의 일부로, 다음 버전 정책을 따릅니다:

- **버전 번호 없음**: Git 커밋 히스토리를 통해 변경 사항 추적
- **지속적 배포**: OCX 메인 저장소와 동기화하여 업데이트
- **하위 호환성**: 설정 형식 및 API의 하위 호환성 유지

하위 호환성이 깨지는 변경이 있을 경우, 업데이트 로그에 명시적으로 표시됩니다.

---

**마지막 업데이트**: 2026-01-27
