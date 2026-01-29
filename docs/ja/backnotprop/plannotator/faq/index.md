---
title: "よくある質問: トラブルシューティング | opencode-plannotator"
sidebarTitle: "問題が発生したら"
subtitle: "よくある質問: トラブルシューティング"
description: "Plannotatorのよくある質問の解決方法を学びます。ポート競合、ブラウザが開かない、連携失敗などの問題を素早く解決するテクニックを習得します。"
order: 4
---

# よくある質問

この章では、Plannotatorの使用中に発生するさまざまな問題の解決をサポートします。ポート競合、ブラウザが開かない、連携失敗など、あらゆる問題に対応する解決策とデバッグテクニックを紹介します。

## この章の内容

<div class="grid-cards">

<a href="./common-problems/" class="card">
  <h3>🔧 よくある問題</h3>
  <p>使用中に発生するよくある問題を解決します。ポート競合、ブラウザが開かない、プランが表示されない、Gitエラー、画像アップロード失敗、Obsidian/Bear連携の問題などを含みます。</p>
</a>

<a href="./troubleshooting/" class="card">
  <h3>🔍 トラブルシューティング</h3>
  <p>トラブルシューティングの基本的な方法を習得します。ログの確認、エラー処理、デバッグテクニックを学び、ログ出力から問題の原因を素早く特定できるようになります。</p>
</a>

</div>

## 学習パス

```
よくある問題 → トラブルシューティング
    ↓              ↓
 素早く解決     詳細なデバッグ
```

**推奨順序**：

1. **まずよくある問題を確認**：ほとんどの問題はここで既存の解決策が見つかります
2. **次にトラブルシューティングを学習**：よくある問題でカバーされていない場合、ログとデバッグテクニックを使って自分で調査する方法を学びます

::: tip 問題が発生したときのアドバイス
まず「よくある問題」でキーワード（「ポート」「ブラウザ」「Obsidian」など）を検索し、対応する解決策を見つけてください。問題が複雑な場合やリストにない場合は、「トラブルシューティング」を参照してデバッグ方法を学びましょう。
:::

## 前提条件

この章を学習する前に、以下を完了していることを推奨します：

- ✅ [クイックスタート](../start/getting-started/) - Plannotatorの基本概念を理解
- ✅ Claude CodeまたはOpenCodeプラグインのインストール（いずれか一方）：
  - [Claude Codeプラグインのインストール](../start/installation-claude-code/)
  - [OpenCodeプラグインのインストール](../start/installation-opencode/)

## 次のステップ

この章を完了したら、以下の学習に進めます：

- [APIリファレンス](../appendix/api-reference/) - すべてのAPIエンドポイントとリクエスト/レスポンス形式を理解
- [データモデル](../appendix/data-models/) - Plannotatorで使用されるデータ構造を理解
- [環境変数の設定](../advanced/environment-variables/) - 利用可能なすべての環境変数を詳しく理解

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dark .grid-cards .card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
