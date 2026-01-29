---
title: "OpenAI クォータクエリ | opencode-mystatus"
sidebarTitle: "OpenAI クォータ"
subtitle: "OpenAI クォータクエリ：3時間と24時間制限"
description: "OpenAI ChatGPTの3時間と24時間制限クォータをクエリする方法を学びます。メインウィンドウとセカンダリウィンドウの読み取り方、リセット時間の確認方法を理解します。"
tags:
  - "OpenAI"
  - "クォータクエリ"
  - "API クォータ"
prerequisite:
  - "start-quick-start"
  - "start-understanding-output"
order: 1
---

# OpenAI クォータクエリ：3時間と24時間制限

## 学習後のスキル

- `/mystatus` を使用して OpenAI Plus/Team/Pro サブスクリプションのクォータをクエリする
- 出力中の3時間と24時間制限情報を読み取れる
- メインウィンドウとセカンダリウィンドウの違いを理解する
- Token期限切れ時の処理方法を知る

## 現在の課題

OpenAIのAPI呼び出しには制限があり、超過すると一時的にアクセスが制限されます。しかし、あなたは以下を知りません：
- 現在どれくらい残っているのか？
- 3時間と24時間ウィンドウのどちらが使われているのか？
- いつリセットされるのか？
- なぜ時々2つのウィンドウのデータが見られるのか？

これらの情報をタイムリーに把握しないと、ChatGPTでのコーディングやプロジェクトの進捗に影響するかもしれません。

## いつ使用するか

以下の時に使用します：
- OpenAI APIを頻繁に使用して開発する場合
- レスポンスが遅くなったりレート制限がかかったりするのを感じた時
- チームアカウントの使用状況を確認したい時
- いつクォータがリセットされるのか知りたい時

## コアコンセプト

OpenAIはAPI呼び出しに対して2つのレート制限ウィンドウを持っています：

| ウィンドウタイプ | 時間 | 役割 |
|--- | --- | ---|
| **メインウィンドウ**（primary） | OpenAIサーバーから返される | 短時間の大量呼び出しを防ぐ |
| **セカンダリウィンドウ**（secondary） | OpenAIサーバーから返される（存在しない場合あり） | 長期の超過使用を防ぐ |

mystatusはこの2つのウィンドウを並列クエリし、それぞれの以下を表示します：
- 使用済みパーセンテージ
- 残りクォータプログレスバー
- リセットまでの時間

::: info
ウィンドウ時間はOpenAIサーバーから返され、異なるサブスクリプションタイプ（Plus、Team、Pro）で異なる場合があります。
:::

## 実践

### ステップ1：クエリコマンドを実行

OpenCodeで `/mystatus` と入力すると、システムは自動的に設定されたすべてのプラットフォームのクォータをクエリします。

**期待される結果**：
OpenAI、Zhipu AI、Z.ai、Copilot、Google Cloudなどすべてのプラットフォームのクォータ情報が表示されます（どのプラットフォームを設定したかによります）。

### ステップ2：OpenAI部分を見つける

出力から `## OpenAI Account Quota` 部分を見つけます。

**期待される結果**：
以下のような内容が表示されます：

```
## OpenAI Account Quota

Account:        user@example.com (plus)

3-hour limit
██████████████░░░░░░░░░ 60% remaining
Resets in: 2h 30m
```

### ステップ3：メインウィンドウ情報を読み取る

**メインウィンドウ**（primary_window）は通常以下を表示します：
- **ウィンドウ名**：`3-hour limit` または `24-hour limit` など
- **プログレスバー**：残りクォータの割合を直感的に表示
- **残りパーセンテージ**：`60% remaining` など
- **リセット時間**：`Resets in: 2h 30m` など

**期待される結果**：
- ウィンドウ名が時間を表示（3時間 / 24時間）
- プログレスバーは満たされているほど残りが多く、空いているほど使い切れている
- リセット時間はカウントダウンで、ゼロになるとクォータがリセットされる

::: warning
`Limit reached!` という表示が見られたら、現在のウィンドウクォータが使い切られたことを意味し、リセットまで待つ必要があります。
:::

### ステップ4：セカンダリウィンドウを確認（ある場合）

OpenAIがセカンダリウィンドウデータを返した場合、以下が表示されます：

```
24-hour limit
███████████████████████████ 90% remaining
Resets in: 20h 45m
```

**期待される結果**：
- セカンダリウィンドウは別の時間次元のクォータを表示（通常24時間）
- メインウィンドウとは異なる残りパーセンテージがある場合がある

::: tip
セカンダリウィンドウは独立したクォータプールで、メインウィンドウを使い切ってもセカンダリウィンドウには影響せず、逆もまた然りです。
:::

### ステップ5：サブスクリプションタイプを確認

`Account` 行でサブスクリプションタイプが確認できます：

```
Account:        user@example.com (plus)
                                   ^^^^^
                                   サブスクリプションタイプ
```

**よくあるサブスクリプションタイプ**：
- `plus`：個人Plusサブスクリプション
- `team`：チーム/組織サブスクリプション
- `pro`：Proサブスクリプション

**期待される結果**：
- アカウントタイプがメールアドレスの後ろの括弧内に表示されます
- 異なるタイプでは制限が異なる場合があります

## チェックポイント ✅

以下を理解したか確認します：

| シナリオ | 期待される結果 |
|--- | ---|
| メインウィンドウが60%残り | プログレスバーが約60%満たされ、`60% remaining` と表示 |
| 2.5時間後にリセット | `Resets in: 2h 30m` と表示 |
| 制限に達した | `Limit reached!` と表示 |
| セカンダリウィンドウがある | メインウィンドウとセカンダリウィンドウにそれぞれ1行のデータが表示 |

## よくある落とし穴

### ❌ 誤った操作：Token期限切れ後にリフレッシュしない

**誤った現象**：`⚠️ OAuth 認証が期限切れ`（日本語）または `⚠️ OAuth token expired`（英語）という表示が見られる

**原因**：OAuth Token の有効期限が切れており（サーバー側で制御される具体的な時間）、期限切れ後はクォータをクエリできない

**正しい操作**：
1. OpenCodeでOpenAIモデルを一度使用する
2. Token が自動的にリフレッシュされる
3. 再度 `/mystatus` を実行してクエリ

### ❌ 誤った操作：メインウィンドウとセカンダリウィンドウを混同する

**誤った現象**：1つのウィンドウクォータしかないと思い、メインウィンドウを使い切ってもセカンダリウィンドウがまだ使える

**原因**：2つのウィンドウは独立したクォータプールです。

**正しい操作**：
- 2つのウィンドウそれぞれのリセット時間に注目
- メインウィンドウのリセットが速く、セカンダリウィンドウのリセットが遅い
- 合理的に使用を分配し、あるウィンドウが長期的に超過するのを避ける

### ❌ 誤った操作：チームアカウントIDを無視する

**誤った現象**：Teamサブスクリプションが自分の使用状況を表示していない

**原因**：TeamサブスクリプションではチームアカウントIDを渡す必要がありますが、そうしないとデフォルトアカウントをクエリしている可能性があります。

**正しい操作**：
- OpenCodeで正しいチームアカウントにログインしていることを確認
- Token には自動的に `chatgpt_account_id` が含まれます

## まとめ

mystatusはOpenAI公式APIを呼び出してクォータをクエリします：
- OAuth認証（Plus/Team/Pro）をサポート
- メインウィンドウとセカンダリウィンドウを表示（存在する場合）
- プログレスバーで残りクォータを視覚化
- カウントダウンでリセット時間を表示
- Token期限切れを自動検出

## 次のレッスン

> 次のレッスンでは **[Zhipu AIとZ.aiクォータクエリ](../zhipu-usage/)** を学びます。
>
> 学べること：
> - 5時間Token制限とは何か
> - MCP月次クォータの確認方法
> - 使用率が80%を超えた時の警告表示

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| OpenAIクォータクエリエントリ | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L207-L236) | 207-236 |
| OpenAI API呼び出し | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L132-L155) | 132-155 |
| 出力フォーマット | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| JWT Token解析 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L64-L73) | 64-73 |
| ユーザーメール抽出 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L78-L81) | 78-81 |
| Token期限切れチェック | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L216-L221) | 216-221 |
| OpenAIAuthData型定義 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33) | 28-33 |

**重要な定数**：
- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`：OpenAI公式クォータクエリAPI

**重要な関数**：
- `queryOpenAIUsage(authData)`：OpenAIクォータをクエリするメイン関数
- `fetchOpenAIUsage(accessToken)`：OpenAI APIを呼び出す
- `formatOpenAIUsage(data, email)`：出力をフォーマットする
- `parseJwt(token)`：JWT Tokenを解析（非標準ライブラリ実装）
- `getEmailFromJwt(token)`：Tokenからユーザーメールを抽出
- `getAccountIdFromJwt(token)`：TokenからチームアカウントIDを抽出

</details>
