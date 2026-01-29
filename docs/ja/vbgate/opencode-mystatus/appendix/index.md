---
title: "付録: 技術参考資料 | opencode-mystatus"
sidebarTitle: "付録"
subtitle: "付録: 技術参考資料"
description: "opencode-mystatusの技術参考資料を確認します。データモデル、APIエンドポイント、認証ファイル構造などの詳細情報を提供します。"
order: 5
---

# 付録

この章では、opencode-mystatusの技術参考資料を提供します。開発者と高度なユーザーに適しています。

## 参考資料

### [データモデル](./data-models/)

プラグインのデータ構造を理解します：

- 認証ファイル構造（`auth.json`、`antigravity-accounts.json`、`copilot-quota-token.json`）
- 各プラットフォームAPI応答形式
- 内部データ型定義
- 新しいプラットフォームをサポート拡張する方法

### [APIエンドポイント集計](./api-endpoints/)

プラグインが呼び出すすべての公式APIを確認します：

- OpenAIクォータクエリAPI
- Zhipu AI / Z.aiクォータクエリAPI
- GitHub CopilotクォータクエリAPI
- Google Cloud AntigravityクォータクエリAPI
- 認証方式とリクエスト形式

## 適用シナリオ

| シナリオ | 推奨資料 |
|------|---------|
| プラグインの動作を知りたい | [データモデル](./data-models/) |
| 手動でAPIを呼び出したい | [APIエンドポイント集計](./api-endpoints/) |
| 新しいプラットフォームをサポート拡張したい | 両方の資料が必要 |
| データフォーマットの問題をトラブルシューティングしたい | [データモデル](./data-models/) |

## 関連リンク

- [GitHubリポジトリ](https://github.com/vbgate/opencode-mystatus) - 完全なソースコード
- [NPMパッケージ](https://www.npmjs.com/package/opencode-mystatus) - バージョンと依存関係
- [更新ログ](../changelog/) - バージョン履歴
