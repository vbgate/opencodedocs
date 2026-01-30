---
title: "トラブルシューティングガイド | Plannotator"
sidebarTitle: "問題が発生した場合"
subtitle: "トラブルシューティングガイド"
description: "Plannotatorの一般的な問題のトラブルシューティングと解決策を学びます。ポート占用、ブラウザが開かない、Gitコマンドの失敗、画像アップロード、統合の問題を素早く解決します。"
tags:
  - "トラブルシューティング"
  - "FAQ"
  - "ポート占用"
  - "ブラウザ"
  - "Git"
  - "リモート環境"
  - "統合の問題"
prerequisite:
  - "ja/start-getting-started"
  - "ja/start-installation-claude-code"
  - "ja/start-installation-opencode"
order: 1
---

# トラブルシューティング

## このレッスンを終えるとできるようになること

- ✅ ポート占用問題を素早く診断して解決できる
- ✅ ブラウザが自動的に開かない理由を理解し、アクセス方法がわかる
- ✅ プランやコードレビューが表示されない問題をトラブルシューティングできる
- ✅ Gitコマンド実行の失敗に対処できる
- ✅ 画像アップロード関連のエラーを解決できる
- ✅ Obsidian/Bearの統合失敗の原因を特定できる
- ✅ リモート環境でPlannotatorに正しくアクセスできる

## 現在の困境

Plannotatorを使用しているときに、次のような問題に遭遇する可能性があります：

- **問題1**：起動時にポートが占用されているというエラーが表示され、サーバーが起動しない
- **問題2**：ブラウザが自動的に開かず、レビューインターフェースにアクセスする方法がわからない
- **問題3**：プランやコードレビューページが空白で表示され、コンテンツが読み込まれない
- **問題4**：`/plannotator-review`を実行するとGitエラーが表示される
- **問題5**：画像のアップロードに失敗するか、画像が表示されない
- **問題6**：Obsidian/Bearの統合を設定したが、プランが自動的に保存されない
- **問題7**：リモート環境でローカルサーバーにアクセスできない

これらの問題はワークフローを中断し、ユーザー体験を損ないます。

## コアコンセプト

::: info エラーハンドリングメカニズム

Plannotatorのサーバーには**自動リトライメカニズム**が実装されています：

- **最大リトライ回数**：5回
- **リトライ遅延**：500ミリ秒
- **適用シナリオ**：ポート占用（EADDRINUSEエラー）

ポートが競合している場合、システムは自動的に他のポートを試みます。5回のリトライ後も失敗した場合のみ、エラーが発生します。

:::

Plannotatorのエラーハンドリングは次の原則に従います：

1. **ローカルファースト**：すべてのエラーメッセージはターミナルまたはコンソールに出力されます
2. **グレースフルデグラデーション**：統合の失敗（Obsidianの保存失敗など）はメインブロックをブロックしません
3. **明確なヒント**：具体的なエラーメッセージと推奨される解決策を提供します

## 一般的な問題と解決策

### 問題1：ポート占用

**エラーメッセージ**：

```
Port 19432 in use after 5 retries
```

**原因分析**：

- ポートが他のプロセスによって占用されている
- リモートモードで固定ポートが設定されているが、ポートが競合している
- 前回のPlannotatorプロセスが正常に終了していない

**解決策**：

#### 方法1：自動リトライを待つ（ローカルモードのみ）

ローカルモードでは、Plannotatorは自動的にランダムポートを試みます。ポート占用エラーが表示された場合は、通常次を意味します：

- 5つのランダムポートがすべて占用されている（極めて稀）
- 固定ポート（`PLANNOTATOR_PORT`）が設定されているが、競合している

**表示されるはずのもの**：ターミナルに「Port X in use after 5 retries」と表示されます

#### 方法2：固定ポートを使用する（リモートモード）

リモート環境では、`PLANNOTATOR_PORT`を設定する必要があります：

::: code-group

```bash [macOS/Linux]
export PLANNOTATOR_PORT=9999
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT = "9999"
plannotator start
```

:::

::: tip ポート選択のアドバイス

- 1024-49151の範囲内のポートを選択する（ユーザーウェルノウンポート）
- 一般的なサービスポート（80、443、3000、5000など）を避ける
- ポートがファイアウォールにブロックされていないことを確認する

:::

#### 方法3：ポートを占用しているプロセスをクリーンアップする

```bash
# ポートを占用しているプロセスを検索する（19432を実際のポートに置き換える）
lsof -i :19432  # macOS/Linux
netstat -ano | findstr :19432  # Windows

# プロセスを終了する（PIDを実際のプロセスIDに置き換える）
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

::: warning 注意事項

プロセスを終了する前に、そのプロセスが他の重要なアプリケーションではないことを確認してください。Plannotatorは決定を受け取った後に自動的にサーバーを閉じるため、通常は手動で終了する必要はありません。

:::

---

### 問題2：ブラウザが自動的に開かない

**現象**：ターミナルにはサーバーが起動したことが表示されていますが、ブラウザが開きません。

**原因分析**：

| シナリオ | 理由 |
| --- | --- |
| リモート環境 | Plannotatorがリモートモードを検出し、ブラウザの自動オープン跳过 |
| `PLANNOTATOR_BROWSER`の設定エラー | ブラウザのパスまたは名前が正しくない |
| ブラウザがインストールされていない | システムのデフォルトブラウザが存在しない |

**解決策**：

#### シナリオ1：リモート環境（SSH、Devcontainer、WSL）

**リモート環境かどうかを確認**：

```bash
echo $PLANNOTATOR_REMOTE
# "1" または "true" が出力される場合はリモートモード
```

**リモート環境で**：

1. **ターミナルにアクセスURLが表示される**：

```
Plannotator running at: http://localhost:9999
Press Ctrl+C to stop
```

2. **ブラウザを手動で開き**、表示されたURLにアクセスする

3. **ポートフォワーディングを設定する**（ローカルからアクセスする必要がある場合）

**表示されるはずのもの**：ターミナルに「Plannotator running at: http://localhost:19432」と類似したメッセージが出力される

#### シナリオ2：ローカルモードだがブラウザが開かない

**`PLANNOTATOR_BROWSER`の設定を確認**：

::: code-group

```bash [macOS/Linux]
echo $PLANNOTATOR_BROWSER
# ブラウザの名前またはパスが出力されるはず
```

```powershell [Windows PowerShell]
echo $env:PLANNOTATOR_BROWSER
```

:::

**カスタムブラウザ設定をクリアする**：

::: code-group

```bash [macOS/Linux]
unset PLANNOTATOR_BROWSER
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_BROWSER = ""
plannotator start
```

:::

**正しいブラウザを設定する**（カスタマイズが必要な場合）：

```bash
# macOS：アプリケーション名を使用
export PLANNOTATOR_BROWSER="Google Chrome"

# Linux：実行ファイルパスを使用
export PLANNOTATOR_BROWSER="/usr/bin/google-chrome"

# Windows：実行ファイルパスを使用
set PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

### 問題3：プランまたはコードレビューが表示されない

**現象**：ブラウザが開いていますが、ページが空白で表示されているか、読み込みに失敗しています。

**考えられる原因**：

| 原因 | プランレビュー | コードレビュー |
| --- | --- | --- |
| プランパラメータが空 | ✅ 一般的 | ❌ 該当なし |
| Gitリポジトリの問題 | ❌ 該当なし | ✅ 一般的 |
| 表示するdiffがない | ❌ 該当なし | ✅ 一般的 |
| サーバーの起動失敗 | ✅ 可能性あり | ✅ 可能性あり |

**解決策**：

#### 状況1：プランレビューが表示されない

**ターミナル出力を確認する**：

```bash
# エラーを検索
plannotator start 2>&1 | grep -i error
```

**一般的なエラー1**：プランパラメータが空

**エラーメッセージ**：

```
400 Bad Request - Missing plan or plan is empty
```

**理由**：Claude CodeまたはOpenCodeから渡されたプランが空の文字列です。

**解決方法**：

- AIエージェントが有効なプランコンテンツを生成したか確認する
- HookまたはPluginの設定が正しいか確認する
- 詳細についてはClaude Code/OpenCodeのログを確認する

**一般的なエラー2**：サーバーが正常に起動していない

**解決方法**：

- ターミナルに「Plannotator running at」というメッセージが表示されているか確認する
- 表示されていない場合は「問題1：ポート占用」を参照
- [環境変数設定](../../advanced/environment-variables/)を確認して設定が正しいことを確認する

#### 状況2：コードレビューが表示されない

**ターミナル出力を確認する**：

```bash
/plannotator-review 2>&1 | grep -i error
```

**一般的なエラー1**：Gitリポジトリがない

**エラーメッセージ**：

```
fatal: not a git repository
```

**解決方法**：

```bash
# Gitリポジトリを初期化
git init

# ファイルを追加してコミットする（未コミットの変更がある場合）
git add .
git commit -m "Initial commit"

# 再度実行
/plannotator-review
```

**表示されるはずのもの**：ブラウザにdiffビューアが表示される

**一般的なエラー2**：表示するdiffがない

**現象**：ページに「No changes」または類似のメッセージが表示される。

**解決方法**：

```bash
# 未コミットの変更があるか確認
git status

# stagedされた変更があるか確認
git diff --staged

# コミットがあるか確認
git log --oneline

# diffタイプを切り替えて異なる範囲を表示
# コードレビューインターフェースでドロップダウンメニューをクリックして切り替え：
# - Uncommitted changes
# - Staged changes
# - Last commit
# - vs main（ブランチにいる場合）
```

**表示されるはずのもの**：diffビューアにコード変更が表示されるか、「No changes」というメッセージが表示される

**一般的なエラー3**：Gitコマンドの実行に失敗した

**エラーメッセージ**：

```
Git diff error for uncommitted: [具体的なエラーメッセージ]
```

**考えられる原因**：

- Gitがインストールされていない
- Gitのバージョンが古すぎる
- Gitの設定に問題がある

**解決方法**：

```bash
# Gitのバージョンを確認
git --version

# Git diffコマンドをテスト
git diff HEAD

# Gitが正常に動作している場合は、問題はPlannotatorの内部エラーの可能性があります
# 完全なエラーメッセージを確認してバグを報告する
```

---

### 問題4：画像のアップロードに失敗した

**エラーメッセージ**：

```
400 Bad Request - No file provided
500 Internal Server Error - Upload failed
```

**考えられる原因**：

| 原因 | 解決方法 |
| --- | --- |
| ファイルが選択されていない | アップロードボタンをクリックして画像を選択 |
| サポートされていないファイル形式 | png/jpeg/webp形式を使用 |
| ファイルが大きすぎる | 画像を圧縮してからアップロード |
| 一時ディレクトリの権限問題 | /tmp/plannotatorディレクトリ権限を確認 |

**解決策**：

#### アップロードするファイルを確認する

**サポートされている形式**：

- ✅ PNG (`.png`)
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

**サポートされていない形式**：

- ❌ BMP (`.bmp`)
- ❌ GIF (`.gif`)
- ❌ SVG (`.svg`)

**表示されるはずのもの**：アップロード成功后、画像がレビューインターフェースに表示される

#### 一時ディレクトリの権限を確認する

Plannotatorは自動的に`/tmp/plannotator`ディレクトリを作成します。それでもアップロードに失敗する場合は、システム一時ディレクトリ権限を確認してください。

**手動で確認する必要がある場合**：

```bash
# ディレクトリ権限を確認
ls -la /tmp/plannotator

# Windowsで確認
dir %TEMP%\plannotator
```

**表示されるはずのもの**：`drwxr-xr-x`（または類似の権限）はディレクトリが書き込み可能であることを示す

#### ブラウザの開発者ツールを確認する

1. F12を押して開発者ツールを開く
2. 「Network」タブに切り替える
3. アップロードボタンをクリックする
4. `/api/upload`リクエストを検索する
5. リクエストの状態と応答を確認する

**表示されるはずのもの**：
- ステータスコード：200 OK（成功）
- 応答：`{"path": "/tmp/plannotator/xxx.png"}`

---

### 問題5：Obsidian/Bearの統合に失敗した

**現象**：プランを承認した後、ノートアプリケーションに保存されたプランがありません。

**考えられる原因**：

| 原因 | Obsidian | Bear |
| --- | --- | --- |
| 統合が有効になっていない | ✅ | ✅ |
| Vault/Appが検出されていない | ✅ | N/A |
| パス設定エラー | ✅ | ✅ |
| ファイル名の競合 | ✅ | ✅ |
| x-callback-urlの失敗 | N/A | ✅ |

**解決策**：

#### Obsidianの統合問題

**ステップ1：統合が有効になっているか確認する**

1. Plannotator UIで設定（歯車アイコン）をクリックする
2. 「Obsidian Integration」セクションを見つける
3. スイッチがオンになっていることを確認する

**表示されるはずのもの**：スイッチが青色で表示されている（有効な状態）

**ステップ2：Vault検出を確認する**

**自動検出**：

- Plannotatorは自動的にObsidian設定ファイルを読み取る
- 設定ファイルの位置：
  - macOS: `~/Library/Application Support/obsidian/obsidian.json`
  - Windows: `%APPDATA%\obsidian\obsidian.json`
  - Linux: `~/.config/obsidian/obsidian.json`

**手動で確認する**：

::: code-group

```bash [macOS]
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

```powershell [Windows PowerShell]
cat $env:APPDATA\obsidian\obsidian.json
```

```bash [Linux]
cat ~/.config/obsidian/obsidian.json
```

:::

**表示されるはずのもの**：`vaults`フィールドを含むJSONファイル

**ステップ3：Vaultパスを手動で設定する**

自動検出が失敗した場合：

1. Plannotator設定で
2. 「Manually enter vault path」をクリックする
3. 完全なVaultパスを入力する

**パスの例**：

- macOS: `/Users/yourname/Documents/ObsidianVault`
- Windows: `C:\Users\yourname\Documents\ObsidianVault`
- Linux: `/home/yourname/Documents/ObsidianVault`

**表示されるはずのもの**：ドロップダウンメニューに入力したVault名が表示される

**ステップ4：ターミナル出力を確認する**

Obsidianの結果はターミナルに出力されます：

```bash
[Obsidian] Saved plan to: /path/to/vault/plannotator/Title - Jan 24, 2026 2-30pm.md
```

**エラーメッセージ**：

```
[Obsidian] Save failed: [具体的なエラーメッセージ]
```

**一般的なエラー**：

- 権限不足 → Vaultディレクトリ権限を確認
- ディスク容量不足 → スペースを解放
- 無効なパス → パスのスペルが正しいことを確認

#### Bearの統合問題

**Bearアプリケーションを確認する**

- BearがmacOSにインストールされていることを確認
- Bearアプリケーションが実行中であることを確認

**x-callback-urlをテストする**：

```bash
# ターミナルでテスト
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**表示されるはずのもの**：Bearが開いて新しいメモが作成される

**ターミナル出力を確認する**：

```bash
[Bear] Saved plan to Bear
```

**エラーメッセージ**：

```
[Bear] Save failed: [具体的なエラーメッセージ]
```

**解決方法**：

- Bearアプリケーションを再起動
- Bearが最新バージョンであることを確認
- macOS権限設定を確認（Bearがファイルにアクセスすることを許可）

---

### 問題6：リモート環境アクセス問題

**現象**：SSH、Devcontainer、またはWSLで、ローカルブラウザからサーバーにアクセスできません。

**コアコンセプト**：

::: info リモート環境とは

リモート環境とは、SSH、Devcontainer、またはWSLを通じてアクセスされるリモートコンピューティング環境です。この環境では、**ポートフォワーディング**を使用してリモートポートをローカルにマッピングし、ローカルブラウザでリモートサーバーにアクセスする必要があります。

:::

**解決策**：

#### ステップ1：リモートモードを設定する

リモート環境で環境変数を設定します：

::: code-group

```bash [macOS/Linux/WSL]
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

```powershell [Windows]
$env:PLANNOTATOR_REMOTE = "1"
$env:PLANNOTATOR_PORT = "9999"
```

:::

**表示されるはずのもの**：ターミナルに「Using remote mode with fixed port: 9999」と出力される

#### ステップ2：ポートフォワーディングを設定する

**シナリオ1：SSHリモートサーバー**

`~/.ssh/config`を編集：

```
Host your-server
    HostName server.example.com
    User yourname
    LocalForward 9999 localhost:9999
```

**サーバーに接続**：

```bash
ssh your-server
```

**表示されるはずのもの**：SSH接続が確立されると、ローカル9999ポートがリモート9999ポートにフォワードされる

**シナリオ2：VS Code Devcontainer**

VS Code Devcontainerは通常、ポートを自動的にフォワードします。

**確認方法**：

1. VS Codeで「Ports」タブを開く
2. 9999ポートを見つける
3. ポートの状態が「Forwarded」になっていることを確認する

**表示されるはずもの**：Portsタブに「Local Address: localhost:9999」と表示される

**シナリオ3：WSL（Windows Subsystem for Linux）**

WSLはデフォルトで`localhost`转发を使用します。

**アクセス方法**：

Windowsブラウザで直接アクセス：

```
http://localhost:9999
```

**表示されるはずのもの**：Plannotator UIが正常に表示される

#### ステップ3：アクセスを検証する

1. リモート環境でPlannotatorを起動する
2. ローカルブラウザで`http://localhost:9999`にアクセスする
3. ページが正常に表示されることを確認する

**表示されるはずのもの**：プランレビューまたはコードレビューインターフェースが正常に読み込まれる

---

### 問題7：プラン/注釈が正しく保存されない

**現象**：プランを承認または拒否した後、注釈が保存されていないか、保存場所が正しくありません。

**考えられる原因**：

| 原因 | 解決方法 |
| --- | --- |
| プラン保存が無効になっている | 設定の「Plan Save」オプションを確認 |
| カスタムパスが無効 | パスが書き込み可能か検証 |
| 注釈コンテンツが空 | 正常な動作（注釈がある場合にのみ保存） |
| サーバーの権限問題 | 保存ディレクトリ権限を確認 |

**解決策**：

#### プラン保存設定を確認する

1. Plannotator UIで設定（歯車アイコン）をクリックする
2. 「Plan Save」セクションを見る
3. スイッチが有効になっていることを確認する

**表示されるはずのもの**：「Save plans and annotations」スイッチが青色で表示されている（有効な状態）

#### 保存パスを確認する

**デフォルトの保存場所**：

```bash
~/.plannotator/plans/  # プランと注釈の両方がこのディレクトリに保存される
```

**カスタムパス**：

設定でカスタム保存パスを設定できます。

**パスが書き込み可能か検証**：

::: code-group

```bash [macOS/Linux]
ls -la ~/.plannotator
mkdir -p ~/.plannotator/plans
touch ~/.plannotator/plans/test.txt
rm ~/.plannotator/plans/test.txt
```

```powershell [Windows PowerShell]
dir $env:USERPROFILE\.plannotator
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.plannotator\plans"
```

:::

**表示されるはずのもの**：コマンドが正常に実行され、権限エラーがない

#### ターミナル出力を確認する

保存結果はターミナルに出力されます：

```bash
[Plan] Saved annotations to: ~/.plannotator/annotations/slug.json
[Plan] Saved snapshot to: ~/.plannotator/plans/slug-approved.md
```

**表示されるはずのもの**：類似した成功メッセージ

---

## このレッスンのまとめ

このレッスンで学んだこと：

- **ポート占用問題を診断**：固定ポートを使用するか、占用プロセスをクリーンアップする
- **ブラウザが開かない問題を処理**：リモートモードを識別し、手動でアクセスするかブラウザを設定する
- **コンテンツが表示されない問題をトラブルシューティング**：プラン引数、Gitリポジトリ、diff状態を確認する
- **画像アップロードの失敗を解決**：ファイル形式、ディレクトリ権限、開発者ツールを確認する
- **統合の失敗を修正**：設定、パス、権限、ターミナル出力を確認する
- **リモートアクセスを設定**：`PLANNOTATOR_REMOTE`とポートフォワーディングを使用する
- **プランと注釈を保存**：プラン保存を有効にし、パス権限を検証する

**覚えておいてください**：

1. ターミナル出力は最高のデバッグ情報源です
2. リモート環境にはポートフォワーディングが必要です
3. 統合の失敗はメインブロックをブロックしません
4. 開発者ツールを使用してネットワークリクエストの詳細を確認する

## 次のステップ

このレッスンでカバーされていない問題が発生した場合は、次を確認してください：

- [トラブルシューティング](../troubleshooting/) - 詳細なデバッグ技術とログ分析方法
- [APIリファレンス](../../appendix/api-reference/) - すべてのAPIエンドポイントとエラーコードについて
- [データモデル](../../appendix/data-models/) - Plannotatorのデータ構造について

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの位置を表示</strong></summary>

> 更新時間：2026-01-24

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| サーバーの起動とリトライロジック | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L335) | 79-335 |
| ポート占用エラーハンドリング（プランレビュー） | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L319-L334) | 319-334 |
| ポート占用エラーハンドリング（コードレビュー） | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L252-L267) | 252-267 |
| リモートモード検出 | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 全文 |
| ブラウザを開くロジック | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 全文 |
| Gitコマンド実行とエラーハンドリング | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L36-L147) | 36-147 |
| 画像アップロード処理（プランレビュー） | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| 画像アップロード処理（コードレビュー） | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181-L201) | 181-201 |
| Obsidian統合 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts) | 全文 |
| プラン保存 | [`packages/server/storage.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/storage.ts) | 全文 |

**重要な定数**：

| 定数 | 値 | 説明 |
| --- | --- | --- |
| `MAX_RETRIES` | 5 | サーバー起動の最大リトライ回数 |
| `RETRY_DELAY_MS` | 500 | リトライ遅延（ミリ秒） |

**重要な関数**：

- `startPlannotatorServer()` - プランレビューサーバーを起動
- `startReviewServer()` - コードレビューサーバーを起動
- `isRemoteSession()` - リモート環境かどうかを検出
- `getServerPort()` - サーバーポートを取得
- `openBrowser()` - ブラウザを開く
- `runGitDiff()` - Git diffコマンドを実行
- `detectObsidianVaults()` - Obsidian vaultを検出
- `saveToObsidian()` - プランをObsidianに保存
- `saveToBear()` - プランをBearに保存

</details>
