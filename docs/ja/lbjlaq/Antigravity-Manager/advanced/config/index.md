---
title: "設定：ホットリロードとマイグレーション | Antigravity-Manager"
subtitle: "設定：ホットリロードとマイグレーション | Antigravity-Manager"
sidebarTitle: "設定が反映されない場合の対処法"
description: "設定システムの保存、ホットリロード、マイグレーションの仕組みを学習します。フィールドのデフォルト値と認証検証方法をマスターし、よくある落とし穴を回避します。"
tags:
  - "設定"
  - "gui_config.json"
  - "AppConfig"
  - "ProxyConfig"
  - "ホットリロード"
prerequisite:
  - "start-first-run-data"
  - "start-proxy-and-first-client"
order: 1
---
# 設定完全解説：AppConfig/ProxyConfig、保存場所とホットリロードの仕組み

あなたは `auth_mode` を変更したのにクライアントが 401 を返す；`allow_lan_access` を有効にしたのに同じネットワークセグメントのデバイスから接続できない；設定を新しいマシンに移したいのにどのファイルをコピーすればよいか分からない。

このレッスンでは、Antigravity Tools の設定システムを一度に完全解説します：設定がどこに保存されるか、デフォルト値は何か、どの設定がホットリロードできるか、どの設定はリバースプロキシを再起動する必要があるか。

## AppConfig/ProxyConfig とは？

**AppConfig/ProxyConfig** は Antigravity Tools の設定データモデルです：AppConfig はデスクトップの汎用設定（言語、テーマ、プリロード、クォータ保護など）を管理し、ProxyConfig はローカルリバースプロキシサービスの実行パラメータ（ポート、認証、モデルマッピング、アップストリームプロキシなど）を管理します。最終的にこれらはすべて同じ `gui_config.json` ファイルにシリアライズされ、リバースプロキシの起動時に ProxyConfig が読み込まれます。
## このレッスンでできること

- 設定ファイル `gui_config.json` の実際の保存場所を見つけ、バックアップ/移行できる
- AppConfig/ProxyConfig のコアフィールドとデフォルト値を理解する（ソースコードに基づく）
- どの設定が保存後にホットリロードできるか、どの設定はリバースプロキシを再起動する必要があるかを明確にする
- 「設定マイグレーション」（旧フィールドが自動的にマージ/削除される）が発生する条件を理解する

## 現在の悩み

- 設定を変更したのに「反映されない」場合、保存されていない、ホットリロードされていない、それとも再起動が必要なのか分からない
- 「リバースプロキシの設定」だけを新しいマシンに持ち込みたいが、アカウントデータも一緒に持ち出されるのが心配
- アップグレード後に旧フィールドが表示され、設定ファイルの形式が「壊れた」のではないかと心配する

## いつこの方法を使うか

- リバースプロキシを「ローカルのみ」から「LAN アクセス可能」に切り替える準備をしている
- 認証ポリシー（`auth_mode`/`api_key`）を変更し、すぐに有効かどうかを確認したい
- モデルマッピング/アップストリームプロキシ/z.ai 設定を一括で管理する

## 🎒 始める前の準備

- データディレクトリが何かをすでに理解している（[初回起動時の必知事項：データディレクトリ、ログ、トレイ、自動起動](../../start/first-run-data/)を参照）
- リバースプロキシサービスを少なくとも 1 回起動できる（[ローカルリバースプロキシを起動して最初のクライアントを接続する](../../start/proxy-and-first-client/)を参照）

::: warning まずは境界条件を説明
このレッスンでは `gui_config.json` の読み取り/バックアップ/移行方法を教えますが、それを「長期的に手動でメンテナンスする設定ファイル」として扱うことは推奨しません。バックエンドが設定を保存する際、Rust の `AppConfig` 構造体に基づいて再シリアライズするため、手動で追加した未知のフィールドは、次回保存時に自動的に削除される可能性があります。
:::

## コアコンセプト

設定について、まず 3 つのことを覚えてください：

1. AppConfig は設定を永続化するルートオブジェクトで、`gui_config.json` に保存されます。
2. ProxyConfig は `AppConfig.proxy` のサブオブジェクトで、リバースプロキシの起動/ホットリロードはこれを中心に行われます。
3. ホットリロードは「メモリ状態のみを更新する」：ホットリロードできるからといって、リッスンポートやリッスンアドレスを変更できるわけではありません。

## さあ、一緒にやってみよう

### ステップ 1：`gui_config.json` の場所を特定する（設定の単一真実ソース）

**なぜ**
今後のすべての「バックアップ/移行/トラブルシューティング」は、このファイルを基準に行う必要があります。

バックエンドのデータディレクトリはホームディレクトリ以下の `.antigravity_tools`（存在しない場合は自動的に作成されます）で、設定ファイル名は固定で `gui_config.json` です。

::: code-group

```bash [macOS/Linux]
CONFIG_FILE="$HOME/.antigravity_tools/gui_config.json"
echo "$CONFIG_FILE"
ls -la "$CONFIG_FILE" || true
```

```powershell [Windows]
$configFile = Join-Path $HOME ".antigravity_tools\gui_config.json"
$configFile
Get-ChildItem -Force $configFile -ErrorAction SilentlyContinue
```

:::

**期待される結果**：
- リバースプロキシをまだ起動していない場合、このファイルは存在しない可能性があります（バックエンドはデフォルト設定を直接使用します）。
- リバースプロキシサービスを起動するか、設定を保存すると、自動的に作成され JSON が書き込まれます。

### ステップ 2：まずバックアップを作成する（誤操作防止 + ロールバック用）

**なぜ**
設定には `proxy.api_key`、z.ai の `api_key` などの機密フィールドが含まれる可能性があります。移行や比較を行いたい場合、バックアップは「記憶」よりも信頼性が高いです。

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/antigravity-config-backup"
cp "$HOME/.antigravity_tools/gui_config.json" "$HOME/antigravity-config-backup/gui_config.$(date +%Y%m%d%H%M%S).json"
```

```powershell [Windows]
$backupDir = Join-Path $HOME "antigravity-config-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$ts = Get-Date -Format "yyyyMMddHHmmss"
Copy-Item (Join-Path $HOME ".antigravity_tools\gui_config.json") (Join-Path $backupDir "gui_config.$ts.json")
```

:::

**期待される結果**：バックアップディレクトリにタイムスタンプ付きの JSON ファイルが作成されます。

### ステップ 3：デフォルト値を理解する（勘で推測しない）

**なぜ**
「どう設定しても正しくない」という多くの問題は、デフォルト値に対する期待が間違っていることが原因です。

以下のデフォルト値は、バックエンドの `AppConfig::new()` および `ProxyConfig::default()` に基づいています：

| 設定ブロック | フィールド | デフォルト値（ソースコード） | 留意点 |
| --- | --- | --- | --- |
| AppConfig | `language` | `"zh"` | デフォルトは中国語 |
| AppConfig | `theme` | `"system"` | システム設定に従う |
| AppConfig | `auto_refresh` | `true` | デフォルトでクォータを自動更新 |
| AppConfig | `refresh_interval` | `15` | 単位：分 |
| ProxyConfig | `enabled` | `false` | デフォルトでリバースプロキシは起動しない |
| ProxyConfig | `allow_lan_access` | `false` | デフォルトでローカルのみにバインド（プライバシー優先） |
| ProxyConfig | `auth_mode` | `"off"` | デフォルトで認証なし（ローカルのみのシナリオ） |
| ProxyConfig | `port` | `8045` | 最も頻繁に変更するフィールド |
| ProxyConfig | `api_key` | `"sk-<uuid>"` | デフォルトでランダムなキーを生成 |
| ProxyConfig | `request_timeout` | `120` | 単位：秒（注：リバースプロキシ内部では現在使用されていない可能性があります） |
| ProxyConfig | `enable_logging` | `true` | デフォルトでモニタリング/統計に必要なログ収集を有効化 |
| StickySessionConfig | `mode` | `Balance` | スケジューリングポリシーはデフォルトでバランス |
| StickySessionConfig | `max_wait_seconds` | `60` | CacheFirst モードでのみ意味を持つ |

::: tip すべてのフィールドを見るには？
`gui_config.json` を直接開いてソースコードと比較できます：`src-tauri/src/models/config.rs`（AppConfig）と `src-tauri/src/proxy/config.rs`（ProxyConfig）。このレッスンの最後にある「ソースコード参考」にクリック可能な行番号リンクがあります。
:::

### ステップ 4：「確実にホットリロードされる」設定を変更してすぐに確認する（認証を例に）

**なぜ**
「変更してすぐに確認できる」ループが必要です。UI で見当違いの変更をすることを避けるためです。

リバースプロキシが実行中の場合、バックエンドの `save_config` は以下の内容をメモリにホットリロードします：

- `proxy.custom_mapping`
- `proxy.upstream_proxy`
- `proxy.auth_mode` / `proxy.api_key`（セキュリティポリシー）
- `proxy.zai`
- `proxy.experimental`

ここでは `auth_mode` を例にします：

1. `API Proxy` ページを開き、リバースプロキシサービスが Running 状態にあることを確認します。
2. `auth_mode` を `all_except_health` に設定し、現在の `api_key` を把握していることを確認します。
3. 以下のリクエストで「ヘルスチェックは通過、他のインターフェースは拒否される」ことを確認します。

::: code-group

```bash [macOS/Linux]
#キーなしで /healthz をリクエスト：成功するはず
curl -sS "http://127.0.0.1:8045/healthz" && echo

#キーなしで /v1/models をリクエスト：401 になるはず
curl -sS -i "http://127.0.0.1:8045/v1/models"

#キー付きで /v1/models をリクエスト：成功するはず
curl -sS -H "Authorization: Bearer <proxy.api_key>" "http://127.0.0.1:8045/v1/models"
```

```powershell [Windows]
#キーなしで /healthz をリクエスト：成功するはず
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/healthz" | Select-Object -ExpandProperty StatusCode

#キーなしで /v1/models をリクエスト：401 になるはず
try { Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" } catch { $_.Exception.Response.StatusCode.value__ }

#キー付きで /v1/models をリクエスト：成功するはず
$headers = @{ Authorization = "Bearer <proxy.api_key>" }
(Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" -Headers $headers).StatusCode
```

:::

**期待される結果**：`/healthz` は 200 を返し、`/v1/models` はキーなしで 401、キー付きで成功します。

### ステップ 5：「リバースプロキシの再起動が必要な」設定を変更する（ポート / リッスンアドレス）

**なぜ**
多くの設定は「保存したが反映されない」ですが、その根本原因はバグではなく、TCP リスナーのバインド方法を決定しているためです。

リバースプロキシを起動する際、バックエンドは `allow_lan_access` を使ってリッスンアドレス（`127.0.0.1` または `0.0.0.0`）を計算し、`port` でポートをバインドします。このステップは `start_proxy_service` でのみ発生します。

操作の手順：

1. `API Proxy` ページで `port` を新しい値（例：`8050`）に変更し、保存します。
2. リバースプロキシサービスを停止し、再起動します。
3. 新しいポートで `/healthz` を確認します。

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:8050/healthz" && echo
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8050/healthz" | Select-Object -ExpandProperty StatusCode
```

:::

**期待される結果**：新しいポートにアクセスできます。古いポートへの接続は失敗するか、空を返します。

::: warning `allow_lan_access` について
ソースコードでは `allow_lan_access` が 2 つのことに影響します：

1. **リッスンアドレス**：`127.0.0.1` にバインドするか `0.0.0.0` にバインドするかを決定します（リバースプロキシの再起動が必要）。
2. **自動認証ポリシー**：`auth_mode=auto` の場合、LAN シナリオでは自動的に `all_except_health` に変換されます（この部分はホットリロード可能）。
:::

### ステップ 6：「設定マイグレーション」を理解する（旧フィールドは自動的に削除されます）

**なぜ**
アップグレード後に `gui_config.json` に旧フィールドが表示され、「壊れた」のではないかと心配することがあります。実際には、バックエンドが設定をロードする際にマイグレーションが行われます：`anthropic_mapping/openai_mapping` を `custom_mapping` にマージし、旧フィールドを削除してから自動的に保存します。

このルールを使って自己チェックできます：

- ファイルに `proxy.anthropic_mapping` または `proxy.openai_mapping` が表示される場合、次回起動時または設定ロード時に削除されます。
- マージ時に `-series` で終わるキーはスキップされます（これらは preset/builtin ロジックで処理されます）。

**期待される結果**：マイグレーションが発生すると、`gui_config.json` には `proxy.custom_mapping` のみが残ります。

## チェックポイント ✅

- 自分のマシンで `$HOME/.antigravity_tools/gui_config.json` を見つけられる
- `auth_mode/api_key/custom_mapping` などの設定がなぜホットリロードできるかを説明できる
- `port/allow_lan_access` などの設定がなぜリバースプロキシの再起動が必要なのかを説明できる

## よくある落とし穴

1. `save_config` のホットリロードは少数のフィールドのみをカバーします：リスナーの再起動は行わず、`scheduling` などの設定を TokenManager にプッシュすることもしません。
2. `request_timeout` はリバースプロキシ内部の現在の実装では実際に有効になっていません：AxumServer の `start` パラメータでは `_request_timeout` となっており、状態ではタイムアウトが `300` 秒にハードコードされています。
3. `gui_config.json` に「カスタムフィールド」を手動で追加するのは信頼性が低いです：バックエンドが設定を保存する際、それを `AppConfig` に再シリアライズし、未知のフィールドは破棄されます。

## このレッスンのまとめ

- 設定の保存場所は 1 つだけ：`$HOME/.antigravity_tools/gui_config.json`
- ProxyConfig の「ホットリロード可能」は「ポート/リッスンアドレスの変更可能」とは異なります：bind 関連の設定はすべてリバースプロキシの再起動が必要
- 旧マッピングフィールドが表示されても慌てないでください：設定をロードする際に自動的に `custom_mapping` にマイグレーションされ、旧フィールドが削除されます

## 次のレッスン予告

> 次のレッスンでは **[セキュリティとプライバシー：auth_mode、allow_lan_access、そして「アカウント情報を漏らさない」設計](../security/)** を学びます。
>
> 学べること：
> > - いつ認証を有効にする必要があるか（そしてなぜ `auto` が LAN シナリオではより厳格になるのか）
> > - ローカルリバースプロキシを LAN/インターネットに公開する際の最小限の公開ポリシー
> > - どのデータがアップストリームに送信され、どのデータがローカルのみに保存されるか

---

## 付録：ソースコード参考

<details>
<summary><strong>クリックしてソースコードの位置を展開</strong></summary>

> 更新日時：2026-01-24

| トピック | ファイルパス | 行番号 |
| --- | --- | --- |
| AppConfig デフォルト値（`AppConfig::new()`） | [`src-tauri/src/models/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/config.rs#L4-L158) | 4-158 |
| ProxyConfig デフォルト値（ポート/認証/リッスンアドレス） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L74-L292) | 74-292 |
| StickySessionConfig デフォルト値（スケジューリング） | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L36) | 3-36 |
| 設定保存ファイル名 + マイグレーションロジック（`gui_config.json`） | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| データディレクトリ（`$HOME/.antigravity_tools`） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| `save_config`：設定保存 + どのフィールドをホットリロードするか | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| AxumServer：`update_mapping/update_proxy/update_security/...` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L45-L117) | 45-117 |
| `allow_lan_access` のリッスンアドレス選択 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L81-L92) | 81-92 |
| Proxy 起動時の bind アドレスとポート（再起動しないと変更されない） | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L134) | 42-134 |
| `auth_mode=auto` の実際のルール | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L3-L31) | 3-31 |
| フロントエンドでのスケジューリング設定の保存（保存のみ、バックエンドのランタイムにはプッシュされない） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L476-L501) | 476-501 |
| Monitor ページでのログ収集の動的な有効化/無効化 | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L263) | 174-263 |

</details>
