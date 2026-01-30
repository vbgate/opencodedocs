---
title: "테스트 스위트: 실행 및 커스터마이징 | everything-claude-code"
sidebarTitle: "모든 테스트 실행"
subtitle: "테스트 스위트: 실행 및 커스터마이징"
description: "everything-claude-code 테스트 스위트 실행 방법을 학습합니다. 56개의 테스트 케이스를 포함하며, utils, package-manager, hooks 모듈을 다루고 크로스 플랫폼 테스트, 프레임워크 사용, 커스텀 테스트 단계를 설명합니다."
tags:
  - "테스트"
  - "테스트 스위트"
  - "QA"
prerequisite:
  - "start-installation"
order: "220"
---

# 테스트 스위트: 실행 및 커스터마이징

Everything Claude Code는 스크립트와 유틸리티 함수의 정확성을 검증하기 위한 완전한 테스트 스위트를 포함하고 있습니다. 이 문서에서는 테스트 스위트의 실행 방법, 커버리지 범위, 그리고 커스텀 테스트 추가 방법을 소개합니다.

## 테스트 스위트란?

**테스트 스위트**는 소프트웨어 기능의 정확성을 검증하기 위한 자동화된 테스트 스크립트와 테스트 케이스의 집합입니다. Everything Claude Code의 테스트 스위트는 56개의 테스트 케이스를 포함하며, 크로스 플랫폼 유틸리티 함수, 패키지 매니저 감지, Hook 스크립트를 커버하여 다양한 운영 체제에서 정상적으로 작동하는지 확인합니다.

::: info 왜 테스트 스위트가 필요한가요?

테스트 스위트는 새 기능을 추가하거나 기존 코드를 수정할 때 의도치 않게 기존 기능을 손상시키지 않도록 보장합니다. 특히 크로스 플랫폼 Node.js 스크립트의 경우, 테스트를 통해 다양한 운영 체제에서 동작의 일관성을 검증할 수 있습니다.

:::

---

## 테스트 스위트 개요

테스트 스위트는 `tests/` 디렉토리에 있으며, 다음과 같은 구조를 포함합니다:

```
tests/
├── lib/                          # 유틸리티 라이브러리 테스트
│   ├── utils.test.js              # 크로스 플랫폼 유틸리티 함수 테스트 (21개)
│   └── package-manager.test.js    # 패키지 매니저 감지 테스트 (21개)
├── hooks/                        # Hook 스크립트 테스트
│   └── hooks.test.js             # Hook 스크립트 테스트 (14개)
└── run-all.js                    # 메인 테스트 러너
```

**테스트 커버리지 범위**:

| 모듈 | 테스트 수 | 커버 내용 |
| --- | --- | --- |
| `utils.js` | 21 | 플랫폼 감지, 디렉토리操作, 파일操作, 날짜/시간, 시스템 명령 |
| `package-manager.js` | 21 | 패키지 매니저 감지, 명령 생성, 우선순위 로직 |
| Hook 스크립트 | 14 | 세션 수명주기, 압축 제안, 세션 평가, hooks.json 검증 |
| **총계** | **56** | 완전한 기능 검증 |

---

## 테스트 실행

### 전체 테스트 실행

플러그인 루트 디렉토리에서 실행:

```bash
node tests/run-all.js
```

**예상 출력**:

```
╔════════════════════════════════════════════════════════╗
║           Everything Claude Code - Test Suite            ║
╚════════════════════════════════════════════════════════╝

━━━ Running lib/utils.test.js ━━━

=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ✓ getTempDir returns valid temp directory
  ✓ ensureDir creates directory

...

=== Test Results ===
Passed: 21
Failed: 0
Total:  21

╔════════════════════════════════════════════════════════╗
║                     Final Results                        ║
╠════════════════════════════════════════════════════════╣
║  Total Tests:   56                                      ║
║  Passed:       56  ✓                                   ║
║  Failed:        0                                       ║
╚════════════════════════════════════════════════════════╝
```

### 단일 테스트 파일 실행

특정 모듈만 테스트하려면 개별 테스트 파일을 실행할 수 있습니다:

```bash
# utils.js 테스트
node tests/lib/utils.test.js

# package-manager.js 테스트
node tests/lib/package-manager.test.js

# Hook 스크립트 테스트
node tests/hooks/hooks.test.js
```

**예상 출력** (utils.test.js 기준):

```
=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ...

File Operations:
  ✓ readFile returns null for non-existent file
  ✓ writeFile and readFile work together
  ✓ appendFile adds content to file
  ✓ replaceInFile replaces text
  ✓ countInFile counts occurrences
  ✓ grepFile finds matching lines

System Functions:
  ✓ commandExists finds node
  ✓ commandExists returns false for fake command
  ✓ runCommand executes simple command
  ✓ runCommand handles failed command

=== Test Results ===
Passed: 21
Failed: 0
Total:  21
```

---

## 테스트 프레임워크 설명

테스트 스위트는 외부 라이브러리에 의존하지 않는 커스텀 경량 테스트 프레임워크를 사용합니다. 각 테스트 파일은 다음 구성 요소를 포함합니다:

### 테스트 헬퍼 함수

```javascript
// 동기 테스트 헬퍼 함수
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

// 비동기 테스트 헬퍼 함수
async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}
```

### 테스트 어설션

Node.js 내장 `assert` 모듈을 사용하여 어설션을 수행합니다:

```javascript
const assert = require('assert');

// 등가 어설션
assert.strictEqual(actual, expected, 'message');

// 불리언 어설션
assert.ok(condition, 'message');

// 배열/객체 포함
assert.ok(array.includes(item), 'message');

// 정규식 매칭
assert.ok(regex.test(string), 'message');
```

---

## 각 테스트 모듈 상세 설명

### lib/utils.test.js

`scripts/lib/utils.js`의 크로스 플랫폼 유틸리티 함수를 테스트합니다.

**테스트 카테고리**:

| 카테고리 | 테스트 수 | 커버 기능 |
| --- | --- | --- |
| 플랫폼 감지 | 2 | `isWindows`, `isMacOS`, `isLinux` |
| 디렉토리 함수 | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| 날짜/시간 | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| 파일操作 | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| 시스템 함수 | 5 | `commandExists`, `runCommand` |

**주요 테스트 예제**:

```javascript
// 파일操作 테스트
test('writeFile and readFile work together', () => {
  const testFile = path.join(utils.getTempDir(), `utils-test-${Date.now()}.txt`);
  const testContent = 'Hello, World!';
  try {
    utils.writeFile(testFile, testContent);
    const read = utils.readFile(testFile);
    assert.strictEqual(read, testContent);
  } finally {
    fs.unlinkSync(testFile);
  }
});
```

### lib/package-manager.test.js

`scripts/lib/package-manager.js`의 패키지 매니저 감지 및 선택 로직을 테스트합니다.

**테스트 카테고리**:

| 카테고리 | 테스트 수 | 커버 기능 |
| --- | --- | --- |
| 패키지 매니저 상수 | 2 | `PACKAGE_MANAGERS`, 속성 완전성 |
| Lock file 감지 | 5 | npm, pnpm, yarn, bun의 lock file 인식 |
| package.json 감지 | 4 | `packageManager` 필드 파싱 |
| 사용 가능한 패키지 매니저 | 1 | 시스템 패키지 매니저 감지 |
| 패키지 매니저 선택 | 3 | 환경 변수, lock file, 프로젝트 설정 우선순위 |
| 명령 생성 | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**주요 테스트 예제**:

```javascript
// 감지 우선순위 테스트
test('respects environment variable', () => {
  const originalEnv = process.env.CLAUDE_PACKAGE_MANAGER;
  try {
    process.env.CLAUDE_PACKAGE_MANAGER = 'yarn';
    const result = pm.getPackageManager();
    assert.strictEqual(result.name, 'yarn');
    assert.strictEqual(result.source, 'environment');
  } finally {
    if (originalEnv !== undefined) {
      process.env.CLAUDE_PACKAGE_MANAGER = originalEnv;
    } else {
      delete process.env.CLAUDE_PACKAGE_MANAGER;
    }
  }
});
```

### hooks/hooks.test.js

Hook 스크립트의 실행 및 설정 검증을 테스트합니다.

**테스트 카테고리**:

| 카테고리 | 테스트 수 | 커버 기능 |
| --- | --- | --- |
| session-start.js | 2 | 실행 성공, 출력 형식 |
| session-end.js | 2 | 실행 성공, 파일 생성 |
| pre-compact.js | 3 | 실행 성공, 출력 형식, 로그 생성 |
| suggest-compact.js | 3 | 실행 성공, 카운터, 임계값 트리거 |
| evaluate-session.js | 3 | 짧은 세션 건너뛰기, 긴 세션 처리, 메시지 카운트 |
| hooks.json 검증 | 4 | JSON 유효성, 이벤트 유형, node 접두사, 경로 변수 |

**주요 테스트 예제**:

```javascript
// hooks.json 설정 테스트
test('all hook commands use node', () => {
  const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
  const hooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));

  const checkHooks = (hookArray) => {
    for (const entry of hookArray) {
      for (const hook of entry.hooks) {
        if (hook.type === 'command') {
          assert.ok(
            hook.command.startsWith('node'),
            `Hook command should start with 'node': ${hook.command.substring(0, 50)}...`
          );
        }
      }
    }
  };

  for (const [eventType, hookArray] of Object.entries(hooks.hooks)) {
    checkHooks(hookArray);
  }
});
```

---

## 새 테스트 추가

### 테스트 파일 생성

1. `tests/` 디렉토리에 새 테스트 파일 생성
2. 테스트 헬퍼 함수로 테스트 케이스 래핑
3. `assert` 모듈로 어설션 수행
4. `run-all.js`에 새 테스트 파일 등록

**예제**: 새 테스트 파일 `tests/lib/new-module.test.js` 생성

```javascript
/**
 * tests for scripts/lib/new-module.js
 *
 * Run with: node tests/lib/new-module.test.js
 */

const assert = require('assert');
const newModule = require('../../scripts/lib/new-module');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing new-module.js ===\n');

  let passed = 0;
  let failed = 0;

  // 테스트 케이스
  if (test('basic functionality', () => {
    assert.strictEqual(newModule.test(), 'expected value');
  })) passed++; else failed++;

  // 요약
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### run-all.js에 등록

`tests/run-all.js`에 새 테스트 파일 추가:

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // 이 줄 추가
  'hooks/hooks.test.js'
];
```

---

## 테스트 베스트 프랙티스

### 1. try-finally로 리소스 정리

테스트에서 생성한 임시 파일과 디렉토리는 정리되어야 합니다:

```javascript
✅ 올바른 방법:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // 테스트 로직
  } finally {
    fs.unlinkSync(testFile);  // 정리 보장
  }
});

❌ 잘못된 방법:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // 테스트 실패 시 파일 정리 안됨
  fs.unlinkSync(testFile);
});
```

### 2. 테스트 환경 격리

각 테스트는 고유한 임시 파일명을 사용하여 상호 간섭을 피해야 합니다:

```javascript
✅ 올바른 방법:
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ 잘못된 방법:
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. 설명적인 테스트 이름 사용

테스트 이름은 테스트 내용을 명확히 설명해야 합니다:

```javascript
✅ 올바른 방법:
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ 잘못된 방법:
test('test1', () => { ... });
```

### 4. 경계 조건 테스트

정상적인 경우뿐만 아니라 경계와 오류 상황도 테스트해야 합니다:

```javascript
// 정상적인 경우 테스트
test('detects npm from package-lock.json', () => { ... });

// 빈 디렉토리 테스트
test('returns null when no lock file exists', () => { ... });

// 여러 lock 파일 테스트
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. 입력 보안성 검증

입력을 받는 함수의 경우, 테스트에서 보안을 검증해야 합니다:

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## 자주 묻는 질문

### 테스트 실패 시怎么办?

1. 구체적인 오류 메시지 확인
2. 테스트 로직이 올바른지 확인
3. 테스트 대상 함수에 버그가 있는지 검증
4. 다양한 운영 체제에서 테스트 실행 (크로스 플랫폼 호환성)

### 테스트 파일에서 `Passed: X Failed: Y` 출력 후 줄바꿈이 있는 이유?

이는 `run-all.js`의 결과 파싱과 호환되기 위함입니다. 테스트 파일은 특정 형식을 출력해야 합니다:

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### 다른 테스트 프레임워크를 사용할 수 있나요?

사용할 수 있지만, 새 프레임워크의 출력 형식을 지원하도록 `run-all.js`를 수정해야 합니다. 현재使用的是 커스텀 경량 프레임워크로, 단순한 테스트 시나리오에 적합합니다.

---

## 이 수업小结

테스트 스위트는 Everything Claude Code 품질 보증의 중요한 구성 요소입니다. 테스트를 실행함으로써 다음을 보장할 수 있습니다:

- ✅ 크로스 플랫폼 유틸리티 함수가 다양한 운영 체제에서 정상 작동
- ✅ 패키지 매니저 감지 로직이 모든 우선순위를 올바르게 처리
- ✅ Hook 스크립트가 파일을 올바르게 생성 및 업데이트
- ✅ 설정 파일 형식이 올바르고 완전

**테스트 스위트 특징**:
- 경량: 외부 의존성 없음
- 완전한 커버리지: 56개의 테스트 케이스
- 크로스 플랫폼: Windows, macOS, Linux 지원
- 확장 용이: 새 테스트 추가只需몇 줄 코드

---

## 다음 수업 예고

> 다음 수업에서는 **[기여 가이드](../contributing/)**를 학습합니다.
>
> 학습 내용:
> - 프로젝트에 설정, agent, skill 기여 방법
> - 코드 기여 베스트 프랙티스
> - Pull Request 제출 프로세스

---

## 부록: 소스 코드 참고

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 줄 번호 |
| --- | --- | --- |
| 테스트 러너 | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| utils 테스트 | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
| --- | --- | --- |
| hooks 테스트 | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| utils 모듈 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| --- | --- | --- |

**주요 함수**:

**run-all.js**:
- `execSync()`: 하위 프로세스 실행 및 출력 가져오기 (8행)
- 테스트 파일 배열: `testFiles`가 모든 테스트 파일 경로 정의 (13-17행)
- 결과 파싱: 출력에서 `Passed` 및 `Failed` 카운트 추출 (46-62행)

**테스트 헬퍼 함수**:
- `test()`: 동기 테스트 래퍼, 예외捕获 및 결과 출력
- `asyncTest()`: 비동기 테스트 래퍼, Promise 테스트 지원

**utils.js**:
- 플랫폼 감지: `isWindows`, `isMacOS`, `isLinux` (12-14행)
- 디렉토리 함수: `getHomeDir()`, `getClaudeDir()`, `getSessionsDir()` (19-35행)
- 파일操作: `readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()` (200-343행)
- 시스템 함수: `commandExists()`, `runCommand()` (228-269행)

**package-manager.js**:
- `PACKAGE_MANAGERS`: 패키지 매니저 설정 상수 (13-54행)
- `DETECTION_PRIORITY`: 감지 우선순위 순서 (57행)
- `getPackageManager()`: 우선순위에 따라 패키지 매니저 선택 (157-236행)
- `getRunCommand()`: 실행 스크립트 명령 생성 (279-294행)
- `getExecCommand()`: 실행 패키지 명령 생성 (301-304행)

</details>
