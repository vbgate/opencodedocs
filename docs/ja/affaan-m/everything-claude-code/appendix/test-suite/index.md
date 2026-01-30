---
title: "テストスイート：実行とカスタマイズ | everything-claude-code"
sidebarTitle: "全テストを実行する"
subtitle: "テストスイート：実行とカスタマイズ"
description: "everything-claude-code テストスイートの実行方法を学びます。utils、package-manager、hooks モジュールを含む56のテストケースをカバーし、クロスプラットフォームテスト、フレームワークの使用方法、カスタムテストの追加手順を解説します。"
tags:
  - "testing"
  - "test-suite"
  - "qa"
prerequisite:
  - "start-installation"
order: 220
---

# テストスイート：実行とカスタマイズ

Everything Claude Code には、スクリプトとユーティリティ関数の正確性を検証するための完全なテストスイートが含まれています。本記事では、テストスイートの実行方法、カバレッジ範囲、およびカスタムテストの追加方法について説明します。

## テストスイートとは？

**テストスイート**とは、ソフトウェアの機能が正しく動作することを検証するための自動化テストスクリプトとテストケースの集合です。Everything Claude Code のテストスイートには56のテストケースが含まれており、クロスプラットフォームユーティリティ関数、パッケージマネージャー検出、Hook スクリプトをカバーし、異なるオペレーティングシステムでの正常な動作を保証します。

::: info なぜテストスイートが必要なのか？

テストスイートは、新機能の追加や既存コードの変更時に、既存の機能を誤って壊さないことを保証します。特にクロスプラットフォームの Node.js スクリプトでは、テストによって異なるオペレーティングシステム間での動作の一貫性を検証できます。

:::

---

## テストスイートの概要

テストスイートは `tests/` ディレクトリにあり、以下の構造を持っています：

```
tests/
├── lib/                          # ユーティリティライブラリテスト
│   ├── utils.test.js              # クロスプラットフォームユーティリティ関数テスト (21テスト)
│   └── package-manager.test.js    # パッケージマネージャー検出テスト (21テスト)
├── hooks/                        # Hook スクリプトテスト
│   └── hooks.test.js             # Hook スクリプトテスト (14テスト)
└── run-all.js                    # メインテストランナー
```

**テストカバレッジ範囲**：

| モジュール | テスト数 | カバー内容 |
| --- | --- | --- |
| `utils.js` | 21 | プラットフォーム検出、ディレクトリ操作、ファイル操作、日付時刻、システムコマンド |
| `package-manager.js` | 21 | パッケージマネージャー検出、コマンド生成、優先度ロジック |
| Hook スクリプト | 14 | session ライフサイクル、圧縮提案、セッション評価、hooks.json 検証 |
| **合計** | **56** | 完全な機能検証 |

---

## テストの実行

### 全テストの実行

プラグインのルートディレクトリで以下を実行します：

```bash
node tests/run-all.js
```

**期待される出力**：

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

### 単一テストファイルの実行

特定のモジュールのみをテストしたい場合は、テストファイルを個別に実行できます：

```bash
# utils.js のテスト
node tests/lib/utils.test.js

# package-manager.js のテスト
node tests/lib/package-manager.test.js

# Hook スクリプトのテスト
node tests/hooks/hooks.test.js
```

**期待される出力**（utils.test.js の例）：

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

## テストフレームワークの説明

テストスイートは、外部ライブラリに依存しないカスタムの軽量テストフレームワークを使用しています。各テストファイルには以下のコンポーネントが含まれています：

### テストヘルパー関数

```javascript
// 同期テストヘルパー関数
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

// 非同期テストヘルパー関数
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

### テストアサーション

Node.js 組み込みの `assert` モジュールを使用してアサーションを行います：

```javascript
const assert = require('assert');

// 等値アサーション
assert.strictEqual(actual, expected, 'message');

// ブールアサーション
assert.ok(condition, 'message');

// 配列/オブジェクトの包含
assert.ok(array.includes(item), 'message');

// 正規表現マッチング
assert.ok(regex.test(string), 'message');
```

---

## 各テストモジュールの詳細

### lib/utils.test.js

`scripts/lib/utils.js` のクロスプラットフォームユーティリティ関数をテストします。

**テストカテゴリ**：

| カテゴリ | テスト数 | カバー機能 |
| --- | --- | --- |
| プラットフォーム検出 | 2 | `isWindows`, `isMacOS`, `isLinux` |
| ディレクトリ関数 | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| 日付/時刻 | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| ファイル操作 | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| システム関数 | 5 | `commandExists`, `runCommand` |

**主要なテスト例**：

```javascript
// ファイル操作のテスト
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

`scripts/lib/package-manager.js` のパッケージマネージャー検出と選択ロジックをテストします。

**テストカテゴリ**：

| カテゴリ | テスト数 | カバー機能 |
| --- | --- | --- |
| パッケージマネージャー定数 | 2 | `PACKAGE_MANAGERS`、プロパティの完全性 |
| Lock file 検出 | 5 | npm, pnpm, yarn, bun の lock file 識別 |
| package.json 検出 | 4 | `packageManager` フィールドの解析 |
| 利用可能なパッケージマネージャー | 1 | システムパッケージマネージャーの検出 |
| パッケージマネージャー選択 | 3 | 環境変数、lock file、プロジェクト設定の優先度 |
| コマンド生成 | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**主要なテスト例**：

```javascript
// 検出優先度のテスト
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

Hook スクリプトの実行と設定の検証をテストします。

**テストカテゴリ**：

| カテゴリ | テスト数 | カバー機能 |
| --- | --- | --- |
| session-start.js | 2 | 実行成功、出力形式 |
| session-end.js | 2 | 実行成功、ファイル作成 |
| pre-compact.js | 3 | 実行成功、出力形式、ログ作成 |
| suggest-compact.js | 3 | 実行成功、カウンター、閾値トリガー |
| evaluate-session.js | 3 | 短いセッションのスキップ、長いセッションの処理、メッセージカウント |
| hooks.json 検証 | 4 | JSON の有効性、イベントタイプ、node プレフィックス、パス変数 |

**主要なテスト例**：

```javascript
// hooks.json 設定のテスト
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

## 新しいテストの追加

### テストファイルの作成

1. `tests/` ディレクトリに新しいテストファイルを作成
2. テストヘルパー関数を使用してテストケースをラップ
3. `assert` モジュールを使用してアサーション
4. `run-all.js` に新しいテストファイルを登録

**例**：新しいテストファイル `tests/lib/new-module.test.js` を作成

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

  // テストケース
  if (test('basic functionality', () => {
    assert.strictEqual(newModule.test(), 'expected value');
  })) passed++; else failed++;

  // サマリー
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### run-all.js への登録

`tests/run-all.js` に新しいテストファイルを追加します：

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // この行を追加
  'hooks/hooks.test.js'
];
```

---

## テストのベストプラクティス

### 1. try-finally でリソースをクリーンアップ

テストで作成した一時ファイルやディレクトリはクリーンアップする必要があります：

```javascript
✅ 正しい:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // テストロジック
  } finally {
    fs.unlinkSync(testFile);  // 確実にクリーンアップ
  }
});

❌ 間違い:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // テストが失敗するとファイルがクリーンアップされない
  fs.unlinkSync(testFile);
});
```

### 2. テスト環境の分離

各テストは一意の一時ファイル名を使用し、相互干渉を避けます：

```javascript
✅ 正しい:
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ 間違い:
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. 説明的なテスト名を使用

テスト名はテストの内容を明確に説明する必要があります：

```javascript
✅ 正しい:
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ 間違い:
test('test1', () => { ... });
```

### 4. 境界条件のテスト

正常なケースだけでなく、境界条件やエラーケースもテストします：

```javascript
// 正常なケースのテスト
test('detects npm from package-lock.json', () => { ... });

// 空のディレクトリのテスト
test('returns null when no lock file exists', () => { ... });

// 複数の lock ファイルのテスト
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. 入力の安全性を検証

入力を受け付ける関数については、テストで安全性を検証します：

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## よくある質問

### テストが失敗した場合はどうすればよいですか？

1. 具体的なエラーメッセージを確認
2. テストロジックが正しいか確認
3. テスト対象の関数にバグがないか検証
4. 異なるオペレーティングシステムでテストを実行（クロスプラットフォーム互換性）

### テストファイルが `Passed: X Failed: Y` を出力した後に改行があるのはなぜですか？

これは `run-all.js` の結果解析との互換性のためです。テストファイルは特定の形式で出力する必要があります：

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### 他のテストフレームワークを使用できますか？

はい、ただし `run-all.js` を新しいフレームワークの出力形式に対応するよう修正する必要があります。現在使用しているのはカスタムの軽量フレームワークで、シンプルなテストシナリオに適しています。

---

## このレッスンのまとめ

テストスイートは Everything Claude Code の品質保証の重要な構成要素です。テストを実行することで、以下を確認できます：

- ✅ クロスプラットフォームユーティリティ関数が異なるオペレーティングシステムで正常に動作
- ✅ パッケージマネージャー検出ロジックがすべての優先度を正しく処理
- ✅ Hook スクリプトがファイルを正しく作成・更新
- ✅ 設定ファイルの形式が正しく完全

**テストスイートの特徴**：
- 軽量：外部依存なし
- 完全なカバレッジ：56のテストケース
- クロスプラットフォーム：Windows、macOS、Linux をサポート
- 拡張が容易：新しいテストの追加は数行のコードで可能

---

## 次のレッスンの予告

> 次のレッスンでは **[コントリビューションガイド](../contributing/)** を学びます。
>
> 学習内容：
> - プロジェクトに設定、agent、skill をコントリビュートする方法
> - コードコントリビューションのベストプラクティス
> - Pull Request を提出するプロセス

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| テストランナー | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| utils テスト | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
| hooks テスト | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| utils モジュール | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |

**主要な関数**：

**run-all.js**：
- `execSync()`：子プロセスを実行して出力を取得（8行目）
- テストファイル配列：`testFiles` がすべてのテストファイルパスを定義（13-17行目）
- 結果解析：出力から `Passed` と `Failed` のカウントを抽出（46-62行目）

**テストヘルパー関数**：
- `test()`：同期テストラッパー、例外をキャッチして結果を出力
- `asyncTest()`：非同期テストラッパー、Promise テストをサポート

**utils.js**：
- プラットフォーム検出：`isWindows`, `isMacOS`, `isLinux`（12-14行目）
- ディレクトリ関数：`getHomeDir()`, `getClaudeDir()`, `getSessionsDir()`（19-35行目）
- ファイル操作：`readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()`（200-343行目）
- システム関数：`commandExists()`, `runCommand()`（228-269行目）

**package-manager.js**：
- `PACKAGE_MANAGERS`：パッケージマネージャー設定定数（13-54行目）
- `DETECTION_PRIORITY`：検出優先度順序（57行目）
- `getPackageManager()`：優先度に基づいてパッケージマネージャーを選択（157-236行目）
- `getRunCommand()`：スクリプト実行コマンドを生成（279-294行目）
- `getExecCommand()`：パッケージ実行コマンドを生成（301-304行目）

</details>
