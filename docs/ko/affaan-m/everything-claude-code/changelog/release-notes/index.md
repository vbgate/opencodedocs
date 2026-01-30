---
title: "변경 로그: 버전 히스토리 | everything-claude-code"
sidebarTitle: "최근 업데이트 확인하기"
subtitle: "변경 로그: 버전 히스토리"
description: "everything-claude-code의 버전 히스토리와 주요 변경 사항을 확인하세요. 새로운 기능, 보안 수정, 문서 업데이트를 추적하여 업그레이드 여부를 결정할 수 있습니다."
tags:
  - "changelog"
  - "updates"
prerequisite: []
order: 250
---

# 변경 로그: 버전 히스토리 및 변경 사항

## 학습 목표

- 각 버전의 주요 변경 사항 파악
- 새로운 기능과 수정 사항 추적
- 업그레이드 필요 여부 판단

## 버전 히스토리

### 2026-01-24 - 보안 수정 및 문서 수정

**수정 내용**:
- 🔒 **보안 수정**: `commandExists()` 함수의 명령어 인젝션 취약점 방지
  - `execSync` 대신 `spawnSync` 사용
  - 입력값 검증으로 영숫자, 하이픈, 언더스코어, 점만 허용
- 📝 **문서 수정**: `runCommand()` 함수에 보안 관련 문서 경고 추가
- 🐛 **XSS 스캐너 오탐 수정**: `<script>`와 `<binary>`를 `[script-name]`과 `[binary-name]`으로 대체
- 📚 **문서 수정**: `doc-updater.md`의 `npx ts-morph`를 올바른 `npx tsx scripts/codemaps/generate.ts`로 수정

**영향**: #42, #43, #51

---

### 2026-01-22 - 크로스 플랫폼 지원 및 플러그인화

**새로운 기능**:
- 🌐 **크로스 플랫폼 지원**: 모든 hooks와 스크립트를 Node.js로 재작성하여 Windows, macOS, Linux 지원
- 📦 **플러그인 패키징**: Claude Code 플러그인으로 배포, 플러그인 마켓플레이스 설치 지원
- 🎯 **패키지 매니저 자동 감지**: 6가지 감지 우선순위 지원
  - 환경 변수 `CLAUDE_PACKAGE_MANAGER`
  - 프로젝트 설정 `.claude/package-manager.json`
  - `package.json`의 `packageManager` 필드
  - Lock 파일 감지 (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
  - 전역 설정 `~/.claude/package-manager.json`
  - 사용 가능한 첫 번째 패키지 매니저로 폴백

**수정 내용**:
- 🔄 **Hook 로딩**: 컨벤션에 따라 자동으로 hooks 로드, `plugin.json`의 hooks 선언 제거
- 📌 **Hook 경로**: `${CLAUDE_PLUGIN_ROOT}` 및 상대 경로 사용
- 🎨 **UI 개선**: star 히스토리 차트 및 badge bar 추가
- 📖 **Hook 구성**: session-end hooks를 Stop에서 SessionEnd로 이동

---

### 2026-01-20 - 기능 강화

**새로운 기능**:
- 💾 **Memory Persistence Hooks**: 세션 간 컨텍스트 자동 저장 및 로드
- 🧠 **Strategic Compact Hook**: 지능형 컨텍스트 압축 제안
- 📚 **Continuous Learning Skill**: 세션에서 재사용 가능한 패턴 자동 추출
- 🎯 **Strategic Compact Skill**: 토큰 최적화 전략

---

### 2026-01-17 - 초기 릴리스

**초기 기능**:
- ✨ 완전한 Claude Code 설정 컬렉션
- 🤖 9개의 전문화된 agents
- ⚡ 14개의 슬래시 명령어
- 📋 8개의 규칙 세트
- 🔄 자동화된 hooks
- 🎨 11개의 스킬 라이브러리
- 🌐 15개 이상의 MCP 서버 사전 설정
- 📖 완전한 README 문서

---

## 버전 명명 규칙

이 프로젝트는 전통적인 시맨틱 버전 번호 대신 **날짜 버전** 형식(`YYYY-MM-DD`)을 사용합니다.

### 버전 유형

| 유형 | 설명 | 예시 |
| --- | --- | --- |
| **새 기능** | 새로운 기능 또는 주요 개선 추가 | `feat: add new agent` |
| **수정** | 버그 또는 문제 수정 | `fix: resolve hook loading issue` |
| **문서** | 문서 업데이트 | `docs: update README` |
| **스타일** | 포맷팅 또는 코드 스타일 | `style: fix indentation` |
| **리팩토링** | 코드 리팩토링 | `refactor: simplify hook logic` |
| **성능** | 성능 최적화 | `perf: improve context loading` |
| **테스트** | 테스트 관련 | `test: add unit tests` |
| **빌드** | 빌드 시스템 또는 의존성 | `build: update package.json` |
| **되돌리기** | 이전 커밋 되돌리기 | `revert: remove version field` |

---

## 업데이트 받는 방법

### 플러그인 마켓플레이스 업데이트

플러그인 마켓플레이스를 통해 Everything Claude Code를 설치한 경우:

1. Claude Code 열기
2. `/plugin update everything-claude-code` 실행
3. 업데이트 완료 대기

### 수동 업데이트

저장소를 수동으로 클론한 경우:

```bash
cd ~/.claude/plugins/everything-claude-code
git pull origin main
```

### 마켓플레이스에서 설치

최초 설치:

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

---

## 변경 영향 분석

### 보안 수정 (필수 업그레이드)

- **2026-01-24**: 명령어 인젝션 취약점 수정, 업그레이드 강력 권장

### 기능 강화 (선택적 업그레이드)

- **2026-01-22**: 크로스 플랫폼 지원, Windows 사용자 필수 업그레이드
- **2026-01-20**: 새로운 기능 강화, 필요에 따라 업그레이드

### 문서 업데이트 (업그레이드 불필요)

- 문서 업데이트는 기능에 영향을 주지 않으며, README를 직접 확인 가능

---

## 알려진 이슈

### 현재 버전 (2026-01-24)

- 알려진 심각한 이슈 없음

### 이전 버전

- 2026-01-22 이전: Hooks 로딩에 수동 설정 필요 (2026-01-22에 수정됨)
- 2026-01-20 이전: Windows 미지원 (2026-01-22에 수정됨)

---

## 기여 및 피드백

### 이슈 보고

버그를 발견했거나 기능 제안이 있다면:

1. [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)에서 유사한 이슈가 있는지 검색
2. 없다면 새 Issue를 생성하고 다음 정보 제공:
   - 버전 정보
   - 운영 체제
   - 재현 단계
   - 예상 동작 vs 실제 동작

### PR 제출

기여를 환영합니다! 자세한 내용은 [CONTRIBUTING.md](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md)를 참조하세요.

---

## 이번 강의 요약

- Everything Claude Code는 날짜 버전 번호(`YYYY-MM-DD`)를 사용
- 보안 수정(예: 2026-01-24)은 필수 업그레이드
- 기능 강화는 필요에 따라 업그레이드
- 플러그인 마켓플레이스 사용자는 `/plugin update`로 업데이트
- 수동 설치 사용자는 `git pull`로 업데이트
- 이슈 보고 및 PR 제출은 프로젝트 가이드라인 준수

## 다음 강의 예고

> 다음 강의에서는 **[설정 파일 상세 가이드](../../appendix/config-reference/)**를 학습합니다.
>
> 배우게 될 내용:
> - `settings.json`의 전체 필드 설명
> - Hooks 설정의 고급 옵션
> - MCP 서버 설정 상세 가이드
> - 커스텀 설정 모범 사례
