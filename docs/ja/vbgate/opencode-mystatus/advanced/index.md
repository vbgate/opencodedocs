---
title: "高度な機能: 詳細設定 | opencode-mystatus"
sidebarTitle: "高度な機能"
subtitle: "高度な機能: 詳細設定"
description: "opencode-mystatusの高度な設定オプションを学びます。Google Cloud複数アカウント管理、Copilot認証設定、多言語サポートなどのカスタマイズ機能を紹介します。"
order: 3
---

# 高度な機能

この章では、opencode-mystatusの高度な設定オプションを紹介します。より多くのカスタマイズが必要なユーザーに適しています。

## 機能リスト

### [Google Cloud設定](./google-setup/)

複数のGoogle Cloud Antigravityアカウントを設定・管理します：

- 複数のGoogle Cloudアカウントを追加
- 4つのモデル（G3 Pro、G3 Image、G3 Flash、Claude）のマッピング関係
- projectIdとmanagedProjectIdの違い
- 単一アカウントモデルクォータ不足の問題を解決

### [Copilot認証設定](./copilot-auth/)

GitHub Copilot認証の問題を解決します：

- OAuth TokenとFine-grained PATの違い
- OAuth Token権限不足の問題を解決
- Fine-grained PATを作成してサブスクリプションタイプを設定
- `copilot-quota-token.json` ファイルを設定

### [多言語サポート](./i18n-setup/)

自動言語検出メカニズムを理解します：

- システム言語の自動検出原理
- Intl APIと環境変数のフォールバックメカニズム
- 出力言語の切り替え方法（日本語/英語）

## 適用シナリオ

| シナリオ | 推奨チュートリアル |
|--- | ---|
| 複数のGoogleアカウントを使用 | [Google Cloud設定](./google-setup/) |
| Copilotクォータクエリが失敗 | [Copilot認証設定](./copilot-auth/) |
| 出力言語を切り替えたい | [多言語サポート](./i18n-setup/) |

## 前提条件

この章を学習する前に、以下を完了することをお勧めします：

- [クイックスタート](../start/) - プラグインインストールの完了
- [プラットフォーム機能](../platforms/) - 各プラットフォームの基本用法の理解

## 次のステップ

問題に遭遇しましたか？[よくある質問](../faq/) でヘルプを確認してください。
