---
title: "문제 해결: 문제 진단 | oh-my-opencode"
sidebarTitle: "문제가 발생했을 때"
subtitle: "문제 해결: 문제 진단 | oh-my-opencode"
description: "oh-my-opencode의 문제 해결 방법을 학습하세요. Doctor 명령어를 통해 17개 이상의 구성 진단을 수행하고, 설치, 인증, 의존성 등의 문제를 빠르게 파악하고 해결할 수 있습니다."
order: 150
---

# 자주 묻는 질문 및 문제 해결

이 장에서는 oh-my-opencode 사용 과정에서 발생할 수 있는 일반적인 문제를 해결하는 방법을 안내합니다. 구성 진단부터 사용 팁, 보안 권장사항까지 다루어 문제를 빠르게 파악하고 해결책을 찾을 수 있도록 돕습니다.

## 학습 경로

다음 순서대로 학습하여 문제 해결과 모범 사례를 체계적으로 익혀보세요:

### 1. [구성 진단 및 문제 해결](./troubleshooting/)

Doctor 명령어를 사용하여 구성 문제를 빠르게 진단하고 해결하는 방법을 학습합니다.
- Doctor 명령어 실행으로 전체 상태 점검 수행
- 17개 이상의 검사 결과 해석 (설치, 구성, 인증, 의존성, 도구, 업데이트)
- 일반적인 구성 문제 식별 및 수정
- 상세 모드와 JSON 출력을 사용한 고급 진단

### 2. [자주 묻는 질문](./faq/)

사용 과정에서 발생하는 일반적인 문제를 찾고 해결합니다.
- 설치 및 구성 문제에 대한 빠른 답변
- 사용 팁과 모범 사례 (ultrawork, 프록시 호출, 백그라운드 작업)
- Claude Code 호환성 설명
- 보안 경고 및 성능 최적화 권장사항
- 기여 및 도움말 리소스

## 전제 조건

이 장을 학습하기 전에 다음을 확인하세요:
- [빠른 설치 및 구성](../start/installation/) 완료
- oh-my-opencode의 기본 구성 파일 구조 이해
- 구체적인 문제가 발생했거나 모범 사례를 알고 싶음

::: tip 권장 학습 시점
기본 설치를 완료한 후 자주 묻는 질문(FAQ)을 먼저 한 번 읽어보세요. 일반적인 함정과 모범 사례를 이해하고, 구체적인 문제가 발생했을 때 문제 해결 도구를 사용하여 진단하세요.
:::

## 빠른 문제 해결 가이드

긴급한 문제가 발생했다면 다음 단계에 따라 빠르게 해결하세요:

```bash
# 1단계: 전체 진단 실행
bunx oh-my-opencode doctor

# 2단계: 상세 오류 정보 확인
bunx oh-my-opencode doctor --verbose

# 3단계: 특정 카테고리 확인 (예: 인증)
bunx oh-my-opencode doctor --category authentication

# 4단계: 여전히 해결되지 않으면 자주 묻는 질문 확인
# 또는 GitHub Issues에서 도움 요청
```

## 다음 단계

이 장을 완료한 후 다음을 계속 학습할 수 있습니다:
- **[Claude Code 호환성](../appendix/claude-code-compatibility/)** - Claude Code와의 완전한 호환성 지원 이해
- **[구성 참조](../appendix/configuration-reference/)** - 전체 구성 파일 Schema 및 필드 설명 확인
- **[내장 MCP 서버](../appendix/builtin-mcps/)** - 내장 MCP 서버 사용 방법 학습
