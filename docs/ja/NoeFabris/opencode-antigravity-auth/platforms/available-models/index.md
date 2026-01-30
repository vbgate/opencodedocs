---
title: "利用可能なモデル: Claude と Gemini の設定ガイド | Antigravity Auth"
sidebarTitle: "適切なAIモデルの選択"
subtitle: "すべての利用可能なモデルとそのバリアント設定について理解する"
description: "Antigravity Auth のモデル設定を学ぶ。Claude Opus 4.5、Sonnet 4.5、Gemini 3 Pro/Flash の Thinking バリアントの使用方法を習得する。"
tags:
  - "プラットフォーム"
  - "モデル"
  - "Claude"
  - "Gemini"
  - "Thinking"
prerequisite:
  - "start-what-is-antigravity-auth"
  - "start-quick-install"
order: 1
---

# すべての利用可能なモデルとそのバリアント設定について理解する

## 学習後にできること

- ご自身のニーズに最適な Claude または Gemini モデルを選択する
- Thinking モードの異なるレベル（low/max または minimal/low/medium/high）を理解する
- Antigravity と Gemini CLI の2つの独立したクォータプールを理解する
- `--variant` パラメータを使用して思考予算を動的に調整する

## 現状の課題

プラグインをインストールしたばかりで、長いモデル名のリストを目の前にして、どれを選べばいいのかわからない：
- `antigravity-gemini-3-pro` と `gemini-3-pro-preview` の違いは何か？
- `--variant=max` は何を意味するか？指定しなかったらどうなるか？
- Claude の thinking モードと Gemini の thinking モードは同じか？

## 核心的な考え方

Antigravity Auth は、独立したクォータプールを持つ2つの主要なモデルカテゴリをサポートしています：

1. **Antigravity クォータ**: Google Antigravity API 経由でアクセスし、Claude と Gemini 3 を含む
2. **Gemini CLI クォータ**: Gemini CLI API 経由でアクセスし、Gemini 2.5 と Gemini 3 Preview を含む

::: info Variant システム
OpenCode の variant システムでは、thinking レベルごとに個別のモデルを定義する必要はありません。代わりに、実行時に `--variant` パラメータを使用して設定を指定します。これにより、モデルセレクターがシンプルになり、設定もより柔軟になります。
:::

## Antigravity クォータのモデル

これらのモデルは `antigravity-` プレフィックスを使用してアクセスし、Antigravity API のクォータプールを使用します。

### Gemini 3 シリーズ

#### Gemini 3 Pro
| モデル名 | Variants | Thinking レベル | 説明 |
| --- | --- | --- | ---|
| `antigravity-gemini-3-pro` | low, high | low, high | 品質と速度のバランス |

**Variant 設定例**：
```bash
# 低思考レベル（より高速）
opencode run "迅速な回答" --model=google/antigravity-gemini-3-pro --variant=low

# 高思考レベル（より深い洞察）
opencode run "複雑な推論" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash
| モデル名 | Variants | Thinking レベル | 説明 |
| --- | --- | --- | ---|
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | 超高速応答、4種類の思考レベルをサポート |

**Variant 設定例**：
```bash
# 最小思考（最速）
opencode run "単純なタスク" --model=google/antigravity-gemini-3-flash --variant=minimal

# バランス思考（デフォルト）
opencode run "通常タスク" --model=google/antigravity-gemini-3-flash --variant=medium

# 最大思考（最も深い洞察）
opencode run "複雑な分析" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro は minimal/medium をサポートしていません
`gemini-3-pro` は `low` と `high` の2つのレベルのみをサポートしています。`--variant=minimal` または `--variant=medium` を使用しようとすると、API はエラーを返します。
:::

### Claude シリーズ

#### Claude Sonnet 4.5（非 Thinking）
| モデル名 | Variants | Thinking 予算 | 説明 |
| --- | --- | --- | ---|
| `antigravity-claude-sonnet-4-5` | — | — | 標準モード、拡張思考なし |

**使用例**：
```bash
# 標準モード
opencode run "日常会話" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking
| モデル名 | Variants | Thinking 予算（トークン） | 説明 |
| --- | --- | --- | ---|
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | バランスモード |

**Variant 設定例**：
```bash
# 軽量思考（より高速）
opencode run "迅速な推論" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# 最大思考（最も深い洞察）
opencode run "深度分析" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking
| モデル名 | Variants | Thinking 予算（トークン） | 説明 |
| --- | --- | --- | ---|
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | 最強の推論能力 |

**Variant 設定例**：
```bash
# 軽量思考
opencode run "高品質な回答" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# 最大思考（最も複雑なタスク用）
opencode run "専門家レベルの分析" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Claude と Gemini の思考モードの違い
- **Claude** は数値の thinking budget（トークン）を使用し、例えば 8192、32768
- **Gemini 3** は文字列の thinking level（minimal/low/medium/high）を使用
- 両方とも回答前に推論プロセスを表示しますが、設定方法が異なります
:::

## Gemini CLI クォータのモデル

これらのモデルには `antigravity-` プレフィックスがなく、Gemini CLI API の独立したクォータプールを使用します。これらは thinking モードをサポートしていません。

| モデル名 | 説明 |
| --- | ---|
| `gemini-2.5-flash` | Gemini 2.5 Flash（高速応答） |
| `gemini-2.5-pro` | Gemini 2.5 Pro（品質と速度のバランス） |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview（プレビュー版） |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview（プレビュー版） |

**使用例**：
```bash
# Gemini 2.5 Pro（thinking なし）
opencode run "迅速なタスク" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview（thinking なし）
opencode run "プレビューモデルテスト" --model=google/gemini-3-pro-preview
```

::: info Preview モデル
`gemini-3-*-preview` モデルは Google 公式のプレビュー版であり、不安定であったり、いつでも変更される可能性があります。Thinking 機能を使用したい場合は、`antigravity-gemini-3-*` モデルを使用してください。
:::

## モデル比較概要

| 機能 | Claude 4.5 | Gemini 3 | Gemini 2.5 |
| --- | --- | --- | ---|
| **Thinking サポート** | ✅（thinkingBudget） | ✅（thinkingLevel） | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **クォータプール** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **適用シナリオ** | 複雑な推論、プログラミング | 汎用タスク + 検索 | 高速応答、シンプルなタスク |

## 🎯 モデルの選択方法

### Claude と Gemini、どちらを選ぶか？

- **Claude を選ぶ場合**: より強力な論理的推論能力、より安定したコード生成が必要な場合
- **Gemini 3 を選ぶ場合**: Google Search、より高速な応答速度が必要な場合

### Thinking モードと標準モード、どちらを選ぶか？

- **Thinking を使う場合**: 複雑な推論、複数ステップのタスク、推論プロセスを確認したい場合
- **標準モードを使う場合**: シンプルな質問と回答、高速な応答、推論の表示が不要な場合

### どの Thinking レベルを選ぶか？

| レベル | Claude (トークン) | Gemini 3 | 適用シナリオ |
| --- | --- | --- | ---|
| **minimal** | — | Flash 専用 | 高速タスク、翻訳、要約など |
| **low** | 8192 | Pro/Flash | 品質と速度のバランス、多くのタスクに適 |
| **medium** | — | Flash 専用 | 中程度の複雑さのタスク |
| **high/max** | 32768 | Pro/Flash | 最も複雑なタスク、システム設計、深い分析など |

::: tip 推奨設定
- **日常の開発**: `antigravity-claude-sonnet-4-5-thinking --variant=low`
- **複雑な推論**: `antigravity-claude-opus-4-5-thinking --variant=max`
- **高速な質問と回答 + 検索**: `antigravity-gemini-3-flash --variant=low` + Google Search 有効化
:::

## 完全な設定例

以下の設定を `~/.config/opencode/opencode.json` に追加してください：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
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
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: details 設定をコピー
上記のコードブロック右上のコピーボタンをクリックし、`~/.config/opencode/opencode.json` ファイルに貼り付けてください。
:::

## チェックポイント ✅

モデル選択を習得したことを確認するために、以下のステップを完了してください：

- [ ] Antigravity と Gemini CLI の2つの独立したクォータプールを理解した
- [ ] Claude は thinkingBudget（トークン）、Gemini 3 は thinkingLevel（文字列）を使用することを理解した
- [ ] タスクの複雑さに応じて適切な variant を選択できる
- [ ] 完全な設定を `opencode.json` に追加した

## このレッスンのまとめ

Antigravity Auth は、豊富なモデル選択と柔軟な variant 設定を提供します：

- **Antigravity クォータ**: Claude 4.5 と Gemini 3 をサポートし、Thinking 機能を持つ
- **Gemini CLI クォータ**: Gemini 2.5 と Gemini 3 Preview をサポートし、Thinking 機能なし
- **Variant システム**: `--variant` パラメータで思考レベルを動的に調整でき、複数のモデルを定義する必要なし

モデルを選択する際は、タスクのタイプ（推論 vs 検索）、複雑さ（シンプル vs 複雑）、応答速度の要件を考慮してください。

## 次のレッスンの予告

> 次のレッスンでは **[Thinking モデルの詳細](../thinking-models/)** を学習します。
>
> 学習内容：
> - Claude と Gemini の Thinking モードの原理
> - カスタム thinking 予算の設定方法
> - 思考ブロックを保持するテクニック（signature caching）

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>ソースコードの場所を表示</strong></summary>

> 最終更新：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | ---|
| モデル解析と tier 抽出 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Thinking tier 予算定義 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Gemini 3 thinking レベル定義 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| モデルエイリアスマッピング | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Variant 設定解析 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| 型定義 | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**重要な定数**：
- `THINKING_TIER_BUDGETS`：Claude と Gemini 2.5 の思考予算マッピング（low/medium/high → トークン）
- `GEMINI_3_THINKING_LEVELS`：Gemini 3 がサポートする思考レベル（minimal/low/medium/high）

**重要な関数**：
- `resolveModelWithTier(requestedModel)`：モデル名と思考設定を解析
- `resolveModelWithVariant(requestedModel, variantConfig)`：variant 設定からモデルを解析
- `budgetToGemini3Level(budget)`：トークン予算を Gemini 3 レベルにマッピング

</details>
