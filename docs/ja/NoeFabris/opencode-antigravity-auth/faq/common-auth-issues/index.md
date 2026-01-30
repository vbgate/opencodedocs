---
title: "OAuth 認証トラブルシューティング: よくある問題の解決 | Antigravity Auth"
sidebarTitle: "OAuth 認証失敗の対処法"
subtitle: "OAuth 認証トラブルシューティング: よくある問題の解決"
description: "Antigravity Auth プラグインの OAuth 認証問題のトラブルシューティング方法を学びます。Safari コールバック失敗、403 エラー、レート制限、WSL2/Docker 環境設定など、よくある障害の解決策を網羅しています。"
tags:
  - FAQ
  - トラブルシューティング
  - OAuth
  - 認証
prerequisite:
  - start-first-auth-login
  - start-quick-install
order: 1
---

# よくある認証問題のトラブルシューティング

このレッスンを終えると、OAuth 認証失敗、トークン更新エラー、権限拒否などのよくある問題を自分で解決し、プラグインの正常な使用を素早く回復できるようになります。

## 今あなたが直面している問題

Antigravity Auth プラグインをインストールしたばかりで、Claude や Gemini 3 モデルを使おうとしたところ：

- `opencode auth login` を実行後、ブラウザでの認証は成功したが、ターミナルで「認証失敗」と表示される
- しばらく使用した後、突然「Permission Denied」や「invalid_grant」エラーが発生する
- すべてのアカウントが「レート制限」と表示されるが、クォータはまだ残っている
- WSL2 や Docker 環境で OAuth 認証を完了できない
- Safari ブラウザで OAuth コールバックが常に失敗する

これらの問題はよくあることで、ほとんどの場合、再インストールやサポートへの連絡は不要です。本記事に沿ってステップバイステップでトラブルシューティングすれば解決できます。

## このガイドを使うタイミング

以下の状況に遭遇した場合、本チュートリアルを参照してください：
- **OAuth 認証失敗**：`opencode auth login` が完了しない
- **トークン失効**：invalid_grant、Permission Denied エラー
- **レート制限**：429 エラー、「すべてのアカウントがレート制限中」
- **環境問題**：WSL2、Docker、リモート開発環境
- **プラグイン競合**：oh-my-opencode や他のプラグインとの非互換性

::: tip クイックリセット
認証問題に遭遇した場合、**90% のケース**はアカウントファイルを削除して再認証することで解決できます：
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```
:::

---

## クイック診断フロー

問題に遭遇したら、以下の順序で素早く特定してください：

1. **設定パスを確認** → ファイルの場所が正しいか確認
2. **アカウントファイルを削除して再認証** → ほとんどの認証問題を解決
3. **エラーメッセージを確認** → 具体的なエラータイプに応じた解決策を探す
4. **ネットワーク環境を確認** → WSL2/Docker は追加設定が必要

---

## コアコンセプト：OAuth 認証とトークン管理

問題を解決する前に、いくつかの重要な概念を理解しましょう。

::: info OAuth 2.0 PKCE 認証とは？

Antigravity Auth は **OAuth 2.0 with PKCE**（Proof Key for Code Exchange）認証メカニズムを使用しています：

1. **認可コード**：認可後、Google が一時的な認可コードを返します
2. **トークン交換**：プラグインが認可コードを `access_token`（API 呼び出し用）と `refresh_token`（更新用）に交換します
3. **自動更新**：`access_token` の有効期限の 30 分前に、プラグインが自動的に `refresh_token` を使用して更新します
4. **トークン保存**：すべてのトークンはローカルの `~/.config/opencode/antigravity-accounts.json` に保存され、サーバーにはアップロードされません

**セキュリティ**：PKCE メカニズムは認可コードの傍受を防ぎ、トークンが漏洩しても攻撃者は再認可できません。

:::

::: info レート制限（Rate Limit）とは？

Google は各 Google アカウントの API 呼び出しに頻度制限を設けています。制限がトリガーされると：

- **429 Too Many Requests**：リクエストが頻繁すぎるため、待機が必要
- **403 Permission Denied**：ソフトバンまたは不正使用検出がトリガーされた可能性
- **リクエストハング**：200 OK だがレスポンスなし、通常はサイレントスロットリングを示す

**マルチアカウントの利点**：複数のアカウントをローテーションすることで、単一アカウントの制限を回避し、全体のクォータを最大化できます。

:::

---

## 設定パスの説明

すべてのプラットフォーム（Windows を含む）で `~/.config/opencode/` を設定ディレクトリとして使用します：

| ファイル | パス | 説明 |
| --- | --- | --- |
| メイン設定 | `~/.config/opencode/opencode.json` | OpenCode メイン設定ファイル |
| アカウントファイル | `~/.config/opencode/antigravity-accounts.json` | OAuth トークンとアカウント情報 |
| プラグイン設定 | `~/.config/opencode/antigravity.json` | プラグイン固有の設定 |
| デバッグログ | `~/.config/opencode/antigravity-logs/` | デバッグログファイル |

> **Windows ユーザーへの注意**：`~` は自動的にユーザーディレクトリ（例：`C:\Users\YourName`）に解決されます。`%APPDATA%` は使用しないでください。

---

## OAuth 認証問題

### Safari OAuth コールバック失敗（macOS）

**症状**：
- ブラウザでの認証成功後、ターミナルで「fail to authorize」と表示される
- Safari が「Safari はページを開けません」または「接続が拒否されました」と表示する

**原因**：Safari の「HTTPS-Only モード」が `http://localhost` コールバックアドレスをブロックしています。

**解決策**：

**方法 1：他のブラウザを使用（最も簡単）**

1. `opencode auth login` を実行
2. ターミナルに表示された OAuth URL をコピー
3. Chrome または Firefox に貼り付けて開く
4. 認可を完了

**方法 2：HTTPS-Only モードを一時的に無効化**

1. Safari → 設定（⌘,）→ プライバシー
2. 「HTTPS-Only モードを有効にする」のチェックを外す
3. `opencode auth login` を実行
4. 認証完了後、HTTPS-Only モードを再度有効化

**方法 3：コールバックを手動で抽出（上級者向け）**

Safari がエラーを表示する際、アドレスバーに `?code=...&scope=...` が含まれています。コールバックパラメータを手動で抽出できます。詳細は [issue #119](https://github.com/NoeFabris/opencode-antigravity-auth/issues/119) を参照してください。

### ポートが既に使用中

**エラーメッセージ**：`Address already in use`

**原因**：OAuth コールバックサーバーはデフォルトで `localhost:51121` を使用し、ポートが使用中の場合は起動できません。

**解決策**：

**macOS / Linux：**
```bash
# ポートを使用しているプロセスを検索
lsof -i :51121

# プロセスを終了（<PID> を実際のプロセス ID に置き換え）
kill -9 <PID>

# 再認証
opencode auth login
```

**Windows：**
```powershell
# ポートを使用しているプロセスを検索
netstat -ano | findstr :51121

# プロセスを終了（<PID> を実際のプロセス ID に置き換え）
taskkill /PID <PID> /F

# 再認証
opencode auth login
```

### WSL2 / Docker / リモート開発環境

**問題**：OAuth コールバックはブラウザが OpenCode を実行している `localhost` にアクセスできる必要がありますが、コンテナやリモート環境では直接アクセスできません。

**WSL2 の解決策**：
- VS Code のポートフォワーディングを使用
- または Windows → WSL ポートフォワーディングを設定

**SSH / リモート開発の解決策**：
```bash
# SSH トンネルを確立し、リモートの 51121 ポートをローカルに転送
ssh -L 51121:localhost:51121 user@remote-host
```

**Docker / コンテナの解決策**：
- コンテナ内では localhost コールバックを使用できません
- 30 秒待ってから手動 URL フローを使用
- または SSH ポートフォワーディングを使用

### マルチアカウント認証問題

**症状**：複数のアカウントの認証が失敗または混乱する。

**解決策**：
1. アカウントファイルを削除：`rm ~/.config/opencode/antigravity-accounts.json`
2. 再認証：`opencode auth login`
3. 各アカウントが異なる Google メールアドレスを使用していることを確認

---

## トークン更新問題

### invalid_grant エラー

**エラーメッセージ**：
```
Error: invalid_grant
Token has been revoked or expired.
```

**原因**：
- Google アカウントのパスワード変更
- アカウントでセキュリティイベントが発生（不審なログインなど）
- `refresh_token` の失効

**解決策**：
```bash
# アカウントファイルを削除
rm ~/.config/opencode/antigravity-accounts.json

# 再認証
opencode auth login
```

### トークン期限切れ

**症状**：しばらく使用していない後、モデルを再度呼び出すとエラーが発生する。

**原因**：`access_token` の有効期間は約 1 時間、`refresh_token` はより長いですが、それも期限切れになります。

**解決策**：
- プラグインはトークンの有効期限の 30 分前に自動更新するため、手動操作は不要
- 自動更新が失敗した場合は、再認証：`opencode auth login`

---

## 権限エラー

### 403 Permission Denied（rising-fact-p41fc）

**エラーメッセージ**：
```
Permission 'cloudaicompanion.companions.generateChat' denied on resource
'//cloudaicompanion.googleapis.com/projects/rising-fact-p41fc/locations/global'
```

**原因**：プラグインは有効なプロジェクトが見つからない場合、デフォルトの Project ID（例：`rising-fact-p41fc`）にフォールバックします。これは Antigravity モデルには機能しますが、Gemini CLI モデルでは失敗します。Gemini CLI は自分のアカウント内の GCP プロジェクトが必要だからです。

**解決策**：

**ステップ 1：GCP プロジェクトを作成または選択**

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成するか、既存のプロジェクトを選択
3. プロジェクト ID をメモ（例：`my-gemini-project`）

**ステップ 2：Gemini for Google Cloud API を有効化**

1. Google Cloud Console で「API とサービス」→「ライブラリ」に移動
2. 「Gemini for Google Cloud API」（`cloudaicompanion.googleapis.com`）を検索
3. 「有効にする」をクリック

**ステップ 3：アカウントファイルに projectId を追加**

`~/.config/opencode/antigravity-accounts.json` を編集：

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "your@gmail.com",
      "refreshToken": "...",
      "projectId": "my-gemini-project"
    }
  ]
}
```

::: warning マルチアカウント設定
複数の Google アカウントを設定している場合、各アカウントに対応する `projectId` を追加する必要があります。
:::

---
