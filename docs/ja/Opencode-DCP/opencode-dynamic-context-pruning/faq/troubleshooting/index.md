---
title: "FAQ: よくある問題のトラブルシューティング | opencode-dcp"
sidebarTitle: "問題が発生したら"
subtitle: "よくある問題と解決方法"
description: "OpenCode DCP 使用時によくある問題の解決方法を学びます。設定エラーの修正、デバッグモードの有効化、Token が削減されない原因など、トラブルシューティングのヒントを紹介します。"
tags:
  - "FAQ"
  - "troubleshooting"
  - "設定"
  - "デバッグ"
prerequisite:
  - "start-getting-started"
order: 1
---

# よくある問題と解決方法

## 設定に関する問題

### 設定が反映されないのはなぜですか？

DCP の設定ファイルは優先順位に従ってマージされます：**デフォルト値 < グローバル < 環境変数 < プロジェクト**。プロジェクトレベルの設定が最も優先されます。

**確認手順**：

1. **設定ファイルの場所を確認**：
   ```bash
   # macOS/Linux
   ls -la ~/.config/opencode/dcp.jsonc
   ls -la ~/.config/opencode/dcp.json

   # またはプロジェクトルートディレクトリ
   ls -la .opencode/dcp.jsonc
   ```

2. **適用されている設定を確認**：
   デバッグモードを有効にすると、DCP は初回の設定読み込み時に設定情報をログファイルに出力します。

3. **OpenCode を再起動**：
   設定を変更した後は、OpenCode を再起動する必要があります。

::: tip 設定の優先順位
複数の設定ファイルが存在する場合、プロジェクトレベルの設定（`.opencode/dcp.jsonc`）がグローバル設定を上書きします。
:::

### 設定ファイルでエラーが発生した場合は？

DCP は設定エラーを検出すると Toast 警告を表示し（7 秒後に表示）、デフォルト値にフォールバックします。

**よくあるエラータイプ**：

| エラータイプ | 問題の説明 | 解決方法 |
| --- | --- | --- |
| 型エラー | `pruneNotification` は `"off" | "minimal" | "detailed"` である必要があります | 列挙値のスペルを確認 |
| 配列エラー | `protectedFilePatterns` は文字列配列である必要があります | `["pattern1", "pattern2"]` 形式を使用 |
| 不明なキー | 設定ファイルにサポートされていないキーが含まれています | 不明なキーを削除またはコメントアウト |

**デバッグログを有効にして詳細なエラーを確認**：

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true  // デバッグログを有効化
}
```

ログファイルの場所：`~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`

---

## 機能に関する問題

### Token 使用量が減らないのはなぜですか？

DCP は**ツール呼び出し**の内容のみを剪定します。会話でツールを使用していない場合、または使用しているツールがすべて保護対象の場合、Token は削減されません。

**考えられる原因**：

1. **保護対象ツール**
   デフォルトで保護されているツール：`task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

2. **ターン保護が有効期間内**
   `turnProtection` が有効な場合、保護期間中のツールは剪定されません。

3. **会話に重複または剪定可能なコンテンツがない**
   DCP の自動戦略は以下のみを対象とします：
   - 重複するツール呼び出し（重複排除）
   - 読み取りで上書きされた書き込み操作（上書き書き込み）
   - 期限切れのエラーツール入力（エラークリア）

**確認方法**：

```bash
# OpenCode で入力
/dcp context
```

出力の `Pruned` フィールドを確認し、剪定されたツール数と節約された Token を把握します。

::: info 手動剪定
自動戦略がトリガーされない場合は、`/dcp sweep` を使用して手動でツールを剪定できます。
:::

### サブエージェントセッションで剪定されないのはなぜですか？

**これは想定された動作です**。DCP はサブエージェントセッションでは完全に無効化されます。

**理由**：サブエージェントの設計目標は、Token 使用量の最適化ではなく、簡潔な発見サマリーを返すことです。DCP の剪定はサブエージェントの要約動作を妨げる可能性があります。

**サブエージェントセッションかどうかの判断方法**：
- セッションメタデータの `parentID` フィールドを確認
- デバッグログを有効にすると、`isSubAgent: true` のマークが表示されます

---

## デバッグとログ

### デバッグログを有効にするには？

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true
}
```

**ログファイルの場所**：
- **日次ログ**：`~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`
- **コンテキストスナップショット**：`~/.config/opencode/logs/dcp/context/{sessionId}/{timestamp}.json`

::: warning パフォーマンスへの影響
デバッグログはディスクにファイルを書き込むため、パフォーマンスに影響する可能性があります。本番環境ではオフにすることをお勧めします。
:::

### 現在のセッションの Token 分布を確認するには？

```bash
# OpenCode で入力
/dcp context
```

**出力例**：

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

### 累計剪定統計を確認するには？

```bash
# OpenCode で入力
/dcp stats
```

これにより、すべての履歴セッションの累計剪定 Token 数が表示されます。

---

## Prompt Caching 関連

### DCP は Prompt Caching に影響しますか？

**はい**、影響しますが、トレードオフを考慮すると通常はプラスの効果があります。

LLM プロバイダー（Anthropic、OpenAI など）は**正確なプレフィックスマッチング**に基づいて prompt をキャッシュします。DCP がツール出力を剪定すると、メッセージ内容が変更され、その時点以降のキャッシュが無効になります。

**実際のテスト結果**：
- DCP なし：キャッシュヒット率約 85%
- DCP 有効：キャッシュヒット率約 65%

**ただし、Token の節約は通常キャッシュの損失を上回ります**。特に長い会話では顕著です。

**最適な使用シナリオ**：
- リクエスト単位で課金されるサービス（GitHub Copilot、Google Antigravity など）を使用する場合、キャッシュの損失による悪影響はありません

---

## 高度な設定

### 特定のファイルを剪定から保護するには？

`protectedFilePatterns` で glob パターンを設定します：

```jsonc
{
    "protectedFilePatterns": [
        "src/config/*",     // config ディレクトリを保護
        "*.env",           // すべての .env ファイルを保護
        "**/secrets/**"    // secrets ディレクトリを保護
    ]
}
```

パターンはツールパラメータの `filePath` フィールド（`read`、`write`、`edit` ツールなど）にマッチします。

### 保護対象ツールをカスタマイズするには？

各戦略とツール設定には `protectedTools` 配列があります：

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_tool"]  // 追加で保護するツール
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["another_tool"]
        }
    },
    "commands": {
        "protectedTools": ["sweep_protected"]
    }
}
```

これらの設定はデフォルトの保護対象ツールリストに**追加**されます。

---

## よくあるエラーシナリオ

### エラー：DCP が読み込まれない

**考えられる原因**：
1. プラグインが `opencode.jsonc` に登録されていない
2. プラグインのインストールに失敗した
3. OpenCode のバージョンが互換性がない

**解決方法**：
1. `opencode.jsonc` に `"plugin": ["@tarquinen/opencode-dcp@latest"]` が含まれているか確認
2. OpenCode を再起動
3. ログファイルで読み込み状態を確認

### エラー：設定ファイルが無効な JSON

**考えられる原因**：
- カンマの欠落
- 余分なカンマ
- 文字列がダブルクォートで囲まれていない
- JSONC コメントの形式エラー

**解決方法**：
JSONC をサポートするエディタ（VS Code など）で編集するか、オンラインの JSON バリデーターで構文をチェックしてください。

### エラー：/dcp コマンドが応答しない

**考えられる原因**：
- `commands.enabled` が `false` に設定されている
- プラグインが正しく読み込まれていない

**解決方法**：
1. 設定ファイルで `"commands.enabled"` が `true` になっているか確認
2. プラグインが読み込まれているか確認（ログを確認）

---

## ヘルプを得る

上記の方法で問題が解決しない場合：

1. **デバッグログを有効にして**問題を再現
2. **コンテキストスナップショットを確認**：`~/.config/opencode/logs/dcp/context/{sessionId}/`
3. **GitHub で Issue を作成**：
   - ログファイルを添付（機密情報は削除）
   - 再現手順を記載
   - 期待される動作と実際の動作を説明

---

## 次のレッスンの予告

> 次のレッスンでは **[DCP ベストプラクティス](../best-practices/)** を学びます。
>
> 学習内容：
> - Prompt Caching と Token 節約のトレードオフ
> - 設定の優先順位ルールと使用戦略
> - 保護メカニズムの選択と設定
> - コマンドの使用テクニックと最適化のヒント

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| 設定検証 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375) | 147-375 |
| 設定エラー処理 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L391-421) | 391-421 |
| ログシステム | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L6-109) | 6-109 |
| コンテキストスナップショット | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L196-210) | 196-210 |
| サブエージェント検出 | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8) | 1-8 |
| 保護対象ツール | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79) | 68-79 |

**主要な関数**：
- `validateConfigTypes()`：設定項目の型を検証
- `getInvalidConfigKeys()`：設定ファイル内の不明なキーを検出
- `Logger.saveContext()`：デバッグ用にコンテキストスナップショットを保存
- `isSubAgentSession()`：サブエージェントセッションを検出

</details>
