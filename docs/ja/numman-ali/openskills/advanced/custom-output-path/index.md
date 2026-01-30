---
title: "カスタム出力パス: スキル位置を柔軟に管理 | openskills"
sidebarTitle: "スキルを任意の位置に配置"
subtitle: "カスタム出力パス: スキル位置を柔軟に管理 | openskills"
description: "openskills sync -o コマンドを使用してスキルを任意の位置に柔軟に同期する方法を学びます。複数ツール環境での自動ディレクトリ作成をサポートし、柔軟な統合ニーズを満たします。"
tags:
  - "高度な機能"
  - "カスタム出力"
  - "スキル同期"
  - "-o フラグ"
prerequisite:
  - "start-sync-to-agents"
order: 2
---

# カスタム出力パス

## 学習後にできること

- `-o` または `--output` フラグを使用してスキルを任意の位置の `.md` ファイルに同期する
- ツールが存在しないファイルとディレクトリを自動作成する仕組みを理解する
- 異なるツール（Windsurf、Cursor など）用に異なる AGENTS.md を設定する
- 複数ファイル環境でスキルリストを管理する
- デフォルトの `AGENTS.md` をスキップし、既存のドキュメントシステムに統合する

::: info 前提知識

本チュートリアルでは、[スキルの基礎同期](../../start/sync-to-agents/) の使用方法を既に習得していることを前提としています。まだスキルをインストールしたことがない場合や、AGENTS.md を同期したことがない場合は、先に前提コースを完了してください。

:::

---

## 現在の課題

`openskills sync` がデフォルトで `AGENTS.md` を生成することに慣れているかもしれませんが、以下のような問題に遭遇する可能性があります：

- **ツールが特定のパスを必要とする**: 一部の AI ツール（例：Windsurf）は、AGENTS.md をプロジェクトルートではなく特定のディレクトリ（例：`.ruler/`）に配置することを期待しています
- **複数ツールの競合**: 複数のコーディングツールを同時に使用する場合、それぞれが AGENTS.md を異なる位置に期待する可能性があります
- **既存ドキュメントとの統合**: すでにスキルリストドキュメントがあり、新しいファイルを作成するのではなく OpenSkills のスキルを統合したい場合
- **ディレクトリが存在しない**: ネストされたディレクトリ（例：`docs/ai-skills.md`）に出力したいが、ディレクトリがまだ存在しない

これらの問題の根本原因は：**デフォルトの出力パスがすべてのシナリオを満たせない**ことです。より柔軟な出力制御が必要です。

---

## この機能を使用するタイミング

**カスタム出力パス**は以下のシナリオに適しています：

- **複数ツール環境**: 異なる AI ツール用に独立した AGENTS.md を設定する（例：`.ruler/AGENTS.md` vs `AGENTS.md`）
- **ディレクトリ構造の要件**: ツールが AGENTS.md を特定のディレクトリに期待する場合（例：Windsurf の `.ruler/`）
- **既存ドキュメントとの統合**: スキルリストを既存のドキュメントシステムに統合し、新しい AGENTS.md を作成しない
- **組織的な管理**: プロジェクトや機能ごとにスキルリストを分類して保存する（例：`docs/ai-skills.md`）
- **CI/CD 環境**: 自動化フローで固定パスに出力する

::: tip 推奨事項

プロジェクトで単一の AI ツールのみを使用し、そのツールがプロジェクトルートの AGENTS.md をサポートしている場合は、デフォルトパスを使用してください。複数ファイル管理が必要な場合や、ツール固有のパス要件がある場合のみ、カスタム出力パスを使用してください。

:::

---

## 🎒 開始前の準備

開始する前に、以下を確認してください：

- [ ] [少なくとも1つのスキルのインストール](../../start/first-skill/) が完了している
- [ ] プロジェクトディレクトリに移動している
- [ ] `openskills sync` の基本的な使用方法を理解している

::: warning 前提チェック

インストール済みのスキルがあることを確認してください：

```bash
npx openskills list
```

リストが空の場合は、先にスキルをインストールしてください：

```bash
npx openskills install anthropics/skills
```

:::

---

## 核心概念：柔軟な出力制御

OpenSkills の同期機能はデフォルトで `AGENTS.md` に出力しますが、`-o` または `--output` フラグを使用してカスタム出力パスを指定できます。

```
[デフォルト動作]                    [カスタム出力]
openskills sync      →      AGENTS.md (プロジェクトルート)
openskills sync -o custom.md →  custom.md (プロジェクトルート)
openskills sync -o .ruler/AGENTS.md →  .ruler/AGENTS.md (ネストされたディレクトリ)
```

**主な機能**：

1. **任意のパス**: 任意の `.md` ファイルパス（相対パスまたは絶対パス）を指定可能
2. **自動ファイル作成**: ファイルが存在しない場合、ツールが自動作成
3. **自動ディレクトリ作成**: ファイルの親ディレクトリが存在しない場合、ツールが再帰的に作成
4. **スマートタイトル**: ファイル作成時、ファイル名に基づいたタイトルを自動追加（例：`# AGENTS`）
5. **形式検証**: `.md` で終わる必要があり、そうでない場合はエラー

**なぜこの機能が必要なのか？**

異なる AI ツールは異なるパスを期待する可能性があります：

| ツール       | 期待されるパス           | デフォルトパスは使用可能 |
|--- | --- | ---|
| Claude Code | `AGENTS.md`        | ✅ 使用可能          |
| Cursor     | `AGENTS.md`        | ✅ 使用可能          |
| Windsurf   | `.ruler/AGENTS.md` | ❌ 使用不可       |
| Aider      | `.aider/agents.md` | ❌ 使用不可       |

`-o` フラグを使用することで、各ツールに正しいパスを設定できます。

---

## 実践ガイド

### ステップ 1：基本用法 - 現在のディレクトリに出力

まず、スキルを現在のディレクトリのカスタムファイルに同期してみましょう：

```bash
npx openskills sync -o my-skills.md
```

**理由**

`-o my-skills.md` を使用して、ツールにデフォルトの `AGENTS.md` ではなく `my-skills.md` に出力するように指示します。

**表示される内容**：

`my-skills.md` が存在しない場合、ツールが作成します：

```
Created my-skills.md
```

次に、インタラクティブ選択インターフェースが起動します：

```
Found 2 skill(s)

? Select skills to sync to my-skills.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...

<Space> 選択  <a> 全選択  <i> 反転  <Enter> 確認
```

スキルを選択すると、以下が表示されます：

```
✅ Synced 2 skill(s) to my-skills.md
```

::: tip 生成されたファイルの確認

生成されたファイルを確認してください：

```bash
cat my-skills.md
```

以下が表示されます：

```markdown
<!-- ファイルタイトル：# my-skills -->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help...
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

最初の行は `# my-skills` で、これはツールがファイル名に基づいて自動生成したタイトルです。

:::

---

### ステップ 2：ネストされたディレクトリに出力

次に、存在しないネストされたディレクトリにスキルを同期してみましょう：

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**理由**

一部のツール（例：Windsurf）は AGENTS.md を `.ruler/` ディレクトリに期待します。ディレクトリが存在しない場合、ツールが自動作成します。

**表示される内容**：

`.ruler/` ディレクトリが存在しない場合、ツールがディレクトリとファイルを作成します：

```
Created .ruler/AGENTS.md
```

次に、インタラクティブ選択インターフェースが起動します（前のステップと同様）。

**操作ガイド**：

```
┌─────────────────────────────────────────────────────────────┐
│  ディレクトリ自動作成の説明                                  │
│                                                             │
│  入力コマンド：openskills sync -o .ruler/AGENTS.md          │
│                                                             │
│  ツールの実行：                                              │
│  1. .ruler ディレクトリの存在確認  →  存在しない             │
│  2. .ruler ディレクトリの再帰的作成   →  mkdir .ruler       │
│  3. .ruler/AGENTS.md の作成  →  # AGENTS タイトルを書き込み │
│  4. スキル内容の同期           →  XML 形式のスキルリストを書き込み │
│                                                             │
│  結果：.ruler/AGENTS.md ファイルが生成され、スキルが同期されました │
└─────────────────────────────────────────────────────────────┘
```

::: tip 再帰的作成

ツールは存在しないすべての親ディレクトリを再帰的に作成します。例：

- `docs/ai/skills.md` - `docs` と `docs/ai` が存在しない場合、両方が作成されます
- `.config/agents.md` - 隠しディレクトリ `.config` が作成されます

:::

---

### ステップ 3：複数ファイル管理 - 異なるツール用に設定

Windsurf と Cursor を同時に使用し、それぞれに異なる AGENTS.md を設定する必要があると仮定します：

```bash
<!-- Windsurf 用に設定（.ruler/AGENTS.md を期待） -->
npx openskills sync -o .ruler/AGENTS.md

<!-- Cursor 用に設定（プロジェクトルートの AGENTS.md を使用） -->
npx openskills sync
```

**理由**

異なるツールは AGENTS.md を異なる位置に期待する可能性があります。`-o` を使用することで、各ツールに正しいパスを設定し、競合を回避できます。

**表示される内容**：

2つのファイルがそれぞれ生成されます：

```bash
<!-- Windsurf の AGENTS.md を確認 -->
cat .ruler/AGENTS.md

<!-- Cursor の AGENTS.md を確認 -->
cat AGENTS.md
```

::: tip ファイルの独立性

各 `.md` ファイルは独立しており、独自のスキルリストを含みます。異なるファイルで異なるスキルを選択できます：

- `.ruler/AGENTS.md` - Windsurf 用に選択したスキル
- `AGENTS.md` - Cursor 用に選択したスキル
- `docs/ai-skills.md` - ドキュメント内のスキルリスト

:::

---

### ステップ 4：カスタムファイルへの非インタラクティブ同期

CI/CD 環境では、インタラクティブ選択をスキップし、すべてのスキルをカスタムファイルに直接同期する必要がある場合があります：

```bash
npx openskills sync -o .ruler/AGENTS.md -y
```

**理由**

`-y` フラグはインタラクティブ選択をスキップし、すべてのインストール済みスキルを同期します。`-o` フラグと組み合わせることで、自動化フローでカスタムパスに出力できます。

**表示される内容**：

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: info CI/CD 使用シナリオ

CI/CD スクリプトで使用する場合：

```bash
#!/bin/bash
<!-- スキルのインストール -->
npx openskills install anthropics/skills -y

<!-- カスタムファイルへの同期（非インタラクティブ） -->
npx openskills sync -o .ruler/AGENTS.md -y
```

:::

---

### ステップ 5：出力ファイルの検証

最後に、出力ファイルが正しく生成されたことを確認します：

```bash
<!-- ファイル内容を表示 -->
cat .ruler/AGENTS.md

<!-- ファイルが存在することを確認 -->
ls -l .ruler/AGENTS.md

<!-- スキル数を確認 -->
grep -c "<name>" .ruler/AGENTS.md
```

**表示される内容**：

1. ファイルに正しいタイトルが含まれている（例：`# AGENTS`）
2. ファイルに `<skills_system>` XML タグが含まれている
3. ファイルに `<available_skills>` スキルリストが含まれている
4. 各 `<skill>` に `<name>`、`<description>`、`<location>` が含まれている

::: tip 出力パスの確認

現在の作業ディレクトリが不明な場合は、以下を使用できます：

```bash
<!-- 現在のディレクトリを表示 -->
pwd

<!-- 相対パスがどこに解決されるかを表示 -->
realpath .ruler/AGENTS.md
```

:::

---

## チェックポイント ✅

上記のステップを完了したら、以下を確認してください：

- [ ] `-o` フラグを使用してカスタムファイルに正常に出力した
- [ ] ツールが存在しないファイルを自動作成した
- [ ] ツールが存在しないネストされたディレクトリを自動作成した
- [ ] 生成されたファイルに正しいタイトル（ファイル名に基づく）が含まれている
- [ ] 生成されたファイルに `<skills_system>` XML タグが含まれている
- [ ] 生成されたファイルに完全なスキルリストが含まれている
- [ ] 異なるツール用に異なる出力パスを設定できる
- [ ] CI/CD 環境で `-y` と `-o` の組み合わせを使用できる

上記のチェック項目がすべて合格した場合、おめでとうございます！カスタム出力パスの使用方法を習得し、スキルを任意の位置に柔軟に同期できるようになりました。

---

## トラブルシューティング

### 問題 1：出力ファイルが markdown ではない

**現象**：

```
Error: Output file must be a markdown file (.md)
```

**原因**：

`-o` フラグを使用する際、指定したファイルの拡張子が `.md` ではありませんでした。ツールは AI ツールが正しく解析できるように、markdown ファイルへの出力を強制しています。

**解決方法**：

出力ファイルが `.md` で終わることを確認してください：

```bash
<!-- ❌ 誤り -->
npx openskills sync -o skills.txt

<!-- ✅ 正しい -->
npx openskills sync -o skills.md
```

---

### 問題 2：ディレクトリ作成の権限エラー

**現象**：

```
Error: EACCES: permission denied, mkdir '.ruler'
```

**原因**：

ディレクトリの作成を試みた際、現在のユーザーに親ディレクトリへの書き込み権限がありませんでした。

**解決方法**：

1. 親ディレクトリの権限を確認してください：

```bash
ls -ld .
```

2. 権限が不足している場合は、管理者に連絡するか、権限のあるディレクトリを使用してください：

```bash
<!-- プロジェクトディレクトリを使用 -->
cd ~/projects/my-project
npx openskills sync -o .ruler/AGENTS.md
```

---

### 問題 3：出力パスが長すぎる

**現象**：

ファイルパスが長く、コマンドの可読性と保守性が低下しています：

```bash
npx openskills sync -o docs/ai/skills/v2/internal/agents.md
```

**原因**：

ネストされたディレクトリが深すぎて、パスが管理しにくくなっています。

**解決方法**：

1. 相対パスを使用する（プロジェクトルートから開始）
2. ディレクトリ構造を簡素化する
3. シンボリックリンクの使用を検討する（[シンボリックリンクサポート](../symlink-support/) を参照）

```bash
<!-- 推奨：フラットなディレクトリ構造 -->
npx openskills sync -o docs/agents.md
```

---

### 問題 4：-o フラグの使用を忘れた

**現象**：

カスタムファイルへの出力を期待したが、ツールはデフォルトの `AGENTS.md` に出力しました。

**原因**：

`-o` フラグの使用を忘れたか、スペルミスがありました。

**解決方法**：

1. コマンドに `-o` または `--output` が含まれていることを確認してください：

```bash
<!-- ❌ 誤り：-o フラグを忘れた -->
npx openskills sync

<!-- ✅ 正しい：-o フラグを使用 -->
npx openskills sync -o .ruler/AGENTS.md
```

2. `--output` 完全形式を使用する（より明確）：

```bash
npx openskills sync --output .ruler/AGENTS.md
```

---

### 問題 5：ファイル名に特殊文字が含まれている

**現象**：

ファイル名にスペースや特殊文字が含まれており、パス解析エラーが発生しています：

```bash
npx openskills sync -o "my skills.md"
```

**原因**：

一部のシェルは特殊文字の処理方法が異なり、パスエラーの原因となる可能性があります。

**解決方法**：

1. スペースと特殊文字の使用を避ける
2. どうしても使用する必要がある場合は、引用符で囲む：

```bash
<!-- 推奨しない -->
npx openskills sync -o "my skills.md"

<!-- 推奨 -->
npx openskills sync -o my-skills.md
```

---

## 本レッスンのまとめ

本レッスンでは、以下を学びました：

- **`-o` または `--output` フラグの使用** - スキルをカスタムの `.md` ファイルに同期する
- **ファイルとディレクトリの自動作成** の仕組み - 手動でディレクトリ構造を準備する必要なし
- **異なるツール用に異なる AGENTS.md を設定** - 複数ツールの競合を回避
- **複数ファイル管理のテクニック** - ツールや機能ごとにスキルリストを分類して保存
- **CI/CD 環境での使用** - `-y` と `-o` の組み合わせで自動化同期を実現

**核心コマンド**：

| コマンド | 作用 |
|--- | ---|
| `npx openskills sync -o custom.md` | プロジェクトルートの `custom.md` に同期 |
| `npx openskills sync -o .ruler/AGENTS.md` | `.ruler/AGENTS.md` に同期（ディレクトリ自動作成） |
| `npx openskills sync -o path/to/file.md` | 任意のパスに同期（ネストされたディレクトリ自動作成） |
| `npx openskills sync -o custom.md -y` | カスタムファイルへの非インタラクティブ同期 |

**重要なポイント**：

- 出力ファイルは `.md` で終わる必要がある
- ツールは存在しないファイルとディレクトリを自動作成する
- ファイル作成時、ファイル名に基づいたタイトルを自動追加する
- 各 `.md` ファイルは独立しており、独自のスキルリストを含む
- 複数ツール環境、ディレクトリ構造要件、既存ドキュメント統合などのシナリオに適している

---

## 次のレッスンの予告

> 次のレッスンでは **[シンボリックリンクサポート](../symlink-support/)** を学びます。
>
> 学習内容：
> - git ベースのスキル更新を実現するシンボリックリンクの使用方法
> - シンボリックリンクの利点と使用シナリオ
> - ローカル開発でのスキル管理方法
> - シンボリックリンクの検出と処理メカニズム

カスタム出力パスによりスキルリストの位置を柔軟に制御できるようになりましたが、シンボリックリンクはより高度なスキル管理方式を提供し、特にローカル開発シナリオに適しています。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの位置を表示</strong></summary>

> 更新日：2026-01-24

| 機能 | ファイルパス | 行号 |
|--- | --- | ---|
| sync コマンドエントリ | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| CLI オプション定義 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 66 |
| 出力パス取得 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19) | 19 |
| 出力ファイル検証 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L22-L26) | 22-26 |
| 存在しないファイルの作成 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| 再帰的ディレクトリ作成 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L31-L32) | 31-32 |
| 自動タイトル生成 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L34) | 34 |
| インタラクティブプロンプトでの出力ファイル名使用 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L70) | 70 |

**重要な関数**：
- `syncAgentsMd(options: SyncOptions)` - 指定された出力ファイルにスキルを同期
- `options.output` - カスタム出力パス（オプション、デフォルト 'AGENTS.md'）

**重要な定数**：
- `'AGENTS.md'` - デフォルト出力ファイル名
- `'.md'` - 強制されるファイル拡張子

**重要なロジック**：
- 出力ファイルは `.md` で終わる必要があり、そうでない場合はエラーで終了（sync.ts:23-26）
- ファイルが存在しない場合、親ディレクトリ（再帰的）とファイルを自動作成（sync.ts:28-36）
- ファイル作成時、ファイル名に基づいたタイトルを書き込む：`# ${outputName.replace('.md', '')}`（sync.ts:34）
- インタラクティブプロンプトで出力ファイル名を表示（sync.ts:70）
- 同期成功メッセージで出力ファイル名を表示（sync.ts:105, 107）

</details>
