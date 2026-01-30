---
title: "자주 묻는 질문과 문제 해결: 다양한 문제를 빠르게 해결하기 | AI App Factory 튜토리얼"
sidebarTitle: "문제가 발생하면"
subtitle: "자주 묻는 질문과 문제 해결"
description: "AI App Factory 사용 중 발생하는 일반적인 문제를 빠르게 식별하고 해결하는 방법을 배웁니다. 이 튜토리얼은 초기화 디렉토리 문제, AI 어시스턴트 시작 실패, 단계 실패 처리, 의존성 버전 충돌, 권한 초과 오류 등 다양한 문제의 원인 분석 및 해결 방법을 상세히 설명하여 효율적인 애플리케이션 개발을 도와드립니다."
tags:
- "문제 해결"
- "FAQ"
- "디버깅"
prerequisite:
- "../../start/installation/"
- "../../start/init-project/"
order: 190
---

# 자주 묻는 질문과 문제 해결

## 학습 완료 후 할 수 있는 것

- 초기화 시 발생하는 디렉토리 문제를 빠르게 식별하고 해결하기
- AI 어시스턴트 시작 실패 원인 파악하기
- 단계 실패 처리 프로세스 이해하기 (재시도/롤백/수동 개입)
- 의존성 설치 및 버전 충돌 문제 해결하기
- Agent 권한 초과 오류 처리하기
- `factory continue`를 사용하여 세션 분리 후 실행 복구하기

## 현재 겪고 있는 어려움

다음과 같은 문제들을 겪고 있을 수 있습니다:

- ❌ `factory init` 실행 시 "디렉토리가 비어있지 않음" 오류
- ❌ AI 어시스턴트가 시작되지 않고 권한 설정 방법을 모름
- ❌ 파이프라인이 특정 단계에서 갑자기 실패하고 계속 진행 방법을 모름
- ❌ 의존성 설치 오류, 심각한 버전 충돌
- ❌ Agent 생성 결과물이 "권한 초과"로 표시됨
- ❌ 체크포인트 및 재시도 메커니즘을 이해하지 못함

걱정하지 마세요, 이러한 문제들에는 명확한 해결책이 있습니다. 이 튜토리얼은 다양한 문제를 빠르게 파악하고 수정하는 데 도움을 드립니다.

---

## 🎒 시작 전 준비사항

::: warning 선행 지식

시작하기 전에 다음을 완료했는지 확인하세요:

- [ ] [설치 및 구성](../../start/installation/) 완료
- [ ] [Factory 프로젝트 초기화](../../start/init-project/) 완료
- [ ] [7단계 파이프라인 개요](../../start/pipeline-overview/) 이해
- [ ] [Claude Code 통합](../../platforms/claude-code/) 사용 방법 알기

:::

## 핵심 개념

AI App Factory의 문제 처리는 엄격한 전략을 따르며, 이 메커니즘을 이해하면 문제 발생 시 당황하지 않을 수 있습니다.

### 실패 처리의 세 가지 계층

1. **자동 재시도**: 각 단계는 한 번 재시도할 수 있습니다
2. **롤백 보관**: 실패한 결과물은 `_failed/`로 이동하고, 이전 성공 체크포인트로 롤백됩니다
3. **수동 개입**: 연속 두 번 실패 후 일시 중지되며, 수동으로 수정해야 합니다

### 권한 초과 처리 규칙

- Agent가 승인되지 않은 디렉토리에 쓰기 → `_untrusted/`로 이동
- 파이프라인 일시 중지, 검토 대기
- 필요에 따라 권한 조정 또는 Agent 동작 수정

### 권한 경계

각 Agent는 엄격한 읽기/쓰기 권한 범위를 가집니다:

| Agent | 읽기 가능 | 쓰기 가능 |
| ----- | --------- | --------- |
| bootstrap | 없음 | `input/` |
| prd | `input/` | `artifacts/prd/` |
| ui | `artifacts/prd/` | `artifacts/ui/` |
| tech | `artifacts/prd/` | `artifacts/tech/`, `artifacts/backend/prisma/` |
| code | `artifacts/ui/`, `artifacts/tech/`, `artifacts/backend/prisma/` | `artifacts/backend/`, `artifacts/client/` |
| validation | `artifacts/backend/`, `artifacts/client/` | `artifacts/validation/` |
| preview | `artifacts/backend/`, `artifacts/client/` | `artifacts/preview/` |

---

## 초기화 문제

### 문제 1: 디렉토리 비어있지 않음 오류

**증상**:

```bash
$ factory init
Error: Directory is not empty or contains conflicting files
```

**원인**: 현재 디렉토리에 충돌 파일이 포함되어 있습니다 (`.git`, `README.md` 등 허용된 파일이 아님).

**해결 방법**:

1. **디렉토리 내용 확인**:

```bash
ls -la
```

2. **충돌 파일 정리**:

```bash
# 방법 1: 충돌 파일 삭제
rm -rf <conflicting-files>

# 방법 2: 새 디렉토리로 이동
mkdir ../my-app && mv . ../my-app/
cd ../my-app
```

3. **다시 초기화**:

```bash
factory init
```

**허용된 파일**: `.git`, `.gitignore`, `README.md`, `.vscode/*`, `.idea/*`

### 문제 2: Factory 프로젝트가 이미 존재함

**증상**:

```bash
$ factory init
Error: This is already a Factory project
```

**원인**: 디렉토리에 이미 `.factory/` 또는 `artifacts/` 디렉토리가 포함되어 있습니다.

**해결 방법**:

- 새 프로젝트인 경우, 먼저 정리 후 초기화:

```bash
rm -rf .factory artifacts
factory init
```

- 이전 프로젝트를 복구하려면, `factory run`을 직접 실행하세요

### 문제 3: AI 어시스턴트 시작 실패

**증상**:

```bash
$ factory init
✓ Factory project initialized
Could not find Claude Code installation.
```

**원인**: Claude Code가 설치되지 않았거나 올바르게 구성되지 않았습니다.

**해결 방법**:

1. **Claude Code 설치**:

```bash
# macOS
brew install claude

# Linux (공식 웹사이트에서 다운로드)
# https://claude.ai/code
```

2. **설치 확인**:

```bash
claude --version
```

3. **수동 시작**:

```bash
# Factory 프로젝트 디렉토리에서
claude "factory/pipeline.yaml과 .factory/agents/orchestrator.checkpoint.md를 읽고 파이프라인을 시작해주세요"
```

**수동 시작 프로세스**: 1. `pipeline.yaml` 읽기 → 2. `orchestrator.checkpoint.md` 읽기 → 3. AI 실행 대기

---

## 파이프라인 실행 문제

### 문제 4: 프로젝트 디렉토리가 아님 오류

**증상**:

```bash
$ factory run
Error: Not a Factory project. Run 'factory init' first.
```

**원인**: 현재 디렉토리가 Factory 프로젝트가 아닙니다 (`.factory/` 디렉토리가 없음).

**해결 방법**:

1. **프로젝트 구조 확인**:

```bash
ls -la .factory/
```

2. **올바른 디렉토리로 전환** 또는 **다시 초기화**:

```bash
# 프로젝트 디렉토리로 전환
cd /path/to/project

# 또는 다시 초기화
factory init
```

### 문제 5: Pipeline 파일을 찾을 수 없음

**증상**:

```bash
$ factory run
Error: Pipeline configuration not found
```

**원인**: `pipeline.yaml` 파일이 없거나 경로가 잘못되었습니다.

**해결 방법**:

1. **파일 존재 여부 확인**:

```bash
ls -la .factory/pipeline.yaml
ls -la pipeline.yaml
```

2. **수동 복사** (파일이 손실된 경우):

```bash
cp /path/to/factory/source/hyz1992/agent-app-factory/pipeline.yaml .factory/
```

3. **다시 초기화** (가장 안정적):

```bash
rm -rf .factory
factory init
```

---

## 단계 실패 처리

### 문제 6: Bootstrap 단계 실패

**증상**:

- `input/idea.md`가 존재하지 않음
- `idea.md`에 핵심 섹션 누락 (목표 사용자, 핵심 가치, 가정)

**원인**: 사용자 입력 정보가 부족하거나 Agent가 파일을 올바르게 쓰지 못했습니다.

**처리 프로세스**:

```
1. input/ 디렉토리 존재 여부 확인 → 없으면 생성
2. 올바른 템플릿을 사용하도록 Agent에 재시도 요청
3. 여전히 실패하면 더 자세한 제품 설명 제공 요청
```

**수동 수정**:

1. **결과물 디렉토리 확인**:

```bash
ls -la artifacts/_failed/bootstrap/
```

2. **input/ 디렉토리 생성**:

```bash
mkdir -p input
```

3. **자세한 제품 설명 제공**:

AI에게 더 명확하고 자세한 제품 아이디어를 제공하세요:
- 목표 사용자는 누구인가 (구체적인 페르소나)
- 핵심 고통 포인트는 무엇인가
- 어떤 문제를 해결하고 싶은가
- 초기 기능 아이디어

### 문제 7: PRD 단계 실패

**증상**:

- PRD에 기술 세부사항 포함 (책임 경계 위반)
- Must Have 기능 > 7개 (범위 확장)
- 비목표 누락 (경계 미명확)

**원인**: Agent가 경계를 넘었거나 범위 제어가 미흡합니다.

**처리 프로세스**:

```
1. prd.md에 기술 키워드가 포함되지 않았는지 검증
2. Must Have 기능 수량 ≤ 7 검증
3. 목표 사용자에 구체적인 페르소나가 있는지 검증
4. 재시도 시 구체적인 수정 요구사항 제공
```

**일반적인 오류 예시**:

| 오류 유형 | 잘못된 예시 | 올바른 예시 |
| --------- | ----------- | ----------- |
| 기술 세부사항 포함 | "React Native로 구현" | "iOS 및 Android 플랫폼 지원" |
| 범위 확장 | "결제, 소셜, 메시지 등 10개 기능 포함" | "핵심 기능은 7개 이하" |
| 목표 모호 | "모든 사람이 사용 가능" | "25-35세 도시 직장인" |

**수동 수정**:

1. **실패한 PRD 확인**:

```bash
cat artifacts/_failed/prd/prd.md
```

2. **내용 수정**:

- 기술 스택 설명 삭제
- 기능 목록을 ≤ 7개로 간소화
- 비목표 목록 추가

3. **올바른 위치로 수동 이동**:

```bash
mv artifacts/_failed/prd/prd.md artifacts/prd/prd.md
```

### 문제 8: UI 단계 실패

**증상**:

- 페이지 수 > 8 (범위 확장)
- 미리보기 HTML 파일 손상
- AI 스타일 사용 (Inter 폰트 + 보라색 그라데이션)
- YAML 파싱 실패

**원인**: UI 범위가 너무 크거나 미학 가이드를 따르지 않았습니다.

**처리 프로세스**:

```
1. ui.schema.yaml의 페이지 수 통계
2. 브라우저에서 preview.web/index.html 열기 시도
3. YAML 구문 검증
4. 금지된 AI 스타일 요소 사용 여부 확인
```

**수동 수정**:

1. **YAML 구문 검증**:

```bash
npx js-yaml .factory/artifacts/ui/ui.schema.yaml
```

2. **브라우저에서 미리보기 열기**:

```bash
open artifacts/ui/preview.web/index.html # macOS
xdg-open artifacts/ui/preview.web/index.html # Linux
```

3. **페이지 수 간소화**: `ui.schema.yaml`을 확인하여 페이지 수 ≤ 8 보장

### 문제 9: Tech 단계 실패

**증상**:

- Prisma schema 구문 오류
- 마이크로서비스, 캐싱 등 과도한 설계 도입
- 데이터 모델 과다 (테이블 수 > 10)
- API 정의 누락

**원인**: 아키텍처 복잡화 또는 데이터베이스 설계 문제입니다.

**처리 프로세스**:

```
1. npx prisma validate 실행하여 schema 검증
2. tech.md에 필요한 섹션이 포함되었는지 확인
3. 데이터 모델 수량 통계
4. 불필요한 복잡 기술 도입 여부 확인
```

**수동 수정**:

1. **Prisma Schema 검증**:

```bash
cd artifacts/backend/
npx prisma validate
```

2. **아키텍처 간소화**: `artifacts/tech/tech.md`를 확인하여 불필요한 기술(마이크로서비스, 캐싱 등) 제거

3. **API 정의 보충**: `tech.md`에 모든 필수 API 엔드포인트가 포함되었는지 확인

### 문제 10: Code 단계 실패

**증상**:

- 의존성 설치 실패
- TypeScript 컴파일 오류
- 필수 파일 누락
- 테스트 실패
- API 시작 불가

**원인**: 의존성 버전 충돌, 타입 문제 또는 코드 로직 오류입니다.

**처리 프로세스**:

```
1. npm install --dry-run 실행하여 의존성 확인
2. npx tsc --noEmit 실행하여 타입 확인
3. 파일 목록 대조하여 디렉토리 구조 확인
4. npm test 실행하여 테스트 검증
5. 위 모두 통과 시 서비스 시작 시도
```

**일반적인 의존성 문제 수정**:

```bash
# 버전 충돌
rm -rf node_modules package-lock.json
npm install

# Prisma 버전 불일치
npm install @prisma/client@latest prisma@latest

# React Native 의존성 문제
npx expo install --fix
```

**TypeScript 오류 처리**:

```bash
# 타입 오류 확인
npx tsc --noEmit

# 수정 후 재검증
npx tsc --noEmit
```

**디렉토리 구조 확인**:

다음 필수 파일/디렉토리가 포함되어 있는지 확인:

```
artifacts/backend/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── index.ts
│   ├── lib/
│   └── routes/
└── vitest.config.ts

artifacts/client/
├── package.json
├── tsconfig.json
├── app.json
└── src/
```

### 문제 11: Validation 단계 실패

**증상**:

- 검증 보고서 불완전
- 심각한 문제 과다 (오류 수 > 10)
- 보안 문제 (하드코딩된 키 감지)

**원인**: Code 단계 품질이 낮거나 보안 문제가 있습니다.

**처리 프로세스**:

```
1. report.md 파싱하여 모든 섹션 존재 확인
2. 심각한 문제 수량 통계
3. 심각한 문제 > 10개면 Code 단계로 롤백 권장
4. 보안 스캔 결과 확인
```

**수동 수정**:

1. **검증 보고서 확인**:

```bash
cat artifacts/validation/report.md
```

2. **심각한 문제 수정**: 보고서에 따라 항목별로 수정

3. **Code 단계로 롤백** (문제가 너무 많은 경우):

```bash
factory run code # Code 단계부터 다시 시작
```

### 문제 12: Preview 단계 실패

**증상**:

- README 불완전 (설치 단계 누락)
- Docker 빌드 실패
- 배포 구성 누락

**원인**: 내용 누락 또는 구성 문제입니다.

**처리 프로세스**:

```
1. README.md에 모든 필요한 섹션이 포함되었는지 확인
2. docker build 시도하여 Dockerfile 검증
3. 배포 구성 파일 존재 여부 확인
```

**수동 수정**:

1. **Docker 구성 검증**:

```bash
cd artifacts/preview/
docker build -t my-app .
```

2. **배포 파일 확인**:

다음 파일이 존재하는지 확인:

```
artifacts/preview/
├── README.md
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml # CI/CD 구성
```

---

## 권한 초과 오류 처리

### 문제 13: Agent 권한 초과 쓰기

**증상**:

```bash
Error: Unauthorized write to <path>
Artifacts moved to: artifacts/_untrusted/<stage-id>/
Pipeline paused. Manual intervention required.
```

**원인**: Agent가 승인되지 않은 디렉토리 또는 파일에 콘텐츠를 썼습니다.

**해결 방법**:

1. **권한 초과 파일 확인**:

```bash
ls -la artifacts/_untrusted/<stage-id>/
```

2. **권한 매트릭스 검토**: 해당 Agent의 쓰기 가능 범위 확인

3. **처리 방법 선택**:

- **방안 A: Agent 동작 수정** (권장)

AI 어시스턴트에서 권한 초과 문제를 명확히 지적하고 수정을 요청하세요.

- **방안 B: 파일을 올바른 위치로 이동** (신중히)

파일이 존재해야 한다고 확신하는 경우, 수동으로 이동:

```bash
mv artifacts/_untrusted/<stage-id>/<file> artifacts/<target-stage>/
```

- **방안 C: 권한 매트릭스 조정** (고급)

`.factory/policies/capability.matrix.md`를 수정하여 해당 Agent의 쓰기 권한을 추가합니다.

4. **계속 실행**:

```bash
factory continue
```

**예시 시나리오**:

- Code Agent가 `artifacts/prd/prd.md`를 수정하려 함 (책임 경계 위반)
- UI Agent가 `artifacts/backend/` 디렉토리를 생성하려 함 (권한 범위 초과)
- Tech Agent가 `artifacts/ui/` 디렉토리에 쓰려 함 (경계 초과)

---

## 세션 분리 실행 문제

### 문제 14: Token 부족 또는 컨텍스트 누적

**증상**:

- AI 응답이 느려짐
- 컨텍스트가 너무 길어 모델 성능 저하
- Token 소비 과다

**원인**: 동일 세션에 너무 많은 대화 기록이 누적되었습니다.

**해결 방법: `factory continue` 사용**

`factory continue` 명령을 사용하면:

1. **현재 상태를 `.factory/state.json`에 저장**
2. **새 Claude Code 창 시작**
3. **현재 단계부터 계속 실행**

**실행 단계**:

1. **현재 상태 확인**:

```bash
factory status
```

출력 예시:

```bash
Pipeline Status:
───────────────────────────────────────
Project: my-app
Status: Waiting
Current Stage: tech
Completed: bootstrap, prd, ui
```

2. **새 세션에서 계속**:

```bash
factory continue
```

**효과**:

- 각 단계가 깨끗한 컨텍스트를 독점
- Token 누적 방지
- 중단 복구 지원

**수동으로 새 세션 시작** (`factory continue`가 실패한 경우):

```bash
# 권한 구성 재생성
claude ".claude/settings.local.json을 다시 생성해주세요. Read/Write/Glob/Bash 작업을 허용해주세요"

# 수동으로 새 세션 시작
claude "파이프라인을 계속 실행해주세요. 현재 단계는 tech입니다"
```

---

## 환경 및 권한 문제

### 문제 15: Node.js 버전이 너무 낮음

**증상**:

```bash
Error: Node.js version must be >= 16.0.0
```

**원인**: Node.js 버전이 요구사항을 충족하지 않습니다.

**해결 방법**:

1. **버전 확인**:

```bash
node --version
```

2. **Node.js 업그레이드**:

```bash
# macOS
brew install node@18
brew link --overwrite node@18

# Linux (nvm 사용)
nvm install 18
nvm use 18

# Windows (공식 웹사이트에서 다운로드)
# https://nodejs.org/
```

### 문제 16: Claude Code 권한 문제

**증상**:

- AI가 "읽기/쓰기 권한이 없음" 표시
- AI가 `.factory/` 디렉토리에 접근할 수 없음

**원인**: `.claude/settings.local.json` 권한 구성이 올바르지 않습니다.

**해결 방법**:

1. **권한 파일 확인**:

```bash
cat .claude/settings.local.json
```

2. **권한 재생성**:

```bash
factory continue # 자동으로 재생성
```

또는 수동으로 실행:

```bash
node -e "
const { generateClaudeSettings } = require('./cli/utils/claude-settings');
generateClaudeSettings(process.cwd());
"
```

3. **올바른 권한 구성 예시**:

```json
{
  "allowedCommands": ["npm", "npx", "node", "git"],
  "allowedPaths": [
    "/absolute/path/to/project/.factory",
    "/absolute/path/to/project/artifacts",
    "/absolute/path/to/project/input",
    "/absolute/path/to/project/node_modules"
  ]
}
```

### 문제 17: 네트워크 문제로 인한 의존성 설치 실패

**증상**:

```bash
Error: Network request failed
npm ERR! code ECONNREFUSED
```

**원인**: 네트워크 연결 문제 또는 npm 소스 접근 실패입니다.

**해결 방법**:

1. **네트워크 연결 확인**:

```bash
ping registry.npmjs.org
```

2. **npm 소스 전환**:

```bash
# Taobao 미러 사용
npm config set registry https://registry.npmmirror.com

# 검증
npm config get registry
```

3. **의존성 재설치**:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 수동 개입 결정 트리

```
단계 실패
│
▼
첫 번째 실패인가?
├─ 예 → 자동 재시도
│   │
│   ▼
│   재시도 성공? → 예 → 프로세스 계속
│   │
│   아니오 → 두 번째 실패
│
└─ 아니오 → 실패 원인 분석
    │
    ▼
    입력 문제인가?
    ├─ 예 → 입력 파일 수정
    │   └─ 상위 단계로 롤백
    │
    └─ 아니오 → 수동 개입 요청
```

**결정 포인트**:

- **첫 번째 실패**: 자동 재시도를 허용하고 오류가 사라지는지 관찰
- **두 번째 실패**: 자동 처리를 중지하고 수동으로 검토 필요
- **입력 문제**: `input/idea.md` 또는 상위 결과물 수정
- **기술 문제**: 의존성, 구성 또는 코드 로직 확인
- **권한 문제**: 권한 매트릭스 또는 Agent 동작 검토

---

## 함정 경고

### ❌ 일반적인 실수

1. **상위 결과물 직접 수정**

잘못된 방법: PRD 단계에서 `input/idea.md` 수정

올바른 방법: Bootstrap 단계로 롤백

2. **체크포인트 확인 무시**

잘못된 방법: 모든 체크포인트를 빠르게 건너뛰기

올바른 방법: 각 단계의 결과물이 예상대로인지 신중히 확인

3. **실패한 결과물 수동 삭제**

잘못된 방법: `_failed/` 디렉토리 삭제

올바른 방법: 실패한 결과물을 비교 분석용으로 보관

4. **수정 후 권한 재생성 안 함**

잘못된 방법: 프로젝트 구조 수정 후 `.claude/settings.local.json` 업데이트 안 함

올바른 방법: `factory continue` 실행하여 권한 자동 업데이트

### ✅ 모범 사례

1. **조기 실패**: 문제를 가능한 빨리 발견하여 후속 단계에서 시간 낭비 방지

2. **상세 로그**: 완전한 오류 로그를 보관하여 문제 파악에 도움

3. **원자적 작업**: 각 단계의 출력은 원자적이어야 롤백이 용이

4. **증거 보관**: 재시도 전 실패 결과물을 보관하여 비교 분석 가능

5. **점진적 재시도**: 재시도 시 단순 반복 대신 더 구체적인 지침 제공

---

## 본 강의 요약

본 강의는 AI App Factory 사용 과정의 다양한 일반적인 문제를 다룹니다:

| 카테고리 | 문제 수 | 핵심 해결 방법 |
| -------- | ------- | -------------- |
| 초기화 | 3 | 디렉토리 정리, AI 어시스턴트 설치, 수동 시작 |
| 파이프라인 실행 | 2 | 프로젝트 구조 확인, 구성 파일 확인 |
| 단계 실패 | 7 | 재시도, 롤백, 수정 후 재실행 |
| 권한 처리 | 1 | 권한 매트릭스 검토, 파일 이동 또는 권한 조정 |
| 세션 분리 실행 | 1 | `factory continue`를 사용하여 새 세션 시작 |
| 환경 권한 | 3 | Node.js 업그레이드, 권한 재생성, npm 소스 전환 |

**핵심 요점**:

- 각 단계는 **자동 재시도 한 번** 허용
- 연속 두 번 실패 후 **수동 개입** 필요
- 실패 결과물은 자동으로 `_failed/`에 보관
- 권한 초과 파일은 `_untrusted/`로 이동
- `factory continue`로 Token 절약

**기억하세요**:

문제가 발생해도 당황하지 마세요. 먼저 오류 로그를 확인하고, 해당 결과물 디렉토리를 확인한 후, 본 강의의 해결 방법을 참조하여 단계적으로 파악하세요. 대부분의 문제는 재시도, 롤백 또는 입력 파일 수정으로 해결할 수 있습니다.

## 다음 강의 예고

> 다음 강의에서는 **[모범 사례](../best-practices/)**를 학습합니다.
>
> 배울 내용:
> - 명확한 제품 설명 제공 방법
> - 체크포인트 메커니즘 활용 방법
> - 프로젝트 범위 제어 방법
> - 점진적 반복 최적화 방법

**관련 읽기**:

- [실패 처리 및 롤백](../../advanced/failure-handling/) - 실패 처리 전략 심층 이해
- [권한 및 보안 메커니즘](../../advanced/security-permissions/) - 능력 경계 매트릭스 이해
- [컨텍스트 최적화](../../advanced/context-optimization/) - Token 절약 팁

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-29

| 기능 | 파일 경로 | 라인 번호 |
| ---- | --------- | --------- |
| 초기화 디렉토리 확인 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 32-53 |
| AI 어시스턴트 시작 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| 실패 전략 정의 | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-276 |
| 오류 코드 규격 | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |
| 능력 경계 매트릭스 | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-23 |
| 파이프라인 구성 | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 전체 |
| 오케스트레이터 핵심 | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Continue 명령 | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |

**핵심 상수**:
- 허용된 Must Have 기능 수량: ≤ 7
- 허용된 UI 페이지 수량: ≤ 8
- 허용된 데이터 모델 수량: ≤ 10
- 재시도 횟수: 각 단계당 한 번 허용

**핵심 함수**:
- `isFactoryProject(dir)` - Factory 프로젝트 여부 확인
- `isDirectorySafeToInit(dir)` - 초기화 가능 디렉토리 여부 확인
- `generateClaudeSettings(projectDir)` - Claude Code 권한 구성 생성
- `factory continue` - 새 세션에서 파이프라인 계속 실행

</details>
