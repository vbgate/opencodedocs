---
title: "Agent Skills 커스텀 스킬 개발: Claude 전용 AI 어시스턴트 생성 | Agent Skills 튜토리얼"
sidebarTitle: "스킬로 Claude 확장하기"
subtitle: "커스텀 스킬 개발"
description: "Claude를 위한 커스텀 스킬 개발 방법을 배웁니다. 디렉토리 구조 규격, SKILL.md 형식 상세 설명, 스크립트 작성 규격 및 Zip 패키징 배포 절차를 포함합니다. 이 튜토리얼을 통해 확장 가능한 AI 보조 도구를 생성하고, 스킬을 정확히 트리거하여 컨텍스트 효율성을 최적화하며, Claude의 코드 기능을 확장하고, 반복 작업을 캡슐화하며, 팀 표준화 프로세스를 구현하는 방법을 학습합니다."
tags:
  - "스킬 개발"
  - "Claude"
  - "AI 보조 프로그래밍"
  - "커스텀 확장"
order: 60
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# 커스텀 스킬 개발

## 학습 완료 후 가능한 작업

이 수업을 완료하면 다음을 수행할 수 있습니다:

- ✅ 규격에 맞는 스킬 디렉토리 구조 생성
- ✅ 완전한 `SKILL.md` 정의 파일 작성(Front Matter, How It Works, Usage 등 챕터 포함)
- ✅ 규격에 맞는 Bash 스크립트 작성(에러 처리, 출력 형식, 정리 메커니즘)
- ✅ 스킬을 Zip 파일로 패키징하여 배포
- ✅ 컨텍스트 효율성 최적화, Claude가 스킬을 더 정확히 활성화하도록 조정

## 현재 겪고 계신 문제점

다음과 같은 상황을 겪어보셨을 수 있습니다:

- ✗ 특정 복잡한 작업(특정 플랫폼 배포, 로그 형식 분석 등)을 자주 반복하며 매번 Claude에게 설명해야 함
- ✗ Claude가 언제 어떤 기능을 활성화해야 할지 몰라 동일한 지시를 반복적으로 입력해야 함
- ✗ 팀의 모범 사례를 재사용 가능한 도구로 캡슐화하고 싶지만 어디서부터 시작해야 할지 모름
- ✗ 작성한 스킬 파일이 Claude에 의해 자주 무시되며 문제가 무엇인지 파악하지 못함

## 언제 이 방법을 사용하나요

다음이 필요할 때:

- 📦 **반복 작업 캡슐화**: 자주 사용하는 명령 시퀀스를 원클릭 실행으로 패키징
- 🎯 **정밀 트리거**: 특정 시나리오에서 Claude가 스킬을 자동으로 활성화
- 🏢 **표준화 프로세스**: 팀 규격(코드 검사, 배포 절차 등) 자동화
- 🚀 **기능 확장**: Claude가 원래 지원하지 않는 기능 추가

## 🎒 시작 전 준비

시작 전, 다음을 확인하십시오:

::: warning 사전 점검

- [Agent Skills 입문](../../start/getting-started/) 완료
- Agent Skills 설치 및 기본 사용법 숙지
- 기본 명령줄 작업(Bash 스크립트) 이해
- GitHub 저장소 보유(스킬 배포용)

:::

## 핵심 개념

**Agent Skills 작동 원리**:

Claude는 시작 시 스킬의 **이름과 설명만** 로드하며, 관련 키워드를 감지했을 때만 완전한 `SKILL.md` 내용을 읽습니다. 이 **온디맨드 로딩 메커니즘**은 토큰 소비를 최소화할 수 있습니다.

**스킬 개발의 핵심 요소 3가지**:

1. **디렉토리 구조**: 명명 규격을 준수하는 폴더 레이아웃
2. **SKILL.md**: 스킬 정의 파일, Claude에게 언제 활성화하고 사용 방법을 알림
3. **스크립트**: 실제로 실행되는 Bash 코드, 구체적인 작업 담당

<!-- ![스킬 활성화 흐름](/images/advanced/skill-activation-flow.svg) -->
> [이미지: 스킬 활성화 흐름]

---

## 따라하기: 첫 번째 스킬 생성

### 1단계: 디렉토리 구조 생성

**이유**
올바른 디렉토리 구조는 Claude가 스킬을 인식할 수 있는 전제 조건입니다.

`skills/` 디렉토리에 새 스킬을 생성합니다:

```bash
cd skills
mkdir my-custom-skill
cd my-custom-skill
mkdir scripts
```

**디렉토리 구조는 다음과 같아야 합니다**:

```
skills/
  my-custom-skill/
    SKILL.md           # 스킬 정의 파일(필수)
    scripts/
      deploy.sh        # 실행 가능한 스크립트(필수)
```

**참고**: 개발 완료 후, 전체 스킬 디렉토리를 배포용 `my-custom-skill.zip`로 패키징해야 합니다(자세한 내용은 아래 "스킬 패키징" 부분 참조)

**다음을 확인해야 합니다**:
- `my-custom-skill/`는 kebab-case 명명 사용(소문자와 하이픈)
- `SKILL.md` 파일명은 전체 대문자이며 정확히 일치해야 함
- `scripts/` 디렉토리는 실행 가능한 스크립트를 보관

### 2단계: SKILL.md 작성

**이유**
`SKILL.md`는 스킬의 핵심으로, 스킬의 트리거 조건, 사용 방식 및 출력 형식을 정의합니다.

`SKILL.md` 파일을 생성합니다:

```markdown
---
name: my-custom-skill
description: Deploy my app to custom platform. Use when user says "deploy", "production", or "custom deploy".
---

# Custom Deployment Skill

Deploy your application to a custom platform with zero-config setup.

## How It Works

1. Detect the framework from `package.json` (Next.js, Vue, Svelte, etc.)
2. Create a tarball of the project (excluding `node_modules` and `.git`)
3. Upload to the deployment API
4. Return preview URL and deployment ID

## Usage

```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh [path]
```

**Arguments:**
- `path` - Directory path or .tgz file to deploy (defaults to current directory)

**Examples:**

Deploy current directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh .
```

Deploy specific directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh ./my-app
```

## Output

You'll see:

```
✓ Deployed to https://my-app-abc123.custom-platform.io
✓ Deployment ID: deploy_12345
✓ Claim URL: https://custom-platform.io/claim?code=...
```

JSON format (for machine-readable output):
```json
{
  "previewUrl": "https://my-app-abc123.custom-platform.io",
  "deploymentId": "deploy_12345",
  "claimUrl": "https://custom-platform.io/claim?code=..."
}
```

## Present Results to User

When presenting results to the user, use this format:

```
🎉 Deployment successful!

**Preview URL**: https://my-app-abc123.custom-platform.io

To transfer ownership:
1. Visit the claim URL
2. Sign in to your account
3. Confirm the transfer

**Deployment ID**: deploy_12345
```

## Troubleshooting

**Network Error**
- Check your internet connection
- Verify the deployment API is accessible

**Permission Error**
- Ensure the directory is readable
- Check file permissions on the script

**Framework Not Detected**
- Ensure `package.json` exists in the project root
- Verify the framework is supported
```

**다음을 확인해야 합니다**:
- Front Matter에 `name` 및 `description` 필드 포함
- `description`에 트리거 키워드 포함(예: "deploy", "production")
- `How It Works`, `Usage`, `Output`, `Present Results to User`, `Troubleshooting` 등 챕터 포함

### 3단계: Bash 스크립트 작성

**이유**
스크립트는 실제 작업을 실행하는 부분으로, Claude의 입력/출력 규격을 준수해야 합니다.

`scripts/deploy.sh`를 생성합니다:

```bash
#!/bin/bash
set -e  # 에러 발생 시 즉시 종료

# 구성
DEPLOY_API="${DEPLOY_API:-https://deploy.example.com/api}"

# 파라미터 파싱
INPUT_PATH="${1:-.}"

# 정리 함수
cleanup() {
  if [ -n "$TEMP_TARBALL" ] && [ -f "$TEMP_TARBALL" ]; then
    rm -f "$TEMP_TARBALL" >&2 || true
  fi
}
trap cleanup EXIT

# 프레임워크 감지
detect_framework() {
  local path="$1"
  local framework=""

  if [ -f "${path}/package.json" ]; then
    if grep -q '"next"' "${path}/package.json"; then
      framework="nextjs"
    elif grep -q '"vue"' "${path}/package.json"; then
      framework="vue"
    elif grep -q '"@sveltejs/kit"' "${path}/package.json"; then
      framework="sveltekit"
    fi
  fi

  echo "$framework"
}

# 메인 프로세스
FRAMEWORK=$(detect_framework "$INPUT_PATH")
echo "Detected framework: ${FRAMEWORK:-unknown}" >&2

# tarball 생성
TEMP_TARBALL=$(mktemp -t deploy-XXXXXX.tgz)
echo "Creating tarball..." >&2
tar -czf "$TEMP_TARBALL" \
  --exclude='node_modules' \
  --exclude='.git' \
  -C "$INPUT_PATH" . >&2 || true

# 업로드
echo "Uploading..." >&2
RESULT=$(curl -s -X POST "$DEPLOY_API" \
  -F "file=@$TEMP_TARBALL" \
  -F "framework=$FRAMEWORK")

# 에러 확인
if echo "$RESULT" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESULT" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Deployment failed: $ERROR_MSG" >&2
  exit 1
fi

# 결과 출력
echo "$RESULT"
echo "Deployment completed successfully" >&2
```

**다음을 확인해야 합니다**:
- 스크립트가 `#!/bin/bash` shebang 사용
- `set -e`를 사용하여 에러 처리
- 상태 메시지를 stderr로 출력(`>&2`)
- 머신에서 읽을 수 있는 출력(JSON)을 stdout으로 출력
- 정리 trap 포함

### 4단계: 실행 권한 설정

```bash
chmod +x scripts/deploy.sh
```

**다음을 확인해야 합니다**:
- 스크립트가 실행 가능한 파일로 변경됨(`ls -l scripts/deploy.sh`에서 `-rwxr-xr-x` 표시)

### 5단계: 스킬 테스트

Claude Code에서 스킬을 테스트합니다:

```bash
# 스킬 활성화
"Activate my-custom-skill"

# 배포 트리거
"Deploy my current directory using my-custom-skill"
```

**다음을 확인해야 합니다**:
- Claude가 스킬을 활성화함
- `deploy.sh` 스크립트를 실행함
- 배포 결과 출력(previewUrl 및 deploymentId 포함)

---

## 체크포인트 ✅

이제 스킬이 규격을 준수하는지 확인합니다:

- [ ] 디렉토리명이 kebab-case 사용(예: `my-custom-skill`)
- [ ] `SKILL.md` 파일명이 전체 대문자이며 오류 없음
- [ ] Front Matter에 `name` 및 `description` 필드 포함
- [ ] `description`에 트리거 키워드 포함
- [ ] 스크립트가 `#!/bin/bash` shebang 사용
- [ ] 스크립트가 `set -e`로 에러 처리
- [ ] 상태 메시지를 stderr로 출력(`>&2`)
- [ ] JSON을 stdout으로 출력
- [ ] 스크립트에 정리 trap 포함

---

## 주의사항

### 문제 1: 스킬이 활성화되지 않음

**증상**: "Deploy my app"이라고 말했지만 Claude가 스킬을 활성화하지 않음.

**원인**: `description`에 트리거 키워드가 포함되지 않음.

**해결**:
```markdown
# ❌ 잘못됨
description: A tool for deploying applications

# ✅ 올바름
description: Deploy my app to production. Use when user says "deploy", "production", or "push to live".
```

### 문제 2: 스크립트 출력이 혼란스러움

**증상**: Claude가 JSON 출력을 파싱할 수 없음.

**원인**: 상태 메시지와 JSON 출력이 섞여 있음.

**해결**:
```bash
# ❌ 잘못됨: 모두 stdout으로 출력
echo "Creating tarball..."
echo '{"previewUrl": "..."}'

# ✅ 올바름: 상태 메시지는 stderr 사용
echo "Creating tarball..." >&2
echo '{"previewUrl": "..."}'
```

### 문제 3: 임시 파일이 정리되지 않음

**증상**: 디스크 공간이 점차 차감됨.

**원인**: 스크립트 종료 시 임시 파일을 정리하지 않음.

**해결**:
```bash
# ✅ 올바름: cleanup trap 사용
cleanup() {
  rm -f "$TEMP_TARBALL" >&2 || true
}
trap cleanup EXIT
```

### 문제 4: SKILL.md가 너무 긺

**증상**: 스킬이 너무 많은 컨텍스트를 차지하여 성능에 영향을 미침.

**원인**: `SKILL.md`가 500줄을 초과함.

**해결**:
- 상세 참조 문서를 별도 파일에 배치
- 점진적 공개(Progressive Disclosure) 사용
- 인라인 코드보다 스크립트 우선 사용

---

## 이 수업 요약

**핵심 요점**:

1. **디렉토리 구조**: kebab-case 사용, `SKILL.md` 및 `scripts/` 디렉토리 포함
2. **SKILL.md 형식**: Front Matter + How It Works + Usage + Output + Present Results to User + Troubleshooting
3. **스크립트 규격**: `#!/bin/bash`, `set -e`, stderr로 상태 출력, stdout으로 JSON 출력, 정리 trap
4. **컨텍스트 효율성**: `SKILL.md`를 < 500줄로 유지, 점진적 공개 사용, 스크립트 우선
5. **패키징 및 배포**: `zip -r` 명령어로 `{skill-name}.zip`로 패키징

**모범 사례 구호**:

> 설명은 구체적으로, 트리거는 명확하게
> 상태는 stderr로, JSON은 stdout으로
> trap 추가 기억, 임시 파일 정리
> 파일은 너무 길지 않게, 스크립트가 공간 차지

---

## 다음 수업 예고

> 다음 수업에서 **[React 모범 사례 규칙 작성](../rule-authoring/)**을 배웁니다.
>
> 학습할 내용:
> - 규격에 맞는 규칙 파일 작성 방법
> - `_template.md` 템플릿을 사용하여 규칙 생성
> - impact 레벨 및 tags 정의
> - Incorrect/Correct 코드 예시 비교 작성
> - 참고 문헌 추가 및 규칙 검증

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능               | 파일 경로                                                                                       | 행번호   |
|--- | --- | ---|
| 스킬 개발 규격       | [`AGENTS.md:9-69`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L9-L69)     | 9-69   |
| 디렉토리 구조 정의       | [`AGENTS.md:11-20`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20)   | 11-20  |
| 명명 규칙           | [`AGENTS.md:22-27`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L22-L27)   | 22-27  |
| SKILL.md 형식      | [`AGENTS.md:29-68`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68)   | 29-68  |
| 컨텍스트 효율성 모범 사례 | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78)   | 70-78  |
| 스크립트 요구사항           | [`AGENTS.md:80-87`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L80-L87)   | 80-87  |
| Zip 패키징           | [`AGENTS.md:89-96`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L89-L96)   | 89-96  |
| 사용자 설치 방법       | [`AGENTS.md:98-110`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L110) | 98-110 |

**핵심 상수**:
- `SKILL.md` 파일명: 전체 대문자, 정확히 일치해야 함
- `/mnt/skills/user/{skill-name}/scripts/{script}.sh`: 스크립트 경로 형식

**핵심 함수**:
- 스크립트 정리 함수 `cleanup()`: 임시 파일 삭제용
- 프레임워크 감지 함수 `detect_framework()`: package.json에서 프레임워크 유형 유추

</details>
