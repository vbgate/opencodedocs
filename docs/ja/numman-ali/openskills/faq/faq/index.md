---
title: "よくある質問: トラブルシューティングガイド | OpenSkills"
subtitle: "よくある質問: トラブルシューティングガイド"
sidebarTitle: "トラブルシューティング"
description: "OpenSkillsのよくある質問と解決策を学びます。インストール失敗、スキルが読み込まれない、AGENTS.md同期などのトラブルを素早く解決し、スキル管理効率を向上させます。"
tags:
  - "FAQ"
  - "トラブルシューティング"
  - "よくある質問"
prerequisite:
  - "start-quick-start"
order: 1
---

# よくある質問

## 学習することでできること

このレッスンでは、OpenSkills使用中のよくある質問に答え、以下をサポートします:

- ✅ インストール失敗の問題を迅速に特定して解決
- ✅ OpenSkillsとClaude Codeの関係を理解
- ✅ AGENTS.mdにスキルが表示されない問題を解決
- ✅ スキルの更新と削除に関する疑問を処理
- ✅ マルチエージェント環境で正しくスキルを設定

## 現在直面している課題

OpenSkillsを使用中、以下の問題に遭遇するかもしれません:

- 「インストールが常に失敗し、どこが間違っているかわからない」
- 「AGENTS.mdにインストールしたばかりのスキルが表示されない」
- 「スキルがどこにインストールされたかわからない」
- 「OpenSkillsを使用したいが、Claude Codeと競合するのが心配」

このレッスンで、問題の根本原因と解決策を迅速に見つけましょう。

---

## コア概念に関する質問

### OpenSkillsとClaude Codeの違いは？

**簡潔な回答**: OpenSkillsは「汎用インストーラー」、Claude Codeは「公式エージェント」。

**詳細な説明**:

| 比較項目 | OpenSkills | Claude Code |
| --- | --- | ---|
| **位置付け** | 汎用スキルローダー | Anthropic公式AIコーディングエージェント |
| **サポート範囲** | すべてのAIエージェント（Cursor、Windsurf、Aiderなど） | Claude Codeのみ |
| **スキルフォーマット** | Claude Codeと完全互換（`SKILL.md`） | 公式仕様 |
| **インストール方法** | GitHub、ローカルパス、プライベートリポジトリからインストール | 組み込みMarketplaceからインストール |
| **スキル保存場所** | `.claude/skills/` または `.agent/skills/` | `.claude/skills/` |
| **呼び出し方法** | `npx openskills read <name>` | 組み込み `Skill()` ツール |

**コア価値**: OpenSkillsにより、他のエージェントもAnthropicのスキルシステムを使用でき、各エージェントが個別に実装を待つ必要がなくなります。

### なぜ CLI ではなく MCP なのか？

**主な理由**: スキルは静的ファイル、MCPは動的ツールであり、それぞれ異なる問題を解決します。

| 比較項目 | MCP（Model Context Protocol） | OpenSkills（CLI） |
| --- | --- | --- |
| **適用シナリオ** | 動的ツール、リアルタイムAPI呼び出し | 静的命令、ドキュメント、スクリプト |
| **実行要件** | MCPサーバーが必要 | サーバー不要（ファイルのみ） |
| **エージェントサポート** | MCPをサポートするエージェントのみ | `AGENTS.md` を読めるすべてのエージェント |
| **複雑さ** | サーバーデプロイが必要 | ゼロ設定 |

**重要ポイント**:

- **スキルはファイル**: SKILL.mdは静的命令+リソース（references/、scripts/、assets/）であり、サーバーは不要
- **エージェントサポート不要**: シェルコマンドを実行できるすべてのエージェントで使用可能
- **公式設計に準拠**: Anthropicのスキルシステム自体がファイルシステム設計であり、MCP設計ではない

**まとめ**: MCPとスキルシステムはそれぞれ異なる問題を解決します。OpenSkillsはスキルの軽量性と汎用性を維持し、すべてのエージェントがMCPをサポートする必要がなくなります。

---

## インストールと設定に関する質問

### インストールが失敗した場合は？

**一般的なエラーと解決策**:

#### エラー1: クローン失敗

```bash
Error: Git clone failed
```

**考えられる原因**:
- ネットワークの問題（GitHubにアクセスできない）
- Gitがインストールされていないか、バージョンが古すぎる
- プライベートリポジトリにSSHキーが設定されていない

**解決策**:

1. Gitがインストールされているか確認:
   ```bash
   git --version
   # 次のように表示されるはず: git version 2.x.x
   ```

2. ネットワーク接続を確認:
   ```bash
   # GitHubにアクセスできるかテスト
   ping github.com
   ```

3. プライベートリポジトリにはSSHを設定:
   ```bash
   # SSH接続をテスト
   ssh -T git@github.com
   ```

#### エラー2: パスが存在しない

```bash
Error: Path does not exist: ./nonexistent-path
```

**解決策**:
- ローカルパスが正しいか確認
- 絶対パスまたは相対パスを使用:
  ```bash
  # 絶対パス
  npx openskills install /Users/dev/my-skills

  # 相対パス
  npx openskills install ./my-skills
  ```

#### エラー3: SKILL.mdが見つからない

```bash
Error: No valid SKILL.md found
```

**解決策**:

1. スキルディレクトリ構造を確認:
   ```bash
   ls -la ./my-skill
   # SKILL.mdが含まれている必要があります
   ```

2. SKILL.mdに有効なYAML frontmatterがあるか確認:
   ```markdown
   ---
   name: my-skill
   description: Skill description
   ---

   # Skill content
   ```

### スキルはどのディレクトリにインストールされますか？

**デフォルトのインストール場所**（プロジェクトローカル）:
```bash
.claude/skills/
```

**グローバルインストール場所**（`--global` 使用）:
```bash
~/.claude/skills/
```

**Universalモード**（`--universal` 使用）:
```bash
.agent/skills/
```

**スキル検索優先順位**（高い順）:
1. `./.agent/skills/` （プロジェクトローカル、Universal）
2. `~/.agent/skills/` （グローバル、Universal）
3. `./.claude/skills/` （プロジェクトローカル、デフォルト）
4. `~/.claude/skills/` （グローバル、デフォルト）

**インストール済みスキルの場所を確認**:
```bash
npx openskills list
# 出力に[project]または[global]タグが表示されます
```

### Claude Code Marketplaceと共存する方法は？

**問題**: Claude Codeを使用しつつ、OpenSkillsも使用したいが、競合を避けるには？

**解決策**: Universalモードを使用

```bash
# .claude/skills/ ではなく .agent/skills/ にインストール
npx openskills install anthropics/skills --universal
```

**なぜ有効なのか**:

| ディレクトリ | 誰が使用 | 説明 |
| --- | --- | --- |
| `.claude/skills/` | Claude Code | Claude Code Marketplaceが使用 |
| `.agent/skills/` | OpenSkills | 他のエージェント（Cursor、Windsurf）が使用 |

**競合警告**:

公式リポジトリからインストールする場合、OpenSkillsは次のように警告します:
```
⚠️  Warning: These skills are also available in Claude Code Marketplace.
   Installing to .claude/skills/ may cause conflicts.
   Use --universal to install to .agent/skills/ instead.
```

---

## 使用に関する質問

### スキルがAGENTS.mdに表示されない？

**症状**: スキルをインストールしたが、AGENTS.mdに表示されない。

**トラブルシューティング手順**:

#### 1. 同期されているか確認

スキルをインストールした後、`sync`コマンドを実行する必要があります:

```bash
npx openskills install anthropics/skills
# スキルを選択...

# syncを実行！
npx openskills sync
```

#### 2. AGENTS.mdの場所を確認

```bash
# デフォルトではAGENTS.mdはプロジェクトルートディレクトリにある
cat AGENTS.md
```

カスタム出力パスを使用している場合、パスが正しいか確認:
```bash
npx openskills sync -o custom-path/AGENTS.md
```

#### 3. スキルが選択されているか確認

`sync`コマンドは対話型で、同期するスキルを選択する必要があります:

```bash
npx openskills sync

? Select skills to sync:
  ◉ pdf                  [選択済み]
  ◯ check-branch-first   [未選択]
```

#### 4. AGENTS.mdの内容を確認

XMLタグが正しいか確認:

```xml
<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
```

### スキルを更新する方法は？

**すべてのスキルを更新**:
```bash
npx openskills update
```

**指定したスキルを更新**（カンマ区切り）:
```bash
npx openskills update pdf,git-workflow
```

**よくある質問**:

#### スキルが更新されない

**症状**: `update`を実行した後に「skipped」と表示される

**原因**: スキルをインストール時にソース情報が記録されていない（旧バージョンの動作）

**解決策**:
```bash
# 再インストールしてソースを記録
npx openskills install anthropics/skills
```

#### ローカルスキルを更新できない

**症状**: ローカルパスからインストールしたスキルが、update時にエラーになる

**原因**: ローカルパスのスキルは手動で更新する必要がある

**解決策**:
```bash
# ローカルパスから再インストール
npx openskills install ./my-skill
```

### スキルを削除する方法は？

**方法1: 対話型削除**

```bash
npx openskills manage
```

削除するスキルを選択し、スペースで選択して、Enterで確認。

**方法2: 直接削除**

```bash
npx openskills remove <skill-name>
```

**削除後**: `sync`を実行してAGENTS.mdを更新することを忘れずに:
```bash
npx openskills sync
```

**よくある質問**:

#### 誤ってスキルを削除した

**復元方法**:
```bash
# ソースから再インストール
npx openskills install anthropics/skills
# 誤って削除したスキルを選択
```

#### 削除後もAGENTS.mdに表示される

**解決策**: 再同期
```bash
npx openskills sync
```

---

## 上級者向け質問

### 複数プロジェクトでスキルを共有するには？

**シナリオ**: 複数プロジェクトで同じスキルセットを使用したいが、毎回インストールしたくない。

**解決策1: グローバルインストール**

```bash
# 一度グローバルインストール
npx openskills install anthropics/skills --global

# すべてのプロジェクトで使用可能
cd project-a
npx openskills read pdf

cd project-b
npx openskills read pdf
```

**利点**:
- 一度のインストールでどこでも使用可能
- ディスク使用量を削減

**欠点**:
- スキルがプロジェクトに含まれないため、バージョン管理に含まれない

**解決策2: シンボリックリンク**

```bash
# 1. グローバルにスキルをインストール
npx openskills install anthropics/skills --global

# 2. プロジェクトにシンボリックリンクを作成
cd project-a
ln -s ~/.claude/skills/pdf .claude/skills/pdf

# 3. sync時に[project]位置として認識される
npx openskills sync
```

**利点**:
- スキルがプロジェクトにある（`[project]`タグ）
- バージョン管理にシンボリックリンクを含めることができる
- 一度のインストールで複数の場所で使用可能

**欠点**:
- 一部システムではシンボリックリンクに権限が必要

**解決策3: Git Submodule**

```bash
# プロジェクトにスキルリポジトリをサブモジュールとして追加
cd project-a
git submodule add https://github.com/anthropics/skills.git .claude/skills-repo

# サブモジュール内のスキルをインストール
npx openskills install .claude/skills-repo/pdf
```

**利点**:
- 完全なバージョン管理
- スキルバージョンを指定可能

**欠点**:
- 設定が複雑

### シンボリックリンクにアクセスできない？

**症状**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**システム別解決策**:

#### macOS

1. 「システム環境設定」を開く
2. 「セキュリティとプライバシー」に進む
3. 「完全なディスクアクセス」で、ターミナルアプリを許可

#### Windows

Windowsはネイティブでシンボリックリンクをサポートしていないため、推奨:
- **Git Bashを使用**: シンボリックリンクサポートが組み込まれている
- **WSLを使用**: Linuxサブシステムがシンボリックリンクをサポート
- **開発者モードを有効化**: 設定 → 更新とセキュリティ → 開発者モード

```bash
# Git Bashでシンボリックリンクを作成
ln -s /c/dev/my-skills/my-skill .claude/skills/my-skill
```

#### Linux

ファイルシステム権限を確認:

```bash
# ディレクトリ権限を確認
ls -la .claude/

# 書き込み権限を追加
chmod +w .claude/
```

### スキルが見つからない？

**症状**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**トラブルシューティング手順**:

#### 1. スキルがインストールされているか確認

```bash
npx openskills list
```

#### 2. スキル名の大文字小文字を確認

```bash
# ❌ エラー（大文字）
npx openskills read My-Skill

# ✅ 正解（小文字）
npx openskills read my-skill
```

#### 3. スキルがより高い優先順位のスキルによって上書きされていないか確認

```bash
# すべてのスキルの場所を確認
ls -la .claude/skills/my-skill
ls -la ~/.claude/skills/my-skill
ls -la .agent/skills/my-skill
ls -la ~/.agent/skills/my-skill
```

**スキル検索ルール**: 最も優先順位が高い場所のスキルが、他の場所の同名スキルを上書きします。

---

## まとめ

OpenSkillsのよくある質問の要点:

### コア概念

- ✅ OpenSkillsは汎用インストーラー、Claude Codeは公式エージェント
- ✅ CLIはMCPよりもスキルシステムに適している（静的ファイル）

### インストールと設定

- ✅ スキルはデフォルトで `.claude/skills/` にインストール
- ✅ `--universal` を使用してClaude Codeとの競合を回避
- ✅ インストール失敗は通常ネットワーク、Git、パスの問題

### 使用方法

- ✅ インストール後に `sync` を実行しないとAGENTS.mdに表示されない
- ✅ `update` コマンドはソース情報があるスキルのみ更新
- ✅ スキル削除後も `sync` を忘れずに

### 上級シナリオ

- ✅ 複数プロジェクトでのスキル共有: グローバルインストール、シンボリックリンク、Git Submodule
- ✅ シンボリックリンクの問題: システムに応じて権限を設定
- ✅ スキルが見つからない: 名前を確認、優先順位を確認

## 次のレッスンのプレビュー

> 次のレッスンでは **[トラブルシューティング](../troubleshooting/)** を学習します。
>
> 学習内容:
> - 一般的なエラーの迅速な診断と解決方法
> - パスエラー、クローン失敗、無効なSKILL.mdなどの問題処理
> - 権限の問題とシンボリックリンクの故障診断スキル

---

## 付録: ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時: 2026-01-24

| 機能 | ファイルパス | 行号 |
| --- | --- | --- |
| インストールコマンド | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-424 |
| 同期コマンド | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 1-99 |
| 更新コマンド | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-113 |
| 削除コマンド | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30 |
| スキル検索 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 1-50 |
| ディレクトリ優先順位 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| AGENTS.md生成 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93 |

**重要な関数**:
- `findAllSkills()`: すべてのスキルを検索（優先順位でソート）
- `findSkill(name)`: 指定したスキルを検索
- `generateSkillsXml()`: AGENTS.md XML形式を生成
- `updateSkillFromDir()`: ディレクトリからスキルを更新

</details>
