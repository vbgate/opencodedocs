---
title: "스크립트 실행: 스킬 디렉토리 실행 | opencode-agent-skills"
sidebarTitle: "자동화 스크립트 실행"
subtitle: "스크립트 실행: 스킬 디렉토리 실행"
description: "스킬 스크립트 실행 방법을 마스터하세요. 스킬 디렉토리 컨텍스트에서 스크립트 실행, 매개변수 전달, 오류 처리, 권한 설정을 학습하고 자동화 능력을 활용하여 업무 효율을 높이세요."
tags:
  - "스크립트 실행"
  - "자동화"
  - "도구 사용"
prerequisite:
  - "/ko/joshuadavidthomas/opencode-agent-skills/start/installation"
  - "/ko/joshuadavidthomas/opencode-agent-skills/platforms/listing-available-skills"
order: 5
---

# 스킬 스크립트 실행

## 학습 후 가능한 작업

- `run_skill_script` 도구를 사용하여 스킬 디렉토리의 실행 가능한 스크립트 실행
- 스크립트에 명령줄 매개변수 전달
- 스크립트 실행의 작업 디렉토리 컨텍스트 이해
- 스크립트 실행 오류 및 종료 코드 처리
- 스크립트 권한 설정 및 보안 메커니즘 마스터

## 현재 상황

AI가 특정 스킬의 자동화 스크립트를 실행하길 원합니다. 예: 프로젝트 빌드, 테스트 실행 또는 애플리케이션 배포. 하지만 스크립트 호출 방법을 확신하지 못하거나, 실행 시 권한 오류, 스크립트를 찾을 수 없는 문제가 발생합니다.

## 언제 사용하나요

- **자동화 빌드**: 스킬의 `build.sh` 또는 `build.py`로 프로젝트 빌드 실행
- **테스트 실행**: 스킬의 테스트 스위트 트리거하여 커버리지 보고서 생성
- **배포 프로세스**: 배포 스크립트 실행하여 애플리케이션을 프로덕션 환경에 배포
- **데이터 처리**: 스크립트 실행으로 파일 처리, 데이터 형식 변환
- **의존성 설치**: 스크립트 실행하여 스킬에 필요한 의존성 설치

## 핵심 개념

`run_skill_script` 도구는 스킬 디렉토리의 컨텍스트에서 실행 가능한 스크립트를 실행합니다. 이 방식의 장점은:

- **올바른 실행 환경**: 스크립트가 스킬 디렉토리에서 실행되므로 스킬의 구성 및 리소스에 접근 가능
- **자동화 워크플로우**: 스킬이 자동화 스크립트 세트를 포함할 수 있어 반복 작업 감소
- **권한 검사**: 실행 가능 권한이 있는 파일만 실행하여 일반 텍스트 파일의 오류 실행 방지
- **오류 캡처**: 스크립트의 종료 코드 및 출력을 캡처하여 디버깅 용이

::: info 스크립트 발견 규칙
플러그인은 스킬 디렉토리에서 재귀적으로 실행 가능 파일을 검색합니다 (최대 깊이 10층):
- **디렉토리 건너뛰기**: 숨겨진 디렉토리(`.`로 시작), `node_modules`, `__pycache__`, `.git`, `.venv` 등
- **실행 가능 확인**: 파일에 실행 가능 권한이 있어야만(mode & 0o111) 스크립트 목록에 포함
- **상대 경로**: 스크립트 경로는 스킬 디렉토리에 상대적이며, 예: `tools/build.sh`
:::

::: tip 사용 가능한 스크립트 먼저 확인
실행 전, 먼저 `get_available_skills`로 스킬의 스크립트 목록을 확인하세요:
```
docker-helper (project)
  Docker 컨테이너화 및 배포 가이드 [scripts: build.sh, deploy.sh]
```
:::

## 함께 해보기

### 1단계: 스킬 스크립트 실행

`docker-helper` 스킬이 있고 `build.sh` 스크립트를 포함한다고 가정:

```
사용자 입력:
docker-helper의 build.sh 스크립트 실행

시스템 응답:
Building Docker image...
Successfully built abc123def456
Tagged as myapp:latest
```

**예상 결과**: 스크립트의 출력 내용이 응답에 표시됩니다.

스크립트 실행 시 작업 디렉토리가 스킬 디렉토리로 변경되므로, `build.sh`는 스킬의 `Dockerfile` 등 리소스를 올바르게 접근할 수 있습니다.

### 2단계: 명령줄 매개변수 전달

많은 스크립트가 매개변수를 지원합니다. 예: `deploy.sh`는 환경 지정이 필요할 수 있음:

```
사용자 입력:
docker-helper의 deploy.sh 실행, 매개변수는 production

시스템 응답:
Deploying to production environment...
Uploading image to registry...
Deployment successful: https://myapp.example.com
```

여러 매개변수도 전달할 수 있습니다:

```
사용자 입력:
deploy.sh로 배포, 매개변수는 staging과 --force

시스템 응답:
Deploying to staging environment (--force mode)...
Skipping validation...
Deployment successful
```

**예상 결과**: 스크립트가 매개변수를 수신하여 해당 작업을 수행합니다.

### 3단계: 중첩 디렉토리의 스크립트 실행

스크립트는 스킬의 하위 디렉토리에 있을 수 있습니다. 예: `tools/setup.sh`:

```
사용자 입력:
docker-helper의 tools/setup.sh 실행

시스템 응답:
Setting up Docker environment...
✓ Docker network created
✓ Volume mounted
✓ Environment configured
```

상대 경로는 항상 스킬 디렉토리에 상대적이며, 스크립트의 실제 위치가 깊어도 상관없습니다.

**예상 결과**: 중첩 디렉토리의 스크립트도 올바르게 실행됩니다.

### 4단계: 스킬 존재하지 않음 오류 처리

잘못된 스킬 이름을 입력한 경우:

```
사용자 입력:
docker-asistant의 build.sh 실행

시스템 응답:
Skill "docker-asistant" not found. Did you mean "docker-helper"?
```

플러그인은 퍼지 매칭을 기반으로 올바른 스킬 이름을 제안합니다. 먼저 `get_available_skills`를 호출하여 사용 가능한 스킬을 확인할 수 있습니다.

**예상 결과**: 오류 메시지와 올바른 이름 제안이 표시됩니다.

### 5단계: 스크립트 존재하지 않음 오류 처리

스크립트가 스킬의 스크립트 목록에 없는 경우:

```
사용자 입력:
docker-helper의 run.sh 실행

시스템 응답:
Script "run.sh" not found in skill "docker-helper". Did you mean "build.sh"?
Available scripts: build.sh, deploy.sh
```

플러그인은 모든 사용 가능한 스크립트를 나열하여 올바른 스크립트 이름을 선택할 수 있게 합니다.

**예상 결과**: 오류 메시지와 사용 가능한 스크립트 목록이 표시됩니다.

### 6단계: 스크립트 실행 실패 이해

스크립트 실행 실패 시(종료 코드가 0이 아님), 플러그인은 오류 정보를 반환합니다:

```
사용자 입력:
docker-helper의 build.sh 실행

시스템 응답:
Script failed (exit 1): Dockerfile not found in /path/to/skill
```

오류 정보에는 다음이 포함됩니다:
- **종료 코드**: `exit 1`은 스크립트가 0이 아닌 상태로 종료됨을 나타냄
- **오류 출력**: 스크립트의 stderr 또는 stdout 내용
- **실패 원인**: 스크립트의 구체적인 오류 정보

**예상 결과**: 문제를 파악하는 데 도움이 되는 상세한 오류 정보가 표시됩니다.

## 체크포인트 ✅

- [ ] 스킬 디렉토리의 실행 가능한 스크립트를 실행할 수 있나요?
- [ ] 스크립트에 명령줄 매개변수를 전달할 수 있나요?
- [ ] 스크립트 실행의 작업 디렉토리 컨텍스트를 이해하나요?
- [ ] 스크립트 실행 오류를 식별하고 처리할 수 있나요?
- [ ] 스크립트의 권한 설정을 확인하는 방법을 알고 있나요?

## 주의사항

### 함정 1: 스크립트에 실행 가능 권한 없음

새 스크립트를 생성했지만 실행 가능 권한을 설정하는 것을 잊은 경우, 스크립트 목록에 나타나지 않습니다.

**오류 현상**:
```
Available scripts: build.sh  # 새 스크립트 new-script.sh가 목록에 없음
```

**원인**: 파일에 실행 가능 권한이 없음(mode & 0o111이 false).

**해결**: 터미널에서 실행 가능 권한을 설정하세요:
```bash
chmod +x .opencode/skills/my-skill/new-script.sh
```

**검증**: 다시 `get_available_skills`를 호출하여 스크립트 목록을 확인하세요.

### 함정 2: 스크립트 경로 오류

스크립트 경로는 스킬 디렉토리에 대한 상대 경로여야 하며, 절대 경로나 상위 디렉토리 참조는 사용할 수 없습니다.

**잘못된 예시**:

```bash
# ❌ 오류: 절대 경로 사용
docker-helper의 /path/to/skill/build.sh 실행

# ❌ 오류: 상위 디렉토리 접근 시도(보안 검사는 통과하지만 경로가 올바르지 않음)
docker-helper의 ../build.sh 실행
```

**올바른 예시**:

```bash
# ✅ 올바름: 상대 경로 사용
docker-helper의 build.sh 실행
docker-helper의 tools/deploy.sh 실행
```

**원인**: 플러그인은 경로 안전성을 검증하여 디렉토리 트래버설 공격을 방지하며, 상대 경로는 스킬 디렉토리를 기준으로 합니다.

### 함정 3: 스크립트가 작업 디렉토리에 의존

스크립트가 현재 디렉토리가 프로젝트 루트라고 가정하고 스킬 디렉토리가 아니면 실행이 실패할 수 있습니다.

**잘못된 예시**:
```bash
# 스킬 디렉토리의 build.sh
#!/bin/bash
# ❌ 오류: 현재 디렉토리가 프로젝트 루트라고 가정
docker build -t myapp .
```

**문제**: 실행 시 현재 디렉토리는 스킬 디렉토리(`.opencode/skills/docker-helper`)이며, 프로젝트 루트가 아닙니다.

**해결**: 스크립트는 절대 경로를 사용하거나 프로젝트 루트를 동적으로 찾아야 합니다:
```bash
# ✅ 올바름: 상대 경로로 프로젝트 루트 찾기
docker build -t myapp ../../..

# 또는: 환경 변수 또는 구성 파일 사용
PROJECT_ROOT="${SKILL_DIR}/../../.."
docker build -t myapp "$PROJECT_ROOT"
```

**설명**: 스킬 디렉토리에는 프로젝트의 `Dockerfile`이 없을 수 있으므로, 스크립트가 리소스 파일을 직접 찾아야 합니다.

### 함정 4: 스크립트 출력이 너무 길음

스크립트가 많은 로그 정보를 출력하는 경우(예: npm install의 다운로드 진행률), 응답이 길어질 수 있습니다.

**현상**:

```bash
시스템 응답:
npm WARN deprecated package...
npm notice created a lockfile...
added 500 packages in 2m
# 수백 줄의 출력이 있을 수 있음
```

**권장사항**: 스크립트는 출력을 간소화하고 주요 정보만 표시해야 합니다:

```bash
#!/bin/bash
echo "의존성 설치 중..."
npm install --silent
echo "✓ 의존성 설치 완료 (500 패키지)"
```

## 이 과정 요약

`run_skill_script` 도구는 스킬 디렉토리의 컨텍스트에서 실행 가능한 스크립트를 실행하며 다음을 지원합니다:

- **매개변수 전달**: `arguments` 배열을 통해 명령줄 매개변수 전달
- **작업 디렉토리 변경**: 스크립트 실행 시 CWD를 스킬 디렉토리로 변경
- **오류 처리**: 종료 코드 및 오류 출력을 캡처하여 디버깅 용이
- **권한 검사**: 실행 가능 권한이 있는 파일만 실행
- **경로 보안**: 스크립트 경로를 검증하여 디렉토리 트래버설 방지

스크립트 발견 규칙:
- 스킬 디렉토리를 재귀적으로 스캔하며 최대 깊이 10층
- 숨겨진 디렉토리 및 일반적인 의존성 디렉토리 건너뛰기
- 실행 가능 권한이 있는 파일만 포함
- 경로는 스킬 디렉토리에 대한 상대 경로

**모범 사례**:
- 스크립트 출력은 간소화하고 주요 정보만 표시
- 스크립트는 현재 디렉토리가 프로젝트 루트라고 가정하지 않음
- `chmod +x`를 사용하여 새 스크립트의 실행 가능 권한 설정
- 먼저 `get_available_skills`로 사용 가능한 스크립트 확인

## 다음 과정 미리보기

> 다음 과정에서는 **[스킬 파일 읽기](../reading-skill-files/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - read_skill_file 도구를 사용하여 스킬의 문서 및 구성에 접근
> - 경로 보안 검사 메커니즘을 이해하여 디렉토리 트래버설 공격 방지
> - 파일 읽기 및 XML 콘텐츠 인젝션 형식 마스터
> - 스킬에서 지원 파일(문서, 예제, 구성 등)을 구성하는 방법 학습

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능        | 파일 경로                                                                                    | 행 번호    |
|--- | --- | ---|
| RunSkillScript 도구 정의 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| findScripts 함수 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L59-L99) | 59-99   |

**핵심 타입**:
- `Script = { relativePath: string; absolutePath: string }`: 스크립트 메타데이터, 상대 경로 및 절대 경로 포함

**핵심 상수**:
- 최대 재귀 깊이: `10`(`skills.ts:64`) - 스크립트 검색 깊이 제한
- 건너뛸 디렉토리 목록: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`(`skills.ts:61`)
- 실행 가능 권한 마스크: `0o111`(`skills.ts:86`) - 파일 실행 가능 여부 확인

**핵심 함수**:
- `RunSkillScript(skill: string, script: string, arguments?: string[])`: 스킬 스크립트 실행, 매개변수 전달 및 작업 디렉토리 변경 지원
- `findScripts(skillPath: string)`: 스킬 디렉토리에서 재귀적으로 실행 가능 파일을 찾고 상대 경로로 정렬하여 반환

**비즈니스 규칙**:
- 스크립트 실행 시 작업 디렉토리를 스킬 디렉토리로 변경(`tools.ts:180`): `$.cwd(skill.path)`
- 스킬의 scripts 목록에 있는 스크립트만 실행(`tools.ts:165-177`)
- 스크립트가 없을 때 사용 가능한 스크립트 목록을 반환하고 퍼지 매칭 제안 지원(`tools.ts:168-176`)
- 실행 실패 시 종료 코드 및 오류 출력 반환(`tools.ts:184-195`)
- 숨겨진 디렉토리(`.`로 시작) 및 일반적인 의존성 디렉토리 건너뛰기(`skills.ts:70-71`)

</details>
