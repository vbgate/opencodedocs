---
title: "最初のスキル: 公式スキルのインストール | openskills"
sidebarTitle: "5 分で最初のスキルをインストール"
subtitle: "最初のスキル: 公式スキルのインストール"
description: "Anthropic の公式リポジトリからプロジェクトにスキルをインストールする方法を学びます。openskills install コマンドとインタラクティブ選択、スキルディレクトリ構造を理解します。"
tags:
  - "入門チュートリアル"
  - "スキルインストール"
prerequisite:
  - "start-installation"
order: 4
---

# 最初のスキルをインストールする

## 学習完了後にできること

- Anthropic の公式リポジトリからスキルをプロジェクトにインストールする
- インタラクティブ選択インターフェースを使用して必要なスキルを選択する
- スキルがどこにインストールされるかを理解する（.claude/skills/ ディレクトリ）
- スキルが正常にインストールされたことを確認する

::: info 前提知識

このチュートリアルは、[OpenSkills のインストール](../installation/)が完了していることを前提としています。まだインストールしていない場合は、まずインストール手順を完了してください。

:::

---

## 現在の課題

OpenSkills をインストールしたばかりかもしれませんが、以下のような問題があるかもしれません：

- **スキルをどこで見つけるか分からない**：GitHub には多くのスキルリポジトリがありますが、どれが公式か分かりにくい
- **スキルをどうインストールするか分からない**：`install` コマンドがあることは知っているが、使い方が分からない
- **間違った場所にインストールする心配がある**：システム全体にインストールされ、プロジェクトを変えると見つからなくなるのを心配している

これらの問題は実はよくあることです。一歩ずつ解決していきましょう。

---

## いつこの方法を使うか

**最初のスキルをインストールする**は以下のシナリオに適しています：

- 初めて OpenSkills を使用し、素早く体験したい場合
- Anthropic が公式に提供しているスキル（PDF 処理、Git ワークフローなど）を使用する必要がある場合
- グローバルインストールではなく、現在のプロジェクトでスキルを使用したい場合

::: tip 推奨される方法

初回のインストールは、Anthropic 公式リポジトリ `anthropics/skills` から始めることをお勧めします。これらのスキルは品質が高く、検証されています。

:::

---

## 🎒 開始前の準備

始める前に、以下を確認してください：

- [ ] [OpenSkills のインストール](../installation/)が完了している
- [ ] プロジェクトディレクトリに移動している
- [ ] Git が設定されている（GitHub リポジトリをクローンするため）

::: warning 事前チェック

まだプロジェクトディレクトリがない場合は、練習用に一時ディレクトリを作成できます：

```bash
mkdir my-project && cd my-project
```

:::

---

## 核心概念：GitHub からスキルをインストールする

OpenSkills は GitHub リポジトリからスキルのインストールをサポートしています。インストールプロセスは以下の通りです：

```
[リポジトリを指定] → [一時ディレクトリにクローン] → [SKILL.md を検索] → [インタラクティブ選択] → [.claude/skills/ にコピー]
```

**重要ポイント**：
- `owner/repo` 形式を使用して GitHub リポジトリを指定する
- ツールが自動的にリポジトリを一時ディレクトリにクローンする
- `SKILL.md` を含むすべてのサブディレクトリを検索する
- インタラクティブインターフェースを通じてインストールするスキルを選択する
- スキルはプロジェクトの `.claude/skills/` ディレクトリにコピーされる

---

## 実践してみましょう

### ステップ 1：プロジェクトディレクトリに移動する

まず、開発中のプロジェクトディレクトリに移動します：

```bash
cd /path/to/your/project
```

**なぜ**

OpenSkills はデフォルトでスキルをプロジェクトの `.claude/skills/` ディレクトリにインストールします。これにより、スキルをプロジェクトのバージョン管理に含め、チームメンバーと共有できます。

**期待される結果**：

プロジェクトディレクトリには以下の内容のいずれかが含まれているはずです：

- `.git/` （Git リポジトリ）
- `package.json` （Node.js プロジェクト）
- その他のプロジェクトファイル

::: tip 推奨される方法

新しいプロジェクトでも、Git リポジトリを先に初期化することをお勧めします。これにより、スキルファイルをより良く管理できます。

:::

---

### ステップ 2：スキルをインストールする

以下のコマンドを使用して、Anthropic 公式スキルリポジトリからスキルをインストールします：

```bash
npx openskills install anthropics/skills
```

**なぜ**

`anthropics/skills` は Anthropic が公式に保守しているスキルリポジトリで、高品質なスキルサンプルが含まれており、初めて体験するのに適しています。

**期待される結果**：

コマンドはインタラクティブ選択インターフェースを起動します：

```
Installing from: anthropics/skills
Location: project (.claude/skills)
Default install is project-local (./.claude/skills). Use --global for ~/.claude/skills.

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)    Comprehensive PDF manipulation toolkit for extracting text and tables...
  ◯ git-workflow (12 KB)   Git workflow: Best practices for commits, branches, and PRs...
  ◯ check-branch-first (8 KB)    Git workflow: Always check current branch before making changes...
  ◯ skill-creator (16 KB)   Guide for creating effective skills...

<Space> 選択  <a> すべて選択  <i> 反転  <Enter> 確認
```

**操作ガイド**：

```
┌─────────────────────────────────────────────────────────────┐
│  操作説明                                                    │
│                                                             │
│  ステップ 1         ステップ 2          ステップ 3         │
│  カーソル移動   →   Space で選択   →   Enter で確認        │
│                                                             │
│  ○ 未選択           ◉ 選択済み                             │
└─────────────────────────────────────────────────────────────┘

期待される結果：
- カーソルを上下に移動できる
- スペースキーで選択状態を切り替えられる（○ ↔ ◉）
- Enter キーでインストールを確認できる
```

---

### ステップ 3：スキルを選択する

インタラクティブインターフェースで、インストールしたいスキルを選択します。

**例**：

PDF 処理スキルをインストールすると仮定します：

```
? Select skills to install:
❯ ◉ pdf (24 KB)    ← これを選択
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

操作：
1. **カーソル移動**：上下矢印キーを使用して `pdf` の行に移動します
2. **スキルを選択**：**スペースキー**を押して、前に `◉` が表示されることを確認します（`◯` ではありません）
3. **インストールを確認**：**Enter キー**を押してインストールを開始します

**期待される結果**：

```
✅ Installed: pdf
   Location: /path/to/your/project/.claude/skills/pdf

Skills installed to: /path/to/your/project/.claude/skills/

Next steps:
  → Run openskills sync to generate AGENTS.md with your installed skills
  → Run openskills list to see all installed skills
```

::: tip 高度な操作

一度に複数のスキルをインストールしたい場合：
- スペースキーを押して必要な各スキルを選択します（複数の `◉`）
- `<a>` を押してすべてのスキルを選択します
- `<i>` を押して現在の選択を反転します

:::

---

### ステップ 4：インストールを確認する

インストールが完了したら、スキルがプロジェクトディレクトリに正常にインストールされたか確認します。

**ディレクトリ構造を確認**：

```bash
ls -la .claude/skills/
```

**期待される結果**：

```
.claude/skills/
└── pdf/
    ├── SKILL.md
    ├── .openskills.json
    ├── references/
    │   ├── pdf-extraction.md
    │   └── table-extraction.md
    └── scripts/
        └── extract-pdf.js
```

**重要ファイルの説明**：

| ファイル | 用途 |
|--- | ---|
| `SKILL.md` | スキルの主要な内容と命令 |
| `.openskills.json` | インストールメタデータ（ソースを記録、更新に使用） |
| `references/` | 参考ドキュメントと詳細な説明 |
| `scripts/` | 実行可能なスクリプト |

**スキルメタデータを確認**：

```bash
cat .claude/skills/pdf/.openskills.json
```

**期待される結果**：

```json
{
  "source": "anthropics/skills",
  "sourceType": "git",
  "repoUrl": "https://github.com/anthropics/skills",
  "subpath": "pdf",
  "installedAt": "2026-01-24T10:30:00.000Z"
}
```

このメタデータファイルはスキルのソース情報を記録しており、後で `openskills update` を使用する際に役立ちます。

---

## チェックポイント ✅

上記の手順を完了したら、以下を確認してください：

- [ ] コマンドラインにインタラクティブ選択インターフェースが表示された
- [ ] 少なくとも 1 つのスキルが選択された（前に `◉` が表示されている）
- [ ] インストールが成功し、`✅ Installed:` メッセージが表示された
- [ ] `.claude/skills/` ディレクトリが作成された
- [ ] スキルディレクトリに `SKILL.md` ファイルが含まれている
- [ ] スキルディレクトリに `.openskills.json` メタデータファイルが含まれている

上記のチェック項目がすべて合格であれば、おめでとうございます！最初のスキルが正常にインストールされました。

---

## トラブルシューティング

### 問題 1：リポジトリのクローンに失敗する

**現象**：

```
✗ Failed to clone repository
fatal: repository 'https://github.com/anthropics/skills' not found
```

**原因**：
- ネットワーク接続の問題
- GitHub リポジトリアドレスが間違っている

**解決方法**：
1. ネットワーク接続を確認：`ping github.com`
2. リポジトリアドレスが正しいか確認する（`owner/repo` 形式）

---

### 問題 2：インタラクティブ選択インターフェースが表示されない

**現象**：

コマンドがすべてのスキルを直接インストールし、選択インターフェースが表示されない。

**原因**：
- リポジトリに 1 つしか `SKILL.md` ファイルがない（単一スキルリポジトリ）
- `-y` または `--yes` フラグを使用した（選択をスキップ）

**解決方法**：
- 単一スキルリポジトリの場合、これは正常な動作です
- 選択が必要な場合は、`-y` フラグを削除してください

---

### 問題 3：権限エラー

**現象**：

```
Error: EACCES: permission denied, mkdir '.claude/skills'
```

**原因**：
- 現在のディレクトリに書き込み権限がない

**解決方法**：
1. ディレクトリ権限を確認：`ls -la`
2. `sudo` を使用するか、権限のあるディレクトリに切り替える

---

### 問題 4：SKILL.md が見つからない

**現象**：

```
Error: No SKILL.md files found in repository
```

**原因**：
- リポジトリに適切な形式のスキルファイルがない

**解決方法**：
1. リポジトリがスキルリポジトリかどうかを確認する
2. リポジトリ内のディレクトリ構造を確認する

---

## このレッスンのまとめ

このレッスンでは、以下のことを学びました：

- **`openskills install anthropics/skills` を使用**して公式リポジトリからスキルをインストールする
- **インタラクティブインターフェースでスキルを選択**する、スペースキーで選択、Enter で確認
- **スキルは `.claude/skills/` にインストール**され、`SKILL.md` とメタデータが含まれる
- **インストールが成功したことを確認**し、ディレクトリ構造とファイル内容を確認する

**重要なコマンド**：

| コマンド | 用途 |
|--- | ---|
| `npx openskills install anthropics/skills` | 公式リポジトリからスキルをインストールする |
| `ls .claude/skills/` | インストール済みスキルを確認する |
| `cat .claude/skills/<name>/.openskills.json` | スキルメタデータを確認する |

---

## 次のレッスンの予告

> 次のレッスンでは **[スキルを使用する](../read-skills/)** 方法を学びます。
>
> 学ぶこと：
> > - `openskills read` コマンドを使用してスキル内容を読み取る
> > - AI エージェントがスキルをコンテキストにロードする方法を理解する
> > - スキル検索の 4 段階の優先順位をマスターする

スキルのインストールは最初のステップに過ぎません。次は AI エージェントがこれらのスキルをどのように使用するかを理解する必要があります。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新時間：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| インストールコマンドエントリ | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L183) | 83-183 |
| インストール位置の判断（project vs global） | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92 |
| GitHub shorthand の解析 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| リポジトリのクローン | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| スキルの再帰的検索 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L358-L373) | 358-373 |
| インタラクティブ選択インターフェース | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L427-L455) | 427-455 |
| スキルのコピーとインストール | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L461-L486) | 461-486 |
| 公式スキルリスト（競合警告） | [`src/utils/marketplace-skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/marketplace-skills.ts) | 1-25 |

**重要な関数**：
- `installFromRepo()` - リポジトリからスキルをインストールし、インタラクティブ選択をサポート
- `installSpecificSkill()` - 指定されたサブパスのスキルをインストール
- `installFromLocal()` - ローカルパスからスキルをインストール
- `warnIfConflict()` - スキルの競合をチェックして警告する

**重要な定数**：
- `ANTHROPIC_MARKETPLACE_SKILLS` - Anthropic Marketplace のスキルリスト、競合警告に使用

</details>
