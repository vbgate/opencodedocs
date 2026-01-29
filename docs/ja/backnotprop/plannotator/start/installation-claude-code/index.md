---
title: "Claude Code: インストールと設定 | Plannotator"
sidebarTitle: "3分でセットアップ"
subtitle: "Claude Code: インストールと設定"
description: "Claude CodeでPlannotatorプラグインをインストールする方法を学びます。3分で設定完了。プラグインシステムと手動Hookの2つの方法をサポートし、macOS、Linux、Windowsに対応。リモート環境やDevcontainerの設定も解説します。"
tags:
  - "installation"
  - "claude-code"
  - "getting-started"
prerequisite:
  - "start-getting-started"
order: 2
---

# Claude Codeプラグインのインストール

## この章で学べること

- Claude CodeでPlannotatorのプランレビュー機能を有効にする
- 自分に合ったインストール方法を選択する（プラグインシステムまたは手動Hook）
- インストールが成功したか確認する
- リモート/Devcontainer環境で正しく設定する

## 今あなたが直面している課題

Claude Codeを使用していると、AIが生成したプランはターミナルでしか確認できず、正確なレビューやフィードバックが困難です。あなたが求めているのは：
- ブラウザでAIプランを視覚的に確認したい
- プランに対して削除、置換、挿入などの正確なアノテーションを付けたい
- AIに明確な修正指示を一度に伝えたい

## このチュートリアルが役立つ場面

以下のシナリオに最適です：
- Claude Code + Plannotatorを初めて使用する
- Plannotatorを再インストールまたはアップグレードしたい
- リモート環境（SSH、Devcontainer、WSL）で使用したい

## 基本的な仕組み

Plannotatorのインストールは2つのパートに分かれます：
1. **CLIコマンドのインストール**：コアランタイムで、ローカルサーバーとブラウザの起動を担当
2. **Claude Codeの設定**：プラグインシステムまたは手動Hookにより、Claude Codeがプラン完了時に自動でPlannotatorを呼び出すように設定

インストール完了後、Claude Codeが`ExitPlanMode`を呼び出すと、自動的にPlannotatorがトリガーされ、ブラウザでプランレビュー画面が開きます。

## 🎒 始める前の準備

::: warning 事前チェック

- [ ] Claude Code 2.1.7以上がインストール済み（Permission Request Hooksのサポートが必要）
- [ ] ターミナルでコマンドを実行する権限がある（Linux/macOSではsudoまたはホームディレクトリへのインストールが必要）

:::

## 手順

### ステップ1：Plannotator CLIコマンドのインストール

まず、Plannotatorのコマンドラインツールをインストールします。

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

**期待される出力**：ターミナルにインストールの進行状況が表示され、完了後に `plannotator {バージョン番号} installed to {インストールパス}/plannotator` と表示されます

**チェックポイント ✅**：以下のコマンドでインストールを確認：

::: code-group

```bash [macOS / Linux]
which plannotator
```

```powershell [Windows PowerShell]
Get-Command plannotator
```

```cmd [Windows CMD]
where plannotator
```

:::

Plannotatorコマンドのインストールパスが表示されるはずです（例：`/usr/local/bin/plannotator` または `$HOME/.local/bin/plannotator`）。

### ステップ2：Claude Codeにプラグインをインストール

Claude Codeを開き、以下のコマンドを実行します：

```bash
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**期待される出力**：プラグインのインストール成功メッセージが表示されます。

::: danger 重要：Claude Codeの再起動が必須

プラグインをインストールした後、**必ずClaude Codeを再起動してください**。再起動しないとHooksが有効になりません。

:::

### ステップ3：インストールの確認

再起動後、Claude Codeで以下のコマンドを実行してコードレビュー機能をテストします：

```bash
/plannotator-review
```

**期待される出力**：
- ブラウザが自動的にPlannotatorのコードレビュー画面を開く
- ターミナルに "Opening code review..." と表示され、レビューのフィードバックを待機

上記の出力が確認できれば、インストール成功です！

::: tip 補足
プランレビュー機能は、Claude Codeが`ExitPlanMode`を呼び出した際に自動的にトリガーされるため、テストコマンドを手動で実行する必要はありません。実際にプランモードを使用する際にこの機能をテストできます。
:::

### ステップ4：（オプション）手動Hookインストール

プラグインシステムを使用したくない場合や、CI/CD環境で使用する必要がある場合は、手動でHookを設定できます。

`~/.claude/settings.json` ファイルを編集（ファイルが存在しない場合は作成）し、以下の内容を追加します：

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "plannotator",
            "timeout": 1800
          }
        ]
      }
    ]
  }
}
```

**フィールドの説明**：
- `matcher: "ExitPlanMode"` - Claude CodeがExitPlanModeを呼び出した際にトリガー
- `command: "plannotator"` - インストールしたPlannotator CLIコマンドを実行
- `timeout: 1800` - タイムアウト時間（30分）、プランをレビューするのに十分な時間を確保

**チェックポイント ✅**：ファイルを保存後、Claude Codeを再起動し、`/plannotator-review` でテストします。

### ステップ5：（オプション）リモート/Devcontainer設定

SSH、Devcontainer、WSLなどのリモート環境でClaude Codeを使用する場合、環境変数を設定してポートを固定し、ブラウザの自動起動を無効にする必要があります。

リモート環境で以下を実行します：

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999  # ポートフォワーディングでアクセスするポートを選択
```

**これらの変数の効果**：
- 固定ポートを使用（ランダムポートではなく）、ポートフォワーディングの設定が容易に
- ブラウザの自動起動をスキップ（ブラウザはローカルマシン上にあるため）
- ターミナルにURLを出力、ローカルブラウザにコピーして開くことが可能

::: tip ポートフォワーディング

**VS Code Devcontainer**：ポートは通常自動的にフォワードされます。VS Codeの「Ports」タブで確認してください。

**SSHポートフォワーディング**：`~/.ssh/config` を編集し、以下を追加：

```bash
Host your-server
    LocalForward 9999 localhost:9999
```

:::

## よくあるトラブルと解決策

### 問題1：インストール後に `/plannotator-review` コマンドが反応しない

**原因**：Claude Codeを再起動し忘れており、Hooksが有効になっていない。

**解決策**：Claude Codeを完全に終了し、再度開く。

### 問題2：インストールスクリプトの実行に失敗

**原因**：ネットワークの問題または権限不足。

**解決策**：
- ネットワーク接続を確認し、`https://plannotator.ai` にアクセスできることを確認
- 権限の問題が発生した場合は、インストールスクリプトを手動でダウンロードして実行

### 問題3：リモート環境でブラウザが開かない

**原因**：リモート環境にはGUIがなく、ブラウザを起動できない。

**解決策**：`PLANNOTATOR_REMOTE=1` 環境変数を設定し、ポートフォワーディングを設定する。

### 問題4：ポートが使用中

**原因**：固定ポート `9999` が他のプログラムで使用されている。

**解決策**：別の利用可能なポートを選択（例：`8888` または `19432`）。

## このレッスンのまとめ

- ✅ Plannotator CLIコマンドをインストール
- ✅ プラグインシステムまたは手動HookでClaude Codeを設定
- ✅ インストールが成功したことを確認
- ✅ （オプション）リモート/Devcontainer環境を設定

## 次のレッスン

> 次のレッスンでは **[OpenCodeプラグインのインストール](../installation-opencode/)** を学びます。
>
> Claude CodeではなくOpenCodeを使用している場合、次のレッスンでOpenCodeでの同様の設定方法を解説します。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能              | ファイルパス                                                                                                | 行番号    |
|--- | --- | ---|
| インストールスクリプトのエントリ | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L35-L60)                     | 35-60     |
| Hook設定の説明    | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L30-L39)   | 30-39     |
| 手動Hookの例      | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L42-L62)   | 42-62     |
| 環境変数の設定    | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L73-L79)   | 73-79     |
| リモートモードの設定 | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L81-L94)   | 81-94     |

**主要な定数**：
- `PLANNOTATOR_REMOTE = "1"`：リモートモードを有効化、固定ポートを使用
- `PLANNOTATOR_PORT = 9999`：リモートモードで使用する固定ポート（デフォルト19432）
- `timeout: 1800`：Hookのタイムアウト時間（30分）

**主要な環境変数**：
- `PLANNOTATOR_REMOTE`：リモートモードフラグ
- `PLANNOTATOR_PORT`：固定ポート番号
- `PLANNOTATOR_BROWSER`：カスタムブラウザパス

</details>
