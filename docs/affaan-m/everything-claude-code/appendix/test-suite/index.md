---
title: "Test Suite: Running and Coverage | Everything Claude Code"
sidebarTitle: "Test Suite"
subtitle: "Test Suite: Running and Customization"
description: "Learn to run the Everything Claude Code test suite. Covers 56 test cases for utils, package-manager, and hooks modules with cross-platform testing methods."
tags:
  - "testing"
  - "test-suite"
  - "qa"
prerequisite:
  - "/start/installation/"
order: 220
---

# Test Suite: Running and Customization

Everything Claude Code includes a comprehensive test suite for verifying the correctness of scripts and utility functions. This tutorial covers how to run the test suite, its coverage, and how to add custom tests.

## What is a Test Suite?

A **test suite** is a collection of automated test scripts and test cases used to verify software functionality correctness. The Everything Claude Code test suite includes 56 test cases covering cross-platform utility functions, package manager detection, and Hook scripts, ensuring proper operation across different operating systems.

::: info Why Do You Need a Test Suite?

The test suite ensures that when adding new features or modifying existing code, existing functionality is not accidentally broken. This is especially important for cross-platform Node.js scripts, as tests can verify behavior consistency across different operating systems.

:::

---

## Test Suite Overview

The test suite is located in the `tests/` directory with the following structure:

```
tests/
├── lib/                          # Utility library tests
│   ├── utils.test.js              # Cross-platform utility function tests (21 tests)
│   └── package-manager.test.js    # Package manager detection tests (21 tests)
├── hooks/                        # Hook script tests
│   └── hooks.test.js             # Hook script tests (14 tests)
└── run-all.js                    # Main test runner
```

**Test Coverage**:

| Module | Test Count | Coverage |
|--- | --- | ---|
| `utils.js` | 21 | Platform detection, directory operations, file operations, date/time, system commands |
| `package-manager.js` | 21 | Package manager detection, command generation, priority logic |
| Hook Scripts | 14 | Session lifecycle, compact suggestions, session evaluation, hooks.json validation |
| **Total** | **56** | Complete functionality verification |

---

## Running Tests

### Run All Tests

Execute from the plugin root directory:

```bash
node tests/run-all.js
```

**You should see**:

```
╔════════════════════════════════════════════════════════╗
║           Everything Claude Code - Test Suite            ║
╚════════════════════════════════════════════════════════╝

━━━ Running lib/utils.test.js ━━

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

### Run Individual Test Files

If you only want to test specific modules, you can run test files individually:

```bash
# Test utils.js
node tests/lib/utils.test.js

# Test package-manager.js
node tests/lib/package-manager.test.js

# Test Hook scripts
node tests/hooks/hooks.test.js
```

**You should see** (using utils.test.js as an example):

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

## Test Framework Overview

The test suite uses a custom lightweight test framework with no external dependencies. Each test file includes the following components:

### Test Helper Functions

```javascript
// Synchronous test helper function
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

// Asynchronous test helper function
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

### Test Assertions

Use Node.js built-in `assert` module for assertions:

```javascript
const assert = require('assert');

// Equality assertion
assert.strictEqual(actual, expected, 'message');

// Boolean assertion
assert.ok(condition, 'message');

// Array/object inclusion
assert.ok(array.includes(item), 'message');

// Regular expression match
assert.ok(regex.test(string), 'message');
```

---

## Detailed Test Module Explanations

### lib/utils.test.js

Tests cross-platform utility functions from `scripts/lib/utils.js`.

**Test Categories**:

| Category | Test Count | Coverage |
|--- | --- | ---|
| Platform Detection | 2 | `isWindows`, `isMacOS`, `isLinux` |
| Directory Functions | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| Date/Time | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| File Operations | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| System Functions | 5 | `commandExists`, `runCommand` |

**Key Test Example**:

```javascript
// Test file operations
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

Tests package manager detection and selection logic from `scripts/lib/package-manager.js`.

**Test Categories**:

| Category | Test Count | Coverage |
|--- | --- | ---|
| Package Manager Constants | 2 | `PACKAGE_MANAGERS`, property completeness |
| Lock File Detection | 5 | npm, pnpm, yarn, bun lock file recognition |
| package.json Detection | 4 | `packageManager` field parsing |
| Available Package Managers | 1 | System package manager detection |
| Package Manager Selection | 3 | Environment variable, lock file, project configuration priority |
| Command Generation | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**Key Test Example**:

```javascript
// Test detection priority
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

Tests Hook script execution and configuration validation.

**Test Categories**:

| Category | Test Count | Coverage |
|--- | --- | ---|
| session-start.js | 2 | Execution success, output format |
| session-end.js | 2 | Execution success, file creation |
| pre-compact.js | 3 | Execution success, output format, log creation |
| suggest-compact.js | 3 | Execution success, counter, threshold trigger |
| evaluate-session.js | 3 | Short session skip, long session handling, message counting |
| hooks.json Validation | 4 | JSON validity, event types, node prefix, path variables |

**Key Test Example**:

```javascript
// Test hooks.json configuration
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

## Adding New Tests

### Create Test File

1. Create a new test file in the `tests/` directory
2. Use test helper functions to wrap test cases
3. Use `assert` module for assertions
4. Register the new test file in `run-all.js`

**Example**: Create a new test file `tests/lib/new-module.test.js`

```javascript
/**
 * Tests for scripts/lib/new-module.js
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

  // Your test cases
  if (test('basic functionality', () => {
    assert.strictEqual(newModule.test(), 'expected value');
  })) passed++; else failed++;

  // Summary
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### Register in run-all.js

Add the new test file in `tests/run-all.js`:

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // Add this line
  'hooks/hooks.test.js'
];
```

---

## Testing Best Practices

### 1. Use try-finally to Clean Up Resources

Temporary files and directories created in tests should be cleaned up:

```javascript
✅ Correct:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // Test logic
  } finally {
    fs.unlinkSync(testFile);  // Ensure cleanup
  }
});

❌ Incorrect:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // If test fails, file won't be cleaned up
  fs.unlinkSync(testFile);
});
```

### 2. Isolate Test Environment

Each test should use unique temporary file names to avoid interference:

```javascript
✅ Correct:
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ Incorrect:
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. Use Descriptive Test Names

Test names should clearly describe what is being tested:

```javascript
✅ Correct:
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ Incorrect:
test('test1', () => { ... });
```

### 4. Test Edge Cases

Don't just test normal cases—also test boundary and error conditions:

```javascript
// Test normal case
test('detects npm from package-lock.json', () => { ... });

// Test empty directory
test('returns null when no lock file exists', () => { ... });

// Test multiple lock files
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. Validate Input Security

For functions that accept input, tests should verify security:

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## Common Questions

### What to Do When Tests Fail?

1. Check the specific error message
2. Verify test logic is correct
3. Validate if the function being tested has a bug
4. Run tests on different operating systems (cross-platform compatibility)

### Why Do Test Files Output `Passed: X Failed: Y` With a Newline?

This is for compatibility with `run-all.js` result parsing. Test files must output a specific format:

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### Can I Use Other Testing Frameworks?

Yes, but you need to modify `run-all.js` to support the new framework's output format. Currently, a custom lightweight framework is used, which is suitable for simple testing scenarios.

---

## Lesson Summary

The test suite is an important part of Everything Claude Code quality assurance. By running tests, you can ensure:

- ✅ Cross-platform utility functions work correctly across different operating systems
- ✅ Package manager detection logic correctly handles all priorities
- ✅ Hook scripts correctly create and update files
- ✅ Configuration files are properly formatted and complete

**Test Suite Features**:
- Lightweight: No external dependencies
- Complete coverage: 56 test cases
- Cross-platform: Supports Windows, macOS, Linux
- Easy to extend: Adding new tests takes just a few lines of code

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Contributing Guide](../contributing/)**.
>
> You'll learn:
> - How to contribute configurations, agents, and skills to the project
> - Best practices for code contributions
> - Pull Request submission workflow

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|--- | --- | ---|
| Test Runner | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| utils Tests | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
|--- | --- | ---|
| hooks Tests | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| utils Module | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
|--- | --- | ---|

**Key Functions**:

**run-all.js**:
- `execSync()`: Execute child process and capture output (line 8)
- Test file array: `testFiles` defines all test file paths (lines 13-17)
- Result parsing: Extract `Passed` and `Failed` counts from output (lines 46-62)

**Test Helper Functions**:
- `test()`: Synchronous test wrapper that catches exceptions and outputs results
- `asyncTest()`: Asynchronous test wrapper that supports Promise-based tests

**utils.js**:
- Platform detection: `isWindows`, `isMacOS`, `isLinux` (lines 12-14)
- Directory functions: `getHomeDir()`, `getClaudeDir()`, `getSessionsDir()` (lines 19-35)
- File operations: `readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()` (lines 200-343)
- System functions: `commandExists()`, `runCommand()` (lines 228-269)

**package-manager.js**:
- `PACKAGE_MANAGERS`: Package manager configuration constants (lines 13-54)
- `DETECTION_PRIORITY`: Detection priority order (line 57)
- `getPackageManager()`: Select package manager based on priority (lines 157-236)
- `getRunCommand()`: Generate run script command (lines 279-294)
- `getExecCommand()`: Generate execute package command (lines 301-304)

</details>
