---
title: "문제 해결: OpenSkills 일반적인 문제 해결 | openskills"
sidebarTitle: "오류 발생 시 대처 방법"
subtitle: "문제 해결: OpenSkills 일반적인 문제 해결"
description: "OpenSkills 일반적인 오류를 해결합니다. 이 튜토리얼은 Git clone 실패, SKILL.md를 찾을 수 없음, 스킬을 찾을 수 없음, 권한 오류, 업데이트 건너뛰기 등의 문제를 다루며, 자세한 문제 해결 단계와 수정 방법을 제공하여 사용 중 발생하는 다양한 문제를 빠르게 해결할 수 있도록 돕습니다."
tags:
  - "FAQ"
  - "문제 해결"
  - "오류 해결"
prerequisite:
  - "start-quick-start"
  - "start-installation"
order: 2
---

# 문제 해결: OpenSkills 일반적인 문제 해결

## 학습 후 무엇을 할 수 있나요

- OpenSkills 사용 중 발생하는 일반적인 문제를 빠르게 진단하고 수정
- 오류 메시지의 원인 이해
- Git 클론, 권한, 파일 형식 등의 문제 해결 기술 습득
- 스킬을 다시 설치해야 하는 시점 파악

## 현재 겪고 계신 문제점

OpenSkills 사용 중 오류가 발생했지만 어떻게 해야 할지 모르는 경우:

```
Error: No SKILL.md files found in repository
```

또는 git clone 실패, 권한 오류, 파일 형식 오류... 이러한 문제들은 모두 스킬이 정상적으로 작동하지 않게 만들 수 있습니다.

## 언제 이 튜토리얼이 필요한가요

다음과 같은 상황에서:

- **설치 실패**: GitHub 또는 로컬 경로에서 설치 시 오류 발생
- **읽기 실패**: `openskills read`가 스킬을 찾을 수 없다고 표시
- **동기화 실패**: `openskills sync`가 스킬이 없거나 파일 형식 오류를 표시
- **업데이트 실패**: `openskills update`가 일부 스킬을 건너뜀
- **권한 오류**: 경로 액세스 제한 또는 보안 오류 표시

## 핵심 원리

OpenSkills의 오류는 주로 4가지 유형으로 분류됩니다:

| 오류 유형 | 일반적인 원인 | 해결 방법 |
| --- | --- | --- |
| **Git 관련** | 네트워크 문제, SSH 구성, 저장소 없음 | 네트워크 확인, Git 자격 증명 구성, 저장소 주소 확인 |
| **파일 관련** | SKILL.md 누락, 형식 오류, 경로 오류 | 파일 존재 확인, YAML 형식 검증 |
| **권한 관련** | 디렉터리 권한, 경로 순회, 심볼릭 링크 | 디렉터리 권한 확인, 설치 경로 검증 |
| **메타데이터 관련** | 업데이트 시 메타데이터 손실, 소스 경로 변경 | 스킬을 다시 설치하여 메타데이터 복원 |

**문제 해결 팁**:
1. **오류 메시지 확인**: 빨간색 출력에는 일반적으로 구체적인 원인이 포함됨
2. **노란색 힌트 확인**: 일반적으로 경고 및 제안, 예: `Tip: For private repos...`
3. **디렉터리 구조 확인**: `openskills list`로 설치된 스킬 확인
4. **소스 코드 위치 확인**: 오류 메시지에 검색 경로(4개 디렉터리) 나열

---

## 설치 실패

### 문제 1: Git clone 실패

**오류 메시지**:
```
Failed to clone repository
fatal: repository '...' not found
Tip: For private repos, ensure git SSH keys or credentials are configured
```

**가능한 원인**:

| 원인 | 시나리오 |
| --- | --- |
| 저장소 없음 | 잘못된 owner/repo 철자 |
| 프라이빗 저장소 | SSH 키 또는 Git 자격 증명 미구성 |
| 네트워크 문제 | GitHub 액세스 불가 |

**해결 방법**:

1. **저장소 주소 확인**:
   ```bash
   # 브라우저에서 저장소 URL 접속
   https://github.com/owner/repo
   ```

2. **Git 구성 확인**(프라이빗 저장소):
   ```bash
   # SSH 구성 확인
   ssh -T git@github.com

   # Git 자격 증명 구성
   git config --global credential.helper store
   ```

3. **클론 테스트**:
   ```bash
   git clone https://github.com/owner/repo.git
   ```

**다음을 확인해야 합니다**:
- 저장소가 로컬 디렉터리에 성공적으로 클론됨

---

### 문제 2: SKILL.md를 찾을 수 없음

**오류 메시지**:
```
Error: No SKILL.md files found in repository
Error: No valid SKILL.md files found
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 저장소에 SKILL.md 없음 | 저장소가 스킬 저장소가 아님 |
| SKILL.md에 frontmatter 없음 | YAML 메타데이터 누락 |
| SKILL.md 형식 오류 | YAML 구문 오류 |

**해결 방법**:

1. **저장소 구조 확인**:
   ```bash
   # 저장소 루트 디렉터리 확인
   ls -la

   # SKILL.md 존재 확인
   find . -name "SKILL.md"
   ```

2. **SKILL.md 형식 검증**:
   ```markdown
   ---
   name: 스킬 이름
   description: 스킬 설명
   ---

   스킬 내용...
   ```

   **필수**:
   - 시작 부분에 `---`로 구분된 YAML frontmatter
   - `name` 및 `description` 필드 포함

3. **공식 예제 확인**:
   ```bash
   git clone https://github.com/anthropics/skills.git
   cd skills
   ls -la
   ```

**다음을 확인해야 합니다**:
- 저장소에 하나 이상의 `SKILL.md` 파일 포함
- 각 SKILL.md 시작 부분에 YAML frontmatter 있음

---

### 문제 3: 경로가 존재하지 않거나 디렉터리가 아님

**오류 메시지**:
```
Error: Path does not exist: /path/to/skill
Error: Path must be a directory
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 경로 철자 오류 | 잘못된 경로 입력 |
| 경로가 파일을 가리킴 | 파일이 아닌 디렉터리여야 함 |
| 경로 미확장 | `~` 사용 시 확장 필요 |

**해결 방법**:

1. **경로 존재 확인**:
   ```bash
   # 경로 확인
   ls -la /path/to/skill

   # 디렉터리인지 확인
   file /path/to/skill
   ```

2. **절대 경로 사용**:
   ```bash
   # 절대 경로 가져오기
   realpath /path/to/skill

   # 설치 시 절대 경로 사용
   openskills install /absolute/path/to/skill
   ```

3. **상대 경로 사용**:
   ```bash
   # 프로젝트 디렉터리에서
   openskills install ./skills/my-skill
   ```

**다음을 확인해야 합니다**:
- 경로가 존재하고 디렉터리임
- 디렉터리에 `SKILL.md` 파일 포함

---

### 문제 4: SKILL.md 무효

**오류 메시지**:
```
Error: Invalid SKILL.md (missing YAML frontmatter)
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 필수 필드 누락 | `name` 및 `description` 필수 |
| YAML 구문 오류 | 콜론, 따옴표 등 형식 문제 |

**해결 방법**:

1. **YAML frontmatter 확인**:
   ```markdown
   ---              ← 시작 구분자
   name: my-skill   ← 필수
   description: 스킬 설명  ← 필수
   ---              ← 종료 구분자
   ```

2. **온라인 YAML 검증 도구 사용**:
   - YAML Lint 또는 유사한 도구로 구문 검증

3. **공식 예제 참조**:
   ```bash
   openskills install anthropics/skills
   cat .claude/skills/*/SKILL.md | head -20
   ```

**다음을 확인해야 합니다**:
- SKILL.md 시작 부분에 올바른 YAML frontmatter
- `name` 및 `description` 필드 포함

---

### 문제 5: 경로 순회 보안 오류

**오류 메시지**:
```
Security error: Installation path outside target directory
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 스킬 이름에 `..` 포함 | 대상 디렉터리 외부 경로 액세스 시도 |
| 심볼릭 링크가 외부를 가리킴 | symlink가 대상 디렉터리 외부를 가리킴 |
| 악의적인 스킬 | 스킬이 보안 제한을 우회하려고 시도 |

**해결 방법**:

1. **스킬 이름 확인**:
   - 스킬 이름에 `..`, `/` 등 특수 문자가 포함되지 않았는지 확인

2. **심볼릭 링크 확인**:
   ```bash
   # 스킬 디렉터리의 심볼릭 링크 확인
   find .claude/skills/skill-name -type l

   # 심볼릭 링크 대상 확인
   ls -la .claude/skills/skill-name
   ```

3. **안전한 스킬 사용**:
   - 신뢰할 수 있는 소스에서만 스킬 설치
   - 설치 전 스킬 코드 검토

**다음을 확인해야 합니다**:
- 스킬 이름에 문자, 숫자, 하이픈만 포함
- 외부를 가리키는 심볼릭 링크 없음

---

## 읽기 실패

### 문제 6: 스킬을 찾을 수 없음

**오류 메시지**:
```
Error: Skill(s) not found: my-skill

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 스킬 미설치 | 해당 스킬이 어떤 디렉터리에도 설치되지 않음 |
| 스킬 이름 철자 오류 | 이름이 일치하지 않음 |
| 다른 위치에 설치 | 스킬이 비표준 디렉터리에 설치됨 |

**해결 방법**:

1. **설치된 스킬 확인**:
   ```bash
   openskills list
   ```

2. **스킬 이름 확인**:
   - `openskills list` 출력과 비교
   - 이름이 완전히 일치하는지 확인(대소문자 구분)

3. **누락된 스킬 설치**:
   ```bash
   openskills install owner/repo
   ```

4. **모든 디렉터리 검색**:
   ```bash
   # 4개 스킬 디렉터리 확인
   ls -la .agent/skills/
   ls -la ~/.agent/skills/
   ls -la .claude/skills/
   ls -la ~/.claude/skills/
   ```

**다음을 확인해야 합니다**:
- `openskills list`에 대상 스킬 표시
- 스킬이 4개 디렉터리 중 하나에 존재

---

### 문제 7: 스킬 이름 미제공

**오류 메시지**:
```
Error: No skill names provided
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 매개변수 누락 | `openskills read` 뒤에 매개변수 없음 |
| 빈 문자열 | 빈 문자열 전달 |

**해결 방법**:

1. **스킬 이름 제공**:
   ```bash
   # 단일 스킬
   openskills read my-skill

   # 여러 스킬(쉼표로 구분)
   openskills read skill1,skill2,skill3
   ```

2. **먼저 사용 가능한 스킬 확인**:
   ```bash
   openskills list
   ```

**다음을 확인해야 합니다**:
- 스킬 내용이 표준 출력으로 성공적으로 읽힘

---

## 동기화 실패

### 문제 8: 출력 파일이 Markdown이 아님

**오류 메시지**:
```
Error: Output file must be a markdown file (.md)
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 출력 파일이 .md가 아님 | .txt, .json 등 형식 지정 |
| --output 매개변수 오류 | 경로가 .md로 끝나지 않음 |

**해결 방법**:

1. **.md 파일 사용**:
   ```bash
   # 올바름
   openskills sync -o AGENTS.md
   openskills sync -o custom.md

   # 잘못됨
   openskills sync -o AGENTS.txt
   openskills sync -o AGENTS
   ```

2. **사용자 정의 출력 경로**:
   ```bash
   # 하위 디렉터리로 출력
   openskills sync -o .ruler/AGENTS.md
   openskills sync -o docs/agents.md
   ```

**다음을 확인해야 합니다**:
- .md 파일이 성공적으로 생성됨
- 파일에 스킬 XML 섹션 포함

---

### 문제 9: 스킬 미설치

**오류 메시지**:
```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 스킬을 설치한 적 없음 | OpenSkills 처음 사용 |
| 스킬 디렉터리 삭제 | 스킬 파일을 수동으로 삭제 |

**해결 방법**:

1. **스킬 설치**:
   ```bash
   # 공식 스킬 설치
   openskills install anthropics/skills

   # 다른 저장소에서 설치
   openskills install owner/repo
   ```

2. **설치 확인**:
   ```bash
   openskills list
   ```

**다음을 확인해야 합니다**:
- `openskills list`에 최소 하나의 스킬 표시
- 동기화 성공

---

## 업데이트 실패

### 문제 10: 소스 메타데이터 없음

**오류 메시지**:
```
Skipped: my-skill (no source metadata; re-install once to enable updates)
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 이전 버전 설치 | 메타데이터 기능 이전에 스킬 설치 |
| 수동 복사 | OpenSkills를 통하지 않고 스킬 디렉터리 직접 복사 |
| 메타데이터 파일 손상 | `.openskills.json` 손상 또는 손실 |

**해결 방법**:

1. **스킬 다시 설치**:
   ```bash
   # 이전 스킬 삭제
   openskills remove my-skill

   # 다시 설치
   openskills install owner/repo
   ```

2. **메타데이터 파일 확인**:
   ```bash
   # 스킬 메타데이터 확인
   cat .claude/skills/my-skill/.openskills.json
   ```

3. **스킬 유지하면서 메타데이터 추가**:
   - `.openskills.json` 수동 생성(권장하지 않음)
   - 다시 설치하는 것이 더 간단하고 안정적

**다음을 확인해야 합니다**:
- 업데이트 성공, 건너뛰기 경고 없음

---

### 문제 11: 로컬 소스 누락

**오류 메시지**:
```
Skipped: my-skill (local source missing)
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 로컬 경로 이동 | 소스 디렉터리 위치 변경 |
| 로컬 경로 삭제 | 소스 디렉터리 없음 |
| 경로 미확장 | `~` 사용했지만 메타데이터에 확장된 경로 저장 |

**해결 방법**:

1. **메타데이터의 로컬 경로 확인**:
   ```bash
   cat .claude/skills/my-skill/.openskills.json
   ```

2. **소스 디렉터리 복원 또는 메타데이터 업데이트**:
   ```bash
   # 소스 디렉터리가 이동한 경우
   openskills remove my-skill
   openskills install /new/path/to/skill

   # 또는 메타데이터 수동 편집(권장하지 않음)
   vi .claude/skills/my-skill/.openskills.json
   ```

**다음을 확인해야 합니다**:
- 로컬 소스 경로가 존재하고 `SKILL.md` 포함

---

### 문제 12: 저장소에서 SKILL.md를 찾을 수 없음

**오류 메시지**:
```
SKILL.md missing for my-skill
Skipped: my-skill (SKILL.md not found in repo at subpath)
```

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 저장소 구조 변경 | 스킬 하위 경로 또는 이름 변경 |
| 스킬 삭제 | 저장소에 더 이상 해당 스킬 포함하지 않음 |
| 하위 경로 오류 | 메타데이터에 기록된 하위 경로가 올바르지 않음 |

**해결 방법**:

1. **저장소 구조 확인**:
   ```bash
   # 저장소 클론하여 확인
   git clone https://github.com/owner/repo.git
   cd repo
   ls -la
   find . -name "SKILL.md"
   ```

2. **스킬 다시 설치**:
   ```bash
   openskills remove my-skill
   openskills install owner/repo/subpath
   ```

3. **저장소 업데이트 기록 확인**:
   - GitHub에서 저장소의 커밋 기록 확인
   - 스킬 이동 또는 삭제 기록 찾기

**다음을 확인해야 합니다**:
- 업데이트 성공
- SKILL.md가 기록된 하위 경로에 존재

---

## 권한 문제

### 문제 13: 디렉터리 권한 제한

**현상**:

| 작업 | 현상 |
| --- | --- |
| 설치 실패 | 권한 오류 표시 |
| 삭제 실패 | 파일을 삭제할 수 없다고 표시 |
| 읽기 실패 | 파일 액세스 제한 표시 |

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 디렉터리 권한 부족 | 사용자에게 쓰기 권한 없음 |
| 파일 권한 부족 | 파일이 읽기 전용 |
| 시스템 보호 | macOS SIP, Windows UAC 제한 |

**해결 방법**:

1. **디렉터리 권한 확인**:
   ```bash
   # 권한 확인
   ls -la .claude/skills/

   # 권한 수정(주의해서 사용)
   chmod -R 755 .claude/skills/
   ```

2. **sudo 사용(권장하지 않음)**:
   ```bash
   # 최후의 수단
   sudo openskills install owner/repo
   ```

3. **시스템 보호 확인**:
   ```bash
   # macOS: SIP 상태 확인
   csrutil status

   # SIP 비활성화가 필요한 경우(복구 모드 필요)
   # 권장하지 않음, 필요한 경우에만 사용
   ```

**다음을 확인해야 합니다**:
- 디렉터리와 파일을 정상적으로 읽고 쓸 수 있음

---

## 심볼릭 링크 문제

### 문제 14: 심볼릭 링크 손상

**현상**:

| 현상 | 설명 |
| --- | --- |
| 목록 표시 시 스킬 건너뜀 | `openskills list`에 해당 스킬이 표시되지 않음 |
| 읽기 실패 | 파일이 존재하지 않는다고 표시 |
| 업데이트 실패 | 소스 경로 무효 |

**가능한 원인**:

| 원인 | 설명 |
| --- | --- |
| 대상 디렉터리 삭제 | 심볼릭 링크가 존재하지 않는 경로를 가리킴 |
| 심볼릭 링크 손상 | 링크 파일 자체가 손상됨 |
| 장치 간 링크 | 일부 시스템에서 장치 간 심볼릭 링크를 지원하지 않음 |

**해결 방법**:

1. **심볼릭 링크 확인**:
   ```bash
   # 모든 심볼릭 링크 찾기
   find .claude/skills -type l

   # 링크 대상 확인
   ls -la .claude/skills/my-skill

   # 링크 테스트
   readlink .claude/skills/my-skill
   ```

2. **손상된 심볼릭 링크 삭제**:
   ```bash
   openskills remove my-skill
   ```

3. **다시 설치**:
   ```bash
   openskills install owner/repo
   ```

**다음을 확인해야 합니다**:
- 손상된 심볼릭 링크 없음
- 스킬이 정상적으로 표시되고 읽힘

---

## 주의사항

::: warning 일반적인 잘못된 작업

**❌ 이렇게 하지 마세요**:

- **스킬 디렉터리 직접 복사** → 메타데이터 손실로 업데이트 실패
- **`.openskills.json` 수동 편집** → 형식 손상으로 업데이트 실패
- **sudo로 스킬 설치** → root 소유 파일 생성, 이후 작업에 sudo 필요
- **`.openskills.json` 삭제** → 업데이트 시 해당 스킬 건너뜀

**✅ 이렇게 하세요**:

- `openskills install`로 설치 → 자동으로 메타데이터 생성
- `openskills remove`로 삭제 → 파일을 올바르게 정리
- `openskills update`로 업데이트 → 자동으로 소스에서 새로고침
- `openskills list`로 확인 → 스킬 상태 확인

:::

::: tip 문제 해결 팁

1. **간단한 것부터 시작**: 먼저 `openskills list`를 실행하여 상태 확인
2. **전체 오류 메시지 확인**: 노란색 힌트에는 일반적으로 해결 제안이 포함됨
3. **디렉터리 구조 확인**: `ls -la`로 파일과 권한 확인
4. **소스 코드 위치 확인**: 오류 메시지에 4개 검색 디렉터리 나열
5. **-y로 상호작용 건너뛰기**: CI/CD 또는 스크립트에서 `-y` 플래그 사용

:::

---

## 요약

이 수업에서는 OpenSkills 일반적인 문제의 해결 및 수정 방법을 학습했습니다:

| 문제 유형 | 주요 해결 방법 |
| --- | --- |
| Git clone 실패 | 네트워크 확인, 자격 증명 구성, 저장소 주소 확인 |
| SKILL.md를 찾을 수 없음 | 저장소 구조 확인, YAML 형식 검증 |
| 읽기 실패 | `openskills list`로 스킬 상태 확인 |
| 업데이트 실패 | 스킬을 다시 설치하여 메타데이터 복원 |
| 권한 문제 | 디렉터리 권한 확인, sudo 사용 피하기 |

**기억하세요**:
- 오류 메시지에는 일반적으로 명확한 힌트가 포함됨
- 다시 설치하는 것이 메타데이터 문제를 해결하는 가장 간단한 방법
- 신뢰할 수 있는 소스에서만 스킬 설치

## 다음 단계

- **[FAQ](../faq/) 확인** → 더 많은 질문에 대한 답변
- **[모범 사례](../../advanced/best-practices/) 학습** → 일반적인 오류 방지
- **[보안 설명](../../advanced/security/) 탐색** → 보안 메커니즘 이해

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 날짜: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| Git clone 실패 처리 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L162-L168) | 162-168 |
| 경로 없음 오류 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L205-L207) | 205-207 |
| 디렉터리 아님 오류 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L210-L213) | 210-213 |
| SKILL.md 무효 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L241-L243) | 241-243 |
| 경로 순회 보안 오류 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L256-L259) | 256-259 |
| SKILL.md를 찾을 수 없음 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L378-L380) | 378-380 |
| 스킬 이름 미제공 | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L10-L12) | 10-12 |
| 스킬을 찾을 수 없음 | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L26-L34) | 26-34 |
| 출력 파일이 Markdown 아님 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L23-L25) | 23-25 |
| 스킬 미설치 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L40-L43) | 40-43 |
| 소스 메타데이터 없음 건너뛰기 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L57-L61) | 57-61 |
| 로컬 소스 누락 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L66-L71) | 66-71 |
| 저장소에서 SKILL.md를 찾을 수 없음 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L102-L107) | 102-107 |

**핵심 함수**:
- `hasValidFrontmatter(content)`: SKILL.md에 유효한 YAML frontmatter가 있는지 검증
- `isPathInside(targetPath, targetDir)`: 경로가 대상 디렉터리 내에 있는지 검증(보안 검사)
- `findSkill(name)`: 4개 디렉터리에서 우선순위에 따라 스킬 찾기
- `readSkillMetadata(path)`: 스킬의 설치 소스 메타데이터 읽기

**핵심 상수**:
- 검색 디렉터리 순서(`src/utils/skills.ts`):
  1. `.agent/skills/` (project universal)
  2. `~/.agent/skills/` (global universal)
  3. `.claude/skills/` (project)
  4. `~/.claude/skills/` (global)

</details>
