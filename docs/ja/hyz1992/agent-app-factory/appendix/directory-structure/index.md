---
title: "ディレクトリ構造詳解：Factory プロジェクトの完全構造とファイル用途 | AI App Factory チュートリアル"
sidebarTitle: "ディレクトリ構造詳解"
subtitle: "ディレクトリ構造詳解：Factory プロジェクト完全ガイド"
description: "AI App Factory プロジェクトの完全なディレクトリ構造と各ファイルの用途を学びます。本チュートリアルでは、agents、skills、policies、artifacts などのコアディレクトリの役割とファイル機能を詳しく解説し、Factory プロジェクトの動作原理を深く理解し、設定ファイルを素早く特定・修正し、パイプラインの問題をデバッグするのに役立ちます。"
tags:
- "付録"
- "ディレクトリ構造"
- "プロジェクトアーキテクチャ"
prerequisite:
- "start-init-project"
order: 220
---

# ディレクトリ構造詳解：Factory プロジェクト完全ガイド

## 学習後にできること

- ✅ Factory プロジェクトの完全なディレクトリ構造を理解する
- ✅ 各ディレクトリとファイルの用途を知る
- ✅ アーティファクト（artifacts）の保存方式を理解する
- ✅ 設定ファイルの役割と修正方法を習得する

## コアコンセプト

Factory プロジェクトは明確なディレクトリ階層構造を採用し、設定、コード、アーティファクト、ドキュメントを分離しています。これらのディレクトリ構造を理解することで、ファイルを素早く特定し、設定を修正し、問題をデバッグすることができます。

Factory プロジェクトには2つの形態があります：

**形態 1：ソースコードリポジトリ**（GitHub からクローンしたもの）
**形態 2：初期化後のプロジェクト**（`factory init` で生成されたもの）

本チュートリアルでは**形態 2**——初期化後の Factory プロジェクト構造を重点的に解説します。これは日常作業で使用するディレクトリだからです。

---

## Factory プロジェクトの完全構造

```
my-app/                          # Factory プロジェクトのルートディレクトリ
├── .factory/                    # Factory コア設定ディレクトリ（手動で変更しない）
│   ├── pipeline.yaml            # パイプライン定義（7 ステージ）
│   ├── config.yaml              # プロジェクト設定ファイル（技術スタック、MVP 制約など）
│   ├── state.json               # パイプライン実行状態（現在のステージ、完了済みステージ）
│   ├── agents/                  # エージェント定義（AI アシスタントのタスク説明）
│   ├── skills/                  # スキルモジュール（再利用可能な知識）
│   ├── policies/                # ポリシードキュメント（権限、失敗処理、コード規約）
│   └── templates/               # 設定テンプレート（CI/CD、Git Hooks）
├── .claude/                     # Claude Code 設定ディレクトリ（自動生成）
│   └── settings.local.json      # Claude Code 権限設定
├── input/                       # ユーザー入力ディレクトリ
│   └── idea.md                  # 構造化された製品アイデア（Bootstrap により生成）
└── artifacts/                   # パイプラインアーティファクトディレクトリ（7 ステージの出力）
    ├── prd/                     # PRD アーティファクト
    │   └── prd.md               # 製品要件ドキュメント
    ├── ui/                      # UI アーティファクト
    │   ├── ui.schema.yaml       # UI 構造定義
    │   └── preview.web/         # プレビュー可能な HTML プロトタイプ
    │       └── index.html
    ├── tech/                    # Tech アーティファクト
    │   └── tech.md              # 技術アーキテクチャドキュメント
    ├── backend/                 # バックエンドコード（Express + Prisma）
    │   ├── src/                 # ソースコード
    │   ├── prisma/              # データベース設定
    │   │   ├── schema.prisma    # Prisma データモデル
    │   │   └── seed.ts          # シードデータ
    │   ├── tests/               # テスト
    │   ├── docs/                # API ドキュメント
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    ├── client/                  # フロントエンドコード（React Native）
    │   ├── src/                 # ソースコード
    │   ├── __tests__/           # テスト
    │   ├── app.json
    │   ├── package.json
    │   └── README.md
    ├── validation/              # 検証アーティファクト
    │   └── report.md            # コード品質検証レポート
    ├── preview/                 # Preview アーティファクト
    │   ├── README.md            # デプロイと実行ガイド
    │   └── GETTING_STARTED.md   # クイックスタートガイド
    ├── _failed/                 # 失敗アーティファクトアーカイブ
    │   └── <stage-id>/          # 失敗ステージのアーティファクト
    └── _untrusted/              # 権限超過アーティファクト隔離
        └── <stage-id>/          # 権限超過エージェントが書き込んだファイル
```

---

## .factory/ ディレクトリ詳解

`.factory/` ディレクトリは Factory プロジェクトのコアであり、パイプライン定義、エージェント設定、ポリシードキュメントを含みます。このディレクトリは `factory init` コマンドで自動作成され、通常は手動で変更する必要はありません。

### pipeline.yaml - パイプライン定義

**用途**：7 ステージの実行順序、入出力、終了条件を定義します。

**主な内容**：
- 7 ステージ：bootstrap、prd、ui、tech、code、validation、preview
- 各ステージのエージェント、入力ファイル、出力ファイル
- 終了条件（exit_criteria）：ステージ完了の検証基準

**例**：
```yaml
stages:
- id: bootstrap
  description: プロジェクトアイデアの初期化
  agent: agents/bootstrap.agent.md
  inputs: []
  outputs:
  - input/idea.md
  exit_criteria:
  - idea.md が存在する
  - idea.md が一貫性のある製品アイデアを記述している
```

**修正が必要な場合**：通常は修正不要ですが、パイプラインのフローをカスタマイズする場合は修正します。

### config.yaml - プロジェクト設定ファイル

**用途**：技術スタック、MVP 制約、UI 設定などのグローバル設定を構成します。

**主な設定項目**：
- `preferences`：技術スタック設定（バックエンド言語、データベース、フロントエンドフレームワークなど）
- `mvp_constraints`：MVP 範囲制御（最大ページ数、最大モデル数など）
- `ui_preferences`：UI デザイン設定（審美方向、カラースキーム）
- `pipeline`：パイプライン動作（チェックポイントモード、失敗処理）
- `advanced`：高度なオプション（エージェントタイムアウト、並行制御）

**例**：
```yaml
preferences:
  backend:
    language: typescript
    framework: express
    database: sqlite
  mvp_constraints:
    max_pages: 3
    enable_auth: false
```

**修正が必要な場合**：技術スタックを調整したり、MVP の範囲を変更したい場合に修正します。

### state.json - パイプライン状態

**用途**：パイプラインの実行状態を記録し、ブレークポイントからの再開をサポートします。

**主な内容**：
- `status`：現在の状態（idle/running/waiting_for_confirmation/paused/failed）
- `current_stage`：現在実行中のステージ
- `completed_stages`：完了済みステージリスト
- `last_updated`：最終更新日時

**修正が必要な場合**：自動更新されるため、手動で修正しないでください。

### agents/ - エージェント定義ディレクトリ

**用途**：各エージェントの責務、入出力、実行制約を定義します。

**ファイルリスト**：

| ファイル | 説明 |
|----------|------|
| `orchestrator.checkpoint.md` | オーケストレーターコア定義（パイプライン調整） |
| `orchestrator-implementation.md` | オーケストレーター実装ガイド（開発リファレンス） |
| `bootstrap.agent.md` | Bootstrap エージェント（製品アイデアの構造化） |
| `prd.agent.md` | PRD エージェント（要件ドキュメントの生成） |
| `ui.agent.md` | UI エージェント（UI プロトタイプの設計） |
| `tech.agent.md` | Tech エージェント（技術アーキテクチャの設計） |
| `code.agent.md` | Code エージェント（コードの生成） |
| `validation.agent.md` | Validation エージェント（コード品質の検証） |
| `preview.agent.md` | Preview エージェント（デプロイガイドの生成） |

**修正が必要な場合**：通常は修正不要ですが、特定のエージェントの動作をカスタマイズする場合は修正します。

### skills/ - スキルモジュールディレクトリ

**用途**：再利用可能な知識モジュールで、各エージェントは対応する Skill ファイルをロードします。

**ディレクトリ構造**：
```
skills/
├── bootstrap/skill.md         # 製品アイデアの構造化
├── prd/skill.md               # PRD 生成
├── ui/skill.md                # UI デザイン
├── tech/skill.md              # 技術アーキテクチャ + データベースマイグレーション
├── code/skill.md              # コード生成 + テスト + ログ
│   └── references/            # コード生成リファレンステンプレート
│       ├── backend-template.md    # 本番対応バックエンドテンプレート
│       └── frontend-template.md   # 本番対応フロントエンドテンプレート
└── preview/skill.md           # デプロイ設定 + クイックスタートガイド
```

**修正が必要な場合**：通常は修正不要ですが、特定の Skill の機能を拡張する場合は修正します。

### policies/ - ポリシードキュメントディレクトリ

**用途**：権限、失敗処理、コード規約などのポリシーを定義します。

**ファイルリスト**：

| ファイル | 説明 |
|----------|------|
| `capability.matrix.md` | 能力境界マトリックス（エージェントの読み書き権限） |
| `failure.policy.md` | 失敗処理ポリシー（リトライ、ロールバック、人間介入） |
| `context-isolation.md` | コンテキスト分離ポリシー（Token 節約） |
| `error-codes.md` | 統一エラーコード規約 |
| `code-standards.md` | コード規約（コーディングスタイル、ファイル構造） |
| `pr-template.md` | PR テンプレートとコードレビューチェックリスト |
| `changelog.md` | Changelog 生成規約 |

**修正が必要な場合**：通常は修正不要ですが、ポリシーや規約を調整する場合は修正します。

### templates/ - 設定テンプレートディレクトリ

**用途**：CI/CD、Git Hooks などの設定テンプレート。

**ファイルリスト**：

| ファイル | 説明 |
|----------|------|
| `cicd-github-actions.md` | CI/CD 設定（GitHub Actions） |
| `git-hooks-husky.md` | Git Hooks 設定（Husky） |

**修正が必要な場合**：通常は修正不要ですが、CI/CD フローをカスタマイズする場合は修正します。

---

## .claude/ ディレクトリ詳解

### settings.local.json - Claude Code 権限設定

**用途**：Claude Code がアクセスできるディレクトリと操作権限を定義します。

**生成タイミング**：`factory init` 時に自動生成されます。

**修正が必要な場合**：通常は修正不要ですが、権限範囲を調整する場合は修正します。

---

## input/ ディレクトリ詳解

### idea.md - 構造化された製品アイデア

**用途**：構造化された製品アイデアを保存し、Bootstrap エージェントによって生成されます。

**生成タイミング**：Bootstrap ステージ完了後。

**内容構造**：
- 問題定義（Problem）
- ターゲットユーザー（Target Users）
- コアバリュー（Core Value）
- 仮説（Assumptions）
- 対象外（Out of Scope）

**修正が必要な場合**：製品方向を調整したい場合は手動で編集し、Bootstrap または後続ステージを再実行します。

---

## artifacts/ ディレクトリ詳解

`artifacts/` ディレクトリはパイプラインアーティファクトの保存場所で、各ステージがアーティファクトを対応するサブディレクトリに書き込みます。

### prd/ - PRD アーティファクトディレクトリ

**アーティファクトファイル**：
- `prd.md`：製品要件ドキュメント

**内容**：
- ユーザストーリー（User Stories）
- 機能リスト（Features）
- 非機能要件（Non-functional Requirements）
- 対象外（Out of Scope）

**生成タイミング**：PRD ステージ完了後。

### ui/ - UI アーティファクトディレクトリ

**アーティファクトファイル**：
- `ui.schema.yaml`：UI 構造定義（ページ、コンポーネント、インタラクション）
- `preview.web/index.html`：プレビュー可能な HTML プロトタイプ

**内容**：
- ページ構造（ページ数、レイアウト）
- コンポーネント定義（ボタン、フォーム、リストなど）
- インタラクションフロー（ナビゲーション、遷移）
- デザインシステム（配色、フォント、間隔）

**生成タイミング**：UI ステージ完了後。

**プレビュー方法**：ブラウザで `preview.web/index.html` を開きます。

### tech/ - Tech アーティファクトディレクトリ

**アーティファクトファイル**：
- `tech.md`：技術アーキテクチャドキュメント

**内容**：
- 技術スタック選択（バックエンド、フロントエンド、データベース）
- データモデル設計
- API エンドポイント設計
- セキュリティポリシー
- パフォーマンス最適化の推奨事項

**生成タイミング**：Tech ステージ完了後。

### backend/ - バックエンドコードディレクトリ

**アーティファクトファイル**：
```
backend/
├── src/                       # ソースコード
│   ├── routes/                # API ルート
│   ├── services/              # ビジネスロジック
│   ├── middleware/            # ミドルウェア
│   └── utils/                 # ユーティリティ関数
├── prisma/                    # Prisma 設定
│   ├── schema.prisma          # Prisma データモデル
│   └── seed.ts                # シードデータ
├── tests/                     # テスト
│   ├── unit/                  # ユニットテスト
│   └── integration/           # 統合テスト
├── docs/                      # ドキュメント
│   └── api-spec.yaml          # API 仕様（Swagger）
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

**内容**：
- Express バックエンドサーバー
- Prisma ORM（SQLite/PostgreSQL）
- Vitest テストフレームワーク
- Swagger API ドキュメント

**生成タイミング**：Code ステージ完了後。

### client/ - フロントエンドコードディレクトリ

**アーティファクトファイル**：
```
client/
├── src/                       # ソースコード
│   ├── screens/               # 画面
│   ├── components/            # コンポーネント
│   ├── navigation/            # ナビゲーション設定
│   ├── services/              # API サービス
│   └── utils/                 # ユーティリティ関数
├── __tests__/                 # テスト
│   └── components/            # コンポーネントテスト
├── assets/                    # 静的リソース
├── app.json                   # Expo 設定
├── package.json
├── tsconfig.json
└── README.md
```

**内容**：
- React Native + Expo
- React Navigation
- Jest + React Testing Library
- TypeScript

**生成タイミング**：Code ステージ完了後。

### validation/ - 検証アーティファクトディレクトリ

**アーティファクトファイル**：
- `report.md`：コード品質検証レポート

**内容**：
- 依存関係インストール検証
- TypeScript 型チェック
- Prisma schema 検証
- テストカバレッジ

**生成タイミング**：Validation ステージ完了後。

### preview/ - Preview アーティファクトディレクトリ

**アーティファクトファイル**：
- `README.md`：デプロイと実行ガイド
- `GETTING_STARTED.md`：クイックスタートガイド

**内容**：
- ローカル実行手順
- Docker デプロイ設定
- CI/CD パイプライン
- アクセスアドレスとデモフロー

**生成タイミング**：Preview ステージ完了後。

### _failed/ - 失敗アーティファクトアーカイブ

**用途**：失敗ステージのアーティファクトを保存し、デバッグを容易にします。

**ディレクトリ構造**：
```
_failed/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**生成タイミング**：あるステージが連続して2回失敗した後。

### _untrusted/ - 権限超過アーティファクト隔離

**用途**：権限超過エージェントが書き込んだファイルを保存し、メインアーティファクトの汚染を防ぎます。

**ディレクトリ構造**：
```
_untrusted/
├── bootstrap/
├── prd/
├── ui/
├── tech/
├── code/
├── validation/
└── preview/
```

**生成タイミング**：エージェントが未承認ディレクトリへの書き込みを試みた時。

---

## よくある質問

### 1. .factory/ 以下のファイルを手動で修正できますか？

::: warning 慎重に修正
`.factory/` 以下のファイルを**直接修正することは推奨されません**。自分が何をしているかを完全に理解していない限り、誤った修正によりパイプラインが正常に動作しなくなる可能性があります。

設定をカスタマイズする必要がある場合は、まず `config.yaml` ファイルの修正を検討してください。
:::

### 2. artifacts/ 以下のファイルを手動で修正できますか？

**可能です**。`artifacts/` 以下のファイルはパイプラインの出力アーティファクトであり、以下のことができます：

- `input/idea.md` または `artifacts/prd/prd.md` を修正して製品方向を調整
- `artifacts/backend/` または `artifacts/client/` のコードを手動で修正
- `artifacts/ui/preview.web/index.html` のスタイルを調整

修正後、対応するステージからパイプラインを再実行できます。

### 3. _failed/ と _untrusted/ 以下のファイルはどう処理しますか？

- **_failed/**：失敗の原因を確認し、問題を修正してから該当ステージを再実行します。
- **_untrusted/**：ファイルが存在すべきかどうかを確認し、存在すべき場合は正しいディレクトリに移動します。

### 4. state.json ファイルが破損した場合はどうしますか？

`state.json` が破損した場合、以下のコマンドを実行してリセットできます：

```bash
factory reset
```

### 5. パイプラインの現在の状態を確認するには？

以下のコマンドを実行して現在の状態を確認します：

```bash
factory status
```

---

## 本レッスンのまとめ

本レッスンでは、Factory プロジェクトの完全なディレクトリ構造を詳しく解説しました：

- ✅ `.factory/`：Factory コア設定（pipeline、agents、skills、policies）
- ✅ `.claude/`：Claude Code 権限設定
- ✅ `input/`：ユーザー入力（idea.md）
- ✅ `artifacts/`：パイプラインアーティファクト（prd、ui、tech、backend、client、validation、preview）
- ✅ `_failed/` と `_untrusted/`：失敗と権限超過アーティファクトアーカイブ

これらのディレクトリ構造を理解することで、ファイルを素早く特定し、設定を修正し、問題をデバッグすることができます。

---

## 次のレッスン予告

> 次のレッスンでは **[コード規約](../code-standards/)** を学習します。
>
> 学習内容：
> - TypeScript コーディング規約
> - ファイル構造と命名規約
> - コメントとドキュメント要件
> - Git コミットメッセージ規約
