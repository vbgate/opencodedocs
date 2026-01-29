---
title: "Copilot クォータ確認 | opencode-mystatus"
sidebarTitle: "クォータ確認"
subtitle: "GitHub Copilotクォータクエリ：Premium Requestsとモデル詳細"
description: "GitHub Copilot の Premium Requests 使用状況を確認する方法を学びます。サブスクリプション別のクォータと認証方式を解説します。"
tags:
  - "github-copilot"
  - "quota"
  - "premium-requests"
  - "pat-authentication"
prerequisite:
  - "start-quick-start"
order: 3
---

# GitHub Copilotクォータクエリ：Premium Requestsとモデル詳細

## 学習後のスキル

- GitHub CopilotのPremium Requests月次使用状況を素早く確認する
- 異なるサブスクリプションタイプ（Free/Pro/Pro+/Business/Enterprise）のクォータ差異を理解する
- モデル使用詳細（GPT-4、Claudeなど）の使用回数を確認する
- 超過使用回数を識別し、追加費用を予測する
- 新OpenCode統合の権限問題を解決する（OAuth Tokenでクォータをクエリできない）

## 現在の課題

::: info 新OpenCode統合の権限問題

OpenCodeの最新OAuth統合は `/copilot_internal/*` APIへのアクセス権限を付与しないため、元のOAuth Token方式でクォータをクエリできなくなりました。

次のようなエラーが表示される場合があります：
```
⚠️ GitHub Copilot クォータクエリが一時的に利用できません。
OpenCodeの新しいOAuth統合はクォータAPIへのアクセスをサポートしていません。
```

これは正常です。このチュートリアルで解決方法を教えます。

:::

## 核心コンセプト

GitHub Copilotのクォータは以下の核心概念に分かれます：

### Premium Requests（主要クォータ）

Premium RequestsはCopilotの主要なクォータ指標で、以下を含みます：
- Chat対話（AIアシスタントとの対話）
- Code Completion（コード補完）
- Copilot Workspace機能（ワークスペースコラボレーション）

::: tip Premium Requestsとは？

簡単に理解すると：Copilotが「作業」を完了するたび（コード生成、質問回答、コード分析）が1回のPremium Requestとなります。これがCopilotの主要な計算単位です。

:::

### サブスクリプションタイプとクォータ

異なるサブスクリプションタイプには異なる月次クォータがあります：

| サブスクリプションタイプ | 月次クォータ | 適用対象 |
|--- | --- | ---|
| Free | 50回 | 個人開発者試用 |
| Pro | 300回 | 個人開発者正式版 |
| Pro+ | 1,500回 | ヘビーユーザー個人版 |
| Business | 300回 | チームサブスクリプション（各アカウント300） |
| Enterprise | 1,000回 | エンタープライズサブスクリプション（各アカウント1000） |

### 超過使用

月次クォータを超えると、Copilotは引き続き使用できますが、追加費用が発生します。超過使用回数は出力で個別に表示されます。

## 実践

### ステップ1：クエリコマンドを実行

OpenCodeでスラッシュコマンドを実行：

```bash
/mystatus
```

**期待される結果**：

Copilotアカウントが設定されている場合（Fine-grained PATまたはOAuth Tokenを使用）、出力には以下のような内容が含まれます：

```
## GitHub Copilot アカウントクォータ

Account:        GitHub Copilot (pro)

Premium Requests [████████░░░░░░░░░░] 40% (180/300)

モデル使用詳細:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests

Period: 2026-01
```

### ステップ2：出力結果を読み取る

出力には以下の主要情報が含まれます：

#### 1. アカウント情報

```
Account:        GitHub Copilot (pro)
```

Copilotサブスクリプションタイプ（pro/free/businessなど）を表示します。

#### 2. Premium Requestsクォータ

```
Premium Requests [████████░░░░░░░░░░] 40% (180/300)
```

- **プログレスバー**：残り比率を直感的に表示
- **パーセンテージ**：残り40%
- **使用済み/総量**：使用済み180回、総量300回

::: tip プログレスバーの説明

緑色/黄色の塗りつぶしは使用済みを表し、空ブロックは残りを表します。塗りつぶしが多いほど使用量が多いことを表します。

:::

#### 3. モデル使用詳細（Public APIのみ）

```
モデル使用詳細:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests
```

各モデルの使用回数を表示します。使用量で降順に並べ替え（最大5個まで表示）。

::: info なぜ私の出力にモデル詳細がないのか？

モデル詳細はPublic API（Fine-grained PAT）方式でのみ表示されます。OAuth Token（Internal API）を使用している場合、モデル詳細は表示されません。

:::

## チェックポイント ✅

以下のステップを完了したら、以下ができるようになります：

- [ ] `/mystatus` 出力でGitHub Copilotクォータ情報を確認できる
- [ ] Premium Requestsのプログレスバーとパーセンテージを理解できる
- [ ] 自分のサブスクリプションタイプと月次クォータを把握している
- [ ] モデル使用詳細を確認する方法を知っている（Fine-grained PATを使用する場合）
- [ ] 超過使用の意味を理解している

## まとめ

このチュートリアルでは、opencode-mystatusを使用してGitHub Copilotのクォータをクエリする方法を学びました：

**重要ポイント**：

1. **Premium Requests**はCopilotの主要なクォータ指標で、Chat、Completion、Workspaceなどの機能を含みます
2. **サブスクリプションタイプ**は月次クォータを決定します：Free 50回、Pro 300回、Pro+ 1,500回、Business 300回、Enterprise 1,000回
3. **超過使用**は追加費用を発生させ、出力で個別に表示されます
4. **Fine-grained PAT**は推奨される認証方式で、OpenCode OAuth統合の変更による影響を受けません
5. **OAuth Token**方式は権限制限で失敗する可能性があり、PATを代替案として使用する必要があります

**出力の解釈**：
- プログレスバー：残り比率を直感的に表示
- パーセンテージ：具体的な残り量
- 使用済み/総量：詳細な使用状況
- モデル詳細（オプション）：各モデルの使用回数
- リセット時間（オプション）：次回リセットまでのカウントダウン

## 次のレッスン

> 次のレッスンでは **[Copilot認証設定](../../advanced/copilot-auth/)** を学びます。
>
> 学べること：
> - OAuth TokenとFine-grained PATの詳細な比較
> - Fine-grained PATを生成する方法（完全なステップ）
> - 権限問題を解決する多様な方案
> - 異なるシナリオでのベストプラクティス

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Copilotクォータクエリ | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 481-524 |
|--- | --- | ---|
| Public Billing APIクエリ | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 157-177 |
| Internal APIクエリ | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 242-304 |

**重要な定数**：

- `COPILOT_PLAN_LIMITS`：各サブスクリプションタイプの月次クォータ（第397-403行）
  - `free: 50`
  - `pro: 300`
  - `pro+: 1500`
  - `business: 300`
  - `enterprise: 1000`

**重要な関数**：

- `queryCopilotUsage()`：メインクエリ関数、2つの認証戦略をサポート（第481-524行）
- `fetchPublicBillingUsage()`：Fine-grained PATを使用してPublic Billing APIをクエリ（第157-177行）
- `fetchCopilotUsage()`：OAuth Tokenを使用してInternal APIをクエリ（第242-304行）

</details>
