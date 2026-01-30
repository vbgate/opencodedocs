---
title: "インストールソース: 複数の方法でスキルをインストール | openskills"
sidebarTitle: "3つのソースから選択"
subtitle: "インストールソースの詳細"
description: "OpenSkills スキルの 3 つのインストール方法を学びます。GitHub リポジトリ、ローカルパス、プライベート Git リポジトリからスキルをインストールする方法、SSH/HTTPS 認証とサブパスの設定について理解します。"
tags:
  - "プラットフォーム統合"
  - "スキル管理"
  - "インストール設定"
prerequisite:
  - "start-first-skill"
order: 2
---

# インストールソースの詳細

## 学習完了後にできること

- 3 つの方法でスキルをインストールする：GitHub リポジトリ、ローカルパス、プライベート Git リポジトリ
- シナリオに合わせて最適なインストールソースを選択する
- 異なるソースの長所、短所、注意点を理解する
- GitHub shorthand、相対パス、プライベートリポジトリ URL などの記述方法を習得する

::: info 前提知識

このチュートリアルは、[最初のスキルをインストールする](../../start/first-skill/)が完了していることを前提としています。基本的なインストール手順を理解している必要があります。

:::

---

## 現在の課題

公式リポジトリからスキルをインストールする方法はもう学んだかもしれませんが、以下のような問題があるかもしれません：

- **GitHub しか使えないの？**：社内の GitLab リポジトリを使用したいが、設定方法が分からない
- **ローカルで開発中のスキルはどうやってインストールする？**：自分のスキルを開発中で、まずローカルでテストしたい
- **特定のスキルを直接指定したい**：リポジトリには多くのスキルがあり、毎回インタラクティブインターフェースで選択したくない
- **プライベートリポジトリにはどうアクセスする？**：社内のスキルリポジトリがプライベートで、認証方法が分からない

実は、OpenSkills は複数のインストールソースをサポートしています。一つずつ見ていきましょう。

---

## いつこの方法を使うか

**異なるインストールソースの適用シナリオ**：

| インストールソース | 適用シナリオ | 例 |
|--- | --- | ---|
| **GitHub リポジトリ** | オープンソースコミュニティのスキルを使用する | `openskills install anthropics/skills` |
| **ローカルパス** | 自分のスキルを開発・テストする | `openskills install ./my-skill` |
| **プライベート Git リポジトリ** | 社内のスキルを使用する | `openskills install git@github.com:my-org/private-skills.git` |

::: tip 推奨される方法

- **オープンソーススキル**：優先的に GitHub リポジトリからインストールし、更新を容易にする
- **開発段階**：ローカルパスからインストールし、変更をリアルタイムでテストする
- **チームコラボレーション**：プライベート Git リポジトリを使用し、社内スキルを統一管理する

:::

---

## 核心概念：3 つのソース、1 つのメカニズム

インストールソースは異なりますが、OpenSkills の基本的なメカニズムは同じです：

```
[ソースタイプを識別] → [スキルファイルを取得] → [.claude/skills/ にコピー]
```

**ソース識別ロジック**（ソースコード `install.ts:25-45`）：

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**判定の優先順位**：
1. まずローカルパスかどうかをチェックする（`isLocalPath`）
2. 次に Git URL かどうかをチェックする（`isGitUrl`）
3. 最後に GitHub shorthand として処理する（`owner/repo`）

---

## 実践してみましょう

### 方法 1：GitHub リポジトリからインストールする

**適用シナリオ**：Anthropic 公式リポジトリやサードパーティのスキルパッケージなど、オープンソースコミュニティのスキルをインストールする。

#### 基本的な使い方：リポジトリ全体をインストールする

```bash
npx openskills install owner/repo
```

**例**：Anthropic 公式リポジトリからスキルをインストールする

```bash
npx openskills install anthropics/skills
```

**期待される結果**：

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### 応用：サブパスを指定する（特定のスキルを直接インストールする）

リポジトリに多くのスキルがある場合、インストールするスキルのサブパスを直接指定して、インタラクティブ選択をスキップできます：

```bash
npx openskills install owner/repo/skill-name
```

**例**：PDF 処理スキルを直接インストールする

```bash
npx openskills install anthropics/skills/pdf
```

**期待される結果**：

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
   Location: /path/to/project/.claude/skills/pdf
```

::: tip 推奨される方法

リポジトリ内の 1 つのスキルだけが必要な場合、サブパス形式を使用するとインタラクティブ選択をスキップでき、より迅速です。

:::

#### GitHub shorthand のルール（ソースコード `install.ts:131-143`）

| 形式 | 例 | 変換結果 |
|--- | --- | ---|
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |
|--- | --- | ---|

---

### 方法 2：ローカルパスからインストールする

**適用シナリオ**：自分のスキルを開発中で、まずローカルでテストしてから GitHub に公開したい。

#### 絶対パスを使用する

```bash
npx openskills install /absolute/path/to/skill
```

**例**：ホームディレクトリのスキルディレクトリからインストールする

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### 相対パスを使用する

```bash
npx openskills install ./local-skills/my-skill
```

**例**：プロジェクトディレクトリの `local-skills/` サブディレクトリからインストールする

```bash
npx openskills install ./local-skills/web-scraper
```

**期待される結果**：

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
   Location: /path/to/project/.claude/skills/web-scraper
```

::: warning 注意事項

ローカルパスからのインストールは、スキルファイルを `.claude/skills/` にコピーします。その後、ソースファイルへの変更は自動的に同期されません。更新が必要な場合は、再インストールしてください。

:::

#### 複数のスキルを含むローカルディレクトリをインストールする

ローカルディレクトリ構造が以下のようになっている場合：

```
local-skills/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

ディレクトリ全体を直接インストールできます：

```bash
npx openskills install ./local-skills
```

これにより、インタラクティブ選択インターフェースが起動し、インストールするスキルを選択できます。

#### ローカルパスでサポートされる形式（ソースコード `install.ts:25-32`）

| 形式 | 説明 | 例 |
|--- | --- | ---|
| `/absolute/path` | 絶対パス | `/home/user/skills/my-skill` |
| `./relative/path` | カレントディレクトリの相対パス | `./local-skills/my-skill` |
| `../relative/path` | 親ディレクトリの相対パス | `../shared-skills/common` |
| `~/path` | ホームディレクトリの相対パス | `~/dev/my-skills` |

::: tip 開発のヒント

`~` 簡略表記を使用すると、ホームディレクトリのスキルを素早く参照でき、個人開発環境に適しています。

:::

---

### 方法 3：プライベート Git リポジトリからインストールする

**適用シナリオ**：社内の GitLab/Bitbucket リポジトリやプライベート GitHub リポジトリを使用する。

#### SSH 方式（推奨）

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**例**：GitHub プライベートリポジトリからインストールする

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**期待される結果**：

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip 認証の設定

SSH 方式を使用するには、SSH 鍵が設定されている必要があります。クローンに失敗した場合、以下を確認してください：

```bash
# SSH 接続をテスト
ssh -T git@github.com

# "Hi username! You've successfully authenticated..." と表示されれば、設定は正しいです
```

:::

#### HTTPS 方式（認証情報が必要）

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning HTTPS 認証

HTTPS 方式でプライベートリポジトリをクローンする場合、Git はユーザー名とパスワード（または Personal Access Token）の入力を求めます。二要素認証を使用している場合は、アカウントパスワードではなく Personal Access Token を使用する必要があります。

:::

#### その他の Git ホスティングプラットフォーム

**GitLab（SSH）**：

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab（HTTPS）**：

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket（SSH）**：

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket（HTTPS）**：

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip 推奨される方法

チーム内のスキルはプライベート Git リポジトリを使用することをお勧めします。こうすることで：
- すべてのメンバーが同じソースからインストールできる
- スキルを更新する際は `openskills update` を実行するだけでよい
- バージョン管理とアクセス制御が容易になる

:::

#### Git URL 識別ルール（ソースコード `install.ts:37-45`）

| プレフィックス/サフィックス | 説明 | 例 |
|--- | --- | ---|
| `git@` | SSH プロトコル | `git@github.com:owner/repo.git` |
| `git://` | Git プロトコル | `git://github.com/owner/repo.git` |
| `http://` | HTTP プロトコル | `http://github.com/owner/repo.git` |
| `https://` | HTTPS プロトコル | `https://github.com/owner/repo.git` |
| `.git` サフィックス | Git リポジトリ（任意のプロトコル） | `owner/repo.git` |

---

## チェックポイント ✅

このレッスンを完了したら、以下を確認してください：

- [ ] GitHub リポジトリからスキルをインストールする方法を知っている（`owner/repo` 形式）
- [ ] リポジトリ内の特定のスキルを直接インストールする方法を知っている（`owner/repo/skill-name`）
- [ ] ローカルパスからスキルをインストールする方法を知っている（`./`、`~/` など）
- [ ] プライベート Git リポジトリからスキルをインストールする方法を知っている（SSH/HTTPS）
- [ ] 異なるインストールソースの適用シナリオを理解している

---

## よくある問題

### 問題 1：ローカルパスが存在しない

**現象**：

```
Error: Path does not exist: ./local-skills/my-skill
```

**原因**：
- パスのスペルミス
- 相対パスの計算が間違っている

**解決方法**：
1. パスが存在するか確認する：`ls ./local-skills/my-skill`
2. 相対パスの混乱を避けるために絶対パスを使用する

---

### 問題 2：プライベートリポジトリのクローンに失敗する

**現象**：

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**原因**：
- SSH 鍵が設定されていない
- リポジトリへのアクセス権限がない
- リポジトリアドレスが間違っている

**解決方法**：
1. SSH 接続をテストする：`ssh -T git@github.com`
2. リポジトリへのアクセス権限があるか確認する
3. リポジトリアドレスが正しいか確認する

::: tip ヒント

プライベートリポジトリの場合、ツールは以下のプロンプトを表示します（ソースコード `install.ts:167`）：

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### 問題 3：サブパスで SKILL.md が見つからない

**現象**：

```
Error: SKILL.md not found at skills/my-skill
```

**原因**：
- サブパスが間違っている
- リポジトリ内のディレクトリ構造が期待と異なる

**解決方法**：
1. まずサブパスなしでリポジトリ全体をインストールする：`npx openskills install owner/repo`
2. インタラクティブインターフェースで利用可能なスキルを確認する
3. 正しいサブパスを使用して再インストールする

---

### 問題 4：GitHub shorthand の識別エラー

**現象**：

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**原因**：
- どのルールにも一致しない形式
- スペルミス（例：`owner / repo` の間にスペースがある）

**解決方法**：
- 形式が正しいか確認する（スペースなし、スラッシュの数が正しい）
- shorthand ではなく完全な Git URL を使用する

---

## このレッスンのまとめ

このレッスンでは、以下のことを学びました：

- **3 つのインストールソース**：GitHub リポジトリ、ローカルパス、プライベート Git リポジトリ
- **GitHub shorthand**：`owner/repo` と `owner/repo/skill-name` の 2 つの形式
- **ローカルパス形式**：絶対パス、相対パス、ホームディレクトリの簡略表記
- **プライベートリポジトリのインストール**：SSH と HTTPS の 2 つの方法、異なるプラットフォームの記述
- **ソース識別ロジック**：ツールが提供されたインストールソースのタイプをどのように判断するか

**主要なコマンド早見表**：

| コマンド | 用途 |
|--- | ---|
| `npx openskills install owner/repo` | GitHub リポジトリからインストールする（インタラクティブ選択） |
| `npx openskills install owner/repo/skill-name` | リポジトリ内の特定のスキルを直接インストールする |
| `npx openskills install ./local-skills/skill` | ローカルパスからインストールする |
| `npx openskills install ~/dev/my-skills` | ホームディレクトリからインストールする |
| `npx openskills install git@github.com:owner/private-skills.git` | プライベート Git リポジトリからインストールする |

---

## 次のレッスンの予告

> 次のレッスンでは **[グローバルインストール vs プロジェクトローカルインストール](../global-vs-project/)** を学びます。
>
> 学ぶこと：
> > - `--global` フラグの役割とインストール場所
> > - グローバルインストールとプロジェクトローカルインストールの違い
> > - シナリオに合わせて適切なインストール場所を選択する
> > - マルチプロジェクトでスキルを共有するベストプラクティス

インストールソースはスキル管理の一部に過ぎません。次は、スキルのインストール場所がプロジェクトに与える影響を理解する必要があります。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新時間：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| インストールコマンドエントリ | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| ローカルパス判定 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Git URL 判定 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| GitHub shorthand 解析 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| ローカルパスからのインストール | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Git リポジトリのクローン | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| プライベートリポジトリのエラーメッセージ | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**重要な関数**：
- `isLocalPath(source)` - ローカルパスかどうかを判定する（第 25-32 行）
- `isGitUrl(source)` - Git URL かどうかを判定する（第 37-45 行）
- `installFromLocal()` - ローカルパスからスキルをインストールする（第 199-226 行）
- `installSpecificSkill()` - 指定されたサブパスのスキルをインストールする（第 272-316 行）
- `getRepoName()` - Git URL からリポジトリ名を抽出する（第 50-56 行）

**重要なロジック**：
1. ソースタイプ判定の優先順位：ローカルパス → Git URL → GitHub shorthand（第 111-143 行）
2. GitHub shorthand は 2 つの形式をサポート：`owner/repo` と `owner/repo/skill-name`（第 132-142 行）
3. プライベートリポジトリのクローンに失敗した場合、SSH 鍵または認証情報の設定を促す（第 167 行）

</details>
