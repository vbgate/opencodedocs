---
title: "自動コンテキスト注入の仕組み | opencode-supermemory"
sidebarTitle: "コンテキスト注入"
subtitle: "自動コンテキスト注入メカニズム：Agent に\"予知能力\"を"
description: "コンテキスト注入の仕組みを学びます。セッション開始時にプロファイルと知識を自動取得し、キーワードトリガーで記憶を保存する方法を解説します。"
tags:
  - "context"
  - "injection"
  - "prompt"
  - "memory"
prerequisite:
  - "start-getting-started"
order: 1
---

# 自動コンテキスト注入メカニズム：Agent に"予知能力"を

## この章で学べること

この章では、以下のことができるようになります：

1. **理解**：なぜ Agent は最初からあなたのコーディング習慣とプロジェクトのアーキテクチャを知っているのか。
2. **習得**：コンテキスト注入の「三次元モデル」（ユーザープロファイル、プロジェクト知識、関連記憶）。
3. **習得**：キーワード（"Remember this" など）を使用して、Agent の記憶動作を能動的に制御する方法。
4. **設定**：注入する項目数を調整し、コンテキストの長さと情報の豊富さのバランスを取る方法。

---

## 基本的な考え方

記憶プラグインが存在する前は、新しいセッションを開始するたびに Agent は白紙の状態でした。毎回繰り返し「TypeScript を使用しています」「このプロジェクトは Next.js を使用しています」と伝える必要がありました。

**コンテキスト注入（Context Injection）** はこの問題を解決します。これは Agent が起動した瞬間に、その脳に「任務概要」を押し込むようなものです。

### トリガーのタイミング

opencode-supermemory は非常に控えめで、**セッションの最初のメッセージ**のみで自動注入をトリガーします。

- **なぜ最初なのか？**：これはセッションの基調を決定する重要な瞬間だからです。
- **その後のメッセージは？**：会話の流れを妨げないために、その後のメッセージでは自動注入は行われません（以下の「キーワードトリガー」を参照）。

### 三次元注入モデル

プラグインは 3 種類のデータを並行して取得し、`[SUPERMEMORY]` プロンプトブロックに組み合わせます：

| データ次元 | ソース | 役割 | 例 |
|--- | --- | --- | ---|
| **1. ユーザープロファイル** (Profile) | `getProfile` | あなたの長期の好み | "ユーザーは簡潔な返信を好む"、"矢印関数を好む" |
| **2. プロジェクト知識** (Project) | `listMemories` | 現在のプロジェクトのグローバル知識 | "このプロジェクトは Clean Architecture を採用"、"API は src/api に配置" |
| **3. 関連記憶** (Relevant) | `searchMemories` | あなたの最初のメッセージに関連する過去の経験 | "この Bug をどう直すか"と尋ねると、以前の同様の修正記録が検索される |

---

## 何が注入されるのか？

OpenCode で最初のメッセージを送信すると、プラグインはバックグラウンドで次の内容を System Prompt に挿入します。

::: details 注入内容の実際の構造を表示するにはクリック
```text
[SUPERMEMORY]

User Profile:
- User prefers concise responses
- User uses Zod for all validations

Recent Context:
- Working on auth module refactoring

Project Knowledge:
- [100%] Architecture follows MVC pattern
- [100%] Use 'npm run test' for testing

Relevant Memories:
- [85%] Previous fix for hydration error: use useEffect
```
:::

Agent はこの情報を見ると、このプロジェクトで長く働いているベテラン従業員のように振る舞い、新入りの実習生のようにはなりません。

---

## キーワードトリガーメカニズム (Nudge)

冒頭の自動注入に加えて、会話中にいつでも記憶機能を「覚醒」させることができます。

プラグインには **キーワード検出器** が組み込まれています。メッセージに特定のトリガーワードが含まれていると、プラグインは Agent に「見えないヒント（Nudge）」を送信し、保存ツールを呼び出すことを強制します。

### デフォルトのトリガーワード

- `remember`
- `save this`
- `don't forget`
- `memorize`
- `take note`
- ...（詳細はソースコードの設定を参照）

### インタラクションの例

**あなたの入力**：
> ここでの API レスポンス形式が変わりました。**remember** 今後は `data.payload` ではなく `data.result` を使用します。

**プラグインが "remember" を検出**：
> （バックグラウンドでヒントを注入）：`[MEMORY TRIGGER DETECTED] The user wants you to remember something...`

**Agent の反応**：
> 了解しました。この変更を記憶します。
> *(バックグラウンドで `supermemory.add` を呼び出して記憶を保存)*

---

## 詳細設定

`~/.config/opencode/supermemory.jsonc` を変更して、注入動作を調整できます。

### 一般的な設定項目

```jsonc
{
  // ユーザープロファイルを注入するかどうか（デフォルト true）
  "injectProfile": true,

  // 各回に注入するプロジェクト記憶の数（デフォルト 10）
  // 多くすると Agent はプロジェクトをより深く理解できますが、より多くの Token を消費します
  "maxProjectMemories": 10,

  // 各回に注入するユーザープロファイル項目の数（デフォルト 5）
  "maxProfileItems": 5,

  // カスタムトリガーワード（正規表現をサポート）
  "keywordPatterns": [
    "メモ",
    "永続保存"
  ]
}
```

::: tip ヒント
設定を変更した後は、OpenCode を再起動するかプラグインをリロードする必要があります。
:::

---

## よくある質問

### Q: 注入された情報は多くの Token を消費しますか？
**A**: 一部消費しますが、通常は管理可能です。デフォルト設定（10 件のプロジェクト記憶 + 5 件のプロファイル）では、約 500-1000 Token を消費します。現代の大規模言語モデル（Claude 3.5 Sonnet など）の 200k コンテキストに比べれば、これはごくわずかです。

### Q: "remember" と言っても反応がないのはなぜですか？
**A**: 
1. スペルが正しいか確認してください（正規表現マッチをサポート）。
2. API Key が正しく設定されているか確認してください（プラグインが初期化されていない場合、トリガーされません）。
3. Agent が無視することを決定する可能性があります（プラグインは強制的にヒントを送信しますが、Agent には最終的な決定権があります）。

### Q: 「関連記憶」はどのように検索されるのですか？
**A**: これはあなたの **最初のメッセージの内容** に基づいてセマンティック検索されます。最初のメッセージが "Hi" だけの場合、有用な関連記憶は見つからないかもしれませんが、「プロジェクト知識」と「ユーザープロファイル」は依然として注入されます。

---

## この章のまとめ

- **自動注入** はセッションの最初のメッセージでのみトリガーされます。
- **三次元モデル** にはユーザープロファイル、プロジェクト知識、関連記憶が含まれます。
- **キーワードトリガー** により、いつでも Agent に記憶を保存するよう命令できます。
- **設定ファイル** により、注入される情報量を制御できます。

## 次の章の予告

> 次の章では **[ツールセット詳解：Agent に記憶を教える](../tools/index.md)** を学びます。
>
> 以下のことができるようになります：
> - `add`、`search` などのツールを手動で使用する方法
> - 間違った記憶を確認・削除する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| 注入トリガーロジック | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L125-L176) | 125-176 |
| キーワード検出 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| プロンプトフォーマット | [`src/services/context.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/context.ts#L14-L64) | 14-64 |
| デフォルト設定 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |

**重要な関数**：
- `formatContextForPrompt()`: `[SUPERMEMORY]` テキストブロックを組み立てます。
- `detectMemoryKeyword()`: ユーザーメッセージのトリガーワードを正規表現でマッチングします。

</details>

## 次の章の予告

> 次の章では **[ツールセット詳解：Agent に記憶を教える](../tools/index.md)** を学びます。
>
> 以下のことができるようになります：
> - `add`、`search`、`profile` などの 5 つのコアツールモードを習得
> - Agent の記憶を手動で介入・修正する方法
> - 自然言語を使用して記憶保存をトリガーする
