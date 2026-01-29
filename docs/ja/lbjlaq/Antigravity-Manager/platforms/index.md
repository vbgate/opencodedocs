---
title: "プラットフォーム統合: 複数のプロトコル接続 | Antigravity-Manager"
sidebarTitle: "あなたの AI プラットフォームを接続"
subtitle: "プラットフォーム統合: 複数のプロトコル接続"
description: "Antigravity Tools のプラットフォームプロトコル接続方法を学習します。OpenAI、Anthropic、Gemini など7種類のプロトコルの統一 API ゲートウェイ変換をサポートします。"
order: 200
---

# プラットフォームと統合

Antigravity Tools のコア能力は、複数の AI プラットフォームのプロトコルを統一されたローカル API ゲートウェイに変換することです。この章では各プロトコルの接続方法、互換性の境界、ベストプラクティスを詳細に紹介します。

## この章が含むもの

| チュートリアル | 説明 |
|--- | ---|
| [OpenAI 互換 API](./openai/) | `/v1/chat/completions` と `/v1/responses` の実装戦略、OpenAI SDK を無意識に接続可能にする |
| [Anthropic 互換 API](./anthropic/) | `/v1/messages` と Claude Code の重要な契約、思考連鎖、システムプロンプトなどのコア能力をサポート |
| [Gemini ネイティブ API](./gemini/) | `/v1beta/models` および Google SDK エンドポイント接続、`x-goog-api-key` 互換をサポート |
| [Imagen 3 画像生成](./imagen/) | OpenAI Images パラメータ `size`/`quality` の自動マッピング、任意のアスペクト比をサポート |
| [音声認識](./audio/) | `/v1/audio/transcriptions` の制限と大きなペイロードの処理 |
| [MCP エンドポイント](./mcp/) | Web Search/Reader/Vision を呼び出し可能なツールとして公開する |
| [Cloudflared トンネル](./cloudflared/) | ローカル API を安全にパブリックに暴露（デフォルトでは安全ではない） |

## 学習パスの推奨

::: tip 推奨順序
1. **まず使用するプロトコルを学ぶ**：Claude Code を使用している場合、まず [Anthropic 互換 API](./anthropic/) を見る；OpenAI SDK を使用している場合、まず [OpenAI 互換 API](./openai/) を見る
2. **その後 Gemini ネイティブを学ぶ**：Google SDK の直接接続方法を理解する
3. **必要に応じて拡張機能を学ぶ**：画像生成、音声認識、MCP ツール
4. **最後にトンネルを学ぶ**：パブリック暴露が必要な場合 [Cloudflared トンネル](./cloudflared/) を見る
:::

**クイック選択**：

| あなたのシーン | 推奨先に見る |
|--- | ---|
| Claude Code CLI を使用 | [Anthropic 互換 API](./anthropic/) |
| OpenAI Python SDK を使用 | [OpenAI 互換 API](./openai/) |
| Google 公式 SDK を使用 | [Gemini ネイティブ API](./gemini/) |
| AI 画像描画が必要 | [Imagen 3 画像生成](./imagen/) |
| 音声文字起こしが必要 | [音声認識](./audio/) |
| インターネット検索/Web 閲覧が必要 | [MCP エンドポイント](./mcp/) |
| リモートアクセスが必要 | [Cloudflared トンネル](./cloudflared/) |

## 前提条件

::: warning 始める前に確認してください
- [インストールとアップグレード](../start/installation/) を完了済み
- [アカウント追加](../start/add-account/) を完了済み
- [ローカルリバースプロキシ起動](../start/proxy-and-first-client/) を完了済み（少なくとも `/healthz` にアクセス可能）
:::

## 次のステップ

この章を学習した後、次の学習を続けることができます：

- [高度な設定](../advanced/)：モデルルーティング、クォータガバナンス、高可用性スケジューリングなどの高度な機能
- [よくある質問](../faq/)：401/404/429 などのエラーが発生したときのトラブルシューティングガイド
