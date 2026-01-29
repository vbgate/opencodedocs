---
title: "トラブルシューティング：Gateway起動、チャンネル接続、認証エラーなどの問題解決 | Clawdbotチュートリアル"
sidebarTitle: "問題が発生したら"
subtitle: "トラブルシューティング：よくある問題の解決"
description: "Clawdbotのよくある問題の解決方法を学びます。Gateway起動失敗、チャンネル接続問題、認証エラー、ツール呼び出し失敗、セッション管理、パフォーマンス最適化などの包括的なトラブルシューティングガイドを網羅しています。"
tags:
  - "トラブルシューティング"
  - "診断"
  - "よくある質問"
prerequisite: []
order: 310
---

# トラブルシューティング：よくある問題の解決

Clawdbotで問題が発生しましたか？慌てないでください。ここには体系的な**トラブルシューティング**方法があります。このチュートリアルは、問題を迅速に特定し、解決策を見つけるのに役立ちます。

## このレッスンで学べること

- Gatewayとシステムの状態を迅速に診断する
- Gateway起動失敗、チャンネル接続問題を特定して解決する
- 認証とモデル設定のエラーを修正する
- ツール呼び出しの失敗とパフォーマンスの問題を解決する

## 最初のトラブルシューティング：60秒クイックチェック

問題が発生した場合、以下のコマンドを順番に実行すると、通常、問題の根本原因を迅速に特定できます：

```bash
# 1. 全体の状態を確認する
clawdbot status

# 2. 深層診断（設定、実行状態、ログを含む）
clawdbot status --all

# 3. Gatewayの接続性をテストする
clawdbot gateway probe

# 4. リアルタイムでログを確認する
clawdbot logs --follow

# 5. 診断チェックを実行する
clawdbot doctor
```

Gatewayに接続できる場合は、深層テストを実行します：

```bash
clawdbot status --deep
```

::: tip コマンド説明
| コマンド | 機能 | 使用シナリオ |
|--- | --- | ---|
| `clawdbot status` | ローカル要約：システム情報、Gateway接続、サービス状態、Agent状態、プロバイダー設定 | 最初の確認、クイック概要 |
| `clawdbot status --all` | 完全診断（読み取り専用、共有可能、比較的安全）、ログの末尾を含む | デバッグレポートを共有する必要がある場合 |
| `clawdbot status --deep` | Gatewayヘルスチェックを実行（プロバイダープローブを含み、接続可能なGatewayが必要） | 「設定済み」ですが「動作中」ではない場合 |
| `clawdbot gateway probe` | Gateway検出 + 接続性（ローカル + リモートターゲット） | 間違ったGatewayをプローブした可能性がある場合 |
| `clawdbot channels status --probe` | 実行中のGatewayにチャンネル状態を要求（オプションプローブ） | Gatewayは到達可能だがチャンネルに異常がある場合 |
| `clawdbot gateway status` | Supervisor状態（launchd/systemd/schtasks）、ランタイムPID/終了、最後のGatewayエラー | サービスが「ロードされたように見える」が何も実行されていない場合 |
:::

::: warning 出力を共有する場合
- 優先的に `clawdbot status --all` を使用（自動的にtokenをマスキング）
- 必ず `clawdbot status` を貼り付ける必要がある場合、先に `CLAWDBOT_SHOW_SECRETS=0` を設定（トークンプレビューを非表示）
:::

## よくある問題のトラブルシューティング

### Gateway関連の問題

#### "clawdbot: command not found"

**症状**：ターミナルでコマンドが見つからないと表示される。

**原因**：ほぼ間違いなく Node/npm PATHの問題。

**解決策**：

```bash
# 1. Node.jsがインストールされているか確認
node --version  # 需要 ≥22

# 2. npm/pnpmが利用可能か確認
npm --version
# または
pnpm --version

# 3. グローバルインストールパスを確認
which clawdbot
npm list -g --depth=0 | grep clawdbot
```

コマンドが見つからない場合：

```bash
# 再インストール
npm install -g clawdbot@latest
# または
pnpm add -g clawdbot@latest
```

**関連ドキュメント**：[クイックスタート](../../start/getting-started/)

---

#### Gateway起動失敗："configuration invalid" / "set gateway.mode=local"

**症状**：Gatewayが起動を拒否し、設定が無効か実行モードが設定されていないと表示される。

**原因**：設定ファイルは存在するが `gateway.mode` が設定されていない（または `local` ではない）、Gatewayが起動を拒否する。

**解決策**（推奨）：

```bash
# ウィザードを実行し、Gateway実行モードをLocalに設定
clawdbot configure
```

または直接設定：

```bash
clawdbot config set gateway.mode local
```

**リモートGateway**を実行する予定の場合：

```bash
clawdbot config set gateway.mode remote
clawdbot config set gateway.remote.url "wss://gateway.example.com"
```

::: info 一時的なデバッグモード
Ad-hoc/開発シナリオ：`--allow-unconfigured` を渡してGatewayを起動（`gateway.mode=local` を要求しない）
:::

まだ設定ファイルがない場合：

```bash
clawdbot setup  # 初期設定を作成し、Gatewayを再起動
```

---

#### Gateway "unauthorized"、接続できない、または継続的に再接続

**症状**：CLIが未認証と表示、Gatewayに接続できない、または継続的に再接続。

**原因**：認証設定エラーまたは欠落。

**チェック手順**：

```bash
# 1. Gateway状態を確認
clawdbot gateway status

# 2. ログを確認
clawdbot logs --follow
```

**解決策**：

1. `gateway.auth.mode` 設定を確認（オプション値：`token`/`password`/`tailscale`）
2. `token` モードの場合：
   ```bash
   clawdbot config get gateway.auth.token
   ```
3. `password` モードの場合、パスワードが正しいか確認
4. 非loopbackバインド（`lan`/`tailnet`/`custom`）の場合、`gateway.auth.token` を設定する必要がある

::: warning バインドモードと認証
- Loopback（デフォルト）：通常認証は不要
- LAN/Tailnet/Custom：`gateway.auth.token` または `CLAWDBOT_GATEWAY_TOKEN` を設定する必要がある
- `gateway.remote.token` はリモートCLI呼び出し専用、ローカル認証は有効にしない
- 無視されるフィールド：`gateway.token`（`gateway.auth.token` を使用）
:::

---

#### サービスは実行中と表示されるがポートをリッスンしていない

**症状**：`clawdbot gateway status` が `Runtime: running` と表示するが、ポート `18789` をリッスンしていない。

**原因**：Gatewayがバインドを拒否するか、設定が不一致。

**チェックリスト**：

```bash
# 1. Gateway状態を確認
clawdbot gateway status

# 2. 最後のGatewayエラーを確認
clawdbot gateway status | grep "error\|Error\|refusing"

# 3. ポート使用を確認
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

**よくある原因と修正**：

1. **ポートが既に使用されている**：
   ```bash
   # 使用プロセスを確認
   lsof -nP -iTCP:18789 -sTCP:LISTEN
   
   # サービスを停止するか、ポートを変更
   clawdbot config set gateway.port 18790
   ```

2. **設定不一致**：
   - CLI設定とService設定が不一致
   - 修正：同じ `--profile` / `CLAWDBOT_STATE_DIR` から再インストール
   ```bash
   clawdbot gateway install --force
   ```

3. **非loopbackバインドで認証が欠落**：
   - ログ表示："refusing to bind … without auth"
   - 修正：`gateway.auth.mode` + `gateway.auth.token` を設定

4. **Tailnetバインド失敗**：
   - ログ表示："no tailnet interface was found"
   - 修正：Tailscaleを起動するか、`gateway.bind` を `loopback`/`lan` に変更

---

#### Gateway "起動ブロック中：set gateway.mode=local"

**症状**：設定は存在するが起動がブロックされている。

**原因**：`gateway.mode` が `local` に設定されていない（または未設定）。

**解決策**：

```bash
# ソリューション1：設定ウィザードを実行
clawdbot configure

# ソリューション2：直接設定
clawdbot config set gateway.mode local

# ソリューション3：未設定起動を一時的に許可（開発のみ）
clawdbot gateway --allow-unconfigured
```

---

### モデルと認証の問題

#### "No API key found for provider 'anthropic'"

**症状**：AgentがプロバイダーのAPIキーが見つからないと表示。

**原因**：Agentの認証ストレージが空か、Anthropicの認証情報が欠落。認証は**各Agentごとに独立**しており、新しいAgentはメインAgentのキーを継承しない。

**解決策**：

**オプション1**：onboardingを再実行し、そのAgentで **Anthropic** を選択

```bash
clawdbot configure
```

**オプション2**：**Gatewayホスト**でsetup-tokenを貼り付け：

```bash
clawdbot models auth setup-token --provider anthropic
```

**オプション3**：`auth-profiles.json` をメインAgentディレクトリから新しいAgentディレクトリにコピー

**確認**：

```bash
clawdbot models status
```

**関連ドキュメント**：[AIモデルと認証設定](../../advanced/models-auth/)

---

#### OAuth token refresh failed（Anthropic Claudeサブスクリプション）

**症状**：保存されたAnthropic OAuthトークンが期限切れ、リフレッシュに失敗。

**原因**：保存されたOAuthトークンが期限切れでリフレッシュに失敗。Claudeサブスクリプション（API Keyなし）を使用している場合、最も信頼性の高い修正は **Claude Code setup-token** に切り替えるか、**Gatewayホスト**でClaude Code CLI OAuthを再同期すること。

**解決策**（推奨 - setup-token）：

```bash
# Gatewayホストで実行（Claude Code CLIを実行）
clawdbot models auth setup-token --provider anthropic
clawdbot models status
```

他の場所でトークンを生成した場合：

```bash
clawdbot models auth paste-token --provider anthropic
clawdbot models status
```

**OAuthを維続したい場合**：
GatewayホストでClaude Code CLIを使用してログインし、`clawdbot models status` を実行してリフレッシュされたトークンをClawdbotの認証ストレージに同期。

---

#### "/model" で "model not allowed" と表示

**症状**：モデル切り替え時にモデルが許可されていないと表示。

**原因**：通常、`agents.defaults.models` がallowlist（ホワイトリスト）に設定されていることを意味する。非空の場合、それらのprovider/modelキーのみを選択できる。

**解決策**：

```bash
# 1. allowlistを確認
clawdbot config get agents.defaults.models

# 2. 目的のモデルを追加（またはallowlistをクリア）
clawdbot config set agents.defaults.models []
# または
clawdbot config set agents.defaults.models '["anthropic/claude-sonnet-4-20250514"]'

# 3. /modelコマンドを再試行
```

`/models` を使用して許可されているプロバイダー/モデルをブラウズ。

---

#### "All models failed" — まず何を確認すべき？

**チェックリスト**：

1. **認証情報存在**：プロバイダーの認証設定（auth profiles + 環境変数）を確認
2. **モデルルーティング**：`agents.defaults.model.primary` とfallbackがアクセス可能なモデルを指しているか確認
3. **Gatewayログ**：`/tmp/clawdbot/...` で正確なプロバイダーエラーを確認
4. **モデル状態**：`/model status`（チャット）または `clawdbot models status`（CLI）を使用

**詳細コマンド**：

```bash
# 全モデル状態を確認
clawdbot models status

# 特定モデルをテスト
clawdbot models scan

# 詳細ログを確認
clawdbot logs --follow | grep -i "model\|anthropic\|openai"
```

---

### チャンネル接続の問題

#### メッセージがトリガーされない

**症状**：チャンネルでメッセージを送信したが、Agentが応答しない。

**チェック1**：送信者がホワイトリストに含まれているか？

```bash
clawdbot status
# 出力の "AllowFrom: ..." を確認
```

**チェック2**：グループチャットでメンションが必要か？

グループメッセージは `@mention` またはコマンドトリガーが必要。設定を確認：

```bash
# グローバルまたは特定チャンネルのメンションパターンを確認
grep -E "agents\|groupChat\|mentionPatterns" \
  "${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json}"
```

**チェック3**：ログを確認

```bash
clawdbot logs --follow
# またはクイックフィルタ：
tail -f "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | grep "blocked\|skip\|unauthorized"
```

**関連ドキュメント**：[DMペアリングとアクセス制御](../../start/pairing-approval/)

---

#### ペアリングコードが届かない

**症状**：`dmPolicy` が `pairing` の場合、未知の送信者はコードを受信すべきだが、承認されるまでメッセージが無視される。

**チェック1**：保留中のリクエストがあるか？

```bash
clawdbot pairing list <channel>
```

::: info ペアリングリクエスト制限
デフォルトでは、各チャンネル最大 **3つの保留中のDMペアリングリクエスト** がある。リストがいっぱいの場合、承認または期限切れされるまで新しいリクエストはコードを生成しない。
:::

**チェック2**：リクエストは作成されたが返信が送信されていないか？

```bash
clawdbot logs --follow | grep "pairing request"
```

**チェック3**：`dmPolicy` が `open`/`allowlist` ではないことを確認

---

#### WhatsAppが切断される

**症状**：WhatsAppが頻繁に切断されるか接続できない。

**診断手順**：

```bash
# 1. ローカル状態を確認（認証情報、セッション、キューログ）
clawdbot status

# 2. 実行中のGateway + チャンネル（WA接続 + Telegram + Discord APIs）をプローブ
clawdbot status --deep

# 3. 最近の接続イベントを確認
clawdbot logs --limit 200 | grep -i "connection\|disconnect\|logout"
```

**解決策**：

通常、Gatewayが実行されると自動的に再接続。固まっている場合：

```bash
# Gatewayプロセスを再起動（監視方法にかかわらず）
clawdbot gateway restart

# または手動実行して詳細出力を確認
clawdbot gateway --verbose
```

ログアウト/リンク解除されている場合：

```bash
# 再ログインしてQRコードをスキャン
clawdbot channels login --verbose

# ログアウトですべてをクリアできない場合、手動で認証情報を削除
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}/credentials"
```

---

### メディア送信失敗

**症状**：画像、音声、動画、ファイルの送信に失敗。

**チェック1**：ファイルパスが有効か？

```bash
ls -la /path/to/your/image.jpg
```

**チェック2**：ファイルが大きすぎないか？

- 画像：最大 **6MB**
- 音声/動画：最大 **16MB**
- ドキュメント：最大 **100MB**

**チェック3**：メディアログを確認

```bash
grep "media\|fetch\|download" \
  "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | tail -20
```

---

### ツール実行の問題

#### "Agent was aborted"

**症状**：Agentが途中で応答を停止。

**原因**：Agentが中断された。

**可能な原因**：
- ユーザーが `stop`、`abort`、`esc`、`wait`、`exit` を送信
- タイムアウト超過
- プロセスクラッシュ

**解決策**：別のメッセージを送信するだけ、セッションは継続。

---

#### "Agent failed before reply: Unknown model: anthropic/claude-haiku-3-5"

**症状**：モデルが拒否された。

**原因**：Clawdbotは**古い/安全でないモデル**（特にプロンプトインジェクション攻撃に対して脆弱なもの）を拒否する。このエラーが表示された場合、モデル名はもうサポートされていない。

**解決策**：

1. プロバイダーの**最新**モデルを選択し、設定またはモデルエイリアスを更新
2. 利用可能なモデルが不明確な場合、実行：
   ```bash
   clawdbot models list
   # または
   clawdbot models scan
   ```
3. サポートされているモデルを選択

**関連ドキュメント**：[AIモデルと認証設定](../../advanced/models-auth/)

---

#### SkillがsandboxでAPIキーが欠落

**症状**：Skillはホスト上では正常に動作するが、sandboxで失敗し、APIキーが欠落していると表示。

**原因**：sandboxed execはDocker内で実行され、ホストの `process.env` を**継承しない**。

**解決策**：

```bash
# sandbox環境変数を設定
clawdbot config set agents.defaults.sandbox.docker.env '{"API_KEY": "your-key-here"}'

# または特定のagentに設定
clawdbot config set agents.list[0].sandbox.docker.env '{"API_KEY": "your-key-here"}'

# sandboxを再作成
clawdbot sandbox recreate --agent <agent-id>
# または全て
clawdbot sandbox recreate --all
```

---

### Control UIの問題

#### Control UIがHTTPで失敗（"device identity required" / "connect failed"）

**症状**：純粋なHTTPでdashboardを開く（`http://<lan-ip>:18789/` や `http://<tailscale-ip>:18789/` など）と失敗。

**原因**：ブラウザが**安全でないコンテキスト**で実行され、WebCryptoをブロックし、デバイスIDを生成できない。

**解決策**：

1. HTTPSを優先（[Tailscale Serve](../../advanced/remote-gateway/)）
2. またはGatewayホストでローカルに開く：`http://127.0.0.1:18789/`
3. HTTPを使用する必要がある場合、`gateway.controlUi.allowInsecureAuth: true` を有効にし、Gatewayトークンを使用（トークンのみ、デバイスID/ペアリングなし）：
   ```bash
   clawdbot config set gateway.controlUi.allowInsecureAuth true
   ```

**関連ドキュメント**：[リモートGatewayとTailscale](../../advanced/remote-gateway/)

---

### セッションとパフォーマンスの問題

#### セッションが復元されない

**症状**：セッション履歴が失われたか復元できない。

**チェック1**：セッションファイルが存在するか？

```bash
ls -la ~/.clawdbot/agents/<agentId>/sessions/
```

**チェック2**：リセットウィンドウが短すぎないか？

```json
{
  "session": {
    "reset": {
      "mode": "daily",
      "atHour": 4,
      "idleMinutes": 10080  // 7日
    }
  }
}
```

**チェック3**：誰かが `/new`、`/reset` またはリセットトリガーを送信したか？

---

#### Agentタイムアウト

**症状**：長時間タスクが途中で停止。

**原因**：デフォルトタイムアウトは30分。

**解決策**：

長時間タスクの場合：

```json
{
  "reply": {
    "timeoutSeconds": 3600  // 1時間
  }
}
```

または `process` ツールを使用して長時間コマンドをバックグラウンドで実行。

---

#### 高メモリ使用

**症状**：Clawdbotが大量のメモリを消費。

**原因**：Clawdbotは会話履歴をメモリに保持。

**解決策**：

定期的に再起動するか、セッション制限を設定：

```json
{
  "session": {
    "historyLimit": 100  // 保持する最大メッセージ数
  }
}
```

---

## デバッグモード

### 詳細ログを有効にする

```bash
# 1. 設定でtraceログを有効にする
# ${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json} を編集
# 追加：
{
  "logging": {
    "level": "trace"
  }
}

# 2. デバッグ出力をstdoutにミラーリングする詳細コマンドを実行
clawdbot gateway --verbose
clawdbot channels login --verbose
```

::: tip ログレベル説明
- **Level** はファイルログ（永続的なJSONL）を制御
- **consoleLevel** はコンソール出力（TTYのみ）を制御
- `--verbose` は**コンソール**出力にのみ影響、ファイルログは `logging.level` で制御
:::

### ログ場所

| ログ | 場所 |
|--- | ---|
| Gatewayファイルログ（構造化） | `/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`（または `logging.file`） |
| Gatewayサービスログ | macOS: `$CLAWDBOT_STATE_DIR/logs/gateway.log` + `gateway.err.log`<br/>Linux: `journalctl --user -u clawdbot-gateway[-<profile>].service -n 200 --no-pager`<br/>Windows: `schtasks /Query /TN "Clawdbot Gateway (<profile>)" /V /FO LIST` |
| セッションファイル | `$CLAWDBOT_STATE_DIR/agents/<agentId>/sessions/` |
| メディアキャッシュ | `$CLAWDBOT_STATE_DIR/media/` |
| 認証情報 | `$CLAWDBOT_STATE_DIR/credentials/` |

### ヘルスチェック

```bash
# Supervisor + プローブターゲット + 設定パス
clawdbot gateway status

# システムレベルスキャンを含む（レガシー/追加サービス、ポートリスナー）
clawdbot gateway status --deep

# Gatewayは到達可能か？
clawdbot health --json
# 失敗した場合、実行して接続詳細を確認
clawdbot health --verbose

# デフォルトポートにリスナーがあるか？
lsof -nP -iTCP:18789 -sTCP:LISTEN

# 最近のアクティビティ（RPCログの末尾）
clawdbot logs --follow

# RPCが閉じている場合の代替案
tail -20 /tmp/clawdbot/clawdbot-*.log
```

---

## 全設定をリセット

::: warning 危険な操作
以下の操作は全セッションと設定を削除し、WhatsAppを再ペアリングする必要があります
:::

問題が解決できない場合、完全にリセットを検討：

```bash
# 1. Gatewayを停止
clawdbot gateway stop

# 2. サービスがインストールされており、クリーンインストールが必要な場合：
# clawdbot gateway uninstall

# 3. 状態ディレクトリを削除
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}"

# 4. WhatsAppに再ログイン
clawdbot channels login

# 5. Gatewayを再起動
clawdbot gateway restart
# または
clawdbot gateway
```

---

## macOS特有の問題

### 認証時にアプリがクラッシュ（音声/マイク）

**症状**：プライバシープロンプトの「許可」をクリックすると、アプリが消えるか「Abort trap 6」と表示される。

**解決策1：TCCキャッシュをリセット**

```bash
tccutil reset All com.clawdbot.mac.debug
```

**解決策2：新しいBundle IDを強制**

リセットが無効な場合、[`scripts/package-mac-app.sh`](https://github.com/moltbot/moltbot/blob/main/scripts/package-mac-app.sh) の `BUNDLE_ID` を変更（`.test` サフィックスを追加など）し、再構築。これによりmacOSが新しいアプリとして扱うよう強制。

---

### Gatewayが"起動中..."で固まる

**症状**：アプリがローカルGatewayポート `18789` に接続するが、ずっと固まっている。

**解決策1：supervisorを停止（推奨）**

Gatewayがlaunchdによって監視されている場合、PIDをkillすると再起動するだけ。まずsupervisorを停止：

```bash
# 状態を確認
clawdbot gateway status

# Gatewayを停止
clawdbot gateway stop

# またはlaunchctlを使用
launchctl bootout gui/$UID/com.clawdbot.gateway
#（profileを使用している場合、com.clawdbot.<profile> に置換）
```

**解決策2：ポートビジー（リスナーを検索）**

```bash
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

監視されていないプロセスの場合、まず優雅に停止を試み、次に強制終了：

```bash
kill -TERM <PID>
sleep 1
kill -9 <PID>  # 最後の手段
```

**解決策3：CLIインストールを確認**

グローバル `clawdbot` CLIがインストールされ、アプリバージョンと一致しているか確認：

```bash
clawdbot --version
npm install -g clawdbot@<version>
```

---

## ヘルプを取得

以上の方法で問題が解決できない場合：

1. **まずログを確認**：`/tmp/clawdbot/`（デフォルト：`clawdbot-YYYY-MM-DD.log`、または設定した `logging.file`）
2. **既存のissuesを検索**：[GitHub Issues](https://github.com/moltbot/moltbot/issues)
3. **新しいissueを開く**際に含める：
   - Clawdbotバージョン（`clawdbot --version`）
   - 関連ログスニペット
   - 再現手順
   - あなたの設定（**機密情報を編集！**）

---

## このレッスンのまとめ

トラブルシューティングの重要なステップ：

1. **迅速な診断**：`clawdbot status` → `status --all` → `gateway probe` を使用
2. **ログを確認**：`clawdbot logs --follow` が最も直接的な信号源
3. **ターゲットを絞った修正**：症状に従って対応するセクションを確認（Gateway/認証/チャンネル/ツール/セッション）
4. **深層チェック**：`clawdbot doctor` と `status --deep` を使用してシステムレベルの診断を取得
5. **必要に応じてリセット**：どうしようもない場合リセットを使用、ただしデータが失われることに注意

覚えておいてください：ほとんどの問題には明確な原因と解決策があり、体系的なトラブルシューティングは盲目的な試行より効果的。

## 次のレッスンの予告

> 次のレッスンでは **[CLIコマンドリファレンス](../cli-commands/)** を学びます。
>
> 学べること：
> - 完全なCLIコマンドリストと使用法
> - Gateway管理、Agent操作、設定管理の全コマンド
> - 効率的なコマンドライン使用のヒントとベストプラクティス

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日：2026-01-27

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| トラブルシューティングコマンド | [`src/commands/doctor.ts`](https://github.com/moltbot/moltbot/blob/main/src/commands/doctor.ts) | 全文 |
| Gatewayヘルスチェック | [`src/gateway/server-channels.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-channels.ts) | 93+ |
| ログシステム | [`src/logging/index.ts`](https://github.com/moltbot/moltbot/blob/main/src/logging/index.ts) | 全文 |
| 認証処理 | [`src/agents/auth-profiles.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/auth-profiles.ts) | 全文 |
| 設定検証 | [`src/config/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/config.ts) | 全文 |
| チャンネル状態プローブ | [`src/cli/commands/channels-cli.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/commands/channels-cli.ts) | 全文 |

**重要な定数**：
- デフォルトGatewayポート：`18789` - Gateway WebSocketサービスポート
- デフォルトログディレクトリ：`/tmp/clawdbot/` - ログファイル保存場所
- ペアリングリクエスト上限：`3` - 各チャンネルの最大保留ペアリングリクエスト数

**重要な関数**：
- `doctor()` - 診断チェックを実行し、問題を報告
- `probeGateway()` - Gateway接続性をテスト
- `checkAuth()` - 認証設定を検証
- `validateConfig()` - 設定ファイルの完全性を検証

</details>
