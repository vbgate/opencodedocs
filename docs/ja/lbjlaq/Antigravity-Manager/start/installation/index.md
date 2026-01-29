---
title: "インストール: Homebrew と Releases デプロイ | Antigravity Manager"
sidebarTitle: "5 分でインストール"
subtitle: "インストールとアップグレード：デスクトップ版最適インストールパス（brew / releases）"
description: "Antigravity Tools の Homebrew と Releases インストール方法を学びます。5 分以内にデプロイを完了し、macOS quarantine 問題とアプリケーション破損の一般的なエラーを処理し、アップグレードプロセスをマスターします。"
tags:
  - "インストール"
  - "アップグレード"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 2
---

# インストールとアップグレード：デスクトップ版最適インストールパス（brew / releases）

Antigravity Tools を迅速にインストールし、後続のコースを実行できるようにしたい場合、このレッスンでは 1 つのことだけを行います：「インストール + 開ける + アップグレード方法を知る」を明確にします。

## 学習後にできること

- 正しいインストールパスを選択：優先 Homebrew、次に GitHub Releases
- macOS 一般的なブロック（quarantine / 「アプリケーションが破損しています」）を処理
- 特殊な環境でのインストール：Arch スクリプト、Headless Xvfb、Docker
- 各インストール方法のアップグレード入口と自己検査方法を知る

## 現在の課題

- ドキュメントにインストール方法が多すぎ、どれを選ぶべきかわからない
- macOS ダウンロード後に開けず、「破損/開けません」と表示される
- NAS/サーバーで実行しており、デスクトップがなく、認証も不便

## いつこの方法を使用するか

- 初めて Antigravity Tools をインストールする場合
- コンピュータ変更/システム再インストール後に環境を復元する場合
- バージョンアップグレード後にシステムブロックまたは起動異常に遭遇する場合

::: warning 前提知識
Antigravity Tools がどのような問題を解決するかまだ確実ではない場合、最初に **[Antigravity Tools とは](/ja/lbjlaq/Antigravity-Manager/start/getting-started/)** を見てから戻ってくると、スムーズです。
:::

## コアアイデア

「デスクトップ優先、サーバーはその後」の順序で選択することを推奨します：

1. デスクトップ版（macOS/Linux）：Homebrew でインストール（最も速く、アップグレードも最も簡単）
2. デスクトップ版（全プラットフォーム）：GitHub Releases からダウンロード（brew をインストールしたくない、またはネットワークが制限されている場合に適している）
3. サーバー/NAS：優先 Docker。次に Headless Xvfb（サーバーでデスクトップアプリを実行するような）

## 手順に従って進める

### ステップ 1：まずインストール方法を選択する

**なぜ**
異なるインストール方法の「アップグレード/ロールバック/トラブルシューティング」コストは大きく異なり、最初にパスを選択すると、遠回りを減らせます。

**推奨**：

| シナリオ | 推奨インストール方法 |
|--- | ---|
| macOS / Linux デスクトップ | Homebrew（オプション A） |
| Windows デスクトップ | GitHub Releases（オプション B） |
| Arch Linux | 公式スクリプト（Arch オプション） |
| リモートサーバーデスクトップなし | Docker（オプション D）または Headless Xvfb（オプション C-Headless） |

**次のように表示されます**：自分がどの行に属するかを明確にできます。

### ステップ 2：Homebrew でインストールする（macOS / Linux）

**なぜ**
Homebrew は「ダウンロードとインストールを自動処理」するパスであり、アップグレードも最も簡単です。

```bash
#1) このリポジトリの Tap を購読
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

#2) アプリケーションをインストール
brew install --cask antigravity-tools
```

::: tip macOS 権限通知
README では：macOS で権限/隔離関連の問題に遭遇した場合、次のように変更できます：

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**次のように表示されます**：`brew` がインストール成功を出力し、システムに Antigravity Tools アプリケーションが表示されます。

### ステップ 3：GitHub Releases から手動インストールする（macOS / Windows / Linux）

**なぜ**
Homebrew を使用しない、またはインストールパッケージのソースを自分で制御したい場合、このパスが最も直接的です。

1. プロジェクト Releases ページを開きます：`https://github.com/lbjlaq/Antigravity-Manager/releases`
2. システムに一致するインストールパッケージを選択します：
   - macOS：`.dmg`（Apple Silicon / Intel）
   - Windows：`.msi` またはポータブル版 `.zip`
   - Linux：`.deb` または `AppImage`
3. システムインストーラの指示に従ってインストールを完了します

**次のように表示されます**：インストール完了後、システムアプリケーションリストで Antigravity Tools を見つけ、起動できます。

### ステップ 4：macOS 「アプリケーションが破損しています、開けません」の処理

**なぜ**
README はこのシナリオの修復方法を明確に提供しています。同じ通知に遭遇した場合、直接その通りに実行できます。

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**次のように表示されます**：アプリケーションを再起動すると、「破損/開けません」のブロック通知は表示されなくなります。

### ステップ 5：アップグレード（インストール方法に応じて選択）

**なぜ**
アップグレードで最もつまずきやすいのは「インストール方法が変わった」ことです。どこを更新すればいいかわからなくなります。

::: code-group

```bash [Homebrew]
#アップグレード前に tap 情報を更新
brew update

#cask をアップグレード
brew upgrade --cask antigravity-tools
```

```text [Releases]
最新バージョンのインストールパッケージ（.dmg/.msi/.deb/AppImage）を再ダウンロードし、システム指示に従って上書きインストールするだけです。
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

#README は、コンテナ起動時に最新の release をプルしようとすることを説明しています。最も簡単なアップグレード方法はコンテナを再起動することです
docker compose restart
```

:::

**次のように表示されます**：アップグレード完了後、アプリケーションは正常に起動を続けます。Docker/Headless を使用している場合、活性化エンドポイントにアクセスし続けることもできます。

## その他のインストール方法（特定のシナリオ）

### Arch Linux：公式ワンクリックインストールスクリプト

README は Arch スクリプト入口を提供します：

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details このスクリプトは何をしますか？
GitHub API を通じて最新の release を取得し、`.deb` アセットをダウンロードして SHA256 を計算し、PKGBUILD を生成して `makepkg -si` でインストールします。
:::

### リモートサーバー：Headless Xvfb

GUI がない Linux サーバーで GUI アプリケーションを実行する必要がある場合、プロジェクトは Xvfb デプロイを提供します：

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

インストール完了後、ドキュメントが提供する一般的な自己検査コマンドには次が含まれます：

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/サーバー：Docker（ブラウザ VNC 付き）

Docker デプロイはブラウザで noVNC を提供し（OAuth/認証操作に便利）、同時にプロキシポートをマッピングします：

```bash
cd deploy/docker
docker compose up -d
```

`http://localhost:6080/vnc_lite.html` にアクセスできます。

## トラブルシューティング

- brew インストール失敗：まず Homebrew がインストールされていることを確認し、README の `brew tap` / `brew install --cask` を再試行してください
- macOS で開けない：まず `--no-quarantine` を試してください。インストール済みの場合、`xattr` で quarantine をクリアしてください
- サーバーデプロイの制限：Headless Xvfb は本質的に「仮想ディスプレイでデスクトッププログラムを実行する」ため、リソース使用は純粋なバックエンドサービスよりも高くなります

## このレッスンのまとめ

- デスクトップ版最も推奨：Homebrew（インストールとアップグレードが簡単）
- brew を使用しない：GitHub Releases を直接使用
- サーバー/NAS：優先 Docker。systemd 管理が必要な場合は Headless Xvfb

## 次のレッスン予告

次のレッスンでは、「開ける」をさらに一歩進めます：**[データディレクトリ、ログ、トレイと自動起動](/ja/lbjlaq/Antigravity-Manager/start/first-run-data/)** を明確にすると、問題に遭遇したときにどこから調べるかわかります。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-23

| トピック | ファイルパス | 行番号 |
|--- | --- | ---|
| Homebrew インストール（tap + cask） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L112-L127) | 112-127 |
| Releases 手動ダウンロード（各プラットフォームインストールパッケージ） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
| Arch ワンクリックインストールスクリプト入口 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L134-L140) | 134-140 |
| Arch インストールスクリプト実装（GitHub API + makepkg） | [`deploy/arch/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/arch/install.sh#L1-L56) | 1-56 |
| Headless Xvfb インストール入口（curl | sudo bash） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
| Headless Xvfb デプロイ/アップグレード/運用コマンド | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L1-L99) | 1-99 |
| Headless Xvfb install.sh（systemd + 8045 デフォルト設定） | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
|--- | --- | ---|
| Docker デプロイ説明（noVNC 6080 / プロキシ 8045） | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L1-L35) | 1-35 |
| Docker ポート/データボリューム設定（8045 + antigravity_data） | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L25) | 1-25 |
|--- | --- | ---|

</details>
