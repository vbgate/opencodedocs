---
title: "プラットフォーム機能: モデルとクォータ | opencode-antigravity-auth"
sidebarTitle: "デュアルクォータシステムの活用"
subtitle: "プラットフォーム機能: モデルとクォータ"
description: "Antigravity Auth のモデルタイプとデュアルクォータシステムについて学習します。モデル選択、Thinking 設定、Google Search の方法を習得し、クォータを最適化して活用します。"
order: 2
---

# プラットフォーム機能

この章では、Antigravity Auth プラグインがサポートするモデル、クォータシステム、プラットフォーム機能について詳しく説明します。適切なモデルを選択する方法、Thinking 能力の設定、Google Search の有効化、およびクォータ利用率の最大化を学びます。

## 前提条件

::: warning 開始前の確認
この章を学習する前に、以下が完了していることを確認してください：
- [クイックインストール](../start/quick-install/)：プラグインのインストールと初回認証を完了する
- [最初のリクエスト](../start/first-request/)：最初のモデルリクエストを正常に送信する
:::

## 学習パス

以下の順序で学習してください。プラットフォーム機能を段階的に習得できます：

### 1. [利用可能なモデル](./available-models/)

利用可能なモデルとそのバリアント設定について学びます。

- Claude Opus 4.5、Sonnet 4.5、Gemini 3 Pro/Flash の種類と特徴
- Antigravity および Gemini CLI クォータプールのモデル分布
- バリアント選択とモデルの最適活用方法
- `--variant` パラメータの活用法

### 2. [デュアルクォータシステム](./dual-quota-system/)

Antigravity と Gemini CLI のデュアルクォータプールの仕組みを理解します。

- 各アカウントが持つ独立した Gemini クォータプールの仕組み
- 自動 fallback 設定によるクォータ効率的利用
- 特定モデルのクォータプール明示的選択

### 3. [Google Search Grounding](./google-search-grounding/)

Gemini モデルで Google Search を有効にし、事実確認精度を向上させます。

- Gemini によるリアルタイム Web 検索機能
- 検索の適用頻度と範囲の微細調整
- タスク固有の最適な検索戦略選択

### 4. [Thinking モデル](./thinking-models/)

Claude と Gemini 3 Thinking モデルの高度な設定方法を習得します。

- Claude の思考予算戦略的設定
- Gemini 3 の思考レベル（minimal/low/medium/high）適切選択
- インターリーブ思考プロセスの精密管理

## 次のステップ

この章の学習を終えた後、以下の進化的学習パスで理解を深化できます：

- [複数アカウント設定](../advanced/multi-account-setup/)：複数の Google アカウントを設定し、クォータプール化と負荷分散を実現
- [アカウント選択戦略](../advanced/account-selection-strategies/)：sticky、round-robin、hybrid の 3 つの戦略のベストプラクティスを習得
- [設定ガイド](../advanced/configuration-guide/)：すべての設定オプションを習得し、ニーズに合わせてプラグインの動作をカスタマイズ
