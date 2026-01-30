---
title: "高度: スキルエコシステム管理 | opencode-agent-skills"
sidebarTitle: "複雑なスキルエコシステムをマスターする"
subtitle: "高度な機能"
order: 3
description: "opencode-agent-skills の高度な機能を習得。Claude Code 互換性、Superpowers 統合、名前空間とコンテキスト圧縮メカニズムを理解し、スキル管理能力を向上させます。"
tags:
  - "opencode-agent-skills"
  - "高度機能"
  - "Claude Code"
  - "Superpowers"
prerequisite:
  - "[OpenCode Agent Skills のインストール](../start/installation/)"
  - "[最初のスキルを作成する](../start/creating-your-first-skill/)"
  - "[スキル検出メカニズム](../platforms/skill-discovery-mechanism/)"
  - "[スキルをコンテキストに読み込む](../platforms/loading-skills-into-context/)"
---

# 高度な機能

本章では、OpenCode Agent Skills の高度な機能について詳しく解説します。Claude Code 互換性、Superpowers ワークフロー統合、名前空間優先度システム、コンテキスト圧縮復元メカニズムなどを含みます。これらを習得することで、複雑なスキルエコシステムをより効果的に管理し、長時間のセッション中でもスキルが常に利用可能であることを保証できます。

## 前提条件

::: warning 開始前の確認
本章を学習する前に、以下が完了していることを確認してください：

- [OpenCode Agent Skills のインストール](../start/installation/) - プラグインが正しくインストールされ、実行されていること
- [最初のスキルを作成する](../start/creating-your-first-skill/) - スキルの基本構造を理解していること
- [スキル検出メカニズムの詳細](../platforms/skill-discovery-mechanism/) - スキルがどの場所から検出されるかを理解していること
- [スキルをコンテキストに読み込む](../platforms/loading-skills-into-context/) - `use_skill` ツールの使用方法を習得していること
:::

## 本章の内容

<div class="grid-cards">

<a href="./claude-code-compatibility/" class="card">
  <h3>Claude Code スキル互換性</h3>
  <p>プラグインが Claude Code のスキルおよびプラグインシステムとどのように互換性を持つかを理解し、ツールマッピングメカニズムを習得し、Claude のスキルエコシステムを再利用します。</p>
</a>

<a href="./superpowers-integration/" class="card">
  <h3>Superpowers ワークフロー統合</h3>
  <p>Superpowers モードを設定・使用し、厳格なソフトウェア開発ワークフロー指導を得て、開発効率とコード品質を向上させます。</p>
</a>

<a href="./namespaces-and-priority/" class="card">
  <h3>名前空間とスキル優先度</h3>
  <p>スキルの名前空間システムと検出優先度ルールを理解し、同名スキルの競合を解決し、スキルソースを正確に制御します。</p>
</a>

<a href="./context-compaction-resilience/" class="card">
  <h3>コンテキスト圧縮復元メカニズム</h3>
  <p>スキルが長時間のセッション中でどのように可用性を維持するかを理解し、圧縮復元のトリガー条件と実行フローを習得します。</p>
</a>

</div>

## 学習パス

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           推奨学習順序                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Claude Code 互換  ──→  2. Superpowers 統合  ──→  3. 名前空間       │
│         │                        │                        │             │
│         ▼                        ▼                        ▼             │
│   Claude スキルを再利用     ワークフロー指導を有効化    スキルソースを正確に制御 │
│                                                                         │
│                                  │                                      │
│                                  ▼                                      │
│                                                                         │
│                         4. コンテキスト圧縮復元                          │
│                                  │                                      │
│                                  ▼                                      │
│                         長時間セッションでのスキル永続化                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**順序を守って学習することをお勧めします**：

1. **まず Claude Code 互換性** - Claude Code のスキルをお持ちの場合、または Claude プラグインマーケットのスキルを使用したい場合、これが第一歩です
2. **次に Superpowers 統合** - 厳格なワークフロー指導を希望するユーザーは、有効化と設定方法を学びます
3. **その後名前空間** - スキル数が増え、同名の競合が発生した場合、この知識が重要になります
4. **最後に圧縮復元** - 長時間セッション中でスキルがどのように可用性を維持するかを理解します。より原理的な内容です

::: tip 必要に応じて学習
- **Claude Code からの移行**：第 1 課（互換性）と第 3 課（名前空間）に焦点を当ててください
- **ワークフロー規範を希望**：第 2 課（Superpowers）に焦点を当ててください
- **スキル競合に遭遇**：第 3 課（名前空間）を直接参照してください
- **長時間セッションでスキルが失われる**：第 4 課（圧縮復元）を直接参照してください
:::

## 次のステップ

本章を完了したら、以下を続けて学習できます：

- [トラブルシューティング](../faq/troubleshooting/) - 問題が発生した場合は、故障排除ガイドを参照してください
- [セキュリティに関する考慮事項](../faq/security-considerations/) - プラグインのセキュリティメカニズムとベストプラクティスを理解してください
- [API ツールリファレンス](../appendix/api-reference/) - 利用可能なすべてのツールの詳細なパラメータと戻り値を確認してください
- [スキル開発のベストプラクティス](../appendix/best-practices/) - 高品質なスキルを作成するためのテクニックと規範を習得してください

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
