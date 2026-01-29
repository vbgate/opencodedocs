---
title: "부록: 참조 가이드 | oh-my-opencode"
sidebarTitle: "부록"
subtitle: "부록: 참조 가이드 및 호환성"
description: "oh-my-opencode 구성 옵션, Claude Code 호환성, 내장 MCP 서버를 마스터하세요. 이 참조 가이드는 마이그레이션 단계와 검색 기능을 다루어 OpenCode 환경을 사용자 정의하고 AI 워크플로우를 확장하는 방법을 설명합니다."
tags:
  - "부록"
  - "참조"
order: 170
---

# 부록: 참조 가이드 및 호환성

이 장은 **oh-my-opencode**에 대한 상세한 참조 자료와 호환성 가이드라인을 포함하며, 전체 구성 문서, Claude Code 마이그레이션 지원, 내장 확장 서버에 대한 상세한 소개를 다룹니다.

## 장 내용

이 장에는 세 가지 중요한 섹션이 포함되어 있습니다:

| 하위 페이지 | 설명 | 난이도 |
|--- | --- | ---|
| [Claude Code 호환성](./claude-code-compatibility/) | Claude Code에서 OpenCode로 마이그레이션하는 완전한 가이드, Commands, Skills, Agents, MCPs, Hooks에 대한 호환성 메커니즘 포함 | ⭐⭐ |
| [구성 참조](./configuration-reference/) | oh-my-opencode 구성 파일의 완전한 스키마 문서, 모든 필드, 유형, 기본값 다룸 | ⭐⭐⭐ |
| [내장 MCP](./builtin-mcps/) | 3개의 내장 MCP 서버(Exa Websearch, Context7, Grep.app)의 기능 및 사용법 | ⭐⭐ |

## 추천 학습 경로

요구 사항에 따라 학습 순서를 선택하세요:

### 경로 1: Claude Code에서 마이그레이션

Claude Code에서 마이그레이션하는 사용자인 경우:

1. 먼저 **[Claude Code 호환성](./claude-code-compatibility/)**을 읽어 기존 구성을 원활하게 마이그레이션하는 방법을 이해하세요
2. 그 다음 **[구성 참조](./configuration-reference/)**을 검토하여 사용 가능한 구성 옵션을 더 깊이 이해하세요
3. 마지막으로 **[내장 MCP](./builtin-mcps/)**를 학습하여 추가 검색 기능을 구성하는 방법을 이해하세요

### 경로 2: 깊은 사용자 정의

oh-my-opencode 동작을 깊이 사용자 정의하려는 경우:

1. **[구성 참조](./configuration-reference/)**부터 시작하여 모든 구성 가능 항목을 이해하세요
2. **[내장 MCP](./builtin-mcps/)**를 학습하여 검색 및 문서 쿼리 기능을 구성하세요
3. **[Claude Code 호환성](./claude-code-compatibility/)**을 참조하여 호환성 레이어 구성 옵션을 이해하세요

### 경로 3: 빠른 참조

특정 정보만 조회해야 하는 경우:

- **구성 질문** → **[구성 참조](./configuration-reference/)**로 바로 이동
- **마이그레이션 질문** → **[Claude Code 호환성](./claude-code-compatibility/)**로 바로 이동
- **MCP 구성** → **[내장 MCP](./builtin-mcps/)**로 바로 이동

## 전제 조건

이 장을 학습하기 위해 다음을 완료했는지 권장합니다:

- ✅ **[설치 및 구성](../../ko/code-yeongyu/oh-my-opencode/start/installation/)** 완료
- ✅ **[Sisyphus Orchestrator](../../ko/code-yeongyu/oh-my-opencode/start/sisyphus-orchestrator/)**의 기본 개념 이해
- ✅ JSON 구성 파일 편집에 익숙함

## 다음 단계

이 장을 완료한 후 다음을 수행할 수 있습니다:

- 🚀 **[고급 기능](../../ko/code-yeongyu/oh-my-opencode/advanced/)**을 시도하여 더 고급 사용법을 학습하세요
- 🔧 **[FAQ](../../ko/code-yeongyu/oh-my-opencode/faq/)**를 확인하여 사용 문제를 해결하세요
- 📖 **[변경 로그](../../ko/code-yeongyu/oh-my-opencode/changelog/)**를 읽어 새로운 기능 개선 사항을 최신으로 유지하세요

::: tip 팁
이 장의 내용은 주로 참조 자료로 제공되므로 순차적으로 읽을 필요가 없습니다. 필요에 따라 관련 섹션을 참조하세요.
:::
