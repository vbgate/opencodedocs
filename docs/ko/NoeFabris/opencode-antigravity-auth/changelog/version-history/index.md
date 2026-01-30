---
title: "버전 히스토리: Antigravity Auth 업데이트 로그 | opencode-antigravity-auth"
sidebarTitle: "새 기능 개요"
subtitle: "버전 히스토리: Antigravity Auth 업데이트 로그"
description: "Antigravity Auth 플러그인의 버전 히스토리와 주요 변경 사항을 확인하세요. 각 버전의 신규 기능, 버그 수정, 성능 개선을 살펴보고 업그레이드 가이드와 호환성 정보를 확인하세요."
tags:
  - "버전 히스토리"
  - "업데이트 로그"
  - "변경 기록"
order: 1
---

# 버전 히스토리

이 문서는 Antigravity Auth 플러그인의 버전 히스토리와 주요 변경 사항을 기록합니다.

::: tip 최신 버전
현재 최신 안정 버전: **v1.3.0** (2026-01-17)
:::

## 버전 안내

### 안정판 (Stable)
- 충분한 테스트를 거쳐 프로덕션 환경 사용을 권장합니다
- 버전 번호 형식: `vX.Y.Z` (예: v1.3.0)

### 베타판 (Beta)
- 최신 기능을 포함하지만 불안정할 수 있습니다
- 버전 번호 형식: `vX.Y.Z-beta.N` (예: v1.3.1-beta.3)
- 초기 체험과 피드백에 적합합니다

---

## v1.3.x 시리즈

### v1.3.1-beta.3
**릴리스 날짜**: 2026-01-22

**변경사항**:
- `MODEL_CAPACITY_EXHAUSTED` 오류의 백오프 알고리즘을 최적화하고 무작위 지터 범위 증가

### v1.3.1-beta.2
**릴리스 날짜**: 2026-01-22

**변경사항**:
- 사용되지 않는 `googleSearch` 설정 항목 제거
- ToS(서비스 약관) 경고와 사용 권고사항을 README에 추가

### v1.3.1-beta.1
**릴리스 날짜**: 2026-01-22

**변경사항**:
- 계정 전환 알림의 디바운스 로직을 개선하여 중복 알림 감소

### v1.3.1-beta.0
**릴리스 날짜**: 2026-01-20

**변경사항**:
- 하위 저장소 추적 제거 및 tsconfig.json 복원

### v1.3.0
**릴리스 날짜**: 2026-01-17

**주요 변경사항**:

**신규 기능**:
- Zod v4의 네이티브 `toJSONSchema` 메서드를 사용한 스키마 생성

**버그 수정**:
- 토큰 소모량 테스트를 수정하여 `toBeCloseTo`를 사용한 부동소수점 정밀도 문제 해결
- 테스트 커버리지 계산 개선

**문서 개선**:
- 로드 밸런싱 관련 문서 강화
- 포맷 개선

---

## v1.2.x 시리즈

### v1.2.9-beta.10
**릴리스 날짜**: 2026-01-17

**변경사항**:
- 토큰 잔액 어서션을 수정하여 부동소수점 정밀도 매칭

### v1.2.9-beta.9
**릴리스 날짜**: 2026-01-16

**변경사항**:
- 토큰 소모량 테스트를 업데이트하여 `toBeCloseTo`를 사용한 부동소수점 정밀도 처리
- Gemini 도구 래핑 기능 강화, 래핑 함수 수량 통계 추가

### v1.2.9-beta.8
**릴리스 날짜**: 2026-01-16

**변경사항**:
- 새로운 이슈 템플릿 추가(bug 보고 및 기능 요청)
- 프로젝트 온보딩 로직 개선

### v1.2.9-beta.7
**릴리스 날짜**: 2026-01-16

**변경사항**:
- 이슈 템플릿 업데이트, 설명적 제목 제공 요구

### v1.2.9-beta.6
**릴리스 날짜**: 2026-01-16

**변경사항**:
- 설정 가능한 속도 제한 재시도 지연 추가
- 호스트명 감지 개선, OrbStack Docker 환경 지원
- 지능형 OAuth 콜백 서버 주소 바인딩
- `thinkingLevel`과 `thinkingBudget`의 우선순위 명확화

### v1.2.9-beta.5
**릴리스 날짜**: 2026-01-16

**변경사항**:
- Gemini 도구 래핑을 `functionDeclarations` 형식으로 개선
- `normalizeGeminiTools`에서 사용자 정의 함수 래퍼를 올바르게 생성하도록 보장

### v1.2.9-beta.4
**릴리스 날짜**: 2026-01-16

**변경사항**:
- Gemini 도구를 `functionDeclarations` 형식으로 래핑
- `wrapToolsAsFunctionDeclarations`에서 `toGeminiSchema` 적용

### v1.2.9-beta.3
**릴리스 날짜**: 2026-01-14

**변경사항**:
- 하이브리드 전략 구현 설명을 포함한 문서와 코드 주석 업데이트
- 테스트용 antigravity 시스템 명령 간소화

### v1.2.9-beta.2
**릴리스 날짜**: 2026-01-12

**변경사항**:
- Gemini 3 모델 파싱 로직 수정, 중복된 thinking 블록 처리
- 표시되는 thinking 해시에 Gemini 3 모델 체크 추가

### v1.2.9-beta.1
**릴리스 날짜**: 2026-01-08

**변경사항**:
- 플러그인 설치 설명에서 beta 버전 업데이트
- 계정 관리 개선, 현재 인증을 저장된 계정에 추가하도록 보장

### v1.2.9-beta.0
**릴리스 날짜**: 2026-01-08

**변경사항**:
- README 업데이트, Antigravity 플러그인 URL 수정
- schema URL을 NoeFabris 저장소로 업데이트

### v1.2.8
**릴리스 날짜**: 2026-01-08

**중요 변경사항**:

**신규 기능**:
- Gemini 3 모델 지원
- thinking 블록 중복 제거 처리

**버그 수정**:
- Gemini 3 모델 파싱 로직 수정
- 응답 변환에서 표시되는 thinking 해시 처리

**문서 개선**:
- 테스트 스크립트 출력 리다이렉션 업데이트
- 모델 테스트 옵션 업데이트

### v1.2.7
**릴리스 날짜**: 2026-01-01

**중요 변경사항**:

**신규 기능**:
- 계정 관리 개선, 현재 인증을 올바르게 저장하도록 보장
- GitHub Actions를 통한 자동 npm 버전 릴리스

**버그 수정**:
- E2E 테스트 스크립트의 출력 리다이렉션 수정

**문서 개선**:
- 저장소 URL을 NoeFabris로 업데이트

---

## v1.2.6 - v1.2.0 시리즈

### v1.2.6
**릴리스 날짜**: 2025-12-26

**변경사항**:
- npm 버전 자동 재릴리스를 위한 워크플로우 추가

### v1.2.5
**릴리스 날짜**: 2025-12-26

**변경사항**:
- 문서 업데이트, 버전 번호를 1.2.6으로 수정

### v1.2.4 - v1.2.0
**릴리스 날짜**: 2025년 12월

**변경사항**:
- 다중 계정 로드 밸런싱 기능
- 이중 할당량 시스템(Antigravity + Gemini CLI)
- 세션 복구 메커니즘
- OAuth 2.0 PKCE 인증
- Thinking 모델 지원(Claude 및 Gemini 3)
- Google Search grounding

---

## v1.1.x 시리즈

### v1.1.0 및 후속 버전
**릴리스 날짜**: 2025년 11월

**변경사항**:
- 인증 프로세스 최적화
- 오류 처리 개선
- 더 많은 설정 옵션 추가

---

## v1.0.x 시리즈 (초기 버전)

### v1.0.4 - v1.0.0
**릴리스 날짜**: 2025년 10월 및 그 이전

**초기 기능**:
- 기본 Google OAuth 인증
- Antigravity API 접근
- 간단한 모델 지원

---

## 버전 업그레이드 가이드

### v1.2.x에서 v1.3.x로 업그레이드

**호환성**: 완전 호환, 설정 수정 불필요

**권장 작업**:
```bash
# 플러그인 업데이트
opencode plugin update opencode-antigravity-auth

# 설치 확인
opencode auth status
```

### v1.1.x에서 v1.2.x로 업그레이드

**호환성**: 계정 저장소 형식 업데이트 필요

**권장 작업**:
```bash
# 기존 계정 백업
cp ~/.config/opencode/antigravity-accounts.json ~/.config/opencode/antigravity-accounts.json.bak

# 플러그인 업데이트
opencode plugin update opencode-antigravity-auth@latest

# 재로그인 (문제 발생 시)
opencode auth login
```

### v1.0.x에서 v1.2.x로 업그레이드

**호환성**: 계정 저장소 형식이 호환되지 않음, 재인증 필요

**권장 작업**:
```bash
# 플러그인 업데이트
opencode plugin update opencode-antigravity-auth@latest

# 재로그인
opencode auth login

# 새 버전 요구사항에 따라 모델 설정 추가
```

---

## 베타 버전 안내

**베타 버전 사용 권장사항**:

| 사용 시나리오 | 권장 버전 | 설명 |
| --- | --- | --- |
| 프로덕션 환경 | 안정판 (vX.Y.Z) | 충분한 테스트로 안정성이 높음 |
| 일상 개발 | 최신 안정판 | 기능이 완전하고 버그가 적음 |
| 초기 체험 | 최신 베타 | 최신 기능 체험 가능하지만 불안정할 수 있음 |

**베타 버전 설치**:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**안정판으로 업그레이드**:

```bash
opencode plugin update opencode-antigravity-auth@latest
```

---

## 버전 번호 설명

버전 번호는 [Semantic Versioning 2.0.0](https://semver.org/lang/ko/) 규격을 따릅니다:

- **주 버전 (X)**: 호환되지 않는 API 변경
- **부 버전 (Y)**: 하위 호환되는 기능 추가
- **수정 버전 (Z)**: 하위 호환되는 버그 수정

**예시**:
- `1.3.0` → 주 버전 1, 부 버전 3, 수정 버전 0
- `1.3.1-beta.3` → 1.3.1의 3번째 베타 버전

---

## 업데이트 알림 받기

**자동 업데이트** (기본 활성화):

```json
{
  "auto_update": true
}
```

**수동 업데이트 확인**:

```bash
# 현재 버전 확인
opencode plugin list

# 플러그인 업데이트
opencode plugin update opencode-antigravity-auth
```

---

## 다운로드 주소

- **NPM 안정판**: https://www.npmjs.com/package/opencode-antigravity-auth
- **GitHub Releases**: https://github.com/NoeFabris/opencode-antigravity-auth/releases

---

## 피드백 기여

문제 발생 또는 기능 제안이 있을 시:

1. [문제 해결 가이드](../../faq/common-auth-issues/) 확인
2. [GitHub Issues](https://github.com/NoeFabris/opencode-antigravity-auth/issues)에 문제 제출
3. 올바른 이슈 템플릿 사용 (Bug Report / Feature Request)
