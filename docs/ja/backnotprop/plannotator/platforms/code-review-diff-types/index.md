---
title: "Diffビュー: 複数の視点で変更をレビュー | Plannotator"
sidebarTitle: "5種類のDiffビュー切り替え"
subtitle: "Diffビュー: 複数の視点で変更をレビュー"
description: "Plannotatorのコードレビューでdiffタイプを切り替える方法を学びます。ドロップダウンメニューからuncommitted、staged、last commit、branchビューを選択し、複数の視点からコード変更をレビューできます。"
tags:
  - "コードレビュー"
  - "Git"
  - "Diff"
  - "チュートリアル"
prerequisite:
  - "code-review-basics"
order: 6
---

# Diffビューの切り替え

## この章で学べること

コードレビュー時に、以下のことができるようになります：
- ドロップダウンメニューで5種類のdiffビューを素早く切り替える
- 各ビューが表示するコード変更の範囲を理解する
- レビューの目的に応じて適切なdiffタイプを選択する
- 間違ったビューを選択して重要な変更を見落とすことを防ぐ

## 現在の課題

**レビュー時にワーキングディレクトリだけを見て、ステージ済みファイルを見落とす**：

`/plannotator-review`コマンドを実行し、いくつかのコード変更を確認してアノテーションを追加しました。しかしコミット後、すでに`git add`でステージングエリアに追加されていたファイルがレビューから漏れていたことに気づきました——これらのファイルはdiffに表示されていなかったのです。

**現在のブランチとmainブランチの全体的な差分を確認したい**：

featureブランチで数週間開発を続けてきて、全体でどのような変更があったか確認したいのですが、デフォルトの「未コミット変更」ビューでは最近数日の修正しか表示されません。

**特定の2つのコミット間の差分を比較したい**：

あるバグ修正が正しく行われたか確認するため、修正前後のコードを比較したいのですが、Plannotatorで過去のコミットのdiffを表示する方法がわかりません。

## こんなときに使う

- **包括的なレビュー時**：ワーキングディレクトリとステージングエリアの変更を同時に確認
- **ブランチマージ前**：現在のブランチのmain/masterに対するすべての変更を確認
- **ロールバック確認時**：最後のコミットでどのファイルが変更されたか確認
- **チーム協業時**：同僚がステージしたがまだコミットしていないコードを確認

## コアコンセプト

Git diffコマンドには多くのバリエーションがあり、それぞれ異なるコード範囲を表示します。Plannotatorはこれらのバリエーションを1つのドロップダウンメニューにまとめ、複雑なgitコマンドを覚える必要をなくしました。

::: info Git Diffタイプ早見表

| diffタイプ | 表示範囲 | 典型的な使用シナリオ |
|--- | --- | ---|
| Uncommitted changes | ワーキングディレクトリ + ステージングエリア | 今回の開発のすべての修正をレビュー |
| Staged changes | ステージングエリアのみ | コミット前にステージ済み内容を確認 |
| Unstaged changes | ワーキングディレクトリのみ | まだ`git add`していない修正を確認 |
| Last commit | 直近のコミット | ロールバックや直前のコミットの確認 |
| vs main | 現在のブランチ vs デフォルトブランチ | ブランチマージ前の包括的チェック |

:::

ドロップダウンメニューのオプションはGitの状態に応じて動的に変化します：
- 現在デフォルトブランチにいない場合、「vs main」オプションが表示される
- ステージ済みファイルがない場合、Stagedビューは「No staged changes」と表示

## ステップバイステップ

### ステップ1：コードレビューを起動

**なぜ**

まずPlannotatorのコードレビューインターフェースを開く必要があります。

**操作**

ターミナルで実行：

```bash
/plannotator-review
```

**期待される結果**

ブラウザでコードレビューページが開き、左側のファイルツリーの上部に現在のdiffタイプを表示するドロップダウンメニュー（通常は「Uncommitted changes」）があります。

### ステップ2：Stagedビューに切り替え

**なぜ**

すでに`git add`したがまだコミットしていないファイルを確認します。

**操作**

1. 左側のファイルツリー上部のドロップダウンメニューをクリック
2. 「Staged changes」を選択

**期待される結果**

- ステージ済みファイルがある場合、ファイルツリーにそれらのファイルが表示される
- ステージ済みファイルがない場合、メインエリアに「No staged changes. Stage some files with git add.」と表示される

### ステップ3：Last Commitビューに切り替え

**なぜ**

直前にコミットしたコードをレビューし、問題がないか確認します。

**操作**

1. 再度ドロップダウンメニューを開く
2. 「Last commit」を選択

**期待される結果**

- 直近のコミットで変更されたすべてのファイルが表示される
- diff内容は`HEAD~1..HEAD`の差分

### ステップ4：vs mainビューに切り替え（利用可能な場合）

**なぜ**

現在のブランチのデフォルトブランチに対するすべての変更を確認します。

**操作**

1. ドロップダウンメニューに「vs main」または「vs master」オプションがあるか確認
2. ある場合、それを選択

**期待される結果**

- ファイルツリーに現在のブランチとデフォルトブランチ間のすべての差分ファイルが表示される
- diff内容は`main..HEAD`の完全な変更

::: tip 現在のブランチを確認

「vs main」オプションが表示されない場合、デフォルトブランチにいることを意味します。以下のコマンドで現在のブランチを確認できます：

```bash
git rev-parse --abbrev-ref HEAD
```

featureブランチに切り替えてから再試行：

```bash
git checkout feature-branch
```

:::

## チェックポイント ✅

以下を習得できたか確認してください：

- [ ] diffタイプのドロップダウンメニューを見つけて開くことができる
- [ ] 「Uncommitted」「Staged」「Last commit」の違いを理解している
- [ ] 「vs main」オプションがいつ表示されるか識別できる
- [ ] どのシナリオでどのdiffタイプを使うべきか理解している

## よくあるトラブル

### トラブル1：レビュー時にUncommittedだけを見て、Stagedファイルを見落とす

**症状**

コミット後、レビューでいくつかのステージ済みファイルが漏れていたことに気づく。

**原因**

Uncommittedビューはワーキングディレクトリとステージングエリアのすべての変更（`git diff HEAD`）を表示し、ステージ済みファイルも含まれます。

**解決方法**

レビュー前にまずStagedビューに切り替えて確認するか、Uncommittedビュー（ステージングエリアを含む）を使用します。

### トラブル2：ブランチマージ前にmainと比較しない

**症状**

mainにマージ後、関係のない変更が含まれていたことに気づく。

**原因**

最近数日のコミットだけを見て、ブランチ全体のmainに対する差分を比較していなかった。

**解決方法**

マージ前に「vs main」ビューで包括的にチェックします。

### トラブル3：ビュー切り替えでアノテーションが消えると思い込む

**症状**

diffタイプを切り替えることを躊躇し、以前追加したアノテーションが消えることを心配する。

**原因**

切り替えメカニズムの誤解。

**実際の動作**

diffタイプを切り替えても、Plannotatorは以前のアノテーションを保持します——それらは引き続き適用される可能性があり、関係のないアノテーションは手動で削除できます。

## この章のまとめ

Plannotatorがサポートする5種類のdiffタイプ：

| タイプ | Gitコマンド | シナリオ |
|--- | --- | ---|
| Uncommitted | `git diff HEAD` | 今回の開発のすべての修正をレビュー |
| Staged | `git diff --staged` | コミット前にステージングエリアを確認 |
| Unstaged | `git diff` | ワーキングディレクトリの修正を確認 |
| Last commit | `git diff HEAD~1..HEAD` | ロールバックや直近のコミットを確認 |
| vs main | `git diff main..HEAD` | ブランチマージ前の包括的チェック |

ビューを切り替えてもアノテーションは失われません。異なる視点から同じアノテーションや新しいアノテーションを確認できます。

## 次の章の予告

> 次の章では**[URL共有](../../advanced/url-sharing/)**を学びます。
>
> 学べる内容：
> - レビュー内容をURLに圧縮して同僚と共有する方法
> - 受信者が共有されたレビューリンクを開く方法
> - 共有モードでの制限と注意事項

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Diffタイプ定義 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15) | 10-15 |
| Gitコンテキスト取得 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79-L96) | 79-96 |
| Git Diff実行 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101-L147) | 101-147 |
| Diff切り替え処理 | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L300-L331) | 300-331 |
| ファイルツリーのDiffオプション描画 | [`packages/review-editor/components/FileTree.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/FileTree.tsx) | - |

**主要な型**：

- `DiffType`: `'uncommitted' | 'staged' | 'unstaged' | 'last-commit' | 'branch'`

**主要な関数**：

- `getGitContext()`: 現在のブランチ、デフォルトブランチ、利用可能なdiffオプションを取得
- `runGitDiff(diffType, defaultBranch)`: diffタイプに応じて対応するgitコマンドを実行

**主要なAPI**：

- `POST /api/diff/switch`: diffタイプを切り替え、新しいdiffデータを返す

</details>
