---
title: "Rules: 8つのルールセット詳解 | everything-claude-code"
sidebarTitle: "8つのルール早見表"
subtitle: "Rules: 8つのルールセット詳解 | everything-claude-code"
description: "everything-claude-code の8つのルールセットを学びます。セキュリティ、コーディングスタイル、テスト、Git ワークフロー、パフォーマンス最適化、Agent 活用、デザインパターン、Hooks システムを網羅。"
tags:
  - "rules"
  - "security"
  - "coding-style"
  - "testing"
  - "git-workflow"
  - "performance"
prerequisite:
  - "start-quickstart"
order: 200
---

# Rules 完全リファレンス：8つのルールセット詳解

## このレッスンで習得できること

- 8つの必須ルールセットを素早く検索・理解できる
- 開発プロセスでセキュリティ、コーディングスタイル、テストなどの規範を正しく適用できる
- どの Agent がルール遵守をサポートするか把握できる
- パフォーマンス最適化戦略と Hooks システムの仕組みを理解できる

## 現在の課題

プロジェクトの8つのルールセットに直面すると、以下のような疑問が生じるかもしれません：

- **すべてのルールを覚えきれない**：security、coding-style、testing、git-workflow... どれが必須なのか？
- **適用方法がわからない**：イミュータブルパターンや TDD フローが言及されているが、具体的にどう実践するのか？
- **誰に助けを求めればいいかわからない**：セキュリティ問題にはどの Agent を使う？コードレビューは誰に頼む？
- **パフォーマンスとセキュリティのトレードオフ**：コード品質を保ちながら、開発効率をどう最適化するか？

このリファレンスドキュメントは、各ルールセットの内容、適用シーン、対応する Agent ツールを包括的に解説します。

---

## Rules 概要

Everything Claude Code には8つの必須ルールセットが含まれており、それぞれ明確な目標と適用シーンがあります：

| ルールセット | 目標 | 優先度 | 対応 Agent |
| --- | --- | --- | --- |
| **Security** | セキュリティ脆弱性・機密データ漏洩の防止 | P0 | security-reviewer |
| **Coding Style** | 可読性の高いコード、イミュータブルパターン、小さなファイル | P0 | code-reviewer |
| **Testing** | 80%以上のテストカバレッジ、TDD フロー | P0 | tdd-guide |
| **Git Workflow** | コミット規約、PR フロー | P1 | code-reviewer |
| **Agents** | サブエージェントの正しい使用 | P1 | N/A |
| **Performance** | Token 最適化、コンテキスト管理 | P1 | N/A |
| **Patterns** | デザインパターン、アーキテクチャのベストプラクティス | P2 | architect |
| **Hooks** | Hooks の理解と活用 | P2 | N/A |

::: info ルール優先度について

- **P0（クリティカル）**：厳守必須。違反するとセキュリティリスクやコード品質の深刻な低下を招く
- **P1（重要）**：遵守すべき。開発効率とチームコラボレーションに影響
- **P2（推奨）**：遵守を推奨。コードアーキテクチャと保守性を向上
:::

---

## 1. Security（セキュリティルール）

### 必須セキュリティチェック

**コミット前**に、以下のチェックを必ず完了してください：

- [ ] ハードコードされた秘密情報がない（API キー、パスワード、トークン）
- [ ] すべてのユーザー入力が検証済み
- [ ] SQL インジェクション対策（パラメータ化クエリ）
- [ ] XSS 対策（HTML サニタイズ）
- [ ] CSRF 保護が有効
- [ ] 認証・認可が検証済み
- [ ] すべてのエンドポイントにレート制限あり
- [ ] エラーメッセージが機密データを漏洩しない

### 秘密情報の管理

**❌ 悪い例**：ハードコードされた秘密情報

```typescript
const apiKey = "sk-proj-xxxxx"
```

**✅ 良い例**：環境変数を使用

```typescript
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### セキュリティ対応プロトコル

セキュリティ問題を発見した場合：

1. **即座に作業を停止**
2. **security-reviewer** agent で包括的な分析を実行
3. 続行前に CRITICAL な問題を修正
4. 漏洩した秘密情報をローテーション
5. コードベース全体で類似の問題がないか確認

::: tip セキュリティ Agent の使用

`/code-review` コマンドを使用すると、security-reviewer チェックが自動的にトリガーされ、コードがセキュリティ規範に準拠していることを確認できます。
:::

---

## 2. Coding Style（コーディングスタイルルール）

### イミュータビリティ（CRITICAL）

**常に新しいオブジェクトを作成し、既存のオブジェクトを変更しない**：

**❌ 悪い例**：オブジェクトを直接変更

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ 良い例**：新しいオブジェクトを作成

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### ファイル構成

**多数の小さなファイル > 少数の大きなファイル**：

- **高凝集・低結合**
- **典型的には 200-400 行、最大 800 行**
- 大きなコンポーネントからユーティリティ関数を抽出
- 型ではなく機能/ドメインで整理

### エラーハンドリング

**常に包括的なエラー処理を行う**：

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### 入力バリデーション

**常にユーザー入力を検証する**：

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### コード品質チェックリスト

作業完了とマークする前に、以下を確認：

- [ ] コードが読みやすく、命名が明確
- [ ] 関数が小さい（< 50 行）
- [ ] ファイルが焦点を絞っている（< 800 行）
- [ ] 深いネストがない（> 4 レベル）
- [ ] 適切なエラーハンドリング
- [ ] console.log 文がない
- [ ] ハードコードされた値がない
- [ ] 直接変更がない（イミュータブルパターンを使用）

---

## 3. Testing（テストルール）

### 最低テストカバレッジ：80%

**すべてのテストタイプを含める必要あり**：

1. **ユニットテスト** - 独立した関数、ユーティリティ関数、コンポーネント
2. **インテグレーションテスト** - API エンドポイント、データベース操作
3. **E2E テスト** - 重要なユーザーフロー（Playwright）

### テスト駆動開発（TDD）

**必須ワークフロー**：

1. 先にテストを書く（RED）
2. テストを実行 - 失敗するはず
3. 最小限の実装を書く（GREEN）
4. テストを実行 - パスするはず
5. リファクタリング（IMPROVE）
6. カバレッジを検証（80%以上）

### テストのトラブルシューティング

1. **tdd-guide** agent を使用
2. テストの分離性を確認
3. モックが正しいか検証
4. テストではなく実装を修正（テスト自体が間違っている場合を除く）

### Agent サポート

- **tdd-guide** - 新機能開発時に積極的に使用、テストファーストを強制
- **e2e-runner** - Playwright E2E テストのエキスパート

::: tip TDD コマンドの使用

`/tdd` コマンドを使用すると、tdd-guide agent が自動的に呼び出され、完全な TDD フローをガイドします。
:::

---

## 4. Git Workflow（Git ワークフロールール）

### コミットメッセージ形式

```
<type>: <description>

<optional body>
```

**タイプ**：feat、fix、refactor、docs、test、chore、perf、ci

::: info コミットメッセージについて

コミットメッセージの attribution は `~/.claude/settings.json` でグローバルに無効化されています。
:::

### Pull Request ワークフロー

PR 作成時：

1. 完全なコミット履歴を分析（最新のコミットだけでなく）
2. `git diff [base-branch]...HEAD` ですべての変更を確認
3. 包括的な PR サマリーを作成
4. テスト計画と TODO を含める
5. 新しいブランチの場合は `-u` フラグでプッシュ

### 機能実装ワークフロー

#### 1. 計画優先

- **planner** agent で実装計画を作成
- 依存関係とリスクを特定
- 複数のフェーズに分解

#### 2. TDD アプローチ

- **tdd-guide** agent を使用
- 先にテストを書く（RED）
- テストをパスする実装（GREEN）
- リファクタリング（IMPROVE）
- 80%以上のカバレッジを検証

#### 3. コードレビュー

- コード作成後すぐに **code-reviewer** agent を使用
- CRITICAL と HIGH の問題を修正
- 可能な限り MEDIUM の問題も修正

#### 4. コミットとプッシュ

- 詳細なコミットメッセージ
- conventional commits 形式に従う

---

## 5. Agents（Agent ルール）

### 利用可能な Agents

`~/.claude/agents/` に配置：

| Agent | 用途 | 使用タイミング |
| --- | --- | --- |
| planner | 実装計画 | 複雑な機能、リファクタリング |
| architect | システム設計 | アーキテクチャ決定 |
| tdd-guide | テスト駆動開発 | 新機能、バグ修正 |
| code-reviewer | コードレビュー | コード作成後 |
| security-reviewer | セキュリティ分析 | コミット前 |
| build-error-resolver | ビルドエラー修正 | ビルド失敗時 |
| e2e-runner | E2E テスト | 重要なユーザーフロー |
| refactor-cleaner | デッドコード削除 | コードメンテナンス |
| doc-updater | ドキュメント更新 | ドキュメント更新時 |

### Agent の即時使用

**ユーザーの指示を待たずに**：

1. 複雑な機能リクエスト - **planner** agent を使用
2. コードを書いた/修正した直後 - **code-reviewer** agent を使用
3. バグ修正や新機能 - **tdd-guide** agent を使用
4. アーキテクチャ決定 - **architect** agent を使用

### 並列タスク実行

**独立した操作には常に並列タスク実行を使用**：

| 方式 | 説明 |
| --- | --- |
| ✅ 良い：並列実行 | 3つの agents を並列起動：Agent 1（auth.ts セキュリティ分析）、Agent 2（キャッシュシステムパフォーマンスレビュー）、Agent 3（utils.ts 型チェック） |
| ❌ 悪い：順次実行 | 先に agent 1、次に agent 2、次に agent 3 |

### 多角的分析

複雑な問題には、役割別のサブエージェントを使用：

- ファクトチェッカー
- シニアエンジニア
- セキュリティエキスパート
- 一貫性レビュアー
- 冗長性チェッカー

---

## 6. Performance（パフォーマンス最適化ルール）

### モデル選択戦略

**Haiku 4.5**（Sonnet の 90% の能力、3倍のコスト削減）：

- 軽量 agent、頻繁な呼び出し
- ペアプログラミングとコード生成
- マルチエージェントシステムの worker agents

**Sonnet 4.5**（最高のコーディングモデル）：

- 主要な開発作業
- マルチエージェントワークフローの調整
- 複雑なコーディングタスク

**Opus 4.5**（最も深い推論）：

- 複雑なアーキテクチャ決定
- 最大限の推論が必要な場合
- リサーチと分析タスク

### コンテキストウィンドウ管理

**コンテキストウィンドウの最後の 20% の使用を避ける**：

- 大規模リファクタリング
- 複数ファイルにまたがる機能実装
- 複雑なインタラクションのデバッグ

**低コンテキスト感度タスク**：

- 単一ファイル編集
- 独立したツール作成
- ドキュメント更新
- シンプルなバグ修正

### Ultrathink + Plan Mode

深い推論が必要な複雑なタスクには：

1. `ultrathink` で強化された思考を使用
2. **Plan Mode** を有効にして構造化されたアプローチを取得
3. 「エンジンを再起動」して複数ラウンドの批評を実施
4. 役割別サブエージェントで多様な分析を実行

### ビルドのトラブルシューティング

ビルドが失敗した場合：

1. **build-error-resolver** agent を使用
2. エラーメッセージを分析
3. 段階的に修正
4. 各修正後に検証

---

## 7. Patterns（共通パターンルール）

### API レスポンス形式

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### カスタム Hooks パターン

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Repository パターン

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### スケルトンプロジェクト

新機能を実装する際：

1. 実績のあるスケルトンプロジェクトを検索
2. 並列 agents でオプションを評価：
   - セキュリティ評価
   - スケーラビリティ分析
   - 関連性スコアリング
   - 実装計画
3. 最適なマッチをベースとしてクローン
4. 検証済みの構造内でイテレーション

---

## 8. Hooks（Hooks システムルール）

### Hook タイプ

- **PreToolUse**：ツール実行前（バリデーション、パラメータ変更）
- **PostToolUse**：ツール実行後（自動フォーマット、チェック）
- **Stop**：セッション終了時（最終検証）

### 現在の Hooks（~/.claude/settings.json 内）

#### PreToolUse

- **tmux リマインダー**：長時間実行コマンドに tmux の使用を提案（npm、pnpm、yarn、cargo など）
- **git push レビュー**：プッシュ前に Zed でレビューを開く
- **ドキュメントブロッカー**：不要な .md/.txt ファイルの作成をブロック

#### PostToolUse

- **PR 作成**：PR URL と GitHub Actions ステータスを記録
- **Prettier**：編集後に JS/TS ファイルを自動フォーマット
- **TypeScript チェック**：.ts/.tsx ファイル編集後に tsc を実行
- **console.log 警告**：編集ファイル内の console.log を警告

#### Stop

- **console.log 監査**：セッション終了前にすべての変更ファイルで console.log をチェック

### 自動承認権限

**慎重に使用**：

- 信頼できる、明確に定義された計画に対して有効化
- 探索的な作業時は無効化
- dangerously-skip-permissions フラグは絶対に使用しない
- 代わりに `~/.claude.json` で `allowedTools` を設定

### TodoWrite ベストプラクティス

TodoWrite ツールの用途：

- マルチステップタスクの進捗追跡
- 指示の理解を検証
- リアルタイムガイダンスを有効化
- 細粒度の実装ステップを表示

Todo リストで明らかになること：

- 順序が間違っているステップ
- 欠落している項目
- 不要な追加項目
- 粒度の誤り
- 誤解された要件

---

## 次のレッスン予告

> 次のレッスンでは **[Skills 完全リファレンス](../skills-reference/)** を学びます。
>
> 学習内容：
> - 11 のスキルライブラリの完全リファレンス
> - コーディング標準、バックエンド/フロントエンドパターン、継続的学習などのスキル
> - 異なるタスクに適したスキルの選び方

---

## このレッスンのまとめ

Everything Claude Code の8つのルールセットは、開発プロセスに包括的なガイダンスを提供します：

1. **Security** - セキュリティ脆弱性と機密データ漏洩を防止
2. **Coding Style** - 可読性、イミュータビリティ、小さなファイルを確保
3. **Testing** - 80%以上のカバレッジと TDD フローを強制
4. **Git Workflow** - コミットと PR フローを規範化
5. **Agents** - 9つの専門サブエージェントの正しい使用をガイド
6. **Performance** - Token 使用とコンテキスト管理を最適化
7. **Patterns** - 共通のデザインパターンとベストプラクティスを提供
8. **Hooks** - 自動化フックシステムの仕組みを解説

これらのルールは制約ではなく、高品質で安全、保守性の高いコードを書くためのガイドです。対応する Agents（code-reviewer、security-reviewer など）を使用することで、これらのルールを自動的に遵守できます。

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Security ルール | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Coding Style ルール | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Testing ルール | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Git Workflow ルール | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Agents ルール | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Performance ルール | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Patterns ルール | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks ルール | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |

**重要なルール**：
- **Security**: ハードコードされた秘密情報禁止、OWASP Top 10 チェック
- **Coding Style**: イミュータブルパターン、ファイル < 800 行、関数 < 50 行
- **Testing**: 80%以上のテストカバレッジ、TDD フロー必須
- **Performance**: モデル選択戦略、コンテキストウィンドウ管理

**関連 Agents**：
- **security-reviewer**: セキュリティ脆弱性検出
- **code-reviewer**: コード品質とスタイルレビュー
- **tdd-guide**: TDD フローガイダンス
- **planner**: 実装計画

</details>
