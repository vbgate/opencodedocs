---
title: "シンボリックリンク: Git自動更新 | OpenSkills"
subtitle: "シンボリックリンク: Git自動更新"
sidebarTitle: "Git自動更新スキル"
description: "OpenSkillsのシンボリックリンク機能を学びます。symlinkを使用してgitベースのスキル自動更新とローカル開発ワークフローを実現し、効率を大幅に向上させます。"
tags:
  - "高度な機能"
  - "シンボリックリンク"
  - "ローカル開発"
  - "スキル管理"
prerequisite:
  - "platforms-install-sources"
  - "start-first-skill"
order: 3
---

# シンボリックリンクサポート

## 学習目標

- シンボリックリンクの核心価値と適用シナリオを理解する
- `ln -s` コマンドを使用してシンボリックリンクを作成する
- OpenSkillsがシンボリックリンクを自動的に処理する仕組みを理解する
- gitベースのスキル自動更新を実現する
- ローカルスキル開発を効率的に行う
- 破損したシンボリックリンクを処理する

::: info 前提知識

このチュートリアルでは、[インストールソースの詳細](../../platforms/install-sources/)と[最初のスキルをインストール](../../start/first-skill/)を既に理解していることを前提としています。基本的なスキルインストールフローを把握している必要があります。

:::

---

## 現在の課題

スキルのインストールと更新方法を既に学んだかもしれませんが、**シンボリックリンク**を使用する際に以下の問題に直面している可能性があります：

- **ローカル開発の更新が面倒**：スキルを修正した後、再インストールまたは手動でのファイルコピーが必要
- **複数プロジェクトでのスキル共有が困難**：同じスキルを複数のプロジェクトで使用する場合、更新のたびに同期が必要
- **バージョン管理が混乱**：スキルファイルが異なるプロジェクトに分散し、gitで一元管理が困難
- **更新フローが煩雑**：gitリポジトリからスキルを更新するには、リポジトリ全体を再インストールする必要がある

実際には、OpenSkillsはシンボリックリンクをサポートしており、symlinkを使用してgitベースのスキル自動更新と効率的なローカル開発ワークフローを実現できます。

---

## いつこの方法を使用するか

**シンボリックリンクの適用シナリオ**：

| シナリオ | シンボリックリンクが必要か | 例 |
|--- | --- | ---|
| **ローカルスキル開発** | ✅ 是 | カスタムスキルを開発し、頻繁に修正とテストを行う |
| **複数プロジェクトでのスキル共有** | ✅ 是 | チーム共有スキルリポジトリ、複数プロジェクトで同時に使用 |
| **gitベースの自動更新** | ✅ 是 | スキルリポジトリが更新されると、すべてのプロジェクトが自動的に最新バージョンを取得 |
| **1回インストールで永久使用** | ❌ 否 | インストールのみで修正しない、直接 `install` を使用する |
| **サードパーティスキルのテスト** | ❌ 否 | 一時的にスキルをテスト、シンボリックリンクは不要 |

::: tip 推奨アプローチ

- **ローカル開発にはシンボリックリンクを使用**：自分のスキルを開発する際、symlinkを使用して重複コピーを回避
- **チーム共有には git + symlink**：チームスキルリポジトリをgitに配置し、各プロジェクトがsymlinkで共有
- **本番環境には通常インストール**：安定したデプロイ時には、通常の `install` を使用し、外部ディレクトリへの依存を回避

:::

---

## 核心アイデア：コピーではなくリンク

**従来のインストール方法**：

```
┌─────────────────┐
│  Gitリポジトリ   │
│  ~/dev/skills/ │
│  └── my-skill/ │
└────────┬────────┘
         │ コピー
         ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/ │
│     └── 完全コピー │
└─────────────────┘
```

**問題**：Gitリポジトリが更新されても、`.claude/skills/` 内のスキルは自動的に更新されません。

**シンボリックリンク方法**：

```
┌─────────────────┐
│  Gitリポジトリ   │
│  ~/dev/skills/ │
│  └── my-skill/ │ ← 実際のファイルはここ
└────────┬────────┘
         │ シンボリックリンク（ln -s）
         ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/ │ → ~/dev/skills/my-skill を指す
└─────────────────┘
```

**利点**：Gitリポジトリが更新されると、シンボリックリンクが指す内容が自動的に更新され、再インストールが不要です。

::: info 重要な概念

**シンボリックリンク（Symlink）**：別のファイルまたはディレクトリを指す特別なファイルタイプです。OpenSkillsはスキルを検索する際、シンボリックリンクを自動的に認識し、それらが指す実際の内容をたどります。破損したシンボリックリンク（存在しないターゲットを指すもの）は自動的にスキップされ、クラッシュを引き起こしません。

:::

**ソースコードの実装**（`src/utils/skills.ts:10-25`）：

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSyncはシンボリックリンクをたどる
      return stats.isDirectory();
    } catch {
      // 破損したシンボリックリンクまたは権限エラー
      return false;
    }
  }
  return false;
}
```

**重要なポイント**：
- `entry.isSymbolicLink()` でシンボリックリンクを検出
- `statSync()` でシンボリックリンクを自動的にターゲットへたどる
- `try/catch` で破損したシンボリックリンクをキャッチし、`false` を返してスキップ

---

## 実践してみよう

### ステップ1：スキルリポジトリを作成する

**なぜ？**
まず、スキルを格納するためのgitリポジトリを作成し、チーム共有のシナリオをシミュレートします。

ターミナルを開いて、以下を実行します：

```bash
# スキルリポジトリディレクトリを作成
mkdir -p ~/dev/my-skills
cd ~/dev/my-skills

# gitリポジトリを初期化
git init

# サンプルスキルを作成
mkdir -p my-first-skill
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: A sample skill for demonstrating symlink support
---

# My First Skill

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
EOF

# gitにコミット
git add .
git commit -m "Initial commit: Add my-first-skill"
```

**確認すべきこと**：gitリポジトリが正常に作成され、スキルがコミットされたこと。

**解説**：
- スキルは `~/dev/my-skills/` ディレクトリに格納されます
- gitバージョン管理を使用し、チームコラボレーションを容易にします
- このディレクトリはスキルの「実際の場所」です

---

### ステップ2：シンボリックリンクを作成する

**なぜ？**
`ln -s` コマンドを使用してシンボリックリンクを作成する方法を学びます。

プロジェクトディレクトリで以下を実行します：

```bash
# プロジェクトルートディレクトリに戻る
cd ~/my-project

# スキルディレクトリを作成
mkdir -p .claude/skills

# シンボリックリンクを作成
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# シンボリックリンクを確認
ls -la .claude/skills/
```

**確認すべきこと**：

```
.claude/skills/
└── my-first-skill -> /Users/yourname/dev/my-skills/my-first-skill
```

**解説**：
- `ln -s` でシンボリックリンクを作成
- `->` の後に実際のパスが表示されます
- シンボリックリンク自体は単なる「ポインタ」であり、実際のスペースは占有しません

---

### ステップ3：シンボリックリンクが正常に動作しているか確認する

**なぜ？**
OpenSkillsがシンボリックリンクスキルを正しく認識し、読み取れることを確認します。

実行します：

```bash
# スキルを一覧表示
npx openskills list

# スキルの内容を読み取る
npx openskills read my-first-skill
```

**確認すべきこと**：

```
  my-first-skill           (project)
    A sample skill for demonstrating symlink support

Summary: 1 project, 0 global (1 total)
```

スキル読み取りの出力：

```markdown
---
name: my-first-skill
description: A sample skill for demonstrating symlink support
---

# My First Skill

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
```

**解説**：
- OpenSkillsはシンボリックリンクを自動的に認識します
- シンボリックリンクスキルには `(project)` タグが表示されます
- 読み取られる内容は、シンボリックリンクが指す元のファイルから来ています

---

### ステップ4：gitベースの自動更新

**なぜ？**
シンボリックリンクの最大の利点を体験します：gitリポジトリが更新されると、スキルが自動的に同期されます。

スキルリポジトリでスキルを修正します：

```bash
# スキルリポジトリに入る
cd ~/dev/my-skills

# スキルの内容を修正
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: Updated version with new features
---

# My First Skill (Updated)

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
3. NEW: This feature was updated via git!
EOF

# 更新をコミット
git add .
git commit -m "Update skill: Add new feature"
```

プロジェクトディレクトリで更新を確認します：

```bash
# プロジェクトディレクトリに戻る
cd ~/my-project

# スキルを読み取る（再インストール不要）
npx openskills read my-first-skill
```

**確認すべきこと**：スキルの内容が自動的に更新され、新しい機能の説明が含まれていること。

**解説**：
- シンボリックリンクが指すファイルが更新されると、OpenSkillsは自動的に最新の内容を読み取ります
- `openskills install` を再実行する必要がありません
- 「1回の更新で、複数箇所に反映」を実現

---

### ステップ5：複数プロジェクトでのスキル共有

**なぜ？**
複数プロジェクトシナリオでのシンボリックリンクの利点を体験し、スキルの重複インストールを回避します。

2つ目のプロジェクトを作成します：

```bash
# 2つ目のプロジェクトを作成
mkdir ~/my-second-project
cd ~/my-second-project

# スキルディレクトリとシンボリックリンクを作成
mkdir -p .claude/skills
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# スキルが使用可能か確認
npx openskills list
```

**確認すべきこと**：

```
  my-first-skill           (project)
    Updated version with new features

Summary: 1 project, 0 global (1 total)
```

**解説**：
- 複数のプロジェクトで、同じスキルを指すシンボリックリンクを作成できます
- スキルリポジトリが更新されると、すべてのプロジェクトが自動的に最新バージョンを取得します
- スキルの重複インストールと更新を回避できます

---

### ステップ6：破損したシンボリックリンクの処理

**なぜ？**
OpenSkillsが破損したシンボリックリンクをどのようにエレガントに処理するかを理解します。

破損したシンボリックリンクをシミュレートします：

```bash
# スキルリポジトリを削除
rm -rf ~/dev/my-skills

# スキルを一覧表示しようとする
npx openskills list
```

**確認すべきこと**：破損したシンボリックリンクが自動的にスキップされ、エラーが発生しないこと。

```
Summary: 0 project, 0 global (0 total)
```

**解説**：
- ソースコード内の `try/catch` が破損したシンボリックリンクをキャッチします
- OpenSkillsは破損したリンクをスキップし、他のスキルの検索を続けます
- `openskills` コマンドのクラッシュを引き起こしません

---

## チェックポイント ✅

以下のチェックを完了し、このレッスンの内容を習得したことを確認してください：

- [ ] シンボリックリンクの核心価値を理解する
- [ ] `ln -s` コマンドの使用を習得する
- [ ] シンボリックリンクとファイルコピーの違いを理解する
- [ ] gitベースのスキルリポジトリを作成できる
- [ ] スキルの自動更新を実現できる
- [ ] 複数プロジェクトでスキルを共有する方法を知る
- [ ] 破損したシンボリックリンクの処理メカニズムを理解する

---

## 落とし穴の警告

### よくあるエラー1：シンボリックリンクのパスが間違っている

**エラーシナリオ**：相対パスを使用してシンボリックリンクを作成し、プロジェクトを移動した後にリンクが無効になる。

```bash
# ❌ エラー：相対パスを使用
cd ~/my-project
ln -s ../dev/my-skills/my-first-skill .claude/skills/my-first-skill

# プロジェクトを移動するとリンクが無効になる
mv ~/my-project ~/new-location/project
npx openskills list  # ❌ スキルが見つからない
```

**問題**：
- 相対パスは現在の作業ディレクトリに依存します
- プロジェクトを移動すると相対パスが無効になります
- シンボリックリンクが間違った場所を指します

**正しい方法**：

```bash
# ✅ 正しい：絶対パスを使用
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# プロジェクトを移動しても有効
mv ~/my-project ~/new-location/project
npx openskills list  # ✅ スキルが見つかる
```

---

### よくあるエラー2：ハードリンクとシンボリックリンクの混同

**エラーシナリオ**：シンボリックリンクではなくハードリンクを使用する。

```bash
# ❌ エラー：ハードリンクを使用（-s パラメータなし）
ln ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ハードリンクはファイルの別のエントリポイントであり、ポインタではない
# 「1箇所の更新で、すべてに反映」を実現できない
```

**問題**：
- ハードリンクはファイルの別のエントリ名です
- いずれかのハードリンクを修正すると、他のハードリンクも更新されます
- ただし、ソースファイルを削除すると、ハードリンクは依然として存在し、混乱を招きます
- ファイルシステムをまたいで使用できません

**正しい方法**：

```bash
# ✅ 正しい：シンボリックリンクを使用（-s パラメータ付き）
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# シンボリックリンクはポインタです
# ソースファイルを削除すると、シンボリックリンクは無効になります（OpenSkillsはスキップします）
```

---

### よくあるエラー3：シンボリックリンクが間違った場所を指している

**エラーシナリオ**：シンボリックリンクがスキルディレクトリの親ディレクトリを指しており、スキルディレクトリ自体ではない。

```bash
# ❌ エラー：親ディレクトリを指す
ln -s ~/dev/my-skills .claude/skills/my-skills-link

# OpenSkillsは .claude/skills/my-skills-link/ で SKILL.md を探します
# しかし実際の SKILL.md は ~/dev/my-skills/my-first-skill/SKILL.md にあります
```

**問題**：
- OpenSkillsは `<link>/SKILL.md` を探します
- しかし実際のスキルは `<link>/my-first-skill/SKILL.md` にあります
- スキルファイルが見つかりません

**正しい方法**：

```bash
# ✅ 正しい：スキルディレクトリを直接指す
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# OpenSkillsは .claude/skills/my-first-skill/SKILL.md を探します
# シンボリックリンクが指すディレクトリに SKILL.md が含まれています
```

---

### よくあるエラー4：AGENTS.mdの同期を忘れる

**エラーシナリオ**：シンボリックリンクを作成した後、AGENTS.mdの同期を忘れる。

```bash
# シンボリックリンクを作成
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ❌ エラー：AGENTS.mdの同期を忘れる
# AIエージェントは新しいスキルが利用可能であることを知りません
```

**問題**：
- シンボリックリンクが作成されましたが、AGENTS.mdが更新されていません
- AIエージェントは新しいスキルを知りません
- 新しいスキルを呼び出すことができません

**正しい方法**：

```bash
# シンボリックリンクを作成
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ✅ 正しい：AGENTS.mdを同期
npx openskills sync

# AIエージェントは新しいスキルを確認できるようになります
```

---

## このレッスンのまとめ

**重要なポイント**：

1. **シンボリックリンクはポインタ**：`ln -s` で作成し、実際のファイルまたはディレクトリを指します
2. **リンクを自動的にたどる**：OpenSkillsは `statSync()` を使用してシンボリックリンクを自動的にたどります
3. **破損したリンクを自動的にスキップ**：`try/catch` で例外をキャッチし、クラッシュを回避します
4. **gitベースの自動更新**：Gitリポジトリが更新されると、スキルが自動的に同期されます
5. **複数プロジェクトでの共有**：複数のプロジェクトが同じスキルを指すシンボリックリンクを作成できます

**意思決定フロー**：

```
[スキルを使用する必要がある] → [頻繁に修正する必要があるか？]
                         ↓ 是
                 [シンボリックリンクを使用（ローカル開発）]
                         ↓ 否
                 [複数のプロジェクトで共有するか？]
                         ↓ 是
                 [git + シンボリックリンクを使用]
                         ↓ 否
                 [通常の install を使用]
```

**記憶のキーワード**：

- **ローカル開発には symlink**：頻繁に修正し、重複コピーを回避
- **チーム共有は git リンク**：1回の更新で、すべてに反映
- **絶対パスで安定**：相対パスの無効化を回避
- **破損リンクは自動スキップ**：OpenSkillsが自動的に処理

---

## 次のレッスンのプレビュー

> 次のレッスンでは **[カスタムスキルの作成](../create-skills/)** を学習します。
>
> 学べること：
> - ゼロから独自のスキルを作成する方法
> - SKILL.md フォーマットと YAML frontmatter の理解
> - スキルディレクトリ構造の整理方法（references/、scripts/、assets/）
> - 高品質なスキル説明の書き方

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能            | ファイルパス                                                                                              | 行番号    |
|--- | --- | ---|
| シンボリックリンク検出    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)      | 10-25   |
| スキル検索        | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L30-L64)      | 30-64   |
| 単一スキル検索    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84)      | 69-84   |

**重要な関数**：

- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`：ディレクトリエントリが実際のディレクトリか、ディレクトリを指すシンボリックリンクかを判断する
  - `entry.isSymbolicLink()` でシンボリックリンクを検出
  - `statSync()` でシンボリックリンクを自動的にターゲットへたどる
  - `try/catch` で破損したシンボリックリンクをキャッチし、`false` を返す

- `findAllSkills()`：インストールされたすべてのスキルを検索する
  - 4つの検索ディレクトリを走査
  - `isDirectoryOrSymlinkToDirectory` を呼び出してシンボリックリンクを識別
  - 破損したシンボリックリンクを自動的にスキップ

**ビジネスルール**：

- シンボリックリンクは自動的にスキルディレクトリとして認識されます
- 破損したシンボリックリンクはエレガントにスキップされ、クラッシュを引き起こしません
- シンボリックリンクと実際のディレクトリの検索優先度は同じです

</details>
