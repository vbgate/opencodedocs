---
title: "トラブルシューティング: エラー解決 | opencode-mystatus"
sidebarTitle: "トラブルシューティング"
subtitle: "トラブルシューティング：クォータクエリ不可、Token期限切れ、権限問題"
description: "opencode-mystatusのエラー解決方法を学びます。Token期限切れ、権限不足、APIリクエスト失敗など一般的な問題の解決策を提供します。"
tags:
  - "トラブルシューティング"
  - "一般的な質問"
  - "Token期限切れ"
  - "権限問題"
prerequisite:
  - "start-quick-start"
order: 1
---

# トラブルシューティング：クォータクエリ不可、Token期限切れ、権限問題

opencode-mystatusプラグインを使用する際、様々なエラーに遭遇する可能性があります：認証ファイルの読み取り不可、OAuth Tokenの期限切れ、GitHub Copilotの権限不足、APIリクエスト失敗など。これらの一般的な問題は、通常、簡単な設定や再認証で解決できます。

## 核心概念

mystatusツールのエラー処理メカニズムは3層に分かれています：

1. **認証ファイル読み取り層**：`auth.json` の存在と形式を確認
2. **プラットフォームクエリ層**：各プラットフォームが独立してクエリ、失敗しても他のプラットフォームに影響しない
3. **APIリクエスト層**：ネットワークリクエストはタイムアウトやエラーを返す可能性があるが、ツールは他のプラットフォームを試行し続ける

## 問題トラブルシューティングリスト

### 問題1：認証ファイルを読み取れない

**エラーメッセージ**：
```
❌ 認証ファイルを読み取れません: ~/.local/share/opencode/auth.json
エラー: ENOENT: no such file or directory
```

**解決方法**：
1. OpenCodeがインストールされ、設定されていることを確認
2. `~/.local/share/opencode/auth.json` が存在することを確認

### 問題2：設定済みのアカウントが見つかりません

**エラーメッセージ**：
```
設定済みのアカウントが見つかりません。
```

**解決方法**：
1. OpenCodeで少なくとも1つのプラットフォーム（OpenAI、Zhipu AIなど）の認証を完了
2. `auth.json` に正しい形式の設定が含まれていることを確認

### 問題3：OpenAI OAuth Token期限切れ

**エラーメッセージ**：
```
⚠️ OAuth認証が期限切れ、OpenCodeでOpenAIモデルを一度使用して認証をリフレッシュしてください。
```

**解決方法**：
1. OpenCodeでOpenAIモデルを一度使用する
2. Tokenが自動的にリフレッシュされる

### 問題4：APIリクエスト失敗（一般）

**エラーメッセージ**：
```
OpenAI APIリクエスト失敗 (401): Unauthorized
```

**解決方法**：
1. TokenまたはAPIキーが有効であることを確認
2. ネットワーク接続を確認
3. 再認証を試みる

### 問題5：リクエストタイムアウト

**エラーメッセージ**：
```
リクエストタイムアウト (10秒）
```

**解決方法**：
1. ネットワーク接続を確認
2. 再試行する

### 問題6：GitHub Copilotクォータクエリが使用不可

**エラーメッセージ**：
```
⚠️ GitHub Copilot クォータクエリが一時的に利用できません。
```

**解決方法**：Fine-grained PATを作成して設定（[Copilot認証設定](../../advanced/copilot-auth/)を参照）

### 問題7：Google Cloudにproject_idがない

**エラーメッセージ**：
```
⚠️ project_idがないため、クォータをクエリできません。
```

**解決方法**：`antigravity-accounts.json` に `projectId` または `managedProjectId` を追加

### 問題8：Zhipu AI / Z.ai APIが無効データを返す

**エラーメッセージ**：
```
Zhipu APIリクエスト失敗 (200): {"code": 401, "msg": "Invalid API key"}
```

**解決方法**：
1. APIキーが正しいことを確認
2. APIキーの権限を確認

## まとめ

mystatusのエラー処理は3層に分かれています：認証ファイル読み取り、プラットフォームクエリ、APIリクエスト。エラーに遭遇したら、まずエラーメッセージのキーワードを確認し、対応する解決策を見つけます。最も一般的な問題には以下が含まれます：

1. **認証ファイルの問題**：`auth.json` の存在と形式を確認
2. **Token期限切れ**：OpenCodeで対応モデルを一度使用してTokenをリフレッシュ
3. **APIエラー**：HTTPステータスコードに基づいて権限問題かサーバー側の問題かを判断
4. **Copilot特殊権限**：新しいOAuth統合ではFine-grained PATを設定する必要がある
5. **Google設定**：クォータをクエリするにはproject_idが必要

大部分のエラーは設定や再認証で解決できます。

## 次のレッスン

> 次のレッスンでは **[セキュリティとプライバシー：ローカルファイルアクセス、APIマスキング、公式インターフェース](/ja/vbgate/opencode-mystatus/faq/security/)** を学びます。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| エラー処理メインロジック | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 41-87 |

</details>
