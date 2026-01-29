---
title: "クイックスタート: 設定ガイド | opencode-supermemory"
sidebarTitle: "クイックスタート"
subtitle: "クイックスタート: インストールと設定"
description: "opencode-supermemory のインストールと設定方法を学びます。API Key 設定からプロジェクト初期化まで、Agent に記憶能力を持たせる手順を解説。"
order: 1
---

# クイックスタート

この章では、opencode-supermemory プラグインをゼロからインストール・設定し、OpenCode Agent に永続的な記憶能力を持たせる方法を学びます。本章を完了すると、Agent はプロジェクトのアーキテクチャとあなたの設定を記憶できるようになります。

## 本章の内容

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">クイックスタート：インストールと設定</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">プラグインのインストール、API Key の設定、プラグインの競合解決を行い、Agent をクラウド記憶ストアに接続します。</p>
</a>

<a href="./initialization/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">プロジェクト初期化：第一印象を確立</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">/supermemory-init コマンドを使用して Agent にコードベースを深くスキャンさせ、プロジェクトのアーキテクチャと規約を自動的に記憶させます。</p>
</a>

</div>

## 学習パス

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. クイックスタート      2. プロジェクト初期化                 │
│   ─────────────   →   ─────────────                             │
│   プラグインのインストール    Agent に記憶させる                 │
│   API Key の設定          プロジェクトのアーキテクチャ             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**推奨学習順序**：

1. **[クイックスタート](./getting-started/)**：まずプラグインのインストールと API Key の設定を完了させます。これはすべての機能を使用する前提です。
2. **[プロジェクト初期化](./initialization/)**：インストール完了後、初期化コマンドを実行して Agent にあなたのプロジェクトを慣れさせます。

## 前提条件

本章の学習を始める前に、以下を確認してください：

- ✅ [OpenCode](https://opencode.ai) がインストール済みで、`opencode` コマンドがターミナルで使用可能であること
- ✅ [Supermemory](https://console.supermemory.ai) アカウントに登録済みで、API Key を取得していること

## 次のステップ

本章を完了したら、以下を続けて学習できます：

- **[コア機能](../core/)**：コンテキスト注入メカニズム、ツールセットの使用、記憶管理について深く学びます
- **[詳細設定](../advanced/)**：圧縮しきい値、キーワードトリガー ルールなどの高度な設定をカスタマイズします
