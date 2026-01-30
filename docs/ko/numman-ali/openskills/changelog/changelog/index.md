---
title: "버전 로그: 기능 업데이트 | OpenSkills"
sidebarTitle: "새 기능 보기"
subtitle: "버전 로그: 기능 업데이트 | OpenSkills"
description: "OpenSkills 버전 변경 내역을 확인하고, update 명령, 심볼릭 링크, 프라이빗 저장소 등의 새 기능과 경로 순회 보호 등 중요한 개선 사항 및 문제 해결을 알아보세요."
tags:
  - "changelog"
  - "version history"
order: 1
---

# 변경 로그

이 페이지는 OpenSkills의 버전 변경 내역을 기록하며, 각 버전의 새로운 기능, 개선 사항 및 문제 해결 내용을 확인할 수 있습니다.

---

## [1.5.0] - 2026-01-17

### 새로운 기능

- **`openskills update`** - 기록된 소스에서 설치된 스킬을 새로고침합니다 (기본값: 모두 새로고침)
- **소스 메타데이터 추적** - 설치 시 소스 정보를 기록하여 스킬을 안정적으로 업데이트할 수 있습니다

### 개선 사항

- **다중 스킬 읽기** - `openskills read` 명령이 이제 쉼표로 구분된 스킬 이름 목록을 지원합니다
- **사용 안내 생성** - 셸 환경에서 read 명령 호출 안내를 최적화했습니다
- **README** - 업데이트 가이드와 수동 사용 안내를 추가했습니다

### 문제 해결

- **업데이트 경험 개선** - 소스 메타데이터가 없는 스킬은 건너뛰고, 해당 스킬 목록을 표시하여 재설치를 안내합니다

---

## [1.4.0] - 2026-01-17

### 개선 사항

- **README** - 프로젝트 로컬 기본 설치 방식을 명확히 하고, 중복된 sync 안내를 제거했습니다
- **설치 메시지** - 설치 프로그램이 이제 프로젝트 로컬 기본 설치와 `--global` 옵션을 명확히 구분합니다

---

## [1.3.2] - 2026-01-17

### 개선 사항

- **문서와 AGENTS.md 가이드** - 모든 명령 예제와 생성된 사용 안내를 `npx openskills`로 통일했습니다

---

## [1.3.1] - 2026-01-17

### 문제 해결

- **Windows 설치** - Windows 시스템의 경로 검증 문제를 수정했습니다 ("Security error: Installation path outside target directory")
- **CLI 버전** - `npx openskills --version`이 이제 package.json의 버전 번호를 올바르게 읽습니다
- **루트 디렉토리 SKILL.md** - 저장소 루트 디렉토리의 SKILL.md로 단일 스킬 저장소 설치 문제를 수정했습니다

---

## [1.3.0] - 2025-12-14

### 새로운 기능

- **심볼릭 링크 지원** - 스킬을 이제 심볼릭 링크를 통해 스킬 디렉토리에 설치할 수 있습니다 ([#3](https://github.com/numman-ali/openskills/issues/3))
  - 복제된 저장소에서 심볼릭 링크를 생성하여 git 기반 스킬 업데이트를 지원합니다
  - 로컬 스킬 개발 워크플로우를 지원합니다
  - 손상된 심볼릭 링크는 자동으로 건너뜁니다

- **구성 가능한 출력 경로** - sync 명령에 `--output` / `-o` 옵션이 추가되었습니다 ([#5](https://github.com/numman-ali/openskills/issues/5))
  - 임의의 `.md` 파일(예: `.ruler/AGENTS.md`)에 동기화할 수 있습니다
  - 파일이 없으면 자동으로 파일을 생성하고 제목을 추가합니다
  - 필요한 경우 중첩 디렉토리를 자동으로 생성합니다

- **로컬 경로 설치** - 로컬 디렉토리에서 스킬을 설치할 수 있습니다 ([#10](https://github.com/numman-ali/openskills/issues/10))
  - 절대 경로 지원 (`/path/to/skill`)
  - 상대 경로 지원 (`./skill`, `../skill`)
  - 물결표 확장 지원 (`~/my-skills/skill`)

- **프라이빗 git 저장소 지원** - 프라이빗 저장소에서 스킬을 설치할 수 있습니다 ([#10](https://github.com/numman-ali/openskills/issues/10))
  - SSH URLs (`git@github.com:org/private-skills.git`)
  - 인증이 포함된 HTTPS URLs
  - 시스템 SSH 키를 자동으로 사용합니다

- **포괄적인 테스트 스위트** - 6개 테스트 파일에 걸쳐 88개의 테스트
  - 심볼릭 링크 감지, YAML 구문 분석의 단위 테스트
  - install, sync 명령의 통합 테스트
  - 완전한 CLI 워크플로우의 엔드-투-엔드 테스트

### 개선 사항

- **`--yes` 플래그가 이제 모든 프롬프트를 건너뜁니다** - 완전 비대화형 모드, CI/CD에 적합합니다 ([#6](https://github.com/numman-ali/openskills/issues/6))
  - 기존 스킬을 덮어쓸 때 프롬프트를 표시하지 않습니다
  - 프롬프트를 건너뛸 때 `Overwriting: <skill-name>` 메시지를 표시합니다
  - 모든 명령이 헤드리스 환경에서 실행될 수 있습니다

- **CI 워크플로우 재배치** - 빌드 단계가 이제 테스트 전에 실행됩니다
  - 엔드-투-엔드 테스트를 위해 `dist/cli.js`가 존재하도록 합니다

### 보안

- **경로 순회 보호** - 설치 경로가 대상 디렉토리 내에 있는지 검증합니다
- **심볼릭 링크 역참조** - `cpSync`는 `dereference: true`를 사용하여 심볼릭 링크 대상을 안전하게 복사합니다
- **비탐욕적 YAML 정규식** - frontmatter 구문 분석에서 잠재적인 ReDoS 공격을 방지합니다

---

## [1.2.1] - 2025-10-27

### 문제 해결

- README 문서 정리 - 중복 섹션과 잘못된 플래그를 제거했습니다

---

## [1.2.0] - 2025-10-27

### 새로운 기능

- `--universal` 플래그, 스킬을 `.claude/skills/` 대신 `.agent/skills/`에 설치
  - 다중 에이전트 환경(Claude Code + Cursor/Windsurf/Aider)에 적합합니다
  - Claude Code 네이티브 마켓플레이스 플러그인과의 충돌을 방지합니다

### 개선 사항

- 프로젝트 로컬 설치가 이제 기본 옵션입니다 (이전에는 전역 설치)
- 스킬은 기본적으로 `./.claude/skills/`에 설치됩니다

---

## [1.1.0] - 2025-10-27

### 새로운 기능

- 기술적 심층 분석을 포함한 포괄적인 단일 페이지 README
- Claude Code와의 병렬 비교

### 문제 해결

- 위치 라벨이 이제 설치 위치에 따라 `project` 또는 `global`을 올바르게 표시합니다

---

## [1.0.0] - 2025-10-26

### 새로운 기능

- 초기 릴리스
- `npx openskills install <source>` - GitHub 저장소에서 스킬 설치
- `npx openskills sync` - AGENTS.md에 `<available_skills>` XML 생성
- `npx openskills list` - 설치된 스킬 표시
- `npx openskills read <name>` - 에이전트를 위한 스킬 콘텐츠 로드
- `npx openskills manage` - 대화형 스킬 삭제
- `npx openskills remove <name>` - 지정된 스킬 삭제
- 모든 명령의 대화형 TUI 인터페이스
- Anthropic의 SKILL.md 형식 지원
- 점진적 공개(필요한 스킬만 로드)
- 리소스 패키징 지원(references/, scripts/, assets/)

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능           | 파일 경로                                                                      |
|--- | ---|
| 변경 로그 원문   | [`CHANGELOG.md`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md) |

</details>
