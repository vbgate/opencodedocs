---
title: "デプロイ：サーバーデプロイメント戦略 | Antigravity-Manager"
sidebarTitle: "サーバーで実行する"
subtitle: "デプロイ：サーバーデプロイメント戦略"
description: "Antigravity-Manager のサーバーデプロイメント方法を学びます。Docker noVNC と Headless Xvfb の 2 つの方式を比較し、インストール設定、データ永続化、ヘルスチェックとトラブルシューティングを行い、運用可能なサーバー環境を構築します。"
tags:
  - "デプロイメント"
  - "docker"
  - "xvfb"
  - "novnc"
  - "systemd"
  - "バックアップ"
prerequisite:
  - "start-installation"
  - "start-backup-migrate"
  - "advanced-security"
duration: 20
order: 10
---
# サーバーデプロイメント：Docker noVNC vs Headless Xvfb（選定と運用）

Antigravity Tools をサーバーデプロイメントして NAS/サーバー上で実行したい。通常は「GUI をリモートで開いて見る」ためではなく、長期実行されるローカル API ゲートウェイとして扱うためです：常時オンライン、ヘルスチェック可能、アップグレード可能、バックアップ可能、問題発生時に特定可能。

このレッスンでは、プロジェクトですでに提供されている 2 つの実行可能なアプローチだけを解説します：Docker（noVNC 付き）と Headless Xvfb（systemd 管理）。すべてのコマンドとデフォルト値はリポジトリ内のデプロイファイルを基準とします。

::: tip 「まずは 1 回動かすだけ」の場合
インストール編ですでに Docker と Headless Xvfb の開始コマンドを解説済みです。まず **[インストールとアップグレード](/ja/lbjlaq/Antigravity-Manager/start/installation/)** を読み、その後このレッスンに戻って「運用ループ」を完成させてください。
:::

## このレッスンでできること

- デプロイメント形態を正しく選択：Docker noVNC と Headless Xvfb がそれぞれどの問題を解決するかを理解
- 完全なループを実行：デプロイ → アカウントデータ同期 → `/healthz` ヘルスチェック → ログ確認 → バックアップ
- アップグレードを制御可能なアクションに：Docker の「起動時自動更新」と Xvfb の `upgrade.sh` の違いを理解

## 現在の悩み

- サーバーにデスクトップがないが、OAuth/認証などの「ブラウザ必須」の操作から離れられない
- 1 回動かすだけでは足りず、電源再起動後の自動復旧、ヘルスチェック、バックアップを望む
- 8045 ポートを公開するとセキュリティリスクがあるが、どこから制限すべきかわからない

## この方法をいつ使うか

- NAS/家庭用サーバー：ブラウザで GUI を開いて認証を完了したい（Docker/noVNC が手間いらず）
- サーバー長期運用：systemd でプロセス管理、ログをディスクに保存、スクリプトでアップグレードしたい（Headless Xvfb は「運用プロジェクト」に近い）

## 「サーバーデプロイメント」モードとは？

**サーバーデプロイメント**とは：Antigravity Tools をローカルデスクトップではなく、長期オンラインのマシン上で実行し、リバースプロキシポート（デフォルト 8045）を対外サービスエントリポイントとして扱うことです。コアは「リモートで画面を見る」ことではなく、安定した運用ループを構築することです：データ永続化、ヘルスチェック、ログ、アップグレード、バックアップ。

## コアコンセプト

1. まず「最も不足している能力」を選択：ブラウザ認証が必要なら Docker/noVNC；運用制御性が必要なら Headless Xvfb。
2. 次に「データ」を決定：アカウント/設定はすべて `.antigravity_tools/` にあり、Docker volume を使うか `/opt/antigravity/.antigravity_tools/` に固定。
3. 最後に「運用可能なループ」を作成：ヘルスチェックは `/healthz`、故障時はまず logs を確認し、再起動かアップグレードを決定。

::: warning 前提提醒：まずセキュリティベースラインを決める
8045 を LAN/インターネットに公開する場合は、先に **[セキュリティとプライバシー：auth_mode、allow_lan_access、そして「アカウント情報を漏らさない」設計](/ja/lbjlaq/Antigravity-Manager/advanced/security/)** を読んでください。
:::

## 選定早見表：Docker vs Headless Xvfb

| 最も重視する点 | 推奨 | なぜ |
| --- | --- | --- |
| ブラウザで OAuth/認証が必要 | Docker（noVNC） | コンテナ内に Firefox ESR が同梱され、ブラウザ内で直接操作可能（`deploy/docker/README.md` 参照） |
| systemd 管理/ログ保存を希望 | Headless Xvfb | install スクリプトが systemd service をインストールし、ログを `logs/app.log` に append（`deploy/headless-xvfb/install.sh` 参照） |
| 分離とリソース制限を希望 | Docker | compose 方式で自然に分離、リソース制限も簡単に設定可能（`deploy/docker/README.md` 参照） |

## さあ、一緒にやってみよう

### ステップ 1：まず「データディレクトリ」がどこにあるか確認

**なぜ**
デプロイ成功したが「アカウント/設定がない」という場合、本質的にはデータディレクトリが移動されていないか、永続化されていない。

- Docker 方式：データをコンテナ内の `/home/antigravity/.antigravity_tools` にマウント（compose volume）
- Headless Xvfb 方式：データを `/opt/antigravity/.antigravity_tools` に配置（`HOME=$(pwd)` で書き込み位置を固定）

**期待される結果**：
- Docker：`docker volume ls` で `antigravity_data` が見える
- Xvfb：`/opt/antigravity/.antigravity_tools/` が存在し、`accounts/`、`gui_config.json` を含む

### ステップ 2：Docker/noVNC を起動（ブラウザ認証が必要な場合に最適）

**なぜ**
Docker 方式は「仮想ディスプレイ + ウィンドウマネージャー + noVNC + アプリ + ブラウザ」を 1 つのコンテナにパッケージ化し、サーバーに多数のグラフィカル依存関係をインストールする手間を省きます。

サーバーで実行：

```bash
cd deploy/docker
docker compose up -d
```

noVNC を開く：

```text
http://<server-ip>:6080/vnc_lite.html
```

**期待される結果**：
- `docker compose ps` でコンテナが実行中と表示される
- ブラウザで noVNC ページを開ける

::: tip noVNC ポートについて（デフォルト維持推奨）
`deploy/docker/README.md` には `NOVNC_PORT` でポートをカスタマイズできるとありますが、現在の実装では `start.sh` が `websockify` を起動する際、ハードコードされた 6080 ポートをリッスンします。ポートを変更するには、docker-compose のポートマッピングと start.sh のリッスンポートを同時に調整する必要があります。

設定不整合を避けるため、デフォルト 6080 を直接使用することを推奨します。
:::

### ステップ 3：Docker の永続化、ヘルスチェック、バックアップ

**なぜ**
コンテナの可用性は 2 つのことに依存します：プロセスヘルス（まだ実行中か）とデータ永続化（再起動後もアカウントが残るか）。

1) 永続化 volume がマウントされているか確認：

```bash
cd deploy/docker
docker compose ps
```

2) volume をバックアップ（プロジェクト README に tar バックアップ方式がある）：

```bash
docker run --rm -v antigravity_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/antigravity-backup.tar.gz /data
```

3) コンテナヘルスチェック（Dockerfile に HEALTHCHECK がある）：

```bash
docker inspect --format '{{json .State.Health}}' antigravity-manager | jq
```

**期待される結果**：
- `.State.Health.Status` が `healthy`
- カレントディレクトリに `antigravity-backup.tar.gz` が生成される

### ステップ 4：Headless Xvfb ワンクリックインストール（systemd 運用を希望する場合に最適）

**なぜ**
Headless Xvfb は「純粋なバックエンドモード」ではなく、仮想ディスプレイで GUI プログラムをサーバー上で実行します。しかし、より馴染みのある運用方式と引き換えにできます：systemd、固定ディレクトリ、ログをディスクに保存。

サーバーで実行（プロジェクト提供のワンクリックスクリプト）：

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

**期待される結果**：
- ディレクトリ `/opt/antigravity/` が存在
- `systemctl status antigravity` でサービスが running と表示される

::: tip より確実な方法：まずスクリプトを確認
`curl -O .../install.sh` でダウンロード後、一度読んでから `sudo bash install.sh` を実行してください。
:::

### ステップ 5：ローカルアカウントをサーバーに同期（Xvfb 方式は必須）

**なぜ**
Xvfb インストールはプログラムを起動するだけです。リバースプロキシを実際に使えるようにするには、ローカルの既存アカウント/設定をサーバーのデータディレクトリに同期する必要があります。

プロジェクトは `sync.sh` を提供し、あなたのマシンで優先順位に従ってデータディレクトリ（例：`~/.antigravity_tools`、`~/Library/Application Support/Antigravity Tools`）を自動検索し、rsync でサーバーに転送します：

```bash
curl -O https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/sync.sh
chmod +x sync.sh

./sync.sh root@your-server /opt/antigravity
```

**期待される結果**：
- 端末に `同期: <local> -> root@your-server:/opt/antigravity/.antigravity_tools/` のような出力
- リモートサービスが再起動を試行（スクリプトは `systemctl restart antigravity` を呼び出す）

### ステップ 6：ヘルスチェックとトラブルシューティング（2 方式共通）

**なぜ**
デプロイ後の最初のタスクは「まずクライアントを接続」ではなく、まず健康状態を迅速に判断できるエントリポイントを確立することです。

1) ヘルスチェック（リバースプロキシサービスが `/healthz` を提供）：

```bash
curl -i http://127.0.0.1:8045/healthz
```

2) ログ確認：

```bash
## Docker
cd deploy/docker
docker compose logs -f

## Headless Xvfb
tail -f /opt/antigravity/logs/app.log
```

**期待される結果**：
- `/healthz` が 200 を返す（具体的なレスポンスボディは実装依存）
- ログにリバースプロキシサービス起動情報が見える

### ステップ 7：アップグレード戦略（「自動更新」を唯一のソリューションにしない）

**なぜ**
アップグレードは最も「システムをアップグレードして使用不能にする」アクションです。各方式のアップグレードが実際に何をしているかを知る必要があります。

- Docker：コンテナ起動時に GitHub API 経由で最新の `.deb` をプルしてインストールを試みる（レート制限やネットワーク異常の場合は、キャッシュされたバージョンを継続使用）。
- Headless Xvfb：`upgrade.sh` で最新の AppImage をプルし、再起動失敗時にバックアップにロールバック。

Headless Xvfb アップグレードコマンド（プロジェクト README）：

```bash
cd /opt/antigravity
sudo ./upgrade.sh
```

**期待される結果**：
- `アップグレード: v<current> -> v<latest>` のような出力
- アップグレード後もサービスが active（スクリプトは `systemctl restart antigravity` を実行し、状態をチェック）

## よくある落とし穴

| シナリオ | よくある間違い（❌） | 推奨される方法（✓） |
| --- | --- | --- |
| アカウント/設定が消失 | ❌ 「プログラムが動けばいい」としか考えない | ✓ まず `.antigravity_tools/` が永続化されているか確認（volume または `/opt/antigravity`） |
| noVNC ポート変更が反映されない | ❌ `NOVNC_PORT` しか変更しない | ✓ デフォルト 6080 を維持；変更するなら `start.sh` 内の `websockify` ポートも同時に確認 |
| 8045 をインターネットに公開 | ❌ `api_key` を設定しない / auth_mode を確認しない | ✓ まず **[セキュリティとプライバシー](/ja/lbjlaq/Antigravity-Manager/advanced/security/)** でベースラインを作り、その後トンネル/リバースプロキシを検討 |

## このレッスンのまとめ

- Docker/noVNC は「サーバーにブラウザ/デスクトップがないが認証が必要」な問題を解決し、NAS シナリオに最適
- Headless Xvfb は標準運用に近い：固定ディレクトリ、systemd 管理、スクリプトアップグレード/ロールバック
- どちらの方式でも、まずループを正しく構築：データ → ヘルスチェック → ログ → バックアップ → アップグレード

## おすすめ関連記事

- サービスを LAN/インターネットに公開したい場合：**[セキュリティとプライバシー：auth_mode、allow_lan_access](/ja/lbjlaq/Antigravity-Manager/advanced/security/)**
- デプロイ後に 401 が発生：**[401/認証失敗：auth_mode、Header 互換性とクライアント設定チェックリスト](/ja/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- トンネルでサービスを公開したい場合：**[Cloudflared ワンクリックトンネル](/ja/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**

---

## 付録：ソースコード参考

<details>
<summary><strong>クリックしてソースコードの位置を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Docker デプロイメントエントリと noVNC URL | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L5-L13) | 5-13 |
| Docker デプロイ環境変数説明（VNC_PASSWORD/RESOLUTION/NOVNC_PORT） | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L32-L39) | 32-39 |
| Docker compose ポートマッピングとデータボリューム（antigravity_data） | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L21) | 1-21 |
| Docker 起動スクリプト：バージョン自動更新（GitHub rate limit） | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L27-L58) | 27-58 |
| Docker 起動スクリプト：Xtigervnc/Openbox/noVNC/アプリ起動 | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L60-L78) | 60-78 |
| Docker ヘルスチェック：Xtigervnc/websockify/antigravity_tools プロセス存在確認 | [`deploy/docker/Dockerfile`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/Dockerfile#L60-L79) | 60-79 |
| Headless Xvfb：ディレクトリ構造と運用コマンド（systemctl/healthz） | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L19-L78) | 19-78 |
| Headless Xvfb：install.sh 依存関係インストールと gui_config.json 初期化（デフォルト 8045） | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L16-L67) | 16-67 |
| Headless Xvfb：sync.sh ローカルデータディレクトリ自動検出と rsync でサーバーに転送 | [`deploy/headless-xvfb/sync.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/sync.sh#L8-L32) | 8-32 |
| Headless Xvfb：upgrade.sh 新バージョンダウンロードと失敗時にロールバック | [`deploy/headless-xvfb/upgrade.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/upgrade.sh#L11-L51) | 11-51 |
| リバースプロキシサービスヘルスチェックエンドポイント `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |

</details>
