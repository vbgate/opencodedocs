---
title: "コンテキスト圧縮：長いセッションの安定化 | Antigravity-Manager"
sidebarTitle: "長いセッションの安定化"
subtitle: "コンテキスト圧縮：長いセッションの安定化"
description: "Antigravity の 3 層コンテキスト圧縮メカニズムを学習します。ツールラウンドのトリミング、Thinking 圧縮、署名キャッシュによる 400 エラーと Prompt 長超過の失敗を削減します。"
tags:
  - "コンテキスト圧縮"
  - "署名キャッシュ"
  - "Thinking"
  - "Tool Result"
  - "安定性"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-monitoring"
order: 8
---

# 長いセッションの安定性：コンテキスト圧縮、署名キャッシュ、ツール結果圧縮

あなたが Claude Code / Cherry Studio などのクライアントで長いセッションを実行しているとき、最も煩わしいのはモデルが賢くないことではなく、会話の途中で突然エラーが発生することです：`Prompt is too long`、400 署名エラー、ツール呼び出しチェーンが途切れる、またはツールループが動作するたびに遅くなります。

このレッスンでは、Antigravity Tools がこれらの問題に対処するために行った 3 つのことを明確に説明します：コンテキスト圧縮（3 層で段階的に介入）、署名キャッシュ（Thinking の署名チェーンを維持）、ツール結果圧縮（ツール出力がコンテキストを満杯にするのを防ぐ）。

## このレッスンでできること

- 3 層の漸進的コンテキスト圧縮がそれぞれ何をしているか、それぞれの代償は何かを説明できる
- 署名キャッシュが何を保存しているか（Tool/Family/Session の 3 層）と 2 時間 TTL の影響を知る
- ツール結果圧縮のルールを理解する：いつ base64 画像が削除されるか、いつブラウザスナップショットがヘッド＋テールの要約になるか
- 必要に応じて `proxy.experimental` のしきい値スイッチで圧縮トリガーのタイミングを調整できる

## 現在の悩み

- 長い会話の後に突然 400 エラーが発生する：署名が無効になったように見えるが、署名がどこから来てどこで失われたかわからない
- ツール呼び出しが増え続け、履歴の tool_result がアップストリームで直接拒否される（または非常に遅くなる）
- 圧縮で救おうとするが、Prompt Cache を破壊したり、一貫性に影響したり、モデルが情報を失うことを懸念する

## いつこの方法を使うか

- 長いチェーンのツールタスク（検索/ファイル読み取り/ブラウザスナップショット/マルチラウンドツールループ）を実行している
- Thinking モデルを使用して複雑な推論を行っており、セッションが頻繁に数十回を超える
- クライアントで再現できるが、なぜ安定性の問題が発生するのか明確に説明できない問題をトラブルシューティングしている

## コンテキスト圧縮とは

**コンテキスト圧縮**は、エージェントがコンテキストの圧力が過度に高いことを検出したとき、履歴メッセージに対して行う自動的なノイズ除去とサイズ縮小です：まず古いツールラウンドをトリミングし、次に古い Thinking テキストをプレースホルダーに圧縮しますが署名を保持し、最後に極端なケースで XML 要約を生成して新しいセッションをフォークし、対話を続行します。これにより、`Prompt is too long` と署名チェーンの切断による失敗を削減します。

::: info コンテキスト圧力はどのように計算されますか？
Claude プロセッサは `ContextManager::estimate_token_usage()` を使用して軽量推定を行い、`estimation_calibrator` でキャリブレーションを行い、次に `usage_ratio = estimated_usage / context_limit` を使用して圧力パーセンテージを計算します（ログには raw/calibrated 値が出力されます）。
:::

## 🎒 始める前の準備

- ローカルプロキシが既に稼働しており、クライアントが実際に `/v1/messages` このルートを使用している（[ローカルリバースプロキシを起動して最初のクライアントを接続する](../../start/proxy-and-first-client/)を参照）
- プロキシログを表示できる（開発者デバッグまたはローカルログファイル）。リポジトリのテスト計画には、サンプルログパスと grep 方法の例があります（`docs/testing/context_compression_test_plan.md` を参照）

::: tip Proxy Monitor と組み合わせるとより正確に特定できる
圧縮トリガーとどのタイプのリクエスト/どのアカウント/どのラウンドのツール呼び出しが対応しているかを突き止めたい場合は、Proxy Monitor を同時に開くことをお勧めします。
:::

## コアコンセプト

この安定性設計は履歴をすべて直接削除するのではなく、代償が低い順から高くなる順に段階的に介入します：

| 層 | トリガー（設定可能） | 何をするか | 代償/副作用 |
|--- | --- | --- | ---|
| Layer 1 | `proxy.experimental.context_compression_threshold_l1`（デフォルト 0.4） | ツールラウンドを識別し、最近の N ラウンド（コードでは 5）のみを保持し、より古い tool_use/tool_result ペアを削除する | 残りのメッセージ内容を変更せず、Prompt Cache に優しい |
| Layer 2 | `proxy.experimental.context_compression_threshold_l2`（デフォルト 0.55） | 古い Thinking テキストを `"..."` に圧縮するが、`signature` を保持し、最近の 4 件のメッセージを保護する | 履歴内容を変更するため、コメントで明示的にキャッシュを破壊すると記載されているが、署名チェーンを保持できる |
| Layer 3 | `proxy.experimental.context_compression_threshold_l3`（デフォルト 0.7） | バックグラウンドモデルを呼び出して XML 要約を生成し、新しいメッセージシーケンスをフォークして対話を続ける | バックグラウンドモデル呼び出しに依存する。失敗した場合、400 を返す（わかりやすいプロンプト付き） |

次に、3 層を個別に説明し、署名キャッシュとツール結果圧縮を一緒に説明します。

### Layer 1：ツールラウンドトリミング（Trim Tool Messages）

Layer 1 の重要なポイントは、ツール対話の丸ごとラウンドのみを削除し、部分的な削除によるコンテキストの不整合を回避することです。

- ツール対話の 1 ラウンドの識別ルールは `identify_tool_rounds()` にある：`assistant` に `tool_use` が現れると 1 ラウンドが始まり、後続の `user` に `tool_result` が現れてもまだこのラウンドに属し、通常の user テキストが現れるまでこのラウンドが終了しない
- 実際にトリミングを実行するのは `ContextManager::trim_tool_messages(&mut messages, 5)`：履歴のツールラウンドが 5 ラウンドを超える場合、より古いラウンドに関連するメッセージを削除する

### Layer 2：Thinking 圧縮だが署名を保持

多くの 400 エラーは Thinking が長すぎるためではなく、Thinking の署名チェーンが切断されたためです。Layer 2 の戦略は次のとおりです：

- `assistant` メッセージ内の `ContentBlock::Thinking { thinking, signature, .. }` のみを処理する
- `signature.is_some()` かつ `thinking.len() > 10` の場合にのみ圧縮し、`thinking` を直接 `"..."` に変更する
- 最近の `protected_last_n = 4` 件のメッセージは圧縮しない（概ね最近 2 ラウンドの user/assistant）

これにより大量の Token を節約できますが、`signature` を履歴に残しておき、ツールチェーンが署名を埋め戻す必要があるときに復元できないことを回避します。

### Layer 3：Fork + XML 要約（最後の手段）

圧力が引き続き上昇すると、Claude プロセッサはセッションを再開しようとしますが、重要な情報を失わないようにします：

1. 元のメッセージから最後の有効な Thinking 署名を抽出する（`ContextManager::extract_last_valid_signature()`）
2. 履歴全体 + `CONTEXT_SUMMARY_PROMPT` を結合して XML 要約を生成するリクエストにし、モデルを `BACKGROUND_MODEL_LITE` に固定する（現在のコードでは `gemini-2.5-flash`）
3. 要約には `<latest_thinking_signature>` を含めることが要求され、後続の署名チェーンの継続に使用される
4. 新しいメッセージシーケンスをフォークする：
   - `User: Context has been compressed... + XML summary`
   - `Assistant: I have reviewed...`
   - 元のリクエストの最後の user メッセージを添付する（それが刚刚の要約指令でない場合）

Fork + 要約が失敗した場合、直接 `StatusCode::BAD_REQUEST` を返し、`/compact` や `/clear` などで手動で処理するよう指示します（プロセッサが返す error JSON を参照）。

### 旁路 1：3 層署名キャッシュ（Tool / Family / Session）

署名キャッシュはコンテキスト圧縮のヒューズであり、特にクライアントが署名フィールドをトリミング/破棄する場合に重要です。

- TTL：`SIGNATURE_TTL = 2 * 60 * 60`（2 時間）
- Layer 1：`tool_use_id -> signature`（ツールチェーンの復元）
- Layer 2：`signature -> model family`（クロスモデル互換性チェック、Claude 署名が Gemini ファミリモデルに持ち込まれるのを防ぐ）
- Layer 3：`session_id -> latest signature`（セッションレベルの分離、異なる会話の汚染を防ぐ）

この 3 層キャッシュは Claude SSE ストリーム解析とリクエスト変換時に書き込み/読み取りされます：

- ストリーム解析で thinking の `signature` を読み取ると Session Cache（およびキャッシュファミリ）に書き込まれる
- ストリーム解析で tool_use の `signature` を読み取ると Tool Cache + Session Cache に書き込まれる
- Claude ツール呼び出しを Gemini `functionCall` に変換するとき、Session Cache または Tool Cache から優先的に署名を埋め戻す

### 旁路 2：ツール結果圧縮（Tool Result Compressor）

ツール結果はチャットテキストよりもコンテキストを満杯にしやすいため、リクエスト変換段階で tool_result に対して予測可能な削減を行います。

コアルール（すべて `tool_result_compressor.rs` にある）：

- 総文字数上限：`MAX_TOOL_RESULT_CHARS = 200_000`
- base64 画像ブロックは直接削除する（プロンプトテキストを追加）
- 出力がファイルに保存されたことを示すプロンプトを検出した場合、重要情報を抽出し、`[tool_result omitted ...]` プレースホルダーを使用する
- ブラウザスナップショット（`page snapshot` / `ref=` などの特徴を含む）を検出した場合、ヘッド＋テール要約に変更し、省略された文字数を标注する
- 入力が HTML のような場合、最初に `<style>`/`<script>`/base64 フラグメントを削除してから切り詰める

## さあ、一緒にやってみよう

### ステップ 1：圧縮しきい値を確認する（およびデフォルト値）

**なぜ**
圧縮トリガーはハードコードされておらず、`proxy.experimental.*` から来ます。現在のしきい値を知っておく必要があります。そうしないと、なぜこれほど早く/遅く介入するのか判断できません。

デフォルト値（Rust 側の `ExperimentalConfig::default()`）：

```json
{
  "proxy": {
    "experimental": {
      "enable_signature_cache": true,
      "enable_tool_loop_recovery": true,
      "enable_cross_model_checks": true,
      "enable_usage_scaling": true,
      "context_compression_threshold_l1": 0.4,
      "context_compression_threshold_l2": 0.55,
      "context_compression_threshold_l3": 0.7
    }
  }
}
```

**期待される結果**：あなたの設定に `proxy.experimental` が存在し（フィールド名は上と一致）、しきい値は `0.x` のような比率値であること。

::: warning 設定ファイルの位置はこのレッスンでは繰り返し説明しません
設定ファイルの保存場所と変更後に再起動が必要かどうかは、設定管理の範疇です。このチュートリアルシステムでは、[設定完全解説：AppConfig/ProxyConfig、保存場所とホットリロードの仕組み](../config/)を優先します。
:::

### ステップ 2：ログで Layer 1/2/3 がトリガーされたかを確認する

**なぜ**
この 3 層はすべてプロキシ内部の動作であり、最も信頼性の高い検証方法はログに `[Layer-1]` / `[Layer-2]` / `[Layer-3]` が現れるかどうかを見ることです。

リポジトリのテスト計画にはサンプルコマンドがあります（必要に応じて自分のマシン上の実際のログパスに調整してください）：

```bash
tail -f ~/Library/Application\ Support/com.antigravity.tools/logs/antigravity.log | grep -E "Layer-[123]"
```

**期待される結果**：圧力が上昇すると、ログに `Tool trimming triggered`、`Thinking compression triggered`、`Fork successful` などの記録が現れる（具体的なフィールドはログの原文を参照）。

### ステップ 3：浄化と圧縮の違いを理解する（期待値を混同しない）

**なぜ**
一部の問題（Thinking をサポートしないモデルへの強制ダウングレードなど）は圧縮ではなく浄化が必要です。浄化は Thinking ブロックを直接削除します。圧縮は署名チェーンを保持します。

Claude プロセッサでは、バックグラウンドタスクのダウングレードは `ContextManager::purify_history(..., PurificationStrategy::Aggressive)` を通過し、履歴の Thinking ブロックを直接削除します。

**期待される結果**：あなたは 2 種類の動作を区別できます：

- 浄化は Thinking ブロックを削除する
- Layer 2 圧縮は古い Thinking テキストを `"..."` に置換するが、署名はまだある

### ステップ 4：400 署名エラーに遭遇したとき、まず Session Cache がヒットしたかを確認する

**なぜ**
多くの 400 エラーの根本原因は署名がないことではなく、署名がメッセージについてこないことです。リクエスト変換時に Session Cache から優先的に署名を補完します。

手がかり（リクエスト変換段階のログは SESSION/TOOL キャッシュから署名を復元したことを示します）：

- `[Claude-Request] Recovered signature from SESSION cache ...`
- `[Claude-Request] Recovered signature from TOOL cache ...`

**期待される結果**：クライアントが署名を失ったがプロキシキャッシュがまだある場合、ログに `Recovered signature from ... cache` の記録が現れる。

### ステップ 5：ツール結果圧縮が何を失うかを理解する

**なぜ**
ツールに大量の HTML / ブラウザスナップショット / base64 画像を会話に戻させると、プロキシは能動的に削減します。どの内容がプレースホルダーに置換されるかを事前に知っておく必要があります。そうしないと、モデルが見ていないと誤解する可能性があります。

3 つのルールを重点的に記憶してください：

1. base64 画像は削除される（プロンプトテキストに変更）
2. ブラウザスナップショットはヘッド/テール要約になる（省略された文字数付き）
3. 200,000 文字を超えると切り詰められ、`...[truncated ...]` プロンプトが追加される

**期待される結果**：`tool_result_compressor.rs` で、これらのルールには明確な定数と分岐があり、経験に基づいた削除ではない。

## チェックポイント ✅

- L1/L2/L3 のトリガーが `proxy.experimental.context_compression_threshold_*` から来ており、デフォルトは `0.4/0.55/0.7` であることを説明できる
- なぜ Layer 2 がキャッシュを破壊するかを説明できる：履歴 thinking テキスト内容を変更するため
- なぜ Layer 3 を Fork と呼ぶかを説明できる：会話を XML 要約＋確認＋最新 user メッセージの新しいシーケンスに変更するため
- ツール結果圧縮が base64 画像を削除し、ブラウザスナップショットをヘッド/テール要約に変更することを説明できる

## よくある落とし穴

| 現象 | 可能な原因 | 対策 |
|--- | --- | ---|
| Layer 2 がトリガーされた後にコンテキストがあまり安定していないと感じる | Layer 2 は履歴内容を変更し、コメントで明示的にキャッシュを破壊すると記載されている | Prompt Cache の一貫性に依存している場合、L1 が最初に問題を解決するようにするか、L2 しきい値を上げる |
| Layer 3 がトリガーされた後に直接 400 を返す | Fork + 要約のバックグラウンドモデル呼び出しが失敗した（ネットワーク/アカウント/アップストリームエラーなど） | 最初に error JSON の提案に従って `/compact` または `/clear` を使用する。同時にバックグラウンドモデル呼び出しチェーンを確認する |
| ツール出力内の画像/大量のコンテンツが消えた | tool_result は base64 画像を削除し、超長出力を切り詰める | 重要なコンテンツをローカルファイル/リンクに保存してから参照する。10 万行のテキストを直接会話に戻すことを期待しない |
| 明らかに Gemini モデルを使用しているのに Claude 署名が付いていてエラーになる | 署名はクロスモデルで互換性がない（コードには family チェックがある） | 署名のソースを確認する。必要に応じて、プロキシに retry シナリオで履歴署名を剥がさせる（リクエスト変換ロジックを参照） |

## このレッスンのまとめ

- 3 層圧縮のコアは代償で分類すること：まず古いツールラウンドを削除し、次に古い Thinking を圧縮し、最後に Fork + XML 要約を行う
- 署名キャッシュはツールチェーンを途切れないようにする鍵：Session/Tool/Family の 3 層がそれぞれ 1 つの問題を管理し、TTL は 2 時間
- ツール結果圧縮はツール出力がコンテキストを満杯にするのを防ぐハードリミット：200,000 文字上限＋スナップショット/大ファイルのプロンプト特化

## 次のレッスン予告

> 次のレッスンでは、システム機能について説明します：多言語/テーマ/更新/自動起動/HTTP API Server。

---

## 付録：ソースコード参考

<details>
<summary><strong>クリックしてソースコードの位置を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| 実験的設定：圧縮しきい値とスイッチのデフォルト値 | `src-tauri/src/proxy/config.rs` | 119-168 |
| コンテキスト推定：多言語文字推定＋15% 余量 | `src-tauri/src/proxy/mappers/context_manager.rs` | 9-37 |
| Token 使用量推定：system/messages/tools/thinking を遍歴 | `src-tauri/src/proxy/mappers/context_manager.rs` | 103-198 |
| Layer 1：ツールラウンド識別＋古いラウンドトリミング | `src-tauri/src/proxy/mappers/context_manager.rs` | 311-439 |
| Layer 2：Thinking 圧縮だが署名を保持（最近 N 件を保護） | `src-tauri/src/proxy/mappers/context_manager.rs` | 200-271 |
| Layer 3 補助：最後の有効な署名を抽出 | `src-tauri/src/proxy/mappers/context_manager.rs` | 73-109 |
| バックグラウンドタスクダウングレード：Aggressive で Thinking ブロックを浄化 | `src-tauri/src/proxy/handlers/claude.rs` | 540-583 |
| 3 層圧縮メインフロー：推定、キャリブレーション、しきい値で L1/L2/L3 をトリガー | `src-tauri/src/proxy/handlers/claude.rs` | 379-731 |
| Layer 3：XML 要約＋Fork セッション実装 | `src-tauri/src/proxy/handlers/claude.rs` | 1560-1687 |
| 署名キャッシュ：TTL/3 層キャッシュ構造（Tool/Family/Session） | `src-tauri/src/proxy/signature_cache.rs` | 5-88 |
| 署名キャッシュ：Session 署名書き込み/読み取り | `src-tauri/src/proxy/signature_cache.rs` | 141-223 |
| SSE ストリーム解析：thinking/tool の signature を Session/Tool キャッシュにキャッシュ | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 766-776 |
|--- | --- | ---|
| リクエスト変換：tool_use は Session/Tool キャッシュから優先的に署名を補完 | `src-tauri/src/proxy/mappers/claude/request.rs` | 1045-1142 |
| リクエスト変換：tool_result はツール結果圧縮をトリガー | `src-tauri/src/proxy/mappers/claude/request.rs` | 1159-1225 |
| ツール結果圧縮：入口 `compact_tool_result_text()` | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 28-69 |
| ツール結果圧縮：ブラウザスナップショット head/tail 要約 | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 123-178 |
| ツール結果圧縮：base64 画像削除＋総文字数上限 | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 247-320 |
| テスト計画：3 層圧縮トリガーとログ検証 | `docs/testing/context_compression_test_plan.md` | 1-116 |

</details>
