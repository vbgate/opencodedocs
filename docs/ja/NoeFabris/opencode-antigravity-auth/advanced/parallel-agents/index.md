---
title: "PID オフセット: 並列エージェントのアカウント割り当て最適化 | Antigravity Auth"
sidebarTitle: "複数エージェントの競合回避"
subtitle: "並列エージェント最適化：PID オフセットとアカウント割り当て"
description: "PID オフセットが oh-my-opencode 並列エージェントのアカウント割り当てをどのように最適化するかを学びます。設定方法、戦略の組み合わせ、効果検証、トラブルシューティングをカバーします。"
tags:
  - "advanced"
  - "parallel-agents"
  - "pid-offset"
  - "oh-my-opencode"
  - "load-balancing"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
  - "advanced-multi-account-setup"
order: 5
---

# 並列エージェント最適化：PID オフセットとアカウント割り当て

**PID オフセット**は、プロセス ID に基づくアカウント割り当て最適化メカニズムです。`process.pid % accounts.length` で計算されたオフセット量により、複数の OpenCode プロセスや oh-my-opencode 並列エージェントが異なる Google アカウントを優先的に選択できるようになります。複数のプロセスが同時に実行される際、各プロセスは自身の PID の剰余に基づいて自動的に異なる開始アカウントを選択し、複数のプロセスが同じアカウントに集中することによる 429 レート制限エラーを効果的に回避します。これにより、並列シナリオでのリクエスト成功率とクォータ利用率が大幅に向上し、複数の Agent や並列タスクを同時に実行する必要がある開発者に特に適しています。

## このチュートリアルで学べること

- 並列エージェントシナリオにおけるアカウント競合問題の理解
- PID オフセット機能を有効化し、異なるプロセスが異なるアカウントを優先的に選択できるようにする
- round-robin 戦略と組み合わせて、マルチアカウント利用率を最大化する
- 並列エージェントにおけるレート制限とアカウント選択の問題をトラブルシューティングする

## 今あなたが直面している課題

oh-my-opencode を使用したり、複数の OpenCode インスタンスを同時に実行する際、以下のような問題に遭遇する可能性があります：

- 複数のサブエージェントが同時に同じアカウントを使用し、頻繁に 429 レート制限に遭遇する
- 複数のアカウントを設定しているにもかかわらず、並行リクエスト時に同じアカウントに集中してしまう
- 異なるプロセスが起動時にすべて最初のアカウントから開始し、アカウント割り当てが不均等になる
- リクエスト失敗後、再試行までに長時間待つ必要がある

## どんな時にこの方法を使うべきか

PID オフセット機能は以下のシーンに適しています：

| シーン | PID オフセットの必要性 | 理由 |
| --- | --- | --- |
| 単一の OpenCode インスタンス | ❌ 不要 | 単一プロセスのため、アカウント競合が発生しない |
| 手動での複数アカウント切り替え | ❌ 不要 | 非並行のため、sticky 戦略で十分 |
| oh-my-opencode 複数 Agent | ✅ 推奨 | マルチプロセス並行のため、アカウント分散が必要 |
| 複数の OpenCode を同時実行 | ✅ 推奨 | 異なるプロセスが独立した PID を持ち、自動分散 |
| CI/CD 並列タスク | ✅ 推奨 | 各タスクが独立したプロセスで、競合を回避 |

::: warning 前提条件の確認
このチュートリアルを始める前に、以下が完了していることを確認してください：
- ✅ 少なくとも 2 つの Google アカウントを設定済み
- ✅ アカウント選択戦略の動作原理を理解している
- ✅ oh-my-opencode を使用しているか、複数の OpenCode インスタンスを並列実行する必要がある

[マルチアカウント設定チュートリアル](../multi-account-setup/) | [アカウント選択戦略チュートリアル](../account-selection-strategies/)
:::

## 基本的な仕組み

### PID オフセットとは？

**PID (Process ID)** は、オペレーティングシステムが各プロセスに割り当てる一意の識別子です。複数の OpenCode プロセスが同時に実行される際、各プロセスは異なる PID を持ちます。

**PID オフセット**は、プロセス ID に基づくアカウント割り当て最適化です：

```
3 つのアカウント（index: 0, 1, 2）がある場合：

プロセス A (PID=123):
  123 % 3 = 0 → アカウント 0 を優先使用

プロセス B (PID=456):
  456 % 3 = 1 → アカウント 1 を優先使用

プロセス C (PID=789):
  789 % 3 = 2 → アカウント 2 を優先使用
```

各プロセスは自身の PID の剰余に基づいて、異なるアカウントを優先的に選択し、最初から同じアカウントに集中することを回避します。

### なぜ PID オフセットが必要なのか？

PID オフセットがない場合、すべてのプロセスは起動時にアカウント 0 から開始します：

```
タイムライン:
T1: プロセス A 起動 → アカウント 0 を使用
T2: プロセス B 起動 → アカウント 0 を使用  ← 競合！
T3: プロセス C 起動 → アカウント 0 を使用  ← 競合！
```

PID オフセットを有効化すると：

```
タイムライン:
T1: プロセス A 起動 → PID オフセット → アカウント 0 を使用
T2: プロセス B 起動 → PID オフセット → アカウント 1 を使用  ← 分散！
T3: プロセス C 起動 → PID オフセット → アカウント 2 を使用  ← 分散！
```

### アカウント選択戦略との組み合わせ

PID オフセットは sticky 戦略のフォールバック段階でのみ有効です（round-robin と hybrid 戦略には独自の割り当てロジックがあります）：

| 戦略 | PID オフセットの有効性 | 推奨シーン |
| --- | --- | --- |
| `sticky` | ✅ 有効 | 単一プロセス + プロンプトキャッシュ優先 |
| `round-robin` | ❌ 無効 | マルチプロセス/並列エージェント、最大スループット |
| `hybrid` | ❌ 無効 | インテリジェント割り当て、ヘルススコア優先 |

**なぜ round-robin は PID オフセットが不要なのか？**

round-robin 戦略自体がアカウントをローテーションします：

```typescript
// 各リクエストで次のアカウントに切り替え
this.cursor++;
const account = available[this.cursor % available.length];
```

複数のプロセスは自然に異なるアカウントに分散されるため、追加の PID オフセットは不要です。

::: tip ベストプラクティス
並列エージェントシナリオでは、以下の設定を推奨します：

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false  // round-robin では不要
}
```

sticky または hybrid 戦略を使用する必要がある場合のみ、PID オフセットを有効化してください。
:::

## 実践手順

### ステップ 1：マルチアカウント設定を確認する

**なぜ必要か**
PID オフセットは少なくとも 2 つのアカウントがないと効果を発揮しません。アカウントが 1 つしかない場合、PID の剰余がどうであれ、そのアカウントしか使用できません。

**操作手順**

現在のアカウント数を確認します：

```bash
opencode auth list
```

少なくとも 2 つのアカウントが表示されるはずです：

```
2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

アカウントが 1 つしかない場合は、さらにアカウントを追加します：

```bash
opencode auth login
```

プロンプトに従って `(a)dd new account(s)` を選択します。

**期待される結果**：アカウントリストに 2 つ以上のアカウントが表示される。

### ステップ 2：PID オフセットを設定する

**なぜ必要か**
設定ファイルで PID オフセット機能を有効化し、プラグインがアカウント選択時にプロセス ID を考慮するようにします。

**操作手順**

OpenCode 設定ファイルを開きます：

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

以下の設定を追加または修正します：

```json
{
  "pid_offset_enabled": true
}
```

完全な設定例（sticky 戦略と組み合わせ）：

```json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "sticky"
}
```

**環境変数による方法**（オプション）：

```bash
export OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1
```

**期待される結果**：設定ファイルで `pid_offset_enabled` が `true` に設定されている。

### ステップ 3：PID オフセットの効果を検証する

**なぜ必要か**
実際に複数のプロセスを実行して、PID オフセットが有効になっているか、異なるプロセスが異なるアカウントを優先的に使用しているかを検証します。

**操作手順**

2 つのターミナルウィンドウを開き、それぞれで OpenCode を実行します：

**ターミナル 1**:
```bash
opencode chat
# リクエストを送信し、使用されたアカウントを記録（ログまたはトーストで確認）
```

**ターミナル 2**:
```bash
opencode chat
# リクエストを送信し、使用されたアカウントを記録
```

アカウント選択動作を観察します：

- ✅ **期待される動作**：2 つのターミナルが異なるアカウントを優先的に使用
- ❌ **問題**：2 つのターミナルが同じアカウントを使用

問題が続く場合は、以下を確認してください：

1. 設定が正しく読み込まれているか
2. アカウント選択戦略が `sticky` になっているか（round-robin は PID オフセット不要）
3. アカウントが 1 つしかないか

デバッグログを有効化して、詳細なアカウント選択プロセスを確認します：

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=1
opencode chat
```

ログには以下のように表示されます：

```
[accounts] Applying PID offset: 1 (process.pid % accounts.length)
[accounts] Starting account index for 'claude': 1
```

**期待される結果**：異なるターミナルが異なるアカウントを優先的に使用するか、ログに PID オフセットが適用されたことが表示される。

### ステップ 4：（オプション）round-robin 戦略と組み合わせる

**なぜ必要か**
round-robin 戦略自体がアカウントをローテーションするため、PID オフセットは不要です。しかし、高頻度並行の並列エージェントには、round-robin がより良い選択です。

**操作手順**

設定ファイルを修正します：

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false
}
```

複数の oh-my-opencode Agent を起動し、リクエスト分布を観察します：

```
Agent 1 → アカウント 0 → アカウント 1 → アカウント 2 → アカウント 0 ...
Agent 2 → アカウント 1 → アカウント 2 → アカウント 0 → アカウント 1 ...
```

各 Agent が独立してローテーションし、すべてのアカウントのクォータを十分に活用します。

**期待される結果**：リクエストがすべてのアカウントに均等に分散され、各 Agent が独立してローテーションする。

## チェックポイント ✅

上記のステップを完了すると、以下ができるようになります：

- [ ] 少なくとも 2 つの Google アカウントを正常に設定
- [ ] `antigravity.json` で `pid_offset_enabled` を有効化
- [ ] 複数の OpenCode インスタンスを実行する際、異なるプロセスが異なるアカウントを優先的に使用
- [ ] round-robin が PID オフセット不要な理由を理解
- [ ] デバッグログを使用してアカウント選択プロセスを確認

## よくあるトラブルと解決策

### 問題 1: 有効化しても効果がない

**症状**：`pid_offset_enabled: true` を設定したが、複数のプロセスが依然として同じアカウントを使用する。

**原因**：アカウント選択戦略が `round-robin` または `hybrid` になっている可能性があります。これらの戦略は PID オフセットを使用しません。

**解決策**：`sticky` 戦略に切り替えるか、現在の戦略が PID オフセット不要であることを理解してください。

```json
{
  "account_selection_strategy": "sticky",  // sticky に変更
  "pid_offset_enabled": true
}
```

### 問題 2: アカウントが 1 つしかない

**症状**：PID オフセットを有効化したが、すべてのプロセスが依然としてアカウント 0 を使用する。

**原因**：PID オフセットは `process.pid % accounts.length` で計算されます。アカウントが 1 つしかない場合、剰余は常に 0 です。

**解決策**：さらにアカウントを追加します：

```bash
opencode auth login
# (a)dd new account(s) を選択
```

### 問題 3: プロンプトキャッシュが無効になる

**症状**：PID オフセットを有効化した後、Anthropic のプロンプトキャッシュが機能しなくなった。

**原因**：PID オフセットにより、異なるプロセスやセッションが異なるアカウントを使用する可能性があり、プロンプトキャッシュはアカウントごとに共有されます。アカウントを切り替えると、プロンプトを再送信する必要があります。

**解決策**：これは予期される動作です。プロンプトキャッシュの優先度が高い場合は、PID オフセットを無効化し、sticky 戦略を使用してください：

```json
{
  "pid_offset_enabled": false,
  "account_selection_strategy": "sticky"
}
```

### 問題 4: oh-my-opencode 複数 Agent の競合

**症状**：マルチアカウントを設定しているにもかかわらず、oh-my-opencode の複数の Agent が頻繁に 429 エラーに遭遇する。

**原因**：oh-my-opencode が Agent を順次起動し、短時間内に複数の Agent が同じアカウントに同時にリクエストする可能性があります。

**解決策**：

1. `round-robin` 戦略を使用（推奨）：

```json
{
  "account_selection_strategy": "round-robin"
}
```

2. またはアカウント数を増やし、各 Agent が独立したアカウントを持つようにします：

```bash
# 3 つの Agent がある場合、少なくとも 5 つのアカウントを推奨
opencode auth login
```

## このチュートリアルのまとめ

PID オフセット機能は、プロセス ID (PID) を通じてマルチプロセスシナリオでのアカウント割り当てを最適化します：

- **原理**：`process.pid % accounts.length` でオフセット量を計算
- **効果**：異なるプロセスが異なるアカウントを優先的に選択し、競合を回避
- **制限**：sticky 戦略でのみ有効、round-robin と hybrid は不要
- **ベストプラクティス**：並列エージェントシナリオでは round-robin 戦略を推奨、PID オフセット不要

マルチアカウント設定後、使用シナリオに応じて適切な戦略を選択してください：

| シーン | 推奨戦略 | PID オフセット |
| --- | --- | --- |
| 単一プロセス、プロンプトキャッシュ優先 | sticky | 不要 |
| マルチプロセス/並列エージェント | round-robin | 不要 |
| hybrid 戦略 + 分散起動 | hybrid | オプション |

## 次のチュートリアル

> 次は **[設定オプション完全ガイド](../configuration-guide/)** を学びます。
>
> 学べる内容：
> - 設定ファイルの場所と優先順位
> - モデル動作、アカウントローテーション、アプリケーション動作の設定オプション
> - 異なるシナリオでの推奨設定方案
> - 高度な設定チューニング方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| PID オフセット実装 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L388-L393) | 388-393 |
| 設定 Schema 定義 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L244-L255) | 244-255 |
| 環境変数サポート | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts#L163-L168) | 163-168 |
| 設定渡し位置 | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts#L902) | 902 |
| 使用ドキュメント | [`docs/MULTI-ACCOUNT.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MULTI-ACCOUNT.md#L111-L125) | 111-125 |
| 設定ガイド | [`docs/CONFIGURATION.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/CONFIGURATION.md#L69) | 69 |

**主要な関数**:
- `getCurrentOrNextForFamily()`: アカウント選択メイン関数、内部で PID オフセットロジックを処理
- `process.pid % this.accounts.length`: オフセット量を計算するコア式

**主要な定数**:
- `sessionOffsetApplied[family]`: 各モデルファミリーのオフセット適用マーク（セッションごとに 1 回のみ適用）

</details>
