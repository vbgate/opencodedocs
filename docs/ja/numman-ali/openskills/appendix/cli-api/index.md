---
title: "CLI API: コマンドリファレンス | OpenSkills"
subtitle: "CLI API: コマンドリファレンス | OpenSkills"
sidebarTitle: "コマンド完全ガイド"
description: "OpenSkills の完全なコマンドライン API を学習します。すべてのコマンドの引数、オプション、使用例を参照して、コマンドの使い方をすぐにマスターできます。"
tags:
  - "API"
  - "CLI"
  - "コマンドリファレンス"
  - "オプション説明"
prerequisite: []
order: 1
---

# OpenSkills CLI API リファレンス

## 学習後にできること

- OpenSkills のすべてのコマンドの完全な使い方を理解する
- 各コマンドの引数とオプションをマスターする
- コマンドを組み合わせてタスクを完了する方法を知る

## これは何か

OpenSkills CLI API リファレンスは、すべてのコマンドの完全なドキュメントを提供します。引数、オプション、使用例を含みます。これは、特定のコマンドを深く理解する必要があるときに参照するリファレンスマニュアルです。

---

## 概要

OpenSkills CLI は以下のコマンドを提供します：

```bash
openskills install <source>    # スキルをインストール
openskills list                # インストール済みスキルを一覧表示
openskills read <name>         # スキル内容を読み込む
openskills sync                # AGENTS.md に同期
openskills update [name...]    # スキルを更新
openskills manage              # インタラクティブにスキルを管理
openskills remove <name>       # スキルを削除
```

---

## install コマンド

GitHub、ローカルパス、またはプライベート git リポジトリからスキルをインストールします。

### 構文

```bash
openskills install <source> [options]
```

### 引数

| 引数 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `<source>` | string | Y | スキルのソース（下記のソース形式を参照） |

### オプション

| オプション | 短縮形 | 型 | デフォルト | 説明 |
| --- | --- | --- | --- | --- |
| `--global` | `-g` | flag | false | `~/.claude/skills/` にグローバルインストール |
| `--universal` | `-u` | flag | false | `.agent/skills/` にインストール（マルチエージェント環境） |
| `--yes` | `-y` | flag | false | インタラクティブ選択をスキップし、見つかったすべてのスキルをインストール |

### ソース形式

| 形式 | 例 | 説明 |
| --- | --- | --- |
| GitHub 省略形 | `anthropics/skills` | GitHub 公開リポジトリからインストール |
| Git URL | `https://github.com/owner/repo.git` | 完全な Git URL |
| SSH Git URL | `git@github.com:owner/repo.git` | SSH プライベートリポジトリ |
| ローカルパス | `./my-skill` または `~/dev/skills` | ローカルディレクトリからインストール |

### 例

```bash
# GitHub からインストール（インタラクティブ選択）
openskills install anthropics/skills

# GitHub からインストール（非インタラクティブ）
openskills install anthropics/skills -y

# グローバルインストール
openskills install anthropics/skills --global

# マルチエージェント環境にインストール
openskills install anthropics/skills --universal

# ローカルパスからインストール
openskills install ./my-custom-skill

# プライベートリポジトリからインストール
openskills install git@github.com:your-org/private-skills.git
```

### 出力

インストール成功後に表示されます：
- インストールされたスキル一覧
- インストール場所（project/global）
- `openskills sync` の実行を促すメッセージ

---

## list コマンド

すべてのインストール済みスキルを一覧表示します。

### 構文

```bash
openskills list
```

### 引数

なし。

### オプション

なし。

### 例

```bash
openskills list
```

### 出力

```
インストール済みスキル：

┌────────────────────┬────────────────────────────────────┬──────────┐
│ スキル名           │ 説明                               │ 場所     │
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit           │ project  │
│ git-workflow       │ Git workflow automation            │ global   │
│ skill-creator      │ Guide for creating effective skills│ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

統計：3 個のスキル（2 個のプロジェクトレベル、1 個のグローバル）
```

### スキル場所の説明

- **project**: `.claude/skills/` または `.agent/skills/` にインストール
- **global**: `~/.claude/skills/` または `~/.agent/skills/` にインストール

---

## read コマンド

スキル内容を標準出力に読み込みます（AI エージェント用）。

### 構文

```bash
openskills read <skill-names...>
```

### 引数

| 引数 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `<skill-names...>` | string | Y | スキル名（カンマ区切りのリストをサポート） |

### オプション

なし。

### 例

```bash
# 単一スキルを読み込む
openskills read pdf

# 複数スキルを読み込む（カンマ区切り）
openskills read pdf,git-workflow

# 複数スキルを読み込む（スペース区切り）
openskills read pdf git-workflow
```

### 出力

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### 用途

このコマンドは主に AI エージェントがスキル内容を読み込むために使用されます。ユーザーはスキルの詳細な説明を確認するためにも使用できます。

---

## sync コマンド

インストール済みスキルを AGENTS.md（または他のファイル）に同期します。

### 構文

```bash
openskills sync [options]
```

### 引数

なし。

### オプション

| オプション | 短縮形 | 型 | デフォルト | 説明 |
| --- | --- | --- | --- | --- |
| `--output <path>` | `-o` | string | `AGENTS.md` | 出力ファイルパス |
| `--yes` | `-y` | flag | false | インタラクティブ選択をスキップし、すべてのスキルを同期 |

### 例

```bash
# デフォルトの AGENTS.md に同期（インタラクティブ）
openskills sync

# カスタムパスに同期
openskills sync -o .ruler/AGENTS.md

# 非インタラクティブ同期（CI/CD）
openskills sync -y

# カスタムパスへの非インタラクティブ同期
openskills sync -y -o .ruler/AGENTS.md
```

### 出力

同期完了後、指定されたファイルに以下の内容が生成されます：

```xml
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## update コマンド

ソースからインストール済みスキルを更新します。

### 構文

```bash
openskills update [skill-names...]
```

### 引数

| 引数 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `[skill-names...]` | string | N | スキル名（カンマ区切り）、デフォルトはすべて |

### オプション

なし。

### 例

```bash
# すべてのインストール済みスキルを更新
openskills update

# 指定したスキルを更新
openskills update pdf,git-workflow

# 単一スキルを更新
openskills update pdf
```

### 出力

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### 更新ルール

- メタデータ記録があるスキルのみ更新
- ローカルパススキル：ソースパスから直接コピー
- Git リポジトリスキル：再クローンしてコピー
- メタデータのないスキル：スキップして再インストールを促す

---

## manage コマンド

インタラクティブにインストール済みスキルを管理（削除）します。

### 構文

```bash
openskills manage
```

### 引数

なし。

### オプション

なし。

### 例

```bash
openskills manage
```

### インタラクティブインターフェース

```
削除するスキルを選択：

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

操作：[↑/↓] 選択 [スペース] 切り替え [Enter] 確認 [Esc] キャンセル
```

### 出力

```
1 個のスキルを削除しました：
- skill-creator (project)
```

---

## remove コマンド

指定したインストール済みスキルを削除します（スクリプト化方式）。

### 構文

```bash
openskills remove <skill-name>
```

### エイリアス

`rm`

### 引数

| 引数 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `<skill-name>` | string | Y | スキル名 |

### オプション

なし。

### 例

```bash
# スキルを削除
openskills remove pdf

# エイリアスを使用
openskills rm pdf
```

### 出力

```
スキルを削除しました：pdf (project)
場所：/path/to/.claude/skills/pdf
ソース：anthropics/skills
```

---

## グローバルオプション

以下のオプションはすべてのコマンドに適用されます：

| オプション | 短縮形 | 型 | デフォルト | 説明 |
| --- | --- | --- | --- | --- |
| `--version` | `-V` | flag | - | バージョン番号を表示 |
| `--help` | `-h` | flag | - | ヘルプ情報を表示 |

### 例

```bash
# バージョンを表示
openskills --version

# グローバルヘルプを表示
openskills --help

# 特定のコマンドのヘルプを表示
openskills install --help
```

---

## スキル検索優先順位

複数のインストール場所が存在する場合、スキルは以下の優先順位で検索されます（高い順）：

1. `./.agent/skills/` - プロジェクトレベル universal
2. `~/.agent/skills/` - グローバルレベル universal
3. `./.claude/skills/` - プロジェクトレベル
4. `~/.claude/skills/` - グローバルレベル

**重要**：見つかった最初の一致するスキルのみ返されます（最も優先度の高いもの）。

---

## 終了コード

| 終了コード | 説明 |
| --- | --- |
| 0 | 成功 |
| 1 | エラー（引数エラー、コマンド失敗など） |

---

## 環境変数

現在のバージョンでは環境変数の設定はサポートされていません。

---

## 設定ファイル

OpenSkills は以下の設定ファイルを使用します：

- **スキルメタデータ**：`.claude/skills/<skill-name>/.openskills.json`
  - インストールソース、タイムスタンプなどを記録
  - `update` コマンドでスキルを更新するために使用

### メタデータ例

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 次のレッスン予告

> 次のレッスンでは **[AGENTS.md 形式仕様](../agents-md-format/)** を学習します。
>
> 学習内容：
> - AGENTS.md の XML タグ構造と各タグの意味
> - スキルリストのフィールド定義と使用制限
> - OpenSkills が AGENTS.md を生成・更新する方法
> - マーカー方式（XML マーカーと HTML コメントマーカー）

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| コマンド | ファイルパス | 行番号 |
| --- | --- | --- |
| CLI エントリ | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 13-80 |
| install コマンド | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562 |
| list コマンド | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 1-50 |
| read コマンド | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| sync コマンド | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 1-101 |
| update コマンド | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173 |
| manage コマンド | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50 |
| remove コマンド | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30 |
| 型定義 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-25 |

**重要な定数**：
- グローバル定数はありません

**重要な型**：
- `Skill`: スキル情報インターフェース（name, description, location, path）
- `SkillLocation`: スキル場所インターフェース（path, baseDir, source）
- `InstallOptions`: インストールオプションインターフェース（global, universal, yes）

**重要な関数**：
- `program.command()`: コマンドを定義（commander.js）
- `program.option()`: オプションを定義（commander.js）
- `program.action()`: コマンドハンドラ関数を定義（commander.js）

</details>
