---
title: "クイックスタート：5分でopencode-notifyを始める | opencode-notifyチュートリアル"
sidebarTitle: "5分で通知を受け取る"
subtitle: "クイックスタート：5分でopencode-notifyを始める"
description: "opencode-notifyプラグインのインストール方法を学び、5分以内に設定を完了して最初のデスクトップ通知を体験しましょう。本チュートリアルでは、OCXパッケージマネージャーと手動インストールの2つの方法を解説し、macOS、Windows、Linuxに対応しています。AIタスク完了時に即座に通知を受け取れます。"
tags:
  - "入門"
  - "インストール"
  - "クイックスタート"
prerequisite: []
order: 10
---

# クイックスタート：5分でopencode-notifyを始める

## このチュートリアルで学べること

- 3分以内にopencode-notifyプラグインをインストール
- 最初のデスクトップ通知をトリガーし、インストール成功を確認
- 各インストール方法の違いと適用シーンを理解

## 今あなたが抱えている課題

AIにタスクを依頼した後、別のウィンドウで作業を続けていませんか？30秒ごとに画面を切り替えて確認する日々——完了した？エラー？それとも権限待ち？opencode-notifyはまさにこの問題を解決するために生まれました。

この頻繁な切り替えは、集中力を途切れさせ、時間を無駄にします。

## こんな時に使おう

**以下のシーンでopencode-notifyを有効にしましょう**：
- AIがタスクを実行中に、他のアプリに切り替えることが多い
- AIがあなたを必要とした時、すぐに通知を受けたい
- 集中を維持しながら、重要なイベントを見逃したくない

## 基本コンセプト

opencode-notifyの仕組みはシンプルです：OpenCodeのイベントを監視し、重要なタイミングでネイティブデスクトップ通知を送信します。

**通知されるイベント**：
- ✅ タスク完了（Session idle）
- ✅ 実行エラー（Session error）
- ✅ 権限が必要（Permission updated）

**通知されないイベント**：
- ❌ 各サブタスクの完了（ノイズになるため）
- ❌ ターミナルがフォーカスされている時のすべてのイベント（画面を見ているので通知不要）

## 🎒 始める前の準備

::: warning 前提条件
- [OpenCode](https://github.com/sst/opencode)がインストール済み
- 利用可能なターミナル（macOS Terminal、iTerm2、Windows Terminalなど）
- macOS/Windows/Linuxシステム（すべて対応）
:::

## 手順

### ステップ1：インストール方法を選択

opencode-notifyには2つのインストール方法があります：

| 方法 | 適用シーン | メリット | デメリット |
| --- | --- | --- | --- |
| **OCXパッケージマネージャー** | ほとんどのユーザー | ワンクリックインストール、自動更新、依存関係の完全管理 | OCXの事前インストールが必要 |
| **手動インストール** | 特殊な要件がある場合 | 完全な制御、OCX不要 | 依存関係と更新を手動で管理する必要あり |

**推奨**：OCXでのインストールを優先してください。より手軽です。

### ステップ2：OCXでインストール（推奨）

#### 2.1 OCXパッケージマネージャーをインストール

OCXはOpenCodeの公式プラグインパッケージマネージャーで、プラグインのインストール、更新、管理を簡単に行えます。

**OCXをインストール**：

```bash
curl -fsSL https://ocx.kdco.dev/install.sh | sh
```

**期待される出力**：インストールスクリプトが進捗を表示し、最後にインストール成功のメッセージが表示されます。

#### 2.2 KDCO Registryを追加

KDCO Registryは、opencode-notifyなど複数の実用的なプラグインを含むプラグインリポジトリです。

**registryを追加**：

```bash
ocx registry add https://registry.kdco.dev --name kdco
```

**期待される出力**：「Registry added successfully」または同様のメッセージが表示されます。

::: tip オプション：グローバル設定
すべてのプロジェクトで同じregistryを使用したい場合は、`--global`パラメータを追加してください：

```bash
ocx registry add https://registry.kdco.dev --name kdco --global
```
:::

#### 2.3 opencode-notifyをインストール

**プラグインをインストール**：

```bash
ocx add kdco/notify
```

**期待される出力**：
```
✓ Added kdco/notify to your OpenCode workspace
```

### ステップ3：ワークスペース全体を一括インストール（オプション）

完全な体験を得たい場合は、KDCOワークスペースをインストールできます。以下が含まれます：

- opencode-notify（デスクトップ通知）
- バックグラウンドエージェント（Background Agents）
- 専門エージェント（Specialist Agents）
- プランニングツール（Planning Tools）

**ワークスペースをインストール**：

```bash
ocx add kdco/workspace
```

**期待される出力**：複数のコンポーネントが正常に追加されたことを示すメッセージが表示されます。

### ステップ4：インストールを確認

インストール完了後、通知をトリガーして設定が正しいか確認しましょう。

**確認方法1：AIにタスクを完了させる**

OpenCodeで以下を入力：

```
1から10までの合計を計算し、5秒待ってから結果を教えてください。
```

別のウィンドウに切り替えて数秒作業すると、デスクトップ通知がポップアップするはずです。

**確認方法2：設定ファイルを確認**

設定ファイルが存在するか確認：

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
type $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**期待される出力**：
- ファイルが存在しない場合 → デフォルト設定を使用中（正常）
- ファイルが存在する場合 → カスタム設定が表示される

### ステップ5：手動インストール（代替方法）

OCXを使用したくない場合は、手動でインストールできます。

#### 5.1 ソースコードをコピー

opencode-notifyのソースコードをOpenCodeプラグインディレクトリにコピー：

```bash
# ソースコードを専用ディレクトリにコピー
mkdir -p ~/.opencode/plugin/kdco-notify
cp src/notify.ts ~/.opencode/plugin/kdco-notify/
cp -r src/plugin/kdco-primitives ~/.opencode/plugin/kdco-notify/
```

#### 5.2 依存関係をインストール

必要な依存関係を手動でインストール：

```bash
cd ~/.opencode/plugin/
npm install node-notifier detect-terminal @opencode-ai/plugin @opencode-ai/sdk
```

::: warning 注意事項
- **依存関係の管理**：`node-notifier`と`detect-terminal`を手動でインストール・更新する必要があります
- **更新が困難**：更新のたびにソースコードを手動で再コピーする必要があります
- **非推奨**：特別な要件がない限り、OCXでのインストールを推奨します
:::

### チェックポイント ✅

上記の手順を完了したら、以下を確認してください：

- [ ] OCXのインストール成功（`ocx --version`でバージョン番号が出力される）
- [ ] KDCO Registryが追加済み（`ocx registry list`でkdcoが表示される）
- [ ] opencode-notifyがインストール済み（`ocx list`でkdco/notifyが表示される）
- [ ] 最初のデスクトップ通知を受信
- [ ] 通知に正しいタスクタイトルが表示される

**いずれかのステップで失敗した場合**：
- [トラブルシューティング](../../faq/troubleshooting/)を参照
- OpenCodeが正常に動作しているか確認
- システムがデスクトップ通知をサポートしているか確認

## よくある問題と解決策

### よくある問題1：通知が表示されない

**原因**：
- macOS：システム通知がオフになっている
- Windows：通知権限が付与されていない
- Linux：notify-sendがインストールされていない

**解決方法**：

| プラットフォーム | 解決方法 |
| --- | --- |
| macOS | システム設定 → 通知 → OpenCode → 通知を許可 |
| Windows | 設定 → システム → 通知 → 通知をオン |
| Linux | libnotify-binをインストール：`sudo apt install libnotify-bin` |

### よくある問題2：OCXのインストールに失敗

**原因**：ネットワークの問題または権限不足

**解決方法**：
1. ネットワーク接続を確認
2. sudoでインストール（管理者権限が必要）
3. インストールスクリプトを手動でダウンロードして実行

### よくある問題3：依存関係のインストールに失敗

**原因**：Node.jsのバージョンが非互換

**解決方法**：
- Node.js 18以上を使用
- npmキャッシュをクリア：`npm cache clean --force`

## このレッスンのまとめ

このレッスンで完了したこと：
- ✅ OCXパッケージマネージャーのインストール
- ✅ KDCO Registryの追加
- ✅ opencode-notifyプラグインのインストール
- ✅ 最初のデスクトップ通知のトリガー
- ✅ 手動インストール方法の理解

**重要なポイント**：
1. opencode-notifyはネイティブデスクトップ通知を使用し、頻繁なウィンドウ切り替えが不要
2. OCXは推奨されるインストール方法で、依存関係と更新を自動管理
3. デフォルトでは親セッションのみ通知し、サブタスクのノイズを回避
4. ターミナルがフォーカスされている時は自動的に通知を抑制

## 次のレッスン予告

> 次のレッスンでは**[動作原理](../how-it-works/)**を学びます。
>
> 学べること：
> - プラグインがOpenCodeイベントを監視する仕組み
> - スマートフィルタリング機構のワークフロー
> - ターミナル検出とフォーカス検知の原理
> - プラットフォームごとの機能差異

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-27

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| プラグインメインエントリ | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L1-L407) | 1-407 |
| 設定読み込み | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| 通知送信 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L280-L308) | 280-308 |
| ターミナル検出 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| サイレント時間帯チェック | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| デフォルト設定 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |

**主要な定数**：
- `DEFAULT_CONFIG.sounds.idle = "Glass"`：タスク完了時のデフォルトサウンド
- `DEFAULT_CONFIG.sounds.error = "Basso"`：エラー時のデフォルトサウンド
- `DEFAULT_CONFIG.sounds.permission = "Submarine"`：権限リクエスト時のデフォルトサウンド
- `DEFAULT_CONFIG.notifyChildSessions = false`：デフォルトで親セッションのみ通知

**主要な関数**：
- `NotifyPlugin()`：プラグインエントリ関数、イベントハンドラを返す
- `loadConfig()`：設定ファイルを読み込み、デフォルト値とマージ
- `sendNotification()`：ネイティブデスクトップ通知を送信
- `detectTerminalInfo()`：ターミナルタイプとBundle IDを検出
- `isQuietHours()`：現在時刻がサイレント時間帯かどうかをチェック
- `isParentSession()`：親セッションかどうかを判定
- `isTerminalFocused()`：ターミナルがフォアグラウンドウィンドウかどうかを検出

</details>
