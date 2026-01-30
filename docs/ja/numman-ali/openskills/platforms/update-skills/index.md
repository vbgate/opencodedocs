---
title: "スキル更新：スキルを最新に保つ | opencode-openskills"
sidebarTitle: "スキルをワンクリックで更新"
subtitle: "スキル更新：スキルを最新に保つ"
description: "OpenSkills updateコマンドを使用して、インストール済みのスキルを最新にする方法を学びます。全スキルの一括更新や指定スキルの更新をサポートし、ローカルパスとgitリポジトリの更新の違いを理解し、スキルを最新バージョンに保ちます。"
tags:
  - "skills"
  - "update"
  - "git"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 5
---

# スキル更新：スキルをソースリポジトリと同期させる

## このレッスンでできること

このレッスンでは、OpenSkills スキルを常に最新バージョンに保つ方法を学びます。OpenSkills update コマンドを使用して、以下のことができるようになります：

- ワンクリックで全インストール済みスキルを更新
- 指定した複数のスキルのみを更新
- 異なるインストール元による更新の違いを理解
- 更新失敗の原因をトラブルシューティング

## 現在直面している問題

スキルリポジトリは絶えず更新されています——作成者がバグを修正し、新機能を追加し、ドキュメントを改善しています。しかし、あなたがインストールしたスキルは古いバージョンのままです。

既にこのような状況に遭遇したことがあるかもしれません：
- スキルドキュメントには「ある機能をサポート」と書かれているが、AIエージェントは「わからない」と言う
- スキルでより良いエラーメッセージが更新されたが、あなたが見ているのはまだ古いもの
- インストール時のバグは修正されたが、まだ影響を受けている

**毎回削除して再インストールするのは面倒です**——効率的な更新方法が必要です。

## いつこの機能を使うか

`update` コマンドを使用する典型的なシーン：

| シーン | 操作 |
|--- | ---|
| スキルに更新があると気づく | `openskills update` を実行 |
| 数個のスキルのみ更新したい | `openskills update skill1,skill2` |
| ローカル開発スキルのテスト | ローカルパスから更新 |
| GitHubリポジトリから更新 | 自動で最新コードをgit clone |

::: tip 更新頻度の推奨
- **コミュニティスキル**：毎月1回更新し、最新の改善を取得
- **自分で開発したスキル**：修正のたびに手動で更新
- **ローカルパススキル**：コードを修正するたびに更新
:::

## 🎒 開始前の準備

始める前に、以下が完了していることを確認してください：

- [x] OpenSkillsがインストール済み（[OpenSkillsのインストール](../../start/installation/)を参照）
- [x] 少なくとも1つのスキルがインストール済み（[最初のスキルをインストール](../../start/first-skill/)を参照）
- [x] GitHubからインストールした場合、ネットワーク接続があることを確認

## 核心アイデア

OpenSkills の更新メカニズムは非常にシンプルです：

**インストール時にソース情報を記録 → 更新時に元のソースから再コピー**

::: info 再インストールが必要な理由
古いバージョンのスキル（インストール時にソースが記録されていない）は更新できません。この場合、一度再インストールする必要があります。OpenSkills がソースを記憶し、その後は自動的に更新できるようになります。
:::

**3種類のインストール元の更新方法**：

| ソースタイプ | 更新方法 | 適用シーン |
|--- | --- | ---|
| **ローカルパス** | ローカルパスから直接コピー | 自分のスキルを開発中 |
| **gitリポジトリ** | 最新コードを一時ディレクトリにクローン | GitHub/GitLabからインストール |
| **GitHub shorthand** | 完全URLに変換してクローン | GitHub公式リポジトリからインストール |

更新時、ソースメタデータがないスキルはスキップされ、再インストールが必要なスキル名がリスト表示されます。

## 実践してみよう

### ステップ1：インストール済みスキルを確認

まず、どのスキルを更新できるか確認しましょう：

```bash
npx openskills list
```

**表示されるもの**：インストール済みスキルのリスト（名前、説明、インストール場所のタグ（project/global）を含む）

### ステップ2：全スキルを更新

最もシンプルな方法は、インストール済みの全スキルを更新することです：

```bash
npx openskills update
```

**表示されるもの**：スキルを1つずつ更新し、各スキルの更新結果を表示

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Skipped: my-old-skill (no source metadata; re-install once to enable updates)
Summary: 2 updated, 1 skipped (3 total)
```

::: details スキップされたスキルの意味
`Skipped: xxx (no source metadata)` と表示された場合、このスキルは更新機能が追加される前にインストールされたことを意味します。自動更新を有効にするには、一度再インストールする必要があります。
:::

### ステップ3：指定したスキルを更新

特定の数個のスキルのみを更新したい場合、スキル名を（カンマ区切りで）指定します：

```bash
npx openskills update git-workflow,check-branch-first
```

**表示されるもの**：指定された2つのスキルのみが更新される

```
✅ Updated: git-workflow
✅ Updated: check-branch-first
Summary: 2 updated, 0 skipped (2 total)
```

### ステップ4：ローカル開発中のスキルを更新

ローカルでスキルを開発中の場合、ローカルパスから更新できます：

```bash
npx openskills update my-skill
```

**表示されるもの**：スキルがインストール時のローカルパスから再コピーされる

```
✅ Updated: my-skill
Summary: 1 updated, 0 skipped (1 total)
```

::: tip ローカル開発ワークフロー
開発プロセス：
1. スキルをインストール：`openskills install ./my-skill`
2. コードを修正
3. スキルを更新：`openskills update my-skill`
4. AGENTS.mdに同期：`openskills sync`
:::

### ステップ5：更新失敗を処理

一部のスキルの更新が失敗した場合、OpenSkills は詳細な理由を表示します：

```bash
npx openskills update
```

**表示される可能性のある状況**：

```
Skipped: git-workflow (git clone failed)
Skipped: my-skill (local source missing)
Missing source metadata (1): old-skill
Clone failed (1): git-workflow
```

**対応する解決方法**：

| エラーメッセージ | 原因 | 解決方法 |
|--- | --- | ---|
| `no source metadata` | 古いバージョンのインストール | 再インストール：`openskills install <source>` |
| `local source missing` | ローカルパスが削除された | ローカルパスを復元または再インストール |
| `SKILL.md missing at local source` | ローカルファイルが削除された | SKILL.mdファイルを復元 |
| `git clone failed` | ネットワーク問題またはリポジトリが存在しない | ネットワークまたはリポジトリアドレスを確認 |
| `SKILL.md not found in repo` | リポジトリ構造が変更された | スキル作成者に連絡するかsubpathを更新 |

## チェックポイント ✅

以下ができるようになったことを確認してください：

- [ ] `openskills update` を使用して全スキルを更新できる
- [ ] カンマ区切りで指定したスキルを更新できる
- [ ] 「スキップ」されたスキルの意味と解決方法を理解している
- [ ] ローカル開発スキルの更新プロセスを理解している

## 注意すべき点

### ❌ よくある間違い

| 間違い | 正しいアプローチ |
|--- | ---|
| スキップされたまま放置する | プロンプトに従って再インストールまたは問題を修正する |
| 毎回削除して再インストールする | `update` コマンドを使用する方が効率的 |
| どこからインストールしたか知らない | `openskills list` でソースを確認 |

### ⚠️ 注意事項

**更新はローカル修正を上書きします**

インストールディレクトリ内のスキルファイルを直接修正した場合、更新時にこれらの修正は上書きされます。正しいアプローチは以下の通りです：
1. **ソースファイル**（ローカルパスまたはリポジトリ）を修正する
2. その後 `openskills update` を実行

**シンボリックリンクスキルは特別な処理が必要**

スキルがシンボリックリンクを通じてインストールされている場合（[シンボリックリンクサポート](../../advanced/symlink-support/)を参照）、更新はリンクを再作成し、シンボリックリンク関係は破壊されません。

**グローバルとプロジェクトスキルはそれぞれ更新が必要**

```bash
# プロジェクトスキルのみ更新（デフォルト）
openskills update

# グローバルスキルは別途処理が必要
# または --universal モードで統一管理
```

## レッスンのまとめ

このレッスンでは、OpenSkills の更新機能を学びました：

- **一括更新**：`openskills update` で全スキルをワンクリック更新
- **指定更新**：`openskills update skill1,skill2` で特定のスキルを更新
- **ソース認識**：ローカルパスとgitリポジトリを自動認識
- **エラーメッセージ**：スキップの理由と解決方法を詳細に説明

更新機能によりスキルを最新バージョンに保ち、使用しているスキルが常に最新の改善と修正を含んでいることを保証します。

## 次のレッスン预告

> 次のレッスンでは、**[スキルの削除](../remove-skills/)** を学びます。
>
> 学べること：
> - インタラクティブな `manage` コマンドを使用してスキルを削除する方法
> - `remove` コマンドを使用してスクリプト化された削除を行う方法
> - スキル削除後の注意点

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| スキル更新メインロジック | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L14-L150) | 14-150 |
| ローカルパス更新 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L64-L82) | 64-82 |
| Gitリポジトリ更新 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L85-L125) | 85-125 |
| ディレクトリからスキルをコピー | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L152-L163) | 152-163 |
| パスセキュリティ検証 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L165-L172) | 165-172 |
| メタデータ構造定義 | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L8-L15) | 8-15 |
| スキルメタデータの読み取り | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L17-L27) | 17-27 |
| スキルメタデータの書き込み | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts#L29-L36) | 29-36 |
| CLIコマンド定義 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L58-L62) | 58-62 |

**重要な定数**：
- `SKILL_METADATA_FILE = '.openskills.json'`：メタデータファイル名、スキルのインストール元を記録

**重要な関数**：
- `updateSkills(skillNames)`：指定または全スキルを更新するメイン関数
- `updateSkillFromDir(targetPath, sourceDir)`：ソースディレクトリからスキルをターゲットディレクトリにコピー
- `isPathInside(targetPath, targetDir)`：インストールパスのセキュリティを検証（パストラバーサルを防止）
- `readSkillMetadata(skillDir)`：スキルのメタデータを読み取る
- `writeSkillMetadata(skillDir, metadata)`：スキルのメタデータを書き込み/更新

**ビジネスルール**：
- **BR-5-1**：デフォルトで全インストール済みスキルを更新（update.ts:37-38）
- **BR-5-2**：カンマ区切りのスキル名リストをサポート（update.ts:15）
- **BR-5-3**：ソースメタデータがないスキルをスキップ（update.ts:56-62）
- **BR-5-4**：ローカルパスからの更新をサポート（update.ts:64-82）
- **BR-5-5**：gitリポジトリからの更新をサポート（update.ts:85-125）
- **BR-5-6**：パスセキュリティを検証（update.ts:156-162）

</details>
