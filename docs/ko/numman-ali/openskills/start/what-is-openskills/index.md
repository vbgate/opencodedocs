---
title: "핵심 개념: 통합 스킬 생태계 | OpenSkills"
sidebarTitle: "AI 도구가 스킬을 공유하도록"
subtitle: "핵심 개념: 통합 스킬 생태계 | OpenSkills"
description: "OpenSkills의 핵심 개념과 작동 원리를 학습하세요. 통합 스킬 로더로서 다중 에이전트 스킬 공유를 지원하고 점진적 로딩을 구현합니다."
tags:
  - "개념 소개"
  - "핵심 개념"
prerequisite: []
order: 2
---

# OpenSkills란 무엇인가요?

## 학습 완료 후 할 수 있는 것

- OpenSkills의 핵심 가치와 작동 원리 이해
- OpenSkills와 Claude Code의 관계 파악
- 내장 스킬 시스템 대신 OpenSkills를 사용해야 하는 경우 판단
- 여러 AI 코딩 에이전트가 스킬 생태계를 공유하는 방법 이해

::: info 사전 지식
이 튜토리얼은 기본적인 AI 코딩 도구(Claude Code, Cursor 등)에 대해 알고 있다고 가정하지만, OpenSkills 사용 경험은 필요하지 않습니다.
:::

---

## 현재 겪고 있는 문제

다음과 같은 상황을 겪어보셨을 것입니다:

- **Claude Code에서 익숙하게 사용하던 스킬이 AI 도구를 바꾸면 사라집니다**: 예를 들어 Claude Code의 PDF 처리 스킬이 Cursor에서는 사용할 수 없습니다
- **여러 도구에 스킬을 반복적으로 설치해야 합니다**: 각 AI 도구마다 개별적으로 스킬을 설정해야 하므로 관리 비용이 높습니다
- **공식 Marketplace에서 지원하지 않는 프라이빗 스킬을 사용하고 싶습니다**: 회사 내부나 직접 개발한 스킬을 팀원들과 쉽게 공유할 수 없습니다

이러한 문제의 본질은 **스킬 형식이 통일되어 있지 않아 도구 간에 공유할 수 없다**는 것입니다.

---

## 핵심 아이디어: 통합 스킬 형식

OpenSkills의 핵심 아이디어는 간단합니다: **Claude Code의 스킬 시스템을 범용 스킬 로더로 만드는 것**.

### 무엇인가요

**OpenSkills**는 Anthropic 스킬 시스템의 범용 로더로, 모든 AI 코딩 에이전트(Claude Code, Cursor, Windsurf, Aider 등)가 표준 SKILL.md 형식의 스킬을 사용할 수 있도록 합니다.

간단히 말하면: **하나의 설치 프로그램이 모든 AI 코딩 도구를 서비스합니다**.

### 어떤 문제를 해결합니까

| 문제 | 해결 방안 |
|--- | ---|
| 스킬 형식이 통일되어 있지 않음 | Claude Code의 표준 SKILL.md 형식 사용 |
| 스킬을 도구 간에 공유할 수 없음 | 통합된 AGENTS.md를 생성하여 모든 도구가 읽을 수 있음 |
| 스킬 관리가 분산되어 있음 | 통합된 설치, 업데이트, 삭제 명령어 |
| 프라이빗 스킬을 공유하기 어려움 | 로컬 경로와 개인 git 저장소에서 설치 지원 |

---

## 핵심 가치

OpenSkills는 다음 핵심 가치를 제공합니다:

### 1. 통합 표준

모든 에이전트가 동일한 스킬 형식과 AGENTS.md 설명을 사용하므로 새로운 형식을 학습할 필요가 없습니다.

- **Claude Code와 완전 호환**: 동일한 프롬프트 형식, 동일한 Marketplace, 동일한 폴더 구조
- **표준화된 SKILL.md**: 스킬 정의가 명확하고 개발 및 유지 관리가 용이

### 2. 점진적 로딩

필요에 따라 스킬을 로드하여 AI 컨텍스트를 간결하게 유지합니다.

- 모든 스킬을 한 번에 로드할 필요가 없음
- AI 에이전트가 작업 요구에 따라 관련 스킬을 동적으로 로드
- 컨텍스트 폭발을 방지하여 응답 품질 향상

### 3. 다중 에이전트 지원

한 세트의 스킬이 여러 에이전트를 서비스하므로 반복 설치가 필요 없습니다.

- Claude Code, Cursor, Windsurf, Aider가 동일한 스킬 세트 공유
- 통합된 스킬 관리 인터페이스
- 설정 및 유지 관리 비용 절감

### 4. 오픈소스 친화적

로컬 경로와 개인 git 저장소를 지원하므로 팀 협업에 적합합니다.

- 로컬 파일 시스템에서 스킬 설치(개발 중)
- 개인 git 저장소에서 설치(회사 내부 공유)
- 스킬을 프로젝트와 함께 버전 관리 가능

### 5. 로컬 실행

데이터 업로드 없이 프라이버시와 보안이 보장됩니다.

- 모든 스킬 파일이 로컬에 저장됨
- 클라우드 서비스에 의존하지 않아 데이터 유출 위험 없음
- 민감한 프로젝트와 기업 환경에 적합

---

## 작동 원리

OpenSkills의 작업 흐름은 간단하며 3단계로 구성됩니다:

### 첫 번째 단계: 스킬 설치

GitHub, 로컬 경로 또는 개인 git 저장소에서 스킬을 프로젝트에 설치합니다.

```bash
# Anthropic 공식 저장소에서 설치
openskills install anthropics/skills

# 로컬 경로에서 설치
openskills install ./my-skills
```

스킬은 프로젝트의 `.claude/skills/` 디렉터리(기본값) 또는 `.agent/skills/` 디렉터리(`--universal` 사용 시)에 설치됩니다.

### 두 번째 단계: AGENTS.md에 동기화

설치된 스킬을 AGENTS.md 파일에 동기화하여 AI 에이전트가 읽을 수 있는 스킬 목록을 생성합니다.

```bash
openskills sync
```

AGENTS.md는 다음과 같은 XML을 포함하게 됩니다:

```xml
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>
</available_skills>
```

### 세 번째 단계: AI 에이전트가 스킬 로드

AI 에이전트가 스킬을 사용해야 할 때 다음 명령어로 스킬 내용을 로드합니다:

```bash
openskills read <skill-name>
```

AI 에이전트는 스킬 내용을 동적으로 컨텍스트에 로드하여 작업을 실행합니다.

---

## Claude Code와의 관계

OpenSkills와 Claude Code는 보완 관계이며 대체 관계가 아닙니다.

### 형식 완전 호환

| 측면 | Claude Code | OpenSkills |
|--- | --- | ---|
| **프롬프트 형식** | `<available_skills>` XML | 동일한 XML |
| **스킬 저장** | `.claude/skills/` | `.claude/skills/` (기본값) |
| **스킬 호출** | `Skill("name")` 툴 | `npx openskills read <name>` |
| **Marketplace** | Anthropic marketplace | GitHub (anthropics/skills) |
| **점진적 로딩** | ✅ | ✅ |

### 사용 시나리오 비교

| 시나리오 | 추천 도구 | 이유 |
|--- | --- | ---|
| Claude Code만 사용 | Claude Code 내장 | 추가 설치 불필요, 공식 지원 |
| 여러 AI 도구 혼용 | OpenSkills | 통합 관리, 중복 방지 |
| 프라이빗 스킬 필요 | OpenSkills | 로컬 및 개인 저장소 지원 |
| 팀 협업 | OpenSkills | 스킬 버전 관리 가능, 공유 용이 |

---

## 설치 위치 설명

OpenSkills는 세 가지 설치 위치를 지원합니다:

| 설치 위치 | 명령어 | 적용 시나리오 |
|--- | --- | ---|
| **프로젝트 로컬** | 기본값 | 단일 프로젝트에서 사용, 스킬을 프로젝트 버전으로 관리 |
| **전역 설치** | `--global` | 모든 프로젝트에서 공통 스킬 공유 |
| **Universal 모드** | `--universal` | 다중 에이전트 환경, Claude Code와 충돌 방지 |

::: tip 언제 Universal 모드를 사용하나요?
Claude Code와 다른 AI 코딩 에이전트(Cursor, Windsurf 등)를 동시에 사용하는 경우, `--universal`로 `.agent/skills/`에 설치하면 여러 에이전트가 동일한 스킬 세트를 공유할 수 있어 충돌을 방지할 수 있습니다.
:::

---

## 스킬 생태계 시스템

OpenSkills는 Claude Code와 동일한 스킬 생태계 시스템을 사용합니다:

### 공식 스킬 라이브러리

Anthropic에서 공식적으로 관리하는 스킬 저장소: [anthropics/skills](https://github.com/anthropics/skills)

일반적인 스킬 포함:
- PDF 처리
- 이미지 생성
- 데이터 분석
- 기타 등등...

### 커뮤니티 스킬

SKILL.md 파일만 포함하면 모든 GitHub 저장소가 스킬 소스가 될 수 있습니다.

### 사용자 정의 스킬

표준 형식을 사용하여 나만의 스킬을 만들고 팀과 공유할 수 있습니다.

---

## 이 장 요약

OpenSkills의 핵심 아이디어는 다음과 같습니다:

1. **통합 표준**: Claude Code의 SKILL.md 형식 사용
2. **다중 에이전트 지원**: 모든 AI 코딩 도구가 스킬 생태계를 공유
3. **점진적 로딩**: 필요에 따라 로드하여 컨텍스트 간결 유지
4. **로컬 실행**: 데이터 업로드 없이 프라이버시와 보안 보장
5. **오픈소스 친화적**: 로컬 및 개인 저장소 지원

OpenSkills를 통해 다음을 할 수 있습니다:
- 다른 AI 도구 간에 원활하게 전환
- 모든 스킬을 통합 관리
- 프라이빗 스킬을 사용하고 공유
- 개발 효율성 향상

---

## 다음 장 예고

> 다음 장에서는 **[OpenSkills 도구 설치](../installation/)**를 학습합니다
>
> 학습할 내용:
> - Node.js 및 Git 환경 확인 방법
> - npx 또는 전역 설치로 OpenSkills 설치
> - 설치 성공 여부 확인
> - 일반적인 설치 문제 해결

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 핵심 유형 정의 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L24) | 1-24 |
| 스킬 인터페이스(Skill) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |
| 스킬 위치 인터페이스(SkillLocation) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L8-L12) | 8-12 |
| 설치 옵션 인터페이스(InstallOptions) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L14-L18) | 14-18 |
| 스킬 메타데이터 인터페이스(SkillMetadata) | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L20-L24) | 20-24 |

**핵심 인터페이스**:
- `Skill`: 설치된 스킬 정보(name, description, location, path)
- `SkillLocation`: 스킬 검색 위치 정보(path, baseDir, source)
- `InstallOptions`: 설치 명령어 옵션(global, universal, yes)
- `SkillMetadata`: 스킬 메타데이터(name, description, context)

**핵심 개념 출처**:
- README.md:22-86 - "What Is OpenSkills?" 섹션

</details>
