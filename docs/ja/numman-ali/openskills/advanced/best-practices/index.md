---
title: "ベストプラクティス：プロジェクト設定とチームコラボレーション | OpenSkills"
sidebarTitle: "5分でチームスキルを設定"
subtitle: "ベストプラクティス：プロジェクト設定とチームコラボレーション"
description: "OpenSkillsのベストプラクティスを学びます。プロジェクトローカル vs グローバルインストール、Universalモード設定、SKILL.md作成規範、CI/CD統合を習得し、チームコラボレーション効率を向上させます。"
tags:
  - "advanced"
  - "best-practices"
  - "skills"
  - "team"
prerequisite:
  - "start-quick-start"
  - "start-installation"
  - "start-first-skill"
order: 8
---

# ベストプラクティス

## 学習後の目標

- プロジェクト要件に基づいて適切なスキルインストール方法を選択する（プロジェクトローカル vs グローバル vs Universal）
- 規範に準拠したSKILL.mdファイルを作成する（命名、説明、命令）
- シンボリックリンクを使用して効率的なローカル開発を行う
- スキルのバージョンと更新を管理する
- チーム環境でスキルを共同利用する
- OpenSkillsをCI/CDフローに統合する

## 現在直面している課題

スキルのインストールと使用方法は学びましたが、実際のプロジェクトでは以下の問題に直面しています：

- スキルはプロジェクトディレクトリにインストールすべきか、それともグローバルにインストールすべきか？
- 複数のAIエージェント間でスキルを共有するにはどうすればよいか？
- スキルを何度も書いたが、AIはまだ覚えていない
- チームメンバーがそれぞれスキルをインストールし、バージョンが一貫していない
- ローカルでスキルを修正するたびに、再インストールが面倒

このレッスンでは、OpenSkillsのベストプラクティスをまとめ、これらの問題を解決します。

## いつこの方法を使うか

- **プロジェクト設定の最適化**：プロジェクトの種類に基づいて適切なスキルインストール場所を選択する
- **マルチエージェント環境**：Claude Code、Cursor、Windsurfなどのツールを同時に使用する
- **スキルの標準化**：チームでスキルフォーマットと作成規範を統一する
- **ローカル開発**：スキルを素早く反復開発・テストする
- **チームコラボレーション**：スキルを共有し、バージョン管理し、CI/CDを統合する

## 🎒 開始前の準備

::: warning 前提チェック

開始前に、以下を確認してください：

- ✅ [クイックスタート](../../start/quick-start/)を完了している
- ✅ 少なくとも1つのスキルをインストールし、AGENTS.mdに同期している
- ✅ [SKILL.mdの基本形式](../../start/what-is-openskills/)を理解している

:::

## プロジェクト設定のベストプラクティス

### 1. プロジェクトローカル vs グローバル vs Universalインストール

適切なインストール場所を選択することが、プロジェクト設定の第一歩です。

#### プロジェクトローカルインストール（デフォルト）

**適用シーン**：特定のプロジェクト専用のスキル

```bash
# .claude/skills/にインストール
npx openskills install anthropics/skills
```

**メリット**：

- ✅ スキルがプロジェクトのバージョン管理に含まれる
- ✅ 異なるプロジェクトで異なるスキルバージョンを使用できる
- ✅ グローバルインストール不要、依存関係を減らす

**推奨事項**：

- プロジェクト専用のスキル（特定のフレームワークのビルドプロセスなど）
- チーム内で開発した業務スキル
- プロジェクト設定に依存するスキル

#### グローバルインストール

**適用シーン**：すべてのプロジェクトで共通して使用するスキル

```bash
# ~/.claude/skills/にインストール
npx openskills install anthropics/skills --global
```

**メリット**：

- ✅ すべてのプロジェクトで同一のスキルセットを共有
- ✅ 各プロジェクトで重複インストール不要
- ✅ 更新を集中管理

**推奨事項**：

- Anthropic公式スキルライブラリ（anthropics/skills）
- 汎用ツールスキル（PDF処理、Git操作など）
- 個人がよく使用するスキル

#### Universalモード（マルチエージェント環境）

**適用シーン**：複数のAIエージェントを同時に使用する

```bash
# .agent/skills/にインストール
npx openskills install anthropics/skills --universal
```

**優先順位**（高い順）：

1. `./.agent/skills/`（プロジェクトローカルUniversal）
2. `~/.agent/skills/`（グローバルUniversal）
3. `./.claude/skills/`（プロジェクトローカルClaude Code）
4. `~/.claude/skills/`（グローバルClaude Code）

**推奨事項**：

- ✅ 複数のエージェント（Claude Code + Cursor + Windsurf）を使用する場合
- ✅ Claude Code Marketplaceとの競合を回避する
- ✅ すべてのエージェントのスキルを統一管理する

::: tip いつUniversalモードを使うか？

`AGENTS.md`がClaude Codeと他のエージェントで共有されている場合、`--universal`を使用してスキルの競合を回避します。Universalモードは`.agent/skills/`ディレクトリを使用し、Claude Codeの`.claude/skills/`と分離されます。

:::

### 2. グローバルインストールよりもnpxを優先する

OpenSkillsは使い捨て（use-and-throw）設計のため、常に`npx`を使用することを推奨します：

```bash
# ✅ 推奨：npxを使用
npx openskills install anthropics/skills
npx openskills sync
npx openskills list

# ❌ 回避：グローバルインストール後に直接呼び出す
openskills install anthropics/skills
```

**メリット**：

- ✅ グローバルインストール不要、バージョン競合を回避
- ✅ 常に最新バージョンを使用（npxは自動更新）
- ✅ システム依存関係を減らす

**いつグローバルインストールが必要か**：

- CI/CD環境（パフォーマンスのため）
- スクリプトで頻繁に呼び出す（npxの起動時間を減らす）

```bash
# CI/CDまたはスクリプトでグローバルインストール
npm install -g openskills
openskills install anthropics/skills -y
openskills sync -y
```

## スキル管理のベストプラクティス

### 1. SKILL.md作成規範

#### 命名規範：ハイフン形式を使用する

**ルール**：

- ✅ 正しい：`pdf-editor`、`api-client`、`git-workflow`
- ❌ 間違い：`PDF Editor`（スペース）、`pdf_editor`（アンダースコア）、`PdfEditor`（キャメルケース）

**理由**：ハイフン形式はURLに優しい識別子であり、GitHubリポジトリとファイルシステムの命名規範に準拠しています。

#### 説明の作成：三人称、1-2文

**ルール**：

- ✅ 正しい：`Use this skill for comprehensive PDF manipulation.`
- ❌ 間違い：`You should use this skill to manipulate PDFs.`（二人称）

**例の比較**：

| シーン | ❌ 間違い（二人称） | ✅ 正しい（三人称） |
|--- | --- | ---|
| PDFスキル | You can use this to extract text from PDFs. | Extract text from PDFs with this skill. |
| Gitスキル | When you need to manage branches, use this. | Manage Git branches with this skill. |
| APIスキル | If you want to call the API, load this skill. | Call external APIs with this skill. |

#### 命令の作成：命令形/不定詞形式

**ルール**：

- ✅ 正しい：`"To accomplish X, execute Y"`
- ✅ 正しい：`"Load this skill when Z"`
- ❌ 間違い：`"You should do X"`
- ❌ 間違い：`"If you need Y"`

**作成の心がけ**：

1. **動詞で始める**："Create" → "Use" → "Return"
2. **"You"を省略する**："You should"と言わない
3. **パスを明確にする**：リソースを参照する際は`references/`で始める

**例の比較**：

| ❌ 間違った書き方 | ✅ 正しい書き方 |
|--- | ---|
| "You should create a file" | "Create a file" |
| "When you want to load this skill" | "Load this skill when" |
| "If you need to see the docs" | "See references/guide.md" |

::: tip なぜ命令形/不定詞を使うのか？

このライティングスタイルにより、AIエージェントが命令を解析・実行しやすくなります。命令形（Imperative）と不定詞（Infinitive）は「あなた」という主語を排除し、命令をより直接的かつ明確にします。

:::

### 2. ファイルサイズの制御

**SKILL.mdファイルサイズ**：

- ✅ **推奨**：5000語以内
- ⚠️ **警告**：8000語を超えるとコンテキスト超限が発生する可能性あり
- ❌ **禁止**：10000語を超える

**制御方法**：

詳細なドキュメントを`references/`ディレクトリに移動する：

```markdown
# SKILL.md（コア命令）

## Instructions

To process data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format  # 詳細なドキュメント
3. Process the result

## Bundled Resources

For detailed API documentation, see:
- `references/api-docs.md`  # コンテキストにロードされない、トークンを節約
- `references/examples.md`
```

**ファイルサイズの比較**：

| ファイル | サイズ制限 | コンテキストにロードされるか |
|--- | --- | ---|
| `SKILL.md` | < 5000語 | ✅ はい |
| `references/` | 制限なし | ❌ いいえ（オンデマンドでロード） |
| `scripts/` | 制限なし | ❌ いいえ（実行可能） |
| `assets/` | 制限なし | ❌ いいえ（テンプレートファイル） |

### 3. スキル検索の優先順位

OpenSkillsは以下の優先順位でスキルを検索します（高い順）：

```
1. ./.agent/skills/        # Universalプロジェクトローカル
2. ~/.agent/skills/        # Universalグローバル
3. ./.claude/skills/      # Claude Codeプロジェクトローカル
4. ~/.claude/skills/      # Claude Codeグローバル
```

**重複排除メカニズム**：

- 同名のスキルは最初に見つかったものだけを返す
- プロジェクトローカルのスキルはグローバルのスキルより優先される

**例のシーン**：

```
プロジェクトA：
- .claude/skills/pdf        # プロジェクトローカルバージョンv1.0
- ~/.claude/skills/pdf     # グローバルバージョンv2.0

# openskills read pdfは.claude/skills/pdf（v1.0）をロード
```

**推奨**：

- プロジェクトの特殊な要件スキルはプロジェクトローカルに配置
- 汎用スキルはグローバルに配置
- マルチエージェント環境ではUniversalモードを使用

## ローカル開発のベストプラクティス

### 1. シンボリックリンクを使用した反復開発

**問題**：スキルを修正するたびに再インストールが必要で、開発効率が低い。

**解決策**：シンボリックリンク（symlink）を使用する

```bash
# 1. スキルリポジトリを開発ディレクトリにクローン
git clone git@github.com:your-org/my-skills.git ~/dev/my-skills

# 2. スキルディレクトリを作成
mkdir -p .claude/skills

# 3. シンボリックリンクを作成
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill

# 4. AGENTS.mdに同期
npx openskills sync
```

**メリット**：

- ✅ ソースファイルを修正すると即座に反映（再インストール不要）
- ✅ Gitベースの更新をサポート（pullするだけでOK）
- ✅ 複数のプロジェクトで同一のスキル開発バージョンを共有

**シンボリックリンクの確認**：

```bash
# シンボリックリンクを確認
ls -la .claude/skills/

# 出力例：
# my-skill -> /Users/yourname/dev/my-skills/my-skill
```

**注意事項**：

- ✅ シンボリックリンクは`openskills list`で認識される
- ✅ 壊れたシンボリックリンクは自動的にスキップされる（クラッシュしない）
- ⚠️ WindowsユーザーはGit BashまたはWSLを使用する必要がある（Windowsネイティブはシンボリックリンクをサポートしていない）

### 2. 複数のプロジェクトでスキルを共有

**シーン**：複数のプロジェクトで同一のチームスキルを使用する必要がある。

**方法1：グローバルインストール**

```bash
# チームスキルリポジトリをグローバルにインストール
npx openskills install your-org/team-skills --global
```

**方法2：開発ディレクトリへのシンボリックリンク**

```bash
# 各プロジェクトでシンボリックリンクを作成
ln -s ~/dev/team-skills/my-skill .claude/skills/my-skill
```

**方法3：Git Submodule**

```bash
# スキルリポジトリをサブモジュールとして追加
git submodule add git@github.com:your-org/team-skills.git .claude/skills

# サブモジュールを更新
git submodule update --init --recursive
```

**推奨選択**：

| 方法 | 適用シーン | メリット | デメリット |
|--- | --- | --- | ---|
| グローバルインストール | すべてのプロジェクトで統一スキルを共有 | 集中管理、更新が簡単 | プロジェクトごとのカスタマイズができない |
| シンボリックリンク | ローカル開発とテスト | 修正が即座に反映 | 手動でリンクを作成する必要がある |
| Git Submodule | チームコラボレーション、バージョン管理 | プロジェクトでバージョン管理 | サブモジュール管理が複雑 |

## チームコラボレーションのベストプラクティス

### 1. スキルのバージョン管理

**ベストプラクティス**：スキルリポジトリを独立してバージョン管理する

```bash
# チームスキルリポジトリ構造
team-skills/
├── .git/
├── pdf-editor/
│   └── SKILL.md
├── api-client/
│   └── SKILL.md
└── git-workflow/
    └── SKILL.md
```

**インストール方法**：

```bash
# チームリポジトリからスキルをインストール
npx openskills install git@github.com:your-org/team-skills.git
```

**更新プロセス**：

```bash
# すべてのスキルを更新
npx openskills update

# 特定のスキルを更新
npx openskills update pdf-editor,api-client
```

**バージョン管理の推奨事項**：

- Gitタグで安定版をマークする：`v1.0.0`、`v1.1.0`
- AGENTS.mdにスキルバージョンを記録する：`<skill name="pdf-editor" version="1.0.0">`
- CI/CDで安定版を固定して使用する

### 2. スキル命名規範

**チーム統一命名規範**：

| スキルタイプ | 命名パターン | 例 |
|--- | --- | ---|
| 汎用ツール | `<tool-name>` | `pdf`、`git`、`docker` |
| フレームワーク関連 | `<framework>-<purpose>` | `react-component`、`django-model` |
| ワークフロー | `<workflow>` | `ci-cd`、`code-review` |
| チーム専用 | `<team>-<purpose>` | `team-api`、`company-deploy` |

**例**：

```bash
# ✅ 統一命名
team-skills/
├── pdf/                     # PDF処理
├── git-workflow/           # Gitワークフロー
├── react-component/        # Reactコンポーネント生成
└── team-api/             # チームAPIクライアント
```

### 3. スキルドキュメント規範

**チーム統一ドキュメント構造**：

```markdown
---
name: <skill-name>
description: <1-2文、三人称>
author: <チーム/作成者>
version: <バージョン番号>
---

# <スキルタイトル>

## When to Use

Load this skill when:
- シーン1
- シーン2

## Instructions

To accomplish task:

1. ステップ1
2. ステップ2

## Bundled Resources

For detailed information:
- `references/api-docs.md`
- `scripts/helper.py`
```

**チェックリスト**：

- [ ] `name`はハイフン形式を使用
- [ ] `description`は1-2文、三人称
- [ ] 命令は命令形/不定詞形式
- [ ] `author`と`version`フィールドを含む（チーム規範）
- [ ] 詳細な`When to Use`説明を含む

## CI/CD統合のベストプラクティス

### 1. 非インタラクティブインストールと同期

**シーン**：CI/CD環境でスキル管理を自動化する

**`-y`フラグを使用してインタラクティブなプロンプトをスキップ**：

```bash
# CI/CDスクリプト例
#!/bin/bash

# スキルをインストール（非インタラクティブ）
npx openskills install anthropics/skills -y
npx openskills install git@github.com:your-org/team-skills.git -y

# AGENTS.mdに同期（非インタラクティブ）
npx openskills sync -y
```

**GitHub Actionsの例**：

```yaml
name: Setup Skills

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install OpenSkills
        run: npx openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Verify Skills
        run: npx openskills list
```

### 2. スキル更新の自動化

**定期的なスキル更新**：

```yaml
# .github/workflows/update-skills.yml
name: Update Skills

on:
  schedule:
    - cron: '0 0 * * 0'  # 毎週日曜日に更新
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update Skills
        run: npx openskills update -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add AGENTS.md
          git diff --staged --quiet || git commit -m "Update skills"
          git push
```

### 3. カスタム出力パス

**シーン**：スキルをカスタムファイルに同期する（`.ruler/AGENTS.md`など）

```bash
# カスタムファイルに同期
npx openskills sync -o .ruler/AGENTS.md -y
```

**CI/CDの例**：

```yaml
# 異なるAIエージェント用に異なるAGENTS.mdを生成
- name: Sync for Claude Code
  run: npx openskills sync -o AGENTS.md -y

- name: Sync for Cursor
  run: npx openskills sync -o .cursor/AGENTS.md -y

- name: Sync for Windsurf
  run: npx openskills sync -o .windsurf/AGENTS.md -y
```

## よくある質問と解決策

### 問題1：スキルが見つからない

**症状**：

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**トラブルシューティング手順**：

1. スキルがインストールされているか確認：
   ```bash
   npx openskills list
   ```

2. スキル名が正しいか確認（大文字と小文字を区別）：
   ```bash
   # ❌ 間違い
   npx openskills read My-Skill

   # ✅ 正しい
   npx openskills read my-skill
   ```

3. スキルが優先順位の高いディレクトリで上書きされているか確認：
   ```bash
   # スキルの場所を確認
   ls -la .claude/skills/my-skill
   ls -la ~/.claude/skills/my-skill
   ```

### 問題2：シンボリックリンクにアクセスできない

**症状**：

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**解決策**：

- **macOS**：システム設定でシンボリックリンクを許可する
- **Windows**：Git BashまたはWSLを使用する（Windowsネイティブはシンボリックリンクをサポートしていない）
- **Linux**：ファイルシステム権限を確認する

### 問題3：スキル更新後に有効にならない

**症状**：

```bash
npx openskills update
# ✅ Skills updated successfully

npx openskills read my-skill
# 内容はまだ古いバージョン
```

**原因**：AIエージェントが古いスキルコンテンツをキャッシュしている。

**解決策**：

1. AGENTS.mdを再同期する：
   ```bash
   npx openskills sync
   ```

2. スキルファイルのタイムスタンプを確認：
   ```bash
   ls -la .claude/skills/my-skill/SKILL.md
   ```

3. シンボリックリンクを使用している場合、スキルを再読み込み：
   ```bash
   npx openskills read my-skill
   ```

## 本レッスンのまとめ

OpenSkillsベストプラクティスの核心的なポイント：

### プロジェクト設定

- ✅ プロジェクトローカルインストール：特定のプロジェクト専用のスキル
- ✅ グローバルインストール：すべてのプロジェクトで共通のスキル
- ✅ Universalモード：マルチエージェント環境でスキルを共有
- ✅ グローバルインストールよりもnpxを優先する

### スキル管理

- ✅ SKILL.md作成規範：ハイフン命名、三人称の説明、命令形の命令
- ✅ ファイルサイズの制御：SKILL.md < 5000語、詳細なドキュメントは`references/`に配置
- ✅ スキル検索の優先順位：4つのディレクトリの優先順位と重複排除メカニズムを理解

### ローカル開発

- ✅ シンボリックリンクを使用した反復開発
- ✅ 複数のプロジェクトでスキルを共有：グローバルインストール、シンボリックリンク、Git Submodule

### チームコラボレーション

- ✅ スキルのバージョン管理：独立したリポジトリ、Gitタグ
- ✅ 統一命名規範：ツール、フレームワーク、ワークフロー
- ✅ 統一ドキュメント規範：author、version、When to Use

### CI/CD統合

- ✅ 非インタラクティブインストールと同期：`-y`フラグ
- ✅ 自動化された更新：定期的なタスク、workflow_dispatch
- ✅ カスタム出力パス：`-o`フラグ

## 次のレッスン予告

> 次のレッスンでは、**[よくある質問](../faq/faq/)**を学びます。
>
> 以下の内容を学びます：
> - OpenSkillsのよくある質問への迅速な回答
> - インストール失敗、スキルが読み込まれないなどのトラブルシューティング方法
> - Claude Codeと共存するための設定テクニック

---

## 付録：ソースコード参照

<details>
<summary><strong>展開してソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| スキル検索の優先順位 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| スキルの重複排除メカニズム | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 42-43, 57 |
| シンボリックリンク処理 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 10-25 |
| YAMLフィールド抽出 | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| パス走査の保護 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 71-78 |
| 非インタラクティブインストール | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 424 |
| カスタム出力パス | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 19-36 |

**重要な定数**：
- 4つのスキル検索ディレクトリ：`./.agent/skills/`、`~/.agent/skills/`、`./.claude/skills/`、`~/.claude/skills/`

**重要な関数**：
- `getSearchDirs(): string[]` - 優先順位でソートされたスキル検索ディレクトリを返す
- `isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean` - ディレクトリまたはディレクトリへのシンボリックリンクかどうかを確認
- `extractYamlField(content: string, field: string): string` - YAMLフィールド値を抽出（非貪欲マッチ）
- `isPathInside(path: string, targetDir: string): boolean` - パスがターゲットディレクトリ内にあるかどうかを検証（パス走査を防止）

**サンプルスキルファイル**：
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - 最小構造の例
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - 形式規範の参照

</details>
