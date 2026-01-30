---
title: "문제 해결: 오류 수정 | Agent Skills"
sidebarTitle: "배포/스킬 오류 발생 시"
subtitle: "문제 해결: 오류 수정"
description: "Agent Skills의 네트워크 오류, 스킬 미활성화, 규칙 검증 실패 등의 문제를 해결하세요. 빠른 진단 방법과 수정 단계를 익혀 일반적인 문제를 효율적으로 해결합니다."
tags:
- "FAQ"
- "문제 해결"
- "디버깅"
- "네트워크 설정"
order: 90
prerequisite:
- "start-getting-started"
- "start-installation"
---

# 일반적인 문제 해결

## 학습 완료 후 할 수 있는 것

- 배포 시 발생하는 네트워크 오류를 빠르게 진단하고 해결
- 스킬이 활성화되지 않는 문제 수정
- 규칙 검증 실패 오류 처리
- 프레임워크 감지가 부정확한 원인 식별

## 배포 관련 문제

### Network Egress Error (네트워크 오류)

**문제**: Vercel에 배포할 때 네트워크 오류가 발생하며 외부 네트워크에 접근할 수 없다는 메시지가 표시됩니다.

**원인**: claude.ai 환경에서는 기본적으로 네트워크 접근 권한이 제한됩니다. `vercel-deploy-claimable` 스킬은 파일을 업로드하기 위해 `*.vercel.com` 도메인에 접근해야 합니다.

**해결 방법**:

::: tip claude.ai에서 네트워크 권한 구성

1. [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)에 접속
2. "Allowed Domains"에 `*.vercel.com` 추가
3. 설정 저장 후 다시 배포

:::

**검증 방법**:

```bash
# 네트워크 연결 테스트 (배포 실행 없음)
curl -I https://claude-skills-deploy.vercel.com/api/deploy
```

**예상 결과**:
```bash
HTTP/2 200
```

### 배포 실패: preview URL을 추출할 수 없음

**문제**: 배포 스크립트가 실행을 완료했지만 "Error: Could not extract preview URL from response" 오류가 표시됩니다.

**원인**: 배포 API가 오류 응답을 반환했습니다(`"error"` 필드 포함). 그러나 스크립트는 먼저 URL 추출 실패를 확인합니다.

소스 코드 [`deploy.sh:224-229`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L224-L229) 참조:

```bash
# 응답에서 오류 확인
if echo "$RESPONSE" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Error: $ERROR_MSG" >&2
  exit 1
fi
```

**해결 방법**:

1. 전체 오류 응답 확인:
```bash
# 프로젝트 루트에서 다시 배포 실행, 오류 메시지 확인
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh .
```

2. 일반적인 오류 유형:

| 오류 메시지 | 가능한 원인 | 해결 방법 |
|---|---|---|
| "File too large" | 프로젝트 크기 초과 | 불필요한 파일 제외 (`*.log`, `*.test.ts` 등) |
| "Invalid framework" | 프레임워크 인식 실패 | `package.json` 추가 또는 프레임워크 수동 지정 |
| "Network timeout" | 네트워크 시간 초과 | 네트워크 연결 확인, 배포 재시도 |

**예방 조치**:

배포 스크립트는 자동으로 `node_modules`와 `.git`을 제외합니다(소스 코드 [`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210) 참조). 추가 최적화를 위해:

```bash
# deploy.sh 수정, 더 많은 제외 항목 추가
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='coverage' \
  --exclude='.next' \
  .
```

### 프레임워크 감지 부정확

**문제**: 배포 시 감지된 프레임워크가 실제와 다르거나 `null`을 반환합니다.

**원인**: 프레임워크 감지는 `package.json`의 종속성 목록에 의존합니다. 종속성이 누락되거나 프로젝트 유형이 특수한 경우 감지가 실패할 수 있습니다.

소스 코드 [`deploy.sh:12-156`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L12-L156)의 감지 로직:

1. `package.json` 읽기
2. 특정 종속성 패키지 이름 확인
3. 우선순위 순서로 매칭 (Blitz → Next.js → Gatsby → ...)

**해결 방법**:

| 시나리오 | 해결 방법 |
|---|---|
| `package.json`이 있지만 감지 실패 | 종속성이 `dependencies` 또는 `devDependencies`에 있는지 확인 |
| 순수 정적 HTML 프로젝트 | 루트 디렉토리에 `index.html`이 있는지 확인. 스크립트는 단일 HTML 파일을 자동으로 이름 변경합니다(소스 코드 [`deploy.sh:198-205`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L198-L205) 참조) |
| 지원 목록에 없는 프레임워크 | 직접 배포 (framework가 null), Vercel이 자동 감지 |

**프레임워크 감지 수동 확인**:

```bash
# 프레임워크 감지 시뮬레이션 (bash 환경 필요)
grep -E '"(next|gatsby|vite|astro)"' package.json
```

## 스킬 활성화 문제

### 스킬이 활성화되지 않음

**문제**: Claude에서 관련 프롬프트(예: "Deploy my app")를 사용했지만 스킬이 활성화되지 않습니다.

**원인**: 스킬 활성화는 프롬프트의 키워드 매칭에 의존합니다. 키워드가 명확하지 않거나 스킬이 올바르게 로드되지 않은 경우 AI가 사용할 스킬을 인식할 수 없습니다.

**해결 방법**:

::: warning 확인 목록

1. **스킬이 설치되었는지 확인**:
```bash
# Claude Desktop 사용자
ls ~/.claude/skills/ | grep agent-skills

# claude.ai 사용자
프로젝트 지식베이스에 agent-skills가 포함되어 있는지 확인
```

2. **명확한 키워드 사용**:
- ✅ 사용 가능: `Deploy my app to Vercel`
- ✅ 사용 가능: `Review this React component for performance`
- ✅ 사용 가능: `Check accessibility of my site`
- ❌ 사용 불가: `帮我部署` (키워드 누락)

3. **스킬 다시 로드**:
- Claude Desktop: 종료 후 다시 시작
- claude.ai: 페이지 새로고침 또는 프로젝트에 스킬 다시 추가

:::

**스킬 설명 확인**:

각 스킬의 `SKILL.md` 파일에는 트리거 키워드를 설명하는 설명이 포함되어 있습니다. 예를 들어:

- `vercel-deploy`: 키워드는 "Deploy", "deploy", "production" 포함
- `react-best-practices`: 키워드는 "React", "component", "performance" 포함

### Web 디자인 가이드라인에서 규칙을 가져올 수 없음

**문제**: `web-design-guidelines` 스킬을 사용할 때 GitHub에서 규칙을 가져올 수 없다는 메시지가 표시됩니다.

**원인**: 이 스킬은 최신 규칙을 가져오기 위해 GitHub 저장소에 접근해야 하지만, claude.ai는 기본적으로 네트워크 접근을 제한합니다.

**해결 방법**:

1. [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)에 추가:
- `raw.githubusercontent.com`
- `github.com`

2. 네트워크 접근 확인:
```bash
# 규칙 소스에 접근 가능한지 테스트
curl -I https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

**대체 방법**: 네트워크가 제한된 경우 규칙 파일을 수동으로 다운로드하여 로컬에 저장하고, 스킬 정의를 수정하여 로컬 경로를 가리키도록 합니다.

## 규칙 검증 문제

### VALIDATION_ERROR

**문제**: `pnpm validate` 실행 시 규칙 검증 실패 오류가 발생합니다.

**원인**: 규칙 파일 형식이 규격에 맞지 않거나, 필수 필드 또는 예제 코드가 누락되었습니다.

소스 코드 [`validate.ts:21-66`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66)의 검증 규칙:

1. **title 비어 있지 않음**: 규칙에는 제목이 있어야 함
2. **explanation 비어 있지 않음**: 규칙에는 설명이 있어야 함
3. **examples 비어 있지 않음**: 최소 하나의 코드 예제 포함
4. **impact 레벨 유효**: `CRITICAL`/`HIGH`/`MEDIUM-HIGH`/`MEDIUM`/`LOW-MEDIUM`/`LOW` 중 하나여야 함
5. **예제 코드 완전함**: 최소 "Incorrect/Correct" 비교 포함

**해결 방법**:

::: tip 검증 오류 예시 및 수정

| 오류 메시지 | 원인 | 수정 방법 |
|---|---|---|
| `Missing or empty title` | frontmatter에 `title` 누락 | 규칙 파일 상단에 추가:<br>`---`<br>`title: "규칙 제목"`<br>`---` |
| `Missing or empty explanation` | 규칙 설명 누락 | frontmatter에 `explanation` 필드 추가 |
| `Missing examples` | 코드 예제 없음 | `**Incorrect:**` 및 `**Correct:**` 코드 블록 추가 |
| `Invalid impact level` | impact 값 오류 | frontmatter의 `impact`가 유효한 열거값인지 확인 |
| `Missing bad/incorrect or good/correct examples` | 예제 레이블 불일치 | 예제 레이블에 "Incorrect" 또는 "Correct"가 포함되어 있는지 확인 |

:::

**완전한 예시**:

```markdown
---
title: "My Rule"
impact: "CRITICAL"
explanation: "규칙 설명 텍스트"
---

## My Rule

**Incorrect:**
```typescript
// 잘못된 예시
```

**Correct:**
```typescript
// 올바른 예시
```
```

**검증 실행**:

```bash
cd packages/react-best-practices-build
pnpm validate
```

**예상 결과**:
```
Validating rule files...
Rules directory: ../../skills/react-best-practices/rules
✓ All 57 rule files are valid
```

### 규칙 파일 파싱 실패

**문제**: 검증 시 `Failed to parse: ...` 메시지가 표시되며, 일반적으로 Markdown 형식 오류 때문입니다.

**원인**: frontmatter YAML 형식 오류, 제목 계층 불규칙, 또는 코드 블록 구문 오류.

**해결 방법**:

1. **frontmatter 확인**:
- 세 개의 대시 `---`로 감싸기
- 콜론 뒤에 공백 필수
- 문자열 값은 큰따옴표 사용 권장

2. **제목 계층 확인**:
- 규칙 제목은 `##` (H2) 사용
- 예제 레이블은 `**Incorrect:**` 및 `**Correct:**` 사용

3. **코드 블록 확인**:
- 세 개의 백틱 ```로 코드 감싸기
- 언어 유형 지정 (예: `typescript`)

**일반적인 오류 예시**:

```markdown
# ❌ 오류: frontmatter 콜론 뒤에 공백 없음
---
title:"my rule"
---

# ✅ 올바름
---
title: "my rule"
---

# ❌ 오류: 예제 레이블에 콜론 없음
**Incorrect**
```typescript
code
```

# ✅ 올바름
**Incorrect:**
```typescript
code
```
```

## 파일 권한 문제

### ~/.claude/skills/에 쓸 수 없음

**문제**: 설치 명령 실행 시 권한 오류가 표시됩니다.

**원인**: `~/.claude` 디렉토리가 존재하지 않거나 현재 사용자에게 쓰기 권한이 없습니다.

**해결 방법**:

```bash
# 디렉토리 수동 생성
mkdir -p ~/.claude/skills

# 스킬 패키지 복사
cp -r agent-skills/* ~/.claude/skills/

# 권한 확인
ls -la ~/.claude/skills/
```

**예상 결과**:
```
drwxr-xr-x user group size date react-best-practices/
drwxr-xr-x user group size date web-design-guidelines/
drwxr-xr-x user group size date vercel-deploy-claimable/
```

### Windows 사용자 경로 문제

**문제**: Windows에서 배포 스크립트 실행 시 경로 형식 오류가 발생합니다.

**원인**: Windows는 백슬래시 `\`를 경로 구분자로 사용하지만, Bash 스크립트는 정슬래시 `/`를 예상합니다.

**해결 방법**:

::: code-group

```bash [Git Bash / WSL]
# 경로 형식 변환
INPUT_PATH=$(pwd | sed 's/\\/\//g')
bash deploy.sh "$INPUT_PATH"
```

```powershell [PowerShell]
# PowerShell로 경로 변환
$INPUT_PATH = $PWD.Path -replace '\\', '/'
bash deploy.sh "$INPUT_PATH"
```

:::

**모범 사례**: Windows에서는 Git Bash 또는 WSL을 사용하여 배포 스크립트를 실행하세요.

## 성능 문제

### 빌드 속도가 느림

**문제**: `pnpm build` 실행 시 속도가 느리며, 특히 규칙 수가 많을 때 그렇습니다.

**원인**: 빌드 도구가 규칙 파일을 순차적으로 파싱합니다([`build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts) 참조). 병렬 처리를 사용하지 않습니다.

**해결 방법**:

1. **불필요한 단계 건너뛰기**:
```bash
# 빌드만 수행, 검증 건너뛰기
pnpm build

# 검증만 수행, 빌드 건너뛰기
pnpm validate
```

2. **캐시 정리**:
```bash
rm -rf node_modules/.cache
pnpm build
```

3. **하드웨어 최적화**:
- SSD 저장소 사용
- Node.js 버전 >= 20 확인

### 배포 업로드가 느림

**문제**: tarball을 Vercel에 업로드할 때 속도가 매우 느립니다.

**원인**: 프로젝트 크기가 크거나 네트워크 대역폭이 부족합니다.

**해결 방법**:

1. **프로젝트 크기 줄이기**:
```bash
# tarball 크기 확인
ls -lh .tgz

# 50MB를 초과하는 경우 최적화 고려
```

2. **제외 규칙 최적화**:

[`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210)을 수정하여 제외 항목 추가:

```bash
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.vscode' \
  --exclude='dist' \
  --exclude='build' \
  .
```

## 수업 요약

Agent Skills의 일반적인 문제는 주로 다음과 같습니다:

1. **네트워크 권한**: claude.ai에서 접근 허용 도메인을 구성해야 함
2. **스킬 활성화**: 명확한 키워드를 사용하여 스킬 트리거
3. **규칙 검증**: `_template.md` 템플릿을 따라 올바른 형식 보장
4. **프레임워크 감지**: `package.json`에 올바른 종속성이 포함되어 있는지 확인

문제가 발생하면 오류 메시지와 소스 코드의 오류 처리 로직(예: `validate.ts` 및 `deploy.sh`)을 우선 확인하세요.

## 도움 받기

위 방법으로 문제를 해결할 수 없는 경우:

1. **소스 코드 확인**:
- 배포 스크립트: [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)
- 검증 스크립트: [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
- 스킬 정의: [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md)

2. **GitHub Issues**: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/issues)에 문제 제출

3. **커뮤니티 토론**: 관련 기술 포럼(Twitter, Discord 등)에서 도움 요청

## 다음 수업 예고

> 다음 수업에서는 **[모범 사례 사용](../best-practices/)**을 학습합니다.
>
> 학습 내용:
> - 효율적인 스킬 트리거를 위한 키워드 선택
> - 컨텍스트 관리 팁
> - 다중 스킬 협업 시나리오
> - 성능 최적화 권장 사항

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 번호 |
|---|---|---|
| 네트워크 오류 처리 | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L100-L113) | 100-113 |
| 규칙 검증 로직 | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66 |
| 프레임워크 감지 로직 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156 |
| 배포 오류 처리 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 224-239 |
| 정적 HTML 처리 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |

**주요 상수**:
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"`: 배포 API 엔드포인트

**주요 함수**:
- `detect_framework()`: package.json에서 프레임워크 유형 감지
- `validateRule()`: 규칙 파일 형식 완전성 검증
- `cleanup()`: 임시 파일 정리

**오류 코드**:
- `VALIDATION_ERROR`: 규칙 검증 실패
- `INPUT_INVALID`: 배포 입력이 유효하지 않음(디렉토리 또는 .tgz가 아님)
- `API_ERROR`: 배포 API가 오류 반환

</details>
