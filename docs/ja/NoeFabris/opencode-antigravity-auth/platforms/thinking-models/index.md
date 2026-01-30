---
title: "Thinking モデル設定 | opencode-antigravity-auth"
sidebarTitle: "AI に深く考えさせる"
subtitle: "Thinking モデル：Claude と Gemini 3 の思考能力"
description: "Claude と Gemini 3 Thinking モデルの設定を学ぶ。thinking budget、thinking level、variant の設定方法を習得する。"
tags:
  - "Thinking モデル"
  - "Claude Opus 4.5"
  - "Claude Sonnet 4.5"
  - "Gemini 3 Pro"
  - "Gemini 3 Flash"
  - "variant 設定"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 4
---

# Thinking モデル：Claude と Gemini 3 の思考能力

## 学習後にできること

- Claude Opus 4.5、Sonnet 4.5 Thinking モデルの thinking budget を設定する
- Gemini 3 Pro/Flash の thinking level（minimal/low/medium/high）を使用する
- OpenCode variant システムを使って思考強度を柔軟に調整する
- interleaved thinking（ツール呼び出し時の思考メカニズム）を理解する
- 思考ブロック保持戦略（keep_thinking 設定）を習得する

## 現在の課題

AI モデルに複雑なタスクでより良いパフォーマンスを発揮させたい——例えば、多段階推論、コードデバッグ、またはアーキテクチャ設計。でも以下の問題がある：

- 通常モデルの回答は速すぎて、十分に深く考えていない
- Claude の公式制限で thinking 機能へのアクセスが困難
- Gemini 3 の thinking level 設定が不明瞭
- どの程度の thinking が十分かわからない（budget はどれくらいにすべきか）
- 思考ブロック内容を読む際に署名エラーに遭遇する

## いつこの機能を使うか

**適用シーン**：
- 多段階推論が必要な複雑な問題（アルゴリズム設計、システムアーキテクチャ）
- 慎重に考える必要があるコードレビューやデバッグ
- 深い分析が必要な長いドキュメントやコードベース
- ツール呼び出しが密集するタスク（interleaved thinking が必要）

**非適用シーン**：
- 簡単な Q&A（thinking quota の浪費）
- 高速プロトタイプ検証（速度優先）
- 事実検索（推論が不要）

## 🎒 始める前の準備

::: warning 前提条件チェック

 1. **プラグインのインストールと認証が完了していること**：[クイックインストール](../../start/quick-install/) と [初回認証](../../start/first-auth-login/) を参照
 2. **基本的なモデルの使用を理解していること**：[初回リクエスト](../../start/first-request/) を参照
 3. **利用可能な Thinking モデルがあること**：Claude Opus 4.5/Sonnet 4.5 Thinking または Gemini 3 Pro/Flash へのアクセス権限があることを確認

 :::

---

## 核心アイデア

### Thinking モデルとは

**Thinking モデル**は、最終的な回答を生成する前に、内部推論（thinking blocks）を行います。これらの思考内容は：

- **課金対象外**：Thinking tokens は通常の出力クォータにカウントされません（具体的な課金ルールは Antigravity 公式を参照）
- **推論品質の向上**：より多くの思考 → より正確で論理的な回答
- **時間の消費**：Thinking は応答遅延を増加させますが、より良い結果をもたらします

**重要な違い**：

| 通常モデル | Thinking モデル |
|---|---|
| 直接回答を生成 | 先に思考 → その後回答を生成 |
| 速いが浅い可能性がある | 遅いがより深い |
| 簡単なタスクに適している | 複雑なタスクに適している |

### 2 種類の Thinking 実装

Antigravity Auth プラグインは 2 種類の Thinking 実装をサポートします：

#### Claude Thinking（Opus 4.5、Sonnet 4.5）

- **Token-based budget**：数字で思考量を制御（例：8192、32768）
- **Interleaved thinking**：ツール呼び出しの前後で思考できる
- **Snake_case keys**：`include_thoughts`、`thinking_budget` を使用

#### Gemini 3 Thinking（Pro、Flash）

- **Level-based**：文字列で思考強度を制御（minimal/low/medium/high）
- **CamelCase keys**：`includeThoughts`、`thinkingLevel` を使用
- **モデル差異**：Flash は 4 つの levels をサポート、Pro は low/high のみサポート

---

## 実践手順

### ステップ 1：Variant で Thinking モデルを設定

OpenCode の variant システムを使用すると、モデルセレクターで直接 thinking 強度を選択でき、複雑なモデル名を覚える必要がありません。

#### 既存設定の確認

モデル設定ファイル（通常は `.opencode/models.json` またはシステム設定ディレクトリ）を確認します：

```bash
## モデル設定を確認
cat ~/.opencode/models.json
```

#### Claude Thinking モデルの設定

`antigravity-claude-sonnet-4-5-thinking` または `antigravity-claude-opus-4-5-thinking` を見つけて、variants を追加します：

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "limit": { "context": 200000, "output": 64000 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "medium": { "thinkingConfig": { "thinkingBudget": 16384 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  }
}
```

**設定説明**：
- `low`：8192 tokens - 軽量思考、中程度の複雑さのタスクに適している
- `medium`：16384 tokens - 思考と速度のバランス
- `max`：32768 tokens - 最大思考、最も複雑なタスクに適している

#### Gemini 3 Thinking モデルの設定

**Gemini 3 Pro**（low/high のみサポート）：

```json
{
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro (Antigravity)",
    "limit": { "context": 1048576, "output": 65535 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Gemini 3 Flash**（4 つの levels をサポート）：

```json
{
  "antigravity-gemini-3-flash": {
    "name": "Gemini 3 Flash (Antigravity)",
    "limit": { "context": 1048576, "output": 65536 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "minimal": { "thinkingLevel": "minimal" },
      "low": { "thinkingLevel": "low" },
      "medium": { "thinkingLevel": "medium" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**設定説明**：
- `minimal`：最低思考、最速応答（Flash のみ）
- `low`：軽量思考
- `medium`：バランス思考（Flash のみ）
- `high`：最大思考（最も遅いが最も深い）

**確認ポイント**：OpenCode のモデルセレクターで、Thinking モデルを選択すると variant ドロップダウンメニューが表示される。

### ステップ 2：Thinking モデルを使用してリクエストを送信

設定が完了したら、OpenCode でモデルと variant を選択できます：

```bash
## Claude Sonnet 4.5 Thinking (max) を使用
opencode run "分散キャッシュシステムのアーキテクチャを設計してください" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max

## Gemini 3 Pro (high) を使用
opencode run "このコードのパフォーマンスボトルネックを分析してください" \
  --model=google/antigravity-gemini-3-pro \
  --variant=high

## Gemini 3 Flash (minimal - 最速) を使用
opencode run "このファイルの内容を素早く要約してください" \
  --model=google/antigravity-gemini-3-flash \
  --variant=minimal
```

**確認ポイント**：モデルは先に thinking blocks（思考内容）を出力し、その後に最終的な回答を生成する。

### ステップ 3：Interleaved Thinking を理解する

Interleaved thinking は、Claude モデルの特別な能力であり、ツール呼び出しの前後で思考することができます。

**シーン例**：AI にツール（ファイル操作、データベースクエリなど）を使用してタスクを完了させる場合：

```
Thinking: まず設定ファイルを読み取る必要がある、その後、内容に基づいて次のステップを決定する...

[ツール呼び出し: read_file("config.json")]

Tool Result: { "port": 8080, "mode": "production" }

Thinking: ポートは 8080、本番モード。設定が正しいか検証する必要がある...

[ツール呼び出し: validate_config({ "port": 8080, "mode": "production" })]

Tool Result: { "valid": true }

Thinking: 設定は有効。これでサービスを起動できる。

[最終回答を生成]
```

**なぜ重要か**：
- ツール呼び出し前後に思考がある → よりスマートな意思決定
- ツール返却結果に適応する → 動的に戦略を調整
- 盲目な実行を避ける → 誤った操作を減らす

::: tip プラグインが自動処理

Interleaved thinking を手動で設定する必要はありません。Antigravity Auth プラグインは Claude Thinking モデルを自動検出し、システム命令に注入します：
- "Interleaved thinking is enabled. You may think between tool calls and after receiving tool results before deciding on next action or final answer."

:::

### ステップ 4：思考ブロック保持戦略を制御する

デフォルトでは、プラグインは信頼性を向上させるために**思考ブロックを削除**します（署名エラーを回避）。思考内容を読みたい場合は、`keep_thinking` を設定する必要があります。

#### なぜデフォルトで削除するか

**署名エラー問題**：
- Thinking blocks は多轮会話で署名の一致が必要
- すべての思考ブロックを保持すると署名の競合が発生する可能性がある
- 思考ブロックの削除はより安定したソリューション（ただし思考内容を失う）

#### 思考ブロック保持を有効化

設定ファイルを作成または編集：

**Linux/macOS**：`~/.config/opencode/antigravity.json`

**Windows**：`%APPDATA%\opencode\antigravity.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "keep_thinking": true
}
```

または環境変数を使用：

```bash
export OPENCODE_ANTIGRAVITY_KEEP_THINKING=1
```

**確認ポイント**：
- `keep_thinking: false`（デフォルト）：最終回答のみ表示され、思考ブロックは非表示
- `keep_thinking: true`：完全な思考プロセスを表示（一部の多轮会話で署名エラーが発生する可能性がある）

::: warning 推奨作法

- **本番環境**：デフォルトの `keep_thinking: false` を使用し、安定性を確保
- **デバッグ/学習**：一時的に `keep_thinking: true` を有効化し、思考プロセスを観察
- **署名エラーが発生した場合**：`keep_thinking` をオフにし、プラグインが自動的に回復する

:::

### ステップ 5：Max Output Tokens をチェック

Claude Thinking モデルは、thinking budget を完全に使用するために、より大きな出力トークン制限（maxOutputTokens）が必要です。

**プラグイン自動処理**：
- thinking budget を設定すると、プラグインは自動的に `maxOutputTokens` を 64,000 に調整
- ソースコード位置：`src/plugin/transform/claude.ts:78-90`

**手動設定（オプション）**：

`maxOutputTokens` を手動で設定する場合、thinking budget より大きいことを確認：

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "variants": {
      "max": {
        "thinkingConfig": { "thinkingBudget": 32768 },
        "maxOutputTokens": 64000  // thinkingBudget 以上である必要がある
      }
    }
  }
}
```

**確認ポイント**：
- `maxOutputTokens` が小さすぎる場合、プラグインは自動的に 64,000 に調整
- デバッグログに "Adjusted maxOutputTokens for thinking model" と表示

---

## チェックポイント ✅

設定が正しいか確認：

### 1. Variant 可視性を検証

OpenCode で：

1. モデルセレクターを開く
2. `Claude Sonnet 4.5 Thinking` を選択
3. variant ドロップダウンメニュー（low/medium/max）があるか確認

**期待結果**：3 つの variant オプションが表示される。

### 2. Thinking 内容出力を検証

```bash
opencode run "3 ステップで考える：1+1=？なぜ？" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max
```

**期待結果**：
- `keep_thinking: true` の場合：詳細な思考プロセスが表示される
- `keep_thinking: false`（デフォルト）の場合：回答 "2" が直接表示される

### 3. Interleaved Thinking を検証（ツール呼び出しが必要）

```bash
## ツール呼び出しが必要なタスクを使用
opencode run "現在のディレクトリのファイルリストを読み取り、ファイルタイプを要約してください" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=medium
```

**期待結果**：
- ツール呼び出しの前後に思考内容が表示される
- AI はツール返却結果に基づいて戦略を調整する

---

## よくある失敗

### ❌ エラー 1：Thinking Budget が Max Output Tokens を超過

**問題**：`thinkingBudget: 32768` を設定したが、`maxOutputTokens: 20000`

**エラーメッセージ**：
```
Invalid argument: max_output_tokens must be greater than or equal to thinking_budget
```

**解決方法**：
- プラグインに自動処理させる（推奨）
- または手動で `maxOutputTokens >= thinkingBudget` を設定

### ❌ エラー 2：Gemini 3 Pro でサポートされていない level を使用

**問題**：Gemini 3 Pro は low/high のみサポートするが、`minimal` を使用しようとした

**エラーメッセージ**：
```
Invalid argument: thinking_level "minimal" not supported for gemini-3-pro
```

**解決方法**：Pro がサポートする levels（low/high）のみを使用

### ❌ エラー 3：多轮会話での署名エラー（keep_thinking: true）

**問題**：`keep_thinking: true` を有効化後、多轮会話でエラーが発生

**エラーメッセージ**：
```
Signature mismatch in thinking blocks
```

**解決方法**：
- 一時的に `keep_thinking` をオフ：`export OPENCODE_ANTIGRAVITY_KEEP_THINKING=0`
- または会話を最初からやり直す

### ❌ エラー 4：Variant が表示されない

**問題**：variants を設定したが、OpenCode モデルセレクターに表示されない

**考えられる原因**：
- 設定ファイルパスが間違っている
- JSON 構文エラー（カンマ、引用符の欠落）
- モデル ID が一致していない

**解決方法**：
1. 設定ファイルパスを確認：`~/.opencode/models.json` または `~/.config/opencode/models.json`
2. JSON 構文を検証：`cat ~/.opencode/models.json | python -m json.tool`
3. モデル ID がプラグインが返すものと一致しているか確認

---

## 本課のまとめ

Thinking モデルは、最終的な回答を生成する前に内部推論を行うことで、複雑なタスクの回答品質を向上させます：

| 機能 | Claude Thinking | Gemini 3 Thinking |
|---|---|---|
| **設定方法** | `thinkingBudget`（数字） | `thinkingLevel`（文字列） |
| **Levels** | カスタム budget | minimal/low/medium/high |
| **Keys** | snake_case（`include_thoughts`） | camelCase（`includeThoughts`） |
| **Interleaved** | ✅ サポート | ❌ サポートなし |
| **Max Output** | 自動的に 64,000 に調整 | デフォルト値を使用 |

**重要な設定**：
- **Variant システム**：`thinkingConfig.thinkingBudget`（Claude）または `thinkingLevel`（Gemini 3）で設定
- **keep_thinking**：デフォルトは false（安定性）、true（思考内容が読める）
- **Interleaved thinking**：自動的に有効化、手動設定は不要

---

## 次課の予告

> 次の課では **[Google Search Grounding](../google-search-grounding/)** を学びます。
>
> 学ぶこと：
> - Gemini モデルで Google Search 検索を有効化する
> - 動的検索しきい値を設定する
> - 事実の正確性を向上させ、幻覚を減らす

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
|---|---|---|
| Claude Thinking 設定構築 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 62-72 |
| Gemini 3 Thinking 設定構築 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 163-171 |
| Gemini 2.5 Thinking 設定構築 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 176-184 |
| Claude Thinking モデル検出 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 34-37 |
| Gemini 3 モデル検出 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 137-139 |
| Interleaved Thinking Hint 注入 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 96-138 |
| Max Output Tokens 自動調整 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 78-90 |
| keep_thinking 設定 Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 78-87 |
| Claude Thinking 適用変換 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 324-366 |
| Gemini Thinking 適用変換 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 372-434 |

**重要な定数**：
- `CLAUDE_THINKING_MAX_OUTPUT_TOKENS = 64_000`：Claude Thinking モデルの最大出力トークン数
- `CLAUDE_INTERLEAVED_THINKING_HINT`：システム命令に注入される interleaved thinking ヒント

**重要な関数**：
- `buildClaudeThinkingConfig(includeThoughts, thinkingBudget)`：Claude Thinking 設定を構築（snake_case keys）
- `buildGemini3ThinkingConfig(includeThoughts, thinkingLevel)`：Gemini 3 Thinking 設定を構築（level string）
- `buildGemini25ThinkingConfig(includeThoughts, thinkingBudget)`：Gemini 2.5 Thinking 設定を構築（numeric budget）
- `ensureClaudeMaxOutputTokens(generationConfig, thinkingBudget)`：maxOutputTokens が十分大きいことを保証
- `appendClaudeThinkingHint(payload, hint)`：interleaved thinking hint を注入
- `isClaudeThinkingModel(model)`：Claude Thinking モデルかどうかを検出
- `isGemini3Model(model)`：Gemini 3 モデルかどうかを検出

</details>
