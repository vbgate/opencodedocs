---
title: "プランレビュー: AIプランをビジュアルでレビュー | Plannotator"
subtitle: "プランレビュー基礎：AIプランをビジュアルでレビュー"
description: "Plannotatorのプランレビュー機能を学びます。ビジュアルインターフェースでAI生成プランをレビューし、アノテーションの追加、承認または却下の方法、ApproveとRequest Changesの違いをマスターします。"
sidebarTitle: "5分でプランレビューをマスター"
tags:
  - "プランレビュー"
  - "ビジュアルレビュー"
  - "アノテーション"
  - "承認"
  - "却下"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 1
---

# プランレビュー基礎：AIプランをビジュアルでレビュー

## この章で学べること

- ✅ Plannotatorのビジュアルインターフェースを使ってAI生成プランをレビューする
- ✅ プランテキストを選択し、異なるタイプのアノテーション（削除、置換、コメント）を追加する
- ✅ プランを承認し、AIに実装を続行させる
- ✅ プランを却下し、アノテーションをフィードバックとしてAIに送信する
- ✅ アノテーションタイプの使用シナリオと違いを理解する

## 現在の課題

**課題1**：AI生成の実装プランをターミナルで読むと、テキスト量が多く構造が不明瞭で、レビューが大変。

**課題2**：AIにフィードバックを伝えたいとき、「3段落目を削除」「この関数を修正」などテキストで説明するしかなく、コミュニケーションコストが高い上、AIが誤解する可能性もある。

**課題3**：プランの中には修正不要な部分、置換が必要な部分、コメントが必要な部分があるが、これらのフィードバックを構造化するツールがない。

**課題4**：プランを承認したのか、修正が必要なのかをAIに伝える方法がわからない。

**Plannotatorでできること**：
- ビジュアルUIでターミナル閲覧を置き換え、構造を明確化
- テキストを選択するだけでアノテーション（削除、置換、コメント）を追加し、正確なフィードバックが可能
- アノテーションが自動的に構造化データに変換され、AIがあなたの意図を正確に理解
- ワンクリックで承認または却下、AIが即座に応答

## こんなときに使う

**適した使用シナリオ**：
- AI Agentがプランを完了し`ExitPlanMode`を呼び出した（Claude Code）
- AI Agentが`submit_plan`ツールを呼び出した（OpenCode）
- AI生成の実装プランをレビューする必要がある
- プランの修正意見を正確にフィードバックする必要がある

**適さないシナリオ**：
- AIに直接コードを実装させる（プランレビューをスキップ）
- すでにプランを承認済みで、実際のコード変更をレビューする必要がある（コードレビュー機能を使用）

## 🎒 始める前の準備

**前提条件**：
- ✅ Plannotator CLIをインストール済み（詳細は[クイックスタート](../../start/getting-started/)を参照）
- ✅ Claude CodeまたはOpenCodeプラグインを設定済み（対応するインストールガイドを参照）
- ✅ AI Agentがプランレビューをサポート（Claude Code 2.1.7+、またはOpenCode）

**トリガー方法**：
- **Claude Code**：AIがplanを完了後、自動的に`ExitPlanMode`を呼び出し、Plannotatorが自動起動
- **OpenCode**：AIが`submit_plan`ツールを呼び出し、Plannotatorが自動起動

## コアコンセプト

### プランレビューとは

**プランレビュー**はPlannotatorのコア機能で、AI生成の実装プランをビジュアルでレビューするために使用します。

::: info なぜプランレビューが必要？
AIがプランを生成した後、通常「このプランでよろしいですか？」や「実装を開始しますか？」と尋ねます。ビジュアルツールがなければ、ターミナルでプレーンテキストのプランを読み、「OK」「ダメ、XXを修正して」などの曖昧なフィードバックを返すしかありません。Plannotatorを使えば、ビジュアルインターフェースでプランを確認し、修正が必要な部分を正確に選択して構造化アノテーションを追加でき、AIがあなたの意図をより理解しやすくなります。
:::

### ワークフロー

```
┌─────────────────┐
│  AI Agent      │
│  (プラン生成)   │
└────────┬────────┘
         │
         │ ExitPlanMode / submit_plan
         ▼
┌─────────────────┐
│ Plannotator UI  │  ← ブラウザが自動で開く
│                 │
│ ┌───────────┐  │
│ │ プラン内容  │  │
│ │ (Markdown) │  │
│ └───────────┘  │
│       │         │
│       │ テキストを選択
│       ▼         │
│ ┌───────────┐  │
│ │ アノテーション │  │
│ │ 追加       │  │
│ │ Delete/    │  │
│ │ Replace/   │  │
│ │ Comment    │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ 決定      │  │
│ │ Approve/  │  │
│ │ Request   │  │
│ │ Changes   │  │
│ └───────────┘  │
└────────┬────────┘
         │
         │ {"behavior": "allow"} または
         │ {"behavior": "deny", "message": "..."}
         ▼
┌─────────────────┐
│  AI Agent      │
│  (実装を続行)   │
└─────────────────┘
```

### アノテーションタイプ

Plannotatorは4種類のアノテーションタイ��をサポートしており、それぞれ異なる用途があります：

| アノテーションタイプ | 用途 | AIが受け取るフィードバック |
|--- | --- | ---|
| **Delete** | 不要なコンテンツを削除 | "削除：[選択したテキスト]" |
| **Replace** | より良いコンテンツに置換 | "置換：[選択したテキスト] を [入力したテキスト] に" |
| **Comment** | 特定の部分にコメント、修正は不要 | "コメント：[選択したテキスト]。説明：[入力したコメント]" |
| **Global Comment** | グローバルコメント、特定のテキストに紐付けない | "グローバルコメント：[入力したコメント]" |

### Approve vs Request Changes

| 決定タイプ | 操作 | AIが受け取るフィードバック | 適用シナリオ |
|--- | --- | --- | ---|
| **Approve** | Approveボタンをクリック | `{"behavior": "allow"}` | プランに問題なし、そのまま承認 |
| **Request Changes** | Request Changesボタンをクリック | `{"behavior": "deny", "message": "..."}` | 修正が必要な箇所がある |

::: tip Claude CodeとOpenCodeの違い
- **Claude Code**：Approve時にアノテーションは送信されない（アノテーションは無視される）
- **OpenCode**：Approve時にアノテーションを備考として送信可能（オプション）

**プランを却下する場合**：どちらのプラットフォームでも、アノテーションはAIに送信されます
:::

## ステップバイステップ

### ステップ1：プランレビューをトリガー

**Claude Codeの例**：

Claude CodeでAIと会話し、実装プランを生成させます：

```
ユーザー：ユーザー認証モジュールの実装プランを作成してください

Claude：はい、実装プランです：
1. ユーザーモデルを作成
2. 登録APIを実装
3. ログインAPIを実装
...
（AIがExitPlanModeを呼び出し）
```

**OpenCodeの例**：

OpenCodeでは、AIが自動的に`submit_plan`ツールを呼び出します。

**期待される結果**：
1. ブラウザが自動的にPlannotator UIを開く
2. AI生成のプラン内容が表示される（Markdown形式）
3. ページ下部に「Approve」と「Request Changes」ボタンがある

### ステップ2：プラン内容を確認

ブラウザでプランを確認します：

- プランはMarkdown形式でレンダリングされ、見出し、段落、リスト、コードブロックを含む
- スクロールしてプラン全体を確認可能
- ライト/ダークモードの切り替えをサポート（右上のテーマ切り替えボタンをクリック）

### ステップ3：プランテキストを選択してアノテーションを追加

**Deleteアノテーションを追加**：

1. マウスでプラン内の削除したいテキストを選択
2. ポップアップツールバーで**Delete**ボタンをクリック
3. テキストが削除スタイル（赤い取り消し線）でマークされる

**Replaceアノテーションを追加**：

1. マウスでプラン内の置換したいテキストを選択
2. ポップアップツールバーで**Replace**ボタンをクリック
3. ポップアップ入力欄に置換後のコンテンツを入力
4. Enterキーを押すか確認をクリック
5. 元のテキストが置換スタイル（黄色の背景）でマークされ、下に置換内容が表示される

**Commentアノテーションを追加**：

1. マウスでプラン内のコメントしたいテキストを選択
2. ポップアップツールバーで**Comment**ボタンをクリック
3. ポップアップ入力欄にコメント内容を入力
4. Enterキーを押すか確認をクリック
5. テキストがコメントスタイル（青いハイライト）でマークされ、サイドバーにコメントが表示される

**Global Commentを追加**：

1. ページ右上の**Add Global Comment**ボタンをクリック
2. ポップアップ入力欄にグローバルコメント内容を入力
3. Enterキーを押すか確認をクリック
4. コメントがサイドバーの「Global Comments」セクションに表示される

**期待される結果**：
- テキストを選択すると、すぐにツールバー（Delete、Replace、Comment）がポップアップ
- アノテーション追加後、テキストに対応するスタイル（取り消し線、背景色、ハイライト）が表示される
- サイドバーにすべてのアノテーションリストが表示され、クリックで対応する位置にジャンプ可能
- アノテーション横の**削除**ボタンをクリックしてアノテーションを削除可能

### ステップ4：プランを承認

**プランに問題がない場合**：

ページ下部の**Approve**ボタンをクリックします。

**期待される結果**：
- ブラウザが自動的に閉じる（1.5秒の遅延）
- Claude Code/OpenCodeのターミナルにプランが承認されたことが表示される
- AIが実装を続行

::: info Approveの動作
- **Claude Code**：`{"behavior": "allow"}`のみ送信、アノテーションは無視される
- **OpenCode**：`{"behavior": "allow"}`を送信、アノテーションは備考として送信可能（オプション）
:::

### ステップ5：プランを却下（Request Changes）

**プランに修正が必要な場合**：

1. 必要なアノテーション（Delete、Replace、Comment）を追加
2. ページ下部の**Request Changes**ボタンをクリック
3. ブラウザに確認ダイアログが表示される

**期待される結果**：
- 確認ダイアログに「Send X annotations to AI?」と表示される
- 確認をクリック後、ブラウザが自動的に閉じる
- Claude Code/OpenCodeのターミナルにフィードバック内容が表示される
- AIがフィードバックに基づいてプランを修正

::: tip Request Changesの動作
- **Claude Code**と**OpenCode**：どちらも`{"behavior": "deny", "message": "..."}`を送信
- アノテーションは構造化されたMarkdownテキストに変換される
- AIがアノテーションに基づいてプランを修正し、再度ExitPlanMode/submit_planを呼び出す
:::

### ステップ6：フィードバック内容を確認（オプション）

PlannotatorがAIに送信したフィードバック内容を確認したい場合は、ターミナルで確認できます：

**Claude Code**：
```
Plan rejected by user
Please modify the plan based on the following feedback:

[構造化されたアノテーション内容]
```

**OpenCode**：
```
<feedback>
[構造化されたアノテーション内容]
</feedback>
```

## チェックポイント ✅

上記のステップを完了すると��以下ができるようになります：

- [ ] AIがプランレビューをトリガー後、ブラウザが自動的にPlannotator UIを開く
- [ ] プランテキストを選択し、Delete、Replace、Commentアノテーションを追加
- [ ] Global Commentを追加
- [ ] サイドバーですべてのアノテーションを確認し、対応する位置にジャンプ
- [ ] Approveをクリック、ブラウザが閉じ、AIが実装を続行
- [ ] Request Changesをクリック、ブラウザが閉じ、AIがプランを修正

**いずれかのステップで失敗した場合**は、以下を参照：
- [よくある質問](../../faq/common-problems/)
- [Claude Codeインストールガイド](../../start/installation-claude-code/)
- [OpenCodeインストールガイド](../../start/installation-opencode/)

## よくあるトラブル

**よくあるエラー1**：テキストを選択してもツールバーがポップアップしない

**原因**：コードブロック内のテキストを選択した、または複数の要素にまたがるテキストを選択した可能性があります。

**解決方法**：
- 単一の段落またはリスト項目内のテキストを選択するようにする
- コードブロックの場合は、Commentアノテーションを使用し、複数行にまたがる選択を避ける

**よくあるエラー2**：Replaceアノテーションを追加後、置換内容が表示されない

**原因**：置換内容の入力欄が正しく送信されていない可能性があります。

**解決方法**：
- 置換内容を入力後、Enterキーを押すか確認ボタンをクリック
- サイドバーに置換内容が表示されているか確認

**よくあるエラー3**：ApproveまたはRequest Changesをクリック後、ブラウザが閉じない

**原因**：サーバーエラーまたはネットワークの問題の可能性があります。

**解決方法**：
- ターミナルにエラーメッセージがないか確認
- 手動でブラウザを閉じる
- 問題が続く場合は、[トラブルシューティング](../../faq/troubleshooting/)を参照

**よくあるエラー4**：AIがフィードバックを受け取った後、アノテーション通りに修正しない

**原因**：AIがアノテーションの意図を正しく理解していない可能性があります。

**解決方法**：
- より明確なアノテーションを使用する（ReplaceはCommentより明確）
- Comment���使用して詳細な説明を追加
- 問題が続く場合は、再度プランを却下し、アノテーション内容を調整

**よくあるエラー5**：複数のDeleteアノテーションを追加後、AIが一部のコンテンツしか削除しない

**原因**：複数のDeleteアノテーション間に重複や競合がある可能性があります。

**解決方法**：
- 各Deleteアノテーションのテキスト範囲が重複しないようにする
- 大きなセクションを削除する必要がある場合は、段落全体を一度に選択して削除

## この章のまとめ

プランレビューはPlannotatorのコア機能で、AI生成のプランをビジュアルでレビューできます：

**コア操作**：
1. **トリガー**：AIが`ExitPlanMode`または`submit_plan`を呼び出し、ブラウザが自動的にUIを開く
2. **確認**：ビジュアルインターフェースでプラン内容を確認（Markdown形式）
3. **アノテーション**：テキストを選択し、Delete、Replace、CommentまたはGlobal Commentを追加
4. **決定**：Approve（承認）またはRequest Changes（却下）をクリック
5. **フィードバック**：アノテーションが構造化データに変換され、AIがフィードバックに基づいて続行または修正

**アノテーションタイプ**：
- **Delete**：不要なコンテンツを削除
- **Replace**：より良いコンテンツに置換
- **Comment**：特定の部分にコメント、修正は不要
- **Global Comment**：グローバルコメント、特定のテキストに紐付けない

**決定タイプ**：
- **Approve**：プランに問題なし、そのまま承認（Claude Codeはアノテーションを無視）
- **Request Changes**：修正が必要な箇所があり、アノテーションをAIに送信

## 次の章の予告

> 次の章では**[プランアノテーションの追加](../plan-review-annotations/)**を学びます。
>
> 学べる内容：
> - Delete、Replace、Commentアノテーションの正確な使い方
> - 画像アノテーションの追加方法
> - アノテーションの編集と削除方法
> - アノテーションのベストプラクティスとよくあるシナリオ

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能              | ファイルパス                                                                                              | 行番号    |
|--- | --- | ---|
| プランレビューUI       | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200)          | 1-200   |
| アノテーションタイプ定義      | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L70)                | 1-70    |
| プランレビューサーバー     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L310)            | 91-310  |
| API: プラン内容取得  | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134)         | 132-134 |
| API: プラン承認     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L201-L277)         | 201-277 |
| API: プラン却下     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L280-L309)         | 280-309 |
| Viewerコンポーネント       | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L1-L100)   | 1-100   |
| AnnotationPanelコンポーネント | [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L1-L50) | 1-50    |

**主要な型**：
- `AnnotationType`：アノテーションタイプ列挙（DELETION、INSERTION、REPLACEMENT、COMMENT、GLOBAL_COMMENT）（`packages/ui/types.ts:1-7`）
- `Annotation`：アノテーションインターフェース（`packages/ui/types.ts:11-33`）
- `Block`：プランブロックインターフェース（`packages/ui/types.ts:35-44`）

**主要な関数**：
- `startPlannotatorServer()`：プランレビューサーバーを起動（`packages/server/index.ts:91`）
- `parseMarkdownToBlocks()`：MarkdownをBlocksにパース（`packages/ui/utils/parser.ts`）

**APIルート**：
- `GET /api/plan`：プラン内容を取得（`packages/server/index.ts:132`）
- `POST /api/approve`：プランを承認（`packages/server/index.ts:201`）
- `POST /api/deny`：プランを却下（`packages/server/index.ts:280`）

**ビジネスルール**：
- Claude Code承認時はアノテーションを送信しない（`apps/hook/server/index.ts:132`）
- OpenCode承認時はアノテーションを備考として送信可能（`apps/opencode-plugin/index.ts:270`）
- プラン却下時はアノテーションを常に送信（`apps/hook/server/index.ts:154`）

</details>
