---
title: "トークン最適化: コンテキストウィンドウ | Everything Claude Code"
sidebarTitle: "コンテキストウィンドウが飽和したら"
subtitle: "トークン最適化: コンテキストウィンドウ"
description: "Claude Code のトークン最適化戦略を学びます。モデル選択、戦略的圧縮、MCP 設定をマスターし、コンテキストウィンドウの効率を最大化して応答品質を向上させましょう。"
tags:
  - "token-optimization"
  - "context-management"
  - "performance"
prerequisite:
  - "start-quick-start"
order: 110
---

# トークン最適化戦略：コンテキストウィンドウ管理

## このレッスンで学べること

- タスクの種類に応じて適切なモデルを選択し、コストとパフォーマンスのバランスを取る
- 戦略的圧縮を使用して、論理的な区切りで重要なコンテキストを保持する
- MCP サーバーを適切に設定し、コンテキストウィンドウの過度な消費を避ける
- コンテキストウィンドウの飽和を防ぎ、応答品質を維持する

## あなたが直面している課題

こんな問題に遭遇したことはありませんか？

- 会話の途中で突然コンテキストが圧縮され、重要な情報が失われた
- MCP サーバーを有効にしすぎて、コンテキストウィンドウが 200k から 70k に減少した
- 大規模なリファクタリング中に、モデルが以前の議論を「忘れて」しまった
- いつ圧縮すべきか、いつすべきでないかがわからない

## このテクニックを使うタイミング

- **複雑なタスクを処理する時** - 適切なモデルとコンテキスト管理戦略を選択
- **コンテキストウィンドウが飽和に近づいた時** - 戦略的圧縮で重要な情報を保持
- **MCP サーバーを設定する時** - ツール数とコンテキスト容量のバランスを取る
- **長時間のセッション時** - 論理的な区切りで圧縮し、自動圧縮による情報損失を防ぐ

## 核心となる考え方

トークン最適化の本質は「使用量を減らす」ことではなく、**重要な瞬間に価値ある情報を保持する**ことです。

### 3つの最適化の柱

1. **モデル選択戦略** - タスクごとに異なるモデルを使用し、「大は小を兼ねる」を避ける
2. **戦略的圧縮** - 任意のタイミングではなく、論理的な区切りで圧縮
3. **MCP 設定管理** - 有効なツール数を制御し、コンテキストウィンドウを保護

### 重要な概念

::: info コンテキストウィンドウとは？

コンテキストウィンドウは、Claude Code が「記憶」できる会話履歴の長さです。現在のモデルは約 200k トークンをサポートしていますが、以下の要因の影響を受けます：

- **有効な MCP サーバー** - 各 MCP はシステムプロンプトのスペースを消費
- **ロードされた Skills** - スキル定義がコンテキストを占有
- **会話履歴** - あなたと Claude の対話記録

コンテキストが飽和に近づくと、Claude は自動的に履歴を圧縮し、重要な情報が失われる可能性があります。
:::

::: tip なぜ手動圧縮が優れているのか？

Claude の自動圧縮は任意のタイミングでトリガーされ、タスクの途中でフローを中断することがよくあります。戦略的圧縮により、**論理的な区切り**（計画完了後、タスク切り替え前など）で主体的に圧縮し、重要なコンテキストを保持できます。
:::

## 実践してみよう

### ステップ 1：適切なモデルを選択する

タスクの複雑さに応じてモデルを選択し、コストとコンテキストの無駄を避けます。

**なぜ重要か**

モデルによって推論能力とコストが大きく異なり、適切な選択で大量のトークンを節約できます。

**モデル選択ガイド**

| モデル | 適用シーン | コスト | 推論能力 |
| --- | --- | --- | --- |
| **Haiku 4.5** | 軽量エージェント、頻繁な呼び出し、コード生成 | 低（Sonnet の 1/3） | Sonnet の 90% の能力 |
| **Sonnet 4.5** | メイン開発作業、複雑なコーディングタスク、オーケストレーション | 中 | 最高のコーディングモデル |
| **Opus 4.5** | アーキテクチャ決定、深い推論、研究分析 | 高 | 最強の推論能力 |

**設定方法**

`agents/` ディレクトリのエージェントファイルで設定：

```markdown
---
name: planner
description: 複雑な機能の実装ステップを計画
model: opus
---

あなたは上級プランナーです...
```

**期待される結果**：
- 高度な推論タスク（アーキテクチャ設計など）で Opus を使用し、品質が向上
- コーディングタスクで Sonnet を使用し、コストパフォーマンスが最適
- 頻繁に呼び出される worker エージェントで Haiku を使用し、コストを節約

### ステップ 2：戦略的圧縮 Hook を有効にする

論理的な区切りでコンテキスト圧縮を促す Hook を設定します。

**なぜ重要か**

自動圧縮は任意のタイミングでトリガーされ、重要な情報が失われる可能性があります。戦略的圧縮により、圧縮のタイミングを自分で決定できます。

**設定手順**

`hooks/hooks.json` に PreToolUse と PreCompact の設定があることを確認：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Edit\" || tool == \"Write\"",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
          }
        ],
        "description": "Suggest manual compaction at logical intervals"
      }
    ],
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
          }
        ],
        "description": "Save state before context compaction"
      }
    ]
  }
}
```

**しきい値のカスタマイズ**

環境変数 `COMPACT_THRESHOLD` で提案頻度を制御（デフォルトは 50 回のツール呼び出し）：

```json
// ~/.claude/settings.json に追加
{
  "env": {
    "COMPACT_THRESHOLD": "50"  // 50 回のツール呼び出し後に最初の提案
  }
}
```

**期待される結果**：
- ファイルの編集や書き込みのたびに、Hook がツール呼び出し回数をカウント
- しきい値（デフォルト 50 回）に達すると、以下のプロンプトが表示：
  ```
  [StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
  ```
- その後 25 回のツール呼び出しごとに、以下のプロンプトが表示：
  ```
  [StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
  ```

### ステップ 3：論理的な区切りで圧縮する

Hook のプロンプトに従って、適切なタイミングで手動圧縮を実行します。

**なぜ重要か**

タスクの切り替えやマイルストーン完了後に圧縮することで、重要なコンテキストを保持し、冗長な情報をクリアできます。

**圧縮タイミングガイド**

✅ **圧縮に適したタイミング**：
- 計画完了後、実装開始前
- 機能のマイルストーン完了後、次のマイルストーン開始前
- デバッグ完了後、開発継続前
- 異なるタイプのタスクに切り替える時

❌ **圧縮を避けるべきタイミング**：
- 機能実装の途中
- デバッグの最中
- 複数の関連ファイルを修正中

**操作手順**

Hook のプロンプトが表示されたら：

1. 現在のタスクフェーズを評価
2. 圧縮に適している場合、以下を実行：
   ```bash
   /compact
   ```
3. Claude がコンテキストを要約するのを待つ
4. 重要な情報が保持されていることを確認

**期待される結果**：
- 圧縮後、コンテキストウィンドウの大量のスペースが解放される
- 重要な情報（実装計画、完了した機能など）が保持される
- 新しいインタラクションが簡潔なコンテキストから開始される

### ステップ 4：MCP 設定を最適化する

有効な MCP サーバーの数を制御し、コンテキストウィンドウを保護します。

**なぜ重要か**

各 MCP サーバーはシステムプロンプトのスペースを消費します。有効にしすぎると、コンテキストウィンドウが大幅に圧縮されます。

**設定の原則**

README の経験に基づく：

```json
{
  "mcpServers": {
    // 20-30 個の MCP を設定可能...
    "github": { ... },
    "supabase": { ... },
    // ...その他の設定
  },
  "disabledMcpServers": [
    "firecrawl",       // 使用頻度の低い MCP を無効化
    "clickhouse",
    // ...プロジェクトの要件に応じて無効化
  ]
}
```

**ベストプラクティス**：

- **すべての MCP を設定**（20-30 個）し、プロジェクトで柔軟に切り替え
- **有効な MCP は 10 個未満**に保ち、アクティブなツールは 80 個未満に維持
- **プロジェクトに応じて選択**：バックエンド開発時はデータベース関連を有効化、フロントエンド時はビルド関連を有効化

**検証方法**

ツール数を確認：

```bash
// Claude Code が現在有効なツールを表示
/tool list
```

**期待される結果**：
- ツール総数が 80 個未満
- コンテキストウィンドウが 180k 以上を維持（70k 以下への低下を回避）
- プロジェクトの要件に応じて有効リストを動的に調整

### ステップ 5：Memory Persistence と連携する

Hooks を使用して、圧縮後も重要な状態を保持します。

**なぜ重要か**

戦略的圧縮はコンテキストを失いますが、重要な状態（実装計画、チェックポイントなど）は保持する必要があります。

**Hooks の設定**

以下の Hook が有効になっていることを確認：

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
          }
        ],
        "description": "Load previous context and detect package manager on new session"
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
          }
        ],
        "description": "Persist session state on end"
      }
    ]
  }
}
```

**ワークフロー**：

1. タスク完了後、`/checkpoint` で状態を保存
2. コンテキスト圧縮前に、PreCompact Hook が自動的に保存
3. 新しいセッション開始時に、SessionStart Hook が自動的にロード
4. 重要な情報（計画、状態）が永続化され、圧縮の影響を受けない

**期待される結果**：
- 圧縮後も重要な状態が利用可能
- 新しいセッションで以前のコンテキストが自動的に復元
- 重要な決定と実装計画が失われない

## チェックポイント ✅

- [ ] `strategic-compact` Hook を設定済み
- [ ] タスクに応じて適切なモデル（Haiku/Sonnet/Opus）を選択
- [ ] 有効な MCP が 10 個未満、ツール総数が 80 個未満
- [ ] 論理的な区切り（計画完了/マイルストーン）で圧縮
- [ ] Memory Persistence Hooks が有効で、重要な状態を保持可能

## よくある落とし穴

### ❌ よくある間違い 1：すべてのタスクで Opus を使用

**問題**：Opus は最強ですが、コストは Sonnet の 10 倍、Haiku の 30 倍です。

**修正**：タスクの種類に応じてモデルを選択：
- 頻繁に呼び出されるエージェント（コードレビュー、フォーマットなど）には Haiku
- メイン開発作業には Sonnet
- アーキテクチャ決定、深い推論には Opus

### ❌ よくある間違い 2：Hook の圧縮プロンプトを無視

**問題**：`[StrategicCompact]` プロンプトが表示された後も作業を続け、最終的にコンテキストが自動圧縮され、重要な情報が失われる。

**修正**：タスクフェーズを評価し、適切なタイミングでプロンプトに応じて `/compact` を実行。

### ❌ よくある間違い 3：すべての MCP サーバーを有効化

**問題**：20 個以上の MCP を設定してすべて有効にし、コンテキストウィンドウが 200k から 70k に低下。

**修正**：`disabledMcpServers` を使用して使用頻度の低い MCP を無効化し、アクティブな MCP を 10 個未満に維持。

### ❌ よくある間違い 4：実装中に圧縮

**問題**：機能実装中のコンテキストを圧縮し、モデルが以前の議論を「忘れて」しまう。

**修正**：論理的な区切り（計画完了、タスク切り替え、マイルストーン完了）でのみ圧縮。

## このレッスンのまとめ

トークン最適化の核心は**重要な瞬間に価値ある情報を保持する**ことです：

1. **モデル選択** - Haiku/Sonnet/Opus にはそれぞれ適したシーンがあり、適切な選択でコストを節約
2. **戦略的圧縮** - 論理的な区切りで手動圧縮し、自動圧縮による情報損失を回避
3. **MCP 管理** - 有効数を制御し、コンテキストウィンドウを保護
4. **Memory Persistence** - 圧縮後も重要な状態を利用可能に

これらの戦略に従うことで、Claude Code のコンテキスト効率を最大化し、コンテキスト飽和による品質低下を防ぐことができます。

## 次のレッスンの予告

> 次のレッスンでは **[検証ループ：Checkpoint と Evals](../verification-loop/)** を学びます。
>
> 学べること：
> - Checkpoint を使用して作業状態を保存・復元する方法
> - 継続的検証のための Eval Harness 手法
> - Grader タイプと Pass@K メトリクス
> - TDD における検証ループの適用

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| 戦略的圧縮 Skill | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| 圧縮提案 Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| 圧縮前保存 Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| パフォーマンス最適化ルール | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Hooks 設定 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| コンテキストウィンドウ説明 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 349-359 |

**主要な定数**：
- `COMPACT_THRESHOLD = 50`：ツール呼び出しのしきい値（デフォルト値）
- `MCP_LIMIT = 10`：推奨される有効 MCP 数の上限
- `TOOL_LIMIT = 80`：推奨されるツール総数の上限

**主要な関数**：
- `suggest-compact.js:main()`：ツール呼び出し回数をカウントし、圧縮を提案
- `pre-compact.js:main()`：圧縮前にセッション状態を保存

</details>
