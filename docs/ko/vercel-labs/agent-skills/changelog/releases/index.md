---
title: "버전 기록: 변경 내역 확인 | Agent Skills"
sidebarTitle: "버전 기록"
subtitle: "버전 기록: 변경 내역 확인"
description: "Agent Skills의 모든 버전 업데이트 기록을 확인하세요. 새로운 기능 추가, 성능 개선, 버그 수정 등 상세한 변경 내역을 제공합니다."
tags:
  - "changelog"
  - "updates"
  - "releases"
---

# 버전 기록

이 프로젝트는 모든 버전의 기능 업데이트, 개선 및 수정을 기록합니다.

---

## v1.0.0 - 2026년 1월

### 🎉 초기 릴리스

이것은 Agent Skills의 첫 번째 공식 버전으로, 완전한 스킬 팩과 빌드 툴체인을 포함합니다.

#### 새로운 기능

**React 성능 최적화 규칙**
- 40+ 개 React/Next.js 성능 최적화 규칙
- 8개 주요 카테고리: 워터폴 제거, 번들 최적화, 서버 측 성능, Re-render 최적화 등
- 영향력별 분류(CRITICAL > HIGH > MEDIUM > LOW)
- 각 규칙은 Incorrect/Correct 코드 예시 비교 포함

**Vercel 원클릭 배포**
- 40+ 개 주요 프레임워크 자동 감지 지원
- 인증 불필요 배포 프로세스
- 미리보기 링크 및 소유권 이전 링크 자동 생성
- 정적 HTML 프로젝트 지원

**웹 디자인 가이드**
- 100+ 개 웹 인터페이스 디자인 규칙
- 접근성, 성능, UX 다차원 감사
- GitHub에서 최신 규칙 원격 가져오기

**빌드 툴체인**
- `pnpm build` - AGENTS.md 완전 규칙 문서 생성
- `pnpm validate` - 규칙 파일 완전성 검증
- `pnpm extract-tests` - 테스트 케이스 추출
- `pnpm dev` - 개발 프로세스(build + validate)

#### 기술 스택

- TypeScript 5.3.0
- Node.js 20+
- pnpm 10.24.0+
- tsx 4.7.0 (TypeScript 런타임)

#### 문서

- AGENTS.md 완전 규칙 가이드
- SKILL.md 스킬 정의 파일
- README.md 설치 및 사용 안내
- 빌드 툴 완전 문서

---

## 버전 명명 규칙

프로젝트는 시맨틱 버저닝(Semantic Versioning)을 따릅니다:

- **메이저 버전(Major)**: 호환되지 않는 API 변경
- **마이너 버전(Minor)**: 호환되는 새로운 기능
- **패치 버전(Patch)**: 호환되는 버그 수정

예: `1.0.0`은 첫 번째 안정 버전을 나타냅니다.
