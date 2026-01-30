---
title: "スキル作成: SKILL.md の書き方 | openskills"
sidebarTitle: "スキルを書く"
subtitle: "スキル作成: SKILL.md の書き方"
description: "カスタムスキルをゼロから作成する方法、SKILL.md 形式と YAML frontmatter 規約を習得。完全なサンプルとシンボリックリンクによる開発フローを通じて、Anthropic 標準に準拠したスキル作成をすぐに開始できます。"
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "start-quick-start"
  - "start-first-skill"
order: 4
---

# カスタムスキルの作成

## このレッスンで学べること

- ゼロから完全な SKILL.md スキルファイルを作成する
- Anthropic 標準に準拠した YAML frontmatter を記述する
- 適切なスキルディレクトリ構造を設計する（references/、scripts/、assets/）
- シンボリックリンクを使用してローカル開発とイテレーションを行う
- `openskills` コマンドでカスタムスキルをインストール・検証する

## あなたが直面している課題

特定の問題を解決してほしくて AI エージェントに頼みたいのに、既存のスキルライブラリに適切なソリューションがない。会話で何度もニーズを説明してみたが、AI は覚えていなかったり、不完全に実行したりする。専門知識を**カプセル化**して、AI エージェントが確実かつ信頼性を持って再利用できるようにする方法が必要だ。

## この手法を使うべき場面

- **ワークフローのカプセル化**: 繰り返し行う操作手順をスキルとして書き、AI に一度で実行させる
- **チーム知識の蓄積**: チーム内の規約、API ドキュメント、スクリプトをスキルとしてパッケージ化し、全メンバーと共有する
- **ツール統合**: 特定のツール（PDF 処理、データクレンジング、デプロイフローなど）専用のスキルを作成する
- **ローカル開発**: 開発中にスキルをリアルタイムで変更・テストし、繰り返しインストールする必要なくする

## 🎒 始める前の準備

::: warning 前提条件の確認

始める前に、以下を確認してください：

- ✅ [OpenSkills](/start/installation/) がインストールされている
- ✅ スキルを 1 つ以上インストール・同期したことがある（基本的なフローを理解している）
- ✅ Markdown の基礎的な文法に精通している

:::

## 核心となる考え方

### SKILL.md とは？

**SKILL.md** は Anthropic スキルシステムの標準形式で、YAML frontmatter でスキルのメタデータを記述し、Markdown 本文で実行指示を提供します。3 つの核心となる利点があります：

1. **統一された形式** - すべてのエージェント（Claude Code、Cursor、Windsurf など）が同じスキル記述を使用
2. **漸進的ロード** - 必要なときだけ完全な内容をロードし、AI のコンテキストを簡潔に保つ
3. **リソースのパッケージ化** - references/、scripts/、assets/ という 3 種類の付加リソースをサポート

### 最小構成 vs 完全構成

**最小構成**（シンプルなスキルに適する）：
```
my-skill/
└── SKILL.md          # 1 つのファイルのみ
```

**完全構成**（複雑なスキルに適する）：
```
my-skill/
├── SKILL.md          # 核心指令（< 5000 ワード）
├── references/       # 詳細ドキュメント（オンデマンドロード）
│   └── api-docs.md
├── scripts/          # 実行可能スクリプト
│   └── helper.py
└── assets/           # テンプレートと出力ファイル
    └── template.json
```

::: info 完全構成を使うべき場面は？

- **references/**：API ドキュメント、データベーススキーマ、詳細ガイドが 5000 ワードを超える場合
- **scripts/**：決定論的で繰り返し可能なタスクを実行する必要がある場合（データ変換、フォーマットなど）
- **assets/**：テンプレート、画像、ボイラープレートコードを出力する必要がある場合

:::

## 実践してみよう

### ステップ 1：スキルディレクトリの作成

**理由**：スキルファイルを整理するための独立したディレクトリを作成する

```bash
mkdir my-skill
cd my-skill
```

**確認すべきこと**：現在のディレクトリが空である

---

### ステップ 2：SKILL.md 核心構造の作成

**理由**：SKILL.md は YAML frontmatter で始まり、スキルのメタデータを定義する必要がある

`SKILL.md` ファイルを作成：

```markdown
---
name: my-skill                    # 必須：ハイフン形式の識別子
description: When to use this skill.  # 必須：1-2 文、三人称
---

# スキルタイトル

スキルの詳細な説明。
```

**検証ポイント**：

- ✅ 1 行目は `---`
- ✅ `name` フィールドを含む（ハイフン形式、例：`pdf-editor`、`api-client`）
- ✅ `description` フィールドを含む（1-2 文、三人称）
- ✅ YAML 終了後に再び `---` を使用

::: danger よくある間違い

| 間違いの例 | 修正方法 |
|--- | ---|
| `name: My Skill`（スペースあり） | `name: my-skill`（ハイフン）に変更 |
| `description: You should use this for...`（二人称） | `description: Use this skill for...`（三人称）に変更 |
| |--- | ---|
| `description` が長すぎる（100 ワード超） | 1-2 文の概要に簡潔化 |

:::

---

### ステップ 3：指示内容の作成

**理由**：指示は AI エージェントにタスクの実行方法を伝え、必ず imperative/infinitive 形式を使用する必要がある

`SKILL.md` の編集を続行：

```markdown
---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill

## When to Use

Load this skill when:
- Demonstrating instruction writing patterns
- Understanding imperative/infinitive form
- Learning SKILL.md format

## Instructions

To execute this skill:

1. Read the user's input
2. Process the data
3. Return the result

For detailed information, see references/guide.md
```

**ライティング規約**：

| ✅ 正しい書き方（imperative/infinitive） | ❌ 間違った書き方（二人称） |
|--- | ---|
| "To accomplish X, execute Y"        | "You should do X"          |
| "Load this skill when Z"            | "If you need Y"            |
| "See references/guide.md"           | "When you want Z"           |

::: tip 覚えておきたい 3 つの原則

**指示の書き方 3 原則**：
1. **動詞から始める**："Create" → "Use" → "Return"
2. **"You" を省略**："You should" は言わない
3. **パスを明確に**：リソースを参照する際は `references/` から始める

:::

---

### ステップ 4：Bundled Resources の追加（オプション）

**理由**：スキルに大量の詳細ドキュメントや実行可能なスクリプトが必要な場合、bundled resources を使用して SKILL.md を簡潔に保つ

#### 4.1 references/ の追加

```bash
mkdir references
```

`references/api-docs.md` を作成：

```markdown
# API Documentation

## Overview

This section provides detailed API information...

## Endpoints

### GET /api/data

Returns processed data.

Response:
```json
{
  "status": "success",
  "data": [...]
}
```
```

`SKILL.md` で参照：

```markdown
## Instructions

To fetch data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format
3. Process the result
```

#### 4.2 scripts/ の追加

```bash
mkdir scripts
```

`scripts/process.py` を作成：

```python
#!/usr/bin/env python3
import sys

def main():
    # Processing logic
    print("Processing complete")

if __name__ == "__main__":
    main()
```

`SKILL.md` で参照：

```markdown
## Instructions

To process data:

1. Execute the script:
   ```bash
   python scripts/process.py
   ```
2. Review the output
```

::: info scripts/ の利点

- **コンテキストにロードされない**：トークンを節約し、大きなファイルに適している
- **独立して実行可能**：AI エージェントは内容を先にロードせずに直接呼び出せる
- **決定論的タスクに適している**：データ変換、フォーマット、生成など

:::

#### 4.3 assets/ の追加

```bash
mkdir assets
```

テンプレートファイル `assets/template.json` を追加：

```json
{
  "title": "{{ title }}",
  "content": "{{ content }}"
}
```

`SKILL.md` で参照：

```markdown
## Instructions

To generate output:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
```

---

### ステップ 5：SKILL.md 形式の検証

**理由**：インストール前に形式を検証し、エラーを回避する

```bash
npx openskills install ./my-skill
```

**確認すべきこと**：

```
✔ Found skill: my-skill
  Description: Use this skill to demonstrate how to write proper instructions.
  Size: 1.2 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

スキルを選択して Enter キーを押すと、以下が表示されるはず：

```
✔ Installing my-skill...
✔ Skill installed successfully to .claude/skills/my-skill

Next steps:
  Run: npx openskills sync
  Then: Ask your AI agent to use the skill
```

::: tip 検証チェックリスト

インストール前に、以下の項目を確認してください：

- [ ] SKILL.md が `---` で始まっている
- [ ] `name` と `description` フィールドが含まれている
- [ ] `name` がハイフン形式を使用している（`my_skill` ではなく `my-skill`）
- [ ] `description` が 1-2 文の概要になっている
- [ ] 指示が imperative/infinitive 形式を使用している
- [ ] すべての `references/`、`scripts/`、`assets/` の参照パスが正しい

:::

---

### ステップ 6：AGENTS.md への同期

**理由**：AI エージェントにこのスキルが利用可能であることを知らせる

```bash
npx openskills sync
```

**確認すべきこと**：

```
✔ Found 1 skill:
  ☑ my-skill

✔ Syncing to AGENTS.md...
✔ Updated AGENTS.md successfully
```

生成された `AGENTS.md` を確認：

```markdown
<!-- SKILLS_SYSTEM_START -->
...
<available_skills>
  <skill name="my-skill">Use this skill to demonstrate how to write proper instructions.</skill>
</available_skills>
...
<!-- SKILLS_SYSTEM_END -->
```

---

### ステップ 7：スキルロードのテスト

**理由**：スキルが AI コンテキストに正しくロードできることを検証する

```bash
npx openskills read my-skill
```

**確認すべきこと**：

```
Loading skill: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill
... (完全な SKILL.md 内容)
```

## チェックポイント ✅

以上の手順を完了したら、以下を確認してください：

- ✅ SKILL.md を含むスキルディレクトリを作成した
- ✅ SKILL.md に正しい YAML frontmatter と Markdown 内容が含まれている
- ✅ スキルが `.claude/skills/` に正常にインストールされた
- ✅ スキルが AGENTS.md に同期されている
- ✅ `openskills read` でスキル内容をロードできる

## よくある問題と解決方法

### 問題 1：インストール時に "Invalid SKILL.md (missing YAML frontmatter)" エラー

**原因**：SKILL.md が `---` で始まっていない

**解決方法**：ファイルの 1 行目が `---` であることを確認。`# My Skill` やその他の内容で始まっていないか確認

---

### 問題 2：AI エージェントがスキルを認識しない

**原因**：`openskills sync` が実行されていない、または AGENTS.md が更新されていない

**解決方法**：`npx openskills sync` を実行し、AGENTS.md にスキルエントリが含まれていることを確認

---

### 問題 3：リソースパスの解決エラー

**原因**：SKILL.md で絶対パスまたは誤った相対パスを使用している

**解決方法**：
- ✅ 正しい：`references/api-docs.md`（相対パス）
- ❌ 誤り：`/path/to/skill/references/api-docs.md`（絶対パス）
- ❌ 誤り：`../other-skill/references/api-docs.md`（スキル間参照）

---

### 問題 4：SKILL.md が長すぎてトークン制限を超える

**原因**：SKILL.md が 5000 ワードを超えている、または大量の詳細ドキュメントを含んでいる

**解決方法**：詳細な内容を `references/` ディレクトリに移動し、SKILL.md で参照する

## レッスンのまとめ

カスタムスキルを作成する核心ステップ：

1. **ディレクトリ構造の作成**：最小構成（SKILL.md のみ）または完全構成（references/、scripts/、assets/ を含む）
2. **YAML frontmatter の記述**：必須フィールド `name`（ハイフン形式）と `description`（1-2 文）
3. **指示内容の作成**：imperative/infinitive 形式を使用し、二人称を避ける
4. **リソースの追加**（オプション）：references/、scripts/、assets/
5. **形式の検証**：`openskills install ./my-skill` を使用して検証
6. **AGENTS.md への同期**：`openskills sync` を実行して AI エージェントに知らせる
7. **ロードのテスト**：`openskills read my-skill` を使用して検証

## 次のレッスン予告

> 次のレッスンでは **[スキル構造の詳細](../skill-structure/)** を学びます。
>
> 学べること：
> - SKILL.md の完全なフィールド説明
> - references/、scripts/、assets/ のベストプラクティス
> - スキルの可読性と保守性を最適化する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソース位置を表示</strong></summary>

> 最終更新：2026-01-24

| 機能           | ファイルパス                                                                 | 行番号    |
|--- | --- | ---|
| YAML frontmatter 検証 | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14   |
| YAML フィールド抽出  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7     |
| インストール時の形式検証  | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |
| スキル名抽出    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 344-345 |

**サンプルスキルファイル**：
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - 最小構成のサンプル
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - 形式規約の参照

**主要関数**：
- `hasValidFrontmatter(content: string): boolean` - SKILL.md が `---` で始まっているか検証
- `extractYamlField(content: string, field: string): string` - YAML フィールド値を抽出（非貪欲マッチ）

</details>
