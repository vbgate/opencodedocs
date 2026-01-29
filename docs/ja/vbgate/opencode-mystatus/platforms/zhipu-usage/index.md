---
title: "Zhipu AI クォータ: Token制限とMCPクエリ | opencode-mystatus"
sidebarTitle: "Zhipu AI"
subtitle: "Zhipu AIとZ.aiクォータクエリ：5時間Token制限とMCP月次クォータ"
description: "opencode-mystatusでZhipu AIとZ.aiのToken制限、MCPクォータをクエリする方法を学びます。リセット時間の計算をマスターし、超過使用を回避します。"
tags:
  - "Zhipu AI"
  - "Z.ai"
  - "クォータクエリ"
  - "Token 制限"
  - "MCP クォータ"
prerequisite:
  - "start-quick-start"
order: 2
---

# Zhipu AIとZ.aiクォータクエリ：5時間Token制限とMCP月次クォータ

## 学習後のスキル

- **Zhipu AI**と**Z.ai**の5時間Token制限の使用状況を確認する
- **MCP月次クォータ**の意味とリセットルールを理解する
- クォータ出力の**プログレスバー、使用済み、総量**などの情報を読み取れる
- いつ**使用率警告**がトリガーされるのかを知る

## 現在の課題

あなたはZhipu AIまたはZ.aiを使用してアプリケーションを開発していますが、よく以下の問題に直面しています：

- **5時間Token制限**の残りがどれくらいかわからない
- 制限を超えるとリクエストが失敗し、開発の進捗に影響する
- **MCP月次クォータ**の具体的な意味がよくわからない
- 2つのプラットフォームにそれぞれログインしてクォータを確認するのは面倒

## いつ使用するか

以下の時に使用します：

- Zhipu AI / Z.aiのAPIを使用してアプリケーションを開発している場合
- Token使用量を監視し、超過使用を避けたい場合
- MCP検索機能の月次クォータを知りたい場合
- Zhipu AIとZ.aiを同時に使用しており、クォータを統一管理したい場合

## コアコンセプト

**Zhipu AI**と**Z.ai**のクォータシステムは2つのタイプに分かれています：

| クォータタイプ | 意味 | リセットサイクル |
|--- | --- | ---|
| **5時間Token制限** | APIリクエストのToken使用量制限 | 5時間自動リセット |
| **MCP月次クォータ** | MCP（Model Context Protocol）検索回数の月次制限 | 毎月リセット |

プラグインは公式APIをリアルタイムでクエリし、**プログレスバー**と**パーセンテージ**で残りクォータを直感的に表示します。

::: info MCPとは？

**MCP**（Model Context Protocol）はZhipu AIが提供するモデルコンテキストプロトコルで、AIモデルが外部リソースを検索・引用することを可能にします。MCP月次クォータは毎月可能な検索回数を制限します。

:::

## 実践

### ステップ1：Zhipu AI / Z.aiアカウントを設定

**なぜ必要か**
プラグインはAPIキーがなければクォータをクエリできません。Zhipu AIとZ.aiは**APIキー認証方式**を使用します。

**操作**

1. `~/.local/share/opencode/auth.json` ファイルを開く

2. Zhipu AIまたはZ.aiのAPIキー設定を追加：

```json
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "あなたのZhipu AI APIキー"
  },
  "zai-coding-plan": {
    "type": "api",
    "key": "あなたのZ.ai APIキー"
  }
}
```

**期待される結果**：
- 設定ファイルに `zhipuai-coding-plan` または `zai-coding-plan` フィールドが含まれている
- 各フィールドに `type: "api"` と `key` フィールドがある

### ステップ2：クォータをクエリ

**なぜ必要か**
公式APIを呼び出してリアルタイムのクォータ使用状況を取得する。

**操作**

OpenCodeでスラッシュコマンドを実行：

```bash
/mystatus
```

または自然言語で質問：

```bash
私のZhipu AIクォータを確認して
```

**期待される結果**：
以下のような出力が表示されます：

```
## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
████████████████████████ 剩余 95%
Used: 0.5M / 10.0M
Resets in: 4h

MCP month quota
██████████████████░░░░░░ 剩余 60%
Used: 200 / 500

## Z.ai Account Quota

Account:        9c89****AQVM (Z.ai)

5-hour token limit
████████████████████████ 剩余 95%
Used: 0.5M / 10.0M
Resets in: 4h
```

### ステップ3：出力を読み取る

**なぜ必要か**
各行の出力の意味を理解してこそ、クォータを効果的に管理できます。

**操作**

以下の説明を参照して自分の出力を確認：

| 出力フィールド | 意味 | 例 |
|--- | --- | ---|
| **Account** | マスキングされたAPIキーとアカウントタイプ | `9c89****AQVM (Coding Plan)` |
| **5-hour token limit** | 現在の5時間サイクル内のToken使用状況 | プログレスバー + パーセンテージ |
| **Used: X / Y** | 使用済み / 総量 | `0.5M / 10.0M` |
| **Resets in: Xh** | 次回リセットまでのカウントダウン | `4h` |
| **MCP month quota** | 当月MCP検索回数の使用状況 | プログレスバー + パーセンテージ |
| **Used: X / Y** | 使用済み回数 / 総量 | `200 / 500` |

**期待される結果**：
- 5時間Token制限部分に**リセット時間カウントダウン**がある
- MCP月次クォータ部分には**リセット時間がない**（月次リセットのため）
- 使用率が80%を超えると、底部に**警告表示**が表示される

## チェックポイント ✅

以下を理解したか確認します：

- [ ] 5時間Token制限にはリセット時間カウントダウンがある
- [ ] MCP月次クォータは月次リセットで、カウントダウンは表示されない
- [ ] 使用率が80%を超えると警告がトリガーされる
- [ ] APIキーはマスキング表示される（前後4桁のみ）

## よくある落とし穴

### ❌ 一般的なエラー1：設定ファイルに `type` フィールドがない

**誤った現象**：クエリ時に「設定済みのアカウントが見つかりません」と表示される

**原因**：`auth.json` に `type: "api"` フィールドがない

**修正**：

```json
// ❌ 誤り
{
  "zhipuai-coding-plan": {
    "key": "あなたのAPIキー"
  }
}

// ✅ 正しい
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "あなたのAPIキー"
  }
}
```

### ❌ 一般的なエラー2：APIキーが期限切れまたは無効

**誤った現象**：「APIリクエスト失敗」または「認証失敗」と表示される

**原因**：APIキーが期限切れまたは取り消されている

**修正**：
- Zhipu AI / Z.aiコンソールにログイン
- APIキーを再生成
- `auth.json` の `key` フィールドを更新

### ❌ 一般的なエラー3：2つのクォータタイプを混同する

**誤った現象**：Token制限とMCPクォータが同じものだと思っている

**修正**：
- **Token制限**：API呼び出しのToken使用量、5時間リセット
- **MCPクォータ**：MCP検索回数、月次リセット
- これは**2つの独立した制限**で、互いに影響しません

## まとめ

このレッスンでは、opencode-mystatusを使用してZhipu AIとZ.aiのクォータをクエリする方法を学びました：

**核心概念**：
- 5時間Token制限：API呼び出し制限、リセットカウントダウンがある
- MCP月次クォータ：MCP検索回数、月次リセット

**操作ステップ**：
1. `auth.json` に `zhipuai-coding-plan` または `zai-coding-plan` を設定
2. `/mystatus` を実行してクォータをクエリ
3. 出力のプログレスバー、使用済み、リセット時間を読み取る

**重要ポイント**：
- 使用率が80%を超えると警告がトリガーされる
- APIキーは自動的にマスキング表示される
- Token制限とMCPクォータは2つの独立した制限

## 次のレッスン

> 次のレッスンでは **[GitHub Copilot クォータクエリ](../copilot-usage/)** を学びます。
>
> 学べること：
> - Premium Requestsの使用状況を確認する方法
> - 異なるサブスクリプションタイプの月次クォータの違い
> - モデル使用詳細の読み取り方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Zhipu AIクォータクエリ | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 213-217 |
| Z.aiクォータクエリ | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 224-228 |
| 出力フォーマット | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 115-177 |
| APIエンドポイント設定 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-76 |
| ZhipuAuthData型定義 | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 38-41 |
| 高使用率警告閾値 | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 110-111 |

**重要な定数**：
- `HIGH_USAGE_THRESHOLD = 80`：使用率が80%を超えると警告を表示（`types.ts:111`）

**重要な関数**：
- `queryZhipuUsage(authData)`: Zhipu AIアカウントクォータをクエリ（`zhipu.ts:213-217`）
- `queryZaiUsage(authData)`: Z.aiアカウントクォータをクエリ（`zhipu.ts:224-228`）
- `formatZhipuUsage(data, apiKey, accountLabel)`: クォータ出力をフォーマット（`zhipu.ts:115-177`）
- `fetchUsage(apiKey, config)`: 公式APIを呼び出してクォータデータを取得（`zhipu.ts:81-106`）

**APIエンドポイント**：
- Zhipu AI: `https://bigmodel.cn/api/monitor/usage/quota/limit`（`zhipu.ts:63`）
- Z.ai: `https://api.z.ai/api/monitor/usage/quota/limit`（`zhipu.ts:64`）

</details>
