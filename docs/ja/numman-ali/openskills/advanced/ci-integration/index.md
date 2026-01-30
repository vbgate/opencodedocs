---
title: "CI/CD: 非インタラクティブ統合 | OpenSkills"
sidebarTitle: "ワンクリックで CI/CD 完了"
subtitle: "CI/CD: 非インタラクティブ統合 | OpenSkills"
description: "OpenSkills の CI/CD 統合を学び、-y フラグを使用した非インタラクティブインストールと同期を習得。GitHub Actions、Docker の実践例を含む、スキルの自動化管理。"
tags:
  - "上級"
  - "CI/CD"
  - "自動化"
  - "デプロイ"
prerequisite:
  - "start-first-skill"
  - "start-sync-to-agents"
  - "platforms-cli-commands"
order: 6
---

# CI/CD 統合

## 学習後にできること

- CI/CD 環境で非インタラクティブモードが必要な理由を理解する
- `install` および `sync` コマンドでの `--yes/-y` フラグの使用を習得する
- GitHub Actions、GitLab CI などの CI プラットフォームでの OpenSkills 統合を学ぶ
- Docker コンテナでのスキル自動インストールフローを理解する
- CI/CD 環境でのスキル更新と同期戦略を習得する
- CI/CD フローでのインタラクティブプロンプトによる失敗を回避する

::: info 前提知識

本チュートリアルでは、[最初のスキルをインストールする](../../start/first-skill/)、[AGENTS.md にスキルを同期する](../../start/sync-to-agents/)、および基本的な[コマンド詳細](../../platforms/cli-commands/)について既に理解していることを前提としています。

:::

---

## 現在の課題

ローカル環境では OpenSkills を熟練して使用できているかもしれませんが、CI/CD 環境では問題に遭遇しているかもしれません：

- **インタラクティブプロンプトによる失敗**: CI フローで選択画面がポップアップし、実行を継続できない
- **自動デプロイ時のスキルインストール**: ビルドのたびにスキルを再インストールする必要があるが、自動確認ができない
- **マルチ環境設定の同期不足**: 開発環境、テスト環境、本番環境のスキル設定が一致していない
- **AGENTS.md 生成の非自動化**: デプロイのたびに手動で sync コマンドを実行する必要がある
- **Docker イメージビルド時のスキル欠如**: コンテナ起動後に手動でスキルをインストールする必要がある

実は OpenSkills は `--yes/-y` フラグを提供しており、非インタラクティブ環境専用に設計されており、CI/CD フローですべての操作を自動化できます。

---

## この手法を使用するタイミング

**CI/CD 統合の適用シナリオ**:

| シナリオ | 非インタラクティブモードが必要か | 例 |
| --- | --- | --- |
| **GitHub Actions** | ✅ はい | PR または push のたびにスキルを自動インストール |
| **GitLab CI** | ✅ はい | マージリクエスト時に AGENTS.md を自動同期 |
| **Docker ビルド** | ✅ はい | イメージビルド時にコンテナにスキルを自動インストール |
| **Jenkins パイプライン** | ✅ はい | 継続的統合時にスキルを自動更新 |
| **開発環境初期化スクリプト** | ✅ はい | 新人がコードをクローン後にワンクリックで環境を設定 |
| **本番環境デプロイ** | ✅ はい | デプロイ時に最新のスキルを自動同期 |

::: tip 推奨プラクティス

- **ローカル開発はインタラクティブ**: 手動操作時は慎重にインストールするスキルを選択できる
- **CI/CD は非インタラクティブ**: 自動化フローでは `-y` フラグを使用してすべてのプロンプトをスキップ
- **環境区別戦略**: 異なる環境で異なるスキルソースを使用（例：プライベートリポジトリ）

:::

---

## 核心概念：非インタラクティブモード

OpenSkills の `install` および `sync` コマンドは両方とも `--yes/-y` フラグをサポートし、すべてのインタラクティブプロンプトをスキップします：

**install コマンドの非インタラクティブ動作**（ソースコード `install.ts:424-427`）：

```typescript
// インタラクティブ選択（-y フラグまたは単一スキルの場合を除く）
let skillsToInstall = skillInfos;

if (!options.yes && skillInfos.length > 1) {
  // インタラクティブ選択フローに入る
  // ...
}
```

**非インタラクティブモードの特徴**：

1. **スキル選択をスキップ**: 見つかったすべてのスキルをインストール
2. **自動上書き**: 既存のスキルに遭遇した場合は直接上書き（`Overwriting: <skill-name>` を表示）
3. **競合確認をスキップ**: 上書きするかどうかを尋ねず、直接実行
4. **ヘッドレス環境との互換性**: TTY のない CI 環境で正常に動作

**warnIfConflict 関数の動作**（ソースコード `install.ts:524-527`）：

```typescript
if (skipPrompt) {
  // 非インタラクティブモードで自動上書き
  console.log(chalk.dim(`Overwriting: ${skillName}`));
  return true;
}
```

::: important 重要な概念

**非インタラクティブモード**: `--yes/-y` フラグを使用してすべてのインタラクティブプロンプトをスキップし、コマンドを CI/CD、スクリプト、TTY なし環境で自動実行できるようにし、ユーザー入力に依存しないようにします。

:::

---

## 実践ガイド

### ステップ 1：非インタラクティブインストールを体験

**理由**

まずローカルで非インタラクティブモードの動作を体験し、インタラクティブモードとの違いを理解します。

ターミナルを開いて実行：

```bash
# 非インタラクティブインストール（見つかったすべてのスキルをインストール）
npx openskills install anthropics/skills --yes

# または短縮形を使用
npx openskills install anthropics/skills -y
```

**表示されるべき内容**：

```
Cloning into '/tmp/openskills-temp-...'...
...
Found 3 skill(s)

Overwriting: codebase-reviewer
Overwriting: file-writer
Overwriting: git-helper

✅ Installed 3 skill(s)

Next: Run 'openskills sync' to generate AGENTS.md
```

**説明**：
- `-y` フラグを使用すると、スキル選択画面がスキップされる
- 見つかったすべてのスキルが自動的にインストールされる
- スキルが既に存在する場合は、`Overwriting: <skill-name>` を表示して直接上書き
- 確認ダイアログはポップアップしない

---

### ステップ 2：インタラクティブと非インタラクティブの比較

**理由**

比較を通じて、2つのモードの違いと適用シナリオをより明確に理解します。

以下のコマンドを実行して、2つのモードを比較：

```bash
# 既存のスキルをクリア（テスト用）
rm -rf .claude/skills

# インタラクティブインストール（選択画面がポップアップ）
echo "=== インタラクティブインストール ==="
npx openskills install anthropics/skills

# 既存のスキルをクリア
rm -rf .claude/skills

# 非インタラクティブインストール（すべてのスキルを自動インストール）
echo "=== 非インタラクティブインストール ==="
npx openskills install anthropics/skills -y
```

**表示されるべき内容**：

**インタラクティブモード**：
- スキルリストを表示し、スペースでチェック
- エンターキーで確認が必要
- 選択的に一部のスキルをインストール可能

**非インタラクティブモード**：
- インストールプロセスを直接表示
- すべてのスキルを自動インストール
- ユーザー入力は不要

**比較表**：

| 特性 | インタラクティブモード（デフォルト） | 非インタラクティブモード（-y） |
| --- | --- | --- |
| **スキル選択** | 選択画面をポップアップし、手動でチェック | 見つかったすべてのスキルを自動インストール |
| **上書き確認** | 既存のスキルを上書きするかどうかを尋ねる | 自動的に上書きし、プロンプトメッセージを表示 |
| **TTY 要件** | インタラクティブターミナルが必要 | 不要、CI 環境で実行可能 |
| **適用シナリオ** | ローカル開発、手動操作 | CI/CD、スクリプト、自動化フロー |
| **入力要件** | ユーザー入力が必要 | ゼロ入力、自動実行 |

---

### ステップ 3：非インタラクティブ AGENTS.md 同期

**理由**

自動化フローで AGENTS.md を生成する方法を学び、AI エージェントが常に最新のスキルリストを使用するようにします。

実行：

```bash
# 非インタラクティブ同期（すべてのスキルを AGENTS.md に同期）
npx openskills sync -y

# 生成された AGENTS.md を表示
cat AGENTS.md | head -20
```

**表示されるべき内容**：

```
✅ Synced 3 skill(s) to AGENTS.md
```

AGENTS.md 内容：

```xml
<skills_system>
This project uses the OpenSkills system for AI agent extensibility.

Usage:
- Ask the AI agent to load specific skills using: "Use the <skill-name> skill"
- The agent will read the skill definition from .claude/skills/<skill-name>/SKILL.md
- Skills provide specialized capabilities like code review, file writing, etc.
</skills_system>

<available_skills>
<skill name="codebase-reviewer">
<description>Review code changes for issues...</description>
</skill>
<skill name="file-writer">
<description>Write files with format...</description>
</skill>
<skill name="git-helper">
<description>Git operations and utilities...</description>
</skill>
</available_skills>
```

**説明**：
- `-y` フラグはスキル選択画面をスキップ
- インストールされているすべてのスキルが AGENTS.md に同期される
- 確認ダイアログはポップアップしない

---

### ステップ 4：GitHub Actions 統合

**理由**

実際の CI/CD フローで OpenSkills を統合し、自動化されたスキル管理を実現します。

プロジェクトに `.github/workflows/setup-skills.yml` ファイルを作成：

```yaml
name: Setup Skills

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills (non-interactive)
        run: openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: openskills sync -y

      - name: Verify AGENTS.md
        run: |
          echo "=== AGENTS.md generated ==="
          cat AGENTS.md

      - name: Upload AGENTS.md as artifact
        uses: actions/upload-artifact@v4
        with:
          name: agents-md
          path: AGENTS.md
```

GitHub にコミットしてプッシュ：

```bash
git add .github/workflows/setup-skills.yml
git commit -m "Add GitHub Actions workflow for OpenSkills"
git push
```

**表示されるべき内容**：GitHub Actions が自動的に実行され、スキルのインストールと AGENTS.md の生成に成功。

**説明**：
- push または PR のたびに自動的にトリガー
- `openskills install anthropics/skills -y` を使用して非インタラクティブにスキルをインストール
- `openskills sync -y` を使用して非インタラクティブに AGENTS.md を同期
- AGENTS.md をアーティファクトとして保存し、デバッグを容易に

---

### ステップ 5：プライベートリポジトリの使用

**理由**

エンタープライズ環境では、スキルは通常プライベートリポジトリにホストされ、CI/CD で SSH を介してアクセスする必要があります。

GitHub Actions で SSH を設定：

```yaml
name: Setup Skills from Private Repo

on:
  push:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH key
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills from private repo
        run: openskills install git@github.com:your-org/private-skills.git -y

      - name: Sync to AGENTS.md
        run: openskills sync -y
```

GitHub リポジトリの **Settings → Secrets and variables → Actions** で `SSH_PRIVATE_KEY` を追加。

**表示されるべき内容**：GitHub Actions がプライベートリポジトリからスキルを正常にインストール。

**説明**：
- Secrets を使用して秘密鍵を保存し、漏洩を回避
- プライベートリポジトリへのアクセスのために SSH を設定
- `openskills install git@github.com:your-org/private-skills.git -y` はプライベートリポジトリからのインストールをサポート

---

### ステップ 6：Docker シナリオ統合

**理由**

Docker イメージビルド時にスキルを自動インストールし、コンテナ起動後にすぐに使用できるようにします。

`Dockerfile` を作成：

```dockerfile
FROM node:20-alpine

WORKDIR /app

# OpenSkills をインストール
RUN npm install -g openskills

# スキルをインストール（非インタラクティブ）
RUN openskills install anthropics/skills -y

# AGENTS.md を同期
RUN openskills sync -y

# アプリケーションコードをコピー
COPY . .

# その他のビルドステップ...
RUN npm install
RUN npm run build

# 起動コマンド
CMD ["node", "dist/index.js"]
```

ビルドして実行：

```bash
# Docker イメージをビルド
docker build -t myapp:latest .

# コンテナを実行
docker run -it --rm myapp:latest sh

# コンテナ内でスキルがインストールされていることを確認
ls -la .claude/skills/
cat AGENTS.md
```

**表示されるべき内容**：コンテナ内にスキルがインストールされ、AGENTS.md が生成されている。

**説明**：
- Docker イメージビルド段階でスキルをインストール
- `RUN openskills install ... -y` を使用して非インタラクティブにインストール
- コンテナ起動後にスキルを手動でインストールする必要がない
- マイクロサービス、Serverless などのシナリオに適している

---

### ステップ 7：環境変数設定

**理由**

環境変数を介してスキルソースを柔軟に設定し、異なる環境で異なるスキルリポジトリを使用します。

`.env.ci` ファイルを作成：

```bash
# CI/CD 環境設定
SKILLS_SOURCE=anthropics/skills
SKILLS_INSTALL_FLAGS=-y
SYNC_FLAGS=-y
```

CI/CD スクリプトで使用：

```bash
#!/bin/bash
# .github/scripts/setup-skills.sh

set -e

# 環境変数をロード
if [ -f .env.ci ]; then
  export $(cat .env.ci | grep -v '^#' | xargs)
fi

echo "Installing skills from: $SKILLS_SOURCE"
npx openskills install $SKILLS_SOURCE $SKILLS_INSTALL_FLAGS

echo "Syncing to AGENTS.md"
npx openskills sync $SYNC_FLAGS

echo "✅ Skills setup completed"
```

GitHub Actions で呼び出し：

```yaml
- name: Setup skills
  run: .github/scripts/setup-skills.sh
```

**表示されるべき内容**：スクリプトが環境変数に基づいてスキルソースとフラグを自動的に設定。

**説明**：
- 環境変数を介してスキルソースを柔軟に設定
- 異なる環境（開発、テスト、本番）で異なる `.env` ファイルを使用可能
- CI/CD 設定の保守性を維持

---

## チェックポイント ✅

以下のチェックを完了し、本レッスンの内容を習得したことを確認：

- [ ] 非インタラクティブモードの用途と特徴を理解
- [ ] `-y` フラグを使用して非インタラクティブインストールができる
- [ ] `-y` フラグを使用して非インタラクティブ同期ができる
- [ ] インタラクティブと非インタラクティブの違いを理解
- [ ] GitHub Actions で OpenSkills を統合できる
- [ ] Docker イメージビルド時にスキルをインストールできる
- [ ] CI/CD でプライベートリポジトリを処理する方法を知っている
- [ ] 環境変数設定のベストプラクティスを理解

---

## よくある落とし穴

### よくあるエラー 1：-y フラグの追加を忘れる

**エラーシナリオ**：GitHub Actions で `-y` フラグを使用するのを忘れる

```yaml
# ❌ エラー：-y フラグを忘れる
- name: Install skills
  run: openskills install anthropics/skills
```

**問題**：
- CI 環境にはインタラクティブターミナル（TTY）がない
- コマンドはユーザー入力を待ち、ワークフローがタイムアウトして失敗
- エラーメッセージは明確でない可能性がある

**正しい方法**：

```yaml
# ✅ 正しい：-y フラグを使用
- name: Install skills
  run: openskills install anthropics/skills -y
```

---

### よくあるエラー 2：スキル上書きによる設定の損失

**エラーシナリオ**：CI/CD が毎回スキルを上書きし、ローカル設定が損失

```bash
# CI/CD でグローバルディレクトリにスキルをインストール
openskills install anthropics/skills --global -y

# ローカルユーザーがプロジェクトディレクトリにインストールし、グローバルで上書き
```

**問題**：
- グローバルにインストールされたスキルの優先度はプロジェクトローカルより低い
- CI/CD とローカルのインストール場所が一致せず、混乱を招く
- ローカルユーザーが慎重に設定したスキルを上書きする可能性がある

**正しい方法**：

```bash
# 方案 1：CI/CD とローカル両方でプロジェクトインストールを使用
openskills install anthropics/skills -y

# 方案 2：Universal モードを使用して競合を回避
openskills install anthropics/skills --universal -y

# 方案 3：CI/CD で専用ディレクトリを使用（カスタム出力パス）
openskills install anthropics/skills -y
openskills sync -o .agents-md/AGENTS.md -y
```

---

### よくあるエラー 3：Git アクセス権限不足

**エラーシナリオ**：プライベートリポジトリからスキルをインストールする際に SSH キーを設定しない

```yaml
# ❌ エラー：SSH キーを設定しない
- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

**問題**：
- CI 環境はプライベートリポジトリにアクセスできない
- エラーメッセージ：`Permission denied (publickey)`
- クローンに失敗し、ワークフローが失敗

**正しい方法**：

```yaml
# ✅ 正しい：SSH キーを設定
- name: Setup SSH key
  env:
    SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts

- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

---

### よくあるエラー 4：Docker イメージが大きすぎる

**エラーシナリオ**：Dockerfile でスキルをインストールするとイメージサイズが大きくなる

```dockerfile
# ❌ エラー：毎回再クローンとインストール
RUN openskills install anthropics/skills -y
```

**問題**：
- ビルドのたびに GitHub からリポジトリをクローン
- ビルド時間とイメージサイズが増加
- ネットワーク問題により失敗する可能性がある

**正しい方法**：

```dockerfile
# ✅ 正しい：マルチステージビルドとキャッシュを使用
FROM node:20-alpine AS skills-builder

RUN npm install -g openskills
RUN openskills install anthropics/skills -y
RUN openskills sync -y

# メインイメージ
FROM node:20-alpine

WORKDIR /app

# インストール済みのスキルをコピー
COPY --from=skills-builder ~/.claude /root/.claude
COPY --from=skills-builder /app/AGENTS.md /app/

# アプリケーションコードをコピー
COPY . .

# その他のビルドステップ...
```

---

### よくあるエラー 5：スキルの更新を忘れる

**エラーシナリオ**：CI/CD が毎回古いバージョンのスキルをインストール

```yaml
# ❌ エラー：インストールのみで更新しない
- name: Install skills
  run: openskills install anthropics/skills -y
```

**問題**：
- スキルリポジトリが更新されている可能性がある
- CI/CD でインストールされるスキルバージョンは最新ではない
- 機能の欠如やバグの原因となる可能性がある

**正しい方法**：

```yaml
# ✅ 正しい：先に更新してから同期
- name: Update skills
  run: openskills update -y

- name: Sync to AGENTS.md
  run: openskills sync -y

# または install 時に更新戦略を使用
- name: Install or update skills
  run: |
    openskills install anthropics/skills -y || openskills update -y
```

---

## 本レッスンのまとめ

**核心ポイント**：

1. **非インタラクティブモードは CI/CD に適している**：`-y` フラグを使用してすべてのインタラクティブプロンプトをスキップ
2. **install コマンドの -y フラグ**：見つかったすべてのスキルを自動インストールし、既存のスキルを上書き
3. **sync コマンドの -y フラグ**：すべてのスキルを AGENTS.md に自動同期
4. **GitHub Actions 統合**：ワークフローで非インタラクティブコマンドを使用してスキル管理を自動化
5. **Docker シナリオ**：イメージビルド段階でスキルをインストールし、コンテナ起動後にすぐに使用できるように
6. **プライベートリポジトリアクセス**：SSH キー設定を介してプライベートスキルリポジトリにアクセス
7. **環境変数設定**：環境変数を介してスキルソースとインストールパラメータを柔軟に設定

**決定フロー**：

```
[CI/CD で OpenSkills を使用する必要がある] → [スキルをインストール]
↓
[-y フラグを使用してインタラクションをスキップ]
↓
[AGENTS.md を生成]
↓
[-y フラグを使用してインタラクションをスキップ]
↓
[スキルが正しくインストールされたことを確認]
```

**記憶のコツ**：

- **CI/CD では -y を忘れずに**：非インタラクティブがキー
- **GitHub Actions では SSH を使用**：プライベートリポジトリにはキー設定が必要
- **Docker ビルドでは早めにインストール**：イメージサイズに注意
- **環境変数を適切に設定**：異なる環境を区別

---

## 次のレッスン予告

> 次のレッスンでは **[セキュリティ説明](../security/)** を学習します。
>
> 学習内容：
> - OpenSkills のセキュリティ特性と保護メカニズム
> - パストラバーサル保護の動作原理
> - シンボリックリンクの安全な処理方法
> - YAML 解析のセキュリティ対策
> - 権限管理のベストプラクティス

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの位置を表示</strong></summary>

> 更新日：2026-01-24

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| 非インタラクティブインストール | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L424-L455) | 424-455 |
| 競合検出と上書き | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L521-L550) | 521-550 |
| 非インタラクティブ同期 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| コマンドライン引数定義 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L49) | 49 |
| コマンドライン引数定義 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L65) | 65 |

**重要な定数**：
- `-y, --yes`：インタラクティブ選択をスキップするコマンドラインフラグ

**重要な関数**：
- `warnIfConflict(skillName, targetPath, isProject, skipPrompt)`：スキル競合を検出し、上書きするかどうかを決定
- `installFromRepo()`：リポジトリからスキルをインストール（非インタラクティブモードをサポート）
- `syncAgentsMd()`：スキルを AGENTS.md に同期（非インタラクティブモードをサポート）

**ビジネスルール**：
- `-y` フラグを使用する場合、すべてのインタラクティブプロンプトをスキップ
- スキルが既に存在する場合、非インタラクティブモードは自動的に上書き（`Overwriting: <skill-name>` を表示）
- 非インタラクティブモードはヘッドレス環境（TTY なし）で正常に動作
- `install` および `sync` コマンドは両方とも `-y` フラグをサポート

</details>
