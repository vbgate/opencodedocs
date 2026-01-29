---
title: "Invalid Grant トラブルシューティング: アカウント無効化と復旧 | Antigravity-Manager"
sidebarTitle: "アカウントが無効化されたらどう回復するか"
subtitle: "invalid_grant とアカウント自動無効化：なぜ発生するか、どう回復するか"
description: "invalid_grant エラーの意味と自動処理ロジックを学びます。refresh_token 失効を確認した後、再度 OAuth でアカウントを追加して自動無効化を解除し、復旧が Proxy に有効になったかを検証します。"
tags:
  - "FAQ"
  - "エラートラブルシューティング"
  - "OAuth"
  - "アカウント管理"
  - "invalid_grant"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
  - "advanced-scheduling"
order: 1
---
# invalid_grant とアカウント自動無効化：なぜ発生するか、どう回復するか

## 学んだ後できること

- `invalid_grant` を見たとき、どの refresh_token 問題に対応しているかを知る
- 「アカウントがなぜ突然使えなくなったのか」を明確にする：どのような状況で自動的に無効化されるか、無効化後にシステムがどう処理するか
- 最短パスでアカウントを回復し、回復が実行中の Proxy に有効になったかを確認

## 現在遭遇している症状

- ローカル Proxy を呼び出すときに突然失敗し、エラーメッセージに `invalid_grant` が現れる
- 明らかにアカウントはまだ Accounts リストにあるのに、Proxy はずっとそれをスキップする（または「もう使われていない」と感じる）
- アカウント数が少ない時、一度 `invalid_grant` に遭遇した後、全体の可用性が明らかに悪化

## invalid_grant とは？

**invalid_grant** は Google OAuth が `access_token` をリフレッシュする際に返すエラーのカテゴリです。Antigravity Tools にとって、それはあるアカウントの `refresh_token` がすでに取り消されたか期限切れの可能性が高いことを意味し、再試行しても繰り返し失敗するため、システムはそのアカウントを利用不可としてマークし、プロキシプールから除外します。

## コアコンセプト：システムは「一時的にスキップ」ではなく「永続的に無効化」

Proxy が token リフレッシュのエラー文字列に `invalid_grant` が含まれるのを検出したとき、2 つのことを行います：

1. **アカウントを disabled に書く**（アカウント JSON に保存）
2. **アカウントをメモリの token pool から削除**（同じ悪いアカウントを繰り返し選択するのを避ける）

これが「アカウントはあるのに、Proxy はもう使わない」ことの理由です。

::: info disabled vs proxy_disabled

- `disabled=true`：アカウントが「完全に無効化」（典型的な原因は `invalid_grant`）。アカウントプールをロードする時に直接スキップ
- `proxy_disabled=true`：アカウントは「Proxy に対して利用不可」（手動無効化/バッチ操作/クォータ保護関連ロジック）、意味が異なる

この 2 つの状態はアカウントプールをロードする時に分けて判断されます：先に `disabled` を判断し、その後クォータ保護と `proxy_disabled` 判断を行います。

:::

## 手順通りに進める

### 第 1 ステップ：refresh_token リフレッシュがトリガーした invalid_grant か確認

**なぜか**：`invalid_grant` は複数の呼び出しチェーンに現れる可能性がありますが、このプロジェクトの「自動無効化」は**access_token リフレッシュ失敗**時のみトリガーされます。

Proxy ログで、類似のエラーログが見えます（キーワードは `Token 刷新失敗` + `invalid_grant`）：

```text
Token 刷新失敗 (<email>): <...invalid_grant...>，尝试下一个账号
Disabling account due to invalid_grant (<email>): refresh_token likely revoked/expired
```

**表示されるべきもの**：同じアカウントが `invalid_grant` に出現した後、すぐに選択されなくなります（token pool から削除されたため）。

### 第 2 ステップ：アカウントファイルで disabled フィールドを確認（オプションだが最も正確）

**なぜか**：自動無効化は「保存」されるため、ファイル内容を確認すると、「一時的なローテーション」の誤判を排除できます。

アカウントファイルはアプリデータディレクトリの `accounts/` ディレクトリにあります（データディレクトリの場所は **[初回起動必読：データディレクトリ、ログ、トレイと自動起動](../../start/first-run-data/)** を参照）。アカウントが無効化された時、ファイルにこの 3 つのフィールドが現れます：

```json
{
  "disabled": true,
  "disabled_at": 1700000000,
  "disabled_reason": "invalid_grant: ..."
}
```

**表示されるべきもの**：`disabled` が `true` で、`disabled_reason` に `invalid_grant:` プレフィックスが含まれる。

### 第 3 ステップ：アカウントを回復（推奨做法：同じアカウントを再度追加）

**なぜか**：このプロジェクトの「回復」は Proxy でスイッチを手動でクリックすることではなく、「明示的に token を更新」して自動無効化を解除することをトリガーします。

**Accounts** ページで、新しい認証情報を使って再度アカウントを追加します（いずれかの方法を選択）：

1. OAuth 認証フローを再度通す（**[アカウント追加：OAuth/Refresh Token デュアルチャネルとベストプラクティス](../../start/add-account/)** を参照）
2. 新しい `refresh_token` を使って再度追加（システムは Google が返したメールを基準に upsert）

システムが今回 upsert した `refresh_token` または `access_token` が旧値と異なり、かつそのアカウントが以前 `disabled=true` だったことを検出したとき、自動的にクリアします：

- `disabled`
- `disabled_reason`
- `disabled_at`

**表示されるべきもの**：アカウントはもう disabled 状態ではなく、かつ（Proxy が実行中なら）アカウントプールが自動的にリロードされ、回復が直ちに有効になります。

### 第 4 ステップ：回復が Proxy に有効になったか検証

**なぜか**：アカウントが 1 つだけの場合、または他のアカウントも利用不可の場合、回復後すぐに「可用性が戻ってきた」のが見えるはずです。

検証方法：

1. token リフレッシュをトリガーするリクエストを一度行う（例：token の期限切れが近づいてからリクエスト）
2. ログでもう「disabled アカウントをスキップ」の提示が出ないことを観察

**表示されるべきもの**：リクエストが正常に通り、ログでもはやそのアカウントに対する `invalid_grant` 無効化フローが出ない。

## 罠の警告

### ❌ disabled を「一時的なローテーション」と間違える

UI だけで「アカウントはある」と見ると、誤って「システムは一時的に使っていないだけ」と判断しやすいです。しかし `disabled=true` はディスクに書かれており、再起動後も引き続き有効になります。

### ❌ access_token だけを補充し、refresh_token を更新しない

`invalid_grant` のトリガーポイントは `access_token` をリフレッシュする時に使用した `refresh_token` です。一時的にまだ使える `access_token` を取得しても、`refresh_token` は依然として無効であれば、後で再び無効化がトリガーされます。

## チェックポイント ✅

- [ ] ログで `invalid_grant` が refresh_token リフレッシュ失敗から来ることを確認できる
- [ ] `disabled` と `proxy_disabled` の意味の違いを知っている
- [ ] アカウントを再度追加（OAuth または refresh_token）してアカウントを回復できる
- [ ] 回復が実行中の Proxy に有効になったか検証できる

## レッスンまとめ

- `invalid_grant` がトリガーされると、Proxy はアカウントを **disabled として保存**し、token pool から削除し、繰り返し失敗することを回避
- 回復の鍵は「明示的に token を更新」すること（再度 OAuth または新 refresh_token で再度追加）、システムは自動的に `disabled_*` フィールドをクリア
- データディレクトリのアカウント JSON が最も権威のある状態のソース（無効化/原因/時間がすべて含まれる）

## 次のレッスン予告

> 次のレッスンでは **[401/認証失敗：auth_mode、Header 互換性とクライアント設定チェックリスト](../auth-401/)** を学びます
>
> 学べること：
> - 401 は通常「モード/Key/Header」のどのレイヤーが不一致か
> - 異なるクライアントはどの認証 Header を持つべきか
> - 最短パスで自己検証し修正する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新時間：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| 設計説明：invalid_grant の問題と変更動作 | [`docs/proxy-invalid-grant.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-invalid-grant.md#L1-L52) | 1-52 |
| アカウントプールをロードする時に `disabled=true` をスキップ | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L70-L158) | 70-158 |
| token リフレッシュ失敗時に `invalid_grant` を識別しアカウントを無効化 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L840-L890) | 840-890 |
| `disabled/disabled_at/disabled_reason` を永続化して書き込み、メモリから削除 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| `disabled_reason` トリミング（アカウントファイル肥大化回避） | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1464-L1471) | 1464-1471 |
| upsert 時に自動的に `disabled_*` をクリア（token 変更＝ユーザーが認証情報を修復したと見なす） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L178-L206) | 178-206 |
| アカウントを再度追加後、自動的に proxy accounts をリロード（実行中に直ちに有効） | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L21-L59) | 21-59 |

</details>
