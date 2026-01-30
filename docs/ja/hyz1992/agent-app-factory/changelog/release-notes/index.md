---
title: "更新ログ：バージョン履歴と機能変更 | Agent App Factory"
sidebarTitle: "更新ログ"
subtitle: "更新ログ：バージョン履歴と機能変更 | Agent App Factory"
description: "Agent App Factory のバージョン更新履歴、機能変更、バグ修正、重要な改善を確認します。このページでは 1.0.0 バージョンからの完全な変更履歴を記録し、7段階パイプラインシステム、Sisyphus スケジューラー、権限管理、コンテキスト最適化、失敗処理戦略などの主要機能と改善が含まれます。"
tags:
  - "更新ログ"
  - "バージョン履歴"
prerequisite: []
order: 250
---

# 更新ログ

このページは Agent App Factory のバージョン更新履歴を記録し、新機能、改善、バグ修正、破壊的変更を含みます。

形式は [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 仕様に従い、バージョン番号は [Semantic Versioning](https://semver.org/lang/zh-CN/) に従います。

## [1.0.0] - 2024-01-29

### 新規追加

**コア機能**
- **7段階パイプラインシステム**：アイデアから実行可能なアプリまでの完全な自動化プロセス
  - Bootstrap - 構造化された製品アイデア（input/idea.md）
  - PRD - 製品要件ドキュメントの生成（artifacts/prd/prd.md）
  - UI - UI構造とプレビュー可能なプロトタイプの設計（artifacts/ui/）
  - Tech - 技術アーキテクチャと Prisma データモデルの設計（artifacts/tech/）
  - Code - フロントエンドとバックエンドのコード生成（artifacts/backend/, artifacts/client/）
  - Validation - コード品質の検証（artifacts/validation/report.md）
  - Preview - デプロイガイドの生成（artifacts/preview/README.md）

- **Sisyphus スケジューラー**：パイプラインのコア制御コンポーネント
  - pipeline.yaml で定義された各 Stage を順次実行
  - 各段階の入力/出力と終了条件を検証
  - パイプライン状態の維持（.factory/state.json）
  - 権限チェックを実行し、Agent の不正な読み書きを防止
  - 失敗戦略に基づいて異常状況を処理
  - 各チェックポイントで一時停止し、手動確認後に継続

**CLIツール**
- `factory init` - Factory プロジェクトの初期化
- `factory run [stage]` - パイプラインの実行（現在または指定段階から）
- `factory continue` - 新しいセッションで実行を継続（Token の節約）
- `factory status` - 現在のプロジェクト状態を確認
- `factory list` - すべての Factory プロジェクトを一覧表示
- `factory reset` - 現在のプロジェクト状態をリセット

**権限とセキュリティ**
- **能力境界マトリックス**（capability.matrix.md）：各 Agent の厳格な読み書き権限を定義
  - 各 Agent は認可されたディレクトリにのみアクセス可能
  - 不正なファイル書き込みは artifacts/_untrusted/ に移動
  - 失敗後はパイプラインを自動的に一時停止し、手動介入を待機

**コンテキスト最適化**
- **サブセッション実行**：各段階を新しいセッションで実行
  - コンテキストの蓄積を回避し、Token を節約
  - 中断と復旧をサポート
  - すべての AI アシスタント（Claude Code、OpenCode、Cursor）に対応

**失敗処理戦略**
- 自動再試行メカニズム：各段階で1回の再試行を許可
- 失敗アーカイブ：失敗した成果物を artifacts/_failed/ に移動
- ロールバックメカニズム：最近の成功したチェックポイントにロールバック
- 手動介入：2回連続で失敗した後、一時停止

**品質保証**
- **コード規約**（code-standards.md）
  - TypeScript コーディング規約とベストプラクティス
  - ファイル構造と命名規則
  - コメントとドキュメントの要件
  - Git コミットメッセージ規約（Conventional Commits）

- **エラーコード規約**（error-codes.md）
  - 統一エラーコード構造：[MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - 標準エラータイプ：VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - フロントエンドとバックエンドのエラーコードマッピングとユーザーフレンドリーなヒント

**Changelog 管理**
- Keep a Changelog 形式に従う
- Conventional Commits との統合
- 自動化ツールのサポート：conventional-changelog-cli, release-it

**設定テンプレート**
- CI/CD 設定（GitHub Actions）
- Git Hooks 設定（Husky）

**生成されたアプリの特性**
- 完全なフロントエンドとバックエンドのコード（Express + Prisma + React Native）
- 単体テストと統合テスト（Vitest + Jest）
- API ドキュメント（Swagger/OpenAPI）
- データベースシードデータ
- Docker デプロイ設定
- エラーハンドリングとログ監視
- パフォーマンス最適化とセキュリティチェック

### 改善

**MVP に焦点を絞る**
- 非目標（Non-Goals）を明確にリスト化し、スコープの拡張を防止
- ページ数を3ページ以内に制限
- コア機能に集中し、過度な設計を回避

**責任の分離**
- 各 Agent は自分の領域のみを担当し、境界を越えない
- PRD は技術詳細を含まず、Tech は UI 設計に関与しない
- Code Agent は厳格に UI Schema と Tech 設計に従って実装

**検証可能性**
- 各段階で明確な exit_criteria を定義
- すべての機能はテスト可能でローカルで実行可能
- 成果物は構造化され、下流で消費可能である必要あり

### 技術スタック

**CLI ツール**
- Node.js >= 16.0.0
- Commander.js - コマンドラインフレームワーク
- Chalk - カラフルなターミナル出力
- Ora - 進行状況インジケーター
- Inquirer - インタラクティブコマンドライン
- fs-extra - ファイルシステム操作
- YAML - YAML パーサー

**生成されたアプリ**
- バックエンド：Node.js + Express + Prisma + TypeScript + Vitest
- フロントエンド：React Native + Expo + TypeScript + Jest + React Testing Library
- デプロイ：Docker + GitHub Actions

### 依存関係

- `chalk@^4.1.2` - ターミナルカラースタイル
- `commander@^11.0.0` - コマンドライン引数パーサー
- `fs-extra@^11.1.1` - ファイルシステム拡張
- `inquirer@^8.2.5` - インタラクティブコマンドライン
- `ora@^5.4.1` - エレガントなターミナルローダー
- `yaml@^2.3.4` - YAML パーサーとシリアライザー

## バージョン情報

### Semantic Versioning

このプロジェクトは [Semantic Versioning](https://semver.org/lang/zh-CN/) バージョン番号形式に従います：MAJOR.MINOR.PATCH

- **MAJOR**：互換性のない API 変更
- **MINOR**：後方互換性のある新機能
- **PATCH**：後方互換性のあるバグ修正

### 変更タイプ

- **新規追加**（Added）：新機能
- **変更**（Changed）：既存機能の変更
- **非推奨**（Deprecated）：間もなく削除される機能
- **削除**（Removed）：既に削除された機能
- **修正**（Fixed）：バグ修正
- **セキュリティ**（Security）：セキュリティ修正

## 関連リソース

- [GitHub Releases](https://github.com/hyz1992/agent-app-factory/releases) - 公式リリースページ
- [プロジェクトリポジトリ](https://github.com/hyz1992/agent-app-factory) - ソースコード
- [問題追跡](https://github.com/hyz1992/agent-app-factory/issues) - 問題と提案のフィードバック
- [貢献ガイド](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - 貢献方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2024-01-29

| 機能        | ファイルパス                                                                                                                               | 行番号    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json)                                                  | 1-52    |
| CLI エントリー     | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)                                        | 1-123   |
| 初期化コマンド   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)                                  | 1-427   |
| 実行コマンド     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js)                                     | 1-294   |
| 継続コマンド     | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js)                            | 1-87    |
| パイプライン定義   | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)                                               | 1-87    |
| スケジューラー定義   | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md)          | 1-301   |
| 権限マトリックス     | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md)                  | 1-44    |
| 失敗戦略     | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md)                        | 1-200   |
| コード規約     | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md)                        | 1-287   |
| エラーコード規約   | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md)                              | 1-134   |
| Changelog 規約 | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md)                                  | 1-87    |

**主要バージョン情報**：
- `version = "1.0.0"`：初期リリースバージョン
- `engines.node = ">=16.0.0"`：最低 Node.js バージョン要件

**依存関係バージョン**：
- `chalk@^4.1.2`：ターミナルカラースタイル
- `commander@^11.0.0`：コマンドライン引数パーサー
- `fs-extra@^11.1.1`：ファイルシステム拡張
- `inquirer@^8.2.5`：インタラクティブコマンドライン
- `ora@^5.4.1`：エレガントなターミナルローダー
- `yaml@^2.3.4`：YAML パーサーとシリアライザー

</details>
