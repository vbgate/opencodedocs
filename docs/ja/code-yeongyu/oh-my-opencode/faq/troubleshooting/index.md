---
title: "トラブルシューティング: Doctor 診断設定 | oh-my-opencode"
sidebarTitle: "5分で問題特定"
subtitle: "トラブルシューティング: Doctor 診断設定"
description: "Doctor コマンドの診断方法を学び、バージョン、プラグイン、認証、依存関係など17以上の項目を検査し、--verbose、--json、--category オプションを使用して設定問題を迅速に特定します。"
tags:
  - "troubleshooting"
  - "diagnostics"
  - "configuration"
prerequisite:
  - "start-installation"
order: 150
---

# 設定診断とトラブルシューティング：Doctor コマンドを使用して問題を迅速に解決

## このレッスンで学べること

- `oh-my-opencode doctor` を実行して17以上のヘルスチェックを迅速に診断する
- OpenCode バージョンの低さ、プラグイン未登録、Provider 設定などの問題を特定・修正する
- モデル解決メカニズムを理解し、エージェントと Categories のモデル割り当てを確認する
- 詳細モードを使用して問題診断の完全な情報を取得する

## あなたの現在の困りごと

oh-my-opencode のインストール後、以下のような状況に遭遇したらどうしますか？

- OpenCode がプラグインが読み込まれていないと表示されるが、設定ファイルは問題なさそうに見える
- 特定の AI エージェントが常に「Model not found」エラーを返す
- すべての Provider（Claude、OpenAI、Gemini）が正しく設定されているか確認したい
- 問題がインストール、設定、それとも認証のどの段階にあるか確信が持てない

1つずつ調べるのは時間がかかりすぎます。あなたには**ワンクリック診断ツール**が必要です。

## 核心的アイデア

**Doctor コマンドは oh-my-opencode のヘルスチェックシステム**であり、Mac の Disk Utility や自動車の故障診断機のようなものです。環境を1項目ずつチェックし、どこが正常で、どこに問題があるかを教えてくれます。

Doctor のチェックロジックはソースコードの実装（`src/cli/doctor/checks/`）に完全に基づいており、以下を含みます：
- ✅ **installation**：OpenCode バージョン、プラグイン登録
- ✅ **configuration**：設定ファイル形式、Schema 検証
- ✅ **authentication**：Anthropic、OpenAI、Google 認証プラグイン
- ✅ **dependencies**：Bun、Node.js、Git 依存関係
- ✅ **tools**：LSP と MCP サーバー状態
- ✅ **updates**：バージョン更新チェック

## 実践してみよう

### ステップ1：基本診断を実行する

**なぜ** まず完全なチェックを実行して、全体的なヘルス状態を把握する。

```bash
bunx oh-my-opencode doctor
```

**表示されるべきもの**：

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**チェックポイント ✅**：
- [ ] 6つのカテゴリのチェック結果が表示される
- [ ] 各項目の前に ✓（合格）、⚠（警告）、✗（不合格）のマークがある
- [ ] 下部にサマリー統計が表示される

### ステップ2：一般的な問題を解読する

診断結果に基づいて、問題を迅速に特定できます。以下は一般的なエラーと解決策です：

#### ✗ "OpenCode version too old"

**問題**：OpenCode バージョンが 1.0.150 より低い（最低要件）

**原因**：oh-my-opencode は OpenCode の新機能に依存しており、古いバージョンはサポートされていない

**解決方法**：

```bash
# OpenCode を更新
npm install -g opencode@latest
# または Bun を使用
bun install -g opencode@latest
```

**検証**：`bunx oh-my-opencode doctor` を再度実行

#### ✗ "Plugin not registered"

**問題**：プラグインが `opencode.json` の `plugin` 配列に登録されていない

**原因**：インストールプロセスが中断されたか、設定ファイルを手動で編集した

**解決方法**：

```bash
# インストーラーを再度実行
bunx oh-my-opencode install
```

**ソースコードの根拠**（`src/cli/doctor/checks/plugin.ts:79-117`）：
- プラグインが `opencode.json` の `plugin` 配列にあるかチェック
- サポート形式：`oh-my-opencode` または `oh-my-opencode@version` または `file://` パス

#### ✗ "Configuration has validation errors"

**問題**：設定ファイルが Schema 定義に準拠していない

**原因**：手動編集時にエラーを導入した（スペルミス、型の不一致など）

**解決方法**：

1. `--verbose` を使用して詳細なエラー情報を表示：

```bash
bunx oh-my-opencode doctor --verbose
```

2. 一般的なエラータイプ（`src/config/schema.ts` から）：

| エラーメッセージ | 原因 | 修正方法 |
|---|--- | ---|
| `agents.sisyphus.mode: Invalid enum value` | `mode` は `subagent`/`primary`/`all` のみ可能 | `primary` に変更 |
| `categories.quick.model: Expected string` | `model` は文字列である必要がある | 引用符を追加：`"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | 並列数は数値である必要がある | 数値に変更：`3` |

3. [設定リファレンス](../../appendix/configuration-reference/) でフィールド定義を確認

#### ⚠ "Auth plugin not installed"

**問題**：Provider に対応する認証プラグインがインストールされていない

**原因**：インストール時にその Provider をスキップしたか、プラグインを手動でアンインストールした

**解決方法**：

```bash
# 不足している Provider を選択して再インストール
bunx oh-my-opencode install
```

**ソースコードの根拠**（`src/cli/doctor/checks/auth.ts:11-15`）：

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### ステップ3：モデル解決を確認する

モデル解決は oh-my-opencode の中核メカニズムであり、エージェントと Categories のモデル割り当てが正しいか確認する。

```bash
bunx oh-my-opencode doctor --category configuration
```

**表示されるべきもの**：

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══
  
    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15
    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh
  
  ═══ Configured Models ═══
  
  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...
  
  Categories:
    ○ visual-engineering: google/gemini-3-pro
    ○ ultrabrain: openai/gpt-5.2-codex
    ...
  
  ○ = provider fallback
```

**チェックポイント ✅**：
- [ ] Agent と Categories のモデル割り当てが表示される
- [ ] `○` は Provider フォールバックメカニズムを使用（手動で上書きしていない）
- [ ] `●` はユーザーが設定でデフォルトモデルを上書きしたことを示す

**一般的な問題**：

| 問題 | 原因 | 解決方法 |
|---|--- | ---|
| `unknown` モデル | Provider フォールバックチェーンが空 | 少なくとも1つの Provider が利用可能であることを確認 |
| モデルが使用されていない | Provider が接続されていない | `opencode` を実行して Provider を接続 |
| モデルを上書きしたい | デフォルトモデルを使用している | `oh-my-opencode.json` で `agents.<name>.model` を設定 |

**ソースコードの根拠**（`src/cli/doctor/checks/model-resolution.ts:129-148`）：
- `~/.cache/opencode/models.json` から利用可能なモデルを読み取る
- エージェントモデル要件：`AGENT_MODEL_REQUIREMENTS`（`src/shared/model-requirements.ts`）
- Category モデル要件：`CATEGORY_MODEL_REQUIREMENTS`

### ステップ4：JSON 出力を使用する（スクリプト化）

CI/CD で診断を自動化したい場合は JSON 形式を使用：

```bash
bunx oh-my-opencode doctor --json
```

**表示されるべきもの**：

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**使用シナリオ**：

```bash
# 診断レポートをファイルに保存
bunx oh-my-opencode doctor --json > doctor-report.json

# CI/CD でヘルス状態を確認
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "All checks passed"
else
  echo "Some checks failed"
  exit 1
fi
```

## よくある落とし穴

### ❌ エラー 1：警告情報を無視する

**問題**：`⚠` マークを「任意」と考えてしまい、実際には重要なヒントかもしれない

**修正方法**：
- 例：「using default model」警告は Category モデルを設定していないことを示し、最適な選択でない可能性がある
- `--verbose` を使用して詳細情報を確認し、処理が必要か判断する

### ❌ エラー 2：opencode.json を手動で編集する

**問題**：OpenCode の `opencode.json` を直接変更し、プラグイン登録を破壊してしまう

**修正方法**：
- `bunx oh-my-opencode install` を使用して再登録する
- または `oh-my-opencode.json` のみを変更し、OpenCode の設定ファイルには触れない

### ❌ エラー 3：キャッシュが更新されていない

**問題**：モデル解析に「cache not found」と表示されるが、Provider は設定済み

**修正方法**：

```bash
# モデルキャッシュを更新するために OpenCode を起動
opencode

# または手動で更新（opencode models コマンドがある場合）
opencode models --refresh
```

## レッスンまとめ

Doctor コマンドは oh-my-opencode のスイスアーミーナイフで、問題を迅速に特定するのに役立ちます：

| コマンド | 用途 | いつ使用するか |
|---|--- | ---|
| `bunx oh-my-opencode doctor` | 完全診断 | 初回インストール後、問題が発生した時 |
| `--verbose` | 詳細情報 | エラーの詳細を確認する必要がある時 |
| `--json` | JSON 出力 | CI/CD、スクリプト自動化 |
| `--category <name>` | 単一カテゴリチェック | 特定の部分のみをチェックしたい時 |

**覚えておいて**：問題に遭遇するたびに、まず `doctor` を実行し、エラーを確認してから手を動かす。

## 次のレッスン

> 次のレッスンでは **[よくある質問 (FAQ)](../faq/)** を学びます。
>
> 学べること：
> - oh-my-opencode と他の AI ツールの違い
> - モデル使用コストを最適化する方法
> - バックグラウンドタスク並列制御のベストプラクティス

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-26

| 機能 | ファイルパス | 行番号 |
|---|--- | ---|
| Doctor コマンドエントリ | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| すべてのチェック項目登録 | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| プラグイン登録チェック | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| 設定検証チェック | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| 認証チェック | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| モデル解決チェック | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| 設定 Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| モデル要件定義 | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | 全文 |

**重要な定数**：
- `MIN_OPENCODE_VERSION = "1.0.150"`：OpenCode 最低バージョン要件
- `AUTH_PLUGINS`：認証プラグインマッピング（Anthropic=内蔵、OpenAI/GitHub=プラグイン）
- `AGENT_MODEL_REQUIREMENTS`：エージェントモデル要件（各エージェントの優先順位チェーン）
- `CATEGORY_MODEL_REQUIREMENTS`：Category モデル要件（visual、quick など）

**重要な関数**：
- `doctor(options)`：診断コマンドを実行し、終了コードを返す
- `getAllCheckDefinitions()`：すべての17以上のチェック項目定義を取得
- `checkPluginRegistration()`：プラグインが opencode.json に登録されているかチェック
- `validateConfig(configPath)`：設定ファイルが Schema に準拠しているか検証
- `checkAuthProvider(providerId)`：Provider 認証プラグイン状態をチェック
- `checkModelResolution()`：モデル解決と割り当てをチェック

</details>
