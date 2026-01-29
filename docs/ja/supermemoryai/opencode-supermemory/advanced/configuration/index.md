---
title: "詳細設定: 記憶エンジン設定 | Supermemory"
sidebarTitle: "詳細設定"
subtitle: "詳細設定の解説：記憶エンジンをカスタマイズする"
description: "高度な設定オプションを習得し、記憶エンジンをカスタマイズする方法を学びます。トリガーワード、コンテキスト注入、圧縮しきい値の調整を解説します。"
tags:
  - "設定"
  - "高度"
  - "カスタマイズ"
prerequisite:
  - "start-getting-started"
order: 2
---

# 詳細設定の解説：記憶エンジンをカスタマイズする

## この章で学べること

- **トリガーワードをカスタマイズ**：Agent に独自の命令（例：「メモ」、「mark」）を理解させます。
- **記憶容量を調整**：コンテキストに注入する記憶の数を制御し、トークン消費と情報量のバランスを取ります。
- **圧縮戦略を最適化**：プロジェクトの規模に応じて先制圧縮のトリガータイミングを調整します。
- **マルチ環境を管理**：環境変数を通じて柔軟に API Key を切り替えます。

## 設定ファイルの位置

opencode-supermemory は以下の順序で設定ファイルを検索し、**見つかった時点で停止**します：

1. `~/.config/opencode/supermemory.jsonc`（推奨、コメントをサポート）
2. `~/.config/opencode/supermemory.json`

::: tip なぜ .jsonc を推奨するのですか？
`.jsonc` 形式は JSON 内にコメント（`//`）を書くことができ、設定項目の用途を説明するのに非常に適しています。
:::

## コア設定の解説

以下は、利用可能なすべてのオプションとそのデフォルト値を含む完全な設定例です。

### 基本設定

```jsonc
// ~/.config/opencode/supermemory.jsonc
{
  // Supermemory API Key
  // 優先順位：設定ファイル > 環境変数 SUPERMEMORY_API_KEY
  "apiKey": "your-api-key-here",

  // セマンティック検索の類似度しきい値 (0.0 - 1.0)
  // 値が高いほど検索結果はより正確ですが数は少なくなり、値が低いほど結果はより分散します
  "similarityThreshold": 0.6
}
```

### コンテキスト注入制御

これらの設定は、Agent がセッションを開始するときに、どのくらいの記憶を自動的に読み取ってプロンプトに注入するかを決定します。

```jsonc
{
  // ユーザープロファイル（User Profile）を自動注入するかどうか
  // false に設定するとトークンを節約できますが、Agent は基本設定を忘れる可能性があります
  "injectProfile": true,

  // 注入するユーザープロファイル項目の最大数
  "maxProfileItems": 5,

  // 注入するユーザーレベルの記憶（User Scope）の最大数
  // これらはクロスプロジェクトで共有される一般的な記憶です
  "maxMemories": 5,

  // 注入するプロジェクトレベルの記憶（Project Scope）の最大数
  // これらは現在のプロジェクトに固有の記憶です
  "maxProjectMemories": 10
}
```

### カスタムトリガーワード

カスタム正規表現を追加して、特定の命令を認識し、記憶を自動的に保存するように Agent を設定できます。

```jsonc
{
  // カスタムトリガーワードのリスト（正規表現をサポート）
  // これらは内蔵のデフォルトトリガーワードと組み合わせて有効になります
  "keywordPatterns": [
    "メモ",           // 単純一致
    "mark\\s+this",   // 正規表現一致：mark this
    "重要[:：]",       // "重要:" または "重要：" に一致
    "TODO\\(memory\\)" // 特定のマークに一致
  ]
}
```

::: details 内蔵デフォルトトリガーワードを表示
プラグインには以下のトリガーワードが内蔵されており、設定なしで使用できます：
- `remember`, `memorize`
- `save this`, `note this`
- `keep in mind`, `don't forget`
- `learn this`, `store this`
- `record this`, `make a note`
- `take note`, `jot down`
- `commit to memory`
- `remember that`
- `never forget`, `always remember`
:::

### 先制圧縮 (Preemptive Compaction)

セッションのコンテキストが長すぎる場合、プラグインは自動的に圧縮メカニズムをトリガーします。

```jsonc
{
  // 圧縮トリガーしきい値 (0.0 - 1.0)
  // トークン使用率がこの比率を超えると圧縮がトリガーされます
  // デフォルト 0.80 (80%)
  "compactionThreshold": 0.80
}
```

::: warning しきい値設定の推奨
- **高く設定しないでください**（> 0.95 など）：圧縮が完了する前にコンテキストウィンドウが尽きてしまう可能性があります。
- **低く設定しないでください**（< 0.50 など）：頻繁に圧縮が発生し、フローが中断され、トークンを浪費します。
- **推奨値**：0.70 - 0.85 の間。
:::

## 環境変数のサポート

設定ファイルに加えて、環境変数を使用してセンシティブな情報を管理したり、デフォルト動作をオーバーライドしたりできます。

| 環境変数 | 説明 | 優先順位 |
| :--- | :--- | :--- |
| `SUPERMEMORY_API_KEY` | Supermemory API キー | 設定ファイルより低い |
| `USER` または `USERNAME` | ユーザースコープハッシュの生成に使用される識別子 | システムデフォルト |

### 使用シナリオ：マルチ環境の切り替え

会社と個人のプロジェクトで異なる Supermemory アカウントを使用している場合、環境変数を利用できます。

::: code-group

```bash [macOS/Linux]
# .zshrc または .bashrc でデフォルトのキーを設定
export SUPERMEMORY_API_KEY="key_personal"

# 会社のプロジェクトディレクトリで一時的にキーを上書き
export SUPERMEMORY_API_KEY="key_work" && opencode
```

```powershell [Windows]
# 環境変数を設定
$env:SUPERMEMORY_API_KEY="key_work"
opencode
```

:::

## 実践：専用設定をカスタマイズ

多くの開発者に適した最適化された設定を作成しましょう。

### ステップ 1：設定ファイルを作成

ファイルが存在しない場合は、作成します。

```bash
mkdir -p ~/.config/opencode
touch ~/.config/opencode/supermemory.jsonc
```

### ステップ 2：最適化された設定を書き込む

以下の内容を `supermemory.jsonc` にコピーします。この設定はプロジェクト記憶の重みを増やし、日本語のトリガーワードを追加しています。

```jsonc
{
  // デフォルトの類似度を維持
  "similarityThreshold": 0.6,

  // プロジェクト記憶の数を増やし、一般記憶を減らす。深い開発に適しています
  "maxMemories": 3,
  "maxProjectMemories": 15,

  // 日本語の習慣に合わせたトリガーワードを追加
  "keywordPatterns": [
    "メモ",
    "覚えておいて",
    "記憶を保存",
    "忘れないで"
  ],

  // 圧縮を少し早くトリガーし、より多くの安全な余白を確保
  "compactionThreshold": 0.75
}
```

### ステップ 3：設定を確認

OpenCode を再起動し、対話で新しく定義したトリガーワードを試します：

```
ユーザー入力：
メモ：このプロジェクトの API ベースパスは /api/v2 です

システム応答（期待される）：
(Agent が supermemory ツールを呼び出して記憶を保存します)
記憶を保存しました：このプロジェクトの API ベースパスは /api/v2 です
```

## よくある質問

### Q: 設定を変更した後、再起動が必要ですか？
**A: 必要です。** プラグインは起動時に設定をロードします。`supermemory.jsonc` を変更した後は、OpenCode を再起動して有効にする必要があります。

### Q: `keywordPatterns` は日本語の正規表現をサポートしていますか？
**A: サポートしています。** 底層は JavaScript の `new RegExp()` を使用しており、完全に Unicode 文字をサポートしています。

### Q: 設定ファイルの形式が間違っているとどうなりますか？
**A: プラグインはデフォルト値にフォールバックします。** JSON 形式が無効な場合（余分なカンマなど）、プラグインはエラーをキャッチし、内蔵の `DEFAULTS` を使用します。OpenCode がクラッシュすることはありません。

## 次の章の予告

> 次の章では **[プライバシーとデータセキュリティ](../../security/privacy/)** を学びます。
>
> 以下のことができるようになります：
> - センシティブデータの自動検閲メカニズム
> - `<private>` タグを使用してプライバシーを保護する方法
> - データ保存のセキュリティ境界

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| :--- | :--- | :--- |
| 設定インターフェースの定義 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L12-L23) | 12-23 |
| デフォルト値の定義 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |
| デフォルトトリガーワード | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L25-L42) | 25-42 |
| 設定ファイルの読み込み | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L73-L86) | 73-86 |
| 環境変数の読み取り | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |

</details>
