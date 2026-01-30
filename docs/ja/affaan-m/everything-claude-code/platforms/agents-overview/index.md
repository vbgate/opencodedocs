---
title: "エージェント：9つの専門化エージェント | Everything Claude Code"
sidebarTitle: "適切なエージェントで効率倍増"
subtitle: "エージェント：9つの専門化エージェント | Everything Claude Code"
description: "Everything Claude Codeの9つの専門化エージェントを学び、異なるシナリオでの呼び出し方法をマスターし、AI支援開発の効率と品質を向上させます。"
tags:
  - "agents"
  - "ai-assistant"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 60
---

# コアエージェント詳細解説：9つの専門化サブエージェント

## 学習後のゴール

- 9つの専門化エージェントの役割と使用シナリオを理解する
- 異なる開発タスクでどのエージェントを呼び出すべきかを知る
- エージェント間の協力方法をマスターし、効率的な開発フローを構築する
- 「汎用AI」の制限を回避し、専門化エージェントを活用して効率を向上させる

## 現在の課題

- しばしばClaudeにタスクを依頼するが、回答が十分に専門的または深みを欠いている
- いつ`/plan`、`/tdd`、`/code-review`などのコマンドを使用すべきか不確かである
- AIの提案があまり一般的すぎて、的確さに欠けると感じる
- システム化された開発ワークフローが欲しいが、整理方法がわからない

## このテクニックを使用すべきタイミング

以下のタスクを完了する必要がある場合、このチュートリアルが役立ちます：
- 複雑な機能開発前の計画
- 新機能の実装やバグ修正
- コードレビューとセキュリティ監査
- ビルドエラーの修正
- エンドツーエンドテスト
- コードリファクタリングとクリーンアップ
- ドキュメント更新

## コア概念

Everything Claude Codeは9つの専門化エージェントを提供しており、各エージェントは特定の分野に特化しています。実際のチームで異なる役割の専門家を探すように、異なる開発タスクには異なるエージェントを呼び出すべきです。

::: info エージェント vs コマンド
- **エージェント**：特定の分野の知識とツールを持つ専門的なAIアシスタント
- **コマンド**：エージェントを素早く呼び出したり、特定の操作を実行したりするためのショートカット

例：`/tdd`コマンドは`tdd-guide`エージェントを呼び出してテスト駆動開発フローを実行します。
:::

### 9つのエージェント概要

| エージェント | 役割 | 典型的なシナリオ | 主要な能力 |
|--- | --- | --- | ---|
| **planner** | 計画エキスパート | 複雑な機能開発前の計画作成 | 要件分析、アーキテクチャレビュー、ステップ分解 |
| **architect** | アーキテクト | システム設計と技術意思決定 | アーキテクチャ評価、パターン推奨、トレードオフ分析 |
| **tdd-guide** | TDDガイド | テストの記述と機能の実装 | Red-Green-Refactorフロー、カバレッジ保証 |
| **code-reviewer** | コードレビュアー | コード品質のレビュー | 品質、セキュリティ、保守性のチェック |
| **security-reviewer** | セキュリティ監査員 | セキュリティ脆弱性の検出 | OWASP Top 10、キー漏洩、インジェクション対策 |
| **build-error-resolver** | ビルドエラー修正師 | TypeScript/ビルドエラーの修正 | 最小限の修正、型推論 |
| **e2e-runner** | E2Eテストエキスパート | エンドツーエンドテスト管理 | Playwrightテスト、flaky管理、アーティファクト |
| **refactor-cleaner** | リファクタリングクリーナー | デッドコードと重複の削除 | 依存関係分析、安全な削除、ドキュメント化 |
| **doc-updater** | ドキュメント更新師 | ドキュメントの生成と更新 | codemap生成、AST分析 |

## 詳細紹介

### 1. Planner - 計画エキスパート

**使用タイミング**：複雑な機能の実装、アーキテクチャの変更、大規模なリファクタリングが必要な場合。

::: tip ベストプラクティス
コードを書き始める前に、まず`/plan`で実装計画を作成します。これにより、依存関係の見落としを防ぎ、潜在的なリスクを発見し、合理的な実装順序を策定できます。
:::

**主要な能力**：
- 要件分析と明確化
- アーキテクチャレビューと依存関係の特定
- 詳細な実装ステップの分解
- リスクの特定と軽減策
- テスト戦略の計画

**出力形式**：
```markdown
# 実装計画：[機能名]

## 概要
[2-3文の要約]

## 要件
- [要件1]
- [要件2]

## アーキテクチャの変更
- [変更1：ファイルパスと説明]
- [変更2：ファイルパスと説明]

## 実装ステップ

### フェーズ1：[フェーズ名]
1. **[ステップ名]** (ファイル: path/to/file.ts)
   - アクション：具体的な操作
   - 理由：理由
   - 依存関係：なし / ステップXを必要とする
   - リスク：低/中/高

## テスト戦略
- ユニットテスト：[テストするファイル]
- 統合テスト：[テストするフロー]
- E2Eテスト：[テストするユーザージャーニー]

## リスクと軽減策
- **リスク**：[説明]
  - 軽減策：[解決方法]

## 成功基準
- [ ] 基準1
- [ ] 基準2
```

**シナリオの例**：
- 新しいAPIエンドポイントの追加（データベース移行、キャッシュ更新、ドキュメントが必要）
- コアモジュールのリファクタリング（複数の依存関係に影響）
- 新機能の追加（フロントエンド、バックエンド、データベースが関与）

### 2. Architect - アーキテクト

**使用タイミング**：システムアーキテクチャの設計、技術ソリューションの評価、アーキテクチャ意思決定を行う必要がある場合。

**主要な能力**：
- システムアーキテクチャ設計
- 技術トレードオフ分析
- デザインパターンの推奨
- 拡張性の計画
- セキュリティ考慮事項

**アーキテクチャ原則**：
- **モジュール化**：単一責任、高凝集低結合
- **拡張性**：水平スケーリング、ステートレス設計
- **保守性**：明確な構造、一貫したパターン
- **セキュリティ**：防御の深さ、最小権限
- **パフォーマンス**：効率的なアルゴリズム、最小限のネットワークリクエスト

**一般的なパターン**：

**フロントエンドパターン**：
- コンポーネント合成、Container/Presenterパターン、カスタムフック、Contextグローバル状態、コード分割

**バックエンドパターン**：
- Repositoryパターン、Service層、ミドルウェアパターン、イベントドリブンアーキテクチャ、CQRS

**データパターン**：
- 正規化データベース、読み取りパフォーマンスのための非正規化、イベントソーシング、キャッシュ層、結果整合性

**アーキテクチャ意思決定記録（ADR）形式**：
```markdown
# ADR-001: Redisを使用してセマンティック検索ベクトルを格納

## コンテキスト
セマンティックマーケット検索のために1536次元の埋め込みベクトルを格納およびクエリする必要があります。

## 意思決定
Redis Stackのベクトル検索機能を使用します。

## 影響

### ポジティブ
- 高速なベクトル類似性検索（<10ms）
- 組み込みのKNNアルゴリズム
- デプロイが簡単
- 良好なパフォーマンス（10Kベクトルまで）

### ネガティブ
- メモリストレージ（大規模データセットのコストが高い）
- 単一障害点（クラスターなし）
- コサイン類似度のみをサポート

### 検討された代替案
- **PostgreSQL pgvector**：遅いが、永続ストレージ
- **Pinecone**：管理サービス、コストが高い
- **Weaviate**：機能が豊富、セットアップが複雑

## ステータス
採用

## 日付
2025-01-15
```

### 3. TDD Guide - TDDガイド

**使用タイミング**：新機能の実装、バグ修正、コードリファクタリングを行う場合。

::: warning コア原則
TDDガイドはすべてのコードを**先にテストを書き**、その後に機能を実装することを要求し、80%以上のテストカバレッジを保証します。
:::

**TDDワークフロー**：

**ステップ1：先にテストを書く（RED）**
```typescript
describe('searchMarkets', () => {
  it('returns semantically similar markets', async () => {
    const results = await searchMarkets('election')

    expect(results).toHaveLength(5)
    expect(results[0].name).toContain('Trump')
    expect(results[1].name).toContain('Biden')
  })
})
```

**ステップ2：テストを実行（失敗を確認）**
```bash
npm test
# テストは失敗するはず - まだ実装していないため
```

**ステップ3：最小限の実装を書く（GREEN）**
```typescript
export async function searchMarkets(query: string) {
  const embedding = await generateEmbedding(query)
  const results = await vectorSearch(embedding)
  return results
}
```

**ステップ4：テストを実行（成功を確認）**
```bash
npm test
# テストは成功するはず
```

**ステップ5：リファクタリング（IMPROVE）**
- 重複コードの削除
- 命名の改善
- パフォーマンスの最適化
- 可読性の向上

**ステップ6：カバレッジの確認**
```bash
npm run test:coverage
# 80%以上のカバレッジを確認
```

**必須のテストタイプ**：

1. **ユニットテスト**（必須）：独立した関数をテスト
2. **統合テスト**（必須）：APIエンドポイントとデータベース操作をテスト
3. **E2Eテスト**（重要なフロー）：完全なユーザージャーニーをテスト

**必須のエッジケース**：
- Null/Undefined：入力がnullの場合どうするか？
- 空：配列/文字列が空の場合どうするか？
- 無効な型：間違った型を渡した場合どうするか？
- 境界：最小/最大値
- エラー：ネットワークエラー、データベースエラー
- 競合状態：同時操作
- 大規模データ：10k項目以上のパフォーマンス
- 特殊文字：Unicode、絵文字、SQL文字

### 4. Code Reviewer - コードレビュアー

**使用タイミング**：コードを記述または変更した直後に、直ちにレビューを行う場合。

::: tip 強制使用
コードレビュアーは**必須**のエージェントであり、すべてのコード変更はそのレビューを通過する必要があります。
:::

**レビューチェックリスト**：

**セキュリティチェック（CRITICAL）**：
- ハードコードされた認証情報（APIキー、パスワード、トークン）
- SQLインジェクションリスク（クエリ内の文字列連結）
- XSS脆弱性（エスケープされていないユーザー入力）
- 入力検証の欠如
- 安全でない依存関係（古い、脆弱性がある）
- パストラバーサルリスク（ユーザー制御のファイルパス）
- CSRF脆弱性
- 認証バイパス

**コード品質（HIGH）**：
- 大きな関数（>50行）
- 大きなファイル（>800行）
- 深いネスト（>4レベル）
- エラーハンドリングの欠如（try/catch）
- console.logステートメント
- 変更パターン
- 新しいコードのテスト欠如

**パフォーマンス（MEDIUM）**：
- 非効率的なアルゴリズム（O(n log n)が可能な場合にO(n²)）
- Reactでの不要な再レンダリング
- メモ化の欠如
- 大きなバンドルサイズ
- 最適化されていない画像
- キャッシュの欠如
- N+1クエリ

**ベストプラクティス（MEDIUM）**：
- コード/コメントでの絵文字の使用
- チケットに関連付けられていないTODO/FIXME
- 公開APIのJSDoc欠如
- アクセシビリティの問題（ARIAラベルの欠如、コントラストが悪い）
- 変数の命名が悪い（x、tmp、data）
- 説明のないマジックナンバー
- 一貫性のないフォーマット

**レビュー出力形式**：
```markdown
[CRITICAL] ハードコードされたAPIキー
ファイル: src/api/client.ts:42
問題: APIキーがソースコードに公開されている
修正: 環境変数に移動

const apiKey = "sk-abc123";  // ❌ 悪い
const apiKey = process.env.API_KEY;  // ✓ 良い
```

**承認基準**：
- ✅ 承認：CRITICALまたはHIGHの問題なし
- ⚠️ 警告：MEDIUMの問題のみ（注意深くマージ可能）
- ❌ 拒否：CRITICALまたはHIGHの問題が見つかった場合

### 5. Security Reviewer - セキュリティ監査員

**使用タイミング**：ユーザー入力、認証、APIエンドポイント、または機密データを処理するコードを記述した後。

::: danger 重要
セキュリティレビュアーは、キー漏洩、SSRF、インジェクション、安全でない暗号化、およびOWASP Top 10の脆弱性をマークします。CRITICALな問題が見つかったら、直ちに修正してください！
:::

**主要な責任**：
1. **脆弱性検出**：OWASP Top 10と一般的なセキュリティ問題の特定
2. **キー検出**：ハードコードされたAPIキー、パスワード、トークンの検索
3. **入力検証**：すべてのユーザー入力が適切にサニタイズされていることを確認
4. **認証/認可**：適切なアクセス制御の検証
5. **依存関係のセキュリティ**：脆弱なnpmパッケージのチェック
6. **セキュリティベストプラクティス**：安全なコーディングパターンの強制

**OWASP Top 10チェック**：

1. **インジェクション**（SQL、NoSQL、Command）
   - クエリはパラメータ化されているか？
   - ユーザー入力はサニタイズされているか？
   - ORMは安全に使用されているか？

2. **破損した認証**
   - パスワードはハッシュされているか（bcrypt、argon2）？
   - JWTは正しく検証されているか？
   - セッションは安全か？
   - MFAがあるか？

3. **機密データの暴露**
   - HTTPSが強制されているか？
   - キーは環境変数にあるか？
   - PIIは静的に暗号化されているか？
   - ログはサニタイズされているか？

4. **XML外部エンティティ（XXE）**
   - XMLパーサーは安全に設定されているか？
   - 外部エンティティ処理は無効になっているか？

5. **破損したアクセス制御**
   - 各ルートで認可がチェックされているか？
   - オブジェクト参照は間接的か？
   - CORSは正しく設定されているか？

6. **セキュリティ設定エラー**
   - デフォルト認証情報は変更されているか？
   - エラーハンドリングは安全か？
   - セキュリティヘッダーは設定されているか？
   - 本番環境でデバッグモードは無効になっているか？

7. **クロスサイトスクリプティング（XSS）**
   - 出力はエスケープ/サニタイズされているか？
   - Content-Security-Policyは設定されているか？
   - フレームワークはデフォルトでエスケープするか？

8. **安全でないデシリアライゼーション**
   - ユーザー入力は安全にデシリアライズされているか？
   - デシリアライゼーションライブラリは最新か？

9. **既知の脆弱性を持つコンポーネントの使用**
   - すべての依存関係は最新か？
   - npm auditはクリーンか？
   - CVEは監視されているか？

10. **ログとモニタリングの不足**
    - セキュリティイベントは記録されているか？
    - ログは監視されているか？
    - アラートは設定されているか？

**一般的な脆弱性パターン**：

**1. ハードコードされたキー（CRITICAL）**
```javascript
// ❌ CRITICAL: ハードコードされたシークレット
const apiKey = "sk-proj-xxxxx"

// ✅ 正しい: 環境変数
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

**2. SQLインジェクション（CRITICAL）**
```javascript
// ❌ CRITICAL: SQLインジェクション脆弱性
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ 正しい: パラメータ化されたクエリ
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

**3. XSS（HIGH）**
```javascript
// ❌ HIGH: XSS脆弱性
element.innerHTML = userInput

// ✅ 正しい: textContentまたはサニタイズを使用
element.textContent = userInput
```

**セキュリティレビューレポート形式**：
```markdown
# セキュリティレビューレポート

**ファイル/コンポーネント：** [path/to/file.ts]
**レビュー日：** YYYY-MM-DD
**レビュアー：** security-reviewerエージェント

## サマリー
- **重大な問題：** X
- **高レベルの問題：** Y
- **中レベルの問題：** Z
- **低レベルの問題：** W
- **リスクレベル：** 🔴 高 / 🟡 中 / 🟢 低

## 重大な問題（直ちに修正）

### 1. [問題タイトル]
**重要度：** CRITICAL
**カテゴリ：** SQLインジェクション / XSS / 認証 / その他
**場所：** `file.ts:123`

**問題：**
[脆弱性の説明]

**影響：**
[悪用された場合に何が起こるか]

**概念実証：**
```javascript
// 脆弱性の悪用例
```

**修正：**
```javascript
// ✅ 安全な実装
```

**参照：**
- OWASP: [リンク]
- CWE: [番号]
```

### 6. Build Error Resolver - ビルドエラー修正師

**使用タイミング**：ビルドが失敗した場合、または型エラーが発生した場合。

::: tip 最小限の修正
ビルドエラー修正師のコア原則は**最小限の修正**であり、エラーのみを修正し、アーキテクチャの変更やリファクタリングを行いません。
:::

**主要な責任**：
1. **TypeScriptエラーの修正**：型エラー、推論問題、ジェネリック制約の修正
2. **ビルドエラーの修正**：コンパイル失敗、モジュール解決の解決
3. **依存関係の問題**：インポートエラー、欠落パッケージ、バージョン競合の修正
4. **設定エラー**：tsconfig.json、webpack、Next.js設定問題の解決
5. **最小限の差異**：エラーを修正するために可能な限り小さな変更を行う
6. **アーキテクチャの変更なし**：エラーのみを修正し、リファクタリングや再設計を行わない

**診断コマンド**：
```bash
# TypeScript型チェック（出力なし）
npx tsc --noEmit

# TypeScriptを美しい出力で
npx tsc --noEmit --pretty

# すべてのエラーを表示（最初のエラーで停止しない）
npx tsc --noEmit --pretty --incremental false

# 特定のファイルをチェック
npx tsc --noEmit path/to/file.ts

# ESLintチェック
npx eslint . --ext .ts,.tsx,.js,.jsx

# Next.jsビルド（本番）
npm run build
```

**エラー修正フロー**：

**1. すべてのエラーを収集**
```
a) 完全な型チェックを実行
   - npx tsc --noEmit --pretty
   - 最初だけでなくALLエラーをキャプチャ

b) タイプ別にエラーを分類
   - 型推論の失敗
   - 型定義の欠如
   - インポート/エクスポートエラー
   - 設定エラー
   - 依存関係の問題

c) 影響で優先順位付け
   - ビルドをブロック：先に修正
   - 型エラー：順に修正
   - 警告：時間があれば修正
```

**2. 修正戦略（最小限の変更）**
```
各エラーについて：

1. エラーを理解する
   - エラーメッセージを注意深く読む
   - ファイルと行番号を確認
   - 期待される型と実際の型を理解

2. 最小限の修正を見つける
   - 欠落している型アノテーションを追加
   - インポートステートメントを修正
   - nullチェックを追加
   - 型アサーションを使用（最後の手段）

3. 修正が他のコードを破壊していないことを確認
   - 各修正後にtscを実行
   - 関連ファイルを確認
   - 新しいエラーが導入されていないことを確認

4. ビルドが通るまで反復
   - 一度に1つのエラーを修正
   - 各修正後に再コンパイル
   - 進行状況を追跡（X/Yエラーが修正済み）
```

**一般的なエラーパターンと修正**：

**パターン1：型推論の失敗**
```typescript
// ❌ エラー: パラメーター'x'は暗黙的に'any'型を持つ
function add(x, y) {
  return x + y
}

// ✅ 修正: 型アノテーションを追加
function add(x: number, y: number): number {
  return x + y
}
```

**パターン2：Null/Undefinedエラー**
```typescript
// ❌ エラー: オブジェクトは'undefined'である可能性があります
const name = user.name.toUpperCase()

// ✅ 修正: オプショナルチェーン
const name = user?.name?.toUpperCase()

// ✅ または: nullチェック
const name = user && user.name ? user.name.toUpperCase() : ''
```

**パターン3：インポートエラー**
```typescript
// ❌ エラー: モジュール'@/lib/utils'が見つかりません
import { formatDate } from '@/lib/utils'

// ✅ 修正1: tsconfigパスが正しいか確認
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ✅ 修正2: 相対インポートを使用
import { formatDate } from '../lib/utils'
```

**最小限の差異戦略**：

**CRITICAL：可能な限り小さな変更を行う**

**DO：**
✅ 欠落している型アノテーションを追加
✅ 必要なnullチェックを追加
✅ インポート/エクスポートを修正
✅ 欠落している依存関係を追加
✅ 型定義を更新
✅ 設定ファイルを修正

**DON'T：**
❌ 関係のないコードをリファクタリング
❌ アーキテクチャを変更
❌ 変数/関数をリネーム（エラーを引き起こさない限り）
❌ 新機能を追加
❌ ロジックフローを変更（エラー修正でない限り）
❌ パフォーマンスを最適化
❌ コードスタイルを改善

### 7. E2E Runner - E2Eテストエキスパート

**使用タイミング**：E2Eテストを生成、維持、実行する必要がある場合。

::: tip エンドツーエンドテストの価値
E2Eテストは本番前の最後の防衛線であり、ユニットテストが見落とす統合の問題をキャプチャします。
:::

**主要な責任**：
1. **テストジャーニーの作成**：ユーザーフロー向けのPlaywrightテストの記述
2. **テストの維持**：テストをUIの変更と同期させる
3. **Flakyテスト管理**：不安定なテストを特定して分離する
4. **アーティファクト管理**：スクリーンショット、ビデオ、トレースのキャプチャ
5. **CI/CD統合**：パイプラインでテストが確実に実行されるようにする
6. **テストレポート**：HTMLレポートとJUnit XMLの生成

**テストコマンド**：
```bash
# すべてのE2Eテストを実行
npx playwright test

# 特定のテストファイルを実行
npx playwright test tests/markets.spec.ts

# ヘッダーモードでテストを実行（ブラウザが見える）
npx playwright test --headed

# インスペクタでテストをデバッグ
npx playwright test --debug

# ブラウザ操作からテストコードを生成
npx playwright codegen http://localhost:3000

# トレース付きでテストを実行
npx playwright test --trace on

# HTMLレポートを表示
npx playwright show-report

# スナップショットを更新
npx playwright test --update-snapshots

# 特定のブラウザでテストを実行
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**E2Eテストワークフロー**：

**1. テスト計画フェーズ**
```
a) 主要なユーザージャーニーを特定
   - 認証フロー（ログイン、ログアウト、登録）
   - コア機能（マーケット作成、取引、検索）
   - 支払いフロー（入金、出金）
   - データ整合性（CRUD操作）

b) テストシナリオを定義
   - ハッピーパス（すべてが正常に動作）
   - エッジケース（空の状態、制限）
   - エラーケース（ネットワークエラー、検証）

c) リスクで優先順位付け
   - 高：金融取引、認証
   - 中：検索、フィルタリング、ナビゲーション
   - 低：UIの仕上げ、アニメーション、スタイル
```

**2. テスト作成フェーズ**
```
各ユーザージャーニーについて：

1. Playwrightでテストを記述
   - ページオブジェクトモデル（POM）パターンを使用
   - 意味のあるテスト説明を追加
   - 重要なステップにアサーションを追加
   - 重要なポイントにスクリーンショットを追加

2. テストを回復力のあるものにする
   - 適切なロケーターを使用（data-testidを優先）
   - 動的コンテンツの待機を追加
   - 競合状態を処理
   - 再試行ロジックを実装

3. アーティファクトキャプチャを追加
   - 失敗時にスクリーンショット
   - ビデオ録画
   - デバッグ用のトレース
   - 必要に応じてネットワークログ
```

**Playwrightテスト構造**：

**テストファイル編成**：
```
tests/
├── e2e/                       # エンドツーエンドユーザージャーニー
│   ├── auth/                  # 認証フロー
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── markets/               # マーケット機能
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   ├── create.spec.ts
│   │   └── trade.spec.ts
│   ├── wallet/                # ウォレット操作
│   │   ├── connect.spec.ts
│   │   └── transactions.spec.ts
│   └── api/                   # APIエンドポイントテスト
│       ├── markets-api.spec.ts
│       └── search-api.spec.ts
├── fixtures/                  # テストデータとヘルパー
│   ├── auth.ts                # 認証フィクスチャ
│   ├── markets.ts             # マーケットテストデータ
│   └── wallets.ts             # ウォレットフィクスチャ
└── playwright.config.ts       # Playwright設定
```

**ページオブジェクトモデルパターン**：
```typescript
// pages/MarketsPage.ts
import { Page, Locator } from '@playwright/test'

export class MarketsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly marketCards: Locator
  readonly createMarketButton: Locator
  readonly filterDropdown: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.marketCards = page.locator('[data-testid="market-card"]')
    this.createMarketButton = page.locator('[data-testid="create-market-btn"]')
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]')
  }

  async goto() {
    await this.page.goto('/markets')
    await this.page.waitForLoadState('networkidle')
  }

  async searchMarkets(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp => resp.url().includes('/api/markets/search'))
    await this.page.waitForLoadState('networkidle')
  }

  async getMarketCount() {
    return await this.marketCards.count()
  }

  async clickMarket(index: number) {
    await this.marketCards.nth(index).click()
  }

  async filterByStatus(status: string) {
    await this.filterDropdown.selectOption(status)
    await this.page.waitForLoadState('networkidle')
  }
}
```

**ベストプラクティステストの例**：
```typescript
// tests/e2e/markets/search.spec.ts
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test.describe('Market Search', () => {
  let marketsPage: MarketsPage

  test.beforeEach(async ({ page }) => {
    marketsPage = new MarketsPage(page)
    await marketsPage.goto()
  })

  test('should search markets by keyword', async ({ page }) => {
    // Arrange
    await expect(page).toHaveTitle(/Markets/)

    // Act
    await marketsPage.searchMarkets('trump')

    // Assert
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBeGreaterThan(0)

    // 最初の結果が検索用語を含むことを確認
    const firstMarket = marketsPage.marketCards.first()
    await expect(firstMarket).toContainText(/trump/i)

    // 検証のためにスクリーンショットを撮る
    await page.screenshot({ path: 'artifacts/search-results.png' })
  })

  test('should handle no results gracefully', async ({ page }) => {
    // Act
    await marketsPage.searchMarkets('xyznonexistentmarket123')

    // Assert
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBe(0)
  })
})
```

**Flakyテスト管理**：

**Flakyテストの特定**：
```bash
# 安定性をチェックするためにテストを複数回実行
npx playwright test tests/markets/search.spec.ts --repeat-each=10

# 再試行付きで特定のテストを実行
npx playwright test tests/markets/search.spec.ts --retries=3
```

**分離モード**：
```typescript
// flakyテストを分離のためにマーク
test('flaky: market search with complex query', async ({ page }) => {
  test.fixme(true, 'Test is flaky - Issue #123')

  // テストコード...
})

// または条件付きスキップを使用
test('market search with complex query', async ({ page }) => {
  test.skip(process.env.CI, 'Test is flaky in CI - Issue #123')

  // テストコード...
})
```

**一般的なFlakinessの原因と修正**：

**1. 競合状態**
```typescript
// ❌ FLAKY: 要素の準備ができていると仮定
await page.click('[data-testid="button"]')

// ✅ STABLE: 要素の準備ができるまで待機
await page.locator('[data-testid="button"]').click() // 組み込みの自動待機
```

**2. ネットワークのタイミング**
```typescript
// ❌ FLAKY: 任意のタイムアウト
await page.waitForTimeout(5000)

// ✅ STABLE: 特定の条件を待機
await page.waitForResponse(resp => resp.url().includes('/api/markets'))
```

**3. アニメーションのタイミング**
```typescript
// ❌ FLAKY: アニメーション中にクリック
await page.click('[data-testid="menu-item"]')

// ✅ STABLE: アニメーションの完了を待機
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.click('[data-testid="menu-item"]')
```

### 8. Refactor Cleaner - リファクタリングクリーナー

**使用タイミング**：未使用のコード、重複コードを削除し、リファクタリングを行う必要がある場合。

::: warning 慎重に操作
リファクタリングクリーナーは分析ツール（knip、depcheck、ts-prune）を実行してデッドコードを特定し、安全に削除します。削除前に十分に検証してください！
:::

**主要な責任**：
1. **デッドコード検出**：未使用のコード、エクスポート、依存関係の検索
2. **重複の排除**：重複コードの特定と統合
3. **依存関係のクリーンアップ**：未使用パッケージとインポートの削除
4. **安全なリファクタリング**：変更が機能を破壊しないことを確認
5. **ドキュメント化**：`DELETION_LOG.md`ですべての削除を追跡

**検出ツール**：
- **knip**：未使用のファイル、エクスポート、依存関係、型の検索
- **depcheck**：未使用のnpm依存関係の特定
- **ts-prune**：未使用のTypeScriptエクスポートの検索
- **eslint**：未使用のdisableディレクティブと変数のチェック

**分析コマンド**：
```bash
# knipを実行して未使用のエクスポート/ファイル/依存関係を検索
npx knip

# 未使用の依存関係をチェック
npx depcheck

# 未使用のTypeScriptエクスポートを検索
npx ts-prune

# 未使用のdisableディレクティブをチェック
npx eslint . --report-unused-disable-directives
```

**リファクタリングワークフロー**：

**1. 分析フェーズ**
```
a) 検出ツールを並列実行
b) すべての発見を収集
c) リスクレベルで分類：
   - 安全：未使用のエクスポート、未使用の依存関係
   - 注意：動的インポートで使用されている可能性
   - リスク：公開API、共有ツール
```

**2. リスク評価**
```
削除する各項目について：
- どこでインポートされているかをチェック（grep検索）
- 動的インポートがないことを確認（grep文字列パターン）
- 公開APIの一部かどうかを確認
- 履歴を確認してコンテキストを取得
- ビルド/テストへの影響をテスト
```

**3. 安全な削除プロセス**
```
a) 安全な項目からのみ開始
b) カテゴリごとに一度に1つずつ削除：
   1. 未使用のnpm依存関係
   2. 未使用の内部エクスポート
   3. 未使用のファイル
   4. 重複コード
c) 各バッチ後にテストを実行
d) 各バッチのgit commitを作成
```

**4. 重複の統合**
```
a) 重複したコンポーネント/ユーティリティを検索
b) 最適な実装を選択：
   - 最も完全な機能
   - 最高のテスト
   - 最近使用
c) すべてのインポートを更新して選択したバージョンを使用
d) 重複を削除
e) テストがまだ通ることを確認
```

**削除ログ形式**：

`docs/DELETION_LOG.md`を作成/更新し、以下の構造を使用：
```markdown
# コード削除ログ

## [YYYY-MM-DD] リファクタリングセッション

### 削除された未使用の依存関係
- package-name@version - 最終使用: なし、サイズ: XX KB
- another-package@version - 置換: better-package

### 削除された未使用のファイル
- src/old-component.tsx - 置換: src/new-component.tsx
- lib/deprecated-util.ts - 機能移動先: lib/utils.ts

### 統合された重複コード
- src/components/Button1.tsx + Button2.tsx → Button.tsx
- 理由: 両方の実装が同一

### 削除された未使用のエクスポート
- src/utils/helpers.ts - 関数: foo(), bar()
- 理由: コードベースで参照が見つかりません

### 影響
- 削除されたファイル: 15
- 削除された依存関係: 5
- 削除されたコード行数: 2,300
- バンドルサイズ削減: ~45 KB

### テスト
- すべてのユニットテスト合格: ✓
- すべての統合テスト合格: ✓
- 手動テスト完了: ✓
```

**安全チェックリスト**：

**何も削除する前に：**
- [ ] 検出ツールを実行
- [ ] すべての参照をgrep
- [ ] 動的インポートを確認
- [ ] 履歴を確認
- [ ] 公開APIかどうかを確認
- [ ] すべてのテストを実行
- [ ] バックアップブランチを作成
- [ ] DELETION_LOG.mdに文書化

**各削除後：**
- [ ] ビルド成功
- [ ] テスト合格
- [ ] コンソールエラーなし
- [ ] 変更をコミット
- [ ] DELETION_LOG.mdを更新

**一般的な削除パターン**：

**1. 未使用のインポート**
```typescript
// ❌ 未使用のインポートを削除
import { useState, useEffect, useMemo } from 'react' // useStateのみ使用

// ✅ 使用しているもののみを残す
import { useState } from 'react'
```

**2. デッドコードブランチ**
```typescript
// ❌ 実行されないコードを削除
if (false) {
  // これが実行されることはない
  doSomething()
}

// ❌ 未使用の関数を削除
export function unusedHelper() {
  // コードベースで参照がない
}
```

**3. 重複コンポーネント**
```typescript
// ❌ 複数の類似したコンポーネント
components/Button.tsx
components/PrimaryButton.tsx
components/NewButton.tsx

// ✅ 1つに統合
components/Button.tsx (バリアントプロップ付き)
```

### 9. Doc Updater - ドキュメント更新師

**使用タイミング**：codemapsとドキュメントを更新する必要がある場合。

::: tip ドキュメントとコードの同期
Doc Updaterは`/update-codemaps`と`/update-docs`を実行し、`docs/CODEMAPS/*`を生成し、READMEとガイドを更新します。
:::

**主要な責任**：
1. **Codemap生成**：コードベース構造からアーキテクチャマップを作成
2. **ドキュメント更新**：コードからREADMEとガイドをリフレッシュ
3. **AST分析**：TypeScriptコンパイラAPIを使用して構造を理解
4. **依存関係マッピング**：モジュール間のインポート/エクスポートを追跡
5. **ドキュメント品質**：ドキュメントが実際のコードと一致することを確認

**分析ツール**：
- **ts-morph**：TypeScript AST分析と操作
- **TypeScript Compiler API**：深いコード構造分析
- **madge**：依存関係グラフの可視化
- **jsdoc-to-markdown**：JSDocコメントからのドキュメント生成

**分析コマンド**：
```bash
# TypeScriptプロジェクト構造を分析（ts-morphライブラリを使用するカスタムスクリプトを実行）
npx tsx scripts/codemaps/generate.ts

# 依存関係グラフを生成
npx madge --image graph.svg src/

# JSDocコメントを抽出
npx jsdoc2md src/**/*.ts
```

**Codemap生成ワークフロー**：

**1. リポジトリ構造分析**
```
a) すべてのworkspaces/packagesを特定
b) ディレクトリ構造をマッピング
c) エントリーポイントを検索（apps/*、packages/*、services/*）
d) フレームワークパターンを検出（Next.js、Node.jsなど）
```

**2. モジュール分析**
```
各モジュールについて：
- エクスポートを抽出（公開API）
- インポートをマッピング（依存関係）
- ルートを特定（APIルート、ページ）
- データベースモデルを検索（Supabase、Prisma）
- queue/workerモジュールを特定
```

**3. Codemapsの生成**
```
構造：
docs/CODEMAPS/
├── INDEX.md              # すべての領域の概要
├── frontend.md           # フロントエンド構造
├── backend.md            # バックエンド/API構造
├── database.md           # データベーススキーマ
├── integrations.md       # 外部サービス
└── workers.md            # バックグラウンドタスク
```

**Codemap形式**：
```markdown
# [領域] Codemap

**最終更新：** YYYY-MM-DD
**エントリーポイント：** 主要なファイルのリスト

## アーキテクチャ

[コンポーネント間の関係のASCII図]

## 主要なモジュール

| モジュール | 目的 | エクスポート | 依存関係 |
|--- | --- | --- | ---|
| ... | ... | ... | ... |

## データフロー

[データがこの領域でどのように流れるかの説明]

## 外部依存関係

- package-name - 目的、バージョン
- ...

## 関連領域

この領域と対話する他のcodemapsへのリンク
```

**ドキュメント更新ワークフロー**：

**1. コードからドキュメントを抽出**
```
- JSDoc/TSDocコメントを読み取る
- package.jsonからREADMEセクションを抽出
- .env.exampleから環境変数を解析
- APIエンドポイント定義を収集
```

**2. ドキュメントファイルを更新**
```
更新するファイル：
- README.md - プロジェクト概要、セットアップ手順
- docs/GUIDES/*.md - 機能ガイド、チュートリアル
- package.json - 説明、スクリプトドキュメント
- APIドキュメント - エンドポイント仕様
```

**3. ドキュメント検証**
```
- 言及されたすべてのファイルが存在することを確認
- すべてのリンクが有効であることを確認
- 例が実行可能であることを確認
- コードスニペットがコンパイルされることを確認
```

**示例项目特定Codemaps**：

**フロントエンドCodemap (docs/CODEMAPS/frontend.md)**：
```markdown
# フロントエンドアーキテクチャ

**最終更新：** YYYY-MM-DD
**フレームワーク：** Next.js 15.1.4 (App Router)
**エントリーポイント：** website/src/app/layout.tsx

## 構造

website/src/
├── app/                # Next.js App Router
│   ├── api/           # APIルート
│   ├── markets/       # マーケットページ
│   ├── bot/           # ボットインタラクション
│   └── creator-dashboard/
├── components/        # Reactコンポーネント
├── hooks/             # カスタムフック
└── lib/               # ユーティリティ

## 主要なコンポーネント

| コンポーネント | 目的 | 場所 |
|--- | --- | ---|
| HeaderWallet | ウォレット接続 | components/HeaderWallet.tsx |
| MarketsClient | マーケット一覧 | app/markets/MarketsClient.js |
| SemanticSearchBar | 検索UI | components/SemanticSearchBar.js |

## データフロー

ユーザー → マーケットページ → APIルート → Supabase → Redis（オプション） → レスポンス

## 外部依存関係

- Next.js 15.1.4 - フレームワーク
- React 19.0.0 - UIライブラリ
- Privy - 認証
- Tailwind CSS 3.4.1 - スタイリング
```

**バックエンドCodemap (docs/CODEMAPS/backend.md)**：
```markdown
# バックエンドアーキテクチャ

**最終更新：** YYYY-MM-DD
**ランタイム：** Next.js APIルート
**エントリーポイント：** website/src/app/api/

## APIルート

| ルート | メソッド | 目的 |
|--- | --- | ---|
| /api/markets | GET | すべてのマーケットを一覧表示 |
| /api/markets/search | GET | セマンティック検索 |
| /api/market/[slug] | GET | 単一マーケット |
| /api/market-price | GET | リアルタイム価格 |

## データフロー

APIルート → Supabaseクエリ → Redis（キャッシュ） → レスポンス

## 外部サービス

- Supabase - PostgreSQLデータベース
- Redis Stack - ベクトル検索
- OpenAI - 埋め込み
```

**README更新テンプレート**：

README.mdを更新する場合：
```markdown
# プロジェクト名

簡単な説明

## セットアップ
\`\`\`bash
# インストール
npm install

# 環境変数
cp .env.example .env.local
# 以下を入力: OPENAI_API_KEY, REDIS_URL, など

# 開発
npm run dev

# ビルド
npm run build
\`\`\`

## アーキテクチャ

詳細なアーキテクチャについては、[docs/CODEMAPS/INDEX.md](docs/CODEMAPS/INDEX.md)を参照してください。

### 主要なディレクトリ

- `src/app` - Next.js App RouterページとAPIルート
- `src/components` - 再利用可能なReactコンポーネント
- `src/lib` - ユーティリティライブラリとクライアント

## 機能

- [機能1] - 説明
- [機能2] - 説明

## ドキュメント

- [セットアップガイド](docs/GUIDES/setup.md)
- [APIリファレンス](docs/GUIDES/api.md)
- [アーキテクチャ](docs/CODEMAPS/INDEX.md)

## 貢献

[CONTRIBUTING.md](CONTRIBUTING.md)を参照してください
```

## どのエージェントをいつ呼び出すか

タスクタイプに基づいて、適切なエージェントを選択します：

| タスクタイプ | 推奨される呼び出し | 代替案 |
|--- | --- | ---|
| **新機能の計画** | `/plan` → plannerエージェント | 手動でplannerエージェントを呼び出す |
| **システムアーキテクチャ設計** | 手動でarchitectエージェントを呼び出す | `/orchestrate` → エージェントのシーケンシャル呼び出し |
| **新機能の実装** | `/tdd` → tdd-guideエージェント | planner → tdd-guide |
| **バグ修正** | `/tdd` → tdd-guideエージェント | build-error-resolver（型エラーの場合） |
| **コードレビュー** | `/code-review` → code-reviewerエージェント | 手動でcode-reviewerエージェントを呼び出す |
| **セキュリティ監査** | 手動でsecurity-reviewerエージェントを呼び出す | code-reviewer（部分的にカバー） |
| **ビルド失敗** | `/build-fix` → build-error-resolverエージェント | 手動で修正 |
| **E2Eテスト** | `/e2e` → e2e-runnerエージェント | 手動でPlaywrightテストを記述 |
| **デッドコードのクリーンアップ** | `/refactor-clean` → refactor-cleanerエージェント | 手動で削除 |
| **ドキュメント更新** | `/update-docs` → doc-updaterエージェント | `/update-codemaps` → doc-updaterエージェント |

## エージェント協力の例

### シナリオ1：ゼロからの新機能開発

```
1. /plan (plannerエージェント)
   - 実装計画を作成
   - 依存関係とリスクを特定

2. /tdd (tdd-guideエージェント)
   - 計画に従ってテストを記述
   - 機能を実装
   - カバレッジを保証

3. /code-review (code-reviewerエージェント)
   - コード品質をレビュー
   - セキュリティ脆弱性を確認

4. /verify (コマンド)
   - ビルド、型チェック、テストを実行
   - console.log、gitステータスを確認
```

### シナリオ2：ビルドエラーの修正

```
1. /build-fix (build-error-resolverエージェント)
   - TypeScriptエラーを修正
   - ビルドが成功することを確認

2. /test-coverage (コマンド)
   - カバレッジが要件を満たしているか確認

3. /code-review (code-reviewerエージェント)
   - 修正されたコードをレビュー
```

### シナリオ3：コードクリーンアップ

```
1. /refactor-clean (refactor-cleanerエージェント)
   - 検出ツールを実行
   - デッドコードを削除
   - 重複コードを統合

2. /update-docs (doc-updaterエージェント)
   - codemapsを更新
   - ドキュメントをリフレッシュ

3. /verify (コマンド)
   - すべてのチェックを実行
```

## まとめ

Everything Claude Codeは9つの専門化エージェントを提供しており、各エージェントは特定の分野に特化しています：

1. **planner** - 複雑な機能の計画
2. **architect** - システムアーキテクチャ設計
3. **tdd-guide** - TDDフローの実行
4. **code-reviewer** - コード品質レビュー
5. **security-reviewer** - セキュリティ脆弱性の検出
6. **build-error-resolver** - ビルドエラーの修正
7. **e2e-runner** - エンドツーエンドテスト管理
8. **refactor-cleaner** - デッドコードのクリーンアップ
9. **doc-updater** - ドキュメントとcodemapの更新

**コア原則**：
- タスクタイプに基づいて適切なエージェントを選択する
- エージェント間の協力を活用して効率的なワークフローを構築する
- 複雑なタスクでは複数のエージェントをシーケンシャルに呼び出すことができる
- コード変更後は必ずコードレビューを行う

## 次回の予告

> 次のレッスンでは、**[TDD開発フロー](../tdd-workflow/)**を学びます。
>
> 学習内容：
> - `/plan`を使用して実装計画を作成する方法
> - `/tdd`を使用してRed-Green-Refactorサイクルを実行する方法
> - 80%以上のテストカバレッジを保証する方法
> - `/verify`を使用して包括的な検証を実行する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Plannerエージェント | [agents/planner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| Architectエージェント | [agents/architect.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/architect.md) | 1-212 |
| TDD Guideエージェント | [agents/tdd-guide.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewerエージェント | [agents/code-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| Security Reviewerエージェント | [agents/security-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| Build Error Resolverエージェント | [agents/build-error-resolver.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/build-error-resolver.md) | 1-533 |
| E2E Runnerエージェント | [agents/e2e-runner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/e2e-runner.md) | 1-709 |
| Refactor Cleanerエージェント | [agents/refactor-cleaner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/refactor-cleaner.md) | 1-307 |
| Doc Updaterエージェント | [agents/doc-updater.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/doc-updater.md) | 1-453 |

**重要な定数**：
- なし

**重要な関数**：
- なし

</details>
