---
title: "トラブルシューティング: よくある問題の解決方法 | Plannotator"
sidebarTitle: "問題の素早い解決"
subtitle: "トラブルシューティング: よくある問題の解決方法"
description: "Plannotatorのトラブルシューティング方法を学びます。ログの確認、ポート競合、Hook eventのデバッグ、ブラウザの問題、Gitリポジトリの状態、連携エラーの対処法を解説します。"
tags:
  - "トラブルシューティング"
  - "デバッグ"
  - "よくあるエラー"
  - "ログ確認"
prerequisite:
  - "start-getting-started"
order: 2
---

# Plannotator トラブルシューティング

## この章で学べること

問題が発生したとき、以下のことができるようになります：

- 問題の原因を素早く特定する（ポート競合、Hook event解析、Git設定など）
- ログ出力からエラーを診断する
- エラーの種類に応じた適切な解決方法を実行する
- リモート/Devcontainerモードでの接続問題をデバッグする

## 現在の課題

Plannotatorが突然動かなくなった、ブラウザが開かない、またはHookがエラーを出力している。ログの確認方法がわからず、どの部分に問題があるのかも不明。再起動を試したが、問題は解決しない。

## こんなときに使う

以下の状況でトラブルシューティングが必要です：

- ブラウザが自動的に開かない
- Hookがエラーメッセージを出力する
- ポート競合で起動できない
- プランまたはコードレビューページの表示がおかしい
- Obsidian/Bear連携が失敗する
- Git diffが空で表示される

---

## コアコンセプト

Plannotatorの問題は通常、3つのカテゴリに分類されます：

1. **環境の問題**：ポート競合、環境変数の設定ミス、ブラウザパスの問題
2. **データの問題**：Hook event解析の失敗、プラン内容が空、Gitリポジトリの状態異常
3. **連携の問題**：Obsidian/Bear保存の失敗、リモートモードの接続問題

デバッグの基本は**ログ出力の確認**です。Plannotatorは`console.error`でエラーをstderrに、`console.log`で通常の情報をstdoutに出力します。この2つを区別することで、問題の種類を素早く特定できます。

---

## 🎒 始める前の準備

- ✅ Plannotatorがインストール済み（Claude CodeまたはOpenCodeプラグイン）
- ✅ 基本的なコマンドライン操作を理解している
- ✅ プロジェクトディレクトリとGitリポジトリの状態を把握している

---

## ステップバイステップ

### ステップ1：ログ出力を確認する

**なぜ必要か**

Plannotatorのすべてのエラーはstderrに出力されます。ログの確認が問題診断の第一歩です。

**操作方法**

#### Claude Codeの場合

HookがPlannotatorをトリガーすると、エラーメッセージはClaude Codeのターミナル出力に表示されます：

```bash
# 表示される可能性のあるエラー例
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

#### OpenCodeの場合

OpenCodeはCLIのstderrをキャプチャしてインターフェースに表示します：

```
[stderr] Failed to parse hook event from stdin
[stderr] No plan content in hook event
```

**期待される結果**：

- エラーがない場合、stderrは空か、想定内の情報メッセージのみ
- エラーがある場合、エラータイプ（EADDRINUSEなど）、エラーメッセージ、スタックトレース（あれば）が含まれる

---

### ステップ2：ポート競合の問題を解決する

**なぜ必要か**

Plannotatorはデフォルトでランダムなポートでサーバーを起動します。固定ポートが使用中の場合、サーバーは5回リトライ（各500ms遅延）し、失敗するとエラーを報告します。

**エラーメッセージ**：

```
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

**解決方法**

#### 方法A：Plannotatorに自動でポートを選択させる（推奨）

`PLANNOTATOR_PORT`環境変数を設定しないでくださ��。Plannotatorが自動的に利用可能なポートを選択します。

#### 方法B：固定ポートを使用して競合を解決する

固定ポートが必要な場合（リモートモードなど）、ポート競合を解決する必要があります：

```bash
# macOS/Linux
lsof -ti:54321 | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 54321 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

その後、ポートを再設定します：

```bash
# macOS/Linux/WSL
export PLANNOTATOR_PORT=54322

# Windows PowerShell
$env:PLANNOTATOR_PORT = "54322"
```

**チェックポイント ✅**：

- 再度Plannotatorをトリガーすると、ブラウザが正常に開くはず
- まだエラーが出る場合は、別のポート番号を試してください

---

### ステップ3：Hook event解析エラーをデバッグする

**なぜ必要か**

Hook eventはstdinから読み取られるJSONデータです。解析に失敗すると、Plannotatorは続行できません。

**エラーメッセージ**：

```
Failed to parse hook event from stdin
No plan content in hook event
```

**考えられる原因**：

1. Hook eventが有効なJSONではない
2. Hook eventに`tool_input.plan`フィールドがない
3. Hookのバージョンが互換性がない

**デバッグ方法**

#### Hook eventの内容を確認する

Hookサーバー起動前に、stdinの内容を出力します：

```bash
# hook/server/index.tsを一時的に修正
# 91行目の後に追加：
console.error("[DEBUG] Hook event:", eventJson);
```

**期待される結果**：

```json
{
  "tool_input": {
    "plan": "# Implementation Plan\n\n## Task 1\n..."
  },
  "permission_mode": "default"
}
```

**解決方法**：

- `tool_input.plan`が空または欠落している場合、AI Agentがプランを正しく生成しているか確認
- JSONフォーマットが不正な場合、Hook設定が正しいか確認
- Hookバージョンに互換性がない場合、Plannotatorを最新バージョンに更新

---

### ステップ4：ブラウザが開かない問題を解決する

**なぜ必要か**

Plannotatorは`openBrowser`関数を使用してブラウザを自動的に開きます。失敗する場合、クロスプラットフォームの互換性問題またはブラウザパスのエラーが考えられます。

**考えられる原因**：

1. システムのデフォルトブラウザが設定されていない
2. カスタムブラウザパスが無効
3. WSL環境での特殊な処理の問題
4. リモートモードではブラウザは自動的に開かない（これは正常な動作）

**デバッグ方法**

#### リモートモードかどうかを確認する

```bash
# 環境変数を確認
echo $PLANNOTATOR_REMOTE

# Windows PowerShell
echo $env:PLANNOTATOR_REMOTE
```

出力が`1`または`true`の場合、リモートモードであり、ブラウザは自動的に開きません。これは想定された動作です。

#### ブラウザを手動でテストする

```bash
# macOS
open "http://localhost:54321"

# Linux
xdg-open "http://localhost:54321"

# Windows
start http://localhost:54321
```

**期待される結果**：

- 手動で開けた場合、Plannotatorサーバーは正常に動作しており、問題は自動オープンのロジックにある
- 手動で開けない場合、URLが正しいか確認（ポートが異なる可能性あり）

**解決方法**：

#### 方法A：カスタムブラウザを設定する（macOS）

```bash
export PLANNOTATOR_BROWSER="Google Chrome"

# またはフルパスを使用
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

#### 方法B：カスタムブラウザを設定する（Linux）

```bash
export PLANNOTATOR_BROWSER="/usr/bin/firefox"
```

#### 方法C：リモートモードで手動で開く（Devcontainer/SSH）

```bash
# PlannotatorはURLとポート情報を出力します
# URLをコピーして、ローカルブラウザで開きます
# またはポートフォワーディングを使用：
ssh -L 19432:localhost:19432 user@remote
```

---

### ステップ5：Gitリポジトリの状態を確認する（コードレビュー）

**なぜ必要か**

コードレビュー機能はGitコマンドに依存しています。Gitリポジトリの状態が異常な場合（コミットがない、Detached HEADなど）、diffが空またはエラーになります。

**エラーメッセージ**：

```
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**デバッグ方法**

#### Gitリポジトリを確認する

```bash
# Gitリポジトリ内にいるか確認
git status

# 現在のブランチを確認
git branch

# コミットがあるか確認
git log --oneline -1
```

**期待される結果**：

- `fatal: not a git repository`と出力された場合、現在のディレクトリはGitリポジトリではない
- `HEAD detached at <commit>`と出力された場合、Detached HEAD状態にある
- `fatal: your current branch 'main' has no commits yet`と出力された場合、まだコミットがない

**解決方法**：

#### 問題A：Gitリポジトリ内にいない

```bash
# Gitリポジトリを初期化
git init
git add .
git commit -m "Initial commit"
```

#### 問題B：Detached HEAD状態

```bash
# ブランチに切り替え
git checkout main
# または新しいブランチを作成
git checkout -b feature-branch
```

#### 問題C：コミットがない

```bash
# diffを表示するには少なくとも1つのコミットが必要
git add .
git commit -m "Initial commit"
```

#### 問題D：空のdiff（変更がない）

```bash
# 何か変更を作成
echo "test" >> test.txt
git add test.txt

# 再度 /plannotator-review を実行
```

**チェックポイント ✅**：

- 再度`/plannotator-review`を実行すると、diffが正常に表示されるはず
- まだ空の場合、ステージングされていない、またはコミットされていない変更があるか確認

---

### ステップ6：Obsidian/Bear連携の失敗をデバッグする

**なぜ必要か**

Obsidian/Bear連携の失敗はプランの承認をブロックしませんが、保存が失敗します。エラーはstderrに出力されます。

**エラーメッセージ**：

```
[Obsidian] Save failed: Vault not found
[Bear] Save failed: Failed to open Bear
```

**デバッグ方法**

#### Obsidianの設定を確認する

**macOS**：
```bash
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

**Windows**：
```powershell
cat $env:APPDATA\obsidian\obsidian.json
```

**期待される結果**：

```json
{
  "vaults": {
    "/path/to/vault": {
      "path": "/path/to/vault",
      "ts": 1234567890
    }
  }
}
```

#### Bearの利用可能性を確認する（macOS）

```bash
# Bear URLスキームをテスト
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**期待される結果**：

- Bearアプリが開き、新しいノートが作成される
- 何も起こらない場合、Bearが正しくインストールされていない

**解決方法**：

#### Obsidian保存の失敗

- Obsidianが実行中であることを確認
- vaultパスが正しいか確認
- Obsidianで手動でノートを作成して、権限を確認

#### Bear保存の失敗

- Bearが正しくインストールされていることを確認
- `bear://x-callback-url`が利用可能かテスト
- Bearの設定でx-callback-urlが有効になっているか確認

---

### ステップ7：詳細なエラーログを確認する（デバッグモード）

**なぜ必要か**

エラーメッセージが十分に詳細でない場合、完全なスタックトレースとコンテキストを確認する必要があります。

**操作方法**

#### Bunデバッグモードを有効にする

```bash
export DEBUG="*"
plannotator review

# Windows PowerShell
$env:DEBUG = "*"
plannotator review
```

#### Plannotatorサーバーログを確認する

サーバー内部のエラーは`console.error`で出力されます。主要なログの場所：

- `packages/server/index.ts:260` - 連携エラーログ
- `packages/server/git.ts:141` - Git diffエラーログ
- `apps/hook/server/index.ts:100-106` - Hook event解析エラー

**期待される結果**：

```bash
# Obsidianへの保存成功
[Obsidian] Saved plan to: /path/to/vault/Plan - 2026-01-24.md

# 保存失敗
[Obsidian] Save failed: Cannot write to directory
[Bear] Save failed: Failed to open Bear

# Git diffエラー
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**チェックポイント ✅**：

- エラーログに問題を特定するのに十分な情報が含まれている
- エラータイプに応じた解決方法を実行する

---

## よくあるトラブル

### ❌ stderr出力を無視する

**間違った方法**：

```bash
# stdoutだけを見て、stderrを無視
plannotator review 2>/dev/null
```

**正しい方法**：

```bash
# stdoutとstderrの両方を確認
plannotator review
# またはログを分離
plannotator review 2>error.log
```

### ❌ 闇雲にサーバーを再起動する

**間違った方法**：

- 問題が発生したらすぐに再起動し、エラーの原因を確認しない

**正しい方法**：

- まずエラーログを確認し、問題の種類を特定
- エラータイプに応じた解決方法を実行
- 再起動は最後の手段

### ❌ リモートモードでブラウザの自動オープンを期待する

**間違った方法**：

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# ブラウザが自動的に開くことを期待（開かない）
```

**正しい方法**：

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# 出力されたURLを記録し、手動でブラウザで開く
# またはポートフォワーディングを使用
```

---

## この章のまとめ

- Plannotatorは`console.error`でエラーをstderrに、`console.log`で通常の情報をstdoutに出力する
- よくある問題：ポート競合、Hook event解析の失敗、ブラウザが開かない、Gitリポジトリの状態異常、連携の失敗
- デバッグの基本：ログを確認 → 問題の種類を特定 → 対応する解決方法を実行
- リモートモードではブラウザは自動的に開かないため、手動でURLを開くかポートフォワーディングを設定する

---

## 次の章の予告

> 次の章では**[よくある質問](../common-problems/)**を学びます。
>
> 学べる内容：
> - インストールと設定の問題の解決方法
> - よくある使用上の誤解と注意点
> - パフォーマンス最適化のヒント

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| ポートリトライ機構 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L80) | 79-80 |
| EADDRINUSEエラー処理 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L320-L334) | 320-334 |
| Hook event解析 | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L91-L107) | 91-107 |
| ブラウザオープン | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Git diffエラー処理 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L139-L144) | 139-144 |
| Obsidian保存ログ | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L242-L246) | 242-246 |
| Bear保存ログ | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L252-L256) | 252-256 |

**主要な定数**：
- `MAX_RETRIES = 5`：ポートリトライの最大回数
- `RETRY_DELAY_MS = 500`：ポートリトライの遅延（ミリ秒）

**主要な関数**：
- `startPlannotatorServer()`：プランレビューサーバーを起動
- `startReviewServer()`：コードレビューサーバーを起動
- `openBrowser()`：クロスプラットフォームでブラウザを開く
- `runGitDiff()`：Git diffコマンドを実行
- `saveToObsidian()`：プランをObsidianに保存
- `saveToBear()`：プランをBearに保存

</details>
