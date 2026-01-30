---
title: "Agent Skills ビルドツールチェーン：検証、ビルド、CI 連携 | Agent Skills チュートリアル"
sidebarTitle: "検証ルールの自動ビルド"
subtitle: "ビルドツールチェーンの使用"
description: "Agent Skills ビルドツールチェーンの使い方を学びます。pnpm validate によるルール整合性検証、pnpm build による AGENTS.md と test-cases.json 生成、pnpm dev による開発フロー、GitHub Actions CI 連携設定、テストケース抽出、LLM 自動評価を含みます。このチュートリアルではルール管理、自動検証フロー、継続的インテグレーション、テストケース抽出、ビルドシステム保守、ルール品質保証を教えます。"
tags:
  - "ビルドツール"
  - "CI/CD"
  - "自動化"
  - "コード検証"
order: 80
prerequisite:
  - "start-getting-started"
  - "start-installation"
  - "advanced-rule-authoring"
---

# ビルドツールチェーンの使用

## 学習後の到達目標

このレッスンを修了すると、以下のことができるようになります：

- ✅ `pnpm validate` を使用してルールファイルの形式と整合性を検証する
- ✅ `pnpm build` を使用して AGENTS.md と test-cases.json を生成する
- ✅ ビルドフローを理解する：parse → validate → group → sort → generate
- ✅ GitHub Actions CI 自動検証とビルドを設定する
- ✅ LLM 自動評価用のテストケースを抽出する
- ✅ `pnpm dev` を使用した高速開発フロー（build + validate）を行う

## 現在の課題

React ルールライブラリの保守や拡張で、以下の問題に直面したことはありませんか？

- ✗ ルールを変更した後、形式検証を忘れて、生成された AGENTS.md にエラーが発生する
- ✗ ルールファイルが増え続け、各ファイルの整合性を手動で確認するのに時間がかかる
- ✗ コードをコミットしてから、あるルールにコード例が欠けていることに気づき、PR レビューの効率が下がる
- ✗ CI で自動的にルールを検証したいが、GitHub Actions の設定方法がわからない
- ✗ `build.ts` のビルドフローが明確でなく、エラーが発生した際にどこから調査すべきかわからない

## この方法を使うタイミング

以下の状況でこの方法を使用します：

- 🔍 **ルール検証**：コードをコミットする前に、すべてのルールファイルが規格に準拠していることを確認する
- 🏗️ **ドキュメント生成**：Markdown ルールファイルから構造化された AGENTS.md を生成する
- 🤖 **テストケース抽出**：LLM 自動評価用のテストデータを準備する
- 🔄 **CI 連携**：GitHub Actions で自動検証とビルドを行う
- 🚀 **高速開発**：`pnpm dev` を使用してルールの高速イテレーションと検証を行う

## 🎒 事前準備

始める前に、以下を確認してください：

::: warning 事前チェック

- [Agent Skills 入門](../../start/getting-started/) を修了済み
- Agent Skills をインストール済みで、基本的な使い方を理解している
- React ルール作成規格を理解している（先に [React ベストプラクティスルールの作成](../rule-authoring/) を学ぶことを推奨）
- 基本的なコマンドライン操作経験がある
- pnpm パッケージマネージャーの基本的な使い方を理解している

:::

## コア概念

**ビルドツールチェーンの役割**：

Agent Skills のルールライブラリは本質的に 57 個の独立した Markdown ファイルですが、Claude は構造化された AGENTS.md がないと効率的に使用できません。ビルドツールチェーンは以下を担当します：

1. **ルールファイルの解析**：Markdown から title、impact、examples などのフィールドを抽出する
2. **整合性検証**：各ルールに title、explanation、コード例が含まれているか確認する
3. **グループ化とソート**：チャプターでグループ化し、タイトルのアルファベット順でソートし、ID（1.1、1.2...）を割り当てる
4. **ドキュメント生成**：フォーマットされた AGENTS.md と test-cases.json を出力する

**ビルドフロー**：

```
rules/*.md (57 個のファイル)
    ↓
[parser.ts] Markdown の解析
    ↓
[validate.ts] 整合性の検証
    ↓
[build.ts] グループ化 → ソート → AGENTS.md の生成
    ↓
[extract-tests.ts] テストケースの抽出 → test-cases.json
```

**4 つのコアコマンド**：

| コマンド                 | 機能                              | 使用シーン             |
|--- | --- | ---|
| `pnpm validate`      | すべてのルールファイルの形式と整合性を検証する    | コミット前チェック、CI 検証  |
| `pnpm build`         | AGENTS.md と test-cases.json を生成する | ルール変更後、リリース前   |
| `pnpm dev`           | build + validate を実行（開発フロー） | 高速イテレーション、新規ルール開発 |
| `pnpm extract-tests` | テストケースのみを抽出（再ビルドなし）    | テストデータのみを更新する場合     |

---

## 実践：ビルドツールチェーンの使用

### ステップ 1：ルールの検証（pnpm validate）

**なぜ必要か**
ルールを開発または変更する際、まずすべてのルールファイルが規格に準拠していることを確認し、ビルド時にエラーが発生しないようにします。

ビルドツールディレクトリに移動します：

```bash
cd packages/react-best-practices-build
```

検証コマンドを実行します：

```bash
pnpm validate
```

**以下が表示されるはずです**：

```bash
Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**エラーがある場合**：

```bash
✗ Validation failed:

  async-parallel.md: Missing or empty title
  bundle-dynamic-imports.md: Missing code examples
  rerender-memo.md: Invalid impact level: SUPER_HIGH
```

**検証内容**（ソースコード：`validate.ts`）：

- ✅ title が空でない
- ✅ explanation が空でない
- ✅ 少なくとも 1 つのコード例が含まれている
- ✅ 少なくとも 1 つの「Incorrect/bad」または「Correct/good」例が含まれている
- ✅ impact レベルが有効（CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW）

### ステップ 2：ドキュメントのビルド（pnpm build）

**なぜ必要か**
ルールファイルから Claude が使用する AGENTS.md と test-cases.json を生成します。

ビルドコマンドを実行します：

```bash
pnpm build
```

**以下が表示されるはずです**：

```bash
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules
```

**生成されるファイル**：

1. **AGENTS.md**（`skills/react-best-practices/AGENTS.md` に配置）
   - 構造化された React パフォーマンス最適化ガイド
   - 8 つのチャプター、57 個のルールを含む
   - impact レベルでソート（CRITICAL → HIGH → MEDIUM...）

2. **test-cases.json**（`packages/react-best-practices-build/test-cases.json` に配置）
   - すべてのルールから抽出されたテストケース
   - bad と good の例を含む
   - LLM 自動評価に使用

**AGENTS.md 構造の例**：

```markdown
# React Best Practices

Version 1.0
Vercel Engineering
January 2026

---

## Abstract

Performance optimization guide for React and Next.js applications, ordered by impact.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
    - 1.1 [Parallel async operations](#11-parallel-async-operations)
    - 1.2 [Deferring non-critical async operations](#12-deferring-non-critical-async-outputs)

2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
    - 2.1 [Dynamic imports for large components](#21-dynamic-imports-for-large-components)

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Eliminating request waterfalls is the most impactful performance optimization you can make in React and Next.js applications.

### 1.1 Parallel async operations

**Impact: CRITICAL**

...

**Incorrect:**

```typescript
// Sequential fetching creates waterfalls
const userData = await fetch('/api/user').then(r => r.json())
const postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())
```

**Correct:**

```typescript
// Fetch in parallel
const [userData, postsData] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
])
```
```

**test-cases.json 構造の例**：

```json
[
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "bad",
    "code": "// Sequential fetching creates waterfalls\nconst userData = await fetch('/api/user').then(r => r.json())\nconst postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())",
    "language": "typescript",
    "description": "Incorrect example for Parallel async operations"
  },
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "good",
    "code": "// Fetch in parallel\nconst [userData, postsData] = await Promise.all([\n  fetch('/api/user').then(r => r.json()),\n  fetch('/api/posts').then(r => r.json())\n])",
    "language": "typescript",
    "description": "Correct example for Parallel async operations"
  }
]
```

### ステップ 3：開発フロー（pnpm dev）

**なぜ必要か**
新規ルールの開発や既存ルールの変更時に、高速イテレーション、検証、ビルドの全プロセスを行う必要があります。

開発コマンドを実行します：

```bash
pnpm dev
```

**このコマンドは以下を実行します**：

1. `pnpm build-agents` の実行（AGENTS.md の生成）
2. `pnpm extract-tests` の実行（test-cases.json の生成）
3. `pnpm validate` の実行（すべてのルールの検証）

**以下が表示されるはずです**：

```bash
pnpm build-agents && pnpm extract-tests
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules

Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57

Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**開発フローの推奨手順**：

```bash
# 1. ルールファイルを変更または作成
vim skills/react-best-practices/rules/my-new-rule.md

# 2. pnpm dev を実行して高速検証とビルド
cd packages/react-best-practices-build
pnpm dev

# 3. 生成された AGENTS.md を確認
cat ../skills/react-best-practices/AGENTS.md

# 4. Claude が新しいルールを正しく使用するかテスト
# （Claude Code でスキルを有効化してテスト）
```

**バージョン番号のアップグレード**（オプション）：

```bash
pnpm build --upgrade-version
```

これにより自動的に以下が行われます：
- `metadata.json` のバージョン番号をインクリメント（例：1.0 → 1.1）
- `SKILL.md` Front Matter の version フィールドを更新

**以下が表示されるはずです**：

```bash
Upgrading version: 1.0 -> 1.1
✓ Updated metadata.json
✓ Updated SKILL.md
```

### ステップ 4：テストケースのみの抽出（pnpm extract-tests）

**なぜ必要か**
テストデータの抽出ロジックのみを更新し、AGENTS.md を再ビルドする必要がない場合、`extract-tests` のみを実行できます。

```bash
pnpm extract-tests
```

**以下が表示されるはずです**：

```bash
Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57
```

---

## チェックポイント ✅

ビルドツールチェーンを理解できたか確認してください：

- [ ] `pnpm validate` がルールのどのフィールドを検証するかわかる
- [ ] `pnpm build` がどのファイルを生成するかわかる
- [ ] `pnpm dev` の開発フローを理解している
- [ ] test-cases.json の用途を理解している
- [ ] バージョン番号のアップグレード方法（`--upgrade-version`）を理解している
- [ ] AGENTS.md の構造（チャプター → ルール → 例）を理解している

---

## GitHub Actions CI 連携

### CI が必要な理由

チーム開発において、CI は以下を実現できます：
- ✅ ルールファイル形式の自動検証
- ✅ AGENTS.md の自動ビルド
- ✅ 規格に準拠しないコードのコミット防止

### CI 設定ファイル

GitHub Actions 設定は `.github/workflows/react-best-practices-ci.yml` にあります：

```yaml
name: React Best Practices CI

on:
  push:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'
  pull_request:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/react-best-practices-build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10.24.0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          cache-dependency-path: packages/react-best-practices-build/pnpm-lock.yaml
      - run: pnpm install
      - run: pnpm validate
      - run: pnpm build
```

### CI トリガー条件

CI は以下の状況で自動的に実行されます：

| イベント           | 条件                                                                                                      |
|--- | ---|
| `push`         | `main` ブランチへのコミットで、`skills/react-best-practices/**` または `packages/react-best-practices-build/**` を変更した場合 |
| `pull_request` | `main` ブランチへの PR 作成または更新で、上記のパスを変更した場合                                                            |

### CI 実行手順

1. **コードのチェックアウト**：`actions/checkout@v4`
2. **pnpm のインストール**：`pnpm/action-setup@v2`（version 10.24.0）
3. **Node.js のインストール**：`actions/setup-node@v4`（version 20）
4. **依存関係のインストール**：`pnpm install`（pnpm キャッシュを使用して高速化）
5. **ルールの検証**：`pnpm validate`
6. **ドキュメントのビルド**：`pnpm build`

いずれかの手順が失敗すると、CI は ❌ とマークされ、マージが阻止されます。

---

## トラブルシューティング

### 問題 1：検証は通るがビルドが失敗する

**症状**：`pnpm validate` は通るが、`pnpm build` でエラーが発生する。

**原因**：検証はルールファイルの形式のみをチェックし、`_sections.md` または `metadata.json` はチェックしない。

**解決策**：
```bash
# _sections.md が存在するか確認
ls skills/react-best-practices/rules/_sections.md

# metadata.json が存在するか確認
ls skills/react-best-practices/metadata.json

# ビルドログの詳細なエラーを確認
pnpm build 2>&1 | grep -i error
```

### 問題 2：ルール ID が連続していない

**症状**：生成された AGENTS.md でルール ID が飛んでいる（例：1.1、1.3、1.5）。

**原因**：ルールはタイトルのアルファベット順でソートされ、ファイル名順ではない。

**解決策**：
```bash
# ビルドは自動的にタイトルでソートして ID を割り当てます
# カスタム順序が必要な場合は、ルールのタイトルを変更してください
# 例：「A. Parallel」（A で始まると先頭に来る）
pnpm build
```

### 問題 3：test-cases.json に bad 例しかない

**症状**：`pnpm extract-tests` で「Bad examples: 0」と出力される。

**原因**：ルールファイルの例ラベルが規格に準拠していない。

**解決策**：
```markdown
# ❌ 誤り：ラベルが規格外
**Example:**

**Typo:**

# ✅ 正しい：Incorrect または Correct を使用
**Incorrect:**

**Correct:**

# または bad/good ラベルを使用（wrong、usage もサポート）
**Bad example:**

**Good example:**
```

### 問題 4：CI で pnpm validate が失敗する

**症状**：ローカルの `pnpm validate` は通るが、CI で失敗する。

**原因**：
- Node.js バージョン不一致（CI は v20、ローカルは他のバージョンを使用中の可能性）
- pnpm バージョン不一致（CI は 10.24.0）
- Windows と Linux の改行コードの違い

**解決策**：
```bash
# ローカルの Node バージョンを確認
node --version  # v20.x である必要があります

# ローカルの pnpm バージョンを確認
pnpm --version  # >= 10.24.0 である必要があります

# 改行コードを統一（LF に変換）
git config core.autocrlf input
git add --renormalize .
git commit -m "Fix line endings"
```

### 問題 5：バージョン番号アップグレード後に SKILL.md が更新されない

**症状**：`pnpm build --upgrade-version` 後、`metadata.json` のバージョン番号は変わったが、`SKILL.md` は変わっていない。

**原因**：SKILL.md Front Matter の version フォーマットが一致しない。

**解決策**：
```yaml
# SKILL.md Front Matter を確認
---
version: "1.0"  # ✅ 二重引用符が必要
---

# バージョン番号に引用符がない場合、手動で追加
---
version: 1.0   # ❌ 誤り
version: "1.0" # ✅ 正しい（二重引用符を追加）
---
```

---

## レッスンまとめ

**コアポイント**：

1. **検証（validate）**：ルールの形式、整合性、impact レベルをチェックする
2. **ビルド（build）**：ルールを解析 → グループ化 → ソート → AGENTS.md を生成する
3. **テスト抽出（extract-tests）**：examples から bad/good 例を抽出する
4. **開発フロー（dev）**：`validate + build + extract-tests` で高速イテレーションを行う
5. **CI 連携**：GitHub Actions で自動検証とビルドを行い、間違ったコードのコミットを防ぐ

**開発ワークフロー**：

```
ルールの変更/作成
    ↓
pnpm dev（検証 + ビルド + テスト抽出）
    ↓
AGENTS.md と test-cases.json を確認
    ↓
コードをコミット → CI が自動的に実行
    ↓
PR レビュー → main にマージ
```

**ベストプラクティスの口诀**：

> 変更前に検証、ビルドしてからコミット
> dev コマンドで全プロセス、ワンステップで効率化
> CI が自動的にチェック、PR レビューがさらに簡単に
> バージョン番号をアップグレード、metadata の更新を忘れずに

---

## 次回のレッスン

> 次回は **[トラブルシューティング](../../faq/troubleshooting/)** を学習します。
>
> 学習内容：
> - デプロイ時のネットワークエラー（Network Egress Error）の解決
> - スキルが有効化されない問題の処理
> - ルール検証失敗（VALIDATION_ERROR）のトラブルシューティング
> - フレームワーク検出精度の問題修正
> - ファイル権限問題の解決

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-25

| 機能                  | ファイルパス                                                                                                                                                                     | 行番号    |
|--- | --- | ---|
| package.json スクリプト定義 | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json)                 | 6-12    |
| ビルドエントリ関数          | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)                 | 131-290 |
| ルールパーサー            | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts)               | 全文    |
| ルール検証関数          | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)           | 21-66   |
| テストケース抽出          | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts) | 15-38   |
| パス設定              | [`packages/react-best-practices-build/src/config.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/config.ts)               | 全文    |
| GitHub Actions CI     | [`.github/workflows/react-best-practices-ci.yml`](https://github.com/vercel-labs/agent-skills/blob/main/.github/workflows/react-best-practices-ci.yml)                       | 全文    |
| ルールファイルテンプレート          | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md)                     | 全文    |

**重要な定数** (`config.ts`)：
- `RULES_DIR`: ルールファイルディレクトリパス
- `METADATA_FILE`: メタデータファイル（metadata.json）パス
- `OUTPUT_FILE`: AGENTS.md 出力パス
- `TEST_CASES_FILE`: テストケース JSON 出力パス

**重要な関数**：
- `build()`: メインビルド関数、ルールを解析 → グループ化 → ソート → ドキュメントを生成
- `validateRule()`: 個別ルールの整合性を検証（title、explanation、examples、impact）
- `extractTestCases()`: ルールの examples から bad/good テストケースを抽出
- `generateMarkdown()`: Section 配列から AGENTS.md コンテンツを生成

**検証ルール** (`validate.ts:21-66`)：
- title が空でない
- explanation が空でない
- 少なくとも 1 つのコード例が含まれている
- 少なくとも 1 つの「Incorrect/bad」または「Correct/good」例が含まれている
- impact レベルが有効

**CI ワークフロー**：
- トリガー条件：main への push/PR、かつ `skills/react-best-practices/**` または `packages/react-best-practices-build/**` を変更
- 実行手順：checkout → pnpm インストール → Node.js インストール → pnpm install → pnpm validate → pnpm build

</details>
