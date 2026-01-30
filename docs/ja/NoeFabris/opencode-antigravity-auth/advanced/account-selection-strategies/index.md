---
title: "アカウント選択戦略: 複数アカウントのローテーション設定 | Antigravity Auth"
sidebarTitle: "正しい戦略で無駄なく使いこなす"
subtitle: "アカウント選択戦略：sticky、round-robin、hybridのベストプラクティス"
description: "sticky、round-robin、hybridの3つのアカウント選択戦略について学ぶ。アカウント数に応じた最適な設定を選択し、クォータ効率とリクエスト分散を最適化し、レート制限を回避する。"
tags:
  - "複数アカウント"
  - "負荷分散"
  - "設定"
  - "上級"
prerequisite:
  - "advanced-multi-account-setup"
order: 1
---

# アカウント選択戦略：sticky、round-robin、hybridのベストプラクティス

## 学習後にできること

Googleアカウントの数と使用シナリオに応じて、適切なアカウント選択戦略を選択・設定できる：
- アカウントが1つ → `sticky`戦略でプロンプトキャッシュを保持
- アカウントが2〜3つ → `hybrid`戦略でリクエストをインテリジェントに分散
- アカウントが4つ以上 → `round-robin`戦略でスループットを最大化

「すべてのアカウントがレート制限にかかっているが、実際のクォータは使い切れていない」という状況を回避する。

## 現状の課題

複数のGoogleアカウントを設定したが：
- クォータ効率を最大化するための戦略を確定できていない
- すべてのアカウントがレート制限にかかっているが、特定のアカウントのクォータが残っている状況がよくある
- 並行エージェントシナリオでは、複数の子プロセスが常に同じアカウントを使用し、レート制限に起因する競合が発生する

## 核心的な考え方

### アカウント選択戦略とは

Antigravity Authプラグインは、複数のGoogleアカウント間でモデルリクエストを分散する際に使用できる3つのアカウント選択戦略をサポートする：

| 戦略 | 動作 | 適用シナリオ |
| --- | --- | --- |
| `sticky` | 現在のアカウントがレート制限にかかっていない限り、同じアカウントを継続して使用 | 単一アカウント、プロンプトキャッシュが必要 |
| `round-robin` | 各リクエストで次の利用可能なアカウントにローテーション | 複数アカウント、スループットの最大化 |
| `hybrid`（デフォルト） | 健康スコア + Token bucket + LRU を組み合わせたインテリジェント選択 | 2〜3アカウント、パフォーマンスと安定性のバランス |

::: info 戦略がなぜ必要？
Googleは各アカウントにレート制限を設けている。アカウントが1つだけの場合、頻繁なリクエストにより簡単にレート制限にかかる。複数アカウントを使用することで、ローテーションやインテリジェントな選択を通じてリクエストを分散させ、単一アカウントの過度なクォータ消費を回避できる。
:::

### 3つの戦略の動作原理

#### 1. Sticky戦略（粘着型）

**核心ロジック**：現在のアカウントを維持し、レート制限にかかるまで切り替えない。

**利点**：
- プロンプトキャッシュを保持し、同じコンテキストでより高速に応答
- アカウントの使用パターンが安定し、風管理発動の可能性が低い

**欠点**：
- 複数アカウントのクォータ利用が不均等
- レート制限復帰前に他のアカウントを使用できない

**適用シナリオ**：
- アカウントが1つしかない
- プロンプトキャッシュを重視する（例：長期間の会話）

#### 2. Round-Robin戦略（ローテーション型）

**核心ロジック**：各リクエストで次の利用可能なアカウントにローテーションし、循環して使用する。

**利点**：
- クォータ利用が最も均等
- 並行スループットを最大化
- 高並行シナリオに適している

**欠点**：
- アカウントの健康状態を考慮せず、レート制限から復帰したばかりのアカウントを選択する可能性がある
- プロンプトキャッシュを利用できない

**適用シナリオ**：
- アカウントが4つ以上
- 最大スループットが必要なバッチタスク
- 並行エージェントシナリオ（`pid_offset_enabled`と併用）

#### 3. Hybrid戦略（ハイブリッド型、デフォルト）

**核心ロジック**：3つの要素を総合的に考慮し、最適なアカウントを選択する：

**スコアリング公式**：
```
総合スコア = 健康スコア × 2 + Tokenスコア × 5 + 新鮮度スコア × 0.1
```

- **健康スコア**（0〜200）：アカウントの成功/失敗履歴に基づく
  - 成功リクエスト：+1ポイント
  - レート制限：-10ポイント
  - その他の失敗（認証、ネットワーク）：-20ポイント
  - 初期値：70ポイント、最低0ポイント、最高100ポイント
  - 不使用時も毎時2ポイント回復

- **Tokenスコア**（0〜500）：Token bucketアルゴリズムに基づく
  - 各アカウントの最大token数は50、初期値50token
  - 毎分6token回復
  - 各リクエストで1token消費
  - Tokenスコア = (現在のtoken / 50) × 100 × 5

- **新鮮度スコア**（0〜360）：最後に使用した時刻からの経過時間に基づく
  - 最後に使用してからの時間が長いほどスコアが高い
  - 最大3600秒（1時間）で最大値に達する

**利点**：
- 健康状態の低いアカウントをインテリジェントに回避
- Token bucketにより過密リクエストによるレート制限を回避
- LRU（最も長い間未使用）によりアカウントに十分な休息時間を確保
- パフォーマンスと安定性を総合的に考慮

**欠点**：
- アルゴリズムが複雑で、round-robinほど直感的でない
- アカウントが2つの場合、効果があまり目立たない

**適用シナリオ**：
- アカウントが2〜3つ（デフォルト戦略）
- クォータ利用率と安定性のバランスが必要

### 戦略選択クイックリファレンス

READMEとCONFIGURATION.mdの推奨事項に基づく：

| 設定 | 推奨戦略 | 理由 |
| --- | --- | ---|
| **1アカウント** | `sticky` | ローテーション不要、プロンプトキャッシュを保持 |
| **2〜3アカウント** | `hybrid`（デフォルト） | インテリジェントなローテーション、過度のレート制限を回避 |
| **4+アカウント** | `round-robin` | スループットを最大化、クォータ利用を最も均等化 |
| **並行エージェント** | `round-robin` + `pid_offset_enabled: true` | 異なるプロセスが異なるアカウントを使用 |

## 開始前の準備

::: warning 前提条件の確認
以下を完了していることを確認してください：
- [x] 複数アカウント設定（少なくとも2つのGoogleアカウント）
- [x] [デュアルクォータシステム](/zh/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)を理解
:::

## 実践手順

### ステップ1：現在の設定を確認する

**理由**
現在の設定状態を把握し、不要な繰り返し変更を回避するため。

**操作**

プラグイン設定ファイルを確認：

```bash
cat ~/.config/opencode/antigravity.json
```

**期待される出力**：
```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
```

ファイルが存在しない場合、プラグインはデフォルト設定（`account_selection_strategy` = `"hybrid"`）を使用する。

### ステップ2：アカウント数に応じた戦略の設定

**理由**
アカウント数に応じて適切な戦略を選択しないと、クォータの無駄や頻繁なレート制限が発生する可能性がある。

::: code-group

```bash [1アカウント - Sticky戦略]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky"
}
EOF
```

```bash [2-3アカウント - Hybrid戦略（デフォルト）]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid"
}
EOF
```

```bash [4+アカウント - Round-Robin戦略]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin"
}
EOF
```

:::

**期待される出力**：設定ファイルが対応する戦略に更新されている。

### ステップ3：PIDオフセットの有効化（並行エージェントシナリオ）

**理由**
oh-my-opencodeなどのプラグインを使用して並行エージェントを生成している場合、複数の子プロセスが同時にリクエストを送信する可能性がある。デフォルトでは、これらは同じ開始アカウントから選択を開始するため、アカウントの競合とレート制限が発生する。

**操作**

PIDオフセットを追加して設定を修正：

```bash
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": true
}
EOF
```

**期待される出力**：`pid_offset_enabled` が `true` に設定されている。

**動作原理**：
- 各プロセスはPID（プロセスID）に基づいてオフセットを計算
- オフセット = `PID % アカウント数`
- 異なるプロセスは異なる開始アカウントを優先して使用
- 例：3つのアカウントの場合、PID 100、101、102のプロセスはそれぞれアカウント1、2、0を使用

### ステップ4：戦略の有効性を検証

**理由**
設定が正しく、戦略が期待通りに動作していることを確認する。

**操作**

複数の並行リクエストを送信し、アカウントの切り替えを観察：

```bash
# デバッグログを有効化
export OPENCODE_ANTIGRAVITY_DEBUG=1

# 5つのリクエストを送信
for i in {1..5}; do
  opencode run "Test $i" --model=google/antigravity-gemini-3-pro &
done
wait
```

**期待される出力**：
- ログに異なるリクエストで異なるアカウントが使用されていることが示される
- `account-switch` イベントがアカウント切り替えを記録

ログの例（round-robin戦略）：
```
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
[DEBUG] Selected account: user3@gmail.com (index: 2) - reason: rotation
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
```

### ステップ5：アカウントの健康状態を監視（Hybrid戦略）

**理由**
Hybrid戦略は健康スコアに基づいてアカウントを選択するため、健康状態を把握することで設定の妥当性を判断できる。

**操作**

デバッグログで健康スコアを確認：

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "Hello" --model=google/antigravity-gemini-3-pro
```

**期待される出力**：
```
[VERBOSE] Health scores: {
  "0": { "score": 85, "consecutiveFailures": 0 },
  "1": { "score": 60, "consecutiveFailures": 2 },
  "2": { "score": 70, "consecutiveFailures": 0 }
}
[DEBUG] Selected account: user1@gmail.com (index: 0) - hybrid score: 270.2
```

**解釈**：
- アカウント0：健康スコア85（優秀）
- アカウント1：健康スコア60（使用可能だが、連続失敗2回）
- アカウント2：健康スコア70（良好）
- 最終的にアカウント0が選択され、総合スコア270.2

## チェックポイント ✅

::: tip 設定の有効性を確認するには？
1. 設定ファイルで `account_selection_strategy` 値を確認
2. 複数のリクエストを送信し、ログでアカウント切り替え動作を観察
3. Hybrid戦略：健康スコアの低いアカウントは選択頻度が低くなる
4. Round-robin戦略：アカウントは循環使用され、明らかな選択バイアスがない
:::

## 落とし穴に注意

### ❌ アカウント数と戦略の不一致

**誤った動作**：
- アカウントが2つしかないのにround-robinを使用し、頻繁な切り替えを発生させる
- アカウントが5つあるのにstickyを使用し、クォータ利用が不均等になる

**正しい対応**：クイックリファレンスに従って戦略を選択する。

### ❌ 並行エージェントでPIDオフセットを有効化していない

**誤った動作**：
- 複数の並行エージェントが同時に同じアカウントを使用
- アカウントが急速にレート制限にかかる

**正しい対応**：`pid_offset_enabled: true` を設定する。

### ❌ 健康スコアを無視する（Hybrid戦略）

**誤った動作**：
- 特定のアカウントが頻繁にレート制限にかかっているが、依然として高頻度で使用される
- 健康スコアを活用して問題アカウントを回避しない

**正しい対応**：デバッグログの健康スコアを定期的に確認し、異常がある場合（例：特定アカウントの連続失敗回数 > 5）は、そのアカウントを削除するか戦略を切り替えることを検討する。

### ❌ デュアルクォータプールとシングルクォータ戦略の混用

**誤った動作**：
- Geminiモデルに `:antigravity` サフィックスを付けてAntigravityクォータプールを強制使用
- 同時に `quota_fallback: false` を設定
- あるクォータプールを使い切った後、もう一方のプールにフォールバックできない

**正しい対応**：[デュアルクォータシステム](/ja/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)を理解し、ニーズに応じて `quota_fallback` を設定する。

## 本レッスンのまとめ

| 戦略 | 核心特徴 | 適用シナリオ |
| --- | --- | ---|
| `sticky` | アカウントをレート制限にかかるまで保持 | 1アカウント、プロンプトキャッシュが必要 |
| `round-robin` | アカウントを循環ローテーション | 4+アカウント、スループットの最大化 |
| `hybrid` | 健康 + Token + LRUのインテリジェント選択 | 2〜3アカウント、パフォーマンスと安定性のバランス |

**主要設定**：
- `account_selection_strategy`：戦略の設定（`sticky` / `round-robin` / `hybrid`）
- `pid_offset_enabled`：並行エージェントシナリオでの有効化（`true`）
- `quota_fallback`：Geminiデュアルクォータプールのフォールバック（`true` / `false`）

**検証方法**：
- デバッグログの有効化：`OPENCODE_ANTIGRAVITY_DEBUG=1`
- アカウント切り替えログと健康スコアの確認
- 異なるリクエストで使用されるアカウントインデックスの観察

## 次のレッスン予告

> 次のレッスンでは **[レート制限の処理](/ja/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)** を学びます。
>
> 学べること：
> - 異なる種類の429エラー（クォータ枯渇、レート制限、容量枯渇）の理解
> - 自動リトライとバックオフアルゴリズムの動作原理
> - アカウントを切り替えるべき場合とリセットを待つべき場合の判断

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | ---|
| アカウント選択戦略のエントリーポイント | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L340-L412) | 340-412 |
| Sticky戦略の実装 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L395-L411) | 395-411 |
| Hybrid戦略の実装 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L358-L383) | 358-383 |
| 健康スコアシステム | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L14-L163) | 14-163 |
| Token bucketシステム | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L290-L402) | 290-402 |
| LRU選択アルゴリズム | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L215-L288) | 215-288 |
| PIDオフセットロジック | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L387-L393) | 387-393 |
| 設定Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | ファイルを参照 |

**重要な定数**：
- `DEFAULT_HEALTH_SCORE_CONFIG.initial = 70`：新規アカウントの初期健康スコア
- `DEFAULT_HEALTH_SCORE_CONFIG.minUsable = 50`：アカウントの最小利用可能健康スコア
- `DEFAULT_TOKEN_BUCKET_CONFIG.maxTokens = 50`：各アカウントの最大token数
- `DEFAULT_TOKEN_BUCKET_CONFIG.regenerationRatePerMinute = 6`：毎分のtoken回復数

**重要な関数**：
- `getCurrentOrNextForFamily()`：戦略に基づいてアカウントを選択
- `selectHybridAccount()`：Hybrid戦略のスコアリング選択アルゴリズム
- `getScore()`：健康スコアを取得（時間回復を含む）
- `hasTokens()` / `consume()`：Token bucketの確認と消費
- `sortByLruWithHealth()`：LRU + 健康スコアによるソート

</details>
