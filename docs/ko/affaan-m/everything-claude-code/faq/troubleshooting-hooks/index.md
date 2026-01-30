---
title: "문제 해결: Hooks 문제 | everything-claude-code"
sidebarTitle: "Hooks 문제 5분 해결"
subtitle: "문제 해결: Hooks 문제 | everything-claude-code"
description: "Hooks 문제 해결 방법을 배웁니다. 환경 변수, 권한, JSON 구문 등의 문제를 체계적으로 진단하여 SessionStart/End, PreToolUse가 정상적으로 작동하도록 합니다."
tags:
  - "hooks"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "advanced-hooks-automation"
order: 150
---

# Hooks가 작동하지 않을 때

## 겪고 있는 문제

Hooks를 설정했는데 예상대로 작동하지 않나요? 다음과 같은 상황을 겪고 있을 수 있습니다:

- Dev server가 tmux 외부에서 실행되는 것이 차단되지 않음
- SessionStart 또는 SessionEnd 로그가 보이지 않음
- Prettier 자동 포맷이 적용되지 않음
- TypeScript 검사가 실행되지 않음
- 이상한 오류 메시지가 표시됨

걱정하지 마세요. 이러한 문제들은 대부분 명확한 해결 방법이 있습니다. 이 강의에서는 Hooks 관련 문제를 체계적으로 진단하고 해결하는 방법을 알려드립니다.

## 🎒 시작하기 전에

::: warning 사전 확인
다음 사항을 완료했는지 확인하세요:
1. ✅ Everything Claude Code [설치](../../start/installation/) 완료
2. ✅ [Hooks 자동화](../../advanced/hooks-automation/) 기본 개념 이해
3. ✅ 프로젝트 README의 Hooks 설정 설명 읽기
:::

---

## 일반적인 문제 1: Hooks가 전혀 트리거되지 않음

### 증상
명령 실행 후 `[Hook]` 로그 출력이 전혀 보이지 않고, Hooks가 완전히 호출되지 않는 것처럼 보입니다.

### 가능한 원인

#### 원인 A: hooks.json 경로 오류

**문제**: `hooks.json`이 올바른 위치에 없어서 Claude Code가 설정 파일을 찾지 못합니다.

**해결 방법**:

`hooks.json`의 위치가 올바른지 확인하세요:

```bash
# 다음 위치 중 하나에 있어야 합니다:
~/.claude/hooks/hooks.json              # 사용자 수준 설정 (전역)
.claude/hooks/hooks.json                 # 프로젝트 수준 설정
```

**확인 방법**:

```bash
# 사용자 수준 설정 확인
ls -la ~/.claude/hooks/hooks.json

# 프로젝트 수준 설정 확인
ls -la .claude/hooks/hooks.json
```

**파일이 존재하지 않는 경우**, Everything Claude Code 플러그인 디렉토리에서 복사하세요:

```bash
# 플러그인이 ~/.claude-plugins/에 설치되어 있다고 가정
cp ~/.claude-plugins/everything-claude-code/hooks/hooks.json ~/.claude/hooks/
```

#### 원인 B: JSON 구문 오류

**문제**: `hooks.json`에 구문 오류가 있어서 Claude Code가 파싱할 수 없습니다.

**해결 방법**:

JSON 형식을 검증하세요:

```bash
# jq 또는 Python으로 JSON 구문 검증
jq empty ~/.claude/hooks/hooks.json
# 또는
python3 -m json.tool ~/.claude/hooks/hooks.json > /dev/null
```

**일반적인 구문 오류**:
- 쉼표 누락
- 따옴표 미닫힘
- 작은따옴표 사용 (반드시 큰따옴표 사용)
- 주석 형식 오류 (JSON은 `//` 주석을 지원하지 않음)

#### 원인 C: 환경 변수 CLAUDE_PLUGIN_ROOT 미설정

**문제**: Hook 스크립트가 `${CLAUDE_PLUGIN_ROOT}`로 경로를 참조하지만 환경 변수가 설정되지 않았습니다.

**해결 방법**:

플러그인 설치 경로가 올바른지 확인하세요:

```bash
# 설치된 플러그인 경로 확인
ls -la ~/.claude-plugins/
```

Everything Claude Code 플러그인이 올바르게 설치되었는지 확인하세요:

```bash
# 다음과 같은 디렉토리 구조가 보여야 합니다
~/.claude-plugins/everything-claude-code/
├── scripts/
├── hooks/
├── agents/
└── ...
```

**플러그인 마켓플레이스에서 설치한 경우**, Claude Code를 재시작하면 환경 변수가 자동으로 설정됩니다.

**수동 설치한 경우**, `~/.claude/settings.json`에서 플러그인 경로를 확인하세요:

```json
{
  "plugins": [
    {
      "name": "everything-claude-code",
      "path": "/path/to/everything-claude-code"
    }
  ]
}
```

---

## 일반적인 문제 2: 특정 Hook만 트리거되지 않음

### 증상
일부 Hooks는 작동하지만(예: SessionStart), 다른 Hooks는 트리거되지 않습니다(예: PreToolUse의 포맷팅).

### 가능한 원인

#### 원인 A: Matcher 표현식 오류

**문제**: Hook의 `matcher` 표현식에 오류가 있어서 매칭 조건이 충족되지 않습니다.

**해결 방법**:

`hooks.json`의 matcher 구문을 확인하세요:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\""
}
```

**주의사항**:
- 도구 이름은 큰따옴표로 감싸야 합니다: `"Edit"`, `"Bash"`
- 정규 표현식의 백슬래시는 이중 이스케이프가 필요합니다: `\\\\.`가 아닌 `\\.`
- 파일 경로 매칭에는 `matches` 키워드를 사용합니다

**Matcher 테스트**:

매칭 로직을 수동으로 테스트할 수 있습니다:

```bash
# 파일 경로 매칭 테스트
node -e "console.log(/\\\\.(ts|tsx)$/.test('src/index.ts'))"
# 출력: true
```

#### 원인 B: 명령 실행 실패

**문제**: Hook 명령 자체가 실패했지만 오류 메시지가 없습니다.

**해결 방법**:

Hook 명령을 수동으로 실행하여 테스트하세요:

```bash
# 플러그인 디렉토리로 이동
cd ~/.claude-plugins/everything-claude-code

# Hook 스크립트 수동 실행
node scripts/hooks/session-start.js

# 오류 출력 확인
```

**일반적인 실패 원인**:
- Node.js 버전 호환성 문제 (Node.js 14+ 필요)
- 의존성 누락 (prettier, typescript 미설치)
- 스크립트 권한 문제 (아래 참조)

---

## 일반적인 문제 3: 권한 문제 (Linux/macOS)

### 증상
다음과 같은 오류가 표시됩니다:

```
Permission denied: node scripts/hooks/session-start.js
```

### 해결 방법

Hook 스크립트에 실행 권한을 추가하세요:

```bash
# 플러그인 디렉토리로 이동
cd ~/.claude-plugins/everything-claude-code

# 모든 hooks 스크립트에 실행 권한 추가
chmod +x scripts/hooks/*.js

# 권한 확인
ls -la scripts/hooks/
# 다음과 같이 보여야 합니다: -rwxr-xr-x  session-start.js
```

**모든 스크립트 일괄 수정**:

```bash
# scripts 하위의 모든 .js 파일 수정
find ~/.claude-plugins/everything-claude-code/scripts -name "*.js" -exec chmod +x {} \;
```

---

## 일반적인 문제 4: 크로스 플랫폼 호환성 문제

### 증상
Windows에서는 정상 작동하지만 macOS/Linux에서 실패하거나, 그 반대의 경우입니다.

### 가능한 원인

#### 원인 A: 경로 구분자

**문제**: Windows는 백슬래시 `\`를 사용하고, Unix는 슬래시 `/`를 사용합니다.

**해결 방법**:

Everything Claude Code의 스크립트는 이미 크로스 플랫폼 처리가 되어 있습니다(Node.js `path` 모듈 사용). 하지만 Hook을 직접 커스터마이징한 경우 주의가 필요합니다:

**잘못된 방법**:
```json
{
  "command": "node scripts/hooks\\session-start.js"  // Windows 스타일
}
```

**올바른 방법**:
```json
{
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\"  // 환경 변수와 슬래시 사용
}
```

#### 원인 B: Shell 명령 차이

**문제**: 플랫폼마다 명령 구문이 다릅니다(예: `which` vs `where`).

**해결 방법**:

Everything Claude Code의 `scripts/lib/utils.js`에서 이러한 차이를 처리합니다. Hook을 커스터마이징할 때 해당 파일의 크로스 플랫폼 함수를 참조하세요:

```javascript
// utils.js의 크로스 플랫폼 명령 감지
function commandExists(cmd) {
  if (isWindows) {
    spawnSync('where', [cmd], { stdio: 'pipe' });
  } else {
    spawnSync('which', [cmd], { stdio: 'pipe' });
  }
}
```

---

## 일반적인 문제 5: 자동 포맷팅이 작동하지 않음

### 증상
TypeScript 파일 편집 후 Prettier가 코드를 자동으로 포맷하지 않습니다.

### 가능한 원인

#### 원인 A: Prettier 미설치

**문제**: PostToolUse Hook이 `npx prettier`를 호출하지만 프로젝트에 설치되어 있지 않습니다.

**해결 방법**:

```bash
# Prettier 설치 (프로젝트 수준)
npm install --save-dev prettier
# 또는
pnpm add -D prettier

# 또는 전역 설치
npm install -g prettier
```

#### 원인 B: Prettier 설정 누락

**문제**: Prettier가 설정 파일을 찾지 못해 기본 포맷팅 규칙을 사용합니다.

**해결 방법**:

Prettier 설정 파일을 생성하세요:

```bash
# 프로젝트 루트 디렉토리에 .prettierrc 생성
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
```

#### 원인 C: 파일 유형 불일치

**문제**: 편집한 파일 확장자가 Hook의 매칭 규칙에 포함되어 있지 않습니다.

**현재 매칭 규칙** (`hooks.json` L92-97):

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**다른 파일 유형을 지원해야 하는 경우**(예: `.vue`), 설정을 수정하세요:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx|vue)$\""
}
```

---

## 일반적인 문제 6: TypeScript 검사가 작동하지 않음

### 증상
`.ts` 파일 편집 후 타입 검사 오류 출력이 보이지 않습니다.

### 가능한 원인

#### 원인 A: tsconfig.json 누락

**문제**: Hook 스크립트가 상위 디렉토리에서 `tsconfig.json` 파일을 찾지만 찾을 수 없습니다.

**해결 방법**:

프로젝트 루트 디렉토리 또는 상위 디렉토리에 `tsconfig.json`이 있는지 확인하세요:

```bash
# tsconfig.json 찾기
find . -name "tsconfig.json" -type f

# 존재하지 않는 경우 기본 설정 생성
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF
```

#### 원인 B: TypeScript 미설치

**문제**: Hook이 `npx tsc`를 호출하지만 TypeScript가 설치되어 있지 않습니다.

**해결 방법**:

```bash
npm install --save-dev typescript
# 또는
pnpm add -D typescript
```

---

## 일반적인 문제 7: SessionStart/SessionEnd가 트리거되지 않음

### 증상
세션 시작 또는 종료 시 `[SessionStart]` 또는 `[SessionEnd]` 로그가 보이지 않습니다.

### 가능한 원인

#### 원인 A: 세션 파일 디렉토리 미존재

**문제**: `~/.claude/sessions/` 디렉토리가 존재하지 않아 Hook 스크립트가 세션 파일을 생성할 수 없습니다.

**해결 방법**:

디렉토리를 수동으로 생성하세요:

```bash
# macOS/Linux
mkdir -p ~/.claude/sessions

# Windows PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\sessions"
```

#### 원인 B: 스크립트 경로 오류

**문제**: `hooks.json`에서 참조하는 스크립트 경로가 올바르지 않습니다.

**확인 방법**:

```bash
# 스크립트 존재 여부 확인
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-start.js
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-end.js
```

**존재하지 않는 경우**, 플러그인이 완전히 설치되었는지 확인하세요:

```bash
# 플러그인 디렉토리 구조 확인
ls -la ~/.claude-plugins/everything-claude-code/
```

---

## 일반적인 문제 8: Dev Server 차단이 작동하지 않음

### 증상
`npm run dev`를 직접 실행해도 차단되지 않고 dev server를 시작할 수 있습니다.

### 가능한 원인

#### 원인 A: 정규 표현식 불일치

**문제**: dev server 명령이 Hook의 매칭 규칙에 포함되어 있지 않습니다.

**현재 매칭 규칙** (`hooks.json` L6):

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\""
}
```

**매칭 테스트**:

```bash
# 명령이 매칭되는지 테스트
node -e "console.log(/(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)/.test('npm run dev'))"
```

**다른 명령을 지원해야 하는 경우**(예: `npm start`), `hooks.json`을 수정하세요:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (run dev|start)|pnpm( run)? (dev|start)|yarn (dev|start)|bun run (dev|start))\""
}
```

#### 원인 B: tmux 외부에서 실행되었지만 차단되지 않음

**문제**: Hook이 tmux 외부에서 dev server 실행을 차단해야 하지만 작동하지 않습니다.

**확인 사항**:

1. Hook 명령이 성공적으로 실행되는지 확인:
```bash
# Hook 명령 시뮬레이션
node -e "console.error('[Hook] BLOCKED: Dev server must run in tmux');process.exit(1)"
# 오류 출력과 종료 코드 1이 표시되어야 합니다
```

2. `process.exit(1)`이 명령을 올바르게 차단하는지 확인:
- Hook 명령의 `process.exit(1)`이 후속 명령 실행을 차단해야 합니다

3. 여전히 작동하지 않는 경우, Claude Code 버전을 업그레이드해야 할 수 있습니다(Hooks 지원에 최신 버전이 필요할 수 있음)

---

## 진단 도구 및 팁

### 상세 로그 활성화

Claude Code의 상세 로그를 확인하여 Hook 실행 상황을 파악하세요:

```bash
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait -Tail 50
```

### Hook 수동 테스트

터미널에서 Hook 스크립트를 수동으로 실행하여 기능을 검증하세요:

```bash
# SessionStart 테스트
cd ~/.claude-plugins/everything-claude-code
node scripts/hooks/session-start.js

# Suggest Compact 테스트
node scripts/hooks/suggest-compact.js

# PreCompact 테스트
node scripts/hooks/pre-compact.js
```

### 환경 변수 확인

Claude Code의 환경 변수를 확인하세요:

```bash
# Hook 스크립트에 디버그 출력 추가
node -e "console.log('CLAUDE_PLUGIN_ROOT:', process.env.CLAUDE_PLUGIN_ROOT); console.log('COMPACT_THRESHOLD:', process.env.COMPACT_THRESHOLD)"
```

---

## 체크리스트 ✅

다음 목록을 하나씩 확인하세요:

- [ ] `hooks.json`이 올바른 위치에 있음 (`~/.claude/hooks/` 또는 `.claude/hooks/`)
- [ ] `hooks.json` JSON 형식이 올바름 (`jq`로 검증)
- [ ] 플러그인 경로가 올바름 (`${CLAUDE_PLUGIN_ROOT}` 설정됨)
- [ ] 모든 스크립트에 실행 권한이 있음 (Linux/macOS)
- [ ] 의존성 도구가 설치됨 (Node.js, Prettier, TypeScript)
- [ ] 세션 디렉토리가 존재함 (`~/.claude/sessions/`)
- [ ] Matcher 표현식이 올바름 (정규식 이스케이프, 따옴표 감싸기)
- [ ] 크로스 플랫폼 호환성 (`path` 모듈, 환경 변수 사용)

---

## 도움이 필요한 경우

위의 방법으로도 문제가 해결되지 않는 경우:

1. **진단 정보 수집**:
   ```bash
   # 다음 정보 출력
   echo "Node version: $(node -v)"
   echo "Claude Code version: $(claude-code --version)"
   echo "Plugin path: $(ls -la ~/.claude-plugins/everything-claude-code)"
   echo "Hooks config: $(cat ~/.claude/hooks/hooks.json | jq -c .)"
   ```

2. **GitHub Issues 확인**:
   - [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues) 방문
   - 유사한 문제 검색

3. **Issue 제출**:
   - 전체 오류 로그 포함
   - 운영 체제 및 버전 정보 제공
   - `hooks.json` 내용 첨부 (민감한 정보 숨김)

---

## 이 강의 요약

Hooks가 작동하지 않는 경우 일반적으로 다음과 같은 원인이 있습니다:

| 문제 유형 | 일반적인 원인 | 빠른 진단 |
| --- | --- | --- |
| **전혀 트리거되지 않음** | hooks.json 경로 오류, JSON 구문 오류 | 파일 위치 확인, JSON 형식 검증 |
| **특정 Hook만 트리거되지 않음** | Matcher 표현식 오류, 명령 실행 실패 | 정규식 구문 확인, 스크립트 수동 실행 |
| **권한 문제** | 스크립트 실행 권한 누락 (Linux/macOS) | `chmod +x scripts/hooks/*.js` |
| **크로스 플랫폼 호환성** | 경로 구분자, Shell 명령 차이 | `path` 모듈 사용, utils.js 참조 |
| **기능 미작동** | 의존성 도구 미설치 (Prettier, TypeScript) | 해당 도구 설치, 설정 파일 확인 |

기억하세요: 대부분의 문제는 파일 경로 확인, JSON 형식 검증, 의존성 설치 확인으로 해결할 수 있습니다.

---

## 다음 강의 예고

> 다음 강의에서는 **[MCP 연결 실패 문제 해결](../troubleshooting-mcp/)**을 배웁니다.
>
> 배우게 될 내용:
> - MCP 서버 설정의 일반적인 오류
> - MCP 연결 문제 디버깅 방법
> - MCP 환경 변수 및 플레이스홀더 설정

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-25

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| Hooks 메인 설정 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| 크로스 플랫폼 유틸리티 함수 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |

**주요 함수**:
- `getHomeDir()` / `getClaudeDir()` / `getSessionsDir()`: 설정 디렉토리 경로 가져오기 (utils.js 19-34)
- `ensureDir(dirPath)`: 디렉토리 존재 확인, 없으면 생성 (utils.js 54-59)
- `log(message)`: stderr로 로그 출력 (Claude Code에서 표시됨) (utils.js 182-184)
- `findFiles(dir, pattern, options)`: 크로스 플랫폼 파일 검색 (utils.js 102-149)
- `commandExists(cmd)`: 명령 존재 여부 확인 (크로스 플랫폼 호환) (utils.js 228-246)

**주요 정규 표현식**:
- Dev server 차단: `npm run dev|pnpm( run)? dev|yarn dev|bun run dev` (hooks.json 6)
- 파일 편집 매칭: `\\.(ts|tsx|js|jsx)$` (hooks.json 92)
- TypeScript 파일: `\\.(ts|tsx)$` (hooks.json 102)

**환경 변수**:
- `${CLAUDE_PLUGIN_ROOT}`: 플러그인 루트 디렉토리 경로
- `CLAUD_SESSION_ID`: 세션 식별자
- `COMPACT_THRESHOLD`: 압축 제안 임계값 (기본값 50)

</details>
