---
title: "LLM プルーニング: インテリジェント最適化 | opencode-dynamic-context-pruning"
sidebarTitle: "AI による自動プルーニング"
subtitle: "LLM プルーニング: コンテキストのインテリジェント最適化"
description: "DCP の discard/extract ツールを学び、違いや注入メカニズム、保護機能を理解し、設定オプションを構成し、プルーニング効果を実践検証して、トークンを最適化しコストを削減します。"
tags:
  - "DCP"
  - "コンテキストプルーニング"
  - "AI ツール"
  - "トークン最適化"
prerequisite:
  - "start-configuration"
order: 2
---

# LLM 駆動プルーニングツール：AI によるインテリジェントなコンテキスト最適化

## このレッスンで学べること

- discard と extract ツールの違いと使用シーン
- AI が `<prunable-tools>` リストを使ってプルーニング対象を選択する仕組み
- プルーニングツールの有効化、リマインダー頻度、表示オプションの設定方法
- 保護メカニズムが重要なファイルの誤プルーニングを防ぐ仕組み

## 現在直面している課題

会話が進むにつれ、ツール呼び出しが蓄積し、コンテキストはどんどん大きくなります。以下のような問題に直面しているかもしれません：
- トークン使用量の急増とコスト上昇
- AI が大量の無関係な過去のツール出力を処理する必要がある
- AI に自発的にコンテキストをクリーンアップさせる方法がわからない

従来の解決策は手動クリーンアップですが、これは会話の流れを中断させます。DCP はより良い方法を提供します：AI 自身がコンテキストをクリーンアップするタイミングを判断できるようにします。

## このテクニックを使うタイミング

以下のような場合に有効です：
- 長い会話を頻繁に行い、ツール呼び出しが多く蓄積する
- AI が大量の履歴ツール出力を処理する必要がある
- 会話を中断せずにトークン使用コストを最適化したい
- 具体的なシーンに応じてコンテンツを保持するか削除するかを選択したい

## 基本的な考え方

DCP は、AI が会話中に自発的にコンテキストを最適化するための 2 つのツールを提供します：

| ツール | 用途 | コンテンツ保持 |
| --- | --- | --- |
| **discard** | 完了したタスクやノイズを削除 | ❌ 保持しない |
| **extract** | 重要な発見を抽出後、元のコンテンツを削除 | ✅ 要約情報を保持 |

### 動作メカニズム

AI がメッセージを送信する前に、DCP は以下を実行します：

```
1. 現在のセッション内のツール呼び出しをスキャン
   ↓
2. プルーニング済み、保護対象のツールをフィルタリング
   ↓
3. <prunable-tools> リストを生成
   形式：ID: tool, parameter
   ↓
4. リストをコンテキストに注入
   ↓
5. AI がリストに基づいてツールを選択し discard/extract を呼び出す
   ↓
6. DCP がプルーニングされたコンテンツをプレースホルダーに置換
```

### ツール選択の判断ロジック

AI は以下のフローに従って選択します：

```
「このツール出力の情報を保持する必要があるか？」
  │
  ├─ いいえ → discard（デフォルトのクリーンアップ方法）
  │   - タスク完了、価値のないコンテンツ
  │   - ノイズ、無関係な情報
  │
  ├─ はい → extract（知識を保持）
  │   - 後で参照が必要な重要情報
  │   - 関数シグネチャ、設定値など
  │
  └─ 不明 → extract（より安全）
```

::: info
AI は個々の小さなツール出力ではなく、バッチでプルーニングします。この方が効率的です。
:::

### 保護メカニズム

DCP には、AI が重要なコンテンツを誤ってプルーニングするのを防ぐ複数の保護層があります：

| 保護層 | 説明 | 設定項目 |
| --- | --- | --- |
| **保護対象ツール** | task、write、edit などのコアツールはプルーニング不可 | `tools.settings.protectedTools` |
| **保護対象ファイル** | glob パターンにマッチするファイルパスはプルーニング不可 | `protectedFilePatterns` |
| **ターン保護** | 新しいツールは N ターン以内はプルーニングリストに含まれない | `turnProtection.turns` |

::: tip
デフォルトで保護されるツール：task、todowrite、todoread、discard、extract、batch、write、edit、plan_enter、plan_exit
:::

## 実践してみよう

### ステップ 1：`<prunable-tools>` リストを理解する

会話中、DCP は自動的に `<prunable-tools>` リストを注入します。AI には以下のような内容が表示されます：

```xml
<prunable-tools>
The following tools have been invoked and are available for pruning.
This list does not mandate immediate action.
Consider your current goals and resources you need before discarding valuable tool inputs or outputs.
Consolidate your prunes for efficiency; it is rarely worth pruning a single tiny tool output.
Keep your context free of noise.

5: read, /path/to/auth.ts
12: bash, npm test
18: grep, "function login"
</prunable-tools>
```

**確認すべきポイント**：
- 各行に 1 つのツール、形式は `ID: tool, parameter`
- ID は数値インデックス（0 から開始）
- プルーニング可能なツールのみ表示（プルーニング済み、保護対象、保護ファイルは表示されない）

### ステップ 2：AI が discard を使用するシーンを確認する

AI がタスクを完了し、情報を保持する必要がないと判断した場合：

```
ユーザー入力：認証機能をテストして

AI 出力：
テストが通過しました。認証ロジックは正常に動作しており、テストログを保持する必要はありません。
[discard(ids: ["completion", "5", "12"]) を呼び出し]
```

**確認すべきポイント**：
- AI が `discard` ツールを使用した
- パラメータ形式：`["理由", "ID1", "ID2", ...]`
- 理由は 2 種類のみ：`"completion"`（タスク完了）または `"noise"`（ノイズ）

### ステップ 3：AI が extract を使用するシーンを確認する

AI がタスク完了後に重要な情報を保持する必要がある場合：

```
ユーザー入力：認証サービスの実装を分析して

AI 出力：
いくつかの重要な詳細を発見しました。以下に抽出します：
[extract(ids: ["5", "12"], distillation: [
  "auth.ts: validateToken はキャッシュ (5min TTL) をチェック後、OIDC を呼び出す",
  "bash: npm test 結果 - すべてのテストが通過"
]) を呼び出し]
```

**確認すべきポイント**：
- AI が `extract` ツールを使用した
- `distillation` 配列と `ids` 配列の長さが一致している
- 各抽出コンテンツは 1 つのツール出力の要約情報に対応

### ステップ 4：プルーニングツールオプションを設定する

DCP 設定ファイル（`~/.config/opencode/dcp.jsonc` またはプロジェクトレベルの `.opencode/dcp.jsonc`）を編集します：

```jsonc
{
  "tools": {
    "discard": {
      "enabled": true
    },
    "extract": {
      "enabled": true,
      "showDistillation": false
    },
    "settings": {
      "nudgeEnabled": true,
      "nudgeFrequency": 10,
      "protectedTools": [
        "task",
        "todowrite",
        "todoread",
        "discard",
        "extract",
        "batch",
        "write",
        "edit",
        "plan_enter",
        "plan_exit"
      ]
    }
  }
}
```

**確認すべきポイント**：
- `discard.enabled`：discard ツールを有効化（デフォルト true）
- `extract.enabled`：extract ツールを有効化（デフォルト true）
- `extract.showDistillation`：抽出コンテンツを表示するか（デフォルト false）
- `nudgeEnabled`：プルーニングリマインダーを有効化するか（デフォルト true）
- `nudgeFrequency`：リマインダー頻度（デフォルト 10、つまり 10 回のツール呼び出しごと）

**確認すべきポイント**：
- `showDistillation` が false の場合、抽出コンテンツは会話に表示されない
- `showDistillation` が true の場合、抽出コンテンツは ignored message として表示される

### ステップ 5：プルーニング機能をテストする

1. 長めの会話を行い、複数のツール呼び出しをトリガーする
2. AI が適切なタイミングで discard または extract を呼び出すか観察する
3. `/dcp stats` を使用してプルーニング統計を確認する

**確認すべきポイント**：
- ツール呼び出しが一定数蓄積した後、AI が自発的にプルーニングを開始する
- `/dcp stats` で節約されたトークン数が表示される
- 会話コンテキストが現在のタスクにより集中している

## チェックポイント ✅

::: details クリックして設定を確認

**設定が有効か確認する**

```bash
# DCP 設定を確認
cat ~/.config/opencode/dcp.jsonc

# またはプロジェクトレベルの設定
cat .opencode/dcp.jsonc
```

確認すべきポイント：
- `tools.discard.enabled` が true（discard 有効）
- `tools.extract.enabled` が true（extract 有効）
- `tools.settings.nudgeEnabled` が true（リマインダー有効）

**プルーニングが動作しているか確認する**

会話中、複数のツール呼び出しをトリガーした後：

確認すべきポイント：
- AI が適切なタイミングで discard または extract を呼び出す
- プルーニング通知を受信（プルーニングされたツールと節約されたトークンが表示される）
- `/dcp stats` で累計節約トークンが表示される

:::

## よくある落とし穴

### よくあるエラー 1：AI がツールをプルーニングしない

**考えられる原因**：
- プルーニングツールが有効化されていない
- 保護設定が厳しすぎて、プルーニング可能なツールがない

**解決方法**：
```jsonc
{
  "tools": {
    "discard": {
      "enabled": true  // 有効化を確認
    },
    "extract": {
      "enabled": true  // 有効化を確認
    }
  }
}
```

### よくあるエラー 2：重要なコンテンツを誤ってプルーニングした

**考えられる原因**：
- 重要なファイルが保護パターンに追加されていない
- 保護対象ツールリストが不完全

**解決方法**：
```jsonc
{
  "protectedFilePatterns": [
    "src/auth/*",  // 認証関連ファイルを保護
    "config/*"     // 設定ファイルを保護
  ],
  "tools": {
    "settings": {
      "protectedTools": [
        "read",  // read を保護リストに追加
        "write"
      ]
    }
  }
}
```

### よくあるエラー 3：抽出コンテンツが表示されない

**考えられる原因**：
- `showDistillation` が false に設定されている

**解決方法**：
```jsonc
{
  "tools": {
    "extract": {
      "showDistillation": true  // 表示を有効化
    }
  }
}
```

::: warning
抽出コンテンツは ignored message として表示され、会話コンテキストには影響しません。
:::

## このレッスンのまとめ

DCP は AI が自発的にコンテキストを最適化するための 2 つのツールを提供します：

- **discard**：完了したタスクやノイズを削除、情報を保持する必要がない場合
- **extract**：重要な発見を抽出後、元のコンテンツを削除、要約情報を保持

AI は `<prunable-tools>` リストを通じてプルーニング可能なツールを把握し、シーンに応じて適切なツールを選択します。保護メカニズムにより、重要なコンテンツが誤ってプルーニングされることを防ぎます。

設定のポイント：
- ツールの有効化：`tools.discard.enabled` と `tools.extract.enabled`
- 抽出コンテンツの表示：`tools.extract.showDistillation`
- リマインダー頻度の調整：`tools.settings.nudgeFrequency`
- 重要なツールとファイルの保護：`protectedTools` と `protectedFilePatterns`

## 次のレッスンの予告

> 次のレッスンでは **[スラッシュコマンドの使用](../commands/)** を学びます
>
> 学べること：
> - `/dcp context` を使用して現在のセッションのトークン分布を確認
> - `/dcp stats` を使用して累計プルーニング統計を確認
> - `/dcp sweep` を使用して手動でプルーニングをトリガー

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| discard ツール定義 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L180) | 155-180 |
| extract ツール定義 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| プルーニング操作実行 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L26-L153) | 26-153 |
| --- | --- | --- |
| プルーニングコンテキスト注入 | [`lib/messages/inject.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/inject.ts#L102-L156) | 102-156 |
| discard ツール仕様 | [`lib/prompts/discard-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/discard-tool-spec.ts#L1-L41) | 1-41 |
| extract ツール仕様 | [`lib/prompts/extract-tool-spec.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/extract-tool-spec.ts#L1-L48) | 1-48 |
| システムプロンプト（両方） | [`lib/prompts/system/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/system/both.ts#L1-L60) | 1-60 |
| リマインダープロンプト | [`lib/prompts/nudge/both.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/prompts/nudge/both.ts#L1-L10) | 1-10 |
| 設定定義 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L436-L449) | 436-449 |
| デフォルト保護対象ツール | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-L441) | 438-441 |

**主要な定数**：
- `DISCARD_TOOL_DESCRIPTION`：discard ツールのプロンプト説明
- `EXTRACT_TOOL_DESCRIPTION`：extract ツールのプロンプト説明
- `DEFAULT_PROTECTED_TOOLS`：デフォルト保護対象ツールリスト

**主要な関数**：
- `createDiscardTool(ctx)`：discard ツールを作成
- `createExtractTool(ctx)`：extract ツールを作成
- `executePruneOperation(ctx, toolCtx, ids, reason, toolName, distillation)`：プルーニング操作を実行
- `buildPrunableToolsList(state, config, logger, messages)`：プルーニング可能なツールリストを生成
- `insertPruneToolContext(state, config, logger, messages)`：プルーニングコンテキストを注入

**設定項目**：
- `tools.discard.enabled`：discard ツールを有効化するか（デフォルト true）
- `tools.extract.enabled`：extract ツールを有効化するか（デフォルト true）
- `tools.extract.showDistillation`：抽出コンテンツを表示するか（デフォルト false）
- `tools.settings.nudgeEnabled`：リマインダーを有効化するか（デフォルト true）
- `tools.settings.nudgeFrequency`：リマインダー頻度（デフォルト 10）
- `tools.settings.protectedTools`：保護対象ツールリスト
- `protectedFilePatterns`：保護対象ファイル glob パターン

</details>
