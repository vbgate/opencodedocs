---
title: "インストール: クイックデプロイ | oh-my-opencode"
sidebarTitle: "5分で起動"
subtitle: "クイックインストールと設定：Provider設定と検証"
description: "oh-my-opencode のインストールと設定方法を学びます。5分以内にAI Provider設定を完了し、Claude、OpenAI、Gemini、GitHub Copilotをサポートします。"
tags:
  - "installation"
  - "setup"
  - "provider-configuration"
prerequisite: []
order: 10
---

# クイックインストールと設定：Provider設定と検証

## 学習目標

- ✅ 推奨のAIエージェント方式でoh-my-opencodeを自動インストール・設定する
- ✅ CLIインタラクティブインストーラーを使用して手動設定を完了する
- ✅ Claude、OpenAI、Gemini、GitHub Copilotなど複数のAI Providerを設定する
- ✅ インストールの成功を検証し、設定の問題を診断する
- ✅ Providerの優先順位とフォールバックメカニズムを理解する

## 現在の課題

- OpenCodeをインストールしたばかりで、空白の設定画面を前にどこから始めればいいかわからない
- 複数のAIサービス（Claude、ChatGPT、Gemini）を契約しているが、統一的な設定方法がわからない
- AIにインストールを手伝ってもらいたいが、正確なインストール指示の出し方がわからない
- 設定ミスでプラグインが正常に動作しなくなることを心配している

## このテクニックを使うタイミング

- **oh-my-opencodeを初めてインストールする時**：これが最初のステップで、必ず完了する必要がある
- **新しいAI Providerを契約した後**：例えばClaude MaxやChatGPT Plusを新規購入した場合
- **開発環境を変更する時**：新しいマシンで開発環境を再設定する場合
- **Provider接続の問題が発生した時**：診断コマンドで設定の問題を調査する

## 🎒 始める前の準備

::: warning 前提条件
このチュートリアルでは、以下を前提としています：
1. **OpenCode >= 1.0.150** がインストール済み
2. 少なくとも1つのAI Provider契約がある（Claude、OpenAI、Gemini、GitHub Copilotなど）

OpenCodeがインストールされていない場合は、まず[OpenCode公式ドキュメント](https://opencode.ai/docs)を参照してインストールを完了してください。
:::

::: tip OpenCodeバージョンの確認
```bash
opencode --version
# 1.0.150以上のバージョンが表示されるはずです
```
:::

## コアコンセプト

oh-my-opencodeのインストール設計には2つの核心理念があります：

**1. AIエージェント優先（推奨）**

自分で手動操作するのではなく、AIエージェントにインストール設定を任せます。なぜでしょうか？
- AIはステップを見落とさない（完全なインストールガイドを持っている）
- AIは契約状況に応じて最適な設定を自動選択する
- AIはエラー発生時に自動で診断・修復できる

**2. インタラクティブ vs 非インタラクティブ**

- **インタラクティブインストール**：`bunx oh-my-opencode install`を実行し、Q&A形式で設定
- **非インタラクティブインストール**：コマンドライン引数を使用（自動化やAIエージェント向け）

**3. Provider優先順位**

oh-my-opencodeは3段階のモデル解決メカニズムを使用します：
1. **ユーザーオーバーライド**：設定ファイルでモデルが明示的に指定されている場合、そのモデルを使用
2. **Providerフォールバック**：優先順位チェーンで試行：`Native（anthropic/openai/google）> GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`
3. **システムデフォルト**：すべてのProviderが利用不可の場合、OpenCodeデフォルトモデルを使用

::: info Providerとは？
ProviderはAIモデルサービスの提供者です。例えば：
- **Anthropic**：Claudeモデルを提供（Opus、Sonnet、Haiku）
- **OpenAI**：GPTモデルを提供（GPT-5.2、GPT-5-nano）
- **Google**：Geminiモデルを提供（Gemini 3 Pro、Flash）
- **GitHub Copilot**：フォールバックとしてGitHubがホストする複数のモデルを提供

oh-my-opencodeは複数のProviderを同時に設定でき、タスクタイプと優先順位に基づいて最適なモデルを自動選択します。
:::

## 実践ガイド

### ステップ1：推奨方法——AIエージェントによるインストール（ユーザーフレンドリー）

**理由**
これは公式推奨のインストール方法で、AIエージェントが自動的に設定を完了し、人為的なステップの見落としを防ぎます。

**操作**

AIチャットインターフェース（Claude Code、AmpCode、Cursorなど）を開き、以下のプロンプトを入力します：

```bash
以下のガイドに従ってoh-my-opencodeをインストール・設定してください：
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**期待される結果**
AIエージェントは以下を行います：
1. 契約状況を確認（Claude、OpenAI、Gemini、GitHub Copilotなど）
2. インストールコマンドを自動実行
3. Provider認証を設定
4. インストール結果を検証
5. インストール完了を通知

::: tip AIエージェントのテストフレーズ
AIエージェントはインストール完了後、"oMoMoMoMo..."というテストフレーズで確認します。
:::

### ステップ2：手動インストール——CLIインタラクティブインストーラーの使用

**理由**
インストールプロセスを完全にコントロールしたい場合、またはAIエージェントによるインストールが失敗した場合に使用します。

::: code-group

```bash [Bunを使用（推奨）]
bunx oh-my-opencode install
```

```bash [npmを使用]
npx oh-my-opencode install
```

:::

> **注意**：CLIはプラットフォームに適したスタンドアロンバイナリを自動ダウンロードし、インストール後はBun/Node.jsランタイムは不要です。
>
> **対応プラットフォーム**：macOS (ARM64, x64)、Linux (x64, ARM64, Alpine/musl)、Windows (x64)

**期待される結果**
インストーラーは以下の質問をします：

```
oMoMoMoMo... Install

[?] Do you have a Claude Pro/Max Subscription? (Y/n)
[?] Are you on max20 (20x mode)? (Y/n)
[?] Do you have an OpenAI/ChatGPT Plus Subscription? (Y/n)
[?] Will you integrate Gemini models? (Y/n)
[?] Do you have a GitHub Copilot Subscription? (Y/n)
[?] Do you have access to OpenCode Zen (opencode/ models)? (Y/n)
[?] Do you have a Z.ai Coding Plan subscription? (Y/n)

Configuration Summary
────────────────────────────────────────────────

  [OK] Claude (max20)
  [OK] OpenAI/ChatGPT (GPT-5.2 for Oracle)
  [OK] Gemini
  [OK] GitHub Copilot (fallback)
  ○ OpenCode Zen (opencode/ models)
  ○ Z.ai Coding Plan (Librarian/Multimodal)

────────────────────────────────────────────────

Model Assignment

  [i] Models auto-configured based on provider priority
  * Priority: Native > Copilot > OpenCode Zen > Z.ai

✓ Plugin registered in opencode.json
✓ Configuration written to ~/.config/opencode/oh-my-opencode.json
✓ Auth setup hints displayed

[!] Please configure authentication for your providers:

1. Anthropic (Claude): Run 'opencode auth login' → Select Anthropic
2. Google (Gemini): Run 'opencode auth login' → Select Google → Choose OAuth with Google (Antigravity)
3. GitHub (Copilot): Run 'opencode auth login' → Select GitHub

Done! 🎉
```

### ステップ3：Provider認証の設定

#### 3.1 Claude (Anthropic) 認証

**理由**
Sisyphusメインエージェントは Opus 4.5 モデルの使用を強く推奨しており、先に認証が必要です。

**操作**

```bash
opencode auth login
```

プロンプトに従って操作します：
1. **Providerを選択**：`Anthropic`を選択
2. **ログイン方法を選択**：`Claude Pro/Max`を選択
3. **OAuthフローを完了**：ブラウザでログインして認可
4. **完了を待つ**：ターミナルに認証成功が表示される

**期待される結果**
```
✓ Authentication successful
✓ Anthropic provider configured
```

::: warning Claude OAuthアクセス制限
> 2026年1月現在、AnthropicはToS違反を理由にサードパーティOAuthアクセスを制限しています。
>
> [**AnthropicはOpenCodeをブロックする理由として本プロジェクトoh-my-opencodeを引用**](https://x.com/thdxr/status/2010149530486911014)
>
> コミュニティにはClaude Code OAuthリクエスト署名を偽造するプラグインが存在します。これらのツールは技術的には動作する可能性がありますが、ユーザーはToSへの影響を理解する必要があり、個人的には推奨しません。
>
> 本プロジェクトは非公式ツールの使用によって生じるいかなる問題についても責任を負わず、**カスタムOAuthシステムの実装は一切ありません**。
:::

#### 3.2 Google Gemini (Antigravity OAuth) 認証

**理由**
GeminiモデルはMultimodal Looker（メディア分析）および一部の専門タスクに使用されます。

**操作**

**ステップ1**：Antigravity Authプラグインを追加

`~/.config/opencode/opencode.json`を編集し、`plugin`配列に`opencode-antigravity-auth@latest`を追加します：

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**ステップ2**：Antigravityモデルを設定（必須）

[opencode-antigravity-auth ドキュメント](https://github.com/NoeFabris/opencode-antigravity-auth)から完全なモデル設定をコピーし、`~/.config/opencode/oh-my-opencode.json`に慎重にマージして、既存の設定を壊さないようにします。

このプラグインは**バリアントシステム**を使用します——`antigravity-gemini-3-pro`のようなモデルは、個別の`-low`/`-high`モデルエントリではなく、`low`/`high`バリアントをサポートします。

**ステップ3**：oh-my-opencodeエージェントモデルをオーバーライド

`oh-my-opencode.json`（または`.opencode/oh-my-opencode.json`）でエージェントモデルをオーバーライドします：

```json
{
  "agents": {
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**利用可能なモデル（Antigravity配額）**：
- `google/antigravity-gemini-3-pro` — バリアント：`low`, `high`
- `google/antigravity-gemini-3-flash` — バリアント：`minimal`, `low`, `medium`, `high`
- `google/antigravity-claude-sonnet-4-5` — バリアントなし
- `google/antigravity-claude-sonnet-4-5-thinking` — バリアント：`low`, `max`
- `google/antigravity-claude-opus-4-5-thinking` — バリアント：`low`, `max`

**利用可能なモデル（Gemini CLI配額）**：
- `google/gemini-2.5-flash`, `google/gemini-2.5-pro`
- `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

> **注意**：`google/antigravity-gemini-3-pro-high`のような従来のサフィックス付き名前も引き続き使用できますが、バリアントの使用を推奨します。代わりに`--variant=high`とベースモデル名を使用してください。

**ステップ4**：認証を実行

```bash
opencode auth login
```

プロンプトに従って操作します：
1. **Providerを選択**：`Google`を選択
2. **ログイン方法を選択**：`OAuth with Google (Antigravity)`を選択
3. **ブラウザログインを完了**：（自動検出）ログインを完了
4. **オプション**：マルチアカウント負荷分散のためにGoogleアカウントを追加
5. **成功を確認**：ユーザーに確認

**期待される結果**
```
✓ Authentication successful
✓ Google provider configured (Antigravity)
✓ Multiple accounts available for load balancing
```

::: tip マルチアカウント負荷分散
このプラグインは最大10個のGoogleアカウントをサポートします。1つのアカウントがレート制限に達すると、自動的に次の利用可能なアカウントに切り替わります。
:::

#### 3.3 GitHub Copilot (Fallback Provider) 認証

**理由**
GitHub Copilotは**フォールバックProvider**として機能し、Native Providerが利用できない場合に使用されます。

**優先順位**：`Native (anthropic/, openai/, google/) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`

**操作**

```bash
opencode auth login
```

プロンプトに従って操作します：
1. **Providerを選択**：`GitHub`を選択
2. **認証方法を選択**：`Authenticate via OAuth`を選択
3. **ブラウザログインを完了**：GitHub OAuthフロー

**期待される結果**
```
✓ Authentication successful
✓ GitHub Copilot configured as fallback
```

::: info GitHub Copilotモデルマッピング
GitHub Copilotが最適な利用可能Providerの場合、oh-my-opencodeは以下のモデル割り当てを使用します：

| エージェント | モデル |
| --- | --- |
| **Sisyphus** | `github-copilot/claude-opus-4.5` |
| **Oracle** | `github-copilot/gpt-5.2` |
| **Explore** | `opencode/gpt-5-nano` |
| **Librarian** | `zai-coding-plan/glm-4.7`（Z.aiが利用可能な場合）またはフォールバック |

GitHub Copilotはプロキシ Providerとして機能し、サブスクリプションに基づいてリクエストを基盤モデルにルーティングします。
:::

### ステップ4：非インタラクティブインストール（AIエージェント向け）

**理由**
AIエージェントは非インタラクティブモードを使用し、コマンドライン引数で一度にすべての設定を完了する必要があります。

**操作**

```bash
bunx oh-my-opencode install --no-tui \
  --claude=<yes|no|max20> \
  --openai=<yes|no> \
  --gemini=<yes|no> \
  --copilot=<yes|no> \
  [--opencode-zen=<yes|no>] \
  [--zai-coding-plan=<yes|no>]
```

**パラメータ説明**：

| パラメータ | 値 | 説明 |
| --- | --- | --- |
| `--no-tui` | - | インタラクティブUIを無効化（他のパラメータが必須） |
| `--claude` | `yes/no/max20` | Claude契約状態 |
| `--openai` | `yes/no` | OpenAI/ChatGPT契約（Oracle用GPT-5.2） |
| `--gemini` | `yes/no` | Gemini統合 |
| `--copilot` | `yes/no` | GitHub Copilot契約 |
| `--opencode-zen` | `yes/no` | OpenCode Zenアクセス（デフォルトno） |
| `--zai-coding-plan` | `yes/no` | Z.ai Coding Plan契約（デフォルトno） |

**例**：

```bash
# すべてのnative契約を持つユーザー
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no

# Claudeのみのユーザー
bunx oh-my-opencode install --no-tui \
  --claude=yes \
  --openai=no \
  --gemini=no \
  --copilot=no

# GitHub Copilotのみのユーザー
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=yes

# 契約なしのユーザー
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no
```

**期待される結果**
非インタラクティブインストールと同じ出力ですが、手動で質問に答える必要はありません。

## チェックポイント ✅

### インストール成功の検証

**チェック1**：OpenCodeバージョンの確認

```bash
opencode --version
```

**期待される結果**：`1.0.150`以上のバージョンが表示される。

::: warning OpenCodeバージョン要件
1.0.132以前のバージョンを使用している場合、OpenCodeのバグにより設定が破損する可能性があります。
>
> この修正は1.0.132以降にマージされました——新しいバージョンを使用してください。
> 豆知識：このPRはOhMyOpenCodeのLibrarian、Explore、Oracle設定により発見・修正されました。
:::

**チェック2**：プラグイン登録の確認

```bash
cat ~/.config/opencode/opencode.json
```

**期待される結果**：`plugin`配列に`"oh-my-opencode"`が表示される。

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**チェック3**：設定ファイル生成の確認

```bash
cat ~/.config/opencode/oh-my-opencode.json
```

**期待される結果**：`agents`、`categories`、`disabled_agents`などのフィールドを含む完全な設定構造が表示される。

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/gpt-5.2"
    },
    ...
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1
    },
    ...
  },
  "disabled_agents": [],
  "disabled_skills": [],
  "disabled_hooks": [],
  "disabled_mcps": []
}
```

### 診断コマンドの実行

```bash
oh-my-opencode doctor --verbose
```

**期待される結果**：
- モデル解決チェック
- エージェント設定検証
- MCP接続状態
- Provider認証状態

```bash
✓ OpenCode version: 1.0.150 (required: >=1.0.150)
✓ Plugin registered: oh-my-opencode
✓ Config file found: ~/.config/opencode/oh-my-opencode.json
✓ Anthropic provider: authenticated
✓ OpenAI provider: authenticated
✓ Google provider: authenticated (Antigravity)
✓ GitHub Copilot: authenticated (fallback)
✓ MCP servers: 3 connected (websearch, context7, grep_app)
✓ Agents: 10 enabled
✓ Hooks: 32 enabled
```

::: danger 診断が失敗した場合
診断でエラーが表示された場合は、まず解決してください：
1. **Provider認証失敗**：`opencode auth login`を再実行
2. **設定ファイルエラー**：`oh-my-opencode.json`の構文を確認（JSONCはコメントと末尾カンマをサポート）
3. **バージョン非互換**：OpenCodeを最新バージョンにアップグレード
4. **プラグイン未登録**：`bunx oh-my-opencode install`を再実行
:::

## よくある落とし穴

### ❌ エラー1：Provider認証の設定忘れ

**問題**：インストール後すぐに使用しようとしたが、AIモデルが動作しない。

**原因**：プラグインはインストールされたが、ProviderがOpenCodeで認証されていない。

**解決策**：
```bash
opencode auth login
# 対応するProviderを選択して認証を完了
```

### ❌ エラー2：OpenCodeバージョンが古い

**問題**：設定ファイルが破損するか、読み込めない。

**原因**：OpenCode 1.0.132以前のバージョンには設定を破損するバグがある。

**解決策**：
```bash
# OpenCodeをアップグレード
npm install -g @opencode/cli@latest

# またはパッケージマネージャーを使用（Bun、Homebrewなど）
bun install -g @opencode/cli@latest
```

### ❌ エラー3：CLIコマンドパラメータエラー

**問題**：非インタラクティブインストール実行時にパラメータエラーが表示される。

**原因**：`--claude`は必須パラメータで、`yes`、`no`、または`max20`を指定する必要がある。

**解決策**：
```bash
# ❌ 間違い：--claudeパラメータが欠落
bunx oh-my-opencode install --no-tui --gemini=yes

# ✅ 正解：すべての必須パラメータを指定
bunx oh-my-opencode install --no-tui --claude=yes --gemini=yes
```

### ❌ エラー4：Antigravity配額の枯渇

**問題**：Geminiモデルが突然動作しなくなった。

**原因**：Antigravity配額には制限があり、単一アカウントがレート制限に達した可能性がある。

**解決策**：複数のGoogleアカウントを追加して負荷分散を実現
```bash
opencode auth login
# Googleを選択
# アカウントを追加
```

プラグインは自動的にアカウント間で切り替え、単一アカウントの枯渇を防ぎます。

### ❌ エラー5：設定ファイルの場所が間違っている

**問題**：設定を変更しても反映されない。

**原因**：間違った設定ファイルを編集した（プロジェクト設定 vs ユーザー設定）。

**解決策**：設定ファイルの場所を確認

| 設定タイプ | ファイルパス | 優先度 |
| --- | --- | --- |
| **ユーザー設定** | `~/.config/opencode/oh-my-opencode.json` | 高 |
| **プロジェクト設定** | `.opencode/oh-my-opencode.json` | 低 |

::: tip 設定マージルール
ユーザー設定とプロジェクト設定の両方が存在する場合、**ユーザー設定がプロジェクト設定を上書きします**。
:::

## このレッスンのまとめ

- **AIエージェントによるインストールを推奨**：AIに自動設定を任せ、人為的な見落としを防ぐ
- **CLIはインタラクティブと非インタラクティブモードをサポート**：インタラクティブは人間向け、非インタラクティブはAI向け
- **Provider優先順位**：Native > Copilot > OpenCode Zen > Z.ai
- **認証は必須**：インストール後、Provider認証を設定しないと使用できない
- **診断コマンドは重要**：`oh-my-opencode doctor --verbose`で問題を素早く特定
- **JSONC形式をサポート**：設定ファイルはコメントと末尾カンマをサポート

## 次のレッスン予告

> 次のレッスンでは**[Sisyphus入門：メインオーケストレーター](../sisyphus-orchestrator/)**を学びます。
>
> 学習内容：
> - Sisyphusエージェントのコア機能と設計理念
> - Sisyphusを使用したタスクの計画と委任方法
> - 並列バックグラウンドタスクの動作メカニズム
> - Todo強制完了機能の原理

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-26

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| CLIインストールエントリ | [`src/cli/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/index.ts) | 22-60 |
| インタラクティブインストーラー | [`src/cli/install.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/install.ts) | 1-400+ |
| 設定マネージャー | [`src/cli/config-manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/config-manager.ts) | 1-200+ |
| 設定Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-400+ |
| 診断コマンド | [`src/cli/doctor.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/doctor.ts) | 1-200+ |

**主要な定数**：
- `VERSION = packageJson.version`：現在のCLIバージョン番号
- `SYMBOLS`：UIシンボル（check、cross、arrow、bullet、info、warn、star）

**主要な関数**：
- `install(args: InstallArgs)`：メインインストール関数、インタラクティブと非インタラクティブインストールを処理
- `validateNonTuiArgs(args: InstallArgs)`：非インタラクティブモードのパラメータを検証
- `argsToConfig(args: InstallArgs)`：CLI引数を設定オブジェクトに変換
- `addPluginToOpenCodeConfig()`：プラグインをopencode.jsonに登録
- `writeOmoConfig(config)`：oh-my-opencode.json設定ファイルを書き込み
- `isOpenCodeInstalled()`：OpenCodeがインストールされているか確認
- `getOpenCodeVersion()`：OpenCodeバージョン番号を取得

**設定Schemaフィールド**：
- `AgentOverrideConfigSchema`：エージェントオーバーライド設定（model、variant、skills、temperature、promptなど）
- `CategoryConfigSchema`：Category設定（description、model、temperature、thinkingなど）
- `ClaudeCodeConfigSchema`：Claude Code互換性設定（mcp、commands、skills、agents、hooks、plugins）
- `BuiltinAgentNameSchema`：組み込みエージェント列挙（sisyphus、prometheus、oracle、librarian、explore、multimodal-looker、metis、momus、atlas）
- `PermissionValue`：権限値列挙（ask、allow、deny）

**インストール対応プラットフォーム**（READMEより）：
- macOS (ARM64, x64)
- Linux (x64, ARM64, Alpine/musl)
- Windows (x64)

**Provider優先順位チェーン**（docs/guide/installation.mdより）：
1. Native（anthropic/、openai/、google/）
2. GitHub Copilot
3. OpenCode Zen
4. Z.ai Coding Plan

</details>
