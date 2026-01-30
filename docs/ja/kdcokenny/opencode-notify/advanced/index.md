---
title: "詳細な設定と最適化 | opencode-notifyチュートリアル"
sidebarTitle: "通知体験のカスタマイズ"
subtitle: "詳細な設定と最適化"
description: "opencode-notifyの高度な設定を学習：設定リファレンス、サイレント時間、ターミナル検出、ベストプラクティス。個々のニーズに応じて通知体験を最適化し、生産性を向上させます。"
tags:
  - "高度な設定"
  - "設定"
  - "最適化"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 3
---

# 詳細な設定と最適化

本章ではopencode-notifyの高度な機能を習得し、設定オプションを深く理解し、通知体験を最適化し、個々のニーズに応じて通知動作をカスタマイズする方法を学びます。

## 学習パス

本章の内容は以下の順序で学習することを推奨します：

### 1. [設定リファレンス](./config-reference/)

すべての利用可能な設定オプションとその機能を包括的に理解します。

- 設定ファイルの構造と構文の習得
- 通知音のカスタマイズ方法の学習
- サブセッション通知スイッチの使用シナリオの理解
- ターミナルタイプオーバーライドの設定方法の学習

### 2. [サイレント時間の詳細](./quiet-hours/)

特定の時間に邪魔されないよう、サイレント時間を設定する方法を学びます。

- サイレント時間の開始・終了時間の設定
- 夜間のサイレント時間の処理（例：22:00 - 08:00）
- 必要に応じてサイレント機能を一時的に無効化
- サイレント時間と他のフィルタリングルールの優先順位の理解

### 3. [ターミナル検出の原理](./terminal-detection/)

ターミナルの自動検出メカニズムについて深く理解します。

- プラグインが37+のターミナルエミュレータを識別する方法の学習
- macOSプラットフォームのフォーカス検出実装の理解
- ターミナルタイプを手動で指定する方法の習得
- 検出失敗時のデフォルト動作の理解

### 4. [高度な使用方法](./advanced-usage/)

設定テクニックとベストプラクティスを習得します。

- 通知スパムを回避する設定戦略
- ワークフローに応じた通知動作の調整
- マルチウィンドウ・マルチターミナル環境での設定推奨事項
- パフォーマンス最適化とトラブルシューティングのテクニック

## 前提条件

本章の学習を開始する前に、以下の基礎内容を完了することを推奨します：

- ✅ **クイックスタート**：プラグインのインストールと基本設定の完了
- ✅ **動作原理**：プラグインのコア機能とイベントリスニングメカニズムの理解
- ✅ **プラットフォーム特性**（オプション）：使用しているプラットフォームの特定機能の理解

::: tip 学習のヒント
通知音のカスタマイズやサイレント時間の設定のみを行いたい場合は、直接対応するサブページにジャンプできます。問題が発生した場合は、いつでも設定リファレンスの章を参照してください。
:::

## 次のステップ

本章の学習を完了した後、以下の内容を引き続き探索できます：

- **[トラブルシューティング](../../faq/troubleshooting/)**：一般的な問題と難解な問題の解決
- **[よくある質問](../../faq/common-questions/)**：ユーザーが関心を持つホットトピックの理解
- **[イベントタイプの説明](../../appendix/event-types/)**：プラグインがリッスンするすべてのイベントタイプの深い学習
- **[設定ファイルの例](../../appendix/config-file-example/)**：完全な設定例とコメントの確認

---

<details>
<summary><strong>ソースコードの場所を表示</strong></summary>

> 最終更新：2026-01-27

| 機能 | ファイルパス | 行番号 |
|---|---|---|
| 設定インターフェース定義 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| デフォルト設定 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| 設定の読み込み | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| サイレント時間のチェック | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| ターミナル検出 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| ターミナルプロセス名マッピング | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |

**重要なインターフェース**：
- `NotifyConfig`：設定インターフェース、すべての設定項目を含む
- `quietHours`：サイレント時間設定（enabled/start/end）
- `sounds`：サウンド設定（idle/error/permission）
- `terminal`：ターミナルタイプのオーバーライド（オプション）

**重要な定数**：
- `DEFAULT_CONFIG`：すべての設定項目のデフォルト値
- `TERMINAL_PROCESS_NAMES`：ターミナル名からmacOSプロセス名へのマッピングテーブル

</details>
