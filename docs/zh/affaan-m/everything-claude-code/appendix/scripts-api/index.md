---
title: "Scripts API: Node.js 脚本 | Everything Claude Code"
sidebarTitle: "编写你的 Hook 脚本"
subtitle: "Scripts API: Node.js 脚本"
description: "学习 Everything Claude Code 的 Scripts API 接口。掌握平台检测、文件操作、包管理器 API 和 Hook 脚本的使用方法。"
tags:
  - "scripts-api"
  - "api"
  - "nodejs"
  - "utils"
  - "package-manager"
  - "hooks"
prerequisite:
  - "start-package-manager-setup"
order: 215
---

# Scripts API 参考：Node.js 脚本接口

## 学完你能做什么

- 完全理解 Everything Claude Code 的脚本 API 接口
- 使用平台检测和跨平台工具函数
- 配置和使用包管理器自动检测机制
- 编写自定义 Hook 脚本扩展自动化能力
- 调试和修改现有的脚本实现

## 你现在的困境

你已经知道 Everything Claude Code 有很多自动化脚本，但遇到这些问题：

- "这些 Node.js 脚本具体提供了哪些 API？"
- "如何自定义 Hook 脚本？"
- "包管理器检测的优先级是什么？"
- "脚本中如何实现跨平台兼容？"

本教程会给你一份完整的 Scripts API 参考手册。

## 核心思路

Everything Claude Code 的脚本系统分为两类：

1. **共享工具库**（`scripts/lib/`）- 提供跨平台函数和 API
2. **Hook 脚本**（`scripts/hooks/`）- 在特定事件触发的自动化逻辑

所有脚本都支持 **Windows、macOS 和 Linux** 三大平台，使用 Node.js 原生模块实现。

### 脚本结构

```
scripts/
├── lib/
│   ├── utils.js              # 通用工具函数
│   └── package-manager.js    # 包管理器检测
├── hooks/
│   ├── session-start.js       # SessionStart Hook
│   ├── session-end.js         # SessionEnd Hook
│   ├── pre-compact.js        # PreCompact Hook
│   ├── suggest-compact.js     # PreToolUse Hook
│   └── evaluate-session.js   # Stop Hook
└── setup-package-manager.js   # 包管理器设置脚本
```

## lib/utils.js - 通用工具函数

这个模块提供了跨平台的工具函数，包括平台检测、文件操作、系统命令等。

### 平台检测

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| 函数 | 类型 | 返回值 | 说明 |
|--- | --- | --- | ---|
| `isWindows` | boolean | `true/false` | 当前是否为 Windows 平台 |
| `isMacOS` | boolean | `true/false` | 当前是否为 macOS 平台 |
| `isLinux` | boolean | `true/false` | 当前是否为 Linux 平台 |

**实现原理**：基于 `process.platform` 进行判断

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### 目录工具

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

获取用户主目录（跨平台兼容）

**返回值**：`string` - 用户主目录路径

**示例**：
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

获取 Claude Code 配置目录

**返回值**：`string` - `~/.claude` 目录路径

**示例**：
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

获取会话文件目录

**返回值**：`string` - `~/.claude/sessions` 目录路径

**示例**：
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

获取已学习技能目录

**返回值**：`string` - `~/.claude/skills/learned` 目录路径

**示例**：
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

获取系统临时目录（跨平台）

**返回值**：`string` - 临时目录路径

**示例**：
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

确保目录存在，不存在则创建

**参数**：
- `dirPath` (string) - 目录路径

**返回值**：`string` - 目录路径

**示例**：
```javascript
const dir = ensureDir('/path/to/new/dir');
// 如果目录不存在，会递归创建
```

### 日期时间工具

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

获取当前日期（格式：YYYY-MM-DD）

**返回值**：`string` - 日期字符串

**示例**：
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

获取当前时间（格式：HH:MM）

**返回值**：`string` - 时间字符串

**示例**：
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

获取当前日期时间（格式：YYYY-MM-DD HH:MM:SS）

**返回值**：`string` - 日期时间字符串

**示例**：
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### 文件操作

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

在目录中查找匹配模式的文件（跨平台的 `find` 替代方案）

**参数**：
- `dir` (string) - 要搜索的目录
- `pattern` (string) - 文件模式（如 `"*.tmp"`, `"*.md"`）
- `options` (object, 可选) - 选项
  - `maxAge` (number) - 最大文件天数
  - `recursive` (boolean) - 是否递归搜索

**返回值**：`Array<{path: string, mtime: number}>` - 匹配的文件列表，按修改时间降序排序

**示例**：
```javascript
// 查找最近 7 天的 .tmp 文件
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// 递归查找所有 .md 文件
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip 跨平台兼容
这个函数提供了跨平台的文件查找功能，不依赖 Unix `find` 命令，因此可以在 Windows 上正常工作。
:::

#### readFile(filePath)

安全读取文本文件

**参数**：
- `filePath` (string) - 文件路径

**返回值**：`string | null` - 文件内容，读取失败返回 `null`

**示例**：
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

写入文本文件

**参数**：
- `filePath` (string) - 文件路径
- `content` (string) - 文件内容

**返回值**：无

**示例**：
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// 如果目录不存在，会自动创建
```

#### appendFile(filePath, content)

追加内容到文本文件

**参数**：
- `filePath` (string) - 文件路径
- `content` (string) - 要追加的内容

**返回值**：无

**示例**：
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

替换文件中的文本（跨平台 `sed` 替代方案）

**参数**：
- `filePath` (string) - 文件路径
- `search` (string | RegExp) - 要查找的内容
- `replace` (string) - 替换内容

**返回值**：`boolean` - 是否成功替换

**示例**：
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: 替换成功
// false: 文件不存在或读取失败
```

#### countInFile(filePath, pattern)

统计文件中模式出现的次数

**参数**：
- `filePath` (string) - 文件路径
- `pattern` (string | RegExp) - 要统计的模式

**返回值**：`number` - 匹配次数

**示例**：
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

在文件中搜索模式并返回匹配的行和行号

**参数**：
- `filePath` (string) - 文件路径
- `pattern` (string | RegExp) - 要搜索的模式

**返回值**：`Array<{lineNumber: number, content: string}>` - 匹配的行列表

**示例**：
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

从标准输入读取 JSON 数据（用于 Hook 输入）

**返回值**：`Promise<object>` - 解析后的 JSON 对象

**示例**：
```javascript
async function main() {
  const hookInput = await readStdinJson();
  console.log(hookInput.tool);
  console.log(hookInput.tool_input);
}
```

::: tip Hook 输入格式
Claude Code 传递给 Hook 的输入格式为：
```json
{
  "tool": "Bash",
  "tool_input": { "command": "npm run dev" },
  "tool_output": { "output": "..." }
}
```
:::

#### log(message)

记录日志到 stderr（对用户可见）

**参数**：
- `message` (string) - 日志消息

**返回值**：无

**示例**：
```javascript
log('[SessionStart] Loading context...');
// 输出到 stderr，用户在 Claude Code 中可见
```

#### output(data)

输出数据到 stdout（返回给 Claude Code）

**参数**：
- `data` (object | string) - 要输出的数据

**返回值**：无

**示例**：
```javascript
// 输出对象（自动 JSON 序列化）
output({ success: true, message: 'Completed' });

// 输出字符串
output('Hello, Claude');
```

### 系统命令

```javascript
const {
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
} = require('./lib/utils');
```

#### commandExists(cmd)

检查命令是否存在于 PATH 中

**参数**：
- `cmd` (string) - 命令名称

**返回值**：`boolean` - 命令是否存在

**示例**：
```javascript
if (commandExists('pnpm')) {
  console.log('pnpm is available');
}
```

::: warning 安全验证
该函数会对命令名进行正则验证，只允许字母、数字、下划线、点和短横线，防止命令注入。
:::

#### runCommand(cmd, options)

执行命令并返回输出

**参数**：
- `cmd` (string) - 要执行的命令（必须是可信的、硬编码的命令）
- `options` (object, 可选) - `execSync` 选项

**返回值**：`{success: boolean, output: string}` - 执行结果

**示例**：
```javascript
const result = runCommand('git status');
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.output);
}
```

::: danger 安全警告
**仅对可信、硬编码的命令使用此函数**。不要将用户控制的输入直接传递给此函数。对于用户输入，请使用带参数数组的 `spawnSync`。
:::

#### isGitRepo()

检查当前目录是否为 Git 仓库

**返回值**：`boolean` - 是否为 Git 仓库

**示例**：
```javascript
if (isGitRepo()) {
  console.log('This is a Git repository');
}
```

#### getGitModifiedFiles(patterns = [])

获取 Git 修改的文件列表

**参数**：
- `patterns` (string[], 可选) - 过滤模式数组

**返回值**：`string[]` - 修改的文件路径列表

**示例**：
```javascript
// 获取所有修改的文件
const allModified = getGitModifiedFiles();

// 只获取 TypeScript 文件
const tsModified = getGitModifiedFiles([/\.ts$/, /\.tsx$/]);
```

## lib/package-manager.js - 包管理器 API

这个模块提供了包管理器自动检测和配置 API。

### 支持的包管理器

```javascript
const { PACKAGE_MANAGERS } = require('./lib/package-manager');
```

| 包管理器 | lock 文件 | install 命令 | run 命令 | exec 命令 |
|--- | --- | --- | --- | ---|
| `npm` | package-lock.json | `npm install` | `npm run` | `npx` |
| `pnpm` | pnpm-lock.yaml | `pnpm install` | `pnpm` | `pnpm dlx` |
| `yarn` | yarn.lock | `yarn` | `yarn` | `yarn dlx` |
| `bun` | bun.lockb | `bun install` | `bun run` | `bunx` |

### 检测优先级

```javascript
const { DETECTION_PRIORITY } = require('./lib/package-manager');

// ['pnpm', 'bun', 'yarn', 'npm']
```

包管理器检测按以下优先级进行（从高到低）：

1. 环境变量 `CLAUDE_PACKAGE_MANAGER`
2. 项目级配置 `.claude/package-manager.json`
3. `package.json` 的 `packageManager` 字段
4. Lock 文件检测
5. 全局用户偏好 `~/.claude/package-manager.json`
6. 按优先级返回第一个可用的包管理器

### 核心函数

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

获取当前项目应使用的包管理器

**参数**：
- `options` (object, 可选)
  - `projectDir` (string) - 项目目录路径，默认为 `process.cwd()`
  - `fallbackOrder` (string[]) - 备用顺序，默认为 `['pnpm', 'bun', 'yarn', 'npm']`

**返回值**：`{name: string, config: object, source: string}`

- `name`: 包管理器名称
- `config`: 包管理器配置对象
- `source`: 检测来源（`'environment' | 'project-config' | 'package.json' | 'lock-file' | 'global-config' | 'fallback' | 'default'`）

**示例**：
```javascript
const pm = getPackageManager();
console.log(pm.name);        // 'pnpm'
console.log(pm.source);      // 'lock-file'
console.log(pm.config);      // { name: 'pnpm', lockFile: 'pnpm-lock.yaml', ... }
```

#### setPreferredPackageManager(pmName)

设置全局包管理器偏好

**参数**：
- `pmName` (string) - 包管理器名称（`npm | pnpm | yarn | bun`）

**返回值**：`object` - 配置对象

**示例**：
```javascript
const config = setPreferredPackageManager('pnpm');
// 保存到 ~/.claude/package-manager.json
// { packageManager: 'pnpm', setAt: '2026-01-25T...' }
```

#### setProjectPackageManager(pmName, projectDir)

设置项目级包管理器偏好

**参数**：
- `pmName` (string) - 包管理器名称
- `projectDir` (string) - 项目目录路径，默认为 `process.cwd()`

**返回值**：`object` - 配置对象

**示例**：
```javascript
const config = setProjectPackageManager('bun', '/path/to/project');
// 保存到 /path/to/project/.claude/package-manager.json
// { packageManager: 'bun', setAt: '2026-01-25T...' }
```

#### getAvailablePackageManagers()

获取系统中已安装的包管理器列表

**返回值**：`string[]` - 可用的包管理器名称数组

**示例**：
```javascript
const available = getAvailablePackageManagers();
// ['pnpm', 'npm']  // 如果只安装了 pnpm 和 npm
```

#### getRunCommand(script, options = {})

获取运行脚本的命令

**参数**：
- `script` (string) - 脚本名称（如 `"dev"`, `"build"`, `"test"`）
- `options` (object, 可选) - 项目目录选项

**返回值**：`string` - 完整的运行命令

**示例**：
```javascript
const devCmd = getRunCommand('dev');
// 'npm run dev'  或  'pnpm dev'  或  'bun run dev'

const buildCmd = getRunCommand('build');
// 'npm run build'  或  'pnpm build'
```

**内置脚本快捷方式**：
- `install` → 返回 `installCmd`
- `test` → 返回 `testCmd`
- `build` → 返回 `buildCmd`
- `dev` → 返回 `devCmd`
- 其他 → 返回 `${runCmd} ${script}`

#### getExecCommand(binary, args = '', options = {})

获取执行包二进制文件的命令

**参数**：
- `binary` (string) - 二进制文件名（如 `"prettier"`, `"eslint"`）
- `args` (string, 可选) - 参数字符串
- `options` (object, 可选) - 项目目录选项

**返回值**：`string` - 完整的执行命令

**示例**：
```javascript
const cmd = getExecCommand('prettier', '--write file.js');
// 'npx prettier --write file.js'  或  'pnpm dlx prettier --write file.js'

const eslintCmd = getExecCommand('eslint');
// 'npx eslint'  或  'bunx eslint'
```

#### getCommandPattern(action)

生成匹配所有包管理器命令的正则表达式模式

**参数**：
- `action` (string) - 操作类型（`'dev' | 'install' | 'test' | 'build'` 或自定义脚本名）

**返回值**：`string` - 正则表达式模式

**示例**：
```javascript
const devPattern = getCommandPattern('dev');
// (npm run dev|pnpm( run)? dev|yarn dev|bun run dev)

const installPattern = getCommandPattern('install');
// (npm install|pnpm install|yarn( install)?|bun install)
```

## setup-package-manager.js - 包管理器设置脚本

这是可执行的 CLI 脚本，用于交互式配置包管理器偏好。

### 使用方法

```bash
# 检测并显示当前包管理器
node scripts/setup-package-manager.js --detect

# 设置全局偏好
node scripts/setup-package-manager.js --global pnpm

# 设置项目偏好
node scripts/setup-package-manager.js --project bun

# 列出可用的包管理器
node scripts/setup-package-manager.js --list

# 显示帮助
node scripts/setup-package-manager.js --help
```

### 命令行参数

| 参数 | 说明 |
|--- | ---|
| `--detect` | 检测并显示当前包管理器 |
|--- | ---|
|--- | ---|
| `--list` | 列出所有可用的包管理器 |
| `--help` | 显示帮助信息 |

### 输出示例

**--detect 输出**：
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

## Hook 脚本详解

### session-start.js - 会话开始钩子

**Hook 类型**：`SessionStart`

**触发时机**：Claude Code 会话开始时

**功能**：
- 检查最近的会话文件（最近 7 天）
- 检查已学习的技能文件
- 检测并报告包管理器
- 如果包管理器通过 fallback 检测，显示选择提示

**输出示例**：
```
[SessionStart] Found 3 recent session(s)
[SessionStart] Latest: /Users/username/.claude/sessions/2026-01-25-session.tmp
[SessionStart] 5 learned skill(s) available in /Users/username/.claude/skills/learned
[SessionStart] Package manager: pnpm (lock-file)
```

### session-end.js - 会话结束钩子

**Hook 类型**：`SessionEnd`

**触发时机**：Claude Code 会话结束时

**功能**：
- 创建或更新当日会话文件
- 记录会话开始和结束时间
- 提供会话状态模板（已完成、进行中、笔记）

**会话文件模板**：
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

### pre-compact.js - 压缩前钩子

**Hook 类型**：`PreCompact`

**触发时机**：Claude Code 压缩上下文之前

**功能**：
- 记录压缩事件到日志文件
- 在活动会话文件中标记压缩发生时间

**输出示例**：
```
[PreCompact] State saved before compaction
```

**日志文件**：`~/.claude/sessions/compaction-log.txt`

### suggest-compact.js - 压缩建议钩子

**Hook 类型**：`PreToolUse`

**触发时机**：每次工具调用后（通常是 Edit 或 Write）

**功能**：
- 跟踪工具调用次数
- 在达到阈值时建议手动压缩
- 定期提示压缩时机

**环境变量**：
- `COMPACT_THRESHOLD` - 压缩阈值（默认：50）
- `CLAUDE_SESSION_ID` - 会话 ID

**输出示例**：
```
[StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
[StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
```

::: tip 手动压缩 vs 自动压缩
为什么推荐手动压缩？
- 自动压缩通常在任务中途触发，导致上下文丢失
- 手动压缩可以在逻辑阶段切换时保留重要信息
- 压缩时机：探索阶段结束、执行阶段开始、里程碑完成
:::

### evaluate-session.js - 会话评估钩子

**Hook 类型**：`Stop`

**触发时机**：每次 AI 响应结束时

**功能**：
- 检查会话长度（基于用户消息数）
- 评估会话是否包含可提取的模式
- 提示保存学习到的技能

**配置文件**：`skills/continuous-learning/config.json`

**环境变量**：
- `CLAUDE_TRANSCRIPT_PATH` - 会话记录文件路径

**输出示例**：
```
[ContinuousLearning] Session has 25 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/username/.claude/skills/learned
```

::: tip 为什么使用 Stop 而非 UserPromptSubmit？
- Stop 每个响应只触发一次（轻量级）
- UserPromptSubmit 每条消息都触发（高延迟）
:::

## 自定义 Hook 脚本

### 创建自定义 Hook

1. **在 `scripts/hooks/` 目录下创建脚本**

```javascript
#!/usr/bin/env node
/**
 * Custom Hook - Your Description
 *
 * Cross-platform (Windows, macOS, Linux)
 */

const { log, output } = require('../lib/utils');

async function main() {
  // 你的逻辑
  log('[CustomHook] Processing...');
  
  // 输出结果
  output({ success: true });
  
  process.exit(0);
}

main().catch(err => {
  console.error('[CustomHook] Error:', err.message);
  process.exit(0); // 不阻塞会话
});
```

2. **在 `hooks/hooks.json` 中配置 Hook**

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

3. **测试 Hook**

```bash
# 在 Claude Code 中触发条件，检查输出
```

### 最佳实践

#### 1. 错误处理

```javascript
main().catch(err => {
  console.error('[HookName] Error:', err.message);
  process.exit(0); // 不阻塞会话
});
```

#### 2. 使用工具库

```javascript
const {
  log,
  readFile,
  writeFile,
  ensureDir
} = require('../lib/utils');
```

#### 3. 跨平台路径

```javascript
const path = require('path');
const filePath = path.join(getHomeDir(), '.claude', 'config.json');
```

#### 4. 环境变量

```javascript
const sessionId = process.env.CLAUDE_SESSION_ID || 'default';
const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
```

## 测试脚本

### 测试工具函数

```javascript
const { findFiles, readFile, writeFile } = require('./lib/utils');

// 测试文件查找
const files = findFiles('/tmp', '*.tmp', { maxAge: 7 });
console.log('Found files:', files);

// 测试文件读写
writeFile('/tmp/test.txt', 'Hello, World!');
const content = readFile('/tmp/test.txt');
console.log('Content:', content);
```

### 测试包管理器检测

```javascript
const { getPackageManager, getRunCommand } = require('./lib/package-manager');

const pm = getPackageManager();
console.log('Package manager:', pm.name);
console.log('Source:', pm.source);
console.log('Dev command:', getRunCommand('dev'));
```

### 测试 Hook 脚本

```bash
# 直接运行 Hook 脚本（需要提供环境变量）
CLAUDE_SESSION_ID=test CLAUDE_TRANSCRIPT_PATH=/tmp/transcript.json \
  node scripts/hooks/session-start.js
```

## 调试技巧

### 1. 使用 log 输出

```javascript
const { log } = require('../lib/utils');

log('[Debug] Current value:', value);
```

### 2. 捕获错误

```javascript
try {
  // 可能出错的代码
} catch (err) {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
}
```

### 3. 验证文件路径

```javascript
const path = require('path');
const { existsSync } = require('fs');

const filePath = path.join(getHomeDir(), '.claude', 'config.json');
console.log('Config path:', filePath);
console.log('Exists:', existsSync(filePath));
```

### 4. 查看 Hook 执行日志

```bash
# 在 Claude Code 中，Hook 的 stderr 输出会显示在响应中
# 查找 [HookName] 前缀的日志
```

## 常见问题

### Q1: Hook 脚本没有执行？

**可能原因**：
1. `hooks/hooks.json` 中的 matcher 配置错误
2. 脚本路径错误
3. 脚本没有执行权限

**排查步骤**：
```bash
# 检查脚本路径
ls -la scripts/hooks/

# 手动运行脚本测试
node scripts/hooks/session-start.js

# 验证 hooks.json 语法
cat hooks/hooks.json | jq '.'
```

### Q2: Windows 上路径错误？

**原因**：Windows 使用反斜杠，而 Unix 使用正斜杠

**解决方案**：
```javascript
// ❌ 错误：硬编码路径分隔符
const path = 'C:\\Users\\username\\.claude';

// ✅ 正确：使用 path.join()
const path = require('path');
const claudePath = path.join(getHomeDir(), '.claude');
```

### Q3: 如何调试 Hook 输入？

**方法**：将 Hook 输入写入临时文件

```javascript
const { writeFileSync } = require('fs');
const path = require('path');

async function main() {
  const hookInput = await readStdinJson();
  
  // 写入调试文件
  const debugPath = path.join(getTempDir(), 'hook-debug.json');
  writeFileSync(debugPath, JSON.stringify(hookInput, null, 2));
  
  console.error('[Debug] Input saved to:', debugPath);
}
```

## 本课小结

本课系统讲解了 Everything Claude Code 的 Scripts API：

**核心模块**：
- `lib/utils.js`：跨平台工具函数（平台检测、文件操作、系统命令）
- `lib/package-manager.js`：包管理器检测和配置 API
- `setup-package-manager.js`：CLI 配置工具

**Hook 脚本**：
- `session-start.js`：会话开始时加载上下文
- `session-end.js`：会话结束时保存状态
- `pre-compact.js`：压缩前保存状态
- `suggest-compact.js`：建议手动压缩时机
- `evaluate-session.js`：评估会话提取模式

**最佳实践**：
- 使用工具库函数确保跨平台兼容
- Hook 脚本不阻塞会话（错误时退出码为 0）
- 使用 `log()` 输出调试信息
- 使用 `process.env` 读取环境变量

**调试技巧**：
- 直接运行脚本测试
- 使用临时文件保存调试数据
- 检查 matcher 配置和脚本路径

## 下一课预告

> 下一课我们学习 **[测试套件：运行与自定义](../test-suite/)**。
>
> 你会学到：
> - 如何运行测试套件
> - 如何为工具函数编写单元测试
> - 如何为 Hook 脚本编写集成测试
> - 如何添加自定义测试用例

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能模块 | 文件路径 | 行号 |
|--- | --- | ---|
| 通用工具函数 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| 包管理器 API | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-391 |
| 包管理器设置脚本 | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js) | 1-207 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |

**关键常量**：
- `DETECTION_PRIORITY = ['pnpm', 'bun', 'yarn', 'npm']`：包管理器检测优先级（`scripts/lib/package-manager.js:57`）
- `COMPACT_THRESHOLD`：压缩建议阈值（默认 50，可通过环境变量覆盖）

**关键函数**：
- `getPackageManager()`：检测和选择包管理器（`scripts/lib/package-manager.js:157`）
- `findFiles()`：跨平台文件查找（`scripts/lib/utils.js:102`）
- `readStdinJson()`：读取 Hook 输入（`scripts/lib/utils.js:154`）
- `commandExists()`：检查命令是否存在（`scripts/lib/utils.js:228`）

**环境变量**：
- `CLAUDE_PACKAGE_MANAGER`：强制指定包管理器
- `CLAUDE_SESSION_ID`：会话 ID
- `CLAUDE_TRANSCRIPT_PATH`：会话记录文件路径
- `COMPACT_THRESHOLD`：压缩建议阈值

**平台检测**：
- `process.platform === 'win32'`：Windows
- `process.platform === 'darwin'`：macOS
- `process.platform === 'linux'`：Linux

</details>
