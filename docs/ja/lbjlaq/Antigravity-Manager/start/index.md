---
title: "クイックスタート: Antigravity Tools をゼロから使用 | Antigravity-Manager"
sidebarTitle: "ゼロから始める"
subtitle: "クイックスタート: Antigravity Tools をゼロから使用"
description: "Antigravity Tools の完全な導入手順を学びます。インストールと設定から初回 API 呼び出しまで、ローカルゲートウェイのコア使用方法を迅速にマスターします。"
order: 1
---

# クイックスタート

この章では、Antigravity Tools をゼロから使用し、インストールから初回の API 呼び出し成功までの完全なプロセスを完了します。コア概念、アカウント管理、データバックアップ、および AI クライアントをローカルゲートウェイに接続する方法を学びます。

## 本章の内容

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Antigravity Tools とは</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">正しいメンタルモデルを確立：ローカルゲートウェイ、プロトコル互換、アカウントプールスケジューリングのコア概念と使用境界。</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">インストールとアップグレード</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">デスクトップ版最適インストールパス（brew / releases）、および一般的なシステムブロックの処理方法。</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">初回起動必須</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">データディレクトリ、ログ、トレイと自動起動、誤削除と不可逆的な損失を回避。</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">アカウント追加</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">OAuth/Refresh Token デュアルチャンネルとベストプラクティス、最も安定した方法でアカウントプールを構築。</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">アカウントバックアップと移行</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">インポート/エクスポート、V1/DB ホットマイグレーション、複数マシン再利用とサーバーデプロイシナリオをサポート。</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">リバースプロキシを起動しクライアントを接続</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">サービス起動から外部クライアント成功呼び出しまで、1 回でクローズド検証を完了。</p>
</a>

</div>

## 学習パス

::: tip 推奨順序
以下の順序で学習すると、最も迅速に Antigravity Tools を始められます：
:::

```
1. 概念理解        →  2. ソフトウェアインストール        →  3. データディレクトリを理解
   getting-started      installation          first-run-data
        ↓                    ↓                      ↓
4. アカウント追加        →  5. アカウントバックアップ        →  6. リバースプロキシ起動
   add-account          backup-migrate        proxy-and-first-client
```

| ステップ | コース | 予想時間 | 学びます |
|--- | --- | --- | ---|
| 1 | [概念理解](./getting-started/) | 5 分 | ローカルゲートウェイとは、なぜアカウントプールが必要か |
| 2 | [ソフトウェアインストール](./installation/) | 3 分 | brew インストールまたは手動ダウンロード、システムブロックの処理 |
| 3 | [データディレクトリを理解](./first-run-data/) | 5 分 | データがどこにあるか、ログの見方、トレイ操作 |
| 4 | [アカウント追加](./add-account/) | 10 分 | OAuth 認証または手動で Refresh Token を入力 |
| 5 | [アカウントバックアップ](./backup-migrate/) | 5 分 | アカウントエクスポート、クロスデバイス移行 |
| 6 | [リバースプロキシ起動](./proxy-and-first-client/) | 10 分 | サービス起動、クライアント設定、呼び出し検証 |

**最小利用可能パス**：急いでいる場合、1 → 2 → 4 → 6 のみを完了し、約 25 分で使用を開始できます。

## 次のステップ

この章を完了すると、Antigravity Tools を正常に使用できます。次に必要に応じて深く学習できます：

- **[プラットフォームと統合](../platforms/)**：OpenAI、Anthropic、Gemini など、異なるプロトコルの接続詳細を理解
- **[高度な設定](../advanced/)**：モデルルーティング、クォータ保護、高可用性スケジューリングなどの高度な機能
- **[よくある質問](../faq/)**：401、429、404 などのエラーに遭遇した場合のトラブルシューティングガイド
