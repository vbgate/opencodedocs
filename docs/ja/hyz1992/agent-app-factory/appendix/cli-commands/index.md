---
title: "CLI コマンドリファレンス：完全なコマンドリストと引数 | Agent App Factory チュートリアル"
sidebarTitle: "CLI コマンド完全ガイド"
subtitle: "CLI コマンドリファレンス：完全なコマンドリストと引数説明"
description: "Agent App Factory CLI コマンドの完全なリファレンス。init、run、continue、status、list、reset の6つのコマンドのパラメータ説明と使用例を含み、コマンドラインツールを素早く習得できます。"
tags:
  - "CLI"
  - "コマンドライン"
  - "リファレンス"
order: 210
---

# CLI コマンドリファレンス：完全なコマンドリストと引数説明

この章では Agent App Factory CLI ツールの完全なコマンドリファレンスを提供します。

## コマンド概要

| コマンド | 機能 | 使用シナリオ |
| ----- | ---- | ---- |
| `factory init` | Factory プロジェクトを初期化 | 新しいプロジェクトを開始 |
| `factory run [stage]` | パイプラインを実行 | パイプラインを実行または継続 |
| `factory continue` | 新しいセッションで継続 | Token を節約、セッションを分割して実行 |
| `factory status` | プロジェクトの状態を確認 | 現在の進捗を確認 |
| `factory list` | すべてのプロジェクトを一覧表示 | 複数のプロジェクトを管理 |
| `factory reset` | プロジェクトの状態をリセット | パイプラインを最初からやり直す |

---

## factory init

現在のディレクトリを Factory プロジェクトとして初期化します。

### 構文

```bash
factory init [options]
```

### パラメータ

| パラメータ | 短縮形 | 型 | 必須 | 説明 |
| ---- | ----- | ---- | ---- | ---- |
| `--name` | `-n` | string | いいえ | プロジェクト名 |
| `--description` | `-d` | string | いいえ | プロジェクトの説明 |

### 機能説明

`factory init` コマンドを実行すると、以下の処理が行われます：

1. ディレクトリの安全性をチェック（`.git`、`.gitignore`、`README.md` などの設定ファイルのみ許可）
2. `.factory/` ディレクトリを作成
3. 以下のファイルを `.factory/` にコピー：
   - `agents/` - Agent 定義ファイル
   - `skills/` - スキルモジュール
   - `policies/` - ポリシードキュメント
   - `templates/` - 設定テンプレート
   - `pipeline.yaml` - パイプライン定義
4. `config.yaml` と `state.json` を生成
5. `.claude/settings.local.json` を生成（Claude Code 権限設定）
6. 必要なプラグインのインストールを試みます：
   - superpowers（Bootstrap 段階で必要）
   - ui-ux-pro-max-skill（UI 段階で必要）
7. AI アシスタント（Claude Code または OpenCode）を自動的に起動

### 例

**プロジェクトを初期化し、名前と説明を指定する**：

```bash
factory init --name "Todo App" --description "シンプルな ToDo アプリケーション"
```

**現在のディレクトリでプロジェクトを初期化する**：

```bash
factory init
```

### 注意事項

- ディレクトリは空であるか、設定ファイル（`.git`、`.gitignore`、`README.md`）のみを含む必要があります
- すでに `.factory/` ディレクトリが存在する場合、`factory reset` を使用してリセットするようにプロンプトが表示されます

---

## factory run

パイプラインを実行し、現在の段階または指定された段階から開始します。

### 構文

```bash
factory run [stage] [options]
```

### パラメータ

| パラメータ | 短縮形 | 型 | 必須 | 説明 |
| ---- | ----- | ---- | ---- | ---- |
| `stage` | - | string | いいえ | パイプライン段階名（bootstrap/prd/ui/tech/code/validation/preview） |

### オプション

| オプション | 短縮形 | 型 | 説明 |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | 確認プロンプトをスキップ |

### 機能説明

`factory run` コマンドを実行すると、以下の処理が行われます：

1. Factory プロジェクトかどうかを確認
2. `config.yaml` と `state.json` を読み込む
3. 現在のパイプラインの状態を表示
4. ターゲット段階を決定（パラメータで指定または現在の段階）
5. AI アシスタントの種類を検出（Claude Code / Cursor / OpenCode）
6. 対応するアシスタントの実行コマンドを生成
7. 利用可能な段階のリストと進捗を表示

### 例

**bootstrap 段階からパイプラインを実行する**：

```bash
factory run bootstrap
```

**現在の段階から実行を継続する**：

```bash
factory run
```

**確認をスキップして直接実行する**：

```bash
factory run bootstrap --force
```

### 出力例

```
Agent Factory - Pipeline Runner

Pipeline Status:
───────────────────────────────────────
Project: Todo App
Status: Running
Current Stage: bootstrap
Completed: 

🤖 Claude Code Instructions:
───────────────────────────
This is an Agent Factory project. To execute the pipeline:

1. Read pipeline definition:
   Read(/path/to/.factory/pipeline.yaml)

2. Read orchestrator agent:
   Read(/path/to/.factory/agents/orchestrator.checkpoint.md)

3. Read project config:
   Read(/path/to/.factory/config.yaml)

Then execute the pipeline starting from: bootstrap

───────────────────────────────────────
Available stages:
  ○ bootstrap
  ○ prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

───────────────────────────────────────
Ready! Follow instructions above to continue.
```

---

## factory continue

新しいセッションでパイプラインの実行を継続し、Token を節約します。

### 構文

```bash
factory continue
```

### 機能説明

`factory continue` コマンドを実行すると、以下の処理が行われます：

1. Factory プロジェクトかどうかを確認
2. `state.json` を読み込んで現在の状態を取得
3. Claude Code の権限設定を再生成
4. 新しい Claude Code ウィンドウを起動
5. 現在の段階から実行を継続

### 使用シナリオ

- 各段階の完了後に Token の蓄積を回避
- 各段階でクリーンなコンテキストを享受
- 中断からの回復をサポート

### 例

**パイプラインの実行を継続する**：

```bash
factory continue
```

### 注意事項

- Claude Code がインストールされている必要があります
- 自動的に新しい Claude Code ウィンドウが起動します

---

## factory status

現在の Factory プロジェクトの詳細な状態を表示します。

### 構文

```bash
factory status
```

### 機能説明

`factory status` コマンドを実行すると、以下の情報が表示されます：

- プロジェクト名、説明、パス、作成日時
- パイプラインの状態（idle/running/waiting_for_confirmation/paused/failed/completed）
- 現在の段階
- 完了した段階のリスト
- 各段階の進捗
- 入力ファイルの状態（input/idea.md）
- 生成物ディレクトリの状態（artifacts/）
- 生成物ファイルの数とサイズ

### 例

```bash
factory status
```

### 出力例

```
Agent Factory - Project Status

Project:
  Name: Todo App
  Description: シンプルな ToDo アプリケーション
  Path: /Users/user/Projects/todo-app
  Created: 2026-01-29T10:00:00.000Z

Pipeline:
  Status: Running
  Current Stage: prd
  Completed: bootstrap

Progress:
  ✓ bootstrap
  → prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

Input:
  File: input/idea.md
  Lines: 25
  Preview:
    # Todo App

    シンプルな ToDo アプリケーション...

Artifacts:
  ✓ prd (3 files, 12.5 KB)

───────────────────────────────────────
Commands:
  factory run     - Run pipeline
  factory run <stage> - Run from stage
  factory reset  - Reset pipeline state
```

---

## factory list

すべての Factory プロジェクトを一覧表示します。

### 構文

```bash
factory list
```

### 機能説明

`factory list` コマンドを実行すると、以下の処理が行われます：

1. よく使用されるプロジェクトディレクトリを検索（`~/Projects`、`~/Desktop`、`~/Documents`、`~`）
2. 現在のディレクトリとその親ディレクトリを検索（最大3階層）
3. `.factory/` ディレクトリを含むすべてのプロジェクトを一覧表示
4. プロジェクトの状態を表示（実行中、待機中、失敗、完了の順にソート）

### 例

```bash
factory list
```

### 出力例

```
Agent Factory - Projects

Found 2 project(s):

◉ Todo App
  シンプルな ToDo アプリケーション
  Path: /Users/user/Projects/todo-app
  Stage: prd

○ Blog System
  ブログシステム
  Path: /Users/user/Projects/blog
  Completed: bootstrap

───────────────────────────────────────
Work on a project: cd <path> && factory run
```

---

## factory reset

現在のプロジェクトのパイプラインの状態をリセットし、生成物を保持します。

### 構文

```bash
factory reset [options]
```

### オプション

| オプション | 短縮形 | 型 | 説明 |
| ---- | ----- | ---- | ---- |
| `--force` | `-f` | flag | 確認をスキップ |

### 機能説明

`factory reset` コマンドを実行すると、以下の処理が行われます：

1. Factory プロジェクトかどうかを確認
2. 現在の状態を表示
3. リセットを確認（`--force` を使用しない場合）
4. `state.json` を初期状態にリセット
5. `config.yaml` のパイプライン部分を更新
6. すべての `artifacts/` 生成物を保持

### 使用シナリオ

- bootstrap 段階からやり直す
- 状態エラーをクリアする
- パイプラインを再設定する

### 例

**プロジェクトの状態をリセットする**：

```bash
factory reset
```

**確認をスキップしてリセットする**：

```bash
factory reset --force
```

### 注意事項

- パイプラインの状態のみをリセットし、生成物は削除されません
- プロジェクトを完全に削除するには、`.factory/` と `artifacts/` ディレクトリを手動で削除する必要があります

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-29

| コマンド | ファイルパス | 行番号 |
| ----- | --------- | ---- |
| CLI エントリポイント | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 17-122 |
| init コマンド | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| run コマンド | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-335 |
| continue コマンド | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |
| status コマンド | [`cli/commands/status.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/status.js) | 1-203 |
| list コマンド | [`cli/commands/list.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/list.js) | 1-160 |
| reset コマンド | [`cli/commands/reset.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/reset.js) | 1-100 |

**重要な関数**：
- `getFactoryRoot()` - Factory ルートディレクトリを取得（factory.js:22-52）
- `isFactoryProject()` - Factory プロジェクトかどうかを確認（init.js:22-26）
- `generateConfig()` - プロジェクト設定を生成（init.js:58-76）
- `launchClaudeCode()` - Claude Code を起動（init.js:119-147）
- `launchOpenCode()` - OpenCode を起動（init.js:152-215）
- `detectAIAssistant()` - AI アシスタントの種類を検出（run.js:105-124）
- `updateState()` - パイプラインの状態を更新（run.js:94-100）

**依存ライブラリ**：
- `commander` - CLI パラメータ解析
- `chalk` - ターミナルのカラフルな出力
- `ora` - ローディングアニメーション
- `inquirer` - インタラクティブなプロンプト
- `yaml` - YAML ファイル解析
- `fs-extra` - ファイルシステム操作

</details>
