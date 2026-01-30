---
title: "バージョンログ: 機能アップデート | OpenSkills"
sidebarTitle: "新機能を見る"
subtitle: "バージョンログ: 機能アップデート | OpenSkills"
description: "OpenSkillsのバージョン変更履歴を確認し、updateコマンド、シンボリックリンク、プライベートリポジトリなどの新機能、およびパストラバーサル保護などの重要な改善と問題修正を確認しましょう。"
tags:
  - "changelog"
  - "version history"
order: 1
---

# 更新履歴

本ページでは、OpenSkillsのバージョン変更履歴を記録し、各バージョンの新機能、改善、および問題修正について理解できるようにします。

---

## [1.5.0] - 2026-01-17

### 新機能

- **`openskills update`** - 記録されたソースからインストール済みスキルを更新（デフォルト：すべて更新）
- **ソースメタデータ追跡** - インストール時にソース情報を記録し、スキルの確実な更新に使用

### 改善

- **複数スキル読み取り** - `openskills read`コマンドが、コンマ区切りのスキル名リストをサポート
- **生成される使用説明の最適化** - シェル環境でのreadコマンド呼び出しヒントを最適化
- **README** - 更新ガイドと手動使用のヒントを追加

### 問題修正

- **更新体験の最適化** - ソースメタデータのないスキルをスキップし、これらのスキルをリストして再インストールを促す

---

## [1.4.0] - 2026-01-17

### 改善

- **README** - プロジェクトローカルのデフォルトインストール方法を明確化し、冗長なsyncヒントを削除
- **インストールメッセージ** - インストーラーがプロジェクトローカルのデフォルトインストールと`--global`オプションを明確に区別

---

## [1.3.2] - 2026-01-17

### 改善

- **ドキュメントとAGENTS.mdガイド** - すべてのコマンド例と生成される使用説明が`npx openskills`を統一的に使用

---

## [1.3.1] - 2026-01-17

### 問題修正

- **Windowsインストール** - Windowsシステムのパス検証問題を修正（"Security error: Installation path outside target directory"）
- **CLIバージョン** - `npx openskills --version`がpackage.jsonからバージョン番号を正しく読み取るよう修正
- **ルートディレクトリのSKILL.md** - ルートディレクトリのSKILL.mdを持つ単一スキルリポジトリのインストール問題を修正

---

## [1.3.0] - 2025-12-14

### 新機能

- **シンボリックリンクサポート** - スキルをシンボリックリンク経由でスキルディレクトリにインストール可能 ([#3](https://github.com/numman-ali/openskills/issues/3))
  - クローン済みリポジトリからシンボリックリンクを作成してgitベースのスキル更新を実現
  - ローカルスキル開発ワークフローをサポート
  - 壊れたシンボリックリンクは適切にスキップされる

- **設定可能な出力パス** - syncコマンドに`--output` / `-o`オプションを追加 ([#5](https://github.com/numman-ali/openskills/issues/5))
  - 任意の`.md`ファイルに同期可能（例：`.ruler/AGENTS.md`）
  - ファイルが存在しない場合は自動的にファイルを作成しタイトルを追加
  - 必要に応じてネストされたディレクトリを自動的に作成

- **ローカルパスインストール** - ローカルディレクトリからスキルをインストール可能 ([#10](https://github.com/numman-ali/openskills/issues/10))
  - 絶対パス（`/path/to/skill`）をサポート
  - 相対パス（`./skill`、`../skill`）をサポート
  - チルダ展開（`~/my-skills/skill`）をサポート

- **プライベートgitリポジトリサポート** - プライベートリポジトリからスキルをインストール可能 ([#10](https://github.com/numman-ali/openskills/issues/10))
  - SSH URL（`git@github.com:org/private-skills.git`）
  - 認証付きHTTPS URL
  - システムSSHキーを自動使用

- **包括的なテストスイート** - 6つのテストファイルで88個のテスト
  - シンボリックリンク検出、YAML解析のユニットテスト
  - install、syncコマンドの統合テスト
  - 完全なCLIワークフローのエンドツーエンドテスト

### 改善

- **`--yes`フラグがすべてのプロンプトをスキップ** - 完全非対話モードでCI/CDに最適 ([#6](https://github.com/numman-ali/openskills/issues/6))
  - 既存スキル上書き時のプロンプトをスキップ
  - プロンプトスキップ時に`Overwriting: <skill-name>`メッセージを表示
  - すべてのコマンドがヘッドレス環境で実行可能

- **CIワークフローの再配置** - ビルドステップがテストの前に実行されるよう変更
  - エンドツーエンドテスト用に`dist/cli.js`が存在することを保証

### セキュリティ

- **パストラバーサル保護** - インストールパスがターゲットディレクトリ内に収まることを検証
- **シンボリックリンクの参照解除** - `cpSync`は`dereference: true`を使用してシンボリックリンクターゲットを安全にコピー
- **非貪欲なYAML正規表現** - frontmatter解析で潜在的なReDoS攻撃を防止

---

## [1.2.1] - 2025-10-27

### 問題修正

- READMEドキュメントのクリーンアップ - 重複部分と間違ったフラグを削除

---

## [1.2.0] - 2025-10-27

### 新機能

- `--universal`フラグでスキルを`.claude/skills/`ではなく`.agent/skills/`にインストール
  - マルチエージェント環境に対応（Claude Code + Cursor/Windsurf/Aider）
  - Claude Codeのネイティブマーケットプラグインとの競合を回避

### 改善

- プロジェクトローカルインストールがデフォルトになりました（以前はグローバルインストール）
- スキルはデフォルトで`./.claude/skills/`にインストールされます

---

## [1.1.0] - 2025-10-27

### 新機能

- 技術的な深い洞察を含む包括的な単一ページREADME
- Claude Codeとの並列比較

### 問題修正

- インストール位置に応じてロケーションプロンプトが正しく`project`または`global`を表示するよう修正

---

## [1.0.0] - 2025-10-26

### 新機能

- 初期リリース
- `npx openskills install <source>` - GitHubリポジトリからスキルをインストール
- `npx openskills sync` - AGENTS.md用の`<available_skills>` XMLを生成
- `npx openskills list` - インストール済みスキルを表示
- `npx openskills read <name>` - エージェント用にスキルコンテンツを読み込み
- `npx openskills manage` - 対話的なスキル削除
- `npx openskills remove <name>` - 指定したスキルを削除
- すべてのコマンドの対話的なTUIインターフェース
- AnthropicのSKILL.md形式に対応
- プログレッシブディスクロージャ（スキルのオンデマンド読み込み）
- バンドルリソースに対応（references/、scripts/、assets/）

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコード位置を確認</strong></summary>

> 更新日時：2026-01-24

| 機能           | ファイルパス                                                                      |
| --- | ---|
| 更新ログ原文   | [`CHANGELOG.md`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md) |

</details>
