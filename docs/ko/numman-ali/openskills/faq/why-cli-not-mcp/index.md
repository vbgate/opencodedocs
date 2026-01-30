---
title: "CLI vs MCP: 디자인 선택 | OpenSkills"
sidebarTitle: "왜 CLI인가, MCP가 아닌가"
subtitle: "왜 CLI를 선택했고 MCP가 아닌가?"
description: "OpenSkills가 MCP 대신 CLI를 선택한 디자인 이유를 학습합니다. 두 가지의 포지셔닝 차이를 비교하고, 스킬 시스템이 왜 정적 파일 모델에 적합한지, 다중 에이전트 범용성과 제로 설정 배포를 어떻게 구현하는지 이해합니다."
tags:
  - "FAQ"
  - "디자인 철학"
  - "MCP"
prerequisite:
  - "start-what-is-openskills"
order: 3
---

# 왜 CLI인가, MCP가 아닌가?

## 학습 후 할 수 있는 것

이 수업은 다음 내용을 이해하는 데 도움을 줍니다:

- ✅ MCP와 스킬 시스템의 포지셔닝 차이 이해
- ✅ 왜 CLI가 스킬 로딩에 더 적합한지 이해
- ✅ OpenSkills의 디자인 철학 습득
- ✅ 스킬 시스템의 기술 원리 이해

## 현재 겪고 있는 문제

다음과 같은 생각이 들 수 있습니다:

- "더 진보된 MCP 프로토콜을 왜 사용하지 않나요?"
- "CLI 방식이 너무 구식인가요?"
- "MCP가 AI 시대에 더 적합한 디자인이 아닌가요?"

이 수업은 이러한 디자인 결정배후의 기술적 고려사항을 이해하는 데 도움을 줍니다.

---

## 핵심 질문: 스킬이란 무엇인가?

CLI vs MCP를 논의하기 전에, 먼저 "스킬"의 본질을 이해해 봅시다.

### 스킬의 본질

::: info 스킬의 정의
스킬은 **정적 명령 + 리소스**의 조합으로 다음을 포함합니다:
- `SKILL.md`: 상세한 운영 가이드 및 프롬프트
- `references/`: 참조 문서
- `scripts/`: 실행 가능한 스크립트
- `assets/`: 이미지, 템플릿 등 리소스

스킬은 **이 아닙니다**: 동적 서비스, 실시간 API 또는 서버 실행이 필요한 도구.
:::

### Anthropic의 공식 디자인

Anthropic의 스킬 시스템은 본래 **파일 시스템**을 기반으로 설계되었습니다:

- 스킬은 `SKILL.md` 파일 형식으로 존재
- `<available_skills>` XML 블록을 통해 사용 가능한 스킬 설명
- AI 에이전트는 필요에 따라 파일 내용을 컨텍스트로 읽어옴

이것이 스킬 시스템의 기술적 선택이 파일 시스템과 호환되어야 한다는 것을 결정합니다.

---

## MCP vs OpenSkills: 포지셔닝 비교

| 비교 차원 | MCP（Model Context Protocol） | OpenSkills（CLI） |
|--- | --- | ---|
| **적용 시나리오** | 동적 도구, 실시간 API 호출 | 정적 명령, 문서, 스크립트 |
| **실행 요구사항** | MCP 서버 필요 | 서버 불필요（순수 파일） |
| **에이전트 지원** | MCP만 지원하는 에이전트 | `AGENTS.md`를 읽을 수 있는 모든 에이전트 |
| **복잡도** | 서버 배포 및 유지보수 필요 | 제로 설정, 즉시 사용 가능 |
| **데이터 소스** | 서버에서 실시간 획득 | 로컬 파일 시스템에서 읽기 |
| **네트워크 의존성** | 필요 | 불필요 |
| **스킬 로딩** | 프로토콜 호출 | 파일 읽기 |

---

## 왜 CLI가 스킬 시스템에 더 적합한가?

### 1. 스킬은 파일입니다

**MCP는 서버 필요**: MCP 서버 배포, 요청 처리, 응답, 프로토콜 핸드셰이크 처리...

**CLI는 파일만 필요**:

```bash
# 스킬은 파일 시스템에 저장됨
.claude/skills/pdf/
├── SKILL.md              # 주 명령 파일
├── references/           # 참조 문서
│   └── pdf-format-spec.md
├── scripts/             # 실행 가능한 스크립트
│   └── extract-pdf.py
└── assets/              # 리소스 파일
    └── pdf-icon.png
```

**장점**:
- ✅ 제로 설정, 서버 불필요
- ✅ 스킬은 버전 제어 가능
- ✅ 오프라인 사용 가능
- ✅ 배포 간단

### 2. 범용성: 모든 에이전트가 사용 가능

**MCP의 제한**:

MCP 프로토콜을 지원하는 에이전트만 사용 가능합니다. Cursor, Windsurf, Aider 등 에이전트가 각각 MCP를 구현하면 다음 문제가 발생:
- 중복 개발 작업
- 프로토콜 호환성 문제
- 버전 동기화 어려움

**CLI의 장점**:

shell 명령을 실행할 수 있는 모든 에이전트가 사용 가능:

```bash
# Claude Code 호출
npx openskills read pdf

# Cursor 호출
npx openskills read pdf

# Windsurf 호출
npx openskills read pdf
```

**제로 통합 비용**: 에이전트가 shell 명령을 실행할 수 있기만 하면 됩니다.

### 3. 공식 디자인 부합

Anthropic의 스킬 시스템은 본래 **파일 시스템 디자인**이지, MCP 디자인이 아닙니다:

```xml
<!-- AGENTS.md의 스킬 설명 -->
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>
</available_skills>
```

**호출 방식**:

```bash
# 공식 디자인의 호출 방식
npx openskills read pdf
```

OpenSkills는 Anthropic의 공식 디자인을 완전히 따르며 호환성을 유지합니다.

### 4. 점진적 로딩（Progressive Disclosure）

**스킬 시스템의 핵심 장점**: 필요 시 로딩, 컨텍스트 간결 유지.

**CLI의 구현**:

```bash
# 필요한 경우에만 스킬 내용 로딩
npx openskills read pdf
# 출력: SKILL.md의 전체 내용을 표준 출력으로
```

**MCP의 도전**:

MCP로 구현하면 다음이 필요합니다:
- 서버가 스킬 목록 관리
- 필요 시 로딩 로직 구현
- 컨텍스트 관리 처리

반면 CLI 방식은 점진적 로딩을 자연스럽게 지원합니다.

---

## MCP의 적용 시나리오

MCP가 해결하는 문제는 스킬 시스템과 **다릅니다**:

| MCP가 해결하는 문제 | 예시 |
|--- | ---|
| **실시간 API 호출** | OpenAI API 호출, 데이터베이스 쿼리 |
| **동적 도구** | 계산기, 데이터 변환 서비스 |
| **원격 서비스 통합** | Git 작업, CI/CD 시스템 |
| **상태 관리** | 서버 상태 유지가 필요한 도구 |

이러한 시나리오에는 **서버**와 **프로토콜**이 필요하며, MCP가 올바른 선택입니다.

---

## 스킬 시스템 vs MCP: 경쟁 관계가 아닙니다

**핵심 관점**: MCP와 스킬 시스템은 다른 문제를 해결하며, 선택이 필요하지 않습니다.

### 스킬 시스템의 포지셔닝

```
[정적 명령] → [SKILL.md] → [파일 시스템] → [CLI 로딩]
```

적용 시나리오:
- 운영 가이드 및 모범 사례
- 문서 및 참조 자료
- 정적 스크립트 및 템플릿
- 버전 제어가 필요한 설정

### MCP의 포지셔닝

```
[동적 도구] → [MCP 서버] → [프로토콜 호출] → [실시간 응답]
```

적용 시나리오:
- 실시간 API 호출
- 데이터베이스 쿼리
- 상태가 필요한 원격 서비스
- 복잡한 계산 및 변환

### 상호 보완 관계

OpenSkills는 MCP를 배제하지 않고, **스킬 로딩에만 집중**합니다:

```
AI 에이전트
  ├─ 스킬 시스템（OpenSkills CLI）→ 정적 명령 로딩
  └─ MCP 도구 → 동적 서비스 호출
```

서로 상호 보완적이며, 대체 관계가 아닙니다.

---

## 실제 사례: 언제 어떤 것을 사용해야 할까요?

### 사례 1: Git 작업 호출

❌ **스킬 시스템에 적합하지 않음**:
- Git 작업은 동적이며 실시간 상호작용 필요
- Git 서버 상태에 의존

✅ **MCP에 적합**:
```bash
# MCP 도구를 통한 호출
git:checkout(branch="main")
```

### 사례 2: PDF 처리 가이드

❌ **MCP에 적합하지 않음**:
- 운영 가이드는 정적임
- 서버 실행 불필요

✅ **스킬 시스템에 적합**:
```bash
# CLI를 통한 로딩
npx openskills read pdf
# 출력: 상세한 PDF 처리 단계 및 모범 사례
```

### 사례 3: 데이터베이스 쿼리

❌ **스킬 시스템에 적합하지 않음**:
- 데이터베이스 연결 필요
- 결과가 동적임

✅ **MCP에 적합**:
```bash
# MCP 도구를 통한 호출
database:query(sql="SELECT * FROM users")
```

### 사례 4: 코드 리뷰 규범

❌ **MCP에 적합하지 않음**:
- 리뷰 규범은 정적 문서
- 버전 제어 필요

✅ **스킬 시스템에 적합**:
```bash
# CLI를 통한 로딩
npx openskills read code-review
# 출력: 상세한 코드 리뷰 체크리스트 및 예시
```

---

## 미래: MCP와 스킬 시스템의 융합

### 가능한 진화 방향

**MCP + 스킬 시스템**:

```bash
# 스킬에서 MCP 도구 참조
npx openskills read pdf-tool

# SKILL.md 내용
이 스킬은 MCP 도구 사용이 필요합니다:

1. mcp:pdf-extract 사용 텍스트 추출
2. mcp:pdf-parse 사용 구조 파싱
3. 이 스킬에서 제공하는 스크립트 사용 결과 처리
```

**장점**:
- 스킬은 고급 명령 및 모범 사례 제공
- MCP는 기본 동적 도구 제공
- 두 가지 결합으로 더 강력한 기능

### 현재 단계

OpenSkills가 CLI를 선택한 이유는:
1. 스킬 시스템은 이미 성숙한 파일 시스템 디자인임
2. CLI 방식 구현 간단, 범용성 강함
3. 각 에이전트가 MCP 지원을 구현할 때까지 기다릴 필요 없음

---

## 이 수업 요약

OpenSkills가 MCP 대신 CLI를 선택한 핵심 이유:

### 핵심 이유

- ✅ **스킬은 정적 파일**: 서버 불필요, 파일 시스템 저장
- ✅ **더 강한 범용성**: 모든 에이전트 사용 가능, MCP 프로토콜에 의존하지 않음
- ✅ **공식 디자인 부합**: Anthropic 스킬 시스템은 본래 파일 시스템 디자인
- ✅ **제로 설정 배포**: 서버 불필요, 즉시 사용 가능

### MCP vs 스킬 시스템

| MCP | 스킬 시스템（CLI） |
|--- | ---|
| 동적 도구 | 정적 명령 |
| 서버 필요 | 순수 파일 시스템 |
| 실시간 API | 문서 및 스크립트 |
| 프로토콜 지원 필요 | 제로 통합 비용 |

### 경쟁이 아닌, 상호 보완

- MCP는 동적 도구 문제 해결
- 스킬 시스템은 정적 명령 문제 해결
- 두 가지를 결합하여 사용 가능

---

## 관련 자료

- [OpenSkills란 무엇인가요?](../../start/what-is-openskills/)
- [명령어 상세](../../platforms/cli-commands/)
- [사용자 정의 스킬 생성](../../advanced/create-skills/)

---

## 부록: 소스 코드 참고

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능        | 파일 경로                                                                                      | 행 번호    |
|--- | --- | ---|
| CLI 입구    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)                     | 39-80   |
| 읽기 명령    | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50    |
| AGENTS.md 생성 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93   |

**핵심 디자인 결정**:
- CLI 방식: `npx openskills read <name>`을 통해 스킬 로딩
- 파일 시스템 저장: 스킬은 `.claude/skills/` 또는 `.agent/skills/`에 저장
- 범용 호환성: Claude Code와 완전히 동일한 XML 형식 출력

</details>
