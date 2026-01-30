---
title: "read コマンド: インストール済みスキルの内容を読み取る | openskills"
sidebarTitle: "インストール済みスキルの読み取り"
subtitle: "read コマンド: インストール済みスキルの内容を読み取る"
description: "openskills read コマンドでインストール済みスキルの内容を読み取る方法を学びます。スキル検索の4段階優先順位と完全な読み込みフローを理解し、複数スキルの読み取りもサポートして、AIエージェントがスキル定義を迅速に取得しタスクを実行するのを支援します。"
tags:
  - "入門チュートリアル"
  - "スキル使用"
prerequisite:
  - "start-first-skill"
order: 6
---

# スキルの使用

## 学習後にできること

- `openskills read` コマンドを使用してインストール済みスキルの内容を読み取る
- AIエージェントがどのようにこのコマンドを使ってスキルをコンテキストに読み込むかを理解する
- スキル検索の4段階優先順位を習得する
- 複数スキルを一度に読み取る方法（カンマ区切り）を学ぶ

::: info 前提知識

このチュートリアルでは、[少なくとも1つのスキルをインストール済みである](../first-skill/)ことを前提としています。まだスキルをインストールしていない場合は、スキルインストール手順を先に完了してください。

:::

---

## あなたの現在の課題

スキルはインストール済みかもしれませんが：

- **AIにスキルを使用させる方法がわからない**: スキルはインストールされたが、AIエージェントはどうやって読み取るのか？
- **`read` コマンドの役割が不明**: `read` コマンドがあることは知っているが、出力が何かわからない
- **スキル検索順序が不明確**: グローバルとプロジェクトの両方にスキルがある場合、AIはどちらを使うのか？

これらの問題は非常に一般的です。一歩ずつ解決していきましょう。

---

## この手法を使うタイミング

**スキルの使用（read コマンド）**は以下のシーンに適しています：

- **AIエージェントが特定のタスクを実行する必要がある**: PDFの処理、Gitリポジトリの操作など
- **スキル内容が正しいか検証する**: SKILL.mdの指示が期待通りか確認する
- **スキルの完全な構造を理解する**: references/、scripts/ などのリソースを確認する

::: tip 推奨する手法

通常、あなたが直接 `read` コマンドを使用することはなく、AIエージェントが自動的に呼び出します。ただし、その出力フォーマットを理解しておくと、デバッグやカスタムスキルの開発に役立ちます。

:::

---

## 🎒 開始前の準備

開始する前に、以下を確認してください：

- [ ] [最初のスキルをインストールする](../first-skill/)を完了している
- [ ] プロジェクトディレクトリに少なくとも1つのスキルがインストールされている
- [ ] `.claude/skills/` ディレクトリを確認できる

::: warning 前提チェック

まだスキルをインストールしていない場合は、テストスキルを素早くインストールできます：

```bash
npx openskills install anthropics/skills
# インタラクティブなインターフェイスで任意のスキルを選択（例: pdf）
```

:::

---

## 核心思路：按优先级查找并输出技能

OpenSkills の `read` コマンドは以下のフローで動作します：

```
[スキル名を指定] → [優先順位で検索] → [最初のマッチを見つける] → [SKILL.mdを読み取る] → [標準出力に出力]
```

**キーポイント**：

- **4段階の検索優先順位**：
  1. `.agent/skills/` (プロジェクト universal)
  2. `~/.agent/skills/` (グローバル universal)
  3. `.claude/skills/` (プロジェクト claude)
  4. `~/.claude/skills/` (グローバル claude)

- **最初のマッチを返す**：最初に見つかったものを返し、後続のディレクトリは検索しない
- **ベースディレクトリを出力**：AIエージェントがこのパスを使ってスキル内のリソースファイルを解決する

---

## 実践してみよう

### ステップ 1：単一スキルの読み取り

まず、インストール済みのスキルを読み取ってみましょう。

**サンプルコマンド**：

```bash
npx openskills read pdf
```

**理由**

`pdf` は前回のレッスンでインストールしたスキル名です。このコマンドはスキルを検索して完全な内容を出力します。

**確認できるはず**：

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit for extracting text and tables...
...

Skill read: pdf
```

**出力構造の解析**：

| 部分 | 内容 | 役割 |
| --- | --- | ---|
| `Reading: pdf` | スキル名 | 読み取り中のスキルを識別 |
| `Base directory: ...` | スキルベースディレクトリ | AIが references/、scripts/ などのリソースを解決するために使用 |
| SKILL.md 内容 | 完全なスキル定義 | 命令やリソース参照などを含む |
| `Skill read: pdf` | 終了マーカー | 読み取り完了を示す |

::: tip 注意

**ベースディレクトリ（Base directory）**は非常に重要です。スキル内の `references/some-doc.md` パスは、このディレクトリを基準に解決されます。

:::

---

### ステップ 2：複数スキルの読み取り

OpenSkills は一度に複数のスキルを読み取ることができ、スキル名はカンマで区切ります。

**サンプルコマンド**：

```bash
npx openskills read pdf,git-workflow
```

**理由**

一度に複数のスキルを読み取ることで、コマンド呼び出し回数を減らし、効率を向上させることができます。

**確認できるはず**：

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit...
...

Skill read: pdf

Reading: git-workflow
Base directory: /path/to/your/project/.claude/skills/git-workflow

---
name: git-workflow
description: Git workflow: Best practices...
...

Skill read: git-workflow
```

**特徴**：
- 各スキルの出力は空行で区切られる
- 各スキルには独立した `Reading:` と `Skill read:` マーカーがある
- スキルはコマンドで指定された順序で読み取られる

::: tip 高度な使い方

スキル名にはスペースを含めることができ、`read` コマンドは自動的に処理します：

```bash
npx openskills read pdf, git-workflow  # スペースは無視される
```

:::

---

### ステップ 3：スキル検索優先順位の確認

4段階の検索順序が正しいか確認してみましょう。

**環境の準備**：

まず、プロジェクトディレクトリとグローバルディレクトリにそれぞれスキルをインストールします（異なるインストールソースを使用）：

```bash
# プロジェクトローカルインストール（現在のプロジェクトディレクトリ）
npx openskills install anthropics/skills

# グローバルインストール（--global を使用）
npx openskills install anthropics/skills --global
```

**優先順位の確認**：

```bash
# すべてのスキルを一覧表示
npx openskills list
```

**確認できるはず**：

```
Available skills:

pdf (project)      /path/to/your/project/.claude/skills/pdf
pdf (global)       /home/user/.claude/skills/pdf

Total: 2 skills (1 project, 1 global)
```

**スキルの読み取り**：

```bash
npx openskills read pdf
```

**確認できるはず**：

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf  ← プロジェクトスキルを優先して返す
...
```

**結論**：`.claude/skills/`（プロジェクト）の優先順位が `~/.claude/skills/`（グローバル）よりも高いため、プロジェクトローカルのスキルが読み取られます。

::: tip 実践的な応用

この優先順位メカニズムにより、プロジェクトでグローバルスキルを上書きしつつ、他のプロジェクトには影響を与えずに済みます。例えば：
- グローバルに一般的なスキルをインストール（すべてのプロジェクトで共有）
- プロジェクトにカスタムバージョンをインストール（グローバルバージョンを上書き）

:::

---

### ステップ 4：スキルの完全なリソースを確認する

スキルには SKILL.md だけでなく、references/、scripts/ などのリソースが含まれる場合があります。

**スキルディレクトリ構造の確認**：

```bash
ls -la .claude/skills/pdf/
```

**確認できるはず**：

```
.claude/skills/pdf/
├── SKILL.md
├── .openskills.json
├── references/
│   ├── pdf-extraction.md
│   └── table-extraction.md
└── scripts/
    └── extract-pdf.js
```

**スキルを読み取って出力を確認する**：

```bash
npx openskills read pdf
```

**確認できるはず**：

SKILL.md にはリソースへの参照が含まれています：

```markdown
## References

詳細については [PDF抽出ガイド](references/pdf-extraction.md) を参照してください。

## Scripts

`node scripts/extract-pdf.js` を実行してPDFからテキストを抽出します。
```

::: info 重要ポイント

AIエージェントがスキルを読み取るとき、以下を行います：
1. `Base directory` パスを取得
2. SKILL.md の相対パス（例：`references/...`）をベースディレクトリと連結
3. 実際のリソースファイルの内容を読み取る

これが `read` コマンドが `Base directory` を出力しなければならない理由です。

:::

---

## チェックポイント ✅

上記のステップを完了したら、以下を確認してください：

- [ ] コマンドラインにスキルの完全な SKILL.md 内容が表示された
- [ ] 出力に `Reading: <name>` と `Base directory: <path>` が含まれている
- [ ] 出力の末尾に `Skill read: <name>` 終了マーカーがある
- [ ] 複数スキル読み取り時、各スキルが空行で区切られている
- [ ] プロジェクトローカルのスキルがグローバルより優先して読み取られた

上記のチェック項目すべてに合格したら、おめでとうございます！スキル読み取りの核心フローを習得しました。

---

## よくある問題と解決方法

### 問題 1：スキルが見つからない

**現象**：

```
Error: Skill(s) not found: pdf

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**原因**：
- スキルがインストールされていない
- スキル名のスペルが間違っている

**解決方法**：
1. インストール済みスキルを一覧表示：`npx openskills list`
2. スキル名が正しいか確認
3. インストールされていない場合は、`openskills install` でインストール

---

### 問題 2：間違ったスキルが読み取られる

**現象**：

プロジェクトスキルを読み取る予定だったが、実際にはグローバルスキルが読み取られた。

**原因**：
- プロジェクトディレクトリが正しい場所でない（間違ったディレクトリを使用している）

**解決方法**：
1. 現在の作業ディレクトリを確認：`pwd`
2. 正しいプロジェクトディレクトリにいることを確認
3. `openskills list` を使用してスキルの `location` タグを確認

---

### 問題 3：複数スキル読み取りの順序が期待通りでない

**現象**：

```bash
npx openskills read skill-a,skill-b
```

skill-b を先に読み取る予定だったが、実際には skill-a が先に読み取られた。

**原因**：
- `read` コマンドはパラメータで指定された順序で読み取り、自動的に並べ替えはしない

**解決方法**：
- 特定の順序が必要な場合は、コマンドでその順序でスキル名を指定

---

### 問題 4：SKILL.md 内容が切り詰められる

**現象**：

出力された SKILL.md 内容が不完全で、末尾部分が欠落している。

**原因**：
- スキルファイルが破損しているかフォーマットエラー
- ファイルエンコーディングの問題

**解決方法**：
1. SKILL.md ファイルを確認：`cat .claude/skills/<name>/SKILL.md`
2. ファイルが完全でフォーマットが正しいか確認（YAML frontmatter が必須）
3. スキルを再インストール：`openskills update <name>`

---

## 本レッスンのまとめ

このレッスンで学んだこと：

- **`openskills read <name>` の使用** - インストール済みスキルの内容を読み取る
- **4段階の検索優先順位の理解** - プロジェクト universal > グローバル universal > プロジェクト claude > グローバル claude
- **複数スキル読み取りのサポート** - カンマでスキル名を区切る
- **出力フォーマット** - `Reading:`、`Base directory`、スキル内容、`Skill read:` マーカーを含む

**核心概念**：

| 概念 | 説明 |
| --- | ---|
| **検索優先順位** | 4つのディレクトリを順序通りに検索し、最初のマッチを返す |
| **ベースディレクトリ** | AI エージェントがスキル内の相対パスを解決するための参照ディレクトリ |
| **複数スキル読み取り** | カンマ区切りで、指定された順序で読み取る |

**核心コマンド**：

| コマンド | 作用 |
| --- | ---|
| `npx openskills read <name>` | 単一スキルを読み取る |
| `npx openskills read name1,name2` | 複数スキルを読み取る |
| `npx openskills list` | インストール済みスキルとその場所を表示 |

---

## 次回レッスン予告

> 次回は **[コマンド詳解](../../platforms/cli-commands/)** を学びます。
>
> 学ぶこと：
> - OpenSkills のすべてのコマンドの完全なリストとパラメータ
> - コマンドラインフラグの使用方法と作用
> - よく使うコマンドのクイックリファレンス

スキルの使用方法を習得したら、次に OpenSkills が提供するすべてのコマンドとその役割を理解する必要があります。

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>ソースコードの場所を表示するにはクリック</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
| --- | --- | ---|
| read コマンドエントリ | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L8-L48) | 8-48 |
| スキル検索（findSkill） | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84) | 69-84 |
| スキル名の正規化 | [`src/utils/skill-names.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-names.ts) | 1-8 |
| 検索ディレクトリの取得 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L18-L25) | 18-25 |
| CLI コマンド定義 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L52-L55) | 52-55 |

**重要な関数**：
- `readSkill(skillNames)` - スキルを標準出力に読み込み、複数のスキル名をサポート
- `findSkill(skillName)` - 4段階の優先順位でスキルを検索し、最初のマッチを返す
- `normalizeSkillNames(input)` - スキル名リストを正規化し、カンマ区切りと重複削除をサポート
- `getSearchDirs()` - 優先順位でソートされた4つの検索ディレクトリを返す

**重要な型**：
- `SkillLocation` - スキル位置情報、path、baseDir、source を含む

**ディレクトリ優先順位**（dirs.ts:18-24 から）：
```typescript
[
  process.cwd() + '/.agent/skills',   // 1. プロジェクト universal
  homedir() + '/.agent/skills',       // 2. グローバル universal
  process.cwd() + '/.claude/skills',  // 3. プロジェクト claude
  homedir() + '/.claude/skills',      // 4. グローバル claude
]
```

</details>
