---
title: "必須プラグインのインストール：superpowers と ui-ux-pro-max | AI App Factory チュートリアル"
sidebarTitle: "5分でプラグインをインストール"
subtitle: "必須プラグインのインストール：superpowers と ui-ux-pro-max | AI App Factory チュートリアル"
description: "AI App Factory の 2 つの必須プラグイン（superpowers：ブレインストーミング用、ui-ux-pro-max：UIデザインシステム用）のインストールと検証方法を学びます。自動インストール、手動インストール、検証方法、トラブルシューティングをカバーし、パイプラインをスムーズに実行して高品質で動作するアプリを生成できるようにします。"
tags:
  - "プラグインインストール"
  - "Claude Code"
  - "superpowers"
  - "ui-ux-pro-max"
prerequisite:
  - "/ja/hyz1992/agent-app-factory/start/installation/"
  - "/ja/hyz1992/agent-app-factory/start/init-project/"
  - "/ja/hyz1992/agent-app-factory/platforms/claude-code/"
order: 70
---

# 必須プラグインのインストール：superpowers と ui-ux-pro-max | AI App Factory チュートリアル

## 学習目標

- superpowers と ui-ux-pro-max プラグインがインストールされているか確認する
- 2 つの必須プラグインを手動でインストールする（自動インストールが失敗した場合）
- プラグインが正しく有効になっているか検証する
- なぜこの 2 つのプラグインがパイプライン実行の前提条件なのか理解する
- プラグインインストール失敗の一般的な問題をトラブルシューティングする

## 現在の課題

Factory パイプラインを実行すると、以下の問題に直面することがあります：

- **Bootstrap フェーズで失敗**：「superpowers:brainstorm スキルが使用されていません」というエラー
- **UI フェーズで失敗**：「ui-ux-pro-max スキルが使用されていません」というエラー
- **自動インストール失敗**：`factory init` 時にプラグインインストールでエラーが発生
- **プラグインの競合**：同名のプラグインが既に存在するが、バージョンが正しくない
- **権限の問題**：プラグインがインストールされているが正しく有効になっていない

実は、Factory は初期化時に**自動的にこの 2 つのプラグインをインストールしようとしますが**、失敗した場合は手動で対応する必要があります。

## いつこの手順を使うべきか

以下の状況の場合は、手動でプラグインをインストールする必要があります：

- `factory init` 時にプラグインインストール失敗のメッセージが表示される
- Bootstrap または UI フェーズで必須スキルが使用されていないと検出される
- 初めて Factory を使用し、パイプラインが正常に動作することを確認したい
- プラグインのバージョンが古すぎて、再インストールが必要

## なぜこの 2 つのプラグインが必要なのか

Factory のパイプラインは 2 つの重要な Claude Code プラグインに依存しています：

| プラグイン | 用途 | パイプラインフェーズ | 提供するスキル |
| --- | --- | --- | --- |
| **superpowers** | プロダクトアイデアを深く掘り下げる | Bootstrap | `superpowers:brainstorm` - 問題、ユーザー、価値、仮定を体系的に分析するブレインストーミング |
| **ui-ux-pro-max** | プロフェッショナルなデザインシステムを生成 | UI | `ui-ux-pro-max` - 67 種類のスタイル、96 種類のカラーパレット、100 の業界ルール |

::: warning 必須要件
`agents/orchestrator.checkpoint.md` の定義によると、これら 2 つのプラグインは**必須要件**です：
- **Bootstrap フェーズ**：`superpowers:brainstorm` スキルを使用しない場合、成果物を拒否します
- **UI フェーズ**：`ui-ux-pro-max` スキルを使用しない場合、成果物を拒否します

:::

## 🎒 開始前の準備

開始する前に、以下を確認してください：

- [ ] Claude CLI がインストールされている（`claude --version` が使用可能）
- [ ] `factory init` でプロジェクトの初期化が完了している
- [ ] Claude Code の権限が設定されている（[Claude Code インテグレーションガイド](../claude-code/)を参照）
- [ ] ネットワーク接続が正常（GitHub プラグインマーケットプレイスにアクセスする必要あり）

## 核心アプローチ

プラグインインストールは**チェック→マーケットプレイス追加→インストール→検証**の 4 ステップで行われます：

1. **チェック**：プラグインが既にインストールされているか確認
2. **マーケットプレイス追加**：プラグインリポジトリを Claude Code プラグインマーケットプレイスに追加
3. **インストール**：インストールコマンドを実行
4. **検証**：プラグインが有効になっているか確認

Factory の自動インストールスクリプト（`cli/scripts/check-and-install-*.js`）はこれらのステップを自動的に実行しますが、失敗した場合の手動方法を理解しておく必要があります。

## 実践手順

### ステップ 1：プラグインのステータスを確認する

**なぜ**
既にインストールされているかを最初に確認し、重複操作を避けるため。

ターミナルを開き、プロジェクトのルートディレクトリで実行：

```bash
claude plugin list
```

**期待される出力**：インストール済みプラグインのリストが表示されます。以下が含まれている場合、インストール済みです：

```
✅ superpowers (enabled)
✅ ui-ux-pro-max (enabled)
```

この 2 つのプラグインが表示されない場合、または `disabled` と表示される場合は、以下のステップを続けてください。

::: info factory init の自動インストール
`factory init` コマンドはプラグインインストールのチェックを自動的に実行します（`init.js` の 360-392 行目）。成功すると、以下が表示されます：

```
📦 Installing superpowers plugin... ✓
📦 Installing ui-ux-pro-max-skill plugin... ✓
✅ Plugins installed!
```
:::

### ステップ 2：superpowers プラグインをインストールする

**なぜ**
Bootstrap フェーズでは、`superpowers:brainstorm` スキルを使用してブレインストーミングを行う必要があるため。

#### マーケットプレイスに追加

```bash
claude plugin marketplace add obra/superpowers-marketplace
```

**期待される出力**：

```
✅ Plugin marketplace added successfully
```

::: tip マーケットプレイス追加の失敗
「プラグインマーケットプレイスは既に存在します」というメッセージが表示される場合、無視してインストールステップを続けてください。
:::

#### プラグインをインストール

```bash
claude plugin install superpowers@superpowers-marketplace
```

**期待される出力**：

```
✅ Plugin installed successfully
```

#### インストールの検証

```bash
claude plugin list
```

**期待される出力**：リストに `superpowers (enabled)` が含まれていること。

### ステップ 3：ui-ux-pro-max プラグインをインストールする

**なぜ**
UI フェーズでは、`ui-ux-pro-max` スキルを使用してデザインシステムを生成する必要があるため。

#### マーケットプレイスに追加

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

**期待される出力**：

```
✅ Plugin marketplace added successfully
```

#### プラグインをインストール

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**期待される出力**：

```
✅ Plugin installed successfully
```

#### インストールの検証

```bash
claude plugin list
```

**期待される出力**：リストに `ui-ux-pro-max (enabled)` が含まれていること。

### ステップ 4：両方のプラグインが正常に動作しているか確認する

**なぜ**
パイプラインがこれら 2 つのプラグインのスキルを正常に呼び出せることを確認するため。

#### superpowers の検証

Claude Code で以下を実行：

```
superpowers:brainstorm スキルを使って以下のプロダクトアイデアを分析してください：[あなたのアイデア]
```

**期待される出力**：Claude が brainstorm スキルを使用して、問題、ユーザー、価値、仮定を体系的に分析し始めます。

#### ui-ux-pro-max の検証

Claude Code で以下を実行：

```
ui-ux-pro-max スキルを使って、私のアプリ用のカラーパレットを設計してください
```

**期待される出力**：Claude が複数のデザインオプションを含むプロフェッショナルな配色提案を返します。

## チェックポイント ✅

上記のステップが完了したら、以下を確認してください：

- [ ] `claude plugin list` を実行すると、両方のプラグインが `enabled` とマークされている
- [ ] Claude Code で `superpowers:brainstorm` スキルを呼び出せる
- [ ] Claude Code で `ui-ux-pro-max` スキルを呼び出せる
- [ ] `factory run` を実行してもプラグインが不足しているというメッセージが表示されない

## トラブルシューティング

### ❌ プラグインはインストール済みだが有効になっていない

**現象**：`claude plugin list` にプラグインが表示されるが、`enabled` マークがない。

**解決方法**：インストールコマンドを再実行：

```bash
claude plugin install <プラグイン ID>
```

### ❌ 権限がブロックされている

**現象**：「Permission denied: Skill(superpowers:brainstorming)」というエラーが表示される。

**原因**：Claude Code の権限設定に `Skill` 権限が含まれていない。

**解決方法**：`.claude/settings.local.json` に以下が含まれているか確認：

```json
{
  "permissions": [
    "Skill(superpowers:brainstorming)",
    "Skill(ui-ux-pro-max)"
  ]
}
```

::: info 完全な権限設定
これは最小限の権限設定例です。Factory の `init` コマンドは完全な権限設定ファイル（`Skill(superpowers:brainstorm)` やその他の必要な権限を含む）を自動的に生成するため、通常は手動で編集する必要はありません。

権限設定を再生成する必要がある場合は、プロジェクトのルートディレクトリで以下を実行：
```bash
factory init --force-permissions
```
:::

[Claude Code インテグレーションガイド](../claude-code/)を参照して権限設定を再生成してください。

### ❌ マーケットプレイス追加の失敗

**現象**：`claude plugin marketplace add` が失敗し、「not found」またはネットワークエラーが表示される。

**解決方法**：

1. ネットワーク接続を確認
2. Claude CLI が最新バージョンか確認：`npm update -g @anthropic-ai/claude-code`
3. 直接インストールを試行：マーケットプレイス追加をスキップし、直接 `claude plugin install <プラグイン ID>` を実行

### ❌ プラグインバージョンの競合

**現象**：同名のプラグインがインストール済みだが、バージョンが正しくないためパイプラインが失敗する。

**解決方法**：

```bash
# 旧バージョンをアンインストール
claude plugin uninstall <プラグイン名>

# 再インストール
claude plugin install <プラグイン ID>
```

### ❌ Windows のパス問題

**現象**：Windows でスクリプトを実行すると「コマンドが見つかりません」というエラーが表示される。

**解決方法**：

Node.js を使用してインストールスクリプトを直接実行：

```bash
node cli/scripts/check-and-install-superpowers.js
node cli/scripts/check-and-install-ui-skill.js
```

## 自動インストール失敗時の対処

`factory init` 時の自動インストールが失敗した場合、以下の対処が可能です：

1. **エラーメッセージを確認**：ターミナルに具体的な失敗原因が表示されます
2. **手動インストール**：上記の手順に従って 2 つのプラグインを手動でインストール
3. **再実行**：`factory run` はプラグインのステータスを確認し、インストール済みの場合はパイプラインを継続します

::: warning パイプライン起動への影響なし
プラグインインストールが失敗しても、`factory init` は初期化を完了します。後で手動でプラグインをインストールしても、その後の操作には影響しません。
:::

## パイプラインでのプラグインの役割

### Bootstrap フェーズ（superpowers が必須）

- **スキル呼び出し**：`superpowers:brainstorm`
- **出力**：`input/idea.md` - 構造化されたプロダクトアイデアドキュメント
- **検証ポイント**：Agent がそのスキルを使用したことを明示的に説明しているか確認（`orchestrator.checkpoint.md:60-70`）

### UI フェーズ（ui-ux-pro-max が必須）

- **スキル呼び出し**：`ui-ux-pro-max`
- **出力**：`artifacts/ui/ui.schema.yaml` - デザインシステムを含む UI Schema
- **検証ポイント**：デザインシステムの設定がそのスキルからのものであるか確認（`orchestrator.checkpoint.md:72-84`）

## まとめ

- Factory は 2 つの必須プラグインに依存：`superpowers` と `ui-ux-pro-max`
- `factory init` は自動的にインストールを試みますが、失敗した場合は手動で対応が必要
- プラグインインストールのフロー：チェック→マーケットプレイス追加→インストール→検証
- 両方のプラグインが `enabled` 状態であり、権限設定が正しいことを確認
- パイプラインの Bootstrap と UI フェーズはこれら 2 つのプラグインの使用状況を強制的にチェック

## 次のレッスンの予告

> 次のレッスンでは、**[7 フェーズパイプラインの概要](../../start/pipeline-overview/)** を学びます。
>
> 学べること：
> - パイプラインの完全な実行フロー
> - 各フェーズの入出力と責務
> - 品質を保証するチェックポイントメカニズム
> - 失敗したフェーズから回復する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-29

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Superpowers プラグインチェックスクリプト | [`cli/scripts/check-and-install-superpowers.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-superpowers.js) | 1-208 |
| UI/UX Pro Max プラグインチェックスクリプト | [`cli/scripts/check-and-install-ui-skill.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-ui-skill.js) | 1-209 |
| 自動プラグインインストールロジック | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 360-392 |
| Bootstrap フェーズスキル検証 | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 60-70 |
| UI フェーズスキル検証 | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 72-84 |

**重要な定数**：
- `PLUGIN_NAME = 'superpowers'`：superpowers プラグイン名
- `PLUGIN_ID = 'superpowers@superpowers-marketplace'`：superpowers 完全 ID
- `PLUGIN_MARKETPLACE = 'obra/superpowers-marketplace'`：プラグインマーケットプレイスリポジトリ
- `UI_PLUGIN_NAME = 'ui-ux-pro-max'`：UI プラグイン名
- `UI_PLUGIN_ID = 'ui-ux-pro-max@ui-ux-pro-max-skill'`：UI プラグイン完全 ID
- `UI_PLUGIN_MARKETPLACE = 'nextlevelbuilder/ui-ux-pro-max-skill'`：UI プラグインマーケットプレイスリポジトリ

**重要な関数**：
- `isPluginInstalled()`：プラグインがインストールされているかチェック（`claude plugin list` 出力経由）
- `addToMarketplace()`：マーケットプレイスにプラグインを追加（`claude plugin marketplace add`）
- `installPlugin()`：プラグインをインストール（`claude plugin install`）
- `verifyPlugin()`：プラグインがインストールされ有効になっているか検証
- `main()`：メイン関数、完全なチェック→追加→インストール→検証フローを実行

</details>
