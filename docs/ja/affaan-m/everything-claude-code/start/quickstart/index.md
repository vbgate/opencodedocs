---
title: "クイックスタート: プラグインインストール | everything-claude-code"
sidebarTitle: "5分で始める"
subtitle: "クイックスタート: everything-claude-code プラグインのインストール"
description: "everything-claude-codeのインストール方法と主要機能を学びます。5分間でプラグインをインストールし、/plan、/tdd、/code-reviewコマンドを使って開発効率を向上させます。"
tags:
  - "quickstart"
  - "installation"
  - "getting-started"
prerequisite: []
order: 10
---

# クイックスタート：5分で始める Everything Claude Code

## このコースでできること

**Everything Claude Code** は、専門的な agents、commands、rules、hooks を提供する Claude Code プラグインで、コード品質と開発効率の向上を支援します。このチュートリアルで以下のことができるようになります：

- ✅ 5分以内で Everything Claude Code をインストール
- ✅ `/plan` コマンドを使って実装計画を作成
- ✅ `/tdd` コマンドでテスト駆動開発を実行
- ✅ `/code-review` でコードレビューを行う
- ✅ プラグインのコアコンポーネントを理解する

## 今の課題

Claude Code をより強力にしたいですが、次のような問題に直面していませんか：

- ❌ 毎回コーディング規約やベストプラクティスを繰り返し説明する
- ❌ テストカバレッジが低く、バグが頻発する
- ❌ コードレビューでセキュリティ問題を見落とす
- ❌ TDD を始めたいが方法がわからない
- ❅ 特定のタスクを処理する専門的なエージェントが必要

**Everything Claude Code** がこれらの問題を解決します：
- 9つの専門化された agents（planner、tdd-guide、code-reviewer、security-reviewer など）
- 14個のスラッシュコマンド（/plan、/tdd、/code-review など）
- 8種類の強制ルール（security、coding-style、testing など）
- 15以上の自動化フック
- 11個のワークフロースキル

## コアコンセプト

**Everything Claude Code** は以下を提供する Claude Code プラグインです：
- **Agents**：特定領域のタスクを処理する専門的なサブエージェント（TDD、コードレビュー、セキュリティ監査など）
- **Commands**：ワークフローを素早く開始するスラッシュコマンド（`/plan`、`/tdd` など）
- **Rules**：コード品質とセキュリティを確保する強制ルール（80%以上のカバレッジ、console.log の禁止など）
- **Skills**：ベストプラクティスを再利用するワークフロー定義
- **Hooks**：特定イベント時にトリガーされる自動化フック（セッション永続化、console.log 警告など）

::: tip Claude Code プラグインとは？
Claude Code プラグインは、VS Code プラグインがエディタの機能を拡張するのと同様に、Claude Code の機能を拡張します。インストール後、プラグインが提供するすべての agents、commands、skills、hooks を使用できます。
:::

## 🎒 事前準備

**必要なもの**：
- Claude Code がインストール済み
- ターミナルコマンドの基本知識
- テスト用のプロジェクトディレクトリ

**不要なもの**：
- 特定のプログラミング言語の知識は不要
- 事前設定は不要

---

## 実践：5分でインストール

### ステップ1：Claude Code を開く

Claude Code を起動し、プロジェクトディレクトリを開きます。

**期待される結果**：Claude Code のコマンドラインインターフェースが準備完了状態。

---

### ステップ2：Marketplace を追加

Claude Code で次のコマンドを実行して marketplace を追加します：

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**理由**
Everything Claude Code を Claude Code のプラグインソースとして追加すると、そこからプラグインをインストールできます。

**期待される結果**：
```
✓ Successfully added marketplace: everything-claude-code
```

---

### ステップ3：プラグインをインストール

次のコマンドを実行してプラグインをインストールします：

```bash
/plugin install everything-claude-code@everything-claude-code
```

**理由**
Everything Claude Code プラグインをインストールすると、提供されるすべての機能を使用できるようになります。

**期待される結果**：
```
✓ Successfully installed plugin: everything-claude-code@everything-claude-code
```

---

### ステップ4：インストールを確認

次のコマンドを実行してインストール済みのプラグインを確認します：

```bash
/plugin list
```

**期待される結果**：
```
Installed Plugins:
  everything-claude-code@everything-claude-code
```

✅ インストール完了！

---

## 実践：コア機能を体験

### ステップ5：/plan で実装計画を作成

ユーザー認証機能を追加すると仮定して、次を実行します：

```bash
/plan I need to add user authentication with email and password
```

**理由**
planner agent を使用して詳細な実装計画を作成し、重要な手順の見落としを防ぎます。

**期待される結果**：
```
# Implementation Plan: User Authentication with Email and Password

## Requirements Restatement
- User registration with email and password
- User login with email and password
- Password hashing with bcrypt
- JWT token generation
- Session management

## Implementation Phases
[詳細な実装ステップ...]

## Risks
- HIGH: Password security (use bcrypt, salt rounds)
- MEDIUM: JWT token expiration
- LOW: Email uniqueness validation

## Estimated Complexity: MEDIUM
**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

`yes` と入力して計画を確認すると、planner が実装を開始します。

---

### ステップ6：/tdd でテスト駆動開発

機能を実装する際、次を実行します：

```bash
/tdd I need to implement a function to validate email format
```

**理由**
tdd-guide agent を使用して TDD プロセスを強制し、先にテストを書いてからコードを実装し、80%以上のカバレッジを達成します。

**期待される結果**：
```
# TDD Session: Email Format Validator

## Step 1: Define Interface (SCAFFOLD)
```typescript
// lib/email-validator.ts
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmail(email: string): ValidationResult {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)
[テストコード...]

## Step 3: Run Tests - Verify FAIL
[テスト失敗...]

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)
[実装コード...]

## Step 5: Run Tests - Verify PASS
[テスト成功...]

## Step 6: Refactor (IMPROVE)
[リファクタリングコード...]

## Step 7: Verify Tests Still Pass
[テストがまだ成功...]

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)

✅ TDD session complete!
```

---

### ステップ7：/code-review でコードレビュー

コードをコミットする前に、次を実行します：

```bash
/code-review
```

**理由**
code-reviewer agent を使用してコード品質、セキュリティ、ベストプラクティスをチェックします。

**期待される結果**：
```
# Code Review Report

## Overview
- Files reviewed: 3
- Total lines: 150
- Issues found: 2

## Issues Found

### 1. [CRITICAL] Hardcoded JWT Secret
**Location**: `lib/auth.ts:15`
**Issue**: JWT secret is hardcoded in source code
**Fix**: Move to environment variable
**Impact**: Security vulnerability - secret exposed in code

### 2. [MEDIUM] Missing Error Handling
**Location**: `lib/email-validator.ts:23`
**Issue**: No error handling for null/undefined input
**Fix**: Add null check at function start
**Impact**: Potential runtime errors

## Recommendations
✓ Tests are well written
✓ Code is readable
✓ Follows TypeScript best practices

**Action Required**: Fix CRITICAL issues before commit.
```

問題を修正した後、再度 `/code-review` を実行してすべての問題が解決されたことを確認します。

---

## チェックポイント ✅

次の手順が正常に完了したことを確認してください：

- [ ] marketplace の追加に成功
- [ ] everything-claude-code プラグインのインストールに成功
- [ ] `/plan` で実装計画を作成した
- [ ] `/tdd` で TDD 開発を行った
- [ ] `/code-review` でコードレビューを行った

問題が発生した場合は、[よくあるトラブルシューティング](../../faq/troubleshooting-hooks/) または [MCP 接続の失敗](../../faq/troubleshooting-mcp/) を確認してください。

---

## 注意点

::: warning インストール失敗
`/plugin marketplace add` が失敗する場合、以下を確認してください：
1. Claude Code の最新版を使用している
2. ネットワーク接続が正常
3. GitHub へのアクセスが正常（プロキシが必要な場合あり）
:::

::: warning コマンドが使用不可
`/plan` や `/tdd` コマンドが使用できない場合：
1. `/plugin list` を実行してプラグインがインストールされているか確認
2. プラグインのステータスが有効になっているか確認
3. Claude Code を再起動
:::

::: tip Windows ユーザー
Everything Claude Code は Windows を完全にサポートしています。すべての hooks とスクリプトは Node.js で書き直されており、クロスプラットフォーム互換性が確保されています。
:::

---

## まとめ

✅ このコースで以下のことができるようになりました：
1. Everything Claude Code プラグインのインストールに成功
2. コアコンセプトを理解：agents、commands、rules、skills、hooks
3. `/plan`、`/tdd`、`code-review` 3つのコアコマンドを体験
4. 基本的な TDD 開発フローを習得

**覚えておくべきこと**：
- Agents は特定のタスクを処理する専門的なサブエージェント
- Commands はワークフローを素早く開始するエントリーポイント
- Rules はコード品質とセキュリティを確保する強制ルール
- 共感のある機能から始めて、徐々に拡張する
- すべての MCP を有効にせず、10個未満に保つ

---

## 次回の予告

> 次回は **[インストールガイド：マーケットプレース vs 手動インストール](../installation/)** を学びます。
>
> 学ぶこと：
> - マーケットプレースインストールの詳細な手順
> - 手動インストールの完全なプロセス
> - 必要なコンポーネントのみをコピーする方法
> - MCP サーバーの設定方法

学習を継続して、Everything Claude Code の完全なインストールと設定について理解を深めましょう。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-25

| 機能          | ファイルパス                                                                                    | 行番号  |
|--- | --- | ---|
| プラグインマニフェスト       | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28  |
| Marketplace 設定 | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45  |
| インストール手順       | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                        | 175-242 |
| /plan コマンド      | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114 |
| /tdd コマンド      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)            | 1-327 |
|--- | --- | ---|

**重要な定数**：
- プラグイン名: `everything-claude-code`
- Marketplace リポジトリ: `affaan-m/everything-claude-code`

**重要なファイル**：
- `plugin.json`: プラグインメタデータとコンポーネントパス
- `commands/*.md`: 14個のスラッシュコマンド定義
- `agents/*.md`: 9個の専門化されたサブエージェント
- `rules/*.md`: 8種類の強制ルール
- `hooks/hooks.json`: 15以上の自動化フック設定

</details>
