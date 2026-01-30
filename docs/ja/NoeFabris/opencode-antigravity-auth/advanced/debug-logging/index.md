---
title: "デバッグログ: 問題の診断と実行状態の監視 | opencode-antigravity-auth"
sidebarTitle: "ログで問題を見つける"
subtitle: "デバッグログ：問題の診断と実行状態の監視"
description: "デバッグログを有効にして Antigravity Auth プラグインの問題を診断する方法を学びます。ログレベル、内容の解読、環境変数の設定、ログファイル管理の方法を網羅します。"
tags:
  - "advanced"
  - "debug"
  - "logging"
  - "troubleshooting"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# デバッグログ：問題の診断と実行状態の監視

## このチュートリアルで学べること

- デバッグログを有効にして、すべてのリクエストとレスポンスの詳細情報を記録する
- 異なるログレベルと適用シーンを理解する
- ログ内容を解読して、問題の根本原因を素早く特定する
- 環境変数を使用して設定ファイルを変更せずに一時的にデバッグを有効にする
- ログファイルを管理して、ディスク使用量の増大を防ぐ

## 今あなたが直面している課題

問題に遭遇した際、以下のような状況に陥ることがあります：

- 曖昧なエラーメッセージが表示され、具体的な原因がわからない
- リクエストが Antigravity API に正常に到達したかどうかわからない
- アカウント選択、レート制限、リクエスト変換のどこに問題があるのか疑問に思う
- 他の人に助けを求める際、有用な診断情報を提供できない

## どんな時にこの方法を使うべきか

デバッグログは以下のシーンに適しています：

| シーン | 必要性 | 理由 |
| --- | --- | --- |
| 429 レート制限の診断 | ✅ 必要 | どのアカウント、どのモデルが制限されているか確認 |
| 認証失敗の診断 | ✅ 必要 | トークン更新、OAuth フローを検証 |
| リクエスト変換問題の診断 | ✅ 必要 | 元のリクエストと変換後のリクエストを比較 |
| アカウント選択戦略の診断 | ✅ 必要 | プラグインがどのようにアカウントを選択するか確認 |
| 日常的な実行状態の監視 | ✅ 必要 | リクエスト頻度、成功/失敗率を統計 |
| 長期運用 | ⚠️ 慎重に | ログが継続的に増大するため管理が必要 |

::: warning 前提条件の確認
このチュートリアルを始める前に、以下が完了していることを確認してください：
- ✅ opencode-antigravity-auth プラグインをインストール済み
- ✅ OAuth 認証に成功済み
- ✅ Antigravity モデルでリクエストを送信できる状態

[クイックインストール](../../start/quick-install/) | [初回リクエスト](../../start/first-request/)
:::

## 基本的な仕組み

デバッグログシステムの動作原理：

1. **構造化ログ**：各ログエントリにタイムスタンプとタグが付与され、フィルタリングと分析が容易
2. **レベル別記録**：
   - Level 1（basic）：リクエスト/レスポンスのメタ情報、アカウント選択、レート制限イベントを記録
   - Level 2（verbose）：リクエスト/レスポンスの完全な body を記録（最大 50,000 文字）
3. **セキュリティマスキング**：機密情報（Authorization header など）を自動的に隠蔽
4. **独立ファイル**：起動ごとに新しいログファイルを作成し、混乱を回避

**ログ内容の概要**：

| ログタイプ | タグ | 内容例 |
| --- | --- | --- |
| リクエストトレース | `Antigravity Debug ANTIGRAVITY-1` | URL、headers、body プレビュー |
| レスポンストレース | `Antigravity Debug ANTIGRAVITY-1` | ステータスコード、所要時間、レスポンス body |
| アカウントコンテキスト | `[Account]` | 選択されたアカウント、アカウントインデックス、モデルファミリー |
| レート制限 | `[RateLimit]` | 制限詳細、リセット時間、リトライ遅延 |
| モデル識別 | `[ModelFamily]` | URL 解析、モデル抽出、モデルファミリー判定 |

## 実践手順

### ステップ 1：基本デバッグログを有効にする

**なぜ必要か**
基本デバッグログを有効にすると、プラグインはすべてのリクエストのメタ情報（URL、headers、アカウント選択、レート制限イベントなど）を記録し、機密データを漏洩させることなく問題を診断できます。

**操作手順**

プラグイン設定ファイルを編集します：

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/antigravity.json
```

```powershell [Windows]
notepad %APPDATA%\opencode\antigravity.json
```

:::

以下の設定を追加または変更します：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true
}
```

ファイルを保存し、OpenCode を再起動します。

**期待される結果**：

1. OpenCode 起動後、設定ディレクトリに新しいログファイルが生成される
2. ログファイルの命名形式：`antigravity-debug-YYYY-MM-DDTHH-MM-SS-mmmZ.log`
3. 任意のリクエストを送信すると、ログファイルに新しいレコードが表示される

::: tip ログファイルの場所
- **Linux/macOS**: `~/.config/opencode/antigravity-logs/`
- **Windows**: `%APPDATA%\opencode\antigravity-logs\`
:::

### ステップ 2：ログ内容を解読する

**なぜ必要か**
ログの形式と内容を理解することで、問題を素早く特定できます。

**操作手順**

テストリクエストを送信してから、ログファイルを確認します：

```bash
<!-- macOS/Linux -->
tail -f ~/.config/opencode/antigravity-logs/antigravity-debug-*.log

<!-- Windows PowerShell -->
Get-Content "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" -Wait
```

**期待される結果**：

```log
[2026-01-23T10:30:15.123Z] [Account] Request: Account 1 (1/2) family=claude
[2026-01-23T10:30:15.124Z] [Antigravity Debug ANTIGRAVITY-1] POST https://cloudcode-pa.googleapis.com/...
[2026-01-23T10:30:15.125Z] [Antigravity Debug ANTIGRAVITY-1] Streaming: yes
[2026-01-23T10:30:15.126Z] [Antigravity Debug ANTIGRAVITY-1] Headers: {"user-agent":"opencode-antigravity-auth/1.3.0","authorization":"[redacted]",...}
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Body Preview: {"model":"google/antigravity-claude-sonnet-4-5",...}
[2026-01-23T10:30:18.456Z] [Antigravity Debug ANTIGRAVITY-1] Response 200 OK (3330ms)
[2026-01-23T10:30:18.457Z] [Antigravity Debug ANTIGRAVITY-1] Response Headers: {"content-type":"application/json",...}
```

**ログの解読**：

1. **タイムスタンプ**：`[2026-01-23T10:30:15.123Z]` - ISO 8601 形式、ミリ秒精度
2. **アカウント選択**：`[Account]` - プラグインがアカウント 1 を選択、全 2 アカウント中、モデルファミリーは claude
3. **リクエスト開始**：`Antigravity Debug ANTIGRAVITY-1` - リクエスト ID は 1
4. **リクエストメソッド**：`POST https://...` - HTTP メソッドとターゲット URL
5. **ストリーミング有無**：`Streaming: yes/no` - SSE ストリーミングレスポンスを使用するかどうか
6. **リクエストヘッダー**：`Headers: {...}` - Authorization は自動的に隠蔽（`[redacted]` と表示）
7. **リクエストボディ**：`Body Preview: {...}` - リクエスト内容（最大 12,000 文字、超過分は切り捨て）
8. **レスポンスステータス**：`Response 200 OK (3330ms)` - HTTP ステータスコードと所要時間
9. **レスポンスヘッダー**：`Response Headers: {...}` - レスポンス headers

### ステップ 3：詳細ログ（Verbose）を有効にする

**なぜ必要か**
詳細ログは完全なリクエスト/レスポンス body（最大 50,000 文字）を記録し、リクエスト変換やレスポンス解析などの深層問題の診断に適しています。

**操作手順**

設定を verbose レベルに変更します：

```json
{
  "debug": true,
  "OPENCODE_ANTIGRAVITY_DEBUG": "2"
}
```

または環境変数を使用（推奨、設定ファイルの変更不要）：

::: code-group

```bash [macOS/Linux]
export OPENCODE_ANTIGRAVITY_DEBUG=2
opencode
```

```powershell [Windows]
$env:OPENCODE_ANTIGRAVITY_DEBUG="2"
opencode
```

:::

**期待される結果**：

1. ログファイルに完全なリクエスト/レスポンス body が表示される（切り捨てられた preview ではない）
2. 大きなレスポンスの場合、最初の 50,000 文字が表示され、切り捨てられた文字数がマークされる

```log
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Response Body (200): {"id":"msg_...","type":"message","role":"assistant",...}
```

::: warning ディスク容量の警告
詳細ログは完全なリクエスト/レスポンス内容を記録するため、ログファイルが急速に増大する可能性があります。デバッグ完了後は、必ず verbose モードを無効にしてください。
:::

### ステップ 4：レート制限問題を診断する

**なぜ必要か**
レート制限（429 エラー）は最も一般的な問題の一つです。ログは、どのアカウント、どのモデルが制限されているか、どれくらい待つ必要があるかを教えてくれます。

**操作手順**

複数の並行リクエストを送信してレート制限をトリガーします：

```bash
<!-- macOS/Linux -->
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait
```

ログ内のレート制限イベントを確認します：

```bash
grep "RateLimit" ~/.config/opencode/antigravity-logs/antigravity-debug-*.log
```

**期待される結果**：

```log
[2026-01-23T10:30:20.123Z] [RateLimit] 429 on Account 1 family=claude retryAfterMs=60000
[2026-01-23T10:30:20.124Z] [RateLimit] message: Resource has been exhausted
[2026-01-23T10:30:20.125Z] [RateLimit] quotaResetTime: 2026-01-23T10:31:00.000Z
[2026-01-23T10:30:20.126Z] [Account] Request: Account 2 (2/2) family=claude
[2026-01-23T10:30:20.127Z] [RateLimit] snapshot family=claude Account 1=wait 60s | Account 2=ready
```

**ログの解読**：

1. **制限詳細**：`429 on Account 1 family=claude retryAfterMs=60000`
   - アカウント 1（claude モデルファミリー）が 429 エラーに遭遇
   - 60,000 ミリ秒（60 秒）待機後にリトライが必要
2. **エラーメッセージ**：`message: Resource has been exhausted` - クォータ枯渇
3. **リセット時間**：`quotaResetTime: 2026-01-23T10:31:00.000Z` - クォータがリセットされる正確な時刻
4. **アカウント切り替え**：プラグインが自動的にアカウント 2 に切り替え
5. **グローバルスナップショット**：`snapshot` - すべてのアカウントの制限状態を表示

### ステップ 5：ログディレクトリをカスタマイズする

**なぜ必要か**
デフォルトでは、ログファイルは `~/.config/opencode/antigravity-logs/` ディレクトリに保存されます。ログを別の場所（プロジェクトディレクトリなど）に保存したい場合は、ログディレクトリをカスタマイズできます。

**操作手順**

設定ファイルに `log_dir` 設定項目を追加します：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true,
  "log_dir": "/path/to/your/custom/logs"
}
```

または環境変数を使用します：

```bash
export OPENCODE_ANTIGRAVITY_LOG_DIR="/path/to/your/custom/logs"
opencode
```

**期待される結果**：

1. ログファイルが指定されたディレクトリに書き込まれる
2. ディレクトリが存在しない場合、プラグインが自動的に作成
3. ログファイルの命名形式は変わらない

::: tip パスの推奨
- 開発デバッグ：プロジェクトルートディレクトリに保存（`.logs/`）
- 本番環境：システムログディレクトリに保存（`/var/log/` または `~/Library/Logs/`）
- 一時デバッグ：`/tmp/` ディレクトリに保存、クリーンアップが容易
:::

### ステップ 6：ログファイルをクリーンアップして管理する

**なぜ必要か**
長期運用時、ログファイルは継続的に増大し、大量のディスク容量を占有します。定期的なクリーンアップが必要です。

**操作手順**

ログディレクトリのサイズを確認します：

```bash
<!-- macOS/Linux -->
du -sh ~/.config/opencode/antigravity-logs/

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\" | Measure-Object -Property Length -Sum
```

古いログをクリーンアップします：

```bash
<!-- macOS/Linux -->
find ~/.config/opencode/antigravity-logs/ -name "antigravity-debug-*.log" -mtime +7 -delete

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item
```

**期待される結果**：

1. ログディレクトリのサイズが減少
2. 最近 7 日間のログファイルのみが保持される

::: tip 自動クリーンアップ
クリーンアップスクリプトを cron（Linux/macOS）またはタスクスケジューラ（Windows）に追加して、定期的に実行できます。
:::

## チェックポイント ✅

上記のステップを完了すると、以下ができるようになります：

- [ ] 設定ファイルでデバッグログを有効化
- [ ] 環境変数で一時的にデバッグを有効化
- [ ] ログ内容を解読して、リクエスト/レスポンスの詳細を確認
- [ ] 異なるログレベルの役割を理解
- [ ] ログディレクトリをカスタマイズ
- [ ] ログファイルを管理してクリーンアップ

## よくあるトラブルと解決策

### ログファイルが継続的に増大する

**症状**：ディスク容量がログファイルに占有される

**原因**：長期間デバッグログを有効にしている、特に verbose モード

**解決策**：

1. デバッグ完了後、すぐに `debug: false` に設定
2. 定期クリーンアップスクリプトを設定（ステップ 6 参照）
3. ログディレクトリのサイズを監視し、閾値アラートを設定

### ログファイルが見つからない

**症状**：`debug: true` を有効にしたが、ログディレクトリが空

**原因**：
- 設定ファイルのパスが間違っている
- 権限問題（ログディレクトリへの書き込み不可）
- 環境変数が設定を上書きしている

**解決策**：

1. 設定ファイルのパスが正しいことを確認：
   ```bash
   # 設定ファイルを検索
   find ~/.config/opencode/ -name "antigravity.json" 2>/dev/null
   ```
2. 環境変数が設定を上書きしていないか確認：
   ```bash
   echo $OPENCODE_ANTIGRAVITY_DEBUG
   ```
3. ログディレクトリの権限を確認：
   ```bash
   ls -la ~/.config/opencode/antigravity-logs/
   ```

### ログ内容が不完全

**症状**：ログにリクエスト/レスポンス body が表示されない

**原因**：デフォルトで basic レベル（Level 1）を使用しており、body preview のみを記録（最大 12,000 文字）

**解決策**：

1. verbose レベル（Level 2）を有効にする：
   ```json
   {
     "OPENCODE_ANTIGRAVITY_DEBUG": "2"
   }
   ```
2. または環境変数を使用：
   ```bash
   export OPENCODE_ANTIGRAVITY_DEBUG=2
   ```

### 機密情報の漏洩

**症状**：ログに機密データ（Authorization token など）が含まれているのではないかと心配

**原因**：プラグインは `Authorization` header を自動的にマスキングしますが、他の headers に機密情報が含まれている可能性があります

**解決策**：

1. プラグインは既に `Authorization` header を自動的にマスキング（`[redacted]` と表示）
2. ログを共有する際、他の機密 headers（`Cookie`、`Set-Cookie` など）がないか確認
3. 機密情報を発見した場合、手動で削除してから共有

### ログファイルを開けない

**症状**：ログファイルが他のプロセスに占有されており、閲覧できない

**原因**：OpenCode がログファイルに書き込み中

**解決策**：

1. `tail -f` コマンドでリアルタイムログを閲覧（ファイルをロックしない）
2. 編集が必要な場合は、まず OpenCode を終了
3. `cat` コマンドで内容を閲覧（ファイルをロックしない）

## このチュートリアルのまとめ

- デバッグログは問題診断の強力なツールで、リクエスト/レスポンスの詳細、アカウント選択、レート制限イベントを記録できる
- 2 つのログレベルがある：basic（Level 1）と verbose（Level 2）
- 環境変数で一時的にデバッグを有効にでき、設定ファイルの変更は不要
- プラグインは機密情報（Authorization header など）を自動的にマスキング
- 長期運用時は定期的にログファイルをクリーンアップする必要がある

## 次のチュートリアル

> 次は **[レート制限処理](../rate-limit-handling/)** を学びます。
>
> 学べる内容：
> - レート制限の検出メカニズムとリトライ戦略
> - 指数バックオフアルゴリズムの動作原理
> - 最大待機時間とリトライ回数の設定方法
> - マルチアカウントシーンでのレート制限処理

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Debug モジュール | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 全体 |
| デバッグ初期化 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L98-L118) | 98-118 |
| リクエストトレース | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L189-L212) | 189-212 |
| レスポンス記録 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L217-L250) | 217-250 |
| Header マスキング | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L255-L270) | 255-270 |
| レート制限ログ | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L354-L396) | 354-396 |
| 設定スキーマ | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L64-L72) | 64-72 |

**主要な定数**：

| 定数名 | 値 | 説明 |
| --- | --- | --- |
| `MAX_BODY_PREVIEW_CHARS` | 12000 | Basic レベルの body プレビュー長 |
| `MAX_BODY_VERBOSE_CHARS` | 50000 | Verbose レベルの body プレビュー長 |
| `DEBUG_MESSAGE_PREFIX` | `"[opencode-antigravity-auth debug]"` | デバッグログプレフィックス |

**主要な関数**：

- `initializeDebug(config)`：デバッグ状態を初期化し、設定と環境変数を読み取る
- `parseDebugLevel(flag)`：デバッグレベル文字列を解析（"0"/"1"/"2"/"true"/"verbose"）
- `getLogsDir(customLogDir?)`：ログディレクトリを取得、カスタムパスをサポート
- `createLogFilePath(customLogDir?)`：タイムスタンプ付きログファイルパスを生成
- `startAntigravityDebugRequest(meta)`：リクエストトレースを開始し、リクエストメタ情報を記録
- `logAntigravityDebugResponse(context, response, meta)`：レスポンス詳細を記録
- `logAccountContext(label, info)`：アカウント選択コンテキストを記録
- `logRateLimitEvent(...)`：レート制限イベントを記録
- `maskHeaders(headers)`：機密 headers（Authorization）をマスキング

**設定項目**（schema.ts より）：

| 設定項目 | 型 | デフォルト値 | 説明 |
| --- | --- | --- | --- |
| `debug` | boolean | `false` | デバッグログを有効化 |
| `log_dir` | string? | undefined | カスタムログディレクトリ |

**環境変数**：

| 環境変数 | 値 | 説明 |
| --- | --- | --- |
| `OPENCODE_ANTIGRAVITY_DEBUG` | "0"/"1"/"2"/"true"/"verbose" | debug 設定を上書き、ログレベルを制御 |
| `OPENCODE_ANTIGRAVITY_LOG_DIR` | string | log_dir 設定を上書き、ログディレクトリを指定 |

</details>
