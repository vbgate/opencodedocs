---
title: "Obsidian連携：プランを自動保存 | plannotator"
sidebarTitle: "Obsidianへ自動保存"
subtitle: "Obsidian連携：プランを自動保存 | plannotator"
description: "plannotatorのObsidian連携設定方法を学びます。承認したプランをvaultに自動保存し、frontmatterとタグの自動生成機能、カスタム保存パスの設定をマスターします。"
tags:
  - "plannotator"
  - "integration"
  - "obsidian"
  - "advanced"
prerequisite:
  - "start-getting-started"
order: 2
---

# Obsidian連携：プランをノートライブラリに自動保存

## この章で学べること

- 承認または却下したプランをObsidian vaultに自動保存する
- frontmatterとタグの生成メカニズムを理解する
- 保存パスとフォルダをカスタマイズする
- backlinkを活用してナレッジグラフを構築する

## 現在の課題

PlannotatorでAI生成プランをレビューし、承認した後、それらのプランは「消えて」しまいます。価値あるプランをObsidianに保存して、後から振り返ったり検索したりしたいのですが、手動でコピー＆ペーストするのは面倒で、フォーマットも崩れてしまいます。

## こんなときに使う

- Obsidianをナレッジ管理ツールとして使用している
- AI生成の実装プランを長期保存して振り返りたい
- Obsidianのgraph viewとタグシステムでプランを整理したい

## コアコンセプト

PlannotatorのObsidian連携機能は、プランを承認または却下したときに、自動的にプラン内容をObsidian vaultに保存します。システムは以下を行います：

1. **vaultsの検出**：Obsidian設定ファイルからすべてのvaultを自動読み取り
2. **frontmatterの生成**：作成日時、ソース、タグを含む
3. **タグの抽出**：プランタイトルとコードブロック言語から自動抽出
4. **backlinkの追加**：`[[Plannotator Plans]]`リンクを挿入し、ナレッジグラフ構築を支援

::: info Obsidianとは？
Obsidianはローカルファースト設計の双方向リンクノートアプリです。Markdownフォーマットをサポートし、グラフビューでノート間の関係を可視化できます。
:::

## 🎒 始める前の準備

Obsidianがインストールされ、設定済みであることを確認してください。Plannotatorはシステム内のvaultsを自動検出しますが、この機能を使用するには少なくとも1つのvaultが必要です。

## ステップバイステップ

### ステップ1：設定パネルを開く

Plannotatorインターフェースで、右上の歯車アイコンをクリックして設定パネルを開きます。

設定ダイアログが表示され、複数の設定オプションが含まれています。

### ステップ2：Obsidian連携を有効化

設定パネルで「Obsidian Integration」セクションを見つけ、スイッチをクリックして機能を有効にします。

有効にすると、Plannotatorがシステム内のObsidian vaultsを自動検出します。

ドロップダウンメニューに検出されたvaults（例：`My Vault`、`Work Notes`）が表示されます。

### ステップ3：vaultとフォルダを選択

ドロップダウンメニューからプランを保存したいvaultを選択します。vaultが検出されない場合は：

1. 「Custom path...」オプションを選択
2. テキストボックスにvaultの完全パスを入力

次に「Folder」フィールドで保存フォルダ名を設定します（デフォルトは`plannotator`）。

下部のプレビューパスに、プランが保存される場所が表示されます。

### ステップ4：プランを承認または却下

設定完了後、通常通りAI生成プランをレビューします。「Approve」または「Send Feedback」をクリックすると、プランが設定したvaultに自動保存されます。

Obsidianに新しいファイルが作成され、ファイル名は`Title - Jan 2, 2026 2-30pm.md`の形式になります。

### ステップ5：保存されたファイルを確認

Obsidianで保存されたファイルを開くと、以下の内容が表示されます：

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [plan, authentication, typescript, sql]
---

[[Plannotator Plans]]

## Implementation Plan: User Authentication

...
```

ファイル上部にYAML frontmatterがあり、作成日時、ソース、タグが含まれています。

## チェックポイント ✅

- [ ] 設定パネルでObsidian Integrationが有効になっている
- [ ] vaultを選択済み（またはカスタムパスを入力済み）
- [ ] フォルダ名を設定済み
- [ ] プランを承認または却下後、Obsidianに新しいファイルが作成される
- [ ] ファイルにfrontmatterと`[[Plannotator Plans]]` backlinkが含まれている

## Frontmatterとタグの詳細

### Frontmatterの構造

保存される各プランには以下のfrontmatterフィールドが含まれます：

| フィールド | 値の例                           | 説明                         |
|--- | --- | ---|
| `created` | `2026-01-24T14:30:00.000Z`    | ISO 8601形式の作成タイムスタンプ |
| `source` | `plannotator`                   | 固定値、ソースを識別         |
| `tags` | `[plan, authentication, typescript]` | 自動抽出されたタグ配列 |

### タグ生成ルール

Plannotatorは以下のルールでタグを自動抽出します：

1. **デフォルトタグ**：常に`plannotator`タグを含む
2. **プロジェクト名タグ**：gitリポジトリ名またはディレクトリ名から自動抽出
3. **タイトルキーワード**：最初のH1タイトルから意味のある単語を抽出（一般的なストップワードを除外）
4. **コード言語タグ**：コードブロックの言語識別子から抽出（例：`typescript`、`sql`）。汎用設定言語（`json`、`yaml`、`markdown`など）は自動的にフィルタリングされます。

ストップワードリスト（タグにならない単語）：
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

タグ数の制限：最大7個、抽出順に並びます。

### ファイル名の形式

ファイル名は読みやすい形式を採用：`Title - Jan 2, 2026 2-30pm.md`

| 部分       | 例           | 説明                  |
|--- | --- | ---|
| タイトル   | `User Authentication` | H1から抽出、50文字制限 |
| 日付       | `Jan 2, 2026` | 現在の日付             |
| 時刻       | `2-30pm`     | 現在の時刻（12時間制） |

### Backlinkメカニズム

各プランファイルの末尾に`[[Plannotator Plans]]`リンクが挿入されます。このbacklinkの役割：

- **ナレッジグラフ接続**：Obsidianのgraph viewで、すべてのプランが同じノードに接続される
- **クイックナビゲーション**：`[[Plannotator Plans]]`をクリックすると、すべての保存プランをまとめたインデックスページを作成できる
- **双方向リンク**：インデックスページでバックリンクを使用してすべてのプランを表示

## クロスプラットフォームサポート

Plannotatorは異なるOSのObsidian設定ファイルの場所を自動検出します：

| OS | 設定ファイルパス                                    |
|--- | ---|
| macOS     | `~/Library/Application Support/obsidian/obsidian.json` |
| Windows   | `%APPDATA%\obsidian/obsidian.json`                 |
| Linux     | `~/.config/obsidian/obsidian.json`                 |

自動検出に失敗した場合は、vaultパスを手動で入力できます。

## よくあるトラブル

### 問題1：vaultsが検出されない

**症状**：ドロップダウンメニューに「Detecting...」と表示されるが結果がない

**原因**：Obsidian設定ファイルが存在しないか、フォーマットが不正

**解決方法**：
1. Obsidianがインストールされ、少なくとも一度開いたことを確認
2. 設定ファイルが存在するか確認（上記の表のパスを参照）
3. 「Custom path...」でvaultパスを手動入力

### 問題2：保存後にファイルが見つからない

**症状**：プランを承認後、Obsidianに新しいファイルがない

**原因**：vaultパスが間違っているか、Obsidianが更新されていない

**解決方法**：
1. 設定パネルのプレビューパスが正しいか確認
2. Obsidianで「Reload vault」をクリックするか、`Cmd+R`（macOS）/ `Ctrl+R`（Windows/Linux）を押す
3. 正しいvaultを選択しているか確認

### 問題3：ファイル名に特殊文字が含まれる

**症状**：ファイル名に`_`やその他の置換文字が表示される

**原因**：タイトルにファイルシステムでサポートされない文字（`< > : " / \ | ? *`）が含まれている

**解決方法**：これは想定された動作です。Plannotatorはファイルシステムエラーを避けるため、これらの文字を自動的に置換します。

## この章のまとめ

Obsidian連携機能により、プランレビューワークフローとナレッジ管理がシームレスに接続されます：

- ✅ 承認または却下したプランを自動保存
- ✅ タグをスマートに抽出し、後からの検索を容易に
- ✅ frontmatterを生成し、メタデータ形式を統一
- ✅ backlinkを追加し、ナレッジグラフを構築

一度設定すれば、毎回のレビューが自動的にアーカイブされ、手動でコピー＆ペーストする必要がなくなります。

## 次の章の予告

> 次の章では**[Bear連携](../bear-integration/)**を学びます。
>
> 学べる内容：
> - プランをBearノートアプリに保存する方法
> - Bear連携とObsidian連携の違い
> - x-callback-urlを使用してノートを自動作成

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能                | ファイルパス                                                                                     | 行番号    |
|--- | --- | ---|
| Obsidian vaultsの検出 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L135-L175) | 135-175 |
| Obsidianへプラン保存 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L227) | 180-227 |
| タグ抽出             | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74   |
| frontmatter生成     | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L81-L89) | 81-89   |
| ファイル名生成       | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L111-L127) | 111-127 |
| Obsidian設定ストレージ | [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L36-L43) | 36-43   |
| Settings UIコンポーネント | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L387-L491) | 387-491 |

**主要な関数**：
- `detectObsidianVaults()`：Obsidian設定ファイルを読み取り、利用可能なvaultパスリストを返す
- `saveToObsidian(config)`：プランを指定vaultに保存、frontmatterとbacklinkを含む
- `extractTags(markdown)`：プラン内容からタグを抽出（タイトルキーワード、コード言語、プロジェクト名）
- `generateFrontmatter(tags)`：YAML frontmatter文字列を生成
- `generateFilename(markdown)`：読みやすいファイル名を生成

**ビジネスルール**：
- タグ数は最大7個（L73）
- ファイル名は50文字制限（L102）
- クロスプラットフォーム設定ファイルパス検出をサポート（L141-149）
- 存在しないフォルダを自動作成（L208）

</details>
