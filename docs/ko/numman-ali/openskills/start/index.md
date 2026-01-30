---
title: "빠른 시작: OpenSkills를 빠르게 시작하기 | OpenSkills"
sidebarTitle: "15분 빠르게 시작하기"
subtitle: "빠른 시작: OpenSkills를 빠르게 시작하기 | OpenSkills"
description: "OpenSkills 빠른 시작 방법을 배워보세요. 15분 안에 도구와 스킬을 설치하여 AI 에이전트가 새로운 스킬을 사용하고 그 작동 원리를 이해할 수 있습니다."
order: 1
---

# 빠른 시작

이 장에서는 OpenSkills를 빠르게 시작하는 방법을 안내합니다. 도구 설치부터 AI 에이전트가 스킬을 사용하기까지 10-15분이면 충분합니다.

## 학습 경로

다음 순서대로 학습하는 것을 추천합니다:

### 1. [빠른 시작](./quick-start/)

5분 안에 도구 설치, 스킬 설치, 동기화를 완료하고 OpenSkills의 핵심 가치를 경험해보세요.

- OpenSkills 도구 설치
- Anthropic 공식 저장소에서 스킬 설치
- AGENTS.md에 스킬 동기화
- AI 에이전트가 스킬을 사용할 수 있는지 확인

### 2. [OpenSkills란 무엇인가요?](./what-is-openskills/)

OpenSkills의 핵심 개념과 작동 원리를 이해하세요.

- OpenSkills와 Claude Code의 관계
- 통일된 스킬 형식, 점진적 로딩, 다중 에이전트 지원
- 내장 스킬 시스템 대신 OpenSkills를 사용해야 하는 경우

### 3. [설치 가이드](./installation/)

상세한 설치 단계와 환경 설정.

- Node.js 및 Git 환경 확인
- npx 임시 사용 vs 전역 설치
- 일반적인 설치 문제 해결

### 4. [첫 번째 스킬 설치](./first-skill/)

Anthropic 공식 저장소에서 스킬을 설치하고 대화형 선택을 경험해보세요.

- `openskills install` 명령어 사용
- 필요한 스킬 대화형 선택
- 스킬 디렉토리 구조 이해 (.claude/skills/)

### 5. [AGENTS.md에 스킬 동기화](./sync-to-agents/)

AGENTS.md 파일을 생성하여 AI 에이전트에 사용 가능한 스킬을 알려주세요.

- `openskills sync` 명령어 사용
- AGENTS.md의 XML 형식 이해
- 동기화할 스킬 선택, 컨텍스트 크기 제어

### 6. [스킬 사용](./read-skills/)

AI 에이전트가 스킬 콘텐츠를 로드하는 방법을 알아보세요.

- `openskills read` 명령어 사용
- 스킬 검색의 4단계 우선순위 순서
- 여러 스킬을 한 번에 읽기

## 사전 요구 사항

학습을 시작하기 전에 다음을 확인하세요:

- [Node.js](https://nodejs.org/) 20.6.0 이상 버전이 설치되어 있어야 합니다
- [Git](https://git-scm.com/)이 설치되어 있어야 합니다 (GitHub에서 스킬을 설치하기 위해)
- 최소 하나의 AI 코딩 에이전트가 설치되어 있어야 합니다 (Claude Code, Cursor, Windsurf, Aider 등)

::: tip 빠른 환경 확인
```bash
node -v  # v20.6.0 이상이 표시되어야 함
git -v   # git version x.x.x가 표시되어야 함
```
:::

## 다음 단계

이 장을 완료한 후에는 다음을 계속 학습할 수 있습니다:

- [명령어 상세 설명](../platforms/cli-commands/) : 모든 명령어와 파라미터에 대해 자세히 알아보기
- [설치 소스 상세 설명](../platforms/install-sources/) : GitHub, 로컬 경로, 개인 저장소에서 스킬을 설치하는 방법 학습
- [사용자 정의 스킬 만들기](../advanced/create-skills/) : 나만의 스킬 만들기
