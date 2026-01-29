---
title: "AIモデルと認証設定完全ガイド：マルチプロバイダ、認証方式、トラブルシューティング | Clawdbotチュートリアル"
sidebarTitle: "AIアカウントの設定"
subtitle: "AIモデルと認証設定"
description: "Clawdbot用にAIモデルプロバイダ（Anthropic、OpenAI、OpenRouter、Ollamaなど）と3種類の認証方式（API Key、OAuth、Token）を設定する方法を学びます。このチュートリアルは、認証ファイルの管理、複数アカウントのローテーション、OAuthトークンの自動更新、モデルエイリアス設定、フェイルオーバー、一般的なエラーのトラブルシューティングをカバーし、実際の設定例とCLIコマンドを含めて、すぐに始められるようにします。"
tags:
  - "advanced"
  - "configuration"
  - "authentication"
  - "models"
prerequisite:
  - "start-getting-started"
order: 190
---

# AIモデルと認証設定

## 学習後できること

- 複数のAIモデルプロバイダ（Anthropic、OpenAI、OpenRouterなど）を設定する
- 3種類の認証方式（API Key、OAuth、Token）を使用する
- 複数アカウントの認証と認証ローテーションを管理する
- モデル選択とバックアップモデルを設定する
- 一般的な認証問題をトラブルシューティングする

## 現在の課題

Clawdbotは数十種類のモデルプロバイダをサポートしていますが、設定は混乱するかもしれません：

- API KeyとOAuthのどちらを使うべきか？
- 異なるプロバイダの認証方式の違いは？
- 複数のアカウントを設定するには？
- OAuthトークンは自動的に更新されるのか？

## この方法をいつ使うか

- 初回インストール後にAIモデルを設定する必要がある場合
- 新しいモデルプロバイダまたはバックアップアカウントを追加する場合
- 認証エラーやクォータ制限に遭遇した場合
- モデルの切り替えとバックアップメカニズムを設定する必要がある場合

## 🎒 事前準備

::: warning 前提条件
このチュートリアルでは、[クイックスタート](../../start/getting-started/)が完了しており、Gatewayがインストールされ、起動していることを前提としています。
:::

- Node ≥22がインストールされていることを確認
- Gatewayデーモンが実行中であること
- 少なくとも1つのAIモデルプロバイダの資格情報（API Keyまたはサブスクリプションアカウント）を準備

## 核心概念

### モデル設定と認証は分離されている

Clawdbotでは、**モデル選択**と**認証資格情報**は2つの独立した概念です：

- **モデル設定**：Clawdbotにどのモデルを使用するかを伝えます（例：`anthropic/claude-opus-4-5`）、`~/.clawdbot/models.json`に保存
- **認証設定**：モデルにアクセスするための資格情報を提供します（API KeyやOAuthトークンなど）、`~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`に保存

::: info なぜ分離されているのですか？
この設計により、複数のプロバイダやアカウント間で柔軟に切り替えることができ、モデルパラメータを繰り返し設定する必要がなくなります。
:::

### 3種類の認証方式

Clawdbotは3種類の認証方式をサポートしており、異なるシナリオに適しています：

| 認証方式 | 保存形式 | 典型的なシナリオ | サポートされるプロバイダ |
|--- | --- | --- | ---|
| **API Key** | `{ type: "api_key", key: "sk-..." }` | クイックスタート、テスト | Anthropic、OpenAI、OpenRouter、DeepSeekなど |
| **OAuth** | `{ type: "oauth", access: "...", refresh: "..." }` | 長期実行、自動更新 | Anthropic (Claude Code CLI)、OpenAI (Codex)、Qwen Portal |
| **Token** | `{ type: "token", token: "..." }` | 静的Bearerトークン | GitHub Copilot、一部のカスタムプロキシ |

### サポートされるモデルプロバイダ

Clawdbotは以下のモデルプロバイダを内蔵でサポートしています：

::: details 内蔵プロバイダ一覧
| プロバイダ | 認証方式 | 推奨モデル | 備考 |
|--- | --- | --- | ---|
| **Anthropic** | API Key / OAuth (Claude Code CLI) | `anthropic/claude-opus-4-5` | Claude Pro/Max + Opus 4.5を推奨 |
| **OpenAI** | API Key / OAuth (Codex) | `openai/gpt-5.2` | 標準OpenAIとCodex版をサポート |
| **OpenRouter** | API Key | `openrouter/anthropic/claude-sonnet-4-5` | 数百のモデルを統合 |
| **Ollama** | HTTP Endpoint | `ollama/<model>` | ローカルモデル、API Key不要 |
| **DeepSeek** | API Key | `deepseek/deepseek-r1` | 中国向け |
| **Qwen Portal** | OAuth | `qwen-portal/<model>` | 通義千問OAuth |
| **Venice** | API Key | `venice/<model>` | プライバシー優先 |
| **Bedrock** | AWS SDK | `amazon-bedrock/<model>` | AWSホスト型モデル |
| **Antigravity** | API Key | `google-antigravity/<model>` | モデルプロキシサービス |
:::

::: tip 推奨構成
多くのユーザーにとって、**Anthropic Opus 4.5**をメインモデル、**OpenAI GPT-5.2**をバックアップとして設定することをお勧めします。Opusは長いコンテキストとセキュリティの面で優れています。
:::

## 実践

### ステップ1：Anthropicを設定する（推奨）

**理由**
Anthropic ClaudeはClawdbotの推奨モデルです。特にOpus 4.5は長いコンテキスト処理とセキュリティの面で優れています。

**オプションA：Anthropic API Keyを使用（最速）**

```bash
clawdbot onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

**期待される結果**：
- Gatewayが設定を再読み込み
- デフォルトモデルが`anthropic/claude-opus-4-5`に設定
- 認証ファイル`~/.clawdbot/agents/default/agent/auth-profiles.json`が作成

**オプションB：OAuthを使用（長期実行推奨）**

OAuthは長期実行のGatewayに適しており、トークンは自動的に更新されます。

1. setup-tokenを生成（任意のマシンでClaude Code CLIを実行する必要があります）：
```bash
claude setup-token
```

2. 出力されたトークンをコピー

3. Gatewayホストで実行：
```bash
clawdbot models auth paste-token --provider anthropic
# トークンを貼り付け
```

**期待される結果**：
- "Auth profile added: anthropic:claude-cli"というプロンプト
- 認証タイプが`oauth`であること（`api_key`ではない）

::: tip OAuthの利点
OAuthトークンは自動的に更新されるため、手動で更新する必要がありません。継続的に実行されるGatewayデーモンに適しています。
:::

### ステップ2：OpenAIをバックアップとして設定

**理由**
バックアップモデルを設定すると、メインモデル（Anthropicなど）がクォータ制限やエラーに遭遇した場合に自動的に切り替わります。

```bash
clawdbot onboard --openai-api-key "$OPENAI_API_KEY"
```

またはOpenAI Codex OAuthを使用：

```bash
clawdbot onboard --openai-codex
```

**期待される結果**：
- `~/.clawdbot/clawdbot.json`にOpenAIプロバイダ設定が追加
- 認証ファイルに`openai:default`または`openai-codex:codex-cli`設定が追加

### ステップ3：モデル選択とバックアップを設定

**理由**
モデル選択戦略を設定し、メインモデル、バックアップモデル、エイリアスを定義します。

`~/.clawdbot/clawdbot.json`を編集：

```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-5"
      fallbacks:
        - "openai/gpt-5.2"
        - "openai/gpt-5-mini"
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**フィールドの説明**：
- `primary`：デフォルトで使用されるモデル
- `fallbacks`：順番に試すバックアップモデル（失敗時に自動切り替え）
- `alias`：モデルエイリアス（例：`/model opus`は`/model anthropic/claude-opus-4-5`と同じ）

**期待される結果**：
- Gatewayを再起動すると、メインモデルがOpus 4.5になる
- バックアップモデル設定が有効になる

### ステップ4：OpenRouterを追加（オプション）

**理由**
OpenRouterは数百のモデルを統合しており、特殊なモデルや無料モデルにアクセスするのに適しています。

```bash
clawdbot onboard --auth-choice openrouter-api-key --token "$OPENROUTER_API_KEY"
```

次にモデルを設定：

```yaml
agents:
  defaults:
    model:
      primary: "openrouter/anthropic/claude-sonnet-4-5"
```

**期待される結果**：
- モデル参照形式は`openrouter/<provider>/<model>`
- `clawdbot models scan`で利用可能なモデルを確認できます

### ステップ5：Ollamaを設定（ローカルモデル）

**理由**
Ollamaはローカルでモデルを実行できるため、API Keyが不要で、プライバシーに敏感なシナリオに適しています。

`~/.clawdbot/clawdbot.json`を編集：

```yaml
models:
  providers:
    ollama:
      baseUrl: "http://localhost:11434"
      api: "openai-completions"
      models:
        - id: "ollama/llama3.2"
          name: "Llama 3.2"
          api: "openai-completions"
          reasoning: false
          input: ["text"]
          cost:
            input: 0
            output: 0
            cacheRead: 0
            cacheWrite: 0
          contextWindow: 128000
          maxTokens: 4096

agents:
  defaults:
    model:
      primary: "ollama/llama3.2"
```

**期待される結果**：
- OllamaモデルはAPI Keyが不要
- Ollamaサービスが`http://localhost:11434`で実行されている必要があります

### ステップ6：設定を検証

**理由**
認証とモデル設定が正しく、Gatewayが正常にAIを呼び出せることを確認します。

```bash
clawdbot doctor
```

**期待される結果**：
- 認証エラーなし
- モデルリストに設定したプロバイダが含まれている
- ステータスが"OK"と表示

またはテストメッセージを送信：

```bash
clawdbot message send --to +1234567890 --message "Hello from Clawdbot"
```

**期待される結果**：
- AIからの応答が正常
- "No credentials found"エラーなし

## チェックポイント ✅

- [ ] 少なくとも1つのモデルプロバイダ（AnthropicまたはOpenAI）が設定されている
- [ ] 認証ファイル`auth-profiles.json`が作成されている
- [ ] モデル設定ファイル`models.json`が生成されている
- [ ] `/model <alias>`でモデルを切り替えられる
- [ ] Gatewayログに認証エラーがない
- [ ] テストメッセージでAIからの応答が正常に受信できる

## 注意点

### 認証モードの不一致

**問題**：OAuth設定と認証モードが一致していない

```yaml
# ❌ エラー：OAuth資格情報だがモードはtoken
anthropic:claude-cli:
  provider: "anthropic"
  mode: "token"  # "oauth"であるべき
```

**修正**：

```yaml
# ✅ 正しい
anthropic:claude-cli:
  provider: "anthropic"
  mode: "oauth"
```

::: tip
ClawdbotはClaude Code CLIからインポートされた設定を自動的に`mode: "oauth"`に設定するため、手動で修正する必要はありません。
:::

### OAuthトークンの更新失敗

**問題**："OAuth token refresh failed for anthropic"エラーが表示される

**原因**：
- Claude Code CLIの資格情報が別のマシンで無効化された
- OAuthトークンの有効期限切れ

**修正**：
```bash
# setup-tokenを再生成
claude setup-token

# 再貼り付け
clawdbot models auth paste-token --provider anthropic
```

::: warning token vs oauth
`type: "token"`は静的Bearerトークンで、自動的には更新されません。`type: "oauth"`は自動更新をサポートしています。
:::

### クォータ制限とフェイルオーバー

**問題**：メインモデルがクォータ制限（429エラー）に遭遇

**現象**：
```
HTTP 429: rate_limit_error
```

**自動処理**：
- Clawdbotは`fallbacks`の次のモデルを自動的に試行
- すべてのモデルが失敗した場合、エラーを返す

**クールダウン期間の設定**（オプション）：

```yaml
auth:
  cooldowns:
    billingBackoffHours: 24  # クォータエラー後に24時間そのプロバイダを無効化
    failureWindowHours: 1      # 1時間以内の失敗をクールダウンにカウント
```

### 環境変数の上書き

**問題**：設定ファイルで環境変数を使用しているが、設定されていない

```yaml
models:
  providers:
    openai:
      apiKey: "${OPENAI_KEY}"  # 設定されていないとエラー
```

**修正**：
```bash
# 環境変数を設定
export OPENAI_KEY="sk-..."

# または.zshrc/.bashrcに追加
echo 'export OPENAI_KEY="sk-..."' >> ~/.zshrc
```

## 高度な設定

### 複数アカウントと認証ローテーション

**理由**
同じプロバイダに対して複数のアカウントを設定し、負荷分散とクォータ管理を実現します。

**認証ファイルの設定**（`~/.clawdbot/agents/default/agent/auth-profiles.json`）：

```json
{
  "version": 1,
  "profiles": {
    "anthropic:me@example.com": {
      "type": "oauth",
      "provider": "anthropic",
      "email": "me@example.com"
    },
    "anthropic:work": {
      "type": "api_key",
      "provider": "anthropic",
      "key": "sk-ant-work..."
    },
    "openai:personal": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-1..."
    },
    "openai:work": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-2..."
    }
  },
  "order": {
    "anthropic": ["anthropic:me@example.com", "anthropic:work"],
    "openai": ["openai:personal", "openai:work"]
  }
}
```

**`order`フィールド**：
- 認証ローテーションの順序を定義
- Clawdbotは順番に各アカウントを試行
- 失敗したアカウントは自動的にスキップ

**CLIコマンドで順序を管理**：

```bash
# 現在の順序を表示
clawdbot models auth order get --provider anthropic

# 順序を設定
clawdbot models auth order set --provider anthropic anthropic:me@example.com anthropic:work

# 順序をクリア（デフォルトローテーションを使用）
clawdbot models auth order clear --provider anthropic
```

### セッションごとの認証

**理由**
特定のセッションまたはサブエージェントに対して認証設定をロックします。

**`/model <alias>@<profileId>`構文を使用**：

```bash
# 現在のセッションで特定のアカウントを使用するようにロック
/model opus@anthropic:work

# サブエージェント作成時に認証を指定
clawdbot sessions spawn --model "opus@anthropic:work" --workspace "~/clawd-work"
```

**設定ファイルでのロック**（`~/.clawdbot/clawdbot.json`）：

```yaml
auth:
  order:
    # mainエージェントのanthropic順序をロック
    main: ["anthropic:me@example.com", "anthropic:work"]
```

### OAuthトークンの自動更新

Clawdbotは以下のOAuthプロバイダの自動更新をサポートしています：

| プロバイダ | OAuthフロー | 更新メカニズム |
|--- | --- | ---|
| **Anthropic** (Claude Code CLI) | 標準認証コード | pi-mono RPC更新 |
| **OpenAI** (Codex) | 標準認証コード | pi-mono RPC更新 |
| **Qwen Portal** | カスタムOAuth | `refreshQwenPortalCredentials` |
| **Chutes** | カスタムOAuth | `refreshChutesTokens` |

**自動更新ロジック**：

1. トークンの有効期限（`expires`フィールド）をチェック
2. 有効期限が切れていない場合、そのまま使用
3. 有効期限が切れている場合、`refresh`トークンを使用して新しい`access`トークンをリクエスト
4. 保存されている資格情報を更新

::: tip Claude Code CLI同期
Anthropic OAuth（`anthropic:claude-cli`）を使用している場合、Clawdbotはトークン更新時にClaude Code CLIのストレージに同期し、両側の一貫性を確保します。
:::

### モデルエイリアスとショートカット

**理由**
モデルエイリアスを使用すると、完全なIDを覚えずに素早くモデルを切り替えることができます。

**事前定義エイリアス**（推奨設定）：

```yaml
agents:
  defaults:
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "anthropic/claude-haiku-4-5":
        alias: "haiku"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**使用方法**：

```bash
# Opusに素早く切り替え
/model opus

# 以下と同じ
/model anthropic/claude-opus-4-5

# 特定の認証を使用
/model opus@anthropic:work
```

::: tip エイリアスと認証は分離
エイリアスはモデルIDのショートカットであり、認証選択には影響しません。認証を指定するには、`@<profileId>`構文を使用します。
:::

### 暗黙的プロバイダの設定

一部のプロバイダは明示的な設定が不要で、Clawdbotが自動的に検出します：

| プロバイダ | 検出方法 | 設定ファイル |
|--- | --- | ---|
| **GitHub Copilot** | `~/.copilot/credentials.json` | 設定不要 |
| **AWS Bedrock** | 環境変数またはAWS SDK資格情報 | `~/.aws/credentials` |
| **Codex CLI** | `~/.codex/auth.json` | 設定不要 |

::: tip 暗黙的設定の優先順位
暗黙的設定は`models.json`に自動的に統合されますが、明示的設定はそれらを上書きできます。
:::

## よくある質問

### OAuthとAPI Key：何が違いますか？

**OAuth**：
- 長期実行のGatewayに適している
- トークンは自動的に更新される
- サブスクリプションアカウントが必要（Claude Pro/Max、OpenAI Codex）

**API Key**：
- クイックスタートとテストに適している
- 自動的には更新されない
- 無料ティアアカウントで使用可能

::: info 推奨選択
- 長期実行 → OAuthを使用（Anthropic、OpenAI）
- クイックテスト → API Keyを使用
- プライバシーに敏感 → ローカルモデルを使用（Ollama）
:::

### 現在の認証設定を確認するには？

```bash
# 認証ファイルを確認
cat ~/.clawdbot/agents/default/agent/auth-profiles.json

# モデル設定を確認
cat ~/.clawdbot/models.json

# メイン設定ファイルを確認
cat ~/.clawdbot/clawdbot.json
```

またはCLIを使用：

```bash
# モデルを一覧表示
clawdbot models list

# 認証順序を確認
clawdbot models auth order get --provider anthropic
```

### 特定の認証を削除するには？

```bash
# 認証ファイルを編集し、対応するプロファイルを削除
nano ~/.clawdbot/agents/default/agent/auth-profiles.json

# またはCLIを使用（手動操作）
clawdbot doctor  # 問題のある設定を確認
```

::: warning 削除前の確認
認証設定を削除すると、そのプロバイダを使用するモデルが動作しなくなります。バックアップ設定があることを確認してください。
:::

### クォータ制限後に回復するには？

**自動回復**：
- Clawdbotはクールダウン期間後に自動的に再試行します
- ログで再試行時刻を確認

**手動回復**：
```bash
# クールダウン状態をクリア
clawdbot models auth clear-cooldown --provider anthropic --profile-id anthropic:me@example.com

# またはGatewayを再起動
clawdbot gateway restart
```

## まとめ

- Clawdbotは3種類の認証方式をサポート：API Key、OAuth、Token
- モデル設定と認証は分離されており、異なるファイルに保存される
- Anthropic Opus 4.5をメインモデル、OpenAI GPT-5.2をバックアップとして設定することを推奨
- OAuthは自動更新をサポートし、長期実行に適している
- 複数アカウントと認証ローテーションを設定し、負荷分散を実現できる
- モデルエイリアスを使用して素早くモデルを切り替えられる

## 次回の予告

> 次のレッスンでは、**[セッション管理とマルチエージェント](../session-management/)**を学びます。
>
> 学習内容：
> - セッションモデルとセッション分離
> - サブエージェントの連携
> - コンテキスト圧縮
> - マルチエージェントルーティング設定

---

## 付録：ソースコード参照

<details>
<summary><strong>展開してソースコードの位置を確認</strong></summary>

> 更新日時：2026-01-27

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| 認証資格情報タイプ定義 | [`src/agents/auth-profiles/types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/types.ts) | 1-74 |
| OAuthトークンの解析と更新 | [`src/agents/auth-profiles/oauth.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/oauth.ts) | 1-220 |
| 認証設定ファイル管理 | [`src/agents/auth-profiles/profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/profiles.ts) | 1-85 |
| モデル設定タイプ | [`src/config/types.models.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.models.ts) | 1-60 |
| モデル設定生成 | [`src/agents/models-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/models-config.ts) | 1-139 |
| Zodスキーマ設定 | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300+ |

**重要な型**：
- `AuthProfileCredential`：認証資格情報の共用体型（`ApiKeyCredential | TokenCredential | OAuthCredential`）
- `ModelProviderConfig`：モデルプロバイダ設定構造
- `ModelDefinitionConfig`：モデル定義構造

**重要な関数**：
- `resolveApiKeyForProfile()`：認証資格情報を解析しAPI Keyを返す
- `refreshOAuthTokenWithLock()`：ロック付きのOAuthトークン更新
- `ensureClawdbotModelsJson()`：モデル設定の生成と統合

**設定ファイルの位置**：
- `~/.clawdbot/clawdbot.json`：メイン設定ファイル
- `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`：認証資格情報
- `~/.clawdbot/models.json`：生成されたモデル設定

</details>
