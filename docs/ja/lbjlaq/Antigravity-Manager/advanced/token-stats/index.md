---
title: "Token 統計: コスト監視とデータ分析 | Antigravity Manager"
sidebarTitle: "一番高いのは誰か一目でわかる"
subtitle: "Token 統計: コスト監視とデータ分析"
description: "Token Stats 統計機能の使用方法を学びます。レスポンスから token データを抽出する方法、モデルとアカウント別に使用量を分析する方法、Top リストで最も高いモデルとアカウントを特定する方法、統計欠損問題をトラブルシューティングする方法を理解します。"
tags:
  - "Token Stats"
  - "コスト"
  - "監視"
  - "SQLite"
  - "使用量統計"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-model-router"
order: 7
---
# Token Stats：コスト視点の統計口径とグラフ解釈

クライアントを Antigravity Tools に接続しましたが、「誰がお金を使っているか、どこが高いか、あるモデルが急に跳ね上がったのか」は直感で判断するのが難しいことがよくあります。このレッスンでは 1 つのことだけをします：Token Stats ページのデータ口径を明確にし、グラフでコスト問題を素早く特定する方法を教えます。

## 学んだ後できること

- Token Stats のデータがどこから来るかを明確に説明できる（いつ記録されるか、どのような場合に欠損するか）
- 時間/日/週で観察ウィンドウを切り替え、「1 日だけ見る」で誤判断を回避する
- 「モデル別/アカウント別」2 種類のビューで、トレンドグラフで異常なピークを見つける
- Top リストで最も高いモデル/アカウントをロックし、リクエストログに戻って根本原因を追跡する

## 現在の悩み

- 呼び出しが高くなったと感じるが、モデルが変わったのか、アカウントが変わったのか、ある日突然量が増えたのかがわからない
- `X-Mapped-Model` を見たが、統計がどのモデル口径で計算されているかが不明
- Token Stats に時々 0 または「データなし」が表示され、トラフィックがないのか統計されていないのかがわからない

## この方法をいつ使うか

- コスト最適化を行う場合：まず「誰が高いか」を量化する
- 突然のレート制限/異常をトラブルシューティングする場合：ピーク時間点を使ってリクエストログと照合する
- モデルルーティング/クォータガバナンス設定変更後、コストが期待通り低下したかを検証する場合

## Token Stats とは？

**Token Stats**は Antigravity Tools のローカル使用量統計ページです：プロキシはリクエストを転送した後、レスポンス JSON またはストリーミングデータから `usage/usageMetadata` の token 数を抽出しようとし、各リクエストをアカウントとモデル別にローカル SQLite（`token_stats.db`）に書き込み、最後に UI で時間/モデル/アカウント別に集約して表示します。

::: info よく踏む点を先に説明
Token Stats の「モデル」口径はリクエスト内の `model` フィールド（または Gemini の `/v1beta/models/<model>` パス解析）から来るもので、ルーティング後の `X-Mapped-Model` と同じではありません。
:::

## 🎒 始める前の準備

- すでに 1 回プロキシ呼び出しを実行していること（`/healthz` ヘルスチェックだけに留まっていない）
- 上流レスポンスが解析可能な token 使用量フィールドを返すこと（そうでない場合、統計が欠損します）

::: tip 推奨読み合わせ
モデルマッピングを使って `model` を別の物理モデルにルーティングしている場合、先に **[モデルルーティング：カスタムマッピング、ワイルドカード優先順位とプリセット戦略](/ja/lbjlaq/Antigravity-Manager/advanced/model-router/)** を参照し、「統計口径」に戻るとより直感的になります。
:::

## コアコンセプト

Token Stats のデータチェーンは 3 つの部分に分割できます：

1. プロキシミドルウェアがレスポンスから token 使用量を抽出しようとする（`usage`/`usageMetadata` に互換、ストリーミングも解析）
2. 同時に `account_email + input_tokens + output_tokens` を取得した場合、ローカル SQLite（`token_stats.db`）に書き込む
3. UI が Tauri `invoke(get_token_stats_*)` を通じて集約データを取得し、時間/日/週で表示

## さあやってみよう

### ステップ 1：まず「トラフィックがある」ことを確認する

**理由**
Token Stats 統計は実際のリクエストから来ます。プロキシを起動しただけではモデルリクエストを 1 回も送っていない場合、ページに「データなし」が表示されます。

方法：**[ローカルリバースプロキシを起動して最初のクライアントを接続](/ja/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** ですでに検証成功した呼び出し方法を再利用し、1-2 回リクエストを送ってください。

**確認すべきもの**：Token Stats ページが「読み込み中/データなし」からグラフまたはリストに変わること。

### ステップ 2：適切な時間ウィンドウを選択する（時間/日/週）

**理由**
同じデータでも、異なるウィンドウで見る「ピーク/トレンド」は完全に異なります。UI で 3 種類のウィンドウに対応する取得範囲も異なります：

- 時間：直近 24 時間
- 日：直近 7 日
- 週：直近 4 週間（トレンドビューは直近 30 日で集約）

**確認すべきもの**：切り替え後、トレンドグラフの横軸粒度が変わる（時間は「時」まで表示、日は「月/日」まで表示、週は「年-W週号」まで表示）。

### ステップ 3：まずトップ総覧を見て、「コスト規模」を確定する

**理由**
総覧カードは最初に 3 つの質問に答えられます：総量が大きいかどうか、入力/出力の比率が異常か、参加するアカウント/モデルが突然増えたかどうか。

これらの項目に重点を置いてください：

- 総 Token（`total_tokens`）
- 入力/出力 Token（`total_input_tokens` / `total_output_tokens`）
- アクティブアカウント数（`unique_accounts`）
- 使用モデル数（UI は直接「モデル別統計リスト」の長さを使用）

**確認すべきもの**：「アクティブアカウント数」が突然跳ね上がると、通常、短時間でより多くのアカウントを実行していることを意味します（例：ローテーション戦略に切り替える）。

### ステップ 4：「モデル別/アカウント別使用トレンド」で異常なピークを捕捉する

**理由**
トレンドグラフは「突然高くなった」を捕捉するのに最も適した入り口です。原因を先に知る必要はなく、「どの日/どの時間が跳ね上がったか」を先に丸で囲みます。

方法：

1. トレンドグラフの右上隅で「モデル別 / アカウント別」を切り替える
2. マウスをホバー（Tooltip）して Top 値を見る、「突然 1 位になったもの」を優先的に注目する

**確認すべきもの**：

- モデル別：あるモデルが特定の時間帯で突然上昇
- アカウント別：あるアカウントが特定の時間帯で突然上昇

### ステップ 5：Top リストで「最も高いターゲット」をロックする

**理由**
トレンドグラフは「いつ異常か」を教えてくれ、Top リストは「誰が高いか」を教えてくれます。これらを交差させると、トラブルシューティング範囲を素早く特定できます。

方法：

- 「モデル別」ビューで、「モデル別詳細統計」テーブルの `total_tokens / request_count / 比率` を見る
- 「アカウント別」ビューで、「アカウント詳細統計」テーブルの `total_tokens / request_count` を見る

**確認すべきもの**：最も高いモデル/アカウントが先頭に並び、`request_count` が「1 回特に高い」か「回数が特に多い」かを区別できる。

### ステップ 6（オプション）：`token_stats.db` を見つけ、バックアップ/照合を行う

**理由**
「統計欠損」を疑う場合、またはオフライン分析を行いたい場合、SQLite ファイルを直接取得するのが最も信頼できます。

方法：Settings の Advanced 領域で「Open Data Directory」をクリックし、データディレクトリで `token_stats.db` を見つけます。

**確認すべきもの**：ファイルリストに `token_stats.db` があること（ファイル名はバックエンドで固定されています）。

## チェックポイント ✅

- Token Stats 統計が「レスポンス内の usage/usageMetadata から抽出してローカル SQLite に落とし込む」であることを明確に説明できる、クラウド課金ではない
- 「モデル別/アカウント別」2 種類のトレンドビューで、具体的なピーク時間帯を指摘できる
- Top リストで実行可能なトラブルシューティング結論を出せる：まずどのモデルまたはアカウントを確認するか

## よくある落とし穴

| 現象 | よくある原因 | 対処法 |
|--- | --- | ---|
| Token Stats に「データなし」が表示される | モデルリクエストを実際に生成していない；または上流レスポンスが解析可能な token フィールドを持っていない | まず検証済みの利用可能なクライアントでリクエストを送る；その後、レスポンスに `usage/usageMetadata` が含まれているかを確認 |
| 統計が「モデル」で見て間違っている | 統計口径はリクエスト内の `model` を使用し、`X-Mapped-Model` ではない | モデルルーティングを「リクエストモデル -> マッピングモデル」と見る；統計は「リクエストモデル」を見る |
| アカウント次元が欠損している | `X-Account-Email` を取得し、token 使用量を解析した場合のみ書き込まれる | リクエストが実際にアカウントプールに到達したことを確認；その後、リクエストログ/レスポンスヘッダーと照合 |
| Proxy Monitor を有効にすると統計データが大きくなる | Proxy Monitor が有効な場合、各リクエストの token が 2 回記録される | これは既知の実装詳細であり、相対トレンド分析には影響しない；正確な値が必要な場合、Monitor を一時的に無効にして再測定 |

## このレッスンのまとめ

- Token Stats のコア価値は「コスト問題を量化する」こと、まず特定し、次に最適化する
- 統計書き込み時、アカウントと token 使用量は必須；モデルが欠損している場合、`"unknown"` として記録される（書き込みを阻止しない）
- より精密なコスト制御を行いたい場合、次は通常モデルルーティングまたはクォータガバナンスに戻る

## 次のレッスンの予告

> 次のレッスンでは長いセッションの「隠れた安定性問題」を解決します：**[長いセッションの安定性：コンテキスト圧縮、署名キャッシュとツール結果圧縮](/ja/lbjlaq/Antigravity-Manager/advanced/context-compression/)**。

学べること：

- 3 層の漸進的コンテキスト圧縮がそれぞれ何をするか
- なぜ「署名キャッシュ」が 400 署名エラーを減らせるのか
- ツール結果圧縮は何を削除し、何を残すのか

---

## 付録：ソースコード参考

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
|--- | --- | ---|
| Token Stats UI：時間ウィンドウ/ビュー切り替えとデータ取得 | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L49-L166) | 49-166 |
| Token Stats UI：空データヒント（「データなし」） | [`src/pages/TokenStats.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/TokenStats.tsx#L458-L507) | 458-507 |
| Token 使用量抽出：リクエストから model 解析、レスポンスから usage/usageMetadata 解析 | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L32-L120) | 32-120 |
| Token 使用量抽出：ストリーミングと JSON レスポンス usage フィールド解析 | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L122-L336) | 122-336 |
| Token Stats 書き込み点：アカウント+token 取得後 SQLite に書き込み | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L79-L136) | 79-136 |
| データベースファイル名とテーブル構造：`token_stats.db` / `token_usage` / `token_stats_hourly` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L126) | 58-126 |
| 書き込みロジック：`record_usage(account_email, model, input, output)` | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L128-L159) | 128-159 |
| クエリロジック：時間/日/週、アカウント別/モデル別、トレンドと総覧 | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L161-L555) | 161-555 |
| Tauri コマンド：`get_token_stats_*` をフロントエンドに公開 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L791-L847) | 791-847 |
| アプリ起動時に Token Stats DB を初期化 | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L56) | 50-56 |
| 設定ページ：データディレクトリの取得/オープン（`token_stats.db` を見つけるため） | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L76-L143) | 76-143 |

</details>
