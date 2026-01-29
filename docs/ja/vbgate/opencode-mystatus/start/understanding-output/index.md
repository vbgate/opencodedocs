---
title: "出力解釈: クォータ表示の読み方 | opencode-mystatus"
sidebarTitle: "出力の解釈"
subtitle: "出力の解釈：プログレスバー、リセット時間、複数アカウント"
description: "opencode-mystatusの出力形式を学びます。プログレスバー、リセット時間、各プラットフォームのクォータサイクルを理解します。"
tags:
  - "output-format"
  - "progress-bar"
  - "reset-time"
  - "multi-account"
prerequisite:
  - "start-quick-start"
order: 3
---
# 出力の解釈：プログレスバー、リセット時間、複数アカウント

## 学習後のスキル

- mystatus出力のすべての項目を読み取れる
- プログレスバーの意味（塗りつぶし vs 空ブロック）を理解する
- 異なるプラットフォームのクォータサイクル（3時間、5時間、月次）を知る
- 複数のアカウントのクォータ差異を識別する

## 現在の課題

あなたは `/mystatus` を実行しましたが、プログレスバー、パーセンテージ、カウントダウンが表示され、何が何だかよくわかりません：

- プログレスバーは満ちているのがいいのか空いているのがいいのか？
- "Resets in: 2h 30m" はどういう意味？
- なぜあるプラットフォームは2つのプログレスバーを表示し、あるのは1つしか表示しないのか？
- Google Cloudには複数のアカウントがあるのはなぜ？

このレッスンでは、これらの情報を一つずつ解説します。

## コアコンセプト

mystatusの出力は統一された形式を持っていますが、プラットフォームごとに違いがあります：

**統一要素**：
- プログレスバー：`█`（塗りつぶし）は残り、`░`（空ブロック）は使用済み
- パーセンテージ：使用量に基づいて残りパーセンテージを計算
- リセット時間：次のクォータ更新までのカウントダウン

**プラットフォームの違い**：
| プラットフォーム | クォータサイクル | 特徴 |
| -------------- | --------------------------- | ----------------------- |
| OpenAI | 3時間 / 24時間 | 2つのウィンドウが表示される場合がある |
| Zhipu AI / Z.ai | 5時間 Token / MCP 月次クォータ | 2つの異なるクォータタイプ |
| GitHub Copilot | 月次 | 具体的な数値が表示される（229/300） |
| Google Cloud | モデル別 | 各アカウントに4つのモデルが表示される |

## 出力構造の解析

### 完全な出力例

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
██████████████░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

## GitHub Copilot Account Quota

Account:        GitHub Copilot (individual)

Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)

## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

### 各部分の意味

#### 1. アカウント情報行

```
Account:        user@example.com (team)
```

- **OpenAI / Copilot**：メールアドレス + サブスクリプションタイプ
- **Zhipu AI / Z.ai**：マスキングされたAPIキー + アカウントタイプ（Coding Plan）
- **Google Cloud**：メールアドレス、複数アカウントは `###` で区切られる

#### 2. プログレスバー

```
███████████████████████████ 85% remaining
```

- `█`（塗りつぶしブロック）：**残り**のクォータ
- `░`（空ブロック）：**使用済み**のクォータ
- **パーセンテージ**：残りパーセンテージ（大きいほど良い）

::: tip 覚えやすいフレーズ
塗りつぶしブロックが満ちているほど残りが多い → 続けて使っても大丈夫
空ブロックが満ちているほど多く使っている → 節約に注意
:::

#### 3. リセット時間カウントダウン

```
Resets in: 2h 30m
```

次のクォータ更新までの時間を表します。

**リセットサイクル**：
- **OpenAI**：3時間ウィンドウ / 24時間ウィンドウ
- **Zhipu AI / Z.ai**：5時間 Token クォータ / MCP 月次クォータ
- **GitHub Copilot**：月次（具体的な日付が表示される）
- **Google Cloud**：各モデルに独立したリセット時間がある

#### 4. 数値詳細（一部のプラットフォーム）

Zhipu AI と Copilot は具体的な数値を表示します：

```
Used: 0.5M / 10.0M              # Zhipu AI：使用済み / 総量（単位：百万Token）
Premium        24% (229/300)     # Copilot：残りパーセンテージ（使用済み / 総クォータ）
```

## プラットフォームの違い詳解

### OpenAI：デュアルウィンドウクォータ

OpenAI は2つのプログレスバーを表示する場合があります：

```
3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
██████████████░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m
```

- **3-hour limit**：3時間スライディングウィンドウ、高頻度使用に適している
- **24-hour limit**：24時間スライディングウィンドウ、長期計画に適している

**チームアカウント**（Team）：
- メインウィンドウとセカンダリウィンドウの2つのクォータがある
- 異なるメンバーが同じTeamクォータを共有する

**個人アカウント**（Plus）：
- 通常、3時間ウィンドウのみが表示される

### Zhipu AI / Z.ai：2つのクォータタイプ

```
5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

MCP limit
███████████████████████████ 100% remaining
Used: 0 / 1000
```

- **5-hour token limit**：5時間以内のToken使用クォータ
- **MCP limit**：Model Context Protocol（モデルコンテキストプロトコル）月次クォータ、検索機能用

::: warning
MCPクォータは月次で、リセット時間が長い。満タンになっていると、来月まで待つ必要があります。
:::

### GitHub Copilot：月次クォータ

```
Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)
```

- **Premium Requests**：Copilot高度機能の使用量
- 具体的な数値が表示される（使用済み / 総クォータ）
- 月次リセット、具体的な日付が表示される

**サブスクリプションタイプの違い**：
| サブスクリプションタイプ | 月次クォータ | 説明 |
| ---------- | -------- | ---------------------- |
| Free | N/A | クォータ制限なし、ただし機能は制限される |
| Pro | 300 | 標準個人版 |
| Pro+ | 更高い | アップグレード版 |
| Business | 更高い | エンタープライズ版 |
| Enterprise | 無制限 | エンタープライズ版 |

### Google Cloud：複数アカウント + 複数モデル

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

**形式**：`モデル名 | リセット時間 | プログレスバー + パーセンテージ`

**4つのモデルの説明**：
| モデル名 | 対応APIキー | 用途 |
| -------- | ---------------------------------------------- | ----------- |
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | 高度な推論 |
| G3 Image | `gemini-3-pro-image` | 画像生成 |
| G3 Flash | `gemini-3-flash` | 高速生成 |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claudeモデル |

**複数アカウント表示**：
- 各Googleアカウントは `###` で区切られる
- 各アカウントは独自の4つのモデルのクォータを表示
- 異なるアカウントのクォータ使用状況を比較できる

## よくある落とし穴

### よくある誤解

| 誤解 | 事実 |
| ------------------------- | -------------------------------------- |
| プログレスバーがすべて塗りつぶされている = 使用していない | 塗りつぶしブロックが多い = **残りが多い**、安心して使える |
| リセット時間が短い = クォータがすぐになくなる | リセット時間が短い = すぐにリセットされる、継続して使える |
| パーセンテージ100% = 使用済み | パーセンテージ100% = **すべて残っている** |
| Zhipu AIは1つのクォータしか表示しない | 実際には TOKENS_LIMIT と TIME_LIMIT の2種類がある |

### クォータが満タンになったらどうする？

プログレスバーがすべて空ブロック（0% remaining）の場合：

1. **短期クォータ**（3時間、5時間など）：リセット時間カウントダウンが終わるまで待つ
2. **月次クォータ**（Copilot、MCPなど）：来月初まで待つ
3. **複数アカウント**：他のアカウントに切り替える（Google Cloudは複数アカウントをサポート）

::: info
mystatusは**読み取り専用ツール**で、クォータを消費せず、API呼び出しもトリガーしません。
:::

## まとめ

- **プログレスバー**：塗りつぶし `█` = 残り、空 `░` = 使用済み
- **リセット時間**：次のクォータ更新までのカウントダウン
- **プラットフォームの違い**：異なるプラットフォームには異なるクォータサイクル（3h/5h/月次）がある
- **複数アカウント**：Google Cloudは複数アカウントを表示し、クォータ管理に便利

## 次のレッスン

> 次のレッスンでは **[OpenAIクォータクエリ](../../platforms/openai-usage/)** を学びます。
>
> 学べること：
> - OpenAIの3時間と24時間クォータの違い
> - チームアカウントのクォータ共有メカニズム
> - JWT Tokenを解析してアカウント情報を取得する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- | ------- |
| プログレスバー生成 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L40-L53) | 40-53 |
| 時間フォーマット | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L18-L29) | 18-29 |
| 残りパーセンテージ計算 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L63-L65) | 63-65 |
| Token数フォーマット | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L70-L72) | 70-72 |
| OpenAI出力フォーマット | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| Zhipu AI出力フォーマット | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L115-L177) | 115-177 |
| Copilot出力フォーマット | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L395-L447) | 395-447 |
| Google Cloud出力フォーマット | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |

**重要な関数**：
- `createProgressBar(percent, width)`：プログレスバーを生成、塗りつぶしブロックは残りを表す
- `formatDuration(seconds)`：秒数を人間が読みやすい時間形式に変換（例： "2h 30m"）
- `calcRemainPercent(usedPercent)`：残りパーセンテージを計算（100 - 使用済みパーセンテージ）
- `formatTokens(tokens)`：Token数を百万単位にフォーマット（例： "0.5M"）

**重要な定数**：
- プログレスバーのデフォルト幅：30文字（Google Cloudモデルは20文字）
- プログレスバー文字：`█`（塗りつぶし）、`░`（空ブロック）

</details>
