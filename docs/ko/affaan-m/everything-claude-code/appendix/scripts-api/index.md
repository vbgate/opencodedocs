---
title: "Scripts API: Node.js 스크립트 | Everything Claude Code"
sidebarTitle: "Hook 스크립트 작성하기"
subtitle: "Scripts API: Node.js 스크립트"
description: "Everything Claude Code의 Scripts API 인터페이스를 학습합니다. 플랫폼 감지, 파일 작업, 패키지 관리자 API 및 Hook 스크립트 사용법을 마스터합니다."
tags:
  - "scripts-api"
  - "api"
  - "nodejs"
  - "utils"
  - "package-manager"
  - "hooks"
prerequisite:
  - "start-package-manager-setup"
order: "215"
---

# Scripts API 레퍼런스: Node.js 스크립트 인터페이스

## 배울 수 있는 것

- Everything Claude Code의 스크립트 API 인터페이스를 완벽하게 이해
- 플랫폼 감지와 크로스 플랫폼 유틸리티 함수 사용
- 패키지 관리자 자동 감지 메커니즘 설정 및 사용
- 사용자 정의 Hook 스크립트로 자동화 기능 확장
- 기존 스크립트 구현 디버깅 및 수정

## 현재 직면한 문제

Everything Claude Code에 많은 자동화 스크립트가 있다는 것을 알고 있지만, 다음과 같은 문제에 직면해 있습니다:

- "이 Node.js 스크립트들은 구체적으로 어떤 API를 제공하나요?"
- "Hook 스크립트를 어떻게 커스터마이징하나요?"
- "패키지 관리자 감지의 우선순위는 무엇인가요?"
- "스크립트에서 크로스 플랫폼 호환성을 어떻게 구현하나요?"

이 튜토리얼은 완전한 Scripts API 레퍼런스 매뉴얼을 제공합니다.

## 핵심 개념

Everything Claude Code의 스크립트 시스템은 두 가지 유형으로 나뉩니다:

1. **공유 유틸리티 라이브러리** (`scripts/lib/`) - 크로스 플랫폼 함수 및 API 제공
2. **Hook 스크립트** (`scripts/hooks/`) - 특정 이벤트에서 트리거되는 자동화 로직

모든 스크립트는 **Windows, macOS 및 Linux** 세 가지 플랫폼을 지원하며, Node.js 네이티브 모듈로 구현됩니다.

### 스크립트 구조

```
scripts/
├── lib/
│   ├── utils.js              # 범용 유틸리티 함수
│   └── package-manager.js    # 패키지 관리자 감지
├── hooks/
│   ├── session-start.js       # SessionStart Hook
│   ├── session-end.js         # SessionEnd Hook
│   ├── pre-compact.js        # PreCompact Hook
│   ├── suggest-compact.js     # PreToolUse Hook
│   └── evaluate-session.js   # Stop Hook
└── setup-package-manager.js   # 패키지 관리자 설정 스크립트
```

## lib/utils.js - 범용 유틸리티 함수

이 모듈은 플랫폼 감지, 파일 작업, 시스템 명령어 등 크로스 플랫폼 유틸리티 함수를 제공합니다.

### 플랫폼 감지

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| 함수 | 타입 | 반환값 | 설명 |
|--- | --- | --- | ---|
| `isWindows` | boolean | `true/false` | 현재 Windows 플랫폼인지 여부 |
| `isMacOS` | boolean | `true/false` | 현재 macOS 플랫폼인지 여부 |
| `isLinux` | boolean | `true/false` | 현재 Linux 플랫폼인지 여부 |

**구현 원리**: `process.platform` 기반으로 판단

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### 디렉토리 유틸리티

```javascript
const {
  getHomeDir,
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  getTempDir,
  ensureDir
} = require('./lib/utils');
```

#### getHomeDir()

사용자 홈 디렉토리 가져오기 (크로스 플랫폼 호환)

**반환값**: `string` - 사용자 홈 디렉토리 경로

**예제**:
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

Claude Code 설정 디렉토리 가져오기

**반환값**: `string` - `~/.claude` 디렉토리 경로

**예제**:
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

세션 파일 디렉토리 가져오기

**반환값**: `string` - `~/.claude/sessions` 디렉토리 경로

**예제**:
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

학습한 스킬 디렉토리 가져오기

**반환값**: `string` - `~/.claude/skills/learned` 디렉토리 경로

**예제**:
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

시스템 임시 디렉토리 가져오기 (크로스 플랫폼)

**반환값**: `string` - 임시 디렉토리 경로

**예제**:
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

디렉토리 존재 확인, 없으면 생성

**매개변수**:
- `dirPath` (string) - 디렉토리 경로

**반환값**: `string` - 디렉토리 경로

**예제**:
```javascript
const dir = ensureDir('/path/to/new/dir');
// 디렉토리가 없으면 재귀적으로 생성
```

### 날짜 시간 유틸리티

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

현재 날짜 가져오기 (형식: YYYY-MM-DD)

**반환값**: `string` - 날짜 문자열

**예제**:
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

현재 시간 가져오기 (형식: HH:MM)

**반환값**: `string` - 시간 문자열

**예제**:
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

현재 날짜 시간 가져오기 (형식: YYYY-MM-DD HH:MM:SS)

**반환값**: `string` - 날짜 시간 문자열

**예제**:
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### 파일 작업

```javascript
const {
  findFiles,
  readFile,
  writeFile,
  appendFile,
  replaceInFile,
  countInFile,
  grepFile
} = require('./lib/utils');
```

#### findFiles(dir, pattern, options)

디렉토리에서 패턴과 일치하는 파일 찾기 (크로스 플랫폼 `find` 대안)

**매개변수**:
- `dir` (string) - 검색할 디렉토리
- `pattern` (string) - 파일 패턴 (예: `"*.tmp"`, `"*.md"`)
- `options` (object, 선택) - 옵션
  - `maxAge` (number) - 최대 파일 일수
  - `recursive` (boolean) - 재귀 검색 여부

**반환값**: `Array<{path: string, mtime: number}>` - 일치하는 파일 목록, 수정 시간 내림차순 정렬

**예제**:
```javascript
// 최근 7일 이내의 .tmp 파일 찾기
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// 재귀적으로 모든 .md 파일 찾기
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip 크로스 플랫폼 호환
이 함수는 크로스 플랫폼 파일 검색 기능을 제공하며, Unix `find` 명령에 의존하지 않아 Windows에서도 정상 작동합니다.
:::

#### readFile(filePath)

안전하게 텍스트 파일 읽기

**매개변수**:
- `filePath` (string) - 파일 경로

**반환값**: `string | null` - 파일 내용, 읽기 실패 시 `null`

**예제**:
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

텍스트 파일 쓰기

**매개변수**:
- `filePath` (string) - 파일 경로
- `content` (string) - 파일 내용

**반환값**: 없음

**예제**:
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// 디렉토리가 없으면 자동으로 생성
```

#### appendFile(filePath, content)

텍스트 파일에 내용 추가

**매개변수**:
- `filePath` (string) - 파일 경로
- `content` (string) - 추가할 내용

**반환값**: 없음

**예제**:
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

파일에서 텍스트 교체 (크로스 플랫폼 `sed` 대안)

**매개변수**:
- `filePath` (string) - 파일 경로
- `search` (string | RegExp) - 찾을 내용
- `replace` (string) - 교체 내용

**반환값**: `boolean` - 교체 성공 여부

**예제**:
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: 교체 성공
// false: 파일이 없거나 읽기 실패
```

#### countInFile(filePath, pattern)

파일에서 패턴 발생 횟수 통계

**매개변수**:
- `filePath` (string) - 파일 경로
- `pattern` (string | RegExp) - 통계낼 패턴

**반환값**: `number` - 일치 횟수

**예제**:
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

파일에서 패턴 검색하고 일치하는 줄과 줄 번호 반환

**매개변수**:
- `filePath` (string) - 파일 경로
- `pattern` (string | RegExp) - 검색할 패턴

**반환값**: `Array<{lineNumber: number, content: string}>` - 일치하는 줄 목록

**예제**:
```javascript
const matches = grepFile('/path/to/file.txt', /function\s+\w+/);
// [{ lineNumber: 10, content: 'function test() {...}' }]
```

### Hook I/O

```javascript
const {
  readStdinJson,
  log,
  output
} = require('./lib/utils');
```

#### readStdinJson()

표준 입력에서 JSON 데이터 읽기 (Hook 입력용)

**반환값**: `Promise<object>` - 파싱된 JSON 객체

**예제**:
```javascript
async function main() {
  const hookInput = await readStdinJson();
  console.log(hookInput.tool);
  console.log(hookInput.tool_input);
}
```

::: tip Hook 입력 형식
Claude Code가 Hook에 전달하는 입력 형식:
```json
{
  "tool": "Bash",
  "tool_input": { "command": "npm run dev" },
  "tool_output": { "output": "..." }
}
```
:::

#### log(message)

stderr에 로그 기록 (사용자에게 표시됨)

**매개변수**:
- `message` (string) - 로그 메시지

**반환값**: 없음

**예제**:
```javascript
log('[SessionStart] Loading context...');
// stderr에 출력, Claude Code에서 사용자에게 표시됨
```

#### output(data)

stdout에 데이터 출력 (Claude Code에 반환)

**매개변수**:
- `data` (object | string) - 출력할 데이터

**반환값**: 없음

**예제**:
```javascript
// 객체 출력 (자동 JSON 직렬화)
output({ success: true, message: 'Completed' });

// 문자열 출력
output('Hello, Claude');
```

### 시스템 명령어

```javascript
const {
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
} = require('./lib/utils');
```

#### commandExists(cmd)

PATH에 명령어가 존재하는지 확인

**매개변수**:
- `cmd` (string) - 명령어 이름

**반환값**: `boolean` - 명령어 존재 여부

**예제**:
```javascript
if (commandExists('pnpm')) {
  console.log('pnpm is available');
}
```

::: warning 보안 검증
이 함수는 명령어 이름에 대한 정규식 검증을 수행하여 문자, 숫자, 밑점, 점, 하이픈만 허용하여 명령어 주입을 방지합니다.
:::

#### runCommand(cmd, options)

명령어 실행하고 출력 반환

**매개변수**:
- `cmd` (string) - 실행할 명령어 (신뢰할 수 있고 하드코딩된 명령어여야 함)
- `options` (object, 선택) - `execSync` 옵션

**반환값**: `{success: boolean, output: string}` - 실행 결과

**예제**:
```javascript
const result = runCommand('git status');
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.output);
}
```

::: danger 보안 경고
**신뢰할 수 있고 하드코딩된 명령어에만 이 함수를 사용하세요.** 사용자 입력을 이 함수에 직접 전달하지 마세요. 사용자 입력의 경우 매개변수 배열이 있는 `spawnSync`를 사용하세요.
:::

#### isGitRepo()

현재 디렉토리가 Git 저장소인지 확인

**반환값**: `boolean` - Git 저장소 여부

**예제**:
```javascript
if (isGitRepo()) {
  console.log('This is a Git repository');
}
```

#### getGitModifiedFiles(patterns = [])

Git에서 수정된 파일 목록 가져오기

**매개변수**:
- `patterns` (string[], 선택) - 필터 패턴 배열

**반환값**: `string[]` - 수정된 파일 경로 목록

**예제**:
```javascript
// 모든 수정된 파일 가져오기
const allModified = getGitModifiedFiles();

// TypeScript 파일만 가져오기
const tsModified = getGitModifiedFiles([/\.ts$/, /\.tsx$/]);
```

## lib/package-manager.js - 패키지 관리자 API

이 모듈은 패키지 관리자 자동 감지 및 설정 API를 제공합니다.

### 지원되는 패키지 관리자

```javascript
const { PACKAGE_MANAGERS } = require('./lib/package-manager');
```

| 패키지 관리자 | lock 파일 | install 명령어 | run 명령어 | exec 명령어 |
|--- | --- | --- | --- | ---|
| `npm` | package-lock.json | `npm install` | `npm run` | `npx` |
| `pnpm` | pnpm-lock.yaml | `pnpm install` | `pnpm` | `pnpm dlx` |
| `yarn` | yarn.lock | `yarn` | `yarn` | `yarn dlx` |
| `bun` | bun.lockb | `bun install` | `bun run` | `bunx` |

### 감지 우선순위

```javascript
const { DETECTION_PRIORITY } = require('./lib/package-manager');

// ['pnpm', 'bun', 'yarn', 'npm']
```

패키지 관리자 감지는 다음 우선순위로 진행됩니다 (높은 순서):

1. 환경 변수 `CLAUDE_PACKAGE_MANAGER`
2. 프로젝트级 설정 `.claude/package-manager.json`
3. `package.json`의 `packageManager` 필드
4. Lock 파일 감지
5. 전역 사용자 선호도 `~/.claude/package-manager.json`
6. 우선순위에 따라 첫 번째로 사용 가능한 패키지 관리자 반환

### 핵심 함수

```javascript
const {
  getPackageManager,
  setPreferredPackageManager,
  setProjectPackageManager,
  getAvailablePackageManagers,
  getRunCommand,
  getExecCommand,
  getCommandPattern
} = require('./lib/package-manager');
```

#### getPackageManager(options = {})

현재 프로젝트에서 사용할 패키지 관리자 가져오기

**매개변수**:
- `options` (object, 선택)
  - `projectDir` (string) - 프로젝트 디렉토리 경로, 기본값 `process.cwd()`
  - `fallbackOrder` (string[]) - 대체 순서, 기본값 `['pnpm', 'bun', 'yarn', 'npm']`

**반환값**: `{name: string, config: object, source: string}`

- `name`: 패키지 관리자 이름
- `config`: 패키지 관리자 설정 객체
- `source`: 감지 소스 (`'environment' | 'project-config' | 'package.json' | 'lock-file' | 'global-config' | 'fallback' | 'default'`)

**예제**:
```javascript
const pm = getPackageManager();
console.log(pm.name);        // 'pnpm'
console.log(pm.source);      // 'lock-file'
console.log(pm.config);      // { name: 'pnpm', lockFile: 'pnpm-lock.yaml', ... }
```

#### setPreferredPackageManager(pmName)

전역 패키지 관리자 선호도 설정

**매개변수**:
- `pmName` (string) - 패키지 관리자 이름 (`npm | pnpm | yarn | bun`)

**반환값**: `object` - 설정 객체

**예제**:
```javascript
const config = setPreferredPackageManager('pnpm');
// ~/.claude/package-manager.json에 저장
// { packageManager: 'pnpm', setAt: '2026-01-25T...' }
```

#### setProjectPackageManager(pmName, projectDir)

프로젝트级 패키지 관리자 선호도 설정

**매개변수**:
- `pmName` (string) - 패키지 관리자 이름
- `projectDir` (string) - 프로젝트 디렉토리 경로, 기본값 `process.cwd()`

**반환값**: `object` - 설정 객체

**예제**:
```javascript
const config = setProjectPackageManager('bun', '/path/to/project');
// /path/to/project/.claude/package-manager.json에 저장
// { packageManager: 'bun', setAt: '2026-01-25T...' }
```

#### getAvailablePackageManagers()

시스템에 설치된 패키지 관리자 목록 가져오기

**반환값**: `string[]` - 사용 가능한 패키지 관리자 이름 배열

**예제**:
```javascript
const available = getAvailablePackageManagers();
// ['pnpm', 'npm']  // pnpm과 npm만 설치된 경우
```

#### getRunCommand(script, options = {})

스크립트 실행 명령어 가져오기

**매개변수**:
- `script` (string) - 스크립트 이름 (예: `"dev"`, `"build"`, `"test"`)
- `options` (object, 선택) - 프로젝트 디렉토리 옵션

**반환값**: `string` - 완전한 실행 명령어

**예제**:
```javascript
const devCmd = getRunCommand('dev');
// 'npm run dev'  또는  'pnpm dev'  또는  'bun run dev'

const buildCmd = getRunCommand('build');
// 'npm run build'  또는  'pnpm build'
```

**내장 스크립트 바로가기**:
- `install` → `installCmd` 반환
- `test` → `testCmd` 반환
- `build` → `buildCmd` 반환
- `dev` → `devCmd` 반환
- 기타 → `${runCmd} ${script}` 반환

#### getExecCommand(binary, args = '', options = {})

패키지 바이너리 실행 명령어 가져오기

**매개변수**:
- `binary` (string) - 바이너리 파일 이름 (예: `"prettier"`, `"eslint"`)
- `args` (string, 선택) - 매개변수 문자열
- `options` (object, 선택) - 프로젝트 디렉토리 옵션

**반환값**: `string` - 완전한 실행 명령어

**예제**:
```javascript
const cmd = getExecCommand('prettier', '--write file.js');
// 'npx prettier --write file.js'  또는  'pnpm dlx prettier --write file.js'

const eslintCmd = getExecCommand('eslint');
// 'npx eslint'  또는  'bunx eslint'
```

#### getCommandPattern(action)

모든 패키지 관리자 명령어와 일치하는 정규식 패턴 생성

**매개변수**:
- `action` (string) - 작업 유형 (`'dev' | 'install' | 'test' | 'build'` 또는 커스텀 스크립트 이름)

**반환값**: `string` - 정규식 패턴

**예제**:
```javascript
const devPattern = getCommandPattern('dev');
// (npm run dev|pnpm( run)? dev|yarn dev|bun run dev)

const installPattern = getCommandPattern('install');
// (npm install|pnpm install|yarn( install)?|bun install)
```

## setup-package-manager.js - 패키지 관리자 설정 스크립트

이는 인터랙티브하게 패키지 관리자 선호도를 설정하는 실행 가능한 CLI 스크립트입니다.

### 사용 방법

```bash
# 현재 패키지 관리자 감지 및 표시
node scripts/setup-package-manager.js --detect

# 전역 선호도 설정
node scripts/setup-package-manager.js --global pnpm

# 프로젝트 선호도 설정
node scripts/setup-package-manager.js --project bun

# 사용 가능한 패키지 관리자 나열
node scripts/setup-package-manager.js --list

# 도움말 표시
node scripts/setup-package-manager.js --help
```

### 명령행 매개변수

| 매개변수 | 설명 |
|--- | ---|
| `--detect` | 현재 패키지 관리자 감지 및 표시 |
| `--global <pm>` | 전역 패키지 관리자 설정 |
| `--project <pm>` | 프로젝트 패키지 관리자 설정 |
| `--list` | 모든 사용 가능한 패키지 관리자 나열 |
| `--help` | 도움말 정보 표시 |

### 출력 예제

**--detect 출력**:
```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ pnpm (current)
  ✓ npm
  ✗ yarn
  ✗ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

## Hook 스크립트 상세 설명

### session-start.js - 세션 시작 훅

**Hook 유형**: `SessionStart`

**트리거 타이밍**: Claude Code 세션 시작 시

**기능**:
- 최근 세션 파일 확인 (최근 7일)
- 학습한 스킬 파일 확인
- 패키지 관리자 감지 및 보고
- 패키지 관리자가 fallback 감지를 통과한 경우 선택 프롬프트 표시

**출력 예제**:
```
[SessionStart] Found 3 recent session(s)
[SessionStart] Latest: /Users/username/.claude/sessions/2026-01-25-session.tmp
[SessionStart] 5 learned skill(s) available in /Users/username/.claude/skills/learned
[SessionStart] Package manager: pnpm (lock-file)
```

### session-end.js - 세션 종료 훅

**Hook 유형**: `SessionEnd`

**트리거 타이밍**: Claude Code 세션 종료 시

**기능**:
- 오늘 날짜 세션 파일 생성 또는 업데이트
- 세션 시작 및 종료 시간 기록
- 세션 상태 템플릿 제공 (완료, 진행 중, 노트)

**세션 파일 템플릿**:
```markdown
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 14:30
**Last Updated:** 15:45

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
```
[relevant files]
```
```

### pre-compact.js - 압축 전 훅

**Hook 유형**: `PreCompact`

**트리거 타이밍**: Claude Code 컨텍스트 압축 전

**기능**:
- 로그 파일에 압축 이벤트 기록
- 활성 세션 파일에 압축 발생 시간 표시

**출력 예제**:
```
[PreCompact] State saved before compaction
```

**로그 파일**: `~/.claude/sessions/compaction-log.txt`

### suggest-compact.js - 압축 제안 훅

**Hook 유형**: `PreToolUse`

**트리거 타이밍**:每次 도구 호출 후 (일반적으로 Edit 또는 Write)

**기능**:
- 도구 호출 횟수 추적
- 임계값 도달 시 수동 압축 제안
- 정기적으로 압축 타이밍 제안

**환경 변수**:
- `COMPACT_THRESHOLD` - 압축 임계값 (기본값: 50)
- `CLAUDE_SESSION_ID` - 세션 ID

**출력 예제**:
```
[StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
[StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
```

::: tip 수동 압축 vs 자동 압축
수동 압축을 권장하는 이유:
- 자동 압축은 일반적으로 작업 중간에 트리거되어 컨텍스트 손실 발생
- 수동 압축은 논리적 단계 전환 시 중요한 정보 보존 가능
- 압축 타이밍: 탐색 단계 종료, 실행 단계 시작, 마일스톤 완료 시
:::

### evaluate-session.js - 세션 평가 훅

**Hook 유형**: `Stop`

**트리거 타이밍**:每次 AI 응답 종료 시

**기능**:
- 세션 길이 확인 (사용자 메시지 수 기반)
- 추출 가능한 패턴이 포함된 세션 평가
- 학습한 스킬 저장 제안

**설정 파일**: `skills/continuous-learning/config.json`

**환경 변수**:
- `CLAUDE_TRANSCRIPT_PATH` - 세션 기록 파일 경로

**출력 예제**:
```
[ContinuousLearning] Session has 25 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/username/.claude/skills/learned
```

::: tip 왜 Stop을 사용하고 UserPromptSubmit이 아닌가?
- Stop은每个 응답에 한 번만 트리거 (경량)
- UserPromptSubmit은 모든 메시지에 트리거 (높은 지연)
:::

## 커스텀 Hook 스크립트

### 커스텀 Hook 생성

1. **`scripts/hooks/` 디렉토리에 스크립트 생성**

```javascript
#!/usr/bin/env node
/**
 * Custom Hook - Your Description
 *
 * Cross-platform (Windows, macOS, Linux)
 */

const { log, output } = require('../lib/utils');

async function main() {
  // 로직 구현
  log('[CustomHook] Processing...');
  
  // 결과 출력
  output({ success: true });
  
  process.exit(0);
}

main().catch(err => {
  console.error('[CustomHook] Error:', err.message);
  process.exit(0); // 세션 차단하지 않음
});
```

2. **`hooks/hooks.json`에서 Hook 설정**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/your-hook.js\""
    }
  ],
  "description": "Your custom hook description"
}
```

3. **Hook 테스트**

```bash
# Claude Code에서 조건 트리거하고 출력 확인
```

### 모범 사례

#### 1. 오류 처리

```javascript
main().catch(err => {
  console.error('[HookName] Error:', err.message);
  process.exit(0); // 세션 차단하지 않음
});
```

#### 2. 유틸리티 라이브러리 사용

```javascript
const {
  log,
  readFile,
  writeFile,
  ensureDir
} = require('../lib/utils');
```

#### 3. 크로스 플랫폼 경로

```javascript
const path = require('path');
const filePath = path.join(getHomeDir(), '.claude', 'config.json');
```

#### 4. 환경 변수

```javascript
const sessionId = process.env.CLAUDE_SESSION_ID || 'default';
const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
```

## 테스트 스크립트

### 유틸리티 함수 테스트

```javascript
const { findFiles, readFile, writeFile } = require('./lib/utils');

// 파일 검색 테스트
const files = findFiles('/tmp', '*.tmp', { maxAge: 7 });
console.log('Found files:', files);

// 파일读写 테스트
writeFile('/tmp/test.txt', 'Hello, World!');
const content = readFile('/tmp/test.txt');
console.log('Content:', content);
```

### 패키지 관리자 감지 테스트

```javascript
const { getPackageManager, getRunCommand } = require('./lib/package-manager');

const pm = getPackageManager();
console.log('Package manager:', pm.name);
console.log('Source:', pm.source);
console.log('Dev command:', getRunCommand('dev'));
```

### Hook 스크립트 테스트

```bash
# 직접 Hook 스크립트 실행 (환경 변수 제공 필요)
CLAUDE_SESSION_ID=test CLAUDE_TRANSCRIPT_PATH=/tmp/transcript.json \
  node scripts/hooks/session-start.js
```

## 디버깅 팁

### 1. log 출력 사용

```javascript
const { log } = require('../lib/utils');

log('[Debug] Current value:', value);
```

### 2. 오류捕获

```javascript
try {
  // 오류가 발생할 수 있는 코드
} catch (err) {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
}
```

### 3. 파일 경로 검증

```javascript
const path = require('path');
const { existsSync } = require('fs');

const filePath = path.join(getHomeDir(), '.claude', 'config.json');
console.log('Config path:', filePath);
console.log('Exists:', existsSync(filePath));
```

### 4. Hook 실행 로그 확인

```bash
# Claude Code에서 Hook의 stderr 출력은 응답에 표시됨
# [HookName] 접두사가 있는 로그 찾기
```

## 자주 묻는 질문

### Q1: Hook 스크립트가 실행되지 않습니다?

**가능한 원인**:
1. `hooks/hooks.json`의 matcher 설정 오류
2. 스크립트 경로 오류
3. 스크립트 실행 권한 없음

**排查 단계**:
```bash
# 스크립트 경로 확인
ls -la scripts/hooks/

# 스크립트 직접 실행하여 테스트
node scripts/hooks/session-start.js

# hooks.json 문법 검증
cat hooks/hooks.json | jq '.'
```

### Q2: Windows에서 경로 오류?

**原因**: Windows는 역슬래시를 사용하고 Unix는 슬래시를 사용

**해결 방안**:
```javascript
// ❌ 오류: 하드코딩된 경로 구분자
const path = 'C:\\Users\\username\\.claude';

// ✅ 올바름: path.join() 사용
const path = require('path');
const claudePath = path.join(getHomeDir(), '.claude');
```

### Q3: Hook 입력을 어떻게 디버깅하나요?

**方法**: Hook 입력을 임시 파일에 쓰기

```javascript
const { writeFileSync } = require('fs');
const path = require('path');

async function main() {
  const hookInput = await readStdinJson();
  
  // 디버그 파일에 쓰기
  const debugPath = path.join(getTempDir(), 'hook-debug.json');
  writeFileSync(debugPath, JSON.stringify(hookInput, null, 2));
  
  console.error('[Debug] Input saved to:', debugPath);
}
```

## 본 수업 요약

본 수업에서는 Everything Claude Code의 Scripts API를 체계적으로 설명했습니다:

**핵심 모듈**:
- `lib/utils.js`: 크로스 플랫폼 유틸리티 함수 (플랫폼 감지, 파일 작업, 시스템 명령어)
- `lib/package-manager.js`: 패키지 관리자 감지 및 설정 API
- `setup-package-manager.js`: CLI 설정 도구

**Hook 스크립트**:
- `session-start.js`: 세션 시작 시 컨텍스트 로드
- `session-end.js`: 세션 종료 시 상태 저장
- `pre-compact.js`: 압축 전 상태 저장
- `suggest-compact.js`: 수동 압축 타이밍 제안
- `evaluate-session.js`: 세션 추출 패턴 평가

**모범 사례**:
- 유틸리티 함수 사용하여 크로스 플랫폼 호환성 보장
- Hook 스크립트가 세션을 차단하지 않음 (오류 시 종료 코드 0)
- `log()` 사용하여 디버깅 정보 출력
- `process.env` 사용하여 환경 변수 읽기

**디버깅 팁**:
- 스크립트 직접 실행하여 테스트
- 임시 파일에 디버깅 데이터 저장
- matcher 설정 및 스크립트 경로 확인

## 다음 수업 예고

> 다음 수업에서는 **[테스트 스위트: 실행 및 커스터마이징](../test-suite/)**을 학습합니다.
>
> 배울 내용:
> - 테스트 스위트 실행 방법
> - 유틸리티 함수에 대한 단위 테스트 작성 방법
> - Hook 스크립트에 대한 통합 테스트 작성 방법
> - 커스텀 테스트 케이스 추가 방법

---

## 부록: 소스 코드 레퍼런스

<details>
<summary><strong>클릭하여 소스 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 모듈 | 파일 경로 | 줄 번호 |
|--- | --- | ---|
| 범용 유틸리티 함수 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| 패키지 관리자 API | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-391 |
| 패키지 관리자 설정 스크립트 | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js) | 1-207 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |

**주요 상수**:
- `DETECTION_PRIORITY = ['pnpm', 'bun', 'yarn', 'npm']`: 패키지 관리자 감지 우선순위 (`scripts/lib/package-manager.js:57`)
- `COMPACT_THRESHOLD`: 압축 제안 임계값 (기본값 50, 환경 변수로 재정의 가능)

**주요 함수**:
- `getPackageManager()`: 패키지 관리자 감지 및 선택 (`scripts/lib/package-manager.js:157`)
- `findFiles()`: 크로스 플랫폼 파일 검색 (`scripts/lib/utils.js:102`)
- `readStdinJson()`: Hook 입력 읽기 (`scripts/lib/utils.js:154`)
- `commandExists()`: 명령어 존재 여부 확인 (`scripts/lib/utils.js:228`)

**환경 변수**:
- `CLAUDE_PACKAGE_MANAGER`: 강제 패키지 관리자 지정
- `CLAUDE_SESSION_ID`: 세션 ID
- `CLAUDE_TRANSCRIPT_PATH`: 세션 기록 파일 경로
- `COMPACT_THRESHOLD`: 압축 제안 임계값

**플랫폼 감지**:
- `process.platform === 'win32'`: Windows
- `process.platform === 'darwin'`: macOS
- `process.platform === 'linux'`: Linux

</details>
