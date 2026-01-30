---
title: "設定: DCP マルチレベル設定 | opencode-dcp"
sidebarTitle: "DCP をカスタマイズ"
subtitle: "設定: DCP マルチレベル設定"
description: "opencode-dcp のマルチレベル設定システムを学びます。グローバル、環境、プロジェクトレベルの設定優先順位ルール、プルーニング戦略設定、保護メカニズム設定、通知レベル調整をマスターしましょう。"
tags:
  - "設定"
  - "DCP"
  - "プラグイン設定"
prerequisite:
  - "start-getting-started"
order: 2
---

# DCP 設定完全ガイド

## 学習後にできること

- DCP の 3 段階設定システム（グローバル、プロジェクト、環境変数）をマスターする
- 設定の優先順位ルールを理解し、どの設定が適用されるかを把握する
- 必要に応じてプルーニング戦略と保護メカニズムを調整する
- 通知レベルを設定し、プルーニング通知の詳細度を制御する

## 現在の課題

DCP はインストール後、デフォルト設定で動作しますが、以下のような問題に直面することがあります：

- プロジェクトごとに異なるプルーニング戦略を設定したい
- 特定のファイルをプルーニングから除外したい
- プルーニング通知が頻繁すぎる、または詳細すぎる
- 特定の自動プルーニング戦略を無効にしたい

このような場合、DCP の設定システムを理解する必要があります。

## このテクニックを使うタイミング

- **プロジェクト別カスタマイズ**：プロジェクトごとに異なるプルーニング要件がある場合
- **問題のデバッグ**：debug ログを有効にして問題を特定する場合
- **パフォーマンスチューニング**：戦略のオン/オフや閾値を調整する場合
- **個人設定**：通知レベルの変更、重要なツールの保護

## 基本コンセプト

DCP は**3 段階設定システム**を採用しており、優先順位は低い順に以下の通りです：

```
デフォルト値（ハードコード）→ グローバル設定 → 環境変数設定 → プロジェクト設定
          優先順位最低                                    優先順位最高
```

各レベルの設定は、前のレベルの同名設定項目を上書きするため、プロジェクト設定が最も優先されます。

::: info なぜマルチレベル設定が必要なのか？

この設計の目的は：
- **グローバル設定**：すべてのプロジェクトに適用される共通のデフォルト動作を設定
- **プロジェクト設定**：特定のプロジェクト向けにカスタマイズし、他のプロジェクトに影響を与えない
- **環境変数**：異なる環境（CI/CD など）で設定を素早く切り替える

:::

## 🎒 始める前の準備

[インストールとクイックスタート](../getting-started/)を完了し、DCP プラグインが正常にインストールされ、OpenCode で動作していることを確認してください。

## 手順に従って進めましょう

### ステップ 1：現在の設定を確認する

**理由**
まずデフォルト設定を把握してから、調整方法を決めましょう。

DCP は初回実行時にグローバル設定ファイルを自動作成します。

```bash
# macOS/Linux
cat ~/.config/opencode/dcp.jsonc

# Windows PowerShell
Get-Content "$env:USERPROFILE\.config\opencode\dcp.jsonc"
```

**期待される結果**：以下のようなデフォルト設定が表示されます

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    "enabled": true,
    "debug": false,
    "pruneNotification": "detailed",
    "commands": {
        "enabled": true,
        "protectedTools": []
    },
    "turnProtection": {
        "enabled": false,
        "turns": 4
    },
    "protectedFilePatterns": [],
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 10,
            "protectedTools": []
        },
        "discard": {
            "enabled": true
        },
        "extract": {
            "enabled": true,
            "showDistillation": false
        }
    },
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": []
        },
        "supersedeWrites": {
            "enabled": false
        },
        "purgeErrors": {
            "enabled": true,
            "turns": 4,
            "protectedTools": []
        }
    }
}
```

### ステップ 2：設定ファイルの場所を理解する

DCP は 3 つのレベルの設定ファイルをサポートしています：

| レベル | パス | 優先順位 | 使用シーン |
| --- | --- | --- | --- |
| **グローバル** | `~/.config/opencode/dcp.jsonc` または `dcp.json` | 2 | すべてのプロジェクトのデフォルト設定 |
| **環境変数** | `$OPENCODE_CONFIG_DIR/dcp.jsonc` または `dcp.json` | 3 | 特定環境の設定 |
| **プロジェクト** | `<project>/.opencode/dcp.jsonc` または `dcp.json` | 4 | 単一プロジェクトの設定オーバーライド |

::: tip 設定ファイル形式

DCP は `.json` と `.jsonc` の 2 つの形式をサポートしています：
- `.json`：標準 JSON 形式、コメント不可
- `.jsonc`：`//` コメントをサポートする JSON 形式（推奨）

:::

### ステップ 3：プルーニング通知を設定する

**理由**
DCP がプルーニング通知を表示する詳細度を制御し、過度な通知を避けます。

グローバル設定ファイルを編集します：

```jsonc
{
    "pruneNotification": "detailed"  // 選択肢: "off", "minimal", "detailed"
}
```

**通知レベルの説明**：

| レベル | 動作 | 使用シーン |
| --- | --- | --- |
| **off** | プルーニング通知を表示しない | 開発に集中、フィードバック不要 |
| **minimal** | 簡易統計のみ表示（節約したトークン数） | シンプルなフィードバックが必要、詳細情報は不要 |
| **detailed** | プルーニングの詳細情報を表示（ツール名、理由） | プルーニング動作の把握、設定のデバッグ |

**期待される結果**：設定変更後、次回プルーニングがトリガーされると、新しいレベルで通知が表示されます。

### ステップ 4：自動プルーニング戦略を設定する

**理由**
DCP は 3 つの自動プルーニング戦略を提供しており、必要に応じてオン/オフを切り替えられます。

設定ファイルを編集します：

```jsonc
{
    "strategies": {
        // 重複排除戦略：重複するツール呼び出しを削除
        "deduplication": {
            "enabled": true,           // 有効/無効
            "protectedTools": []         // 追加で保護するツール名
        },

        // 上書き書き込み戦略：読み取りで上書きされた書き込み操作をクリーンアップ
        "supersedeWrites": {
            "enabled": false          // デフォルトで無効
        },

        // エラークリア戦略：期限切れのエラーツールの入力をクリーンアップ
        "purgeErrors": {
            "enabled": true,           // 有効/無効
            "turns": 4,               // 何ターン後にエラーをクリアするか
            "protectedTools": []         // 追加で保護するツール名
        }
    }
}
```

**戦略の詳細**：

- **deduplication（重複排除）**：デフォルトで有効。同じツールとパラメータの呼び出しを検出し、最新のものだけを保持します。
- **supersedeWrites（上書き書き込み）**：デフォルトで無効。書き込み操作の後に読み取りがある場合、その書き込み操作の入力をクリーンアップします。
- **purgeErrors（エラークリア）**：デフォルトで有効。指定したターン数を超えたエラーツールはプルーニングされます（エラーメッセージのみ保持し、大きくなりがちな入力パラメータを削除）。

### ステップ 5：保護メカニズムを設定する

**理由**
重要なコンテンツ（重要なファイル、コアツールなど）の誤ったプルーニングを防ぎます。

DCP は 3 つの保護メカニズムを提供しています：

#### 1. ターン保護（Turn Protection）

最近の数ターンのツール出力を保護し、AI が参照するのに十分な時間を確保します。

```jsonc
{
    "turnProtection": {
        "enabled": false,   // 有効にすると最近 4 ターンを保護
        "turns": 4          // 保護するターン数
    }
}
```

**使用シーン**：AI が頻繁にコンテキストを失う場合に有効にします。

#### 2. 保護ツール（Protected Tools）

一部のツールはデフォルトで常にプルーニングされません：

```
task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
```

追加で保護が必要なツールを追加できます：

```jsonc
{
    "tools": {
        "settings": {
            "protectedTools": [
                "myCustomTool",   // カスタムツールを追加
                "databaseQuery"    // 保護が必要なツールを追加
            ]
        }
    },
    "strategies": {
        "deduplication": {
            "protectedTools": ["databaseQuery"]  // 特定の戦略でツールを保護
        }
    }
}
```

#### 3. 保護ファイルパターン（Protected File Patterns）

glob パターンを使用して特定のファイルを保護します：

```jsonc
{
    "protectedFilePatterns": [
        "**/*.config.ts",           // すべての .config.ts ファイルを保護
        "**/secrets/**",           // secrets ディレクトリ内のすべてのファイルを保護
        "**/*.env",                // 環境変数ファイルを保護
        "**/critical/*.json"        // critical ディレクトリ内の JSON ファイルを保護
    ]
}
```

::: warning 注意
protectedFilePatterns は `tool.parameters.filePath` にマッチします。ファイルの実際のパスではありません。つまり、`filePath` パラメータを持つツール（read、write、edit など）にのみ適用されます。

:::

### ステップ 6：プロジェクトレベルの設定を作成する

**理由**
プロジェクトごとに異なるプルーニング戦略が必要な場合があります。

プロジェクトルートに `.opencode` ディレクトリを作成し（存在しない場合）、`dcp.jsonc` を作成します：

```bash
# プロジェクトルートで実行
mkdir -p .opencode
cat > .opencode/dcp.jsonc << 'EOF'
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    // このプロジェクト固有の設定
    "strategies": {
        "supersedeWrites": {
            "enabled": true   // このプロジェクトで上書き書き込み戦略を有効化
        }
    },
    "protectedFilePatterns": [
        "**/config/**/*.ts"   // このプロジェクトの設定ファイルを保護
    ]
}
EOF
```

**期待される結果**：
- プロジェクトレベルの設定はグローバル設定の同名項目を上書きします
- 上書きされていない項目は引き続きグローバル設定を使用します

### ステップ 7：デバッグログを有効にする

**理由**
問題が発生した場合、詳細なデバッグログを確認します。

設定ファイルを編集します：

```jsonc
{
    "debug": true
}
```

**ログの場所**：
```
~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log
```

**期待される結果**：ログファイルにプルーニング操作、設定読み込みなどの詳細情報が含まれます。

::: info 本番環境での推奨事項
デバッグ完了後は `debug` を `false` に戻すことを忘れずに。ログファイルの急速な増大を防ぎます。

:::

## チェックポイント ✅

上記のステップを完了したら、以下を確認してください：

- [ ] 設定ファイルの 3 つのレベルと優先順位を理解している
- [ ] 通知レベルを変更し、効果を確認できる
- [ ] 3 つの自動プルーニング戦略の役割を理解している
- [ ] 保護メカニズム（ターン、ツール、ファイル）を設定できる
- [ ] プロジェクトレベルの設定でグローバル設定を上書きできる

## よくある落とし穴

### 設定変更が反映されない

**問題**：設定ファイルを変更しても、OpenCode に反映されない。

**原因**：OpenCode は設定ファイルを自動的に再読み込みしません。

**解決策**：設定変更後は **OpenCode を再起動**してください。

### 設定ファイルの構文エラー

**問題**：設定ファイルに構文エラーがあり、DCP が解析できない。

**症状**：OpenCode が「Invalid config」という Toast 警告を表示します。

**解決策**：JSON 構文を確認してください。特に：
- 引用符、カンマ、括弧が正しく対応しているか
- 余分なカンマがないか（最後の要素の後のカンマなど）
- ブール値は `true`/`false` を使用し、引用符で囲まない

**推奨**：JSONC をサポートするエディタ（VS Code + JSONC プラグインなど）を使用してください。

### 保護ツールが機能しない

**問題**：`protectedTools` を追加したが、ツールがまだプルーニングされる。

**原因**：
1. ツール名のスペルミス
2. 間違った `protectedTools` 配列に追加した（`tools.settings.protectedTools` vs `strategies.deduplication.protectedTools`）
3. ツール呼び出しがターン保護期間内（ターン保護が有効な場合）

**解決策**：
1. ツール名のスペルが正しいことを確認
2. 正しい場所に追加されているか確認
3. debug ログでプルーニングの理由を確認

## このレッスンのまとめ

DCP 設定システムの重要ポイント：

- **3 段階設定**：デフォルト値 → グローバル → 環境変数 → プロジェクト、優先順位は昇順
- **柔軟なオーバーライド**：プロジェクト設定でグローバル設定を上書き可能
- **保護メカニズム**：ターン保護、保護ツール、保護ファイルパターンで誤ったプルーニングを防止
- **自動戦略**：重複排除、上書き書き込み、エラークリアを必要に応じてオン/オフ
- **再起動で反映**：設定変更後は OpenCode の再起動を忘れずに

## 次のレッスンの予告

> 次のレッスンでは **[自動プルーニング戦略の詳細](../../platforms/auto-pruning/)** を学びます。
>
> 学習内容：
> - 重複排除戦略が重複するツール呼び出しをどのように検出するか
> - 上書き書き込み戦略の動作原理
> - エラークリア戦略のトリガー条件
> - 戦略の効果をモニタリングする方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| 設定管理コア | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 1-798 |
| 設定スキーマ | [`dcp.schema.json`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/dcp.schema.json) | 1-232 |
| デフォルト設定 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L423-L464) | 423-464 |
| 設定優先順位 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| 設定検証 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-L375) | 147-375 |
| 設定ファイルパス | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L484-L526) | 484-526 |
| デフォルト保護ツール | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-L79) | 68-79 |
| 戦略設定のマージ | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L565-L595) | 565-595 |
| ツール設定のマージ | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L597-L622) | 597-622 |

**主要な定数**：
- `DEFAULT_PROTECTED_TOOLS`：デフォルトで保護されるツール名リスト（`lib/config.ts:68-79`）

**主要な関数**：
- `getConfig()`：すべてのレベルの設定を読み込んでマージ（`lib/config.ts:669-797`）
- `getInvalidConfigKeys()`：設定ファイル内の無効なキーを検証（`lib/config.ts:135-138`）
- `validateConfigTypes()`：設定値の型を検証（`lib/config.ts:147-375`）
- `getConfigPaths()`：すべての設定ファイルのパスを取得（`lib/config.ts:484-526`）

</details>
