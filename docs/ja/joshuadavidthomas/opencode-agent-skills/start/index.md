---
title: "クイックスタート: Agent Skillsの使用 | opencode-agent-skills"
sidebarTitle: "30分で使い始める"
order: 1
subtitle: "クイックスタート"
description: "OpenCode Agent Skills プラグインのクイックスタート方法を学びます。30分以内にインストールと設定を完了し、最初のスキルを作成し、プラグインのコア機能を習得します。"
---

# クイックスタート

この章では、OpenCode Agent Skills プラグインをゼロから使い始める方法を説明します。プラグインのコアバリューを理解し、インストールと設定を完了し、最初のスキルを作成します。

## 本章の内容

<div class="grid-cards">

<a href="./what-is-opencode-agent-skills/" class="card">
  <h3>OpenCode Agent Skills とは？</h3>
  <p>プラグインのコアバリューと機能特性を学びます。動的なスキル発見、コンテキスト注入、圧縮・復元などの仕組みを含みます。</p>
</a>

<a href="./installation/" class="card">
  <h3>インストールガイド</h3>
  <p>プラグインのインストールと動作確認を完了します。基本インストール、固定バージョンインストール、ローカル開発インストールの3つの方法をサポートしています。</p>
</a>

<a href="./creating-your-first-skill/" class="card">
  <h3>最初のスキルを作成する</h3>
  <p>スキルのディレクトリ構造と SKILL.md のフォーマット規約を習得し、シンプルなスキルを作成してテストします。</p>
</a>

</div>

## 学習パス

以下の順序で学習することをお勧めします：

1. **[OpenCode Agent Skills とは？](./what-is-opencode-agent-skills/)** — まずプラグインが何をできるかを理解し、全体像を把握する
2. **[インストールガイド](./installation/)** — プラグインをインストールし、OpenCode にスキル管理機能を追加する
3. **[最初のスキルを作成する](./creating-your-first-skill/)** — 実践的にスキルを作成し、自分専用の最初のスキルを作る

::: tip 予想時間
この章を完了するには約 30-45 分かかります。
:::

## 次のステップ

この章を完了した後、**[プラットフォーム機能](../platforms/)** を続けて学習し、スキル発見の仕組み、スキルロード、自動マッチングなどの高度な機能を深く理解できます。

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
  transition: border-color 0.25s, box-shadow 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
