---
title: "ストレージモデル: データ構造 | Antigravity Tools"
sidebarTitle: "データの場所"
subtitle: "データとモデル：アカウントファイル、SQLite 統計データベース、主要フィールド定義"
description: "Antigravity Tools のデータストレージ構造を学習します。accounts.json、アカウントファイル、token_stats.db/proxy_logs.db の場所とフィールドの意味を把握します。"
tags:
  - "付録"
  - "データモデル"
  - "ストレージ構造"
  - "バックアップ"
prerequisite:
  - "start-backup-migrate"
order: 2
---

# データとモデル：アカウントファイル、SQLite 統計データベースと主要フィールド定義

## 学べること

- アカウントデータ、統計データベース、設定ファイル、ログディレクトリの保存場所を素早く特定する
- アカウントファイルの JSON 構造と主要フィールドの意味を理解する
- SQLite を使用してプロキシリクエストログと Token 消費統計を直接クエリする
- バックアップ、移行、トラブルシューティング時にどのファイルを見るべきかを知る

## 現在の課題

あなたは以下の必要があるとき、以下のような問題に直面しているかもしれません：

- **アカウントを新しいマシンに移行したい**：どのファイルをコピーすればよいかわからない
- **アカウントの異常をトラブルシューティングしたい**：アカウントファイルのどのフィールドでアカウントの状態を判断できるかわからない
- **Token 消費をエクスポートしたい**：データベースから直接クエリしたいが、テーブル構造がわからない
- **履歴データをクリーンアップしたい**：間違ったファイルを削除してデータが失われるのを心配している

この付録は完全なデータモデルの理解を構築するのに役立ちます。

---

## データディレクトリ構造

Antigravity Tools のコアデータはデフォルトで「ユーザーホームディレクトリ」下の `.antigravity_tools` ディレクトリに保存されます（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`）。

::: warning まずセキュリティ境界を明確に
このディレクトリには `refresh_token`/`access_token` などの機密情報が含まれます（ソース：`source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`）。バックアップ/コピー/共有の前に、ターゲット環境が信頼できることを確認してください。
:::

### このディレクトリはどこにありますか？

::: code-group

```bash [macOS/Linux]
## データディレクトリに入る
cd ~/.antigravity_tools

## または Finder で開く（macOS）
open ~/.antigravity_tools
```

```powershell [Windows]
## データディレクトリに入る
Set-Location "$env:USERPROFILE\.antigravity_tools"

## またはエクスプローラで開く
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### ディレクトリツリー概要

```
~/.antigravity_tools/
├── accounts.json          # アカウントインデックス（バージョン 2.0）
├── accounts/              # アカウントディレクトリ
│   └── <account_id>.json  # アカウントごとに1つのファイル
├── gui_config.json        # アプリケーション設定（GUI から書き込み）
├── token_stats.db         # Token 統計データベース（SQLite）
├── proxy_logs.db          # Proxy 監視ログデータベース（SQLite）
├── logs/                  # アプリケーションログディレクトリ
│   └── app.log*           # 日単位でローテーション（ファイル名は日付によって変化）
├── bin/                   # 外部ツール（cloudflared など）
│   └── cloudflared(.exe)
└── device_original.json   # デバイスフィンガープリントの基準（オプション）
```

**データディレクトリのパスルール**：`dirs::home_dir()` を取得し、`.antigravity_tools` を連結します（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`）。

::: tip バックアップの推奨事項
`accounts/` ディレクトリ、`accounts.json`、`token_stats.db`、`proxy_logs.db` を定期的にバックアップするだけで、すべてのコアデータを保存できます。
:::

---

## アカウントデータモデル

### accounts.json（アカウントインデックス）

アカウントインデックスファイルは、すべてのアカウントの要約情報と現在選択されているアカウントを記録します。

**場所**：`~/.antigravity_tools/accounts.json`

**Schema**（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`）：

```json
{
  "version": "2.0",                  // インデックスのバージョン
  "accounts": [                       // アカウント要約リスト
    {
      "id": "uuid-v4",              // アカウントの一意 ID
      "email": "user@gmail.com",     // アカウントのメールアドレス
      "name": "Display Name",        // 表示名（オプション）
      "created_at": 1704067200,      // 作成時間（Unix タイムスタンプ）
      "last_used": 1704067200       // 最終使用時間（Unix タイムスタンプ）
    }
  ],
  "current_account_id": "uuid-v4"    // 現在選択されているアカウント ID
}
```

### アカウントファイル（{account_id}.json）

各アカウントの完全なデータは JSON 形式で `accounts/` ディレクトリ下に個別に保存されます。

**場所**：`~/.antigravity_tools/accounts/{account_id}.json`

**Schema**（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42`；フロントエンドの型：`source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`）：

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // OAuth Token データ
    "access_token": "ya29...",      // 現在のアクセストークン
    "refresh_token": "1//...",      // リフレッシュトークン（最も重要）
    "expires_in": 3600,            // 有効期限（秒）
    "expiry_timestamp": 1704070800, // 有効期限タイムスタンプ
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // オプション：Google Cloud プロジェクト ID
    "session_id": "..."            // オプション：Antigravity sessionId
  },

  "device_profile": {               // デバイスフィンガープリント（オプション）
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // デバイスフィンガープリントの履歴バージョン
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Saved from device X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // クォータデータ（オプション）
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // 残りクォータのパーセンテージ
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // サブスクリプションタイプ：FREE/PRO/ULTRA
  },

  "disabled": false,                // アカウントが完全に無効化されているか
  "disabled_reason": null,          // 無効化の理由（例：invalid_grant）
  "disabled_at": null,             // 無効化タイムスタンプ

  "proxy_disabled": false,         // プロキシ機能を無効化するか
  "proxy_disabled_reason": null,   // プロキシ無効化の理由
  "proxy_disabled_at": null,       // プロキシ無効化タイムスタンプ

  "protected_models": [             // クォータ保護の対象となるモデルリスト
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### 主要フィールドの説明

| フィールド | 型 | ビジネスの意味 | トリガー条件 |
| ----- | ---- | -------- | -------- |
| `disabled` | bool | アカウントが完全に無効化されている（例：refresh_token が失効した） | `invalid_grant` の時に自動的に `true` に設定 |
| `proxy_disabled` | bool | プロキシ機能のみを無効化し、GUI の使用には影響しない | 手動無効化またはクォータ保護のトリガー |
| `protected_models` | string[] | モデルレベルクォータ保護の「制限付きモデルリスト」 | クォータ保護ロジックによって更新 |
| `quota.models[].percentage` | number | 残りクォータのパーセンテージ（0-100） | クォータのリフレッシュごとに更新 |
| `token.refresh_token` | string | access_token を取得するための資格情報 | OAuth 認証時に取得、長期間有効 |

**重要ルール 1：invalid_grant は無効化をトリガーする**（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889`；書き込み：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`）：

- トークンのリフレッシュが失敗し、エラーに `invalid_grant` が含まれる場合、TokenManager はアカウントファイルに `disabled=true` / `disabled_at` / `disabled_reason` を書き込み、トークンプールからアカウントを削除します。

**重要ルール 2：protected_models の意味**（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250`；クォータ保護の書き込み：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`）：

- `protected_models` には「正規化されたモデル ID」が保存され、モデルレベルのクォータ保護とスケジューリングのスキップに使用されます。

---

## Token 統計データベース

Token 統計データベースは、各プロキシリクエストの Token 消費を記録し、コスト監視とトレンド分析に使用されます。

**場所**：`~/.antigravity_tools/token_stats.db`

**データベースエンジン**：SQLite + WAL モード（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`）

### テーブル構造

#### token_usage（元の使用記録）

| フィールド | 型 | 説明 |
| ---- | ---- | ---- |
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 自動増分主キー |
| timestamp | INTEGER | リクエストタイムスタンプ |
| account_email | TEXT | アカウントのメールアドレス |
| model | TEXT | モデル名 |
| input_tokens | INTEGER | 入力 Token 数 |
| output_tokens | INTEGER | 出力 Token 数 |
| total_tokens | INTEGER | 合計 Token 数 |

**テーブル作成ステートメント**（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`）：

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly（時間単位集計テーブル）

1 時間ごとに Token 使用量を集計し、トレンドデータを高速にクエリできるようにします。

**テーブル作成ステートメント**（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`）：

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- 時間バケット（形式：YYYY-MM-DD HH:00）
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### インデックス

クエリパフォーマンスを向上させるため、データベースに以下のインデックスを作成します（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`）：

```sql
-- 時間降順インデックス
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- アカウントインデックス
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### 一般的なクエリ例

#### 過去 24 時間の Token 消費をクエリする

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### モデル別の消費を集計する

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info 時間フィールドの定義
`token_usage.timestamp` は `chrono::Utc::now().timestamp()` で書き込まれた Unix タイムスタンプ（秒）であり、`token_stats_hourly.hour_bucket` も UTC に基づいて生成された文字列です（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`）。
:::

---

## Proxy 監視ログデータベース

Proxy ログデータベースは、各プロキシリクエストの詳細情報を記録し、トラブルシューティングとリクエスト監査に使用されます。

**場所**：`~/.antigravity_tools/proxy_logs.db`

**データベースエンジン**：SQLite + WAL モード（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`）

### テーブル構造：request_logs

| フィールド | 型 | 説明 |
| ---- | ---- | ---- |
| id | TEXT PRIMARY KEY | リクエストの一意 ID（UUID） |
| timestamp | INTEGER | リクエストタイムスタンプ |
| method | TEXT | HTTP メソッド（GET/POST） |
| url | TEXT | リクエスト URL |
| status | INTEGER | HTTP ステータスコード |
| duration | INTEGER | リクエスト所要時間（ミリ秒） |
| model | TEXT | クライアントがリクエストしたモデル名 |
| mapped_model | TEXT | 実際にルーティング後に使用されたモデル名 |
| account_email | TEXT | 使用されたアカウントのメールアドレス |
| error | TEXT | エラーメッセージ（ある場合） |
| request_body | TEXT | リクエストボディ（オプション、サイズが大きい） |
| response_body | TEXT | レスポンスボディ（オプション、サイズが大きい） |
| input_tokens | INTEGER | 入力 Token 数 |
| output_tokens | INTEGER | 出力 Token 数 |
| protocol | TEXT | プロトコルタイプ（openai/anthropic/gemini） |

**テーブル作成ステートメント**（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`）：

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- 互換性：ALTER TABLE を通じて新しいフィールドを段階的に追加
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### インデックス

```sql
-- 時間降順インデックス
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- ステータスコードインデックス
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### 自動クリーンアップ

システムが ProxyMonitor を起動するとき、30 日前のログを自動的にクリーンアップし、データベースに対して `VACUUM` を実行します（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`；実装：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`）。

### 一般的なクエリ例

#### 最近の失敗したリクエストをクエリする

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### 各アカウントのリクエスト成功率を集計する

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## 設定ファイル

### gui_config.json

アプリケーションの設定情報を保存します。プロキシ設定、モデルマッピング、認証モードなどが含まれます。

**場所**：`~/.antigravity_tools/gui_config.json`（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`）

このファイルの構造は `AppConfig` を基準とします（ソース：`source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`）。

::: tip 「バックアップ/移行のみ」の場合
最も簡単な方法は、アプリケーションを閉じてから `~/.antigravity_tools/` 全体をアーカイブすることです。設定のホットリロード/再起動の意味は「ランタイム動作」に属するため、高度なコース **[設定全解](../../advanced/config/)** を参照することをおすすめします。
:::

---

## ログファイル

### アプリケーションログ

**場所**：`~/.antigravity_tools/logs/`（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`）

ログは日単位でローテーションされるファイルを使用し、ベースファイル名は `app.log` です（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`）。

**ログレベル**：INFO/WARN/ERROR

**用途**：アプリケーション実行時の重要なイベント、エラー情報、デバッグ情報を記録し、トラブルシューティングに使用します。

---

## データ移行とバックアップ

### コアデータのバックアップ

::: code-group

```bash [macOS/Linux]
## データディレクトリ全体をバックアップ（最も安定）
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## データディレクトリ全体をバックアップ（最も安定）
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### 新しいマシンへの移行

1. Antigravity Tools を閉じる（ディスクへの書き込み中のコピーを避けるため）
2. ソースマシンの `.antigravity_tools` をターゲットマシンのユーザーホームディレクトリ下にコピーする
3. Antigravity Tools を起動する

::: tip クロスプラットフォーム移行
Windows から macOS/Linux へ（またはその逆）移行する場合、`.antigravity_tools` ディレクトリ全体をコピーするだけでよく、データ形式はクロスプラットフォーム互換です。
:::

### 履歴データのクリーンアップ

::: info まず結論を言いますと
- `proxy_logs.db`：30 日分の自動クリーンアップがあります（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`）。
- `token_stats.db`：起動時にテーブル構造を初期化します（ソース：`source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`）が、ソースコードには「日単位の自動履歴クリーンアップ」のロジックは見当たりません。
:::

::: danger 履歴データが必要ないと確認した場合のみ行ってください
統計/ログをクリアすると、履歴のトラブルシューティングとコスト分析データが失われます。作業前に `.antigravity_tools` 全体をバックアップしてください。
:::

単に「履歴をクリアして再開したい」場合、最も安定した方法は、アプリケーションを閉じてから DB ファイルを直接削除することです（次回起動時にテーブル構造が再作成されます）。

::: code-group

```bash [macOS/Linux]
## Token 統計をクリア（履歴が失われます）
rm -f ~/.antigravity_tools/token_stats.db

## Proxy 監視ログをクリア（履歴が失われます）
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## Token 統計をクリア（履歴が失われます）
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## Proxy 監視ログをクリア（履歴が失われます）
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## 一般的なフィールド定義の説明

### Unix タイムスタンプ

すべての時間関連フィールド（`created_at`、`last_used`、`timestamp` など）は Unix タイムスタンプ（秒単位の精度）を使用します。

**読みやすい時間に変換**：

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## SQLite クエリ（例：request_logs.timestamp を人間が読める時間に変換）
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### クォータパーセンテージ

`quota.models[].percentage` は残りクォータのパーセンテージ（0-100）を表します（ソース：`source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40`；バックエンドのモデル：`source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`）。

「クォータ保護」がトリガーされるかどうかは、`quota_protection.enabled/threshold_percentage/monitored_models` によって決定されます（ソース：`source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63`；`protected_models` への書き込み：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`）。

---

## 本レッスンのまとめ

- Antigravity Tools のデータディレクトリはユーザーホームディレクトリ下の `.antigravity_tools` にあります
- アカウントデータ：`accounts.json`（インデックス）+ `accounts/<account_id>.json`（単一アカウントの完全なデータ）
- 統計データ：`token_stats.db`（Token 統計）+ `proxy_logs.db`（Proxy 監視ログ）
- 設定と運用：`gui_config.json`、`logs/`、`bin/cloudflared*`、`device_original.json`
- バックアップ/移行の最も安定した方法は「アプリケーションを閉じてから `.antigravity_tools` 全体をアーカイブする」ことです

---

## 次のレッスンの予告

> 次のレッスンでは **[z.ai 統合能力の境界](../zai-boundaries/)** を学習します。
>
> 学べること：
> - z.ai 統合の実装済み機能リスト
> - 明確に実装されていない機能と使用制限
> - Vision MCP の実験的実装の説明

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新時間：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| データディレクトリ（.antigravity_tools） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| アカウントディレクトリ（accounts/） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| accounts.json 構造 | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Account 構造（バックエンド） | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Account 構造（フロントエンド） | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| TokenData/QuotaData 構造 | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| TokenData/QuotaData 構造 | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Token 統計データベース初期化（schema） | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Proxy ログデータベース初期化（schema） | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Proxy ログ自動クリーンアップ（30日） | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Proxy ログ自動クリーンアップ実装 | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| gui_config.json 読み書き | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| logs/ ディレクトリと app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| bin/cloudflared パス | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
| invalid_grant -> disabled 書き込み | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L869-L969) | 869-969 |

**重要な定数**：
- `DATA_DIR = ".antigravity_tools"`：データディレクトリ名（`src-tauri/src/modules/account.rs:16-18`）
- `ACCOUNTS_INDEX = "accounts.json"`：アカウントインデックスファイル名（`src-tauri/src/modules/account.rs:16-18`）
- `CONFIG_FILE = "gui_config.json"`：設定ファイル名（`src-tauri/src/modules/config.rs:7`）

**重要な関数**：
- `get_data_dir()`：データディレクトリパスを取得（`src-tauri/src/modules/account.rs`）
- `record_usage()`：`token_usage`/`token_stats_hourly` に書き込み（`src-tauri/src/modules/token_stats.rs`）
- `save_log()`：`request_logs` に書き込み（`src-tauri/src/modules/proxy_db.rs`）
- `cleanup_old_logs(days)`：古い `request_logs` を削除し `VACUUM` を実行（`src-tauri/src/modules/proxy_db.rs`）

</details>
