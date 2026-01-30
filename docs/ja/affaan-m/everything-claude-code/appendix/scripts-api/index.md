---
title: "Scripts API: Node.js スクリプト | Everything Claude Code"
sidebarTitle: "Hook スクリプトの作成"
subtitle: "Scripts API: Node.js スクリプト"
description: "Everything Claude Code の Scripts API インターフェースを学びます。プラットフォーム検出、ファイル操作、パッケージマネージャー API、Hook スクリプトの使用方法を習得しましょう。"
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

# Scripts API リファレンス：Node.js スクリプトインターフェース

## このレッスンで習得できること

- Everything Claude Code のスクリプト API インターフェースを完全に理解する
- プラットフォーム検出とクロスプラットフォームユーティリティ関数を使用する
- パッケージマネージャーの自動検出メカニズムを設定・使用する
- カスタム Hook スクリプトを作成して自動化機能を拡張する
- 既存のスクリプト実装をデバッグ・修正する

## 現在直面している課題

Everything Claude Code には多くの自動化スクリプトがあることは知っていますが、以下のような疑問があるでしょう：

- 「これらの Node.js スクリプトは具体的にどのような API を提供しているのか？」
- 「Hook スクリプトをカスタマイズするには？」
- 「パッケージマネージャー検出の優先順位は？」
- 「スクリプトでクロスプラットフォーム互換性を実現するには？」

このチュートリアルでは、完全な Scripts API リファレンスマニュアルを提供します。

## 基本コンセプト

Everything Claude Code のスクリプトシステムは2つのカテゴリに分かれています：

1. **共有ユーティリティライブラリ**（`scripts/lib/`）- クロスプラットフォーム関数と API を提供
2. **Hook スクリプト**（`scripts/hooks/`）- 特定のイベントでトリガーされる自動化ロジック

すべてのスクリプトは **Windows、macOS、Linux** の3大プラットフォームをサポートし、Node.js ネイティブモジュールで実装されています。

### スクリプト構造

```
scripts/
├── lib/
│   ├── utils.js              # 汎用ユーティリティ関数
│   └── package-manager.js    # パッケージマネージャー検出
├── hooks/
│   ├── session-start.js       # SessionStart Hook
│   ├── session-end.js         # SessionEnd Hook
│   ├── pre-compact.js        # PreCompact Hook
│   ├── suggest-compact.js     # PreToolUse Hook
│   └── evaluate-session.js   # Stop Hook
└── setup-package-manager.js   # パッケージマネージャー設定スクリプト
```

## lib/utils.js - 汎用ユーティリティ関数

このモジュールは、プラットフォーム検出、ファイル操作、システムコマンドなど、クロスプラットフォームのユーティリティ関数を提供します。

### プラットフォーム検出

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| 関数 | 型 | 戻り値 | 説明 |
| --- | --- | --- | --- |
| `isWindows` | boolean | `true/false` | 現在 Windows プラットフォームかどうか |
| `isMacOS` | boolean | `true/false` | 現在 macOS プラットフォームかどうか |
| `isLinux` | boolean | `true/false` | 現在 Linux プラットフォームかどうか |

**実装原理**：`process.platform` に基づいて判定

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### ディレクトリユーティリティ

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

ユーザーのホームディレクトリを取得（クロスプラットフォーム対応）

**戻り値**：`string` - ユーザーホームディレクトリのパス

**例**：
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

Claude Code 設定ディレクトリを取得

**戻り値**：`string` - `~/.claude` ディレクトリのパス

**例**：
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

セッションファイルディレクトリを取得

**戻り値**：`string` - `~/.claude/sessions` ディレクトリのパス

**例**：
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

学習済みスキルディレクトリを取得

**戻り値**：`string` - `~/.claude/skills/learned` ディレクトリのパス

**例**：
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

システム一時ディレクトリを取得（クロスプラットフォーム）

**戻り値**：`string` - 一時ディレクトリのパス

**例**：
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

ディレクトリの存在を確認し、存在しない場合は作成

**パラメータ**：
- `dirPath` (string) - ディレクトリパス

**戻り値**：`string` - ディレクトリパス

**例**：
```javascript
const dir = ensureDir('/path/to/new/dir');
// ディレクトリが存在しない場合、再帰的に作成
```

### 日付時刻ユーティリティ

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

現在の日付を取得（形式：YYYY-MM-DD）

**戻り値**：`string` - 日付文字列

**例**：
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

現在の時刻を取得（形式：HH:MM）

**戻り値**：`string` - 時刻文字列

**例**：
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

現在の日付時刻を取得（形式：YYYY-MM-DD HH:MM:SS）

**戻り値**：`string` - 日付時刻文字列

**例**：
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### ファイル操作

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

ディレクトリ内でパターンに一致するファイルを検索（クロスプラットフォームの `find` 代替）

**パラメータ**：
- `dir` (string) - 検索するディレクトリ
- `pattern` (string) - ファイルパターン（例：`"*.tmp"`, `"*.md"`）
- `options` (object, オプション) - オプション
  - `maxAge` (number) - 最大ファイル日数
  - `recursive` (boolean) - 再帰検索するかどうか

**戻り値**：`Array<{path: string, mtime: number}>` - 一致するファイルのリスト、更新日時の降順でソート

**例**：
```javascript
// 過去7日間の .tmp ファイルを検索
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// すべての .md ファイルを再帰的に検索
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip クロスプラットフォーム互換性
この関数はクロスプラットフォームのファイル検索機能を提供し、Unix の `find` コマンドに依存しないため、Windows でも正常に動作します。
:::

#### readFile(filePath)

テキストファイルを安全に読み取り

**パラメータ**：
- `filePath` (string) - ファイルパス

**戻り値**：`string | null` - ファイル内容、読み取り失敗時は `null`

**例**：
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

テキストファイルに書き込み

**パラメータ**：
- `filePath` (string) - ファイルパス
- `content` (string) - ファイル内容

**戻り値**：なし

**例**：
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// ディレクトリが存在しない場合、自動的に作成
```

#### appendFile(filePath, content)

テキストファイルに内容を追加

**パラメータ**：
- `filePath` (string) - ファイルパス
- `content` (string) - 追加する内容

**戻り値**：なし

**例**：
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

ファイル内のテキストを置換（クロスプラットフォームの `sed` 代替）

**パラメータ**：
- `filePath` (string) - ファイルパス
- `search` (string | RegExp) - 検索する内容
- `replace` (string) - 置換内容

**戻り値**：`boolean` - 置換が成功したかどうか

**例**：
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: 置換成功
// false: ファイルが存在しないか読み取り失敗
```

#### countInFile(filePath, pattern)

ファイル内でパターンの出現回数をカウント

**パラメータ**：
- `filePath` (string) - ファイルパス
- `pattern` (string | RegExp) - カウントするパターン

**戻り値**：`number` - マッチ回数

**例**：
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

ファイル内でパターンを検索し、一致する行と行番号を返す

**パラメータ**：
- `filePath` (string) - ファイルパス
- `pattern` (string | RegExp) - 検索するパターン

**戻り値**：`Array<{lineNumber: number, content: string}>` - 一致する行のリスト

**例**：
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

標準入力から JSON データを読み取る（Hook 入力用）

**戻り値**：`Promise<object>` - パース済みの JSON オブジェクト

**例**：
```javascript
async function main() {
  const hookInput = await readStdinJson();
  console.log(hookInput.tool);
  console.log(hookInput.tool_input);
}
```

::: tip Hook 入力形式
Claude Code が Hook に渡す入力形式：
```json
{
  "tool": "Bash",
  "tool_input": { "command": "npm run dev" },
  "tool_output": { "output": "..." }
}
```
:::

#### log(message)

stderr にログを記録（ユーザーに表示される）

**パラメータ**：
- `message` (string) - ログメッセージ

**戻り値**：なし

**例**：
```javascript
log('[SessionStart] Loading context...');
// stderr に出力、Claude Code でユーザーに表示される
```

#### output(data)

stdout にデータを出力（Claude Code に返す）

**パラメータ**：
- `data` (object | string) - 出力するデータ

**戻り値**：なし

**例**：
```javascript
// オブジェクトを出力（自動的に JSON シリアライズ）
output({ success: true, message: 'Completed' });

// 文字列を出力
output('Hello, Claude');
```

### システムコマンド

```javascript
const {
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
} = require('./lib/utils');
```

#### commandExists(cmd)

コマンドが PATH に存在するかチェック

**パラメータ**：
- `cmd` (string) - コマンド名

**戻り値**：`boolean` - コマンドが存在するかどうか

**例**：
```javascript
if (commandExists('pnpm')) {
  console.log('pnpm is available');
}
```

::: warning セキュリティ検証
この関数はコマンド名を正規表現で検証し、英字、数字、アンダースコア、ドット、ハイフンのみを許可してコマンドインジェクションを防止します。
:::

#### runCommand(cmd, options)

コマンドを実行して出力を返す

**パラメータ**：
- `cmd` (string) - 実行するコマンド（信頼できるハードコードされたコマンドである必要あり）
- `options` (object, オプション) - `execSync` オプション

**戻り値**：`{success: boolean, output: string}` - 実行結果

**例**：
```javascript
const result = runCommand('git status');
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.output);
}
```

::: danger セキュリティ警告
**信頼できるハードコードされたコマンドにのみこの関数を使用してください**。ユーザー制御の入力をこの関数に直接渡さないでください。ユーザー入力には、引数配列を使用する `spawnSync` を使用してください。
:::

#### isGitRepo()

現在のディレクトリが Git リポジトリかどうかをチェック

**戻り値**：`boolean` - Git リポジトリかどうか

**例**：
```javascript
if (isGitRepo()) {
  console.log('This is a Git repository');
}
```

#### getGitModifiedFiles(patterns = [])

Git で変更されたファイルのリストを取得

**パラメータ**：
- `patterns` (string[], オプション) - フィルターパターン配列

**戻り値**：`string[]` - 変更されたファイルパスのリスト

**例**：
```javascript
// すべての変更ファイルを取得
const allModified = getGitModifiedFiles();

// TypeScript ファイルのみ取得
const tsModified = getGitModifiedFiles([/\.ts$/, /\.tsx$/]);
```

## lib/package-manager.js - パッケージマネージャー API

このモジュールはパッケージマネージャーの自動検出と設定 API を提供します。

### サポートされるパッケージマネージャー

```javascript
const { PACKAGE_MANAGERS } = require('./lib/package-manager');
```

| パッケージマネージャー | lock ファイル | install コマンド | run コマンド | exec コマンド |
| --- | --- | --- | --- | --- |
| `npm` | package-lock.json | `npm install` | `npm run` | `npx` |
| `pnpm` | pnpm-lock.yaml | `pnpm install` | `pnpm` | `pnpm dlx` |
| `yarn` | yarn.lock | `yarn` | `yarn` | `yarn dlx` |
| `bun` | bun.lockb | `bun install` | `bun run` | `bunx` |

### 検出優先順位

```javascript
const { DETECTION_PRIORITY } = require('./lib/package-manager');

// ['pnpm', 'bun', 'yarn', 'npm']
```

パッケージマネージャーの検出は以下の優先順位で行われます（高い順）：

1. 環境変数 `CLAUDE_PACKAGE_MANAGER`
2. プロジェクトレベル設定 `.claude/package-manager.json`
3. `package.json` の `packageManager` フィールド
4. Lock ファイル検出
5. グローバルユーザー設定 `~/.claude/package-manager.json`
6. 優先順位に従って最初に利用可能なパッケージマネージャーを返す

### コア関数

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

現在のプロジェクトで使用すべきパッケージマネージャーを取得

**パラメータ**：
- `options` (object, オプション)
  - `projectDir` (string) - プロジェクトディレクトリパス、デフォルトは `process.cwd()`
  - `fallbackOrder` (string[]) - フォールバック順序、デフォルトは `['pnpm', 'bun', 'yarn', 'npm']`

**戻り値**：`{name: string, config: object, source: string}`

- `name`: パッケージマネージャー名
- `config`: パッケージマネージャー設定オブジェクト
- `source`: 検出元（`'environment' | 'project-config' | 'package.json' | 'lock-file' | 'global-config' | 'fallback' | 'default'`）

**例**：
```javascript
const pm = getPackageManager();
console.log(pm.name);        // 'pnpm'
console.log(pm.source);      // 'lock-file'
console.log(pm.config);      // { name: 'pnpm', lockFile: 'pnpm-lock.yaml', ... }
```

#### setPreferredPackageManager(pmName)

グローバルパッケージマネージャー設定を設定

**パラメータ**：
- `pmName` (string) - パッケージマネージャー名（`npm | pnpm | yarn | bun`）

**戻り値**：`object` - 設定オブジェクト

**例**：
```javascript
const config = setPreferredPackageManager('pnpm');
// ~/.claude/package-manager.json に保存
// { packageManager: 'pnpm', setAt: '2026-01-25T...' }
```

#### setProjectPackageManager(pmName, projectDir)

プロジェクトレベルのパッケージマネージャー設定を設定

**パラメータ**：
- `pmName` (string) - パッケージマネージャー名
- `projectDir` (string) - プロジェクトディレクトリパス、デフォルトは `process.cwd()`

**戻り値**：`object` - 設定オブジェクト

**例**：
```javascript
const config = setProjectPackageManager('bun', '/path/to/project');
// /path/to/project/.claude/package-manager.json に保存
// { packageManager: 'bun', setAt: '2026-01-25T...' }
```

#### getAvailablePackageManagers()

システムにインストールされているパッケージマネージャーのリストを取得

**戻り値**：`string[]` - 利用可能なパッケージマネージャー名の配列

**例**：
```javascript
const available = getAvailablePackageManagers();
// ['pnpm', 'npm']  // pnpm と npm のみインストールされている場合
```

#### getRunCommand(script, options = {})

スクリプト実行コマンドを取得

**パラメータ**：
- `script` (string) - スクリプト名（例：`"dev"`, `"build"`, `"test"`）
- `options` (object, オプション) - プロジェクトディレクトリオプション

**戻り値**：`string` - 完全な実行コマンド

**例**：
```javascript
const devCmd = getRunCommand('dev');
// 'npm run dev'  または  'pnpm dev'  または  'bun run dev'

const buildCmd = getRunCommand('build');
// 'npm run build'  または  'pnpm build'
```

**組み込みスクリプトショートカット**：
- `install` → `installCmd` を返す
- `test` → `testCmd` を返す
- `build` → `buildCmd` を返す
- `dev` → `devCmd` を返す
- その他 → `${runCmd} ${script}` を返す

#### getExecCommand(binary, args = '', options = {})

パッケージバイナリ実行コマンドを取得

**パラメータ**：
- `binary` (string) - バイナリファイル名（例：`"prettier"`, `"eslint"`）
- `args` (string, オプション) - 引数文字列
- `options` (object, オプション) - プロジェクトディレクトリオプション

**戻り値**：`string` - 完全な実行コマンド

**例**：
```javascript
const cmd = getExecCommand('prettier', '--write file.js');
// 'npx prettier --write file.js'  または  'pnpm dlx prettier --write file.js'

const eslintCmd = getExecCommand('eslint');
// 'npx eslint'  または  'bunx eslint'
```

#### getCommandPattern(action)

すべてのパッケージマネージャーコマンドにマッチする正規表現パターンを生成

**パラメータ**：
- `action` (string) - 操作タイプ（`'dev' | 'install' | 'test' | 'build'` またはカスタムスクリプト名）

**戻り値**：`string` - 正規表現パターン

**例**：
```javascript
const devPattern = getCommandPattern('dev');
// (npm run dev|pnpm( run)? dev|yarn dev|bun run dev)

const installPattern = getCommandPattern('install');
// (npm install|pnpm install|yarn( install)?|bun install)
```

## setup-package-manager.js - パッケージマネージャー設定スクリプト

これはパッケージマネージャー設定をインタラクティブに行う実行可能な CLI スクリプトです。

### 使用方法

```bash
# 現在のパッケージマネージャーを検出して表示
node scripts/setup-package-manager.js --detect

# グローバル設定を設定
node scripts/setup-package-manager.js --global pnpm

# プロジェクト設定を設定
node scripts/setup-package-manager.js --project bun

# 利用可能なパッケージマネージャーを一覧表示
node scripts/setup-package-manager.js --list

# ヘルプを表示
node scripts/setup-package-manager.js --help
```

### コマンドライン引数

| 引数 | 説明 |
| --- | --- |
| `--detect` | 現在のパッケージマネージャーを検出して表示 |
| `--global <name>` | グローバル設定を設定 |
| `--project <name>` | プロジェクト設定を設定 |
| `--list` | 利用可能なすべてのパッケージマネージャーを一覧表示 |
| `--help` | ヘルプ情報を表示 |

### 出力例

**--detect 出力**：
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

## Hook スクリプト詳解

### session-start.js - セッション開始フック

**Hook タイプ**：`SessionStart`

**トリガータイミング**：Claude Code セッション開始時

**機能**：
- 最近のセッションファイルをチェック（過去7日間）
- 学習済みスキルファイルをチェック
- パッケージマネージャーを検出して報告
- パッケージマネージャーが fallback で検出された場合、選択プロンプトを表示

**出力例**：
```
[SessionStart] Found 3 recent session(s)
[SessionStart] Latest: /Users/username/.claude/sessions/2026-01-25-session.tmp
[SessionStart] 5 learned skill(s) available in /Users/username/.claude/skills/learned
[SessionStart] Package manager: pnpm (lock-file)
```

### session-end.js - セッション終了フック

**Hook タイプ**：`SessionEnd`

**トリガータイミング**：Claude Code セッション終了時

**機能**：
- 当日のセッションファイルを作成または更新
- セッション開始時刻と終了時刻を記録
- セッション状態テンプレートを提供（完了、進行中、メモ）

**セッションファイルテンプレート**：
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

### pre-compact.js - コンパクト前フック

**Hook タイプ**：`PreCompact`

**トリガータイミング**：Claude Code がコンテキストをコンパクトする前

**機能**：
- コンパクトイベントをログファイルに記録
- アクティブセッションファイルにコンパクト発生時刻をマーク

**出力例**：
```
[PreCompact] State saved before compaction
```

**ログファイル**：`~/.claude/sessions/compaction-log.txt`

### suggest-compact.js - コンパクト提案フック

**Hook タイプ**：`PreToolUse`

**トリガータイミング**：各ツール呼び出し後（通常は Edit または Write）

**機能**：
- ツール呼び出し回数を追跡
- しきい値に達したら手動コンパクトを提案
- 定期的にコンパクトタイミングを通知

**環境変数**：
- `COMPACT_THRESHOLD` - コンパクトしきい値（デフォルト：50）
- `CLAUDE_SESSION_ID` - セッション ID

**出力例**：
```
[StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
[StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
```

::: tip 手動コンパクト vs 自動コンパクト
なぜ手動コンパクトを推奨するのか？
- 自動コンパクトは通常タスクの途中でトリガーされ、コンテキストが失われる
- 手動コンパクトは論理的なフェーズ切り替え時に重要な情報を保持できる
- コンパクトタイミング：探索フェーズ終了、実行フェーズ開始、マイルストーン完了
:::

### evaluate-session.js - セッション評価フック

**Hook タイプ**：`Stop`

**トリガータイミング**：各 AI レスポンス終了時

**機能**：
- セッション長をチェック（ユーザーメッセージ数に基づく）
- セッションに抽出可能なパターンが含まれているか評価
- 学習したスキルの保存を促す

**設定ファイル**：`skills/continuous-learning/config.json`

**環境変数**：
- `CLAUDE_TRANSCRIPT_PATH` - セッション記録ファイルパス

**出力例**：
```
[ContinuousLearning] Session has 25 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/username/.claude/skills/learned
```

::: tip なぜ UserPromptSubmit ではなく Stop を使用するのか？
- Stop は各レスポンスで1回だけトリガー（軽量）
- UserPromptSubmit は各メッセージでトリガー（高レイテンシ）
:::

## カスタム Hook スクリプト

### カスタム Hook の作成

1. **`scripts/hooks/` ディレクトリにスクリプトを作成**

```javascript
#!/usr/bin/env node
/**
 * Custom Hook - Your Description
 *
 * Cross-platform (Windows, macOS, Linux)
 */

const { log, output } = require('../lib/utils');

async function main() {
  // あなたのロジック
  log('[CustomHook] Processing...');
  
  // 結果を出力
  output({ success: true });
  
  process.exit(0);
}

main().catch(err => {
  console.error('[CustomHook] Error:', err.message);
  process.exit(0); // セッションをブロックしない
});
```

2. **`hooks/hooks.json` で Hook を設定**

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

3. **Hook をテスト**

```bash
# Claude Code で条件をトリガーし、出力を確認
```

### ベストプラクティス

#### 1. エラーハンドリング

```javascript
main().catch(err => {
  console.error('[HookName] Error:', err.message);
  process.exit(0); // セッションをブロックしない
});
```

#### 2. ユーティリティライブラリの使用

```javascript
const {
  log,
  readFile,
  writeFile,
  ensureDir
} = require('../lib/utils');
```

#### 3. クロスプラットフォームパス

```javascript
const path = require('path');
const filePath = path.join(getHomeDir(), '.claude', 'config.json');
```

#### 4. 環境変数

```javascript
const sessionId = process.env.CLAUDE_SESSION_ID || 'default';
const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
```

## スクリプトのテスト

### ユーティリティ関数のテスト

```javascript
const { findFiles, readFile, writeFile } = require('./lib/utils');

// ファイル検索のテスト
const files = findFiles('/tmp', '*.tmp', { maxAge: 7 });
console.log('Found files:', files);

// ファイル読み書きのテスト
writeFile('/tmp/test.txt', 'Hello, World!');
const content = readFile('/tmp/test.txt');
console.log('Content:', content);
```

### パッケージマネージャー検出のテスト

```javascript
const { getPackageManager, getRunCommand } = require('./lib/package-manager');

const pm = getPackageManager();
console.log('Package manager:', pm.name);
console.log('Source:', pm.source);
console.log('Dev command:', getRunCommand('dev'));
```

### Hook スクリプトのテスト

```bash
# Hook スクリプトを直接実行（環境変数の提供が必要）
CLAUDE_SESSION_ID=test CLAUDE_TRANSCRIPT_PATH=/tmp/transcript.json \
  node scripts/hooks/session-start.js
```

## デバッグテクニック

### 1. log 出力の使用

```javascript
const { log } = require('../lib/utils');

log('[Debug] Current value:', value);
```

### 2. エラーのキャッチ

```javascript
try {
  // エラーが発生する可能性のあるコード
} catch (err) {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
}
```

### 3. ファイルパスの検証

```javascript
const path = require('path');
const { existsSync } = require('fs');

const filePath = path.join(getHomeDir(), '.claude', 'config.json');
console.log('Config path:', filePath);
console.log('Exists:', existsSync(filePath));
```

### 4. Hook 実行ログの確認

```bash
# Claude Code では、Hook の stderr 出力がレスポンスに表示される
# [HookName] プレフィックスのログを探す
```

## よくある質問

### Q1: Hook スクリプトが実行されない？

**考えられる原因**：
1. `hooks/hooks.json` の matcher 設定が間違っている
2. スクリプトパスが間違っている
3. スクリプトに実行権限がない

**トラブルシューティング手順**：
```bash
# スクリプトパスを確認
ls -la scripts/hooks/

# スクリプトを手動で実行してテスト
node scripts/hooks/session-start.js

# hooks.json の構文を検証
cat hooks/hooks.json | jq '.'
```

### Q2: Windows でパスエラー？

**原因**：Windows はバックスラッシュを使用し、Unix はスラッシュを使用

**解決策**：
```javascript
// ❌ 間違い：パス区切り文字をハードコード
const path = 'C:\\Users\\username\\.claude';

// ✅ 正しい：path.join() を使用
const path = require('path');
const claudePath = path.join(getHomeDir(), '.claude');
```

### Q3: Hook 入力をデバッグするには？

**方法**：Hook 入力を一時ファイルに書き込む

```javascript
const { writeFileSync } = require('fs');
const path = require('path');

async function main() {
  const hookInput = await readStdinJson();
  
  // デバッグファイルに書き込み
  const debugPath = path.join(getTempDir(), 'hook-debug.json');
  writeFileSync(debugPath, JSON.stringify(hookInput, null, 2));
  
  console.error('[Debug] Input saved to:', debugPath);
}
```

## このレッスンのまとめ

このレッスンでは Everything Claude Code の Scripts API を体系的に解説しました：

**コアモジュール**：
- `lib/utils.js`：クロスプラットフォームユーティリティ関数（プラットフォーム検出、ファイル操作、システムコマンド）
- `lib/package-manager.js`：パッケージマネージャー検出と設定 API
- `setup-package-manager.js`：CLI 設定ツール

**Hook スクリプト**：
- `session-start.js`：セッション開始時にコンテキストをロード
- `session-end.js`：セッション終了時に状態を保存
- `pre-compact.js`：コンパクト前に状態を保存
- `suggest-compact.js`：手動コンパクトタイミングを提案
- `evaluate-session.js`：セッションを評価してパターンを抽出

**ベストプラクティス**：
- ユーティリティライブラリ関数を使用してクロスプラットフォーム互換性を確保
- Hook スクリプトはセッションをブロックしない（エラー時の終了コードは 0）
- `log()` を使用してデバッグ情報を出力
- `process.env` を使用して環境変数を読み取る

**デバッグテクニック**：
- スクリプトを直接実行してテスト
- 一時ファイルを使用してデバッグデータを保存
- matcher 設定とスクリプトパスを確認

## 次のレッスン予告

> 次のレッスンでは **[テストスイート：実行とカスタマイズ](../test-suite/)** を学びます。
>
> 学習内容：
> - テストスイートの実行方法
> - ユーティリティ関数のユニットテストの書き方
> - Hook スクリプトの統合テストの書き方
> - カスタムテストケースの追加方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能モジュール | ファイルパス | 行番号 |
| --- | --- | --- |
| 汎用ユーティリティ関数 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| パッケージマネージャー API | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-391 |
| パッケージマネージャー設定スクリプト | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js) | 1-207 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |

**主要定数**：
- `DETECTION_PRIORITY = ['pnpm', 'bun', 'yarn', 'npm']`：パッケージマネージャー検出優先順位（`scripts/lib/package-manager.js:57`）
- `COMPACT_THRESHOLD`：コンパクト提案しきい値（デフォルト 50、環境変数で上書き可能）

**主要関数**：
- `getPackageManager()`：パッケージマネージャーを検出して選択（`scripts/lib/package-manager.js:157`）
- `findFiles()`：クロスプラットフォームファイル検索（`scripts/lib/utils.js:102`）
- `readStdinJson()`：Hook 入力を読み取り（`scripts/lib/utils.js:154`）
- `commandExists()`：コマンドの存在を確認（`scripts/lib/utils.js:228`）

**環境変数**：
- `CLAUDE_PACKAGE_MANAGER`：パッケージマネージャーを強制指定
- `CLAUDE_SESSION_ID`：セッション ID
- `CLAUDE_TRANSCRIPT_PATH`：セッション記録ファイルパス
- `COMPACT_THRESHOLD`：コンパクト提案しきい値

**プラットフォーム検出**：
- `process.platform === 'win32'`：Windows
- `process.platform === 'darwin'`：macOS
- `process.platform === 'linux'`：Linux

</details>
