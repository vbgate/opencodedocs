---
title: "カスタムスキル開発ガイド | Agent Skills"
sidebarTitle: "スキル開発"
subtitle: "カスタムスキルの開発"
description: "Claude 向けカスタムスキルの開発方法を学びます。ディレクトリ構造、SKILL.md フォーマット、スクリプト規範、Zip パッケージ化を解説します。"
tags:
  - "スキル開発"
  - "Claude"
  - "AI 補助プログラミング"
  - "カスタム拡張"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# カスタムスキルの開発

## 学習後、できること

この授業を学習すると、以下ができるようになります：

- ✅ 規範に準拠したスキルディレクトリ構造を作成する
- ✅ 完全な `SKILL.md` 定義ファイルを作成する（Front Matter、How It Works、Usage などの章を含む）
- ✅ 規範に準拠した Bash スクリプトを作成する（エラーハンドリング、出力フォーマット、クリーンアップメカニズム）
- ✅ スキルを Zip ファイルにパッケージ化して配布する
- ✅ コンテキスト効率を最適化し、Claude がより正確にスキルを有効にするようにする

## 現在の課題

以下のシナリオに遭遇したことがあるかもしれません：

- ✗ 複雑な操作（特定のプラットフォームへのデプロイ、ログフォーマットの分析など）を頻繁に繰り返しており、毎回 Claude に説明する必要がある
- ✗ Claude がいつその機能を有効にすべきかわからず、同じ指示を繰り返し入力する必要がある
- ✗ チームのベストプラクティスを再利用可能なツールにカプセル化したいが、どこから手をつければいいかわからない
- ✗ 作成したスキルファイルが Claude に無視され、どこが問題かわからない

## 使用タイミング

以下の状況で必要な場合：

- 📦 **繰り返し操作をカプセル化**：頻繁に使用するコマンドシーケンスをワンクリック実行にパッケージ化する
- 🎯 **正確なトリガー**：特定のシナリオで Claude が能動的にスキルを有効にするようにする
- 🏢 **標準化プロセス**：チーム規範（コードチェック、デプロイプロセスなど）を自動化する
- 🚀 **能力の拡張**：Claude が本来サポートしていない機能を追加する

## 🎒 開始前の準備

開始する前に、以下を確認してください：

::: warning 前提条件の確認

- [Agent Skills 入門](../../start/getting-started/) を完了済み
- Agent Skills をインストール済みで、基本使用に精通している
- 基本的なコマンドライン操作（Bash スクリプト）を理解している
- GitHub リポジトリがある（スキルを配布するため）

:::

## コアコンセプト

**Agent Skills の仕組み**：

Claude は起動時にスキルの**名前と説明のみ**を読み込み、関連キーワードを検出したときにのみ完全な `SKILL.md` コンテンツを読み込みます。この**オンデマンドロードメカニズム**により、Token 消費を最小限に抑えることができます。

**スキル開発の 3 つのコア要素**：

1. **ディレクトリ構造**：命名規範に準拠したフォルダレイアウト
2. **SKILL.md**：スキル定義ファイルで、Claude にいつ有効にするか、どう使用するかを伝える
3. **スクリプト**：実際に実行される Bash コードで、具体的な操作を担当する

<!-- ![スキル有効化フロー](/images/advanced/skill-activation-flow.svg) -->
> [画像：スキル有効化フロー]

---

## と一緒にやる：最初のスキルを作成

### ステップ 1：ディレクトリ構造を作成

**理由**
正しいディレクトリ構造は、Claude がスキルを認識できる前提条件です。

`skills/` ディレクトリで新しいスキルを作成します：

```bash
cd skills
mkdir my-custom-skill
cd my-custom-skill
mkdir scripts
```

**ディレクトリ構造は以下の通りです**：

```
skills/
  my-custom-skill/
    SKILL.md           # スキル定義ファイル（必須）
    scripts/
      deploy.sh        # 実行可能スクリプト（必須）
```

**注意**：開発完了後、スキルディレクトリ全体を `my-custom-skill.zip` にパッケージ化して配布する必要があります（詳細は後述の「スキルのパッケージ化」セクション）

**表示されるもの**：
- `my-custom-skill/` は kebab-case 命名（小文字とハイフン）
- `SKILL.md` ファイル名はすべて大文字、正確に一致する必要があります
- `scripts/` ディレクトリは実行可能スクリプトを格納します

### ステップ 2：SKILL.md を作成

**理由**
`SKILL.md` はスキルのコアで、スキルのトリガー条件、使用方法、出力フォーマットを定義します。

`SKILL.md` ファイルを作成します：

```markdown
---
name: my-custom-skill
description: Deploy my app to custom platform. Use when user says "deploy", "production", or "custom deploy".
---

# Custom Deployment Skill

Deploy your application to a custom platform with zero-config setup.

## How It Works

1. Detect the framework from `package.json` (Next.js, Vue, Svelte, etc.)
2. Create a tarball of the project (excluding `node_modules` and `.git`)
3. Upload to the deployment API
4. Return preview URL and deployment ID

## Usage

```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh [path]
```

**Arguments:**
- `path` - Directory path or .tgz file to deploy (defaults to current directory)

**Examples:**

Deploy current directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh .
```

Deploy specific directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh ./my-app
```

## Output

You'll see:

```
✓ Deployed to https://my-app-abc123.custom-platform.io
✓ Deployment ID: deploy_12345
✓ Claim URL: https://custom-platform.io/claim?code=...
```

JSON format (for machine-readable output):
```json
{
  "previewUrl": "https://my-app-abc123.custom-platform.io",
  "deploymentId": "deploy_12345",
  "claimUrl": "https://custom-platform.io/claim?code=..."
}
```

## Present Results to User

When presenting results to the user, use this format:

```
🎉 Deployment successful!

**Preview URL**: https://my-app-abc123.custom-platform.io

To transfer ownership:
1. Visit the claim URL
2. Sign in to your account
3. Confirm the transfer

**Deployment ID**: deploy_12345
```

## Troubleshooting

**Network Error**
- Check your internet connection
- Verify the deployment API is accessible

**Permission Error**
- Ensure the directory is readable
- Check file permissions on the script

**Framework Not Detected**
- Ensure `package.json` exists in the project root
- Verify the framework is supported
```

**表示されるもの**：
- Front Matter に `name` と `description` フィールドが含まれている
- `description` にトリガーキーワード（"deploy", "production" など）が含まれている
- `How It Works`、`Usage`、`Output`、`Present Results to User`、`Troubleshooting` などの章が含まれている

### ステップ 3：Bash スクリプトを作成

**理由**
スクリプトは実際に操作を実行する部分で、Claude の入出力仕様に準拠する必要があります。

`scripts/deploy.sh` を作成します：

```bash
#!/bin/bash
set -e  # エラー発生時即時終了

# 設定
DEPLOY_API="${DEPLOY_API:-https://deploy.example.com/api}"

# 引数の解析
INPUT_PATH="${1:-.}"

# クリーンアップ関数
cleanup() {
  if [ -n "$TEMP_TARBALL" ] && [ -f "$TEMP_TARBALL" ]; then
    rm -f "$TEMP_TARBALL" >&2 || true
  fi
}
trap cleanup EXIT

# フレームワークの検出
detect_framework() {
  local path="$1"
  local framework=""

  if [ -f "${path}/package.json" ]; then
    if grep -q '"next"' "${path}/package.json"; then
      framework="nextjs"
    elif grep -q '"vue"' "${path}/package.json"; then
      framework="vue"
    elif grep -q '"@sveltejs/kit"' "${path}/package.json"; then
      framework="sveltekit"
    fi
  fi

  echo "$framework"
}

# メインフロー
FRAMEWORK=$(detect_framework "$INPUT_PATH")
echo "Detected framework: ${FRAMEWORK:-unknown}" >&2

# tarball の作成
TEMP_TARBALL=$(mktemp -t deploy-XXXXXX.tgz)
echo "Creating tarball..." >&2
tar -czf "$TEMP_TARBALL" \
  --exclude='node_modules' \
  --exclude='.git' \
  -C "$INPUT_PATH" . >&2 || true

# アップロード
echo "Uploading..." >&2
RESULT=$(curl -s -X POST "$DEPLOY_API" \
  -F "file=@$TEMP_TARBALL" \
  -F "framework=$FRAMEWORK")

# エラーのチェック
if echo "$RESULT" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESULT" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Deployment failed: $ERROR_MSG" >&2
  exit 1
fi

# 結果の出力
echo "$RESULT"
echo "Deployment completed successfully" >&2
```

**表示されるもの**：
- スクリプトは `#!/bin/bash` shebang を使用している
- `set -e` を使用してエラーハンドリングを行っている
- ステータスメッセージは stderr（`>&2`）に出力されている
- マシン可読出力（JSON）は stdout に出力されている
- クリーンアップ trap が含まれている
### ステップ 4：実行権限を設定

```bash
chmod +x scripts/deploy.sh
```

**表示されるもの**：
- スクリプトが実行可能ファイルになる（`ls -l scripts/deploy.sh` に `-rwxr-xr-x` と表示）

### ステップ 5：スキルをテスト

Claude Code でスキルをテストします：

```bash
# スキルを有効に
"Activate my-custom-skill"

# デプロイをトリガー
"Deploy my current directory using my-custom-skill"
```

**表示されるもの**：
- Claude がスキルを有効にした
- `deploy.sh` スクリプトを実行した
- デプロイ結果（previewUrl と deploymentId を含む）を出力した

---

## チェックポイント ✅

スキルが仕様に準拠しているか確認してください：

- [ ] ディレクトリ名は kebab-case（`my-custom-skill` など）
- [ ] `SKILL.md` ファイル名はすべて大文字、誤りなし
- [ ] Front Matter に `name` と `description` フィールドが含まれている
- [ ] `description` にトリガーキーワードが含まれている
- [ ] スクリプトは `#!/bin/bash` shebang を使用している
- [ ] スクリプトは `set -e` でエラーハンドリングを行っている
- [ ] ステータスメッセージは stderr（`>&2`）に出力されている
- [ ] JSON は stdout に出力されている
- [ ] スクリプトにクリーンアップ trap が含まれている

---

## 注意点

### 問題 1：スキルが有効にならない

**症状**：「Deploy my app」と言ったが、Claude がスキルを有効にしない。

**原因**：`description` にトリガーキーワードが含まれていない。

**解決策**：
```markdown
# ❌ 間違い
description: A tool for deploying applications

# ✅ 正しい
description: Deploy my app to production. Use when user says "deploy", "production", or "push to live".
```

### 問題 2：スクリプト出力が混乱している

**症状**：Claude が JSON 出力を解析できない。

**原因**：ステータスメッセージと JSON 出力が混ざっている。

**解決策**：
```bash
# ❌ 間違い：すべてを stdout に出力
echo "Creating tarball..."
echo '{"previewUrl": "..."}'

# ✅ 正しい：ステータスメッセージを stderr に
echo "Creating tarball..." >&2
echo '{"previewUrl": "..."}'
```

### 問題 3：一時ファイルがクリーンアップされていない

**症状**：ディスクスペースが徐々に占められている。

**原因**：スクリプト終了時に一時ファイルがクリーンアップされていない。

**解決策**：
```bash
# ✅ 正しい：クリーンアップ trap を使用
cleanup() {
  rm -f "$TEMP_TARBALL" >&2 || true
}
trap cleanup EXIT
```

### 問題 4：SKILL.md が長すぎる

**症状**：スキルがコンテキストを大量に占め、パフォーマンスに影響している。

**原因**：`SKILL.md` が 500 行を超えている。

**解決策**：
- 詳細な参考ドキュメントを別ファイルにする
- 漸進的開示（Progressive Disclosure）を使用する
- インラインコードよりもスクリプトを優先する

---

## この授業のまとめ

**コアポイント**：

1. **ディレクトリ構造**：kebab-case、`SKILL.md` と `scripts/` ディレクトリを含む
2. **SKILL.md フォーマット**：Front Matter + How It Works + Usage + Output + Present Results to User + Troubleshooting
3. **スクリプト仕様**：`#!/bin/bash`、`set -e`、stderr にステータス出力、stdout に JSON 出力、クリーンアップ trap
4. **コンテキスト効率**：`SKILL.md` < 500 行、漸進的開示、スクリプト優先
5. **パッケージ化配布**：`zip -r` コマンドで `{skill-name}.zip` にパッケージ化

**ベストプラクティスの口訣**：

> 説明は具体的、トリガーは明確
> ステータスは stderr、JSON は stdout
> trap を忘れず、一時ファイルをクリーン
> ファイルは長すぎず、スクリプトがスペースを取る

---

## 次の授業の予告

> 次の授業では **[React ベストプラクティスルールの作成](../rule-authoring/)** を学びます。
>
> 学べること：
> - 規範に準拠したルールファイルを作成する方法
> - `_template.md` テンプレートを使用してルールを生成する
> - impact レベルと tags を定義する
> - Incorrect/Correct コード例の対比を作成する
> - 参考文献を追加し、ルールを検証する

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能               | ファイルパス                                                                                       | 行番号   |
|--- | --- | ---|
| スキル開発規範       | [`AGENTS.md:9-69`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L9-L69)     | 9-69   |
| ディレクトリ構造定義   | [`AGENTS.md:11-20`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20)   | 11-20  |
| 命名約束           | [`AGENTS.md:22-27`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L22-L27)   | 22-27  |
| SKILL.md フォーマット | [`AGENTS.md:29-68`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68)   | 29-68  |
| コンテキスト効率ベストプラクティス | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78)   | 70-78  |
| スクリプト要件       | [`AGENTS.md:80-87`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L80-L87)   | 80-87  |
| Zip パッケージ化     | [`AGENTS.md:89-96`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L89-L96)   | 89-96  |
| ユーザーインストール方法   | [`AGENTS.md:98-110`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L110) | 98-110 |

**重要な定数**：
- `SKILL.md` ファイル名：すべて大文字、正確に一致する必要があります
- `/mnt/skills/user/{skill-name}/scripts/{script}.sh`：スクリプトパスフォーマット

**重要な関数**：
- スクリプトクリーンアップ関数 `cleanup()`：一時ファイルを削除するために使用
- フレームワーク検出関数 `detect_framework()`：package.json からフレームワークタイプを推測する

</details>
