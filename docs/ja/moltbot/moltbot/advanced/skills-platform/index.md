---
title: "スキルプラットフォームと ClawdHub：AI アシスタントを拡張する | Clawdbot チュートリアル | Clawdbot"
sidebarTitle: "AI 能力を拡張"
subtitle: "スキルプラットフォームと ClawdHub：AI アシスタントを拡張する | Clawdbot チュートリアル | Clawdbot"
description: "Clawdbot のスキルシステムアーキテクチャを学び、Bundled、Managed、Workspace スキルの 3 つの読み込み優先順位をマスターします。ClawdHub を使用してスキルをインストール・更新し、スキルゲーティングルールと環境変数注入メカニズムを設定します。"
tags:
  - "スキルシステム"
  - "ClawdHub"
  - "AI 拡張"
  - "スキル設定"
prerequisite:
  - "start-getting-start"
order: 280
---

# スキルプラットフォームと ClawdHub による AI アシスタントの拡張 | Clawdbot チュートリアル

## 学習後の目標

このレッスンを完了すると、以下のことができるようになります：

- Clawdbot のスキルシステムアーキテクチャ（Bundled、Managed、Workspace の 3 つのスキルタイプ）を理解する
- ClawdHub からスキルを発見、インストール、更新して、AI アシスタントの能力を拡張する
- スキルの有効化状態、環境変数、API キーを設定する
- スキルゲーティング（Gating）ルールを使用して、条件が満たされた場合のみスキルが読み込まれるようにする
- マルチ Agent 環境でのスキル共有と上書き優先順位を管理する

## 現在の課題

Clawdbot は豊富な組み込みツール（ブラウザ、コマンド実行、Web 検索など）を提供していますが、以下のような場合：

- サードパーティの CLI ツール（`gemini`、`peekaboo` など）を呼び出したい
- 特定ドメインの自動化スクリプトを追加したい
- AI にカスタムツールセットの使い方を学習させたい

このように考えるかもしれません：「AI にどのツールが利用可能かをどう伝えるの？ツールはどこに配置すればいいの？複数の Agent でスキルを共有できるの？」

Clawdbot のスキルシステムはこのために設計されています：**SKILL.md ファイルでスキルを宣言すると、Agent が自動的に読み込んで使用します**。

## いつこの方法を使うべきか

- **AI 能力を拡張したい場合**：新しいツールや自動化フローを追加したいとき
- **マルチ Agent 協働時**：異なる Agent がスキルを共有または独占したいとき
- **スキルバージョン管理時**：ClawdHub からスキルをインストール、更新、同期したいとき
- **スキルゲーティング時**：特定の環境（OS、バイナリ、設定）でのみスキルが読み込まれるようにしたいとき

## 🎒 事前の準備

始める前に、以下を確認してください：

- [ ] [クイックスタート](../../start/getting-start/) を完了し、Gateway が正常に動作している
- [ ] 少なくとも 1 つの AI モデル（Anthropic、OpenAI、Ollama など）が設定されている
- [ ] 基本的なコマンドライン操作（`mkdir`、`cp`、`rm`）を理解している

## コアコンセプト

### スキルとは？

スキルはディレクトリであり、`SKILL.md` ファイル（LLM への指示とツール定義）と、オプションのスクリプトやリソースが含まれています。`SKILL.md` は YAML frontmatter でメタデータを定義し、Markdown でスキルの使い方を記述します。

Clawdbot は [AgentSkills](https://agentskills.io) 仕様と互換性があり、他の仕様に従うツールでもスキルを読み込むことができます。

#### スキルが読み込まれる 3 つの場所

スキルは 3 つの場所から読み込まれます。優先順位は高い順です：

1. **Workspace スキル**：`<workspace>/skills`（最も高い優先順位）
2. **Managed/ローカルスキル**：`~/.clawdbot/skills`
3. **Bundled スキル**：インストールパッケージに含まれる（最も低い優先順位）

::: info 優先順位ルール
同じ名前のスキルが複数の場所に存在する場合、Workspace スキルが Managed および Bundled スキルを上書きします。
:::

さらに、`skills.load.extraDirs` 設定で追加のスキルディレクトリを指定することもできます（最も低い優先順位）。

#### マルチ Agent 環境でのスキル共有

マルチ Agent 設定では、各 Agent が独自の workspace を持っています：

- **Per-agent スキル**：`<workspace>/skills` にあり、その Agent にのみ表示されます
- **共有スキル**：`~/.clawdbot/skills` にあり、同じマシン上のすべての Agent に表示されます
- **共有フォルダ**：`skills.load.extraDirs` で追加できます（最も低い優先順位）。複数の Agent が同じスキルパッケージを共有するために使用します

同名の競合が発生した場合、優先順位ルールも適用されます：Workspace > Managed > Bundled。

#### スキルゲーティング（Gating）

Clawdbot は読み込み時に `metadata` フィールドでスキルをフィルタリングし、条件が満たされた場合のみスキルが読み込まれるようにします：

```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"clawdbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

`metadata.clawdbot` 配下のフィールド：

- `always: true`：常にスキルを読み込む（他のゲーティングをスキップ）
- `emoji`：macOS Skills UI に表示される絵文字
- `homepage`：macOS Skills UI に表示されるウェブサイトリンク
- `os`：プラットフォームリスト（`darwin`、`linux`、`win32`）。スキルはこれらの OS でのみ利用可能
- `requires.bins`：リスト。各項目が `PATH` 内に存在する必要がある
- `requires.anyBins`：リスト。少なくとも 1 つが `PATH` 内に存在する必要がある
- `requires.env`：リスト。環境変数が存在するか、設定で提供されている必要がある
- `requires.config`：`clawdbot.json` パスのリスト。真値である必要がある
- `primaryEnv`：`skills.entries.<name>.apiKey` に関連付けられる環境変数名
- `install`：オプションのインストーラ仕様の配列（macOS Skills UI 用）

::: warning サンドボックス環境でのバイナリチェック
`requires.bins` はスキル読み込み時に**ホスト**でチェックされます。Agent がサンドボックスで実行されている場合、バイナリはコンテナ内にも存在する必要があります。
`agents.defaults.sandbox.docker.setupCommand` で依存関係をインストールできます。
:::

### 環境変数の注入

Agent の実行が開始されると、Clawdbot は以下の手順を実行します：

1. スキルメタデータを読み込む
2. 任意の `skills.entries.<key>.env` または `skills.entries.<key>.apiKey` を `process.env` に適用する
3. 条件を満たすスキルを使用してシステムプロンプトを構築する
4. Agent の実行終了後に元の環境を復元する

これは **Agent の実行スコープに限定** され、グローバルな Shell 環境ではありません。

## 実践してみよう

### ステップ 1：インストール済みのスキルを確認する

CLI を使用して現在利用可能なスキルを一覧表示します：

```bash
clawdbot skills list
```

または、条件を満たすスキルのみを確認します：

```bash
clawdbot skills list --eligible
```

**期待される結果**：スキルのリスト（名前、説明、条件を満たしているかどうか（バイナリ、環境変数など））

### ステップ 2：ClawdHub からスキルをインストールする

ClawdHub は Clawdbot のパブリックスキルレジストリで、スキルを参照、インストール、更新、公開することができます。

#### CLI のインストール

以下のいずれかの方法で ClawdHub CLI をインストールします：

```bash
npm i -g clawdhub
```

または

```bash
pnpm add -g clawdhub
```

#### スキルの検索

```bash
clawdhub search "postgres backups"
```

#### スキルのインストール

```bash
clawdhub install <skill-slug>
```

デフォルトでは、CLI は現在の作業ディレクトリの `./skills` サブディレクトリ（または設定された Clawdbot workspace にフォールバック）にインストールします。Clawdbot は次のセッションでこれを `<workspace>/skills` として読み込みます。

**期待される結果**：インストール出力。スキルフォルダとバージョン情報が表示されます。

### ステップ 3：インストール済みのスキルを更新する

すべてのインストール済みスキルを更新します：

```bash
clawdhub update --all
```

または、特定のスキルを更新します：

```bash
clawdhub update <slug>
```

**期待される結果**：各スキルの更新ステータス（バージョン変更など）

### ステップ 4：スキルの上書きを設定する

`~/.clawdbot/clawdbot.json` でスキルの有効化状態、環境変数などを設定します：

```json5
{
  "skills": {
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": {
          "GEMINI_API_KEY": "GEMINI_KEY_HERE"
        },
        "config": {
          "endpoint": "https://example.invalid",
          "model": "nano-pro"
        }
      },
      "peekaboo": { "enabled": true },
      "sag": { "enabled": false }
    }
  }
}
```

**ルール**：

- `enabled: false`：Bundled またはインストール済みであってもスキルを無効にする
- `env`：環境変数を注入する（変数がプロセス内で設定されていない場合のみ）
- `apiKey`：`metadata.clawdbot.primaryEnv` が宣言されたスキル用の便利なフィールド
- `config`：オプションのカスタムフィールドセット。カスタムキーはここに配置する必要がある

**期待される結果**：設定を保存すると、Clawdbot は次回の Agent 実行時にこれらの設定を適用します。

### ステップ 5：スキルモニターを有効にする（オプション）

デフォルトでは、Clawdbot はスキルフォルダを監視し、`SKILL.md` ファイルが変更されるとスキルスナップショットをリフレッシュします。`skills.load` で設定できます：

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

**期待される結果**：スキルファイルを変更すると、Gateway を再起動する必要がなく、Clawdbot は次回の Agent ターンで自動的にスキルリストをリフレッシュします。

### ステップ 6：スキルの問題をデバッグする

スキルの詳細情報と不足している依存関係を確認します：

```bash
clawdbot skills info <name>
```

すべてのスキルの依存関係ステータスを確認します：

```bash
clawdbot skills check
```

**期待される結果**：スキルの詳細情報（バイナリ、環境変数、設定のステータス、不足している条件など）

## チェックポイント ✅

上記のステップを完了すると、以下のことができるようになります：

- [ ] `clawdbot skills list` ですべての利用可能なスキルを確認する
- [ ] ClawdHub から新しいスキルをインストールする
- [ ] インストール済みのスキルを更新する
- [ ] `clawdbot.json` でスキルの上書きを設定する
- [ ] `skills check` でスキルの依存関係の問題をデバッグする

## 注意点

### 一般的なエラー 1：スキル名にハイフンが含まれている

**問題**：`skills.entries` でハイフン付きのスキル名をキーとして使用する

```json
// ❌ エラー：引用符なし
{
  "skills": {
    "entries": {
      nano-banana-pro: { "enabled": true }  // JSON 構文エラー
    }
  }
}
```

**修正**：キーを引用符で囲む（JSON5 は引用符付きキーをサポート）

```json
// ✅ 正しい：引用符付き
{
  "skills": {
    "entries": {
      "nano-banana-pro": { "enabled": true }
    }
  }
}
```

### 一般的なエラー 2：サンドボックス環境での環境変数

**問題**：スキルがサンドボックスで実行されているが、`skills.entries.<skill>.env` または `apiKey` が効果がない

**原因**：グローバル `env` と `skills.entries.<skill>.env/apiKey` は**ホスト実行**にのみ適用され、サンドボックスはホスト `process.env` を継承しません。

**修正**：以下のいずれかの方法を使用します：

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "docker": {
          "env": {
            "GEMINI_API_KEY": "your_key_here"
          }
        }
      }
    }
  }
}
```

または、環境変数をカスタムサンドボックスイメージに baked します。

### 一般的なエラー 3：スキルがリストに表示されない

**問題**：スキルはインストールされているが、`clawdbot skills list` に表示されない

**可能な原因**：

1. スキルがゲーティング条件を満たしていない（バイナリ、環境変数、設定が不足している）
2. スキルが無効になっている（`enabled: false`）
3. スキルが Clawdbot がスキャンするディレクトリにない

**トラブルシューティング手順**：

```bash
# スキルの依存関係を確認
clawdbot skills check

# スキルディレクトリがスキャンされているか確認
ls -la ~/.clawdbot/skills/
ls -la <workspace>/skills/
```

### 一般的なエラー 4：スキルの競合と優先順位の混乱

**問題**：同じ名前のスキルが複数の場所に存在する場合、どれが読み込まれるのか？

**優先順位を覚えておいてください**：

`<workspace>/skills` (最高) → `~/.clawdbot/skills` → bundled skills (最低)

Bundled スキルを使用し、Workspace の上書きを回避したい場合：

1. `<workspace>/skills/<skill-name>` を削除またはリネームする
2. または `skills.entries` でそのスキルを無効にする

## レッスンまとめ

このレッスンでは、Clawdbot スキルプラットフォームのコアコンセプトを学びました：

- **3 つのスキルタイプ**：Bundled、Managed、Workspace。優先順位で読み込まれる
- **ClawdHub 統合**：スキルの検索、インストール、更新、公開のためのパブリックレジストリ
- **スキルゲーティング**：metadata の `requires` フィールドでスキルをフィルタリング
- **設定の上書き**：`clawdbot.json` でスキルの有効化、環境変数、カスタム設定を制御
- **スキルモニター**：Gateway を再起動せずにスキルリストを自動的にリフレッシュ

スキルシステムは Clawdbot の能力を拡張するためのコアメカニズムです。これをマスターすると、AI アシスタントをより多くのシナリオやツールに適応させることができます。

## 次のレッスンの予告

> 次のレッスンでは **[セキュリティとサンドボックス分離](../security-sandbox/)** を学びます。
>
> 学ぶこと：
> - セキュリティモデルと権限制御
> - ツール権限の allowlist/denylist
> - Docker サンドボックス分離メカニズム
> - リモート Gateway のセキュリティ設定

---

#### 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-27

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| スキル設定型定義 | [`src/config/types.skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.skills.ts) | 1-32 |
| スキルシステムドキュメント | [`docs/tools/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills.md) | 1-260 |
| スキル設定リファレンス | [`docs/tools/skills-config.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills-config.md) | 1-76 |
| ClawdHub ドキュメント | [`docs/tools/clawdhub.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/clawdhub.md) | 1-202 |
| スキル作成ガイド | [`docs/tools/creating-skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/creating-skills.md) | 1-42 |
| CLI コマンド | [`docs/cli/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/skills.md) | 1-26 |

**主要な型**：

- `SkillConfig`：単一のスキル設定（enabled、apiKey、env、config）
- `SkillsLoadConfig`：スキル読み込み設定（extraDirs、watch、watchDebounceMs）
- `SkillsInstallConfig`：スキルインストール設定（preferBrew、nodeManager）
- `SkillsConfig`：トップレベルのスキル設定（allowBundled、load、install、entries）

**組み込みスキルの例**：

- `skills/gemini/SKILL.md`：Gemini CLI スキル
- `skills/peekaboo/SKILL.md`：Peekaboo macOS UI 自動化スキル

</details>
