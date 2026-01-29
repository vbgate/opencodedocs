---
title: "Cloudflared: パブリック API 暴露 | Antigravity-Manager"
sidebarTitle: "リモートデバイスがローカル API にアクセス"
subtitle: "Cloudflared ワンクリックトンネル：ローカル API を安全にパブリックに暴露（デフォルトでは安全ではない）"
description: "Antigravity Tools の Cloudflared ワンクリックトンネルを学習します。Quick/Auth 2種類の起動方法を実行し、URL がいつ表示されるか、コピーとテスト方法を理解し、proxy.auth_mode + 強力な API Key で最小暴露を行います。インストール場所、一般的なエラーとトラブルシューティングの考え方を付帯し、リモートデバイスでも安定してローカルゲートウェイを呼び出せるようにします。"
tags:
  - "Cloudflared"
  - "内网穿透"
  - "公网访问"
  - "Tunnel"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 7
---
# Cloudflared ワンクリックトンネル：ローカル API を安全にパブリックに暴露（デフォルトでは安全ではない）

**Cloudflared ワンクリックトンネル** を使用して、ローカルの Antigravity Tools API ゲートウェイをパブリックに暴露します（明示的に有効にした場合のみ）。リモートデバイスからも呼び出せるようにし、Quick と Auth 2種類のモードの動作の違いとリスクの境界を明確にします。

## 学習後、できること

- Cloudflared トンネルをワンクリックでインストール・起動する
- Quick モード（一時 URL）または Auth モード（名前付きトンネル）を選択する
- パブリック URL をコピーして、リモートデバイスがローカル API にアクセスできるようにする
- トンネルのセキュリティリスクを理解し、最小暴露戦略を採用する

## 現在の課題

ローカルで Antigravity Tools の API ゲートウェイを実行しましたが、ローカルマシンまたは LAN からのみアクセスできます。リモートサーバー、モバイルデバイス、またはクラウドサービスもこのゲートウェイを呼び出したいが、パブリック IP がなく、複雑なサーバー展開ソリューションを設定したくありません。

## いつこの手法を使うか

- パブリック IP がないが、リモートデバイスがローカル API にアクセスする必要がある場合
- テスト/開発段階で、サービスを外部に素早く暴露したい場合
- サーバーを購入して展開したくなく、既存のマシンを使用したい場合

::: warning セキュリティ警告
パブリック暴露にはリスクがあります！必ず：
1. 強力な API Key を設定する（`proxy.auth_mode=strict/all_except_health`）
2. 必要な場合のみトンネルを有効にし、使用後はすぐに閉じる
3. 定期的に Monitor ログを確認し、異常が見つかったら直ちに停止する
:::

## 🎒 始める前の準備

::: warning 前提条件
- ローカルリバースプロキシサービスを起動済み（"API Proxy" ページのスイッチがオン）
- 少なくとも1つの利用可能なアカウントを追加済み
:::

## Cloudflared とは？

**Cloudflared** は Cloudflare が提供するトンネルクライアントで、あなたのマシンと Cloudflare の間に暗号化チャネルを確立し、ローカル HTTP サービスをパブリックからアクセス可能な URL にマッピングします。Antigravity Tools はインストール、起動、停止、URL のコピーを UI 操作にし、検証ループを素早く完了できるようにします。

### サポートされているプラットフォーム

プロジェクトに内蔵されている「自動ダウンロード + インストール」ロジックは、次の OS/アーキテクチャの組み合わせのみをカバーしています（他のプラットフォームでは `Unsupported platform` エラーが発生します）。

| オペレーティングシステム | アーキテクチャ | サポート状況 |
|--- | --- | ---|
| macOS | Apple Silicon (arm64) | ✅ |
| macOS | Intel (x86_64) | ✅ |
| Linux | x86_64 | ✅ |
| Linux | ARM64 | ✅ |
| Windows | x86_64 | ✅ |

### 2種類のモードの比較

| 特性 | Quick モード | Auth モード |
|--- | --- | ---|
| **URL タイプ** | `https://xxx.trycloudflare.com`（ログから抽出された一時 URL） | アプリは必ずしも URL を自動的に抽出できない（cloudflared ログに依存）；エントリードメインは Cloudflare 側の設定に依存 |
| **Token が必要** | ❌ 不要 | ✅ 必要（Cloudflare コンソールから取得） |
| **安定性** | URL はプロセスの再起動時に変更される可能性がある | Cloudflare 側でどのように設定したかによって異なる（アプリはプロセスの起動のみを担当） |
| **適切なシーン** | 一時テスト、素早い検証 | 長期安定サービス、本番環境 |
| **推奨度** | ⭐⭐⭐ テスト用 | ⭐⭐⭐⭐⭐ 本番用 |

::: info Quick モード URL の特性
Quick モードの URL は起動するたびに変更される可能性があり、ランダムに生成された `*.trycloudflare.com` サブドメインです。固定 URL が必要な場合は、Auth モードを使用し、Cloudflare コンソールでドメインをバインドする必要があります。
:::

## 実践してみましょう

### ステップ1：API Proxy ページを開く

**なぜ**
Cloudflared 設定エントリーを見つけます。

1. Antigravity Tools を開く
2. 左側のナビゲーションの **"API Proxy"**（API リバースプロキシ）をクリック
3. **"Public Access (Cloudflared)"** カードを見つける（ページの下部、オレンジ色のアイコン）

**次のように見えるはずです**：展開可能なカードが表示され、"Cloudflared not installed"（未インストール）または "Installed: xxx"（インストール済み）が表示されます。

### ステップ2：Cloudflared をインストールする

**なぜ**
Cloudflared バイナリファイルをデータディレクトリの `bin` フォルダにダウンロードしてインストールします。

#### 未インストールの場合

1. **"Install"**（インストール）ボタンをクリック
2. ダウンロードの完了を待つ（ネットワーク速度に応じて約10-30秒）

**次のように見えるはずです**：
- ボタンにローディングアニメーションが表示
- 完了後、"Cloudflared installed successfully" が表示
- カードに "Installed: cloudflared version 202X.X.X" が表示

#### 既にインストールされている場合

このステップをスキップし、ステップ3に進んでください。

::: tip インストール場所
Cloudflared バイナリファイルは「データディレクトリ」の `bin/` 下にインストールされます（データディレクトリ名は `.antigravity_tools`）。

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/bin/"
```

```powershell [Windows]
Get-ChildItem "$HOME\.antigravity_tools\bin\"
```

:::

データディレクトリの場所がまだ不确定な場合は、まず **[初回起動で必須：データディレクトリ、ログ、トレイ、自動起動](../../start/first-run-data/)** を見てください。
:::

### ステップ3：トンネルモードを選択する

**なぜ**
使用シーンに応じて適切なモードを選択します。

1. カードでモード選択領域を見つける（2つの大きなボタン）
2. クリックして選択：

| モード | 説明 | いつ選択するか |
|--- | --- | ---|
| **Quick Tunnel** | 一時 URL を自動生成する（`*.trycloudflare.com`） | 素早いテスト、一時アクセス |
| **Named Tunnel** | Cloudflare アカウントとカスタムドメインを使用 | 本番環境、固定ドメインのニーズ |

::: tip 推奨選択
初めて使用する場合は、**先に Quick モードを選択し**、機能がニーズを満たすか素早く検証することをお勧めします。
:::

### ステップ4：パラメータを設定する

**なぜ**
モードに応じて必要なパラメータとオプションを入力します。

#### Quick モード

1. ポートは現在の Proxy ポートを自動的に使用する（デフォルトは `8045`、実際の設定に依存）
2. **"Use HTTP/2"** をチェックする（デフォルトでチェック）

#### Auth モード

1. **Tunnel Token** を入力する（Cloudflare コンソールから取得）
2. ポートも現在の Proxy ポートを使用する（実際の設定に依存）
3. **"Use HTTP/2"** をチェックする（デフォルトでチェック）

::: info Tunnel Token の取得方法
1. [Cloudflare Zero Trust コンソール](https://dash.cloudflare.com/sign-up-to-cloudflare-zero-trust) にログイン
2. **"Networks"** → **"Tunnels"** に入る
3. **"Create a tunnel"** → **"Remote browser"** または **"Cloudflared"** をクリック
4. 生成された Token をコピーする（`eyJhIjoiNj...` のような長い文字列）
:::

#### HTTP/2 オプションの説明

`Use HTTP/2` は cloudflared を `--protocol http2` で起動させます。プロジェクト内の文案は「より互換性（中国本土ユーザーに推奨）」と説明し、デフォルトで有効になっています。

::: tip 推奨チェック
**HTTP/2 オプションはデフォルトでチェックすることをお勧めします**、特に国内ネットワーク環境では。
:::

### ステップ5：トンネルを起動する

**なぜ**
ローカルから Cloudflare への暗号化トンネルを確立します。

1. カードの右上のスイッチをクリック（または展開後の **"Start Tunnel"** ボタン）
2. トンネルの起動を待つ（約5-10秒）

**次のように見えるはずです**：
- カードタイトルの右側に緑色の点が表示
- **"Tunnel Running"** が表示
- パブリック URL が表示される（`https://random-name.trycloudflare.com` のような）
- 右側にコピーボタン：ボタンには URL の最初の20文字のみが表示されますが、クリックすると完全な URL がコピーされます

::: warning Auth モードでは URL が見えない可能性がある
現在のアプリは cloudflared のログから `*.trycloudflare.com` この種類の URL のみを抽出して表示します。Auth モードは通常、この種類のドメインを出力しないため、"Running" が見えるだけで、URL が見えない可能性があります。この場合、エントリードメインは Cloudflare 側の設定に依存します。
:::

### ステップ6：パブリックアクセスをテストする

**なぜ**
トンネルが正常に動作しているかを確認します。

#### ヘルスチェック

::: code-group

```bash [macOS/Linux]
#実際のトンネル URL に置換
curl -s "https://your-url.trycloudflare.com/healthz"
```

```powershell [Windows]
Invoke-RestMethod "https://your-url.trycloudflare.com/healthz"
```

:::

**次のように見えるはずです**：`{"status":"ok"}`

#### モデルリストクエリ

::: code-group

```bash [macOS/Linux]
#認証を有効にした場合、<proxy_api_key> を自分のキーに置換
curl -s \
  -H "Authorization: Bearer <proxy_api_key>" \
  "https://your-url.trycloudflare.com/v1/models"
```

```powershell [Windows]
Invoke-RestMethod \
  -Headers @{ Authorization = "Bearer <proxy_api_key>" } \
  "https://your-url.trycloudflare.com/v1/models"
```

:::

**次のように見えるはずです**：モデルリスト JSON が返されます。

::: tip HTTPS に注意
トンネル URL は HTTPS プロトコルで、追加の証明書設定は不要です。
:::

#### OpenAI SDK を使用して呼び出す（例）

```python
import openai

#パブリック URL を使用
client = openai.OpenAI(
    api_key="your-proxy-api-key",  # 認証を有効にした場合
    base_url="https://your-url.trycloudflare.com/v1"
)

#modelId は /v1/models の実際の返り値に依存

response = client.chat.completions.create(
    model="<modelId>",
    messages=[{"role": "user", "content": "こんにちは"}]
)

print(response.choices[0].message.content)
```

::: warning 認証リマインダー
"API Proxy" ページで認証を有効にした場合（`proxy.auth_mode=strict/all_except_health`）、リクエストには API Key を含める必要があります：
- Header: `Authorization: Bearer your-api-key`
- または: `x-api-key: your-api-key`
:::

### ステップ7：トンネルを停止する

**なぜ**
使用後はすぐに閉じ、セキュリティ暴露時間を減らします。

1. カードの右上のスイッチをクリック（または展開後の **"Stop Tunnel"** ボタン）
2. 停止の完了を待つ（約2秒）

**次のように見えるはずです**：
- 緑色の点が消える
- **"Tunnel Stopped"** が表示
- パブリック URL が消える

## チェックポイント ✅

上記のステップを完了した後、次のことができるはずです：

- [ ] Cloudflared バイナリファイルをインストールする
- [ ] Quick と Auth モード間で切り替える
- [ ] トンネルを起動し、パブリック URL を取得する
- [ ] パブリック URL を使用してローカル API を呼び出す
- [ ] トンネルを停止する

## よくある落とし穴

### 問題1：インストール失敗（ダウンロードタイムアウト）

**症状**："Install" をクリックした後、長時間応答がなく、またはダウンロード失敗が表示される。

**原因**：ネットワーク問題（特に国内から GitHub Releases へのアクセス）。

**解決**：
1. ネットワーク接続を確認
2. VPN またはプロキシを使用
3. 手動ダウンロード：[Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases)、対応するプラットフォームバージョンを選択し、データディレクトリの `bin` フォルダに手動で配置し、実行権限を付与する（macOS/Linux）

### 問題2：トンネル起動失敗

**症状**：起動をクリックした後、URL が表示されない、またはエラーが表示される。

**原因**：
- Auth モードで Token が無効
- ローカルリバースプロキシサービスが起動していない
- ポートが占有されている

**解決**：
1. Auth モード：Token が正しいか、期限切れかを確認
2. "API Proxy" ページのリバースプロキシスイッチがオンになっているかを確認
3. ポート `8045` が他のプログラムによって占有されているかを確認

### 問題3：パブリック URL にアクセスできない

**症状**：curl または SDK でパブリック URL を呼び出すとタイムアウトする。

**原因**：
- トンネルプロセスが予期せず終了した
- Cloudflare ネットワークの問題
- ローカルファイアウォールがブロックしている

**解決**：
1. カードに "Tunnel Running" が表示されているかを確認
2. カードにエラー提示（赤い文字）があるかを確認
3. ローカルファイアウォール設定を確認
4. トンネルの再起動を試みる

### 問題4：認証失敗（401）

**症状**：リクエストが 401 エラーを返す。

**原因**：プロキシで認証が有効になっているが、リクエストに API Key が含まれていない。

**解決**：
1. "API Proxy" ページの認証モードを確認
2. リクエストに正しい Header を追加：
   ```bash
   curl -H "Authorization: Bearer your-api-key" \
         https://your-url.trycloudflare.com/v1/models
   ```

## この授業のまとめ

Cloudflared トンネルはローカルサービスを素早く暴露する強力なツールです。この授業を通じて、次のことを学びました：

- **ワンクリックインストール**：UI 内で Cloudflared を自動的にダウンロード・インストール
- **2種類のモード**：Quick（一時）と Auth（名前付き）の選択
- **パブリックアクセス**：HTTPS URL をコピーし、リモートデバイスから直接呼び出す
- **セキュリティ意識**：認証を有効にし、使用後はすぐに閉じ、定期的にログを確認

**記憶しておいてください**：**トンネルは諸刃の剣**、正しく使うと便利ですが、間違えるとリスクがあります。常に最小暴露原則に従ってください。

## 次の授業の予告

次の授業では、**[設定全解：AppConfig/ProxyConfig、永続化場所とホット更新の意味](/ja/lbjlaq/Antigravity-Manager/advanced/config/)** を学習します。

学習内容：
- AppConfig と ProxyConfig の完全なフィールド
- 設定ファイルの永続化場所
- どの設定が再起動が必要か、どれがホット更新可能か

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| データディレクトリ名（`.antigravity_tools`） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| 設定構造とデフォルト値（`CloudflaredConfig`、`TunnelMode`） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L16-L59) | 16-59 |
| 自動ダウンロード URL ルール（サポートされている OS/アーキテクチャ） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L70-L88) | 70-88 |
| インストールロジック（ダウンロード/書き込み/解凍/権限） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L147-L211) | 147-211 |
|--- | --- | ---|
| URL 抽出ルール（`*.trycloudflare.com` のみ認識） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L390-L413) | 390-413 |
| Tauri コマンドインターフェース（check/install/start/stop/get_status） | [`src-tauri/src/commands/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/cloudflared.rs#L6-L118) | 6-118 |
| UI カード（モード/Token/HTTP2/URL 表示とコピー） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1597-L1753) | 1597-1753 |
| 起動前に必須 Proxy Running（toast + return） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L256-L306) | 256-306 |

**重要な定数**：
- `DATA_DIR = ".antigravity_tools"`：データディレクトリ名（ソースコード：`src-tauri/src/modules/account.rs`）

**重要な関数**：
- `get_download_url()`：GitHub Releases のダウンロードアドレスを構築（ソースコード：`src-tauri/src/modules/cloudflared.rs`）
- `extract_tunnel_url()`：ログから Quick モード URL を抽出（ソースコード：`src-tauri/src/modules/cloudflared.rs`）

</details>
