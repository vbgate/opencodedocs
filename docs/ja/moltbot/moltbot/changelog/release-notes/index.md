---
title: "バージョン更新ログ：新機能、改善、破壊的変更を理解する | Clawdbot チュートリアル"
sidebarTitle: "新バージョンの内容"
subtitle: "バージョン更新ログ：新機能、改善、破壊的変更を理解する"
description: "Clawdbot のバージョン更新履歴を学び、各バージョンの新機能、改善、修正、破壊的変更を理解します。このチュートリアルはユーザーが機能の進化を追跡し、最新の機能とセキュリティ修正を得るためにシステムを更新し続けるのに役立ちます。"
tags:
  - "更新ログ"
  - "バージョン履歴"
  - "changelog"
prerequisite: []
order: 380
---

# バージョン更新ログ：新機能、改善、破壊的変更を理解する

Clawdbot は継続的に反復更新履歴を維持しており、各バージョンは新機能、パフォーマンス改善、セキュリティ強化をもたらします。このログはバージョンの進化を素早く理解し、いつアップグレードするか、およびアップグレード時に何に注意すべきかを決定するのに役立ちます。

## 学習後の成果

- 最新バージョンの新機能とハイライトを理解する
- 各バージョンの破壊的変更を把握し、アップグレードの中断を回避する
- 問題修正リストを確認し、自分の問題が解決済みかを確認する
- 機能の進化ロードマップを追跡し、新機能の使用を計画する

::: tip バージョン番号の説明
バージョン番号形式：`YYYY.M.D`（年.月.日）

- **メジャーバージョン**：年または月の数字の変化は通常、主要な機能更新を表します
- **パッチバージョン**：`-1`、`-2`、`-3` は修正バージョンを表し、バグ修正のみを含みます
:::

---

## 2026.1.25
**ステータス**：未リリース

### ハイライト（Highlights）

なし

### 変更（Changes）

- **Agents**：exec allowlist チェックで `tools.exec.safeBins` を遵守する (#2281)
- **Docs**：Fly プライベートデプロイ手順を厳密化する (#2289) - 感謝 @dguido
- **Gateway**：クエリパラメータ経由で渡される hook token について警告を発する；header 認証方式を文書化する (#2200) - 感謝 @YuriNachos
- **Gateway**：危険な Control UI デバイス認証バイパスフラグ + 監査警告を追加する (#2248)
- **Doctor**：認証なしの gateway が公開されている場合に警告を発する (#2016) - 感謝 @Alex-Alaniz
- **Discord**：設定可能な特権 gateway intents（presences/members）を追加する (#2266) - 感謝 @kentaro
- **Docs**：プロバイダーサイドバーに Vercel AI Gateway を追加する (#1901) - 感謝 @jerilynzheng
- **Agents**：cron ツールの説明を拡張し、完全な schema ドキュメントを含める (#1988) - 感謝 @tomascupr
- **Skills**：GitHub、Notion、Slack、Discord の欠落している依存関係メタデータを追加する (#1995) - 感謝 @jackheuberger
- **Docs**：Render デプロイガイドを追加する (#1975) - 感謝 @anurag
- **Docs**：Claude Max API プロキシガイドを追加する (#1875) - 感謝 @atalovesyou
- **Docs**：DigitalOcean デプロイガイドを追加する (#1870) - 感謝 @0xJonHoldsCrypto
- **Docs**：Raspberry Pi インストールガイドを追加する (#1871) - 感謝 @0xJonHoldsCrypto
- **Docs**：GCP Compute Engine デプロイガイドを追加する (#1848) - 感謝 @hougangdev
- **Docs**：LINE チャネルガイドを追加する - 感謝 @thewilloftheshadow
- **Docs**：Control UI の更新に 2 人の貢献者を帰属させる (#1852) - 感謝 @EnzeD
- **Onboarding**：Venice API key を非対話型フローに追加する (#1893) - 感謝 @jonisjongithub
- **Onboarding**：ベータ版セキュリティ警告文案を強化 + アクセス制御の期待値
- **Tlon**：スレッド返信 ID を `@ud` 形式にフォーマットする (#1837) - 感謝 @wca4a
- **Gateway**：ストレージをマージする際、最新のセッションメタデータを優先する (#1823) - 感謝 @emanuelst
- **Web UI**：WebChat でサブ agent 通知返信を可視のままに保つ (#1977) - 感謝 @andrescardonas7
- **CI**：macOS チェックの Node ヒープサイズを増やす (#1890) - 感謝 @realZachi
- **macOS**：Textual を 0.3.1 にアップグレードしてコードブロックのレンダリング時のクラッシュを回避する (#2033) - 感謝 @garricn
- **Browser**：拡張リレーターゲット解決のために URL マッチングにロールバックする (#1999) - 感謝 @jonit-dev
- **Update**：ダーティチェックで dist/control-ui を無視し、UI ビルド後に復元する (#1976) - 感謝 @Glucksberg
- **Telegram**：メディア送信時に caption パラメータの使用を許可する (#1888) - 感謝 @mguellsegarra
- **Telegram**：プラグイン sendPayload channelData（メディア/ボタン）をサポートし、プラグインコマンドを検証する (#1917) - 感謝 @JoshuaLelon
- **Telegram**：ストリーミングが無効な場合、ブロック返信を回避する (#1885) - 感謝 @ivancasco
- **Auth**：ASCII プロンプト後にコピー可能な Google auth URL を表示する (#1787) - 感謝 @robbyczgw-cla
- **Routing**：セッションキー正規表現をプリコンパイルする (#1697) - 感謝 @Ray0907
- **TUI**：選択リストのレンダリング時に幅オーバーフローを回避する (#1686) - 感謝 @mossein
- **Telegram**：再起動センチネル通知でスレッド ID を保持する (#1807) - 感謝 @hsrvc
- **Config**：`${VAR}` 置換の前に `config.env` を適用する (#1813) - 感謝 @spanishflu-est1918
- **Slack**：ストリーミング返信後に ack リアクションをクリアする (#2044) - 感謝 @fancyboi999
- **macOS**：リモートターゲットでカスタム SSH ユーザー名を保持する (#2046) - 感謝 @algal

### 修正（Fixes）

- **Telegram**：reasoning イタリックを各行でラップして生のアンダースコアを回避する (#2181) - 感謝 @YuriNachos
- **Voice Call**：ngrok URL に対して Twilio webhook 署名検証を強制する；デフォルトで ngrok 無料層バイパスを無効化する
- **Security**：信頼する headers の前にローカル tailscaled のアイデンティティを検証することで Tailscale Serve 認証を強化する
- **Build**：memory-core ピア依存関係をロックファイルと整合させる
- **Security**：情報漏洩を減らすためにデフォルトで最小化された mDNS 発見モードを追加する (#1882) - 感謝 @orlyjamie
- **Security**：DNS ピニングで URL 取得を強化してリバインディングリスクを減らす - 感謝 Chris Zheng
- **Web UI**：WebChat 画像貼り付けプレビューを改善し、画像のみの送信を許可する (#1925) - 感謝 @smartprogrammer93
- **Security**：デフォルトで per-hook 終了オプションで外部 hook コンテンツをラップする (#1827) - 感謝 @mertcicekci0
- **Gateway**：デフォルト認証は失敗時に閉じる（token/password が必要；Tailscale Serve アイデンティティはまだ許可される）
- **Onboarding**：onboarding/configure フローと CLI フラグからサポートされていない gateway auth "off" 選択を削除する

---

## 2026.1.24-3

### 修正（Fixes）

- **Slack**：クロスドメインリダイレクト時に Authorization header が欠落していることによる画像ダウンロード失敗を修正する (#1936) - 感謝 @sanderhelgesen
- **Gateway**：ローカルクライアント検出と認証なしプロキシ接続のリバースプロキシ処理を強化する (#1795) - 感謝 @orlyjamie
- **Security audit**：認証が無効な loopback Control UI をクリティカルとしてマークする (#1795) - 感謝 @orlyjamie
- **CLI**：claude-cli セッションを復元し、CLI 返信を TUI クライアントにストリーミングする (#1921) - 感謝 @rmorse

---

## 2026.1.24-2

### 修正（Fixes）

- **Packaging**：npm tarball に dist/link-understanding 出力を含める（インストール時に欠落している apply.js インポートを修正）

---

## 2026.1.24-1

### 修正（Fixes）

- **Packaging**：npm tarball に dist/shared 出力を含める（インストール時に欠落している reasoning-tags インポートを修正）

---

## 2026.1.24

### ハイライト（Highlights）

- **Providers**：Ollama 発見 + ドキュメント；Venice ガイドアップグレード + クロスリンク (#1606) - 感謝 @abhaymundhara
- **Channels**：LINE プラグイン（Messaging API）がリッチ返信 + クイック返信をサポート (#1630) - 感謝 @plum-dawg
- **TTS**：Edge フォールバック（key なし）+ `/tts` 自動モード (#1668, #1667) - 感謝 @steipete, @sebslight
- **Exec approvals**：`/approve` ですべてのチャネル（プラグインを含む）でチャット内承認を行う (#1621) - 感謝 @czekaj
- **Telegram**：DM スレッドを独立したセッションとして扱う + 送信リンクプレビュー切り替え (#1597, #1700) - 感謝 @rohannagpal, @zerone0x

### 変更（Changes）

- **Channels**：LINE プラグイン（Messaging API）を追加し、リッチ返信、クイック返信、プラグイン HTTP レジストリをサポートする (#1630) - 感謝 @plum-dawg
- **TTS**：Edge TTS プロバイダーフォールバックを追加し、デフォルトで key なしの Edge を使用し、フォーマット失敗時に MP3 を再試行する (#1668) - 感謝 @steipete
- **TTS**：自動モード列挙（off/always/inbound/tagged）を追加し、セッションごとの `/tts` オーバーライドをサポートする (#1667) - 感謝 @sebslight
- **Telegram**：DM スレッドを独立したセッションとして扱い、スレッドサフィックスを使用して DM 履歴制限を安定させる (#1597) - 感謝 @rohannagpal
- **Telegram**：`channels.telegram.linkPreview` を追加して送信リンクプレビューを切り替える (#1700) - 感謝 @zerone0x
- **Web search**：時間限定結果のために Brave 新鮮度フィルターパラメータを追加する (#1688) - 感謝 @JonUleis
- **UI**：Control UI ダッシュボードデザインシステム（色、アイコン、タイポグラフィ）を更新する (#1745, #1786) - 感謝 @EnzeD, @mousberg
- **Exec approvals**：承認プロンプトをチャットに転送し、`/approve` ですべてのチャネル（プラグインを含む）をサポートする (#1621) - 感謝 @czekaj
- **Gateway**：gateway ツールで `config.patch` を公開し、安全な部分更新 + 再起動センチネルをサポートする (#1653) - 感謝 @Glucksberg
- **Diagnostics**：デバッグログの方向付けのための診断フラグを追加する（config + env オーバーライド）
- **Docs**：FAQ を拡張する（移行、スケジューリング、並行処理、モデル推奨、OpenAI サブスクリプション認証、Pi サイズ、ハッカブルインストール、docs SSL 回避策）
- **Docs**：詳細なインストーラトラブルシューティングガイドを追加する
- **Docs**：macOS VM ガイドを追加し、ローカル/ホストオプション + VPS/ノードガイダンスを含める (#1693) - 感謝 @f-trycua
- **Docs**：Bedrock EC2 インスタンスロール設定 + IAM 手順を追加する (#1625) - 感謝 @sergical
- **Docs**：Fly.io ガイドの説明を更新する
- **Dev**：prek pre-commit hooks + 依存関係の週次更新設定を追加する (#1720) - 感謝 @dguido

### 修正（Fixes）

- **Web UI**：config/debug レイアウトオーバーフロー、スクロール、コードブロックサイズを修正する (#1715) - 感謝 @saipreetham589
- **Web UI**：アクティブ実行中に停止ボタンを表示し、アイドル時に新規セッションに切り替える (#1664) - 感謝 @ndbroadbent
- **Web UI**：再接続時に古い切断バナーをクリアする；schema パスをサポートしないフォームの保存を許可するが、欠落している schema をブロックする (#1707) - 感謝 @Glucksberg
- **Web UI**：チャットバブルで内部 `message_id` ヒントを非表示にする
- **Gateway**：Control UI のみトークン認証がデバイスペアリングをスキップすることを許可する（デバイスアイデンティティが存在しても）（`gateway.controlUi.allowInsecureAuth`）(#1679) - 感謝 @steipete
- **Matrix**：事前サイズチェックで E2EE メディア添付ファイルの復号を保護する (#1744) - 感謝 @araa47
- **BlueBubbles**：電話番号ターゲットを DM にルーティングし、ルーティング ID の漏洩を回避し、欠落している DM を自動作成する（Private API が必要）(#1751) - 感謝 @tyler6204
- **BlueBubbles**：短い ID が欠落している場合、返信タグで part-index GUID を保持する
- **iMessage**：chat_id/chat_guid/chat_identifier プレフィックスを大文字小文字を区別せずに正規化し、サービスプレプレフィックスハンドルを安定させる (#1708) - 感謝 @aaronn
- **Signal**：リアクション送信を修正する（group/UUID ターゲット + CLI 著者フラグ）(#1651) - 感謝 @vilkasdev
- **Signal**：設定可能な signal-cli 起動タイムアウト + 外部デーモンモードドキュメントを追加する (#1677)
- **Telegram**：Node 22 でアップロードに fetch duplex="half" を設定して sendPhoto 失敗を回避する (#1684) - 感謝 @commdata2338
- **Telegram**：Node でラップされた fetch を使用してロングポーリングを行い、AbortSignal 処理を正規化する (#1639)
- **Telegram**：送信 API 呼び出しでアカウントごとのプロキシを遵守する (#1774) - 感謝 @radek-paclt
- **Telegram**：ボイスノートがプライバシー設定でブロックされている場合、テキストにフォールバックする (#1725) - 感謝 @foeken
- **Voice Call**：初期 Twilio webhook で送信セッション呼び出しのためにストリーミング TwiML を返す (#1634)
- **Voice Call**：Twilio TTS 再生をシリアライズし、割り込み時にキャンセルして重複を防ぐ (#1713) - 感謝 @dguido
- **Google Chat**：メール allowlist マッチング、入力のクリーンアップ、メディア上限、onboarding/docs/tests を厳密化する (#1635) - 感謝 @iHildy
- **Google Chat**：二重 `spaces/` プレフィックスなしのスペースターゲットを正規化する
- **Agents**：コンテキストオーバーフロープロンプトエラー時に自動圧縮する (#1627) - 感謝 @rodrigouroz
- **Agents**：自動圧縮復元にアクティブな auth プロファイルを使用する
- **Media understanding**：メインモデルがすでにビジョンをサポートしている場合、画像理解をスキップする (#1747) - 感謝 @tyler6204
- **Models**：カスタムプロバイダーフィールドの欠落値をデフォルト化して、最小設定を受け入れる
- **Messaging**：改行ブロック分割をチャネル間のフェンスマークダウンブロックに対して安全に保つ
- **Messaging**：改行ブロックを段落認識（空行分割）として処理し、リストと見出しを一緒に保つ (#1726) - 感謝 @tyler6204
- **TUI**：gateway 再接続後に履歴を再ロードしてセッション状態を復元する (#1663)
- **Heartbeat**：ターゲット識別子を正規化してルーティングの一貫性を保つ
- **Exec**：完全モードでない限り、エスカレートされた ask の承認を保持する (#1616) - 感謝 @ivancasco
- **Exec**：Windows プラットフォームタグをノードシェル選択のために Windows として扱う (#1760) - 感謝 @ymat19
- **Gateway**：サービスインストール環境にインライン設定 env 変数を含める (#1735) - 感謝 @Seredeep
- **Gateway**：tailscale.mode が off の場合、Tailscale DNS プローブをスキップする (#1671)
- **Gateway**：遅延呼び出し + リモートノードプローブのログノイズを減らす；スキルリフレッシュをデバウンスする (#1607) - 感謝 @petter-b
- **Gateway**：トークンが欠落している Control UI/WebChat 認証エラーヒントを明確にする (#1690)
- **Gateway**：127.0.0.1 にバインドする場合、IPv6 loopback をリッスンして localhost webhooks を動作させる
- **Gateway**：ロックファイルを一時ディレクトリに保存して永続ボリューム上の古いロックを回避する (#1676)
- **macOS**：`ws://` URL 直接転送はデフォルトでポート 18789；`gateway.remote.transport` を文書化する (#1603) - 感謝 @ngutman
- **Tests**：CI macOS で Vitest ワーカーを制限してタイムアウトを減らす (#1597) - 感謝 @rohannagpal
- **Tests**：組み込みランナーストリームシミュレーションで fake-timer 依存関係を回避して CI 不安定を減らす (#1597) - 感謝 @rohannagpal
- **Tests**：組み込みランナーソートテストタイムアウトを増やして CI 不安定を減らす (#1597) - 感謝 @rohannagpal

---

## 2026.1.23-1

### 修正（Fixes）

- **Packaging**：npm tarball に dist/tts 出力を含める（欠落している dist/tts/tts.js を修正）

---

## 2026.1.23

### ハイライト（Highlights）

- **TTS**：Telegram TTS をコアに移動 + 表現力豊かな音声返信をサポートするためにモデル駆動 TTS タグをデフォルトで有効化する (#1559) - 感謝 @Glucksberg
- **Gateway**：直接ツール呼び出しのために `/tools/invoke` HTTP エンドポイントを追加する（認証 + ツールポリシーを強制）(#1575) - 感謝 @vignesh07
- **Heartbeat**：チャネルごとの可視性制御（OK/alerts/indicator）(#1452) - 感謝 @dlauer
- **Deploy**：Fly.io デプロイサポート + ガイドを追加する (#1570)
- **Channels**：Tlon/Urbit チャネルプラグインを追加する（DM、グループメンション、スレッド返信）(#1544) - 感謝 @wca4a

### 変更（Changes）

- **Channels**：組み込み + プラグインチャネルでツールグループごとの許可/拒否ポリシーを許可する (#1546) - 感謝 @adam91holt
- **Agents**：Bedrock 自動発見デフォルト + 設定オーバーライドを追加する (#1553) - 感謝 @fal3
- **CLI**：システムイベント + ハートビート制御のために `clawdbot system` を追加する；独立した `wake` を削除する
- **CLI**：設定ファイルごとの検証のために `clawdbot models status` にリアルタイム認証プローブを追加する
- **CLI**：`clawdbot update` 後にデフォルトで gateway を再起動する；スキップするために `--no-restart` を追加する
- **Browser**：リモート gateway のためにノードホストプロキシ自動ルーティングを追加する（gateway/node ごとに設定可能）
- **Plugins**：ワークフローのためにオプションの `llm-task` JSON-only ツールを追加する (#1498) - 感謝 @vignesh07
- **Markdown**：チャネルごとのテーブル変換を追加する（Signal/WhatsApp は箇条書きを使用、他はコードブロック）(#1495) - 感謝 @odysseus0
- **Agents**：システムプロンプトをタイムゾーンのみに保ち、現在時刻を `session_status` に移動してより良いキャッシュヒットを得る
- **Agents**：ツール登録/表示から冗長な bash ツールエイリアスを削除する (#1571) - 感謝 @Takhoffman
- **Docs**：cron vs heartbeat 決定ガイドを追加する（Lobster ワークフローノートを含む）(#1533) - 感謝 @JustYannicc
- **Docs**：空の HEARTBEAT.md ファイルがハートビートをスキップし、欠落ファイルはまだ実行されることを明確にする (#1535) - 感謝 @JustYannicc

### 修正（Fixes）

- **Sessions**：履歴/送信/状態のために非 UUID sessionIds を受け入れ、agent スコープを保持する
- **Heartbeat**：ハートビートターゲット検証 + UI ヒントのためにプラグイン channel ids を受け入れる
- **Messaging/Sessions**：送信送信をターゲットセッションキー（スレッド + dmScope）にミラーし、送信時にセッションエントリを作成し、セッションキーの大文字小文字を正規化する (#1520)
- **Sessions**：配列サポートセッションストレージを拒否してサイレント消去を防ぐ (#1469)
- **Gateway**：Linux プロセス起動時間を比較して PID リサイクルロックループを回避する；古くない限りロックを保持する (#1572) - 感謝 @steipete
- **Gateway**：exec 承認リクエストで null オプションフィールドを受け入れる (#1511) - 感謝 @pvoo
- **Exec approvals**：allowlist エントリ id を永続化して macOS allowlist 行動を安定させる (#1521) - 感謝 @ngutman
- **Exec**：エスカレートされた承認のために tools.exec ask/security デフォルトを遵守する（不要なプロンプトを回避）
- **Daemon**：最小サービスパスを構築する際にプラットフォーム PATH 区切り文字を使用する
- **Linux**：systemd PATH に env 設定のユーザー bin ルートディレクトリを含め、PATH 監査と整合させる (#1512) - 感謝 @robbyczgw-cla
- **Tailscale**：権限エラーの場合のみ sudo で serve/funnel を再試行し、元の失敗詳細を保持する (#1551) - 感謝 @sweepies
- **Docker**：docker-compose と Hetzner ガイドの gateway コマンドを更新する (#1514)
- **Agents**：最後のアシスタントターンがツールのみを呼び出す場合、ツールエラーフォールバックを表示する（サイレント停止を防ぐ）
- **Agents**：アイデンティティの解析時に IDENTITY.md テンプレートプレースホルダーを無視する (#1556)
- **Agents**：モデル切り替え時に孤立した OpenAI Responses reasoning ブロックを削除する (#1562) - 感謝 @roshanasingh4
- **Agents**："agent が返信前に失敗しました" メッセージに CLI ログヒントを追加する (#1550) - 感謝 @sweepies
- **Agents**：不明またはロードされていないプラグインツールのみを参照するツール allowlists について警告し、無視する (#1566)
- **Agents**：プラグインのみツール allowlists をオプトインとして扱う；コアツールを有効に保つ (#1467)
- **Agents**：テストでのキューデッドロックを回避するために組み込み実行の enqueue オーバーライドを遵守する
- **Slack**：メッセージ + slash ゲートの未リストチャネルのために開かれた groupPolicy を遵守する (#1563) - 感謝 @itsjaydesu
- **Discord**：自動スレッドメンションバイパスを bot が所有するスレッドに制限する；ack リアクションメンションゲートを保持する (#1511) - 感謝 @pvoo
- **Discord**：レート制限された allowlist 解析 + コマンドデプロイを再試行して gateway クラッシュを回避する
- **Mentions**：グループチャットで別の明示的なメンションが存在する場合、mentionPattern マッチを無視する（Slack/Discord/Telegram/WhatsApp）
- **Telegram**：メディアキャプションで markdown をレンダリングする (#1478)
- **MS Teams**：Graph スコープと Bot Framework プローブスコープから `.default` サフィックスを削除する (#1507, #1574) - 感謝 @Evizero
- **Browser**：拡張がタブ切り替え後にセッション id を再利用する場合、拡張リレータブを制御可能に保つ (#1160)
- **Voice wake**：あいまい/コミット時に iOS/Android でウェイクワードを自動保存し、macOS と制限を整合させる
- **UI**：長いページをスクロールする際、Control UI サイドバーを可視に保つ (#1515) - 感謝 @pookNast
- **UI**：Control UI markdown レンダリングをキャッシュ + チャットテキスト抽出をメモ化して Safari 入力ジッターを減らす
- **TUI**：不明なスラッシュコマンドを転送し、自動補完に Gateway コマンドを含め、スラッシュ返信をシステム出力としてレンダリングする
- **CLI**：認証プローブ出力を洗練する（テーブル出力、インラインエラー、ノイズ削減、`clawdbot models status` での改行修正）
- **Media**：行の先頭にある場合のみ `MEDIA:` タグを解析し、散文メンションのストリップを回避する (#1206)
- **Media**：可能な限り PNG アルファを保持する；まだサイズ上限を超える場合 JPEG にフォールバックする (#1491) - 感謝 @robbyczgw-cla
- **Skills**：bird Homebrew インストールを macOS にゲートする (#1569) - 感謝 @bradleypriest

---

## 更新推奨

### アップグレード前の確認

新しいバージョンにアップグレードする前に、以下をお勧めします：

1. **破壊的変更を読む**：設定に影響する破壊的変更があるか確認する
2. **設定をバックアップする**：`~/.clawdbot/clawdbot.json` をバックアップする
3. **診断を実行する**：`clawdbot doctor` で現在のシステム状態が健全であることを確認する
4. **依存関係を確認する**：Node.js バージョンが要件を満たしていることを確認する（≥22）

### アップグレード後の検証

アップグレード完了後、以下の検証を実行します：

```bash
# 1. バージョンを確認する
clawdbot --version

# 2. ステータスを確認する
clawdbot status

# 3. チャネル接続を検証する
clawdbot channels status

# 4. メッセージ送信をテストする
clawdbot message "Hello" --target=<your-channel>
```

### 完全な更新ログを表示する

より詳細なバージョン履歴と issue リンクを表示するには、以下を参照してください：

- **GitHub Releases**：https://github.com/moltbot/moltbot/releases
- **公式ドキュメント**：https://docs.clawd.bot

---

## 過去のバージョン

より古いバージョンの更新を表示するには、[GitHub Releases](https://github.com/moltbot/moltbot/releases) またはプロジェクトルートディレクトリの [CHANGELOG.md](https://github.com/moltbot/moltbot/blob/main/CHANGELOG.md) を参照してください。

::: tip 貢献に参加する
バグを発見した場合や機能提案がある場合は、[GitHub Issues](https://github.com/moltbot/moltbot/issues) に送信してください。
:::
