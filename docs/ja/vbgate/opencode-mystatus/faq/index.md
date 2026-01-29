---
title: "FAQ: トラブル解決 | opencode-mystatus"
sidebarTitle: "よくある質問"
subtitle: "FAQ: トラブル解決"
description: "opencode-mystatusのよくある質問と解決策を確認します。認証エラー、Token期限切れ、APIリクエスト失敗などの問題を素早く解決できます。"
order: 4
---

# よくある質問

この章では、opencode-mystatusを使用する際のよくある質問と解決策を収集しています。

## 質問分類

### [トラブルシューティング](./troubleshooting/)

様々なクエリ失敗の問題を解決します：

- 認証ファイルを読み取れない
- Token期限切れまたは権限不足
- APIリクエスト失敗またはタイムアウト
- 各プラットフォーム固有のエラー処理

### [セキュリティとプライバシー](./security/)

プラグインのセキュリティメカニズムを理解します：

- ローカルファイルの読み取りのみ
- APIキーの自動マスキング
- 公式APIのみ呼び出し
- データのアップロードや保存なし

## クイック検索

エラーメッセージに基づいて解決策を素早く見つけます：

| エラーキーワード | 可能な原因 | 解決策 |
|--- | --- | ---|
| `auth.json not found` | 認証ファイルが存在しない | [トラブルシューティング](./troubleshooting/) |
| `Token expired` | Tokenが期限切れ | [トラブルシューティング](./troubleshooting/) |
| `Permission denied` | 権限不足 | [Copilot認証設定](../advanced/copilot-auth/) |
| `project_id missing` | Google Cloud設定不完全 | [Google Cloud設定](../advanced/google-setup/) |
| `Request timeout` | ネットワーク問題 | [トラブルシューティング](./troubleshooting/) |

## ヘルプを得る

この章で問題が解決しない場合：

- [Issue](https://github.com/vbgate/opencode-mystatus/issues) を送信 - バグ報告または新機能リクエスト
- [GitHubリポジトリ](https://github.com/vbgate/opencode-mystatus) を確認 - 最新バージョンとソースコード
