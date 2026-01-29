---
title: "使用方法: スラッシュコマンドと自然言語 | opencode-mystatus"
sidebarTitle: "使用方法"
subtitle: "mystatusの使用：スラッシュコマンドと自然言語"
description: "opencode-mystatusの使用方法を学びます。スラッシュコマンド /mystatus と自然言語の2つの方法でAIプラットフォームのクォータを素早くクエリできます。"
tags:
  - "クイックスタート"
  - "スラッシュコマンド"
  - "自然言語"
prerequisite:
  - "start-quick-start"
order: 2
---
# mystatusの使用：スラッシュコマンドと自然言語

## 学習後のスキル

- スラッシュコマンド `/mystatus` を使用してすべてのAIプラットフォームのクォータを一括クエリする
- 自然言語で質問してOpenCodeにmystatusツールを自動的に呼び出させる
- スラッシュコマンドと自然言語の2つのトリガー方法の違いと適用シナリオを理解する

## 現在の課題

あなたは複数のAIプラットフォーム（OpenAI、Zhipu AI、GitHub Copilotなど）を使用して開発していますが、各プラットフォームの残りクォータを知りたいです。しかし、各プラットフォームにログインして確認するのは面倒すぎます。

## いつ使用するか

- **すべてのプラットフォームのクォータを素早く確認したい時**：毎日開発前に確認して、合理的に使用を計画する
- **特定のプラットフォームのクォータを知りたい時**：例えばOpenAIがもう使い切れているか確認したい時
- **設定が有効か確認したい時**：新しいアカウントを設定した後、正常にクエリできるか検証する

::: info 前提チェック

このチュートリアルでは、[opencode-mystatusプラグインのインストール](/ja/vbgate/opencode-mystatus/start/quick-start/)が完了していることを前提としています。まだインストールしていない場合は、先にインストール手順を完了してください。

:::

## コアコンセプト

opencode-mystatusは、mystatusツールをトリガーする2つの方法を提供しています：

1. **スラッシュコマンド `/mystatus`**：迅速、直接的、あいまいさなし、頻繁なクエリに適している
2. **自然言語での質問**：より柔軟、具体的なシナリオでのクエリに適している

2つの方法はどちらも同じ `mystatus` ツールを呼び出します。ツールは設定されたすべてのAIプラットフォームのクォータを並列クエリし、プログレスバー、使用統計、リセットカウントダウンを含む結果を返します。

## 実践

### ステップ1：スラッシュコマンドを使用してクォータをクエリ

OpenCodeで以下のコマンドを入力します：

```bash
/mystatus
```

**なぜ必要か**
スラッシュコマンドはOpenCodeのショートカットコマンドメカニズムで、事前定義されたツールを素早く呼び出せます。`/mystatus` コマンドはmystatusツールを直接呼び出し、追加のパラメータは不要です。

**期待される結果**：
OpenCodeはすべての設定済みプラットフォームのクォータ情報を返します。形式は以下の通りです：

```
## OpenAI アカウントクォータ

Account:        user@example.com (team)

3時間制限
████████████████████████ 剩余 85%
リセット: 2h 30m後

## Zhipu AI アカウントクォータ

Account:        9c89****AQVM (Coding Plan)

5時間 token 制限
████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
リセット: 4h後
```

各プラットフォームでは以下が表示されます：
- アカウント情報（メールアドレスまたはマスキングされたAPIキー）
- プログレスバー（残りクォータを視覚化）
- リセット時間カウントダウン
- 使用量と総使用量（一部のプラットフォーム）

### ステップ2：自然言語で質問する

スラッシュコマンドのほか、自然言語で質問することもできます。OpenCodeは意図を自動的に認識してmystatusツールを呼び出します。

次のような質問を試してみてください：

```bash
Check my OpenAI quota
```

または

```bash
How much Codex quota do I have left?
```

または

```bash
Show my AI account status
```

**なぜ必要か**
自然言語クエリは日常会話に近く、具体的な開発シナリオで質問するのに適しています。OpenCodeはセマンティックマッチングでクォータをクエリしたいと判断し、自動的にmystatusツールを呼び出します。

**期待される結果**：
スラッシュコマンドと同じ出力結果が表示されますが、トリガー方法が異なります。

### ステップ3：スラッシュコマンドの設定を理解する

スラッシュコマンド `/mystatus` はどのように動作するのでしょうか？OpenCode設定ファイルで定義されています。

`~/.config/opencode/opencode.json` を開き、`command` セクションを見つけてください：

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use mystatus tool to query quota usage. Return result as-is without modification."
    }
  }
}
```

**重要な設定項目の説明**：

| 設定項目 | 値 | 役割 |
| ------ | --- | ---- |
| `description` | "Query quota usage for all AI accounts" | コマンドリストに表示される説明 |
| `template` | "Use to mystatus tool..." | OpenCodeにこのコマンドを処理する方法を指示する |

**なぜtemplateが必要なのか**
templateはOpenCodeへの「指示」で、ユーザーが `/mystatus` と入力した時に、mystatusツールを呼び出し、結果をそのまま返すことを指示しています。

## チェックポイント ✅

2つの使用方法を習得したことを確認してください：

| スキル | チェック方法 | 期待される結果 |
| ---- | -------- | -------- |
| スラッシュコマンドクエリ | `/mystatus` と入力 | すべてのプラットフォームのクォータ情報が表示される |
| 自然言語クエリ | "Check my OpenAI quota" と入力 | クォータ情報が表示される |
| 設定の理解 | opencode.jsonを確認 | mystatusコマンドの設定が見つかる |

## よくある落とし穴

### 一般的なエラー1：スラッシュコマンドに反応がない

**現象**：`/mystatus` と入力しても何も反応がない

**原因**：OpenCode設定ファイルにスラッシュコマンドが正しく設定されていない

**解決方法**：
1. `~/.config/opencode/opencode.json` を開く
2. `command` セクションに `mystatus` 設定が含まれていることを確認する（ステップ3を参照）
3. OpenCodeを再起動する

### 一般的なエラー2：自然言語質問でmystatusツールが呼び出されない

**現象**："Check my OpenAI quota" と入力しても、OpenCodeがmystatusツールを呼び出さず、自分で回答しようとする

**原因**：OpenCodeが意図を正しく認識していない

**解決方法**：
1. より明確な表現を試す："Use mystatus tool to check my OpenAI quota"
2. または、より信頼性の高いスラッシュコマンド `/mystatus` を直接使用する

### 一般的なエラー3：「設定済みのアカウントが見つかりません」と表示される

**現象**：`/mystatus` を実行すると「設定済みのアカウントが見つかりません」と表示される

**原因**：まだどのプラットフォームの認証情報も設定されていない

**解決方法**：
- 少なくとも1つのプラットフォームの認証情報を設定する（OpenAI、Zhipu AI、Z.ai、GitHub Copilot、またはGoogle Cloud）
- 詳細は[クイックスタートチュートリアル](/ja/vbgate/opencode-mystatus/start/quick-start/)の設定説明を参照

## まとめ

mystatusツールは2つの使用方法を提供しています：
1. **スラッシュコマンド `/mystatus`**：迅速かつ直接的、頻繁なクエリに適している
2. **自然言語での質問**：より柔軟、具体的なシナリオに適している

2つの方法はどちらも、設定されたすべてのAIプラットフォームのクォータを並列クエリし、プログレスバーとリセットカウントダウンを含む結果を返します。スラッシュコマンドの設定は `~/.config/opencode/opencode.json` で定義され、templateを通じてOpenCodeにmystatusツールを呼び出す方法を指示します。

## 次のレッスン

> 次のレッスンでは **[出力の解釈：プログレスバー、リセット時間、複数アカウント](/ja/vbgate/opencode-mystatus/start/understanding-output/)** を学びます。
>
> 学べること：
> - プログレスバーの意味を解釈する方法
> - リセット時間カウントダウンの計算方法
> - 複数アカウントシナリオでの出力形式
> - プログレスバー生成の原理

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| mystatusツール定義 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| ツールの説明 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 30-31 |
| スラッシュコマンド設定 | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |
| すべてのプラットフォームの並列クエリ | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| 結果の収集と集計 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |

**重要な定数**：
なし（このセクションは主に呼び出し方法を紹介し、具体的な定数には関与しません）

**重要な関数**：
- `mystatus()`：mystatusツールのメイン関数、認証ファイルを読み取り、すべてのプラットフォームを並列クエリする（`plugin/mystatus.ts:29-33`）
- `collectResult()`：クエリ結果をresultsとerrors配列に収集する（`plugin/mystatus.ts:100-116`）

</details>
