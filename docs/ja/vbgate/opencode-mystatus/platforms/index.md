---
title: "プラットフォーム対応: クォータ照会 | opencode-mystatus"
sidebarTitle: "プラットフォーム機能"
subtitle: "プラットフォーム対応: クォータ照会"
description: "opencode-mystatusがサポートする4つのAIプラットフォームを学びます。OpenAI、Zhipu AI、GitHub Copilot、Google Cloudのクォータ照会に対応。"
order: 2
---

# プラットフォーム機能

この章では、opencode-mystatusがサポートする各AIプラットフォームのクォータクエリ機能を詳しく紹介します。

## サポートされるプラットフォーム

opencode-mystatusは以下の4つの主流AIプラットフォームをサポートしています：

| プラットフォーム | クォータタイプ | 特徴 |
|------|---------|------|
| OpenAI | 3時間 / 24時間スライディングウィンドウ | Plus、Team、Proサブスクリプションをサポート |
| Zhipu AI | 5時間 Token / MCP 月次クォータ | Coding Planをサポート |
| GitHub Copilot | 月次クォータ | Premium Requests使用量を表示 |
| Google Cloud | モデル別計算 | 複数アカウント、4つのモデルをサポート |

## プラットフォームの詳解

### [OpenAI クォータ](./openai-usage/)

OpenAIのクォータクエリメカニズムを深く理解します：

- 3時間と24時間スライディングウィンドウの違い
- チームアカウントのクォータ共有メカニズム
- JWT Token解析でアカウント情報を取得

### [Zhipu AI クォータ](./zhipu-usage/)

Zhipu AIとZ.aiのクォータクエリを理解します：

- 5時間Tokenクォータの計算方式
- MCP月次クォータの用途
- APIキーマスキング表示

### [GitHub Copilot クォータ](./copilot-usage/)

GitHub Copilotのクォータ管理をマスターします：

- Premium Requestsの意味
- 異なるサブスクリプションタイプのクォータ差異
- 月次リセット時間の計算

### [Google Cloud クォータ](./google-usage/)

Google Cloud複数アカウントのクォータクエリを学びます：

- 4つのモデル（G3 Pro、G3 Image、G3 Flash、Claude）の違い
- 複数アカウント管理と切り替え
- 認証ファイル読み取りメカニズム

## 選択ガイド

使用しているプラットフォームに応じて、対応するチュートリアルを選択してください：

- **OpenAIのみを使用**：直接 [OpenAI クォータ](./openai-usage/) を見る
- **Zhipu AIのみを使用**：直接 [Zhipu AI クォータ](./zhipu-usage/) を見る
- **マルチプラットフォームユーザー**：すべてのプラットフォームチュートリアルを順に読むことをお勧め
- **Google Cloudユーザー**：先に [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) プラグインをインストールする必要があります

## 次のステップ

この章を完了したら、[高度な機能](../advanced/)を続けて学び、より多くの設定オプションを理解できます。
