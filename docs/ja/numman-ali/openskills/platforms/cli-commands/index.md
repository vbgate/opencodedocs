---
title: "コマンド詳解: OpenSkills CLI リファレンス | openskills"
sidebarTitle: "7つのコマンドを完全掌握"
subtitle: "コマンド詳解: OpenSkills CLI リファレンス"
description: "OpenSkills の 7 つのコマンドとパラメータの使用方法を学びます。install、list、read、update、sync、manage、remove の完全なリファレンスを習得し、CLI ツールの効率を向上させます。"
tags:
  - "CLI"
  - "コマンドリファレンス"
  - "チートシート"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: "1"
---
# コマンド詳解：OpenSkills 完整コマンドチートシート

## 学んだ後にできること

- 7 つの OpenSkills コマンドを自如に使いこなせる
- グローバルオプションの役割と適用シーンを理解できる
- コマンドパラメータとフラグの意味を素早く調べられる
- スクリプトで非対話式コマンドを使用する

## コマンド一覧

OpenSkills は以下の 7 つのコマンドを提供します：

| コマンド | 用途 | 使用シーン |
| --- | --- | --- |
| `install` | スキルをインストール | GitHub、ローカルパス、またはプライベートリポジトリから新スキルをインストール |
| `list` | スキルを一覧表示 | インストール済みのすべてのスキルと場所を確認 |
| `read` | スキルを読み込む | AI エージェントにスキルコンテンツを読み込ませる（通常はエージェントが自動呼び出し） |
| `update` | スキルを更新 | ソースリポジトリからインストール済みのスキルを更新 |
| `sync` | 同期 | スキルリストを AGENTS.md に書き込み |
| `manage` | 管理 | 対話形式でスキルを削除 |
| `remove` | 削除 | 指定したスキルを削除（スクリプト化方式） |

::: info ヒント
`npx openskills --help` を使用すると、すべてのコマンドの概要説明を確認できます。
:::

## グローバルオプション

一部コマンドは以下のグローバルオプションをサポートします：

| オプション | 省略形 | 作用 | 適用コマンド |
| --- | --- | --- | --- |
| `--global` | `-g` | グローバルディレクトリ `~/.claude/skills/` にインストール | `install` |
| `--universal` | `-u` | ユニバーサルディレクトリ `.agent/skills/` にインストール（マルチエージェント環境） | `install` |
| `--yes` | `-y` | 対話式プロンプトをスキップしデフォルト動作を使用 | `install`, `sync` |
| `--output <path>` | `-o <path>` | 出力ファイルパスを指定 | `sync` |

## コマンド詳解

### install - スキルをインストール

Git リポジトリ、ローカルパス、またはプライベート git リポジトリからスキルをインストールします。

```bash
openskills install <source> [options]
```

**パラメータ**：

| パラメータ | 必須 | 説明 |
| --- | --- | --- |
| `<source>` | ✅ | スキルソース（GitHub ショートハンド、git URL、またはローカルパス） |

**オプション**：

| オプション | 省略形 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `--global` | `-g` | `false` | グローバルディレクトリ `~/.claude/skills/` にインストール |
| `--universal` | `-u` | `false` | ユニバーサルディレクトリ `.agent/skills/` にインストール |
| `--yes` | `-y` | `false` | 対話式選択をスキップし、見つかったすべてのスキルをインストール |

**source パラメータの例**：

```bash
# GitHub ショートハンド（推奨）
openskills install anthropics/skills

# ブランチを指定
openskills install owner/repo@branch

# プライベートリポジトリ
openskills install git@github.com:owner/repo.git

# ローカルパス
openskills install ./path/to/skill

# Git URL
openskills install https://github.com/owner/repo.git
```

**動作説明**：

- インストール時に見つかったすべてのスキルを一覧表示して選択
- `--yes` を使用すると選択をスキップし、すべてのスキルをインストール
- インストール優先順位：`--universal` → `--global` → デフォルトプロジェクトディレクトリ
- インストール後、スキルディレクトリに `.openskills.json` メタデータファイルが作成される

---

### list - スキルを一覧表示

インストール済みのすべてのスキルを一覧表示します。

```bash
openskills list
```

**オプション**：なし

**出力フォーマット**：

```
利用可能なスキル：

skill-name           [説明]            (project/global)
```

**動作説明**：

- 位置でソート：プロジェクトスキルが前、グローバルスキルが後
- 同一位置内ではアルファベット順でソート
- スキル名、説明、位置ラベルを表示

---

### read - スキルを読み込む

1 つまたは複数のスキルの内容を標準出力に出力します。このコマンドは AI エージェントがオンデマンドでスキルをロードするために主に使用されます。

```bash
openskills read <skill-names...>
```

**パラメータ**：

| パラメータ | 必須 | 説明 |
| --- | --- | --- |
| `<skill-names...>` | ✅ | スキル名のリスト（複数対応、スペースまたはカンマ区切り） |

**オプション**：なし

**例**：

```bash
# 単一スキルの読み込み
openskills read pdf

# 複数スキルの読み込み
openskills read pdf git

# カンマ区切りも対応
openskills read "pdf,git,excel"
```

**出力フォーマット**：

```
スキル: pdf
ベースディレクトリ: /path/to/.claude/skills/pdf

---SKILL.md コンテンツ---

[SKILL.END]
```

**動作説明**：

- 4 つのディレクトリ優先順位でスキルを検索
- スキル名、ベースディレクトリパス、完全な SKILL.md コンテンツを出力
- 見つからないスキルはエラーメッセージを表示

---

### update - スキルを更新

記録されたソースからインストール済みのスキルを更新します。スキル名を指定しない場合、すべてのインストール済みのスキルを更新します。

```bash
openskills update [skill-names...]
```

**パラメータ**：

| パラメータ | 必須 | 説明 |
| --- | --- | --- |
| `[skill-names...]` | ❌ | 更新するスキル名のリスト（デフォルトは全スキル） |

**オプション**：なし

**例**：

```bash
# 全スキルを更新
openskills update

# 指定スキルを更新
openskills update pdf git

# カンマ区切りも対応
openskills update "pdf,git,excel"
```

**動作説明**：

- メタデータを持つスキルのみ更新（即ち install でインストールしたスキル）
- メタデータのないスキルはスキップして通知
- 成功后、安装時間戳を更新
- Git リポジトリから更新時はシャロークローンを使用（`--depth 1`）

---

### sync - AGENTS.md に同期

インストール済みのスキルを AGENTS.md（またはその他のカスタムファイル）に同期し、AI エージェントが使用するスキルリストを生成します。

```bash
openskills sync [options]
```

**オプション**：

| オプション | 省略形 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `--output <path>` | `-o <path>` | `AGENTS.md` | 出力ファイルパス |
| `--yes` | `-y` | `false` | 対話式選択をスキップし、すべてのスキルを同期 |

**例**：

```bash
# デフォルトファイルに同期
openskills sync

# カスタムファイルに同期
openskills sync -o .ruler/AGENTS.md

# 対話式選択をスキップ
openskills sync -y
```

**動作説明**：

- 既存ファイルを解析して有効なスキルをプリセット
- 初回同期時はデフォルトでプロジェクトスキルを選択
- Claude Code 互換の XML フォーマットを生成
- 既存ファイルでスキルセクションを置換または追加 поддержка

---

### manage - スキルを管理

インストール済みのスキルを対話形式で削除します。フレンドリーな削除インターフェースを提供します。

```bash
openskills manage
```

**オプション**：なし

**動作説明**：

- インストール済みのすべてのスキルを表示して選択
- デフォルトではどのスキルも選択されない
- 選択後即座に削除、確認なし

---

### remove - スキルを削除

指定したインストール済みのスキルを削除します（スクリプト化方式）。スクリプトで使用する場合、`manage` より便利です。

```bash
openskills remove <skill-name>
```

**パラメータ**：

| パラメータ | 必須 | 説明 |
| --- | --- | --- |
| `<skill-name>` | ✅ | 削除するスキル名 |

**オプション**：なし

**例**：

```bash
openskills remove pdf

# エイリアスも使用可能
openskills rm pdf
```

**動作説明**：

- スキルディレクトリ全体を削除（すべてのファイルとサブディレクトリ含む）
- 削除位置とソースを表示
- スキルが見つからない場合はエラーメッセージを表示して終了

## クイック操作チートシート

| タスク | コマンド |
| --- | --- |
| インストール済みスキルをすべて表示 | `openskills list` |
| 官方スキルをインストール | `openskills install anthropics/skills` |
| ローカルパスからインストール | `openskills install ./my-skill` |
| スキルをグローバルにインストール | `openskills install owner/skill --global` |
| 全スキルを更新 | `openskills update` |
| 特定のスキルを更新 | `openskills update pdf git` |
| スキルを対話式で削除 | `openskills manage` |
| 指定したスキルを削除 | `openskills remove pdf` |
| AGENTS.md に同期 | `openskills sync` |
| カスタム出力パス | `openskills sync -o custom.md` |

## トラブルシューティング

### 1. コマンドが見つからない

**問題**：コマンド実行時に "command not found" というエラーが表示される

**原因**：
- Node.js が未インストールまたはバージョンが低い（20.6+ が必要）
- `npx` を使用していないか、グローバルインストールされていない

**解決**：
```bash
# npx を使用（推奨）
npx openskills list

# またはグローバルインストール
npm install -g openskills
```

### 2. スキルが見つからない

**問題**：`openskills read skill-name` で "Skill not found" が表示される

**原因**：
- スキルがインストールされていない
- スキル名のスペルが間違っている
- スキールのインストール先が検索パスにない

**解決**：
```bash
# インストール済みスキルを確認
openskills list

# スキルディレクトリを確認
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

### 3. 更新に失敗

**問題**：`openskills update` で "No metadata found" が表示される

**原因**：
- スキルが `install` コマンドでインストールされていない
- メタデータファイル `.openskills.json` が削除された

**解決**：スキルを再インストール
```bash
openskills install <元のソース>
```

## 本セクションのまとめ

OpenSkills は、スキルのインストール、一覧表示、読み込み、更新、同期、管理をカバーする完全なコマンドラインインターフェースを提供します。これらのコマンドを習得することは、OpenSkills を効率的に使用する基盤です：

- `install` - 新スキルをインストール（GitHub、ローカル、プライベートリポジトリ対応）
- `list` - インストール済みスキルの表示
- `read` - スキルコンテンツを読み込む（AI エージェント用）
- `update` - インストール済みスキルの更新
- `sync` - AGENTS.md に同期
- `manage` - スキルを対話式で削除
- `remove` - 指定したスキルを削除

グローバルオプションの役割を覚えておきましょう：
- `--global` / `--universal` - インストール位置を制御
- `--yes` - 対話式プロンプトをスキップ（CI/CD に最適）
- `--output` - 出力ファイルパスをカスタマイズ

## 次回予告

> 次回は **[インストールソース詳解](../install-sources/)** を学びます。
>
> 学べる内容：
> - 3 つのインストール方式の詳細な使い方
> - 各方式の適用シーン
> - プライベートリポジトリの設定方法
