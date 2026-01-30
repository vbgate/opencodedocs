---
title: "最初のリクエスト: Antigravity インストールの検証 | opencode-antigravity-auth"
sidebarTitle: "最初のリクエストを送信"
description: "最初の Antigravity モデルリクエストを送信し、OAuth 認証と設定が正しいか検証する方法を学びます。モデル選択、variant パラメータの使用方法、よくあるエラーのトラブルシューティングを解説します。"
subtitle: "最初のリクエスト：インストール成功の検証"
tags:
  - "インストール検証"
  - "モデルリクエスト"
  - "クイックスタート"
prerequisite:
  - "start-quick-install"
order: 4
---

# 最初のリクエスト：インストール成功の検証

## このレッスンで学べること

- 最初の Antigravity モデルリクエストを送信する
- `--model` と `--variant` パラメータの役割を理解する
- ニーズに合わせて適切なモデルと思考設定を選択する
- よくあるモデルリクエストエラーをトラブルシューティングする

## 今あなたが直面している課題

プラグインをインストールし、OAuth 認証を完了し、モデル定義を設定しましたが、今こんな疑問があるはずです：
- プラグインは本当に正常に動作するのか？
- テストを始めるにはどのモデルを使えばいいのか？
- `--variant` パラメータはどう使うのか？
- リクエストが失敗したら、どのステップに問題があるかどう特定するのか？

## このテクニックを使うタイミング

以下のシナリオで本レッスンの検証方法を使用してください：
- **初回インストール後** — 認証、設定、モデルがすべて正常に動作することを確認
- **新しいアカウント追加後** — 新しいアカウントが使用可能か検証
- **モデル設定変更後** — 新しいモデル設定が正しいことを確認
- **問題発生前** — ベースラインを確立し、後で比較しやすくする

## 🎒 始める前の準備

::: warning 前提条件の確認

続ける前に、以下を確認してください：

- ✅ [クイックインストール](/ja/NoeFabris/opencode-antigravity-auth/start/quick-install/) を完了している
- ✅ `opencode auth login` を実行して OAuth 認証を完了している
- ✅ `~/.config/opencode/opencode.json` にモデル定義を追加している
- ✅ OpenCode ターミナルまたは CLI が使用可能

:::

## 基本的な考え方

### なぜ最初に検証が必要なのか

プラグインは複数のコンポーネントの連携を必要とします：
1. **OAuth 認証** — アクセストークンの取得
2. **アカウント管理** — 利用可能なアカウントの選択
3. **リクエスト変換** — OpenCode 形式から Antigravity 形式への変換
4. **ストリーミングレスポンス** — SSE レスポンスを処理し OpenCode 形式に変換

最初のリクエストを送信することで、パイプライン全体が正常に機能しているか検証できます。成功すれば、すべてのコンポーネントが正常に動作しています。失敗した場合は、エラーメッセージから問題を特定できます。

### Model と Variant の関係

Antigravity プラグインでは、**モデルと variant は2つの独立した概念**です：

| 概念 | 役割 | 例 |
| --- | --- | --- |
| **Model（モデル）** | 具体的な AI モデルを選択 | `antigravity-claude-sonnet-4-5-thinking` |
| **Variant（バリアント）** | モデルの思考バジェットやモードを設定 | `low`（軽量思考）、`max`（最大思考） |

::: info 思考バジェットとは？

思考バジェット（thinking budget）とは、モデルが回答を生成する前に「思考」に使用できるトークン数のことです。バジェットが高いほど、モデルは推論により多くの時間をかけられますが、レスポンス時間とコストも増加します。

- **Claude Thinking モデル**：`thinkingConfig.thinkingBudget` で設定（単位：トークン）
- **Gemini 3 モデル**：`thinkingLevel` で設定（文字列レベル：minimal/low/medium/high）

:::

### 推奨の入門組み合わせ

ニーズ別の推奨モデルと variant の組み合わせ：

| ニーズ | モデル | Variant | 特徴 |
| --- | --- | --- | --- |
| **クイックテスト** | `antigravity-gemini-3-flash` | `minimal` | 最速レスポンス、検証に最適 |
| **日常開発** | `antigravity-claude-sonnet-4-5-thinking` | `low` | 速度と品質のバランス |
| **複雑な推論** | `antigravity-claude-opus-4-5-thinking` | `max` | 最強の推論能力 |
| **ビジュアルタスク** | `antigravity-gemini-3-pro` | `high` | マルチモーダル対応（画像/PDF） |

## 一緒にやってみよう

### ステップ 1：最もシンプルなテストリクエストを送信

まず、最もシンプルなコマンドで基本的な接続が正常かテストします。

**なぜ**
このリクエストは thinking 機能を使用せず、非常に高速に返ってくるため、認証とアカウント状態の素早い検証に適しています。

**コマンドを実行**

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5
```

**期待される結果**

```
Hello! I'm Claude Sonnet 4.5, an AI assistant...
```

::: tip 成功の証

AI からの応答が表示されたら、以下が確認できます：
- ✅ OAuth 認証成功
- ✅ アカウントにアクセス権限あり
- ✅ リクエスト変換が正常に動作
- ✅ ストリーミングレスポンスが正しく解析

:::

### ステップ 2：Thinking モデルと Variant を使用

次に、variant パラメータを含む完全な思考フローをテストします。

**なぜ**
Thinking モデルは追加のリクエスト変換ロジックを必要とし、これはプラグインのコア機能の一つです。

**コマンドを実行**

```bash
opencode run "クロージャとは何か、簡単な比喩で説明して" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**期待される結果**

1. **ストリーミング思考出力**：モデルがまず思考プロセスを出力（`<thinking>` タグ付き）
2. **思考プロセス**：モデルが回答の構成方法を詳細に分析
3. **最終回答**：思考完了後に最終コンテンツを出力

::: details 完全なレスポンス例を見る

```
<thinking>
ユーザーはクロージャとは何かを聞いていて、簡単な比喩で説明する必要がある。

クロージャの概念：
1. 関数は外部スコープの変数にアクセスできる
2. 外部関数の実行が終了した後でも
3. この能力は「バックパック」のようなもの

比喩のアイデア：
- 「バックパック」の比喩が使える
- 関数が返されるとき、いくつかの変数を持っていく
- 家を出るときにバッグに家のものを入れるように
</thinking>

クロージャは関数の「バックパック」のようなものです。

関数が作成されるとき、アクセスできる外部変数を「パッキング」します。家を出る前に必要なものをバックパックに入れるようなものです。関数が作成された場所を離れても（外部関数の実行が終了しても）、この「バックパック」を通じてそれらの変数にアクセスできます。

例を見てみましょう：
```javascript
function createCounter() {
  let count = 0;  // この変数が「バックパック」に入る
  return function() {
    count++;  // バックパック内の変数にまだアクセスできる
    return count;
  };
}
```
```

:::

**チェックポイント ✅**

- [ ] `<thinking>` ブロックが表示された（`keep_thinking: true` を設定している場合）
- [ ] 回答内容が合理的で論理的
- [ ] レスポンス時間が許容範囲内（通常 2-10 秒）

### ステップ 3：Gemini 3 モデルをテスト

Gemini 3 Pro の異なる思考レベルをテストします。

**なぜ**
Gemini 3 は文字列レベルの `thinkingLevel` を使用し、異なるモデルファミリーへのサポートを検証します。

**コマンドを実行**

```bash
# Gemini 3 Flash をテスト（高速レスポンス）
opencode run "バブルソートを書いて" --model=google/antigravity-gemini-3-flash --variant=low

# Gemini 3 Pro をテスト（深い思考）
opencode run "バブルソートの時間計算量を分析して" --model=google/antigravity-gemini-3-pro --variant=high
```

**期待される結果**

- Flash モデルはより高速にレスポンス（シンプルなタスクに適している）
- Pro モデルはより深く思考（複雑な分析に適している）
- 両方のモデルが正常に動作

### ステップ 4：マルチモーダル機能をテスト（オプション）

モデル設定が画像入力をサポートしている場合、マルチモーダル機能をテストできます。

**なぜ**
Antigravity は画像/PDF 入力をサポートしており、多くのシナリオで必要な機能です。

**テスト画像を準備**：任意の画像ファイル（例：`test.png`）

**コマンドを実行**

```bash
opencode run "この画像の内容を説明して" --model=google/antigravity-gemini-3-pro --image=test.png
```

**期待される結果**

- モデルが画像の内容を正確に説明
- レスポンスにビジュアル分析結果が含まれる

## チェックポイント ✅

上記のテストを完了したら、以下のチェックリストを確認してください：

| チェック項目 | 期待される結果 | 状態 |
| --- | --- | --- |
| **基本接続** | ステップ 1 のシンプルなリクエストが成功 | ☐ |
| **Thinking モデル** | ステップ 2 で思考プロセスが表示 | ☐ |
| **Gemini 3 モデル** | ステップ 3 で両方のモデルが正常 | ☐ |
| **Variant パラメータ** | 異なる variant で異なる結果 | ☐ |
| **ストリーミング出力** | レスポンスがリアルタイムで表示、中断なし | ☐ |

::: tip すべて合格？

すべてのチェック項目が合格したら、おめでとうございます！プラグインは完全に設定され、本格的に使用を開始できます。

次のステップ：
- [利用可能なモデル一覧](/ja/NoeFabris/opencode-antigravity-auth/platforms/available-models/)
- [マルチアカウント負荷分散の設定](/ja/NoeFabris/opencode-antigravity-auth/advanced/multi-account-setup/)
- [Google Search の有効化](/ja/NoeFabris/opencode-antigravity-auth/platforms/google-search-grounding/)

:::

## よくある落とし穴

### エラー 1：`Model not found`

**エラーメッセージ**
```
Error: Model 'antigravity-claude-sonnet-4-5' not found
```

**原因**
モデル定義が `opencode.json` の `provider.google.models` に正しく追加されていません。

**解決方法**

設定ファイルを確認：

```bash
cat ~/.config/opencode/opencode.json | grep -A 10 "models"
```

モデル定義の形式が正しいことを確認：

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: warning スペルに注意

モデル名は設定ファイルの key と完全に一致する必要があります（大文字小文字を区別）：

- ❌ 間違い：`--model=google/claude-sonnet-4-5`
- ✅ 正しい：`--model=google/antigravity-claude-sonnet-4-5`

:::

### エラー 2：`403 Permission Denied`

**エラーメッセージ**
```
403 Permission denied on resource '//cloudaicompanion.googleapis.com/...'
```

**原因**
1. OAuth 認証が完了していない
2. アカウントにアクセス権限がない
3. Project ID の設定問題（Gemini CLI モデルの場合）

**解決方法**

1. **認証状態を確認**：
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   少なくとも1つのアカウントレコードが表示されるはずです。

2. **アカウントが空または認証失敗の場合**：
   ```bash
   rm ~/.config/opencode/antigravity-accounts.json
   opencode auth login
   ```

3. **Gemini CLI モデルでエラーが発生した場合**：
   Project ID を手動で設定する必要があります（詳細は [FAQ - 403 Permission Denied](/ja/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/) を参照）

### エラー 3：`Invalid variant 'max'`

**エラーメッセージ**
```
Error: Invalid variant 'max' for model 'antigravity-gemini-3-pro'
```

**原因**
モデルによってサポートされる variant 設定形式が異なります。

**解決方法**

モデル設定の variant 定義を確認：

| モデルタイプ | Variant 形式 | 例 |
| --- | --- | --- |
| **Claude Thinking** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 32768 } }` |
| **Gemini 3** | `thinkingLevel` | `{ "thinkingLevel": "high" }` |
| **Gemini 2.5** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 8192 } }` |

**正しい設定例**：

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  },
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro",
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

### エラー 4：リクエストタイムアウトまたは無応答

**症状**
コマンド実行後、長時間出力がない、または最終的にタイムアウト。

**考えられる原因**
1. ネットワーク接続の問題
2. サーバーのレスポンスが遅い
3. すべてのアカウントがレート制限状態

**解決方法**

1. **ネットワーク接続を確認**：
   ```bash
   ping cloudaicompanion.googleapis.com
   ```

2. **デバッグログを確認**：
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=1 opencode run "test" --model=google/antigravity-claude-sonnet-4-5
   ```

3. **アカウント状態を確認**：
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   すべてのアカウントに `rateLimit` タイムスタンプがある場合、すべてがレート制限されているため、リセットを待つ必要があります。

### エラー 5：SSE ストリーミング出力の中断

**症状**
レスポンスが途中で停止、または一部のコンテンツのみ表示。

**考えられる原因**
1. ネットワークが不安定
2. リクエスト中にアカウントトークンが期限切れ
3. サーバーエラー

**解決方法**

1. **デバッグログを有効にして詳細を確認**：
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "test"
   ```

2. **ログファイルを確認**：
   ```bash
   tail -f ~/.config/opencode/antigravity-logs/latest.log
   ```

3. **頻繁に中断する場合**：
   - より安定したネットワーク環境に切り替える
   - 非 Thinking モデルを使用してリクエスト時間を短縮
   - アカウントがクォータ制限に近づいていないか確認

## このレッスンのまとめ

最初のリクエストを送信することは、インストール成功を検証する重要なステップです。このレッスンで学んだこと：

- **基本リクエスト**：`opencode run --model` を使用してリクエストを送信
- **Variant の使用**：`--variant` で思考バジェットを設定
- **モデル選択**：ニーズに応じて Claude または Gemini モデルを選択
- **問題のトラブルシューティング**：エラーメッセージから問題を特定して解決

::: tip 推奨プラクティス

日常の開発では：

1. **まずシンプルなテストから**：設定変更のたびに、まずシンプルなリクエストで検証
2. **徐々に複雑さを増す**：thinking なし → low thinking → max thinking
3. **ベースラインレスポンスを記録**：正常時のレスポンス時間を覚えておき、比較に活用
4. **デバッグログを活用**：問題発生時は `OPENCODE_ANTIGRAVITY_DEBUG=2` を有効化

---

## 次のレッスン予告

> 次のレッスンでは **[利用可能なモデル一覧](/ja/NoeFabris/opencode-antigravity-auth/platforms/available-models/)** を学びます。
>
> 学べること：
> - すべての利用可能なモデルの完全なリストと特徴
> - Claude と Gemini モデルの選択ガイド
> - コンテキスト制限と出力制限の比較
> - Thinking モデルの最適な使用シナリオ

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| リクエスト変換エントリ | [`src/plugin/request.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts) | 1-100 |
| アカウント選択とトークン管理 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-50 |
| Claude モデル変換 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 全文 |
| Gemini モデル変換 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 全文 |
| ストリーミングレスポンス処理 | [`src/plugin/core/streaming/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/core/streaming/index.ts) | 全文 |
| デバッグログシステム | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 全文 |

**主要関数**：
- `prepareAntigravityRequest()`：OpenCode リクエストを Antigravity 形式に変換（`request.ts`）
- `createStreamingTransformer()`：ストリーミングレスポンストランスフォーマーを作成（`core/streaming/`）
- `resolveModelWithVariant()`：モデルと variant 設定を解決（`transform/model-resolver.ts`）
- `getCurrentOrNextForFamily()`：リクエスト用のアカウントを選択（`accounts.ts`）

**設定例**：
- モデル設定形式：[`README.md#models`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L110)
- Variant 詳細説明：[`docs/MODEL-VARIANTS.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MODEL-VARIANTS.md)

</details>
