---
title: "よくある質問: OAuth 認証とモデルトラブルシューティング | Antigravity Auth"
sidebarTitle: "認証失敗の対処法"
subtitle: "よくある質問: OAuth 認証とモデルトラブルシューティング"
description: "Antigravity Auth プラグインのよくある質問と解決策を理解します。OAuth 認証失敗のトラブルシューティング、モデルが見つからないエラーの処理、プラグイン互換性の設定など、使用中に遭遇する様々な問題を迅速に特定し解決するための実用的なガイドです。"
order: 4
---

# よくある質問

本セクションでは、Antigravity Auth プラグインを使用する際によく遭遇する問題と解決策をまとめています。OAuth 認証の失敗、モデルリクエストのエラー、プラグインの互換性の問題など、それぞれの問題に対応したトラブルシューティングガイドを提供しています。

## 前提条件

::: warning 開始前に確認してください
- ✅ [クイックインストール](/ja/NoeFabris/opencode-antigravity-auth/start/quick-install/) が完了し、アカウント追加に成功していること
- ✅ [初回認証](/ja/NoeFabris/opencode-antigravity-auth/start/first-auth-login/) が完了し、OAuth フローを理解していること
:::

## 学習ルート

遭遇している問題の種類に応じて、適切なトラブルシューティングガイドを選択してください：

### 1. [OAuth 認証失敗のトラブルシューティング](./common-auth-issues/)

OAuth 認証、トークンの更新、アカウント関連の一般的な問題を解決します。

- ブラウザでの認証は成功したが、端末で「認証失敗」と表示される
- 突然「Permission Denied」や「invalid_grant」エラーが発生する
- Safari ブラウザで OAuth コールバックが失敗する
- WSL2/Docker 環境で認証を完了できない

### 2. [アカウントの移行](./migration-guide/)

異なるマシン間でアカウントを移行したり、バージョンアップに対応したりします。

- 古いコンピュータから新しいコンピュータへアカウントを移転する
- 保存形式のバージョン変化（v1/v2/v3）を理解する
- 移行後の invalid_grant エラーを解決する

### 3. [モデルが見つからないトラブルシューティング](./model-not-found/)

モデルが見つからない、400 エラーなどのモデル関連の問題を解決します。

- `Model not found` エラーのトラブルシューティング
- `Invalid JSON payload received. Unknown name "parameters"` 400 エラー
- MCP サーバー呼び出し時のエラー

### 4. [プラグイン互換性](./plugin-compatibility/)

oh-my-opencode、DCP などのプラグインとの互換性の問題を解決します。

- プラグインの読み込み順序を正しく設定する
- oh-my-opencode で競合する認証方式を無効化する
- 並列プロキシシナリオで PID オフセットを有効化する

### 5. [ToS 警告](./tos-warning/)

使用リスクを理解し、アカウントの利用停止を防ぎます。

- Google サービス利用規約の制限を理解する
- 高リスクシナリオ（新規アカウント、集中的なリクエスト）を識別する
- アカウント停止を回避するベストプラクティスを習得する

## 問題の迅速な特定

| エラー現象 | 推奨リソース |
|--- | ---|
| 認証失敗、認証タイムアウト | [OAuth 認証失敗のトラブルシューティング](./common-auth-issues/) |
| invalid_grant、Permission Denied | [OAuth 認証失敗のトラブルシューティング](./common-auth-issues/) |
| モデルが見つからない、400 エラー | [モデルが見つからないトラブルシューティング](./model-not-found/) |
| 他のプラグインとの競合 | [プラグイン互換性](./plugin-compatibility/) |
| 新しい端末への切り替え、バージョンアップ | [アカウントの移行](./migration-guide/) |
| アカウントセキュリティへの懸念 | [ToS 警告](./tos-warning/) |

## 次のステップ

問題を解決した後、以下のアクションが可能です：

- 📖 [高度な機能](/ja/NoeFabris/opencode-antigravity-auth/advanced/) を読んで、マルチアカウントやセッション復元などの機能を深く理解する
- 📚 [付録](/ja/NoeFabris/opencode-antigravity-auth/appendix/) を参照して、アーキテクチャ設計と完全な設定リファレンスを確認する
- 🔄 [更新ログ](/ja/NoeFabris/opencode-antigravity-auth/changelog/) をチェックし、最新の機能と変更を把握する
