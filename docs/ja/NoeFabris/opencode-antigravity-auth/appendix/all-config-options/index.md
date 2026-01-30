---
title: "完全設定ガイド: 30+ パラメータ詳細 | Antigravity Auth"
sidebarTitle: "30+ パラメータのカスタマイズ"
subtitle: "Antigravity Auth 設定オプション完全リファレンス"
description: "Antigravity Auth プラグインの 30+ 設定オプションを学びます。汎用設定、セッション復元、アカウント選択戦略、レート制限、トークン更新などの設定項目のデフォルト値とベストプラクティスを解説します。"
tags:
  - "設定リファレンス"
  - "高度な設定"
  - "完全ガイド"
  - "Antigravity"
  - "OpenCode"
prerequisite:
  - "quick-install"
order: 1
---

# Antigravity Auth 設定オプション完全リファレンス

## 学習後にできること

- Antigravity Auth プラグインのすべての設定オプションを見つけて変更する
- 各設定項目の用途と適用シナリオを理解する
- 使用シーンに応じて最適な設定の組み合わせを選択する
- 環境変数を使用して設定ファイルの設定を上書きする

## コアコンセプト

Antigravity Auth プラグインは設定ファイルでほぼすべての動作を制御します：ログレベルからアカウント選択戦略、セッション復元からトークン更新メカニズムまで。

::: info 設定ファイルの場所（優先度順）
1. **プロジェクト設定**：`.opencode/antigravity.json`
2. **ユーザー設定**：
   - Linux/Mac: `~/.config/opencode/antigravity.json`
   - Windows: `%APPDATA%\opencode\antigravity.json`
:::

::: tip 環境変数の優先度
すべての設定項目は環境変数で上書き可能で、環境変数の優先度は設定ファイルより**高い**です。
:::

## 設定概要

| 分類 | 設定項目数 | コアシナリオ |
|---|---|---|
| 汎用設定 | 3 | ログ、デバッグモード |
| 思考ブロック | 1 | 思考プロセスの保持 |
| セッション復元 | 3 | エラー自動復元 |
| 署名キャッシュ | 4 | 思考ブロック署名の永続化 |
| 空応答リトライ | 2 | 空応答の処理 |
| ツールID復元 | 1 | ツールのマッチング |
| ツールハルシネーション防止 | 1 | パラメータエラーの防止 |
| トークン更新 | 3 | プロアクティブ更新メカニズム |
| レート制限 | 5 | アカウントローテーションと待機 |
| ヘルススコア | 7 | Hybrid戦略のスコアリング |
| トークンバケット | 3 | Hybrid戦略のトークン |
| 自動更新 | 1 | プラグインの自動更新 |
| ウェブ検索 | 2 | Gemini検索 |

---

## 汎用設定

### `quiet_mode`

**型**：`boolean`  
**デフォルト値**：`false`  
**環境変数**：`OPENCODE_ANTIGRAVITY_QUIET=1`

ほとんどの toast 通知（レート制限、アカウント切り替えなど）を抑制します。復元通知（セッション復元成功）は常に表示されます。

**適用シナリオ**：
- マルチアカウント高頻度使用シナリオでの通知干渉の回避
- 自動化スクリプトやバックグラウンドサービスでの使用

**例**：
```json
{
  "quiet_mode": true
}
```

### `debug`

**型**：`boolean`  
**デフォルト値**：`false`  
**環境変数**：`OPENCODE_ANTIGRAVITY_DEBUG=1`

ファイルへのデバッグログを有効にします。ログファイルはデフォルトで `~/.config/opencode/antigravity-logs/` に保存されます。

**適用シナリオ**：
- 問題のトラブルシューティング時に有効化
- バグ報告時に詳細なログを提供

::: danger デバッグログは機密情報を含む可能性があります
ログファイルにはAPI応答、アカウントインデックスなどの情報が含まれます。提出前に機密情報を削除してください。
:::

### `log_dir`

**型**：`string`  
**デフォルト値**：OS固有の設定ディレクトリ + `/antigravity-logs`  
**環境変数**：`OPENCODE_ANTIGRAVITY_LOG_DIR=/path/to/logs`

デバッグログの保存ディレクトリをカスタマイズします。

**適用シナリオ**：
- ログを特定の場所に保存する必要がある場合（ネットワーク共有ディレクトリなど）
- ログローテーションとアーカイブスクリプト

---

## 思考ブロック設定

### `keep_thinking`

**型**：`boolean`  
**デフォルト値**：`false`  
**環境変数**：`OPENCODE_ANTIGRAVITY_KEEP_THINKING=1`

::: warning 実験的機能
Claude モデルの思考ブロックを保持します（署名キャッシュ経由）。

**動作説明**：
- `false`（デフォルト）：思考ブロックを除去し、署名エラーを回避、信頼性を優先
- `true`：完全なコンテキスト（思考ブロックを含む）を保持するが、署名エラーが発生する可能性あり

**適用シナリオ**：
- モデルの完全な推論プロセスを表示する必要がある場合
- 思考コンテンツを頻繁に使用する対話

**非推奨シナリオ**：
- 本番環境（信頼性を優先）
- マルチターン対話（署名競合が発生しやすい）

::: tip `signature_cache` との併用を推奨
`keep_thinking` を有効化する場合、`signature_cache` の設定も行うことで署名のヒット率を向上させることができます。
:::

---

## セッション復元

### `session_recovery`

**型**：`boolean`  
**デフォルト値**：`true`

`tool_result_missing` エラーからセッションを自動復元します。有効化すると、回復可能なエラーが発生した際に toast 通知が表示されます。

**復元されるエラータイプ**：
- `tool_result_missing`：ツール結果の欠如（ESC 中断、タイムアウト、クラッシュ）
- `Expected thinking but found text`：思考ブロックの順序エラー

**適用シナリオ**：
- ツールを使用するすべてのシナリオ（デフォルトで推奨有効化）
- 長時間の対話または頻繁なツール実行

### `auto_resume`

**型**：`boolean`  
**デフォルト値**：`false`

"continue" プロンプトを自動送信してセッションを復元します。`session_recovery` が有効な場合のみ機能します。

**動作説明**：
- `false`：toast 通知のみ表示され、ユーザーは "continue" を手動で送信する必要があります
- `true`：自動的に "continue" を送信してセッションを継続します

**適用シナリオ**：
- 自動化スクリプトや無人運用シナリオ
- 完全自動化された復元フローを希望する場合

**非推奨シナリオ**：
- 復元結果の手動確認が必要な場合
- ツール実行の中断後、状態を確認してから再開する必要がある場合

### `resume_text`

**型**：`string`  
**デフォルト値**：`"continue"`

自動復元時に送信するカスタムテキスト。`auto_resume` が有効な場合のみ使用されます。

**適用シナリオ**：
- マルチリンガル環境（例："継続"、"続けてください" への変更）
- 追加のプロンプトが必要なシナリオ

**例**：
```json
{
  "auto_resume": true,
  "resume_text": "请继续完成之前的任务"
}
```

---

## 署名キャッシュ

> `keep_thinking` が有効な場合のみ機能します

### `signature_cache.enabled`

**型**：`boolean`  
**デフォルト値**：`true`

思考ブロックの署名をディスクキャッシュします。

**効果**：署名をキャッシュすることで、マルチターン対話での繰り返し署名によるエラーを回避できます。

### `signature_cache.memory_ttl_seconds`

**型**：`number`（範囲：60-86400）  
**デフォルト値**：`3600`（1 時間）

メモリキャッシュの有効期限（秒）。

### `signature_cache.disk_ttl_seconds`

**型**：`number`（範囲：3600-604800）  
**デフォルト値**：`172800`（48 時間）

ディスクキャッシュの有効期限（秒）。

### `signature_cache.write_interval_seconds`

**型**：`number`（範囲：10-600）  
**デフォルト値**：`60`

バックグラウンドでディスクに書き込む間隔（秒）。

**例**：
```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  }
}
```

---

## 空応答リトライ

Antigravity が空応答（candidates/choices なし）を返した場合に自動リトライします。

### `empty_response_max_attempts`

**型**：`number`（範囲：1-10）  
**デフォルト値**：`4`

最大リトライ回数。

### `empty_response_retry_delay_ms`

**型**：`number`（範囲：500-10000）  
**デフォルト値**：`2000`（2 秒）

各リトライ間の遅延（ミリ秒）。

**適用シナリオ**：
- ネットワーク不安定環境（リトライ回数を増加）
- 高速失敗が必要（リトライ回数と遅延を減少）

---

## ツールID復元

### `tool_id_recovery`

**型**：`boolean`  
**デフォルト値**：`true`

ツールID 孤立復元を有効にします。ツール応答のIDが一致しない場合（コンテキスト圧縮による）、関数名のマッチングやプレースホルダーの作成を試みます。

**効果**：マルチターン対話でのツール呼び出しの信頼性を向上させます。

**適用シナリオ**：
- 長時間対話シナリオ（有効化を推奨）
- 頻繁にツールを使用するシナリオ

---

## ツールハルシネーション防止

### `claude_tool_hardening`

**型**：`boolean`  
**デフォルト値**：`true`

Claude モデルのツールハルシネーション防止を有効にします。有効化すると、自動的に以下を注入します：
- ツール説明へのパラメータシグネチャ
- 厳格なツール使用ルールシステム指示

**効果**：Claude がトレーニングデータのパラメータ名ではなく、実際のスキーマのパラメータ名を使用するのを防ぎます。

**適用シナリオ**：
- MCP プラグインやカスタムツールの使用（有効化を推奨）
- ツールスキーマが複雑な場合

**非推奨シナリオ**：
- ツール呼び出しがスキーマに完全に準拠していることが確認できている場合（追加プロンプトを減らすために無効化可能）

---

## プロアクティブトークン更新

### `proactive_token_refresh`

**型**：`boolean`  
**デフォルト値**：`true`

プロアクティブバックグラウンドトークン更新を有効にします。有効化すると、トークンは期限切れ前に自動的に更新され、更新のためにリクエストがブロックされることがありません。

**効果**：リクエストがトークン更新を待つ遅延を回避します。

### `proactive_refresh_buffer_seconds`

**型**：`number`（範囲：60-7200）  
**デフォルト値**：`1800`（30 分）

トークン期限切れ前にプロアクティブ更新をトリガーする時間（秒）。

### `proactive_refresh_check_interval_seconds`

**型**：`number`（範囲：30-1800）  
**デフォルト値**：`300`（5 分）

プロアクティブ更新チェックの間隔（秒）。

**適用シナリオ**：
- 高頻度リクエストシナリオ（プロアクティブ更新を推奨）
- 更新失敗リスクの低減（バッファ時間を増加）

---

## レート制限とアカウント選択

### `max_rate_limit_wait_seconds`

**型**：`number`（範囲：0-3600）  
**デフォルト値**：`300`（5 分）

すべてのアカウントがレート制限されている場合の最大待機時間（秒）。すべてのアカウントの最小待機時間がこのしきい値を超えると、プラグインは保留せずに迅速に失敗します。

**0 に設定**：タイムアウトを無効化し、無期限に待機します。

**適用シナリオ**：
- 高速失敗が必要なシナリオ（待機時間を短縮）
- 長時間の待機が許容されるシナリオ（待機時間を増加）

### `quota_fallback`

**型**：`boolean`  
**デフォルト値**：`false`

Gemini モデルのクォータフォールバックを有効にします。優先クォータプール（Gemini CLI または Antigravity）が枯渇した場合、同じアカウントのバックアップクォータプールを試行します。

**適用シナリオ**：
- Gemini モデルの高頻度使用（有効化を推奨）
- 各アカウントのクォータ使用率の最大化を希望する場合

::: tip クォータサフィックスが明示的に指定されていない場合のみ有効
モデル名に `:antigravity` または `:gemini-cli` が明示的に含まれる場合、指定されたクォータプールが常に使用され、フォールバックは行われません。
:::

### `account_selection_strategy`

**型**：`string`（列挙：`sticky`、`round-robin`、`hybrid`）  
**デフォルト値**：`"hybrid"`  
**環境変数**：`OPENCODE_ANTIGRAVITY_ACCOUNT_SELECTION_STRATEGY`

アカウント選択戦略。

| 戦略 | 説明 | 適用シナリオ |
|---|---|---|
| `sticky` | レート制限されるまで同じアカウントを使用、プロンプトキャッシュを保持 | 単一セッション、キャッシュ重視シナリオ |
| `round-robin` | 各リクエストで次のアカウントにローテーション、スループットを最大化 | マルチアカウント高スループットシナリオ |
| `hybrid` | ヘルススコア + トークンバケット + LRU に基づく決定論的選択 | 汎用推奨、パフォーマンスと信頼性のバランス |

::: info 詳細説明
詳細は [アカウント選択戦略](/ja/NoeFabris/opencode-antigravity-auth/advanced/account-selection-strategies/) セクションを参照してください。
:::

### `pid_offset_enabled`

**型**：`boolean`  
**デフォルト値**：`false`  
**環境変数**：`OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1`

PID ベースのアカウントオフセットを有効にします。有効化すると、異なるセッション（PIDs）が異なる開始アカウントを優先的に選択し、複数の並行エージェントを実行する際の負荷分散に役立ちます。

**動作説明**：
- `false`（デフォルト）：すべてのセッションが同じアカウントインデックスから開始、Anthropic プロンプトキャッシュを保持（単一セッション使用を推奨）
- `true`：PID に基づいて開始アカウントをオフセット、負荷分散（マルチセッション並行使用を推奨）

**適用シナリオ**：
- 複数の並行 OpenCode セッションの実行
- サブエージェントや並行タスクの使用

### `switch_on_first_rate_limit`

**型**：`boolean`  
**デフォルト値**：`true`

最初のレート制限時に即座にアカウントを切り替えます（1秒遅延後）。無効化すると、最初に同じアカウントを再試行し、2回目のレート制限時に切り替えます。

**適用シナリオ**：
- 迅速なアカウント切り替えを希望する場合（有効化を推奨）
- 単一アカウントのクォータを最大化したい場合（無効化）

---

## ヘルススコア（Hybrid 戦略）

> `account_selection_strategy` が `hybrid` の場合のみ有効

### `health_score.initial`

**型**：`number`（範囲：0-100）  
**デフォルト値**：`70`

アカウントの初期ヘルススコア。

### `health_score.success_reward`

**型**：`number`（範囲：0-10）  
**デフォルト値**：`1`

成功リクエストごとに増加するヘルススコア。

### `health_score.rate_limit_penalty`

**型**：`number`（範囲：-50-0）  
**デフォルト値**：`-10`

レート制限ごとに減少するヘルススコア。

### `health_score.failure_penalty`

**型**：`number`（範囲：-100-0）  
**デフォルト値**：`-20`

失敗ごとに減少するヘルススコア。

### `health_score.recovery_rate_per_hour`

**型**：`number`（範囲：0-20）  
**デフォルト値**：`2`

毎時回復するヘルススコア。

### `health_score.min_usable`

**型**：`number`（範囲：0-100）  
**デフォルト値**：`50`

アカウントが使用可能となる最低ヘルススコアのしきい値。

### `health_score.max_score`

**型**：`number`（範囲：50-100）  
**デフォルト値**：`100`

ヘルススコアの上限。

**適用シナリオ**：
- デフォルト設定はほとんどのシナリオに適しています
- 高頻度レート制限環境では `rate_limit_penalty` を下げるか `recovery_rate_per_hour` を上げることができます
- より迅速なアカウント切り替えが必要な場合は `min_usable` を下げることができます

**例**：
```json
{
  "account_selection_strategy": "hybrid",
  "health_score": {
    "initial": 80,
    "success_reward": 2,
    "rate_limit_penalty": -5,
    "failure_penalty": -15,
    "recovery_rate_per_hour": 5,
    "min_usable": 40,
    "max_score": 100
  }
}
```

---

## トークンバケット（Hybrid 戦略）

> `account_selection_strategy` が `hybrid` の場合のみ有効

### `token_bucket.max_tokens`

**型**：`number`（範囲：1-1000）  
**デフォルト値**：`50`

トークンバケットの最大容量。

### `token_bucket.regeneration_rate_per_minute`

**型**：`number`（範囲：0.1-60）  
**デフォルト値**：`6`

毎分生成されるトークン数。

### `token_bucket.initial_tokens`

**型**：`number`（範囲：1-1000）  
**デフォルト値**：`50`

アカウントの初期トークン数。

**適用シナリオ**：
- 高頻度リクエストシナリオでは `max_tokens` と `regeneration_rate_per_minute` を増加できます
- より迅速なアカウントローテーションが必要な場合は `initial_tokens` を減少できます

---

## 自動更新

### `auto_update`

**型**：`boolean`  
**デフォルト値**：`true`

プラグインの自動更新を有効にします。

**適用シナリオ**：
- 最新機能を自動的に取得したい場合（有効化を推奨）
- 固定バージョンが必要な場合（無効化）

---

## ウェブ検索（Gemini Grounding）

### `web_search.default_mode`

**型**：`string`（列挙：`auto`、`off`）  
**デフォルト値**：`"off"`

ウェブ検索のデフォルトモード（variant 未指定時）。

| モード | 説明 |
|---|---|
| `auto` | モデルが検索タイミングを決定（動的検索） |
| `off` | デフォルトで検索を無効化 |

### `web_search.grounding_threshold`

**型**：`number`（範囲：0-1）  
**デフォルト値**：`0.3`

動的検索のしきい値（0.0 から 1.0）。値が高いほど、モデルは検索頻度が低くなります（より高い信頼度で検索をトリガー）。`auto` モードでのみ有効。

**適用シナリオ**：
- 不要な検索を減らす（しきい値を上げる、例：0.5）
- モデルにより多くの検索を促す（しきい値を下げる、例：0.2）

**例**：
```json
{
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.4
  }
}
```

---

## 設定例

### 単一アカウント基本設定

```json
{
  "quiet_mode": false,
  "debug": false,
  "keep_thinking": false,
  "session_recovery": true,
  "auto_resume": false,
  "account_selection_strategy": "sticky"
}
```

### マルチアカウント高性能設定

```json
{
  "quiet_mode": true,
  "debug": false,
  "session_recovery": true,
  "auto_resume": true,
  "account_selection_strategy": "hybrid",
  "quota_fallback": true,
  "switch_on_first_rate_limit": true,
  "max_rate_limit_wait_seconds": 120,
  "health_score": {
    "initial": 70,
    "min_usable": 40
  },
  "token_bucket": {
    "max_tokens": 100,
    "regeneration_rate_per_minute": 10
  }
}
```

### デバッグと診断設定

```json
{
  "debug": true,
  "log_dir": "/tmp/antigravity-logs",
  "quiet_mode": false,
  "session_recovery": true,
  "auto_resume": true,
  "tool_id_recovery": true
}
```

### 思考ブロック保持設定

```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  },
  "session_recovery": true
}
```

---

## よくある質問

### Q: 特定の設定を一時的に無効にするには？

**A**: 設定ファイルを変更せずに、環境変数を使用して上書きします。

```bash
# 一時的にデバッグモードを有効化
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode

# 一時的に安静モードを有効化
OPENCODE_ANTIGRAVITY_QUIET=1 opencode
```

### Q: 設定ファイルを変更した後、OpenCode を再起動する必要はありますか？

**A**: はい、設定ファイルは OpenCode 起動時に読み込まれます。変更後は再起動が必要です。

### Q: 設定が有効になっているかどうかを確認するには？

**A**: `debug` モードを有効にして、ログファイルの設定読み込み情報を確認します。

```json
{
  "debug": true
}
```

ログに読み込まれた設定が表示されます：
```
[config] Loaded configuration: {...}
```

### Q: 最も頻繁に調整する必要がある設定項目はどれですか？

**A**:
- `account_selection_strategy`：マルチアカウントシナリオで適切な戦略を選択
- `quiet_mode`：通知の干渉を減らす
- `session_recovery` / `auto_resume`：セッション復元動作の制御
- `debug`：問題のトラブルシューティング時に有効化

### Q: 設定ファイルには JSON Schema 検証がありますか？

**A**: はい、設定ファイルに `$schema` フィールドを追加することで、IDE の自動補完と検証を有効にできます：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  ...
}
```

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能        | ファイルパス                                                                                    | 行番号    |
|--- | --- | ---|
| 設定 Schema 定義 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 1-373   |
| JSON Schema  | [`assets/antigravity.schema.json`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/assets/antigravity.schema.json) | 1-157   |
| 設定読み込み    | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | -       |

**重要な定数**：
- `DEFAULT_CONFIG`：デフォルト設定オブジェクト（`schema.ts:328-372`）

**重要な型**：
- `AntigravityConfig`：主設定型（`schema.ts:322`）
- `SignatureCacheConfig`：署名キャッシュ設定型（`schema.ts:323`）
- `AccountSelectionStrategy`：アカウント選択戦略型（`schema.ts:22`）

</details>
