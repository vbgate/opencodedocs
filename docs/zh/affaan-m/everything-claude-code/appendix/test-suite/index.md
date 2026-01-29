---
title: "测试套件: 运行与自定义 | everything-claude-code"
sidebarTitle: "跑通所有测试"
subtitle: "测试套件：运行与自定义"
description: "学习 everything-claude-code 测试套件的运行方法。涵盖 56 个测试用例,包括 utils、package-manager 和 hooks 模块,讲解跨平台测试、框架使用和自定义测试步骤。"
tags:
  - "testing"
  - "test-suite"
  - "qa"
prerequisite:
  - "start-installation"
order: 220
---

# 测试套件：运行与自定义

Everything Claude Code 包含一个完整的测试套件,用于验证脚本和工具函数的正确性。本文介绍测试套件的运行方法、覆盖范围以及如何添加自定义测试。

## 什么是测试套件?

**测试套件**是一组自动化测试脚本和测试用例的集合,用于验证软件功能正确性。Everything Claude Code 的测试套件包含 56 个测试用例,覆盖跨平台工具函数、包管理器检测和 Hook 脚本,确保在不同操作系统上都能正常工作。

::: info 为什么需要测试套件?

测试套件确保在添加新功能或修改现有代码时,不会意外破坏已有功能。特别是对于跨平台的 Node.js 脚本,测试可以在不同操作系统上验证行为一致性。

:::

---

## 测试套件概览

测试套件位于 `tests/` 目录下,包含以下结构:

```
tests/
├── lib/                          # 工具库测试
│   ├── utils.test.js              # 跨平台工具函数测试 (21个测试)
│   └── package-manager.test.js    # 包管理器检测测试 (21个测试)
├── hooks/                        # Hook 脚本测试
│   └── hooks.test.js             # Hook 脚本测试 (14个测试)
└── run-all.js                    # 主测试运行器
```

**测试覆盖范围**:

| 模块 | 测试数量 | 覆盖内容 |
|--- | --- | ---|
| `utils.js` | 21 | 平台检测、目录操作、文件操作、日期时间、系统命令 |
| `package-manager.js` | 21 | 包管理器检测、命令生成、优先级逻辑 |
| Hook 脚本 | 14 | session 生命周期、压缩建议、会话评估、hooks.json 验证 |
| **总计** | **56** | 完整的功能验证 |

---

## 运行测试

### 运行全部测试

在插件根目录下执行:

```bash
node tests/run-all.js
```

**你应该看到**:

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

### 运行单个测试文件

如果只想测试特定模块,可以单独运行测试文件:

```bash
# 测试 utils.js
node tests/lib/utils.test.js

# 测试 package-manager.js
node tests/lib/package-manager.test.js

# 测试 Hook 脚本
node tests/hooks/hooks.test.js
```

**你应该看到** (以 utils.test.js 为例):

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

## 测试框架说明

测试套件使用自定义的轻量级测试框架,不依赖外部库。每个测试文件都包含以下组件:

### 测试辅助函数

```javascript
// 同步测试辅助函数
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

// 异步测试辅助函数
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

### 测试断言

使用 Node.js 内置的 `assert` 模块进行断言:

```javascript
const assert = require('assert');

// 等值断言
assert.strictEqual(actual, expected, 'message');

// 布尔断言
assert.ok(condition, 'message');

// 数组/对象包含
assert.ok(array.includes(item), 'message');

// 正则匹配
assert.ok(regex.test(string), 'message');
```

---

## 各测试模块详解

### lib/utils.test.js

测试 `scripts/lib/utils.js` 的跨平台工具函数。

**测试类别**:

| 类别 | 测试数量 | 覆盖功能 |
|--- | --- | ---|
| 平台检测 | 2 | `isWindows`, `isMacOS`, `isLinux` |
| 目录函数 | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| 日期/时间 | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| 文件操作 | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| 系统函数 | 5 | `commandExists`, `runCommand` |

**关键测试示例**:

```javascript
// 测试文件操作
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

测试 `scripts/lib/package-manager.js` 的包管理器检测和选择逻辑。

**测试类别**:

| 类别 | 测试数量 | 覆盖功能 |
|--- | --- | ---|
| 包管理器常量 | 2 | `PACKAGE_MANAGERS`, 属性完整性 |
| Lock file 检测 | 5 | npm, pnpm, yarn, bun 的 lock file 识别 |
| package.json 检测 | 4 | `packageManager` 字段解析 |
| 可用包管理器 | 1 | 系统包管理器检测 |
| 包管理器选择 | 3 | 环境变量、lock file、项目配置优先级 |
| 命令生成 | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**关键测试示例**:

```javascript
// 测试检测优先级
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

测试 Hook 脚本的执行和配置验证。

**测试类别**:

| 类别 | 测试数量 | 覆盖功能 |
|--- | --- | ---|
| session-start.js | 2 | 执行成功、输出格式 |
| session-end.js | 2 | 执行成功、文件创建 |
| pre-compact.js | 3 | 执行成功、输出格式、日志创建 |
| suggest-compact.js | 3 | 执行成功、计数器、阈值触发 |
| evaluate-session.js | 3 | 短会话跳过、长会话处理、消息计数 |
| hooks.json 验证 | 4 | JSON 有效性、事件类型、node 前缀、路径变量 |

**关键测试示例**:

```javascript
// 测试 hooks.json 配置
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

## 添加新测试

### 创建测试文件

1. 在 `tests/` 目录下创建新的测试文件
2. 使用测试辅助函数包装测试用例
3. 使用 `assert` 模块进行断言
4. 在 `run-all.js` 中注册新测试文件

**示例**: 创建一个新的测试文件 `tests/lib/new-module.test.js`

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

  // 你的测试用例
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

### 注册到 run-all.js

在 `tests/run-all.js` 中添加新测试文件:

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // 添加这一行
  'hooks/hooks.test.js'
];
```

---

## 测试最佳实践

### 1. 使用 try-finally 清理资源

测试中创建的临时文件和目录应该被清理:

```javascript
✅ 正确:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // 测试逻辑
  } finally {
    fs.unlinkSync(testFile);  // 确保清理
  }
});

❌ 错误:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // 如果测试失败,文件不会被清理
  fs.unlinkSync(testFile);
});
```

### 2. 隔离测试环境

每个测试应该使用唯一的临时文件名,避免相互干扰:

```javascript
✅ 正确:
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ 错误:
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. 使用描述性测试名称

测试名称应该清楚说明测试的内容:

```javascript
✅ 正确:
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ 错误:
test('test1', () => { ... });
```

### 4. 测试边界条件

不仅要测试正常情况,还要测试边界和错误情况:

```javascript
// 测试正常情况
test('detects npm from package-lock.json', () => { ... });

// 测试空目录
test('returns null when no lock file exists', () => { ... });

// 测试多个 lock 文件
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. 验证输入安全性

对于接受输入的函数,测试应该验证安全性:

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## 常见问题

### 测试失败怎么办?

1. 查看具体的错误信息
2. 检查测试逻辑是否正确
3. 验证被测试的函数是否有 bug
4. 在不同操作系统上运行测试(跨平台兼容性)

### 为什么测试文件输出 `Passed: X Failed: Y` 后有换行?

这是为了与 `run-all.js` 的结果解析兼容。测试文件必须输出特定格式:

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### 可以使用其他测试框架吗?

可以,但需要修改 `run-all.js` 以支持新框架的输出格式。当前使用的是自定义轻量级框架,适合简单的测试场景。

---

## 本课小结

测试套件是 Everything Claude Code 质量保证的重要组成部分。通过运行测试,可以确保:

- ✅ 跨平台工具函数在不同操作系统上正常工作
- ✅ 包管理器检测逻辑正确处理所有优先级
- ✅ Hook 脚本正确创建和更新文件
- ✅ 配置文件格式正确且完整

**测试套件特点**:
- 轻量级: 无外部依赖
- 完整覆盖: 56 个测试用例
- 跨平台: 支持 Windows、macOS、Linux
- 易于扩展: 添加新测试只需几行代码

---

## 下一课预告

> 下一课我们学习 **[贡献指南](../contributing/)**。
>
> 你将学到:
> - 如何向项目贡献配置、agent 和 skill
> - 代码贡献的最佳实践
> - 提交 Pull Request 的流程

---

## 附录:源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间:2026-01-25

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 测试运行器 | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| utils 测试 | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
|--- | --- | ---|
| hooks 测试 | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| utils 模块 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
|--- | --- | ---|

**关键函数**:

**run-all.js**:
- `execSync()`: 执行子进程并获取输出 (第 8 行)
- 测试文件数组: `testFiles` 定义所有测试文件路径 (第 13-17 行)
- 结果解析: 从输出中提取 `Passed` 和 `Failed` 计数 (第 46-62 行)

**测试辅助函数**:
- `test()`: 同步测试包装器,捕获异常并输出结果
- `asyncTest()`: 异步测试包装器,支持 Promise 测试

**utils.js**:
- 平台检测: `isWindows`, `isMacOS`, `isLinux` (第 12-14 行)
- 目录函数: `getHomeDir()`, `getClaudeDir()`, `getSessionsDir()` (第 19-35 行)
- 文件操作: `readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()` (第 200-343 行)
- 系统函数: `commandExists()`, `runCommand()` (第 228-269 行)

**package-manager.js**:
- `PACKAGE_MANAGERS`: 包管理器配置常量 (第 13-54 行)
- `DETECTION_PRIORITY`: 检测优先级顺序 (第 57 行)
- `getPackageManager()`: 根据优先级选择包管理器 (第 157-236 行)
- `getRunCommand()`: 生成运行脚本命令 (第 279-294 行)
- `getExecCommand()`: 生成执行包命令 (第 301-304 行)

</details>
