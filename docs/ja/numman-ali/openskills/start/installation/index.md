---
title: "インストール：クイックセットアップ | OpenSkills"
sidebarTitle: "5分で実行"
subtitle: "インストール：クイックセットアップ | OpenSkills"
description: "OpenSkillsのインストール方法を学びます。5分以内で環境設定を完了し、npxとグローバルインストールの2つの方法をサポートし、環境検証とトラブルシューティングをカバーします。"
tags:
  - "インストール"
  - "環境設定"
  - "Node.js"
  - "Git"
prerequisite:
  - "ターミナルの基本操作"
duration: 3
order: 3
---

# OpenSkillsツールのインストール

## 学習後の到達目標

このレッスンを完了すると、次のことができるようになります：

- Node.jsとGitの環境を確認・設定する
- `npx`またはグローバルインストールを使用してOpenSkillsを利用する
- OpenSkillsが正しくインストールされているか検証する
- よくあるインストール問題（バージョン不一致、ネットワーク問題など）を解決する

## 現在の課題

次のような問題に直面しているかもしれません：

- **環境要件が不明確**：どのバージョンのNode.jsとGitが必要かわからない
- **インストール方法がわからない**：OpenSkillsはnpmパッケージだが、npxかグローバルインストールか不明確
- **インストール失敗**：バージョンの非互換性やネットワーク問題に遭遇
- **権限問題**：グローバルインストール時にEACCESエラーが発生

このレッスンでは、これらの問題を段階的に解決します。

## この方法を使うタイミング

次の場合に役立ちます：

- OpenSkillsを初めて使用する場合
- 新しいバージョンに更新する場合
- 新しいマシンで開発環境を設定する場合
- インストール関連の問題をトラブルシューティングする場合

## 🎒 開始前の準備

::: tip システム要件

OpenSkillsには最低限のシステム要件があります。これらを満たさないと、インストール失敗や動作異常が発生する可能性があります。

:::

::: warning 事前確認

開始前に、以下のソフトウェアがインストールされていることを確認してください：

1. **Node.js 20.6以降**
2. **Git**（リポジトリからスキルをクローンするため）

:::

## コアコンセプト

OpenSkillsはNode.js CLIツールで、2つの使用方法があります：

| 方式 | コマンド | メリット | デメリット | 適用シナリオ |
|--- | --- | --- | --- | ---|
| **npx** | `npx openskills` | インストール不要、自動的に最新バージョンを使用 | 毎回の実行時にダウンロード（キャッシュあり） | たまに使用、新バージョンのテスト |
| **グローバルインストール** | `openskills` | コマンドが短く、応答が高速 | 手動更新が必要 | 頻繁に使用、固定バージョン |

**npxの使用を推奨します**。ただし、OpenSkillsを非常に頻繁に使用する場合は除きます。

---

## 実践してみましょう

### ステップ1：Node.jsバージョンの確認

まず、システムにNode.jsがインストールされているか、バージョン要件を満たしているかを確認します：

```bash
node --version
```

**なぜ必要か**

OpenSkillsにはNode.js 20.6以降が必要です。これより低いバージョンでは、実行時エラーが発生します。

**期待される出力**：

```bash
v20.6.0
```

またはそれ以上のバージョン（`v22.0.0`など）。

::: danger バージョンが古すぎる場合

`v18.x.x`またはそれ以下のバージョン（`v16.x.x`など）が表示される場合、Node.jsをアップグレードする必要があります。

:::

**バージョンが古い場合**：

[nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)を使用してNode.jsをインストール・管理することをお勧めします：

::: code-group

```bash [macOS/Linux]
# nvmをインストール（インストールされていない場合）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# ターミナル設定を再読み込み
source ~/.bashrc  # または source ~/.zshrc

# Node.js 20 LTSをインストール
nvm install 20
nvm use 20

# バージョンを確認
node --version
```

```powershell [Windows]
# nvm-windowsをダウンロードしてインストール
# 訪問先：https://github.com/coreybutler/nvm-windows/releases

# インストール後、PowerShellで実行：
nvm install 20
nvm use 20

# バージョンを確認
node --version
```

:::

**期待される出力**（アップグレード後）：

```bash
v20.6.0
```

---

### ステップ2：Gitのインストール確認

OpenSkillsはGitを使用してスキルリポジトリをクローンします：

```bash
git --version
```

**なぜ必要か**

GitHubからスキルをインストールする際、OpenSkillsは`git clone`コマンドを使用してリポジトリをダウンロードします。

**期待される出力**：

```bash
git version 2.40.0
```

（バージョン番号は異なる可能性がありますが、出力があれば問題ありません）

::: danger Gitがインストールされていない場合

`command not found: git`または同様のエラーが表示される場合、Gitをインストールする必要があります。

:::

**Gitがインストールされていない場合**：

::: code-group

```bash [macOS]
# macOSには通常Gitがプリインストールされていますが、ない場合：
brew install git
```

```powershell [Windows]
# Git for Windowsをダウンロードしてインストール
# 訪問先：https://git-scm.com/download/win
```

```bash [Linux (Ubuntu/Debian)]
sudo apt update
sudo apt install git
```

```bash [Linux (CentOS/RHEL)]
sudo yum install git
```

:::

インストール完了後、`git --version`を再実行して確認します。

---

### ステップ3：環境の検証

Node.jsとGitが両方使用可能か検証します：

```bash
node --version && git --version
```

**期待される出力**：

```bash
v20.6.0
git version 2.40.0
```

両方のコマンドが成功して出力されれば、環境設定が正しく行われています。

---

### ステップ4：npx方式を使用する（推奨）

OpenSkillsは`npx`を直接使用することを推奨し、追加のインストールは不要です：

```bash
npx openskills --version
```

**なぜ必要か**

`npx`は最新バージョンのOpenSkillsを自動的にダウンロード・実行し、手動でのインストールや更新が不要です。最初の実行時にパッケージをローカルキャッシュにダウンロードし、以降の実行ではキャッシュを使用するため高速です。

**期待される出力**：

```bash
1.5.0
```

（バージョン番号は異なる可能性があります）

::: tip npxの仕組み

`npx` (Node Package eXecute) はnpm 5.2.0+に同梱されているツールです：
- 初回実行：npmからパッケージを一時ディレクトリにダウンロード
- 以降の実行：キャッシュを使用（デフォルトで24時間有効）
- 更新：キャッシュの有効期限が切れると自動的に最新バージョンをダウンロード

:::

**インストールコマンドのテスト**：

```bash
npx openskills list
```

**期待される出力**：

```bash
Installed Skills:

No skills installed. Run: npx openskills install <source>
```

または、インストール済みのスキルのリストが表示されます。

---

### ステップ5：（オプション）グローバルインストール

OpenSkillsを頻繁に使用する場合、グローバルインストールを選択できます：

```bash
npm install -g openskills
```

**なぜ必要か**

グローバルインストール後、`openskills`コマンドを直接使用でき、毎回`npx`を入力する必要がなく、応答も高速です。

**期待される出力**：

```bash
added 4 packages in 3s
```

（出力は異なる可能性があります）

::: warning 権限問題

グローバルインストール時に`EACCES`エラーが発生した場合、グローバルディレクトリに書き込む権限がありません。

**解決方法**：

```bash
# 方法1：sudoを使用（macOS/Linux）
sudo npm install -g openskills

# 方法2：npm権限を修正（推奨）
# グローバルインストールディレクトリを確認
npm config get prefix

# 正しい権限を設定（/usr/localを実際のパスに置き換え）
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin
```

:::

**グローバルインストールの検証**：

```bash
openskills --version
```

**期待される出力**：

```bash
1.5.0
```

::: tip グローバルインストールの更新

グローバルインストールされたOpenSkillsを更新する場合：

```bash
npm update -g openskills
```

:::

---

## チェックポイント ✅

上記の手順を完了した後、次の項目を確認してください：

- [ ] Node.jsバージョンが20.6以上（`node --version`）
- [ ] Gitがインストールされている（`git --version`）
- [ ] `npx openskills --version`または`openskills --version`で正しくバージョンが表示される
- [ ] `npx openskills list`または`openskills list`が正常に実行できる

すべてのチェックが通過した場合、おめでとうございます！OpenSkillsのインストールは成功です。

---

## よくある落とし穴

### 問題1：Node.jsバージョンが古すぎる

**エラーメッセージ**：

```bash
Error: The module was compiled against a different Node.js version
```

**原因**：Node.jsバージョンが20.6未満

**解決方法**：

nvmを使用してNode.js 20以降をインストールします：

```bash
nvm install 20
nvm use 20
```

---

### 問題2：npxコマンドが見つからない

**エラーメッセージ**：

```bash
command not found: npx
```

**原因**：npmバージョンが古すぎる（npxにはnpm 5.2.0+が必要）

**解決方法**：

```bash
# npmを更新
npm install -g npm@latest

# バージョンを確認
npx --version
```

---

### 問題3：ネットワークタイムアウトまたはダウンロード失敗

**エラーメッセージ**：

```bash
Error: network timeout
```

**原因**：npmレジストリへのアクセスが制限されている

**解決方法**：

```bash
# npmミラーソースを使用（淘宝ミラーなど）
npm config set registry https://registry.npmmirror.com

# 再試行
npx openskills --version
```

デフォルトソースに戻す：

```bash
npm config set registry https://registry.npmjs.org
```

---

### 問題4：グローバルインストールの権限エラー

**エラーメッセージ**：

```bash
Error: EACCES: permission denied
```

**原因**：グローバルインストールディレクトリに書き込む権限がない

**解決方法**：

「ステップ5」の権限修正方法を参照してください。または、`sudo`を使用します（推奨されません）。

---

### 問題5：Gitクローン失敗

**エラーメッセージ**：

```bash
Error: git clone failed
```

**原因**：SSH鍵が設定されていないか、ネットワーク問題

**解決方法**：

```bash
# Git接続をテスト
git ls-remote https://github.com/numman-ali/openskills.git

# 失敗する場合、ネットワークを確認またはプロキシを設定
git config --global http.proxy http://proxy.example.com:8080
```

---

## レッスンのまとめ

このレッスンでは、次のことを学びました：

1. **環境要件**：Node.js 20.6+とGit
2. **推奨される使用方法**：`npx openskills`（インストール不要）
3. **オプションのグローバルインストール**：`npm install -g openskills`（頻繁に使用する場合）
4. **環境検証**：バージョン番号とコマンドの可用性を確認
5. **よくある問題**：バージョンの不一致、権限問題、ネットワーク問題

これでOpenSkillsのインストールが完了しました。次のレッスンでは、最初のスキルをインストールする方法を学びます。

---

## 次のレッスンの予告

> 次のレッスンでは、**[最初のスキルをインストール](../first-skill/)**を学びます
>
> 学ぶこと：
> - Anthropic公式リポジトリからスキルをインストールする方法
> - インタラクティブにスキルを選択するテクニック
> - スキルのディレクトリ構造
> - スキルが正しくインストールされているか検証する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

### コア設定

| 設定項目         | ファイルパス                                                                                       | 行番号      |
|--- | --- | ---|
| Node.jsバージョン要件 | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 45-47     |
| パッケージ情報         | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 1-9       |
| CLIエントリー       | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)             | 39-80     |

### 重要な定数

- **Node.js要件**：`>=20.6.0` (package.json:46)
- **パッケージ名**：`openskills` (package.json:2)
- **バージョン**：`1.5.0` (package.json:3)
- **CLIコマンド**：`openskills` (package.json:8)

### 依存関係の説明

**実行時依存** (package.json:48-53)：
- `@inquirer/prompts`: インタラクティブ選択
- `chalk`: ターミナルのカラフル出力
- `commander`: CLI引数解析
- `ora`: ローディングアニメーション

**開発依存** (package.json:54-59)：
- `typescript`: TypeScriptコンパイル
- `vitest`: ユニットテスト
- `tsup`: ビルドツール

</details>
