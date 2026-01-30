---
title: "クイックスタート: インストールと設定 | opencode-dynamic-context-pruning"
sidebarTitle: "5分で起動"
subtitle: "クイックスタート: インストールと設定"
description: "OpenCode DCP プラグインのインストールと設定方法を学びます。5分でプラグインをインストールし、Token 節約効果を体験し、3段階の設定システムを習得します。"
order: 1
---

# クイックスタート

この章では、DCP プラグインをゼロから使い始める方法を説明します。プラグインのインストール、効果の検証、そして必要に応じたカスタム設定の方法を学びます。

## 本章の内容

<div class="vp-card-container">

<a href="./getting-started/" class="vp-card">
<h3>インストールとクイックスタート</h3>
<p>5分で DCP プラグインをインストールし、すぐに Token 節約効果を実感します。/dcp コマンドを使用してトリミング統計を監視する方法を学びます。</p>
</a>

<a href="./configuration/" class="vp-card">
<h3>設定の完全ガイド</h3>
<p>3段階の設定システム（グローバル、環境変数、プロジェクトレベル）を習得し、設定の優先順位を理解し、必要に応じてトリミング戦略と保護メカニズムを調整します。</p>
</a>

</div>

## 学習パス

```
インストールとクイックスタート → 設定の完全ガイド
↓                              ↓
プラグインが動作する          調整方法がわかる
```

**推奨順序**：

1. **まず [インストールとクイックスタート](./getting-started/) を完了する**：プラグインが正常に動作することを確認し、デフォルトのトリミング効果を体験する
2. **次に [設定の完全ガイド](./configuration/) を学ぶ**：プロジェクトの要件に応じてトリミング戦略をカスタマイズする

::: tip 初心者向けアドバイス
DCP を初めて使用する場合は、デフォルト設定でしばらく実行し、トリミング効果を観察してから設定を調整することをお勧めします。
:::

## 前提条件

この章の学習を開始する前に、以下を確認してください：

- [x] **OpenCode** がインストールされている（プラグイン機能をサポートするバージョン）
- [x] 基本的な **JSONC 構文** を理解している（コメント付き JSON）
- [x] **OpenCode 設定ファイル** の編集方法を知っている

## 次のステップ

この章を完了したら、以下の内容を続けて学習できます：

- **[自動トリミング戦略の詳細](../platforms/auto-pruning/)**：重複排除、上書き、エラークリアの3つの戦略の仕組みを深く理解する
- **[LLM 駆動トリミングツール](../platforms/llm-tools/)**：AI が discard および extract ツールを呼び出してコンテキストを最適化する方法を学ぶ
- **[Slash コマンドの使用](../platforms/commands/)**：/dcp context、/dcp stats、/dcp sweep などのコマンドの使い方を習得する

<style>
.vp-card-container {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 16px;
margin: 16px 0;
}

.vp-card {
display: block;
padding: 20px;
border: 1px solid var(--vp-c-divider);
border-radius: 8px;
text-decoration: none;
transition: border-color 0.25s, box-shadow 0.25s;
}

.vp-card:hover {
border-color: var(--vp-c-brand-1);
box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vp-card h3 {
margin: 0 0 8px 0;
font-size: 16px;
font-weight: 600;
color: var(--vp-c-text-1);
}

.vp-card p {
margin: 0;
font-size: 14px;
color: var(--vp-c-text-2);
line-height: 1.5;
}
</style>
